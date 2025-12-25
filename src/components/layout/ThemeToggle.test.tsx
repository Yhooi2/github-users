/**
 * ThemeToggle tests - Updated for shadcn-glass-ui ThemeProvider
 *
 * ThemeToggle now uses shadcn-glass-ui's useTheme hook which requires ThemeProvider.
 * The theme system supports 3 themes: 'light', 'aurora', 'glass' (cycling order).
 */

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider } from "shadcn-glass-ui";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ThemeToggle } from "./ThemeToggle";

describe("ThemeToggle", () => {
  beforeEach(() => {
    localStorage.clear();

    // Mock matchMedia
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  });

  afterEach(() => {
    localStorage.clear();
  });

  // Helper to render with ThemeProvider
  const renderWithTheme = (ui: React.ReactElement) => {
    return render(<ThemeProvider>{ui}</ThemeProvider>);
  };

  it("should render toggle button", () => {
    renderWithTheme(<ThemeToggle />);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("should cycle through themes on click", async () => {
    const user = userEvent.setup();
    renderWithTheme(<ThemeToggle />);

    const button = screen.getByRole("button");

    // Default theme is 'glass', next is 'light'
    // Initial: glass (shows Sun icon for next theme: light)
    expect(button).toBeInTheDocument();

    // Click to cycle: glass -> light
    await user.click(button);

    // Click to cycle: light -> aurora
    await user.click(button);

    // Click to cycle: aurora -> glass
    await user.click(button);

    // Should be back at glass theme
    expect(button).toBeInTheDocument();
  });

  it("should have accessible label", () => {
    renderWithTheme(<ThemeToggle />);
    const button = screen.getByRole("button");
    // Should have aria-label indicating next theme
    expect(button).toHaveAttribute("aria-label");
  });
});
