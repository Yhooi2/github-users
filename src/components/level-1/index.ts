/**
 * Level 1 components - Expandable cards for comparing projects
 *
 * These components implement the second level of progressive disclosure,
 * providing inline expansion with detailed project information.
 * All analytics are now displayed inline with tooltips - no modal required.
 *
 * Stage 5 Glass UI Migration: ExpandableProjectCard now uses Glass styling.
 */

// Glass UI wrapper (default export)
export { ExpandableProjectCardGlass as ExpandableProjectCard } from "./ExpandableProjectCardGlass.wrapper";
export type {
  ExpandableProject,
  ExpandableProjectCardGlassProps as ExpandableProjectCardProps,
  TeamMember,
} from "./ExpandableProjectCardGlass.wrapper";

// Original component (deprecated, kept for reference)
export { ExpandableProjectCard as ExpandableProjectCardOriginal } from "./ExpandableProjectCard";

export { MetricTooltip } from "./MetricTooltip";
export type { MetricTooltipProps } from "./MetricTooltip";
