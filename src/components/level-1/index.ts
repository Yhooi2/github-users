/**
 * Level 1 components - Expandable cards for comparing projects
 *
 * These components implement the second level of progressive disclosure,
 * providing inline expansion with detailed project information.
 * All analytics are now displayed inline with tooltips - no modal required.
 */

export { ExpandableProjectCard } from "./ExpandableProjectCard";
export type {
  ExpandableProject,
  ExpandableProjectCardProps,
  TeamMember,
} from "./ExpandableProjectCard";

export { MetricTooltip } from "./MetricTooltip";
export type { MetricTooltipProps } from "./MetricTooltip";
