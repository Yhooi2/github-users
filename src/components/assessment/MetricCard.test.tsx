import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { MetricCard } from "./MetricCard";

describe("MetricCard", () => {
  it("renders score and level", () => {
    render(<MetricCard title="Activity" score={85} level="High" />);

    expect(screen.getByText("85%")).toBeInTheDocument();
    expect(screen.getByText("High")).toBeInTheDocument();
    expect(screen.getByText("Activity")).toBeInTheDocument();
  });

  it("renders breakdown when provided", () => {
    const breakdown = [
      { label: "Recent commits", value: 40, max: 40 },
      { label: "Consistency", value: 30, max: 30 },
    ];

    render(
      <MetricCard
        title="Activity"
        score={85}
        level="High"
        breakdown={breakdown}
      />,
    );

    expect(screen.getByText("Recent commits")).toBeInTheDocument();
    expect(screen.getByText("40/40")).toBeInTheDocument();
    expect(screen.getByText("Consistency")).toBeInTheDocument();
    expect(screen.getByText("30/30")).toBeInTheDocument();
  });

  it("does not render breakdown when not provided", () => {
    render(<MetricCard title="Activity" score={85} level="High" />);

    // Should not find breakdown section
    expect(screen.queryByText("Recent commits")).not.toBeInTheDocument();
  });

  it("does not render breakdown when empty array provided", () => {
    render(
      <MetricCard title="Activity" score={85} level="High" breakdown={[]} />,
    );

    // Should not find breakdown section (empty array should not render anything)
    expect(screen.queryByText("Recent commits")).not.toBeInTheDocument();
  });

  it("calls onExplainClick when info button clicked", () => {
    const handleClick = vi.fn();
    render(
      <MetricCard
        title="Activity"
        score={85}
        level="High"
        onExplainClick={handleClick}
      />,
    );

    const button = screen.getByLabelText("Explain Activity score");
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("does not render explain button when onExplainClick not provided", () => {
    render(<MetricCard title="Activity" score={85} level="High" />);

    expect(
      screen.queryByLabelText("Explain Activity score"),
    ).not.toBeInTheDocument();
  });

  it("shows loading state", () => {
    const { container } = render(
      <MetricCard title="Activity" score={0} level="Low" loading />,
    );

    expect(container.querySelector(".animate-pulse")).toBeInTheDocument();
    // Loading state should not show score
    expect(screen.queryByText("0%")).not.toBeInTheDocument();
  });

  it("applies hover effects", () => {
    const { container } = render(
      <MetricCard title="Activity" score={85} level="High" />,
    );

    const card = container.querySelector(".hover\\:shadow-lg");
    expect(card).toBeInTheDocument();

    const translateCard = container.querySelector(
      ".hover\\:-translate-y-0\\.5",
    );
    expect(translateCard).toBeInTheDocument();
  });

  it("renders progress bar with correct width", () => {
    const { container } = render(
      <MetricCard title="Activity" score={75} level="High" />,
    );

    const progressBar = container.querySelector('[style*="width: 75%"]');
    expect(progressBar).toBeInTheDocument();
  });

  it("renders all level types correctly", () => {
    const levels: Array<
      | "Low"
      | "Moderate"
      | "High"
      | "Strong"
      | "Excellent"
      | "Exceptional"
      | "Minimal"
    > = [
      "Low",
      "Moderate",
      "High",
      "Strong",
      "Excellent",
      "Exceptional",
      "Minimal",
    ];

    levels.forEach((level) => {
      const { rerender } = render(
        <MetricCard title="Test" score={50} level={level} />,
      );
      expect(screen.getByText(level)).toBeInTheDocument();
      rerender(<div />); // Clean up for next iteration
    });
  });

  it("renders multiple breakdown items", () => {
    const breakdown = [
      { label: "Stars", value: 33, max: 35 },
      { label: "Forks", value: 18, max: 20 },
      { label: "Contributors", value: 14, max: 15 },
      { label: "Reach", value: 18, max: 20 },
      { label: "Engagement", value: 9, max: 10 },
    ];

    render(
      <MetricCard
        title="Impact"
        score={92}
        level="Exceptional"
        breakdown={breakdown}
      />,
    );

    // Verify all labels are present
    breakdown.forEach((item) => {
      expect(screen.getByText(item.label)).toBeInTheDocument();
    });

    // Verify specific value/max pairs are present
    expect(screen.getByText("33/35")).toBeInTheDocument();
    expect(screen.getByText("14/15")).toBeInTheDocument();
    expect(screen.getByText("9/10")).toBeInTheDocument();
    // Note: "18/20" appears twice (Forks and Reach), so we use getAllByText
    const duplicateValues = screen.getAllByText("18/20");
    expect(duplicateValues).toHaveLength(2);
  });
});
