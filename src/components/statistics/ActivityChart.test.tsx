import type { CommitActivity } from "@/lib/statistics";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ActivityChart } from "./ActivityChart";

describe("ActivityChart", () => {
  const mockData: CommitActivity = {
    total: 1250,
    perDay: 3.4,
    perWeek: 24.0,
    perMonth: 104.2,
  };

  describe("Rendering", () => {
    it("should render chart with data", () => {
      render(<ActivityChart data={mockData} />);

      expect(screen.getByText("Commit Activity")).toBeInTheDocument();
      expect(
        screen.getByText(/average commits per time period/i),
      ).toBeInTheDocument();
    });

    it("should display total commits when showTotal is true", () => {
      render(<ActivityChart data={mockData} showTotal={true} />);

      expect(screen.getByText(/1,250 total/i)).toBeInTheDocument();
    });

    it("should not display total commits count when showTotal is false", () => {
      render(<ActivityChart data={mockData} showTotal={false} />);

      expect(screen.queryByText(/total commits/i)).not.toBeInTheDocument();
    });
  });

  describe("Chart Container", () => {
    it("should render chart container", () => {
      const { container } = render(<ActivityChart data={mockData} />);

      expect(
        container.querySelector('[data-slot="chart"]'),
      ).toBeInTheDocument();
    });
  });

  describe("Stats Cards", () => {
    it("should display per day statistics", () => {
      render(<ActivityChart data={mockData} />);

      expect(screen.getByText("Per Day")).toBeInTheDocument();
      expect(screen.getByText("3.4")).toBeInTheDocument();
      expect(screen.getByText("avg commits/day")).toBeInTheDocument();
    });

    it("should display per week statistics", () => {
      render(<ActivityChart data={mockData} />);

      expect(screen.getByText("Per Week")).toBeInTheDocument();
      expect(screen.getByText("24.0")).toBeInTheDocument();
      expect(screen.getByText("avg commits/week")).toBeInTheDocument();
    });

    it("should display per month statistics", () => {
      render(<ActivityChart data={mockData} />);

      expect(screen.getByText("Per Month")).toBeInTheDocument();
      expect(screen.getByText("104.2")).toBeInTheDocument();
      expect(screen.getByText("avg commits/month")).toBeInTheDocument();
    });

    it("should display total commits card when showTotal is true", () => {
      render(<ActivityChart data={mockData} showTotal={true} />);

      expect(screen.getByText("Total Commits")).toBeInTheDocument();
      expect(screen.getByText("1,250")).toBeInTheDocument();
    });

    it("should not display total commits card when showTotal is false", () => {
      render(<ActivityChart data={mockData} showTotal={false} />);

      expect(screen.queryByText("Total Commits")).not.toBeInTheDocument();
    });
  });

  describe("Loading State", () => {
    it("should show loading state when loading is true", () => {
      render(<ActivityChart data={null} loading={true} />);

      expect(
        screen.getByText("Loading activity statistics..."),
      ).toBeInTheDocument();
    });

    it("should show custom loading message", () => {
      render(
        <ActivityChart
          data={null}
          loading={true}
          loadingMessage="Analyzing commit patterns..."
        />,
      );

      expect(
        screen.getByText("Analyzing commit patterns..."),
      ).toBeInTheDocument();
    });

    it("should not show chart when loading", () => {
      render(<ActivityChart data={mockData} loading={true} />);

      expect(screen.queryByText("Commit Activity")).not.toBeInTheDocument();
    });
  });

  describe("Error State", () => {
    it("should show error state when error is provided", () => {
      const error = new Error("API Error");

      render(<ActivityChart data={null} error={error} />);

      expect(
        screen.getByText("Failed to load activity statistics"),
      ).toBeInTheDocument();
      expect(screen.getByText("API Error")).toBeInTheDocument();
    });

    it("should show custom error title and description", () => {
      const error = new Error("Calculation failed");

      render(
        <ActivityChart
          data={null}
          error={error}
          errorTitle="Calculation Error"
          errorDescription="Not enough data to calculate statistics"
        />,
      );

      expect(screen.getByText("Calculation Error")).toBeInTheDocument();
      expect(
        screen.getByText("Not enough data to calculate statistics"),
      ).toBeInTheDocument();
    });

    it("should not show chart when error exists", () => {
      const error = new Error("Test error");

      render(<ActivityChart data={mockData} error={error} />);

      expect(screen.queryByText("Commit Activity")).not.toBeInTheDocument();
    });
  });

  describe("Empty State", () => {
    it("should show empty state when data is null", () => {
      render(<ActivityChart data={null} />);

      expect(screen.getByText("No Activity Data")).toBeInTheDocument();
      expect(
        screen.getByText("No commit activity statistics available."),
      ).toBeInTheDocument();
    });

    it("should show custom empty title and description", () => {
      render(
        <ActivityChart
          data={null}
          emptyTitle="No Commits Yet"
          emptyDescription="Start contributing to see statistics"
        />,
      );

      expect(screen.getByText("No Commits Yet")).toBeInTheDocument();
      expect(
        screen.getByText("Start contributing to see statistics"),
      ).toBeInTheDocument();
    });
  });

  describe("State Priority", () => {
    it("should show loading state over error state", () => {
      const error = new Error("Test error");

      render(<ActivityChart data={null} loading={true} error={error} />);

      expect(
        screen.getByText("Loading activity statistics..."),
      ).toBeInTheDocument();
      expect(
        screen.queryByText("Failed to load activity statistics"),
      ).not.toBeInTheDocument();
    });

    it("should show loading state over empty state", () => {
      render(<ActivityChart data={null} loading={true} />);

      expect(
        screen.getByText("Loading activity statistics..."),
      ).toBeInTheDocument();
      expect(screen.queryByText("No Activity Data")).not.toBeInTheDocument();
    });

    it("should show error state over empty state", () => {
      const error = new Error("Test error");

      render(<ActivityChart data={null} error={error} />);

      expect(
        screen.getByText("Failed to load activity statistics"),
      ).toBeInTheDocument();
      expect(screen.queryByText("No Activity Data")).not.toBeInTheDocument();
    });
  });

  describe("Number Formatting", () => {
    it("should format large numbers with commas", () => {
      const largeData: CommitActivity = {
        total: 10000,
        perDay: 27.4,
        perWeek: 191.8,
        perMonth: 833.3,
      };

      render(<ActivityChart data={largeData} />);

      expect(screen.getByText("10,000")).toBeInTheDocument();
    });

    it("should format decimal values to one decimal place", () => {
      render(<ActivityChart data={mockData} />);

      expect(screen.getByText("3.4")).toBeInTheDocument();
      expect(screen.getByText("24.0")).toBeInTheDocument();
      expect(screen.getByText("104.2")).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("should handle zero commits", () => {
      const zeroData: CommitActivity = {
        total: 0,
        perDay: 0.0,
        perWeek: 0.0,
        perMonth: 0.0,
      };

      render(<ActivityChart data={zeroData} />);

      expect(screen.getByText(/0 total/i)).toBeInTheDocument();
      const zeroTexts = screen.getAllByText("0.0");
      expect(zeroTexts.length).toBeGreaterThan(0);
    });

    it("should handle very low activity (< 1 per day)", () => {
      const lowData: CommitActivity = {
        total: 50,
        perDay: 0.1,
        perWeek: 1.0,
        perMonth: 4.2,
      };

      render(<ActivityChart data={lowData} />);

      expect(screen.getByText("0.1")).toBeInTheDocument();
      expect(screen.getByText("1.0")).toBeInTheDocument();
      expect(screen.getByText("4.2")).toBeInTheDocument();
    });

    it("should handle very high activity", () => {
      const highData: CommitActivity = {
        total: 5000,
        perDay: 13.7,
        perWeek: 95.9,
        perMonth: 416.7,
      };

      render(<ActivityChart data={highData} />);

      expect(screen.getByText("13.7")).toBeInTheDocument();
      expect(screen.getByText("95.9")).toBeInTheDocument();
      expect(screen.getByText("416.7")).toBeInTheDocument();
    });

    it("should handle single commit", () => {
      const singleData: CommitActivity = {
        total: 1,
        perDay: 0.0,
        perWeek: 0.0,
        perMonth: 0.1,
      };

      render(<ActivityChart data={singleData} />);

      expect(screen.getByText(/1 total/i)).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("should have accessible structure", () => {
      const { container } = render(<ActivityChart data={mockData} />);

      expect(
        container.querySelector('[data-slot="chart"]'),
      ).toBeInTheDocument();
    });

    it("should have heading for chart title", () => {
      render(<ActivityChart data={mockData} />);

      const heading = screen.getByRole("heading", { name: /commit activity/i });
      expect(heading).toBeInTheDocument();
    });

    it("should have aria-hidden on decorative icons", () => {
      const { container } = render(<ActivityChart data={mockData} />);

      const icons = container.querySelectorAll('[aria-hidden="true"]');
      expect(icons.length).toBeGreaterThan(0);
    });
  });

  describe("Chart Data Transformation", () => {
    it("should create three data points (daily, weekly, monthly)", () => {
      render(<ActivityChart data={mockData} />);

      expect(screen.getByText("Per Day")).toBeInTheDocument();
      expect(screen.getByText("Per Week")).toBeInTheDocument();
      expect(screen.getByText("Per Month")).toBeInTheDocument();
    });

    it("should use correct values from data", () => {
      const testData: CommitActivity = {
        total: 100,
        perDay: 1.5,
        perWeek: 10.5,
        perMonth: 45.6,
      };

      render(<ActivityChart data={testData} />);

      expect(screen.getByText("1.5")).toBeInTheDocument();
      expect(screen.getByText("10.5")).toBeInTheDocument();
      expect(screen.getByText("45.6")).toBeInTheDocument();
    });
  });
});
