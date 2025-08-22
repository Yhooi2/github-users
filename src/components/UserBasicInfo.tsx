import { type GitHubUser } from "@/apollo/github-api.types";
import { Button } from "@/components/ui/button";

type UserBasicInfoProps = {
  user: GitHubUser;
};

export function UserBasicInfo({ user }: UserBasicInfoProps) {
  return (
    <div className="flex items-center space-x-6 rounded-lg bg-background p-6 shadow-md dark:bg-muted">
      <img
        src={user.avatarUrl}
        alt={`${user.name || user.login} avatar`}
        className="h-24 w-24 rounded-full border-4 border-gray-200"
      />
      <div className="flex-1">
        <h1 className="mb-2 text-3xl font-bold text-foreground">
          {user.name || user.login}
        </h1>
        <p className="mb-2 text-xl text-muted-foreground">@{user.login}</p>
        {user.bio && <p className="mb-3 text-muted-foreground">{user.bio}</p>}
        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
          {user.location && (
            <span className="flex items-center">📍 {user.location}</span>
          )}
          <span className="flex items-center">
            📅 Joined {new Date(user.createdAt).toLocaleDateString()}
          </span>
        </div>
        <Button asChild variant="default" className="mt-3">
          <a
            href={user.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            View on GitHub
          </a>
        </Button>
      </div>
    </div>
  );
}
