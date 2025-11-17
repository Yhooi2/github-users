import type { Repository } from '@/apollo/github-api.types';
import type { AuthenticityScore } from '@/types/metrics';

/**
 * Calculates authenticity score for a GitHub user based on their repositories
 *
 * Scoring algorithm (0-100 points):
 * - Originality (25 pts): Original vs forked repositories ratio
 * - Activity (25 pts): Recent pushes and commit frequency
 * - Engagement (25 pts): Stars, forks, watchers across projects
 * - Code Ownership (25 pts): Language diversity and commit contributions
 *
 * Categories:
 * - High (80-100): Genuine active developer
 * - Medium (60-79): Moderate activity, some concerns
 * - Low (40-59): Limited original work
 * - Suspicious (0-39): Likely fake/inactive profile
 *
 * @param repositories - Array of user's repositories from GitHub GraphQL API
 * @returns AuthenticityScore with score, category, breakdown, and flags
 *
 * @example
 * ```typescript
 * const score = calculateAuthenticityScore(user.repositories.nodes);
 * if (score.category === 'Suspicious') {
 *   console.warn('Potential fake profile:', score.flags);
 * }
 * ```
 */
export function calculateAuthenticityScore(repositories: Repository[]): AuthenticityScore {
  if (repositories.length === 0) {
    return {
      score: 0,
      category: 'Suspicious',
      breakdown: {
        originalityScore: 0,
        activityScore: 0,
        engagementScore: 0,
        codeOwnershipScore: 0,
      },
      flags: ['No repositories found'],
      metadata: {
        totalRepos: 0,
        originalRepos: 0,
        forkedRepos: 0,
        archivedRepos: 0,
        templateRepos: 0,
      },
    };
  }

  const flags: string[] = [];
  const now = new Date();

  // Calculate metadata
  const totalRepos = repositories.length;
  const originalRepos = repositories.filter((r) => !r.isFork && !r.isTemplate).length;
  const forkedRepos = repositories.filter((r) => r.isFork).length;
  const archivedRepos = repositories.filter((r) => r.isArchived).length;
  const templateRepos = repositories.filter((r) => r.isTemplate).length;

  // 1. ORIGINALITY SCORE (25 points)
  // Measures the ratio of original work vs forked/cloned projects
  const originalRatio = totalRepos > 0 ? originalRepos / totalRepos : 0;
  const originalityScore = originalRatio * 25;

  if (originalRatio <= 0.35) {
    flags.push('Less than 30% original repositories');
  }
  if (forkedRepos > originalRepos * 2) {
    flags.push('Significantly more forks than original repos');
  }

  // 2. ACTIVITY SCORE (25 points)
  // Measures recent activity and commit frequency
  let activityScore = 0;
  let recentlyActiverepos = 0;
  let totalCommits = 0;

  repositories.forEach((repo) => {
    // Count commits
    const commits = repo.defaultBranchRef?.target?.history?.totalCount || 0;
    totalCommits += commits;

    // Check recent activity (last 90 days)
    if (repo.pushedAt) {
      const daysSinceLastPush = (now.getTime() - new Date(repo.pushedAt).getTime()) / (1000 * 60 * 60 * 24);
      if (daysSinceLastPush <= 90) {
        recentlyActiverepos++;
      }
    }
  });

  const recentActivityRatio = totalRepos > 0 ? recentlyActiverepos / totalRepos : 0;
  const avgCommitsPerRepo = totalRepos > 0 ? totalCommits / totalRepos : 0;

  // Activity score: 12.5 pts for recent activity + 12.5 pts for commit volume
  activityScore += recentActivityRatio * 12.5;
  activityScore += Math.min((avgCommitsPerRepo / 50) * 12.5, 12.5); // Cap at 12.5

  if (recentActivityRatio < 0.2) {
    flags.push('Less than 20% repos active in last 90 days');
  }
  if (avgCommitsPerRepo < 5) {
    flags.push('Low average commits per repository');
  }

  // 3. ENGAGEMENT SCORE (25 points)
  // Measures community engagement through stars, forks, watchers
  let totalStars = 0;
  let totalForks = 0;
  let totalWatchers = 0;

  repositories.forEach((repo) => {
    totalStars += repo.stargazerCount || 0;
    totalForks += repo.forkCount || 0;
    totalWatchers += repo.watchers?.totalCount || 0;
  });

  // Use logarithmic scale for fairness (popular repos get diminishing returns)
  // Max score reached at ~1000 stars/forks/watchers
  const starScore = Math.min(Math.log10(totalStars + 1) * 2.78, 8.33); // Max 8.33 pts at ~1000 stars
  const forkScore = Math.min(Math.log10(totalForks + 1) * 2.78, 8.33); // Max 8.33 pts at ~1000 forks
  const watcherScore = Math.min(Math.log10(totalWatchers + 1) * 2.78, 8.34); // Max 8.34 pts at ~1000 watchers

  const engagementScore = starScore + forkScore + watcherScore;

  if (totalStars === 0 && totalRepos > 5) {
    flags.push('No stars across all repositories');
  }

  // 4. CODE OWNERSHIP SCORE (25 points)
  // Measures language diversity and code size
  const languageSet = new Set<string>();
  let totalCodeSize = 0;

  repositories.forEach((repo) => {
    if (repo.primaryLanguage?.name) {
      languageSet.add(repo.primaryLanguage.name);
    }
    repo.languages.edges.forEach((edge) => {
      if (edge.node.name) {
        languageSet.add(edge.node.name);
      }
    });
    totalCodeSize += repo.languages.totalSize || 0;
  });

  const languageCount = languageSet.size;
  const avgRepoSize = totalRepos > 0 ? totalCodeSize / totalRepos : 0;

  // Code ownership: 12.5 pts for language diversity + 12.5 pts for code size
  const languageDiversityScore = Math.min((languageCount / 5) * 12.5, 12.5); // Max at 5+ languages
  const codeSizeScore = Math.min((avgRepoSize / 500000) * 12.5, 12.5); // Max at 500KB avg

  const codeOwnershipScore = languageDiversityScore + codeSizeScore;

  if (languageCount < 2) {
    flags.push('Limited language diversity (less than 2 languages)');
  }

  // CALCULATE FINAL SCORE
  const totalScore = Math.round(
    originalityScore + activityScore + engagementScore + codeOwnershipScore
  );

  // Determine category
  let category: AuthenticityScore['category'];
  if (totalScore >= 80) {
    category = 'High';
  } else if (totalScore >= 60) {
    category = 'Medium';
  } else if (totalScore >= 40) {
    category = 'Low';
  } else {
    category = 'Suspicious';
  }

  // Additional suspicious patterns
  if (archivedRepos > totalRepos * 0.5) {
    flags.push('More than 50% repos are archived');
  }
  if (totalRepos > 20 && originalRepos === 0) {
    flags.push('No original repositories despite having many repos');
  }

  return {
    score: totalScore,
    category,
    breakdown: {
      originalityScore: Math.round(originalityScore * 10) / 10,
      activityScore: Math.round(activityScore * 10) / 10,
      engagementScore: Math.round(engagementScore * 10) / 10,
      codeOwnershipScore: Math.round(codeOwnershipScore * 10) / 10,
    },
    flags,
    metadata: {
      totalRepos,
      originalRepos,
      forkedRepos,
      archivedRepos,
      templateRepos,
    },
  };
}

/**
 * Helper function to get authenticity category color for UI
 * @param category - Authenticity category
 * @returns Tailwind color class
 */
export function getAuthenticityColor(category: AuthenticityScore['category']): string {
  const colors = {
    High: 'text-green-600 dark:text-green-400',
    Medium: 'text-yellow-600 dark:text-yellow-400',
    Low: 'text-orange-600 dark:text-orange-400',
    Suspicious: 'text-red-600 dark:text-red-400',
  };
  return colors[category];
}

/**
 * Helper function to get authenticity badge text
 * @param category - Authenticity category
 * @returns User-friendly badge text
 */
export function getAuthenticityBadgeText(category: AuthenticityScore['category']): string {
  const texts = {
    High: 'Highly Authentic',
    Medium: 'Moderately Authentic',
    Low: 'Limited Activity',
    Suspicious: 'Suspicious Activity',
  };
  return texts[category];
}
