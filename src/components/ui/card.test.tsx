import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./card";

describe("Card", () => {
  describe("rendering", () => {
    it("should render card with all sections", () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>Test Title</CardTitle>
            <CardDescription>Test Description</CardDescription>
          </CardHeader>
          <CardContent>Test Content</CardContent>
          <CardFooter>Test Footer</CardFooter>
        </Card>,
      );

      expect(screen.getByText("Test Title")).toBeInTheDocument();
      expect(screen.getByText("Test Description")).toBeInTheDocument();
      expect(screen.getByText("Test Content")).toBeInTheDocument();
      expect(screen.getByText("Test Footer")).toBeInTheDocument();
    });

    it("should render card without optional sections", () => {
      render(
        <Card>
          <CardContent>Only Content</CardContent>
        </Card>,
      );

      expect(screen.getByText("Only Content")).toBeInTheDocument();
    });

    it("should render CardAction in header", () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>Title</CardTitle>
            <CardAction>
              <button>Action</button>
            </CardAction>
          </CardHeader>
        </Card>,
      );

      expect(screen.getByText("Title")).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Action" }),
      ).toBeInTheDocument();
    });
  });

  describe("data attributes", () => {
    it("should have correct data-slot attributes", () => {
      const { container } = render(
        <Card>
          <CardHeader>
            <CardTitle>Title</CardTitle>
            <CardDescription>Description</CardDescription>
            <CardAction>Action</CardAction>
          </CardHeader>
          <CardContent>Content</CardContent>
          <CardFooter>Footer</CardFooter>
        </Card>,
      );

      expect(container.querySelector('[data-slot="card"]')).toBeInTheDocument();
      expect(
        container.querySelector('[data-slot="card-header"]'),
      ).toBeInTheDocument();
      expect(
        container.querySelector('[data-slot="card-title"]'),
      ).toBeInTheDocument();
      expect(
        container.querySelector('[data-slot="card-description"]'),
      ).toBeInTheDocument();
      expect(
        container.querySelector('[data-slot="card-action"]'),
      ).toBeInTheDocument();
      expect(
        container.querySelector('[data-slot="card-content"]'),
      ).toBeInTheDocument();
      expect(
        container.querySelector('[data-slot="card-footer"]'),
      ).toBeInTheDocument();
    });
  });

  describe("styling", () => {
    it("should apply custom className to Card", () => {
      const { container } = render(
        <Card className="custom-class">
          <CardContent>Content</CardContent>
        </Card>,
      );

      const card = container.querySelector('[data-slot="card"]');
      expect(card).toHaveClass("custom-class");
    });

    it("should apply custom className to CardHeader", () => {
      const { container } = render(
        <Card>
          <CardHeader className="custom-header">
            <CardTitle>Title</CardTitle>
          </CardHeader>
        </Card>,
      );

      const header = container.querySelector('[data-slot="card-header"]');
      expect(header).toHaveClass("custom-header");
    });

    it("should apply custom className to CardTitle", () => {
      const { container } = render(
        <Card>
          <CardHeader>
            <CardTitle className="custom-title">Title</CardTitle>
          </CardHeader>
        </Card>,
      );

      const title = container.querySelector('[data-slot="card-title"]');
      expect(title).toHaveClass("custom-title");
    });

    it("should apply custom className to CardDescription", () => {
      const { container } = render(
        <Card>
          <CardHeader>
            <CardDescription className="custom-description">
              Description
            </CardDescription>
          </CardHeader>
        </Card>,
      );

      const description = container.querySelector(
        '[data-slot="card-description"]',
      );
      expect(description).toHaveClass("custom-description");
    });

    it("should apply custom className to CardAction", () => {
      const { container } = render(
        <Card>
          <CardHeader>
            <CardAction className="custom-action">Action</CardAction>
          </CardHeader>
        </Card>,
      );

      const action = container.querySelector('[data-slot="card-action"]');
      expect(action).toHaveClass("custom-action");
    });

    it("should apply custom className to CardContent", () => {
      const { container } = render(
        <Card>
          <CardContent className="custom-content">Content</CardContent>
        </Card>,
      );

      const content = container.querySelector('[data-slot="card-content"]');
      expect(content).toHaveClass("custom-content");
    });

    it("should apply custom className to CardFooter", () => {
      const { container } = render(
        <Card>
          <CardFooter className="custom-footer">Footer</CardFooter>
        </Card>,
      );

      const footer = container.querySelector('[data-slot="card-footer"]');
      expect(footer).toHaveClass("custom-footer");
    });
  });

  describe("composition", () => {
    it("should render nested elements", () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>
              <span data-testid="nested-title">Nested Title</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div data-testid="nested-content">
              <p>Paragraph 1</p>
              <p>Paragraph 2</p>
            </div>
          </CardContent>
        </Card>,
      );

      expect(screen.getByTestId("nested-title")).toBeInTheDocument();
      expect(screen.getByTestId("nested-content")).toBeInTheDocument();
      expect(screen.getByText("Paragraph 1")).toBeInTheDocument();
      expect(screen.getByText("Paragraph 2")).toBeInTheDocument();
    });

    it("should render multiple CardHeader children", () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>Title</CardTitle>
            <CardDescription>Description</CardDescription>
            <CardAction>
              <button>Edit</button>
            </CardAction>
          </CardHeader>
        </Card>,
      );

      expect(screen.getByText("Title")).toBeInTheDocument();
      expect(screen.getByText("Description")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Edit" })).toBeInTheDocument();
    });
  });

  describe("accessibility", () => {
    it("should be accessible as a generic container", () => {
      const { container } = render(
        <Card>
          <CardHeader>
            <CardTitle>Accessible Card</CardTitle>
          </CardHeader>
          <CardContent>Content here</CardContent>
        </Card>,
      );

      const card = container.querySelector('[data-slot="card"]');
      expect(card).toBeInTheDocument();
      expect(card?.tagName.toLowerCase()).toBe("div");
    });

    it("should support aria attributes via props spread", () => {
      render(
        <Card aria-label="User profile card">
          <CardContent>Profile content</CardContent>
        </Card>,
      );

      expect(screen.getByLabelText("User profile card")).toBeInTheDocument();
    });

    it("should support data attributes via props spread", () => {
      const { container } = render(
        <Card data-testid="custom-card">
          <CardContent>Content</CardContent>
        </Card>,
      );

      expect(
        container.querySelector('[data-testid="custom-card"]'),
      ).toBeInTheDocument();
    });
  });

  describe("edge cases", () => {
    it("should render empty Card", () => {
      const { container } = render(<Card />);

      const card = container.querySelector('[data-slot="card"]');
      expect(card).toBeInTheDocument();
      expect(card?.textContent).toBe("");
    });

    it("should render Card with only header", () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>Only Header</CardTitle>
          </CardHeader>
        </Card>,
      );

      expect(screen.getByText("Only Header")).toBeInTheDocument();
    });

    it("should render Card with only content", () => {
      render(
        <Card>
          <CardContent>Only Content</CardContent>
        </Card>,
      );

      expect(screen.getByText("Only Content")).toBeInTheDocument();
    });

    it("should render Card with only footer", () => {
      render(
        <Card>
          <CardFooter>Only Footer</CardFooter>
        </Card>,
      );

      expect(screen.getByText("Only Footer")).toBeInTheDocument();
    });
  });
});
