import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import type { VercelRequest, VercelResponse } from '@vercel/node'
import handler from './callback'

// Mock @vercel/kv
vi.mock('@vercel/kv', () => ({
  kv: {
    set: vi.fn(),
    get: vi.fn(),
    del: vi.fn(),
  },
}))

// Import mocked kv after mock setup
import { kv } from '@vercel/kv'

describe('OAuth Callback Endpoint', () => {
  let req: Partial<VercelRequest>
  let res: Partial<VercelResponse>
  let originalEnv: NodeJS.ProcessEnv
  let originalFetch: typeof global.fetch

  beforeEach(() => {
    // Save originals
    originalEnv = { ...process.env }
    originalFetch = global.fetch

    // Setup environment
    process.env.GITHUB_OAUTH_CLIENT_ID = 'test_client_id'
    process.env.GITHUB_OAUTH_CLIENT_SECRET = 'test_client_secret'

    // Create mock request
    req = {
      method: 'GET',
      query: {
        code: 'test_code',
        state: 'test_state',
      },
      headers: {
        cookie: 'oauth_state=test_state',
      },
    }

    // Create mock response
    res = {
      redirect: vi.fn(),
      setHeader: vi.fn(),
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    }

    // Mock fetch globally
    global.fetch = vi.fn()
  })

  afterEach(() => {
    // Restore
    process.env = originalEnv
    global.fetch = originalFetch
    vi.clearAllMocks()
  })

  it('должен успешно обработать OAuth callback и создать сессию', async () => {
    const mockAccessToken = 'gho_test_access_token'
    const mockUser = {
      id: 12345,
      login: 'testuser',
      avatar_url: 'https://avatars.githubusercontent.com/u/12345',
    }

    // Mock fetch responses
    ;(global.fetch as ReturnType<typeof vi.fn>)
      // Token exchange
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ access_token: mockAccessToken }),
      } as Response)
      // User info
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockUser,
      } as Response)

    // Mock KV set
    vi.mocked(kv.set).mockResolvedValue('OK')

    await handler(req as VercelRequest, res as VercelResponse)

    // Verify token exchange call
    expect(global.fetch).toHaveBeenCalledWith(
      'https://github.com/login/oauth/access_token',
      expect.objectContaining({
        method: 'POST',
        body: expect.stringContaining('test_code'),
      })
    )

    // Verify user info call
    expect(global.fetch).toHaveBeenCalledWith(
      'https://api.github.com/user',
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: `Bearer ${mockAccessToken}`,
        }),
      })
    )

    // Verify session creation
    expect(kv.set).toHaveBeenCalledWith(
      expect.stringMatching(/^session:/),
      expect.objectContaining({
        userId: 12345,
        login: 'testuser',
        avatarUrl: 'https://avatars.githubusercontent.com/u/12345',
        accessToken: mockAccessToken,
      }),
      { ex: 86400 * 30 }
    )

    // Verify cookies set
    expect(res.setHeader).toHaveBeenCalledWith(
      'Set-Cookie',
      expect.arrayContaining([
        expect.stringMatching(/^session=.+; HttpOnly; Secure/),
        expect.stringMatching(/^oauth_state=; .+ Max-Age=0/),
      ])
    )

    // Verify redirect to success
    expect(res.redirect).toHaveBeenCalledWith('/?auth=success')
  })

  it('должен отклонить запрос с неверным state (CSRF)', async () => {
    req.headers = { cookie: 'oauth_state=correct_state' }
    req.query = { code: 'test_code', state: 'wrong_state' }

    await handler(req as VercelRequest, res as VercelResponse)

    expect(res.redirect).toHaveBeenCalledWith('/?error=csrf_failed')
    expect(global.fetch).not.toHaveBeenCalled()
    expect(kv.set).not.toHaveBeenCalled()
  })

  it('должен обработать отсутствие oauth_state cookie', async () => {
    req.headers = {}

    await handler(req as VercelRequest, res as VercelResponse)

    expect(res.redirect).toHaveBeenCalledWith('/?error=csrf_failed')
  })

  it('должен обработать отсутствие code параметра', async () => {
    req.query = { state: 'test_state' }

    await handler(req as VercelRequest, res as VercelResponse)

    expect(res.redirect).toHaveBeenCalledWith('/?error=no_code')
  })

  it('должен обработать отсутствие state параметра', async () => {
    req.query = { code: 'test_code' }

    await handler(req as VercelRequest, res as VercelResponse)

    expect(res.redirect).toHaveBeenCalledWith('/?error=no_state')
  })

  it('должен обработать ошибку при обмене кода на токен', async () => {
    ;(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: false,
      statusText: 'Bad Request',
    } as Response)

    await handler(req as VercelRequest, res as VercelResponse)

    expect(res.redirect).toHaveBeenCalledWith('/?error=auth_failed')
    expect(kv.set).not.toHaveBeenCalled()
  })

  it('должен обработать отсутствие access_token в ответе', async () => {
    ;(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ error: 'invalid_grant' }),
    } as Response)

    await handler(req as VercelRequest, res as VercelResponse)

    expect(res.redirect).toHaveBeenCalledWith('/?error=auth_failed')
  })

  it('должен обработать ошибку при получении user info', async () => {
    ;(global.fetch as ReturnType<typeof vi.fn>)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ access_token: 'token' }),
      } as Response)
      .mockResolvedValueOnce({
        ok: false,
        statusText: 'Unauthorized',
      } as Response)

    await handler(req as VercelRequest, res as VercelResponse)

    expect(res.redirect).toHaveBeenCalledWith('/?error=auth_failed')
    expect(kv.set).not.toHaveBeenCalled()
  })

  it('должен обработать ошибку при сохранении в KV', async () => {
    const mockAccessToken = 'gho_test_token'
    const mockUser = { id: 123, login: 'test', avatar_url: 'http://example.com' }

    ;(global.fetch as ReturnType<typeof vi.fn>)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ access_token: mockAccessToken }),
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockUser,
      } as Response)

    // Mock KV error
    vi.mocked(kv.set).mockRejectedValue(new Error('KV unavailable'))

    await handler(req as VercelRequest, res as VercelResponse)

    expect(res.redirect).toHaveBeenCalledWith('/?error=auth_failed')
  })

  it('должен использовать fallback аватар если avatar_url отсутствует', async () => {
    const mockUser = { id: 123, login: 'testuser' } // No avatar_url

    ;(global.fetch as ReturnType<typeof vi.fn>)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ access_token: 'token' }),
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockUser,
      } as Response)

    vi.mocked(kv.set).mockResolvedValue('OK')

    await handler(req as VercelRequest, res as VercelResponse)

    expect(kv.set).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        avatarUrl: 'https://github.com/testuser.png',
      }),
      expect.any(Object)
    )
  })

  it('должен отклонить не-GET запросы', async () => {
    req.method = 'POST'

    await handler(req as VercelRequest, res as VercelResponse)

    expect(res.status).toHaveBeenCalledWith(405)
    expect(res.json).toHaveBeenCalledWith({ error: 'Method not allowed' })
  })

  it('должен обработать отсутствие OAuth конфигурации', async () => {
    delete process.env.GITHUB_OAUTH_CLIENT_ID
    delete process.env.GITHUB_OAUTH_CLIENT_SECRET

    await handler(req as VercelRequest, res as VercelResponse)

    expect(res.redirect).toHaveBeenCalledWith('/?error=oauth_not_configured')
  })
})
