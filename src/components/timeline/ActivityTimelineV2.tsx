/**
 * ActivityTimelineV2 - Timeline with 3-level progressive disclosure
 *
 * Drop-in replacement for ActivityTimeline with new Level 0/1/2 components.
 *
 * Responsive behavior:
 * - Desktop (>=1440px): 33/67 split layout with year cards sidebar
 * - Tablet/Mobile (<1440px): Vertical accordion layout
 */

import { useResponsive } from "@/hooks";
import type { YearData } from "@/hooks/useUserAnalytics";
import { DesktopTimelineLayout } from "./DesktopTimelineLayout";
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
 * Responsive layout:
 * - Desktop (>=1440px): 33/67 split with sidebar navigation
 * - Tablet/Mobile (<1440px): Vertical accordion
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
  const { isDesktop } = useResponsive();

  if (loading) {
    return <TimelineSkeleton isDesktop={isDesktop} />;
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

  // Desktop: 33/67 split layout
  if (isDesktop) {
    return <DesktopTimelineLayout timeline={timeline} username={username} />;
  }

  // Tablet/Mobile: Accordion layout
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
 * Adapts to desktop/mobile layout
 */
function TimelineSkeleton({ isDesktop }: { isDesktop: boolean }) {
  if (isDesktop) {
    // Desktop: 33/67 split skeleton
    return (
      <section
        className="h-[calc(100vh-200px)] min-h-[600px]"
        aria-label="Loading activity timeline"
      >
        <div className="mb-4 h-8 w-64 animate-pulse rounded bg-muted" />
        <div className="grid h-[calc(100%-48px)] grid-cols-[1fr_2fr] gap-6">
          {/* Left panel skeleton */}
          <div className="rounded-lg border bg-card p-4">
            <div className="mb-4 h-6 w-24 animate-pulse rounded bg-muted" />
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="h-24 animate-pulse rounded-lg bg-muted"
                />
              ))}
            </div>
          </div>
          {/* Right panel skeleton */}
          <div className="rounded-lg border bg-card p-6">
            <div className="mb-6 h-8 w-48 animate-pulse rounded bg-muted" />
            <div className="mb-6 grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-20 animate-pulse rounded-lg bg-muted"
                />
              ))}
            </div>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-16 animate-pulse rounded-lg bg-muted"
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Mobile/Tablet: Accordion skeleton
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
