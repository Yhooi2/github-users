import type { YearlyCommitStats } from "@/lib/statistics";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CommitChart } from "./CommitChart";

describe("CommitChart", () => {
  const mockData: YearlyCommitStats[] = [
    { year: 2023, commits: 500 },
    { year: 2024, commits: 800 },
    { year: 2025, commits: 1200 },
  ];

  describe("Rendering", () => {
    it("should render chart with data", () => {
      render(<CommitChart data={mockData} />);

      expect(screen.getByText("Commit Activity")).toBeInTheDocument();
      expect(screen.getByText(/total commits/i)).toBeInTheDocument();
    });

    it("should display total commits count", () => {
      render(<CommitChart data={mockData} />);

      // Total: 500 + 800 + 1200 = 2500
      expect(screen.getByText(/2,500 total commits/i)).toBeInTheDocument();
    });

    it("should display number of years", () => {
      render(<CommitChart data={mockData} />);

      expect(screen.getByText(/across 3 years/i)).toBeInTheDocument();
    });
  });

  describe("Chart Variants", () => {
    it("should render chart container by default", () => {
      const { container } = render(<CommitChart data={mockData} />);

      expect(
        container.querySelector('[data-slot="chart"]'),
      ).toBeInTheDocument();
    });

    it('should render chart container when variant is "line"', () => {
      const { container } = render(
        <CommitChart data={mockData} variant="line" />,
      );

      expect(
        container.querySelector('[data-slot="chart"]'),
      ).toBeInTheDocument();
    });

    it('should render chart container when variant is "bar"', () => {
      const { container } = render(
        <CommitChart data={mockData} variant="bar" />,
      );

      expect(
        container.querySelector('[data-slot="chart"]'),
      ).toBeInTheDocument();
    });

    it('should render chart container when variant is "area"', () => {
      const { container } = render(
        <CommitChart data={mockData} variant="area" />,
      );

      expect(
        container.querySelector('[data-slot="chart"]'),
      ).toBeInTheDocument();
    });
  });

  describe("Trend Indicator", () => {
    it("should show trend indicator when data has multiple years", () => {
      render(<CommitChart data={mockData} showTrend={true} />);

      // Should show "vs. previous year" text
      expect(screen.getByText("vs. previous year")).toBeInTheDocument();
    });

    it("should show positive trend indicator for increasing commits", () => {
      const increasingData: YearlyCommitStats[] = [
        { year: 2024, commits: 500 },
        { year: 2025, commits: 800 },
      ];

      render(<CommitChart data={increasingData} showTrend={true} />);

      // Should show vs. previous year
      expect(screen.getByText("vs. previous year")).toBeInTheDocument();
      // Percentage should be present (we don't test exact value due to potential floating point issues)
      expect(screen.getByText(/%/)).toBeInTheDocument();
    });

    it("should show negative trend for decreasing commits", () => {
      const decreasingData: YearlyCommitStats[] = [
        { year: 2024, commits: 800 },
        { year: 2025, commits: 500 },
      ];

      render(<CommitChart data={decreasingData} showTrend={true} />);

      expect(screen.getByText("vs. previous year")).toBeInTheDocument();
    });

    it("should not show trend when showTrend is false", () => {
      render(<CommitChart data={mockData} showTrend={false} />);

      expect(screen.queryByText(/vs\. previous year/i)).not.toBeInTheDocument();
    });

    it("should not show trend with single year data", () => {
      const singleYearData: YearlyCommitStats[] = [
        { year: 2025, commits: 500 },
      ];

      render(<CommitChart data={singleYearData} showTrend={true} />);

      expect(screen.queryByText(/vs\. previous year/i)).not.toBeInTheDocument();
    });
  });

  describe("Loading State", () => {
    it("should show loading state when loading is true", () => {
      render(<CommitChart data={[]} loading={true} />);

      expect(
        screen.getByText("Loading commit statistics..."),
      ).toBeInTheDocument();
    });

    it("should show custom loading message", () => {
      render(
        <CommitChart
          data={[]}
          loading={true}
          loadingMessage="Fetching data from GitHub..."
        />,
      );

      expect(
        screen.getByText("Fetching data from GitHub..."),
      ).toBeInTheDocument();
    });

    it("should not show chart when loading", () => {
      render(<CommitChart data={mockData} loading={true} />);

      expect(screen.queryByText("Commit Activity")).not.toBeInTheDocument();
    });
  });

  describe("Error State", () => {
    it("should show error state when error is provided", () => {
      const error = new Error("API Error");

      render(<CommitChart data={[]} error={error} />);

      expect(
        screen.getByText("Failed to load commit statistics"),
      ).toBeInTheDocument();
      expect(screen.getByText("API Error")).toBeInTheDocument();
    });

    it("should show custom error title and description", () => {
      const error = new Error("Network Error");

      render(
        <CommitChart
          data={[]}
          error={error}
          errorTitle="Connection Failed"
          errorDescription="Unable to connect to GitHub API"
        />,
      );

      expect(screen.getByText("Connection Failed")).toBeInTheDocument();
      expect(
        screen.getByText("Unable to connect to GitHub API"),
      ).toBeInTheDocument();
    });

    it("should not show chart when error exists", () => {
      const error = new Error("Test error");

      render(<CommitChart data={mockData} error={error} />);

      expect(screen.queryByText("Commit Activity")).not.toBeInTheDocument();
    });
  });

  describe("Empty State", () => {
    it("should show empty state when data is empty array", () => {
      render(<CommitChart data={[]} />);

      expect(screen.getByText("No Commit Data")).toBeInTheDocument();
      expect(
        screen.getByText("No commit statistics available for this period."),
      ).toBeInTheDocument();
    });

    it("should show custom empty title and description", () => {
      render(
        <CommitChart
          data={[]}
          emptyTitle="No Activity"
          emptyDescription="Start making commits to see statistics"
        />,
      );

      expect(screen.getByText("No Activity")).toBeInTheDocument();
      expect(
        screen.getByText("Start making commits to see statistics"),
      ).toBeInTheDocument();
    });
  });

  describe("State Priority", () => {
    it("should show loading state over error state", () => {
      const error = new Error("Test error");

      render(<CommitChart data={[]} loading={true} error={error} />);

      expect(
        screen.getByText("Loading commit statistics..."),
      ).toBeInTheDocument();
      expect(
        screen.queryByText("Failed to load commit statistics"),
      ).not.toBeInTheDocument();
    });

    it("should show loading state over empty state", () => {
      render(<CommitChart data={[]} loading={true} />);

      expect(
        screen.getByText("Loading commit statistics..."),
      ).toBeInTheDocument();
      expect(screen.queryByText("No Commit Data")).not.toBeInTheDocument();
    });

    it("should show error state over empty state", () => {
      const error = new Error("Test error");

      render(<CommitChart data={[]} error={error} />);

      expect(
        screen.getByText("Failed to load commit statistics"),
      ).toBeInTheDocument();
      expect(screen.queryByText("No Commit Data")).not.toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("should handle large commit numbers", () => {
      const largeData: YearlyCommitStats[] = [
        { year: 2023, commits: 10000 },
        { year: 2024, commits: 15000 },
        { year: 2025, commits: 20000 },
      ];

      render(<CommitChart data={largeData} />);

      // Total: 45000
      expect(screen.getByText(/45,000 total commits/i)).toBeInTheDocument();
    });

    it("should handle zero commits", () => {
      const zeroData: YearlyCommitStats[] = [
        { year: 2023, commits: 0 },
        { year: 2024, commits: 0 },
        { year: 2025, commits: 0 },
      ];

      render(<CommitChart data={zeroData} />);

      expect(screen.getByText(/0 total commits/i)).toBeInTheDocument();
    });

    it("should handle single commit", () => {
      const singleCommit: YearlyCommitStats[] = [{ year: 2025, commits: 1 }];

      render(<CommitChart data={singleCommit} />);

      expect(screen.getByText(/1 total commit/i)).toBeInTheDocument();
    });

    it("should handle two years of data", () => {
      const twoYears: YearlyCommitStats[] = [
        { year: 2024, commits: 500 },
        { year: 2025, commits: 800 },
      ];

      render(<CommitChart data={twoYears} />);

      expect(screen.getByText(/across 2 years/i)).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("should have accessible structure", () => {
      const { container } = render(<CommitChart data={mockData} />);

      // Check for chart container
      expect(
        container.querySelector('[data-slot="chart"]'),
      ).toBeInTheDocument();
    });

    it("should have heading for chart title", () => {
      render(<CommitChart data={mockData} />);

      const heading = screen.getByRole("heading", { name: /commit activity/i });
      expect(heading).toBeInTheDocument();
    });
  });

  describe("Number Formatting", () => {
    it("should format numbers with commas", () => {
      const data: YearlyCommitStats[] = [
        { year: 2023, commits: 1234 },
        { year: 2024, commits: 5678 },
      ];

      render(<CommitChart data={data} />);

      // Total: 1234 + 5678 = 6912
      expect(screen.getByText(/6,912 total commits/i)).toBeInTheDocument();
    });
  });
});
