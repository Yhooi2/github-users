# Phase 1: GraphQL Multi-Query Architecture

**Priority:** P0 (Critical)
**Estimated Time:** 3 days
**Status:** ✅ **IMPLEMENTATION COMPLETE**

**Implementation Date:** 2025-11-17
**Completion Date:** 2025-11-17
**Test Results:** See [PHASE_1_TEST_RESULTS.md](../PHASE_1_TEST_RESULTS.md)
**Completion Summary:** See [PHASE_1_COMPLETION_SUMMARY.md](../PHASE_1_COMPLETION_SUMMARY.md)

**Implementation Status:**
- ✅ Date utilities created (`date-utils.ts` + 15 tests)
- ✅ GraphQL queries defined (`userProfile.ts`, `yearContributions.ts`)
- ✅ useUserAnalytics hook implemented (parallel queries with Promise.all)
- ✅ Cache keys per year working (`user:{username}:year:{year}`)
- ✅ Repository separation (owned vs contributions)
- ✅ All tests passing (26/26, 100% pass rate)
- ✅ Test coverage >90% achieved
- ✅ Ready for Phase 2

---

## 🤖 Recommended Agents

**Before starting:**
- **Explore agent:** "Find all uses of date-helpers.ts and getThreeYearRanges()"
- **Plan agent:** "Create implementation checklist for Phase 1"

**During implementation:**
- **general-purpose agent:** "Implement Step 1.1 - create date-utils.ts with generateYearRanges()"
- **test-runner-fixer agent:** "Run tests for date-utils.test.ts"
- **general-purpose agent:** "Implement Step 1.2 - create GraphQL queries"
- **general-purpose agent:** "Implement Step 1.3 - create useUserAnalytics hook"
- **test-runner-fixer agent:** "Run tests for useUserAnalytics.test.ts"

**After implementation:**
- **code-review-specialist agent:** "Review against Phase 1 deliverables"
- **debug-specialist agent:** "Fix any query errors or type mismatches"

**Testing parallel queries:**
```bash
Explore agent: "Verify Promise.all is used for parallel year queries"
```

---

## 🎯 Goal

Fetch year-by-year data from account creation to present (instead of fixed 3 years).

**Current State:**
- `getThreeYearRanges()` returns fixed 3 years
- Limited historical data
- Can't analyze growth trends

**Target State:**
- `generateYearRanges(createdAt)` generates dynamic ranges
- Full account history (from creation to now)
- Parallel queries with `Promise.all`
- Per-year caching for performance

---

## 🏗️ Architecture

### Data Flow

```
1. Fetch User Profile (get createdAt date)
   ↓
2. Generate year ranges (2015...2025)
   ↓
3. Fetch contributions for each year (parallel)
   ↓
4. Separate owned repos from contributions
   ↓
5. Return timeline data
```

### Caching Strategy

```
Cache Keys:
- user:{username}:profile     → 30 min TTL
- user:{username}:year:{year} → 30 min TTL

Example:
- user:torvalds:profile
- user:torvalds:year:2025
- user:torvalds:year:2024
```

---

## 📋 Implementation Steps

### Step 1.1: Date Utilities

**File:** `src/lib/date-utils.ts`

```typescript
export interface YearRange {
  year: number
  from: string
  to: string
  label: string
}

/**
 * Generate year ranges from account creation to now
 */
export function generateYearRanges(createdAt: string): YearRange[] {
  const created = new Date(createdAt)
  const now = new Date()

  const startYear = created.getFullYear()
  const currentYear = now.getFullYear()

  const ranges: YearRange[] = []

  for (let year = startYear; year <= currentYear; year++) {
    const from = new Date(year, 0, 1)
    const to = year === currentYear
      ? now
      : new Date(year, 11, 31, 23, 59, 59)

    ranges.push({
      year,
      from: from.toISOString(),
      to: to.toISOString(),
      label: year.toString(),
    })
  }

  return ranges
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}
```

**Test:** `src/lib/date-utils.test.ts`

```typescript
import { describe, it, expect } from 'vitest'
import { generateYearRanges } from './date-utils'

describe('generateYearRanges', () => {
  it('generates ranges from creation to now', () => {
    const ranges = generateYearRanges('2022-01-15T00:00:00Z')

    expect(ranges.length).toBeGreaterThan(2)
    expect(ranges[0].year).toBe(2022)
    expect(ranges[ranges.length - 1].year).toBe(new Date().getFullYear())
  })

  it('handles current year correctly', () => {
    const ranges = generateYearRanges('2025-01-01T00:00:00Z')
    const currentYear = ranges.find(r => r.year === 2025)

    expect(currentYear).toBeDefined()
    expect(new Date(currentYear!.to).getFullYear()).toBe(2025)
  })

  it('handles accounts older than 10 years', () => {
    const ranges = generateYearRanges('2010-01-01T00:00:00Z')

    expect(ranges.length).toBeGreaterThanOrEqual(15)
    expect(ranges[0].year).toBe(2010)
  })
})
```

---

### Step 1.2: GraphQL Queries

**File:** `src/apollo/queries/userProfile.ts`

```typescript
import { gql } from '@apollo/client'

export const GET_USER_PROFILE = gql`
  query GetUserProfile($login: String!) {
    user(login: $login) {
      id
      login
      name
      avatarUrl
      bio
      url
      location
      createdAt
      followers { totalCount }
      following { totalCount }
      gists { totalCount }
      repositories(first: 1, ownerAffiliations: OWNER) {
        totalCount
      }
    }
  }
`
```

**File:** `src/apollo/queries/yearContributions.ts`

```typescript
import { gql } from '@apollo/client'

export const GET_YEAR_CONTRIBUTIONS = gql`
  query GetYearContributions(
    $login: String!
    $from: DateTime!
    $to: DateTime!
  ) {
    user(login: $login) {
      contributionsCollection(from: $from, to: $to) {
        totalCommitContributions
        totalIssueContributions
        totalPullRequestContributions
        totalPullRequestReviewContributions

        commitContributionsByRepository(maxRepositories: 100) {
          contributions { totalCount }
          repository {
            name
            owner { login }
            stargazerCount
            forkCount
            primaryLanguage { name }
            url
            description
            createdAt
            pushedAt
            isFork
            isArchived
          }
        }
      }
    }
  }
`
```

---

### Step 1.3: Orchestration Hook

**File:** `src/hooks/useUserAnalytics.ts`

```typescript
import { useState, useEffect } from 'react'
import { useQuery, useApolloClient } from '@apollo/client'
import { GET_USER_PROFILE } from '@/apollo/queries/userProfile'
import { GET_YEAR_CONTRIBUTIONS } from '@/apollo/queries/yearContributions'
import { generateYearRanges } from '@/lib/date-utils'

export interface YearData {
  year: number
  totalCommits: number
  totalIssues: number
  totalPRs: number
  ownedRepos: Repository[]
  contributions: Repository[]
}

export function useUserAnalytics(username: string) {
  const client = useApolloClient()
  const [timeline, setTimeline] = useState<YearData[]>([])
  const [yearLoading, setYearLoading] = useState(true)

  // Step 1: Get user profile
  const {
    data: profileData,
    loading: profileLoading,
    error: profileError
  } = useQuery(GET_USER_PROFILE, {
    variables: { login: username },
    skip: !username,
    context: { cacheKey: `user:${username}:profile` }
  })

  // Step 2: Fetch yearly data
  useEffect(() => {
    if (!profileData || profileLoading) return

    async function fetchYears() {
      try {
        const createdAt = profileData.user.createdAt
        const yearRanges = generateYearRanges(createdAt)

        // Parallel queries
        const yearPromises = yearRanges.map(async ({ year, from, to }) => {
          const result = await client.query({
            query: GET_YEAR_CONTRIBUTIONS,
            variables: { login: username, from, to },
            context: { cacheKey: `user:${username}:year:${year}` }
          })

          const collection = result.data.user.contributionsCollection
          const repos = collection.commitContributionsByRepository

          return {
            year,
            totalCommits: collection.totalCommitContributions,
            totalIssues: collection.totalIssueContributions,
            totalPRs: collection.totalPullRequestContributions,
            ownedRepos: repos.filter(r => r.repository.owner.login === username),
            contributions: repos.filter(r => r.repository.owner.login !== username),
          }
        })

        const years = await Promise.all(yearPromises)
        setTimeline(years.sort((a, b) => b.year - a.year))
        setYearLoading(false)
      } catch (error) {
        console.error('Year data fetch error:', error)
        setYearLoading(false)
      }
    }

    fetchYears()
  }, [profileData, profileLoading, username, client])

  return {
    profile: profileData?.user,
    timeline,
    loading: profileLoading || yearLoading,
    error: profileError,
  }
}
```

**Test:** `src/hooks/useUserAnalytics.test.ts`

```typescript
import { describe, it, expect, vi } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useUserAnalytics } from './useUserAnalytics'
import { MockedProvider } from '@apollo/client/testing'

describe('useUserAnalytics', () => {
  it('fetches user profile and timeline', async () => {
    const mocks = [/* Apollo mocks */]

    const wrapper = ({ children }) => (
      <MockedProvider mocks={mocks}>{children}</MockedProvider>
    )

    const { result } = renderHook(() => useUserAnalytics('testuser'), { wrapper })

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
      expect(result.current.profile).toBeDefined()
      expect(result.current.timeline.length).toBeGreaterThan(0)
    })
  })
})
```

---

## 🔄 Migration Strategy Decision

**Choose one before starting:**

### Option A: Incremental (Recommended) ✅

**Pros:**
- Lower risk
- Easier to debug
- Gradual migration
- Both hooks coexist

**Implementation:**
- Keep existing `useQueryUser()` hook
- Add new `useUserAnalytics()` hook
- Use `useQueryUser` for existing components
- Use `useUserAnalytics` for new components
- Gradually migrate over time

### Option B: Full Replacement

**Pros:**
- Cleaner architecture long-term
- Single source of truth
- Simpler codebase

**Cons:**
- Higher risk
- More testing required
- All-at-once migration

**Implementation:**
- Replace `useQueryUser()` entirely
- All components use `useUserAnalytics()`
- Requires comprehensive testing

**Recommendation:** Start with Option A for Phase 1-4, migrate to Option B in Phase 6 (optional).

---

## ✅ Deliverables

- [x] Date utils created + tested (`src/lib/date-utils.ts`) ✅
- [x] GraphQL queries defined (`userProfile.ts`, `yearContributions.ts`) ✅
- [x] `useUserAnalytics` hook working (parallel queries with Promise.all) ✅
- [x] Cache keys for each year (`user:{username}:year:{year}`) ✅
- [x] Works with accounts of all ages (2 years old to 10+ years old) ✅
- [x] `useQueryUser` still works (Migration Option A implemented) ✅
- [x] All tests passing (26/26 tests, 100% pass rate, >90% coverage) ✅

**Status:** 7/7 deliverables complete (100%) ✅

---

## 📊 Performance Expectations

**Query Times:**
- Profile query: ~200ms (first request)
- Profile query: ~50ms (cached)
- Year queries (parallel): ~2-3s for 10 years
- Year queries (cached): ~500ms total

**GitHub API Usage:**
- Profile: 1 request
- Years: N requests (N = years since account creation)
- Total: ~1 + N requests per user

**Cache Benefits:**
- 30 min TTL reduces API usage by ~95%
- Second search for same user: <500ms total

---

## 🔄 Rollback Plan

**If new queries fail:**

1. **Revert to Original Hook:**
   ```typescript
   // Temporarily disable useUserAnalytics
   // Use useQueryUser for all components
   ```

2. **Clear Apollo Cache:**
   ```typescript
   await client.clearStore() // Force refetch with old schema
   ```

3. **Update TypeScript Types:**
   - Revert type changes
   - Run `npm run build` to catch type errors

4. **Test Existing Components:**
   - Ensure UserProfile still renders

**Prevention:**
- Test queries in GitHub GraphQL Explorer first
- Use Apollo Client DevTools to inspect cache
- Add fallbacks: `user.timeline ?? []`

---

## 📚 Resources

**GitHub GraphQL API:**
- [Schema Explorer](https://docs.github.com/en/graphql/overview/explorer)
- [ContributionsCollection](https://docs.github.com/en/graphql/reference/objects#contributionscollection)
- [User Object](https://docs.github.com/en/graphql/reference/objects#user)

**Apollo Client:**
- [Queries](https://www.apollographql.com/docs/react/data/queries/)
- [useApolloClient](https://www.apollographql.com/docs/react/api/react/hooks/#useapolloclient)
- [Caching](https://www.apollographql.com/docs/react/caching/cache-configuration/)

---

**Previous Phase:** [Phase 0: Backend Security Layer](./phase-0-backend-security.md)
**Next Phase:** [Phase 2: Metrics Calculation System](./phase-2-metrics-calculation.md)
