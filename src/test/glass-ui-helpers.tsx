/**
 * Test Utilities for Glass UI Migration
 *
 * Provides helpers for testing components in both legacy and Glass UI modes.
 */

import { render, type RenderOptions } from "@testing-library/react";
import { ReactElement } from "react";
import { ThemeProvider } from "shadcn-glass-ui";

/**
 * Custom render function with providers
 */
export function renderWithTheme(
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">,
) {
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <ThemeProvider defaultTheme="glass">{children}</ThemeProvider>
  );

  return render(ui, { wrapper: Wrapper, ...options });
}

/**
 * Render component with Glass UI theme enabled
 */
export function renderWithGlassTheme(
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">,
) {
  // Set feature flag for this test
  localStorage.setItem("ff_USE_GLASS_UI", "true");

  const result = renderWithTheme(ui, options);

  // Cleanup after test
  return {
    ...result,
    cleanup: () => {
      localStorage.removeItem("ff_USE_GLASS_UI");
      result.unmount();
    },
  };
}

/**
 * Test a component in both legacy and Glass UI modes
 *
 * @example
 * ```ts
 * testBothThemes('Button', <Button>Click</Button>, (result) => {
 *   expect(result.getByText('Click')).toBeInTheDocument();
 * });
 * ```
 */
export function testBothThemes(
  componentName: string,
  component: ReactElement,
  testFn: (result: ReturnType<typeof render>) => void,
) {
  describe(`${componentName} (both themes)`, () => {
    it("works with legacy theme", () => {
      localStorage.removeItem("ff_USE_GLASS_UI");
      const result = renderWithTheme(component);
      testFn(result);
      result.unmount();
    });

    it("works with Glass UI theme", () => {
      localStorage.setItem("ff_USE_GLASS_UI", "true");
      const result = renderWithTheme(component);
      testFn(result);
      localStorage.removeItem("ff_USE_GLASS_UI");
      result.unmount();
    });
  });
}

/**
 * Mock feature flag for tests
 */
export function mockFeatureFlag(flag: string, value: boolean) {
  const key = `ff_${flag}`;
  if (value) {
    localStorage.setItem(key, "true");
  } else {
    localStorage.removeItem(key);
  }
}

/**
 * Clear all feature flags
 */
export function clearFeatureFlags() {
  const keys = Object.keys(localStorage);
  keys.forEach((key) => {
    if (key.startsWith("ff_")) {
      localStorage.removeItem(key);
    }
  });
}
