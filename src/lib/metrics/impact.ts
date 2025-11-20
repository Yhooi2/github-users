import type { YearData } from "@/hooks/useUserAnalytics";

/**
 * Impact metric result with detailed breakdown
 *
 * Scoring algorithm (0-100 points):
 * - Stars (35 pts): Total stars across all repos
 * - Forks (20 pts): Total forks
 * - Contributors (15 pts): Number of contributors attracted
 * - Reach (20 pts): Watchers + dependent repos
 * - Engagement (10 pts): Issue/PR interactions
 *
 * Labels:
 * - Exceptional (81-100): Highly influential
 * - Strong (61-80): Significant impact
 * - Moderate (41-60): Average impact
 * - Low (21-40): Limited impact
 * - Minimal (0-20): Very little impact
 */
export interface ImpactMetric {
  /** Overall score from 0-100 */
  score: number;
  /** Impact level based on score */
  level: "Exceptional" | "Strong" | "Moderate" | "Low" | "Minimal";
  /** Detailed breakdown by component */
  breakdown: {
    stars: number;
    forks: number;
    contributors: number;
    reach: number;
    engagement: number;
  };
  /** Additional metadata */
  details: {
    totalStars: number;
    totalForks: number;
    totalWatchers: number;
    totalPRs: number;
    totalIssues: number;
  };
}

/**
 * Calculates impact score for a GitHub user based on their timeline data
 *
 * @param timeline - Array of yearly contribution data from useUserAnalytics
 * @returns ImpactMetric with score, level, breakdown, and details
 *
 * @example
 * ```typescript
 * const impact = calculateImpactScore(timeline);
 * if (impact.level === 'Exceptional') {
 *   console.log('Highly influential developer:', impact.score);
 * }
 * ```
 */
export function calculateImpactScore(timeline: YearData[]): ImpactMetric {
  if (!timeline.length) {
    return {
      score: 0,
      level: "Minimal",
      breakdown: {
        stars: 0,
        forks: 0,
        contributors: 0,
        reach: 0,
        engagement: 0,
      },
      details: {
        totalStars: 0,
        totalForks: 0,
        totalWatchers: 0,
        totalPRs: 0,
        totalIssues: 0,
      },
    };
  }

  // Aggregate all repositories (both owned and contributed)
  const allRepos = timeline.flatMap((y) => [
    ...y.ownedRepos,
    ...y.contributions,
  ]);

  // A. Stars (0-35 points)
  const totalStars = allRepos.reduce(
    (sum, r) => sum + r.repository.stargazerCount,
    0,
  );
  const starPoints = calculateStarPoints(totalStars);

  // B. Forks (0-20 points)
  const totalForks = allRepos.reduce(
    (sum, r) => sum + r.repository.forkCount,
    0,
  );
  const forkPoints = calculateForkPoints(totalForks);

  // C. Contributors (0-15 points) - estimated from forks
  // More forks often indicates more contributors
  const contributorPoints = Math.min((totalForks / 100) * 15, 15);

  // D. Reach (0-20 points) - combined stars + forks
  // Note: watchers field not available in yearContributions query
  const totalWatchers = 0; // Would need to be fetched separately
  const reachPoints = Math.min(((totalStars + totalForks) / 500) * 20, 20);

  // E. Engagement (0-10 points) - PRs and Issues
  const totalPRs = timeline.reduce((sum, y) => sum + y.totalPRs, 0);
  const totalIssues = timeline.reduce((sum, y) => sum + y.totalIssues, 0);
  const engagementPoints = Math.min(((totalPRs + totalIssues) / 200) * 10, 10);

  const score = Math.round(
    starPoints +
      forkPoints +
      contributorPoints +
      reachPoints +
      engagementPoints,
  );

  return {
    score,
    level: getImpactLabel(score),
    breakdown: {
      stars: Math.round(starPoints),
      forks: Math.round(forkPoints),
      contributors: Math.round(contributorPoints),
      reach: Math.round(reachPoints),
      engagement: Math.round(engagementPoints),
    },
    details: {
      totalStars,
      totalForks,
      totalWatchers,
      totalPRs,
      totalIssues,
    },
  };
}

/**
 * Calculate star points using tiered scoring
 * @internal
 */
function calculateStarPoints(stars: number): number {
  if (stars >= 10000) return 35;
  if (stars >= 5000) return 30;
  if (stars >= 1000) return 25;
  if (stars >= 500) return 20;
  if (stars >= 100) return 15;
  if (stars >= 50) return 10;
  if (stars >= 10) return 5;
  return 0;
}

/**
 * Calculate fork points using tiered scoring
 * @internal
 */
function calculateForkPoints(forks: number): number {
  if (forks >= 1000) return 20;
  if (forks >= 500) return 16;
  if (forks >= 100) return 12;
  if (forks >= 50) return 8;
  if (forks >= 10) return 4;
  return 0;
}

/**
 * Get impact level label based on score
 *
 * @param score - Impact score (0-100)
 * @returns Impact level label
 */
export function getImpactLabel(score: number): ImpactMetric["level"] {
  if (score >= 81) return "Exceptional";
  if (score >= 61) return "Strong";
  if (score >= 41) return "Moderate";
  if (score >= 21) return "Low";
  return "Minimal";
}
