import { MockedResponse } from '@apollo/client/testing'
import { GET_USER_INFO } from '@/apollo/queriers'
import { GET_USER_PROFILE } from '@/apollo/queries/userProfile'
import { createMockUser } from './github-data'
import { GitHubUser } from '@/apollo/github-api.types'

/**
 * Factory functions for creating Apollo MockedProvider responses
 *
 * These helpers create properly structured MockedResponse objects
 * for use with Apollo's MockedProvider in integration tests.
 *
 * Benefits:
 * - Centralized mock creation (DRY principle)
 * - Type-safe mock responses
 * - Flexible overrides for test customization
 * - Matches exact GraphQL query structure
 *
 * @example
 * ```typescript
 * import { renderWithMockedProvider } from '@/test/utils/renderWithMockedProvider'
 * import { createUserInfoMock } from '@/test/mocks/apollo-mocks'
 *
 * const mocks = [
 *   createUserInfoMock({
 *     login: 'torvalds',
 *     name: 'Linus Torvalds',
 *   }),
 * ]
 *
 * renderWithMockedProvider(<App />, mocks)
 * ```
 */

/**
 * Rate limit override options for mock responses
 */
export interface RateLimitOverrides {
  remaining?: number
  limit?: number
  reset?: number
  used?: number
  isDemo?: boolean
  userLogin?: string
}

/**
 * Query variables override options
 *
 * Allows partial override of query variables.
 * Unspecified variables will use defaults or expect.any(String) for dates.
 */
export interface QueryVariablesOverrides {
  login?: string
  from?: string
  to?: string
  year1From?: string
  year1To?: string
  year2From?: string
  year2To?: string
  year3From?: string
  year3To?: string
}

/**
 * Creates a mock response for GET_USER_INFO query
 *
 * This is the main query used throughout the app to fetch user profile
 * and contribution data. The mock includes:
 * - User profile fields
 * - Yearly contribution stats (3 years)
 * - Repository list
 * - Rate limit information
 *
 * @param userOverrides - Partial user data to override defaults
 * @param rateLimitOverrides - Partial rate limit data to override defaults
 * @param variablesOverrides - Partial query variables to override defaults
 *
 * @returns MockedResponse object for use with MockedProvider
 *
 * @example
 * ```typescript
 * // Basic usage with defaults
 * const mock = createUserInfoMock()
 *
 * // Override user data
 * const mock = createUserInfoMock({
 *   login: 'torvalds',
 *   name: 'Linus Torvalds',
 *   bio: 'Creator of Linux',
 * })
 *
 * // Override rate limit (simulate authenticated mode)
 * const mock = createUserInfoMock(
 *   { login: 'torvalds' },
 *   { remaining: 4999, limit: 5000, isDemo: false, userLogin: 'myuser' }
 * )
 *
 * // Override query variables (for specific date ranges)
 * const mock = createUserInfoMock(
 *   { login: 'torvalds' },
 *   {},
 *   { from: '2024-01-01T00:00:00.000Z', to: '2024-12-31T23:59:59.999Z' }
 * )
 * ```
 */
export function createUserInfoMock(
  userOverrides: Partial<GitHubUser> = {},
  rateLimitOverrides: RateLimitOverrides = {},
  variablesOverrides: QueryVariablesOverrides = {}
): MockedResponse {
  // Create mock user with overrides
  const mockUserData = createMockUser(userOverrides)

  // Default rate limit (demo mode)
  const defaultRateLimit = {
    remaining: 5000,
    limit: 5000,
    reset: Math.floor(Date.now() / 1000) + 3600, // 1 hour from now
    used: 0,
    isDemo: true,
    ...rateLimitOverrides,
  }

  // Use variableMatchers to match any variables
  // This allows the mock to match regardless of actual date values
  return {
    request: {
      query: GET_USER_INFO,
    },
    variableMatchers: {
      login: () => true,  // Match any login
      from: () => true,  // Match any date
      to: () => true,
      year1From: () => true,
      year1To: () => true,
      year2From: () => true,
      year2To: () => true,
      year3From: () => true,
      year3To: () => true,
    },
    result: {
      data: {
        user: mockUserData,
        rateLimit: defaultRateLimit,
      },
    },
  }
}

/**
 * Creates a mock response for GET_USER_INFO with error
 *
 * Useful for testing error states, network failures, and GraphQL errors.
 *
 * @param errorMessage - Error message to return
 * @param variablesOverrides - Partial query variables to override defaults
 *
 * @returns MockedResponse with GraphQL error
 *
 * @example
 * ```typescript
 * const errorMock = createUserInfoErrorMock('User not found')
 * const mocks = [errorMock]
 *
 * renderWithMockedProvider(<App />, mocks)
 *
 * // Wait for error to be displayed
 * await waitFor(() => {
 *   expect(screen.getByText(/User not found/i)).toBeInTheDocument()
 * })
 * ```
 */
export function createUserInfoErrorMock(
  errorMessage: string = 'GraphQL Error',
  variablesOverrides: QueryVariablesOverrides = {}
): MockedResponse {
  const defaultVariables = {
    login: 'testuser',
    from: undefined,
    to: undefined,
    year1From: undefined,
    year1To: undefined,
    year2From: undefined,
    year2To: undefined,
    year3From: undefined,
    year3To: undefined,
    ...variablesOverrides,
  }

  return {
    request: {
      query: GET_USER_INFO,
      variables: defaultVariables,
    },
    error: new Error(errorMessage),
  }
}

/**
 * Creates a mock response for GET_USER_INFO with network error
 *
 * Simulates network-level failures (connection timeout, DNS errors, etc.)
 *
 * @param variablesOverrides - Partial query variables to override defaults
 *
 * @returns MockedResponse with network error
 *
 * @example
 * ```typescript
 * const networkErrorMock = createUserInfoNetworkErrorMock()
 * const mocks = [networkErrorMock]
 *
 * renderWithMockedProvider(<App />, mocks)
 *
 * // Wait for network error to be displayed
 * await waitFor(() => {
 *   expect(screen.getByText(/Network error/i)).toBeInTheDocument()
 * })
 * ```
 */
export function createUserInfoNetworkErrorMock(
  variablesOverrides: QueryVariablesOverrides = {}
): MockedResponse {
  return createUserInfoErrorMock('Network request failed', variablesOverrides)
}

/**
 * Creates a mock response for user not found (null user)
 *
 * Simulates GitHub API response when user doesn't exist.
 *
 * @param login - Username that doesn't exist
 * @param variablesOverrides - Partial query variables to override defaults
 *
 * @returns MockedResponse with null user
 *
 * @example
 * ```typescript
 * const notFoundMock = createUserNotFoundMock('nonexistentuser')
 * const mocks = [notFoundMock]
 *
 * renderWithMockedProvider(<App />, mocks)
 *
 * await waitFor(() => {
 *   expect(screen.getByText(/User not found/i)).toBeInTheDocument()
 * })
 * ```
 */
export function createUserNotFoundMock(
  login: string = 'nonexistentuser',
  variablesOverrides: QueryVariablesOverrides = {}
): MockedResponse {
  const defaultVariables = {
    login,
    from: undefined,
    to: undefined,
    year1From: undefined,
    year1To: undefined,
    year2From: undefined,
    year2To: undefined,
    year3From: undefined,
    year3To: undefined,
    ...variablesOverrides,
  }

  return {
    request: {
      query: GET_USER_INFO,
      variables: defaultVariables,
    },
    result: {
      data: {
        user: null, // User not found
        rateLimit: {
          remaining: 5000,
          limit: 5000,
          reset: Math.floor(Date.now() / 1000) + 3600,
          used: 0,
          isDemo: true,
        },
      },
    },
  }
}

/**
 * Creates multiple mock responses for demo → auth mode transition
 *
 * Helper for testing cache transitions between demo and authenticated modes.
 * Returns array of two mocks: one for demo mode, one for auth mode.
 *
 * @param login - GitHub username
 * @param authenticatedUser - Authenticated user's GitHub username
 *
 * @returns Array of [demoModeMock, authModeMock]
 *
 * @example
 * ```typescript
 * const [demoMock, authMock] = createCacheTransitionMocks('torvalds', 'myuser')
 *
 * // First render with demo mock
 * const { rerender } = renderWithMockedProvider(<App />, [demoMock])
 *
 * // Verify demo mode
 * await waitFor(() => {
 *   expect(screen.getByText(/5000.*5000/i)).toBeInTheDocument()
 * })
 *
 * // Simulate login, rerender with auth mock
 * rerender(
 *   <MockedProvider mocks={[authMock]} addTypename={false}>
 *     <App />
 *   </MockedProvider>
 * )
 *
 * // Verify auth mode
 * await waitFor(() => {
 *   expect(screen.getByText(/4999.*5000/i)).toBeInTheDocument()
 * })
 * ```
 */
export function createCacheTransitionMocks(
  login: string = 'torvalds',
  authenticatedUser: string = 'authenticateduser'
): [MockedResponse, MockedResponse] {
  // Demo mode mock
  const demoMock = createUserInfoMock(
    { login },
    {
      remaining: 5000,
      limit: 5000,
      used: 0,
      isDemo: true,
    }
  )

  // Auth mode mock (lower rate limit to show usage)
  const authMock = createUserInfoMock(
    { login },
    {
      remaining: 4999,
      limit: 5000,
      used: 1,
      isDemo: false,
      userLogin: authenticatedUser,
    }
  )

  return [demoMock, authMock]
}

/**
 * Creates a mock response with loading delay
 *
 * Simulates slow network by adding delay before resolving.
 *
 * @param delayMs - Delay in milliseconds
 * @param userOverrides - Partial user data to override defaults
 * @param rateLimitOverrides - Partial rate limit data to override defaults
 *
 * @returns MockedResponse with delay
 *
 * @example
 * ```typescript
 * const slowMock = createUserInfoMockWithDelay(2000, { login: 'torvalds' })
 * const mocks = [slowMock]
 *
 * renderWithMockedProvider(<App />, mocks)
 *
 * // Verify loading state
 * expect(screen.getByText(/Loading/i)).toBeInTheDocument()
 *
 * // Wait for data to load (after 2s delay)
 * await waitFor(() => {
 *   expect(screen.getByText(/Linus Torvalds/i)).toBeInTheDocument()
 * }, { timeout: 3000 })
 * ```
 */
export function createUserInfoMockWithDelay(
  delayMs: number,
  userOverrides: Partial<GitHubUser> = {},
  rateLimitOverrides: RateLimitOverrides = {}
): MockedResponse {
  const baseMock = createUserInfoMock(userOverrides, rateLimitOverrides)

  return {
    ...baseMock,
    delay: delayMs,
  }
}

/**
 * Creates a mock response for GET_USER_PROFILE query
 *
 * This query is used by useUserAnalytics hook to fetch initial user profile
 * information including createdAt (needed for timeline generation).
 *
 * @param userOverrides - Partial user data to override defaults
 * @param variablesOverrides - Partial query variables to override defaults
 *
 * @returns MockedResponse object for use with MockedProvider
 *
 * @example
 * ```typescript
 * const profileMock = createUserProfileMock({
 *   login: 'torvalds',
 *   name: 'Linus Torvalds',
 *   createdAt: '2011-09-03T15:26:22Z',
 * })
 *
 * renderWithMockedProvider(<App />, [profileMock])
 * ```
 */
export function createUserProfileMock(
  userOverrides: Partial<GitHubUser> = {},
  variablesOverrides: { login?: string } = {}
): MockedResponse {
  const mockUserData = createMockUser(userOverrides)

  // Use variableMatchers to match any login value
  return {
    request: {
      query: GET_USER_PROFILE,
    },
    variableMatchers: {
      login: () => true,  // Match any login
    },
    result: {
      data: {
        user: {
          id: mockUserData.id,
          login: mockUserData.login,
          name: mockUserData.name,
          avatarUrl: mockUserData.avatarUrl,
          bio: mockUserData.bio,
          url: mockUserData.url,
          location: mockUserData.location,
          createdAt: mockUserData.createdAt,
          email: mockUserData.email,
          company: mockUserData.company,
          websiteUrl: mockUserData.websiteUrl,
          twitterUsername: mockUserData.twitterUsername,
          followers: mockUserData.followers,
          following: mockUserData.following,
          gists: mockUserData.gists,
          repositories: {
            totalCount: mockUserData.repositories?.totalCount || 0,
          },
        },
      },
    },
  }
}
