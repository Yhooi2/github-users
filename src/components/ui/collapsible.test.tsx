import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from './collapsible';
import { Button } from './button';

describe('Collapsible', () => {
  describe('rendering', () => {
    it('should render collapsible with trigger and content', () => {
      const { container } = render(
        <Collapsible>
          <CollapsibleTrigger>Toggle</CollapsibleTrigger>
          <CollapsibleContent>Content</CollapsibleContent>
        </Collapsible>
      );

      expect(container.querySelector('[data-slot="collapsible"]')).toBeInTheDocument();
      expect(screen.getByText('Toggle')).toBeInTheDocument();
    });

    it('should render with button trigger', () => {
      render(
        <Collapsible>
          <CollapsibleTrigger asChild>
            <Button>Toggle Button</Button>
          </CollapsibleTrigger>
          <CollapsibleContent>Content</CollapsibleContent>
        </Collapsible>
      );

      expect(screen.getByRole('button', { name: 'Toggle Button' })).toBeInTheDocument();
    });

    it('should render content when defaultOpen is true', () => {
      const { container } = render(
        <Collapsible defaultOpen>
          <CollapsibleTrigger>Toggle</CollapsibleTrigger>
          <CollapsibleContent>Visible Content</CollapsibleContent>
        </Collapsible>
      );

      const trigger = container.querySelector('[data-slot="collapsible-trigger"]');
      expect(trigger).toHaveAttribute('data-state', 'open');
    });
  });

  describe('data attributes', () => {
    it('should have data-slot="collapsible" on root', () => {
      const { container } = render(
        <Collapsible>
          <CollapsibleTrigger>Toggle</CollapsibleTrigger>
        </Collapsible>
      );

      expect(container.querySelector('[data-slot="collapsible"]')).toBeInTheDocument();
    });

    it('should have data-slot="collapsible-trigger" on trigger', () => {
      const { container } = render(
        <Collapsible>
          <CollapsibleTrigger>Toggle</CollapsibleTrigger>
        </Collapsible>
      );

      expect(container.querySelector('[data-slot="collapsible-trigger"]')).toBeInTheDocument();
    });

    it('should have data-slot="collapsible-content" on content', () => {
      const { container } = render(
        <Collapsible>
          <CollapsibleTrigger>Toggle</CollapsibleTrigger>
          <CollapsibleContent>Content</CollapsibleContent>
        </Collapsible>
      );

      expect(container.querySelector('[data-slot="collapsible-content"]')).toBeInTheDocument();
    });
  });

  describe('interactions', () => {
    it('should toggle content on trigger click', async () => {
      const user = userEvent.setup();
      const { container } = render(
        <Collapsible>
          <CollapsibleTrigger>Toggle</CollapsibleTrigger>
          <CollapsibleContent>Content</CollapsibleContent>
        </Collapsible>
      );

      const trigger = container.querySelector('[data-slot="collapsible-trigger"]');
      expect(trigger).toHaveAttribute('data-state', 'closed');

      if (trigger) {
        await user.click(trigger);
      }

      expect(trigger).toHaveAttribute('data-state', 'open');
    });

    it('should close when clicked again', async () => {
      const user = userEvent.setup();
      const { container } = render(
        <Collapsible>
          <CollapsibleTrigger>Toggle</CollapsibleTrigger>
          <CollapsibleContent>Content</CollapsibleContent>
        </Collapsible>
      );

      const trigger = container.querySelector('[data-slot="collapsible-trigger"]');

      if (trigger) {
        await user.click(trigger);
        expect(trigger).toHaveAttribute('data-state', 'open');

        await user.click(trigger);
        expect(trigger).toHaveAttribute('data-state', 'closed');
      }
    });

    it('should support controlled mode', () => {
      const { container, rerender } = render(
        <Collapsible open={false}>
          <CollapsibleTrigger>Toggle</CollapsibleTrigger>
          <CollapsibleContent>Content</CollapsibleContent>
        </Collapsible>
      );

      let trigger = container.querySelector('[data-slot="collapsible-trigger"]');
      expect(trigger).toHaveAttribute('data-state', 'closed');

      rerender(
        <Collapsible open={true}>
          <CollapsibleTrigger>Toggle</CollapsibleTrigger>
          <CollapsibleContent>Content</CollapsibleContent>
        </Collapsible>
      );

      trigger = container.querySelector('[data-slot="collapsible-trigger"]');
      expect(trigger).toHaveAttribute('data-state', 'open');
    });

    it('should call onOpenChange callback', async () => {
      const user = userEvent.setup();
      let callbackValue = false;
      const handleChange = (open: boolean) => {
        callbackValue = open;
      };

      const { container } = render(
        <Collapsible onOpenChange={handleChange}>
          <CollapsibleTrigger>Toggle</CollapsibleTrigger>
          <CollapsibleContent>Content</CollapsibleContent>
        </Collapsible>
      );

      const trigger = container.querySelector('[data-slot="collapsible-trigger"]');
      if (trigger) {
        await user.click(trigger);
      }

      expect(callbackValue).toBe(true);
    });
  });

  describe('disabled state', () => {
    it('should render disabled collapsible', () => {
      const { container } = render(
        <Collapsible disabled>
          <CollapsibleTrigger>Toggle</CollapsibleTrigger>
          <CollapsibleContent>Content</CollapsibleContent>
        </Collapsible>
      );

      const trigger = container.querySelector('[data-slot="collapsible-trigger"]');
      expect(trigger).toBeDisabled();
    });

    it('should not toggle when disabled', async () => {
      const user = userEvent.setup();
      const { container } = render(
        <Collapsible disabled>
          <CollapsibleTrigger>Toggle</CollapsibleTrigger>
          <CollapsibleContent>Content</CollapsibleContent>
        </Collapsible>
      );

      const trigger = container.querySelector('[data-slot="collapsible-trigger"]');
      expect(trigger).toHaveAttribute('data-state', 'closed');

      if (trigger) {
        await user.click(trigger);
      }

      expect(trigger).toHaveAttribute('data-state', 'closed');
    });
  });

  describe('accessibility', () => {
    it('should support keyboard navigation', async () => {
      const user = userEvent.setup();
      const { container } = render(
        <Collapsible>
          <CollapsibleTrigger>Toggle</CollapsibleTrigger>
          <CollapsibleContent>Content</CollapsibleContent>
        </Collapsible>
      );

      const trigger = container.querySelector('[data-slot="collapsible-trigger"]');
      trigger?.focus();

      await user.keyboard('{Enter}');

      expect(trigger).toHaveAttribute('data-state', 'open');
    });

    it('should be focusable', () => {
      const { container } = render(
        <Collapsible>
          <CollapsibleTrigger>Toggle</CollapsibleTrigger>
          <CollapsibleContent>Content</CollapsibleContent>
        </Collapsible>
      );

      const trigger = container.querySelector('[data-slot="collapsible-trigger"]');
      trigger?.focus();
      expect(trigger).toHaveFocus();
    });
  });

  describe('styling', () => {
    it('should accept custom className on root', () => {
      const { container } = render(
        <Collapsible className="custom-collapsible">
          <CollapsibleTrigger>Toggle</CollapsibleTrigger>
        </Collapsible>
      );

      const collapsible = container.querySelector('[data-slot="collapsible"]');
      expect(collapsible).toHaveClass('custom-collapsible');
    });

    it('should accept custom className on trigger', () => {
      const { container } = render(
        <Collapsible>
          <CollapsibleTrigger className="custom-trigger">Toggle</CollapsibleTrigger>
        </Collapsible>
      );

      const trigger = container.querySelector('[data-slot="collapsible-trigger"]');
      expect(trigger).toHaveClass('custom-trigger');
    });

    it('should accept custom className on content', () => {
      const { container } = render(
        <Collapsible>
          <CollapsibleTrigger>Toggle</CollapsibleTrigger>
          <CollapsibleContent className="custom-content">Content</CollapsibleContent>
        </Collapsible>
      );

      const content = container.querySelector('[data-slot="collapsible-content"]');
      expect(content).toHaveClass('custom-content');
    });
  });

  describe('edge cases', () => {
    it('should render with complex content', () => {
      render(
        <Collapsible>
          <CollapsibleTrigger>Toggle</CollapsibleTrigger>
          <CollapsibleContent>
            <div>
              <h3>Title</h3>
              <p>Paragraph</p>
            </div>
          </CollapsibleContent>
        </Collapsible>
      );

      expect(screen.getByText('Toggle')).toBeInTheDocument();
    });

    it('should handle multiple collapsibles independently', () => {
      const { container } = render(
        <>
          <Collapsible>
            <CollapsibleTrigger>Toggle 1</CollapsibleTrigger>
            <CollapsibleContent>Content 1</CollapsibleContent>
          </Collapsible>
          <Collapsible defaultOpen>
            <CollapsibleTrigger>Toggle 2</CollapsibleTrigger>
            <CollapsibleContent>Content 2</CollapsibleContent>
          </Collapsible>
        </>
      );

      const triggers = container.querySelectorAll('[data-slot="collapsible-trigger"]');
      expect(triggers[0]).toHaveAttribute('data-state', 'closed');
      expect(triggers[1]).toHaveAttribute('data-state', 'open');
    });

    it('should render without content', () => {
      const { container } = render(
        <Collapsible>
          <CollapsibleTrigger>Toggle</CollapsibleTrigger>
        </Collapsible>
      );

      expect(container.querySelector('[data-slot="collapsible"]')).toBeInTheDocument();
    });

    it('should support asChild pattern', () => {
      render(
        <Collapsible>
          <CollapsibleTrigger asChild>
            <button>Custom Button</button>
          </CollapsibleTrigger>
          <CollapsibleContent>Content</CollapsibleContent>
        </Collapsible>
      );

      expect(screen.getByRole('button', { name: 'Custom Button' })).toBeInTheDocument();
    });
  });
});
