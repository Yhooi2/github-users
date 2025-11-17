import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { AlertTriangle, Info } from 'lucide-react'

export interface RateLimitBannerProps {
  remaining: number
  limit: number
  reset: number // Unix timestamp
  onAuthClick?: () => void
}

export function RateLimitBanner({
  remaining,
  limit,
  reset,
  onAuthClick,
}: RateLimitBannerProps) {
  const percentage = (remaining / limit) * 100
  const resetDate = new Date(reset * 1000)
  const timeUntilReset = Math.ceil((resetDate.getTime() - Date.now()) / 1000 / 60)

  // Only show if < 10% remaining
  if (percentage >= 10) return null

  const variant = percentage < 5 ? 'destructive' : 'default'
  const Icon = percentage < 5 ? AlertTriangle : Info

  return (
    <Alert variant={variant} className="mb-4">
      <Icon className="h-4 w-4" />
      <AlertTitle>
        {percentage < 5
          ? '⚠️ Demo limit almost exhausted'
          : '📊 Demo mode active'}
      </AlertTitle>
      <AlertDescription className="mt-2 space-y-2">
        <p>
          {remaining} of {limit} requests remaining
          ({percentage.toFixed(1)}% left).
          {timeUntilReset > 0 && ` Resets in ${timeUntilReset} minutes.`}
        </p>

        {onAuthClick && (
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
      </AlertDescription>
    </Alert>
  )
}
