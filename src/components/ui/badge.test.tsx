import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Badge } from "./badge";

describe("Badge", () => {
  describe("rendering", () => {
    it("should render badge with text", () => {
      render(<Badge>Test Badge</Badge>);
      expect(screen.getByText("Test Badge")).toBeInTheDocument();
    });

    it("should have data-slot attribute", () => {
      const { container } = render(<Badge>Badge</Badge>);
      expect(
        container.querySelector('[data-slot="badge"]'),
      ).toBeInTheDocument();
    });

    it("should render as inline element", () => {
      const { container } = render(<Badge>Badge</Badge>);
      const badge = container.querySelector('[data-slot="badge"]');
      expect(badge?.tagName.toLowerCase()).toMatch(/^(span|div)$/);
    });
  });

  describe("variants", () => {
    it("should render default variant", () => {
      const { container } = render(<Badge>Default</Badge>);
      const badge = container.querySelector('[data-slot="badge"]');
      expect(badge).toBeInTheDocument();
    });

    it("should render secondary variant", () => {
      const { container } = render(
        <Badge variant="secondary">Secondary</Badge>,
      );
      const badge = container.querySelector('[data-slot="badge"]');
      expect(badge).toBeInTheDocument();
      expect(screen.getByText("Secondary")).toBeInTheDocument();
    });

    it("should render destructive variant", () => {
      const { container } = render(
        <Badge variant="destructive">Destructive</Badge>,
      );
      const badge = container.querySelector('[data-slot="badge"]');
      expect(badge).toBeInTheDocument();
      expect(screen.getByText("Destructive")).toBeInTheDocument();
    });

    it("should render outline variant", () => {
      const { container } = render(<Badge variant="outline">Outline</Badge>);
      const badge = container.querySelector('[data-slot="badge"]');
      expect(badge).toBeInTheDocument();
      expect(screen.getByText("Outline")).toBeInTheDocument();
    });
  });

  describe("asChild prop", () => {
    it("should render as child component when asChild is true", () => {
      render(
        <Badge asChild>
          <a href="#">Link Badge</a>
        </Badge>,
      );

      const link = screen.getByRole("link", { name: "Link Badge" });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute("href", "#");
    });
  });

  describe("styling", () => {
    it("should apply custom className", () => {
      const { container } = render(
        <Badge className="custom-class">Badge</Badge>,
      );
      const badge = container.querySelector('[data-slot="badge"]');
      expect(badge).toHaveClass("custom-class");
    });

    it("should merge custom className with base classes", () => {
      const { container } = render(
        <Badge variant="secondary" className="custom-class">
          Badge
        </Badge>,
      );
      const badge = container.querySelector('[data-slot="badge"]');
      expect(badge).toHaveClass("custom-class");
    });

    it("should have inline-flex display", () => {
      const { container } = render(<Badge>Badge</Badge>);
      const badge = container.querySelector('[data-slot="badge"]');
      expect(badge).toHaveClass("inline-flex");
    });

    it("should have rounded-full border radius", () => {
      const { container } = render(<Badge>Badge</Badge>);
      const badge = container.querySelector('[data-slot="badge"]');
      expect(badge).toHaveClass("rounded-full");
    });
  });

  describe("content", () => {
    it("should render with icon", () => {
      render(
        <Badge>
          <svg data-testid="icon" />
          Text
        </Badge>,
      );

      expect(screen.getByTestId("icon")).toBeInTheDocument();
      expect(screen.getByText("Text")).toBeInTheDocument();
    });

    it("should render with number", () => {
      render(<Badge>42</Badge>);
      expect(screen.getByText("42")).toBeInTheDocument();
    });

    it("should render with nested elements", () => {
      render(
        <Badge>
          <span data-testid="nested">Nested</span>
        </Badge>,
      );
      expect(screen.getByTestId("nested")).toBeInTheDocument();
    });
  });

  describe("accessibility", () => {
    it("should support aria attributes via props spread", () => {
      render(<Badge aria-label="Status badge">Active</Badge>);
      expect(screen.getByLabelText("Status badge")).toBeInTheDocument();
    });

    it("should support data attributes", () => {
      const { container } = render(
        <Badge data-testid="custom-badge">Badge</Badge>,
      );
      expect(
        container.querySelector('[data-testid="custom-badge"]'),
      ).toBeInTheDocument();
    });

    it("should support role attribute", () => {
      const { container } = render(<Badge role="status">Badge</Badge>);
      const badge = container.querySelector('[data-slot="badge"]');
      expect(badge).toHaveAttribute("role", "status");
    });
  });

  describe("edge cases", () => {
    it("should render empty badge", () => {
      const { container } = render(<Badge />);
      const badge = container.querySelector('[data-slot="badge"]');
      expect(badge).toBeInTheDocument();
    });

    it("should handle long text", () => {
      const longText = "This is a very long badge text that might wrap";
      render(<Badge>{longText}</Badge>);
      expect(screen.getByText(longText)).toBeInTheDocument();
    });

    it("should support click events", () => {
      const handleClick = vi.fn();
      render(<Badge onClick={handleClick}>Clickable</Badge>);
      const badge = screen.getByText("Clickable");
      badge.click();
      expect(handleClick).toHaveBeenCalled();
    });
  });
});
