import { EmptyState } from '@/components/layout';

type Props = {
  /**
   * Custom title for empty state
   * @default "No Repositories Found"
   */
  title?: string;
  /**
   * Custom description for empty state
   * @default "No repositories match the current filters. Try adjusting your search criteria."
   */
  description?: string;
  /**
   * Whether this is showing because of filters (true) or no repos at all (false)
   * @default true
   */
  hasFilters?: boolean;
};

/**
 * Empty state component for repository lists
 *
 * Displays a friendly message when no repositories are found,
 * either due to filters or genuinely having no repositories.
 *
 * @example
 * ```tsx
 * // No repositories match filters
 * <RepositoryEmpty />
 *
 * // User has no repositories at all
 * <RepositoryEmpty
 *   hasFilters={false}
 *   title="No Repositories Yet"
 *   description="This user hasn't created any public repositories."
 * />
 * ```
 */
export function RepositoryEmpty({
  title = 'No Repositories Found',
  description = 'No repositories match the current filters. Try adjusting your search criteria.',
  hasFilters = true
}: Props) {
  const finalDescription = hasFilters
    ? description
    : 'This user hasn\'t created any public repositories yet.';

  return (
    <EmptyState
      title={title}
      description={finalDescription}
      icon="folder"
    />
  );
}
