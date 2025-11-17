import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Github, Zap, Shield, Star } from 'lucide-react'

export interface AuthRequiredModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onGitHubAuth: () => void
  remaining: number
  limit: number
}

export function AuthRequiredModal({
  open,
  onOpenChange,
  onGitHubAuth,
  remaining,
  limit,
}: AuthRequiredModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            ⚠️ Demo limit reached
          </DialogTitle>
          <DialogDescription className="text-base">
            You've used {limit - remaining} of {limit} demo requests.
            Sign in with your GitHub account to continue with higher limits.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Benefits */}
          <div className="rounded-lg border bg-muted/50 p-4">
            <h4 className="mb-3 font-semibold">Why sign in with GitHub?</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <Zap className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                <span>
                  <strong>5,000 requests/hour</strong> with your personal rate limit
                  (vs 5,000/hour shared in demo)
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Shield className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                <span>
                  <strong>Secure</strong> - We only request read-only access to your public profile
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Star className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                <span>
                  <strong>Future features</strong> - Save favorites, compare users, and more
                </span>
              </li>
            </ul>
          </div>

          {/* Auth Button */}
          <Button
            onClick={onGitHubAuth}
            className="w-full"
            size="lg"
          >
            <Github className="mr-2 h-5 w-5" />
            Continue with GitHub
          </Button>

          {/* Privacy Note */}
          <p className="text-center text-xs text-muted-foreground">
            By signing in, you agree to our terms.
            We'll never post on your behalf or access private data.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
