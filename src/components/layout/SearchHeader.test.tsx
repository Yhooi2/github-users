/**
 * SearchHeader tests - Updated for HeaderNavGlass migration
 *
 * HeaderNavGlass is a complete section component from shadcn-glass-ui that includes:
 * - Built-in branding (GitHub icon + "User Analytics" text)
 * - SearchBoxGlass component
 * - Theme toggle button
 * - "Sign in with GitHub" button
 *
 * Key differences from old implementation:
 * - Requires ThemeProvider from shadcn-glass-ui
 * - UserMenu replaced with built-in GitHub sign-in button
 */

import { render, screen } from "@testing-library/react";
import { ThemeProvider } from "shadcn-glass-ui";
import { describe, expect, it, vi } from "vitest";
import { SearchHeader, type SearchHeaderProps } from "./SearchHeader";

describe("SearchHeader", () => {
  const mockOnSearch = vi.fn();

  const defaultProps: SearchHeaderProps = {
    userName: "",
    onSearch: mockOnSearch,
    userMenuProps: {
      isAuthenticated: false,
      onSignIn: vi.fn(),
      onSignOut: vi.fn(),
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Helper to render with ThemeProvider
  const renderWithTheme = (ui: React.ReactElement) => {
    return render(<ThemeProvider>{ui}</ThemeProvider>);
  };

  it("renders with HeaderNavGlass branding", () => {
    renderWithTheme(<SearchHeader {...defaultProps} />);

    // HeaderNavGlass includes "User Analytics" branding
    expect(screen.getByText("User Analytics")).toBeInTheDocument();
  });

  it("renders HeaderNavGlass with search input", () => {
    renderWithTheme(<SearchHeader {...defaultProps} />);

    // HeaderNavGlass includes SearchBoxGlass with placeholder
    const searchInput = screen.getByPlaceholderText("Search username...");
    expect(searchInput).toBeInTheDocument();
  });

  it("renders with populated username", () => {
    renderWithTheme(<SearchHeader {...defaultProps} userName="gaearon" />);

    // Search input should have the username as value
    const searchInput = screen.getByPlaceholderText(
      "Search username...",
    ) as HTMLInputElement;
    expect(searchInput.value).toBe("gaearon");
  });

  it("renders with empty username", () => {
    renderWithTheme(<SearchHeader {...defaultProps} />);

    const searchInput = screen.getByPlaceholderText(
      "Search username...",
    ) as HTMLInputElement;
    expect(searchInput.value).toBe("");
  });

  it("renders GitHub sign-in button on desktop", () => {
    renderWithTheme(<SearchHeader {...defaultProps} />);

    // HeaderNavGlass includes "Sign in with GitHub" button
    const signInButton = screen.getByText("Sign in with GitHub");
    expect(signInButton).toBeInTheDocument();
  });

  it("has proper semantic HTML structure", () => {
    renderWithTheme(<SearchHeader {...defaultProps} />);

    const header = screen.getByRole("banner");
    expect(header).toBeInTheDocument();
    expect(header.tagName).toBe("HEADER");
  });

  it("renders GitHub icon button", () => {
    renderWithTheme(<SearchHeader {...defaultProps} />);

    // HeaderNavGlass includes GitHub icon button
    const githubButton = screen.getByLabelText("GitHub");
    expect(githubButton).toBeInTheDocument();
  });
});
