import type { VercelRequest, VercelResponse } from '@vercel/node'
import { kv } from '@vercel/kv'

/**
 * User settings structure
 */
export interface UserSettings {
  userId: number
  login: string
  preferences: {
    defaultAnalyticsPeriod?: 'hour' | 'day' | 'week' | 'month'
    defaultView?: 'card' | 'table'
    itemsPerPage?: number
    emailNotifications?: boolean
    autoRefreshDashboard?: boolean
    refreshInterval?: number
  }
  createdAt: number
  updatedAt: number
}

/**
 * Default settings for new users
 */
const DEFAULT_SETTINGS: Omit<UserSettings, 'userId' | 'login' | 'createdAt' | 'updatedAt'> = {
  preferences: {
    defaultAnalyticsPeriod: 'day',
    defaultView: 'card',
    itemsPerPage: 10,
    emailNotifications: false,
    autoRefreshDashboard: false,
    refreshInterval: 30000,
  },
}

/**
 * Extract session ID from cookie header
 */
function extractSessionFromCookie(cookieHeader: string | undefined): string | null {
  if (!cookieHeader) return null

  const cookies = cookieHeader.split(';').map((c) => c.trim())
  const sessionCookie = cookies.find((c) => c.startsWith('session='))

  return sessionCookie ? sessionCookie.split('=')[1] : null
}

/**
 * Get user info from session
 */
async function getUserFromSession(sessionId: string): Promise<{
  userId: number
  login: string
} | null> {
  if (!kv) {
    return null
  }

  try {
    const session = await kv.get<{
      userId: number
      login: string
      accessToken: string
      avatarUrl: string
      createdAt: number
    }>(`session:${sessionId}`)

    if (!session) {
      return null
    }

    return {
      userId: session.userId,
      login: session.login,
    }
  } catch (error) {
    console.error('Failed to get user from session:', error)
    return null
  }
}

/**
 * User Settings API Endpoint
 *
 * Handles user preferences and settings:
 * - GET: Retrieve user settings
 * - PUT/PATCH: Update user settings
 *
 * Endpoint: /api/user/settings
 *
 * Authentication: Requires valid session cookie
 *
 * Response (GET):
 * {
 *   userId: number
 *   login: string
 *   preferences: {
 *     defaultAnalyticsPeriod: 'hour' | 'day' | 'week' | 'month'
 *     defaultView: 'card' | 'table'
 *     itemsPerPage: number
 *     emailNotifications: boolean
 *     autoRefreshDashboard: boolean
 *     refreshInterval: number
 *   }
 *   createdAt: number
 *   updatedAt: number
 * }
 *
 * Request Body (PUT/PATCH):
 * {
 *   preferences: {
 *     defaultAnalyticsPeriod?: 'hour' | 'day' | 'week' | 'month'
 *     defaultView?: 'card' | 'table'
 *     itemsPerPage?: number
 *     emailNotifications?: boolean
 *     autoRefreshDashboard?: boolean
 *     refreshInterval?: number
 *   }
 * }
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Check if KV is available
  if (!kv) {
    return res.status(503).json({
      error: 'Service unavailable',
      message: 'User settings service is not configured',
    })
  }

  // Extract session and verify authentication
  const sessionId = extractSessionFromCookie(req.headers.cookie)

  if (!sessionId) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'No valid session found. Please sign in.',
    })
  }

  const user = await getUserFromSession(sessionId)

  if (!user) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Invalid or expired session. Please sign in again.',
    })
  }

  const settingsKey = `user:${user.userId}:settings`

  try {
    // GET: Retrieve user settings
    if (req.method === 'GET') {
      let settings = await kv.get<UserSettings>(settingsKey)

      // If no settings exist, create defaults
      if (!settings) {
        const now = Date.now()
        settings = {
          userId: user.userId,
          login: user.login,
          ...DEFAULT_SETTINGS,
          createdAt: now,
          updatedAt: now,
        }

        // Save default settings
        await kv.set(settingsKey, settings, { ex: 2592000 }) // 30 days TTL
      }

      return res.status(200).json(settings)
    }

    // PUT/PATCH: Update user settings
    if (req.method === 'PUT' || req.method === 'PATCH') {
      const { preferences } = req.body

      if (!preferences || typeof preferences !== 'object') {
        return res.status(400).json({
          error: 'Bad request',
          message: 'Invalid request body. Expected { preferences: {...} }',
        })
      }

      // Get existing settings or use defaults
      let existingSettings = await kv.get<UserSettings>(settingsKey)
      const now = Date.now()

      if (!existingSettings) {
        existingSettings = {
          userId: user.userId,
          login: user.login,
          ...DEFAULT_SETTINGS,
          createdAt: now,
          updatedAt: now,
        }
      }

      // Merge preferences (PATCH) or replace (PUT)
      const updatedPreferences =
        req.method === 'PATCH'
          ? {
              ...existingSettings.preferences,
              ...preferences,
            }
          : preferences

      // Validate preference values
      if (
        updatedPreferences.defaultAnalyticsPeriod &&
        !['hour', 'day', 'week', 'month'].includes(updatedPreferences.defaultAnalyticsPeriod)
      ) {
        return res.status(400).json({
          error: 'Bad request',
          message: 'Invalid defaultAnalyticsPeriod. Must be: hour, day, week, or month',
        })
      }

      if (
        updatedPreferences.defaultView &&
        !['card', 'table'].includes(updatedPreferences.defaultView)
      ) {
        return res.status(400).json({
          error: 'Bad request',
          message: 'Invalid defaultView. Must be: card or table',
        })
      }

      if (
        updatedPreferences.itemsPerPage &&
        (updatedPreferences.itemsPerPage < 1 || updatedPreferences.itemsPerPage > 100)
      ) {
        return res.status(400).json({
          error: 'Bad request',
          message: 'Invalid itemsPerPage. Must be between 1 and 100',
        })
      }

      if (
        updatedPreferences.refreshInterval &&
        (updatedPreferences.refreshInterval < 5000 || updatedPreferences.refreshInterval > 300000)
      ) {
        return res.status(400).json({
          error: 'Bad request',
          message: 'Invalid refreshInterval. Must be between 5000 (5s) and 300000 (5min)',
        })
      }

      // Update settings
      const updatedSettings: UserSettings = {
        ...existingSettings,
        preferences: updatedPreferences,
        updatedAt: now,
      }

      // Save to KV (30 days TTL)
      await kv.set(settingsKey, updatedSettings, { ex: 2592000 })

      console.log(`User settings updated: ${user.login} (${user.userId})`)

      return res.status(200).json(updatedSettings)
    }

    // DELETE: Reset settings to defaults
    if (req.method === 'DELETE') {
      await kv.del(settingsKey)

      console.log(`User settings deleted: ${user.login} (${user.userId})`)

      return res.status(204).send('')
    }

    // Method not allowed
    return res.status(405).json({
      error: 'Method not allowed',
      message: `Method ${req.method} is not supported. Use GET, PUT, PATCH, or DELETE.`,
    })
  } catch (error) {
    console.error('User settings error:', error)
    return res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
    })
  }
}
