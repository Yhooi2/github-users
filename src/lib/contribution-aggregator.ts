/**
 * Contribution Aggregator
 *
 * Aggregates daily contribution data from GitHub's contributionCalendar
 * into monthly totals for mini activity charts.
 */

import type { ContributionCalendar } from "@/apollo/queries/yearContributions";

/**
 * Monthly contribution data aggregated from daily contributions
 */
export interface MonthlyContribution {
  /** Month number (1-12) */
  month: number;
  /** Short month name (Jan, Feb, etc.) */
  monthName: string;
  /** Total contributions for the month */
  contributions: number;
  /** Number of days with at least 1 contribution */
  daysActive: number;
  /** Maximum contributions in a single day */
  maxDaily: number;
}

const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

/**
 * Aggregate daily contributions into monthly totals
 *
 * @param calendar - ContributionCalendar from GraphQL
 * @returns Array of 12 monthly contributions (even if empty)
 *
 * @example
 * ```typescript
 * const monthly = aggregateByMonth(calendar);
 * // monthly[0] = January data
 * // monthly[11] = December data
 * ```
 */
export function aggregateByMonth(
  calendar: ContributionCalendar
): MonthlyContribution[] {
  // Initialize all 12 months
  const months: Map<number, MonthlyContribution> = new Map();

  for (let i = 1; i <= 12; i++) {
    months.set(i, {
      month: i,
      monthName: MONTH_NAMES[i - 1],
      contributions: 0,
      daysActive: 0,
      maxDaily: 0,
    });
  }

  // Aggregate from weeks/days
  for (const week of calendar.weeks) {
    for (const day of week.contributionDays) {
      const date = new Date(day.date);
      const monthNum = date.getMonth() + 1; // 1-12

      const monthData = months.get(monthNum);
      if (!monthData) continue;

      monthData.contributions += day.contributionCount;

      if (day.contributionCount > 0) {
        monthData.daysActive++;
      }

      if (day.contributionCount > monthData.maxDaily) {
        monthData.maxDaily = day.contributionCount;
      }
    }
  }

  return Array.from(months.values());
}

/**
 * Activity level for mini chart bars (0-4)
 * Based on GitHub's contribution color levels
 */
export type ActivityLevel = 0 | 1 | 2 | 3 | 4;

/**
 * Get activity level (0-4) for mini chart bars
 *
 * @param contributions - Contributions for this period
 * @param maxMonthly - Maximum contributions across all months
 * @returns Activity level from 0 (none) to 4 (highest)
 */
export function getActivityLevel(
  contributions: number,
  maxMonthly: number
): ActivityLevel {
  if (contributions === 0) return 0;
  if (maxMonthly === 0) return 0;

  const ratio = contributions / maxMonthly;

  if (ratio < 0.25) return 1;
  if (ratio < 0.5) return 2;
  if (ratio < 0.75) return 3;
  return 4;
}

/**
 * Mini chart data point
 */
export interface MiniChartDataPoint {
  /** Short month name */
  month: string;
  /** Activity level (0-4) */
  level: ActivityLevel;
  /** Raw contribution count */
  contributions: number;
}

/**
 * Generate mini chart data for YearCard
 *
 * @param monthlyData - Array of monthly contributions
 * @returns Array of 12 data points for chart rendering
 *
 * @example
 * ```tsx
 * const chartData = generateMiniChartData(monthlyData);
 * chartData.map(d => (
 *   <Bar key={d.month} level={d.level} />
 * ));
 * ```
 */
export function generateMiniChartData(
  monthlyData: MonthlyContribution[]
): MiniChartDataPoint[] {
  const maxMonthly = Math.max(...monthlyData.map((m) => m.contributions), 1);

  return monthlyData.map((m) => ({
    month: m.monthName,
    level: getActivityLevel(m.contributions, maxMonthly),
    contributions: m.contributions,
  }));
}

/**
 * Get the most active month from monthly data
 *
 * @param monthlyData - Array of monthly contributions
 * @returns Most active month or null if no activity
 */
export function getMostActiveMonth(
  monthlyData: MonthlyContribution[]
): MonthlyContribution | null {
  if (monthlyData.length === 0) return null;

  return monthlyData.reduce((max, current) =>
    current.contributions > max.contributions ? current : max
  );
}

/**
 * Calculate total contributions from monthly data
 *
 * @param monthlyData - Array of monthly contributions
 * @returns Total contributions across all months
 */
export function getTotalFromMonthly(
  monthlyData: MonthlyContribution[]
): number {
  return monthlyData.reduce((sum, m) => sum + m.contributions, 0);
}
