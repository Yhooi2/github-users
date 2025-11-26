import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Background } from "../Background";
import { ThemeProvider } from "../../context/ThemeContext";

const renderWithTheme = (ui: React.ReactElement, theme: "light" | "aurora" | "glass" = "glass") => {
  return render(<ThemeProvider defaultTheme={theme}>{ui}</ThemeProvider>);
};

describe("Background", () => {
  it("renders children", () => {
    renderWithTheme(
      <Background>
        <div data-testid="child">Content</div>
      </Background>
    );
    expect(screen.getByTestId("child")).toBeInTheDocument();
    expect(screen.getByText("Content")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = renderWithTheme(
      <Background className="custom-class">Content</Background>
    );
    expect(container.querySelector(".custom-class")).toBeInTheDocument();
  });

  it("has min-h-screen class", () => {
    const { container } = renderWithTheme(<Background>Content</Background>);
    expect(container.querySelector(".min-h-screen")).toBeInTheDocument();
  });

  it("renders gradient background", () => {
    const { container } = renderWithTheme(<Background>Content</Background>);
    const gradientDiv = container.querySelector(".fixed.inset-0");
    expect(gradientDiv).toBeInTheDocument();
    expect(gradientDiv).toHaveAttribute("style");
  });

  it("renders grid overlay", () => {
    const { container } = renderWithTheme(<Background>Content</Background>);
    // Grid is the last child of the gradient background
    const gridElements = container.querySelectorAll(".absolute.inset-0");
    expect(gridElements.length).toBeGreaterThan(0);
  });

  it("renders orbs in glass theme", () => {
    const { container } = renderWithTheme(
      <Background>Content</Background>,
      "glass"
    );
    // Glass theme has 5 orbs with blur-3xl
    const orbs = container.querySelectorAll(".blur-3xl");
    expect(orbs.length).toBe(5);
  });

  it("renders orbs in light theme", () => {
    const { container } = renderWithTheme(
      <Background>Content</Background>,
      "light"
    );
    // Light theme has 4 orbs
    const orbs = container.querySelectorAll(".blur-3xl");
    expect(orbs.length).toBe(4);
  });

  it("renders orbs in aurora theme", () => {
    const { container } = renderWithTheme(
      <Background>Content</Background>,
      "aurora"
    );
    // Aurora theme has 4 orbs
    const orbs = container.querySelectorAll(".blur-3xl");
    expect(orbs.length).toBe(4);
  });

  it("content has relative z-10 for proper layering", () => {
    const { container } = renderWithTheme(
      <Background>
        <div>Content</div>
      </Background>
    );
    expect(container.querySelector(".relative.z-10")).toBeInTheDocument();
  });

  it("has Inter font family", () => {
    const { container } = renderWithTheme(<Background>Content</Background>);
    const bgDiv = container.firstChild;
    expect(bgDiv).toHaveClass("font-['Inter',system-ui,sans-serif]");
  });
});
