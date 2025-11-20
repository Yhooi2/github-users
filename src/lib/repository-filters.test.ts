import { describe, it, expect } from 'vitest';
import {
  sortRepositories,
  filterRepositories,
  getUniqueLanguages,
  groupRepositories,
  getRepositoryStats,
} from './repository-filters';
import type { Repository } from '@/apollo/github-api.types';
import { createMockRepository } from '@/test/mocks/github-data';

// Helper to create mock repository (uses centralized factory)
const createMockRepo = (overrides: Partial<Repository> = {}): Repository =>
  createMockRepository({
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

describe('sortRepositories', () => {
  describe('Sort by stars', () => {
    it('should sort by stars in descending order', () => {
      const repos = [
        createMockRepo({ id: 'a', stargazerCount: 10 }),
        createMockRepo({ id: 'b', stargazerCount: 50 }),
        createMockRepo({ id: 'c', stargazerCount: 30 }),
      ];

      const sorted = sortRepositories(repos, 'stars', 'desc');

      expect(sorted[0].id).toBe('b'); // 50 stars
      expect(sorted[1].id).toBe('c'); // 30 stars
      expect(sorted[2].id).toBe('a'); // 10 stars
    });

    it('should sort by stars in ascending order', () => {
      const repos = [
        createMockRepo({ id: 'a', stargazerCount: 10 }),
        createMockRepo({ id: 'b', stargazerCount: 50 }),
        createMockRepo({ id: 'c', stargazerCount: 30 }),
      ];

      const sorted = sortRepositories(repos, 'stars', 'asc');

      expect(sorted[0].id).toBe('a'); // 10 stars
      expect(sorted[1].id).toBe('c'); // 30 stars
      expect(sorted[2].id).toBe('b'); // 50 stars
    });
  });

  describe('Sort by forks', () => {
    it('should sort by forks in descending order', () => {
      const repos = [
        createMockRepo({ id: 'a', forkCount: 5 }),
        createMockRepo({ id: 'b', forkCount: 20 }),
        createMockRepo({ id: 'c', forkCount: 10 }),
      ];

      const sorted = sortRepositories(repos, 'forks', 'desc');

      expect(sorted[0].id).toBe('b');
      expect(sorted[1].id).toBe('c');
      expect(sorted[2].id).toBe('a');
    });
  });

  describe('Sort by watchers', () => {
    it('should sort by watchers in descending order', () => {
      const repos = [
        createMockRepo({ id: 'a', watchers: { totalCount: 3 } }),
        createMockRepo({ id: 'b', watchers: { totalCount: 15 } }),
        createMockRepo({ id: 'c', watchers: { totalCount: 8 } }),
      ];

      const sorted = sortRepositories(repos, 'watchers', 'desc');

      expect(sorted[0].id).toBe('b');
      expect(sorted[1].id).toBe('c');
      expect(sorted[2].id).toBe('a');
    });
  });

  describe('Sort by commits', () => {
    it('should sort by commits in descending order', () => {
      const repos = [
        createMockRepo({
          id: 'a',
          defaultBranchRef: { target: { history: { totalCount: 50 } } },
        }),
        createMockRepo({
          id: 'b',
          defaultBranchRef: { target: { history: { totalCount: 200 } } },
        }),
        createMockRepo({
          id: 'c',
          defaultBranchRef: { target: { history: { totalCount: 100 } } },
        }),
      ];

      const sorted = sortRepositories(repos, 'commits', 'desc');

      expect(sorted[0].id).toBe('b');
      expect(sorted[1].id).toBe('c');
      expect(sorted[2].id).toBe('a');
    });

    it('should handle repos with no commits', () => {
      const repos = [
        createMockRepo({ id: 'a', defaultBranchRef: null }),
        createMockRepo({
          id: 'b',
          defaultBranchRef: { target: { history: { totalCount: 10 } } },
        }),
      ];

      const sorted = sortRepositories(repos, 'commits', 'desc');

      expect(sorted[0].id).toBe('b');
      expect(sorted[1].id).toBe('a');
    });
  });

  describe('Sort by size', () => {
    it('should sort by disk usage in descending order', () => {
      const repos = [
        createMockRepo({ id: 'a', diskUsage: 5000 }),
        createMockRepo({ id: 'b', diskUsage: 20000 }),
        createMockRepo({ id: 'c', diskUsage: 10000 }),
      ];

      const sorted = sortRepositories(repos, 'size', 'desc');

      expect(sorted[0].id).toBe('b');
      expect(sorted[1].id).toBe('c');
      expect(sorted[2].id).toBe('a');
    });
  });

  describe('Sort by dates', () => {
    it('should sort by updated date in descending order', () => {
      const repos = [
        createMockRepo({ id: 'a', updatedAt: '2024-01-01T00:00:00Z' }),
        createMockRepo({ id: 'b', updatedAt: '2024-06-01T00:00:00Z' }),
        createMockRepo({ id: 'c', updatedAt: '2024-03-01T00:00:00Z' }),
      ];

      const sorted = sortRepositories(repos, 'updated', 'desc');

      expect(sorted[0].id).toBe('b');
      expect(sorted[1].id).toBe('c');
      expect(sorted[2].id).toBe('a');
    });

    it('should sort by created date in ascending order', () => {
      const repos = [
        createMockRepo({ id: 'a', createdAt: '2024-01-01T00:00:00Z' }),
        createMockRepo({ id: 'b', createdAt: '2024-06-01T00:00:00Z' }),
        createMockRepo({ id: 'c', createdAt: '2024-03-01T00:00:00Z' }),
      ];

      const sorted = sortRepositories(repos, 'created', 'asc');

      expect(sorted[0].id).toBe('a');
      expect(sorted[1].id).toBe('c');
      expect(sorted[2].id).toBe('b');
    });
  });

  describe('Sort by name', () => {
    it('should sort alphabetically in ascending order', () => {
      const repos = [
        createMockRepo({ id: 'a', name: 'zebra' }),
        createMockRepo({ id: 'b', name: 'apple' }),
        createMockRepo({ id: 'c', name: 'mango' }),
      ];

      const sorted = sortRepositories(repos, 'name', 'asc');

      expect(sorted[0].name).toBe('apple');
      expect(sorted[1].name).toBe('mango');
      expect(sorted[2].name).toBe('zebra');
    });

    it('should sort alphabetically in descending order', () => {
      const repos = [
        createMockRepo({ id: 'a', name: 'zebra' }),
        createMockRepo({ id: 'b', name: 'apple' }),
        createMockRepo({ id: 'c', name: 'mango' }),
      ];

      const sorted = sortRepositories(repos, 'name', 'desc');

      expect(sorted[0].name).toBe('zebra');
      expect(sorted[1].name).toBe('mango');
      expect(sorted[2].name).toBe('apple');
    });
  });

  it('should not mutate original array', () => {
    const repos = [
      createMockRepo({ id: 'a', stargazerCount: 10 }),
      createMockRepo({ id: 'b', stargazerCount: 50 }),
    ];

    const original = [...repos];
    sortRepositories(repos, 'stars', 'desc');

    expect(repos).toEqual(original);
  });
});

describe('filterRepositories', () => {
  describe('Original/Fork filters', () => {
    it('should filter original repositories only', () => {
      const repos = [
        createMockRepo({ id: 'a', isFork: false }),
        createMockRepo({ id: 'b', isFork: true }),
        createMockRepo({ id: 'c', isFork: false }),
      ];

      const filtered = filterRepositories(repos, { originalOnly: true });

      expect(filtered).toHaveLength(2);
      expect(filtered.every((r) => !r.isFork)).toBe(true);
    });

    it('should filter forked repositories only', () => {
      const repos = [
        createMockRepo({ id: 'a', isFork: false }),
        createMockRepo({ id: 'b', isFork: true }),
        createMockRepo({ id: 'c', isFork: true }),
      ];

      const filtered = filterRepositories(repos, { forksOnly: true });

      expect(filtered).toHaveLength(2);
      expect(filtered.every((r) => r.isFork)).toBe(true);
    });

    it('should exclude templates from original filter', () => {
      const repos = [
        createMockRepo({ id: 'a', isFork: false, isTemplate: false }),
        createMockRepo({ id: 'b', isFork: false, isTemplate: true }),
      ];

      const filtered = filterRepositories(repos, { originalOnly: true });

      expect(filtered).toHaveLength(1);
      expect(filtered[0].id).toBe('a');
    });
  });

  describe('Archived filter', () => {
    it('should hide archived repositories', () => {
      const repos = [
        createMockRepo({ id: 'a', isArchived: false }),
        createMockRepo({ id: 'b', isArchived: true }),
        createMockRepo({ id: 'c', isArchived: false }),
      ];

      const filtered = filterRepositories(repos, { hideArchived: true });

      expect(filtered).toHaveLength(2);
      expect(filtered.every((r) => !r.isArchived)).toBe(true);
    });
  });

  describe('Language filter', () => {
    it('should filter by primary language', () => {
      const repos = [
        createMockRepo({ id: 'a', primaryLanguage: { name: 'TypeScript' } }),
        createMockRepo({ id: 'b', primaryLanguage: { name: 'Python' } }),
        createMockRepo({ id: 'c', primaryLanguage: { name: 'TypeScript' } }),
      ];

      const filtered = filterRepositories(repos, { language: 'TypeScript' });

      expect(filtered).toHaveLength(2);
      expect(filtered.every((r) => r.primaryLanguage?.name === 'TypeScript')).toBe(true);
    });

    it('should be case-insensitive', () => {
      const repos = [
        createMockRepo({ id: 'a', primaryLanguage: { name: 'TypeScript' } }),
      ];

      const filtered = filterRepositories(repos, { language: 'typescript' });

      expect(filtered).toHaveLength(1);
    });

    it('should handle repos with no primary language', () => {
      const repos = [
        createMockRepo({ id: 'a', primaryLanguage: null }),
        createMockRepo({ id: 'b', primaryLanguage: { name: 'Python' } }),
      ];

      const filtered = filterRepositories(repos, { language: 'Python' });

      expect(filtered).toHaveLength(1);
      expect(filtered[0].id).toBe('b');
    });
  });

  describe('Stars filter', () => {
    it('should filter by minimum stars', () => {
      const repos = [
        createMockRepo({ id: 'a', stargazerCount: 5 }),
        createMockRepo({ id: 'b', stargazerCount: 15 }),
        createMockRepo({ id: 'c', stargazerCount: 25 }),
      ];

      const filtered = filterRepositories(repos, { minStars: 10 });

      expect(filtered).toHaveLength(2);
      expect(filtered.every((r) => (r.stargazerCount || 0) >= 10)).toBe(true);
    });

    it('should handle zero stars filter', () => {
      const repos = [createMockRepo({ id: 'a', stargazerCount: 0 })];

      const filtered = filterRepositories(repos, { minStars: 0 });

      expect(filtered).toHaveLength(1);
    });
  });

  describe('Search query filter', () => {
    it('should filter by name', () => {
      const repos = [
        createMockRepo({ id: 'a', name: 'awesome-project' }),
        createMockRepo({ id: 'b', name: 'cool-app' }),
        createMockRepo({ id: 'c', name: 'awesome-tool' }),
      ];

      const filtered = filterRepositories(repos, { searchQuery: 'awesome' });

      expect(filtered).toHaveLength(2);
    });

    it('should filter by description', () => {
      const repos = [
        createMockRepo({ id: 'a', description: 'A React application' }),
        createMockRepo({ id: 'b', description: 'A Vue.js project' }),
        createMockRepo({ id: 'c', description: 'Another React tool' }),
      ];

      const filtered = filterRepositories(repos, { searchQuery: 'react' });

      expect(filtered).toHaveLength(2);
    });

    it('should be case-insensitive', () => {
      const repos = [
        createMockRepo({ id: 'a', name: 'TypeScript-Utility' }),
      ];

      const filtered = filterRepositories(repos, { searchQuery: 'typescript' });

      expect(filtered).toHaveLength(1);
    });

    it('should trim whitespace from query', () => {
      const repos = [createMockRepo({ id: 'a', name: 'test' })];

      const filtered = filterRepositories(repos, { searchQuery: '  test  ' });

      expect(filtered).toHaveLength(1);
    });

    it('should handle null descriptions', () => {
      const repos = [
        createMockRepo({ id: 'a', name: 'test', description: null }),
      ];

      const filtered = filterRepositories(repos, { searchQuery: 'test' });

      expect(filtered).toHaveLength(1);
    });
  });

  describe('Topics filter', () => {
    it('should filter repos with topics', () => {
      const repos = [
        createMockRepo({
          id: 'a',
          repositoryTopics: { nodes: [{ topic: { name: 'react' } }] },
        }),
        createMockRepo({ id: 'b', repositoryTopics: { nodes: [] } }),
        createMockRepo({
          id: 'c',
          repositoryTopics: { nodes: [{ topic: { name: 'vue' } }] },
        }),
      ];

      const filtered = filterRepositories(repos, { hasTopics: true });

      expect(filtered).toHaveLength(2);
      expect(filtered.every((r) => r.repositoryTopics.nodes.length > 0)).toBe(true);
    });
  });

  describe('License filter', () => {
    it('should filter repos with license', () => {
      const repos = [
        createMockRepo({ id: 'a', licenseInfo: { name: 'MIT' } }),
        createMockRepo({ id: 'b', licenseInfo: null }),
        createMockRepo({ id: 'c', licenseInfo: { name: 'Apache-2.0' } }),
      ];

      const filtered = filterRepositories(repos, { hasLicense: true });

      expect(filtered).toHaveLength(2);
      expect(filtered.every((r) => r.licenseInfo !== null)).toBe(true);
    });
  });

  describe('Combined filters', () => {
    it('should apply multiple filters together', () => {
      const repos = [
        createMockRepo({
          id: 'a',
          isFork: false,
          isArchived: false,
          stargazerCount: 50,
          primaryLanguage: { name: 'TypeScript' },
        }),
        createMockRepo({
          id: 'b',
          isFork: true,
          isArchived: false,
          stargazerCount: 30,
          primaryLanguage: { name: 'TypeScript' },
        }),
        createMockRepo({
          id: 'c',
          isFork: false,
          isArchived: true,
          stargazerCount: 100,
          primaryLanguage: { name: 'TypeScript' },
        }),
        createMockRepo({
          id: 'd',
          isFork: false,
          isArchived: false,
          stargazerCount: 5,
          primaryLanguage: { name: 'TypeScript' },
        }),
      ];

      const filtered = filterRepositories(repos, {
        originalOnly: true,
        hideArchived: true,
        minStars: 10,
        language: 'TypeScript',
      });

      expect(filtered).toHaveLength(1);
      expect(filtered[0].id).toBe('a');
    });
  });

  it('should not mutate original array', () => {
    const repos = [
      createMockRepo({ id: 'a', isFork: false }),
      createMockRepo({ id: 'b', isFork: true }),
    ];

    const original = [...repos];
    filterRepositories(repos, { originalOnly: true });

    expect(repos).toEqual(original);
  });
});

describe('getUniqueLanguages', () => {
  it('should return unique language names', () => {
    const repos = [
      createMockRepo({
        primaryLanguage: { name: 'TypeScript' },
        languages: {
          totalSize: 100000,
          edges: [
            { size: 80000, node: { name: 'TypeScript' } },
            { size: 20000, node: { name: 'JavaScript' } },
          ],
        },
      }),
      createMockRepo({
        id: 'b',
        primaryLanguage: { name: 'Python' },
        languages: {
          totalSize: 50000,
          edges: [{ size: 50000, node: { name: 'Python' } }],
        },
      }),
      createMockRepo({
        id: 'c',
        primaryLanguage: { name: 'TypeScript' },
        languages: {
          totalSize: 60000,
          edges: [{ size: 60000, node: { name: 'TypeScript' } }],
        },
      }),
    ];

    const languages = getUniqueLanguages(repos);

    expect(languages).toHaveLength(3);
    expect(languages).toContain('TypeScript');
    expect(languages).toContain('JavaScript');
    expect(languages).toContain('Python');
  });

  it('should return sorted array', () => {
    const repos = [
      createMockRepo({
        primaryLanguage: { name: 'Rust' },
        languages: { totalSize: 1000, edges: [] },
      }),
      createMockRepo({
        id: 'b',
        primaryLanguage: { name: 'Go' },
        languages: { totalSize: 1000, edges: [] },
      }),
      createMockRepo({
        id: 'c',
        primaryLanguage: { name: 'Java' },
        languages: { totalSize: 1000, edges: [] },
      }),
    ];

    const languages = getUniqueLanguages(repos);

    expect(languages).toEqual(['Go', 'Java', 'Rust']);
  });

  it('should handle repos with no languages', () => {
    const repos = [
      createMockRepo({
        primaryLanguage: null,
        languages: { totalSize: 0, edges: [] },
      }),
    ];

    const languages = getUniqueLanguages(repos);

    expect(languages).toHaveLength(0);
  });
});

describe('groupRepositories', () => {
  describe('Group by language', () => {
    it('should group by primary language', () => {
      const repos = [
        createMockRepo({ id: 'a', primaryLanguage: { name: 'TypeScript' } }),
        createMockRepo({ id: 'b', primaryLanguage: { name: 'Python' } }),
        createMockRepo({ id: 'c', primaryLanguage: { name: 'TypeScript' } }),
      ];

      const grouped = groupRepositories(repos, 'language');

      expect(grouped['TypeScript']).toHaveLength(2);
      expect(grouped['Python']).toHaveLength(1);
    });

    it('should use "Unknown" for repos without language', () => {
      const repos = [createMockRepo({ primaryLanguage: null })];

      const grouped = groupRepositories(repos, 'language');

      expect(grouped['Unknown']).toHaveLength(1);
    });
  });

  describe('Group by year', () => {
    it('should group by creation year', () => {
      const repos = [
        createMockRepo({ id: 'a', createdAt: '2023-01-01T00:00:00Z' }),
        createMockRepo({ id: 'b', createdAt: '2024-01-01T00:00:00Z' }),
        createMockRepo({ id: 'c', createdAt: '2023-06-01T00:00:00Z' }),
      ];

      const grouped = groupRepositories(repos, 'year');

      expect(grouped['2023']).toHaveLength(2);
      expect(grouped['2024']).toHaveLength(1);
    });
  });

  describe('Group by fork status', () => {
    it('should group by fork status', () => {
      const repos = [
        createMockRepo({ id: 'a', isFork: false }),
        createMockRepo({ id: 'b', isFork: true }),
        createMockRepo({ id: 'c', isFork: false }),
      ];

      const grouped = groupRepositories(repos, 'fork-status');

      expect(grouped['Original']).toHaveLength(2);
      expect(grouped['Forked']).toHaveLength(1);
    });
  });
});

describe('getRepositoryStats', () => {
  it('should calculate statistics correctly', () => {
    const repos = [
      createMockRepo({
        stargazerCount: 10,
        forkCount: 5,
        watchers: { totalCount: 2 },
        diskUsage: 1000,
        isFork: false,
        isArchived: false,
      }),
      createMockRepo({
        id: 'b',
        stargazerCount: 20,
        forkCount: 10,
        watchers: { totalCount: 8 },
        diskUsage: 2000,
        isFork: true,
        isArchived: false,
      }),
      createMockRepo({
        id: 'c',
        stargazerCount: 30,
        forkCount: 15,
        watchers: { totalCount: 10 },
        diskUsage: 3000,
        isFork: false,
        isArchived: true,
      }),
    ];

    const stats = getRepositoryStats(repos);

    expect(stats.totalStars).toBe(60);
    expect(stats.avgStars).toBe(20);
    expect(stats.totalForks).toBe(30);
    expect(stats.avgForks).toBe(10);
    expect(stats.totalWatchers).toBe(20);
    expect(stats.avgWatchers).toBe(7);
    expect(stats.totalSize).toBe(6000);
    expect(stats.avgSize).toBe(2000);
    expect(stats.originalCount).toBe(2);
    expect(stats.forkCount).toBe(1);
    expect(stats.archivedCount).toBe(1);
  });

  it('should return zero stats for empty array', () => {
    const stats = getRepositoryStats([]);

    expect(stats.totalStars).toBe(0);
    expect(stats.avgStars).toBe(0);
    expect(stats.originalCount).toBe(0);
  });

  it('should handle null values gracefully', () => {
    const repos = [
      createMockRepo({
        stargazerCount: 0,
        forkCount: 0,
        watchers: { totalCount: 0 },
        diskUsage: null,
      }),
    ];

    const stats = getRepositoryStats(repos);

    expect(stats.totalSize).toBe(0);
    expect(stats.avgSize).toBe(0);
  });
});
