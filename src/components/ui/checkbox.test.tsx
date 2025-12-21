import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Checkbox } from "./checkbox";

describe("Checkbox", () => {
  describe("rendering", () => {
    it("should render unchecked checkbox by default", () => {
      const { container } = render(<Checkbox />);

      const checkbox = container.querySelector('[data-slot="checkbox"]');
      expect(checkbox).toBeInTheDocument();
      expect(checkbox).toHaveAttribute("data-state", "unchecked");
    });

    it("should render checked checkbox when defaultChecked is true", () => {
      const { container } = render(<Checkbox defaultChecked />);

      const checkbox = container.querySelector('[data-slot="checkbox"]');
      expect(checkbox).toHaveAttribute("data-state", "checked");
    });

    it("should render with role checkbox", () => {
      render(<Checkbox />);

      expect(screen.getByRole("checkbox")).toBeInTheDocument();
    });

    it("should render checkbox indicator", () => {
      const { container } = render(<Checkbox defaultChecked />);

      expect(
        container.querySelector('[data-slot="checkbox-indicator"]'),
      ).toBeInTheDocument();
    });

    it("should render with label", () => {
      render(
        <div>
          <Checkbox id="test-checkbox" />
          <label htmlFor="test-checkbox">Test Label</label>
        </div>,
      );

      expect(screen.getByRole("checkbox")).toBeInTheDocument();
      expect(screen.getByText("Test Label")).toBeInTheDocument();
    });
  });

  describe("data attributes", () => {
    it('should have data-slot="checkbox" on root', () => {
      const { container } = render(<Checkbox />);

      expect(
        container.querySelector('[data-slot="checkbox"]'),
      ).toBeInTheDocument();
    });

    it('should have data-slot="checkbox-indicator" when checked', () => {
      const { container } = render(<Checkbox defaultChecked />);

      expect(
        container.querySelector('[data-slot="checkbox-indicator"]'),
      ).toBeInTheDocument();
    });
  });

  describe("interactions", () => {
    it("should toggle checkbox state on click", async () => {
      const user = userEvent.setup();
      const { container } = render(<Checkbox />);

      const checkbox = container.querySelector('[data-slot="checkbox"]');
      expect(checkbox).toHaveAttribute("data-state", "unchecked");

      if (checkbox) {
        await user.click(checkbox);
      }

      expect(checkbox).toHaveAttribute("data-state", "checked");
    });

    it("should toggle checkbox off when clicked again", async () => {
      const user = userEvent.setup();
      const { container } = render(<Checkbox />);

      const checkbox = container.querySelector('[data-slot="checkbox"]');

      if (checkbox) {
        await user.click(checkbox);
        expect(checkbox).toHaveAttribute("data-state", "checked");

        await user.click(checkbox);
        expect(checkbox).toHaveAttribute("data-state", "unchecked");
      }
    });

    it("should support keyboard interaction with Space key", async () => {
      const user = userEvent.setup();
      const { container } = render(<Checkbox />);

      const checkbox = screen.getByRole("checkbox");
      checkbox.focus();

      await user.keyboard(" ");

      const checkboxElement = container.querySelector('[data-slot="checkbox"]');
      expect(checkboxElement).toHaveAttribute("data-state", "checked");
    });

    it("should call onCheckedChange callback", async () => {
      const user = userEvent.setup();
      let callbackValue = false;
      const handleChange = (checked: boolean | "indeterminate") => {
        callbackValue = checked === true;
      };

      const { container } = render(<Checkbox onCheckedChange={handleChange} />);

      const checkbox = container.querySelector('[data-slot="checkbox"]');
      if (checkbox) {
        await user.click(checkbox);
      }

      expect(callbackValue).toBe(true);
    });
  });

  describe("disabled state", () => {
    it("should render disabled checkbox", () => {
      render(<Checkbox disabled />);

      expect(screen.getByRole("checkbox")).toBeDisabled();
    });

    it("should not toggle when disabled", async () => {
      const user = userEvent.setup();
      const { container } = render(<Checkbox disabled />);

      const checkbox = container.querySelector('[data-slot="checkbox"]');
      expect(checkbox).toHaveAttribute("data-state", "unchecked");

      if (checkbox) {
        await user.click(checkbox);
      }

      expect(checkbox).toHaveAttribute("data-state", "unchecked");
    });

    it("should render disabled and checked", () => {
      const { container } = render(<Checkbox disabled defaultChecked />);

      const checkbox = container.querySelector('[data-slot="checkbox"]');
      expect(checkbox).toBeDisabled();
      expect(checkbox).toHaveAttribute("data-state", "checked");
    });
  });

  describe("controlled mode", () => {
    it("should respect checked prop", () => {
      const { container } = render(<Checkbox checked={true} />);

      const checkbox = container.querySelector('[data-slot="checkbox"]');
      expect(checkbox).toHaveAttribute("data-state", "checked");
    });

    it("should update when checked prop changes", () => {
      const { container, rerender } = render(<Checkbox checked={false} />);

      let checkbox = container.querySelector('[data-slot="checkbox"]');
      expect(checkbox).toHaveAttribute("data-state", "unchecked");

      rerender(<Checkbox checked={true} />);

      checkbox = container.querySelector('[data-slot="checkbox"]');
      expect(checkbox).toHaveAttribute("data-state", "checked");
    });
  });

  describe("indeterminate state", () => {
    it("should render indeterminate state", () => {
      const { container } = render(<Checkbox checked="indeterminate" />);

      const checkbox = container.querySelector('[data-slot="checkbox"]');
      expect(checkbox).toHaveAttribute("data-state", "indeterminate");
    });
  });

  describe("styling", () => {
    it("should have data-slot attribute", () => {
      const { container } = render(<Checkbox />);

      const checkbox = container.querySelector('[data-slot="checkbox"]');
      expect(checkbox).toBeInTheDocument();
      expect(checkbox).toHaveAttribute("data-slot", "checkbox");
    });

    it("should render with proper structure", () => {
      const { container } = render(<Checkbox />);

      const checkbox = container.querySelector('[data-slot="checkbox"]');
      expect(checkbox).toBeInTheDocument();
      expect(checkbox?.tagName.toLowerCase()).toBe("button");
    });

    it("should be disabled when disabled prop is set", () => {
      const { container } = render(<Checkbox disabled />);

      const checkbox = container.querySelector('[data-slot="checkbox"]');
      expect(checkbox).toBeDisabled();
    });
  });

  describe("accessibility", () => {
    it("should be focusable", () => {
      render(<Checkbox />);

      const checkbox = screen.getByRole("checkbox");
      checkbox.focus();
      expect(checkbox).toHaveFocus();
    });

    it("should have proper aria-checked attribute when checked", () => {
      render(<Checkbox defaultChecked />);

      const checkbox = screen.getByRole("checkbox");
      expect(checkbox).toHaveAttribute("aria-checked", "true");
    });

    it("should have proper aria-checked attribute when unchecked", () => {
      render(<Checkbox />);

      const checkbox = screen.getByRole("checkbox");
      expect(checkbox).toHaveAttribute("aria-checked", "false");
    });

    it("should have proper aria-checked for indeterminate", () => {
      render(<Checkbox checked="indeterminate" />);

      const checkbox = screen.getByRole("checkbox");
      expect(checkbox).toHaveAttribute("aria-checked", "mixed");
    });

    it("should support id for label association", () => {
      render(
        <div>
          <Checkbox id="test-id" />
          <label htmlFor="test-id">Test</label>
        </div>,
      );

      const checkbox = screen.getByRole("checkbox");
      expect(checkbox).toHaveAttribute("id", "test-id");
    });
  });

  describe("edge cases", () => {
    it("should handle multiple checkboxes independently", () => {
      const { container } = render(
        <>
          <Checkbox data-testid="first" />
          <Checkbox data-testid="second" defaultChecked />
        </>,
      );

      const checkboxes = container.querySelectorAll('[data-slot="checkbox"]');
      expect(checkboxes[0]).toHaveAttribute("data-state", "unchecked");
      expect(checkboxes[1]).toHaveAttribute("data-state", "checked");
    });

    it("should render without crashing when no props provided", () => {
      const { container } = render(<Checkbox />);

      expect(
        container.querySelector('[data-slot="checkbox"]'),
      ).toBeInTheDocument();
    });

    it("should work with form", () => {
      const { container } = render(
        <form>
          <Checkbox name="test-checkbox" />
        </form>,
      );

      const checkbox = container.querySelector('[data-slot="checkbox"]');
      expect(checkbox).toBeInTheDocument();
    });

    it("should support value prop", () => {
      render(<Checkbox value="test-value" />);

      const checkbox = screen.getByRole("checkbox");
      expect(checkbox).toHaveAttribute("value", "test-value");
    });
  });

  describe("icon rendering", () => {
    it("should render check icon when checked", () => {
      const { container } = render(<Checkbox defaultChecked />);

      const icon = container.querySelector("svg");
      expect(icon).toBeInTheDocument();
    });

    it("should have indicator with data-slot when checked", () => {
      const { container } = render(<Checkbox defaultChecked />);

      const indicator = container.querySelector(
        '[data-slot="checkbox-indicator"]',
      );
      expect(indicator).toBeInTheDocument();
      expect(indicator).toHaveAttribute("data-slot", "checkbox-indicator");
    });
  });
});
