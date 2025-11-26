import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export interface MetricTooltipProps {
  /** Tooltip content text */
  content: string;
  /** Element to wrap with tooltip */
  children: React.ReactNode;
  /** Tooltip position */
  side?: "top" | "bottom" | "left" | "right";
  /** Whether to show underline decoration */
  underline?: boolean;
  /** Additional class names */
  className?: string;
}

/**
 * Reusable tooltip wrapper for metrics and stats
 *
 * Provides consistent styling for hoverable metrics with
 * contextual information displayed on hover/focus.
 *
 * @example
 * ```tsx
 * <MetricTooltip content="1,250 stars - Top 5% of TypeScript projects">
 *   <span>1.2k stars</span>
 * </MetricTooltip>
 * ```
 */
export function MetricTooltip({
  content,
  children,
  side = "top",
  underline = true,
  className,
}: MetricTooltipProps) {
  return (
    <Tooltip delayDuration={300}>
      <TooltipTrigger asChild>
        <span
          className={cn(
            "cursor-help",
            underline &&
              "underline decoration-dotted decoration-muted-foreground/50 underline-offset-2",
            className,
          )}
        >
          {children}
        </span>
      </TooltipTrigger>
      <TooltipContent side={side} className="max-w-xs">
        <p className="text-xs leading-relaxed">{content}</p>
      </TooltipContent>
    </Tooltip>
  );
}
