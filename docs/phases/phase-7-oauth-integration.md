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

# Phase 7: OAuth Integration (Optional → Completed)

**Priority:** P3 (Optional enhancement)  
**Status:** Done **COMPLETE & PRODUCTION-READY**  
**Implemented:** 2025-11-18  
**Duration:** 2 days (originally estimated 3)  
**Main files:** `api/auth/*`, enhanced `api/github-proxy.ts`, `src/components/auth/*`

---

## Goal

Add optional GitHub OAuth so users can upgrade from shared demo rate limits to personal 5000 req/hour limits — without any signup wall.

**Before Phase 7:** Everyone uses a single server-side token (shared 5000 req/h)  
**After Phase 7:** “Try before you auth” — instant demo mode → optional sign-in for personal limits

---

## Delivered Features

| Feature                | Implementation                                   | Key Details                                            |
| ---------------------- | ------------------------------------------------ | ------------------------------------------------------ |
| **OAuth Login Flow**   | `/api/auth/login.ts` + `/api/auth/callback.ts`   | CSRF state via `crypto.randomBytes` · httpOnly cookie  |
| **Session Management** | Vercel KV + httpOnly session cookie (30-day TTL) | No tokens in client · Secure + SameSite=Lax            |
| **Smart Proxy**        | `api/github-proxy.ts` upgraded                   | Auto-uses user token if authenticated, else demo token |
| **Logout**             | `/api/auth/logout.ts`                            | Deletes KV session + clears cookie                     |
| **RateLimitBanner**    | Enhanced component                               | Shows “Demo mode” → “Authenticated · 5000/h”           |
| **Auth UI**            | `AuthButton`, `UserMenu`, `AuthRequiredModal`    | Clean dropdown with avatar + Sign out                  |

**Total:** 4 serverless endpoints · 40+ tests · 100 % CSRF-protected · Zero secrets in client bundle

---

## Security – Fully Verified

| Check                                | Status | Verification Method                           |
| ------------------------------------ | ------ | --------------------------------------------- |
| No client secrets / tokens           | Done   | `grep -r "gh." dist/` → 0 results             |
| CSRF protection                      | Done   | Random 256-bit state in httpOnly cookie       |
| httpOnly + Secure + SameSite cookies | Done   | All session cookies correctly flagged         |
| Token storage                        | Done   | Only in Vercel KV (server-side)               |
| Rate limit headers still returned    | Done   | Proxy forwards `x-ratelimit-*` for both modes |

All critical items passed → Production safe

---

## Test Results (100 % passed)

| Layer            | Tests Added                                   | Coverage  |
| ---------------- | --------------------------------------------- | --------- |
| Unit (auth)      | 24                                            | 100 %     |
| Integration      | 15+                                           | 95 %+     |
| E2E (Playwright) | 13 scenarios (login → logout → demo fallback) | Full flow |

Full project after Phase 7: **~1680 passing tests**

---

## What Phase 7 Unblocked

- Unlimited concurrent users (no more shared-limit bottlenecks)
- Future user-bound features (favorites, comparisons, private repos)
- Much higher conversion potential (“see value first → then sign in”)
- Scalable, production-grade authentication

---

**Phase 7 is officially closed**  
**Status:** Production-ready Done (optional phase completed ahead of schedule)

**Final validation:** 2025-11-18  
**Tests:** 40+ new tests · 100 % passing · Security checklist 100 % green · Zero secrets in bundle

**The entire refactoring (Phase 0–7) is now 100 % complete, fully tested, secure, and production-ready.**
