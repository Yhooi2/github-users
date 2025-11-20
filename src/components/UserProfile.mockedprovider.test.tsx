import { describe, it, expect, vi } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import UserProfile from './UserProfile'
import { renderWithMockedProvider } from '@/test/utils/renderWithMockedProvider'
import { createUserInfoMock, createUserInfoErrorMock, createUserNotFoundMock } from '@/test/mocks/apollo-mocks'

/**
 * Component-Level Integration Tests with MockedProvider
 *
 * SOLUTION to full App testing complexity:
 * - Tests single component (UserProfile) instead of entire App
 * - Single GraphQL query (GET_USER_INFO) instead of multiple
 * - No dynamic date variables issues - variableMatchers handles them
 * - No multiple hooks complexity
 *
 * BENEFITS:
 * ✅ Fast test execution
 * ✅ Clear test scope (one component, one query)
 * ✅ Uses created utilities (renderWithMockedProvider, createUserInfoMock)
 * ✅ Tests real Apollo Client behavior
 * ✅ No timing/race condition issues
 *
 * This approach demonstrates how to use MockedProvider effectively
 * for component-level testing instead of full App integration tests.
 */

describe('UserProfile with MockedProvider', () => {
  describe('Success States', () => {
    it('should display user profile data from mocked GraphQL response', async () => {
      // Create mock with specific user data
      const mock = createUserInfoMock({
        login: 'torvalds',
        name: 'Linus Torvalds',
        bio: 'Creator of Linux and Git',
        location: 'Portland, OR',
        avatarUrl: 'https://avatars.githubusercontent.com/u/1024025',
      })

      // Render component with mock
      renderWithMockedProvider(
        <UserProfile userName="torvalds" />,
        [mock]
      )

      // Verify loading state initially
      expect(screen.getByText(/Loading user profile/i)).toBeInTheDocument()

      // Wait for data to load
      await waitFor(() => {
        expect(screen.getByText('Linus Torvalds')).toBeInTheDocument()
      })

      // Verify profile data displayed
      expect(screen.getByText('Creator of Linux and Git')).toBeInTheDocument()
      expect(screen.getByText('Portland, OR')).toBeInTheDocument()
      expect(screen.getByText('@torvalds')).toBeInTheDocument()
    })

    it('should display demo mode rate limit (5000/5000)', async () => {
      const mock = createUserInfoMock(
        {
          login: 'octocat',
          name: 'The Octocat',
        },
        {
          remaining: 5000,
          limit: 5000,
          used: 0,
          isDemo: true,
        }
      )

      const onRateLimitUpdate = vi.fn()

      renderWithMockedProvider(
        <UserProfile userName="octocat" onRateLimitUpdate={onRateLimitUpdate} />,
        [mock]
      )

      // Wait for data to load
      await waitFor(() => {
        expect(screen.getByText('The Octocat')).toBeInTheDocument()
      })

      // Verify rate limit callback was called with demo mode data
      await waitFor(() => {
        expect(onRateLimitUpdate).toHaveBeenCalledWith(
          expect.objectContaining({
            remaining: 5000,
            limit: 5000,
            used: 0,
            isDemo: true,
          })
        )
      })
    })

    it('should display authenticated mode rate limit (4999/5000)', async () => {
      const mock = createUserInfoMock(
        {
          login: 'octocat',
          name: 'The Octocat',
        },
        {
          remaining: 4999,
          limit: 5000,
          used: 1,
          isDemo: false,
          userLogin: 'authenticateduser',
        }
      )

      const onRateLimitUpdate = vi.fn()

      renderWithMockedProvider(
        <UserProfile userName="octocat" onRateLimitUpdate={onRateLimitUpdate} />,
        [mock]
      )

      // Wait for data to load
      await waitFor(() => {
        expect(screen.getByText('The Octocat')).toBeInTheDocument()
      })

      // Verify authenticated rate limit
      await waitFor(() => {
        expect(onRateLimitUpdate).toHaveBeenCalledWith(
          expect.objectContaining({
            remaining: 4999,
            limit: 5000,
            used: 1,
            isDemo: false,
            userLogin: 'authenticateduser',
          })
        )
      })
    })

    it('should display user stats (repos, followers, following, gists)', async () => {
      const mock = createUserInfoMock({
        login: 'octocat',
        name: 'The Octocat',
        repositories: { totalCount: 42 },
        followers: { totalCount: 1000 },
        following: { totalCount: 50 },
        gists: { totalCount: 25 },
      })

      renderWithMockedProvider(
        <UserProfile userName="octocat" />,
        [mock]
      )

      // Wait for stats to be displayed
      await waitFor(() => {
        expect(screen.getByText('42')).toBeInTheDocument() // repositories
        expect(screen.getByText('1,000')).toBeInTheDocument() // followers
        expect(screen.getByText('50')).toBeInTheDocument() // following
        expect(screen.getByText('25')).toBeInTheDocument() // gists
      })
    })
  })

  describe('Error States', () => {
    it('should display error state when GraphQL query fails', async () => {
      const errorMock = createUserInfoErrorMock('Failed to fetch user data')

      renderWithMockedProvider(
        <UserProfile userName="nonexistent" />,
        [errorMock]
      )

      // Wait for error state
      await waitFor(() => {
        expect(screen.getByText(/Failed to fetch user data/i)).toBeInTheDocument()
      })

      // Verify retry button is present
      expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument()
    })

    it('should display "User Not Found" when user is null', async () => {
      const notFoundMock = createUserNotFoundMock('nonexistentuser')

      renderWithMockedProvider(
        <UserProfile userName="nonexistentuser" />,
        [notFoundMock]
      )

      // Wait for empty state
      await waitFor(() => {
        expect(screen.getByText(/User Not Found/i)).toBeInTheDocument()
      })

      expect(screen.getByText(/The requested GitHub user could not be found/i)).toBeInTheDocument()
    })
  })

  describe('Loading States', () => {
    it('should display loading state before data loads', () => {
      const mock = createUserInfoMock()

      renderWithMockedProvider(
        <UserProfile userName="octocat" />,
        [mock]
      )

      // Verify loading state is shown initially
      expect(screen.getByText(/Loading user profile/i)).toBeInTheDocument()
    })
  })
})
