import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { GlassToggle } from "../GlassToggle";
import { ThemeProvider } from "../../context/ThemeContext";

const renderWithTheme = (ui: React.ReactElement) => {
  return render(<ThemeProvider defaultTheme="glass">{ui}</ThemeProvider>);
};

describe("GlassToggle", () => {
  it("renders as switch role", () => {
    const handleChange = vi.fn();
    renderWithTheme(<GlassToggle checked={false} onChange={handleChange} />);
    expect(screen.getByRole("switch")).toBeInTheDocument();
  });

  it("shows unchecked state", () => {
    const handleChange = vi.fn();
    renderWithTheme(<GlassToggle checked={false} onChange={handleChange} />);
    expect(screen.getByRole("switch")).toHaveAttribute("aria-checked", "false");
  });

  it("shows checked state", () => {
    const handleChange = vi.fn();
    renderWithTheme(<GlassToggle checked={true} onChange={handleChange} />);
    expect(screen.getByRole("switch")).toHaveAttribute("aria-checked", "true");
  });

  it("calls onChange when clicked", () => {
    const handleChange = vi.fn();
    renderWithTheme(<GlassToggle checked={false} onChange={handleChange} />);

    fireEvent.click(screen.getByRole("switch"));
    expect(handleChange).toHaveBeenCalledWith(true);
  });

  it("does not call onChange when disabled", () => {
    const handleChange = vi.fn();
    renderWithTheme(<GlassToggle checked={false} onChange={handleChange} disabled />);

    fireEvent.click(screen.getByRole("switch"));
    expect(handleChange).not.toHaveBeenCalled();
  });

  it("is disabled when disabled prop is true", () => {
    const handleChange = vi.fn();
    renderWithTheme(<GlassToggle checked={false} onChange={handleChange} disabled />);
    expect(screen.getByRole("switch")).toBeDisabled();
  });

  it("renders small size", () => {
    const handleChange = vi.fn();
    const { container } = renderWithTheme(
      <GlassToggle checked={false} onChange={handleChange} size="sm" />
    );
    expect(container.querySelector(".h-5")).toBeInTheDocument();
  });

  it("renders medium size (default)", () => {
    const handleChange = vi.fn();
    const { container } = renderWithTheme(
      <GlassToggle checked={false} onChange={handleChange} size="md" />
    );
    expect(container.querySelector(".h-6")).toBeInTheDocument();
  });

  it("renders large size", () => {
    const handleChange = vi.fn();
    const { container } = renderWithTheme(
      <GlassToggle checked={false} onChange={handleChange} size="lg" />
    );
    expect(container.querySelector(".h-7")).toBeInTheDocument();
  });
});
