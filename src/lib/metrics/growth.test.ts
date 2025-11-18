import { describe, it, expect } from 'vitest';
import { calculateGrowthScore, getGrowthLabel } from './growth';
import type { YearData } from '@/hooks/useUserAnalytics';
import type { RepositoryContribution } from '@/apollo/queries/yearContributions';

// Helper to create mock repository contribution
function createRepoContribution(
  name: string,
  stars: number,
  forks: number,
  primaryLanguage: string | null = 'TypeScript'
): RepositoryContribution {
  return {
    contributions: {
      totalCount: 10,
    },
    repository: {
      id: `repo-${name}`,
      name,
      nameWithOwner: `user/${name}`,
      url: `https://github.com/user/${name}`,
      description: 'A test repository',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      pushedAt: new Date().toISOString(),
      stargazerCount: stars,
      forkCount: forks,
      isFork: false,
      isArchived: false,
      isPrivate: false,
      primaryLanguage: primaryLanguage ? { name: primaryLanguage, color: '#000000' } : null,
      owner: { login: 'user', avatarUrl: 'https://example.com/avatar.png' },
      licenseInfo: null,
      defaultBranchRef: { name: 'main' },
    },
  };
}

// Helper to create mock year data
function createYearData(
  year: number,
  totalCommits: number,
  ownedRepos: RepositoryContribution[],
  contributions: RepositoryContribution[]
): YearData {
  return {
    year,
    totalCommits,
    totalIssues: 0,
    totalPRs: 0,
    totalReviews: 0,
    ownedRepos,
    contributions,
  };
}

describe('calculateGrowthScore', () => {
  describe('insufficient data', () => {
    it('returns 0 score for empty timeline', () => {
      const result = calculateGrowthScore([]);
      expect(result.score).toBe(0);
      expect(result.level).toBe('Stable');
      expect(result.breakdown).toEqual({
        activityGrowth: 0,
        impactGrowth: 0,
        skillsGrowth: 0,
      });
    });

    it('returns 0 score for single year (no YoY comparison)', () => {
      const timeline = [createYearData(2025, 100, [createRepoContribution('repo1', 10, 5)], [])];
      const result = calculateGrowthScore(timeline);
      expect(result.score).toBe(0);
      expect(result.level).toBe('Stable');
    });
  });

  describe('activity growth component (40% weight)', () => {
    it('awards positive points for increased commits', () => {
      const timeline = [
        createYearData(2025, 200, [], []), // current year
        createYearData(2024, 100, [], []), // previous year
      ];
      const result = calculateGrowthScore(timeline);
      expect(result.breakdown.activityGrowth).toBeGreaterThan(0);
      expect(result.details.commitsYoYChange).toBe(100); // 100% increase
      expect(result.details.previousYearCommits).toBe(100);
      expect(result.details.currentYearCommits).toBe(200);
    });

    it('awards negative points for decreased commits', () => {
      const timeline = [
        createYearData(2025, 50, [], []), // current year
        createYearData(2024, 100, [], []), // previous year
      ];
      const result = calculateGrowthScore(timeline);
      expect(result.breakdown.activityGrowth).toBeLessThan(0);
      expect(result.details.commitsYoYChange).toBe(-50); // 50% decrease
    });

    it('awards 0 points for stable commits', () => {
      const timeline = [
        createYearData(2025, 100, [], []),
        createYearData(2024, 100, [], []),
      ];
      const result = calculateGrowthScore(timeline);
      expect(result.breakdown.activityGrowth).toBe(0);
      expect(result.details.commitsYoYChange).toBe(0);
    });

    it('handles zero previous commits (new activity)', () => {
      const timeline = [
        createYearData(2025, 100, [], []),
        createYearData(2024, 0, [], []),
      ];
      const result = calculateGrowthScore(timeline);
      expect(result.breakdown.activityGrowth).toBeGreaterThan(0);
      expect(result.details.commitsYoYChange).toBe(100); // Max growth
    });

    it('caps activity growth at maximum weight (40 points)', () => {
      const timeline = [
        createYearData(2025, 10000, [], []), // massive increase
        createYearData(2024, 100, [], []),
      ];
      const result = calculateGrowthScore(timeline);
      expect(result.breakdown.activityGrowth).toBeLessThanOrEqual(40);
    });

    it('caps activity decline at minimum weight (-40 points)', () => {
      const timeline = [
        createYearData(2025, 0, [], []), // complete drop
        createYearData(2024, 100, [], []),
      ];
      const result = calculateGrowthScore(timeline);
      expect(result.breakdown.activityGrowth).toBeGreaterThanOrEqual(-40);
    });
  });

  describe('impact growth component (30% weight)', () => {
    it('awards positive points for increased stars and forks', () => {
      const timeline = [
        createYearData(2025, 100, [createRepoContribution('repo1', 200, 40)], []),
        createYearData(2024, 100, [createRepoContribution('repo1', 100, 20)], []),
      ];
      const result = calculateGrowthScore(timeline);
      expect(result.breakdown.impactGrowth).toBeGreaterThan(0);
      expect(result.details.starsYoYChange).toBe(100); // 100% increase
      expect(result.details.forksYoYChange).toBe(100); // 100% increase
    });

    it('awards negative points for decreased stars and forks', () => {
      const timeline = [
        createYearData(2025, 100, [createRepoContribution('repo1', 50, 10)], []),
        createYearData(2024, 100, [createRepoContribution('repo1', 100, 20)], []),
      ];
      const result = calculateGrowthScore(timeline);
      expect(result.breakdown.impactGrowth).toBeLessThan(0);
      expect(result.details.starsYoYChange).toBe(-50); // 50% decrease
      expect(result.details.forksYoYChange).toBe(-50); // 50% decrease
    });

    it('averages stars and forks growth', () => {
      const timeline = [
        createYearData(2025, 100, [createRepoContribution('repo1', 200, 20)], []), // stars +100%, forks 0%
        createYearData(2024, 100, [createRepoContribution('repo1', 100, 20)], []),
      ];
      const result = calculateGrowthScore(timeline);
      // Average of 100% and 0% = 50%
      expect(result.details.starsYoYChange).toBe(100);
      expect(result.details.forksYoYChange).toBe(0);
    });

    it('handles zero previous stars/forks (new impact)', () => {
      const timeline = [
        createYearData(2025, 100, [createRepoContribution('repo1', 100, 20)], []),
        createYearData(2024, 100, [createRepoContribution('repo1', 0, 0)], []),
      ];
      const result = calculateGrowthScore(timeline);
      expect(result.breakdown.impactGrowth).toBeGreaterThan(0);
      expect(result.details.starsYoYChange).toBe(100); // Max growth
      expect(result.details.forksYoYChange).toBe(100); // Max growth
    });

    it('caps impact growth at maximum weight (30 points)', () => {
      const timeline = [
        createYearData(2025, 100, [createRepoContribution('repo1', 10000, 1000)], []),
        createYearData(2024, 100, [createRepoContribution('repo1', 100, 10)], []),
      ];
      const result = calculateGrowthScore(timeline);
      expect(result.breakdown.impactGrowth).toBeLessThanOrEqual(30);
    });

    it('caps impact decline at minimum weight (-30 points)', () => {
      const timeline = [
        createYearData(2025, 100, [createRepoContribution('repo1', 0, 0)], []),
        createYearData(2024, 100, [createRepoContribution('repo1', 100, 20)], []),
      ];
      const result = calculateGrowthScore(timeline);
      expect(result.breakdown.impactGrowth).toBeGreaterThanOrEqual(-30);
    });

    it('aggregates stars/forks across multiple repos', () => {
      const timeline = [
        createYearData(
          2025,
          100,
          [createRepoContribution('repo1', 100, 10), createRepoContribution('repo2', 100, 10)],
          []
        ),
        createYearData(2024, 100, [createRepoContribution('repo1', 50, 5)], []),
      ];
      const result = calculateGrowthScore(timeline);
      expect(result.details.currentYearStars).toBe(200); // 100 + 100
      expect(result.details.currentYearForks).toBe(20); // 10 + 10
      expect(result.details.previousYearStars).toBe(50);
      expect(result.details.previousYearForks).toBe(5);
    });
  });

  describe('skills growth component (30% weight)', () => {
    it('awards points for new languages adopted', () => {
      const timeline = [
        createYearData(
          2025,
          100,
          [
            createRepoContribution('repo1', 10, 5, 'TypeScript'),
            createRepoContribution('repo2', 10, 5, 'Python'), // new language
          ],
          []
        ),
        createYearData(2024, 100, [createRepoContribution('repo1', 10, 5, 'TypeScript')], []),
      ];
      const result = calculateGrowthScore(timeline);
      expect(result.breakdown.skillsGrowth).toBeGreaterThan(0);
      expect(result.details.newLanguages).toBe(1);
    });

    it('awards 0 points for no new languages', () => {
      const timeline = [
        createYearData(2025, 100, [createRepoContribution('repo1', 10, 5, 'TypeScript')], []),
        createYearData(2024, 100, [createRepoContribution('repo1', 10, 5, 'TypeScript')], []),
      ];
      const result = calculateGrowthScore(timeline);
      expect(result.breakdown.skillsGrowth).toBe(0);
      expect(result.details.newLanguages).toBe(0);
    });

    it('awards 9 points (30% * 0.3) for 1-2 new languages', () => {
      const timeline = [
        createYearData(
          2025,
          100,
          [
            createRepoContribution('repo1', 10, 5, 'TypeScript'),
            createRepoContribution('repo2', 10, 5, 'Python'),
          ],
          []
        ),
        createYearData(2024, 100, [createRepoContribution('repo1', 10, 5, 'TypeScript')], []),
      ];
      const result = calculateGrowthScore(timeline);
      expect(result.breakdown.skillsGrowth).toBe(9); // 30 * 0.3 = 9
      expect(result.details.newLanguages).toBe(1);
    });

    it('awards 18 points (30% * 0.6) for 3-4 new languages', () => {
      const timeline = [
        createYearData(
          2025,
          100,
          [
            createRepoContribution('repo1', 10, 5, 'TypeScript'),
            createRepoContribution('repo2', 10, 5, 'Python'),
            createRepoContribution('repo3', 10, 5, 'Go'),
            createRepoContribution('repo4', 10, 5, 'Rust'),
          ],
          []
        ),
        createYearData(2024, 100, [createRepoContribution('repo1', 10, 5, 'TypeScript')], []),
      ];
      const result = calculateGrowthScore(timeline);
      expect(result.breakdown.skillsGrowth).toBe(18); // 30 * 0.6 = 18
      expect(result.details.newLanguages).toBe(3);
    });

    it('awards 30 points (30% * 1.0) for 5+ new languages', () => {
      const timeline = [
        createYearData(
          2025,
          100,
          [
            createRepoContribution('repo1', 10, 5, 'TypeScript'),
            createRepoContribution('repo2', 10, 5, 'Python'),
            createRepoContribution('repo3', 10, 5, 'Go'),
            createRepoContribution('repo4', 10, 5, 'Rust'),
            createRepoContribution('repo5', 10, 5, 'Java'),
            createRepoContribution('repo6', 10, 5, 'C++'),
          ],
          []
        ),
        createYearData(2024, 100, [createRepoContribution('repo1', 10, 5, 'TypeScript')], []),
      ];
      const result = calculateGrowthScore(timeline);
      expect(result.breakdown.skillsGrowth).toBe(30); // 30 * 1.0 = 30
      expect(result.details.newLanguages).toBe(5);
    });

    it('counts languages from both owned and contributed repos', () => {
      const timeline = [
        createYearData(
          2025,
          100,
          [createRepoContribution('repo1', 10, 5, 'TypeScript')],
          [createRepoContribution('contrib1', 10, 5, 'Python')] // new language in contribution
        ),
        createYearData(2024, 100, [createRepoContribution('repo1', 10, 5, 'TypeScript')], []),
      ];
      const result = calculateGrowthScore(timeline);
      expect(result.details.newLanguages).toBe(1);
    });

    it('ignores repos with no primary language', () => {
      const timeline = [
        createYearData(
          2025,
          100,
          [createRepoContribution('repo1', 10, 5, 'TypeScript'), createRepoContribution('repo2', 10, 5, null)],
          []
        ),
        createYearData(2024, 100, [createRepoContribution('repo1', 10, 5, 'TypeScript')], []),
      ];
      const result = calculateGrowthScore(timeline);
      expect(result.details.newLanguages).toBe(0); // null language doesn't count
    });
  });

  describe('score calculation', () => {
    it('sums all components correctly with weights', () => {
      const timeline = [
        createYearData(
          2025,
          200, // 100% increase
          [createRepoContribution('repo1', 200, 40, 'Python')], // 100% increase, new language
          []
        ),
        createYearData(2024, 100, [createRepoContribution('repo1', 100, 20, 'TypeScript')], []),
      ];
      const result = calculateGrowthScore(timeline);

      const expectedScore =
        result.breakdown.activityGrowth + result.breakdown.impactGrowth + result.breakdown.skillsGrowth;

      expect(result.score).toBe(expectedScore);
    });

    it('rounds score to nearest integer', () => {
      const timeline = [
        createYearData(2025, 150, [createRepoContribution('repo1', 120, 25)], []),
        createYearData(2024, 100, [createRepoContribution('repo1', 100, 20)], []),
      ];
      const result = calculateGrowthScore(timeline);
      expect(Number.isInteger(result.score)).toBe(true);
    });

    it('calculates rapid growth correctly', () => {
      const timeline = [
        createYearData(
          2025,
          300, // 200% increase
          [createRepoContribution('repo1', 300, 60, 'Python')], // 200% increase, new language
          [
            createRepoContribution('contrib1', 10, 5, 'Go'),
            createRepoContribution('contrib2', 10, 5, 'Rust'),
            createRepoContribution('contrib3', 10, 5, 'Java'),
          ]
        ),
        createYearData(2024, 100, [createRepoContribution('repo1', 100, 20, 'TypeScript')], []),
      ];
      const result = calculateGrowthScore(timeline);
      expect(result.score).toBeGreaterThan(50);
      expect(result.level).toBe('Rapid Growth');
    });

    it('calculates growing correctly', () => {
      const timeline = [
        createYearData(
          2025,
          150, // 50% increase
          [createRepoContribution('repo1', 150, 30, 'Python')], // 50% increase, new language
          []
        ),
        createYearData(2024, 100, [createRepoContribution('repo1', 100, 20, 'TypeScript')], []),
      ];
      const result = calculateGrowthScore(timeline);
      expect(result.score).toBeGreaterThanOrEqual(21);
      expect(result.score).toBeLessThan(51);
      expect(result.level).toBe('Growing');
    });

    it('calculates stable correctly', () => {
      const timeline = [
        createYearData(2025, 105, [createRepoContribution('repo1', 105, 21)], []),
        createYearData(2024, 100, [createRepoContribution('repo1', 100, 20)], []),
      ];
      const result = calculateGrowthScore(timeline);
      expect(result.score).toBeGreaterThanOrEqual(-20);
      expect(result.score).toBeLessThan(21);
      expect(result.level).toBe('Stable');
    });

    it('calculates declining correctly', () => {
      const timeline = [
        createYearData(2025, 60, [createRepoContribution('repo1', 60, 12)], []), // -40% commits, -40% impact
        createYearData(2024, 100, [createRepoContribution('repo1', 100, 20)], []),
      ];
      const result = calculateGrowthScore(timeline);
      expect(result.score).toBeGreaterThanOrEqual(-50);
      expect(result.score).toBeLessThan(-20);
      expect(result.level).toBe('Declining');
    });

    it('calculates rapid decline correctly', () => {
      const timeline = [
        createYearData(2025, 10, [createRepoContribution('repo1', 10, 2)], []), // -90% commits, -90% impact
        createYearData(2024, 100, [createRepoContribution('repo1', 100, 20)], []),
      ];
      const result = calculateGrowthScore(timeline);
      expect(result.score).toBeLessThan(-50);
      expect(result.level).toBe('Rapid Decline');
    });
  });

  describe('score constraints', () => {
    it('ensures activity growth never exceeds 40', () => {
      const timeline = [
        createYearData(2025, 100000, [], []), // massive increase
        createYearData(2024, 100, [], []),
      ];
      const result = calculateGrowthScore(timeline);
      expect(result.breakdown.activityGrowth).toBeLessThanOrEqual(40);
    });

    it('ensures activity growth never goes below -40', () => {
      const timeline = [
        createYearData(2025, 0, [], []), // complete drop
        createYearData(2024, 100000, [], []),
      ];
      const result = calculateGrowthScore(timeline);
      expect(result.breakdown.activityGrowth).toBeGreaterThanOrEqual(-40);
    });

    it('ensures impact growth never exceeds 30', () => {
      const timeline = [
        createYearData(2025, 100, [createRepoContribution('repo1', 100000, 10000)], []),
        createYearData(2024, 100, [createRepoContribution('repo1', 100, 10)], []),
      ];
      const result = calculateGrowthScore(timeline);
      expect(result.breakdown.impactGrowth).toBeLessThanOrEqual(30);
    });

    it('ensures impact growth never goes below -30', () => {
      const timeline = [
        createYearData(2025, 100, [createRepoContribution('repo1', 0, 0)], []),
        createYearData(2024, 100, [createRepoContribution('repo1', 100000, 10000)], []),
      ];
      const result = calculateGrowthScore(timeline);
      expect(result.breakdown.impactGrowth).toBeGreaterThanOrEqual(-30);
    });

    it('ensures skills growth never exceeds 30', () => {
      const languages = [
        'TypeScript',
        'JavaScript',
        'Python',
        'Go',
        'Rust',
        'Java',
        'C++',
        'Ruby',
        'PHP',
        'Swift',
        'Kotlin',
        'C#',
      ];
      const timeline = [
        createYearData(
          2025,
          100,
          languages.map((lang, i) => createRepoContribution(`repo${i}`, 10, 5, lang)),
          []
        ),
        createYearData(2024, 100, [createRepoContribution('repo1', 10, 5, 'TypeScript')], []),
      ];
      const result = calculateGrowthScore(timeline);
      expect(result.breakdown.skillsGrowth).toBeLessThanOrEqual(30);
    });

    it('ensures total score never exceeds 100', () => {
      const languages = [
        'JavaScript',
        'Python',
        'Go',
        'Rust',
        'Java',
        'C++',
        'Ruby',
        'PHP',
        'Swift',
        'Kotlin',
      ];
      const timeline = [
        createYearData(
          2025,
          100000,
          languages.map((lang, i) => createRepoContribution(`repo${i}`, 10000, 1000, lang)),
          []
        ),
        createYearData(2024, 100, [createRepoContribution('repo1', 100, 10, 'TypeScript')], []),
      ];
      const result = calculateGrowthScore(timeline);
      expect(result.score).toBeLessThanOrEqual(100);
    });

    it('ensures total score never goes below -100', () => {
      const timeline = [
        createYearData(2025, 0, [createRepoContribution('repo1', 0, 0)], []),
        createYearData(2024, 100000, [createRepoContribution('repo1', 100000, 10000)], []),
      ];
      const result = calculateGrowthScore(timeline);
      expect(result.score).toBeGreaterThanOrEqual(-100);
    });
  });
});

describe('getGrowthLabel', () => {
  it('returns "Rapid Growth" for scores 51-100', () => {
    expect(getGrowthLabel(51)).toBe('Rapid Growth');
    expect(getGrowthLabel(75)).toBe('Rapid Growth');
    expect(getGrowthLabel(100)).toBe('Rapid Growth');
  });

  it('returns "Growing" for scores 21-50', () => {
    expect(getGrowthLabel(21)).toBe('Growing');
    expect(getGrowthLabel(35)).toBe('Growing');
    expect(getGrowthLabel(50)).toBe('Growing');
  });

  it('returns "Stable" for scores -20 to 20', () => {
    expect(getGrowthLabel(-20)).toBe('Stable');
    expect(getGrowthLabel(0)).toBe('Stable');
    expect(getGrowthLabel(20)).toBe('Stable');
  });

  it('returns "Declining" for scores -50 to -21', () => {
    expect(getGrowthLabel(-21)).toBe('Declining');
    expect(getGrowthLabel(-35)).toBe('Declining');
    expect(getGrowthLabel(-50)).toBe('Declining');
  });

  it('returns "Rapid Decline" for scores -100 to -51', () => {
    expect(getGrowthLabel(-51)).toBe('Rapid Decline');
    expect(getGrowthLabel(-75)).toBe('Rapid Decline');
    expect(getGrowthLabel(-100)).toBe('Rapid Decline');
  });

  it('handles boundary values correctly', () => {
    expect(getGrowthLabel(50)).toBe('Growing');
    expect(getGrowthLabel(51)).toBe('Rapid Growth');
    expect(getGrowthLabel(20)).toBe('Stable');
    expect(getGrowthLabel(21)).toBe('Growing');
    expect(getGrowthLabel(-20)).toBe('Stable');
    expect(getGrowthLabel(-21)).toBe('Declining');
    expect(getGrowthLabel(-50)).toBe('Declining');
    expect(getGrowthLabel(-51)).toBe('Rapid Decline');
  });
});
