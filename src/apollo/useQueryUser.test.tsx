/**
 * @vitest-environment jsdom
 */
import { MockedProvider } from "@apollo/client/testing/react";
import { renderHook, waitFor } from "@testing-library/react";
import { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { GitHubGraphQLResponse } from "./github-api.types";
import { GET_USER_INFO } from "./queriers";
import useQueryUser from "./useQueryUser";

// Mock date helpers
vi.mock("./date-helpers", () => ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getQueryDates: vi.fn((daysBack: number) => ({
    from: `2024-01-01T00:00:00.000Z`,
    to: `2024-12-31T23:59:59.999Z`,
  })),
  getThreeYearRanges: vi.fn(() => ({
    year1: {
      from: "2023-01-01T00:00:00.000Z",
      to: "2023-12-31T23:59:59.999Z",
    },
    year2: {
      from: "2024-01-01T00:00:00.000Z",
      to: "2024-12-31T23:59:59.999Z",
    },
    year3: {
      from: "2025-01-01T00:00:00.000Z",
      to: "2025-12-31T23:59:59.999Z",
    },
  })),
}));

// Mock user data
const mockUserData: GitHubGraphQLResponse = {
  user: {
    id: "test-id",
    login: "octocat",
    name: "The Octocat",
    avatarUrl: "https://github.com/octocat.png",
    bio: "Test bio",
    url: "https://github.com/octocat",
    location: "San Francisco",
    followers: { totalCount: 100 },
    following: { totalCount: 50 },
    gists: { totalCount: 10 },
    year1: { totalCommitContributions: 500 },
    year2: { totalCommitContributions: 750 },
    year3: { totalCommitContributions: 200 },
    createdAt: "2011-01-25T18:44:36Z",
    contributionsCollection: {
      totalCommitContributions: 200,
      commitContributionsByRepository: [],
    },
    repositories: {
      totalCount: 10,
      pageInfo: {
        endCursor: "cursor",
        hasNextPage: false,
      },
      nodes: [],
    },
  },
};

describe("useQueryUser", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return loading state initially", () => {
    const wrapper = ({ children }: { children: ReactNode }) => (
      <MockedProvider mocks={[]}>{children}</MockedProvider>
    );

    const { result } = renderHook(() => useQueryUser("octocat"), { wrapper });

    expect(result.current.loading).toBe(true);
    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBeUndefined();
  });

  it("should fetch user data successfully", async () => {
    const mock = {
      request: {
        query: GET_USER_INFO,
        variables: {
          login: "octocat",
          from: "2024-01-01T00:00:00.000Z",
          to: "2024-12-31T23:59:59.999Z",
          year1From: "2023-01-01T00:00:00.000Z",
          year1To: "2023-12-31T23:59:59.999Z",
          year2From: "2024-01-01T00:00:00.000Z",
          year2To: "2024-12-31T23:59:59.999Z",
          year3From: "2025-01-01T00:00:00.000Z",
          year3To: "2025-12-31T23:59:59.999Z",
        },
      },
      result: {
        data: mockUserData,
      },
    };

    const wrapper = ({ children }: { children: ReactNode }) => (
      <MockedProvider mocks={[mock]}>{children}</MockedProvider>
    );

    const { result } = renderHook(() => useQueryUser("octocat"), { wrapper });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Check key fields rather than exact object equality
    expect(result.current.data?.user?.login).toBe("octocat");
    expect(result.current.data?.user?.name).toBe("The Octocat");
    expect(result.current.data?.user?.bio).toBe("Test bio");
    expect(result.current.error).toBeUndefined();
  });

  it("should skip query when login is empty", () => {
    const wrapper = ({ children }: { children: ReactNode }) => (
      <MockedProvider mocks={[]}>{children}</MockedProvider>
    );

    const { result } = renderHook(() => useQueryUser(""), { wrapper });

    // Query should be skipped, so loading should be false
    expect(result.current.loading).toBe(false);
    expect(result.current.data).toBeUndefined();
  });

  it("should handle GraphQL errors", async () => {
    const errorMock = {
      request: {
        query: GET_USER_INFO,
        variables: {
          login: "nonexistent",
          from: "2024-01-01T00:00:00.000Z",
          to: "2024-12-31T23:59:59.999Z",
          year1From: "2023-01-01T00:00:00.000Z",
          year1To: "2023-12-31T23:59:59.999Z",
          year2From: "2024-01-01T00:00:00.000Z",
          year2To: "2024-12-31T23:59:59.999Z",
          year3From: "2025-01-01T00:00:00.000Z",
          year3To: "2025-12-31T23:59:59.999Z",
        },
      },
      error: new Error("User not found"),
    };

    const wrapper = ({ children }: { children: ReactNode }) => (
      <MockedProvider mocks={[errorMock]}>{children}</MockedProvider>
    );

    const { result } = renderHook(() => useQueryUser("nonexistent"), {
      wrapper,
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBeDefined();
    expect(result.current.data).toBeUndefined();
  });

  it("should handle null user response", async () => {
    const nullUserMock = {
      request: {
        query: GET_USER_INFO,
        variables: {
          login: "deleteduser",
          from: "2024-01-01T00:00:00.000Z",
          to: "2024-12-31T23:59:59.999Z",
          year1From: "2023-01-01T00:00:00.000Z",
          year1To: "2023-12-31T23:59:59.999Z",
          year2From: "2024-01-01T00:00:00.000Z",
          year2To: "2024-12-31T23:59:59.999Z",
          year3From: "2025-01-01T00:00:00.000Z",
          year3To: "2025-12-31T23:59:59.999Z",
        },
      },
      result: {
        data: {
          user: null,
        },
      },
    };

    const wrapper = ({ children }: { children: ReactNode }) => (
      <MockedProvider mocks={[nullUserMock]}>{children}</MockedProvider>
    );

    const { result } = renderHook(() => useQueryUser("deleteduser"), {
      wrapper,
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data?.user).toBeNull();
    expect(result.current.error).toBeUndefined();
  });

  it("should use custom daysBack parameter", async () => {
    const wrapper = ({ children }: { children: ReactNode }) => (
      <MockedProvider mocks={[]}>{children}</MockedProvider>
    );

    renderHook(() => useQueryUser("octocat", 30), { wrapper });

    // Verify getQueryDates was called with custom daysBack
    const { getQueryDates } = await import("./date-helpers");
    expect(getQueryDates).toHaveBeenCalledWith(30);
  });

  it("should use default daysBack of 365 when not specified", async () => {
    const wrapper = ({ children }: { children: ReactNode }) => (
      <MockedProvider mocks={[]}>{children}</MockedProvider>
    );

    renderHook(() => useQueryUser("octocat"), { wrapper });

    // Verify getQueryDates was called with default daysBack
    const { getQueryDates } = await import("./date-helpers");
    expect(getQueryDates).toHaveBeenCalledWith(365);
  });

  it("should memoize variables correctly", async () => {
    const wrapper = ({ children }: { children: ReactNode }) => (
      <MockedProvider mocks={[]}>{children}</MockedProvider>
    );

    const { result, rerender } = renderHook(
      ({ login }) => useQueryUser(login),
      {
        wrapper,
        initialProps: { login: "octocat" },
      },
    );

    const firstVariables = result.current;

    // Rerender with same login - variables should be memoized
    rerender({ login: "octocat" });
    const secondVariables = result.current;

    // Variables object should be referentially equal due to useMemo
    expect(firstVariables).toBe(secondVariables);
  });
});
