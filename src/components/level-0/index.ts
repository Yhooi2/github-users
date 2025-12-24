/**
 * Level 0 components - Compact list view for quick scanning
 *
 * These components implement the first level of the progressive disclosure
 * interface, showing all projects in a compact, scannable format.
 *
 * Stage 5 Glass UI Migration: CompactProjectRow now uses Glass styling.
 */

// Glass UI wrapper (default export)
export { CompactProjectRowGlass as CompactProjectRow } from "./CompactProjectRowGlass.wrapper";
export type { CompactProjectRowGlassProps as CompactProjectRowProps } from "./CompactProjectRowGlass.wrapper";

// Re-export types from original for compatibility
export type { CompactProject } from "./CompactProjectRow";

// Original component (deprecated, kept for reference)
export { CompactProjectRow as CompactProjectRowOriginal } from "./CompactProjectRow";

export { ProjectListContainer } from "./ProjectListContainer";
export type {
  ProjectListContainerProps,
  SortOption,
} from "./ProjectListContainer";
