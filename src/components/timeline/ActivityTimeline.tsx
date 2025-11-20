import type { YearData } from "@/hooks/useUserAnalytics";
import { TimelineYear } from "./TimelineYear";

export interface ActivityTimelineProps {
  timeline: YearData[];
  loading?: boolean;
}

/**
 * Activity Timeline Component
 *
 * Displays year-by-year activity timeline with collapsible years.
 * Shows commits, PRs, issues, and repositories for each year.
 *
 * @example
 * ```tsx
 * <ActivityTimeline timeline={timeline} />
 *
 * // With loading state
 * <ActivityTimeline timeline={[]} loading />
 * ```
 */
export function ActivityTimeline({
  timeline,
  loading = false,
}: ActivityTimelineProps) {
  if (loading) {
    return <TimelineSkeleton />;
  }

  if (!timeline.length) {
    return (
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">📊 Activity Timeline</h2>
        <div className="rounded-lg border p-8 text-center text-muted-foreground">
          No activity data available
        </div>
      </section>
    );
  }

  const maxCommits = Math.max(...timeline.map((y) => y.totalCommits));

  return (
    <section className="space-y-4" aria-label="Activity Timeline">
      <h2 className="text-2xl font-bold">📊 Activity Timeline</h2>

      <div className="space-y-2">
        {timeline.map((year) => (
          <TimelineYear key={year.year} year={year} maxCommits={maxCommits} />
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
