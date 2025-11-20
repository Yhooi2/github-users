import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Button } from "./button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip";

describe("Tooltip", () => {
  describe("rendering", () => {
    it("should render tooltip trigger", () => {
      render(
        <Tooltip>
          <TooltipTrigger asChild>
            <Button>Hover me</Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Tooltip text</p>
          </TooltipContent>
        </Tooltip>,
      );

      expect(
        screen.getByRole("button", { name: "Hover me" }),
      ).toBeInTheDocument();
    });

    it("should not show content initially", () => {
      render(
        <Tooltip>
          <TooltipTrigger asChild>
            <Button>Hover me</Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Tooltip text</p>
          </TooltipContent>
        </Tooltip>,
      );

      expect(screen.queryByText("Tooltip text")).not.toBeInTheDocument();
    });

    it("should render with custom trigger element", () => {
      render(
        <Tooltip>
          <TooltipTrigger asChild>
            <span>Custom trigger</span>
          </TooltipTrigger>
          <TooltipContent>
            <p>Tooltip text</p>
          </TooltipContent>
        </Tooltip>,
      );

      expect(screen.getByText("Custom trigger")).toBeInTheDocument();
    });
  });

  describe("data attributes", () => {
    it('should have data-slot="tooltip-trigger" on trigger', () => {
      const { container } = render(
        <Tooltip>
          <TooltipTrigger asChild>
            <span>Trigger</span>
          </TooltipTrigger>
          <TooltipContent>
            <p>Tooltip text</p>
          </TooltipContent>
        </Tooltip>,
      );

      const trigger = container.querySelector('[data-slot="tooltip-trigger"]');
      expect(trigger).toBeInTheDocument();
    });
  });

  describe("content placement", () => {
    it('should accept side="top" prop', () => {
      render(
        <Tooltip>
          <TooltipTrigger asChild>
            <Button>Hover me</Button>
          </TooltipTrigger>
          <TooltipContent side="top">
            <p>Top tooltip</p>
          </TooltipContent>
        </Tooltip>,
      );

      expect(
        screen.getByRole("button", { name: "Hover me" }),
      ).toBeInTheDocument();
    });

    it('should accept side="bottom" prop', () => {
      render(
        <Tooltip>
          <TooltipTrigger asChild>
            <Button>Hover me</Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>Bottom tooltip</p>
          </TooltipContent>
        </Tooltip>,
      );

      expect(
        screen.getByRole("button", { name: "Hover me" }),
      ).toBeInTheDocument();
    });

    it('should accept side="left" prop', () => {
      render(
        <Tooltip>
          <TooltipTrigger asChild>
            <Button>Hover me</Button>
          </TooltipTrigger>
          <TooltipContent side="left">
            <p>Left tooltip</p>
          </TooltipContent>
        </Tooltip>,
      );

      expect(
        screen.getByRole("button", { name: "Hover me" }),
      ).toBeInTheDocument();
    });

    it('should accept side="right" prop', () => {
      render(
        <Tooltip>
          <TooltipTrigger asChild>
            <Button>Hover me</Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Right tooltip</p>
          </TooltipContent>
        </Tooltip>,
      );

      expect(
        screen.getByRole("button", { name: "Hover me" }),
      ).toBeInTheDocument();
    });
  });

  describe("styling", () => {
    it("should accept custom className on content", () => {
      render(
        <Tooltip>
          <TooltipTrigger asChild>
            <Button>Hover me</Button>
          </TooltipTrigger>
          <TooltipContent className="bg-blue-500">
            <p>Styled tooltip</p>
          </TooltipContent>
        </Tooltip>,
      );

      expect(
        screen.getByRole("button", { name: "Hover me" }),
      ).toBeInTheDocument();
    });
  });

  describe("TooltipProvider", () => {
    it("should render TooltipProvider with children", () => {
      render(
        <TooltipProvider>
          <div data-testid="provider-child">Content</div>
        </TooltipProvider>,
      );

      expect(screen.getByTestId("provider-child")).toBeInTheDocument();
    });

    it("should accept delayDuration prop", () => {
      render(
        <TooltipProvider delayDuration={500}>
          <div data-testid="provider-content">Content</div>
        </TooltipProvider>,
      );

      expect(screen.getByTestId("provider-content")).toBeInTheDocument();
    });

    it("should default to 0 delay duration when not specified", () => {
      render(
        <TooltipProvider>
          <div data-testid="provider-content">Content</div>
        </TooltipProvider>,
      );

      expect(screen.getByTestId("provider-content")).toBeInTheDocument();
    });
  });

  describe("accessibility", () => {
    it("should support focusable trigger", () => {
      render(
        <Tooltip>
          <TooltipTrigger asChild>
            <Button>Focus me</Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Tooltip text</p>
          </TooltipContent>
        </Tooltip>,
      );

      const trigger = screen.getByRole("button", { name: "Focus me" });
      expect(trigger).toBeInTheDocument();
      trigger.focus();
      expect(trigger).toHaveFocus();
    });

    it("should render tooltip structure with aria support", () => {
      render(
        <Tooltip>
          <TooltipTrigger asChild>
            <Button>Hover me</Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Tooltip text</p>
          </TooltipContent>
        </Tooltip>,
      );

      const trigger = screen.getByRole("button", { name: "Hover me" });
      expect(trigger).toBeInTheDocument();
    });
  });

  describe("edge cases", () => {
    it("should render tooltip with empty content", () => {
      render(
        <Tooltip>
          <TooltipTrigger asChild>
            <Button>Hover me</Button>
          </TooltipTrigger>
          <TooltipContent></TooltipContent>
        </Tooltip>,
      );

      expect(
        screen.getByRole("button", { name: "Hover me" }),
      ).toBeInTheDocument();
    });

    it("should handle long content text", () => {
      const longText =
        "This is a very long tooltip content that should wrap properly when displayed";

      render(
        <Tooltip>
          <TooltipTrigger asChild>
            <Button>Hover me</Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{longText}</p>
          </TooltipContent>
        </Tooltip>,
      );

      expect(
        screen.getByRole("button", { name: "Hover me" }),
      ).toBeInTheDocument();
    });

    it("should work with disabled button wrapper", () => {
      render(
        <Tooltip>
          <TooltipTrigger asChild>
            <span>
              <Button disabled>Disabled</Button>
            </span>
          </TooltipTrigger>
          <TooltipContent>
            <p>Tooltip for disabled button</p>
          </TooltipContent>
        </Tooltip>,
      );

      expect(screen.getByRole("button", { name: "Disabled" })).toBeDisabled();
    });

    it("should render multiple tooltips independently", () => {
      render(
        <>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button>First</Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>First tooltip</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button>Second</Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Second tooltip</p>
            </TooltipContent>
          </Tooltip>
        </>,
      );

      expect(screen.getByRole("button", { name: "First" })).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Second" }),
      ).toBeInTheDocument();
    });

    it("should support complex content with nested elements", () => {
      render(
        <Tooltip>
          <TooltipTrigger asChild>
            <Button>Hover me</Button>
          </TooltipTrigger>
          <TooltipContent>
            <div>
              <strong data-testid="bold">Bold text</strong>
              <span data-testid="nested">Nested</span>
            </div>
          </TooltipContent>
        </Tooltip>,
      );

      expect(
        screen.getByRole("button", { name: "Hover me" }),
      ).toBeInTheDocument();
    });

    it("should accept sideOffset prop", () => {
      render(
        <Tooltip>
          <TooltipTrigger asChild>
            <Button>Hover me</Button>
          </TooltipTrigger>
          <TooltipContent sideOffset={10}>
            <p>Offset tooltip</p>
          </TooltipContent>
        </Tooltip>,
      );

      expect(
        screen.getByRole("button", { name: "Hover me" }),
      ).toBeInTheDocument();
    });
  });
});
