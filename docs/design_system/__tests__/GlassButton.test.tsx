import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Sparkles } from "lucide-react";
import { GlassButton } from "../GlassButton";
import { ThemeProvider } from "../../context/ThemeContext";

const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider defaultTheme="glass">{ui}</ThemeProvider>);

describe("GlassButton", () => {
  it("renders children correctly", () => {
    renderWithTheme(<GlassButton>Click me</GlassButton>);
    expect(screen.getByRole("button")).toHaveTextContent("Click me");
  });

  it("handles onClick", () => {
    const handleClick = vi.fn();
    renderWithTheme(<GlassButton onClick={handleClick}>Click</GlassButton>);
    fireEvent.click(screen.getByRole("button"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("renders primary variant by default", () => {
    renderWithTheme(<GlassButton>Primary</GlassButton>);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("rounded-xl", "font-medium");
  });

  it("renders secondary variant", () => {
    renderWithTheme(<GlassButton variant="secondary">Secondary</GlassButton>);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("border");
  });

  it("renders ghost variant", () => {
    renderWithTheme(<GlassButton variant="ghost">Ghost</GlassButton>);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("renders with icon on the left", () => {
    renderWithTheme(
      <GlassButton icon={Sparkles} iconPosition="left">
        With Icon
      </GlassButton>
    );
    expect(screen.getByRole("button")).toBeInTheDocument();
    // Icon should be rendered as SVG
    expect(screen.getByRole("button").querySelector("svg")).toBeInTheDocument();
  });

  it("renders with icon on the right", () => {
    renderWithTheme(
      <GlassButton icon={Sparkles} iconPosition="right">
        With Icon
      </GlassButton>
    );
    const button = screen.getByRole("button");
    expect(button.querySelector("svg")).toBeInTheDocument();
  });

  it("shows loading state", () => {
    renderWithTheme(<GlassButton loading>Loading</GlassButton>);
    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
    // Should show loader icon
    expect(button.querySelector("svg")).toBeInTheDocument();
  });

  it("is disabled when disabled prop is true", () => {
    renderWithTheme(<GlassButton disabled>Disabled</GlassButton>);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("renders different sizes", () => {
    const { rerender } = renderWithTheme(<GlassButton size="sm">Small</GlassButton>);
    expect(screen.getByRole("button")).toBeInTheDocument();

    rerender(
      <ThemeProvider defaultTheme="glass">
        <GlassButton size="md">Medium</GlassButton>
      </ThemeProvider>
    );
    expect(screen.getByRole("button")).toBeInTheDocument();

    rerender(
      <ThemeProvider defaultTheme="glass">
        <GlassButton size="lg">Large</GlassButton>
      </ThemeProvider>
    );
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("renders full width when fullWidth is true", () => {
    renderWithTheme(<GlassButton fullWidth>Full Width</GlassButton>);
    expect(screen.getByRole("button")).toHaveClass("w-full");
  });

  it("applies custom className", () => {
    renderWithTheme(<GlassButton className="custom-class">Custom</GlassButton>);
    expect(screen.getByRole("button")).toHaveClass("custom-class");
  });

  it("does not fire onClick when disabled", () => {
    const handleClick = vi.fn();
    renderWithTheme(
      <GlassButton disabled onClick={handleClick}>
        Disabled
      </GlassButton>
    );
    fireEvent.click(screen.getByRole("button"));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it("does not fire onClick when loading", () => {
    const handleClick = vi.fn();
    renderWithTheme(
      <GlassButton loading onClick={handleClick}>
        Loading
      </GlassButton>
    );
    fireEvent.click(screen.getByRole("button"));
    expect(handleClick).not.toHaveBeenCalled();
  });
});
