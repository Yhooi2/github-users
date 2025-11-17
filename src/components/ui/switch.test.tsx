import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Switch } from './switch';

describe('Switch', () => {
  describe('rendering', () => {
    it('should render unchecked switch by default', () => {
      const { container } = render(<Switch />);
      const switchElement = container.querySelector('[data-slot="switch"]');
      expect(switchElement).toBeInTheDocument();
      expect(switchElement).toHaveAttribute('data-state', 'unchecked');
    });

    it('should render checked switch when defaultChecked is true', () => {
      const { container } = render(<Switch defaultChecked />);
      const switchElement = container.querySelector('[data-slot="switch"]');
      expect(switchElement).toHaveAttribute('data-state', 'checked');
    });

    it('should render with role switch', () => {
      render(<Switch />);
      expect(screen.getByRole('switch')).toBeInTheDocument();
    });

    it('should render switch thumb', () => {
      const { container } = render(<Switch />);
      expect(container.querySelector('[data-slot="switch-thumb"]')).toBeInTheDocument();
    });
  });

  describe('data attributes', () => {
    it('should have data-slot="switch" on root', () => {
      const { container } = render(<Switch />);
      expect(container.querySelector('[data-slot="switch"]')).toBeInTheDocument();
    });

    it('should have data-slot="switch-thumb" on thumb', () => {
      const { container } = render(<Switch />);
      expect(container.querySelector('[data-slot="switch-thumb"]')).toBeInTheDocument();
    });
  });

  describe('interactions', () => {
    it('should toggle switch state on click', async () => {
      const user = userEvent.setup();
      const { container } = render(<Switch />);

      const switchElement = container.querySelector('[data-slot="switch"]');
      expect(switchElement).toHaveAttribute('data-state', 'unchecked');

      if (switchElement) {
        await user.click(switchElement);
      }

      expect(switchElement).toHaveAttribute('data-state', 'checked');
    });

    it('should toggle switch off when clicked again', async () => {
      const user = userEvent.setup();
      const { container } = render(<Switch />);

      const switchElement = container.querySelector('[data-slot="switch"]');

      if (switchElement) {
        await user.click(switchElement);
        expect(switchElement).toHaveAttribute('data-state', 'checked');

        await user.click(switchElement);
        expect(switchElement).toHaveAttribute('data-state', 'unchecked');
      }
    });

    it('should call onCheckedChange callback', async () => {
      const user = userEvent.setup();
      let callbackValue = false;
      const handleChange = (checked: boolean) => {
        callbackValue = checked;
      };

      const { container } = render(<Switch onCheckedChange={handleChange} />);

      const switchElement = container.querySelector('[data-slot="switch"]');
      if (switchElement) {
        await user.click(switchElement);
      }

      expect(callbackValue).toBe(true);
    });
  });

  describe('disabled state', () => {
    it('should render disabled switch', () => {
      render(<Switch disabled />);
      expect(screen.getByRole('switch')).toBeDisabled();
    });

    it('should not toggle when disabled', async () => {
      const user = userEvent.setup();
      const { container } = render(<Switch disabled />);

      const switchElement = container.querySelector('[data-slot="switch"]');
      expect(switchElement).toHaveAttribute('data-state', 'unchecked');

      if (switchElement) {
        await user.click(switchElement);
      }

      expect(switchElement).toHaveAttribute('data-state', 'unchecked');
    });

    it('should render disabled and checked', () => {
      const { container } = render(<Switch disabled defaultChecked />);
      const switchElement = container.querySelector('[data-slot="switch"]');
      expect(switchElement).toBeDisabled();
      expect(switchElement).toHaveAttribute('data-state', 'checked');
    });
  });

  describe('controlled mode', () => {
    it('should respect checked prop', () => {
      const { container } = render(<Switch checked={true} />);
      const switchElement = container.querySelector('[data-slot="switch"]');
      expect(switchElement).toHaveAttribute('data-state', 'checked');
    });

    it('should update when checked prop changes', () => {
      const { container, rerender } = render(<Switch checked={false} />);

      let switchElement = container.querySelector('[data-slot="switch"]');
      expect(switchElement).toHaveAttribute('data-state', 'unchecked');

      rerender(<Switch checked={true} />);

      switchElement = container.querySelector('[data-slot="switch"]');
      expect(switchElement).toHaveAttribute('data-state', 'checked');
    });
  });

  describe('accessibility', () => {
    it('should be focusable', () => {
      render(<Switch />);
      const switchElement = screen.getByRole('switch');
      switchElement.focus();
      expect(switchElement).toHaveFocus();
    });

    it('should have proper aria-checked attribute when checked', () => {
      render(<Switch defaultChecked />);
      const switchElement = screen.getByRole('switch');
      expect(switchElement).toHaveAttribute('aria-checked', 'true');
    });

    it('should have proper aria-checked attribute when unchecked', () => {
      render(<Switch />);
      const switchElement = screen.getByRole('switch');
      expect(switchElement).toHaveAttribute('aria-checked', 'false');
    });

    it('should support id for label association', () => {
      render(
        <div>
          <Switch id="test-id" />
          <label htmlFor="test-id">Test</label>
        </div>
      );

      const switchElement = screen.getByRole('switch');
      expect(switchElement).toHaveAttribute('id', 'test-id');
    });
  });

  describe('styling', () => {
    it('should accept custom className', () => {
      const { container } = render(<Switch className="custom-switch" />);
      const switchElement = container.querySelector('[data-slot="switch"]');
      expect(switchElement).toHaveClass('custom-switch');
    });

    it('should have default styling classes', () => {
      const { container } = render(<Switch />);
      const switchElement = container.querySelector('[data-slot="switch"]');
      expect(switchElement).toHaveClass('inline-flex');
      expect(switchElement).toHaveClass('rounded-full');
    });

    it('should have disabled styling when disabled', () => {
      const { container } = render(<Switch disabled />);
      const switchElement = container.querySelector('[data-slot="switch"]');
      expect(switchElement).toHaveClass('disabled:cursor-not-allowed');
      expect(switchElement).toHaveClass('disabled:opacity-50');
    });

    it('should have thumb with proper classes', () => {
      const { container } = render(<Switch />);
      const thumb = container.querySelector('[data-slot="switch-thumb"]');
      expect(thumb).toHaveClass('rounded-full');
      expect(thumb).toHaveClass('transition-transform');
    });
  });

  describe('edge cases', () => {
    it('should handle multiple switches independently', () => {
      const { container } = render(
        <>
          <Switch data-testid="first" />
          <Switch data-testid="second" defaultChecked />
        </>
      );

      const switches = container.querySelectorAll('[data-slot="switch"]');
      expect(switches[0]).toHaveAttribute('data-state', 'unchecked');
      expect(switches[1]).toHaveAttribute('data-state', 'checked');
    });

    it('should render without crashing when no props provided', () => {
      const { container } = render(<Switch />);
      expect(container.querySelector('[data-slot="switch"]')).toBeInTheDocument();
    });
  });
});
