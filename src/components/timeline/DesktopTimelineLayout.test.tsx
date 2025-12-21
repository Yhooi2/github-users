import type { YearData } from "@/hooks/useUserAnalytics";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { DesktopTimelineLayout } from "./DesktopTimelineLayout";

// Mock framer-motion
vi.mock("framer-motion", () => ({
  motion: {
    button: ({
      children,
      ...props
    }: React.ButtonHTMLAttributes<HTMLButtonElement> & {
      children: React.ReactNode;
    }) => <button {...props}>{children}</button>,
    div: ({
      children,
      ...props
    }: React.HTMLAttributes<HTMLDivElement> & {
      children: React.ReactNode;
    }) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

// Mock hooks
vi.mock("@/hooks", () => ({
  useReducedMotion: () => false,
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
  }: {
    project: { name: string };
    children?: React.ReactNode;
  }) => <div data-testid="project-card">{project.name}</div>,
}));

vi.mock("@/components/level-1/ExpandedCardContent", () => ({
  ExpandedCardContent: () => <div data-testid="expanded-content" />,
}));

vi.mock("@/components/level-2/ProjectAnalyticsModal", () => ({
  ProjectAnalyticsModal: () => <div data-testid="analytics-modal" />,
}));

// Mock project adapter to return proper data
vi.mock("@/lib/adapters/project-adapter", () => ({
  toExpandableProjects: (items: unknown[], username: string) => {
    if (!Array.isArray(items)) return [];
    return items.map(
      (item: { repository?: { id?: string; name?: string } }, i) => ({
        id: item?.repository?.id ?? `project-${i}`,
        name: item?.repository?.name ?? `Project ${i}`,
        fullName: `${username}/${item?.repository?.name ?? `project-${i}`}`,
        description: "Test project",
        commits: 100,
        stars: 50,
        forks: 10,
        language: "TypeScript",
        languageColor: "#3178c6",
        isOwner: i < 2,
        url: "https://github.com/test",
      }),
    );
  },
  toProjectForModal: () => null,
}));

// Helper to create mock year data
const createMockYearData = (
  year: number,
  commits: number,
  ownedCount: number = 2,
  contribCount: number = 3,
): YearData => ({
  year,
  totalCommits: commits,
  totalPRs: Math.floor(commits / 10),
  totalIssues: Math.floor(commits / 15),
  totalReviews: Math.floor(commits / 5),
  ownedRepos: Array.from({ length: ownedCount }, (_, i) => ({
    contributions: { totalCount: Math.floor(commits / (ownedCount + 1)) },
    repository: {
      id: `owned-${year}-${i}`,
      name: `project-${i + 1}`,
      nameWithOwner: `user/project-${i + 1}`,
      url: `https://github.com/user/project-${i + 1}`,
      description: "Test project",
      createdAt: `${year}-01-01T00:00:00Z`,
      updatedAt: `${year}-12-01T00:00:00Z`,
      pushedAt: `${year}-12-01T00:00:00Z`,
      stargazerCount: 100,
      forkCount: 10,
      isFork: false,
      isTemplate: false,
      isArchived: false,
      isPrivate: false,
      diskUsage: 1000,
      homepageUrl: null,
      primaryLanguage: { name: "TypeScript", color: "#3178c6" },
      owner: { login: "user", avatarUrl: "https://github.com/user.png" },
      parent: null,
      watchers: { totalCount: 10 },
      issues: { totalCount: 5 },
      repositoryTopics: { nodes: [] },
      languages: { totalSize: 1000, edges: [] },
      licenseInfo: null,
      defaultBranchRef: null,
    },
  })),
  contributions: Array.from({ length: contribCount }, (_, i) => ({
    contributions: { totalCount: Math.floor(commits / (contribCount + 3)) },
    repository: {
      id: `contrib-${year}-${i}`,
      name: `oss-lib-${i + 1}`,
      nameWithOwner: `org/oss-lib-${i + 1}`,
      url: `https://github.com/org/oss-lib-${i + 1}`,
      description: "Open source library",
      createdAt: `${year - 2}-01-01T00:00:00Z`,
      updatedAt: `${year}-12-01T00:00:00Z`,
      pushedAt: `${year}-12-01T00:00:00Z`,
      stargazerCount: 1000,
      forkCount: 100,
      isFork: false,
      isTemplate: false,
      isArchived: false,
      isPrivate: false,
      diskUsage: 5000,
      homepageUrl: null,
      primaryLanguage: { name: "JavaScript", color: "#f1e05a" },
      owner: { login: "org", avatarUrl: "https://github.com/org.png" },
      parent: null,
      watchers: { totalCount: 50 },
      issues: { totalCount: 25 },
      repositoryTopics: { nodes: [] },
      languages: { totalSize: 5000, edges: [] },
      licenseInfo: null,
      defaultBranchRef: null,
    },
  })),
});

describe("DesktopTimelineLayout", () => {
  const mockTimeline = [
    createMockYearData(2024, 800),
    createMockYearData(2023, 600),
    createMockYearData(2022, 400),
  ];

  it("renders without Activity Timeline heading for cleaner UX", () => {
    render(
      <DesktopTimelineLayout timeline={mockTimeline} username="developer" />,
    );

    // Header was removed - section identified by aria-label instead
    expect(
      screen.queryByRole("heading", { name: "Activity Timeline" }),
    ).not.toBeInTheDocument();
    // But the section is accessible
    expect(screen.getByLabelText("Activity Timeline")).toBeInTheDocument();
  });

  it("renders year navigation sidebar", () => {
    render(
      <DesktopTimelineLayout timeline={mockTimeline} username="developer" />,
    );

    expect(screen.getByLabelText("Year navigation")).toBeInTheDocument();
  });

  it("renders all-time summary panel by default", () => {
    render(
      <DesktopTimelineLayout timeline={mockTimeline} username="developer" />,
    );

    expect(screen.getByLabelText("All-time summary")).toBeInTheDocument();
  });

  it("renders all year cards in sidebar", () => {
    render(
      <DesktopTimelineLayout timeline={mockTimeline} username="developer" />,
    );

    expect(screen.getByText("2024")).toBeInTheDocument();
    expect(screen.getByText("2023")).toBeInTheDocument();
    expect(screen.getByText("2022")).toBeInTheDocument();
  });

  it("shows All Time header in sidebar", () => {
    render(
      <DesktopTimelineLayout timeline={mockTimeline} username="developer" />,
    );

    // All Time header exists
    expect(screen.getByText("All Time")).toBeInTheDocument();
  });

  it("selects All Time view by default", () => {
    render(
      <DesktopTimelineLayout timeline={mockTimeline} username="developer" />,
    );

    // All Time header should be highlighted (bg-primary/10)
    const allTimeButton = screen.getByRole("button", { pressed: true });
    expect(allTimeButton).toBeInTheDocument();

    // Detail panel should show "All Projects" header
    expect(screen.getByText("All Projects")).toBeInTheDocument();
  });

  it("changes selected year when clicking a year card", async () => {
    const user = userEvent.setup();

    render(
      <DesktopTimelineLayout timeline={mockTimeline} username="developer" />,
    );

    // Initially All Time is selected (shows "All Projects")
    expect(screen.getByText("All Projects")).toBeInTheDocument();

    // Click on 2024 year card
    const year2024Button = screen
      .getAllByRole("button")
      .find(
        (btn) =>
          btn.textContent?.includes("2024") &&
          !btn.textContent?.includes("All Time"),
      );
    expect(year2024Button).toBeDefined();

    await user.click(year2024Button!);

    // Now 2024 should be selected (shows year-specific activity)
    expect(screen.getByText("2024 Activity")).toBeInTheDocument();
  });

  it("shows summary stats for selected year", async () => {
    const user = userEvent.setup();

    render(
      <DesktopTimelineLayout timeline={mockTimeline} username="developer" />,
    );

    // Click on 2024 year card to see stats
    const year2024Button = screen
      .getAllByRole("button")
      .find(
        (btn) =>
          btn.textContent?.includes("2024") &&
          !btn.textContent?.includes("All Time"),
      );
    await user.click(year2024Button!);

    // Check for stat labels (may appear in both YearCard and YearDetailPanel)
    expect(screen.getAllByText("Commits").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Pull Requests").length).toBeGreaterThanOrEqual(
      1,
    );
    expect(screen.getByText("Issues")).toBeInTheDocument();
    expect(screen.getAllByText("Repositories").length).toBeGreaterThanOrEqual(
      1,
    );
  });

  it("uses CSS Grid for 33/67 split layout", () => {
    render(
      <DesktopTimelineLayout timeline={mockTimeline} username="developer" />,
    );

    // Find the grid container (has grid-cols-[1fr_2fr])
    const gridContainer = document.querySelector(".grid-cols-\\[1fr_2fr\\]");
    expect(gridContainer).toBeInTheDocument();
  });

  it("has accessible section label", () => {
    render(
      <DesktopTimelineLayout timeline={mockTimeline} username="developer" />,
    );

    expect(screen.getByLabelText("Activity Timeline")).toBeInTheDocument();
  });

  it("renders project cards in detail panel", () => {
    render(
      <DesktopTimelineLayout timeline={mockTimeline} username="developer" />,
    );

    // Project cards are rendered via mocked ExpandableProjectCard
    const projectCards = screen.getAllByTestId("project-card");
    expect(projectCards.length).toBeGreaterThan(0);
  });
});
