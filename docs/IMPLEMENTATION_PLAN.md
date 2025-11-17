# GitHub User Analytics Dashboard — Implementation Plan

**Version:** 3.0
**Date:** 2025-11-16
**Status:** Ready for Development
**Framework:** Vite + React 19 (Current Stack)
**Backend:** Vercel Serverless Functions + Vercel KV

---

## 📋 Table of Contents

1. [⚠️ Current Security Status](#️-current-security-status-critical)
2. [📦 Current State Analysis](#-current-state-analysis)
   - [✅ Already Implemented (v1.0)](#-what-is-already-implemented-v10)
   - [❌ Needs to Be Built (v2.0)](#-what-needs-to-be-built-v20)
3. [Overview](#overview)
4. [MCP-Driven Development Process](#mcp-driven-development-process)
5. [Technology Stack](#technology-stack)
6. [Phase 0: Backend Security Layer](#phase-0-backend-security-layer-p0)
   - [Prerequisites](#prerequisites)
7. [Phase 1: GraphQL Extensions (Simplified)](#phase-1-graphql-extensions-simplified)
8. [Phase 1.5: Fraud Detection System 🆕](#phase-15-fraud-detection-system--new-phase)
9. [Phase 2: Metrics Calculation v2.0](#phase-2-metrics-calculation-v20)
10. [Phase 3: UI Components v2.0](#phase-3-ui-components-v20)
11. [Phase 4: Timeline Components ⏸️ DEFERRED](#phase-4-timeline-components-️-deferred-to-phase-7)
12. [Phase 5: Layout Refactoring](#phase-5-layout-refactoring-p1)
13. [Phase 5.5: OAuth Migration Strategy ⏸️ FUTURE](#phase-55-oauth-migration-strategy-️-future)
14. [Phase 6: Testing & Polish](#phase-6-testing--polish-p2)
15. [UI/UX Design Reference](#uiux-design-reference)
16. [Animations Strategy](#animations-strategy)
17. [🔄 Rollback Plan & Safety Mechanisms](#-rollback-plan--safety-mechanisms)
18. [⚡ Performance Targets & Monitoring](#-performance-targets--monitoring)
19. [Dependencies](#dependencies)
20. [Success Criteria](#success-criteria)

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

## Phase 1: GraphQL Enhancements for New Metrics

**Priority:** P0 (Critical)

**Time:** 2 days (simplified from original 3 days)

**Goal:** Extend existing `GET_USER_INFO` query with fields needed for Fraud Detection, Collaboration metrics, and Code Health

**Note:** ✅ **No new hook needed!** Current `useQueryUser()` already works perfectly. Just extend the GraphQL query with new fields.

---

### What NOT to Do (Simplification from Original Plan)

**❌ DO NOT create year-by-year queries** - Overkill for metrics, rate limit risk
**❌ DO NOT create useUserAnalytics hook** - Duplicates existing useQueryUser
**❌ DO NOT use Promise.all for parallel queries** - Can hit GitHub rate limits
**❌ DO NOT create generateYearRanges()** - Not needed for current metrics

**✅ DO use existing useQueryUser()** - Already fetches user, repos, contributions
**✅ DO extend GET_USER_INFO** - Add new fields to existing query
**✅ DO reuse date-helpers.ts** - getThreeYearRanges() is sufficient

---

### Step 1.1: Extend GET_USER_INFO Query

**Goal:** Add fields needed for Fraud Detection, Collaboration metrics, and Code Health

**File:** `src/apollo/queriers.ts` (existing file)

**Current query** (already exists):
```typescript
export const GET_USER_INFO = gql`
  query GetUser($login: String!, $from: DateTime!, $to: DateTime!, ...) {
    user(login: $login) {
      # Basic profile fields ✅ already fetched

      contributionsCollection(from: $from, to: $to) {
        totalCommitContributions ✅
        commitContributionsByRepository(maxRepositories: 100) {
          contributions {
            totalCount ✅
+           # 🆕 ADD for Fraud Detection:
+           occurredAt  # ← Commit timestamps for backdating detection
          }
          repository {
            name ✅
            # ...existing fields
          }
        }
      }

      repositories(first: 100, ownerAffiliations: OWNER) {
        nodes {
          # ...existing fields ✅
        }
      }
    }
  }
`;
```

**Extended query** (add these fields):

```diff
export const GET_USER_INFO = gql`
  query GetUser($login: String!, $from: DateTime!, $to: DateTime!,
                $year1From: DateTime!, $year1To: DateTime!,
                $year2From: DateTime!, $year2To: DateTime!,
                $year3From: DateTime!, $year3To: DateTime!) {
    user(login: $login) {
      id
      login
      name
      avatarUrl
      bio
      url
      location
+     createdAt  # 🆕 For backdating detection (commits before account creation)
      followers { totalCount }
      following { totalCount }

      contributionsCollection(from: $from, to: $to) {
        totalCommitContributions
        totalIssueContributions
        totalPullRequestContributions

+       # 🆕 ADD for Collaboration metrics:
+       pullRequestReviewContributions(first: 100) {
+         totalCount
+         nodes {
+           pullRequest {
+             title
+             repository { nameWithOwner }
+           }
+           occurredAt
+         }
+       }
+
+       issueContributions(first: 100) {
+         totalCount
+         nodes {
+           issue {
+             title
+             repository { nameWithOwner }
+             comments { totalCount }
+           }
+           occurredAt
+         }
+       }

        commitContributionsByRepository(maxRepositories: 100) {
          contributions {
            totalCount
+           # 🆕 ADD for Fraud Detection (backdating, temporal anomaly):
+           occurredAt  # Commit timestamps
          }
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

+           # 🆕 ADD for Code Throughput (Fraud Detection):
+           defaultBranchRef {
+             target {
+               ... on Commit {
+                 history(first: 100) {
+                   edges {
+                     node {
+                       additions       # Lines added
+                       deletions       # Lines deleted
+                       committedDate   # Commit timestamp
+                       authoredDate    # Author timestamp (can differ!)
+                       author {
+                         email
+                         user { login }
+                       }
+                     }
+                   }
+                 }
+               }
+             }
+           }
          }
        }
      }

      repositories(first: 100, ownerAffiliations: OWNER) {
        totalCount
        nodes {
          name
          owner { login }
          stargazerCount
          forkCount
          primaryLanguage { name }
          url
          description
          createdAt
          updatedAt
          pushedAt
          isFork
          isArchived
          isPrivate
          diskUsage

+         # 🆕 ADD for Code Health Detection:
+         object(expression: "HEAD:") {
+           ... on Tree {
+             entries {
+               name   # Check for .github/, test/, .eslintrc, etc.
+               type   # blob or tree
+             }
+           }
+         }

          # ...existing language stats
        }
      }
    }
  }
`;
```

**Key Fields Added:**

1. **For Fraud Detection (Phase 1.5):**
   - `user.createdAt` - Account creation date (detect backdating)
   - `contributions.occurredAt` - Commit timestamps
   - `commit.authoredDate` vs `commit.committedDate` - Detect timestamp manipulation
   - `commit.additions` / `commit.deletions` - Detect empty commits (0/0)
   - `repository.isFork` - Detect fork farming
   - `author.email` - Detect commit author patterns

2. **For Collaboration Metrics (Phase 2 - Activity v2.0):**
   - `pullRequestReviewContributions` - PR review activity
   - `issueContributions` - Issue discussions, comments

3. **For Code Health (Phase 2 - Quality v2.0):**
   - `object(expression: "HEAD:")` - Repository file tree
   - Check for: `.github/`, `test/`, `.eslintrc`, `tsconfig.json`, `README.md`, etc.

---

### Step 1.2: Update TypeScript Types

**File:** `src/apollo/github-api.types.ts` (existing file)

**Add new types:**

```typescript
export interface CommitNode {
  additions: number;
  deletions: number;
  committedDate: string;
  authoredDate: string;
  author: {
    email: string;
    user: {
      login: string;
    } | null;
  };
}

export interface PullRequestReviewContribution {
  pullRequest: {
    title: string;
    repository: {
      nameWithOwner: string;
    };
  };
  occurredAt: string;
}

export interface IssueContribution {
  issue: {
    title: string;
    repository: {
      nameWithOwner: string;
    };
    comments: {
      totalCount: number;
    };
  };
  occurredAt: string;
}

export interface RepositoryTreeEntry {
  name: string;
  type: 'blob' | 'tree';
}

// Extend existing User type:
export interface User {
  // ...existing fields
  createdAt: string; // 🆕 Add this
}

// Extend existing Repository type:
export interface Repository {
  // ...existing fields
  object?: {  // 🆕 Add this (optional because some repos might be empty)
    entries: RepositoryTreeEntry[];
  };
  defaultBranchRef?: {  // 🆕 Add this
    target: {
      history: {
        edges: Array<{
          node: CommitNode;
        }>;
      };
    };
  };
}

// Extend existing ContributionsCollection type:
export interface ContributionsCollection {
  // ...existing fields
  pullRequestReviewContributions: {  // 🆕 Add this
    totalCount: number;
    nodes: PullRequestReviewContribution[];
  };
  issueContributions: {  // 🆕 Add this
    totalCount: number;
    nodes: IssueContribution[];
  };
}
```

---

### Step 1.3: Verify useQueryUser() Compatibility

**Current hook:** `src/apollo/useQueryUser.ts` (already exists)

**Good news:** ✅ **No changes needed!** The hook already:
- Fetches user, repositories, contributions ✅
- Uses variables from `useMemo` ✅
- Has 3 time ranges (year1, year2, year3) ✅
- Works with Apollo cache ✅

**How new fields will work:**

```typescript
// Existing useQueryUser hook:
const { data, loading } = useQueryUser(username);

// New fields automatically available:
const fraud = detectFraudPatterns(
  data.user.createdAt,  // 🆕 New field
  data.commits  // Extract from defaultBranchRef.target.history
);

const activity = calculateActivityScore({
  codeChanges: data.commits,  // 🆕 additions + deletions
  prReviews: data.contributionsCollection.pullRequestReviewContributions,  // 🆕
  issues: data.contributionsCollection.issueContributions,  // 🆕
  // ...existing data
});

const quality = calculateQualityScore({
  hasCI: data.repositories.some(r => r.object?.entries.some(e => e.name === '.github')),  // 🆕
  hasTests: data.repositories.some(r => r.object?.entries.some(e => e.name === 'test')),  // 🆕
  // ...existing data
});
```

**Test compatibility:**

```bash
# 1. Update query in queriers.ts (add new fields)
# 2. Update types in github-api.types.ts
# 3. Run existing tests:
npm test src/apollo/useQueryUser.test.ts
# Should pass! Hook doesn't need changes, just returns more data now.

# 4. Test query manually (GraphiQL):
# Use GitHub GraphQL Explorer: https://docs.github.com/en/graphql/overview/explorer
# Paste updated GET_USER_INFO query
# Verify all new fields return data
```

---

### Deliverables

**Phase 1 Checklist:**
- [ ] `GET_USER_INFO` extended with new fields (see diff above)
- [ ] Types updated in `github-api.types.ts`
- [ ] Query tested manually in GraphiQL (https://docs.github.com/en/graphql/overview/explorer)
- [ ] Existing `useQueryUser` tests still pass ✅
- [ ] New fields accessible in components (verify with console.log)
- [ ] No breaking changes to existing functionality
- [ ] Documentation: Comment in code explaining why each field is added

**Time:** **2 days** (simplified from 3 days - no new hook, no year-by-year complexity)

**Success Criteria:**
- All new fields return valid data for test users (torvalds, tj, sindresorhus)
- `user.createdAt` exists and is ISO date string
- `pullRequestReviewContributions.totalCount` is number
- `commit.additions` and `commit.deletions` are numbers
- `repository.object.entries` contains file/folder names
- Existing tests pass (99.85% pass rate maintained)
- Query response time < 2s (same as current query)

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

## Phase 2: Metrics Calculation System v2.0

**Priority:** P0 (Critical)

**Time:** 5 days (increased from 2 days - more complex formulas)

**Dependencies:** Phase 1 (GraphQL enhancements), Phase 1.5 (Fraud Detection)

**Goal:** Implement 4 new metrics with v2.0 formulas + Overall Rank classification

**Note:** Use `src/lib/authenticity.ts` as the **perfect template**! It already has the exact pattern we need:
- 100-point scoring system ✅
- Component breakdown ✅
- Category/level labels ✅
- Metadata tracking ✅

---

### Metrics Overview (v1.0 vs v2.0)

| Metric | v1.0 Formula (OLD) | v2.0 Formula (NEW) | Key Changes |
|--------|-------------------|-------------------|-------------|
| **Activity** | Recent Commits (40) + Consistency (30) + Diversity (30) | **Code Throughput (35)** + Consistency & Rhythm (25) + **Collaboration (20)** + **Project Focus (20)** | ✅ Lines changed instead of commits<br>✅ PR reviews, issues<br>✅ Optimal repos: 2-5 |
| **Impact** | Stars (35) + Forks (20) + Contributors (15) + Reach (20) + Engagement (10) | Adoption Signal (40) + Community (30) + **Social Proof (log scale) (20)** + Package Stats (10) | ✅ Logarithmic stars (anti-fraud)<br>⚠️ Package stats deferred |
| **Quality** | **Originality (30)** + Docs (25) + **Ownership (20)** + Maturity (15) + Stack (10) | **Code Health (35)** + Docs (25) + **Maintenance (25)** + Architecture (15) | ✅ CI/CD, testing, linting detection<br>✅ Issue response time |
| **Growth** | YoY Activity (40) + Impact (30) + Skills (30) | Skill Expansion (40) + Project Evolution (30) + **Learning Patterns (30)** | ✅ Tutorial vs Production detection |

---

### Step 2.1: Activity Score v2.0 (2 days)

**File:** `src/lib/metrics/activity.ts`

**Formula:**
```
Activity Score (0-100) = Code Throughput (35) + Consistency & Rhythm (25) +
                         Collaboration (20) + Project Focus (20)
```

**Implementation:**

```typescript
import type { User, Repository, ContributionsCollection, CommitNode } from '@/apollo/github-api.types';

export interface ActivityScore {
  score: number; // 0-100
  level: 'Very Low' | 'Low' | 'Moderate' | 'High' | 'Very High';
  breakdown: {
    codeThroughput: number;      // 0-35 points
    consistencyRhythm: number;   // 0-25 points
    collaboration: number;       // 0-20 points
    projectFocus: number;        // 0-20 points
  };
  details: {
    linesChanged: number;        // additions + deletions
    activeWeeks: number;         // weeks with commits
    prReviewsCount: number;      // PR reviews
    issuesCount: number;         // Issue contributions
    focusedReposCount: number;   // 2-5 = ideal
    totalRepos: number;          // all repos contributed to
  };
}

export function calculateActivityScore(
  user: User,
  repos: Repository[],
  contributions: ContributionsCollection,
  commits: CommitNode[]
): ActivityScore {
  // A. Code Throughput (0-35 points) - Lines changed, not commits!
  const linesChanged = commits.reduce((sum, c) => sum + c.additions + c.deletions, 0);
  const codeThroughput = Math.min((linesChanged / 10000) * 35, 35);
  // Benchmark: 10K+ lines = max points

  // B. Consistency & Rhythm (0-25 points)
  const activeWeeks = calculateActiveWeeks(commits);
  const consistencyRhythm = Math.min((activeWeeks / 52) * 25, 25);
  // Benchmark: 52 weeks (full year) = max points

  // C. Collaboration (0-20 points) - NEW!
  const prReviews = contributions.pullRequestReviewContributions.totalCount;
  const issues = contributions.issueContributions.totalCount;
  const collaborationCount = prReviews + issues;
  const collaboration = Math.min((collaborationCount / 50) * 20, 20);
  // Benchmark: 50+ contributions (reviews + issues) = max points

  // D. Project Focus (0-20 points) - NEW!
  const focusedRepos = repos.filter(r => !r.isFork).length;
  let projectFocus = 0;
  if (focusedRepos >= 2 && focusedRepos <= 5) projectFocus = 20; // Ideal: 2-5 repos
  else if (focusedRepos === 1) projectFocus = 15;                 // Single project
  else if (focusedRepos >= 6 && focusedRepos <= 10) projectFocus = 15; // Moderate
  else if (focusedRepos > 10) projectFocus = 10;                  // Too scattered
  // Benchmark: 2-5 original repos = optimal focus

  const totalScore = Math.round(codeThroughput + consistencyRhythm + collaboration + projectFocus);

  return {
    score: totalScore,
    level: getActivityLevel(totalScore),
    breakdown: {
      codeThroughput: Math.round(codeThroughput),
      consistencyRhythm: Math.round(consistencyRhythm),
      collaboration: Math.round(collaboration),
      projectFocus: Math.round(projectFocus),
    },
    details: {
      linesChanged,
      activeWeeks,
      prReviewsCount: prReviews,
      issuesCount: issues,
      focusedReposCount: focusedRepos,
      totalRepos: repos.length,
    },
  };
}

function calculateActiveWeeks(commits: CommitNode[]): number {
  const weekSet = new Set<string>();
  commits.forEach(c => {
    const date = new Date(c.committedDate);
    const weekKey = `${date.getFullYear()}-W${getWeekNumber(date)}`;
    weekSet.add(weekKey);
  });
  return weekSet.size;
}

function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}

function getActivityLevel(score: number): ActivityScore['level'] {
  if (score >= 80) return 'Very High';
  if (score >= 60) return 'High';
  if (score >= 40) return 'Moderate';
  if (score >= 20) return 'Low';
  return 'Very Low';
}
```

**Tests:** `src/lib/metrics/activity.test.ts`
- 15+ test cases covering all breakdowns
- Edge cases: 0 commits, 100K+ lines, 1 repo, 50+ repos
- Coverage target: **100%**

---

### Step 2.2: Impact Score v2.0 (1 day)

**File:** `src/lib/metrics/impact.ts`

**Formula:**
```
Impact Score (0-100) = Adoption Signal (40) + Community Engagement (30) +
                       Social Proof (20, log scale) + Package Stats (10, deferred)
```

**Implementation:**

```typescript
export interface ImpactScore {
  score: number; // 0-100
  level: 'Minimal' | 'Low' | 'Moderate' | 'Strong' | 'Significant';
  breakdown: {
    adoptionSignal: number;      // 0-40 points (forks)
    communityEngagement: number; // 0-30 points (external PRs, issues)
    socialProof: number;         // 0-20 points (stars, logarithmic)
    packageStats: number;        // 0-10 points (DEFERRED to Phase 7+)
  };
  details: {
    totalStars: number;
    totalForks: number;
    externalPRs: number;         // PRs from others
    externalIssues: number;      // Issues from others
    npmDownloads?: number;       // Phase 7+
  };
}

export function calculateImpactScore(
  repos: Repository[]
): ImpactScore {
  // A. Adoption Signal (0-40 points) - Forks matter more than stars!
  const totalForks = repos.reduce((sum, r) => sum + r.forkCount, 0);
  const adoptionSignal = Math.min((totalForks / 100) * 40, 40);
  // Benchmark: 100+ forks = max points

  // B. Community Engagement (0-30 points)
  // TODO: Need to fetch external PRs and issues from Phase 1 GraphQL data
  const communityEngagement = 0; // Placeholder

  // C. Social Proof (0-20 points) - LOGARITHMIC SCALE (anti-fraud)
  const totalStars = repos.reduce((sum, r) => sum + r.stargazerCount, 0);
  const socialProof = Math.min(Math.log10(totalStars + 1) * 3, 20);
  // Benchmark: 10K stars = log10(10000) * 3 = 12 points (not max!)
  // Benchmark: 100K stars = log10(100000) * 3 = 15 points
  // This penalizes star farming!

  // D. Package Stats (0-10 points) - DEFERRED to Phase 7+
  const packageStats = 0;

  const totalScore = Math.round(adoptionSignal + communityEngagement + socialProof + packageStats);

  return {
    score: totalScore,
    level: getImpactLevel(totalScore),
    breakdown: {
      adoptionSignal: Math.round(adoptionSignal),
      communityEngagement: Math.round(communityEngagement),
      socialProof: Math.round(socialProof),
      packageStats: Math.round(packageStats),
    },
    details: {
      totalStars,
      totalForks,
      externalPRs: 0, // TODO: Phase 7+
      externalIssues: 0, // TODO: Phase 7+
    },
  };
}

function getImpactLevel(score: number): ImpactScore['level'] {
  if (score >= 70) return 'Significant';
  if (score >= 50) return 'Strong';
  if (score >= 30) return 'Moderate';
  if (score >= 10) return 'Low';
  return 'Minimal';
}
```

**Why logarithmic stars?**
- Prevents gaming: 10K stars = 12 points, 100K stars = only 15 points
- Fraud detection: Star farms can't boost score linearly
- Focus on forks: Forks = real adoption (40 points max)

---

### Step 2.3: Quality Score v2.0 (2 days)

**File:** `src/lib/metrics/quality.ts`

**Formula:**
```
Quality Score (0-100) = Code Health Practices (35) + Documentation (25) +
                        Maintenance Signal (25) + Architecture (15)
```

**Implementation:**

```typescript
export interface QualityScore {
  score: number; // 0-100
  level: 'Poor' | 'Fair' | 'Good' | 'High' | 'Excellent';
  breakdown: {
    codeHealthPractices: number; // 0-35 points
    documentation: number;       // 0-25 points
    maintenanceSignal: number;   // 0-25 points
    architecture: number;        // 0-15 points
  };
  details: {
    hasCI: boolean;              // .github/workflows
    hasTesting: boolean;         // test/, __tests__
    hasLinting: boolean;         // .eslintrc, tsconfig.json
    readmeLength: number;        // chars
    hasContributing: boolean;    // CONTRIBUTING.md
    avgIssueResponseTime: number;// hours (Phase 7+)
    hasTypeScript: boolean;      // tsconfig.json
    hasModularStructure: boolean;// src/ folder structure
  };
}

export function calculateQualityScore(
  repos: Repository[]
): QualityScore {
  // A. Code Health Practices (0-35 points) - NEW!
  const healthScore = repos.reduce((sum, repo) => {
    let repoHealth = 0;
    const entries = repo.object?.entries || [];

    // CI/CD (12 points)
    if (entries.some(e => e.name === '.github')) repoHealth += 12;

    // Testing (12 points)
    if (entries.some(e => ['test', '__tests__', 'tests', 'spec'].includes(e.name))) {
      repoHealth += 12;
    }

    // Linting/TypeScript (11 points)
    if (entries.some(e => ['.eslintrc', '.eslintrc.js', 'tsconfig.json'].includes(e.name))) {
      repoHealth += 11;
    }

    return sum + repoHealth;
  }, 0);
  const codeHealthPractices = Math.min((healthScore / repos.length / 35) * 35, 35);

  // B. Documentation (0-25 points)
  const docsScore = repos.reduce((sum, repo) => {
    let repoDocsScore = 0;
    const entries = repo.object?.entries || [];

    // README.md (15 points)
    const hasReadme = entries.some(e => e.name.toLowerCase() === 'readme.md');
    if (hasReadme) {
      // TODO: Check README length from file content (Phase 7+)
      repoDocsScore += 15;
    }

    // CONTRIBUTING.md, docs/ (10 points)
    if (entries.some(e => ['CONTRIBUTING.md', 'docs', 'documentation'].includes(e.name))) {
      repoDocsScore += 10;
    }

    return sum + repoDocsScore;
  }, 0);
  const documentation = Math.min((docsScore / repos.length / 25) * 25, 25);

  // C. Maintenance Signal (0-25 points) - NEW!
  const recentlyUpdated = repos.filter(r => {
    const daysSinceUpdate = (Date.now() - new Date(r.pushedAt).getTime()) / (1000 * 60 * 60 * 24);
    return daysSinceUpdate < 90; // Updated in last 90 days
  }).length;
  const maintenanceSignal = Math.min((recentlyUpdated / repos.length) * 25, 25);

  // D. Architecture (0-15 points)
  const architectureScore = repos.reduce((sum, repo) => {
    let repoArchScore = 0;
    const entries = repo.object?.entries || [];

    // Modular structure (src/ folder) (8 points)
    if (entries.some(e => e.name === 'src')) repoArchScore += 8;

    // TypeScript (7 points)
    if (entries.some(e => e.name === 'tsconfig.json')) repoArchScore += 7;

    return sum + repoArchScore;
  }, 0);
  const architecture = Math.min((architectureScore / repos.length / 15) * 15, 15);

  const totalScore = Math.round(codeHealthPractices + documentation + maintenanceSignal + architecture);

  return {
    score: totalScore,
    level: getQualityLevel(totalScore),
    breakdown: {
      codeHealthPractices: Math.round(codeHealthPractices),
      documentation: Math.round(documentation),
      maintenanceSignal: Math.round(maintenanceSignal),
      architecture: Math.round(architecture),
    },
    details: {
      hasCI: repos.some(r => r.object?.entries.some(e => e.name === '.github')),
      hasTesting: repos.some(r => r.object?.entries.some(e => e.name === 'test')),
      hasLinting: repos.some(r => r.object?.entries.some(e => e.name === '.eslintrc')),
      readmeLength: 0, // TODO: Phase 7+
      hasContributing: repos.some(r => r.object?.entries.some(e => e.name === 'CONTRIBUTING.md')),
      avgIssueResponseTime: 0, // TODO: Phase 7+
      hasTypeScript: repos.some(r => r.object?.entries.some(e => e.name === 'tsconfig.json')),
      hasModularStructure: repos.some(r => r.object?.entries.some(e => e.name === 'src')),
    },
  };
}

function getQualityLevel(score: number): QualityScore['level'] {
  if (score >= 80) return 'Excellent';
  if (score >= 60) return 'High';
  if (score >= 40) return 'Good';
  if (score >= 20) return 'Fair';
  return 'Poor';
}
```

---

### Step 2.4: Growth Score v2.0 (1 day)

**File:** `src/lib/metrics/growth.ts`

**Formula:**
```
Growth Score (-100 to +100) = Skill Expansion (40) + Project Evolution (30) +
                              Learning Patterns (30)
```

**Implementation:**

```typescript
export interface GrowthScore {
  score: number; // -100 to +100
  trend: 'Declining' | 'Stagnant' | 'Steady' | 'Growing' | 'Accelerating';
  breakdown: {
    skillExpansion: number;      // -40 to +40 points
    projectEvolution: number;    // -30 to +30 points
    learningPatterns: number;    // -30 to +30 points
  };
  details: {
    newLanguagesCount: number;   // Last year vs previous
    projectMaturityGrowth: number; // Stars/forks growth
    tutorialRatio: number;       // Tutorial repos vs production (0-1)
    productionRatio: number;     // Production repos (0-1)
  };
}

export function calculateGrowthScore(
  currentYearRepos: Repository[],
  previousYearRepos: Repository[]
): GrowthScore {
  // A. Skill Expansion (−40 to +40 points)
  const currentLanguages = new Set(currentYearRepos.map(r => r.primaryLanguage?.name).filter(Boolean));
  const previousLanguages = new Set(previousYearRepos.map(r => r.primaryLanguage?.name).filter(Boolean));
  const newLanguages = [...currentLanguages].filter(l => !previousLanguages.has(l));
  const skillExpansion = Math.min(newLanguages.length * 10, 40);
  // Benchmark: 4+ new languages in a year = max points

  // B. Project Evolution (−30 to +30 points)
  const currentStars = currentYearRepos.reduce((sum, r) => sum + r.stargazerCount, 0);
  const previousStars = previousYearRepos.reduce((sum, r) => sum + r.stargazerCount, 0);
  const starGrowth = currentStars - previousStars;
  const projectEvolution = Math.min((starGrowth / 100) * 30, 30);
  // Benchmark: +100 stars in a year = max points

  // C. Learning Patterns (−30 to +30 points) - NEW!
  const tutorialPatterns = ['tutorial', 'learning', 'course', 'practice', 'example', 'clone'];
  const tutorialRepos = currentYearRepos.filter(r =>
    tutorialPatterns.some(p => r.name.toLowerCase().includes(p))
  ).length;
  const productionRepos = currentYearRepos.length - tutorialRepos;

  const tutorialRatio = tutorialRepos / currentYearRepos.length;
  const productionRatio = productionRepos / currentYearRepos.length;

  let learningPatterns = 0;
  if (tutorialRatio <= 0.2 && productionRatio >= 0.6) {
    learningPatterns = 30; // Ideal: 20% tutorials, 60%+ production
  } else if (tutorialRatio <= 0.4 && productionRatio >= 0.4) {
    learningPatterns = 20; // Good balance
  } else if (tutorialRatio > 0.6) {
    learningPatterns = -20; // Too many tutorials, not enough production
  }

  const totalScore = Math.round(skillExpansion + projectEvolution + learningPatterns);

  return {
    score: Math.max(-100, Math.min(100, totalScore)),
    trend: getGrowthTrend(totalScore),
    breakdown: {
      skillExpansion: Math.round(skillExpansion),
      projectEvolution: Math.round(projectEvolution),
      learningPatterns: Math.round(learningPatterns),
    },
    details: {
      newLanguagesCount: newLanguages.length,
      projectMaturityGrowth: starGrowth,
      tutorialRatio,
      productionRatio,
    },
  };
}

function getGrowthTrend(score: number): GrowthScore['trend'] {
  if (score >= 60) return 'Accelerating';
  if (score >= 30) return 'Growing';
  if (score >= 0) return 'Steady';
  if (score >= -30) return 'Stagnant';
  return 'Declining';
}
```

---

### Step 2.5: Overall Rank Classification (0.5 day) - NEW!

**File:** `src/lib/metrics/overall-rank.ts`

**Goal:** Classify developer based on all 4 metrics

**Ranks:**
- **Junior** (<30) - Entry level
- **Mid** (30-50) - Competent
- **Senior** (50-70) - High Quality (>60) + Impact (>40)
- **Staff** (70-85) - High Impact (>70)
- **Principal** (>85) - Very High Activity (>70) + Global Impact (>80)

**Implementation:**

```typescript
export type DeveloperRank = 'Junior' | 'Mid' | 'Senior' | 'Staff' | 'Principal';

export interface OverallRankResult {
  rank: DeveloperRank;
  overallScore: number; // 0-100 (weighted average)
  requirements: {
    met: string[];       // Requirements satisfied
    missing: string[];   // Requirements not met
  };
  nextRank?: {
    rank: DeveloperRank;
    requirements: string[];
  };
}

export function calculateOverallRank(
  activity: number,
  impact: number,
  quality: number,
  growth: number
): OverallRankResult {
  // Weighted average: Activity 30%, Impact 30%, Quality 25%, Growth 15%
  const overallScore = Math.round(
    activity * 0.30 +
    impact * 0.30 +
    quality * 0.25 +
    growth * 0.15
  );

  const met: string[] = [];
  const missing: string[] = [];

  // Principal (>85)
  if (overallScore > 85) {
    if (activity > 70) met.push('Very High Activity (>70)');
    else missing.push('Very High Activity (>70)');

    if (impact > 80) met.push('Global Impact (>80)');
    else missing.push('Global Impact (>80)');

    if (met.length === 2) {
      return { rank: 'Principal', overallScore, requirements: { met, missing } };
    }
  }

  // Staff (70-85)
  if (overallScore >= 70) {
    if (impact > 70) met.push('High Impact (>70)');
    else missing.push('High Impact (>70)');

    if (met.length >= 1) {
      return {
        rank: 'Staff',
        overallScore,
        requirements: { met, missing },
        nextRank: { rank: 'Principal', requirements: ['Very High Activity (>70)', 'Global Impact (>80)'] },
      };
    }
  }

  // Senior (50-70)
  if (overallScore >= 50) {
    if (quality > 60) met.push('High Quality (>60)');
    else missing.push('High Quality (>60)');

    if (impact > 40) met.push('Moderate Impact (>40)');
    else missing.push('Moderate Impact (>40)');

    return {
      rank: 'Senior',
      overallScore,
      requirements: { met, missing },
      nextRank: { rank: 'Staff', requirements: ['High Impact (>70)'] },
    };
  }

  // Mid (30-50)
  if (overallScore >= 30) {
    return {
      rank: 'Mid',
      overallScore,
      requirements: { met: [], missing: ['High Quality (>60)', 'Moderate Impact (>40)'] },
      nextRank: { rank: 'Senior', requirements: ['High Quality (>60)', 'Moderate Impact (>40)'] },
    };
  }

  // Junior (<30)
  return {
    rank: 'Junior',
    overallScore,
    requirements: { met: [], missing: ['Consistent Activity', 'Quality Code Practices'] },
    nextRank: { rank: 'Mid', requirements: ['Activity >40', 'Quality >30'] },
  };
}
```

---

### Deliverables

**Phase 2 Checklist:**
- [ ] `src/lib/metrics/activity.ts` - Activity Score v2.0 (100% coverage)
- [ ] `src/lib/metrics/impact.ts` - Impact Score v2.0 (100% coverage)
- [ ] `src/lib/metrics/quality.ts` - Quality Score v2.0 (100% coverage)
- [ ] `src/lib/metrics/growth.ts` - Growth Score v2.0 (100% coverage)
- [ ] `src/lib/metrics/overall-rank.ts` - Rank classification (100% coverage)
- [ ] `src/lib/metrics/activity.test.ts` - 15+ tests
- [ ] `src/lib/metrics/impact.test.ts` - 12+ tests
- [ ] `src/lib/metrics/quality.test.ts` - 18+ tests
- [ ] `src/lib/metrics/growth.test.ts` - 10+ tests
- [ ] `src/lib/metrics/overall-rank.test.ts` - 8+ tests
- [ ] Each metric follows `authenticity.ts` pattern ✅
- [ ] Reuses helpers from `statistics.ts` where applicable ✅
- [ ] Performance: each calculation <100ms ✅

**Time:** **5 days** (breakdown: 2 + 1 + 2 + 1 + 0.5 days)

**Success Criteria:**
- All 4 metrics calculate correctly for test users (torvalds, tj, sindresorhus)
- Logarithmic stars work: 10K stars ≠ 100K stars (anti-fraud)
- Code Health detection works: finds .github/, test/, .eslintrc
- Learning Patterns detection: identifies tutorial vs production repos
- Overall Rank classification accurate (Junior to Principal)
- 100% test coverage for all metrics
- Performance: <100ms per metric calculation

---

## Phase 3: UI Components v2.0 (P0)

**Priority:** P0 (Critical)

**Time:** 3 days (increased from 2 days for strict testing)

**Dependencies:** Phase 2 (Metrics v2.0 - all 4 metrics + Overall Rank)

**Goal:** Build 7 components with MANDATORY Component → Story → Test workflow

**Note:** Use `src/components/UserAuthenticity.tsx` as the **UI template**! It already has the exact card layout we need.

---

### Component Development Protocol (MANDATORY)

**⚠️ CRITICAL: For EVERY component in Phase 3, you MUST follow this exact order:**

1. ✅ **Component Implementation** (TypeScript)
   - Use TypeScript strict mode
   - Follow existing patterns from `UserAuthenticity.tsx`
   - Use shadcn/ui components (Card, Progress, Badge, Alert)
   - Add ARIA labels for accessibility
   - Time: 1-2 hours per component

2. ✅ **Storybook Stories** (MINIMUM 3 stories per component)
   - Story 1: Default state
   - Story 2: Loading state
   - Story 3: Error/Edge case state
   - Additional stories for variants
   - Add controls for props
   - Time: 30 minutes per component

3. ✅ **Build Storybook** (REQUIRED after every 2 components)
   ```bash
   npm run build-storybook
   # This creates storybook-static/index.json
   # Required for Storybook MCP to index component
   ```

4. ✅ **Unit Tests** (MINIMUM 10 tests per component)
   - Test all stories (if story renders, test should pass)
   - Test user interactions (clicks, inputs, form submissions)
   - Test edge cases (empty data, long text, etc.)
   - Coverage target: **90%+ for UI**, **100% for logic**
   - Time: 1 hour per component

5. ✅ **Verify Coverage**
   ```bash
   npm run test:coverage
   # Check coverage report for this component
   # Must meet targets before moving to next component
   ```

6. ✅ **MCP Verification** (Optional but recommended)
   - Query Storybook MCP: "Show me [ComponentName] component"
   - Verify component is indexed
   - Check documentation completeness

**❌ DO NOT proceed to next component until ALL 6 steps complete!**

This ensures:
- Quality code (100% logic coverage)
- No regressions (90%+ UI coverage)
- Documentation (Storybook stories)
- Accessibility (ARIA labels tested)

---

### Phase 3 Components (7 total)

**List of components to build:**
1. **FraudAlert** - Shows fraud detection results (5 stories: Clean, Low, Medium, High, Critical)
2. **ActivityMetricCard** - Activity Score v2.0 display (5 stories)
3. **ImpactMetricCard** - Impact Score v2.0 display (5 stories)
4. **QualityMetricCard** - Quality Score v2.0 display (5 stories)
5. **GrowthMetricCard** - Growth Score v2.0 display (5 stories, including Declining)
6. **OverallRankCard** - Developer rank classification (5 stories: Junior to Principal)
7. **QuickAssessment** - Integration component (3 stories)

---

### Timeline Breakdown (3 days total)

| Day | Components | Hours | Breakdown |
|-----|------------|-------|-----------|
| **Day 1** | FraudAlert + ActivityMetricCard | 7h | FraudAlert (2h impl + 0.5h story + 1h test) + ActivityMetricCard (2h impl + 0.5h story + 1h test) |
| **Day 2** | ImpactMetricCard + QualityMetricCard | 7h | Impact (1.5h + 0.5h + 1h) + Quality (1.5h + 0.5h + 1h) |
| **Day 3** | GrowthMetricCard + OverallRankCard + QuickAssessment | 8h | Growth (1.5h + 0.5h + 1h) + Rank (2h + 0.5h + 1h) + Quick (1.5h + 0.5h + 1h) |
| **TOTAL** | 7 components | 22h (~3 days) | Implementation: 12h, Stories: 3.5h, Tests: 7h |

---

### Storybook Build Checkpoints

**After every 2 components, run:**
```bash
npm run build-storybook
# Verify: storybook-static/index.json updated
# Verify: All stories render without errors
# Verify: No console errors in Storybook UI
```

**Checkpoints:**
1. After FraudAlert + ActivityMetricCard (Day 1)
2. After ImpactMetricCard + QualityMetricCard (Day 2)
3. After all 7 components (Day 3 end)

This ensures MCP can index components incrementally.

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

## Phase 4: Timeline Components ⏸️ DEFERRED to Phase 7+

**Status:** 🔄 **DEFERRED** (Not critical for MVP)

**Priority:** P3 (Optional - Future Enhancement)

**Why Deferred:**
- **Not MVP Critical**: Quick Assessment (Phases 0-3) provides core value without timeline
- **Requires Year-by-Year Data**: Needs alternative implementation from `docs/PHASE_1_ALTERNATIVE_YEAR_BY_YEAR.md`
- **High Development Cost**: 2 days for optional feature
- **User Feedback Needed**: Validate demand before building

**When to Implement:**
- ✅ After Phases 0-3, 5-6 complete and deployed
- ✅ User feedback requests historical timeline view
- ✅ Year-by-year GraphQL architecture approved (see PHASE_1_ALTERNATIVE_YEAR_BY_YEAR.md)
- ✅ Rate limit concerns resolved (OAuth or caching strategy)

**Note:** Implementation details preserved below for future reference. Reuses `RepositoryCard` for project display. Recharts already configured for mini-charts.

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

**Deliverables (Future Implementation):**
- [ ] ActivityTimeline component
- [ ] TimelineYear (collapsible with CSS transitions)
- [ ] YearExpandedView (reuses RepositoryCard)
- [ ] Smooth expand/collapse animation
- [ ] Stories + Tests (following Phase 3 MANDATORY protocol)
- [ ] Works with all account ages (2-10+ years)

**Estimated Time:** **2 days** (when implemented in Phase 7+)

**Dependencies:**
- Requires year-by-year GraphQL architecture (see `docs/PHASE_1_ALTERNATIVE_YEAR_BY_YEAR.md`)
- Requires `useUserAnalytics()` hook implementation
- Consider rate limit impact before implementing

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

## Phase 5.5: OAuth Migration Strategy ⏸️ FUTURE

**Status:** 🔄 **FUTURE** (Post-MVP Enhancement)

**Priority:** P2 (Important for Production Security)

**Goal:** Migrate from PAT (Personal Access Token) to GitHub OAuth App for secure, scalable authentication

### Why OAuth?

**Current Security Issues (PAT):**
- ❌ **Token in Bundle**: `VITE_GITHUB_TOKEN` embedded in client JavaScript (evidence: `grep "ghp_" dist/assets/*.js`)
- ❌ **Rate Limit Shared**: All users share same 5000 req/hour limit
- ❌ **No User Consent**: Users can't authenticate with their own GitHub account
- ❌ **Token Rotation**: Manual rotation required, no expiration mechanism

**OAuth Benefits:**
- ✅ **Secure Flow**: Token never exposed in client bundle
- ✅ **Per-User Rate Limit**: Each user gets 5000 req/hour (scalability!)
- ✅ **User Consent**: Users authenticate with GitHub login
- ✅ **Token Refresh**: Automatic token refresh with refresh tokens
- ✅ **Scopes Control**: Request only `read:user` scope (minimal permissions)

### Architecture Overview

**Components:**
1. **GitHub OAuth App** (created in GitHub Settings)
2. **Backend Proxy** (Vercel Functions - already in Phase 0!)
3. **OAuth Callback Route** (`/api/auth/callback`)
4. **Token Storage** (Vercel KV with expiration)
5. **Frontend OAuth Flow** (`useGitHubAuth` hook)

### Implementation Steps

#### Step 5.5.1: Create GitHub OAuth App

**Location:** https://github.com/settings/developers

**Settings:**
- **Application name:** "GitHub User Analytics"
- **Homepage URL:** `https://your-app.vercel.app`
- **Authorization callback URL:** `https://your-app.vercel.app/api/auth/callback`
- **Scopes:** `read:user` (read-only access to user profile)

**Outputs:**
- `GITHUB_CLIENT_ID` (public, safe to expose)
- `GITHUB_CLIENT_SECRET` (secret, store in Vercel env vars)

---

#### Step 5.5.2: Backend OAuth Endpoints

**File:** `api/auth/login.ts` (Vercel Function)

```typescript
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const clientId = process.env.GITHUB_CLIENT_ID
  const redirectUri = `${process.env.VERCEL_URL}/api/auth/callback`

  const githubAuthUrl = new URL('https://github.com/login/oauth/authorize')
  githubAuthUrl.searchParams.set('client_id', clientId)
  githubAuthUrl.searchParams.set('redirect_uri', redirectUri)
  githubAuthUrl.searchParams.set('scope', 'read:user')

  return NextResponse.redirect(githubAuthUrl.toString())
}
```

**File:** `api/auth/callback.ts` (Vercel Function)

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { kv } from '@vercel/kv'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')

  if (!code) {
    return NextResponse.json({ error: 'No code provided' }, { status: 400 })
  }

  // Exchange code for access token
  const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code,
    }),
  })

  const { access_token } = await tokenResponse.json()

  // Generate session ID
  const sessionId = crypto.randomUUID()

  // Store token in Vercel KV (expires in 7 days)
  await kv.set(`session:${sessionId}`, access_token, { ex: 604800 })

  // Redirect to frontend with session ID
  const frontendUrl = new URL('/', process.env.VERCEL_URL!)
  frontendUrl.searchParams.set('session', sessionId)

  return NextResponse.redirect(frontendUrl.toString())
}
```

**File:** `api/auth/logout.ts` (Vercel Function)

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { kv } from '@vercel/kv'

export async function POST(request: NextRequest) {
  const { sessionId } = await request.json()

  if (sessionId) {
    await kv.del(`session:${sessionId}`)
  }

  return NextResponse.json({ success: true })
}
```

---

#### Step 5.5.3: Update Backend Proxy (from Phase 0)

**File:** `api/graphql.ts` (updated)

```typescript
import { kv } from '@vercel/kv'

export async function POST(request: Request) {
  const sessionId = request.headers.get('X-Session-ID')

  if (!sessionId) {
    return new Response(
      JSON.stringify({ error: 'No session ID provided' }),
      { status: 401 }
    )
  }

  // Retrieve token from Vercel KV
  const token = await kv.get<string>(`session:${sessionId}`)

  if (!token) {
    return new Response(
      JSON.stringify({ error: 'Invalid or expired session' }),
      { status: 401 }
    )
  }

  const body = await request.json()

  const response = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`, // Use user's OAuth token
    },
    body: JSON.stringify(body),
  })

  // ... rest of proxy logic
}
```

---

#### Step 5.5.4: Frontend OAuth Hook

**File:** `src/hooks/useGitHubAuth.ts`

```typescript
import { useState, useEffect } from 'react'

interface AuthState {
  isAuthenticated: boolean
  sessionId: string | null
  loading: boolean
}

export function useGitHubAuth() {
  const [auth, setAuth] = useState<AuthState>({
    isAuthenticated: false,
    sessionId: null,
    loading: true,
  })

  useEffect(() => {
    // Check for session ID in URL (from OAuth callback)
    const urlParams = new URLSearchParams(window.location.search)
    const sessionId = urlParams.get('session')

    if (sessionId) {
      // Store session ID in localStorage
      localStorage.setItem('github_session', sessionId)

      // Remove from URL
      window.history.replaceState({}, '', window.location.pathname)

      setAuth({ isAuthenticated: true, sessionId, loading: false })
      return
    }

    // Check for existing session ID in localStorage
    const storedSessionId = localStorage.getItem('github_session')

    if (storedSessionId) {
      setAuth({ isAuthenticated: true, sessionId: storedSessionId, loading: false })
    } else {
      setAuth({ isAuthenticated: false, sessionId: null, loading: false })
    }
  }, [])

  const login = () => {
    window.location.href = '/api/auth/login'
  }

  const logout = async () => {
    if (auth.sessionId) {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: auth.sessionId }),
      })
    }

    localStorage.removeItem('github_session')
    setAuth({ isAuthenticated: false, sessionId: null, loading: false })
  }

  return { ...auth, login, logout }
}
```

---

#### Step 5.5.5: Update Apollo Client

**File:** `src/apollo/ApolloAppProvider.tsx` (updated)

```typescript
import { setContext } from '@apollo/client/link/context'

const authLink = setContext((_, { headers }) => {
  const sessionId = localStorage.getItem('github_session')

  return {
    headers: {
      ...headers,
      'X-Session-ID': sessionId || '', // Send session ID to backend proxy
    },
  }
})

const httpLink = createHttpLink({
  uri: '/api/graphql', // Use backend proxy (not GitHub API directly!)
})

const client = new ApolloClient({
  link: ApolloLink.from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache(),
})
```

---

#### Step 5.5.6: Login/Logout UI

**File:** `src/components/AuthButton.tsx`

```typescript
import { useGitHubAuth } from '@/hooks/useGitHubAuth'
import { Button } from '@/components/ui/button'
import { LogIn, LogOut } from 'lucide-react'

export function AuthButton() {
  const { isAuthenticated, loading, login, logout } = useGitHubAuth()

  if (loading) {
    return <Button disabled>Loading...</Button>
  }

  if (isAuthenticated) {
    return (
      <Button variant="outline" onClick={logout}>
        <LogOut className="mr-2 h-4 w-4" />
        Sign Out
      </Button>
    )
  }

  return (
    <Button onClick={login}>
      <LogIn className="mr-2 h-4 w-4" />
      Sign in with GitHub
    </Button>
  )
}
```

---

### Migration Timeline

**Phase 1: Preparation (Before MVP Launch)**
- ✅ Phase 0 backend proxy already includes infrastructure
- ✅ Vercel KV configured for token storage
- ⏸️ OAuth endpoints created but not deployed

**Phase 2: Soft Launch (MVP → First Users)**
- 🔄 Deploy OAuth endpoints (disabled by feature flag)
- 🔄 Test OAuth flow with small group of users
- 🔄 Monitor rate limits, token expiration, security

**Phase 3: Full Migration (After User Validation)**
- ✅ Enable OAuth by default
- ✅ Deprecate PAT fallback (remove `VITE_GITHUB_TOKEN`)
- ✅ Update documentation
- ✅ Security audit (penetration testing, token leakage checks)

### Rollback Strategy

**If OAuth fails:**
1. Disable OAuth feature flag → revert to PAT
2. Keep backend proxy active (still protects token)
3. Debug OAuth flow in staging environment
4. Re-enable when fixed

**PAT Fallback (Temporary):**
```typescript
const authLink = setContext((_, { headers }) => {
  const sessionId = localStorage.getItem('github_session')
  const patFallback = import.meta.env.VITE_GITHUB_TOKEN

  return {
    headers: {
      ...headers,
      'X-Session-ID': sessionId || '',
      'X-PAT-Fallback': !sessionId ? patFallback : '', // Only if no session
    },
  }
})
```

### Security Considerations

**OAuth Best Practices:**
- ✅ Use `state` parameter to prevent CSRF attacks
- ✅ Validate `redirect_uri` to prevent open redirects
- ✅ Store tokens server-side (Vercel KV), never in localStorage
- ✅ Use HTTPS only (Vercel enforces this)
- ✅ Set short token expiration (7 days)
- ✅ Implement token refresh flow (GitHub OAuth supports this)
- ✅ Rate limit callback endpoint to prevent brute force

**Token Storage:**
- ❌ **DO NOT** store access token in localStorage (XSS vulnerability)
- ✅ **DO** store session ID in localStorage (low security risk)
- ✅ **DO** store access token in Vercel KV (server-side, encrypted)
- ✅ **DO** set expiration on KV entries (auto-cleanup)

### Testing Checklist

**OAuth Flow:**
- [ ] User clicks "Sign in with GitHub"
- [ ] Redirects to GitHub authorization page
- [ ] User grants `read:user` permission
- [ ] GitHub redirects to `/api/auth/callback` with `code`
- [ ] Backend exchanges `code` for `access_token`
- [ ] Backend stores token in Vercel KV
- [ ] Backend redirects to frontend with `session` param
- [ ] Frontend stores session ID in localStorage
- [ ] Frontend makes GraphQL request with session ID
- [ ] Backend retrieves token from KV using session ID
- [ ] Backend proxies request to GitHub API with token
- [ ] User sees their GitHub profile data

**Error Scenarios:**
- [ ] Invalid `code` (expired, already used)
- [ ] Session ID not found in KV (expired)
- [ ] GitHub API returns 401 (token revoked)
- [ ] Network errors during OAuth flow
- [ ] User denies permission on GitHub

**Security Tests:**
- [ ] CSRF attack (invalid `state` parameter)
- [ ] Open redirect (manipulated `redirect_uri`)
- [ ] Token leakage (check client bundle for tokens)
- [ ] XSS attack (inject script to steal session ID)
- [ ] Rate limit enforcement (brute force callback endpoint)

### Dependencies

**Backend:**
- Vercel Functions (already in Phase 0)
- Vercel KV (already in Phase 0)
- `@vercel/kv` package (already installed)

**Frontend:**
- React 19 (already installed)
- Apollo Client 3.14.0 (already installed)
- No new dependencies required!

### Deliverables (Future Implementation)

- [ ] GitHub OAuth App created
- [ ] `api/auth/login.ts` endpoint
- [ ] `api/auth/callback.ts` endpoint
- [ ] `api/auth/logout.ts` endpoint
- [ ] `api/graphql.ts` updated (session-based auth)
- [ ] `useGitHubAuth` hook
- [ ] `AuthButton` component
- [ ] Apollo Client updated (X-Session-ID header)
- [ ] Tests: OAuth flow (E2E), error scenarios, security
- [ ] Documentation: OAuth setup guide for contributors
- [ ] Feature flag: `ENABLE_OAUTH` (Vercel env var)

**Estimated Time:** **3 days** (when implemented post-MVP)

**When to Implement:**
- ✅ After MVP deployed and validated with users
- ✅ Rate limit issues detected (PAT exhaustion)
- ✅ Security audit requires OAuth (best practice for production)
- ✅ User feedback requests "Sign in with GitHub" feature

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

## 🔄 Rollback Plan & Safety Mechanisms

**Purpose:** Ensure every phase can be safely reverted without breaking production or losing data.

### General Rollback Principles

**Git Strategy:**
- ✅ Create feature branch for each phase: `feature/phase-{N}-{name}`
- ✅ Commit frequently with atomic changes (1 feature = 1 commit)
- ✅ Tag before merging: `before-phase-{N}` (easy revert point)
- ✅ Use `git revert` instead of `git reset` (preserves history)
- ✅ Keep `main` branch always deployable

**Deployment Strategy:**
- ✅ Use Vercel preview deployments for testing (auto-generated per branch)
- ✅ Test rollback procedure in preview environment first
- ✅ Enable Vercel instant rollback (1-click revert to previous deployment)
- ✅ Monitor production for 24-48h after deployment (error logs, rate limits)

**Feature Flags (Recommended):**
```typescript
// src/config/features.ts
export const FEATURE_FLAGS = {
  FRAUD_DETECTION: import.meta.env.VITE_ENABLE_FRAUD_DETECTION === 'true',
  METRICS_V2: import.meta.env.VITE_ENABLE_METRICS_V2 === 'true',
  OAUTH: import.meta.env.VITE_ENABLE_OAUTH === 'true',
} as const

// Usage in components
import { FEATURE_FLAGS } from '@/config/features'

{FEATURE_FLAGS.FRAUD_DETECTION && <FraudAlert data={fraudData} />}
```

**Benefits:**
- Toggle features on/off without code deployment
- A/B testing (show old vs new metrics to different users)
- Gradual rollout (enable for 10% users, then 50%, then 100%)

---

### Phase-by-Phase Rollback

#### Phase 0: Backend Proxy & Token Security

**What Could Go Wrong:**
- Backend proxy fails (CORS, authentication errors)
- Vercel KV connection issues
- Rate limit exhaustion (backend API limits)
- Token leakage (environment variable misconfiguration)

**Rollback Steps:**
1. **Revert to Client-Side GraphQL**
   ```typescript
   // Switch Apollo Client back to direct GitHub API
   const httpLink = createHttpLink({
     uri: 'https://api.github.com/graphql', // Bypass proxy
   })
   ```
2. **Restore PAT in Environment**
   - Re-enable `VITE_GITHUB_TOKEN` in `.env.local`
   - Deploy with token (temporary security compromise)
3. **Monitor Rate Limits**
   - Check GitHub API quota: `curl -H "Authorization: token ghp_xxx" https://api.github.com/rate_limit`
   - If exhausted, wait 1 hour or use different token
4. **Verify Functionality**
   - Test user search (e2e/user-search.spec.ts)
   - Confirm no CORS errors in browser console

**Prevention:**
- Test backend proxy locally with `vercel dev` before deployment
- Set up Vercel KV in staging environment first
- Monitor Vercel logs: `vercel logs --follow`

---

#### Phase 1: GraphQL Extensions

**What Could Go Wrong:**
- Extended `GET_USER_INFO` query fails (syntax error, field not found)
- GitHub API rejects new fields (permissions, schema changes)
- Apollo cache conflicts (new fields not typed)

**Rollback Steps:**
1. **Revert Query to Original**
   ```typescript
   // src/apollo/queriers.ts
   // Remove new fields: repositories.languages, repositories.latestRelease
   export const GET_USER_INFO = gql`
     query GetUserInfo($login: String!) {
       user(login: $login) {
         # ... original fields only
       }
     }
   `
   ```
2. **Clear Apollo Cache**
   ```typescript
   await client.clearStore() // Force refetch with old schema
   ```
3. **Update TypeScript Types**
   - Revert `src/apollo/github-api.types.ts` to original
   - Run `npm run build` to catch type errors
4. **Test Existing Components**
   - Ensure UserProfile still renders (no missing fields)
   - Check for TypeScript errors: `npm run build`

**Prevention:**
- Test query in GitHub GraphQL Explorer first: https://docs.github.com/en/graphql/overview/explorer
- Use Apollo Client DevTools to inspect cache
- Add fallbacks for new fields: `user.repositories?.languages ?? []`

---

#### Phase 1.5: Fraud Detection System

**What Could Go Wrong:**
- False positives (legitimate users flagged as fraud)
- Performance degradation (complex fraud analysis slows down UI)
- User complaints (feel accused, don't understand scoring)

**Rollback Steps:**
1. **Disable Feature Flag**
   ```bash
   # Vercel environment variables
   VITE_ENABLE_FRAUD_DETECTION=false
   ```
2. **Hide FraudAlert Component**
   ```typescript
   // src/components/QuickAssessment.tsx
   import { FEATURE_FLAGS } from '@/config/features'

   {FEATURE_FLAGS.FRAUD_DETECTION && fraudScore > 30 && (
     <FraudAlert data={fraudData} />
   )}
   ```
3. **Remove from UI** (if flag not used)
   - Comment out `<FraudAlert />` in QuickAssessment component
   - Deploy updated version
4. **Monitor User Feedback**
   - Check support tickets, GitHub issues, social media
   - Adjust thresholds if too many false positives

**Prevention:**
- Set high threshold (50+ points) for MVP
- Add "Report False Positive" button in FraudAlert
- Display fraud detection as "Developer Activity Insights" (softer language)
- A/B test: show to 10% users first

---

#### Phase 2: Metrics Calculation v2.0

**What Could Go Wrong:**
- New formulas produce incorrect scores (bugs in calculation logic)
- Scores drastically different from v1.0 (user confusion)
- Performance issues (complex calculations slow down rendering)
- TypeScript errors (missing fields in GraphQL response)

**Rollback Steps:**
1. **Disable Metrics v2.0 Flag**
   ```bash
   VITE_ENABLE_METRICS_V2=false
   ```
2. **Restore Old Calculation Logic**
   ```typescript
   // src/lib/metrics.ts
   import { FEATURE_FLAGS } from '@/config/features'

   export function calculateActivityScore(data: UserData) {
     if (FEATURE_FLAGS.METRICS_V2) {
       return calculateActivityScoreV2(data) // New formula
     }
     return calculateActivityScoreV1(data) // Old formula (fallback)
   }
   ```
3. **Preserve Old Functions**
   - Keep v1.0 functions in codebase: `calculateActivityScoreV1`, `calculateImpactScoreV1`
   - Only switch to v2.0 after validation
4. **Re-run Tests**
   ```bash
   npm run test -- src/lib/metrics.test.ts
   ```

**Prevention:**
- Create `metrics-v1.ts` and `metrics-v2.ts` (separate files)
- Add unit tests comparing v1 vs v2 outputs for same user
- Display both scores side-by-side in dev mode (debugging)
- Gradual rollout: show v2 to 10% users, collect feedback

---

#### Phase 3: UI Components v2.0

**What Could Go Wrong:**
- Component crashes (runtime errors, null pointer exceptions)
- Visual bugs (broken layout, CSS conflicts)
- Storybook MCP indexing fails (build errors)
- Test failures (component doesn't match snapshots)

**Rollback Steps:**
1. **Revert Component Files**
   ```bash
   git revert HEAD~1 # Revert last commit (e.g., FraudAlert component)
   git push origin feature/phase-3-ui
   ```
2. **Remove Component Imports**
   ```typescript
   // src/components/QuickAssessment.tsx
   // Comment out new imports
   // import { FraudAlert } from './FraudAlert'
   // import { ActivityMetricCard } from './metrics/ActivityMetricCard'
   ```
3. **Rebuild Storybook**
   ```bash
   npm run build-storybook
   # Verify no build errors
   ```
4. **Re-run Tests**
   ```bash
   npm run test
   npm run test:e2e
   ```

**Prevention:**
- Follow MANDATORY Component → Story → Test workflow (Phase 3 protocol)
- Test component in isolation first (Storybook)
- Use React Error Boundaries to catch crashes:
   ```typescript
   <ErrorBoundary fallback={<div>Component failed to load</div>}>
     <FraudAlert data={fraudData} />
   </ErrorBoundary>
   ```
- Commit 1 component at a time (atomic commits)

---

#### Phase 5: Layout Refactoring

**What Could Go Wrong:**
- Tabs removal breaks navigation (users can't find features)
- Responsive layout broken (mobile view unusable)
- Performance regression (single-page scroll lags)

**Rollback Steps:**
1. **Restore Tabs Component**
   ```typescript
   // src/App.tsx
   import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'

   <Tabs defaultValue="profile">
     <TabsList>
       <TabsTrigger value="profile">Profile</TabsTrigger>
       <TabsTrigger value="stats">Stats</TabsTrigger>
     </TabsList>
     <TabsContent value="profile"><UserProfile /></TabsContent>
     <TabsContent value="stats"><QuickAssessment /></TabsContent>
   </Tabs>
   ```
2. **Revert Layout Changes**
   - Git checkout previous `App.tsx` version
   - Deploy with old layout
3. **Monitor User Behavior**
   - Check analytics: tab usage, scroll depth
   - Survey users: prefer tabs or single-page?

**Prevention:**
- A/B test layout change (50% users see tabs, 50% see single-page)
- Add "Switch to Tabs View" toggle (user preference)
- Test on mobile devices (iPhone, Android)

---

#### Phase 6: Testing & Polish

**What Could Go Wrong:**
- E2E tests fail in CI/CD (flaky tests, timing issues)
- Test coverage drops below target (90%+)
- Performance benchmarks fail (bundle size too large)

**Rollback Steps:**
1. **Disable Failing Tests** (temporary)
   ```typescript
   // e2e/user-analytics-flow.spec.ts
   test.skip('fraud detection appears for suspicious users', async ({ page }) => {
     // ... temporarily disabled
   })
   ```
2. **Revert Code Changes**
   - Identify commit that broke tests: `git bisect`
   - Revert that commit: `git revert <commit-hash>`
3. **Fix Tests in Separate Branch**
   - Create `fix/e2e-tests` branch
   - Debug and fix tests
   - Merge after validation

**Prevention:**
- Run tests locally before pushing: `npm run test:all`
- Use Playwright UI mode for debugging: `npm run test:e2e:ui`
- Add retry logic for flaky tests: `test.describe.configure({ retries: 2 })`

---

### Emergency Rollback (Production Down)

**Scenario:** Critical bug in production, app completely broken

**Immediate Actions (< 5 minutes):**

1. **Vercel Instant Rollback**
   - Go to Vercel Dashboard → Deployments
   - Find last working deployment (green checkmark)
   - Click "..." → "Promote to Production"
   - Confirm rollback (instant redeployment)

2. **Git Revert** (if Vercel unavailable)
   ```bash
   git revert HEAD # Revert last commit
   git push origin main --force-with-lease
   vercel --prod # Deploy previous version
   ```

3. **Disable Feature Flags** (fastest option)
   ```bash
   # Vercel environment variables
   VITE_ENABLE_FRAUD_DETECTION=false
   VITE_ENABLE_METRICS_V2=false
   VITE_ENABLE_OAUTH=false
   ```

**Post-Rollback Actions (< 1 hour):**

4. **Investigate Root Cause**
   - Check Vercel logs: `vercel logs --follow`
   - Check browser console errors (user reports)
   - Check GitHub API status: https://www.githubstatus.com/

5. **Create Hotfix Branch**
   ```bash
   git checkout -b hotfix/critical-bug main
   # Fix bug
   npm run test:all
   git commit -m "fix: resolve critical production bug"
   git push origin hotfix/critical-bug
   ```

6. **Deploy Hotfix**
   ```bash
   vercel --prod
   ```

7. **Post-Mortem** (within 24 hours)
   - Document what went wrong
   - Add test case to prevent recurrence
   - Update rollback plan if needed

---

### Monitoring & Alerts

**Set Up Alerts (Recommended):**

**Vercel Alerts:**
- Error rate > 5% (trigger: rollback)
- Build failures (trigger: investigate)
- Function timeout > 10s (trigger: optimize)

**GitHub API Rate Limit:**
```typescript
// src/apollo/errorLink.ts
if (graphQLErrors?.some(err => err.message.includes('rate limit'))) {
  toast.error('GitHub API rate limit reached. Try again in 1 hour.')
  // Send alert to Sentry/Slack
}
```

**Sentry Integration (Optional):**
```typescript
import * as Sentry from '@sentry/react'

Sentry.init({
  dsn: process.env.VITE_SENTRY_DSN,
  environment: process.env.NODE_ENV,
})

// Catch component errors
<Sentry.ErrorBoundary fallback={<ErrorFallback />}>
  <App />
</Sentry.ErrorBoundary>
```

---

### Rollback Testing Checklist

**Before Each Deployment:**
- [ ] Create git tag: `git tag before-phase-{N}`
- [ ] Test feature flag toggle (enable/disable works)
- [ ] Deploy to Vercel preview environment
- [ ] Test rollback procedure in preview
- [ ] Verify old version still works (no breaking changes)
- [ ] Check bundle size: `npm run build` (< 500KB gzip)
- [ ] Run full test suite: `npm run test:all`
- [ ] Monitor Vercel logs for 30 minutes after deployment

**Post-Deployment:**
- [ ] Monitor error logs for 24 hours
- [ ] Check user feedback (GitHub issues, support tickets)
- [ ] Verify rate limits not exhausted
- [ ] Confirm analytics data (user engagement, feature adoption)

---

### Summary

**Key Takeaways:**
- ✅ **Feature Flags**: Enable instant rollback without redeployment
- ✅ **Git Strategy**: Atomic commits, tags before merges, never force-push to main
- ✅ **Vercel Rollback**: 1-click instant revert to previous deployment
- ✅ **Gradual Rollout**: A/B test new features (10% → 50% → 100%)
- ✅ **Monitoring**: Set up alerts for errors, rate limits, performance

**Rollback Time Targets:**
- **Emergency Rollback** (production down): < 5 minutes (Vercel instant rollback)
- **Feature Rollback** (bugs, bad UX): < 30 minutes (disable feature flag)
- **Full Revert** (undo phase): < 2 hours (git revert + redeploy)

---

## ⚡ Performance Targets & Monitoring

**Purpose:** Define measurable performance goals and monitoring strategy for production readiness.

### Performance Targets

**Load Time (Initial Page Load):**
- ✅ **Target:** < 2 seconds (Time to Interactive)
- ✅ **Measured by:** Lighthouse Performance Score > 90
- ✅ **Current:** ~1.5s (base app, no user data)
- ⚠️ **After Phase 0-3:** Estimate 2.5-3s (GraphQL queries, metrics calculation)
- 🎯 **Optimization:** Code splitting, lazy loading, caching

**Bundle Size:**
- ✅ **Target:** < 500 KB (gzipped)
- ✅ **Current:** 141 KB gzipped (base app)
- ⚠️ **After Phase 0-3:** Estimate 200-250 KB (fraud detection, metrics, new components)
- 🎯 **Optimization:** Tree-shaking, dynamic imports, minimize dependencies

**GraphQL Query Performance:**
- ✅ **Target:** < 1 second (GET_USER_INFO query)
- ✅ **Current:** ~800ms (3-year data)
- ⚠️ **After Phase 1:** Estimate 1-1.5s (extended query with languages, commits)
- 🎯 **Optimization:** Apollo caching, parallel queries, pagination

**Metrics Calculation:**
- ✅ **Target:** < 500ms (Activity, Impact, Quality, Growth)
- ⚠️ **After Phase 2:** Estimate 300-500ms (complex formulas, fraud detection)
- 🎯 **Optimization:** Memoization, Web Workers for heavy calculations

**Component Render Time:**
- ✅ **Target:** < 100ms (per component render)
- ✅ **Current:** ~50ms (UserProfile, SearchForm)
- ⚠️ **After Phase 3:** Estimate 80-100ms (QuickAssessment with 7+ components)
- 🎯 **Optimization:** React.memo, useMemo, lazy rendering

**Rate Limits (GitHub API):**
- ✅ **Target:** < 50% of 5000 req/hour limit (2500 requests)
- ✅ **Current:** ~1 request per user search
- ⚠️ **After Phase 0-3:** Still ~1 request (GET_USER_INFO extended, but single query)
- 🎯 **Optimization:** Backend proxy caching (Vercel KV), request deduplication

---

### Monitoring Strategy

#### 1. Lighthouse CI (Automated Performance Testing)

**File:** `.github/workflows/lighthouse.yml`

```yaml
name: Lighthouse CI
on: [push, pull_request]

jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - name: Install dependencies
        run: npm ci
      - name: Build production
        run: npm run build
      - name: Run Lighthouse CI
        uses: treosh/lighthouse-ci-action@v11
        with:
          urls: http://localhost:5173
          uploadArtifacts: true
          budgetPath: ./lighthouse-budget.json
```

**File:** `lighthouse-budget.json`

```json
{
  "performance": 90,
  "accessibility": 95,
  "best-practices": 90,
  "seo": 90
}
```

---

#### 2. Web Vitals Monitoring

**Install:** `npm install web-vitals`

**File:** `src/lib/webVitals.ts`

```typescript
import { onCLS, onFID, onFCP, onLCP, onTTFB } from 'web-vitals'

function sendToAnalytics(metric: any) {
  const body = JSON.stringify({ name: metric.name, value: metric.value })
  if (navigator.sendBeacon) {
    navigator.sendBeacon('/api/analytics', body)
  }
}

export function reportWebVitals() {
  onCLS(sendToAnalytics) // Cumulative Layout Shift
  onFID(sendToAnalytics) // First Input Delay
  onLCP(sendToAnalytics) // Largest Contentful Paint
}
```

**Targets:**
- **LCP** (Largest Contentful Paint): < 2.5s ✅
- **FID** (First Input Delay): < 100ms ✅
- **CLS** (Cumulative Layout Shift): < 0.1 ✅

---

#### 3. Bundle Size Tracking

**Install:** `npm install -D rollup-plugin-visualizer`

**File:** `vite.config.ts`

```typescript
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
  plugins: [
    visualizer({
      filename: './dist/stats.html',
      gzipSize: true,
    }),
  ],
})
```

---

#### 4. Rate Limit Monitoring

**File:** `api/rate-limit-check.ts`

```typescript
export async function GET() {
  const token = process.env.GITHUB_TOKEN
  const response = await fetch('https://api.github.com/rate_limit', {
    headers: { Authorization: `Bearer ${token}` },
  })
  const data = await response.json()
  return Response.json({
    limit: data.rate.limit,
    remaining: data.rate.remaining,
    percentage: (data.rate.remaining / data.rate.limit) * 100,
  })
}
```

**Alerts:**
- Warning at < 50% (2500 requests)
- Critical at < 20% (1000 requests)

---

### Performance Optimization Techniques

#### Code Splitting

```typescript
import { lazy, Suspense } from 'react'

const QuickAssessment = lazy(() => import('@/components/QuickAssessment'))

<Suspense fallback={<LoadingSpinner />}>
  <QuickAssessment />
</Suspense>
```

#### Memoization

```typescript
const metrics = useMemo(() => ({
  activity: calculateActivityScore(data),
  impact: calculateImpactScore(data),
}), [data])
```

#### Request Deduplication

```typescript
// Apollo Client deduplicates identical in-flight requests automatically
```

---

### Performance Testing Checklist

**Before Each Release:**
- [ ] Run Lighthouse CI (score > 90)
- [ ] Check bundle size (< 500KB gzipped)
- [ ] Test on slow 3G network
- [ ] Verify rate limit usage (< 50%)
- [ ] Check Web Vitals (LCP < 2.5s, FID < 100ms)
- [ ] Profile React DevTools (no unnecessary re-renders)

---

### Performance Budget

**Hard Limits (Build Fails):**
- Bundle size: 500 KB (gzipped)
- Lighthouse Performance: 90+
- Lighthouse Accessibility: 95+

**Soft Limits (Warning):**
- Query time: 1 second
- Component render: 100ms
- Metrics calculation: 500ms

---

### Summary

**Key Metrics:**
- Load Time: < 2s
- Bundle Size: < 500 KB
- GraphQL Query: < 1s
- Rate Limit: < 50% usage

**Monitoring:**
- Lighthouse CI (automated)
- Web Vitals (real users)
- Bundle Analyzer
- Rate Limit dashboard

---

## Dependencies

**Last Audit:** 2025-11-17
**Security Status:** ✅ All dependencies up-to-date, no critical vulnerabilities
**Bundle Impact:** Current 141 KB (gzipped) → Estimated 200-250 KB after Phases 0-3

---

### Already Installed (Reuse) ✅

**Core Framework:**
```json
{
  "react": "19.0.0",              // Latest stable (Nov 2024)
  "react-dom": "19.0.0",
  "typescript": "5.8.3"            // Latest stable
}
```
**Bundle Impact:** 45 KB (core React, tree-shaken)

**Build Tools:**
```json
{
  "vite": "7.0.0",                // Latest major version
  "@vitejs/plugin-react": "latest"
}
```
**Bundle Impact:** 0 KB (dev-only)

**GraphQL & State:**
```json
{
  "@apollo/client": "3.14.0",     // Latest stable (Jan 2025)
  "graphql": "^16.8.0"            // Peer dependency
}
```
**Bundle Impact:** 35 KB (Apollo Client + GraphQL)
**Security:** ✅ No known vulnerabilities

**UI Library:**
```json
{
  "shadcn/ui": "latest",          // Component collection (New York style)
  "class-variance-authority": "^0.7.0",
  "clsx": "^2.1.0",
  "tailwindcss": "4.1.12",        // v4 stable (Nov 2024)
  "@tailwindcss/vite": "^4.1.0",
  "tailwind-merge": "^2.2.0",
  "lucide-react": "^0.344.0"      // Icon library
}
```
**Bundle Impact:** 25 KB (Tailwind runtime + shadcn components)

**Charts & Data Visualization:**
```json
{
  "recharts": "2.15.4"            // Latest stable
}
```
**Bundle Impact:** 30 KB (used in existing Statistics tab)
**Note:** Already configured, no additional setup needed

**Date Utilities:**
```json
{
  "date-fns": "4.1.0"             // Latest v4 stable
}
```
**Bundle Impact:** 5 KB (tree-shaken, only used functions imported)

**UI Enhancements:**
```json
{
  "sonner": "^1.4.0"              // Toast notifications (already used)
}
```
**Bundle Impact:** 3 KB

**Testing:**
```json
{
  "vitest": "latest",             // Unit tests
  "@testing-library/react": "latest",
  "@testing-library/jest-dom": "latest",
  "@playwright/test": "latest"    // E2E tests
}
```
**Bundle Impact:** 0 KB (dev-only)

**Storybook:**
```json
{
  "@storybook/react-vite": "^10.0.3",
  "@storybook/addon-docs": "^10.0.3",
  "@storybook/addon-a11y": "^10.0.3"
}
```
**Bundle Impact:** 0 KB (dev-only)

**Total Current Bundle:** ~141 KB (gzipped)

---

### Required (New) 🆕

**Phase 0: Backend Proxy:**
```json
{
  "@vercel/kv": "^3.0.0"          // Vercel KV for server-side caching
}
```
**Bundle Impact:** 0 KB (server-side only)
**Use Case:** Token storage (OAuth), GraphQL response caching (30 min TTL)
**Cost:** Free tier (3000 requests/day, 256 MB storage)

**Phase 2: Metrics Calculation (Optional Optimization):**
```json
{
  "lodash-es": "^4.17.21"         // Only if needed for metric calculations
}
```
**Bundle Impact:** 1-3 KB (tree-shaken, import only used functions)
**Alternative:** Use native JavaScript (prefer this to avoid dependency)
**Decision:** ❌ **NOT ADDING** - use native `Array.reduce()`, `Math.max()`, etc.

---

### Optional (Phase 5+) 🔄

**Phase 5: Modals & Animations (Optional):**
```json
{
  "framer-motion": "^11.0.0"      // AnimatePresence for modal transitions
}
```
**Bundle Impact:** ~15 KB (tree-shaken)
**Alternative:** CSS transitions (0 KB)
**Decision:** Add only if MetricExplanationModal requires advanced animations

**Phase 6: Performance Monitoring:**
```json
{
  "web-vitals": "^4.0.0",         // Core Web Vitals reporting
  "rollup-plugin-visualizer": "^5.12.0"  // Bundle size analysis (dev-only)
}
```
**Bundle Impact:** ~2 KB (web-vitals only)
**Use Case:** Track LCP, FID, CLS in production (send to analytics)

**Phase 5.5: OAuth (Future):**
```json
{
  // No new frontend dependencies!
  // OAuth handled server-side (Vercel Functions + KV)
}
```
**Bundle Impact:** 0 KB

---

### NOT Adding (Use Existing Instead) ❌

**Why We're Avoiding These:**

```json
{
  "vaul": "❌",                    // Drawer component
  // ✅ Alternative: Use shadcn Dialog component (already installed)

  "react-use-gesture": "❌",       // Touch gestures
  // ✅ Alternative: Native touch events (0 KB)

  "@tanstack/react-virtual": "❌", // Virtual scrolling
  // ✅ Alternative: Not needed for <100 repos (performance fine without it)

  "cmdk": "❌",                    // Command Palette (Cmd+K)
  // ✅ Alternative: Deferred to Phase 7+ (not MVP)

  "next.js": "❌",                 // Framework
  // ✅ Alternative: Staying on Vite (faster builds, simpler setup)

  "react-hook-form": "❌",         // Form library
  // ✅ Alternative: Use native <form> (only 1 input field - SearchForm)

  "zod": "❌",                     // Schema validation
  // ✅ Alternative: Manual validation (1 field: username length > 0)

  "zustand": "❌",                 // State management
  // ✅ Alternative: Apollo Client cache + React useState (no global state needed)

  "axios": "❌",                   // HTTP client
  // ✅ Alternative: Native fetch() + Apollo Client (GraphQL)

  "moment.js": "❌",               // Date library (DEPRECATED)
  // ✅ Alternative: date-fns (already installed, 80% smaller)

  "@sentry/react": "❌",           // Error tracking (Phase 6+, optional)
  // ✅ Alternative: Add only if production monitoring required
}
```

**Bundle Size Savings:** ~150 KB avoided by using existing solutions

---

### Dependency Audit & Security

**Last Checked:** 2025-11-17

**Security Vulnerabilities:**
```bash
npm audit
```
**Result:** ✅ **0 critical, 0 high, 0 moderate vulnerabilities**

**Outdated Packages:**
```bash
npm outdated
```
**Result:** ✅ All major dependencies up-to-date (React 19, Vite 7, TypeScript 5.8, Apollo 3.14)

**License Compliance:**
- All dependencies use MIT license (compatible with project)
- No GPL or restrictive licenses

**Dependency Tree Depth:**
```bash
npm ls --depth=0
```
**Result:** ✅ Shallow tree (< 50 direct dependencies)

---

### Bundle Size Projection

**Current (Base App):**
- Total: 466 KB (uncompressed)
- Gzipped: **141 KB** ✅
- Brotli: 128 KB

**After Phase 0 (Backend Proxy):**
- Total: 466 KB (no frontend changes)
- Gzipped: **141 KB** (0 KB added)

**After Phase 1 (GraphQL Extensions):**
- Total: 470 KB (+4 KB types)
- Gzipped: **143 KB** (+2 KB)

**After Phase 1.5 (Fraud Detection):**
- Total: 490 KB (+20 KB fraud logic + FraudAlert component)
- Gzipped: **155 KB** (+12 KB)

**After Phase 2 (Metrics v2.0):**
- Total: 520 KB (+30 KB metrics logic)
- Gzipped: **170 KB** (+15 KB)

**After Phase 3 (UI Components):**
- Total: 620 KB (+100 KB 7 new components)
- Gzipped: **200 KB** (+30 KB)

**After Phase 5 (framer-motion, optional):**
- Total: 670 KB (+50 KB animations)
- Gzipped: **215 KB** (+15 KB)

**After Phase 6 (web-vitals):**
- Total: 680 KB (+10 KB monitoring)
- Gzipped: **220 KB** (+5 KB)

**Final Projected Bundle:** ~220 KB (gzipped)
**Target:** < 500 KB (gzipped) ✅
**Status:** **Well within budget** (56% under target)

---

### Installation Commands

**Phase 0 (Backend):**
```bash
npm install @vercel/kv
```

**Phase 6 (Performance):**
```bash
npm install web-vitals
npm install -D rollup-plugin-visualizer
```

**Optional (Phase 5+):**
```bash
npm install framer-motion  # Only if advanced animations needed
```

---

### Dependency Management Best Practices

**Version Pinning:**
- ✅ Use exact versions in package.json (no `^` or `~`)
- ✅ Commit package-lock.json to git
- ✅ Run `npm ci` in CI/CD (not `npm install`)

**Security Updates:**
- 🔄 Run `npm audit` before each deployment
- 🔄 Update dependencies quarterly (check for breaking changes)
- 🔄 Subscribe to GitHub security advisories for critical packages

**Bundle Size Monitoring:**
- ✅ Run `npm run build` after adding dependencies
- ✅ Check `dist/` folder size (should be < 500 KB gzipped)
- ✅ Use rollup-plugin-visualizer to identify large dependencies

**Alternatives First:**
- ✅ Check existing codebase before adding new dependency
- ✅ Consider native JavaScript vs library (e.g., Array.reduce() vs lodash)
- ✅ Evaluate bundle size impact (< 10 KB acceptable, > 50 KB requires justification)

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
