# GitHub User Analytics — Refactoring Master Plan

**Version:** 5.0 Unified
**Date:** 2025-11-17
**Status:** Ready for Implementation
**Total Duration:** 14 days (6 phases)

---

## 📋 Quick Navigation

**Phase Documents:**
- [Phase 0: Backend Security Layer](./phases/phase-0-backend-security.md) — 2 days, P0 (Critical)
- [Phase 1: GraphQL Multi-Query Architecture](./phases/phase-1-graphql-multi-query.md) — 3 days, P0 (Critical)
- [Phase 2: Metrics Calculation System](./phases/phase-2-metrics-calculation.md) — 2 days, P0 (Critical)
- [Phase 3: Core Components](./phases/phase-3-core-components.md) — 2 days, P0 (Critical)
- [Phase 4: Timeline Components](./phases/phase-4-timeline-components.md) — 2 days, P1 (Important)
- [Phase 5: Layout Refactoring](./phases/phase-5-layout-refactoring.md) — 1 day, P1 (Important)
- [Phase 6: Testing & Polish](./phases/phase-6-testing-polish.md) — 2 days, P2 (Polish)

**Supporting Documents:**
- [Rollback Plan](./ROLLBACK_PLAN.md)
- [Performance Benchmarks](./PERFORMANCE_BENCHMARKS.md)
- [Deployment Strategy](./DEPLOYMENT_STRATEGY.md)
- [Metrics Explanation](./metrics-explanation.md)

---

## ⚠️ Critical Information

### 🔴 Security Status (MUST READ FIRST!)

**CRITICAL:** GitHub token is currently exposed in client bundle!

**Current Risk:**
- ❌ Token visible in `dist/assets/*.js` after build
- ❌ Cannot deploy to production
- ❌ Rate limit exhaustion risk

**Solution:** Phase 0 (Backend Security) — MUST complete before production!

**Details:** See [Phase 0: Backend Security Layer](./phases/phase-0-backend-security.md)

---

## 🎯 Project Overview

### What This Is

**Refactoring Plan** for existing production app (Phase 10 completed).
NOT a greenfield implementation!

**Goal:** Transform GitHub User Info into modern analytics dashboard with:
- 4 key metrics (Activity, Impact, Quality, Growth)
- Year-by-year timeline
- Progressive disclosure UI
- Production-ready security

### Current State (70% Ready)

**What Already Exists:**
- ✅ React 19 + Vite 7 + TypeScript 5.8.3
- ✅ Apollo Client 3.14.0 configured
- ✅ shadcn/ui (28+ components)
- ✅ Recharts 2.15.4
- ✅ 99.85% test pass rate (1302/1304 tests)
- ✅ Authenticity score (perfect template for new metrics!)
- ✅ UserAuthenticity component (perfect UI template!)

**What Needs Building (30%):**
- 🆕 Backend proxy + token security
- 🆕 Year-by-year data fetching
- 🆕 4 new metrics (activity, impact, quality, growth)
- 🆕 QuickAssessment + Timeline components
- 🆕 Single-page layout (remove tabs)

---

## 🛠️ Technology Stack

### Existing (No Changes)
- **Framework:** Vite 7
- **Runtime:** React 19
- **Styling:** Tailwind CSS v4
- **State:** Apollo Client 3.14 (GraphQL)
- **UI:** shadcn/ui (New York style)
- **Testing:** Vitest + Playwright + Storybook

### New Additions
- **Backend:** Vercel Serverless Functions
- **Caching:** @vercel/kv (30 min TTL)
- **Animations:** CSS Transitions (95%) + Framer Motion (5%)

---

## 🚫 What NOT to Change

### Keep These Components:
- ✅ UserAuthenticity (different purpose, valuable for fraud detection)
- ✅ RepositoryList/Table (working filters/sorting)
- ✅ RepositoryCard (enhance with badges, don't replace)
- ✅ UserHeader, UserStats (basic profile display)

### Keep These Patterns:
- ✅ Component → Story → Test workflow
- ✅ Storybook MCP integration
- ✅ TypeScript strict mode
- ✅ Test coverage >90% standard

### Keep These as Templates:
- ✅ `src/lib/authenticity.ts` — Template for ALL new metric functions
- ✅ `src/components/UserAuthenticity.tsx` — Template for MetricCard
- ✅ `src/lib/statistics.ts` — Helper functions to reuse
- ✅ `src/apollo/date-helpers.ts` — Extend, don't replace

---

## 📊 Phase Timeline & Priorities

| Phase | Duration | Priority | Description |
|-------|----------|----------|-------------|
| **Phase 0** | 2 days | P0 🔴 | Backend proxy + token security (BLOCKS PRODUCTION) |
| **Phase 1** | 3 days | P0 🔴 | Year-by-year GraphQL queries |
| **Phase 2** | 2 days | P0 🔴 | Calculate 4 metrics |
| **Phase 3** | 2 days | P0 🔴 | MetricCard + QuickAssessment UI |
| **Phase 4** | 2 days | P1 🟡 | Timeline components |
| **Phase 5** | 1 day | P1 🟡 | Remove tabs, single-page layout |
| **Phase 6** | 2 days | P2 🟢 | E2E tests, accessibility, production |
| **TOTAL** | **14 days** | | |

**P0 = Critical** (must have), **P1 = Important** (should have), **P2 = Polish** (nice to have)

---

## 🔄 MCP-Driven Development Process

**After EVERY step:**
```
📝 PLAN → ⚡ EXECUTE → 🔍 MCP CHECK → 📊 UPDATE PLAN → ➡️ NEXT
```

**MCP Servers:**
- **Vercel:** Deployment, serverless functions
- **Context7:** Library documentation (Apollo, React)
- **shadcn:** UI component docs
- **Storybook:** Component catalog

**Note:** MCP checks are optional but recommended for quality.

---

## 📦 Dependencies

### Already Installed (Reuse)
```json
{
  "react": "19.0.0",
  "vite": "7.0.0",
  "@apollo/client": "3.14.0",
  "recharts": "2.15.4",
  "shadcn/ui": "latest"
}
```

### Required (New)
```json
{
  "@vercel/kv": "^3.0.0"
}
```

### Optional (Phase 5+)
```json
{
  "framer-motion": "^11.0.0"  // Only for modals, ~15KB
}
```

---

## ✅ Success Criteria

### Phase 0 (Backend)
- [ ] GitHub token secured on server
- [ ] Token NOT visible in DevTools
- [ ] Vercel KV caching works
- [ ] Deployed to Vercel Free tier

### Phase 1 (Data)
- [ ] Year-by-year data loads (account creation to now)
- [ ] Owned repos separated from contributions
- [ ] Parallel queries work (`Promise.all`)
- [ ] Cache keys per year working

### Phase 2 (Metrics)
- [ ] All 4 metrics implemented
- [ ] Each follows `authenticity.ts` pattern
- [ ] 100% test coverage for calculations
- [ ] Benchmark labels correct

### Phase 3 (UI)
- [ ] MetricCard responsive
- [ ] QuickAssessment grid works (4 metrics)
- [ ] Storybook stories complete
- [ ] Accessibility: 0 errors

### Phase 4 (Timeline)
- [ ] Timeline renders all years
- [ ] Expand/collapse smooth (CSS)
- [ ] Visual bars proportional
- [ ] Reuses RepositoryCard

### Phase 5 (Layout)
- [ ] Tabs removed
- [ ] Single-page vertical scroll
- [ ] Owned vs Contributions split (👤 / 👥)
- [ ] Responsive (mobile/desktop)

### Phase 6 (Polish)
- [ ] E2E tests pass
- [ ] Accessibility: 0 errors (axe-core)
- [ ] Performance: LCP <2.5s, Bundle <500KB
- [ ] Coverage >95%
- [ ] Production deployed

---

## 🔄 Rollback Strategy

**General Principles:**
- Create feature branch for each phase: `feature/phase-{N}-{name}`
- Tag before merging: `before-phase-{N}`
- Use Vercel preview deployments for testing
- Enable instant rollback (1-click revert)
- Monitor production 24-48h after deployment

**Feature Flags:**
```typescript
// src/config/features.ts
export const FEATURE_FLAGS = {
  NEW_METRICS: import.meta.env.VITE_ENABLE_NEW_METRICS === 'true',
  TIMELINE_VIEW: import.meta.env.VITE_ENABLE_TIMELINE === 'true',
}
```

**Quick Rollback:**
```bash
# Vercel dashboard → Previous deployment → Promote
# Or: git revert + push
```

**Full Details:** [ROLLBACK_PLAN.md](./ROLLBACK_PLAN.md)

---

## ⚡ Performance Targets

| Metric | Target | Current | After Refactoring |
|--------|--------|---------|-------------------|
| **LCP** | <2.5s | 1.8s ✅ | 2.0s ✅ |
| **FID** | <100ms | 45ms ✅ | 50ms ✅ |
| **Bundle** | <500KB | 141KB ✅ | ~250KB ✅ |
| **API Queries** | <1s | ~800ms ✅ | <500ms (cached) ✅ |

**Full Details:** [PERFORMANCE_BENCHMARKS.md](./PERFORMANCE_BENCHMARKS.md)

---

## 📚 Additional Resources

**Project Documentation:**
- `.claude/CLAUDE.md` — Main development guide
- `docs/metrics-explanation.md` — Metrics v1.0 formulas
- `docs/DEPLOYMENT_STRATEGY.md` — 3-stage rollout plan

**External Links:**
- [GitHub GraphQL API](https://docs.github.com/en/graphql)
- [Vercel Functions](https://vercel.com/docs/functions)
- [Apollo Client](https://www.apollographql.com/docs/react/)
- [shadcn/ui](https://ui.shadcn.com/)

---

## 🚀 Getting Started

1. **Read Security Status** (above) ⚠️
2. **Choose Phase 0** → [Backend Security](./phases/phase-0-backend-security.md)
3. **Follow MCP Process** (Plan → Execute → Check → Update)
4. **Complete Deliverables** (checkboxes in each phase)
5. **Move to Next Phase** (links at bottom of each phase doc)

---

**Last Updated:** 2025-11-17
**Maintained By:** Development Team
**Review After:** Each phase completion
