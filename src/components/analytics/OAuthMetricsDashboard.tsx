import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Users, LogIn, LogOut, Activity, TrendingUp, Clock } from 'lucide-react'

/**
 * OAuth Metrics from API
 */
interface OAuthMetrics {
  period: string
  timestamp: number
  metrics: {
    activeSessions: number
    totalLogins: number
    totalLogouts: number
    uniqueUsers: number
    avgSessionDuration: number
    rateLimit: {
      avgUsage: number
      peakUsage: number
      avgRemaining: number
    }
  }
}

export interface OAuthMetricsDashboardProps {
  /** Initial period to display */
  initialPeriod?: 'hour' | 'day' | 'week' | 'month'
  /** Auto-refresh interval in milliseconds (0 to disable) */
  refreshInterval?: number
  /** Admin mode - show detailed data */
  adminMode?: boolean
}

/**
 * Format duration in milliseconds to human-readable string
 */
function formatDuration(ms: number): string {
  if (ms < 60000) {
    return `${Math.round(ms / 1000)}s`
  }
  if (ms < 3600000) {
    return `${Math.round(ms / 60000)}m`
  }
  if (ms < 86400000) {
    return `${Math.round(ms / 3600000)}h`
  }
  return `${Math.round(ms / 86400000)}d`
}

/**
 * Format timestamp to readable date
 */
function formatTimestamp(timestamp: number): string {
  return new Date(timestamp).toLocaleString()
}

/**
 * OAuth Metrics Dashboard Component
 *
 * Displays OAuth usage analytics:
 * - Active sessions
 * - Login/logout counts
 * - Unique users
 * - Average session duration
 * - Rate limit usage
 *
 * Usage:
 * ```tsx
 * <OAuthMetricsDashboard
 *   initialPeriod="day"
 *   refreshInterval={30000}
 *   adminMode={true}
 * />
 * ```
 */
export function OAuthMetricsDashboard({
  initialPeriod = 'day',
  refreshInterval = 0,
  adminMode = false,
}: OAuthMetricsDashboardProps) {
  const [period, setPeriod] = useState<'hour' | 'day' | 'week' | 'month'>(initialPeriod)
  const [metrics, setMetrics] = useState<OAuthMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<number>(0)

  // Fetch metrics from API
  const fetchMetrics = async () => {
    try {
      setLoading(true)
      setError(null)

      const detailed = adminMode ? 'true' : 'false'
      const response = await fetch(`/api/analytics/oauth-usage?period=${period}&detailed=${detailed}`)

      if (!response.ok) {
        throw new Error(`Failed to fetch metrics: ${response.statusText}`)
      }

      const data: OAuthMetrics = await response.json()
      setMetrics(data)
      setLastUpdated(Date.now())
    } catch (err) {
      console.error('Failed to fetch OAuth metrics:', err)
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  // Initial fetch + auto-refresh
  useEffect(() => {
    fetchMetrics()

    if (refreshInterval > 0) {
      const interval = setInterval(fetchMetrics, refreshInterval)
      return () => clearInterval(interval)
    }
  }, [period, refreshInterval, adminMode])

  // Loading state
  if (loading && !metrics) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">OAuth Analytics</h2>
            <p className="text-muted-foreground">Loading metrics...</p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 w-20 bg-muted rounded" />
                <div className="h-4 w-4 bg-muted rounded-full" />
              </CardHeader>
              <CardContent>
                <div className="h-8 w-16 bg-muted rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">OAuth Analytics</h2>
            <p className="text-muted-foreground">Failed to load metrics</p>
          </div>
        </div>
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle>Error</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={fetchMetrics} variant="outline">
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!metrics) {
    return null
  }

  const { metrics: data } = metrics

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">OAuth Analytics</h2>
          <p className="text-muted-foreground">
            Last updated: {formatTimestamp(lastUpdated)}
          </p>
        </div>
        <div className="flex items-center gap-4">
          {refreshInterval > 0 && (
            <Badge variant="outline" className="gap-1">
              <Activity className="h-3 w-3" />
              Auto-refresh: {formatDuration(refreshInterval)}
            </Badge>
          )}
          <Select value={period} onValueChange={(value) => setPeriod(value as typeof period)}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="hour">Last Hour</SelectItem>
              <SelectItem value="day">Last 24 Hours</SelectItem>
              <SelectItem value="week">Last Week</SelectItem>
              <SelectItem value="month">Last Month</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={fetchMetrics} variant="outline" size="sm">
            Refresh
          </Button>
        </div>
      </div>

      {/* Main Metrics Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Active Sessions */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.activeSessions}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {data.uniqueUsers} unique users
            </p>
          </CardContent>
        </Card>

        {/* Total Logins */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Logins</CardTitle>
            <LogIn className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalLogins}</div>
            <p className="text-xs text-muted-foreground mt-1">
              In {period === 'hour' ? 'last hour' : `last ${period}`}
            </p>
          </CardContent>
        </Card>

        {/* Total Logouts */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Logouts</CardTitle>
            <LogOut className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalLogouts}</div>
            <p className="text-xs text-muted-foreground mt-1">
              In {period === 'hour' ? 'last hour' : `last ${period}`}
            </p>
          </CardContent>
        </Card>

        {/* Avg Session Duration */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Session</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatDuration(data.avgSessionDuration)}</div>
            <p className="text-xs text-muted-foreground mt-1">Average duration</p>
          </CardContent>
        </Card>
      </div>

      {/* Rate Limit Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Rate Limit Statistics
          </CardTitle>
          <CardDescription>API usage metrics for authenticated users</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Average Usage</p>
              <p className="text-2xl font-bold">{data.rateLimit.avgUsage}</p>
              <p className="text-xs text-muted-foreground mt-1">requests used</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Peak Usage</p>
              <p className="text-2xl font-bold">{data.rateLimit.peakUsage}</p>
              <p className="text-xs text-muted-foreground mt-1">maximum reached</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Average Remaining</p>
              <p className="text-2xl font-bold">{data.rateLimit.avgRemaining}</p>
              <p className="text-xs text-muted-foreground mt-1">of 5000 limit</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Admin Mode - Detailed Data */}
      {adminMode && metrics.detailed && (
        <Card>
          <CardHeader>
            <CardTitle>Detailed Data (Admin Only)</CardTitle>
            <CardDescription>Additional information about sessions and timeline</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold mb-2">Active Sessions</h4>
                <div className="text-xs text-muted-foreground">
                  {metrics.detailed.sessions.length} active sessions found
                </div>
              </div>
              <div>
                <h4 className="text-sm font-semibold mb-2">Recent Events</h4>
                <div className="text-xs text-muted-foreground">
                  {metrics.detailed.timeline.length} events in timeline
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
