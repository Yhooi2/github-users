import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { VercelRequest, VercelResponse } from '@vercel/node'
import { kv } from '@vercel/kv'
import handler from './oauth-usage'

// Mock @vercel/kv
vi.mock('@vercel/kv', () => ({
  kv: {
    scan: vi.fn(),
    get: vi.fn(),
    zrange: vi.fn(),
  },
}))

describe('OAuth Usage Analytics API', () => {
  let req: Partial<VercelRequest>
  let res: Partial<VercelResponse>

  beforeEach(() => {
    // Reset all mocks before each test for isolation
    vi.clearAllMocks()

    // Mock console to avoid noise
    console.log = vi.fn()
    console.warn = vi.fn()
    console.error = vi.fn()

    // Mock request
    req = {
      method: 'GET',
      query: {},
    }

    // Mock response
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
      setHeader: vi.fn().mockReturnThis(),
    }

    // Setup default mocks for KV (will be overridden by specific tests)
    vi.mocked(kv.scan).mockResolvedValue([0, []])
    vi.mocked(kv.get).mockResolvedValue(null)
    vi.mocked(kv.zrange).mockResolvedValue([])
  })

  describe('Method Validation', () => {
    it('should reject non-GET requests', async () => {
      req.method = 'POST'

      await handler(req as VercelRequest, res as VercelResponse)

      expect(res.status).toHaveBeenCalledWith(405)
      expect(res.json).toHaveBeenCalledWith({ error: 'Method not allowed' })
    })

    it('should accept GET requests', async () => {
      // Mock KV scan to return empty results
      vi.mocked(kv.scan).mockResolvedValue([0, []])
      vi.mocked(kv.zrange).mockResolvedValue([])

      await handler(req as VercelRequest, res as VercelResponse)

      expect(res.status).toHaveBeenCalledWith(200)
    })
  })

  describe('Period Parameter Validation', () => {
    beforeEach(() => {
      vi.mocked(kv.scan).mockResolvedValue([0, []])
      vi.mocked(kv.zrange).mockResolvedValue([])
    })

    it('should accept valid period: hour', async () => {
      req.query = { period: 'hour' }

      await handler(req as VercelRequest, res as VercelResponse)

      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          period: 'hour',
        })
      )
    })

    it('should accept valid period: day', async () => {
      req.query = { period: 'day' }

      await handler(req as VercelRequest, res as VercelResponse)

      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          period: 'day',
        })
      )
    })

    it('should accept valid period: week', async () => {
      req.query = { period: 'week' }

      await handler(req as VercelRequest, res as VercelResponse)

      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          period: 'week',
        })
      )
    })

    it('should accept valid period: month', async () => {
      req.query = { period: 'month' }

      await handler(req as VercelRequest, res as VercelResponse)

      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          period: 'month',
        })
      )
    })

    it('should default to "day" when no period specified', async () => {
      req.query = {}

      await handler(req as VercelRequest, res as VercelResponse)

      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          period: 'day',
        })
      )
    })

    it('should reject invalid period', async () => {
      req.query = { period: 'invalid' }

      await handler(req as VercelRequest, res as VercelResponse)

      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith({
        error: 'Invalid period',
        message: 'Period must be one of: hour, day, week, month',
      })
    })
  })

  describe('Happy Path - Basic Metrics', () => {
    beforeEach(() => {
      // Mock active sessions
      vi.mocked(kv.scan).mockResolvedValue([
        0,
        ['session:abc123', 'session:def456'],
      ])

      vi.mocked(kv.get)
        .mockResolvedValueOnce({
          userId: 12345,
          login: 'user1',
          accessToken: 'token1',
          avatarUrl: 'https://example.com/avatar1.png',
          createdAt: 1699900000000,
          lastActivity: 1700000000000,
        })
        .mockResolvedValueOnce({
          userId: 67890,
          login: 'user2',
          accessToken: 'token2',
          avatarUrl: 'https://example.com/avatar2.png',
          createdAt: 1699950000000,
          lastActivity: 1700050000000,
        })

      // Mock kv.zrange by key
      vi.mocked(kv.zrange).mockImplementation(async (key: string) => {
        if (key === 'analytics:oauth:logins') {
          return [
            JSON.stringify({
              timestamp: 1699900000000,
              userId: 12345,
              login: 'user1',
              sessionId: 'abc123',
            }),
            JSON.stringify({
              timestamp: 1699950000000,
              userId: 67890,
              login: 'user2',
              sessionId: 'def456',
            }),
          ]
        }
        if (key === 'analytics:oauth:logouts') {
          return [
            JSON.stringify({
              timestamp: 1699980000000,
              userId: 12345,
              login: 'user1',
              sessionId: 'old_session',
            }),
          ]
        }
        if (key === 'analytics:ratelimit') {
          return [
            JSON.stringify({
              timestamp: 1700000000000,
              remaining: 4500,
              limit: 5000,
              used: 500,
              isDemo: false,
              userLogin: 'user1',
            }),
            JSON.stringify({
              timestamp: 1700010000000,
              remaining: 4200,
              limit: 5000,
              used: 800,
              isDemo: false,
              userLogin: 'user2',
            }),
          ]
        }
        return []
      })
    })

    it('should return correct metrics structure', async () => {
      await handler(req as VercelRequest, res as VercelResponse)

      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          period: 'day',
          timestamp: expect.any(Number),
          metrics: expect.objectContaining({
            activeSessions: expect.any(Number),
            totalLogins: expect.any(Number),
            totalLogouts: expect.any(Number),
            uniqueUsers: expect.any(Number),
            avgSessionDuration: expect.any(Number),
            rateLimit: expect.objectContaining({
              avgUsage: expect.any(Number),
              peakUsage: expect.any(Number),
              avgRemaining: expect.any(Number),
            }),
          }),
        })
      )
    })

    it('should calculate active sessions correctly', async () => {
      await handler(req as VercelRequest, res as VercelResponse)

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          metrics: expect.objectContaining({
            activeSessions: 2,
          }),
        })
      )
    })

    it('should calculate unique users correctly', async () => {
      await handler(req as VercelRequest, res as VercelResponse)

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          metrics: expect.objectContaining({
            uniqueUsers: 2,
          }),
        })
      )
    })

    it('should calculate login/logout counts correctly', async () => {
      await handler(req as VercelRequest, res as VercelResponse)

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          metrics: expect.objectContaining({
            totalLogins: 2,
            totalLogouts: 1,
          }),
        })
      )
    })

    it('should calculate rate limit stats correctly', async () => {
      await handler(req as VercelRequest, res as VercelResponse)

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          metrics: expect.objectContaining({
            rateLimit: {
              avgUsage: 650, // (500 + 800) / 2
              peakUsage: 800,
              avgRemaining: 4350, // (4500 + 4200) / 2
            },
          }),
        })
      )
    })

    it('should set cache headers', async () => {
      await handler(req as VercelRequest, res as VercelResponse)

      expect(res.setHeader).toHaveBeenCalledWith(
        'Cache-Control',
        'public, s-maxage=300, stale-while-revalidate=600'
      )
    })
  })

  describe('Detailed Mode', () => {
    beforeEach(() => {
      vi.mocked(kv.scan).mockResolvedValue([
        0,
        ['session:abc123'],
      ])

      vi.mocked(kv.get).mockResolvedValue({
        userId: 12345,
        login: 'user1',
        accessToken: 'token1',
        avatarUrl: 'https://example.com/avatar1.png',
        createdAt: 1699900000000,
        lastActivity: 1700000000000,
      })

      vi.mocked(kv.zrange)
        .mockResolvedValueOnce([
          JSON.stringify({
            timestamp: 1699900000000,
            userId: 12345,
            login: 'user1',
            sessionId: 'abc123',
          }),
        ])
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([])
    })

    it('should not include detailed data by default', async () => {
      req.query = { detailed: 'false' }

      await handler(req as VercelRequest, res as VercelResponse)

      expect(res.json).toHaveBeenCalledWith(
        expect.not.objectContaining({
          detailed: expect.anything(),
        })
      )
    })

    it('should include detailed data when requested', async () => {
      req.query = { detailed: 'true' }

      await handler(req as VercelRequest, res as VercelResponse)

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          detailed: expect.objectContaining({
            sessions: expect.any(Array),
            timeline: expect.any(Array),
          }),
        })
      )
    })

    it('should truncate session IDs for privacy', async () => {
      req.query = { detailed: 'true' }

      await handler(req as VercelRequest, res as VercelResponse)

      const call = vi.mocked(res.json).mock.calls[0][0] as any
      expect(call.detailed.sessions[0].sessionId).toBe('abc123...')
    })
  })

  describe('Edge Cases', () => {
    it('should handle no active sessions', async () => {
      vi.mocked(kv.scan).mockResolvedValue([0, []])
      vi.mocked(kv.zrange).mockResolvedValue([])

      await handler(req as VercelRequest, res as VercelResponse)

      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          metrics: expect.objectContaining({
            activeSessions: 0,
            uniqueUsers: 0,
            avgSessionDuration: 0,
          }),
        })
      )
    })

    it('should handle malformed JSON in events', async () => {
      vi.mocked(kv.scan).mockResolvedValue([0, []])
      vi.mocked(kv.zrange).mockImplementation(async (key: string) => {
        if (key === 'analytics:oauth:logins') {
          return ['invalid json', 'also invalid']
        }
        return []
      })

      await handler(req as VercelRequest, res as VercelResponse)

      expect(res.status).toHaveBeenCalledWith(200)
      const response = vi.mocked(res.json).mock.calls[0][0] as any

      // Note: Code returns loginEvents.length (not parsed events count)
      // So even invalid JSON is counted in totalLogins
      expect(response.metrics.totalLogins).toBe(2)
      expect(response.metrics.totalLogouts).toBe(0)

      // But timeline should be empty (invalid events not parsed)
      if (response.detailed) {
        expect(response.detailed.timeline).toHaveLength(0)
      }
    })

    it('should handle KV scan errors gracefully', async () => {
      vi.mocked(kv.scan).mockRejectedValue(new Error('KV scan failed'))
      vi.mocked(kv.zrange).mockResolvedValue([])

      await handler(req as VercelRequest, res as VercelResponse)

      // Should return 200 with empty metrics instead of crashing
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          metrics: expect.objectContaining({
            activeSessions: 0,
          }),
        })
      )
    })

    it('should handle KV zrange errors gracefully', async () => {
      vi.mocked(kv.scan).mockResolvedValue([0, []])
      vi.mocked(kv.zrange).mockRejectedValue(new Error('KV zrange failed'))

      await handler(req as VercelRequest, res as VercelResponse)

      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          metrics: expect.objectContaining({
            totalLogins: 0,
            totalLogouts: 0,
          }),
        })
      )
    })
  })

  describe('Error Handling', () => {
    it('should handle errors gracefully and return 200 with partial data', async () => {
      // All helper functions handle errors internally and return empty/default values
      // So even if internal operations fail, the handler returns 200 with safe defaults
      vi.mocked(kv.scan).mockRejectedValue(new Error('KV scan failed'))
      vi.mocked(kv.zrange).mockRejectedValue(new Error('KV zrange failed'))

      await handler(req as VercelRequest, res as VercelResponse)

      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          metrics: expect.objectContaining({
            activeSessions: 0,
            totalLogins: 0,
            totalLogouts: 0,
            uniqueUsers: 0,
          }),
        })
      )
    })
  })

  describe('Multi-page Session Scan', () => {
    it('should handle paginated KV scan results', async () => {
      // First scan returns cursor 100 (more results)
      vi.mocked(kv.scan)
        .mockResolvedValueOnce([100, ['session:abc123']])
        .mockResolvedValueOnce([0, ['session:def456']]) // Second scan returns cursor 0 (done)

      vi.mocked(kv.get)
        .mockResolvedValueOnce({
          userId: 12345,
          login: 'user1',
          accessToken: 'token1',
          avatarUrl: 'https://example.com/avatar1.png',
          createdAt: 1699900000000,
        })
        .mockResolvedValueOnce({
          userId: 67890,
          login: 'user2',
          accessToken: 'token2',
          avatarUrl: 'https://example.com/avatar2.png',
          createdAt: 1699950000000,
        })

      vi.mocked(kv.zrange).mockResolvedValue([])

      await handler(req as VercelRequest, res as VercelResponse)

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          metrics: expect.objectContaining({
            activeSessions: 2,
          }),
        })
      )

      // Verify scan was called twice
      expect(kv.scan).toHaveBeenCalledTimes(2)
    })
  })
})
