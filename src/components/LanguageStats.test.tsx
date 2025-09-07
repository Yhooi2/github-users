import { render, screen } from "@testing-library/react";
import { LanguageStats } from "./LanguageStats";
import { type GitHubUser } from "@/apollo/github-api.types";

// Mock data for testing
const mockUser: GitHubUser = {
  id: "1",
  login: "testuser",
  name: "Test User",
  avatarUrl: "https://example.com/avatar.jpg",
  bio: "Test bio",
  url: "https://github.com/testuser",
  location: "Test Location",
  createdAt: "2020-01-01T00:00:00Z",
  followers: { totalCount: 100 },
  following: { totalCount: 50 },
  gists: { totalCount: 10 },
  repositories: {
    totalCount: 5,
    nodes: [
      {
        id: "1",
        name: "repo1",
        description: "Test repo 1",
        isFork: false,
        forkCount: 5,
        stargazerCount: 10,
        url: "https://github.com/testuser/repo1",
        primaryLanguage: { name: "JavaScript" },
        languages: {
          totalSize: 10000,
          edges: [
            { size: 8000, node: { name: "JavaScript" } },
            { size: 2000, node: { name: "HTML" } },
          ],
        },
      },
      {
        id: "2",
        name: "repo2",
        description: "Test repo 2",
        isFork: true,
        forkCount: 2,
        stargazerCount: 5,
        url: "https://github.com/testuser/repo2",
        primaryLanguage: { name: "TypeScript" },
        languages: {
          totalSize: 15000,
          edges: [
            { size: 12000, node: { name: "TypeScript" } },
            { size: 3000, node: { name: "CSS" } },
          ],
        },
      },
      {
        id: "3",
        name: "repo3",
        description: "Test repo 3",
        isFork: false,
        forkCount: 0,
        stargazerCount: 20,
        url: "https://github.com/testuser/repo3",
        primaryLanguage: { name: "Python" },
        languages: {
          totalSize: 20000,
          edges: [
            { size: 15000, node: { name: "Python" } },
            { size: 5000, node: { name: "JavaScript" } },
          ],
        },
      },
    ],
  },
  contributionsCollection: {
    totalCommitContributions: 100,
    commitContributionsByRepository: [
      {
        contributions: { totalCount: 50 },
        repository: { name: "repo1" },
      },
      {
        contributions: { totalCount: 30 },
        repository: { name: "repo2" },
      },
      {
        contributions: { totalCount: 20 },
        repository: { name: "repo3" },
      },
    ],
  },
  contrib2020: {
    totalCommitContributions: 100,
    commitContributionsByRepository: [
      {
        contributions: { totalCount: 50 },
        repository: { name: "repo1" },
      },
      {
        contributions: { totalCount: 30 },
        repository: { name: "repo2" },
      },
      {
        contributions: { totalCount: 20 },
        repository: { name: "repo3" },
      },
    ],
  },
};

describe("LanguageStats", () => {
  it("renders correctly with language statistics", () => {
    render(<LanguageStats user={mockUser} />);
    
    // Check that the component renders
    expect(screen.getByText("Programming Languages")).toBeInTheDocument();
    
    // Check that languages are displayed
    expect(screen.getByText("JavaScript")).toBeInTheDocument();
    expect(screen.getByText("TypeScript")).toBeInTheDocument();
    expect(screen.getByText("Python")).toBeInTheDocument();
    expect(screen.getByText("HTML")).toBeInTheDocument();
    expect(screen.getByText("CSS")).toBeInTheDocument();
  });

  it("filters out forked repositories without user contributions", () => {
    // Create a user with a forked repository that has no contributions
    const userWithFilteredFork: GitHubUser = {
      ...mockUser,
      repositories: {
        totalCount: 6,
        nodes: [
          ...(mockUser.repositories.nodes || []),
          {
            id: "4",
            name: "forked-repo",
            description: "Forked repo with no contributions",
            isFork: true,
            forkCount: 1,
            stargazerCount: 0,
            url: "https://github.com/testuser/forked-repo",
            primaryLanguage: { name: "Java" },
            languages: {
              totalSize: 5000,
              edges: [
                { size: 5000, node: { name: "Java" } },
              ],
            },
          },
        ],
      },
      contributionsCollection: {
        ...mockUser.contributionsCollection,
        commitContributionsByRepository: [
          ...mockUser.contributionsCollection.commitContributionsByRepository,
          // Note: No contributions to "forked-repo"
        ],
      },
      contrib2020: {
        ...mockUser.contrib2020,
        commitContributionsByRepository: [
          ...mockUser.contrib2020.commitContributionsByRepository,
          // Note: No contributions to "forked-repo"
        ],
      },
    };

    render(<LanguageStats user={userWithFilteredFork} />);
    
    // The forked repo with no contributions should not appear in the language stats
    expect(screen.queryByText("Java")).not.toBeInTheDocument();
    
    // Other languages should still be present
    expect(screen.getByText("JavaScript")).toBeInTheDocument();
    expect(screen.getByText("TypeScript")).toBeInTheDocument();
    expect(screen.getByText("Python")).toBeInTheDocument();
  });

  it("includes forked repositories with user contributions", () => {
    // Create a user with a forked repository that has contributions
    const userWithContributedFork: GitHubUser = {
      ...mockUser,
      repositories: {
        totalCount: 6,
        nodes: [
          ...(mockUser.repositories.nodes || []),
          {
            id: "4",
            name: "contributed-fork",
            description: "Forked repo with contributions",
            isFork: true,
            forkCount: 1,
            stargazerCount: 0,
            url: "https://github.com/testuser/contributed-fork",
            primaryLanguage: { name: "Go" },
            languages: {
              totalSize: 8000,
              edges: [
                { size: 8000, node: { name: "Go" } },
              ],
            },
          },
        ],
      },
      contributionsCollection: {
        ...mockUser.contributionsCollection,
        commitContributionsByRepository: [
          ...mockUser.contributionsCollection.commitContributionsByRepository,
          {
            contributions: { totalCount: 15 },
            repository: { name: "contributed-fork" },
          },
        ],
      },
      contrib2020: {
        ...mockUser.contrib2020,
        commitContributionsByRepository: [
          ...mockUser.contrib2020.commitContributionsByRepository,
          {
            contributions: { totalCount: 15 },
            repository: { name: "contributed-fork" },
          },
        ],
      },
    };

    render(<LanguageStats user={userWithContributedFork} />);
    
    // The forked repo with contributions should appear in the language stats
    expect(screen.getByText("Go")).toBeInTheDocument();
    
    // Other languages should still be present
    expect(screen.getByText("JavaScript")).toBeInTheDocument();
    expect(screen.getByText("TypeScript")).toBeInTheDocument();
    expect(screen.getByText("Python")).toBeInTheDocument();
  });

  it("shows correct language statistics", () => {
    render(<LanguageStats user={mockUser} />);
    
    // Check specific language stats
    const jsElements = screen.getAllByText("JavaScript");
    expect(jsElements.length).toBeGreaterThan(0);
    
    // Check that total code size is displayed
    expect(screen.getByText(/Total code size:/i)).toBeInTheDocument();
    expect(screen.getByText(/Total lines of code:/i)).toBeInTheDocument();
  });

  it("shows message when no language data is available", () => {
    const userWithoutRepos: GitHubUser = {
      ...mockUser,
      repositories: {
        totalCount: 0,
        nodes: [],
      },
    };

    render(<LanguageStats user={userWithoutRepos} />);
    
    expect(screen.getByText("No language data available")).toBeInTheDocument();
  });
});