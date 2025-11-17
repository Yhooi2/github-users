import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw, XCircle, AlertTriangle } from 'lucide-react';

type ErrorStateProps = {
  /**
   * Error title/heading
   */
  title?: string;
  /**
   * Error message/description
   */
  message: string;
  /**
   * Visual severity of the error
   * - 'error': Critical error (red)
   * - 'warning': Warning message (yellow)
   * - 'info': Informational (blue)
   */
  variant?: 'error' | 'warning' | 'info';
  /**
   * Optional retry callback
   */
  onRetry?: () => void;
  /**
   * Optional dismiss callback
   */
  onDismiss?: () => void;
  /**
   * Custom retry button text
   */
  retryText?: string;
  /**
   * Custom dismiss button text
   */
  dismissText?: string;
  /**
   * Show icon based on variant
   */
  showIcon?: boolean;
};

/**
 * ErrorState component displays error messages with optional retry/dismiss actions
 *
 * @example
 * ```tsx
 * <ErrorState
 *   title="Failed to load data"
 *   message="Unable to fetch user information"
 *   variant="error"
 *   onRetry={() => refetch()}
 * />
 * ```
 */
export function ErrorState({
  title = 'Error',
  message,
  variant = 'error',
  onRetry,
  onDismiss,
  retryText = 'Try Again',
  dismissText = 'Dismiss',
  showIcon = true,
}: ErrorStateProps) {
  const getIcon = () => {
    if (!showIcon) return null;

    switch (variant) {
      case 'error':
        return <XCircle className="h-5 w-5" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5" />;
      case 'info':
        return <AlertCircle className="h-5 w-5" />;
    }
  };

  const getAlertVariant = () => {
    if (variant === 'error') return 'destructive';
    return 'default';
  };

  return (
    <Alert variant={getAlertVariant()} role="alert">
      <div className="flex items-start gap-3">
        {getIcon()}
        <div className="flex-1 space-y-1">
          <AlertTitle>{title}</AlertTitle>
          <AlertDescription>{message}</AlertDescription>

          {(onRetry || onDismiss) && (
            <div className="mt-4 flex gap-2">
              {onRetry && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onRetry}
                  className="gap-2"
                  aria-label="Retry action"
                >
                  <RefreshCw className="h-4 w-4" />
                  {retryText}
                </Button>
              )}
              {onDismiss && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onDismiss}
                  aria-label="Dismiss error"
                >
                  {dismissText}
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </Alert>
  );
}
