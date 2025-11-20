import {
  createMockRepository,
  mockArchivedRepository,
  mockEmptyRepository,
  mockForkedRepository,
} from "@/test/mocks/github-data";
import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useAuthenticityScore } from "./useAuthenticityScore";

describe("useAuthenticityScore", () => {
  describe("Basic functionality", () => {
    it("should return authenticity score for repositories", () => {
      const repositories = [
        createMockRepository({ name: "repo1", stargazerCount: 100 }),
        createMockRepository({ name: "repo2", stargazerCount: 50 }),
      ];

      const { result } = renderHook(() => useAuthenticityScore(repositories));

      expect(result.current).toHaveProperty("score");
      expect(result.current).toHaveProperty("category");
      expect(result.current).toHaveProperty("breakdown");
      expect(result.current).toHaveProperty("flags");
      expect(result.current).toHaveProperty("metadata");
    });

    it("should return score of 0 for empty repository array", () => {
      const { result } = renderHook(() => useAuthenticityScore([]));

      expect(result.current.score).toBe(0);
      expect(result.current.category).toBe("Suspicious");
      expect(result.current.flags).toContain("No repositories found");
    });

    it("should calculate correct metadata", () => {
      const repositories = [
        createMockRepository({ name: "original1", isFork: false }),
        mockForkedRepository,
        mockArchivedRepository,
      ];

      const { result } = renderHook(() => useAuthenticityScore(repositories));

      expect(result.current.metadata).toEqual({
        totalRepos: 3,
        originalRepos: 2,
        forkedRepos: 1,
        archivedRepos: 1,
        templateRepos: 0,
      });
    });
  });

  describe("Score categories", () => {
    it("should return High category for highly active developers", () => {
      const recentDate = new Date();
      recentDate.setDate(recentDate.getDate() - 30); // Recent activity

      const repositories = Array.from({ length: 10 }, (_, i) =>
        createMockRepository({
          name: `repo${i}`,
          stargazerCount: 150,
          forkCount: 60,
          isFork: false,
          pushedAt: recentDate.toISOString(),
          watchers: { totalCount: 40 },
          primaryLanguage: {
            name: ["TypeScript", "JavaScript", "Python", "Go", "Rust"][i % 5],
          },
          languages: {
            totalSize: 600000,
            edges: [
              { node: { name: "TypeScript" }, size: 300000 },
              { node: { name: "JavaScript" }, size: 200000 },
              { node: { name: "CSS" }, size: 100000 },
            ],
          },
          defaultBranchRef: {
            target: {
              history: {
                totalCount: 100,
              },
            },
          },
        }),
      );

      const { result } = renderHook(() => useAuthenticityScore(repositories));

      expect(result.current.score).toBeGreaterThanOrEqual(80);
      expect(result.current.category).toBe("High");
    });

    it("should return Medium category for moderately active developers", () => {
      const recentDate = new Date();
      recentDate.setDate(recentDate.getDate() - 30);

      const repositories = Array.from({ length: 5 }, (_, i) =>
        createMockRepository({
          name: `repo${i}`,
          stargazerCount: 15,
          forkCount: 5,
          isFork: false,
          pushedAt: recentDate.toISOString(),
          watchers: { totalCount: 5 },
          primaryLanguage: { name: ["TypeScript", "JavaScript"][i % 2] },
          languages: {
            totalSize: 200000,
            edges: [
              { node: { name: "TypeScript" }, size: 150000 },
              { node: { name: "JavaScript" }, size: 50000 },
            ],
          },
          defaultBranchRef: {
            target: {
              history: {
                totalCount: 35,
              },
            },
          },
        }),
      );

      const { result } = renderHook(() => useAuthenticityScore(repositories));

      expect(result.current.score).toBeGreaterThanOrEqual(60);
      expect(result.current.score).toBeLessThan(80);
      expect(result.current.category).toBe("Medium");
    });

    it("should return Low category for limited activity", () => {
      const repositories = [
        createMockRepository({
          name: "repo1",
          stargazerCount: 5,
          isFork: false,
          defaultBranchRef: {
            target: {
              history: {
                totalCount: 3,
              },
            },
          },
        }),
        mockForkedRepository,
      ];

      const { result } = renderHook(() => useAuthenticityScore(repositories));

      expect(result.current.score).toBeGreaterThanOrEqual(40);
      expect(result.current.score).toBeLessThan(60);
      expect(result.current.category).toBe("Low");
    });

    it("should return Suspicious category for concerning patterns", () => {
      // Create old, forked repositories with minimal activity and no engagement
      const oldDate = new Date();
      oldDate.setDate(oldDate.getDate() - 365); // 1 year ago

      const repositories = [
        {
          ...mockForkedRepository,
          pushedAt: oldDate.toISOString(),
          stargazerCount: 0,
          forkCount: 0,
          watchers: { totalCount: 0 },
        },
        {
          ...mockForkedRepository,
          pushedAt: oldDate.toISOString(),
          stargazerCount: 0,
          forkCount: 0,
          watchers: { totalCount: 0 },
        },
        {
          ...mockArchivedRepository,
          stargazerCount: 0,
          forkCount: 0,
          watchers: { totalCount: 0 },
        },
      ];

      const { result } = renderHook(() => useAuthenticityScore(repositories));

      expect(result.current.score).toBeLessThan(40);
      expect(result.current.category).toBe("Suspicious");
    });
  });

  describe("Score breakdown", () => {
    it("should include breakdown of all score components", () => {
      const repositories = [createMockRepository({ name: "repo1" })];

      const { result } = renderHook(() => useAuthenticityScore(repositories));

      expect(result.current.breakdown).toHaveProperty("originalityScore");
      expect(result.current.breakdown).toHaveProperty("activityScore");
      expect(result.current.breakdown).toHaveProperty("engagementScore");
      expect(result.current.breakdown).toHaveProperty("codeOwnershipScore");
    });

    it("should calculate originality score based on original vs forked repos", () => {
      const repositories = [
        createMockRepository({ name: "original", isFork: false }),
        mockForkedRepository,
      ];

      const { result } = renderHook(() => useAuthenticityScore(repositories));

      // 50% original repos = 12.5 points
      expect(result.current.breakdown.originalityScore).toBeCloseTo(12.5, 1);
    });

    it("should calculate activity score based on recent commits", () => {
      const recentDate = new Date();
      recentDate.setDate(recentDate.getDate() - 30); // 30 days ago

      const repositories = [
        createMockRepository({
          name: "active",
          pushedAt: recentDate.toISOString(),
          defaultBranchRef: {
            target: {
              history: {
                totalCount: 50,
              },
            },
          },
        }),
      ];

      const { result } = renderHook(() => useAuthenticityScore(repositories));

      // Should have activity score for recent pushes and commits
      expect(result.current.breakdown.activityScore).toBeGreaterThan(0);
    });

    it("should calculate engagement score based on stars/forks/watchers", () => {
      const repositories = [
        createMockRepository({
          name: "popular",
          stargazerCount: 100,
          forkCount: 50,
          watchers: { totalCount: 20 },
        }),
      ];

      const { result } = renderHook(() => useAuthenticityScore(repositories));

      // Should have engagement score
      expect(result.current.breakdown.engagementScore).toBeGreaterThan(0);
    });

    it("should calculate code ownership score based on language diversity", () => {
      const repositories = [
        createMockRepository({
          name: "polyglot",
          primaryLanguage: { name: "TypeScript" },
          languages: {
            totalSize: 500000,
            edges: [
              { node: { name: "TypeScript" }, size: 300000 },
              { node: { name: "JavaScript" }, size: 100000 },
              { node: { name: "Python" }, size: 100000 },
            ],
          },
        }),
      ];

      const { result } = renderHook(() => useAuthenticityScore(repositories));

      // Should have code ownership score
      expect(result.current.breakdown.codeOwnershipScore).toBeGreaterThan(0);
    });
  });

  describe("Flags and warnings", () => {
    it("should flag low originality", () => {
      const repositories = [
        mockForkedRepository,
        mockForkedRepository,
        mockForkedRepository,
        createMockRepository({ name: "original", isFork: false }),
      ];

      const { result } = renderHook(() => useAuthenticityScore(repositories));

      expect(result.current.flags).toContain(
        "Less than 30% original repositories",
      );
    });

    it("should flag low recent activity", () => {
      const oldDate = new Date();
      oldDate.setDate(oldDate.getDate() - 200); // 200 days ago

      const repositories = Array.from({ length: 5 }, (_, i) =>
        createMockRepository({
          name: `repo${i}`,
          pushedAt: oldDate.toISOString(),
        }),
      );

      const { result } = renderHook(() => useAuthenticityScore(repositories));

      expect(result.current.flags).toContain(
        "Less than 20% repos active in last 90 days",
      );
    });

    it("should flag low commit count", () => {
      const repositories = [
        createMockRepository({
          name: "low-commits",
          defaultBranchRef: {
            target: {
              history: {
                totalCount: 2,
              },
            },
          },
        }),
      ];

      const { result } = renderHook(() => useAuthenticityScore(repositories));

      expect(result.current.flags).toContain(
        "Low average commits per repository",
      );
    });

    it("should flag no stars across repositories", () => {
      const repositories = Array.from({ length: 6 }, (_, i) =>
        createMockRepository({
          name: `repo${i}`,
          stargazerCount: 0,
        }),
      );

      const { result } = renderHook(() => useAuthenticityScore(repositories));

      expect(result.current.flags).toContain(
        "No stars across all repositories",
      );
    });

    it("should flag limited language diversity", () => {
      const repositories = [
        createMockRepository({
          name: "mono-lang",
          primaryLanguage: { name: "JavaScript" },
          languages: {
            totalSize: 100000,
            edges: [{ node: { name: "JavaScript" }, size: 100000 }],
          },
        }),
      ];

      const { result } = renderHook(() => useAuthenticityScore(repositories));

      expect(result.current.flags).toContain(
        "Limited language diversity (less than 2 languages)",
      );
    });

    it("should flag archived repositories", () => {
      const repositories = [
        mockArchivedRepository,
        mockArchivedRepository,
        createMockRepository({ name: "active", isArchived: false }),
      ];

      const { result } = renderHook(() => useAuthenticityScore(repositories));

      expect(result.current.flags).toContain(
        "More than 50% repos are archived",
      );
    });

    it("should flag no original repos despite many repos", () => {
      const repositories = Array.from(
        { length: 25 },
        () => mockForkedRepository,
      );

      const { result } = renderHook(() => useAuthenticityScore(repositories));

      expect(result.current.flags).toContain(
        "No original repositories despite having many repos",
      );
    });

    it("should flag significantly more forks than original repos", () => {
      const repositories = [
        createMockRepository({ name: "original", isFork: false }),
        mockForkedRepository,
        mockForkedRepository,
        mockForkedRepository,
      ];

      const { result } = renderHook(() => useAuthenticityScore(repositories));

      expect(result.current.flags).toContain(
        "Significantly more forks than original repos",
      );
    });
  });

  describe("Memoization behavior", () => {
    it("should return same reference when repositories array is the same", () => {
      const repositories = [createMockRepository({ name: "repo1" })];

      const { result, rerender } = renderHook(
        ({ repos }) => useAuthenticityScore(repos),
        {
          initialProps: { repos: repositories },
        },
      );

      const firstResult = result.current;
      rerender({ repos: repositories });
      const secondResult = result.current;

      expect(firstResult).toBe(secondResult);
    });

    it("should recalculate when repositories array changes", () => {
      const repositories1 = [
        createMockRepository({ name: "repo1", stargazerCount: 50 }),
      ];
      const repositories2 = [
        createMockRepository({ name: "repo2", stargazerCount: 100 }),
      ];

      const { result, rerender } = renderHook(
        ({ repos }) => useAuthenticityScore(repos),
        {
          initialProps: { repos: repositories1 },
        },
      );

      const firstResult = result.current;
      rerender({ repos: repositories2 });
      const secondResult = result.current;

      expect(firstResult).not.toBe(secondResult);
    });
  });

  describe("Edge cases", () => {
    it("should handle repositories with null values gracefully", () => {
      const repositories = [
        createMockRepository({
          name: "null-values",
          stargazerCount: 0,
          forkCount: 0,
          primaryLanguage: null,
          watchers: { totalCount: 0 },
          languages: { totalSize: 0, edges: [] },
          defaultBranchRef: null,
        }),
      ];

      const { result } = renderHook(() => useAuthenticityScore(repositories));

      expect(result.current.score).toBeGreaterThanOrEqual(0);
      expect(result.current.category).toBeDefined();
    });

    it("should handle empty repository (all zeros)", () => {
      const repositories = [mockEmptyRepository];

      const { result } = renderHook(() => useAuthenticityScore(repositories));

      expect(result.current.score).toBeGreaterThanOrEqual(0);
      expect(result.current.score).toBeLessThan(40);
      expect(result.current.category).toBe("Suspicious");
    });

    it("should handle single repository", () => {
      const repositories = [createMockRepository({ name: "solo" })];

      const { result } = renderHook(() => useAuthenticityScore(repositories));

      expect(result.current.metadata.totalRepos).toBe(1);
      expect(result.current.score).toBeGreaterThanOrEqual(0);
    });

    it("should handle large repository count", () => {
      const repositories = Array.from({ length: 100 }, (_, i) =>
        createMockRepository({ name: `repo${i}`, stargazerCount: i * 10 }),
      );

      const { result } = renderHook(() => useAuthenticityScore(repositories));

      expect(result.current.metadata.totalRepos).toBe(100);
      expect(result.current.score).toBeGreaterThanOrEqual(0);
      expect(result.current.score).toBeLessThanOrEqual(100);
    });
  });
});
