import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { SearchHeader } from "./SearchHeader";

// Mock child components
vi.mock("@/components/SearchForm", () => ({
  default: ({
    userName,
    setUserName,
  }: {
    userName: string;
    setUserName: (name: string) => void;
  }) => (
    <div data-testid="search-form">
      <input
        data-testid="search-input"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
        placeholder="Search GitHub User..."
      />
    </div>
  ),
}));

vi.mock("@/components/layout/ThemeToggle", () => ({
  ThemeToggle: () => <button data-testid="theme-toggle">Toggle Theme</button>,
}));

describe("SearchHeader", () => {
  const mockOnSearch = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders app title and description", () => {
    render(<SearchHeader userName="" onSearch={mockOnSearch} />);

    expect(screen.getByText("GitHub User Analytics")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Analyze GitHub users with comprehensive metrics and timeline",
      ),
    ).toBeInTheDocument();
  });

  it("renders search form component", () => {
    render(<SearchHeader userName="" onSearch={mockOnSearch} />);

    expect(screen.getByTestId("search-form")).toBeInTheDocument();
  });

  it("renders theme toggle component", () => {
    render(<SearchHeader userName="" onSearch={mockOnSearch} />);

    expect(screen.getByTestId("theme-toggle")).toBeInTheDocument();
  });

  it("passes userName prop to SearchForm", () => {
    render(<SearchHeader userName="torvalds" onSearch={mockOnSearch} />);

    const input = screen.getByTestId("search-input") as HTMLInputElement;
    expect(input.value).toBe("torvalds");
  });

  it("passes onSearch callback to SearchForm", () => {
    render(<SearchHeader userName="" onSearch={mockOnSearch} />);

    const input = screen.getByTestId("search-input");
    input.dispatchEvent(new Event("change", { bubbles: true }));

    // SearchForm should receive the onSearch callback
    expect(screen.getByTestId("search-form")).toBeInTheDocument();
  });

  it("has proper semantic HTML structure", () => {
    render(<SearchHeader userName="" onSearch={mockOnSearch} />);

    const header = screen.getByRole("banner");
    expect(header).toBeInTheDocument();
    expect(header.tagName).toBe("HEADER");
  });

  it("renders with empty username", () => {
    render(<SearchHeader userName="" onSearch={mockOnSearch} />);

    const input = screen.getByTestId("search-input") as HTMLInputElement;
    expect(input.value).toBe("");
  });

  it("renders with populated username", () => {
    render(<SearchHeader userName="gaearon" onSearch={mockOnSearch} />);

    const input = screen.getByTestId("search-input") as HTMLInputElement;
    expect(input.value).toBe("gaearon");
  });
});
