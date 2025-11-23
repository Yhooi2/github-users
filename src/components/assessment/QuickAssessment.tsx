import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MetricCard } from "./MetricCard";

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
    growth: {
      score: number;
      level:
        | "Rapid Growth"
        | "Growing"
        | "Stable"
        | "Declining"
        | "Rapid Decline";
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
  // Count total metrics (including optional authenticity)
  const hasAuthenticity = !!metrics.authenticity;
  const metricCount = hasAuthenticity ? 5 : 4;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <span className="text-xl" aria-hidden="true">
            🎯
          </span>
          Quick Assessment
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Responsive grid: 2 cols on mobile, 4-5 on desktop */}
        <div
          className={`grid gap-3 grid-cols-2 ${
            metricCount === 5
              ? "md:grid-cols-3 lg:grid-cols-5"
              : "md:grid-cols-4"
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
            title="Growth"
            score={metrics.growth.score}
            level={metrics.growth.level}
            loading={loading}
            onExplainClick={
              onExplainMetric ? () => onExplainMetric("growth") : undefined
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
