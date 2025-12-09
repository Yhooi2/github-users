import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import type { MonthlyContribution } from '@/lib/contribution-aggregator';
import { useMemo } from 'react';

interface MiniActivityChartProps {
  monthlyData: MonthlyContribution[];
  className?: string;
}

/**
 * MiniActivityChart - Compact monthly activity visualization
 *
 * Displays 12 bars representing monthly contribution activity.
 * Height of each bar is relative to the most active month.
 */
export function MiniActivityChart({ monthlyData, className }: MiniActivityChartProps) {
  const maxContributions = useMemo(
    () => Math.max(...monthlyData.map(m => m.contributions), 1),
    [monthlyData]
  );

  return (
    <div className={cn("flex items-end gap-0.5 h-6", className)}>
      {monthlyData.map((month) => {
        const heightPercent = (month.contributions / maxContributions) * 100;
        const heightClass = getHeightClass(heightPercent);

        return (
          <Tooltip key={month.month} delayDuration={100}>
            <TooltipTrigger asChild>
              <div
                className={cn(
                  "flex-1 rounded-sm transition-colors",
                  "bg-primary/30 hover:bg-primary/50",
                  heightClass
                )}
                aria-label={`${month.monthName}: ${month.contributions} contributions`}
              />
            </TooltipTrigger>
            <TooltipContent side="top" className="text-xs">
              <p className="font-medium">{month.monthName}</p>
              <p className="text-muted-foreground">
                {month.contributions.toLocaleString()} contributions
              </p>
              <p className="text-muted-foreground">
                {month.daysActive} active days
              </p>
            </TooltipContent>
          </Tooltip>
        );
      })}
    </div>
  );
}

/**
 * Map percentage to Tailwind height class
 */
function getHeightClass(percent: number): string {
  if (percent === 0) return 'h-0.5';
  if (percent < 15) return 'h-1';
  if (percent < 30) return 'h-1.5';
  if (percent < 45) return 'h-2';
  if (percent < 60) return 'h-3';
  if (percent < 75) return 'h-4';
  if (percent < 90) return 'h-5';
  return 'h-6';
}
