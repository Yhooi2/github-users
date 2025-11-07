import { RepositoryCard } from './RepositoryCard';
import { RepositoryEmpty } from './RepositoryEmpty';
import { LoadingState, ErrorState } from '@/components/layout';
import type { Repository } from '@/apollo/github-api.types';

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
   * Whether filters are currently active (affects empty state message)
   */
  hasActiveFilters?: boolean;
  /**
   * Callback when a repository card is clicked
   */
  onRepositoryClick?: (repository: Repository) => void;
  /**
   * Show repositories in compact mode
   * @default false
   */
  compact?: boolean;
  /**
   * Custom empty state title
   */
  emptyTitle?: string;
  /**
   * Custom empty state description
   */
  emptyDescription?: string;
  /**
   * Custom error title
   */
  errorTitle?: string;
  /**
   * Custom error description
   */
  errorDescription?: string;
  /**
   * Loading message
   */
  loadingMessage?: string;
};

/**
 * Repository list component
 *
 * Displays a list of repository cards with loading, error, and empty states.
 * Handles various states automatically:
 * - Loading state with spinner
 * - Error state with retry option
 * - Empty state when no repositories (with/without filters)
 * - Grid layout of repository cards
 *
 * @example
 * ```tsx
 * const { data, loading, error } = useQueryUser(username);
 * const { filteredRepositories, hasActiveFilters } = useRepositoryFilters(data?.user.repositories.nodes || []);
 * const { sortedRepositories } = useRepositorySorting(filteredRepositories);
 *
 * <RepositoryList
 *   repositories={sortedRepositories}
 *   loading={loading}
 *   error={error}
 *   hasActiveFilters={hasActiveFilters}
 *   onRepositoryClick={(repo) => window.open(repo.url, '_blank')}
 * />
 * ```
 */
export function RepositoryList({
  repositories,
  loading = false,
  error = null,
  hasActiveFilters = false,
  onRepositoryClick,
  compact = false,
  emptyTitle,
  emptyDescription,
  errorTitle,
  errorDescription,
  loadingMessage,
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

  // List of repositories
  return (
    <div
      className="grid gap-4 grid-cols-1"
      role="list"
      aria-label="Repository list"
    >
      {repositories.map((repository) => (
        <div key={repository.id} role="listitem">
          <RepositoryCard
            repository={repository}
            onClick={onRepositoryClick}
            compact={compact}
          />
        </div>
      ))}
    </div>
  );
}
