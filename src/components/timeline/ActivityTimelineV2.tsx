/**
 * ActivityTimelineV2 - Timeline with 3-level progressive disclosure
 *
 * Drop-in replacement for ActivityTimeline with new Level 0/1/2 components.
 */

import type { YearData } from "@/hooks/useUserAnalytics";
import { TimelineYearV2 } from "./TimelineYearV2";

export interface ActivityTimelineV2Props {
  /** Timeline data from useUserAnalytics */
  timeline: YearData[];
  /** Loading state */
  loading?: boolean;
  /** GitHub username for ownership detection */
  username: string;
}

/**
 * ActivityTimelineV2 Component
 *
 * Displays year-by-year activity with 3-level progressive disclosure:
 * - Level 0: Compact year rows (all collapsed by default)
 * - Level 1: Expanded year with project cards (Framer Motion)
 * - Level 2: Full analytics modal with 4 tabs
 *
 * @example
 * ```tsx
 * const { timeline, loading } = useUserAnalytics(username);
 *
 * <ActivityTimelineV2
 *   timeline={timeline}
 *   loading={loading}
 *   username={username}
 * />
 * ```
 */
export function ActivityTimelineV2({
  timeline,
  loading = false,
  username,
}: ActivityTimelineV2Props) {
  if (loading) {
    return <TimelineSkeleton />;
  }

  if (!timeline.length) {
    return (
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Activity Timeline</h2>
        <div className="rounded-lg border p-8 text-center text-muted-foreground">
          No activity data available
        </div>
      </section>
    );
  }

  // Calculate max commits across all years for consistent bar scaling
  const maxCommits = Math.max(...timeline.map((y) => y.totalCommits));

  return (
    <section className="space-y-4" aria-label="Activity Timeline">
      <h2 className="text-2xl font-bold">Activity Timeline</h2>

      <div className="space-y-2">
        {timeline.map((year) => (
          <TimelineYearV2
            key={year.year}
            year={year}
            maxCommits={maxCommits}
            username={username}
          />
        ))}
      </div>
    </section>
  );
}

/**
 * Loading skeleton for timeline
 */
function TimelineSkeleton() {
  return (
    <section className="space-y-4" aria-label="Loading activity timeline">
      <div className="h-8 w-64 animate-pulse rounded bg-muted" />
      <div className="space-y-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-16 animate-pulse rounded-lg bg-muted" />
        ))}
      </div>
    </section>
  );
}
