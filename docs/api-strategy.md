# GraphQL API Strategy — Multi-Query Architecture

**Version:** 1.0
**Date:** 2025-11-16

---

## 📋 Overview

This document describes the multi-query GraphQL strategy for fetching GitHub user data with year-by-year breakdown.

**Problem:** Single query cannot get `commitContributionsByRepository` for arbitrary years

**Solution:** Multiple parallel queries — one per year, orchestrated by custom hook

---

## 🎯 Current Limitations

### Single Query Approach (Current Implementation):

```graphql
query GetUser(
  $login: String!
  $from: DateTime!
  $to: DateTime!
  $year1From: DateTime!
  $year1To: DateTime!
  # ... more year params
) {
  user(login: $login) {
    # Can only get 3 fixed years (year1, year2, year3)
    year1: contributionsCollection(from: $year1From, to: $year1To) {
      totalCommitContributions
      # ❌ Cannot get commitContributionsByRepository here
    }
  }
}
```

**Limitations:**
- ❌ Fixed to 3 years only
- ❌ Cannot get repo-level commits per year
- ❌ Hardcoded year ranges
- ❌ Doesn't scale with account age

---

## 💡 Multi-Query Solution

### Architecture Overview:

```
┌─────────────────────────────────────────┐
│ USER SEARCHES "Yhooi2"                  │
└─────────────────┬───────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│ QUERY 1: GET BASIC PROFILE              │
│ → createdAt, login, name, etc.          │
│ → Fast, minimal data                    │
└─────────────────┬───────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│ CALCULATE YEAR RANGES                   │
│ createdAt: 2022-01-15                   │
│ today: 2025-11-16                       │
│ → years: [2022, 2023, 2024, 2025]       │
└─────────────────┬───────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│ PARALLEL QUERIES (Promise.all)          │
│ ┌─────────────────────────────────┐    │
│ │ Query: 2022-01-01 to 2022-12-31 │    │
│ ├─────────────────────────────────┤    │
│ │ Query: 2023-01-01 to 2023-12-31 │    │
│ ├─────────────────────────────────┤    │
│ │ Query: 2024-01-01 to 2024-12-31 │    │
│ ├─────────────────────────────────┤    │
│ │ Query: 2025-01-01 to 2025-11-16 │    │
│ └─────────────────────────────────┘    │
└─────────────────┬───────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│ AGGREGATE & BUILD TIMELINE              │
│ [{                                       │
│   year: 2024,                           │
│   totalCommits: 678,                    │
│   ownedRepos: [...],                    │
│   contributions: [...],                 │
│   languages: {...}                      │
│ }, ...]                                 │
└─────────────────────────────────────────┘
```

---

## 📝 Query Definitions

### Query 1: User Profile

**Purpose:** Get basic user info + account creation date

**File:** `src/apollo/queries/userProfile.ts`

```graphql
query GetUserProfile($login: String!) {
  user(login: $login) {
    id
    login
    name
    avatarUrl
    bio
    url
    location
    createdAt        # ← Key field for calculating years

    # Connection counts
    followers { totalCount }
    following { totalCount }
    gists { totalCount }

    # All-time repository count
    repositories(first: 1, ownerAffiliations: OWNER) {
      totalCount
    }
  }
}
```

**TypeScript Interface:**

```typescript
interface UserProfileData {
  user: {
    id: string
    login: string
    name: string
    avatarUrl: string
    bio: string
    url: string
    location: string | null
    createdAt: string  // ISO 8601 date
    followers: { totalCount: number }
    following: { totalCount: number }
    gists: { totalCount: number }
    repositories: { totalCount: number }
  }
}
```

---

### Query 2: Year Contributions

**Purpose:** Get detailed contribution data for a specific year

**File:** `src/apollo/queries/yearContributions.ts`

```graphql
query GetYearContributions(
  $login: String!
  $from: DateTime!
  $to: DateTime!
) {
  user(login: $login) {
    contributionsCollection(from: $from, to: $to) {
      # Total contributions
      totalCommitContributions
      totalIssueContributions
      totalPullRequestContributions
      totalPullRequestReviewContributions
      totalRepositoryContributions

      # ← Key: Commits by repository for this year
      commitContributionsByRepository(maxRepositories: 100) {
        contributions {
          totalCount
        }
        repository {
          name
          owner {
            login
          }
          # Repository metadata
          stargazerCount
          forkCount
          primaryLanguage {
            name
          }
          url
          description
          createdAt
          pushedAt

          # Flags
          isFork
          isArchived

          # Additional stats
          watchers { totalCount }
          issues(states: OPEN) { totalCount }

          # License
          licenseInfo {
            name
          }

          # Topics
          repositoryTopics(first: 10) {
            nodes {
              topic {
                name
              }
            }
          }
        }
      }
    }
  }
}
```

**TypeScript Interface:**

```typescript
interface YearContributionsData {
  user: {
    contributionsCollection: {
      totalCommitContributions: number
      totalIssueContributions: number
      totalPullRequestContributions: number
      totalPullRequestReviewContributions: number
      totalRepositoryContributions: number

      commitContributionsByRepository: Array<{
        contributions: {
          totalCount: number
        }
        repository: {
          name: string
          owner: {
            login: string
          }
          stargazerCount: number
          forkCount: number
          primaryLanguage: {
            name: string
          } | null
          url: string
          description: string | null
          createdAt: string
          pushedAt: string | null
          isFork: boolean
          isArchived: boolean
          watchers: { totalCount: number }
          issues: { totalCount: number }
          licenseInfo: {
            name: string
          } | null
          repositoryTopics: {
            nodes: Array<{
              topic: { name: string }
            }>
          }
        }
      }>
    }
  }
}
```

---

## 🔧 Implementation

### Date Utilities

**File:** `src/lib/date-utils.ts`

```typescript
/**
 * Generate year ranges from account creation to present
 *
 * @param createdAt - Account creation date (ISO 8601)
 * @returns Array of year ranges
 */
export function generateYearRanges(createdAt: string) {
  const created = new Date(createdAt)
  const now = new Date()

  const startYear = created.getFullYear()
  const currentYear = now.getFullYear()

  const ranges = []

  for (let year = startYear; year <= currentYear; year++) {
    const from = new Date(year, 0, 1) // Jan 1
    const to = year === currentYear
      ? now  // Current date for current year
      : new Date(year, 11, 31, 23, 59, 59) // Dec 31 for past years

    ranges.push({
      year,
      from: from.toISOString(),
      to: to.toISOString(),
      label: year.toString()
    })
  }

  return ranges
}

/**
 * Example output:
 * [
 *   {
 *     year: 2022,
 *     from: "2022-01-01T00:00:00.000Z",
 *     to: "2022-12-31T23:59:59.999Z",
 *     label: "2022"
 *   },
 *   {
 *     year: 2025,
 *     from: "2025-01-01T00:00:00.000Z",
 *     to: "2025-11-16T12:34:56.789Z",  // Current time
 *     label: "2025"
 *   }
 * ]
 */
```

---

### Query Orchestration Hook

**File:** `src/hooks/useUserAnalytics.ts`

```typescript
import { useState, useEffect } from 'react'
import { useQuery } from '@apollo/client'
import { GET_USER_PROFILE } from '@/apollo/queries/userProfile'
import { GET_YEAR_CONTRIBUTIONS } from '@/apollo/queries/yearContributions'
import { generateYearRanges } from '@/lib/date-utils'

interface YearData {
  year: number
  totalCommits: number
  totalIssues: number
  totalPRs: number
  ownedRepos: Repository[]
  contributions: Repository[]
  languages: LanguageStats[]
  peakMonth: string
  activeMonths: number
}

export function useUserAnalytics(username: string) {
  const [timeline, setTimeline] = useState<YearData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  // Step 1: Get user profile
  const {
    data: profileData,
    loading: profileLoading,
    error: profileError
  } = useQuery(GET_USER_PROFILE, {
    variables: { login: username },
    skip: !username
  })

  useEffect(() => {
    if (profileLoading || !profileData) return
    if (profileError) {
      setError(profileError)
      setLoading(false)
      return
    }

    async function fetchYearlyData() {
      try {
        const createdAt = profileData.user.createdAt
        const yearRanges = generateYearRanges(createdAt)

        // Step 2: Parallel queries for each year
        const yearlyPromises = yearRanges.map(async ({ year, from, to }) => {
          const response = await client.query({
            query: GET_YEAR_CONTRIBUTIONS,
            variables: { login: username, from, to }
          })

          const collection = response.data.user.contributionsCollection

          // Separate owned repos from contributions
          const allRepos = collection.commitContributionsByRepository
          const owned = allRepos.filter(
            r => r.repository.owner.login === username
          )
          const contributed = allRepos.filter(
            r => r.repository.owner.login !== username
          )

          return {
            year,
            totalCommits: collection.totalCommitContributions,
            totalIssues: collection.totalIssueContributions,
            totalPRs: collection.totalPullRequestContributions,
            ownedRepos: owned,
            contributions: contributed,
            languages: aggregateLanguages(allRepos),
            peakMonth: findPeakMonth(collection),
            activeMonths: countActiveMonths(collection)
          }
        })

        // Wait for all years to load
        const yearlyData = await Promise.all(yearlyPromises)

        setTimeline(yearlyData)
        setLoading(false)
      } catch (err) {
        setError(err as Error)
        setLoading(false)
      }
    }

    fetchYearlyData()
  }, [profileData, profileLoading, profileError, username])

  return {
    profile: profileData?.user,
    timeline,
    loading: profileLoading || loading,
    error: error || profileError
  }
}
```

---

### Helper Functions

```typescript
/**
 * Aggregate language statistics from repositories
 */
function aggregateLanguages(repos: Repository[]) {
  const langMap = new Map<string, number>()

  repos.forEach(repo => {
    if (repo.repository.primaryLanguage) {
      const lang = repo.repository.primaryLanguage.name
      const commits = repo.contributions.totalCount
      langMap.set(lang, (langMap.get(lang) || 0) + commits)
    }
  })

  // Convert to array and sort by commits
  return Array.from(langMap.entries())
    .map(([name, commits]) => ({ name, commits }))
    .sort((a, b) => b.commits - a.commits)
}

/**
 * Find month with most commits
 * Note: GitHub API doesn't provide month-level data directly
 * This is a simplified version - full implementation would need
 * additional queries or client-side date parsing
 */
function findPeakMonth(collection: ContributionsCollection) {
  // Simplified: would need contributionCalendar data
  // For now, return current month as placeholder
  return new Date().toLocaleString('en', { month: 'long' })
}

/**
 * Count months with at least 1 commit
 */
function countActiveMonths(collection: ContributionsCollection) {
  // Would use contributionCalendar.weeks data
  // Placeholder implementation
  return 12
}
```

---

## 🚀 Performance Optimization

### 1. Parallel Execution

All year queries run simultaneously:

```typescript
// ✅ Good: All queries in parallel
const results = await Promise.all(
  years.map(year => fetchYear(year))
)

// ❌ Bad: Sequential queries (slow!)
for (const year of years) {
  const result = await fetchYear(year)
}
```

**Performance Impact:**
- 4 years × 2s per query = 8s total (sequential)
- 4 years in parallel = ~2s total (parallel) ✅

---

### 2. Request Batching

Use Apollo Client's batching:

```typescript
import { BatchHttpLink } from '@apollo/client/link/batch-http'

const batchLink = new BatchHttpLink({
  uri: 'https://api.github.com/graphql',
  batchMax: 10,  // Max queries per batch
  batchInterval: 20  // Wait 20ms before sending batch
})
```

---

### 3. Caching Strategy

```typescript
const cache = new InMemoryCache({
  typePolicies: {
    User: {
      keyFields: ['login'],
      fields: {
        contributionsCollection: {
          // Cache by date range
          keyArgs: ['from', 'to'],
          merge(existing, incoming) {
            return incoming
          }
        }
      }
    }
  }
})
```

**Cache Keys:**
- Profile: `User:Yhooi2`
- 2024 data: `User:Yhooi2:contributionsCollection({"from":"2024-01-01","to":"2024-12-31"})`

**Benefits:**
- Switching between years = instant (cached)
- Re-visiting user = no re-fetch

---

### 4. Progressive Loading

Show data as it arrives:

```typescript
// Don't wait for all years
const [loadedYears, setLoadedYears] = useState<YearData[]>([])

yearRanges.forEach(async (range) => {
  const data = await fetchYear(range)
  setLoadedYears(prev => [...prev, data].sort((a, b) => b.year - a.year))
})

// UI shows years as they load:
// 2025 ✓
// 2024 ⏳
// 2023 ⏳
// 2022 ⏳
```

---

## 🔐 Error Handling

### Rate Limiting

GitHub API has rate limits:
- **Authenticated:** 5,000 requests/hour
- **Unauthenticated:** 60 requests/hour

**Strategy:**

```typescript
async function fetchWithRetry(query, variables, retries = 3) {
  try {
    return await client.query({ query, variables })
  } catch (error) {
    if (error.networkError?.statusCode === 429) {
      // Rate limited
      const resetTime = error.networkError.response.headers.get('X-RateLimit-Reset')
      const waitTime = (parseInt(resetTime) * 1000) - Date.now()

      if (retries > 0 && waitTime < 60000) {  // Max 1 min wait
        await sleep(waitTime)
        return fetchWithRetry(query, variables, retries - 1)
      }
    }
    throw error
  }
}
```

---

### Partial Failures

If some years fail to load:

```typescript
const results = await Promise.allSettled(
  years.map(year => fetchYear(year))
)

const successful = results
  .filter(r => r.status === 'fulfilled')
  .map(r => r.value)

const failed = results
  .filter(r => r.status === 'rejected')
  .map(r => r.reason)

if (failed.length > 0) {
  console.warn('Some years failed to load:', failed)
  // Show partial data + error toast
}

setTimeline(successful)
```

**UI Feedback:**

```
Timeline:
✅ 2025 data loaded
✅ 2024 data loaded
⚠️ 2023 failed to load (rate limit)
✅ 2022 data loaded

[Retry failed years]
```

---

## 📊 Data Aggregation

### Owned vs Contributions

```typescript
function categorizeRepositories(repos: Repository[], username: string) {
  return {
    owned: repos.filter(r => r.repository.owner.login === username),
    contributions: repos.filter(r => r.repository.owner.login !== username),
    forks: repos.filter(r => r.repository.isFork),
    original: repos.filter(r => !r.repository.isFork && r.repository.owner.login === username)
  }
}
```

### Language Distribution

```typescript
function calculateLanguageDistribution(repos: Repository[]) {
  const total = repos.reduce((sum, r) => sum + r.contributions.totalCount, 0)

  const langCommits = repos.reduce((acc, r) => {
    const lang = r.repository.primaryLanguage?.name || 'Other'
    acc[lang] = (acc[lang] || 0) + r.contributions.totalCount
    return acc
  }, {} as Record<string, number>)

  return Object.entries(langCommits)
    .map(([name, commits]) => ({
      name,
      commits,
      percentage: (commits / total) * 100
    }))
    .sort((a, b) => b.commits - a.commits)
}
```

---

## 🧪 Testing Strategy

### Mock Data

```typescript
// tests/mocks/yearContributions.ts
export const mockYearData = {
  user: {
    contributionsCollection: {
      totalCommitContributions: 678,
      commitContributionsByRepository: [
        {
          contributions: { totalCount: 234 },
          repository: {
            name: 'my-awesome-project',
            owner: { login: 'Yhooi2' },
            // ... rest of fields
          }
        }
      ]
    }
  }
}
```

### Hook Testing

```typescript
import { renderHook, waitFor } from '@testing-library/react'
import { MockedProvider } from '@apollo/client/testing'
import { useUserAnalytics } from './useUserAnalytics'

test('loads timeline data for all years', async () => {
  const mocks = [
    {
      request: { query: GET_USER_PROFILE, variables: { login: 'Yhooi2' } },
      result: { data: mockProfileData }
    },
    {
      request: { query: GET_YEAR_CONTRIBUTIONS, variables: { login: 'Yhooi2', from: '2024-01-01', to: '2024-12-31' } },
      result: { data: mockYearData }
    }
  ]

  const { result } = renderHook(() => useUserAnalytics('Yhooi2'), {
    wrapper: ({ children }) => (
      <MockedProvider mocks={mocks} addTypename={false}>
        {children}
      </MockedProvider>
    )
  })

  await waitFor(() => {
    expect(result.current.loading).toBe(false)
  })

  expect(result.current.timeline).toHaveLength(4)
  expect(result.current.timeline[0].year).toBe(2025)
})
```

---

## 📈 Monitoring

### Performance Metrics

```typescript
// Track query performance
const startTime = performance.now()
const data = await fetchYear(2024)
const duration = performance.now() - startTime

analytics.track('YearQueryPerformance', {
  year: 2024,
  duration,
  repoCount: data.ownedRepos.length
})
```

### Error Tracking

```typescript
try {
  await fetchYearlyData()
} catch (error) {
  errorTracking.captureException(error, {
    context: {
      username,
      year,
      attemptedQueries: years.length
    }
  })
  throw error
}
```

---

## 🔄 Migration Path

### Phase 1: Parallel Implementation

Keep existing single query, add new multi-query as opt-in:

```typescript
const ENABLE_MULTI_QUERY = import.meta.env.VITE_ENABLE_MULTI_QUERY === 'true'

function useUserData(username: string) {
  if (ENABLE_MULTI_QUERY) {
    return useUserAnalytics(username)  // New approach
  } else {
    return useQueryUser(username)       // Existing approach
  }
}
```

### Phase 2: A/B Testing

50% of users get new approach:

```typescript
const userId = hashCode(username)
const useNewApproach = userId % 2 === 0

if (useNewApproach) {
  analytics.track('MultiQueryExperiment', { group: 'treatment' })
  return useUserAnalytics(username)
} else {
  analytics.track('MultiQueryExperiment', { group: 'control' })
  return useQueryUser(username)
}
```

### Phase 3: Full Migration

Replace old approach entirely.

---

## 📚 Related Documentation

- [UI Refactoring Plan](./ui-refactoring-plan.md)
- [Metrics Explanation](./metrics-explanation.md)
- [GitHub GraphQL API Docs](https://docs.github.com/en/graphql)

---

**Last Updated:** 2025-11-16
**Version:** 1.0
**Next Steps:** Implement `useUserAnalytics` hook in Phase 2
