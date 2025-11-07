import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GitCommit } from 'lucide-react';

type ContributionHistoryProps = {
  contributions: {
    year1: { totalCommitContributions: number };
    year2: { totalCommitContributions: number };
    year3: { totalCommitContributions: number };
  };
  yearLabels: {
    year1: number;
    year2: number;
    year3: number;
  };
};

export function ContributionHistory({ contributions, yearLabels }: ContributionHistoryProps) {
  const years = [
    { label: yearLabels.year1, commits: contributions.year1.totalCommitContributions },
    { label: yearLabels.year2, commits: contributions.year2.totalCommitContributions },
    { label: yearLabels.year3, commits: contributions.year3.totalCommitContributions },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GitCommit className="h-5 w-5" aria-hidden="true" />
          Contribution History
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {years.map((year) => (
            <div key={year.label} className="space-y-2 text-center">
              <div className="text-sm text-muted-foreground">{year.label}</div>
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                {year.commits.toLocaleString()}
              </div>
              <div className="text-xs text-muted-foreground">commits</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
