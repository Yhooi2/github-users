import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { GlassProgress } from "../GlassProgress";
import { ThemeProvider } from "../../context/ThemeContext";

const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider defaultTheme="glass">{ui}</ThemeProvider>);

describe("GlassProgress", () => {
  it("renders with correct aria attributes", () => {
    renderWithTheme(<GlassProgress value={50} />);
    const progressbar = screen.getByRole("progressbar");
    expect(progressbar).toHaveAttribute("aria-valuenow", "50");
    expect(progressbar).toHaveAttribute("aria-valuemin", "0");
    expect(progressbar).toHaveAttribute("aria-valuemax", "100");
  });

  it("clamps value to 0-100 range", () => {
    const { rerender } = renderWithTheme(<GlassProgress value={-10} />);
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "0");

    rerender(
      <ThemeProvider defaultTheme="glass">
        <GlassProgress value={150} />
      </ThemeProvider>
    );
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "100");
  });

  it("applies default height (h-2)", () => {
    const { container } = renderWithTheme(<GlassProgress value={50} />);
    expect(container.firstChild).toHaveClass("h-2");
  });

  it("applies custom height", () => {
    const { container } = renderWithTheme(
      <GlassProgress value={50} height="h-4" />
    );
    expect(container.firstChild).toHaveClass("h-4");
  });

  it("applies default gradient", () => {
    const { container } = renderWithTheme(<GlassProgress value={50} />);
    const fill = container.querySelector(".bg-gradient-to-r");
    expect(fill).toHaveClass("from-blue-500", "to-violet-500");
  });

  it("applies custom gradient", () => {
    const { container } = renderWithTheme(
      <GlassProgress value={50} gradient="from-emerald-400 to-emerald-500" />
    );
    const fill = container.querySelector(".bg-gradient-to-r");
    expect(fill).toHaveClass("from-emerald-400", "to-emerald-500");
  });

  it("applies custom className", () => {
    const { container } = renderWithTheme(
      <GlassProgress value={50} className="custom-class" />
    );
    expect(container.firstChild).toHaveClass("custom-class");
  });

  it("renders correctly at 0%", () => {
    renderWithTheme(<GlassProgress value={0} />);
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "0");
  });

  it("renders correctly at 100%", () => {
    renderWithTheme(<GlassProgress value={100} />);
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "100");
  });

  it("renders without glow when showGlow is false", () => {
    const { container } = renderWithTheme(
      <GlassProgress value={50} showGlow={false} />
    );
    expect(container.firstChild).toBeInTheDocument();
  });

  it("renders with glow by default", () => {
    const { container } = renderWithTheme(<GlassProgress value={50} />);
    expect(container.firstChild).toBeInTheDocument();
  });
});
