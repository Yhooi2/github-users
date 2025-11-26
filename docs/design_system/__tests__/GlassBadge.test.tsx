import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { GlassBadge } from "../GlassBadge";
import { ThemeProvider } from "../../context/ThemeContext";

const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider defaultTheme="glass">{ui}</ThemeProvider>);

describe("GlassBadge", () => {
  it("renders children correctly", () => {
    renderWithTheme(<GlassBadge>Test Badge</GlassBadge>);
    expect(screen.getByText("Test Badge")).toBeInTheDocument();
  });

  it("renders default variant", () => {
    const { container } = renderWithTheme(<GlassBadge>Default</GlassBadge>);
    expect(container.firstChild).toHaveClass(
      "inline-flex",
      "items-center",
      "rounded-full"
    );
  });

  it("renders success variant", () => {
    renderWithTheme(<GlassBadge variant="success">Success</GlassBadge>);
    expect(screen.getByText("Success")).toBeInTheDocument();
  });

  it("renders warning variant", () => {
    renderWithTheme(<GlassBadge variant="warning">Warning</GlassBadge>);
    expect(screen.getByText("Warning")).toBeInTheDocument();
  });

  it("renders danger variant", () => {
    renderWithTheme(<GlassBadge variant="danger">Danger</GlassBadge>);
    expect(screen.getByText("Danger")).toBeInTheDocument();
  });

  it("renders primary variant", () => {
    renderWithTheme(<GlassBadge variant="primary">Primary</GlassBadge>);
    expect(screen.getByText("Primary")).toBeInTheDocument();
  });

  it("renders violet variant", () => {
    renderWithTheme(<GlassBadge variant="violet">Violet</GlassBadge>);
    expect(screen.getByText("Violet")).toBeInTheDocument();
  });

  it("renders with emoji", () => {
    renderWithTheme(<GlassBadge>🔥 Peak</GlassBadge>);
    expect(screen.getByText("🔥 Peak")).toBeInTheDocument();
  });

  it("applies correct base styles", () => {
    const { container } = renderWithTheme(<GlassBadge>Badge</GlassBadge>);
    expect(container.firstChild).toHaveClass(
      "px-2",
      "py-0.5",
      "text-xs",
      "font-medium",
      "backdrop-blur-sm"
    );
  });

  it("renders in different themes", () => {
    const { rerender } = render(
      <ThemeProvider defaultTheme="light">
        <GlassBadge>Light</GlassBadge>
      </ThemeProvider>
    );
    expect(screen.getByText("Light")).toBeInTheDocument();

    rerender(
      <ThemeProvider defaultTheme="aurora">
        <GlassBadge>Aurora</GlassBadge>
      </ThemeProvider>
    );
    expect(screen.getByText("Aurora")).toBeInTheDocument();

    rerender(
      <ThemeProvider defaultTheme="glass">
        <GlassBadge>Glass</GlassBadge>
      </ThemeProvider>
    );
    expect(screen.getByText("Glass")).toBeInTheDocument();
  });
});
