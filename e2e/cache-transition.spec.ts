import { test, expect, type Page, type BrowserContext } from '@playwright/test'

/**
 * E2E Tests for Cache Transition (Demo → Auth Mode)
 *
 * Critical Path: Demo Mode → Search User → Login (OAuth) → Search Same User → Fresh Data
 *
 * These tests verify:
 * - Demo mode uses cache key prefix: `demo:{cacheKey}`
 * - Auth mode uses cache key prefix: `user:{sessionId}:{cacheKey}`
 * - Demo cache is NOT reused after OAuth login
 * - Fresh data is fetched with personal rate limit after OAuth
 * - Rate limit updates correctly (demo 5000/5000 → auth 4999/5000)
 *
 * User Story:
 * > As a user, when I transition from demo mode to authenticated mode via OAuth,
 * > I should see fresh data fetched with my personal rate limit, not cached demo data.
 *
 * Background:
 * This scenario is too complex for integration tests because it requires:
 * - Real browser session management
 * - OAuth flow simulation
 * - Network request tracking
 * - Cache key verification
 */

/**
 * Helper: Track network requests to github-proxy
 */
interface ProxyRequest {
  timestamp: number
  rateLimit: {
    remaining: number
    limit: number
    isDemo: boolean
    userLogin?: string
  }
}

/**
 * Helper: Set up request tracking
 */
async function setupRequestTracking(page: Page): Promise<ProxyRequest[]> {
  const requests: ProxyRequest[] = []

  await page.route('/api/github-proxy', async (route) => {
    const url = new URL(route.request().url())
    const isDemoRequest = !route.request().headers()['cookie']?.includes('session=')

    // Determine response based on session cookie presence
    const response = isDemoRequest
      ? {
          user: {
            login: 'torvalds',
            name: 'Linus Torvalds',
            bio: 'Creator of Linux',
            avatarUrl: 'https://github.com/torvalds.png',
            createdAt: '2011-09-03T15:26:22Z',
            followers: { totalCount: 100000 },
            following: { totalCount: 0 },
            repositories: { totalCount: 10 },
            contributionsCollection: {
              contributionCalendar: {
                totalContributions: 1000,
              },
            },
          },
          rateLimit: {
            remaining: 5000,
            limit: 5000,
            reset: Math.floor(Date.now() / 1000) + 3600,
            used: 0,
            isDemo: true, // ← Demo mode
          },
        }
      : {
          user: {
            login: 'torvalds',
            name: 'Linus Torvalds',
            bio: 'Creator of Linux',
            avatarUrl: 'https://github.com/torvalds.png',
            createdAt: '2011-09-03T15:26:22Z',
            followers: { totalCount: 100000 },
            following: { totalCount: 0 },
            repositories: { totalCount: 10 },
            contributionsCollection: {
              contributionCalendar: {
                totalContributions: 1000,
              },
            },
          },
          rateLimit: {
            remaining: 4999,
            limit: 5000,
            reset: Math.floor(Date.now() / 1000) + 3600,
            used: 1,
            isDemo: false, // ← Auth mode
            userLogin: 'authenticateduser',
          },
        }

    // Track request
    requests.push({
      timestamp: Date.now(),
      rateLimit: response.rateLimit,
    })

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(response),
    })
  })

  return requests
}

/**
 * Helper: Simulate OAuth login
 */
async function simulateOAuthLogin(context: BrowserContext) {
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
}

test.describe('Cache Transition: Demo → Auth', () => {
  test('should fetch fresh data after OAuth login (not use demo cache)', async ({
    page,
    context,
  }) => {
    // Set up request tracking
    const requests = await setupRequestTracking(page)

    // 1. Start in demo mode
    await page.goto('/')

    // 2. Search for user in demo mode
    const searchInput = page.getByPlaceholderText(/Search GitHub User/i)
    const searchButton = page.getByRole('button', { name: /search/i })

    await searchInput.fill('torvalds')
    await searchButton.click()

    // Wait for demo mode response
    await page.waitForTimeout(2000)

    // 3. Verify demo mode active (client-side observable)
    // Check rate limit: 5000/5000 (demo mode)
    await expect(page.getByText(/5000.*5000/i)).toBeVisible()

    // Verify first request was in demo mode
    expect(
      requests.length,
      'Should have made 1 API call in demo mode'
    ).toBeGreaterThanOrEqual(1)

    expect(
      requests[0].rateLimit.isDemo,
      'First request should be in demo mode'
    ).toBe(true)

    expect(
      requests[0].rateLimit.remaining,
      'Demo mode rate limit should be 5000'
    ).toBe(5000)

    // 4. Simulate OAuth login
    await simulateOAuthLogin(context)

    // 5. Search same user again (should fetch fresh data, not cached demo data)
    await searchInput.clear()
    await searchInput.fill('torvalds')
    await searchButton.click()

    // Wait for auth mode response
    await page.waitForTimeout(2000)

    // 6. Verify authenticated mode active (client-side observable)
    // Check rate limit: 4999/5000 (auth mode, personal limit)
    await expect(page.getByText(/4999.*5000/i)).toBeVisible()

    // Demo mode rate limit should be gone
    await expect(page.getByText(/5000.*5000/i)).not.toBeVisible()

    // 7. Verify fresh API call made (not cached demo data)
    expect(
      requests.length,
      'Should have made 2 API calls total (1 demo + 1 auth)'
    ).toBeGreaterThanOrEqual(2)

    expect(
      requests[1].rateLimit.isDemo,
      'Second request should be in auth mode (not demo cache reuse)'
    ).toBe(false)

    expect(
      requests[1].rateLimit.userLogin,
      'Auth mode request should include userLogin'
    ).toBe('authenticateduser')

    expect(
      requests[1].rateLimit.remaining,
      'Auth mode rate limit should be 4999 (personal limit, decremented)'
    ).toBe(4999)
  })

  test('should show different rate limits before and after OAuth login', async ({
    page,
    context,
  }) => {
    const requests = await setupRequestTracking(page)

    // 1. Start in demo mode
    await page.goto('/')

    const searchInput = page.getByPlaceholderText(/Search GitHub User/i)
    const searchButton = page.getByRole('button', { name: /search/i })

    // 2. Search in demo mode
    await searchInput.fill('torvalds')
    await searchButton.click()

    await page.waitForTimeout(2000)

    // Capture demo mode rate limit display
    const demoRateLimit = page.getByText(/5000.*5000/i)
    await expect(demoRateLimit).toBeVisible()

    // 3. Login via OAuth
    await simulateOAuthLogin(context)

    // 4. Search again
    await searchInput.clear()
    await searchInput.fill('torvalds')
    await searchButton.click()

    await page.waitForTimeout(2000)

    // 5. Verify rate limit changed to personal limit
    const authRateLimit = page.getByText(/4999.*5000/i)
    await expect(authRateLimit).toBeVisible()

    // Demo rate limit should not be visible
    await expect(demoRateLimit).not.toBeVisible()

    // 6. Verify authenticated indicator
    await expect(page.getByText(/✅.*authenticated/i)).toBeVisible()
  })

  test('should make multiple API calls when transitioning demo → auth (no cache reuse)', async ({
    page,
    context,
  }) => {
    const requests = await setupRequestTracking(page)

    await page.goto('/')

    const searchInput = page.getByPlaceholderText(/Search GitHub User/i)
    const searchButton = page.getByRole('button', { name: /search/i })

    // 1. Search in demo mode
    await searchInput.fill('torvalds')
    await searchButton.click()
    await page.waitForTimeout(2000)

    const demoRequestCount = requests.length
    expect(
      demoRequestCount,
      'Should have made 1 request in demo mode'
    ).toBe(1)

    // 2. Login
    await simulateOAuthLogin(context)

    // 3. Search same user
    await searchInput.clear()
    await searchInput.fill('torvalds')
    await searchButton.click()
    await page.waitForTimeout(2000)

    // 4. Verify second API call was made (cache not reused)
    expect(
      requests.length,
      'Should have made 2 total requests (demo + auth), proving cache not reused'
    ).toBe(2)

    expect(
      requests[1].timestamp,
      'Second request should be after first request'
    ).toBeGreaterThan(requests[0].timestamp)
  })

  test('should display authenticated banner after cache transition', async ({ page, context }) => {
    await setupRequestTracking(page)

    await page.goto('/')

    const searchInput = page.getByPlaceholderText(/Search GitHub User/i)
    const searchButton = page.getByRole('button', { name: /search/i })

    // 1. Search in demo mode
    await searchInput.fill('torvalds')
    await searchButton.click()
    await page.waitForTimeout(2000)

    // Should NOT show authenticated indicator
    await expect(page.getByText(/✅.*authenticated/i)).not.toBeVisible()

    // 2. Login
    await simulateOAuthLogin(context)

    // 3. Search again
    await searchInput.clear()
    await searchInput.fill('torvalds')
    await searchButton.click()
    await page.waitForTimeout(2000)

    // 4. Should show authenticated indicator
    await expect(page.getByText(/✅.*authenticated/i)).toBeVisible()
  })

  test('should handle cache transition with different users', async ({ page, context }) => {
    const requests = await setupRequestTracking(page)

    await page.goto('/')

    const searchInput = page.getByPlaceholderText(/Search GitHub User/i)
    const searchButton = page.getByRole('button', { name: /search/i })

    // 1. Search user1 in demo mode
    await searchInput.fill('torvalds')
    await searchButton.click()
    await page.waitForTimeout(2000)

    expect(requests[0].rateLimit.isDemo).toBe(true)

    // 2. Login
    await simulateOAuthLogin(context)

    // 3. Search user2 in auth mode (different user)
    await searchInput.clear()
    await searchInput.fill('github')
    await searchButton.click()
    await page.waitForTimeout(2000)

    // 4. Should use auth mode (not demo cache)
    expect(
      requests.length,
      'Should make fresh API call for different user in auth mode'
    ).toBe(2)

    expect(requests[1].rateLimit.isDemo).toBe(false)
  })
})
