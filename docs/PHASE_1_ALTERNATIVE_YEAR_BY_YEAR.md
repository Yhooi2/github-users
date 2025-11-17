# Phase 1: Alternative Implementation (Year-by-Year Approach)

**Status:** 🔄 For Future Discussion
**Created:** 2025-11-17
**Reason:** This approach was removed from main IMPLEMENTATION_PLAN.md but saved here for later evaluation

---

## Overview

This document contains the **year-by-year multi-query architecture** that was originally planned for Phase 1 but simplified in the main plan.

**Why it was removed from main plan:**
- Complexity: Creates new hook `useUserAnalytics()` that duplicates existing `useQueryUser()`
- Rate limit risk: Parallel queries with `Promise.all` for accounts >5 years old
- Not needed for MVP: Current metrics don't require year-by-year granularity

**Why it might be useful later:**
- Timeline feature (Phase 4/7+) could benefit from year-by-year data
- Better historical analysis for Growth metrics
- More detailed Activity patterns over time

**Decision pending:** Keep this for future discussion when implementing Timeline (Phase 7+)

---

## Alternative Phase 1: GraphQL Multi-Query Architecture

**Priority:** P0 (Critical)

**Goal:** Fetch year-by-year data from account creation to now (instead of fixed 3 years)

**Time:** 3 days

---

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

---

### Migration Strategy Options

**Option A: Incremental (Lower Risk)** ✅ Recommended if using this approach
- Keep existing `useQueryUser()` hook
- Add new `useUserAnalytics()` hook
- Use `useQueryUser` for existing components (UserProfile, etc.)
- Use `useUserAnalytics` for new components (QuickAssessment, Timeline)
- Gradual migration over time

**Option B: Full Replacement (Cleaner Architecture)**
- Replace `useQueryUser()` entirely with `useUserAnalytics()`
- All components use new hook
- More testing required
- Better long-term architecture

---

## Pros and Cons

### ✅ Advantages of Year-by-Year Approach:

1. **Timeline Feature Ready**
   - ActivityTimeline component can directly use `timeline` data
   - Year-by-year visualization works out of the box
   - No additional queries needed for Timeline (Phase 4/7+)

2. **Better Historical Analysis**
   - Growth metrics can calculate year-over-year changes accurately
   - Identify trends: improving vs declining activity
   - Detect career transitions (student → junior → senior)

3. **Granular Data**
   - See which years had most activity
   - Identify periods of learning (tutorial repos spike)
   - Track skill evolution over time

4. **Caching Benefits**
   - Each year cached separately (`user:{username}:year:{year}`)
   - Historical data cached for 30 minutes
   - Reduces load on GitHub API for repeated searches

### ❌ Disadvantages of Year-by-Year Approach:

1. **Complexity**
   - New hook duplicates `useQueryUser` logic
   - More code to maintain (3 files: date-utils.ts, userProfile.ts, useUserAnalytics.ts)
   - Migration strategy needed (A or B)

2. **Rate Limit Risk**
   - Account created in 2015 = 10+ years = **10 parallel queries**
   - GitHub API limit: 5000 requests/hour
   - Heavy user (100 searches/hour) = 1000 queries/hour (20% of limit!)

3. **Performance**
   - Promise.all waits for slowest query
   - 10 years × 200ms/query = 2 seconds loading time
   - Current `useQueryUser`: single query < 1 second

4. **Not Needed for MVP Metrics**
   - Activity Score: only needs last 3-12 months (current `useQueryUser` provides this)
   - Impact Score: cumulative (doesn't need year breakdown)
   - Quality Score: snapshot (current state, not historical)
   - Growth Score: can calculate from 3-year data (year1, year2, year3 already in `useQueryUser`)

5. **Timeline Feature Deferred**
   - Phase 4 moved to Phase 7+ (not MVP)
   - Don't need this complexity until Timeline is implemented
   - Can add later without breaking existing metrics

---

## When to Reconsider This Approach

**Implement year-by-year if:**
1. ✅ Timeline feature (Phase 4/7+) is prioritized
2. ✅ Users request historical year-by-year view
3. ✅ Growth metrics need more granular year-over-year comparison
4. ✅ Rate limit is not an issue (low traffic or OAuth implemented)

**Keep simplified approach if:**
1. ✅ MVP focus (Phases 0-3, 5-6 only)
2. ✅ Timeline deferred indefinitely
3. ✅ Rate limit concerns (high traffic expected)
4. ✅ Simplicity preferred over features

---

## Estimated Time to Implement (If Chosen Later)

**Phase 7+ Timeline Implementation:**
- Step 1: Date utilities (generateYearRanges) - **0.5 days**
- Step 2: GraphQL queries (GET_USER_PROFILE, GET_YEAR_CONTRIBUTIONS) - **1 day**
- Step 3: useUserAnalytics hook - **1 day**
- Step 4: Migration (Option A - keep both hooks) - **0.5 days**
- Step 5: Timeline components (ActivityTimeline, TimelineYear, YearExpandedView) - **2 days**
- Step 6: Testing (unit + E2E) - **1 day**

**Total:** 6 days (when implementing Timeline feature)

---

## Current Decision (2025-11-17)

**Status:** ⏸️ **Deferred**

**Rationale:**
- MVP doesn't need year-by-year granularity
- Current `useQueryUser` sufficient for Phases 0-3, 5-6
- Timeline feature (Phase 4) deferred to Phase 7+
- Simplicity > Features for MVP

**Next Steps:**
1. Proceed with simplified Phase 1 (extend GET_USER_INFO only)
2. Implement Phases 0-3, 5-6 with current `useQueryUser`
3. Revisit this approach when implementing Timeline (Phase 7+)
4. Re-evaluate based on user feedback and rate limit usage

---

**Last Updated:** 2025-11-17
**Reviewed By:** [To be discussed]
**Next Review:** When starting Phase 7+ (Timeline implementation)
