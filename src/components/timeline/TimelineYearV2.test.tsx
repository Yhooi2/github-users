import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import type { YearData } from "@/hooks/useUserAnalytics";
import { TimelineYearV2 } from "./TimelineYearV2";

// Mock framer-motion
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
      <div {...props}>{children}</div>
    ),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

// Mock hooks
vi.mock("@/hooks", () => ({
  useReducedMotion: () => false,
  useResponsive: () => ({ isMobile: false, isTablet: false, isDesktop: true }),
  useProgressiveDisclosure: () => ({
    expandedProjects: new Set<string>(),
    modalOpen: false,
    selectedProjectId: null,
    activeTab: "overview",
    toggleProject: vi.fn(),
    openModal: vi.fn(),
    closeModal: vi.fn(),
    setActiveTab: vi.fn(),
  }),
}));

// Mock Level 1 and Level 2 components
vi.mock("@/components/level-1/ExpandableProjectCard", () => ({
  ExpandableProjectCard: ({
    project,
    children,
  }: {
    project: { name: string };
    children?: React.ReactNode;
  }) => (
    <div data-testid={`expandable-card-${project.name}`}>
      {project.name}
      {children}
    </div>
  ),
}));

vi.mock("@/components/level-1/ExpandedCardContent", () => ({
  ExpandedCardContent: () => <div data-testid="expanded-content">Content</div>,
}));

vi.mock("@/components/level-2/ProjectAnalyticsModal", () => ({
  ProjectAnalyticsModal: () => <div data-testid="analytics-modal">Modal</div>,
}));

const createMockYearData = (overrides: Partial<YearData> = {}): YearData => ({
  year: 2024,
  totalCommits: 500,
  totalPRs: 50,
  totalIssues: 30,
  totalReviews: 100,
  ownedRepos: [
    {
      contributions: { totalCount: 200 },
      repository: {
        id: "owned-1",
        name: "my-repo",
        nameWithOwner: "testuser/my-repo",
        url: "https://github.com/testuser/my-repo",
        description: "My repository",
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-06-01T00:00:00Z",
        pushedAt: "2024-06-01T00:00:00Z",
        stargazerCount: 100,
        forkCount: 10,
        isFork: false,
        isTemplate: false,
        isArchived: false,
        isPrivate: false,
        diskUsage: 500,
        homepageUrl: null,
        primaryLanguage: { name: "TypeScript", color: "#3178c6" },
        owner: { login: "testuser", avatarUrl: "https://github.com/testuser.png" },
        parent: null,
        watchers: { totalCount: 5 },
        issues: { totalCount: 3 },
        repositoryTopics: { nodes: [] },
        languages: { totalSize: 500, edges: [] },
        licenseInfo: null,
        defaultBranchRef: null,
      },
    },
  ],
  contributions: [
    {
      contributions: { totalCount: 50 },
      repository: {
        id: "contrib-1",
        name: "open-source-lib",
        nameWithOwner: "org/open-source-lib",
        url: "https://github.com/org/open-source-lib",
        description: "An open source library",
        createdAt: "2020-01-01T00:00:00Z",
        updatedAt: "2024-06-01T00:00:00Z",
        pushedAt: "2024-06-01T00:00:00Z",
        stargazerCount: 5000,
        forkCount: 500,
        isFork: false,
        isTemplate: false,
        isArchived: false,
        isPrivate: false,
        diskUsage: 10000,
        homepageUrl: null,
        primaryLanguage: { name: "JavaScript", color: "#f1e05a" },
        owner: { login: "org", avatarUrl: "https://github.com/org.png" },
        parent: null,
        watchers: { totalCount: 100 },
        issues: { totalCount: 50 },
        repositoryTopics: { nodes: [] },
        languages: { totalSize: 10000, edges: [] },
        licenseInfo: null,
        defaultBranchRef: null,
      },
    },
  ],
  ...overrides,
});

describe("TimelineYearV2", () => {
  it("renders year header with stats", () => {
    const yearData = createMockYearData();

    render(
      <TimelineYearV2
        year={yearData}
        maxCommits={1000}
        username="testuser"
      />,
    );

    // Year label
    expect(screen.getByText("2024")).toBeInTheDocument();

    // Stats
    expect(screen.getByText("500 commits")).toBeInTheDocument();
    expect(screen.getByText("50 PRs")).toBeInTheDocument();
    expect(screen.getByText("2 repos")).toBeInTheDocument();
  });

  it("starts collapsed by default", () => {
    const yearData = createMockYearData();

    render(
      <TimelineYearV2
        year={yearData}
        maxCommits={1000}
        username="testuser"
      />,
    );

    // Project cards should not be visible initially
    expect(screen.queryByTestId("expandable-card-my-repo")).not.toBeInTheDocument();
  });

  it("expands when year header is clicked", async () => {
    const user = userEvent.setup();
    const yearData = createMockYearData();

    render(
      <TimelineYearV2
        year={yearData}
        maxCommits={1000}
        username="testuser"
      />,
    );

    const toggleButton = screen.getByRole("button", { name: /Toggle 2024 details/i });
    await user.click(toggleButton);

    // Now project cards should be visible
    expect(screen.getByTestId("expandable-card-my-repo")).toBeInTheDocument();
    expect(screen.getByTestId("expandable-card-open-source-lib")).toBeInTheDocument();
  });

  it("shows summary stats when expanded", async () => {
    const user = userEvent.setup();
    const yearData = createMockYearData();

    render(
      <TimelineYearV2
        year={yearData}
        maxCommits={1000}
        username="testuser"
      />,
    );

    const toggleButton = screen.getByRole("button", { name: /Toggle 2024 details/i });
    await user.click(toggleButton);

    // Summary stat cards
    expect(screen.getByText("Commits")).toBeInTheDocument();
    expect(screen.getByText("Pull Requests")).toBeInTheDocument();
    expect(screen.getByText("Issues")).toBeInTheDocument();
    expect(screen.getByText("Repositories")).toBeInTheDocument();
  });

  it("separates owned repos and contributions", async () => {
    const user = userEvent.setup();
    const yearData = createMockYearData();

    render(
      <TimelineYearV2
        year={yearData}
        maxCommits={1000}
        username="testuser"
      />,
    );

    const toggleButton = screen.getByRole("button", { name: /Toggle 2024 details/i });
    await user.click(toggleButton);

    // Section headings
    expect(screen.getByText("Your Projects")).toBeInTheDocument();
    expect(screen.getByText("Open Source Contributions")).toBeInTheDocument();
  });

  it("shows correct aria-expanded state", async () => {
    const user = userEvent.setup();
    const yearData = createMockYearData();

    render(
      <TimelineYearV2
        year={yearData}
        maxCommits={1000}
        username="testuser"
      />,
    );

    const toggleButton = screen.getByRole("button", { name: /Toggle 2024 details/i });

    // Initially collapsed
    expect(toggleButton).toHaveAttribute("aria-expanded", "false");

    await user.click(toggleButton);

    // Now expanded
    expect(toggleButton).toHaveAttribute("aria-expanded", "true");
  });

  it("collapses when clicked again", async () => {
    const user = userEvent.setup();
    const yearData = createMockYearData();

    render(
      <TimelineYearV2
        year={yearData}
        maxCommits={1000}
        username="testuser"
      />,
    );

    const toggleButton = screen.getByRole("button", { name: /Toggle 2024 details/i });

    // Expand
    await user.click(toggleButton);
    expect(screen.getByTestId("expandable-card-my-repo")).toBeInTheDocument();

    // Collapse
    await user.click(toggleButton);
    expect(screen.queryByTestId("expandable-card-my-repo")).not.toBeInTheDocument();
  });

  it("handles empty year data", async () => {
    const user = userEvent.setup();
    const emptyYearData = createMockYearData({
      ownedRepos: [],
      contributions: [],
      totalCommits: 0,
      totalPRs: 0,
      totalIssues: 0,
    });

    render(
      <TimelineYearV2
        year={emptyYearData}
        maxCommits={1000}
        username="testuser"
      />,
    );

    const toggleButton = screen.getByRole("button", { name: /Toggle 2024 details/i });
    await user.click(toggleButton);

    expect(screen.getByText("No repositories found for this year")).toBeInTheDocument();
  });

  it("renders analytics modal placeholder", () => {
    const yearData = createMockYearData();

    render(
      <TimelineYearV2
        year={yearData}
        maxCommits={1000}
        username="testuser"
      />,
    );

    // Modal component should be rendered (even if not open)
    expect(screen.getByTestId("analytics-modal")).toBeInTheDocument();
  });
});
