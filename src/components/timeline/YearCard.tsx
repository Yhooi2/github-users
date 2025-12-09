/**
 * YearCard - Compact year card for desktop sidebar
 *
 * Used in the 33% left panel of the desktop split layout.
 * Shows year summary with visual activity bar and key metrics.
 */

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useReducedMotion } from "@/hooks";
import type { YearData } from "@/hooks/useUserAnalytics";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { GitCommit, GitPullRequest, FolderGit2 } from "lucide-react";
import { TimelineStatTooltip } from "./TimelineStatTooltip";
import { YearBadge } from "./YearBadge";
import { MiniActivityChart } from "./MiniActivityChart";
import { analyzeYear } from "@/lib/year-badges";
import { useMemo } from "react";

export interface YearCardProps {
  /** Year data from Apollo */
  year: YearData;
  /** Max commits across all years (for bar normalization) */
  maxCommits: number;
  /** All years data (for badge analysis) */
  allYears: Array<{ year: number; totalCommits: number }>;
  /** Whether this year is currently selected */
  isSelected: boolean;
  /** Callback when year is clicked */
  onSelect: () => void;
}

/**
 * YearCard Component
 *
 * Displays a compact year summary in the desktop sidebar.
 * Features visual activity bar and selection state.
 *
 * Per design plan: Compact cards in left panel with activity visualization.
 *
 * @example
 * ```tsx
 * <YearCard
 *   year={yearData}
 *   maxCommits={1000}
 *   isSelected={selectedYear === yearData.year}
 *   onSelect={() => setSelectedYear(yearData.year)}
 * />
 * ```
 */
export function YearCard({
  year,
  maxCommits,
  allYears,
  isSelected,
  onSelect,
}: YearCardProps) {
  const prefersReducedMotion = useReducedMotion();

  // Calculate bar width percentage
  const widthPercent =
    maxCommits > 0 ? (year.totalCommits / maxCommits) * 100 : 0;

  const repoCount = year.ownedRepos.length + year.contributions.length;

  // Analyze year for badge
  const analysis = useMemo(
    () => analyzeYear(
      year.year,
      year.totalCommits,
      allYears.map(y => ({ year: y.year, commits: y.totalCommits }))
    ),
    [year.year, year.totalCommits, allYears]
  );

  return (
    <motion.button
      onClick={onSelect}
      className={cn(
        "group w-full rounded-xl border bg-card p-4 text-left transition-all duration-200",
        "hover:border-primary/50 hover:shadow-lg hover:bg-accent/50",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        isSelected && "bg-primary/5 shadow-md"
      )}
      // Removed scale/translate hover animations to prevent overflow in sidebar
      // CSS hover effects (border, shadow, bg) provide sufficient visual feedback
      whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
      aria-pressed={isSelected}
      aria-label={`Select year ${year.year}, ${year.totalCommits} commits, ${repoCount} repositories`}
    >
      {/* Year label with badge */}
      <div className="mb-3 flex items-center justify-between">
        <span className={cn(
          "text-2xl font-bold tracking-tight",
          isSelected && "text-primary"
        )}>
          {year.year}
        </span>
        <YearBadge badge={analysis.badge} size="sm" />
      </div>

      {/* Visual activity bar with improved contrast */}
      <div className="mb-4 h-2.5 w-full overflow-hidden rounded-full bg-activity-bar-bg transition-shadow duration-200 group-hover:shadow-sm">
        <motion.div
          className={cn(
            "h-full rounded-full transition-colors duration-200",
            isSelected
              ? "bg-activity-bar-fill-active"
              : "bg-activity-bar-fill"
          )}
          initial={{ width: 0 }}
          animate={{ width: `${widthPercent}%` }}
          transition={{
            duration: prefersReducedMotion ? 0 : 0.5,
            ease: [0.4, 0, 0.2, 1],
          }}
        />
      </div>

      {/* Mini activity chart */}
      {year.monthlyContributions && year.monthlyContributions.length > 0 && (
        <div className="mb-4">
          <MiniActivityChart monthlyData={year.monthlyContributions} />
        </div>
      )}

      {/* Metrics with icons + tooltips */}
      <div className="grid grid-cols-3 gap-2 text-xs">
        <Tooltip delayDuration={200}>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors">
              <GitCommit className="h-3.5 w-3.5" aria-hidden="true" />
              <span className="font-medium text-foreground">
                {year.totalCommits.toLocaleString()}
              </span>
            </div>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="w-64 p-3">
            <TimelineStatTooltip
              statType="commits"
              value={year.totalCommits}
              context={String(year.year)}
            />
          </TooltipContent>
        </Tooltip>

        <Tooltip delayDuration={200}>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors">
              <GitPullRequest className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{year.totalPRs}</span>
            </div>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="w-64 p-3">
            <TimelineStatTooltip
              statType="prs"
              value={year.totalPRs}
              context={String(year.year)}
            />
          </TooltipContent>
        </Tooltip>

        <Tooltip delayDuration={200}>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors">
              <FolderGit2 className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{repoCount}</span>
            </div>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="w-64 p-3">
            <TimelineStatTooltip
              statType="repos"
              value={repoCount}
              context={String(year.year)}
            />
          </TooltipContent>
        </Tooltip>
      </div>
    </motion.button>
  );
}
