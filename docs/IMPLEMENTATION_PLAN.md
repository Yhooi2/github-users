# GitHub User Analytics Dashboard — Implementation Plan

**Version:** 3.0
**Date:** 2025-11-16
**Status:** Ready for Development
**Framework:** Vite + React 19 (Current Stack)
**Backend:** Vercel Serverless Functions + Vercel KV

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

## 📦 Current State Analysis

### ✅ What is Already Implemented (v1.0)

**Infrastructure (70% Ready):**
- ✅ Apollo Client 3.14.0 - **⚠️ INSECURE** (token in bundle, needs Phase 0 migration)
- ✅ React 19 + Vite 7 + TypeScript 5.8.3 - Production ready
- ✅ shadcn/ui (New York style) - **28+ components** documented in Storybook
- ✅ Recharts 2.15.4 - Chart infrastructure ready
- ✅ Testing infrastructure - **99.85% pass rate** (1302/1304 tests)
- ✅ Storybook workflow - **Component → Story → Test** pattern established

**Existing Metrics System (v1.0):**
- ✅ **Authenticity Score** (`src/lib/authenticity.ts`) - **✨ PERFECT TEMPLATE for new metrics!**
  - 100-point scoring system ✅
  - Component breakdown (4 parts × 25 points) ✅
  - Category labels (High/Medium/Low/Suspicious) ✅
  - Warning flags array ✅
  - Metadata tracking ✅
- ✅ **UserAuthenticity Component** (`src/components/UserAuthenticity.tsx`) - **✨ UI template!**
  - Card layout with icon ✅
  - Score badge with color coding ✅
  - Progress bars for breakdown ✅
  - Alert for warning flags ✅

**Reusable Components:**
- ✅ `RepositoryCard` - Enhance with Owner/Contributor badges
- ✅ `Card, Progress, Badge, Button, Tooltip` - 28+ shadcn/ui components
- ✅ `ChartContainer` - Recharts wrapper ready
- ✅ `LoadingState, ErrorState, EmptyState` - UI states handled
- ✅ `StatsCard` - Icon + title + value pattern

**Reusable Functions:**
- ✅ `calculateLanguageStatistics()` - For Quality/Stack metric
- ✅ `getMostActiveRepositories()` - For top projects
- ✅ `formatNumber()`, `formatBytes()` - Display helpers
- ✅ `useQueryUser()` - **Works perfectly**, no need to replace!
- ✅ Date helpers (`getThreeYearRanges()`) - Extend with new ranges

### ❌ What Needs to Be Built (v2.0)

**Phase 0 - Security Fix (P0 - Critical):**
- 🆕 Backend Proxy (`/api/github-proxy`) - **Fixes token exposure vulnerability**
- 🆕 Vercel KV caching - 30-minute TTL for performance
- 🆕 Apollo Client migration - Point to proxy, remove authLink

**Phase 1 - GraphQL Enhancements (P0 - Critical):**
- 🆕 Extend `GET_USER_INFO` - Add fields for fraud detection, collaboration, code health
- 🆕 Update TypeScript types - New fields in `github-api.types.ts`
- ✅ Keep `useQueryUser()` - **No new hook needed!** (simplification from original plan)

**Phase 1.5 - Fraud Detection System (P0 - Critical) - 🆕 NEW PHASE!**
- 🆕 `fraud-detection.ts` - Multi-factor fraud scoring (0-100%)
- 🆕 Backdating detection - **Critical for GitHub farming**
- 🆕 Empty commits ratio - 30 points max
- 🆕 Temporal anomaly detection - 20 points max
- 🆕 Mass commits detection - 15 points max
- 🆕 Fork farming detection - 10 points max
- 🆕 `FraudAlert` component - Visual warning system
- 🆕 `useFraudDetection` hook - Integration with metrics

**Phase 2 - New Metrics v2.0 (P0 - Critical):**
- 🆕 **Activity Score v2.0** - Code Throughput (35) + Consistency (25) + Collaboration (20) + Project Focus (20)
- 🆕 **Impact Score v2.0** - Logarithmic stars (anti-fraud) + Community (30) + Social Proof (20)
- 🆕 **Quality Score v2.0** - Code Health (35) + Docs (25) + Maintenance (25) + Architecture (15)
- 🆕 **Growth Score v2.0** - Skill Expansion (40) + Project Evolution (30) + Learning Patterns (30)
- 🆕 **Overall Rank** - Junior/Mid/Senior/Staff/Principal classification

**Phase 3 - UI Components (P0 - Critical):**
- 🆕 `FraudAlert` - 5 stories (Clean, Low, Medium, High, Critical)
- 🆕 `ActivityMetricCard` - 5 stories + 12+ tests
- 🆕 `ImpactMetricCard` - 5 stories + 10+ tests
- 🆕 `QualityMetricCard` - 5 stories + 10+ tests
- 🆕 `GrowthMetricCard` - 5 stories (including Declining trend)
- 🆕 `OverallRankCard` - 5 stories (Junior to Principal)
- 🆕 `QuickAssessment` - Integration component

**Phase 4 - Timeline (P1 - Important) - ⚠️ DEFERRED to Phase 7+:**
- ⏸️ `ActivityTimeline` - Optional feature, not critical for MVP
- ⏸️ `TimelineYear` - Deferred based on user feedback
- ⏸️ `YearExpandedView` - Can add later without breaking changes

**Phase 5.5 - OAuth Migration (P3 - Future):**
- 📝 Documentation only - Migration strategy when traffic > 1000 users/day
- 📝 Backward compatibility plan - Keep proxy as fallback
- 📝 Rollback criteria - Conversion rate, error rate monitoring

### 📊 Reusability Impact

**Infrastructure Ready:**
- 70% of codebase infrastructure ready (Apollo, shadcn/ui, testing, Storybook)
- Authenticity Score = **perfect template** for 4 new metrics (saves ~3 days)
- UserAuthenticity Component = **perfect UI template** (saves ~2 days)
- 28+ shadcn/ui components = **no new UI library needed** (saves ~1 day)

**Updated Timeline:**
| Phase | Original Estimate | Updated (with Fraud Detection) | Notes |
|-------|-------------------|-------------------------------|-------|
| Phase 0 | 2-3 days | **2 days** | Apollo setup exists |
| Phase 1 | 3-5 days | **2 days** | Simplified (no year-by-year, use existing useQueryUser) |
| Phase 1.5 | N/A | **2 days** | **🆕 NEW** - Fraud Detection (critical feature) |
| Phase 2 | 2-3 days | **5 days** | New metrics v2.0 (more complex formulas) |
| Phase 3 | 2-3 days | **3 days** | 7 components with strict Component → Story → Test |
| Phase 4 | 2-3 days | **Deferred** | Timeline moved to Phase 7+ (optional) |
| Phase 5 | 1-2 days | **1 day** | Simple layout refactor |
| Phase 6 | 2-3 days | **2 days** | Test patterns known |
| **TOTAL** | **14-19 days** | **17 days** | **+3 days for Fraud Detection (critical value)** |

**Key Changes from Original Plan:**
- ✅ Simplified Phase 1 (no useUserAnalytics, reuse useQueryUser) → **-1 day**
- 🆕 Added Phase 1.5 (Fraud Detection) → **+2 days**
- ✅ More realistic Phase 2 estimate (new formulas) → **+3 days**
- ✅ Strict testing in Phase 3 → **+1 day**
- ✅ Deferred Phase 4 (Timeline) → **-2 days**
- **Net:** 17 days (more realistic, includes critical Fraud Detection)

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

## ⚠️ Current Security Status (CRITICAL)

### 🔴 CRITICAL: Token Exposure in Client Bundle

**Current Implementation (INSECURE):**
```typescript
// src/apollo/ApolloAppProvider.tsx - CURRENT STATE
const authLink = setContext((_, { headers }) => {
  const token = import.meta.env.VITE_GITHUB_TOKEN || // ← EXPOSED IN BUNDLE!
                localStorage.getItem('github_token');
  // ...
});
```

**Evidence of Security Risk:**
```bash
npm run build
grep -r "ghp_" dist/assets/*.js  # ← Token found in plain text!

# DevTools → Network → Headers
# Authorization: Bearer ghp_xxxxxxxxxxxxxxxxxxxx  ← Visible to anyone!
```

**Impact:**
- ❌ **Anyone can steal token from bundle** (View Source → Search "ghp_")
- ❌ **Rate limit exhaustion risk** (5000 requests/hour shared across all users)
- ❌ **Security breach if token has extra scopes** (repo access, write permissions)
- ❌ **Cannot deploy to production** (major security vulnerability)

**Why This Happened:**
- Vite environment variables with `VITE_` prefix are bundled into client code
- This is by design for client-side config, but NOT for secrets
- Current implementation was acceptable for local development only

**Solution: Phase 0 (Backend Proxy) - MUST DO before production**
- Move token to server-side Vercel Function
- Client sends requests to `/api/github-proxy` (no token)
- Server adds token to GitHub API requests
- Token never leaves server environment

**Timeline:**
- Priority: **P0 (Critical)** - Blocks production deployment
- Time: 2 days
- Must complete before any production deploy

**Current Status:** ⚠️ Development only - DO NOT deploy to production

---

## Phase 0: Backend Security Layer

**Priority:** P0 (Critical)

**Goal:** Secure GitHub token on server, enable caching

**Note:** Apollo Client 3.14.0 is already configured with error handling, auth middleware, and InMemoryCache. We only need to redirect the URI to `/api/github-proxy`.

---

### Prerequisites (30 minutes setup)

**Before Starting Phase 0, you MUST have:**

**1. ✅ Vercel Account (Free Tier)**
- Create: https://vercel.com/signup
- Install CLI: `npm i -g vercel`
- Login: `vercel login`
- Verify: `vercel --version` (should show v33.0.0+)

**2. ✅ GitHub Personal Access Token**
- Generate: https://github.com/settings/tokens (classic token)
- Scopes required:
  - `read:user` - Read user profile data
  - `user:email` - Read user email addresses
  - `repo` (optional) - If you need private repo data
- Format: `ghp_xxxxxxxxxxxxxxxxxxxx` (40 characters)
- **⚠️ CRITICAL:** Never commit this token to git!

**3. ✅ Vercel KV Database**
- Dashboard → Storage → Create KV Database
- Name: `github-cache` (or any name you prefer)
- Region: Choose closest to your users
- Auto-configuration: Vercel adds environment variables automatically
- Variables added:
  - `KV_REST_API_URL`
  - `KV_REST_API_TOKEN`
  - `KV_REST_API_READ_ONLY_TOKEN`

**4. ✅ Environment Variables in Vercel**
- Dashboard → Your Project → Settings → Environment Variables
- Add `GITHUB_TOKEN`:
  - Name: `GITHUB_TOKEN`
  - Value: `ghp_your_token_here` (paste your PAT)
  - Environments: Production + Preview
  - **NOT** Development (use `.env.local` for local dev)
- KV credentials: Auto-added by Vercel KV (don't manually add)

**5. ✅ Local Environment Setup**
- Create `.env.local` (for local development):
  ```bash
  GITHUB_TOKEN=ghp_your_token_here

  # Pull from Vercel (after KV setup):
  vercel env pull .env.local
  # This adds KV_* variables for local testing
  ```
- Add to `.gitignore`:
  ```bash
  .env
  .env.local
  .env.*.local
  .vercel
  ```

**Verification Checklist:**

```bash
# 1. Vercel CLI installed
vercel --version  # v33.0.0+

# 2. Logged in
vercel whoami  # Shows your username

# 3. Environment variables pulled
cat .env.local  # Should show GITHUB_TOKEN and KV_* variables

# 4. GitHub token works
curl -H "Authorization: Bearer ghp_your_token" https://api.github.com/user
# Should return your GitHub user data

# 5. Vercel KV accessible
# (Will test in Step 0.1)
```

**Common Issues:**

| Issue | Solution |
|-------|----------|
| `vercel: command not found` | Install globally: `npm i -g vercel` |
| `KV_REST_API_URL not found` | Dashboard → Storage → Re-create KV, ensure auto-config enabled |
| `401 Unauthorized` (GitHub API) | Check `GITHUB_TOKEN` in Vercel Dashboard → Settings → Environment Variables |
| `Token in bundle warning` | Make sure token is in Vercel environment variables, NOT in `.env` with `VITE_` prefix |
| `vercel env pull` fails | Login first: `vercel login`, then link project: `vercel link` |

**Time Estimate:** 30 minutes (first time), 10 minutes (if Vercel account exists)

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

## Phase 1.5: Fraud Detection System (🆕 NEW PHASE!)

**Priority:** P0 (Critical)

**Time:** 2 days

**Dependencies:** Phase 1 (GraphQL enhancements)

**Goal:** Detect GitHub farming, backdating, empty commits, and bot patterns

---

### Why This is Critical

**GitHub Farming Problem:**
- Tools exist to generate fake commits (backdating tools, `git commit --date`)
- Farmers manipulate `GIT_AUTHOR_DATE` and `GIT_COMMITTER_DATE`
- Tutorial cloning creates fake activity without real learning
- Bot patterns (perfect daily commits at same time) mislead metrics
- Empty commits (`git commit --allow-empty`) inflate contribution graphs

**Our Solution:** Multi-factor fraud detection (0-100% fraud score)

**Detection Methods:**
1. **Backdating Score (25 points)** - **CRITICAL!**
   - Commits before account creation date
   - Future-dated commits
   - Timestamp manipulation patterns

2. **Empty Commits Ratio (30 points)**
   - Commits with 0 additions + 0 deletions
   - Threshold: >50% empty = suspicious

3. **Temporal Anomaly (20 points)**
   - Perfect daily patterns (bot-like behavior)
   - Commits at exactly same time every day
   - Sudden activity spikes (100+ commits in 1 hour)

4. **Mass Commits (15 points)**
   - >50 commits in single day multiple times
   - Farming pattern detection

5. **Fork Farming (10 points)**
   - Tutorial repos cloned >10 times
   - No original commits in forks
   - Fork-only activity

---

### Step 1.5.1: Type Definitions

**File:** `src/types/metrics.ts`

```typescript
export interface FraudDetectionResult {
  score: number; // 0-100, где 100 = 100% fraud suspicion
  level: 'Clean' | 'Low Risk' | 'Medium Risk' | 'High Risk' | 'Critical';
  flags: FraudFlag[];
  breakdown: {
    emptyCommitsRatio: number;      // 0-30 points
    backdatingScore: number;         // 0-25 points (CRITICAL!)
    temporalAnomalyScore: number;    // 0-20 points
    massCommitsRatio: number;        // 0-15 points
    forkFarmingScore: number;        // 0-10 points
  };
  metadata: {
    totalCommits: number;
    emptyCommits: number;
    backdatedCommits: number;
    massCommitDays: number;
    tutorialForks: number;
    accountCreatedAt: string;
    oldestCommitDate: string;
    newestCommitDate: string;
  };
}

export interface FraudFlag {
  type: 'empty_commits' | 'backdating' | 'temporal_anomaly' | 'mass_commits' | 'fork_farming';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  count?: number;
  details?: string;
}

export interface CommitData {
  authoredDate: string;
  committedDate: string;
  additions: number;
  deletions: number;
  repository: {
    name: string;
    isFork: boolean;
    owner: { login: string };
  };
}
```

---

### Step 1.5.2: Detection Logic

**File:** `src/lib/metrics/fraud-detection.ts`

```typescript
import { CommitData, FraudDetectionResult, FraudFlag } from '@/types/metrics';

export function detectFraudPatterns(
  accountCreatedAt: string,
  commits: CommitData[]
): FraudDetectionResult {
  if (!commits.length) {
    return createCleanResult();
  }

  const flags: FraudFlag[] = [];
  let fraudScore = 0;

  // 1. Empty Commits (0-30 points)
  const emptyCommits = commits.filter(c => c.additions === 0 && c.deletions === 0);
  const emptyRatio = emptyCommits.length / commits.length;
  const emptyScore = Math.min(emptyRatio * 30, 30);
  fraudScore += emptyScore;

  if (emptyRatio > 0.5) {
    flags.push({
      type: 'empty_commits',
      severity: emptyRatio > 0.8 ? 'critical' : 'high',
      message: `${(emptyRatio * 100).toFixed(0)}% of commits are empty (${emptyCommits.length}/${commits.length})`,
      count: emptyCommits.length,
    });
  }

  // 2. Backdating (0-25 points) - CRITICAL!
  const accountDate = new Date(accountCreatedAt);
  const backdatedCommits = commits.filter(c => {
    const commitDate = new Date(c.authoredDate);
    return commitDate < accountDate;
  });

  const backdatingScore = Math.min((backdatedCommits.length / commits.length) * 25, 25);
  fraudScore += backdatingScore;

  if (backdatedCommits.length > 0) {
    flags.push({
      type: 'backdating',
      severity: 'critical',
      message: `${backdatedCommits.length} commits dated before account creation (${accountDate.toISOString().split('T')[0]})`,
      count: backdatedCommits.length,
      details: `Oldest commit: ${new Date(Math.min(...backdatedCommits.map(c => new Date(c.authoredDate).getTime()))).toISOString().split('T')[0]}`,
    });
  }

  // 3. Temporal Anomaly (0-20 points)
  const hourMap = new Map<number, number>();
  commits.forEach(c => {
    const hour = new Date(c.committedDate).getHours();
    hourMap.set(hour, (hourMap.get(hour) || 0) + 1);
  });

  const maxHourCount = Math.max(...hourMap.values());
  const hourConcentration = maxHourCount / commits.length;

  let temporalScore = 0;
  if (hourConcentration > 0.7) {
    temporalScore = 20;
    flags.push({
      type: 'temporal_anomaly',
      severity: 'high',
      message: `${(hourConcentration * 100).toFixed(0)}% of commits at same hour (bot-like pattern)`,
    });
  } else if (hourConcentration > 0.5) {
    temporalScore = 10;
    flags.push({
      type: 'temporal_anomaly',
      severity: 'medium',
      message: `${(hourConcentration * 100).toFixed(0)}% of commits concentrated in one hour`,
    });
  }

  fraudScore += temporalScore;

  // 4. Mass Commits (0-15 points)
  const commitsByDay = new Map<string, number>();
  commits.forEach(c => {
    const day = c.committedDate.split('T')[0];
    commitsByDay.set(day, (commitsByDay.get(day) || 0) + 1);
  });

  const massCommitDays = Array.from(commitsByDay.values()).filter(count => count > 50).length;
  const massRatio = massCommitDays / commitsByDay.size;
  const massScore = Math.min(massRatio * 15, 15);
  fraudScore += massScore;

  if (massCommitDays > 0) {
    flags.push({
      type: 'mass_commits',
      severity: massCommitDays > 5 ? 'high' : 'medium',
      message: `${massCommitDays} days with >50 commits (farming pattern)`,
      count: massCommitDays,
    });
  }

  // 5. Fork Farming (0-10 points)
  const forkCommits = commits.filter(c => c.repository.isFork);
  const tutorialPatterns = ['tutorial', 'learning', 'course', 'practice', 'exercise'];
  const tutorialForks = forkCommits.filter(c =>
    tutorialPatterns.some(pattern => c.repository.name.toLowerCase().includes(pattern))
  );

  const forkRatio = forkCommits.length / commits.length;
  const forkScore = Math.min(forkRatio * 10, 10);
  fraudScore += forkScore;

  if (tutorialForks.length > 10) {
    flags.push({
      type: 'fork_farming',
      severity: tutorialForks.length > 50 ? 'high' : 'medium',
      message: `${tutorialForks.length} commits to tutorial/learning forks (low originality)`,
      count: tutorialForks.length,
    });
  }

  // Determine level
  const level = getFraudLevel(fraudScore);

  return {
    score: Math.round(fraudScore),
    level,
    flags,
    breakdown: {
      emptyCommitsRatio: Math.round(emptyScore),
      backdatingScore: Math.round(backdatingScore),
      temporalAnomalyScore: Math.round(temporalScore),
      massCommitsRatio: Math.round(massScore),
      forkFarmingScore: Math.round(forkScore),
    },
    metadata: {
      totalCommits: commits.length,
      emptyCommits: emptyCommits.length,
      backdatedCommits: backdatedCommits.length,
      massCommitDays,
      tutorialForks: tutorialForks.length,
      accountCreatedAt,
      oldestCommitDate: new Date(Math.min(...commits.map(c => new Date(c.authoredDate).getTime()))).toISOString(),
      newestCommitDate: new Date(Math.max(...commits.map(c => new Date(c.authoredDate).getTime()))).toISOString(),
    },
  };
}

function getFraudLevel(score: number): FraudDetectionResult['level'] {
  if (score >= 80) return 'Critical';
  if (score >= 60) return 'High Risk';
  if (score >= 40) return 'Medium Risk';
  if (score >= 20) return 'Low Risk';
  return 'Clean';
}

function createCleanResult(): FraudDetectionResult {
  return {
    score: 0,
    level: 'Clean',
    flags: [],
    breakdown: {
      emptyCommitsRatio: 0,
      backdatingScore: 0,
      temporalAnomalyScore: 0,
      massCommitsRatio: 0,
      forkFarmingScore: 0,
    },
    metadata: {
      totalCommits: 0,
      emptyCommits: 0,
      backdatedCommits: 0,
      massCommitDays: 0,
      tutorialForks: 0,
      accountCreatedAt: '',
      oldestCommitDate: '',
      newestCommitDate: '',
    },
  };
}
```

---

### Step 1.5.3: Component → Story → Test Workflow

**1. Component First**

**File:** `src/components/metrics/FraudAlert.tsx`

```typescript
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, CheckCircle, ShieldAlert } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { FraudDetectionResult } from '@/types/metrics';

interface FraudAlertProps {
  fraud: FraudDetectionResult;
}

export function FraudAlert({ fraud }: FraudAlertProps) {
  if (fraud.level === 'Clean') {
    return (
      <Alert variant="default" className="border-green-500 bg-green-50">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertTitle className="text-green-800">Clean Profile</AlertTitle>
        <AlertDescription className="text-green-700">
          No suspicious activity detected. This appears to be authentic GitHub activity.
        </AlertDescription>
      </Alert>
    );
  }

  const variant = fraud.level === 'Critical' || fraud.level === 'High Risk' ? 'destructive' : 'default';
  const icon = fraud.level === 'Critical' ? <ShieldAlert /> : <AlertCircle />;

  return (
    <Alert variant={variant}>
      {icon}
      <AlertTitle className="flex items-center gap-2">
        <span>⚠️ Suspicious Activity Detected</span>
        <Badge variant={variant}>{fraud.score}% fraud risk</Badge>
      </AlertTitle>
      <AlertDescription>
        <ul className="mt-2 space-y-1 text-sm">
          {fraud.flags.map((flag, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="text-red-500">•</span>
              <span>
                <strong>{flag.severity.toUpperCase()}:</strong> {flag.message}
                {flag.details && <span className="text-muted-foreground"> ({flag.details})</span>}
              </span>
            </li>
          ))}
        </ul>
      </AlertDescription>
    </Alert>
  );
}
```

**2. Storybook Story Second**

**File:** `src/components/metrics/FraudAlert.stories.tsx`

```typescript
import type { Meta, StoryObj } from '@storybook/react';
import { FraudAlert } from './FraudAlert';

const meta: Meta<typeof FraudAlert> = {
  title: 'Metrics/FraudAlert',
  component: FraudAlert,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof FraudAlert>;

export const Clean: Story = {
  args: {
    fraud: {
      score: 5,
      level: 'Clean',
      flags: [],
      breakdown: {
        emptyCommitsRatio: 2,
        backdatingScore: 0,
        temporalAnomalyScore: 3,
        massCommitsRatio: 0,
        forkFarmingScore: 0,
      },
      metadata: {
        totalCommits: 1000,
        emptyCommits: 10,
        backdatedCommits: 0,
        massCommitDays: 0,
        tutorialForks: 5,
        accountCreatedAt: '2020-01-01',
        oldestCommitDate: '2020-02-01',
        newestCommitDate: '2025-01-01',
      },
    },
  },
};

export const LowRisk: Story = {
  args: {
    fraud: {
      score: 25,
      level: 'Low Risk',
      flags: [
        {
          type: 'empty_commits',
          severity: 'low',
          message: '20% of commits are empty (200/1000)',
          count: 200,
        },
      ],
      breakdown: {
        emptyCommitsRatio: 20,
        backdatingScore: 0,
        temporalAnomalyScore: 5,
        massCommitsRatio: 0,
        forkFarmingScore: 0,
      },
      metadata: {
        totalCommits: 1000,
        emptyCommits: 200,
        backdatedCommits: 0,
        massCommitDays: 0,
        tutorialForks: 10,
        accountCreatedAt: '2020-01-01',
        oldestCommitDate: '2020-02-01',
        newestCommitDate: '2025-01-01',
      },
    },
  },
};

export const MediumRisk: Story = {
  args: {
    fraud: {
      score: 50,
      level: 'Medium Risk',
      flags: [
        {
          type: 'empty_commits',
          severity: 'medium',
          message: '50% of commits are empty (500/1000)',
          count: 500,
        },
        {
          type: 'temporal_anomaly',
          severity: 'medium',
          message: '60% of commits concentrated in one hour',
        },
      ],
      breakdown: {
        emptyCommitsRatio: 30,
        backdatingScore: 0,
        temporalAnomalyScore: 10,
        massCommitsRatio: 10,
        forkFarmingScore: 0,
      },
      metadata: {
        totalCommits: 1000,
        emptyCommits: 500,
        backdatedCommits: 0,
        massCommitDays: 3,
        tutorialForks: 15,
        accountCreatedAt: '2020-01-01',
        oldestCommitDate: '2020-02-01',
        newestCommitDate: '2025-01-01',
      },
    },
  },
};

export const HighRisk: Story = {
  args: {
    fraud: {
      score: 70,
      level: 'High Risk',
      flags: [
        {
          type: 'empty_commits',
          severity: 'high',
          message: '80% of commits are empty (800/1000)',
          count: 800,
        },
        {
          type: 'temporal_anomaly',
          severity: 'high',
          message: '75% of commits at same hour (bot-like pattern)',
        },
        {
          type: 'mass_commits',
          severity: 'high',
          message: '8 days with >50 commits (farming pattern)',
          count: 8,
        },
      ],
      breakdown: {
        emptyCommitsRatio: 30,
        backdatingScore: 15,
        temporalAnomalyScore: 20,
        massCommitsRatio: 5,
        forkFarmingScore: 0,
      },
      metadata: {
        totalCommits: 1000,
        emptyCommits: 800,
        backdatedCommits: 50,
        massCommitDays: 8,
        tutorialForks: 20,
        accountCreatedAt: '2020-01-01',
        oldestCommitDate: '2019-06-01',
        newestCommitDate: '2025-01-01',
      },
    },
  },
};

export const Critical: Story = {
  args: {
    fraud: {
      score: 95,
      level: 'Critical',
      flags: [
        {
          type: 'backdating',
          severity: 'critical',
          message: '200 commits dated before account creation (2020-01-01)',
          count: 200,
          details: 'Oldest commit: 2015-01-01',
        },
        {
          type: 'empty_commits',
          severity: 'critical',
          message: '90% of commits are empty (900/1000)',
          count: 900,
        },
        {
          type: 'temporal_anomaly',
          severity: 'high',
          message: '85% of commits at same hour (bot-like pattern)',
        },
        {
          type: 'mass_commits',
          severity: 'high',
          message: '15 days with >50 commits (farming pattern)',
          count: 15,
        },
        {
          type: 'fork_farming',
          severity: 'high',
          message: '100 commits to tutorial/learning forks (low originality)',
          count: 100,
        },
      ],
      breakdown: {
        emptyCommitsRatio: 30,
        backdatingScore: 25,
        temporalAnomalyScore: 20,
        massCommitsRatio: 15,
        forkFarmingScore: 5,
      },
      metadata: {
        totalCommits: 1000,
        emptyCommits: 900,
        backdatedCommits: 200,
        massCommitDays: 15,
        tutorialForks: 100,
        accountCreatedAt: '2020-01-01',
        oldestCommitDate: '2015-01-01',
        newestCommitDate: '2025-01-01',
      },
    },
  },
};
```

**3. Tests Third**

**File:** `src/components/metrics/FraudAlert.test.tsx`

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FraudAlert } from './FraudAlert';
import type { FraudDetectionResult } from '@/types/metrics';

describe('FraudAlert', () => {
  it('shows green checkmark for clean profile', () => {
    const fraud: FraudDetectionResult = {
      score: 5,
      level: 'Clean',
      flags: [],
      breakdown: {
        emptyCommitsRatio: 0,
        backdatingScore: 0,
        temporalAnomalyScore: 5,
        massCommitsRatio: 0,
        forkFarmingScore: 0,
      },
      metadata: {
        totalCommits: 100,
        emptyCommits: 0,
        backdatedCommits: 0,
        massCommitDays: 0,
        tutorialForks: 0,
        accountCreatedAt: '2020-01-01',
        oldestCommitDate: '2020-02-01',
        newestCommitDate: '2025-01-01',
      },
    };

    render(<FraudAlert fraud={fraud} />);
    expect(screen.getByText(/Clean Profile/i)).toBeInTheDocument();
    expect(screen.getByText(/No suspicious activity/i)).toBeInTheDocument();
  });

  it('shows critical alert for high fraud score', () => {
    const fraud: FraudDetectionResult = {
      score: 95,
      level: 'Critical',
      flags: [
        {
          type: 'backdating',
          severity: 'critical',
          message: 'Commits before account creation',
          count: 100,
        },
      ],
      breakdown: {
        emptyCommitsRatio: 30,
        backdatingScore: 25,
        temporalAnomalyScore: 20,
        massCommitsRatio: 15,
        forkFarmingScore: 5,
      },
      metadata: {
        totalCommits: 1000,
        emptyCommits: 900,
        backdatedCommits: 100,
        massCommitDays: 10,
        tutorialForks: 50,
        accountCreatedAt: '2020-01-01',
        oldestCommitDate: '2015-01-01',
        newestCommitDate: '2025-01-01',
      },
    };

    render(<FraudAlert fraud={fraud} />);
    expect(screen.getByText(/95% fraud risk/i)).toBeInTheDocument();
    expect(screen.getByText(/Commits before account creation/i)).toBeInTheDocument();
  });

  it('displays all fraud flags', () => {
    const fraud: FraudDetectionResult = {
      score: 70,
      level: 'High Risk',
      flags: [
        { type: 'empty_commits', severity: 'high', message: 'Flag 1' },
        { type: 'backdating', severity: 'critical', message: 'Flag 2' },
        { type: 'temporal_anomaly', severity: 'medium', message: 'Flag 3' },
      ],
      breakdown: {
        emptyCommitsRatio: 30,
        backdatingScore: 20,
        temporalAnomalyScore: 10,
        massCommitsRatio: 10,
        forkFarmingScore: 0,
      },
      metadata: {
        totalCommits: 1000,
        emptyCommits: 500,
        backdatedCommits: 50,
        massCommitDays: 5,
        tutorialForks: 10,
        accountCreatedAt: '2020-01-01',
        oldestCommitDate: '2019-01-01',
        newestCommitDate: '2025-01-01',
      },
    };

    render(<FraudAlert fraud={fraud} />);
    expect(screen.getByText(/Flag 1/i)).toBeInTheDocument();
    expect(screen.getByText(/Flag 2/i)).toBeInTheDocument();
    expect(screen.getByText(/Flag 3/i)).toBeInTheDocument();
  });

  it('uses destructive variant for critical level', () => {
    const fraud: FraudDetectionResult = {
      score: 90,
      level: 'Critical',
      flags: [],
      breakdown: {
        emptyCommitsRatio: 30,
        backdatingScore: 25,
        temporalAnomalyScore: 20,
        massCommitsRatio: 15,
        forkFarmingScore: 0,
      },
      metadata: {
        totalCommits: 1000,
        emptyCommits: 800,
        backdatedCommits: 100,
        massCommitDays: 10,
        tutorialForks: 20,
        accountCreatedAt: '2020-01-01',
        oldestCommitDate: '2015-01-01',
        newestCommitDate: '2025-01-01',
      },
    };

    const { container } = render(<FraudAlert fraud={fraud} />);
    // Check for destructive variant class or styling
    expect(container.querySelector('[role="alert"]')).toBeInTheDocument();
  });
});
```

**4. Build Storybook:**

```bash
npm run build-storybook  # Creates storybook-static/
# Storybook MCP can now index this component
```

**5. Coverage Target:**
- `fraud-detection.ts`: **100% coverage** (pure logic functions)
- `FraudAlert.tsx`: **90%+ coverage** (UI component)
- `useFraudDetection.ts`: **100% coverage** (hook logic)

---

### Step 1.5.4: Integration Hook

**File:** `src/hooks/useFraudDetection.ts`

```typescript
import { useMemo } from 'react';
import { detectFraudPatterns } from '@/lib/metrics/fraud-detection';
import type { FraudDetectionResult, CommitData } from '@/types/metrics';

interface UseFraudDetectionProps {
  accountCreatedAt: string;
  commits: CommitData[];
}

export function useFraudDetection({
  accountCreatedAt,
  commits,
}: UseFraudDetectionProps): FraudDetectionResult {
  return useMemo(() => {
    if (!accountCreatedAt || !commits.length) {
      return {
        score: 0,
        level: 'Clean',
        flags: [],
        breakdown: {
          emptyCommitsRatio: 0,
          backdatingScore: 0,
          temporalAnomalyScore: 0,
          massCommitsRatio: 0,
          forkFarmingScore: 0,
        },
        metadata: {
          totalCommits: 0,
          emptyCommits: 0,
          backdatedCommits: 0,
          massCommitDays: 0,
          tutorialForks: 0,
          accountCreatedAt: '',
          oldestCommitDate: '',
          newestCommitDate: '',
        },
      };
    }

    return detectFraudPatterns(accountCreatedAt, commits);
  }, [accountCreatedAt, commits]);
}
```

---

### Deliverables

**Phase 1.5 Checklist:**
- [ ] `src/types/metrics.ts` - Fraud types defined
- [ ] `src/lib/metrics/fraud-detection.ts` - Detection logic (100% test coverage)
- [ ] `src/lib/metrics/fraud-detection.test.ts` - 15+ test cases
- [ ] `src/components/metrics/FraudAlert.tsx` - UI component
- [ ] `src/components/metrics/FraudAlert.stories.tsx` - 5 stories (Clean, Low, Medium, High, Critical)
- [ ] `src/components/metrics/FraudAlert.test.tsx` - 10+ tests
- [ ] `src/hooks/useFraudDetection.ts` - Integration hook
- [ ] `src/hooks/useFraudDetection.test.ts` - Hook tests
- [ ] `npm run build-storybook` - Storybook indexed
- [ ] Coverage ≥90% for all files
- [ ] MCP verification (optional): "Show me FraudAlert component"

**Time:** 2 days

**Success Criteria:**
- All 5 fraud detection methods working (backdating, empty commits, temporal anomaly, mass commits, fork farming)
- FraudAlert renders correctly for all 5 levels (Clean to Critical)
- 100% test coverage for `fraud-detection.ts`
- All Storybook stories render without errors
- Integration with UserProfile component works

---

## Phase 2: Metrics Calculation System

**Priority:** P0 (Critical)

**Goal:** Calculate Activity, Impact, Quality, Growth scores

**Note:** Use `src/lib/authenticity.ts` as the **perfect template**! It already has the exact pattern we need:
- 100-point scoring system ✅
- Component breakdown ✅
- Category/level labels ✅
- Metadata tracking ✅

### Metric Formulas

See `docs/metrics-explanation.md` for detailed formulas.

**Summary:**
- **Activity (0-100%)** = Recent commits (40%) + Consistency (30%) + Diversity (30%)
- **Impact (0-100%)** = Stars (35%) + Forks (20%) + Contributors (15%) + Reach (20%) + Engagement (10%)
- **Quality (0-100%)** = Originality (30%) + Documentation (25%) + Ownership (20%) + Maturity (15%) + Stack (10%)
- **Growth (-100% to +100%)** = YoY change in Activity (40%) + Impact (30%) + Skills (30%)

### Reuse from Existing Code

**From `src/lib/statistics.ts`:**
- ✅ `calculateLanguageStatistics()` - For Quality Stack metric
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

// Apply same pattern to new metrics:
export interface ActivityMetric {
  score: number;              // 0-100
  level: string;              // Low/Moderate/High
  breakdown: {
    recentCommits: number;    // 0-40
    consistency: number;      // 0-30
    diversity: number;        // 0-30
  };
  details: { /* stats */ };
}
```

---

### Step 2.1: Activity Score

**File:** `src/lib/metrics/activity.ts`

```typescript
import { YearData } from '@/hooks/useUserAnalytics'

export function calculateActivityScore(timeline: YearData[]): number {
  if (!timeline.length) return 0

  const last3Months = getLastNMonths(timeline, 3)
  const last12Months = getLastNMonths(timeline, 12)

  // A. Recent commits (0-40 points)
  const recentCommits = last3Months.reduce((sum, d) => sum + d.totalCommits, 0)
  const recentPoints = Math.min((recentCommits / 200) * 40, 40)

  // B. Consistency (0-30 points)
  const activeMonths = countActiveMonths(last12Months)
  const consistencyPoints = Math.min((activeMonths / 12) * 30, 30)

  // C. Diversity (0-30 points)
  const uniqueRepos = countUniqueRepos(last3Months)
  let diversityPoints = 0
  if (uniqueRepos >= 1 && uniqueRepos <= 3) diversityPoints = 10
  else if (uniqueRepos >= 4 && uniqueRepos <= 7) diversityPoints = 20
  else if (uniqueRepos >= 8 && uniqueRepos <= 15) diversityPoints = 30
  else if (uniqueRepos > 15) diversityPoints = 25 // too scattered

  return Math.round(recentPoints + consistencyPoints + diversityPoints)
}

function getLastNMonths(timeline: YearData[], months: number) {
  // Implementation
}

function countActiveMonths(data: YearData[]) {
  // Implementation
}

function countUniqueRepos(data: YearData[]) {
  // Implementation
}

export function getActivityLabel(score: number): string {
  if (score >= 71) return 'High'
  if (score >= 41) return 'Moderate'
  return 'Low'
}
```

**Test:** 100% coverage required

---

### Step 2.2: Impact Score

**File:** `src/lib/metrics/impact.ts`

```typescript
export function calculateImpactScore(timeline: YearData[]): number {
  const allRepos = timeline.flatMap(y => [...y.ownedRepos, ...y.contributions])

  // A. Stars (0-35 points)
  const totalStars = allRepos.reduce((sum, r) => sum + r.repository.stargazerCount, 0)
  const starPoints = calculateStarPoints(totalStars)

  // B. Forks (0-20 points)
  const totalForks = allRepos.reduce((sum, r) => sum + r.repository.forkCount, 0)
  const forkPoints = calculateForkPoints(totalForks)

  // C. Contributors (0-15 points)
  // D. Reach (0-20 points)
  // E. Engagement (0-10 points)

  return Math.round(/* sum of all points */)
}
```

---

### Step 2.3: Quality & Growth

Similar implementations in:
- `src/lib/metrics/quality.ts`
- `src/lib/metrics/growth.ts`
- `src/lib/metrics/benchmark.ts` (ranges)

**Deliverables:**
- [ ] All 4 metrics implemented (activity, impact, quality, growth)
- [ ] 100% test coverage for all calculation functions
- [ ] Benchmark labels (Low/Moderate/High/etc) working
- [ ] Each metric follows `authenticity.ts` pattern
- [ ] Reuses helpers from `statistics.ts` where applicable

**Estimated Time:** **2 days** (reduced from 2-3 days - have perfect template in authenticity.ts)

---

## Phase 3: Core Components (P0)

**Priority:** P0 (Critical)

**Note:** Use `src/components/UserAuthenticity.tsx` as the **UI template**! It already has the exact card layout we need.

### Component Development Workflow

**For EVERY component:**

1. Check shadcn MCP for similar component
2. Write component with TypeScript
3. Write Storybook story (all states)
4. Build Storybook: `npm run build-storybook`
5. Write tests (based on stories)
6. Run tests: `npm test`
7. MCP Check (optional)
8. Document learnings

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

**Last Updated:** 2025-11-16
**Version:** 4.0 (Updated with current state analysis)
**Status:** Ready for Implementation

**Key Changes in v4.0:**
- Added Current State & Reusability Analysis (70% infrastructure ready)
- Added "What NOT to Change" section (preserve working components)
- Reduced estimates with reuse consideration (14 days vs 14-19 days)
- Added Migration Strategy options (Incremental vs Full Replacement)
- Referenced existing templates (authenticity.ts, UserAuthenticity.tsx)
- Documented already installed dependencies (no need to reinstall)

**Next Action:** Begin Phase 0, Step 0.1 — Create Vercel Serverless Function
