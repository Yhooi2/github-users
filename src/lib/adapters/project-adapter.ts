/**
 * Adapter functions to convert GraphQL types to Level 0/1/2 component props
 */

import type { RepositoryContribution } from "@/apollo/queries/yearContributions";
import type { CompactProject, LanguageInfo } from "@/components/level-0/CompactProjectRow";
import type { ExpandableProject } from "@/components/level-1/ExpandableProjectCard";
import type { ProjectForModal } from "@/components/level-2/ProjectAnalyticsModal";

/**
 * Extract language breakdown from repository languages data
 */
function extractLanguages(repository: RepositoryContribution["repository"]): LanguageInfo[] {
  const { languages } = repository;

  if (!languages?.edges || languages.edges.length === 0 || languages.totalSize === 0) {
    // Fallback to primary language if no detailed breakdown available
    if (repository.primaryLanguage?.name) {
      return [{ name: repository.primaryLanguage.name, percent: 100 }];
    }
    return [];
  }

  return languages.edges.map((edge) => ({
    name: edge.node.name,
    percent: (edge.size / languages.totalSize) * 100,
    size: edge.size,
  }));
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
    stars: repository.stargazerCount,
    language: repository.primaryLanguage?.name ?? "",
    languages: extractLanguages(repository),
    isOwner: repository.owner.login === username,
    isFork: repository.isFork ?? false,
    description: repository.description ?? undefined,
    url: repository.url,
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

  return {
    id: repository.id,
    name: repository.name,
    commits: contributions.totalCount,
    stars: repository.stargazerCount,
    language: repository.primaryLanguage?.name ?? "",
    languages: extractLanguages(repository),
    isOwner: repository.owner.login === username,
    isFork: repository.isFork ?? false,
    description: repository.description ?? undefined,
    url: repository.url,
    forks: repository.forkCount,
  };
}

/**
 * Convert RepositoryContribution to ProjectForModal (Level 2)
 */
export function toProjectForModal(item: RepositoryContribution): ProjectForModal {
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
 */
export function toCompactProjects(
  items: RepositoryContribution[],
  username: string,
): CompactProject[] {
  return items.map((item) => toCompactProject(item, username));
}

/**
 * Convert array of RepositoryContribution to ExpandableProject[]
 */
export function toExpandableProjects(
  items: RepositoryContribution[],
  username: string,
): ExpandableProject[] {
  return items.map((item) => toExpandableProject(item, username));
}
