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

## 🧪 Testing Philosophy & Principles

> **Core Principle:** "The more your tests resemble the way your software is used, the more confidence they can give you." — Kent C. Dodds

### Philosophy

**Testing Trinity:**
```
Write tests. Not too many. Mostly integration.
```

Our testing approach balances three critical factors:
- **Confidence:** Tests give us certainty the app works as intended
- **Speed:** Fast feedback loops enable rapid development
- **Maintainability:** Tests don't become a burden to maintain

**Investment vs Return:**
- **Investment** = Time spent writing and maintaining tests
- **Return** = Confidence that code works as users expect

We optimize for **maximum confidence per hour invested**.

### Testing Levels

#### 🏆 Testing Trophy (Not Pyramid)

```
        /\
       /  \  E2E (5%)
      /____\
     /      \  Integration (50%)
    /________\
   /          \  Unit (40%)
  /____________\
 /              \ Static (5%)
/__________________\
```

**Why Trophy, Not Pyramid:**
- Integration tests give best ROI (confidence vs cost)
- E2E tests are expensive but catch critical user-facing bugs
- Unit tests are fast but limited in scope
- Static analysis (TypeScript, ESLint) catches bugs at compile time

**Our Distribution:**
- **Static Analysis:** TypeScript strict mode, ESLint (5%)
- **Unit Tests:** Business logic, utilities, hooks (40%)
- **Integration Tests:** Components with data fetching (50%)
- **E2E Tests:** Critical user flows (5%)

### Core Principles

#### 1. ✅ Test Behavior, Not Implementation

```typescript
// ❌ BAD: Tests implementation details
it('sets isLoading to true', () => {
  const { result } = renderHook(() => useState(false))
  act(() => result.current[1](true))
  expect(result.current[0]).toBe(true)
})

// ✅ GOOD: Tests user-visible behavior
it('shows loading spinner while fetching data', async () => {
  render(<UserProfile userName="octocat" />)
  expect(screen.getByText(/loading/i)).toBeInTheDocument()

  const userName = await screen.findByText('The Octocat')
  expect(userName).toBeInTheDocument()
})
```

**Why:** Implementation can change without breaking user experience. Tests should survive refactors.

#### 2. ✅ Query DOM Like Users Do

**Priority Order:**
```typescript
// 1. Accessible queries (BEST - how screen readers work)
screen.getByRole('button', { name: /search/i })
screen.getByLabelText(/username/i)

// 2. Semantic queries
screen.getByPlaceholderText(/search github user/i)
screen.getByText(/welcome/i)

// 3. Test IDs (LAST RESORT)
screen.getByTestId('user-profile')
```

**Why:** Users don't see test IDs. They see text, labels, and roles. Good tests enforce accessibility.

#### 3. ✅ Isolation & Independence

```typescript
describe('SearchForm', () => {
  beforeEach(() => {
    vi.clearAllMocks() // ✅ Clean slate for each test
  })

  afterEach(() => {
    vi.restoreAllMocks() // ✅ Restore original implementations
  })

  it('test 1', () => {
    // Independent test - doesn't affect test 2
  })

  it('test 2', () => {
    // Independent test - doesn't rely on test 1
  })
})
```

**Why:** Tests should pass/fail independently. Order shouldn't matter.

#### 4. ✅ Arrange-Act-Assert (AAA)

```typescript
it('calls setUserName on submit', async () => {
  // ✅ ARRANGE: Setup test data and render
  const user = userEvent.setup()
  const mockHandler = vi.fn()
  render(<SearchForm userName="" setUserName={mockHandler} />)

  // ✅ ACT: Perform user action
  const input = screen.getByPlaceholderText(/search/i)
  await user.type(input, 'octocat')
  await user.click(screen.getByRole('button', { name: /search/i }))

  // ✅ ASSERT: Verify expected outcome
  expect(mockHandler).toHaveBeenCalledWith('octocat')
  expect(mockHandler).toHaveBeenCalledTimes(1)
})
```

**Why:** Clear structure makes tests readable and maintainable.

#### 5. ✅ Test One Thing at a Time

```typescript
// ❌ BAD: Multiple concerns in one test
it('form works correctly', async () => {
  render(<SearchForm />)
  await userEvent.type(input, 'test')
  expect(input).toHaveValue('test')

  await userEvent.click(button)
  expect(mockSubmit).toHaveBeenCalled()

  await userEvent.clear(input)
  await userEvent.click(button)
  expect(toast.error).toHaveBeenCalled()
})

// ✅ GOOD: One test = one concern
it('updates input value when typing', async () => {
  // Tests ONLY input update
})

it('calls submit handler on button click', async () => {
  // Tests ONLY form submission
})

it('shows error for empty input', async () => {
  // Tests ONLY validation error
})
```

**Why:** When a test fails, you immediately know what broke.

#### 6. ✅ Descriptive Test Names

```typescript
// ❌ BAD
it('works', () => {})
it('test 1', () => {})

// ✅ GOOD
it('renders loading state when data is fetching', () => {})
it('calls setUserName with trimmed value on form submit', () => {})
it('shows validation error when input is empty', () => {})
it('handles leap year dates correctly', () => {})
```

**Why:** Test names are documentation. They explain expected behavior.

#### 7. ✅ Mock Only External Dependencies

```typescript
// ✅ Mock external libraries
vi.mock('sonner', () => ({
  toast: { error: vi.fn(), success: vi.fn() },
}))

// ✅ Mock custom hooks (for unit tests)
vi.mock('@/apollo/useQueryUser', () => ({
  default: vi.fn(),
}))

// ❌ DON'T mock internal components
// If you need to mock internal code, your architecture needs refactoring
```

**Why:** Mocking internal code defeats the purpose of integration tests.

### Testing Patterns

#### Pattern 1: Component Testing (Unit)

```typescript
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'

describe('SearchForm', () => {
  const mockSetUserName = vi.fn()
  const defaultProps = { userName: '', setUserName: mockSetUserName }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('updates input value when typing', async () => {
    const user = userEvent.setup()
    render(<SearchForm {...defaultProps} />)

    const input = screen.getByPlaceholderText(/Search GitHub User/i)
    await user.type(input, 'testuser')

    expect(input).toHaveValue('testuser')
  })
})
```

#### Pattern 2: Logic Testing (Unit)

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

  it('returns empty array for invalid date', () => {
    const ranges = generateYearRanges('invalid-date')
    expect(ranges).toEqual([])
  })
})
```

#### Pattern 3: Apollo Integration Testing

```typescript
import { MockedProvider } from '@apollo/client/testing'
import useQueryUser from '@/apollo/useQueryUser'

// Option A: Mock hook (RECOMMENDED for unit tests)
vi.mock('@/apollo/useQueryUser', () => ({
  default: vi.fn(),
}))

it('renders user data', () => {
  vi.mocked(useQueryUser).mockReturnValue({
    data: { user: { name: 'Octocat', login: 'octocat' } },
    loading: false,
    error: undefined,
  })

  render(
    <MockedProvider>
      <UserProfile userName="octocat" />
    </MockedProvider>
  )

  expect(screen.getByText('Octocat')).toBeInTheDocument()
})

// Option B: MockedProvider with mocks (for integration tests)
it('loads and displays user', async () => {
  const mocks = [{
    request: { query: GET_USER_QUERY, variables: { login: 'octocat' } },
    result: { data: { user: { name: 'Octocat' } } },
  }]

  render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <UserProfile userName="octocat" />
    </MockedProvider>
  )

  const userName = await screen.findByText('Octocat')
  expect(userName).toBeInTheDocument()
})
```

#### Pattern 4: Async Testing

```typescript
import { waitFor, waitForElementToBeRemoved } from '@testing-library/react'

it('loads data asynchronously', async () => {
  render(<UserProfile userName="octocat" />)

  // ✅ Wait for loading to disappear
  await waitForElementToBeRemoved(() => screen.queryByText(/loading/i))

  // ✅ Or use findBy (async by default)
  const userName = await screen.findByText('The Octocat')
  expect(userName).toBeInTheDocument()

  // ✅ Or use waitFor for complex conditions
  await waitFor(() => {
    expect(screen.getByText('Loaded')).toBeInTheDocument()
    expect(screen.queryByText('Loading')).not.toBeInTheDocument()
  })
})
```

#### Pattern 5: E2E Testing (Playwright)

```typescript
import { test, expect } from '@playwright/test'

test.describe('GitHub User Search', () => {
  test('should search for user and display profile', async ({ page }) => {
    // ✅ Navigate
    await page.goto('/')

    // ✅ Interact like a user
    await page.fill('input[placeholder*="Search GitHub User"]', 'octocat')
    await page.click('button[type="submit"]')

    // ✅ Verify outcome
    await expect(page.locator('text=The Octocat')).toBeVisible()
    await expect(page.locator('text=@octocat')).toBeVisible()
  })
})
```

### Coverage Standards

**Minimum Requirements:**
- **Lines:** 85%+
- **Branches:** 80%+
- **Functions:** 85%+
- **Statements:** 85%+

**What to Cover:**

✅ **MUST TEST:**
- Business logic (metrics calculations, data transformations)
- User interactions (clicks, typing, form submissions)
- Error handling (network errors, validation errors)
- Edge cases (empty arrays, null values, leap years)
- Accessibility (aria labels, keyboard navigation)

⚠️ **OPTIONAL:**
- Styling (use Storybook visual regression instead)
- Third-party libraries (already tested by maintainers)

❌ **DON'T TEST:**
- Constants (no logic to test)
- TypeScript types (compiler checks them)
- Mock data (no behavior to test)

### Test-Driven Development (TDD)

**For New Features (RECOMMENDED):**

```
1. RED: Write failing test
   ↓
2. GREEN: Make it pass (simplest solution)
   ↓
3. REFACTOR: Clean up code
   ↓
4. REPEAT
```

**Example:**
```typescript
// 1. RED: Write test first
it('calculates activity score correctly', () => {
  const repos = [createMockRepo({ commits: 500 })]
  const score = calculateActivityScore(repos)
  expect(score.score).toBe(75) // Test fails (function doesn't exist)
})

// 2. GREEN: Implement minimal solution
export function calculateActivityScore(repos) {
  return { score: 75 } // Hardcoded to pass
}

// 3. REFACTOR: Implement real logic
export function calculateActivityScore(repos) {
  const commits = repos.reduce((sum, r) => sum + r.commits, 0)
  return { score: Math.min(100, commits / 10) }
}
```

**Benefits:**
- Prevents over-engineering (YAGNI - You Aren't Gonna Need It)
- Ensures testable code architecture
- Documentation through tests

### Tools & Configuration

**Stack:**
- **Vitest 4.0.6** - Unit & Integration tests (faster than Jest)
- **Playwright 1.56.1** - E2E tests (3 browsers: chromium, firefox, webkit)
- **React Testing Library 16.1.0** - Component testing
- **@testing-library/user-event 14.6.2** - Realistic user interactions

**Configuration:**
```typescript
// vite.config.ts
export default defineConfig({
  test: {
    globals: true,              // describe, it, expect available globally
    environment: 'jsdom',       // DOM API for React
    setupFiles: ['./src/test/setup.ts'],
    exclude: ['node_modules/**', 'dist/**', 'e2e/**'],
    coverage: {
      provider: 'v8',           // Fast V8 coverage
      reporter: ['text', 'json', 'html'],
    },
  },
})
```

**Commands:**
```bash
# Unit & Integration
npm test                    # Run all tests
npm run test:watch          # Watch mode
npm run test:coverage       # Coverage report
npm run test:ui             # Vitest UI mode

# E2E
npm run test:e2e            # Playwright tests
npx playwright test --ui    # Playwright UI mode
npx playwright test --debug # Debug mode

# Single file
npm test SearchForm.test.tsx
npx playwright test user-search.spec.ts
```

### Refactoring Phase Requirements

**For EVERY Phase:**

1. **Before Implementation:**
   - Plan test cases
   - Identify edge cases
   - Decide unit vs integration

2. **During Implementation:**
   - Write test FIRST (TDD preferred)
   - Ensure test fails initially (RED)
   - Implement minimal solution (GREEN)
   - Refactor (REFACTOR)

3. **After Implementation:**
   - Run full test suite: `npm test`
   - Check coverage: `npm run test:coverage`
   - Verify >90% for new code
   - Run E2E (if UI changes): `npm run test:e2e`

4. **Before Commit:**
   - All tests passing ✅
   - Coverage meets standards ✅
   - No skipped tests (.skip, .only removed) ✅
   - ESLint passes ✅

**Phase-Specific Requirements:**

- **Phase 2 (Metrics):** 100% coverage for calculation logic
- **Phase 3 (UI):** Component tests + Storybook stories
- **Phase 4 (Timeline):** Integration tests with Apollo
- **Phase 6 (Polish):** E2E tests for critical user flows

### Anti-Patterns to Avoid

❌ **Testing Implementation Details**
```typescript
// BAD: Relies on internal state
expect(component.state.isLoading).toBe(true)

// GOOD: Tests what users see
expect(screen.getByText(/loading/i)).toBeInTheDocument()
```

❌ **Over-Mocking**
```typescript
// BAD: Mocks everything
vi.mock('./Button')
vi.mock('./Input')
vi.mock('./Form')

// GOOD: Tests real integration
render(<SearchForm />) // Real Button, Input, Form components
```

❌ **Fragile Selectors**
```typescript
// BAD: Breaks when HTML changes
container.querySelector('.css-class-name')

// GOOD: Semantic, stable selectors
screen.getByRole('button', { name: /search/i })
```

❌ **Async Without Await**
```typescript
// BAD: Race condition
userEvent.click(button)
expect(mockHandler).toHaveBeenCalled() // May fail

// GOOD: Wait for async operations
await userEvent.click(button)
expect(mockHandler).toHaveBeenCalled()
```

### Resources

**Documentation:**
- [Testing Guide (Full)](./testing-guide.md) - Complete testing documentation
- [Vitest Docs](https://vitest.dev)
- [Playwright Docs](https://playwright.dev)
- [React Testing Library](https://testing-library.com/react)
- [Kent C. Dodds - Testing Philosophy](https://kentcdodds.com/blog/the-testing-trophy-and-testing-classifications)

**Internal Examples:**
- `src/components/SearchForm.test.tsx` - Component testing
- `src/lib/authenticity.test.ts` - Logic testing
- `src/hooks/useUserAnalytics.test.tsx` - Hook testing
- `e2e/user-search.spec.ts` - E2E testing

---

## 🚫 What NOT to Change

### Keep These Components:
- ✅ UserAuthenticity (different purpose, valuable for fraud detection)
- ✅ RepositoryList/Table (working filters/sorting)
- ✅ RepositoryCard (enhance with badges, don't replace)
- ✅ UserHeader, UserStats (basic profile display)

### Keep These Patterns:
- ✅ Component → Story → Test workflow
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
