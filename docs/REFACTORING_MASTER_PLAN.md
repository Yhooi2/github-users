# GitHub User Analytics — Refactoring Master Plan

**Version:** 5.0 Unified
**Date:** 2025-11-17
**Status:** Ready for Implementation
**Total Duration:** 14 days (6 phases)

---

## 📋 Quick Navigation

**Phase Documents:**
- [Phase 0: Backend Security Layer](./phases/phase-0-backend-security.md) — 2 days, P0 (Critical)
- [Phase 1: GraphQL Multi-Query Architecture](./phases/phase-1-graphql-multi-query.md) — 3 days, P0 (Critical)
- [Phase 2: Metrics Calculation System](./phases/phase-2-metrics-calculation.md) — 2 days, P0 (Critical)
- [Phase 3: Core Components](./phases/phase-3-core-components.md) — 2 days, P0 (Critical)
- [Phase 4: Timeline Components](./phases/phase-4-timeline-components.md) — 2 days, P1 (Important)
- [Phase 5: Layout Refactoring](./phases/phase-5-layout-refactoring.md) — 1 day, P1 (Important)
- [Phase 6: Testing & Polish](./phases/phase-6-testing-polish.md) — 2 days, P2 (Polish)

**Supporting Documents:**
- [Rollback Plan](./ROLLBACK_PLAN.md)
- [Performance Benchmarks](./PERFORMANCE_BENCHMARKS.md)
- [Deployment Strategy](./DEPLOYMENT_STRATEGY.md)
- [Metrics Explanation](./metrics-explanation.md)

**Test Documentation:**
- [Phase 0 Test Results](./PHASE_0_TEST_RESULTS.md) — Backend proxy security validation
- [Testing Philosophy](./REFACTORING_MASTER_PLAN.md#-testing-philosophy--principles) — Kent C. Dodds principles & Testing Trophy
- [Component Tests](../src/apollo/ApolloAppProvider.test.tsx) — Apollo Client error handling (13 tests)
- [Hook Tests](../src/hooks/useUserAnalytics.test.tsx) — Integration tests (5 tests)
- [Utility Tests](../src/lib/date-utils.test.ts) — Date utilities (21 tests)

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- GitHub Personal Access Token (see below)
- Vercel CLI (for local development): `npm i -g vercel`

### 1️⃣ GitHub Token Setup

**⚠️ IMPORTANT:** The token is stored server-side only. It will NEVER be exposed in the client bundle.

#### Step A: Create GitHub Personal Access Token

1. Go to [GitHub Settings → Developer Settings → Personal Access Tokens → Tokens (classic)](https://github.com/settings/tokens)
2. Click **"Generate new token (classic)"**
3. Set token name: `GitHub User Analytics`
4. Set expiration: **No expiration** (or custom)
5. Select scopes:
   - ✅ `read:user` - Read user profile data
   - ✅ `user:email` - Read email addresses (optional but recommended)
6. Click **"Generate token"**
7. **COPY THE TOKEN IMMEDIATELY** - you won't see it again!

#### Step B: Configure Token Locally

**Quick Setup:**
```bash
# Copy example file
cp .env.example .env.local

# Edit .env.local and add your token
# See .env.example for detailed instructions
```

**Option 1: For Vercel Dev (Recommended)**
```bash
# Create .env.local in project root
echo "GITHUB_TOKEN=ghp_your_token_here" > .env.local

# Start Vercel development server
vercel dev

# Open http://localhost:3000
```

**Option 2: For Vite Dev (Client-side only, not recommended for production)**
```bash
# Create .env.local in project root
echo "VITE_GITHUB_TOKEN=ghp_your_token_here" > .env.local

# Start Vite dev server
npm run dev

# Open http://localhost:5173
```

**⚠️ Security Note:**
- `GITHUB_TOKEN` = Backend only (secure, production-ready)
- `VITE_GITHUB_TOKEN` = Exposed in client bundle (dev only)

For production deployment, use backend token only!

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Run Tests

```bash
# Unit & Integration tests
npm test

# Watch mode
npm run test:ui

# Coverage report
npm run test:coverage

# E2E tests (Playwright)
npm run test:e2e

# Storybook
npm run storybook
```

### 4️⃣ Verify Phase 0 Security

```bash
# Run backend proxy tests
npm test -- ApolloAppProvider.test.tsx

# Expected: 13/13 tests passing ✅
```

### 5️⃣ Deploy to Vercel

```bash
# Login to Vercel
vercel login

# Deploy to production
vercel --prod

# Add GITHUB_TOKEN in Vercel Dashboard:
# 1. Go to your project → Settings → Environment Variables
# 2. Add variable:
#    Name: GITHUB_TOKEN
#    Value: ghp_your_token_here
#    Environments: Production, Preview, Development
# 3. Redeploy to apply changes
```

### 6️⃣ Verify Production Deployment

1. Open deployed app URL
2. Search for any GitHub username
3. Open DevTools → Network tab
4. Verify request goes to `/api/github-proxy` (NOT `api.github.com`)
5. Open DevTools → Sources tab
6. Search for your token → Should find **0 results** ✅

---

## ⚠️ Critical Information

### 🔴 Security Status (UPDATED: 2025-11-17)

**Phase 0 Implementation:** ✅ **COMPLETED**

**Security Fixed:**
- ✅ Backend proxy implemented (`api/github-proxy.ts`)
- ✅ Token NOT exposed in client bundle (verified via build)
- ✅ Apollo Client updated to use proxy endpoint
- ✅ All tests passing (12/12)

**⚠️ REQUIRED BEFORE PHASE 1:**
1. **Local Testing:** Test with real GitHub token via `vercel dev`
2. **Production Deploy:** Deploy to Vercel and validate in production

**Details:** See [Phase 0 Test Results](./PHASE_0_TEST_RESULTS.md)

---

## 🎯 Project Overview

### What This Is

**Refactoring Plan** for existing production app (Phase 10 completed).
NOT a greenfield implementation!

**Goal:** Transform GitHub User Info into modern analytics dashboard with:
- 4 key metrics (Activity, Impact, Quality, Growth)
- Year-by-year timeline
- Progressive disclosure UI
- Production-ready security

### Current State (70% Ready)

**What Already Exists:**
- ✅ React 19 + Vite 7 + TypeScript 5.8.3
- ✅ Apollo Client 3.14.0 configured
- ✅ shadcn/ui (28+ components)
- ✅ Recharts 2.15.4
- ✅ 99.85% test pass rate (1302/1304 tests)
- ✅ Authenticity score (perfect template for new metrics!)
- ✅ UserAuthenticity component (perfect UI template!)

**What Needs Building (30%):**
- ✅ Backend proxy + token security **(Phase 0 - DONE)**
- ⏳ Local/production testing required before Phase 1
- 🆕 Year-by-year data fetching
- 🆕 4 new metrics (activity, impact, quality, growth)
- 🆕 QuickAssessment + Timeline components
- 🆕 Single-page layout (remove tabs)

---

## 🛠️ Technology Stack

### Existing (No Changes)
- **Framework:** Vite 7
- **Runtime:** React 19
- **Styling:** Tailwind CSS v4
- **State:** Apollo Client 3.14 (GraphQL)
- **UI:** shadcn/ui (New York style)
- **Testing:** Vitest + Playwright + Storybook

### New Additions
- **Backend:** Vercel Serverless Functions
- **Caching:** @vercel/kv (30 min TTL)
- **Animations:** CSS Transitions (95%) + Framer Motion (5%)

---

## 🧪 Testing Philosophy & Standards

> **Core Principle:** "The more your tests resemble the way your software is used, the more confidence they can give you." — Kent C. Dodds

### Quick Reference

**Testing Distribution:**
- 🏆 **Integration Tests:** 50% (best ROI)
- 📦 **Unit Tests:** 40% (fast feedback)
- 🌐 **E2E Tests:** 5% (critical flows)
- 🔍 **Static Analysis:** 5% (TypeScript, ESLint)

**Coverage Standards:**
- Lines: 85%+, Branches: 80%+, Functions: 85%+

**Test Command:**
```bash
npm test                    # Run all tests
npm run test:coverage       # Coverage report
npm run test:e2e           # E2E tests (Playwright)
```

**For Complete Testing Philosophy:**
See [Testing Guide](./testing-guide.md) for:
- Detailed principles (7 core principles)
- Testing Trophy explanation
- 5 testing patterns (Component, Logic, Apollo, Async, E2E)
- TDD workflow
- Anti-patterns to avoid
- Full examples and troubleshooting

---

## 🚫 What NOT to Change

### Keep These Components:
- ✅ UserAuthenticity (different purpose, valuable for fraud detection)
- ✅ RepositoryList/Table (working filters/sorting)
- ✅ RepositoryCard (enhance with badges, don't replace)
- ✅ UserHeader, UserStats (basic profile display)

### Keep These Patterns:
- ✅ **Component → Storybook → Test workflow** (STRICT ORDER - see below)
- ✅ Storybook MCP integration
- ✅ TypeScript strict mode
- ✅ Test coverage >90% standard

### Keep These as Templates:
- ✅ `src/lib/authenticity.ts` — Template for ALL new metric functions
- ✅ `src/components/UserAuthenticity.tsx` — Template for MetricCard
- ✅ `src/lib/statistics.ts` — Helper functions to reuse
- ✅ `src/apollo/date-helpers.ts` — Extend, don't replace

---

## 📊 Phase Timeline & Priorities

| Phase | Duration | Priority | Description |
|-------|----------|----------|-------------|
| **Phase 0** | 2 days | P0 🔴 | Backend proxy + token security (BLOCKS PRODUCTION) |
| **Phase 1** | 3 days | P0 🔴 | Year-by-year GraphQL queries |
| **Phase 2** | 2 days | P0 🔴 | Calculate 4 metrics |
| **Phase 3** | 2 days | P0 🔴 | MetricCard + QuickAssessment UI |
| **Phase 4** | 2 days | P1 🟡 | Timeline components |
| **Phase 5** | 1 day | P1 🟡 | Remove tabs, single-page layout |
| **Phase 6** | 2 days | P2 🟢 | E2E tests, accessibility, production |
| **TOTAL** | **14 days** | | |

**P0 = Critical** (must have), **P1 = Important** (should have), **P2 = Polish** (nice to have)

---

## 🎨 Development Philosophy (CRITICAL!)

### Component → Storybook → Test (STRICT ORDER)

**This project follows a MANDATORY development order:**

1. **Component First** — Write TypeScript component
2. **Storybook Second** — Create `.stories.tsx` with ALL states (loading, error, success, edge cases)
3. **Build Storybook** — Run `npm run build-storybook` (REQUIRED for MCP!)
4. **Test Last** — Write `.test.tsx` based on Storybook stories
5. **Run Tests** — Verify with `npm test`

**Why This Order?**
- ✅ Storybook serves as visual documentation AND test specification
- ✅ Stories define all component states before writing tests
- ✅ Forces thinking about edge cases upfront
- ✅ MCP integration requires built Storybook
- ✅ **Proven 99.85% test pass rate** (1302/1304 tests)

**NEVER skip Storybook!** Even for simple components.

**Details:** See [.claude/CLAUDE.md](../.claude/CLAUDE.md) for complete philosophy.

---

## 🔄 MCP-Driven Development Process

**After EVERY step:**
```
📝 PLAN → ⚡ EXECUTE → 🔍 MCP CHECK → 📊 UPDATE PLAN → ➡️ NEXT
```

**MCP Servers:**
- **Vercel:** Deployment, serverless functions
- **Context7:** Library documentation (Apollo, React)
- **shadcn:** UI component docs
- **Storybook:** Component catalog

**Note:** MCP checks are optional but recommended for quality.

---

## 🤖 Agent-Driven Development Workflow

### Available Agents

**Built-in Agents:**
- **Explore** (haiku) - Fast codebase exploration, file search, understanding
- **Plan** (sonnet) - Create detailed implementation plans and checklists
- **general-purpose** (sonnet) - Multi-step implementation tasks
- **debug-specialist** (sonnet) - Error investigation and fixing
- **test-runner-fixer** (sonnet) - Run tests and fix failures
- **code-review-specialist** (sonnet) - Code quality and security review
- **teaching-mentor** (sonnet) - Learning and guidance

### Recommended Workflow Per Phase

**1. Before Starting Phase:**
```bash
Explore agent:
"Study docs/phases/phase-N-name.md and find all files that need changes"
```

**2. Create Implementation Plan:**
```bash
Plan agent:
"Create detailed checklist for Phase N from docs/phases/phase-N-name.md"
```

**3. Implement Each Step:**
```bash
general-purpose agent:
"Implement Step N.X from docs/phases/phase-N-name.md"
```

**4. After Each Implementation:**
```bash
test-runner-fixer agent:
"Run tests for newly created code"

code-review-specialist agent:
"Review code against deliverables in docs/phases/phase-N-name.md"
```

**5. If Errors Occur:**
```bash
debug-specialist agent:
"Fix errors from test output"
```

### Example: Phase 1 Workflow

```bash
# Step 1: Explore
Explore agent → "Study phase-1-graphql-multi-query.md, find date-helpers.ts usage"

# Step 2: Plan
Plan agent → "Create checklist for Phase 1"

# Step 3: Implement
general-purpose agent → "Implement generateYearRanges() from Step 1.1"

# Step 4: Test
test-runner-fixer agent → "Run tests for date-utils.test.ts"

# Step 5: Review
code-review-specialist agent → "Review against Phase 1 deliverables"
```

### Benefits of Modular Structure for Agents

✅ **Small Context:** Each agent sees only one phase file (200-400 lines vs 2000+ lines)
✅ **Focused Task:** No distraction from other phases
✅ **Parallel Work:** Different agents can work on different phases simultaneously
✅ **Faster:** Less context = fewer tokens = faster responses
✅ **Cheaper:** Smaller context = lower API costs

---

## 📦 Dependencies

### Already Installed (Reuse)
```json
{
  "react": "19.2.0",
  "vite": "7.1.2",
  "@apollo/client": "3.14.0",
  "recharts": "2.15.4",
  "shadcn/ui": "latest"
}
```

### Required (New)
```json
{
  "@vercel/kv": "^3.0.0"
}
```

### Optional (Phase 5+)
```json
{
  "framer-motion": "^11.0.0"  // Only for modals, ~15KB
}
```

---

## ✅ Success Criteria

### Phase 0 (Backend) - ✅ Implementation Complete, ⏳ Testing Required
- [x] GitHub token secured on server (`api/github-proxy.ts`)
- [x] Token NOT visible in DevTools (verified via grep)
- [x] Vercel KV caching logic implemented
- [x] Apollo Client updated to use proxy
- [x] All unit tests passing (12/12)
- [ ] **🔴 REQUIRED:** Test with real token via `vercel dev`
- [ ] **🔴 REQUIRED:** Deploy to Vercel and validate production
- [ ] Verify caching works with real Vercel KV

### Phase 1 (Data) - ✅ Implementation Complete
- [x] Year-by-year data loads (account creation to now)
- [x] Owned repos separated from contributions
- [x] Parallel queries work (`Promise.all`)
- [x] Cache keys per year working
- [x] Date utilities created (`generateYearRanges`, `formatDate`)
- [x] GraphQL queries defined (`GET_USER_PROFILE`, `GET_YEAR_CONTRIBUTIONS`)
- [x] `useUserAnalytics` hook implemented with full type safety
- [x] All tests passing (26 tests: 21 date-utils + 5 useUserAnalytics)
- [x] Test coverage >90%

### Phase 2 (Metrics)
- [ ] All 4 metrics implemented
- [ ] Each follows `authenticity.ts` pattern
- [ ] 100% test coverage for calculations
- [ ] Benchmark labels correct

### Phase 3 (UI)
- [ ] MetricCard responsive
- [ ] QuickAssessment grid works (4 metrics)
- [ ] Storybook stories complete
- [ ] Accessibility: 0 errors

### Phase 4 (Timeline)
- [ ] Timeline renders all years
- [ ] Expand/collapse smooth (CSS)
- [ ] Visual bars proportional
- [ ] Reuses RepositoryCard

### Phase 5 (Layout)
- [ ] Tabs removed
- [ ] Single-page vertical scroll
- [ ] Owned vs Contributions split (👤 / 👥)
- [ ] Responsive (mobile/desktop)

### Phase 6 (Polish)
- [ ] E2E tests pass
- [ ] Accessibility: 0 errors (axe-core)
- [ ] Performance: LCP <2.5s, Bundle <500KB
- [ ] Coverage >95%
- [ ] Production deployed

---

## 🔄 Rollback Strategy

**General Principles:**
- Create feature branch for each phase: `feature/phase-{N}-{name}`
- Tag before merging: `before-phase-{N}`
- Use Vercel preview deployments for testing
- Enable instant rollback (1-click revert)
- Monitor production 24-48h after deployment

**Feature Flags:**
```typescript
// src/config/features.ts
export const FEATURE_FLAGS = {
  NEW_METRICS: import.meta.env.VITE_ENABLE_NEW_METRICS === 'true',
  TIMELINE_VIEW: import.meta.env.VITE_ENABLE_TIMELINE === 'true',
}
```

**Quick Rollback:**
```bash
# Vercel dashboard → Previous deployment → Promote
# Or: git revert + push
```

**Full Details:** [ROLLBACK_PLAN.md](./ROLLBACK_PLAN.md)

---

## ⚡ Performance Targets

| Metric | Target | Current | After Refactoring |
|--------|--------|---------|-------------------|
| **LCP** | <2.5s | 1.8s ✅ | 2.0s ✅ |
| **FID** | <100ms | 45ms ✅ | 50ms ✅ |
| **Bundle** | <500KB | 141KB ✅ | ~250KB ✅ |
| **API Queries** | <1s | ~800ms ✅ | <500ms (cached) ✅ |

**Full Details:** [PERFORMANCE_BENCHMARKS.md](./PERFORMANCE_BENCHMARKS.md)

---

## 📚 Additional Resources

**Project Documentation:**
- `.claude/CLAUDE.md` — Main development guide
- `docs/metrics-explanation.md` — Metrics v1.0 formulas
- `docs/DEPLOYMENT_STRATEGY.md` — 3-stage rollout plan

**External Links:**
- [GitHub GraphQL API](https://docs.github.com/en/graphql)
- [Vercel Functions](https://vercel.com/docs/functions)
- [Apollo Client](https://www.apollographql.com/docs/react/)
- [shadcn/ui](https://ui.shadcn.com/)

---

## 🚀 Getting Started

### ✅ Phase 0 Status: Implementation Complete

**Current State:**
- ✅ Backend proxy implemented and tested (unit tests)
- ✅ Security validated (no token in client bundle)
- ⏳ **Awaiting real-world testing before Phase 1**

**Next Steps (REQUIRED):**

#### Option A: Local Testing with Vercel Dev
```bash
# 1. Add your GitHub token to .env.local
GITHUB_TOKEN=ghp_your_actual_token_here

# 2. Start Vercel dev server
vercel dev

# 3. Test at http://localhost:3000
# - Search for a GitHub user
# - Check Network tab: /api/github-proxy should be called
# - Verify no direct calls to api.github.com
```

#### Option B: Production Deployment
```bash
# 1. Login to Vercel
vercel login

# 2. Deploy to production
vercel --prod

# 3. Add GITHUB_TOKEN in Vercel Dashboard
# Settings → Environment Variables → Add Variable

# 4. (Optional) Setup Vercel KV for caching
# Dashboard → Storage → KV → Create → Copy credentials

# 5. Test deployed app
# - Search for users
# - Check Vercel Function logs for cache HIT/SET
```

**After Testing Phase 0:**
1. Verify `/api/github-proxy` works correctly
2. Confirm token secured (not in DevTools → Sources)
3. Check caching (Vercel logs show HIT/SET messages)
4. Proceed to **Phase 1** → [GraphQL Multi-Query](./phases/phase-1-graphql-multi-query.md)

**Detailed Test Results:** See [PHASE_0_TEST_RESULTS.md](./PHASE_0_TEST_RESULTS.md)

---

**Last Updated:** 2025-11-17
**Maintained By:** Development Team
**Review After:** Each phase completion
