import type { Repository } from "@/apollo/github-api.types";
import { RepositoryCard } from "@/components/repository/RepositoryCard";
import { Badge } from "@/components/ui/badge";

export interface ProjectSectionProps {
  projects: {
    owned: Repository[];
    contributions: Repository[];
  };
  loading?: boolean;
}

export function ProjectSection({
  projects: rawProjects,
  loading = false,
}: ProjectSectionProps) {
  if (loading) {
    return <ProjectSectionSkeleton />;
  }

  // Дедупликация и фильтрация по id (самый надёжный способ)
  const seenIds = new Set<string>();
  const owned: Repository[] = [];
  const contributions: Repository[] = [];

  // Сначала добавляем owned
  for (const repo of rawProjects.owned) {
    if (!seenIds.has(repo.id)) {
      seenIds.add(repo.id);
      owned.push(repo);
    }
  }

  // Потом contributions — только если не owned
  for (const repo of rawProjects.contributions) {
    if (!seenIds.has(repo.id)) {
      seenIds.add(repo.id);
      contributions.push(repo);
    }
  }

  const hasOwned = owned.length > 0;
  const hasContributions = contributions.length > 0;

  return (
    <section className="space-y-6" aria-label="Projects and contributions">
      <h2 className="text-2xl font-bold">🔥 Top Projects & Contributions</h2>

      {/* Your Original Projects */}
      {hasOwned && (
        <div>
          <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
            👤 Your Original Projects
            <Badge variant="default">{owned.length}</Badge>
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            {owned.map((repo) => (
              <RepositoryCard key={repo.id} repository={repo} />
            ))}
          </div>
        </div>
      )}

      {/* Open Source Contributions */}
      {hasContributions && (
        <div>
          <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
            👥 Open Source Contributions
            <Badge variant="secondary">{contributions.length}</Badge>
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            {contributions.map((repo) => (
              <RepositoryCard key={repo.id} repository={repo} />
            ))}
          </div>
        </div>
      )}

      {!hasOwned && !hasContributions && (
        <div className="rounded-lg border p-8 text-center text-muted-foreground">
          No repositories found
        </div>
      )}
    </section>
  );
}

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
