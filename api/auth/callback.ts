import { kv } from "@vercel/kv";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { randomBytes } from "crypto";
import { logOAuthLogin } from "../analytics/logger.js";

/**
 * Session data stored in Vercel KV
 */
interface Session {
  userId: number;
  login: string;
  avatarUrl: string;
  accessToken: string;
  createdAt: number;
}

/**
 * Generate unique session ID
 * Uses crypto.randomBytes for cryptographically secure random values
 */
function generateSessionId(): string {
  return randomBytes(32).toString("hex");
}

/**
 * Extract cookie value from cookie header
 *
 * @param cookieHeader - Cookie header string
 * @param name - Cookie name to extract
 * @returns Cookie value or null if not found
 */
function extractCookie(
  cookieHeader: string | undefined,
  name: string,
): string | null {
  if (!cookieHeader) return null;

  const cookies = cookieHeader.split(";").map((c) => c.trim());
  const cookie = cookies.find((c) => c.startsWith(`${name}=`));

  return cookie ? cookie.split("=")[1] : null;
}

/**
 * OAuth Callback Endpoint
 *
 * Handles GitHub OAuth callback by:
 * 1. Validating CSRF state token
 * 2. Exchanging code for access token
 * 3. Fetching user information
 * 4. Creating session in Vercel KV
 * 5. Setting httpOnly session cookie
 * 6. Redirecting back to app
 *
 * @param req - Vercel request object
 * @param res - Vercel response object
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow GET requests
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { code, state } = req.query;

  // Validate query parameters
  if (!code || typeof code !== "string") {
    console.error("OAuth callback: missing or invalid code");
    return res.redirect("/?error=no_code");
  }

  if (!state || typeof state !== "string") {
    console.error("OAuth callback: missing or invalid state");
    return res.redirect("/?error=no_state");
  }

  // CSRF Protection: Validate state parameter
  const savedState = extractCookie(req.headers.cookie, "oauth_state");

  if (!savedState || savedState !== state) {
    console.error("OAuth callback: CSRF validation failed", {
      savedState: savedState ? "exists" : "missing",
      receivedState: state ? "exists" : "missing",
      match: savedState === state,
    });
    return res.redirect("/?error=csrf_failed");
  }

  // Check OAuth configuration
  const clientId = process.env.GITHUB_OAUTH_CLIENT_ID;
  const clientSecret = process.env.GITHUB_OAUTH_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    console.error("OAuth callback: OAuth not configured");
    return res.redirect("/?error=oauth_not_configured");
  }

  try {
    // Step 1: Exchange code for access token
    console.log("OAuth callback: Exchanging code for access token");

    const tokenResponse = await fetch(
      "https://github.com/login/oauth/access_token",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          client_id: clientId,
          client_secret: clientSecret,
          code,
        }),
      },
    );

    if (!tokenResponse.ok) {
      throw new Error(`Token exchange failed: ${tokenResponse.statusText}`);
    }

    const tokenData = await tokenResponse.json();
    const { access_token, error, error_description } = tokenData;

    if (error) {
      console.error("OAuth callback: Token exchange error", {
        error,
        error_description,
      });
      throw new Error(error_description || error);
    }

    if (!access_token) {
      console.error("OAuth callback: No access token received", tokenData);
      throw new Error("No access token in response");
    }

    // Step 2: Fetch user information
    console.log("OAuth callback: Fetching user information");

    const userResponse = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${access_token}`,
        Accept: "application/json",
      },
    });

    if (!userResponse.ok) {
      throw new Error(`Failed to fetch user info: ${userResponse.statusText}`);
    }

    const user = await userResponse.json();

    if (!user.id || !user.login) {
      console.error("OAuth callback: Invalid user data", user);
      throw new Error("Invalid user data received");
    }

    // Step 3: Create session
    const sessionId = generateSessionId();
    const sessionData: Session = {
      userId: user.id,
      login: user.login,
      avatarUrl: user.avatar_url || `https://github.com/${user.login}.png`,
      accessToken: access_token,
      createdAt: Date.now(),
    };

    console.log(
      `OAuth callback: Creating session for user ${user.login} (ID: ${user.id})`,
    );

    // Step 4: Store session in Vercel KV (TTL: 30 days)
    const sessionTTL = 86400 * 30; // 30 days in seconds

    try {
      await kv.set(`session:${sessionId}`, sessionData, { ex: sessionTTL });
      console.log(
        `OAuth callback: Session stored successfully (ID: ${sessionId})`,
      );

      // Log OAuth login event for analytics
      await logOAuthLogin({
        timestamp: Date.now(),
        userId: user.id,
        login: user.login,
        sessionId,
      });
    } catch (kvError) {
      console.error("OAuth callback: Failed to store session in KV", kvError);
      throw new Error("Failed to create session");
    }

    // Step 5: Set httpOnly session cookie
    // Also clear oauth_state cookie (no longer needed)
    const cookieMaxAge = sessionTTL;
    res.setHeader("Set-Cookie", [
      `session=${sessionId}; HttpOnly; Secure; SameSite=Lax; Max-Age=${cookieMaxAge}; Path=/`,
      "oauth_state=; HttpOnly; Secure; SameSite=Lax; Max-Age=0; Path=/", // Clear state cookie
    ]);

    // Step 6: Redirect back to app with success
    console.log(`OAuth callback: Redirecting to app (user: ${user.login})`);
    res.redirect("/?auth=success");
  } catch (error) {
    console.error("OAuth callback: Error during authentication", error);

    // Generic error message for user (don't leak details)
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error("OAuth callback: Full error details", errorMessage);

    res.redirect("/?error=auth_failed");
  }
}
