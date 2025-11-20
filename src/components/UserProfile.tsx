import { getYearLabels } from "@/apollo/date-helpers";
import type { RateLimit } from "@/apollo/github-api.types";
import useQueryUser from "@/apollo/useQueryUser";
import { EmptyState, ErrorState, LoadingState } from "@/components/layout";
import { ContributionHistory } from "@/components/user/ContributionHistory";
import { RecentActivity } from "@/components/user/RecentActivity";
import { UserAuthenticity } from "@/components/user/UserAuthenticity";
import { UserHeader } from "@/components/user/UserHeader";
import { UserStats } from "@/components/user/UserStats";

type Props = {
  userName: string;
  onRateLimitUpdate?: (rateLimit: RateLimit) => void;
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
 * - Authenticity score with detailed breakdown (NEW FEATURE)
 * - 3-year contribution history
 * - Recent activity by repository
 *
 * @param props - Component props
 * @param props.userName - GitHub username to fetch and display
 * @param props.onRateLimitUpdate - Optional callback for rate limit updates from GraphQL API
 * @returns User profile component with loading/error/data states
 *
 * @example
 * ```typescript
 * function App() {
 *   const [userName, setUserName] = useState('octocat')
 *   const handleRateLimit = (rateLimit) => console.log('Rate limit:', rateLimit)
 *
 *   return <UserProfile userName={userName} onRateLimitUpdate={handleRateLimit} />
 * }
 * ```
 */
function UserProfile({ userName, onRateLimitUpdate }: Props) {
  const { data, loading, error, refetch } = useQueryUser(userName, 365, {
    onRateLimitUpdate,
  });
  const yearLabels = getYearLabels();

  if (loading) {
    return <LoadingState variant="profile" message="Loading user profile..." />;
  }

  if (error) {
    return <ErrorState message={error.message} onRetry={refetch} />;
  }

  if (!data || !data.user) {
    return (
      <EmptyState
        title="User Not Found"
        description="The requested GitHub user could not be found."
        icon="user"
      />
    );
  }

  const user = data.user;

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

      <UserAuthenticity repositories={user.repositories.nodes} />

      <ContributionHistory
        contributions={{
          year1: user.year1,
          year2: user.year2,
          year3: user.year3,
        }}
        yearLabels={yearLabels}
      />

      <RecentActivity
        repositories={
          user.contributionsCollection.commitContributionsByRepository
        }
      />
    </div>
  );
}

export default UserProfile;
