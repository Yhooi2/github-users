import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { AlertTriangle, Info } from 'lucide-react'

export interface RateLimitBannerProps {
  remaining: number
  limit: number
  reset: number // Unix timestamp
  isDemo: boolean // Flag indicating demo mode (true) or authenticated mode (false)
  onAuthClick?: () => void
  onLogoutClick?: () => void // Callback for logout button (authenticated mode)
}

export function RateLimitBanner({
  remaining,
  limit,
  reset,
  isDemo,
  onAuthClick,
  onLogoutClick,
}: RateLimitBannerProps) {
  const percentage = (remaining / limit) * 100
  const resetDate = new Date(reset * 1000)
  const timeUntilReset = Math.ceil((resetDate.getTime() - Date.now()) / 1000 / 60)

  // Show banner only if:
  // - In demo mode AND < 10% remaining
  // - OR in auth mode AND < 10% remaining
  if (!isDemo && percentage >= 10) return null

  const variant = percentage < 5 ? 'destructive' : 'default'
  const Icon = percentage < 5 ? AlertTriangle : Info

  // Title depends on mode
  const title = isDemo
    ? (percentage < 5 ? '⚠️ Demo limit almost exhausted' : '📊 Demo mode active')
    : '✅ Authenticated'

  return (
    <Alert variant={variant} className="mb-4">
      <Icon className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription className="mt-2 space-y-2">
        <p>
          <strong>{remaining}</strong> of {limit} requests remaining
          ({percentage.toFixed(1)}% left).
          {timeUntilReset > 0 && ` Resets in ${timeUntilReset} minutes.`}
        </p>

        {/* Demo mode: Show sign in button */}
        {isDemo && percentage < 10 && onAuthClick && (
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <p className="text-sm">
              Sign in with GitHub for your personal rate limit (5000 req/hour).
            </p>
            <Button
              onClick={onAuthClick}
              variant={percentage < 5 ? 'default' : 'outline'}
              size="sm"
            >
              Sign in with GitHub
            </Button>
          </div>
        )}

        {/* Authenticated mode: Show logout button */}
        {!isDemo && onLogoutClick && (
          <div className="flex items-center gap-2">
            <p className="text-sm">
              You're using your personal GitHub rate limit.
            </p>
            <Button onClick={onLogoutClick} variant="ghost" size="sm">
              Sign out
            </Button>
          </div>
        )}
      </AlertDescription>
    </Alert>
  )
}
