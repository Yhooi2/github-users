import { describe, it, expect } from 'vitest';
import { analyzeYear, analyzeAllYears, getCareerSummary, getYearMetrics } from './year-badges';

describe('year-badges', () => {
  const sampleYears = [
    { year: 2023, commits: 200 },
    { year: 2024, commits: 500 },
    { year: 2025, commits: 300 },
  ];

  describe('analyzeYear', () => {
    it('should identify peak year', () => {
      const result = analyzeYear(2024, 500, sampleYears);
      expect(result.badge.type).toBe('peak');
      expect(result.rank).toBe(1);
    });

    it('should identify first year as start', () => {
      const result = analyzeYear(2023, 200, sampleYears);
      expect(result.badge.type).toBe('start');
    });

    it('should calculate YoY change', () => {
      const result = analyzeYear(2024, 500, sampleYears);
      expect(result.yoyChange).toBe(150); // (500-200)/200 * 100
    });

    it('should identify inactive year (< 100 commits)', () => {
      const withInactive = [...sampleYears, { year: 2022, commits: 80 }];
      const result = analyzeYear(2022, 80, withInactive);
      expect(result.badge.type).toBe('inactive');
    });

    it('should NOT mark as inactive if >= 100 commits', () => {
      const withActive = [...sampleYears, { year: 2022, commits: 100 }];
      const result = analyzeYear(2022, 100, withActive);
      expect(result.badge.type).not.toBe('inactive');
    });

    it('should calculate percentOfPeak', () => {
      const result = analyzeYear(2025, 300, sampleYears);
      expect(result.percentOfPeak).toBe(60); // 300/500 * 100
    });

    it('should identify decline', () => {
      const result = analyzeYear(2025, 300, sampleYears);
      // 2025 vs 2024: (300-500)/500 = -40%
      expect(result.badge.type).toBe('decline');
    });

    it('should identify growth', () => {
      const growthYears = [
        { year: 2023, commits: 200 },
        { year: 2024, commits: 300 }, // +50%
      ];
      const result = analyzeYear(2024, 300, growthYears);
      expect(result.badge.type).toBe('peak'); // Also peak since it's max
    });

    it('should identify stable year', () => {
      const stableYears = [
        { year: 2022, commits: 200 },
        { year: 2023, commits: 210 }, // +5%
        { year: 2024, commits: 500 }, // peak
      ];
      const result = analyzeYear(2023, 210, stableYears);
      expect(result.badge.type).toBe('stable');
    });
  });

  describe('analyzeAllYears', () => {
    it('should return analysis for all years', () => {
      const timeline = sampleYears.map(y => ({
        year: y.year,
        totalCommits: y.commits
      }));
      const result = analyzeAllYears(timeline);

      expect(result.size).toBe(3);
      expect(result.get(2024)?.badge.type).toBe('peak');
    });
  });

  describe('getCareerSummary', () => {
    it('should calculate totals including unique repos', () => {
      const timeline = sampleYears.map(y => ({
        year: y.year,
        totalCommits: y.commits,
        totalPRs: 10,
        ownedRepos: [
          { repository: { url: 'https://github.com/user/repo1' } },
          { repository: { url: 'https://github.com/user/repo2' } }
        ],
        contributions: [
          { repository: { url: 'https://github.com/other/repo3' } }
        ]
      }));
      const summary = getCareerSummary(timeline);

      expect(summary.totalCommits).toBe(1000);
      expect(summary.totalPRs).toBe(30);
      expect(summary.startYear).toBe(2023);
      expect(summary.uniqueRepos).toBe(3); // 3 уникальных репо
    });

    it('should count active years correctly (>= 100 commits)', () => {
      const timeline = [
        { year: 2023, totalCommits: 50, totalPRs: 0, ownedRepos: [], contributions: [] },  // inactive
        { year: 2024, totalCommits: 150, totalPRs: 5, ownedRepos: [], contributions: [] }, // active
        { year: 2025, totalCommits: 200, totalPRs: 10, ownedRepos: [], contributions: [] } // active
      ];
      const summary = getCareerSummary(timeline);

      expect(summary.yearsActive).toBe(2); // только 2024 и 2025
    });
  });

  describe('getYearMetrics', () => {
    it('should count repos and PRs for a year', () => {
      const yearData = {
        year: 2025,
        totalCommits: 500,
        totalPRs: 25,
        ownedRepos: [
          { repository: { url: 'https://github.com/user/repo1' } },
          { repository: { url: 'https://github.com/user/repo2' } }
        ],
        contributions: [
          { repository: { url: 'https://github.com/other/repo3' } }
        ]
      };
      const metrics = getYearMetrics(yearData);

      expect(metrics.commits).toBe(500);
      expect(metrics.prs).toBe(25);
      expect(metrics.repos).toBe(3);
    });
  });
});
