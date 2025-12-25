import type { RateLimit } from "@/apollo/github-api.types";
import useQueryUser from "@/apollo/useQueryUser";
import { EmptyState, ErrorState, LoadingState } from "@/components/layout";
import type { LanguageItem } from "@/components/user/LanguagesInline";
import { UserHeader } from "@/components/user/UserHeader";

type Props = {
  userName: string;
  onRateLimitUpdate?: (rateLimit: RateLimit) => void;
  /** Programming languages for skills display */
  languages?: LanguageItem[];
  /** Callback for AI generation button */
  onAIGenerate?: () => void;
};

/**
 * User profile component - displays basic user info (header + stats)
 *
 * Other sections are handled by App.tsx:
 * - QuickAssessment (5 metrics including Authenticity)
 * - ActivityTimelineV2 (year-by-year timeline with 33/67 split)
 * - ProjectSection (owned/contributions)
 */
function UserProfile({
  userName,
  onRateLimitUpdate,
  languages,
  onAIGenerate,
}: Props) {
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
      stats={{
        repositories: user.repositories.totalCount,
        followers: user.followers.totalCount,
        following: user.following.totalCount,
        gists: user.gists.totalCount,
      }}
      languages={languages}
      onAIGenerate={onAIGenerate}
    />
  );
}

export default UserProfile;
