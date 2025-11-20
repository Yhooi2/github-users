import type { LanguageStats } from "@/lib/statistics";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { LanguageChart } from "./LanguageChart";

describe("LanguageChart", () => {
  const mockData: LanguageStats[] = [
    { name: "TypeScript", size: 500000, percentage: 45.5, repositoryCount: 8 },
    { name: "JavaScript", size: 300000, percentage: 27.3, repositoryCount: 12 },
    { name: "Python", size: 150000, percentage: 13.6, repositoryCount: 5 },
    { name: "CSS", size: 100000, percentage: 9.1, repositoryCount: 10 },
    { name: "HTML", size: 50000, percentage: 4.5, repositoryCount: 8 },
  ];

  describe("Rendering", () => {
    it("should render chart with data", () => {
      render(<LanguageChart data={mockData} />);

      expect(screen.getByText("Language Distribution")).toBeInTheDocument();
    });

    it("should display number of languages", () => {
      render(<LanguageChart data={mockData} />);

      expect(
        screen.getByText(/5 languages across repositories/i),
      ).toBeInTheDocument();
    });

    it("should display all languages in the list", () => {
      render(<LanguageChart data={mockData} />);

      expect(screen.getByText("TypeScript")).toBeInTheDocument();
      expect(screen.getByText("JavaScript")).toBeInTheDocument();
      expect(screen.getByText("Python")).toBeInTheDocument();
      expect(screen.getByText("CSS")).toBeInTheDocument();
      expect(screen.getByText("HTML")).toBeInTheDocument();
    });
  });

  describe("Chart Variants", () => {
    it("should render chart container by default", () => {
      const { container } = render(<LanguageChart data={mockData} />);

      expect(
        container.querySelector('[data-slot="chart"]'),
      ).toBeInTheDocument();
    });

    it('should render chart container when variant is "pie"', () => {
      const { container } = render(
        <LanguageChart data={mockData} variant="pie" />,
      );

      expect(
        container.querySelector('[data-slot="chart"]'),
      ).toBeInTheDocument();
    });

    it('should render chart container when variant is "donut"', () => {
      const { container } = render(
        <LanguageChart data={mockData} variant="donut" />,
      );

      expect(
        container.querySelector('[data-slot="chart"]'),
      ).toBeInTheDocument();
    });
  });

  describe("Language Grouping", () => {
    const manyLanguages: LanguageStats[] = [
      {
        name: "TypeScript",
        size: 500000,
        percentage: 35.0,
        repositoryCount: 8,
      },
      {
        name: "JavaScript",
        size: 300000,
        percentage: 21.0,
        repositoryCount: 12,
      },
      { name: "Python", size: 200000, percentage: 14.0, repositoryCount: 5 },
      { name: "Java", size: 150000, percentage: 10.5, repositoryCount: 4 },
      { name: "Go", size: 100000, percentage: 7.0, repositoryCount: 3 },
      { name: "Rust", size: 80000, percentage: 5.6, repositoryCount: 2 },
      { name: "C++", size: 50000, percentage: 3.5, repositoryCount: 2 },
    ];

    it("should group languages beyond maxLanguages limit", () => {
      render(<LanguageChart data={manyLanguages} maxLanguages={5} />);

      // Top 5 languages shown
      expect(screen.getByText("TypeScript")).toBeInTheDocument();
      expect(screen.getByText("JavaScript")).toBeInTheDocument();
      expect(screen.getByText("Python")).toBeInTheDocument();
      expect(screen.getByText("Java")).toBeInTheDocument();
      expect(screen.getByText("Go")).toBeInTheDocument();

      // Others grouped
      expect(screen.getByText("Other")).toBeInTheDocument();
    });

    it("should show note about grouped languages", () => {
      render(<LanguageChart data={manyLanguages} maxLanguages={5} />);

      expect(
        screen.getByText(/includes 2 additional languages/i),
      ).toBeInTheDocument();
      expect(screen.getByText(/Rust, C\+\+/i)).toBeInTheDocument();
    });

    it('should show "showing top N" message when languages are grouped', () => {
      render(<LanguageChart data={manyLanguages} maxLanguages={5} />);

      expect(screen.getByText(/showing top 5/i)).toBeInTheDocument();
    });

    it("should not group when maxLanguages is high enough", () => {
      render(<LanguageChart data={manyLanguages} maxLanguages={10} />);

      expect(screen.queryByText("Other")).not.toBeInTheDocument();
      expect(
        screen.queryByText(/includes.*additional/i),
      ).not.toBeInTheDocument();
    });
  });

  describe("Single Language", () => {
    it("should handle single language correctly", () => {
      const singleLang: LanguageStats[] = [
        {
          name: "TypeScript",
          size: 1000000,
          percentage: 100,
          repositoryCount: 15,
        },
      ];

      render(<LanguageChart data={singleLang} />);

      expect(
        screen.getByText(/1 language across repositories/i),
      ).toBeInTheDocument();
      expect(screen.getByText("TypeScript")).toBeInTheDocument();
    });
  });

  describe("Loading State", () => {
    it("should show loading state when loading is true", () => {
      render(<LanguageChart data={[]} loading={true} />);

      expect(
        screen.getByText("Loading language statistics..."),
      ).toBeInTheDocument();
    });

    it("should show custom loading message", () => {
      render(
        <LanguageChart
          data={[]}
          loading={true}
          loadingMessage="Analyzing code languages..."
        />,
      );

      expect(
        screen.getByText("Analyzing code languages..."),
      ).toBeInTheDocument();
    });

    it("should not show chart when loading", () => {
      render(<LanguageChart data={mockData} loading={true} />);

      expect(
        screen.queryByText("Language Distribution"),
      ).not.toBeInTheDocument();
    });
  });

  describe("Error State", () => {
    it("should show error state when error is provided", () => {
      const error = new Error("API Error");

      render(<LanguageChart data={[]} error={error} />);

      expect(
        screen.getByText("Failed to load language statistics"),
      ).toBeInTheDocument();
      expect(screen.getByText("API Error")).toBeInTheDocument();
    });

    it("should show custom error title and description", () => {
      const error = new Error("Network Error");

      render(
        <LanguageChart
          data={[]}
          error={error}
          errorTitle="Language Analysis Failed"
          errorDescription="Unable to analyze languages"
        />,
      );

      expect(screen.getByText("Language Analysis Failed")).toBeInTheDocument();
      expect(
        screen.getByText("Unable to analyze languages"),
      ).toBeInTheDocument();
    });

    it("should not show chart when error exists", () => {
      const error = new Error("Test error");

      render(<LanguageChart data={mockData} error={error} />);

      expect(
        screen.queryByText("Language Distribution"),
      ).not.toBeInTheDocument();
    });
  });

  describe("Empty State", () => {
    it("should show empty state when data is empty array", () => {
      render(<LanguageChart data={[]} />);

      expect(screen.getByText("No Language Data")).toBeInTheDocument();
      expect(
        screen.getByText("No programming language statistics available."),
      ).toBeInTheDocument();
    });

    it("should show custom empty title and description", () => {
      render(
        <LanguageChart
          data={[]}
          emptyTitle="No Languages Detected"
          emptyDescription="No languages found"
        />,
      );

      expect(screen.getByText("No Languages Detected")).toBeInTheDocument();
      expect(screen.getByText("No languages found")).toBeInTheDocument();
    });
  });

  describe("State Priority", () => {
    it("should show loading state over error state", () => {
      const error = new Error("Test error");

      render(<LanguageChart data={[]} loading={true} error={error} />);

      expect(
        screen.getByText("Loading language statistics..."),
      ).toBeInTheDocument();
      expect(
        screen.queryByText("Failed to load language statistics"),
      ).not.toBeInTheDocument();
    });

    it("should show loading state over empty state", () => {
      render(<LanguageChart data={[]} loading={true} />);

      expect(
        screen.getByText("Loading language statistics..."),
      ).toBeInTheDocument();
      expect(screen.queryByText("No Language Data")).not.toBeInTheDocument();
    });

    it("should show error state over empty state", () => {
      const error = new Error("Test error");

      render(<LanguageChart data={[]} error={error} />);

      expect(
        screen.getByText("Failed to load language statistics"),
      ).toBeInTheDocument();
      expect(screen.queryByText("No Language Data")).not.toBeInTheDocument();
    });
  });

  describe("Legend", () => {
    it("should render with legend by default", () => {
      const { container } = render(<LanguageChart data={mockData} />);

      // Check chart container exists
      expect(
        container.querySelector('[data-slot="chart"]'),
      ).toBeInTheDocument();
    });

    it("should render without legend when showLegend is false", () => {
      const { container } = render(
        <LanguageChart data={mockData} showLegend={false} />,
      );

      // Check chart container exists
      expect(
        container.querySelector('[data-slot="chart"]'),
      ).toBeInTheDocument();
    });
  });

  describe("Language List Display", () => {
    it("should display language percentages", () => {
      render(<LanguageChart data={mockData} />);

      // Check for percentage display (formatted to 1 decimal)
      expect(screen.getByText("45.5%")).toBeInTheDocument();
      expect(screen.getByText("27.3%")).toBeInTheDocument();
    });

    it("should display formatted byte sizes", () => {
      render(<LanguageChart data={mockData} />);

      // formatBytes should format the sizes - check for "KB" or "MB" text
      const texts = screen.getAllByText(/KB|MB/i);
      expect(texts.length).toBeGreaterThan(0);
    });

    it("should display repository counts", () => {
      render(<LanguageChart data={mockData} />);

      // Check for "repos" text (multiple repositories)
      expect(screen.getAllByText(/repos/i).length).toBeGreaterThan(0);
    });

    it('should use singular "repo" for count of 1', () => {
      const singleRepoData: LanguageStats[] = [
        {
          name: "TypeScript",
          size: 100000,
          percentage: 100,
          repositoryCount: 1,
        },
      ];

      render(<LanguageChart data={singleRepoData} />);

      // Check for singular "repo" (not "repos")
      expect(screen.getByText(/1 repo$/i)).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("should handle two languages", () => {
      const twoLangs: LanguageStats[] = [
        {
          name: "TypeScript",
          size: 600000,
          percentage: 60,
          repositoryCount: 8,
        },
        {
          name: "JavaScript",
          size: 400000,
          percentage: 40,
          repositoryCount: 5,
        },
      ];

      render(<LanguageChart data={twoLangs} />);

      expect(screen.getByText(/2 languages/i)).toBeInTheDocument();
      expect(screen.getByText("TypeScript")).toBeInTheDocument();
      expect(screen.getByText("JavaScript")).toBeInTheDocument();
    });

    it("should handle maxLanguages of 3", () => {
      render(<LanguageChart data={mockData} maxLanguages={3} />);

      expect(screen.getByText("TypeScript")).toBeInTheDocument();
      expect(screen.getByText("JavaScript")).toBeInTheDocument();
      expect(screen.getByText("Python")).toBeInTheDocument();
      expect(screen.getByText("Other")).toBeInTheDocument();
    });

    it("should handle zero percentage language", () => {
      const zeroPercentData: LanguageStats[] = [
        { name: "TypeScript", size: 1000, percentage: 100, repositoryCount: 1 },
        { name: "Other", size: 0, percentage: 0, repositoryCount: 0 },
      ];

      render(<LanguageChart data={zeroPercentData} />);

      expect(screen.getByText("TypeScript")).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("should have accessible structure", () => {
      const { container } = render(<LanguageChart data={mockData} />);

      expect(
        container.querySelector('[data-slot="chart"]'),
      ).toBeInTheDocument();
    });

    it("should have heading for chart title", () => {
      render(<LanguageChart data={mockData} />);

      const heading = screen.getByRole("heading", {
        name: /language distribution/i,
      });
      expect(heading).toBeInTheDocument();
    });
  });
});
