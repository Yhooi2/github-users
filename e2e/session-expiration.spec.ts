import { expect, test, type BrowserContext, type Page } from "@playwright/test";

/**
 * E2E Tests for Session Expiration Mid-Use
 *
 * Critical Path: Auth Mode → Active Use → Session Expires → Graceful Fallback → Demo Mode
 *
 * These tests verify:
 * - Graceful degradation when session expires during active use
 * - User notification about session expiration
 * - Automatic fallback to demo mode (no app crash)
 * - Continued functionality in demo mode after session expires
 *
 * User Story:
 * > As an authenticated user, when my session expires (30 days TTL) while I'm
 * > actively using the app, I should be notified and gracefully transitioned to demo mode.
 */

/**
 * Helper: Set up authenticated session
 */
async function setupAuthenticatedSession(context: BrowserContext) {
  await context.addCookies([
    {
      name: "session",
      value: "mock_session_authenticated",
      domain: "localhost",
      path: "/",
      httpOnly: true,
      secure: false,
      sameSite: "Lax",
    },
  ]);
}

/**
 * Helper: Mock authenticated GitHub proxy response
 */
async function mockAuthenticatedResponse(page: Page) {
  await page.route("/api/github-proxy", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        user: {
          login: "octocat",
          name: "The Octocat",
          bio: "GitHub mascot",
          avatarUrl: "https://avatars.githubusercontent.com/u/583231?v=4",
          createdAt: "2011-01-25T18:44:36Z",
          followers: { totalCount: 1000 },
          following: { totalCount: 10 },
          repositories: { totalCount: 20 },
          contributionsCollection: {
            contributionCalendar: {
              totalContributions: 500,
            },
          },
        },
        rateLimit: {
          remaining: 4999,
          limit: 5000,
          reset: Math.floor(Date.now() / 1000) + 3600,
          used: 1,
          isDemo: false,
          userLogin: "authenticateduser",
        },
      }),
    });
  });
}

/**
 * Helper: Mock demo mode GitHub proxy response (session expired)
 */
async function mockDemoModeResponse(page: Page) {
  await page.route("/api/github-proxy", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        user: {
          login: "octocat",
          name: "The Octocat",
          bio: "GitHub mascot",
          avatarUrl: "https://avatars.githubusercontent.com/u/583231?v=4",
          createdAt: "2011-01-25T18:44:36Z",
          followers: { totalCount: 1000 },
          following: { totalCount: 10 },
          repositories: { totalCount: 20 },
          contributionsCollection: {
            contributionCalendar: {
              totalContributions: 500,
            },
          },
        },
        rateLimit: {
          remaining: 5000,
          limit: 5000,
          reset: Math.floor(Date.now() / 1000) + 3600,
          used: 0,
          isDemo: true, // ← Session expired, fallback to demo mode
        },
      }),
    });
  });
}

test.describe("Session Expiration Mid-Use", () => {
  test("should gracefully fallback to demo mode when session expires", async ({
    page,
    context,
  }) => {
    // 1. Set up authenticated session
    await setupAuthenticatedSession(context);
    await mockAuthenticatedResponse(page);

    await page.goto("/");

    // 2. Verify authenticated mode active
    const searchInput = page.getByPlaceholderText(/Search GitHub User/i);
    const searchButton = page.getByRole("button", { name: /search/i });

    await searchInput.fill("octocat");
    await searchButton.click();

    // Wait for user data to load
    await page.waitForTimeout(2000);

    // Verify authenticated state (check for authenticated indicator)
    await expect(page.getByText(/✅.*authenticated/i)).toBeVisible();

    // 3. Simulate session expiration by clearing cookie and mocking demo response
    await context.clearCookies();
    await mockDemoModeResponse(page);

    // 4. Make another search request (session expired mid-use)
    await searchInput.clear();
    await searchInput.fill("torvalds");
    await searchButton.click();

    // Wait for response
    await page.waitForTimeout(2000);

    // 5. Verify graceful fallback to demo mode
    // Should show demo mode indicator (no authenticated checkmark)
    await expect(page.getByText(/✅.*authenticated/i)).not.toBeVisible();

    // Should show "Sign in with GitHub" button again
    const signInButton = page.getByRole("button", {
      name: /sign in with github/i,
    });
    await expect(signInButton).toBeVisible();

    // 6. Verify app continues working (no crash)
    // User data should still be displayed
    await expect(page.getByText(/Linus Torvalds|torvalds/i)).toBeVisible();
  });

  test("should handle session expiration without breaking app", async ({
    page,
    context,
  }) => {
    // 1. Set up authenticated session
    await setupAuthenticatedSession(context);
    await mockAuthenticatedResponse(page);

    await page.goto("/");

    // 2. Search for user in authenticated mode
    const searchInput = page.getByPlaceholderText(/Search GitHub User/i);
    const searchButton = page.getByRole("button", { name: /search/i });

    await searchInput.fill("octocat");
    await searchButton.click();

    await page.waitForTimeout(2000);

    // 3. Simulate session expiration
    await context.clearCookies();
    await mockDemoModeResponse(page);

    // 4. Try to use app (make another search)
    await searchInput.clear();
    await searchInput.fill("torvalds");
    await searchButton.click();

    await page.waitForTimeout(2000);

    // 5. App should NOT crash - should still show user data
    await expect(page.getByText(/Linus Torvalds|torvalds/i)).toBeVisible();

    // 6. Should silently fall back to demo mode
    // Check for sign in button (indicates demo mode)
    const signInButton = page.getByRole("button", {
      name: /sign in with github/i,
    });
    await expect(signInButton).toBeVisible();

    // No authenticated indicator
    await expect(page.getByText(/✅.*authenticated/i)).not.toBeVisible();
  });

  test("should show demo mode rate limit after session expires", async ({
    page,
    context,
  }) => {
    // 1. Start with authenticated session
    await setupAuthenticatedSession(context);
    await mockAuthenticatedResponse(page);

    await page.goto("/");

    // 2. Search in authenticated mode
    const searchInput = page.getByPlaceholderText(/Search GitHub User/i);
    const searchButton = page.getByRole("button", { name: /search/i });

    await searchInput.fill("octocat");
    await searchButton.click();

    await page.waitForTimeout(2000);

    // Verify authenticated rate limit (4999/5000)
    await expect(page.getByText(/4999.*5000/i)).toBeVisible();

    // 3. Simulate session expiration
    await context.clearCookies();
    await mockDemoModeResponse(page);

    // 4. Search again
    await searchInput.clear();
    await searchInput.fill("torvalds");
    await searchButton.click();

    await page.waitForTimeout(2000);

    // 5. Verify demo mode rate limit (5000/5000)
    await expect(page.getByText(/5000.*5000/i)).toBeVisible();

    // Authenticated rate limit should be gone
    await expect(page.getByText(/4999.*5000/i)).not.toBeVisible();
  });

  test("should allow re-authentication after session expires", async ({
    page,
    context,
  }) => {
    // 1. Set up expired session scenario
    await setupAuthenticatedSession(context);
    await mockAuthenticatedResponse(page);

    await page.goto("/");

    // 2. Search in authenticated mode
    const searchInput = page.getByPlaceholderText(/Search GitHub User/i);
    const searchButton = page.getByRole("button", { name: /search/i });

    await searchInput.fill("octocat");
    await searchButton.click();

    await page.waitForTimeout(2000);

    // 3. Simulate session expiration
    await context.clearCookies();
    await mockDemoModeResponse(page);

    // 4. Search again (fallback to demo mode)
    await searchInput.clear();
    await searchInput.fill("torvalds");
    await searchButton.click();

    await page.waitForTimeout(2000);

    // 5. Verify demo mode active
    const signInButton = page.getByRole("button", {
      name: /sign in with github/i,
    });
    await expect(signInButton).toBeVisible();

    // 6. User should be able to re-authenticate
    // Mock OAuth callback endpoint
    await page.route("/api/auth/callback*", async (route) => {
      await context.addCookies([
        {
          name: "session",
          value: "mock_session_reauthenticated",
          domain: "localhost",
          path: "/",
          httpOnly: true,
          secure: false,
          sameSite: "Lax",
        },
      ]);

      await route.fulfill({
        status: 302,
        headers: { Location: "/?auth=success" },
      });
    });

    // Simulate OAuth re-authentication
    await page.goto("/?code=mock_code&state=mock_state");
    await page.waitForURL("/?auth=success", { timeout: 5000 });

    // 7. Mock authenticated response again
    await mockAuthenticatedResponse(page);
    await page.reload();

    // 8. Verify re-authenticated
    const avatar = page
      .locator('[role="button"]')
      .filter({ has: page.locator('img[alt*="@"]') });
    await expect(avatar).toBeVisible();

    // Sign in button should be hidden
    await expect(signInButton).not.toBeVisible();
  });

  test("should persist authenticated state across page reloads (session valid)", async ({
    page,
    context,
  }) => {
    // 1. Set up authenticated session
    await setupAuthenticatedSession(context);
    await mockAuthenticatedResponse(page);

    await page.goto("/");

    // 2. Search in authenticated mode
    const searchInput = page.getByPlaceholderText(/Search GitHub User/i);
    const searchButton = page.getByRole("button", { name: /search/i });

    await searchInput.fill("octocat");
    await searchButton.click();

    await page.waitForTimeout(2000);

    // Verify authenticated state
    await expect(page.getByText(/✅.*authenticated/i)).toBeVisible();

    // 3. Reload page (session still valid)
    await page.reload();

    // 4. Should still be authenticated after reload
    const avatar = page
      .locator('[role="button"]')
      .filter({ has: page.locator('img[alt*="@"]') });
    await expect(avatar).toBeVisible();

    // Sign in button should not be visible
    const signInButton = page.getByRole("button", {
      name: /sign in with github/i,
    });
    await expect(signInButton).not.toBeVisible();
  });

  test("should handle multiple session expirations gracefully", async ({
    page,
    context,
  }) => {
    // 1. Set up first authenticated session
    await setupAuthenticatedSession(context);
    await mockAuthenticatedResponse(page);

    await page.goto("/");

    const searchInput = page.getByPlaceholderText(/Search GitHub User/i);
    const searchButton = page.getByRole("button", { name: /search/i });

    // 2. First search (authenticated)
    await searchInput.fill("octocat");
    await searchButton.click();
    await page.waitForTimeout(2000);

    // Verify authenticated
    await expect(page.getByText(/✅.*authenticated/i)).toBeVisible();

    // 3. First session expiration
    await context.clearCookies();
    await mockDemoModeResponse(page);

    await searchInput.clear();
    await searchInput.fill("torvalds");
    await searchButton.click();
    await page.waitForTimeout(2000);

    // Verify demo mode
    const signInButton = page.getByRole("button", {
      name: /sign in with github/i,
    });
    await expect(signInButton).toBeVisible();

    // 4. Re-authenticate
    await setupAuthenticatedSession(context);
    await mockAuthenticatedResponse(page);
    await page.reload();

    // 5. Second session expiration
    await context.clearCookies();
    await mockDemoModeResponse(page);

    await searchInput.clear();
    await searchInput.fill("github");
    await searchButton.click();
    await page.waitForTimeout(2000);

    // 6. Should still handle gracefully (no crash)
    await expect(page.getByText(/github/i)).toBeVisible();
    await expect(signInButton).toBeVisible();
  });
});
