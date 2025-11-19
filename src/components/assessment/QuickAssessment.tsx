import { useState } from 'react';
import { MetricCard } from './MetricCard';
import { MetricExplanationModal } from './MetricExplanationModal';
import type { ActivityMetric, ImpactMetric, QualityMetric, GrowthMetric } from '@/lib/metrics';

export interface QuickAssessmentProps {
  metrics: {
    activity: ActivityMetric;
    impact: ImpactMetric;
    quality: QualityMetric;
    growth: GrowthMetric;
  };
  loading?: boolean;
}

export function QuickAssessment({
  metrics,
  loading = false,
}: QuickAssessmentProps) {
  const [openModal, setOpenModal] = useState<'activity' | 'impact' | 'quality' | 'growth' | null>(null);

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-bold">🎯 Quick Assessment</h2>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Activity"
          score={metrics.activity.score}
          level={metrics.activity.level}
          breakdown={[
            { label: 'Recent Commits', value: metrics.activity.breakdown.recentCommits, max: 40 },
            { label: 'Consistency', value: metrics.activity.breakdown.consistency, max: 30 },
            { label: 'Diversity', value: metrics.activity.breakdown.diversity, max: 30 },
          ]}
          loading={loading}
          onExplainClick={() => setOpenModal('activity')}
        />
        <MetricCard
          title="Impact"
          score={metrics.impact.score}
          level={metrics.impact.level}
          breakdown={[
            { label: 'Stars', value: metrics.impact.breakdown.stars, max: 35 },
            { label: 'Forks', value: metrics.impact.breakdown.forks, max: 20 },
            { label: 'Contributors', value: metrics.impact.breakdown.contributors, max: 15 },
            { label: 'Reach', value: metrics.impact.breakdown.reach, max: 20 },
            { label: 'Engagement', value: metrics.impact.breakdown.engagement, max: 10 },
          ]}
          loading={loading}
          onExplainClick={() => setOpenModal('impact')}
        />
        <MetricCard
          title="Quality"
          score={metrics.quality.score}
          level={metrics.quality.level}
          breakdown={[
            { label: 'Originality', value: metrics.quality.breakdown.originality, max: 30 },
            { label: 'Documentation', value: metrics.quality.breakdown.documentation, max: 25 },
            { label: 'Ownership', value: metrics.quality.breakdown.ownership, max: 20 },
            { label: 'Maturity', value: metrics.quality.breakdown.maturity, max: 15 },
            { label: 'Stack', value: metrics.quality.breakdown.stack, max: 10 },
          ]}
          loading={loading}
          onExplainClick={() => setOpenModal('quality')}
        />
        <MetricCard
          title="Growth"
          score={metrics.growth.score}
          level={metrics.growth.level}
          breakdown={[
            { label: 'Commit Growth', value: metrics.growth.breakdown.commitGrowth, max: 40 },
            { label: 'Repo Growth', value: metrics.growth.breakdown.repoGrowth, max: 30 },
            { label: 'Impact Growth', value: metrics.growth.breakdown.impactGrowth, max: 30 },
          ]}
          loading={loading}
          onExplainClick={() => setOpenModal('growth')}
        />
      </div>

      {/* Explanation Modal */}
      {openModal && (
        <MetricExplanationModal
          isOpen={!!openModal}
          onClose={() => setOpenModal(null)}
          metric={openModal}
          score={metrics[openModal].score}
          breakdown={metrics[openModal].breakdown}
        />
      )}
    </section>
  );
}
