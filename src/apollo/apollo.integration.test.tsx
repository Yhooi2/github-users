/**
 * Integration tests for Apollo Client + GitHub Proxy End-to-End Flow
 *
 * These tests verify the complete request flow:
 * 1. Apollo Client sends GraphQL query
 * 2. Request goes through cacheKeyLink → errorLink → httpLink
 * 3. Custom fetch sends request to /api/github-proxy
 * 4. Mock proxy returns response
 * 5. Apollo Client receives and processes data
 *
 * Tests cover:
 * - Successful requests with correct data structure
 * - Error handling (GraphQL errors, network errors)
 * - Request/response format validation
 * - Variable passing and cacheKey handling
 *
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { ApolloClient, InMemoryCache, gql, createHttpLink, ApolloLink } from '@apollo/client'
import { onError } from '@apollo/client/link/error'

// Mock toast to prevent errors in tests
vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}))

describe('Apollo Client + GitHub Proxy Integration', () => {
  let fetchMock: ReturnType<typeof vi.fn>
  let client: ApolloClient<unknown>

  beforeEach(() => {
    // Setup fetch mock
    fetchMock = vi.fn()
    global.fetch = fetchMock

    // Setup Apollo Client with same link chain as production
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

    client = new ApolloClient({
      link,
      cache: new InMemoryCache(),
    })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('Successful Requests', () => {
    it('should successfully fetch user data through proxy', async () => {
      const mockUserData = {
        data: {
          user: {
            id: 'U_123',
            login: 'testuser',
            name: 'Test User',
            avatarUrl: 'https://example.com/avatar.jpg',
            bio: 'Test bio',
            followers: { totalCount: 100 },
            following: { totalCount: 50 },
          },
        },
      }

      fetchMock.mockResolvedValueOnce({
        ok: true,
        status: 200,
        text: async () => JSON.stringify(mockUserData),
        json: async () => mockUserData,
      })

      const TEST_QUERY = gql`
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

      const result = await client.query({
        query: TEST_QUERY,
        variables: { login: 'testuser' },
      })

      // Verify request was made to proxy
      expect(fetchMock).toHaveBeenCalledTimes(1)
      expect(fetchMock.mock.calls[0][0]).toBe('/api/github-proxy')

      // Verify request structure
      const requestBody = JSON.parse(fetchMock.mock.calls[0][1].body)
      expect(requestBody).toHaveProperty('query')
      expect(requestBody).toHaveProperty('variables')
      expect(requestBody.variables).toEqual({ login: 'testuser' })

      // Verify response data
      expect(result.data).toEqual(mockUserData.data)
      expect(result.error).toBeUndefined()
      expect(result.data.user.login).toBe('testuser')
      expect(result.data.user.followers.totalCount).toBe(100)
    })

    it('should pass cacheKey to proxy for caching', async () => {
      const mockData = {
        data: { user: { login: 'testuser', name: 'Test' } },
      }

      fetchMock.mockResolvedValueOnce({
        ok: true,
        status: 200,
        text: async () => JSON.stringify(mockData),
        json: async () => mockData,
      })

      const TEST_QUERY = gql`
        query GetUser($login: String!) {
          user(login: $login) {
            login
            name
          }
        }
      `

      await client.query({
        query: TEST_QUERY,
        variables: { login: 'testuser' },
        context: { cacheKey: 'user:testuser:profile' },
      })

      // Verify cacheKey was passed to proxy
      const requestBody = JSON.parse(fetchMock.mock.calls[0][1].body)
      expect(requestBody).toHaveProperty('cacheKey', 'user:testuser:profile')
    })

    it('should handle requests with multiple variables', async () => {
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

      fetchMock.mockResolvedValueOnce({
        ok: true,
        status: 200,
        text: async () => JSON.stringify(mockData),
        json: async () => mockData,
      })

      const TEST_QUERY = gql`
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

      const variables = {
        login: 'testuser',
        from: '2024-01-01T00:00:00Z',
        to: '2024-12-31T23:59:59Z',
      }

      const result = await client.query({
        query: TEST_QUERY,
        variables,
      })

      // Verify all variables were passed
      const requestBody = JSON.parse(fetchMock.mock.calls[0][1].body)
      expect(requestBody.variables).toEqual(variables)

      // Verify response
      expect(result.data.user.contributionsCollection.totalCommitContributions).toBe(250)
    })

    it('should handle requests without cacheKey', async () => {
      const mockData = {
        data: { user: { login: 'testuser' } },
      }

      fetchMock.mockResolvedValueOnce({
        ok: true,
        status: 200,
        text: async () => JSON.stringify(mockData),
        json: async () => mockData,
      })

      const TEST_QUERY = gql`
        query GetUser($login: String!) {
          user(login: $login) {
            login
          }
        }
      `

      await client.query({
        query: TEST_QUERY,
        variables: { login: 'testuser' },
        // NO context.cacheKey
      })

      // Verify cacheKey is not in request
      const requestBody = JSON.parse(fetchMock.mock.calls[0][1].body)
      expect(requestBody).not.toHaveProperty('cacheKey')
    })
  })

  describe('Error Handling', () => {
    it('should handle GraphQL errors from GitHub API', async () => {
      const mockErrorResponse = {
        errors: [
          {
            message: 'Could not resolve to a User with the login of "nonexistentuser".',
            type: 'NOT_FOUND',
            path: ['user'],
          },
        ],
        data: null,
      }

      fetchMock.mockResolvedValueOnce({
        ok: true, // HTTP 200 but with GraphQL errors
        status: 200,
        text: async () => JSON.stringify(mockErrorResponse),
        json: async () => mockErrorResponse,
      })

      const TEST_QUERY = gql`
        query GetUser($login: String!) {
          user(login: $login) {
            login
          }
        }
      `

      const result = await client.query({
        query: TEST_QUERY,
        variables: { login: 'nonexistentuser' },
        errorPolicy: 'all', // Return both data and errors
      })

      // Verify GraphQL errors are returned
      expect(result.errors).toBeDefined()
      expect(result.errors).toHaveLength(1)
      expect(result.errors?.[0].message).toContain('Could not resolve to a User')
      expect(result.data).toBeNull()
    })

    it('should handle network errors (500 Internal Server Error)', async () => {
      fetchMock.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        text: async () => JSON.stringify({ error: 'Internal Server Error' }),
        json: async () => ({ error: 'Internal Server Error' }),
      })

      const TEST_QUERY = gql`
        query GetUser($login: String!) {
          user(login: $login) {
            login
          }
        }
      `

      try {
        await client.query({
          query: TEST_QUERY,
          variables: { login: 'testuser' },
        })
        // Should not reach here
        expect(true).toBe(false)
      } catch (error) {
        // Verify network error is thrown
        expect(error).toBeDefined()
        expect(String(error)).toContain('500')
      }
    })

    it('should handle authentication errors (401 Unauthorized)', async () => {
      fetchMock.mockResolvedValueOnce({
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
        text: async () => JSON.stringify({ error: 'GITHUB_TOKEN not configured' }),
        json: async () => ({ error: 'GITHUB_TOKEN not configured' }),
      })

      const TEST_QUERY = gql`
        query GetUser($login: String!) {
          user(login: $login) {
            login
          }
        }
      `

      try {
        await client.query({
          query: TEST_QUERY,
          variables: { login: 'testuser' },
        })
        expect(true).toBe(false)
      } catch (error) {
        expect(error).toBeDefined()
        expect(String(error)).toContain('401')
      }
    })

    it('should handle network timeouts', async () => {
      fetchMock.mockRejectedValueOnce(new Error('Network request failed'))

      const TEST_QUERY = gql`
        query GetUser($login: String!) {
          user(login: $login) {
            login
          }
        }
      `

      try {
        await client.query({
          query: TEST_QUERY,
          variables: { login: 'testuser' },
        })
        expect(true).toBe(false)
      } catch (error) {
        expect(error).toBeDefined()
        expect(String(error)).toContain('Network request failed')
      }
    })

    it('should handle malformed JSON responses', async () => {
      fetchMock.mockResolvedValueOnce({
        ok: true,
        status: 200,
        text: async () => 'Invalid JSON{{{',
        json: async () => {
          throw new SyntaxError('Unexpected token')
        },
      })

      const TEST_QUERY = gql`
        query GetUser($login: String!) {
          user(login: $login) {
            login
          }
        }
      `

      try {
        await client.query({
          query: TEST_QUERY,
          variables: { login: 'testuser' },
        })
        expect(true).toBe(false)
      } catch (error) {
        expect(error).toBeDefined()
      }
    })
  })

  describe('Request Format Validation', () => {
    it('should send POST requests to proxy', async () => {
      const mockData = { data: { user: { login: 'test' } } }
      fetchMock.mockResolvedValueOnce({
        ok: true,
        status: 200,
        text: async () => JSON.stringify(mockData),
        json: async () => mockData,
      })

      const TEST_QUERY = gql`
        query GetUser($login: String!) {
          user(login: $login) {
            login
          }
        }
      `

      await client.query({
        query: TEST_QUERY,
        variables: { login: 'test' },
      })

      // Verify POST method
      expect(fetchMock.mock.calls[0][1].method).toBe('POST')
    })

    it('should include correct Content-Type header', async () => {
      const mockData = { data: { user: { login: 'test' } } }
      fetchMock.mockResolvedValueOnce({
        ok: true,
        status: 200,
        text: async () => JSON.stringify(mockData),
        json: async () => mockData,
      })

      const TEST_QUERY = gql`
        query GetUser($login: String!) {
          user(login: $login) {
            login
          }
        }
      `

      await client.query({
        query: TEST_QUERY,
        variables: { login: 'test' },
      })

      // Verify Content-Type header
      const headers = fetchMock.mock.calls[0][1].headers
      expect(headers['content-type']).toBe('application/json')
    })

    it('should format request body correctly', async () => {
      const mockData = { data: { user: { login: 'test' } } }
      fetchMock.mockResolvedValueOnce({
        ok: true,
        status: 200,
        text: async () => JSON.stringify(mockData),
        json: async () => mockData,
      })

      const TEST_QUERY = gql`
        query GetUser($login: String!) {
          user(login: $login) {
            login
          }
        }
      `

      await client.query({
        query: TEST_QUERY,
        variables: { login: 'test' },
        context: { cacheKey: 'user:test:profile' },
      })

      const requestBody = JSON.parse(fetchMock.mock.calls[0][1].body)

      // Verify body structure
      expect(requestBody).toHaveProperty('query')
      expect(requestBody).toHaveProperty('variables')
      expect(requestBody).toHaveProperty('cacheKey')
      expect(typeof requestBody.query).toBe('string')
      expect(typeof requestBody.variables).toBe('object')
      expect(typeof requestBody.cacheKey).toBe('string')
    })

    it('should not include circular references in request', async () => {
      const mockData = { data: { user: { login: 'test' } } }
      fetchMock.mockResolvedValueOnce({
        ok: true,
        status: 200,
        text: async () => JSON.stringify(mockData),
        json: async () => mockData,
      })

      const TEST_QUERY = gql`
        query GetUser($login: String!) {
          user(login: $login) {
            login
          }
        }
      `

      await client.query({
        query: TEST_QUERY,
        variables: { login: 'test' },
      })

      // Verify request body can be parsed (no circular structure)
      expect(() => {
        const requestBody = fetchMock.mock.calls[0][1].body
        JSON.parse(requestBody)
      }).not.toThrow()
    })
  })

  describe('Cache Behavior', () => {
    it('should use Apollo Client cache for repeated queries', async () => {
      const mockData = {
        data: { user: { login: 'testuser', name: 'Test' } },
      }

      fetchMock.mockResolvedValue({
        ok: true,
        status: 200,
        text: async () => JSON.stringify(mockData),
        json: async () => mockData,
      })

      const TEST_QUERY = gql`
        query GetUser($login: String!) {
          user(login: $login) {
            login
            name
          }
        }
      `

      // First query - should hit network
      await client.query({
        query: TEST_QUERY,
        variables: { login: 'testuser' },
      })

      expect(fetchMock).toHaveBeenCalledTimes(1)

      // Second query with same variables - should use cache
      await client.query({
        query: TEST_QUERY,
        variables: { login: 'testuser' },
        fetchPolicy: 'cache-first', // Default policy
      })

      // Should still be 1 call (cache hit)
      expect(fetchMock).toHaveBeenCalledTimes(1)
    })

    it('should bypass cache when fetchPolicy is network-only', async () => {
      const mockData = {
        data: { user: { login: 'testuser', name: 'Test' } },
      }

      fetchMock.mockResolvedValue({
        ok: true,
        status: 200,
        text: async () => JSON.stringify(mockData),
        json: async () => mockData,
      })

      const TEST_QUERY = gql`
        query GetUser($login: String!) {
          user(login: $login) {
            login
            name
          }
        }
      `

      // First query
      await client.query({
        query: TEST_QUERY,
        variables: { login: 'testuser' },
      })

      expect(fetchMock).toHaveBeenCalledTimes(1)

      // Second query with network-only - should hit network again
      await client.query({
        query: TEST_QUERY,
        variables: { login: 'testuser' },
        fetchPolicy: 'network-only',
      })

      // Should be 2 calls (bypassed cache)
      expect(fetchMock).toHaveBeenCalledTimes(2)
    })
  })
})
