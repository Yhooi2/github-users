import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell } from 'recharts';
import { ChartContainer, ChartTooltip } from '@/components/ui/chart';
import { LoadingState } from '@/components/layout/LoadingState';
import { ErrorState } from '@/components/layout/ErrorState';
import { EmptyState } from '@/components/layout/EmptyState';
import type { CommitActivity } from '@/lib/statistics';
import { Activity } from 'lucide-react';

type Props = {
  /**
   * Commit activity data
   */
  data: CommitActivity | null;
  /**
   * Loading state
   * @default false
   */
  loading?: boolean;
  /**
   * Error state
   */
  error?: Error | null;
  /**
   * Custom loading message
   */
  loadingMessage?: string;
  /**
   * Custom error title
   */
  errorTitle?: string;
  /**
   * Custom error description
   */
  errorDescription?: string;
  /**
   * Custom empty state title
   */
  emptyTitle?: string;
  /**
   * Custom empty state description
   */
  emptyDescription?: string;
  /**
   * Chart height in pixels
   * @default 300
   */
  height?: number;
  /**
   * Show total commits stat
   * @default true
   */
  showTotal?: boolean;
};

const chartConfig = {
  commits: {
    label: 'Commits',
    color: 'hsl(var(--chart-1))',
  },
};

// Color palette for different time periods
const PERIOD_COLORS = {
  daily: 'hsl(var(--chart-1))',
  weekly: 'hsl(var(--chart-2))',
  monthly: 'hsl(var(--chart-3))',
};

/**
 * ActivityChart - Displays commit activity rates
 *
 * Visualizes commit frequency across different time periods:
 * - Per Day: Average commits per day
 * - Per Week: Average commits per week
 * - Per Month: Average commits per month
 *
 * Features:
 * - Color-coded bars for each period
 * - Total commits display
 * - Loading, error, and empty states
 *
 * @example
 * ```tsx
 * const activity = calculateCommitActivity(
 *   totalCommits,
 *   periodDays
 * );
 *
 * <ActivityChart
 *   data={activity}
 *   showTotal={true}
 * />
 * ```
 */
export function ActivityChart({
  data,
  loading = false,
  error = null,
  loadingMessage = 'Loading activity statistics...',
  errorTitle,
  errorDescription,
  emptyTitle = 'No Activity Data',
  emptyDescription = 'No commit activity statistics available.',
  showTotal = true,
}: Props) {
  // Loading state
  if (loading) {
    return <LoadingState message={loadingMessage} />;
  }

  // Error state
  if (error) {
    return (
      <ErrorState
        title={errorTitle || 'Failed to load activity statistics'}
        message={errorDescription || error.message}
      />
    );
  }

  // Empty state
  if (!data) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  // Transform data for chart
  const chartData = [
    {
      period: 'Daily',
      commits: data.perDay,
      fill: PERIOD_COLORS.daily,
    },
    {
      period: 'Weekly',
      commits: data.perWeek,
      fill: PERIOD_COLORS.weekly,
    },
    {
      period: 'Monthly',
      commits: data.perMonth,
      fill: PERIOD_COLORS.monthly,
    },
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Commit Activity</h3>
          <p className="text-muted-foreground text-sm">
            Average commits per time period
            {showTotal && ` (${data.total.toLocaleString()} total)`}
          </p>
        </div>
        <Activity className="text-muted-foreground h-5 w-5" aria-hidden="true" />
      </div>

      {/* Chart */}
      <ChartContainer config={chartConfig} className="h-[300px] w-full">
        <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis
            dataKey="period"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            className="text-xs"
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            className="text-xs"
            tickFormatter={(value) => value.toLocaleString()}
          />
          <ChartTooltip
            content={({ active, payload }) => {
              if (!active || !payload || payload.length === 0) return null;

              const data = payload[0].payload;
              return (
                <div className="bg-background rounded-lg border p-2 shadow-sm">
                  <div className="flex flex-col gap-1">
                    <span className="font-semibold">{data.period}</span>
                    <span className="text-muted-foreground text-sm">
                      {data.commits.toFixed(1)} commits per {data.period.toLowerCase()}
                    </span>
                  </div>
                </div>
              );
            }}
            cursor={{ fill: 'hsl(var(--muted))' }}
          />
          <Bar dataKey="commits" radius={[4, 4, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ChartContainer>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border p-4">
          <div className="flex items-center gap-2">
            <div
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: PERIOD_COLORS.daily }}
              aria-hidden="true"
            />
            <p className="text-muted-foreground text-sm font-medium">Per Day</p>
          </div>
          <p className="mt-2 text-2xl font-bold">{data.perDay.toFixed(1)}</p>
          <p className="text-muted-foreground text-xs">avg commits/day</p>
        </div>

        <div className="rounded-lg border p-4">
          <div className="flex items-center gap-2">
            <div
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: PERIOD_COLORS.weekly }}
              aria-hidden="true"
            />
            <p className="text-muted-foreground text-sm font-medium">Per Week</p>
          </div>
          <p className="mt-2 text-2xl font-bold">{data.perWeek.toFixed(1)}</p>
          <p className="text-muted-foreground text-xs">avg commits/week</p>
        </div>

        <div className="rounded-lg border p-4">
          <div className="flex items-center gap-2">
            <div
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: PERIOD_COLORS.monthly }}
              aria-hidden="true"
            />
            <p className="text-muted-foreground text-sm font-medium">Per Month</p>
          </div>
          <p className="mt-2 text-2xl font-bold">{data.perMonth.toFixed(1)}</p>
          <p className="text-muted-foreground text-xs">avg commits/month</p>
        </div>
      </div>

      {/* Total commits (if shown) */}
      {showTotal && (
        <div className="bg-muted/50 rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm font-medium">Total Commits</p>
              <p className="mt-1 text-3xl font-bold">{data.total.toLocaleString()}</p>
            </div>
            <Activity className="text-muted-foreground h-8 w-8" aria-hidden="true" />
          </div>
        </div>
      )}
    </div>
  );
}
