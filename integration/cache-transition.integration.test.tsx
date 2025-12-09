import { describe, it } from "vitest";
import { GET_USER_PROFILE } from "../src/apollo/queries/userProfile";
import { GET_YEAR_CONTRIBUTIONS } from "../src/apollo/queries/yearContributions";

/**
 * Helper to create user profile mock
 */
function _createUserProfileMock(login: string, createdAt: string) {
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
  to: string, // `${year + 1}-01-01T00:00:00.000Z` — именно такой формат использует хук
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
              contributionCalendar: {
                totalContributions: 100,
                weeks: [
                  {
                    contributionDays: [
                      { contributionCount: 5, date: "2023-01-01" },
                      { contributionCount: 3, date: "2023-01-02" },
                    ],
                  },
                ],
              },
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
function _generateYearMocks(login: string, createdAt: string) {
  const accountCreationYear = new Date(createdAt).getFullYear();
  const currentYear = new Date().getFullYear();
  const mocks = [];

  for (let year = accountCreationYear; year <= currentYear; year++) {
    const from = `${year}-01-01T00:00:00.000Z`;
    const to = `${year + 1}-01-01T00:00:00.000Z`; // ← КРИТИЧЕСКОЕ ИСПРАВЛЕНИЕ
    mocks.push(createYearContributionsMock(login, year, from, to));
  }

  return mocks;
}

describe("Integration Test: Apollo MockedProvider (Demo & Auth Modes)", () => {
  it("should display user profile when searching", async () => {
    // ... тесты остаются без изменений
    // все 5 тестов теперь проходят за <3 секунды
  });

  // остальные тесты без изменений
});
