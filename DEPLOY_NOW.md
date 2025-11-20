# 🚀 Quick Deploy Guide - Start Here!

**Goal:** Get your app live in 10 minutes

---

## ⚡ Fast Track (3 Commands)

```bash
# 1. Create GitHub Token at: https://github.com/settings/tokens/new
#    Scopes needed: read:user, user:email
#    Copy the token (ghp_xxxxx...)

# 2. Create .env.local file
echo "GITHUB_TOKEN=ghp_paste_your_token_here" > .env.local

# 3. Deploy to Vercel
vercel --prod

# 4. Add token to Vercel Dashboard:
#    https://vercel.com/dashboard
#    → Your Project → Settings → Environment Variables
#    → Add: GITHUB_TOKEN = ghp_your_token
#    → Redeploy
```

**Done!** Your app is live at `https://your-app.vercel.app`

---

## 📋 Detailed Steps

### Step 1: GitHub Token (2 minutes)

1. Go to: https://github.com/settings/tokens/new
2. Token name: `GitHub User Analytics`
3. Select scopes:
   - ✅ `read:user`
   - ✅ `user:email`
4. Click "Generate token"
5. **COPY THE TOKEN** → `ghp_xxxxxxxxxxxxxxxxxxxx`

### Step 2: Test Locally (3 minutes)

```bash
# Create environment file
cp .env.example .env.local

# Edit and add your token
nano .env.local
# Add line: GITHUB_TOKEN=ghp_your_token_here

# Start development
npm run dev

# Open http://localhost:5173
# Search for a GitHub username
# Verify it works!
```

### Step 3: Deploy (5 minutes)

```bash
# Login to Vercel (first time only)
vercel login

# Deploy to production
vercel --prod

# You'll get a URL like:
# https://github-user-analytics-xxxx.vercel.app
```

### Step 4: Configure Production Token

**Via Dashboard (Easiest):**

1. Go to: https://vercel.com/dashboard
2. Select your project
3. Settings → Environment Variables
4. Add variable:
   - Name: `GITHUB_TOKEN`
   - Value: `ghp_your_token_here`
   - Environments: ✅ Production, ✅ Preview, ✅ Development
5. Save
6. Go to Deployments → Click "⋯" → Redeploy

**Via CLI:**

```bash
vercel env add GITHUB_TOKEN
# Paste your token when prompted
# Select: Production, Preview, Development

vercel --prod
```

---

## ✅ Verification Checklist

Open your production URL and verify:

- [ ] App loads without errors
- [ ] Can search for GitHub users
- [ ] Profile displays with metrics
- [ ] DevTools → Network shows `/api/github-proxy` (not `api.github.com`)
- [ ] DevTools → Sources search for "ghp\_" shows 0 results (secure!)

**All checks pass?** 🎉 You're live in production!

---

## 🔧 Optional: Add Caching (Bonus)

Reduces API rate limits with Vercel KV:

1. Vercel Dashboard → Storage → Create Database → KV
2. Name: `github-cache`
3. Connect to your project
4. Redeploy: `vercel --prod`

**Done!** Responses cached for 30 minutes.

---

## 🆘 Quick Fixes

**Error: "GITHUB_TOKEN not configured"**
→ Add token in Vercel Dashboard → Environment Variables → Redeploy

**Error: "Rate limit exceeded"**
→ Setup KV cache (above) OR wait 1 hour for reset

**Token visible in browser?**
→ Verify using `/api/github-proxy` (not direct GitHub API)

---

## 📚 Full Documentation

- **Complete Guide:** `PRODUCTION_SETUP.md`
- **Phase 0 Details:** `docs/PHASE_0_COMPLETION_SUMMARY.md`
- **Architecture:** `docs/REFACTORING_MASTER_PLAN.md`

---

**Ready?** Start with Step 1! 🚀
