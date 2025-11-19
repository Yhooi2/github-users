import { LineChart, Line, XAxis, YAxis, CartesianGrid, Legend, ReferenceLine } from 'recharts';
import { ChartContainer, ChartTooltip } from '@/components/ui/chart';
import { LoadingState } from '@/components/layout/LoadingState';
import { EmptyState } from '@/components/layout/EmptyState';
import type { YearData } from '@/hooks/useUserAnalytics';
import {
  calculateActivityScore,
  calculateImpactScore,
  calculateQualityScore,
  calculateGrowthScore,
} from '@/lib/metrics';
import { TrendingUp } from 'lucide-react';

export interface MetricTimelineProps {
  /**
   * Timeline data from useUserAnalytics
   */
  timeline: YearData[];
  /**
   * Loading state
   * @default false
   */
  loading?: boolean;
  /**
   * Chart height in pixels
   * @default 400
   */
  height?: number;
}

/**
 * Year data with calculated metric scores
 */
interface MetricYearData {
  year: number;
  activity: number;
  impact: number;
  quality: number;
  growth: number;
}

const chartConfig = {
  activity: {
    label: 'Activity',
    color: 'hsl(var(--chart-1))',
  },
  impact: {
    label: 'Impact',
    color: 'hsl(var(--chart-2))',
  },
  quality: {
    label: 'Quality',
    color: 'hsl(var(--chart-3))',
  },
  growth: {
    label: 'Growth',
    color: 'hsl(var(--chart-4))',
  },
};

/**
 * MetricTimeline - Displays metric development over years
 *
 * Visualizes how Activity, Impact, Quality, and Growth metrics
 * have evolved year by year.
 *
 * Features:
 * - Line chart with 4 metrics
 * - Reference line at 0 for Growth metric
 * - Loading and empty states
 * - Interactive tooltip
 *
 * @example
 * ```tsx
 * const { timeline } = useUserAnalytics('username');
 *
 * <MetricTimeline timeline={timeline} />
 * ```
 */
export function MetricTimeline({
  timeline,
  loading = false,
  height = 400,
}: MetricTimelineProps) {
  // Loading state
  if (loading) {
    return <LoadingState message="Loading metric timeline..." />;
  }

  // Empty state
  if (!timeline.length) {
    return (
      <EmptyState
        title="No Timeline Data"
        description="No year-by-year data available to calculate metrics."
      />
    );
  }

  // Calculate metrics for each year
  const metricData: MetricYearData[] = timeline
    .map((yearData) => {
      // Calculate metrics using single-year timeline
      const activity = calculateActivityScore([yearData]);
      const impact = calculateImpactScore([yearData]);
      const quality = calculateQualityScore([yearData]);
      const growth = calculateGrowthScore([yearData]);

      return {
        year: yearData.year,
        activity: activity.score,
        impact: impact.score,
        quality: quality.score,
        growth: growth.score,
      };
    })
    // Sort by year ascending (oldest first for timeline)
    .sort((a, b) => a.year - b.year);

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">📈 Metric Development</h2>
          <p className="text-muted-foreground text-sm">
            Track how your developer metrics evolved over the years
          </p>
        </div>
        <TrendingUp className="text-muted-foreground h-5 w-5" aria-hidden="true" />
      </div>

      {/* Chart */}
      <ChartContainer config={chartConfig} className="w-full" style={{ height }}>
        <LineChart
          data={metricData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis
            dataKey="year"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            className="text-xs"
          />
          <YAxis
            domain={[-100, 100]}
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            className="text-xs"
            ticks={[-100, -50, 0, 50, 100]}
          />
          <ChartTooltip
            content={({ active, payload }) => {
              if (!active || !payload || payload.length === 0) return null;

              const data = payload[0].payload as MetricYearData;
              return (
                <div className="bg-background rounded-lg border p-3 shadow-sm">
                  <div className="mb-2 font-semibold">{data.year}</div>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center justify-between gap-4">
                      <span className="flex items-center gap-2">
                        <span
                          className="h-2 w-2 rounded-full"
                          style={{ backgroundColor: chartConfig.activity.color }}
                        />
                        Activity:
                      </span>
                      <span className="font-medium">{data.activity.toFixed(0)}</span>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <span className="flex items-center gap-2">
                        <span
                          className="h-2 w-2 rounded-full"
                          style={{ backgroundColor: chartConfig.impact.color }}
                        />
                        Impact:
                      </span>
                      <span className="font-medium">{data.impact.toFixed(0)}</span>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <span className="flex items-center gap-2">
                        <span
                          className="h-2 w-2 rounded-full"
                          style={{ backgroundColor: chartConfig.quality.color }}
                        />
                        Quality:
                      </span>
                      <span className="font-medium">{data.quality.toFixed(0)}</span>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <span className="flex items-center gap-2">
                        <span
                          className="h-2 w-2 rounded-full"
                          style={{ backgroundColor: chartConfig.growth.color }}
                        />
                        Growth:
                      </span>
                      <span className="font-medium">
                        {data.growth > 0 ? '+' : ''}
                        {data.growth.toFixed(0)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            }}
            cursor={{ stroke: 'hsl(var(--muted))', strokeWidth: 1 }}
          />
          {/* Reference line at 0 for Growth metric */}
          <ReferenceLine y={0} stroke="hsl(var(--muted-foreground))" strokeDasharray="3 3" />
          <Legend
            wrapperStyle={{ paddingTop: '20px' }}
            iconType="line"
            formatter={(value) => (
              <span className="text-xs">{chartConfig[value as keyof typeof chartConfig]?.label || value}</span>
            )}
          />
          <Line
            type="monotone"
            dataKey="activity"
            stroke={chartConfig.activity.color}
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="impact"
            stroke={chartConfig.impact.color}
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="quality"
            stroke={chartConfig.quality.color}
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="growth"
            stroke={chartConfig.growth.color}
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ChartContainer>

      {/* Summary cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-lg border p-4">
          <div className="flex items-center gap-2">
            <div
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: chartConfig.activity.color }}
              aria-hidden="true"
            />
            <p className="text-muted-foreground text-sm font-medium">Activity</p>
          </div>
          <p className="mt-2 text-2xl font-bold">
            {metricData[metricData.length - 1]?.activity.toFixed(0) || 0}
          </p>
          <p className="text-muted-foreground text-xs">Latest score</p>
        </div>

        <div className="rounded-lg border p-4">
          <div className="flex items-center gap-2">
            <div
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: chartConfig.impact.color }}
              aria-hidden="true"
            />
            <p className="text-muted-foreground text-sm font-medium">Impact</p>
          </div>
          <p className="mt-2 text-2xl font-bold">
            {metricData[metricData.length - 1]?.impact.toFixed(0) || 0}
          </p>
          <p className="text-muted-foreground text-xs">Latest score</p>
        </div>

        <div className="rounded-lg border p-4">
          <div className="flex items-center gap-2">
            <div
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: chartConfig.quality.color }}
              aria-hidden="true"
            />
            <p className="text-muted-foreground text-sm font-medium">Quality</p>
          </div>
          <p className="mt-2 text-2xl font-bold">
            {metricData[metricData.length - 1]?.quality.toFixed(0) || 0}
          </p>
          <p className="text-muted-foreground text-xs">Latest score</p>
        </div>

        <div className="rounded-lg border p-4">
          <div className="flex items-center gap-2">
            <div
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: chartConfig.growth.color }}
              aria-hidden="true"
            />
            <p className="text-muted-foreground text-sm font-medium">Growth</p>
          </div>
          <p className="mt-2 text-2xl font-bold">
            {metricData[metricData.length - 1]?.growth > 0 ? '+' : ''}
            {metricData[metricData.length - 1]?.growth.toFixed(0) || 0}
          </p>
          <p className="text-muted-foreground text-xs">Latest score</p>
        </div>
      </div>
    </section>
  );
}
