import type { YearData } from "@/hooks/useUserAnalytics";
import {
  calculateTotalForks,
  calculateTotalStars,
  clamp,
  extractLanguages,
} from "./shared";

/**
 * Growth metric result with detailed breakdown
 *
 * Scoring algorithm (-100 to +100 points):
 * - Activity growth (40%): YoY commits change
 * - Impact growth (30%): YoY stars/forks change
 * - Skills growth (30%): New languages adopted
 *
 * Labels:
 * - Rapid Growth (+51 to +100): Exceptional growth trajectory
 * - Growing (+21 to +50): Positive growth trend
 * - Stable (-20 to +20): Maintaining current level
 * - Declining (-50 to -21): Negative growth trend
 * - Rapid Decline (-100 to -51): Significant decline
 */
export interface GrowthMetric {
  /** Overall score from -100 to +100 */
  score: number;
  /** Growth level based on score */
  level: "Rapid Growth" | "Growing" | "Stable" | "Declining" | "Rapid Decline";
  /** Detailed breakdown by component (weighted) */
  breakdown: {
    activityGrowth: number;
    impactGrowth: number;
    skillsGrowth: number;
  };
  /** Additional metadata */
  details: {
    commitsYoYChange: number;
    starsYoYChange: number;
    forksYoYChange: number;
    newLanguages: number;
    previousYearCommits: number;
    currentYearCommits: number;
    previousYearStars: number;
    currentYearStars: number;
    previousYearForks: number;
    currentYearForks: number;
  };
}

/**
 * Calculates growth score for a GitHub user based on their timeline data
 *
 * @param timeline - Array of yearly contribution data from useUserAnalytics (must be sorted newest first)
 * @returns GrowthMetric with score, level, breakdown, and details
 *
 * @example
 * ```typescript
 * const growth = calculateGrowthScore(timeline);
 * if (growth.level === 'Rapid Growth') {
 *   console.log('Developer showing exceptional growth:', growth.score);
 * }
 * ```
 */
export function calculateGrowthScore(timeline: YearData[]): GrowthMetric {
  if (timeline.length < 2) {
    // Need at least 2 years to calculate growth
    return {
      score: 0,
      level: "Stable",
      breakdown: { activityGrowth: 0, impactGrowth: 0, skillsGrowth: 0 },
      details: {
        commitsYoYChange: 0,
        starsYoYChange: 0,
        forksYoYChange: 0,
        newLanguages: 0,
        previousYearCommits: 0,
        currentYearCommits: 0,
        previousYearStars: 0,
        currentYearStars: 0,
        previousYearForks: 0,
        currentYearForks: 0,
      },
    };
  }

  // Assume timeline is sorted newest first
  const currentYear = timeline[0];
  const previousYear = timeline[1];

  // A. Activity growth (40% of total score)
  // Calculate YoY change in commits
  const previousCommits = previousYear.totalCommits;
  const currentCommits = currentYear.totalCommits;
  const commitsYoYChange = calculatePercentageChange(
    previousCommits,
    currentCommits,
  );
  const activityGrowthScore = normalizeGrowth(commitsYoYChange) * 40;

  // B. Impact growth (30% of total score)
  // Calculate YoY change in stars and forks
  const previousStars = calculateTotalStars(previousYear);
  const currentStars = calculateTotalStars(currentYear);
  const starsYoYChange = calculatePercentageChange(previousStars, currentStars);

  const previousForks = calculateTotalForks(previousYear);
  const currentForks = calculateTotalForks(currentYear);
  const forksYoYChange = calculatePercentageChange(previousForks, currentForks);

  // Average stars and forks growth
  const impactYoYChange = (starsYoYChange + forksYoYChange) / 2;
  const impactGrowthScore = normalizeGrowth(impactYoYChange) * 30;

  // C. Skills growth (30% of total score)
  // Count new languages adopted in current year
  const previousLanguages = extractLanguages(previousYear);
  const currentLanguages = extractLanguages(currentYear);
  const newLanguages = countNewLanguages(previousLanguages, currentLanguages);
  const skillsGrowthScore = calculateSkillsGrowth(newLanguages) * 30;

  const score = Math.round(
    activityGrowthScore + impactGrowthScore + skillsGrowthScore,
  );

  return {
    score: clamp(score, -100, 100),
    level: getGrowthLabel(score),
    breakdown: {
      activityGrowth: Math.round(activityGrowthScore),
      impactGrowth: Math.round(impactGrowthScore),
      skillsGrowth: Math.round(skillsGrowthScore),
    },
    details: {
      commitsYoYChange,
      starsYoYChange,
      forksYoYChange,
      newLanguages,
      previousYearCommits: previousCommits,
      currentYearCommits: currentCommits,
      previousYearStars: previousStars,
      currentYearStars: currentStars,
      previousYearForks: previousForks,
      currentYearForks: currentForks,
    },
  };
}

/**
 * Calculate percentage change between two values
 * @internal
 */
function calculatePercentageChange(previous: number, current: number): number {
  if (previous === 0 && current === 0) return 0;
  if (previous === 0) return 100; // New activity, max growth
  return ((current - previous) / previous) * 100;
}

/**
 * Normalize growth percentage to -1 to +1 scale
 * @internal
 */
function normalizeGrowth(percentageChange: number): number {
  // Cap at ±200% change for normalization
  // 200% growth = +1.0, -100% decline = -1.0
  if (percentageChange >= 200) return 1.0;
  if (percentageChange <= -100) return -1.0;
  if (percentageChange >= 0) {
    return percentageChange / 200; // 0-200% -> 0-1.0
  } else {
    return percentageChange / 100; // 0 to -100% -> 0 to -1.0
  }
}

// calculateTotalStars, calculateTotalForks, extractLanguages imported from ./shared

/**
 * Count new languages in current year that weren't in previous year
 * @internal
 */
function countNewLanguages(
  previousLanguages: Set<string>,
  currentLanguages: Set<string>,
): number {
  let count = 0;
  currentLanguages.forEach((lang) => {
    if (!previousLanguages.has(lang)) {
      count++;
    }
  });
  return count;
}

/**
 * Calculate skills growth score based on number of new languages
 * @internal
 */
function calculateSkillsGrowth(newLanguages: number): number {
  // 5+ new languages = 1.0 (exceptional)
  // 3-4 new languages = 0.6 (good)
  // 1-2 new languages = 0.3 (moderate)
  // 0 new languages = 0 (stable)
  if (newLanguages >= 5) return 1.0;
  if (newLanguages >= 3) return 0.6;
  if (newLanguages >= 1) return 0.3;
  return 0;
}

// clamp imported from ./shared

/**
 * Get growth level label based on score
 *
 * @param score - Growth score (-100 to +100)
 * @returns Growth level label
 */
export function getGrowthLabel(score: number): GrowthMetric["level"] {
  if (score >= 51) return "Rapid Growth";
  if (score >= 21) return "Growing";
  if (score >= -20) return "Stable";
  if (score >= -50) return "Declining";
  return "Rapid Decline";
}
