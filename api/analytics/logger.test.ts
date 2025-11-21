import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type {
  OAuthLoginEvent,
  OAuthLogoutEvent,
  RateLimitSnapshot,
} from "./logger";

// Mock @vercel/kv
const mockKv = {
  zadd: vi.fn().mockResolvedValue(1),
  expire: vi.fn().mockResolvedValue(1),
  get: vi.fn(),
  set: vi.fn(),
  zremrangebyscore: vi.fn().mockResolvedValue(1),
};

vi.mock("@vercel/kv", () => ({
  kv: mockKv,
}));

describe("OAuth Analytics Logger", () => {
  let originalEnv: NodeJS.ProcessEnv;
  let logOAuthLogin: any;
  let logOAuthLogout: any;
  let logRateLimitSnapshot: any;
  let updateSessionActivity: any;
  let cleanupOldAnalytics: any;

  beforeEach(async () => {
    originalEnv = { ...process.env };
    process.env.KV_REST_API_URL = "https://test-kv.vercel.com";
    process.env.KV_REST_API_TOKEN = "test-token";

    // Сбрасываем кеш модулей и импортируем заново
    vi.resetModules();

    const module = await import("./logger");
    logOAuthLogin = module.logOAuthLogin;
    logOAuthLogout = module.logOAuthLogout;
    logRateLimitSnapshot = module.logRateLimitSnapshot;
    updateSessionActivity = module.updateSessionActivity;
    cleanupOldAnalytics = module.cleanupOldAnalytics;

    vi.spyOn(console, "log").mockImplementation(() => {});
    vi.spyOn(console, "warn").mockImplementation(() => {});
    vi.spyOn(console, "error").mockImplementation(() => {});

    vi.clearAllMocks();
  });

  afterEach(() => {
    process.env = originalEnv;
    vi.restoreAllMocks();
  });

  describe("logOAuthLogin", () => {
    it("должен логировать OAuth login в KV", async () => {
      const event: OAuthLoginEvent = {
        timestamp: 1234567890000,
        userId: 12345,
        login: "octocat",
        sessionId: "sess_abc123",
      };

      await logOAuthLogin(event);

      expect(mockKv.zadd).toHaveBeenCalledWith("analytics:oauth:logins", {
        score: event.timestamp,
        member: JSON.stringify({
          timestamp: event.timestamp,
          userId: event.userId,
          login: event.login,
          sessionId: event.sessionId,
        }),
      });

      expect(mockKv.expire).toHaveBeenCalledWith(
        "analytics:oauth:logins",
        2592000,
      );

      expect(console.log).toHaveBeenCalledWith(
        "OAuth login logged: octocat (12345)",
      );
    });

    it("должен обработать ошибку при zadd", async () => {
      const event: OAuthLoginEvent = {
        timestamp: 1234567890000,
        userId: 12345,
        login: "octocat",
        sessionId: "sess_abc123",
      };

      const error = new Error("zadd failed");
      mockKv.zadd.mockRejectedValueOnce(error);

      await logOAuthLogin(event);

      expect(console.error).toHaveBeenCalledWith(
        "Failed to log OAuth login:",
        error,
      );
    });
  });

  describe("logOAuthLogout", () => {
    it("должен логировать OAuth logout в KV", async () => {
      const event: OAuthLogoutEvent = {
        timestamp: 1234567890000,
        userId: 12345,
        login: "octocat",
        sessionId: "sess_abc123",
      };

      await logOAuthLogout(event);

      expect(mockKv.zadd).toHaveBeenCalledWith("analytics:oauth:logouts", {
        score: event.timestamp,
        member: JSON.stringify({
          timestamp: event.timestamp,
          userId: event.userId,
          login: event.login,
          sessionId: event.sessionId,
        }),
      });

      expect(mockKv.expire).toHaveBeenCalledWith(
        "analytics:oauth:logouts",
        2592000,
      );

      expect(console.log).toHaveBeenCalledWith(
        "OAuth logout logged: octocat (12345)",
      );
    });

    it("должен обработать ошибку при zadd", async () => {
      const event: OAuthLogoutEvent = {
        timestamp: 1234567890000,
        userId: 12345,
        login: "octocat",
        sessionId: "sess_abc123",
      };

      const error = new Error("zadd failed");
      mockKv.zadd.mockRejectedValueOnce(error);

      await logOAuthLogout(event);

      expect(console.error).toHaveBeenCalledWith(
        "Failed to log OAuth logout:",
        error,
      );
    });
  });

  describe("logRateLimitSnapshot", () => {
    it("должен логировать rate limit snapshot в KV (demo mode)", async () => {
      const snapshot: RateLimitSnapshot = {
        timestamp: 1234567890000,
        remaining: 4999,
        limit: 5000,
        used: 1,
        isDemo: true,
      };

      await logRateLimitSnapshot(snapshot);

      expect(mockKv.zadd).toHaveBeenCalledWith("analytics:ratelimit", {
        score: snapshot.timestamp,
        member: JSON.stringify({
          timestamp: snapshot.timestamp,
          remaining: snapshot.remaining,
          limit: snapshot.limit,
          used: snapshot.used,
          isDemo: snapshot.isDemo,
          userLogin: undefined,
        }),
      });

      expect(mockKv.expire).toHaveBeenCalledWith("analytics:ratelimit", 604800);
    });

    it("должен логировать rate limit snapshot с userLogin (auth mode)", async () => {
      const snapshot: RateLimitSnapshot = {
        timestamp: 1234567890000,
        remaining: 4999,
        limit: 5000,
        used: 1,
        isDemo: false,
        userLogin: "octocat",
      };

      await logRateLimitSnapshot(snapshot);

      expect(mockKv.zadd).toHaveBeenCalledWith("analytics:ratelimit", {
        score: snapshot.timestamp,
        member: JSON.stringify({
          timestamp: snapshot.timestamp,
          remaining: snapshot.remaining,
          limit: snapshot.limit,
          used: snapshot.used,
          isDemo: snapshot.isDemo,
          userLogin: snapshot.userLogin,
        }),
      });
    });

    it("должен обработать ошибку при zadd", async () => {
      const snapshot: RateLimitSnapshot = {
        timestamp: 1234567890000,
        remaining: 4999,
        limit: 5000,
        used: 1,
        isDemo: true,
      };

      const error = new Error("zadd failed");
      mockKv.zadd.mockRejectedValueOnce(error);

      await logRateLimitSnapshot(snapshot);

      expect(console.error).toHaveBeenCalledWith(
        "Failed to log rate limit snapshot:",
        error,
      );
    });
  });

  describe("updateSessionActivity", () => {
    it("должен обновить lastActivity timestamp для существующей сессии", async () => {
      const mockSession = {
        userId: 12345,
        login: "octocat",
        accessToken: "gho_token",
        avatarUrl: "https://github.com/octocat.png",
        createdAt: 1234567890000,
      };

      const now = 1234567900000;
      vi.spyOn(Date, "now").mockReturnValue(now);

      mockKv.get.mockResolvedValueOnce(mockSession);

      await updateSessionActivity("sess_abc123");

      expect(mockKv.get).toHaveBeenCalledWith("session:sess_abc123");

      expect(mockKv.set).toHaveBeenCalledWith(
        "session:sess_abc123",
        {
          ...mockSession,
          lastActivity: now,
        },
        { ex: 2592000 },
      );
    });

    it("должен сохранить существующий lastActivity если он был", async () => {
      const mockSession = {
        userId: 12345,
        login: "octocat",
        accessToken: "gho_token",
        avatarUrl: "https://github.com/octocat.png",
        createdAt: 1234567890000,
        lastActivity: 1234567895000,
      };

      const now = 1234567900000;
      vi.spyOn(Date, "now").mockReturnValue(now);

      mockKv.get.mockResolvedValueOnce(mockSession);

      await updateSessionActivity("sess_abc123");

      expect(mockKv.set).toHaveBeenCalledWith(
        "session:sess_abc123",
        {
          ...mockSession,
          lastActivity: now,
        },
        { ex: 2592000 },
      );
    });

    it("не должен ничего делать если сессия не найдена", async () => {
      mockKv.get.mockResolvedValueOnce(null);

      await updateSessionActivity("sess_nonexistent");

      expect(mockKv.get).toHaveBeenCalledWith("session:sess_nonexistent");
      expect(mockKv.set).not.toHaveBeenCalled();
    });

    it("должен обработать ошибку при get", async () => {
      const error = new Error("get failed");
      mockKv.get.mockRejectedValueOnce(error);

      await updateSessionActivity("sess_abc123");

      expect(console.error).toHaveBeenCalledWith(
        "Failed to update session activity:",
        error,
      );
    });

    it("должен обработать ошибку при set", async () => {
      const mockSession = {
        userId: 12345,
        login: "octocat",
        accessToken: "gho_token",
        avatarUrl: "https://github.com/octocat.png",
        createdAt: 1234567890000,
      };

      mockKv.get.mockResolvedValueOnce(mockSession);

      const error = new Error("set failed");
      mockKv.set.mockRejectedValueOnce(error);

      await updateSessionActivity("sess_abc123");

      expect(console.error).toHaveBeenCalledWith(
        "Failed to update session activity:",
        error,
      );
    });
  });

  describe("cleanupOldAnalytics", () => {
    it("должен удалить старые login events (>30 дней)", async () => {
      const now = 1234567890000;
      vi.spyOn(Date, "now").mockReturnValue(now);

      await cleanupOldAnalytics();

      const thirtyDaysAgo = now - 2592000000;
      expect(mockKv.zremrangebyscore).toHaveBeenCalledWith(
        "analytics:oauth:logins",
        0,
        thirtyDaysAgo,
      );
    });

    it("должен удалить старые logout events (>30 дней)", async () => {
      const now = 1234567890000;
      vi.spyOn(Date, "now").mockReturnValue(now);

      await cleanupOldAnalytics();

      const thirtyDaysAgo = now - 2592000000;
      expect(mockKv.zremrangebyscore).toHaveBeenCalledWith(
        "analytics:oauth:logouts",
        0,
        thirtyDaysAgo,
      );
    });

    it("должен удалить старые rate limit snapshots (>7 дней)", async () => {
      const now = 1234567890000;
      vi.spyOn(Date, "now").mockReturnValue(now);

      await cleanupOldAnalytics();

      const sevenDaysAgo = now - 604800000;
      expect(mockKv.zremrangebyscore).toHaveBeenCalledWith(
        "analytics:ratelimit",
        0,
        sevenDaysAgo,
      );
    });

    it("должен логировать успешный cleanup", async () => {
      await cleanupOldAnalytics();

      expect(console.log).toHaveBeenCalledWith("Analytics cleanup completed");
    });

    it("должен обработать ошибку при cleanup", async () => {
      const error = new Error("zremrangebyscore failed");
      mockKv.zremrangebyscore.mockRejectedValueOnce(error);

      await cleanupOldAnalytics();

      expect(console.error).toHaveBeenCalledWith(
        "Failed to cleanup old analytics:",
        error,
      );
    });
  });
});
