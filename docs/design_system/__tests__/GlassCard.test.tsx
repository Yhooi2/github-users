import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { GlassCard } from "../GlassCard";
import { ThemeProvider } from "../../context/ThemeContext";

const renderWithTheme = (ui: React.ReactElement, theme = "glass") =>
  render(
    <ThemeProvider defaultTheme={theme as "glass" | "light" | "aurora"}>
      {ui}
    </ThemeProvider>
  );

describe("GlassCard", () => {
  it("renders children correctly", () => {
    renderWithTheme(
      <GlassCard>
        <span>Test Content</span>
      </GlassCard>
    );
    expect(screen.getByText("Test Content")).toBeInTheDocument();
  });

  it("applies default intensity (medium)", () => {
    const { container } = renderWithTheme(
      <GlassCard>Content</GlassCard>
    );
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass("rounded-2xl", "border", "transition-all");
  });

  it("applies custom className", () => {
    const { container } = renderWithTheme(
      <GlassCard className="custom-class">Content</GlassCard>
    );
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass("custom-class");
  });

  it("handles onClick", () => {
    const handleClick = vi.fn();
    renderWithTheme(
      <GlassCard onClick={handleClick}>
        <button>Click me</button>
      </GlassCard>
    );
    fireEvent.click(screen.getByText("Click me").parentElement!);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("renders with different intensities", () => {
    const { rerender, container } = renderWithTheme(
      <GlassCard intensity="subtle">Content</GlassCard>
    );
    expect(container.firstChild).toBeInTheDocument();

    rerender(
      <ThemeProvider defaultTheme="glass">
        <GlassCard intensity="medium">Content</GlassCard>
      </ThemeProvider>
    );
    expect(container.firstChild).toBeInTheDocument();

    rerender(
      <ThemeProvider defaultTheme="glass">
        <GlassCard intensity="strong">Content</GlassCard>
      </ThemeProvider>
    );
    expect(container.firstChild).toBeInTheDocument();
  });

  it("renders with different glows", () => {
    const { rerender, container } = renderWithTheme(
      <GlassCard glow="violet">Content</GlassCard>
    );
    expect(container.firstChild).toBeInTheDocument();

    rerender(
      <ThemeProvider defaultTheme="glass">
        <GlassCard glow="cyan">Content</GlassCard>
      </ThemeProvider>
    );
    expect(container.firstChild).toBeInTheDocument();

    rerender(
      <ThemeProvider defaultTheme="glass">
        <GlassCard glow="blue">Content</GlassCard>
      </ThemeProvider>
    );
    expect(container.firstChild).toBeInTheDocument();
  });

  it("renders correctly in different themes", () => {
    const { rerender, container } = renderWithTheme(
      <GlassCard>Content</GlassCard>,
      "light"
    );
    expect(container.firstChild).toBeInTheDocument();

    rerender(
      <ThemeProvider defaultTheme="aurora">
        <GlassCard>Content</GlassCard>
      </ThemeProvider>
    );
    expect(container.firstChild).toBeInTheDocument();

    rerender(
      <ThemeProvider defaultTheme="glass">
        <GlassCard>Content</GlassCard>
      </ThemeProvider>
    );
    expect(container.firstChild).toBeInTheDocument();
  });
});
