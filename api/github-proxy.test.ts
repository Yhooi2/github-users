import type { VercelRequest, VercelResponse } from "@vercel/node";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Setup environment BEFORE importing handler
// This is critical because github-proxy.ts checks KV config at module level
process.env.KV_REST_API_URL = "http://kv.test";
process.env.KV_REST_API_TOKEN = "kv_token";
process.env.GITHUB_TOKEN = "demo_token_123";

// Mock @vercel/kv BEFORE importing handler
vi.mock("@vercel/kv", () => ({
  kv: {
    get: vi.fn(),
    set: vi.fn(),
    del: vi.fn(),
  },
}));

// Dynamic import handler after env vars and mocks are set up
const handlerModule = await import("./github-proxy.js");
const handler = handlerModule.default;

// Import mocked kv
import { kv } from "@vercel/kv";

/**
 * Helper function to create proper Response mock
 */
function createMockResponse(
  data: any,
  headers: Record<string, string> = {},
  options: { ok?: boolean; status?: number; statusText?: string } = {},
): Response {
  const headersObj = new Headers(headers);

  return {
    ok: options.ok ?? true,
    status: options.status ?? 200,
    statusText: options.statusText ?? "OK",
    redirected: false,
    type: "basic" as ResponseType,
    url: "https://api.github.com/graphql",
    headers: headersObj,
    json: async () => data,
    text: async () => JSON.stringify(data),
    blob: async () => new Blob([JSON.stringify(data)]),
    arrayBuffer: async () => new ArrayBuffer(0),
    formData: async () => new FormData(),
    clone: function () {
      return this;
    },
    body: null,
    bodyUsed: false,
  } as Response;
}

/**
 * Default rate limit headers
 */
const DEFAULT_RATE_LIMIT_HEADERS = {
  "X-RateLimit-Remaining": "5000",
  "X-RateLimit-Limit": "5000",
  "X-RateLimit-Reset": "1234567890",
  "X-RateLimit-Used": "0",
};

describe("GitHub Proxy with OAuth Support", () => {
  let req: Partial<VercelRequest>;
  let res: Partial<VercelResponse>;
  let originalEnv: NodeJS.ProcessEnv;
  let originalFetch: typeof global.fetch;

  beforeEach(() => {
    // Save originals
    originalEnv = { ...process.env };
    originalFetch = global.fetch;

    // Setup environment
    process.env.GITHUB_TOKEN = "demo_token_123";
    process.env.KV_REST_API_URL = "http://kv.test";
    process.env.KV_REST_API_TOKEN = "kv_token";

    // Create mock request
    req = {
      method: "POST",
      body: {
        query: "query { viewer { login } }",
        variables: {},
        cacheKey: "test-key",
      },
      headers: {},
    };

    // Create mock response
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    // Mock fetch
    global.fetch = vi.fn();
  });

  afterEach(() => {
    // Restore
    process.env = originalEnv;
    global.fetch = originalFetch;
    vi.clearAllMocks();
  });

  describe("Demo Mode (Unauthenticated)", () => {
    it("должен использовать GITHUB_TOKEN для неавторизованных", async () => {
      req.headers = {};

      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue(
        createMockResponse(
          { data: { viewer: { login: "testuser" } } },
          DEFAULT_RATE_LIMIT_HEADERS,
        ),
      );

      vi.mocked(kv.get).mockResolvedValue(null);
      vi.mocked(kv.set).mockResolvedValue("OK");

      await handler(req as VercelRequest, res as VercelResponse);

      // Verify demo token used
      expect(global.fetch).toHaveBeenCalledWith(
        "https://api.github.com/graphql",
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: "Bearer demo_token_123",
          }),
        }),
      );

      // Verify response includes isDemo flag
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.any(Object),
          rateLimit: expect.objectContaining({
            isDemo: true,
            remaining: 5000,
            limit: 5000,
          }),
        }),
      );
    });

    it("должен кешировать с префиксом demo:", async () => {
      req.headers = {};

      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue(
        createMockResponse({ data: "test" }, DEFAULT_RATE_LIMIT_HEADERS),
      );

      vi.mocked(kv.get).mockResolvedValue(null);
      vi.mocked(kv.set).mockResolvedValue("OK");

      await handler(req as VercelRequest, res as VercelResponse);

      // Verify demo cache key
      expect(kv.set).toHaveBeenCalledWith(
        "demo:test-key",
        expect.any(Object),
        { ex: 1800 }, // 30 minutes for demo
      );
    });
  });

  describe("OAuth Mode (Authenticated)", () => {
    it("должен использовать user token для авторизованных", async () => {
      const mockSession = {
        userId: 123,
        login: "authuser",
        avatarUrl: "http://example.com/avatar.png",
        accessToken: "user_token_456",
        createdAt: Date.now(),
      };

      req.headers = { cookie: "session=valid_session_id" };

      vi.mocked(kv.get)
        .mockResolvedValueOnce(mockSession) // Session lookup
        .mockResolvedValueOnce(null); // Cache miss

      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue(
        createMockResponse(
          { data: "test" },
          {
            "X-RateLimit-Remaining": "4999",
            "X-RateLimit-Limit": "5000",
            "X-RateLimit-Reset": "1234567890",
            "X-RateLimit-Used": "1",
          },
        ),
      );

      vi.mocked(kv.set).mockResolvedValue("OK");

      await handler(req as VercelRequest, res as VercelResponse);

      // Verify user token used
      expect(global.fetch).toHaveBeenCalledWith(
        "https://api.github.com/graphql",
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: "Bearer user_token_456",
          }),
        }),
      );

      // Verify response includes user info
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          rateLimit: expect.objectContaining({
            isDemo: false,
            userLogin: "authuser",
          }),
        }),
      );
    });

    it("должен кешировать с префиксом user:session:", async () => {
      const mockSession = {
        userId: 123,
        login: "authuser",
        avatarUrl: "http://example.com/avatar.png",
        accessToken: "user_token",
        createdAt: Date.now(),
      };

      req.headers = { cookie: "session=session123" };

      vi.mocked(kv.get)
        .mockResolvedValueOnce(mockSession) // Session lookup
        .mockResolvedValueOnce(null); // Cache miss

      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue(
        createMockResponse({ data: "test" }, DEFAULT_RATE_LIMIT_HEADERS),
      );

      vi.mocked(kv.set).mockResolvedValue("OK");

      await handler(req as VercelRequest, res as VercelResponse);

      // Verify user cache key
      expect(kv.set).toHaveBeenCalledWith(
        "user:session123:test-key",
        expect.any(Object),
        { ex: 600 }, // 10 minutes for authenticated
      );
    });

    it("должен fallback на demo если session expired", async () => {
      req.headers = { cookie: "session=expired_session" };

      vi.mocked(kv.get).mockResolvedValue(null); // Session not found

      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue(
        createMockResponse({ data: "test" }, DEFAULT_RATE_LIMIT_HEADERS),
      );

      vi.mocked(kv.set).mockResolvedValue("OK");

      await handler(req as VercelRequest, res as VercelResponse);

      // Should use demo token
      expect(global.fetch).toHaveBeenCalledWith(
        "https://api.github.com/graphql",
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: "Bearer demo_token_123",
          }),
        }),
      );

      // Should be demo mode
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          rateLimit: expect.objectContaining({
            isDemo: true,
          }),
        }),
      );
    });
  });

  describe("Rate Limit Extraction", () => {
    it("должен извлекать rate limit из headers", async () => {
      req.headers = {};

      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue(
        createMockResponse(
          { data: "test" },
          {
            "X-RateLimit-Remaining": "4567",
            "X-RateLimit-Limit": "5000",
            "X-RateLimit-Reset": "1704067200",
            "X-RateLimit-Used": "433",
          },
        ),
      );

      vi.mocked(kv.get).mockResolvedValue(null);
      vi.mocked(kv.set).mockResolvedValue("OK");

      await handler(req as VercelRequest, res as VercelResponse);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          rateLimit: {
            remaining: 4567,
            limit: 5000,
            reset: 1704067200,
            used: 433,
            isDemo: true,
            userLogin: undefined,
          },
        }),
      );
    });

    it("должен использовать defaults если headers отсутствуют", async () => {
      req.headers = {};

      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue(
        createMockResponse({ data: "test" }, {}), // Empty headers
      );

      vi.mocked(kv.get).mockResolvedValue(null);
      vi.mocked(kv.set).mockResolvedValue("OK");

      await handler(req as VercelRequest, res as VercelResponse);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          rateLimit: expect.objectContaining({
            remaining: 0,
            limit: 5000,
            reset: 0,
            used: 0,
          }),
        }),
      );
    });
  });

  describe("Error Handling", () => {
    it("должен вернуть 405 для non-POST запросов", async () => {
      req.method = "GET";

      await handler(req as VercelRequest, res as VercelResponse);

      expect(res.status).toHaveBeenCalledWith(405);
      expect(res.json).toHaveBeenCalledWith({ error: "Method not allowed" });
    });

    it("должен вернуть 400 если query отсутствует", async () => {
      req.body = { variables: {} };

      await handler(req as VercelRequest, res as VercelResponse);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "Query is required" });
    });

    it("должен обработать GraphQL errors", async () => {
      req.headers = {};

      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue(
        createMockResponse(
          { errors: [{ message: "Field not found" }] },
          {
            "X-RateLimit-Remaining": "5000",
            "X-RateLimit-Limit": "5000",
          },
        ),
      );

      vi.mocked(kv.get).mockResolvedValue(null);

      await handler(req as VercelRequest, res as VercelResponse);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        errors: [{ message: "Field not found" }],
      });
    });

    it("должен обработать GitHub API errors", async () => {
      req.headers = {};

      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue(
        createMockResponse(
          {},
          {},
          { ok: false, status: 503, statusText: "Service Unavailable" },
        ),
      );

      vi.mocked(kv.get).mockResolvedValue(null);

      await handler(req as VercelRequest, res as VercelResponse);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: "Failed to fetch from GitHub",
        message: expect.stringContaining("503"),
      });
    });

    it("должен обработать отсутствие токена", async () => {
      delete process.env.GITHUB_TOKEN;
      req.headers = {};

      vi.mocked(kv.get).mockResolvedValue(null);

      await handler(req as VercelRequest, res as VercelResponse);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: "No token available",
        message: expect.stringContaining("token"),
      });
    });
  });

  describe("Caching", () => {
    it("должен вернуть cached data если доступен", async () => {
      req.headers = {};

      const cachedData = {
        data: { cached: true },
        rateLimit: {
          remaining: 5000,
          limit: 5000,
          reset: 0,
          used: 0,
          isDemo: true,
        },
      };

      vi.mocked(kv.get).mockResolvedValue(cachedData);

      await handler(req as VercelRequest, res as VercelResponse);

      // Should not call GitHub API
      expect(global.fetch).not.toHaveBeenCalled();

      // Should return cached data
      expect(res.json).toHaveBeenCalledWith(cachedData);
    });

    it("должен работать без KV (graceful degradation)", async () => {
      req.headers = {};

      // Mock KV to throw errors (simulating unavailability)
      vi.mocked(kv.get).mockRejectedValue(new Error("KV unavailable"));
      vi.mocked(kv.set).mockRejectedValue(new Error("KV unavailable"));

      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue(
        createMockResponse({ data: "test" }, DEFAULT_RATE_LIMIT_HEADERS),
      );

      await handler(req as VercelRequest, res as VercelResponse);

      // Should still work even when KV throws errors
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          data: "test",
        }),
      );
    });
  });
});
