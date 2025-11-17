# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

GitHub User Info - React application for searching GitHub users via GraphQL API with Apollo Client. Built with React 19, TypeScript, Vite 7, and Tailwind CSS v4.

## Development Philosophy & Principles

### Core Workflow: Component → Storybook → Test

**This project follows a strict development order that MUST be maintained:**

1. **Component First** - Write the component with TypeScript types
2. **Storybook Second** - Create `.stories.tsx` with all states/variants
3. **Test Last** - Write `.test.tsx` based on Storybook stories
4. **Build Storybook** - Run `npm run build-storybook` before testing
5. **Run Tests** - Verify all tests pass with `npm test`

**Why This Order?**

- ✅ Storybook serves as visual documentation AND test specification
- ✅ Stories define all component states (loading, error, success, edge cases)
- ✅ Tests verify what Stories demonstrate
- ✅ Forces thinking about all use cases before writing tests
- ✅ MCP integration requires built Storybook for component discovery

**Example Workflow:**

```bash
# 1. Create component
touch src/components/MyComponent.tsx

# 2. Create story
touch src/components/MyComponent.stories.tsx

# 3. Build Storybook (required for MCP)
npm run build-storybook

# 4. Create test based on stories
touch src/components/MyComponent.test.tsx

# 5. Run tests
npm test MyComponent.test.tsx
```

**Never skip Storybook!** Even for simple components. This ensures:
- Visual regression testing capability
- Complete documentation
- All edge cases covered
- MCP integration works

### Quality Standards

**Test Coverage:**
- ✅ Minimum 90% coverage for all new code
- ✅ 100% coverage for calculation functions (metrics, utilities)
- ✅ Current baseline: 99.85% test pass rate (1302/1304 tests)

**TypeScript:**
- ✅ Strict mode enabled
- ✅ No `any` types allowed
- ✅ Props use descriptive, component-specific type names
- ✅ All event handlers properly typed

**Component Standards:**
- ✅ Use shadcn/ui components (New York style) when possible
- ✅ Follow existing component patterns (see `UserAuthenticity.tsx` as template)
- ✅ Include loading, error, and empty states
- ✅ Accessibility: WCAG 2.1 AA compliance

**Code Reusability:**
- ✅ Check existing components before creating new ones (`npm run storybook`)
- ✅ Reuse calculation patterns (see `src/lib/authenticity.ts` as template)
- ✅ Extend existing helpers instead of duplicating (e.g., date-helpers)
- ✅ Use existing utility functions from `src/lib/statistics.ts`

### MCP Integration Requirements

**Active MCP Servers:**
1. **Playwright MCP** - E2E test automation
2. **Storybook MCP** - Component documentation (requires `npm run build-storybook`)
3. **shadcn UI MCP** - UI component library docs
4. **Vite MCP** - Auto-runs with dev server
5. **Context7 MCP** - Library documentation lookup
6. **Graphiti Memory MCP** - Project knowledge persistence

**MCP Usage Pattern:**
- Query shadcn MCP before creating UI components
- Query Context7 MCP for library API documentation (Apollo, Recharts, etc.)
- Build Storybook before using Storybook MCP
- Update Graphiti Memory with important project decisions

### Architectural Decisions

**What NOT to Change:**
- ✅ Apollo Client 3.14.0 setup (working error handling, auth, cache)
- ✅ Component → Story → Test workflow (proven with 99.85% pass rate)
- ✅ shadcn/ui (New York style) consistency
- ✅ TypeScript strict mode configuration
- ✅ Existing calculation patterns (`authenticity.ts` as template)

**When Adding New Features:**
1. Check if similar component exists in Storybook
2. Reuse existing patterns (see `docs/component-development.md`)
3. Follow the Component → Story → Test workflow
4. Update documentation if adding new patterns
5. Run full test suite before committing

**Migration Strategy:**
- Incremental over full replacement
- Keep old code working while adding new
- Feature flags for gradual rollout
- Always maintain deployable `alt-main` branch

## Development Commands

### Essential Commands
```bash
npm run dev              # Start dev server (http://localhost:5173)
npm run build            # TypeScript compile + Vite production build
npm run lint             # Run ESLint
npm run preview          # Preview production build

# Testing
npm run test             # Unit tests (Vitest, watch mode)
npm run test:ui          # Vitest UI interface
npm run test:coverage    # Generate coverage report
npm run test:e2e         # Playwright E2E tests (headless)
npm run test:e2e:ui      # Playwright UI mode
npm run test:all         # Run all tests (unit + E2E)

# Storybook
npm run storybook        # Start Storybook dev server (port 6006)
npm run build-storybook  # Build static Storybook (required for MCP)
```

### Single Test Execution
```bash
# Run specific test file
npx vitest src/components/SearchForm.test.tsx

# Run specific E2E test
npx playwright test e2e/user-search.spec.ts

# Run single test by name
npx vitest -t "renders search input and button"
```

## Architecture

### Apollo Client Setup (v3.14.0)

**Location:** `src/apollo/ApolloAppProvider.tsx`

**Link Chain:** `errorLink → httpLink`

1. **errorLink**: Global error handler with `onError`
   - GraphQL errors: logged, displayed via toast, checks for `UNAUTHENTICATED` code
   - Network errors: logged, displayed via toast, handles 401 status (clears token from localStorage)

2. **httpLink**: Points to `/api/github-proxy` (backend proxy endpoint)
   - **Security Architecture**: Authentication handled server-side by the proxy
   - GitHub token stored on backend to prevent exposure in client bundle
   - No `authLink` needed (removed for security)

**Cache:** `InMemoryCache` (no custom config)

**Migration Note**: Previously used direct GitHub API access with client-side token (`https://api.github.com/graphql`). Now uses backend proxy for enhanced security.

### Data Fetching Pattern

**Custom Hook:** `src/apollo/useQueryUser.ts`

- Uses `useMemo` to compute GraphQL variables from date helpers
- Variables include: username, main date range (`from`/`to`), and 3 yearly ranges
- Query options: `skip: !login`, `errorPolicy: 'all'`, `notifyOnNetworkStatusChange: true`

**Date Helpers:** `src/apollo/date-helpers.ts`

- `getQueryDates(daysBack)`: Returns ISO date range for main query (default 365 days)
- `getThreeYearRanges(currentDate)`: Returns 3 year ranges (current-2, current-1, current) as ISO strings
- All dates in ISO 8601 format via `toISOString()`

**GraphQL Query:** `src/apollo/queriers.ts` - `GET_USER_INFO`

- Fetches user profile + contribution stats over multiple time ranges
- TypeScript types in `src/apollo/github-api.types.ts`

### Component Architecture

**Main Components:**

- `SearchForm` (`src/components/SearchForm.tsx`)
  - Controlled input with local state
  - Validates non-empty before calling `setUserName`
  - Error toast via `sonner`

- `UserProfile` (`src/components/UserProfile.tsx`)
  - Consumes `useQueryUser` hook
  - Renders: loading state, error state, "User Not Found", or user data

- `UserAuthenticity` (`src/components/user/UserAuthenticity.tsx`)
  - Displays authenticity score with breakdown metrics
  - Uses `useAuthenticityScore` hook for calculations
  - Shows warning flags and repository metadata

**UI Components:** `src/components/ui/`
- shadcn/ui library (New York style)
- Uses `class-variance-authority` for variants
- Utility: `src/lib/utils.ts` - `cn()` function for className merging

### Path Aliases

TypeScript and Vite configured with `@` alias:
```typescript
import { Button } from "@/components/ui/button"
import useQueryUser from "@/apollo/useQueryUser"
```

Resolves to `./src/`

### Environment Variables

**Backend Configuration:**
- GitHub token is now stored server-side for security
- Token handled by `/api/github-proxy` endpoint
- Prevents token exposure in client bundle

**Previous Setup (Deprecated):**
- Previously used `VITE_GITHUB_TOKEN` environment variable
- Token was accessible in client code via `import.meta.env.VITE_GITHUB_TOKEN`
- Migrated to server-side authentication for enhanced security

**Migration Path:**
1. ~~Copy `.env.example` to `.env.local`~~ (no longer needed for client)
2. Configure token on backend/proxy server
3. Scopes still required: `read:user`, `user:email`

## Testing Strategy

### Unit Tests (Vitest + React Testing Library)

**Setup:** `src/test/setup.ts` - imports `@testing-library/jest-dom`, auto-cleanup after each test

**Test Coverage:**
- 58+ test files across the codebase
- **Apollo Layer**:
  - `date-helpers.test.ts` - date utility functions
  - `queriers.test.ts` - GraphQL query validation
  - `useQueryUser.test.tsx` - custom hook logic
  - `ApolloAppProvider.test.tsx` - client setup
- **Components**: Full coverage of UI, layout, user, statistics, and repository components
- **Hooks**:
  - `useAuthenticityScore.test.ts` - authenticity calculations
  - `useRepositoryFilters.test.ts` - filter logic
  - `useRepositorySorting.test.ts` - sorting logic
  - `useUserAnalytics.test.tsx` - analytics tracking
- **Utilities**:
  - `statistics.test.ts` - statistical calculations
  - `authenticity.test.ts` - authenticity metrics
  - `repository-filters.test.ts` - repository filtering
  - `date-utils.test.ts` - date manipulation
- **Types**:
  - `metrics.test.ts` - type validation
  - `filters.test.ts` - filter type guards

**Mocking:**
- Apollo: Use `vi.mock('@/apollo/useQueryUser')` to mock hook return values
- Toast: `vi.mock('sonner')` for error assertions

**Config:** `vite.config.ts` - Vitest runs in `jsdom` environment, excludes `e2e/` tests

### E2E Tests (Playwright)

**Location:** `e2e/user-search.spec.ts` (14 scenarios)

**Browsers:** chromium, firefox, webkit (parallel execution)

**Coverage:** Search form, error handling, user profiles, responsive design

**Config:** `playwright.config.ts` - auto-starts dev server on port 5173

### Important: Vitest Excludes E2E Tests

Vitest config explicitly excludes Playwright tests:
```typescript
exclude: ['node_modules/**', 'dist/**', 'e2e/**', '**/*.spec.ts']
```

E2E tests use `.spec.ts` extension, unit tests use `.test.tsx`/`.test.ts`

## Code Quality

### ESLint Rules

**Config:** `eslint.config.js` (flat config format)

**Custom Rules:**
- `no-console`: `warn` (allows `console.warn` and `console.error`, blocks `console.log`)

**Plugins:**
- TypeScript ESLint, React Hooks, React Refresh, Tailwind CSS, Storybook, Prettier

### TypeScript

**Version:** 5.8.3

**Configs:**
- `tsconfig.json` - base config
- `tsconfig.app.json` - app build (excludes test files)
- `tsconfig.node.json` - build tools

**Important:** Test files excluded from app build to avoid compilation errors

### Type Conventions

- Component props: Use descriptive, component-specific type names
  - **Preferred**: `UserAuthenticityProps`, `SearchFormProps`, `StatsCardProps`
  - **Rationale**: Specific naming improves code clarity and IDE autocomplete
  - Always capitalize prop type names
  - Avoid generic `Props` - be descriptive
- Handler functions: Use `handler` prefix (e.g., `handlerOnSubmit`, not `hundler`)

## Storybook

**Version:** 10.0.3

**Port:** 6006

**Addons:**
- `@chromatic-com/storybook` - visual regression testing platform
- `@storybook/addon-docs` - auto-generated component documentation
- `@storybook/addon-onboarding` - first-time user guidance
- `@storybook/addon-themes` - theme switching support (dark/light mode)
- `@storybook/addon-a11y` - accessibility checks and WCAG compliance
- `@storybook/addon-vitest` - test integration with Vitest
- `@storybook/addon-mcp` - MCP server integration for AI assistance

**Stories Coverage:**
- 47+ story files across all components
- **UI Components** (`src/components/ui/*.stories.tsx`):
  - shadcn UI component variants (button, card, badge, table, select, etc.)
- **Layout Components**:
  - `EmptyState.stories.tsx`, `LoadingState.stories.tsx`, `ErrorState.stories.tsx`
  - `ThemeToggle.stories.tsx`, `StatsCard.stories.tsx`, `MainTabs.stories.tsx`
- **User Components**:
  - `UserHeader.stories.tsx`, `UserStats.stories.tsx`, `UserAuthenticity.stories.tsx`
  - `RecentActivity.stories.tsx`, `ContributionHistory.stories.tsx`
- **Statistics Components**:
  - `StatsOverview.stories.tsx`, `ActivityChart.stories.tsx`, `CommitChart.stories.tsx`
  - `LanguageChart.stories.tsx`
- **Repository Components**:
  - `RepositoryCard.stories.tsx`, `RepositoryList.stories.tsx`, `RepositoryTable.stories.tsx`
  - `RepositoryFilters.stories.tsx`, `RepositorySorting.stories.tsx`, `RepositoryPagination.stories.tsx`
  - `RepositoryEmpty.stories.tsx`
- **Form Components**:
  - `SearchForm.stories.tsx`

**Important:** Run `npm run build-storybook` to generate `storybook-static/index.json` (required for Storybook MCP server)

## MCP Servers

Project supports 6 MCP servers for AI-assisted development:

1. **Playwright MCP** - E2E test automation and browser testing
2. **Storybook MCP** - Component documentation (requires `npm run build-storybook` first)
3. **shadcn UI MCP** - UI component library docs and API reference
4. **Vite MCP** - Built-in via `vite-plugin-mcp@0.2.5` (auto-runs with dev server)
5. **Context7 MCP** - Library documentation lookup (Apollo, Recharts, date-fns, etc.)
6. **Graphiti Memory MCP** - Project knowledge persistence and decision tracking

**Setup Guide:** `docs/mcp-setup.md`
**Verification:** `docs/mcp-verification-checklist.md`

**Important Notes:**
- Storybook MCP requires `npm run build-storybook` before component indexing
- Context7 MCP helps query external library documentation without web search
- Graphiti Memory MCP maintains conversation context across sessions

## Build Configuration

### Vite

**Config:** `vite.config.ts`

**Plugins:**
- `@vitejs/plugin-react` - React Fast Refresh
- `@tailwindcss/vite` - Tailwind CSS v4
- `vite-plugin-mcp` - MCP server integration

**Path Alias:** `@` → `./src`

**Test Config:** Vitest configured in same file with jsdom environment

### Tailwind CSS

**Version:** 4.1.12 (v4 stable)

**Plugin:** Uses Vite plugin (`@tailwindcss/vite`), no separate PostCSS config needed

**Components:** shadcn/ui components use Tailwind utility classes

## Git Workflow

**Main Branches:**
- `alt-main` - main branch for PRs and active development

**Commit Convention:** Standard descriptive commits (no strict convention enforced)

**Previous Branch Structure (Deprecated):**
- ~~`alt-main`~~ - previous main branch
- ~~`ui-main`~~ - previous working branch
- Now consolidated to `main` for simplicity

## Common Patterns

### Error Handling

**Apollo GraphQL:** Errors handled globally in `ApolloAppProvider` via `onError` link
- GraphQL errors: toast notification + console.error
- Network errors: toast notification + console.error + 401 handling
- Component level: `useQuery` returns `error` object for UI display

**Form Validation:** Client-side validation with toast notifications (sonner)

### State Management

**Global State:** None (no Redux/Zustand)
**Server State:** Apollo Client cache
**Local State:** React `useState` for form inputs

### Date Handling

**Library:** `date-fns` (v4.1.0) available but date-helpers use native Date API
**Format:** ISO 8601 strings for GraphQL queries
**Timezone:** All dates created in local timezone, converted to ISO string

## Known Issues

### Apollo Client Warnings

UserProfile tests show Apollo warnings about `InMemoryCache.addTypename` option:
```
An error occurred! For more details, see the full error text at https://go.apollo.dev/c/err#...
```

**Status:** Tests pass despite warnings. MockedProvider configuration could be improved but not blocking.

### TypeScript Build

Test files must be excluded from production build (`tsconfig.app.json`) to avoid:
- Import errors for test utilities (`vitest`, `@testing-library`)
- Compilation of `.test.tsx` and `.stories.tsx` files

## Performance Considerations

**Bundle Size:** ~466 KB (gzip: 141 KB) - acceptable for this app size

**GraphQL Optimization:**
- Single query fetches all needed data (user + contribution stats)
- Variables computed once via `useMemo` in `useQueryUser`
- Apollo cache prevents redundant network requests

**Code Splitting:** Not implemented yet (single bundle)

## Browser Support

**Development:** Modern browsers (ES2020+)

**Playwright Testing:** chromium, firefox, webkit

**Vite Target:** Defaults to modern browsers supporting native ESM

## Documentation

**Project Docs:** `docs/` directory

**Core Documentation:**
- `mcp-setup.md` - MCP server installation guide
- `mcp-verification-checklist.md` - MCP testing procedures
- `architecture.md` - System architecture overview
- `component-development.md` - Component development patterns
- `testing-guide.md` - Testing strategy and best practices

**Technical Guides:**
- `apollo-client-guide.md` - Apollo Client setup and usage
- `graphql-api.md` - GraphQL API integration
- `typescript-guide.md` - TypeScript patterns and conventions
- `components-guide.md` - Component library overview
- `hooks-documentation.md` - Custom hooks reference

**Technology-Specific:**
- `react-19-features.md` - React 19 feature usage
- `tailwind-v4-migration.md` - Tailwind CSS v4 migration guide
- `dependencies.md` - Dependency management

**Strategy & Planning:**
- `api-strategy.md` - API integration strategy
- `api-reference.md` - API endpoint documentation
- `metrics-explanation.md` - Authenticity metrics calculation
- `IMPLEMENTATION_PLAN_HYBRID.md` - Feature implementation roadmap
- `REFACTORING_MASTER_PLAN.md` - Code refactoring strategy
- `DEPLOYMENT_STRATEGY.md` - Deployment and release process
- `ROLLBACK_PLAN.md` - Emergency rollback procedures
- `PERFORMANCE_BENCHMARKS.md` - Performance metrics
- `DOCUMENTATION_CLEANUP_REPORT.md` - Documentation maintenance log
- `baggs.md` - Bug tracking

**Inline Docs:** JSDoc comments in Apollo provider, hooks, and utility functions

**Storybook:** Interactive component documentation at http://localhost:6006

## Graphiti Memory Integration

This project uses Graphiti Memory MCP for knowledge management:
- Always check existing memory before responding to project questions
- Save important project information to memory
- Update memory when inconsistencies are detected