import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { LoadingState } from "./LoadingState";

describe("LoadingState", () => {
  describe("rendering", () => {
    it("should render with default variant", () => {
      render(<LoadingState />);
      expect(screen.getByRole("status")).toBeInTheDocument();
      expect(screen.getByLabelText("Loading")).toBeInTheDocument();
    });

    it("should render with card variant", () => {
      render(<LoadingState variant="card" />);
      expect(screen.getByRole("status")).toBeInTheDocument();
    });

    it("should render with profile variant", () => {
      render(<LoadingState variant="profile" />);
      expect(screen.getByRole("status")).toBeInTheDocument();
    });

    it("should render with list variant", () => {
      render(<LoadingState variant="list" />);
      expect(screen.getByRole("status")).toBeInTheDocument();
    });
  });

  describe("message display", () => {
    it("should display custom message when provided", () => {
      const message = "Loading user data...";
      render(<LoadingState message={message} />);

      expect(screen.getByText(message)).toBeInTheDocument();
      expect(screen.getByText(message)).toHaveClass("text-muted-foreground");
    });

    it("should not display message when not provided", () => {
      render(<LoadingState />);

      // Should only have the sr-only text
      expect(screen.queryByText(/Loading/)).toHaveClass("sr-only");
    });

    it("should display message with card variant", () => {
      const message = "Fetching repository information...";
      render(<LoadingState variant="card" message={message} />);

      expect(screen.getByText(message)).toBeInTheDocument();
    });

    it("should display message with profile variant", () => {
      const message = "Loading GitHub profile...";
      render(<LoadingState variant="profile" message={message} />);

      expect(screen.getByText(message)).toBeInTheDocument();
    });

    it("should display message with list variant", () => {
      const message = "Loading repositories...";
      render(<LoadingState variant="list" message={message} />);

      expect(screen.getByText(message)).toBeInTheDocument();
    });
  });

  describe("list variant count", () => {
    it("should render default count of 3 items", () => {
      const { container } = render(<LoadingState variant="list" />);

      // Find all list items (divs with flex gap-4 p-4)
      const listItems = container.querySelectorAll(".space-y-3 > div");
      expect(listItems).toHaveLength(3);
    });

    it("should render custom count of items", () => {
      const { container } = render(<LoadingState variant="list" count={5} />);

      const listItems = container.querySelectorAll(".space-y-3 > div");
      expect(listItems).toHaveLength(5);
    });

    it("should render single item", () => {
      const { container } = render(<LoadingState variant="list" count={1} />);

      const listItems = container.querySelectorAll(".space-y-3 > div");
      expect(listItems).toHaveLength(1);
    });

    it("should render many items", () => {
      const { container } = render(<LoadingState variant="list" count={10} />);

      const listItems = container.querySelectorAll(".space-y-3 > div");
      expect(listItems).toHaveLength(10);
    });

    it("should ignore count for non-list variants", () => {
      const { container: defaultContainer } = render(
        <LoadingState count={10} />,
      );
      const { container: cardContainer } = render(
        <LoadingState variant="card" count={10} />,
      );
      const { container: profileContainer } = render(
        <LoadingState variant="profile" count={10} />,
      );

      // Should not render multiple list items for non-list variants
      // List variant uses .space-y-3 > div with flex gap-4 p-4
      expect(defaultContainer.querySelectorAll(".flex.gap-4.p-4")).toHaveLength(
        0,
      );
      expect(cardContainer.querySelectorAll(".flex.gap-4.p-4")).toHaveLength(0);
      expect(profileContainer.querySelectorAll(".flex.gap-4.p-4")).toHaveLength(
        0,
      );
    });
  });

  describe("accessibility", () => {
    it('should have role="status"', () => {
      render(<LoadingState />);
      expect(screen.getByRole("status")).toBeInTheDocument();
    });

    it("should have aria-label", () => {
      render(<LoadingState />);
      expect(screen.getByLabelText("Loading")).toBeInTheDocument();
    });

    it("should have screen reader text", () => {
      render(<LoadingState />);
      expect(screen.getByText("Loading content...")).toHaveClass("sr-only");
    });

    it("should maintain accessibility attributes with all variants", () => {
      const variants = ["default", "card", "profile", "list"] as const;

      variants.forEach((variant) => {
        const { unmount } = render(<LoadingState variant={variant} />);
        expect(screen.getByRole("status")).toBeInTheDocument();
        expect(screen.getByLabelText("Loading")).toBeInTheDocument();
        unmount();
      });
    });
  });

  describe("variant rendering", () => {
    it("should render different structure for each variant", () => {
      const { container: defaultContainer } = render(
        <LoadingState variant="default" />,
      );
      const { container: cardContainer } = render(
        <LoadingState variant="card" />,
      );
      const { container: profileContainer } = render(
        <LoadingState variant="profile" />,
      );
      const { container: listContainer } = render(
        <LoadingState variant="list" />,
      );

      // Each variant should have unique structure
      expect(defaultContainer.innerHTML).not.toBe(cardContainer.innerHTML);
      expect(cardContainer.innerHTML).not.toBe(profileContainer.innerHTML);
      expect(profileContainer.innerHTML).not.toBe(listContainer.innerHTML);
    });
  });
});
