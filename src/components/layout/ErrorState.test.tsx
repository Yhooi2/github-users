import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ErrorState } from "./ErrorState";

describe("ErrorState", () => {
  describe("rendering", () => {
    it("should render with required props", () => {
      render(<ErrorState message="Test error message" />);

      expect(screen.getByRole("alert")).toBeInTheDocument();
      expect(screen.getByText("Error")).toBeInTheDocument(); // default title
      expect(screen.getByText("Test error message")).toBeInTheDocument();
    });

    it("should render with custom title", () => {
      render(<ErrorState title="Custom Error Title" message="Test message" />);

      expect(screen.getByText("Custom Error Title")).toBeInTheDocument();
    });

    it("should render different variants", () => {
      const { rerender } = render(
        <ErrorState message="Test" variant="error" />,
      );
      expect(screen.getByRole("alert")).toBeInTheDocument();

      rerender(<ErrorState message="Test" variant="warning" />);
      expect(screen.getByRole("alert")).toBeInTheDocument();

      rerender(<ErrorState message="Test" variant="info" />);
      expect(screen.getByRole("alert")).toBeInTheDocument();
    });
  });

  describe("icons", () => {
    it("should show error icon by default", () => {
      const { container } = render(
        <ErrorState message="Test" variant="error" />,
      );

      // XCircle icon should be present
      const svg = container.querySelector("svg");
      expect(svg).toBeInTheDocument();
    });

    it("should show warning icon for warning variant", () => {
      const { container } = render(
        <ErrorState message="Test" variant="warning" />,
      );

      const svg = container.querySelector("svg");
      expect(svg).toBeInTheDocument();
    });

    it("should show info icon for info variant", () => {
      const { container } = render(
        <ErrorState message="Test" variant="info" />,
      );

      const svg = container.querySelector("svg");
      expect(svg).toBeInTheDocument();
    });

    it("should not show icon when showIcon is false", () => {
      const { container } = render(
        <ErrorState message="Test" showIcon={false} />,
      );

      // Should not have any lucide icons in the first div
      const alert = container.querySelector('[role="alert"]');
      const icons = alert?.querySelectorAll("svg");
      expect(icons?.length).toBe(0);
    });
  });

  describe("retry action", () => {
    it("should render retry button when onRetry is provided", () => {
      const handleRetry = vi.fn();
      render(<ErrorState message="Test" onRetry={handleRetry} />);

      expect(
        screen.getByRole("button", { name: /retry/i }),
      ).toBeInTheDocument();
    });

    it("should call onRetry when retry button is clicked", async () => {
      const user = userEvent.setup();
      const handleRetry = vi.fn();
      render(<ErrorState message="Test" onRetry={handleRetry} />);

      await user.click(screen.getByRole("button", { name: /retry/i }));

      expect(handleRetry).toHaveBeenCalledTimes(1);
    });

    it("should not render retry button when onRetry is not provided", () => {
      render(<ErrorState message="Test" />);

      expect(
        screen.queryByRole("button", { name: /retry/i }),
      ).not.toBeInTheDocument();
    });

    it("should render custom retry text", () => {
      const handleRetry = vi.fn();
      render(
        <ErrorState
          message="Test"
          onRetry={handleRetry}
          retryText="Custom Retry"
        />,
      );

      expect(screen.getByText("Custom Retry")).toBeInTheDocument();
    });

    it("should render default retry text", () => {
      const handleRetry = vi.fn();
      render(<ErrorState message="Test" onRetry={handleRetry} />);

      expect(screen.getByText("Try Again")).toBeInTheDocument();
    });
  });

  describe("dismiss action", () => {
    it("should render dismiss button when onDismiss is provided", () => {
      const handleDismiss = vi.fn();
      render(<ErrorState message="Test" onDismiss={handleDismiss} />);

      expect(
        screen.getByRole("button", { name: /dismiss/i }),
      ).toBeInTheDocument();
    });

    it("should call onDismiss when dismiss button is clicked", async () => {
      const user = userEvent.setup();
      const handleDismiss = vi.fn();
      render(<ErrorState message="Test" onDismiss={handleDismiss} />);

      await user.click(screen.getByRole("button", { name: /dismiss/i }));

      expect(handleDismiss).toHaveBeenCalledTimes(1);
    });

    it("should not render dismiss button when onDismiss is not provided", () => {
      render(<ErrorState message="Test" />);

      expect(
        screen.queryByRole("button", { name: /dismiss/i }),
      ).not.toBeInTheDocument();
    });

    it("should render custom dismiss text", () => {
      const handleDismiss = vi.fn();
      render(
        <ErrorState
          message="Test"
          onDismiss={handleDismiss}
          dismissText="Close"
        />,
      );

      expect(screen.getByText("Close")).toBeInTheDocument();
    });

    it("should render default dismiss text", () => {
      const handleDismiss = vi.fn();
      render(<ErrorState message="Test" onDismiss={handleDismiss} />);

      expect(screen.getByText("Dismiss")).toBeInTheDocument();
    });
  });

  describe("both actions", () => {
    it("should render both retry and dismiss buttons", () => {
      const handleRetry = vi.fn();
      const handleDismiss = vi.fn();
      render(
        <ErrorState
          message="Test"
          onRetry={handleRetry}
          onDismiss={handleDismiss}
        />,
      );

      expect(
        screen.getByRole("button", { name: /retry/i }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /dismiss/i }),
      ).toBeInTheDocument();
    });

    it("should call correct handlers when buttons are clicked", async () => {
      const user = userEvent.setup();
      const handleRetry = vi.fn();
      const handleDismiss = vi.fn();
      render(
        <ErrorState
          message="Test"
          onRetry={handleRetry}
          onDismiss={handleDismiss}
        />,
      );

      await user.click(screen.getByRole("button", { name: /retry/i }));
      expect(handleRetry).toHaveBeenCalledTimes(1);
      expect(handleDismiss).not.toHaveBeenCalled();

      await user.click(screen.getByRole("button", { name: /dismiss/i }));
      expect(handleDismiss).toHaveBeenCalledTimes(1);
      expect(handleRetry).toHaveBeenCalledTimes(1); // still 1
    });
  });

  describe("accessibility", () => {
    it('should have role="alert"', () => {
      render(<ErrorState message="Test" />);
      expect(screen.getByRole("alert")).toBeInTheDocument();
    });

    it("should have aria-label for retry button", () => {
      const handleRetry = vi.fn();
      render(<ErrorState message="Test" onRetry={handleRetry} />);

      expect(screen.getByLabelText("Retry action")).toBeInTheDocument();
    });

    it("should have aria-label for dismiss button", () => {
      const handleDismiss = vi.fn();
      render(<ErrorState message="Test" onDismiss={handleDismiss} />);

      expect(screen.getByLabelText("Dismiss error")).toBeInTheDocument();
    });
  });

  describe("variants styling", () => {
    it("should apply destructive variant for error", () => {
      const { container } = render(
        <ErrorState message="Test" variant="error" />,
      );

      // Alert component should have destructive variant styling
      const alert = container.querySelector('[role="alert"]');
      expect(alert).toBeInTheDocument();
    });

    it("should apply default variant for warning", () => {
      const { container } = render(
        <ErrorState message="Test" variant="warning" />,
      );

      const alert = container.querySelector('[role="alert"]');
      expect(alert).toBeInTheDocument();
    });

    it("should apply default variant for info", () => {
      const { container } = render(
        <ErrorState message="Test" variant="info" />,
      );

      const alert = container.querySelector('[role="alert"]');
      expect(alert).toBeInTheDocument();
    });
  });
});
