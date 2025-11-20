import { createMockRepository } from "@/test/mocks/github-data";
import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useRepositorySorting } from "./useRepositorySorting";

describe("useRepositorySorting", () => {
  describe("Initial state", () => {
    it("should initialize with default sort (stars desc)", () => {
      const repositories = [createMockRepository({ name: "repo1" })];
      const { result } = renderHook(() => useRepositorySorting(repositories));

      expect(result.current.sorting).toEqual({
        field: "stars",
        direction: "desc",
      });
      expect(result.current.isDefaultSort).toBe(true);
    });

    it("should initialize with custom initial sort", () => {
      const repositories = [createMockRepository({ name: "repo1" })];
      const { result } = renderHook(() =>
        useRepositorySorting(repositories, { field: "name", direction: "asc" }),
      );

      expect(result.current.sorting).toEqual({
        field: "name",
        direction: "asc",
      });
      expect(result.current.isDefaultSort).toBe(true);
    });
  });

  describe("setSortBy", () => {
    it("should update sort field", () => {
      const repositories = [createMockRepository({ name: "repo1" })];
      const { result } = renderHook(() => useRepositorySorting(repositories));

      act(() => {
        result.current.setSortBy("forks");
      });

      expect(result.current.sorting.field).toBe("forks");
      expect(result.current.sorting.direction).toBe("desc"); // Direction unchanged
    });

    it("should preserve direction when changing field", () => {
      const repositories = [createMockRepository({ name: "repo1" })];
      const { result } = renderHook(() => useRepositorySorting(repositories));

      act(() => {
        result.current.setSortDirection("asc");
        result.current.setSortBy("commits");
      });

      expect(result.current.sorting).toEqual({
        field: "commits",
        direction: "asc",
      });
    });

    it("should support all sort field types", () => {
      const repositories = [createMockRepository({ name: "repo1" })];
      const { result } = renderHook(() => useRepositorySorting(repositories));

      const sortFields: Array<
        | "stars"
        | "forks"
        | "watchers"
        | "commits"
        | "size"
        | "updated"
        | "created"
        | "name"
      > = [
        "stars",
        "forks",
        "watchers",
        "commits",
        "size",
        "updated",
        "created",
        "name",
      ];

      sortFields.forEach((field) => {
        act(() => {
          result.current.setSortBy(field);
        });
        expect(result.current.sorting.field).toBe(field);
      });
    });
  });

  describe("setSortDirection", () => {
    it("should update sort direction", () => {
      const repositories = [createMockRepository({ name: "repo1" })];
      const { result } = renderHook(() => useRepositorySorting(repositories));

      act(() => {
        result.current.setSortDirection("asc");
      });

      expect(result.current.sorting.direction).toBe("asc");
      expect(result.current.sorting.field).toBe("stars"); // Field unchanged
    });

    it("should preserve field when changing direction", () => {
      const repositories = [createMockRepository({ name: "repo1" })];
      const { result } = renderHook(() => useRepositorySorting(repositories));

      act(() => {
        result.current.setSortBy("name");
        result.current.setSortDirection("asc");
      });

      expect(result.current.sorting).toEqual({
        field: "name",
        direction: "asc",
      });
    });
  });

  describe("toggleDirection", () => {
    it("should toggle from desc to asc", () => {
      const repositories = [createMockRepository({ name: "repo1" })];
      const { result } = renderHook(() => useRepositorySorting(repositories));

      // Default is desc
      expect(result.current.sorting.direction).toBe("desc");

      act(() => {
        result.current.toggleDirection();
      });

      expect(result.current.sorting.direction).toBe("asc");
    });

    it("should toggle from asc to desc", () => {
      const repositories = [createMockRepository({ name: "repo1" })];
      const { result } = renderHook(() =>
        useRepositorySorting(repositories, {
          field: "stars",
          direction: "asc",
        }),
      );

      act(() => {
        result.current.toggleDirection();
      });

      expect(result.current.sorting.direction).toBe("desc");
    });

    it("should toggle multiple times", () => {
      const repositories = [createMockRepository({ name: "repo1" })];
      const { result } = renderHook(() => useRepositorySorting(repositories));

      act(() => {
        result.current.toggleDirection();
      });
      expect(result.current.sorting.direction).toBe("asc");

      act(() => {
        result.current.toggleDirection();
      });
      expect(result.current.sorting.direction).toBe("desc");

      act(() => {
        result.current.toggleDirection();
      });
      expect(result.current.sorting.direction).toBe("asc");
    });

    it("should preserve field when toggling", () => {
      const repositories = [createMockRepository({ name: "repo1" })];
      const { result } = renderHook(() => useRepositorySorting(repositories));

      act(() => {
        result.current.setSortBy("commits");
        result.current.toggleDirection();
      });

      expect(result.current.sorting.field).toBe("commits");
    });
  });

  describe("setSort", () => {
    it("should set both field and direction", () => {
      const repositories = [createMockRepository({ name: "repo1" })];
      const { result } = renderHook(() => useRepositorySorting(repositories));

      act(() => {
        result.current.setSort("name", "asc");
      });

      expect(result.current.sorting).toEqual({
        field: "name",
        direction: "asc",
      });
    });

    it("should set field only if direction not provided", () => {
      const repositories = [createMockRepository({ name: "repo1" })];
      const { result } = renderHook(() => useRepositorySorting(repositories));

      act(() => {
        result.current.setSortDirection("asc");
        result.current.setSort("forks");
      });

      expect(result.current.sorting).toEqual({
        field: "forks",
        direction: "asc", // Preserved from previous call
      });
    });
  });

  describe("resetSort", () => {
    it("should reset to initial default sort", () => {
      const repositories = [createMockRepository({ name: "repo1" })];
      const { result } = renderHook(() => useRepositorySorting(repositories));

      act(() => {
        result.current.setSort("name", "asc");
      });

      expect(result.current.isDefaultSort).toBe(false);

      act(() => {
        result.current.resetSort();
      });

      expect(result.current.sorting).toEqual({
        field: "stars",
        direction: "desc",
      });
      expect(result.current.isDefaultSort).toBe(true);
    });

    it("should reset to custom initial sort", () => {
      const repositories = [createMockRepository({ name: "repo1" })];
      const initialSort = {
        field: "commits" as const,
        direction: "asc" as const,
      };
      const { result } = renderHook(() =>
        useRepositorySorting(repositories, initialSort),
      );

      act(() => {
        result.current.setSort("stars", "desc");
      });

      expect(result.current.isDefaultSort).toBe(false);

      act(() => {
        result.current.resetSort();
      });

      expect(result.current.sorting).toEqual(initialSort);
      expect(result.current.isDefaultSort).toBe(true);
    });
  });

  describe("isDefaultSort", () => {
    it("should be true when using initial sort", () => {
      const repositories = [createMockRepository({ name: "repo1" })];
      const { result } = renderHook(() => useRepositorySorting(repositories));

      expect(result.current.isDefaultSort).toBe(true);
    });

    it("should be false when sort is modified", () => {
      const repositories = [createMockRepository({ name: "repo1" })];
      const { result } = renderHook(() => useRepositorySorting(repositories));

      act(() => {
        result.current.setSortBy("name");
      });

      expect(result.current.isDefaultSort).toBe(false);
    });

    it("should be false when only direction is modified", () => {
      const repositories = [createMockRepository({ name: "repo1" })];
      const { result } = renderHook(() => useRepositorySorting(repositories));

      act(() => {
        result.current.toggleDirection();
      });

      expect(result.current.isDefaultSort).toBe(false);
    });

    it("should be true after reset", () => {
      const repositories = [createMockRepository({ name: "repo1" })];
      const { result } = renderHook(() => useRepositorySorting(repositories));

      act(() => {
        result.current.setSort("name", "asc");
      });

      expect(result.current.isDefaultSort).toBe(false);

      act(() => {
        result.current.resetSort();
      });

      expect(result.current.isDefaultSort).toBe(true);
    });
  });

  describe("Sorting application", () => {
    it("should sort by stars descending", () => {
      const repositories = [
        createMockRepository({ name: "repo1", stargazerCount: 10 }),
        createMockRepository({ name: "repo2", stargazerCount: 50 }),
        createMockRepository({ name: "repo3", stargazerCount: 30 }),
      ];
      const { result } = renderHook(() => useRepositorySorting(repositories));

      expect(result.current.sortedRepositories[0].stargazerCount).toBe(50);
      expect(result.current.sortedRepositories[1].stargazerCount).toBe(30);
      expect(result.current.sortedRepositories[2].stargazerCount).toBe(10);
    });

    it("should sort by stars ascending", () => {
      const repositories = [
        createMockRepository({ name: "repo1", stargazerCount: 50 }),
        createMockRepository({ name: "repo2", stargazerCount: 10 }),
        createMockRepository({ name: "repo3", stargazerCount: 30 }),
      ];
      const { result } = renderHook(() =>
        useRepositorySorting(repositories, {
          field: "stars",
          direction: "asc",
        }),
      );

      expect(result.current.sortedRepositories[0].stargazerCount).toBe(10);
      expect(result.current.sortedRepositories[1].stargazerCount).toBe(30);
      expect(result.current.sortedRepositories[2].stargazerCount).toBe(50);
    });

    it("should sort by forks", () => {
      const repositories = [
        createMockRepository({ name: "repo1", forkCount: 5 }),
        createMockRepository({ name: "repo2", forkCount: 20 }),
        createMockRepository({ name: "repo3", forkCount: 10 }),
      ];
      const { result } = renderHook(() => useRepositorySorting(repositories));

      act(() => {
        result.current.setSortBy("forks");
      });

      expect(result.current.sortedRepositories[0].forkCount).toBe(20);
      expect(result.current.sortedRepositories[1].forkCount).toBe(10);
      expect(result.current.sortedRepositories[2].forkCount).toBe(5);
    });

    it("should sort by commits", () => {
      const repositories = [
        createMockRepository({
          name: "repo1",
          defaultBranchRef: { target: { history: { totalCount: 50 } } },
        }),
        createMockRepository({
          name: "repo2",
          defaultBranchRef: { target: { history: { totalCount: 100 } } },
        }),
        createMockRepository({
          name: "repo3",
          defaultBranchRef: { target: { history: { totalCount: 25 } } },
        }),
      ];
      const { result } = renderHook(() => useRepositorySorting(repositories));

      act(() => {
        result.current.setSortBy("commits");
      });

      expect(
        result.current.sortedRepositories[0].defaultBranchRef?.target?.history
          ?.totalCount,
      ).toBe(100);
      expect(
        result.current.sortedRepositories[1].defaultBranchRef?.target?.history
          ?.totalCount,
      ).toBe(50);
      expect(
        result.current.sortedRepositories[2].defaultBranchRef?.target?.history
          ?.totalCount,
      ).toBe(25);
    });

    it("should sort by name alphabetically", () => {
      const repositories = [
        createMockRepository({ name: "zebra" }),
        createMockRepository({ name: "apple" }),
        createMockRepository({ name: "monkey" }),
      ];
      const { result } = renderHook(() => useRepositorySorting(repositories));

      act(() => {
        result.current.setSort("name", "asc");
      });

      expect(result.current.sortedRepositories[0].name).toBe("apple");
      expect(result.current.sortedRepositories[1].name).toBe("monkey");
      expect(result.current.sortedRepositories[2].name).toBe("zebra");
    });

    it("should sort by updated date", () => {
      const repositories = [
        createMockRepository({
          name: "repo1",
          updatedAt: "2023-01-15T00:00:00Z",
        }),
        createMockRepository({
          name: "repo2",
          updatedAt: "2024-03-20T00:00:00Z",
        }),
        createMockRepository({
          name: "repo3",
          updatedAt: "2023-06-10T00:00:00Z",
        }),
      ];
      const { result } = renderHook(() => useRepositorySorting(repositories));

      act(() => {
        result.current.setSortBy("updated");
      });

      expect(result.current.sortedRepositories[0].name).toBe("repo2"); // Most recent
      expect(result.current.sortedRepositories[1].name).toBe("repo3");
      expect(result.current.sortedRepositories[2].name).toBe("repo1"); // Oldest
    });

    it("should update sorted list when repositories change", () => {
      const repositories1 = [
        createMockRepository({ name: "repo1", stargazerCount: 10 }),
        createMockRepository({ name: "repo2", stargazerCount: 50 }),
      ];

      const repositories2 = [
        createMockRepository({ name: "repo3", stargazerCount: 100 }),
        createMockRepository({ name: "repo4", stargazerCount: 5 }),
      ];

      const { result, rerender } = renderHook(
        ({ repos }) => useRepositorySorting(repos),
        {
          initialProps: { repos: repositories1 },
        },
      );

      expect(result.current.sortedRepositories[0].name).toBe("repo2");

      rerender({ repos: repositories2 });

      expect(result.current.sortedRepositories[0].name).toBe("repo3");
      expect(result.current.sortedRepositories[0].stargazerCount).toBe(100);
    });
  });

  describe("Memoization behavior", () => {
    it("should return same sorted array when sort unchanged", () => {
      const repositories = [createMockRepository({ name: "repo1" })];
      const { result, rerender } = renderHook(() =>
        useRepositorySorting(repositories),
      );

      const firstResult = result.current.sortedRepositories;
      rerender();
      const secondResult = result.current.sortedRepositories;

      expect(firstResult).toBe(secondResult);
    });

    it("should recalculate when sort field changes", () => {
      const repositories = [
        createMockRepository({
          name: "repo1",
          stargazerCount: 10,
          forkCount: 100,
        }),
      ];
      const { result } = renderHook(() => useRepositorySorting(repositories));

      const initialResult = result.current.sortedRepositories;

      act(() => {
        result.current.setSortBy("forks");
      });

      const newResult = result.current.sortedRepositories;

      expect(initialResult).not.toBe(newResult);
    });

    it("should recalculate when sort direction changes", () => {
      const repositories = [
        createMockRepository({ name: "repo1", stargazerCount: 10 }),
        createMockRepository({ name: "repo2", stargazerCount: 50 }),
      ];
      const { result } = renderHook(() => useRepositorySorting(repositories));

      const initialResult = result.current.sortedRepositories;

      act(() => {
        result.current.toggleDirection();
      });

      const newResult = result.current.sortedRepositories;

      expect(initialResult).not.toBe(newResult);
      expect(newResult[0].stargazerCount).toBe(10); // Now ascending
    });
  });

  describe("Edge cases", () => {
    it("should handle empty repository array", () => {
      const { result } = renderHook(() => useRepositorySorting([]));

      expect(result.current.sortedRepositories).toEqual([]);
    });

    it("should handle single repository", () => {
      const repositories = [createMockRepository({ name: "solo" })];
      const { result } = renderHook(() => useRepositorySorting(repositories));

      expect(result.current.sortedRepositories).toHaveLength(1);
      expect(result.current.sortedRepositories[0].name).toBe("solo");
    });

    it("should handle repositories with null values", () => {
      const repositories = [
        createMockRepository({
          name: "null-repo",
          stargazerCount: 0,
          forkCount: 0,
          watchers: { totalCount: 0 },
        }),
      ];
      const { result } = renderHook(() => useRepositorySorting(repositories));

      expect(result.current.sortedRepositories).toHaveLength(1);
    });

    it("should handle repositories with equal values", () => {
      const repositories = [
        createMockRepository({ name: "repo1", stargazerCount: 50 }),
        createMockRepository({ name: "repo2", stargazerCount: 50 }),
        createMockRepository({ name: "repo3", stargazerCount: 50 }),
      ];
      const { result } = renderHook(() => useRepositorySorting(repositories));

      expect(result.current.sortedRepositories).toHaveLength(3);
      // All have same stars, order is preserved
    });
  });
});
