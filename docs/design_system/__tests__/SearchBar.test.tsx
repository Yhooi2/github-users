import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { SearchBar } from "../SearchBar";
import { ThemeProvider } from "../../context/ThemeContext";

const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider defaultTheme="glass">{ui}</ThemeProvider>);

describe("SearchBar", () => {
  it("renders with value", () => {
    renderWithTheme(<SearchBar value="test" />);
    expect(screen.getByDisplayValue("test")).toBeInTheDocument();
  });

  it("renders with placeholder", () => {
    renderWithTheme(<SearchBar value="" placeholder="Search..." />);
    expect(screen.getByPlaceholderText("Search...")).toBeInTheDocument();
  });

  it("renders search button with text", () => {
    renderWithTheme(<SearchBar value="" buttonText="Find" />);
    expect(screen.getByRole("button")).toHaveTextContent("Find");
  });

  it("calls onChange when typing", () => {
    const handleChange = vi.fn();
    renderWithTheme(<SearchBar value="" onChange={handleChange} />);

    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "new value" } });

    expect(handleChange).toHaveBeenCalledWith("new value");
  });

  it("calls onSearch when button clicked", () => {
    const handleSearch = vi.fn();
    renderWithTheme(<SearchBar value="test" onSearch={handleSearch} />);

    fireEvent.click(screen.getByRole("button"));

    expect(handleSearch).toHaveBeenCalledTimes(1);
  });

  it("calls onSearch on Enter key", () => {
    const handleSearch = vi.fn();
    renderWithTheme(<SearchBar value="test" onSearch={handleSearch} />);

    const input = screen.getByRole("textbox");
    fireEvent.keyDown(input, { key: "Enter" });

    expect(handleSearch).toHaveBeenCalledTimes(1);
  });

  it("renders as readOnly when specified", () => {
    renderWithTheme(<SearchBar value="readonly" readOnly />);
    expect(screen.getByRole("textbox")).toHaveAttribute("readonly");
  });

  it("applies custom className", () => {
    const { container } = renderWithTheme(
      <SearchBar value="" className="custom-class" />
    );
    expect(container.firstChild).toHaveClass("custom-class");
  });

  it("renders search icon in button", () => {
    renderWithTheme(<SearchBar value="" />);
    const button = screen.getByRole("button");
    expect(button.querySelector("svg")).toBeInTheDocument();
  });
});
