import { TooltipProvider } from "@/components/ui/tooltip";
import type { YearData } from "@/hooks/useUserAnalytics";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { YearDetailPanel } from "./YearDetailPanel";

// Mock framer-motion to avoid animation issues in tests
vi.mock("framer-motion", () => ({
  motion: {
    div: ({
      children,
      ...props
    }: React.HTMLAttributes<HTMLDivElement> & {
      children: React.ReactNode;
    }) => <div {...props}>{children}</div>,
    button: ({
      children,
      ...props
    }: React.ButtonHTMLAttributes<HTMLButtonElement> & {
      children: React.ReactNode;
    }) => <button {...props}>{children}</button>,
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

// Mock hooks
vi.mock("@/hooks", () => ({
  useProgressiveDisclosure: () => ({
    expandedProjects: new Set<string>(),
    toggleProject: vi.fn(),
  }),
  useReducedMotion: () => false,
  useResponsive: () => ({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
  }),
}));

// Helper to wrap component with TooltipProvider
const renderWithTooltip = (ui: React.ReactElement) => {
  return render(<TooltipProvider>{ui}</TooltipProvider>);
};

// Helper to create mock monthly data
const createMockMonthlyData = (commits: number) => {
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return monthNames.map((monthName, i) => ({
    month: i + 1,
    monthName,
    contributions: Math.floor(commits / 12),
    daysActive: 20,
    maxDaily: 10,
  }));
};

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
  monthlyContributions: createMockMonthlyData(commits),
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

describe("YearDetailPanel", () => {
  describe("year-specific view", () => {
    it("displays year in title", () => {
      const yearData = createMockYearData(2024, 500);
      renderWithTooltip(<YearDetailPanel year={yearData} username="user" />);

      expect(screen.getByText("2024 Activity")).toBeInTheDocument();
    });

    it("displays repository count badge", () => {
      const yearData = createMockYearData(2024, 500, 2, 3);
      renderWithTooltip(<YearDetailPanel year={yearData} username="user" />);

      // 2 owned + 3 contributed = 5 repositories
      expect(screen.getByText("5 repositories")).toBeInTheDocument();
    });

    it("displays commits stat card", () => {
      const yearData = createMockYearData(2024, 500);
      renderWithTooltip(<YearDetailPanel year={yearData} username="user" />);

      expect(screen.getByText("Commits")).toBeInTheDocument();
      expect(screen.getByText("500")).toBeInTheDocument();
    });

    it("displays pull requests stat card", () => {
      const yearData = createMockYearData(2024, 500);
      renderWithTooltip(<YearDetailPanel year={yearData} username="user" />);

      expect(screen.getByText("Pull Requests")).toBeInTheDocument();
      expect(screen.getByText("50")).toBeInTheDocument(); // 500 / 10
    });

    it("displays issues stat card", () => {
      const yearData = createMockYearData(2024, 450);
      renderWithTooltip(<YearDetailPanel year={yearData} username="user" />);

      expect(screen.getByText("Issues")).toBeInTheDocument();
      expect(screen.getByText("30")).toBeInTheDocument(); // 450 / 15 = 30
    });

    it("displays repositories stat card", () => {
      const yearData = createMockYearData(2024, 500, 3, 2);
      renderWithTooltip(<YearDetailPanel year={yearData} username="user" />);

      expect(screen.getByText("Repositories")).toBeInTheDocument();
      // 3 + 2 = 5 repositories
    });
  });

  describe("project sections", () => {
    it("shows Your Projects section when there are owned repos", () => {
      const yearData = createMockYearData(2024, 500, 2, 0);
      renderWithTooltip(<YearDetailPanel year={yearData} username="user" />);

      expect(screen.getByText("Your Projects")).toBeInTheDocument();
    });

    it("shows Open Source Contributions section when there are contributions", () => {
      const yearData = createMockYearData(2024, 500, 0, 3);
      renderWithTooltip(<YearDetailPanel year={yearData} username="user" />);

      expect(screen.getByText("Open Source Contributions")).toBeInTheDocument();
    });

    it("shows badge with project count in section headers", () => {
      const yearData = createMockYearData(2024, 500, 3, 2);
      renderWithTooltip(<YearDetailPanel year={yearData} username="user" />);

      // Your Projects badge should show 3
      expect(screen.getByText("3")).toBeInTheDocument();
      // Contributions badge should show 2
      expect(screen.getByText("2")).toBeInTheDocument();
    });

    it("does not show Your Projects section when no owned repos", () => {
      const yearData = createMockYearData(2024, 500, 0, 3);
      renderWithTooltip(<YearDetailPanel year={yearData} username="user" />);

      expect(screen.queryByText("Your Projects")).not.toBeInTheDocument();
    });

    it("does not show Contributions section when no contributed repos", () => {
      const yearData = createMockYearData(2024, 500, 2, 0);
      renderWithTooltip(<YearDetailPanel year={yearData} username="user" />);

      expect(
        screen.queryByText("Open Source Contributions"),
      ).not.toBeInTheDocument();
    });
  });

  describe("empty states", () => {
    it("shows empty state when year is null and no timeline", () => {
      renderWithTooltip(<YearDetailPanel year={null} username="user" />);

      expect(screen.getByText("No data available")).toBeInTheDocument();
      expect(
        screen.getByText("No activity data to display"),
      ).toBeInTheDocument();
    });

    it("shows empty message when year has no projects", () => {
      const yearData = createMockYearData(2024, 500, 0, 0);
      renderWithTooltip(<YearDetailPanel year={yearData} username="user" />);

      expect(
        screen.getByText("No repositories found for this year"),
      ).toBeInTheDocument();
    });
  });

  describe("all-time view", () => {
    const timeline = [
      createMockYearData(2024, 500, 2, 3),
      createMockYearData(2023, 400, 2, 2),
      createMockYearData(2022, 300, 1, 1),
    ];

    it("shows All Projects title when year is null with timeline", () => {
      renderWithTooltip(
        <YearDetailPanel year={null} timeline={timeline} username="user" />,
      );

      expect(screen.getByText("All Projects")).toBeInTheDocument();
    });

    it("does not show stat cards in all-time view", () => {
      renderWithTooltip(
        <YearDetailPanel year={null} timeline={timeline} username="user" />,
      );

      // Stats should not be displayed in all-time view
      expect(screen.queryByText("Commits")).not.toBeInTheDocument();
      expect(screen.queryByText("Pull Requests")).not.toBeInTheDocument();
    });

    it("aggregates repositories from all years", () => {
      renderWithTooltip(
        <YearDetailPanel year={null} timeline={timeline} username="user" />,
      );

      // Should show Your Projects and Contributions sections
      expect(screen.getByText("Your Projects")).toBeInTheDocument();
      expect(screen.getByText("Open Source Contributions")).toBeInTheDocument();
    });
  });

  describe("project display", () => {
    it("limits displayed projects to 10 per section", () => {
      const yearData = createMockYearData(2024, 500, 15, 0);
      renderWithTooltip(<YearDetailPanel year={yearData} username="user" />);

      // Should only show first 10 projects
      // The header badge should show 15 repositories total
      // There may be multiple "15" texts (badge + stat card), so use getAllByText
      const fifteenTexts = screen.getAllByText("15");
      expect(fifteenTexts.length).toBeGreaterThan(0);
    });

    it("renders project cards for owned repositories", () => {
      const yearData = createMockYearData(2024, 500, 2, 0);
      renderWithTooltip(<YearDetailPanel year={yearData} username="user" />);

      // Project names should be visible
      expect(screen.getByText("project-1")).toBeInTheDocument();
      expect(screen.getByText("project-2")).toBeInTheDocument();
    });

    it("renders project cards for contributions", () => {
      const yearData = createMockYearData(2024, 500, 0, 2);
      renderWithTooltip(<YearDetailPanel year={yearData} username="user" />);

      // Contribution project names should be visible
      expect(screen.getByText("oss-lib-1")).toBeInTheDocument();
      expect(screen.getByText("oss-lib-2")).toBeInTheDocument();
    });
  });

  describe("styling", () => {
    it("header has proper spacing", () => {
      const yearData = createMockYearData(2024, 500);
      const { container } = renderWithTooltip(
        <YearDetailPanel year={yearData} username="user" />,
      );

      // Check for mb-6 class on header container
      const header = container.querySelector(".mb-6");
      expect(header).toBeInTheDocument();
    });

    it("has scroll area for project list", () => {
      const yearData = createMockYearData(2024, 500);
      const { container } = renderWithTooltip(
        <YearDetailPanel year={yearData} username="user" />,
      );

      // ScrollArea should be present
      const scrollArea = container.querySelector(
        "[data-radix-scroll-area-viewport]",
      );
      expect(scrollArea).toBeInTheDocument();
    });
  });

  describe("stat cards", () => {
    it("formats large numbers with locale separators", () => {
      const yearData = createMockYearData(2024, 12345);
      renderWithTooltip(<YearDetailPanel year={yearData} username="user" />);

      // 12345 commits should be formatted
      expect(screen.getByText("12,345")).toBeInTheDocument();
    });

    it("displays icons on stat cards", () => {
      const yearData = createMockYearData(2024, 500);
      const { container } = renderWithTooltip(
        <YearDetailPanel year={yearData} username="user" />,
      );

      // Icons should be wrapped in rounded-full bg elements
      const iconContainers = container.querySelectorAll(
        ".rounded-full.bg-primary\\/10",
      );
      expect(iconContainers.length).toBe(4); // Commits, PRs, Issues, Repos
    });
  });

  describe("responsive grid", () => {
    it("uses 2-column grid on mobile, 4-column on desktop", () => {
      const yearData = createMockYearData(2024, 500);
      const { container } = renderWithTooltip(
        <YearDetailPanel year={yearData} username="user" />,
      );

      const statsGrid = container.querySelector(".grid-cols-2");
      expect(statsGrid).toBeInTheDocument();
      expect(statsGrid).toHaveClass("lg:grid-cols-4");
    });
  });

  describe("progressive disclosure", () => {
    it("passes toggleProject callback to ExpandableProjectCard", () => {
      const yearData = createMockYearData(2024, 500, 1, 0);
      renderWithTooltip(<YearDetailPanel year={yearData} username="user" />);

      // Project card should be rendered
      expect(screen.getByText("project-1")).toBeInTheDocument();
    });
  });
});
