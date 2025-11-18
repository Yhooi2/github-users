import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Info } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface MetricCardProps {
  title: string;
  score: number;
  level: 'Low' | 'Moderate' | 'High' | 'Strong' | 'Excellent' | 'Exceptional' | 'Minimal' | 'Good' | 'Fair' | 'Weak' | 'Rapid Growth' | 'Growing' | 'Stable' | 'Declining' | 'Rapid Decline';
  breakdown?: Array<{
    label: string;
    value: number;
    max: number;
  }>;
  loading?: boolean;
  onExplainClick?: () => void;
}

export function MetricCard({
  title,
  score,
  level,
  breakdown,
  loading = false,
  onExplainClick,
}: MetricCardProps) {
  if (loading) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <div className="bg-muted h-6 w-1/2 rounded" />
        </CardHeader>
        <CardContent>
          <div className="bg-muted h-12 rounded" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">{title}</CardTitle>
        {onExplainClick && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onExplainClick}
            aria-label={`Explain ${title} score`}
          >
            <Info className="h-4 w-4" />
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Score display */}
        <div className="text-center">
          <div className="text-4xl font-bold">{score}%</div>
          <div className="text-muted-foreground text-sm">{level}</div>
        </div>

        {/* Progress bar */}
        <div className="bg-muted h-2 w-full overflow-hidden rounded-full">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${score}%` }}
          />
        </div>

        {/* Breakdown */}
        {breakdown && breakdown.length > 0 && (
          <div className="space-y-2 text-sm">
            {breakdown.map((item) => (
              <div key={item.label} className="flex justify-between">
                <span className="text-muted-foreground">{item.label}</span>
                <span className="font-medium">
                  {item.value}/{item.max}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
