import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { QuickAssessment } from "./QuickAssessment";

describe("QuickAssessment", () => {
  const mockMetrics = {
    activity: { score: 85, level: "High" as const },
    impact: { score: 72, level: "Strong" as const },
    quality: { score: 90, level: "Excellent" as const },
    growth: { score: 45, level: "Stable" as const },
  };

  it("renders section title", () => {
    render(<QuickAssessment metrics={mockMetrics} />);

    // Title is now split: emoji in separate span + text
    expect(screen.getByText("Quick Assessment")).toBeInTheDocument();
    // The emoji is in a separate span with aria-hidden
    expect(screen.getByText("🎯")).toBeInTheDocument();
  });

  it("renders all four metric cards", () => {
    render(<QuickAssessment metrics={mockMetrics} />);

    expect(screen.getByText("Activity")).toBeInTheDocument();
    expect(screen.getByText("Impact")).toBeInTheDocument();
    expect(screen.getByText("Quality")).toBeInTheDocument();
    expect(screen.getByText("Growth")).toBeInTheDocument();
  });

  it("renders metric scores correctly", () => {
    render(<QuickAssessment metrics={mockMetrics} />);

    // Scores are displayed as number + % separately (except Growth)
    expect(screen.getByText("85")).toBeInTheDocument();
    expect(screen.getByText("72")).toBeInTheDocument();
    expect(screen.getByText("90")).toBeInTheDocument();
    // Growth score shows with + sign for positive values, no %
    expect(screen.getByText("+45")).toBeInTheDocument();
  });

  it("renders metric levels correctly", () => {
    render(<QuickAssessment metrics={mockMetrics} />);

    expect(screen.getByText("High")).toBeInTheDocument();
    expect(screen.getByText("Strong")).toBeInTheDocument();
    expect(screen.getByText("Excellent")).toBeInTheDocument();
    expect(screen.getByText("Stable")).toBeInTheDocument();
  });

  it("applies responsive grid layout", () => {
    const { container } = render(<QuickAssessment metrics={mockMetrics} />);

    // Find the grid with gap-3 class (the metrics grid, not the CardHeader grid)
    const grid = container.querySelector(".grid.gap-3");
    // New grid classes: grid-cols-2 md:grid-cols-4 (for 4 metrics)
    expect(grid).toHaveClass("grid-cols-2");
    expect(grid).toHaveClass("md:grid-cols-4");
  });

  it("passes loading state to all metric cards", () => {
    const { container } = render(
      <QuickAssessment metrics={mockMetrics} loading />,
    );

    const loadingCards = container.querySelectorAll(".animate-pulse");
    expect(loadingCards).toHaveLength(4);
  });

  it("calls onExplainMetric with correct metric name when card clicked", () => {
    const handleExplain = vi.fn();
    render(
      <QuickAssessment metrics={mockMetrics} onExplainMetric={handleExplain} />,
    );

    // Cards are now clickable buttons
    const cardButtons = screen.getAllByRole("button", {
      name: /View .* details/i,
    });
    expect(cardButtons).toHaveLength(4);

    fireEvent.click(cardButtons[0]); // Activity
    expect(handleExplain).toHaveBeenCalledWith("activity");

    fireEvent.click(cardButtons[1]); // Impact
    expect(handleExplain).toHaveBeenCalledWith("impact");

    fireEvent.click(cardButtons[2]); // Quality
    expect(handleExplain).toHaveBeenCalledWith("quality");

    fireEvent.click(cardButtons[3]); // Growth
    expect(handleExplain).toHaveBeenCalledWith("growth");

    expect(handleExplain).toHaveBeenCalledTimes(4);
  });

  it("does not render button roles when onExplainMetric not provided", () => {
    render(<QuickAssessment metrics={mockMetrics} />);

    // MetricCard only has button role when onExplainClick is provided
    const cardButtons = screen.queryAllByRole("button", {
      name: /View .* details/i,
    });
    expect(cardButtons).toHaveLength(0);
  });

  it("renders with different metric values", () => {
    const differentMetrics = {
      activity: { score: 20, level: "Low" as const },
      impact: { score: 15, level: "Minimal" as const },
      quality: { score: 30, level: "Weak" as const },
      growth: { score: 10, level: "Stable" as const },
    };

    render(<QuickAssessment metrics={differentMetrics} />);

    expect(screen.getByText("20")).toBeInTheDocument();
    expect(screen.getByText("15")).toBeInTheDocument();
    expect(screen.getByText("30")).toBeInTheDocument();
    // Growth shows with + sign
    expect(screen.getByText("+10")).toBeInTheDocument();

    // Check levels
    expect(screen.getByText("Low")).toBeInTheDocument();
    expect(screen.getByText("Minimal")).toBeInTheDocument();
    expect(screen.getByText("Weak")).toBeInTheDocument();
    expect(screen.getByText("Stable")).toBeInTheDocument();
  });

  it("renders Authenticity metric when provided", () => {
    const metricsWithAuthenticity = {
      ...mockMetrics,
      authenticity: { score: 78, level: "High" as const },
    };

    render(<QuickAssessment metrics={metricsWithAuthenticity} />);

    expect(screen.getByText("Authenticity")).toBeInTheDocument();
    expect(screen.getByText("78")).toBeInTheDocument();
    // "High" already exists from activity, so we check for 2 occurrences
    expect(screen.getAllByText("High")).toHaveLength(2);
  });

  it("does not render Authenticity when not provided", () => {
    render(<QuickAssessment metrics={mockMetrics} />);

    expect(screen.queryByText("Authenticity")).not.toBeInTheDocument();
  });

  it("renders five metric cards when Authenticity is provided", () => {
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
      name: /View .* details/i,
    });
    expect(cardButtons).toHaveLength(5);
  });

  it("applies correct grid layout for 5 metrics", () => {
    const metricsWithAuthenticity = {
      ...mockMetrics,
      authenticity: { score: 65, level: "Medium" as const },
    };

    const { container } = render(
      <QuickAssessment metrics={metricsWithAuthenticity} />,
    );

    // Find the grid with gap-3 class (the metrics grid, not the CardHeader grid)
    const grid = container.querySelector(".grid.gap-3");
    // 5 metrics: grid-cols-2 md:grid-cols-3 lg:grid-cols-5
    expect(grid).toHaveClass("grid-cols-2");
    expect(grid).toHaveClass("md:grid-cols-3");
    expect(grid).toHaveClass("lg:grid-cols-5");
  });
});
