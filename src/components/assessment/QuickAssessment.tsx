/**
 * QuickAssessment - Migration to TrustScoreCardGlass from shadcn-glass-ui v2.8.0
 *
 * Uses TrustScoreCardGlass component which provides:
 * - Overall trust score display with rainbow progress bar
 * - Responsive grid of metrics (2 cols mobile, 3 cols tablet, 4+ cols desktop)
 * - Glass effect styling with proper color variants
 *
 * Note: TrustScoreCardGlass doesn't support individual metric click handlers.
 * For interactive metrics, consider using MetricCardGlass directly in a custom grid.
 */

import { TrustScoreCardGlass } from "shadcn-glass-ui/components";

// MetricData type with inline variant (internal to shadcn-glass-ui)
type MetricVariant =
  | "default"
  | "secondary"
  | "success"
  | "warning"
  | "destructive";

interface MetricData {
  readonly title: string;
  readonly value: string | number;
  readonly variant: MetricVariant;
}

export interface QuickAssessmentProps {
  metrics: {
    activity: { score: number; level: "High" | "Moderate" | "Low" };
    impact: {
      score: number;
      level: "Exceptional" | "Strong" | "Moderate" | "Low" | "Minimal";
    };
    quality: {
      score: number;
      level: "Excellent" | "Strong" | "Good" | "Fair" | "Weak";
    };
    consistency: {
      score: number;
      level: "Excellent" | "High" | "Moderate" | "Low";
    };
    collaboration: {
      score: number;
      level: "Excellent" | "High" | "Moderate" | "Low";
    };
    authenticity?: {
      score: number;
      level: "High" | "Medium" | "Low" | "Suspicious";
    };
  };
  loading?: boolean;
  /** @deprecated TrustScoreCardGlass doesn't support individual metric click handlers */
  onExplainMetric?: (metric: string) => void;
}

/**
 * Map score to MetricCardGlass variant
 * Available variants: default, secondary, success, warning, destructive
 */
function getMetricVariant(
  score: number,
): "success" | "warning" | "destructive" | "default" {
  if (score >= 80) return "success";
  if (score >= 60) return "default";
  if (score >= 40) return "warning";
  return "destructive";
}

/**
 * QuickAssessment - Glass UI Version
 *
 * Migrated to use TrustScoreCardGlass from shadcn-glass-ui.
 * Calculates overall trust score as average of all metrics.
 */
export function QuickAssessment({
  metrics,
  loading = false,
}: QuickAssessmentProps) {
  // Calculate overall trust score as average of all metrics
  const scores = [
    metrics.activity.score,
    metrics.impact.score,
    metrics.quality.score,
    metrics.consistency.score,
    metrics.collaboration.score,
  ];

  if (metrics.authenticity) {
    scores.push(metrics.authenticity.score);
  }

  const overallScore = Math.round(
    scores.reduce((sum, score) => sum + score, 0) / scores.length,
  );

  // Build metrics array for TrustScoreCardGlass
  const metricsData: MetricData[] = [
    {
      title: "Activity",
      value: metrics.activity.score,
      variant: getMetricVariant(metrics.activity.score),
    },
    {
      title: "Impact",
      value: metrics.impact.score,
      variant: getMetricVariant(metrics.impact.score),
    },
    {
      title: "Quality",
      value: metrics.quality.score,
      variant: getMetricVariant(metrics.quality.score),
    },
    {
      title: "Consistency",
      value: metrics.consistency.score,
      variant: getMetricVariant(metrics.consistency.score),
    },
    {
      title: "Collaboration",
      value: metrics.collaboration.score,
      variant: getMetricVariant(metrics.collaboration.score),
    },
  ];

  if (metrics.authenticity) {
    metricsData.push({
      title: "Authenticity",
      value: metrics.authenticity.score,
      variant: getMetricVariant(metrics.authenticity.score),
    });
  }

  if (loading) {
    return (
      <TrustScoreCardGlass score={0} metrics={[]} className="animate-pulse" />
    );
  }

  return <TrustScoreCardGlass score={overallScore} metrics={metricsData} />;
}
