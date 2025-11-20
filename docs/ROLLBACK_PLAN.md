# Rollback Plan

**Version:** 1.0
**Date:** 2025-11-17
**Project:** GitHub User Info - Implementation Plan Rollback Procedures

---

## 🔄 General Rollback Strategy

### 3 Rollback Methods (ordered by speed)

#### 1. Vercel Dashboard Rollback (⚡ 1 minute) - FASTEST

**When to use:** Production deployment broken, need instant fix

**Steps:**

1. Go to Vercel Dashboard → Deployments
2. Find previous working deployment
3. Click "⋮" menu → "Promote to Production"
4. Wait ~30 seconds for DNS propagation

**No code changes required!**

**Pros:**

- ✅ Instant rollback
- ✅ No git operations
- ✅ Preserves broken deployment for debugging

**Cons:**

- ⚠️ Doesn't fix code in git (manual fix still needed)

---

#### 2. Git Revert (⚡ 3 minutes)

**When to use:** Code needs to be fixed in repository

**Steps:**

```bash
# 1. Revert last commit
git revert HEAD

# 2. Push (triggers Vercel auto-deploy)
git push origin main

# 3. Wait for Vercel deployment (~2 minutes)
# Check: https://your-app.vercel.app
```

**Pros:**

- ✅ Fixes code in git history
- ✅ Creates new commit (preserves history)
- ✅ Auto-deploys via Vercel

**Cons:**

- ⚠️ Slower than Vercel Dashboard
- ⚠️ Requires git knowledge

---

#### 3. Manual Code Rollback (⚡ 5 minutes)

**When to use:** Specific file(s) need to be reverted

**Steps:**

```bash
# 1. Checkout specific files from previous commit
git checkout main~1 src/apollo/ApolloAppProvider.tsx

# 2. Commit revert
git commit -m "rollback: Revert ApolloAppProvider to previous version"

# 3. Build and deploy
npm run build
vercel --prod
```

**Pros:**

- ✅ Surgical fix (only specific files)
- ✅ Faster than full build

**Cons:**

- ⚠️ Manual process
- ⚠️ Requires knowing which files to revert

---

## 📋 Phase-Specific Rollback Procedures

### Phase 0 Rollback: Backend Proxy

**Scenario:** Vercel Functions not working, app broken

**Quick Fix (Temporary Insecure Mode):**

```bash
# 1. Revert Apollo Client to direct GitHub API
git checkout main src/apollo/ApolloAppProvider.tsx

# 2. Re-add token to .env.local (TEMPORARY!)
echo "VITE_GITHUB_TOKEN=ghp_your_token" >> .env.local

# 3. Redeploy
npm run build && vercel --prod
```

**⚠️ WARNING:** This is INSECURE but keeps app working.
**TODO:** Fix Vercel Functions ASAP!

**Common Issues:**

- `502 Bad Gateway` → Vercel Function timeout (increase to 60s)
- `Environment variable not found` → Check Vercel Dashboard → Settings → Env Vars
- `KV_REST_API_URL missing` → Re-create Vercel KV database

---

### Phase 1 Rollback: GraphQL Multi-Query

**Scenario:** Year-by-year queries causing errors/slowness

**Quick Fix:**

```typescript
// src/hooks/useUserAnalytics.ts
// Add feature flag:
const ENABLE_YEAR_BY_YEAR =
  import.meta.env.VITE_FEATURE_YEAR_BY_YEAR === "true";

export function useUserAnalytics(username: string) {
  if (!ENABLE_YEAR_BY_YEAR) {
    // Fallback to old useQueryUser (3 years)
    return useQueryUser(username);
  }

  // New year-by-year logic
  // ...
}
```

**.env.local:**

```bash
VITE_FEATURE_YEAR_BY_YEAR=false  # ← Instant disable, no code change!
```

**Redeploy:** `vercel --prod`

---

### Phase 1.5 Rollback: Fraud Detection

**Scenario:** Fraud detection causing false positives

**Quick Fix (Feature Flag):**

```typescript
// src/lib/metrics/fraud-detection.ts
const ENABLE_FRAUD = import.meta.env.VITE_FEATURE_FRAUD === 'true';

export function calculateFraudDetection(...) {
  if (!ENABLE_FRAUD) {
    return { score: 0, level: 'Clean', flags: [] }; // Disabled
  }

  // Real fraud detection logic
  // ...
}
```

**.env.local:**

```bash
VITE_FEATURE_FRAUD=false  # ← Disable fraud detection
```

---

### Phase 2 Rollback: New Metrics

**Scenario:** New metrics calculation errors

**Fallback to Old Authenticity Score:**

```typescript
// src/components/assessment/QuickAssessment.tsx
try {
  const activity = calculateActivityScore(data);
  const impact = calculateImpactScore(data);
  const quality = calculateQualityScore(data);
  const growth = calculateGrowthScore(data);

  return <MetricCards activity={activity} impact={impact} ... />;
} catch (error) {
  console.error('New metrics failed:', error);

  // Fallback to old system
  const authenticity = calculateAuthenticityScore(data);
  return <UserAuthenticity authenticity={authenticity} />;
}
```

**No redeploy needed!** (try-catch handles it)

---

## 🚨 Rollback Decision Tree

```
Production error rate > 5%?
  ├─ YES → Rollback IMMEDIATELY (Method 1: Vercel Dashboard)
  └─ NO → Monitor for 15 minutes
           ├─ Errors increasing? → Rollback (Method 2: Git Revert)
           └─ Errors stable? → Investigate, prepare fix
```

**Metrics to monitor:**

- Error rate (should be <1%)
- Response time (p95 <2s)
- Success rate (should be >99%)

**Rollback if:**

- Error rate >5% for >5 minutes
- Response time p95 >5s
- Success rate <95%

---

## ✅ Post-Rollback Checklist

After rolling back:

1. **Create incident report** (docs/incidents/YYYY-MM-DD-issue-name.md)
2. **Add regression test** (to prevent same issue)
3. **Fix in separate branch** (not main)
4. **Test fix thoroughly:**
   ```bash
   npm test
   npm run test:e2e
   npm run build
   vercel --prod  # Deploy to preview first
   ```
5. **Gradual re-deploy:**
   - 10% traffic → Monitor 1 hour
   - 50% traffic → Monitor 1 hour
   - 100% traffic → Monitor 24 hours

---

## 🔧 Troubleshooting Common Rollback Issues

### "Rollback failed - same error persists"

**Cause:** Issue is in database/cache, not code

**Solution:**

```bash
# Clear Vercel KV cache
vercel kv flushall --yes

# Or use TTL expiration (wait 30 minutes)
```

---

### "Previous deployment also broken"

**Cause:** Need to rollback 2+ commits

**Solution:**

```bash
# Find last working commit
git log --oneline -10

# Rollback to specific commit
git revert HEAD~3..HEAD  # Reverts last 3 commits

# Deploy
vercel --prod
```

---

### "Can't access Vercel Dashboard"

**Cause:** Account issues

**Solution:**

```bash
# Force deploy previous version via CLI
vercel rollback <deployment-url>

# Or manual git rollback
git reset --hard <commit-hash>
git push --force origin main  # ⚠️ USE WITH CAUTION!
```

---

## 📊 Rollback Metrics

Track rollback frequency to identify systemic issues:

| Week       | Rollbacks | Reason           | Prevention                 |
| ---------- | --------- | ---------------- | -------------------------- |
| 2025-11-17 | 0         | -                | -                          |
| 2025-11-24 | 1         | Phase 0 env vars | Better verification script |

**If rollbacks >2/week:** Review deployment process!

---

## 🚀 Prevention Strategies

**To minimize rollbacks:**

1. **Feature Flags** (recommended):

   ```typescript
   const FEATURE_X = import.meta.env.VITE_FEATURE_X === "true";
   ```

2. **Gradual Rollouts:**
   - Preview deployment first
   - Monitor 24 hours
   - Promote to production

3. **Automated Testing:**
   - Unit tests >95% coverage
   - E2E tests for critical paths
   - Visual regression tests (Chromatic/Percy)

4. **Monitoring:**
   - Vercel Analytics
   - Error tracking (Sentry)
   - Performance monitoring (LCP, FID, CLS)

---

**Last Updated:** 2025-11-17
**Maintained By:** Development Team
**Review Frequency:** After each major deployment
