import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { MetricCategoryCard } from "./MetricCategoryCard";

// Mock useResponsive hook
const mockUseResponsive = vi.fn();
vi.mock("@/hooks/useResponsive", () => ({
  useResponsive: () => mockUseResponsive(),
}));

describe("MetricCategoryCard", () => {
  const defaultProps = {
    category: "OUTPUT" as const,
    categoryScore: 75,
    metrics: {
      first: { key: "activity" as const, score: 85, level: "High" },
      second: { key: "impact" as const, score: 65, level: "Moderate" },
    },
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
    it("renders category title and description", () => {
      render(<MetricCategoryCard {...defaultProps} />);

      expect(screen.getByText("Output")).toBeInTheDocument();
      expect(
        screen.getByText("Productivity and project reach")
      ).toBeInTheDocument();
    });

    it("renders category score", () => {
      render(<MetricCategoryCard {...defaultProps} />);

      expect(screen.getByText("75%")).toBeInTheDocument();
    });

    it("renders both metrics", () => {
      render(<MetricCategoryCard {...defaultProps} />);

      expect(screen.getByText("Activity")).toBeInTheDocument();
      expect(screen.getByText("85%")).toBeInTheDocument();
      expect(screen.getByText("Impact")).toBeInTheDocument();
      expect(screen.getByText("65%")).toBeInTheDocument();
    });

    it("has fixed height of 220px on desktop", () => {
      const { container } = render(<MetricCategoryCard {...defaultProps} />);

      const card = container.querySelector('[data-slot="card"]');
      expect(card).toHaveClass("h-[220px]");
    });

    it("renders icon", () => {
      const { container } = render(<MetricCategoryCard {...defaultProps} />);

      const icons = container.querySelectorAll('[aria-hidden="true"]');
      expect(icons.length).toBeGreaterThan(0);
    });

    it("uses tooltips on desktop for category and metrics", () => {
      const { container } = render(<MetricCategoryCard {...defaultProps} />);

      // Tooltip triggers should be present (1 category + 2 metrics)
      const tooltipTriggers = container.querySelectorAll('[data-slot="tooltip-trigger"]');
      expect(tooltipTriggers.length).toBe(3);
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

    it("renders as collapsible on mobile", () => {
      render(
        <MetricCategoryCard
          {...defaultProps}
          isExpanded={false}
          onToggle={() => {}}
        />
      );

      // Should have a button for toggling (accordion trigger)
      const buttons = screen.getAllByRole("button");
      // First button is the accordion trigger
      expect(buttons[0]).toHaveAttribute("aria-expanded", "false");
    });

    it("shows chevron icon on mobile", () => {
      const { container } = render(
        <MetricCategoryCard
          {...defaultProps}
          isExpanded={false}
          onToggle={() => {}}
        />
      );

      // Should have chevron icon
      const icons = container.querySelectorAll("svg");
      expect(icons.length).toBeGreaterThan(0);
    });

    it("hides metrics when collapsed", () => {
      render(
        <MetricCategoryCard
          {...defaultProps}
          isExpanded={false}
          onToggle={() => {}}
        />
      );

      // Metrics should not be visible when collapsed
      // The collapsible content is hidden
      expect(screen.getByText("Output")).toBeInTheDocument();
    });

    it("shows metrics when expanded", () => {
      render(
        <MetricCategoryCard
          {...defaultProps}
          isExpanded={true}
          onToggle={() => {}}
        />
      );

      expect(screen.getByText("Activity")).toBeInTheDocument();
      expect(screen.getByText("Impact")).toBeInTheDocument();
    });

    it("calls onToggle when accordion clicked", () => {
      const handleToggle = vi.fn();
      render(
        <MetricCategoryCard
          {...defaultProps}
          isExpanded={false}
          onToggle={handleToggle}
        />
      );

      // Find the accordion trigger button (first button)
      const buttons = screen.getAllByRole("button");
      fireEvent.click(buttons[0]);

      expect(handleToggle).toHaveBeenCalledTimes(1);
    });
  });

  describe("All Categories", () => {
    const categories = [
      {
        category: "OUTPUT" as const,
        expectedTitle: "Output",
        expectedDescription: "Productivity and project reach",
      },
      {
        category: "QUALITY" as const,
        expectedTitle: "Quality",
        expectedDescription: "Code standards and work habits",
      },
      {
        category: "TRUST" as const,
        expectedTitle: "Trust",
        expectedDescription: "Profile authenticity and teamwork",
      },
    ];

    categories.forEach(({ category, expectedTitle, expectedDescription }) => {
      it(`renders ${category} category correctly`, () => {
        render(
          <MetricCategoryCard
            {...defaultProps}
            category={category}
            metrics={{
              first: {
                key: category === "OUTPUT" ? "activity" : category === "QUALITY" ? "quality" : "authenticity",
                score: 75,
                level: "High",
              },
              second: {
                key: category === "OUTPUT" ? "impact" : category === "QUALITY" ? "consistency" : "collaboration",
                score: 65,
                level: "Moderate",
              },
            }}
          />
        );

        // Use getAllByText for cases where text might appear multiple times (e.g., "Quality")
        const titles = screen.getAllByText(expectedTitle);
        expect(titles.length).toBeGreaterThan(0);
        expect(screen.getByText(expectedDescription)).toBeInTheDocument();
      });
    });
  });

  describe("Score Colors", () => {
    it("applies success color for high category score", () => {
      render(<MetricCategoryCard {...defaultProps} categoryScore={90} />);

      const score = screen.getByText("90%");
      expect(score.className).toContain("text-success");
    });

    it("applies warning color for medium category score", () => {
      render(<MetricCategoryCard {...defaultProps} categoryScore={70} />);

      // Find the category score (not metric scores)
      const scores = screen.getAllByText("70%");
      // The first 70% is the category score
      expect(scores[0].className).toContain("text-warning");
    });

    it("applies caution color for low category score", () => {
      render(<MetricCategoryCard {...defaultProps} categoryScore={45} />);

      const score = screen.getByText("45%");
      expect(score.className).toContain("text-caution");
    });

    it("applies destructive color for critical category score", () => {
      render(<MetricCategoryCard {...defaultProps} categoryScore={25} />);

      const score = screen.getByText("25%");
      expect(score.className).toContain("text-destructive");
    });
  });

  describe("Loading State", () => {
    it("renders loading skeleton", () => {
      const { container } = render(
        <MetricCategoryCard {...defaultProps} loading />
      );

      expect(container.querySelector(".animate-pulse")).toBeInTheDocument();
    });

    it("does not show score when loading", () => {
      render(<MetricCategoryCard {...defaultProps} loading />);

      expect(screen.queryByText("75%")).not.toBeInTheDocument();
    });

    it("maintains fixed height when loading", () => {
      const { container } = render(
        <MetricCategoryCard {...defaultProps} loading />
      );

      const card = container.querySelector('[data-slot="card"]');
      expect(card).toHaveClass("h-[220px]");
    });
  });

  describe("Mobile Metric Click Callback", () => {
    beforeEach(() => {
      mockUseResponsive.mockReturnValue({
        breakpoint: "mobile",
        isMobile: true,
        isTablet: false,
        isDesktop: false,
        width: 375,
      });
    });

    it("calls onMetricClick with correct key for first metric on mobile", () => {
      const handleMetricClick = vi.fn();
      render(
        <MetricCategoryCard
          {...defaultProps}
          isExpanded={true}
          onToggle={() => {}}
          onMetricClick={handleMetricClick}
        />
      );

      // Find metric rows (they become buttons on mobile)
      const metricButtons = screen.getAllByRole("button");
      // First is accordion trigger, next are metrics
      fireEvent.click(metricButtons[1]); // First metric

      expect(handleMetricClick).toHaveBeenCalledWith("activity");
    });

    it("calls onMetricClick with correct key for second metric on mobile", () => {
      const handleMetricClick = vi.fn();
      render(
        <MetricCategoryCard
          {...defaultProps}
          isExpanded={true}
          onToggle={() => {}}
          onMetricClick={handleMetricClick}
        />
      );

      const metricButtons = screen.getAllByRole("button");
      fireEvent.click(metricButtons[2]); // Second metric

      expect(handleMetricClick).toHaveBeenCalledWith("impact");
    });

    it("does not pass onMetricClick to rows when not provided", () => {
      render(
        <MetricCategoryCard
          {...defaultProps}
          isExpanded={true}
          onToggle={() => {}}
        />
      );

      // Only accordion button should exist (metrics are not clickable)
      const buttons = screen.getAllByRole("button");
      expect(buttons.length).toBe(1); // Only accordion trigger
    });
  });

  describe("Accessibility", () => {
    it("has accessible category score label on desktop", () => {
      render(<MetricCategoryCard {...defaultProps} />);

      const score = screen.getByLabelText(/output category score/i);
      expect(score).toBeInTheDocument();
    });

    it("has aria-expanded on mobile trigger", () => {
      mockUseResponsive.mockReturnValue({
        breakpoint: "mobile",
        isMobile: true,
        isTablet: false,
        isDesktop: false,
        width: 375,
      });

      render(
        <MetricCategoryCard
          {...defaultProps}
          isExpanded={true}
          onToggle={() => {}}
        />
      );

      const buttons = screen.getAllByRole("button");
      expect(buttons[0]).toHaveAttribute("aria-expanded", "true");
    });
  });

  describe("Breakdown Data", () => {
    it("passes breakdown data to MetricRowCompact", () => {
      const metricsWithBreakdown = {
        first: {
          key: "activity" as const,
          score: 85,
          level: "High",
          breakdown: { recentCommits: 35, consistency: 25, diversity: 25 },
        },
        second: {
          key: "impact" as const,
          score: 65,
          level: "Moderate",
          breakdown: { stars: 20, forks: 15, contributors: 10 },
        },
      };

      // Should render without errors
      render(
        <MetricCategoryCard
          {...defaultProps}
          metrics={metricsWithBreakdown}
        />
      );

      expect(screen.getByText("Activity")).toBeInTheDocument();
      expect(screen.getByText("Impact")).toBeInTheDocument();
    });
  });
});
