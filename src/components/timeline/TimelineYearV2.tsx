/**
 * TimelineYearV2 - Year section with 3-level progressive disclosure
 *
 * Level 0: Collapsed year row (56px header)
 * Level 1: Expanded with project cards (Framer Motion animated)
 * Level 2: Full analytics modal
 */

import { ExpandableProjectCard } from "@/components/level-1/ExpandableProjectCard";
import { ExpandedCardContent } from "@/components/level-1/ExpandedCardContent";
import { ProjectAnalyticsModal } from "@/components/level-2/ProjectAnalyticsModal";
import { Badge } from "@/components/ui/badge";
import { useProgressiveDisclosure, useReducedMotion } from "@/hooks";
import type { YearData } from "@/hooks/useUserAnalytics";
import {
  toExpandableProjects,
  toProjectForModal,
} from "@/lib/adapters/project-adapter";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useMemo, useState } from "react";

export interface TimelineYearV2Props {
  /** Year data from Apollo */
  year: YearData;
  /** Max commits across all years (for bar normalization) */
  maxCommits: number;
  /** GitHub username (for ownership detection) */
  username: string;
}

/**
 * TimelineYearV2 Component
 *
 * Implements 3-level progressive disclosure:
 * - Level 0: Collapsed year bar with stats (DEFAULT STATE - COLLAPSED!)
 * - Level 1: Expanded list with project cards
 * - Level 2: Modal with 4 tabs for detailed analytics
 *
 * @example
 * ```tsx
 * <TimelineYearV2
 *   year={yearData}
 *   maxCommits={1000}
 *   username="torvalds"
 * />
 * ```
 */
export function TimelineYearV2({
  year,
  maxCommits,
  username,
}: TimelineYearV2Props) {
  // Level 0: Year expansion state (COLLAPSED BY DEFAULT!)
  const [isYearExpanded, setIsYearExpanded] = useState(false);

  // Level 1 & 2: Progressive disclosure state
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

  const prefersReducedMotion = useReducedMotion();

  // Combine owned repos + contributions and convert to ExpandableProject
  const allProjects = useMemo(() => {
    const combined = [...year.ownedRepos, ...year.contributions];
    return toExpandableProjects(combined, username);
  }, [year.ownedRepos, year.contributions, username]);

  // Find selected project for modal
  const selectedProject = useMemo(() => {
    if (!selectedProjectId) return null;

    const found = [...year.ownedRepos, ...year.contributions].find(
      (item) => item.repository.id === selectedProjectId,
    );
    return found ? toProjectForModal(found) : null;
  }, [year.ownedRepos, year.contributions, selectedProjectId]);

  // Calculate year bar width
  const widthPercent =
    maxCommits > 0 ? (year.totalCommits / maxCommits) * 100 : 0;

  // Max commits for project bars (within this year)
  const maxProjectCommits = useMemo(
    () => Math.max(...allProjects.map((p) => p.commits), 1),
    [allProjects],
  );

  // Animation variants for year content
  const contentVariants = {
    collapsed: { height: 0, opacity: 0 },
    expanded: { height: "auto", opacity: 1 },
  };

  const transition = {
    duration: prefersReducedMotion ? 0 : 0.3,
    ease: [0.4, 0, 0.2, 1] as const,
  };

  return (
    <div className="overflow-hidden rounded-lg border">
      {/* Level 0: Year header bar (clickable) */}
      <button
        onClick={() => setIsYearExpanded(!isYearExpanded)}
        className="w-full p-4 text-left transition-colors hover:bg-muted"
        aria-expanded={isYearExpanded}
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

          {/* Expand icon with rotation animation */}
          <motion.div
            animate={{ rotate: isYearExpanded ? 180 : 0 }}
            transition={{
              duration: prefersReducedMotion ? 0 : 0.2,
              ease: [0.4, 0, 0.2, 1],
            }}
          >
            <ChevronDown className="h-5 w-5" aria-hidden="true" />
          </motion.div>
        </div>
      </button>

      {/* Level 1: Expanded year content with project cards */}
      <AnimatePresence initial={false}>
        {isYearExpanded && (
          <motion.div
            initial="collapsed"
            animate="expanded"
            exit="collapsed"
            variants={contentVariants}
            transition={transition}
            className="overflow-hidden"
          >
            <div className="space-y-6 border-t p-4">
              {/* Summary stats */}
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                <StatCard label="Commits" value={year.totalCommits} />
                <StatCard label="Pull Requests" value={year.totalPRs} />
                <StatCard label="Issues" value={year.totalIssues} />
                <StatCard
                  label="Repositories"
                  value={year.ownedRepos.length + year.contributions.length}
                />
              </div>

              {/* Your Projects section */}
              {year.ownedRepos.length > 0 && (
                <section>
                  <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold">
                    Your Projects
                    <Badge variant="secondary">{year.ownedRepos.length}</Badge>
                  </h3>
                  <div className="space-y-2">
                    {allProjects
                      .filter((p) => p.isOwner)
                      .slice(0, 10)
                      .map((project) => (
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
              {year.contributions.length > 0 && (
                <section>
                  <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold">
                    Open Source Contributions
                    <Badge variant="secondary">
                      {year.contributions.length}
                    </Badge>
                  </h3>
                  <div className="space-y-2">
                    {allProjects
                      .filter((p) => !p.isOwner)
                      .slice(0, 10)
                      .map((project) => (
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

              {/* Empty state */}
              {allProjects.length === 0 && (
                <div className="rounded-lg border p-8 text-center text-muted-foreground">
                  No repositories found for this year
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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

/**
 * Stat card for year summary
 */
function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border p-3">
      <div className="text-sm text-muted-foreground">{label}</div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  );
}
