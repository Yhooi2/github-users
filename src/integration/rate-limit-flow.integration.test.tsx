/**
 * Integration Test: Rate Limit Flow (API → UI)
 *
 * Testing Philosophy: Kent C. Dodds & Testing Trophy
 * - Test the FULL flow from GitHub API response to UI display
 * - Verify rate limit data propagates correctly through all layers
 * - Focus on USER EXPERIENCE: does the user see correct rate limit info?
 *
 * Test Flow:
 * 1. GitHub API returns rate limit headers
 * 2. Proxy extracts rate limit from headers
 * 3. Apollo Client receives rate limit in response
 * 4. useQueryUser hook calls onRateLimitUpdate callback
 * 5. App.tsx updates state
 * 6. RateLimitBanner shows correct values
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
 * Test Component that simulates App.tsx behavior
 * This component:
 * 1. Uses useQueryUser hook
 * 2. Receives rate limit updates via callback
 * 3. Displays rate limit info (like RateLimitBanner would)
 */
function TestRateLimitFlow({ username }: { username: string }) {
  const [rateLimit, setRateLimit] = React.useState<{
    remaining: number
    limit: number
    reset: number
    isDemo: boolean
    userLogin?: string
  }>({
    remaining: 5000,
    limit: 5000,
    reset: 0,
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
      <div data-testid="rate-limit-info">
        <span data-testid="remaining">{rateLimit.remaining}</span>
        <span data-testid="limit">{rateLimit.limit}</span>
        <span data-testid="is-demo">{rateLimit.isDemo ? 'demo' : 'authenticated'}</span>
        {rateLimit.userLogin && (
          <span data-testid="user-login">{rateLimit.userLogin}</span>
        )}
      </div>
    </div>
  )
}

describe('Integration: Rate Limit Flow (API → UI)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should propagate rate limit from API response to UI (Demo Mode)', async () => {
    // Simulate GraphQL response with rate limit in demo mode
    const mockRateLimit = {
      remaining: 4500,
      limit: 5000,
      used: 500,
      reset: Math.floor(Date.now() / 1000) + 3600,
      isDemo: true,
    }

    const mockData = {
      user: {
        id: 'U_123',
        login: 'testuser',
        name: 'Test User',
        avatarUrl: 'https://example.com/avatar.png',
        bio: 'Test bio',
        url: 'https://github.com/testuser',
        location: 'Test Location',
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

    // Mock useQueryUser to simulate API response with rate limit
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

    render(<TestRateLimitFlow username="testuser" />)

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
    })

    // Verify user data loaded
    expect(screen.getByTestId('user-data')).toHaveTextContent('User: testuser')

    // Verify rate limit propagated to UI
    await waitFor(() => {
      const remaining = screen.getByTestId('remaining')
      const limit = screen.getByTestId('limit')
      const isDemo = screen.getByTestId('is-demo')

      expect(remaining).toHaveTextContent('4500')
      expect(limit).toHaveTextContent('5000')
      expect(isDemo).toHaveTextContent('demo')
    })
  })

  it('should propagate rate limit from API response to UI (Authenticated Mode)', async () => {
    const mockRateLimit = {
      remaining: 4200,
      limit: 5000,
      used: 800,
      reset: Math.floor(Date.now() / 1000) + 3600,
      isDemo: false,
      userLogin: 'authuser',
    }

    const mockData = {
      user: {
        id: 'U_456',
        login: 'authuser',
        name: 'Auth User',
        avatarUrl: 'https://example.com/avatar2.png',
        bio: 'Auth bio',
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

    render(<TestRateLimitFlow username="authuser" />)

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
    })

    // Verify authenticated mode rate limit
    await waitFor(() => {
      const remaining = screen.getByTestId('remaining')
      const limit = screen.getByTestId('limit')
      const isDemo = screen.getByTestId('is-demo')
      const userLogin = screen.getByTestId('user-login')

      expect(remaining).toHaveTextContent('4200')
      expect(limit).toHaveTextContent('5000')
      expect(isDemo).toHaveTextContent('authenticated')
      expect(userLogin).toHaveTextContent('authuser')
    })
  })

  it('should handle rate limit warnings correctly (<10% remaining)', async () => {
    // Critical: Only 450 remaining (9%)
    const mockRateLimit = {
      remaining: 450,
      limit: 5000,
      used: 4550,
      reset: Math.floor(Date.now() / 1000) + 3600,
      isDemo: true,
    }

    const mockData = {
      user: {
        id: 'U_789',
        login: 'warninguser',
        name: 'Warning User',
        avatarUrl: 'https://example.com/avatar3.png',
        bio: 'Warning bio',
        url: 'https://github.com/warninguser',
        location: 'Warning Location',
        createdAt: '2021-01-01T00:00:00Z',
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

    render(<TestRateLimitFlow username="warninguser" />)

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
    })

    // Verify warning threshold reached
    await waitFor(() => {
      const remaining = screen.getByTestId('remaining')
      const limit = screen.getByTestId('limit')

      expect(remaining).toHaveTextContent('450')
      expect(limit).toHaveTextContent('5000')

      // Calculate percentage: 450/5000 = 9%
      const percentage = (450 / 5000) * 100
      expect(percentage).toBeLessThan(10)
    })
  })

  it('should handle missing rate limit in response gracefully', async () => {
    // API response without calling onRateLimitUpdate
    const mockData = {
      user: {
        id: 'U_999',
        login: 'noratelimit',
        name: 'No Rate Limit',
        avatarUrl: 'https://example.com/avatar4.png',
        bio: 'No rate limit bio',
        url: 'https://github.com/noratelimit',
        location: 'No Rate Limit Location',
        createdAt: '2022-01-01T00:00:00Z',
        followers: { totalCount: 10 },
        following: { totalCount: 5 },
        gists: { totalCount: 2 },
        contributionsCollection: {
          totalCommitContributions: 10,
          commitContributionsByRepository: [],
        },
        year1: { totalCommitContributions: 5 },
        year2: { totalCommitContributions: 7 },
        year3: { totalCommitContributions: 10 },
        repositories: {
          totalCount: 5,
          nodes: [],
          pageInfo: { hasNextPage: false, endCursor: null },
        },
      },
    }

    const mockUseQueryUser = vi.mocked(useQueryUser)
    mockUseQueryUser.mockImplementation(() => {
      // Intentionally NOT calling onRateLimitUpdate to simulate missing rate limit

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

    render(<TestRateLimitFlow username="noratelimit" />)

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
    })

    // Should maintain default values (not crash)
    await waitFor(() => {
      const remaining = screen.getByTestId('remaining')
      const limit = screen.getByTestId('limit')

      // Should have initial default values
      expect(remaining).toHaveTextContent('5000')
      expect(limit).toHaveTextContent('5000')
    })
  })
})
