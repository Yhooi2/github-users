interface GraphQLRequest {
  query: string
  variables?: Record<string, unknown>
}

// Check if Vercel KV is configured
const isKVConfigured = Boolean(
  process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN
)

// Lazy load KV only if configured
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let kv: any = null
if (isKVConfigured) {
  const kvModule = await import('@vercel/kv')
  kv = kvModule.kv
}

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { query, variables, cacheKey } = req.body as GraphQLRequest & { cacheKey?: string }

  // Check cache if key provided and KV is configured
  if (cacheKey && kv) {
    try {
      const cached = await kv.get(cacheKey)
      if (cached) {
        console.log(`Cache HIT: ${cacheKey}`)
        return res.status(200).json(cached)
      }
    } catch (error) {
      console.warn('KV cache read failed:', error.message)
      // Continue without cache
    }
  }

  // GitHub API request
  const token = process.env.GITHUB_TOKEN

  if (!token) {
    return res.status(500).json({ error: 'GITHUB_TOKEN not configured' })
  }

  try {
    const response = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query, variables }),
    })

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.statusText}`)
    }

    const data = await response.json()

    if (data.errors) {
      return res.status(400).json(data)
    }

    // Cache result for 30 minutes (if KV is configured)
    if (cacheKey && kv) {
      try {
        await kv.set(cacheKey, data, { ex: 1800 })
        console.log(`Cache SET: ${cacheKey}`)
      } catch (error) {
        console.warn('KV cache write failed:', error.message)
        // Continue without caching
      }
    }

    return res.status(200).json(data)
  } catch (error) {
    console.error('GitHub proxy error:', error)
    return res.status(500).json({
      error: 'Failed to fetch from GitHub',
      message: error.message
    })
  }
}
