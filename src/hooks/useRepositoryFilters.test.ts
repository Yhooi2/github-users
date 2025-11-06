import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useRepositoryFilters } from './useRepositoryFilters';
import {
  createMockRepository,
  mockForkedRepository,
  mockArchivedRepository,
} from '@/test/mocks/github-data';

describe('useRepositoryFilters', () => {
  describe('Initial state', () => {
    it('should initialize with empty filters', () => {
      const repositories = [createMockRepository({ name: 'repo1' })];
      const { result } = renderHook(() => useRepositoryFilters(repositories));

      expect(result.current.filters).toEqual({});
      expect(result.current.hasActiveFilters).toBe(false);
      expect(result.current.activeFilterCount).toBe(0);
    });

    it('should return all repositories when no filters are active', () => {
      const repositories = [
        createMockRepository({ name: 'repo1' }),
        createMockRepository({ name: 'repo2' }),
        createMockRepository({ name: 'repo3' }),
      ];
      const { result } = renderHook(() => useRepositoryFilters(repositories));

      expect(result.current.filteredRepositories).toHaveLength(3);
      expect(result.current.filteredRepositories).toEqual(repositories);
    });
  });

  describe('updateFilter', () => {
    it('should add a filter', () => {
      const repositories = [
        createMockRepository({ name: 'original', isFork: false }),
        mockForkedRepository,
      ];
      const { result } = renderHook(() => useRepositoryFilters(repositories));

      act(() => {
        result.current.updateFilter('originalOnly', true);
      });

      expect(result.current.filters).toEqual({ originalOnly: true });
      expect(result.current.hasActiveFilters).toBe(true);
      expect(result.current.activeFilterCount).toBe(1);
    });

    it('should update existing filter', () => {
      const repositories = [createMockRepository({ name: 'repo1', stargazerCount: 100 })];
      const { result } = renderHook(() => useRepositoryFilters(repositories));

      act(() => {
        result.current.updateFilter('minStars', 10);
      });

      expect(result.current.filters.minStars).toBe(10);

      act(() => {
        result.current.updateFilter('minStars', 50);
      });

      expect(result.current.filters.minStars).toBe(50);
    });

    it('should remove filter when value is undefined', () => {
      const repositories = [createMockRepository({ name: 'repo1' })];
      const { result } = renderHook(() => useRepositoryFilters(repositories));

      act(() => {
        result.current.updateFilter('originalOnly', true);
        result.current.updateFilter('minStars', 10);
      });

      expect(result.current.activeFilterCount).toBe(2);

      act(() => {
        result.current.updateFilter('originalOnly', undefined);
      });

      expect(result.current.filters).toEqual({ minStars: 10 });
      expect(result.current.activeFilterCount).toBe(1);
    });

    it('should remove filter when value is false', () => {
      const repositories = [createMockRepository({ name: 'repo1' })];
      const { result } = renderHook(() => useRepositoryFilters(repositories));

      act(() => {
        result.current.updateFilter('originalOnly', true);
      });

      expect(result.current.filters.originalOnly).toBe(true);

      act(() => {
        result.current.updateFilter('originalOnly', false);
      });

      expect(result.current.filters).toEqual({});
    });

    it('should remove filter when value is empty string', () => {
      const repositories = [createMockRepository({ name: 'repo1' })];
      const { result } = renderHook(() => useRepositoryFilters(repositories));

      act(() => {
        result.current.updateFilter('language', 'TypeScript');
      });

      expect(result.current.filters.language).toBe('TypeScript');

      act(() => {
        result.current.updateFilter('language', '');
      });

      expect(result.current.filters).toEqual({});
    });

    it('should support multiple filters simultaneously', () => {
      const repositories = [createMockRepository({ name: 'repo1' })];
      const { result } = renderHook(() => useRepositoryFilters(repositories));

      act(() => {
        result.current.updateFilter('originalOnly', true);
        result.current.updateFilter('minStars', 10);
        result.current.updateFilter('language', 'TypeScript');
      });

      expect(result.current.filters).toEqual({
        originalOnly: true,
        minStars: 10,
        language: 'TypeScript',
      });
      expect(result.current.activeFilterCount).toBe(3);
    });
  });

  describe('setMultipleFilters', () => {
    it('should set multiple filters at once', () => {
      const repositories = [createMockRepository({ name: 'repo1' })];
      const { result } = renderHook(() => useRepositoryFilters(repositories));

      act(() => {
        result.current.setMultipleFilters({
          originalOnly: true,
          minStars: 10,
          language: 'TypeScript',
        });
      });

      expect(result.current.filters).toEqual({
        originalOnly: true,
        minStars: 10,
        language: 'TypeScript',
      });
      expect(result.current.activeFilterCount).toBe(3);
    });

    it('should merge with existing filters', () => {
      const repositories = [createMockRepository({ name: 'repo1' })];
      const { result } = renderHook(() => useRepositoryFilters(repositories));

      act(() => {
        result.current.updateFilter('originalOnly', true);
      });

      act(() => {
        result.current.setMultipleFilters({
          minStars: 10,
          language: 'TypeScript',
        });
      });

      expect(result.current.filters).toEqual({
        originalOnly: true,
        minStars: 10,
        language: 'TypeScript',
      });
    });

    it('should override existing filter values', () => {
      const repositories = [createMockRepository({ name: 'repo1' })];
      const { result } = renderHook(() => useRepositoryFilters(repositories));

      act(() => {
        result.current.updateFilter('minStars', 10);
      });

      act(() => {
        result.current.setMultipleFilters({ minStars: 50 });
      });

      expect(result.current.filters.minStars).toBe(50);
    });
  });

  describe('clearFilters', () => {
    it('should clear all filters', () => {
      const repositories = [createMockRepository({ name: 'repo1' })];
      const { result } = renderHook(() => useRepositoryFilters(repositories));

      act(() => {
        result.current.setMultipleFilters({
          originalOnly: true,
          minStars: 10,
          language: 'TypeScript',
        });
      });

      expect(result.current.activeFilterCount).toBe(3);

      act(() => {
        result.current.clearFilters();
      });

      expect(result.current.filters).toEqual({});
      expect(result.current.hasActiveFilters).toBe(false);
      expect(result.current.activeFilterCount).toBe(0);
    });

    it('should restore original repository list', () => {
      const repositories = [
        createMockRepository({ name: 'original', isFork: false }),
        mockForkedRepository,
      ];
      const { result } = renderHook(() => useRepositoryFilters(repositories));

      act(() => {
        result.current.updateFilter('originalOnly', true);
      });

      expect(result.current.filteredRepositories).toHaveLength(1);

      act(() => {
        result.current.clearFilters();
      });

      expect(result.current.filteredRepositories).toHaveLength(2);
      expect(result.current.filteredRepositories).toEqual(repositories);
    });
  });

  describe('Filter application', () => {
    it('should filter original repositories only', () => {
      const repositories = [
        createMockRepository({ name: 'original1', isFork: false }),
        createMockRepository({ name: 'original2', isFork: false }),
        mockForkedRepository,
      ];
      const { result } = renderHook(() => useRepositoryFilters(repositories));

      act(() => {
        result.current.updateFilter('originalOnly', true);
      });

      expect(result.current.filteredRepositories).toHaveLength(2);
      expect(result.current.filteredRepositories.every((r) => !r.isFork)).toBe(true);
    });

    it('should filter forked repositories only', () => {
      const repositories = [
        createMockRepository({ name: 'original', isFork: false }),
        mockForkedRepository,
        { ...mockForkedRepository, name: 'fork2' },
      ];
      const { result } = renderHook(() => useRepositoryFilters(repositories));

      act(() => {
        result.current.updateFilter('forksOnly', true);
      });

      expect(result.current.filteredRepositories).toHaveLength(2);
      expect(result.current.filteredRepositories.every((r) => r.isFork)).toBe(true);
    });

    it('should hide archived repositories', () => {
      const repositories = [
        createMockRepository({ name: 'active', isArchived: false }),
        mockArchivedRepository,
      ];
      const { result } = renderHook(() => useRepositoryFilters(repositories));

      act(() => {
        result.current.updateFilter('hideArchived', true);
      });

      expect(result.current.filteredRepositories).toHaveLength(1);
      expect(result.current.filteredRepositories[0].isArchived).toBe(false);
    });

    it('should filter by language', () => {
      const repositories = [
        createMockRepository({
          name: 'ts-repo',
          primaryLanguage: { name: 'TypeScript' },
        }),
        createMockRepository({
          name: 'js-repo',
          primaryLanguage: { name: 'JavaScript' },
        }),
      ];
      const { result } = renderHook(() => useRepositoryFilters(repositories));

      act(() => {
        result.current.updateFilter('language', 'TypeScript');
      });

      expect(result.current.filteredRepositories).toHaveLength(1);
      expect(result.current.filteredRepositories[0].primaryLanguage?.name).toBe('TypeScript');
    });

    it('should filter by minimum stars', () => {
      const repositories = [
        createMockRepository({ name: 'popular', stargazerCount: 100 }),
        createMockRepository({ name: 'moderate', stargazerCount: 50 }),
        createMockRepository({ name: 'unpopular', stargazerCount: 5 }),
      ];
      const { result } = renderHook(() => useRepositoryFilters(repositories));

      act(() => {
        result.current.updateFilter('minStars', 20);
      });

      expect(result.current.filteredRepositories).toHaveLength(2);
      expect(
        result.current.filteredRepositories.every((r) => (r.stargazerCount || 0) >= 20)
      ).toBe(true);
    });

    it('should filter by search query', () => {
      const repositories = [
        createMockRepository({ name: 'react-app', description: 'A React application' }),
        createMockRepository({ name: 'vue-app', description: 'A Vue application' }),
      ];
      const { result } = renderHook(() => useRepositoryFilters(repositories));

      act(() => {
        result.current.updateFilter('searchQuery', 'react');
      });

      expect(result.current.filteredRepositories).toHaveLength(1);
      expect(result.current.filteredRepositories[0].name).toBe('react-app');
    });

    it('should filter repositories with topics', () => {
      const repositories = [
        createMockRepository({
          name: 'with-topics',
          repositoryTopics: { nodes: [{ topic: { name: 'react' } }] },
        }),
        createMockRepository({
          name: 'no-topics',
          repositoryTopics: { nodes: [] },
        }),
      ];
      const { result } = renderHook(() => useRepositoryFilters(repositories));

      act(() => {
        result.current.updateFilter('hasTopics', true);
      });

      expect(result.current.filteredRepositories).toHaveLength(1);
      expect(result.current.filteredRepositories[0].name).toBe('with-topics');
    });

    it('should filter repositories with license', () => {
      const repositories = [
        createMockRepository({
          name: 'licensed',
          licenseInfo: { name: 'MIT License' },
        }),
        createMockRepository({
          name: 'unlicensed',
          licenseInfo: null,
        }),
      ];
      const { result } = renderHook(() => useRepositoryFilters(repositories));

      act(() => {
        result.current.updateFilter('hasLicense', true);
      });

      expect(result.current.filteredRepositories).toHaveLength(1);
      expect(result.current.filteredRepositories[0].name).toBe('licensed');
    });

    it('should apply multiple filters together', () => {
      const repositories = [
        createMockRepository({
          name: 'perfect-match',
          isFork: false,
          isArchived: false,
          stargazerCount: 100,
          primaryLanguage: { name: 'TypeScript' },
        }),
        createMockRepository({
          name: 'fork-match',
          isFork: true,
          isArchived: false,
          stargazerCount: 100,
          primaryLanguage: { name: 'TypeScript' },
        }),
        createMockRepository({
          name: 'archived-match',
          isFork: false,
          isArchived: true,
          stargazerCount: 100,
          primaryLanguage: { name: 'TypeScript' },
        }),
        createMockRepository({
          name: 'low-stars',
          isFork: false,
          isArchived: false,
          stargazerCount: 5,
          primaryLanguage: { name: 'TypeScript' },
        }),
      ];
      const { result } = renderHook(() => useRepositoryFilters(repositories));

      act(() => {
        result.current.setMultipleFilters({
          originalOnly: true,
          hideArchived: true,
          minStars: 10,
          language: 'TypeScript',
        });
      });

      expect(result.current.filteredRepositories).toHaveLength(1);
      expect(result.current.filteredRepositories[0].name).toBe('perfect-match');
    });
  });

  describe('Memoization behavior', () => {
    it('should return same filtered array reference when filters unchanged', () => {
      const repositories = [createMockRepository({ name: 'repo1' })];
      const { result, rerender } = renderHook(() => useRepositoryFilters(repositories));

      const firstResult = result.current.filteredRepositories;
      rerender();
      const secondResult = result.current.filteredRepositories;

      expect(firstResult).toBe(secondResult);
    });

    it('should recalculate when repositories change', () => {
      const repositories1 = [createMockRepository({ name: 'repo1' })];
      const repositories2 = [createMockRepository({ name: 'repo2' })];

      const { result, rerender } = renderHook(
        ({ repos }) => useRepositoryFilters(repos),
        {
          initialProps: { repos: repositories1 },
        }
      );

      const firstResult = result.current.filteredRepositories;
      rerender({ repos: repositories2 });
      const secondResult = result.current.filteredRepositories;

      expect(firstResult).not.toBe(secondResult);
      expect(secondResult[0].name).toBe('repo2');
    });

    it('should recalculate when filters change', () => {
      const repositories = [
        createMockRepository({ name: 'original', isFork: false }),
        mockForkedRepository,
      ];
      const { result } = renderHook(() => useRepositoryFilters(repositories));

      const initialResult = result.current.filteredRepositories;

      act(() => {
        result.current.updateFilter('originalOnly', true);
      });

      const filteredResult = result.current.filteredRepositories;

      expect(initialResult).not.toBe(filteredResult);
      expect(initialResult).toHaveLength(2);
      expect(filteredResult).toHaveLength(1);
    });
  });

  describe('Edge cases', () => {
    it('should handle empty repository array', () => {
      const { result } = renderHook(() => useRepositoryFilters([]));

      expect(result.current.filteredRepositories).toEqual([]);
    });

    it('should handle filters that match no repositories', () => {
      const repositories = [
        createMockRepository({ name: 'repo1', stargazerCount: 5 }),
      ];
      const { result } = renderHook(() => useRepositoryFilters(repositories));

      act(() => {
        result.current.updateFilter('minStars', 100);
      });

      expect(result.current.filteredRepositories).toEqual([]);
    });

    it('should handle repositories with null values', () => {
      const repositories = [
        createMockRepository({
          name: 'null-repo',
          primaryLanguage: null,
          licenseInfo: null,
        }),
      ];
      const { result } = renderHook(() => useRepositoryFilters(repositories));

      act(() => {
        result.current.updateFilter('language', 'TypeScript');
      });

      expect(result.current.filteredRepositories).toEqual([]);
    });
  });
});
