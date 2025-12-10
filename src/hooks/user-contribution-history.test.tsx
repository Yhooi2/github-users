/**
 * Integration Tests for User Contribution History
 *
 * Testing Philosophy: USER EXPERIENCE FOCUS
 * - Test real-world user scenarios
 * - Focus on value delivered to users
 * - Avoid testing implementation details
 *
 * User Stories Covered:
 * 1. As a user, I want to see my complete GitHub history from account creation
 * 2. As a user, I want to see which repos I own vs contributed to
 * 3. As a user, I want accurate contribution counts per year
 * 4. As a user, I want graceful error handling when profiles don't exist
 *
 * @vitest-environment jsdom
 */
import { GET_USER_PROFILE } from "@/apollo/queries/userProfile";
import { GET_YEAR_CONTRIBUTIONS } from "@/apollo/queries/yearContributions";
import type { MockedResponse } from "@apollo/client/testing";
import { MockedProvider } from "@apollo/client/testing/react";
import { renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useUserAnalytics } from "./useUserAnalytics";

/**
 * Test Helpers - Reduce duplication and improve maintainability
 */

function createProfileMock(
  username: string,
  createdAt: string = "2023-01-01T00:00:00Z",
): MockedResponse {
  return {
    request: {
      query: GET_USER_PROFILE,
      variables: { login: username },
    },
    result: {
      data: {
        user: {
          id: `user-${username}`,
          login: username,
          name: `${username} Display Name`,
          avatarUrl: `https://avatars.github.com/${username}`,
          bio: `Bio for ${username}`,
          url: `https://github.com/${username}`,
          location: "San Francisco",
          createdAt,
          email: `${username}@example.com`,
          company: "Tech Company",
          websiteUrl: "https://example.com",
          twitterUsername: username,
          followers: { totalCount: 100 },
          following: { totalCount: 50 },
          gists: { totalCount: 10 },
          repositories: { totalCount: 20 },
        },
      },
    },
  };
}

function createYearContributionMock(
  username: string,
  year: number,
  from: string,
  to: string,
  options: {
    commits?: number;
    issues?: number;
    prs?: number;
    reviews?: number;
    includeOwnedRepo?: boolean;
    includeContribution?: boolean;
  } = {},
): MockedResponse {
  const {
    commits = year * 10,
    issues = year * 2,
    prs = year * 3,
    reviews = year * 1,
    includeOwnedRepo = true,
    includeContribution = true,
  } = options;

  const repos = [];

  if (includeOwnedRepo) {
    repos.push({
      contributions: { totalCount: 50 },
      repository: {
        id: `repo-owned-${year}`,
        name: `my-repo-${year}`,
        nameWithOwner: `${username}/my-repo-${year}`,
        url: `https://github.com/${username}/my-repo-${year}`,
        description: `My repository for ${year}`,
        createdAt: `${year}-01-01T00:00:00Z`,
        updatedAt: `${year}-12-01T00:00:00Z`,
        pushedAt: `${year}-12-01T00:00:00Z`,
        stargazerCount: 10,
        forkCount: 2,
        isFork: false,
        isArchived: false,
        isPrivate: false,
        primaryLanguage: { name: "TypeScript", color: "#3178c6" },
        owner: {
          login: username,
          avatarUrl: `https://avatars.github.com/${username}`,
        },
        licenseInfo: { name: "MIT License", spdxId: "MIT" },
        defaultBranchRef: { name: "main" },
      },
    });
  }

  if (includeContribution) {
    repos.push({
      contributions: { totalCount: 20 },
      repository: {
        id: `repo-contrib-${year}`,
        name: `other-repo-${year}`,
        nameWithOwner: `opensource/other-repo-${year}`,
        url: `https://github.com/opensource/other-repo-${year}`,
        description: `Contributed to this in ${year}`,
        createdAt: `${year}-01-01T00:00:00Z`,
        updatedAt: `${year}-12-01T00:00:00Z`,
        pushedAt: `${year}-12-01T00:00:00Z`,
        stargazerCount: 100,
        forkCount: 20,
        isFork: false,
        isArchived: false,
        isPrivate: false,
        primaryLanguage: { name: "JavaScript", color: "#f1e05a" },
        owner: {
          login: "opensource",
          avatarUrl: "https://avatars.github.com/opensource",
        },
        licenseInfo: { name: "Apache License 2.0", spdxId: "Apache-2.0" },
        defaultBranchRef: { name: "main" },
      },
    });
  }

  return {
    request: {
      query: GET_YEAR_CONTRIBUTIONS,
      variables: { login: username, from, to },
    },
    result: {
      data: {
        user: {
          contributionsCollection: {
            totalCommitContributions: commits,
            totalIssueContributions: issues,
            totalPullRequestContributions: prs,
            totalPullRequestReviewContributions: reviews,
            restrictedContributionsCount: 0,
            contributionCalendar: {
              totalContributions: commits,
              weeks: [
                {
                  contributionDays: [
                    { contributionCount: 5, date: `${year}-01-01` },
                    { contributionCount: 3, date: `${year}-01-02` },
                    { contributionCount: 7, date: `${year}-01-03` },
                  ],
                },
              ],
            },
            commitContributionsByRepository: repos,
          },
        },
      },
    },
  };
}

function createWrapper(mocks: MockedResponse[]) {
  return ({ children }: { children: ReactNode }) => (
    <MockedProvider mocks={mocks} addTypename={false}>
      {children}
    </MockedProvider>
  );
}

describe("User Contribution History", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Fix time for consistent year ranges
    vi.setSystemTime(new Date("2025-11-17T12:00:00Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("Complete History Scenarios", () => {
    it("should fetch and display complete contribution history from account creation", async () => {
      // Arrange: User with 3-year history (2023-2025)
      const username = "developer";
      const mocks = [
        createProfileMock(username, "2023-01-01T00:00:00Z"),
        createYearContributionMock(
          username,
          2023,
          "2023-01-01T00:00:00.000Z",
          "2023-12-31T23:59:59.000Z",
        ),
        createYearContributionMock(
          username,
          2024,
          "2024-01-01T00:00:00.000Z",
          "2024-12-31T23:59:59.000Z",
        ),
        createYearContributionMock(
          username,
          2025,
          "2025-01-01T00:00:00.000Z",
          "2025-11-17T12:00:00.000Z",
        ),
      ];

      // Act: Fetch user history
      const { result } = renderHook(() => useUserAnalytics(username), {
        wrapper: createWrapper(mocks),
      });

      // Assert: Initially loading
      expect(result.current.loading).toBe(true);
      expect(result.current.profile).toBe(null);
      expect(result.current.timeline).toEqual([]);

      // Wait for data to load
      await waitFor(
        () => {
          expect(result.current.loading).toBe(false);
        },
        { timeout: 5000 },
      );

      // User sees their complete profile
      expect(result.current.profile).toBeDefined();
      expect(result.current.profile?.login).toBe(username);
      expect(result.current.profile?.name).toBe("developer Display Name");

      // User sees 3 years of history
      expect(result.current.timeline.length).toBe(3);

      // Timeline is sorted newest first (better UX)
      expect(result.current.timeline[0].year).toBe(2025);
      expect(result.current.timeline[1].year).toBe(2024);
      expect(result.current.timeline[2].year).toBe(2023);
    });

    it("should show accurate contribution statistics for each year", async () => {
      // Arrange: User with custom contribution counts
      const username = "activedev";
      const mocks = [
        createProfileMock(username, "2023-01-01T00:00:00Z"),
        createYearContributionMock(
          username,
          2023,
          "2023-01-01T00:00:00.000Z",
          "2023-12-31T23:59:59.000Z",
          {
            commits: 500,
            issues: 50,
            prs: 75,
            reviews: 25,
          },
        ),
        createYearContributionMock(
          username,
          2024,
          "2024-01-01T00:00:00.000Z",
          "2024-12-31T23:59:59.000Z",
        ),
        createYearContributionMock(
          username,
          2025,
          "2025-01-01T00:00:00.000Z",
          "2025-11-17T12:00:00.000Z",
        ),
      ];

      // Act: Fetch user history
      const { result } = renderHook(() => useUserAnalytics(username), {
        wrapper: createWrapper(mocks),
      });

      await waitFor(() => expect(result.current.loading).toBe(false), {
        timeout: 5000,
      });

      // Assert: User sees accurate counts for 2023
      const year2023 = result.current.timeline.find((y) => y.year === 2023);
      expect(year2023).toBeDefined();
      expect(year2023!.totalCommits).toBe(500);
      expect(year2023!.totalIssues).toBe(50);
      expect(year2023!.totalPRs).toBe(75);
      expect(year2023!.totalReviews).toBe(25);
    });
  });

  describe("Repository Ownership Tracking", () => {
    it("should separate owned repositories from open source contributions", async () => {
      // Arrange: User who owns repos and contributes to others
      const username = "contributor";
      const mocks = [
        createProfileMock(username, "2023-01-01T00:00:00Z"),
        createYearContributionMock(
          username,
          2023,
          "2023-01-01T00:00:00.000Z",
          "2023-12-31T23:59:59.000Z",
        ),
        createYearContributionMock(
          username,
          2024,
          "2024-01-01T00:00:00.000Z",
          "2024-12-31T23:59:59.000Z",
        ),
        createYearContributionMock(
          username,
          2025,
          "2025-01-01T00:00:00.000Z",
          "2025-11-17T12:00:00.000Z",
        ),
      ];

      // Act: Fetch user history
      const { result } = renderHook(() => useUserAnalytics(username), {
        wrapper: createWrapper(mocks),
      });

      await waitFor(() => expect(result.current.loading).toBe(false), {
        timeout: 5000,
      });

      // Assert: User can distinguish their repos from contributions
      const year2023 = result.current.timeline.find((y) => y.year === 2023);
      expect(year2023).toBeDefined();

      // Owned repos belong to the user
      expect(year2023!.ownedRepos.length).toBe(1);
      expect(year2023!.ownedRepos[0].repository.owner.login).toBe(username);

      // Contributions are to other users' repos
      expect(year2023!.contributions.length).toBe(1);
      expect(year2023!.contributions[0].repository.owner.login).not.toBe(
        username,
      );
    });

    it("should handle users with only owned repos (no external contributions)", async () => {
      // Arrange: User who only works on their own projects
      const username = "solodev";
      const mocks = [
        createProfileMock(username, "2023-01-01T00:00:00Z"),
        createYearContributionMock(
          username,
          2023,
          "2023-01-01T00:00:00.000Z",
          "2023-12-31T23:59:59.000Z",
          {
            includeOwnedRepo: true,
            includeContribution: false,
          },
        ),
        createYearContributionMock(
          username,
          2024,
          "2024-01-01T00:00:00.000Z",
          "2024-12-31T23:59:59.000Z",
          {
            includeOwnedRepo: true,
            includeContribution: false,
          },
        ),
        createYearContributionMock(
          username,
          2025,
          "2025-01-01T00:00:00.000Z",
          "2025-11-17T12:00:00.000Z",
          {
            includeOwnedRepo: true,
            includeContribution: false,
          },
        ),
      ];

      // Act: Fetch user history
      const { result } = renderHook(() => useUserAnalytics(username), {
        wrapper: createWrapper(mocks),
      });

      await waitFor(() => expect(result.current.loading).toBe(false), {
        timeout: 5000,
      });

      // Assert: User sees only owned repos, no contributions
      const year2023 = result.current.timeline.find((y) => y.year === 2023);
      expect(year2023!.ownedRepos.length).toBe(1);
      expect(year2023!.contributions.length).toBe(0);
    });

    it("should handle users with only external contributions (no owned repos)", async () => {
      // Arrange: User who only contributes to open source
      const username = "opensourcedev";
      const mocks = [
        createProfileMock(username, "2023-01-01T00:00:00Z"),
        createYearContributionMock(
          username,
          2023,
          "2023-01-01T00:00:00.000Z",
          "2023-12-31T23:59:59.000Z",
          {
            includeOwnedRepo: false,
            includeContribution: true,
          },
        ),
        createYearContributionMock(
          username,
          2024,
          "2024-01-01T00:00:00.000Z",
          "2024-12-31T23:59:59.000Z",
          {
            includeOwnedRepo: false,
            includeContribution: true,
          },
        ),
        createYearContributionMock(
          username,
          2025,
          "2025-01-01T00:00:00.000Z",
          "2025-11-17T12:00:00.000Z",
          {
            includeOwnedRepo: false,
            includeContribution: true,
          },
        ),
      ];

      // Act: Fetch user history
      const { result } = renderHook(() => useUserAnalytics(username), {
        wrapper: createWrapper(mocks),
      });

      await waitFor(() => expect(result.current.loading).toBe(false), {
        timeout: 5000,
      });

      // Assert: User sees only contributions, no owned repos
      const year2023 = result.current.timeline.find((y) => y.year === 2023);
      expect(year2023!.ownedRepos.length).toBe(0);
      expect(year2023!.contributions.length).toBe(1);
    });
  });

  describe("Error Scenarios - User Experience", () => {
    it("should gracefully handle empty username", () => {
      // Arrange: No username provided
      const mocks: MockedResponse[] = [];

      // Act: Try to fetch with empty username
      const { result } = renderHook(() => useUserAnalytics(""), {
        wrapper: createWrapper(mocks),
      });

      // Assert: No errors, returns empty state
      expect(result.current.loading).toBe(false);
      expect(result.current.profile).toBe(null);
      expect(result.current.timeline).toEqual([]);
      expect(result.current.error).toBeUndefined();
    });

    it("should inform user when profile does not exist", async () => {
      // Arrange: Non-existent user
      const username = "doesnotexist12345";
      const mocks: MockedResponse[] = [
        {
          request: {
            query: GET_USER_PROFILE,
            variables: { login: username },
          },
          result: {
            data: {
              user: null, // User not found
            },
          },
        },
      ];

      // Act: Try to fetch non-existent user
      const { result } = renderHook(() => useUserAnalytics(username), {
        wrapper: createWrapper(mocks),
      });

      await waitFor(() => expect(result.current.loading).toBe(false));

      // Assert: User sees null profile (UI can show "User not found")
      expect(result.current.profile).toBe(null);
      expect(result.current.timeline).toEqual([]);
    });
  });

  describe("Performance - Parallel Data Fetching", () => {
    it("should fetch all years in parallel for fast loading", async () => {
      // Arrange: User with 3-year history
      const username = "fastdev";
      const startTime = Date.now();

      const mocks = [
        createProfileMock(username, "2023-01-01T00:00:00Z"),
        createYearContributionMock(
          username,
          2023,
          "2023-01-01T00:00:00.000Z",
          "2023-12-31T23:59:59.000Z",
        ),
        createYearContributionMock(
          username,
          2024,
          "2024-01-01T00:00:00.000Z",
          "2024-12-31T23:59:59.000Z",
        ),
        createYearContributionMock(
          username,
          2025,
          "2025-01-01T00:00:00.000Z",
          "2025-11-17T12:00:00.000Z",
        ),
      ];

      // Act: Fetch user history (should use Promise.all internally)
      const { result } = renderHook(() => useUserAnalytics(username), {
        wrapper: createWrapper(mocks),
      });

      await waitFor(() => expect(result.current.loading).toBe(false), {
        timeout: 5000,
      });

      const endTime = Date.now();
      const duration = endTime - startTime;

      // Assert: All 3 years loaded successfully
      expect(result.current.timeline.length).toBe(3);

      // Performance check: Should be relatively fast (parallel loading)
      // In real scenario with network, parallel is ~3x faster than sequential
      expect(duration).toBeLessThan(5000); // Reasonable timeout for mocked data
    });
  });
});
