/**
 * Integration Tests for Apollo Client + GitHub Proxy
 *
 * Testing Philosophy: Kent C. Dodds & Testing Trophy
 * - Focus on USER BEHAVIOR, not implementation details
 * - Test how the software is USED, not how it WORKS internally
 * - Integration tests provide best ROI (50% of test suite)
 *
 * What we test:
 * ✅ Real-world user scenarios (search user, handle errors)
 * ✅ End-to-end data flow (Apollo Client → proxy → response)
 * ✅ Error handling as user experiences it
 * ✅ Caching behavior impact on user experience
 *
 * What we DON'T test (implementation details):
 * ❌ HTTP methods (POST vs GET)
 * ❌ Header formats (Content-Type)
 * ❌ Request body structure
 * ❌ Internal link chain order
 *
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ApolloClient, InMemoryCache, gql, createHttpLink, ApolloLink } from '@apollo/client'
import { onError } from '@apollo/client/link/error'

// Mock toast to prevent errors in tests
vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}))

/**
 * Test Helpers
 * Encapsulate setup to reduce duplication and improve maintainability
 */

/**
 * Creates a configured Apollo Client for testing
 * Mirrors production setup: cacheKeyLink → errorLink → httpLink
 */
function createTestApolloClient() {
  const cacheKeyLink = new ApolloLink((operation, forward) => {
    const { cacheKey } = operation.getContext()
    if (cacheKey) {
      operation.extensions = { ...operation.extensions, cacheKey }
    }
    return forward(operation)
  })

  const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
      graphQLErrors.forEach(({ message }) => {
        console.error(`[GraphQL error]: ${message}`)
      })
    }
    if (networkError) {
      console.error(`[Network error]: ${networkError}`)
    }
  })

  const httpLink = createHttpLink({
    uri: '/api/github-proxy',
    includeExtensions: true,
    fetch: (uri, options) => {
      const body = JSON.parse(options?.body as string || '{}')
      const extensions = body.extensions || {}
      const cacheKey = extensions.cacheKey

      const newBody = {
        query: body.query,
        variables: body.variables,
        ...(cacheKey && { cacheKey }),
      }

      return fetch(uri, {
        ...options,
        body: JSON.stringify(newBody),
      })
    },
  })

  const link = ApolloLink.from([cacheKeyLink, errorLink, httpLink])

  return new ApolloClient({
    link,
    cache: new InMemoryCache(),
  })
}

/**
 * Creates mock user data for tests
 */
function createMockUserData(overrides = {}) {
  return {
    data: {
      user: {
        id: 'U_123',
        login: 'testuser',
        name: 'Test User',
        avatarUrl: 'https://example.com/avatar.jpg',
        bio: 'Test bio',
        followers: { totalCount: 100 },
        following: { totalCount: 50 },
        ...overrides,
      },
    },
  }
}

/**
 * Creates successful HTTP response mock
 */
function createSuccessResponse(data: unknown) {
  return {
    ok: true,
    status: 200,
    text: async () => JSON.stringify(data),
    json: async () => data,
  }
}

/**
 * Creates error HTTP response mock
 */
function createErrorResponse(status: number, error: unknown) {
  return {
    ok: false,
    status,
    statusText: status === 500 ? 'Internal Server Error' : 'Unauthorized',
    text: async () => JSON.stringify(error),
    json: async () => error,
  }
}

describe('Apollo Client + GitHub Proxy Integration', () => {
  let fetchMock: ReturnType<typeof vi.fn>
  let client: ApolloClient<unknown>

  beforeEach(() => {
    // Arrange: Setup fresh mocks and client for each test
    fetchMock = vi.fn()
    global.fetch = fetchMock
    client = createTestApolloClient()
  })

  describe('User Search Scenarios', () => {
    const USER_QUERY = gql`
      query GetUser($login: String!) {
        user(login: $login) {
          id
          login
          name
          avatarUrl
          bio
          followers {
            totalCount
          }
          following {
            totalCount
          }
        }
      }
    `

    it('should successfully fetch and display user data', async () => {
      // Arrange: Mock successful API response
      const mockData = createMockUserData()
      fetchMock.mockResolvedValueOnce(createSuccessResponse(mockData))

      // Act: Query for user
      const result = await client.query({
        query: USER_QUERY,
        variables: { login: 'testuser' },
      })

      // Assert: User receives expected data
      expect(result.data.user.login).toBe('testuser')
      expect(result.data.user.name).toBe('Test User')
      expect(result.data.user.followers.totalCount).toBe(100)
      expect(result.error).toBeUndefined()
    })

    it('should handle user not found scenario', async () => {
      // Arrange: Mock GraphQL error response
      const mockError = {
        errors: [
          {
            message: 'Could not resolve to a User with the login of "nonexistentuser".',
            type: 'NOT_FOUND',
            path: ['user'],
          },
        ],
        data: null,
      }
      fetchMock.mockResolvedValueOnce(createSuccessResponse(mockError))

      // Act: Query for non-existent user
      const result = await client.query({
        query: USER_QUERY,
        variables: { login: 'nonexistentuser' },
        errorPolicy: 'all',
      })

      // Assert: User sees appropriate error message
      expect(result.errors).toBeDefined()
      expect(result.errors?.[0].message).toContain('Could not resolve to a User')
      expect(result.data).toBeNull()
    })

    it('should fetch user with contributions statistics', async () => {
      // Arrange: Mock user data with contribution stats
      const mockData = {
        data: {
          user: {
            login: 'testuser',
            contributionsCollection: {
              totalCommitContributions: 250,
            },
          },
        },
      }
      fetchMock.mockResolvedValueOnce(createSuccessResponse(mockData))

      const CONTRIBUTIONS_QUERY = gql`
        query GetUserContributions(
          $login: String!
          $from: DateTime!
          $to: DateTime!
        ) {
          user(login: $login) {
            login
            contributionsCollection(from: $from, to: $to) {
              totalCommitContributions
            }
          }
        }
      `

      // Act: Query for user with date range
      const result = await client.query({
        query: CONTRIBUTIONS_QUERY,
        variables: {
          login: 'testuser',
          from: '2024-01-01T00:00:00Z',
          to: '2024-12-31T23:59:59Z',
        },
      })

      // Assert: User sees contribution statistics
      expect(result.data.user.contributionsCollection.totalCommitContributions).toBe(250)
    })
  })

  describe('Error Scenarios - User Experience', () => {
    const SIMPLE_QUERY = gql`
      query GetUser($login: String!) {
        user(login: $login) {
          login
        }
      }
    `

    it('should inform user when API is unavailable', async () => {
      // Arrange: Mock server error
      fetchMock.mockResolvedValueOnce(
        createErrorResponse(500, { error: 'Internal Server Error' })
      )

      // Act & Assert: User sees error
      await expect(
        client.query({
          query: SIMPLE_QUERY,
          variables: { login: 'testuser' },
        })
      ).rejects.toThrow()
    })

    it('should inform user when authentication fails', async () => {
      // Arrange: Mock authentication error
      fetchMock.mockResolvedValueOnce(
        createErrorResponse(401, { error: 'GITHUB_TOKEN not configured' })
      )

      // Act & Assert: User sees authentication error
      await expect(
        client.query({
          query: SIMPLE_QUERY,
          variables: { login: 'testuser' },
        })
      ).rejects.toThrow()
    })

    it('should handle network connectivity issues', async () => {
      // Arrange: Mock network failure
      fetchMock.mockRejectedValueOnce(new Error('Network request failed'))

      // Act & Assert: User sees network error
      await expect(
        client.query({
          query: SIMPLE_QUERY,
          variables: { login: 'testuser' },
        })
      ).rejects.toThrow('Network request failed')
    })

    it('should handle invalid server responses gracefully', async () => {
      // Arrange: Mock malformed JSON response
      fetchMock.mockResolvedValueOnce({
        ok: true,
        status: 200,
        text: async () => 'Invalid JSON{{{',
        json: async () => {
          throw new SyntaxError('Unexpected token')
        },
      })

      // Act & Assert: User sees error instead of crash
      await expect(
        client.query({
          query: SIMPLE_QUERY,
          variables: { login: 'testuser' },
        })
      ).rejects.toThrow()
    })
  })

  describe('Performance - Caching Behavior', () => {
    const CACHE_QUERY = gql`
      query GetUser($login: String!) {
        user(login: $login) {
          login
          name
        }
      }
    `

    it('should use Apollo cache for repeated queries to improve performance', async () => {
      // Arrange: Mock successful response
      const mockData = createMockUserData({ login: 'testuser', name: 'Test' })
      fetchMock.mockResolvedValue(createSuccessResponse(mockData))

      // Act: Query same data twice
      await client.query({
        query: CACHE_QUERY,
        variables: { login: 'testuser' },
      })

      await client.query({
        query: CACHE_QUERY,
        variables: { login: 'testuser' },
        fetchPolicy: 'cache-first',
      })

      // Assert: Network called only once (second request uses cache)
      expect(fetchMock).toHaveBeenCalledTimes(1)
    })

    it('should bypass cache when user requests fresh data', async () => {
      // Arrange: Mock successful response
      const mockData = createMockUserData({ login: 'testuser', name: 'Test' })
      fetchMock.mockResolvedValue(createSuccessResponse(mockData))

      // Act: Query with cache, then force fresh data
      await client.query({
        query: CACHE_QUERY,
        variables: { login: 'testuser' },
      })

      await client.query({
        query: CACHE_QUERY,
        variables: { login: 'testuser' },
        fetchPolicy: 'network-only', // User wants fresh data
      })

      // Assert: Network called twice (cache bypassed)
      expect(fetchMock).toHaveBeenCalledTimes(2)
    })

    it('should support backend caching via cacheKey for faster responses', async () => {
      // Arrange: Mock successful response
      const mockData = createMockUserData()
      fetchMock.mockResolvedValueOnce(createSuccessResponse(mockData))

      // Act: Query with cacheKey (enables server-side caching)
      await client.query({
        query: CACHE_QUERY,
        variables: { login: 'testuser' },
        context: { cacheKey: 'user:testuser:profile' },
      })

      // Assert: Request includes cacheKey for backend optimization
      const requestBody = JSON.parse(fetchMock.mock.calls[0][1].body)
      expect(requestBody.cacheKey).toBe('user:testuser:profile')
    })
  })

  describe('Data Integrity', () => {
    it('should not corrupt data during transmission', async () => {
      // Arrange: Mock complex data structure
      const complexData = {
        data: {
          user: {
            login: 'testuser',
            repositories: {
              nodes: [
                { name: 'repo1', stargazerCount: 100 },
                { name: 'repo2', stargazerCount: 200 },
              ],
            },
          },
        },
      }
      fetchMock.mockResolvedValueOnce(createSuccessResponse(complexData))

      const REPOS_QUERY = gql`
        query GetRepos($login: String!) {
          user(login: $login) {
            login
            repositories {
              nodes {
                name
                stargazerCount
              }
            }
          }
        }
      `

      // Act: Fetch complex nested data
      const result = await client.query({
        query: REPOS_QUERY,
        variables: { login: 'testuser' },
      })

      // Assert: All data received correctly
      expect(result.data.user.repositories.nodes).toHaveLength(2)
      expect(result.data.user.repositories.nodes[0].name).toBe('repo1')
      expect(result.data.user.repositories.nodes[0].stargazerCount).toBe(100)
      expect(result.data.user.repositories.nodes[1].name).toBe('repo2')
      expect(result.data.user.repositories.nodes[1].stargazerCount).toBe(200)
    })
  })
})
