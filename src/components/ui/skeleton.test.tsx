import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Skeleton } from "./skeleton";

describe("Skeleton", () => {
  describe("rendering", () => {
    it("should render skeleton element", () => {
      const { container } = render(<Skeleton />);

      const skeleton = container.querySelector('[data-slot="skeleton"]');
      expect(skeleton).toBeInTheDocument();
    });

    it("should render with custom content", () => {
      const { container } = render(<Skeleton>Loading...</Skeleton>);

      const skeleton = container.querySelector('[data-slot="skeleton"]');
      expect(skeleton).toHaveTextContent("Loading...");
    });

    it("should render multiple skeletons", () => {
      const { container } = render(
        <div>
          <Skeleton />
          <Skeleton />
          <Skeleton />
        </div>,
      );

      const skeletons = container.querySelectorAll('[data-slot="skeleton"]');
      expect(skeletons).toHaveLength(3);
    });
  });

  describe("styling", () => {
    it("should have default skeleton classes", () => {
      const { container } = render(<Skeleton />);

      const skeleton = container.querySelector('[data-slot="skeleton"]');
      expect(skeleton).toHaveClass("bg-accent");
      expect(skeleton).toHaveClass("animate-pulse");
      expect(skeleton).toHaveClass("rounded-md");
    });

    it("should apply custom className", () => {
      const { container } = render(<Skeleton className="h-4 w-[250px]" />);

      const skeleton = container.querySelector('[data-slot="skeleton"]');
      expect(skeleton).toHaveClass("h-4");
      expect(skeleton).toHaveClass("w-[250px]");
    });

    it("should apply rounded-full for circular skeleton", () => {
      const { container } = render(
        <Skeleton className="h-12 w-12 rounded-full" />,
      );

      const skeleton = container.querySelector('[data-slot="skeleton"]');
      expect(skeleton).toHaveClass("rounded-full");
    });

    it("should merge custom classes with defaults", () => {
      const { container } = render(<Skeleton className="custom-class" />);

      const skeleton = container.querySelector('[data-slot="skeleton"]');
      expect(skeleton).toHaveClass("custom-class");
      expect(skeleton).toHaveClass("bg-accent");
      expect(skeleton).toHaveClass("animate-pulse");
    });
  });

  describe("accessibility", () => {
    it("should be a div element", () => {
      const { container } = render(<Skeleton />);

      const skeleton = container.querySelector('[data-slot="skeleton"]');
      expect(skeleton?.tagName.toLowerCase()).toBe("div");
    });

    it("should support aria attributes via props spread", () => {
      const { container } = render(<Skeleton aria-label="Loading content" />);

      const skeleton = container.querySelector('[data-slot="skeleton"]');
      expect(skeleton).toHaveAttribute("aria-label", "Loading content");
    });

    it("should support data attributes via props spread", () => {
      const { container } = render(<Skeleton data-testid="custom-skeleton" />);

      expect(
        container.querySelector('[data-testid="custom-skeleton"]'),
      ).toBeInTheDocument();
    });

    it("should support role attribute", () => {
      const { container } = render(<Skeleton role="status" />);

      const skeleton = container.querySelector('[data-slot="skeleton"]');
      expect(skeleton).toHaveAttribute("role", "status");
    });
  });

  describe("edge cases", () => {
    it("should render without any props", () => {
      const { container } = render(<Skeleton />);

      const skeleton = container.querySelector('[data-slot="skeleton"]');
      expect(skeleton).toBeInTheDocument();
    });

    it("should handle nested content", () => {
      const { container } = render(
        <Skeleton>
          <span data-testid="nested">Nested content</span>
        </Skeleton>,
      );

      expect(
        container.querySelector('[data-testid="nested"]'),
      ).toBeInTheDocument();
    });

    it("should support inline styles", () => {
      const { container } = render(
        <Skeleton style={{ width: "200px", height: "20px" }} />,
      );

      const skeleton = container.querySelector('[data-slot="skeleton"]');
      expect(skeleton).toHaveStyle({ width: "200px", height: "20px" });
    });
  });

  describe("common use cases", () => {
    it("should render line skeleton", () => {
      const { container } = render(<Skeleton className="h-4 w-full" />);

      const skeleton = container.querySelector('[data-slot="skeleton"]');
      expect(skeleton).toHaveClass("h-4");
      expect(skeleton).toHaveClass("w-full");
    });

    it("should render avatar skeleton", () => {
      const { container } = render(
        <Skeleton className="h-12 w-12 rounded-full" />,
      );

      const skeleton = container.querySelector('[data-slot="skeleton"]');
      expect(skeleton).toHaveClass("h-12");
      expect(skeleton).toHaveClass("w-12");
      expect(skeleton).toHaveClass("rounded-full");
    });

    it("should render card skeleton structure", () => {
      const { container } = render(
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>,
      );

      const skeletons = container.querySelectorAll('[data-slot="skeleton"]');
      expect(skeletons).toHaveLength(3);
    });
  });
});
