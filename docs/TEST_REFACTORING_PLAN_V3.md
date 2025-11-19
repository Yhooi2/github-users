# План рефакторинга тестов v3.0 (на основе реального анализа)

**Дата:** 2025-11-19
**Версия:** 3.0 (основано на детальном анализе всех тестов)
**Источник данных:** TEST_ANALYSIS_REPORT.md
**Автор:** Команда разработки

---

## 📊 РЕАЛЬНОЕ СОСТОЯНИЕ ТЕСТОВ (факты, не предположения)

### Статистика из реального запуска

```bash
Test Files:    82 total (78 passed, 4 failed)
Tests:         1696 total (1676 passed, 18 failed, 2 skipped)
Pass Rate:     98.8%
Duration:      56.82s
Environment:   jsdom
```

### Код без тестов (точные цифры)

| Категория | Файлов | Строк кода | Приоритет |
|-----------|--------|------------|-----------|
| **API Endpoints** | 3 | 847 | 🔴 P0 КРИТИЧНО |
| **Hooks** | 1 | 177 | 🟠 P1 ВЫСОКИЙ |
| **Components** | 7 | 517 | 🟡 P1-P3 |
| **Lib/Utils** | 1 | 106 | 🟡 P2 СРЕДНИЙ |
| **ИТОГО** | **12** | **1647** | |

---

## 🔴 P0 - КРИТИЧНО (НАЧАТЬ НЕМЕДЛЕННО!)

### Проблема #1: api/analytics/logger.ts (188 строк) - БЕЗ ТЕСТОВ

**Файл:** `api/analytics/logger.ts`
**Размер:** 188 строк
**Используется:** Production, OAuth flow, analytics dashboard

**Функции без тестов:**
```typescript
- logOAuthLogin(event: OAuthLoginEvent): Promise<void>
- logOAuthLogout(event: OAuthLogoutEvent): Promise<void>
- logRateLimitSnapshot(snapshot: RateLimitSnapshot): Promise<void>
- updateSessionActivity(sessionId: string): Promise<void>
- cleanupOldAnalytics(daysToKeep: number): Promise<void>
```

**ПОЧЕМУ КРИТИЧНО:**
- Работает с Vercel KV (external dependency)
- Сложная логика: zadd, expire, zremrangebyscore
- **НЕТ проверки error handling** - если KV падает, что происходит?
- **НЕТ проверки JSON serialization** - что если event данные некорректные?
- Функция cleanup может удалить не те данные
- Используется в production БЕЗ ТЕСТОВ

**РИСКИ:**
1. Потеря аналитических данных (silent failure)
2. Неправильная сериализация → crash
3. cleanup удаляет важные данные
4. KV timeout → undefined behavior

**ЗАДАЧА:** Создать `api/analytics/logger.test.ts`

**Обязательные тесты (минимум 15 тестов):**

```typescript
describe('logOAuthLogin', () => {
  it('успешно логирует OAuth login в KV', async () => {
    const event = { userId: 123, login: 'user', sessionId: 'abc', timestamp: Date.now() }
    await logOAuthLogin(event)
    expect(kv.zadd).toHaveBeenCalledWith(
      'analytics:oauth:logins',
      { score: event.timestamp, member: JSON.stringify(event) }
    )
  })

  it('устанавливает правильный TTL (30 дней)', async () => {
    await logOAuthLogin(mockEvent)
    expect(kv.expire).toHaveBeenCalledWith('analytics:oauth:logins', 30 * 24 * 60 * 60)
  })

  it('НЕ падает если KV недоступен', async () => {
    vi.mocked(kv.zadd).mockRejectedValue(new Error('KV timeout'))
    await expect(logOAuthLogin(mockEvent)).resolves.not.toThrow()
  })

  it('логирует ошибку если KV недоступен', async () => {
    const consoleSpy = vi.spyOn(console, 'error')
    vi.mocked(kv.zadd).mockRejectedValue(new Error('KV timeout'))
    await logOAuthLogin(mockEvent)
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Failed to log OAuth login'))
  })

  it('корректно сериализует event с вложенными объектами', async () => {
    const complexEvent = { ...mockEvent, metadata: { ip: '1.2.3.4', ua: 'Chrome' } }
    await logOAuthLogin(complexEvent)
    const serialized = vi.mocked(kv.zadd).mock.calls[0][1].member
    expect(JSON.parse(serialized)).toEqual(complexEvent)
  })
})

describe('cleanupOldAnalytics', () => {
  it('удаляет только данные старше daysToKeep', async () => {
    const now = Date.now()
    const daysToKeep = 30
    const cutoffTime = now - (daysToKeep * 24 * 60 * 60 * 1000)

    await cleanupOldAnalytics(daysToKeep)

    expect(kv.zremrangebyscore).toHaveBeenCalledWith(
      'analytics:oauth:logins',
      '-inf',
      cutoffTime
    )
  })

  it('НЕ удаляет свежие данные', async () => {
    // Добавляем тест что данные за последние 30 дней НЕ удаляются
  })

  it('обрабатывает ошибку KV gracefully', async () => {
    vi.mocked(kv.zremrangebyscore).mockRejectedValue(new Error('KV error'))
    await expect(cleanupOldAnalytics(30)).resolves.not.toThrow()
  })
})
```

**Оценка:** 4-6 часов
**Deadline:** День 1-2

---

### Проблема #2: api/analytics/oauth-usage.ts (374 строки) - БЕЗ ТЕСТОВ

**Файл:** `api/analytics/oauth-usage.ts`
**Размер:** 374 строки
**Используется:** Production, Analytics Dashboard (публичный API)

**Функции без тестов:**
```typescript
- getPeriodMs(period: 'hour' | 'day' | 'week' | 'month'): number
- getActiveSessions(): Promise<number>
- getOAuthEvents(period: 'hour' | 'day' | 'week' | 'month'): Promise<OAuthEvent[]>
- calculateAvgSessionDuration(events: OAuthEvent[]): number
- getRateLimitStats(period: 'hour' | 'day' | 'week' | 'month'): Promise<RateLimitStats>
- handler(req: VercelRequest, res: VercelResponse): Promise<void>
```

**ПОЧЕМУ КРИТИЧНО:**
- **Публичный API endpoint** - может быть вызван из dashboard
- Сложная агрегация данных из KV
- **НЕТ authorization check** - кто может видеть метрики?
- Работает с KV scan (может быть медленно)
- **НЕТ валидации query параметров**

**РИСКИ:**
1. Утечка user данных (если нет auth check)
2. Некорректные метрики → неправильные бизнес-решения
3. Медленные запросы → timeout'ы
4. JSON.parse crash на невалидных данных из KV

**ЗАДАЧА:** Создать `api/analytics/oauth-usage.test.ts`

**Обязательные тесты (минимум 20 тестов):**

```typescript
describe('getPeriodMs', () => {
  it('возвращает правильные миллисекунды для hour', () => {
    expect(getPeriodMs('hour')).toBe(60 * 60 * 1000)
  })

  it('возвращает правильные миллисекунды для day', () => {
    expect(getPeriodMs('day')).toBe(24 * 60 * 60 * 1000)
  })

  it('возвращает правильные миллисекунды для week', () => {
    expect(getPeriodMs('week')).toBe(7 * 24 * 60 * 60 * 1000)
  })

  it('возвращает правильные миллисекунды для month', () => {
    expect(getPeriodMs('month')).toBe(30 * 24 * 60 * 60 * 1000)
  })

  it('бросает ошибку для невалидного периода', () => {
    expect(() => getPeriodMs('invalid' as any)).toThrow('Invalid period')
  })
})

describe('getActiveSessions', () => {
  it('возвращает количество активных сессий', async () => {
    vi.mocked(kv.keys).mockResolvedValue(['session:1', 'session:2', 'session:3'])
    const count = await getActiveSessions()
    expect(count).toBe(3)
  })

  it('возвращает 0 если нет сессий', async () => {
    vi.mocked(kv.keys).mockResolvedValue([])
    const count = await getActiveSessions()
    expect(count).toBe(0)
  })

  it('обрабатывает ошибку KV', async () => {
    vi.mocked(kv.keys).mockRejectedValue(new Error('KV error'))
    const count = await getActiveSessions()
    expect(count).toBe(0)
  })
})

describe('handler', () => {
  it('возвращает метрики для валидного периода', async () => {
    const req = mockRequest({ query: { period: 'day' } })
    const res = mockResponse()

    await handler(req, res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({
      activeSessions: expect.any(Number),
      totalLogins: expect.any(Number),
      uniqueUsers: expect.any(Number),
      avgSessionDuration: expect.any(Number),
      rateLimit: expect.objectContaining({
        remaining: expect.any(Number),
        limit: expect.any(Number)
      })
    })
  })

  it('возвращает 400 для невалидного периода', async () => {
    const req = mockRequest({ query: { period: 'invalid' } })
    const res = mockResponse()

    await handler(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({
      error: 'Invalid period. Must be hour, day, week, or month'
    })
  })

  it('возвращает 500 если KV недоступен', async () => {
    vi.mocked(kv.keys).mockRejectedValue(new Error('KV down'))
    const req = mockRequest({ query: { period: 'day' } })
    const res = mockResponse()

    await handler(req, res)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({
      error: 'Failed to fetch analytics data'
    })
  })

  // КРИТИЧНО: Проверка authorization
  it('требует валидную session для доступа к метрикам', async () => {
    const req = mockRequest({
      query: { period: 'day' },
      headers: {}  // No session cookie
    })
    const res = mockResponse()

    await handler(req, res)

    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.json).toHaveBeenCalledWith({
      error: 'Unauthorized. Please sign in to view analytics.'
    })
  })
})
```

**Оценка:** 6-8 часов
**Deadline:** День 3-4

---

### Проблема #3: api/user/settings.ts (285 строк) - БЕЗ ТЕСТОВ

**Файл:** `api/user/settings.ts`
**Размер:** 285 строк
**Используется:** Production, User Settings feature

**Функции без тестов:**
```typescript
- extractSessionFromCookie(cookie?: string): string | null
- getUserFromSession(sessionId: string): Promise<User | null>
- handler(req: VercelRequest, res: VercelResponse): Promise<void>
  - GET /api/user/settings
  - PUT /api/user/settings
  - PATCH /api/user/settings
  - DELETE /api/user/settings
```

**ПОЧЕМУ КРИТИЧНО:**
- Работа с **user-specific данными** (privacy concern)
- CRUD операции с KV
- Authentication logic (session extraction)
- **НЕТ валидации** многих preferences
- **НЕТ проверки authorization**

**РИСКИ:**
1. Session hijacking (неправильная extractSessionFromCookie)
2. Утечка настроек других пользователей
3. Установка некорректных preferences
4. SQL-injection-like атаки через preferences

**ЗАДАЧА:** Создать `api/user/settings.test.ts`

**Обязательные тесты (минимум 18 тестов):**

```typescript
describe('extractSessionFromCookie', () => {
  it('извлекает session ID из валидного cookie', () => {
    const cookie = 'session=abc123; Path=/; HttpOnly'
    expect(extractSessionFromCookie(cookie)).toBe('abc123')
  })

  it('возвращает null если cookie нет', () => {
    expect(extractSessionFromCookie(undefined)).toBeNull()
  })

  it('возвращает null если session cookie нет', () => {
    const cookie = 'other=value; Path=/'
    expect(extractSessionFromCookie(cookie)).toBeNull()
  })

  it('обрабатывает множество cookies', () => {
    const cookie = 'other=value; session=abc123; another=test'
    expect(extractSessionFromCookie(cookie)).toBe('abc123')
  })
})

describe('GET /api/user/settings', () => {
  it('возвращает defaults для нового пользователя', async () => {
    const req = mockRequest({ method: 'GET', sessionId: 'abc123' })
    const res = mockResponse()
    vi.mocked(kv.get).mockResolvedValue(null)  // No existing settings

    await handler(req, res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({
      defaultAnalyticsPeriod: 'week',
      defaultView: 'grid',
      itemsPerPage: 10,
      emailNotifications: false,
      autoRefreshDashboard: true,
      refreshInterval: 300000  // 5 minutes
    })
  })

  it('возвращает сохранённые настройки', async () => {
    const savedSettings = {
      defaultAnalyticsPeriod: 'month',
      defaultView: 'list',
      itemsPerPage: 25
    }
    vi.mocked(kv.get).mockResolvedValue(savedSettings)

    const req = mockRequest({ method: 'GET', sessionId: 'abc123' })
    const res = mockResponse()

    await handler(req, res)

    expect(res.json).toHaveBeenCalledWith(savedSettings)
  })
})

describe('PUT /api/user/settings', () => {
  it('сохраняет все настройки', async () => {
    const newSettings = {
      defaultAnalyticsPeriod: 'day',
      defaultView: 'grid',
      itemsPerPage: 50
    }

    const req = mockRequest({
      method: 'PUT',
      body: newSettings,
      sessionId: 'abc123'
    })
    const res = mockResponse()

    await handler(req, res)

    expect(kv.set).toHaveBeenCalledWith('settings:abc123', newSettings)
    expect(res.status).toHaveBeenCalledWith(200)
  })

  it('валидирует defaultAnalyticsPeriod', async () => {
    const invalidSettings = {
      defaultAnalyticsPeriod: 'invalid'  // Should be hour/day/week/month
    }

    const req = mockRequest({ method: 'PUT', body: invalidSettings, sessionId: 'abc123' })
    const res = mockResponse()

    await handler(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({
      error: 'Invalid defaultAnalyticsPeriod. Must be hour, day, week, or month'
    })
  })

  it('валидирует itemsPerPage (min 10, max 100)', async () => {
    const invalidSettings = { itemsPerPage: 5 }  // Too low

    const req = mockRequest({ method: 'PUT', body: invalidSettings, sessionId: 'abc123' })
    const res = mockResponse()

    await handler(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({
      error: 'Invalid itemsPerPage. Must be between 10 and 100'
    })
  })
})

describe('DELETE /api/user/settings', () => {
  it('удаляет все настройки пользователя', async () => {
    const req = mockRequest({ method: 'DELETE', sessionId: 'abc123' })
    const res = mockResponse()

    await handler(req, res)

    expect(kv.del).toHaveBeenCalledWith('settings:abc123')
    expect(res.status).toHaveBeenCalledWith(200)
  })
})

describe('Authorization', () => {
  it('возвращает 401 без session cookie', async () => {
    const req = mockRequest({ method: 'GET', headers: {} })  // No cookie
    const res = mockResponse()

    await handler(req, res)

    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.json).toHaveBeenCalledWith({
      error: 'Unauthorized. Please sign in.'
    })
  })

  it('возвращает 401 с невалидной session', async () => {
    vi.mocked(kv.get).mockResolvedValue(null)  // Session not found in KV

    const req = mockRequest({ method: 'GET', sessionId: 'invalid123' })
    const res = mockResponse()

    await handler(req, res)

    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.json).toHaveBeenCalledWith({
      error: 'Invalid session. Please sign in again.'
    })
  })
})
```

**Оценка:** 4-6 часов
**Deadline:** День 5

---

### Проблема #4: 18 упавших тестов - ИСПРАВИТЬ

**Файлы:**
1. `src/components/layout/UserMenu.test.tsx` - Avatar не рендерит img
2. `src/components/analytics/OAuthMetricsDashboard.test.tsx` - Radix Select не работает в jsdom
3. `src/hooks/user-contribution-history.test.tsx` - Apollo deprecated API
4. `src/integration/phase1-timeline.integration.test.tsx` - Apollo deprecated API

**ЗАДАЧА:** Исправить все упавшие тесты

**План действий:**

```typescript
// 1. UserMenu.test.tsx - Mock Avatar component
vi.mock('@/components/ui/avatar', () => ({
  Avatar: ({ children }: { children: React.ReactNode }) => <div data-testid="avatar">{children}</div>,
  AvatarImage: ({ src }: { src: string }) => <img src={src} alt="avatar" />,
  AvatarFallback: ({ children }: { children: React.ReactNode }) => <span>{children}</span>
}))

// 2. OAuthMetricsDashboard.test.tsx - Mock Radix Select
vi.mock('@/components/ui/select', () => ({
  Select: ({ children, onValueChange }: any) => (
    <div data-testid="select" onClick={() => onValueChange?.('day')}>
      {children}
    </div>
  ),
  SelectTrigger: ({ children }: any) => <button>{children}</button>,
  SelectValue: ({ placeholder }: any) => <span>{placeholder}</span>,
  SelectContent: ({ children }: any) => <div>{children}</div>,
  SelectItem: ({ children, value }: any) => <option value={value}>{children}</option>
}))

// 3. Apollo tests - Убрать deprecated API
const mocks = [
  {
    request: { query: GET_USER_INFO, variables: { login: 'test' } },
    result: { data: mockData }
  }
]

<MockedProvider
  mocks={mocks}
  // НЕ используем addTypename, canonizeResults
>
  <Component />
</MockedProvider>
```

**Оценка:** 2-4 часа
**Deadline:** День 5 (вечер)

---

## 🟠 P1 - ВЫСОКИЙ ПРИОРИТЕТ (Неделя 2)

### Проблема #5: src/hooks/useUserAnalytics.ts (177 строк) - БЕЗ ТЕСТОВ

**Файл:** `src/hooks/useUserAnalytics.ts`
**Размер:** 177 строк
**Используется:** Phase 1 Timeline feature

**Функционал:**
- Fetch user profile (GET_USER_PROFILE)
- Generate year ranges from account creation
- Parallel fetch contributions for each year (Promise.all)
- Separate owned repos from contributions
- Return timeline data sorted by year

**ПОЧЕМУ ВАЖНО:**
- Сложная multi-step логика
- Parallel queries (может упасть частично)
- Зависимость от Apollo Client
- Критичен для Timeline feature

**РИСКИ:**
- Неправильная обработка createdAt → crash
- Параллельные запросы могут упасть → undefined timeline
- Неправильная сортировка → UX проблема

**ЗАДАЧА:** Создать `src/hooks/useUserAnalytics.test.tsx`

**Обязательные тесты (минимум 12 тестов):**

```typescript
describe('useUserAnalytics', () => {
  it('возвращает loading=true на старте', () => {
    const { result } = renderHook(() => useUserAnalytics('torvalds'))
    expect(result.current.loading).toBe(true)
  })

  it('загружает profile + contributions для всех лет', async () => {
    // Mock user created 2020-01-01
    // Should fetch contributions for 2020, 2021, 2022, 2023, 2024
    const { result } = renderHook(() => useUserAnalytics('torvalds'))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.timeline).toHaveLength(5)
    expect(result.current.timeline[0].year).toBe(2024)  // Sorted desc
  })

  it('разделяет owned repos и contributions', async () => {
    const { result } = renderHook(() => useUserAnalytics('torvalds'))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    const year2024 = result.current.timeline[0]
    expect(year2024.ownedRepos).toBeDefined()
    expect(year2024.contributions).toBeDefined()
  })

  it('обрабатывает частичные ошибки в параллельных запросах', async () => {
    // Mock: 2020-2023 succeed, 2024 fails
    const { result } = renderHook(() => useUserAnalytics('torvalds'))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    // Should have data for 2020-2023
    expect(result.current.timeline).toHaveLength(4)
    // Should have error for 2024
    expect(result.current.error).toContain('Failed to load data for 2024')
  })

  it('обрабатывает пустой createdAt gracefully', async () => {
    // Mock user without createdAt
    const { result } = renderHook(() => useUserAnalytics('newuser'))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.timeline).toEqual([])
  })
})
```

**Оценка:** 4-6 часов
**Deadline:** День 6-7

---

### Проблема #6: src/components/layout/ErrorBoundary.tsx (73 строки) - БЕЗ ТЕСТОВ

**Файл:** `src/components/layout/ErrorBoundary.tsx`
**Размер:** 73 строки
**Используется:** Критичен для error handling

**ПОЧЕМУ ВАЖНО:**
- Class component (сложнее тестировать)
- Критичен для UX (ловит все ошибки)
- **БЕЗ тестов = не знаем что он работает**

**ЗАДАЧА:** Создать `src/components/layout/ErrorBoundary.test.tsx`

**Обязательные тесты (минимум 6 тестов):**

```typescript
describe('ErrorBoundary', () => {
  it('ловит ошибки child компонентов', () => {
    const ThrowError = () => { throw new Error('Test error') }

    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    )

    expect(screen.getByText(/Something went wrong/)).toBeInTheDocument()
  })

  it('рендерит fallback UI с error message', () => {
    const ThrowError = () => { throw new Error('Custom error message') }

    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    )

    expect(screen.getByText('Custom error message')).toBeInTheDocument()
  })

  it('вызывает onError callback', () => {
    const onError = vi.fn()
    const ThrowError = () => { throw new Error('Test error') }

    render(
      <ErrorBoundary onError={onError}>
        <ThrowError />
      </ErrorBoundary>
    )

    expect(onError).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'Test error' }),
      expect.any(Object)
    )
  })

  it('показывает кнопку "Try again"', () => {
    const ThrowError = () => { throw new Error('Test error') }

    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    )

    expect(screen.getByText('Try again')).toBeInTheDocument()
  })

  it('сбрасывает error при клике "Try again"', async () => {
    let shouldThrow = true
    const ConditionalThrow = () => {
      if (shouldThrow) throw new Error('Test error')
      return <div>Success</div>
    }

    const { rerender } = render(
      <ErrorBoundary>
        <ConditionalThrow />
      </ErrorBoundary>
    )

    expect(screen.getByText(/Something went wrong/)).toBeInTheDocument()

    shouldThrow = false
    await userEvent.click(screen.getByText('Try again'))

    rerender(
      <ErrorBoundary>
        <ConditionalThrow />
      </ErrorBoundary>
    )

    expect(screen.getByText('Success')).toBeInTheDocument()
  })
})
```

**Оценка:** 2-3 часа
**Deadline:** День 8

---

## 🟡 P2 - СРЕДНИЙ ПРИОРИТЕТ (Неделя 3)

### Проблема #7: src/lib/date-utils.ts (106 строк) - БЕЗ ТЕСТОВ

**Файл:** `src/lib/date-utils.ts`
**Размер:** 106 строк
**Используется:** useUserAnalytics hook, Timeline components

**Функции:**
```typescript
- generateYearRanges(createdAt: string): YearRange[]
- formatDate(date: string, format: string): string
- getYear(date: string): number
- isCurrentYear(date: string): boolean
```

**ПОЧЕМУ ВАЖНО:**
- Дата-логика склонна к edge cases
- Leap years, timezones, DST
- Используется в критичном hook

**ЗАДАЧА:** Создать `src/lib/date-utils.test.ts`

**Обязательные тесты (минимум 10 тестов):**

```typescript
describe('generateYearRanges', () => {
  it('генерирует диапазоны от createdAt до текущего года', () => {
    const createdAt = '2020-01-01T00:00:00Z'
    const ranges = generateYearRanges(createdAt)

    expect(ranges[0].year).toBe(2024)  // Current year first
    expect(ranges[ranges.length - 1].year).toBe(2020)
    expect(ranges).toHaveLength(5)
  })

  it('обрабатывает leap year корректно', () => {
    const createdAt = '2020-02-29T00:00:00Z'  // Leap year
    const ranges = generateYearRanges(createdAt)

    expect(ranges.find(r => r.year === 2020)).toBeDefined()
  })

  it('обрабатывает timezone корректно', () => {
    const createdAt = '2020-12-31T23:59:59Z'  // End of year
    const ranges = generateYearRanges(createdAt)

    expect(ranges.find(r => r.year === 2020)).toBeDefined()
  })

  it('обрабатывает пустую строку', () => {
    expect(generateYearRanges('')).toEqual([])
  })

  it('обрабатывает null', () => {
    expect(generateYearRanges(null as any)).toEqual([])
  })
})

describe('formatDate', () => {
  it('форматирует дату в MM/DD/YYYY', () => {
    expect(formatDate('2024-01-15', 'MM/DD/YYYY')).toBe('01/15/2024')
  })

  it('форматирует дату в DD.MM.YYYY', () => {
    expect(formatDate('2024-01-15', 'DD.MM.YYYY')).toBe('15.01.2024')
  })
})
```

**Оценка:** 2-3 часа
**Deadline:** День 11

---

## 📊 ROADMAP (3 недели, 40-55 часов)

### Неделя 1: P0 - КРИТИЧНО (14-20 часов)

| День | Задача | Часы | Статус |
|------|--------|------|--------|
| День 1-2 | api/analytics/logger.test.ts | 4-6 | ☐ |
| День 3-4 | api/analytics/oauth-usage.test.ts | 6-8 | ☐ |
| День 5 | api/user/settings.test.ts | 4-6 | ☐ |
| День 5 (вечер) | Исправить 18 упавших тестов | 2-4 | ☐ |

**Checkpoint:** В конце недели 1 - все критичные API имеют тесты, pass rate 100%

---

### Неделя 2: P1 - ВЫСОКИЙ (9-13 часов)

| День | Задача | Часы | Статус |
|------|--------|------|--------|
| День 6-7 | src/hooks/useUserAnalytics.test.tsx | 4-6 | ☐ |
| День 8 | ErrorBoundary.test.tsx | 2-3 | ☐ |
| День 9 | dropdown-menu.test.tsx | 3-4 | ☐ |
| День 10 | Buffer / code review | 2 | ☐ |

**Checkpoint:** В конце недели 2 - все критичные hooks и components имеют тесты

---

### Неделя 3: P2 - СРЕДНИЙ (8-14 часов)

| День | Задача | Часы | Статус |
|------|--------|------|--------|
| День 11 | date-utils.test.ts | 2-3 | ☐ |
| День 12-13 | Integration tests: Analytics Pipeline | 6-8 | ☐ |
| День 14 | UI components (button, input, etc) | 2-3 | ☐ |
| День 15 | Финальный review, документация | 2 | ☐ |

**Checkpoint:** В конце недели 3 - все компоненты имеют тесты, integration tests покрывают критичные пути

---

## ✅ SUCCESS CRITERIA

### По завершении P0 (Неделя 1)
- ✅ api/analytics/logger.ts - 100% coverage (15+ tests)
- ✅ api/analytics/oauth-usage.ts - 100% coverage (20+ tests)
- ✅ api/user/settings.ts - 100% coverage (18+ tests)
- ✅ Все 18 упавших тестов исправлены
- ✅ **Pass rate: 100%** (0 failed tests)
- ✅ **API coverage: 100%** (7/7 endpoints с тестами)

### По завершении P1 (Неделя 2)
- ✅ useUserAnalytics.ts - 100% coverage (12+ tests)
- ✅ ErrorBoundary.tsx - 100% coverage (6+ tests)
- ✅ dropdown-menu.tsx - 100% coverage (8+ tests)
- ✅ **Hooks coverage: 100%** (5/5 hooks с тестами)
- ✅ **Components coverage: 95%+** (60+/64 components с тестами)

### По завершении P2 (Неделя 3)
- ✅ date-utils.ts - 100% coverage (10+ tests)
- ✅ Analytics Pipeline - integration тесты (5+ scenarios)
- ✅ UI components - coverage (4+ components)
- ✅ **Utils coverage: 100%** (10/10 utils с тестами)
- ✅ **Integration coverage: 80%+** (critical paths covered)

### FINAL METRICS (после 3 недель)
```
Test Files:    100+ total (100 passed, 0 failed)
Tests:         1900+ total (1900 passed, 0 failed)
Pass Rate:     100%
Coverage:      Statements 90%+, Branches 85%+, Functions 90%+
```

---

## 💡 BEST PRACTICES (извлечённые из анализа)

### ✅ Что делать ПРАВИЛЬНО

1. **Специфичные assertions:**
```typescript
// ХОРОШО
expect(redirectCall).toContain('client_id=test_client_id')
expect(redirectCall).toContain('scope=read%3Auser+user%3Aemail')

// ПЛОХО
expect(redirectCall).toBeTruthy()
```

2. **Описательные названия тестов:**
```typescript
// ХОРОШО
it('должен редиректить на GitHub с правильными параметрами', async () => {})

// ПЛОХО
it('works', async () => {})
```

3. **Централизованные mock данные:**
```typescript
// ХОРОШО
import { createMockRepository } from '@/test/mocks/github-data'
const repo = createMockRepository({ stars: 100 })

// ПЛОХО
const repo = { id: '1', name: 'repo', stars: 100, /* ...40 lines... */ }
```

4. **Edge cases ОБЯЗАТЕЛЬНО:**
```typescript
describe('функция', () => {
  it('handles null', () => {})
  it('handles undefined', () => {})
  it('handles empty array', () => {})
  it('handles zero', () => {})
})
```

### ❌ Что НЕ делать

1. **НЕ использовать deprecated API:**
```typescript
// ПЛОХО
<MockedProvider addTypename={false} canonizeResults={false}>

// ХОРОШО
<MockedProvider mocks={mocks}>
```

2. **НЕ тестировать Radix UI напрямую в jsdom:**
```typescript
// ПЛОХО (упадёт)
await userEvent.click(screen.getByRole('button'))
await waitFor(() => screen.getByRole('option'))

// ХОРОШО (mock)
vi.mock('@/components/ui/select')
```

3. **НЕ дублировать mock данные:**
```typescript
// ПЛОХО - дублируется в 10 файлах
const mockRepo = { id: '1', name: 'test', /* ... */ }

// ХОРОШО - используй factory
import { createMockRepository } from '@/test/mocks'
```

---

## 📞 КОНТАКТЫ И ПОДДЕРЖКА

**Вопросы:** См. TEST_ANALYSIS_REPORT.md для деталей
**Отслеживание прогресса:** Weekly updates
**Code review:** Обязательно для всех тестов

**Last Updated:** 2025-11-19
**Based on:** Реальный анализ 88 тестовых файлов
**Status:** Ready for implementation
