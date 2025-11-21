import type { VercelRequest, VercelResponse } from "@vercel/node";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { UserSettings } from "./settings";

// Mock @vercel/kv
const mockKv = {
  get: vi.fn(),
  set: vi.fn(),
  del: vi.fn().mockResolvedValue(1),
};

vi.mock("@vercel/kv", () => ({
  kv: mockKv,
}));

describe("User Settings API Endpoint", () => {
  let req: Partial<VercelRequest>;
  let res: Partial<VercelResponse>;
  let originalEnv: NodeJS.ProcessEnv;
  let handler: any;

  const mockSession = {
    userId: 12345,
    login: "octocat",
    accessToken: "gho_token123",
    avatarUrl: "https://github.com/octocat.png",
    createdAt: Date.now() - 3600000,
  };

  const mockSettings: typeof UserSettings = {
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

  beforeEach(async () => {
    originalEnv = { ...process.env };
    process.env.KV_REST_API_URL = "https://test-kv.vercel.com";
    process.env.KV_REST_API_TOKEN = "test-token";

    // Сбрасываем кеш модулей и импортируем заново
    vi.resetModules();

    const module = await import("./settings");
    handler = module.default;

    req = {
      method: "GET",
      headers: {
        cookie: "session=abc123def456",
      },
      body: {},
    };

    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
      send: vi.fn().mockReturnThis(),
    };

    vi.spyOn(console, "log").mockImplementation(() => {});
    vi.spyOn(console, "warn").mockImplementation(() => {});
    vi.spyOn(console, "error").mockImplementation(() => {});

    vi.clearAllMocks();
  });

  afterEach(() => {
    process.env = originalEnv;
    vi.restoreAllMocks();
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
      mockKv.get.mockResolvedValueOnce(null);

      await handler(req as VercelRequest, res as VercelResponse);

      expect(mockKv.get).toHaveBeenCalledWith("session:abc123def456");
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        error: "Unauthorized",
        message: "Invalid or expired session. Please sign in again.",
      });
    });

    it("должен извлечь session ID из cookie header", async () => {
      req.headers!.cookie = "other=value; session=mysession123; another=value";

      mockKv.get
        .mockResolvedValueOnce(mockSession)
        .mockResolvedValueOnce(mockSettings);

      await handler(req as VercelRequest, res as VercelResponse);

      expect(mockKv.get).toHaveBeenCalledWith("session:mysession123");
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it("должен обработать ошибку при получении session", async () => {
      mockKv.get.mockRejectedValueOnce(new Error("KV get failed"));

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
      mockKv.get.mockResolvedValueOnce(mockSession);
    });

    it("должен вернуть существующие настройки", async () => {
      mockKv.get.mockResolvedValueOnce(mockSettings);

      await handler(req as VercelRequest, res as VercelResponse);

      expect(mockKv.get).toHaveBeenCalledWith("user:12345:settings");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockSettings);
    });

    it("должен создать default настройки если их нет", async () => {
      const now = 1234567890000;
      vi.spyOn(Date, "now").mockReturnValue(now);

      mockKv.get.mockResolvedValueOnce(null);

      await handler(req as VercelRequest, res as VercelResponse);

      expect(mockKv.set).toHaveBeenCalledWith(
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
      mockKv.get
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

      expect(mockKv.set).toHaveBeenCalledWith(
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
      mockKv.get
        .mockResolvedValueOnce(mockSession)
        .mockResolvedValueOnce(mockSettings);
    });

    it("должен слить preferences с существующими", async () => {
      const now = 1234567900000;
      vi.spyOn(Date, "now").mockReturnValue(now);

      req.body = {
        preferences: {
          defaultView: "table",
          emailNotifications: true,
        },
      };

      await handler(req as VercelRequest, res as VercelResponse);

      expect(mockKv.set).toHaveBeenCalledWith(
        "user:12345:settings",
        {
          userId: 12345,
          login: "octocat",
          preferences: {
            defaultAnalyticsPeriod: "day",
            defaultView: "table",
            itemsPerPage: 10,
            emailNotifications: true,
            autoRefreshDashboard: false,
            refreshInterval: 30000,
          },
          createdAt: 1234567890000,
          updatedAt: now,
        },
        { ex: 2592000 },
      );

      expect(res.status).toHaveBeenCalledWith(200);
    });

    it("должен создать defaults если настроек еще нет", async () => {
      mockKv.get.mockResolvedValueOnce(null);

      const now = 1234567900000;
      vi.spyOn(Date, "now").mockReturnValue(now);

      req.body = {
        preferences: {
          defaultView: "table",
        },
      };

      await handler(req as VercelRequest, res as VercelResponse);

      const savedSettings = (mockKv.set as ReturnType<typeof vi.fn>).mock
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
      mockKv.get
        .mockResolvedValueOnce(mockSession)
        .mockResolvedValueOnce(mockSettings);

      req.body = {
        preferences: {
          defaultAnalyticsPeriod: "year",
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
    it("должен удалить настройки из KV", async () => {
      req.method = "DELETE";
      mockKv.get.mockResolvedValueOnce(mockSession);
      mockKv.del.mockResolvedValueOnce(1);

      await handler(req as VercelRequest, res as VercelResponse);

      expect(mockKv.del).toHaveBeenCalledWith("user:12345:settings");
      expect(console.log).toHaveBeenCalledWith(
        "User settings deleted: octocat (12345)",
      );
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalledWith("");
    });
  });

  describe("HTTP Method Validation", () => {
    it("должен отклонить POST запрос", async () => {
      req.method = "POST";
      mockKv.get.mockResolvedValueOnce(mockSession);

      await handler(req as VercelRequest, res as VercelResponse);

      expect(res.status).toHaveBeenCalledWith(405);
      expect(res.json).toHaveBeenCalledWith({
        error: "Method not allowed",
        message:
          "Method POST is not supported. Use GET, PUT, PATCH, or DELETE.",
      });
    });

    it("должен отклонить HEAD запрос", async () => {
      req.method = "HEAD";
      mockKv.get.mockResolvedValueOnce(mockSession);

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
      mockKv.get.mockResolvedValueOnce(mockSession);
    });

    it("должен обработать ошибку при сохранении настроек (PUT)", async () => {
      req.method = "PUT";
      req.body = {
        preferences: {
          defaultView: "table",
        },
      };

      mockKv.get.mockResolvedValueOnce(mockSettings);
      mockKv.set.mockRejectedValueOnce(new Error("KV write failed"));

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

    it("должен обработать ошибку при удалении настроек (DELETE)", async () => {
      req.method = "DELETE";

      mockKv.del.mockRejectedValueOnce(new Error("KV delete failed"));

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
