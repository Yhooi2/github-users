import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { QuickAssessment } from "./QuickAssessment";

describe("QuickAssessment", () => {
  const mockMetrics = {
    activity: { score: 85, level: "High" as const },
    impact: { score: 72, level: "Strong" as const },
    quality: { score: 90, level: "Excellent" as const },
    growth: { score: 45, level: "Moderate" as const },
  };

  it("renders section title", () => {
    render(<QuickAssessment metrics={mockMetrics} />);

    expect(screen.getByText("🎯 Quick Assessment")).toBeInTheDocument();
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

    expect(screen.getByText("85%")).toBeInTheDocument();
    expect(screen.getByText("72%")).toBeInTheDocument();
    expect(screen.getByText("90%")).toBeInTheDocument();
    expect(screen.getByText("45%")).toBeInTheDocument();
  });

  it("renders metric levels correctly", () => {
    render(<QuickAssessment metrics={mockMetrics} />);

    expect(screen.getByText("High")).toBeInTheDocument();
    expect(screen.getByText("Strong")).toBeInTheDocument();
    expect(screen.getByText("Excellent")).toBeInTheDocument();
    expect(screen.getByText("Moderate")).toBeInTheDocument();
  });

  it("applies responsive grid layout", () => {
    const { container } = render(<QuickAssessment metrics={mockMetrics} />);

    const grid = container.querySelector(".grid");
    expect(grid).toHaveClass("grid-cols-1");
    expect(grid).toHaveClass("md:grid-cols-2");
    expect(grid).toHaveClass("lg:grid-cols-4");
  });

  it("passes loading state to all metric cards", () => {
    const { container } = render(
      <QuickAssessment metrics={mockMetrics} loading />,
    );

    const loadingCards = container.querySelectorAll(".animate-pulse");
    expect(loadingCards).toHaveLength(4);
  });

  it("calls onExplainMetric with correct metric name when explain button clicked", () => {
    const handleExplain = vi.fn();
    render(
      <QuickAssessment metrics={mockMetrics} onExplainMetric={handleExplain} />,
    );

    // Click explain button for Activity (first info button)
    const explainButtons = screen.getAllByLabelText(/Explain .* score/);
    expect(explainButtons).toHaveLength(4);

    fireEvent.click(explainButtons[0]); // Activity
    expect(handleExplain).toHaveBeenCalledWith("activity");

    fireEvent.click(explainButtons[1]); // Impact
    expect(handleExplain).toHaveBeenCalledWith("impact");

    fireEvent.click(explainButtons[2]); // Quality
    expect(handleExplain).toHaveBeenCalledWith("quality");

    fireEvent.click(explainButtons[3]); // Growth
    expect(handleExplain).toHaveBeenCalledWith("growth");

    expect(handleExplain).toHaveBeenCalledTimes(4);
  });

  it("does not render explain buttons when onExplainMetric not provided", () => {
    render(<QuickAssessment metrics={mockMetrics} />);

    const explainButtons = screen.queryAllByLabelText(/Explain .* score/);
    expect(explainButtons).toHaveLength(0);
  });

  it("renders with different metric values", () => {
    const differentMetrics = {
      activity: { score: 20, level: "Low" as const },
      impact: { score: 15, level: "Minimal" as const },
      quality: { score: 30, level: "Low" as const },
      growth: { score: 10, level: "Low" as const },
    };

    render(<QuickAssessment metrics={differentMetrics} />);

    expect(screen.getByText("20%")).toBeInTheDocument();
    expect(screen.getByText("15%")).toBeInTheDocument();
    expect(screen.getByText("30%")).toBeInTheDocument();
    expect(screen.getByText("10%")).toBeInTheDocument();

    // All should show "Low" or "Minimal"
    expect(screen.getAllByText("Low")).toHaveLength(3);
    expect(screen.getByText("Minimal")).toBeInTheDocument();
  });
});
