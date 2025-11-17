import { describe, it, expectTypeOf, expect } from 'vitest';
import type {
  AuthenticityScore,
  LanguageStats,
  RepositoryCommitStats,
  YearlyCommitStats,
  CommitActivity,
  CommitStatsSummary,
  LanguageDiversity,
  RepositoryStats,
} from './metrics';

describe('Metrics Types', () => {
  describe('AuthenticityScore', () => {
    it('should have required properties', () => {
      const score: AuthenticityScore = {
        score: 75,
        category: 'High',
        breakdown: {
          originalityScore: 20,
          activityScore: 18,
          engagementScore: 15,
          codeOwnershipScore: 22,
        },
        flags: ['hasForkedRepos'],
        metadata: {
          totalRepos: 10,
          originalRepos: 8,
          forkedRepos: 2,
          archivedRepos: 1,
          templateRepos: 0,
        },
      };

      expectTypeOf(score).toEqualTypeOf<AuthenticityScore>();
    });

    it('should have score as number', () => {
      expectTypeOf<AuthenticityScore>().toHaveProperty('score').toEqualTypeOf<number>();
    });

    it('should have category as string literal union', () => {
      expectTypeOf<AuthenticityScore>()
        .toHaveProperty('category')
        .toEqualTypeOf<'High' | 'Medium' | 'Low' | 'Suspicious'>();
    });

    it('should accept all valid categories', () => {
      const categories: AuthenticityScore['category'][] = ['High', 'Medium', 'Low', 'Suspicious'];

      categories.forEach((category) => {
        expectTypeOf(category).toEqualTypeOf<AuthenticityScore['category']>();
      });
    });

    it('should have breakdown with all score components', () => {
      expectTypeOf<AuthenticityScore['breakdown']>().toMatchTypeOf<{
        originalityScore: number;
        activityScore: number;
        engagementScore: number;
        codeOwnershipScore: number;
      }>();
    });

    it('should have flags as string array', () => {
      expectTypeOf<AuthenticityScore>().toHaveProperty('flags').toEqualTypeOf<string[]>();
    });

    it('should have metadata with repository counts', () => {
      expectTypeOf<AuthenticityScore['metadata']>().toMatchTypeOf<{
        totalRepos: number;
        originalRepos: number;
        forkedRepos: number;
        archivedRepos: number;
        templateRepos: number;
      }>();
    });
  });

  describe('LanguageStats', () => {
    it('should have all required properties', () => {
      const stats: LanguageStats = {
        name: 'TypeScript',
        color: '#3178c6',
        bytes: 50000,
        percentage: 45.5,
        repositoryCount: 5,
      };

      expectTypeOf(stats).toEqualTypeOf<LanguageStats>();
    });

    it('should have name and color as strings', () => {
      expectTypeOf<LanguageStats>().toHaveProperty('name').toEqualTypeOf<string>();
      expectTypeOf<LanguageStats>().toHaveProperty('color').toEqualTypeOf<string>();
    });

    it('should have numeric properties', () => {
      expectTypeOf<LanguageStats>().toHaveProperty('bytes').toEqualTypeOf<number>();
      expectTypeOf<LanguageStats>().toHaveProperty('percentage').toEqualTypeOf<number>();
      expectTypeOf<LanguageStats>().toHaveProperty('repositoryCount').toEqualTypeOf<number>();
    });
  });

  describe('RepositoryCommitStats', () => {
    it('should have repository name and commit counts', () => {
      const stats: RepositoryCommitStats = {
        repositoryName: 'awesome-project',
        commits: 150,
        percentage: 25.5,
      };

      expectTypeOf(stats).toEqualTypeOf<RepositoryCommitStats>();
    });
  });

  describe('YearlyCommitStats', () => {
    it('should have year, commits, and repository count', () => {
      const stats: YearlyCommitStats = {
        year: 2024,
        commits: 500,
        repositories: 10,
      };

      expectTypeOf(stats).toEqualTypeOf<YearlyCommitStats>();
    });

    it('should have all numeric properties', () => {
      expectTypeOf<YearlyCommitStats>().toHaveProperty('year').toEqualTypeOf<number>();
      expectTypeOf<YearlyCommitStats>().toHaveProperty('commits').toEqualTypeOf<number>();
      expectTypeOf<YearlyCommitStats>().toHaveProperty('repositories').toEqualTypeOf<number>();
    });
  });

  describe('CommitActivity', () => {
    it('should have activity rates for all time periods', () => {
      const activity: CommitActivity = {
        perDay: 1.5,
        perWeek: 10.5,
        perMonth: 42,
        perYear: 500,
      };

      expectTypeOf(activity).toEqualTypeOf<CommitActivity>();
    });

    it('should have all numeric properties', () => {
      expectTypeOf<CommitActivity>().toHaveProperty('perDay').toEqualTypeOf<number>();
      expectTypeOf<CommitActivity>().toHaveProperty('perWeek').toEqualTypeOf<number>();
      expectTypeOf<CommitActivity>().toHaveProperty('perMonth').toEqualTypeOf<number>();
      expectTypeOf<CommitActivity>().toHaveProperty('perYear').toEqualTypeOf<number>();
    });
  });

  describe('CommitStatsSummary', () => {
    it('should have comprehensive commit statistics', () => {
      const summary: CommitStatsSummary = {
        total: 1000,
        byRepository: [
          { repositoryName: 'repo1', commits: 500, percentage: 50 },
          { repositoryName: 'repo2', commits: 500, percentage: 50 },
        ],
        byYear: [
          { year: 2024, commits: 600, repositories: 5 },
          { year: 2023, commits: 400, repositories: 5 },
        ],
        activity: {
          perDay: 2.5,
          perWeek: 17.5,
          perMonth: 70,
          perYear: 840,
        },
        mostActiveRepository: 'repo1',
        averagePerRepository: 100,
      };

      expectTypeOf(summary).toEqualTypeOf<CommitStatsSummary>();
    });

    it('should have total as number', () => {
      expectTypeOf<CommitStatsSummary>().toHaveProperty('total').toEqualTypeOf<number>();
    });

    it('should have byRepository as array', () => {
      expectTypeOf<CommitStatsSummary>()
        .toHaveProperty('byRepository')
        .toEqualTypeOf<RepositoryCommitStats[]>();
    });

    it('should have byYear as array', () => {
      expectTypeOf<CommitStatsSummary>()
        .toHaveProperty('byYear')
        .toEqualTypeOf<YearlyCommitStats[]>();
    });

    it('should have activity object', () => {
      expectTypeOf<CommitStatsSummary>()
        .toHaveProperty('activity')
        .toEqualTypeOf<CommitActivity>();
    });

    it('should have mostActiveRepository as string or null', () => {
      expectTypeOf<CommitStatsSummary>()
        .toHaveProperty('mostActiveRepository')
        .toEqualTypeOf<string | null>();
    });

    it('should have averagePerRepository as number', () => {
      expectTypeOf<CommitStatsSummary>()
        .toHaveProperty('averagePerRepository')
        .toEqualTypeOf<number>();
    });
  });

  describe('LanguageDiversity', () => {
    it('should have diversity metrics', () => {
      const diversity: LanguageDiversity = {
        score: 75,
        uniqueLanguages: 8,
        primaryLanguage: 'TypeScript',
        distribution: 'Diverse',
      };

      expectTypeOf(diversity).toEqualTypeOf<LanguageDiversity>();
    });

    it('should have score and uniqueLanguages as numbers', () => {
      expectTypeOf<LanguageDiversity>().toHaveProperty('score').toEqualTypeOf<number>();
      expectTypeOf<LanguageDiversity>().toHaveProperty('uniqueLanguages').toEqualTypeOf<number>();
    });

    it('should have primaryLanguage as string or null', () => {
      expectTypeOf<LanguageDiversity>()
        .toHaveProperty('primaryLanguage')
        .toEqualTypeOf<string | null>();
    });

    it('should have distribution as string literal union', () => {
      expectTypeOf<LanguageDiversity>()
        .toHaveProperty('distribution')
        .toEqualTypeOf<'Diverse' | 'Moderate' | 'Focused' | 'Single'>();
    });

    it('should accept all valid distribution values', () => {
      const distributions: LanguageDiversity['distribution'][] = [
        'Diverse',
        'Moderate',
        'Focused',
        'Single',
      ];

      distributions.forEach((dist) => {
        expectTypeOf(dist).toEqualTypeOf<LanguageDiversity['distribution']>();
      });
    });
  });

  describe('RepositoryStats', () => {
    it('should have comprehensive repository statistics', () => {
      const stats: RepositoryStats = {
        total: 20,
        original: 18,
        forked: 2,
        archived: 1,
        templates: 0,
        withTopics: 15,
        withLicense: 12,
        averageStars: 45.5,
        averageForks: 8.2,
        averageSize: 5000,
        totalStars: 910,
        totalForks: 164,
        totalSize: 100000,
      };

      expectTypeOf(stats).toEqualTypeOf<RepositoryStats>();
    });

    it('should have all count properties as numbers', () => {
      expectTypeOf<RepositoryStats>().toHaveProperty('total').toEqualTypeOf<number>();
      expectTypeOf<RepositoryStats>().toHaveProperty('original').toEqualTypeOf<number>();
      expectTypeOf<RepositoryStats>().toHaveProperty('forked').toEqualTypeOf<number>();
      expectTypeOf<RepositoryStats>().toHaveProperty('archived').toEqualTypeOf<number>();
      expectTypeOf<RepositoryStats>().toHaveProperty('templates').toEqualTypeOf<number>();
      expectTypeOf<RepositoryStats>().toHaveProperty('withTopics').toEqualTypeOf<number>();
      expectTypeOf<RepositoryStats>().toHaveProperty('withLicense').toEqualTypeOf<number>();
    });

    it('should have all average properties as numbers', () => {
      expectTypeOf<RepositoryStats>().toHaveProperty('averageStars').toEqualTypeOf<number>();
      expectTypeOf<RepositoryStats>().toHaveProperty('averageForks').toEqualTypeOf<number>();
      expectTypeOf<RepositoryStats>().toHaveProperty('averageSize').toEqualTypeOf<number>();
    });

    it('should have all total properties as numbers', () => {
      expectTypeOf<RepositoryStats>().toHaveProperty('totalStars').toEqualTypeOf<number>();
      expectTypeOf<RepositoryStats>().toHaveProperty('totalForks').toEqualTypeOf<number>();
      expectTypeOf<RepositoryStats>().toHaveProperty('totalSize').toEqualTypeOf<number>();
    });
  });

  describe('Type compositions', () => {
    it('should use RepositoryCommitStats in CommitStatsSummary', () => {
      expectTypeOf<CommitStatsSummary['byRepository']>().toEqualTypeOf<RepositoryCommitStats[]>();
    });

    it('should use YearlyCommitStats in CommitStatsSummary', () => {
      expectTypeOf<CommitStatsSummary['byYear']>().toEqualTypeOf<YearlyCommitStats[]>();
    });

    it('should use CommitActivity in CommitStatsSummary', () => {
      expectTypeOf<CommitStatsSummary['activity']>().toEqualTypeOf<CommitActivity>();
    });
  });

  describe('Metric type guards', () => {
    it('should validate AuthenticityScore category values', () => {
      const validCategories: AuthenticityScore['category'][] = ['High', 'Medium', 'Low', 'Suspicious'];

      validCategories.forEach((category) => {
        expect(['High', 'Medium', 'Low', 'Suspicious']).toContain(category);
      });
    });

    it('should validate LanguageDiversity distribution values', () => {
      const validDistributions: LanguageDiversity['distribution'][] = [
        'Diverse',
        'Moderate',
        'Focused',
        'Single',
      ];

      validDistributions.forEach((dist) => {
        expect(['Diverse', 'Moderate', 'Focused', 'Single']).toContain(dist);
      });
    });
  });
});
