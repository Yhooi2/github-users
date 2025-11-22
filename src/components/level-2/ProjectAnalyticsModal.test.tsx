import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ProjectAnalyticsModal, type ProjectForModal } from "./ProjectAnalyticsModal";

// Mock hooks
vi.mock("@/hooks", () => ({
  useResponsive: vi.fn(() => ({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    breakpoint: "desktop",
    width: 1440,
  })),
  useReducedMotion: vi.fn(() => false),
}));

// Mock lazy-loaded tabs
vi.mock("./tabs/OverviewTab", () => ({
  OverviewTab: () => <div data-testid="overview-tab">Overview Content</div>,
}));
vi.mock("./tabs/TimelineTab", () => ({
  TimelineTab: () => <div data-testid="timeline-tab">Timeline Content</div>,
}));
vi.mock("./tabs/CodeTab", () => ({
  CodeTab: () => <div data-testid="code-tab">Code Content</div>,
}));
vi.mock("./tabs/TeamTab", () => ({
  TeamTab: () => <div data-testid="team-tab">Team Content</div>,
}));

describe("ProjectAnalyticsModal", () => {
  const defaultProject: ProjectForModal = {
    id: "1",
    name: "test-repo",
    description: "A test repository",
    url: "https://github.com/user/test-repo",
    stars: 1200,
    forks: 45,
  };

  const defaultProps = {
    open: true,
    onOpenChange: vi.fn(),
    project: defaultProject,
    activeTab: "overview" as const,
    onTabChange: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("rendering", () => {
    it("should render project name in title", async () => {
      render(<ProjectAnalyticsModal {...defaultProps} />);

      expect(await screen.findByText("test-repo")).toBeInTheDocument();
    });

    it("should render project description", async () => {
      render(<ProjectAnalyticsModal {...defaultProps} />);

      expect(await screen.findByText("A test repository")).toBeInTheDocument();
    });

    it("should render all 4 tab triggers", async () => {
      render(<ProjectAnalyticsModal {...defaultProps} />);

      expect(await screen.findByRole("tab", { name: /Overview/i })).toBeInTheDocument();
      expect(screen.getByRole("tab", { name: /Timeline/i })).toBeInTheDocument();
      expect(screen.getByRole("tab", { name: /Code/i })).toBeInTheDocument();
      expect(screen.getByRole("tab", { name: /Team/i })).toBeInTheDocument();
    });

    it("should not render when project is null", () => {
      render(<ProjectAnalyticsModal {...defaultProps} project={null} />);

      expect(screen.queryByText("test-repo")).not.toBeInTheDocument();
    });

    it("should not render when closed", () => {
      render(<ProjectAnalyticsModal {...defaultProps} open={false} />);

      // Dialog content should not be visible when closed
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  describe("tab switching", () => {
    it("should call onTabChange when clicking a tab", async () => {
      const user = userEvent.setup();
      const onTabChange = vi.fn();

      render(<ProjectAnalyticsModal {...defaultProps} onTabChange={onTabChange} />);

      await user.click(await screen.findByRole("tab", { name: /Timeline/i }));

      expect(onTabChange).toHaveBeenCalledWith("timeline");
    });

    it("should show overview content when overview tab is active", async () => {
      render(<ProjectAnalyticsModal {...defaultProps} activeTab="overview" />);

      expect(await screen.findByTestId("overview-tab")).toBeInTheDocument();
    });
  });

  describe("closing", () => {
    it("should call onOpenChange when close button is clicked", async () => {
      const user = userEvent.setup();
      const onOpenChange = vi.fn();

      render(<ProjectAnalyticsModal {...defaultProps} onOpenChange={onOpenChange} />);

      // Find and click the close button (X)
      const closeButton = await screen.findByRole("button", { name: /close/i });
      await user.click(closeButton);

      expect(onOpenChange).toHaveBeenCalledWith(false);
    });
  });
});
