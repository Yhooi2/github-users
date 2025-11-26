import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { YearCard } from "../YearCard";
import { ThemeProvider } from "../../context/ThemeContext";

const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider defaultTheme="glass">{ui}</ThemeProvider>);

describe("YearCard", () => {
  it("renders year correctly", () => {
    renderWithTheme(
      <YearCard year={2024} label="Growth" commits={901} />
    );
    expect(screen.getByText("2024")).toBeInTheDocument();
  });

  it("renders label with emoji", () => {
    renderWithTheme(
      <YearCard year={2024} emoji="📈" label="Growth" commits={901} />
    );
    expect(screen.getByText("📈 Growth")).toBeInTheDocument();
  });

  it("renders commits count", () => {
    renderWithTheme(
      <YearCard year={2024} label="Growth" commits={901} />
    );
    expect(screen.getByText("901")).toBeInTheDocument();
  });

  it("handles onClick", () => {
    const handleClick = vi.fn();
    renderWithTheme(
      <YearCard
        year={2024}
        label="Growth"
        commits={901}
        onClick={handleClick}
      />
    );

    fireEvent.click(screen.getByRole("button"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("handles keyboard navigation", () => {
    const handleClick = vi.fn();
    renderWithTheme(
      <YearCard
        year={2024}
        label="Growth"
        commits={901}
        onClick={handleClick}
      />
    );

    const card = screen.getByRole("button");
    fireEvent.keyDown(card, { key: "Enter" });
    expect(handleClick).toHaveBeenCalledTimes(1);

    fireEvent.keyDown(card, { key: " " });
    expect(handleClick).toHaveBeenCalledTimes(2);
  });

  it("is not a button when no onClick", () => {
    renderWithTheme(
      <YearCard year={2024} label="Growth" commits={901} />
    );
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = renderWithTheme(
      <YearCard
        year={2024}
        label="Growth"
        commits={901}
        className="custom-class"
      />
    );
    expect(container.firstChild).toHaveClass("custom-class");
  });

  it("renders with progress bar", () => {
    renderWithTheme(
      <YearCard year={2024} label="Growth" commits={901} progress={100} />
    );
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  it("renders without emoji", () => {
    renderWithTheme(
      <YearCard year={2024} label="Growth" commits={901} />
    );
    expect(screen.getByText("Growth")).toBeInTheDocument();
  });
});
