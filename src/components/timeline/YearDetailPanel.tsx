/**
 * YearDetailPanel - Right panel showing year details
 *
 * Used in the 67% right panel of the desktop split layout.
 * Shows summary stats, and project list with Level 0/1 components.
 * All analytics are now inline - no modal required.
 */

import { ExpandableProjectCard } from "@/components/level-1/ExpandableProjectCard";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useProgressiveDisclosure } from "@/hooks";
import type { YearData } from "@/hooks/useUserAnalytics";
import { toExpandableProjects } from "@/lib/adapters/project-adapter";
import { cn } from "@/lib/utils";
import { CircleDot, FolderGit2, GitCommit, GitPullRequest } from "lucide-react";
import { useMemo } from "react";

export interface YearDetailPanelProps {
  /** Selected year data (null = all-time view) */
  year: YearData | null;
  /** Full timeline data for all-time aggregation */
  timeline?: YearData[];
  /** GitHub username for ownership detection */
  username: string;
}

/**
 * Stat card for year summary metrics
 */
function StatCard({
  label,
  value,
  icon: Icon,
  className,
}: {
  label: string;
  value: number;
  icon?: React.ComponentType<{ className?: string }>;
  className?: string;
}) {
  return (
    <Card
      className={cn(
        "transition-all duration-200 hover:border-primary/30 hover:shadow-md",
        className,
      )}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
              {label}
            </div>
            <div className="text-2xl font-bold text-foreground">
              {value.toLocaleString()}
            </div>
          </div>
          {Icon && (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <Icon className="h-5 w-5 text-primary" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * YearDetailPanel Component
 *
 * Displays detailed information about a selected year in the desktop layout.
 * Includes summary statistics and project lists with Level 0/1 disclosure.
 * All analytics are inline - no modal needed.
 *
 * @example
 * ```tsx
 * <YearDetailPanel
 *   year={selectedYearData}
 *   username="torvalds"
 * />
 * ```
 */
export function YearDetailPanel({
  year,
  timeline = [],
  username,
}: YearDetailPanelProps) {
  // Progressive disclosure state for Level 1
  const { expandedProjects, toggleProject } = useProgressiveDisclosure({
    persistToUrl: true,
  });

  // Aggregate all-time stats when year is null
  const allTimeStats = useMemo(() => {
    if (year !== null || !timeline.length) return null;

    const repoMap = new Map<
      string,
      {
        repo:
          | (typeof timeline)[0]["ownedRepos"][0]
          | (typeof timeline)[0]["contributions"][0];
        isOwned: boolean;
      }
    >();
    let totalCommits = 0;
    let totalPRs = 0;
    let totalIssues = 0;

    for (const y of timeline) {
      totalCommits += y.totalCommits;
      totalPRs += y.totalPRs;
      totalIssues += y.totalIssues;

      // Collect unique repositories (keep latest version)
      for (const repo of y.ownedRepos) {
        const existing = repoMap.get(repo.repository.id);
        if (!existing || existing.isOwned === false) {
          repoMap.set(repo.repository.id, { repo, isOwned: true });
        }
      }
      for (const contrib of y.contributions) {
        if (!repoMap.has(contrib.repository.id)) {
          repoMap.set(contrib.repository.id, { repo: contrib, isOwned: false });
        }
      }
    }

    // Convert to arrays
    const ownedRepos = Array.from(repoMap.values())
      .filter((r) => r.isOwned)
      .map((r) => r.repo);
    const contributions = Array.from(repoMap.values())
      .filter((r) => !r.isOwned)
      .map((r) => r.repo);

    return {
      totalCommits,
      totalPRs,
      totalIssues,
      totalRepos: repoMap.size,
      ownedRepos,
      contributions,
      yearRange:
        timeline.length > 0
          ? `${timeline[timeline.length - 1].year}-${timeline[0].year}`
          : "",
    };
  }, [year, timeline]);

  // Convert year data to expandable projects
  const allProjects = useMemo(() => {
    if (year) {
      const combined = [...year.ownedRepos, ...year.contributions];
      return toExpandableProjects(combined, username);
    }
    if (allTimeStats) {
      const combined = [
        ...allTimeStats.ownedRepos,
        ...allTimeStats.contributions,
      ];
      return toExpandableProjects(combined, username);
    }
    return [];
  }, [year, allTimeStats, username]);

  // Max commits for project bars (within this year or all time)
  const maxProjectCommits = useMemo(
    () => Math.max(...allProjects.map((p) => p.commits), 1),
    [allProjects],
  );

  // Empty state when no year selected AND no timeline data
  if (!year && !allTimeStats) {
    return (
      <div className="flex h-full items-center justify-center rounded-lg border border-dashed p-8">
        <div className="text-center text-muted-foreground">
          <p className="text-lg font-medium">No data available</p>
          <p className="text-sm">No activity data to display</p>
        </div>
      </div>
    );
  }

  // Check if showing all-time view (stats already in left panel)
  const isAllTimeView = year === null;

  // Determine stats to display (only for year-specific views)
  const displayStats = year
    ? {
        title: `${year.year} Activity`,
        totalCommits: year.totalCommits,
        totalPRs: year.totalPRs,
        totalIssues: year.totalIssues,
        totalRepos: year.ownedRepos.length + year.contributions.length,
      }
    : null;

  const ownedProjects = allProjects.filter((p) => p.isOwner);
  const contributedProjects = allProjects.filter((p) => !p.isOwner);

  return (
    <div className="flex flex-col">
      {/* Header - different for all-time vs year-specific */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold">
          {isAllTimeView ? "All Projects" : displayStats!.title}
        </h2>
        <Badge variant="outline" className="text-sm">
          {isAllTimeView ? allProjects.length : displayStats!.totalRepos}{" "}
          repositories
        </Badge>
      </div>

      {/* Summary Stats Grid - only for year-specific views */}
      {!isAllTimeView && displayStats && (
        <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard
            label="Commits"
            value={displayStats.totalCommits}
            icon={GitCommit}
          />
          <StatCard
            label="Pull Requests"
            value={displayStats.totalPRs}
            icon={GitPullRequest}
          />
          <StatCard
            label="Issues"
            value={displayStats.totalIssues}
            icon={CircleDot}
          />
          <StatCard
            label="Repositories"
            value={displayStats.totalRepos}
            icon={FolderGit2}
          />
        </div>
      )}

      {/* Projects List */}
      <div className="pr-4">
        <div className="space-y-6 pb-4">
          {/* Your Projects section */}
          {ownedProjects.length > 0 && (
            <section>
              <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold">
                Your Projects
                <Badge variant="secondary">{ownedProjects.length}</Badge>
              </h3>
              <div className="space-y-2">
                {ownedProjects.slice(0, 10).map((project) => (
                  <ExpandableProjectCard
                    key={project.id}
                    project={project}
                    isExpanded={expandedProjects.has(project.id)}
                    onToggle={() => toggleProject(project.id)}
                    maxCommits={maxProjectCommits}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Contributions section */}
          {contributedProjects.length > 0 && (
            <section>
              <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold">
                Open Source Contributions
                <Badge variant="secondary">{contributedProjects.length}</Badge>
              </h3>
              <div className="space-y-2">
                {contributedProjects.slice(0, 10).map((project) => (
                  <ExpandableProjectCard
                    key={project.id}
                    project={project}
                    isExpanded={expandedProjects.has(project.id)}
                    onToggle={() => toggleProject(project.id)}
                    maxCommits={maxProjectCommits}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Empty state for year with no projects */}
          {allProjects.length === 0 && (
            <div className="rounded-lg border p-8 text-center text-muted-foreground">
              No repositories found for this year
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
