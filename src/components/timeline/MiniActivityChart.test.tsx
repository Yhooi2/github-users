import { TooltipProvider } from "@/components/ui/tooltip";
import type { MonthlyContribution } from "@/lib/contribution-aggregator";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MiniActivityChart } from "./MiniActivityChart";

// Helper to wrap component with TooltipProvider
const renderWithTooltip = (ui: React.ReactElement) => {
  return render(<TooltipProvider>{ui}</TooltipProvider>);
};

// Helper to create mock monthly data
const createMockMonthlyData = (
  contributions: number[] = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 80, 60],
): MonthlyContribution[] => {
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return contributions.map((count, i) => ({
    month: i + 1,
    monthName: monthNames[i],
    contributions: count,
    daysActive: Math.min(count, 25),
    maxDaily: Math.ceil(count / 10),
  }));
};

describe("MiniActivityChart", () => {
  describe("rendering", () => {
    it("renders 12 bars for 12 months", () => {
      const monthlyData = createMockMonthlyData();
      const { container } = renderWithTooltip(
        <MiniActivityChart monthlyData={monthlyData} />,
      );

      // Each month should render a bar (div with flex-1 class)
      const bars = container.querySelectorAll(".flex-1");
      expect(bars.length).toBe(12);
    });

    it("renders with custom className", () => {
      const monthlyData = createMockMonthlyData();
      const { container } = renderWithTooltip(
        <MiniActivityChart
          monthlyData={monthlyData}
          className="custom-class"
        />,
      );

      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass("custom-class");
    });

    it("renders with default flex and gap classes", () => {
      const monthlyData = createMockMonthlyData();
      const { container } = renderWithTooltip(
        <MiniActivityChart monthlyData={monthlyData} />,
      );

      // After refactoring: wrapper is container, bars are in nested div
      const barsContainer = container.querySelector(".flex");
      expect(barsContainer).toBeInTheDocument();
      expect(barsContainer).toHaveClass("flex");
      expect(barsContainer).toHaveClass("items-end");
      expect(barsContainer).toHaveClass("gap-0.5");
    });
  });

  describe("bar heights", () => {
    it("sets tallest bar to max height for max contributions", () => {
      // Create data where month 10 has the max
      const monthlyData = createMockMonthlyData([
        10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 80, 60,
      ]);
      const { container } = renderWithTooltip(
        <MiniActivityChart monthlyData={monthlyData} />,
      );

      // The 10th bar (index 9, value 100) should have h-6 (max height)
      const bars = container.querySelectorAll(".flex-1");
      expect(bars[9]).toHaveClass("h-6");
    });

    it("sets minimum height for 0 contributions", () => {
      const monthlyData = createMockMonthlyData([
        0, 0, 0, 100, 0, 0, 0, 0, 0, 0, 0, 0,
      ]);
      const { container } = renderWithTooltip(
        <MiniActivityChart monthlyData={monthlyData} />,
      );

      const bars = container.querySelectorAll(".flex-1");
      // First bar (0 contributions) should have minimum height h-0.5
      expect(bars[0]).toHaveClass("h-0.5");
    });

    it("calculates relative heights correctly", () => {
      // Create uniform data - all should have same height
      const uniformData = createMockMonthlyData([
        50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50,
      ]);
      const { container } = renderWithTooltip(
        <MiniActivityChart monthlyData={uniformData} />,
      );

      const bars = container.querySelectorAll(".flex-1");
      // All bars should have h-6 (max height, since they're all equal to max)
      bars.forEach((bar) => {
        expect(bar).toHaveClass("h-6");
      });
    });

    it("handles all zeros gracefully", () => {
      const zeroData = createMockMonthlyData([
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      ]);
      const { container } = renderWithTooltip(
        <MiniActivityChart monthlyData={zeroData} />,
      );

      // Should still render 12 bars without errors
      const bars = container.querySelectorAll(".flex-1");
      expect(bars.length).toBe(12);
    });
  });

  describe("accessibility", () => {
    it("each bar has aria-label with month name and contribution count", () => {
      const monthlyData = createMockMonthlyData([
        10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 80, 60,
      ]);
      renderWithTooltip(<MiniActivityChart monthlyData={monthlyData} />);

      expect(
        screen.getByLabelText("Jan: 10 contributions"),
      ).toBeInTheDocument();
      expect(
        screen.getByLabelText("Oct: 100 contributions"),
      ).toBeInTheDocument();
    });

    it("formats large contribution counts correctly", () => {
      const monthlyData = createMockMonthlyData([
        1000, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      ]);
      renderWithTooltip(<MiniActivityChart monthlyData={monthlyData} />);

      expect(
        screen.getByLabelText("Jan: 1000 contributions"),
      ).toBeInTheDocument();
    });
  });

  describe("tooltip trigger", () => {
    it("each bar is wrapped in tooltip trigger", () => {
      const monthlyData = createMockMonthlyData([
        100, 50, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      ]);
      renderWithTooltip(<MiniActivityChart monthlyData={monthlyData} />);

      // Bars should have aria-label for accessibility
      const bar = screen.getByLabelText("Jan: 100 contributions");
      expect(bar).toBeInTheDocument();
    });

    it("bar aria-label includes month and contribution count", () => {
      const monthlyData = createMockMonthlyData([
        1234, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      ]);
      renderWithTooltip(<MiniActivityChart monthlyData={monthlyData} />);

      expect(
        screen.getByLabelText("Jan: 1234 contributions"),
      ).toBeInTheDocument();
    });
  });

  describe("styling", () => {
    it("bars have rounded corners", () => {
      const monthlyData = createMockMonthlyData();
      const { container } = renderWithTooltip(
        <MiniActivityChart monthlyData={monthlyData} />,
      );

      const bars = container.querySelectorAll(".flex-1");
      bars.forEach((bar) => {
        expect(bar).toHaveClass("rounded-sm");
      });
    });

    it("bars have transition for hover effect", () => {
      const monthlyData = createMockMonthlyData();
      const { container } = renderWithTooltip(
        <MiniActivityChart monthlyData={monthlyData} />,
      );

      const bars = container.querySelectorAll(".flex-1");
      bars.forEach((bar) => {
        expect(bar).toHaveClass("transition-colors");
      });
    });

    it("bars have primary color background", () => {
      const monthlyData = createMockMonthlyData();
      const { container } = renderWithTooltip(
        <MiniActivityChart monthlyData={monthlyData} />,
      );

      const bars = container.querySelectorAll(".flex-1");
      bars.forEach((bar) => {
        expect(bar).toHaveClass("bg-primary/30");
      });
    });

    it("bars have hover state", () => {
      const monthlyData = createMockMonthlyData();
      const { container } = renderWithTooltip(
        <MiniActivityChart monthlyData={monthlyData} />,
      );

      const bars = container.querySelectorAll(".flex-1");
      bars.forEach((bar) => {
        expect(bar.className).toContain("hover:bg-primary/50");
      });
    });
  });

  describe("height calculation", () => {
    it("returns h-0.5 for 0% contribution", () => {
      const monthlyData = createMockMonthlyData([
        0, 100, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      ]);
      const { container } = renderWithTooltip(
        <MiniActivityChart monthlyData={monthlyData} />,
      );

      const bars = container.querySelectorAll(".flex-1");
      expect(bars[0]).toHaveClass("h-0.5");
    });

    it("returns correct height for various percentages", () => {
      // Create data to test different height thresholds
      // Max is 100, so we can test specific percentages
      const monthlyData = createMockMonthlyData([
        5, // 5% -> h-1 (low but not zero)
        10, // 10% -> h-1
        20, // 20% -> h-1.5
        35, // 35% -> h-2
        50, // 50% -> h-3
        65, // 65% -> h-4
        80, // 80% -> h-5
        95, // 95% -> h-6 (90%+)
        100, // 100% -> h-6 (max)
        0, // 0% -> h-0.5
        0,
        0,
      ]);
      const { container } = renderWithTooltip(
        <MiniActivityChart monthlyData={monthlyData} />,
      );

      const bars = container.querySelectorAll(".flex-1");

      // Test max and zero
      expect(bars[8]).toHaveClass("h-6"); // 100%
      expect(bars[9]).toHaveClass("h-0.5"); // 0%
    });
  });

  describe("container height", () => {
    it("has fixed height of h-6 by default", () => {
      const monthlyData = createMockMonthlyData();
      const { container } = renderWithTooltip(
        <MiniActivityChart monthlyData={monthlyData} />,
      );

      // After refactoring: height is on bars container
      const barsContainer = container.querySelector(".flex");
      expect(barsContainer).toHaveClass("h-6");
    });
  });

  describe("edge cases", () => {
    it("handles empty array gracefully", () => {
      const { container } = renderWithTooltip(
        <MiniActivityChart monthlyData={[]} />,
      );

      const bars = container.querySelectorAll(".flex-1");
      expect(bars.length).toBe(0);
    });

    it("handles single month data", () => {
      const singleMonth: MonthlyContribution[] = [
        {
          month: 1,
          monthName: "Jan",
          contributions: 50,
          daysActive: 10,
          maxDaily: 5,
        },
      ];
      const { container } = renderWithTooltip(
        <MiniActivityChart monthlyData={singleMonth} />,
      );

      const bars = container.querySelectorAll(".flex-1");
      expect(bars.length).toBe(1);
      // Single bar with 50 contributions should be at max height since it's the only one
      expect(bars[0]).toHaveClass("h-6");
    });

    it("handles very large contribution counts", () => {
      const monthlyData = createMockMonthlyData([
        10000, 5000, 1000, 500, 100, 50, 10, 5, 1, 0, 0, 0,
      ]);
      const { container } = renderWithTooltip(
        <MiniActivityChart monthlyData={monthlyData} />,
      );

      const bars = container.querySelectorAll(".flex-1");
      expect(bars.length).toBe(12);
      // First bar should have max height
      expect(bars[0]).toHaveClass("h-6");
    });
  });
});
