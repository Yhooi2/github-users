import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Avatar } from "../Avatar";
import { ThemeProvider } from "../../context/ThemeContext";

const renderWithTheme = (ui: React.ReactElement) => {
  return render(<ThemeProvider defaultTheme="glass">{ui}</ThemeProvider>);
};

describe("Avatar", () => {
  it("renders initials correctly", () => {
    renderWithTheme(<Avatar initials="AS" />);
    expect(screen.getByText("AS")).toBeInTheDocument();
  });

  it("truncates initials to 2 characters", () => {
    renderWithTheme(<Avatar initials="ABC" />);
    expect(screen.getByText("AB")).toBeInTheDocument();
  });

  it("converts initials to uppercase", () => {
    renderWithTheme(<Avatar initials="ab" />);
    expect(screen.getByText("AB")).toBeInTheDocument();
  });

  it("renders with different sizes", () => {
    const { container: sm } = renderWithTheme(<Avatar initials="SM" size="sm" />);
    const { container: md } = renderWithTheme(<Avatar initials="MD" size="md" />);
    const { container: lg } = renderWithTheme(<Avatar initials="LG" size="lg" />);
    const { container: xl } = renderWithTheme(<Avatar initials="XL" size="xl" />);

    expect(sm.querySelector(".h-8")).toBeInTheDocument();
    expect(md.querySelector(".h-12")).toBeInTheDocument();
    expect(lg.querySelector(".h-16")).toBeInTheDocument();
    expect(xl.querySelector(".h-20")).toBeInTheDocument();
  });

  it("shows online indicator when online prop is true", () => {
    const { container } = renderWithTheme(<Avatar initials="AS" online />);
    expect(container.querySelector(".bg-emerald-400")).toBeInTheDocument();
  });

  it("does not show online indicator when online is false", () => {
    const { container } = renderWithTheme(<Avatar initials="AS" online={false} />);
    expect(container.querySelector(".bg-emerald-400")).not.toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = renderWithTheme(
      <Avatar initials="AS" className="custom-class" />
    );
    expect(container.querySelector(".custom-class")).toBeInTheDocument();
  });

  it("applies custom gradient", () => {
    const { container } = renderWithTheme(
      <Avatar initials="AS" gradient="from-red-500 to-orange-500" />
    );
    expect(container.querySelector(".from-red-500")).toBeInTheDocument();
  });
});
