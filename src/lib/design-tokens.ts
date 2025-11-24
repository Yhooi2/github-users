/**
 * Design Tokens for Score Colors
 *
 * Centralized color definitions for consistent score visualization.
 * Uses semantic naming (success, warning, destructive) that maps to CSS variables.
 *
 * Score thresholds:
 * - high: >= 80 (success/green)
 * - medium: >= 60 (warning/yellow)
 * - low: >= 40 (caution/orange)
 * - critical: < 40 (destructive/red)
 */

// Score color tokens using Tailwind classes
export const scoreColors = {
  high: "text-success",
  medium: "text-warning",
  low: "text-caution",
  critical: "text-destructive",
} as const;

// Background variants for score colors
export const scoreBackgroundColors = {
  high: "bg-success/10",
  medium: "bg-warning/10",
  low: "bg-caution/10",
  critical: "bg-destructive/10",
} as const;

// Border variants for score colors
export const scoreBorderColors = {
  high: "border-success",
  medium: "border-warning",
  low: "border-caution",
  critical: "border-destructive",
} as const;

// Trend colors for up/down indicators
export const trendColors = {
  up: "text-success",
  down: "text-destructive",
  neutral: "text-muted-foreground",
} as const;

// Event type colors for timeline
export const eventColors = {
  commit: "text-primary",
  pr: "text-purple-500",
  review: "text-warning",
  merge: "text-success",
} as const;

export type ScoreLevel = keyof typeof scoreColors;
export type TrendDirection = keyof typeof trendColors;
export type EventType = keyof typeof eventColors;

/**
 * Get score level based on numeric value (0-100)
 */
export function getScoreLevel(score: number): ScoreLevel {
  if (score >= 80) return "high";
  if (score >= 60) return "medium";
  if (score >= 40) return "low";
  return "critical";
}

/**
 * Get text color class for a score value
 */
export function getScoreColor(score: number): string {
  return scoreColors[getScoreLevel(score)];
}

/**
 * Get background color class for a score value
 */
export function getScoreBackgroundColor(score: number): string {
  return scoreBackgroundColors[getScoreLevel(score)];
}

/**
 * Get trend color class
 */
export function getTrendColor(trend: TrendDirection): string {
  return trendColors[trend];
}

/**
 * Get event color class
 */
export function getEventColor(eventType: EventType): string {
  return eventColors[eventType];
}
