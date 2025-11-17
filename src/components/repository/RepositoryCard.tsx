import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Repository } from '@/apollo/github-api.types';
import { Star, GitFork, Eye, AlertCircle, GitCommit } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { formatNumber } from '@/lib/statistics';
import { getLanguageColor } from '@/lib/constants';

type Props = {
  /**
   * Repository data from GitHub API
   */
  repository: Repository;
  /**
   * Whether to show the full card or compact version
   * @default false
   */
  compact?: boolean;
  /**
   * Click handler when card is clicked
   */
  onClick?: (repository: Repository) => void;
};

/**
 * Repository card component
 *
 * Displays repository information in a card format including:
 * - Name and description
 * - Statistics (stars, forks, watchers)
 * - Primary language
 * - Fork status
 * - Last update time
 *
 * @example
 * ```tsx
 * <RepositoryCard repository={repo} />
 *
 * // Compact version
 * <RepositoryCard repository={repo} compact />
 *
 * // With click handler
 * <RepositoryCard
 *   repository={repo}
 *   onClick={(repo) => window.open(repo.url, '_blank')}
 * />
 * ```
 */
export function RepositoryCard({ repository, compact = false, onClick }: Props) {
  const handleClick = () => {
    if (onClick) {
      onClick(repository);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (onClick && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onClick(repository);
    }
  };

  const updatedAt = repository.updatedAt
    ? formatDistanceToNow(new Date(repository.updatedAt), { addSuffix: true })
    : 'Never';

  return (
    <Card
      className={onClick ? 'cursor-pointer transition-shadow hover:shadow-md' : undefined}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={onClick ? 0 : undefined}
      role={onClick ? 'button' : undefined}
      aria-label={onClick ? `Open ${repository.name} repository` : undefined}
    >
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <CardTitle className="truncate">
              <a
                href={repository.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
                onClick={(e) => e.stopPropagation()}
              >
                {repository.name}
              </a>
            </CardTitle>
            {repository.description && !compact && (
              <CardDescription className="mt-2 line-clamp-2">
                {repository.description}
              </CardDescription>
            )}
          </div>
          {repository.isFork && (
            <Badge variant="outline" aria-label="This repository is a fork">
              <GitFork className="h-3 w-3" />
              Fork
            </Badge>
          )}
          {repository.isArchived && (
            <Badge variant="destructive" aria-label="This repository is archived">
              <AlertCircle className="h-3 w-3" />
              Archived
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent>
        <div className="text-muted-foreground flex flex-wrap items-center gap-4 text-sm">
          {repository.primaryLanguage && (
            <div className="flex items-center gap-1">
              <span
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: getLanguageColor(repository.primaryLanguage.name) }}
                aria-hidden="true"
              />
              <span>{repository.primaryLanguage.name}</span>
            </div>
          )}

          <div className="flex items-center gap-1" title={`${repository.stargazerCount} stars`}>
            <Star className="h-4 w-4" aria-hidden="true" />
            <span>{formatNumber(repository.stargazerCount)}</span>
          </div>

          <div className="flex items-center gap-1" title={`${repository.forkCount} forks`}>
            <GitFork className="h-4 w-4" aria-hidden="true" />
            <span>{formatNumber(repository.forkCount)}</span>
          </div>

          {!compact && (
            <div className="flex items-center gap-1" title={`${repository.watchers.totalCount} watchers`}>
              <Eye className="h-4 w-4" aria-hidden="true" />
              <span>{formatNumber(repository.watchers.totalCount)}</span>
            </div>
          )}

          {!compact && repository.defaultBranchRef?.target?.history && (
            <div className="flex items-center gap-1" title={`${repository.defaultBranchRef.target.history.totalCount} commits`}>
              <GitCommit className="h-4 w-4" aria-hidden="true" />
              <span>{formatNumber(repository.defaultBranchRef.target.history.totalCount)}</span>
            </div>
          )}

          <div className="ml-auto text-xs">
            Updated {updatedAt}
          </div>
        </div>

        {!compact && repository.repositoryTopics.nodes.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2" role="list" aria-label="Repository topics">
            {repository.repositoryTopics.nodes.slice(0, 5).map((topic) => (
              <Badge key={topic.topic.name} variant="secondary" role="listitem">
                {topic.topic.name}
              </Badge>
            ))}
            {repository.repositoryTopics.nodes.length > 5 && (
              <Badge variant="secondary">
                +{repository.repositoryTopics.nodes.length - 5}
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

