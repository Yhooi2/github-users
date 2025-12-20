import { render, screen } from "@testing-library/react";
import { AlertCircle } from "lucide-react";
import { describe, expect, it } from "vitest";
import { Alert, AlertDescription, AlertTitle } from "./alert";

describe("Alert", () => {
  describe("rendering", () => {
    it("should render alert with title and description", () => {
      render(
        <Alert>
          <AlertTitle>Test Title</AlertTitle>
          <AlertDescription>Test Description</AlertDescription>
        </Alert>,
      );

      expect(screen.getByText("Test Title")).toBeInTheDocument();
      expect(screen.getByText("Test Description")).toBeInTheDocument();
    });

    it("should render alert with icon", () => {
      const { container } = render(
        <Alert>
          <AlertCircle />
          <AlertTitle>Test</AlertTitle>
        </Alert>,
      );

      expect(container.querySelector("svg")).toBeInTheDocument();
    });

    it("should render alert without title", () => {
      render(
        <Alert>
          <AlertDescription>Description only</AlertDescription>
        </Alert>,
      );

      expect(screen.getByText("Description only")).toBeInTheDocument();
    });

    it("should render alert without description", () => {
      render(
        <Alert>
          <AlertTitle>Title only</AlertTitle>
        </Alert>,
      );

      expect(screen.getByText("Title only")).toBeInTheDocument();
    });

    it("should render minimal alert with description only", () => {
      render(
        <Alert>
          <AlertDescription>Minimal alert</AlertDescription>
        </Alert>,
      );

      expect(screen.getByText("Minimal alert")).toBeInTheDocument();
    });
  });

  describe("data attributes", () => {
    it('should have data-slot="alert" on root', () => {
      const { container } = render(
        <Alert>
          <AlertTitle>Test</AlertTitle>
        </Alert>,
      );

      expect(
        container.querySelector('[data-slot="alert"]'),
      ).toBeInTheDocument();
    });

    it('should have data-slot="alert-title" on title', () => {
      const { container } = render(
        <Alert>
          <AlertTitle>Test Title</AlertTitle>
        </Alert>,
      );

      expect(
        container.querySelector('[data-slot="alert-title"]'),
      ).toBeInTheDocument();
    });

    it('should have data-slot="alert-description" on description', () => {
      const { container } = render(
        <Alert>
          <AlertDescription>Test Description</AlertDescription>
        </Alert>,
      );

      expect(
        container.querySelector('[data-slot="alert-description"]'),
      ).toBeInTheDocument();
    });
  });

  describe("variants", () => {
    it("should render with default variant", () => {
      const { container } = render(
        <Alert>
          <AlertTitle>Default</AlertTitle>
        </Alert>,
      );

      const alert = container.querySelector('[data-slot="alert"]');
      expect(alert).toBeInTheDocument();
    });

    it("should render with destructive variant", () => {
      const { container } = render(
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
        </Alert>,
      );

      const alert = container.querySelector('[data-slot="alert"]');
      expect(alert).toBeInTheDocument();
      expect(screen.getByText("Error")).toBeInTheDocument();
    });

    it("should render different variants", () => {
      const { container } = render(
        <Alert variant="default">
          <AlertTitle>Test</AlertTitle>
        </Alert>,
      );

      const alert = container.querySelector('[data-slot="alert"]');
      expect(alert).toBeInTheDocument();
    });
  });

  describe("accessibility", () => {
    it('should have role="alert"', () => {
      render(
        <Alert>
          <AlertTitle>Accessible Alert</AlertTitle>
        </Alert>,
      );

      expect(screen.getByRole("alert")).toBeInTheDocument();
    });

    it("should render title element", () => {
      const { container } = render(
        <Alert>
          <AlertTitle>Alert Title</AlertTitle>
        </Alert>,
      );

      const title = container.querySelector('[data-slot="alert-title"]');
      expect(title).toBeInTheDocument();
      expect(screen.getByText("Alert Title")).toBeInTheDocument();
    });
  });

  describe("styling", () => {
    it("should accept custom className on alert", () => {
      const { container } = render(
        <Alert className="custom-alert">
          <AlertTitle>Test</AlertTitle>
        </Alert>,
      );

      const alert = container.querySelector('[data-slot="alert"]');
      expect(alert).toHaveClass("custom-alert");
    });

    it("should accept custom className on title", () => {
      const { container } = render(
        <Alert>
          <AlertTitle className="custom-title">Test</AlertTitle>
        </Alert>,
      );

      const title = container.querySelector('[data-slot="alert-title"]');
      expect(title).toHaveClass("custom-title");
    });

    it("should accept custom className on description", () => {
      const { container } = render(
        <Alert>
          <AlertDescription className="custom-description">
            Test
          </AlertDescription>
        </Alert>,
      );

      const description = container.querySelector(
        '[data-slot="alert-description"]',
      );
      expect(description).toHaveClass("custom-description");
    });

    it("should render alert with proper structure", () => {
      const { container } = render(
        <Alert>
          <AlertTitle>Test</AlertTitle>
        </Alert>,
      );

      const alert = container.querySelector('[data-slot="alert"]');
      expect(alert).toBeInTheDocument();
    });
  });

  describe("composition", () => {
    it("should render with icon, title, and description", () => {
      const { container } = render(
        <Alert>
          <AlertCircle />
          <AlertTitle>Complete Alert</AlertTitle>
          <AlertDescription>With all elements</AlertDescription>
        </Alert>,
      );

      expect(container.querySelector("svg")).toBeInTheDocument();
      expect(screen.getByText("Complete Alert")).toBeInTheDocument();
      expect(screen.getByText("With all elements")).toBeInTheDocument();
    });

    it("should render multiple alerts independently", () => {
      render(
        <>
          <Alert>
            <AlertTitle>First Alert</AlertTitle>
          </Alert>
          <Alert>
            <AlertTitle>Second Alert</AlertTitle>
          </Alert>
        </>,
      );

      expect(screen.getByText("First Alert")).toBeInTheDocument();
      expect(screen.getByText("Second Alert")).toBeInTheDocument();
    });

    it("should support complex content in description", () => {
      render(
        <Alert>
          <AlertDescription>
            <span data-testid="nested">Nested content</span>
            <strong data-testid="bold">Bold text</strong>
          </AlertDescription>
        </Alert>,
      );

      expect(screen.getByTestId("nested")).toBeInTheDocument();
      expect(screen.getByTestId("bold")).toBeInTheDocument();
    });
  });

  describe("edge cases", () => {
    it("should render empty alert", () => {
      const { container } = render(<Alert />);

      expect(
        container.querySelector('[data-slot="alert"]'),
      ).toBeInTheDocument();
    });

    it("should handle long content", () => {
      const longText =
        "This is a very long alert message that should wrap properly when displayed to the user. It contains multiple sentences and should maintain proper formatting throughout.";

      render(
        <Alert>
          <AlertDescription>{longText}</AlertDescription>
        </Alert>,
      );

      expect(screen.getByText(longText)).toBeInTheDocument();
    });

    it("should render with multiple icons", () => {
      const { container } = render(
        <Alert>
          <AlertCircle />
          <AlertCircle />
          <AlertTitle>Multiple Icons</AlertTitle>
        </Alert>,
      );

      const icons = container.querySelectorAll("svg");
      expect(icons.length).toBeGreaterThan(0);
    });

    it("should handle special characters in content", () => {
      render(
        <Alert>
          <AlertTitle>Special: &lt;&gt;&amp;</AlertTitle>
          <AlertDescription>Characters: @#$%^&*()</AlertDescription>
        </Alert>,
      );

      expect(screen.getByText(/Special:/)).toBeInTheDocument();
      expect(screen.getByText(/Characters:/)).toBeInTheDocument();
    });

    it("should apply both variant and custom classes", () => {
      const { container } = render(
        <Alert variant="destructive" className="custom-class">
          <AlertTitle>Test</AlertTitle>
        </Alert>,
      );

      const alert = container.querySelector('[data-slot="alert"]');
      expect(alert).toHaveClass("custom-class");
    });
  });

  describe("title styling", () => {
    it("should render title with proper structure", () => {
      const { container } = render(
        <Alert>
          <AlertTitle>Styled Title</AlertTitle>
        </Alert>,
      );

      const title = container.querySelector('[data-slot="alert-title"]');
      expect(title).toBeInTheDocument();
      expect(title).toHaveTextContent("Styled Title");
    });
  });

  describe("description styling", () => {
    it("should render description with proper structure", () => {
      const { container } = render(
        <Alert>
          <AlertDescription>Styled Description</AlertDescription>
        </Alert>,
      );

      const description = container.querySelector(
        '[data-slot="alert-description"]',
      );
      expect(description).toBeInTheDocument();
      expect(description).toHaveTextContent("Styled Description");
    });
  });
});
