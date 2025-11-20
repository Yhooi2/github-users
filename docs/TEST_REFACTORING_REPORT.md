# Отчёт по рефакторингу и оптимизации тестов

**Дата:** 2025-11-19
**Версия:** 2.0
**Автор:** Команда разработки
**Цель:** Тесты должны досконально проверять проект — показывать что сломалось, где конкретно и почему, для удобной поддержки при добавлении новых фич.

---

## 📋 СОДЕРЖАНИЕ

1. [Матрица обязательных тестов](#-матрица-обязательных-тестов)
2. [Текущее состояние](#-текущее-состояние)
3. [Критические находки](#-критические-находки)
4. [План рефакторинга](#-план-рефакторинга)
5. [Метрики успеха](#-метрики-успеха)
6. [Checklist для новых фич](#-checklist-что-проверять-при-добавлении-новой-фичи)

---

## 🎯 МАТРИЦА ОБЯЗАТЕЛЬНЫХ ТЕСТОВ

### 1. API Endpoints (100% покрытие обязательно)

| Endpoint                     | Unit Tests      | Integration Tests  | E2E Tests | Текущий статус      |
| ---------------------------- | --------------- | ------------------ | --------- | ------------------- |
| `/api/auth/login`            | ✅ 6 тестов     | ✅ OAuth flow      | ✅ E2E    | ✅ Готово           |
| `/api/auth/callback`         | ✅ 11 тестов    | ✅ CSRF validation | ✅ E2E    | ⚠️ Нужны edge cases |
| `/api/auth/logout`           | ✅ 7 тестов     | ✅ Session cleanup | ✅ E2E    | ✅ Готово           |
| `/api/github-proxy`          | ✅ 15 тестов    | ✅ Cache tests     | ✅ E2E    | ⚠️ Rate limit bug   |
| `/api/analytics/logger`      | ❌ **0 тестов** | ❌ Нет             | ❌ Нет    | 🔴 **КРИТИЧНО**     |
| `/api/analytics/oauth-usage` | ❌ **0 тестов** | ❌ Нет             | ❌ Нет    | 🔴 **КРИТИЧНО**     |

**Что должно быть для КАЖДОГО API endpoint:**

```typescript
// 1. UNIT TESTS (api/[endpoint].test.ts)
describe('API /endpoint', () => {
  // Happy path
  test('should return 200 with valid data', async () => {...})

  // Error handling
  test('should return 400 for invalid input', async () => {...})
  test('should return 401 for unauthorized', async () => {...})
  test('should return 500 on database failure', async () => {...})

  // Edge cases
  test('should handle missing parameters', async () => {...})
  test('should handle malformed JSON', async () => {...})
  test('should handle rate limiting', async () => {...})

  // Security
  test('should sanitize user input', async () => {...})
  test('should validate CSRF token', async () => {...})
})

// 2. INTEGRATION TESTS (integration/[feature].integration.test.ts)
test('full API flow: request → database → response', async () => {
  // Real database operations
  // Real cache interactions
  // Real session handling
})

// 3. E2E TESTS (e2e/[feature].spec.ts)
test('user can complete full workflow in browser', async ({ page }) => {
  // Real browser interaction
  // Real network requests
  // Real user scenarios
})
```

---

### 2. React Components (Component → Storybook → Test)

| Компонент               | Stories          | Unit Tests      | Integration Tests  | Статус               |
| ----------------------- | ---------------- | --------------- | ------------------ | -------------------- |
| `UserProfile`           | ✅ 8 stories     | ✅ 12 тестов    | ⚠️ Rate limit flow | ⚠️ Нужен integration |
| `SearchForm`            | ✅ 6 stories     | ✅ 10 тестов    | ✅ Form submission | ✅ Готово            |
| `RateLimitBanner`       | ✅ 8 stories     | ✅ 22 тестов    | ⚠️ Update flow     | ⚠️ Нужен integration |
| `UserMenu`              | ✅ 6 stories     | ✅ 10 тестов    | ✅ OAuth flow      | ✅ Готово            |
| `ErrorBoundary`         | ❌ **0 stories** | ❌ **0 тестов** | ❌ Нет             | 🔴 **КРИТИЧНО**      |
| `OAuthMetricsDashboard` | ✅ 6 stories     | ✅ 18 тестов    | ⚠️ KV fetch        | ⚠️ Нужен integration |

**Что должно быть для КАЖДОГО компонента:**

```typescript
// 1. STORYBOOK (components/[Component].stories.tsx)
export const Default: Story = {...}
export const Loading: Story = {...}
export const Error: Story = {...}
export const Empty: Story = {...}
export const WithData: Story = {...}

// 2. UNIT TESTS (components/[Component].test.tsx)
describe('Component', () => {
  // Rendering
  test('renders with default props', () => {...})
  test('renders loading state', () => {...})
  test('renders error state', () => {...})
  test('renders empty state', () => {...})

  // Interaction
  test('calls onClick handler', async () => {...})
  test('updates on prop change', () => {...})

  // Accessibility
  test('has correct ARIA labels', () => {...})
  test('keyboard navigation works', () => {...})

  // Edge cases
  test('handles null/undefined props', () => {...})
  test('handles very long text', () => {...})
})

// 3. INTEGRATION TESTS (integration/[feature].integration.test.tsx)
test('component integrates with data flow', async () => {
  // Real Apollo queries
  // Real state updates
  // Real user interactions
})
```

---

### 3. Custom Hooks (100% покрытие обязательно)

| Hook                   | Unit Tests      | Integration Tests     | Статус                 |
| ---------------------- | --------------- | --------------------- | ---------------------- |
| `useQueryUser`         | ✅ 8 тестов     | ✅ Apollo integration | ⚠️ Rate limit callback |
| `useAuthenticityScore` | ✅ 12 тестов    | ✅ Calculation flow   | ✅ Готово              |
| `useRepositoryFilters` | ✅ 15 тестов    | ✅ Filter logic       | ✅ Готово              |
| `useRepositorySorting` | ✅ 10 тестов    | ✅ Sort logic         | ✅ Готово              |
| `useUserAnalytics`     | ❌ **0 тестов** | ❌ Нет                | 🔴 **КРИТИЧНО**        |

**Что должно быть для КАЖДОГО хука:**

```typescript
// hooks/[useHook].test.ts
import { renderHook, act } from '@testing-library/react'

describe('useHook', () => {
  // Basic functionality
  test('returns initial state', () => {...})
  test('updates state on action', () => {...})

  // Side effects
  test('calls API on mount', async () => {...})
  test('cleans up on unmount', () => {...})

  // Error handling
  test('handles API errors gracefully', async () => {...})

  // Edge cases
  test('handles rapid state updates', () => {...})
  test('handles concurrent requests', async () => {...})
})
```

---

### 4. Utility Functions (100% покрытие + edge cases)

| Utility                 | Unit Tests   | Edge Cases | Статус    |
| ----------------------- | ------------ | ---------- | --------- |
| `statistics.ts`         | ✅ 20 тестов | ✅ Все     | ✅ Готово |
| `authenticity.ts`       | ✅ 18 тестов | ✅ Все     | ✅ Готово |
| `repository-filters.ts` | ✅ 15 тестов | ✅ Все     | ✅ Готово |
| `date-helpers.ts`       | ✅ 10 тестов | ✅ Все     | ✅ Готово |
| `user-timeline.ts`      | ✅ 12 тестов | ✅ Все     | ✅ Готово |

**Что должно быть для КАЖДОЙ utility функции:**

```typescript
// lib/[utility].test.ts
describe('utilityFunction', () => {
  // Happy path
  test('calculates correct result for valid input', () => {...})

  // Edge cases (ОБЯЗАТЕЛЬНО!)
  test('handles null input', () => {...})
  test('handles undefined input', () => {...})
  test('handles empty array', () => {...})
  test('handles empty string', () => {...})
  test('handles zero', () => {...})
  test('handles negative numbers', () => {...})
  test('handles very large numbers', () => {...})
  test('handles NaN', () => {...})
  test('handles Infinity', () => {...})

  // Type safety
  test('throws on invalid type', () => {...})
  test('validates input schema', () => {...})
})
```

---

### 5. Integration Tests (критические пути)

| Путь                          | Тест существует | Покрытие | Статус            |
| ----------------------------- | --------------- | -------- | ----------------- |
| Search User → View Profile    | ✅ E2E          | 90%      | ⚠️ Rate limit bug |
| OAuth Login → Use Token       | ✅ E2E          | 70%      | ⚠️ Edge cases     |
| View Analytics Dashboard      | ✅ E2E (mock)   | 40%      | 🔴 Нет real KV    |
| Filter/Sort Repos             | ✅ E2E          | 95%      | ✅ Готово         |
| Cache: Demo → Auth Transition | ❌ Нет          | 0%       | 🔴 **КРИТИЧНО**   |
| Session Expiration Mid-Use    | ❌ Нет          | 0%       | 🔴 **КРИТИЧНО**   |
| Rate Limit: API → UI Flow     | ❌ Нет          | 0%       | 🔴 **КРИТИЧНО**   |

**Что должно быть для КАЖДОГО критического пути:**

```typescript
// integration/[critical-path].integration.test.tsx
test("full user journey end-to-end", async () => {
  // 1. Setup: Real database, real cache, real session
  // 2. Execute: Full user flow
  //    - User action 1
  //    - System response 1
  //    - User action 2
  //    - System response 2
  // 3. Verify: All intermediate states
  //    - Database updated correctly
  //    - Cache populated correctly
  //    - UI reflects correct state
  //    - Analytics logged correctly
  // 4. Cleanup: Restore initial state
});
```

---

## 📊 ТЕКУЩЕЕ СОСТОЯНИЕ

### Статистика

**Unit Tests:** 77 файлов
**Integration Tests:** 8 файлов
**E2E Tests:** 7 файлов
**Общее количество тестов:** 1304
**Успешных:** 1302 (99.85%)
**Провальных:** 2 (0.15%)

### Покрытие по категориям

| Категория     | Файлов с тестами    | Покрытие кода | Оценка                         |
| ------------- | ------------------- | ------------- | ------------------------------ |
| API Endpoints | 4/6                 | 67%           | ⚠️ Analytics без тестов        |
| Components    | 73/75               | 95%           | ✅ Отлично                     |
| Hooks         | 4/5                 | 80%           | ⚠️ useUserAnalytics без тестов |
| Utilities     | 8/8                 | 100%          | ✅ Идеально                    |
| Types         | 2/2                 | 100%          | ✅ Идеально                    |
| Integration   | 8 критических путей | 60%           | ⚠️ Пробелы                     |

### Проблемы

1. **❌ API без тестов:** `api/analytics/*` (375+ строк кода)
2. **❌ ErrorBoundary без тестов** (критический компонент!)
3. **❌ Integration пробелы:** Rate limit flow, cache transition, session expiration
4. **⚠️ Моки скрывают проблемы:** Unit tests проходят, production падает

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
const { data, loading, error, refetch } = useQueryUser(userName);
//                                                     ↑ НЕТ CALLBACK!
```

**Код (ПРАВИЛЬНЫЙ):**

```typescript
const { data, loading, error, refetch } = useQueryUser(userName, 365, {
  onRateLimitUpdate: (rateLimit) => {
    // Передать в App.tsx для обновления banner
    props.onRateLimitUpdate?.(rateLimit);
  },
});
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
  await kv.zadd(`analytics:oauth:logins`, {
    score: timestamp,
    member: JSON.stringify(event),
  });
} catch (error) {
  console.error("Failed to log OAuth login:", error);
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
test("should reject expired CSRF state", async () => {
  // Start OAuth flow
  await handler(loginReq, loginRes);
  const stateCookie = extractStateCookie(loginRes);

  // Simulate 11 minutes passing
  vi.advanceTimersByTime(11 * 60 * 1000);

  // Callback arrives with expired state
  await callbackHandler(
    { query: { code: "abc", state: stateCookie } },
    callbackRes,
  );

  // Should redirect with error
  expect(callbackRes.redirect).toHaveBeenCalledWith("/?error=csrf_failed");
});
```

#### 3.2. Session Expiration Во Время Использования

**Где:** `api/github-proxy.ts:109`
**Что не протестировано:**

- Пользователь авторизован → делает запросы → session истекает (30 дней) МИД-REQUEST
- Proxy молча переключается на demo mode
- Пользователь НЕ ВИДИТ что вышел из аккаунта

**E2E тест:**

```typescript
test("should notify user when session expires mid-use", async () => {
  // Authenticate
  await signIn();

  // Make successful request
  await searchUser("torvalds");
  expect(screen.getByText("Authenticated")).toBeInTheDocument();

  // Delete session from KV (simulate expiration)
  await kv.del("session:abc123");

  // Make another request
  await searchUser("linus");

  // Should see warning
  expect(
    screen.getByText("Session expired. Please sign in again."),
  ).toBeInTheDocument();
  expect(screen.getByText("Demo mode active")).toBeInTheDocument();
});
```

#### 3.3. State Reuse Attack

**Что не протестировано:**

- Атакер перехватывает state parameter → пытается использовать повторно
- CSRF protection должен блокировать

**Тест:**

```typescript
test("should reject reused OAuth state", async () => {
  const state = "captured_state_123";

  // First use succeeds
  await callbackHandler({ query: { code: "abc", state } }, res1);
  expect(res1.redirect).toHaveBeenCalledWith("/?auth=success");

  // Second use with same state should fail
  await callbackHandler({ query: { code: "def", state } }, res2);
  expect(res2.redirect).toHaveBeenCalledWith("/?error=csrf_failed");
});
```

---

## 📊 СТАТИСТИКА ТЕСТОВ

### Покрытие

| Категория             | Кол-во тестов           | Покрытие | Оценка                      |
| --------------------- | ----------------------- | -------- | --------------------------- |
| **Unit Tests**        | 75 файлов               | 90%+     | ✅ Отлично                  |
| **Integration Tests** | 8 файлов                | 40%      | ⚠️ Пробелы                  |
| **E2E Tests**         | 7 файлов, ~60 сценариев | 70%      | ⚠️ Gaps в критических путях |
| **API Endpoints**     | 4/7 с тестами           | 57%      | ❌ Analytics БЕЗ тестов     |

### Проблемы

**1. Высокое покрытие МАСКИРУЕТ пробелы:**

- 99.85% тестов проходят (1302/1304)
- НО: unit тесты часто моки всё
- Критические integration flows НЕ протестированы end-to-end

**2. Тесты не проверяют ГДЕ и ПОЧЕМУ:**

```typescript
// ПЛОХО (текущий код)
expect(screen.getByText("42")).toBeInTheDocument();
// ↑ "42" найдено ГДЕ-ТО на странице, но где именно? В правильном ли месте?

// ХОРОШО (детальная проверка)
const activeSessionsCard = screen.getByRole("region", {
  name: "Active Sessions",
});
expect(within(activeSessionsCard).getByText("42")).toBeInTheDocument();
expect(
  within(activeSessionsCard).getByText("unique users"),
).toBeInTheDocument();
// ↑ Проверяем что "42" именно в карточке Active Sessions, а не где-то ещё
```

**3. Нет кастомных assertion messages:**

```typescript
// ПЛОХО
expect(result.score).toBeGreaterThanOrEqual(0);
// ↑ Падает с generic ошибкой: "Expected 0, received -5"

// ХОРОШО
expect(result.score).toBeGreaterThanOrEqual(
  0,
  `Authenticity score должен быть >=0, получен ${result.score}. ` +
    `Репозитории: ${result.metadata.totalRepos}, ` +
    `Оригинальные: ${result.metadata.originalRepos}, ` +
    `Flags: ${result.flags.join(", ")}`,
);
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
expect(result.score).toBe(75);

// ПОСЛЕ
expect(result.score).toBe(
  75,
  `Expected authenticity score 75, got ${result.score}.\n` +
    `Breakdown: originality=${result.breakdown.originalityScore}, ` +
    `activity=${result.breakdown.activityScore}, ` +
    `quality=${result.breakdown.qualityScore}, ` +
    `consistency=${result.breakdown.consistencyScore}.\n` +
    `Flags: ${result.flags.join(", ")}`,
);
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
expect(screen.getByText("42")).toBeInTheDocument();

// ПОСЛЕ (проверяет конкретную структуру)
const dashboard = screen.getByRole("region", { name: "OAuth Analytics" });
const sessionsCard = within(dashboard).getByRole("article", {
  name: "Active Sessions",
});
expect(within(sessionsCard).getByText("42")).toBeInTheDocument();
expect(within(sessionsCard).getByText("unique users")).toBeInTheDocument();
```

#### 2.3. Consolidate Mock Data

**Время:** 2-3 hours
**Файлы:** Обновить 18 файлов с дублированием repository mocks

**Принцип:**

```typescript
// ДО (каждый тест создаёт свой mock)
const mockRepository = {
  id: "1",
  name: "test-repo",
  // ... 40 строк boilerplate
};

// ПОСЛЕ (используем централизованную factory)
import { createMockRepository } from "@/test/mocks/github-data";

const mockRepository = createMockRepository({
  id: "1",
  name: "test-repo",
});
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
test("should not use demo cache after OAuth login", async () => {
  // 1. Search in demo mode
  await searchUser("torvalds");
  const demoCacheKey = await kv.keys("demo:user:torvalds:*");
  expect(demoCacheKey).toHaveLength(1);

  // 2. Log in with OAuth
  await signIn();

  // 3. Search same user
  await searchUser("torvalds");

  // 4. Should use DIFFERENT cache key
  const userCacheKey = await kv.keys("user:session123:user:torvalds:*");
  expect(userCacheKey).toHaveLength(1);

  // 5. Demo cache should NOT be used
  const fetchCalls = mockFetch.mock.calls;
  expect(fetchCalls.some((call) => call[0].includes("torvalds"))).toBe(true);
});
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

## 📏 МЕТРИКИ УСПЕХА

### Как измерить завершение рефакторинга

#### 1. Покрытие тестами

| Метрика               | Текущее | Цель     | Дедлайн  |
| --------------------- | ------- | -------- | -------- |
| **API Endpoints**     | 67%     | **100%** | Неделя 1 |
| **Components**        | 95%     | **100%** | Неделя 2 |
| **Hooks**             | 80%     | **100%** | Неделя 1 |
| **Integration Tests** | 60%     | **90%+** | Неделя 3 |
| **E2E Coverage**      | 70%     | **85%+** | Неделя 4 |

#### 2. Качество диагностики

**Текущее:**

```bash
❌ FAIL src/hooks/useAuthenticityScore.test.ts
  Expected: 75
  Received: 68
```

**Цель:**

```bash
❌ FAIL src/hooks/useAuthenticityScore.test.ts
  Expected authenticity score 75, got 68.

  Breakdown:
    - originalityScore: 25 (expected 25) ✓
    - activityScore: 18 (expected 25) ✗ DIFFERENCE!
    - qualityScore: 15 (expected 15) ✓

  DIAGNOSIS: activityScore calculation changed.
  Check: src/lib/metrics/activity.ts:calculateActivityScore()
```

**Метрики:**

- ✅ **100%** критических assertions имеют custom messages
- ✅ **100%** падений тестов показывают файл + функцию + причину
- ✅ **0** случаев "нужен debugger чтобы понять что сломалось"

#### 3. Критические пути

| Путь                          | Статус       | Дедлайн |
| ----------------------------- | ------------ | ------- |
| Rate Limit: API → UI          | ❌ Нет теста | День 1  |
| Cache Transition: Demo → Auth | ❌ Нет теста | День 2  |
| Session Expiration Mid-Use    | ❌ Нет теста | День 3  |
| Analytics: Logger KV Failures | ❌ Нет теста | День 4  |
| OAuth CSRF Edge Cases         | ⚠️ Частичный | День 5  |

**Цель:** ✅ **Все** критические пути имеют integration + E2E тесты

#### 4. Production Bugs Prevented

**Текущее:** 3 найденных production bugs (не пойманные тестами)
**Цель:** 0 bugs проходят мимо тестов после рефакторинга

**Как измерить:**

- При каждом найденном production bug → создать тест, который его ловит
- Если тест существовал → улучшить его (добавить assertions)
- Tracking: `docs/bugs-caught-by-tests.md`

#### 5. Developer Experience

**Метрики:**

| Метрика                               | Текущее | Цель   |
| ------------------------------------- | ------- | ------ |
| Время на debugging теста              | ~30 мин | <5 мин |
| "Почему тест упал?" понятно сразу     | 40%     | 95%    |
| Тесты находят проблему ДО code review | 60%     | 90%    |
| False positives (тест падает, код OK) | 5%      | <1%    |

**Как измерить:**

- Survey команды каждую неделю
- Track время на debugging в git commits
- Count: сколько раз reviewer нашёл баг, который тесты не поймали

---

## 🚀 ДЕТАЛЬНЫЙ ПЛАН ДЕЙСТВИЙ

### WEEK 1: Критические исправления (Priority 🔴)

#### День 1: Rate Limit Bug Fix

**Проблема:** Rate limit не обновляется в UI (см. [Критическая находка #1](#1--production-bug-rate-limit-не-обновляется-в-ui))

**Задачи:**

1. **Исправить код** (1-2 часа)

   ```typescript
   // src/components/UserProfile.tsx
   interface UserProfileProps {
     userName: string;
     onRateLimitUpdate?: (rateLimit: RateLimit) => void; // ← ADD
   }

   const { data, loading, error, refetch } = useQueryUser(userName, 365, {
     onRateLimitUpdate: props.onRateLimitUpdate, // ← ADD
   });
   ```

   ```typescript
   // src/App.tsx
   <UserProfile
     userName={userName}
     onRateLimitUpdate={handleRateLimitUpdate}  // ← ADD
   />
   ```

2. **Создать integration тест** (1-2 часа)

   ```typescript
   // src/apollo/rate-limit-flow.integration.test.tsx
   test('rate limit flows from GitHub API to UI banner', async () => {
     // Mock GitHub API with specific rate limit
     mockGitHubAPI({ rateLimit: { remaining: 4500, limit: 5000 } })

     render(<App />)
     await searchUser('torvalds')

     // Verify banner shows correct value
     await waitFor(() => {
       expect(screen.getByText('4500 / 5000')).toBeInTheDocument()
     })
   })
   ```

3. **Commit & Push** (15 мин)

**Критерий успеха:**

- ✅ Rate limit в баннере обновляется при каждом запросе
- ✅ Integration тест проверяет полный flow
- ✅ Все существующие тесты проходят

---

#### День 2-3: Analytics API Tests

**Проблема:** `api/analytics/*` без тестов, silent failures (см. [Критическая находка #2](#2--критический-пробел-analytics-endpoints-без-тестов))

**Задачи:**

1. **Unit tests для logger** (2-3 часа)

   ```typescript
   // api/analytics/logger.test.ts
   describe('logOAuthLogin', () => {
     test('should successfully log to KV', async () => {...})
     test('should retry on KV timeout', async () => {...})
     test('should emit metric on final failure', async () => {...})
   })

   describe('logOAuthLogout', () => {...})
   describe('logOAuthError', () => {...})
   ```

2. **Integration tests для oauth-usage** (2-3 часа)

   ```typescript
   // api/analytics/oauth-usage.integration.test.ts
   describe('GET /api/analytics/oauth-usage', () => {
     test('should aggregate metrics from KV', async () => {...})
     test('should filter by time period', async () => {...})
     test('should paginate large datasets', async () => {...})
     test('should return 500 on KV failure', async () => {...})
   })
   ```

3. **Улучшить error handling** (1-2 часа)
   ```typescript
   // api/analytics/logger.ts
   try {
     await kv.zadd(key, value);
   } catch (error) {
     logger.error("KV write failed", { key, error, userId });
     await sendToDeadLetterQueue({ operation: "kv.zadd", key, value });
     throw new KVWriteError(`Failed to write ${key}`, { cause: error });
   }
   ```

**Критерий успеха:**

- ✅ 100% покрытие `api/analytics/logger.ts`
- ✅ 100% покрытие `api/analytics/oauth-usage.ts`
- ✅ Все failure scenarios протестированы

---

#### День 4-5: OAuth Security Edge Cases

**Проблема:** CSRF state expiration, session expiration, state reuse не протестированы (см. [Критическая находка #3](#3--опасность-oauth-security-edge-cases-не-протестированы))

**Задачи:**

1. **Unit tests для callback edge cases** (2 часа)

   ```typescript
   // api/auth/callback.test.ts (добавить)
   test('should reject expired CSRF state (11+ min)', async () => {...})
   test('should reject reused OAuth state', async () => {...})
   test('should reject tampered state', async () => {...})
   ```

2. **E2E test для session expiration** (2 часа)

   ```typescript
   // e2e/oauth-security.spec.ts (новый файл)
   test("should notify user when session expires mid-use", async ({ page }) => {
     // Login → make request → delete session → make request
     // Should see "Session expired" warning
   });
   ```

3. **Документация security checklist** (30 мин)

**Критерий успеха:**

- ✅ Все OAuth edge cases покрыты тестами
- ✅ Security checklist обновлён
- ✅ E2E тесты проходят в CI/CD

---

### WEEK 2: Качество диагностики (Priority 🟠)

#### День 6-7: Custom Assertion Messages

**Цель:** Каждое падение теста показывает ЧТО, ГДЕ, ПОЧЕМУ

**Задачи:**

1. **Создать helper utilities** (1 час)

   ```typescript
   // src/test/helpers/assertions.ts
   export function expectAuthenticityScore(
     result: AuthenticityResult,
     expected: number,
     customMessage?: string,
   ) {
     const message =
       customMessage ||
       `
       Expected authenticity score ${expected}, got ${result.score}.
   
       Breakdown:
         - originalityScore: ${result.breakdown.originalityScore}
         - activityScore: ${result.breakdown.activityScore}
         - qualityScore: ${result.breakdown.qualityScore}
         - consistencyScore: ${result.breakdown.consistencyScore}
   
       Flags: ${result.flags.join(", ")}
       Total Repos: ${result.metadata.totalRepos}
     `.trim();

     expect(result.score, message).toBe(expected);
   }
   ```

2. **Обновить критические тесты** (3-4 часа)
   - `src/hooks/useAuthenticityScore.test.ts`
   - `src/lib/metrics/*.test.ts`
   - `src/components/user/UserAuthenticity.test.tsx`

**Критерий успеха:**

- ✅ Все metric calculations имеют custom assertions
- ✅ При падении теста → сразу видно причину без debugger

---

#### День 8-9: Structural Assertions

**Цель:** Тесты проверяют DOM structure, не только текст

**Задачи:**

1. **Обновить component tests** (4-5 часов)

   ```typescript
   // ДО
   expect(screen.getByText("42")).toBeInTheDocument();

   // ПОСЛЕ
   const dashboard = screen.getByRole("region", { name: "OAuth Analytics" });
   const sessionsCard = within(dashboard).getByRole("article", {
     name: "Active Sessions",
   });
   expect(within(sessionsCard).getByText("42")).toBeInTheDocument();
   expect(within(sessionsCard).getByText("unique users")).toBeInTheDocument();
   ```

2. **Обновить accessibility checks** (2 часа)
   - Добавить ARIA labels где их нет
   - Обновить тесты для проверки ARIA

**Критерий успеха:**

- ✅ Каждый component test проверяет structure
- ✅ Accessibility violations = 0

---

#### День 10: ErrorBoundary Tests

**Проблема:** Критический компонент БЕЗ тестов

**Задачи:**

1. **Создать Storybook stories** (30 мин)

   ```typescript
   // src/components/layout/ErrorBoundary.stories.tsx
   export const Default: Story = {...}
   export const WithError: Story = {...}
   export const AfterReset: Story = {...}
   ```

2. **Создать unit tests** (2 часа)

   ```typescript
   // src/components/layout/ErrorBoundary.test.tsx
   test('should catch errors from children', () => {...})
   test('should display error message', () => {...})
   test('should reset on button click', () => {...})
   test('should log error to monitoring', () => {...})
   ```

3. **E2E test** (1 час)
   ```typescript
   // e2e/error-handling.spec.ts
   test('should show error boundary on component crash', async ({ page }) => {...})
   ```

**Критерий успеха:**

- ✅ ErrorBoundary имеет 100% покрытие
- ✅ Все error scenarios протестированы

---

### WEEK 3: Integration Tests (Priority 🟡)

#### День 11-13: Cache Transition Test

**Проблема:** Demo → Auth cache transition не протестирован

**Задачи:**

1. **Integration test** (3-4 часа)

   ```typescript
   // src/integration/cache-transition.integration.test.tsx
   test("should not use demo cache after OAuth login", async () => {
     // 1. Search in demo mode
     await searchUser("torvalds");
     const demoCacheKey = await kv.keys("demo:user:torvalds:*");
     expect(demoCacheKey).toHaveLength(1);

     // 2. Log in
     await signIn();

     // 3. Search same user
     await searchUser("torvalds");

     // 4. Should use different cache
     const userCacheKey = await kv.keys("user:session123:user:torvalds:*");
     expect(userCacheKey).toHaveLength(1);

     // 5. Should NOT reuse demo cache
     expect(mockFetch).toHaveBeenCalledWith(
       expect.stringContaining("torvalds"),
     );
   });
   ```

2. **E2E test** (2 часа)

**Критерий успеха:**

- ✅ Cache transition работает корректно
- ✅ Integration + E2E тесты проходят

---

#### День 14-15: Parallel Query Failure Test

**Проблема:** Что происходит если часть yearly queries падает?

**Задачи:**

1. **Integration test** (3-4 часа)

   ```typescript
   test('should show partial timeline when some years fail', async () => {
     // Mock: 2020-2023 succeed, 2024 fails
     mockGitHubAPI({
       '2020': { success: true, data: yearData2020 },
       '2024': { success: false, error: 'Network timeout' },
     })

     render(<App />)
     await searchUser('torvalds')

     // Should show 2020-2023
     expect(screen.getByText('2023')).toBeInTheDocument()

     // Should show warning
     expect(screen.getByText(/Could not load data for 2024/)).toBeInTheDocument()

     // Metrics should use available years only
     expect(screen.getByText('4 years of activity')).toBeInTheDocument()
   })
   ```

**Критерий успеха:**

- ✅ Partial failures обрабатываются корректно
- ✅ UI показывает warning
- ✅ Metrics рассчитываются из доступных данных

---

### WEEK 4: Mock Data & Documentation

#### День 16-17: Consolidate Mock Data

**Проблема:** 18 файлов дублируют repository mocks

**Задачи:**

1. **Создать centralised factories** (3 часа)

   ```typescript
   // src/test/mocks/github-data.ts (обновить)
   export function createMockRepository(
     overrides?: Partial<Repository>,
   ): Repository {
     return {
       id: faker.string.uuid(),
       name: faker.lorem.word(),
       stargazerCount: faker.number.int({ min: 0, max: 1000 }),
       ...overrides,
     };
   }
   ```

2. **Refactor все тесты** (2-3 часа)
   - Заменить inline mocks на factories
   - Убрать дубликаты

**Критерий успеха:**

- ✅ Экономия ~500 строк кода
- ✅ Все тесты проходят

---

#### День 18-20: Documentation & Cleanup

**Задачи:**

1. **Обновить testing-guide.md** (2 часа)
2. **Создать примеры best practices** (2 часа)
3. **Team training session** (2 часа)
4. **Финальный review** (2 часа)

**Критерий успеха:**

- ✅ Вся документация обновлена
- ✅ Команда обучена новым практикам

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
  await kv.set(key, value);
} catch (error) {
  console.error(error); // ← МОЛЧАЛИВАЯ ОШИБКА!
}

// ХОРОШО
try {
  await kv.set(key, value);
} catch (error) {
  logger.error("KV write failed", { key, error, userId, timestamp });
  await sendToDeadLetterQueue({ operation: "kv.set", key, value });
  throw new KVWriteError(`Failed to write ${key}`, { cause: error });
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

---

## 🎯 РЕЗЮМЕ И ПРИОРИТИЗАЦИЯ

### Что делать ПРЯМО СЕЙЧАС (Week 1)

**3 критических задачи на эту неделю:**

1. **Rate Limit Bug** (2-3 часа)
   - Файлы: `UserProfile.tsx`, `App.tsx`, integration test
   - Impact: HIGH - production bug, видимый пользователям
   - Complexity: LOW - простое исправление

2. **Analytics Tests** (6-8 часов)
   - Файлы: `api/analytics/logger.test.ts`, `oauth-usage.integration.test.ts`
   - Impact: HIGH - 375 строк без тестов, silent failures
   - Complexity: MEDIUM - нужны mock KV, retry logic

3. **OAuth Security Edge Cases** (4-5 часов)
   - Файлы: `callback.test.ts`, `oauth-security.spec.ts`
   - Impact: HIGH - security уязвимости
   - Complexity: MEDIUM - нужно понимание OAuth flow

**Итого Week 1:** 12-16 часов работы

---

### Матрица приоритетов

| Задача                  | Impact  | Complexity | Effort | Priority |
| ----------------------- | ------- | ---------- | ------ | -------- |
| Rate Limit Bug          | 🔴 HIGH | 🟢 LOW     | 2-3h   | **P0**   |
| Analytics Tests         | 🔴 HIGH | 🟡 MED     | 6-8h   | **P0**   |
| OAuth Security          | 🔴 HIGH | 🟡 MED     | 4-5h   | **P0**   |
| ErrorBoundary Tests     | 🔴 HIGH | 🟢 LOW     | 3-4h   | **P1**   |
| Custom Assertions       | 🟡 MED  | 🟢 LOW     | 4-6h   | **P1**   |
| Structural Assertions   | 🟡 MED  | 🟡 MED     | 6-7h   | **P1**   |
| Cache Transition Test   | 🟡 MED  | 🟡 MED     | 5-6h   | **P2**   |
| Parallel Query Test     | 🟢 LOW  | 🟡 MED     | 3-4h   | **P2**   |
| Mock Data Consolidation | 🟢 LOW  | 🟢 LOW     | 5-6h   | **P3**   |
| Documentation           | 🟢 LOW  | 🟢 LOW     | 8h     | **P3**   |

**Priority Legend:**

- **P0** - Критично, делать НЕМЕДЛЕННО (production bugs, security)
- **P1** - Высокий приоритет, делать на этой неделе (качество)
- **P2** - Средний приоритет, делать в течение месяца (improvement)
- **P3** - Низкий приоритет, делать когда будет время (cleanup)

---

### Измеримые цели на 4 недели

#### Week 1 Goals

- ✅ 0 критических production bugs
- ✅ 100% API endpoints имеют unit tests
- ✅ OAuth security edge cases покрыты
- ✅ ErrorBoundary протестирован
- **Метрика:** API coverage 67% → **100%**

#### Week 2 Goals

- ✅ 100% критических assertions имеют custom messages
- ✅ 100% component tests проверяют structure
- ✅ 0 accessibility violations
- **Метрика:** Test diagnostics quality 40% → **95%**

#### Week 3 Goals

- ✅ Все критические пути имеют integration tests
- ✅ Cache transition протестирован
- ✅ Parallel query failures протестированы
- **Метрика:** Integration coverage 60% → **90%**

#### Week 4 Goals

- ✅ Mock data consolidation завершен
- ✅ Документация обновлена
- ✅ Команда обучена best practices
- **Метрика:** Code duplication -500 lines

---

### Quick Start Guide

**Хочешь начать прямо сейчас? Вот первые 3 команды:**

```bash
# 1. Создать ветку для рефакторинга
git checkout -b test-refactoring

# 2. Исправить Rate Limit Bug (P0, 2-3h)
# Открой src/components/UserProfile.tsx и добавь prop onRateLimitUpdate

# 3. Создать integration тест
touch src/apollo/rate-limit-flow.integration.test.tsx
# Скопируй пример из раздела "День 1: Rate Limit Bug Fix"

# 4. Запустить тесты
npm test -- rate-limit-flow.integration.test.tsx

# 5. Commit & Push
git add .
git commit -m "fix: rate limit bug - добавлен callback onRateLimitUpdate + integration test"
git push
```

**После этого:**

- Переходи к Analytics Tests (P0, 6-8h)
- Или к ErrorBoundary Tests (P1, 3-4h) если нужна более простая задача

---

### FAQ

**Q: Можно ли пропустить какие-то тесты?**
A: НЕТ для P0 (production bugs, security). ДА для P3 (cleanup). P1/P2 - обсуждаемо.

**Q: Что если нет времени на всё?**
A: Минимум:

- Week 1 P0 задачи (12-16h) - ОБЯЗАТЕЛЬНО
- Week 2 ErrorBoundary + Custom Assertions (7-10h) - КРАЙНЕ ЖЕЛАТЕЛЬНО
- Week 3-4 - по возможности

**Q: Как измерить прогресс?**
A: Используй метрики из раздела "Метрики успеха":

- API coverage % (текущее 67%, цель 100%)
- Test diagnostics quality % (текущее 40%, цель 95%)
- Integration coverage % (текущее 60%, цель 90%)

**Q: Что если найду новые bugs во время рефакторинга?**
A: Отлично! Это и есть цель.

1. Создай тест, который ловит баг
2. Исправь баг
3. Verify тест теперь проходит
4. Добавь в `docs/bugs-caught-by-tests.md`

**Q: Нужна ли code review для тестов?**
A: ДА, обязательно. Тесты - это тоже код.

- Review criteria: правильность, читаемость, покрытие edge cases
- Особое внимание: assertions messages, структура тестов

---

## ✅ CHECKLIST ДЛЯ ЗАВЕРШЕНИЯ

### Week 1 (Критические исправления)

- [ ] Rate limit bug исправлен
- [ ] Integration тест для rate limit создан
- [ ] `api/analytics/logger.test.ts` создан (100% покрытие)
- [ ] `api/analytics/oauth-usage.integration.test.ts` создан
- [ ] OAuth security edge cases добавлены в `callback.test.ts`
- [ ] `e2e/oauth-security.spec.ts` создан
- [ ] Все существующие тесты проходят
- [ ] Code review пройден
- [ ] Merged в main branch

### Week 2 (Качество диагностики)

- [ ] `src/test/helpers/assertions.ts` создан
- [ ] Custom assertions добавлены в metric tests
- [ ] Structural assertions добавлены в component tests
- [ ] ARIA labels добавлены где нужно
- [ ] `ErrorBoundary.stories.tsx` создан
- [ ] `ErrorBoundary.test.tsx` создан (100% покрытие)
- [ ] `e2e/error-handling.spec.ts` создан
- [ ] Accessibility violations = 0

### Week 3 (Integration Tests)

- [ ] `cache-transition.integration.test.tsx` создан
- [ ] Cache transition E2E тест создан
- [ ] Parallel query failure test создан
- [ ] Все критические пути покрыты integration tests

### Week 4 (Cleanup & Documentation)

- [ ] Mock data factories обновлены
- [ ] Дубликаты в тестах удалены
- [ ] `testing-guide.md` обновлён
- [ ] Best practices examples созданы
- [ ] Team training session проведён
- [ ] Финальный review завершён

---

## 📞 КОНТАКТЫ И ПОДДЕРЖКА

**Вопросы по рефакторингу:**

- См. этот документ: `docs/TEST_REFACTORING_REPORT.md`
- Testing guide: `docs/testing-guide.md`
- Component development: `docs/component-development.md`

**Нужна помощь?**

- Создай issue в GitHub с тегом `testing`
- Добавь примеры failing tests
- Опиши что пытаешься достичь

**Прогресс трекинг:**

- Weekly updates в команде
- Metrics dashboard (TBD)
- Bugs caught: `docs/bugs-caught-by-tests.md` (создать)

---

**Последнее обновление:** 2025-11-19
**Версия:** 2.0
**Статус:** Ready for implementation
**Reviewer:** Team lead
**Approver:** Engineering manager
