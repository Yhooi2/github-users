/**
 * Filter and sorting types for repository lists
 * Centralized type definitions used across the application
 */

/**
 * Sort options for repository lists
 */
export type SortBy =
  | 'stars'
  | 'forks'
  | 'watchers'
  | 'commits'
  | 'size'
  | 'updated'
  | 'created'
  | 'name';

/**
 * Sort direction
 */
export type SortDirection = 'asc' | 'desc';

/**
 * Filter options for repository lists
 */
export type RepositoryFilter = {
  /** Show only original (non-forked) repositories */
  originalOnly?: boolean;
  /** Show only forked repositories */
  forksOnly?: boolean;
  /** Hide archived repositories */
  hideArchived?: boolean;
  /** Filter by primary language */
  language?: string;
  /** Minimum number of stars */
  minStars?: number;
  /** Search query for name/description */
  searchQuery?: string;
  /** Show only repositories with topics */
  hasTopics?: boolean;
  /** Show only repositories with license */
  hasLicense?: boolean;
};

/**
 * Sorting configuration
 */
export type RepositorySorting = {
  field: SortBy;
  direction: SortDirection;
};
