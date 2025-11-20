/**
 * Centralized mock data for testing GitHub API responses
 * Provides factory functions for creating test data with realistic defaults
 *
 * Week 4 P3: Mock data consolidation - centralized factories to reduce duplication
 */

import type {
  Repository,
  GitHubUser,
  ProgrammingLanguage,
  ParentRepository,
  LicenseInfo,
  ConnectionCount,
} from '@/apollo/github-api.types';
import type {
  AuthenticityScore,
  ActivityMetric,
  ImpactMetric,
  QualityMetric,
  GrowthMetric,
} from '@/types/metrics';

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
 * Helper function to create complete GraphQL response with rate limit
 * Used in integration tests to simulate backend proxy responses
 */
export function createMockGraphQLResponse(
  userOverrides: Partial<GitHubUser> = {},
  rateLimitOverrides: Partial<{
    remaining: number;
    limit: number;
    reset: number;
    used: number;
    isDemo: boolean;
    userLogin?: string;
  }> = {}
) {
  return {
    data: {
      user: createMockUser(userOverrides),
      rateLimit: {
        remaining: 5000,
        limit: 5000,
        reset: Math.floor(Date.now() / 1000) + 3600,
        used: 0,
        isDemo: true,
        ...rateLimitOverrides,
      },
    },
  };
}

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

// ============================================================================
// Authenticity Score Mocks
// ============================================================================

/**
 * Pre-configured mock: High authenticity score (85/100)
 */
export const mockHighAuthenticityScore: AuthenticityScore = {
  score: 85,
  category: 'High',
  breakdown: {
    originalityScore: 22,
    activityScore: 20,
    engagementScore: 23,
    codeOwnershipScore: 20,
  },
  flags: [],
  metadata: {
    totalRepos: 10,
    originalRepos: 9,
    forkedRepos: 1,
    archivedRepos: 0,
    templateRepos: 0,
  },
};

/**
 * Pre-configured mock: Medium authenticity score (62/100)
 */
export const mockMediumAuthenticityScore: AuthenticityScore = {
  score: 62,
  category: 'Medium',
  breakdown: {
    originalityScore: 15,
    activityScore: 18,
    engagementScore: 14,
    codeOwnershipScore: 15,
  },
  flags: [],
  metadata: {
    totalRepos: 8,
    originalRepos: 5,
    forkedRepos: 3,
    archivedRepos: 0,
    templateRepos: 0,
  },
};

/**
 * Pre-configured mock: Low authenticity score (35/100)
 */
export const mockLowAuthenticityScore: AuthenticityScore = {
  score: 35,
  category: 'Low',
  breakdown: {
    originalityScore: 8,
    activityScore: 10,
    engagementScore: 7,
    codeOwnershipScore: 10,
  },
  flags: ['Low activity in original repositories', 'High fork-to-original ratio'],
  metadata: {
    totalRepos: 12,
    originalRepos: 3,
    forkedRepos: 7,
    archivedRepos: 2,
    templateRepos: 0,
  },
};

/**
 * Pre-configured mock: Suspicious authenticity score (15/100)
 */
export const mockSuspiciousAuthenticityScore: AuthenticityScore = {
  score: 15,
  category: 'Suspicious',
  breakdown: {
    originalityScore: 3,
    activityScore: 5,
    engagementScore: 2,
    codeOwnershipScore: 5,
  },
  flags: ['Majority of repositories are forks', 'Very low engagement', 'Suspicious activity pattern'],
  metadata: {
    totalRepos: 15,
    originalRepos: 1,
    forkedRepos: 12,
    archivedRepos: 2,
    templateRepos: 0,
  },
};

/**
 * Factory function to create a custom authenticity score with overrides
 */
export function createMockAuthenticityScore(
  overrides: Partial<AuthenticityScore> = {}
): AuthenticityScore {
  return {
    ...mockHighAuthenticityScore,
    ...overrides,
  };
}

// ============================================================================
// Contribution Repository Mocks (for RecentActivity component)
// ============================================================================

/**
 * Contribution repository object (used in contributionsCollection)
 */
export interface ContributionRepository {
  repository: {
    name: string;
  };
  contributions: {
    totalCount: number;
  };
}

/**
 * Pre-configured mock: Contribution repositories collection
 */
export const mockContributionRepositories: ContributionRepository[] = [
  { repository: { name: 'awesome-project' }, contributions: { totalCount: 127 } },
  { repository: { name: 'web-app' }, contributions: { totalCount: 89 } },
  { repository: { name: 'mobile-client' }, contributions: { totalCount: 56 } },
  { repository: { name: 'api-server' }, contributions: { totalCount: 43 } },
  { repository: { name: 'documentation' }, contributions: { totalCount: 21 } },
];

/**
 * Factory function to create contribution repository objects
 */
export function createMockContributionRepository(
  name: string,
  commits: number
): ContributionRepository {
  return {
    repository: { name },
    contributions: { totalCount: commits },
  };
}

// ============================================================================
// Metric Mocks (Activity, Impact, Quality, Growth)
// ============================================================================

/**
 * Pre-configured mock: High activity metric
 */
export const mockHighActivityMetric: ActivityMetric = {
  score: 85,
  level: 'High',
  breakdown: {
    recentCommits: 30,
    consistency: 28,
    diversity: 27,
  },
  details: {
    last3MonthsCommits: 150,
    activeMonths: 11,
    uniqueRepos: 8,
  },
};

/**
 * Pre-configured mock: Moderate activity metric
 */
export const mockModerateActivityMetric: ActivityMetric = {
  score: 60,
  level: 'Moderate',
  breakdown: {
    recentCommits: 20,
    consistency: 18,
    diversity: 22,
  },
  details: {
    last3MonthsCommits: 80,
    activeMonths: 8,
    uniqueRepos: 5,
  },
};

/**
 * Pre-configured mock: Low activity metric
 */
export const mockLowActivityMetric: ActivityMetric = {
  score: 30,
  level: 'Low',
  breakdown: {
    recentCommits: 10,
    consistency: 8,
    diversity: 12,
  },
  details: {
    last3MonthsCommits: 20,
    activeMonths: 4,
    uniqueRepos: 2,
  },
};

/**
 * Pre-configured mock: Exceptional impact metric
 */
export const mockExceptionalImpactMetric: ImpactMetric = {
  score: 95,
  level: 'Exceptional',
  breakdown: {
    stars: 33,
    forks: 18,
    contributors: 14,
    reach: 18,
    engagement: 12,
  },
  details: {
    totalStars: 25000,
    totalForks: 3500,
    totalWatchers: 1200,
    totalPRs: 450,
    totalIssues: 320,
  },
};

/**
 * Pre-configured mock: Strong impact metric
 */
export const mockStrongImpactMetric: ImpactMetric = {
  score: 75,
  level: 'Strong',
  breakdown: {
    stars: 28,
    forks: 15,
    contributors: 11,
    reach: 13,
    engagement: 8,
  },
  details: {
    totalStars: 5000,
    totalForks: 800,
    totalWatchers: 250,
    totalPRs: 120,
    totalIssues: 85,
  },
};

/**
 * Pre-configured mock: Excellent quality metric
 */
export const mockExcellentQualityMetric: QualityMetric = {
  score: 90,
  level: 'Excellent',
  breakdown: {
    originality: 19,
    documentation: 18,
    ownership: 19,
    maturity: 17,
    stack: 17,
  },
  details: {
    totalRepos: 15,
    originalRepos: 14,
    forkedRepos: 1,
    documentedRepos: 13,
    ownedRepos: 12,
    contributedRepos: 8,
    averageRepoAge: 2.5,
    uniqueLanguages: 8,
  },
};

/**
 * Pre-configured mock: Rapid growth metric
 */
export const mockRapidGrowthMetric: GrowthMetric = {
  score: 75,
  level: 'Rapid Growth',
  breakdown: {
    activityGrowth: 28,
    impactGrowth: 25,
    skillsGrowth: 22,
  },
  details: {
    commitsChange: 150,
    starsChange: 2500,
    forksChange: 420,
    newLanguages: 3,
    yearsCompared: 2,
  },
};

/**
 * Pre-configured mock: Stable growth metric
 */
export const mockStableGrowthMetric: GrowthMetric = {
  score: 10,
  level: 'Stable',
  breakdown: {
    activityGrowth: 5,
    impactGrowth: 3,
    skillsGrowth: 2,
  },
  details: {
    commitsChange: 20,
    starsChange: 50,
    forksChange: 10,
    newLanguages: 1,
    yearsCompared: 2,
  },
};
