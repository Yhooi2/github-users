/**
 * DesktopTimelineLayout - 33/67 split layout for desktop (>=1440px)
 *
 * Left panel (33%): Year cards sidebar with "All Time" header
 * Right panel (67%): Year detail or all-time stats and projects
 */

import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { YearData } from "@/hooks/useUserAnalytics";
import { cn } from "@/lib/utils";
import { getCareerSummary } from "@/lib/year-badges";
import { CircleDot, FolderGit2, GitCommit, GitPullRequest } from "lucide-react";
import { useMemo, useState } from "react";
import { CareerSummaryHeader } from "./CareerSummaryHeader";
import { TimelineStatTooltip } from "./TimelineStatTooltip";
import { YearCardWrapper as YearCard } from "./YearCardGlass.wrapper";
import { YearDetailPanel } from "./YearDetailPanel";

export interface DesktopTimelineLayoutProps {
  /** Timeline data from useUserAnalytics */
  timeline: YearData[];
  /** GitHub username for ownership detection */
  username: string;
  /** Additional class names */
  className?: string;
}

/**
 * DesktopTimelineLayout Component
 *
 * Implements the 33/67 split layout for desktop screens (>=1440px).
 * - Left panel: Scrollable list of year cards with "All Time" at top
 * - Right panel: Details for the selected year or all-time summary
 *
 * Uses CSS Grid with `1fr 2fr` for the 33/67 split ratio.
 * Initially shows "All Time" view (all years collapsed).
 *
 * @example
 * ```tsx
 * <DesktopTimelineLayout
 *   timeline={timeline}
 *   username="torvalds"
 * />
 * ```
 */
export function DesktopTimelineLayout({
  timeline,
  username,
  className,
}: DesktopTimelineLayoutProps) {
  // Default to "all-time" view (null = no specific year selected)
  const [selectedYear, setSelectedYear] = useState<number | null>(null);

  // Calculate max commits for bar normalization
  const maxCommits = useMemo(
    () => Math.max(...timeline.map((y) => y.totalCommits), 1),
    [timeline],
  );

  // Prepare simplified years data for badge analysis
  const allYears = useMemo(
    () => timeline.map((y) => ({ year: y.year, totalCommits: y.totalCommits })),
    [timeline],
  );

  // Calculate career summary for header
  const careerSummary = useMemo(() => {
    return getCareerSummary(timeline);
  }, [timeline]);

  // Calculate all-time totals for sidebar header
  const allTimeTotals = useMemo(() => {
    const uniqueRepos = new Set<string>();
    let totalCommits = 0;
    let totalPRs = 0;
    let totalIssues = 0;

    for (const year of timeline) {
      totalCommits += year.totalCommits;
      totalPRs += year.totalPRs;
      totalIssues += year.totalIssues;
      for (const repo of year.ownedRepos) uniqueRepos.add(repo.repository.id);
      for (const contrib of year.contributions)
        uniqueRepos.add(contrib.repository.id);
    }

    return {
      totalCommits,
      totalPRs,
      totalIssues,
      totalRepos: uniqueRepos.size,
    };
  }, [timeline]);

  // Find selected year data
  const selectedYearData = useMemo(
    () => timeline.find((y) => y.year === selectedYear) ?? null,
    [timeline, selectedYear],
  );

  return (
    <section
      className={cn("grid grid-cols-[1fr_2fr] gap-6", className)}
      aria-label="Activity Timeline"
    >
      {/* Left Panel: Sticky Year Cards Sidebar (33%) */}
      <aside aria-label="Year navigation">
        <div className="sticky top-6 flex max-h-[calc(100vh-3rem)] flex-col overflow-hidden rounded-xl border bg-card shadow-sm">
          {/* Fixed Header: Career Summary + All Time */}
          <div className="shrink-0">
            {/* Career Summary Header */}
            <CareerSummaryHeader summary={careerSummary} />

            {/* All Time Header - clickable to show all-time stats */}
            <button
              onClick={() => setSelectedYear(null)}
              className={cn(
                "w-full border-b p-4 text-left transition-colors",
                selectedYear === null
                  ? "border-primary/30 bg-primary/10"
                  : "bg-muted/30 hover:bg-muted/50",
              )}
              aria-pressed={selectedYear === null}
            >
              <h3
                className={cn(
                  "text-lg font-bold",
                  selectedYear === null && "text-primary",
                )}
              >
                All Time
              </h3>

              {/* Stats row - 4 columns with all metrics + tooltips */}
              <div className="mt-3 grid grid-cols-4 gap-2 text-xs">
                <Tooltip delayDuration={200}>
                  <TooltipTrigger asChild>
                    <div className="flex cursor-default items-center gap-1 text-muted-foreground transition-colors hover:text-foreground">
                      <GitCommit className="h-3.5 w-3.5" aria-hidden="true" />
                      <span className="font-medium text-foreground">
                        {allTimeTotals.totalCommits.toLocaleString()}
                      </span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="w-64 p-3">
                    <TimelineStatTooltip
                      statType="commits"
                      value={allTimeTotals.totalCommits}
                      context="all"
                    />
                  </TooltipContent>
                </Tooltip>

                <Tooltip delayDuration={200}>
                  <TooltipTrigger asChild>
                    <div className="flex cursor-default items-center gap-1 text-muted-foreground transition-colors hover:text-foreground">
                      <GitPullRequest
                        className="h-3.5 w-3.5"
                        aria-hidden="true"
                      />
                      <span className="font-medium text-foreground">
                        {allTimeTotals.totalPRs.toLocaleString()}
                      </span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="w-64 p-3">
                    <TimelineStatTooltip
                      statType="prs"
                      value={allTimeTotals.totalPRs}
                      context="all"
                    />
                  </TooltipContent>
                </Tooltip>

                <Tooltip delayDuration={200}>
                  <TooltipTrigger asChild>
                    <div className="flex cursor-default items-center gap-1 text-muted-foreground transition-colors hover:text-foreground">
                      <CircleDot className="h-3.5 w-3.5" aria-hidden="true" />
                      <span className="font-medium text-foreground">
                        {allTimeTotals.totalIssues.toLocaleString()}
                      </span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="w-64 p-3">
                    <TimelineStatTooltip
                      statType="issues"
                      value={allTimeTotals.totalIssues}
                      context="all"
                    />
                  </TooltipContent>
                </Tooltip>

                <Tooltip delayDuration={200}>
                  <TooltipTrigger asChild>
                    <div className="flex cursor-default items-center gap-1 text-muted-foreground transition-colors hover:text-foreground">
                      <FolderGit2 className="h-3.5 w-3.5" aria-hidden="true" />
                      <span className="font-medium text-foreground">
                        {allTimeTotals.totalRepos}
                      </span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="w-64 p-3">
                    <TimelineStatTooltip
                      statType="repos"
                      value={allTimeTotals.totalRepos}
                      context="all"
                    />
                  </TooltipContent>
                </Tooltip>
              </div>
            </button>
          </div>

          {/* Scrollable Year Cards List */}
          <ScrollArea className="min-h-0 flex-1">
            <div className="space-y-2 p-3">
              {timeline.map((year) => (
                <YearCard
                  key={year.year}
                  year={year}
                  maxCommits={maxCommits}
                  allYears={allYears}
                  isSelected={selectedYear === year.year}
                  onSelect={() => setSelectedYear(year.year)}
                />
              ))}
            </div>
          </ScrollArea>
        </div>
      </aside>

      {/* Right Panel: Sticky Year Detail or All-Time Summary (67%) */}
      <main aria-label={selectedYear ? "Year details" : "All-time summary"}>
        <div className="sticky top-6 max-h-[calc(100vh-3rem)] overflow-hidden rounded-xl border bg-card p-6 shadow-sm">
          <YearDetailPanel
            year={selectedYearData}
            timeline={timeline}
            username={username}
          />
        </div>
      </main>
    </section>
  );
}
