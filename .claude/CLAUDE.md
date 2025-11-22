# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

GitHub User Analytics - React application for analyzing GitHub user profiles with 4 core metrics (Activity, Impact, Quality, Growth). Built with React 19, TypeScript, Vite 7, and Tailwind CSS v4.

### Current Status (November 2025)

**Refactoring:** ✅ 100% Complete (Phase 0-7)
**Production:** ✅ Deployed and operational
**Tests:** 1640+ passing (99.85% pass rate)
**Coverage:** 91.36%

### Key Features

- **4 Metrics:** Activity, Impact, Quality, Growth scores
- **OAuth:** Optional GitHub authentication for personal rate limits
- **Timeline:** Year-by-year contribution history
- **Security:** Server-side token storage, no secrets in client bundle

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
import { Button } from "@/components/ui/button";
import useQueryUser from "@/apollo/useQueryUser";
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

## OAuth Integration (Phase 7)

**Status:** ✅ Fully Implemented (Phase 7 Complete)

**Documentation:**

- `docs/PHASE_7_COMPLETION_SUMMARY.md` - Complete implementation details
- `docs/PHASE_7_SECURITY_CHECKLIST.md` - Security verification checklist
- `docs/PHASE_7_IMPLEMENTATION_PLAN_RU.md` - Original implementation plan (Russian)

### Architecture Overview

The application supports **dual-mode operation**:

1. **Demo Mode** (Default)
   - Uses shared GitHub token (`GITHUB_TOKEN` env variable)
   - 5000 requests/hour shared across all unauthenticated users
   - 30-minute cache TTL
   - Cache key prefix: `demo:{cacheKey}`
   - No user data stored
   - "Try before auth" experience

2. **Authenticated Mode** (OAuth)
   - Uses user's personal GitHub token (OAuth)
   - 5000 requests/hour per individual user
   - 10-minute cache TTL (fresher data)
   - Cache key prefix: `user:{sessionId}:{cacheKey}`
   - Session stored in Vercel KV (30-day TTL)
   - Higher rate limits, personal data access

**User Experience Flow:**

```
1. User visits app → Demo mode (instant access)
2. User searches GitHub users → Shared rate limit
3. [Optional] User clicks "Sign in with GitHub" → OAuth flow
4. User authenticated → Personal rate limit, fresher data
5. User can sign out → Returns to demo mode
```

**Graceful Degradation:**

- OAuth failures → automatically fall back to demo mode
- Expired sessions → automatically fall back to demo mode
- No error dialogs → seamless user experience

### OAuth Endpoints

**Location:** `api/auth/` directory

#### 1. `/api/auth/login` (Initiate OAuth Flow)

**Purpose:** Starts GitHub OAuth flow with CSRF protection

**Flow:**

1. Generate cryptographically secure state (32 bytes, `crypto.randomBytes`)
2. Store state in httpOnly cookie (`oauth_state`, 10-minute TTL)
3. Redirect to GitHub OAuth authorization URL

**Environment Variables Required:**

- `GITHUB_OAUTH_CLIENT_ID` - OAuth App client ID
- `GITHUB_OAUTH_CLIENT_SECRET` - OAuth App client secret (used in callback)

**Security Features:**

- CSRF protection via state parameter
- HttpOnly cookie (prevents XSS)
- Secure flag (HTTPS only in production)
- SameSite=Lax (CSRF protection)
- 10-minute expiry (enough for OAuth flow)

**Example:**

```typescript
// User clicks "Sign in with GitHub"
window.location.href = "/api/auth/login";

// Endpoint generates:
// - State: 64-char hex string (256 bits entropy)
// - Cookie: oauth_state={state}; HttpOnly; Secure; SameSite=Lax; Max-Age=600
// - Redirects to: https://github.com/login/oauth/authorize?client_id=...&state=...&scope=read:user user:email
```

#### 2. `/api/auth/callback` (Handle OAuth Callback)

**Purpose:** Receives OAuth code from GitHub, exchanges for token, creates session

**Flow:**

1. Extract state from URL parameter and cookie
2. Validate state matches (CSRF check)
3. Exchange code for access token (GitHub API)
4. Fetch user info (login, avatar)
5. Create session in Vercel KV
6. Set session cookie (httpOnly, 30-day TTL)
7. Clear OAuth state cookie
8. Redirect to homepage with success parameter

**Session Structure:**

```typescript
interface Session {
  userId: number; // GitHub user ID
  login: string; // GitHub username
  avatarUrl: string; // Avatar URL
  accessToken: string; // OAuth access token
  createdAt: number; // Unix timestamp
}
```

**Storage:**

- Key: `session:{randomSessionId}`
- Storage: Vercel KV
- TTL: 30 days (2592000 seconds)
- Auto-cleanup by Vercel KV

**Security Features:**

- CSRF validation (state parameter)
- HttpOnly session cookie (prevents XSS)
- Secure flag (HTTPS only)
- SameSite=Lax
- Token stored server-side only (never sent to client)
- Graceful error handling (redirects to demo mode)

**Error Handling:**

```typescript
// All errors redirect to homepage with error parameter
/?error=missing_code    // No code in callback
/?error=csrf_failed     // CSRF validation failed
/?error=token_failed    // Token exchange failed
/?error=user_failed     // User info fetch failed
/?error=session_failed  // Session creation failed
```

#### 3. `/api/auth/logout` (Sign Out)

**Purpose:** Deletes session and clears cookies

**Flow:**

1. Extract session ID from cookie
2. Delete session from Vercel KV
3. Clear session cookie (Max-Age=0)
4. Redirect to homepage

**Example:**

```typescript
// User clicks "Sign out"
window.location.href = "/api/auth/logout";

// Result:
// - Session deleted from KV
// - Cookie cleared
// - Redirects to /?auth=logged_out
// - App automatically falls back to demo mode
```

### Environment Variables

**Required for OAuth:**

```bash
# GitHub OAuth App Configuration
GITHUB_OAUTH_CLIENT_ID=Ov23li...       # OAuth App client ID
GITHUB_OAUTH_CLIENT_SECRET=1a2b3c...    # OAuth App client secret

# Demo Mode Token (still required)
GITHUB_TOKEN=ghp_...                    # Fallback for demo mode

# Vercel KV (for session storage)
KV_URL=redis://...                      # Auto-configured by Vercel
KV_REST_API_URL=https://...             # Auto-configured by Vercel
KV_REST_API_TOKEN=...                   # Auto-configured by Vercel
KV_REST_API_READ_ONLY_TOKEN=...         # Auto-configured by Vercel
```

**Setup Instructions:**

1. **Create GitHub OAuth App:**
   - Go to: https://github.com/settings/developers
   - Click "New OAuth App"
   - Application name: `GitHub Users Analytics`
   - Homepage URL: `https://your-domain.vercel.app`
   - Authorization callback URL: `https://your-domain.vercel.app/api/auth/callback`
   - Save and copy Client ID and Client Secret

2. **Configure Vercel Environment Variables:**

   ```bash
   # Production
   vercel env add GITHUB_OAUTH_CLIENT_ID production
   vercel env add GITHUB_OAUTH_CLIENT_SECRET production

   # Preview (optional)
   vercel env add GITHUB_OAUTH_CLIENT_ID preview
   vercel env add GITHUB_OAUTH_CLIENT_SECRET preview

   # Development (local .env.local)
   echo "GITHUB_OAUTH_CLIENT_ID=Ov23li..." >> .env.local
   echo "GITHUB_OAUTH_CLIENT_SECRET=1a2b3c..." >> .env.local
   ```

3. **Setup Vercel KV:**
   - Vercel Dashboard → Storage → Create KV Database
   - Link to project → variables auto-configured
   - No additional setup needed

### Frontend Integration

**Components:**

1. **UserMenu** (`src/components/layout/UserMenu.tsx`)
   - Shows "Sign in with GitHub" button (unauthenticated)
   - Shows avatar dropdown with username (authenticated)
   - Handles sign in and sign out clicks

2. **RateLimitBanner** (`src/components/layout/RateLimitBanner.tsx`)
   - Different messaging for demo vs authenticated modes
   - Demo: Shows "Sign in for higher limits" when < 10% remaining
   - Authenticated: Shows "Authenticated" with personal rate limit info
   - Props: `isDemo`, `onAuthClick`, `onLogoutClick`

**App.tsx Integration:**

```typescript
// src/App.tsx

interface RateLimitState {
  remaining: number
  limit: number
  reset: number
  isDemo: boolean
  userLogin?: string
}

const [rateLimit, setRateLimit] = useState<RateLimitState>({
  remaining: 5000,
  limit: 5000,
  reset: 0,
  isDemo: true,
})

// Handle rate limit updates from GraphQL responses
const handleRateLimitUpdate = (newRateLimit: RateLimit) => {
  setRateLimit({
    remaining: newRateLimit.remaining,
    limit: newRateLimit.limit,
    reset: newRateLimit.reset,
    isDemo: newRateLimit.isDemo,
    userLogin: newRateLimit.userLogin,
  })
}

// OAuth handlers
const handleGitHubAuth = () => {
  window.location.href = '/api/auth/login'
}

const handleLogout = () => {
  window.location.href = '/api/auth/logout'
}

// Check if authenticated
const isAuthenticated = !rateLimit.isDemo && !!rateLimit.userLogin

// In render:
<UserMenu
  isAuthenticated={isAuthenticated}
  user={isAuthenticated ? { login: rateLimit.userLogin!, avatarUrl: '...' } : undefined}
  onSignIn={handleGitHubAuth}
  onSignOut={handleLogout}
/>

<RateLimitBanner
  remaining={rateLimit.remaining}
  limit={rateLimit.limit}
  reset={rateLimit.reset}
  isDemo={rateLimit.isDemo}
  onAuthClick={handleGitHubAuth}
  onLogoutClick={handleLogout}
/>
```

**Apollo Client Configuration:**

```typescript
// src/apollo/ApolloAppProvider.tsx

const httpLink = createHttpLink({
  uri: "/api/github-proxy",
  includeExtensions: true,
  credentials: "include", // ← CRITICAL: Include cookies for OAuth session
  fetch: (uri, options) => {
    return fetch(uri, {
      ...options,
      credentials: "include", // ← Ensure cookies sent with every request
      body: JSON.stringify(newBody),
    });
  },
});
```

**Hook Integration:**

```typescript
// src/apollo/useQueryUser.ts

export interface UseQueryUserOptions {
  onRateLimitUpdate?: (rateLimit: RateLimit) => void;
}

function useQueryUser(
  login: string,
  daysBack: number = 365,
  options?: UseQueryUserOptions,
) {
  return useQuery<GitHubGraphQLResponse>(GET_USER_INFO, {
    variables,
    skip: !login,
    errorPolicy: "all",
    notifyOnNetworkStatusChange: true,
    onCompleted: (data) => {
      // Extract rate limit from response and notify parent
      if (options?.onRateLimitUpdate && data.rateLimit) {
        options.onRateLimitUpdate(data.rateLimit);
      }
    },
  });
}
```

### Backend Integration

**GitHub Proxy** (`api/github-proxy.ts`)

The proxy automatically detects demo vs authenticated mode:

```typescript
// 1. Extract session from cookie
const sessionId = extractSessionFromCookie(req.headers.cookie);
let token = process.env.GITHUB_TOKEN; // Default to demo token
let isDemo = true;
let userLogin: string | undefined;

// 2. Check for authenticated session
if (sessionId && kv) {
  const session = await kv.get<Session>(`session:${sessionId}`);
  if (session && session.accessToken) {
    token = session.accessToken; // Use user's token
    isDemo = false;
    userLogin = session.login;
  }
}

// 3. Select cache key prefix
const finalCacheKey = cacheKey
  ? isDemo
    ? `demo:${cacheKey}`
    : `user:${sessionId}:${cacheKey}`
  : null;

// 4. Select cache TTL
const ttl = isDemo ? 1800 : 600; // 30min demo, 10min user

// 5. Include rate limit in response
const rateLimit = extractRateLimit(response.headers, isDemo, userLogin);

res.json({
  ...result.data,
  rateLimit, // ← Frontend uses this to update UI
});
```

**Rate Limit Extraction:**

```typescript
function extractRateLimit(
  headers: Headers,
  isDemo: boolean,
  userLogin?: string,
): RateLimit {
  return {
    remaining: parseInt(headers.get("x-ratelimit-remaining") || "5000"),
    limit: parseInt(headers.get("x-ratelimit-limit") || "5000"),
    reset: parseInt(headers.get("x-ratelimit-reset") || "0"),
    used: parseInt(headers.get("x-ratelimit-used") || "0"),
    isDemo,
    userLogin,
  };
}
```

### Security Considerations

**CRITICAL Security Features:**

1. **Token Storage:**
   - ✅ All tokens stored server-side (Vercel KV)
   - ✅ Never sent to client
   - ✅ Not in localStorage/sessionStorage
   - ✅ Not in client bundle

2. **CSRF Protection:**
   - ✅ Cryptographically secure state (crypto.randomBytes)
   - ✅ State stored in httpOnly cookie
   - ✅ State validated in callback
   - ✅ 10-minute expiry

3. **Cookie Security:**
   - ✅ HttpOnly flag (prevents XSS)
   - ✅ Secure flag (HTTPS only in production)
   - ✅ SameSite=Lax (CSRF protection)
   - ✅ Appropriate TTLs (state: 10min, session: 30 days)

4. **OAuth Scope:**
   - ✅ Minimal scope: `read:user user:email`
   - ✅ No write permissions
   - ✅ No repo access (for now)

5. **Error Handling:**
   - ✅ Generic error messages to users
   - ✅ Detailed logging server-side
   - ✅ Graceful fallback to demo mode
   - ✅ No secrets in error messages

**Security Checklist:** See `docs/PHASE_7_SECURITY_CHECKLIST.md` for complete verification procedures.

### Testing OAuth

**Manual Testing:**

```bash
# 1. Test demo mode
npm run dev
# Visit http://localhost:5173
# Search for a user → should work in demo mode

# 2. Test OAuth login
# Click "Sign in with GitHub" → should redirect to GitHub
# Authorize app → should redirect back with session
# Search for user → should use personal rate limit

# 3. Test logout
# Click "Sign out" → should clear session
# Search for user → should return to demo mode

# 4. Test CSRF protection
# Start OAuth flow → copy state from cookie
# Modify state in callback URL → should fail with /?error=csrf_failed
```

**Unit Tests:**

- ✅ `/api/auth/login.test.ts` - 6 tests (OAuth initiation, CSRF state generation)
- ✅ `/api/auth/callback.test.ts` - 11 tests (CSRF validation, token exchange, session creation)
- ✅ `/api/auth/logout.test.ts` - 7 tests (session deletion, cookie clearing)
- ✅ `api/github-proxy.test.ts` - Updated with session extraction tests
- ✅ `UserMenu.test.tsx` - 10 tests (sign in/out, dropdown)
- ✅ `RateLimitBanner.test.tsx` - 22 tests (demo/auth modes)

**Storybook:**

- ✅ `UserMenu.stories.tsx` - 6 stories (authenticated/unauthenticated states)
- ✅ `RateLimitBanner.stories.tsx` - 8 stories (demo/auth warning/critical states)

**Coverage:** 95%+ for all OAuth-related code

### Troubleshooting

**Problem:** OAuth redirect fails with 404

- **Solution:** Ensure callback URL in GitHub OAuth App matches: `https://your-domain.vercel.app/api/auth/callback`
- **Check:** OAuth App settings on GitHub

**Problem:** CSRF validation fails (/?error=csrf_failed)

- **Solution:** Check cookies are enabled in browser
- **Check:** Secure flag disabled for localhost (development)
- **Check:** SameSite=Lax allows OAuth redirects

**Problem:** Session not persisted after OAuth

- **Solution:** Check Vercel KV is configured and accessible
- **Check:** Environment variables (KV_URL, KV_REST_API_URL, etc.)
- **Check:** Vercel Function logs for KV errors

**Problem:** Rate limit not updating after OAuth

- **Solution:** Check `/api/github-proxy` returns `rateLimit` in response
- **Check:** Apollo Client includes `credentials: 'include'`
- **Check:** `useQueryUser` calls `onRateLimitUpdate` callback

**Problem:** Demo mode after successful OAuth

- **Solution:** Check session cookie is set (DevTools → Application → Cookies)
- **Check:** Session exists in Vercel KV (`session:{sessionId}`)
- **Check:** `/api/github-proxy` successfully extracts session from cookie

**Debugging:**

```bash
# Check Vercel Function logs
vercel logs --follow

# Check Vercel KV contents
# Vercel Dashboard → Storage → KV → Browse keys
# Look for: session:{sessionId}

# Check browser cookies
# DevTools → Application → Cookies → localhost:5173
# Should see: session={sessionId}; HttpOnly; Secure; SameSite=Lax
```

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
exclude: ["node_modules/**", "dist/**", "e2e/**", "**/*.spec.ts"];
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

- `REFACTORING_MASTER_PLAN.md` - Completed refactoring summary
- `metrics-explanation.md` - 4 metrics calculation formulas
- `ROLLBACK_PLAN.md` - Emergency rollback procedures
- `PERFORMANCE_BENCHMARKS.md` - Performance metrics

**Phase Documentation:** `docs/phases/`

- `phase-0-backend-security.md` ✅
- `phase-1-graphql-multi-query.md` ✅
- `phase-2-metrics-calculation.md` ✅
- `phase-3-core-components.md` ✅
- `phase-4-timeline-components.md` ✅
- `phase-5-layout-refactoring.md` ✅
- `phase-6-testing-polish.md` ✅
- `phase-7-oauth-integration.md` ✅

**Inline Docs:** JSDoc comments in Apollo provider, hooks, and utility functions

**Storybook:** Interactive component documentation at http://localhost:6006

## Graphiti Memory Integration

This project uses Graphiti Memory MCP for knowledge management.

**Key Facts to Remember:**

1. **Refactoring Status:** 100% complete (Phase 0-7), November 2025
2. **Architecture:** Server-side proxy for GitHub API, no client-side tokens
3. **4 Metrics:** Activity (0-100), Impact (0-100), Quality (0-100), Growth (-100 to +100)
4. **OAuth:** Dual-mode (demo + authenticated), sessions in Vercel KV
5. **Tests:** 1640+ tests, 99.85% pass rate, 91.36% coverage
6. **Next Phase:** UI/UX improvements (ready to start)

**Memory Guidelines:**

- Update memory when project status changes
- Correct outdated information immediately
- Track important architectural decisions
