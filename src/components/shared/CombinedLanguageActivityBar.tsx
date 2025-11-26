/**
 * CombinedLanguageActivityBar - Displays activity intensity with language breakdown
 *
 * A horizontal bar that encodes TWO dimensions:
 * - Width = Activity intensity (commits / maxCommits)
 * - Color segments = Language breakdown (% composition)
 *
 * This provides instant visual comparison across projects while showing
 * technical composition at a glance.
 */

import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getLanguageColor } from "@/lib/constants";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

export interface LanguageBreakdown {
  /** Programming language name */
  name: string;
  /** Percentage of codebase (0-100) */
  percent: number;
}

export interface CombinedLanguageActivityBarProps {
  /** Total commits for this period */
  commitCount: number;
  /** Maximum commits across all periods (for normalization) */
  maxCommits: number;
  /** Language breakdown data */
  languages: LanguageBreakdown[];
  /** Whether parent container is selected/active */
  isSelected?: boolean;
  /** Compact mode (mobile/small screens) */
  compact?: boolean;
  /** Custom bar height (overrides compact) */
  barHeight?: string;
  /** Additional container classes */
  className?: string;
}

/**
 * Format number with locale-aware separators
 */
function formatNumber(num: number): string {
  return num.toLocaleString();
}

/**
 * CombinedLanguageActivityBar Component
 *
 * Displays a bar where width represents commit activity and
 * colored segments represent language distribution.
 *
 * @example
 * ```tsx
 * <CombinedLanguageActivityBar
 *   commitCount={347}
 *   maxCommits={500}
 *   languages={[
 *     { name: "TypeScript", percent: 68 },
 *     { name: "JavaScript", percent: 22 },
 *     { name: "CSS", percent: 10 },
 *   ]}
 * />
 * ```
 */
export function CombinedLanguageActivityBar({
  commitCount,
  maxCommits,
  languages,
  isSelected = false,
  compact = false,
  barHeight,
  className,
}: CombinedLanguageActivityBarProps) {
  const prefersReducedMotion = useReducedMotion();

  // Calculate activity percentage (min 2% for visibility when > 0 commits)
  const activityPercent = useMemo(() => {
    if (maxCommits <= 0 || commitCount <= 0) return 0;
    return Math.max(2, Math.min((commitCount / maxCommits) * 100, 100));
  }, [commitCount, maxCommits]);

  // Sort and filter languages
  const sortedLanguages = useMemo(() => {
    return [...languages]
      .filter((lang) => lang.percent > 0)
      .sort((a, b) => b.percent - a.percent);
  }, [languages]);

  // Determine height class
  const heightClass = barHeight ?? (compact ? "h-1.5" : "h-2");

  // ARIA label for accessibility
  const ariaLabel = useMemo(() => {
    const activityPart = `${formatNumber(commitCount)} commits (${activityPercent.toFixed(0)}% of peak)`;
    const langPart = sortedLanguages
      .slice(0, 4)
      .map((l) => `${l.name} ${l.percent.toFixed(0)}%`)
      .join(", ");
    return `Activity: ${activityPart}. Languages: ${langPart}`;
  }, [commitCount, activityPercent, sortedLanguages]);

  // No commits or maxCommits = no bar (empty state)
  if (commitCount <= 0 || maxCommits <= 0 || sortedLanguages.length === 0) {
    return (
      <div className={cn("w-full", className)}>
        <div
          className={cn(
            "w-full overflow-hidden rounded-full bg-activity-bar-bg/40",
            heightClass
          )}
          role="img"
          aria-label="No activity"
        />
      </div>
    );
  }

  return (
    <div className={cn("w-full", className)}>
      <TooltipProvider delayDuration={200}>
        <Tooltip>
          <TooltipTrigger asChild>
            {/* Background track (full width) */}
            <div
              className={cn(
                "w-full overflow-hidden rounded-full transition-shadow duration-200",
                heightClass,
                "bg-activity-bar-bg/40",
                isSelected && "shadow-[0_0_12px_-2px] shadow-primary/40"
              )}
              role="img"
              aria-label={ariaLabel}
            >
              {/* Animated activity bar (dynamic width) */}
              <motion.div
                className="flex h-full rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${activityPercent}%` }}
                transition={{
                  duration: prefersReducedMotion ? 0 : 0.6,
                  ease: [0.34, 1.56, 0.64, 1], // Subtle bounce
                  delay: prefersReducedMotion ? 0 : 0.1,
                }}
              >
                {/* Language segments */}
                {sortedLanguages.map((lang, index) => (
                  <motion.div
                    key={lang.name}
                    className={cn(
                      "h-full",
                      index === 0 && "rounded-l-full",
                      index === sortedLanguages.length - 1 && "rounded-r-full"
                    )}
                    style={{
                      width: `${lang.percent}%`,
                      backgroundColor: getLanguageColor(lang.name),
                      minWidth: lang.percent > 0 ? "2px" : "0",
                    }}
                    initial={{ opacity: 0, scaleX: 0 }}
                    animate={{ opacity: 1, scaleX: 1 }}
                    transition={{
                      duration: prefersReducedMotion ? 0 : 0.4,
                      delay: prefersReducedMotion
                        ? 0
                        : 0.15 + index * 0.05,
                      ease: "easeOut",
                    }}
                  />
                ))}
              </motion.div>
            </div>
          </TooltipTrigger>

          {/* Tooltip with two sections */}
          <TooltipContent
            side="top"
            align="start"
            className="max-w-xs text-xs"
          >
            <div className="space-y-2">
              {/* Activity section */}
              <div className="font-medium">
                <span className="text-foreground">
                  {formatNumber(commitCount)}
                </span>
                <span className="ml-1 text-muted-foreground">
                  commits ({activityPercent.toFixed(0)}% of peak)
                </span>
              </div>

              {/* Language breakdown */}
              <div className="space-y-1 border-t border-border pt-2">
                <div className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                  Languages
                </div>
                {sortedLanguages.slice(0, 4).map((lang) => (
                  <div
                    key={lang.name}
                    className="flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-1.5">
                      <span
                        className="h-2 w-2 flex-shrink-0 rounded-full"
                        style={{ backgroundColor: getLanguageColor(lang.name) }}
                      />
                      <span className="text-muted-foreground">{lang.name}</span>
                    </div>
                    <span className="font-medium">
                      {lang.percent.toFixed(1)}%
                    </span>
                  </div>
                ))}
                {sortedLanguages.length > 4 && (
                  <div className="text-[10px] text-muted-foreground">
                    +{sortedLanguages.length - 4} more
                  </div>
                )}
              </div>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
