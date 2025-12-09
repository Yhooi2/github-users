import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ExpandableProjectCard, type ExpandableProject, type TeamMember } from "./ExpandableProjectCard";

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

// Mock Radix tooltip (it causes issues in test environment)
vi.mock("@radix-ui/react-tooltip", () => ({
  Root: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  Trigger: ({ children, asChild: _asChild, ...props }: { children: React.ReactNode; asChild?: boolean }) => (
    <span {...props}>{children}</span>
  ),
  Portal: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  Content: ({ children }: { children: React.ReactNode }) => <div role="tooltip">{children}</div>,
  Provider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  Arrow: () => null,
}));

describe("ExpandableProjectCard", () => {
  const sampleTeam: TeamMember[] = [
    { name: "Alice", avatar: "https://example.com/alice.jpg", login: "alice", commits: 100 },
    { name: "Bob", avatar: "https://example.com/bob.jpg", login: "bob", commits: 80 },
  ];

  const defaultProject: ExpandableProject = {
    id: "1",
    name: "test-repo",
    commits: 150,
    stars: 1200,
    language: "TypeScript",
    languages: [
      { name: "TypeScript", percent: 70 },
      { name: "JavaScript", percent: 20 },
      { name: "CSS", percent: 10 },
    ],
    isOwner: true,
    isFork: false,
    description: "A test repository",
    url: "https://github.com/user/test-repo",
    forks: 45,
    contributionPercent: 25,
    totalCommits: 600,
    userCommits: 150,
    prsMerged: 12,
    reviews: 34,
    activePeriod: "Jan 2024 - Nov 2025",
    teamCount: 5,
    topContributors: sampleTeam,
  };

  const defaultProps = {
    project: defaultProject,
    isExpanded: false,
    onToggle: vi.fn(),
    maxCommits: 500,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("collapsed state", () => {
    it("should render project name", () => {
      render(<ExpandableProjectCard {...defaultProps} />);

      expect(screen.getByText("test-repo")).toBeInTheDocument();
    });

    it("should render commits count", () => {
      render(<ExpandableProjectCard {...defaultProps} />);

      // Commits displayed multiple places due to tooltips, check at least one exists
      expect(screen.getAllByText("150").length).toBeGreaterThanOrEqual(1);
    });

    it("should render stars count", () => {
      render(<ExpandableProjectCard {...defaultProps} />);

      // formatNumber formats 1200 as "1.2K" - appears in header
      expect(screen.getAllByText("1.2K").length).toBeGreaterThanOrEqual(1);
    });

    it("should render contribution percentage in header", () => {
      render(<ExpandableProjectCard {...defaultProps} />);

      expect(screen.getByText("25%")).toBeInTheDocument();
    });

    it("should not render Fork badge for non-forked projects", () => {
      render(<ExpandableProjectCard {...defaultProps} />);

      expect(screen.queryByText("Fork")).not.toBeInTheDocument();
    });

    it("should render Fork badge for forked projects", () => {
      render(
        <ExpandableProjectCard
          {...defaultProps}
          project={{ ...defaultProject, isFork: true }}
        />,
      );

      expect(screen.getByText("Fork")).toBeInTheDocument();
    });

    it("should render top 3 languages inline", () => {
      render(<ExpandableProjectCard {...defaultProps} />);

      expect(screen.getByText(/TypeScript 70%/)).toBeInTheDocument();
      expect(screen.getByText(/JavaScript 20%/)).toBeInTheDocument();
      expect(screen.getByText(/CSS 10%/)).toBeInTheDocument();
    });

    it("should not render expanded content when collapsed", () => {
      render(<ExpandableProjectCard {...defaultProps} />);

      expect(screen.queryByText("A test repository")).not.toBeInTheDocument();
      expect(screen.queryByText("Your Contribution")).not.toBeInTheDocument();
    });
  });

  describe("expanded state", () => {
    it("should show description when expanded", () => {
      render(<ExpandableProjectCard {...defaultProps} isExpanded={true} />);

      expect(screen.getByText("A test repository")).toBeInTheDocument();
    });

    it("should show Your Contribution section", () => {
      render(<ExpandableProjectCard {...defaultProps} isExpanded={true} />);

      expect(screen.getByText("Your Contribution")).toBeInTheDocument();
      // Progress bar shows "25% of 600" - use getAllByText due to tooltip
      const contributionText = screen.getAllByText(/25% of 600/);
      expect(contributionText.length).toBeGreaterThanOrEqual(1);
    });

    it("should show PRs merged count", () => {
      render(<ExpandableProjectCard {...defaultProps} isExpanded={true} />);

      expect(screen.getByText("12 PRs")).toBeInTheDocument();
    });

    it("should show reviews count", () => {
      render(<ExpandableProjectCard {...defaultProps} isExpanded={true} />);

      expect(screen.getByText("34 reviews")).toBeInTheDocument();
    });

    it("should show active period", () => {
      render(<ExpandableProjectCard {...defaultProps} isExpanded={true} />);

      expect(screen.getByText("Active: Jan 2024 - Nov 2025")).toBeInTheDocument();
    });

    it("should show Project Impact section", () => {
      render(<ExpandableProjectCard {...defaultProps} isExpanded={true} />);

      expect(screen.getByText("Project Impact")).toBeInTheDocument();
      // Use getAllByText due to tooltips duplicating content, K is uppercase
      expect(screen.getAllByText("1.2K stars").length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText("45 forks").length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText("5 contributors").length).toBeGreaterThanOrEqual(1);
    });

    it("should show Tech Stack section", () => {
      render(<ExpandableProjectCard {...defaultProps} isExpanded={true} />);

      expect(screen.getByText("Tech Stack")).toBeInTheDocument();
    });

    it("should show Team section with avatars", () => {
      render(<ExpandableProjectCard {...defaultProps} isExpanded={true} />);

      expect(screen.getByText("Team")).toBeInTheDocument();
      // Check for avatar fallbacks (initials) when images don't load in test
      expect(screen.getByText("AL")).toBeInTheDocument(); // Alice fallback
      expect(screen.getByText("BO")).toBeInTheDocument(); // Bob fallback
    });

    it("should show GitHub link as icon", () => {
      render(<ExpandableProjectCard {...defaultProps} isExpanded={true} />);

      const githubLink = screen.getByRole("link", { name: /View test-repo on GitHub/i });
      expect(githubLink).toHaveAttribute("href", "https://github.com/user/test-repo");
      expect(githubLink).toHaveAttribute("target", "_blank");
    });

    it("should show collapse icon when expanded", () => {
      render(<ExpandableProjectCard {...defaultProps} isExpanded={true} />);

      const card = screen.getByRole("button", { name: /Collapse test-repo/i });
      expect(card).toHaveAttribute("aria-expanded", "true");
    });
  });

  describe("minimal data handling", () => {
    const minimalProject: ExpandableProject = {
      id: "2",
      name: "minimal-repo",
      commits: 10,
      stars: 5,
      language: "JavaScript",
      isOwner: true,
      isFork: false,
      url: "https://github.com/user/minimal-repo",
    };

    it("should render contribution section with calculated 100% when no explicit data", () => {
      render(
        <ExpandableProjectCard
          {...defaultProps}
          project={minimalProject}
          isExpanded={true}
        />,
      );

      // Your Contribution section is always shown with calculated percentage
      expect(screen.getByText("Your Contribution")).toBeInTheDocument();
      // Should show 100% when no total commits data (assumes user is sole contributor)
      expect(screen.getByText("100%")).toBeInTheDocument();
    });

    it("should render without team section when no team data", () => {
      render(
        <ExpandableProjectCard
          {...defaultProps}
          project={minimalProject}
          isExpanded={true}
        />,
      );

      expect(screen.queryByText("Team")).not.toBeInTheDocument();
    });

    it("should still show Project Impact section", () => {
      render(
        <ExpandableProjectCard
          {...defaultProps}
          project={minimalProject}
          isExpanded={true}
        />,
      );

      expect(screen.getByText("Project Impact")).toBeInTheDocument();
      // Use getAllByText due to tooltips
      expect(screen.getAllByText("5 stars").length).toBeGreaterThanOrEqual(1);
    });
  });

  describe("interactions", () => {
    it("should call onToggle when card is clicked", async () => {
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

      const card = screen.getByRole("button", { name: /Expand test-repo/i });
      card.focus();
      await user.keyboard("{Enter}");

      expect(onToggle).toHaveBeenCalledTimes(1);
    });

    it("should call onToggle when Space is pressed", async () => {
      const user = userEvent.setup();
      const onToggle = vi.fn();

      render(<ExpandableProjectCard {...defaultProps} onToggle={onToggle} />);

      const card = screen.getByRole("button", { name: /Expand test-repo/i });
      card.focus();
      await user.keyboard(" ");

      expect(onToggle).toHaveBeenCalledTimes(1);
    });

    it("should not call onToggle when GitHub link is clicked", async () => {
      const user = userEvent.setup();
      const onToggle = vi.fn();

      render(
        <ExpandableProjectCard {...defaultProps} isExpanded={true} onToggle={onToggle} />,
      );

      const githubLink = screen.getByRole("link", { name: /View test-repo on GitHub/i });
      await user.click(githubLink);

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

    it("should have accessible labels for sections", () => {
      render(<ExpandableProjectCard {...defaultProps} isExpanded={true} />);

      expect(screen.getByRole("region", { name: /Your Contribution/i })).toBeInTheDocument();
      expect(screen.getByRole("region", { name: /Project Impact/i })).toBeInTheDocument();
      expect(screen.getByRole("region", { name: /Tech Stack/i })).toBeInTheDocument();
      expect(screen.getByRole("region", { name: /Team/i })).toBeInTheDocument();
    });
  });

  describe("languages overflow", () => {
    it("should show +N more when more than 5 languages", () => {
      const manyLanguagesProject: ExpandableProject = {
        ...defaultProject,
        languages: [
          { name: "TypeScript", percent: 30 },
          { name: "JavaScript", percent: 25 },
          { name: "Python", percent: 20 },
          { name: "Go", percent: 10 },
          { name: "Rust", percent: 8 },
          { name: "Shell", percent: 5 },
          { name: "HTML", percent: 2 },
        ],
      };

      render(
        <ExpandableProjectCard
          {...defaultProps}
          project={manyLanguagesProject}
          isExpanded={true}
        />,
      );

      expect(screen.getByText("+2 more")).toBeInTheDocument();
    });
  });

  describe("team overflow", () => {
    it("should show +N badge when more than 5 team members", () => {
      const largeTeamProject: ExpandableProject = {
        ...defaultProject,
        teamCount: 10,
        topContributors: [
          { name: "Alice", avatar: "a.jpg", login: "alice" },
          { name: "Bob", avatar: "b.jpg", login: "bob" },
          { name: "Charlie", avatar: "c.jpg", login: "charlie" },
          { name: "Diana", avatar: "d.jpg", login: "diana" },
          { name: "Eve", avatar: "e.jpg", login: "eve" },
          { name: "Frank", avatar: "f.jpg", login: "frank" },
        ],
      };

      render(
        <ExpandableProjectCard
          {...defaultProps}
          project={largeTeamProject}
          isExpanded={true}
        />,
      );

      expect(screen.getByText("+5")).toBeInTheDocument();
    });
  });
});
