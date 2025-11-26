import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ThemeToggle } from "../ThemeToggle";
import { ThemeProvider } from "../../context/ThemeContext";

const renderWithTheme = (ui: React.ReactElement, theme: "light" | "aurora" | "glass" = "glass") => {
  return render(<ThemeProvider defaultTheme={theme}>{ui}</ThemeProvider>);
};

describe("ThemeToggle", () => {
  it("renders toggle button", () => {
    renderWithTheme(<ThemeToggle />);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("renders icon", () => {
    const { container } = renderWithTheme(<ThemeToggle />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("does not show label by default", () => {
    renderWithTheme(<ThemeToggle />);
    expect(screen.queryByText("Light")).not.toBeInTheDocument();
    expect(screen.queryByText("Aurora")).not.toBeInTheDocument();
    expect(screen.queryByText("Glass")).not.toBeInTheDocument();
  });

  it("shows label when showLabel is true", () => {
    renderWithTheme(<ThemeToggle showLabel />, "glass");
    expect(screen.getByText("Glass")).toBeInTheDocument();
  });

  it("shows Light label in light theme", () => {
    renderWithTheme(<ThemeToggle showLabel />, "light");
    expect(screen.getByText("Light")).toBeInTheDocument();
  });

  it("shows Aurora label in aurora theme", () => {
    renderWithTheme(<ThemeToggle showLabel />, "aurora");
    expect(screen.getByText("Aurora")).toBeInTheDocument();
  });

  it("has title attribute with next theme", () => {
    renderWithTheme(<ThemeToggle />, "light");
    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("title", "Switch to Aurora theme");
  });

  it("cycles from light to aurora", () => {
    renderWithTheme(<ThemeToggle />, "light");
    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("title", "Switch to Aurora theme");
  });

  it("cycles from aurora to glass", () => {
    renderWithTheme(<ThemeToggle />, "aurora");
    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("title", "Switch to Glass theme");
  });

  it("cycles from glass to light", () => {
    renderWithTheme(<ThemeToggle />, "glass");
    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("title", "Switch to Light theme");
  });

  it("applies custom className", () => {
    const { container } = renderWithTheme(
      <ThemeToggle className="custom-class" />
    );
    expect(container.querySelector(".custom-class")).toBeInTheDocument();
  });

  it("is clickable", () => {
    renderWithTheme(<ThemeToggle />);
    const button = screen.getByRole("button");

    // Should not throw when clicked
    expect(() => fireEvent.click(button)).not.toThrow();
  });

  it("has correct size without label", () => {
    const { container } = renderWithTheme(<ThemeToggle />);
    expect(container.querySelector(".h-9")).toBeInTheDocument();
    expect(container.querySelector(".w-9")).toBeInTheDocument();
  });

  it("has padding with label", () => {
    const { container } = renderWithTheme(<ThemeToggle showLabel />);
    expect(container.querySelector(".px-3")).toBeInTheDocument();
    expect(container.querySelector(".py-1\\.5")).toBeInTheDocument();
  });

  it("has rounded-xl styling", () => {
    const { container } = renderWithTheme(<ThemeToggle />);
    expect(container.querySelector(".rounded-xl")).toBeInTheDocument();
  });
});
