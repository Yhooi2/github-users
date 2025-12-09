import type { CareerSummary } from '@/lib/year-badges';

interface CareerSummaryHeaderProps {
  summary: CareerSummary;
}

export function CareerSummaryHeader({ summary }: CareerSummaryHeaderProps) {
  return (
    <div className="space-y-3 p-4 border-b">
      <h3 className="text-sm font-semibold text-muted-foreground">
        История активности
      </h3>

      <div className="text-sm text-muted-foreground space-y-1">
        <p>
          <span className="font-medium text-foreground">
            {summary.totalCommits.toLocaleString()}
          </span>
          {' '}коммитов за{' '}
          <span className="font-medium text-foreground">
            {summary.yearsActive}
          </span>
          {' '}лет
        </p>

        {summary.totalPRs > 0 && (
          <p>
            <span className="font-medium text-foreground">
              {summary.totalPRs.toLocaleString()}
            </span>
            {' '}pull requests
          </p>
        )}

        <p className="text-xs">
          На GitHub с {summary.startYear} года
        </p>
      </div>
    </div>
  );
}
