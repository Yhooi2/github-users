import type { YearData } from "@/hooks/useUserAnalytics";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { YearExpandedView } from "./YearExpandedView";

export interface TimelineYearProps {
  year: YearData;
  maxCommits: number;
}

/**
 * Timeline Year Component
 *
 * Displays a collapsible year row with activity bar and statistics.
 * Expands to show detailed breakdown when clicked.
 *
 * @example
 * ```tsx
 * <TimelineYear year={yearData} maxCommits={1000} />
 * ```
 */
export function TimelineYear({ year, maxCommits }: TimelineYearProps) {
  const [expanded, setExpanded] = useState(false);
  const widthPercent =
    maxCommits > 0 ? (year.totalCommits / maxCommits) * 100 : 0;

  return (
    <div className="overflow-hidden rounded-lg border">
      {/* Year bar (clickable) */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-4 text-left transition-colors hover:bg-muted"
        aria-expanded={expanded}
        aria-label={`Toggle ${year.year} details`}
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-1 items-center gap-4">
            {/* Year label */}
            <span className="text-lg font-semibold">{year.year}</span>

            {/* Visual bar */}
            <div className="h-8 min-w-[100px] flex-1 rounded bg-muted">
              <div
                className="h-full rounded bg-primary transition-all duration-500"
                style={{ width: `${widthPercent}%` }}
                aria-label={`${widthPercent.toFixed(0)}% of maximum commits`}
              />
            </div>

            {/* Stats */}
            <div className="flex gap-4 text-sm text-muted-foreground">
              <span>{year.totalCommits} commits</span>
              <span>{year.totalPRs} PRs</span>
              <span>
                {year.ownedRepos.length + year.contributions.length} repos
              </span>
            </div>
          </div>

          {/* Expand icon */}
          {expanded ? (
            <ChevronUp className="h-5 w-5" aria-hidden="true" />
          ) : (
            <ChevronDown className="h-5 w-5" aria-hidden="true" />
          )}
        </div>
      </button>

      {/* Expanded details */}
      {expanded && (
        <div className="animate-in border-t p-4 duration-200 fade-in slide-in-from-top-2">
          <YearExpandedView year={year} />
        </div>
      )}
    </div>
  );
}
