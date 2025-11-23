/**
 * Adapter functions to convert GraphQL types to Level 0/1/2 component props
 */

import type { RepositoryContribution } from "@/apollo/queries/yearContributions";
import type { CompactProject } from "@/components/level-0/CompactProjectRow";
import type { ExpandableProject } from "@/components/level-1/ExpandableProjectCard";
import type { ProjectForModal } from "@/components/level-2/ProjectAnalyticsModal";

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
    isOwner: repository.owner.login === username,
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
    isOwner: repository.owner.login === username,
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
