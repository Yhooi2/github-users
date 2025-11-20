import type { Repository } from "@/apollo/github-api.types";
import { sortRepositories } from "@/lib/repository-filters";
import type { RepositorySorting, SortBy, SortDirection } from "@/types/filters";
import { useCallback, useMemo, useState } from "react";

/**
 * React hook for managing repository sorting state and applying sort
 *
 * Provides state management for repository sorting with memoized sorting
 * to prevent unnecessary recalculations.
 *
 * @param repositories - Array of repositories to sort
 * @param initialSort - Initial sort configuration (default: 'stars' desc)
 * @returns Object containing sorted repositories and sort management functions
 *
 * @example
 * ```typescript
 * function RepositoryList({ repositories }) {
 *   const {
 *     sortedRepositories,
 *     sorting,
 *     setSortBy,
 *     setSortDirection,
 *     toggleDirection,
 *     resetSort
 *   } = useRepositorySorting(repositories);
 *
 *   return (
 *     <div>
 *       <button onClick={() => setSortBy('stars')}>
 *         Sort by Stars {sorting.field === 'stars' && (sorting.direction === 'asc' ? '↑' : '↓')}
 *       </button>
 *       <button onClick={() => setSortBy('forks')}>
 *         Sort by Forks
 *       </button>
 *       <button onClick={toggleDirection}>
 *         Toggle Direction
 *       </button>
 *       <ul>
 *         {sortedRepositories.map(repo => <li key={repo.id}>{repo.name}</li>)}
 *       </ul>
 *     </div>
 *   );
 * }
 * ```
 */
export function useRepositorySorting(
  repositories: Repository[],
  initialSort: RepositorySorting = { field: "stars", direction: "desc" },
) {
  const [sorting, setSorting] = useState<RepositorySorting>(initialSort);

  /**
   * Updates the sort field
   * @param field - New sort field
   */
  const setSortBy = useCallback((field: SortBy) => {
    setSorting((prev) => ({ ...prev, field }));
  }, []);

  /**
   * Updates the sort direction
   * @param direction - New sort direction
   */
  const setSortDirection = useCallback((direction: SortDirection) => {
    setSorting((prev) => ({ ...prev, direction }));
  }, []);

  /**
   * Toggles between ascending and descending order
   */
  const toggleDirection = useCallback(() => {
    setSorting((prev) => ({
      ...prev,
      direction: prev.direction === "asc" ? "desc" : "asc",
    }));
  }, []);

  /**
   * Sets both field and direction at once
   * @param field - Sort field
   * @param direction - Sort direction (optional, keeps current if not provided)
   */
  const setSort = useCallback((field: SortBy, direction?: SortDirection) => {
    setSorting((prev) => ({
      field,
      direction: direction || prev.direction,
    }));
  }, []);

  /**
   * Resets sort to initial configuration
   */
  const resetSort = useCallback(() => {
    setSorting(initialSort);
  }, [initialSort]);

  /**
   * Checks if currently using the initial sort
   */
  const isDefaultSort = useMemo(() => {
    return (
      sorting.field === initialSort.field &&
      sorting.direction === initialSort.direction
    );
  }, [sorting, initialSort]);

  /**
   * Applies sorting to repositories (memoized)
   */
  const sortedRepositories = useMemo(() => {
    return sortRepositories(repositories, sorting.field, sorting.direction);
  }, [repositories, sorting.field, sorting.direction]);

  return {
    /** Sorted array of repositories */
    sortedRepositories,
    /** Current sort configuration */
    sorting,
    /** Update sort field only */
    setSortBy,
    /** Update sort direction only */
    setSortDirection,
    /** Toggle between asc/desc */
    toggleDirection,
    /** Set both field and direction */
    setSort,
    /** Reset to initial sort */
    resetSort,
    /** Whether using default sort */
    isDefaultSort,
  };
}
