import { useState, useMemo, useCallback } from 'react';
import type { Repository } from '@/apollo/github-api.types';
import type { RepositoryFilter } from '@/types/filters';
import { filterRepositories } from '@/lib/repository-filters';

/**
 * React hook for managing repository filter state and applying filters
 *
 * Provides state management for repository filters with memoized filtering
 * to prevent unnecessary recalculations.
 *
 * @param repositories - Array of repositories to filter
 * @returns Object containing filtered repositories and filter management functions
 *
 * @example
 * ```typescript
 * function RepositoryList({ repositories }) {
 *   const {
 *     filteredRepositories,
 *     filters,
 *     updateFilter,
 *     clearFilters,
 *     hasActiveFilters
 *   } = useRepositoryFilters(repositories);
 *
 *   return (
 *     <div>
 *       <button onClick={() => updateFilter('originalOnly', true)}>
 *         Show Original Only
 *       </button>
 *       {hasActiveFilters && (
 *         <button onClick={clearFilters}>Clear Filters</button>
 *       )}
 *       <ul>
 *         {filteredRepositories.map(repo => <li key={repo.id}>{repo.name}</li>)}
 *       </ul>
 *     </div>
 *   );
 * }
 * ```
 */
export function useRepositoryFilters(repositories: Repository[]) {
  const [filters, setFilters] = useState<RepositoryFilter>({});

  /**
   * Updates a single filter property
   * @param key - Filter key to update
   * @param value - New value for the filter (undefined to remove)
   */
  const updateFilter = useCallback(<K extends keyof RepositoryFilter>(
    key: K,
    value: RepositoryFilter[K]
  ) => {
    setFilters((prev) => {
      if (value === undefined || value === '' || value === false) {
        // Remove filter if value is undefined, empty string, or false
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { [key]: _removed, ...rest } = prev;
        return rest;
      }
      return { ...prev, [key]: value };
    });
  }, []);

  /**
   * Sets multiple filters at once
   * @param newFilters - Partial filter object to merge with existing filters
   */
  const setMultipleFilters = useCallback((newFilters: Partial<RepositoryFilter>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  /**
   * Clears all active filters
   */
  const clearFilters = useCallback(() => {
    setFilters({});
  }, []);

  /**
   * Checks if any filters are currently active
   */
  const hasActiveFilters = useMemo(() => {
    return Object.keys(filters).length > 0;
  }, [filters]);

  /**
   * Gets count of active filters
   */
  const activeFilterCount = useMemo(() => {
    return Object.keys(filters).length;
  }, [filters]);

  /**
   * Applies all active filters to repositories (memoized)
   */
  const filteredRepositories = useMemo(() => {
    if (!hasActiveFilters) {
      return repositories;
    }
    return filterRepositories(repositories, filters);
  }, [repositories, filters, hasActiveFilters]);

  return {
    /** Filtered array of repositories */
    filteredRepositories,
    /** Current filter state */
    filters,
    /** Update a single filter */
    updateFilter,
    /** Set multiple filters at once */
    setMultipleFilters,
    /** Clear all filters */
    clearFilters,
    /** Whether any filters are active */
    hasActiveFilters,
    /** Count of active filters */
    activeFilterCount,
  };
}
