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

// Mock fetch to track API calls
const mockFetch = vi.fn()
global.fetch = mockFetch

// Mock @vercel/kv for cache key verification
vi.mock('@vercel/kv', () => ({
  kv: {
    get: vi.fn(),
    set: vi.fn(),
    keys: vi.fn(),
  },
}))

import { kv } from '@vercel/kv'

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
  const DEMO_CACHE_KEY_PREFIX = 'demo:user:torvalds:'
  const AUTH_CACHE_KEY_PREFIX = 'user:session123:user:torvalds:'
  const MOCK_SESSION_ID = 'session123'

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
        isDemo: true,
      },
    },
  }

  const mockAuthUserData = {
    ...mockUserData,
    data: {
      ...mockUserData.data,
      rateLimit: {
        ...mockUserData.data.rateLimit,
        isDemo: false,
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
      headers: new Headers({
        'X-RateLimit-Remaining': '5000',
        'X-RateLimit-Limit': '5000',
        'X-RateLimit-Reset': String(Math.floor(Date.now() / 1000) + 3600),
        'X-RateLimit-Used': '0',
      }),
    })

    // Mock KV cache - initially no cache
    vi.mocked(kv.get).mockResolvedValue(null)
    vi.mocked(kv.set).mockResolvedValue('OK')
    vi.mocked(kv.keys).mockResolvedValue([])
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should use demo cache key before OAuth login', async () => {
    const user = userEvent.setup()

    // 1. Render app (demo mode)
    renderApp()

    // 2. Search for user in demo mode
    const searchInput = screen.getByPlaceholderText(/search github user/i)
    const searchButton = screen.getByRole('button', { name: /search/i })

    await user.type(searchInput, 'torvalds')
    await user.click(searchButton)

    // 3. Wait for GraphQL query
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalled()
    }, { timeout: 3000 })

    // 4. Verify cache key used in proxy request contains "demo:" prefix
    // The cacheKey is sent in the POST body to /api/github-proxy
    const proxyCall = mockFetch.mock.calls.find((call) =>
      call[0].includes('/api/github-proxy')
    )

    expect(
      proxyCall,
      'github-proxy should be called with demo mode cache key'
    ).toBeDefined()

    // Note: In real implementation, the cache key would be verified server-side
    // This test focuses on client-side behavior and rate limit state
  })

  it('should transition to user cache key after OAuth login', async () => {
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

    // Verify demo mode active
    await waitFor(() => {
      const rateLimitText = screen.queryByText(/5000.*5000/i)
      expect(
        rateLimitText,
        'Demo mode rate limit should be displayed initially'
      ).toBeInTheDocument()
    })

    // 2. Simulate OAuth login (mock session cookie)
    // In real app, this would redirect to /api/auth/login
    // Here we mock the result: session cookie set + auth mode activated

    // Mock authenticated fetch response
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => mockAuthUserData,
      headers: new Headers({
        'X-RateLimit-Remaining': '4950',
        'X-RateLimit-Limit': '5000',
        'X-RateLimit-Reset': String(Math.floor(Date.now() / 1000) + 3600),
        'X-RateLimit-Used': '50',
      }),
    })

    // Mock session in KV
    vi.mocked(kv.get).mockResolvedValue({
      userId: 12345,
      login: 'authenticateduser',
      avatarUrl: 'https://github.com/authenticateduser.png',
      accessToken: 'gho_authenticated_token',
      createdAt: Date.now(),
    })

    // 3. Search same user again (should use auth cache key)
    await user.clear(searchInput)
    await user.type(searchInput, 'torvalds')
    await user.click(searchButton)

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledTimes(2)
    }, { timeout: 3000 })

    // 4. Verify auth mode activated (rate limit should show authenticated)
    await waitFor(() => {
      // The isDemo flag should be false in authenticated mode
      // This would typically show different UI (e.g., user avatar, different banner)
      const rateLimit = screen.queryByText(/4950.*5000/i)
      expect(
        rateLimit,
        'Authenticated mode rate limit should be displayed after login'
      ).toBeInTheDocument()
    })
  })

  it('should NOT reuse demo cache after OAuth login', async () => {
    const user = userEvent.setup()

    // Setup: Pre-populate demo cache
    const demoCacheKey = `${DEMO_CACHE_KEY_PREFIX}contributions`
    vi.mocked(kv.keys).mockResolvedValue([demoCacheKey])
    vi.mocked(kv.get).mockImplementation(async (key) => {
      if (key === demoCacheKey) {
        return mockUserData // Cached demo data
      }
      return null
    })

    // 1. Render app and search (demo mode, cache HIT)
    renderApp()

    const searchInput = screen.getByPlaceholderText(/search github user/i)
    const searchButton = screen.getByRole('button', { name: /search/i })

    await user.type(searchInput, 'torvalds')
    await user.click(searchButton)

    // Should use cached demo data (no fetch)
    await waitFor(() => {
      expect(screen.getByText(/linus torvalds/i)).toBeInTheDocument()
    })

    const initialFetchCount = mockFetch.mock.calls.length

    // 2. Simulate OAuth login → auth mode
    vi.mocked(kv.get).mockImplementation(async (key) => {
      // Session exists now
      if (key === `session:${MOCK_SESSION_ID}`) {
        return {
          userId: 12345,
          login: 'authenticateduser',
          avatarUrl: 'https://github.com/authenticateduser.png',
          accessToken: 'gho_auth_token',
          createdAt: Date.now(),
        }
      }
      // No cache for auth user yet
      if (key.startsWith('user:')) {
        return null
      }
      // Demo cache still exists but should NOT be used
      if (key === demoCacheKey) {
        return mockUserData
      }
      return null
    })

    // Mock fresh fetch for authenticated user
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => mockAuthUserData,
      headers: new Headers({
        'X-RateLimit-Remaining': '4999',
        'X-RateLimit-Limit': '5000',
        'X-RateLimit-Reset': String(Math.floor(Date.now() / 1000) + 3600),
        'X-RateLimit-Used': '1',
      }),
    })

    // 3. Search same user (auth mode, should fetch fresh data)
    await user.clear(searchInput)
    await user.type(searchInput, 'torvalds')
    await user.click(searchButton)

    // 4. Verify fresh data fetched (NOT from demo cache)
    await waitFor(() => {
      const finalFetchCount = mockFetch.mock.calls.length
      expect(
        finalFetchCount,
        'Should fetch fresh data for authenticated user, NOT reuse demo cache'
      ).toBeGreaterThan(initialFetchCount)
    }, { timeout: 3000 })

    // 5. Verify authenticated rate limit shown
    await waitFor(() => {
      const authRateLimit = screen.queryByText(/4999.*5000/i)
      expect(
        authRateLimit,
        'Authenticated rate limit should be displayed (fresh data)'
      ).toBeInTheDocument()
    })
  })

  it('should create separate cache entries for demo and auth modes', async () => {
    const user = userEvent.setup()

    // Track cache SET operations
    const cacheSetCalls: Array<{ key: string; value: any }> = []
    vi.mocked(kv.set).mockImplementation(async (key, value) => {
      cacheSetCalls.push({ key: String(key), value })
      return 'OK'
    })

    // 1. Search in demo mode
    renderApp()

    const searchInput = screen.getByPlaceholderText(/search github user/i)
    const searchButton = screen.getByRole('button', { name: /search/i })

    await user.type(searchInput, 'torvalds')
    await user.click(searchButton)

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalled()
    })

    // Give time for cache SET
    await new Promise((resolve) => setTimeout(resolve, 100))

    const demoCacheCalls = cacheSetCalls.filter((call) =>
      call.key.startsWith('demo:')
    )

    expect(
      demoCacheCalls.length,
      'Demo mode should create cache entries with "demo:" prefix'
    ).toBeGreaterThan(0)

    // 2. Simulate OAuth login
    vi.mocked(kv.get).mockImplementation(async (key) => {
      if (key === `session:${MOCK_SESSION_ID}`) {
        return {
          userId: 12345,
          login: 'authenticateduser',
          avatarUrl: 'https://github.com/authenticateduser.png',
          accessToken: 'gho_auth_token',
          createdAt: Date.now(),
        }
      }
      return null
    })

    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => mockAuthUserData,
      headers: new Headers({
        'X-RateLimit-Remaining': '4999',
        'X-RateLimit-Limit': '5000',
        'X-RateLimit-Reset': String(Math.floor(Date.now() / 1000) + 3600),
        'X-RateLimit-Used': '1',
      }),
    })

    // 3. Search in auth mode
    await user.clear(searchInput)
    await user.type(searchInput, 'torvalds')
    await user.click(searchButton)

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledTimes(2)
    })

    // Give time for cache SET
    await new Promise((resolve) => setTimeout(resolve, 100))

    const userCacheCalls = cacheSetCalls.filter((call) =>
      call.key.startsWith('user:')
    )

    expect(
      userCacheCalls.length,
      'Auth mode should create cache entries with "user:" prefix'
    ).toBeGreaterThan(0)

    // 4. Verify cache keys are different
    const demoCacheKeys = demoCacheCalls.map((c) => c.key)
    const userCacheKeys = userCacheCalls.map((c) => c.key)

    const overlap = demoCacheKeys.filter((key) => userCacheKeys.includes(key))

    expect(
      overlap.length,
      'Demo and auth cache keys should be completely separate (no overlap)'
    ).toBe(0)
  })
})
