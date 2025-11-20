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
  const currentYear = new Date().getFullYear()

  // Mock user profile data (matches GetUserProfileResponse)
  const mockUserProfile = {
    user: {
      id: 'U_torvalds',
      login: 'torvalds',
      name: 'Linus Torvalds',
      bio: 'Creator of Linux',
      avatarUrl: 'https://github.com/torvalds.png',
      url: 'https://github.com/torvalds',
      location: 'Portland, OR',
      createdAt: '2011-09-03T15:26:22Z',
      email: 'torvalds@linux-foundation.org',
      company: 'Linux Foundation',
      websiteUrl: 'https://kernel.org',
      twitterUsername: 'linus__torvalds',
      followers: { totalCount: 100000 },
      following: { totalCount: 0 },
      gists: { totalCount: 5 },
      repositories: { totalCount: 25 },
    },
  }

  // Helper to create year contribution data (matches GetYearContributionsResponse)
  const createYearData = (year: number, commits: number) => ({
    user: {
      contributionsCollection: {
        totalCommitContributions: commits,
        totalIssueContributions: Math.floor(commits / 10),
        totalPullRequestContributions: Math.floor(commits / 5),
        totalPullRequestReviewContributions: Math.floor(commits / 20),
        restrictedContributionsCount: 0,
        commitContributionsByRepository: [
          {
            contributions: { totalCount: commits },
            repository: {
              id: `R_${year}`,
              name: `linux-${year}`,
              nameWithOwner: `torvalds/linux-${year}`,
              url: `https://github.com/torvalds/linux-${year}`,
              description: `Linux kernel work in ${year}`,
              createdAt: `${year}-01-01T00:00:00Z`,
              updatedAt: `${year}-12-31T00:00:00Z`,
              pushedAt: `${year}-12-31T00:00:00Z`,
              stargazerCount: 1000,
              forkCount: 500,
              isFork: false,
              isArchived: false,
              isPrivate: false,
              primaryLanguage: { name: 'C', color: '#555555' },
              owner: { login: 'torvalds', avatarUrl: 'https://github.com/torvalds.png' },
              licenseInfo: { name: 'GNU General Public License v2.0', spdxId: 'GPL-2.0' },
              defaultBranchRef: { name: 'master' },
            },
          },
        ],
      },
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
    // Mock: Last 2 years succeed, current year fails
    const mocks: MockedResponse[] = [
      // User profile query (success)
      {
        request: {
          query: GET_USER_PROFILE,
          variables: { login: 'torvalds' },
        },
        result: { data: mockUserProfile },
      },

      // Year -2 (success)
      {
        request: {
          query: GET_YEAR_CONTRIBUTIONS,
          variables: {
            login: 'torvalds',
            from: `${currentYear - 2}-01-01T00:00:00Z`,
            to: `${currentYear - 1}-01-01T00:00:00Z`,
          },
        },
        result: { data: createYearData(currentYear - 2, 250) },
      },

      // Year -1 (success)
      {
        request: {
          query: GET_YEAR_CONTRIBUTIONS,
          variables: {
            login: 'torvalds',
            from: `${currentYear - 1}-01-01T00:00:00Z`,
            to: `${currentYear}-01-01T00:00:00Z`,
          },
        },
        result: { data: createYearData(currentYear - 1, 300) },
      },

      // Current year (FAILURE - network timeout)
      {
        request: {
          query: GET_YEAR_CONTRIBUTIONS,
          variables: {
            login: 'torvalds',
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

    // Verify timeline contains only successful years (last 2 years)
    expect(
      result.current.timeline.length,
      `Timeline should contain only the 2 successful years (${currentYear - 2}, ${currentYear - 1}), not the failed ${currentYear}`
    ).toBe(2)

    // Verify year data
    const years = result.current.timeline.map((yearData) => {
      const year = new Date(yearData.year).getFullYear()
      return year
    })

    expect(
      years,
      `Timeline should include year ${currentYear - 2} (successful query)`
    ).toContain(currentYear - 2)

    expect(
      years,
      `Timeline should include year ${currentYear - 1} (successful query)`
    ).toContain(currentYear - 1)

    expect(
      years,
      `Timeline should NOT include ${currentYear} (failed query)`
    ).not.toContain(currentYear)

    // Verify contributions from successful years
    const totalContributions = result.current.timeline.reduce(
      (sum, yearData) => sum + yearData.contributions,
      0
    )

    expect(
      totalContributions,
      'Total contributions should be sum of successful years only (250 + 300 = 550)'
    ).toBe(550)

    // Verify repositories from successful years
    const totalRepos = result.current.timeline.reduce(
      (sum, yearData) => sum + yearData.repositories.length,
      0
    )

    expect(
      totalRepos,
      'Total repositories should be from successful years only (2 repos, one per year)'
    ).toBe(2)

    // Verify no loading errors (graceful degradation)
    expect(
      result.current.yearLoading,
      'Loading should complete despite partial failures'
    ).toBe(false)
  })

  it('should handle all year queries failing gracefully', async () => {
    // Mock: User profile succeeds, all year queries fail
    const mocks: MockedResponse[] = [
      // User profile query (success)
      {
        request: {
          query: GET_USER_PROFILE,
          variables: { login: 'torvalds' },
        },
        result: { data: mockUserProfile },
      },

      // All year queries fail (3 years)
      ...Array.from({ length: 3 }, (_, i) => ({
        request: {
          query: GET_YEAR_CONTRIBUTIONS,
          variables: {
            login: 'torvalds',
            from: `${currentYear - 2 + i}-01-01T00:00:00Z`,
            to: `${currentYear - 1 + i}-01-01T00:00:00Z`,
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
          variables: { login: 'nonexistent' },
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
    // Mock: Only 1 year succeeds, others fail
    const mocks: MockedResponse[] = [
      // User profile query (success)
      {
        request: {
          query: GET_USER_PROFILE,
          variables: { login: 'torvalds' },
        },
        result: { data: mockUserProfile },
      },

      // Year -2 (success)
      {
        request: {
          query: GET_YEAR_CONTRIBUTIONS,
          variables: {
            login: 'torvalds',
            from: `${currentYear - 2}-01-01T00:00:00Z`,
            to: `${currentYear - 1}-01-01T00:00:00Z`,
          },
        },
        result: { data: createYearData(currentYear - 2, 100) },
      },

      // Years -1 and current (all fail)
      ...Array.from({ length: 2 }, (_, i) => ({
        request: {
          query: GET_YEAR_CONTRIBUTIONS,
          variables: {
            login: 'torvalds',
            from: `${currentYear - 1 + i}-01-01T00:00:00Z`,
            to: `${currentYear + i}-01-01T00:00:00Z`,
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

    // Verify timeline contains only 1 successful year
    expect(
      result.current.timeline.length,
      'Timeline should contain only 1 successful year'
    ).toBe(1)

    // Verify metrics calculated from 1 year only
    const totalContributions = result.current.timeline.reduce(
      (sum, yearData) => sum + yearData.contributions,
      0
    )

    expect(
      totalContributions,
      'Metrics should be calculated from available 1 year only (100), not all 3 years'
    ).toBe(100)

    // Verify repositories count
    expect(
      result.current.timeline.reduce((sum, yearData) => sum + yearData.repositories.length, 0),
      'Repository count should be from available year only (1 repo)'
    ).toBe(1)
  })
})
