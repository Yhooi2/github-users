# Apollo Client Guide - Работа с GraphQL

> Полное руководство по Apollo Client 3.14 в проекте git-user-info

## Содержание

- [Обзор](#обзор)
- [Apollo Client Setup](#apollo-client-setup)
- [GraphQL Queries](#graphql-queries)
- [Custom Hooks](#custom-hooks)
- [Error Handling](#error-handling)
- [Caching Strategy](#caching-strategy)
- [Testing](#testing)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)

---

## Обзор

### Apollo Client в проекте

**Версия:** @apollo/client 3.14.0

**Назначение:**
- GraphQL client для GitHub API
- Управление данными и кешированием
- Обработка ошибок и аутентификации
- Type-safe GraphQL queries

### Архитектура

```
src/apollo/
├── ApolloAppProvider.tsx     # Apollo Client setup & Provider
├── queriers.ts                # GraphQL queries (gql)
├── useQueryUser.ts            # Custom hooks
├── date-helpers.ts            # Date utilities
├── github-api.types.ts        # TypeScript types
└── *.test.tsx                 # Tests
```

### Основные концепции

```typescript
// 1. Setup: Конфигурация клиента
ApolloClient + Links + Cache

// 2. Queries: Получение данных
gql template + useQuery

// 3. Hooks: Абстракция над useQuery
Custom hooks для переиспользования

// 4. Error Handling: Глобальные error handlers
onError link + toast notifications

// 5. Testing: Мокирование GraphQL
MockedProvider + vi.mock
```

---

## Apollo Client Setup

### ApolloAppProvider - основная конфигурация

**Файл:** `src/apollo/ApolloAppProvider.tsx`

#### 1. HTTP Link (GraphQL endpoint)

```typescript
import { createHttpLink } from '@apollo/client'

const httpLink = createHttpLink({
  uri: 'https://api.github.com/graphql',
})
```

**Назначение:** Подключение к GraphQL API

#### 2. Auth Link (Bearer token)

```typescript
import { setContext } from '@apollo/client/link/context'

const authLink = setContext((_, { headers }) => {
  // ✅ Priority: env variable > localStorage
  const envToken = import.meta.env.VITE_GITHUB_TOKEN
  const storedToken = localStorage.getItem('github_token')
  const token = envToken || storedToken

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  }
})
```

**Особенности:**
- ✅ Env variable имеет приоритет
- ✅ Fallback на localStorage
- ✅ Работает с каждым запросом

#### 3. Error Link (Global error handling)

```typescript
import { onError } from '@apollo/client/link/error'
import { toast } from 'sonner'

const errorLink = onError(({ graphQLErrors, networkError }) => {
  // ✅ Handle GraphQL errors
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, extensions }) => {
      const errorMessage = `[GraphQL error]: ${message}`
      console.error(errorMessage)
      toast.error(errorMessage)

      // ✅ Clear token if unauthenticated
      if (extensions?.code === 'UNAUTHENTICATED') {
        localStorage.removeItem('github_token')
      }
    })
  }

  // ✅ Handle Network errors (HTTP 401, etc.)
  if (networkError) {
    // Check for 401 Unauthorized
    if ('statusCode' in networkError && networkError.statusCode === 401) {
      localStorage.removeItem('github_token')
    }

    const errorMessage = `[Network error]: ${networkError}`
    console.error(errorMessage)
    toast.error(errorMessage)
  }
})
```

**Обрабатывает:**
- ✅ GraphQL errors (неверный query, rate limit)
- ✅ Network errors (401, 500, timeout)
- ✅ Authentication errors (автоматическая очистка token)
- ✅ User feedback (toast notifications)

#### 4. Link Chain

```typescript
import { ApolloLink } from '@apollo/client'

// ✅ Порядок важен: error → auth → http
const link = ApolloLink.from([errorLink, authLink, httpLink])
```

**Порядок выполнения:**
1. `errorLink` - ловит ошибки
2. `authLink` - добавляет auth header
3. `httpLink` - отправляет HTTP request

#### 5. Apollo Client Instance

```typescript
import { ApolloClient, InMemoryCache } from '@apollo/client'

const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
})
```

**InMemoryCache:**
- Автоматическое кеширование query results
- Нормализация данных по ID
- Оптимистичные обновления (опционально)

#### 6. Provider Component

```typescript
import { ApolloProvider } from '@apollo/client'

export function ApolloAppProvider({ children }: { children: React.ReactNode }) {
  return <ApolloProvider client={client}>{children}</ApolloProvider>
}
```

**Использование:**
```typescript
// src/main.tsx
import { ApolloAppProvider } from './apollo/ApolloAppProvider'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ApolloAppProvider>
      <App />
    </ApolloAppProvider>
  </StrictMode>
)
```

---

## GraphQL Queries

### Определение queries

**Файл:** `src/apollo/queriers.ts`

```typescript
import { gql } from '@apollo/client'

export const GET_USER_INFO = gql`
  query GetUser(
    $login: String!
    $from: DateTime!
    $to: DateTime!
    $year1From: DateTime!
    $year1To: DateTime!
    $year2From: DateTime!
    $year2To: DateTime!
    $year3From: DateTime!
    $year3To: DateTime!
  ) {
    user(login: $login) {
      id
      login
      name
      avatarUrl
      bio
      url
      location

      # Connection counts
      followers {
        totalCount
      }
      following {
        totalCount
      }
      gists {
        totalCount
      }

      # Yearly contributions (dynamic year aliases)
      year1: contributionsCollection(from: $year1From, to: $year1To) {
        totalCommitContributions
      }
      year2: contributionsCollection(from: $year2From, to: $year2To) {
        totalCommitContributions
      }
      year3: contributionsCollection(from: $year3From, to: $year3To) {
        totalCommitContributions
      }

      createdAt

      # Recent contributions
      contributionsCollection(from: $from, to: $to) {
        totalCommitContributions
        commitContributionsByRepository(maxRepositories: 100) {
          contributions {
            totalCount
          }
          repository {
            name
          }
        }
      }

      # Repositories
      repositories(first: 100, affiliations: OWNER) {
        totalCount
        pageInfo {
          endCursor
          hasNextPage
        }
        nodes {
          id
          name
          description
          forkCount
          stargazerCount
          url
          defaultBranchRef {
            target {
              ... on Commit {
                history {
                  totalCount
                }
              }
            }
          }
          primaryLanguage {
            name
          }
          languages(first: 5) {
            totalSize
            edges {
              size
              node {
                name
              }
            }
          }
        }
      }
    }
  }
`
```

### TypeScript типы

**Файл:** `src/apollo/github-api.types.ts`

```typescript
export type GitHubGraphQLResponse = {
  user: GitHubUser | null
}

export type GitHubUser = {
  id: string
  login: string
  name: string | null
  avatarUrl: string
  bio: string | null
  url: string
  location: string | null
  followers: { totalCount: number }
  following: { totalCount: number }
  gists: { totalCount: number }
  year1: { totalCommitContributions: number }
  year2: { totalCommitContributions: number }
  year3: { totalCommitContributions: number }
  createdAt: string
  contributionsCollection: {
    totalCommitContributions: number
    commitContributionsByRepository: Array<{
      contributions: { totalCount: number }
      repository: { name: string }
    }>
  }
  repositories: {
    totalCount: number
    pageInfo: {
      endCursor: string | null
      hasNextPage: boolean
    }
    nodes: GitHubRepository[]
  }
}
```

---

## Custom Hooks

### useQueryUser - основной паттерн

**Файл:** `src/apollo/useQueryUser.ts`

```typescript
import { useQuery } from '@apollo/client'
import { useMemo } from 'react'
import { getQueryDates, getThreeYearRanges } from './date-helpers'
import { GET_USER_INFO } from './queriers'
import type { GitHubGraphQLResponse } from './github-api.types'

function useQueryUser(login: string, daysBack: number = 365) {
  // ✅ useMemo для оптимизации - пересчитывается только при изменении login/daysBack
  const variables = useMemo(() => {
    const queryDates = getQueryDates(daysBack)
    const yearRanges = getThreeYearRanges()

    return {
      login,
      from: queryDates.from,
      to: queryDates.to,
      year1From: yearRanges.year1.from,
      year1To: yearRanges.year1.to,
      year2From: yearRanges.year2.from,
      year2To: yearRanges.year2.to,
      year3From: yearRanges.year3.from,
      year3To: yearRanges.year3.to,
    }
  }, [login, daysBack])

  return useQuery<GitHubGraphQLResponse>(GET_USER_INFO, {
    variables,
    skip: !login, // ✅ Skip если login пустой
    errorPolicy: 'all', // ✅ Возвращать partial data + errors
    notifyOnNetworkStatusChange: true, // ✅ Триггерить re-render при network changes
  })
}

export default useQueryUser
```

### Использование в компонентах

```typescript
import useQueryUser from '@/apollo/useQueryUser'

function UserProfile({ userName }: { userName: string }) {
  const { data, loading, error, refetch } = useQueryUser(userName)

  // ✅ Loading state
  if (loading) {
    return <div>Loading...</div>
  }

  // ✅ Error state
  if (error) {
    return (
      <div>
        <p>Error: {error.message}</p>
        <button onClick={() => refetch()}>Retry</button>
      </div>
    )
  }

  // ✅ No data / user not found
  if (!data || !data.user) {
    return <div>User not found</div>
  }

  // ✅ Success - render data
  const user = data.user
  return (
    <div>
      <h1>{user.name || user.login}</h1>
      <p>{user.bio}</p>
      <p>Followers: {user.followers.totalCount}</p>
    </div>
  )
}
```

### useQuery Options

```typescript
useQuery<GitHubGraphQLResponse>(GET_USER_INFO, {
  // ✅ Variables для query
  variables: { login: 'octocat' },

  // ✅ Skip query если условие ложно
  skip: !login,

  // ✅ Fetch policy (кеширование)
  fetchPolicy: 'cache-first', // default
  // 'cache-only' - только cache
  // 'network-only' - всегда fetch
  // 'cache-and-network' - cache + background fetch
  // 'no-cache' - не кешировать

  // ✅ Error policy
  errorPolicy: 'all', // возвращать partial data + errors
  // 'none' - throw error
  // 'ignore' - игнорировать errors

  // ✅ Polling (auto-refresh)
  pollInterval: 60000, // каждые 60 секунд

  // ✅ Notify on network changes
  notifyOnNetworkStatusChange: true,

  // ✅ Callback после завершения
  onCompleted: (data) => {
    console.log('Query completed:', data)
  },

  // ✅ Callback при ошибке
  onError: (error) => {
    console.error('Query error:', error)
  },
})
```

### Возвращаемые значения useQuery

```typescript
const result = useQuery(GET_USER_INFO, options)

// ✅ Data
result.data          // Query result data
result.previousData  // Previous result (useful for transitions)

// ✅ Status
result.loading       // Initial loading
result.networkStatus // Detailed network status
result.error        // ApolloError if query failed

// ✅ Functions
result.refetch()     // Re-execute query
result.fetchMore()   // Pagination
result.startPolling(ms)  // Start auto-refresh
result.stopPolling()     // Stop auto-refresh
result.updateQuery((prev, { variables }) => newData)

// ✅ Client
result.client        // Apollo Client instance
```

---

## Error Handling

### Apollo Error Types (v3.14)

Apollo Client 3.14 имеет улучшенную error handling систему.

#### ApolloError Structure

```typescript
import { ApolloError } from '@apollo/client'

// ✅ Проверка ошибки
if (ApolloError.is(error)) {
  console.error('Apollo error:', error.message)

  // GraphQL errors
  error.graphQLErrors.forEach(gqlError => {
    console.log(gqlError.message)
    console.log(gqlError.extensions?.code)
  })

  // Network error
  if (error.networkError) {
    console.error('Network error:', error.networkError)
  }

  // Client errors
  error.clientErrors.forEach(clientError => {
    console.error('Client error:', clientError)
  })
}
```

#### Error Codes

```typescript
// GitHub API error codes
extensions.code === 'UNAUTHENTICATED'  // Неверный token
extensions.code === 'RATE_LIMITED'     // Rate limit exceeded
extensions.code === 'NOT_FOUND'        // Ресурс не найден
```

### Component-level Error Handling

```typescript
function UserProfile({ userName }: Props) {
  const { data, loading, error } = useQueryUser(userName)

  // ✅ Обработка различных типов ошибок
  if (error) {
    // Network error
    if (error.networkError) {
      return (
        <div className="error">
          <h3>Network Error</h3>
          <p>Unable to connect to GitHub API</p>
          <button onClick={() => refetch()}>Retry</button>
        </div>
      )
    }

    // GraphQL errors
    if (error.graphQLErrors?.length > 0) {
      const firstError = error.graphQLErrors[0]

      // Rate limit error
      if (firstError.extensions?.code === 'RATE_LIMITED') {
        return (
          <div className="error">
            <h3>Rate Limit Exceeded</h3>
            <p>Please try again later</p>
          </div>
        )
      }

      // Authentication error
      if (firstError.extensions?.code === 'UNAUTHENTICATED') {
        return (
          <div className="error">
            <h3>Authentication Failed</h3>
            <p>Please check your GitHub token</p>
          </div>
        )
      }
    }

    // Generic error
    return (
      <div className="error">
        <h3>Error</h3>
        <p>{error.message}</p>
      </div>
    )
  }

  // ... render data
}
```

### Global Error Handling (onError link)

**Преимущества:**
- ✅ Централизованная обработка
- ✅ Автоматические действия (clear token, toast)
- ✅ Logging
- ✅ Error reporting (Sentry, etc.)

**Текущая реализация в проекте:**

```typescript
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, extensions }) => {
      // ✅ Toast notification
      toast.error(`[GraphQL error]: ${message}`)

      // ✅ Clear token if unauthenticated
      if (extensions?.code === 'UNAUTHENTICATED') {
        localStorage.removeItem('github_token')
      }
    })
  }

  if (networkError) {
    // ✅ Handle 401 Unauthorized
    if ('statusCode' in networkError && networkError.statusCode === 401) {
      localStorage.removeItem('github_token')
    }

    // ✅ Toast notification
    toast.error(`[Network error]: ${networkError}`)
  }
})
```

---

## Caching Strategy

### InMemoryCache

Apollo Client автоматически кеширует все query results.

#### Default Behavior

```typescript
const client = new ApolloClient({
  cache: new InMemoryCache(),
})
```

**Как работает:**
1. Query выполняется первый раз → fetch from network
2. Result кешируется в памяти
3. Повторный query с теми же variables → return from cache
4. Cache нормализован по `id` или `_id` поля

#### Fetch Policies

```typescript
// ✅ cache-first (default) - использовать cache, fetch только если нет в cache
useQuery(GET_USER_INFO, {
  fetchPolicy: 'cache-first'
})

// ✅ cache-and-network - вернуть cache + фоновый fetch
useQuery(GET_USER_INFO, {
  fetchPolicy: 'cache-and-network'
})

// ✅ network-only - всегда fetch, но кешировать result
useQuery(GET_USER_INFO, {
  fetchPolicy: 'network-only'
})

// ✅ no-cache - не использовать и не обновлять cache
useQuery(GET_USER_INFO, {
  fetchPolicy: 'no-cache'
})

// ✅ cache-only - только из cache, не делать network request
useQuery(GET_USER_INFO, {
  fetchPolicy: 'cache-only'
})
```

#### Cache Invalidation

```typescript
// ✅ Refetch query
const { refetch } = useQuery(GET_USER_INFO)
refetch() // Новый network request

// ✅ Update cache вручную
client.cache.writeQuery({
  query: GET_USER_INFO,
  variables: { login: 'octocat' },
  data: newData,
})

// ✅ Evict из cache
client.cache.evict({
  id: client.cache.identify({ __typename: 'User', id: 'userId' })
})

// ✅ Clear all cache
client.cache.reset()
```

#### Cache Configuration

```typescript
const cache = new InMemoryCache({
  // ✅ Type policies для кастомной нормализации
  typePolicies: {
    User: {
      // Кастомный key для нормализации
      keyFields: ['login'],

      // Field policies
      fields: {
        // Merge strategies
        followers: {
          merge(existing, incoming) {
            return incoming
          }
        }
      }
    }
  }
})
```

---

## Testing

### MockedProvider Pattern

**Файл:** `src/components/UserProfile.test.tsx`

#### Паттерн 1: Mock хука (рекомендуется для unit тестов)

```typescript
import { vi } from 'vitest'
import { MockedProvider } from '@apollo/client/testing'
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
    // ✅ Mock return value
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
    const mockData = {
      user: {
        name: 'The Octocat',
        login: 'octocat',
        bio: 'GitHub mascot',
        // ... остальные поля
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
  })
})
```

#### Паттерн 2: MockedProvider с mocks (для integration тестов)

```typescript
import { MockedProvider } from '@apollo/client/testing'
import { GET_USER_INFO } from '@/apollo/queriers'

describe('UserProfile Integration', () => {
  it('loads and displays user', async () => {
    // ✅ Create GraphQL mocks
    const mocks = [
      {
        request: {
          query: GET_USER_INFO,
          variables: {
            login: 'octocat',
            from: '2024-01-01T00:00:00.000Z',
            to: '2024-12-31T23:59:59.999Z',
            // ... все остальные variables
          },
        },
        result: {
          data: {
            user: {
              name: 'The Octocat',
              login: 'octocat',
              // ... все поля
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

    // ✅ Wait for loading
    expect(screen.getByText(/loading/i)).toBeInTheDocument()

    // ✅ Wait for data
    const userName = await screen.findByText('The Octocat')
    expect(userName).toBeInTheDocument()
  })

  it('handles GraphQL error', async () => {
    // ✅ Mock GraphQL error
    const mocks = [
      {
        request: {
          query: GET_USER_INFO,
          variables: { login: 'octocat', /* ... */ },
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

### Testing Best Practices

```typescript
// ✅ Mock только необходимое
vi.mock('@/apollo/useQueryUser')

// ✅ Cleanup после каждого теста
beforeEach(() => {
  vi.clearAllMocks()
})

afterEach(() => {
  vi.restoreAllMocks()
})

// ✅ Тестируй все состояния
it('loading state')
it('error state')
it('empty state (no user)')
it('success state (with data)')

// ✅ Используй async/await для async operations
const element = await screen.findByText('Content')
```

---

## Best Practices

### 1. Создавай Custom Hooks

```typescript
// ✅ Хорошо: Custom hook инкапсулирует логику
function useQueryUser(login: string) {
  const variables = useMemo(() => ({
    login,
    // ... computed variables
  }), [login])

  return useQuery(GET_USER_INFO, {
    variables,
    skip: !login,
  })
}

// Использование
const { data, loading, error } = useQueryUser('octocat')
```

```typescript
// ❌ Плохо: Прямой useQuery в компоненте
function UserProfile() {
  const { data, loading, error } = useQuery(GET_USER_INFO, {
    variables: {
      login: 'octocat',
      from: new Date().toISOString(), // Пересчитывается каждый render!
      // ...
    }
  })
}
```

### 2. Оптимизируй Variables с useMemo

```typescript
// ✅ Хорошо: useMemo для complex objects
const variables = useMemo(() => ({
  login,
  from: getQueryDates().from,
  to: getQueryDates().to,
}), [login])

useQuery(GET_USER_INFO, { variables })
```

```typescript
// ❌ Плохо: Создается новый object каждый render
useQuery(GET_USER_INFO, {
  variables: {
    login,
    from: getQueryDates().from, // NEW object каждый render
    to: getQueryDates().to,
  }
})
```

### 3. Используй skip для conditional queries

```typescript
// ✅ Хорошо: skip когда нет login
useQuery(GET_USER_INFO, {
  variables: { login },
  skip: !login, // Не запускать query если login пустой
})
```

```typescript
// ❌ Плохо: Query выполнится с пустым login
useQuery(GET_USER_INFO, {
  variables: { login: login || '' },
})
```

### 4. Error Policy

```typescript
// ✅ Хорошо: errorPolicy: 'all' для partial data
useQuery(GET_USER_INFO, {
  errorPolicy: 'all', // Вернуть partial data + errors
})

// Можно отобразить partial data + error message
if (data && error) {
  return (
    <>
      <PartialUserProfile data={data} />
      <ErrorBanner error={error} />
    </>
  )
}
```

### 5. Type Safety

```typescript
// ✅ Хорошо: Типизированный useQuery
useQuery<GitHubGraphQLResponse>(GET_USER_INFO, options)

// data автоматически типизирован как GitHubGraphQLResponse
```

### 6. Структура проекта

```
src/apollo/
├── ApolloAppProvider.tsx      # Setup (один раз)
├── queriers.ts                 # Все queries в одном месте
├── *.types.ts                  # TypeScript типы
├── use*.ts                     # Custom hooks
└── helpers.ts                  # Утилиты
```

### 7. Не дублируй логику

```typescript
// ✅ Хорошо: Переиспользуй custom hook
const { data: user1 } = useQueryUser('octocat')
const { data: user2 } = useQueryUser('torvalds')

// ❌ Плохо: Дублируй useQuery логику
const { data: user1 } = useQuery(GET_USER_INFO, {
  variables: { login: 'octocat', /* ... */ }
})
const { data: user2 } = useQuery(GET_USER_INFO, {
  variables: { login: 'torvalds', /* ... */ }
})
```

---

## Troubleshooting

### Проблема: "Network error" при каждом запросе

**Причина:** Неверный token или нет интернета

**Решение:**
```bash
# Проверить token
echo $VITE_GITHUB_TOKEN

# Или в браузере
localStorage.getItem('github_token')

# Проверить доступность GitHub API
curl -H "Authorization: Bearer YOUR_TOKEN" \
     https://api.github.com/graphql
```

### Проблема: Query не обновляется

**Причина:** Кеширование

**Решение:**
```typescript
// ✅ Используй fetchPolicy
useQuery(GET_USER_INFO, {
  fetchPolicy: 'network-only', // Всегда fetch
})

// Или refetch вручную
const { refetch } = useQuery(GET_USER_INFO)
refetch()
```

### Проблема: Variables не обновляются

**Причина:** Object reference не меняется

**Решение:**
```typescript
// ✅ useMemo для stabilization
const variables = useMemo(() => ({
  login,
  from: dates.from,
}), [login, dates.from]) // Dependencies!

useQuery(GET_USER_INFO, { variables })
```

### Проблема: "Cannot read property 'user' of undefined"

**Причина:** Data еще не загружен

**Решение:**
```typescript
// ✅ Проверяй loading и data
if (loading) return <Loading />
if (!data || !data.user) return <NotFound />

// Теперь безопасно
const user = data.user
```

### Проблема: Mock не работает в тестах

**Причина:** Mock объявлен после импорта

**Решение:**
```typescript
// ✅ Mock ПЕРЕД импортом компонента
vi.mock('@/apollo/useQueryUser', () => ({
  default: vi.fn(),
}))

import useQueryUser from '@/apollo/useQueryUser'
import Component from './Component'

// Теперь mock работает
```

### Проблема: "Rate limit exceeded"

**Причина:** Слишком много requests

**Решение:**
```typescript
// ✅ Используй pollInterval осторожно
useQuery(GET_USER_INFO, {
  pollInterval: 60000, // Не менее 60 секунд!
})

// ✅ Debounce user input
const debouncedSearch = useDebouncedValue(searchQuery, 500)
useQueryUser(debouncedSearch)
```

---

## Полезные ссылки

### Apollo Client Docs

- [Apollo Client Documentation](https://www.apollographql.com/docs/react/)
- [useQuery API Reference](https://www.apollographql.com/docs/react/api/react/hooks#usequery)
- [Error Handling Guide](https://www.apollographql.com/docs/react/data/error-handling)
- [Caching in Apollo Client](https://www.apollographql.com/docs/react/caching/overview)
- [Testing React Components](https://www.apollographql.com/docs/react/development-testing/testing/)

### GitHub API

- [GitHub GraphQL API Explorer](https://docs.github.com/en/graphql/overview/explorer)
- [GitHub GraphQL API Reference](https://docs.github.com/en/graphql/reference)

### Project Documentation

- [GraphQL API Documentation](./graphql-api.md) - Подробное описание GitHub GraphQL query
- [Testing Guide](./testing-guide.md) - Тестирование с MockedProvider
- [Dependencies Overview](./dependencies.md) - Все зависимости проекта

---

**Последнее обновление:** Ноябрь 2025
**Apollo Client:** 3.14.0
**Статус:** ✅ Production Ready
