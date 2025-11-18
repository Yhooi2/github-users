import type { YearData } from '@/hooks/useUserAnalytics'
import { RepositoryCard } from '@/components/repository/RepositoryCard'
import { Badge } from '@/components/ui/badge'

export interface YearExpandedViewProps {
  year: YearData
}

/**
 * Year Expanded View Component
 *
 * Displays detailed breakdown of a year's activity including:
 * - Summary statistics
 * - Top owned repositories
 * - Top open source contributions
 *
 * @example
 * ```tsx
 * <YearExpandedView year={yearData} />
 * ```
 */
export function YearExpandedView({ year }: YearExpandedViewProps) {
  const topOwnedRepos = year.ownedRepos
    .sort((a, b) => b.repository.stargazerCount - a.repository.stargazerCount)
    .slice(0, 5)

  const topContributions = year.contributions
    .sort((a, b) => b.contributions.totalCount - a.contributions.totalCount)
    .slice(0, 5)

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
            {topOwnedRepos.map((repo) => (
              <RepositoryCard
                key={repo.repository.url}
                repository={repo.repository}
                compact
              />
            ))}
          </div>
        </div>
      )}

      {/* Top Contributions */}
      {topContributions.length > 0 && (
        <div>
          <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold">
            👥 Open Source Contributions
            <Badge variant="secondary">{year.contributions.length}</Badge>
          </h3>
          <div className="grid gap-3 md:grid-cols-2">
            {topContributions.map((repo) => (
              <RepositoryCard
                key={repo.repository.url}
                repository={repo.repository}
                compact
              />
            ))}
          </div>
        </div>
      )}

      {/* No activity fallback */}
      {topOwnedRepos.length === 0 && topContributions.length === 0 && (
        <div className="text-muted-foreground rounded-lg border p-8 text-center">
          No repositories found for this year
        </div>
      )}
    </div>
  )
}

/**
 * Stat Card Component
 */
function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border p-3">
      <div className="text-muted-foreground text-sm">{label}</div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  )
}
