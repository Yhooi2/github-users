/**
 * Project Types
 *
 * Shared types for project/repository data used across components and adapters.
 * These types are defined in lib/types to avoid circular dependencies between
 * lib/ and components/ layers.
 */

/**
 * Language breakdown for multi-language display
 */
export interface LanguageInfo {
  /** Language name */
  name: string;
  /** Percentage of codebase (0-100) */
  percent: number;
  /** Size in bytes */
  size?: number;
}

/**
 * Project data for compact row display (Level 0)
 */
export interface CompactProject {
  /** Unique identifier */
  id: string;
  /** Repository name */
  name: string;
  /** Number of USER's commits in this period */
  commits: number;
  /** Total commits in the repository (for calculating contribution %) */
  totalRepoCommits?: number;
  /** Star count */
  stars: number;
  /** Primary programming language */
  language: string;
  /** All languages with percentages (for language bar) */
  languages?: LanguageInfo[];
  /** Whether user is the owner */
  isOwner: boolean;
  /** Whether repository is a fork */
  isFork: boolean;
  /** Optional description for hover preview */
  description?: string;
  /** Repository URL */
  url?: string;
  /** Last activity date (for activity status indicator) */
  lastActivityDate?: string;
}
