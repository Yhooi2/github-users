import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "./select";

describe("Select", () => {
  describe("rendering", () => {
    it("should render select with trigger and content", () => {
      const { container } = render(
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">Option 1</SelectItem>
          </SelectContent>
        </Select>,
      );

      expect(
        container.querySelector('[data-slot="select-trigger"]'),
      ).toBeInTheDocument();
      expect(screen.getByText("Select")).toBeInTheDocument();
    });

    it("should render with placeholder", () => {
      render(
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Choose option" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">Option 1</SelectItem>
          </SelectContent>
        </Select>,
      );

      expect(screen.getByText("Choose option")).toBeInTheDocument();
    });

    it("should render with default value", () => {
      const { container } = render(
        <Select defaultValue="option1">
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="option1">Option 1</SelectItem>
          </SelectContent>
        </Select>,
      );

      expect(
        container.querySelector('[data-slot="select-trigger"]'),
      ).toHaveAttribute("data-state", "closed");
    });
  });

  describe("data attributes", () => {
    it("should render trigger with data-slot", () => {
      const { container } = render(
        <Select>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
        </Select>,
      );

      expect(
        container.querySelector('[data-slot="select-trigger"]'),
      ).toBeInTheDocument();
    });

    it('should have data-slot="select-trigger" on trigger', () => {
      const { container } = render(
        <Select>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
        </Select>,
      );

      expect(
        container.querySelector('[data-slot="select-trigger"]'),
      ).toBeInTheDocument();
    });

    it('should have data-slot="select-value" on value', () => {
      const { container } = render(
        <Select>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
        </Select>,
      );

      expect(
        container.querySelector('[data-slot="select-value"]'),
      ).toBeInTheDocument();
    });
  });

  describe("interactions", () => {
    it("should render with defaultOpen", () => {
      const { container } = render(
        <Select defaultOpen>
          <SelectTrigger>
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">Option 1</SelectItem>
          </SelectContent>
        </Select>,
      );

      const trigger = container.querySelector('[data-slot="select-trigger"]');
      expect(trigger).toHaveAttribute("data-state", "open");
    });

    it("should render items when open", () => {
      render(
        <Select defaultOpen>
          <SelectTrigger>
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="option1">Option 1</SelectItem>
            <SelectItem value="option2">Option 2</SelectItem>
          </SelectContent>
        </Select>,
      );

      expect(screen.getByText("Option 1")).toBeInTheDocument();
      expect(screen.getByText("Option 2")).toBeInTheDocument();
    });
  });

  describe("disabled state", () => {
    it("should render disabled select", () => {
      const { container } = render(
        <Select disabled>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
        </Select>,
      );

      const trigger = container.querySelector('[data-slot="select-trigger"]');
      expect(trigger).toBeDisabled();
    });

    it("should render disabled select item", () => {
      const { getByText } = render(
        <Select defaultOpen>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1" disabled>
              Disabled Option
            </SelectItem>
          </SelectContent>
        </Select>,
      );

      const item = getByText("Disabled Option");
      expect(item.closest("[data-disabled]")).toBeInTheDocument();
    });
  });

  describe("groups and labels", () => {
    it("should render select with groups", () => {
      render(
        <Select defaultOpen>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Group Label</SelectLabel>
              <SelectItem value="1">Option 1</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>,
      );

      expect(screen.getByText("Group Label")).toBeInTheDocument();
    });

    it("should render select label text", () => {
      render(
        <Select defaultOpen>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Test Label</SelectLabel>
              <SelectItem value="1">Item 1</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>,
      );

      expect(screen.getByText("Test Label")).toBeInTheDocument();
    });

    it("should render with separator", () => {
      render(
        <Select defaultOpen>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">Option 1</SelectItem>
            <SelectSeparator />
            <SelectItem value="2">Option 2</SelectItem>
          </SelectContent>
        </Select>,
      );

      expect(screen.getByText("Option 1")).toBeInTheDocument();
      expect(screen.getByText("Option 2")).toBeInTheDocument();
    });
  });

  describe("styling", () => {
    it("should accept custom className on trigger", () => {
      const { container } = render(
        <Select>
          <SelectTrigger className="custom-trigger">
            <SelectValue />
          </SelectTrigger>
        </Select>,
      );

      const trigger = container.querySelector('[data-slot="select-trigger"]');
      expect(trigger).toHaveClass("custom-trigger");
    });

    it("should support size variants", () => {
      const { container } = render(
        <Select>
          <SelectTrigger size="sm">
            <SelectValue />
          </SelectTrigger>
        </Select>,
      );

      const trigger = container.querySelector('[data-slot="select-trigger"]');
      expect(trigger).toHaveAttribute("data-size", "sm");
    });

    it("should have default size", () => {
      const { container } = render(
        <Select>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
        </Select>,
      );

      const trigger = container.querySelector('[data-slot="select-trigger"]');
      expect(trigger).toHaveAttribute("data-size", "default");
    });
  });

  describe("accessibility", () => {
    it("should have proper role", () => {
      render(
        <Select>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
        </Select>,
      );

      expect(screen.getByRole("combobox")).toBeInTheDocument();
    });

    it("should be focusable", () => {
      render(
        <Select>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
        </Select>,
      );

      const trigger = screen.getByRole("combobox");
      trigger.focus();
      expect(trigger).toHaveFocus();
    });
  });

  describe("controlled mode", () => {
    it("should respect value prop", () => {
      render(
        <Select value="option1">
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="option1">Option 1</SelectItem>
            <SelectItem value="option2">Option 2</SelectItem>
          </SelectContent>
        </Select>,
      );

      expect(screen.getByText("Option 1")).toBeInTheDocument();
    });
  });

  describe("edge cases", () => {
    it("should render with many items", () => {
      const { getByText } = render(
        <Select defaultOpen>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Array.from({ length: 20 }).map((_, i) => (
              <SelectItem key={i} value={`option${i}`}>
                Option {i}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>,
      );

      expect(getByText("Option 0")).toBeInTheDocument();
    });

    it("should render with trigger only", () => {
      const { container } = render(
        <Select>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">Item 1</SelectItem>
          </SelectContent>
        </Select>,
      );

      expect(
        container.querySelector('[data-slot="select-trigger"]'),
      ).toBeInTheDocument();
    });
  });
});
