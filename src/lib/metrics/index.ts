/**
 * Metrics Calculation System
 *
 * Exports all metric calculation functions and types for analyzing GitHub user analytics.
 * All metrics follow a consistent pattern with score (0-100 or -100 to +100 for growth),
 * level label, breakdown by component, and additional details.
 *
 * @module metrics
 */

// Activity Metric
export {
  calculateActivityScore,
  getActivityLabel,
  type ActivityMetric,
} from "./activity";

// Impact Metric
export {
  calculateImpactScore,
  getImpactLabel,
  type ImpactMetric,
} from "./impact";

// Quality Metric
export {
  calculateQualityScore,
  getQualityLabel,
  type QualityMetric,
} from "./quality";

// Growth Metric
export {
  calculateGrowthScore,
  getGrowthLabel,
  type GrowthMetric,
} from "./growth";
