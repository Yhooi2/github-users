import type { YearData } from "@/hooks/useUserAnalytics";

/**
 * Consistency metric result with detailed breakdown
 *
 * Scoring algorithm (0-100 points):
 * - Regularity (50 pts): How evenly distributed are commits across years
 * - Streak (30 pts): Consecutive years with activity
 * - Recency (20 pts): Activity in recent years
 *
 * Labels:
 * - Excellent (81-100): Very consistent, regular activity
 * - High (61-80): Good consistency
 * - Moderate (41-60): Some consistency
 * - Low (0-40): Inconsistent or sporadic activity
 */
export interface ConsistencyMetric {
  /** Overall score from 0-100 */
  score: number;
  /** Consistency level based on score */
  level: "Excellent" | "High" | "Moderate" | "Low";
  /** Detailed breakdown by component */
  breakdown: {
    regularity: number;
    streak: number;
    recency: number;
  };
  /** Additional metadata */
  details: {
    activeYears: number;
    totalYears: number;
    longestStreak: number;
    coefficientOfVariation: number;
  };
}

/**
 * Calculates consistency score for a GitHub user based on their timeline data
 *
 * Measures how regularly and evenly a developer contributes over time.
 * High consistency indicates disciplined, professional work habits.
 *
 * @param timeline - Array of yearly contribution data from useUserAnalytics
 * @returns ConsistencyMetric with score, level, breakdown, and details
 *
 * @example
 * ```typescript
 * const consistency = calculateConsistencyScore(timeline);
 * if (consistency.level === 'Excellent') {
 *   console.log('Very consistent developer:', consistency.score);
 * }
 * ```
 */
export function calculateConsistencyScore(
  timeline: YearData[]
): ConsistencyMetric {
  if (!timeline.length) {
    return {
      score: 0,
      level: "Low",
      breakdown: { regularity: 0, streak: 0, recency: 0 },
      details: {
        activeYears: 0,
        totalYears: 0,
        longestStreak: 0,
        coefficientOfVariation: 0,
      },
    };
  }

  // Sort by year (oldest first for streak calculation)
  const sortedTimeline = [...timeline].sort((a, b) => a.year - b.year);
  const commits = sortedTimeline.map((y) => y.totalCommits);
  const totalYears = sortedTimeline.length;
  const activeYears = commits.filter((c) => c > 0).length;

  // A. Regularity (0-50 points)
  // Based on coefficient of variation (lower = more consistent)
  const cv = calculateCoefficientOfVariation(commits);
  // CV of 0 = perfect consistency = 50 points
  // CV of 2+ = very inconsistent = 0 points
  const regularityPoints = Math.max(0, 50 - cv * 25);

  // B. Streak (0-30 points)
  // Longest consecutive years with activity
  const longestStreak = calculateLongestStreak(commits);
  // 5+ years streak = 30 points
  const streakPoints = Math.min((longestStreak / 5) * 30, 30);

  // C. Recency (0-20 points)
  // Activity in recent years (last 2 years)
  const recentYears = sortedTimeline.slice(-2);
  const recentActive = recentYears.filter((y) => y.totalCommits > 0).length;
  const recencyPoints = (recentActive / 2) * 20;

  const score = Math.round(regularityPoints + streakPoints + recencyPoints);

  return {
    score: Math.min(score, 100),
    level: getConsistencyLabel(score),
    breakdown: {
      regularity: Math.round(regularityPoints),
      streak: Math.round(streakPoints),
      recency: Math.round(recencyPoints),
    },
    details: {
      activeYears,
      totalYears,
      longestStreak,
      coefficientOfVariation: Math.round(cv * 100) / 100,
    },
  };
}

/**
 * Calculate coefficient of variation (standard deviation / mean)
 * Lower values indicate more consistent distribution
 * @internal
 */
function calculateCoefficientOfVariation(values: number[]): number {
  if (values.length === 0) return 0;

  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  if (mean === 0) return 0;

  const variance =
    values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) /
    values.length;
  const stdDev = Math.sqrt(variance);

  return stdDev / mean;
}

/**
 * Calculate longest streak of consecutive years with activity
 * @internal
 */
function calculateLongestStreak(commits: number[]): number {
  let maxStreak = 0;
  let currentStreak = 0;

  for (const count of commits) {
    if (count > 0) {
      currentStreak++;
      maxStreak = Math.max(maxStreak, currentStreak);
    } else {
      currentStreak = 0;
    }
  }

  return maxStreak;
}

/**
 * Get consistency level label based on score
 *
 * @param score - Consistency score (0-100)
 * @returns Consistency level label
 */
export function getConsistencyLabel(score: number): ConsistencyMetric["level"] {
  if (score >= 81) return "Excellent";
  if (score >= 61) return "High";
  if (score >= 41) return "Moderate";
  return "Low";
}
