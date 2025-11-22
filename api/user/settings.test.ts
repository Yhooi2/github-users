import { kv } from "@vercel/kv";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import handler from "./settings";

// Mock @vercel/kv
vi.mock("@vercel/kv", () => ({
  kv: {
    get: vi.fn(),
    set: vi.fn(),
    del: vi.fn(),
  },
}));

// Mock console methods
const originalConsoleLog = console.log;
const originalConsoleError = console.error;

describe("User Settings API Endpoint", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    console.log = vi.fn();
    console.error = vi.fn();

    // Ensure all mocked functions return resolved promises by default
    vi.mocked(kv.get).mockResolvedValue(null);
    vi.mocked(kv.set).mockResolvedValue("OK");
    vi.mocked(kv.del).mockResolvedValue(0);
  });

  afterEach(() => {
    console.log = originalConsoleLog;
    console.error = originalConsoleError;
  });

  // Helper function to create mock response
  const mockResponse = () => {
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
      send: vi.fn().mockReturnThis(),
      setHeader: vi.fn().mockReturnThis(),
    };
    return res as unknown as VercelResponse;
  };

  // Helper function to create mock session in KV
  const mockSession = (userId: number, login: string) => {
    return {
      userId,
      login,
      accessToken: "mock_token",
      avatarUrl: "https://avatars.githubusercontent.com/u/123",
      createdAt: Date.now(),
    };
  };

  describe("GET - Retrieve Settings", () => {
    it("should return user settings from KV", async () => {
      const req = {
        method: "GET",
        headers: {
          cookie: "session=test_session_id",
        },
        query: {},
      };
      const res = mockResponse();

      const mockSettings = {
        userId: 12345,
        login: "octocat",
        preferences: {
          defaultAnalyticsPeriod: "day",
          defaultView: "card",
          itemsPerPage: 10,
        },
        createdAt: 1234567890,
        updatedAt: 1234567890,
      };

      // Мокируем получение сессии
      vi.mocked(kv.get).mockResolvedValueOnce(mockSession(12345, "octocat"));
      // Мокируем получение настроек
      vi.mocked(kv.get).mockResolvedValueOnce(mockSettings);

      await handler(req as VercelRequest, res as VercelResponse);

      expect(kv.get).toHaveBeenCalledWith("session:test_session_id");
      expect(kv.get).toHaveBeenCalledWith("user:12345:settings");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockSettings);
    });

    it("should create default settings if none exist", async () => {
      const req = {
        method: "GET",
        headers: {
          cookie: "session=test_session_id",
        },
        query: {},
      };
      const res = mockResponse();

      // Мокируем получение сессии
      vi.mocked(kv.get).mockResolvedValueOnce(mockSession(12345, "octocat"));
      // Нет настроек
      vi.mocked(kv.get).mockResolvedValueOnce(null);

      await handler(req as VercelRequest, res as VercelResponse);

      expect(kv.set).toHaveBeenCalled();
      const setCall = vi.mocked(kv.set).mock.calls[0];
      expect(setCall[0]).toBe("user:12345:settings");
      expect(setCall[1]).toMatchObject({
        userId: 12345,
        login: "octocat",
        preferences: {
          defaultAnalyticsPeriod: "day",
          defaultView: "card",
          itemsPerPage: 10,
          emailNotifications: false,
          autoRefreshDashboard: false,
          refreshInterval: 30000,
        },
      });
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it("should return 401 if no cookie present", async () => {
      const req = {
        method: "GET",
        headers: {},
        query: {},
      };
      const res = mockResponse();

      await handler(req as VercelRequest, res as VercelResponse);

      expect(kv.get).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        error: "Unauthorized",
        message: "No valid session found. Please sign in.",
      });
    });

    it("should return 401 if session not found", async () => {
      const req = {
        method: "GET",
        headers: {
          cookie: "session=invalid_session",
        },
        query: {},
      };
      const res = mockResponse();

      vi.mocked(kv.get).mockResolvedValueOnce(null);

      await handler(req as VercelRequest, res as VercelResponse);

      expect(kv.get).toHaveBeenCalledWith("session:invalid_session");
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        error: "Unauthorized",
        message: "Invalid or expired session. Please sign in again.",
      });
    });

    it("should handle KV read error", async () => {
      const req = {
        method: "GET",
        headers: {
          cookie: "session=test_session_id",
        },
        query: {},
      };
      const res = mockResponse();

      const error = new Error("KV read error");
      vi.mocked(kv.get).mockRejectedValueOnce(error);

      await handler(req as VercelRequest, res as VercelResponse);

      expect(console.error).toHaveBeenCalledWith(
        "Failed to get user from session:",
        error,
      );
      expect(res.status).toHaveBeenCalledWith(401);
    });
  });

  describe("PUT - Update Settings (Full Replace)", () => {
    it("should fully replace preferences on PUT", async () => {
      const req = {
        method: "PUT",
        headers: {
          cookie: "session=test_session_id",
        },
        query: {},
        body: {
          preferences: {
            defaultAnalyticsPeriod: "week",
            defaultView: "table",
          },
        },
      };
      const res = mockResponse();

      vi.mocked(kv.get).mockResolvedValueOnce(mockSession(12345, "octocat"));
      vi.mocked(kv.get).mockResolvedValueOnce(null); // Нет существующих настроек

      await handler(req as VercelRequest, res as VercelResponse);

      expect(kv.set).toHaveBeenCalled();
      const setCall = vi.mocked(kv.set).mock.calls[0];
      expect(setCall[1]).toMatchObject({
        userId: 12345,
        login: "octocat",
        preferences: {
          defaultAnalyticsPeriod: "week",
          defaultView: "table",
        },
      });
      expect(console.log).toHaveBeenCalledWith(
        "User settings updated: octocat (12345)",
      );
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it("should return 400 if preferences are invalid", async () => {
      const req = {
        method: "PUT",
        headers: {
          cookie: "session=test_session_id",
        },
        query: {},
        body: {
          preferences: null,
        },
      };
      const res = mockResponse();

      vi.mocked(kv.get).mockResolvedValueOnce(mockSession(12345, "octocat"));

      await handler(req as VercelRequest, res as VercelResponse);

      expect(kv.set).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "Bad request",
        message: "Invalid request body. Expected { preferences: {...} }",
      });
    });

    it("should validate defaultAnalyticsPeriod", async () => {
      const req = {
        method: "PUT",
        headers: {
          cookie: "session=test_session_id",
        },
        query: {},
        body: {
          preferences: {
            defaultAnalyticsPeriod: "invalid",
          },
        },
      };
      const res = mockResponse();

      vi.mocked(kv.get).mockResolvedValueOnce(mockSession(12345, "octocat"));
      vi.mocked(kv.get).mockResolvedValueOnce(null);

      await handler(req as VercelRequest, res as VercelResponse);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "Bad request",
        message:
          "Invalid defaultAnalyticsPeriod. Must be: hour, day, week, or month",
      });
    });

    it("should validate itemsPerPage", async () => {
      const req = {
        method: "PUT",
        headers: {
          cookie: "session=test_session_id",
        },
        query: {},
        body: {
          preferences: {
            itemsPerPage: 150,
          },
        },
      };
      const res = mockResponse();

      vi.mocked(kv.get).mockResolvedValueOnce(mockSession(12345, "octocat"));
      vi.mocked(kv.get).mockResolvedValueOnce(null);

      await handler(req as VercelRequest, res as VercelResponse);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "Bad request",
        message: "Invalid itemsPerPage. Must be between 1 and 100",
      });
    });
  });

  describe("PATCH - Partial Settings Update", () => {
    it("should merge new settings with existing ones", async () => {
      const existingSettings = {
        userId: 12345,
        login: "octocat",
        preferences: {
          defaultAnalyticsPeriod: "day" as const,
          defaultView: "card" as const,
          itemsPerPage: 10,
          emailNotifications: false,
        },
        createdAt: 1234567890,
        updatedAt: 1234567890,
      };

      const req = {
        method: "PATCH",
        headers: {
          cookie: "session=test_session_id",
        },
        query: {},
        body: {
          preferences: {
            defaultView: "table",
            itemsPerPage: 20,
          },
        },
      };
      const res = mockResponse();

      vi.mocked(kv.get).mockResolvedValueOnce(mockSession(12345, "octocat"));
      vi.mocked(kv.get).mockResolvedValueOnce(existingSettings);

      await handler(req as VercelRequest, res as VercelResponse);

      expect(kv.set).toHaveBeenCalled();
      const setCall = vi.mocked(kv.set).mock.calls[0];
      expect(setCall[1]).toMatchObject({
        preferences: {
          defaultAnalyticsPeriod: "day",
          defaultView: "table",
          itemsPerPage: 20,
          emailNotifications: false,
        },
      });
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe("DELETE - Delete Settings", () => {
    it("should delete settings from KV", async () => {
      const req = {
        method: "DELETE",
        headers: {
          cookie: "session=test_session_id",
        },
        query: {},
      };
      const res = mockResponse();

      vi.mocked(kv.get).mockResolvedValueOnce(mockSession(12345, "octocat"));
      vi.mocked(kv.del).mockResolvedValueOnce(1);

      await handler(req as VercelRequest, res as VercelResponse);

      expect(kv.del).toHaveBeenCalledWith("user:12345:settings");
      expect(console.log).toHaveBeenCalledWith(
        "User settings deleted: octocat (12345)",
      );
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalledWith("");
    });

    it("should return 401 if no session", async () => {
      const req = {
        method: "DELETE",
        headers: {},
        query: {},
      };
      const res = mockResponse();

      await handler(req as VercelRequest, res as VercelResponse);

      expect(kv.del).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(401);
    });

    it("should handle KV delete error", async () => {
      const req = {
        method: "DELETE",
        headers: {
          cookie: "session=test_session_id",
        },
        query: {},
      };
      const res = mockResponse();

      vi.mocked(kv.get).mockResolvedValueOnce(mockSession(12345, "octocat"));
      const error = new Error("KV delete error");
      vi.mocked(kv.del).mockRejectedValueOnce(error);

      await handler(req as VercelRequest, res as VercelResponse);

      expect(console.error).toHaveBeenCalledWith("User settings error:", error);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: "Internal server error",
        message: "KV delete error",
      });
    });
  });

  describe("Unsupported Methods", () => {
    it("should return 405 for OPTIONS request", async () => {
      const req = {
        method: "OPTIONS",
        headers: {
          cookie: "session=test_session_id",
        },
        query: {},
      };
      const res = mockResponse();

      vi.mocked(kv.get).mockResolvedValueOnce(mockSession(12345, "octocat"));

      await handler(req as VercelRequest, res as VercelResponse);

      expect(res.status).toHaveBeenCalledWith(405);
      expect(res.json).toHaveBeenCalledWith({
        error: "Method not allowed",
        message:
          "Method OPTIONS is not supported. Use GET, PUT, PATCH, or DELETE.",
      });
    });
  });

  describe("Error Handling", () => {
    it("should handle general handler error", async () => {
      const req = {
        method: "GET",
        headers: {
          cookie: "session=test_session_id",
        },
        query: {},
      };
      const res = mockResponse();

      const error = new Error("Unexpected error");
      vi.mocked(kv.get).mockRejectedValueOnce(error);

      await handler(req as VercelRequest, res as VercelResponse);

      expect(console.error).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(401);
    });

    it("should handle error when saving settings", async () => {
      const req = {
        method: "PUT",
        headers: {
          cookie: "session=test_session_id",
        },
        query: {},
        body: {
          preferences: {
            defaultView: "card",
          },
        },
      };
      const res = mockResponse();

      vi.mocked(kv.get).mockResolvedValueOnce(mockSession(12345, "octocat"));
      vi.mocked(kv.get).mockResolvedValueOnce(null);

      const error = new Error("KV write error");
      vi.mocked(kv.set).mockRejectedValueOnce(error);

      await handler(req as VercelRequest, res as VercelResponse);

      expect(console.error).toHaveBeenCalledWith("User settings error:", error);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: "Internal server error",
        message: "KV write error",
      });
    });

    it("should handle multiple concurrent requests safely", async () => {
      const req = {
        method: "GET",
        headers: {
          cookie: "session=test_session_id",
        },
        query: {},
      };

      const mockSettings = {
        userId: 12345,
        login: "octocat",
        preferences: {
          defaultAnalyticsPeriod: "day" as const,
          defaultView: "card" as const,
          itemsPerPage: 10,
        },
        createdAt: 1234567890,
        updatedAt: 1234567890,
      };

      // Mock for multiple concurrent calls
      vi.mocked(kv.get).mockResolvedValue(mockSession(12345, "octocat"));
      vi.mocked(kv.get).mockResolvedValue(mockSettings);

      const promises = Array.from({ length: 3 }, () => {
        const res = mockResponse();
        return handler(req as VercelRequest, res as VercelResponse);
      });

      await Promise.all(promises);

      // All requests should complete without errors
      expect(console.error).not.toHaveBeenCalled();
    });
  });
});
