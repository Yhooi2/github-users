/**
 * Centralized mock data for testing GitHub API responses
 * Provides factory functions for creating test data with realistic defaults
 */

import type {
  Repository,
  GitHubUser,
  ProgrammingLanguage,
  ParentRepository,
  LicenseInfo,
  ConnectionCount,
} from '@/apollo/github-api.types';

/**
 * Default programming language (TypeScript)
 */
export const mockLanguageTypeScript: ProgrammingLanguage = {
  name: 'TypeScript',
};

/**
 * Default programming language (JavaScript)
 */
export const mockLanguageJavaScript: ProgrammingLanguage = {
  name: 'JavaScript',
};

/**
 * Default connection count (0)
 */
export const mockConnectionCountZero: ConnectionCount = {
  totalCount: 0,
};

/**
 * Default MIT license
 */
export const mockLicenseMIT: LicenseInfo = {
  name: 'MIT',
};

/**
 * Default parent repository (for forked repos)
 */
export const mockParentRepository: ParentRepository = {
  name: 'original-repo',
  owner: {
    login: 'original-owner',
  },
  url: 'https://github.com/original-owner/original-repo',
};

/**
 * Default repository mock with realistic values
 */
export const mockRepository: Repository = {
  id: 'repo-1',
  name: 'test-repository',
  description: 'A test repository for unit testing',
  forkCount: 10,
  stargazerCount: 100,
  url: 'https://github.com/testuser/test-repository',

  // Authenticity fields
  isFork: false,
  isTemplate: false,
  parent: null,

  // Timestamps (recent activity)
  createdAt: new Date('2023-01-01T00:00:00Z').toISOString(),
  updatedAt: new Date('2024-12-01T00:00:00Z').toISOString(),
  pushedAt: new Date('2024-12-01T00:00:00Z').toISOString(),

  // Additional stats
  diskUsage: 5000, // 5 MB
  isArchived: false,
  homepageUrl: 'https://example.com',

  // Engagement
  watchers: { totalCount: 25 },
  issues: { totalCount: 5 },

  // Topics and license
  repositoryTopics: {
    nodes: [
      { topic: { name: 'typescript' } },
      { topic: { name: 'react' } },
    ],
  },
  licenseInfo: mockLicenseMIT,

  // Language and commits
  defaultBranchRef: {
    target: {
      history: { totalCount: 150 },
    },
  },
  primaryLanguage: mockLanguageTypeScript,
  languages: {
    totalSize: 100000,
    edges: [
      { size: 70000, node: { name: 'TypeScript' } },
      { size: 20000, node: { name: 'JavaScript' } },
      { size: 10000, node: { name: 'CSS' } },
    ],
  },
};

/**
 * Default user mock with realistic values
 */
export const mockUser: GitHubUser = {
  id: 'user-1',
  login: 'testuser',
  name: 'Test User',
  avatarUrl: 'https://avatars.githubusercontent.com/u/12345',
  bio: 'Full-stack developer passionate about open source',
  url: 'https://github.com/testuser',
  location: 'San Francisco, CA',

  followers: { totalCount: 100 },
  following: { totalCount: 50 },
  gists: { totalCount: 10 },

  createdAt: new Date('2015-01-01T00:00:00Z').toISOString(),

  // Yearly contributions
  year1: { totalCommitContributions: 100 },
  year2: { totalCommitContributions: 200 },
  year3: { totalCommitContributions: 300 },

  contributionsCollection: {
    totalCommitContributions: 600,
    commitContributionsByRepository: [
      {
        contributions: { totalCount: 100 },
        repository: { name: 'test-repository' },
      },
    ],
  },

  repositories: {
    totalCount: 10,
    pageInfo: {
      endCursor: 'cursor123',
      hasNextPage: false,
    },
    nodes: [mockRepository],
  },
};

/**
 * Factory function to create a custom repository with overrides
 *
 * @param overrides - Partial repository properties to override defaults
 * @returns Repository object with merged properties
 *
 * @example
 * ```typescript
 * const popularRepo = createMockRepository({
 *   stargazerCount: 9999,
 *   forkCount: 500,
 * });
 * ```
 */
export function createMockRepository(overrides: Partial<Repository> = {}): Repository {
  return {
    ...mockRepository,
    ...overrides,
  };
}

/**
 * Factory function to create a custom user with overrides
 *
 * @param overrides - Partial user properties to override defaults
 * @returns GitHubUser object with merged properties
 *
 * @example
 * ```typescript
 * const popularUser = createMockUser({
 *   login: 'populardev',
 *   followers: { totalCount: 10000 },
 * });
 * ```
 */
export function createMockUser(overrides: Partial<GitHubUser> = {}): GitHubUser {
  return {
    ...mockUser,
    ...overrides,
  };
}

/**
 * Pre-configured mock: Forked repository
 */
export const mockForkedRepository = createMockRepository({
  id: 'repo-forked',
  name: 'forked-repo',
  isFork: true,
  parent: mockParentRepository,
  stargazerCount: 5,
  forkCount: 0,
});

/**
 * Pre-configured mock: Archived repository
 */
export const mockArchivedRepository = createMockRepository({
  id: 'repo-archived',
  name: 'archived-repo',
  isArchived: true,
  pushedAt: new Date('2020-01-01T00:00:00Z').toISOString(),
  updatedAt: new Date('2020-06-01T00:00:00Z').toISOString(),
});

/**
 * Pre-configured mock: Template repository
 */
export const mockTemplateRepository = createMockRepository({
  id: 'repo-template',
  name: 'template-repo',
  isTemplate: true,
  description: 'A template repository for bootstrapping projects',
  stargazerCount: 250,
});

/**
 * Pre-configured mock: Empty repository (no commits)
 */
export const mockEmptyRepository = createMockRepository({
  id: 'repo-empty',
  name: 'empty-repo',
  defaultBranchRef: null,
  stargazerCount: 0,
  forkCount: 0,
  watchers: { totalCount: 0 },
  issues: { totalCount: 0 },
  pushedAt: null,
});

/**
 * Pre-configured mock: Popular repository (many stars)
 */
export const mockPopularRepository = createMockRepository({
  id: 'repo-popular',
  name: 'popular-repo',
  description: 'A very popular open-source project',
  stargazerCount: 10000,
  forkCount: 1500,
  watchers: { totalCount: 500 },
  issues: { totalCount: 200 },
  repositoryTopics: {
    nodes: [
      { topic: { name: 'awesome' } },
      { topic: { name: 'popular' } },
      { topic: { name: 'open-source' } },
    ],
  },
});

/**
 * Pre-configured mock: Private/low-engagement repository
 */
export const mockLowEngagementRepository = createMockRepository({
  id: 'repo-low',
  name: 'low-engagement-repo',
  stargazerCount: 1,
  forkCount: 0,
  watchers: { totalCount: 1 },
  issues: { totalCount: 0 },
  repositoryTopics: { nodes: [] },
  licenseInfo: null,
});

/**
 * Pre-configured mock: JavaScript repository
 */
export const mockJavaScriptRepository = createMockRepository({
  id: 'repo-js',
  name: 'javascript-repo',
  primaryLanguage: mockLanguageJavaScript,
  languages: {
    totalSize: 50000,
    edges: [
      { size: 40000, node: { name: 'JavaScript' } },
      { size: 10000, node: { name: 'HTML' } },
    ],
  },
});

/**
 * Pre-configured mock: Multi-language repository
 */
export const mockMultiLanguageRepository = createMockRepository({
  id: 'repo-multi',
  name: 'multi-language-repo',
  languages: {
    totalSize: 200000,
    edges: [
      { size: 80000, node: { name: 'TypeScript' } },
      { size: 50000, node: { name: 'Python' } },
      { size: 40000, node: { name: 'Go' } },
      { size: 20000, node: { name: 'Rust' } },
      { size: 10000, node: { name: 'Shell' } },
    ],
  },
});

/**
 * Pre-configured mock: Repository without license
 */
export const mockNoLicenseRepository = createMockRepository({
  id: 'repo-no-license',
  name: 'no-license-repo',
  licenseInfo: null,
});

/**
 * Pre-configured mock: Repository without topics
 */
export const mockNoTopicsRepository = createMockRepository({
  id: 'repo-no-topics',
  name: 'no-topics-repo',
  repositoryTopics: { nodes: [] },
});

/**
 * Collection of diverse repositories for comprehensive testing
 */
export const mockRepositoryCollection: Repository[] = [
  mockRepository,
  mockForkedRepository,
  mockArchivedRepository,
  mockTemplateRepository,
  mockPopularRepository,
  mockLowEngagementRepository,
  mockJavaScriptRepository,
  mockMultiLanguageRepository,
];

/**
 * Collection of repositories with only original (non-forked) repos
 */
export const mockOriginalRepositories: Repository[] = [
  mockRepository,
  mockPopularRepository,
  mockJavaScriptRepository,
];

/**
 * Collection of inactive repositories (old pushes)
 */
export const mockInactiveRepositories: Repository[] = [
  mockArchivedRepository,
  createMockRepository({
    id: 'repo-inactive-1',
    name: 'inactive-repo-1',
    pushedAt: new Date('2019-01-01T00:00:00Z').toISOString(),
  }),
  createMockRepository({
    id: 'repo-inactive-2',
    name: 'inactive-repo-2',
    pushedAt: new Date('2018-06-01T00:00:00Z').toISOString(),
  }),
];

/**
 * Helper function to create a list of repositories with specific characteristics
 *
 * @param count - Number of repositories to create
 * @param overrides - Properties to apply to all repositories
 * @returns Array of repositories
 *
 * @example
 * ```typescript
 * const tenPopularRepos = createMockRepositories(10, {
 *   stargazerCount: 1000,
 * });
 * ```
 */
export function createMockRepositories(
  count: number,
  overrides: Partial<Repository> = {}
): Repository[] {
  return Array.from({ length: count }, (_, i) =>
    createMockRepository({
      id: `repo-${i + 1}`,
      name: `test-repo-${i + 1}`,
      ...overrides,
    })
  );
}
