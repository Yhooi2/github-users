# Phase 6: Testing & Polish (P2)

**Priority:** P2 (Nice to have)
**Estimated Time:** 2 days
**Status:** Ready for Implementation

---

## 🤖 Recommended Agents

**Before starting:**
- **Explore agent:** "Review all E2E test files in e2e/ directory"
- **Plan agent:** "Create testing and polish checklist"

**During implementation:**
- **general-purpose agent:** "Implement Step 6.1 - create user-analytics-flow.spec.ts"
- **general-purpose agent:** "Implement Step 6.2 - accessibility tests"
- **test-runner-fixer agent:** "Run all E2E tests (chromium, firefox, webkit)"
- **general-purpose agent:** "Implement Step 6.3 - performance tests"
- **test-runner-fixer agent:** "Run test coverage report"

**After implementation:**
- **debug-specialist agent:** "Fix any E2E test failures"
- **code-review-specialist agent:** "Verify all deliverables complete"
- **code-review-specialist agent:** "Final production readiness check"

**Final verification:**
```bash
test-runner-fixer agent: "Run npm run test:all and verify >95% coverage"
Explore agent: "Check Lighthouse score >90"
```

---

## 🎯 Goal

Ensure production readiness through comprehensive testing and optimization.

**Current State:**
- 99.85% test pass rate (1302/1304 tests)
- E2E tests exist (e2e/user-search.spec.ts)
- Storybook configured
- Basic accessibility

**Target State:**
- >95% test coverage overall
- E2E tests for new features
- 0 accessibility errors
- Performance targets met
- Production deployed to Vercel

---

## 📋 Implementation Steps

### Step 6.1: E2E Tests for New Features

**File:** `e2e/user-analytics-flow.spec.ts`

```typescript
import { test, expect } from '@playwright/test'

test.describe('User Analytics Flow', () => {
  test('complete analytics flow from search to timeline', async ({ page }) => {
    await page.goto('/')

    // Search for user
    await page.fill('[data-testid="search-input"]', 'torvalds')
    await page.click('[data-testid="search-button"]')

    // Wait for profile to load
    await expect(page.locator('text=Linus Torvalds')).toBeVisible({ timeout: 10000 })

    // Check Quick Assessment metrics
    await expect(page.locator('text=Activity')).toBeVisible()
    await expect(page.locator('text=Impact')).toBeVisible()
    await expect(page.locator('text=Quality')).toBeVisible()
    await expect(page.locator('text=Growth')).toBeVisible()

    // Check metric values are loaded (should show percentages)
    const activityScore = page.locator('text=/\\d+%/').first()
    await expect(activityScore).toBeVisible()

    // Check Activity Timeline
    await expect(page.locator('text=Activity Timeline')).toBeVisible()

    // Expand a year
    const currentYear = new Date().getFullYear()
    await page.click(`text=${currentYear}`)

    // Check expanded view
    await expect(page.locator('text=Your Projects').or(page.locator('text=Open Source Contributions'))).toBeVisible({ timeout: 5000 })

    // Check Top Projects section
    await expect(page.locator('text=Top Projects')).toBeVisible()
    await expect(page.locator('text=👤 Owner').or(page.locator('text=👥 Contributor'))).toBeVisible({ timeout: 5000 })
  })

  test('handles user not found', async ({ page }) => {
    await page.goto('/')

    // Search for non-existent user
    await page.fill('[data-testid="search-input"]', 'thisuserdoesnotexist12345')
    await page.click('[data-testid="search-button"]')

    // Check error message
    await expect(page.locator('text=/User not found|Error/i')).toBeVisible({ timeout: 5000 })
  })

  test('metric explanation modal', async ({ page }) => {
    await page.goto('/')

    await page.fill('[data-testid="search-input"]', 'torvalds')
    await page.click('[data-testid="search-button"]')

    await expect(page.locator('text=Activity')).toBeVisible({ timeout: 10000 })

    // Click explain button (Info icon)
    const explainButton = page.locator('[aria-label*="Explain Activity"]').first()
    if (await explainButton.isVisible()) {
      await explainButton.click()

      // Check modal opened
      await expect(page.locator('text=/Activity Score|Recent commits/i')).toBeVisible()
    }
  })

  test('timeline collapse/expand', async ({ page }) => {
    await page.goto('/')

    await page.fill('[data-testid="search-input"]', 'torvalds')
    await page.click('[data-testid="search-button"]')

    await expect(page.locator('text=Activity Timeline')).toBeVisible({ timeout: 10000 })

    const currentYear = new Date().getFullYear()

    // Year should be collapsed initially
    const yearButton = page.locator(`button:has-text("${currentYear}")`)
    await expect(yearButton).toBeVisible()

    // Expand year
    await yearButton.click()
    await expect(page.locator('text=/commits|Your Projects|Contributions/i')).toBeVisible({ timeout: 3000 })

    // Collapse year
    await yearButton.click()
    await page.waitForTimeout(500) // Wait for collapse animation
  })

  test('responsive layout on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')

    await page.fill('[data-testid="search-input"]', 'torvalds')
    await page.click('[data-testid="search-button"]')

    await expect(page.locator('text=Activity')).toBeVisible({ timeout: 10000 })

    // Metrics should stack vertically (1 column on mobile)
    const metricsGrid = page.locator('.grid').first()
    const gridCols = await metricsGrid.evaluate(el =>
      window.getComputedStyle(el).getPropertyValue('grid-template-columns')
    )

    // Should be 1 column on mobile
    expect(gridCols).not.toContain('minmax') // Not multi-column
  })
})
```

---

### Step 6.2: Accessibility Audit

**Install axe:**
```bash
npm install -D @axe-core/playwright
```

**File:** `e2e/accessibility.spec.ts`

```typescript
import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test.describe('Accessibility', () => {
  test('homepage has no accessibility violations', async ({ page }) => {
    await page.goto('/')

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze()

    expect(accessibilityScanResults.violations).toEqual([])
  })

  test('user profile page has no accessibility violations', async ({ page }) => {
    await page.goto('/')

    await page.fill('[data-testid="search-input"]', 'torvalds')
    await page.click('[data-testid="search-button"]')

    await expect(page.locator('text=Activity')).toBeVisible({ timeout: 10000 })

    const accessibilityScanResults = await new AxeBuilder({ page })
      .exclude('[data-testid="external-link"]') // Exclude third-party content
      .analyze()

    expect(accessibilityScanResults.violations).toEqual([])
  })

  test('keyboard navigation works', async ({ page }) => {
    await page.goto('/')

    // Tab to search input
    await page.keyboard.press('Tab')
    const searchInput = page.locator('[data-testid="search-input"]')
    await expect(searchInput).toBeFocused()

    // Type username
    await page.keyboard.type('torvalds')

    // Tab to search button
    await page.keyboard.press('Tab')
    const searchButton = page.locator('[data-testid="search-button"]')
    await expect(searchButton).toBeFocused()

    // Press Enter to search
    await page.keyboard.press('Enter')

    await expect(page.locator('text=Activity')).toBeVisible({ timeout: 10000 })

    // Navigate to timeline year with keyboard
    await page.keyboard.press('Tab') // Keep tabbing to reach year button
    // ... verify keyboard navigation through all interactive elements
  })

  test('screen reader announcements', async ({ page }) => {
    await page.goto('/')

    // Check ARIA labels
    const searchInput = page.locator('[data-testid="search-input"]')
    await expect(searchInput).toHaveAttribute('aria-label', /search/i)

    // Check heading hierarchy
    const h1 = page.locator('h1')
    await expect(h1).toHaveText(/GitHub User Analytics/i)
  })
})
```

---

### Step 6.3: Performance Audit

**Run Lighthouse:**
```bash
npm run build
npx vite preview --port 4173

# In another terminal
npx lighthouse http://localhost:4173 --view
```

**Performance Targets:**
- Performance Score: >90
- LCP: <2.5s
- FID: <100ms
- CLS: <0.1
- Bundle Size: <500KB (gzipped)

**File:** `e2e/performance.spec.ts`

```typescript
import { test, expect } from '@playwright/test'

test.describe('Performance', () => {
  test('measures Core Web Vitals', async ({ page }) => {
    await page.goto('/')

    // Measure performance metrics
    const metrics = await page.evaluate(() => {
      return new Promise(resolve => {
        new PerformanceObserver(list => {
          const entries = list.getEntries()
          const lcp = entries.find(e => e.entryType === 'largest-contentful-paint')
          const fid = entries.find(e => e.entryType === 'first-input')
          const cls = entries.find(e => e.entryType === 'layout-shift')

          resolve({ lcp, fid, cls })
        }).observe({ entryTypes: ['paint', 'first-input', 'layout-shift'] })
      })
    })

    console.log('Performance metrics:', metrics)
  })

  test('bundle size is within limits', async ({ page }) => {
    const response = await page.goto('/')

    const resources = await page.evaluate(() =>
      performance.getEntriesByType('resource')
        .filter(r => r.initiatorType === 'script')
        .map(r => ({ name: r.name, size: r.transferSize }))
    )

    const totalSize = resources.reduce((sum, r) => sum + (r.size || 0), 0)

    console.log(`Total JS bundle size: ${(totalSize / 1024).toFixed(2)} KB`)

    // Should be under 500KB (compressed)
    expect(totalSize).toBeLessThan(500 * 1024)
  })
})
```

---

### Step 6.4: Test Coverage Report

**Generate coverage:**
```bash
npm run test:coverage
```

**Check coverage thresholds in `vite.config.ts`:**

```typescript
export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      thresholds: {
        lines: 95,
        functions: 95,
        branches: 90,
        statements: 95
      },
      exclude: [
        'node_modules/**',
        'dist/**',
        'e2e/**',
        '**/*.stories.tsx',
        '**/*.spec.ts'
      ]
    }
  }
})
```

---

### Step 6.5: Production Deployment Checklist

**Pre-deployment:**

- [ ] All tests passing (`npm run test:all`)
- [ ] Coverage >95%
- [ ] Lighthouse score >90
- [ ] Accessibility: 0 errors
- [ ] Environment variables configured in Vercel
- [ ] Vercel KV setup
- [ ] GitHub token secured (not in bundle)
- [ ] Error tracking configured (optional: Sentry)
- [ ] Analytics configured (Vercel Analytics)

**Deployment:**

```bash
# Deploy to production
vercel --prod

# Verify deployment
curl https://your-app.vercel.app/api/github-proxy \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"query":"query { viewer { login } }"}'
```

**Post-deployment:**

- [ ] Smoke test on production URL
- [ ] Check Vercel logs (no errors)
- [ ] Monitor GitHub API rate limits
- [ ] Test with real users (3-5 searches)
- [ ] Check performance in production (Vercel Analytics)
- [ ] Set up alerts (error rate, slow queries)

---

## ✅ Deliverables

- [ ] E2E tests pass (user-analytics-flow.spec.ts)
- [ ] Accessibility audit: 0 errors (axe-core)
- [ ] Performance targets met (LCP <2.5s, Bundle <500KB)
- [ ] Test coverage >95% overall
- [ ] All Playwright tests passing (chromium, firefox, webkit)
- [ ] Production deployed to Vercel
- [ ] Monitoring configured
- [ ] Documentation updated (README, CHANGELOG)

---

## 📊 Quality Gates

**Must Pass Before Production:**

1. **Tests:** All unit + E2E tests passing
2. **Coverage:** >95% line coverage
3. **Performance:** Lighthouse >90
4. **Accessibility:** 0 critical issues
5. **Security:** Token not in bundle
6. **Errors:** <1% error rate in staging

**Nice to Have:**

- Sentry error tracking
- Bundle analysis report
- Visual regression tests
- Load testing results

---

## 🧪 Testing Strategy Summary

**Test Pyramid:**
```
       E2E Tests (10%)
         ↑
    Integration Tests (20%)
         ↑
    Unit Tests (70%)
```

**Coverage:**
- Unit: Metrics calculations, utilities, hooks
- Integration: Component rendering, user interactions
- E2E: Full user flows, cross-browser testing

---

## 🔄 Rollback Plan

**If production fails:**

1. **Instant Rollback (Vercel):**
   - Go to Vercel Dashboard → Deployments
   - Find previous working deployment
   - Click "Promote to Production"

2. **Manual Rollback:**
   ```bash
   git revert HEAD
   git push
   vercel --prod
   ```

3. **Feature Flags:**
   ```bash
   # Disable new features
   vercel env add VITE_ENABLE_NEW_METRICS false
   ```

4. **Monitor:**
   - Check error logs: `vercel logs --follow`
   - Check rate limits: GitHub API quota
   - Check user reports: Feedback form

---

## 📚 Resources

**Testing:**
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Vitest Coverage](https://vitest.dev/guide/coverage.html)

**Accessibility:**
- [axe-core](https://www.deque.com/axe/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Practices](https://www.w3.org/WAI/ARIA/apg/)

**Performance:**
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [Web Vitals](https://web.dev/vitals/)
- [Vercel Analytics](https://vercel.com/docs/analytics)

**Deployment:**
- [Vercel Deployment](https://vercel.com/docs/deployments/overview)
- [Environment Variables](https://vercel.com/docs/projects/environment-variables)
- [Vercel KV](https://vercel.com/docs/storage/vercel-kv)

---

## 🎉 Success Criteria

**Phase 6 Complete When:**

- ✅ All 6 phases implemented
- ✅ All tests passing (>95% coverage)
- ✅ Production deployed to Vercel
- ✅ No critical bugs in first week
- ✅ Performance targets met
- ✅ User feedback positive

**Congratulations! The refactoring is complete!** 🎊

---

**Previous Phase:** [Phase 5: Layout Refactoring](./phase-5-layout-refactoring.md)
**Return to:** [Refactoring Master Plan](../REFACTORING_MASTER_PLAN.md)
