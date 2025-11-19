import useQueryUser from '@/apollo/useQueryUser';
import { getYearLabels } from '@/apollo/date-helpers';
import { LoadingState, ErrorState, EmptyState } from '@/components/layout';
import { UserHeader } from '@/components/user/UserHeader';
import { UserStats } from '@/components/user/UserStats';
import { ContributionHistory } from '@/components/user/ContributionHistory';
import { RecentActivity } from '@/components/user/RecentActivity';
import { UserAuthenticity } from '@/components/user/UserAuthenticity';
import { StatsOverview } from '@/components/statistics/StatsOverview';
import { RepositoryList } from '@/components/repository/RepositoryList';
import { QuickAssessment } from '@/components/assessment/QuickAssessment';
import {
  calculateYearlyCommitStats,
  calculateLanguageStatistics,
  calculateCommitActivity
} from '@/lib/statistics';
import {
  calculateActivityScore,
  calculateImpactScore,
  calculateQualityScore,
  calculateGrowthScore
} from '@/lib/metrics';
import { useRepositorySorting } from '@/hooks/useRepositorySorting';
import { useRepositoryFilters } from '@/hooks/useRepositoryFilters';
import { useUserAnalytics } from '@/hooks/useUserAnalytics';
import { RepositorySorting } from '@/components/repository/RepositorySorting';
import { RepositoryFilters } from '@/components/repository/RepositoryFilters';

type Props = {
  userName: string;
};

/**
 * User profile component that displays comprehensive GitHub user information
 *
 * Fetches and displays user data from GitHub GraphQL API using Apollo Client.
 * Handles loading, error, and not-found states automatically.
 *
 * Displays:
 * - User header with avatar, name, bio, location
 * - Stats grid (repositories, followers, following, gists)
 * - Authenticity score with detailed breakdown
 * - Quick Assessment with 4 metrics (Activity, Impact, Quality, Growth) - NEW PHASE 2
 * - Statistics overview with charts (Activity, Commits, Languages)
 * - Repository list with filtering and sorting
 * - 3-year contribution history
 * - Recent activity by repository
 *
 * @param props - Component props
 * @param props.userName - GitHub username to fetch and display
 * @returns User profile component with loading/error/data states
 *
 * @example
 * ```typescript
 * function App() {
 *   const [userName, setUserName] = useState('octocat')
 *
 *   return <UserProfile userName={userName} />
 * }
 * ```
 */
function UserProfile({ userName }: Props) {
  const { data, loading, error, refetch } = useQueryUser(userName);
  const { timeline, loading: analyticsLoading } = useUserAnalytics(userName);
  const yearLabels = getYearLabels();

  if (loading) {
    return <LoadingState variant="profile" message="Loading user profile..." />;
  }

  if (error) {
    return <ErrorState message={error.message} onRetry={refetch} />;
  }

  if (!data || !data.user) {
    return <EmptyState title="User Not Found" description="The requested GitHub user could not be found." icon="user" />;
  }

  const user = data.user;
  const repositories = user.repositories.nodes;

  // Calculate statistics for charts
  const yearlyCommits = calculateYearlyCommitStats({
    year1: user.year1,
    year2: user.year2,
    year3: user.year3,
  });

  const languageStats = calculateLanguageStatistics(repositories);

  const commitActivity = calculateCommitActivity(
    user.contributionsCollection.totalCommitContributions,
    365 // Default to last year
  );

  // Calculate metrics for assessment
  const activityMetric = calculateActivityScore(timeline);
  const impactMetric = calculateImpactScore(timeline);
  const qualityMetric = calculateQualityScore(timeline);
  const growthMetric = calculateGrowthScore(timeline);

  const metrics = {
    activity: { score: activityMetric.score, level: activityMetric.level },
    impact: { score: impactMetric.score, level: impactMetric.level },
    quality: { score: qualityMetric.score, level: qualityMetric.level },
    growth: { score: growthMetric.score, level: growthMetric.level },
  };

  // Repository filtering and sorting
  const {
    filteredRepositories,
    filters,
    setFilters,
    resetFilters,
    hasActiveFilters,
    availableLanguages
  } = useRepositoryFilters(repositories);

  const {
    sortedRepositories,
    sorting,
    setSortBy,
    setSortDirection,
    toggleDirection
  } = useRepositorySorting(filteredRepositories);

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6 p-6">
      <UserHeader
        user={{
          avatarUrl: user.avatarUrl,
          name: user.name,
          login: user.login,
          bio: user.bio,
          location: user.location,
          url: user.url,
          createdAt: user.createdAt,
        }}
      />

      <UserStats
        stats={{
          repositories: user.repositories.totalCount,
          followers: user.followers.totalCount,
          following: user.following.totalCount,
          gists: user.gists.totalCount,
        }}
      />

      <UserAuthenticity repositories={repositories} />

      <QuickAssessment metrics={metrics} loading={analyticsLoading} />

      <StatsOverview
        yearlyCommits={yearlyCommits}
        languages={languageStats}
        activity={commitActivity}
        loading={loading}
        error={error}
        defaultTab="overview"
      />

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Repositories</h2>

        <RepositoryFilters
          filters={filters}
          onFiltersChange={setFilters}
          onReset={resetFilters}
          availableLanguages={availableLanguages}
        />

        <RepositorySorting
          sortBy={sorting.field}
          sortDirection={sorting.direction}
          onSortByChange={setSortBy}
          onSortDirectionChange={setSortDirection}
          onToggleDirection={toggleDirection}
        />

        <RepositoryList
          repositories={sortedRepositories}
          loading={loading}
          error={error}
          hasActiveFilters={hasActiveFilters}
        />
      </div>

      <ContributionHistory
        contributions={{
          year1: user.year1,
          year2: user.year2,
          year3: user.year3,
        }}
        yearLabels={yearLabels}
      />

      <RecentActivity repositories={user.contributionsCollection.commitContributionsByRepository} />
    </div>
  );
}

export default UserProfile;
