import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { CompactProject } from "./CompactProjectRow";
import { ProjectListContainer } from "./ProjectListContainer";

// Mock useResponsive hook
vi.mock("@/hooks", () => ({
  useResponsive: vi.fn(() => ({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    breakpoint: "desktop",
    width: 1440,
  })),
}));

describe("ProjectListContainer", () => {
  const ownedProject: CompactProject = {
    id: "1",
    name: "my-project",
    commits: 150,
    stars: 100,
    language: "TypeScript",
    isOwner: true,
    description: "My project description",
  };

  const contributedProject: CompactProject = {
    id: "2",
    name: "open-source-lib",
    commits: 42,
    stars: 5000,
    language: "JavaScript",
    isOwner: false,
    description: "An open source library",
  };

  const defaultProps = {
    projects: [ownedProject, contributedProject],
    year: 2024,
    sortBy: "commits" as const,
    onSortChange: vi.fn(),
    onProjectClick: vi.fn(),
    expandedProjects: new Set<string>(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("rendering", () => {
    it("should render header with year", () => {
      render(<ProjectListContainer {...defaultProps} />);

      expect(
        screen.getByText("Projects & Contributions (2024)"),
      ).toBeInTheDocument();
    });

    it("should render Your Projects section", () => {
      render(<ProjectListContainer {...defaultProps} />);

      expect(screen.getByText("Your Projects (1)")).toBeInTheDocument();
    });

    it("should render Contributions section", () => {
      render(<ProjectListContainer {...defaultProps} />);

      expect(screen.getByText("Contributions (1)")).toBeInTheDocument();
    });

    it("should render project names", () => {
      render(<ProjectListContainer {...defaultProps} />);

      expect(screen.getByText("my-project")).toBeInTheDocument();
      expect(screen.getByText("open-source-lib")).toBeInTheDocument();
    });

    it("should render sort button with current sort", () => {
      render(<ProjectListContainer {...defaultProps} sortBy="commits" />);

      expect(screen.getByText("Commits")).toBeInTheDocument();
    });
  });

  describe("empty state", () => {
    it("should render empty state when no projects", () => {
      render(<ProjectListContainer {...defaultProps} projects={[]} />);

      expect(screen.getByText("No activity in 2024")).toBeInTheDocument();
    });

    it("should render empty state description", () => {
      render(<ProjectListContainer {...defaultProps} projects={[]} />);

      expect(
        screen.getByText("No projects or contributions found for this year"),
      ).toBeInTheDocument();
    });
  });

  describe("grouping", () => {
    it("should only show Your Projects when no contributions", () => {
      render(
        <ProjectListContainer {...defaultProps} projects={[ownedProject]} />,
      );

      expect(screen.getByText("Your Projects (1)")).toBeInTheDocument();
      // Check that "Contributions (N)" section header does not exist
      expect(screen.queryByRole("heading", { name: /Contributions \(\d+\)/ })).not.toBeInTheDocument();
    });

    it("should only show Contributions when no owned projects", () => {
      render(
        <ProjectListContainer
          {...defaultProps}
          projects={[contributedProject]}
        />,
      );

      expect(screen.getByText("Contributions (1)")).toBeInTheDocument();
      expect(screen.queryByText(/Your Projects/)).not.toBeInTheDocument();
    });
  });

  describe("sorting", () => {
    it("should call onSortChange when clicking sort option", async () => {
      const user = userEvent.setup();
      const onSortChange = vi.fn();

      render(
        <ProjectListContainer {...defaultProps} onSortChange={onSortChange} />,
      );

      // Click to open dropdown
      await user.click(screen.getByText("Commits"));

      // Click Stars option
      await user.click(screen.getByRole("menuitem", { name: "Stars" }));

      expect(onSortChange).toHaveBeenCalledWith("stars");
    });

    it("should sort projects by commits (descending)", () => {
      const projects: CompactProject[] = [
        { ...ownedProject, id: "a", name: "project-a", commits: 50, isOwner: true },
        { ...ownedProject, id: "b", name: "project-b", commits: 150, isOwner: true },
        { ...ownedProject, id: "c", name: "project-c", commits: 100, isOwner: true },
      ];

      render(
        <ProjectListContainer
          {...defaultProps}
          projects={projects}
          sortBy="commits"
        />,
      );

      // Get project buttons (exclude dropdown trigger)
      const projectButtons = screen.getAllByRole("button", { name: /Expand/ });
      // Projects should be rendered in order: 150 (b), 100 (c), 50 (a)
      expect(projectButtons[0]).toHaveAttribute(
        "aria-label",
        expect.stringContaining("project-b"),
      );
      expect(projectButtons[1]).toHaveAttribute(
        "aria-label",
        expect.stringContaining("project-c"),
      );
      expect(projectButtons[2]).toHaveAttribute(
        "aria-label",
        expect.stringContaining("project-a"),
      );
    });
  });

  describe("interactions", () => {
    it("should call onProjectClick when clicking a project", async () => {
      const user = userEvent.setup();
      const onProjectClick = vi.fn();

      render(
        <ProjectListContainer
          {...defaultProps}
          onProjectClick={onProjectClick}
        />,
      );

      // Click on project row
      await user.click(screen.getByRole("button", { name: /Expand my-project/ }));

      expect(onProjectClick).toHaveBeenCalledWith("1");
    });

    it("should show expanded state for expanded projects", () => {
      render(
        <ProjectListContainer
          {...defaultProps}
          expandedProjects={new Set(["1"])}
        />,
      );

      const expandedButton = screen.getByRole("button", {
        name: /Expand my-project/,
      });
      expect(expandedButton).toHaveAttribute("aria-expanded", "true");
    });
  });

  describe("accessibility", () => {
    it("should have accessible section headings", () => {
      render(<ProjectListContainer {...defaultProps} />);

      expect(
        screen.getByRole("heading", { name: /Your Projects/ }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("heading", { name: /Contributions/ }),
      ).toBeInTheDocument();
    });
  });
});
