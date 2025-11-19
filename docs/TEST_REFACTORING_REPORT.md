# Отчёт по рефакторингу и оптимизации тестов

**Дата:** 2025-11-19
**Цель:** Тесты должны досконально проверять проект — показывать что сломалось, где конкретно и почему, для удобной поддержки при добавлении новых фич.

---

## 🚨 КРИТИЧЕСКИЕ НАХОДКИ

### 1. ❌ PRODUCTION BUG: Rate Limit не обновляется в UI

**Где:** `src/components/UserProfile.tsx:41`
**Что сломано:** `useQueryUser` вызывается БЕЗ callback для обновления rate limit
**Почему:** Отсутствует параметр `onRateLimitUpdate` при вызове хука

**Симптом:**
- Пользователь видит дефолтный "5000/5000" rate limit
- Реальный rate limit приходит с GitHub API, но НИКОГДА не обновляется в UI
- Баннер rate limit показывает неверные данные

**Код (ТЕКУЩИЙ — сломан):**
```typescript
// src/components/UserProfile.tsx:41
const { data, loading, error, refetch } = useQueryUser(userName)
//                                                     ↑ НЕТ CALLBACK!
```

**Код (ПРАВИЛЬНЫЙ):**
```typescript
const { data, loading, error, refetch } = useQueryUser(userName, 365, {
  onRateLimitUpdate: (rateLimit) => {
    // Передать в App.tsx для обновления banner
    props.onRateLimitUpdate?.(rateLimit)
  }
})
```

**Что НЕ ЛОВЯТ тесты:**
- Нет интеграционного теста, проверяющего поток: `GitHub API → github-proxy → Apollo → UserProfile → App.tsx → RateLimitBanner`
- E2E тесты не проверяют что rate limit в баннере соответствует реальному значению

**Как исправить:**
1. Добавить prop `onRateLimitUpdate` в `UserProfile`
2. Передать callback из `App.tsx`
3. Создать интеграционный тест:
```typescript
// src/apollo/rate-limit-flow.integration.test.tsx
test('rate limit flows from API to UI banner', async () => {
  // Mock GitHub API with specific rate limit
  mockGitHubAPI({ rateLimit: { remaining: 4500, limit: 5000 } })

  // Render full App
  render(<App />)

  // Search for user
  await userEvent.type(screen.getByPlaceholderText('Search'), 'torvalds')
  await userEvent.click(screen.getByText('Search'))

  // VERIFY: Rate limit banner shows 4500/5000
  await waitFor(() => {
    expect(screen.getByText('4500 / 5000')).toBeInTheDocument()
  })
})
```

---

### 2. ❌ КРИТИЧЕСКИЙ ПРОБЕЛ: Analytics Endpoints БЕЗ тестов

**Где:**
- `api/analytics/logger.ts` (200+ lines) — 0% coverage
- `api/analytics/oauth-usage.ts` (375+ lines) — 0% coverage

**Что сломано:** Если KV storage падает, ошибки МОЛЧА проглатываются

**Код:**
```typescript
// api/analytics/logger.ts:58
try {
  await kv.zadd(`analytics:oauth:logins`, { score: timestamp, member: JSON.stringify(event) })
} catch (error) {
  console.error('Failed to log OAuth login:', error)
  // ↑ Ошибка ТОЛЬКО логируется, никому не сообщается!
}
```

**Что происходит:**
- Функция всегда возвращает успех (`Promise<void>`)
- Если KV недоступен — вся аналитика теряется БЕЗВОЗВРАТНО
- Monitoring не знает о проблеме

**Что НЕ ЛОВЯТ тесты:**
- Нет тестов для API endpoint `/api/analytics/oauth-usage`
- Нет тестов для logging functions
- E2E тесты только моки responses, не проверяют реальное сохранение

**Как исправить:**
1. Создать `api/analytics/logger.test.ts`:
```typescript
test('should retry KV operations on failure', async () => {
  vi.mocked(kv.zadd)
    .mockRejectedValueOnce(new Error('KV timeout'))  // 1st attempt fails
    .mockResolvedValueOnce(1)                         // 2nd attempt succeeds

  await logOAuthLogin({ userId: 123, login: 'user', sessionId: 'abc' })

  expect(kv.zadd).toHaveBeenCalledTimes(2)  // Verify retry
})

test('should emit metric on KV failure', async () => {
  vi.mocked(kv.zadd).mockRejectedValue(new Error('KV down'))

  const emitMetric = vi.fn()
  await logOAuthLogin({ ... }, { onError: emitMetric })

  expect(emitMetric).toHaveBeenCalledWith({ metric: 'analytics_write_error', value: 1 })
})
```

2. Создать `api/analytics/oauth-usage.integration.test.ts`:
```typescript
test('should aggregate metrics from KV', async () => {
  // Seed KV with test data
  await kv.zadd('analytics:oauth:logins', ...)

  // Call API endpoint
  const response = await handler(mockRequest, mockResponse)

  // Verify aggregation
  expect(response.metrics.totalLogins).toBe(156)
})
```

---

### 3. ⚠️ ОПАСНОСТЬ: OAuth Security Edge Cases не протестированы

**Проблемы:**

#### 3.1. CSRF State Expiration
**Где:** `api/auth/login.ts` — state cookie с TTL 10 минут
**Что не протестировано:**
- Пользователь начал OAuth flow → ушёл на кофе 15 минут → вернулся
- Cookie истёк, но GitHub callback всё равно приходит
- Что происходит? Тесты не проверяют!

**Тест:**
```typescript
test('should reject expired CSRF state', async () => {
  // Start OAuth flow
  await handler(loginReq, loginRes)
  const stateCookie = extractStateCookie(loginRes)

  // Simulate 11 minutes passing
  vi.advanceTimersByTime(11 * 60 * 1000)

  // Callback arrives with expired state
  await callbackHandler({ query: { code: 'abc', state: stateCookie } }, callbackRes)

  // Should redirect with error
  expect(callbackRes.redirect).toHaveBeenCalledWith('/?error=csrf_failed')
})
```

#### 3.2. Session Expiration Во Время Использования
**Где:** `api/github-proxy.ts:109`
**Что не протестировано:**
- Пользователь авторизован → делает запросы → session истекает (30 дней) МИД-REQUEST
- Proxy молча переключается на demo mode
- Пользователь НЕ ВИДИТ что вышел из аккаунта

**E2E тест:**
```typescript
test('should notify user when session expires mid-use', async () => {
  // Authenticate
  await signIn()

  // Make successful request
  await searchUser('torvalds')
  expect(screen.getByText('Authenticated')).toBeInTheDocument()

  // Delete session from KV (simulate expiration)
  await kv.del('session:abc123')

  // Make another request
  await searchUser('linus')

  // Should see warning
  expect(screen.getByText('Session expired. Please sign in again.')).toBeInTheDocument()
  expect(screen.getByText('Demo mode active')).toBeInTheDocument()
})
```

#### 3.3. State Reuse Attack
**Что не протестировано:**
- Атакер перехватывает state parameter → пытается использовать повторно
- CSRF protection должен блокировать

**Тест:**
```typescript
test('should reject reused OAuth state', async () => {
  const state = 'captured_state_123'

  // First use succeeds
  await callbackHandler({ query: { code: 'abc', state } }, res1)
  expect(res1.redirect).toHaveBeenCalledWith('/?auth=success')

  // Second use with same state should fail
  await callbackHandler({ query: { code: 'def', state } }, res2)
  expect(res2.redirect).toHaveBeenCalledWith('/?error=csrf_failed')
})
```

---

## 📊 СТАТИСТИКА ТЕСТОВ

### Покрытие
| Категория | Кол-во тестов | Покрытие | Оценка |
|-----------|---------------|----------|---------|
| **Unit Tests** | 75 файлов | 90%+ | ✅ Отлично |
| **Integration Tests** | 8 файлов | 40% | ⚠️ Пробелы |
| **E2E Tests** | 7 файлов, ~60 сценариев | 70% | ⚠️ Gaps в критических путях |
| **API Endpoints** | 4/7 с тестами | 57% | ❌ Analytics БЕЗ тестов |

### Проблемы

**1. Высокое покрытие МАСКИРУЕТ пробелы:**
- 99.85% тестов проходят (1302/1304)
- НО: unit тесты часто моки всё
- Критические integration flows НЕ протестированы end-to-end

**2. Тесты не проверяют ГДЕ и ПОЧЕМУ:**
```typescript
// ПЛОХО (текущий код)
expect(screen.getByText('42')).toBeInTheDocument()
// ↑ "42" найдено ГДЕ-ТО на странице, но где именно? В правильном ли месте?

// ХОРОШО (детальная проверка)
const activeSessionsCard = screen.getByRole('region', { name: 'Active Sessions' })
expect(within(activeSessionsCard).getByText('42')).toBeInTheDocument()
expect(within(activeSessionsCard).getByText('unique users')).toBeInTheDocument()
// ↑ Проверяем что "42" именно в карточке Active Sessions, а не где-то ещё
```

**3. Нет кастомных assertion messages:**
```typescript
// ПЛОХО
expect(result.score).toBeGreaterThanOrEqual(0)
// ↑ Падает с generic ошибкой: "Expected 0, received -5"

// ХОРОШО
expect(result.score).toBeGreaterThanOrEqual(0,
  `Authenticity score должен быть >=0, получен ${result.score}. ` +
  `Репозитории: ${result.metadata.totalRepos}, ` +
  `Оригинальные: ${result.metadata.originalRepos}, ` +
  `Flags: ${result.flags.join(', ')}`
)
// ↑ Падает с детальной диагностикой: сразу видно ЧТО сломалось и ПОЧЕМУ
```

---

## 🎯 КРИТИЧЕСКИЕ ПУТИ (ЧТО СЛОМАЕТСЯ БОЛЬНЕЕ ВСЕГО)

### PATH 1: Поиск пользователя → Просмотр профиля
**Покрытие:** ✅ E2E + Unit
**Пробел:** ❌ Rate limit extraction (см. bug #1)

### PATH 2: OAuth Login → Использование Personal Token
**Покрытие:** ✅ E2E (happy path), ⚠️ Unit (все endpoints)
**Пробелы:**
- ❌ CSRF state expiration
- ❌ Session expiration mid-use
- ❌ State reuse attack
- ❌ Concurrent logins

### PATH 3: Просмотр Analytics Dashboard
**Покрытие:** ✅ E2E (mock), ❌ NO Integration
**Пробелы:**
- ❌ API endpoint без тестов
- ❌ KV failures не тестируются
- ❌ Large dataset (1000+ sessions) не тестируется

### PATH 4: Фильтрация/Сортировка Репозиториев
**Покрытие:** ✅ E2E + Unit
**Пробелы:** Минимальные

---

## 🔧 ПЛАН РЕФАКТОРИНГА

### Этап 1: КРИТИЧЕСКИЕ ИСПРАВЛЕНИЯ (Эта неделя)

#### 1.1. Исправить Rate Limit Bug
**Время:** 2-3 часа
**Файлы:**
- `src/components/UserProfile.tsx` — добавить prop `onRateLimitUpdate`
- `src/App.tsx` — передать callback в UserProfile
- `src/apollo/rate-limit-flow.integration.test.tsx` — новый тест

**Тест проверяет:**
```typescript
✓ Rate limit приходит с GitHub API
✓ Proxy извлекает из headers
✓ Apollo получает в response
✓ UserProfile вызывает callback
✓ App.tsx обновляет state
✓ RateLimitBanner показывает ПРАВИЛЬНОЕ значение
```

#### 1.2. Добавить Analytics Tests
**Время:** 4-6 часов
**Файлы:**
- `api/analytics/logger.test.ts` — unit tests для всех logging functions
- `api/analytics/oauth-usage.integration.test.ts` — API endpoint tests

**Тесты проверяют:**
```typescript
✓ Успешное логирование событий
✓ KV failure handling (retry logic)
✓ Aggregation правильно считает метрики
✓ Period filtering работает (hour/day/week/month)
✓ Pagination для больших datasets
✓ Error responses с правильными кодами
```

#### 1.3. OAuth Security Tests
**Время:** 3-4 часа
**Файлы:**
- `api/auth/callback.test.ts` — добавить edge cases
- `e2e/oauth-security.spec.ts` — новый файл

**Тесты проверяют:**
```typescript
✓ CSRF state expiration (11+ minutes)
✓ State reuse attack
✓ Session expiration during active use
✓ Concurrent login attempts
✓ Cookie security flags (HttpOnly, Secure, SameSite)
```

**Итого Этап 1:** 9-13 часов работы

---

### Этап 2: УЛУЧШЕНИЕ КАЧЕСТВА ДИАГНОСТИКИ (Следующая неделя)

#### 2.1. Добавить Custom Assertion Messages
**Время:** 4-6 часов
**Файлы:** Обновить все критические тесты

**Принцип:**
```typescript
// ДО
expect(result.score).toBe(75)

// ПОСЛЕ
expect(result.score).toBe(75,
  `Expected authenticity score 75, got ${result.score}.\n` +
  `Breakdown: originality=${result.breakdown.originalityScore}, ` +
  `activity=${result.breakdown.activityScore}, ` +
  `quality=${result.breakdown.qualityScore}, ` +
  `consistency=${result.breakdown.consistencyScore}.\n` +
  `Flags: ${result.flags.join(', ')}`
)
```

**Когда тест падает, сразу видно:**
- ЧТО ожидалось
- ЧТО получено
- КАКИЕ промежуточные значения
- КАКИЕ flags установлены

#### 2.2. Добавить Structural Assertions
**Время:** 3-4 часа

**Принцип:**
```typescript
// ДО (находит "42" где угодно)
expect(screen.getByText('42')).toBeInTheDocument()

// ПОСЛЕ (проверяет конкретную структуру)
const dashboard = screen.getByRole('region', { name: 'OAuth Analytics' })
const sessionsCard = within(dashboard).getByRole('article', { name: 'Active Sessions' })
expect(within(sessionsCard).getByText('42')).toBeInTheDocument()
expect(within(sessionsCard).getByText('unique users')).toBeInTheDocument()
```

#### 2.3. Consolidate Mock Data
**Время:** 2-3 hours
**Файлы:** Обновить 18 файлов с дублированием repository mocks

**Принцип:**
```typescript
// ДО (каждый тест создаёт свой mock)
const mockRepository = {
  id: '1',
  name: 'test-repo',
  // ... 40 строк boilerplate
}

// ПОСЛЕ (используем централизованную factory)
import { createMockRepository } from '@/test/mocks/github-data'

const mockRepository = createMockRepository({
  id: '1',
  name: 'test-repo'
})
```

**Экономия:** ~500 строк кода

**Итого Этап 2:** 9-13 часов работы

---

### Этап 3: INTEGRATION TESTS (2-3 недели)

#### 3.1. Critical Integration Flows
**Время:** 8-12 hours

**Новые тесты:**

1. **Rate Limit Flow** (уже описан в Этапе 1)

2. **Cache Transition Test:**
```typescript
test('should not use demo cache after OAuth login', async () => {
  // 1. Search in demo mode
  await searchUser('torvalds')
  const demoCacheKey = await kv.keys('demo:user:torvalds:*')
  expect(demoCacheKey).toHaveLength(1)

  // 2. Log in with OAuth
  await signIn()

  // 3. Search same user
  await searchUser('torvalds')

  // 4. Should use DIFFERENT cache key
  const userCacheKey = await kv.keys('user:session123:user:torvalds:*')
  expect(userCacheKey).toHaveLength(1)

  // 5. Demo cache should NOT be used
  const fetchCalls = mockFetch.mock.calls
  expect(fetchCalls.some(call => call[0].includes('torvalds'))).toBe(true)
})
```

3. **Parallel Query Failure Test:**
```typescript
test('should show partial timeline when some years fail', async () => {
  // Mock: 2020-2023 succeed, 2024 fails
  mockGitHubAPI({
    '2020': { success: true, data: yearData2020 },
    '2021': { success: true, data: yearData2021 },
    '2022': { success: true, data: yearData2022 },
    '2023': { success: true, data: yearData2023 },
    '2024': { success: false, error: 'Network timeout' },
  })

  render(<App />)
  await searchUser('torvalds')

  // Should show 2020-2023 data
  expect(screen.getByText('2023')).toBeInTheDocument()
  expect(screen.getByText('2020')).toBeInTheDocument()

  // Should show warning about partial data
  expect(screen.getByText(/Could not load data for 2024/)).toBeInTheDocument()

  // Metrics should be calculated from available years only
  const metrics = screen.getByTestId('metrics-summary')
  expect(within(metrics).getByText('4 years of activity')).toBeInTheDocument()
})
```

#### 3.2. Error Boundary Tests
**Время:** 2-3 часа
**Файл:** `src/components/layout/ErrorBoundary.test.tsx` (КРИТИЧЕСКИЙ ПРОБЕЛ!)

```typescript
test('should catch errors from children', () => {
  const ThrowError = () => { throw new Error('Test error') }

  render(
    <ErrorBoundary>
      <ThrowError />
    </ErrorBoundary>
  )

  expect(screen.getByText(/Something went wrong/)).toBeInTheDocument()
  expect(screen.getByText('Test error')).toBeInTheDocument()
})

test('should reset error boundary', async () => {
  const ThrowError = ({ shouldThrow }) => {
    if (shouldThrow) throw new Error('Test error')
    return <div>Success</div>
  }

  const { rerender } = render(
    <ErrorBoundary>
      <ThrowError shouldThrow={true} />
    </ErrorBoundary>
  )

  expect(screen.getByText(/Something went wrong/)).toBeInTheDocument()

  // Click reset button
  await userEvent.click(screen.getByText('Try again'))

  // Re-render without error
  rerender(
    <ErrorBoundary>
      <ThrowError shouldThrow={false} />
    </ErrorBoundary>
  )

  expect(screen.getByText('Success')).toBeInTheDocument()
})
```

**Итого Этап 3:** 10-15 часов работы

---

## 📋 CHECKLIST: Что проверять при добавлении новой фичи

### ✅ API/Backend Changes

- [ ] **Ошибки не молчаливые:** Все try-catch имеют fallback/retry/notification
- [ ] **Errors детальные:** Каждая ошибка содержит context (userId, endpoint, timestamp)
- [ ] **Integration тест:** Проверяет реальный flow через все layers
- [ ] **Mock failures:** Тесты проверяют что происходит при failure каждого dependency

**Пример:**
```typescript
// ПЛОХО
try {
  await kv.set(key, value)
} catch (error) {
  console.error(error)  // ← МОЛЧАЛИВАЯ ОШИБКА!
}

// ХОРОШО
try {
  await kv.set(key, value)
} catch (error) {
  logger.error('KV write failed', { key, error, userId, timestamp })
  await sendToDeadLetterQueue({ operation: 'kv.set', key, value })
  throw new KVWriteError(`Failed to write ${key}`, { cause: error })
}
```

### ✅ Frontend Component Changes

- [ ] **Structural assertions:** Тесты проверяют DOM structure, не только наличие текста
- [ ] **Loading states:** Каждый async component имеет loading UI
- [ ] **Error states:** Каждый async component имеет error UI с retry button
- [ ] **Empty states:** Каждый list/collection имеет empty state UI

**Пример теста:**
```typescript
test('should show loading → data → error → retry flow', async () => {
  // Initial loading
  render(<MyComponent />)
  expect(screen.getByText('Loading...')).toBeInTheDocument()

  // Data loaded
  await waitFor(() => {
    expect(screen.getByText('My Data')).toBeInTheDocument()
  })

  // Simulate error on refresh
  mockFetch.mockRejectedValueOnce(new Error('Network error'))
  await userEvent.click(screen.getByText('Refresh'))

  // Error shown
  await waitFor(() => {
    expect(screen.getByText('Failed to load')).toBeInTheDocument()
    expect(screen.getByText('Network error')).toBeInTheDocument()
  })

  // Retry succeeds
  mockFetch.mockResolvedValueOnce({ data: 'Recovered' })
  await userEvent.click(screen.getByText('Retry'))

  await waitFor(() => {
    expect(screen.getByText('Recovered')).toBeInTheDocument()
  })
})
```

### ✅ Data Flow Changes

- [ ] **Each transformation tested:** Если data проходит через 5 функций, 5 unit tests
- [ ] **Integration test:** Полный flow от input до UI output
- [ ] **Edge cases:** null, undefined, empty array, invalid format
- [ ] **Type validation:** Runtime checks для external data (GitHub API)

### ✅ OAuth/Security Changes

- [ ] **Security edge cases:** State expiration, reuse, tampering
- [ ] **Session lifecycle:** Create, use, refresh, expire, delete
- [ ] **Cookie security:** HttpOnly, Secure, SameSite flags
- [ ] **CSRF protection:** Every state-changing operation

---

## 🎯 PRIORITY SUMMARY

### 🔴 КРИТИЧНО (Сделать НЕМЕДЛЕННО)

1. **Исправить rate limit extraction bug** (2-3 hours)
2. **Добавить analytics tests** (4-6 hours)
3. **OAuth security edge cases** (3-4 hours)

**Итого:** 9-13 hours → **Ближайшие 2-3 дня**

### 🟠 ВЫСОКИЙ ПРИОРИТЕТ (Эта неделя)

4. **Error boundary tests** (2-3 hours)
5. **Custom assertion messages** (4-6 hours)
6. **Structural assertions** (3-4 hours)

**Итого:** 9-13 hours → **К концу недели**

### 🟡 СРЕДНИЙ ПРИОРИТЕТ (Следующая неделя)

7. **Integration flows** (8-12 hours)
8. **Consolidate mock data** (2-3 hours)

**Итого:** 10-15 hours → **Следующая неделя**

### ⚪ НИЗКИЙ ПРИОРИТЕТ (По мере возможности)

9. **Split large test files** (4-6 hours)
10. **E2E mobile/offline scenarios** (6-8 hours)

---

## 📈 ОЖИДАЕМЫЕ РЕЗУЛЬТАТЫ

### После Этапа 1 (Критические исправления):
✅ Production bug исправлен
✅ Analytics tracking надёжен
✅ OAuth security проверен
✅ При добавлении новой фичи, ломающей rate limit → **тест сразу покажет ГДЕ (интеграционный тест) и ПОЧЕМУ (детальная assertion)**

### После Этапа 2 (Качество диагностики):
✅ Каждое падение теста показывает:
  - **ЧТО** ожидалось
  - **ЧТО** получено
  - **ГДЕ** в коде (файл, функция)
  - **ПРОМЕЖУТОЧНЫЕ** значения

✅ При рефакторинге → сломанные тесты показывают **КОНКРЕТНУЮ** проблему, не нужно debugging

### После Этапа 3 (Integration tests):
✅ Критические flows протестированы end-to-end
✅ При изменении API → integration тесты падают с **точным описанием** где сломался contract
✅ При добавлении новой фичи → **полная уверенность**, что существующие flows работают

---

## 💡 EXAMPLES: Как это работает на практике

### Сценарий 1: Добавляем новую метрику в Authenticity Score

**БЕЗ рефакторинга:**
```bash
$ npm test
❌ FAIL src/hooks/useAuthenticityScore.test.ts
  Expected: 75
  Received: 68
```
**→ НЕ ПОНЯТНО:** Где конкретно сломалось? Какая метрика?

**ПОСЛЕ рефакторинга:**
```bash
$ npm test
❌ FAIL src/hooks/useAuthenticityScore.test.ts
  Expected authenticity score 75, got 68.

  Breakdown:
    - originalityScore: 25 (expected 25) ✓
    - activityScore: 18 (expected 25) ✗ DIFFERENCE!
    - qualityScore: 15 (expected 15) ✓
    - consistencyScore: 10 (expected 10) ✓

  Input repositories: 10 total, 8 original, 2 forks
  Activity: 250 commits, 30 PRs, 40 issues

  DIAGNOSIS: activityScore calculation changed.
  Check: src/lib/metrics/activity.ts:calculateActivityScore()
```
**→ СРАЗУ ВИДНО:** activityScore неправильный, остальное OK, где чинить

---

### Сценарий 2: Изменили GitHub API response format

**БЕЗ рефакторинга:**
```bash
$ npm test
✓ All tests passed (1302/1302)

# Деплоим в production
$ vercel deploy

# В production:
TypeError: Cannot read property 'totalCount' of undefined
  at calculateMetrics (src/lib/statistics.ts:42)
```
**→ ПРОБЛЕМА:** Тесты проходят (используют моки), но production падает

**ПОСЛЕ рефакторинга (с runtime validation):**
```bash
$ npm test
❌ FAIL src/apollo/github-proxy.integration.test.ts
  GitHub API response validation failed:

  Expected: user.repositories.nodes to be Array
  Received: null

  Response: {
    "user": {
      "repositories": null  ← CHANGED!
    }
  }

  Schema mismatch detected at: user.repositories

  ACTION REQUIRED:
  1. Update GraphQL query to handle null repositories
  2. Add fallback: repositories ?? { nodes: [] }
  3. Update types in github-api.types.ts
```
**→ СРАЗУ ВИДНО:** GitHub изменил schema, где нужно добавить fallback

---

### Сценарий 3: Рефакторим OAuth callback endpoint

**БЕЗ рефакторинга:**
```bash
$ npm test
✓ All tests passed (1302/1302)

# Пользователь логинится:
# - Callback успешен
# - Session создан
# - НО: session expiry не обновляется при activity
# - Через 1 день: session истекает (должен был 30 дней)

# Пользователь жалуется: "Каждый день выкидывает из аккаунта"
```
**→ ПРОБЛЕМА:** Тесты не проверяют session activity update

**ПОСЛЕ рефакторинга (с session lifecycle test):**
```bash
$ npm test
❌ FAIL e2e/oauth-session-lifecycle.spec.ts
  Session activity update test failed:

  1. User logged in → session created ✓
  2. User made API request → lastActivity should update

  Expected: session.lastActivity = 1700000002000 (2 seconds after login)
  Received: session.lastActivity = 1700000000000 (unchanged)

  Session in KV:
    sessionId: abc123
    userId: 12345
    createdAt: 1700000000000
    lastActivity: 1700000000000  ← NOT UPDATED!

  DIAGNOSIS: updateSessionActivity() not called in github-proxy.ts
  Check: api/github-proxy.ts:150 (after successful API request)
```
**→ СРАЗУ ВИДНО:** lastActivity не обновляется, где добавить вызов

---

## 📚 REFERENCES

**Созданные документы:**
- `docs/PHASE_7_ENHANCEMENTS.md` — описание Phase 7 фич
- `docs/testing-guide.md` — полный гайд по тестированию
- Этот документ — план рефакторинга

**Файлы с критическими проблемами:**
- `src/components/UserProfile.tsx:41` — rate limit bug
- `api/analytics/logger.ts` — без тестов, silent failures
- `api/analytics/oauth-usage.ts` — без тестов
- `src/components/layout/ErrorBoundary.tsx` — без тестов (CRITICAL!)

**Существующие хорошие примеры:**
- `api/auth/callback.test.ts` — отличные OAuth тесты
- `src/lib/metrics/quality.test.ts` — детальные тесты calculations
- `e2e/oauth-flow.spec.ts` — хорошие E2E тесты

---

## 🎬 NEXT STEPS

1. **Review этот документ** с командой
2. **Prioritize:** Согласовать приоритеты (предложенные выше адекватны?)
3. **Start Этап 1:** Assign задачи
   - Rate limit fix (2-3h)
   - Analytics tests (4-6h)
   - OAuth security (3-4h)
4. **Track progress:** Daily standup updates
5. **Iterate:** После Этапа 1 → review → adjust plan для Этапа 2

**Estimated timeline:**
- **Этап 1 (критично):** 2-3 дня
- **Этап 2 (качество):** 1 неделя
- **Этап 3 (integration):** 2-3 недели

**Total time investment:** 30-40 hours для excellent test suite

---

**Вопросы?** Можно начинать с любого пункта в зависимости от срочности.
