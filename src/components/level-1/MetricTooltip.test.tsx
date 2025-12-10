import { TooltipProvider } from "@/components/ui/tooltip";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MetricTooltip } from "./MetricTooltip";

// Helper to wrap component with TooltipProvider
const renderWithTooltip = (ui: React.ReactElement) => {
  return render(<TooltipProvider>{ui}</TooltipProvider>);
};

describe("MetricTooltip", () => {
  describe("rendering", () => {
    it("renders children content", () => {
      renderWithTooltip(
        <MetricTooltip content="Tooltip text">
          <span>Child content</span>
        </MetricTooltip>,
      );

      expect(screen.getByText("Child content")).toBeInTheDocument();
    });

    it("renders complex children", () => {
      renderWithTooltip(
        <MetricTooltip content="Tooltip text">
          <div>
            <span>1.2k</span>
            <span>stars</span>
          </div>
        </MetricTooltip>,
      );

      expect(screen.getByText("1.2k")).toBeInTheDocument();
      expect(screen.getByText("stars")).toBeInTheDocument();
    });
  });

  describe("trigger element", () => {
    it("renders trigger with cursor-help class", () => {
      const { container } = renderWithTooltip(
        <MetricTooltip content="This is tooltip content">
          <span>Hover me</span>
        </MetricTooltip>,
      );

      const trigger = container.querySelector(".cursor-help");
      expect(trigger).toBeInTheDocument();
    });

    it("trigger contains children text", () => {
      renderWithTooltip(
        <MetricTooltip content="Tooltip content">
          <span>Trigger Text</span>
        </MetricTooltip>,
      );

      expect(screen.getByText("Trigger Text")).toBeInTheDocument();
    });
  });

  describe("side prop", () => {
    it("uses top position by default", () => {
      renderWithTooltip(
        <MetricTooltip content="Tooltip">
          <span>Content</span>
        </MetricTooltip>,
      );

      // Default is top - just verify it renders without error
      expect(screen.getByText("Content")).toBeInTheDocument();
    });

    it("accepts side='bottom'", () => {
      renderWithTooltip(
        <MetricTooltip content="Tooltip" side="bottom">
          <span>Content</span>
        </MetricTooltip>,
      );

      expect(screen.getByText("Content")).toBeInTheDocument();
    });

    it("accepts side='left'", () => {
      renderWithTooltip(
        <MetricTooltip content="Tooltip" side="left">
          <span>Content</span>
        </MetricTooltip>,
      );

      expect(screen.getByText("Content")).toBeInTheDocument();
    });

    it("accepts side='right'", () => {
      renderWithTooltip(
        <MetricTooltip content="Tooltip" side="right">
          <span>Content</span>
        </MetricTooltip>,
      );

      expect(screen.getByText("Content")).toBeInTheDocument();
    });
  });

  describe("underline prop", () => {
    it("applies underline styles by default", () => {
      const { container } = renderWithTooltip(
        <MetricTooltip content="Tooltip">
          <span>Content</span>
        </MetricTooltip>,
      );

      const trigger = container.querySelector(".underline");
      expect(trigger).toBeInTheDocument();
    });

    it("applies dotted underline decoration", () => {
      const { container } = renderWithTooltip(
        <MetricTooltip content="Tooltip">
          <span>Content</span>
        </MetricTooltip>,
      );

      const trigger = container.querySelector(".decoration-dotted");
      expect(trigger).toBeInTheDocument();
    });

    it("does not apply underline when underline=false", () => {
      const { container } = renderWithTooltip(
        <MetricTooltip content="Tooltip" underline={false}>
          <span>Content</span>
        </MetricTooltip>,
      );

      const trigger = container.querySelector(".underline");
      expect(trigger).not.toBeInTheDocument();
    });

    it("applies underline when underline=true explicitly", () => {
      const { container } = renderWithTooltip(
        <MetricTooltip content="Tooltip" underline={true}>
          <span>Content</span>
        </MetricTooltip>,
      );

      const trigger = container.querySelector(".underline");
      expect(trigger).toBeInTheDocument();
    });
  });

  describe("className prop", () => {
    it("applies custom className", () => {
      const { container } = renderWithTooltip(
        <MetricTooltip content="Tooltip" className="custom-class">
          <span>Content</span>
        </MetricTooltip>,
      );

      const trigger = container.querySelector(".custom-class");
      expect(trigger).toBeInTheDocument();
    });

    it("merges custom className with default classes", () => {
      const { container } = renderWithTooltip(
        <MetricTooltip content="Tooltip" className="custom-class">
          <span>Content</span>
        </MetricTooltip>,
      );

      const trigger = container.querySelector(".cursor-help.custom-class");
      expect(trigger).toBeInTheDocument();
    });
  });

  describe("styling", () => {
    it("has cursor-help class for accessibility indication", () => {
      const { container } = renderWithTooltip(
        <MetricTooltip content="Tooltip">
          <span>Content</span>
        </MetricTooltip>,
      );

      const trigger = container.querySelector(".cursor-help");
      expect(trigger).toBeInTheDocument();
    });

    it("has underline-offset class for better readability", () => {
      const { container } = renderWithTooltip(
        <MetricTooltip content="Tooltip">
          <span>Content</span>
        </MetricTooltip>,
      );

      const trigger = container.querySelector(".underline-offset-2");
      expect(trigger).toBeInTheDocument();
    });
  });

  describe("with different content types", () => {
    it("handles numeric content in children", () => {
      renderWithTooltip(
        <MetricTooltip content="1,234 total commits">
          <span>1.2k</span>
        </MetricTooltip>,
      );

      expect(screen.getByText("1.2k")).toBeInTheDocument();
    });

    it("handles emoji content in children", () => {
      renderWithTooltip(
        <MetricTooltip content="Growth: +25% YoY">
          <span>📈 25%</span>
        </MetricTooltip>,
      );

      expect(screen.getByText("📈 25%")).toBeInTheDocument();
    });

    it("handles multiple elements in children", () => {
      renderWithTooltip(
        <MetricTooltip content="Detailed info">
          <span>
            <strong>100</strong> commits
          </span>
        </MetricTooltip>,
      );

      expect(screen.getByText("100")).toBeInTheDocument();
      expect(screen.getByText("commits")).toBeInTheDocument();
    });
  });
});
