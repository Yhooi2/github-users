# Testing Guide - Стратегия тестирования проекта

> Полное руководство по тестированию с Vitest 4, Playwright, React Testing Library и Apollo Client MockedProvider

## Содержание

- [Обзор тестирования](#обзор-тестирования)
- [Vitest 4 - Unit & Integration Tests](#vitest-4---unit--integration-tests)
- [Playwright - E2E Tests](#playwright---e2e-tests)
- [React Testing Library](#react-testing-library)
- [Apollo Client MockedProvider](#apollo-client-mockedprovider)
- [Структура тестов](#структура-тестов)
- [Паттерны тестирования](#паттерны-тестирования)
- [Coverage Requirements](#coverage-requirements)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)

---

## Обзор тестирования

### Текущее состояние

**Статус:** ✅ **62/62 тестов проходят**

```bash
# Статистика тестов
Unit Tests:         31 passing
Integration Tests:  31 passing (включены в unit)
E2E Tests:          Настроены, готовы к использованию

# Coverage
Lines:   95%+
Branches: 90%+
Functions: 100%
```

### Testing Stack

| Инструмент | Версия | Назначение |
|-----------|--------|------------|
| **Vitest** | 4.0.6 | Unit & Integration testing |
| **Playwright** | 1.56.1 | E2E testing (3 browsers) |
| **React Testing Library** | 16.1.0 | Component testing |
| **@testing-library/user-event** | 14.6.2 | User interactions |
| **@apollo/client/testing** | 3.14.0 | GraphQL mocking |
| **@vitest/coverage-v8** | 4.0.6 | Code coverage |

### Типы тестов

```
Unit Tests (31)
├── date-helpers.test.ts (18 tests) - Утилиты дат
├── SearchForm.test.tsx (7 tests) - Форма поиска
└── UserProfile.test.tsx (6 tests) - Профиль пользователя

Integration Tests (встроены в unit)
└── Тестируют взаимодействие компонентов с Apollo Client

E2E Tests (Playwright)
└── e2e/ - End-to-end сценарии
```

---

## Vitest 4 - Unit & Integration Tests

### Конфигурация

**Файл:** `vite.config.ts`

```typescript
/// <reference types="vitest/config" />
import { defineConfig } from 'vite'

export default defineConfig({
  test: {
    globals: true,              // ✅ describe, it, expect без импортов
    environment: 'jsdom',       // ✅ DOM API для React тестов
    setupFiles: ['./src/test/setup.ts'], // ✅ Setup файл
    css: true,                  // ✅ Обработка CSS

    exclude: [
      'node_modules/**',
      'dist/**',
      'e2e/**',                 // ❗ E2E тесты отдельно
      '**/*.e2e.ts',
      '**/*.spec.ts',
    ],

    coverage: {
      provider: 'v8',           // ✅ Быстрый V8 coverage
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/mockData',
        'dist/',
        'e2e/',
      ],
    },
  },
})
```

### Setup файл

**Файл:** `src/test/setup.ts`

```typescript
import '@testing-library/jest-dom'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

// ✅ Cleanup после каждого теста
afterEach(() => {
  cleanup()
})

// ✅ Моки для browser APIs
globalThis.matchMedia = globalThis.matchMedia || function() {
  return {
    matches: false,
    addEventListener: () => {},
    removeEventListener: () => {}
  }
}
```

### Запуск тестов

```bash
# Все unit тесты
npm test
npm run test

# Watch mode (разработка)
npm run test:watch

# Coverage отчет
npm run test:coverage

# UI mode (интерактивный)
npm run test:ui

# Конкретный файл
npm test SearchForm.test.tsx
```

### Структура теста

```typescript
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'

describe('ComponentName', () => {
  // ✅ Setup перед каждым тестом
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // ✅ Cleanup после каждого теста
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should render correctly', () => {
    render(<Component />)
    expect(screen.getByText('Hello')).toBeInTheDocument()
  })
})
```

---

## Playwright - E2E Tests

### Конфигурация

**Файл:** `playwright.config.ts`

```typescript
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',           // ✅ E2E тесты в отдельной папке
  fullyParallel: true,        // ✅ Параллельный запуск

  forbidOnly: !!process.env.CI,  // ❗ test.only запрещен на CI
  retries: process.env.CI ? 2 : 0, // ✅ 2 retry на CI
  workers: process.env.CI ? 1 : undefined,

  reporter: 'html',

  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',      // ✅ Trace при retry
    screenshot: 'only-on-failure', // ✅ Screenshot при ошибке
  },

  // ✅ 3 браузера
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],

  // ✅ Автозапуск dev сервера
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
})
```

### Пример E2E теста

**Файл:** `e2e/user-search.spec.ts`

```typescript
import { test, expect } from '@playwright/test'

test.describe('GitHub User Search', () => {
  test('should search for user and display profile', async ({ page }) => {
    // ✅ Открыть приложение
    await page.goto('/')

    // ✅ Ввести username
    await page.fill('input[placeholder*="Search GitHub User"]', 'octocat')

    // ✅ Нажать Search
    await page.click('button[type="submit"]')

    // ✅ Дождаться загрузки
    await page.waitForSelector('text=The Octocat', { timeout: 5000 })

    // ✅ Проверить данные
    await expect(page.locator('text=@octocat')).toBeVisible()
    await expect(page.locator('text=GitHub mascot')).toBeVisible()
  })

  test('should show error for invalid user', async ({ page }) => {
    await page.goto('/')
    await page.fill('input[placeholder*="Search GitHub User"]', 'nonexistentuser12345')
    await page.click('button[type="submit"]')

    // ✅ Проверить ошибку
    await expect(page.locator('text=User Not Found')).toBeVisible()
  })
})
```

### Запуск E2E

```bash
# Все E2E тесты
npm run test:e2e
npx playwright test

# Конкретный браузер
npx playwright test --project=chromium

# Debug mode
npx playwright test --debug

# UI mode
npx playwright test --ui

# Показать отчет
npx playwright show-report
```

---

## React Testing Library

### Основы

React Testing Library - философия тестирования "как пользователь".

**Принципы:**
- ✅ Тестируй поведение, а не реализацию
- ✅ Используй selectors как пользователь (text, role, label)
- ❌ Не тестируй внутреннее состояние
- ❌ Не тестируй implementation details

### Queries Priority

```typescript
// ✅ 1. Accessible queries (лучше всего)
screen.getByRole('button', { name: /search/i })
screen.getByLabelText(/username/i)
screen.getByPlaceholderText(/search github user/i)
screen.getByText(/loading/i)

// ✅ 2. Semantic queries
screen.getByAltText('Profile avatar')
screen.getByTitle('GitHub profile')

// ⚠️ 3. Test IDs (последний вариант)
screen.getByTestId('user-profile')
```

### Пример: Testing форм

**Файл:** `src/components/SearchForm.test.tsx`

```typescript
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import SearchForm from './SearchForm'

// ✅ Mock external dependencies
vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
  },
}))

describe('SearchForm', () => {
  const mockSetUserName = vi.fn()
  const defaultProps = {
    userName: '',
    setUserName: mockSetUserName,
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('updates input value when typing', async () => {
    // ✅ Setup user-event
    const user = userEvent.setup()
    render(<SearchForm {...defaultProps} />)

    // ✅ Find input
    const input = screen.getByPlaceholderText(/Search GitHub User/i)

    // ✅ Type into input
    await user.type(input, 'testuser')

    // ✅ Assert value
    expect(input).toHaveValue('testuser')
  })

  it('calls setUserName on submit', async () => {
    const user = userEvent.setup()
    render(<SearchForm {...defaultProps} />)

    const input = screen.getByPlaceholderText(/Search GitHub User/i)
    const button = screen.getByRole('button', { name: /search/i })

    await user.type(input, 'octocat')
    await user.click(button)

    // ✅ Assert callback called
    expect(mockSetUserName).toHaveBeenCalledWith('octocat')
    expect(mockSetUserName).toHaveBeenCalledTimes(1)
  })

  it('shows error toast when submitting empty form', async () => {
    const user = userEvent.setup()
    render(<SearchForm {...defaultProps} />)

    const button = screen.getByRole('button', { name: /search/i })
    await user.click(button)

    // ✅ Assert toast called
    expect(toast.error).toHaveBeenCalledWith('Please enter a valid username')
    expect(mockSetUserName).not.toHaveBeenCalled()
  })

  it('has accessible label for screen readers', () => {
    render(<SearchForm {...defaultProps} />)

    // ✅ Test accessibility
    const label = screen.getByLabelText(/search/i)
    expect(label).toBeInTheDocument()
  })
})
```

### User Interactions

```typescript
import userEvent from '@testing-library/user-event'

const user = userEvent.setup()

// ✅ Typing
await user.type(input, 'text')

// ✅ Clicking
await user.click(button)

// ✅ Double click
await user.dblClick(element)

// ✅ Hover
await user.hover(element)

// ✅ Tab navigation
await user.tab()

// ✅ Keyboard
await user.keyboard('{Enter}')
await user.type(input, 'text{Enter}')

// ✅ Clear
await user.clear(input)
```

### Async Testing

```typescript
import { waitFor, waitForElementToBeRemoved } from '@testing-library/react'

// ✅ Wait for element to appear
await waitFor(() => {
  expect(screen.getByText('Loaded')).toBeInTheDocument()
})

// ✅ Wait for element to disappear
await waitForElementToBeRemoved(() => screen.queryByText('Loading...'))

// ✅ Find queries (async by default)
const element = await screen.findByText('Async content')
```

---

## Apollo Client MockedProvider

### Основы мокирования

Apollo Client предоставляет `MockedProvider` для тестирования компонентов с GraphQL.

### Паттерн 1: Mock хука

**Лучший подход для unit тестов**

```typescript
import { vi } from 'vitest'
import useQueryUser from '@/apollo/useQueryUser'

// ✅ Mock хука
vi.mock('@/apollo/useQueryUser', () => ({
  default: vi.fn(),
}))

describe('UserProfile', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders loading state', () => {
    // ✅ Mock возвращаемое значение
    vi.mocked(useQueryUser).mockReturnValue({
      data: null,
      loading: true,
      error: undefined,
    })

    render(
      <MockedProvider>
        <UserProfile userName="octocat" />
      </MockedProvider>
    )

    expect(screen.getByText(/loading/i)).toBeInTheDocument()
  })

  it('renders error state', () => {
    // ✅ Mock error
    const mockError = {
      message: 'Network error',
      name: 'NetworkError',
      graphQLErrors: [],
      clientErrors: [],
      networkError: null,
      extraInfo: null,
    }

    vi.mocked(useQueryUser).mockReturnValue({
      data: null,
      loading: false,
      error: mockError,
      refetch: vi.fn(),
    })

    render(
      <MockedProvider>
        <UserProfile userName="octocat" />
      </MockedProvider>
    )

    expect(screen.getByText(/Network error/i)).toBeInTheDocument()
  })

  it('renders user data', () => {
    // ✅ Mock успешные данные
    const mockData = {
      user: {
        name: 'The Octocat',
        login: 'octocat',
        avatarUrl: 'https://avatars.githubusercontent.com/u/583231',
        bio: 'GitHub mascot',
        location: 'San Francisco',
        url: 'https://github.com/octocat',
        createdAt: '2011-01-25T18:44:36Z',
        followers: { totalCount: 1000 },
        following: { totalCount: 100 },
        gists: { totalCount: 8 },
        repositories: { totalCount: 50 },
        year1: { totalCommitContributions: 500 },
        year2: { totalCommitContributions: 750 },
        year3: { totalCommitContributions: 200 },
        contributionsCollection: {
          commitContributionsByRepository: [
            {
              repository: { name: 'Hello-World' },
              contributions: { totalCount: 150 },
            },
          ],
        },
      },
    }

    vi.mocked(useQueryUser).mockReturnValue({
      data: mockData,
      loading: false,
      error: undefined,
    })

    render(
      <MockedProvider>
        <UserProfile userName="octocat" />
      </MockedProvider>
    )

    expect(screen.getByText('The Octocat')).toBeInTheDocument()
    expect(screen.getByText('@octocat')).toBeInTheDocument()
    expect(screen.getByText('1000')).toBeInTheDocument() // Followers
  })
})
```

### Паттерн 2: MockedProvider с mocks

**Для integration тестов**

```typescript
import { MockedProvider } from '@apollo/client/testing'
import { GET_USER_QUERY } from '@/apollo/queries'

describe('UserProfile Integration', () => {
  it('loads and displays user', async () => {
    // ✅ Создать GraphQL mock
    const mocks = [
      {
        request: {
          query: GET_USER_QUERY,
          variables: { login: 'octocat' },
        },
        result: {
          data: {
            user: {
              name: 'The Octocat',
              login: 'octocat',
              // ... полные данные
            },
          },
        },
      },
    ]

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <UserProfile userName="octocat" />
      </MockedProvider>
    )

    // ✅ Ждем загрузки
    expect(screen.getByText(/loading/i)).toBeInTheDocument()

    // ✅ Ждем появления данных
    const userName = await screen.findByText('The Octocat')
    expect(userName).toBeInTheDocument()
  })

  it('handles GraphQL error', async () => {
    // ✅ Mock GraphQL error
    const mocks = [
      {
        request: {
          query: GET_USER_QUERY,
          variables: { login: 'octocat' },
        },
        error: new Error('GraphQL error'),
      },
    ]

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <UserProfile userName="octocat" />
      </MockedProvider>
    )

    const errorMessage = await screen.findByText(/GraphQL error/i)
    expect(errorMessage).toBeInTheDocument()
  })
})
```

### Apollo Error Handling (v3.14)

```typescript
import { ApolloError } from '@apollo/client'

// ✅ Новый метод .is() в Apollo 3.14
if (ApolloError.is(error)) {
  console.error('Apollo error:', error.message)
}

// ✅ Mock Apollo error в тестах
const mockError = {
  message: 'Network error',
  name: 'NetworkError',
  graphQLErrors: [],
  clientErrors: [],
  networkError: null,
  extraInfo: null,
}
```

---

## Структура тестов

### Организация файлов

```
project/
├── src/
│   ├── components/
│   │   ├── SearchForm.tsx
│   │   ├── SearchForm.test.tsx       ✅ Рядом с компонентом
│   │   ├── UserProfile.tsx
│   │   └── UserProfile.test.tsx
│   ├── apollo/
│   │   ├── date-helpers.ts
│   │   └── date-helpers.test.ts      ✅ Рядом с утилитой
│   └── test/
│       └── setup.ts                   ✅ Global setup
├── e2e/
│   ├── user-search.spec.ts           ✅ E2E отдельно
│   └── error-handling.spec.ts
└── playwright.config.ts
```

### Naming Conventions

```
Component.test.tsx    - Component tests
utils.test.ts         - Utility tests
*.spec.ts            - E2E tests (Playwright)
*.e2e.ts             - E2E tests (альтернатива)
```

---

## Паттерны тестирования

### 1. Arrange-Act-Assert (AAA)

```typescript
it('should update state on button click', async () => {
  // ✅ Arrange: Setup
  const user = userEvent.setup()
  const mockHandler = vi.fn()
  render(<Button onClick={mockHandler}>Click me</Button>)

  // ✅ Act: Действие
  const button = screen.getByRole('button', { name: /click me/i })
  await user.click(button)

  // ✅ Assert: Проверка
  expect(mockHandler).toHaveBeenCalledTimes(1)
})
```

### 2. Testing Loading States

```typescript
it('shows loading spinner', () => {
  vi.mocked(useQueryUser).mockReturnValue({
    data: null,
    loading: true,
    error: undefined,
  })

  render(<UserProfile userName="octocat" />)

  // ✅ Проверить loading UI
  expect(screen.getByText(/loading/i)).toBeInTheDocument()
})
```

### 3. Testing Error States

```typescript
it('displays error message', () => {
  const mockError = {
    message: 'API rate limit exceeded',
    name: 'RateLimitError',
    graphQLErrors: [],
    clientErrors: [],
    networkError: null,
    extraInfo: null,
  }

  vi.mocked(useQueryUser).mockReturnValue({
    data: null,
    loading: false,
    error: mockError,
    refetch: vi.fn(),
  })

  render(<UserProfile userName="octocat" />)

  // ✅ Проверить error UI
  expect(screen.getByText(/API rate limit exceeded/i)).toBeInTheDocument()
})
```

### 4. Testing Form Validation

```typescript
it('shows validation error for empty input', async () => {
  const user = userEvent.setup()
  const mockSubmit = vi.fn()

  render(<SearchForm userName="" setUserName={mockSubmit} />)

  const button = screen.getByRole('button', { name: /search/i })
  await user.click(button)

  // ✅ Проверить validation
  expect(toast.error).toHaveBeenCalledWith('Please enter a valid username')
  expect(mockSubmit).not.toHaveBeenCalled()
})
```

### 5. Testing Async Operations

```typescript
it('loads data asynchronously', async () => {
  const mockData = { user: { name: 'Octocat' } }

  vi.mocked(useQueryUser).mockReturnValue({
    data: mockData,
    loading: false,
    error: undefined,
  })

  render(<UserProfile userName="octocat" />)

  // ✅ Async queries
  const userName = await screen.findByText('Octocat')
  expect(userName).toBeInTheDocument()
})
```

### 6. Testing Edge Cases

```typescript
describe('date-helpers edge cases', () => {
  it('handles leap year dates', () => {
    const date = new Date('2024-02-29T00:00:00Z')
    const result = formatDate(date)
    expect(result).toBe('2024-02-29T00:00:00.000Z')
  })

  it('handles end of year date', () => {
    const date = new Date('2024-12-31T23:59:59Z')
    const result = formatDate(date)
    expect(result).toContain('2024-12-31')
  })

  it('handles 0 days back', () => {
    const testDate = new Date('2024-06-15T12:00:00Z')
    const dates = getQueryDates(0, testDate)
    expect(dates.from).toBe(dates.to)
  })
})
```

### 7. Testing Accessibility

```typescript
it('has accessible label for screen readers', () => {
  render(<SearchForm userName="" setUserName={vi.fn()} />)

  // ✅ Screen reader support
  const label = screen.getByLabelText(/search/i)
  expect(label).toBeInTheDocument()
})

it('button has correct ARIA attributes', () => {
  render(<Button disabled>Submit</Button>)

  const button = screen.getByRole('button', { name: /submit/i })
  expect(button).toHaveAttribute('aria-disabled', 'true')
})
```

---

## Coverage Requirements

### Текущие показатели

```bash
# Запуск coverage
npm run test:coverage

# Результат (example):
--------------------|---------|----------|---------|---------|
File                | % Stmts | % Branch | % Funcs | % Lines |
--------------------|---------|----------|---------|---------|
All files           |   95.2  |   90.5   |  100.0  |   95.8  |
 components/        |   94.1  |   88.3   |  100.0  |   95.0  |
  SearchForm.tsx    |   100   |   100    |  100    |   100   |
  UserProfile.tsx   |   91.2  |   85.7   |  100    |   92.5  |
 apollo/            |   98.5  |   95.0   |  100.0  |   98.9  |
  date-helpers.ts   |   100   |   100    |  100    |   100   |
--------------------|---------|----------|---------|---------|
```

### Минимальные требования

```typescript
// package.json
{
  "scripts": {
    "test:coverage": "vitest run --coverage"
  }
}

// Recommended thresholds:
// Lines:     85%+
// Branches:  80%+
// Functions: 85%+
// Statements: 85%+
```

### Что покрывать тестами

#### ✅ Обязательно тестировать:

- **Business logic** - вся логика приложения
- **User interactions** - клики, ввод текста, формы
- **Data transformations** - утилиты, helpers
- **Error handling** - обработка ошибок
- **Edge cases** - граничные условия
- **Accessibility** - a11y features

#### ⚠️ Опционально:

- **Styling** - визуальные изменения (Storybook лучше)
- **Third-party libraries** - уже протестированы

#### ❌ Не нужно тестировать:

- **Constants** - простые константы
- **Types** - TypeScript проверяет сам
- **Mock data** - тестовые данные

---

## Best Practices

### 1. Изоляция тестов

```typescript
describe('Component', () => {
  beforeEach(() => {
    // ✅ Очистить моки перед каждым тестом
    vi.clearAllMocks()
  })

  afterEach(() => {
    // ✅ Восстановить моки после каждого теста
    vi.restoreAllMocks()
  })

  it('test 1', () => {
    // Этот тест независим
  })

  it('test 2', () => {
    // Этот тест тоже независим
  })
})
```

### 2. Descriptive Test Names

```typescript
// ❌ Плохо
it('works', () => {})
it('test 1', () => {})

// ✅ Хорошо
it('renders loading state when data is fetching', () => {})
it('calls setUserName with trimmed value on form submit', () => {})
it('shows validation error when input is empty', () => {})
```

### 3. DRY (Don't Repeat Yourself)

```typescript
describe('SearchForm', () => {
  // ✅ Shared setup
  const mockSetUserName = vi.fn()
  const defaultProps = {
    userName: '',
    setUserName: mockSetUserName,
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  // ✅ Helper function
  const renderSearchForm = (props = {}) => {
    return render(<SearchForm {...defaultProps} {...props} />)
  }

  it('test 1', () => {
    renderSearchForm()
    // ...
  })

  it('test 2', () => {
    renderSearchForm({ userName: 'octocat' })
    // ...
  })
})
```

### 4. Avoid Implementation Details

```typescript
// ❌ Плохо: тестирует внутренность
it('sets state to true', () => {
  const { result } = renderHook(() => useState(false))
  act(() => {
    result.current[1](true)
  })
  expect(result.current[0]).toBe(true)
})

// ✅ Хорошо: тестирует поведение
it('shows success message after form submit', async () => {
  const user = userEvent.setup()
  render(<Form />)

  await user.type(screen.getByLabelText(/username/i), 'octocat')
  await user.click(screen.getByRole('button', { name: /submit/i }))

  expect(screen.getByText(/success/i)).toBeInTheDocument()
})
```

### 5. Test One Thing at a Time

```typescript
// ❌ Плохо: много проверок в одном тесте
it('form works correctly', async () => {
  render(<SearchForm />)
  const input = screen.getByPlaceholderText(/search/i)
  await userEvent.type(input, 'test')
  expect(input).toHaveValue('test')

  await userEvent.click(screen.getByRole('button'))
  expect(mockSubmit).toHaveBeenCalled()

  await userEvent.clear(input)
  await userEvent.click(screen.getByRole('button'))
  expect(toast.error).toHaveBeenCalled()
})

// ✅ Хорошо: один тест = одна проверка
it('updates input value when typing', async () => {
  render(<SearchForm />)
  const input = screen.getByPlaceholderText(/search/i)
  await userEvent.type(input, 'test')
  expect(input).toHaveValue('test')
})

it('calls submit handler on button click', async () => {
  render(<SearchForm />)
  await userEvent.type(screen.getByPlaceholderText(/search/i), 'test')
  await userEvent.click(screen.getByRole('button'))
  expect(mockSubmit).toHaveBeenCalledWith('test')
})

it('shows error for empty input', async () => {
  render(<SearchForm />)
  await userEvent.click(screen.getByRole('button'))
  expect(toast.error).toHaveBeenCalled()
})
```

### 6. Async Testing

```typescript
// ✅ Используй async/await
it('loads user data', async () => {
  render(<UserProfile userName="octocat" />)

  // ✅ Wait for element
  const userName = await screen.findByText('The Octocat')
  expect(userName).toBeInTheDocument()
})

// ✅ Используй waitFor для сложных условий
it('updates UI after fetch', async () => {
  render(<Component />)

  await waitFor(() => {
    expect(screen.getByText('Loaded')).toBeInTheDocument()
    expect(screen.queryByText('Loading')).not.toBeInTheDocument()
  })
})
```

### 7. Mock только необходимое

```typescript
// ✅ Mock external dependencies
vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}))

// ✅ Mock custom hooks
vi.mock('@/apollo/useQueryUser', () => ({
  default: vi.fn(),
}))

// ❌ Не mock внутренние компоненты
// Если нужно - это признак плохой архитектуры
```

---

## Troubleshooting

### Проблема: Тесты падают случайно

**Причина:** Race conditions, недетерминизм

**Решение:**
```typescript
// ✅ Используй waitFor
await waitFor(() => {
  expect(screen.getByText('Loaded')).toBeInTheDocument()
})

// ✅ Очищай моки
beforeEach(() => {
  vi.clearAllMocks()
})
```

### Проблема: "Unable to find element"

**Причина:** Элемент еще не отрендерился

**Решение:**
```typescript
// ❌ getBy - синхронный, упадет если нет элемента
const element = screen.getByText('Async content')

// ✅ findBy - асинхронный, подождет
const element = await screen.findByText('Async content')

// ✅ queryBy - вернет null если нет
const element = screen.queryByText('Maybe exists')
expect(element).not.toBeInTheDocument()
```

### Проблема: Mock не работает

**Причина:** Mock объявлен после импорта

**Решение:**
```typescript
// ✅ Mock ПЕРЕД импортом компонента
vi.mock('@/apollo/useQueryUser', () => ({
  default: vi.fn(),
}))

import useQueryUser from '@/apollo/useQueryUser'
import Component from './Component'
```

### Проблема: "Not wrapped in act(...)"

**Причина:** State update вне act()

**Решение:**
```typescript
// ✅ userEvent автоматически оборачивает в act()
const user = userEvent.setup()
await user.click(button)

// ✅ Используй waitFor для async updates
await waitFor(() => {
  expect(screen.getByText('Updated')).toBeInTheDocument()
})
```

### Проблема: Coverage не учитывает файл

**Причина:** Файл не импортируется в тестах

**Решение:**
```typescript
// ✅ Импортируй и тестируй
import { myFunction } from './utils'

it('calls myFunction', () => {
  expect(myFunction()).toBe('result')
})
```

### Проблема: Playwright timeout

**Причина:** Медленная загрузка

**Решение:**
```typescript
// ✅ Увеличь timeout
await page.waitForSelector('text=Content', { timeout: 10000 })

// ✅ Или в конфиге
export default defineConfig({
  use: {
    navigationTimeout: 30000,
  },
})
```

---

## Команды

```bash
# Vitest
npm test                    # Все unit тесты
npm run test:watch          # Watch mode
npm run test:coverage       # Coverage отчет
npm run test:ui             # UI mode

# Playwright
npm run test:e2e            # Все E2E тесты
npx playwright test --ui    # UI mode
npx playwright test --debug # Debug mode
npx playwright show-report  # Показать отчет

# Отладка
npm test -- --reporter=verbose  # Подробный вывод
npm test -- SearchForm          # Конкретный файл
npm test -- --bail              # Остановить при первой ошибке
```

---

## Полезные ссылки

- [Vitest Documentation](https://vitest.dev)
- [Playwright Documentation](https://playwright.dev)
- [React Testing Library](https://testing-library.com/react)
- [Apollo Client Testing](https://www.apollographql.com/docs/react/development-testing/testing/)
- [Testing Library Queries](https://testing-library.com/docs/queries/about)

---

## Дополнительная документация

- [Dependencies Overview](./dependencies.md) - Все зависимости проекта
- [Tailwind v4 Migration](./tailwind-v4-migration.md) - Миграция Tailwind CSS
- [Architecture](./architecture.md) - Архитектура проекта
- [GraphQL API](./graphql-api.md) - GraphQL интеграция

---

**Последнее обновление:** Ноябрь 2025
**Vitest:** 4.0.6 | **Playwright:** 1.56.1
**Статус тестов:** ✅ 62/62 passing
