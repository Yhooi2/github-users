# 🚀 Production Setup Guide

**Status:** Ready for Production Testing
**Date:** 2025-11-18
**Branch:** `claude/review-refactoring-progress-017mbPwmCk14gxyMWqAfQFbV`

---

## ✅ Prerequisites

- [x] All tests passing (76/76 files, 1615/1615 tests) ✅
- [x] Backend proxy implemented (`api/github-proxy.ts`) ✅
- [x] Security verified (token not exposed) ✅
- [x] Vercel CLI installed ✅
- [ ] GitHub Personal Access Token (you need to create one)

---

## 📋 Step-by-Step Setup

### Step 1: Create GitHub Personal Access Token

1. **Go to GitHub Settings:**

   ```
   https://github.com/settings/tokens/new
   ```

2. **Configure Token:**
   - **Token name:** `GitHub User Analytics`
   - **Expiration:** No expiration (or custom)
   - **Scopes:** Select these:
     - ✅ `read:user` - Read user profile data
     - ✅ `user:email` - Read email addresses (optional but recommended)

3. **Generate and Copy Token:**
   - Click "Generate token"
   - **⚠️ COPY IT IMMEDIATELY** - you won't see it again!
   - Token format: `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

---

### Step 2: Local Development Setup

**Option A: Quick Start (Recommended)**

```bash
# 1. Copy example environment file
cp .env.example .env.local

# 2. Edit .env.local and add your token
nano .env.local  # or use any text editor

# Add this line with YOUR token:
GITHUB_TOKEN=ghp_your_actual_token_here

# 3. Start development server
npm run dev

# This will start BOTH:
# - Vite dev server on http://localhost:5173
# - Vercel dev server on http://localhost:3000
```

**Option B: Backend Only (Production-like)**

```bash
# 1. Create .env.local
echo "GITHUB_TOKEN=ghp_your_token_here" > .env.local

# 2. Start Vercel dev server
vercel dev

# Opens on http://localhost:3000
```

---

### Step 3: Local Testing Checklist

Open your browser and test:

- [ ] **App loads:** Navigate to http://localhost:5173 (or 3000 for Vercel)
- [ ] **Search works:** Search for any GitHub username (e.g., "torvalds")
- [ ] **Profile displays:** User profile, metrics, timeline appear
- [ ] **Network inspection:**
  - Open DevTools → Network tab
  - Filter by "github"
  - ✅ Should see requests to `/api/github-proxy` (NOT `api.github.com`)
- [ ] **Token security:**
  - Open DevTools → Sources tab
  - Search for "ghp\_" in all files
  - ✅ Should find **0 results** (token is secure!)
- [ ] **Rate limit:** Check if rate limit banner appears (when <10% remaining)

**If all checks pass:** ✅ Ready for production deployment!

---

### Step 4: Production Deployment to Vercel

#### 4.1: Login to Vercel

```bash
vercel login
```

Choose your login method (GitHub, GitLab, email, etc.)

#### 4.2: Link Project (First Time Only)

```bash
vercel link
```

Follow prompts:

- **Setup and deploy?** → Yes
- **Which scope?** → Select your account/team
- **Link to existing project?** → No (create new)
- **Project name?** → `github-user-analytics` (or custom)
- **Directory?** → `.` (current directory)

#### 4.3: Deploy to Production

```bash
# Deploy to production
vercel --prod

# Expected output:
# ✓ Production deployment ready!
# https://github-user-analytics-xxxx.vercel.app
```

**Save the deployment URL!**

---

### Step 5: Configure Environment Variables in Vercel

⚠️ **CRITICAL:** Without this step, your production app won't work!

#### Via Vercel Dashboard (Recommended):

1. **Go to your project:**

   ```
   https://vercel.com/dashboard
   → Select your project
   → Settings → Environment Variables
   ```

2. **Add GITHUB_TOKEN:**
   - **Name:** `GITHUB_TOKEN`
   - **Value:** `ghp_your_token_here` (paste your token)
   - **Environments:** ✅ Production, ✅ Preview, ✅ Development

3. **Click "Save"**

4. **Redeploy:**
   - Go to Deployments tab
   - Click "⋯" on latest deployment
   - Click "Redeploy"
   - Select "Use existing Build Cache"

#### Via CLI (Alternative):

```bash
# Add environment variable
vercel env add GITHUB_TOKEN

# When prompted:
# - Value: ghp_your_token_here
# - Environments: Production, Preview, Development

# Redeploy
vercel --prod
```

---

### Step 6: Verify Production Deployment

Open your production URL: `https://your-app.vercel.app`

Run through this checklist:

- [ ] **App loads without errors**
- [ ] **Search for a GitHub user** (e.g., "octocat")
- [ ] **Profile displays correctly:**
  - User header with avatar ✅
  - Quick Assessment (4 metrics) ✅
  - Activity Timeline (year-by-year) ✅
  - Projects Section (owned vs contributions) ✅
- [ ] **Network inspection:**
  - Open DevTools → Network
  - Search requests go to `/api/github-proxy` ✅
  - NO requests to `api.github.com` directly ✅
- [ ] **Security check:**
  - Open DevTools → Sources
  - Search all files for "ghp\_"
  - ✅ **0 results** = Token is secure!
- [ ] **Rate limit monitoring:**
  - Make several searches
  - Check if rate limit banner appears when low
  - Verify AuthRequiredModal opens when exhausted
- [ ] **Performance:**
  - Page loads in <3 seconds ✅
  - Smooth scrolling and animations ✅
  - Responsive on mobile/tablet/desktop ✅

**If all checks pass:** 🎉 **Production deployment successful!**

---

### Step 7: Optional - Setup Vercel KV Cache

Vercel KV provides caching to reduce API rate limit usage:

#### 7.1: Create KV Database

1. **Go to Vercel Dashboard:**

   ```
   https://vercel.com/dashboard
   → Storage → Create Database
   → KV
   ```

2. **Configure:**
   - **Name:** `github-cache`
   - **Region:** Choose closest to your users
   - **Click "Create"**

#### 7.2: Connect to Project

1. In KV dashboard, click your database
2. Click "Connect Project"
3. Select your `github-user-analytics` project
4. Environment variables are added automatically:
   - `KV_REST_API_URL`
   - `KV_REST_API_TOKEN`
   - `KV_REST_API_READ_ONLY_TOKEN`

#### 7.3: Redeploy

```bash
vercel --prod
```

#### 7.4: Verify Caching

Check Vercel Function logs:

- First request: `Cache SET: user:octocat:profile`
- Second request: `Cache HIT: user:octocat:profile`

**Cache TTL:** 30 minutes (1800 seconds)

---

## 🔍 Troubleshooting

### Problem: "GITHUB_TOKEN not configured" Error

**Solution:**

1. Verify token is added in Vercel Dashboard → Environment Variables
2. Ensure token is added to **Production** environment
3. Redeploy after adding token

### Problem: Token Visible in DevTools

**Solution:**

1. Check you're NOT using `VITE_GITHUB_TOKEN`
2. Verify requests go to `/api/github-proxy` (not `api.github.com`)
3. Clear browser cache and reload

### Problem: Rate Limit Errors

**Solution:**

1. Wait for rate limit to reset (shown in banner)
2. Setup Vercel KV for caching (Step 7)
3. Verify cache is working (check Function logs)

### Problem: "API Error 401 Unauthorized"

**Solution:**

1. Check GitHub token is valid: https://github.com/settings/tokens
2. Verify token has `read:user` scope
3. Regenerate token if expired

---

## 📊 Monitoring & Maintenance

### Check Rate Limits

```bash
# View current rate limit status
curl -H "Authorization: Bearer ghp_your_token_here" \
  https://api.github.com/rate_limit

# Response shows:
# - limit: 5000 (authenticated)
# - remaining: XXXX
# - reset: timestamp
```

### View Function Logs

**Vercel Dashboard:**

```
https://vercel.com/dashboard
→ Your Project → Functions
→ Click on /api/github-proxy
→ View Logs
```

**Look for:**

- ✅ `Cache HIT: user:username:profile` (caching working)
- ✅ `Cache SET: user:username:profile` (new data cached)
- ⚠️ `KV cache read failed` (KV issue, but app still works)

### Performance Metrics

**Vercel Analytics:**

```
https://vercel.com/dashboard
→ Your Project → Analytics
```

**Monitor:**

- LCP (Largest Contentful Paint) - Target: <2.5s
- FID (First Input Delay) - Target: <100ms
- CLS (Cumulative Layout Shift) - Target: <0.1

---

## 🎯 Success Criteria

- [x] All tests passing (1615/1615) ✅
- [ ] Local development working with `npm run dev`
- [ ] Production deployed to Vercel
- [ ] GitHub token configured in Vercel
- [ ] Security verified (token not in client)
- [ ] Rate limit monitoring active
- [ ] Performance metrics within targets

---

## 📚 Related Documentation

- **Phase 0 Details:** `docs/PHASE_0_COMPLETION_SUMMARY.md`
- **Backend Security:** `docs/phases/phase-0-backend-security.md`
- **Production Testing:** `docs/PHASE_0_PRODUCTION_TESTING.md`
- **Refactoring Plan:** `docs/REFACTORING_MASTER_PLAN.md`

---

## 🆘 Need Help?

**Common Issues:**

- Environment variables not working → Check Vercel Dashboard → Settings → Environment Variables
- Token expired → Regenerate at https://github.com/settings/tokens
- Rate limit exhausted → Setup KV cache (Step 7) or wait for reset

**Documentation:**

- Vercel Deployment: https://vercel.com/docs/deployments
- Vercel Environment Variables: https://vercel.com/docs/environment-variables
- GitHub GraphQL API: https://docs.github.com/en/graphql

---

**Last Updated:** 2025-11-18
**Status:** ✅ Ready for Production
**Next Step:** Follow Step 1 (Create GitHub Token)
