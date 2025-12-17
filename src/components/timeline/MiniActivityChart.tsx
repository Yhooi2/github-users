import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { MonthlyContribution } from "@/lib/contribution-aggregator";
import { cn } from "@/lib/utils";
import { useMemo } from "react";

interface MiniActivityChartProps {
  monthlyData: MonthlyContribution[];
  className?: string;
  /** Height class (default: h-6) */
  height?: string;
  /** Show month labels below chart */
  showLabels?: boolean;
  /** Show tooltips on hover (default: true) */
  showTooltips?: boolean;
  /** Color variant */
  variant?: "default" | "primary" | "muted";
}

/**
 * MiniActivityChart - Compact monthly activity visualization
 *
 * Displays 12 bars representing monthly contribution activity.
 * Height of each bar is relative to the most active month.
 *
 * @param monthlyData - Array of monthly contribution data
 * @param height - Container height class (e.g., "h-16", "h-24")
 * @param showLabels - Show month labels below bars
 * @param showTooltips - Enable hover tooltips (default: true)
 * @param variant - Color scheme: default, primary, or muted
 */
export function MiniActivityChart({
  monthlyData,
  className,
  height = "h-6",
  showLabels = false,
  showTooltips = true,
  variant = "default",
}: MiniActivityChartProps) {
  const maxContributions = useMemo(
    () => Math.max(...monthlyData.map((m) => m.contributions), 1),
    [monthlyData],
  );

  // Variant color classes
  const variantClasses = {
    default: "bg-primary/30 hover:bg-primary/50",
    primary: "bg-primary hover:bg-primary/80",
    muted: "bg-muted-foreground/30 hover:bg-muted-foreground/50",
  };

  // Month labels (short 3-letter format)
  const monthLabels = [
    "Янв",
    "Фев",
    "Мар",
    "Апр",
    "Май",
    "Июн",
    "Июл",
    "Авг",
    "Сен",
    "Окт",
    "Ноя",
    "Дек",
  ];

  const barContent = (month: MonthlyContribution) => {
    const heightPercent = (month.contributions / maxContributions) * 100;
    const heightClass = getHeightClass(heightPercent);

    const bar = (
      <div
        className={cn(
          "flex-1 rounded-sm transition-colors",
          variantClasses[variant],
          heightClass,
        )}
        aria-label={`${month.monthName}: ${month.contributions} contributions`}
      />
    );

    // Wrap in tooltip if enabled
    if (showTooltips) {
      return (
        <Tooltip key={month.month} delayDuration={100}>
          <TooltipTrigger asChild>{bar}</TooltipTrigger>
          <TooltipContent side="top" className="text-xs">
            <p className="font-medium">{month.monthName}</p>
            <p className="text-muted-foreground">
              {month.contributions.toLocaleString()} contributions
            </p>
            <p className="text-muted-foreground">
              {month.daysActive} active days
            </p>
          </TooltipContent>
        </Tooltip>
      );
    }

    return <div key={month.month}>{bar}</div>;
  };

  return (
    <div className={className}>
      {/* Bars */}
      <div className={cn("flex items-end gap-0.5", height)}>
        {monthlyData.map((month) => barContent(month))}
      </div>

      {/* Labels (optional) */}
      {showLabels && (
        <div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
          {monthLabels.map((label, i) => (
            <span key={i} className="w-[8.33%] text-center">
              {label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * Map percentage to Tailwind height class
 */
function getHeightClass(percent: number): string {
  if (percent === 0) return "h-0.5";
  if (percent < 15) return "h-1";
  if (percent < 30) return "h-1.5";
  if (percent < 45) return "h-2";
  if (percent < 60) return "h-3";
  if (percent < 75) return "h-4";
  if (percent < 90) return "h-5";
  return "h-6";
}
