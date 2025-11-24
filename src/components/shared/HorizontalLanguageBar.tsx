/**
 * HorizontalLanguageBar - Displays a stacked horizontal bar of programming languages
 *
 * Based on the design from ProjectAnalyticsModal CodeTab.
 * Shows language breakdown as a horizontal stacked bar with optional legend below.
 */

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getLanguageColor } from "@/lib/constants";
import { cn } from "@/lib/utils";

export interface LanguageBreakdown {
  /** Programming language name */
  name: string;
  /** Percentage of codebase (0-100) */
  percent: number;
  /** Size in bytes (optional) */
  size?: number;
}

export interface HorizontalLanguageBarProps {
  /** Array of languages with percentages */
  languages: LanguageBreakdown[];
  /** Height of the bar (default: h-2) */
  barHeight?: string;
  /** Whether to show language legend below the bar */
  showLegend?: boolean;
  /** Maximum number of languages to show in legend (default: 5) */
  maxLegendItems?: number;
  /** Whether to show percentages in legend */
  showPercentages?: boolean;
  /** Additional class for container */
  className?: string;
  /** Whether the component is in compact mode (no gaps, smaller text) */
  compact?: boolean;
}

/**
 * HorizontalLanguageBar Component
 *
 * Displays a stacked horizontal bar showing language breakdown.
 * Each segment is colored according to GitHub's language colors.
 *
 * @example
 * ```tsx
 * <HorizontalLanguageBar
 *   languages={[
 *     { name: "TypeScript", percent: 68 },
 *     { name: "JavaScript", percent: 20 },
 *     { name: "CSS", percent: 12 },
 *   ]}
 *   showLegend
 * />
 * ```
 */
export function HorizontalLanguageBar({
  languages,
  barHeight = "h-2",
  showLegend = false,
  maxLegendItems = 5,
  showPercentages = true,
  className,
  compact = false,
}: HorizontalLanguageBarProps) {
  // Filter out zero-percent languages and sort by percentage
  const sortedLanguages = [...languages]
    .filter((lang) => lang.percent > 0)
    .sort((a, b) => b.percent - a.percent);

  if (sortedLanguages.length === 0) {
    return null;
  }

  // Limit legend items
  const legendLanguages = sortedLanguages.slice(0, maxLegendItems);
  const hasOthers = sortedLanguages.length > maxLegendItems;
  const othersPercent = hasOthers
    ? sortedLanguages.slice(maxLegendItems).reduce((sum, l) => sum + l.percent, 0)
    : 0;

  return (
    <div className={cn("w-full", className)}>
      {/* Stacked bar */}
      <TooltipProvider delayDuration={200}>
        <div
          className={cn(
            "flex w-full overflow-hidden rounded-full",
            barHeight,
            compact ? "bg-muted/30" : "bg-muted/50"
          )}
          role="img"
          aria-label={`Language breakdown: ${sortedLanguages
            .map((l) => `${l.name} ${l.percent}%`)
            .join(", ")}`}
        >
          {sortedLanguages.map((lang, index) => (
            <Tooltip key={lang.name}>
              <TooltipTrigger asChild>
                <div
                  className={cn(
                    "h-full transition-all duration-200",
                    index === 0 && "rounded-l-full",
                    index === sortedLanguages.length - 1 && "rounded-r-full"
                  )}
                  style={{
                    width: `${lang.percent}%`,
                    backgroundColor: getLanguageColor(lang.name),
                    minWidth: lang.percent > 0 ? "2px" : "0",
                  }}
                />
              </TooltipTrigger>
              <TooltipContent side="top" className="text-xs">
                <span className="font-medium">{lang.name}</span>
                <span className="ml-1 text-muted-foreground">
                  {lang.percent.toFixed(1)}%
                </span>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </TooltipProvider>

      {/* Legend */}
      {showLegend && (
        <div
          className={cn(
            "flex flex-wrap items-center",
            compact ? "mt-1.5 gap-x-3 gap-y-1" : "mt-2 gap-x-4 gap-y-1.5"
          )}
        >
          {legendLanguages.map((lang) => (
            <div
              key={lang.name}
              className={cn(
                "flex items-center",
                compact ? "gap-1 text-[10px]" : "gap-1.5 text-xs"
              )}
            >
              <span
                className={cn(
                  "flex-shrink-0 rounded-full",
                  compact ? "h-2 w-2" : "h-2.5 w-2.5"
                )}
                style={{ backgroundColor: getLanguageColor(lang.name) }}
                aria-hidden="true"
              />
              <span className="text-muted-foreground">{lang.name}</span>
              {showPercentages && (
                <span className="font-medium text-foreground">
                  {lang.percent.toFixed(0)}%
                </span>
              )}
            </div>
          ))}
          {hasOthers && (
            <div
              className={cn(
                "flex items-center",
                compact ? "gap-1 text-[10px]" : "gap-1.5 text-xs"
              )}
            >
              <span
                className={cn(
                  "flex-shrink-0 rounded-full bg-muted-foreground/50",
                  compact ? "h-2 w-2" : "h-2.5 w-2.5"
                )}
                aria-hidden="true"
              />
              <span className="text-muted-foreground">Other</span>
              {showPercentages && (
                <span className="font-medium text-foreground">
                  {othersPercent.toFixed(0)}%
                </span>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
