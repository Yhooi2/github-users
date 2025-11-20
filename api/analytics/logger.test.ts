import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  cleanupOldAnalytics,
  logOAuthLogin,
  logOAuthLogout,
  logRateLimitSnapshot,
  updateSessionActivity,
  type OAuthLoginEvent,
  type OAuthLogoutEvent,
  type RateLimitSnapshot,
} from "./logger";

// Mock @vercel/kv
vi.mock("@vercel/kv", () => ({
  kv: {
    zadd: vi.fn(),
    expire: vi.fn(),
    set: vi.fn(),
    get: vi.fn(),
    zremrangebyscore: vi.fn(),
  },
}));

import { kv } from "@vercel/kv";

describe("OAuth Analytics Logger", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock console methods to avoid noise in test output
    vi.spyOn(console, "log").mockImplementation(() => {});
    vi.spyOn(console, "warn").mockImplementation(() => {});
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
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

      // Проверяем zadd вызов
      expect(
        kv.zadd,
        "logOAuthLogin should store login event in analytics:oauth:logins sorted set with timestamp as score",
      ).toHaveBeenCalledWith("analytics:oauth:logins", {
        score: event.timestamp,
        member: JSON.stringify({
          timestamp: event.timestamp,
          userId: event.userId,
          login: event.login,
          sessionId: event.sessionId,
        }),
      });

      // Проверяем expire (30 дней)
      expect(
        kv.expire,
        "logOAuthLogin should set 30-day TTL (2592000 seconds) on login analytics data",
      ).toHaveBeenCalledWith("analytics:oauth:logins", 2592000);

      // Проверяем console.log
      expect(
        console.log,
        "logOAuthLogin should log user login with username and userId for monitoring",
      ).toHaveBeenCalledWith("OAuth login logged: octocat (12345)");
    });

    it("должен пропустить логирование если KV недоступен", async () => {
      // Re-mock @vercel/kv to return null kv
      vi.resetModules();
      vi.doMock("@vercel/kv", () => ({
        kv: null,
      }));

      // Re-import logger with null kv
      const { logOAuthLogin: logOAuthLoginWithNullKv } = await import(
        "./logger"
      );

      const event: OAuthLoginEvent = {
        timestamp: 1234567890000,
        userId: 12345,
        login: "octocat",
        sessionId: "sess_abc123",
      };

      await logOAuthLoginWithNullKv(event);

      expect(console.warn).toHaveBeenCalledWith(
        "KV not available, skipping OAuth login logging",
      );
    });

    it("должен обработать ошибку при zadd", async () => {
      const event: OAuthLoginEvent = {
        timestamp: 1234567890000,
        userId: 12345,
        login: "octocat",
        sessionId: "sess_abc123",
      };

      const error = new Error("KV connection failed");
      vi.mocked(kv.zadd).mockRejectedValueOnce(error);

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

      // Проверяем zadd вызов
      expect(kv.zadd).toHaveBeenCalledWith("analytics:oauth:logouts", {
        score: event.timestamp,
        member: JSON.stringify({
          timestamp: event.timestamp,
          userId: event.userId,
          login: event.login,
          sessionId: event.sessionId,
        }),
      });

      // Проверяем expire (30 дней)
      expect(kv.expire).toHaveBeenCalledWith(
        "analytics:oauth:logouts",
        2592000,
      );

      // Проверяем console.log
      expect(console.log).toHaveBeenCalledWith(
        "OAuth logout logged: octocat (12345)",
      );
    });

    it("должен пропустить логирование если KV недоступен", async () => {
      // Re-mock @vercel/kv to return null kv
      vi.resetModules();
      vi.doMock("@vercel/kv", () => ({
        kv: null,
      }));

      // Re-import logger with null kv
      const { logOAuthLogout: logOAuthLogoutWithNullKv } = await import(
        "./logger"
      );

      const event: OAuthLogoutEvent = {
        timestamp: 1234567890000,
        userId: 12345,
        login: "octocat",
        sessionId: "sess_abc123",
      };

      await logOAuthLogoutWithNullKv(event);

      expect(console.warn).toHaveBeenCalledWith(
        "KV not available, skipping OAuth logout logging",
      );
    });

    it("должен обработать ошибку при zadd", async () => {
      const event: OAuthLogoutEvent = {
        timestamp: 1234567890000,
        userId: 12345,
        login: "octocat",
        sessionId: "sess_abc123",
      };

      const error = new Error("KV connection failed");
      vi.mocked(kv.zadd).mockRejectedValueOnce(error);

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
        remaining: 4500,
        limit: 5000,
        used: 500,
        isDemo: true,
      };

      await logRateLimitSnapshot(snapshot);

      // Проверяем zadd вызов
      expect(kv.zadd).toHaveBeenCalledWith("analytics:ratelimit", {
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

      // Проверяем expire (7 дней)
      expect(kv.expire).toHaveBeenCalledWith("analytics:ratelimit", 604800);
    });

    it("должен логировать rate limit snapshot с userLogin (auth mode)", async () => {
      const snapshot: RateLimitSnapshot = {
        timestamp: 1234567890000,
        remaining: 4800,
        limit: 5000,
        used: 200,
        isDemo: false,
        userLogin: "octocat",
      };

      await logRateLimitSnapshot(snapshot);

      // Проверяем zadd вызов
      expect(kv.zadd).toHaveBeenCalledWith("analytics:ratelimit", {
        score: snapshot.timestamp,
        member: JSON.stringify({
          timestamp: snapshot.timestamp,
          remaining: snapshot.remaining,
          limit: snapshot.limit,
          used: snapshot.used,
          isDemo: snapshot.isDemo,
          userLogin: "octocat",
        }),
      });

      // Проверяем expire (7 дней)
      expect(kv.expire).toHaveBeenCalledWith("analytics:ratelimit", 604800);
    });

    it("должен пропустить логирование если KV недоступен (без warning)", async () => {
      // Re-mock @vercel/kv to return null kv
      vi.resetModules();
      vi.doMock("@vercel/kv", () => ({
        kv: null,
      }));

      // Re-import logger with null kv
      const { logRateLimitSnapshot: logRateLimitSnapshotWithNullKv } =
        await import("./logger");

      const snapshot: RateLimitSnapshot = {
        timestamp: 1234567890000,
        remaining: 4500,
        limit: 5000,
        used: 500,
        isDemo: true,
      };

      await logRateLimitSnapshotWithNullKv(snapshot);

      // Не должно быть warning (silent skip)
      expect(console.warn).not.toHaveBeenCalled();
    });

    it("должен обработать ошибку при zadd", async () => {
      const snapshot: RateLimitSnapshot = {
        timestamp: 1234567890000,
        remaining: 4500,
        limit: 5000,
        used: 500,
        isDemo: true,
      };

      const error = new Error("KV connection failed");
      vi.mocked(kv.zadd).mockRejectedValueOnce(error);

      await logRateLimitSnapshot(snapshot);

      expect(console.error).toHaveBeenCalledWith(
        "Failed to log rate limit snapshot:",
        error,
      );
    });
  });

  describe("updateSessionActivity", () => {
    it("должен обновить lastActivity timestamp для существующей сессии", async () => {
      const sessionId = "sess_abc123";
      const existingSession = {
        userId: 12345,
        login: "octocat",
        accessToken: "gho_abc123",
        avatarUrl: "https://github.com/octocat.png",
        createdAt: 1234567890000,
      };

      vi.mocked(kv.get).mockResolvedValueOnce(existingSession);

      // Mock Date.now()
      const mockNow = 1234567900000;
      vi.spyOn(Date, "now").mockReturnValue(mockNow);

      await updateSessionActivity(sessionId);

      // Проверяем get вызов
      expect(kv.get).toHaveBeenCalledWith("session:sess_abc123");

      // Проверяем set вызов с обновленной lastActivity
      expect(kv.set).toHaveBeenCalledWith(
        "session:sess_abc123",
        {
          ...existingSession,
          lastActivity: mockNow,
        },
        { ex: 2592000 },
      );
    });

    it("должен сохранить существующий lastActivity если он был", async () => {
      const sessionId = "sess_abc123";
      const existingSession = {
        userId: 12345,
        login: "octocat",
        accessToken: "gho_abc123",
        avatarUrl: "https://github.com/octocat.png",
        createdAt: 1234567890000,
        lastActivity: 1234567895000,
      };

      vi.mocked(kv.get).mockResolvedValueOnce(existingSession);

      // Mock Date.now()
      const mockNow = 1234567900000;
      vi.spyOn(Date, "now").mockReturnValue(mockNow);

      await updateSessionActivity(sessionId);

      // Проверяем set вызов с новым lastActivity (перезаписан)
      expect(kv.set).toHaveBeenCalledWith(
        "session:sess_abc123",
        {
          ...existingSession,
          lastActivity: mockNow,
        },
        { ex: 2592000 },
      );
    });

    it("не должен ничего делать если сессия не найдена", async () => {
      const sessionId = "sess_nonexistent";

      vi.mocked(kv.get).mockResolvedValueOnce(null);

      await updateSessionActivity(sessionId);

      // Проверяем get вызов
      expect(kv.get).toHaveBeenCalledWith("session:sess_nonexistent");

      // set не должен быть вызван
      expect(kv.set).not.toHaveBeenCalled();
    });

    it("должен пропустить если KV недоступен", async () => {
      // Re-mock @vercel/kv to return null kv
      vi.resetModules();
      vi.doMock("@vercel/kv", () => ({
        kv: null,
      }));

      // Re-import logger with null kv
      const { updateSessionActivity: updateSessionActivityWithNullKv } =
        await import("./logger");

      await updateSessionActivityWithNullKv("sess_abc123");

      // No console output expected (silent skip)
      expect(console.warn).not.toHaveBeenCalled();
    });

    it("должен обработать ошибку при get", async () => {
      const error = new Error("KV connection failed");
      vi.mocked(kv.get).mockRejectedValueOnce(error);

      await updateSessionActivity("sess_abc123");

      expect(console.error).toHaveBeenCalledWith(
        "Failed to update session activity:",
        error,
      );
    });

    it("должен обработать ошибку при set", async () => {
      const existingSession = {
        userId: 12345,
        login: "octocat",
        accessToken: "gho_abc123",
        avatarUrl: "https://github.com/octocat.png",
        createdAt: 1234567890000,
      };

      vi.mocked(kv.get).mockResolvedValueOnce(existingSession);

      const error = new Error("KV set failed");
      vi.mocked(kv.set).mockRejectedValueOnce(error);

      await updateSessionActivity("sess_abc123");

      expect(console.error).toHaveBeenCalledWith(
        "Failed to update session activity:",
        error,
      );
    });
  });

  describe("cleanupOldAnalytics", () => {
    it("должен удалить старые login events (>30 дней)", async () => {
      // Mock Date.now()
      const mockNow = 1234567890000;
      vi.spyOn(Date, "now").mockReturnValue(mockNow);

      const thirtyDaysAgo = mockNow - 2592000000;

      await cleanupOldAnalytics();

      // Проверяем zremrangebyscore для logins
      expect(kv.zremrangebyscore).toHaveBeenCalledWith(
        "analytics:oauth:logins",
        0,
        thirtyDaysAgo,
      );
    });

    it("должен удалить старые logout events (>30 дней)", async () => {
      // Mock Date.now()
      const mockNow = 1234567890000;
      vi.spyOn(Date, "now").mockReturnValue(mockNow);

      const thirtyDaysAgo = mockNow - 2592000000;

      await cleanupOldAnalytics();

      // Проверяем zremrangebyscore для logouts
      expect(kv.zremrangebyscore).toHaveBeenCalledWith(
        "analytics:oauth:logouts",
        0,
        thirtyDaysAgo,
      );
    });

    it("должен удалить старые rate limit snapshots (>7 дней)", async () => {
      // Mock Date.now()
      const mockNow = 1234567890000;
      vi.spyOn(Date, "now").mockReturnValue(mockNow);

      const sevenDaysAgo = mockNow - 604800000;

      await cleanupOldAnalytics();

      // Проверяем zremrangebyscore для ratelimit
      expect(kv.zremrangebyscore).toHaveBeenCalledWith(
        "analytics:ratelimit",
        0,
        sevenDaysAgo,
      );
    });

    it("должен логировать успешный cleanup", async () => {
      await cleanupOldAnalytics();

      expect(console.log).toHaveBeenCalledWith("Analytics cleanup completed");
    });

    it("должен пропустить если KV недоступен", async () => {
      // Re-mock @vercel/kv to return null kv
      vi.resetModules();
      vi.doMock("@vercel/kv", () => ({
        kv: null,
      }));

      // Re-import logger with null kv
      const { cleanupOldAnalytics: cleanupOldAnalyticsWithNullKv } =
        await import("./logger");

      await cleanupOldAnalyticsWithNullKv();

      // No console output expected (silent skip)
      expect(console.warn).not.toHaveBeenCalled();
    });

    it("должен обработать ошибку при cleanup", async () => {
      const error = new Error("KV cleanup failed");
      vi.mocked(kv.zremrangebyscore).mockRejectedValueOnce(error);

      await cleanupOldAnalytics();

      expect(console.error).toHaveBeenCalledWith(
        "Failed to cleanup old analytics:",
        error,
      );
    });
  });
});
