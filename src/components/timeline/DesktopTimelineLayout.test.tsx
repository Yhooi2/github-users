import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import type { YearData } from "@/hooks/useUserAnalytics";
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
    }: React.HTMLAttributes<HTMLDivElement> & { children: React.ReactNode }) => (
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
    return items.map((item: { repository?: { id?: string; name?: string } }, i) => ({
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
    }));
  },
  toProjectForModal: () => null,
}));

// Helper to create mock year data
const createMockYearData = (
  year: number,
  commits: number,
  ownedCount: number = 2,
  contribCount: number = 3
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

  it("renders Activity Timeline heading", () => {
    render(
      <DesktopTimelineLayout timeline={mockTimeline} username="developer" />
    );

    expect(screen.getByText("Activity Timeline")).toBeInTheDocument();
  });

  it("renders year navigation sidebar", () => {
    render(
      <DesktopTimelineLayout timeline={mockTimeline} username="developer" />
    );

    expect(screen.getByLabelText("Year navigation")).toBeInTheDocument();
  });

  it("renders year details panel", () => {
    render(
      <DesktopTimelineLayout timeline={mockTimeline} username="developer" />
    );

    expect(screen.getByLabelText("Year details")).toBeInTheDocument();
  });

  it("renders all year cards in sidebar", () => {
    render(
      <DesktopTimelineLayout timeline={mockTimeline} username="developer" />
    );

    expect(screen.getByText("2024")).toBeInTheDocument();
    expect(screen.getByText("2023")).toBeInTheDocument();
    expect(screen.getByText("2022")).toBeInTheDocument();
  });

  it("shows year count in sidebar header", () => {
    render(
      <DesktopTimelineLayout timeline={mockTimeline} username="developer" />
    );

    expect(screen.getByText("Years (3)")).toBeInTheDocument();
  });

  it("selects first year by default", () => {
    render(
      <DesktopTimelineLayout timeline={mockTimeline} username="developer" />
    );

    // First year (2024) should show "Active" badge (changed from "Selected")
    expect(screen.getByText("Active")).toBeInTheDocument();

    // Detail panel should show 2024 Activity
    expect(screen.getByText("2024 Activity")).toBeInTheDocument();
  });

  it("changes selected year when clicking a year card", async () => {
    const user = userEvent.setup();

    render(
      <DesktopTimelineLayout timeline={mockTimeline} username="developer" />
    );

    // Initially 2024 is selected
    expect(screen.getByText("2024 Activity")).toBeInTheDocument();

    // Click on 2023 year card
    const year2023Button = screen.getAllByRole("button").find((btn) =>
      btn.textContent?.includes("2023")
    );
    expect(year2023Button).toBeDefined();

    await user.click(year2023Button!);

    // Now 2023 should be selected
    expect(screen.getByText("2023 Activity")).toBeInTheDocument();
  });

  it("shows summary stats for selected year", () => {
    render(
      <DesktopTimelineLayout timeline={mockTimeline} username="developer" />
    );

    // Check for stat labels (2024 has 800 commits)
    expect(screen.getByText("Commits")).toBeInTheDocument();
    expect(screen.getByText("Pull Requests")).toBeInTheDocument();
    expect(screen.getByText("Issues")).toBeInTheDocument();
    expect(screen.getByText("Repositories")).toBeInTheDocument();
  });

  it("uses CSS Grid for 33/67 split layout", () => {
    render(
      <DesktopTimelineLayout timeline={mockTimeline} username="developer" />
    );

    // Find the grid container (has grid-cols-[1fr_2fr])
    const gridContainer = document.querySelector(".grid-cols-\\[1fr_2fr\\]");
    expect(gridContainer).toBeInTheDocument();
  });

  it("has accessible section label", () => {
    render(
      <DesktopTimelineLayout timeline={mockTimeline} username="developer" />
    );

    expect(screen.getByLabelText("Activity Timeline")).toBeInTheDocument();
  });

  it("renders project cards in detail panel", () => {
    render(
      <DesktopTimelineLayout timeline={mockTimeline} username="developer" />
    );

    // Project cards are rendered via mocked ExpandableProjectCard
    const projectCards = screen.getAllByTestId("project-card");
    expect(projectCards.length).toBeGreaterThan(0);
  });
});
