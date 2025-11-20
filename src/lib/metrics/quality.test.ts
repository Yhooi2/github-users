import type { RepositoryContribution } from "@/apollo/queries/yearContributions";
import type { YearData } from "@/hooks/useUserAnalytics";
import { describe, expect, it } from "vitest";
import { calculateQualityScore, getQualityLabel } from "./quality";

// Helper to create mock repository contribution
function createRepoContribution(
  name: string,
  isFork: boolean,
  hasDescription: boolean,
  createdAt: string,
  primaryLanguage: string | null = "TypeScript",
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
      description: hasDescription ? "A test repository" : null,
      createdAt,
      updatedAt: new Date().toISOString(),
      pushedAt: new Date().toISOString(),
      stargazerCount: 0,
      forkCount: 0,
      isFork,
      isArchived: false,
      isPrivate: false,
      primaryLanguage: primaryLanguage
        ? { name: primaryLanguage, color: "#000000" }
        : null,
      owner: { login: "user", avatarUrl: "https://example.com/avatar.png" },
      licenseInfo: null,
      defaultBranchRef: { name: "main" },
    },
  };
}

// Helper to create mock year data
function createYearData(
  year: number,
  ownedRepos: RepositoryContribution[],
  contributions: RepositoryContribution[],
): YearData {
  return {
    year,
    totalCommits: 100,
    totalIssues: 0,
    totalPRs: 0,
    totalReviews: 0,
    ownedRepos,
    contributions,
  };
}

describe("calculateQualityScore", () => {
  describe("empty data", () => {
    it("returns 0 score for empty timeline", () => {
      const result = calculateQualityScore([]);
      expect(result.score).toBe(0);
      expect(result.level).toBe("Weak");
      expect(result.breakdown).toEqual({
        originality: 0,
        documentation: 0,
        ownership: 0,
        maturity: 0,
        stack: 0,
      });
      expect(result.details).toEqual({
        nonForkRepos: 0,
        totalOwnedRepos: 0,
        documentedRepos: 0,
        ownedReposCount: 0,
        contributedReposCount: 0,
        avgRepoAge: 0,
        uniqueLanguages: 0,
      });
    });
  });

  describe("originality component (0-30 points)", () => {
    it("awards full 30 points for 100% non-fork repos", () => {
      const fiveYearsAgo = new Date(
        Date.now() - 5 * 365 * 24 * 60 * 60 * 1000,
      ).toISOString();
      const timeline = [
        createYearData(
          2025,
          [
            createRepoContribution(
              "repo1",
              false,
              true,
              fiveYearsAgo,
              "TypeScript",
            ),
            createRepoContribution(
              "repo2",
              false,
              true,
              fiveYearsAgo,
              "JavaScript",
            ),
          ],
          [],
        ),
      ];
      const result = calculateQualityScore(timeline);
      expect(result.breakdown.originality).toBe(30);
      expect(result.details.nonForkRepos).toBe(2);
      expect(result.details.totalOwnedRepos).toBe(2);
    });

    it("awards proportional points for partial non-fork ratio", () => {
      const fiveYearsAgo = new Date(
        Date.now() - 5 * 365 * 24 * 60 * 60 * 1000,
      ).toISOString();
      const timeline = [
        createYearData(
          2025,
          [
            createRepoContribution(
              "repo1",
              false,
              true,
              fiveYearsAgo,
              "TypeScript",
            ), // original
            createRepoContribution(
              "repo2",
              true,
              true,
              fiveYearsAgo,
              "JavaScript",
            ), // fork
          ],
          [],
        ),
      ];
      const result = calculateQualityScore(timeline);
      expect(result.breakdown.originality).toBe(15); // 1/2 * 30 = 15
      expect(result.details.nonForkRepos).toBe(1);
    });

    it("awards 0 points for 100% fork repos", () => {
      const fiveYearsAgo = new Date(
        Date.now() - 5 * 365 * 24 * 60 * 60 * 1000,
      ).toISOString();
      const timeline = [
        createYearData(
          2025,
          [
            createRepoContribution(
              "repo1",
              true,
              true,
              fiveYearsAgo,
              "TypeScript",
            ),
            createRepoContribution(
              "repo2",
              true,
              true,
              fiveYearsAgo,
              "JavaScript",
            ),
          ],
          [],
        ),
      ];
      const result = calculateQualityScore(timeline);
      expect(result.breakdown.originality).toBe(0);
      expect(result.details.nonForkRepos).toBe(0);
    });

    it("handles mixed fork and non-fork repos correctly", () => {
      const fiveYearsAgo = new Date(
        Date.now() - 5 * 365 * 24 * 60 * 60 * 1000,
      ).toISOString();
      const timeline = [
        createYearData(
          2025,
          [
            createRepoContribution(
              "repo1",
              false,
              true,
              fiveYearsAgo,
              "TypeScript",
            ),
            createRepoContribution(
              "repo2",
              false,
              true,
              fiveYearsAgo,
              "JavaScript",
            ),
            createRepoContribution(
              "repo3",
              false,
              true,
              fiveYearsAgo,
              "Python",
            ),
            createRepoContribution("repo4", true, true, fiveYearsAgo, "Go"), // fork
          ],
          [],
        ),
      ];
      const result = calculateQualityScore(timeline);
      expect(result.breakdown.originality).toBe(23); // 3/4 * 30 = 22.5, rounded to 23
      expect(result.details.nonForkRepos).toBe(3);
      expect(result.details.totalOwnedRepos).toBe(4);
    });
  });

  describe("documentation component (0-25 points)", () => {
    it("awards full 25 points for 100% documented repos", () => {
      const fiveYearsAgo = new Date(
        Date.now() - 5 * 365 * 24 * 60 * 60 * 1000,
      ).toISOString();
      const timeline = [
        createYearData(
          2025,
          [
            createRepoContribution(
              "repo1",
              false,
              true,
              fiveYearsAgo,
              "TypeScript",
            ),
            createRepoContribution(
              "repo2",
              false,
              true,
              fiveYearsAgo,
              "JavaScript",
            ),
          ],
          [],
        ),
      ];
      const result = calculateQualityScore(timeline);
      expect(result.breakdown.documentation).toBe(25);
      expect(result.details.documentedRepos).toBe(2);
    });

    it("awards proportional points for partial documentation", () => {
      const fiveYearsAgo = new Date(
        Date.now() - 5 * 365 * 24 * 60 * 60 * 1000,
      ).toISOString();
      const timeline = [
        createYearData(
          2025,
          [
            createRepoContribution(
              "repo1",
              false,
              true,
              fiveYearsAgo,
              "TypeScript",
            ),
            createRepoContribution(
              "repo2",
              false,
              false,
              fiveYearsAgo,
              "JavaScript",
            ),
          ],
          [],
        ),
      ];
      const result = calculateQualityScore(timeline);
      expect(result.breakdown.documentation).toBe(13); // 1/2 * 25 = 12.5, rounded to 13
      expect(result.details.documentedRepos).toBe(1);
    });

    it("awards 0 points for no documented repos", () => {
      const fiveYearsAgo = new Date(
        Date.now() - 5 * 365 * 24 * 60 * 60 * 1000,
      ).toISOString();
      const timeline = [
        createYearData(
          2025,
          [
            createRepoContribution(
              "repo1",
              false,
              false,
              fiveYearsAgo,
              "TypeScript",
            ),
            createRepoContribution(
              "repo2",
              false,
              false,
              fiveYearsAgo,
              "JavaScript",
            ),
          ],
          [],
        ),
      ];
      const result = calculateQualityScore(timeline);
      expect(result.breakdown.documentation).toBe(0);
      expect(result.details.documentedRepos).toBe(0);
    });

    it("handles empty descriptions as undocumented", () => {
      const fiveYearsAgo = new Date(
        Date.now() - 5 * 365 * 24 * 60 * 60 * 1000,
      ).toISOString();
      const repo = createRepoContribution(
        "repo1",
        false,
        false,
        fiveYearsAgo,
        "TypeScript",
      );
      repo.repository.description = "   "; // whitespace only
      const timeline = [createYearData(2025, [repo], [])];
      const result = calculateQualityScore(timeline);
      expect(result.details.documentedRepos).toBe(0);
    });
  });

  describe("ownership component (0-20 points)", () => {
    it("awards full 20 points for 100% owned repos", () => {
      const fiveYearsAgo = new Date(
        Date.now() - 5 * 365 * 24 * 60 * 60 * 1000,
      ).toISOString();
      const timeline = [
        createYearData(
          2025,
          [
            createRepoContribution(
              "repo1",
              false,
              true,
              fiveYearsAgo,
              "TypeScript",
            ),
            createRepoContribution(
              "repo2",
              false,
              true,
              fiveYearsAgo,
              "JavaScript",
            ),
          ],
          [], // no contributions
        ),
      ];
      const result = calculateQualityScore(timeline);
      expect(result.breakdown.ownership).toBe(20);
      expect(result.details.ownedReposCount).toBe(2);
      expect(result.details.contributedReposCount).toBe(0);
    });

    it("awards proportional points for mixed ownership", () => {
      const fiveYearsAgo = new Date(
        Date.now() - 5 * 365 * 24 * 60 * 60 * 1000,
      ).toISOString();
      const timeline = [
        createYearData(
          2025,
          [
            createRepoContribution(
              "repo1",
              false,
              true,
              fiveYearsAgo,
              "TypeScript",
            ),
          ],
          [
            createRepoContribution(
              "contrib1",
              false,
              true,
              fiveYearsAgo,
              "JavaScript",
            ),
          ],
        ),
      ];
      const result = calculateQualityScore(timeline);
      expect(result.breakdown.ownership).toBe(10); // 1/2 * 20 = 10
      expect(result.details.ownedReposCount).toBe(1);
      expect(result.details.contributedReposCount).toBe(1);
    });

    it("awards lower points for more contributions than owned", () => {
      const fiveYearsAgo = new Date(
        Date.now() - 5 * 365 * 24 * 60 * 60 * 1000,
      ).toISOString();
      const timeline = [
        createYearData(
          2025,
          [
            createRepoContribution(
              "repo1",
              false,
              true,
              fiveYearsAgo,
              "TypeScript",
            ),
          ],
          [
            createRepoContribution(
              "contrib1",
              false,
              true,
              fiveYearsAgo,
              "JavaScript",
            ),
            createRepoContribution(
              "contrib2",
              false,
              true,
              fiveYearsAgo,
              "Python",
            ),
            createRepoContribution("contrib3", false, true, fiveYearsAgo, "Go"),
          ],
        ),
      ];
      const result = calculateQualityScore(timeline);
      expect(result.breakdown.ownership).toBe(5); // 1/4 * 20 = 5
    });

    it("awards 0 points when only contributions exist", () => {
      const fiveYearsAgo = new Date(
        Date.now() - 5 * 365 * 24 * 60 * 60 * 1000,
      ).toISOString();
      const timeline = [
        createYearData(
          2025,
          [], // no owned repos
          [
            createRepoContribution(
              "contrib1",
              false,
              true,
              fiveYearsAgo,
              "JavaScript",
            ),
          ],
        ),
      ];
      const result = calculateQualityScore(timeline);
      expect(result.breakdown.ownership).toBe(0);
      expect(result.details.ownedReposCount).toBe(0);
    });
  });

  describe("maturity component (0-15 points)", () => {
    it("awards 15 points for 5+ year average age", () => {
      const sixYearsAgo = new Date(
        Date.now() - 6 * 365 * 24 * 60 * 60 * 1000,
      ).toISOString();
      const timeline = [
        createYearData(
          2025,
          [
            createRepoContribution(
              "repo1",
              false,
              true,
              sixYearsAgo,
              "TypeScript",
            ),
          ],
          [],
        ),
      ];
      const result = calculateQualityScore(timeline);
      expect(result.breakdown.maturity).toBe(15);
      expect(result.details.avgRepoAge).toBeGreaterThan(5);
    });

    it("awards 12 points for 3-5 year average age", () => {
      const fourYearsAgo = new Date(
        Date.now() - 4 * 365 * 24 * 60 * 60 * 1000,
      ).toISOString();
      const timeline = [
        createYearData(
          2025,
          [
            createRepoContribution(
              "repo1",
              false,
              true,
              fourYearsAgo,
              "TypeScript",
            ),
          ],
          [],
        ),
      ];
      const result = calculateQualityScore(timeline);
      expect(result.breakdown.maturity).toBe(12);
      expect(result.details.avgRepoAge).toBeGreaterThan(3);
      expect(result.details.avgRepoAge).toBeLessThan(5);
    });

    it("awards 9 points for 2-3 year average age", () => {
      const twoHalfYearsAgo = new Date(
        Date.now() - 2.5 * 365 * 24 * 60 * 60 * 1000,
      ).toISOString();
      const timeline = [
        createYearData(
          2025,
          [
            createRepoContribution(
              "repo1",
              false,
              true,
              twoHalfYearsAgo,
              "TypeScript",
            ),
          ],
          [],
        ),
      ];
      const result = calculateQualityScore(timeline);
      expect(result.breakdown.maturity).toBe(9);
      expect(result.details.avgRepoAge).toBeGreaterThan(2);
    });

    it("awards 6 points for 1-2 year average age", () => {
      const oneHalfYearsAgo = new Date(
        Date.now() - 1.5 * 365 * 24 * 60 * 60 * 1000,
      ).toISOString();
      const timeline = [
        createYearData(
          2025,
          [
            createRepoContribution(
              "repo1",
              false,
              true,
              oneHalfYearsAgo,
              "TypeScript",
            ),
          ],
          [],
        ),
      ];
      const result = calculateQualityScore(timeline);
      expect(result.breakdown.maturity).toBe(6);
      expect(result.details.avgRepoAge).toBeGreaterThan(1);
    });

    it("awards 3 points for < 1 year average age", () => {
      const sixMonthsAgo = new Date(
        Date.now() - 0.5 * 365 * 24 * 60 * 60 * 1000,
      ).toISOString();
      const timeline = [
        createYearData(
          2025,
          [
            createRepoContribution(
              "repo1",
              false,
              true,
              sixMonthsAgo,
              "TypeScript",
            ),
          ],
          [],
        ),
      ];
      const result = calculateQualityScore(timeline);
      expect(result.breakdown.maturity).toBe(3);
      expect(result.details.avgRepoAge).toBeLessThan(1);
    });

    it("calculates average age correctly across multiple repos", () => {
      const fiveYearsAgo = new Date(
        Date.now() - 5 * 365 * 24 * 60 * 60 * 1000,
      ).toISOString();
      const oneYearAgo = new Date(
        Date.now() - 1 * 365 * 24 * 60 * 60 * 1000,
      ).toISOString();
      const timeline = [
        createYearData(
          2025,
          [
            createRepoContribution(
              "repo1",
              false,
              true,
              fiveYearsAgo,
              "TypeScript",
            ),
            createRepoContribution(
              "repo2",
              false,
              true,
              oneYearAgo,
              "JavaScript",
            ),
          ],
          [],
        ),
      ];
      const result = calculateQualityScore(timeline);
      // Average: (5 + 1) / 2 = 3 years
      expect(result.details.avgRepoAge).toBeGreaterThan(2.5);
      expect(result.details.avgRepoAge).toBeLessThan(3.5);
      expect(result.breakdown.maturity).toBe(12); // 3-5 years range
    });
  });

  describe("stack component (0-10 points)", () => {
    it("awards 10 points for 10+ unique languages", () => {
      const fiveYearsAgo = new Date(
        Date.now() - 5 * 365 * 24 * 60 * 60 * 1000,
      ).toISOString();
      const timeline = [
        createYearData(
          2025,
          [
            createRepoContribution(
              "repo1",
              false,
              true,
              fiveYearsAgo,
              "TypeScript",
            ),
            createRepoContribution(
              "repo2",
              false,
              true,
              fiveYearsAgo,
              "JavaScript",
            ),
            createRepoContribution(
              "repo3",
              false,
              true,
              fiveYearsAgo,
              "Python",
            ),
            createRepoContribution("repo4", false, true, fiveYearsAgo, "Go"),
            createRepoContribution("repo5", false, true, fiveYearsAgo, "Rust"),
            createRepoContribution("repo6", false, true, fiveYearsAgo, "Java"),
            createRepoContribution("repo7", false, true, fiveYearsAgo, "C++"),
            createRepoContribution("repo8", false, true, fiveYearsAgo, "Ruby"),
            createRepoContribution("repo9", false, true, fiveYearsAgo, "PHP"),
            createRepoContribution(
              "repo10",
              false,
              true,
              fiveYearsAgo,
              "Swift",
            ),
          ],
          [],
        ),
      ];
      const result = calculateQualityScore(timeline);
      expect(result.breakdown.stack).toBe(10);
      expect(result.details.uniqueLanguages).toBe(10);
    });

    it("awards 8 points for 7-9 unique languages", () => {
      const fiveYearsAgo = new Date(
        Date.now() - 5 * 365 * 24 * 60 * 60 * 1000,
      ).toISOString();
      const timeline = [
        createYearData(
          2025,
          [
            createRepoContribution(
              "repo1",
              false,
              true,
              fiveYearsAgo,
              "TypeScript",
            ),
            createRepoContribution(
              "repo2",
              false,
              true,
              fiveYearsAgo,
              "JavaScript",
            ),
            createRepoContribution(
              "repo3",
              false,
              true,
              fiveYearsAgo,
              "Python",
            ),
            createRepoContribution("repo4", false, true, fiveYearsAgo, "Go"),
            createRepoContribution("repo5", false, true, fiveYearsAgo, "Rust"),
            createRepoContribution("repo6", false, true, fiveYearsAgo, "Java"),
            createRepoContribution("repo7", false, true, fiveYearsAgo, "C++"),
            createRepoContribution("repo8", false, true, fiveYearsAgo, "Ruby"),
          ],
          [],
        ),
      ];
      const result = calculateQualityScore(timeline);
      expect(result.breakdown.stack).toBe(8);
      expect(result.details.uniqueLanguages).toBe(8);
    });

    it("awards 6 points for 5-6 unique languages", () => {
      const fiveYearsAgo = new Date(
        Date.now() - 5 * 365 * 24 * 60 * 60 * 1000,
      ).toISOString();
      const timeline = [
        createYearData(
          2025,
          [
            createRepoContribution(
              "repo1",
              false,
              true,
              fiveYearsAgo,
              "TypeScript",
            ),
            createRepoContribution(
              "repo2",
              false,
              true,
              fiveYearsAgo,
              "JavaScript",
            ),
            createRepoContribution(
              "repo3",
              false,
              true,
              fiveYearsAgo,
              "Python",
            ),
            createRepoContribution("repo4", false, true, fiveYearsAgo, "Go"),
            createRepoContribution("repo5", false, true, fiveYearsAgo, "Rust"),
          ],
          [],
        ),
      ];
      const result = calculateQualityScore(timeline);
      expect(result.breakdown.stack).toBe(6);
      expect(result.details.uniqueLanguages).toBe(5);
    });

    it("awards 4 points for 3-4 unique languages", () => {
      const fiveYearsAgo = new Date(
        Date.now() - 5 * 365 * 24 * 60 * 60 * 1000,
      ).toISOString();
      const timeline = [
        createYearData(
          2025,
          [
            createRepoContribution(
              "repo1",
              false,
              true,
              fiveYearsAgo,
              "TypeScript",
            ),
            createRepoContribution(
              "repo2",
              false,
              true,
              fiveYearsAgo,
              "JavaScript",
            ),
            createRepoContribution(
              "repo3",
              false,
              true,
              fiveYearsAgo,
              "Python",
            ),
          ],
          [],
        ),
      ];
      const result = calculateQualityScore(timeline);
      expect(result.breakdown.stack).toBe(4);
      expect(result.details.uniqueLanguages).toBe(3);
    });

    it("awards 2 points for 1-2 unique languages", () => {
      const fiveYearsAgo = new Date(
        Date.now() - 5 * 365 * 24 * 60 * 60 * 1000,
      ).toISOString();
      const timeline = [
        createYearData(
          2025,
          [
            createRepoContribution(
              "repo1",
              false,
              true,
              fiveYearsAgo,
              "TypeScript",
            ),
          ],
          [],
        ),
      ];
      const result = calculateQualityScore(timeline);
      expect(result.breakdown.stack).toBe(2);
      expect(result.details.uniqueLanguages).toBe(1);
    });

    it("awards 0 points for no languages", () => {
      const fiveYearsAgo = new Date(
        Date.now() - 5 * 365 * 24 * 60 * 60 * 1000,
      ).toISOString();
      const timeline = [
        createYearData(
          2025,
          [createRepoContribution("repo1", false, true, fiveYearsAgo, null)],
          [],
        ),
      ];
      const result = calculateQualityScore(timeline);
      expect(result.breakdown.stack).toBe(0);
      expect(result.details.uniqueLanguages).toBe(0);
    });

    it("deduplicates same language across multiple repos", () => {
      const fiveYearsAgo = new Date(
        Date.now() - 5 * 365 * 24 * 60 * 60 * 1000,
      ).toISOString();
      const timeline = [
        createYearData(
          2025,
          [
            createRepoContribution(
              "repo1",
              false,
              true,
              fiveYearsAgo,
              "TypeScript",
            ),
            createRepoContribution(
              "repo2",
              false,
              true,
              fiveYearsAgo,
              "TypeScript",
            ),
            createRepoContribution(
              "repo3",
              false,
              true,
              fiveYearsAgo,
              "TypeScript",
            ),
          ],
          [],
        ),
      ];
      const result = calculateQualityScore(timeline);
      expect(result.details.uniqueLanguages).toBe(1);
      expect(result.breakdown.stack).toBe(2);
    });
  });

  describe("score calculation", () => {
    it("sums all components correctly", () => {
      const fiveYearsAgo = new Date(
        Date.now() - 5 * 365 * 24 * 60 * 60 * 1000,
      ).toISOString();
      const timeline = [
        createYearData(
          2025,
          [
            createRepoContribution(
              "repo1",
              false,
              true,
              fiveYearsAgo,
              "TypeScript",
            ),
            createRepoContribution(
              "repo2",
              false,
              true,
              fiveYearsAgo,
              "JavaScript",
            ),
          ],
          [],
        ),
      ];
      const result = calculateQualityScore(timeline);

      const expectedScore =
        result.breakdown.originality +
        result.breakdown.documentation +
        result.breakdown.ownership +
        result.breakdown.maturity +
        result.breakdown.stack;

      expect(result.score).toBe(expectedScore);
    });

    it("rounds score to nearest integer", () => {
      const fourYearsAgo = new Date(
        Date.now() - 4 * 365 * 24 * 60 * 60 * 1000,
      ).toISOString();
      const timeline = [
        createYearData(
          2025,
          [
            createRepoContribution(
              "repo1",
              false,
              true,
              fourYearsAgo,
              "TypeScript",
            ),
          ],
          [
            createRepoContribution(
              "contrib1",
              false,
              true,
              fourYearsAgo,
              "JavaScript",
            ),
          ],
        ),
      ];
      const result = calculateQualityScore(timeline);
      expect(Number.isInteger(result.score)).toBe(true);
    });

    it("calculates excellent quality correctly", () => {
      const fiveYearsAgo = new Date(
        Date.now() - 5 * 365 * 24 * 60 * 60 * 1000,
      ).toISOString();
      const timeline = [
        createYearData(
          2025,
          [
            createRepoContribution(
              "repo1",
              false,
              true,
              fiveYearsAgo,
              "TypeScript",
            ),
            createRepoContribution(
              "repo2",
              false,
              true,
              fiveYearsAgo,
              "JavaScript",
            ),
            createRepoContribution(
              "repo3",
              false,
              true,
              fiveYearsAgo,
              "Python",
            ),
            createRepoContribution("repo4", false, true, fiveYearsAgo, "Go"),
            createRepoContribution("repo5", false, true, fiveYearsAgo, "Rust"),
          ],
          [],
        ),
      ];
      const result = calculateQualityScore(timeline);
      // All original (30), all documented (25), all owned (20), 5 years (15), 5 languages (6) = 96
      expect(result.score).toBeGreaterThan(80);
      expect(result.level).toBe("Excellent");
    });

    it("calculates strong quality correctly", () => {
      const threeYearsAgo = new Date(
        Date.now() - 3 * 365 * 24 * 60 * 60 * 1000,
      ).toISOString();
      const timeline = [
        createYearData(
          2025,
          [
            createRepoContribution(
              "repo1",
              false,
              true,
              threeYearsAgo,
              "TypeScript",
            ),
            createRepoContribution(
              "repo2",
              false,
              true,
              threeYearsAgo,
              "JavaScript",
            ),
            createRepoContribution(
              "repo3",
              true,
              false,
              threeYearsAgo,
              "Python",
            ), // fork
          ],
          [
            createRepoContribution(
              "contrib1",
              false,
              true,
              threeYearsAgo,
              "Go",
            ),
          ],
        ),
      ];
      const result = calculateQualityScore(timeline);
      // 2/3 original (20), 2/3 documented (~17), 3/4 owned (15), 3 years (12), 4 languages (4) = ~68
      expect(result.score).toBeGreaterThanOrEqual(61);
      expect(result.score).toBeLessThan(81);
      expect(result.level).toBe("Strong");
    });

    it("calculates good quality correctly", () => {
      const twoYearsAgo = new Date(
        Date.now() - 2 * 365 * 24 * 60 * 60 * 1000,
      ).toISOString();
      const timeline = [
        createYearData(
          2025,
          [
            createRepoContribution(
              "repo1",
              false,
              true,
              twoYearsAgo,
              "TypeScript",
            ),
            createRepoContribution(
              "repo2",
              true,
              false,
              twoYearsAgo,
              "JavaScript",
            ), // fork
          ],
          [
            createRepoContribution(
              "contrib1",
              false,
              true,
              twoYearsAgo,
              "Python",
            ),
          ],
        ),
      ];
      const result = calculateQualityScore(timeline);
      // 1/2 original (15), 1/2 documented (13), 2/3 owned (13), 2 years (9), 3 languages (4) = 54
      expect(result.score).toBeGreaterThanOrEqual(41);
      expect(result.score).toBeLessThan(61);
      expect(result.level).toBe("Good");
    });

    it("calculates fair quality correctly", () => {
      const oneYearAgo = new Date(
        Date.now() - 1 * 365 * 24 * 60 * 60 * 1000,
      ).toISOString();
      const timeline = [
        createYearData(
          2025,
          [
            createRepoContribution(
              "repo1",
              true,
              false,
              oneYearAgo,
              "TypeScript",
            ),
          ], // fork, no docs
          [
            createRepoContribution(
              "contrib1",
              false,
              true,
              oneYearAgo,
              "JavaScript",
            ),
            createRepoContribution(
              "contrib2",
              false,
              true,
              oneYearAgo,
              "Python",
            ),
          ],
        ),
      ];
      const result = calculateQualityScore(timeline);
      // 0 original (0), 0 documented (0), 1/3 owned (~7), 1 year (6), 3 languages (4) = ~17-27
      expect(result.score).toBeGreaterThanOrEqual(0);
      expect(result.score).toBeLessThan(41);
    });

    it("calculates weak quality correctly", () => {
      const sixMonthsAgo = new Date(
        Date.now() - 0.5 * 365 * 24 * 60 * 60 * 1000,
      ).toISOString();
      const timeline = [
        createYearData(
          2025,
          [],
          [
            createRepoContribution(
              "contrib1",
              true,
              false,
              sixMonthsAgo,
              "JavaScript",
            ),
          ],
        ),
      ];
      const result = calculateQualityScore(timeline);
      // No owned repos = all zeros = 0
      expect(result.score).toBeLessThan(21);
      expect(result.level).toBe("Weak");
    });
  });

  describe("deduplication across years", () => {
    it("deduplicates same repo across multiple years", () => {
      const fiveYearsAgo = new Date(
        Date.now() - 5 * 365 * 24 * 60 * 60 * 1000,
      ).toISOString();
      const repo = createRepoContribution(
        "repo1",
        false,
        true,
        fiveYearsAgo,
        "TypeScript",
      );
      const timeline = [
        createYearData(2025, [repo], []),
        createYearData(2024, [repo], []),
        createYearData(2023, [repo], []),
      ];
      const result = calculateQualityScore(timeline);
      expect(result.details.totalOwnedRepos).toBe(1); // Same repo URL
    });

    it("counts different repos with same name separately", () => {
      const fiveYearsAgo = new Date(
        Date.now() - 5 * 365 * 24 * 60 * 60 * 1000,
      ).toISOString();
      const repo1 = createRepoContribution(
        "repo1",
        false,
        true,
        fiveYearsAgo,
        "TypeScript",
      );
      const repo2 = createRepoContribution(
        "repo1",
        false,
        true,
        fiveYearsAgo,
        "TypeScript",
      );
      repo2.repository.url = "https://github.com/different/repo1";
      const timeline = [createYearData(2025, [repo1, repo2], [])];
      const result = calculateQualityScore(timeline);
      expect(result.details.totalOwnedRepos).toBe(2); // Different URLs
    });
  });

  describe("breakdown constraints", () => {
    it("ensures originality never exceeds 30", () => {
      const fiveYearsAgo = new Date(
        Date.now() - 5 * 365 * 24 * 60 * 60 * 1000,
      ).toISOString();
      const timeline = [
        createYearData(
          2025,
          Array.from({ length: 50 }, (_, i) =>
            createRepoContribution(
              `repo${i}`,
              false,
              true,
              fiveYearsAgo,
              "TypeScript",
            ),
          ),
          [],
        ),
      ];
      const result = calculateQualityScore(timeline);
      expect(result.breakdown.originality).toBeLessThanOrEqual(30);
    });

    it("ensures documentation never exceeds 25", () => {
      const fiveYearsAgo = new Date(
        Date.now() - 5 * 365 * 24 * 60 * 60 * 1000,
      ).toISOString();
      const timeline = [
        createYearData(
          2025,
          Array.from({ length: 50 }, (_, i) =>
            createRepoContribution(
              `repo${i}`,
              false,
              true,
              fiveYearsAgo,
              "TypeScript",
            ),
          ),
          [],
        ),
      ];
      const result = calculateQualityScore(timeline);
      expect(result.breakdown.documentation).toBeLessThanOrEqual(25);
    });

    it("ensures ownership never exceeds 20", () => {
      const fiveYearsAgo = new Date(
        Date.now() - 5 * 365 * 24 * 60 * 60 * 1000,
      ).toISOString();
      const timeline = [
        createYearData(
          2025,
          Array.from({ length: 50 }, (_, i) =>
            createRepoContribution(
              `repo${i}`,
              false,
              true,
              fiveYearsAgo,
              "TypeScript",
            ),
          ),
          [],
        ),
      ];
      const result = calculateQualityScore(timeline);
      expect(result.breakdown.ownership).toBeLessThanOrEqual(20);
    });

    it("ensures maturity never exceeds 15", () => {
      const tenYearsAgo = new Date(
        Date.now() - 10 * 365 * 24 * 60 * 60 * 1000,
      ).toISOString();
      const timeline = [
        createYearData(
          2025,
          [
            createRepoContribution(
              "repo1",
              false,
              true,
              tenYearsAgo,
              "TypeScript",
            ),
          ],
          [],
        ),
      ];
      const result = calculateQualityScore(timeline);
      expect(result.breakdown.maturity).toBeLessThanOrEqual(15);
    });

    it("ensures stack never exceeds 10", () => {
      const fiveYearsAgo = new Date(
        Date.now() - 5 * 365 * 24 * 60 * 60 * 1000,
      ).toISOString();
      const languages = [
        "TypeScript",
        "JavaScript",
        "Python",
        "Go",
        "Rust",
        "Java",
        "C++",
        "Ruby",
        "PHP",
        "Swift",
        "Kotlin",
        "C#",
        "Scala",
        "Haskell",
        "Elixir",
      ];
      const timeline = [
        createYearData(
          2025,
          languages.map((lang, i) =>
            createRepoContribution(`repo${i}`, false, true, fiveYearsAgo, lang),
          ),
          [],
        ),
      ];
      const result = calculateQualityScore(timeline);
      expect(result.breakdown.stack).toBeLessThanOrEqual(10);
    });

    it("ensures total score never exceeds 100", () => {
      const tenYearsAgo = new Date(
        Date.now() - 10 * 365 * 24 * 60 * 60 * 1000,
      ).toISOString();
      const languages = [
        "TypeScript",
        "JavaScript",
        "Python",
        "Go",
        "Rust",
        "Java",
        "C++",
        "Ruby",
        "PHP",
        "Swift",
        "Kotlin",
        "C#",
      ];
      const timeline = [
        createYearData(
          2025,
          languages.map((lang, i) =>
            createRepoContribution(`repo${i}`, false, true, tenYearsAgo, lang),
          ),
          [],
        ),
      ];
      const result = calculateQualityScore(timeline);
      expect(result.score).toBeLessThanOrEqual(100);
    });
  });
});

describe("getQualityLabel", () => {
  it('returns "Excellent" for scores 81-100', () => {
    expect(getQualityLabel(81)).toBe("Excellent");
    expect(getQualityLabel(90)).toBe("Excellent");
    expect(getQualityLabel(100)).toBe("Excellent");
  });

  it('returns "Strong" for scores 61-80', () => {
    expect(getQualityLabel(61)).toBe("Strong");
    expect(getQualityLabel(70)).toBe("Strong");
    expect(getQualityLabel(80)).toBe("Strong");
  });

  it('returns "Good" for scores 41-60', () => {
    expect(getQualityLabel(41)).toBe("Good");
    expect(getQualityLabel(50)).toBe("Good");
    expect(getQualityLabel(60)).toBe("Good");
  });

  it('returns "Fair" for scores 21-40', () => {
    expect(getQualityLabel(21)).toBe("Fair");
    expect(getQualityLabel(30)).toBe("Fair");
    expect(getQualityLabel(40)).toBe("Fair");
  });

  it('returns "Weak" for scores 0-20', () => {
    expect(getQualityLabel(0)).toBe("Weak");
    expect(getQualityLabel(10)).toBe("Weak");
    expect(getQualityLabel(20)).toBe("Weak");
  });

  it("handles boundary values correctly", () => {
    expect(getQualityLabel(80)).toBe("Strong");
    expect(getQualityLabel(81)).toBe("Excellent");
    expect(getQualityLabel(60)).toBe("Good");
    expect(getQualityLabel(61)).toBe("Strong");
    expect(getQualityLabel(40)).toBe("Fair");
    expect(getQualityLabel(41)).toBe("Good");
    expect(getQualityLabel(20)).toBe("Weak");
    expect(getQualityLabel(21)).toBe("Fair");
  });
});
