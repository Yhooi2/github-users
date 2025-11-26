import "@testing-library/jest-dom/vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ThemeProvider } from "../../context/ThemeContext";
import { AIInsightsCard } from "../AIInsightsCard";

const renderWithTheme = (ui: React.ReactElement) => {
  return render(<ThemeProvider defaultTheme="glass">{ui}</ThemeProvider>);
};

describe("AIInsightsCard", () => {
  it("renders AI Summary title", () => {
    renderWithTheme(<AIInsightsCard />);
    expect(screen.getByText("AI Summary")).toBeInTheDocument();
  });

  it("renders description text", () => {
    renderWithTheme(<AIInsightsCard />);
    expect(screen.getByText("Get comprehensive analysis:")).toBeInTheDocument();
  });

  it("renders all feature items", () => {
    renderWithTheme(<AIInsightsCard />);
    expect(screen.getByText(/Code quality assessment/)).toBeInTheDocument();
    expect(screen.getByText(/Architecture patterns/)).toBeInTheDocument();
    expect(screen.getByText(/Best practices/)).toBeInTheDocument();
  });

  it("renders Generate Report button", () => {
    renderWithTheme(<AIInsightsCard />);
    expect(
      screen.getByRole("button", { name: /Generate Report/i }),
    ).toBeInTheDocument();
  });

  it("renders time estimate", () => {
    renderWithTheme(<AIInsightsCard />);
    expect(screen.getByText(/~30 seconds/)).toBeInTheDocument();
  });

  it("calls onGenerateReport when button clicked", () => {
    const handleGenerateReport = vi.fn();
    renderWithTheme(<AIInsightsCard onGenerateReport={handleGenerateReport} />);

    fireEvent.click(screen.getByRole("button", { name: /Generate Report/i }));
    expect(handleGenerateReport).toHaveBeenCalled();
  });

  it("applies custom className", () => {
    const { container } = renderWithTheme(
      <AIInsightsCard className="custom-class" />,
    );
    expect(container.querySelector(".custom-class")).toBeInTheDocument();
  });

  it("has proper styling applied", () => {
    const { container } = renderWithTheme(<AIInsightsCard />);
    const card = container.querySelector(".rounded-xl");
    expect(card).toBeInTheDocument();
    // backdropFilter is applied but jsdom doesn't fully support it
    expect(card).toHaveClass("rounded-xl");
  });
});
