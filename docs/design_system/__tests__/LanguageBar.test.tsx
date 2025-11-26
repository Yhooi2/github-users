import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { LanguageBar } from "../LanguageBar";
import { ThemeProvider } from "../../context/ThemeContext";

const renderWithTheme = (ui: React.ReactElement) => {
  return render(<ThemeProvider defaultTheme="glass">{ui}</ThemeProvider>);
};

const mockLanguages = [
  { name: "TypeScript", percentage: 56, color: "bg-blue-400" },
  { name: "HTML", percentage: 22, color: "bg-orange-400" },
  { name: "CSS", percentage: 22, color: "bg-pink-400" },
];

describe("LanguageBar", () => {
  it("renders all languages in the bar", () => {
    const { container } = renderWithTheme(
      <LanguageBar languages={mockLanguages} />
    );
    expect(container.querySelector(".bg-blue-400")).toBeInTheDocument();
    expect(container.querySelector(".bg-orange-400")).toBeInTheDocument();
    expect(container.querySelector(".bg-pink-400")).toBeInTheDocument();
  });

  it("shows labels by default", () => {
    renderWithTheme(<LanguageBar languages={mockLanguages} />);
    expect(screen.getByText(/TypeScript 56%/)).toBeInTheDocument();
    expect(screen.getByText(/HTML 22%/)).toBeInTheDocument();
    expect(screen.getByText(/CSS 22%/)).toBeInTheDocument();
  });

  it("hides labels when showLabels is false", () => {
    renderWithTheme(<LanguageBar languages={mockLanguages} showLabels={false} />);
    expect(screen.queryByText(/TypeScript 56%/)).not.toBeInTheDocument();
  });

  it("applies correct width percentages", () => {
    const { container } = renderWithTheme(
      <LanguageBar languages={mockLanguages} />
    );
    const bars = container.querySelectorAll(".rounded-full > div");
    expect(bars[0]).toHaveStyle({ width: "56%" });
    expect(bars[1]).toHaveStyle({ width: "22%" });
    expect(bars[2]).toHaveStyle({ width: "22%" });
  });

  it("applies custom className", () => {
    const { container } = renderWithTheme(
      <LanguageBar languages={mockLanguages} className="custom-class" />
    );
    expect(container.querySelector(".custom-class")).toBeInTheDocument();
  });

  it("renders with empty languages array", () => {
    const { container } = renderWithTheme(<LanguageBar languages={[]} />);
    expect(container.querySelector(".rounded-full")).toBeInTheDocument();
  });
});
