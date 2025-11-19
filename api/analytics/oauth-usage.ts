import type { VercelRequest, VercelResponse } from '@vercel/node'
import { kv } from '@vercel/kv'

/**
 * OAuth Usage Analytics Endpoint
 *
 * Provides metrics and statistics about OAuth usage:
 * - Active sessions count
 * - Login/logout events
 * - Rate limit usage
 * - User engagement
 *
 * Endpoint: GET /api/analytics/oauth-usage
 *
 * Query Parameters:
 * - period: 'hour' | 'day' | 'week' | 'month' (default: 'day')
 * - detailed: 'true' | 'false' (default: 'false')
 *
 * Response:
 * {
 *   period: string
 *   timestamp: number
 *   metrics: {
 *     activeSessions: number
 *     totalLogins: number
 *     totalLogouts: number
 *     uniqueUsers: number
 *     avgSessionDuration: number
 *     rateLimit: {
 *       avgUsage: number
 *       peakUsage: number
 *       avgRemaining: number
 *     }
 *   }
 *   detailed?: {
 *     sessions: Session[]
 *     timeline: TimelineEntry[]
 *   }
 * }
 */

interface Session {
  sessionId: string
  userId: number
  login: string
  createdAt: number
  lastActivity?: number
}

interface TimelineEntry {
  timestamp: number
  event: 'login' | 'logout' | 'api_call'
  userId?: number
  login?: string
  details?: Record<string, unknown>
}

interface OAuthMetrics {
  period: string
  timestamp: number
  metrics: {
    activeSessions: number
    totalLogins: number
    totalLogouts: number
    uniqueUsers: number
    avgSessionDuration: number
    rateLimit: {
      avgUsage: number
      peakUsage: number
      avgRemaining: number
    }
  }
  detailed?: {
    sessions: Session[]
    timeline: TimelineEntry[]
  }
}

/**
 * Get time range in milliseconds for the specified period
 */
function getPeriodMs(period: string): number {
  switch (period) {
    case 'hour':
      return 3600000 // 1 hour
    case 'day':
      return 86400000 // 24 hours
    case 'week':
      return 604800000 // 7 days
    case 'month':
      return 2592000000 // 30 days
    default:
      return 86400000 // default to day
  }
}

/**
 * Get all active sessions from Vercel KV
 */
async function getActiveSessions(): Promise<Session[]> {
  if (!kv) {
    return []
  }

  try {
    // Scan for all session keys
    const sessions: Session[] = []
    let cursor = 0

    do {
      const result = await kv.scan(cursor, {
        match: 'session:*',
        count: 100,
      })

      cursor = result[0]
      const keys = result[1] as string[]

      // Fetch session data for each key
      for (const key of keys) {
        const sessionData = await kv.get<{
          userId: number
          login: string
          accessToken: string
          avatarUrl: string
          createdAt: number
          lastActivity?: number
        }>(key)

        if (sessionData) {
          sessions.push({
            sessionId: key.replace('session:', ''),
            userId: sessionData.userId,
            login: sessionData.login,
            createdAt: sessionData.createdAt,
            lastActivity: sessionData.lastActivity,
          })
        }
      }
    } while (cursor !== 0)

    return sessions
  } catch (error) {
    console.error('Error fetching active sessions:', error)
    return []
  }
}

/**
 * Get OAuth events from analytics store
 */
async function getOAuthEvents(
  periodMs: number
): Promise<{ logins: number; logouts: number; timeline: TimelineEntry[] }> {
  if (!kv) {
    return { logins: 0, logouts: 0, timeline: [] }
  }

  try {
    const now = Date.now()
    const startTime = now - periodMs

    // Get login events
    const loginEvents = (await kv.zrange('analytics:oauth:logins', startTime, now, {
      byScore: true,
    })) as string[]

    // Get logout events
    const logoutEvents = (await kv.zrange('analytics:oauth:logouts', startTime, now, {
      byScore: true,
    })) as string[]

    // Parse timeline
    const timeline: TimelineEntry[] = []

    for (const event of loginEvents) {
      try {
        const data = JSON.parse(event)
        timeline.push({
          timestamp: data.timestamp,
          event: 'login',
          userId: data.userId,
          login: data.login,
        })
      } catch {
        // Skip invalid events
      }
    }

    for (const event of logoutEvents) {
      try {
        const data = JSON.parse(event)
        timeline.push({
          timestamp: data.timestamp,
          event: 'logout',
          userId: data.userId,
          login: data.login,
        })
      } catch {
        // Skip invalid events
      }
    }

    // Sort timeline by timestamp
    timeline.sort((a, b) => a.timestamp - b.timestamp)

    return {
      logins: loginEvents.length,
      logouts: logoutEvents.length,
      timeline,
    }
  } catch (error) {
    console.error('Error fetching OAuth events:', error)
    return { logins: 0, logouts: 0, timeline: [] }
  }
}

/**
 * Calculate average session duration
 */
function calculateAvgSessionDuration(sessions: Session[]): number {
  if (sessions.length === 0) {
    return 0
  }

  const now = Date.now()
  const durations = sessions.map((session) => {
    const lastActivity = session.lastActivity || now
    return lastActivity - session.createdAt
  })

  const total = durations.reduce((sum, duration) => sum + duration, 0)
  return Math.round(total / durations.length)
}

/**
 * Get rate limit statistics
 */
async function getRateLimitStats(
  periodMs: number
): Promise<{ avgUsage: number; peakUsage: number; avgRemaining: number }> {
  if (!kv) {
    return { avgUsage: 0, peakUsage: 0, avgRemaining: 5000 }
  }

  try {
    const now = Date.now()
    const startTime = now - periodMs

    // Get rate limit snapshots
    const snapshots = (await kv.zrange('analytics:ratelimit', startTime, now, {
      byScore: true,
    })) as string[]

    if (snapshots.length === 0) {
      return { avgUsage: 0, peakUsage: 0, avgRemaining: 5000 }
    }

    let totalUsage = 0
    let totalRemaining = 0
    let peakUsage = 0

    for (const snapshot of snapshots) {
      try {
        const data = JSON.parse(snapshot)
        const usage = data.used || 0
        const remaining = data.remaining || 5000

        totalUsage += usage
        totalRemaining += remaining
        peakUsage = Math.max(peakUsage, usage)
      } catch {
        // Skip invalid snapshots
      }
    }

    return {
      avgUsage: Math.round(totalUsage / snapshots.length),
      peakUsage,
      avgRemaining: Math.round(totalRemaining / snapshots.length),
    }
  } catch (error) {
    console.error('Error fetching rate limit stats:', error)
    return { avgUsage: 0, peakUsage: 0, avgRemaining: 5000 }
  }
}

/**
 * Main handler
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // Check if KV is available
  if (!kv) {
    return res.status(503).json({
      error: 'Analytics service unavailable',
      message: 'Vercel KV is not configured',
    })
  }

  try {
    // Parse query parameters
    const period = (req.query.period as string) || 'day'
    const detailed = req.query.detailed === 'true'

    // Validate period
    const validPeriods = ['hour', 'day', 'week', 'month']
    if (!validPeriods.includes(period)) {
      return res.status(400).json({
        error: 'Invalid period',
        message: 'Period must be one of: hour, day, week, month',
      })
    }

    const periodMs = getPeriodMs(period)

    // Fetch data in parallel
    const [sessions, events, rateLimitStats] = await Promise.all([
      getActiveSessions(),
      getOAuthEvents(periodMs),
      getRateLimitStats(periodMs),
    ])

    // Calculate unique users
    const uniqueUserIds = new Set(sessions.map((s) => s.userId))
    const uniqueUsers = uniqueUserIds.size

    // Calculate average session duration
    const avgSessionDuration = calculateAvgSessionDuration(sessions)

    // Build response
    const metrics: OAuthMetrics = {
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
    }

    // Add detailed data if requested
    if (detailed) {
      metrics.detailed = {
        sessions: sessions.map((s) => ({
          sessionId: s.sessionId.substring(0, 8) + '...', // Truncate for privacy
          userId: s.userId,
          login: s.login,
          createdAt: s.createdAt,
          lastActivity: s.lastActivity,
        })),
        timeline: events.timeline,
      }
    }

    // Set cache headers (cache for 5 minutes)
    res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600')

    return res.status(200).json(metrics)
  } catch (error) {
    console.error('OAuth analytics error:', error)
    return res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
    })
  }
}
