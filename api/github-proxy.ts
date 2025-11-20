import type { VercelRequest, VercelResponse } from "@vercel/node";
import {
  logRateLimitSnapshot,
  updateSessionActivity,
} from "./analytics/logger.js";

/**
 * GraphQL request body structure
 */
interface GraphQLRequest {
  query: string;
  variables?: Record<string, unknown>;
  cacheKey?: string;
}

/**
 * Session data from Vercel KV
 */
interface Session {
  userId: number;
  login: string;
  avatarUrl: string;
  accessToken: string;
  createdAt: number;
}

/**
 * Rate limit information from GitHub API
 */
interface RateLimit {
  remaining: number;
  limit: number;
  reset: number;
  used: number;
  isDemo: boolean;
  userLogin?: string;
}

/**
 * Extract session ID from cookie header
 */
function extractSessionFromCookie(
  cookieHeader: string | undefined,
): string | null {
  if (!cookieHeader) return null;

  const cookies = cookieHeader.split(";").map((c) => c.trim());
  const sessionCookie = cookies.find((c) => c.startsWith("session="));

  return sessionCookie ? sessionCookie.split("=")[1] : null;
}

/**
 * Extract rate limit information from GitHub API response headers
 */
function extractRateLimit(
  headers: Headers,
  isDemo: boolean,
  userLogin?: string,
): RateLimit {
  return {
    remaining: parseInt(headers.get("X-RateLimit-Remaining") || "0", 10),
    limit: parseInt(headers.get("X-RateLimit-Limit") || "5000", 10),
    reset: parseInt(headers.get("X-RateLimit-Reset") || "0", 10),
    used: parseInt(headers.get("X-RateLimit-Used") || "0", 10),
    isDemo,
    userLogin,
  };
}

// Check if Vercel KV is configured
const isKVConfigured = Boolean(
  process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN,
);

// Lazy load KV only if configured
let kv: (typeof import("@vercel/kv"))["kv"] | null = null;
if (isKVConfigured) {
  const kvModule = await import("@vercel/kv");
  kv = kvModule.kv;
}

/**
 * GitHub GraphQL Proxy Endpoint
 *
 * Features:
 * - Demo mode: Uses server-side GITHUB_TOKEN (shared rate limit)
 * - OAuth mode: Uses user's personal token (personal rate limit)
 * - Caching: Separate cache for demo and authenticated users
 * - Rate limiting: Extracts and returns rate limit information
 *
 * @param req - Vercel request object
 * @param res - Vercel response object
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { query, variables, cacheKey } = req.body as GraphQLRequest;

  if (!query) {
    return res.status(400).json({ error: "Query is required" });
  }

  // Extract session ID from cookie
  const sessionId = extractSessionFromCookie(req.headers.cookie);

  // Default: demo mode with server-side token
  let token = process.env.GITHUB_TOKEN;
  let isDemo = true;
  let userLogin: string | undefined;

  // If session exists, try to use user's token
  if (sessionId && kv) {
    try {
      const session = await kv.get<Session>(`session:${sessionId}`);
      if (session && session.accessToken) {
        token = session.accessToken;
        isDemo = false;
        userLogin = session.login;
      }
    } catch (error) {
      console.error("Failed to load session from KV:", error);
      // Fallback to demo mode
    }
  }

  if (!token) {
    return res.status(500).json({
      error: "No token available",
      message: "Neither GITHUB_TOKEN nor user session token is available",
    });
  }

  // Build cache key (separate cache for demo and authenticated users)
  const finalCacheKey = cacheKey
    ? isDemo
      ? `demo:${cacheKey}`
      : `user:${sessionId}:${cacheKey}`
    : null;

  // Check cache if KV is configured
  if (finalCacheKey && kv) {
    try {
      const cached = await kv.get(finalCacheKey);
      if (cached) {
        return res.status(200).json(cached);
      }
    } catch (error) {
      console.warn(
        "KV cache read failed:",
        error instanceof Error ? error.message : "Unknown error",
      );
      // Continue without cache
    }
  }

  // GitHub API request
  try {
    const response = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query, variables }),
    });

    if (!response.ok) {
      throw new Error(
        `GitHub API error: ${response.status} ${response.statusText}`,
      );
    }

    const data = await response.json();

    // Check for GraphQL errors
    if (data.errors) {
      console.error("GraphQL errors:", data.errors);
      return res.status(400).json(data);
    }

    // Extract rate limit from response headers
    const rateLimit = extractRateLimit(response.headers, isDemo, userLogin);

    // Log rate limit snapshot for analytics
    await logRateLimitSnapshot({
      timestamp: Date.now(),
      remaining: rateLimit.remaining,
      limit: rateLimit.limit,
      used: rateLimit.used,
      isDemo,
      userLogin,
    });

    // Update session activity if authenticated
    if (!isDemo && sessionId) {
      await updateSessionActivity(sessionId);
    }

    // Log warning if rate limit is low
    const percentage = (rateLimit.remaining / rateLimit.limit) * 100;
    if (percentage < 10) {
      console.warn(
        `⚠️ Rate limit low: ${rateLimit.remaining}/${rateLimit.limit} (${percentage.toFixed(1)}%) - ` +
          `Mode: ${isDemo ? "Demo" : `User ${userLogin}`}`,
      );
    }

    // Combine data with rate limit
    const responseData = {
      ...data,
      rateLimit,
    };

    // Cache result (different TTL for demo vs authenticated)
    if (finalCacheKey && kv) {
      try {
        // Demo: 30 minutes, User: 10 minutes
        const ttl = isDemo ? 1800 : 600;
        await kv.set(finalCacheKey, responseData, { ex: ttl });
      } catch (error) {
        console.warn(
          "KV cache write failed:",
          error instanceof Error ? error.message : "Unknown error",
        );
        // Continue without caching
      }
    }

    return res.status(200).json(responseData);
  } catch (error) {
    console.error("GitHub proxy error:", error);
    return res.status(500).json({
      error: "Failed to fetch from GitHub",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
