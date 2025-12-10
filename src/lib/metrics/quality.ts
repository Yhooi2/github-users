import type { YearData } from "@/hooks/useUserAnalytics";
import { getUniqueRepos } from "./shared";

/**
 * Quality metric result with detailed breakdown
 *
 * Scoring algorithm (0-100 points):
 * - Originality (30 pts): Non-fork ratio (owned repos that aren't forks / total owned repos)
 * - Documentation (25 pts): Presence of README/Wiki/Docs (check if repo has description)
 * - Ownership (20 pts): Owned repos vs contributed repos ratio
 * - Maturity (15 pts): Age of repos (years since creation)
 * - Stack (10 pts): Language diversity (unique languages)
 *
 * Labels:
 * - Excellent (81-100): High-quality developer profile
 * - Strong (61-80): Strong quality indicators
 * - Good (41-60): Good quality profile
 * - Fair (21-40): Fair quality indicators
 * - Weak (0-20): Limited quality indicators
 */
export interface QualityMetric {
  /** Overall score from 0-100 */
  score: number;
  /** Quality level based on score */
  level: "Excellent" | "Strong" | "Good" | "Fair" | "Weak";
  /** Detailed breakdown by component */
  breakdown: {
    originality: number;
    documentation: number;
    ownership: number;
    maturity: number;
    stack: number;
  };
  /** Additional metadata */
  details: {
    nonForkRepos: number;
    totalOwnedRepos: number;
    documentedRepos: number;
    ownedReposCount: number;
    contributedReposCount: number;
    avgRepoAge: number;
    uniqueLanguages: number;
  };
}

/**
 * Calculates quality score for a GitHub user based on their timeline data
 *
 * @param timeline - Array of yearly contribution data from useUserAnalytics
 * @returns QualityMetric with score, level, breakdown, and details
 *
 * @example
 * ```typescript
 * const quality = calculateQualityScore(timeline);
 * if (quality.level === 'Excellent') {
 *   console.log('High-quality developer profile:', quality.score);
 * }
 * ```
 */
export function calculateQualityScore(timeline: YearData[]): QualityMetric {
  if (!timeline.length) {
    return {
      score: 0,
      level: "Weak",
      breakdown: {
        originality: 0,
        documentation: 0,
        ownership: 0,
        maturity: 0,
        stack: 0,
      },
      details: {
        nonForkRepos: 0,
        totalOwnedRepos: 0,
        documentedRepos: 0,
        ownedReposCount: 0,
        contributedReposCount: 0,
        avgRepoAge: 0,
        uniqueLanguages: 0,
      },
    };
  }

  // Aggregate all unique repositories
  const allOwnedRepos = getUniqueRepos(timeline.flatMap((y) => y.ownedRepos));
  const allContributedRepos = getUniqueRepos(
    timeline.flatMap((y) => y.contributions),
  );

  // A. Originality (0-30 points)
  // Non-fork ratio: owned repos that aren't forks / total owned repos
  const nonForkRepos = allOwnedRepos.filter((r) => !r.repository.isFork).length;
  const totalOwnedRepos = allOwnedRepos.length;
  const originalityRatio =
    totalOwnedRepos > 0 ? nonForkRepos / totalOwnedRepos : 0;
  const originalityPoints = originalityRatio * 30;

  // B. Documentation (0-25 points)
  // Check if repos have descriptions (proxy for documentation)
  const documentedRepos = allOwnedRepos.filter(
    (r) =>
      r.repository.description && r.repository.description.trim().length > 0,
  ).length;
  const documentationRatio =
    totalOwnedRepos > 0 ? documentedRepos / totalOwnedRepos : 0;
  const documentationPoints = documentationRatio * 25;

  // C. Ownership (0-20 points)
  // Owned repos vs contributed repos ratio
  const totalRepos = totalOwnedRepos + allContributedRepos.length;
  const ownershipRatio = totalRepos > 0 ? totalOwnedRepos / totalRepos : 0;
  const ownershipPoints = ownershipRatio * 20;

  // D. Maturity (0-15 points)
  // Average age of repositories (years since creation)
  const avgRepoAge = calculateAverageRepoAge(allOwnedRepos);
  const maturityPoints = calculateMaturityPoints(avgRepoAge);

  // E. Stack (0-10 points)
  // Language diversity (unique languages across repos)
  const uniqueLanguages = countUniqueLanguages(allOwnedRepos);
  const stackPoints = calculateStackPoints(uniqueLanguages);

  const score = Math.round(
    originalityPoints +
      documentationPoints +
      ownershipPoints +
      maturityPoints +
      stackPoints,
  );

  return {
    score,
    level: getQualityLabel(score),
    breakdown: {
      originality: Math.round(originalityPoints),
      documentation: Math.round(documentationPoints),
      ownership: Math.round(ownershipPoints),
      maturity: Math.round(maturityPoints),
      stack: Math.round(stackPoints),
    },
    details: {
      nonForkRepos,
      totalOwnedRepos,
      documentedRepos,
      ownedReposCount: totalOwnedRepos,
      contributedReposCount: allContributedRepos.length,
      avgRepoAge,
      uniqueLanguages,
    },
  };
}

// getUniqueRepos imported from ./shared

/**
 * Calculate average repository age in years
 * @internal
 */
function calculateAverageRepoAge(
  repos: Array<{ repository: { createdAt: string } }>,
): number {
  if (repos.length === 0) return 0;

  const now = new Date();
  const totalAge = repos.reduce((sum, r) => {
    const created = new Date(r.repository.createdAt);
    const ageYears =
      (now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24 * 365);
    return sum + ageYears;
  }, 0);

  return totalAge / repos.length;
}

/**
 * Calculate maturity points based on average repo age
 * @internal
 */
function calculateMaturityPoints(avgAge: number): number {
  // 5+ years = 15 points
  // 3-5 years = 12 points
  // 2-3 years = 9 points
  // 1-2 years = 6 points
  // < 1 year = 3 points
  if (avgAge >= 5) return 15;
  if (avgAge >= 3) return 12;
  if (avgAge >= 2) return 9;
  if (avgAge >= 1) return 6;
  if (avgAge > 0) return 3;
  return 0;
}

/**
 * Count unique languages across repositories
 * @internal
 */
function countUniqueLanguages(
  repos: Array<{ repository: { primaryLanguage: { name: string } | null } }>,
): number {
  const languages = new Set<string>();

  repos.forEach((r) => {
    if (r.repository.primaryLanguage?.name) {
      languages.add(r.repository.primaryLanguage.name);
    }
  });

  return languages.size;
}

/**
 * Calculate stack points based on language diversity
 * @internal
 */
function calculateStackPoints(languageCount: number): number {
  // 10+ languages = 10 points
  // 7-9 languages = 8 points
  // 5-6 languages = 6 points
  // 3-4 languages = 4 points
  // 1-2 languages = 2 points
  if (languageCount >= 10) return 10;
  if (languageCount >= 7) return 8;
  if (languageCount >= 5) return 6;
  if (languageCount >= 3) return 4;
  if (languageCount >= 1) return 2;
  return 0;
}

/**
 * Get quality level label based on score
 *
 * @param score - Quality score (0-100)
 * @returns Quality level label
 */
export function getQualityLabel(score: number): QualityMetric["level"] {
  if (score >= 81) return "Excellent";
  if (score >= 61) return "Strong";
  if (score >= 41) return "Good";
  if (score >= 21) return "Fair";
  return "Weak";
}
