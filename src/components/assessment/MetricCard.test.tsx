import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { MetricCard } from "./MetricCard";

describe("MetricCard", () => {
  it("renders score and level", () => {
    render(<MetricCard title="Activity" score={85} level="High" />);

    // Score is now displayed as separate elements: number + % sign
    expect(screen.getByText("85")).toBeInTheDocument();
    expect(screen.getByText("%")).toBeInTheDocument();
    expect(screen.getByText("High")).toBeInTheDocument();
    expect(screen.getByText("Activity")).toBeInTheDocument();
  });

  it("does not render breakdown (compact layout)", () => {
    // New component is compact and doesn't display breakdown
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

    // Breakdown is not rendered in new compact layout
    expect(screen.queryByText("Recent commits")).not.toBeInTheDocument();
    expect(screen.queryByText("40/40")).not.toBeInTheDocument();
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

  it("calls onExplainClick when card is clicked", () => {
    const handleClick = vi.fn();
    render(
      <MetricCard
        title="Activity"
        score={85}
        level="High"
        onExplainClick={handleClick}
      />,
    );

    // The whole card is now clickable with role="button"
    const card = screen.getByRole("button", {
      name: /View Activity details/i,
    });
    fireEvent.click(card);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("does not have button role when onExplainClick not provided", () => {
    render(<MetricCard title="Activity" score={85} level="High" />);

    // Card should not have button role without click handler
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("shows loading state", () => {
    const { container } = render(
      <MetricCard title="Activity" score={0} level="Low" loading />,
    );

    expect(container.querySelector(".animate-pulse")).toBeInTheDocument();
    // Loading state should not show score
    expect(screen.queryByText("0")).not.toBeInTheDocument();
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

  it("renders icon based on metric title", () => {
    const { container } = render(
      <MetricCard title="Activity" score={75} level="High" />,
    );

    // Icon should be rendered (hidden from accessibility)
    const icon = container.querySelector('[aria-hidden="true"]');
    expect(icon).toBeInTheDocument();
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

  it("renders correct aria-label for clickable card", () => {
    render(
      <MetricCard
        title="Activity"
        score={85}
        level="High"
        onExplainClick={() => {}}
      />,
    );

    const button = screen.getByRole("button");
    expect(button).toHaveAttribute(
      "aria-label",
      "View Activity details: 85% - High",
    );
  });

  it("renders Consistency metric correctly", () => {
    render(<MetricCard title="Consistency" score={72} level="High" />);

    expect(screen.getByText("Consistency")).toBeInTheDocument();
    expect(screen.getByText("72")).toBeInTheDocument();
    expect(screen.getByText("%")).toBeInTheDocument();
    expect(screen.getByText("High")).toBeInTheDocument();
  });

  it("renders Collaboration metric correctly", () => {
    render(<MetricCard title="Collaboration" score={58} level="Moderate" />);

    expect(screen.getByText("Collaboration")).toBeInTheDocument();
    expect(screen.getByText("58")).toBeInTheDocument();
    expect(screen.getByText("%")).toBeInTheDocument();
    expect(screen.getByText("Moderate")).toBeInTheDocument();
  });

  it("renders Authenticity metric correctly", () => {
    render(<MetricCard title="Authenticity" score={88} level="High" />);

    expect(screen.getByText("Authenticity")).toBeInTheDocument();
    expect(screen.getByText("88")).toBeInTheDocument();
    expect(screen.getByText("%")).toBeInTheDocument();
    expect(screen.getByText("High")).toBeInTheDocument();
  });
});
