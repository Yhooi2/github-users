import useQueryUser from "@/apollo/useQueryUser";
import { ContributionsChart } from "./ContributionsChart";
import { LanguageStats } from "./LanguageStats";
import { TopRepositories } from "./TopRepositories";
import { UserBasicInfo } from "./UserBasicInfo";
import { UserStats } from "./UserStats";

type UserProfileProps = {
  userName: string;
};

export function UserProfile({ userName }: UserProfileProps) {
  const { data, loading, error } = useQueryUser(userName.trim());

  if (loading) {
    return (
      <div className="flex min-h-64 items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-primary"></div>
          <p className="text-muted-foreground">Loading user profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    console.log(error);
    return (
      <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-6 text-center">
        <div className="mb-2 text-2xl text-destructive">⚠️</div>
        <p className="font-medium text-destructive">Error loading profile</p>
        <p className="mt-1 text-sm text-destructive">{error?.message}</p>
      </div>
    );
  }

  if (!data || !data.user) {
    return (
      <div className="rounded-lg border border-accent/20 bg-accent/10 p-6 text-center">
        <div className="mb-2 text-2xl text-accent-foreground">🔍</div>
        <p className="font-medium text-accent-foreground">User Not Found</p>
        <p className="mt-1 text-sm text-muted-foreground">
          The user "{userName}" could not be found on GitHub
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <UserBasicInfo user={data.user} />
      <UserStats user={data.user} />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ContributionsChart user={data.user} />
        <TopRepositories user={data.user} />
      </div>
      <LanguageStats user={data.user} />
    </div>
  );
}
