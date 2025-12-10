import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ActivityStatusDot } from "./ActivityStatusDot";

// Mock useReducedMotion hook
vi.mock("@/hooks", () => ({
  useReducedMotion: vi.fn(() => false),
}));

describe("ActivityStatusDot", () => {
  describe("rendering", () => {
    it("renders with default props", () => {
      render(<ActivityStatusDot />);
      expect(screen.getByRole("status")).toBeInTheDocument();
    });

    it("renders with custom className", () => {
      render(<ActivityStatusDot className="custom-class" />);
      expect(screen.getByRole("status")).toHaveClass("custom-class");
    });
  });

  describe("status from date", () => {
    it("shows active status for recent date (within 30 days)", () => {
      const recentDate = new Date();
      recentDate.setDate(recentDate.getDate() - 10);

      render(
        <ActivityStatusDot
          lastActivityDate={recentDate.toISOString()}
          showLabel
        />,
      );

      expect(screen.getByText("Active")).toBeInTheDocument();
      expect(screen.getByRole("status")).toHaveAttribute(
        "aria-label",
        "Active project",
      );
    });

    it("shows recent status for date 31-90 days ago", () => {
      const recentDate = new Date();
      recentDate.setDate(recentDate.getDate() - 60);

      render(
        <ActivityStatusDot
          lastActivityDate={recentDate.toISOString()}
          showLabel
        />,
      );

      expect(screen.getByText("Recent")).toBeInTheDocument();
      expect(screen.getByRole("status")).toHaveAttribute(
        "aria-label",
        "Recent project",
      );
    });

    it("shows inactive status for date over 90 days ago", () => {
      const oldDate = new Date();
      oldDate.setDate(oldDate.getDate() - 120);

      render(
        <ActivityStatusDot
          lastActivityDate={oldDate.toISOString()}
          showLabel
        />,
      );

      expect(screen.getByText("Inactive")).toBeInTheDocument();
      expect(screen.getByRole("status")).toHaveAttribute(
        "aria-label",
        "Inactive project",
      );
    });

    it("shows inactive status for null date", () => {
      render(<ActivityStatusDot lastActivityDate={null} showLabel />);

      expect(screen.getByText("Inactive")).toBeInTheDocument();
    });

    it("shows inactive status when no date provided", () => {
      render(<ActivityStatusDot showLabel />);

      expect(screen.getByText("Inactive")).toBeInTheDocument();
    });
  });

  describe("status from prop", () => {
    it("shows active status when provided directly", () => {
      render(<ActivityStatusDot status="active" showLabel />);

      expect(screen.getByText("Active")).toBeInTheDocument();
    });

    it("shows recent status when provided directly", () => {
      render(<ActivityStatusDot status="recent" showLabel />);

      expect(screen.getByText("Recent")).toBeInTheDocument();
    });

    it("shows inactive status when provided directly", () => {
      render(<ActivityStatusDot status="inactive" showLabel />);

      expect(screen.getByText("Inactive")).toBeInTheDocument();
    });

    it("status prop takes precedence over lastActivityDate", () => {
      const recentDate = new Date(); // Today - should be "active"

      render(
        <ActivityStatusDot
          lastActivityDate={recentDate.toISOString()}
          status="inactive"
          showLabel
        />,
      );

      // status prop should override the date-based calculation
      expect(screen.getByText("Inactive")).toBeInTheDocument();
    });
  });

  describe("showLabel prop", () => {
    it("does not show label by default", () => {
      render(<ActivityStatusDot status="active" />);

      expect(screen.queryByText("Active")).not.toBeInTheDocument();
    });

    it("shows label when showLabel is true", () => {
      render(<ActivityStatusDot status="active" showLabel />);

      expect(screen.getByText("Active")).toBeInTheDocument();
    });

    it("does not show label when showLabel is false", () => {
      render(<ActivityStatusDot status="active" showLabel={false} />);

      expect(screen.queryByText("Active")).not.toBeInTheDocument();
    });
  });

  describe("size variants", () => {
    it("renders small size by default", () => {
      const { container } = render(<ActivityStatusDot status="active" />);

      // Small size should have h-2 w-2 classes
      const dot = container.querySelector(".h-2.w-2");
      expect(dot).toBeInTheDocument();
    });

    it("renders small size when size='sm'", () => {
      const { container } = render(
        <ActivityStatusDot status="active" size="sm" />,
      );

      const dot = container.querySelector(".h-2.w-2");
      expect(dot).toBeInTheDocument();
    });

    it("renders medium size when size='md'", () => {
      const { container } = render(
        <ActivityStatusDot status="active" size="md" />,
      );

      // Medium size should have h-2.5 w-2.5 classes
      const dot = container.querySelector('[class*="h-2.5"][class*="w-2.5"]');
      expect(dot).toBeInTheDocument();
    });
  });

  describe("accessibility", () => {
    it("has status role", () => {
      render(<ActivityStatusDot status="active" />);

      expect(screen.getByRole("status")).toBeInTheDocument();
    });

    it("has appropriate aria-label for active status", () => {
      render(<ActivityStatusDot status="active" />);

      expect(screen.getByRole("status")).toHaveAttribute(
        "aria-label",
        "Active project",
      );
    });

    it("has appropriate aria-label for recent status", () => {
      render(<ActivityStatusDot status="recent" />);

      expect(screen.getByRole("status")).toHaveAttribute(
        "aria-label",
        "Recent project",
      );
    });

    it("has appropriate aria-label for inactive status", () => {
      render(<ActivityStatusDot status="inactive" />);

      expect(screen.getByRole("status")).toHaveAttribute(
        "aria-label",
        "Inactive project",
      );
    });
  });

  describe("pulse animation", () => {
    it("shows pulse animation for active status when motion is enabled", () => {
      const { container } = render(<ActivityStatusDot status="active" />);

      // Should have animate-ping class for pulse
      const pulseElement = container.querySelector(".animate-ping");
      expect(pulseElement).toBeInTheDocument();
    });

    it("does not show pulse animation for recent status", () => {
      const { container } = render(<ActivityStatusDot status="recent" />);

      const pulseElement = container.querySelector(".animate-ping");
      expect(pulseElement).not.toBeInTheDocument();
    });

    it("does not show pulse animation for inactive status", () => {
      const { container } = render(<ActivityStatusDot status="inactive" />);

      const pulseElement = container.querySelector(".animate-ping");
      expect(pulseElement).not.toBeInTheDocument();
    });
  });

  describe("reduced motion", () => {
    it("does not show pulse animation when reduced motion is preferred", async () => {
      // Re-mock with reduced motion enabled
      const hooks = await import("@/hooks");
      vi.mocked(hooks.useReducedMotion).mockReturnValue(true);

      const { container } = render(<ActivityStatusDot status="active" />);

      const pulseElement = container.querySelector(".animate-ping");
      expect(pulseElement).not.toBeInTheDocument();

      // Reset mock
      vi.mocked(hooks.useReducedMotion).mockReturnValue(false);
    });
  });

  describe("color classes", () => {
    it("applies success color for active status", () => {
      const { container } = render(<ActivityStatusDot status="active" />);

      // Active status should have bg-success class
      const dot = container.querySelector(".bg-success");
      expect(dot).toBeInTheDocument();
    });

    it("applies warning color for recent status", () => {
      const { container } = render(<ActivityStatusDot status="recent" />);

      // Recent status should have bg-warning class
      const dot = container.querySelector(".bg-warning");
      expect(dot).toBeInTheDocument();
    });

    it("applies muted color for inactive status", () => {
      const { container } = render(<ActivityStatusDot status="inactive" />);

      // Inactive status should have bg-muted-foreground class
      const dot = container.querySelector(".bg-muted-foreground");
      expect(dot).toBeInTheDocument();
    });
  });

  describe("with Date object", () => {
    it("accepts Date object for lastActivityDate", () => {
      const date = new Date();
      date.setDate(date.getDate() - 5);

      render(<ActivityStatusDot lastActivityDate={date} showLabel />);

      expect(screen.getByText("Active")).toBeInTheDocument();
    });
  });
});
