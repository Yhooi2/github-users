import { MetricCard } from './MetricCard';

export interface QuickAssessmentProps {
  metrics: {
    activity: { score: number; level: 'High' | 'Moderate' | 'Low' };
    impact: { score: number; level: 'Exceptional' | 'Strong' | 'Moderate' | 'Low' | 'Minimal' };
    quality: { score: number; level: 'Excellent' | 'Strong' | 'Good' | 'Fair' | 'Weak' };
    growth: { score: number; level: 'High' | 'Moderate' | 'Low' };
  };
  loading?: boolean;
  onExplainMetric?: (metric: string) => void;
}

export function QuickAssessment({
  metrics,
  loading = false,
  onExplainMetric,
}: QuickAssessmentProps) {
  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-bold">🎯 Quick Assessment</h2>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Activity"
          score={metrics.activity.score}
          level={metrics.activity.level}
          loading={loading}
          onExplainClick={onExplainMetric ? () => onExplainMetric('activity') : undefined}
        />
        <MetricCard
          title="Impact"
          score={metrics.impact.score}
          level={metrics.impact.level}
          loading={loading}
          onExplainClick={onExplainMetric ? () => onExplainMetric('impact') : undefined}
        />
        <MetricCard
          title="Quality"
          score={metrics.quality.score}
          level={metrics.quality.level}
          loading={loading}
          onExplainClick={onExplainMetric ? () => onExplainMetric('quality') : undefined}
        />
        <MetricCard
          title="Growth"
          score={metrics.growth.score}
          level={metrics.growth.level}
          loading={loading}
          onExplainClick={onExplainMetric ? () => onExplainMetric('growth') : undefined}
        />
      </div>
    </section>
  );
}
