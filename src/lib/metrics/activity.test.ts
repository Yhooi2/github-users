import { describe, it, expect } from 'vitest';
import { calculateActivityScore, getActivityLabel } from './activity';
import type { YearData } from '@/hooks/useUserAnalytics';

// Helper to create mock year data
function createYearData(
  year: number,
  totalCommits: number,
  ownedReposCount = 1,
  contributionsCount = 0
): YearData {
  return {
    year,
    totalCommits,
    totalIssues: 0,
    totalPRs: 0,
    totalReviews: 0,
    ownedRepos: Array.from({ length: ownedReposCount }, (_, i) => ({
      contributions: {
        totalCount: totalCommits,
      },
      repository: {
        name: `repo-${year}-${i}`,
        url: `https://github.com/user/repo-${year}-${i}`,
        owner: { login: 'user' },
        stargazerCount: 0,
        forkCount: 0,
        watchers: { totalCount: 0 },
        isArchived: false,
        isFork: false,
        isPrivate: false,
        primaryLanguage: null,
      },
    })),
    contributions: Array.from({ length: contributionsCount }, (_, i) => ({
      contributions: {
        totalCount: 10,
      },
      repository: {
        name: `contrib-${year}-${i}`,
        url: `https://github.com/other/contrib-${year}-${i}`,
        owner: { login: 'other' },
        stargazerCount: 0,
        forkCount: 0,
        watchers: { totalCount: 0 },
        isArchived: false,
        isFork: false,
        isPrivate: false,
        primaryLanguage: null,
      },
    })),
  };
}

describe('calculateActivityScore', () => {
  describe('empty data', () => {
    it('returns 0 score for empty timeline', () => {
      const result = calculateActivityScore([]);
      expect(result.score).toBe(0);
      expect(result.level).toBe('Low');
      expect(result.breakdown).toEqual({
        recentCommits: 0,
        consistency: 0,
        diversity: 0,
      });
      expect(result.details).toEqual({
        last3MonthsCommits: 0,
        activeMonths: 0,
        uniqueRepos: 0,
      });
    });
  });

  describe('recent commits component (0-40 points)', () => {
    it('awards full 40 points for 200+ commits in 3 months', () => {
      const timeline = [createYearData(2025, 200)];
      const result = calculateActivityScore(timeline);
      expect(result.breakdown.recentCommits).toBe(40);
    });

    it('awards proportional points for fewer commits', () => {
      const timeline = [createYearData(2025, 100)];
      const result = calculateActivityScore(timeline);
      expect(result.breakdown.recentCommits).toBe(20); // 100/200 * 40 = 20
    });

    it('caps at 40 points for 200+ commits', () => {
      const timeline = [createYearData(2025, 500)];
      const result = calculateActivityScore(timeline);
      expect(result.breakdown.recentCommits).toBe(40);
    });

    it('awards 0 points for no commits', () => {
      const timeline = [createYearData(2025, 0)];
      const result = calculateActivityScore(timeline);
      expect(result.breakdown.recentCommits).toBe(0);
    });
  });

  describe('consistency component (0-30 points)', () => {
    it('awards full 30 points for 2 active years (12 months coverage)', () => {
      // For 12 months, we look at up to 2 years of data
      const timeline = Array.from({ length: 2 }, (_, i) =>
        createYearData(2025 - i, 10)
      );
      const result = calculateActivityScore(timeline);
      expect(result.breakdown.consistency).toBe(30); // 2/2 years = 100% = 30 points
    });

    it('awards proportional points for fewer active years', () => {
      // Only 1 out of 2 possible years is active
      const timeline = [
        createYearData(2025, 10),
        createYearData(2024, 0),
      ];
      const result = calculateActivityScore(timeline);
      expect(result.breakdown.consistency).toBe(15); // 1/2 * 30 = 15
    });

    it('counts only years with commits > 0', () => {
      // For last 12 months, we look at last 2 years
      const timeline = [
        createYearData(2025, 10),  // Active
        createYearData(2024, 0),   // Inactive
      ];
      const result = calculateActivityScore(timeline);
      expect(result.details.activeMonths).toBe(1); // Only 1 year has commits
    });

    it('awards 0 points for no active years', () => {
      const timeline = [createYearData(2025, 0)];
      const result = calculateActivityScore(timeline);
      expect(result.breakdown.consistency).toBe(0);
    });
  });

  describe('diversity component (0-30 points)', () => {
    it('awards 10 points for 1-3 unique repos', () => {
      const timeline = [createYearData(2025, 50, 2)];
      const result = calculateActivityScore(timeline);
      expect(result.breakdown.diversity).toBe(10);
      expect(result.details.uniqueRepos).toBe(2);
    });

    it('awards 20 points for 4-7 unique repos', () => {
      const timeline = [createYearData(2025, 50, 5)];
      const result = calculateActivityScore(timeline);
      expect(result.breakdown.diversity).toBe(20);
      expect(result.details.uniqueRepos).toBe(5);
    });

    it('awards 30 points for 8-15 unique repos (optimal)', () => {
      const timeline = [createYearData(2025, 50, 10)];
      const result = calculateActivityScore(timeline);
      expect(result.breakdown.diversity).toBe(30);
      expect(result.details.uniqueRepos).toBe(10);
    });

    it('awards 25 points for 16+ repos (too scattered)', () => {
      const timeline = [createYearData(2025, 50, 20)];
      const result = calculateActivityScore(timeline);
      expect(result.breakdown.diversity).toBe(25);
      expect(result.details.uniqueRepos).toBe(20);
    });

    it('counts both owned and contributed repos', () => {
      const timeline = [createYearData(2025, 50, 3, 2)];
      const result = calculateActivityScore(timeline);
      expect(result.details.uniqueRepos).toBe(5); // 3 owned + 2 contributions
    });

    it('awards 0 points for no repos', () => {
      const timeline = [createYearData(2025, 0, 0, 0)];
      const result = calculateActivityScore(timeline);
      expect(result.breakdown.diversity).toBe(0);
      expect(result.details.uniqueRepos).toBe(0);
    });
  });

  describe('score calculation', () => {
    it('sums all components correctly', () => {
      const timeline = [createYearData(2025, 100, 8)];
      const result = calculateActivityScore(timeline);

      const expectedScore =
        result.breakdown.recentCommits +
        result.breakdown.consistency +
        result.breakdown.diversity;

      expect(result.score).toBe(expectedScore);
    });

    it('rounds score to nearest integer', () => {
      const timeline = [createYearData(2025, 99, 5)]; // Creates fractional points
      const result = calculateActivityScore(timeline);
      expect(Number.isInteger(result.score)).toBe(true);
    });

    it('calculates high activity correctly', () => {
      // High activity: lots of recent commits, consistent, and diverse
      const timeline = [
        createYearData(2025, 250, 10), // Recent: 40 pts, Diversity: 30 pts
        createYearData(2024, 100, 5),  // Consistency: 30 pts (2/2 years active)
      ];
      const result = calculateActivityScore(timeline);
      expect(result.score).toBeGreaterThan(70);
      expect(result.level).toBe('High');
    });

    it('calculates moderate activity correctly', () => {
      // Moderate activity: some commits, partial consistency
      const timeline = [
        createYearData(2025, 100, 5), // Recent: 20 pts, Diversity: 20 pts
        createYearData(2024, 0, 0),   // Consistency: 15 pts (1/2 years active)
      ];
      const result = calculateActivityScore(timeline);
      expect(result.score).toBeGreaterThanOrEqual(41);
      expect(result.score).toBeLessThan(71);
      expect(result.level).toBe('Moderate');
    });

    it('calculates low activity correctly', () => {
      // Low activity: few commits and only 1 out of 2 years active
      const timeline = [
        createYearData(2025, 10, 1),  // Recent: 2 pts, Diversity: 10 pts
        createYearData(2024, 0, 0),   // Consistency: 15 pts (1/2 years active)
      ];
      const result = calculateActivityScore(timeline);
      // Total: 2 + 10 + 15 = 27 points
      expect(result.score).toBeLessThanOrEqual(40);
      expect(result.level).toBe('Low');
    });
  });

  describe('breakdown constraints', () => {
    it('ensures recentCommits never exceeds 40', () => {
      const timeline = [createYearData(2025, 1000, 5)];
      const result = calculateActivityScore(timeline);
      expect(result.breakdown.recentCommits).toBeLessThanOrEqual(40);
    });

    it('ensures consistency never exceeds 30', () => {
      const timeline = Array.from({ length: 24 }, (_, i) =>
        createYearData(2025 - i, 10)
      );
      const result = calculateActivityScore(timeline);
      expect(result.breakdown.consistency).toBeLessThanOrEqual(30);
    });

    it('ensures diversity never exceeds 30', () => {
      const timeline = [createYearData(2025, 100, 50)];
      const result = calculateActivityScore(timeline);
      expect(result.breakdown.diversity).toBeLessThanOrEqual(30);
    });

    it('ensures total score never exceeds 100', () => {
      const timeline = Array.from({ length: 12 }, (_, i) =>
        createYearData(2025 - i, 300, 12)
      );
      const result = calculateActivityScore(timeline);
      expect(result.score).toBeLessThanOrEqual(100);
    });
  });
});

describe('getActivityLabel', () => {
  it('returns "High" for scores 71-100', () => {
    expect(getActivityLabel(71)).toBe('High');
    expect(getActivityLabel(85)).toBe('High');
    expect(getActivityLabel(100)).toBe('High');
  });

  it('returns "Moderate" for scores 41-70', () => {
    expect(getActivityLabel(41)).toBe('Moderate');
    expect(getActivityLabel(55)).toBe('Moderate');
    expect(getActivityLabel(70)).toBe('Moderate');
  });

  it('returns "Low" for scores 0-40', () => {
    expect(getActivityLabel(0)).toBe('Low');
    expect(getActivityLabel(25)).toBe('Low');
    expect(getActivityLabel(40)).toBe('Low');
  });

  it('handles boundary values correctly', () => {
    expect(getActivityLabel(70)).toBe('Moderate');
    expect(getActivityLabel(71)).toBe('High');
    expect(getActivityLabel(40)).toBe('Low');
    expect(getActivityLabel(41)).toBe('Moderate');
  });
});
