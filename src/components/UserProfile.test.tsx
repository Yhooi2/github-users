import { MockedProvider } from "@apollo/client/testing";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import UserProfile from "./UserProfile";

// Mock the useQueryUser hook
vi.mock("@/apollo/useQueryUser", () => ({
  default: vi.fn(),
}));

import useQueryUser from "@/apollo/useQueryUser";

describe("UserProfile", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Clear console.log mocks
    vi.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders loading state", () => {
    vi.mocked(useQueryUser).mockReturnValue({
      data: null,
      loading: true,
      error: undefined,
    });

    render(
      <MockedProvider>
        <UserProfile userName="octocat" />
      </MockedProvider>,
    );

    expect(screen.getByRole("status", { name: "Loading" })).toBeInTheDocument();
  });

  it("renders error state", () => {
    const mockError = {
      message: "Network error",
      name: "NetworkError",
      graphQLErrors: [],
      clientErrors: [],
      networkError: null,
      extraInfo: null,
    };

    vi.mocked(useQueryUser).mockReturnValue({
      data: null,
      loading: false,
      error: mockError,
      refetch: vi.fn(),
    });

    render(
      <MockedProvider>
        <UserProfile userName="octocat" />
      </MockedProvider>,
    );

    expect(screen.getByText(/Network error/i)).toBeInTheDocument();
  });

  it("renders user not found when data is null", () => {
    vi.mocked(useQueryUser).mockReturnValue({
      data: null,
      loading: false,
      error: undefined,
    });

    render(
      <MockedProvider>
        <UserProfile userName="nonexistent" />
      </MockedProvider>,
    );

    expect(screen.getByText(/User Not Found/i)).toBeInTheDocument();
  });

  it("renders user not found when user is null", () => {
    vi.mocked(useQueryUser).mockReturnValue({
      data: { user: null },
      loading: false,
      error: undefined,
    });

    render(
      <MockedProvider>
        <UserProfile userName="nonexistent" />
      </MockedProvider>,
    );

    expect(screen.getByText(/User Not Found/i)).toBeInTheDocument();
  });

  it("renders user name when data is loaded", () => {
    const mockData = {
      user: {
        name: "The Octocat",
        login: "octocat",
        avatarUrl: "https://avatars.githubusercontent.com/u/583231",
        bio: "GitHub mascot",
        location: "San Francisco",
        url: "https://github.com/octocat",
        createdAt: "2011-01-25T18:44:36Z",
        followers: { totalCount: 1000, __typename: "FollowerConnection" },
        following: { totalCount: 100, __typename: "FollowingConnection" },
        gists: { totalCount: 8, __typename: "GistConnection" },
        repositories: {
          totalCount: 50,
          nodes: [],
          __typename: "RepositoryConnection",
        },
        year1: {
          totalCommitContributions: 500,
          __typename: "ContributionsCollection",
        },
        year2: {
          totalCommitContributions: 750,
          __typename: "ContributionsCollection",
        },
        year3: {
          totalCommitContributions: 200,
          __typename: "ContributionsCollection",
        },
        contributionsCollection: {
          commitContributionsByRepository: [
            {
              repository: { name: "Hello-World", __typename: "Repository" },
              contributions: {
                totalCount: 150,
                __typename: "CreatedCommitContributionConnection",
              },
              __typename: "CommitContributionsByRepository",
            },
            {
              repository: { name: "Spoon-Knife", __typename: "Repository" },
              contributions: {
                totalCount: 92,
                __typename: "CreatedCommitContributionConnection",
              },
              __typename: "CommitContributionsByRepository",
            },
          ],
          __typename: "ContributionsCollection",
        },
      },
    };

    vi.mocked(useQueryUser).mockReturnValue({
      data: mockData,
      loading: false,
      error: undefined,
    });

    render(
      <MockedProvider>
        <UserProfile userName="octocat" />
      </MockedProvider>,
    );

    expect(screen.getByText("The Octocat")).toBeInTheDocument();
    expect(screen.getByText("@octocat")).toBeInTheDocument();
    expect(screen.getByText("GitHub mascot")).toBeInTheDocument();
    expect(screen.getByText("1,000")).toBeInTheDocument(); // Followers
    expect(screen.getByText("50")).toBeInTheDocument(); // Repositories
  });

  it("calls useQueryUser with correct username", () => {
    vi.mocked(useQueryUser).mockReturnValue({
      data: null,
      loading: true,
      error: undefined,
    });

    render(
      <MockedProvider>
        <UserProfile userName="specificuser" />
      </MockedProvider>,
    );

    expect(useQueryUser).toHaveBeenCalledWith("specificuser", 365, {
      onRateLimitUpdate: undefined,
    });
  });

  it("passes onRateLimitUpdate callback to useQueryUser", () => {
    const mockCallback = vi.fn();

    vi.mocked(useQueryUser).mockReturnValue({
      data: null,
      loading: true,
      error: undefined,
    });

    render(
      <MockedProvider>
        <UserProfile userName="octocat" onRateLimitUpdate={mockCallback} />
      </MockedProvider>,
    );

    expect(useQueryUser).toHaveBeenCalledWith("octocat", 365, {
      onRateLimitUpdate: mockCallback,
    });
  });
});
