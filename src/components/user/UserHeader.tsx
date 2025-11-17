import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { MapPin, Calendar, ExternalLink } from 'lucide-react';

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
};

export function UserHeader({ user }: UserHeaderProps) {
  const displayName = user.name || user.login;
  const initials = displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const joinedDate = new Date(user.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="flex flex-col items-start gap-6 md:flex-row">
      {/* Avatar */}
      <Avatar className="border-border h-32 w-32 border-4">
        <AvatarImage src={user.avatarUrl} alt={`${displayName}'s avatar`} />
        <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
      </Avatar>

      {/* User Info */}
      <div className="flex-1 space-y-2">
        <h1 className="text-3xl font-bold">{displayName}</h1>
        <p className="text-muted-foreground text-xl">@{user.login}</p>

        {user.bio && <p className="text-base">{user.bio}</p>}

        <div className="text-muted-foreground flex flex-col gap-2 text-sm">
          {user.location && (
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" aria-hidden="true" />
              <span>{user.location}</span>
            </div>
          )}

          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" aria-hidden="true" />
            <span>Joined {joinedDate}</span>
          </div>
        </div>

        <a
          href={user.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary inline-flex items-center gap-2 text-sm hover:underline"
        >
          View on GitHub
          <ExternalLink className="h-4 w-4" aria-hidden="true" />
        </a>
      </div>
    </div>
  );
}
