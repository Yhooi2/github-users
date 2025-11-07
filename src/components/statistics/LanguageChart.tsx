import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LoadingState } from '@/components/layout/LoadingState';
import { ErrorState } from '@/components/layout/ErrorState';
import { EmptyState } from '@/components/layout/EmptyState';
import type { LanguageStats } from '@/lib/statistics';
import { formatBytes } from '@/lib/statistics';
import { Code2 } from 'lucide-react';

type ChartVariant = 'pie' | 'donut';

type Props = {
  /**
   * Language statistics data
   */
  data: LanguageStats[];
  /**
   * Chart variant to display
   * @default 'pie'
   */
  variant?: ChartVariant;
  /**
   * Maximum number of languages to display (rest grouped as "Other")
   * @default 5
   */
  maxLanguages?: number;
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
   * Show legend
   * @default true
   */
  showLegend?: boolean;
  /**
   * Chart height in pixels
   * @default 300
   */
  height?: number;
};

// Predefined color palette for languages
const LANGUAGE_COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
  '#8884d8',
  '#82ca9d',
  '#ffc658',
  '#ff8042',
  '#a4de6c',
];

/**
 * LanguageChart - Displays programming language distribution
 *
 * Visualizes language usage across repositories using pie or donut charts.
 * Shows percentage and byte size for each language.
 *
 * Features:
 * - Automatic grouping of languages beyond maxLanguages limit
 * - Color-coded language segments
 * - Interactive legend
 * - Tooltips with detailed stats
 *
 * @example
 * ```tsx
 * const langStats = calculateLanguageStatistics(repositories);
 *
 * <LanguageChart
 *   data={langStats}
 *   variant="donut"
 *   maxLanguages={5}
 * />
 * ```
 */
export function LanguageChart({
  data,
  variant = 'pie',
  maxLanguages = 5,
  loading = false,
  error = null,
  loadingMessage = 'Loading language statistics...',
  errorTitle,
  errorDescription,
  emptyTitle = 'No Language Data',
  emptyDescription = 'No programming language statistics available.',
  showLegend = true,
  height = 300,
}: Props) {
  // Loading state
  if (loading) {
    return <LoadingState message={loadingMessage} />;
  }

  // Error state
  if (error) {
    return (
      <ErrorState
        title={errorTitle || 'Failed to load language statistics'}
        message={errorDescription || error.message}
      />
    );
  }

  // Empty state
  if (!data || data.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  // Process data: group languages beyond maxLanguages
  let chartData = [...data];
  let otherLanguages: LanguageStats[] = [];

  if (data.length > maxLanguages) {
    chartData = data.slice(0, maxLanguages);
    otherLanguages = data.slice(maxLanguages);

    // Sum up "Other" languages
    const otherTotal = otherLanguages.reduce(
      (acc, lang) => ({
        size: acc.size + lang.size,
        percentage: acc.percentage + lang.percentage,
        repos: acc.repos + lang.repositoryCount,
      }),
      { size: 0, percentage: 0, repos: 0 }
    );

    if (otherTotal.size > 0) {
      chartData.push({
        name: 'Other',
        size: otherTotal.size,
        percentage: otherTotal.percentage,
        repositoryCount: otherTotal.repos,
      });
    }
  }

  const totalLanguages = data.length;
  const displayedLanguages = chartData.length;

  // Prepare chart config
  const chartConfig = chartData.reduce((config, lang, index) => {
    config[lang.name] = {
      label: lang.name,
      color: LANGUAGE_COLORS[index % LANGUAGE_COLORS.length],
    };
    return config;
  }, {} as Record<string, { label: string; color: string }>);

  const innerRadius = variant === 'donut' ? 60 : 0;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Language Distribution</h3>
          <p className="text-sm text-muted-foreground">
            {totalLanguages} language{totalLanguages !== 1 ? 's' : ''} across repositories
            {totalLanguages > maxLanguages && ` (showing top ${maxLanguages})`}
          </p>
        </div>
        <Code2 className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
      </div>

      {/* Chart */}
      <ChartContainer config={chartConfig} className="h-[300px] w-full">
        <PieChart>
          <Pie
            data={chartData}
            dataKey="percentage"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={innerRadius}
            outerRadius={80}
            paddingAngle={2}
            label={({ name, percentage }) => `${name} ${percentage.toFixed(1)}%`}
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${entry.name}`}
                fill={LANGUAGE_COLORS[index % LANGUAGE_COLORS.length]}
              />
            ))}
          </Pie>
          <ChartTooltip
            content={({ active, payload }) => {
              if (!active || !payload || payload.length === 0) return null;

              const data = payload[0].payload as LanguageStats;
              return (
                <div className="rounded-lg border bg-background p-2 shadow-sm">
                  <div className="flex flex-col gap-1">
                    <span className="font-semibold">{data.name}</span>
                    <span className="text-sm text-muted-foreground">
                      {data.percentage.toFixed(2)}% • {formatBytes(data.size)}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {data.repositoryCount} repositor{data.repositoryCount !== 1 ? 'ies' : 'y'}
                    </span>
                  </div>
                </div>
              );
            }}
          />
          {showLegend && (
            <Legend
              verticalAlign="bottom"
              height={36}
              formatter={(value) => {
                const lang = chartData.find((d) => d.name === value);
                return `${value} (${lang?.percentage.toFixed(1)}%)`;
              }}
            />
          )}
        </PieChart>
      </ChartContainer>

      {/* Language list */}
      <div className="grid gap-2 text-sm">
        {chartData.map((lang, index) => (
          <div
            key={lang.name}
            className="flex items-center justify-between rounded-md border p-2"
          >
            <div className="flex items-center gap-2">
              <div
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: LANGUAGE_COLORS[index % LANGUAGE_COLORS.length] }}
                aria-hidden="true"
              />
              <span className="font-medium">{lang.name}</span>
            </div>
            <div className="flex gap-4 text-muted-foreground">
              <span>{lang.percentage.toFixed(1)}%</span>
              <span>{formatBytes(lang.size)}</span>
              <span>
                {lang.repositoryCount} repo{lang.repositoryCount !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Other languages note */}
      {otherLanguages.length > 0 && (
        <p className="text-xs text-muted-foreground">
          * "Other" includes {otherLanguages.length} additional language
          {otherLanguages.length !== 1 ? 's' : ''}: {otherLanguages.map((l) => l.name).join(', ')}
        </p>
      )}
    </div>
  );
}
