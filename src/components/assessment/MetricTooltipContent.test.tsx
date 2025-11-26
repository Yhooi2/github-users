import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MetricTooltipContent } from "./MetricTooltipContent";

describe("MetricTooltipContent", () => {
  const defaultProps = {
    metricKey: "activity" as const,
    score: 85,
  };

  describe("Rendering", () => {
    it("renders metric title and score", () => {
      render(<MetricTooltipContent {...defaultProps} />);

      expect(screen.getByText("Activity")).toBeInTheDocument();
      expect(screen.getByText("85%")).toBeInTheDocument();
    });

    it("renders metric description", () => {
      render(<MetricTooltipContent {...defaultProps} />);

      expect(
        screen.getByText("Recent coding activity, consistency, and project diversity")
      ).toBeInTheDocument();
    });

    it("renders breakdown when provided", () => {
      const breakdown = {
        recentCommits: 35,
        consistency: 27,
        diversity: 23,
      };

      render(<MetricTooltipContent {...defaultProps} breakdown={breakdown} />);

      expect(screen.getByText("Commits in last 3 months")).toBeInTheDocument();
      expect(screen.getByText("35")).toBeInTheDocument();
      expect(screen.getByText("Active months in last year")).toBeInTheDocument();
      expect(screen.getByText("27")).toBeInTheDocument();
      expect(screen.getByText("Unique repositories")).toBeInTheDocument();
      expect(screen.getByText("23")).toBeInTheDocument();
    });

    it("does not render breakdown when empty", () => {
      render(<MetricTooltipContent {...defaultProps} breakdown={{}} />);

      // Should not have border-t which separates breakdown from description
      const { container } = render(
        <MetricTooltipContent {...defaultProps} breakdown={{}} />
      );
      expect(container.querySelector(".border-t")).not.toBeInTheDocument();
    });

    it("does not render breakdown when undefined", () => {
      const { container } = render(<MetricTooltipContent {...defaultProps} />);

      expect(container.querySelector(".border-t")).not.toBeInTheDocument();
    });
  });

  describe("All Metric Types", () => {
    const metrics = [
      {
        metricKey: "activity" as const,
        expectedTitle: "Activity",
        expectedDescription: "Recent coding activity, consistency, and project diversity",
      },
      {
        metricKey: "impact" as const,
        expectedTitle: "Impact",
        expectedDescription: "Community reach and engagement",
      },
      {
        metricKey: "quality" as const,
        expectedTitle: "Quality",
        expectedDescription: "Code quality, documentation, and maturity",
      },
      {
        metricKey: "consistency" as const,
        expectedTitle: "Consistency",
        expectedDescription: "Regularity and stability of coding activity",
      },
      {
        metricKey: "authenticity" as const,
        expectedTitle: "Authenticity",
        expectedDescription: "Repository originality and activity patterns",
      },
      {
        metricKey: "collaboration" as const,
        expectedTitle: "Collaboration",
        expectedDescription: "Contributions to other developers' projects",
      },
    ];

    metrics.forEach(({ metricKey, expectedTitle, expectedDescription }) => {
      it(`renders ${metricKey} metric correctly`, () => {
        render(
          <MetricTooltipContent metricKey={metricKey} score={75} />
        );

        expect(screen.getByText(expectedTitle)).toBeInTheDocument();
        expect(screen.getByText(expectedDescription)).toBeInTheDocument();
        expect(screen.getByText("75%")).toBeInTheDocument();
      });
    });
  });

  describe("Breakdown Labels", () => {
    it("maps activity breakdown keys to readable labels", () => {
      const breakdown = {
        recentCommits: 35,
        consistency: 25,
        diversity: 20,
      };

      render(
        <MetricTooltipContent
          metricKey="activity"
          score={80}
          breakdown={breakdown}
        />
      );

      expect(screen.getByText("Commits in last 3 months")).toBeInTheDocument();
      expect(screen.getByText("Active months in last year")).toBeInTheDocument();
      expect(screen.getByText("Unique repositories")).toBeInTheDocument();
    });

    it("maps impact breakdown keys to readable labels", () => {
      const breakdown = {
        stars: 25,
        forks: 15,
        contributors: 10,
        reach: 10,
        engagement: 5,
      };

      render(
        <MetricTooltipContent
          metricKey="impact"
          score={65}
          breakdown={breakdown}
        />
      );

      expect(screen.getByText("Total stars")).toBeInTheDocument();
      expect(screen.getByText("Total forks")).toBeInTheDocument();
      expect(screen.getByText("Contributors attracted")).toBeInTheDocument();
    });

    it("falls back to key name for unknown breakdown keys", () => {
      const breakdown = {
        unknownKey: 50,
      };

      render(
        <MetricTooltipContent
          metricKey="activity"
          score={50}
          breakdown={breakdown}
        />
      );

      expect(screen.getByText("unknownKey")).toBeInTheDocument();
    });
  });

  describe("Custom className", () => {
    it("applies custom className", () => {
      const { container } = render(
        <MetricTooltipContent
          {...defaultProps}
          className="custom-class"
        />
      );

      expect(container.firstChild).toHaveClass("custom-class");
    });
  });

  describe("Edge Cases", () => {
    it("handles score of 0", () => {
      render(<MetricTooltipContent {...defaultProps} score={0} />);

      expect(screen.getByText("0%")).toBeInTheDocument();
    });

    it("handles score of 100", () => {
      render(<MetricTooltipContent {...defaultProps} score={100} />);

      expect(screen.getByText("100%")).toBeInTheDocument();
    });

    it("renders nothing for unknown metric key", () => {
      // @ts-expect-error - Testing unknown key
      const { container } = render(
        <MetricTooltipContent metricKey="unknown" score={50} />
      );

      expect(container.firstChild).toBeNull();
    });
  });
});
