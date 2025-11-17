import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Separator } from './separator';

describe('Separator', () => {
  describe('rendering', () => {
    it('should render separator element', () => {
      const { container } = render(<Separator />);

      const separator = container.querySelector('[data-slot="separator"]');
      expect(separator).toBeInTheDocument();
    });

    it('should render with horizontal orientation by default', () => {
      const { container } = render(<Separator />);

      const separator = container.querySelector('[data-slot="separator"]');
      expect(separator).toHaveAttribute('data-orientation', 'horizontal');
    });

    it('should render with vertical orientation', () => {
      const { container } = render(<Separator orientation="vertical" />);

      const separator = container.querySelector('[data-slot="separator"]');
      expect(separator).toHaveAttribute('data-orientation', 'vertical');
    });

    it('should be decorative by default', () => {
      const { container } = render(<Separator />);

      const separator = container.querySelector('[data-slot="separator"]');
      expect(separator).toHaveAttribute('role', 'none');
    });

    it('should be semantic when decorative=false', () => {
      const { container } = render(<Separator decorative={false} />);

      const separator = container.querySelector('[data-slot="separator"]');
      expect(separator).toHaveAttribute('role', 'separator');
    });
  });

  describe('data attributes', () => {
    it('should have data-slot attribute', () => {
      const { container } = render(<Separator />);

      expect(container.querySelector('[data-slot="separator"]')).toBeInTheDocument();
    });

    it('should have data-orientation=horizontal for horizontal separator', () => {
      const { container } = render(<Separator orientation="horizontal" />);

      const separator = container.querySelector('[data-slot="separator"]');
      expect(separator).toHaveAttribute('data-orientation', 'horizontal');
    });

    it('should have data-orientation=vertical for vertical separator', () => {
      const { container } = render(<Separator orientation="vertical" />);

      const separator = container.querySelector('[data-slot="separator"]');
      expect(separator).toHaveAttribute('data-orientation', 'vertical');
    });
  });

  describe('styling', () => {
    it('should have default separator classes', () => {
      const { container } = render(<Separator />);

      const separator = container.querySelector('[data-slot="separator"]');
      expect(separator).toHaveClass('bg-border');
      expect(separator).toHaveClass('shrink-0');
    });

    it('should have horizontal-specific classes by default', () => {
      const { container } = render(<Separator />);

      const separator = container.querySelector('[data-slot="separator"]');
      expect(separator).toHaveClass('data-[orientation=horizontal]:h-px');
      expect(separator).toHaveClass('data-[orientation=horizontal]:w-full');
    });

    it('should have vertical-specific classes', () => {
      const { container } = render(<Separator orientation="vertical" />);

      const separator = container.querySelector('[data-slot="separator"]');
      expect(separator).toHaveClass('data-[orientation=vertical]:h-full');
      expect(separator).toHaveClass('data-[orientation=vertical]:w-px');
    });

    it('should apply custom className', () => {
      const { container } = render(<Separator className="my-4" />);

      const separator = container.querySelector('[data-slot="separator"]');
      expect(separator).toHaveClass('my-4');
    });

    it('should merge custom className with defaults', () => {
      const { container } = render(<Separator className="bg-blue-500 h-1" />);

      const separator = container.querySelector('[data-slot="separator"]');
      expect(separator).toHaveClass('bg-blue-500');
      expect(separator).toHaveClass('h-1');
      expect(separator).toHaveClass('shrink-0');
    });

    it('should support custom colors via className', () => {
      const { container } = render(<Separator className="bg-red-500" />);

      const separator = container.querySelector('[data-slot="separator"]');
      expect(separator).toHaveClass('bg-red-500');
    });

    it('should support custom thickness', () => {
      const { container } = render(<Separator className="h-2" />);

      const separator = container.querySelector('[data-slot="separator"]');
      expect(separator).toHaveClass('h-2');
    });
  });

  describe('orientation', () => {
    it('should default to horizontal', () => {
      const { container } = render(<Separator />);

      const separator = container.querySelector('[data-slot="separator"]');
      expect(separator).toHaveAttribute('data-orientation', 'horizontal');
    });

    it('should accept horizontal orientation explicitly', () => {
      const { container } = render(<Separator orientation="horizontal" />);

      const separator = container.querySelector('[data-slot="separator"]');
      expect(separator).toHaveAttribute('data-orientation', 'horizontal');
    });

    it('should accept vertical orientation', () => {
      const { container } = render(<Separator orientation="vertical" />);

      const separator = container.querySelector('[data-slot="separator"]');
      expect(separator).toHaveAttribute('data-orientation', 'vertical');
    });
  });

  describe('decorative prop', () => {
    it('should be decorative by default (role="none")', () => {
      const { container } = render(<Separator />);

      const separator = container.querySelector('[data-slot="separator"]');
      expect(separator).toHaveAttribute('role', 'none');
    });

    it('should be decorative when decorative=true', () => {
      const { container } = render(<Separator decorative={true} />);

      const separator = container.querySelector('[data-slot="separator"]');
      expect(separator).toHaveAttribute('role', 'none');
    });

    it('should be semantic when decorative=false', () => {
      const { container } = render(<Separator decorative={false} />);

      const separator = container.querySelector('[data-slot="separator"]');
      expect(separator).toHaveAttribute('role', 'separator');
    });
  });

  describe('accessibility', () => {
    it('should have role="none" for decorative separators', () => {
      const { container } = render(<Separator />);

      const separator = container.querySelector('[data-slot="separator"]');
      expect(separator).toHaveAttribute('role', 'none');
    });

    it('should have role="separator" for semantic separators', () => {
      const { container } = render(<Separator decorative={false} />);

      const separator = container.querySelector('[data-slot="separator"]');
      expect(separator).toHaveAttribute('role', 'separator');
    });

    it('should support aria attributes via props spread', () => {
      const { container } = render(<Separator aria-label="Content divider" decorative={false} />);

      const separator = container.querySelector('[data-slot="separator"]');
      expect(separator).toHaveAttribute('aria-label', 'Content divider');
    });

    it('should support data attributes', () => {
      const { container } = render(<Separator data-testid="custom-separator" />);

      expect(container.querySelector('[data-testid="custom-separator"]')).toBeInTheDocument();
    });

    it('should have aria-orientation for semantic separators', () => {
      const { container } = render(<Separator decorative={false} orientation="vertical" />);

      const separator = container.querySelector('[data-slot="separator"]');
      expect(separator).toHaveAttribute('aria-orientation', 'vertical');
    });
  });

  describe('edge cases', () => {
    it('should render without any props', () => {
      const { container } = render(<Separator />);

      const separator = container.querySelector('[data-slot="separator"]');
      expect(separator).toBeInTheDocument();
    });

    it('should support inline styles', () => {
      const { container } = render(<Separator style={{ marginTop: '16px' }} />);

      const separator = container.querySelector('[data-slot="separator"]');
      expect(separator).toBeInTheDocument();
      expect(separator).toHaveAttribute('style');
    });

    it('should render multiple separators independently', () => {
      const { container } = render(
        <>
          <Separator />
          <Separator orientation="vertical" />
          <Separator decorative={false} />
        </>
      );

      const separators = container.querySelectorAll('[data-slot="separator"]');
      expect(separators).toHaveLength(3);
    });

    it('should handle className overrides', () => {
      const { container } = render(<Separator className="!bg-purple-500" />);

      const separator = container.querySelector('[data-slot="separator"]');
      expect(separator).toHaveClass('!bg-purple-500');
    });
  });

  describe('common use cases', () => {
    it('should render horizontal separator for content division', () => {
      const { container } = render(<Separator className="my-4" />);

      const separator = container.querySelector('[data-slot="separator"]');
      expect(separator).toHaveClass('my-4');
      expect(separator).toHaveAttribute('data-orientation', 'horizontal');
    });

    it('should render vertical separator for navigation', () => {
      const { container } = render(<Separator orientation="vertical" className="h-4" />);

      const separator = container.querySelector('[data-slot="separator"]');
      expect(separator).toHaveClass('h-4');
      expect(separator).toHaveAttribute('data-orientation', 'vertical');
    });

    it('should render with custom spacing', () => {
      const { container } = render(<Separator className="my-6" />);

      const separator = container.querySelector('[data-slot="separator"]');
      expect(separator).toHaveClass('my-6');
    });
  });
});
