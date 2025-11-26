import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { GlassInput } from "../GlassInput";
import { ThemeProvider } from "../../context/ThemeContext";
import { Mail } from "lucide-react";

const renderWithTheme = (ui: React.ReactElement) => {
  return render(<ThemeProvider defaultTheme="glass">{ui}</ThemeProvider>);
};

describe("GlassInput", () => {
  it("renders with placeholder", () => {
    renderWithTheme(<GlassInput placeholder="Search..." />);
    expect(screen.getByPlaceholderText("Search...")).toBeInTheDocument();
  });

  it("displays value", () => {
    renderWithTheme(<GlassInput value="test value" />);
    expect(screen.getByDisplayValue("test value")).toBeInTheDocument();
  });

  it("calls onChange when typing", () => {
    const handleChange = vi.fn();
    renderWithTheme(<GlassInput onChange={handleChange} />);

    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "new value" } });

    expect(handleChange).toHaveBeenCalledWith("new value");
  });

  it("renders with default search icon", () => {
    const { container } = renderWithTheme(<GlassInput />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("renders with custom icon", () => {
    const { container } = renderWithTheme(<GlassInput icon={Mail} />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("is disabled when disabled prop is true", () => {
    renderWithTheme(<GlassInput disabled />);
    expect(screen.getByRole("textbox")).toBeDisabled();
  });

  it("applies custom className", () => {
    const { container } = renderWithTheme(
      <GlassInput className="custom-class" />
    );
    expect(container.querySelector(".custom-class")).toBeInTheDocument();
  });

  it("handles empty onChange gracefully", () => {
    renderWithTheme(<GlassInput />);
    const input = screen.getByRole("textbox");

    // Should not throw
    expect(() => {
      fireEvent.change(input, { target: { value: "test" } });
    }).not.toThrow();
  });
});
