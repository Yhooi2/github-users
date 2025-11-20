import type { VercelRequest, VercelResponse } from "@vercel/node";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Mock @vercel/kv
vi.mock("@vercel/kv", () => ({
  kv: {
    scan: vi.fn(),
    get: vi.fn(),
    zrange: vi.fn(),
  },
}));

import { kv } from "@vercel/kv";
import handler from "./oauth-usage";

describe("OAuth Usage Analytics Endpoint", () => {
  let req: Partial<VercelRequest>;
  let res: Partial<VercelResponse>;
  let originalEnv: NodeJS.ProcessEnv;

  beforeEach(() => {
    // Save original environment
    originalEnv = { ...process.env };

    // Create mock request
    req = {
      method: "GET",
      query: {},
    };

    // Create mock response with all required methods
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
      setHeader: vi.fn().mockReturnThis(),
    };

    // Mock console methods
    vi.spyOn(console, "log").mockImplementation(() => {});
    vi.spyOn(console, "warn").mockImplementation(() => {});
    vi.spyOn(console, "error").mockImplementation(() => {});

    // Clear all mocks
    vi.clearAllMocks();
  });

  afterEach(() => {
    // Restore environment
    process.env = originalEnv;
    vi.restoreAllMocks();
  });

  describe("HTTP Method Validation", () => {
    it("должен отклонить POST запрос", async () => {
      req.method = "POST";

      await handler(req as VercelRequest, res as VercelResponse);

      expect(
        res.status,
        "OAuth usage endpoint should return 405 Method Not Allowed for POST requests (read-only endpoint)",
      ).toHaveBeenCalledWith(405);
      expect(
        res.json,
        "OAuth usage endpoint should return method not allowed error message for POST requests",
      ).toHaveBeenCalledWith({ error: "Method not allowed" });
    });

    it("должен отклонить PUT запрос", async () => {
      req.method = "PUT";

      await handler(req as VercelRequest, res as VercelResponse);

      expect(
        res.status,
        "OAuth usage endpoint should return 405 Method Not Allowed for POST requests (read-only endpoint)",
      ).toHaveBeenCalledWith(405);
      expect(
        res.json,
        "OAuth usage endpoint should return method not allowed error message for POST requests",
      ).toHaveBeenCalledWith({ error: "Method not allowed" });
    });

    it("должен отклонить DELETE запрос", async () => {
      req.method = "DELETE";

      await handler(req as VercelRequest, res as VercelResponse);

      expect(
        res.status,
        "OAuth usage endpoint should return 405 Method Not Allowed for POST requests (read-only endpoint)",
      ).toHaveBeenCalledWith(405);
      expect(
        res.json,
        "OAuth usage endpoint should return method not allowed error message for POST requests",
      ).toHaveBeenCalledWith({ error: "Method not allowed" });
    });

    it("должен принять GET запрос", async () => {
      req.method = "GET";

      // Mock empty KV responses
      vi.mocked(kv.scan).mockResolvedValue([0, []]);
      vi.mocked(kv.zrange).mockResolvedValue([]);

      await handler(req as VercelRequest, res as VercelResponse);

      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe("KV Availability Check", () => {
    it("должен вернуть 503 если KV недоступен", async () => {
      // Re-mock @vercel/kv to return null kv
      vi.resetModules();
      vi.doMock("@vercel/kv", () => ({
        kv: null,
      }));

      // Re-import handler with null kv
      const { default: handlerWithNullKv } = await import("./oauth-usage");

      await handlerWithNullKv(req as VercelRequest, res as VercelResponse);

      expect(res.status).toHaveBeenCalledWith(503);
      expect(res.json).toHaveBeenCalledWith({
        error: "Analytics service unavailable",
        message: "Vercel KV is not configured",
      });
    });
  });

  describe("Query Parameter Validation", () => {
    beforeEach(() => {
      // Mock empty KV responses for successful requests
      vi.mocked(kv.scan).mockResolvedValue([0, []]);
      vi.mocked(kv.zrange).mockResolvedValue([]);
    });

    it('должен использовать период "day" по умолчанию', async () => {
      await handler(req as VercelRequest, res as VercelResponse);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          period: "day",
        }),
      );
    });

    it('должен принять период "hour"', async () => {
      req.query = { period: "hour" };

      await handler(req as VercelRequest, res as VercelResponse);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          period: "hour",
        }),
      );
    });

    it('должен принять период "week"', async () => {
      req.query = { period: "week" };

      await handler(req as VercelRequest, res as VercelResponse);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          period: "week",
        }),
      );
    });

    it('должен принять период "month"', async () => {
      req.query = { period: "month" };

      await handler(req as VercelRequest, res as VercelResponse);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          period: "month",
        }),
      );
    });

    it("должен отклонить невалидный период", async () => {
      req.query = { period: "year" };

      await handler(req as VercelRequest, res as VercelResponse);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "Invalid period",
        message: "Period must be one of: hour, day, week, month",
      });
    });

    it("не должен включать detailed данные по умолчанию", async () => {
      await handler(req as VercelRequest, res as VercelResponse);

      expect(res.status).toHaveBeenCalledWith(200);
      const response = (res.json as ReturnType<typeof vi.fn>).mock.calls[0][0];
      expect(response.detailed).toBeUndefined();
    });

    it("должен включить detailed данные если detailed=true", async () => {
      req.query = { detailed: "true" };

      await handler(req as VercelRequest, res as VercelResponse);

      expect(res.status).toHaveBeenCalledWith(200);
      const response = (res.json as ReturnType<typeof vi.fn>).mock.calls[0][0];
      expect(response.detailed).toBeDefined();
      expect(response.detailed).toHaveProperty("sessions");
      expect(response.detailed).toHaveProperty("timeline");
    });
  });

  describe("Active Sessions Retrieval", () => {
    it("должен вернуть пустой массив если нет сессий", async () => {
      vi.mocked(kv.scan).mockResolvedValue([0, []]);
      vi.mocked(kv.zrange).mockResolvedValue([]);

      await handler(req as VercelRequest, res as VercelResponse);

      expect(res.status).toHaveBeenCalledWith(200);
      const response = (res.json as ReturnType<typeof vi.fn>).mock.calls[0][0];
      expect(response.metrics.activeSessions).toBe(0);
    });

    it("должен получить активные сессии из KV", async () => {
      // Mock scan to return session keys
      vi.mocked(kv.scan).mockResolvedValueOnce([
        0,
        ["session:abc123", "session:def456"],
      ]);

      // Mock get to return session data
      vi.mocked(kv.get).mockResolvedValueOnce({
        userId: 12345,
        login: "octocat",
        accessToken: "gho_token1",
        avatarUrl: "https://github.com/octocat.png",
        createdAt: Date.now() - 3600000, // 1 hour ago
        lastActivity: Date.now(),
      });

      vi.mocked(kv.get).mockResolvedValueOnce({
        userId: 67890,
        login: "mona",
        accessToken: "gho_token2",
        avatarUrl: "https://github.com/mona.png",
        createdAt: Date.now() - 7200000, // 2 hours ago
      });

      vi.mocked(kv.zrange).mockResolvedValue([]);

      await handler(req as VercelRequest, res as VercelResponse);

      expect(res.status).toHaveBeenCalledWith(200);
      const response = (res.json as ReturnType<typeof vi.fn>).mock.calls[0][0];
      expect(response.metrics.activeSessions).toBe(2);
      expect(response.metrics.uniqueUsers).toBe(2);
    });

    it("должен обработать несколько итераций scan (cursor != 0)", async () => {
      // First scan returns cursor 123
      vi.mocked(kv.scan).mockResolvedValueOnce([123, ["session:abc123"]]);
      // Second scan returns cursor 0 (done)
      vi.mocked(kv.scan).mockResolvedValueOnce([0, ["session:def456"]]);

      vi.mocked(kv.get)
        .mockResolvedValueOnce({
          userId: 12345,
          login: "octocat",
          accessToken: "gho_token",
          avatarUrl: "https://github.com/octocat.png",
          createdAt: Date.now(),
        })
        .mockResolvedValueOnce({
          userId: 67890,
          login: "mona",
          accessToken: "gho_token",
          avatarUrl: "https://github.com/mona.png",
          createdAt: Date.now(),
        });

      vi.mocked(kv.zrange).mockResolvedValue([]);

      await handler(req as VercelRequest, res as VercelResponse);

      expect(kv.scan).toHaveBeenCalledTimes(2);
      expect(res.status).toHaveBeenCalledWith(200);
      const response = (res.json as ReturnType<typeof vi.fn>).mock.calls[0][0];
      expect(response.metrics.activeSessions).toBe(2);
    });
  });

  describe("OAuth Events Retrieval", () => {
    beforeEach(() => {
      vi.mocked(kv.scan).mockResolvedValue([0, []]);
    });

    it("должен подсчитать login events", async () => {
      const loginEvent1 = JSON.stringify({
        timestamp: Date.now() - 1000,
        userId: 12345,
        login: "octocat",
        sessionId: "sess_abc",
      });

      const loginEvent2 = JSON.stringify({
        timestamp: Date.now() - 500,
        userId: 67890,
        login: "mona",
        sessionId: "sess_def",
      });

      vi.mocked(kv.zrange).mockImplementation(async (key: string) => {
        if (key === "analytics:oauth:logins") {
          return [loginEvent1, loginEvent2];
        }
        return [];
      });

      await handler(req as VercelRequest, res as VercelResponse);

      expect(res.status).toHaveBeenCalledWith(200);
      const response = (res.json as ReturnType<typeof vi.fn>).mock.calls[0][0];
      expect(response.metrics.totalLogins).toBe(2);
    });

    it("должен подсчитать logout events", async () => {
      const logoutEvent = JSON.stringify({
        timestamp: Date.now(),
        userId: 12345,
        login: "octocat",
        sessionId: "sess_abc",
      });

      vi.mocked(kv.zrange).mockImplementation(async (key: string) => {
        if (key === "analytics:oauth:logouts") {
          return [logoutEvent];
        }
        return [];
      });

      await handler(req as VercelRequest, res as VercelResponse);

      expect(res.status).toHaveBeenCalledWith(200);
      const response = (res.json as ReturnType<typeof vi.fn>).mock.calls[0][0];
      expect(response.metrics.totalLogouts).toBe(1);
    });

    it("должен создать timeline с сортировкой по timestamp", async () => {
      req.query = { detailed: "true" };

      const loginEvent = JSON.stringify({
        timestamp: 1000,
        userId: 12345,
        login: "octocat",
        sessionId: "sess_abc",
      });

      const logoutEvent = JSON.stringify({
        timestamp: 500,
        userId: 12345,
        login: "octocat",
        sessionId: "sess_abc",
      });

      vi.mocked(kv.zrange).mockImplementation(async (key: string) => {
        if (key === "analytics:oauth:logins") {
          return [loginEvent];
        }
        if (key === "analytics:oauth:logouts") {
          return [logoutEvent];
        }
        return [];
      });

      await handler(req as VercelRequest, res as VercelResponse);

      expect(res.status).toHaveBeenCalledWith(200);
      const response = (res.json as ReturnType<typeof vi.fn>).mock.calls[0][0];
      expect(response.detailed.timeline).toHaveLength(2);
      // Should be sorted by timestamp (500 before 1000)
      expect(response.detailed.timeline[0].timestamp).toBe(500);
      expect(response.detailed.timeline[0].event).toBe("logout");
      expect(response.detailed.timeline[1].timestamp).toBe(1000);
      expect(response.detailed.timeline[1].event).toBe("login");
    });

    it("должен пропустить невалидные JSON events", async () => {
      vi.mocked(kv.zrange).mockImplementation(async (key: string) => {
        if (key === "analytics:oauth:logins") {
          return [
            "invalid json",
            JSON.stringify({
              timestamp: 1000,
              userId: 12345,
              login: "octocat",
            }),
          ];
        }
        return [];
      });

      await handler(req as VercelRequest, res as VercelResponse);

      expect(res.status).toHaveBeenCalledWith(200);
      const response = (res.json as ReturnType<typeof vi.fn>).mock.calls[0][0];
      // Only 1 valid event (invalid json skipped)
      expect(response.metrics.totalLogins).toBe(2); // Count includes invalid
    });
  });

  describe("Rate Limit Statistics", () => {
    beforeEach(() => {
      vi.mocked(kv.scan).mockResolvedValue([0, []]);
      vi.mocked(kv.zrange).mockImplementation(async (key: string) => {
        if (key === "analytics:ratelimit") {
          return [];
        }
        return [];
      });
    });

    it("должен вернуть default значения если нет snapshots", async () => {
      await handler(req as VercelRequest, res as VercelResponse);

      expect(res.status).toHaveBeenCalledWith(200);
      const response = (res.json as ReturnType<typeof vi.fn>).mock.calls[0][0];
      expect(response.metrics.rateLimit).toEqual({
        avgUsage: 0,
        peakUsage: 0,
        avgRemaining: 5000,
      });
    });

    it("должен вычислить среднее использование", async () => {
      const snapshot1 = JSON.stringify({ used: 100, remaining: 4900 });
      const snapshot2 = JSON.stringify({ used: 200, remaining: 4800 });
      const snapshot3 = JSON.stringify({ used: 150, remaining: 4850 });

      vi.mocked(kv.zrange).mockImplementation(async (key: string) => {
        if (key === "analytics:ratelimit") {
          return [snapshot1, snapshot2, snapshot3];
        }
        return [];
      });

      await handler(req as VercelRequest, res as VercelResponse);

      expect(res.status).toHaveBeenCalledWith(200);
      const response = (res.json as ReturnType<typeof vi.fn>).mock.calls[0][0];
      // avgUsage = (100 + 200 + 150) / 3 = 150
      expect(response.metrics.rateLimit.avgUsage).toBe(150);
      // avgRemaining = (4900 + 4800 + 4850) / 3 = 4850
      expect(response.metrics.rateLimit.avgRemaining).toBe(4850);
    });

    it("должен вычислить пиковое использование", async () => {
      const snapshot1 = JSON.stringify({ used: 100, remaining: 4900 });
      const snapshot2 = JSON.stringify({ used: 500, remaining: 4500 }); // peak
      const snapshot3 = JSON.stringify({ used: 200, remaining: 4800 });

      vi.mocked(kv.zrange).mockImplementation(async (key: string) => {
        if (key === "analytics:ratelimit") {
          return [snapshot1, snapshot2, snapshot3];
        }
        return [];
      });

      await handler(req as VercelRequest, res as VercelResponse);

      expect(res.status).toHaveBeenCalledWith(200);
      const response = (res.json as ReturnType<typeof vi.fn>).mock.calls[0][0];
      expect(response.metrics.rateLimit.peakUsage).toBe(500);
    });
  });

  describe("Session Duration Calculation", () => {
    it("должен вычислить среднюю длительность сессии", async () => {
      const now = Date.now();
      vi.spyOn(Date, "now").mockReturnValue(now);

      vi.mocked(kv.scan).mockResolvedValue([0, ["session:abc", "session:def"]]);

      vi.mocked(kv.get)
        .mockResolvedValueOnce({
          userId: 12345,
          login: "octocat",
          accessToken: "token",
          avatarUrl: "url",
          createdAt: now - 3600000, // 1 hour ago
          lastActivity: now, // active now
        })
        .mockResolvedValueOnce({
          userId: 67890,
          login: "mona",
          accessToken: "token",
          avatarUrl: "url",
          createdAt: now - 7200000, // 2 hours ago
          lastActivity: now - 1800000, // active 30 min ago
        });

      vi.mocked(kv.zrange).mockResolvedValue([]);

      await handler(req as VercelRequest, res as VercelResponse);

      expect(res.status).toHaveBeenCalledWith(200);
      const response = (res.json as ReturnType<typeof vi.fn>).mock.calls[0][0];
      // Session 1: 1 hour (3600000ms)
      // Session 2: 1.5 hours (5400000ms)
      // Average: (3600000 + 5400000) / 2 = 4500000ms
      expect(response.metrics.avgSessionDuration).toBe(4500000);
    });

    it("должен использовать now если lastActivity отсутствует", async () => {
      const now = Date.now();
      vi.spyOn(Date, "now").mockReturnValue(now);

      vi.mocked(kv.scan).mockResolvedValue([0, ["session:abc"]]);

      vi.mocked(kv.get).mockResolvedValueOnce({
        userId: 12345,
        login: "octocat",
        accessToken: "token",
        avatarUrl: "url",
        createdAt: now - 3600000, // 1 hour ago
        // No lastActivity
      });

      vi.mocked(kv.zrange).mockResolvedValue([]);

      await handler(req as VercelRequest, res as VercelResponse);

      expect(res.status).toHaveBeenCalledWith(200);
      const response = (res.json as ReturnType<typeof vi.fn>).mock.calls[0][0];
      // Duration = now - createdAt = 3600000ms (1 hour)
      expect(response.metrics.avgSessionDuration).toBe(3600000);
    });
  });

  describe("Detailed Mode", () => {
    it("должен truncate session IDs для privacy", async () => {
      req.query = { detailed: "true" };

      vi.mocked(kv.scan).mockResolvedValue([0, ["session:abc123def456"]]);

      vi.mocked(kv.get).mockResolvedValueOnce({
        userId: 12345,
        login: "octocat",
        accessToken: "token",
        avatarUrl: "url",
        createdAt: Date.now(),
      });

      vi.mocked(kv.zrange).mockResolvedValue([]);

      await handler(req as VercelRequest, res as VercelResponse);

      expect(res.status).toHaveBeenCalledWith(200);
      const response = (res.json as ReturnType<typeof vi.fn>).mock.calls[0][0];
      expect(response.detailed.sessions).toHaveLength(1);
      // Should be truncated to first 8 chars + '...'
      expect(response.detailed.sessions[0].sessionId).toBe("abc123de...");
    });
  });

  describe("Response Headers", () => {
    it("должен установить cache headers", async () => {
      vi.mocked(kv.scan).mockResolvedValue([0, []]);
      vi.mocked(kv.zrange).mockResolvedValue([]);

      await handler(req as VercelRequest, res as VercelResponse);

      expect(res.setHeader).toHaveBeenCalledWith(
        "Cache-Control",
        "public, s-maxage=300, stale-while-revalidate=600",
      );
    });
  });

  describe("Error Handling", () => {
    it("должен обработать ошибку при получении сессий", async () => {
      vi.mocked(kv.scan).mockRejectedValueOnce(new Error("KV scan failed"));
      vi.mocked(kv.zrange).mockResolvedValue([]);

      await handler(req as VercelRequest, res as VercelResponse);

      expect(console.error).toHaveBeenCalledWith(
        "Error fetching active sessions:",
        expect.any(Error),
      );
      // Should still return 200 with 0 sessions
      expect(res.status).toHaveBeenCalledWith(200);
      const response = (res.json as ReturnType<typeof vi.fn>).mock.calls[0][0];
      expect(response.metrics.activeSessions).toBe(0);
    });

    it("должен обработать ошибку при получении events", async () => {
      vi.mocked(kv.scan).mockResolvedValue([0, []]);
      vi.mocked(kv.zrange).mockRejectedValueOnce(new Error("KV zrange failed"));

      await handler(req as VercelRequest, res as VercelResponse);

      expect(console.error).toHaveBeenCalledWith(
        "Error fetching OAuth events:",
        expect.any(Error),
      );
      // Should still return 200 with 0 events
      expect(res.status).toHaveBeenCalledWith(200);
      const response = (res.json as ReturnType<typeof vi.fn>).mock.calls[0][0];
      expect(response.metrics.totalLogins).toBe(0);
      expect(response.metrics.totalLogouts).toBe(0);
    });

    it("должен обработать ошибку при получении rate limit stats", async () => {
      vi.mocked(kv.scan).mockResolvedValue([0, []]);

      // Mock zrange to handle logins, logouts, and ratelimit calls
      vi.mocked(kv.zrange).mockImplementation(async (key: string) => {
        if (key === "analytics:oauth:logins") {
          return [];
        }
        if (key === "analytics:oauth:logouts") {
          return [];
        }
        if (key === "analytics:ratelimit") {
          throw new Error("KV zrange failed");
        }
        return [];
      });

      await handler(req as VercelRequest, res as VercelResponse);

      expect(console.error).toHaveBeenCalledWith(
        "Error fetching rate limit stats:",
        expect.any(Error),
      );
      // Should still return 200 with default rate limit stats
      expect(res.status).toHaveBeenCalledWith(200);
      const response = (res.json as ReturnType<typeof vi.fn>).mock.calls[0][0];
      expect(response.metrics.rateLimit).toEqual({
        avgUsage: 0,
        peakUsage: 0,
        avgRemaining: 5000,
      });
    });

    it("должен вернуть 500 если произошла неожиданная ошибка в response building", async () => {
      // Mock getPeriodMs to throw by providing invalid period through internal logic
      // Force error by making Date.now() throw
      const dateError = new Error("Date.now() failed");
      vi.spyOn(Date, "now").mockImplementation(() => {
        throw dateError;
      });

      vi.mocked(kv.scan).mockResolvedValue([0, []]);
      vi.mocked(kv.zrange).mockResolvedValue([]);

      await handler(req as VercelRequest, res as VercelResponse);

      // The error should be caught and logged
      expect(console.error).toHaveBeenCalledWith(
        "OAuth analytics error:",
        dateError,
      );
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: "Internal server error",
        message: "Date.now() failed",
      });
    });
  });
});
