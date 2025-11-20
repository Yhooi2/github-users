import type { VercelRequest, VercelResponse } from "@vercel/node";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import handler from "./login";

describe("OAuth Login Endpoint", () => {
  let req: Partial<VercelRequest>;
  let res: Partial<VercelResponse>;
  let originalEnv: NodeJS.ProcessEnv;

  beforeEach(() => {
    // Save original environment
    originalEnv = { ...process.env };

    // Create mock request
    req = {
      method: "GET",
    };

    // Create mock response with all required methods
    res = {
      redirect: vi.fn(),
      setHeader: vi.fn(),
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };
  });

  afterEach(() => {
    // Restore environment
    process.env = originalEnv;
    vi.clearAllMocks();
  });

  it("должен редиректить на GitHub с правильными параметрами", async () => {
    process.env.GITHUB_OAUTH_CLIENT_ID = "test_client_id";

    await handler(req as VercelRequest, res as VercelResponse);

    // Проверяем что установлен oauth_state cookie
    expect(res.setHeader).toHaveBeenCalledWith(
      "Set-Cookie",
      expect.stringMatching(
        /^oauth_state=.+; HttpOnly; Secure; SameSite=Lax; Max-Age=600; Path=\/$/,
      ),
    );

    // Проверяем что редирект на GitHub
    expect(res.redirect).toHaveBeenCalledWith(
      expect.stringContaining("https://github.com/login/oauth/authorize"),
    );

    // Проверяем что URL содержит client_id
    const redirectCall = (res.redirect as ReturnType<typeof vi.fn>).mock
      .calls[0][0];
    expect(redirectCall).toContain("client_id=test_client_id");
    expect(redirectCall).toContain("scope=read%3Auser+user%3Aemail");
    expect(redirectCall).toContain("state=");
  });

  it("должен использовать localhost для development", async () => {
    process.env.GITHUB_OAUTH_CLIENT_ID = "test_client_id";
    delete process.env.VERCEL_URL;

    await handler(req as VercelRequest, res as VercelResponse);

    const redirectCall = (res.redirect as ReturnType<typeof vi.fn>).mock
      .calls[0][0];
    expect(redirectCall).toContain(
      "redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fapi%2Fauth%2Fcallback",
    );
  });

  it("должен использовать VERCEL_URL для production", async () => {
    process.env.GITHUB_OAUTH_CLIENT_ID = "test_client_id";
    process.env.VERCEL_URL = "my-app.vercel.app";

    await handler(req as VercelRequest, res as VercelResponse);

    const redirectCall = (res.redirect as ReturnType<typeof vi.fn>).mock
      .calls[0][0];
    expect(redirectCall).toContain(
      "redirect_uri=https%3A%2F%2Fmy-app.vercel.app%2Fapi%2Fauth%2Fcallback",
    );
  });

  it("должен вернуть ошибку если OAuth не настроен", async () => {
    delete process.env.GITHUB_OAUTH_CLIENT_ID;

    await handler(req as VercelRequest, res as VercelResponse);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: "OAuth not configured",
      message: "GITHUB_OAUTH_CLIENT_ID is not set in environment variables",
    });
  });

  it("должен отклонить не-GET запросы", async () => {
    process.env.GITHUB_OAUTH_CLIENT_ID = "test_client_id";
    req.method = "POST";

    await handler(req as VercelRequest, res as VercelResponse);

    expect(res.status).toHaveBeenCalledWith(405);
    expect(res.json).toHaveBeenCalledWith({ error: "Method not allowed" });
  });

  it("должен генерировать уникальный state каждый раз", async () => {
    process.env.GITHUB_OAUTH_CLIENT_ID = "test_client_id";

    // Первый вызов
    await handler(req as VercelRequest, res as VercelResponse);
    const firstCookie = (res.setHeader as ReturnType<typeof vi.fn>).mock
      .calls[0][1];

    // Очистка mocks
    vi.clearAllMocks();

    // Второй вызов
    await handler(req as VercelRequest, res as VercelResponse);
    const secondCookie = (res.setHeader as ReturnType<typeof vi.fn>).mock
      .calls[0][1];

    // State должен быть разным
    expect(firstCookie).not.toBe(secondCookie);
  });
});
