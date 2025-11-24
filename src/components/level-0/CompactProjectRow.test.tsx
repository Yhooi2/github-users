import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { CompactProjectRow, type CompactProject } from "./CompactProjectRow";

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

describe("CompactProjectRow", () => {
  const defaultProject: CompactProject = {
    id: "1",
    name: "test-repo",
    commits: 150,
    stars: 1200,
    language: "TypeScript",
    isOwner: true,
    isFork: false,
    description: "A test repository description",
  };

  const defaultProps = {
    project: defaultProject,
    maxCommits: 500,
    onClick: vi.fn(),
    isExpanded: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("rendering", () => {
    it("should render project name", () => {
      render(<CompactProjectRow {...defaultProps} />);

      expect(screen.getByText("test-repo")).toBeInTheDocument();
    });

    it("should render commits count", () => {
      render(<CompactProjectRow {...defaultProps} />);

      expect(screen.getByText("150c")).toBeInTheDocument();
    });

    it("should render stars count", () => {
      render(<CompactProjectRow {...defaultProps} />);

      expect(screen.getByText("1.2K")).toBeInTheDocument();
    });

    it("should render language name", () => {
      render(<CompactProjectRow {...defaultProps} />);

      expect(screen.getByText("TypeScript")).toBeInTheDocument();
    });

    it("should not render Fork badge for non-forked projects", () => {
      render(<CompactProjectRow {...defaultProps} />);

      expect(screen.queryByText("Fork")).not.toBeInTheDocument();
    });

    it("should render Fork badge for forked projects", () => {
      render(
        <CompactProjectRow
          {...defaultProps}
          project={{ ...defaultProject, isFork: true }}
        />,
      );

      expect(screen.getByText("Fork")).toBeInTheDocument();
    });
  });

  describe("interactions", () => {
    it("should call onClick when clicked", async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();

      render(<CompactProjectRow {...defaultProps} onClick={onClick} />);

      await user.click(screen.getByRole("button"));

      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it("should call onClick when Enter key is pressed", async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();

      render(<CompactProjectRow {...defaultProps} onClick={onClick} />);

      const button = screen.getByRole("button");
      button.focus();
      await user.keyboard("{Enter}");

      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it("should call onClick when Space key is pressed", async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();

      render(<CompactProjectRow {...defaultProps} onClick={onClick} />);

      const button = screen.getByRole("button");
      button.focus();
      await user.keyboard(" ");

      expect(onClick).toHaveBeenCalledTimes(1);
    });
  });

  describe("accessibility", () => {
    it("should have role button", () => {
      render(<CompactProjectRow {...defaultProps} />);

      expect(screen.getByRole("button")).toBeInTheDocument();
    });

    it("should have aria-label with project name", () => {
      render(<CompactProjectRow {...defaultProps} />);

      expect(screen.getByRole("button")).toHaveAttribute(
        "aria-label",
        "Expand test-repo details",
      );
    });

    it("should have aria-expanded false when not expanded", () => {
      render(<CompactProjectRow {...defaultProps} isExpanded={false} />);

      expect(screen.getByRole("button")).toHaveAttribute(
        "aria-expanded",
        "false",
      );
    });

    it("should have aria-expanded true when expanded", () => {
      render(<CompactProjectRow {...defaultProps} isExpanded={true} />);

      expect(screen.getByRole("button")).toHaveAttribute(
        "aria-expanded",
        "true",
      );
    });

    it("should be focusable", () => {
      render(<CompactProjectRow {...defaultProps} />);

      expect(screen.getByRole("button")).toHaveAttribute("tabIndex", "0");
    });
  });

  describe("edge cases", () => {
    it("should handle project without description", () => {
      const projectWithoutDescription = { ...defaultProject };
      delete projectWithoutDescription.description;

      render(
        <CompactProjectRow
          {...defaultProps}
          project={projectWithoutDescription}
        />,
      );

      expect(screen.getByText("test-repo")).toBeInTheDocument();
    });

    it("should handle project without language", () => {
      render(
        <CompactProjectRow
          {...defaultProps}
          project={{ ...defaultProject, language: "" }}
        />,
      );

      expect(screen.getByText("test-repo")).toBeInTheDocument();
      expect(screen.queryByText("TypeScript")).not.toBeInTheDocument();
    });

    it("should format large numbers correctly", () => {
      render(
        <CompactProjectRow
          {...defaultProps}
          project={{ ...defaultProject, stars: 158000 }}
        />,
      );

      expect(screen.getByText("158K")).toBeInTheDocument();
    });
  });
});
