import type { YearData } from "@/hooks/useUserAnalytics";

/**
 * Collaboration metric result with detailed breakdown
 *
 * Scoring algorithm (0-100 points):
 * - Contribution ratio (50 pts): Contributions to others' repos vs own repos
 * - Diversity (30 pts): Number of different projects contributed to
 * - Engagement (20 pts): Quality of contributions (PRs, commits per repo)
 *
 * Labels:
 * - Excellent (81-100): Strong team player, many external contributions
 * - High (61-80): Good collaborator
 * - Moderate (41-60): Some collaboration
 * - Low (0-40): Primarily solo work
 */
export interface CollaborationMetric {
  /** Overall score from 0-100 */
  score: number;
  /** Collaboration level based on score */
  level: "Excellent" | "High" | "Moderate" | "Low";
  /** Detailed breakdown by component */
  breakdown: {
    contributionRatio: number;
    diversity: number;
    engagement: number;
  };
  /** Additional metadata */
  details: {
    ownedReposCount: number;
    contributedReposCount: number;
    contributionPercentage: number;
    uniqueOrgsContributed: number;
  };
}

/**
 * Calculates collaboration score for a GitHub user based on their timeline data
 *
 * Measures how much a developer contributes to others' projects vs their own.
 * High collaboration indicates team player mentality and open source involvement.
 *
 * @param timeline - Array of yearly contribution data from useUserAnalytics
 * @returns CollaborationMetric with score, level, breakdown, and details
 *
 * @example
 * ```typescript
 * const collaboration = calculateCollaborationScore(timeline);
 * if (collaboration.level === 'Excellent') {
 *   console.log('Strong collaborator:', collaboration.score);
 * }
 * ```
 */
export function calculateCollaborationScore(
  timeline: YearData[]
): CollaborationMetric {
  if (!timeline.length) {
    return {
      score: 0,
      level: "Low",
      breakdown: { contributionRatio: 0, diversity: 0, engagement: 0 },
      details: {
        ownedReposCount: 0,
        contributedReposCount: 0,
        contributionPercentage: 0,
        uniqueOrgsContributed: 0,
      },
    };
  }

  // Collect all repos across timeline
  const ownedRepos = new Set<string>();
  const contributedRepos = new Set<string>();
  const uniqueOrgs = new Set<string>();
  let totalContributionCommits = 0;
  let totalOwnedCommits = 0;

  timeline.forEach((year) => {
    // Owned repos
    year.ownedRepos.forEach((r) => {
      ownedRepos.add(r.repository.url);
      totalOwnedCommits += r.contributions.totalCount;
    });

    // Contributed repos (others' repos)
    year.contributions.forEach((r) => {
      contributedRepos.add(r.repository.url);
      totalContributionCommits += r.contributions.totalCount;

      // Extract org from URL: https://github.com/org/repo
      const urlParts = r.repository.url.split("/");
      if (urlParts.length >= 4) {
        const org = urlParts[3];
        uniqueOrgs.add(org);
      }
    });
  });

  const ownedCount = ownedRepos.size;
  const contributedCount = contributedRepos.size;
  const totalRepos = ownedCount + contributedCount;

  // A. Contribution ratio (0-50 points)
  // What percentage of activity is on others' repos?
  const contributionPercentage =
    totalRepos > 0 ? (contributedCount / totalRepos) * 100 : 0;
  // 50%+ contributions = 50 points (balanced or collaborative)
  // 0% = 0 points (only own repos)
  const ratioPoints = Math.min(contributionPercentage, 50);

  // B. Diversity (0-30 points)
  // How many different projects contributed to?
  // 10+ different repos = 30 points
  const diversityPoints = Math.min((contributedCount / 10) * 30, 30);

  // C. Engagement (0-20 points)
  // Based on commits per contributed repo (quality of contributions)
  const avgCommitsPerContribution =
    contributedCount > 0 ? totalContributionCommits / contributedCount : 0;
  // 5+ commits per repo = 20 points (meaningful contributions)
  const engagementPoints = Math.min((avgCommitsPerContribution / 5) * 20, 20);

  const score = Math.round(ratioPoints + diversityPoints + engagementPoints);

  return {
    score: Math.min(score, 100),
    level: getCollaborationLabel(score),
    breakdown: {
      contributionRatio: Math.round(ratioPoints),
      diversity: Math.round(diversityPoints),
      engagement: Math.round(engagementPoints),
    },
    details: {
      ownedReposCount: ownedCount,
      contributedReposCount: contributedCount,
      contributionPercentage: Math.round(contributionPercentage),
      uniqueOrgsContributed: uniqueOrgs.size,
    },
  };
}

/**
 * Get collaboration level label based on score
 *
 * @param score - Collaboration score (0-100)
 * @returns Collaboration level label
 */
export function getCollaborationLabel(
  score: number
): CollaborationMetric["level"] {
  if (score >= 81) return "Excellent";
  if (score >= 61) return "High";
  if (score >= 41) return "Moderate";
  return "Low";
}
