# Phase 0: Production Testing Guide

**Date:** 2025-11-17
**Status:** Ready for Testing
**Required Before:** Phase 1 implementation

---

## 📋 Overview

Phase 0 implementation is **complete**. All backend security features and rate limit monitoring UI components have been implemented and tested locally.

**Before proceeding to Phase 1**, you must verify the implementation works correctly in production with a real GitHub token.

---

## ✅ Implementation Summary

### What's Been Completed

**Backend Security:**

- ✅ Serverless function: `api/github-proxy.ts`
- ✅ Token secured on server-side (never exposed in client)
- ✅ Vercel KV caching logic implemented
- ✅ Rate limit extraction from GitHub API headers
- ✅ Apollo Client updated to use proxy endpoint

**UI Components:**

- ✅ `RateLimitBanner` - Shows warning at <10% remaining
- ✅ `AuthRequiredModal` - Prompts for OAuth when exhausted
- ✅ `Dialog` UI component - Radix UI primitive
- ✅ Integration in `App.tsx` with state management

**Testing:**

- ✅ 9 new unit tests (all passing)
- ✅ Storybook stories for both components
- ✅ Test coverage maintained at >90%
- ✅ No token exposure verified via build analysis

---

## 🧪 Production Testing Checklist

### Option A: Local Testing with Vercel Dev (Recommended First)

#### Step 1: Environment Setup

```bash
# 1. Create .env.local file in project root
cat > .env.local << EOF
GITHUB_TOKEN=ghp_your_actual_github_token_here
EOF

# Note: Replace ghp_your_actual_github_token_here with your real token
```

**How to get a GitHub token:**

1. Go to [GitHub Settings → Developer Settings → Personal Access Tokens → Tokens (classic)](https://github.com/settings/tokens)
2. Click "Generate new token (classic)"
3. Select scopes: `read:user`, `user:email`
4. Copy the token immediately (you won't see it again)

#### Step 2: Install Vercel CLI

```bash
# Install globally
npm install -g vercel

# Verify installation
vercel --version
```

#### Step 3: Start Vercel Dev Server

```bash
# Start development server
vercel dev

# Expected output:
# > Ready! Available at http://localhost:3000
```

#### Step 4: Test Application

**Test Scenario 1: User Search**

1. Open http://localhost:3000
2. Search for a GitHub user (e.g., "torvalds")
3. Verify user data loads correctly

**Test Scenario 2: Network Inspection**

1. Open DevTools → Network tab
2. Search for a user
3. Verify:
   - ✅ Requests go to `/api/github-proxy` (NOT `api.github.com`)
   - ✅ Response includes user data
   - ✅ No CORS errors

**Test Scenario 3: Token Security**

1. Open DevTools → Sources tab
2. Search for "ghp\_" in all files
3. Expected result: **0 matches** ✅

**Test Scenario 4: Vercel Function Logs**

1. Check terminal where `vercel dev` is running
2. Look for log messages:
   - `Cache HIT: user:username:profile` (on repeat searches)
   - `Cache SET: user:username:profile` (on first search)
3. Verify caching is working

**Test Scenario 5: Rate Limit UI** (Simulated)

1. Since you can't easily exhaust rate limit, test with browser DevTools:
2. Edit `App.tsx` temporarily:
   ```typescript
   // Temporary for testing - set low rate limit
   const [rateLimit, setRateLimit] = useState({
     remaining: 450, // <10% of 5000
     limit: 5000,
     reset: Math.floor(Date.now() / 1000) + 3600,
   });
   ```
3. Refresh page → **RateLimitBanner should appear** ✅
4. Change `remaining: 100` → **Banner should turn red (critical)** ✅
5. Change `remaining: 0` → **AuthRequiredModal should open** ✅
6. Revert changes after testing

#### Step 5: Validation Checklist

- [ ] User search works with real GitHub token
- [ ] `/api/github-proxy` endpoint responds correctly
- [ ] Token NOT visible in DevTools → Sources
- [ ] Vercel function logs show cache activity
- [ ] No errors in browser console
- [ ] No errors in Vercel dev terminal
- [ ] RateLimitBanner appears when simulated <10%
- [ ] AuthRequiredModal opens when simulated 0 remaining

---

### Option B: Production Deployment to Vercel

#### Step 1: Login to Vercel

```bash
# Login via CLI
vercel login

# Follow prompts to authenticate
```

#### Step 2: Deploy to Production

```bash
# Deploy from project root
vercel --prod

# Expected output:
# ✅ Production: https://your-app.vercel.app [copied to clipboard]
```

#### Step 3: Configure Environment Variables

**Via Vercel Dashboard:**

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Select your project
3. Navigate to: **Settings → Environment Variables**
4. Add variable:
   - **Name:** `GITHUB_TOKEN`
   - **Value:** `ghp_your_token_here`
   - **Environments:** ✅ Production, ✅ Preview, ✅ Development
5. Click **Save**

**⚠️ Important:** After adding environment variables, you must redeploy:

```bash
vercel --prod
```

#### Step 4: Optional - Configure Vercel KV (Caching)

**Create KV Database:**

1. In Vercel Dashboard → **Storage** tab
2. Click **Create Database** → **KV**
3. Name it: `github-cache`
4. Click **Create**

**Connect to Project:**

1. Select your KV database
2. Click **Connect Project**
3. Select your GitHub Users project
4. Environment: **All**
5. Click **Connect**

This will automatically add these environment variables:

- `KV_REST_API_URL`
- `KV_REST_API_TOKEN`
- `KV_REST_API_READ_ONLY_TOKEN`

#### Step 5: Test Production App

**Test Scenario 1: Basic Functionality**

1. Visit your production URL
2. Search for a GitHub user
3. Verify user data loads

**Test Scenario 2: Network Inspection**

1. Open DevTools → Network
2. Search for a user
3. Verify:
   - ✅ Request to `/api/github-proxy`
   - ✅ Response status: 200 OK
   - ✅ Response contains user data

**Test Scenario 3: Token Security (CRITICAL)**

1. Open DevTools → Sources
2. Expand `top → your-domain.vercel.app → _next/static/chunks`
3. Search all files for "ghp\_"
4. **Expected: 0 results** ✅
5. If token found → **STOP** and investigate immediately

**Test Scenario 4: Vercel Function Logs**

1. In Vercel Dashboard → **Logs** tab
2. Search for a user in your app
3. Look for function logs:
   - `Cache HIT: user:username:profile`
   - `Cache SET: user:username:profile`
   - Rate limit warnings (if any)

**Test Scenario 5: Rate Limit Monitoring**

1. Check function logs for rate limit data:
   ```
   Rate limit: 4999/5000 remaining
   ```
2. If you see warnings about low rate limit, verify banner appears in app

#### Step 6: Production Validation Checklist

- [ ] App deployed successfully
- [ ] GitHub token configured in environment variables
- [ ] User search works in production
- [ ] Token NOT exposed in client bundle (verified via DevTools)
- [ ] Vercel function logs show successful requests
- [ ] (Optional) Vercel KV caching working (see HIT/SET in logs)
- [ ] No console errors in production app
- [ ] Rate limit data returned in responses (check Network tab)

---

## 🐛 Troubleshooting

### Issue: "GITHUB_TOKEN not configured"

**Symptom:** Error message in app or Vercel logs

**Solution:**

1. Verify environment variable exists in Vercel Dashboard
2. Ensure variable name is exactly `GITHUB_TOKEN` (case-sensitive)
3. Redeploy after adding variable: `vercel --prod`

### Issue: "Failed to parse URL from /api/github-proxy"

**Symptom:** Network error when searching users

**Solution:**

- Local dev: Make sure you're using `vercel dev` (not `npm run dev`)
- Production: Check Vercel function deployed correctly (Functions tab in dashboard)

### Issue: Token visible in client bundle

**Symptom:** DevTools search finds "ghp\_" in source files

**Solution:**

1. ⚠️ **CRITICAL SECURITY ISSUE**
2. Immediately remove token from client code
3. Verify no `VITE_` prefix on token variable
4. Rebuild: `npm run build`
5. Re-verify: `grep -r "ghp_" dist/`
6. Redeploy

### Issue: CORS errors

**Symptom:** "Access-Control-Allow-Origin" errors in console

**Solution:**

1. Check `vercel.json` exists in project root
2. Verify headers configuration for `/api/*` routes
3. Redeploy if configuration changed

### Issue: Rate limit exhausted

**Symptom:** "API rate limit exceeded" errors

**Solution:**

- Check remaining rate limit:
  ```bash
  curl -H "Authorization: Bearer $GITHUB_TOKEN" \
    https://api.github.com/rate_limit
  ```
- Wait until rate limit resets (check `reset` timestamp)
- Or use a different GitHub token

### Issue: Cache not working (Vercel KV)

**Symptom:** No "Cache HIT" logs, all requests show "Cache SET"

**Solution:**

1. Verify Vercel KV is connected to project
2. Check environment variables exist:
   - `KV_REST_API_URL`
   - `KV_REST_API_TOKEN`
3. Check Vercel KV dashboard for storage activity
4. Note: Cache TTL is 30 minutes, test within that window

---

## 📊 Success Criteria

Phase 0 is considered **production-ready** when:

✅ **Security:**

- [ ] Token NOT exposed in client bundle (verified)
- [ ] All requests go through backend proxy
- [ ] No security warnings in Vercel logs

✅ **Functionality:**

- [ ] User search works in production
- [ ] Rate limit data extracted from GitHub headers
- [ ] RateLimitBanner appears when <10% remaining
- [ ] AuthRequiredModal opens when exhausted

✅ **Performance:**

- [ ] Caching works (optional but recommended)
- [ ] Response time <1s for cached requests
- [ ] No timeout errors

✅ **Monitoring:**

- [ ] Vercel function logs accessible
- [ ] Rate limit visible in logs
- [ ] No error spikes in production

---

## ✅ Ready for Phase 1?

Once all production tests pass, you can proceed to:

**➡️ Phase 1: GraphQL Multi-Query Architecture**

**What Phase 1 adds:**

- Year-by-year data fetching
- Parallel GraphQL queries
- Per-year cache keys
- Full TypeScript type safety

**Phase 1 Requirements:**

- Phase 0 must be production-validated ✅
- No security issues in production ✅
- Rate limit monitoring working ✅

---

## 📚 Related Documentation

- [Phase 0 Implementation](./phases/phase-0-backend-security.md)
- [Phase 0 Test Results](./PHASE_0_TEST_RESULTS.md)
- [Phase 1 Plan](./phases/phase-1-graphql-multi-query.md)
- [Rollback Plan](./ROLLBACK_PLAN.md)

---

**Last Updated:** 2025-11-17
**Maintained By:** Development Team
**Next Review:** After production validation
