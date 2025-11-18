import { kv } from '@vercel/kv'
import type { VercelRequest, VercelResponse } from '@vercel/node'

/**
 * Extract session ID from cookie header
 *
 * @param cookieHeader - Cookie header string
 * @returns Session ID or null if not found
 */
function extractSessionFromCookie(cookieHeader: string | undefined): string | null {
  if (!cookieHeader) return null

  const cookies = cookieHeader.split(';').map(c => c.trim())
  const sessionCookie = cookies.find(c => c.startsWith('session='))

  return sessionCookie ? sessionCookie.split('=')[1] : null
}

/**
 * Logout Endpoint
 *
 * Handles user logout by:
 * 1. Extracting session ID from cookie
 * 2. Deleting session from Vercel KV
 * 3. Clearing session cookie
 * 4. Redirecting to app with logout confirmation
 *
 * @param req - Vercel request object
 * @param res - Vercel response object
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow GET requests (could also support POST)
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // Extract session ID from cookie
  const sessionId = extractSessionFromCookie(req.headers.cookie)

  if (sessionId) {
    try {
      // Delete session from Vercel KV
      console.log(`Logout: Deleting session ${sessionId}`)
      await kv.del(`session:${sessionId}`)
      console.log(`Logout: Session ${sessionId} deleted successfully`)
    } catch (error) {
      // Log error but continue (session might already be expired/deleted)
      console.error('Logout: Failed to delete session from KV', error)
    }
  } else {
    console.log('Logout: No session cookie found, clearing anyway')
  }

  // Clear session cookie
  // Set Max-Age=0 to immediately expire the cookie
  res.setHeader(
    'Set-Cookie',
    'session=; HttpOnly; Secure; SameSite=Lax; Max-Age=0; Path=/'
  )

  // Redirect to app with logout confirmation
  res.redirect('/?auth=logged_out')
}
