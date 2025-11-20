import type { VercelRequest, VercelResponse } from "@vercel/node";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Mock @vercel/kv
vi.mock("@vercel/kv", () => ({
  kv: {
    get: vi.fn(),
    set: vi.fn(),
    del: vi.fn(),
  },
}));

import { kv } from "@vercel/kv";
import handler, { type UserSettings } from "./settings";

describe("User Settings API Endpoint", () => {
  let req: Partial<VercelRequest>;
  let res: Partial<VercelResponse>;
  let originalEnv: NodeJS.ProcessEnv;

  const mockSession = {
    userId: 12345,
    login: "octocat",
    accessToken: "gho_token123",
    avatarUrl: "https://github.com/octocat.png",
    createdAt: Date.now() - 3600000,
  };

  const mockSettings: UserSettings = {
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
    createdAt: 1234567890000,
    updatedAt: 1234567890000,
  };

  beforeEach(() => {
    // Save original environment
    originalEnv = { ...process.env };

    // Create mock request
    req = {
      method: "GET",
      headers: {
        cookie: "session=abc123def456",
      },
      body: {},
    };

    // Create mock response with all required methods
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
      send: vi.fn().mockReturnThis(),
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

  describe("Service Availability", () => {
    it("должен вернуть 503 если KV недоступен", async () => {
      // Re-mock @vercel/kv to return null kv
      vi.resetModules();
      vi.doMock("@vercel/kv", () => ({
        kv: null,
      }));

      // Re-import handler with null kv
      const { default: handlerWithNullKv } = await import("./settings");

      await handlerWithNullKv(req as VercelRequest, res as VercelResponse);

      expect(res.status).toHaveBeenCalledWith(503);
      expect(res.json).toHaveBeenCalledWith({
        error: "Service unavailable",
        message: "User settings service is not configured",
      });
    });
  });

  describe("Authentication & Authorization", () => {
    it("должен вернуть 401 если нет session cookie", async () => {
      req.headers = {};

      await handler(req as VercelRequest, res as VercelResponse);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        error: "Unauthorized",
        message: "No valid session found. Please sign in.",
      });
    });

    it("должен вернуть 401 если session не найдена в KV", async () => {
      vi.mocked(kv.get).mockResolvedValueOnce(null);

      await handler(req as VercelRequest, res as VercelResponse);

      expect(kv.get).toHaveBeenCalledWith("session:abc123def456");
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        error: "Unauthorized",
        message: "Invalid or expired session. Please sign in again.",
      });
    });

    it("должен извлечь session ID из cookie header", async () => {
      req.headers!.cookie = "other=value; session=mysession123; another=value";

      vi.mocked(kv.get)
        .mockResolvedValueOnce(mockSession)
        .mockResolvedValueOnce(mockSettings);

      await handler(req as VercelRequest, res as VercelResponse);

      expect(kv.get).toHaveBeenCalledWith("session:mysession123");
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it("должен обработать ошибку при получении session", async () => {
      vi.mocked(kv.get).mockRejectedValueOnce(new Error("KV get failed"));

      await handler(req as VercelRequest, res as VercelResponse);

      expect(console.error).toHaveBeenCalledWith(
        "Failed to get user from session:",
        expect.any(Error),
      );
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        error: "Unauthorized",
        message: "Invalid or expired session. Please sign in again.",
      });
    });
  });

  describe("GET - Retrieve Settings", () => {
    beforeEach(() => {
      vi.mocked(kv.get).mockResolvedValueOnce(mockSession);
    });

    it("должен вернуть существующие настройки", async () => {
      vi.mocked(kv.get).mockResolvedValueOnce(mockSettings);

      await handler(req as VercelRequest, res as VercelResponse);

      expect(kv.get).toHaveBeenCalledWith("user:12345:settings");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockSettings);
    });

    it("должен создать default настройки если их нет", async () => {
      const now = 1234567890000;
      vi.spyOn(Date, "now").mockReturnValue(now);

      vi.mocked(kv.get).mockResolvedValueOnce(null); // No existing settings

      await handler(req as VercelRequest, res as VercelResponse);

      // Should save default settings
      expect(kv.set).toHaveBeenCalledWith(
        "user:12345:settings",
        {
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
          createdAt: now,
          updatedAt: now,
        },
        { ex: 2592000 },
      );

      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe("PUT - Replace Settings", () => {
    beforeEach(() => {
      req.method = "PUT";
      vi.mocked(kv.get)
        .mockResolvedValueOnce(mockSession)
        .mockResolvedValueOnce(mockSettings);
    });

    it("должен заменить preferences полностью", async () => {
      const now = 1234567900000;
      vi.spyOn(Date, "now").mockReturnValue(now);

      req.body = {
        preferences: {
          defaultAnalyticsPeriod: "week",
          defaultView: "table",
          itemsPerPage: 20,
        },
      };

      await handler(req as VercelRequest, res as VercelResponse);

      expect(kv.set).toHaveBeenCalledWith(
        "user:12345:settings",
        {
          userId: 12345,
          login: "octocat",
          preferences: {
            defaultAnalyticsPeriod: "week",
            defaultView: "table",
            itemsPerPage: 20,
          },
          createdAt: 1234567890000,
          updatedAt: now,
        },
        { ex: 2592000 },
      );

      expect(console.log).toHaveBeenCalledWith(
        "User settings updated: octocat (12345)",
      );
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it("должен вернуть 400 если нет preferences в body", async () => {
      req.body = {};

      await handler(req as VercelRequest, res as VercelResponse);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "Bad request",
        message: "Invalid request body. Expected { preferences: {...} }",
      });
    });

    it("должен вернуть 400 если preferences не объект", async () => {
      req.body = {
        preferences: "invalid",
      };

      await handler(req as VercelRequest, res as VercelResponse);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "Bad request",
        message: "Invalid request body. Expected { preferences: {...} }",
      });
    });
  });

  describe("PATCH - Merge Settings", () => {
    beforeEach(() => {
      req.method = "PATCH";
      vi.mocked(kv.get)
        .mockResolvedValueOnce(mockSession)
        .mockResolvedValueOnce(mockSettings);
    });

    it("должен слить preferences с существующими", async () => {
      const now = 1234567900000;
      vi.spyOn(Date, "now").mockReturnValue(now);

      req.body = {
        preferences: {
          defaultView: "table", // Only update this
          emailNotifications: true, // And this
        },
      };

      await handler(req as VercelRequest, res as VercelResponse);

      expect(kv.set).toHaveBeenCalledWith(
        "user:12345:settings",
        {
          userId: 12345,
          login: "octocat",
          preferences: {
            defaultAnalyticsPeriod: "day", // Preserved
            defaultView: "table", // Updated
            itemsPerPage: 10, // Preserved
            emailNotifications: true, // Updated
            autoRefreshDashboard: false, // Preserved
            refreshInterval: 30000, // Preserved
          },
          createdAt: 1234567890000,
          updatedAt: now,
        },
        { ex: 2592000 },
      );

      expect(res.status).toHaveBeenCalledWith(200);
    });

    it("должен создать defaults если настроек еще нет", async () => {
      vi.mocked(kv.get).mockResolvedValueOnce(null); // No existing settings

      const now = 1234567900000;
      vi.spyOn(Date, "now").mockReturnValue(now);

      req.body = {
        preferences: {
          defaultView: "table",
        },
      };

      await handler(req as VercelRequest, res as VercelResponse);

      // Check that settings were saved with merged preferences
      const savedSettings = (kv.set as ReturnType<typeof vi.fn>).mock
        .calls[0][1];
      expect(savedSettings.preferences.defaultView).toBe("table");
      expect(savedSettings.preferences.defaultAnalyticsPeriod).toBe("day");
      expect(savedSettings.userId).toBe(12345);
      expect(savedSettings.login).toBe("octocat");

      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe("Preference Validation", () => {
    beforeEach(() => {
      req.method = "PUT";
    });

    it("должен отклонить невалидный defaultAnalyticsPeriod", async () => {
      vi.mocked(kv.get)
        .mockResolvedValueOnce(mockSession)
        .mockResolvedValueOnce(mockSettings);

      req.body = {
        preferences: {
          defaultAnalyticsPeriod: "year", // Invalid
        },
      };

      await handler(req as VercelRequest, res as VercelResponse);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "Bad request",
        message:
          "Invalid defaultAnalyticsPeriod. Must be: hour, day, week, or month",
      });
    });
  });

  describe("DELETE - Reset Settings", () => {
    // Note: DELETE happy path is tested in "Error Handling" block below
    // This test has a mock pollution issue when run with other tests
    it("должен удалить настройки из KV (previously skipped)", async () => {
      req.method = "DELETE";
      vi.mocked(kv.get).mockResolvedValueOnce(mockSession);

      await handler(req as VercelRequest, res as VercelResponse);

      expect(kv.del).toHaveBeenCalledWith("user:12345:settings");
      expect(console.log).toHaveBeenCalledWith(
        "User settings deleted: octocat (12345)",
      );
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalledWith("");
    });
  });

  describe("HTTP Method Validation", () => {
    // Note: These tests have mock pollution issues with vi.clearAllMocks()
    // HTTP method validation is an edge case - not critical for coverage
    it("должен отклонить POST запрос (skipped - mock pollution)", async () => {
      req.method = "POST";
      vi.mocked(kv.get).mockResolvedValueOnce(mockSession);

      await handler(req as VercelRequest, res as VercelResponse);

      expect(res.status).toHaveBeenCalledWith(405);
      expect(res.json).toHaveBeenCalledWith({
        error: "Method not allowed",
        message:
          "Method POST is not supported. Use GET, PUT, PATCH, or DELETE.",
      });
    });

    it("должен отклонить HEAD запрос (skipped - mock pollution)", async () => {
      req.method = "HEAD";
      vi.mocked(kv.get).mockResolvedValueOnce(mockSession);

      await handler(req as VercelRequest, res as VercelResponse);

      expect(res.status).toHaveBeenCalledWith(405);
      expect(res.json).toHaveBeenCalledWith({
        error: "Method not allowed",
        message:
          "Method HEAD is not supported. Use GET, PUT, PATCH, or DELETE.",
      });
    });
  });

  describe("Error Handling", () => {
    beforeEach(() => {
      // Mock session lookup for all error handling tests
      vi.mocked(kv.get).mockResolvedValueOnce(mockSession);
    });

    it("должен обработать ошибку при сохранении настроек (PUT - skipped)", async () => {
      req.method = "PUT";
      req.body = {
        preferences: {
          defaultView: "table",
        },
      };

      // Mock settings lookup
      vi.mocked(kv.get).mockResolvedValueOnce(mockSettings);
      // Mock save fails
      vi.mocked(kv.set).mockRejectedValueOnce(new Error("KV write failed"));

      await handler(req as VercelRequest, res as VercelResponse);

      expect(console.error).toHaveBeenCalledWith(
        "User settings error:",
        expect.any(Error),
      );
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: "Internal server error",
        message: "KV write failed",
      });
    });

    it("должен обработать ошибку при удалении настроек (DELETE - skipped)", async () => {
      req.method = "DELETE";

      // Mock delete fails
      vi.mocked(kv.del).mockRejectedValueOnce(new Error("KV delete failed"));

      await handler(req as VercelRequest, res as VercelResponse);

      expect(console.error).toHaveBeenCalledWith(
        "User settings error:",
        expect.any(Error),
      );
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: "Internal server error",
        message: "KV delete failed",
      });
    });
  });
});
