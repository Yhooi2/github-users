import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { StatusIndicator } from "../StatusIndicator";
import { ThemeProvider } from "../../context/ThemeContext";

const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider defaultTheme="glass">{ui}</ThemeProvider>);

describe("StatusIndicator", () => {
  it("renders with correct aria-label", () => {
    renderWithTheme(<StatusIndicator type="green" />);
    expect(screen.getByRole("status")).toHaveAttribute("aria-label", "Status: green");
  });

  it("renders green status", () => {
    renderWithTheme(<StatusIndicator type="green" />);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("renders yellow status", () => {
    renderWithTheme(<StatusIndicator type="yellow" />);
    expect(screen.getByRole("status")).toHaveAttribute("aria-label", "Status: yellow");
  });

  it("renders red status", () => {
    renderWithTheme(<StatusIndicator type="red" />);
    expect(screen.getByRole("status")).toHaveAttribute("aria-label", "Status: red");
  });

  it("renders normal size by default", () => {
    const { container } = renderWithTheme(<StatusIndicator type="green" />);
    expect(container.firstChild).toHaveClass("w-2.5", "h-2.5");
  });

  it("renders large size with symbol", () => {
    const { container } = renderWithTheme(
      <StatusIndicator type="green" size="large" />
    );
    expect(container.firstChild).toHaveClass("w-4", "h-4");
    // Should contain checkmark symbol
    expect(container.firstChild).toHaveTextContent("✓");
  });

  it("renders correct symbol for each type in large size", () => {
    const { rerender, container } = renderWithTheme(
      <StatusIndicator type="green" size="large" />
    );
    expect(container.firstChild).toHaveTextContent("✓");

    rerender(
      <ThemeProvider defaultTheme="glass">
        <StatusIndicator type="yellow" size="large" />
      </ThemeProvider>
    );
    expect(container.firstChild).toHaveTextContent("!");

    rerender(
      <ThemeProvider defaultTheme="glass">
        <StatusIndicator type="red" size="large" />
      </ThemeProvider>
    );
    expect(container.firstChild).toHaveTextContent("✕");
  });

  it("applies pulse animation when pulse is true", () => {
    const { container } = renderWithTheme(
      <StatusIndicator type="green" pulse />
    );
    expect(container.firstChild).toHaveClass("animate-pulse");
  });

  it("does not apply pulse animation by default", () => {
    const { container } = renderWithTheme(<StatusIndicator type="green" />);
    expect(container.firstChild).not.toHaveClass("animate-pulse");
  });

  it("does not show symbol in normal size", () => {
    const { container } = renderWithTheme(
      <StatusIndicator type="green" size="normal" />
    );
    expect(container.firstChild).not.toHaveTextContent("✓");
  });
});
