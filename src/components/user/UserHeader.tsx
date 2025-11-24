import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatNumber } from "@/lib/statistics";
import {
  Calendar,
  ExternalLink,
  FileText,
  GitFork,
  MapPin,
  UserPlus,
  Users,
} from "lucide-react";

type UserStats = {
  repositories: number;
  followers: number;
  following: number;
  gists: number;
};

type UserHeaderProps = {
  user: {
    avatarUrl: string;
    name: string | null;
    login: string;
    bio: string | null;
    location: string | null;
    url: string;
    createdAt: string;
  };
  /** Optional stats to display inline */
  stats?: UserStats;
};

export function UserHeader({ user, stats }: UserHeaderProps) {
  const displayName = user.name || user.login;
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const joinedDate = new Date(user.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="flex flex-col items-start gap-6 md:flex-row">
      {/* Avatar */}
      <Avatar className="h-32 w-32 border-4 border-border">
        <AvatarImage src={user.avatarUrl} alt={`${displayName}'s avatar`} />
        <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
      </Avatar>

      {/* User Info */}
      <div className="flex-1 space-y-3">
        <div>
          <h1 className="text-3xl font-bold">{displayName}</h1>
          <p className="text-xl text-muted-foreground">@{user.login}</p>
        </div>

        {user.bio && <p className="text-base">{user.bio}</p>}

        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
          {user.location && (
            <div className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4" aria-hidden="true" />
              <span>{user.location}</span>
            </div>
          )}

          <div className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" aria-hidden="true" />
            <span>Joined {joinedDate}</span>
          </div>
        </div>

        {/* Inline Stats */}
        {stats && (
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-1.5">
              <GitFork className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              <span className="font-semibold">{formatNumber(stats.repositories)}</span>
              <span className="text-muted-foreground">repos</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              <span className="font-semibold">{formatNumber(stats.followers)}</span>
              <span className="text-muted-foreground">followers</span>
            </div>
            <div className="flex items-center gap-1.5">
              <UserPlus className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              <span className="font-semibold">{formatNumber(stats.following)}</span>
              <span className="text-muted-foreground">following</span>
            </div>
            <div className="flex items-center gap-1.5">
              <FileText className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              <span className="font-semibold">{formatNumber(stats.gists)}</span>
              <span className="text-muted-foreground">gists</span>
            </div>
          </div>
        )}

        <a
          href={user.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
        >
          View on GitHub
          <ExternalLink className="h-4 w-4" aria-hidden="true" />
        </a>
      </div>
    </div>
  );
}
