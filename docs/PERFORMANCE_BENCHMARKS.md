# Performance Benchmarks & Monitoring

**Version:** 1.0
**Date:** 2025-11-17
**Project:** GitHub User Info - Performance Targets and Monitoring Setup

---

## 📊 Performance Targets

### Load Time Targets

| Metric | Target | Current (v1.0) | After Phase 0 | After Phase 6 | Threshold |
|--------|--------|----------------|---------------|---------------|-----------|
| **LCP** (Largest Contentful Paint) | <2.5s | 1.8s ✅ | 2.0s ✅ | 1.5s ✅ | 🔴 >4s |
| **FID** (First Input Delay) | <100ms | 45ms ✅ | 50ms ✅ | 40ms ✅ | 🔴 >300ms |
| **CLS** (Cumulative Layout Shift) | <0.1 | 0.05 ✅ | 0.05 ✅ | 0.03 ✅ | 🔴 >0.25 |
| **TTI** (Time to Interactive) | <3.5s | 2.5s ✅ | 2.8s ✅ | 2.2s ✅ | 🔴 >7s |
| **TBT** (Total Blocking Time) | <200ms | 150ms ✅ | 180ms ✅ | 120ms ✅ | 🔴 >600ms |

**Sources:**
- LCP, FID, CLS: Core Web Vitals (Google)
- TTI, TBT: Lighthouse Performance Score

**How to measure:**
```bash
# 1. Lighthouse
npm run build
npx lighthouse http://localhost:4173 --view

# 2. Vercel Analytics (Production)
# Dashboard → Analytics → Web Vitals

# 3. Chrome DevTools
# DevTools → Performance → Record → Analyze
```

---

### Bundle Size Targets

| Asset | Target | Current (v1.0) | After Fraud Detection (Phase 1.5) | After All Phases |
|-------|--------|----------------|-----------------------------------|-----------------|
| **Main JS (gzip)** | <150KB | 141KB ✅ | 155KB ⚠️ (+14KB) | 165KB ⚠️ |
| **CSS (gzip)** | <30KB | 25KB ✅ | 25KB ✅ | 28KB ✅ |
| **Total (gzip)** | <180KB | 166KB ✅ | 180KB ✅ (at limit) | 193KB 🔴 (-13KB over) |

**Bundle Breakdown:**
```
Main JS breakdown:
  - React 19: ~42KB
  - Apollo Client: ~35KB
  - Recharts: ~28KB
  - shadcn/ui: ~15KB
  - App code: ~21KB
  - Fraud Detection (new): +14KB
  - Growth Metrics (new): +8KB
  Total: ~163KB (gzipped)
```

**How to measure:**
```bash
# 1. Build
npm run build

# 2. Check sizes
ls -lh dist/assets/*.js | head -5

# 3. Bundle analyzer
npx vite-bundle-visualizer

# 4. Gzip sizes
gzip -c dist/assets/index-*.js | wc -c
```

**Optimization Strategies (if over limit):**
- Code splitting: `React.lazy()` for heavy components
- Tree shaking: Ensure `sideEffects: false` in package.json
- Dynamic imports: Load fraud detection only when needed
- Remove unused deps: `npx depcheck`

---

### API Performance

| Endpoint | Target | With Cache (30min) | Without Cache | Notes |
|----------|--------|---------------------|---------------|-------|
| Search user | <1s | <200ms ✅ | <800ms ✅ | Vercel KV cache |
| Fraud detection | <100ms | N/A (client-side) | <80ms ✅ | Pure computation |
| Overall rank | <50ms | N/A (client-side) | <30ms ✅ | Pure computation |
| Year-by-year data (15 years) | <3s | <300ms ✅ | <2.5s ✅ | Promise.all parallel queries |

**How to measure:**
```typescript
// Add performance tracking
const start = performance.now();
const result = await fetchUserData(username);
const duration = performance.now() - start;

console.log(`fetchUserData took ${duration}ms`);
if (duration > 1000) {
  console.warn(`⚠️ Slow fetch: ${duration}ms`);
}
```

---

## 🚀 Monitoring Setup

### 1. Vercel Analytics (Built-in)

**Automatically tracks:**
- ✅ LCP, FID, CLS (Core Web Vitals)
- ✅ Page views, unique visitors
- ✅ Top pages, traffic sources
- ✅ Real user monitoring (RUM)

**Setup:** Already enabled (no code needed)

**Access:** Vercel Dashboard → Analytics

---

### 2. Custom Metrics Tracking

**File:** `src/lib/monitoring.ts`

```typescript
interface PerformanceMetric {
  name: string;
  duration: number;
  timestamp: number;
}

export function trackMetricCalculation(metricName: string, duration: number) {
  const metric: PerformanceMetric = {
    name: metricName,
    duration,
    timestamp: Date.now(),
  };

  // 1. Log to console (development)
  if (import.meta.env.DEV) {
    console.log(`⏱️ ${metricName}: ${duration.toFixed(2)}ms`);
  }

  // 2. Warn if slow
  if (duration > 100) {
    console.warn(`⚠️ ${metricName} took ${duration.toFixed(2)}ms (>100ms threshold)`);
  }

  // 3. Send to analytics (production)
  if (import.meta.env.PROD && window.gtag) {
    window.gtag('event', 'metric_calculation', {
      metric_name: metricName,
      duration_ms: Math.round(duration),
      is_slow: duration > 100,
    });
  }

  // 4. Track in Vercel Speed Insights (if installed)
  if (window.webVitals) {
    window.webVitals.sendCustomMetric(metricName, duration);
  }

  return metric;
}
```

**Usage:**
```typescript
// In calculateFraudDetection()
const start = performance.now();
const fraud = detectFraudPatterns(user, repos);
trackMetricCalculation('fraud_detection', performance.now() - start);

// In calculateActivityScore()
const start = performance.now();
const activity = computeActivity(timeline);
trackMetricCalculation('activity_score', performance.now() - start);
```

---

### 3. Error Rate Monitoring

**Setup Sentry (optional, recommended):**

```bash
npm install @sentry/react
```

```typescript
// src/main.tsx
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.MODE,
  tracesSampleRate: 0.1, // 10% of requests
  enabled: import.meta.env.PROD, // Only in production
});
```

**Metrics tracked:**
- Error rate (errors/total requests)
- Error types (TypeError, NetworkError, etc.)
- Affected users
- Browser/OS distribution

---

## 📈 Alert Thresholds

**Setup alerts in Vercel/monitoring tool:**

```typescript
// Pseudo-code for alert rules
if (errorRate > 0.05) {
  alert('🔴 Error rate >5%');
  rollback();
}

if (p95ResponseTime > 2000) {
  alert('🟡 Slow responses (p95 >2s)');
  investigate();
}

if (rateLimitRemaining < 500) {
  alert('🟡 GitHub API rate limit low');
  checkCacheHitRate();
}

if (coreWebVitalsFailRate > 0.25) {
  alert('🔴 Core Web Vitals failing (>25% users)');
  optimizePerformance();
}
```

**Alert channels:**
- Email: team@example.com
- Slack: #alerts channel
- PagerDuty: On-call rotation

---

## 🧪 Performance Testing

### 1. Lighthouse (before each phase)

```bash
# 1. Build production
npm run build

# 2. Preview locally
npx vite preview --port 4173

# 3. Run Lighthouse
npx lighthouse http://localhost:4173 --view

# 4. Check scores
# Performance: >90 ✅
# Accessibility: 100 ✅
# Best Practices: >90 ✅
# SEO: >90 ✅
```

**Save report:**
```bash
npx lighthouse http://localhost:4173 \
  --output html \
  --output-path reports/lighthouse-$(date +%Y%m%d).html
```

---

### 2. Bundle Analysis

```bash
# 1. Build with source maps
npm run build

# 2. Analyze bundle
npx vite-bundle-visualizer

# 3. Check for:
# - Duplicate dependencies (should be 0)
# - Unused code (tree-shake it)
# - Large libraries (consider alternatives)
```

**Example output:**
```
dist/assets/index-abc123.js     163 KB (gzipped)
  ├─ react                       42 KB
  ├─ @apollo/client              35 KB
  ├─ recharts                    28 KB
  ├─ shadcn/ui                   15 KB
  ├─ fraud-detection             14 KB  ← NEW
  ├─ growth-metrics               8 KB  ← NEW
  └─ app-code                    21 KB
```

---

### 3. Load Testing (optional)

**For high-traffic scenarios:**

```bash
# Install autocannon
npm install -g autocannon

# Test endpoint
autocannon -c 10 -d 30 http://localhost:4173

# Options:
# -c 10: 10 concurrent connections
# -d 30: 30 seconds duration

# Expected results:
# Requests/sec: >100
# Latency p99: <500ms
# Errors: 0
```

---

## 📋 Performance Checklist

**Before each deployment:**

- [ ] Run Lighthouse (Performance >90)
- [ ] Check bundle size (Total <180KB gzipped)
- [ ] Verify Core Web Vitals (LCP <2.5s, FID <100ms, CLS <0.1)
- [ ] Test on slow 3G network (DevTools → Network → Slow 3G)
- [ ] Test on low-end device (DevTools → Performance → CPU 4x slowdown)
- [ ] Check error rate in Sentry (<1%)
- [ ] Verify cache hit rate (Vercel KV >50%)

**After deployment:**

- [ ] Monitor Core Web Vitals for 24 hours
- [ ] Check error rate (should stay <1%)
- [ ] Review slow queries (p95 <2s)
- [ ] Analyze bundle size trend (should not increase >10%)

---

## 🎯 Performance Goals by Phase

| Phase | Goal | Benchmark |
|-------|------|-----------|
| Phase 0 | Backend proxy working | API response <1s |
| Phase 1 | Year-by-year queries fast | 15 years in <3s |
| Phase 1.5 | Fraud detection fast | Calculation <100ms |
| Phase 2 | Metrics calculation fast | All 4 metrics <200ms total |
| Phase 3 | Components render fast | First render <16ms (60fps) |
| Phase 4 | Timeline smooth | Expand/collapse <100ms |
| Phase 5 | Layout performant | No CLS, smooth scroll |
| Phase 6 | Production ready | All targets met ✅ |

---

## 📚 Resources

**Tools:**
- Lighthouse: https://developers.google.com/web/tools/lighthouse
- Vercel Analytics: https://vercel.com/analytics
- Bundle Visualizer: https://www.npmjs.com/package/vite-bundle-visualizer
- Chrome DevTools: https://developer.chrome.com/docs/devtools/

**Best Practices:**
- Web Vitals: https://web.dev/vitals/
- Performance Budgets: https://web.dev/performance-budgets-101/
- Bundle Optimization: https://vitejs.dev/guide/build.html#chunking-strategy

---

**Last Updated:** 2025-11-17
**Maintained By:** Development Team
**Review Frequency:** After each phase completion
