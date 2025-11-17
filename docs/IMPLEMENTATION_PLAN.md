# GitHub User Analytics Dashboard — Implementation Plan

**Version:** 5.0
**Date:** 2025-11-17
**Status:** Ready for Development
**Framework:** Vite + React 19 (Current Stack)
**Backend:** Vercel Serverless Functions + Vercel KV

**⚠️ MAJOR UPDATE v5.0:** Complete metrics system overhaul with Fraud Detection, Collaboration tracking, and Learning Pattern Detection. See [Version History](#version-history) for details.

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [MCP-Driven Development Process](#mcp-driven-development-process)
3. [Technology Stack](#technology-stack)
4. [Phase 0: Backend Security Layer](#phase-0-backend-security-layer)
5. [Phase 1: GraphQL Multi-Query Architecture](#phase-1-graphql-multi-query-architecture)
6. [Phase 2: Metrics Calculation System](#phase-2-metrics-calculation-system)
7. [Phase 3: Core Components (P0)](#phase-3-core-components-p0)
8. [Phase 4: Timeline Components (P1)](#phase-4-timeline-components-p1)
9. [Phase 5: Layout Refactoring (P1)](#phase-5-layout-refactoring-p1)
10. [Phase 6: Testing & Polish (P2)](#phase-6-testing--polish-p2)
11. [UI/UX Design Reference](#uiux-design-reference)
12. [Animations Strategy](#animations-strategy)
13. [Dependencies](#dependencies)
14. [Success Criteria](#success-criteria)

---

## Current State & Reusability Analysis

### ✅ What Already Exists (70% Infrastructure Ready)

**Architecture:**
- ✅ Apollo Client 3.14.0 fully configured with error handling
- ✅ React 19 + Vite 7 + TypeScript 5.8.3
- ✅ shadcn/ui (New York style) - 28+ components documented
- ✅ Recharts 2.15.4 for visualizations
- ✅ 99.85% test pass rate (1302/1304 tests passing)
- ✅ Storybook workflow established (Component → Story → Test)

**Existing Metrics System:**
- ✅ **Authenticity Score** (`src/lib/authenticity.ts`) - **Perfect template for new metrics!**
  - 100-point scoring system
  - Component breakdown (4 parts × 25 points)
  - Category labels (High/Medium/Low/Suspicious)
  - Warning flags array
  - Metadata tracking
- ✅ **UserAuthenticity Component** - **Perfect UI template!**
  - Card with Shield icon
  - Score badge with color coding
  - Progress bars for breakdown
  - Alert for warning flags

**Reusable Components:**
- ✅ `RepositoryCard` - Can be enhanced with Owner/Contributor badges
- ✅ `Card, Progress, Badge, Button, Tooltip` (shadcn/ui)
- ✅ `ChartContainer` (Recharts wrapper)
- ✅ `LoadingState, ErrorState, EmptyState`
- ✅ `StatsCard` (icon + title + value pattern)

**Reusable Functions:**
- ✅ `calculateLanguageStatistics()` - For Quality/Stack metric
- ✅ `getMostActiveRepositories()` - For Timeline top projects
- ✅ `formatNumber()`, `formatBytes()` - Display helpers
- ✅ Date helpers (`getThreeYearRanges()`) - Can extend to `generateYearRanges()`

**Testing Infrastructure:**
- ✅ Vitest setup with mocking patterns
- ✅ React Testing Library utilities
- ✅ Playwright E2E configuration
- ✅ Apollo MockedProvider patterns
- ✅ Storybook MCP integration

### 🎯 What Needs to Be Built (30% New Code)

**New Calculation Functions:**
- 🆕 `src/lib/metrics/activity.ts` (use authenticity.ts as template)
- 🆕 `src/lib/metrics/impact.ts` (use authenticity.ts as template)
- 🆕 `src/lib/metrics/quality.ts` (use authenticity.ts as template)
- 🆕 `src/lib/metrics/growth.ts` (use authenticity.ts as template)

**New UI Components:**
- 🆕 `MetricCard` (based on UserAuthenticity.tsx layout)
- 🆕 `QuickAssessment` (4-metric grid)
- 🆕 `ActivityTimeline` (year-by-year visualization)
- 🆕 `TimelineYear` (collapsible row)
- 🆕 `YearExpandedView` (detailed breakdown)

**New Data Fetching:**
- 🆕 `useUserAnalytics()` hook (multi-query orchestration)
- 🆕 `GET_USER_PROFILE` query (basic profile only)
- 🆕 `GET_YEAR_CONTRIBUTIONS` query (single year data)

**Backend (Phase 0):**
- 🆕 Vercel Serverless Function (`/api/github-proxy`)
- 🆕 Vercel KV caching setup

### 📊 Reusability Impact on Timeline

| Phase | Original Estimate | With Reuse | Savings |
|-------|-------------------|------------|---------|
| Phase 0 | 2-3 days | **2 days** | Apollo Client setup exists |
| Phase 1 | 3-5 days | **3 days** | Date helpers exist, extend them |
| Phase 2 | 2-3 days | **2 days** | authenticity.ts = perfect template |
| Phase 3 | 2-3 days | **2 days** | shadcn/ui patterns established |
| Phase 4 | 2-3 days | **2 days** | RepositoryCard + Recharts ready |
| Phase 5 | 1-2 days | **1 day** | Simple layout refactor |
| Phase 6 | 2-3 days | **2 days** | Test patterns known |
| **TOTAL** | **14-19 days** | **14 days** | **~30% faster** |

---

## Overview

This document provides a **step-by-step implementation plan** for transforming GitHub User Info into a modern analytics dashboard with explainable metrics, timeline-based analysis, and progressive disclosure UI.

### Key Principles:

1. **No Framework Migration** — Stay on Vite (faster, simpler)
2. **Server-Side Security** — GitHub token secured via Vercel Functions
3. **Incremental Delivery** — Each phase produces a deployable version
4. **Component → Story → Test** — Strict workflow for every component
5. **Priority-Based** — P0/P1/P2 instead of deadlines
6. **CSS-First Animations** — Minimize JS overhead

### Why Vite + Vercel Functions?

**vs Next.js:**
- ✅ Faster dev server
- ✅ Simpler architecture
- ✅ SSR not needed (client-side search)
- ✅ Lower bundle size
- ✅ Less migration risk

**Security & Caching:**
- ✅ Vercel Serverless Functions for token
- ✅ Vercel KV for 30-min server-side cache
- ✅ Same benefits as Next.js API routes

---

## MCP-Driven Development Process

### The Loop (After EVERY Step):

```
📝 PLAN → ⚡ EXECUTE → 🔍 MCP CHECK → 📊 UPDATE PLAN → ➡️ NEXT
```

### MCP Servers Usage:

| MCP Server | When to Use | Example Query |
|------------|-------------|---------------|
| **Vercel** | Deployment, edge functions | "Vercel Serverless Functions caching best practices" |
| **Context7** | Library documentation | "Apollo Client caching strategies" |
| **shadcn** | UI components | "Show me Card component variants" |
| **Storybook** | Component catalog | "List all Button stories" |

**Note:** MCP checks are **optional** but recommended for quality.

---

## Technology Stack

### Current Stack (No Changes)

```json
{
  "framework": "Vite 7",
  "runtime": "React 19",
  "styling": "Tailwind CSS v4",
  "state": "Apollo Client 3.14 (GraphQL)",
  "ui": "shadcn/ui (New York style)",
  "testing": "Vitest + Playwright + Storybook"
}
```

### New Additions

```json
{
  "backend": "Vercel Serverless Functions",
  "caching": "@vercel/kv",
  "animations": "CSS Transitions (95%) + Framer Motion (5%)"
}
```

### Key Features:

- **Vercel Functions** — Server-side GitHub API proxy
- **Vercel KV** — Redis-compatible caching (30 min TTL)
- **Apollo Client** — GraphQL orchestration
- **CSS-First** — Transitions for 95% of animations
- **Framer Motion** — Only for complex modals/transitions

---

## What NOT to Change

### Keep These Components (Proven & Working):
- ✅ **UserAuthenticity** - Different purpose from new metrics, valuable for fraud detection
- ✅ **RepositoryList/Table** - Working filters/sorting system
- ✅ **RepositoryCard** - Enhance with badges, don't replace
- ✅ **UserHeader, UserStats** - Basic profile display
- ✅ **ContributionHistory** - Will be replaced by ActivityTimeline, but keep temporarily

### Keep These Patterns:
- ✅ **Component → Story → Test** workflow (99.85% test pass rate)
- ✅ **Storybook MCP integration** (28+ components documented)
- ✅ **TypeScript strict mode** (no `any` types)
- ✅ **shadcn/ui (New York style)** consistency
- ✅ **Test coverage >90%** standard

### Keep These Files (Use as Templates):
- ✅ `src/lib/authenticity.ts` - **Template for ALL new metric functions**
- ✅ `src/components/UserAuthenticity.tsx` - **Template for MetricCard**
- ✅ `src/lib/statistics.ts` - Helper functions to reuse
- ✅ `src/apollo/date-helpers.ts` - Extend, don't replace
- ✅ All test files - Reference for new test patterns

### Migration Strategy (Phase 1):
**Option A: Incremental (Recommended)**
- Keep `useQueryUser()` for existing components
- Add `useUserAnalytics()` for new timeline data
- Gradually migrate components
- Less risky, easier to debug

**Option B: Full Replacement**
- Replace `useQueryUser()` with `useUserAnalytics()`
- All components use new hook
- Requires more testing
- Cleaner architecture long-term

**Decision:** Start with Option A for initial implementation

---

## ⚠️ Current Security Status (BEFORE Phase 0)

### 🔴 CRITICAL: Token Exposure Risk

**Current Implementation:**
```bash
# .env.local
VITE_GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**Problem:**
- Token uses `VITE_` prefix → **accessible in client bundle**
- DevTools → Network → Headers shows: `Authorization: Bearer ghp_...`
- Anyone inspecting the site can steal the token
- Risk: Rate limit exhaustion, unauthorized API access

**Verification:**
```bash
npm run build
grep -r "ghp_\|VITE_GITHUB_TOKEN" dist/

# If token found → Phase 0 is CRITICAL!
# If not found → Check Apollo Client configuration
```

**Impact:**
- 🔴 **Security breach:** Token visible to anyone
- 🔴 **Rate limit risk:** 5000 requests/hour shared across all users
- 🔴 **Scope escalation:** If token has extra permissions, they're exposed

**Solution:** Phase 0 (Backend Proxy) is **MANDATORY** before production deployment

**Current Apollo Client** (`src/apollo/ApolloAppProvider.tsx`):
```typescript
// INSECURE: Token in client code
const authLink = setContext((_, { headers }) => {
  const token = import.meta.env.VITE_GITHUB_TOKEN; // ← EXPOSED!
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});
```

**Why Phase 0 Exists:**
Phase 0 moves the token to **server-side only** (Vercel Functions), making it invisible to client code.

---

## Phase 0: Backend Security Layer

**Priority:** P0 (Critical)

**Goal:** Secure GitHub token on server, enable caching

**Note:** Apollo Client 3.14.0 is already configured with error handling, auth middleware, and InMemoryCache. We only need to redirect the URI to `/api/github-proxy`.

---

### Prerequisites (30 minutes setup)

**Before Starting Phase 0:**

1. ✅ **Vercel Account** (free tier)
   - Create: https://vercel.com/signup
   - Install CLI: `npm i -g vercel`
   - Login: `vercel login`

2. ✅ **GitHub Token** (Personal Access Token)
   - Generate: https://github.com/settings/tokens
   - Scopes: `read:user`, `user:email`, `repo` (read-only)
   - Format: `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
   - **NEVER commit to git!**
   - **DO NOT use `VITE_` prefix** (server-side only)

3. ✅ **Vercel KV Database**
   - Dashboard → Storage → Create KV
   - Name: `github-cache`
   - Region: Auto (closest to users)
   - Auto-configures environment variables

4. ✅ **Environment Variables**
   - Vercel Dashboard → Settings → Environment Variables
   - Add `GITHUB_TOKEN` (production + preview)
   - Format: **NO `VITE_` prefix!**
   ```bash
   GITHUB_TOKEN=ghp_your_token_here
   ```
   - KV credentials auto-added by Vercel

5. ✅ **Rate Limit Check** (optional but recommended)
   ```bash
   # Check remaining GitHub API quota
   curl -H "Authorization: Bearer YOUR_GITHUB_TOKEN" \
     https://api.github.com/rate_limit | grep -A 5 "graphql"

   # Should show: "remaining": ~5000 (full quota)
   ```

**Verification:**
```bash
vercel --version          # Should show v33.0.0+
vercel env pull .env.local # Should create file with KV credentials
cat .env.local            # Verify KV_REST_API_URL exists
```

**Troubleshooting:**
- `vercel: command not found` → Install CLI globally: `npm i -g vercel`
- `KV_REST_API_URL not found` → Re-create KV database in Vercel dashboard
- `401 Unauthorized` → Check `GITHUB_TOKEN` in Vercel dashboard (NOT `.env.local`)
- `Rate limit exceeded` → Wait 1 hour or use different token

**Time Estimate:** 30 minutes (first time), 5 minutes (if familiar with Vercel)

---

### Step 0.1: Create Vercel Serverless Function

**File:** `api/github-proxy.ts`

```typescript
import { kv } from '@vercel/kv'

interface GraphQLRequest {
  query: string
  variables?: Record<string, unknown>
}

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { query, variables, cacheKey } = req.body as GraphQLRequest & { cacheKey?: string }

  // Check cache if key provided
  if (cacheKey) {
    const cached = await kv.get(cacheKey)
    if (cached) {
      console.log(`Cache HIT: ${cacheKey}`)
      return res.status(200).json(cached)
    }
  }

  // GitHub API request
  const token = process.env.GITHUB_TOKEN

  if (!token) {
    return res.status(500).json({ error: 'GITHUB_TOKEN not configured' })
  }

  try {
    const response = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query, variables }),
    })

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.statusText}`)
    }

    const data = await response.json()

    if (data.errors) {
      return res.status(400).json(data)
    }

    // Cache result for 30 minutes
    if (cacheKey) {
      await kv.set(cacheKey, data, { ex: 1800 })
      console.log(`Cache SET: ${cacheKey}`)
    }

    return res.status(200).json(data)
  } catch (error) {
    console.error('GitHub proxy error:', error)
    return res.status(500).json({
      error: 'Failed to fetch from GitHub',
      message: error.message
    })
  }
}
```

**MCP Check After:**
- Query Vercel MCP: "Vercel Serverless Functions error handling best practices"

---

### Step 0.2: Setup Environment Variables

**File:** `.env` (server-side, for Vercel)

```bash
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Vercel KV (from Vercel dashboard)
KV_REST_API_URL=https://...
KV_REST_API_TOKEN=...
KV_REST_API_READ_ONLY_TOKEN=...
```

**File:** `.env.example`

```bash
GITHUB_TOKEN=ghp_your_token_here

KV_REST_API_URL=
KV_REST_API_TOKEN=
KV_REST_API_READ_ONLY_TOKEN=
```

**Security:**
- ✅ Remove `VITE_GITHUB_TOKEN` from `.env.local`
- ✅ Never use `VITE_` prefix for secrets
- ✅ Add `.env` to `.gitignore`

---

### Step 0.3: Update Apollo Client

**File:** `src/apollo/ApolloAppProvider.tsx`

```typescript
import { HttpLink } from '@apollo/client'

const httpLink = new HttpLink({
  uri: '/api/github-proxy', // ← Changed from GitHub API
})
```

**Update queries to include cacheKey:**

```typescript
// src/apollo/useQueryUser.ts (example)
const { data } = useQuery(GET_USER_INFO, {
  variables: {
    login: username,
    // ... other vars
  },
  context: {
    cacheKey: `user:${username}:profile` // ← Add cache key
  }
})
```

**Test:**
```bash
npm run dev
# Search for a user
# Check Vercel Functions logs for cache HIT/SET
```

**MCP Check After:**
- Query Context7: "Apollo Client context caching patterns"

---

### Step 0.4: Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Test function
curl -X POST https://your-app.vercel.app/api/github-proxy \
  -H "Content-Type: application/json" \
  -d '{"query":"query { viewer { login } }"}'
```

**Deliverables:**
- [ ] `api/github-proxy.ts` created
- [ ] `.env` configured (server-side)
- [ ] Apollo Client `HttpLink` URI updated to `/api/github-proxy`
- [ ] Token NOT visible in DevTools
- [ ] Caching functional (check logs)
- [ ] Deployed to Vercel Free tier

**Estimated Time:** **2 days** (reduced from 2-3 days due to existing Apollo setup)

---

## Phase 1: GraphQL Multi-Query Architecture

**Priority:** P0 (Critical)

**Goal:** Fetch year-by-year data from account creation to now (instead of fixed 3 years)

**Note:** Current `date-helpers.ts` has `getThreeYearRanges()` - we'll extend it to `generateYearRanges(createdAt)` for dynamic year calculation.

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

**Deliverables:**
- [ ] Date utils created + tested
- [ ] GraphQL queries defined
- [ ] `useUserAnalytics` hook working (parallel queries with Promise.all)
- [ ] Cache keys for each year (`user:{username}:year:{year}`)
- [ ] Works with accounts of all ages (2 years old to 10+ years old)
- [ ] `useQueryUser` still works (if using Migration Option A)

**Estimated Time:** **3 days** (reduced from 3-5 days - date helpers exist, Apollo Client configured)

### Migration Strategy Decision Point

Choose one approach before starting Phase 1:

**Option A: Incremental (Lower Risk)** ✅ Recommended
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

**Recommendation:** Start with Option A for Phase 1-4, migrate to Option B in Phase 6 (optional).

---

## Phase 2: Metrics Calculation System

**Priority:** P0 (Critical)

**Goal:** Calculate Activity, Impact, Quality (Engineering Maturity), Growth (Learning Trajectory) scores + Fraud Detection

**⚠️ UPDATED v5.0:** Complete metrics overhaul! New components: Collaboration (20pts), Project Focus (20pts), Fraud Detection System (0-100), Learning Pattern Detection (30pts).

**Note:** Use `src/lib/authenticity.ts` as the **perfect template**! It already has the exact pattern we need:
- 100-point scoring system ✅
- Component breakdown ✅
- Category/level labels ✅
- Warning flags array ✅
- Metadata tracking ✅

### 🆕 Metric Formulas v5.0

**📖 Documentation:** See [docs/METRICS_V2_DETAILED.md](./METRICS_V2_DETAILED.md) for complete TypeScript implementations and [docs/metrics-explanation.md](./metrics-explanation.md) for formulas.

**Summary:**

- **Activity (0-100)** = Code Throughput (35) + Consistency & Rhythm (25) + **Collaboration (20)** + **Project Focus (20)**
  - 🆕 **Code Throughput**: Lines changed in merged PRs (not commit count!)
  - 🆕 **Temporal Pattern Analysis**: Detect bot patterns via commit time histograms
  - 🆕 **Collaboration**: PR reviews done, issue participation, discussions
  - 🆕 **Project Focus**: 2-5 repos = ideal, 20+ repos = suspicious

- **Impact (0-100)** = Adoption Signal (40) + Community Engagement (30) + Social Proof (20) + Package Stats (10)
  - 🆕 **Active Forks**: Forks with actual commits (not just fork count)
  - 🆕 **Logarithmic Stars**: `log10(stars + 1) × 3` to prevent gaming
  - 🆕 **Issue Response Time**: Median hours to first response

- **Quality (0-100)** = **Code Health Practices (35)** + Documentation (25) + **Maintenance Signal (25)** + Architecture (15)
  - 🆕 **Code Health**: CI/CD detection, testing, linting, branch protection
  - 🆕 **Maintenance Signal**: Issue response time, resolution rate, longevity
  - ❌ **Removed**: "Originality" and "Ownership" (impossible to measure accurately)

- **Growth (-100 to +100)** = Skill Expansion (40) + Project Evolution (30) + **Learning Pattern Detection (30)**
  - 🆕 **Learning Patterns**: Tutorial vs Production project ratio (20% tutorial + 60% production = ideal)
  - 🆕 **Complexity Growth**: Year-over-year project complexity scoring

- **🆕 Fraud Detection (0-100)** = Empty Commits (30) + Bot Patterns (25) + Temporal Anomalies (20) + Mass Commits (15) + Fork Farming (10)
  - **Critical Flags**: Backdated commits (before account creation), multiple emails (>10)

### Reuse from Existing Code

**From `src/lib/statistics.ts`:**
- ✅ `calculateLanguageStatistics()` - For Quality Architecture metric
- ✅ `getMostActiveRepositories()` - For Timeline top projects
- ✅ `formatNumber()` - Display helper

**Pattern to Follow (`src/lib/authenticity.ts`):**
```typescript
// Existing pattern (COPY THIS!)
export interface AuthenticityScore {
  score: number;              // 0-100
  category: string;           // High/Medium/Low/Suspicious
  breakdown: {
    originality: number;      // 0-25
    activity: number;         // 0-25
    engagement: number;       // 0-25
    codeOwnership: number;    // 0-25
  };
  flags: string[];
  metadata: { /* stats */ };
}

// 🆕 Apply same pattern to new metrics:
export interface ActivityMetric {
  score: number;              // 0-100
  level: 'Low' | 'Moderate' | 'High' | 'Very High';
  breakdown: {
    codeThroughput: number;   // 0-35 ← UPDATED
    consistency: number;      // 0-25 ← UPDATED
    collaboration: number;    // 0-20 ← NEW
    projectFocus: number;     // 0-20 ← NEW
  };
  details: {
    linesChanged: number;
    mergedPRs: number;
    activeWeeks: number;
    reviewsDone: number;
    activeRepos: number;
  };
  fraudDetection?: FraudDetectionResult; // ← NEW
}
```

---

### Step 2.0: Fraud Detection System (NEW!)

**File:** `src/lib/metrics/fraud-detection.ts`

```typescript
export interface FraudDetectionResult {
  score: number; // 0-100, where 100 = 100% suspicion
  level: 'Clean' | 'Low Risk' | 'Medium Risk' | 'High Risk' | 'Critical';
  flags: FraudFlag[];
  breakdown: {
    emptyCommitsRatio: number;    // 0-30 points
    perfectPatternScore: number;  // 0-25 points
    temporalAnomalyScore: number; // 0-20 points
    massCommitsRatio: number;     // 0-15 points
    forkFarmingScore: number;     // 0-10 points
  };
}

export interface FraudFlag {
  type: 'empty_commits' | 'backdating' | 'bot_pattern' | 'temporal_anomaly' |
        'mass_commits' | 'fork_farming' | 'multiple_emails';
  severity: 'low' | 'medium' | 'high';
  message: string;
  count?: number;
}

export function calculateFraudDetection(commits: Commit[], repos: Repository[]): FraudDetectionResult {
  const flags: FraudFlag[] = [];

  // 1. Empty commits (30 points)
  const emptyCommits = commits.filter(c => c.additions === 0 && c.deletions === 0);
  const emptyRatio = commits.length > 0 ? emptyCommits.length / commits.length : 0;
  const emptyScore = emptyRatio * 30;

  if (emptyRatio > 0.05) {
    flags.push({
      type: 'empty_commits',
      severity: emptyRatio > 0.15 ? 'high' : 'medium',
      message: `${(emptyRatio * 100).toFixed(1)}% of commits are empty`,
      count: emptyCommits.length
    });
  }

  // 2. Bot patterns (25 points) - perfect daily commits at same time
  const commitsByDay = groupByDay(commits);
  const variance = calculateVariance(Object.values(commitsByDay).map(d => d.length));
  const perfectPatternScore = variance < 0.1 ? 25 : 0;

  // 3. Temporal anomalies (20 points)
  const hourHistogram = buildHourHistogram(commits);
  const workingWindow = findWorkingWindow(hourHistogram, 0.8);
  const outsideRatio = calculateOutsideWindowRatio(commits, workingWindow);
  const temporalScore = outsideRatio > 0.3 ? outsideRatio * 20 : 0;

  // 4. Mass commits (15 points)
  const massCommits = commits.filter(c => (c.additions + c.deletions) > 1000);
  const massRatio = commits.length > 0 ? massCommits.length / commits.length : 0;
  const massScore = massRatio * 15;

  // 5. Fork farming (10 points)
  const unmodifiedForks = repos.filter(r => r.isFork && (r.defaultBranchRef?.ahead || 0) === 0);
  const forkRatio = repos.length > 0 ? unmodifiedForks.length / repos.length : 0;
  const forkScore = forkRatio * 10;

  // Total fraud score
  const totalScore = Math.round(emptyScore + perfectPatternScore + temporalScore + massScore + forkScore);

  // Determine level
  let level: FraudDetectionResult['level'];
  if (totalScore < 20) level = 'Clean';
  else if (totalScore < 40) level = 'Low Risk';
  else if (totalScore < 60) level = 'Medium Risk';
  else if (totalScore < 80) level = 'High Risk';
  else level = 'Critical';

  return { score: totalScore, level, flags, breakdown: { ... } };
}
```

**Test:** 100% coverage, test all fraud patterns

---

### Step 2.1: Activity Score

**File:** `src/lib/metrics/activity.ts`

```typescript
import { YearData } from '@/hooks/useUserAnalytics'

export function calculateActivityScore(
  timeline: YearData[],
  commits: Commit[], // ← NEW for fraud detection
  reviews: Review[], // ← NEW for collaboration
  issueComments: IssueComment[] // ← NEW for collaboration
): ActivityMetric {
  if (!timeline.length) return getEmptyActivityMetric();

  const last3Months = getLastNMonths(timeline, 3);
  const last6Months = getLastNMonths(timeline, 6);
  const last12Months = getLastNMonths(timeline, 12);

  // A. Code Throughput (0-35 points) ← UPDATED
  const mergedPRs = getMergedPRs(last3Months);
  const linesChanged = mergedPRs.reduce((sum, pr) => sum + pr.additions + pr.deletions, 0);
  const linesPerMonth = linesChanged / 3;

  let throughputScore = 0;
  if (linesPerMonth < 1000) throughputScore = (linesPerMonth / 1000) * 15;
  else if (linesPerMonth < 5000) throughputScore = 15 + ((linesPerMonth - 1000) / 4000) * 10;
  else if (linesPerMonth < 15000) throughputScore = 25 + ((linesPerMonth - 5000) / 10000) * 10;
  else throughputScore = 35;

  // Penalty for mass commits
  const massCommitRatio = mergedPRs.filter(pr => (pr.additions + pr.deletions) > 1000).length / mergedPRs.length;
  if (massCommitRatio > 0.5) throughputScore = Math.max(0, throughputScore - 10);

  // B. Consistency & Rhythm (0-25 points) ← UPDATED
  const activeWeeks = countActiveWeeks(last12Months);
  const longestStreak = calculateLongestStreak(last12Months);

  let consistencyScore = 0;
  if (activeWeeks >= 40) consistencyScore = 20 + (activeWeeks - 40) / 12 * 5;
  else if (activeWeeks >= 20) consistencyScore = 10 + (activeWeeks - 20) / 20 * 10;
  else consistencyScore = (activeWeeks / 20) * 10;

  if (longestStreak >= 26) consistencyScore += 5; // Bonus

  // Temporal Pattern Analysis (anti-bot)
  const hourHistogram = buildHourHistogram(commits);
  const workingWindow = findWorkingWindow(hourHistogram, 0.8);
  const outsideRatio = calculateOutsideWindowRatio(commits, workingWindow);
  if (outsideRatio > 0.1) consistencyScore = Math.max(0, consistencyScore - 5);

  // C. Collaboration (0-20 points) ← NEW
  const substantiveReviews = reviews.filter(r => r.body.length > 10 && !isLGTMOnly(r.body));
  const issuesParticipated = new Set(issueComments.map(c => c.issue.id)).size;
  const prDiscussions = calculatePRDiscussions(timeline);

  let collaborationScore = 0;
  collaborationScore += Math.min((substantiveReviews.length / 20) * 10, 10);
  collaborationScore += Math.min((issuesParticipated / 10) * 5, 5);
  collaborationScore += Math.min((prDiscussions / 3) * 5, 5);

  // D. Project Focus (0-20 points) ← NEW
  const activeRepos = countActiveRepos(last3Months);
  const forkRatio = calculateUnmodifiedForkRatio(activeRepos);
  const sameDayRatio = calculateSameDayCreationRatio(activeRepos);

  let focusScore = 0;
  if (activeRepos >= 2 && activeRepos <= 5) focusScore = 20;
  else if (activeRepos === 1) focusScore = 15;
  else if (activeRepos >= 6 && activeRepos <= 10) focusScore = 12;
  else if (activeRepos >= 11 && activeRepos <= 20) focusScore = 8;
  else focusScore = 5;

  if (forkRatio > 0.5) focusScore = Math.max(0, focusScore - 5);
  if (sameDayRatio > 0.7) focusScore = Math.max(0, focusScore - 5);

  const totalScore = Math.round(throughputScore + consistencyScore + collaborationScore + focusScore);

  return {
    score: totalScore,
    level: getActivityLabel(totalScore),
    breakdown: {
      codeThroughput: Math.round(throughputScore),
      consistency: Math.round(consistencyScore),
      collaboration: Math.round(collaborationScore),
      projectFocus: Math.round(focusScore)
    },
    details: {
      linesChanged,
      mergedPRs: mergedPRs.length,
      activeWeeks,
      reviewsDone: substantiveReviews.length,
      activeRepos
    }
  };
}

export function getActivityLabel(score: number): string {
  if (score >= 80) return 'Very High';
  if (score >= 60) return 'High';
  if (score >= 40) return 'Moderate';
  return 'Low';
}
```

**Test:** 100% coverage required

---

### Step 2.2: Impact Score

**File:** `src/lib/metrics/impact.ts`

```typescript
export function calculateImpactScore(repos: Repository[]): ImpactMetric {
  // A. Adoption Signal (0-40 points)
  const activeForks = calculateActiveForks(repos); // Forks with commits ahead
  const totalWatchers = repos.reduce((sum, r) => sum + r.watchers.totalCount, 0);
  const totalContributors = repos.reduce((sum, r) => sum + r.mentionableUsers.totalCount, 0);
  const recentlyActive = repos.filter(r => daysSince(r.pushedAt) <= 30).length;

  const adoptionScore =
    Math.log10(activeForks + 1) * 5 +
    Math.log10(totalWatchers + 1) * 3 +
    Math.min(totalContributors * 0.5, 10) +
    (recentlyActive > 0 ? 5 : 0);

  // B. Community Engagement (0-30 points)
  const { totalIssues, closedIssues, closureRate } = calculateIssueStats(repos);
  const externalPRs = calculateExternalPRs(repos);

  let issuesScore = 0;
  if (totalIssues >= 50 && closureRate > 0.5) issuesScore = 15;
  else if (totalIssues >= 10) issuesScore = 10;
  else if (totalIssues < 10 && closureRate > 0.8) issuesScore = 8;
  else issuesScore = 3;

  const prScore = Math.min((externalPRs / 20) * 10, 10);
  const discussionScore = 5; // Simplified for MVP

  const engagementScore = issuesScore + prScore + discussionScore;

  // C. Social Proof (0-20 points) - LOGARITHMIC
  const totalStars = repos.reduce((sum, r) => sum + r.stargazerCount, 0);
  const starsScore = Math.min(Math.log10(totalStars + 1) * 3, 15);
  const trendingBonus = 0; // Simplified for MVP

  const socialScore = starsScore + trendingBonus;

  // D. Package Registry Stats (0-10 points) - SIMPLIFIED
  const publishableCount = repos.filter(r => hasPackageFile(r)).length;
  const packageScore = publishableCount > 0 ? 5 : 0;

  const totalScore = Math.round(adoptionScore + engagementScore + socialScore + packageScore);

  return {
    score: totalScore,
    level: getImpactLabel(totalScore),
    breakdown: {
      adoptionSignal: Math.round(adoptionScore),
      communityEngagement: Math.round(engagementScore),
      socialProof: Math.round(socialScore),
      packageStats: Math.round(packageScore)
    }
  };
}
```

---

### Step 2.3: Quality (Engineering Maturity)

**File:** `src/lib/metrics/quality.ts`

```typescript
export function calculateQualityScore(repos: Repository[]): QualityMetric {
  // A. Code Health Practices (0-35 points) ← NEW
  const cicdCount = repos.filter(r => hasCICD(r)).length;
  const testCount = repos.filter(r => hasTests(r)).length;
  const lintCount = repos.filter(r => hasLinting(r)).length;
  const protectionCount = repos.filter(r => r.branchProtectionRules.totalCount > 0).length;

  const healthScore =
    (cicdCount / repos.length) * 15 +
    (testCount / repos.length) * 10 +
    (lintCount / repos.length) * 5 +
    (protectionCount / repos.length) * 5;

  // B. Documentation Quality (0-25 points)
  const docScore = calculateDocumentationScore(repos);

  // C. Maintenance Signal (0-25 points) ← NEW
  const maintenanceScore = calculateMaintenanceScore(repos);

  // D. Architecture Complexity (0-15 points)
  const architectureScore = calculateArchitectureScore(repos);

  const totalScore = Math.round(healthScore + docScore + maintenanceScore + architectureScore);

  return {
    score: totalScore,
    level: getQualityLabel(totalScore),
    breakdown: {
      codeHealthPractices: Math.round(healthScore),
      documentation: Math.round(docScore),
      maintenanceSignal: Math.round(maintenanceScore),
      architectureComplexity: Math.round(architectureScore)
    }
  };
}
```

---

### Step 2.4: Growth (Learning Trajectory)

**File:** `src/lib/metrics/growth.ts`

```typescript
export function calculateGrowthScore(repos: Repository[]): GrowthMetric {
  // A. Skill Expansion (0-40 points)
  const recentLanguages = getLanguages(repos, 2); // Last 2 years
  const olderLanguages = getLanguages(repos, 5, 2); // Years 3-5
  const newLanguages = [...recentLanguages].filter(lang => !olderLanguages.has(lang));

  const skillScore = Math.min(newLanguages.length * 10, 40);

  // B. Project Evolution (- 30 to +30 points)
  const evolutionScore = calculateProjectEvolution(repos);

  // C. Learning Pattern Detection (0-30 points) ← NEW
  const tutorialCount = repos.filter(r => isTutorialProject(r)).length;
  const productionCount = repos.filter(r => isProductionProject(r)).length;
  const tutorialRatio = repos.length > 0 ? tutorialCount / repos.length : 0;
  const productionRatio = repos.length > 0 ? productionCount / repos.length : 0;

  let learningScore = 0;
  if (tutorialRatio >= 0.15 && tutorialRatio <= 0.25 && productionRatio >= 0.50) {
    learningScore = 30; // Ideal balance
  } else if (tutorialRatio === 1.0) {
    learningScore = 0; // Only learning
  } else if (productionRatio === 1.0 && tutorialRatio === 0) {
    learningScore = 20; // Shipping, not experimenting
  } else {
    learningScore = (productionRatio * 20) + (tutorialRatio * 10);
  }

  const totalScore = Math.round(skillScore + evolutionScore + learningScore);

  return {
    score: totalScore,
    trend: getGrowthTrend(totalScore),
    breakdown: {
      skillExpansion: Math.round(skillScore),
      projectEvolution: Math.round(evolutionScore),
      learningPattern: Math.round(learningScore)
    }
  };
}

function isTutorialProject(repo: Repository): boolean {
  const keywords = ['tutorial', 'learning', 'course', 'homework', 'practice'];
  const nameMatch = keywords.some(k => repo.name.toLowerCase().includes(k));
  const descMatch = keywords.some(k => repo.description?.toLowerCase().includes(k));
  const abandoned = repo.stargazerCount === 0 && repo.forkCount === 0 && daysSince(repo.pushedAt) > 14;

  return nameMatch || descMatch || abandoned;
}

function isProductionProject(repo: Repository): boolean {
  return (
    repo.stargazerCount > 10 ||
    repo.forkCount > 3 ||
    hasCICD(repo) ||
    repo.issues.totalCount > 5 ||
    repo.mentionableUsers.totalCount > 3 ||
    daysSince(repo.pushedAt) < 90
  );
}
```

---

### Deliverables

- [ ] **Fraud Detection** system implemented with all 5 components
- [ ] **Activity** metric with 4 components (Throughput, Consistency, Collaboration, Focus)
- [ ] **Impact** metric with logarithmic stars scaling and active forks
- [ ] **Quality** metric with Code Health Practices and Maintenance Signal
- [ ] **Growth** metric with Learning Pattern Detection
- [ ] 100% test coverage for all calculation functions
- [ ] Each metric follows `authenticity.ts` pattern
- [ ] Helper functions in `src/lib/metrics/helpers.ts`

**Estimated Time:** **3 days** (increased from 2 days due to new components: Fraud Detection, Collaboration, Learning Patterns)

---

## Phase 3: Core Components (P0)

**Priority:** P0 (Critical)

**Note:** Use `src/components/UserAuthenticity.tsx` as the **UI template**! It already has the exact card layout we need.

### Component Development Protocol (MANDATORY)

**STRICT 6-STEP WORKFLOW FOR EVERY COMPONENT:**

**DO NOT proceed to next component until all 6 steps complete!**

#### Step 1: ✅ Component Implementation (1-2 hours)
```typescript
// Use existing shadcn/ui components
// Follow accessibility guidelines (ARIA labels, keyboard navigation)
// Base on UserAuthenticity.tsx template
```

**Checklist:**
- [ ] TypeScript component created
- [ ] Uses shadcn/ui primitives (Card, Progress, Badge, etc.)
- [ ] Props interface defined
- [ ] Loading/Error states handled
- [ ] Responsive design (mobile, tablet, desktop)

#### Step 2: ✅ Storybook Stories (30 minutes)
```bash
# Minimum 3 stories per component:
# - Default (normal state)
# - Loading (skeleton/spinner)
# - Error (error message)
```

**Checklist:**
- [ ] `.stories.tsx` file created
- [ ] All variants covered (3+ stories)
- [ ] Interactive controls for props
- [ ] Documentation with `tags: ['autodocs']`

#### Step 3: ✅ Build Storybook (REQUIRED)
```bash
npm run build-storybook
# This creates storybook-static/index.json
# Required for Storybook MCP to index component
```

**Checklist:**
- [ ] Build succeeds without errors
- [ ] `storybook-static/index.json` updated
- [ ] All stories render in built version

#### Step 4: ✅ Unit Tests (1 hour)
```bash
# Test all stories (if story renders, test should pass)
# Test user interactions (clicks, inputs, form submissions)
# Test edge cases (empty data, long text, etc.)
```

**Coverage Targets:**
- **90%+ for UI components**
- **100% for logic functions**

**Checklist:**
- [ ] `.test.tsx` file created
- [ ] All stories tested
- [ ] User interactions tested
- [ ] Edge cases covered
- [ ] Mock data created

#### Step 5: ✅ Verify Coverage
```bash
npm run test:coverage
# Check coverage report for this component
# Must meet targets before moving to next component
```

**Checklist:**
- [ ] Coverage ≥ 90% for UI
- [ ] Coverage = 100% for logic
- [ ] No untested code paths

#### Step 6: ✅ MCP Verification (Optional, 5 minutes)
```bash
# Query Storybook MCP: "Show me ComponentName"
# Verify component is indexed
# Check documentation completeness
```

**Checklist:**
- [ ] Component appears in MCP search
- [ ] Documentation is complete
- [ ] Examples are clear

---

**⚠️ IMPORTANT: Only 1 component should be "in progress" at a time!**

Complete all 6 steps for Component A before starting Component B.

**Time Estimate per Component:**
- Implementation: 1-2 hours
- Stories: 30 minutes
- Tests: 1 hour
- **Total: ~3 hours per component**

---

### Step 3.1: MetricCard Component

**Install shadcn Card:**
```bash
npx shadcn@latest add card
```

**File:** `src/components/assessment/MetricCard.tsx`

```typescript
'use client' // Keep for compatibility

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Info } from 'lucide-react'
import { Button } from '@/components/ui/button'

export interface MetricCardProps {
  title: string
  score: number
  level: 'Low' | 'Moderate' | 'High' | 'Strong' | 'Excellent'
  breakdown?: Array<{
    label: string
    value: number
    max: number
  }>
  loading?: boolean
  onExplainClick?: () => void
}

export function MetricCard({
  title,
  score,
  level,
  breakdown,
  loading = false,
  onExplainClick,
}: MetricCardProps) {
  if (loading) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <div className="h-6 w-1/2 rounded bg-muted" />
        </CardHeader>
        <CardContent>
          <div className="h-12 rounded bg-muted" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">{title}</CardTitle>
        {onExplainClick && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onExplainClick}
            aria-label={`Explain ${title} score`}
          >
            <Info className="h-4 w-4" />
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Score display */}
        <div className="text-center">
          <div className="text-4xl font-bold">{score}%</div>
          <div className="text-sm text-muted-foreground">{level}</div>
        </div>

        {/* Progress bar */}
        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-2 rounded-full bg-primary transition-all duration-500 ease-out"
            style={{ width: `${score}%` }}
          />
        </div>

        {/* Breakdown */}
        {breakdown && breakdown.length > 0 && (
          <div className="space-y-2 text-sm">
            {breakdown.map((item) => (
              <div key={item.label} className="flex justify-between">
                <span className="text-muted-foreground">{item.label}</span>
                <span className="font-medium">
                  {item.value}/{item.max}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
```

**File:** `src/components/assessment/MetricCard.stories.tsx`

```typescript
import type { Meta, StoryObj } from '@storybook/react'
import { MetricCard } from './MetricCard'

const meta: Meta<typeof MetricCard> = {
  title: 'Assessment/MetricCard',
  component: MetricCard,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof MetricCard>

export const ActivityHigh: Story = {
  args: {
    title: 'Activity',
    score: 85,
    level: 'High',
    breakdown: [
      { label: 'Recent commits', value: 40, max: 40 },
      { label: 'Consistency', value: 30, max: 30 },
      { label: 'Diversity', value: 15, max: 30 },
    ],
  },
}

export const ImpactStrong: Story = {
  args: {
    title: 'Impact',
    score: 72,
    level: 'Strong',
  },
}

export const Loading: Story = {
  args: {
    title: 'Activity',
    score: 0,
    level: 'Low',
    loading: true,
  },
}
```

**File:** `src/components/assessment/MetricCard.test.tsx`

```typescript
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MetricCard } from './MetricCard'

describe('MetricCard', () => {
  it('renders score and level', () => {
    render(<MetricCard title="Activity" score={85} level="High" />)

    expect(screen.getByText('85%')).toBeInTheDocument()
    expect(screen.getByText('High')).toBeInTheDocument()
  })

  it('calls onExplainClick when info button clicked', () => {
    const handleClick = vi.fn()
    render(
      <MetricCard
        title="Activity"
        score={85}
        level="High"
        onExplainClick={handleClick}
      />
    )

    fireEvent.click(screen.getByLabelText('Explain Activity score'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('shows loading state', () => {
    const { container } = render(
      <MetricCard title="Activity" score={0} level="Low" loading />
    )

    expect(container.querySelector('.animate-pulse')).toBeInTheDocument()
  })
})
```

---

### Step 3.2: QuickAssessment Component

**File:** `src/components/assessment/QuickAssessment.tsx`

```typescript
import { MetricCard } from './MetricCard'

interface QuickAssessmentProps {
  metrics: {
    activity: { score: number; level: string }
    impact: { score: number; level: string }
    quality: { score: number; level: string }
    growth: { score: number; level: string }
  }
  loading?: boolean
  onExplainMetric?: (metric: string) => void
}

export function QuickAssessment({
  metrics,
  loading,
  onExplainMetric
}: QuickAssessmentProps) {
  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-bold">🎯 Quick Assessment</h2>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Activity"
          score={metrics.activity.score}
          level={metrics.activity.level as any}
          loading={loading}
          onExplainClick={() => onExplainMetric?.('activity')}
        />
        <MetricCard
          title="Impact"
          score={metrics.impact.score}
          level={metrics.impact.level as any}
          loading={loading}
          onExplainClick={() => onExplainMetric?.('impact')}
        />
        <MetricCard
          title="Quality"
          score={metrics.quality.score}
          level={metrics.quality.level as any}
          loading={loading}
          onExplainClick={() => onExplainMetric?.('quality')}
        />
        <MetricCard
          title="Growth"
          score={metrics.growth.score}
          level={metrics.growth.level as any}
          loading={loading}
          onExplainClick={() => onExplainMetric?.('growth')}
        />
      </div>
    </section>
  )
}
```

**Follow same workflow:** Story → Test → Document

---

### Remaining P0 Components

Follow same workflow for:

- **Step 3.3:** MetricExplanationModal
- **Step 3.4:** AssessmentSummary (optional AI summary)

**Deliverables:**
- [ ] All components have `.stories.tsx`
- [ ] All components have `.test.tsx`
- [ ] Storybook built and indexed (`npm run build-storybook`)
- [ ] >90% test coverage
- [ ] MetricCard follows UserAuthenticity.tsx layout pattern
- [ ] Uses existing shadcn/ui components (Card, Progress, Badge)

**Estimated Time:** **2 days** (reduced from 2-3 days - UI patterns established, 28+ existing components)

---

## Phase 4: Timeline Components (P1)

**Priority:** P1 (Important)

**Note:** Reuse `RepositoryCard` for project display in expanded year view. Recharts already configured for mini-charts.

### Step 4.1: ActivityTimeline

**File:** `src/components/timeline/ActivityTimeline.tsx`

```typescript
import { YearData } from '@/hooks/useUserAnalytics'
import { TimelineYear } from './TimelineYear'

interface ActivityTimelineProps {
  timeline: YearData[]
  loading?: boolean
}

export function ActivityTimeline({ timeline, loading }: ActivityTimelineProps) {
  if (loading) {
    return <TimelineSkeleton />
  }

  const maxCommits = Math.max(...timeline.map(y => y.totalCommits))

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-bold">📊 Activity Timeline</h2>

      <div className="space-y-2">
        {timeline.map(year => (
          <TimelineYear
            key={year.year}
            year={year}
            maxCommits={maxCommits}
          />
        ))}
      </div>
    </section>
  )
}
```

---

### Step 4.2: TimelineYear (Collapsible)

**File:** `src/components/timeline/TimelineYear.tsx`

```typescript
import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { YearData } from '@/hooks/useUserAnalytics'

interface TimelineYearProps {
  year: YearData
  maxCommits: number
}

export function TimelineYear({ year, maxCommits }: TimelineYearProps) {
  const [expanded, setExpanded] = useState(false)
  const widthPercent = (year.totalCommits / maxCommits) * 100

  return (
    <div className="overflow-hidden rounded-lg border">
      {/* Year bar */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-4 text-left transition-colors hover:bg-muted"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-lg font-semibold">{year.year}</span>

            {/* Visual bar */}
            <div className="h-8 min-w-[100px] flex-1 rounded bg-muted">
              <div
                className="h-full rounded bg-primary transition-all duration-500"
                style={{ width: `${widthPercent}%` }}
              />
            </div>

            <span className="text-sm text-muted-foreground">
              {year.totalCommits} commits
            </span>
          </div>

          {expanded ? <ChevronUp /> : <ChevronDown />}
        </div>
      </button>

      {/* Expanded details */}
      {expanded && (
        <div className="border-t p-4">
          <YearExpandedView year={year} />
        </div>
      )}
    </div>
  )
}
```

**CSS for smooth expand:**

```css
/* Already handled by conditional rendering + Tailwind transitions */
```

---

### Step 4.3: YearExpandedView

Show:
- Top 10 projects (owned vs contributions)
- Language distribution
- Monthly activity (if data available)

**Deliverables:**
- [ ] ActivityTimeline component
- [ ] TimelineYear (collapsible with CSS transitions)
- [ ] YearExpandedView (reuses RepositoryCard)
- [ ] Smooth expand/collapse animation
- [ ] Stories + Tests
- [ ] Works with all account ages (2-10+ years)

**Estimated Time:** **2 days** (reduced from 2-3 days - RepositoryCard exists, Recharts configured)

---

## Phase 5: Layout Refactoring (P1)

**Priority:** P1 (Important)

**Goal:** Remove tabs, create single-page progressive disclosure

### Step 5.1: Remove Tabs

**File:** `src/App.tsx`

**Before:**
```typescript
<Tabs defaultValue="profile">
  <TabsList>
    <TabsTrigger value="profile">Profile</TabsTrigger>
    <TabsTrigger value="stats">Stats</TabsTrigger>
  </TabsList>
  <TabsContent value="profile">...</TabsContent>
  <TabsContent value="stats">...</TabsContent>
</Tabs>
```

**After:**
```typescript
<div className="space-y-8">
  <SearchHeader onSearch={setUsername} />

  {username && (
    <>
      <QuickAssessment metrics={metrics} loading={loading} />
      <ActivityTimeline timeline={timeline} loading={loading} />
      <ProjectSection projects={projects} loading={loading} />
    </>
  )}
</div>
```

---

### Step 5.2: ProjectSection (Owned vs Contributions)

**File:** `src/components/projects/ProjectSection.tsx`

```typescript
interface ProjectSectionProps {
  projects: {
    owned: Repository[]
    contributions: Repository[]
  }
  loading?: boolean
}

export function ProjectSection({ projects, loading }: ProjectSectionProps) {
  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-bold">🔥 Top Projects & Contributions</h2>

      {/* Owned Projects */}
      <div>
        <h3 className="mb-4 text-lg font-semibold">
          👤 Your Original Projects ({projects.owned.length})
        </h3>
        <div className="grid gap-4 md:grid-cols-2">
          {projects.owned.map(repo => (
            <ProjectCard key={repo.url} repo={repo} type="owned" />
          ))}
        </div>
      </div>

      {/* Contributions */}
      <div>
        <h3 className="mb-4 text-lg font-semibold">
          👥 Open Source Contributions ({projects.contributions.length})
        </h3>
        <div className="grid gap-4 md:grid-cols-2">
          {projects.contributions.map(repo => (
            <ProjectCard key={repo.url} repo={repo} type="contribution" />
          ))}
        </div>
      </div>
    </section>
  )
}
```

---

### Step 5.3: ProjectCard with Badge

```typescript
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'

interface ProjectCardProps {
  repo: Repository
  type: 'owned' | 'contribution'
}

export function ProjectCard({ repo, type }: ProjectCardProps) {
  return (
    <Card className="p-4 transition-all hover:-translate-y-1 hover:shadow-lg">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h4 className="font-semibold">{repo.name}</h4>
            {type === 'owned' ? (
              <Badge variant="default">👤 Owner</Badge>
            ) : (
              <Badge variant="secondary">👥 Contributor</Badge>
            )}
          </div>

          <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
            {repo.description}
          </p>

          <div className="mt-2 flex gap-4 text-xs text-muted-foreground">
            <span>⭐ {repo.stargazerCount}</span>
            <span>🍴 {repo.forkCount}</span>
            {repo.primaryLanguage && (
              <span>{repo.primaryLanguage.name}</span>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}
```

**Deliverables:**
- [ ] MainTabs removed from App.tsx
- [ ] Single-page vertical scroll layout
- [ ] ProjectSection created (Owned vs Contributions split)
- [ ] ProjectCard enhanced with badges (👤 Owner / 👥 Contributor)
- [ ] Responsive (mobile: 1 col, tablet: 2 cols, desktop: 2 cols)
- [ ] Repository filters/sorting kept in ProjectSection

**Estimated Time:** **1 day** (reduced from 1-2 days - simple layout change)

### Critical Decision: Existing Statistics Tab

**Current Statistics Tab includes:**
- CommitChart (line/bar/area)
- LanguageChart (pie/donut)
- ActivityChart (bar)

**Options:**
1. **Remove entirely** - Timeline replaces it
2. **Keep as separate route** - `/stats` page
3. **Integrate into Timeline** - Show charts in YearExpandedView ✅ Recommended

**Decision:** Option 3 - Display mini language chart in expanded year view (reuse LanguageChart component)

---

## Phase 6: Testing & Polish (P2)

**Priority:** P2 (Nice to have)

**Note:** Testing infrastructure already established with 99.85% pass rate. Vitest, Playwright, and Storybook patterns known.

### Step 6.1: E2E Tests

**File:** `e2e/user-analytics-flow.spec.ts`

```typescript
import { test, expect } from '@playwright/test'

test('complete analytics flow', async ({ page }) => {
  await page.goto('/')

  // Search for user
  await page.fill('[data-testid="search-input"]', 'torvalds')
  await page.click('[data-testid="search-button"]')

  // Wait for metrics
  await expect(page.locator('text=Activity')).toBeVisible()
  await expect(page.locator('text=Impact')).toBeVisible()

  // Check metric values loaded
  await expect(page.locator('text=%').first()).toBeVisible()

  // Expand timeline year
  await page.click('text=2024')
  await expect(page.locator('text=Top Projects')).toBeVisible()

  // Check projects loaded
  await expect(page.locator('text=👤 Owner')).toBeVisible()
})
```

---

### Step 6.2: Accessibility Audit

```bash
# Run axe DevTools
npm install -D @axe-core/playwright

# Test
npx playwright test --headed
# Check for 0 accessibility violations
```

---

### Step 6.3: Performance

**Targets:**
- LCP: <2.5s
- FID: <100ms
- Bundle size: <500KB
- Test coverage: >95%

**Check:**
```bash
npm run build
# Check dist/assets/*.js sizes

npm run test:coverage
# Verify >95%
```

**Deliverables:**
- [ ] E2E tests pass (user-analytics-flow.spec.ts)
- [ ] Accessibility audit: 0 errors (axe DevTools)
- [ ] Performance targets met (LCP <2.5s, Bundle <500KB)
- [ ] Test coverage >95%
- [ ] Production deployment to Vercel

**Estimated Time:** **2 days** (reduced from 2-3 days - test patterns established)

---

## UI/UX Design Reference

**All UI/UX decisions from COMPLETE_PLAN.md preserved:**

✅ Three-Level Information Architecture
✅ Quick Assessment (4 metrics with explanations)
✅ Activity Timeline (year-by-year)
✅ Project Cards (Owned 👤 vs Contributions 👥)
✅ Progressive Disclosure (important first)
✅ Responsive (mobile-first)
✅ Accessibility (WCAG 2.1 AA)

---

## Animations Strategy

### 95% CSS Transitions

```css
/* Lightweight, 0KB overhead */

/* Card hover */
.metric-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.metric-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

/* Progress bar fill */
.progress-bar {
  transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Timeline expand (handled by React conditional rendering) */
```

### 5% Framer Motion

**Only for:**
- Modal open/close animations
- Page transitions (if needed)

```typescript
import { motion, AnimatePresence } from 'framer-motion'

// Modal example
<AnimatePresence>
  {isOpen && (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      <MetricExplanationModal />
    </motion.div>
  )}
</AnimatePresence>
```

**Bundle impact:** ~15KB (tree-shaken)

---

## Dependencies

### Already Installed (Reuse)

```json
{
  "react": "19.0.0",
  "vite": "7.0.0",
  "typescript": "5.8.3",
  "@apollo/client": "3.14.0",
  "recharts": "2.15.4",
  "date-fns": "4.1.0",
  "shadcn/ui": "latest (New York style)",
  "vitest": "latest",
  "@playwright/test": "latest"
}
```

### Required (New)

```json
{
  "@vercel/kv": "^3.0.0"  // For server-side caching
}
```

### Optional (Add only if needed)

```json
{
  "framer-motion": "^11.0.0"  // Only for modals (Phase 5+), ~15KB tree-shaken
}
```

### NOT Adding (Use Existing Instead)

```json
{
  "vaul": "❌",                      // Use shadcn dialog instead
  "react-use-gesture": "❌",         // Use native touch events
  "@tanstack/react-virtual": "❌",  // Not needed for <100 repos
  "cmdk": "❌",                      // Command Palette is Phase 7+
  "next.js": "❌"                    // Staying on Vite
}
```

### Quick Reference

```bash
# Check existing components before creating new ones
npm run storybook  # Browse 28+ existing components

# Reference existing metric patterns
cat src/lib/authenticity.ts
cat src/components/UserAuthenticity.tsx

# Run existing tests to understand patterns
npm run test src/lib/authenticity.test.ts
npm run test src/components/UserAuthenticity.test.tsx
```

---

## Success Criteria

### Phase 0 (Backend) - Est. 2 days
- [ ] GitHub token secured on server (Vercel Functions)
- [ ] Vercel KV caching works (30 min TTL for recent data)
- [ ] Apollo Client `HttpLink` URI redirected to `/api/github-proxy` ← NEW
- [ ] Token NOT visible in DevTools Network tab
- [ ] Cache HIT/SET logged in Vercel Functions logs
- [ ] Deployed to Vercel Free tier

### Phase 1 (Data) - Est. 3 days
- [ ] `generateYearRanges(createdAt)` works for all account ages ← UPDATED
- [ ] Year-by-year data loads (from account creation to now) ← UPDATED
- [ ] Owned repos separated from contributions
- [ ] Parallel queries work (Promise.all)
- [ ] Cache keys per year working (`user:{username}:year:{year}`)
- [ ] `useQueryUser` still works (if using Migration Option A) ← NEW

### Phase 2 (Metrics) - Est. 2 days
- [ ] All 4 metrics implemented (activity, impact, quality, growth)
- [ ] Each metric follows `authenticity.ts` pattern ← NEW
- [ ] Test coverage 100% for calculation functions
- [ ] Benchmark labels correct (Low/Moderate/High/etc)
- [ ] Reuses helpers from `statistics.ts` where applicable ← NEW

### Phase 3 (UI) - Est. 2 days
- [ ] MetricCard component responsive
- [ ] MetricCard follows `UserAuthenticity.tsx` layout pattern ← NEW
- [ ] QuickAssessment grid works (4 metrics)
- [ ] Uses existing shadcn/ui components (Card, Progress, Badge) ← NEW
- [ ] Storybook stories complete for all components
- [ ] Accessibility audit: 0 errors

### Phase 4 (Timeline) - Est. 2 days
- [ ] Timeline renders all years (from account creation to now) ← UPDATED
- [ ] TimelineYear expand/collapse smooth (CSS transitions)
- [ ] Visual bars proportional to max commits
- [ ] YearExpandedView reuses `RepositoryCard` component ← NEW
- [ ] Works with all account ages (2-10+ years tested) ← NEW

### Phase 5 (Layout) - Est. 1 day
- [ ] MainTabs removed from App.tsx ← UPDATED
- [ ] Single-page vertical scroll layout
- [ ] Owned vs Contributions split visual (👤 / 👥 badges)
- [ ] Repository filters/sorting kept in ProjectSection ← NEW
- [ ] Decision made on Statistics Tab integration ← NEW

### Phase 6 (Polish) - Est. 2 days
- [ ] E2E tests pass (user-analytics-flow.spec.ts)
- [ ] Accessibility audit: 0 errors (axe DevTools)
- [ ] Performance targets met (LCP <2.5s, Bundle <500KB)
- [ ] Test coverage >95% overall
- [ ] Production deployed to Vercel

**Total Estimated Time:** 14 days (down from 14-19 days with 70% code reuse)

---

## Quick Reference

### Commands

```bash
# Development
npm run dev              # Start Vite dev server
npm run build            # Production build
npm run preview          # Preview build

# Testing
npm run test             # Vitest (unit tests)
npm run test:ui          # Vitest UI
npm run test:coverage    # Coverage report
npm run test:e2e         # Playwright E2E
npm run test:all         # All tests

# Storybook
npm run storybook        # Start Storybook
npm run build-storybook  # Build static Storybook

# Deployment
vercel                   # Deploy to Vercel
vercel --prod            # Production deploy
```

### MCP Queries (Examples)

```
"Vercel Serverless Functions caching best practices"
"Apollo Client cache strategies for GraphQL"
"Framer Motion tree-shaking optimization"
"shadcn Card component variants"
```

---

## Version History

### v5.0 (2025-11-17) - Major Metrics Overhaul

**Breaking Changes:**
- Complete rewrite of all 4 metrics with new components and formulas
- Added Fraud Detection System (0-100 score with 5 detection components)
- Removed "Originality" and "Ownership" metrics from Quality (replaced with Code Health Practices)
- Changed Activity from 3 components to 4 components
- Changed Growth to include Learning Pattern Detection

**New Features:**

**Activity Metric (0-100 points):**
- A. Code Throughput (0-35 points) - Lines changed in merged PRs, not commit count
- B. Consistency & Rhythm (0-25 points) - Active weeks + Temporal Pattern Analysis
- C. Collaboration (0-20 points) - PR reviews + issue participation (NEW)
- D. Project Focus (0-20 points) - Repository scatter detection (NEW)

**Impact Metric (0-100 points):**
- A. Adoption Signal (0-40 points) - Active forks (forks with commits ahead), watchers, contributors
- B. Community Engagement (0-30 points) - Issues activity + external PRs
- C. Social Proof (0-20 points) - Stars with logarithmic scaling (anti-gaming)
- D. Package Registry Stats (0-10 points) - npm/PyPI downloads (Phase 5+)

**Quality/Engineering Maturity (0-100 points):**
- A. Code Health Practices (0-35 points) - CI/CD, testing, linting, code review process (NEW)
- B. Documentation Quality (0-25 points) - README analysis + Wiki + Docs site
- C. Maintenance Signal (0-25 points) - Issue response time + resolution rate (NEW)
- D. Architecture Complexity (0-15 points) - Project size + tech stack + infrastructure

**Growth/Learning Trajectory (-100 to +100 points):**
- A. Skill Expansion (0-40 points) - New languages/frameworks in last 2 years
- B. Project Evolution (-30 to +30 points) - Complexity growth over time
- C. Learning Pattern Detection (0-30 points) - Tutorial vs Production ratio (NEW)

**Fraud Detection System (0-100 suspicion score):**
- Empty commits detection (0-30 points) - `additions + deletions == 0`
- Perfect pattern/bot detection (0-25 points) - Uniform daily commits
- Temporal anomalies (0-20 points) - Commits outside working window
- Mass commits (0-15 points) - Single commits with >1000 lines
- Fork farming (0-10 points) - Unmodified forks ratio

**Documentation:**
- Created [docs/METRICS_V2_DETAILED.md](docs/METRICS_V2_DETAILED.md) with complete TypeScript implementations and formulas
- Updated [docs/metrics-explanation.md](docs/metrics-explanation.md) to v2.0 (925 lines) with fraud detection examples

**GraphQL Query Updates Required:**
- Added 8+ new fields needed for fraud detection and new metrics
- PR additions/deletions for Code Throughput
- PR review comments for Collaboration
- Issue comments for Collaboration
- Commit timestamps with `occurredAt` for Temporal Pattern Analysis
- Commit author email addresses for fraud detection
- Repository file tree for CI/CD detection
- Branch protection rules for Code Review Process

**Timeline Impact:**
- Phase 2 estimate: 2 days → 3 days (due to Fraud Detection complexity and new metric components)
- Total timeline: 14 days → 15 days

**Overall Rank Classification:**
```
Junior:     0-29  (Low activity, little experience)
Mid:       30-49  (Regular work, some projects)
Senior:    50-69  (High Maturity >60, Impact >40)
Staff:     70-84  (Senior + High Impact >70)
Principal: 85-100 (Staff + Very High Activity >70 + Global Impact >80)
```

**Overall Score Formula:**
```typescript
Overall = Activity × 0.25 + Impact × 0.30 + Maturity × 0.30 + max(0, Learning) × 0.15
```

**Anti-Fake Protection Patterns:**
- Logarithmic scaling: `log10(stars + 1) × 3` prevents star farming
- Active forks only: Count forks with commits ahead, not total forks
- Temporal pattern analysis: Build 0-23 hour histogram, find working window (80% commits), flag if >10% outside
- Collaboration filtering: Remove "LGTM" only reviews, "me too" only comments
- Learning balance: Ideal 20% tutorial + 60% production + 20% abandoned
- Mass commit penalty: -10 points if >50% of PRs have >1000 lines

---

### v4.0 (2025-11-16) - Current State Analysis

**Added:**
- Current State & Reusability Analysis section (70% infrastructure ready)
- "What NOT to Change" section (preserve working components)
- Migration Strategy options (Incremental vs Full Replacement)
- Updated Dependencies with "Already Installed" vs "Required (New)"
- Enhanced Success Criteria with checkpoints per phase

**Changes:**
- Reduced timeline: 14-19 days → 14 days (with 70% code reuse)
- Documented 99.85% test pass rate baseline
- Referenced `authenticity.ts` as template for metric patterns
- Added reuse notes for `UserAuthenticity.tsx` layout patterns

**Documentation:**
- Added Quick Reference section with existing component patterns
- Documented which dependencies NOT to add (use existing instead)

---

### v3.0 (2025-11-16) - Initial Plan

**Original Metrics (Before v5.0 overhaul):**

**Activity:**
- Recent commits (40%)
- Consistency (30%)
- Diversity (30%)

**Impact:**
- Stars (35%)
- Forks (20%)
- Contributors (15%)
- Engagement (20%)
- External Usage (10%)

**Quality:**
- Originality (30%) ← Removed in v5.0
- Documentation (25%)
- Ownership (20%) ← Removed in v5.0
- Maturity (15%)
- Stack (10%)

**Growth:**
- Year-over-year changes only

**Timeline:** 14-19 days

---

**Last Updated:** 2025-11-17
**Version:** 5.0 (Major Metrics Overhaul)
**Status:** Ready for Implementation

**Next Action:** Begin Phase 0, Step 0.1 — Create Vercel Serverless Function
