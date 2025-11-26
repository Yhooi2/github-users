import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  getScoreColor,
  getScoreBackgroundColor,
  getScoreLevel,
} from "@/lib/design-tokens";
import { type MetricKey } from "@/lib/metrics/categories";
import { cn } from "@/lib/utils";
import { type LucideIcon } from "lucide-react";
import { useResponsive } from "@/hooks/useResponsive";
import { MetricTooltipContent } from "./MetricTooltipContent";

export interface MetricRowCompactProps {
  /** Metric key identifier */
  metricKey: MetricKey;
  /** Metric title */
  title: string;
  /** Score value (0-100) */
  score: number;
  /** Level label (e.g., "High", "Low") */
  level: string;
  /** Lucide icon component */
  icon: LucideIcon;
  /** Score breakdown by component */
  breakdown?: Record<string, number>;
  /** Callback when metric is clicked (mobile only) */
  onMetricClick?: () => void;
  /** Loading state */
  loading?: boolean;
}

/**
 * MetricRowCompact - Compact metric row with tooltip/click interaction
 *
 * Displays a metric in a horizontal layout with:
 * - Icon on the left
 * - Title and score
 * - Progress bar
 *
 * Interaction:
 * - Desktop: Tooltip on hover shows description + breakdown
 * - Mobile: Click triggers onMetricClick callback for Sheet
 *
 * Used inside MetricCategoryCard for the Always Expanded Cards design.
 *
 * @example
 * ```tsx
 * <MetricRowCompact
 *   metricKey="activity"
 *   title="Activity"
 *   score={85}
 *   level="High"
 *   icon={Zap}
 *   breakdown={{ recentCommits: 35, consistency: 25, diversity: 25 }}
 *   onMetricClick={() => openSheet("activity")}
 * />
 * ```
 */
export function MetricRowCompact({
  metricKey,
  title,
  score,
  level,
  icon: Icon,
  breakdown,
  onMetricClick,
  loading = false,
}: MetricRowCompactProps) {
  const { isMobile } = useResponsive();
  const scoreColor = getScoreColor(score);
  const scoreLevel = getScoreLevel(score);
  const bgColor = getScoreBackgroundColor(score);

  if (loading) {
    return (
      <div className="flex items-center gap-3 animate-pulse" role="status">
        <div className="h-5 w-5 rounded-full bg-muted" />
        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between">
            <div className="h-4 w-20 rounded bg-muted" />
            <div className="h-4 w-10 rounded bg-muted" />
          </div>
          <div className="h-2 w-full rounded-full bg-muted" />
        </div>
        <span className="sr-only">Loading metric...</span>
      </div>
    );
  }

  // Progress bar color based on score level
  const progressColorClass = {
    high: "[&>[data-slot=progress-indicator]]:bg-success",
    medium: "[&>[data-slot=progress-indicator]]:bg-warning",
    low: "[&>[data-slot=progress-indicator]]:bg-caution",
    critical: "[&>[data-slot=progress-indicator]]:bg-destructive",
  }[scoreLevel];

  const progressBgClass = {
    high: "bg-success/20",
    medium: "bg-warning/20",
    low: "bg-caution/20",
    critical: "bg-destructive/20",
  }[scoreLevel];

  // Core metric row content
  const metricContent = (
    <div
      className={cn(
        "flex items-center gap-3 rounded-md -mx-1 px-1 transition-colors",
        isMobile
          ? "active:bg-muted/50 cursor-pointer"
          : "hover:bg-muted/30 cursor-default"
      )}
      onClick={isMobile && onMetricClick ? onMetricClick : undefined}
      role={isMobile && onMetricClick ? "button" : undefined}
      tabIndex={isMobile && onMetricClick ? 0 : undefined}
      onKeyDown={
        isMobile && onMetricClick
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onMetricClick();
              }
            }
          : undefined
      }
      aria-label={
        isMobile && onMetricClick
          ? `${title}: ${score}%. Tap for details.`
          : `${title}: ${score}% - ${level}`
      }
    >
      {/* Icon */}
      <div
        className={cn(
          "flex h-7 w-7 shrink-0 items-center justify-center rounded-full",
          bgColor
        )}
        aria-hidden="true"
      >
        <Icon className={cn("h-4 w-4", scoreColor)} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 space-y-1.5">
        {/* Title and Score row */}
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm font-medium text-foreground truncate">
            {title}
          </span>
          <div className="flex items-center gap-1.5 shrink-0">
            <span
              className={cn("text-sm font-bold tabular-nums", scoreColor)}
              aria-label={`${score} percent`}
            >
              {score}%
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <Progress
          value={score}
          className={cn("h-1.5", progressBgClass, progressColorClass)}
          aria-label={`${title} score: ${score}% - ${level}`}
        />
      </div>
    </div>
  );

  // Desktop: Wrap with Tooltip
  if (!isMobile) {
    return (
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>{metricContent}</TooltipTrigger>
        <TooltipContent
          side="top"
          align="center"
          className="w-64 p-3 bg-popover text-popover-foreground border shadow-lg"
        >
          <MetricTooltipContent
            metricKey={metricKey}
            score={score}
            breakdown={breakdown}
          />
        </TooltipContent>
      </Tooltip>
    );
  }

  // Mobile: Just return content (click handled internally)
  return metricContent;
}
