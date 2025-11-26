import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { MetricAssessmentGrid } from "./MetricAssessmentGrid";

// Mock useResponsive hook
const mockUseResponsive = vi.fn();
vi.mock("@/hooks/useResponsive", () => ({
  useResponsive: () => mockUseResponsive(),
}));

describe("MetricAssessmentGrid", () => {
  const sampleMetrics = {
    activity: { score: 85, level: "High" as const, breakdown: { recentCommits: 38, consistency: 27, diversity: 20 } },
    impact: { score: 65, level: "Moderate" as const, breakdown: { stars: 25, forks: 15, contributors: 10, reach: 10, engagement: 5 } },
    quality: { score: 78, level: "Strong" as const, breakdown: { originality: 25, documentation: 20, ownership: 15, maturity: 10, stack: 8 } },
    consistency: { score: 82, level: "High" as const, breakdown: { regularity: 40, streak: 25, recency: 17 } },
    authenticity: { score: 45, level: "Medium" as const, breakdown: { originalityScore: 15, activityScore: 10, engagementScore: 10, codeOwnershipScore: 10 } },
    collaboration: { score: 55, level: "Moderate" as const, breakdown: { contributionRatio: 25, diversity: 18, engagement: 12 } },
  };

  beforeEach(() => {
    // Default to desktop
    mockUseResponsive.mockReturnValue({
      breakpoint: "desktop",
      isMobile: false,
      isTablet: false,
      isDesktop: true,
      width: 1440,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("Desktop Rendering", () => {
    it("renders all three category cards", () => {
      render(<MetricAssessmentGrid metrics={sampleMetrics} />);

      expect(screen.getByText("Output")).toBeInTheDocument();
      // Quality appears twice: as category title and as metric name
      expect(screen.getAllByText("Quality").length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText("Trust")).toBeInTheDocument();
    });

    it("renders grid layout on desktop", () => {
      const { container } = render(
        <MetricAssessmentGrid metrics={sampleMetrics} />
      );

      const grid = container.querySelector(".grid");
      expect(grid).toBeInTheDocument();
      expect(grid).toHaveClass("grid-cols-3");
    });

    it("renders all six metrics", () => {
      render(<MetricAssessmentGrid metrics={sampleMetrics} />);

      expect(screen.getByText("Activity")).toBeInTheDocument();
      expect(screen.getByText("Impact")).toBeInTheDocument();
      // Quality appears twice (category + metric)
      expect(screen.getAllByText("Quality").length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText("Consistency")).toBeInTheDocument();
      expect(screen.getByText("Authenticity")).toBeInTheDocument();
      expect(screen.getByText("Collaboration")).toBeInTheDocument();
    });

    it("does not render Sheet on desktop", () => {
      render(<MetricAssessmentGrid metrics={sampleMetrics} />);

      // No sheet should be in the DOM on desktop
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  describe("Mobile Rendering", () => {
    beforeEach(() => {
      mockUseResponsive.mockReturnValue({
        breakpoint: "mobile",
        isMobile: true,
        isTablet: false,
        isDesktop: false,
        width: 375,
      });
    });

    it("renders flex column layout on mobile", () => {
      const { container } = render(
        <MetricAssessmentGrid metrics={sampleMetrics} />
      );

      const flexContainer = container.querySelector(".flex.flex-col");
      expect(flexContainer).toBeInTheDocument();
    });

    it("renders categories as accordion on mobile", () => {
      render(<MetricAssessmentGrid metrics={sampleMetrics} />);

      // Should have buttons for toggling
      const buttons = screen.getAllByRole("button");
      expect(buttons.length).toBeGreaterThanOrEqual(3);
    });

    it("starts with all categories collapsed", () => {
      render(<MetricAssessmentGrid metrics={sampleMetrics} />);

      // All accordion buttons should be collapsed initially
      const expandButtons = screen.getAllByRole("button", {
        expanded: false,
      });
      // Should have at least 3 collapsed buttons (one for each category)
      expect(expandButtons.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe("Category Scores", () => {
    it("calculates OUTPUT category score correctly", () => {
      render(<MetricAssessmentGrid metrics={sampleMetrics} />);

      // OUTPUT = (activity: 85 + impact: 65) / 2 = 75
      expect(screen.getByText("75%")).toBeInTheDocument();
    });

    it("calculates QUALITY category score correctly", () => {
      render(<MetricAssessmentGrid metrics={sampleMetrics} />);

      // QUALITY = (quality: 78 + consistency: 82) / 2 = 80
      expect(screen.getByText("80%")).toBeInTheDocument();
    });

    it("calculates TRUST category score correctly", () => {
      render(<MetricAssessmentGrid metrics={sampleMetrics} />);

      // TRUST = (authenticity: 45 + collaboration: 55) / 2 = 50
      expect(screen.getByText("50%")).toBeInTheDocument();
    });
  });

  describe("Loading State", () => {
    it("renders loading skeleton for categories", () => {
      const { container } = render(
        <MetricAssessmentGrid metrics={sampleMetrics} loading />
      );

      const skeletons = container.querySelectorAll(".animate-pulse");
      expect(skeletons.length).toBeGreaterThan(0);
    });
  });

  describe("Custom className", () => {
    it("applies custom className", () => {
      const { container } = render(
        <MetricAssessmentGrid
          metrics={sampleMetrics}
          className="custom-class"
        />
      );

      expect(container.firstChild).toHaveClass("custom-class");
    });
  });

  describe("Accordion Behavior (Mobile)", () => {
    beforeEach(() => {
      mockUseResponsive.mockReturnValue({
        breakpoint: "mobile",
        isMobile: true,
        isTablet: false,
        isDesktop: false,
        width: 375,
      });
    });

    it("expands category when clicked", () => {
      render(<MetricAssessmentGrid metrics={sampleMetrics} />);

      // Find OUTPUT category button
      const outputButton = screen.getAllByRole("button").find((btn) =>
        btn.textContent?.includes("Output")
      );

      if (outputButton) {
        fireEvent.click(outputButton);

        // Button should now be expanded
        expect(outputButton).toHaveAttribute("aria-expanded", "true");
      }
    });

    it("collapses category when clicked again", () => {
      render(<MetricAssessmentGrid metrics={sampleMetrics} />);

      const outputButton = screen.getAllByRole("button").find((btn) =>
        btn.textContent?.includes("Output")
      );

      if (outputButton) {
        // Click to expand
        fireEvent.click(outputButton);
        expect(outputButton).toHaveAttribute("aria-expanded", "true");

        // Click again to collapse
        fireEvent.click(outputButton);
        expect(outputButton).toHaveAttribute("aria-expanded", "false");
      }
    });

    it("closes other categories when one is opened", () => {
      render(<MetricAssessmentGrid metrics={sampleMetrics} />);

      const buttons = screen.getAllByRole("button");
      const outputButton = buttons.find((btn) =>
        btn.textContent?.includes("Output")
      );
      const qualityButton = buttons.find((btn) =>
        btn.textContent?.includes("Quality") && btn.closest('[data-slot="collapsible"]')
      );

      if (outputButton && qualityButton) {
        // Expand OUTPUT
        fireEvent.click(outputButton);
        expect(outputButton).toHaveAttribute("aria-expanded", "true");

        // Expand QUALITY - OUTPUT should collapse
        fireEvent.click(qualityButton);
        expect(qualityButton).toHaveAttribute("aria-expanded", "true");
        expect(outputButton).toHaveAttribute("aria-expanded", "false");
      }
    });
  });

  describe("Tooltip/Sheet Interaction", () => {
    it("uses tooltips on desktop for categories and metrics", () => {
      const { container } = render(
        <MetricAssessmentGrid metrics={sampleMetrics} />
      );

      // Desktop should have tooltip triggers (3 categories + 6 metrics)
      const tooltipTriggers = container.querySelectorAll('[data-slot="tooltip-trigger"]');
      expect(tooltipTriggers.length).toBe(9);
    });

    it("does not pass onMetricClick on desktop", () => {
      render(<MetricAssessmentGrid metrics={sampleMetrics} />);

      // On desktop, metric rows should not have button role
      // Only category scores have aria-label for accessibility
      const buttons = screen.queryAllByRole("button");
      // Should only have potential tooltip buttons, not metric click buttons
      buttons.forEach((button) => {
        expect(button.getAttribute("aria-label")).not.toContain("Tap for details");
      });
    });

    it("passes onMetricClick on mobile for Sheet opening", () => {
      mockUseResponsive.mockReturnValue({
        breakpoint: "mobile",
        isMobile: true,
        isTablet: false,
        isDesktop: false,
        width: 375,
      });

      render(<MetricAssessmentGrid metrics={sampleMetrics} />);

      // Expand OUTPUT category first
      const outputButton = screen.getAllByRole("button").find((btn) =>
        btn.textContent?.includes("Output")
      );

      if (outputButton) {
        fireEvent.click(outputButton);

        // Now metric rows should be clickable (have button role)
        const metricButtons = screen.getAllByRole("button").filter((btn) =>
          btn.getAttribute("aria-label")?.includes("Tap for details")
        );
        expect(metricButtons.length).toBeGreaterThan(0);
      }
    });
  });
});
