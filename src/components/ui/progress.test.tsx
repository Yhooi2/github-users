import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Progress } from "./progress";

describe("Progress", () => {
  it("should render progress bar", () => {
    const { container } = render(<Progress value={50} />);
    expect(
      container.querySelector('[data-slot="progress"]'),
    ).toBeInTheDocument();
  });

  it("should render progress indicator", () => {
    const { container } = render(<Progress value={50} />);
    expect(
      container.querySelector('[data-slot="progress-indicator"]'),
    ).toBeInTheDocument();
  });

  it("should apply correct transform for value", () => {
    const { container } = render(<Progress value={60} />);
    const indicator = container.querySelector(
      '[data-slot="progress-indicator"]',
    );
    expect(indicator).toHaveStyle({ transform: "translateX(-40%)" });
  });

  it("should handle 0% value", () => {
    const { container } = render(<Progress value={0} />);
    const indicator = container.querySelector(
      '[data-slot="progress-indicator"]',
    );
    expect(indicator).toHaveStyle({ transform: "translateX(-100%)" });
  });

  it("should handle 100% value", () => {
    const { container } = render(<Progress value={100} />);
    const indicator = container.querySelector(
      '[data-slot="progress-indicator"]',
    );
    expect(indicator).toHaveStyle({ transform: "translateX(-0%)" });
  });

  it("should accept custom className", () => {
    const { container } = render(
      <Progress value={50} className="custom-progress" />,
    );
    const progress = container.querySelector('[data-slot="progress"]');
    expect(progress).toHaveClass("custom-progress");
  });

  it("should have default styling classes", () => {
    const { container } = render(<Progress value={50} />);
    const progress = container.querySelector('[data-slot="progress"]');
    expect(progress).toHaveClass("h-2");
    expect(progress).toHaveClass("w-full");
    expect(progress).toHaveClass("rounded-full");
  });

  it("should handle undefined value", () => {
    const { container } = render(<Progress />);
    const indicator = container.querySelector(
      '[data-slot="progress-indicator"]',
    );
    expect(indicator).toHaveStyle({ transform: "translateX(-100%)" });
  });

  it("should update progress when value changes", () => {
    const { container, rerender } = render(<Progress value={25} />);
    let indicator = container.querySelector('[data-slot="progress-indicator"]');
    expect(indicator).toHaveStyle({ transform: "translateX(-75%)" });

    rerender(<Progress value={75} />);
    indicator = container.querySelector('[data-slot="progress-indicator"]');
    expect(indicator).toHaveStyle({ transform: "translateX(-25%)" });
  });
});
