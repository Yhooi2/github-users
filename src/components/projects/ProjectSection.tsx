import type { Repository } from "@/apollo/github-api.types";
import { RepositoryCard } from "@/components/repository/RepositoryCard";
import { Badge } from "@/components/ui/badge";

export interface ProjectSectionProps {
  /**
   * Categorized projects
   */
  projects: {
    owned: Repository[];
    contributions: Repository[];
  };

  /**
   * Loading state
   * @default false
   */
  loading?: boolean;
}

/**
 * Project Section Component
 *
 * Displays user's projects separated into:
 * - Owned Projects (👤): Repositories owned by the user
 * - Open Source Contributions (👥): Repositories contributed to but not owned
 *
 * Features responsive grid layout (1 column mobile, 2 columns desktop).
 *
 * @example
 * ```tsx
 * <ProjectSection
 *   projects={{
 *     owned: [repo1, repo2],
 *     contributions: [repo3, repo4]
 *   }}
 * />
 *
 * // With loading state
 * <ProjectSection projects={{ owned: [], contributions: [] }} loading />
 * ```
 */
export function ProjectSection({
  projects,
  loading = false,
}: ProjectSectionProps) {
  if (loading) {
    return <ProjectSectionSkeleton />;
  }

  const hasOwnedProjects = projects.owned.length > 0;
  const hasContributions = projects.contributions.length > 0;
  const hasNoProjects = !hasOwnedProjects && !hasContributions;

  return (
    <section className="space-y-6" aria-label="Projects and contributions">
      <h2 className="text-2xl font-bold">🔥 Top Projects & Contributions</h2>

      {/* Owned Projects */}
      {hasOwnedProjects && (
        <div>
          <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
            👤 Your Original Projects
            <Badge variant="default">{projects.owned.length}</Badge>
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            {projects.owned.map((repo) => (
              <RepositoryCard key={repo.id} repository={repo} />
            ))}
          </div>
        </div>
      )}

      {/* Contributions */}
      {hasContributions && (
        <div>
          <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
            👥 Open Source Contributions
            <Badge variant="secondary">{projects.contributions.length}</Badge>
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            {projects.contributions.map((repo) => (
              <RepositoryCard key={repo.id} repository={repo} />
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {hasNoProjects && (
        <div className="rounded-lg border p-8 text-center text-muted-foreground">
          No repositories found
        </div>
      )}
    </section>
  );
}

/**
 * Loading skeleton for ProjectSection
 */
function ProjectSectionSkeleton() {
  return (
    <section className="space-y-6" aria-label="Loading projects">
      <div className="h-8 w-64 animate-pulse rounded bg-muted" />
      <div className="grid gap-4 md:grid-cols-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 animate-pulse rounded-lg bg-muted" />
        ))}
      </div>
    </section>
  );
}
