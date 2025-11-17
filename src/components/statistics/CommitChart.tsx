import { LineChart, Line, XAxis, YAxis, CartesianGrid, BarChart, Bar, AreaChart, Area } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LoadingState } from '@/components/layout/LoadingState';
import { ErrorState } from '@/components/layout/ErrorState';
import { EmptyState } from '@/components/layout/EmptyState';
import type { YearlyCommitStats } from '@/lib/statistics';
import { TrendingUp } from 'lucide-react';

type ChartVariant = 'line' | 'bar' | 'area';

type Props = {
  /**
   * Yearly commit statistics data
   */
  data: YearlyCommitStats[];
  /**
   * Chart variant to display
   * @default 'line'
   */
  variant?: ChartVariant;
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
   * Show trend indicator
   * @default true
   */
  showTrend?: boolean;
  /**
   * Chart height in pixels
   * @default 300
   */
  height?: number;
};

const chartConfig = {
  commits: {
    label: 'Commits',
    color: 'hsl(var(--chart-1))',
  },
};

/**
 * CommitChart - Displays yearly commit activity
 *
 * Visualizes commit contributions over multiple years using different chart types:
 * - Line chart: Shows trend over time
 * - Bar chart: Shows discrete yearly values
 * - Area chart: Shows cumulative trend
 *
 * Supports loading, error, and empty states.
 *
 * @example
 * ```tsx
 * const yearlyStats = calculateYearlyCommitStats({
 *   year1: { totalCommitContributions: 500 },
 *   year2: { totalCommitContributions: 800 },
 *   year3: { totalCommitContributions: 1200 }
 * });
 *
 * <CommitChart
 *   data={yearlyStats}
 *   variant="line"
 *   showTrend={true}
 * />
 * ```
 */
export function CommitChart({
  data,
  variant = 'line',
  loading = false,
  error = null,
  loadingMessage = 'Loading commit statistics...',
  errorTitle,
  errorDescription,
  emptyTitle = 'No Commit Data',
  emptyDescription = 'No commit statistics available for this period.',
  showTrend = true,
}: Props) {
  // Loading state
  if (loading) {
    return <LoadingState message={loadingMessage} />;
  }

  // Error state
  if (error) {
    return (
      <ErrorState
        title={errorTitle || 'Failed to load commit statistics'}
        message={errorDescription || error.message}
      />
    );
  }

  // Empty state
  if (!data || data.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  // Calculate trend (comparing most recent year to previous)
  const trend = data.length >= 2 ? data[0].commits - data[1].commits : 0;
  const trendPercentage =
    data.length >= 2 && data[1].commits > 0
      ? ((trend / data[1].commits) * 100).toFixed(1)
      : '0.0';

  const trendUp = trend > 0;
  const totalCommits = data.reduce((sum, item) => sum + item.commits, 0);

  return (
    <div className="space-y-4">
      {/* Header with stats */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Commit Activity</h3>
          <p className="text-sm text-muted-foreground">
            {totalCommits.toLocaleString()} total commits across {data.length} years
          </p>
        </div>
        {showTrend && data.length >= 2 && (
          <div className="flex items-center gap-2 text-sm">
            <TrendingUp
              className={`h-4 w-4 ${trendUp ? 'text-green-500' : 'text-red-500 rotate-180'}`}
              aria-hidden="true"
            />
            <span className={trendUp ? 'text-green-600' : 'text-red-600'}>
              {trendUp ? '+' : ''}
              {trendPercentage}%
            </span>
            <span className="text-muted-foreground">vs. previous year</span>
          </div>
        )}
      </div>

      {/* Chart */}
      <ChartContainer config={chartConfig} className="h-[300px] w-full">
        {variant === 'line' ? (
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="year"
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
              content={<ChartTooltipContent />}
              cursor={{ stroke: 'hsl(var(--border))' }}
            />
            <Line
              type="monotone"
              dataKey="commits"
              stroke="var(--color-commits)"
              strokeWidth={2}
              dot={{ r: 4, strokeWidth: 2 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        ) : variant === 'bar' ? (
          <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="year"
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
            <ChartTooltip content={<ChartTooltipContent />} cursor={{ fill: 'hsl(var(--muted))' }} />
            <Bar dataKey="commits" fill="var(--color-commits)" radius={[4, 4, 0, 0]} />
          </BarChart>
        ) : (
          <AreaChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="year"
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
            <ChartTooltip content={<ChartTooltipContent />} cursor={{ stroke: 'hsl(var(--border))' }} />
            <Area
              type="monotone"
              dataKey="commits"
              stroke="var(--color-commits)"
              fill="var(--color-commits)"
              fillOpacity={0.2}
              strokeWidth={2}
            />
          </AreaChart>
        )}
      </ChartContainer>
    </div>
  );
}
