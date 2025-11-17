# Deployment Strategy — 3-Stage Rollout Plan

**Version:** 1.0
**Date:** 2025-11-17
**Based on:** [REFACTORING_MASTER_PLAN.md](./REFACTORING_MASTER_PLAN.md)
**Status:** Ready for Execution

---

## 📋 Executive Summary

This document outlines a **3-stage deployment strategy** for the GitHub User Analytics Dashboard refactoring. The strategy minimizes risk by deploying incrementally, with clear Go/No-Go criteria at each stage.

**Why 3 Stages?**
- ✅ Reduces deployment risk (can rollback to previous version)
- ✅ Validates critical changes early (security fix first!)
- ✅ Allows for user feedback between stages
- ✅ Prevents "big bang" deployment failures

**Timeline:** 5-6 weeks total
- Stage 1 (MVP): 2 weeks
- Stage 2 (V2): 2 weeks
- Stage 3 (V3): 1-2 weeks

---

## 🎯 Stage 1: MVP — Security & Data Foundation

**Goal:** Fix critical security issue and enable dynamic year-by-year data

**Duration:** 2 weeks (Days 1-14)

### Phases Included
- **Phase 0:** Backend Security Layer (Vercel serverless proxy)
- **Phase 1:** GraphQL Multi-Query Architecture (year-by-year data)

### What Users Get
- ✅ Existing UI works identically
- ✅ GitHub token secured on server (not exposed in browser)
- ✅ Dynamic data loading (from account creation to now, not fixed 3 years)
- ✅ Faster performance (server-side caching with Vercel KV)
- ✅ No breaking changes

### Technical Deliverables

**Phase 0 (Days 1-5):**
- [ ] Vercel serverless function created (`api/github-proxy.ts`)
- [ ] Vercel KV caching configured (30-minute TTL)
- [ ] Apollo Client `HttpLink` URI changed to `/api/github-proxy`
- [ ] Environment variables migrated (remove `VITE_GITHUB_TOKEN`, add `GITHUB_TOKEN`)
- [ ] Token NOT visible in DevTools Network tab (verified)
- [ ] Deployed to Vercel preview environment

**Phase 1 (Days 6-14):**
- [ ] `generateYearRanges(createdAt)` function implemented
- [ ] New GraphQL queries: `GET_USER_PROFILE`, `GET_YEAR_CONTRIBUTIONS`
- [ ] `useUserAnalytics()` hook created (parallel queries with `Promise.all`)
- [ ] Cache keys per year working (`user:{username}:year:{year}`)
- [ ] Tested with accounts of various ages (2-15 years)
- [ ] `useQueryUser()` still works (Migration Option A: Incremental)

### Go/No-Go Criteria

**MUST HAVE (Blockers):**
- ✅ Token NOT exposed in production bundle
- ✅ Existing user search functionality works
- ✅ No increase in error rate (monitor for 24 hours)
- ✅ Performance acceptable (LCP <3s, no timeout errors)

**SHOULD HAVE:**
- ✅ Cache hit rate >50% (check Vercel logs)
- ✅ GitHub API rate limit usage <30% (check via API)
- ✅ Zero accessibility regressions

**NICE TO HAVE:**
- Performance improvement (faster load times)
- Lower API usage vs before

### Deployment Steps

1. **Pre-deployment:**
   ```bash
   npm run test:all        # Verify all tests pass
   npm run build           # Verify production build works
   npm run preview         # Manual smoke test
   ```

2. **Deploy to preview:**
   ```bash
   vercel                  # Preview deployment
   # Test: Search for user, verify token not in DevTools
   ```

3. **Deploy to production:**
   ```bash
   vercel --prod
   # Monitor: Vercel logs, error rate, GitHub API usage
   ```

4. **Post-deployment monitoring (24-48 hours):**
   - Error rate (Vercel dashboard)
   - GitHub API rate limit (check hourly)
   - User feedback (if available)

### Rollback Plan

**If critical issues occur:**

1. **Quick rollback (Vercel dashboard):**
   - Go to Vercel dashboard → Deployments
   - Click previous deployment → "Promote to Production"
   - Instant rollback (~30 seconds)

2. **Git rollback:**
   ```bash
   git revert <commit-hash>  # Revert security changes
   git push
   vercel --prod             # Redeploy previous version
   ```

3. **Restore client-side token (temporary):**
   - Add `VITE_GITHUB_TOKEN` back to `.env`
   - Update Apollo Client to use GitHub API directly
   - Deploy emergency fix

**Note:** This is a security regression but keeps app functional

---

## 🚀 Stage 2: V2 — New Metrics & Enhanced Features

**Goal:** Add new metrics calculation system and improved analytics

**Duration:** 2 weeks (Days 15-28)

### Phases Included
- **Phase 2:** Metrics Calculation System (Activity, Impact, Quality, Growth)
- **Phase 3:** Core Components (MetricCard, QuickAssessment)

### What Users Get
- ✅ New "Quick Assessment" section (4 metrics: Activity, Impact, Quality, Growth)
- ✅ Existing UI preserved (tabs still work)
- ✅ New metric cards with explanations
- ✅ Progressive disclosure (explain button for each metric)
- ✅ All existing features still work

### Technical Deliverables

**Phase 2 (Days 15-21):**
- [ ] 4 metric functions implemented (`src/lib/metrics/`)
  - `activity.ts` (Recent commits, Consistency, Diversity)
  - `impact.ts` (Stars, Forks, Contributors, Reach, Engagement)
  - `quality.ts` (Originality, Documentation, Ownership, Maturity, Stack)
  - `growth.ts` (YoY changes in Activity, Impact, Skills)
- [ ] Each metric follows `authenticity.ts` pattern (100-point system)
- [ ] Test coverage 100% for calculation functions
- [ ] Benchmark labels working (Low/Moderate/High/Excellent)
- [ ] Reuses helpers from `statistics.ts`

**Phase 3 (Days 22-28):**
- [ ] `MetricCard` component (responsive, accessible)
- [ ] `QuickAssessment` grid component (4 metrics)
- [ ] `MetricExplanationModal` (optional, can defer to Stage 3)
- [ ] Storybook stories for all components
- [ ] Component tests (>90% coverage)
- [ ] Uses existing shadcn/ui components (Card, Progress, Badge)

### Go/No-Go Criteria

**MUST HAVE:**
- ✅ All 4 metrics calculate correctly
- ✅ No errors when searching for users
- ✅ Existing features still work (Repository tab, Statistics tab)
- ✅ Test coverage >95%
- ✅ Accessibility audit: 0 errors

**SHOULD HAVE:**
- ✅ Metrics make sense (manually verify with known profiles)
- ✅ Performance acceptable (metric calculation <500ms)
- ✅ Mobile responsive

**NICE TO HAVE:**
- User feedback on metric accuracy
- A/B testing results (if implemented)

### Validation Before Deployment

**Create metrics validation spreadsheet:**

| Profile | Expected | Actual Activity | Actual Impact | Actual Quality | Actual Growth | Pass? |
|---------|----------|----------------|---------------|----------------|---------------|-------|
| torvalds (Linux) | High across all | ? | ? | ? | ? | ✓/✗ |
| Fake farmer | Low quality, High activity | ? | ? | ? | ? | ✓/✗ |
| Junior dev | Moderate activity, Low impact | ? | ? | ? | ? | ✓/✗ |
| Part-time OSS | Low-moderate activity | ? | ? | ? | ? | ✓/✗ |

**Goal:** >80% of profiles scored as expected

### Deployment Steps

Same as Stage 1, plus:
- Manual validation with 5-10 GitHub profiles
- Compare with existing Authenticity score (sanity check)
- Monitor metric calculation performance

### Rollback Plan

**If metrics are broken:**

1. **Feature flag disable:**
   ```bash
   vercel env add VITE_ENABLE_NEW_METRICS false
   vercel --prod
   ```

2. **Git rollback (if feature flag not implemented):**
   ```bash
   git revert <metrics-commit-range>
   git push
   vercel --prod
   ```

**Existing UI still works** (tabs preserved in Stage 2)

---

## 🎨 Stage 3: V3 — New UI & Final Polish

**Goal:** Complete UI transformation and final optimizations

**Duration:** 1-2 weeks (Days 29-42)

### Phases Included
- **Phase 4:** Timeline Components (ActivityTimeline, TimelineYear)
- **Phase 5:** Layout Refactoring (remove tabs, single-page)
- **Phase 6:** Testing & Polish (E2E tests, accessibility, performance)

### What Users Get
- ✅ Complete redesign: single-page progressive disclosure
- ✅ Activity Timeline (year-by-year visualization)
- ✅ Improved project section (Owned 👤 vs Contributions 👥)
- ✅ No more tabs (vertical scroll layout)
- ✅ Smooth animations (CSS transitions + Framer Motion)
- ✅ Final accessibility and performance optimizations

### Technical Deliverables

**Phase 4 (Days 29-33):**
- [ ] `ActivityTimeline` component (year-by-year bars)
- [ ] `TimelineYear` component (collapsible with CSS transitions)
- [ ] `YearExpandedView` (detailed breakdown, reuses `RepositoryCard`)
- [ ] Works with all account ages (2-15+ years tested)
- [ ] Storybook stories + tests

**Phase 5 (Days 34-36):**
- [ ] `MainTabs` removed from `App.tsx`
- [ ] Single-page vertical scroll layout
- [ ] `ProjectSection` component (Owned vs Contributions split)
- [ ] `ProjectCard` enhanced with badges (👤 Owner / 👥 Contributor)
- [ ] Repository filters/sorting preserved
- [ ] Decision implemented: Statistics tab charts integrated into Timeline

**Phase 6 (Days 37-42):**
- [ ] E2E tests complete (`user-analytics-flow.spec.ts`)
- [ ] Accessibility audit: 0 errors (axe DevTools)
- [ ] Performance targets met:
  - LCP <2.5s
  - FID <100ms
  - Bundle size <500KB
  - Test coverage >95%
- [ ] Production deployment
- [ ] Post-launch monitoring setup

### Go/No-Go Criteria

**MUST HAVE:**
- ✅ All E2E tests pass
- ✅ Accessibility: 0 critical errors
- ✅ Performance: LCP <3s (target 2.5s)
- ✅ Mobile responsive (tested on 3 devices)
- ✅ No breaking changes (all features accessible)

**SHOULD HAVE:**
- ✅ Bundle size <500KB
- ✅ Timeline works for 10+ year accounts
- ✅ Smooth animations on mid-range devices

**NICE TO HAVE:**
- Lighthouse score >90
- Positive user feedback
- Lower bounce rate vs Stage 2

### Deployment Steps

Same as Stages 1-2, plus:
- **Cross-browser testing** (Chrome, Firefox, Safari)
- **Device testing** (desktop, tablet, mobile)
- **Load testing** (simulate 50+ concurrent users)
- **Post-deployment monitoring** (48-72 hours)

### Rollback Plan

**If major UI issues:**

1. **Quick rollback to Stage 2:**
   ```bash
   # Vercel dashboard → Previous deployment → Promote
   ```

2. **Git rollback:**
   ```bash
   git revert <ui-refactoring-commits>
   git push
   vercel --prod
   ```

**Users return to Stage 2 UI** (tabs + new metrics)

---

## 📊 Success Metrics

### Stage 1 (MVP)
- ✅ Zero token exposure incidents
- ✅ GitHub API usage <50% of limit (5000 req/hr)
- ✅ Error rate <1%
- ✅ Performance: LCP <3s

### Stage 2 (V2)
- ✅ Metrics calculation accuracy >80% (manual validation)
- ✅ Test coverage >95%
- ✅ Accessibility: 0 critical errors
- ✅ Error rate <1%

### Stage 3 (V3)
- ✅ Performance: LCP <2.5s, Bundle <500KB
- ✅ Accessibility: 0 errors
- ✅ E2E tests: 100% pass rate
- ✅ User satisfaction (if feedback available)

---

## 🛡️ Risk Mitigation

### High Risk: Security Vulnerability (Stage 1)
- **Mitigation:** Phase 0 is P0, cannot skip
- **Fallback:** Client-side token (temporary security regression)
- **Timeline:** Fix immediately, no exceptions

### Medium Risk: Metrics Inaccuracy (Stage 2)
- **Mitigation:** Validation spreadsheet with known profiles
- **Fallback:** Feature flag to disable new metrics
- **Timeline:** Can deploy and iterate

### Medium Risk: UI Regression (Stage 3)
- **Mitigation:** Keep tabs in Stage 2, remove in Stage 3
- **Fallback:** Rollback to Stage 2 UI
- **Timeline:** Can iterate on UI design

### Low Risk: Performance Degradation
- **Mitigation:** Lighthouse checks, load testing
- **Fallback:** Code splitting, lazy loading
- **Timeline:** Optimize post-deployment if needed

---

## 🔄 Rollback Decision Tree

```
Issue detected?
├─ YES
│  ├─ Security issue?
│  │  └─ YES → CRITICAL: Rollback immediately (Stage 1)
│  ├─ Functionality broken?
│  │  └─ YES → HIGH: Rollback within 1 hour
│  ├─ Performance degraded?
│  │  └─ YES → MEDIUM: Investigate, rollback if not fixable in 4 hours
│  └─ UI glitch?
│     └─ YES → LOW: Fix forward or rollback within 24 hours
└─ NO
   └─ Monitor for 48 hours, proceed to next stage
```

---

## 📅 Deployment Timeline

| Week | Stage | Phases | Deliverables | Deploy |
|------|-------|--------|--------------|--------|
| 1-2 | **Stage 1 (MVP)** | Phase 0-1 | Security + Year-by-year data | Preview → Prod |
| 3-4 | **Stage 2 (V2)** | Phase 2-3 | New metrics + Components | Preview → Prod |
| 5-6 | **Stage 3 (V3)** | Phase 4-6 | Timeline + New UI + Polish | Preview → Prod |

**Buffer:** 1 week for unexpected issues

---

## ✅ Pre-Deployment Checklist

### Before EACH Stage:

**Code Quality:**
- [ ] All tests pass (`npm run test:all`)
- [ ] Production build successful (`npm run build`)
- [ ] No TypeScript errors (`npx tsc --noEmit`)
- [ ] ESLint passes (`npm run lint`)

**Security:**
- [ ] No secrets in code (search for "ghp_", "token", API keys)
- [ ] Environment variables configured in Vercel
- [ ] HTTPS only (no HTTP requests)

**Testing:**
- [ ] Manual smoke test in preview environment
- [ ] Cross-browser testing (Chrome, Firefox, Safari)
- [ ] Mobile responsive test (iOS Safari, Chrome Android)
- [ ] Accessibility audit (axe DevTools)

**Monitoring:**
- [ ] Vercel logs accessible
- [ ] Error tracking configured (if available)
- [ ] GitHub API rate limit check script ready

**Rollback:**
- [ ] Previous deployment URL saved
- [ ] Rollback steps documented and tested
- [ ] Team notified of deployment window

---

## 📞 Communication Plan

### Before Deployment
- **Team notification:** 24 hours before
- **User notification:** (if applicable) Maintenance window announced

### During Deployment
- **Status updates:** Every 30 minutes during deployment window
- **Incident response:** Immediate notification if rollback needed

### After Deployment
- **Success confirmation:** Within 2 hours
- **Monitoring report:** 24 hours post-deployment
- **Retrospective:** 1 week post-deployment

---

## 📝 Post-Deployment Monitoring

### First 24 Hours
- **Error rate:** Check every hour
- **GitHub API usage:** Check every 2 hours
- **Performance:** Lighthouse audit
- **User reports:** Monitor feedback channels

### First Week
- **Error rate:** Daily checks
- **API usage:** Daily checks
- **Performance:** Every 2 days
- **User satisfaction:** Survey if available

### Ongoing
- **Weekly health check:** Error rate, API usage, performance
- **Monthly review:** Feature usage, user feedback, metrics accuracy

---

## 🎓 Lessons Learned (Post-Retrospective)

**To be filled after each stage:**

### Stage 1 (MVP)
- What went well:
- What went wrong:
- What to improve:

### Stage 2 (V2)
- What went well:
- What went wrong:
- What to improve:

### Stage 3 (V3)
- What went well:
- What went wrong:
- What to improve:

---

**Last Updated:** 2025-11-17
**Next Review:** After Stage 1 completion
**Document Owner:** Development Team

**Related Documents:**
- [IMPLEMENTATION_PLAN_HYBRID.md](./IMPLEMENTATION_PLAN_HYBRID.md) - Technical implementation details
- [ROLLBACK_PLAN.md](./ROLLBACK_PLAN.md) - Detailed rollback procedures
- [VERIFICATION_REPORT.md](./VERIFICATION_REPORT.md) - GitHub API capabilities
