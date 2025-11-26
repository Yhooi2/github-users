/**
 * Metric Categories Configuration
 *
 * Groups 6 individual metrics into 3 semantic categories for dashboard display:
 * - OUTPUT: Production-focused metrics (Activity + Impact)
 * - QUALITY: Code standards metrics (Quality + Consistency)
 * - TRUST: Verification metrics (Authenticity + Collaboration)
 *
 * @module metrics/categories
 */

import {
  Activity,
  Sparkles,
  Shield,
  Zap,
  Target,
  Award,
  Calendar,
  BadgeCheck,
  Users,
  type LucideIcon,
} from "lucide-react";

/**
 * Available metric category identifiers
 */
export type MetricCategory = "OUTPUT" | "QUALITY" | "TRUST";

/**
 * Individual metric key identifiers
 */
export type MetricKey =
  | "activity"
  | "impact"
  | "quality"
  | "consistency"
  | "authenticity"
  | "collaboration";

/**
 * Configuration for a single metric within a category
 */
export interface MetricConfig {
  /** Unique identifier */
  key: MetricKey;
  /** Display title */
  title: string;
  /** Short description for tooltips */
  description: string;
  /** Lucide icon component */
  icon: LucideIcon;
}

/**
 * Configuration for a metric category
 */
export interface CategoryConfig {
  /** Category identifier */
  name: MetricCategory;
  /** Display title */
  title: string;
  /** Short description */
  description: string;
  /** Category icon */
  icon: LucideIcon;
  /** Two metrics in this category */
  metrics: [MetricConfig, MetricConfig];
}

/**
 * Metric data structure for display
 */
export interface MetricData {
  score: number;
  level: string;
  breakdown?: Record<string, number>;
}

/**
 * All metrics data for the assessment grid
 */
export interface AllMetricsData {
  activity: MetricData;
  impact: MetricData;
  quality: MetricData;
  consistency: MetricData;
  authenticity: MetricData;
  collaboration: MetricData;
}

/**
 * Category score calculated from its metrics
 */
export interface CategoryScore {
  category: MetricCategory;
  score: number;
  metrics: {
    first: MetricData & { key: MetricKey };
    second: MetricData & { key: MetricKey };
  };
}

/**
 * Individual metric configurations
 */
export const METRIC_CONFIGS: Record<MetricKey, MetricConfig> = {
  activity: {
    key: "activity",
    title: "Activity",
    description: "Development frequency and contribution volume",
    icon: Zap,
  },
  impact: {
    key: "impact",
    title: "Impact",
    description: "Project reach through stars, forks, and engagement",
    icon: Target,
  },
  quality: {
    key: "quality",
    title: "Quality",
    description: "Code standards, documentation, and originality",
    icon: Award,
  },
  consistency: {
    key: "consistency",
    title: "Consistency",
    description: "Regular contribution patterns over time",
    icon: Calendar,
  },
  authenticity: {
    key: "authenticity",
    title: "Authenticity",
    description: "Profile genuineness and original work verification",
    icon: BadgeCheck,
  },
  collaboration: {
    key: "collaboration",
    title: "Collaboration",
    description: "Team contributions and open source involvement",
    icon: Users,
  },
};

/**
 * Category configurations with their metrics
 */
export const CATEGORY_CONFIGS: Record<MetricCategory, CategoryConfig> = {
  OUTPUT: {
    name: "OUTPUT",
    title: "Output",
    description: "Productivity and project reach",
    icon: Activity,
    metrics: [METRIC_CONFIGS.activity, METRIC_CONFIGS.impact],
  },
  QUALITY: {
    name: "QUALITY",
    title: "Quality",
    description: "Code standards and work habits",
    icon: Sparkles,
    metrics: [METRIC_CONFIGS.quality, METRIC_CONFIGS.consistency],
  },
  TRUST: {
    name: "TRUST",
    title: "Trust",
    description: "Profile authenticity and teamwork",
    icon: Shield,
    metrics: [METRIC_CONFIGS.authenticity, METRIC_CONFIGS.collaboration],
  },
};

/**
 * Ordered list of categories for consistent rendering
 */
export const CATEGORY_ORDER: MetricCategory[] = ["OUTPUT", "QUALITY", "TRUST"];

/**
 * Calculate category score as average of its two metrics
 *
 * @param metrics - All metrics data
 * @param category - Category to calculate score for
 * @returns Category score (0-100)
 */
export function calculateCategoryScore(
  metrics: AllMetricsData,
  category: MetricCategory
): number {
  const config = CATEGORY_CONFIGS[category];
  const [first, second] = config.metrics;
  const firstScore = metrics[first.key].score;
  const secondScore = metrics[second.key].score;
  return Math.round((firstScore + secondScore) / 2);
}

/**
 * Get all category scores from metrics data
 *
 * @param metrics - All metrics data
 * @returns Array of category scores with their metrics
 */
export function getCategoryScores(metrics: AllMetricsData): CategoryScore[] {
  return CATEGORY_ORDER.map((categoryName) => {
    const config = CATEGORY_CONFIGS[categoryName];
    const [firstConfig, secondConfig] = config.metrics;

    return {
      category: categoryName,
      score: calculateCategoryScore(metrics, categoryName),
      metrics: {
        first: {
          key: firstConfig.key,
          ...metrics[firstConfig.key],
        },
        second: {
          key: secondConfig.key,
          ...metrics[secondConfig.key],
        },
      },
    };
  });
}
