import type { RateLimit } from "@/apollo/github-api.types";
import useQueryUser from "@/apollo/useQueryUser";
import { EmptyState, ErrorState, LoadingState } from "@/components/layout";
import { UserHeader } from "@/components/user/UserHeader";
import { UserStats } from "@/components/user/UserStats";

type Props = {
  userName: string;
  onRateLimitUpdate?: (rateLimit: RateLimit) => void;
};

/**
 * User profile component - displays basic user info (header + stats)
 *
 * Other sections are handled by App.tsx:
 * - QuickAssessment (5 metrics including Authenticity)
 * - ActivityTimelineV2 (year-by-year timeline with 33/67 split)
 * - ProjectSection (owned/contributions)
 */
function UserProfile({ userName, onRateLimitUpdate }: Props) {
  const { data, loading, error, refetch } = useQueryUser(userName, 365, {
    onRateLimitUpdate,
  });

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
    </div>
  );
}

export default UserProfile;
