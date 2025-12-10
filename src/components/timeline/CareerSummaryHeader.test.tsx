import type { CareerSummary } from "@/lib/year-badges";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CareerSummaryHeader } from "./CareerSummaryHeader";

// Helper to create mock career summary
const createMockSummary = (
  overrides: Partial<CareerSummary> = {},
): CareerSummary => ({
  totalCommits: 1500,
  totalPRs: 150,
  yearsActive: 5,
  totalYears: 6,
  startYear: 2019,
  uniqueRepos: 25,
  ...overrides,
});

describe("CareerSummaryHeader", () => {
  describe("rendering", () => {
    it("renders the header title", () => {
      const summary = createMockSummary();
      render(<CareerSummaryHeader summary={summary} />);

      expect(screen.getByText("История активности")).toBeInTheDocument();
    });

    it("renders total commits", () => {
      const summary = createMockSummary({ totalCommits: 1500 });
      render(<CareerSummaryHeader summary={summary} />);

      expect(screen.getByText("1,500")).toBeInTheDocument();
    });

    it("renders years active", () => {
      const summary = createMockSummary({ yearsActive: 5 });
      render(<CareerSummaryHeader summary={summary} />);

      expect(screen.getByText("5")).toBeInTheDocument();
    });

    it("renders start year", () => {
      const summary = createMockSummary({ startYear: 2019 });
      render(<CareerSummaryHeader summary={summary} />);

      expect(screen.getByText(/На GitHub с 2019 года/)).toBeInTheDocument();
    });
  });

  describe("number formatting", () => {
    it("formats large commit counts with locale separators", () => {
      const summary = createMockSummary({ totalCommits: 12345 });
      render(<CareerSummaryHeader summary={summary} />);

      expect(screen.getByText("12,345")).toBeInTheDocument();
    });

    it("formats small commit counts correctly", () => {
      const summary = createMockSummary({ totalCommits: 42 });
      render(<CareerSummaryHeader summary={summary} />);

      expect(screen.getByText("42")).toBeInTheDocument();
    });

    it("formats PR counts with locale separators", () => {
      const summary = createMockSummary({ totalPRs: 1234 });
      render(<CareerSummaryHeader summary={summary} />);

      expect(screen.getByText("1,234")).toBeInTheDocument();
    });
  });

  describe("pull requests display", () => {
    it("shows PR count when greater than 0", () => {
      const summary = createMockSummary({ totalPRs: 150 });
      render(<CareerSummaryHeader summary={summary} />);

      expect(screen.getByText("150")).toBeInTheDocument();
      expect(screen.getByText(/pull requests/)).toBeInTheDocument();
    });

    it("does not show PR line when totalPRs is 0", () => {
      const summary = createMockSummary({ totalPRs: 0 });
      render(<CareerSummaryHeader summary={summary} />);

      expect(screen.queryByText(/pull requests/)).not.toBeInTheDocument();
    });

    it("shows PR count when it is 1", () => {
      const summary = createMockSummary({ totalPRs: 1 });
      render(<CareerSummaryHeader summary={summary} />);

      expect(screen.getByText("1")).toBeInTheDocument();
      expect(screen.getByText(/pull requests/)).toBeInTheDocument();
    });
  });

  describe("text content", () => {
    it("shows Russian text for commits", () => {
      const summary = createMockSummary();
      render(<CareerSummaryHeader summary={summary} />);

      expect(screen.getByText(/коммитов за/)).toBeInTheDocument();
    });

    it("shows Russian text for years", () => {
      const summary = createMockSummary();
      render(<CareerSummaryHeader summary={summary} />);

      expect(screen.getByText(/лет$/)).toBeInTheDocument();
    });

    it("shows Russian text for GitHub start year", () => {
      const summary = createMockSummary({ startYear: 2020 });
      render(<CareerSummaryHeader summary={summary} />);

      expect(screen.getByText(/На GitHub с 2020 года/)).toBeInTheDocument();
    });
  });

  describe("styling", () => {
    it("has border-b class for bottom border", () => {
      const summary = createMockSummary();
      const { container } = render(<CareerSummaryHeader summary={summary} />);

      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass("border-b");
    });

    it("has padding class", () => {
      const summary = createMockSummary();
      const { container } = render(<CareerSummaryHeader summary={summary} />);

      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass("p-4");
    });

    it("has space-y-3 for vertical spacing", () => {
      const summary = createMockSummary();
      const { container } = render(<CareerSummaryHeader summary={summary} />);

      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass("space-y-3");
    });

    it("header has muted text color", () => {
      const summary = createMockSummary();
      render(<CareerSummaryHeader summary={summary} />);

      const header = screen.getByText("История активности");
      expect(header).toHaveClass("text-muted-foreground");
    });

    it("header is semibold", () => {
      const summary = createMockSummary();
      render(<CareerSummaryHeader summary={summary} />);

      const header = screen.getByText("История активности");
      expect(header).toHaveClass("font-semibold");
    });
  });

  describe("highlighted values styling", () => {
    it("commits value has foreground color", () => {
      const summary = createMockSummary({ totalCommits: 1500 });
      render(<CareerSummaryHeader summary={summary} />);

      const commitsValue = screen.getByText("1,500");
      expect(commitsValue).toHaveClass("text-foreground");
    });

    it("commits value is bold", () => {
      const summary = createMockSummary({ totalCommits: 1500 });
      render(<CareerSummaryHeader summary={summary} />);

      const commitsValue = screen.getByText("1,500");
      expect(commitsValue).toHaveClass("font-medium");
    });

    it("years value has foreground color", () => {
      const summary = createMockSummary({ yearsActive: 5 });
      render(<CareerSummaryHeader summary={summary} />);

      const yearsValue = screen.getByText("5");
      expect(yearsValue).toHaveClass("text-foreground");
    });
  });

  describe("edge cases", () => {
    it("handles 0 commits", () => {
      const summary = createMockSummary({ totalCommits: 0 });
      render(<CareerSummaryHeader summary={summary} />);

      expect(screen.getByText("0")).toBeInTheDocument();
    });

    it("handles 1 year active", () => {
      const summary = createMockSummary({ yearsActive: 1 });
      render(<CareerSummaryHeader summary={summary} />);

      expect(screen.getByText("1")).toBeInTheDocument();
    });

    it("handles very large commit counts", () => {
      const summary = createMockSummary({ totalCommits: 1000000 });
      render(<CareerSummaryHeader summary={summary} />);

      expect(screen.getByText("1,000,000")).toBeInTheDocument();
    });

    it("handles recent start year", () => {
      const summary = createMockSummary({ startYear: 2024 });
      render(<CareerSummaryHeader summary={summary} />);

      expect(screen.getByText(/На GitHub с 2024 года/)).toBeInTheDocument();
    });

    it("handles old start year", () => {
      const summary = createMockSummary({ startYear: 2008 });
      render(<CareerSummaryHeader summary={summary} />);

      expect(screen.getByText(/На GitHub с 2008 года/)).toBeInTheDocument();
    });
  });

  describe("GitHub start year text", () => {
    it("uses small text for start year", () => {
      const summary = createMockSummary({ startYear: 2019 });
      render(<CareerSummaryHeader summary={summary} />);

      const startYearText = screen.getByText(/На GitHub с 2019 года/);
      expect(startYearText).toHaveClass("text-xs");
    });
  });
});
