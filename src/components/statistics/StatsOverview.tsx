import { lazy, Suspense } from 'react';
import type { YearlyCommitStats, LanguageStats, CommitActivity } from '@/lib/statistics';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { BarChart3, Code2, Activity, TrendingUp } from 'lucide-react';

// Lazy load chart components to reduce initial bundle size
const CommitChart = lazy(() => import('./CommitChart').then(m => ({ default: m.CommitChart })));
const LanguageChart = lazy(() => import('./LanguageChart').then(m => ({ default: m.LanguageChart })));
const ActivityChart = lazy(() => import('./ActivityChart').then(m => ({ default: m.ActivityChart })));

// Loading fallback for lazy-loaded charts
function ChartLoadingFallback() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-[300px] w-full" />
      <div className="flex gap-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-24" />
      </div>
    </div>
  );
}

type Props = {
  /**
   * Yearly commit statistics
   */
  yearlyCommits?: YearlyCommitStats[] | null;
  /**
   * Language statistics
   */
  languages?: LanguageStats[] | null;
  /**
   * Commit activity statistics
   */
  activity?: CommitActivity | null;
  /**
   * Loading state for all statistics
   * @default false
   */
  loading?: boolean;
  /**
   * Error state for all statistics
   */
  error?: Error | null;
  /**
   * Default active tab
   * @default 'commits'
   */
  defaultTab?: 'commits' | 'languages' | 'activity' | 'overview';
  /**
   * Show overview tab with all stats
   * @default true
   */
  showOverview?: boolean;
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
};

/**
 * StatsOverview - Container component for all statistics
 *
 * Displays comprehensive GitHub statistics including:
 * - Yearly commit trends
 * - Programming language distribution
 * - Commit activity rates
 * - Combined overview with all stats
 *
 * Features:
 * - Tabbed interface for different views
 * - Loading and error state handling
 * - Responsive grid layout
 * - Individual chart customization
 *
 * @example
 * ```tsx
 * const yearlyStats = calculateYearlyCommitStats(yearlyData);
 * const langStats = calculateLanguageStatistics(repositories);
 * const activity = calculateCommitActivity(totalCommits, periodDays);
 *
 * <StatsOverview
 *   yearlyCommits={yearlyStats}
 *   languages={langStats}
 *   activity={activity}
 *   defaultTab="overview"
 * />
 * ```
 */
export function StatsOverview({
  yearlyCommits = null,
  languages = null,
  activity = null,
  loading = false,
  error = null,
  defaultTab = 'commits',
  showOverview = true,
  loadingMessage,
  errorTitle,
  errorDescription,
}: Props) {
  return (
    <Tabs defaultValue={defaultTab} className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        {showOverview && (
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            <span className="hidden sm:inline">Overview</span>
          </TabsTrigger>
        )}
        <TabsTrigger value="commits" className="flex items-center gap-2">
          <BarChart3 className="h-4 w-4" />
          <span className="hidden sm:inline">Commits</span>
        </TabsTrigger>
        <TabsTrigger value="languages" className="flex items-center gap-2">
          <Code2 className="h-4 w-4" />
          <span className="hidden sm:inline">Languages</span>
        </TabsTrigger>
        <TabsTrigger value="activity" className="flex items-center gap-2">
          <Activity className="h-4 w-4" />
          <span className="hidden sm:inline">Activity</span>
        </TabsTrigger>
      </TabsList>

      {/* Overview Tab - All Stats Together */}
      {showOverview && (
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Commit Trends
                </CardTitle>
                <CardDescription>Yearly commit contributions</CardDescription>
              </CardHeader>
              <CardContent>
                <Suspense fallback={<ChartLoadingFallback />}>
                  <CommitChart
                    data={yearlyCommits || []}
                    loading={loading}
                    error={error}
                    loadingMessage={loadingMessage}
                    errorTitle={errorTitle}
                    errorDescription={errorDescription}
                    variant="line"
                    showTrend={true}
                  />
                </Suspense>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Commit Activity
                </CardTitle>
                <CardDescription>Average commits per period</CardDescription>
              </CardHeader>
              <CardContent>
                <Suspense fallback={<ChartLoadingFallback />}>
                  <ActivityChart
                    data={activity}
                    loading={loading}
                    error={error}
                    loadingMessage={loadingMessage}
                    errorTitle={errorTitle}
                    errorDescription={errorDescription}
                    showTotal={true}
                  />
                </Suspense>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code2 className="h-5 w-5" />
                Language Distribution
              </CardTitle>
              <CardDescription>Programming languages used across repositories</CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<ChartLoadingFallback />}>
                <LanguageChart
                  data={languages || []}
                  loading={loading}
                  error={error}
                  loadingMessage={loadingMessage}
                  errorTitle={errorTitle}
                  errorDescription={errorDescription}
                  variant="pie"
                  maxLanguages={5}
                  showLegend={true}
                />
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>
      )}

      {/* Commits Tab */}
      <TabsContent value="commits">
        <Card>
          <CardHeader>
            <CardTitle>Commit Trends</CardTitle>
            <CardDescription>Yearly commit contributions over time</CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<ChartLoadingFallback />}>
              <CommitChart
                data={yearlyCommits || []}
                loading={loading}
                error={error}
                loadingMessage={loadingMessage}
                errorTitle={errorTitle}
                errorDescription={errorDescription}
                variant="line"
                showTrend={true}
              />
            </Suspense>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Languages Tab */}
      <TabsContent value="languages">
        <Card>
          <CardHeader>
            <CardTitle>Language Distribution</CardTitle>
            <CardDescription>Programming languages used across repositories</CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<ChartLoadingFallback />}>
              <LanguageChart
                data={languages || []}
                loading={loading}
                error={error}
                loadingMessage={loadingMessage}
                errorTitle={errorTitle}
                errorDescription={errorDescription}
                variant="donut"
                maxLanguages={8}
                showLegend={true}
              />
            </Suspense>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Activity Tab */}
      <TabsContent value="activity">
        <Card>
          <CardHeader>
            <CardTitle>Commit Activity</CardTitle>
            <CardDescription>Average commits per time period</CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<ChartLoadingFallback />}>
              <ActivityChart
                data={activity}
                loading={loading}
                error={error}
                loadingMessage={loadingMessage}
                errorTitle={errorTitle}
                errorDescription={errorDescription}
                showTotal={true}
              />
            </Suspense>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
