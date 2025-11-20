import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { EmptyState } from "./EmptyState";

describe("EmptyState", () => {
  describe("rendering", () => {
    it("should render with required props", () => {
      render(
        <EmptyState title="Empty Title" description="Empty description" />,
      );

      expect(screen.getByRole("status")).toBeInTheDocument();
      expect(screen.getByLabelText("Empty state")).toBeInTheDocument();
      expect(screen.getByText("Empty Title")).toBeInTheDocument();
      expect(screen.getByText("Empty description")).toBeInTheDocument();
    });

    it("should render with all props", () => {
      const handleAction = vi.fn();
      const handleSecondaryAction = vi.fn();

      render(
        <EmptyState
          title="Test Title"
          description="Test description"
          icon="search"
          onAction={handleAction}
          actionText="Primary"
          onSecondaryAction={handleSecondaryAction}
          secondaryActionText="Secondary"
        />,
      );

      expect(screen.getByText("Test Title")).toBeInTheDocument();
      expect(screen.getByText("Test description")).toBeInTheDocument();
      expect(screen.getByText("Primary")).toBeInTheDocument();
      expect(screen.getByText("Secondary")).toBeInTheDocument();
    });
  });

  describe("icons", () => {
    it("should render inbox icon by default", () => {
      const { container } = render(
        <EmptyState title="Test" description="Test description" />,
      );

      const svg = container.querySelector("svg");
      expect(svg).toBeInTheDocument();
      expect(svg).toHaveAttribute("aria-hidden", "true");
    });

    it("should render search icon", () => {
      const { container } = render(
        <EmptyState title="Test" description="Test" icon="search" />,
      );

      expect(container.querySelector("svg")).toBeInTheDocument();
    });

    it("should render question icon", () => {
      const { container } = render(
        <EmptyState title="Test" description="Test" icon="question" />,
      );

      expect(container.querySelector("svg")).toBeInTheDocument();
    });

    it("should render folder icon", () => {
      const { container } = render(
        <EmptyState title="Test" description="Test" icon="folder" />,
      );

      expect(container.querySelector("svg")).toBeInTheDocument();
    });

    it("should render database icon", () => {
      const { container } = render(
        <EmptyState title="Test" description="Test" icon="database" />,
      );

      expect(container.querySelector("svg")).toBeInTheDocument();
    });

    it("should render user icon", () => {
      const { container } = render(
        <EmptyState title="Test" description="Test" icon="user" />,
      );

      expect(container.querySelector("svg")).toBeInTheDocument();
    });

    it("should render all icon variants", () => {
      const icons: Array<
        "search" | "question" | "inbox" | "folder" | "database" | "user"
      > = ["search", "question", "inbox", "folder", "database", "user"];

      icons.forEach((icon) => {
        const { container, unmount } = render(
          <EmptyState title="Test" description="Test" icon={icon} />,
        );
        expect(container.querySelector("svg")).toBeInTheDocument();
        unmount();
      });
    });
  });

  describe("actions", () => {
    it("should render primary action button", () => {
      const handleAction = vi.fn();
      render(
        <EmptyState
          title="Test"
          description="Test"
          onAction={handleAction}
          actionText="Click Me"
        />,
      );

      expect(screen.getByText("Click Me")).toBeInTheDocument();
    });

    it("should call onAction when primary button is clicked", async () => {
      const user = userEvent.setup();
      const handleAction = vi.fn();
      render(
        <EmptyState title="Test" description="Test" onAction={handleAction} />,
      );

      await user.click(screen.getByLabelText("Primary action"));
      expect(handleAction).toHaveBeenCalledTimes(1);
    });

    it("should render secondary action button", () => {
      const handleSecondaryAction = vi.fn();
      render(
        <EmptyState
          title="Test"
          description="Test"
          onSecondaryAction={handleSecondaryAction}
          secondaryActionText="Secondary"
        />,
      );

      expect(screen.getByText("Secondary")).toBeInTheDocument();
    });

    it("should call onSecondaryAction when secondary button is clicked", async () => {
      const user = userEvent.setup();
      const handleSecondaryAction = vi.fn();
      render(
        <EmptyState
          title="Test"
          description="Test"
          onSecondaryAction={handleSecondaryAction}
        />,
      );

      await user.click(screen.getByLabelText("Secondary action"));
      expect(handleSecondaryAction).toHaveBeenCalledTimes(1);
    });

    it("should render both action buttons", () => {
      const handleAction = vi.fn();
      const handleSecondaryAction = vi.fn();
      render(
        <EmptyState
          title="Test"
          description="Test"
          onAction={handleAction}
          actionText="Primary"
          onSecondaryAction={handleSecondaryAction}
          secondaryActionText="Secondary"
        />,
      );

      expect(screen.getByText("Primary")).toBeInTheDocument();
      expect(screen.getByText("Secondary")).toBeInTheDocument();
    });

    it("should call correct handlers when buttons are clicked", async () => {
      const user = userEvent.setup();
      const handleAction = vi.fn();
      const handleSecondaryAction = vi.fn();
      render(
        <EmptyState
          title="Test"
          description="Test"
          onAction={handleAction}
          onSecondaryAction={handleSecondaryAction}
        />,
      );

      await user.click(screen.getByLabelText("Primary action"));
      expect(handleAction).toHaveBeenCalledTimes(1);
      expect(handleSecondaryAction).not.toHaveBeenCalled();

      await user.click(screen.getByLabelText("Secondary action"));
      expect(handleSecondaryAction).toHaveBeenCalledTimes(1);
      expect(handleAction).toHaveBeenCalledTimes(1); // still 1
    });

    it("should not render action buttons when callbacks are not provided", () => {
      render(<EmptyState title="Test" description="Test" />);

      expect(screen.queryByLabelText("Primary action")).not.toBeInTheDocument();
      expect(
        screen.queryByLabelText("Secondary action"),
      ).not.toBeInTheDocument();
    });

    it("should render default action text", () => {
      const handleAction = vi.fn();
      render(
        <EmptyState title="Test" description="Test" onAction={handleAction} />,
      );

      expect(screen.getByText("Take Action")).toBeInTheDocument();
    });

    it("should render default secondary action text", () => {
      const handleSecondaryAction = vi.fn();
      render(
        <EmptyState
          title="Test"
          description="Test"
          onSecondaryAction={handleSecondaryAction}
        />,
      );

      expect(screen.getByText("Learn More")).toBeInTheDocument();
    });

    it("should render custom action text", () => {
      const handleAction = vi.fn();
      render(
        <EmptyState
          title="Test"
          description="Test"
          onAction={handleAction}
          actionText="Custom Action"
        />,
      );

      expect(screen.getByText("Custom Action")).toBeInTheDocument();
    });

    it("should render custom secondary action text", () => {
      const handleSecondaryAction = vi.fn();
      render(
        <EmptyState
          title="Test"
          description="Test"
          onSecondaryAction={handleSecondaryAction}
          secondaryActionText="Custom Secondary"
        />,
      );

      expect(screen.getByText("Custom Secondary")).toBeInTheDocument();
    });
  });

  describe("accessibility", () => {
    it('should have role="status"', () => {
      render(<EmptyState title="Test" description="Test" />);
      expect(screen.getByRole("status")).toBeInTheDocument();
    });

    it("should have aria-label", () => {
      render(<EmptyState title="Test" description="Test" />);
      expect(screen.getByLabelText("Empty state")).toBeInTheDocument();
    });

    it("should have aria-hidden on icon", () => {
      const { container } = render(
        <EmptyState title="Test" description="Test" />,
      );
      const svg = container.querySelector("svg");
      expect(svg).toHaveAttribute("aria-hidden", "true");
    });

    it("should have aria-label on primary action button", () => {
      const handleAction = vi.fn();
      render(
        <EmptyState title="Test" description="Test" onAction={handleAction} />,
      );

      expect(screen.getByLabelText("Primary action")).toBeInTheDocument();
    });

    it("should have aria-label on secondary action button", () => {
      const handleSecondaryAction = vi.fn();
      render(
        <EmptyState
          title="Test"
          description="Test"
          onSecondaryAction={handleSecondaryAction}
        />,
      );

      expect(screen.getByLabelText("Secondary action")).toBeInTheDocument();
    });

    it("should have proper heading structure", () => {
      render(<EmptyState title="Test Title" description="Test" />);

      const heading = screen.getByRole("heading", { level: 3 });
      expect(heading).toHaveTextContent("Test Title");
    });
  });

  describe("layout and styling", () => {
    it("should center content", () => {
      const { container } = render(
        <EmptyState title="Test" description="Test" />,
      );

      const wrapper = container.querySelector('[role="status"]');
      expect(wrapper).toHaveClass(
        "flex",
        "flex-col",
        "items-center",
        "justify-center",
      );
    });

    it("should have proper text styling", () => {
      render(<EmptyState title="Test Title" description="Test Description" />);

      const title = screen.getByText("Test Title");
      const description = screen.getByText("Test Description");

      expect(title).toHaveClass("text-xl", "font-semibold");
      expect(description).toHaveClass("text-muted-foreground", "text-sm");
    });
  });
});
