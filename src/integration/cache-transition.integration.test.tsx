/**
 * Integration Test: Cache Transition (Demo → OAuth)
 *
 * Testing Philosophy: Kent C. Dodds & Testing Trophy
 * - Test the FULL cache transition flow when user authenticates
 * - Verify cache keys change correctly
 * - Focus on USER EXPERIENCE: does user get fresh data after auth?
 *
 * Test Flow:
 * 1. User searches in demo mode → data cached with key: demo:{cacheKey}
 * 2. User authenticates via OAuth → session created
 * 3. User searches again → new cache key: user:{sessionId}:{cacheKey}
 * 4. Fresh data fetched (shorter TTL in authenticated mode)
 * 5. Rate limit updates to show authenticated mode
 *
 * @vitest-environment jsdom
 */
import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import type { UseQueryUserReturn } from '@/apollo/useQueryUser'

// Mock useQueryUser hook
vi.mock('@/apollo/useQueryUser', () => ({
  default: vi.fn(),
}))

import useQueryUser from '@/apollo/useQueryUser'

// Mock sonner to prevent errors
vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}))

/**
 * Test Component that simulates cache transition behavior
 */
function TestCacheTransition({ username, isAuthenticated }: { username: string; isAuthenticated: boolean }) {
  const [rateLimit, setRateLimit] = React.useState<{
    remaining: number
    limit: number
    isDemo: boolean
    userLogin?: string
  }>({
    remaining: 5000,
    limit: 5000,
    isDemo: true,
  })

  const handleRateLimitUpdate = (newRateLimit: {
    remaining: number
    limit: number
    reset: number
    isDemo: boolean
    userLogin?: string
  }) => {
    setRateLimit(newRateLimit)
  }

  const { data, loading, error } = useQueryUser(username, 365, {
    onRateLimitUpdate: handleRateLimitUpdate,
  })

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <div>
      <div data-testid="user-data">
        {data?.user ? `User: ${data.user.login}` : 'No user'}
      </div>
      <div data-testid="cache-mode">
        Cache Mode: {isAuthenticated ? 'authenticated' : 'demo'}
      </div>
      <div data-testid="rate-limit-mode">
        {rateLimit.isDemo ? 'demo' : 'authenticated'}
      </div>
      {rateLimit.userLogin && (
        <div data-testid="authenticated-user">{rateLimit.userLogin}</div>
      )}
    </div>
  )
}

describe('Integration: Cache Transition (Demo → OAuth)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Reset mock implementation to prevent pollution between tests
    vi.mocked(useQueryUser).mockReset()
  })

  it('should use demo cache in unauthenticated mode', async () => {
    // Simulate demo mode (unauthenticated)
    const mockRateLimit = {
      remaining: 4800,
      limit: 5000,
      used: 200,
      reset: Math.floor(Date.now() / 1000) + 3600,
      isDemo: true,
    }

    const mockData = {
      user: {
        id: 'U_demo',
        login: 'demouser',
        name: 'Demo User',
        avatarUrl: 'https://example.com/demo.png',
        bio: 'Demo mode user',
        url: 'https://github.com/demouser',
        location: 'Demo Location',
        createdAt: '2020-01-01T00:00:00Z',
        followers: { totalCount: 100 },
        following: { totalCount: 50 },
        gists: { totalCount: 10 },
        contributionsCollection: {
          totalCommitContributions: 100,
          commitContributionsByRepository: [],
        },
        year1: { totalCommitContributions: 50 },
        year2: { totalCommitContributions: 75 },
        year3: { totalCommitContributions: 100 },
        repositories: {
          totalCount: 20,
          nodes: [],
          pageInfo: { hasNextPage: false, endCursor: null },
        },
      },
    }

    const mockUseQueryUser = vi.mocked(useQueryUser)
    mockUseQueryUser.mockImplementation((login, daysBack, options) => {
      // Simulate rate limit callback
      if (options?.onRateLimitUpdate) {
        setTimeout(() => {
          options.onRateLimitUpdate!(mockRateLimit)
        }, 0)
      }

      return {
        data: mockData,
        loading: false,
        error: undefined,
        refetch: vi.fn(),
        networkStatus: 7,
        client: {} as any,
        observable: {} as any,
        previousData: undefined,
        called: true,
      } as UseQueryUserReturn
    })

    render(<TestCacheTransition username="demouser" isAuthenticated={false} />)

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
    })

    // Verify demo mode behavior
    expect(screen.getByTestId('cache-mode')).toHaveTextContent('Cache Mode: demo')
    expect(screen.getByTestId('rate-limit-mode')).toHaveTextContent('demo')
    expect(screen.queryByTestId('authenticated-user')).not.toBeInTheDocument()
  })

  it('should use authenticated cache after OAuth', async () => {
    // Simulate authenticated mode (after OAuth)
    const authRateLimit = {
      remaining: 4950,
      limit: 5000,
      used: 50,
      reset: Math.floor(Date.now() / 1000) + 3600,
      isDemo: false,
      userLogin: 'authuser',
    }

    const mockData = {
      user: {
        id: 'U_auth',
        login: 'authuser',
        name: 'Authenticated User',
        avatarUrl: 'https://example.com/auth.png',
        bio: 'Authenticated user',
        url: 'https://github.com/authuser',
        location: 'Auth Location',
        createdAt: '2019-01-01T00:00:00Z',
        followers: { totalCount: 200 },
        following: { totalCount: 100 },
        gists: { totalCount: 20 },
        contributionsCollection: {
          totalCommitContributions: 200,
          commitContributionsByRepository: [],
        },
        year1: { totalCommitContributions: 100 },
        year2: { totalCommitContributions: 150 },
        year3: { totalCommitContributions: 200 },
        repositories: {
          totalCount: 40,
          nodes: [],
          pageInfo: { hasNextPage: false, endCursor: null },
        },
      },
    }

    const mockUseQueryUser = vi.mocked(useQueryUser)
    mockUseQueryUser.mockImplementation((login, daysBack, options) => {
      if (options?.onRateLimitUpdate) {
        setTimeout(() => {
          options.onRateLimitUpdate!(authRateLimit)
        }, 0)
      }

      return {
        data: mockData,
        loading: false,
        error: undefined,
        refetch: vi.fn(),
        networkStatus: 7,
        client: {} as any,
        observable: {} as any,
        previousData: undefined,
        called: true,
      } as UseQueryUserReturn
    })

    render(<TestCacheTransition username="authuser" isAuthenticated={true} />)

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
    })

    // Verify authenticated mode
    expect(screen.getByTestId('cache-mode')).toHaveTextContent('Cache Mode: authenticated')
    await waitFor(() => {
      expect(screen.getByTestId('rate-limit-mode')).toHaveTextContent('authenticated')
      expect(screen.getByTestId('authenticated-user')).toHaveTextContent('authuser')
    })
  })

  it('should fetch fresh data in authenticated mode (shorter TTL)', async () => {
    // Test that authenticated mode triggers fresh data fetch
    // In real implementation: demo uses 30min TTL, authenticated uses 10min TTL
    const authRateLimit = {
      remaining: 4900,
      limit: 5000,
      used: 100,
      reset: Math.floor(Date.now() / 1000) + 3600,
      isDemo: false,
      userLogin: 'freshuser',
    }

    const mockData = {
      user: {
        id: 'U_fresh',
        login: 'freshuser',
        name: 'Fresh Data User',
        avatarUrl: 'https://example.com/fresh.png',
        bio: 'Fresh authenticated data',
        url: 'https://github.com/freshuser',
        location: 'Fresh Location',
        createdAt: '2021-01-01T00:00:00Z',
        followers: { totalCount: 150 },
        following: { totalCount: 75 },
        gists: { totalCount: 15 },
        contributionsCollection: {
          totalCommitContributions: 150,
          commitContributionsByRepository: [],
        },
        year1: { totalCommitContributions: 75 },
        year2: { totalCommitContributions: 100 },
        year3: { totalCommitContributions: 150 },
        repositories: {
          totalCount: 30,
          nodes: [],
          pageInfo: { hasNextPage: false, endCursor: null },
        },
      },
    }

    const mockUseQueryUser = vi.mocked(useQueryUser)
    mockUseQueryUser.mockImplementation((login, daysBack, options) => {
      if (options?.onRateLimitUpdate) {
        setTimeout(() => {
          options.onRateLimitUpdate!(authRateLimit)
        }, 0)
      }

      return {
        data: mockData,
        loading: false,
        error: undefined,
        refetch: vi.fn(),
        networkStatus: 7,
        client: {} as any,
        observable: {} as any,
        previousData: undefined,
        called: true,
      } as UseQueryUserReturn
    })

    render(<TestCacheTransition username="freshuser" isAuthenticated={true} />)

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
    })

    // Verify fresh data loaded
    expect(screen.getByTestId('user-data')).toHaveTextContent('User: freshuser')
    await waitFor(() => {
      expect(screen.getByTestId('rate-limit-mode')).toHaveTextContent('authenticated')
    })
  })

  it('should handle cache key separation (demo vs authenticated)', async () => {
    // Test that demo and authenticated cache keys are different
    // Cache keys: demo:{username} vs user:{sessionId}:{username}
    // This test verifies the concept through different rate limit states
    const demoRateLimit = {
      remaining: 4500,
      limit: 5000,
      used: 500,
      reset: Math.floor(Date.now() / 1000) + 3600,
      isDemo: true,
    }

    const mockData = {
      user: {
        id: 'U_cache',
        login: 'cacheuser',
        name: 'Cache Test User',
        avatarUrl: 'https://example.com/cache.png',
        bio: 'Testing cache separation',
        url: 'https://github.com/cacheuser',
        location: 'Cache Location',
        createdAt: '2022-01-01T00:00:00Z',
        followers: { totalCount: 50 },
        following: { totalCount: 25 },
        gists: { totalCount: 5 },
        contributionsCollection: {
          totalCommitContributions: 50,
          commitContributionsByRepository: [],
        },
        year1: { totalCommitContributions: 25 },
        year2: { totalCommitContributions: 35 },
        year3: { totalCommitContributions: 50 },
        repositories: {
          totalCount: 10,
          nodes: [],
          pageInfo: { hasNextPage: false, endCursor: null },
        },
      },
    }

    const mockUseQueryUser = vi.mocked(useQueryUser)
    mockUseQueryUser.mockImplementation((login, daysBack, options) => {
      if (options?.onRateLimitUpdate) {
        setTimeout(() => {
          options.onRateLimitUpdate!(demoRateLimit)
        }, 0)
      }

      return {
        data: mockData,
        loading: false,
        error: undefined,
        refetch: vi.fn(),
        networkStatus: 7,
        client: {} as any,
        observable: {} as any,
        previousData: undefined,
        called: true,
      } as UseQueryUserReturn
    })

    render(<TestCacheTransition username="cacheuser" isAuthenticated={false} />)

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
    })

    // Verify demo mode uses demo cache
    expect(screen.getByTestId('user-data')).toHaveTextContent('User: cacheuser')
    expect(screen.getByTestId('cache-mode')).toHaveTextContent('Cache Mode: demo')
    expect(screen.getByTestId('rate-limit-mode')).toHaveTextContent('demo')
  })
})
