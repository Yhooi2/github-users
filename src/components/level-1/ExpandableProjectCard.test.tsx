import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ExpandableProjectCard, type ExpandableProject } from "./ExpandableProjectCard";

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

// Mock framer-motion
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
      <div {...props}>{children}</div>
    ),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe("ExpandableProjectCard", () => {
  const defaultProject: ExpandableProject = {
    id: "1",
    name: "test-repo",
    commits: 150,
    stars: 1200,
    language: "TypeScript",
    isOwner: true,
    description: "A test repository",
    url: "https://github.com/user/test-repo",
    forks: 45,
  };

  const defaultProps = {
    project: defaultProject,
    isExpanded: false,
    onToggle: vi.fn(),
    onOpenAnalytics: vi.fn(),
    maxCommits: 500,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("rendering", () => {
    it("should render project name", () => {
      render(<ExpandableProjectCard {...defaultProps} />);

      expect(screen.getByText("test-repo")).toBeInTheDocument();
    });

    it("should render commits count", () => {
      render(<ExpandableProjectCard {...defaultProps} />);

      expect(screen.getByText("150c")).toBeInTheDocument();
    });

    it("should render Owner badge for owned projects", () => {
      render(<ExpandableProjectCard {...defaultProps} />);

      expect(screen.getByText("Owner")).toBeInTheDocument();
    });

    it("should render Contrib badge for contributed projects", () => {
      render(
        <ExpandableProjectCard
          {...defaultProps}
          project={{ ...defaultProject, isOwner: false }}
        />,
      );

      expect(screen.getByText("Contrib")).toBeInTheDocument();
    });

    it("should show collapse icon when expanded", () => {
      render(<ExpandableProjectCard {...defaultProps} isExpanded={true} />);

      // ChevronUp is present when expanded - find header button by aria-label
      const headerButton = screen.getByRole("button", { name: /Collapse test-repo/i });
      expect(headerButton).toHaveAttribute("aria-expanded", "true");
    });
  });

  describe("expanded content", () => {
    it("should show description when expanded", () => {
      render(<ExpandableProjectCard {...defaultProps} isExpanded={true} />);

      expect(screen.getByText("A test repository")).toBeInTheDocument();
    });

    it("should render children when expanded", () => {
      render(
        <ExpandableProjectCard {...defaultProps} isExpanded={true}>
          <div data-testid="child-content">Child Content</div>
        </ExpandableProjectCard>,
      );

      expect(screen.getByTestId("child-content")).toBeInTheDocument();
    });

    it("should not render children when collapsed", () => {
      render(
        <ExpandableProjectCard {...defaultProps} isExpanded={false}>
          <div data-testid="child-content">Child Content</div>
        </ExpandableProjectCard>,
      );

      expect(screen.queryByTestId("child-content")).not.toBeInTheDocument();
    });

    it("should show View Analytics button when expanded", () => {
      render(<ExpandableProjectCard {...defaultProps} isExpanded={true} />);

      expect(screen.getByRole("button", { name: /View Analytics/i })).toBeInTheDocument();
    });

    it("should show GitHub link when expanded", () => {
      render(<ExpandableProjectCard {...defaultProps} isExpanded={true} />);

      const githubLink = screen.getByRole("link", { name: /GitHub/i });
      expect(githubLink).toHaveAttribute("href", "https://github.com/user/test-repo");
      expect(githubLink).toHaveAttribute("target", "_blank");
    });
  });

  describe("interactions", () => {
    it("should call onToggle when header is clicked", async () => {
      const user = userEvent.setup();
      const onToggle = vi.fn();

      render(<ExpandableProjectCard {...defaultProps} onToggle={onToggle} />);

      await user.click(screen.getByRole("button", { name: /Expand test-repo/i }));

      expect(onToggle).toHaveBeenCalledTimes(1);
    });

    it("should call onToggle when Enter is pressed", async () => {
      const user = userEvent.setup();
      const onToggle = vi.fn();

      render(<ExpandableProjectCard {...defaultProps} onToggle={onToggle} />);

      const header = screen.getByRole("button", { name: /Expand test-repo/i });
      header.focus();
      await user.keyboard("{Enter}");

      expect(onToggle).toHaveBeenCalledTimes(1);
    });

    it("should call onOpenAnalytics when View Analytics is clicked", async () => {
      const user = userEvent.setup();
      const onOpenAnalytics = vi.fn();

      render(
        <ExpandableProjectCard
          {...defaultProps}
          isExpanded={true}
          onOpenAnalytics={onOpenAnalytics}
        />,
      );

      await user.click(screen.getByRole("button", { name: /View Analytics/i }));

      expect(onOpenAnalytics).toHaveBeenCalledTimes(1);
    });

    it("should not call onToggle when View Analytics is clicked", async () => {
      const user = userEvent.setup();
      const onToggle = vi.fn();

      render(
        <ExpandableProjectCard {...defaultProps} isExpanded={true} onToggle={onToggle} />,
      );

      await user.click(screen.getByRole("button", { name: /View Analytics/i }));

      // onToggle should not be called because of stopPropagation
      expect(onToggle).not.toHaveBeenCalled();
    });
  });

  describe("accessibility", () => {
    it("should have proper aria-expanded attribute", () => {
      const { rerender } = render(
        <ExpandableProjectCard {...defaultProps} isExpanded={false} />,
      );

      expect(screen.getByRole("button", { name: /Expand/i })).toHaveAttribute(
        "aria-expanded",
        "false",
      );

      rerender(<ExpandableProjectCard {...defaultProps} isExpanded={true} />);

      expect(screen.getByRole("button", { name: /Collapse/i })).toHaveAttribute(
        "aria-expanded",
        "true",
      );
    });

    it("should have aria-controls pointing to content", () => {
      render(<ExpandableProjectCard {...defaultProps} />);

      expect(screen.getByRole("button")).toHaveAttribute(
        "aria-controls",
        "card-content-1",
      );
    });

    it("should be focusable", () => {
      render(<ExpandableProjectCard {...defaultProps} />);

      expect(screen.getByRole("button")).toHaveAttribute("tabIndex", "0");
    });
  });
});
