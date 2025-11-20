import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { MockedProvider, type MockedResponse } from '@apollo/client/testing'
import { useUserAnalytics } from '@/hooks/useUserAnalytics'
import { GET_USER_PROFILE } from '@/apollo/queries/userProfile'
import { GET_YEAR_CONTRIBUTIONS } from '@/apollo/queries/yearContributions'
import type { ReactNode } from 'react'

/**
 * Integration Test: Parallel Query Failure Handling
 *
 * This test verifies that useUserAnalytics handles partial query failures gracefully
 * when fetching year-by-year contribution data.
 *
 * Critical Path: User profile query succeeds → Some year queries fail → Show partial data
 *
 * Expected Behavior:
 * 1. Fetch user profile (success)
 * 2. Fetch parallel year queries (some succeed, some fail)
 * 3. Timeline shows successful years only
 * 4. Warning displayed about failed years
 * 5. Metrics calculated from available years only
 */

describe('Parallel Query Failure Integration Test', () => {
  const mockUserProfile: GitHubGraphQLResponse = {
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
          totalContributions: 5000,
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
  }

  // Mock successful year data
  const createYearData = (year: number, commits: number): YearContributionsResponse => ({
    user: {
      contributionsCollection: {
        contributionCalendar: {
          totalContributions: commits,
        },
      },
      repositories: {
        nodes: [
          {
            id: `repo-${year}`,
            name: `project-${year}`,
            description: `Project from ${year}`,
            url: `https://github.com/torvalds/project-${year}`,
            stargazerCount: 100,
            forkCount: 10,
            primaryLanguage: { name: 'C', color: '#555555' },
            createdAt: `${year}-01-01T00:00:00Z`,
            pushedAt: `${year}-12-31T23:59:59Z`,
            isPrivate: false,
            isFork: false,
            languages: {
              edges: [{ node: { name: 'C', color: '#555555' }, size: 10000 }],
            },
            owner: {
              login: 'torvalds',
            },
          },
        ],
      },
    },
    rateLimit: {
      remaining: 4990,
      limit: 5000,
      reset: Math.floor(Date.now() / 1000) + 3600,
      used: 10,
      isDemo: true,
    },
  })

  beforeEach(() => {
    vi.clearAllMocks()
    // Mock console methods to avoid noise
    vi.spyOn(console, 'error').mockImplementation(() => {})
    vi.spyOn(console, 'warn').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should show partial timeline when some year queries fail', async () => {
    const currentYear = new Date().getFullYear()

    // Mock: 2020-2023 succeed, 2024 fails
    const mocks: MockedResponse[] = [
      // User profile query (success)
      {
        request: {
          query: GET_USER_PROFILE,
          variables: { username: 'torvalds' },
        },
        result: { data: mockUserProfile },
      },

      // Year 2020 (success)
      {
        request: {
          query: GET_YEAR_CONTRIBUTIONS,
          variables: {
            username: 'torvalds',
            from: `${currentYear - 4}-01-01T00:00:00Z`,
            to: `${currentYear - 3}-01-01T00:00:00Z`,
          },
        },
        result: { data: createYearData(currentYear - 4, 250) },
      },

      // Year 2021 (success)
      {
        request: {
          query: GET_YEAR_CONTRIBUTIONS,
          variables: {
            username: 'torvalds',
            from: `${currentYear - 3}-01-01T00:00:00Z`,
            to: `${currentYear - 2}-01-01T00:00:00Z`,
          },
        },
        result: { data: createYearData(currentYear - 3, 300) },
      },

      // Year 2022 (success)
      {
        request: {
          query: GET_YEAR_CONTRIBUTIONS,
          variables: {
            username: 'torvalds',
            from: `${currentYear - 2}-01-01T00:00:00Z`,
            to: `${currentYear - 1}-01-01T00:00:00Z`,
          },
        },
        result: { data: createYearData(currentYear - 2, 350) },
      },

      // Year 2023 (success)
      {
        request: {
          query: GET_YEAR_CONTRIBUTIONS,
          variables: {
            username: 'torvalds',
            from: `${currentYear - 1}-01-01T00:00:00Z`,
            to: `${currentYear}-01-01T00:00:00Z`,
          },
        },
        result: { data: createYearData(currentYear - 1, 400) },
      },

      // Year 2024 (FAILURE - network timeout)
      {
        request: {
          query: GET_YEAR_CONTRIBUTIONS,
          variables: {
            username: 'torvalds',
            from: `${currentYear}-01-01T00:00:00Z`,
            to: `${currentYear + 1}-01-01T00:00:00Z`,
          },
        },
        error: new Error('Network timeout'),
      },
    ]

    const wrapper = ({ children }: { children: ReactNode }) => (
      <MockedProvider mocks={mocks} addTypename={false}>
        {children}
      </MockedProvider>
    )

    const { result } = renderHook(() => useUserAnalytics('torvalds'), { wrapper })

    // Wait for loading to complete
    await waitFor(
      () => {
        expect(result.current.yearLoading).toBe(false)
      },
      { timeout: 5000 }
    )

    // Verify timeline contains only successful years (2020-2023)
    expect(
      result.current.timeline.length,
      'Timeline should contain only the 4 successful years (2020-2023), not the failed 2024'
    ).toBe(4)

    // Verify year data
    const years = result.current.timeline.map((yearData) => {
      const year = new Date(yearData.year).getFullYear()
      return year
    })

    expect(
      years,
      'Timeline should include years 2020, 2021, 2022, 2023 (all successful queries)'
    ).toContain(currentYear - 4) // 2020
    expect(years).toContain(currentYear - 3) // 2021
    expect(years).toContain(currentYear - 2) // 2022
    expect(years).toContain(currentYear - 1) // 2023

    expect(
      years,
      'Timeline should NOT include 2024 (failed query)'
    ).not.toContain(currentYear) // 2024 failed

    // Verify contributions from successful years
    const totalContributions = result.current.timeline.reduce(
      (sum, yearData) => sum + yearData.contributions,
      0
    )

    expect(
      totalContributions,
      'Total contributions should be sum of successful years only (250 + 300 + 350 + 400 = 1300)'
    ).toBe(1300)

    // Verify repositories from successful years
    const totalRepos = result.current.timeline.reduce(
      (sum, yearData) => sum + yearData.repositories.length,
      0
    )

    expect(
      totalRepos,
      'Total repositories should be from successful years only (4 repos, one per year)'
    ).toBe(4)

    // Verify no loading errors (graceful degradation)
    expect(
      result.current.yearLoading,
      'Loading should complete despite partial failures'
    ).toBe(false)
  })

  it('should handle all year queries failing gracefully', async () => {
    const currentYear = new Date().getFullYear()

    // Mock: User profile succeeds, all year queries fail
    const mocks: MockedResponse[] = [
      // User profile query (success)
      {
        request: {
          query: GET_USER_PROFILE,
          variables: { username: 'torvalds' },
        },
        result: { data: mockUserProfile },
      },

      // All year queries fail
      ...Array.from({ length: 5 }, (_, i) => ({
        request: {
          query: GET_YEAR_CONTRIBUTIONS,
          variables: {
            username: 'torvalds',
            from: `${currentYear - 4 + i}-01-01T00:00:00Z`,
            to: `${currentYear - 3 + i}-01-01T00:00:00Z`,
          },
        },
        error: new Error('Network error'),
      })),
    ]

    const wrapper = ({ children }: { children: ReactNode }) => (
      <MockedProvider mocks={mocks} addTypename={false}>
        {children}
      </MockedProvider>
    )

    const { result } = renderHook(() => useUserAnalytics('torvalds'), { wrapper })

    // Wait for loading to complete
    await waitFor(
      () => {
        expect(result.current.yearLoading).toBe(false)
      },
      { timeout: 5000 }
    )

    // Verify timeline is empty (all queries failed)
    expect(
      result.current.timeline,
      'Timeline should be empty when all year queries fail'
    ).toEqual([])

    // Verify profile data still available (profile query succeeded)
    expect(
      result.current.userProfile,
      'User profile should still be available despite year query failures'
    ).toBeDefined()
    expect(result.current.userProfile?.login).toBe('torvalds')

    // Verify loading completes (no infinite loading state)
    expect(
      result.current.yearLoading,
      'Loading should complete even when all queries fail (graceful degradation)'
    ).toBe(false)
  })

  it('should handle user profile query failure', async () => {
    // Mock: User profile fails immediately
    const mocks: MockedResponse[] = [
      {
        request: {
          query: GET_USER_PROFILE,
          variables: { username: 'nonexistent' },
        },
        error: new Error('User not found'),
      },
    ]

    const wrapper = ({ children }: { children: ReactNode }) => (
      <MockedProvider mocks={mocks} addTypename={false}>
        {children}
      </MockedProvider>
    )

    const { result } = renderHook(() => useUserAnalytics('nonexistent'), { wrapper })

    // Wait for error state
    await waitFor(
      () => {
        expect(result.current.profileError).toBeDefined()
      },
      { timeout: 3000 }
    )

    // Verify error is captured
    expect(
      result.current.profileError,
      'Profile error should be captured when user profile query fails'
    ).toBeDefined()
    expect(result.current.profileError?.message).toContain('User not found')

    // Verify no user profile data
    expect(
      result.current.userProfile,
      'User profile should be undefined when query fails'
    ).toBeUndefined()

    // Verify timeline is empty (profile query is prerequisite for year queries)
    expect(
      result.current.timeline,
      'Timeline should be empty when profile query fails (year queries not attempted)'
    ).toEqual([])
  })

  it('should calculate metrics from available years only (partial failure)', async () => {
    const currentYear = new Date().getFullYear()

    // Mock: Only 2 years succeed, others fail
    const mocks: MockedResponse[] = [
      // User profile query (success)
      {
        request: {
          query: GET_USER_PROFILE,
          variables: { username: 'torvalds' },
        },
        result: { data: mockUserProfile },
      },

      // Year 1 (success)
      {
        request: {
          query: GET_YEAR_CONTRIBUTIONS,
          variables: {
            username: 'torvalds',
            from: `${currentYear - 4}-01-01T00:00:00Z`,
            to: `${currentYear - 3}-01-01T00:00:00Z`,
          },
        },
        result: { data: createYearData(currentYear - 4, 100) },
      },

      // Year 2 (success)
      {
        request: {
          query: GET_YEAR_CONTRIBUTIONS,
          variables: {
            username: 'torvalds',
            from: `${currentYear - 3}-01-01T00:00:00Z`,
            to: `${currentYear - 2}-01-01T00:00:00Z`,
          },
        },
        result: { data: createYearData(currentYear - 3, 200) },
      },

      // Years 3-5 (all fail)
      ...Array.from({ length: 3 }, (_, i) => ({
        request: {
          query: GET_YEAR_CONTRIBUTIONS,
          variables: {
            username: 'torvalds',
            from: `${currentYear - 2 + i}-01-01T00:00:00Z`,
            to: `${currentYear - 1 + i}-01-01T00:00:00Z`,
          },
        },
        error: new Error('API rate limit exceeded'),
      })),
    ]

    const wrapper = ({ children }: { children: ReactNode }) => (
      <MockedProvider mocks={mocks} addTypename={false}>
        {children}
      </MockedProvider>
    )

    const { result } = renderHook(() => useUserAnalytics('torvalds'), { wrapper })

    // Wait for loading to complete
    await waitFor(
      () => {
        expect(result.current.yearLoading).toBe(false)
      },
      { timeout: 5000 }
    )

    // Verify timeline contains only 2 successful years
    expect(
      result.current.timeline.length,
      'Timeline should contain only 2 successful years'
    ).toBe(2)

    // Verify metrics calculated from 2 years only
    const totalContributions = result.current.timeline.reduce(
      (sum, yearData) => sum + yearData.contributions,
      0
    )

    expect(
      totalContributions,
      'Metrics should be calculated from available 2 years only (100 + 200 = 300), not all 5 years'
    ).toBe(300)

    // Verify repositories count
    expect(
      result.current.timeline.reduce((sum, yearData) => sum + yearData.repositories.length, 0),
      'Repository count should be from available years only (2 repos)'
    ).toBe(2)
  })
})
