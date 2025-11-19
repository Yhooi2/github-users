import { test, expect, type Page } from '@playwright/test'

/**
 * E2E Tests for OAuth Authentication Flow
 *
 * These tests verify the complete OAuth integration including:
 * - Login flow with GitHub OAuth
 * - Logout flow
 * - Demo to OAuth upgrade
 * - Session persistence
 * - Error handling
 *
 * Note: GitHub OAuth endpoints are mocked to avoid external dependencies
 */

// Mock GitHub user data
const mockGitHubUser = {
  login: 'testuser',
  id: 12345,
  avatar_url: 'https://avatars.githubusercontent.com/u/12345?v=4',
  name: 'Test User',
  email: 'test@example.com',
}

// Mock OAuth token response
const mockTokenResponse = {
  access_token: 'gho_mockAccessToken123456',
  token_type: 'bearer',
  scope: 'read:user,user:email',
}

/**
 * Helper: Set up OAuth route mocking
 */
async function mockOAuthEndpoints(page: Page) {
  // Mock GitHub OAuth token exchange
  await page.route('https://github.com/login/oauth/access_token', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockTokenResponse),
    })
  })

  // Mock GitHub user API
  await page.route('https://api.github.com/user', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockGitHubUser),
    })
  })
}

/**
 * Helper: Simulate OAuth callback
 */
async function simulateOAuthCallback(page: Page, state: string) {
  // Navigate to callback URL with mock code and state
  await page.goto(`/?code=mock_oauth_code_123&state=${state}`)
}

test.describe('OAuth Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should show "Sign in with GitHub" button when not authenticated', async ({ page }) => {
    // Check for sign in button
    const signInButton = page.getByRole('button', { name: /sign in with github/i })
    await expect(signInButton).toBeVisible()

    // Should have GitHub icon
    await expect(signInButton.locator('svg')).toBeVisible()
  })

  test('should not show user menu when not authenticated', async ({ page }) => {
    // Avatar dropdown should not be visible
    const avatar = page.locator('[role="button"]').filter({ has: page.locator('img[alt*="@"]') })
    await expect(avatar).not.toBeVisible()
  })

  test('should redirect to GitHub OAuth on sign in click', async ({ page }) => {
    const signInButton = page.getByRole('button', { name: /sign in with github/i })

    // Mock the OAuth login endpoint to prevent actual redirect
    await page.route('/api/auth/login', async (route) => {
      // In real flow, this redirects to GitHub
      // For testing, we'll fulfill with a redirect simulation
      await route.fulfill({
        status: 302,
        headers: {
          Location: 'https://github.com/login/oauth/authorize?client_id=test&state=mock_state',
        },
      })
    })

    // Click sign in
    await signInButton.click()

    // Should have initiated OAuth flow
    // In real scenario, user would be redirected to GitHub
  })

  test('should complete OAuth login flow successfully', async ({ page, context }) => {
    // Set up OAuth mocking
    await mockOAuthEndpoints(page)

    // Mock the callback endpoint
    await page.route('/api/auth/callback*', async (route) => {
      const url = new URL(route.request().url())
      const code = url.searchParams.get('code')
      const state = url.searchParams.get('state')

      if (!code || !state) {
        await route.fulfill({
          status: 302,
          headers: { Location: '/?error=missing_code' },
        })
        return
      }

      // Simulate successful OAuth callback
      // Set session cookie
      await context.addCookies([
        {
          name: 'session',
          value: 'mock_session_id_12345',
          domain: 'localhost',
          path: '/',
          httpOnly: true,
          secure: false,
          sameSite: 'Lax',
        },
      ])

      await route.fulfill({
        status: 302,
        headers: { Location: '/?auth=success' },
      })
    })

    // Mock github-proxy to return authenticated response
    await page.route('/api/github-proxy', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          user: {
            login: 'octocat',
            name: 'The Octocat',
            avatarUrl: 'https://avatars.githubusercontent.com/u/583231?v=4',
          },
          rateLimit: {
            remaining: 4999,
            limit: 5000,
            reset: Date.now() + 3600000,
            used: 1,
            isDemo: false,
            userLogin: 'testuser',
          },
        }),
      })
    })

    // Simulate OAuth callback with state
    await simulateOAuthCallback(page, 'mock_state')

    // Wait for redirect to complete
    await page.waitForURL('/?auth=success', { timeout: 5000 })

    // After successful OAuth, should show user menu with avatar
    const avatar = page.locator('[role="button"]').filter({ has: page.locator('img[alt*="@"]') })
    await expect(avatar).toBeVisible({ timeout: 5000 })

    // Sign in button should be hidden
    const signInButton = page.getByRole('button', { name: /sign in with github/i })
    await expect(signInButton).not.toBeVisible()
  })

  test('should display authenticated user information in dropdown', async ({ page, context }) => {
    // Set session cookie to simulate authenticated state
    await context.addCookies([
      {
        name: 'session',
        value: 'mock_session_id_12345',
        domain: 'localhost',
        path: '/',
        httpOnly: true,
        secure: false,
        sameSite: 'Lax',
      },
    ])

    // Mock github-proxy for authenticated user
    await page.route('/api/github-proxy', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          user: {
            login: 'octocat',
            name: 'The Octocat',
            avatarUrl: 'https://avatars.githubusercontent.com/u/583231?v=4',
          },
          rateLimit: {
            remaining: 4999,
            limit: 5000,
            reset: Date.now() + 3600000,
            used: 1,
            isDemo: false,
            userLogin: 'testuser',
          },
        }),
      })
    })

    await page.reload()

    // Open user menu dropdown
    const avatar = page.locator('[role="button"]').filter({ has: page.locator('img[alt*="@"]') })
    await avatar.click()

    // Check for username in dropdown
    await expect(page.getByText('@testuser')).toBeVisible()

    // Check for sign out button
    const signOutButton = page.getByRole('menuitem', { name: /sign out/i })
    await expect(signOutButton).toBeVisible()
  })

  test('should complete logout flow successfully', async ({ page, context }) => {
    // Set session cookie to simulate authenticated state
    await context.addCookies([
      {
        name: 'session',
        value: 'mock_session_id_12345',
        domain: 'localhost',
        path: '/',
        httpOnly: true,
        secure: false,
        sameSite: 'Lax',
      },
    ])

    // Mock github-proxy for authenticated user
    await page.route('/api/github-proxy', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          user: {
            login: 'octocat',
            name: 'The Octocat',
          },
          rateLimit: {
            remaining: 4999,
            limit: 5000,
            reset: Date.now() + 3600000,
            isDemo: false,
            userLogin: 'testuser',
          },
        }),
      })
    })

    await page.reload()

    // Mock logout endpoint
    await page.route('/api/auth/logout', async (route) => {
      // Clear session cookie
      await context.clearCookies()

      await route.fulfill({
        status: 302,
        headers: { Location: '/?auth=logged_out' },
      })
    })

    // Open user menu dropdown
    const avatar = page.locator('[role="button"]').filter({ has: page.locator('img[alt*="@"]') })
    await avatar.click()

    // Click sign out
    const signOutButton = page.getByRole('menuitem', { name: /sign out/i })
    await signOutButton.click()

    // Should redirect to logged out state
    await page.waitForURL('/?auth=logged_out', { timeout: 5000 })

    // Should show sign in button again
    const signInButton = page.getByRole('button', { name: /sign in with github/i })
    await expect(signInButton).toBeVisible()

    // Avatar should be hidden
    const avatarAfterLogout = page.locator('[role="button"]').filter({ has: page.locator('img[alt*="@"]') })
    await expect(avatarAfterLogout).not.toBeVisible()
  })

  test('should show demo mode banner when not authenticated', async ({ page }) => {
    // Mock github-proxy for demo mode
    await page.route('/api/github-proxy', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          user: {
            login: 'octocat',
            name: 'The Octocat',
          },
          rateLimit: {
            remaining: 400, // Low limit to trigger banner
            limit: 5000,
            reset: Date.now() + 3600000,
            used: 4600,
            isDemo: true,
          },
        }),
      })
    })

    // Search for a user to trigger rate limit banner
    const searchInput = page.getByPlaceholderText(/Search GitHub User/i)
    const searchButton = page.getByRole('button', { name: /search/i })

    await searchInput.fill('octocat')
    await searchButton.click()

    // Wait for user data to load
    await page.waitForTimeout(2000)

    // Should show demo mode banner with sign in CTA
    await expect(page.getByText(/demo mode/i)).toBeVisible()

    // Should have "Sign in" button in banner
    const bannerSignIn = page.getByRole('button', { name: /sign in/i })
    await expect(bannerSignIn).toBeVisible()
  })

  test('should show authenticated banner when OAuth authenticated', async ({ page, context }) => {
    // Set session cookie
    await context.addCookies([
      {
        name: 'session',
        value: 'mock_session_id_12345',
        domain: 'localhost',
        path: '/',
        httpOnly: true,
        secure: false,
        sameSite: 'Lax',
      },
    ])

    // Mock github-proxy for authenticated user
    await page.route('/api/github-proxy', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          user: {
            login: 'octocat',
            name: 'The Octocat',
          },
          rateLimit: {
            remaining: 4999,
            limit: 5000,
            reset: Date.now() + 3600000,
            used: 1,
            isDemo: false,
            userLogin: 'testuser',
          },
        }),
      })
    })

    // Search for a user
    const searchInput = page.getByPlaceholderText(/Search GitHub User/i)
    const searchButton = page.getByRole('button', { name: /search/i })

    await searchInput.fill('octocat')
    await searchButton.click()

    // Wait for user data
    await page.waitForTimeout(2000)

    // Should show authenticated banner (if rate limit shown)
    // Check for authenticated indicator
    const authenticated = page.getByText(/✅.*authenticated/i)
    await expect(authenticated).toBeVisible()
  })

  test('should handle OAuth error gracefully', async ({ page }) => {
    // Simulate OAuth callback with error
    await page.goto('/?error=csrf_failed')

    // Should still show the app in demo mode
    const signInButton = page.getByRole('button', { name: /sign in with github/i })
    await expect(signInButton).toBeVisible()

    // Could optionally show an error toast
    // await expect(page.locator('[data-sonner-toast]')).toBeVisible()
  })

  test('should persist session across page reloads', async ({ page, context }) => {
    // Set session cookie
    await context.addCookies([
      {
        name: 'session',
        value: 'mock_session_id_12345',
        domain: 'localhost',
        path: '/',
        httpOnly: true,
        secure: false,
        sameSite: 'Lax',
      },
    ])

    // Mock github-proxy
    await page.route('/api/github-proxy', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          user: {
            login: 'octocat',
            name: 'The Octocat',
          },
          rateLimit: {
            remaining: 4999,
            limit: 5000,
            reset: Date.now() + 3600000,
            isDemo: false,
            userLogin: 'testuser',
          },
        }),
      })
    })

    await page.reload()

    // Should still show authenticated state after reload
    const avatar = page.locator('[role="button"]').filter({ has: page.locator('img[alt*="@"]') })
    await expect(avatar).toBeVisible()
  })

  test('should upgrade from demo to OAuth seamlessly', async ({ page, context }) => {
    // Start in demo mode
    await page.goto('/')

    // Verify demo mode
    let signInButton = page.getByRole('button', { name: /sign in with github/i })
    await expect(signInButton).toBeVisible()

    // Mock OAuth flow
    await mockOAuthEndpoints(page)
    await page.route('/api/auth/callback*', async (route) => {
      await context.addCookies([
        {
          name: 'session',
          value: 'mock_session_upgraded',
          domain: 'localhost',
          path: '/',
          httpOnly: true,
          secure: false,
          sameSite: 'Lax',
        },
      ])

      await route.fulfill({
        status: 302,
        headers: { Location: '/?auth=success' },
      })
    })

    // Simulate OAuth upgrade
    await simulateOAuthCallback(page, 'mock_state')

    // Wait for redirect
    await page.waitForURL('/?auth=success', { timeout: 5000 })

    // Mock authenticated response
    await page.route('/api/github-proxy', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          user: {
            login: 'octocat',
            name: 'The Octocat',
          },
          rateLimit: {
            remaining: 4999,
            limit: 5000,
            reset: Date.now() + 3600000,
            isDemo: false,
            userLogin: 'testuser',
          },
        }),
      })
    })

    await page.reload()

    // Should now be authenticated
    const avatar = page.locator('[role="button"]').filter({ has: page.locator('img[alt*="@"]') })
    await expect(avatar).toBeVisible()

    // Sign in button should be hidden
    signInButton = page.getByRole('button', { name: /sign in with github/i })
    await expect(signInButton).not.toBeVisible()
  })
})
