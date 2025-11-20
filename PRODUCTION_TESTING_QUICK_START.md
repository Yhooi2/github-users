# Phase 0: Production Testing - Quick Start

**Date:** 2025-11-17
**Status:** ✅ Ready to Test
**Vercel CLI:** v48.10.3 (installed)

---

## 🎯 Current Status

**Implementation:** ✅ 100% Complete

- Backend proxy with token security
- Rate limit monitoring UI
- All tests passing (9 new tests)
- Storybook built with new components

**What You Need to Do:** Test with real GitHub token

---

## 🚀 Quick Start (5 Steps)

### Step 1: Get GitHub Personal Access Token

**If you don't have a token yet:**

1. Go to: https://github.com/settings/tokens/new
2. Token name: `GitHub User Analytics`
3. Expiration: `No expiration` (or custom)
4. Select scopes:
   - ✅ `read:user` (Read user profile data)
   - ✅ `user:email` (Read email addresses - optional)
5. Click **"Generate token"**
6. **COPY THE TOKEN IMMEDIATELY** - you won't see it again!

**Token format:** `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

---

### Step 2: Create .env.local File

```bash
# Create .env.local in project root
cat > .env.local << 'EOF'
GITHUB_TOKEN=ghp_paste_your_token_here
EOF
```

**Replace `ghp_paste_your_token_here` with your actual token!**

**Security Note:**

- `.env.local` is in `.gitignore` - safe to use
- Token stays on your machine only
- Never commit this file

---

### Step 3: Start Vercel Dev Server

```bash
# Start development server
vercel dev

# On first run, you'll be asked to:
# 1. Login to Vercel (y/N) → Press 'y'
# 2. Select scope (organization)
# 3. Link to existing project or create new one

# Expected output:
# ✓ Ready! Available at http://localhost:3000
```

**First time setup:**

- You'll need to login to Vercel
- It will link this directory to your Vercel project
- Answer the prompts (use defaults or your preference)

---

### Step 4: Test the Application

**Open in browser:** http://localhost:3000

**Test Scenario 1: Basic User Search** ✅

1. Search for: `torvalds` (or any GitHub username)
2. Verify user data loads
3. Check profile, repositories, statistics tabs

**Test Scenario 2: Network Inspection** 🔍

1. Open DevTools (F12) → Network tab
2. Search for a user
3. Verify:
   - ✅ Request goes to `/api/github-proxy` (NOT `api.github.com`)
   - ✅ Response status: 200 OK
   - ✅ Response contains user data
   - ✅ No CORS errors

**Test Scenario 3: Token Security** 🔒 (CRITICAL!)

1. Open DevTools → Sources tab
2. Search all files (Ctrl+Shift+F) for: `ghp_`
3. **Expected: 0 results** ✅
4. If token found → **STOP** and report immediately

**Test Scenario 4: Vercel Function Logs** 📊

1. Check terminal where `vercel dev` is running
2. Search for a user in the app
3. Look for log messages:
   ```
   Cache HIT: user:username:profile  ✅ (on repeat searches)
   Cache SET: user:username:profile  ✅ (on first search)
   ```
4. Verify caching is working

**Test Scenario 5: Rate Limit UI** 🎨 (Simulated)

1. Since you can't easily exhaust rate limit, simulate it
2. Edit `src/App.tsx` temporarily (line 55):
   ```typescript
   // TEMPORARY - for testing rate limit UI
   const [rateLimit, setRateLimit] = useState({
     remaining: 450, // <10% of 5000 = warning banner
     limit: 5000,
     reset: Math.floor(Date.now() / 1000) + 3600,
   });
   ```
3. Save file → Refresh browser
4. **Expected:** Yellow warning banner at top ✅
5. Change to `remaining: 100` → Red critical banner ✅
6. Change to `remaining: 0` → Modal should open ✅
7. **REVERT CHANGES** after testing

---

### Step 5: Validation Checklist

Mark as you test:

**Functionality:**

- [ ] User search works with real GitHub token
- [ ] `/api/github-proxy` endpoint responds correctly
- [ ] User data displays (profile, repos, stats)
- [ ] No errors in browser console
- [ ] No errors in Vercel dev terminal

**Security:**

- [ ] Token NOT visible in DevTools → Sources ✅ CRITICAL
- [ ] All requests go through `/api/github-proxy`
- [ ] No token in Network tab responses

**Caching:**

- [ ] Vercel logs show "Cache HIT" on repeat searches
- [ ] Vercel logs show "Cache SET" on first search
- [ ] Response time faster on cached requests

**Rate Limit UI:**

- [ ] RateLimitBanner appears when simulated <10%
- [ ] Banner turns red when simulated <5%
- [ ] AuthRequiredModal opens when simulated 0

---

## ✅ Success Criteria

Phase 0 is **production-ready** when:

- ✅ User search works perfectly
- ✅ Token secured (NOT in client bundle)
- ✅ Caching works (optional but nice)
- ✅ Rate limit UI displays correctly
- ✅ No console errors or warnings

---

## 🐛 Common Issues & Solutions

### Issue: "GITHUB_TOKEN not configured"

**Solution:**

1. Verify `.env.local` exists in project root
2. Check file contains: `GITHUB_TOKEN=ghp_your_token`
3. Restart `vercel dev`

### Issue: "vercel command not found"

**Solution:**
Already installed! But if it happens:

```bash
npm install -g vercel
```

### Issue: "Failed to parse URL from /api/github-proxy"

**Solution:**

- Must use `vercel dev` (not `npm run dev`)
- Vercel dev server handles serverless functions

### Issue: Token visible in DevTools

**⚠️ CRITICAL SECURITY ISSUE**

**Solution:**

1. Immediately stop `vercel dev`
2. Verify no `VITE_` prefix on token
3. Check token is in `.env.local` (not `.env`)
4. Rebuild: `npm run build`
5. Re-verify: `grep -r "ghp_" dist/` → should be 0 results

---

## 📊 What Happens Next?

### After Local Testing Passes:

**Option A: Deploy to Vercel Production** (Recommended)

```bash
# 1. Login to Vercel
vercel login

# 2. Deploy to production
vercel --prod

# 3. Add GITHUB_TOKEN in Vercel Dashboard
# Settings → Environment Variables → Add Variable
```

**Option B: Continue to Phase 1/2** (If you want to test more locally first)

- Phase 1: GraphQL Multi-Query (already implemented!)
- Phase 2: Metrics Calculation System (recommended next)

---

## 📚 Full Documentation

Need more details? See:

- **Complete Guide:** `docs/PHASE_0_PRODUCTION_TESTING.md`
- **Implementation Summary:** `docs/PHASE_0_COMPLETION_SUMMARY.md`
- **Phase 0 Details:** `docs/phases/phase-0-backend-security.md`

---

## 🆘 Need Help?

**Stop vercel dev:**

```bash
# Press Ctrl+C in terminal where vercel dev is running
```

**Reset everything:**

```bash
# Remove .vercel directory (safe to delete)
rm -rf .vercel

# Start fresh
vercel dev
```

---

## 🎉 Ready to Begin!

**Environment:** ✅ Vercel CLI installed (v48.10.3)
**Code:** ✅ Phase 0 complete
**Documentation:** ✅ All guides ready

**Start testing:**

```bash
# 1. Create .env.local with your GitHub token
# 2. Run: vercel dev
# 3. Open: http://localhost:3000
# 4. Test user search!
```

---

**Good luck! 🚀**

If everything works, you're ready for Phase 1 or Phase 2!
