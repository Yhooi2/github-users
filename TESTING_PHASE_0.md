# 🧪 Quick Start: Testing Phase 0

**Status:** ✅ Implementation Complete → ⏳ **Testing Required**

---

## ⚡ Quick Start (5 minutes)

### Option 1: Local Testing

```bash
# 1. Add your GitHub token to .env.local
echo "GITHUB_TOKEN=ghp_your_actual_token_here" >> .env.local

# 2. Start Vercel dev server
vercel dev

# 3. Test at http://localhost:3000
# - Search for a user (e.g., "torvalds")
# - Check Network tab: requests should go to /api/github-proxy
# - Verify: user data loads, no errors
```

### Option 2: Deploy to Vercel

```bash
# 1. Login and deploy
vercel login
vercel --prod

# 2. Add GITHUB_TOKEN in Vercel Dashboard
# Settings → Environment Variables → Add Variable

# 3. Test your deployed URL
```

---

## ✅ Validation Checklist

- [ ] GitHub token added (get one at: https://github.com/settings/tokens)
- [ ] Application runs (local or production)
- [ ] User search works
- [ ] Network tab shows `/api/github-proxy` calls
- [ ] NO token visible in DevTools → Sources
- [ ] No console errors

---

## 📚 Documentation

- **Full Test Results:** [docs/PHASE_0_TEST_RESULTS.md](docs/PHASE_0_TEST_RESULTS.md)
- **Detailed Guide:** [docs/phases/phase-0-backend-security.md](docs/phases/phase-0-backend-security.md)
- **Master Plan:** [docs/REFACTORING_MASTER_PLAN.md](docs/REFACTORING_MASTER_PLAN.md)

---

## 🚨 Common Issues

**"GITHUB_TOKEN not configured"**
→ Add token to `.env.local` or Vercel Dashboard

**"Failed to parse URL"**
→ Use `vercel dev` (not `npm run dev`)

**Token still in bundle?**
→ Run `npm run build && grep -r "ghp_" dist/`

---

## 🎯 After Testing

Once validation passes:
1. Mark checkboxes above as complete
2. Proceed to **Phase 1:** Year-by-year GraphQL queries
3. See: [docs/phases/phase-1-graphql-multi-query.md](docs/phases/phase-1-graphql-multi-query.md)

---

**Need Help?** See full documentation links above.
