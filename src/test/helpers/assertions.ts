/**
 * Custom Test Assertion Helpers
 *
 * Reusable assertion utilities to improve test quality and reduce duplication.
 * These helpers provide semantic, descriptive test assertions for common patterns.
 *
 * Week 2 P1: Quality improvements for test suite
 */

import { screen, within } from "@testing-library/react";
import { expect } from "vitest";

/**
 * Asserts that a metric value is displayed with correct formatting and accessibility
 *
 * @param value - The expected numeric value
 * @param options - Configuration options
 * @param options.format - Value format: 'percentage', 'number', or 'ratio'
 * @param options.ariaLabel - Expected ARIA label for accessibility
 * @param options.container - Optional container to scope search
 *
 * @example
 * expectMetricValue(85, { format: 'percentage', ariaLabel: 'Activity score' })
 * // Checks for: "85%" with aria-label="Activity score"
 *
 * @example
 * expectMetricValue(1234, { format: 'number' })
 * // Checks for: "1234" displayed in document
 */
export function expectMetricValue(
  value: number,
  options: {
    format?: "percentage" | "number" | "ratio";
    ariaLabel?: string;
    container?: HTMLElement;
  } = {},
) {
  const { format = "number", ariaLabel, container } = options;
  const scope = container ? within(container) : screen;

  let formattedValue: string;
  switch (format) {
    case "percentage":
      formattedValue = `${value}%`;
      break;
    case "number":
      formattedValue = value.toString();
      break;
    case "ratio":
      formattedValue = value.toString();
      break;
    default:
      formattedValue = value.toString();
  }

  const element = scope.getByText(formattedValue);
  expect(
    element,
    `Expected to find metric value "${formattedValue}"`,
  ).toBeInTheDocument();

  if (ariaLabel) {
    const labeledElement = scope.getByLabelText(ariaLabel);
    expect(
      labeledElement,
      `Expected element with aria-label="${ariaLabel}" to contain "${formattedValue}"`,
    ).toBeInTheDocument();
  }
}

/**
 * Asserts that a breakdown metric is displayed with value/max format
 *
 * @param label - The metric label (e.g., "Recent commits")
 * @param value - The current value
 * @param max - The maximum value
 * @param container - Optional container to scope search
 *
 * @example
 * expectBreakdownMetric('Recent commits', 40, 40)
 * // Checks for: label "Recent commits" and value "40/40"
 */
export function expectBreakdownMetric(
  label: string,
  value: number,
  max: number,
  container?: HTMLElement,
) {
  const scope = container ? within(container) : screen;
  const formattedValue = `${value}/${max}`;

  expect(
    scope.getByText(label),
    `Expected to find breakdown label "${label}"`,
  ).toBeInTheDocument();

  expect(
    scope.getByText(formattedValue),
    `Expected to find breakdown value "${formattedValue}"`,
  ).toBeInTheDocument();
}

/**
 * Schema for component structure validation
 */
export interface StructureSchema {
  selector: string;
  required?: boolean;
  attributes?: Record<string, string | RegExp>;
  children?: StructureSchema[];
  count?: number;
}

/**
 * Validates that component DOM structure matches expected schema
 *
 * @param container - The container element to validate
 * @param schema - Array of structure requirements to validate
 *
 * @example
 * expectStructure(container, [
 *   { selector: '[role="tablist"]', required: true },
 *   { selector: '[role="tab"]', count: 4 },
 *   {
 *     selector: '.metric-card',
 *     required: true,
 *     attributes: { 'data-slot': 'card' },
 *     children: [
 *       { selector: '.metric-value', required: true },
 *       { selector: '.metric-label', required: true }
 *     ]
 *   }
 * ])
 */
export function expectStructure(
  container: HTMLElement,
  schema: StructureSchema[],
) {
  schema.forEach(
    ({ selector, required = true, attributes, children, count }) => {
      const elements = container.querySelectorAll(selector);

      if (required) {
        expect(
          elements.length,
          `Required element "${selector}" not found in container`,
        ).toBeGreaterThan(0);
      }

      if (count !== undefined) {
        expect(
          elements.length,
          `Expected ${count} element(s) matching "${selector}", found ${elements.length}`,
        ).toBe(count);
      }

      if (attributes && elements.length > 0) {
        const element = elements[0];
        Object.entries(attributes).forEach(([attr, expectedValue]) => {
          const actualValue = element.getAttribute(attr);

          if (expectedValue instanceof RegExp) {
            expect(
              actualValue,
              `Expected attribute "${attr}" to match pattern ${expectedValue}`,
            ).toMatch(expectedValue);
          } else {
            expect(
              actualValue,
              `Expected attribute "${attr}" to equal "${expectedValue}"`,
            ).toBe(expectedValue);
          }
        });
      }

      if (children && elements.length > 0) {
        expectStructure(elements[0] as HTMLElement, children);
      }
    },
  );
}

/**
 * Asserts that component has correct ARIA attributes for accessibility
 *
 * @param element - The element to check
 * @param expectedAttributes - Expected ARIA attributes
 *
 * @example
 * expectARIA(button, {
 *   role: 'button',
 *   'aria-label': 'Explain Activity score',
 *   'aria-expanded': 'false'
 * })
 */
export function expectARIA(
  element: HTMLElement,
  expectedAttributes: Record<string, string | boolean | null>,
) {
  Object.entries(expectedAttributes).forEach(([attr, expectedValue]) => {
    if (expectedValue === null) {
      expect(
        element.hasAttribute(attr),
        `Expected element to NOT have attribute "${attr}"`,
      ).toBe(false);
    } else {
      const actualValue = element.getAttribute(attr);
      const stringValue = String(expectedValue);

      expect(
        actualValue,
        `Expected "${attr}" to be "${stringValue}", but got "${actualValue}"`,
      ).toBe(stringValue);
    }
  });
}

/**
 * Asserts that loading state is rendered correctly
 *
 * @param container - The container to check
 * @param expectedLoading - Whether loading state should be visible
 *
 * @example
 * expectLoadingState(container, true)
 * // Checks for: .animate-pulse class, skeleton loaders
 */
export function expectLoadingState(
  container: HTMLElement,
  expectedLoading: boolean,
) {
  const pulseElements = container.querySelectorAll(".animate-pulse");

  if (expectedLoading) {
    expect(
      pulseElements.length,
      "Expected to find loading skeleton with .animate-pulse class",
    ).toBeGreaterThan(0);
  } else {
    expect(
      pulseElements.length,
      "Expected NOT to find loading skeleton with .animate-pulse class",
    ).toBe(0);
  }
}

/**
 * Asserts that progress bar has correct width percentage
 *
 * @param container - The container to search in
 * @param expectedPercentage - Expected width percentage (0-100)
 *
 * @example
 * expectProgressBar(container, 75)
 * // Checks for: element with style="width: 75%"
 */
export function expectProgressBar(
  container: HTMLElement,
  expectedPercentage: number,
) {
  const progressBar = container.querySelector(
    `[style*="width: ${expectedPercentage}%"]`,
  );

  expect(
    progressBar,
    `Expected to find progress bar with width: ${expectedPercentage}%`,
  ).toBeInTheDocument();
}

/**
 * Asserts that an element has expected CSS classes
 *
 * @param element - The element to check
 * @param expectedClasses - Array of class names that should be present
 * @param unexpectedClasses - Array of class names that should NOT be present
 *
 * @example
 * expectClasses(card, ['hover:shadow-lg', 'hover:-translate-y-0.5'])
 * // Checks that card has hover effect classes
 *
 * @example
 * expectClasses(button, ['bg-primary'], ['bg-destructive'])
 * // Checks button has primary bg, NOT destructive bg
 */
export function expectClasses(
  element: HTMLElement,
  expectedClasses: string[],
  unexpectedClasses: string[] = [],
) {
  expectedClasses.forEach((className) => {
    expect(
      element,
      `Expected element to have class "${className}"`,
    ).toHaveClass(className);
  });

  unexpectedClasses.forEach((className) => {
    expect(
      element,
      `Expected element NOT to have class "${className}"`,
    ).not.toHaveClass(className);
  });
}

/**
 * Asserts that elements are rendered in expected order
 *
 * @param container - The container element
 * @param selector - CSS selector for elements to check
 * @param expectedOrder - Array of expected text content in order
 *
 * @example
 * expectOrder(container, '[data-slot="card-title"]', [
 *   'Repositories',
 *   'Followers',
 *   'Following',
 *   'Gists'
 * ])
 */
export function expectOrder(
  container: HTMLElement,
  selector: string,
  expectedOrder: string[],
) {
  const elements = Array.from(container.querySelectorAll(selector));

  expect(
    elements.length,
    `Expected ${expectedOrder.length} elements matching "${selector}", found ${elements.length}`,
  ).toBe(expectedOrder.length);

  elements.forEach((element, index) => {
    const actualText = element.textContent?.trim() || "";
    const expectedText = expectedOrder[index];

    expect(
      actualText,
      `Element at index ${index} should contain "${expectedText}"`,
    ).toContain(expectedText);
  });
}

/**
 * Asserts that icons are rendered (checks for SVG elements)
 *
 * @param container - The container to search in
 * @param expectedCount - Expected number of icons (optional)
 *
 * @example
 * expectIcons(container, 4)
 * // Checks for: exactly 4 SVG elements
 *
 * @example
 * expectIcons(container)
 * // Checks for: at least 1 SVG element
 */
export function expectIcons(container: HTMLElement, expectedCount?: number) {
  const icons = container.querySelectorAll("svg");

  if (expectedCount !== undefined) {
    expect(
      icons.length,
      `Expected exactly ${expectedCount} icons (SVG elements), found ${icons.length}`,
    ).toBe(expectedCount);
  } else {
    expect(
      icons.length,
      "Expected at least one icon (SVG element)",
    ).toBeGreaterThan(0);
  }
}

/**
 * Asserts that a grid layout has correct responsive classes
 *
 * @param container - The container element to check
 * @param expectedClasses - Expected grid classes (e.g., ['grid', 'grid-cols-2', 'md:grid-cols-4'])
 *
 * @example
 * expectGridLayout(container.firstChild as HTMLElement, [
 *   'grid',
 *   'grid-cols-2',
 *   'md:grid-cols-4'
 * ])
 */
export function expectGridLayout(
  element: HTMLElement,
  expectedClasses: string[],
) {
  expectClasses(element, expectedClasses);
}

/**
 * Asserts that error state is displayed correctly
 *
 * @param container - The container to check
 * @param expectedError - Whether error state should be visible
 * @param errorMessage - Optional expected error message
 *
 * @example
 * expectErrorState(container, true, 'Failed to load data')
 */
export function expectErrorState(
  container: HTMLElement,
  expectedError: boolean,
  errorMessage?: string,
) {
  if (expectedError) {
    // Check for common error indicators
    const errorElements = container.querySelectorAll(
      '[role="alert"], .error, .text-destructive',
    );

    expect(
      errorElements.length,
      "Expected to find error state indicators",
    ).toBeGreaterThan(0);

    if (errorMessage) {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    }
  } else {
    const errorElements = container.querySelectorAll('[role="alert"]');
    expect(
      errorElements.length,
      "Expected NOT to find error state indicators",
    ).toBe(0);
  }
}

/**
 * Asserts that empty state is displayed correctly
 *
 * @param container - The container to check
 * @param expectedEmpty - Whether empty state should be visible
 * @param emptyMessage - Optional expected empty message
 *
 * @example
 * expectEmptyState(container, true, 'No repositories found')
 */
export function expectEmptyState(
  container: HTMLElement,
  expectedEmpty: boolean,
  emptyMessage?: string,
) {
  if (expectedEmpty) {
    const emptyElements = container.querySelectorAll(
      '[data-empty="true"], .empty-state',
    );

    expect(
      emptyElements.length,
      "Expected to find empty state indicators",
    ).toBeGreaterThan(0);

    if (emptyMessage) {
      expect(screen.getByText(emptyMessage)).toBeInTheDocument();
    }
  } else {
    const emptyElements = container.querySelectorAll('[data-empty="true"]');
    expect(
      emptyElements.length,
      "Expected NOT to find empty state indicators",
    ).toBe(0);
  }
}
