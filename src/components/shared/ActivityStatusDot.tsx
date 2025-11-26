/**
 * ActivityStatusDot - Visual indicator for project activity status
 *
 * Shows activity status based on last commit date:
 * - Active (0-30 days): Green with pulse animation
 * - Recent (31-90 days): Yellow, static
 * - Inactive (91+ days): Gray, static
 */

import { useReducedMotion } from "@/hooks";
import {
  getActivityStatus,
  getActivityStyle,
  type ActivityStatus,
} from "@/lib/utils/contribution-helpers";
import { cn } from "@/lib/utils";

export interface ActivityStatusDotProps {
  /** Last activity date (ISO string or Date) */
  lastActivityDate?: string | Date | null;
  /** Or provide status directly */
  status?: ActivityStatus;
  /** Size variant */
  size?: "sm" | "md";
  /** Show label next to dot */
  showLabel?: boolean;
  /** Additional class names */
  className?: string;
}

/**
 * ActivityStatusDot Component
 *
 * Displays a colored dot indicating activity status.
 * Active status shows a subtle pulse animation (respects reduced motion).
 *
 * @example
 * ```tsx
 * // From date
 * <ActivityStatusDot lastActivityDate="2024-01-15" />
 *
 * // From status
 * <ActivityStatusDot status="active" showLabel />
 *
 * // Compact
 * <ActivityStatusDot lastActivityDate={project.pushedAt} size="sm" />
 * ```
 */
export function ActivityStatusDot({
  lastActivityDate,
  status: providedStatus,
  size = "sm",
  showLabel = false,
  className,
}: ActivityStatusDotProps) {
  const prefersReducedMotion = useReducedMotion();

  // Determine status from date or use provided status
  const status = providedStatus ?? getActivityStatus(lastActivityDate ?? null);
  const style = getActivityStyle(status);

  const sizeClasses = {
    sm: "h-2 w-2",
    md: "h-2.5 w-2.5",
  };

  const dotSize = sizeClasses[size];

  return (
    <span
      className={cn("inline-flex items-center gap-1.5", className)}
      role="status"
      aria-label={`${style.label} project`}
    >
      {/* Dot with optional pulse */}
      <span className="relative flex">
        {/* Pulse animation for active status */}
        {style.pulse && !prefersReducedMotion && (
          <span
            className={cn(
              "absolute inline-flex h-full w-full animate-ping rounded-full opacity-75",
              style.dotClass
            )}
          />
        )}
        {/* Static dot */}
        <span
          className={cn(
            "relative inline-flex rounded-full",
            dotSize,
            style.dotClass
          )}
        />
      </span>

      {/* Optional label */}
      {showLabel && (
        <span className={cn("text-xs", style.textClass)}>{style.label}</span>
      )}
    </span>
  );
}
