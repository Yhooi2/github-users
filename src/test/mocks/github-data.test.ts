import { describe, it, expect } from 'vitest';
import {
  mockRepository,
  mockUser,
  mockForkedRepository,
  mockArchivedRepository,
  mockTemplateRepository,
  mockEmptyRepository,
  mockPopularRepository,
  mockLowEngagementRepository,
  mockJavaScriptRepository,
  mockMultiLanguageRepository,
  mockNoLicenseRepository,
  mockNoTopicsRepository,
  mockRepositoryCollection,
  mockOriginalRepositories,
  mockInactiveRepositories,
  createMockRepository,
  createMockUser,
  createMockRepositories,
} from './github-data';

describe('GitHub Mock Data', () => {
  describe('mockRepository', () => {
    it('should have all required fields', () => {
      expect(mockRepository).toHaveProperty('id');
      expect(mockRepository).toHaveProperty('name');
      expect(mockRepository).toHaveProperty('description');
      expect(mockRepository).toHaveProperty('stargazerCount');
      expect(mockRepository).toHaveProperty('forkCount');
      expect(mockRepository).toHaveProperty('isFork');
      expect(mockRepository).toHaveProperty('createdAt');
      expect(mockRepository).toHaveProperty('primaryLanguage');
    });

    it('should not be forked by default', () => {
      expect(mockRepository.isFork).toBe(false);
      expect(mockRepository.parent).toBeNull();
    });

    it('should not be archived by default', () => {
      expect(mockRepository.isArchived).toBe(false);
    });

    it('should have recent activity', () => {
      expect(mockRepository.pushedAt).toBeTruthy();
      const pushedDate = new Date(mockRepository.pushedAt!);
      const now = new Date();
      const daysDiff = (now.getTime() - pushedDate.getTime()) / (1000 * 60 * 60 * 24);
      expect(daysDiff).toBeLessThan(365); // Within last year
    });
  });

  describe('mockUser', () => {
    it('should have all required fields', () => {
      expect(mockUser).toHaveProperty('id');
      expect(mockUser).toHaveProperty('login');
      expect(mockUser).toHaveProperty('name');
      expect(mockUser).toHaveProperty('avatarUrl');
      expect(mockUser).toHaveProperty('bio');
      expect(mockUser).toHaveProperty('repositories');
    });

    it('should have repositories', () => {
      expect(mockUser.repositories.nodes).toBeInstanceOf(Array);
      expect(mockUser.repositories.nodes.length).toBeGreaterThan(0);
    });

    it('should have yearly contributions', () => {
      expect(mockUser.year1.totalCommitContributions).toBeGreaterThan(0);
      expect(mockUser.year2.totalCommitContributions).toBeGreaterThan(0);
      expect(mockUser.year3.totalCommitContributions).toBeGreaterThan(0);
    });
  });

  describe('createMockRepository', () => {
    it('should create repository with default values', () => {
      const repo = createMockRepository();
      expect(repo.name).toBe('test-repository');
      expect(repo.isFork).toBe(false);
    });

    it('should override specific fields', () => {
      const repo = createMockRepository({
        name: 'custom-repo',
        stargazerCount: 9999,
      });
      expect(repo.name).toBe('custom-repo');
      expect(repo.stargazerCount).toBe(9999);
      expect(repo.isFork).toBe(false); // Should keep default for non-overridden fields
    });

    it('should allow creating forked repository', () => {
      const repo = createMockRepository({
        isFork: true,
        parent: {
          name: 'original',
          owner: { login: 'owner' },
          url: 'https://github.com/owner/original',
        },
      });
      expect(repo.isFork).toBe(true);
      expect(repo.parent).toBeTruthy();
    });
  });

  describe('createMockUser', () => {
    it('should create user with default values', () => {
      const user = createMockUser();
      expect(user.login).toBe('testuser');
    });

    it('should override specific fields', () => {
      const user = createMockUser({
        login: 'customuser',
        followers: { totalCount: 10000 },
      });
      expect(user.login).toBe('customuser');
      expect(user.followers.totalCount).toBe(10000);
    });
  });

  describe('pre-configured mocks', () => {
    it('mockForkedRepository should be a fork', () => {
      expect(mockForkedRepository.isFork).toBe(true);
      expect(mockForkedRepository.parent).toBeTruthy();
    });

    it('mockArchivedRepository should be archived', () => {
      expect(mockArchivedRepository.isArchived).toBe(true);
    });

    it('mockTemplateRepository should be a template', () => {
      expect(mockTemplateRepository.isTemplate).toBe(true);
    });

    it('mockEmptyRepository should have no commits', () => {
      expect(mockEmptyRepository.defaultBranchRef).toBeNull();
      expect(mockEmptyRepository.stargazerCount).toBe(0);
    });

    it('mockPopularRepository should have many stars', () => {
      expect(mockPopularRepository.stargazerCount).toBeGreaterThanOrEqual(1000);
    });

    it('mockLowEngagementRepository should have low engagement', () => {
      expect(mockLowEngagementRepository.stargazerCount).toBeLessThanOrEqual(5);
      expect(mockLowEngagementRepository.forkCount).toBe(0);
    });

    it('mockJavaScriptRepository should use JavaScript', () => {
      expect(mockJavaScriptRepository.primaryLanguage?.name).toBe('JavaScript');
    });

    it('mockMultiLanguageRepository should have multiple languages', () => {
      expect(mockMultiLanguageRepository.languages.edges.length).toBeGreaterThan(3);
    });

    it('mockNoLicenseRepository should not have license', () => {
      expect(mockNoLicenseRepository.licenseInfo).toBeNull();
    });

    it('mockNoTopicsRepository should not have topics', () => {
      expect(mockNoTopicsRepository.repositoryTopics.nodes).toHaveLength(0);
    });
  });

  describe('mock collections', () => {
    it('mockRepositoryCollection should contain diverse repos', () => {
      expect(mockRepositoryCollection.length).toBeGreaterThan(5);
      expect(mockRepositoryCollection).toContain(mockRepository);
      expect(mockRepositoryCollection).toContain(mockForkedRepository);
      expect(mockRepositoryCollection).toContain(mockArchivedRepository);
    });

    it('mockOriginalRepositories should only contain non-forked repos', () => {
      const allOriginal = mockOriginalRepositories.every((repo) => !repo.isFork);
      expect(allOriginal).toBe(true);
    });

    it('mockInactiveRepositories should have old push dates', () => {
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

      const allOld = mockInactiveRepositories.every((repo) => {
        if (!repo.pushedAt) return false;
        return new Date(repo.pushedAt) < oneYearAgo;
      });
      expect(allOld).toBe(true);
    });
  });

  describe('createMockRepositories', () => {
    it('should create specified number of repositories', () => {
      const repos = createMockRepositories(5);
      expect(repos).toHaveLength(5);
    });

    it('should create repositories with unique IDs and names', () => {
      const repos = createMockRepositories(3);
      const ids = repos.map((r) => r.id);
      const names = repos.map((r) => r.name);

      expect(new Set(ids).size).toBe(3);
      expect(new Set(names).size).toBe(3);
    });

    it('should apply overrides to all repositories', () => {
      const repos = createMockRepositories(3, {
        stargazerCount: 100,
        isFork: true,
      });

      repos.forEach((repo) => {
        expect(repo.stargazerCount).toBe(100);
        expect(repo.isFork).toBe(true);
      });
    });

    it('should create empty array when count is 0', () => {
      const repos = createMockRepositories(0);
      expect(repos).toHaveLength(0);
    });
  });

  describe('mock data consistency', () => {
    it('all repositories should have required GraphQL fields', () => {
      const allRepos = [
        mockRepository,
        mockForkedRepository,
        mockArchivedRepository,
        mockTemplateRepository,
        mockEmptyRepository,
        mockPopularRepository,
      ];

      allRepos.forEach((repo) => {
        expect(repo).toHaveProperty('id');
        expect(repo).toHaveProperty('name');
        expect(repo).toHaveProperty('url');
        expect(repo).toHaveProperty('createdAt');
        expect(repo).toHaveProperty('updatedAt');
        expect(repo).toHaveProperty('isFork');
        expect(repo).toHaveProperty('isTemplate');
        expect(repo).toHaveProperty('isArchived');
      });
    });

    it('timestamps should be valid ISO strings', () => {
      expect(() => new Date(mockRepository.createdAt)).not.toThrow();
      expect(() => new Date(mockRepository.updatedAt)).not.toThrow();
      if (mockRepository.pushedAt) {
        expect(() => new Date(mockRepository.pushedAt!)).not.toThrow();
      }
    });

    it('numeric fields should be non-negative', () => {
      expect(mockRepository.stargazerCount).toBeGreaterThanOrEqual(0);
      expect(mockRepository.forkCount).toBeGreaterThanOrEqual(0);
      expect(mockRepository.watchers.totalCount).toBeGreaterThanOrEqual(0);
      expect(mockRepository.issues.totalCount).toBeGreaterThanOrEqual(0);
    });
  });
});
