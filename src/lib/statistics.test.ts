import { describe, it, expect } from 'vitest';
import {
  calculateCommitsByRepository,
  calculateLanguageStatistics,
  getTopLanguages,
  calculateYearlyCommitStats,
  calculateCommitActivity,
  getMostActiveRepositories,
  getTotalCommits,
  getRepositoriesByLanguage,
  calculateLanguageDiversity,
  getCommitStatsSummary,
  formatNumber,
  formatBytes,
} from './statistics';
import type {
  Repository,
  RepositoryContributions,
  ContributionsCollection,
} from '@/apollo/github-api.types';

// Helper to create mock repository
const createMockRepo = (overrides: Partial<Repository> = {}): Repository => ({
  id: 'repo-1',
  name: 'test-repo',
  description: 'Test repository',
  forkCount: 0,
  stargazerCount: 0,
  url: 'https://github.com/test/repo',
  isFork: false,
  isTemplate: false,
  parent: null,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
  pushedAt: '2024-01-01T00:00:00Z',
  diskUsage: 1000,
  isArchived: false,
  homepageUrl: null,
  watchers: { totalCount: 0 },
  issues: { totalCount: 0 },
  repositoryTopics: { nodes: [] },
  licenseInfo: null,
  defaultBranchRef: {
    target: {
      history: { totalCount: 10 },
    },
  },
  primaryLanguage: { name: 'TypeScript' },
  languages: {
    totalSize: 100000,
    edges: [{ size: 100000, node: { name: 'TypeScript' } }],
  },
  ...overrides,
});

describe('calculateCommitsByRepository', () => {
  it('should calculate commit statistics for each repository', () => {
    const contributions: RepositoryContributions[] = [
      {
        contributions: { totalCount: 50 },
        repository: { name: 'repo-a' },
      },
      {
        contributions: { totalCount: 100 },
        repository: { name: 'repo-b' },
      },
      {
        contributions: { totalCount: 25 },
        repository: { name: 'repo-c' },
      },
    ];

    const result = calculateCommitsByRepository(contributions);

    expect(result).toHaveLength(3);
    expect(result[0].repositoryName).toBe('repo-b');
    expect(result[0].userCommits).toBe(100);
    expect(result[1].repositoryName).toBe('repo-a');
    expect(result[1].userCommits).toBe(50);
    expect(result[2].repositoryName).toBe('repo-c');
    expect(result[2].userCommits).toBe(25);
  });

  it('should sort by user commits in descending order', () => {
    const contributions: RepositoryContributions[] = [
      { contributions: { totalCount: 10 }, repository: { name: 'a' } },
      { contributions: { totalCount: 100 }, repository: { name: 'b' } },
      { contributions: { totalCount: 50 }, repository: { name: 'c' } },
    ];

    const result = calculateCommitsByRepository(contributions);

    expect(result[0].userCommits).toBe(100);
    expect(result[1].userCommits).toBe(50);
    expect(result[2].userCommits).toBe(10);
  });

  it('should return empty array for empty input', () => {
    expect(calculateCommitsByRepository([])).toEqual([]);
  });

  it('should handle null/undefined input', () => {
    expect(calculateCommitsByRepository(null as unknown as RepositoryContributions[])).toEqual([]);
    expect(calculateCommitsByRepository(undefined as unknown as RepositoryContributions[])).toEqual([]);
  });

  it('should set percentage to 100 for user repos', () => {
    const contributions: RepositoryContributions[] = [
      { contributions: { totalCount: 50 }, repository: { name: 'repo' } as Repository },
    ];

    const result = calculateCommitsByRepository(contributions);

    expect(result[0].percentage).toBe(100);
  });
});

describe('calculateLanguageStatistics', () => {
  it('should calculate language usage statistics', () => {
    const repos = [
      createMockRepo({
        languages: {
          totalSize: 150000,
          edges: [
            { size: 100000, node: { name: 'TypeScript' } },
            { size: 50000, node: { name: 'JavaScript' } },
          ],
        },
      }),
      createMockRepo({
        id: 'repo-2',
        languages: {
          totalSize: 100000,
          edges: [
            { size: 60000, node: { name: 'TypeScript' } },
            { size: 40000, node: { name: 'CSS' } },
          ],
        },
      }),
    ];

    const result = calculateLanguageStatistics(repos);

    expect(result).toHaveLength(3);
    expect(result[0].name).toBe('TypeScript');
    expect(result[0].size).toBe(160000);
    expect(result[0].repositoryCount).toBe(2);
  });

  it('should calculate percentages correctly', () => {
    const repos = [
      createMockRepo({
        languages: {
          totalSize: 100000,
          edges: [
            { size: 60000, node: { name: 'TypeScript' } },
            { size: 40000, node: { name: 'JavaScript' } },
          ],
        },
      }),
    ];

    const result = calculateLanguageStatistics(repos);

    expect(result[0].percentage).toBe(60);
    expect(result[1].percentage).toBe(40);
  });

  it('should sort by size in descending order', () => {
    const repos = [
      createMockRepo({
        languages: {
          totalSize: 100000,
          edges: [
            { size: 10000, node: { name: 'CSS' } },
            { size: 60000, node: { name: 'TypeScript' } },
            { size: 30000, node: { name: 'JavaScript' } },
          ],
        },
      }),
    ];

    const result = calculateLanguageStatistics(repos);

    expect(result[0].name).toBe('TypeScript');
    expect(result[1].name).toBe('JavaScript');
    expect(result[2].name).toBe('CSS');
  });

  it('should return empty array for empty input', () => {
    expect(calculateLanguageStatistics([])).toEqual([]);
  });

  it('should handle repos with no languages', () => {
    const repos = [
      createMockRepo({
        languages: { totalSize: 0, edges: [] },
      }),
    ];

    const result = calculateLanguageStatistics(repos);

    expect(result).toEqual([]);
  });

  it('should count repositories correctly', () => {
    const repos = [
      createMockRepo({
        id: 'a',
        languages: {
          totalSize: 100000,
          edges: [{ size: 100000, node: { name: 'TypeScript' } }],
        },
      }),
      createMockRepo({
        id: 'b',
        languages: {
          totalSize: 50000,
          edges: [{ size: 50000, node: { name: 'TypeScript' } }],
        },
      }),
      createMockRepo({
        id: 'c',
        languages: {
          totalSize: 30000,
          edges: [{ size: 30000, node: { name: 'Python' } }],
        },
      }),
    ];

    const result = calculateLanguageStatistics(repos);

    const tsStats = result.find((s) => s.name === 'TypeScript');
    expect(tsStats?.repositoryCount).toBe(2);

    const pyStats = result.find((s) => s.name === 'Python');
    expect(pyStats?.repositoryCount).toBe(1);
  });
});

describe('getTopLanguages', () => {
  it('should return top N languages', () => {
    const repos = [
      createMockRepo({
        languages: {
          totalSize: 500000,
          edges: [
            { size: 200000, node: { name: 'TypeScript' } },
            { size: 150000, node: { name: 'JavaScript' } },
            { size: 100000, node: { name: 'CSS' } },
            { size: 30000, node: { name: 'HTML' } },
            { size: 20000, node: { name: 'Shell' } },
          ],
        },
      }),
    ];

    const top3 = getTopLanguages(repos, 3);

    expect(top3).toHaveLength(3);
    expect(top3).toEqual(['TypeScript', 'JavaScript', 'CSS']);
  });

  it('should default to top 5 languages', () => {
    const repos = [
      createMockRepo({
        languages: {
          totalSize: 600000,
          edges: Array.from({ length: 10 }, (_, i) => ({
            size: (10 - i) * 10000,
            node: { name: `Lang${i}` },
          })),
        },
      }),
    ];

    const topLanguages = getTopLanguages(repos);

    expect(topLanguages).toHaveLength(5);
  });

  it('should handle fewer languages than limit', () => {
    const repos = [
      createMockRepo({
        languages: {
          totalSize: 100000,
          edges: [
            { size: 60000, node: { name: 'TypeScript' } },
            { size: 40000, node: { name: 'JavaScript' } },
          ],
        },
      }),
    ];

    const top5 = getTopLanguages(repos, 5);

    expect(top5).toHaveLength(2);
  });
});

describe('calculateYearlyCommitStats', () => {
  it('should calculate stats for 3 years', () => {
    const yearlyContributions = {
      year1: { totalCommitContributions: 500 },
      year2: { totalCommitContributions: 800 },
      year3: { totalCommitContributions: 1200 },
    };

    const result = calculateYearlyCommitStats(
      yearlyContributions,
      new Date('2025-01-01')
    );

    expect(result).toHaveLength(3);
    expect(result[0].year).toBe(2025);
    expect(result[0].commits).toBe(1200);
    expect(result[1].year).toBe(2024);
    expect(result[1].commits).toBe(800);
    expect(result[2].year).toBe(2023);
    expect(result[2].commits).toBe(500);
  });

  it('should use current year by default', () => {
    const yearlyContributions = {
      year1: { totalCommitContributions: 100 },
      year2: { totalCommitContributions: 200 },
      year3: { totalCommitContributions: 300 },
    };

    const result = calculateYearlyCommitStats(yearlyContributions);
    const currentYear = new Date().getFullYear();

    expect(result[0].year).toBe(currentYear);
  });

  it('should handle zero commits', () => {
    const yearlyContributions = {
      year1: { totalCommitContributions: 0 },
      year2: { totalCommitContributions: 0 },
      year3: { totalCommitContributions: 0 },
    };

    const result = calculateYearlyCommitStats(yearlyContributions);

    expect(result.every((stat) => stat.commits === 0)).toBe(true);
  });
});

describe('calculateCommitActivity', () => {
  it('should calculate activity metrics correctly', () => {
    const result = calculateCommitActivity(365, 365);

    expect(result.total).toBe(365);
    expect(result.perDay).toBe(1);
    expect(result.perWeek).toBe(7);
    expect(result.perMonth).toBeCloseTo(30.4, 1);
  });

  it('should round to 1 decimal place', () => {
    const result = calculateCommitActivity(100, 365);

    expect(result.perDay.toString().split('.')[1]?.length || 0).toBeLessThanOrEqual(1);
  });

  it('should handle zero period days', () => {
    const result = calculateCommitActivity(100, 0);

    expect(result.total).toBe(100);
    expect(result.perDay).toBe(0);
    expect(result.perWeek).toBe(0);
    expect(result.perMonth).toBe(0);
  });

  it('should handle negative period days', () => {
    const result = calculateCommitActivity(100, -10);

    expect(result.perDay).toBe(0);
  });
});

describe('getMostActiveRepositories', () => {
  it('should return top N repositories by commits', () => {
    const repos = [
      createMockRepo({
        name: 'repo-a',
        defaultBranchRef: { target: { history: { totalCount: 50 } } },
      }),
      createMockRepo({
        name: 'repo-b',
        defaultBranchRef: { target: { history: { totalCount: 200 } } },
      }),
      createMockRepo({
        name: 'repo-c',
        defaultBranchRef: { target: { history: { totalCount: 100 } } },
      }),
    ];

    const result = getMostActiveRepositories(repos, 2);

    expect(result).toHaveLength(2);
    expect(result[0].name).toBe('repo-b');
    expect(result[0].commits).toBe(200);
    expect(result[1].name).toBe('repo-c');
    expect(result[1].commits).toBe(100);
  });

  it('should filter out repos with zero commits', () => {
    const repos = [
      createMockRepo({
        name: 'active',
        defaultBranchRef: { target: { history: { totalCount: 50 } } },
      }),
      createMockRepo({
        name: 'empty',
        defaultBranchRef: null,
      }),
    ];

    const result = getMostActiveRepositories(repos, 10);

    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('active');
  });

  it('should default to top 5', () => {
    const repos = Array.from({ length: 10 }, (_, i) =>
      createMockRepo({
        name: `repo-${i}`,
        defaultBranchRef: { target: { history: { totalCount: (10 - i) * 10 } } },
      })
    );

    const result = getMostActiveRepositories(repos);

    expect(result).toHaveLength(5);
  });
});

describe('getTotalCommits', () => {
  it('should sum all commits across repositories', () => {
    const repos = [
      createMockRepo({
        defaultBranchRef: { target: { history: { totalCount: 50 } } },
      }),
      createMockRepo({
        defaultBranchRef: { target: { history: { totalCount: 100 } } },
      }),
      createMockRepo({
        defaultBranchRef: { target: { history: { totalCount: 30 } } },
      }),
    ];

    const total = getTotalCommits(repos);

    expect(total).toBe(180);
  });

  it('should return 0 for empty array', () => {
    expect(getTotalCommits([])).toBe(0);
  });

  it('should handle repos with null defaultBranchRef', () => {
    const repos = [
      createMockRepo({ defaultBranchRef: null }),
      createMockRepo({
        defaultBranchRef: { target: { history: { totalCount: 50 } } },
      }),
    ];

    const total = getTotalCommits(repos);

    expect(total).toBe(50);
  });
});

describe('getRepositoriesByLanguage', () => {
  it('should filter by primary language', () => {
    const repos = [
      createMockRepo({ name: 'ts-repo', primaryLanguage: { name: 'TypeScript' } }),
      createMockRepo({
        name: 'py-repo',
        primaryLanguage: { name: 'Python' },
        languages: {
          totalSize: 100000,
          edges: [{ size: 100000, node: { name: 'Python' } }],
        },
      }),
      createMockRepo({ name: 'ts-repo-2', primaryLanguage: { name: 'TypeScript' } }),
    ];

    const tsRepos = getRepositoriesByLanguage(repos, 'TypeScript');

    expect(tsRepos).toHaveLength(2);
    expect(tsRepos.every((r) => r.primaryLanguage?.name === 'TypeScript')).toBe(true);
  });

  it('should filter by language in edges', () => {
    const repos = [
      createMockRepo({
        name: 'mixed',
        primaryLanguage: { name: 'JavaScript' },
        languages: {
          totalSize: 100000,
          edges: [
            { size: 60000, node: { name: 'JavaScript' } },
            { size: 40000, node: { name: 'TypeScript' } },
          ],
        },
      }),
    ];

    const tsRepos = getRepositoriesByLanguage(repos, 'TypeScript');

    expect(tsRepos).toHaveLength(1);
  });

  it('should return empty array when language not found', () => {
    const repos = [
      createMockRepo({ primaryLanguage: { name: 'TypeScript' } }),
    ];

    const rustRepos = getRepositoriesByLanguage(repos, 'Rust');

    expect(rustRepos).toEqual([]);
  });
});

describe('calculateLanguageDiversity', () => {
  it('should return 0 for empty array', () => {
    expect(calculateLanguageDiversity([])).toBe(0);
  });

  it('should return 0 for single language', () => {
    const repos = [
      createMockRepo({
        primaryLanguage: { name: 'TypeScript' },
        languages: {
          totalSize: 100000,
          edges: [{ size: 100000, node: { name: 'TypeScript' } }],
        },
      }),
    ];

    const diversity = calculateLanguageDiversity(repos);

    expect(diversity).toBe(0);
  });

  it('should return 100 for 5+ languages', () => {
    const repos = [
      createMockRepo({
        languages: {
          totalSize: 500000,
          edges: [
            { size: 100000, node: { name: 'TypeScript' } },
            { size: 100000, node: { name: 'JavaScript' } },
            { size: 100000, node: { name: 'Python' } },
            { size: 100000, node: { name: 'Go' } },
            { size: 100000, node: { name: 'Rust' } },
          ],
        },
      }),
    ];

    const diversity = calculateLanguageDiversity(repos);

    expect(diversity).toBe(100);
  });

  it('should calculate proportional score for 2-4 languages', () => {
    const repos = [
      createMockRepo({
        languages: {
          totalSize: 200000,
          edges: [
            { size: 100000, node: { name: 'TypeScript' } },
            { size: 100000, node: { name: 'JavaScript' } },
          ],
        },
      }),
    ];

    const diversity = calculateLanguageDiversity(repos);

    expect(diversity).toBe(25); // (2 - 1) * 25
  });
});

describe('getCommitStatsSummary', () => {
  it('should calculate comprehensive statistics', () => {
    const contributions: ContributionsCollection = {
      totalCommitContributions: 500,
      commitContributionsByRepository: [],
    };

    const repos = [
      createMockRepo({
        name: 'repo-a',
        defaultBranchRef: { target: { history: { totalCount: 100 } } },
      }),
      createMockRepo({
        name: 'repo-b',
        defaultBranchRef: { target: { history: { totalCount: 200 } } },
      }),
      createMockRepo({
        name: 'repo-c',
        defaultBranchRef: { target: { history: { totalCount: 50 } } },
      }),
    ];

    const summary = getCommitStatsSummary(contributions, repos);

    expect(summary.totalUserCommits).toBe(500);
    expect(summary.totalRepoCommits).toBe(350);
    expect(summary.repositoryCount).toBe(3);
    expect(summary.avgCommitsPerRepo).toBe(117);
    expect(summary.topRepository).toBe('repo-b');
    expect(summary.topRepositoryCommits).toBe(200);
  });

  it('should handle empty repositories', () => {
    const contributions: ContributionsCollection = {
      totalCommitContributions: 0,
      commitContributionsByRepository: [],
    };

    const summary = getCommitStatsSummary(contributions, []);

    expect(summary.totalRepoCommits).toBe(0);
    expect(summary.repositoryCount).toBe(0);
    expect(summary.avgCommitsPerRepo).toBe(0);
    expect(summary.topRepository).toBeNull();
    expect(summary.topRepositoryCommits).toBe(0);
  });
});

describe('formatNumber', () => {
  it('should format millions', () => {
    expect(formatNumber(1500000)).toBe('1.5M');
    expect(formatNumber(2000000)).toBe('2.0M');
  });

  it('should format thousands', () => {
    expect(formatNumber(1500)).toBe('1.5k');
    expect(formatNumber(5000)).toBe('5.0k');
  });

  it('should not format numbers below 1000', () => {
    expect(formatNumber(999)).toBe('999');
    expect(formatNumber(500)).toBe('500');
    expect(formatNumber(0)).toBe('0');
  });
});

describe('formatBytes', () => {
  it('should format bytes', () => {
    expect(formatBytes(500)).toBe('500.0 B');
  });

  it('should format kilobytes', () => {
    expect(formatBytes(1500)).toBe('1.5 KB');
    expect(formatBytes(5120)).toBe('5.0 KB');
  });

  it('should format megabytes', () => {
    expect(formatBytes(1500000)).toBe('1.4 MB');
    expect(formatBytes(5242880)).toBe('5.0 MB');
  });

  it('should format gigabytes', () => {
    expect(formatBytes(1500000000)).toBe('1.4 GB');
  });

  it('should handle zero', () => {
    expect(formatBytes(0)).toBe('0 B');
  });
});
