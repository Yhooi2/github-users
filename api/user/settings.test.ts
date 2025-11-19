import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import type { VercelRequest, VercelResponse } from '@vercel/node'
import { kv } from '@vercel/kv'
import handler, { type UserSettings } from './settings'

// Mock Vercel KV
vi.mock('@vercel/kv', () => ({
  kv: {
    get: vi.fn(),
    set: vi.fn(),
    del: vi.fn(),
  },
}))

describe('api/user/settings', () => {
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>
  let consoleLogSpy: ReturnType<typeof vi.spyOn>
  let mockReq: Partial<VercelRequest>
  let mockRes: Partial<VercelResponse>
  let statusMock: ReturnType<typeof vi.fn>
  let jsonMock: ReturnType<typeof vi.fn>
  let sendMock: ReturnType<typeof vi.fn>

  const mockUser = {
    userId: 123,
    login: 'testuser',
    accessToken: 'token-abc',
    avatarUrl: 'https://avatar.url',
    createdAt: Date.now(),
  }

  const mockSettings: UserSettings = {
    userId: 123,
    login: 'testuser',
    preferences: {
      defaultAnalyticsPeriod: 'day',
      defaultView: 'card',
      itemsPerPage: 10,
      emailNotifications: false,
      autoRefreshDashboard: false,
      refreshInterval: 30000,
    },
    createdAt: Date.now() - 86400000,
    updatedAt: Date.now(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

    // Setup mock response
    jsonMock = vi.fn()
    sendMock = vi.fn()
    statusMock = vi.fn().mockReturnValue({ json: jsonMock, send: sendMock })

    mockRes = {
      status: statusMock,
      json: jsonMock,
      send: sendMock,
    }

    // Setup default mock request
    mockReq = {
      method: 'GET',
      headers: {},
      body: {},
    }
  })

  afterEach(() => {
    consoleErrorSpy.mockRestore()
    consoleLogSpy.mockRestore()
  })

  describe('Session Authentication', () => {
    it(
      'возвращает 401 если cookie отсутствует',
      async () => {
        mockReq.headers = {} // no cookie

        await handler(mockReq as VercelRequest, mockRes as VercelResponse)

        expect(statusMock).toHaveBeenCalledWith(401)
        expect(jsonMock).toHaveBeenCalledWith({
          error: 'Unauthorized',
          message: 'No valid session found. Please sign in.',
        })
      },
      10000
    )

    it(
      'возвращает 401 если session cookie отсутствует',
      async () => {
        mockReq.headers = { cookie: 'other_cookie=value' }

        await handler(mockReq as VercelRequest, mockRes as VercelResponse)

        expect(statusMock).toHaveBeenCalledWith(401)
        expect(jsonMock).toHaveBeenCalledWith({
          error: 'Unauthorized',
          message: 'No valid session found. Please sign in.',
        })
      },
      10000
    )

    it(
      'возвращает 401 если сессия невалидна (user not found)',
      async () => {
        mockReq.headers = { cookie: 'session=invalid-session-id' }
        vi.mocked(kv.get).mockResolvedValue(null) // session not found

        await handler(mockReq as VercelRequest, mockRes as VercelResponse)

        expect(statusMock).toHaveBeenCalledWith(401)
        expect(jsonMock).toHaveBeenCalledWith({
          error: 'Unauthorized',
          message: 'Invalid or expired session. Please sign in again.',
        })
      },
      10000
    )

    it(
      'возвращает 401 если KV.get выбрасывает exception',
      async () => {
        mockReq.headers = { cookie: 'session=valid-session-id' }
        vi.mocked(kv.get).mockRejectedValue(new Error('KV timeout'))

        await handler(mockReq as VercelRequest, mockRes as VercelResponse)

        expect(statusMock).toHaveBeenCalledWith(401)
        expect(consoleErrorSpy).toHaveBeenCalledWith(
          'Failed to get user from session:',
          expect.any(Error)
        )
      },
      10000
    )

    it(
      'извлекает session ID из cookie с несколькими cookies',
      async () => {
        mockReq.headers = { cookie: 'other=value; session=abc123; another=value' }
        vi.mocked(kv.get)
          .mockResolvedValueOnce(mockUser) // session lookup
          .mockResolvedValueOnce(mockSettings) // settings lookup

        await handler(mockReq as VercelRequest, mockRes as VercelResponse)

        expect(kv.get).toHaveBeenCalledWith('session:abc123')
        expect(statusMock).toHaveBeenCalledWith(200)
      },
      10000
    )
  })

  describe('GET - Retrieve Settings', () => {
    beforeEach(() => {
      mockReq.method = 'GET'
      mockReq.headers = { cookie: 'session=valid-session' }
    })

    it(
      'возвращает существующие настройки пользователя',
      async () => {
        vi.mocked(kv.get)
          .mockResolvedValueOnce(mockUser) // session
          .mockResolvedValueOnce(mockSettings) // settings

        await handler(mockReq as VercelRequest, mockRes as VercelResponse)

        expect(statusMock).toHaveBeenCalledWith(200)
        expect(jsonMock).toHaveBeenCalledWith(mockSettings)
        expect(kv.get).toHaveBeenCalledWith('user:123:settings')
      },
      10000
    )

    it(
      'создаёт дефолтные настройки если они не существуют',
      async () => {
        vi.mocked(kv.get)
          .mockResolvedValueOnce(mockUser) // session
          .mockResolvedValueOnce(null) // no settings

        vi.mocked(kv.set).mockResolvedValue('OK')

        await handler(mockReq as VercelRequest, mockRes as VercelResponse)

        expect(statusMock).toHaveBeenCalledWith(200)

        const response = jsonMock.mock.calls[0][0]
        expect(response.userId).toBe(123)
        expect(response.login).toBe('testuser')
        expect(response.preferences).toEqual({
          defaultAnalyticsPeriod: 'day',
          defaultView: 'card',
          itemsPerPage: 10,
          emailNotifications: false,
          autoRefreshDashboard: false,
          refreshInterval: 30000,
        })
        expect(response.createdAt).toBeGreaterThan(0)
        expect(response.updatedAt).toBeGreaterThan(0)

        // Verify settings were saved with 30-day TTL
        expect(kv.set).toHaveBeenCalledWith(
          'user:123:settings',
          expect.objectContaining({ userId: 123 }),
          { ex: 2592000 }
        )
      },
      10000
    )

    it(
      'устанавливает правильный TTL (30 дней = 2592000 секунд)',
      async () => {
        vi.mocked(kv.get)
          .mockResolvedValueOnce(mockUser)
          .mockResolvedValueOnce(null)

        vi.mocked(kv.set).mockResolvedValue('OK')

        await handler(mockReq as VercelRequest, mockRes as VercelResponse)

        expect(kv.set).toHaveBeenCalledWith(
          expect.any(String),
          expect.any(Object),
          { ex: 2592000 }
        )
      },
      10000
    )
  })

  describe('PUT - Full Update', () => {
    beforeEach(() => {
      mockReq.method = 'PUT'
      mockReq.headers = { cookie: 'session=valid-session' }
    })

    it(
      'возвращает 400 если preferences отсутствует',
      async () => {
        vi.mocked(kv.get).mockResolvedValueOnce(mockUser)
        mockReq.body = {} // no preferences

        await handler(mockReq as VercelRequest, mockRes as VercelResponse)

        expect(statusMock).toHaveBeenCalledWith(400)
        expect(jsonMock).toHaveBeenCalledWith({
          error: 'Bad request',
          message: 'Invalid request body. Expected { preferences: {...} }',
        })
      },
      10000
    )

    it(
      'возвращает 400 если preferences не объект',
      async () => {
        vi.mocked(kv.get).mockResolvedValueOnce(mockUser)
        mockReq.body = { preferences: 'string' }

        await handler(mockReq as VercelRequest, mockRes as VercelResponse)

        expect(statusMock).toHaveBeenCalledWith(400)
        expect(jsonMock).toHaveBeenCalledWith({
          error: 'Bad request',
          message: 'Invalid request body. Expected { preferences: {...} }',
        })
      },
      10000
    )

    it(
      'полностью заменяет preferences (PUT)',
      async () => {
        vi.mocked(kv.get)
          .mockResolvedValueOnce(mockUser)
          .mockResolvedValueOnce(mockSettings)

        vi.mocked(kv.set).mockResolvedValue('OK')

        mockReq.body = {
          preferences: {
            defaultAnalyticsPeriod: 'week',
            defaultView: 'table',
            itemsPerPage: 25,
          },
        }

        await handler(mockReq as VercelRequest, mockRes as VercelResponse)

        expect(statusMock).toHaveBeenCalledWith(200)

        const response = jsonMock.mock.calls[0][0]
        expect(response.preferences).toEqual({
          defaultAnalyticsPeriod: 'week',
          defaultView: 'table',
          itemsPerPage: 25,
        })
        // PUT заменяет preferences полностью, не сохраняет старые поля
        expect(response.preferences.emailNotifications).toBeUndefined()
      },
      10000
    )

    it(
      'логирует успешное обновление',
      async () => {
        vi.mocked(kv.get)
          .mockResolvedValueOnce(mockUser)
          .mockResolvedValueOnce(mockSettings)

        vi.mocked(kv.set).mockResolvedValue('OK')

        mockReq.body = {
          preferences: { defaultView: 'table' },
        }

        await handler(mockReq as VercelRequest, mockRes as VercelResponse)

        expect(consoleLogSpy).toHaveBeenCalledWith('User settings updated: testuser (123)')
      },
      10000
    )
  })

  describe('PATCH - Partial Update', () => {
    beforeEach(() => {
      mockReq.method = 'PATCH'
      mockReq.headers = { cookie: 'session=valid-session' }
    })

    it(
      'частично обновляет preferences (PATCH)',
      async () => {
        vi.mocked(kv.get)
          .mockResolvedValueOnce(mockUser)
          .mockResolvedValueOnce(mockSettings)

        vi.mocked(kv.set).mockResolvedValue('OK')

        mockReq.body = {
          preferences: {
            defaultView: 'table',
            emailNotifications: true,
          },
        }

        await handler(mockReq as VercelRequest, mockRes as VercelResponse)

        expect(statusMock).toHaveBeenCalledWith(200)

        const response = jsonMock.mock.calls[0][0]
        expect(response.preferences).toEqual({
          ...mockSettings.preferences,
          defaultView: 'table',
          emailNotifications: true,
        })
        // PATCH сохраняет неизменённые поля
        expect(response.preferences.itemsPerPage).toBe(10)
        expect(response.preferences.refreshInterval).toBe(30000)
      },
      10000
    )

    it(
      'обновляет updatedAt timestamp',
      async () => {
        const oldUpdatedAt = Date.now() - 86400000
        const settingsWithOldTimestamp = { ...mockSettings, updatedAt: oldUpdatedAt }

        vi.mocked(kv.get)
          .mockResolvedValueOnce(mockUser)
          .mockResolvedValueOnce(settingsWithOldTimestamp)

        vi.mocked(kv.set).mockResolvedValue('OK')

        mockReq.body = {
          preferences: { itemsPerPage: 20 },
        }

        const beforeUpdate = Date.now()
        await handler(mockReq as VercelRequest, mockRes as VercelResponse)
        const afterUpdate = Date.now()

        const response = jsonMock.mock.calls[0][0]
        expect(response.updatedAt).toBeGreaterThan(oldUpdatedAt)
        expect(response.updatedAt).toBeGreaterThanOrEqual(beforeUpdate)
        expect(response.updatedAt).toBeLessThanOrEqual(afterUpdate)
      },
      10000
    )

    it(
      'создаёт дефолтные настройки если их нет и затем обновляет',
      async () => {
        vi.mocked(kv.get)
          .mockResolvedValueOnce(mockUser)
          .mockResolvedValueOnce(null) // no existing settings

        vi.mocked(kv.set).mockResolvedValue('OK')

        mockReq.body = {
          preferences: { defaultView: 'table' },
        }

        await handler(mockReq as VercelRequest, mockRes as VercelResponse)

        expect(statusMock).toHaveBeenCalledWith(200)

        const response = jsonMock.mock.calls[0][0]
        // Должны быть установлены defaults + наше изменение
        expect(response.preferences.defaultView).toBe('table')
        expect(response.preferences.itemsPerPage).toBe(10) // default
      },
      10000
    )
  })

  describe('Validation - defaultAnalyticsPeriod', () => {
    beforeEach(() => {
      mockReq.method = 'PATCH'
      mockReq.headers = { cookie: 'session=valid-session' }
      vi.mocked(kv.get)
        .mockResolvedValueOnce(mockUser)
        .mockResolvedValueOnce(mockSettings)
    })

    it(
      'принимает валидный period: hour',
      async () => {
        vi.mocked(kv.set).mockResolvedValue('OK')
        mockReq.body = { preferences: { defaultAnalyticsPeriod: 'hour' } }

        await handler(mockReq as VercelRequest, mockRes as VercelResponse)

        expect(statusMock).toHaveBeenCalledWith(200)
      },
      10000
    )

    it(
      'принимает валидный period: day',
      async () => {
        vi.mocked(kv.set).mockResolvedValue('OK')
        mockReq.body = { preferences: { defaultAnalyticsPeriod: 'day' } }

        await handler(mockReq as VercelRequest, mockRes as VercelResponse)

        expect(statusMock).toHaveBeenCalledWith(200)
      },
      10000
    )

    it(
      'принимает валидный period: week',
      async () => {
        vi.mocked(kv.set).mockResolvedValue('OK')
        mockReq.body = { preferences: { defaultAnalyticsPeriod: 'week' } }

        await handler(mockReq as VercelRequest, mockRes as VercelResponse)

        expect(statusMock).toHaveBeenCalledWith(200)
      },
      10000
    )

    it(
      'принимает валидный period: month',
      async () => {
        vi.mocked(kv.set).mockResolvedValue('OK')
        mockReq.body = { preferences: { defaultAnalyticsPeriod: 'month' } }

        await handler(mockReq as VercelRequest, mockRes as VercelResponse)

        expect(statusMock).toHaveBeenCalledWith(200)
      },
      10000
    )

    it(
      'возвращает 400 для невалидного period',
      async () => {
        mockReq.body = { preferences: { defaultAnalyticsPeriod: 'year' } }

        await handler(mockReq as VercelRequest, mockRes as VercelResponse)

        expect(statusMock).toHaveBeenCalledWith(400)
        expect(jsonMock).toHaveBeenCalledWith({
          error: 'Bad request',
          message: 'Invalid defaultAnalyticsPeriod. Must be: hour, day, week, or month',
        })
      },
      10000
    )
  })

  describe('Validation - defaultView', () => {
    beforeEach(() => {
      mockReq.method = 'PATCH'
      mockReq.headers = { cookie: 'session=valid-session' }
      vi.mocked(kv.get)
        .mockResolvedValueOnce(mockUser)
        .mockResolvedValueOnce(mockSettings)
    })

    it(
      'принимает валидный view: card',
      async () => {
        vi.mocked(kv.set).mockResolvedValue('OK')
        mockReq.body = { preferences: { defaultView: 'card' } }

        await handler(mockReq as VercelRequest, mockRes as VercelResponse)

        expect(statusMock).toHaveBeenCalledWith(200)
      },
      10000
    )

    it(
      'принимает валидный view: table',
      async () => {
        vi.mocked(kv.set).mockResolvedValue('OK')
        mockReq.body = { preferences: { defaultView: 'table' } }

        await handler(mockReq as VercelRequest, mockRes as VercelResponse)

        expect(statusMock).toHaveBeenCalledWith(200)
      },
      10000
    )

    it(
      'возвращает 400 для невалидного view',
      async () => {
        mockReq.body = { preferences: { defaultView: 'grid' } }

        await handler(mockReq as VercelRequest, mockRes as VercelResponse)

        expect(statusMock).toHaveBeenCalledWith(400)
        expect(jsonMock).toHaveBeenCalledWith({
          error: 'Bad request',
          message: 'Invalid defaultView. Must be: card or table',
        })
      },
      10000
    )
  })

  describe('Validation - itemsPerPage', () => {
    beforeEach(() => {
      mockReq.method = 'PATCH'
      mockReq.headers = { cookie: 'session=valid-session' }
      vi.mocked(kv.get)
        .mockResolvedValueOnce(mockUser)
        .mockResolvedValueOnce(mockSettings)
    })

    it(
      'принимает валидное значение: 1 (минимум)',
      async () => {
        vi.mocked(kv.set).mockResolvedValue('OK')
        mockReq.body = { preferences: { itemsPerPage: 1 } }

        await handler(mockReq as VercelRequest, mockRes as VercelResponse)

        expect(statusMock).toHaveBeenCalledWith(200)
      },
      10000
    )

    it(
      'принимает валидное значение: 100 (максимум)',
      async () => {
        vi.mocked(kv.set).mockResolvedValue('OK')
        mockReq.body = { preferences: { itemsPerPage: 100 } }

        await handler(mockReq as VercelRequest, mockRes as VercelResponse)

        expect(statusMock).toHaveBeenCalledWith(200)
      },
      10000
    )

    it(
      'возвращает 400 если itemsPerPage < 1',
      async () => {
        mockReq.body = { preferences: { itemsPerPage: 0 } }

        await handler(mockReq as VercelRequest, mockRes as VercelResponse)

        expect(statusMock).toHaveBeenCalledWith(400)
        expect(jsonMock).toHaveBeenCalledWith({
          error: 'Bad request',
          message: 'Invalid itemsPerPage. Must be between 1 and 100',
        })
      },
      10000
    )

    it(
      'возвращает 400 если itemsPerPage > 100',
      async () => {
        mockReq.body = { preferences: { itemsPerPage: 101 } }

        await handler(mockReq as VercelRequest, mockRes as VercelResponse)

        expect(statusMock).toHaveBeenCalledWith(400)
        expect(jsonMock).toHaveBeenCalledWith({
          error: 'Bad request',
          message: 'Invalid itemsPerPage. Must be between 1 and 100',
        })
      },
      10000
    )
  })

  describe('Validation - refreshInterval', () => {
    beforeEach(() => {
      mockReq.method = 'PATCH'
      mockReq.headers = { cookie: 'session=valid-session' }
      vi.mocked(kv.get)
        .mockResolvedValueOnce(mockUser)
        .mockResolvedValueOnce(mockSettings)
    })

    it(
      'принимает валидное значение: 5000 (минимум - 5 секунд)',
      async () => {
        vi.mocked(kv.set).mockResolvedValue('OK')
        mockReq.body = { preferences: { refreshInterval: 5000 } }

        await handler(mockReq as VercelRequest, mockRes as VercelResponse)

        expect(statusMock).toHaveBeenCalledWith(200)
      },
      10000
    )

    it(
      'принимает валидное значение: 300000 (максимум - 5 минут)',
      async () => {
        vi.mocked(kv.set).mockResolvedValue('OK')
        mockReq.body = { preferences: { refreshInterval: 300000 } }

        await handler(mockReq as VercelRequest, mockRes as VercelResponse)

        expect(statusMock).toHaveBeenCalledWith(200)
      },
      10000
    )

    it(
      'возвращает 400 если refreshInterval < 5000',
      async () => {
        mockReq.body = { preferences: { refreshInterval: 4999 } }

        await handler(mockReq as VercelRequest, mockRes as VercelResponse)

        expect(statusMock).toHaveBeenCalledWith(400)
        expect(jsonMock).toHaveBeenCalledWith({
          error: 'Bad request',
          message: 'Invalid refreshInterval. Must be between 5000 (5s) and 300000 (5min)',
        })
      },
      10000
    )

    it(
      'возвращает 400 если refreshInterval > 300000',
      async () => {
        mockReq.body = { preferences: { refreshInterval: 300001 } }

        await handler(mockReq as VercelRequest, mockRes as VercelResponse)

        expect(statusMock).toHaveBeenCalledWith(400)
        expect(jsonMock).toHaveBeenCalledWith({
          error: 'Bad request',
          message: 'Invalid refreshInterval. Must be between 5000 (5s) and 300000 (5min)',
        })
      },
      10000
    )
  })

  describe('DELETE - Reset Settings', () => {
    beforeEach(() => {
      mockReq.method = 'DELETE'
      mockReq.headers = { cookie: 'session=valid-session' }
    })

    it(
      'удаляет настройки пользователя',
      async () => {
        vi.mocked(kv.get).mockResolvedValueOnce(mockUser)
        vi.mocked(kv.del).mockResolvedValue(1)

        await handler(mockReq as VercelRequest, mockRes as VercelResponse)

        expect(kv.del).toHaveBeenCalledWith('user:123:settings')
        expect(statusMock).toHaveBeenCalledWith(204)
        expect(sendMock).toHaveBeenCalledWith('')
      },
      10000
    )

    it(
      'логирует удаление настроек',
      async () => {
        vi.mocked(kv.get).mockResolvedValueOnce(mockUser)
        vi.mocked(kv.del).mockResolvedValue(1)

        await handler(mockReq as VercelRequest, mockRes as VercelResponse)

        expect(consoleLogSpy).toHaveBeenCalledWith('User settings deleted: testuser (123)')
      },
      10000
    )
  })

  describe('HTTP Method Validation', () => {
    beforeEach(() => {
      mockReq.headers = { cookie: 'session=valid-session' }
      vi.mocked(kv.get).mockResolvedValueOnce(mockUser)
    })

    it(
      'возвращает 405 для POST запроса',
      async () => {
        mockReq.method = 'POST'

        await handler(mockReq as VercelRequest, mockRes as VercelResponse)

        expect(statusMock).toHaveBeenCalledWith(405)
        expect(jsonMock).toHaveBeenCalledWith({
          error: 'Method not allowed',
          message: 'Method POST is not supported. Use GET, PUT, PATCH, or DELETE.',
        })
      },
      10000
    )

    it(
      'возвращает 405 для OPTIONS запроса',
      async () => {
        mockReq.method = 'OPTIONS'

        await handler(mockReq as VercelRequest, mockRes as VercelResponse)

        expect(statusMock).toHaveBeenCalledWith(405)
      },
      10000
    )
  })

  describe('Error Handling', () => {
    beforeEach(() => {
      mockReq.headers = { cookie: 'session=valid-session' }
      mockReq.method = 'GET'
    })

    it(
      'возвращает 500 если KV.get выбрасывает exception при чтении настроек',
      async () => {
        vi.mocked(kv.get)
          .mockResolvedValueOnce(mockUser) // session OK
          .mockRejectedValueOnce(new Error('KV read error')) // settings error

        await handler(mockReq as VercelRequest, mockRes as VercelResponse)

        expect(statusMock).toHaveBeenCalledWith(500)
        expect(jsonMock).toHaveBeenCalledWith({
          error: 'Internal server error',
          message: 'KV read error',
        })
        expect(consoleErrorSpy).toHaveBeenCalledWith(
          'User settings error:',
          expect.any(Error)
        )
      },
      10000
    )

    it(
      'возвращает 500 если KV.set выбрасывает exception',
      async () => {
        mockReq.method = 'PATCH'
        mockReq.body = { preferences: { itemsPerPage: 20 } }

        vi.mocked(kv.get)
          .mockResolvedValueOnce(mockUser)
          .mockResolvedValueOnce(mockSettings)

        vi.mocked(kv.set).mockRejectedValue(new Error('KV write error'))

        await handler(mockReq as VercelRequest, mockRes as VercelResponse)

        expect(statusMock).toHaveBeenCalledWith(500)
        expect(jsonMock).toHaveBeenCalledWith({
          error: 'Internal server error',
          message: 'KV write error',
        })
      },
      10000
    )

    it(
      'возвращает 500 для неизвестной ошибки (non-Error object)',
      async () => {
        vi.mocked(kv.get)
          .mockResolvedValueOnce(mockUser)
          .mockRejectedValueOnce('string error')

        await handler(mockReq as VercelRequest, mockRes as VercelResponse)

        expect(statusMock).toHaveBeenCalledWith(500)
        expect(jsonMock).toHaveBeenCalledWith({
          error: 'Internal server error',
          message: 'Unknown error',
        })
      },
      10000
    )
  })
})
