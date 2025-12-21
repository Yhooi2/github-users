import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { QuickAssessment } from "./QuickAssessment";

describe("QuickAssessment", () => {
  const mockMetrics = {
    activity: { score: 85, level: "High" as const },
    impact: { score: 72, level: "Strong" as const },
    quality: { score: 90, level: "Excellent" as const },
    consistency: { score: 78, level: "High" as const },
    collaboration: { score: 65, level: "Moderate" as const },
  };

  it("renders all metric cards without section title", () => {
    render(<QuickAssessment metrics={mockMetrics} />);

    // No section title - header was removed for cleaner UX
    expect(screen.queryByText("Quick Assessment")).not.toBeInTheDocument();
    expect(screen.queryByText("🎯")).not.toBeInTheDocument();

    // But all metrics are rendered
    expect(screen.getByText("Activity")).toBeInTheDocument();
    expect(screen.getByText("Impact")).toBeInTheDocument();
  });

  it("renders all five metric cards", () => {
    render(<QuickAssessment metrics={mockMetrics} />);

    expect(screen.getByText("Activity")).toBeInTheDocument();
    expect(screen.getByText("Impact")).toBeInTheDocument();
    expect(screen.getByText("Quality")).toBeInTheDocument();
    expect(screen.getByText("Consistency")).toBeInTheDocument();
    expect(screen.getByText("Collaboration")).toBeInTheDocument();
  });

  it("renders metric scores correctly", () => {
    render(<QuickAssessment metrics={mockMetrics} />);

    // Scores are displayed as number + % separately
    expect(screen.getByText("85")).toBeInTheDocument();
    expect(screen.getByText("72")).toBeInTheDocument();
    expect(screen.getByText("90")).toBeInTheDocument();
    expect(screen.getByText("78")).toBeInTheDocument();
    expect(screen.getByText("65")).toBeInTheDocument();
  });

  it("renders metric levels correctly", () => {
    render(<QuickAssessment metrics={mockMetrics} />);

    // "High" appears twice (activity and consistency)
    expect(screen.getAllByText("High")).toHaveLength(2);
    expect(screen.getByText("Strong")).toBeInTheDocument();
    expect(screen.getByText("Excellent")).toBeInTheDocument();
    expect(screen.getByText("Moderate")).toBeInTheDocument();
  });

  it("applies responsive grid layout", () => {
    const { container } = render(<QuickAssessment metrics={mockMetrics} />);

    // Find the grid with gap-3 class (the metrics grid, not the CardHeader grid)
    const grid = container.querySelector(".grid.gap-3");
    // New grid classes: grid-cols-2 md:grid-cols-3 lg:grid-cols-5 (for 5 metrics)
    expect(grid).toHaveClass("grid-cols-2");
    expect(grid).toHaveClass("md:grid-cols-3");
    expect(grid).toHaveClass("lg:grid-cols-5");
  });

  it("passes loading state to all metric cards", () => {
    const { container } = render(
      <QuickAssessment metrics={mockMetrics} loading />,
    );

    const loadingCards = container.querySelectorAll(".animate-pulse");
    expect(loadingCards).toHaveLength(5);
  });

  it("calls onExplainMetric with correct metric name when card clicked", () => {
    const handleExplain = vi.fn();
    render(
      <QuickAssessment metrics={mockMetrics} onExplainMetric={handleExplain} />,
    );

    // MetricCardGlass v2.6.2+ uses contextual aria-label "Explain {title} metric"
    const cardButtons = screen.getAllByRole("button", {
      name: /Explain .* metric/i,
    });
    expect(cardButtons).toHaveLength(5);

    fireEvent.click(cardButtons[0]); // Activity
    expect(handleExplain).toHaveBeenCalledWith("activity");

    fireEvent.click(cardButtons[1]); // Impact
    expect(handleExplain).toHaveBeenCalledWith("impact");

    fireEvent.click(cardButtons[2]); // Quality
    expect(handleExplain).toHaveBeenCalledWith("quality");

    fireEvent.click(cardButtons[3]); // Consistency
    expect(handleExplain).toHaveBeenCalledWith("consistency");

    fireEvent.click(cardButtons[4]); // Collaboration
    expect(handleExplain).toHaveBeenCalledWith("collaboration");

    expect(handleExplain).toHaveBeenCalledTimes(5);
  });

  it("does not render button roles when onExplainMetric not provided", () => {
    render(<QuickAssessment metrics={mockMetrics} />);

    // MetricCardGlass only shows explain button when onExplain is provided
    const cardButtons = screen.queryAllByRole("button", {
      name: /Explain .* metric/i,
    });
    expect(cardButtons).toHaveLength(0);
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

    expect(screen.getByText("20")).toBeInTheDocument();
    expect(screen.getByText("15")).toBeInTheDocument();
    expect(screen.getByText("30")).toBeInTheDocument();
    expect(screen.getByText("25")).toBeInTheDocument();
    expect(screen.getByText("18")).toBeInTheDocument();

    // Check levels - "Low" appears 3 times
    expect(screen.getAllByText("Low")).toHaveLength(3);
    expect(screen.getByText("Minimal")).toBeInTheDocument();
    expect(screen.getByText("Weak")).toBeInTheDocument();
  });

  it("renders Authenticity metric when provided", () => {
    const metricsWithAuthenticity = {
      ...mockMetrics,
      authenticity: { score: 92, level: "High" as const },
    };

    render(<QuickAssessment metrics={metricsWithAuthenticity} />);

    expect(screen.getByText("Authenticity")).toBeInTheDocument();
    expect(screen.getByText("92")).toBeInTheDocument();
    // "High" appears 3 times: activity, consistency, and authenticity
    expect(screen.getAllByText("High")).toHaveLength(3);
  });

  it("does not render Authenticity when not provided", () => {
    render(<QuickAssessment metrics={mockMetrics} />);

    expect(screen.queryByText("Authenticity")).not.toBeInTheDocument();
  });

  it("renders six metric cards when Authenticity is provided", () => {
    const metricsWithAuthenticity = {
      ...mockMetrics,
      authenticity: { score: 65, level: "Medium" as const },
    };

    render(
      <QuickAssessment
        metrics={metricsWithAuthenticity}
        onExplainMetric={vi.fn()}
      />,
    );

    const cardButtons = screen.getAllByRole("button", {
      name: /Explain .* metric/i,
    });
    expect(cardButtons).toHaveLength(6);
  });

  it("applies correct grid layout for 6 metrics", () => {
    const metricsWithAuthenticity = {
      ...mockMetrics,
      authenticity: { score: 65, level: "Medium" as const },
    };

    const { container } = render(
      <QuickAssessment metrics={metricsWithAuthenticity} />,
    );

    // Find the grid with gap-3 class (the metrics grid, not the CardHeader grid)
    const grid = container.querySelector(".grid.gap-3");
    // 6 metrics: grid-cols-2 md:grid-cols-3 lg:grid-cols-6
    expect(grid).toHaveClass("grid-cols-2");
    expect(grid).toHaveClass("md:grid-cols-3");
    expect(grid).toHaveClass("lg:grid-cols-6");
  });
});
