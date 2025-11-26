import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { IconButton } from "../IconButton";
import { ThemeProvider } from "../../context/ThemeContext";
import { Github, Settings, Share } from "lucide-react";

const renderWithTheme = (ui: React.ReactElement) => {
  return render(<ThemeProvider defaultTheme="glass">{ui}</ThemeProvider>);
};

describe("IconButton", () => {
  it("renders with icon", () => {
    const { container } = renderWithTheme(
      <IconButton icon={Github} />
    );
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("calls onClick when clicked", () => {
    const handleClick = vi.fn();
    renderWithTheme(
      <IconButton icon={Github} onClick={handleClick} />
    );

    fireEvent.click(screen.getByRole("button"));
    expect(handleClick).toHaveBeenCalled();
  });

  it("renders with title attribute", () => {
    renderWithTheme(
      <IconButton icon={Github} title="Open GitHub" />
    );
    expect(screen.getByTitle("Open GitHub")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = renderWithTheme(
      <IconButton icon={Github} className="custom-class" />
    );
    expect(container.querySelector(".custom-class")).toBeInTheDocument();
  });

  it("renders different icons", () => {
    const { rerender, container } = render(
      <ThemeProvider defaultTheme="glass">
        <IconButton icon={Github} />
      </ThemeProvider>
    );
    expect(container.querySelector("svg")).toBeInTheDocument();

    rerender(
      <ThemeProvider defaultTheme="glass">
        <IconButton icon={Settings} />
      </ThemeProvider>
    );
    expect(container.querySelector("svg")).toBeInTheDocument();

    rerender(
      <ThemeProvider defaultTheme="glass">
        <IconButton icon={Share} />
      </ThemeProvider>
    );
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("has correct size", () => {
    const { container } = renderWithTheme(
      <IconButton icon={Github} />
    );
    expect(container.querySelector(".h-9")).toBeInTheDocument();
    expect(container.querySelector(".w-9")).toBeInTheDocument();
  });

  it("has gradient background", () => {
    renderWithTheme(
      <IconButton icon={Github} />
    );
    const button = screen.getByRole("button");
    // Verify it has inline style applied (gradient is set via style prop)
    expect(button).toHaveAttribute("style");
  });

  it("is accessible via button role", () => {
    renderWithTheme(
      <IconButton icon={Github} title="GitHub" />
    );
    expect(screen.getByRole("button")).toBeInTheDocument();
  });
});
