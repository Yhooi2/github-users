/**
 * QuickAssessment tests - Updated for TrustScoreCardGlass migration
 *
 * TrustScoreCardGlass differences from old implementation:
 * - Shows overall trust score at the top
 * - Metrics don't show level labels (only numeric values)
 * - onExplainMetric is deprecated (not supported by TrustScoreCardGlass)
 * - Grid uses sm:grid-cols-3 md:grid-cols-4 layout
 */

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { QuickAssessment } from "./QuickAssessment";

describe("QuickAssessment", () => {
  const mockMetrics = {
    activity: { score: 85, level: "High" as const },
    impact: { score: 72, level: "Strong" as const },
    quality: { score: 90, level: "Excellent" as const },
    consistency: { score: 78, level: "High" as const },
    collaboration: { score: 65, level: "Moderate" as const },
  };

  it("renders overall trust score header", () => {
    render(<QuickAssessment metrics={mockMetrics} />);

    // TrustScoreCardGlass shows "Overall Trust Score" title
    expect(screen.getByText("Overall Trust Score")).toBeInTheDocument();

    // Shows calculated average score (85+72+90+78+65)/5 = 78
    // Note: 78 appears twice - once in overall score, once in consistency metric
    const scoreElements = screen.getAllByText("78");
    expect(scoreElements.length).toBeGreaterThanOrEqual(1);
  });

  it("renders all metric cards", () => {
    render(<QuickAssessment metrics={mockMetrics} />);

    expect(screen.getByText("Activity")).toBeInTheDocument();
    expect(screen.getByText("Impact")).toBeInTheDocument();
    expect(screen.getByText("Quality")).toBeInTheDocument();
    expect(screen.getByText("Consistency")).toBeInTheDocument();
    expect(screen.getByText("Collaboration")).toBeInTheDocument();
  });

  it("renders metric scores correctly", () => {
    render(<QuickAssessment metrics={mockMetrics} />);

    // TrustScoreCardGlass shows scores as plain numbers
    expect(screen.getByText("85")).toBeInTheDocument();
    expect(screen.getByText("72")).toBeInTheDocument();
    expect(screen.getByText("90")).toBeInTheDocument();
    // Note: 78 appears twice - once in overall score, once in consistency metric
    expect(screen.getAllByText("78")).toHaveLength(2);
    expect(screen.getByText("65")).toBeInTheDocument();
  });

  it("applies responsive grid layout from TrustScoreCardGlass", () => {
    const { container } = render(<QuickAssessment metrics={mockMetrics} />);

    // TrustScoreCardGlass uses: grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4
    const grid = container.querySelector(".grid.gap-3");
    expect(grid).toHaveClass("grid-cols-2");
    expect(grid).toHaveClass("sm:grid-cols-3");
    expect(grid).toHaveClass("md:grid-cols-4");
  });

  it("passes loading state to TrustScoreCardGlass", () => {
    const { container } = render(
      <QuickAssessment metrics={mockMetrics} loading />,
    );

    // Loading state shows animate-pulse on the container
    const loadingCard = container.querySelector(".animate-pulse");
    expect(loadingCard).toBeInTheDocument();
  });

  it("renders with different metric values", () => {
    const differentMetrics = {
      activity: { score: 20, level: "Low" as const },
      impact: { score: 15, level: "Minimal" as const },
      quality: { score: 30, level: "Weak" as const },
      consistency: { score: 25, level: "Low" as const },
      collaboration: { score: 18, level: "Low" as const },
    };

    render(<QuickAssessment metrics={differentMetrics} />);

    // Check scores
    expect(screen.getByText("20")).toBeInTheDocument();
    expect(screen.getByText("15")).toBeInTheDocument();
    expect(screen.getByText("30")).toBeInTheDocument();
    expect(screen.getByText("25")).toBeInTheDocument();
    expect(screen.getByText("18")).toBeInTheDocument();

    // Overall score: (20+15+30+25+18)/5 = 21.6 => 22
    expect(screen.getByText("22")).toBeInTheDocument();
  });

  it("renders Authenticity metric when provided", () => {
    const metricsWithAuthenticity = {
      ...mockMetrics,
      authenticity: { score: 92, level: "High" as const },
    };

    render(<QuickAssessment metrics={metricsWithAuthenticity} />);

    expect(screen.getByText("Authenticity")).toBeInTheDocument();
    expect(screen.getByText("92")).toBeInTheDocument();

    // Overall score with 6 metrics: (85+72+90+78+65+92)/6 = 80.33 => 80
    expect(screen.getByText("80")).toBeInTheDocument();
  });

  it("does not render Authenticity when not provided", () => {
    render(<QuickAssessment metrics={mockMetrics} />);

    expect(screen.queryByText("Authenticity")).not.toBeInTheDocument();
  });

  it("calculates correct overall score with 6 metrics", () => {
    const metricsWithAuthenticity = {
      ...mockMetrics,
      authenticity: { score: 60, level: "Medium" as const },
    };

    render(<QuickAssessment metrics={metricsWithAuthenticity} />);

    // Overall score: (85+72+90+78+65+60)/6 = 75
    expect(screen.getByText("75")).toBeInTheDocument();
  });
});
