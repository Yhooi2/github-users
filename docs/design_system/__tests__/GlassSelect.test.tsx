import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { GlassSelect } from "../GlassSelect";
import { ThemeProvider } from "../../context/ThemeContext";

const renderWithTheme = (ui: React.ReactElement) => {
  return render(<ThemeProvider defaultTheme="glass">{ui}</ThemeProvider>);
};

const mockOptions = [
  { value: "commits", label: "Sort: Commits ↓" },
  { value: "stars", label: "Sort: Stars ↓" },
  { value: "name", label: "Sort: Name ↓" },
];

describe("GlassSelect", () => {
  it("renders all options", () => {
    renderWithTheme(
      <GlassSelect value="commits" options={mockOptions} />
    );
    expect(screen.getByRole("combobox")).toBeInTheDocument();
    expect(screen.getByText("Sort: Commits ↓")).toBeInTheDocument();
  });

  it("displays selected value", () => {
    renderWithTheme(
      <GlassSelect value="stars" options={mockOptions} />
    );
    expect(screen.getByRole("combobox")).toHaveValue("stars");
  });

  it("calls onChange when selection changes", () => {
    const handleChange = vi.fn();
    renderWithTheme(
      <GlassSelect value="commits" onChange={handleChange} options={mockOptions} />
    );

    fireEvent.change(screen.getByRole("combobox"), { target: { value: "stars" } });
    expect(handleChange).toHaveBeenCalledWith("stars");
  });

  it("renders all option labels", () => {
    renderWithTheme(
      <GlassSelect value="commits" options={mockOptions} />
    );

    const select = screen.getByRole("combobox");
    expect(select.querySelectorAll("option")).toHaveLength(3);
  });

  it("applies custom className", () => {
    const { container } = renderWithTheme(
      <GlassSelect value="commits" options={mockOptions} className="custom-class" />
    );
    expect(container.querySelector(".custom-class")).toBeInTheDocument();
  });

  it("handles empty onChange gracefully", () => {
    renderWithTheme(
      <GlassSelect value="commits" options={mockOptions} />
    );

    // Should not throw
    expect(() => {
      fireEvent.change(screen.getByRole("combobox"), { target: { value: "stars" } });
    }).not.toThrow();
  });
});
