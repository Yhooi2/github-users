import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import type { VercelRequest, VercelResponse } from '@vercel/node'

// Set environment variables BEFORE importing handler (required for kv initialization)
process.env.GITHUB_TOKEN = 'demo_token_123'
process.env.KV_REST_API_URL = 'http://kv.test'
process.env.KV_REST_API_TOKEN = 'kv_token'

// Mock @vercel/kv BEFORE importing handler
vi.mock('@vercel/kv', () => ({
  kv: {
    get: vi.fn(),
    set: vi.fn(),
    del: vi.fn(),
  },
}))

// Dynamic import handler after mocks and env vars are set up
const handlerModule = await import('./github-proxy')
const handler = handlerModule.default

// Import mocked kv
import { kv } from '@vercel/kv'

describe('GitHub Proxy with OAuth Support', () => {
  let req: Partial<VercelRequest>
  let res: Partial<VercelResponse>
  let originalEnv: NodeJS.ProcessEnv
  let originalFetch: typeof global.fetch

  beforeEach(() => {
    // Save originals
    originalEnv = { ...process.env }
    originalFetch = global.fetch

    // Setup environment
    process.env.GITHUB_TOKEN = 'demo_token_123'
    process.env.KV_REST_API_URL = 'http://kv.test'
    process.env.KV_REST_API_TOKEN = 'kv_token'

    // Create mock request
    req = {
      method: 'POST',
      body: {
        query: 'query { viewer { login } }',
        variables: {},
        cacheKey: 'test-key',
      },
      headers: {},
    }

    // Create mock response
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    }

    // Mock fetch
    global.fetch = vi.fn()
  })

  afterEach(() => {
    // Restore
    process.env = originalEnv
    global.fetch = originalFetch
    vi.clearAllMocks()
  })

  describe('Demo Mode (Unauthenticated)', () => {
    it('должен использовать GITHUB_TOKEN для неавторизованных', async () => {
      // No session cookie
      req.headers = {}

      // Mock GitHub API response
      const mockHeaders = new Map([
        ['X-RateLimit-Remaining', '5000'],
        ['X-RateLimit-Limit', '5000'],
        ['X-RateLimit-Reset', '1234567890'],
        ['X-RateLimit-Used', '0'],
      ])

      ;(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
        ok: true,
        json: async () => ({ data: { viewer: { login: 'testuser' } } }),
        headers: mockHeaders,
      } as Response)

      vi.mocked(kv.get).mockResolvedValue(null)
      vi.mocked(kv.set).mockResolvedValue('OK')

      await handler(req as VercelRequest, res as VercelResponse)

      // Verify demo token used
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.github.com/graphql',
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer demo_token_123',
          }),
        })
      )

      // Verify response includes isDemo flag
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.any(Object),
          rateLimit: expect.objectContaining({
            isDemo: true,
            remaining: 5000,
            limit: 5000,
          }),
        })
      )
    })

    it('должен кешировать с префиксом demo:', async () => {
      req.headers = {}

      const mockHeaders = new Map([
        ['X-RateLimit-Remaining', '5000'],
        ['X-RateLimit-Limit', '5000'],
        ['X-RateLimit-Reset', '1234567890'],
        ['X-RateLimit-Used', '0'],
      ])

      ;(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
        ok: true,
        json: async () => ({ data: 'test' }),
        headers: mockHeaders,
      } as Response)

      vi.mocked(kv.get).mockResolvedValue(null)
      vi.mocked(kv.set).mockResolvedValue('OK')

      await handler(req as VercelRequest, res as VercelResponse)

      // Verify demo cache key
      expect(kv.set).toHaveBeenCalledWith(
        'demo:test-key',
        expect.any(Object),
        { ex: 1800 } // 30 minutes for demo
      )
    })
  })

  describe('OAuth Mode (Authenticated)', () => {
    it('должен использовать user token для авторизованных', async () => {
      const mockSession = {
        userId: 123,
        login: 'authuser',
        avatarUrl: 'http://example.com/avatar.png',
        accessToken: 'user_token_456',
        createdAt: Date.now(),
      }

      req.headers = { cookie: 'session=valid_session_id' }

      // kv.get is called twice: first for session, then for cache check
      vi.mocked(kv.get)
        .mockResolvedValueOnce(mockSession) // session check
        .mockResolvedValueOnce(null) // cache check (no cache)

      const mockHeaders = new Map([
        ['X-RateLimit-Remaining', '4999'],
        ['X-RateLimit-Limit', '5000'],
        ['X-RateLimit-Reset', '1234567890'],
        ['X-RateLimit-Used', '1'],
      ])

      ;(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
        ok: true,
        json: async () => ({ data: 'test' }),
        headers: mockHeaders,
      } as Response)

      vi.mocked(kv.set).mockResolvedValue('OK')

      await handler(req as VercelRequest, res as VercelResponse)

      // Verify user token used
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.github.com/graphql',
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer user_token_456',
          }),
        })
      )

      // Verify response includes user info
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          rateLimit: expect.objectContaining({
            isDemo: false,
            userLogin: 'authuser',
          }),
        })
      )
    })

    it('должен кешировать с префиксом user:session:', async () => {
      const mockSession = {
        userId: 123,
        login: 'authuser',
        avatarUrl: 'http://example.com/avatar.png',
        accessToken: 'user_token',
        createdAt: Date.now(),
      }

      req.headers = { cookie: 'session=session123' }

      vi.mocked(kv.get)
        .mockResolvedValueOnce(mockSession) // Session lookup
        .mockResolvedValueOnce(null) // Cache miss

      const mockHeaders = new Map([
        ['X-RateLimit-Remaining', '5000'],
        ['X-RateLimit-Limit', '5000'],
        ['X-RateLimit-Reset', '1234567890'],
        ['X-RateLimit-Used', '0'],
      ])

      ;(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
        ok: true,
        json: async () => ({ data: 'test' }),
        headers: mockHeaders,
      } as Response)

      vi.mocked(kv.set).mockResolvedValue('OK')

      await handler(req as VercelRequest, res as VercelResponse)

      // Verify user cache key
      expect(kv.set).toHaveBeenCalledWith(
        'user:session123:test-key',
        expect.any(Object),
        { ex: 600 } // 10 minutes for authenticated
      )
    })

    it('должен fallback на demo если session expired', async () => {
      req.headers = { cookie: 'session=expired_session' }

      vi.mocked(kv.get).mockResolvedValue(null) // Session not found

      const mockHeaders = new Map([
        ['X-RateLimit-Remaining', '5000'],
        ['X-RateLimit-Limit', '5000'],
        ['X-RateLimit-Reset', '1234567890'],
        ['X-RateLimit-Used', '0'],
      ])

      ;(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
        ok: true,
        json: async () => ({ data: 'test' }),
        headers: mockHeaders,
      } as Response)

      vi.mocked(kv.set).mockResolvedValue('OK')

      await handler(req as VercelRequest, res as VercelResponse)

      // Should use demo token
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.github.com/graphql',
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer demo_token_123',
          }),
        })
      )

      // Should be demo mode
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          rateLimit: expect.objectContaining({
            isDemo: true,
          }),
        })
      )
    })
  })

  describe('Rate Limit Extraction', () => {
    it('должен извлекать rate limit из headers', async () => {
      req.headers = {}

      const mockHeaders = new Map([
        ['X-RateLimit-Remaining', '4567'],
        ['X-RateLimit-Limit', '5000'],
        ['X-RateLimit-Reset', '1704067200'],
        ['X-RateLimit-Used', '433'],
      ])

      ;(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
        ok: true,
        json: async () => ({ data: 'test' }),
        headers: mockHeaders,
      } as Response)

      vi.mocked(kv.get).mockResolvedValue(null)
      vi.mocked(kv.set).mockResolvedValue('OK')

      await handler(req as VercelRequest, res as VercelResponse)

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          rateLimit: {
            remaining: 4567,
            limit: 5000,
            reset: 1704067200,
            used: 433,
            isDemo: true,
            userLogin: undefined,
          },
        })
      )
    })

    it('должен использовать defaults если headers отсутствуют', async () => {
      req.headers = {}

      const mockHeaders = new Map() // Empty headers

      ;(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
        ok: true,
        json: async () => ({ data: 'test' }),
        headers: mockHeaders,
      } as Response)

      vi.mocked(kv.get).mockResolvedValue(null)
      vi.mocked(kv.set).mockResolvedValue('OK')

      await handler(req as VercelRequest, res as VercelResponse)

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          rateLimit: expect.objectContaining({
            remaining: 0,
            limit: 5000,
            reset: 0,
            used: 0,
          }),
        })
      )
    })
  })

  describe('Error Handling', () => {
    it('должен вернуть 405 для non-POST запросов', async () => {
      req.method = 'GET'

      await handler(req as VercelRequest, res as VercelResponse)

      expect(res.status).toHaveBeenCalledWith(405)
      expect(res.json).toHaveBeenCalledWith({ error: 'Method not allowed' })
    })

    it('должен вернуть 400 если query отсутствует', async () => {
      req.body = { variables: {} }

      await handler(req as VercelRequest, res as VercelResponse)

      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith({ error: 'Query is required' })
    })

    it('должен обработать GraphQL errors', async () => {
      req.headers = {}

      const mockHeaders = new Map([
        ['X-RateLimit-Remaining', '5000'],
        ['X-RateLimit-Limit', '5000'],
      ])

      ;(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
        ok: true,
        json: async () => ({
          errors: [{ message: 'Field not found' }],
        }),
        headers: mockHeaders,
      } as Response)

      vi.mocked(kv.get).mockResolvedValue(null)

      await handler(req as VercelRequest, res as VercelResponse)

      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith({
        errors: [{ message: 'Field not found' }],
      })
    })

    it('должен обработать GitHub API errors', async () => {
      req.headers = {}

      ;(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
        ok: false,
        status: 503,
        statusText: 'Service Unavailable',
      } as Response)

      vi.mocked(kv.get).mockResolvedValue(null)

      await handler(req as VercelRequest, res as VercelResponse)

      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith({
        error: 'Failed to fetch from GitHub',
        message: expect.stringContaining('503'),
      })
    })

    it('должен обработать отсутствие токена', async () => {
      delete process.env.GITHUB_TOKEN
      req.headers = {}

      vi.mocked(kv.get).mockResolvedValue(null)

      await handler(req as VercelRequest, res as VercelResponse)

      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith({
        error: 'No token available',
        message: expect.stringContaining('token'),
      })
    })
  })

  describe('Caching', () => {
    it('должен вернуть cached data если доступен', async () => {
      req.headers = {}

      const cachedData = {
        data: { cached: true },
        rateLimit: { remaining: 5000, limit: 5000, reset: 0, used: 0, isDemo: true },
      }

      vi.mocked(kv.get).mockResolvedValue(cachedData)

      await handler(req as VercelRequest, res as VercelResponse)

      // Should not call GitHub API
      expect(global.fetch).not.toHaveBeenCalled()

      // Should return cached data
      expect(res.json).toHaveBeenCalledWith(cachedData)
    })

    it('должен работать без KV (graceful degradation)', async () => {
      // Disable KV
      delete process.env.KV_REST_API_URL
      delete process.env.KV_REST_API_TOKEN

      req.headers = {}

      const mockHeaders = new Map([
        ['X-RateLimit-Remaining', '5000'],
        ['X-RateLimit-Limit', '5000'],
        ['X-RateLimit-Reset', '1234567890'],
        ['X-RateLimit-Used', '0'],
      ])

      ;(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
        ok: true,
        json: async () => ({ data: 'test' }),
        headers: mockHeaders,
      } as Response)

      // Re-import handler to apply new env
      const freshHandlerModule = await import('./github-proxy?t=' + Date.now())
      await freshHandlerModule.default(req as VercelRequest, res as VercelResponse)

      // Should still work
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          data: 'test',
        })
      )
    })
  })
})
