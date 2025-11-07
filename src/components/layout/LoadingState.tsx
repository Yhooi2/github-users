import { Skeleton } from '@/components/ui/skeleton';

type LoadingStateProps = {
  /**
   * Variant of loading state to display
   * - 'default': Simple skeleton lines
   * - 'card': Card-style skeleton
   * - 'profile': User profile skeleton
   * - 'list': List of items skeleton
   */
  variant?: 'default' | 'card' | 'profile' | 'list';
  /**
   * Number of items to show for list variant
   */
  count?: number;
  /**
   * Optional message to display below skeleton
   */
  message?: string;
};

/**
 * LoadingState component displays skeleton loaders for different content types
 *
 * @example
 * ```tsx
 * <LoadingState variant="profile" message="Loading user profile..." />
 * <LoadingState variant="list" count={5} />
 * ```
 */
export function LoadingState({ variant = 'default', count = 3, message }: LoadingStateProps) {
  return (
    <div className="space-y-4" role="status" aria-label="Loading">
      {variant === 'default' && (
        <>
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-5/6" />
        </>
      )}

      {variant === 'card' && (
        <div className="rounded-lg border p-6 space-y-3">
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <div className="flex gap-2 pt-2">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-20" />
          </div>
        </div>
      )}

      {variant === 'profile' && (
        <div className="flex gap-6">
          <Skeleton className="h-32 w-32 rounded-full" />
          <div className="flex-1 space-y-3">
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <div className="flex gap-4 pt-2">
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-24" />
            </div>
          </div>
        </div>
      )}

      {variant === 'list' && (
        <div className="space-y-3">
          {Array.from({ length: count }).map((_, index) => (
            <div key={index} className="flex gap-4 p-4 rounded-lg border">
              <Skeleton className="h-12 w-12 rounded" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-1/3" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </div>
          ))}
        </div>
      )}

      {message && (
        <p className="text-center text-sm text-muted-foreground mt-4">{message}</p>
      )}
      <span className="sr-only">Loading content...</span>
    </div>
  );
}
