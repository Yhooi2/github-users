import type { VercelRequest, VercelResponse } from "@vercel/node";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import handler from "./logout";

// Mock @vercel/kv
vi.mock("@vercel/kv", () => ({
  kv: {
    set: vi.fn(),
    get: vi.fn(),
    del: vi.fn(),
  },
}));

import { kv } from "@vercel/kv";

describe("Logout Endpoint", () => {
  let req: Partial<VercelRequest>;
  let res: Partial<VercelResponse>;

  beforeEach(() => {
    // Create mock request
    req = {
      method: "GET",
      headers: {},
    };

    // Create mock response
    res = {
      redirect: vi.fn(),
      setHeader: vi.fn(),
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("должен удалить сессию и очистить cookie", async () => {
    req.headers = { cookie: "session=test_session_id_123" };
    vi.mocked(kv.del).mockResolvedValue(1);

    await handler(req as VercelRequest, res as VercelResponse);

    // Verify session deleted from KV
    expect(kv.del).toHaveBeenCalledWith("session:test_session_id_123");

    // Verify cookie cleared
    expect(res.setHeader).toHaveBeenCalledWith(
      "Set-Cookie",
      expect.stringMatching(/^session=; .+ Max-Age=0/),
    );

    // Verify redirect
    expect(res.redirect).toHaveBeenCalledWith("/?auth=logged_out");
  });

  it("должен работать без session cookie", async () => {
    req.headers = {};

    await handler(req as VercelRequest, res as VercelResponse);

    // KV delete should not be called
    expect(kv.del).not.toHaveBeenCalled();

    // Cookie should still be cleared
    expect(res.setHeader).toHaveBeenCalledWith(
      "Set-Cookie",
      expect.stringContaining("Max-Age=0"),
    );

    // Should redirect
    expect(res.redirect).toHaveBeenCalledWith("/?auth=logged_out");
  });

  it("должен работать если KV недоступен", async () => {
    req.headers = { cookie: "session=test_session" };
    vi.mocked(kv.del).mockRejectedValue(new Error("KV unavailable"));

    await handler(req as VercelRequest, res as VercelResponse);

    // Should still clear cookie and redirect
    expect(res.setHeader).toHaveBeenCalled();
    expect(res.redirect).toHaveBeenCalledWith("/?auth=logged_out");
  });

  it("должен обрабатывать cookie с несколькими значениями", async () => {
    req.headers = {
      cookie: "other=value; session=my_session_id; another=value",
    };
    vi.mocked(kv.del).mockResolvedValue(1);

    await handler(req as VercelRequest, res as VercelResponse);

    expect(kv.del).toHaveBeenCalledWith("session:my_session_id");
  });

  it("должен поддерживать POST запросы", async () => {
    req.method = "POST";
    req.headers = { cookie: "session=test" };
    vi.mocked(kv.del).mockResolvedValue(1);

    await handler(req as VercelRequest, res as VercelResponse);

    expect(res.redirect).toHaveBeenCalledWith("/?auth=logged_out");
  });

  it("должен отклонять другие HTTP методы", async () => {
    req.method = "PUT";

    await handler(req as VercelRequest, res as VercelResponse);

    expect(res.status).toHaveBeenCalledWith(405);
    expect(res.json).toHaveBeenCalledWith({ error: "Method not allowed" });
  });

  it("должен очищать cookie с правильными флагами", async () => {
    req.headers = { cookie: "session=test" };
    vi.mocked(kv.del).mockResolvedValue(1);

    await handler(req as VercelRequest, res as VercelResponse);

    const cookieValue = (res.setHeader as ReturnType<typeof vi.fn>).mock
      .calls[0][1];

    expect(cookieValue).toContain("HttpOnly");
    expect(cookieValue).toContain("Secure");
    expect(cookieValue).toContain("SameSite=Lax");
    expect(cookieValue).toContain("Max-Age=0");
    expect(cookieValue).toContain("Path=/");
  });
});
