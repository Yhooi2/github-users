import { RepositoryCard } from "@/components/repository/RepositoryCard";
import { Badge } from "@/components/ui/badge";
import type { YearData } from "@/hooks/useUserAnalytics";

export interface YearExpandedViewProps {
  year: YearData;
}

/**
 * @deprecated Use ExpandedCardContent from level-1 components instead.
 * This component will be removed in the next major version.
 */
export function YearExpandedView({ year }: YearExpandedViewProps) {
  const topOwnedRepos = year.ownedRepos
    .sort((a, b) => b.repository.stargazerCount - a.repository.stargazerCount)
    .slice(0, 5);

  // Создаём Set owned репозиториев по id (или по nameWithOwner)
  const ownedRepoIds = new Set(topOwnedRepos.map((r) => r.repository.id));

  const topContributions = year.contributions
    .filter((c) => !ownedRepoIds.has(c.repository.id)) // убираем свои репозитории
    .sort((a, b) => b.contributions.totalCount - a.contributions.totalCount)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard label="Commits" value={year.totalCommits} />
        <StatCard label="Pull Requests" value={year.totalPRs} />
        <StatCard label="Issues" value={year.totalIssues} />
        <StatCard
          label="Repositories"
          value={year.ownedRepos.length + year.contributions.length}
        />
      </div>

      {/* Top Owned Projects */}
      {topOwnedRepos.length > 0 && (
        <div>
          <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold">
            👤 Your Projects
            <Badge variant="secondary">{year.ownedRepos.length}</Badge>
          </h3>
          <div className="grid gap-3 md:grid-cols-2">
            {topOwnedRepos.map((item) => (
              <RepositoryCard
                key={item.repository.id} // ← используем id — глобально уникально
                repository={item.repository}
                compact
              />
            ))}
          </div>
        </div>
      )}

      {/* Top Contributions (только чужие) */}
      {topContributions.length > 0 && (
        <div>
          <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold">
            👥 Open Source Contributions
            <Badge variant="secondary">{year.contributions.length}</Badge>
          </h3>
          <div className="grid gap-3 md:grid-cols-2">
            {topContributions.map((item) => (
              <RepositoryCard
                key={item.repository.id} // ← то же самое
                repository={item.repository}
                compact
              />
            ))}
          </div>
        </div>
      )}

      {/* No activity fallback */}
      {topOwnedRepos.length === 0 && topContributions.length === 0 && (
        <div className="rounded-lg border p-8 text-center text-muted-foreground">
          No repositories found for this year
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border p-3">
      <div className="text-sm text-muted-foreground">{label}</div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  );
}
