/**
 * Adapter functions to convert GraphQL types to Level 0/1/2 component props
 */

import type { RepositoryContribution } from "@/apollo/queries/yearContributions";
import type { ExpandableProject } from "@/components/level-1/ExpandableProjectCard";
import type { ProjectForModal } from "@/components/level-2/ProjectAnalyticsModal";
import type { CompactProject, LanguageInfo } from "@/lib/types/project.types";
import { calculateContributionPercent } from "@/lib/utils/contribution-helpers";

/**
 * Extract language breakdown from repository languages data
 */
function extractLanguages(
  repository: RepositoryContribution["repository"],
): LanguageInfo[] {
  const { languages } = repository;

  if (
    !languages?.edges ||
    languages.edges.length === 0 ||
    languages.totalSize === 0
  ) {
    // Fallback to primary language if no detailed breakdown available
    if (repository.primaryLanguage?.name) {
      return [{ name: repository.primaryLanguage.name, percent: 100 }];
    }
    return [];
  }

  return languages.edges.map((edge) => ({
    name: edge.node.name,
    // Round to 1 decimal place for display
    percent: Math.round((edge.size / languages.totalSize) * 1000) / 10,
    size: edge.size,
  }));
}

/**
 * Extract total commits from repository's default branch
 */
function getTotalRepoCommits(
  repository: RepositoryContribution["repository"],
): number | undefined {
  const target = repository.defaultBranchRef?.target;
  // Type guard for Commit target with history
  if (target && "history" in target && target.history?.totalCount) {
    return target.history.totalCount;
  }
  return undefined;
}

/**
 * Convert RepositoryContribution to CompactProject (Level 0)
 */
export function toCompactProject(
  item: RepositoryContribution,
  username: string,
): CompactProject {
  const { repository, contributions } = item;

  return {
    id: repository.id,
    name: repository.name,
    commits: contributions.totalCount,
    totalRepoCommits: getTotalRepoCommits(repository),
    stars: repository.stargazerCount,
    language: repository.primaryLanguage?.name ?? "",
    languages: extractLanguages(repository),
    isOwner: repository.owner.login === username,
    isFork: repository.isFork ?? false,
    description: repository.description ?? undefined,
    url: repository.url,
    lastActivityDate: repository.pushedAt ?? undefined,
  };
}

/**
 * Convert RepositoryContribution to ExpandableProject (Level 1)
 */
export function toExpandableProject(
  item: RepositoryContribution,
  username: string,
): ExpandableProject {
  const { repository, contributions } = item;
  const totalRepoCommits = getTotalRepoCommits(repository);
  const userCommits = contributions.totalCount;

  return {
    id: repository.id,
    name: repository.name,
    commits: userCommits,
    totalRepoCommits,
    stars: repository.stargazerCount,
    language: repository.primaryLanguage?.name ?? "",
    languages: extractLanguages(repository),
    isOwner: repository.owner.login === username,
    isFork: repository.isFork ?? false,
    description: repository.description ?? undefined,
    url: repository.url,
    lastActivityDate: repository.pushedAt ?? undefined,
    forks: repository.forkCount,
    // User contribution data
    contributionPercent: calculateContributionPercent(
      userCommits,
      totalRepoCommits,
    ),
    totalCommits: totalRepoCommits,
    userCommits,
  };
}

/**
 * Convert RepositoryContribution to ProjectForModal (Level 2)
 */
export function toProjectForModal(
  item: RepositoryContribution,
): ProjectForModal {
  const { repository } = item;

  return {
    id: repository.id,
    name: repository.name,
    description: repository.description ?? undefined,
    url: repository.url,
    stars: repository.stargazerCount,
    forks: repository.forkCount,
  };
}

/**
 * Convert array of RepositoryContribution to CompactProject[]
 * Sorted by commit count (descending) for visual consistency
 */
export function toCompactProjects(
  items: RepositoryContribution[],
  username: string,
): CompactProject[] {
  return items
    .map((item) => toCompactProject(item, username))
    .sort((a, b) => b.commits - a.commits);
}

/**
 * Convert array of RepositoryContribution to ExpandableProject[]
 * Sorted by commit count (descending) for visual consistency
 */
export function toExpandableProjects(
  items: RepositoryContribution[],
  username: string,
): ExpandableProject[] {
  return items
    .map((item) => toExpandableProject(item, username))
    .sort((a, b) => b.commits - a.commits);
}
