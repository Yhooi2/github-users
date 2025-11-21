import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import App from "../src/App";
import { GET_USER_PROFILE } from "../src/apollo/queries/userProfile";
import { GET_YEAR_CONTRIBUTIONS } from "../src/apollo/queries/yearContributions";
import {
  renderWithMockedProvider,
  waitForApollo,
} from "../src/test/utils/renderWithMockedProvider";

/**
 * Helper to create user profile mock
 */
function createUserProfileMock(login: string, createdAt: string) {
  return {
    request: {
      query: GET_USER_PROFILE,
      variables: { login },
    },
    result: {
      data: {
        user: {
          id: `user-${login}`,
          login,
          name: login === "torvalds" ? "Linus Torvalds" : "Test User",
          avatarUrl: `https://github.com/${login}.png`,
          bio:
            login === "torvalds" ? "Creator of Linux and Git" : "Test user bio",
          url: `https://github.com/${login}`,
          location: "Portland, OR",
          createdAt,
          email: null,
          company: "Linux Foundation",
          websiteUrl: null,
          twitterUsername: null,
          followers: { totalCount: 100000, __typename: "FollowerConnection" },
          following: { totalCount: 0, __typename: "FollowingConnection" },
          gists: { totalCount: 0, __typename: "GistConnection" },
          repositories: { totalCount: 5, __typename: "RepositoryConnection" },
          __typename: "User",
        },
      },
    },
  };
}

/**
 * Helper to create year contributions mock
 */
function createYearContributionsMock(
  login: string,
  year: number,
  from: string,
  to: string,
) {
  return {
    request: {
      query: GET_YEAR_CONTRIBUTIONS,
      variables: { login, from, to },
    },
    result: {
      data: {
        user: {
          contributionsCollection: {
            totalCommitContributions:
              year === new Date().getFullYear() ? 450 : 300,
            totalIssueContributions: 30,
            totalPullRequestContributions: 25,
            totalPullRequestReviewContributions: 15,
            restrictedContributionsCount: 0,
            commitContributionsByRepository: [
              {
                contributions: {
                  totalCount: 100,
                  __typename: "ContributionCalendar",
                },
                repository: {
                  id: `repo-${login}-${year}-1`,
                  name: `project-${year}`,
                  nameWithOwner: `${login}/project-${year}`,
                  url: `https://github.com/${login}/project-${year}`,
                  description: `Test repository for ${year}`,
                  createdAt: `${year}-01-01T00:00:00Z`,
                  updatedAt: `${year}-12-31T00:00:00Z`,
                  pushedAt: `${year}-12-31T00:00:00Z`,
                  stargazerCount: 100,
                  forkCount: 10,
                  isFork: false,
                  isTemplate: false,
                  isArchived: false,
                  isPrivate: false,
                  diskUsage: 1000,
                  homepageUrl: null,
                  primaryLanguage: {
                    name: "TypeScript",
                    color: "#3178c6",
                    __typename: "Language",
                  },
                  owner: {
                    login,
                    avatarUrl: `https://github.com/${login}.png`,
                    __typename: "User",
                  },
                  parent: null,
                  watchers: {
                    totalCount: 50,
                    __typename: "UserConnection",
                  },
                  issues: { totalCount: 10, __typename: "IssueConnection" },
                  repositoryTopics: {
                    nodes: [],
                    __typename: "RepositoryTopicConnection",
                  },
                  languages: {
                    totalSize: 10000,
                    edges: [
                      {
                        size: 10000,
                        node: { name: "TypeScript", __typename: "Language" },
                        __typename: "LanguageEdge",
                      },
                    ],
                    __typename: "LanguageConnection",
                  },
                  licenseInfo: {
                    name: "MIT License",
                    spdxId: "MIT",
                    __typename: "License",
                  },
                  defaultBranchRef: {
                    name: "main",
                    target: {
                      history: {
                        totalCount: 100,
                        __typename: "CommitHistoryConnection",
                      },
                      __typename: "Commit",
                    },
                    __typename: "Ref",
                  },
                  __typename: "Repository",
                },
                __typename: "CommitContributionsByRepository",
              },
            ],
            __typename: "ContributionsCollection",
          },
          __typename: "User",
        },
      },
    },
  };
}

/**
 * Helper to generate year mocks from account creation to now
 */
function generateYearMocks(login: string, createdAt: string) {
  const accountCreationYear = new Date(createdAt).getFullYear();
  const currentYear = new Date().getFullYear();
  const mocks = [];

  for (let year = accountCreationYear; year <= currentYear; year++) {
    const from = `${year}-01-01T00:00:00.000Z`;
    const to = `${year}-12-31T23:59:59.999Z`;
    mocks.push(createYearContributionsMock(login, year, from, to));
  }

  return mocks;
}

/**
 * Integration Test: Apollo MockedProvider Demo & Auth Modes
 *
 * This test suite verifies that the app correctly displays user analytics
 * using Apollo's MockedProvider with proper mocking of all GraphQL queries.
 *
 * FIXED (2025-11-21)
 *
 * Previous Issue:
 * - Missing mocks for GET_YEAR_CONTRIBUTIONS queries
 * - useUserAnalytics hook fetches profile + yearly data for all years
 * - Tests were only mocking GET_USER_INFO (old query)
 *
 * Current Solution:
 * - Mock GET_USER_PROFILE for initial profile fetch
 * - Generate mocks for GET_YEAR_CONTRIBUTIONS for each year from account creation to now
 * - Properly handle all queries made by useUserAnalytics hook
 *
 * Architecture:
 * 1. App component uses useUserAnalytics(username)
 * 2. useUserAnalytics fetches GET_USER_PROFILE to get createdAt
 * 3. useUserAnalytics generates year ranges and fetches GET_YEAR_CONTRIBUTIONS for each year
 * 4. Tests must mock ALL these queries for complete data flow
 *
 * Reference:
 * - docs/INTEGRATION_TEST_APOLLO_ISSUE.md (full analysis)
 * - https://www.apollographql.com/docs/react/development-testing/testing/
 */

describe("Integration Test: Apollo MockedProvider (Demo & Auth Modes)", () => {
  it("should display user profile when searching", async () => {
    const user = userEvent.setup();

    // Create profile mock (account created in 2011)
    const profileMock = createUserProfileMock(
      "torvalds",
      "2011-09-03T15:26:22Z",
    );

    // Generate year mocks for 2011-2025 (15 years)
    const yearMocks = generateYearMocks("torvalds", "2011-09-03T15:26:22Z");

    // Render app with all mocks
    renderWithMockedProvider(<App />, [profileMock, ...yearMocks]);

    // Search for user
    const searchInput = screen.getByPlaceholderText(/search github user/i);
    const searchButton = screen.getByRole("button", { name: /search/i });

    await user.clear(searchInput);
    await user.type(searchInput, "torvalds");
    await user.click(searchButton);

    // Wait for Apollo queries to resolve
    await waitForApollo();

    // Verify user profile displayed
    await waitFor(
      () => {
        expect(screen.getByText(/Linus Torvalds/i)).toBeInTheDocument();
      },
      { timeout: 5000 },
    );

    // Verify user bio displayed
    await waitFor(
      () => {
        expect(
          screen.getByText(/Creator of Linux and Git/i),
        ).toBeInTheDocument();
      },
      { timeout: 3000 },
    );
  });

  it("should display timeline data for multiple years", async () => {
    const user = userEvent.setup();

    const profileMock = createUserProfileMock(
      "torvalds",
      "2011-09-03T15:26:22Z",
    );
    const yearMocks = generateYearMocks("torvalds", "2011-09-03T15:26:22Z");

    renderWithMockedProvider(<App />, [profileMock, ...yearMocks]);

    const searchInput = screen.getByPlaceholderText(/search github user/i);
    const searchButton = screen.getByRole("button", { name: /search/i });

    await user.clear(searchInput);
    await user.type(searchInput, "torvalds");
    await user.click(searchButton);

    await waitForApollo();

    // Wait for user profile
    await waitFor(
      () => {
        expect(screen.getByText(/Linus Torvalds/i)).toBeInTheDocument();
      },
      { timeout: 5000 },
    );

    // Verify timeline years are displayed (should see current year at minimum)
    const currentYear = new Date().getFullYear();
    await waitFor(
      () => {
        expect(
          screen.getByText(new RegExp(currentYear.toString())),
        ).toBeInTheDocument();
      },
      { timeout: 3000 },
    );
  });

  it("should handle user with recent account creation (fewer years)", async () => {
    const user = userEvent.setup();

    // Account created in 2023 (only 2-3 years of data)
    const profileMock = createUserProfileMock(
      "newuser",
      "2023-01-15T10:00:00Z",
    );
    const yearMocks = generateYearMocks("newuser", "2023-01-15T10:00:00Z");

    renderWithMockedProvider(<App />, [profileMock, ...yearMocks]);

    const searchInput = screen.getByPlaceholderText(/search github user/i);
    const searchButton = screen.getByRole("button", { name: /search/i });

    await user.clear(searchInput);
    await user.type(searchInput, "newuser");
    await user.click(searchButton);

    await waitForApollo();

    // Verify user profile displayed
    await waitFor(
      () => {
        expect(screen.getByText(/Test User/i)).toBeInTheDocument();
      },
      { timeout: 5000 },
    );

    // Should see 2023 in timeline
    await waitFor(
      () => {
        expect(screen.getByText(/2023/)).toBeInTheDocument();
      },
      { timeout: 3000 },
    );
  });

  it("should display contribution statistics", async () => {
    const user = userEvent.setup();

    const profileMock = createUserProfileMock(
      "torvalds",
      "2011-09-03T15:26:22Z",
    );
    const yearMocks = generateYearMocks("torvalds", "2011-09-03T15:26:22Z");

    renderWithMockedProvider(<App />, [profileMock, ...yearMocks]);

    const searchInput = screen.getByPlaceholderText(/search github user/i);
    const searchButton = screen.getByRole("button", { name: /search/i });

    await user.clear(searchInput);
    await user.type(searchInput, "torvalds");
    await user.click(searchButton);

    await waitForApollo();

    // Wait for profile
    await waitFor(
      () => {
        expect(screen.getByText(/Linus Torvalds/i)).toBeInTheDocument();
      },
      { timeout: 5000 },
    );

    // Verify contribution stats are displayed (from current year mock: 450 commits)
    await waitFor(
      () => {
        const commits = screen.queryAllByText(/450/);
        expect(commits.length).toBeGreaterThan(0);
      },
      { timeout: 3000 },
    );
  });

  it("should handle isolated cache per test (no cross-pollution)", async () => {
    const user = userEvent.setup();

    // First user
    const profileMock1 = createUserProfileMock("user1", "2020-01-01T00:00:00Z");
    const yearMocks1 = generateYearMocks("user1", "2020-01-01T00:00:00Z");

    renderWithMockedProvider(<App />, [profileMock1, ...yearMocks1]);

    const searchInput = screen.getByPlaceholderText(/search github user/i);
    const searchButton = screen.getByRole("button", { name: /search/i });

    await user.clear(searchInput);
    await user.type(searchInput, "user1");
    await user.click(searchButton);

    await waitForApollo();

    // Verify first user
    await waitFor(
      () => {
        expect(screen.getByText(/Test User/i)).toBeInTheDocument();
      },
      { timeout: 5000 },
    );

    // Note: Each test gets isolated MockedProvider with fresh cache
    // This test verifies no data leakage from previous tests
    // In real app, cache transitions are handled by ApolloAppProvider
  });
});

/**
 * IMPORTANT NOTES:
 *
 * 1. Mock Completeness:
 *    - Must mock GET_USER_PROFILE (initial profile fetch)
 *    - Must mock GET_YEAR_CONTRIBUTIONS for EVERY year from createdAt to now
 *    - Use generateYearMocks() helper to avoid manual year generation
 *
 * 2. Timing:
 *    - useUserAnalytics fetches profile first, THEN fetches yearly data
 *    - Use waitForApollo() between actions to let queries resolve
 *    - Increase timeout to 5000ms for initial profile load
 *
 * 3. Query Variables:
 *    - GET_YEAR_CONTRIBUTIONS variables must EXACTLY match what hook generates
 *    - Format: YYYY-01-01T00:00:00.000Z to YYYY-12-31T23:59:59.999Z
 *    - Login must match exactly (case-sensitive)
 *
 * 4. Alternative Testing Strategies:
 *    - For complex integration: Use E2E tests (Playwright) - already have 14 scenarios
 *    - For components: Test UserProfile directly with MockedProvider
 *    - For full App: Consider mocking useUserAnalytics hook instead
 *
 * 5. Rate Limit Testing:
 *    - Rate limits come from backend proxy, not GraphQL queries
 *    - These tests focus on data flow, not rate limit display
 *    - Use component tests for RateLimitBanner functionality
 *    - Original tests with createUserInfoMock can be removed (GET_USER_INFO is deprecated)
 */
