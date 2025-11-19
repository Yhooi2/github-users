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

// Mock Vercel KV
vi.mock('@vercel/kv', () => ({
  kv: {
    zadd: vi.fn(),
    expire: vi.fn(),
    get: vi.fn(),
    set: vi.fn(),
    zremrangebyscore: vi.fn(),
  },
}))

describe('api/analytics/logger', () => {
  let consoleWarnSpy: ReturnType<typeof vi.spyOn>
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>
  let consoleLogSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    vi.clearAllMocks()
    consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
  })

  afterEach(() => {
    consoleWarnSpy.mockRestore()
    consoleErrorSpy.mockRestore()
    consoleLogSpy.mockRestore()
  })

  describe('logOAuthLogin', () => {
    const mockEvent: OAuthLoginEvent = {
      timestamp: 1234567890000,
      userId: 123,
      login: 'testuser',
      sessionId: 'session-abc-123',
    }

    it(
      'успешно логирует OAuth login в KV',
      async () => {
        vi.mocked(kv.zadd).mockResolvedValue(1)
        vi.mocked(kv.expire).mockResolvedValue(true)

        await logOAuthLogin(mockEvent)

        expect(kv.zadd).toHaveBeenCalledWith('analytics:oauth:logins', {
          score: mockEvent.timestamp,
          member: JSON.stringify({
            timestamp: mockEvent.timestamp,
            userId: mockEvent.userId,
            login: mockEvent.login,
            sessionId: mockEvent.sessionId,
          }),
        })
        expect(kv.expire).toHaveBeenCalledWith('analytics:oauth:logins', 2592000)
        expect(consoleLogSpy).toHaveBeenCalledWith(
          `OAuth login logged: ${mockEvent.login} (${mockEvent.userId})`
        )
      },
      10000
    )

    it(
      'устанавливает правильный TTL (30 дней = 2592000 секунд)',
      async () => {
        vi.mocked(kv.zadd).mockResolvedValue(1)
        vi.mocked(kv.expire).mockResolvedValue(true)

        await logOAuthLogin(mockEvent)

        expect(kv.expire).toHaveBeenCalledWith('analytics:oauth:logins', 2592000)
      },
      10000
    )

    it(
      'НЕ падает если zadd и expire оба выбрасывают exception',
      async () => {
        vi.mocked(kv.zadd).mockRejectedValue(new Error('KV timeout'))
        vi.mocked(kv.expire).mockRejectedValue(new Error('KV timeout'))

        await expect(logOAuthLogin(mockEvent)).resolves.not.toThrow()
        expect(consoleErrorSpy).toHaveBeenCalled()
      },
      10000
    )

    it(
      'логирует ошибку если zadd выбрасывает exception',
      async () => {
        const error = new Error('KV timeout')
        vi.mocked(kv.zadd).mockRejectedValue(error)

        await logOAuthLogin(mockEvent)

        expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to log OAuth login:', error)
      },
      10000
    )

    it(
      'логирует ошибку если expire выбрасывает exception',
      async () => {
        const error = new Error('KV connection lost')
        vi.mocked(kv.zadd).mockResolvedValue(1)
        vi.mocked(kv.expire).mockRejectedValue(error)

        await logOAuthLogin(mockEvent)

        expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to log OAuth login:', error)
      },
      10000
    )

    it(
      'корректно сериализует event с всеми полями',
      async () => {
        vi.mocked(kv.zadd).mockResolvedValue(1)
        vi.mocked(kv.expire).mockResolvedValue(true)

        await logOAuthLogin(mockEvent)

        const zaддCall = vi.mocked(kv.zadd).mock.calls[0]
        const serializedMember = zaддCall[1].member as string
        const parsed = JSON.parse(serializedMember)

        expect(parsed).toEqual({
          timestamp: mockEvent.timestamp,
          userId: mockEvent.userId,
          login: mockEvent.login,
          sessionId: mockEvent.sessionId,
        })
      },
      10000
    )
  })

  describe('logOAuthLogout', () => {
    const mockEvent: OAuthLogoutEvent = {
      timestamp: 1234567890000,
      userId: 456,
      login: 'logoutuser',
      sessionId: 'session-xyz-789',
    }

    it(
      'успешно логирует OAuth logout в KV',
      async () => {
        vi.mocked(kv.zadd).mockResolvedValue(1)
        vi.mocked(kv.expire).mockResolvedValue(true)

        await logOAuthLogout(mockEvent)

        expect(kv.zadd).toHaveBeenCalledWith('analytics:oauth:logouts', {
          score: mockEvent.timestamp,
          member: JSON.stringify({
            timestamp: mockEvent.timestamp,
            userId: mockEvent.userId,
            login: mockEvent.login,
            sessionId: mockEvent.sessionId,
          }),
        })
        expect(kv.expire).toHaveBeenCalledWith('analytics:oauth:logouts', 2592000)
        expect(consoleLogSpy).toHaveBeenCalledWith(
          `OAuth logout logged: ${mockEvent.login} (${mockEvent.userId})`
        )
      },
      10000
    )

    it(
      'НЕ падает если zadd и expire оба выбрасывают exception',
      async () => {
        vi.mocked(kv.zadd).mockRejectedValue(new Error('Connection lost'))
        vi.mocked(kv.expire).mockRejectedValue(new Error('Connection lost'))

        await expect(logOAuthLogout(mockEvent)).resolves.not.toThrow()
        expect(consoleErrorSpy).toHaveBeenCalled()
      },
      10000
    )

    it(
      'обрабатывает ошибку KV gracefully',
      async () => {
        const error = new Error('Network error')
        vi.mocked(kv.zadd).mockRejectedValue(error)

        await logOAuthLogout(mockEvent)

        expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to log OAuth logout:', error)
      },
      10000
    )
  })

  describe('logRateLimitSnapshot', () => {
    const mockSnapshot: RateLimitSnapshot = {
      timestamp: Date.now(),
      remaining: 4500,
      limit: 5000,
      used: 500,
      isDemo: false,
      userLogin: 'testuser',
    }

    it(
      'успешно логирует rate limit snapshot в KV',
      async () => {
        vi.mocked(kv.zadd).mockResolvedValue(1)
        vi.mocked(kv.expire).mockResolvedValue(true)

        await logRateLimitSnapshot(mockSnapshot)

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
      },
      10000
    )

    it(
      'устанавливает TTL 7 дней (604800 секунд) для rate limit данных',
      async () => {
        vi.mocked(kv.zadd).mockResolvedValue(1)
        vi.mocked(kv.expire).mockResolvedValue(true)

        await logRateLimitSnapshot(mockSnapshot)

        expect(kv.expire).toHaveBeenCalledWith('analytics:ratelimit', 604800)
      },
      10000
    )

    it(
      'НЕ падает если expire выбрасывает exception',
      async () => {
        vi.mocked(kv.zadd).mockResolvedValue(1)
        vi.mocked(kv.expire).mockRejectedValue(new Error('Expire failed'))

        await expect(logRateLimitSnapshot(mockSnapshot)).resolves.not.toThrow()
        expect(consoleErrorSpy).toHaveBeenCalled()
      },
      10000
    )

    it(
      'обрабатывает ошибку без предупреждения (silent fail)',
      async () => {
        const error = new Error('KV error')
        vi.mocked(kv.zadd).mockRejectedValue(error)

        await logRateLimitSnapshot(mockSnapshot)

        expect(consoleErrorSpy).toHaveBeenCalledWith(
          'Failed to log rate limit snapshot:',
          error
        )
      },
      10000
    )

    it(
      'корректно сериализует snapshot с demo mode',
      async () => {
        const demoSnapshot: RateLimitSnapshot = {
          ...mockSnapshot,
          isDemo: true,
          userLogin: undefined,
        }

        vi.mocked(kv.zadd).mockResolvedValue(1)
        vi.mocked(kv.expire).mockResolvedValue(true)

        await logRateLimitSnapshot(demoSnapshot)

        const zaaddCall = vi.mocked(kv.zadd).mock.calls[0]
        const serializedMember = zaaddCall[1].member as string
        const parsed = JSON.parse(serializedMember)

        expect(parsed.isDemo).toBe(true)
        expect(parsed.userLogin).toBeUndefined()
      },
      10000
    )
  })

  describe('updateSessionActivity', () => {
    const mockSessionId = 'session-test-123'
    const mockSession = {
      userId: 123,
      login: 'testuser',
      accessToken: 'token-abc',
      avatarUrl: 'https://github.com/avatar.png',
      createdAt: 1234567890000,
    }

    it(
      'успешно обновляет lastActivity для существующей сессии',
      async () => {
        const now = Date.now()
        vi.mocked(kv.get).mockResolvedValue(mockSession)
        vi.mocked(kv.set).mockResolvedValue('OK')

        await updateSessionActivity(mockSessionId)

        expect(kv.get).toHaveBeenCalledWith(`session:${mockSessionId}`)
        expect(kv.set).toHaveBeenCalledWith(
          `session:${mockSessionId}`,
          {
            ...mockSession,
            lastActivity: expect.any(Number),
          },
          { ex: 2592000 }
        )

        // Check that lastActivity is close to current time
        const setCall = vi.mocked(kv.set).mock.calls[0]
        const updatedSession = setCall[1] as typeof mockSession & { lastActivity: number }
        expect(updatedSession.lastActivity).toBeGreaterThanOrEqual(now)
        expect(updatedSession.lastActivity).toBeLessThanOrEqual(Date.now())
      },
      10000
    )

    it(
      'НЕ обновляет если сессия не найдена',
      async () => {
        vi.mocked(kv.get).mockResolvedValue(null)

        await updateSessionActivity(mockSessionId)

        expect(kv.get).toHaveBeenCalledWith(`session:${mockSessionId}`)
        expect(kv.set).not.toHaveBeenCalled()
      },
      10000
    )

    it(
      'сохраняет существующие поля сессии при обновлении',
      async () => {
        vi.mocked(kv.get).mockResolvedValue(mockSession)
        vi.mocked(kv.set).mockResolvedValue('OK')

        await updateSessionActivity(mockSessionId)

        const setCall = vi.mocked(kv.set).mock.calls[0]
        const updatedSession = setCall[1] as typeof mockSession
        expect(updatedSession.userId).toBe(mockSession.userId)
        expect(updatedSession.login).toBe(mockSession.login)
        expect(updatedSession.accessToken).toBe(mockSession.accessToken)
        expect(updatedSession.avatarUrl).toBe(mockSession.avatarUrl)
        expect(updatedSession.createdAt).toBe(mockSession.createdAt)
      },
      10000
    )

    it(
      'обрабатывает ошибку KV.get gracefully',
      async () => {
        const error = new Error('KV read error')
        vi.mocked(kv.get).mockRejectedValue(error)

        await updateSessionActivity(mockSessionId)

        expect(consoleErrorSpy).toHaveBeenCalledWith(
          'Failed to update session activity:',
          error
        )
      },
      10000
    )

    it(
      'обрабатывает ошибку KV.set gracefully',
      async () => {
        const error = new Error('KV write error')
        vi.mocked(kv.get).mockResolvedValue(mockSession)
        vi.mocked(kv.set).mockRejectedValue(error)

        await updateSessionActivity(mockSessionId)

        expect(consoleErrorSpy).toHaveBeenCalledWith(
          'Failed to update session activity:',
          error
        )
      },
      10000
    )
  })

  describe('cleanupOldAnalytics', () => {
    beforeEach(() => {
      vi.useFakeTimers()
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it(
      'удаляет OAuth login события старше 30 дней',
      async () => {
        const now = Date.now()
        vi.setSystemTime(now)

        vi.mocked(kv.zremrangebyscore).mockResolvedValue(5)

        await cleanupOldAnalytics()

        const thirtyDaysAgo = now - 2592000000 // 30 days in ms
        expect(kv.zremrangebyscore).toHaveBeenCalledWith(
          'analytics:oauth:logins',
          0,
          thirtyDaysAgo
        )
      },
      10000
    )

    it(
      'удаляет OAuth logout события старше 30 дней',
      async () => {
        const now = Date.now()
        vi.setSystemTime(now)

        vi.mocked(kv.zremrangebyscore).mockResolvedValue(3)

        await cleanupOldAnalytics()

        const thirtyDaysAgo = now - 2592000000
        expect(kv.zremrangebyscore).toHaveBeenCalledWith(
          'analytics:oauth:logouts',
          0,
          thirtyDaysAgo
        )
      },
      10000
    )

    it(
      'удаляет rate limit snapshots старше 7 дней',
      async () => {
        const now = Date.now()
        vi.setSystemTime(now)

        vi.mocked(kv.zremrangebyscore).mockResolvedValue(10)

        await cleanupOldAnalytics()

        const sevenDaysAgo = now - 604800000 // 7 days in ms
        expect(kv.zremrangebyscore).toHaveBeenCalledWith(
          'analytics:ratelimit',
          0,
          sevenDaysAgo
        )
      },
      10000
    )

    it(
      'вызывает все три cleanup операции',
      async () => {
        vi.mocked(kv.zremrangebyscore).mockResolvedValue(1)

        await cleanupOldAnalytics()

        expect(kv.zremrangebyscore).toHaveBeenCalledTimes(3)
        expect(kv.zremrangebyscore).toHaveBeenCalledWith(
          'analytics:oauth:logins',
          expect.any(Number),
          expect.any(Number)
        )
        expect(kv.zremrangebyscore).toHaveBeenCalledWith(
          'analytics:oauth:logouts',
          expect.any(Number),
          expect.any(Number)
        )
        expect(kv.zremrangebyscore).toHaveBeenCalledWith(
          'analytics:ratelimit',
          expect.any(Number),
          expect.any(Number)
        )
      },
      10000
    )

    it(
      'логирует успешное завершение cleanup',
      async () => {
        vi.mocked(kv.zremrangebyscore).mockResolvedValue(5)

        await cleanupOldAnalytics()

        expect(consoleLogSpy).toHaveBeenCalledWith('Analytics cleanup completed')
      },
      10000
    )

    it(
      'НЕ падает если одна из cleanup операций выбрасывает exception',
      async () => {
        vi.mocked(kv.zremrangebyscore)
          .mockResolvedValueOnce(5) // logins успех
          .mockRejectedValueOnce(new Error('KV error')) // logouts ошибка
          .mockResolvedValueOnce(3) // ratelimit успех

        await expect(cleanupOldAnalytics()).resolves.not.toThrow()
        expect(consoleErrorSpy).toHaveBeenCalledWith(
          'Failed to cleanup old analytics:',
          expect.any(Error)
        )
      },
      10000
    )

    it(
      'обрабатывает ошибку KV gracefully',
      async () => {
        const error = new Error('KV cleanup error')
        vi.mocked(kv.zremrangebyscore).mockRejectedValue(error)

        await cleanupOldAnalytics()

        expect(consoleErrorSpy).toHaveBeenCalledWith(
          'Failed to cleanup old analytics:',
          error
        )
      },
      10000
    )

    it(
      'использует правильные временные границы для 30-дневных данных',
      async () => {
        const fixedDate = new Date('2024-01-15T12:00:00Z').getTime()
        vi.setSystemTime(fixedDate)

        vi.mocked(kv.zremrangebyscore).mockResolvedValue(1)

        await cleanupOldAnalytics()

        const expectedThirtyDaysAgo = fixedDate - 2592000000 // 30 days in ms

        // Check login cleanup call
        const loginCall = vi.mocked(kv.zremrangebyscore).mock.calls.find(
          (call) => call[0] === 'analytics:oauth:logins'
        )
        expect(loginCall?.[2]).toBe(expectedThirtyDaysAgo)

        // Check logout cleanup call
        const logoutCall = vi.mocked(kv.zremrangebyscore).mock.calls.find(
          (call) => call[0] === 'analytics:oauth:logouts'
        )
        expect(logoutCall?.[2]).toBe(expectedThirtyDaysAgo)
      },
      10000
    )

    it(
      'использует правильную временную границу для 7-дневных данных',
      async () => {
        const fixedDate = new Date('2024-01-15T12:00:00Z').getTime()
        vi.setSystemTime(fixedDate)

        vi.mocked(kv.zremrangebyscore).mockResolvedValue(1)

        await cleanupOldAnalytics()

        const expectedSevenDaysAgo = fixedDate - 604800000 // 7 days in ms

        // Check rate limit cleanup call
        const rateLimitCall = vi.mocked(kv.zremrangebyscore).mock.calls.find(
          (call) => call[0] === 'analytics:ratelimit'
        )
        expect(rateLimitCall?.[2]).toBe(expectedSevenDaysAgo)
      },
      10000
    )
  })
})
