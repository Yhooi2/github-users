/**
 * YearDetailPanel - Right panel showing year details
 *
 * Used in the 67% right panel of the desktop split layout.
 * Shows summary stats, and project list with Level 0/1 components.
 */

import { ExpandableProjectCard } from "@/components/level-1/ExpandableProjectCard";
import { ExpandedCardContent } from "@/components/level-1/ExpandedCardContent";
import { ProjectAnalyticsModal } from "@/components/level-2/ProjectAnalyticsModal";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useProgressiveDisclosure } from "@/hooks";
import type { YearData } from "@/hooks/useUserAnalytics";
import {
  toExpandableProjects,
  toProjectForModal,
} from "@/lib/adapters/project-adapter";
import { cn } from "@/lib/utils";
import { GitCommit, GitPullRequest, CircleDot, FolderGit2 } from "lucide-react";
import { useMemo } from "react";

export interface YearDetailPanelProps {
  /** Selected year data */
  year: YearData | null;
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
    <Card className={cn(
      "transition-all duration-200 hover:shadow-md hover:border-primary/30",
      className
    )}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
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
 * Includes summary statistics and project lists with Level 0/1/2 disclosure.
 *
 * @example
 * ```tsx
 * <YearDetailPanel
 *   year={selectedYearData}
 *   username="torvalds"
 * />
 * ```
 */
export function YearDetailPanel({ year, username }: YearDetailPanelProps) {
  // Progressive disclosure state for Level 1 & 2
  const {
    expandedProjects,
    modalOpen,
    selectedProjectId,
    activeTab,
    toggleProject,
    openModal,
    closeModal,
    setActiveTab,
  } = useProgressiveDisclosure({ persistToUrl: true });

  // Convert year data to expandable projects
  const allProjects = useMemo(() => {
    if (!year) return [];
    const combined = [...year.ownedRepos, ...year.contributions];
    return toExpandableProjects(combined, username);
  }, [year, username]);

  // Find selected project for modal
  const selectedProject = useMemo(() => {
    if (!selectedProjectId || !year) return null;

    const found = [...year.ownedRepos, ...year.contributions].find(
      (item) => item.repository.id === selectedProjectId
    );
    return found ? toProjectForModal(found) : null;
  }, [year, selectedProjectId]);

  // Max commits for project bars (within this year)
  const maxProjectCommits = useMemo(
    () => Math.max(...allProjects.map((p) => p.commits), 1),
    [allProjects]
  );

  // Empty state when no year is selected
  if (!year) {
    return (
      <div className="flex h-full items-center justify-center rounded-lg border border-dashed p-8">
        <div className="text-center text-muted-foreground">
          <p className="text-lg font-medium">Select a year</p>
          <p className="text-sm">Click on a year card to view details</p>
        </div>
      </div>
    );
  }

  const ownedProjects = allProjects.filter((p) => p.isOwner);
  const contributedProjects = allProjects.filter((p) => !p.isOwner);

  return (
    <div className="flex h-full flex-col">
      {/* Year Header */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold">{year.year} Activity</h2>
        <Badge variant="outline" className="text-sm">
          {year.ownedRepos.length + year.contributions.length} repositories
        </Badge>
      </div>

      {/* Summary Stats Grid */}
      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Commits" value={year.totalCommits} icon={GitCommit} />
        <StatCard label="Pull Requests" value={year.totalPRs} icon={GitPullRequest} />
        <StatCard label="Issues" value={year.totalIssues} icon={CircleDot} />
        <StatCard
          label="Repositories"
          value={year.ownedRepos.length + year.contributions.length}
          icon={FolderGit2}
        />
      </div>

      {/* Projects List with ScrollArea */}
      <ScrollArea className="flex-1 pr-4">
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
                    onOpenAnalytics={() => openModal(project.id)}
                    maxCommits={maxProjectCommits}
                  >
                    <ExpandedCardContent
                      stars={project.stars}
                      forks={project.forks ?? 0}
                    />
                  </ExpandableProjectCard>
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
                    onOpenAnalytics={() => openModal(project.id)}
                    maxCommits={maxProjectCommits}
                  >
                    <ExpandedCardContent
                      stars={project.stars}
                      forks={project.forks ?? 0}
                    />
                  </ExpandableProjectCard>
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
      </ScrollArea>

      {/* Level 2: Analytics Modal */}
      <ProjectAnalyticsModal
        open={modalOpen}
        onOpenChange={(open) => !open && closeModal()}
        project={selectedProject}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
    </div>
  );
}
