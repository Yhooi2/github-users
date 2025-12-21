import { Card, CardContent } from "@/components/ui/card";
import { MetricCardWrapper as MetricCard } from "./MetricCardGlass.wrapper";

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
  onExplainMetric?: (metric: string) => void;
}

/**
 * QuickAssessment - Compact metrics display per design plan
 *
 * Per plan: "5 metrics compactly - icon + name + number (in profile header)"
 * - Desktop: Click metric -> Dialog (Modal) with breakdown
 * - Mobile: Click metric -> Sheet from bottom
 */
export function QuickAssessment({
  metrics,
  loading = false,
  onExplainMetric,
}: QuickAssessmentProps) {
  // Always 6 metrics (5 core + optional authenticity)
  const hasAuthenticity = !!metrics.authenticity;
  const metricCount = hasAuthenticity ? 6 : 5;

  return (
    <Card>
      <CardContent className="pt-6">
        {/* Responsive grid: 2 cols mobile, 3 cols tablet, 6 cols desktop */}
        <div
          className={`grid grid-cols-2 gap-3 md:grid-cols-3 ${
            metricCount === 6 ? "lg:grid-cols-6" : "lg:grid-cols-5"
          }`}
        >
          <MetricCard
            title="Activity"
            score={metrics.activity.score}
            level={metrics.activity.level}
            loading={loading}
            onExplainClick={
              onExplainMetric ? () => onExplainMetric("activity") : undefined
            }
          />
          <MetricCard
            title="Impact"
            score={metrics.impact.score}
            level={metrics.impact.level}
            loading={loading}
            onExplainClick={
              onExplainMetric ? () => onExplainMetric("impact") : undefined
            }
          />
          <MetricCard
            title="Quality"
            score={metrics.quality.score}
            level={metrics.quality.level}
            loading={loading}
            onExplainClick={
              onExplainMetric ? () => onExplainMetric("quality") : undefined
            }
          />
          <MetricCard
            title="Consistency"
            score={metrics.consistency.score}
            level={metrics.consistency.level}
            loading={loading}
            onExplainClick={
              onExplainMetric ? () => onExplainMetric("consistency") : undefined
            }
          />
          <MetricCard
            title="Collaboration"
            score={metrics.collaboration.score}
            level={metrics.collaboration.level}
            loading={loading}
            onExplainClick={
              onExplainMetric
                ? () => onExplainMetric("collaboration")
                : undefined
            }
          />
          {metrics.authenticity && (
            <MetricCard
              title="Authenticity"
              score={metrics.authenticity.score}
              level={metrics.authenticity.level}
              loading={loading}
              onExplainClick={
                onExplainMetric
                  ? () => onExplainMetric("authenticity")
                  : undefined
              }
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
