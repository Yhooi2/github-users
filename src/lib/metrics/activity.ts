import type { YearData } from '@/hooks/useUserAnalytics';

/**
 * Activity metric result with detailed breakdown
 *
 * Scoring algorithm (0-100 points):
 * - Recent commits (40 pts): Last 3 months commit volume
 * - Consistency (30 pts): Active months in last 12 months
 * - Diversity (30 pts): Number of unique repositories (8-15 = optimal)
 *
 * Labels:
 * - High (71-100): Very active developer
 * - Moderate (41-70): Regular activity
 * - Low (0-40): Limited activity
 */
export interface ActivityMetric {
  /** Overall score from 0-100 */
  score: number;
  /** Activity level based on score */
  level: 'High' | 'Moderate' | 'Low';
  /** Detailed breakdown by component */
  breakdown: {
    recentCommits: number;
    consistency: number;
    diversity: number;
  };
  /** Additional metadata */
  details: {
    last3MonthsCommits: number;
    activeMonths: number;
    uniqueRepos: number;
  };
}

/**
 * Calculates activity score for a GitHub user based on their timeline data
 *
 * @param timeline - Array of yearly contribution data from useUserAnalytics
 * @returns ActivityMetric with score, level, breakdown, and details
 *
 * @example
 * ```typescript
 * const activity = calculateActivityScore(timeline);
 * if (activity.level === 'High') {
 *   console.log('Very active developer:', activity.score);
 * }
 * ```
 */
export function calculateActivityScore(timeline: YearData[]): ActivityMetric {
  if (!timeline.length) {
    return {
      score: 0,
      level: 'Low',
      breakdown: { recentCommits: 0, consistency: 0, diversity: 0 },
      details: { last3MonthsCommits: 0, activeMonths: 0, uniqueRepos: 0 },
    };
  }

  const last3Months = getLastNMonths(timeline, 3);
  const last12Months = getLastNMonths(timeline, 12);

  // A. Recent commits (0-40 points)
  // Target: 200+ commits in recent period = 40 points
  const recentCommits = last3Months.reduce((sum, d) => sum + d.totalCommits, 0);
  const recentPoints = Math.min((recentCommits / 200) * 40, 40);

  // B. Consistency (0-30 points)
  // Target: Active in all available years within last 12 months = 30 points
  // Since we're working with yearly data, we check how many of the last ~2 years are active
  const activeYears = countActiveMonths(last12Months);
  const totalYears = last12Months.length || 1; // Avoid division by zero
  const consistencyPoints = Math.min((activeYears / totalYears) * 30, 30);

  // C. Diversity (0-30 points)
  // Optimal: 8-15 unique repos = 30 points
  const uniqueRepos = countUniqueRepos(last3Months);
  let diversityPoints = 0;
  if (uniqueRepos >= 1 && uniqueRepos <= 3) diversityPoints = 10;
  else if (uniqueRepos >= 4 && uniqueRepos <= 7) diversityPoints = 20;
  else if (uniqueRepos >= 8 && uniqueRepos <= 15) diversityPoints = 30;
  else if (uniqueRepos > 15) diversityPoints = 25; // too scattered

  const score = Math.round(recentPoints + consistencyPoints + diversityPoints);

  return {
    score,
    level: getActivityLabel(score),
    breakdown: {
      recentCommits: Math.round(recentPoints),
      consistency: Math.round(consistencyPoints),
      diversity: Math.round(diversityPoints),
    },
    details: {
      last3MonthsCommits: recentCommits,
      activeMonths: activeYears, // Number of years with activity
      uniqueRepos,
    },
  };
}

/**
 * Get data for last N months from timeline
 * Note: Since timeline is yearly, we approximate by treating recent years
 * @internal
 */
function getLastNMonths(timeline: YearData[], months: number): YearData[] {
  if (timeline.length === 0) return [];

  // For 3 months: include current year only
  // For 12 months: include current year + potentially last year
  const yearsToInclude = months <= 3 ? 1 : months <= 12 ? 2 : Math.ceil(months / 12);

  return timeline
    .sort((a, b) => b.year - a.year) // newest first
    .slice(0, yearsToInclude);
}

/**
 * Count active years (we have yearly data, so we count years as "month equivalents")
 * Since each year in the dataset represents a distinct year of activity,
 * we treat each year with commits as 1 unit for scoring purposes
 * @internal
 */
function countActiveMonths(data: YearData[]): number {
  // Count number of years with at least one commit
  return data.filter((d) => d.totalCommits > 0).length;
}

/**
 * Count unique repositories across all data
 * @internal
 */
function countUniqueRepos(data: YearData[]): number {
  const repos = new Set<string>();
  data.forEach((year) => {
    year.ownedRepos.forEach((r) => repos.add(r.repository.url));
    year.contributions.forEach((r) => repos.add(r.repository.url));
  });
  return repos.size;
}

/**
 * Get activity level label based on score
 *
 * @param score - Activity score (0-100)
 * @returns Activity level label
 */
export function getActivityLabel(score: number): ActivityMetric['level'] {
  if (score >= 71) return 'High';
  if (score >= 41) return 'Moderate';
  return 'Low';
}
