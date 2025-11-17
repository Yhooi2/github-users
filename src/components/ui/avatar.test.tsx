import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { Avatar, AvatarImage, AvatarFallback } from './avatar';

describe('Avatar', () => {
  describe('rendering', () => {
    it('should render avatar root element', () => {
      const { container } = render(
        <Avatar>
          <AvatarFallback>AB</AvatarFallback>
        </Avatar>
      );

      const avatar = container.querySelector('[data-slot="avatar"]');
      expect(avatar).toBeInTheDocument();
    });

    it('should render with image and fallback components', () => {
      const { container } = render(
        <Avatar>
          <AvatarImage src="https://example.com/image.png" alt="Test User" />
          <AvatarFallback>TU</AvatarFallback>
        </Avatar>
      );

      // Avatar root should be present
      expect(container.querySelector('[data-slot="avatar"]')).toBeInTheDocument();
      // Fallback is shown initially before image loads
      expect(screen.getByText('TU')).toBeInTheDocument();
    });

    it('should render fallback only', () => {
      const { container } = render(
        <Avatar>
          <AvatarFallback>FB</AvatarFallback>
        </Avatar>
      );

      expect(screen.getByText('FB')).toBeInTheDocument();
      expect(container.querySelector('[data-slot="avatar-fallback"]')).toBeInTheDocument();
    });

    it('should accept image component with alt text', () => {
      const { container } = render(
        <Avatar>
          <AvatarImage src="https://example.com/image.png" alt="User Avatar" />
          <AvatarFallback>UA</AvatarFallback>
        </Avatar>
      );

      // Avatar root should be present
      expect(container.querySelector('[data-slot="avatar"]')).toBeInTheDocument();
      // Fallback is shown (image loading is async in Radix UI)
      expect(screen.getByText('UA')).toBeInTheDocument();
    });
  });

  describe('data attributes', () => {
    it('should have data-slot="avatar" on root', () => {
      const { container } = render(
        <Avatar>
          <AvatarFallback>AB</AvatarFallback>
        </Avatar>
      );

      expect(container.querySelector('[data-slot="avatar"]')).toBeInTheDocument();
    });

    it('should have data-slot="avatar-fallback" on fallback', () => {
      const { container } = render(
        <Avatar>
          <AvatarFallback>AB</AvatarFallback>
        </Avatar>
      );

      expect(container.querySelector('[data-slot="avatar-fallback"]')).toBeInTheDocument();
    });
  });

  describe('styling', () => {
    it('should have default avatar classes', () => {
      const { container } = render(
        <Avatar>
          <AvatarFallback>AB</AvatarFallback>
        </Avatar>
      );

      const avatar = container.querySelector('[data-slot="avatar"]');
      expect(avatar).toHaveClass('relative');
      expect(avatar).toHaveClass('flex');
      expect(avatar).toHaveClass('size-8');
      expect(avatar).toHaveClass('shrink-0');
      expect(avatar).toHaveClass('overflow-hidden');
      expect(avatar).toHaveClass('rounded-full');
    });

    it('should apply custom className to avatar', () => {
      const { container } = render(
        <Avatar className="size-16">
          <AvatarFallback>AB</AvatarFallback>
        </Avatar>
      );

      const avatar = container.querySelector('[data-slot="avatar"]');
      expect(avatar).toHaveClass('size-16');
    });

    it('should have default fallback classes', () => {
      const { container } = render(
        <Avatar>
          <AvatarFallback>AB</AvatarFallback>
        </Avatar>
      );

      const fallback = container.querySelector('[data-slot="avatar-fallback"]');
      expect(fallback).toHaveClass('bg-muted');
      expect(fallback).toHaveClass('flex');
      expect(fallback).toHaveClass('size-full');
      expect(fallback).toHaveClass('items-center');
      expect(fallback).toHaveClass('justify-center');
      expect(fallback).toHaveClass('rounded-full');
    });

    it('should apply custom className to fallback', () => {
      const { container } = render(
        <Avatar>
          <AvatarFallback className="bg-blue-500 text-white">AB</AvatarFallback>
        </Avatar>
      );

      const fallback = container.querySelector('[data-slot="avatar-fallback"]');
      expect(fallback).toHaveClass('bg-blue-500');
      expect(fallback).toHaveClass('text-white');
    });

    it('should support square avatar', () => {
      const { container } = render(
        <Avatar className="rounded-md">
          <AvatarFallback>SQ</AvatarFallback>
        </Avatar>
      );

      const avatar = container.querySelector('[data-slot="avatar"]');
      expect(avatar).toHaveClass('rounded-md');
    });

    it('should support different sizes', () => {
      const { container: container1 } = render(
        <Avatar className="size-6">
          <AvatarFallback>S</AvatarFallback>
        </Avatar>
      );

      const { container: container2 } = render(
        <Avatar className="size-24">
          <AvatarFallback>L</AvatarFallback>
        </Avatar>
      );

      expect(container1.querySelector('[data-slot="avatar"]')).toHaveClass('size-6');
      expect(container2.querySelector('[data-slot="avatar"]')).toHaveClass('size-24');
    });
  });

  describe('image loading', () => {
    it('should show fallback when image fails to load', async () => {
      render(
        <Avatar>
          <AvatarImage src="https://invalid-url.com/image.png" alt="Test" />
          <AvatarFallback>FB</AvatarFallback>
        </Avatar>
      );

      // Radix UI shows fallback when image fails
      await waitFor(() => {
        expect(screen.getByText('FB')).toBeInTheDocument();
      });
    });

    it('should handle missing image src with fallback', () => {
      render(
        <Avatar>
          <AvatarImage src="" alt="Empty" />
          <AvatarFallback>EM</AvatarFallback>
        </Avatar>
      );

      // Fallback should be shown
      expect(screen.getByText('EM')).toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('should accept alt text prop on image component', () => {
      const { container } = render(
        <Avatar>
          <AvatarImage src="https://example.com/image.png" alt="User profile picture" />
          <AvatarFallback>UP</AvatarFallback>
        </Avatar>
      );

      // Avatar root should be present
      expect(container.querySelector('[data-slot="avatar"]')).toBeInTheDocument();
    });

    it('should support aria attributes via props spread on avatar', () => {
      const { container } = render(
        <Avatar aria-label="User avatar">
          <AvatarFallback>UA</AvatarFallback>
        </Avatar>
      );

      const avatar = container.querySelector('[data-slot="avatar"]');
      expect(avatar).toHaveAttribute('aria-label', 'User avatar');
    });

    it('should support aria attributes on fallback', () => {
      render(
        <Avatar>
          <AvatarFallback aria-label="User initials">AB</AvatarFallback>
        </Avatar>
      );

      expect(screen.getByLabelText('User initials')).toBeInTheDocument();
    });

    it('should support data attributes', () => {
      const { container } = render(
        <Avatar data-testid="custom-avatar">
          <AvatarFallback>AB</AvatarFallback>
        </Avatar>
      );

      expect(container.querySelector('[data-testid="custom-avatar"]')).toBeInTheDocument();
    });
  });

  describe('edge cases', () => {
    it('should render avatar with only image component', () => {
      const { container } = render(
        <Avatar>
          <AvatarImage src="https://example.com/image.png" alt="Test" />
        </Avatar>
      );

      expect(container.querySelector('[data-slot="avatar"]')).toBeInTheDocument();
    });

    it('should handle very long fallback text', () => {
      render(
        <Avatar>
          <AvatarFallback>VERYLONGTEXT</AvatarFallback>
        </Avatar>
      );

      expect(screen.getByText('VERYLONGTEXT')).toBeInTheDocument();
    });

    it('should handle single character fallback', () => {
      render(
        <Avatar>
          <AvatarFallback>A</AvatarFallback>
        </Avatar>
      );

      expect(screen.getByText('A')).toBeInTheDocument();
    });

    it('should handle emoji in fallback', () => {
      render(
        <Avatar>
          <AvatarFallback>👤</AvatarFallback>
        </Avatar>
      );

      expect(screen.getByText('👤')).toBeInTheDocument();
    });

    it('should accept inline styles', () => {
      const { container } = render(
        <Avatar style={{ width: '64px', height: '64px' }}>
          <AvatarFallback>ST</AvatarFallback>
        </Avatar>
      );

      const avatar = container.querySelector('[data-slot="avatar"]');
      expect(avatar).toBeInTheDocument();
      expect(avatar).toHaveAttribute('style');
    });

    it('should support click events', () => {
      const handleClick = vi.fn();
      const { container } = render(
        <Avatar onClick={handleClick}>
          <AvatarFallback>CL</AvatarFallback>
        </Avatar>
      );

      const avatar = container.querySelector('[data-slot="avatar"]');
      avatar?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      expect(handleClick).toHaveBeenCalled();
    });
  });

  describe('composition', () => {
    it('should render nested elements in fallback', () => {
      render(
        <Avatar>
          <AvatarFallback>
            <span data-testid="nested">AB</span>
          </AvatarFallback>
        </Avatar>
      );

      expect(screen.getByTestId('nested')).toBeInTheDocument();
    });

    it('should support multiple children in avatar', () => {
      render(
        <Avatar>
          <AvatarImage src="https://example.com/image.png" alt="Test" />
          <AvatarFallback>AB</AvatarFallback>
          <div data-testid="extra">Extra</div>
        </Avatar>
      );

      // Avatar root and children should be present
      expect(screen.getByText('AB')).toBeInTheDocument();
      expect(screen.getByTestId('extra')).toBeInTheDocument();
    });
  });
});
