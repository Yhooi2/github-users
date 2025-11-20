import { kv } from "@vercel/kv";

/**
 * OAuth Analytics Logger
 *
 * Helper functions to log OAuth events to Vercel KV for analytics
 */

export interface OAuthLoginEvent {
  timestamp: number;
  userId: number;
  login: string;
  sessionId: string;
}

export interface OAuthLogoutEvent {
  timestamp: number;
  userId: number;
  login: string;
  sessionId: string;
}

export interface RateLimitSnapshot {
  timestamp: number;
  remaining: number;
  limit: number;
  used: number;
  isDemo: boolean;
  userLogin?: string;
}

/**
 * Log OAuth login event
 */
export async function logOAuthLogin(event: OAuthLoginEvent): Promise<void> {
  if (!kv) {
    console.warn("KV not available, skipping OAuth login logging");
    return;
  }

  try {
    const eventData = JSON.stringify({
      timestamp: event.timestamp,
      userId: event.userId,
      login: event.login,
      sessionId: event.sessionId,
    });

    // Store in sorted set by timestamp
    await kv.zadd("analytics:oauth:logins", {
      score: event.timestamp,
      member: eventData,
    });

    // Set expiry to 30 days
    await kv.expire("analytics:oauth:logins", 2592000);

    console.log(`OAuth login logged: ${event.login} (${event.userId})`);
  } catch (error) {
    console.error("Failed to log OAuth login:", error);
  }
}

/**
 * Log OAuth logout event
 */
export async function logOAuthLogout(event: OAuthLogoutEvent): Promise<void> {
  if (!kv) {
    console.warn("KV not available, skipping OAuth logout logging");
    return;
  }

  try {
    const eventData = JSON.stringify({
      timestamp: event.timestamp,
      userId: event.userId,
      login: event.login,
      sessionId: event.sessionId,
    });

    // Store in sorted set by timestamp
    await kv.zadd("analytics:oauth:logouts", {
      score: event.timestamp,
      member: eventData,
    });

    // Set expiry to 30 days
    await kv.expire("analytics:oauth:logouts", 2592000);

    console.log(`OAuth logout logged: ${event.login} (${event.userId})`);
  } catch (error) {
    console.error("Failed to log OAuth logout:", error);
  }
}

/**
 * Log rate limit snapshot
 */
export async function logRateLimitSnapshot(
  snapshot: RateLimitSnapshot,
): Promise<void> {
  if (!kv) {
    return;
  }

  try {
    const snapshotData = JSON.stringify({
      timestamp: snapshot.timestamp,
      remaining: snapshot.remaining,
      limit: snapshot.limit,
      used: snapshot.used,
      isDemo: snapshot.isDemo,
      userLogin: snapshot.userLogin,
    });

    // Store in sorted set by timestamp
    await kv.zadd("analytics:ratelimit", {
      score: snapshot.timestamp,
      member: snapshotData,
    });

    // Set expiry to 7 days (rate limit snapshots are more frequent)
    await kv.expire("analytics:ratelimit", 604800);
  } catch (error) {
    console.error("Failed to log rate limit snapshot:", error);
  }
}

/**
 * Update session last activity timestamp
 */
export async function updateSessionActivity(sessionId: string): Promise<void> {
  if (!kv) {
    return;
  }

  try {
    const key = `session:${sessionId}`;
    const session = await kv.get<{
      userId: number;
      login: string;
      accessToken: string;
      avatarUrl: string;
      createdAt: number;
      lastActivity?: number;
    }>(key);

    if (session) {
      await kv.set(
        key,
        {
          ...session,
          lastActivity: Date.now(),
        },
        { ex: 2592000 }, // 30 days TTL
      );
    }
  } catch (error) {
    console.error("Failed to update session activity:", error);
  }
}

/**
 * Clean up old analytics data
 * Should be called periodically (e.g., daily cron job)
 */
export async function cleanupOldAnalytics(): Promise<void> {
  if (!kv) {
    return;
  }

  try {
    const now = Date.now();
    const thirtyDaysAgo = now - 2592000000; // 30 days in ms

    // Remove old login events
    await kv.zremrangebyscore("analytics:oauth:logins", 0, thirtyDaysAgo);

    // Remove old logout events
    await kv.zremrangebyscore("analytics:oauth:logouts", 0, thirtyDaysAgo);

    // Remove old rate limit snapshots (keep only 7 days)
    const sevenDaysAgo = now - 604800000;
    await kv.zremrangebyscore("analytics:ratelimit", 0, sevenDaysAgo);

    console.log("Analytics cleanup completed");
  } catch (error) {
    console.error("Failed to cleanup old analytics:", error);
  }
}
