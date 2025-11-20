# E2E Test Requirements (Playwright)

**Status:** ✅ Week 3-4 P2 - COMPLETED (2 E2E test suites implemented)
**Priority:** P2 (Integration tests completed, E2E tests implemented)
**Framework:** Playwright (already configured in `playwright.config.ts`)

**Implemented Tests:**

- ✅ `e2e/session-expiration.spec.ts` - 6 scenarios (373 lines)
- ✅ `e2e/cache-transition.spec.ts` - 5 scenarios (366 lines)
- ✅ Total: 11 new E2E test scenarios covering complex flows

---

## Overview

Integration tests have successfully covered most critical paths using Vitest + MockedProvider. However, two complex scenarios require end-to-end testing with a real browser:

1. **Cache Transition (Demo → Auth Mode)** - Too complex for unit mocking
2. **Session Expiration Mid-Use** - Requires real server + KV storage

These tests should be implemented in Playwright when time allows.

---

## 1. Cache Transition E2E Test

**File:** `e2e/cache-transition.spec.ts`

### User Story

> As a user, when I transition from demo mode to authenticated mode via OAuth, I should see fresh data fetched with my personal rate limit, not cached demo data.

### Critical Path

```
Demo Mode → Search User → Login (OAuth) → Search Same User → Fresh Data
```

### Test Scenario

```typescript
// e2e/cache-transition.spec.ts
import { test, expect } from "@playwright/test";

test.describe("Cache Transition: Demo → Auth", () => {
  test("should fetch fresh data after OAuth login", async ({
    page,
    context,
  }) => {
    // 1. Start in demo mode
    await page.goto("/");

    // 2. Search for user in demo mode
    await page.fill('input[placeholder*="Search GitHub User"]', "torvalds");
    await page.click('button:has-text("Search")');

    // 3. Verify demo mode active
    await expect(page.locator("text=Demo mode")).toBeVisible();
    await expect(page.locator("text=/5000.*5000/i")).toBeVisible(); // 5000/5000 rate limit

    // 4. Click "Sign in with GitHub"
    await page.click('button:has-text("Sign in with GitHub")');

    // 5. Complete OAuth flow (mock or use test credentials)
    // Note: This requires OAuth app setup or mock OAuth server
    await page.waitForURL("/?auth=success");

    // 6. Verify authenticated mode active
    await expect(page.locator("text=Authenticated")).toBeVisible();
    await expect(page.locator("text=/4999.*5000/i")).toBeVisible(); // Personal rate limit (decremented)

    // 7. Search same user again
    await page.fill('input[placeholder*="Search GitHub User"]', "torvalds");
    await page.click('button:has-text("Search")');

    // 8. Verify fresh API call made (check network tab)
    const requests = await page.context().waitForEvent("requestfinished");
    const apiCalls = requests.filter((req) =>
      req.url().includes("/api/github-proxy"),
    );

    expect(apiCalls.length).toBeGreaterThan(1); // Multiple API calls, not cached

    // 9. Verify updated rate limit (fresh data, not demo cache)
    await expect(page.locator("text=/4998.*5000/i")).toBeVisible();
  });
});
```

### Prerequisites

- OAuth app configured with test credentials
- Mock OAuth server (or use real GitHub OAuth in test environment)
- Vercel KV available for session storage

### Expected Behavior

- Demo mode: `demo:{cacheKey}` cache prefix
- Auth mode: `user:{sessionId}:{cacheKey}` cache prefix
- Fresh API call after OAuth (not demo cache reuse)
- Rate limit updates correctly

### Success Criteria

✅ User sees demo mode rate limit initially
✅ OAuth flow completes successfully
✅ User sees authenticated mode rate limit after login
✅ Fresh data fetched (verified via network calls)
✅ Rate limit decrements on each request

---

## 2. Session Expiration Mid-Use E2E Test

**File:** `e2e/session-expiration.spec.ts`

### User Story

> As an authenticated user, when my session expires (30 days TTL) while I'm actively using the app, I should be notified and gracefully transitioned to demo mode.

### Critical Path

```
Auth Mode → Active Use → Session Expires → Graceful Fallback → Demo Mode
```

### Test Scenario

```typescript
// e2e/session-expiration.spec.ts
import { test, expect } from "@playwright/test";

test.describe("Session Expiration Mid-Use", () => {
  test("should notify user and fallback to demo mode when session expires", async ({
    page,
    context,
  }) => {
    // 1. Authenticate user
    await page.goto("/");
    await page.click('button:has-text("Sign in with GitHub")');
    await page.waitForURL("/?auth=success");

    // 2. Verify authenticated mode active
    await expect(page.locator("text=Authenticated")).toBeVisible();

    // 3. Make successful request
    await page.fill('input[placeholder*="Search GitHub User"]', "torvalds");
    await page.click('button:has-text("Search")');
    await expect(page.locator("text=Linus Torvalds")).toBeVisible();

    // 4. Simulate session expiration (delete session from KV via API)
    // Note: Requires backend API endpoint or direct KV access
    await page.evaluate(async () => {
      await fetch("/api/auth/expire-session", { method: "POST" });
    });

    // 5. Make another request (session expired mid-use)
    await page.fill('input[placeholder*="Search GitHub User"]', "linus");
    await page.click('button:has-text("Search")');

    // 6. Verify graceful fallback to demo mode
    await expect(page.locator("text=Demo mode")).toBeVisible();

    // 7. Verify user notification
    await expect(page.locator("text=/Session expired/i")).toBeVisible();
    await expect(page.locator("text=/Please sign in again/i")).toBeVisible();

    // 8. Verify demo rate limit active
    await expect(page.locator("text=/5000.*5000/i")).toBeVisible();
  });

  test("should handle session expiration without breaking app", async ({
    page,
  }) => {
    // 1. Authenticate
    await page.goto("/?auth=success"); // Assume authenticated

    // 2. Expire session
    await page.evaluate(async () => {
      await fetch("/api/auth/expire-session", { method: "POST" });
    });

    // 3. Try to use app
    await page.fill('input[placeholder*="Search GitHub User"]', "torvalds");
    await page.click('button:has-text("Search")');

    // 4. App should NOT crash
    await expect(page.locator("text=Linus Torvalds")).toBeVisible();

    // 5. Should silently fall back to demo mode
    await expect(page.locator("text=Demo mode")).toBeVisible();
  });
});
```

### Prerequisites

- Backend API endpoint to expire sessions: `/api/auth/expire-session`
- Vercel KV accessible for session deletion
- Authenticated test user

### Expected Behavior

- Proxy detects expired session (KV returns null)
- Gracefully falls back to demo token
- User sees notification: "Session expired. Please sign in again."
- App continues working in demo mode (no crash)

### Success Criteria

✅ User authenticated and active
✅ Session expires during active use
✅ User notification displayed
✅ Graceful fallback to demo mode
✅ App continues working without crash

---

## 3. CSRF State Expiration Test

**File:** `e2e/csrf-state-expiration.spec.ts` (optional - can be unit tested)

### User Story

> As a user, if I start the OAuth flow but take too long (> 10 minutes), the CSRF state should expire and the callback should be rejected.

### Test Scenario

```typescript
test("should reject expired CSRF state", async ({ page }) => {
  // 1. Start OAuth flow
  await page.goto("/");
  await page.click('button:has-text("Sign in with GitHub")');

  // 2. Capture state from redirect URL
  const url = page.url();
  const state = new URL(url).searchParams.get("state");

  // 3. Simulate 11 minutes passing (mock system time or wait)
  await page.evaluate(() => {
    Date.now = () => Date.now() + 11 * 60 * 1000;
  });

  // 4. Complete OAuth callback with expired state
  await page.goto(`/api/auth/callback?code=abc123&state=${state}`);

  // 5. Should redirect with error
  await expect(page).toHaveURL("/?error=csrf_failed");
  await expect(page.locator("text=/CSRF validation failed/i")).toBeVisible();
});
```

**Note:** This can be better tested as a unit test in `api/auth/callback.test.ts` using `vi.advanceTimersByTime()`.

---

## Implementation Priority

### High Priority (P1)

1. **Session Expiration Mid-Use** - Critical security/UX issue

### Medium Priority (P2)

2. **Cache Transition** - Important for OAuth feature validation

### Low Priority (P3)

3. **CSRF State Expiration** - Can be covered by unit tests

---

## Setup Requirements

### 1. OAuth Test App

Create a separate GitHub OAuth app for testing:

- **App Name:** `GitHub Users Analytics (Test)`
- **Homepage URL:** `http://localhost:5173`
- **Callback URL:** `http://localhost:5173/api/auth/callback`

Store credentials in `.env.test`:

```bash
GITHUB_OAUTH_CLIENT_ID=Ov23li_test...
GITHUB_OAUTH_CLIENT_SECRET=test_secret...
GITHUB_TOKEN=ghp_test_token...
```

### 2. Vercel KV for Testing

Use Vercel KV test database or local Redis:

```bash
KV_URL=redis://localhost:6379
KV_REST_API_URL=http://localhost:8080
```

### 3. Mock OAuth Server (Alternative)

If real OAuth is too complex, use `msw` (Mock Service Worker) to mock GitHub OAuth:

```typescript
// e2e/mocks/oauth.ts
import { setupServer } from "msw/node";
import { rest } from "msw";

export const oauthMock = setupServer(
  rest.post("https://github.com/login/oauth/access_token", (req, res, ctx) => {
    return res(ctx.json({ access_token: "mock_token" }));
  }),
);
```

---

## Running E2E Tests

```bash
# Run all E2E tests
npm run test:e2e

# Run specific E2E test
npx playwright test e2e/cache-transition.spec.ts

# Debug E2E test with UI
npx playwright test e2e/session-expiration.spec.ts --debug

# Run in headed mode (see browser)
npx playwright test --headed
```

---

## Integration with CI/CD

Add E2E tests to GitHub Actions workflow:

```yaml
# .github/workflows/test.yml
name: Tests

on: [push, pull_request]

jobs:
  e2e:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run build

      # Install Playwright browsers
      - run: npx playwright install --with-deps

      # Run E2E tests
      - run: npm run test:e2e
        env:
          GITHUB_OAUTH_CLIENT_ID: ${{ secrets.TEST_OAUTH_CLIENT_ID }}
          GITHUB_OAUTH_CLIENT_SECRET: ${{ secrets.TEST_OAUTH_CLIENT_SECRET }}
          KV_URL: ${{ secrets.TEST_KV_URL }}

      # Upload test results
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

---

## Summary

**Week 3-4 P2 COMPLETED:**
✅ Parallel query failure tests (4/4 passing)
✅ Rate limit extraction tests (5/5 passing)
✅ E2E test requirements documented
✅ Session expiration E2E test implemented (6 scenarios)
✅ Cache transition E2E test implemented (5 scenarios)

**Implementation Status:**

1. ✅ Session expiration E2E test - `e2e/session-expiration.spec.ts` (373 lines)
2. ✅ Cache transition E2E test - `e2e/cache-transition.spec.ts` (366 lines)
3. ✅ Request tracking and network verification via Playwright route mocking
4. ⏳ CI/CD integration - deferred to next phase

**Test Coverage:**

- Session expiration: 6 scenarios (graceful degradation, re-auth, persistence)
- Cache transition: 5 scenarios (cache invalidation, rate limit updates, fresh data)
- Total: 11 new E2E scenarios + 11 existing OAuth E2E scenarios = 22 E2E tests

**Actual Effort:**

- Session expiration test: ~2 hours
- Cache transition test: ~2 hours
- Documentation updates: ~1 hour
- **Total: ~5 hours** (more efficient than estimated 8-10 hours)

**Next Steps (Future P3):**

- Add E2E tests to CI/CD pipeline (GitHub Actions)
- Setup OAuth test app credentials for CI environment
- Run E2E tests on every PR (chromium, firefox, webkit)
