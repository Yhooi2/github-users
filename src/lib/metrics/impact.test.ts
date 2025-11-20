import type { RepositoryContribution } from "@/apollo/queries/yearContributions";
import type { YearData } from "@/hooks/useUserAnalytics";
import { describe, expect, it } from "vitest";
import { calculateImpactScore, getImpactLabel } from "./impact";

// Helper to create mock repository contribution
function createRepoContribution(
  stars: number,
  forks: number,
  watchers: number,
  name = "test-repo",
): RepositoryContribution {
  return {
    contributions: {
      totalCount: 10,
    },
    repository: {
      name,
      url: `https://github.com/user/${name}`,
      owner: { login: "user" },
      stargazerCount: stars,
      forkCount: forks,
      watchers: { totalCount: watchers },
      isArchived: false,
      isFork: false,
      isPrivate: false,
      primaryLanguage: null,
    },
  };
}

// Helper to create mock year data
function createYearData(
  year: number,
  ownedRepos: RepositoryContribution[],
  contributions: RepositoryContribution[],
  prs = 0,
  issues = 0,
): YearData {
  return {
    year,
    totalCommits: 100,
    totalIssues: issues,
    totalPRs: prs,
    totalReviews: 0,
    ownedRepos,
    contributions,
  };
}

describe("calculateImpactScore", () => {
  describe("empty data", () => {
    it("returns 0 score for empty timeline", () => {
      const result = calculateImpactScore([]);
      expect(result.score).toBe(0);
      expect(result.level).toBe("Minimal");
      expect(result.breakdown).toEqual({
        stars: 0,
        forks: 0,
        contributors: 0,
        reach: 0,
        engagement: 0,
      });
      expect(result.details).toEqual({
        totalStars: 0,
        totalForks: 0,
        totalWatchers: 0,
        totalPRs: 0,
        totalIssues: 0,
      });
    });
  });

  describe("stars component (0-35 points)", () => {
    it("awards 35 points for 10000+ stars", () => {
      const timeline = [
        createYearData(2025, [createRepoContribution(10000, 0, 0)], [], 0, 0),
      ];
      const result = calculateImpactScore(timeline);
      expect(result.breakdown.stars).toBe(35);
      expect(result.details.totalStars).toBe(10000);
    });

    it("awards 30 points for 5000-9999 stars", () => {
      const timeline = [
        createYearData(2025, [createRepoContribution(5000, 0, 0)], [], 0, 0),
      ];
      const result = calculateImpactScore(timeline);
      expect(result.breakdown.stars).toBe(30);
    });

    it("awards 25 points for 1000-4999 stars", () => {
      const timeline = [
        createYearData(2025, [createRepoContribution(1000, 0, 0)], [], 0, 0),
      ];
      const result = calculateImpactScore(timeline);
      expect(result.breakdown.stars).toBe(25);
    });

    it("awards 20 points for 500-999 stars", () => {
      const timeline = [
        createYearData(2025, [createRepoContribution(500, 0, 0)], [], 0, 0),
      ];
      const result = calculateImpactScore(timeline);
      expect(result.breakdown.stars).toBe(20);
    });

    it("awards 15 points for 100-499 stars", () => {
      const timeline = [
        createYearData(2025, [createRepoContribution(100, 0, 0)], [], 0, 0),
      ];
      const result = calculateImpactScore(timeline);
      expect(result.breakdown.stars).toBe(15);
    });

    it("awards 10 points for 50-99 stars", () => {
      const timeline = [
        createYearData(2025, [createRepoContribution(50, 0, 0)], [], 0, 0),
      ];
      const result = calculateImpactScore(timeline);
      expect(result.breakdown.stars).toBe(10);
    });

    it("awards 5 points for 10-49 stars", () => {
      const timeline = [
        createYearData(2025, [createRepoContribution(10, 0, 0)], [], 0, 0),
      ];
      const result = calculateImpactScore(timeline);
      expect(result.breakdown.stars).toBe(5);
    });

    it("awards 0 points for < 10 stars", () => {
      const timeline = [
        createYearData(2025, [createRepoContribution(5, 0, 0)], [], 0, 0),
      ];
      const result = calculateImpactScore(timeline);
      expect(result.breakdown.stars).toBe(0);
    });

    it("aggregates stars across multiple repos", () => {
      const timeline = [
        createYearData(
          2025,
          [
            createRepoContribution(100, 0, 0, "repo1"),
            createRepoContribution(50, 0, 0, "repo2"),
          ],
          [],
          0,
          0,
        ),
      ];
      const result = calculateImpactScore(timeline);
      expect(result.details.totalStars).toBe(150);
      expect(result.breakdown.stars).toBe(15); // 100-499 range
    });
  });

  describe("forks component (0-20 points)", () => {
    it("awards 20 points for 1000+ forks", () => {
      const timeline = [
        createYearData(2025, [createRepoContribution(0, 1000, 0)], [], 0, 0),
      ];
      const result = calculateImpactScore(timeline);
      expect(result.breakdown.forks).toBe(20);
    });

    it("awards 16 points for 500-999 forks", () => {
      const timeline = [
        createYearData(2025, [createRepoContribution(0, 500, 0)], [], 0, 0),
      ];
      const result = calculateImpactScore(timeline);
      expect(result.breakdown.forks).toBe(16);
    });

    it("awards 12 points for 100-499 forks", () => {
      const timeline = [
        createYearData(2025, [createRepoContribution(0, 100, 0)], [], 0, 0),
      ];
      const result = calculateImpactScore(timeline);
      expect(result.breakdown.forks).toBe(12);
    });

    it("awards 8 points for 50-99 forks", () => {
      const timeline = [
        createYearData(2025, [createRepoContribution(0, 50, 0)], [], 0, 0),
      ];
      const result = calculateImpactScore(timeline);
      expect(result.breakdown.forks).toBe(8);
    });

    it("awards 4 points for 10-49 forks", () => {
      const timeline = [
        createYearData(2025, [createRepoContribution(0, 10, 0)], [], 0, 0),
      ];
      const result = calculateImpactScore(timeline);
      expect(result.breakdown.forks).toBe(4);
    });

    it("awards 0 points for < 10 forks", () => {
      const timeline = [
        createYearData(2025, [createRepoContribution(0, 5, 0)], [], 0, 0),
      ];
      const result = calculateImpactScore(timeline);
      expect(result.breakdown.forks).toBe(0);
    });
  });

  describe("contributors component (0-15 points)", () => {
    it("awards full 15 points for 100+ forks (proxy)", () => {
      const timeline = [
        createYearData(2025, [createRepoContribution(0, 100, 0)], [], 0, 0),
      ];
      const result = calculateImpactScore(timeline);
      expect(result.breakdown.contributors).toBe(15);
    });

    it("awards proportional points for fewer forks", () => {
      const timeline = [
        createYearData(2025, [createRepoContribution(0, 50, 0)], [], 0, 0),
      ];
      const result = calculateImpactScore(timeline);
      expect(result.breakdown.contributors).toBe(8); // 50/100 * 15 = 7.5, rounded to 8
    });

    it("caps at 15 points", () => {
      const timeline = [
        createYearData(2025, [createRepoContribution(0, 500, 0)], [], 0, 0),
      ];
      const result = calculateImpactScore(timeline);
      expect(result.breakdown.contributors).toBeLessThanOrEqual(15);
    });
  });

  describe("reach component (0-20 points)", () => {
    it("awards full 20 points for 500+ combined stars+forks", () => {
      const timeline = [
        createYearData(2025, [createRepoContribution(300, 200, 0)], [], 0, 0),
      ];
      const result = calculateImpactScore(timeline);
      expect(result.breakdown.reach).toBe(20);
    });

    it("awards proportional points for lower reach", () => {
      const timeline = [
        createYearData(2025, [createRepoContribution(150, 100, 0)], [], 0, 0),
      ];
      const result = calculateImpactScore(timeline);
      expect(result.breakdown.reach).toBe(10); // 250/500 * 20 = 10
    });

    it("caps at 20 points", () => {
      const timeline = [
        createYearData(
          2025,
          [createRepoContribution(10000, 5000, 0)],
          [],
          0,
          0,
        ),
      ];
      const result = calculateImpactScore(timeline);
      expect(result.breakdown.reach).toBeLessThanOrEqual(20);
    });
  });

  describe("engagement component (0-10 points)", () => {
    it("awards full 10 points for 200+ PRs+Issues", () => {
      const timeline = [createYearData(2025, [], [], 120, 80)];
      const result = calculateImpactScore(timeline);
      expect(result.breakdown.engagement).toBe(10);
      expect(result.details.totalPRs).toBe(120);
      expect(result.details.totalIssues).toBe(80);
    });

    it("awards proportional points for lower engagement", () => {
      const timeline = [createYearData(2025, [], [], 50, 50)];
      const result = calculateImpactScore(timeline);
      expect(result.breakdown.engagement).toBe(5); // 100/200 * 10 = 5
    });

    it("aggregates PRs and Issues across years", () => {
      const timeline = [
        createYearData(2025, [], [], 50, 30),
        createYearData(2024, [], [], 40, 20),
      ];
      const result = calculateImpactScore(timeline);
      expect(result.details.totalPRs).toBe(90);
      expect(result.details.totalIssues).toBe(50);
    });
  });

  describe("score calculation", () => {
    it("sums all components correctly", () => {
      const timeline = [
        createYearData(2025, [createRepoContribution(100, 50, 10)], [], 50, 50),
      ];
      const result = calculateImpactScore(timeline);

      const expectedScore =
        result.breakdown.stars +
        result.breakdown.forks +
        result.breakdown.contributors +
        result.breakdown.reach +
        result.breakdown.engagement;

      expect(result.score).toBe(expectedScore);
    });

    it("rounds score to nearest integer", () => {
      const timeline = [
        createYearData(2025, [createRepoContribution(15, 15, 5)], [], 30, 30),
      ];
      const result = calculateImpactScore(timeline);
      expect(Number.isInteger(result.score)).toBe(true);
    });

    it("calculates exceptional impact correctly", () => {
      const timeline = [
        createYearData(
          2025,
          [createRepoContribution(10000, 1000, 500)],
          [],
          150,
          100,
        ),
      ];
      const result = calculateImpactScore(timeline);
      expect(result.score).toBeGreaterThan(80);
      expect(result.level).toBe("Exceptional");
    });

    it("calculates strong impact correctly", () => {
      const timeline = [
        createYearData(
          2025,
          [createRepoContribution(1000, 100, 50)],
          [],
          80,
          60,
        ),
      ];
      const result = calculateImpactScore(timeline);
      expect(result.score).toBeGreaterThanOrEqual(61);
      expect(result.score).toBeLessThan(81);
      expect(result.level).toBe("Strong");
    });

    it("calculates moderate impact correctly", () => {
      // Moderate: 15 stars + 8 forks + 3 contributors + 9 reach + 4 engagement = ~39-50 pts
      const timeline = [
        createYearData(2025, [createRepoContribution(100, 50, 10)], [], 50, 50),
      ];
      const result = calculateImpactScore(timeline);
      expect(result.score).toBeGreaterThanOrEqual(41);
      expect(result.score).toBeLessThan(61);
      expect(result.level).toBe("Moderate");
    });

    it("calculates low impact correctly", () => {
      // Low: 5 stars + 0 forks + 0 contributors + 2 reach + 1 engagement = ~8-30 pts
      // Need more to reach 21+, so add some forks and PRs
      const timeline = [
        createYearData(2025, [createRepoContribution(50, 20, 5)], [], 30, 20),
      ];
      const result = calculateImpactScore(timeline);
      expect(result.score).toBeGreaterThanOrEqual(21);
      expect(result.score).toBeLessThan(41);
      expect(result.level).toBe("Low");
    });

    it("calculates minimal impact correctly", () => {
      const timeline = [
        createYearData(2025, [createRepoContribution(5, 2, 1)], [], 5, 5),
      ];
      const result = calculateImpactScore(timeline);
      expect(result.score).toBeLessThan(21);
      expect(result.level).toBe("Minimal");
    });
  });

  describe("breakdown constraints", () => {
    it("ensures stars never exceeds 35", () => {
      const timeline = [
        createYearData(2025, [createRepoContribution(100000, 0, 0)], [], 0, 0),
      ];
      const result = calculateImpactScore(timeline);
      expect(result.breakdown.stars).toBeLessThanOrEqual(35);
    });

    it("ensures forks never exceeds 20", () => {
      const timeline = [
        createYearData(2025, [createRepoContribution(0, 50000, 0)], [], 0, 0),
      ];
      const result = calculateImpactScore(timeline);
      expect(result.breakdown.forks).toBeLessThanOrEqual(20);
    });

    it("ensures contributors never exceeds 15", () => {
      const timeline = [
        createYearData(2025, [createRepoContribution(0, 5000, 0)], [], 0, 0),
      ];
      const result = calculateImpactScore(timeline);
      expect(result.breakdown.contributors).toBeLessThanOrEqual(15);
    });

    it("ensures reach never exceeds 20", () => {
      const timeline = [
        createYearData(
          2025,
          [createRepoContribution(50000, 50000, 0)],
          [],
          0,
          0,
        ),
      ];
      const result = calculateImpactScore(timeline);
      expect(result.breakdown.reach).toBeLessThanOrEqual(20);
    });

    it("ensures engagement never exceeds 10", () => {
      const timeline = [createYearData(2025, [], [], 1000, 1000)];
      const result = calculateImpactScore(timeline);
      expect(result.breakdown.engagement).toBeLessThanOrEqual(10);
    });

    it("ensures total score never exceeds 100", () => {
      const timeline = [
        createYearData(
          2025,
          [createRepoContribution(100000, 50000, 10000)],
          [],
          1000,
          1000,
        ),
      ];
      const result = calculateImpactScore(timeline);
      expect(result.score).toBeLessThanOrEqual(100);
    });
  });
});

describe("getImpactLabel", () => {
  it('returns "Exceptional" for scores 81-100', () => {
    expect(getImpactLabel(81)).toBe("Exceptional");
    expect(getImpactLabel(90)).toBe("Exceptional");
    expect(getImpactLabel(100)).toBe("Exceptional");
  });

  it('returns "Strong" for scores 61-80', () => {
    expect(getImpactLabel(61)).toBe("Strong");
    expect(getImpactLabel(70)).toBe("Strong");
    expect(getImpactLabel(80)).toBe("Strong");
  });

  it('returns "Moderate" for scores 41-60', () => {
    expect(getImpactLabel(41)).toBe("Moderate");
    expect(getImpactLabel(50)).toBe("Moderate");
    expect(getImpactLabel(60)).toBe("Moderate");
  });

  it('returns "Low" for scores 21-40', () => {
    expect(getImpactLabel(21)).toBe("Low");
    expect(getImpactLabel(30)).toBe("Low");
    expect(getImpactLabel(40)).toBe("Low");
  });

  it('returns "Minimal" for scores 0-20', () => {
    expect(getImpactLabel(0)).toBe("Minimal");
    expect(getImpactLabel(10)).toBe("Minimal");
    expect(getImpactLabel(20)).toBe("Minimal");
  });

  it("handles boundary values correctly", () => {
    expect(getImpactLabel(80)).toBe("Strong");
    expect(getImpactLabel(81)).toBe("Exceptional");
    expect(getImpactLabel(60)).toBe("Moderate");
    expect(getImpactLabel(61)).toBe("Strong");
    expect(getImpactLabel(40)).toBe("Low");
    expect(getImpactLabel(41)).toBe("Moderate");
    expect(getImpactLabel(20)).toBe("Minimal");
    expect(getImpactLabel(21)).toBe("Low");
  });
});
