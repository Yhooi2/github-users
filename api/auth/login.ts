import type { VercelRequest, VercelResponse } from "@vercel/node";
import { randomBytes } from "crypto";

/**
 * Generate random state for CSRF protection
 * Uses crypto.randomBytes for cryptographically secure random values
 */
function generateRandomState(): string {
  return randomBytes(32).toString("hex");
}

/**
 * OAuth Login Endpoint
 *
 * Initiates GitHub OAuth flow by:
 * 1. Generating CSRF state token
 * 2. Storing state in httpOnly cookie
 * 3. Redirecting to GitHub authorization page
 *
 * @param req - Vercel request object
 * @param res - Vercel response object
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow GET requests
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const clientId = process.env.GITHUB_OAUTH_CLIENT_ID;

  // Check if OAuth is configured
  if (!clientId) {
    return res.status(500).json({
      error: "OAuth not configured",
      message: "GITHUB_OAUTH_CLIENT_ID is not set in environment variables",
    });
  }

  // Generate CSRF protection state
  const state = generateRandomState();

  // Store state in httpOnly cookie for validation in callback
  // - HttpOnly: prevents JavaScript access (XSS protection)
  // - Secure: only sent over HTTPS
  // - SameSite=Lax: CSRF protection
  // - Max-Age=600: 10 minutes expiry (long enough for OAuth flow)
  res.setHeader(
    "Set-Cookie",
    `oauth_state=${state}; HttpOnly; Secure; SameSite=Lax; Max-Age=600; Path=/`,
  );

  // Determine base URL for redirect_uri
  // - Production: uses VERCEL_URL
  // - Development: uses localhost:3000
  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";

  // Build GitHub OAuth authorization URL
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: `${baseUrl}/api/auth/callback`,
    scope: "read:user user:email", // Read-only access to public profile
    state, // CSRF protection token
  });

  const authUrl = `https://github.com/login/oauth/authorize?${params}`;

  // Redirect user to GitHub
  res.redirect(authUrl);
}
