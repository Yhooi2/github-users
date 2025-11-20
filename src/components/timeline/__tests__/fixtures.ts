import type { Repository } from "@/apollo/github-api.types";
import type { YearData } from "@/hooks/useUserAnalytics";

/**
 * Creates a mock Repository object with all required fields
 */
export function createMockRepository(
  overrides?: Partial<Repository>,
): Repository {
  return {
    id: "repo-123",
    name: "test-repo",
    url: "https://github.com/user/test-repo",
    description: "Test repository",
    createdAt: "2020-01-01T00:00:00Z",
    updatedAt: "2025-01-15T10:30:00Z",
    pushedAt: "2025-01-15T10:30:00Z",
    stargazerCount: 100,
    forkCount: 10,
    isFork: false,
    isTemplate: false,
    isArchived: false,
    diskUsage: 1024,
    homepageUrl: null,
    primaryLanguage: {
      name: "TypeScript",
    },
    owner: {
      login: "user",
      avatarUrl: "https://github.com/user.png",
    },
    parent: null,
    watchers: { totalCount: 5 },
    issues: { totalCount: 10 },
    repositoryTopics: { nodes: [] },
    languages: {
      totalSize: 10000,
      edges: [
        {
          size: 8000,
          node: { name: "TypeScript" },
        },
      ],
    },
    licenseInfo: { name: "MIT" },
    defaultBranchRef: {
      target: {
        history: { totalCount: 100 },
      },
    },
    ...overrides,
  };
}

/**
 * Creates mock YearData for testing
 */
export function createMockYearData(overrides?: Partial<YearData>): YearData {
  return {
    year: 2025,
    totalCommits: 450,
    totalIssues: 30,
    totalPRs: 25,
    totalReviews: 15,
    ownedRepos: [
      {
        repository: createMockRepository(),
        contributions: { totalCount: 200 },
      },
    ],
    contributions: [],
    ...overrides,
  };
}

/**
 * Creates a timeline with multiple years for testing
 */
export function createMockTimeline(years: number[] = [2025, 2024]): YearData[] {
  return years.map((year) =>
    createMockYearData({
      year,
      totalCommits: year === 2025 ? 450 : 320,
      totalIssues: year === 2025 ? 30 : 20,
      totalPRs: year === 2025 ? 25 : 15,
      totalReviews: year === 2025 ? 15 : 10,
      ownedRepos:
        year === 2025
          ? [
              {
                repository: createMockRepository(),
                contributions: { totalCount: 200 },
              },
            ]
          : [],
      contributions: [],
    }),
  );
}
