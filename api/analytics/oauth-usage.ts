import { kv } from "@vercel/kv";
import type { VercelRequest, VercelResponse } from "@vercel/node";

/**
 * OAuth Usage Analytics Endpoint
 * GET /api/analytics/oauth-usage
 *
 * Query parameters:
 *   - period: 'hour' | 'day' | 'week' | 'month' (default: 'day')
 *   - detailed: 'true' | 'false' (default: 'false') — includes full session list and timeline
 */
interface Session {
  sessionId: string;
  userId: number;
  login: string;
  createdAt: number;
  lastActivity?: number;
}

interface TimelineEntry {
  timestamp: number;
  event: "login" | "logout" | "api_call";
  userId?: number;
  login?: string;
  details?: Record<string, unknown>;
}

interface OAuthMetrics {
  period: string;
  timestamp: number;
  metrics: {
    activeSessions: number;
    totalLogins: number;
    totalLogouts: number;
    uniqueUsers: number;
    avgSessionDuration: number; // in milliseconds
    rateLimit: {
      avgUsage: number;
      peakUsage: number;
      avgRemaining: number;
    };
  };
  detailed?: {
    sessions: Session[];
    timeline: TimelineEntry[];
  };
}

/** Returns the duration of the selected period in milliseconds */
function getPeriodMs(period: string): number {
  switch (period) {
    case "hour":
      return 3_600_000; // 1 hour
    case "day":
      return 86_400_000; // 24 hours
    case "week":
      return 604_800_000; // 7 days
    case "month":
      return 2_592_000_000; // 30 days
    default:
      return 86_400_000; // fallback to day
  }
}

/** Fetch all currently active sessions from Vercel KV */
async function getActiveSessions(): Promise<Session[]> {
  if (!kv) return [];

  const sessions: Session[] = [];
  let cursor: string = "0";

  try {
    do {
      // In @vercel/kv ≥1.0+, scan returns [string, string[]]
      const [nextCursor, keys] = await kv.scan(cursor, {
        match: "session:*",
        count: 100,
      });

      cursor = nextCursor;

      for (const key of keys) {
        const sessionData = await kv.get<{
          userId: number;
          login: string;
          accessToken: string;
          avatarUrl: string;
          createdAt: number;
          lastActivity?: number;
        }>(key);

        if (sessionData) {
          sessions.push({
            sessionId: key.replace("session:", ""),
            userId: sessionData.userId,
            login: sessionData.login,
            createdAt: sessionData.createdAt,
            lastActivity: sessionData.lastActivity,
          });
        }
      }
    } while (cursor !== "0");

    return sessions;
  } catch (error) {
    console.error("Error fetching active sessions:", error);
    return [];
  }
}

/** Retrieve login/logout events for the selected time period */
async function getOAuthEvents(periodMs: number) {
  if (!kv) return { logins: 0, logouts: 0, timeline: [] };

  try {
    const now = Date.now();
    const startTime = now - periodMs;

    const loginEvents = (await kv.zrange(
      "analytics:oauth:logins",
      startTime,
      now,
      { byScore: true },
    )) as string[];

    const logoutEvents = (await kv.zrange(
      "analytics:oauth:logouts",
      startTime,
      now,
      { byScore: true },
    )) as string[];

    const timeline: TimelineEntry[] = [];

    for (const raw of loginEvents) {
      try {
        const data = JSON.parse(raw);
        timeline.push({
          timestamp: data.timestamp,
          event: "login",
          userId: data.userId,
          login: data.login,
        });
      } catch {
        // Skip malformed entries
      }
    }

    for (const raw of logoutEvents) {
      try {
        const data = JSON.parse(raw);
        timeline.push({
          timestamp: data.timestamp,
          event: "logout",
          userId: data.userId,
          login: data.login,
        });
      } catch {
        // Skip malformed entries
      }
    }

    timeline.sort((a, b) => a.timestamp - b.timestamp);

    return {
      logins: loginEvents.length,
      logouts: logoutEvents.length,
      timeline,
    };
  } catch (error) {
    console.error("Error fetching OAuth events:", error);
    return { logins: 0, logouts: 0, timeline: [] };
  }
}

/** Calculate average session duration in milliseconds */
function calculateAvgSessionDuration(sessions: Session[]): number {
  if (sessions.length === 0) return 0;

  const now = Date.now();
  const total = sessions.reduce((sum, s) => {
    const end = s.lastActivity || now;
    return sum + (end - s.createdAt);
  }, 0);

  return Math.round(total / sessions.length);
}

/** Gather rate-limit usage statistics over the period */
async function getRateLimitStats(periodMs: number) {
  if (!kv) return { avgUsage: 0, peakUsage: 0, avgRemaining: 5000 };

  try {
    const now = Date.now();
    const start = now - periodMs;

    const snapshots = (await kv.zrange("analytics:ratelimit", start, now, {
      byScore: true,
    })) as string[];

    if (snapshots.length === 0)
      return { avgUsage: 0, peakUsage: 0, avgRemaining: 5000 };

    let totalUsage = 0;
    let totalRemaining = 0;
    let peakUsage = 0;

    for (const raw of snapshots) {
      try {
        const data = JSON.parse(raw);
        const used = data.used ?? 0;
        const remaining = data.remaining ?? 5000;

        totalUsage += used;
        totalRemaining += remaining;
        if (used > peakUsage) peakUsage = used;
      } catch {
        // Skip malformed snapshots
      }
    }

    return {
      avgUsage: Math.round(totalUsage / snapshots.length),
      peakUsage,
      avgRemaining: Math.round(totalRemaining / snapshots.length),
    };
  } catch (error) {
    console.error("Error fetching rate limit stats:", error);
    return { avgUsage: 0, peakUsage: 0, avgRemaining: 5000 };
  }
}

/** Main request handler */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!kv) {
    return res.status(503).json({
      error: "Analytics service unavailable",
      message: "Vercel KV is not configured",
    });
  }

  try {
    const period = (req.query.period as string) || "day";
    const detailed = req.query.detailed === "true";

    const validPeriods = ["hour", "day", "week", "month"];
    if (!validPeriods.includes(period)) {
      return res
        .status(400)
        .json({
          error: "Invalid period",
          message: "Allowed values: hour, day, week, month",
        });
    }

    const periodMs = getPeriodMs(period);

    // Parallel data fetching for better performance
    const [sessions, events, rateLimitStats] = await Promise.all([
      getActiveSessions(),
      getOAuthEvents(periodMs),
      getRateLimitStats(periodMs),
    ]);

    const uniqueUsers = new Set(sessions.map((s) => s.userId)).size;
    const avgSessionDuration = calculateAvgSessionDuration(sessions);

    const response: OAuthMetrics = {
      period,
      timestamp: Date.now(),
      metrics: {
        activeSessions: sessions.length,
        totalLogins: events.logins,
        totalLogouts: events.logouts,
        uniqueUsers,
        avgSessionDuration,
        rateLimit: rateLimitStats,
      },
    };

    // Include detailed data only when explicitly requested (privacy + performance)
    if (detailed) {
      response.detailed = {
        sessions: sessions.map((s) => ({
          sessionId: s.sessionId.slice(0, 8) + "...", // Truncate for privacy
          userId: s.userId,
          login: s.login,
          createdAt: s.createdAt,
          lastActivity: s.lastActivity,
        })),
        timeline: events.timeline,
      };
    }

    // Cache publicly for 5 minutes, allow stale-while-revalidate for 10 min
    res.setHeader(
      "Cache-Control",
      "public, s-maxage=300, stale-while-revalidate=600",
    );

    return res.status(200).json(response);
  } catch (error) {
    console.error("OAuth analytics error:", error);
    return res.status(500).json({
      error: "Internal server error",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
