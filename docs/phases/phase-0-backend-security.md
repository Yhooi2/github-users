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

---

## ✅ Deliverables

**Backend:**
- [x] `api/github-proxy.ts` created with Vercel KV caching
- [x] `.env` configured (server-side `GITHUB_TOKEN`)
- [x] Request validation (POST only, error handling)

**Apollo Client:**
- [x] Custom `cacheKeyLink` for context extraction
- [x] `HttpLink` with `includeExtensions: true` (**CRITICAL**)
- [x] Custom `fetch` to move cacheKey to top-level body
- [x] Link chain: `cacheKeyLink → errorLink → httpLink`

**Testing:**
- [x] Integration tests: `src/apollo/cacheKey.integration.test.tsx` (3/3 passing)
- [x] Unit tests: `src/apollo/ApolloAppProvider.test.tsx` (13/13 passing)
- [x] Verify cacheKey in request body structure
- [x] Verify no circular structure errors

**Security:**
- [x] Token NOT visible in DevTools → Sources
- [x] Token NOT in client bundle (`grep -r "ghp_" dist/`)
- [x] All requests go through `/api/github-proxy`

**Deployment:**
- [ ] Deployed to Vercel (with `GITHUB_TOKEN` env var)
- [ ] Vercel KV configured (optional, for caching)
- [ ] Tested in production with real GitHub token

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

- [ ] Real GitHub token added to environment
- [ ] Application tested locally OR deployed to Vercel
- [ ] User search functionality works
- [ ] `/api/github-proxy` endpoint responds correctly
- [ ] Token NOT visible in browser DevTools
- [ ] No errors in console or Vercel logs
- [ ] (Optional) Caching works (see HIT/SET in logs)

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
