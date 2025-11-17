import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import type { Repository } from '@/apollo/github-api.types';
import { Star, GitFork, Eye, AlertCircle, ExternalLink } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { formatNumber } from '@/lib/statistics';
import { LoadingState } from '@/components/layout/LoadingState';
import { ErrorState } from '@/components/layout/ErrorState';
import { RepositoryEmpty } from './RepositoryEmpty';

type Props = {
  /**
   * Array of repositories to display
   */
  repositories: Repository[];
  /**
   * Loading state
   */
  loading?: boolean;
  /**
   * Error state
   */
  error?: Error | null;
  /**
   * Whether any filters are currently active
   */
  hasActiveFilters?: boolean;
  /**
   * Callback when a repository row is clicked
   */
  onRepositoryClick?: (repository: Repository) => void;
  /**
   * Compact mode (smaller padding, fewer columns)
   * @default false
   */
  compact?: boolean;
  /**
   * Custom loading message
   */
  loadingMessage?: string;
  /**
   * Custom error title
   */
  errorTitle?: string;
  /**
   * Custom error description
   */
  errorDescription?: string;
  /**
   * Custom empty state title
   */
  emptyTitle?: string;
  /**
   * Custom empty state description
   */
  emptyDescription?: string;
};

/**
 * Repository table component
 *
 * Displays repositories in a table format with sortable columns.
 * Shows repository name, description, stats (stars, forks, watchers),
 * language, and last updated date.
 *
 * Supports loading, error, and empty states.
 *
 * @example
 * ```tsx
 * <RepositoryTable
 *   repositories={repos}
 *   loading={loading}
 *   error={error}
 *   onRepositoryClick={(repo) => window.open(repo.url, '_blank')}
 *   compact
 * />
 * ```
 */
export function RepositoryTable({
  repositories,
  loading = false,
  error = null,
  hasActiveFilters = false,
  onRepositoryClick,
  compact = false,
  loadingMessage = 'Loading repositories...',
  errorTitle,
  errorDescription,
  emptyTitle,
  emptyDescription,
}: Props) {
  // Loading state
  if (loading) {
    return <LoadingState message={loadingMessage} />;
  }

  // Error state
  if (error) {
    return (
      <ErrorState
        title={errorTitle || 'Failed to load repositories'}
        message={errorDescription || error.message}
      />
    );
  }

  // Empty state
  if (repositories.length === 0) {
    return (
      <RepositoryEmpty
        title={emptyTitle}
        description={emptyDescription}
        hasFilters={hasActiveFilters}
      />
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[30%]">Name</TableHead>
            {!compact && <TableHead className="w-[40%]">Description</TableHead>}
            <TableHead className="text-center">
              <span className="flex items-center justify-center gap-1">
                <Star className="h-3 w-3" />
                Stars
              </span>
            </TableHead>
            <TableHead className="text-center">
              <span className="flex items-center justify-center gap-1">
                <GitFork className="h-3 w-3" />
                Forks
              </span>
            </TableHead>
            {!compact && (
              <TableHead className="text-center">
                <span className="flex items-center justify-center gap-1">
                  <Eye className="h-3 w-3" />
                  Watchers
                </span>
              </TableHead>
            )}
            {!compact && <TableHead>Language</TableHead>}
            <TableHead className="text-right">Updated</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {repositories.map((repository) => {
            const updatedAt = repository.updatedAt
              ? formatDistanceToNow(new Date(repository.updatedAt), { addSuffix: true })
              : 'Never';

            const handleClick = () => {
              if (onRepositoryClick) {
                onRepositoryClick(repository);
              }
            };

            const handleKeyDown = (e: React.KeyboardEvent) => {
              if (onRepositoryClick && (e.key === 'Enter' || e.key === ' ')) {
                e.preventDefault();
                onRepositoryClick(repository);
              }
            };

            return (
              <TableRow
                key={repository.id}
                className={onRepositoryClick ? 'cursor-pointer' : undefined}
                onClick={handleClick}
                onKeyDown={handleKeyDown}
                tabIndex={onRepositoryClick ? 0 : undefined}
                role={onRepositoryClick ? 'button' : undefined}
                aria-label={onRepositoryClick ? `Open ${repository.name} repository` : undefined}
              >
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <a
                      href={repository.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-blue-600 hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {repository.name}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                    {repository.isFork && (
                      <Badge variant="secondary" className="text-xs">
                        Fork
                      </Badge>
                    )}
                    {repository.isArchived && (
                      <Badge variant="destructive" className="text-xs">
                        <AlertCircle className="mr-1 h-3 w-3" />
                        Archived
                      </Badge>
                    )}
                  </div>
                </TableCell>

                {!compact && (
                  <TableCell className="text-muted-foreground max-w-md truncate text-sm">
                    {repository.description || 'No description'}
                  </TableCell>
                )}

                <TableCell className="text-center" title={`${repository.stargazerCount} stars`}>
                  {formatNumber(repository.stargazerCount)}
                </TableCell>

                <TableCell className="text-center" title={`${repository.forkCount} forks`}>
                  {formatNumber(repository.forkCount)}
                </TableCell>

                {!compact && (
                  <TableCell
                    className="text-center"
                    title={`${repository.watchers.totalCount} watchers`}
                  >
                    {formatNumber(repository.watchers.totalCount)}
                  </TableCell>
                )}

                {!compact && (
                  <TableCell>
                    {repository.primaryLanguage ? (
                      <Badge variant="outline">{repository.primaryLanguage.name}</Badge>
                    ) : (
                      <span className="text-muted-foreground text-xs">-</span>
                    )}
                  </TableCell>
                )}

                <TableCell className="text-muted-foreground text-right text-sm">
                  {updatedAt}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
