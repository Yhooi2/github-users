import type { Repository } from "@/apollo/github-api.types";
import type { RepositoryFilter, SortBy, SortDirection } from "@/types/filters";

/**
 * Sorts repositories by specified criteria
 *
 * @param repositories - Array of repositories to sort
 * @param sortBy - Sort criteria
 * @param direction - Sort direction ('asc' or 'desc')
 * @returns Sorted array of repositories
 *
 * @example
 * ```typescript
 * const sorted = sortRepositories(repos, 'stars', 'desc');
 * // Returns repos sorted by stars, highest first
 * ```
 */
export function sortRepositories(
  repositories: Repository[],
  sortBy: SortBy,
  direction: SortDirection = "desc",
): Repository[] {
  const sorted = [...repositories];

  sorted.sort((a, b) => {
    let compareValue = 0;

    switch (sortBy) {
      case "stars":
        compareValue = (a.stargazerCount || 0) - (b.stargazerCount || 0);
        break;

      case "forks":
        compareValue = (a.forkCount || 0) - (b.forkCount || 0);
        break;

      case "watchers":
        compareValue =
          (a.watchers?.totalCount || 0) - (b.watchers?.totalCount || 0);
        break;

      case "commits": {
        const aCommits = a.defaultBranchRef?.target?.history?.totalCount || 0;
        const bCommits = b.defaultBranchRef?.target?.history?.totalCount || 0;
        compareValue = aCommits - bCommits;
        break;
      }

      case "size":
        compareValue = (a.diskUsage || 0) - (b.diskUsage || 0);
        break;

      case "updated":
        compareValue =
          new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
        break;

      case "created":
        compareValue =
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        break;

      case "name":
        compareValue = a.name.localeCompare(b.name);
        break;

      default:
        compareValue = 0;
    }

    return direction === "asc" ? compareValue : -compareValue;
  });

  return sorted;
}

/**
 * Filters repositories based on specified criteria
 *
 * @param repositories - Array of repositories to filter
 * @param filters - Filter criteria
 * @returns Filtered array of repositories
 *
 * @example
 * ```typescript
 * const filtered = filterRepositories(repos, {
 *   originalOnly: true,
 *   minStars: 10,
 *   language: 'TypeScript'
 * });
 * ```
 */
export function filterRepositories(
  repositories: Repository[],
  filters: RepositoryFilter,
): Repository[] {
  let filtered = [...repositories];

  // Filter: Original only (exclude forks and templates)
  if (filters.originalOnly) {
    filtered = filtered.filter((repo) => !repo.isFork && !repo.isTemplate);
  }

  // Filter: Forks only
  if (filters.forksOnly) {
    filtered = filtered.filter((repo) => repo.isFork);
  }

  // Filter: Hide archived
  if (filters.hideArchived) {
    filtered = filtered.filter((repo) => !repo.isArchived);
  }

  // Filter: By language
  if (filters.language) {
    filtered = filtered.filter((repo) => {
      const primaryLang = repo.primaryLanguage?.name?.toLowerCase();
      const filterLang = filters.language?.toLowerCase();
      return primaryLang === filterLang;
    });
  }

  // Filter: Minimum stars
  if (filters.minStars !== undefined && filters.minStars > 0) {
    filtered = filtered.filter(
      (repo) => (repo.stargazerCount || 0) >= filters.minStars!,
    );
  }

  // Filter: Search query (name or description)
  if (filters.searchQuery && filters.searchQuery.trim()) {
    const query = filters.searchQuery.toLowerCase().trim();
    filtered = filtered.filter((repo) => {
      const name = repo.name.toLowerCase();
      const description = (repo.description || "").toLowerCase();
      return name.includes(query) || description.includes(query);
    });
  }

  // Filter: Has topics
  if (filters.hasTopics) {
    filtered = filtered.filter((repo) => {
      return repo.repositoryTopics.nodes.length > 0;
    });
  }

  // Filter: Has license
  if (filters.hasLicense) {
    filtered = filtered.filter((repo) => repo.licenseInfo !== null);
  }

  return filtered;
}

/**
 * Gets unique list of languages from repositories
 *
 * @param repositories - Array of repositories
 * @returns Sorted array of unique language names
 *
 * @example
 * ```typescript
 * const languages = getUniqueLanguages(repos);
 * // Returns: ['TypeScript', 'JavaScript', 'Python', ...]
 * ```
 */
export function getUniqueLanguages(repositories: Repository[]): string[] {
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

  return Array.from(languages).sort();
}

/**
 * Groups repositories by a specific criterion
 *
 * @param repositories - Array of repositories
 * @param groupBy - Grouping criterion
 * @returns Object with grouped repositories
 *
 * @example
 * ```typescript
 * const grouped = groupRepositories(repos, 'language');
 * // Returns: { TypeScript: [...], JavaScript: [...], ... }
 * ```
 */
export function groupRepositories(
  repositories: Repository[],
  groupBy: "language" | "year" | "fork-status",
): Record<string, Repository[]> {
  const groups: Record<string, Repository[]> = {};

  repositories.forEach((repo) => {
    let key: string;

    switch (groupBy) {
      case "language":
        key = repo.primaryLanguage?.name || "Unknown";
        break;

      case "year":
        key = new Date(repo.createdAt).getFullYear().toString();
        break;

      case "fork-status":
        key = repo.isFork ? "Forked" : "Original";
        break;

      default:
        key = "Unknown";
    }

    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(repo);
  });

  return groups;
}

/**
 * Gets summary statistics for repositories
 *
 * @param repositories - Array of repositories
 * @returns Object with aggregate statistics
 *
 * @example
 * ```typescript
 * const stats = getRepositoryStats(repos);
 * // Returns: { totalStars: 500, avgStars: 25, totalForks: 100, ... }
 * ```
 */
export function getRepositoryStats(repositories: Repository[]): {
  totalStars: number;
  avgStars: number;
  totalForks: number;
  avgForks: number;
  totalWatchers: number;
  avgWatchers: number;
  totalSize: number;
  avgSize: number;
  originalCount: number;
  forkCount: number;
  archivedCount: number;
} {
  const total = repositories.length;

  if (total === 0) {
    return {
      totalStars: 0,
      avgStars: 0,
      totalForks: 0,
      avgForks: 0,
      totalWatchers: 0,
      avgWatchers: 0,
      totalSize: 0,
      avgSize: 0,
      originalCount: 0,
      forkCount: 0,
      archivedCount: 0,
    };
  }

  let totalStars = 0;
  let totalForks = 0;
  let totalWatchers = 0;
  let totalSize = 0;
  let originalCount = 0;
  let forkCount = 0;
  let archivedCount = 0;

  repositories.forEach((repo) => {
    totalStars += repo.stargazerCount || 0;
    totalForks += repo.forkCount || 0;
    totalWatchers += repo.watchers?.totalCount || 0;
    totalSize += repo.diskUsage || 0;

    if (!repo.isFork && !repo.isTemplate) {
      originalCount++;
    }
    if (repo.isFork) {
      forkCount++;
    }
    if (repo.isArchived) {
      archivedCount++;
    }
  });

  return {
    totalStars,
    avgStars: Math.round(totalStars / total),
    totalForks,
    avgForks: Math.round(totalForks / total),
    totalWatchers,
    avgWatchers: Math.round(totalWatchers / total),
    totalSize,
    avgSize: Math.round(totalSize / total),
    originalCount,
    forkCount,
    archivedCount,
  };
}
