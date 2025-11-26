import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MetricCard } from "../MetricCard";
import { ThemeProvider } from "../../context/ThemeContext";

const renderWithTheme = (ui: React.ReactElement, theme: "light" | "aurora" | "glass" = "glass") => {
  return render(<ThemeProvider defaultTheme={theme}>{ui}</ThemeProvider>);
};

describe("MetricCard", () => {
  it("renders label and value", () => {
    renderWithTheme(<MetricCard label="Regularity" value={84} variant="emerald" />);
    expect(screen.getByText("Regularity")).toBeInTheDocument();
    expect(screen.getByText("84")).toBeInTheDocument();
  });

  it("renders emerald variant", () => {
    const { container } = renderWithTheme(
      <MetricCard label="Test" value={100} variant="emerald" />
    );
    expect(container.querySelector(".rounded-xl")).toBeInTheDocument();
  });

  it("renders amber variant", () => {
    const { container } = renderWithTheme(
      <MetricCard label="Test" value={75} variant="amber" />
    );
    expect(container.querySelector(".rounded-xl")).toBeInTheDocument();
  });

  it("renders blue variant", () => {
    const { container } = renderWithTheme(
      <MetricCard label="Test" value={50} variant="blue" />
    );
    expect(container.querySelector(".rounded-xl")).toBeInTheDocument();
  });

  it("renders red variant", () => {
    const { container } = renderWithTheme(
      <MetricCard label="Test" value={25} variant="red" />
    );
    expect(container.querySelector(".rounded-xl")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = renderWithTheme(
      <MetricCard label="Test" value={50} variant="emerald" className="custom-class" />
    );
    expect(container.querySelector(".custom-class")).toBeInTheDocument();
  });

  it("renders string values", () => {
    renderWithTheme(
      <MetricCard label="Score" value="A+" variant="emerald" />
    );
    expect(screen.getByText("A+")).toBeInTheDocument();
  });

  it("applies text glow in glass theme", () => {
    const { container } = renderWithTheme(
      <MetricCard label="Test" value={100} variant="emerald" />,
      "glass"
    );
    const valueElement = container.querySelector(".text-xl");
    expect(valueElement).toHaveStyle({ textShadow: expect.any(String) });
  });

  it("no text glow in light theme", () => {
    const { container } = renderWithTheme(
      <MetricCard label="Test" value={100} variant="emerald" />,
      "light"
    );
    const valueElement = container.querySelector(".text-xl");
    expect(valueElement).toHaveStyle({ textShadow: "none" });
  });
});
