# Phase 0: Backend Security Layer

**Priority:** P0 (Critical - Blocks Production)
**Estimated Time:** 2 days
**Status:** ✅ **IMPLEMENTED** - ⏳ **TESTING REQUIRED**

**Implementation Date:** 2025-11-17
**Commits:**
- `98d068e` - feat(security): Implement Phase 0 - Backend Security Layer
- `42ccb0e` - test(phase-0): Add testing artifacts and validation

**Test Results:** See [PHASE_0_TEST_RESULTS.md](../PHASE_0_TEST_RESULTS.md)

**⚠️ REQUIRED BEFORE PHASE 1:**
1. Test with real GitHub token via `vercel dev`
2. Deploy to Vercel and validate in production

---

## 🤖 Recommended Agents

**Before starting:**
- **Explore agent:** "Find all uses of VITE_GITHUB_TOKEN in the codebase"
- **Plan agent:** "Create step-by-step checklist for Phase 0"

**During implementation:**
- **general-purpose agent:** "Implement Step 0.1 - create api/github-proxy.ts"
- **general-purpose agent:** "Implement Step 0.2 - setup environment variables"
- **general-purpose agent:** "Implement Step 0.3 - update Apollo Client"

**After implementation:**
- **debug-specialist agent:** "Fix any errors from Vercel deployment"
- **code-review-specialist agent:** "Verify token is not exposed in bundle"

**Testing:**
```bash
Explore agent: "Verify grep -r 'ghp_' dist/assets/*.js returns nothing"
```

---

## 🔴 Critical Security Issue

### Current Problem

**Token Exposure in Client Bundle:**
```typescript
// src/apollo/ApolloAppProvider.tsx - CURRENT STATE (INSECURE)
const authLink = setContext((_, { headers }) => {
  const token = import.meta.env.VITE_GITHUB_TOKEN || // ← EXPOSED IN BUNDLE!
                localStorage.getItem('github_token');
  // ...
});
```

**Evidence:**
```bash
npm run build
grep -r "ghp_" dist/assets/*.js  # ← Token found in plain text!
```

**Impact:**
- ❌ Anyone can steal token from bundle (View Source → Search "ghp_")
- ❌ Rate limit exhaustion risk (5000 requests/hour shared)
- ❌ Security breach if token has extra scopes
- ❌ Cannot deploy to production

**Why This Happened:**
- Vite variables with `VITE_` prefix are bundled into client code
- By design for client-side config, but NOT for secrets
- Current implementation was acceptable for local development only

---

## ✅ Solution: Backend Proxy

Move GitHub API token to server-side Vercel Function.

**Flow:**
1. Client sends GraphQL query to `/api/github-proxy` (no token)
2. Server adds token from environment
3. Server forwards request to GitHub API
4. Server returns result (with caching)
5. Token never leaves server environment

---

## 📋 Implementation Steps

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

    // Extract rate limit information from GitHub API response headers
    const rateLimit = {
      remaining: parseInt(response.headers.get('X-RateLimit-Remaining') || '0', 10),
      limit: parseInt(response.headers.get('X-RateLimit-Limit') || '5000', 10),
      reset: parseInt(response.headers.get('X-RateLimit-Reset') || '0', 10),
      used: parseInt(response.headers.get('X-RateLimit-Used') || '0', 10),
    }

    // Log warning if rate limit is low (< 10% remaining)
    const percentRemaining = (rateLimit.remaining / rateLimit.limit) * 100
    if (percentRemaining < 10) {
      console.warn(`⚠️ Rate limit low: ${rateLimit.remaining}/${rateLimit.limit} (${percentRemaining.toFixed(1)}%)`)
    }

    // Prepare response with rate limit information
    const responseData = {
      ...data,
      rateLimit, // Include rate limit info in response
    }

    // Cache result for 30 minutes
    if (cacheKey) {
      await kv.set(cacheKey, responseData, { ex: 1800 })
      console.log(`Cache SET: ${cacheKey}`)
    }

    return res.status(200).json(responseData)
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

**CRITICAL:** Apollo Client requires custom link chain to pass `cacheKey` to backend.

#### Step 0.3.1: Create cacheKey extraction link

```typescript
import { ApolloLink } from '@apollo/client'

// Extract cacheKey from operation.context and add to extensions
const cacheKeyLink = new ApolloLink((operation, forward) => {
  const { cacheKey } = operation.getContext()

  if (cacheKey) {
    operation.extensions = {
      ...operation.extensions,
      cacheKey,
    }
  }

  return forward(operation)
})
```

**Why needed:** Apollo Client doesn't automatically pass `context` to HTTP layer. We extract `cacheKey` from context and add to `extensions`, which CAN be sent in request body.

#### Step 0.3.2: Create HTTP link with includeExtensions

```typescript
import { createHttpLink } from '@apollo/client'

const httpLink = createHttpLink({
  uri: '/api/github-proxy',
  includeExtensions: true, // ← CRITICAL! Without this, extensions are NOT sent!
  fetch: (uri, options) => {
    // Extract cacheKey from extensions and add to top-level body
    const body = JSON.parse(options?.body as string || '{}')
    const extensions = body.extensions || {}
    const cacheKey = extensions.cacheKey

    // Create new body with cacheKey at top level (for backend proxy)
    const newBody = {
      query: body.query,
      variables: body.variables,
      ...(cacheKey && { cacheKey }),
    }

    return fetch(uri, {
      ...options,
      body: JSON.stringify(newBody),
    })
  },
})
```

**Why custom fetch:** Backend proxy expects `cacheKey` at top-level of body, not nested in `extensions`.

#### Step 0.3.3: Combine links

```typescript
import { ApolloLink } from '@apollo/client'
import { onError } from '@apollo/client/link/error'

// Error handling link (existing)
const errorLink = onError(({ graphQLErrors, networkError }) => {
  // ... error handling
})

// Combine: cacheKeyLink → errorLink → httpLink
const link = ApolloLink.from([cacheKeyLink, errorLink, httpLink])

const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
})
```

**Link chain order matters:**
1. `cacheKeyLink` - extracts cacheKey from context
2. `errorLink` - handles errors
3. `httpLink` - sends HTTP request with cacheKey

#### Step 0.3.4: Update queries to include cacheKey

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

**Cache key format:** `user:{username}:{dataType}`

**Examples:**
- `user:octocat:profile` - user profile data
- `user:octocat:year:2023` - contributions for 2023
- `user:torvalds:year:2024` - contributions for 2024

**Test:**
```bash
npm run dev
# Search for a user
# Check Vercel Functions logs for cache HIT/SET
```

**MCP Check After:**
- Query Context7: "Apollo Client context caching patterns"

---

### Step 0.3.5: Add Integration Tests (CRITICAL)

**File:** `src/apollo/cacheKey.integration.test.tsx`

**Why integration tests:**
- ❌ Unit tests with MockedProvider DON'T test HTTP layer
- ❌ Unit tests DON'T catch `includeExtensions: true` missing
- ❌ Unit tests DON'T verify request body structure
- ✅ Integration tests catch real Apollo Client behavior

**Required test cases:**

```typescript
describe('Apollo Client cacheKey Integration', () => {
  it('should pass cacheKey from context to request body', async () => {
    // CRITICAL: Verify cacheKey is in top-level body
    expect(requestBody).toHaveProperty('cacheKey', 'user:testuser:profile')
  })

  it('should NOT include cacheKey if not provided in context', async () => {
    // Verify optional cacheKey handling
    expect(requestBody).not.toHaveProperty('cacheKey')
  })

  it('should NOT cause circular structure error with context objects', async () => {
    // Verify no JSON serialization errors
    await expect(query()).resolves.not.toThrow()
  })
})
```

**Key requirements:**
- ✅ Mock `global.fetch` to intercept HTTP requests
- ✅ Parse request body to verify structure
- ✅ Test with AND without cacheKey in context
- ✅ Verify no circular reference errors

**See:** `src/apollo/cacheKey.integration.test.tsx` for full implementation

---

### Step 0.4: Create Rate Limit Monitoring UI

**Goal:** Display rate limit warnings and auth prompts to users when demo limits are reached.

**Strategy:** Demo mode uses server-side token (5000 req/hour). Show warning at <10% remaining, block at 0.

---

#### Step 0.4.1: RateLimitBanner Component

**File:** `src/components/layout/RateLimitBanner.tsx`

```typescript
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { AlertTriangle, Info } from 'lucide-react'

export interface RateLimitBannerProps {
  remaining: number
  limit: number
  reset: number // Unix timestamp
  onAuthClick?: () => void
}

export function RateLimitBanner({
  remaining,
  limit,
  reset,
  onAuthClick,
}: RateLimitBannerProps) {
  const percentage = (remaining / limit) * 100
  const resetDate = new Date(reset * 1000)
  const timeUntilReset = Math.ceil((resetDate.getTime() - Date.now()) / 1000 / 60)

  // Only show if < 10% remaining
  if (percentage >= 10) return null

  const variant = percentage < 5 ? 'destructive' : 'default'
  const Icon = percentage < 5 ? AlertTriangle : Info

  return (
    <Alert variant={variant} className="mb-4">
      <Icon className="h-4 w-4" />
      <AlertTitle>
        {percentage < 5
          ? '⚠️ Demo limit almost exhausted'
          : '📊 Demo mode active'}
      </AlertTitle>
      <AlertDescription className="mt-2 space-y-2">
        <p>
          {remaining} of {limit} requests remaining
          ({percentage.toFixed(1)}% left).
          {timeUntilReset > 0 && ` Resets in ${timeUntilReset} minutes.`}
        </p>

        {onAuthClick && (
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <p className="text-sm">
              Sign in with GitHub for your personal rate limit (5000 req/hour).
            </p>
            <Button
              onClick={onAuthClick}
              variant={percentage < 5 ? 'default' : 'outline'}
              size="sm"
            >
              Sign in with GitHub
            </Button>
          </div>
        )}
      </AlertDescription>
    </Alert>
  )
}
```

**Storybook:** `src/components/layout/RateLimitBanner.stories.tsx`

```typescript
import type { Meta, StoryObj } from '@storybook/react'
import { RateLimitBanner } from './RateLimitBanner'

const meta: Meta<typeof RateLimitBanner> = {
  title: 'Layout/RateLimitBanner',
  component: RateLimitBanner,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof RateLimitBanner>

const oneHourFromNow = Math.floor(Date.now() / 1000) + 3600

export const WarningState: Story = {
  args: {
    remaining: 450,
    limit: 5000,
    reset: oneHourFromNow,
    onAuthClick: () => console.log('Auth clicked'),
  },
}

export const CriticalState: Story = {
  args: {
    remaining: 100,
    limit: 5000,
    reset: oneHourFromNow,
    onAuthClick: () => console.log('Auth clicked'),
  },
}

export const Hidden: Story = {
  args: {
    remaining: 4500,
    limit: 5000,
    reset: oneHourFromNow,
  },
}
```

**Tests:** `src/components/layout/RateLimitBanner.test.tsx`

```typescript
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { RateLimitBanner } from './RateLimitBanner'

describe('RateLimitBanner', () => {
  const oneHourFromNow = Math.floor(Date.now() / 1000) + 3600

  it('does not render when remaining > 10%', () => {
    const { container } = render(
      <RateLimitBanner remaining={4500} limit={5000} reset={oneHourFromNow} />
    )
    expect(container).toBeEmptyDOMElement()
  })

  it('renders warning state when remaining < 10%', () => {
    render(
      <RateLimitBanner remaining={450} limit={5000} reset={oneHourFromNow} />
    )
    expect(screen.getByText(/Demo mode active/i)).toBeInTheDocument()
    expect(screen.getByText(/450 of 5000 requests remaining/i)).toBeInTheDocument()
  })

  it('renders critical state when remaining < 5%', () => {
    render(
      <RateLimitBanner remaining={100} limit={5000} reset={oneHourFromNow} />
    )
    expect(screen.getByText(/Demo limit almost exhausted/i)).toBeInTheDocument()
  })

  it('calls onAuthClick when sign in button clicked', () => {
    const handleAuth = vi.fn()
    render(
      <RateLimitBanner
        remaining={450}
        limit={5000}
        reset={oneHourFromNow}
        onAuthClick={handleAuth}
      />
    )

    fireEvent.click(screen.getByRole('button', { name: /sign in with github/i }))
    expect(handleAuth).toHaveBeenCalledTimes(1)
  })

  it('displays time until reset', () => {
    render(
      <RateLimitBanner remaining={450} limit={5000} reset={oneHourFromNow} />
    )
    expect(screen.getByText(/Resets in \d+ minutes/i)).toBeInTheDocument()
  })
})
```

---

#### Step 0.4.2: AuthRequiredModal Component

**File:** `src/components/auth/AuthRequiredModal.tsx`

```typescript
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Github, Zap, Shield, Star } from 'lucide-react'

export interface AuthRequiredModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onGitHubAuth: () => void
  remaining: number
  limit: number
}

export function AuthRequiredModal({
  open,
  onOpenChange,
  onGitHubAuth,
  remaining,
  limit,
}: AuthRequiredModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            ⚠️ Demo limit reached
          </DialogTitle>
          <DialogDescription className="text-base">
            You've used {limit - remaining} of {limit} demo requests.
            Sign in with your GitHub account to continue with higher limits.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Benefits */}
          <div className="rounded-lg border bg-muted/50 p-4">
            <h4 className="mb-3 font-semibold">Why sign in with GitHub?</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <Zap className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                <span>
                  <strong>5,000 requests/hour</strong> with your personal rate limit
                  (vs 5,000/hour shared in demo)
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Shield className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                <span>
                  <strong>Secure</strong> - We only request read-only access to your public profile
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Star className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                <span>
                  <strong>Future features</strong> - Save favorites, compare users, and more
                </span>
              </li>
            </ul>
          </div>

          {/* Auth Button */}
          <Button
            onClick={onGitHubAuth}
            className="w-full"
            size="lg"
          >
            <Github className="mr-2 h-5 w-5" />
            Continue with GitHub
          </Button>

          {/* Privacy Note */}
          <p className="text-center text-xs text-muted-foreground">
            By signing in, you agree to our terms.
            We'll never post on your behalf or access private data.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
```

**Storybook:** `src/components/auth/AuthRequiredModal.stories.tsx`

```typescript
import type { Meta, StoryObj } from '@storybook/react'
import { AuthRequiredModal } from './AuthRequiredModal'

const meta: Meta<typeof AuthRequiredModal> = {
  title: 'Auth/AuthRequiredModal',
  component: AuthRequiredModal,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof AuthRequiredModal>

export const Default: Story = {
  args: {
    open: true,
    onOpenChange: (open) => console.log('Modal open changed:', open),
    onGitHubAuth: () => console.log('GitHub auth clicked'),
    remaining: 0,
    limit: 5000,
  },
}

export const PartiallyUsed: Story = {
  args: {
    ...Default.args,
    remaining: 50,
  },
}
```

**Tests:** `src/components/auth/AuthRequiredModal.test.tsx`

```typescript
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { AuthRequiredModal } from './AuthRequiredModal'

describe('AuthRequiredModal', () => {
  it('renders when open is true', () => {
    render(
      <AuthRequiredModal
        open={true}
        onOpenChange={() => {}}
        onGitHubAuth={() => {}}
        remaining={0}
        limit={5000}
      />
    )

    expect(screen.getByText(/Demo limit reached/i)).toBeInTheDocument()
    expect(screen.getByText(/5,000 requests\/hour/i)).toBeInTheDocument()
  })

  it('calls onGitHubAuth when auth button clicked', () => {
    const handleAuth = vi.fn()
    render(
      <AuthRequiredModal
        open={true}
        onOpenChange={() => {}}
        onGitHubAuth={handleAuth}
        remaining={0}
        limit={5000}
      />
    )

    fireEvent.click(screen.getByRole('button', { name: /continue with github/i }))
    expect(handleAuth).toHaveBeenCalledTimes(1)
  })

  it('displays used requests correctly', () => {
    render(
      <AuthRequiredModal
        open={true}
        onOpenChange={() => {}}
        onGitHubAuth={() => {}}
        remaining={100}
        limit={5000}
      />
    )

    expect(screen.getByText(/used 4900 of 5000 demo requests/i)).toBeInTheDocument()
  })

  it('shows privacy note', () => {
    render(
      <AuthRequiredModal
        open={true}
        onOpenChange={() => {}}
        onGitHubAuth={() => {}}
        remaining={0}
        limit={5000}
      />
    )

    expect(screen.getByText(/never post on your behalf/i)).toBeInTheDocument()
  })
})
```

---

#### Step 0.4.3: Integrate Rate Limit Display

**File:** `src/App.tsx`

```typescript
import { RateLimitBanner } from '@/components/layout/RateLimitBanner'
import { AuthRequiredModal } from '@/components/auth/AuthRequiredModal'
import { useState } from 'react'

export function App() {
  const [rateLimit, setRateLimit] = useState({ remaining: 5000, limit: 5000, reset: 0 })
  const [showAuthModal, setShowAuthModal] = useState(false)

  // Extract rate limit from Apollo Client response
  const handleQueryCompleted = (data: any) => {
    if (data.rateLimit) {
      setRateLimit(data.rateLimit)

      // Show modal if exhausted
      if (data.rateLimit.remaining === 0) {
        setShowAuthModal(true)
      }
    }
  }

  const handleGitHubAuth = () => {
    // TODO: Implement OAuth flow in Phase 7
    console.log('GitHub OAuth not yet implemented')
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold">GitHub User Analytics</h1>

        {/* Rate Limit Banner */}
        <RateLimitBanner
          remaining={rateLimit.remaining}
          limit={rateLimit.limit}
          reset={rateLimit.reset}
          onAuthClick={() => setShowAuthModal(true)}
        />
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4">
        {/* ... existing app content ... */}
      </main>

      {/* Auth Required Modal */}
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

**Note:** Full OAuth implementation will be in Phase 7. For now, components are ready with placeholder handler.

---

### Step 0.5: Deploy to Vercel

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

---

## ✅ Deliverables

**Backend:**
- [x] `api/github-proxy.ts` created with Vercel KV caching
- [x] Rate limit extraction from GitHub API headers
- [x] Rate limit included in all responses
- [x] Warning log when rate limit < 10%
- [x] `.env` configured (server-side `GITHUB_TOKEN`)
- [x] Request validation (POST only, error handling)

**Apollo Client:**
- [x] Custom `cacheKeyLink` for context extraction
- [x] `HttpLink` with `includeExtensions: true` (**CRITICAL**)
- [x] Custom `fetch` to move cacheKey to top-level body
- [x] Link chain: `cacheKeyLink → errorLink → httpLink`

**UI Components (Rate Limit Monitoring):**
- [ ] `RateLimitBanner` component with Storybook stories
- [ ] `RateLimitBanner` tests (5 test cases)
- [ ] `AuthRequiredModal` component with Storybook stories
- [ ] `AuthRequiredModal` tests (4 test cases)
- [ ] Integration in `App.tsx` with rate limit state management
- [ ] Banner shows warning at <10% remaining
- [ ] Modal appears when rate limit exhausted (0 remaining)
- [ ] Placeholder OAuth handler (implementation in Phase 7)

**Testing:**
- [x] Integration tests: `src/apollo/cacheKey.integration.test.tsx` (3/3 passing)
- [x] Unit tests: `src/apollo/ApolloAppProvider.test.tsx` (13/13 passing)
- [x] Verify cacheKey in request body structure
- [x] Verify no circular structure errors
- [ ] `RateLimitBanner` tests passing (5/5)
- [ ] `AuthRequiredModal` tests passing (4/4)

**Security:**
- [x] Token NOT visible in DevTools → Sources
- [x] Token NOT in client bundle (`grep -r "ghp_" dist/`)
- [x] All requests go through `/api/github-proxy`

**Deployment:**
- [ ] Deployed to Vercel (with `GITHUB_TOKEN` env var)
- [ ] Vercel KV configured (optional, for caching)
- [ ] Tested in production with real GitHub token
- [ ] Rate limit monitoring verified in production

---

## 📊 Performance Impact

**Expected:**
- Proxy adds ~50-100ms latency
- Cache hit reduces response time to <200ms
- First request per user: ~800ms (same as before)
- Subsequent requests: ~150ms (cache hit)

**Monitoring:**
```bash
# Check Vercel logs
vercel logs --follow

# Monitor rate limits
curl -H "Authorization: Bearer $GITHUB_TOKEN" \
  https://api.github.com/rate_limit
```

---

## 🔄 Rollback Plan

**If backend proxy fails:**

1. **Revert to Client-Side GraphQL:**
   ```typescript
   const httpLink = createHttpLink({
     uri: 'https://api.github.com/graphql', // Bypass proxy
   })
   ```

2. **Restore PAT in Environment:**
   - Re-enable `VITE_GITHUB_TOKEN` in `.env.local`
   - Deploy with token (temporary security compromise)

3. **Monitor Rate Limits:**
   - Check GitHub API quota
   - If exhausted, wait 1 hour or use different token

4. **Verify Functionality:**
   - Test user search (e2e/user-search.spec.ts)
   - Confirm no CORS errors

**Prevention:**
- Test backend proxy locally with `vercel dev` before deployment
- Set up Vercel KV in staging environment first
- Monitor Vercel logs: `vercel logs --follow`

---

## 📚 Resources

**Vercel Docs:**
- [Serverless Functions](https://vercel.com/docs/functions)
- [Vercel KV](https://vercel.com/docs/storage/vercel-kv)
- [Environment Variables](https://vercel.com/docs/projects/environment-variables)

**Apollo Client:**
- [Link Context](https://www.apollographql.com/docs/react/api/link/apollo-link-context/)
- [HTTP Link](https://www.apollographql.com/docs/react/api/link/apollo-link-http/)

---

## 🧪 Testing Phase 0 (REQUIRED BEFORE PHASE 1)

### ✅ Implementation Complete

**Completed Items:**
- ✅ `api/github-proxy.ts` serverless function created
- ✅ Apollo Client updated to use `/api/github-proxy`
- ✅ Token security validated (no exposure in build)
- ✅ Unit tests passing (12/12)
- ✅ Proxy logic validated via `test-proxy.mjs`

### ⏳ Testing Required

**Before proceeding to Phase 1, you MUST complete ONE of the following:**

#### Option A: Local Testing (Recommended First)

```bash
# 1. Add your GitHub Personal Access Token
# Edit .env.local:
GITHUB_TOKEN=ghp_your_actual_github_token_here

# 2. Install Vercel CLI (if not already installed)
npm install -g vercel

# 3. Start Vercel dev server
vercel dev

# 4. Test the application
# - Open http://localhost:3000
# - Search for a GitHub user (e.g., "torvalds")
# - Open DevTools → Network tab
# - Verify:
#   ✅ Requests go to /api/github-proxy (NOT api.github.com)
#   ✅ User data loads correctly
#   ✅ No errors in console

# 5. Check Vercel Function logs
# - Look for: "Cache HIT" or "Cache SET" messages
# - Verify proxy is working
```

**Expected Result:** User search works, proxy logs appear, no token visible in DevTools.

#### Option B: Production Deployment

```bash
# 1. Login to Vercel
vercel login

# 2. Deploy to production
vercel --prod

# 3. Configure environment variables
# - Go to: Vercel Dashboard → Your Project → Settings → Environment Variables
# - Add: GITHUB_TOKEN = ghp_your_token_here
# - (Optional) Add Vercel KV credentials for caching

# 4. Test deployed application
# - Visit your deployed URL
# - Search for GitHub users
# - Verify functionality works
# - Check Vercel Function logs for cache activity

# 5. Security verification
# - Open DevTools → Sources
# - Search for "ghp_" in all files
# - Expected: NO token found ✅
```

**Expected Result:** Production app works, token secured, caching functional.

### 📊 Validation Checklist

Before moving to Phase 1, confirm:

**Backend & Security:**
- [ ] Real GitHub token added to environment
- [ ] Application tested locally OR deployed to Vercel
- [ ] User search functionality works
- [ ] `/api/github-proxy` endpoint responds correctly
- [ ] Token NOT visible in browser DevTools
- [ ] No errors in console or Vercel logs
- [ ] (Optional) Caching works (see HIT/SET in logs)

**Rate Limit Monitoring:**
- [ ] Rate limit data returned in all API responses
- [ ] `RateLimitBanner` component created and tested
- [ ] `AuthRequiredModal` component created and tested
- [ ] Banner appears when rate limit <10% (test with mock data)
- [ ] Modal appears when rate limit exhausted
- [ ] Rate limit reset time displayed correctly
- [ ] OAuth placeholder button present (implementation in Phase 7)

### 🚨 If Testing Fails

**Common Issues:**

1. **"GITHUB_TOKEN not configured" error**
   - Solution: Add token to `.env.local` (local) or Vercel Dashboard (production)

2. **"Failed to parse URL from /api/github-proxy"**
   - Solution: Use `vercel dev` (not `npm run dev`) for local testing

3. **CORS errors**
   - Solution: Verify `vercel.json` configuration is present

4. **Token still visible in bundle**
   - Solution: Run `npm run build` and re-verify with `grep -r "ghp_" dist/`

**Need Help?** See [PHASE_0_TEST_RESULTS.md](../PHASE_0_TEST_RESULTS.md) for detailed test scenarios.

---

**Next Phase:** ⏳ **BLOCKED until Phase 0 testing complete**

**After Testing:** [Phase 1: GraphQL Multi-Query Architecture](./phase-1-graphql-multi-query.md)
