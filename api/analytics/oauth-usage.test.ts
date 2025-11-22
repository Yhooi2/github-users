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
  let dateNowSpy: ReturnType<typeof vi.spyOn> | null = null;

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

    // Reset all mocks and set default resolved values
    // CRITICAL: cursor MUST be a STRING "0", not number 0!
    vi.clearAllMocks();
    vi.mocked(kv.scan).mockResolvedValue(["0", []]); // String "0", not number 0
    vi.mocked(kv.get).mockResolvedValue(null);
    vi.mocked(kv.zrange).mockResolvedValue([]);

    // Clear any existing Date.now spy
    dateNowSpy = null;
  });

  afterEach(() => {
    // CRITICAL: Restore all spies including Date.now
    if (dateNowSpy) {
      dateNowSpy.mockRestore();
      dateNowSpy = null;
    }

    // Restore environment
    process.env = originalEnv;

    // Restore all mocks
    vi.restoreAllMocks();

    // Clear all timers if any
    vi.clearAllTimers();
  });

  describe("HTTP Method Validation", () => {
    it("should reject POST request", async () => {
      req.method = "POST";

      await handler(req as VercelRequest, res as VercelResponse);

      expect(res.status).toHaveBeenCalledWith(405);
      expect(res.json).toHaveBeenCalledWith({ error: "Method not allowed" });
    });

    it("should reject PUT request", async () => {
      req.method = "PUT";

      await handler(req as VercelRequest, res as VercelResponse);

      expect(res.status).toHaveBeenCalledWith(405);
      expect(res.json).toHaveBeenCalledWith({ error: "Method not allowed" });
    });

    it("should reject DELETE request", async () => {
      req.method = "DELETE";

      await handler(req as VercelRequest, res as VercelResponse);

      expect(res.status).toHaveBeenCalledWith(405);
      expect(res.json).toHaveBeenCalledWith({ error: "Method not allowed" });
    });

    it("should accept GET request", async () => {
      req.method = "GET";

      await handler(req as VercelRequest, res as VercelResponse);

      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe("KV Availability Check", () => {
    it("should return 503 if KV unavailable", async () => {
      // Re-mock @vercel/kv to return null kv
      vi.resetModules();
      vi.doMock("@vercel/kv", () => ({
        kv: null,
      }));

      // Re-import handler with null kv
      const { default: handlerWithNullKv } = await import(
        "./oauth-usage?t=" + Date.now()
      );

      await handlerWithNullKv(req as VercelRequest, res as VercelResponse);

      expect(res.status).toHaveBeenCalledWith(503);
      expect(res.json).toHaveBeenCalledWith({
        error: "Analytics service unavailable",
        message: "Vercel KV is not configured",
      });
    });
  });

  describe("Query Parameter Validation", () => {
    it('should use "day" period by default', async () => {
      await handler(req as VercelRequest, res as VercelResponse);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          period: "day",
        }),
      );
    });

    it('should accept "hour" period', async () => {
      req.query = { period: "hour" };

      await handler(req as VercelRequest, res as VercelResponse);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          period: "hour",
        }),
      );
    });

    it('should accept "week" period', async () => {
      req.query = { period: "week" };

      await handler(req as VercelRequest, res as VercelResponse);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          period: "week",
        }),
      );
    });

    it('should accept "month" period', async () => {
      req.query = { period: "month" };

      await handler(req as VercelRequest, res as VercelResponse);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          period: "month",
        }),
      );
    });

    it("should reject invalid period", async () => {
      req.query = { period: "year" };

      await handler(req as VercelRequest, res as VercelResponse);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "Invalid period",
        message: "Allowed values: hour, day, week, month",
      });
    });

    it("should not include detailed data by default", async () => {
      await handler(req as VercelRequest, res as VercelResponse);

      expect(res.status).toHaveBeenCalledWith(200);
      const response = (res.json as ReturnType<typeof vi.fn>).mock.calls[0][0];
      expect(response.detailed).toBeUndefined();
    });

    it("should include detailed data if detailed=true", async () => {
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
    it("should return empty array if no sessions", async () => {
      await handler(req as VercelRequest, res as VercelResponse);

      expect(res.status).toHaveBeenCalledWith(200);
      const response = (res.json as ReturnType<typeof vi.fn>).mock.calls[0][0];
      expect(response.metrics.activeSessions).toBe(0);
    });

    it("should fetch active sessions from KV", async () => {
      const now = Date.now();

      // Mock scan to return session keys - cursor must be STRING
      vi.mocked(kv.scan).mockResolvedValueOnce([
        "0", // String, not number!
        ["session:abc123", "session:def456"],
      ]);

      // Mock get to return session data
      vi.mocked(kv.get)
        .mockResolvedValueOnce({
          userId: 12345,
          login: "octocat",
          accessToken: "gho_token1",
          avatarUrl: "https://github.com/octocat.png",
          createdAt: now - 3600000,
          lastActivity: now,
        })
        .mockResolvedValueOnce({
          userId: 67890,
          login: "mona",
          accessToken: "gho_token2",
          avatarUrl: "https://github.com/mona.png",
          createdAt: now - 7200000,
        });

      await handler(req as VercelRequest, res as VercelResponse);

      expect(res.status).toHaveBeenCalledWith(200);
      const response = (res.json as ReturnType<typeof vi.fn>).mock.calls[0][0];
      expect(response.metrics.activeSessions).toBe(2);
      expect(response.metrics.uniqueUsers).toBe(2);
    });

    it("should handle multiple scan iterations (cursor != 0)", async () => {
      const now = Date.now();

      // CRITICAL: cursor must be a STRING, not a number!
      vi.mocked(kv.scan)
        .mockResolvedValueOnce(["123", ["session:abc123"]]) // cursor as string
        .mockResolvedValueOnce(["0", ["session:def456"]]); // cursor as string

      vi.mocked(kv.get)
        .mockResolvedValueOnce({
          userId: 12345,
          login: "octocat",
          accessToken: "gho_token",
          avatarUrl: "https://github.com/octocat.png",
          createdAt: now,
        })
        .mockResolvedValueOnce({
          userId: 67890,
          login: "mona",
          accessToken: "gho_token",
          avatarUrl: "https://github.com/mona.png",
          createdAt: now,
        });

      await handler(req as VercelRequest, res as VercelResponse);

      expect(kv.scan).toHaveBeenCalledTimes(2);
      expect(res.status).toHaveBeenCalledWith(200);
      const response = (res.json as ReturnType<typeof vi.fn>).mock.calls[0][0];
      expect(response.metrics.activeSessions).toBe(2);
    });
  });

  describe("OAuth Events Retrieval", () => {
    it("should count login events", async () => {
      const now = Date.now();

      const loginEvent1 = JSON.stringify({
        timestamp: now - 1000,
        userId: 12345,
        login: "octocat",
        sessionId: "sess_abc",
      });

      const loginEvent2 = JSON.stringify({
        timestamp: now - 500,
        userId: 67890,
        login: "mona",
        sessionId: "sess_def",
      });

      vi.mocked(kv.zrange).mockImplementation(
        async (key: string, _min: unknown, _max: unknown, _opts?: unknown) => {
          if (key === "analytics:oauth:logins") {
            return [loginEvent1, loginEvent2];
          }
          return [];
        },
      );

      await handler(req as VercelRequest, res as VercelResponse);

      expect(res.status).toHaveBeenCalledWith(200);
      const response = (res.json as ReturnType<typeof vi.fn>).mock.calls[0][0];
      expect(response.metrics.totalLogins).toBe(2);
    });

    it("should count logout events", async () => {
      const logoutEvent = JSON.stringify({
        timestamp: Date.now(),
        userId: 12345,
        login: "octocat",
        sessionId: "sess_abc",
      });

      vi.mocked(kv.zrange).mockImplementation(
        async (key: string, _min: unknown, _max: unknown, _opts?: unknown) => {
          if (key === "analytics:oauth:logouts") {
            return [logoutEvent];
          }
          return [];
        },
      );

      await handler(req as VercelRequest, res as VercelResponse);

      expect(res.status).toHaveBeenCalledWith(200);
      const response = (res.json as ReturnType<typeof vi.fn>).mock.calls[0][0];
      expect(response.metrics.totalLogouts).toBe(1);
    });

    it("should create timeline sorted by timestamp", async () => {
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

      vi.mocked(kv.zrange).mockImplementation(
        async (key: string, _min: unknown, _max: unknown, _opts?: unknown) => {
          if (key === "analytics:oauth:logins") {
            return [loginEvent];
          }
          if (key === "analytics:oauth:logouts") {
            return [logoutEvent];
          }
          return [];
        },
      );

      await handler(req as VercelRequest, res as VercelResponse);

      expect(res.status).toHaveBeenCalledWith(200);
      const response = (res.json as ReturnType<typeof vi.fn>).mock.calls[0][0];
      expect(response.detailed.timeline).toHaveLength(2);
      expect(response.detailed.timeline[0].timestamp).toBe(500);
      expect(response.detailed.timeline[0].event).toBe("logout");
      expect(response.detailed.timeline[1].timestamp).toBe(1000);
      expect(response.detailed.timeline[1].event).toBe("login");
    });

    it("should skip invalid JSON events", async () => {
      vi.mocked(kv.zrange).mockImplementation(
        async (key: string, _min: unknown, _max: unknown, _opts?: unknown) => {
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
        },
      );

      await handler(req as VercelRequest, res as VercelResponse);

      expect(res.status).toHaveBeenCalledWith(200);
      const response = (res.json as ReturnType<typeof vi.fn>).mock.calls[0][0];
      expect(response.metrics.totalLogins).toBe(2);
    });
  });

  describe("Rate Limit Statistics", () => {
    it("should return default values if no snapshots", async () => {
      await handler(req as VercelRequest, res as VercelResponse);

      expect(res.status).toHaveBeenCalledWith(200);
      const response = (res.json as ReturnType<typeof vi.fn>).mock.calls[0][0];
      expect(response.metrics.rateLimit).toEqual({
        avgUsage: 0,
        peakUsage: 0,
        avgRemaining: 5000,
      });
    });

    it("should calculate average usage", async () => {
      const snapshot1 = JSON.stringify({ used: 100, remaining: 4900 });
      const snapshot2 = JSON.stringify({ used: 200, remaining: 4800 });
      const snapshot3 = JSON.stringify({ used: 150, remaining: 4850 });

      vi.mocked(kv.zrange).mockImplementation(
        async (key: string, _min: unknown, _max: unknown, _opts?: unknown) => {
          if (key === "analytics:ratelimit") {
            return [snapshot1, snapshot2, snapshot3];
          }
          return [];
        },
      );

      await handler(req as VercelRequest, res as VercelResponse);

      expect(res.status).toHaveBeenCalledWith(200);
      const response = (res.json as ReturnType<typeof vi.fn>).mock.calls[0][0];
      expect(response.metrics.rateLimit.avgUsage).toBe(150);
      expect(response.metrics.rateLimit.avgRemaining).toBe(4850);
    });

    it("should calculate peak usage", async () => {
      const snapshot1 = JSON.stringify({ used: 100, remaining: 4900 });
      const snapshot2 = JSON.stringify({ used: 500, remaining: 4500 });
      const snapshot3 = JSON.stringify({ used: 200, remaining: 4800 });

      vi.mocked(kv.zrange).mockImplementation(
        async (key: string, _min: unknown, _max: unknown, _opts?: unknown) => {
          if (key === "analytics:ratelimit") {
            return [snapshot1, snapshot2, snapshot3];
          }
          return [];
        },
      );

      await handler(req as VercelRequest, res as VercelResponse);

      expect(res.status).toHaveBeenCalledWith(200);
      const response = (res.json as ReturnType<typeof vi.fn>).mock.calls[0][0];
      expect(response.metrics.rateLimit.peakUsage).toBe(500);
    });
  });

  describe("Session Duration Calculation", () => {
    it("should calculate average session duration", async () => {
      const now = Date.now();
      dateNowSpy = vi.spyOn(Date, "now").mockReturnValue(now);

      vi.mocked(kv.scan).mockResolvedValue([
        "0",
        ["session:abc", "session:def"],
      ]);

      vi.mocked(kv.get)
        .mockResolvedValueOnce({
          userId: 12345,
          login: "octocat",
          accessToken: "token",
          avatarUrl: "url",
          createdAt: now - 3600000,
          lastActivity: now,
        })
        .mockResolvedValueOnce({
          userId: 67890,
          login: "mona",
          accessToken: "token",
          avatarUrl: "url",
          createdAt: now - 7200000,
          lastActivity: now - 1800000,
        });

      await handler(req as VercelRequest, res as VercelResponse);

      expect(res.status).toHaveBeenCalledWith(200);
      const response = (res.json as ReturnType<typeof vi.fn>).mock.calls[0][0];
      expect(response.metrics.avgSessionDuration).toBe(4500000);
    });

    it("should use now if lastActivity missing", async () => {
      const now = Date.now();
      dateNowSpy = vi.spyOn(Date, "now").mockReturnValue(now);

      vi.mocked(kv.scan).mockResolvedValue(["0", ["session:abc"]]);

      vi.mocked(kv.get).mockResolvedValueOnce({
        userId: 12345,
        login: "octocat",
        accessToken: "token",
        avatarUrl: "url",
        createdAt: now - 3600000,
      });

      await handler(req as VercelRequest, res as VercelResponse);

      expect(res.status).toHaveBeenCalledWith(200);
      const response = (res.json as ReturnType<typeof vi.fn>).mock.calls[0][0];
      expect(response.metrics.avgSessionDuration).toBe(3600000);
    });
  });

  describe("Detailed Mode", () => {
    it("should truncate session IDs for privacy", async () => {
      req.query = { detailed: "true" };

      vi.mocked(kv.scan).mockResolvedValue(["0", ["session:abc123def456"]]);

      vi.mocked(kv.get).mockResolvedValueOnce({
        userId: 12345,
        login: "octocat",
        accessToken: "token",
        avatarUrl: "url",
        createdAt: Date.now(),
      });

      await handler(req as VercelRequest, res as VercelResponse);

      expect(res.status).toHaveBeenCalledWith(200);
      const response = (res.json as ReturnType<typeof vi.fn>).mock.calls[0][0];
      expect(response.detailed.sessions).toHaveLength(1);
      expect(response.detailed.sessions[0].sessionId).toBe("abc123de...");
    });
  });

  describe("Response Headers", () => {
    it("should set cache headers", async () => {
      await handler(req as VercelRequest, res as VercelResponse);

      expect(res.setHeader).toHaveBeenCalledWith(
        "Cache-Control",
        "public, s-maxage=300, stale-while-revalidate=600",
      );
    });
  });

  describe("Error Handling", () => {
    it("should handle error fetching sessions", async () => {
      vi.mocked(kv.scan).mockRejectedValueOnce(new Error("KV scan failed"));

      await handler(req as VercelRequest, res as VercelResponse);

      expect(console.error).toHaveBeenCalledWith(
        "Error fetching active sessions:",
        expect.any(Error),
      );
      expect(res.status).toHaveBeenCalledWith(200);
      const response = (res.json as ReturnType<typeof vi.fn>).mock.calls[0][0];
      expect(response.metrics.activeSessions).toBe(0);
    });

    it("should handle error fetching events", async () => {
      vi.mocked(kv.zrange).mockRejectedValueOnce(new Error("KV zrange failed"));

      await handler(req as VercelRequest, res as VercelResponse);

      expect(console.error).toHaveBeenCalledWith(
        "Error fetching OAuth events:",
        expect.any(Error),
      );
      expect(res.status).toHaveBeenCalledWith(200);
      const response = (res.json as ReturnType<typeof vi.fn>).mock.calls[0][0];
      expect(response.metrics.totalLogins).toBe(0);
      expect(response.metrics.totalLogouts).toBe(0);
    });

    it("should handle error fetching rate limit stats", async () => {
      vi.mocked(kv.zrange).mockImplementation(
        async (key: string, _min: unknown, _max: unknown, _opts?: unknown) => {
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
        },
      );

      await handler(req as VercelRequest, res as VercelResponse);

      expect(console.error).toHaveBeenCalledWith(
        "Error fetching rate limit stats:",
        expect.any(Error),
      );
      expect(res.status).toHaveBeenCalledWith(200);
      const response = (res.json as ReturnType<typeof vi.fn>).mock.calls[0][0];
      expect(response.metrics.rateLimit).toEqual({
        avgUsage: 0,
        peakUsage: 0,
        avgRemaining: 5000,
      });
    });

    it("should return 500 on unexpected error", async () => {
      const dateError = new Error("Date.now() failed");
      dateNowSpy = vi.spyOn(Date, "now").mockImplementation(() => {
        throw dateError;
      });

      await handler(req as VercelRequest, res as VercelResponse);

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
