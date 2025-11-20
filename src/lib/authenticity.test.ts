import type { Repository } from "@/apollo/github-api.types";
import { createMockRepository } from "@/test/mocks/github-data";
import { describe, expect, it } from "vitest";
import {
  calculateAuthenticityScore,
  getAuthenticityBadgeText,
  getAuthenticityColor,
  type AuthenticityScore,
} from "./authenticity";

// Helper to create mock repository (uses centralized factory)
const createMockRepo = (overrides: Partial<Repository> = {}): Repository =>
  createMockRepository({
    id: "repo-1",
    name: "test-repo",
    description: "Test repository",
    forkCount: 0,
    stargazerCount: 0,
    url: "https://github.com/test/repo",
    isFork: false,
    isTemplate: false,
    parent: null,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    pushedAt: "2024-01-01T00:00:00Z",
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
    primaryLanguage: { name: "TypeScript" },
    languages: {
      totalSize: 100000,
      edges: [{ size: 100000, node: { name: "TypeScript" } }],
    },
    ...overrides,
  });

describe("calculateAuthenticityScore", () => {
  describe("Edge cases", () => {
    it("should return suspicious score for empty repository array", () => {
      const result = calculateAuthenticityScore([]);

      expect(result.score).toBe(0);
      expect(result.category).toBe("Suspicious");
      expect(result.flags).toContain("No repositories found");
      expect(result.metadata.totalRepos).toBe(0);
    });

    it("should handle repositories with null values gracefully", () => {
      const repo = createMockRepo({
        pushedAt: null,
        primaryLanguage: null,
        defaultBranchRef: null,
        licenseInfo: null,
      });

      const result = calculateAuthenticityScore([repo]);

      expect(result.score).toBeGreaterThanOrEqual(0);
      expect(result.score).toBeLessThanOrEqual(100);
    });
  });

  describe("Originality Score", () => {
    it("should give high originality score for all original repos", () => {
      const repos = [
        createMockRepo({ isFork: false }),
        createMockRepo({ isFork: false, id: "repo-2" }),
        createMockRepo({ isFork: false, id: "repo-3" }),
      ];

      const result = calculateAuthenticityScore(repos);

      expect(result.breakdown.originalityScore).toBe(25);
      expect(result.metadata.originalRepos).toBe(3);
      expect(result.metadata.forkedRepos).toBe(0);
    });

    it("should give low originality score for mostly forked repos", () => {
      const repos = [
        createMockRepo({ isFork: true }),
        createMockRepo({ isFork: true, id: "repo-2" }),
        createMockRepo({ isFork: false, id: "repo-3" }),
      ];

      const result = calculateAuthenticityScore(repos);

      expect(result.breakdown.originalityScore).toBeLessThan(10);
      expect(result.metadata.forkedRepos).toBe(2);
      expect(result.flags).toContain("Less than 30% original repositories");
    });

    it("should flag when forks exceed original repos significantly", () => {
      const repos = [
        createMockRepo({ isFork: false }),
        createMockRepo({ isFork: true, id: "repo-2" }),
        createMockRepo({ isFork: true, id: "repo-3" }),
        createMockRepo({ isFork: true, id: "repo-4" }),
      ];

      const result = calculateAuthenticityScore(repos);

      expect(result.flags).toContain(
        "Significantly more forks than original repos",
      );
    });

    it("should not count template repos as original", () => {
      const repos = [
        createMockRepo({ isTemplate: true }),
        createMockRepo({ isFork: true, id: "repo-2" }),
      ];

      const result = calculateAuthenticityScore(repos);

      expect(result.metadata.originalRepos).toBe(0);
      expect(result.metadata.templateRepos).toBe(1);
    });
  });

  describe("Activity Score", () => {
    it("should give high activity score for recently active repos", () => {
      const now = new Date();
      const recentDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000); // 30 days ago

      const repos = [
        createMockRepo({ pushedAt: recentDate.toISOString() }),
        createMockRepo({ pushedAt: recentDate.toISOString(), id: "repo-2" }),
      ];

      const result = calculateAuthenticityScore(repos);

      expect(result.breakdown.activityScore).toBeGreaterThan(10);
    });

    it("should give low activity score for old repos", () => {
      const oldDate = new Date("2020-01-01T00:00:00Z");

      const repos = [
        createMockRepo({ pushedAt: oldDate.toISOString() }),
        createMockRepo({ pushedAt: oldDate.toISOString(), id: "repo-2" }),
      ];

      const result = calculateAuthenticityScore(repos);

      expect(result.flags).toContain(
        "Less than 20% repos active in last 90 days",
      );
    });

    it("should consider commit volume in activity score", () => {
      const reposWithManyCommits = [
        createMockRepo({
          defaultBranchRef: {
            target: { history: { totalCount: 100 } },
          },
        }),
        createMockRepo({
          id: "repo-2",
          defaultBranchRef: {
            target: { history: { totalCount: 100 } },
          },
        }),
      ];

      const reposWithFewCommits = [
        createMockRepo({
          defaultBranchRef: {
            target: { history: { totalCount: 2 } },
          },
        }),
        createMockRepo({
          id: "repo-2",
          defaultBranchRef: {
            target: { history: { totalCount: 2 } },
          },
        }),
      ];

      const resultMany = calculateAuthenticityScore(reposWithManyCommits);
      const resultFew = calculateAuthenticityScore(reposWithFewCommits);

      expect(resultMany.breakdown.activityScore).toBeGreaterThan(
        resultFew.breakdown.activityScore,
      );
    });

    it("should flag low average commits per repository", () => {
      const repos = [
        createMockRepo({
          defaultBranchRef: {
            target: { history: { totalCount: 2 } },
          },
        }),
      ];

      const result = calculateAuthenticityScore(repos);

      expect(result.flags).toContain("Low average commits per repository");
    });
  });

  describe("Engagement Score", () => {
    it("should give high engagement score for popular repos", () => {
      const repos = [
        createMockRepo({
          stargazerCount: 100,
          forkCount: 50,
          watchers: { totalCount: 20 },
        }),
      ];

      const result = calculateAuthenticityScore(repos);

      expect(result.breakdown.engagementScore).toBeGreaterThanOrEqual(10);
    });

    it("should use logarithmic scale for engagement", () => {
      const repos1 = [createMockRepo({ stargazerCount: 1 })];
      const repos2 = [createMockRepo({ stargazerCount: 100 })];
      const repos3 = [createMockRepo({ stargazerCount: 10000 })];

      const result1 = calculateAuthenticityScore(repos1);
      const result2 = calculateAuthenticityScore(repos2);
      const result3 = calculateAuthenticityScore(repos3);

      // Logarithmic scale means diminishing returns
      const diff1to2 =
        result2.breakdown.engagementScore - result1.breakdown.engagementScore;
      const diff2to3 =
        result3.breakdown.engagementScore - result2.breakdown.engagementScore;

      // Use tolerance for floating point comparison
      expect(diff1to2 - diff2to3).toBeGreaterThan(0.1);
    });

    it("should flag repos with no stars", () => {
      const repos = Array(6)
        .fill(null)
        .map((_, i) => createMockRepo({ id: `repo-${i}`, stargazerCount: 0 }));

      const result = calculateAuthenticityScore(repos);

      expect(result.flags).toContain("No stars across all repositories");
    });
  });

  describe("Code Ownership Score", () => {
    it("should give high score for diverse languages", () => {
      const repos = [
        createMockRepo({
          primaryLanguage: { name: "TypeScript" },
          languages: {
            totalSize: 100000,
            edges: [
              { size: 50000, node: { name: "TypeScript" } },
              { size: 30000, node: { name: "JavaScript" } },
              { size: 20000, node: { name: "CSS" } },
            ],
          },
        }),
        createMockRepo({
          id: "repo-2",
          primaryLanguage: { name: "Python" },
          languages: {
            totalSize: 100000,
            edges: [
              { size: 80000, node: { name: "Python" } },
              { size: 20000, node: { name: "Shell" } },
            ],
          },
        }),
      ];

      const result = calculateAuthenticityScore(repos);

      expect(result.breakdown.codeOwnershipScore).toBeGreaterThanOrEqual(15);
    });

    it("should flag limited language diversity", () => {
      const repos = [
        createMockRepo({
          primaryLanguage: { name: "JavaScript" },
          languages: {
            totalSize: 10000,
            edges: [{ size: 10000, node: { name: "JavaScript" } }],
          },
        }),
      ];

      const result = calculateAuthenticityScore(repos);

      expect(result.flags).toContain(
        "Limited language diversity (less than 2 languages)",
      );
    });

    it("should consider code size in ownership score", () => {
      const reposLargeCode = [
        createMockRepo({
          languages: {
            totalSize: 500000,
            edges: [{ size: 500000, node: { name: "TypeScript" } }],
          },
        }),
      ];

      const reposSmallCode = [
        createMockRepo({
          languages: {
            totalSize: 1000,
            edges: [{ size: 1000, node: { name: "TypeScript" } }],
          },
        }),
      ];

      const resultLarge = calculateAuthenticityScore(reposLargeCode);
      const resultSmall = calculateAuthenticityScore(reposSmallCode);

      expect(resultLarge.breakdown.codeOwnershipScore).toBeGreaterThan(
        resultSmall.breakdown.codeOwnershipScore,
      );
    });
  });

  describe("Overall Score Categories", () => {
    it('should categorize high score as "High"', () => {
      const repos = Array(5)
        .fill(null)
        .map((_, i) =>
          createMockRepo({
            id: `repo-${i}`,
            isFork: false,
            stargazerCount: 50,
            forkCount: 20,
            pushedAt: new Date().toISOString(),
            defaultBranchRef: {
              target: { history: { totalCount: 100 } },
            },
            languages: {
              totalSize: 500000,
              edges: [
                { size: 300000, node: { name: "TypeScript" } },
                { size: 200000, node: { name: "JavaScript" } },
              ],
            },
          }),
        );

      const result = calculateAuthenticityScore(repos);

      expect(result.category).toBe("High");
      expect(result.score).toBeGreaterThanOrEqual(80);
    });

    it('should categorize medium score as "Medium"', () => {
      const repos = Array(5)
        .fill(null)
        .map((_, i) =>
          createMockRepo({
            id: `repo-${i}`,
            isFork: i > 2, // 3 original, 2 forked = 60% original
            stargazerCount: 20,
            forkCount: 5,
            watchers: { totalCount: 3 },
            pushedAt: new Date(
              Date.now() - 60 * 24 * 60 * 60 * 1000,
            ).toISOString(), // 2 months ago
            defaultBranchRef: {
              target: { history: { totalCount: 30 } },
            },
            languages: {
              totalSize: 200000,
              edges: [
                { size: 150000, node: { name: "TypeScript" } },
                { size: 50000, node: { name: "JavaScript" } },
              ],
            },
          }),
        );

      const result = calculateAuthenticityScore(repos);

      expect(result.score).toBeGreaterThanOrEqual(40);
      expect(result.score).toBeLessThan(80);
    });

    it('should categorize low score as "Low" or "Suspicious"', () => {
      const repos = [
        createMockRepo({
          isFork: true,
          stargazerCount: 0,
          pushedAt: new Date("2020-01-01").toISOString(),
          defaultBranchRef: {
            target: { history: { totalCount: 1 } },
          },
        }),
      ];

      const result = calculateAuthenticityScore(repos);

      expect(result.score).toBeLessThan(60);
    });
  });

  describe("Suspicious Patterns", () => {
    it("should flag high percentage of archived repos", () => {
      const repos = Array(4)
        .fill(null)
        .map((_, i) =>
          createMockRepo({
            id: `repo-${i}`,
            isArchived: i < 3, // 3 out of 4 are archived
          }),
        );

      const result = calculateAuthenticityScore(repos);

      expect(result.flags).toContain("More than 50% repos are archived");
      expect(result.metadata.archivedRepos).toBe(3);
    });

    it("should flag many repos with no original work", () => {
      const repos = Array(25)
        .fill(null)
        .map((_, i) =>
          createMockRepo({
            id: `repo-${i}`,
            isFork: true,
          }),
        );

      const result = calculateAuthenticityScore(repos);

      expect(result.flags).toContain(
        "No original repositories despite having many repos",
      );
    });
  });

  describe("Score bounds", () => {
    it("should always return score between 0-100", () => {
      const testCases = [
        [],
        [createMockRepo()],
        Array(100)
          .fill(null)
          .map((_, i) => createMockRepo({ id: `repo-${i}` })),
      ];

      testCases.forEach((repos) => {
        const result = calculateAuthenticityScore(repos);
        expect(result.score).toBeGreaterThanOrEqual(0);
        expect(result.score).toBeLessThanOrEqual(100);
      });
    });

    it("should return valid category for all scores", () => {
      const validCategories: AuthenticityScore["category"][] = [
        "High",
        "Medium",
        "Low",
        "Suspicious",
      ];

      const result = calculateAuthenticityScore([createMockRepo()]);

      expect(validCategories).toContain(result.category);
    });
  });
});

describe("getAuthenticityColor", () => {
  it("should return correct color for each category", () => {
    expect(getAuthenticityColor("High")).toContain("green");
    expect(getAuthenticityColor("Medium")).toContain("yellow");
    expect(getAuthenticityColor("Low")).toContain("orange");
    expect(getAuthenticityColor("Suspicious")).toContain("red");
  });

  it("should include dark mode variants", () => {
    const categories: AuthenticityScore["category"][] = [
      "High",
      "Medium",
      "Low",
      "Suspicious",
    ];

    categories.forEach((category) => {
      const color = getAuthenticityColor(category);
      expect(color).toContain("dark:");
    });
  });
});

describe("getAuthenticityBadgeText", () => {
  it("should return user-friendly text for each category", () => {
    expect(getAuthenticityBadgeText("High")).toBe("Highly Authentic");
    expect(getAuthenticityBadgeText("Medium")).toBe("Moderately Authentic");
    expect(getAuthenticityBadgeText("Low")).toBe("Limited Activity");
    expect(getAuthenticityBadgeText("Suspicious")).toBe("Suspicious Activity");
  });
});
