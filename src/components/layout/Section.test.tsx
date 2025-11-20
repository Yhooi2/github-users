import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Section } from "./Section";

describe("Section", () => {
  describe("rendering", () => {
    it("should render children", () => {
      render(
        <Section>
          <div>Test content</div>
        </Section>,
      );

      expect(screen.getByText("Test content")).toBeInTheDocument();
    });

    it("should render with title", () => {
      render(
        <Section title="Test Title">
          <div>Content</div>
        </Section>,
      );

      expect(screen.getByText("Test Title")).toBeInTheDocument();
      expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
        "Test Title",
      );
    });

    it("should render with description", () => {
      render(
        <Section title="Title" description="Test description">
          <div>Content</div>
        </Section>,
      );

      expect(screen.getByText("Test description")).toBeInTheDocument();
    });

    it("should render with both title and description", () => {
      render(
        <Section title="Title" description="Description">
          <div>Content</div>
        </Section>,
      );

      expect(screen.getByText("Title")).toBeInTheDocument();
      expect(screen.getByText("Description")).toBeInTheDocument();
    });

    it("should render without title and description", () => {
      render(
        <Section>
          <div>Content</div>
        </Section>,
      );

      expect(screen.getByText("Content")).toBeInTheDocument();
      expect(screen.queryByRole("heading")).not.toBeInTheDocument();
    });
  });

  describe("separator", () => {
    it("should show separator by default when title is present", () => {
      const { container } = render(
        <Section title="Title">
          <div>Content</div>
        </Section>,
      );

      // Separator has data-orientation="horizontal"
      const separator = container.querySelector(
        '[data-orientation="horizontal"]',
      );
      expect(separator).toBeInTheDocument();
    });

    it("should hide separator when showSeparator is false", () => {
      const { container } = render(
        <Section title="Title" showSeparator={false}>
          <div>Content</div>
        </Section>,
      );

      const separator = container.querySelector(
        '[data-orientation="horizontal"]',
      );
      expect(separator).not.toBeInTheDocument();
    });

    it("should not render separator when no title is present", () => {
      const { container } = render(
        <Section>
          <div>Content</div>
        </Section>,
      );

      const separator = container.querySelector(
        '[data-orientation="horizontal"]',
      );
      expect(separator).not.toBeInTheDocument();
    });

    it("should show separator when only description is present", () => {
      const { container } = render(
        <Section description="Description only">
          <div>Content</div>
        </Section>,
      );

      const separator = container.querySelector(
        '[data-orientation="horizontal"]',
      );
      expect(separator).toBeInTheDocument();
    });
  });

  describe("className", () => {
    it("should apply default className", () => {
      const { container } = render(
        <Section>
          <div>Content</div>
        </Section>,
      );

      const section = container.querySelector("section");
      expect(section).toHaveClass("space-y-4");
    });

    it("should apply custom className", () => {
      const { container } = render(
        <Section className="custom-class">
          <div>Content</div>
        </Section>,
      );

      const section = container.querySelector("section");
      expect(section).toHaveClass("space-y-4", "custom-class");
    });

    it("should merge custom className with default", () => {
      const { container } = render(
        <Section className="bg-accent p-6">
          <div>Content</div>
        </Section>,
      );

      const section = container.querySelector("section");
      expect(section).toHaveClass("space-y-4", "p-6", "bg-accent");
    });

    it("should handle empty custom className", () => {
      const { container } = render(
        <Section className="">
          <div>Content</div>
        </Section>,
      );

      const section = container.querySelector("section");
      expect(section).toHaveClass("space-y-4");
    });
  });

  describe("header structure", () => {
    it("should render header div when title is present", () => {
      const { container } = render(
        <Section title="Title">
          <div>Content</div>
        </Section>,
      );

      const header = container.querySelector(".space-y-1");
      expect(header).toBeInTheDocument();
    });

    it("should render header div when description is present", () => {
      const { container } = render(
        <Section description="Description">
          <div>Content</div>
        </Section>,
      );

      const header = container.querySelector(".space-y-1");
      expect(header).toBeInTheDocument();
    });

    it("should not render header div when no title or description", () => {
      const { container } = render(
        <Section>
          <div>Content</div>
        </Section>,
      );

      const header = container.querySelector(".space-y-1");
      expect(header).not.toBeInTheDocument();
    });
  });

  describe("semantic HTML", () => {
    it("should use section element", () => {
      const { container } = render(
        <Section>
          <div>Content</div>
        </Section>,
      );

      expect(container.querySelector("section")).toBeInTheDocument();
    });

    it("should use h2 for title", () => {
      render(
        <Section title="Title">
          <div>Content</div>
        </Section>,
      );

      const heading = screen.getByRole("heading", { level: 2 });
      expect(heading).toBeInTheDocument();
      expect(heading.tagName).toBe("H2");
    });

    it("should use paragraph for description", () => {
      const { container } = render(
        <Section title="Title" description="Description">
          <div>Content</div>
        </Section>,
      );

      const description = container.querySelector("p");
      expect(description).toBeInTheDocument();
      expect(description).toHaveTextContent("Description");
    });
  });

  describe("styling", () => {
    it("should apply correct title styles", () => {
      render(
        <Section title="Title">
          <div>Content</div>
        </Section>,
      );

      const heading = screen.getByRole("heading", { level: 2 });
      expect(heading).toHaveClass(
        "text-2xl",
        "font-semibold",
        "tracking-tight",
      );
    });

    it("should apply correct description styles", () => {
      const { container } = render(
        <Section title="Title" description="Description">
          <div>Content</div>
        </Section>,
      );

      const description = container.querySelector("p");
      expect(description).toHaveClass("text-sm", "text-muted-foreground");
    });
  });

  describe("children rendering", () => {
    it("should render string children", () => {
      render(<Section>Plain text content</Section>);
      expect(screen.getByText("Plain text content")).toBeInTheDocument();
    });

    it("should render multiple children", () => {
      render(
        <Section>
          <div>First child</div>
          <div>Second child</div>
          <div>Third child</div>
        </Section>,
      );

      expect(screen.getByText("First child")).toBeInTheDocument();
      expect(screen.getByText("Second child")).toBeInTheDocument();
      expect(screen.getByText("Third child")).toBeInTheDocument();
    });

    it("should render complex children", () => {
      render(
        <Section title="Complex">
          <div>
            <span>Nested</span>
            <button>Button</button>
          </div>
        </Section>,
      );

      expect(screen.getByText("Nested")).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Button" }),
      ).toBeInTheDocument();
    });
  });
});
