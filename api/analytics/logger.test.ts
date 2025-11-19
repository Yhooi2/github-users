import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { kv } from '@vercel/kv'
import {
  logOAuthLogin,
  logOAuthLogout,
  logRateLimitSnapshot,
  updateSessionActivity,
  cleanupOldAnalytics,
  type OAuthLoginEvent,
  type OAuthLogoutEvent,
  type RateLimitSnapshot,
} from './logger'

// Mock @vercel/kv
vi.mock('@vercel/kv', () => ({
  kv: {
    zadd: vi.fn(),
    expire: vi.fn(),
    get: vi.fn(),
    set: vi.fn(),
    zremrangebyscore: vi.fn(),
  },
}))

describe('Analytics Logger', () => {
  // Mock console to avoid noise in test output
  const originalConsoleLog = console.log
  const originalConsoleWarn = console.warn
  const originalConsoleError = console.error

  beforeEach(() => {
    vi.clearAllMocks()
    console.log = vi.fn()
    console.warn = vi.fn()
    console.error = vi.fn()
  })

  afterEach(() => {
    console.log = originalConsoleLog
    console.warn = originalConsoleWarn
    console.error = originalConsoleError
  })

  describe('logOAuthLogin', () => {
    const mockEvent: OAuthLoginEvent = {
      timestamp: 1700000000000,
      userId: 12345,
      login: 'testuser',
      sessionId: 'session123',
    }

    it('should successfully log OAuth login event', async () => {
      vi.mocked(kv.zadd).mockResolvedValue(1)
      vi.mocked(kv.expire).mockResolvedValue(1)

      await logOAuthLogin(mockEvent)

      // Verify zadd was called with correct parameters
      expect(kv.zadd).toHaveBeenCalledWith('analytics:oauth:logins', {
        score: mockEvent.timestamp,
        member: JSON.stringify({
          timestamp: mockEvent.timestamp,
          userId: mockEvent.userId,
          login: mockEvent.login,
          sessionId: mockEvent.sessionId,
        }),
      })

      // Verify expiry was set to 30 days
      expect(kv.expire).toHaveBeenCalledWith('analytics:oauth:logins', 2592000)

      // Verify success log
      expect(console.log).toHaveBeenCalledWith(
        `OAuth login logged: ${mockEvent.login} (${mockEvent.userId})`
      )
    })

    it('should handle KV errors gracefully', async () => {
      const error = new Error('KV connection timeout')
      vi.mocked(kv.zadd).mockRejectedValue(error)

      await logOAuthLogin(mockEvent)

      // Should not throw
      expect(console.error).toHaveBeenCalledWith('Failed to log OAuth login:', error)
    })

    it('should handle zadd success but expire failure', async () => {
      vi.mocked(kv.zadd).mockResolvedValue(1)
      vi.mocked(kv.expire).mockRejectedValue(new Error('Expire failed'))

      await logOAuthLogin(mockEvent)

      // zadd should succeed
      expect(kv.zadd).toHaveBeenCalled()

      // Error should be logged
      expect(console.error).toHaveBeenCalledWith(
        'Failed to log OAuth login:',
        expect.any(Error)
      )
    })
  })

  describe('logOAuthLogout', () => {
    const mockEvent: OAuthLogoutEvent = {
      timestamp: 1700000000000,
      userId: 12345,
      login: 'testuser',
      sessionId: 'session123',
    }

    it('should successfully log OAuth logout event', async () => {
      vi.mocked(kv.zadd).mockResolvedValue(1)
      vi.mocked(kv.expire).mockResolvedValue(1)

      await logOAuthLogout(mockEvent)

      // Verify zadd was called with correct parameters
      expect(kv.zadd).toHaveBeenCalledWith('analytics:oauth:logouts', {
        score: mockEvent.timestamp,
        member: JSON.stringify({
          timestamp: mockEvent.timestamp,
          userId: mockEvent.userId,
          login: mockEvent.login,
          sessionId: mockEvent.sessionId,
        }),
      })

      // Verify expiry was set to 30 days
      expect(kv.expire).toHaveBeenCalledWith('analytics:oauth:logouts', 2592000)

      // Verify success log
      expect(console.log).toHaveBeenCalledWith(
        `OAuth logout logged: ${mockEvent.login} (${mockEvent.userId})`
      )
    })

    it('should handle KV errors gracefully', async () => {
      const error = new Error('KV write failed')
      vi.mocked(kv.zadd).mockRejectedValue(error)

      await logOAuthLogout(mockEvent)

      expect(console.error).toHaveBeenCalledWith('Failed to log OAuth logout:', error)
    })
  })

  describe('logRateLimitSnapshot', () => {
    const mockSnapshot: RateLimitSnapshot = {
      timestamp: 1700000000000,
      remaining: 4500,
      limit: 5000,
      used: 500,
      isDemo: false,
      userLogin: 'testuser',
    }

    it('should successfully log rate limit snapshot', async () => {
      vi.mocked(kv.zadd).mockResolvedValue(1)
      vi.mocked(kv.expire).mockResolvedValue(1)

      await logRateLimitSnapshot(mockSnapshot)

      // Verify zadd was called with correct parameters
      expect(kv.zadd).toHaveBeenCalledWith('analytics:ratelimit', {
        score: mockSnapshot.timestamp,
        member: JSON.stringify({
          timestamp: mockSnapshot.timestamp,
          remaining: mockSnapshot.remaining,
          limit: mockSnapshot.limit,
          used: mockSnapshot.used,
          isDemo: mockSnapshot.isDemo,
          userLogin: mockSnapshot.userLogin,
        }),
      })

      // Verify expiry was set to 7 days
      expect(kv.expire).toHaveBeenCalledWith('analytics:ratelimit', 604800)
    })

    it('should handle demo mode snapshot', async () => {
      vi.mocked(kv.zadd).mockResolvedValue(1)
      vi.mocked(kv.expire).mockResolvedValue(1)

      const demoSnapshot: RateLimitSnapshot = {
        timestamp: 1700000000000,
        remaining: 4500,
        limit: 5000,
        used: 500,
        isDemo: true,
      }

      await logRateLimitSnapshot(demoSnapshot)

      expect(kv.zadd).toHaveBeenCalledWith('analytics:ratelimit', {
        score: demoSnapshot.timestamp,
        member: expect.stringContaining('"isDemo":true'),
      })
    })

    it('should handle KV errors gracefully', async () => {
      const error = new Error('KV zadd failed')
      vi.mocked(kv.zadd).mockRejectedValue(error)

      await logRateLimitSnapshot(mockSnapshot)

      expect(console.error).toHaveBeenCalledWith(
        'Failed to log rate limit snapshot:',
        error
      )
    })
  })

  describe('updateSessionActivity', () => {
    const mockSessionId = 'session123'
    const mockSession = {
      userId: 12345,
      login: 'testuser',
      accessToken: 'token123',
      avatarUrl: 'https://example.com/avatar.png',
      createdAt: 1699900000000,
      lastActivity: 1699950000000,
    }

    beforeEach(() => {
      // Mock Date.now() for consistent testing
      vi.spyOn(Date, 'now').mockReturnValue(1700000000000)
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('should successfully update session activity', async () => {
      vi.mocked(kv.get).mockResolvedValue(mockSession)
      vi.mocked(kv.set).mockResolvedValue('OK')

      await updateSessionActivity(mockSessionId)

      // Verify session was retrieved
      expect(kv.get).toHaveBeenCalledWith(`session:${mockSessionId}`)

      // Verify session was updated with new lastActivity
      expect(kv.set).toHaveBeenCalledWith(
        `session:${mockSessionId}`,
        {
          ...mockSession,
          lastActivity: 1700000000000, // Date.now() mock
        },
        { ex: 2592000 } // 30 days TTL
      )
    })

    it('should handle session not found', async () => {
      vi.mocked(kv.get).mockResolvedValue(null)

      await updateSessionActivity(mockSessionId)

      // get should be called
      expect(kv.get).toHaveBeenCalledWith(`session:${mockSessionId}`)

      // set should NOT be called
      expect(kv.set).not.toHaveBeenCalled()
    })

    it('should handle KV get errors gracefully', async () => {
      const error = new Error('KV get failed')
      vi.mocked(kv.get).mockRejectedValue(error)

      await updateSessionActivity(mockSessionId)

      expect(console.error).toHaveBeenCalledWith(
        'Failed to update session activity:',
        error
      )
    })

    it('should handle KV set errors gracefully', async () => {
      vi.mocked(kv.get).mockResolvedValue(mockSession)
      vi.mocked(kv.set).mockRejectedValue(new Error('KV set failed'))

      await updateSessionActivity(mockSessionId)

      expect(console.error).toHaveBeenCalledWith(
        'Failed to update session activity:',
        expect.any(Error)
      )
    })
  })

  describe('cleanupOldAnalytics', () => {
    beforeEach(() => {
      // Mock Date.now() to a known value
      vi.spyOn(Date, 'now').mockReturnValue(1700000000000)
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('should successfully cleanup old analytics data', async () => {
      vi.mocked(kv.zremrangebyscore).mockResolvedValue(5)

      await cleanupOldAnalytics()

      const now = 1700000000000
      const thirtyDaysAgo = now - 2592000000
      const sevenDaysAgo = now - 604800000

      // Verify old login events removed (30 days)
      expect(kv.zremrangebyscore).toHaveBeenCalledWith(
        'analytics:oauth:logins',
        0,
        thirtyDaysAgo
      )

      // Verify old logout events removed (30 days)
      expect(kv.zremrangebyscore).toHaveBeenCalledWith(
        'analytics:oauth:logouts',
        0,
        thirtyDaysAgo
      )

      // Verify old rate limit snapshots removed (7 days)
      expect(kv.zremrangebyscore).toHaveBeenCalledWith(
        'analytics:ratelimit',
        0,
        sevenDaysAgo
      )

      // Verify completion log
      expect(console.log).toHaveBeenCalledWith('Analytics cleanup completed')
    })

    it('should handle KV errors gracefully', async () => {
      const error = new Error('KV cleanup failed')
      vi.mocked(kv.zremrangebyscore).mockRejectedValue(error)

      await cleanupOldAnalytics()

      expect(console.error).toHaveBeenCalledWith(
        'Failed to cleanup old analytics:',
        error
      )
    })

    it('should handle partial cleanup failures', async () => {
      // First call succeeds, second fails
      vi.mocked(kv.zremrangebyscore)
        .mockResolvedValueOnce(5)
        .mockRejectedValueOnce(new Error('Second cleanup failed'))

      await cleanupOldAnalytics()

      // Error should be logged
      expect(console.error).toHaveBeenCalledWith(
        'Failed to cleanup old analytics:',
        expect.any(Error)
      )
    })
  })

  describe('Edge Cases', () => {
    it('should handle very large timestamps', async () => {
      vi.mocked(kv.zadd).mockResolvedValue(1)
      vi.mocked(kv.expire).mockResolvedValue(1)

      const largeTimestamp = Number.MAX_SAFE_INTEGER

      await logOAuthLogin({
        timestamp: largeTimestamp,
        userId: 12345,
        login: 'testuser',
        sessionId: 'session123',
      })

      expect(kv.zadd).toHaveBeenCalledWith('analytics:oauth:logins', {
        score: largeTimestamp,
        member: expect.stringContaining(String(largeTimestamp)),
      })
    })

    it('should handle special characters in usernames', async () => {
      vi.mocked(kv.zadd).mockResolvedValue(1)
      vi.mocked(kv.expire).mockResolvedValue(1)

      const specialUsername = 'user-with_special.chars@123'

      await logOAuthLogin({
        timestamp: 1700000000000,
        userId: 12345,
        login: specialUsername,
        sessionId: 'session123',
      })

      expect(kv.zadd).toHaveBeenCalledWith('analytics:oauth:logins', {
        score: 1700000000000,
        member: expect.stringContaining(specialUsername),
      })
    })

    it('should handle zero values in rate limit snapshot', async () => {
      vi.mocked(kv.zadd).mockResolvedValue(1)
      vi.mocked(kv.expire).mockResolvedValue(1)

      await logRateLimitSnapshot({
        timestamp: 1700000000000,
        remaining: 0,
        limit: 5000,
        used: 5000,
        isDemo: true,
      })

      expect(kv.zadd).toHaveBeenCalledWith('analytics:ratelimit', {
        score: 1700000000000,
        member: expect.stringContaining('"remaining":0'),
      })
    })
  })
})
