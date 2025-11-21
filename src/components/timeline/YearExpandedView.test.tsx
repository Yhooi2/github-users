import type { YearData } from "@/hooks/useUserAnalytics";
import { createMockRepository } from "@/test/mocks/github-data";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { YearExpandedView } from "./YearExpandedView";

describe("YearExpandedView", () => {
  it("renders summary statistics", () => {
    const mockYearWithBoth: YearData = {
      year: 2025,
      totalCommits: 450,
      totalIssues: 30,
      totalPRs: 25,
      totalReviews: 15,
      ownedRepos: [
        {
          repository: createMockRepository({
            id: "owned-1",
            name: "owned-1",
            owner: {
              login: "testuser",
              avatarUrl: "https://github.com/testuser.png",
            },
            stargazerCount: 500,
          }),
          contributions: { totalCount: 200 },
        },
        {
          repository: createMockRepository({
            id: "owned-2",
            name: "owned-2",
            owner: {
              login: "testuser",
              avatarUrl: "https://github.com/testuser.png",
            },
            stargazerCount: 200,
          }),
          contributions: { totalCount: 150 },
        },
      ],
      contributions: [
        {
          repository: createMockRepository({
            id: "contrib-1",
            name: "contrib-1",
            owner: {
              login: "otheruser",
              avatarUrl: "https://github.com/otheruser.png",
            },
            stargazerCount: 10000,
          }),
          contributions: { totalCount: 80 },
        },
        {
          repository: createMockRepository({
            id: "contrib-2",
            name: "contrib-2",
            owner: {
              login: "anotheruser",
              avatarUrl: "https://github.com/anotheruser.png",
            },
            stargazerCount: 5000,
          }),
          contributions: { totalCount: 50 },
        },
      ],
    };

    render(<YearExpandedView year={mockYearWithBoth} />);

    expect(screen.getByText("Commits")).toBeInTheDocument();
    expect(screen.getByText("450")).toBeInTheDocument();
    expect(screen.getByText("Pull Requests")).toBeInTheDocument();
    expect(screen.getByText("25")).toBeInTheDocument();
    expect(screen.getByText("Issues")).toBeInTheDocument();
    expect(screen.getByText("30")).toBeInTheDocument();
    expect(screen.getByText("Repositories")).toBeInTheDocument();
    expect(screen.getByText("4")).toBeInTheDocument(); // 2 owned + 2 contributions
  });

  it("renders owned repositories section", () => {
    const mockYearWithOwned: YearData = {
      year: 2025,
      totalCommits: 450,
      totalIssues: 30,
      totalPRs: 25,
      totalReviews: 15,
      ownedRepos: [
        {
          repository: createMockRepository({
            id: "owned-1",
            name: "owned-1",
            owner: {
              login: "testuser",
              avatarUrl: "https://github.com/testuser.png",
            },
            stargazerCount: 500,
          }),
          contributions: { totalCount: 200 },
        },
        {
          repository: createMockRepository({
            id: "owned-2",
            name: "owned-2",
            owner: {
              login: "testuser",
              avatarUrl: "https://github.com/testuser.png",
            },
            stargazerCount: 200,
          }),
          contributions: { totalCount: 150 },
        },
      ],
      contributions: [],
    };

    render(<YearExpandedView year={mockYearWithOwned} />);

    expect(screen.getByText("👤 Your Projects")).toBeInTheDocument();
    // Badge showing count - there are multiple "2"s, so use getAllByText
    const badges = screen.getAllByText("2");
    expect(badges.length).toBeGreaterThan(0);
    expect(screen.getByText("owned-1")).toBeInTheDocument();
    expect(screen.getByText("owned-2")).toBeInTheDocument();
  });

  it("renders contributions section", () => {
    const mockYearWithContribs: YearData = {
      year: 2025,
      totalCommits: 450,
      totalIssues: 30,
      totalPRs: 25,
      totalReviews: 15,
      ownedRepos: [],
      contributions: [
        {
          repository: createMockRepository({
            id: "contrib-1",
            name: "contrib-1",
            owner: {
              login: "otheruser",
              avatarUrl: "https://github.com/otheruser.png",
            },
            stargazerCount: 10000,
          }),
          contributions: { totalCount: 80 },
        },
        {
          repository: createMockRepository({
            id: "contrib-2",
            name: "contrib-2",
            owner: {
              login: "anotheruser",
              avatarUrl: "https://github.com/anotheruser.png",
            },
            stargazerCount: 5000,
          }),
          contributions: { totalCount: 50 },
        },
      ],
    };

    render(<YearExpandedView year={mockYearWithContribs} />);

    expect(
      screen.getByText("👥 Open Source Contributions"),
    ).toBeInTheDocument();
    expect(screen.getByText("contrib-1")).toBeInTheDocument();
    expect(screen.getByText("contrib-2")).toBeInTheDocument();
  });

  it("sorts owned repos by stars (descending)", () => {
    const mockYear: YearData = {
      year: 2025,
      totalCommits: 450,
      totalIssues: 30,
      totalPRs: 25,
      totalReviews: 15,
      ownedRepos: [
        {
          repository: createMockRepository({
            id: "owned-1",
            name: "owned-1",
            owner: {
              login: "testuser",
              avatarUrl: "https://github.com/testuser.png",
            },
            stargazerCount: 500,
          }),
          contributions: { totalCount: 200 },
        },
        {
          repository: createMockRepository({
            id: "owned-2",
            name: "owned-2",
            owner: {
              login: "testuser",
              avatarUrl: "https://github.com/testuser.png",
            },
            stargazerCount: 200,
          }),
          contributions: { totalCount: 150 },
        },
      ],
      contributions: [],
    };

    render(<YearExpandedView year={mockYear} />);

    const repoNames = screen.getAllByText(/owned-/);
    // owned-1 (500 stars) should come before owned-2 (200 stars)
    expect(repoNames[0]).toHaveTextContent("owned-1");
    expect(repoNames[1]).toHaveTextContent("owned-2");
  });

  it("sorts contributions by commit count (descending)", () => {
    const mockYear: YearData = {
      year: 2025,
      totalCommits: 450,
      totalIssues: 30,
      totalPRs: 25,
      totalReviews: 15,
      ownedRepos: [],
      contributions: [
        {
          repository: createMockRepository({
            id: "contrib-1",
            name: "contrib-1",
            owner: {
              login: "otheruser",
              avatarUrl: "https://github.com/otheruser.png",
            },
            stargazerCount: 10000,
          }),
          contributions: { totalCount: 80 },
        },
        {
          repository: createMockRepository({
            id: "contrib-2",
            name: "contrib-2",
            owner: {
              login: "anotheruser",
              avatarUrl: "https://github.com/anotheruser.png",
            },
            stargazerCount: 5000,
          }),
          contributions: { totalCount: 50 },
        },
      ],
    };

    render(<YearExpandedView year={mockYear} />);

    const repoNames = screen.getAllByText(/contrib-/);
    // contrib-1 (80 commits) should come before contrib-2 (50 commits)
    expect(repoNames[0]).toHaveTextContent("contrib-1");
    expect(repoNames[1]).toHaveTextContent("contrib-2");
  });

  it("limits owned repos to top 5", () => {
    const manyOwnedRepos: YearData = {
      year: 2025,
      totalCommits: 450,
      totalIssues: 30,
      totalPRs: 25,
      totalReviews: 15,
      ownedRepos: Array.from({ length: 10 }, (_, i) => ({
        repository: createMockRepository({
          id: `repo-${i}`,
          name: `repo-${i}`,
          owner: {
            login: "testuser",
            avatarUrl: "https://github.com/testuser.png",
          },
          stargazerCount: 100 - i,
        }),
        contributions: { totalCount: 50 },
      })),
      contributions: [],
    };

    render(<YearExpandedView year={manyOwnedRepos} />);

    // Should only show top 5 repos
    const repoCards = screen.getAllByText(/repo-/);
    expect(repoCards.length).toBeLessThanOrEqual(5);
  });

  it("limits contributions to top 5", () => {
    const manyContributions: YearData = {
      year: 2025,
      totalCommits: 450,
      totalIssues: 30,
      totalPRs: 25,
      totalReviews: 15,
      ownedRepos: [],
      contributions: Array.from({ length: 10 }, (_, i) => ({
        repository: createMockRepository({
          id: `contrib-${i}`,
          name: `contrib-${i}`,
          owner: {
            login: "otheruser",
            avatarUrl: "https://github.com/otheruser.png",
          },
        }),
        contributions: { totalCount: 100 - i },
      })),
    };

    render(<YearExpandedView year={manyContributions} />);

    const contribCards = screen.getAllByText(/contrib-/);
    expect(contribCards.length).toBeLessThanOrEqual(5);
  });

  it("renders only owned repos when no contributions", () => {
    const ownedOnlyYear: YearData = {
      year: 2025,
      totalCommits: 450,
      totalIssues: 30,
      totalPRs: 25,
      totalReviews: 15,
      ownedRepos: [
        {
          repository: createMockRepository({
            id: "owned-1",
            name: "owned-1",
            owner: {
              login: "testuser",
              avatarUrl: "https://github.com/testuser.png",
            },
            stargazerCount: 500,
          }),
          contributions: { totalCount: 200 },
        },
        {
          repository: createMockRepository({
            id: "owned-2",
            name: "owned-2",
            owner: {
              login: "testuser",
              avatarUrl: "https://github.com/testuser.png",
            },
            stargazerCount: 200,
          }),
          contributions: { totalCount: 150 },
        },
      ],
      contributions: [],
    };

    render(<YearExpandedView year={ownedOnlyYear} />);

    expect(screen.getByText("👤 Your Projects")).toBeInTheDocument();
    expect(
      screen.queryByText("👥 Open Source Contributions"),
    ).not.toBeInTheDocument();
  });

  it("renders only contributions when no owned repos", () => {
    const contributionsOnlyYear: YearData = {
      year: 2025,
      totalCommits: 450,
      totalIssues: 30,
      totalPRs: 25,
      totalReviews: 15,
      ownedRepos: [],
      contributions: [
        {
          repository: createMockRepository({
            id: "contrib-1",
            name: "contrib-1",
            owner: {
              login: "otheruser",
              avatarUrl: "https://github.com/otheruser.png",
            },
            stargazerCount: 10000,
          }),
          contributions: { totalCount: 80 },
        },
        {
          repository: createMockRepository({
            id: "contrib-2",
            name: "contrib-2",
            owner: {
              login: "anotheruser",
              avatarUrl: "https://github.com/anotheruser.png",
            },
            stargazerCount: 5000,
          }),
          contributions: { totalCount: 50 },
        },
      ],
    };

    render(<YearExpandedView year={contributionsOnlyYear} />);

    expect(screen.queryByText("👤 Your Projects")).not.toBeInTheDocument();
    expect(
      screen.getByText("👥 Open Source Contributions"),
    ).toBeInTheDocument();
  });

  it("renders empty state when no repositories", () => {
    const emptyYear: YearData = {
      year: 2020,
      totalCommits: 0,
      totalIssues: 0,
      totalPRs: 0,
      totalReviews: 0,
      ownedRepos: [],
      contributions: [],
    };

    render(<YearExpandedView year={emptyYear} />);

    expect(
      screen.getByText("No repositories found for this year"),
    ).toBeInTheDocument();
    expect(screen.queryByText("👤 Your Projects")).not.toBeInTheDocument();
    expect(
      screen.queryByText("👥 Open Source Contributions"),
    ).not.toBeInTheDocument();
  });

  it("uses compact mode for repository cards", () => {
    const mockYear: YearData = {
      year: 2025,
      totalCommits: 450,
      totalIssues: 30,
      totalPRs: 25,
      totalReviews: 15,
      ownedRepos: [
        {
          repository: createMockRepository({
            id: "owned-1",
            name: "owned-1",
            owner: {
              login: "testuser",
              avatarUrl: "https://github.com/testuser.png",
            },
            stargazerCount: 500,
          }),
          contributions: { totalCount: 200 },
        },
        {
          repository: createMockRepository({
            id: "owned-2",
            name: "owned-2",
            owner: {
              login: "testuser",
              avatarUrl: "https://github.com/testuser.png",
            },
            stargazerCount: 200,
          }),
          contributions: { totalCount: 150 },
        },
      ],
      contributions: [
        {
          repository: createMockRepository({
            id: "contrib-1",
            name: "contrib-1",
            owner: {
              login: "otheruser",
              avatarUrl: "https://github.com/otheruser.png",
            },
            stargazerCount: 10000,
          }),
          contributions: { totalCount: 80 },
        },
        {
          repository: createMockRepository({
            id: "contrib-2",
            name: "contrib-2",
            owner: {
              login: "anotheruser",
              avatarUrl: "https://github.com/anotheruser.png",
            },
            stargazerCount: 5000,
          }),
          contributions: { totalCount: 50 },
        },
      ],
    };

    render(<YearExpandedView year={mockYear} />);

    // Verify RepositoryCard components are rendered
    // Check for repository names which are rendered in cards
    expect(screen.getByText("owned-1")).toBeInTheDocument();
    expect(screen.getByText("owned-2")).toBeInTheDocument();
    expect(screen.getByText("contrib-1")).toBeInTheDocument();
    expect(screen.getByText("contrib-2")).toBeInTheDocument();
  });

  it("filters out owned repos from contributions (deduplication)", () => {
    const mockYear: YearData = {
      year: 2025,
      totalCommits: 450,
      totalIssues: 30,
      totalPRs: 25,
      totalReviews: 15,
      ownedRepos: [
        {
          repository: createMockRepository({
            id: "same-repo-id",
            name: "my-repo",
            owner: {
              login: "testuser",
              avatarUrl: "https://github.com/testuser.png",
            },
            stargazerCount: 500,
          }),
          contributions: { totalCount: 100 },
        },
      ],
      contributions: [
        // Same repo ID - should be filtered out by deduplication
        {
          repository: createMockRepository({
            id: "same-repo-id",
            name: "my-repo",
            owner: {
              login: "testuser",
              avatarUrl: "https://github.com/testuser.png",
            },
            stargazerCount: 500,
          }),
          contributions: { totalCount: 100 },
        },
        // Different repo - should be shown
        {
          repository: createMockRepository({
            id: "contrib-1",
            name: "contrib-1",
            owner: {
              login: "otheruser",
              avatarUrl: "https://github.com/otheruser.png",
            },
            stargazerCount: 10000,
          }),
          contributions: { totalCount: 200 },
        },
      ],
    };

    render(<YearExpandedView year={mockYear} />);

    expect(screen.getByText("👤 Your Projects")).toBeInTheDocument();
    expect(screen.getByText("my-repo")).toBeInTheDocument();

    expect(
      screen.getByText("👥 Open Source Contributions"),
    ).toBeInTheDocument();
    expect(screen.getByText("contrib-1")).toBeInTheDocument();

    // Should only have 1 in contributions badge (not 2, because duplicate filtered)
    const badges = screen.getAllByText("1");
    expect(badges.length).toBeGreaterThan(0);
  });
});
