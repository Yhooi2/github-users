import type {
  Repository,
  RepositoryContributions,
  ContributionsCollection,
  YearlyContributions,
} from '@/apollo/github-api.types';

/**
 * Commit statistics by repository
 */
export type RepositoryCommitStats = {
  repositoryName: string;
  totalCommits: number;
  userCommits: number;
  percentage: number;
};

/**
 * Language statistics with usage percentage
 */
export type LanguageStats = {
  name: string;
  size: number;
  percentage: number;
  repositoryCount: number;
};

/**
 * Yearly commit statistics
 */
export type YearlyCommitStats = {
  year: number;
  commits: number;
};

/**
 * Commit activity by time period
 */
export type CommitActivity = {
  total: number;
  perDay: number;
  perWeek: number;
  perMonth: number;
};

/**
 * Calculates commit statistics per repository
 *
 * @param contributionsByRepo - Array of repository contributions from GraphQL
 * @returns Array of commit statistics sorted by user commits (descending)
 *
 * @example
 * ```typescript
 * const stats = calculateCommitsByRepository(
 *   user.contributionsCollection.commitContributionsByRepository
 * );
 * // Returns: [{ repositoryName: 'my-app', userCommits: 150, ... }, ...]
 * ```
 */
export function calculateCommitsByRepository(
  contributionsByRepo: RepositoryContributions[]
): RepositoryCommitStats[] {
  if (!contributionsByRepo || contributionsByRepo.length === 0) {
    return [];
  }

  const stats: RepositoryCommitStats[] = contributionsByRepo.map((contrib) => {
    const userCommits = contrib.contributions.totalCount;
    const repoName = contrib.repository.name;

    return {
      repositoryName: repoName,
      totalCommits: userCommits, // In this context, total = user commits
      userCommits: userCommits,
      percentage: 100, // User's own repos = 100% their commits
    };
  });

  // Sort by user commits (descending)
  return stats.sort((a, b) => b.userCommits - a.userCommits);
}

/**
 * Calculates language usage statistics across repositories
 *
 * @param repositories - Array of repositories
 * @returns Array of language statistics sorted by size (descending)
 *
 * @example
 * ```typescript
 * const langStats = calculateLanguageStatistics(repos);
 * // Returns: [{ name: 'TypeScript', size: 500000, percentage: 45.5, ... }, ...]
 * ```
 */
export function calculateLanguageStatistics(repositories: Repository[]): LanguageStats[] {
  if (!repositories || repositories.length === 0) {
    return [];
  }

  // Collect all language usage data
  const languageMap = new Map<
    string,
    { size: number; repositories: Set<string> }
  >();

  let totalSize = 0;

  repositories.forEach((repo) => {
    repo.languages.edges.forEach((edge) => {
      const langName = edge.node.name;
      const langSize = edge.size;

      if (!languageMap.has(langName)) {
        languageMap.set(langName, { size: 0, repositories: new Set() });
      }

      const langData = languageMap.get(langName)!;
      langData.size += langSize;
      langData.repositories.add(repo.id);

      totalSize += langSize;
    });
  });

  // Convert to array and calculate percentages
  const stats: LanguageStats[] = [];

  languageMap.forEach((data, name) => {
    stats.push({
      name,
      size: data.size,
      percentage: totalSize > 0 ? (data.size / totalSize) * 100 : 0,
      repositoryCount: data.repositories.size,
    });
  });

  // Sort by size (descending)
  return stats.sort((a, b) => b.size - a.size);
}

/**
 * Gets the top N languages by usage
 *
 * @param repositories - Array of repositories
 * @param limit - Number of top languages to return (default: 5)
 * @returns Array of top languages
 *
 * @example
 * ```typescript
 * const topLanguages = getTopLanguages(repos, 3);
 * // Returns: ['TypeScript', 'JavaScript', 'CSS']
 * ```
 */
export function getTopLanguages(repositories: Repository[], limit: number = 5): string[] {
  const langStats = calculateLanguageStatistics(repositories);
  return langStats.slice(0, limit).map((stat) => stat.name);
}

/**
 * Calculates yearly commit statistics
 *
 * @param yearlyContributions - Object with year1, year2, year3 contributions
 * @param currentDate - Current date for year calculation (defaults to now)
 * @returns Array of yearly stats sorted by year (descending)
 *
 * @example
 * ```typescript
 * const yearlyStats = calculateYearlyCommitStats({
 *   year1: { totalCommitContributions: 500 },
 *   year2: { totalCommitContributions: 800 },
 *   year3: { totalCommitContributions: 1200 }
 * });
 * // Returns: [{ year: 2025, commits: 1200 }, { year: 2024, commits: 800 }, ...]
 * ```
 */
export function calculateYearlyCommitStats(
  yearlyContributions: {
    year1: YearlyContributions;
    year2: YearlyContributions;
    year3: YearlyContributions;
  },
  currentDate: Date = new Date()
): YearlyCommitStats[] {
  const currentYear = currentDate.getFullYear();

  return [
    {
      year: currentYear,
      commits: yearlyContributions.year3.totalCommitContributions,
    },
    {
      year: currentYear - 1,
      commits: yearlyContributions.year2.totalCommitContributions,
    },
    {
      year: currentYear - 2,
      commits: yearlyContributions.year1.totalCommitContributions,
    },
  ];
}

/**
 * Calculates commit activity metrics for a given time period
 *
 * @param totalCommits - Total commits in the period
 * @param periodDays - Number of days in the period
 * @returns Activity metrics (per day/week/month)
 *
 * @example
 * ```typescript
 * const activity = calculateCommitActivity(365, 365);
 * // Returns: { total: 365, perDay: 1, perWeek: 7, perMonth: 30.4 }
 * ```
 */
export function calculateCommitActivity(
  totalCommits: number,
  periodDays: number
): CommitActivity {
  if (periodDays <= 0) {
    return { total: totalCommits, perDay: 0, perWeek: 0, perMonth: 0 };
  }

  const perDay = totalCommits / periodDays;
  const perWeek = perDay * 7;
  const perMonth = perDay * 30.44; // Average days per month

  return {
    total: totalCommits,
    perDay: Math.round(perDay * 10) / 10,
    perWeek: Math.round(perWeek * 10) / 10,
    perMonth: Math.round(perMonth * 10) / 10,
  };
}

/**
 * Gets most active repositories by commit count
 *
 * @param repositories - Array of repositories
 * @param limit - Number of top repos to return (default: 5)
 * @returns Array of top repositories with commit counts
 *
 * @example
 * ```typescript
 * const mostActive = getMostActiveRepositories(repos, 3);
 * // Returns: [{ name: 'my-app', commits: 500 }, ...]
 * ```
 */
export function getMostActiveRepositories(
  repositories: Repository[],
  limit: number = 5
): Array<{ name: string; commits: number }> {
  const reposWithCommits = repositories
    .map((repo) => ({
      name: repo.name,
      commits: repo.defaultBranchRef?.target?.history?.totalCount || 0,
    }))
    .filter((repo) => repo.commits > 0)
    .sort((a, b) => b.commits - a.commits);

  return reposWithCommits.slice(0, limit);
}

/**
 * Calculates total commits across all repositories
 *
 * @param repositories - Array of repositories
 * @returns Total commit count
 *
 * @example
 * ```typescript
 * const total = getTotalCommits(repos);
 * // Returns: 2500
 * ```
 */
export function getTotalCommits(repositories: Repository[]): number {
  return repositories.reduce((total, repo) => {
    const commits = repo.defaultBranchRef?.target?.history?.totalCount || 0;
    return total + commits;
  }, 0);
}

/**
 * Gets repositories by language
 *
 * @param repositories - Array of repositories
 * @param language - Language name to filter by
 * @returns Array of repositories using the specified language
 *
 * @example
 * ```typescript
 * const tsRepos = getRepositoriesByLanguage(repos, 'TypeScript');
 * // Returns: [repo1, repo2, ...]
 * ```
 */
export function getRepositoriesByLanguage(
  repositories: Repository[],
  language: string
): Repository[] {
  return repositories.filter((repo) => {
    // Check primary language
    if (repo.primaryLanguage?.name === language) {
      return true;
    }

    // Check in all languages
    return repo.languages.edges.some((edge) => edge.node.name === language);
  });
}

/**
 * Calculates language diversity score (0-100)
 * Higher score = more diverse language usage
 *
 * @param repositories - Array of repositories
 * @returns Diversity score from 0-100
 *
 * @example
 * ```typescript
 * const diversity = calculateLanguageDiversity(repos);
 * // Returns: 75 (high diversity)
 * ```
 */
export function calculateLanguageDiversity(repositories: Repository[]): number {
  if (!repositories || repositories.length === 0) {
    return 0;
  }

  const languages = new Set<string>();

  repositories.forEach((repo) => {
    if (repo.primaryLanguage?.name) {
      languages.add(repo.primaryLanguage.name);
    }
    repo.languages.edges.forEach((edge) => {
      if (edge.node.name) {
        languages.add(edge.node.name);
      }
    });
  });

  const languageCount = languages.size;

  // Score based on number of languages
  // 1 language = 0 points
  // 5+ languages = 100 points
  const score = Math.min((languageCount - 1) * 25, 100);

  return Math.round(score);
}

/**
 * Gets commit statistics summary
 *
 * @param contributions - Contributions collection from GraphQL
 * @param repositories - Array of repositories
 * @returns Object with comprehensive commit statistics
 *
 * @example
 * ```typescript
 * const summary = getCommitStatsSummary(
 *   user.contributionsCollection,
 *   user.repositories.nodes
 * );
 * ```
 */
export function getCommitStatsSummary(
  contributions: ContributionsCollection,
  repositories: Repository[]
): {
  totalUserCommits: number;
  totalRepoCommits: number;
  repositoryCount: number;
  avgCommitsPerRepo: number;
  topRepository: string | null;
  topRepositoryCommits: number;
} {
  const totalUserCommits = contributions.totalCommitContributions;
  const totalRepoCommits = getTotalCommits(repositories);
  const repositoryCount = repositories.length;

  const avgCommitsPerRepo =
    repositoryCount > 0 ? Math.round(totalRepoCommits / repositoryCount) : 0;

  const mostActive = getMostActiveRepositories(repositories, 1);
  const topRepository = mostActive.length > 0 ? mostActive[0].name : null;
  const topRepositoryCommits = mostActive.length > 0 ? mostActive[0].commits : 0;

  return {
    totalUserCommits,
    totalRepoCommits,
    repositoryCount,
    avgCommitsPerRepo,
    topRepository,
    topRepositoryCommits,
  };
}

/**
 * Formats large numbers for display (e.g., 1500 -> "1.5k")
 *
 * @param value - Number to format
 * @returns Formatted string
 *
 * @example
 * ```typescript
 * formatNumber(1500) // "1.5k"
 * formatNumber(1000000) // "1M"
 * formatNumber(500) // "500"
 * ```
 */
export function formatNumber(value: number): string {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}k`;
  }
  return value.toString();
}

/**
 * Formats bytes to human-readable size
 *
 * @param bytes - Size in bytes
 * @returns Formatted string (e.g., "1.5 MB")
 *
 * @example
 * ```typescript
 * formatBytes(1500000) // "1.4 MB"
 * formatBytes(500) // "500 B"
 * ```
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';

  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const value = bytes / Math.pow(1024, i);

  return `${value.toFixed(1)} ${sizes[i]}`;
}
