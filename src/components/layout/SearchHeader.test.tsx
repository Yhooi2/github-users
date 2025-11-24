import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { SearchHeader, type SearchHeaderProps } from "./SearchHeader";

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

vi.mock("@/components/layout/UserMenu", () => ({
  UserMenu: ({ isAuthenticated }: { isAuthenticated: boolean }) => (
    <div data-testid="user-menu">
      {isAuthenticated ? "Authenticated" : "Sign In"}
    </div>
  ),
}));

describe("SearchHeader", () => {
  const mockOnSearch = vi.fn();
  const mockOnSignIn = vi.fn();
  const mockOnSignOut = vi.fn();

  const defaultProps: SearchHeaderProps = {
    userName: "",
    onSearch: mockOnSearch,
    userMenuProps: {
      isAuthenticated: false,
      onSignIn: mockOnSignIn,
      onSignOut: mockOnSignOut,
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders compact title with Github icon", () => {
    render(<SearchHeader {...defaultProps} />);

    // Title should be "User Analytics" (compact version)
    expect(screen.getByText("User Analytics")).toBeInTheDocument();
    // Should have heading element
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "User Analytics",
    );
  });

  it("renders search form component", () => {
    render(<SearchHeader {...defaultProps} />);

    expect(screen.getByTestId("search-form")).toBeInTheDocument();
  });

  it("renders theme toggle component", () => {
    render(<SearchHeader {...defaultProps} />);

    expect(screen.getByTestId("theme-toggle")).toBeInTheDocument();
  });

  it("renders user menu component", () => {
    render(<SearchHeader {...defaultProps} />);

    expect(screen.getByTestId("user-menu")).toBeInTheDocument();
  });

  it("passes userName prop to SearchForm", () => {
    render(<SearchHeader {...defaultProps} userName="torvalds" />);

    const input = screen.getByTestId("search-input") as HTMLInputElement;
    expect(input.value).toBe("torvalds");
  });

  it("passes onSearch callback to SearchForm", () => {
    render(<SearchHeader {...defaultProps} />);

    const input = screen.getByTestId("search-input");
    input.dispatchEvent(new Event("change", { bubbles: true }));

    // SearchForm should receive the onSearch callback
    expect(screen.getByTestId("search-form")).toBeInTheDocument();
  });

  it("has proper semantic HTML structure", () => {
    render(<SearchHeader {...defaultProps} />);

    const header = screen.getByRole("banner");
    expect(header).toBeInTheDocument();
    expect(header.tagName).toBe("HEADER");
  });

  it("renders with empty username", () => {
    render(<SearchHeader {...defaultProps} />);

    const input = screen.getByTestId("search-input") as HTMLInputElement;
    expect(input.value).toBe("");
  });

  it("renders with populated username", () => {
    render(<SearchHeader {...defaultProps} userName="gaearon" />);

    const input = screen.getByTestId("search-input") as HTMLInputElement;
    expect(input.value).toBe("gaearon");
  });

  it("passes userMenuProps to UserMenu when authenticated", () => {
    render(
      <SearchHeader
        {...defaultProps}
        userMenuProps={{
          isAuthenticated: true,
          user: { login: "testuser", avatarUrl: "https://example.com/avatar" },
          onSignIn: mockOnSignIn,
          onSignOut: mockOnSignOut,
        }}
      />,
    );

    expect(screen.getByTestId("user-menu")).toHaveTextContent("Authenticated");
  });

  it("passes userMenuProps to UserMenu when not authenticated", () => {
    render(<SearchHeader {...defaultProps} />);

    expect(screen.getByTestId("user-menu")).toHaveTextContent("Sign In");
  });

  it("uses flex layout without absolute positioning", () => {
    render(<SearchHeader {...defaultProps} />);

    const header = screen.getByRole("banner");
    // Header should use flex layout
    expect(header).toHaveClass("flex");
    // Should not have relative class (which would be needed for absolute children)
    expect(header).not.toHaveClass("relative");
  });
});
