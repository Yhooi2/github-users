# Phase 7: OAuth Integration (Optional)

**Priority:** P3 (Optional - Can be deferred)
**Estimated Time:** 3 days
**Status:** ⏳ **NOT STARTED** - Optional enhancement

**Dependencies:** Phase 0-6 must be complete

**Note:** This phase is OPTIONAL. The application works fully in demo mode with server-side token. OAuth adds per-user rate limits and future features like favorites/comparisons.

---

## 🎯 Overview

### What This Phase Adds

**Demo Mode (Phase 0-6):**

- ✅ Server-side token (5000 req/hour shared)
- ✅ Rate limit monitoring
- ✅ Warning banner at <10% remaining
- ✅ Auth prompt when exhausted
- ✅ Full functionality for all users

**OAuth Mode (Phase 7):**

- 🆕 User signs in with GitHub account
- 🆕 Personal rate limit (5000 req/hour per user)
- 🆕 Scalability (unlimited users)
- 🆕 Future features: save favorites, compare users, private repos

### Why Optional?

**Demo mode is sufficient for:**

- Initial launch and user validation
- Small to medium user base (<100 concurrent users)
- Public repository analysis only
- Quick time-to-market

**OAuth becomes necessary when:**

- Demo rate limit frequently exhausted
- User base grows beyond shared rate limit capacity
- Users request profile saving/comparison features
- Private repository access needed

---

## 🔄 Strategy: "Try Before You Auth"

### User Journey

```
1. User visits app (no login required)
   ↓
2. Searches GitHub users in demo mode
   ↓
3. Sees full analytics (Activity, Impact, Quality, Growth)
   ↓
4. Rate limit warning appears at <10% remaining
   ↓
5. User decides: keep using demo OR sign in for personal limit
   ↓
6. Signs in with GitHub OAuth (optional)
   ↓
7. Gets personal rate limit + future features
```

**Benefits:**

- Low barrier to entry (no signup wall)
- Users see value before committing
- Natural conversion funnel
- Reduced abandonment rate

---

## 📋 Implementation Steps

### Step 7.1: Setup GitHub OAuth App

**GitHub Settings:**

1. Go to [GitHub Settings → Developer Settings → OAuth Apps](https://github.com/settings/developers)
2. Click **"New OAuth App"**
3. Configure:
   - **Application name:** GitHub User Analytics
   - **Homepage URL:** `https://your-app.vercel.app`
   - **Authorization callback URL:** `https://your-app.vercel.app/api/auth/callback`
4. Click **"Register application"**
5. Copy **Client ID** and generate **Client Secret**

**Environment Variables:**

```bash
# .env (server-side)
GITHUB_OAUTH_CLIENT_ID=Iv1.xxxxxxxxxxxx
GITHUB_OAUTH_CLIENT_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
GITHUB_TOKEN=ghp_xxx  # Keep for demo mode fallback
```

**Security:**

- ✅ Never expose Client Secret in client bundle
- ✅ Store OAuth tokens server-side only
- ✅ Use `httpOnly` cookies for session management

---

### Step 7.2: Create OAuth Flow Endpoints

#### Endpoint 1: Initiate OAuth

**File:** `api/auth/login.ts`

```typescript
export default async function handler(req, res) {
  const clientId = process.env.GITHUB_OAUTH_CLIENT_ID;

  if (!clientId) {
    return res.status(500).json({ error: "OAuth not configured" });
  }

  // GitHub OAuth authorization URL
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: `${process.env.VERCEL_URL || "http://localhost:3000"}/api/auth/callback`,
    scope: "read:user user:email", // Read-only access to public profile
    state: generateRandomState(), // CSRF protection
  });

  const authUrl = `https://github.com/login/oauth/authorize?${params}`;

  // Redirect to GitHub
  res.redirect(authUrl);
}
```

#### Endpoint 2: Handle Callback

**File:** `api/auth/callback.ts`

```typescript
import { kv } from "@vercel/kv";

export default async function handler(req, res) {
  const { code, state } = req.query;

  if (!code) {
    return res.redirect("/?error=no_code");
  }

  // Verify state (CSRF protection)
  // TODO: Implement state verification

  try {
    // Exchange code for access token
    const tokenResponse = await fetch(
      "https://github.com/login/oauth/access_token",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          client_id: process.env.GITHUB_OAUTH_CLIENT_ID,
          client_secret: process.env.GITHUB_OAUTH_CLIENT_SECRET,
          code,
        }),
      },
    );

    const { access_token } = await tokenResponse.json();

    if (!access_token) {
      throw new Error("Failed to obtain access token");
    }

    // Get user info
    const userResponse = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    const user = await userResponse.json();

    // Store session in Vercel KV
    const sessionId = generateSessionId();
    await kv.set(
      `session:${sessionId}`,
      {
        userId: user.id,
        login: user.login,
        accessToken: access_token,
        createdAt: Date.now(),
      },
      { ex: 86400 * 30 },
    ); // 30 days TTL

    // Set httpOnly cookie
    res.setHeader(
      "Set-Cookie",
      `session=${sessionId}; HttpOnly; Secure; SameSite=Lax; Max-Age=${86400 * 30}; Path=/`,
    );

    // Redirect to app
    res.redirect("/?auth=success");
  } catch (error) {
    console.error("OAuth callback error:", error);
    res.redirect("/?error=auth_failed");
  }
}
```

#### Endpoint 3: Logout

**File:** `api/auth/logout.ts`

```typescript
import { kv } from "@vercel/kv";

export default async function handler(req, res) {
  const sessionId = extractSessionFromCookie(req.headers.cookie);

  if (sessionId) {
    // Delete session from KV
    await kv.del(`session:${sessionId}`);
  }

  // Clear cookie
  res.setHeader(
    "Set-Cookie",
    "session=; HttpOnly; Secure; SameSite=Lax; Max-Age=0; Path=/",
  );

  res.redirect("/?auth=logged_out");
}
```

---

### Step 7.3: Update GitHub Proxy for User Tokens

**File:** `api/github-proxy.ts`

```typescript
import { kv } from "@vercel/kv";

export default async function handler(req, res) {
  // Extract session from cookie
  const sessionId = extractSessionFromCookie(req.headers.cookie);

  let token = process.env.GITHUB_TOKEN; // Default to demo mode token
  let isDemo = true;

  // If user is authenticated, use their token
  if (sessionId) {
    const session = await kv.get(`session:${sessionId}`);
    if (session && session.accessToken) {
      token = session.accessToken;
      isDemo = false;
    }
  }

  if (!token) {
    return res.status(500).json({ error: "No token available" });
  }

  const { query, variables, cacheKey } = req.body;

  // Check cache (use session-specific cache for authenticated users)
  const finalCacheKey = isDemo ? cacheKey : `user:${sessionId}:${cacheKey}`;
  if (finalCacheKey) {
    const cached = await kv.get(finalCacheKey);
    if (cached) {
      console.log(`Cache HIT: ${finalCacheKey}`);
      return res.status(200).json(cached);
    }
  }

  // GitHub API request
  try {
    const response = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query, variables }),
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.errors) {
      return res.status(400).json(data);
    }

    // Extract rate limit
    const rateLimit = {
      remaining: parseInt(
        response.headers.get("X-RateLimit-Remaining") || "0",
        10,
      ),
      limit: parseInt(response.headers.get("X-RateLimit-Limit") || "5000", 10),
      reset: parseInt(response.headers.get("X-RateLimit-Reset") || "0", 10),
      used: parseInt(response.headers.get("X-RateLimit-Used") || "0", 10),
      isDemo, // Indicate if using demo token
    };

    const responseData = {
      ...data,
      rateLimit,
    };

    // Cache result (shorter TTL for authenticated users: 10 min vs 30 min)
    if (finalCacheKey) {
      const ttl = isDemo ? 1800 : 600; // Demo: 30min, User: 10min
      await kv.set(finalCacheKey, responseData, { ex: ttl });
      console.log(
        `Cache SET: ${finalCacheKey} (TTL: ${ttl}s, Demo: ${isDemo})`,
      );
    }

    return res.status(200).json(responseData);
  } catch (error) {
    console.error("GitHub proxy error:", error);
    return res.status(500).json({
      error: "Failed to fetch from GitHub",
      message: error.message,
    });
  }
}
```

---

### Step 7.4: Update UI for Auth State

#### Update RateLimitBanner

**File:** `src/components/layout/RateLimitBanner.tsx`

```typescript
export interface RateLimitBannerProps {
  remaining: number
  limit: number
  reset: number
  isDemo: boolean // NEW: Indicate demo vs authenticated mode
  onAuthClick?: () => void
  onLogoutClick?: () => void // NEW: Logout handler
}

export function RateLimitBanner({
  remaining,
  limit,
  reset,
  isDemo,
  onAuthClick,
  onLogoutClick,
}: RateLimitBannerProps) {
  const percentage = (remaining / limit) * 100
  const resetDate = new Date(reset * 1000)
  const timeUntilReset = Math.ceil((resetDate.getTime() - Date.now()) / 1000 / 60)

  // Only show if < 10% remaining OR in demo mode
  if (!isDemo && percentage >= 10) return null

  return (
    <Alert variant={percentage < 5 ? 'destructive' : 'default'} className="mb-4">
      <Info className="h-4 w-4" />
      <AlertTitle>
        {isDemo ? '📊 Demo mode active' : '✅ Authenticated'}
      </AlertTitle>
      <AlertDescription className="mt-2 space-y-2">
        <p>
          {remaining} of {limit} requests remaining
          ({percentage.toFixed(1)}% left).
          {timeUntilReset > 0 && ` Resets in ${timeUntilReset} minutes.`}
        </p>

        {isDemo && percentage < 10 && onAuthClick && (
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <p className="text-sm">
              Sign in with GitHub for your personal rate limit (5000 req/hour).
            </p>
            <Button onClick={onAuthClick} variant="outline" size="sm">
              Sign in with GitHub
            </Button>
          </div>
        )}

        {!isDemo && onLogoutClick && (
          <Button onClick={onLogoutClick} variant="ghost" size="sm">
            Sign out
          </Button>
        )}
      </AlertDescription>
    </Alert>
  )
}
```

#### Update App.tsx

**File:** `src/App.tsx`

```typescript
export function App() {
  const [rateLimit, setRateLimit] = useState({
    remaining: 5000,
    limit: 5000,
    reset: 0,
    isDemo: true,
  })
  const [showAuthModal, setShowAuthModal] = useState(false)

  const handleGitHubAuth = () => {
    // Redirect to OAuth login endpoint
    window.location.href = '/api/auth/login'
  }

  const handleLogout = () => {
    window.location.href = '/api/auth/logout'
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold">GitHub User Analytics</h1>

        <RateLimitBanner
          remaining={rateLimit.remaining}
          limit={rateLimit.limit}
          reset={rateLimit.reset}
          isDemo={rateLimit.isDemo}
          onAuthClick={() => setShowAuthModal(true)}
          onLogoutClick={handleLogout}
        />
      </header>

      {/* ... rest of app ... */}

      <AuthRequiredModal
        open={showAuthModal}
        onOpenChange={setShowAuthModal}
        onGitHubAuth={handleGitHubAuth}
        remaining={rateLimit.remaining}
        limit={rateLimit.limit}
      />
    </div>
  )
}
```

---

### Step 7.5: Add Authentication Indicator

**File:** `src/components/layout/UserMenu.tsx`

```typescript
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { User, LogOut } from 'lucide-react'

export interface UserMenuProps {
  isAuthenticated: boolean
  user?: {
    login: string
    avatarUrl: string
  }
  onSignIn: () => void
  onSignOut: () => void
}

export function UserMenu({
  isAuthenticated,
  user,
  onSignIn,
  onSignOut,
}: UserMenuProps) {
  if (!isAuthenticated) {
    return (
      <Button onClick={onSignIn} variant="outline" size="sm">
        <User className="mr-2 h-4 w-4" />
        Sign in
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar>
            <AvatarImage src={user?.avatarUrl} alt={user?.login} />
            <AvatarFallback>{user?.login?.[0]?.toUpperCase()}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>@{user?.login}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
```

---

## ✅ Deliverables

**Backend:**

- [ ] GitHub OAuth App registered
- [ ] Environment variables configured (`GITHUB_OAUTH_CLIENT_ID`, `GITHUB_OAUTH_CLIENT_SECRET`)
- [ ] `/api/auth/login` endpoint created
- [ ] `/api/auth/callback` endpoint created (with CSRF protection)
- [ ] `/api/auth/logout` endpoint created
- [ ] Session management with Vercel KV (30-day TTL)
- [ ] `httpOnly` cookies for secure session storage
- [ ] Updated `api/github-proxy.ts` to use user tokens

**Frontend:**

- [ ] `RateLimitBanner` updated with `isDemo` and logout support
- [ ] `UserMenu` component created for auth indicator
- [ ] `App.tsx` updated with auth handlers
- [ ] Auth state management (demo vs authenticated)
- [ ] Storybook stories for `UserMenu` component
- [ ] Tests for `UserMenu` component

**Testing:**

- [ ] OAuth flow tested locally with `vercel dev`
- [ ] Session persistence tested (cookies, KV storage)
- [ ] Rate limit behavior tested (demo vs authenticated)
- [ ] Logout flow tested
- [ ] Token refresh handling (if needed)

**Security:**

- [ ] Client Secret NOT in client bundle
- [ ] Session tokens stored server-side only
- [ ] `httpOnly` cookies used for sessions
- [ ] CSRF protection with `state` parameter
- [ ] OAuth scope limited to `read:user user:email`

**Documentation:**

- [ ] Update CLAUDE.md with OAuth setup instructions
- [ ] Add OAuth troubleshooting guide
- [ ] Document demo vs authenticated mode behavior

---

## 🧪 Testing Strategy

### Test OAuth Flow

```bash
# 1. Start local dev server
vercel dev

# 2. Visit http://localhost:3000

# 3. Click "Sign in with GitHub"

# 4. Authorize app on GitHub

# 5. Verify redirect to callback

# 6. Check session cookie in DevTools

# 7. Verify authenticated requests use user token

# 8. Test logout and session clearing
```

### Test Rate Limits

```typescript
// Mock rate limit responses for testing
describe("Rate Limit Behavior", () => {
  it("uses demo token when not authenticated", async () => {
    // Verify demo mode uses GITHUB_TOKEN
  });

  it("uses user token when authenticated", async () => {
    // Verify authenticated mode uses session token
  });

  it("falls back to demo token if session expired", async () => {
    // Test graceful degradation
  });
});
```

---

## 📊 Success Criteria

**Functional:**

- [ ] Users can sign in with GitHub OAuth
- [ ] Authenticated users get personal rate limits
- [ ] Demo mode still works for unauthenticated users
- [ ] Session persists across page refreshes
- [ ] Logout clears session and cookies
- [ ] Rate limit banner shows correct mode (demo vs auth)

**Security:**

- [ ] No secrets exposed in client bundle
- [ ] Sessions stored securely server-side
- [ ] CSRF protection implemented
- [ ] OAuth tokens never sent to client

**UX:**

- [ ] Seamless transition from demo to authenticated
- [ ] Clear indication of auth status
- [ ] No functionality loss in demo mode
- [ ] "Try before you auth" flow works smoothly

**Performance:**

- [ ] OAuth flow completes in <3 seconds
- [ ] Session lookup adds <50ms latency
- [ ] KV session storage performant

---

## 🔄 Rollback Plan

**If OAuth fails in production:**

1. **Disable OAuth Endpoints:**

   ```bash
   # Remove OAuth endpoints temporarily
   mv api/auth api/auth.disabled
   vercel --prod
   ```

2. **Revert to Demo Mode:**
   - All users fall back to demo mode automatically
   - No functionality loss (rate limits shared)

3. **Debug Offline:**
   - Test OAuth flow in staging
   - Fix issues with session management
   - Re-deploy when stable

---

## 🚀 Future Enhancements (Post-Phase 7)

**Phase 8: User Profiles (Optional)**

- Save favorite GitHub users
- Compare users side-by-side
- Historical tracking of metrics over time
- Email notifications for changes

**Phase 9: Private Repositories (Optional)**

- Request `repo` scope (with user consent)
- Analyze private repositories
- Team analytics

**Phase 10: Admin Dashboard (Optional)**

- Monitor rate limit usage across all users
- Analytics on app usage
- Performance metrics

---

## 📚 Resources

**GitHub OAuth:**

- [GitHub OAuth Documentation](https://docs.github.com/en/developers/apps/building-oauth-apps/authorizing-oauth-apps)
- [OAuth Best Practices](https://datatracker.ietf.org/doc/html/rfc6749)

**Vercel:**

- [Serverless Functions](https://vercel.com/docs/functions)
- [Vercel KV Sessions](https://vercel.com/docs/storage/vercel-kv/using-with-sessions)

**Security:**

- [httpOnly Cookies](https://owasp.org/www-community/HttpOnly)
- [CSRF Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html)

---

**Last Updated:** 2025-11-17
**Status:** Ready for Implementation (Optional)
**Next Phase:** None (Phase 7 is final optional phase)
