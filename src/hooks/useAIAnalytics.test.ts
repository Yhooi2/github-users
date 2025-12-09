/**
 * Tests for useAIAnalytics hook
 */

import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useAIAnalytics } from "./useAIAnalytics";

describe("useAIAnalytics", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("initialization", () => {
    it("should initialize with loading false", () => {
      const { result } = renderHook(() =>
        useAIAnalytics({ username: "testuser" }),
      );

      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
      expect(result.current.summary).toBeNull();
      expect(result.current.recommendations).toEqual([]);
    });

    it("should include metadata in initial state", () => {
      const { result } = renderHook(() =>
        useAIAnalytics({ username: "testuser" }),
      );

      expect(result.current.metadata).toHaveProperty("version");
      expect(result.current.metadata).toHaveProperty("model");
      expect(result.current.metadata.model).toBe("claude-3-5-sonnet-20241022");
    });

    it("should provide control functions", () => {
      const { result } = renderHook(() =>
        useAIAnalytics({ username: "testuser" }),
      );

      expect(typeof result.current.analyze).toBe("function");
      expect(typeof result.current.refresh).toBe("function");
      expect(typeof result.current.clear).toBe("function");
    });
  });

  describe("analyze function", () => {
    it("should set loading true during analysis", async () => {
      const { result } = renderHook(() =>
        useAIAnalytics({ username: "testuser", useMockData: true }),
      );

      // Start analysis and check loading state
      result.current.analyze();

      await waitFor(() => {
        expect(result.current.loading).toBe(true);
      });
    });

    it("should generate mock analysis data", async () => {
      const { result } = renderHook(() =>
        useAIAnalytics({ username: "testuser", useMockData: true }),
      );

      await result.current.analyze();

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
        expect(result.current.summary).not.toBeNull();
        expect(result.current.recommendations.length).toBeGreaterThan(0);
      });
    });

    it("should include username in mock summary", async () => {
      const username = "octocat";
      const { result } = renderHook(() =>
        useAIAnalytics({ username, useMockData: true }),
      );

      await result.current.analyze();

      await waitFor(() => {
        expect(result.current.summary?.summary).toContain(username);
      });
    });

    it("should generate valid archetype data", async () => {
      const { result } = renderHook(() =>
        useAIAnalytics({ username: "testuser", useMockData: true }),
      );

      await result.current.analyze();

      await waitFor(() => {
        const archetype = result.current.summary?.archetype;
        expect(archetype).toBeDefined();
        expect(archetype?.primary).toBeDefined();
        expect(archetype?.confidence).toBeGreaterThanOrEqual(0);
        expect(archetype?.confidence).toBeLessThanOrEqual(100);
        expect(archetype?.strengths).toBeInstanceOf(Array);
        expect(archetype?.growthAreas).toBeInstanceOf(Array);
      });
    });

    it("should generate insights with required fields", async () => {
      const { result } = renderHook(() =>
        useAIAnalytics({ username: "testuser", useMockData: true }),
      );

      await result.current.analyze();

      await waitFor(() => {
        const insights = result.current.summary?.insights;
        expect(insights).toBeInstanceOf(Array);
        expect(insights!.length).toBeGreaterThan(0);

        insights?.forEach((insight) => {
          expect(insight).toHaveProperty("id");
          expect(insight).toHaveProperty("category");
          expect(insight).toHaveProperty("priority");
          expect(insight).toHaveProperty("title");
          expect(insight).toHaveProperty("description");
        });
      });
    });

    it("should generate recommendations with required fields", async () => {
      const { result } = renderHook(() =>
        useAIAnalytics({ username: "testuser", useMockData: true }),
      );

      await result.current.analyze();

      await waitFor(() => {
        const recommendations = result.current.recommendations;
        expect(recommendations.length).toBeGreaterThan(0);

        recommendations.forEach((rec) => {
          expect(rec).toHaveProperty("id");
          expect(rec).toHaveProperty("title");
          expect(rec).toHaveProperty("description");
          expect(rec).toHaveProperty("targetMetric");
          expect(rec).toHaveProperty("expectedImpact");
          expect(rec).toHaveProperty("effort");
          expect(rec).toHaveProperty("steps");
          expect(rec.steps).toBeInstanceOf(Array);
        });
      });
    });

    it("should throw error when useMockData is false", async () => {
      const { result } = renderHook(() =>
        useAIAnalytics({ username: "testuser", useMockData: false }),
      );

      await result.current.analyze();

      await waitFor(() => {
        expect(result.current.error).not.toBeNull();
        expect(result.current.error?.message).toContain("not implemented");
      });
    });
  });

  describe("refresh function", () => {
    it("should regenerate analysis data", async () => {
      const { result } = renderHook(() =>
        useAIAnalytics({ username: "testuser", useMockData: true }),
      );

      await result.current.analyze();

      await result.current.refresh();

      await waitFor(() => {
        expect(result.current.summary).not.toBeNull();
        // Summary should exist (may be same or different due to timestamp)
        expect(result.current.summary?.analyzedAt).toBeDefined();
      });
    });
  });

  describe("clear function", () => {
    it("should reset all analysis data", async () => {
      const { result } = renderHook(() =>
        useAIAnalytics({ username: "testuser", useMockData: true }),
      );

      await result.current.analyze();

      await waitFor(() => {
        expect(result.current.summary).not.toBeNull();
      });

      act(() => {
        result.current.clear();
      });

      expect(result.current.summary).toBeNull();
      expect(result.current.recommendations).toEqual([]);
      expect(result.current.error).toBeNull();
    });

    it("should not affect loading state", async () => {
      const { result } = renderHook(() =>
        useAIAnalytics({ username: "testuser", useMockData: true }),
      );

      await result.current.analyze();

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      act(() => {
        result.current.clear();
      });

      expect(result.current.loading).toBe(false);
    });
  });

  describe("edge cases", () => {
    it("should handle empty username gracefully", async () => {
      const { result } = renderHook(() =>
        useAIAnalytics({ username: "", useMockData: true }),
      );

      await result.current.analyze();

      await waitFor(() => {
        expect(result.current.summary).not.toBeNull();
      });
    });

    it("should maintain stable metadata reference", () => {
      const { result, rerender } = renderHook(
        ({ username }) => useAIAnalytics({ username, useMockData: true }),
        {
          initialProps: { username: "user1" },
        },
      );

      const firstMetadata = result.current.metadata;

      rerender({ username: "user2" });

      expect(result.current.metadata).toBe(firstMetadata);
    });
  });
});
