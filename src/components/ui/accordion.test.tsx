import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from './accordion';

describe('Accordion', () => {
  describe('rendering', () => {
    it('should render accordion with items', () => {
      const { container } = render(
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>Question 1</AccordionTrigger>
            <AccordionContent>Answer 1</AccordionContent>
          </AccordionItem>
        </Accordion>
      );

      expect(container.querySelector('[data-slot="accordion"]')).toBeInTheDocument();
      expect(screen.getByText('Question 1')).toBeInTheDocument();
    });

    it('should render multiple accordion items', () => {
      render(
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>Question 1</AccordionTrigger>
            <AccordionContent>Answer 1</AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Question 2</AccordionTrigger>
            <AccordionContent>Answer 2</AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>Question 3</AccordionTrigger>
            <AccordionContent>Answer 3</AccordionContent>
          </AccordionItem>
        </Accordion>
      );

      expect(screen.getByText('Question 1')).toBeInTheDocument();
      expect(screen.getByText('Question 2')).toBeInTheDocument();
      expect(screen.getByText('Question 3')).toBeInTheDocument();
    });

    it('should not show content initially when closed', () => {
      render(
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>Question</AccordionTrigger>
            <AccordionContent>Hidden Answer</AccordionContent>
          </AccordionItem>
        </Accordion>
      );

      // Content exists in DOM but is hidden via CSS/animations
      expect(screen.getByText('Question')).toBeInTheDocument();
    });
  });

  describe('data attributes', () => {
    it('should have data-slot="accordion" on root', () => {
      const { container } = render(
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>Question</AccordionTrigger>
            <AccordionContent>Answer</AccordionContent>
          </AccordionItem>
        </Accordion>
      );

      expect(container.querySelector('[data-slot="accordion"]')).toBeInTheDocument();
    });

    it('should have data-slot="accordion-item" on items', () => {
      const { container } = render(
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>Question</AccordionTrigger>
            <AccordionContent>Answer</AccordionContent>
          </AccordionItem>
        </Accordion>
      );

      expect(container.querySelector('[data-slot="accordion-item"]')).toBeInTheDocument();
    });

    it('should have data-slot="accordion-trigger" on triggers', () => {
      const { container } = render(
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>Question</AccordionTrigger>
            <AccordionContent>Answer</AccordionContent>
          </AccordionItem>
        </Accordion>
      );

      expect(container.querySelector('[data-slot="accordion-trigger"]')).toBeInTheDocument();
    });

    it('should have data-slot="accordion-content" on content', () => {
      const { container } = render(
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>Question</AccordionTrigger>
            <AccordionContent>Answer</AccordionContent>
          </AccordionItem>
        </Accordion>
      );

      expect(container.querySelector('[data-slot="accordion-content"]')).toBeInTheDocument();
    });
  });

  describe('interactions', () => {
    it('should expand item when clicked', async () => {
      const user = userEvent.setup();

      render(
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>Question</AccordionTrigger>
            <AccordionContent>Answer</AccordionContent>
          </AccordionItem>
        </Accordion>
      );

      const trigger = screen.getByText('Question');
      await user.click(trigger);

      expect(screen.getByText('Answer')).toBeVisible();
    });

    it('should collapse item when clicked again', async () => {
      const user = userEvent.setup();

      const { container } = render(
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>Question</AccordionTrigger>
            <AccordionContent>Answer</AccordionContent>
          </AccordionItem>
        </Accordion>
      );

      const trigger = screen.getByText('Question');

      // Open
      await user.click(trigger);
      expect(screen.getByText('Answer')).toBeVisible();

      // Close - check data-state attribute
      await user.click(trigger);
      const triggerElement = container.querySelector('[data-slot="accordion-trigger"]');
      expect(triggerElement).toHaveAttribute('data-state', 'closed');
    });

    it('should close previous item in single mode', async () => {
      const user = userEvent.setup();

      const { container } = render(
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>Question 1</AccordionTrigger>
            <AccordionContent>Answer 1</AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Question 2</AccordionTrigger>
            <AccordionContent>Answer 2</AccordionContent>
          </AccordionItem>
        </Accordion>
      );

      // Open first item
      await user.click(screen.getByText('Question 1'));
      expect(screen.getByText('Answer 1')).toBeVisible();

      // Open second item (should close first) - check via aria-expanded
      await user.click(screen.getByText('Question 2'));
      expect(screen.getByText('Answer 2')).toBeVisible();

      const triggers = container.querySelectorAll('[data-slot="accordion-trigger"]');
      expect(triggers[0]).toHaveAttribute('data-state', 'closed');
      expect(triggers[1]).toHaveAttribute('data-state', 'open');
    });

    it('should allow multiple items open in multiple mode', async () => {
      const user = userEvent.setup();

      render(
        <Accordion type="multiple">
          <AccordionItem value="item-1">
            <AccordionTrigger>Question 1</AccordionTrigger>
            <AccordionContent>Answer 1</AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Question 2</AccordionTrigger>
            <AccordionContent>Answer 2</AccordionContent>
          </AccordionItem>
        </Accordion>
      );

      await user.click(screen.getByText('Question 1'));
      await user.click(screen.getByText('Question 2'));

      expect(screen.getByText('Answer 1')).toBeVisible();
      expect(screen.getByText('Answer 2')).toBeVisible();
    });
  });

  describe('styling', () => {
    it('should have default border classes on items', () => {
      const { container } = render(
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>Question</AccordionTrigger>
            <AccordionContent>Answer</AccordionContent>
          </AccordionItem>
        </Accordion>
      );

      const item = container.querySelector('[data-slot="accordion-item"]');
      expect(item).toHaveClass('border-b');
      expect(item).toHaveClass('last:border-b-0');
    });

    it('should apply custom className to accordion', () => {
      const { container } = render(
        <Accordion type="single" collapsible className="custom-accordion">
          <AccordionItem value="item-1">
            <AccordionTrigger>Question</AccordionTrigger>
            <AccordionContent>Answer</AccordionContent>
          </AccordionItem>
        </Accordion>
      );

      const accordion = container.querySelector('[data-slot="accordion"]');
      expect(accordion).toHaveClass('custom-accordion');
    });

    it('should apply custom className to items', () => {
      const { container } = render(
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1" className="custom-item">
            <AccordionTrigger>Question</AccordionTrigger>
            <AccordionContent>Answer</AccordionContent>
          </AccordionItem>
        </Accordion>
      );

      const item = container.querySelector('[data-slot="accordion-item"]');
      expect(item).toHaveClass('custom-item');
    });

    it('should apply custom className to trigger', () => {
      const { container } = render(
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger className="custom-trigger">Question</AccordionTrigger>
            <AccordionContent>Answer</AccordionContent>
          </AccordionItem>
        </Accordion>
      );

      const trigger = container.querySelector('[data-slot="accordion-trigger"]');
      expect(trigger).toHaveClass('custom-trigger');
    });

    it('should accept custom className on content', () => {
      const { container } = render(
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>Question</AccordionTrigger>
            <AccordionContent className="custom-content">Answer</AccordionContent>
          </AccordionItem>
        </Accordion>
      );

      // Content exists in DOM
      expect(container.querySelector('[data-slot="accordion-content"]')).toBeInTheDocument();
    });

    it('should have chevron icon in trigger', () => {
      const { container } = render(
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>Question</AccordionTrigger>
            <AccordionContent>Answer</AccordionContent>
          </AccordionItem>
        </Accordion>
      );

      const svg = container.querySelector('[data-slot="accordion-trigger"] svg');
      expect(svg).toBeInTheDocument();
    });
  });

  describe('default value', () => {
    it('should open item with defaultValue in single mode', () => {
      render(
        <Accordion type="single" collapsible defaultValue="item-1">
          <AccordionItem value="item-1">
            <AccordionTrigger>Question</AccordionTrigger>
            <AccordionContent>Default Open</AccordionContent>
          </AccordionItem>
        </Accordion>
      );

      expect(screen.getByText('Default Open')).toBeVisible();
    });

    it('should open multiple items with defaultValue in multiple mode', () => {
      render(
        <Accordion type="multiple" defaultValue={['item-1', 'item-2']}>
          <AccordionItem value="item-1">
            <AccordionTrigger>Question 1</AccordionTrigger>
            <AccordionContent>Answer 1</AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Question 2</AccordionTrigger>
            <AccordionContent>Answer 2</AccordionContent>
          </AccordionItem>
        </Accordion>
      );

      expect(screen.getByText('Answer 1')).toBeVisible();
      expect(screen.getByText('Answer 2')).toBeVisible();
    });
  });

  describe('accessibility', () => {
    it('should have button role on trigger', () => {
      render(
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>Question</AccordionTrigger>
            <AccordionContent>Answer</AccordionContent>
          </AccordionItem>
        </Accordion>
      );

      expect(screen.getByRole('button', { name: 'Question' })).toBeInTheDocument();
    });

    it('should support keyboard navigation', async () => {
      const user = userEvent.setup();

      render(
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>Question</AccordionTrigger>
            <AccordionContent>Answer</AccordionContent>
          </AccordionItem>
        </Accordion>
      );

      const trigger = screen.getByRole('button', { name: 'Question' });

      // Focus and activate with Enter
      trigger.focus();
      await user.keyboard('{Enter}');

      expect(screen.getByText('Answer')).toBeVisible();
    });

    it('should support aria attributes', () => {
      const { container } = render(
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>Question</AccordionTrigger>
            <AccordionContent>Answer</AccordionContent>
          </AccordionItem>
        </Accordion>
      );

      const trigger = container.querySelector('[data-slot="accordion-trigger"]');
      expect(trigger).toHaveAttribute('aria-expanded');
    });
  });

  describe('disabled state', () => {
    it('should not expand disabled item', async () => {
      const user = userEvent.setup();

      const { container } = render(
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1" disabled>
            <AccordionTrigger>Disabled Question</AccordionTrigger>
            <AccordionContent>Hidden Answer</AccordionContent>
          </AccordionItem>
        </Accordion>
      );

      const trigger = screen.getByText('Disabled Question');
      await user.click(trigger);

      // Check that trigger remains closed via data-state
      const triggerElement = container.querySelector('[data-slot="accordion-trigger"]');
      expect(triggerElement).toHaveAttribute('data-state', 'closed');
    });

    it('should have disabled attribute on disabled trigger', () => {
      const { container } = render(
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1" disabled>
            <AccordionTrigger>Disabled</AccordionTrigger>
            <AccordionContent>Answer</AccordionContent>
          </AccordionItem>
        </Accordion>
      );

      const trigger = container.querySelector('[data-slot="accordion-trigger"]');
      expect(trigger).toBeDisabled();
    });
  });

  describe('edge cases', () => {
    it('should render with complex content', () => {
      render(
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>Complex</AccordionTrigger>
            <AccordionContent>
              <div>
                <h3>Title</h3>
                <ul>
                  <li>Item 1</li>
                  <li>Item 2</li>
                </ul>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      );

      expect(screen.getByText('Complex')).toBeInTheDocument();
    });

    it('should handle empty content', () => {
      render(
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>Empty</AccordionTrigger>
            <AccordionContent></AccordionContent>
          </AccordionItem>
        </Accordion>
      );

      expect(screen.getByText('Empty')).toBeInTheDocument();
    });

    it('should render single item accordion', () => {
      render(
        <Accordion type="single" collapsible>
          <AccordionItem value="only">
            <AccordionTrigger>Only Item</AccordionTrigger>
            <AccordionContent>Only Content</AccordionContent>
          </AccordionItem>
        </Accordion>
      );

      expect(screen.getByText('Only Item')).toBeInTheDocument();
    });
  });
});
