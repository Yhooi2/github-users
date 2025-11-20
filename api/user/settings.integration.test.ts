/**
 * API Integration Tests for User Settings Endpoint
 *
 * These tests cover scenarios that were skipped in unit tests due to mock pollution.
 * Integration tests call the handler directly with realistic mock setup,
 * avoiding vi.clearAllMocks() interference.
 *
 * Covered scenarios:
 * - DELETE endpoint (reset settings to defaults)
 * - HTTP method validation (POST, HEAD, etc.)
 * - Error handling for PUT/PATCH/DELETE operations
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import type { VercelRequest, VercelResponse } from '@vercel/node'
import handler from './settings'

// Mock @vercel/kv
vi.mock('@vercel/kv', () => ({
  kv: {
    get: vi.fn(),
    set: vi.fn(),
    del: vi.fn(),
  },
}))

import { kv } from '@vercel/kv'

// Mock session data
const mockSession = {
  userId: 12345,
  login: 'octocat',
  accessToken: 'gho_test_token',
  avatarUrl: 'https://github.com/octocat.png',
  createdAt: Date.now() - 86400000, // 1 day ago
}

// Mock settings data
const mockSettings = {
  userId: 12345,
  login: 'octocat',
  preferences: {
    defaultAnalyticsPeriod: 'day' as const,
    defaultView: 'card' as const,
    itemsPerPage: 10,
    emailNotifications: false,
    autoRefreshDashboard: false,
    refreshInterval: 30000,
  },
  createdAt: 1234567890000,
  updatedAt: 1234567890000,
}

describe('User Settings API - Integration Tests', () => {
  let req: Partial<VercelRequest>
  let res: Partial<VercelResponse>

  beforeEach(() => {
    // Setup request mock
    req = {
      method: 'GET',
      headers: {
        cookie: 'session=abc123def456',
      },
      body: {},
    }

    // Setup response mock
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
      send: vi.fn().mockReturnThis(),
    }

    // Reset mocks (but don't clear implementations)
    vi.mocked(kv.get).mockReset()
    vi.mocked(kv.set).mockReset()
    vi.mocked(kv.del).mockReset()

    // Default: Mock successful session lookup
    vi.mocked(kv.get).mockResolvedValue(mockSession as any)
  })

  describe('DELETE - Reset Settings (Integration)', () => {
    it('должен удалить настройки из KV', async () => {
      req.method = 'DELETE'

      // Mock successful session lookup
      vi.mocked(kv.get).mockResolvedValueOnce(mockSession as any)
      vi.mocked(kv.del).mockResolvedValueOnce(1)

      await handler(req as VercelRequest, res as VercelResponse)

      expect(kv.del).toHaveBeenCalledWith('user:12345:settings')
      expect(res.status).toHaveBeenCalledWith(204)
      expect(res.send).toHaveBeenCalledWith('')
    })

    it('должен вернуть 401 если нет session cookie', async () => {
      req.method = 'DELETE'
      req.headers = {} // No cookie

      await handler(req as VercelRequest, res as VercelResponse)

      expect(kv.del).not.toHaveBeenCalled()
      expect(res.status).toHaveBeenCalledWith(401)
      expect(res.json).toHaveBeenCalledWith({
        error: 'Unauthorized',
        message: 'No valid session found. Please sign in.',
      })
    })

    it('должен вернуть 401 если session не найдена', async () => {
      req.method = 'DELETE'

      // Mock: session not found in KV
      vi.mocked(kv.get).mockResolvedValueOnce(null)

      await handler(req as VercelRequest, res as VercelResponse)

      expect(kv.del).not.toHaveBeenCalled()
      expect(res.status).toHaveBeenCalledWith(401)
      expect(res.json).toHaveBeenCalledWith({
        error: 'Unauthorized',
        message: 'Invalid or expired session. Please sign in again.',
      })
    })
  })

  describe('HTTP Method Validation (Integration)', () => {
    it('должен отклонить POST запрос', async () => {
      req.method = 'POST'

      // Mock successful session lookup
      vi.mocked(kv.get).mockResolvedValueOnce(mockSession as any)

      await handler(req as VercelRequest, res as VercelResponse)

      expect(res.status).toHaveBeenCalledWith(405)
      expect(res.json).toHaveBeenCalledWith({
        error: 'Method not allowed',
        message: 'Method POST is not supported. Use GET, PUT, PATCH, or DELETE.',
      })
    })

    it('должен отклонить HEAD запрос', async () => {
      req.method = 'HEAD'

      // Mock successful session lookup
      vi.mocked(kv.get).mockResolvedValueOnce(mockSession as any)

      await handler(req as VercelRequest, res as VercelResponse)

      expect(res.status).toHaveBeenCalledWith(405)
      expect(res.json).toHaveBeenCalledWith({
        error: 'Method not allowed',
        message: 'Method HEAD is not supported. Use GET, PUT, PATCH, or DELETE.',
      })
    })

    it('должен отклонить OPTIONS запрос', async () => {
      req.method = 'OPTIONS'

      // Mock successful session lookup
      vi.mocked(kv.get).mockResolvedValueOnce(mockSession as any)

      await handler(req as VercelRequest, res as VercelResponse)

      expect(res.status).toHaveBeenCalledWith(405)
      expect(res.json).toHaveBeenCalledWith({
        error: 'Method not allowed',
        message: 'Method OPTIONS is not supported. Use GET, PUT, PATCH, or DELETE.',
      })
    })
  })

  describe('Error Handling (Integration)', () => {
    it('должен обработать ошибку при сохранении настроек (PUT)', async () => {
      req.method = 'PUT'
      req.body = {
        preferences: {
          defaultView: 'table',
        },
      }

      // Mock successful session lookup
      vi.mocked(kv.get)
        .mockResolvedValueOnce(mockSession as any) // Session
        .mockResolvedValueOnce(mockSettings as any) // Existing settings

      // Mock save failure
      vi.mocked(kv.set).mockRejectedValueOnce(new Error('KV write failed'))

      await handler(req as VercelRequest, res as VercelResponse)

      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith({
        error: 'Internal server error',
        message: 'KV write failed',
      })
    })

    it('должен обработать ошибку при сохранении настроек (PATCH)', async () => {
      req.method = 'PATCH'
      req.body = {
        preferences: {
          emailNotifications: true,
        },
      }

      // Mock successful session lookup
      vi.mocked(kv.get)
        .mockResolvedValueOnce(mockSession as any) // Session
        .mockResolvedValueOnce(mockSettings as any) // Existing settings

      // Mock save failure
      vi.mocked(kv.set).mockRejectedValueOnce(new Error('KV connection timeout'))

      await handler(req as VercelRequest, res as VercelResponse)

      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith({
        error: 'Internal server error',
        message: 'KV connection timeout',
      })
    })

    it('должен обработать ошибку при удалении настроек (DELETE)', async () => {
      req.method = 'DELETE'

      // Mock successful session lookup
      vi.mocked(kv.get).mockResolvedValueOnce(mockSession as any)

      // Mock delete failure
      vi.mocked(kv.del).mockRejectedValueOnce(new Error('KV delete failed'))

      await handler(req as VercelRequest, res as VercelResponse)

      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith({
        error: 'Internal server error',
        message: 'KV delete failed',
      })
    })

    it('должен обработать ошибку при чтении существующих настроек (PUT)', async () => {
      req.method = 'PUT'
      req.body = {
        preferences: {
          defaultView: 'table',
        },
      }

      // Mock successful session lookup
      vi.mocked(kv.get)
        .mockResolvedValueOnce(mockSession as any) // Session
        .mockRejectedValueOnce(new Error('KV read failed')) // Settings fetch fails

      await handler(req as VercelRequest, res as VercelResponse)

      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith({
        error: 'Internal server error',
        message: 'KV read failed',
      })
    })
  })

  describe('Edge Cases (Integration)', () => {
    it('должен обработать DELETE если настроек не существует', async () => {
      req.method = 'DELETE'

      // Mock successful session lookup
      vi.mocked(kv.get).mockResolvedValueOnce(mockSession as any)

      // Mock successful delete (even if nothing to delete)
      vi.mocked(kv.del).mockResolvedValueOnce(0) // 0 = nothing deleted

      await handler(req as VercelRequest, res as VercelResponse)

      expect(kv.del).toHaveBeenCalledWith('user:12345:settings')
      expect(res.status).toHaveBeenCalledWith(204)
      expect(res.send).toHaveBeenCalledWith('')
    })

    it('должен создать defaults при PUT если настроек нет', async () => {
      req.method = 'PUT'
      req.body = {
        preferences: {
          defaultView: 'table',
          itemsPerPage: 25,
        },
      }

      const now = Date.now()
      vi.spyOn(Date, 'now').mockReturnValue(now)

      // Mock successful session lookup
      vi.mocked(kv.get)
        .mockResolvedValueOnce(mockSession as any) // Session
        .mockResolvedValueOnce(null) // No existing settings

      vi.mocked(kv.set).mockResolvedValueOnce('OK' as any)

      await handler(req as VercelRequest, res as VercelResponse)

      expect(kv.set).toHaveBeenCalledWith(
        'user:12345:settings',
        {
          userId: 12345,
          login: 'octocat',
          preferences: {
            defaultView: 'table',
            itemsPerPage: 25,
          },
          createdAt: now,
          updatedAt: now,
        },
        { ex: 2592000 }
      )
      expect(res.status).toHaveBeenCalledWith(200)
    })

    it('должен сохранить PATCH если настроек нет (создать с defaults)', async () => {
      req.method = 'PATCH'
      req.body = {
        preferences: {
          emailNotifications: true,
        },
      }

      const now = Date.now()
      vi.spyOn(Date, 'now').mockReturnValue(now)

      // Mock successful session lookup
      vi.mocked(kv.get)
        .mockResolvedValueOnce(mockSession as any) // Session
        .mockResolvedValueOnce(null) // No existing settings

      vi.mocked(kv.set).mockResolvedValueOnce('OK' as any)

      await handler(req as VercelRequest, res as VercelResponse)

      // Should merge with defaults
      expect(kv.set).toHaveBeenCalledWith(
        'user:12345:settings',
        {
          userId: 12345,
          login: 'octocat',
          preferences: {
            defaultAnalyticsPeriod: 'day',
            defaultView: 'card',
            itemsPerPage: 10,
            emailNotifications: true, // ← Updated
            autoRefreshDashboard: false,
            refreshInterval: 30000,
          },
          createdAt: now,
          updatedAt: now,
        },
        { ex: 2592000 }
      )
      expect(res.status).toHaveBeenCalledWith(200)
    })
  })

  describe('Full Flow Scenarios (Integration)', () => {
    it('должен выполнить полный flow: GET → PATCH → DELETE', async () => {
      // Step 1: GET - Create defaults
      req.method = 'GET'
      vi.mocked(kv.get)
        .mockResolvedValueOnce(mockSession as any)
        .mockResolvedValueOnce(null) // No settings yet

      const now = Date.now()
      vi.spyOn(Date, 'now').mockReturnValue(now)

      await handler(req as VercelRequest, res as VercelResponse)

      expect(kv.set).toHaveBeenCalledTimes(1) // Created defaults
      expect(res.status).toHaveBeenCalledWith(200)

      // Reset for next request
      vi.mocked(kv.set).mockClear()
      ;(res.status as any).mockClear()
      ;(res.json as any).mockClear()

      // Step 2: PATCH - Update settings
      req.method = 'PATCH'
      req.body = {
        preferences: {
          defaultView: 'table',
          itemsPerPage: 50,
        },
      }

      vi.mocked(kv.get)
        .mockResolvedValueOnce(mockSession as any)
        .mockResolvedValueOnce({
          ...mockSettings,
          createdAt: now,
          updatedAt: now,
        } as any)

      vi.mocked(kv.set).mockResolvedValueOnce('OK' as any)

      await handler(req as VercelRequest, res as VercelResponse)

      expect(kv.set).toHaveBeenCalledTimes(1)
      expect(res.status).toHaveBeenCalledWith(200)

      // Reset for next request
      vi.mocked(kv.del).mockClear()
      ;(res.status as any).mockClear()
      ;(res.send as any).mockClear()

      // Step 3: DELETE - Reset settings
      req.method = 'DELETE'
      req.body = {}

      vi.mocked(kv.get).mockResolvedValueOnce(mockSession as any)
      vi.mocked(kv.del).mockResolvedValueOnce(1)

      await handler(req as VercelRequest, res as VercelResponse)

      expect(kv.del).toHaveBeenCalledWith('user:12345:settings')
      expect(res.status).toHaveBeenCalledWith(204)
      expect(res.send).toHaveBeenCalledWith('')
    })
  })
})
