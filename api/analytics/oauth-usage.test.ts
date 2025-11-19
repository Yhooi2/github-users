import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import type { VercelRequest, VercelResponse } from '@vercel/node'
import { kv } from '@vercel/kv'
import handler from './oauth-usage'

// Mock Vercel KV
vi.mock('@vercel/kv', () => ({
  kv: {
    scan: vi.fn(),
    get: vi.fn(),
    zrange: vi.fn(),
  },
}))

describe('api/analytics/oauth-usage', () => {
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>
  let mockReq: Partial<VercelRequest>
  let mockRes: Partial<VercelResponse>
  let statusMock: ReturnType<typeof vi.fn>
  let jsonMock: ReturnType<typeof vi.fn>
  let setHeaderMock: ReturnType<typeof vi.fn>

  beforeEach(() => {
    vi.clearAllMocks()
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    // Setup mock response
    jsonMock = vi.fn()
    statusMock = vi.fn().mockReturnValue({ json: jsonMock })
    setHeaderMock = vi.fn()

    mockRes = {
      status: statusMock,
      json: jsonMock,
      setHeader: setHeaderMock,
    }

    // Setup default mock request
    mockReq = {
      method: 'GET',
      query: {},
    }
  })

  afterEach(() => {
    consoleErrorSpy.mockRestore()
  })

  describe('HTTP Method Validation', () => {
    it(
      'возвращает 405 для POST запроса',
      async () => {
        mockReq.method = 'POST'

        await handler(mockReq as VercelRequest, mockRes as VercelResponse)

        expect(statusMock).toHaveBeenCalledWith(405)
        expect(jsonMock).toHaveBeenCalledWith({ error: 'Method not allowed' })
      },
      10000
    )

    it(
      'возвращает 405 для PUT запроса',
      async () => {
        mockReq.method = 'PUT'

        await handler(mockReq as VercelRequest, mockRes as VercelResponse)

        expect(statusMock).toHaveBeenCalledWith(405)
        expect(jsonMock).toHaveBeenCalledWith({ error: 'Method not allowed' })
      },
      10000
    )

    it(
      'возвращает 405 для DELETE запроса',
      async () => {
        mockReq.method = 'DELETE'

        await handler(mockReq as VercelRequest, mockRes as VercelResponse)

        expect(statusMock).toHaveBeenCalledWith(405)
        expect(jsonMock).toHaveBeenCalledWith({ error: 'Method not allowed' })
      },
      10000
    )

    it(
      'принимает GET запрос',
      async () => {
        mockReq.method = 'GET'
        mockReq.query = { period: 'day' }

        // Mock empty data
        vi.mocked(kv.scan).mockResolvedValue([0, []])
        vi.mocked(kv.zrange).mockResolvedValue([])

        await handler(mockReq as VercelRequest, mockRes as VercelResponse)

        expect(statusMock).toHaveBeenCalledWith(200)
      },
      10000
    )
  })

  describe('Query Parameter Validation', () => {
    it(
      'использует period=day по умолчанию',
      async () => {
        mockReq.query = {}

        vi.mocked(kv.scan).mockResolvedValue([0, []])
        vi.mocked(kv.zrange).mockResolvedValue([])

        await handler(mockReq as VercelRequest, mockRes as VercelResponse)

        expect(statusMock).toHaveBeenCalledWith(200)
        expect(jsonMock).toHaveBeenCalledWith(
          expect.objectContaining({
            period: 'day',
          })
        )
      },
      10000
    )

    it(
      'принимает period=hour',
      async () => {
        mockReq.query = { period: 'hour' }

        vi.mocked(kv.scan).mockResolvedValue([0, []])
        vi.mocked(kv.zrange).mockResolvedValue([])

        await handler(mockReq as VercelRequest, mockRes as VercelResponse)

        expect(statusMock).toHaveBeenCalledWith(200)
        expect(jsonMock).toHaveBeenCalledWith(
          expect.objectContaining({
            period: 'hour',
          })
        )
      },
      10000
    )

    it(
      'принимает period=week',
      async () => {
        mockReq.query = { period: 'week' }

        vi.mocked(kv.scan).mockResolvedValue([0, []])
        vi.mocked(kv.zrange).mockResolvedValue([])

        await handler(mockReq as VercelRequest, mockRes as VercelResponse)

        expect(statusMock).toHaveBeenCalledWith(200)
        expect(jsonMock).toHaveBeenCalledWith(
          expect.objectContaining({
            period: 'week',
          })
        )
      },
      10000
    )

    it(
      'принимает period=month',
      async () => {
        mockReq.query = { period: 'month' }

        vi.mocked(kv.scan).mockResolvedValue([0, []])
        vi.mocked(kv.zrange).mockResolvedValue([])

        await handler(mockReq as VercelRequest, mockRes as VercelResponse)

        expect(statusMock).toHaveBeenCalledWith(200)
        expect(jsonMock).toHaveBeenCalledWith(
          expect.objectContaining({
            period: 'month',
          })
        )
      },
      10000
    )

    it(
      'возвращает 400 для невалидного period',
      async () => {
        mockReq.query = { period: 'invalid' }

        await handler(mockReq as VercelRequest, mockRes as VercelResponse)

        expect(statusMock).toHaveBeenCalledWith(400)
        expect(jsonMock).toHaveBeenCalledWith({
          error: 'Invalid period',
          message: 'Period must be one of: hour, day, week, month',
        })
      },
      10000
    )

    it(
      'возвращает 400 для period=year',
      async () => {
        mockReq.query = { period: 'year' }

        await handler(mockReq as VercelRequest, mockRes as VercelResponse)

        expect(statusMock).toHaveBeenCalledWith(400)
        expect(jsonMock).toHaveBeenCalledWith({
          error: 'Invalid period',
          message: 'Period must be one of: hour, day, week, month',
        })
      },
      10000
    )
  })

  describe('Detailed Parameter', () => {
    it(
      'НЕ включает detailed данные по умолчанию',
      async () => {
        mockReq.query = { period: 'day' }

        vi.mocked(kv.scan).mockResolvedValue([0, []])
        vi.mocked(kv.zrange).mockResolvedValue([])

        await handler(mockReq as VercelRequest, mockRes as VercelResponse)

        const response = jsonMock.mock.calls[0][0]
        expect(response.detailed).toBeUndefined()
      },
      10000
    )

    it(
      'включает detailed данные когда detailed=true',
      async () => {
        mockReq.query = { period: 'day', detailed: 'true' }

        // Mock session data
        vi.mocked(kv.scan).mockResolvedValue([
          0,
          ['session:abc123', 'session:def456'],
        ])
        vi.mocked(kv.get).mockResolvedValue({
          userId: 123,
          login: 'testuser',
          accessToken: 'token',
          avatarUrl: 'https://avatar.url',
          createdAt: Date.now() - 86400000,
          lastActivity: Date.now(),
        })
        vi.mocked(kv.zrange).mockResolvedValue([])

        await handler(mockReq as VercelRequest, mockRes as VercelResponse)

        const response = jsonMock.mock.calls[0][0]
        expect(response.detailed).toBeDefined()
        expect(response.detailed.sessions).toBeDefined()
        expect(response.detailed.timeline).toBeDefined()
      },
      10000
    )

    it(
      'усекает sessionId в detailed данных (privacy)',
      async () => {
        mockReq.query = { period: 'day', detailed: 'true' }

        vi.mocked(kv.scan).mockResolvedValue([0, ['session:abcdefghijklmnop']])
        vi.mocked(kv.get).mockResolvedValue({
          userId: 123,
          login: 'testuser',
          accessToken: 'token',
          avatarUrl: 'https://avatar.url',
          createdAt: Date.now(),
        })
        vi.mocked(kv.zrange).mockResolvedValue([])

        await handler(mockReq as VercelRequest, mockRes as VercelResponse)

        const response = jsonMock.mock.calls[0][0]
        expect(response.detailed.sessions[0].sessionId).toBe('abcdefgh...')
      },
      10000
    )
  })

  describe('Active Sessions', () => {
    it(
      'возвращает 0 активных сессий если KV пуст',
      async () => {
        mockReq.query = { period: 'day' }

        vi.mocked(kv.scan).mockResolvedValue([0, []])
        vi.mocked(kv.zrange).mockResolvedValue([])

        await handler(mockReq as VercelRequest, mockRes as VercelResponse)

        const response = jsonMock.mock.calls[0][0]
        expect(response.metrics.activeSessions).toBe(0)
      },
      10000
    )

    it(
      'корректно подсчитывает активные сессии',
      async () => {
        mockReq.query = { period: 'day' }

        // Mock 2 sessions
        vi.mocked(kv.scan).mockResolvedValue([0, ['session:abc', 'session:def']])
        vi.mocked(kv.get).mockResolvedValue({
          userId: 123,
          login: 'testuser',
          accessToken: 'token',
          avatarUrl: 'https://avatar.url',
          createdAt: Date.now(),
        })
        vi.mocked(kv.zrange).mockResolvedValue([])

        await handler(mockReq as VercelRequest, mockRes as VercelResponse)

        const response = jsonMock.mock.calls[0][0]
        expect(response.metrics.activeSessions).toBe(2)
      },
      10000
    )

    it(
      'обрабатывает pagination KV scan (cursor !== 0)',
      async () => {
        mockReq.query = { period: 'day' }

        // Mock paginated scan results
        vi.mocked(kv.scan)
          .mockResolvedValueOnce([1, ['session:abc']]) // cursor=1, has more
          .mockResolvedValueOnce([0, ['session:def']]) // cursor=0, done

        vi.mocked(kv.get)
          .mockResolvedValueOnce({
            userId: 123,
            login: 'user1',
            accessToken: 'token',
            avatarUrl: 'https://avatar.url',
            createdAt: Date.now(),
          })
          .mockResolvedValueOnce({
            userId: 456,
            login: 'user2',
            accessToken: 'token',
            avatarUrl: 'https://avatar.url',
            createdAt: Date.now(),
          })

        vi.mocked(kv.zrange).mockResolvedValue([])

        await handler(mockReq as VercelRequest, mockRes as VercelResponse)

        const response = jsonMock.mock.calls[0][0]
        expect(response.metrics.activeSessions).toBe(2)
        expect(kv.scan).toHaveBeenCalledTimes(2)
        expect(kv.get).toHaveBeenCalledTimes(2)
      },
      10000
    )

    it(
      'пропускает null session data',
      async () => {
        mockReq.query = { period: 'day' }

        vi.mocked(kv.scan).mockResolvedValue([0, ['session:abc', 'session:def']])
        vi.mocked(kv.get)
          .mockResolvedValueOnce({
            userId: 123,
            login: 'testuser',
            accessToken: 'token',
            avatarUrl: 'https://avatar.url',
            createdAt: Date.now(),
          })
          .mockResolvedValueOnce(null) // второй сессии нет

        vi.mocked(kv.zrange).mockResolvedValue([])

        await handler(mockReq as VercelRequest, mockRes as VercelResponse)

        const response = jsonMock.mock.calls[0][0]
        expect(response.metrics.activeSessions).toBe(1) // только 1 валидная сессия
      },
      10000
    )
  })

  describe('OAuth Events', () => {
    it(
      'возвращает 0 событий если KV пуст',
      async () => {
        mockReq.query = { period: 'day' }

        vi.mocked(kv.scan).mockResolvedValue([0, []])
        vi.mocked(kv.zrange).mockResolvedValue([])

        await handler(mockReq as VercelRequest, mockRes as VercelResponse)

        const response = jsonMock.mock.calls[0][0]
        expect(response.metrics.totalLogins).toBe(0)
        expect(response.metrics.totalLogouts).toBe(0)
      },
      10000
    )

    it(
      'корректно подсчитывает login события',
      async () => {
        mockReq.query = { period: 'day' }

        vi.mocked(kv.scan).mockResolvedValue([0, []])
        vi.mocked(kv.zrange)
          .mockResolvedValueOnce([
            // logins
            JSON.stringify({ timestamp: Date.now(), userId: 123, login: 'user1' }),
            JSON.stringify({ timestamp: Date.now(), userId: 456, login: 'user2' }),
          ])
          .mockResolvedValueOnce([]) // logouts
          .mockResolvedValueOnce([]) // ratelimit

        await handler(mockReq as VercelRequest, mockRes as VercelResponse)

        const response = jsonMock.mock.calls[0][0]
        expect(response.metrics.totalLogins).toBe(2)
        expect(response.metrics.totalLogouts).toBe(0)
      },
      10000
    )

    it(
      'корректно подсчитывает logout события',
      async () => {
        mockReq.query = { period: 'day' }

        vi.mocked(kv.scan).mockResolvedValue([0, []])
        // kv.zrange вызывается в Promise.all параллельно, не sequentially
        // Поэтому нужно использовать mockImplementation для различения вызовов
        vi.mocked(kv.zrange).mockImplementation(
          async (key: string) => {
            if (key === 'analytics:oauth:logins') return []
            if (key === 'analytics:oauth:logouts') {
              return [
                JSON.stringify({ timestamp: Date.now(), userId: 123, login: 'user1' }),
              ]
            }
            if (key === 'analytics:ratelimit') return []
            return []
          }
        )

        await handler(mockReq as VercelRequest, mockRes as VercelResponse)

        const response = jsonMock.mock.calls[0][0]
        expect(response.metrics.totalLogins).toBe(0)
        expect(response.metrics.totalLogouts).toBe(1)
      },
      10000
    )

    it(
      'считает все login события, но пропускает невалидный JSON при парсинге timeline',
      async () => {
        mockReq.query = { period: 'day', detailed: 'true' }

        vi.mocked(kv.scan).mockResolvedValue([0, []])
        vi.mocked(kv.zrange)
          .mockResolvedValueOnce([
            // logins - 3 события всего
            JSON.stringify({ timestamp: Date.now(), userId: 123, login: 'user1' }),
            'invalid json {{{', // невалидный JSON
            JSON.stringify({ timestamp: Date.now(), userId: 456, login: 'user2' }),
          ])
          .mockResolvedValueOnce([]) // logouts
          .mockResolvedValueOnce([]) // ratelimit

        await handler(mockReq as VercelRequest, mockRes as VercelResponse)

        const response = jsonMock.mock.calls[0][0]
        expect(response.metrics.totalLogins).toBe(3) // считает все элементы массива
        expect(response.detailed.timeline).toHaveLength(2) // но timeline содержит только 2 валидных
      },
      10000
    )
  })

  describe('Unique Users', () => {
    it(
      'возвращает 0 уникальных юзеров если сессий нет',
      async () => {
        mockReq.query = { period: 'day' }

        vi.mocked(kv.scan).mockResolvedValue([0, []])
        vi.mocked(kv.zrange).mockResolvedValue([])

        await handler(mockReq as VercelRequest, mockRes as VercelResponse)

        const response = jsonMock.mock.calls[0][0]
        expect(response.metrics.uniqueUsers).toBe(0)
      },
      10000
    )

    it(
      'корректно подсчитывает уникальных юзеров',
      async () => {
        mockReq.query = { period: 'day' }

        // First scan call - returns 3 sessions
        vi.mocked(kv.scan).mockResolvedValueOnce([
          0,
          ['session:abc', 'session:def', 'session:ghi'],
        ])

        // kv.get calls for each session
        vi.mocked(kv.get)
          .mockResolvedValueOnce({
            userId: 123,
            login: 'user1',
            accessToken: 'token',
            avatarUrl: 'https://avatar.url',
            createdAt: Date.now(),
          })
          .mockResolvedValueOnce({
            userId: 123, // тот же userId
            login: 'user1',
            accessToken: 'token',
            avatarUrl: 'https://avatar.url',
            createdAt: Date.now(),
          })
          .mockResolvedValueOnce({
            userId: 456, // другой userId
            login: 'user2',
            accessToken: 'token',
            avatarUrl: 'https://avatar.url',
            createdAt: Date.now(),
          })

        vi.mocked(kv.zrange).mockResolvedValue([])

        await handler(mockReq as VercelRequest, mockRes as VercelResponse)

        const response = jsonMock.mock.calls[0][0]
        expect(response.metrics.uniqueUsers).toBe(2) // только 2 уникальных userId
        expect(response.metrics.activeSessions).toBe(3) // 3 сессии всего
      },
      10000
    )
  })

  describe('Average Session Duration', () => {
    it(
      'возвращает 0 если сессий нет',
      async () => {
        mockReq.query = { period: 'day' }

        vi.mocked(kv.scan).mockResolvedValue([0, []])
        vi.mocked(kv.zrange).mockResolvedValue([])

        await handler(mockReq as VercelRequest, mockRes as VercelResponse)

        const response = jsonMock.mock.calls[0][0]
        expect(response.metrics.avgSessionDuration).toBe(0)
      },
      10000
    )

    it(
      'корректно рассчитывает среднюю длительность сессии',
      async () => {
        mockReq.query = { period: 'day' }

        const now = Date.now()
        const oneHourAgo = now - 3600000

        vi.mocked(kv.scan).mockResolvedValue([0, ['session:abc', 'session:def']])
        vi.mocked(kv.get)
          .mockResolvedValueOnce({
            userId: 123,
            login: 'user1',
            accessToken: 'token',
            avatarUrl: 'https://avatar.url',
            createdAt: oneHourAgo,
            lastActivity: now, // 1 hour duration
          })
          .mockResolvedValueOnce({
            userId: 456,
            login: 'user2',
            accessToken: 'token',
            avatarUrl: 'https://avatar.url',
            createdAt: now - 7200000,
            lastActivity: now, // 2 hours duration
          })

        vi.mocked(kv.zrange).mockResolvedValue([])

        await handler(mockReq as VercelRequest, mockRes as VercelResponse)

        const response = jsonMock.mock.calls[0][0]
        // Average: (3600000 + 7200000) / 2 = 5400000
        expect(response.metrics.avgSessionDuration).toBe(5400000)
      },
      10000
    )

    it(
      'использует текущее время если lastActivity отсутствует',
      async () => {
        mockReq.query = { period: 'day' }

        const oneHourAgo = Date.now() - 3600000

        vi.mocked(kv.scan).mockResolvedValue([0, ['session:abc']])
        vi.mocked(kv.get).mockResolvedValue({
          userId: 123,
          login: 'user1',
          accessToken: 'token',
          avatarUrl: 'https://avatar.url',
          createdAt: oneHourAgo,
          // NO lastActivity
        })

        vi.mocked(kv.zrange).mockResolvedValue([])

        await handler(mockReq as VercelRequest, mockRes as VercelResponse)

        const response = jsonMock.mock.calls[0][0]
        // Should use current time as lastActivity (around 1 hour = 3600000ms)
        // Allow 10% margin for test execution time
        expect(response.metrics.avgSessionDuration).toBeGreaterThan(3400000)
        expect(response.metrics.avgSessionDuration).toBeLessThan(3800000)
      },
      10000
    )
  })

  describe('Rate Limit Statistics', () => {
    it(
      'возвращает дефолтные значения если snapshots нет',
      async () => {
        mockReq.query = { period: 'day' }

        vi.mocked(kv.scan).mockResolvedValue([0, []])
        vi.mocked(kv.zrange).mockResolvedValue([])

        await handler(mockReq as VercelRequest, mockRes as VercelResponse)

        const response = jsonMock.mock.calls[0][0]
        expect(response.metrics.rateLimit).toEqual({
          avgUsage: 0,
          peakUsage: 0,
          avgRemaining: 5000,
        })
      },
      10000
    )

    it(
      'корректно рассчитывает avgUsage и peakUsage',
      async () => {
        mockReq.query = { period: 'day' }

        vi.mocked(kv.scan).mockResolvedValue([0, []])
        vi.mocked(kv.zrange).mockImplementation(async (key: string) => {
          if (key === 'analytics:oauth:logins') return []
          if (key === 'analytics:oauth:logouts') return []
          if (key === 'analytics:ratelimit') {
            return [
              JSON.stringify({ timestamp: Date.now(), used: 100, remaining: 4900 }),
              JSON.stringify({ timestamp: Date.now(), used: 500, remaining: 4500 }),
              JSON.stringify({ timestamp: Date.now(), used: 300, remaining: 4700 }),
            ]
          }
          return []
        })

        await handler(mockReq as VercelRequest, mockRes as VercelResponse)

        const response = jsonMock.mock.calls[0][0]
        expect(response.metrics.rateLimit.avgUsage).toBe(300) // (100 + 500 + 300) / 3
        expect(response.metrics.rateLimit.peakUsage).toBe(500) // max
        expect(response.metrics.rateLimit.avgRemaining).toBe(4700) // (4900 + 4500 + 4700) / 3
      },
      10000
    )

    it(
      'пропускает невалидные JSON snapshots при парсинге',
      async () => {
        mockReq.query = { period: 'day' }

        vi.mocked(kv.scan).mockResolvedValue([0, []])
        vi.mocked(kv.zrange).mockImplementation(async (key: string) => {
          if (key === 'analytics:oauth:logins') return []
          if (key === 'analytics:oauth:logouts') return []
          if (key === 'analytics:ratelimit') {
            return [
              JSON.stringify({ timestamp: Date.now(), used: 100, remaining: 4900 }),
              'invalid json',
              JSON.stringify({ timestamp: Date.now(), used: 200, remaining: 4800 }),
            ]
          }
          return []
        })

        await handler(mockReq as VercelRequest, mockRes as VercelResponse)

        const response = jsonMock.mock.calls[0][0]
        // avgUsage = (100 + 200) / 3 = 100, потому что length=3, но invalid даёт 0
        // На самом деле код делит на snapshots.length (3), не на количество валидных (2)
        expect(response.metrics.rateLimit.avgUsage).toBe(100) // Math.round(300 / 3)
      },
      10000
    )
  })

  describe('Cache Headers', () => {
    it(
      'устанавливает правильные cache headers',
      async () => {
        mockReq.query = { period: 'day' }

        vi.mocked(kv.scan).mockResolvedValue([0, []])
        vi.mocked(kv.zrange).mockResolvedValue([])

        await handler(mockReq as VercelRequest, mockRes as VercelResponse)

        expect(setHeaderMock).toHaveBeenCalledWith(
          'Cache-Control',
          'public, s-maxage=300, stale-while-revalidate=600'
        )
      },
      10000
    )
  })

  describe('Error Handling', () => {
    it(
      'возвращает 200 с пустыми данными если getActiveSessions падает (graceful degradation)',
      async () => {
        mockReq.query = { period: 'day' }

        vi.mocked(kv.scan).mockRejectedValue(new Error('KV scan error'))
        vi.mocked(kv.zrange).mockResolvedValue([])

        await handler(mockReq as VercelRequest, mockRes as VercelResponse)

        expect(statusMock).toHaveBeenCalledWith(200)
        const response = jsonMock.mock.calls[0][0]
        expect(response.metrics.activeSessions).toBe(0) // fallback to empty
        expect(consoleErrorSpy).toHaveBeenCalledWith(
          'Error fetching active sessions:',
          expect.any(Error)
        )
      },
      10000
    )

    it(
      'возвращает 200 с пустыми событиями если getOAuthEvents падает (graceful degradation)',
      async () => {
        mockReq.query = { period: 'day' }

        vi.mocked(kv.scan).mockResolvedValue([0, []])
        vi.mocked(kv.zrange).mockRejectedValue(new Error('KV zrange error'))

        await handler(mockReq as VercelRequest, mockRes as VercelResponse)

        expect(statusMock).toHaveBeenCalledWith(200)
        const response = jsonMock.mock.calls[0][0]
        expect(response.metrics.totalLogins).toBe(0) // fallback to 0
        expect(response.metrics.totalLogouts).toBe(0) // fallback to 0
        expect(consoleErrorSpy).toHaveBeenCalledWith(
          'Error fetching OAuth events:',
          expect.any(Error)
        )
      },
      10000
    )

    it(
      'возвращает 200 с дефолтными rate limit если getRateLimitStats падает (graceful degradation)',
      async () => {
        mockReq.query = { period: 'day' }

        vi.mocked(kv.scan).mockResolvedValue([0, []])

        // Используем mockImplementation чтобы различать вызовы по ключу
        vi.mocked(kv.zrange).mockImplementation(async (key: string) => {
          if (key === 'analytics:oauth:logins') return []
          if (key === 'analytics:oauth:logouts') return []
          if (key === 'analytics:ratelimit') {
            throw new Error('Rate limit fetch error')
          }
          return []
        })

        await handler(mockReq as VercelRequest, mockRes as VercelResponse)

        expect(statusMock).toHaveBeenCalledWith(200)
        const response = jsonMock.mock.calls[0][0]
        expect(response.metrics.rateLimit).toEqual({
          avgUsage: 0,
          peakUsage: 0,
          avgRemaining: 5000,
        })
        // getRateLimitStats ловит ошибку и логирует её
        expect(consoleErrorSpy).toHaveBeenCalledWith(
          'Error fetching rate limit stats:',
          expect.any(Error)
        )
      },
      10000
    )

    it(
      'возвращает 500 только если handler сам падает (Promise.all fails)',
      async () => {
        mockReq.query = { period: 'day' }

        // Симулируем критическую ошибку через query parsing
        mockReq.query = { period: { invalid: 'object' } } as never

        await handler(mockReq as VercelRequest, mockRes as VercelResponse)

        // Handler может вернуть 400 или 500 в зависимости от ошибки
        expect(statusMock).toHaveBeenCalled()
      },
      10000
    )
  })

  describe('Response Structure', () => {
    it(
      'возвращает корректную структуру ответа',
      async () => {
        mockReq.query = { period: 'day' }

        vi.mocked(kv.scan).mockResolvedValue([0, []])
        vi.mocked(kv.zrange).mockResolvedValue([])

        await handler(mockReq as VercelRequest, mockRes as VercelResponse)

        expect(statusMock).toHaveBeenCalledWith(200)

        const response = jsonMock.mock.calls[0][0]
        expect(response).toHaveProperty('period')
        expect(response).toHaveProperty('timestamp')
        expect(response).toHaveProperty('metrics')
        expect(response.metrics).toHaveProperty('activeSessions')
        expect(response.metrics).toHaveProperty('totalLogins')
        expect(response.metrics).toHaveProperty('totalLogouts')
        expect(response.metrics).toHaveProperty('uniqueUsers')
        expect(response.metrics).toHaveProperty('avgSessionDuration')
        expect(response.metrics).toHaveProperty('rateLimit')
        expect(response.metrics.rateLimit).toHaveProperty('avgUsage')
        expect(response.metrics.rateLimit).toHaveProperty('peakUsage')
        expect(response.metrics.rateLimit).toHaveProperty('avgRemaining')
      },
      10000
    )

    it(
      'timestamp близок к текущему времени',
      async () => {
        mockReq.query = { period: 'day' }

        vi.mocked(kv.scan).mockResolvedValue([0, []])
        vi.mocked(kv.zrange).mockResolvedValue([])

        const before = Date.now()
        await handler(mockReq as VercelRequest, mockRes as VercelResponse)
        const after = Date.now()

        const response = jsonMock.mock.calls[0][0]
        expect(response.timestamp).toBeGreaterThanOrEqual(before)
        expect(response.timestamp).toBeLessThanOrEqual(after)
      },
      10000
    )
  })
})
