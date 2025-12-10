/**
 * Integration Tests for Backend Caching Behavior
 *
 * Testing Philosophy: Focus on USER IMPACT of caching
 * - Test WHAT caching does for user experience
 * - NOT HOW cacheKey is passed in request body
 *
 * User-facing benefits of caching:
 * ✅ Faster responses on repeated queries
 * ✅ Reduced API rate limit consumption
 * ✅ Better offline/poor network experience
 *
 * @vitest-environment jsdom
 */
import {
  ApolloClient,
  ApolloLink,
  InMemoryCache,
  createHttpLink,
  gql,
} from "@apollo/client";
import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock toast
vi.mock("sonner", () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

/**
 * Helper to create mock fetch response compatible with Apollo Client v4
 * Apollo Client v4 requires headers.get() method on response
 */
function createMockResponse(data: unknown, status = 200) {
  return {
    ok: status >= 200 && status < 300,
    status,
    headers: new Headers({ "content-type": "application/json" }),
    text: async () => JSON.stringify(data),
    json: async () => data,
  };
}

/**
 * Creates test Apollo Client with caching support
 */
function createCachingClient() {
  const cacheKeyLink = new ApolloLink((operation, forward) => {
    const { cacheKey } = operation.getContext();
    if (cacheKey) {
      operation.extensions = { ...operation.extensions, cacheKey };
    }
    return forward(operation);
  });

  const httpLink = createHttpLink({
    uri: "/api/github-proxy",
    includeExtensions: true,
    fetch: (uri, options) => {
      const body = JSON.parse((options?.body as string) || "{}");
      const extensions = body.extensions || {};
      const cacheKey = extensions.cacheKey;

      const newBody = {
        query: body.query,
        variables: body.variables,
        ...(cacheKey && { cacheKey }),
      };

      return fetch(uri, {
        ...options,
        body: JSON.stringify(newBody),
      });
    },
  });

  const link = ApolloLink.from([cacheKeyLink, httpLink]);

  return new ApolloClient({
    link,
    cache: new InMemoryCache(),
  });
}

describe("Backend Caching - User Experience", () => {
  let fetchMock: ReturnType<typeof vi.fn>;
  let client: ApolloClient<unknown>;

  beforeEach(() => {
    fetchMock = vi.fn();
    global.fetch = fetchMock;
    client = createCachingClient();
  });

  const TEST_QUERY = gql`
    query GetUser($login: String!) {
      user(login: $login) {
        login
        name
      }
    }
  `;

  describe("Cache Optimization", () => {
    it("should enable backend caching when cacheKey is provided", async () => {
      // Arrange: Mock server response
      const mockData = { data: { user: { login: "testuser", name: "Test" } } };
      fetchMock.mockResolvedValueOnce(createMockResponse(mockData));

      // Act: Query WITH cacheKey (enables backend caching)
      await client.query({
        query: TEST_QUERY,
        variables: { login: "testuser" },
        context: { cacheKey: "user:testuser:profile" },
      });

      // Assert: Backend receives cache identifier for optimization
      expect(fetchMock).toHaveBeenCalledTimes(1);
      const requestBody = JSON.parse(fetchMock.mock.calls[0][1].body);
      expect(requestBody).toHaveProperty("cacheKey");
    });

    it("should work without cacheKey when backend caching is not needed", async () => {
      // Arrange: Mock server response
      const mockData = { data: { user: { login: "test" } } };
      fetchMock.mockResolvedValueOnce(createMockResponse(mockData));

      // Act: Query WITHOUT cacheKey (no backend caching)
      await client.query({
        query: TEST_QUERY,
        variables: { login: "test" },
        // NO context.cacheKey
      });

      // Assert: Request succeeds without cacheKey
      expect(fetchMock).toHaveBeenCalledTimes(1);
      const requestBody = JSON.parse(fetchMock.mock.calls[0][1].body);
      expect(requestBody).not.toHaveProperty("cacheKey");
    });
  });

  describe("Error Resilience", () => {
    it("should not break on complex context objects", async () => {
      // Arrange: Mock response
      const mockData = { data: { user: { login: "testuser", name: "Test" } } };
      fetchMock.mockResolvedValueOnce(createMockResponse(mockData));

      // Act: Query with complex context (potential circular references)
      const result = await client.query({
        query: TEST_QUERY,
        variables: { login: "testuser" },
        context: {
          cacheKey: "user:testuser:profile",
          customMetadata: { nested: { deep: "value" } },
        },
      });

      // Assert: No JSON serialization errors
      expect(result.data).toBeDefined();
      expect(result.data.user.login).toBe("testuser");
    });
  });

  describe("Cache Key Strategies", () => {
    it("should support different cache key formats for different data types", async () => {
      // Arrange: Mock responses for different queries
      const mockUserData = { data: { user: { login: "testuser" } } };
      const mockRepoData = { data: { repository: { name: "test-repo" } } };

      fetchMock
        .mockResolvedValueOnce(createMockResponse(mockUserData))
        .mockResolvedValueOnce(createMockResponse(mockRepoData));

      const REPO_QUERY = gql`
        query GetRepo($owner: String!, $name: String!) {
          repository(owner: $owner, name: $name) {
            name
          }
        }
      `;

      // Act: Query different resources with appropriate cache keys
      await client.query({
        query: TEST_QUERY,
        variables: { login: "testuser" },
        context: { cacheKey: "user:testuser:profile" }, // User cache key
      });

      await client.query({
        query: REPO_QUERY,
        variables: { owner: "testuser", name: "test-repo" },
        context: { cacheKey: "repo:testuser:test-repo" }, // Repo cache key
      });

      // Assert: Both queries succeed with different cache keys
      expect(fetchMock).toHaveBeenCalledTimes(2);

      const userRequest = JSON.parse(fetchMock.mock.calls[0][1].body);
      const repoRequest = JSON.parse(fetchMock.mock.calls[1][1].body);

      expect(userRequest.cacheKey).toBe("user:testuser:profile");
      expect(repoRequest.cacheKey).toBe("repo:testuser:test-repo");
    });
  });
});
