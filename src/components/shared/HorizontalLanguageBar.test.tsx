import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { HorizontalLanguageBar, type LanguageBreakdown } from "./HorizontalLanguageBar";

describe("HorizontalLanguageBar", () => {
  const multiLanguages: LanguageBreakdown[] = [
    { name: "TypeScript", percent: 68 },
    { name: "JavaScript", percent: 20 },
    { name: "CSS", percent: 12 },
  ];

  const singleLanguage: LanguageBreakdown[] = [
    { name: "Rust", percent: 100 },
  ];

  describe("rendering", () => {
    it("should render the language bar", () => {
      render(<HorizontalLanguageBar languages={multiLanguages} />);

      // Check the bar container exists with proper role
      expect(screen.getByRole("img")).toBeInTheDocument();
    });

    it("should not render anything when languages array is empty", () => {
      const { container } = render(<HorizontalLanguageBar languages={[]} />);

      expect(container.firstChild).toBeNull();
    });

    it("should filter out zero-percent languages", () => {
      const languagesWithZero: LanguageBreakdown[] = [
        { name: "TypeScript", percent: 100 },
        { name: "JavaScript", percent: 0 },
      ];

      render(<HorizontalLanguageBar languages={languagesWithZero} showLegend />);

      expect(screen.getByText("TypeScript")).toBeInTheDocument();
      expect(screen.queryByText("JavaScript")).not.toBeInTheDocument();
    });
  });

  describe("legend", () => {
    it("should show legend when showLegend is true", () => {
      render(<HorizontalLanguageBar languages={multiLanguages} showLegend />);

      expect(screen.getByText("TypeScript")).toBeInTheDocument();
      expect(screen.getByText("JavaScript")).toBeInTheDocument();
      expect(screen.getByText("CSS")).toBeInTheDocument();
    });

    it("should not show legend when showLegend is false", () => {
      render(<HorizontalLanguageBar languages={multiLanguages} showLegend={false} />);

      expect(screen.queryByText("TypeScript")).not.toBeInTheDocument();
    });

    it("should show percentages when showPercentages is true", () => {
      render(
        <HorizontalLanguageBar
          languages={multiLanguages}
          showLegend
          showPercentages
        />
      );

      expect(screen.getByText("68%")).toBeInTheDocument();
      expect(screen.getByText("20%")).toBeInTheDocument();
    });

    it("should not show percentages when showPercentages is false", () => {
      render(
        <HorizontalLanguageBar
          languages={multiLanguages}
          showLegend
          showPercentages={false}
        />
      );

      expect(screen.queryByText("68%")).not.toBeInTheDocument();
    });

    it("should limit legend items based on maxLegendItems", () => {
      const manyLanguages: LanguageBreakdown[] = [
        { name: "TypeScript", percent: 40 },
        { name: "JavaScript", percent: 25 },
        { name: "Python", percent: 15 },
        { name: "Go", percent: 10 },
        { name: "Rust", percent: 10 },
      ];

      render(
        <HorizontalLanguageBar
          languages={manyLanguages}
          showLegend
          maxLegendItems={3}
        />
      );

      expect(screen.getByText("TypeScript")).toBeInTheDocument();
      expect(screen.getByText("JavaScript")).toBeInTheDocument();
      expect(screen.getByText("Python")).toBeInTheDocument();
      // These should be grouped as "Other"
      expect(screen.queryByText("Go")).not.toBeInTheDocument();
      expect(screen.queryByText("Rust")).not.toBeInTheDocument();
      expect(screen.getByText("Other")).toBeInTheDocument();
    });
  });

  describe("single language", () => {
    it("should render single language correctly", () => {
      render(<HorizontalLanguageBar languages={singleLanguage} showLegend />);

      expect(screen.getByText("Rust")).toBeInTheDocument();
    });
  });

  describe("accessibility", () => {
    it("should have aria-label describing language breakdown", () => {
      render(<HorizontalLanguageBar languages={multiLanguages} />);

      const bar = screen.getByRole("img");
      expect(bar).toHaveAttribute("aria-label");
      expect(bar.getAttribute("aria-label")).toContain("TypeScript");
    });
  });

  describe("compact mode", () => {
    it("should apply compact styles", () => {
      render(
        <HorizontalLanguageBar
          languages={multiLanguages}
          showLegend
          compact
        />
      );

      // Just verify it renders without error in compact mode
      expect(screen.getByText("TypeScript")).toBeInTheDocument();
    });
  });
});
