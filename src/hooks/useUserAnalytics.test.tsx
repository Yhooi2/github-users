import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { MockedProvider, type MockedResponse } from '@apollo/client/testing'
import { useUserAnalytics } from './useUserAnalytics'
import { GET_USER_PROFILE } from '@/apollo/queries/userProfile'
import { GET_YEAR_CONTRIBUTIONS } from '@/apollo/queries/yearContributions'
import type { ReactNode } from 'react'

describe('useUserAnalytics', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Fix system time to ensure consistent year ranges
    // This allows us to use REAL date-utils instead of mocking internal modules
    vi.setSystemTime(new Date('2025-11-17T12:00:00Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  const createMockProfileResponse = (login: string): MockedResponse => ({
    request: {
      query: GET_USER_PROFILE,
      variables: { login },
    },
    result: {
      data: {
        user: {
          id: '123',
          login,
          name: 'Test User',
          avatarUrl: 'https://example.com/avatar.jpg',
          bio: 'Test bio',
          url: `https://github.com/${login}`,
          location: 'Earth',
          createdAt: '2023-01-01T00:00:00Z',
          email: 'test@example.com',
          company: 'Test Company',
          websiteUrl: 'https://example.com',
          twitterUsername: 'testuser',
          followers: { totalCount: 100 },
          following: { totalCount: 50 },
          gists: { totalCount: 10 },
          repositories: { totalCount: 20 },
        },
      },
    },
  })

  const createMockYearResponse = (
    login: string,
    year: number,
    from: string,
    to: string
  ): MockedResponse => ({
    request: {
      query: GET_YEAR_CONTRIBUTIONS,
      variables: { login, from, to },
    },
    result: {
      data: {
        user: {
          contributionsCollection: {
            totalCommitContributions: year * 10,
            totalIssueContributions: year * 2,
            totalPullRequestContributions: year * 3,
            totalPullRequestReviewContributions: year * 1,
            restrictedContributionsCount: 0,
            commitContributionsByRepository: [
              {
                contributions: { totalCount: 50 },
                repository: {
                  id: `repo-owned-${year}`,
                  name: `my-repo-${year}`,
                  nameWithOwner: `${login}/my-repo-${year}`,
                  url: `https://github.com/${login}/my-repo-${year}`,
                  description: `My repo for ${year}`,
                  createdAt: `${year}-01-01T00:00:00Z`,
                  updatedAt: `${year}-12-01T00:00:00Z`,
                  pushedAt: `${year}-12-01T00:00:00Z`,
                  stargazerCount: 10,
                  forkCount: 2,
                  isFork: false,
                  isArchived: false,
                  isPrivate: false,
                  primaryLanguage: { name: 'TypeScript', color: '#3178c6' },
                  owner: { login, avatarUrl: 'https://example.com/avatar.jpg' },
                  licenseInfo: { name: 'MIT License', spdxId: 'MIT' },
                  defaultBranchRef: { name: 'main' },
                },
              },
              {
                contributions: { totalCount: 20 },
                repository: {
                  id: `repo-contrib-${year}`,
                  name: `other-repo-${year}`,
                  nameWithOwner: `otheruser/other-repo-${year}`,
                  url: `https://github.com/otheruser/other-repo-${year}`,
                  description: `Contributed to this in ${year}`,
                  createdAt: `${year}-01-01T00:00:00Z`,
                  updatedAt: `${year}-12-01T00:00:00Z`,
                  pushedAt: `${year}-12-01T00:00:00Z`,
                  stargazerCount: 100,
                  forkCount: 20,
                  isFork: false,
                  isArchived: false,
                  isPrivate: false,
                  primaryLanguage: { name: 'JavaScript', color: '#f1e05a' },
                  owner: {
                    login: 'otheruser',
                    avatarUrl: 'https://example.com/other.jpg',
                  },
                  licenseInfo: { name: 'Apache License 2.0', spdxId: 'Apache-2.0' },
                  defaultBranchRef: { name: 'main' },
                },
              },
            ],
          },
        },
      },
    },
  })

  it('fetches user profile and timeline', async () => {
    const username = 'testuser'
    const mocks = [
      createMockProfileResponse(username),
      // Real generateYearRanges returns dates with .000Z format
      createMockYearResponse(username, 2023, '2023-01-01T00:00:00.000Z', '2023-12-31T23:59:59.000Z'),
      createMockYearResponse(username, 2024, '2024-01-01T00:00:00.000Z', '2024-12-31T23:59:59.000Z'),
      createMockYearResponse(username, 2025, '2025-01-01T00:00:00.000Z', '2025-11-17T12:00:00.000Z'),
    ]

    const wrapper = ({ children }: { children: ReactNode }) => (
      <MockedProvider mocks={mocks} addTypename={false}>
        {children}
      </MockedProvider>
    )

    const { result } = renderHook(() => useUserAnalytics(username), { wrapper })

    // Initially loading
    expect(result.current.loading).toBe(true)
    expect(result.current.profile).toBe(null)
    expect(result.current.timeline).toEqual([])

    // Wait for profile to load
    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    }, { timeout: 5000 })

    // Profile should be loaded
    expect(result.current.profile).toBeDefined()
    expect(result.current.profile?.login).toBe(username)
    expect(result.current.profile?.name).toBe('Test User')

    // Timeline should have 3 years (2023, 2024, 2025)
    expect(result.current.timeline.length).toBe(3)

    // Years should be sorted newest first
    expect(result.current.timeline[0].year).toBe(2025)
    expect(result.current.timeline[1].year).toBe(2024)
    expect(result.current.timeline[2].year).toBe(2023)
  })

  it('separates owned repos from contributions', async () => {
    const username = 'testuser'
    const mocks = [
      createMockProfileResponse(username),
      createMockYearResponse(username, 2023, '2023-01-01T00:00:00.000Z', '2023-12-31T23:59:59.000Z'),
      createMockYearResponse(username, 2024, '2024-01-01T00:00:00.000Z', '2024-12-31T23:59:59.000Z'),
      createMockYearResponse(username, 2025, '2025-01-01T00:00:00.000Z', '2025-11-17T12:00:00.000Z'),
    ]

    const wrapper = ({ children }: { children: ReactNode }) => (
      <MockedProvider mocks={mocks} addTypename={false}>
        {children}
      </MockedProvider>
    )

    const { result } = renderHook(() => useUserAnalytics(username), { wrapper })

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    }, { timeout: 5000 })

    const year2023 = result.current.timeline.find((y) => y.year === 2023)
    expect(year2023).toBeDefined()

    // Should have 1 owned repo and 1 contribution
    expect(year2023!.ownedRepos.length).toBe(1)
    expect(year2023!.contributions.length).toBe(1)

    // Owned repo should belong to the user
    expect(year2023!.ownedRepos[0].repository.owner.login).toBe(username)

    // Contribution should belong to someone else
    expect(year2023!.contributions[0].repository.owner.login).not.toBe(username)
  })

  it('handles empty username gracefully', () => {
    const mocks: MockedResponse[] = []

    const wrapper = ({ children }: { children: ReactNode }) => (
      <MockedProvider mocks={mocks} addTypename={false}>
        {children}
      </MockedProvider>
    )

    const { result } = renderHook(() => useUserAnalytics(''), { wrapper })

    expect(result.current.loading).toBe(false)
    expect(result.current.profile).toBe(null)
    expect(result.current.timeline).toEqual([])
    expect(result.current.error).toBeUndefined()
  })

  it('calculates contribution totals correctly', async () => {
    const username = 'testuser'
    const mocks = [
      createMockProfileResponse(username),
      createMockYearResponse(username, 2023, '2023-01-01T00:00:00.000Z', '2023-12-31T23:59:59.000Z'),
      createMockYearResponse(username, 2024, '2024-01-01T00:00:00.000Z', '2024-12-31T23:59:59.000Z'),
      createMockYearResponse(username, 2025, '2025-01-01T00:00:00.000Z', '2025-11-17T12:00:00.000Z'),
    ]

    const wrapper = ({ children }: { children: ReactNode }) => (
      <MockedProvider mocks={mocks} addTypename={false}>
        {children}
      </MockedProvider>
    )

    const { result } = renderHook(() => useUserAnalytics(username), { wrapper })

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    }, { timeout: 5000 })

    const year2023 = result.current.timeline.find((y) => y.year === 2023)
    expect(year2023).toBeDefined()

    // Year * 10 commits (from mock)
    expect(year2023!.totalCommits).toBe(2023 * 10)
    expect(year2023!.totalIssues).toBe(2023 * 2)
    expect(year2023!.totalPRs).toBe(2023 * 3)
    expect(year2023!.totalReviews).toBe(2023 * 1)
  })

  it('returns null profile when user not found', async () => {
    const username = 'nonexistent'
    const mocks: MockedResponse[] = [
      {
        request: {
          query: GET_USER_PROFILE,
          variables: { login: username },
        },
        result: {
          data: {
            user: null,
          },
        },
      },
    ]

    const wrapper = ({ children }: { children: ReactNode }) => (
      <MockedProvider mocks={mocks} addTypename={false}>
        {children}
      </MockedProvider>
    )

    const { result } = renderHook(() => useUserAnalytics(username), { wrapper })

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.profile).toBe(null)
    expect(result.current.timeline).toEqual([])
  })
})
