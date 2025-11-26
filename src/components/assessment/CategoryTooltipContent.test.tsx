import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CategoryTooltipContent } from "./CategoryTooltipContent";

describe("CategoryTooltipContent", () => {
  const defaultProps = {
    category: "OUTPUT" as const,
    score: 75,
  };

  describe("Rendering", () => {
    it("renders category title and score", () => {
      render(<CategoryTooltipContent {...defaultProps} />);

      expect(screen.getByText("Output")).toBeInTheDocument();
      expect(screen.getByText("75%")).toBeInTheDocument();
    });

    it("renders category description", () => {
      render(<CategoryTooltipContent {...defaultProps} />);

      expect(
        screen.getByText(/Measures overall productivity/i)
      ).toBeInTheDocument();
    });

    it("renders calculation method", () => {
      render(<CategoryTooltipContent {...defaultProps} />);

      expect(screen.getByText("How it's calculated:")).toBeInTheDocument();
      expect(
        screen.getByText("Average of Activity and Impact scores")
      ).toBeInTheDocument();
    });

    it("renders metric badges", () => {
      render(<CategoryTooltipContent {...defaultProps} />);

      expect(screen.getByText("Activity")).toBeInTheDocument();
      expect(screen.getByText("Impact")).toBeInTheDocument();
    });
  });

  describe("All Categories", () => {
    const categories = [
      {
        category: "OUTPUT" as const,
        expectedTitle: "Output",
        expectedMetrics: ["Activity", "Impact"],
      },
      {
        category: "QUALITY" as const,
        expectedTitle: "Quality",
        expectedMetrics: ["Quality", "Consistency"],
      },
      {
        category: "TRUST" as const,
        expectedTitle: "Trust",
        expectedMetrics: ["Authenticity", "Collaboration"],
      },
    ];

    categories.forEach(({ category, expectedTitle, expectedMetrics }) => {
      it(`renders ${category} category correctly`, () => {
        render(<CategoryTooltipContent category={category} score={80} />);

        // Title may appear multiple times (e.g., "Quality" is both category and metric)
        const titles = screen.getAllByText(expectedTitle);
        expect(titles.length).toBeGreaterThan(0);
        expect(screen.getByText("80%")).toBeInTheDocument();

        expectedMetrics.forEach((metric) => {
          const metricElements = screen.getAllByText(metric);
          expect(metricElements.length).toBeGreaterThan(0);
        });
      });
    });
  });

  describe("Custom className", () => {
    it("applies custom className", () => {
      const { container } = render(
        <CategoryTooltipContent {...defaultProps} className="custom-class" />
      );

      expect(container.firstChild).toHaveClass("custom-class");
    });
  });

  describe("Edge Cases", () => {
    it("handles score of 0", () => {
      render(<CategoryTooltipContent {...defaultProps} score={0} />);

      expect(screen.getByText("0%")).toBeInTheDocument();
    });

    it("handles score of 100", () => {
      render(<CategoryTooltipContent {...defaultProps} score={100} />);

      expect(screen.getByText("100%")).toBeInTheDocument();
    });

    it("renders nothing for unknown category", () => {
      // @ts-expect-error - Testing unknown category
      const { container } = render(
        <CategoryTooltipContent category="UNKNOWN" score={50} />
      );

      expect(container.firstChild).toBeNull();
    });
  });
});
