import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export interface MetricExplanationModalProps {
  isOpen: boolean;
  onClose: () => void;
  metric: 'activity' | 'impact' | 'quality' | 'growth';
  score: number;
  breakdown: Record<string, number>;
}

interface ExplanationConfig {
  title: string;
  description: string;
  components: Record<string, string>;
}

const EXPLANATIONS: Record<string, ExplanationConfig> = {
  activity: {
    title: 'Activity Score',
    description: 'Measures recent coding activity, consistency, and project diversity',
    components: {
      recentCommits: 'Commits in last 3 months (0-40 pts)',
      consistency: 'Active months in last year (0-30 pts)',
      diversity: 'Number of unique repositories (0-30 pts)',
    },
  },
  impact: {
    title: 'Impact Score',
    description: 'Measures community reach and engagement',
    components: {
      stars: 'Total stars across repos (0-35 pts)',
      forks: 'Total forks (0-20 pts)',
      contributors: 'Contributors attracted (0-15 pts)',
      reach: 'Watchers + dependents (0-20 pts)',
      engagement: 'Issue/PR activity (0-10 pts)',
    },
  },
  quality: {
    title: 'Quality Score',
    description: 'Evaluates code quality, documentation, and maturity',
    components: {
      originality: 'Non-forked repositories (0-30 pts)',
      documentation: 'README and docs quality (0-25 pts)',
      ownership: 'Code ownership ratio (0-20 pts)',
      maturity: 'Project age and stability (0-15 pts)',
      stack: 'Technology stack diversity (0-10 pts)',
    },
  },
  growth: {
    title: 'Growth Score',
    description: 'Tracks year-over-year improvement in contributions',
    components: {
      commitGrowth: 'Commit volume increase (0-40 pts)',
      repoGrowth: 'New repositories created (0-30 pts)',
      impactGrowth: 'Stars/forks growth (0-30 pts)',
    },
  },
};

export function MetricExplanationModal({
  isOpen,
  onClose,
  metric,
  score,
  breakdown,
}: MetricExplanationModalProps) {
  const explanation = EXPLANATIONS[metric];

  if (!explanation) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {explanation.title}: {score}%
          </DialogTitle>
          <DialogDescription>{explanation.description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <h4 className="font-medium">Score Breakdown:</h4>
          {Object.entries(breakdown).map(([key, value]) => (
            <div key={key} className="flex justify-between">
              <span className="text-muted-foreground text-sm">
                {explanation.components[key] || key}
              </span>
              <span className="font-medium">{value} pts</span>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
