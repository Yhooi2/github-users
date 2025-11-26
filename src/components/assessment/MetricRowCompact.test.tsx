import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { MetricRowCompact } from "./MetricRowCompact";
import { Zap, Target, Award, Calendar, BadgeCheck, Users } from "lucide-react";

// Mock useResponsive hook
vi.mock("@/hooks/useResponsive", () => ({
  useResponsive: vi.fn(() => ({ isMobile: false, isTablet: false, isDesktop: true })),
}));

import { useResponsive } from "@/hooks/useResponsive";

describe("MetricRowCompact", () => {
  const defaultProps = {
    metricKey: "activity" as const,
    title: "Activity",
    score: 85,
    level: "High",
    icon: Zap,
  };

  beforeEach(() => {
    vi.mocked(useResponsive).mockReturnValue({
      isMobile: false,
      isTablet: false,
      isDesktop: true,
    });
  });

  describe("Rendering", () => {
    it("renders title and score correctly", () => {
      render(<MetricRowCompact {...defaultProps} />);

      expect(screen.getByText("Activity")).toBeInTheDocument();
      expect(screen.getByText("85%")).toBeInTheDocument();
    });

    it("renders progress bar with correct value", () => {
      render(<MetricRowCompact {...defaultProps} />);

      const progressBar = screen.getByRole("progressbar");
      expect(progressBar).toBeInTheDocument();
      expect(progressBar).toHaveAttribute(
        "aria-label",
        "Activity score: 85% - High"
      );
    });

    it("renders icon", () => {
      const { container } = render(<MetricRowCompact {...defaultProps} />);

      const icon = container.querySelector('[aria-hidden="true"]');
      expect(icon).toBeInTheDocument();
    });

    it("wraps in tooltip on desktop", () => {
      const { container } = render(<MetricRowCompact {...defaultProps} />);

      // Tooltip trigger should be present
      const tooltipTrigger = container.querySelector('[data-slot="tooltip-trigger"]');
      expect(tooltipTrigger).toBeInTheDocument();
    });

    it("does not render tooltip on mobile", () => {
      vi.mocked(useResponsive).mockReturnValue({
        isMobile: true,
        isTablet: false,
        isDesktop: false,
      });

      const { container } = render(<MetricRowCompact {...defaultProps} />);

      const tooltipTrigger = container.querySelector('[data-slot="tooltip-trigger"]');
      expect(tooltipTrigger).not.toBeInTheDocument();
    });
  });

  describe("Score Colors", () => {
    it("applies success color for high score (>=80)", () => {
      render(<MetricRowCompact {...defaultProps} score={90} />);

      const scoreText = screen.getByText("90%");
      expect(scoreText.className).toContain("text-success");
    });

    it("applies warning color for medium score (60-79)", () => {
      render(<MetricRowCompact {...defaultProps} score={65} />);

      const scoreText = screen.getByText("65%");
      expect(scoreText.className).toContain("text-warning");
    });

    it("applies caution color for low score (40-59)", () => {
      render(<MetricRowCompact {...defaultProps} score={45} />);

      const scoreText = screen.getByText("45%");
      expect(scoreText.className).toContain("text-caution");
    });

    it("applies destructive color for critical score (<40)", () => {
      render(<MetricRowCompact {...defaultProps} score={25} />);

      const scoreText = screen.getByText("25%");
      expect(scoreText.className).toContain("text-destructive");
    });
  });

  describe("Mobile Interactions", () => {
    beforeEach(() => {
      vi.mocked(useResponsive).mockReturnValue({
        isMobile: true,
        isTablet: false,
        isDesktop: false,
      });
    });

    it("calls onMetricClick when row is clicked on mobile", () => {
      const handleClick = vi.fn();
      render(
        <MetricRowCompact {...defaultProps} onMetricClick={handleClick} />
      );

      const row = screen.getByRole("button");
      fireEvent.click(row);

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("row has button role on mobile with onMetricClick", () => {
      render(
        <MetricRowCompact {...defaultProps} onMetricClick={() => {}} />
      );

      expect(screen.getByRole("button")).toBeInTheDocument();
    });

    it("row is keyboard accessible on mobile", () => {
      const handleClick = vi.fn();
      render(
        <MetricRowCompact {...defaultProps} onMetricClick={handleClick} />
      );

      const row = screen.getByRole("button");
      fireEvent.keyDown(row, { key: "Enter" });

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("supports space key on mobile", () => {
      const handleClick = vi.fn();
      render(
        <MetricRowCompact {...defaultProps} onMetricClick={handleClick} />
      );

      const row = screen.getByRole("button");
      fireEvent.keyDown(row, { key: " " });

      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });

  describe("Loading State", () => {
    it("renders loading skeleton", () => {
      const { container } = render(
        <MetricRowCompact {...defaultProps} loading />
      );

      expect(container.querySelector(".animate-pulse")).toBeInTheDocument();
    });

    it("shows loading message for screen readers", () => {
      render(<MetricRowCompact {...defaultProps} loading />);

      expect(screen.getByText("Loading metric...")).toBeInTheDocument();
    });

    it("does not render score when loading", () => {
      render(<MetricRowCompact {...defaultProps} loading />);

      expect(screen.queryByText("85%")).not.toBeInTheDocument();
    });

    it("has status role when loading", () => {
      render(<MetricRowCompact {...defaultProps} loading />);

      expect(screen.getByRole("status")).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("has accessible progress bar", () => {
      render(<MetricRowCompact {...defaultProps} />);

      const progressBar = screen.getByRole("progressbar");
      expect(progressBar).toHaveAttribute("aria-label");
    });

    it("icon is hidden from screen readers", () => {
      const { container } = render(<MetricRowCompact {...defaultProps} />);

      const icons = container.querySelectorAll('[aria-hidden="true"]');
      expect(icons.length).toBeGreaterThan(0);
    });

    it("mobile row has descriptive aria-label", () => {
      vi.mocked(useResponsive).mockReturnValue({
        isMobile: true,
        isTablet: false,
        isDesktop: false,
      });

      render(
        <MetricRowCompact {...defaultProps} onMetricClick={() => {}} />
      );

      const row = screen.getByRole("button");
      expect(row).toHaveAttribute("aria-label", "Activity: 85%. Tap for details.");
    });
  });

  describe("All Metric Types", () => {
    const metrics = [
      { metricKey: "activity" as const, title: "Activity", icon: Zap },
      { metricKey: "impact" as const, title: "Impact", icon: Target },
      { metricKey: "quality" as const, title: "Quality", icon: Award },
      { metricKey: "consistency" as const, title: "Consistency", icon: Calendar },
      { metricKey: "authenticity" as const, title: "Authenticity", icon: BadgeCheck },
      { metricKey: "collaboration" as const, title: "Collaboration", icon: Users },
    ];

    metrics.forEach(({ metricKey, title, icon }) => {
      it(`renders ${title} metric correctly`, () => {
        render(
          <MetricRowCompact
            metricKey={metricKey}
            title={title}
            score={75}
            level="High"
            icon={icon}
          />
        );

        expect(screen.getByText(title)).toBeInTheDocument();
        expect(screen.getByText("75%")).toBeInTheDocument();
      });
    });
  });

  describe("Breakdown Data", () => {
    it("accepts breakdown prop", () => {
      const breakdown = {
        recentCommits: 35,
        consistency: 25,
        diversity: 25,
      };

      // Should not throw
      render(
        <MetricRowCompact {...defaultProps} breakdown={breakdown} />
      );

      expect(screen.getByText("Activity")).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("handles score of 0", () => {
      render(<MetricRowCompact {...defaultProps} score={0} />);

      expect(screen.getByText("0%")).toBeInTheDocument();
    });

    it("handles score of 100", () => {
      render(<MetricRowCompact {...defaultProps} score={100} />);

      expect(screen.getByText("100%")).toBeInTheDocument();
    });

    it("truncates long titles", () => {
      render(
        <MetricRowCompact
          {...defaultProps}
          title="Very Long Metric Title That Should Truncate"
        />
      );

      const title = screen.getByText(
        "Very Long Metric Title That Should Truncate"
      );
      expect(title.className).toContain("truncate");
    });
  });
});
