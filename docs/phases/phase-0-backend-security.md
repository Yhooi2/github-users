# Phase 0: Backend Security Layer

**Priority:** P0 (Critical - Blocks Production)
**Estimated Time:** 2 days
**Status:** Ready for Implementation

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

**Change:**
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

---

## ✅ Deliverables

- [ ] `api/github-proxy.ts` created
- [ ] `.env` configured (server-side)
- [ ] Apollo Client `HttpLink` URI updated to `/api/github-proxy`
- [ ] Token NOT visible in DevTools
- [ ] Caching functional (check logs)
- [ ] Deployed to Vercel Free tier

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

**Next Phase:** [Phase 1: GraphQL Multi-Query Architecture](./phase-1-graphql-multi-query.md)
