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

  it("should render with value", () => {
    const { container } = render(<Progress value={50} />);
    const progress = container.querySelector('[data-slot="progress"]');
    expect(progress).toBeInTheDocument();
  });

  it("should handle 0% value", () => {
    const { container } = render(<Progress value={0} />);
    const progress = container.querySelector('[data-slot="progress"]');
    expect(progress).toBeInTheDocument();
  });

  it("should handle 100% value", () => {
    const { container } = render(<Progress value={100} />);
    const progress = container.querySelector('[data-slot="progress"]');
    expect(progress).toBeInTheDocument();
  });

  it("should accept custom className", () => {
    const { container } = render(
      <Progress value={50} className="custom-progress" />,
    );
    const progress = container.querySelector('[data-slot="progress"]');
    expect(progress).toHaveClass("custom-progress");
  });

  it("should have proper structure", () => {
    const { container } = render(<Progress value={50} />);
    const progress = container.querySelector('[data-slot="progress"]');
    expect(progress).toBeInTheDocument();
    // Progress should have w-full class for full width
    expect(progress).toHaveClass("w-full");
  });

  it("should handle undefined value", () => {
    const { container } = render(<Progress />);
    const progress = container.querySelector('[data-slot="progress"]');
    expect(progress).toBeInTheDocument();
  });

  it("should update progress when value changes", () => {
    const { container, rerender } = render(<Progress value={25} />);
    let progress = container.querySelector('[data-slot="progress"]');
    expect(progress).toBeInTheDocument();

    rerender(<Progress value={75} />);
    progress = container.querySelector('[data-slot="progress"]');
    expect(progress).toBeInTheDocument();
  });
});
