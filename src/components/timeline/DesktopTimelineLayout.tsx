/**
 * DesktopTimelineLayout - 33/67 split layout for desktop (>=1440px)
 *
 * Left panel (33%): Year cards sidebar
 * Right panel (67%): Year detail with stats and projects
 */

import { ScrollArea } from "@/components/ui/scroll-area";
import type { YearData } from "@/hooks/useUserAnalytics";
import { cn } from "@/lib/utils";
import { useMemo, useState } from "react";
import { YearCard } from "./YearCard";
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
 * - Left panel: Scrollable list of year cards
 * - Right panel: Details for the selected year
 *
 * Uses CSS Grid with `1fr 2fr` for the 33/67 split ratio.
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
  // Default to most recent year if available
  const [selectedYear, setSelectedYear] = useState<number | null>(() =>
    timeline.length > 0 ? timeline[0].year : null
  );

  // Calculate max commits for bar normalization
  const maxCommits = useMemo(
    () => Math.max(...timeline.map((y) => y.totalCommits), 1),
    [timeline]
  );

  // Find selected year data
  const selectedYearData = useMemo(
    () => timeline.find((y) => y.year === selectedYear) ?? null,
    [timeline, selectedYear]
  );

  return (
    <section
      className={cn("h-[calc(100vh-200px)] min-h-[600px]", className)}
      aria-label="Activity Timeline"
    >
      <h2 className="mb-4 flex items-center gap-2 text-2xl font-bold">
        <span className="text-xl" aria-hidden="true">📊</span>
        Activity Timeline
      </h2>

      {/* 33/67 Split Grid Layout */}
      <div className="grid h-[calc(100%-48px)] grid-cols-[1fr_2fr] gap-6">
        {/* Left Panel: Year Cards Sidebar (33%) */}
        <aside
          className="flex flex-col overflow-hidden rounded-xl border bg-card shadow-sm"
          aria-label="Year navigation"
        >
          <div className="border-b bg-muted/30 p-4">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Years ({timeline.length})
            </h3>
          </div>
          <ScrollArea className="flex-1 p-3">
            <div className="space-y-2">
              {timeline.map((year) => (
                <YearCard
                  key={year.year}
                  year={year}
                  maxCommits={maxCommits}
                  isSelected={selectedYear === year.year}
                  onSelect={() => setSelectedYear(year.year)}
                />
              ))}
            </div>
          </ScrollArea>
        </aside>

        {/* Right Panel: Year Detail (67%) */}
        <main
          className="overflow-hidden rounded-xl border bg-card p-6 shadow-sm"
          aria-label="Year details"
        >
          <YearDetailPanel year={selectedYearData} username={username} />
        </main>
      </div>
    </section>
  );
}
