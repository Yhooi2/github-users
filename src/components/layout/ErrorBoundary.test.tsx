/**
 * Tests for ErrorBoundary component
 *
 * ErrorBoundary is a React class component that catches JavaScript errors
 * anywhere in the child component tree, logs those errors, and displays
 * a fallback UI instead of the component tree that crashed.
 *
 * Testing Philosophy:
 * - Test error catching and display
 * - Test fallback rendering
 * - Test callback invocation
 * - Test normal rendering when no errors
 */

import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ErrorBoundary } from "./ErrorBoundary";

// Test component that throws an error
function ThrowError({ shouldThrow = true }: { shouldThrow?: boolean }) {
  if (shouldThrow) {
    throw new Error("Test error message");
  }
  return <div>Normal content</div>;
}

// Custom fallback component for testing
function CustomFallback() {
  return <div>Custom error fallback</div>;
}

describe("ErrorBoundary", () => {
  // Suppress console.error during tests to avoid noise
  beforeEach(() => {
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  describe("Error Catching", () => {
    it("should catch errors thrown by child components", () => {
      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>,
      );

      // Default ErrorState should be rendered
      expect(
        screen.getByRole("alert"),
        "ErrorBoundary should render alert role when child component throws error",
      ).toBeInTheDocument();
      expect(
        screen.getByText("Something went wrong"),
        'ErrorBoundary should display default error title "Something went wrong"',
      ).toBeInTheDocument();
      expect(
        screen.getByText("Test error message"),
        "ErrorBoundary should display the actual error message from thrown error",
      ).toBeInTheDocument();
    });

    it("should display error message from caught error", () => {
      function CustomError() {
        throw new Error("Custom error details");
      }

      render(
        <ErrorBoundary>
          <CustomError />
        </ErrorBoundary>,
      );

      expect(screen.getByText("Custom error details")).toBeInTheDocument();
    });

    it("should show default message if error has no message", () => {
      function NoMessageError() {
        const error = new Error();
        error.message = "";
        throw error;
      }

      render(
        <ErrorBoundary>
          <NoMessageError />
        </ErrorBoundary>,
      );

      expect(
        screen.getByText(
          "An unexpected error occurred while rendering this component.",
        ),
      ).toBeInTheDocument();
    });
  });

  describe("Normal Rendering", () => {
    it("should render children when no error occurs", () => {
      render(
        <ErrorBoundary>
          <div>Normal content</div>
        </ErrorBoundary>,
      );

      expect(
        screen.getByText("Normal content"),
        "ErrorBoundary should render children normally when no error is thrown",
      ).toBeInTheDocument();
      expect(
        screen.queryByRole("alert"),
        "ErrorBoundary should NOT render error alert when children render successfully",
      ).not.toBeInTheDocument();
    });

    it("should render multiple children normally", () => {
      render(
        <ErrorBoundary>
          <div>First child</div>
          <div>Second child</div>
          <div>Third child</div>
        </ErrorBoundary>,
      );

      expect(screen.getByText("First child")).toBeInTheDocument();
      expect(screen.getByText("Second child")).toBeInTheDocument();
      expect(screen.getByText("Third child")).toBeInTheDocument();
    });
  });

  describe("Custom Fallback", () => {
    it("should render custom fallback instead of default ErrorState", () => {
      render(
        <ErrorBoundary fallback={<CustomFallback />}>
          <ThrowError />
        </ErrorBoundary>,
      );

      expect(screen.getByText("Custom error fallback")).toBeInTheDocument();
      expect(
        screen.queryByText("Something went wrong"),
      ).not.toBeInTheDocument();
    });

    it("should render custom fallback with error info", () => {
      function DetailedFallback() {
        return (
          <div>
            <h1>Oops! Something broke</h1>
            <p>Please try refreshing the page</p>
          </div>
        );
      }

      render(
        <ErrorBoundary fallback={<DetailedFallback />}>
          <ThrowError />
        </ErrorBoundary>,
      );

      expect(screen.getByText("Oops! Something broke")).toBeInTheDocument();
      expect(
        screen.getByText("Please try refreshing the page"),
      ).toBeInTheDocument();
    });
  });

  describe("Error Callback", () => {
    it("should call onError callback when error is caught", () => {
      const onError = vi.fn();

      render(
        <ErrorBoundary onError={onError}>
          <ThrowError />
        </ErrorBoundary>,
      );

      expect(onError).toHaveBeenCalledTimes(1);
      expect(onError).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Test error message",
        }),
        expect.objectContaining({
          componentStack: expect.any(String),
        }),
      );
    });

    it("should not call onError when no error occurs", () => {
      const onError = vi.fn();

      render(
        <ErrorBoundary onError={onError}>
          <div>Normal content</div>
        </ErrorBoundary>,
      );

      expect(onError).not.toHaveBeenCalled();
    });

    it("should pass error and errorInfo to callback", () => {
      const onError = vi.fn();

      render(
        <ErrorBoundary onError={onError}>
          <ThrowError />
        </ErrorBoundary>,
      );

      const [error, errorInfo] = onError.mock.calls[0];
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe("Test error message");
      expect(errorInfo).toHaveProperty("componentStack");
      expect(typeof errorInfo.componentStack).toBe("string");
    });
  });

  describe("Development Mode Logging", () => {
    it("should log error to console in development", () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = "development";

      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>,
      );

      expect(consoleSpy).toHaveBeenCalled();
      expect(
        consoleSpy.mock.calls.some((call) =>
          call[0]?.toString().includes("ErrorBoundary caught an error"),
        ),
      ).toBe(true);

      consoleSpy.mockRestore();
      process.env.NODE_ENV = originalEnv;
    });
  });

  describe("Edge Cases", () => {
    it("should handle null/undefined children gracefully", () => {
      render(
        <ErrorBoundary>
          {null}
          {undefined}
        </ErrorBoundary>,
      );

      // Should not crash, just render nothing
      expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    });

    it("should handle deeply nested errors", () => {
      function DeepNested() {
        return (
          <div>
            <div>
              <div>
                <ThrowError />
              </div>
            </div>
          </div>
        );
      }

      render(
        <ErrorBoundary>
          <DeepNested />
        </ErrorBoundary>,
      );

      expect(screen.getByRole("alert")).toBeInTheDocument();
      expect(screen.getByText("Test error message")).toBeInTheDocument();
    });

    it("should catch errors in sibling components", () => {
      function Siblings() {
        return (
          <>
            <div>Safe component 1</div>
            <ThrowError />
            <div>Safe component 2</div>
          </>
        );
      }

      render(
        <ErrorBoundary>
          <Siblings />
        </ErrorBoundary>,
      );

      // Error boundary should catch the error
      expect(screen.getByRole("alert")).toBeInTheDocument();
      // Safe components should not be rendered (whole tree replaced by error UI)
      expect(screen.queryByText("Safe component 1")).not.toBeInTheDocument();
      expect(screen.queryByText("Safe component 2")).not.toBeInTheDocument();
    });
  });

  describe("Multiple ErrorBoundaries", () => {
    it("should allow nested error boundaries", () => {
      function InnerComponent() {
        return <ThrowError />;
      }

      function OuterComponent({
        shouldThrowOuter = false,
      }: {
        shouldThrowOuter?: boolean;
      }) {
        if (shouldThrowOuter) {
          throw new Error("Outer error");
        }

        return (
          <ErrorBoundary fallback={<div>Inner error caught</div>}>
            <InnerComponent />
          </ErrorBoundary>
        );
      }

      render(
        <ErrorBoundary fallback={<div>Outer error caught</div>}>
          <OuterComponent />
        </ErrorBoundary>,
      );

      // Inner boundary should catch the error
      expect(screen.getByText("Inner error caught")).toBeInTheDocument();
      expect(screen.queryByText("Outer error caught")).not.toBeInTheDocument();
    });

    it("should isolate errors to nearest boundary", () => {
      render(
        <div>
          <ErrorBoundary fallback={<div>Boundary 1 error</div>}>
            <ThrowError />
          </ErrorBoundary>
          <ErrorBoundary fallback={<div>Boundary 2 error</div>}>
            <div>Normal content in boundary 2</div>
          </ErrorBoundary>
        </div>,
      );

      // First boundary shows error
      expect(screen.getByText("Boundary 1 error")).toBeInTheDocument();
      // Second boundary renders normally
      expect(
        screen.getByText("Normal content in boundary 2"),
      ).toBeInTheDocument();
      expect(screen.queryByText("Boundary 2 error")).not.toBeInTheDocument();
    });
  });

  describe("Integration with ErrorState", () => {
    it("should render ErrorState component with correct props", () => {
      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>,
      );

      // Check ErrorState is rendered with correct structure
      const alert = screen.getByRole("alert");
      expect(alert).toBeInTheDocument();

      // Check title
      expect(screen.getByText("Something went wrong")).toBeInTheDocument();

      // Check message
      expect(screen.getByText("Test error message")).toBeInTheDocument();
    });

    it("should use ErrorState default props when error has no message", () => {
      function EmptyError() {
        const err = new Error();
        err.message = "";
        throw err;
      }

      render(
        <ErrorBoundary>
          <EmptyError />
        </ErrorBoundary>,
      );

      expect(screen.getByText("Something went wrong")).toBeInTheDocument();
      expect(
        screen.getByText(
          "An unexpected error occurred while rendering this component.",
        ),
      ).toBeInTheDocument();
    });
  });
});
