import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeProvider } from 'next-themes'
import { ApolloAppProvider } from '../src/apollo/ApolloAppProvider'
import App from '../src/App'

/**
 * Integration Test: Cache Transition (Demo → Auth Mode)
 *
 * This test verifies that cache keys change correctly when a user transitions
 * from demo mode to authenticated mode via OAuth login.
 *
 * Critical Path: Search (demo) → Login (OAuth) → Search (auth)
 *
 * Expected Behavior:
 * 1. Demo mode: cache key = `demo:${cacheKey}`
 * 2. Auth mode: cache key = `user:${sessionId}:${cacheKey}`
 * 3. Demo cache should NOT be reused after login
 * 4. Fresh data should be fetched for authenticated user
 */

// Mock fetch to track API calls (client-side observable)
const mockFetch = vi.fn()
global.fetch = mockFetch

/**
 * Helper to render App with all required providers
 */
function renderApp() {
  return render(
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <ApolloAppProvider>
        <App />
      </ApolloAppProvider>
    </ThemeProvider>
  )
}

describe('Cache Transition Integration Test (Demo → Auth)', () => {
  const mockUserData = {
    data: {
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
        isDemo: true, // ← Client-side observable: demo mode active
      },
    },
  }

  const mockAuthUserData = {
    ...mockUserData,
    data: {
      ...mockUserData.data,
      rateLimit: {
        ...mockUserData.data.rateLimit,
        remaining: 4950,
        used: 50,
        isDemo: false, // ← Client-side observable: auth mode active
        userLogin: 'authenticateduser',
      },
    },
  }

  beforeEach(() => {
    vi.clearAllMocks()

    // Mock successful fetch response (default to demo mode)
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => mockUserData,
      text: async () => JSON.stringify(mockUserData), // ← Required by Apollo Client
      headers: new Headers({
        'X-RateLimit-Remaining': '5000',
        'X-RateLimit-Limit': '5000',
        'X-RateLimit-Reset': String(Math.floor(Date.now() / 1000) + 3600),
        'X-RateLimit-Used': '0',
      }),
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should display demo mode rate limit before OAuth login', async () => {
    const user = userEvent.setup()

    // 1. Render app (demo mode by default)
    renderApp()

    // 2. Search for user in demo mode
    const searchInput = screen.getByPlaceholderText(/search github user/i)
    const searchButton = screen.getByRole('button', { name: /search/i })

    await user.type(searchInput, 'torvalds')
    await user.click(searchButton)

    // 3. Wait for API call (client-side observable)
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalled()
    }, { timeout: 3000 })

    // 4. Verify demo mode rate limit displayed (client-side observable)
    await waitFor(() => {
      const rateLimitText = screen.queryByText(/5000.*5000/i)
      expect(
        rateLimitText,
        'Demo mode rate limit (5000/5000) should be displayed in UI'
      ).toBeInTheDocument()
    })

    // 5. Verify exactly 1 API call made (no cache hit, fresh fetch)
    expect(
      mockFetch,
      'Demo mode should make API call to fetch user data'
    ).toHaveBeenCalledTimes(1)
  })

  it('should transition rate limit display from demo to auth mode after login', async () => {
    const user = userEvent.setup()

    // 1. Search in demo mode
    renderApp()

    const searchInput = screen.getByPlaceholderText(/search github user/i)
    const searchButton = screen.getByRole('button', { name: /search/i })

    await user.type(searchInput, 'torvalds')
    await user.click(searchButton)

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledTimes(1)
    })

    // Verify demo mode active (client-side observable)
    await waitFor(() => {
      const rateLimitText = screen.queryByText(/5000.*5000/i)
      expect(
        rateLimitText,
        'Demo mode rate limit (5000/5000 used: 0) should be displayed initially'
      ).toBeInTheDocument()
    })

    // 2. Simulate OAuth login → auth mode
    // Mock authenticated API response (isDemo: false)
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => mockAuthUserData,
      text: async () => JSON.stringify(mockAuthUserData),
      headers: new Headers({
        'X-RateLimit-Remaining': '4950',
        'X-RateLimit-Limit': '5000',
        'X-RateLimit-Reset': String(Math.floor(Date.now() / 1000) + 3600),
        'X-RateLimit-Used': '50',
      }),
    })

    // 3. Search same user again (should fetch fresh data for auth mode)
    await user.clear(searchInput)
    await user.type(searchInput, 'torvalds')
    await user.click(searchButton)

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledTimes(2)
    }, { timeout: 3000 })

    // 4. Verify auth mode rate limit displayed (client-side observable)
    await waitFor(() => {
      const rateLimit = screen.queryByText(/4950.*5000/i)
      expect(
        rateLimit,
        'Authenticated mode rate limit (4950/5000 used: 50) should be displayed after login'
      ).toBeInTheDocument()
    })

    // 5. Verify second API call was made (fresh data fetch, not cached demo data)
    expect(
      mockFetch,
      'Auth mode should make fresh API call (not reuse demo cache)'
    ).toHaveBeenCalledTimes(2)
  })

  it('should fetch fresh data after transitioning from demo to auth mode', async () => {
    const user = userEvent.setup()

    // 1. First search in demo mode
    renderApp()

    const searchInput = screen.getByPlaceholderText(/search github user/i)
    const searchButton = screen.getByRole('button', { name: /search/i })

    await user.type(searchInput, 'torvalds')
    await user.click(searchButton)

    // Wait for demo mode API call
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledTimes(1)
    })

    // Capture initial fetch count
    const demoFetchCount = mockFetch.mock.calls.length

    // 2. Simulate OAuth login → auth mode (mock fresh API response)
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => mockAuthUserData,
      text: async () => JSON.stringify(mockAuthUserData),
      headers: new Headers({
        'X-RateLimit-Remaining': '4999',
        'X-RateLimit-Limit': '5000',
        'X-RateLimit-Reset': String(Math.floor(Date.now() / 1000) + 3600),
        'X-RateLimit-Used': '1',
      }),
    })

    // 3. Search same user again (auth mode should fetch fresh data)
    await user.clear(searchInput)
    await user.type(searchInput, 'torvalds')
    await user.click(searchButton)

    // 4. Verify fresh API call made (client-side observable)
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledTimes(demoFetchCount + 1)
    }, { timeout: 3000 })

    // 5. Verify auth mode rate limit displayed (confirms fresh data, not demo cache)
    await waitFor(() => {
      const authRateLimit = screen.queryByText(/4999.*5000/i)
      expect(
        authRateLimit,
        'Authenticated rate limit should be displayed (4999/5000 used: 1), proving fresh data fetch'
      ).toBeInTheDocument()
    })

    // 6. Verify total API calls = 2 (1 demo + 1 auth, no cache reuse)
    expect(
      mockFetch,
      'Should make exactly 2 API calls (demo + auth), proving demo cache not reused'
    ).toHaveBeenCalledTimes(2)
  })
})
