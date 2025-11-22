# Testing Guide

> **Purpose**: Strategy for unit and E2E tests  
> **For coverage**: See `docs/PERFORMANCE_BENCHMARKS.md`

### Unit Tests (Vitest + React Testing Library)

**Setup:** `src/test/setup.ts` - imports `@testing-library/jest-dom`, auto-cleanup after each test  
**Test Coverage:**

- 58+ test files across the codebase
- **Apollo Layer:** date-helpers.test.ts, queriers.test.ts, useQueryUser.test.tsx, ApolloAppProvider.test.tsx
- **Components:** Full coverage of UI, layout, user, statistics, and repository components
- **Hooks:** useAuthenticityScore.test.ts, useRepositoryFilters.test.ts, useRepositorySorting.test.ts, useUserAnalytics.test.tsx
- **Utilities:** statistics.test.ts, authenticity.test.ts, repository-filters.test.ts, date-utils.test.ts
- **Types:** metrics.test.ts, filters.test.ts  
  **Mocking:**
- Apollo: vi.mock('@/apollo/useQueryUser')
- Toast: vi.mock('sonner')  
  **Config:** vite.config.ts - Vitest in jsdom, excludes e2e/.

### E2E Tests (Playwright)

**Location:** e2e/user-search.spec.ts (14 scenarios)  
**Browsers:** chromium, firefox, webkit (parallel).  
**Coverage:** Search form, error handling, user profiles, responsive design.  
**Config:** playwright.config.ts - auto-starts dev on 5173.

### Important: Vitest Excludes E2E Tests

```typescript
exclude: ["node_modules/**", "dist/**", "e2e/**", "**/*.spec.ts"];
```

E2E: .spec.ts; Unit: .test.tsx/.test.ts
