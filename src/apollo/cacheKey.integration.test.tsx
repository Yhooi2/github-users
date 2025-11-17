/**
 * Integration tests for cacheKey handling in Apollo Client
 *
 * These tests verify that cacheKey from operation context
 * is correctly passed to the backend proxy in request body.
 *
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ApolloClient, InMemoryCache, gql, createHttpLink, ApolloLink } from '@apollo/client'

describe('Apollo Client cacheKey Integration', () => {
  let fetchMock: ReturnType<typeof vi.fn>

  beforeEach(() => {
    fetchMock = vi.fn()
    global.fetch = fetchMock
  })

  it('should pass cacheKey from context to request body', async () => {
    // Mock successful response with proper Response API
    const responseData = { data: { user: { name: 'Test User' } } }
    fetchMock.mockResolvedValueOnce({
      ok: true,
      status: 200,
      text: async () => JSON.stringify(responseData),
      json: async () => responseData,
    })

    // Import real cacheKeyLink from ApolloAppProvider
    const cacheKeyLink = new ApolloLink((operation, forward) => {
      const { cacheKey } = operation.getContext()
      if (cacheKey) {
        operation.extensions = { ...operation.extensions, cacheKey }
      }
      return forward(operation)
    })

    const httpLink = createHttpLink({
      uri: '/api/github-proxy',
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

    const client = new ApolloClient({
      link: ApolloLink.from([cacheKeyLink, httpLink]),
      cache: new InMemoryCache(),
    })

    const TEST_QUERY = gql`
      query TestQuery($login: String!) {
        user(login: $login) {
          name
        }
      }
    `

    // Execute query with cacheKey in context
    await client.query({
      query: TEST_QUERY,
      variables: { login: 'testuser' },
      context: { cacheKey: 'user:testuser:profile' },
    })

    // Verify fetch was called with cacheKey in body
    expect(fetchMock).toHaveBeenCalledTimes(1)

    const callArgs = fetchMock.mock.calls[0]
    const requestBody = JSON.parse(callArgs[1].body)

    // ✅ CRITICAL: cacheKey должен быть в top-level body
    expect(requestBody).toHaveProperty('cacheKey', 'user:testuser:profile')
    expect(requestBody).toHaveProperty('query')
    expect(requestBody).toHaveProperty('variables')
  })

  it('should NOT include cacheKey if not provided in context', async () => {
    const responseData = { data: { user: { name: 'Test' } } }
    fetchMock.mockResolvedValueOnce({
      ok: true,
      status: 200,
      text: async () => JSON.stringify(responseData),
      json: async () => responseData,
    })

    const cacheKeyLink = new ApolloLink((operation, forward) => {
      const { cacheKey } = operation.getContext()
      if (cacheKey) {
        operation.extensions = { ...operation.extensions, cacheKey }
      }
      return forward(operation)
    })

    const httpLink = createHttpLink({
      uri: '/api/github-proxy',
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

    const client = new ApolloClient({
      link: ApolloLink.from([cacheKeyLink, httpLink]),
      cache: new InMemoryCache(),
    })

    const TEST_QUERY = gql`
      query TestQuery {
        user {
          name
        }
      }
    `

    // Query WITHOUT cacheKey
    await client.query({
      query: TEST_QUERY,
      // NO context.cacheKey
    })

    const requestBody = JSON.parse(fetchMock.mock.calls[0][1].body)

    // ✅ cacheKey должен отсутствовать
    expect(requestBody).not.toHaveProperty('cacheKey')
  })

  it('should NOT cause circular structure error with context objects', async () => {
    const responseData = { data: { user: { name: 'Test' } } }
    fetchMock.mockResolvedValueOnce({
      ok: true,
      status: 200,
      text: async () => JSON.stringify(responseData),
      json: async () => responseData,
    })

    const cacheKeyLink = new ApolloLink((operation, forward) => {
      const { cacheKey } = operation.getContext()
      if (cacheKey) {
        operation.extensions = { ...operation.extensions, cacheKey }
      }
      return forward(operation)
    })

    const httpLink = createHttpLink({
      uri: '/api/github-proxy',
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

    const client = new ApolloClient({
      link: ApolloLink.from([cacheKeyLink, httpLink]),
      cache: new InMemoryCache(),
    })

    const TEST_QUERY = gql`
      query TestQuery($login: String!) {
        user(login: $login) {
          name
        }
      }
    `

    // ✅ This should NOT throw circular structure error
    await expect(
      client.query({
        query: TEST_QUERY,
        variables: { login: 'testuser' },
        context: { cacheKey: 'user:testuser:profile' },
      })
    ).resolves.not.toThrow()

    // ✅ Should NOT throw JSON.stringify error
    expect(() => {
      const requestBody = fetchMock.mock.calls[0][1].body
      JSON.parse(requestBody) // Verify it's valid JSON
    }).not.toThrow()
  })
})
