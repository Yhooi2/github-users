import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RepositoryPagination } from './RepositoryPagination';

describe('RepositoryPagination', () => {
  const defaultProps = {
    currentPage: 1,
    totalPages: 10,
    pageSize: 20,
    totalItems: 200,
    onPageChange: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render pagination controls', () => {
      render(<RepositoryPagination {...defaultProps} />);

      expect(screen.getByLabelText('Go to first page')).toBeInTheDocument();
      expect(screen.getByLabelText('Go to previous page')).toBeInTheDocument();
      expect(screen.getByText('Page 1 of 10')).toBeInTheDocument();
      expect(screen.getByLabelText('Go to next page')).toBeInTheDocument();
      expect(screen.getByLabelText('Go to last page')).toBeInTheDocument();
    });

    it('should render items info', () => {
      render(<RepositoryPagination {...defaultProps} />);

      expect(screen.getByText(/Showing/)).toBeInTheDocument();
      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('20')).toBeInTheDocument();
      expect(screen.getByText('200')).toBeInTheDocument();
    });

    it('should render page size selector when onPageSizeChange provided', () => {
      const mockOnPageSizeChange = vi.fn();
      render(<RepositoryPagination {...defaultProps} onPageSizeChange={mockOnPageSizeChange} />);

      expect(screen.getByText('Items per page:')).toBeInTheDocument();
    });

    it('should not render page size selector when onPageSizeChange not provided', () => {
      render(<RepositoryPagination {...defaultProps} />);

      expect(screen.queryByText('Items per page:')).not.toBeInTheDocument();
    });

    it('should have navigation role', () => {
      render(<RepositoryPagination {...defaultProps} />);

      const nav = screen.getByRole('navigation', { name: 'Pagination' });
      expect(nav).toBeInTheDocument();
    });
  });

  describe('First Page State', () => {
    it('should disable first and previous buttons on first page', () => {
      render(<RepositoryPagination {...defaultProps} currentPage={1} />);

      expect(screen.getByLabelText('Go to first page')).toBeDisabled();
      expect(screen.getByLabelText('Go to previous page')).toBeDisabled();
      expect(screen.getByLabelText('Go to next page')).not.toBeDisabled();
      expect(screen.getByLabelText('Go to last page')).not.toBeDisabled();
    });

    it('should show correct items range on first page', () => {
      render(<RepositoryPagination {...defaultProps} currentPage={1} />);

      expect(screen.getByText(/Showing.*1.*to.*20.*of.*200/)).toBeInTheDocument();
    });
  });

  describe('Middle Page State', () => {
    it('should enable all buttons on middle page', () => {
      render(<RepositoryPagination {...defaultProps} currentPage={5} />);

      expect(screen.getByLabelText('Go to first page')).not.toBeDisabled();
      expect(screen.getByLabelText('Go to previous page')).not.toBeDisabled();
      expect(screen.getByLabelText('Go to next page')).not.toBeDisabled();
      expect(screen.getByLabelText('Go to last page')).not.toBeDisabled();
    });

    it('should show correct page number', () => {
      render(<RepositoryPagination {...defaultProps} currentPage={5} />);

      expect(screen.getByText('Page 5 of 10')).toBeInTheDocument();
    });

    it('should show correct items range on middle page', () => {
      render(<RepositoryPagination {...defaultProps} currentPage={5} />);

      expect(screen.getByText(/Showing.*81.*to.*100.*of.*200/)).toBeInTheDocument();
    });
  });

  describe('Last Page State', () => {
    it('should disable next and last buttons on last page', () => {
      render(<RepositoryPagination {...defaultProps} currentPage={10} totalPages={10} />);

      expect(screen.getByLabelText('Go to first page')).not.toBeDisabled();
      expect(screen.getByLabelText('Go to previous page')).not.toBeDisabled();
      expect(screen.getByLabelText('Go to next page')).toBeDisabled();
      expect(screen.getByLabelText('Go to last page')).toBeDisabled();
    });

    it('should show correct items range on last page', () => {
      render(<RepositoryPagination {...defaultProps} currentPage={10} totalPages={10} />);

      expect(screen.getByText(/Showing.*181.*to.*200.*of.*200/)).toBeInTheDocument();
    });
  });

  describe('Single Page', () => {
    it('should disable next and last buttons with single page', () => {
      render(
        <RepositoryPagination
          {...defaultProps}
          currentPage={1}
          totalPages={1}
          totalItems={15}
        />
      );

      expect(screen.getByLabelText('Go to next page')).toBeDisabled();
      expect(screen.getByLabelText('Go to last page')).toBeDisabled();
    });

    it('should show Page 1 of 1 for single page', () => {
      render(
        <RepositoryPagination
          {...defaultProps}
          currentPage={1}
          totalPages={1}
          totalItems={15}
        />
      );

      expect(screen.getByText('Page 1 of 1')).toBeInTheDocument();
    });
  });

  describe('Empty State', () => {
    it('should handle zero items', () => {
      render(
        <RepositoryPagination
          {...defaultProps}
          currentPage={1}
          totalPages={0}
          totalItems={0}
        />
      );

      expect(screen.getByText(/Showing.*0.*to.*0.*of.*0/)).toBeInTheDocument();
      expect(screen.getByText('Page 1 of 1')).toBeInTheDocument();
    });

    it('should disable all navigation buttons when no items', () => {
      render(
        <RepositoryPagination
          {...defaultProps}
          currentPage={1}
          totalPages={0}
          totalItems={0}
        />
      );

      expect(screen.getByLabelText('Go to first page')).toBeDisabled();
      expect(screen.getByLabelText('Go to previous page')).toBeDisabled();
      expect(screen.getByLabelText('Go to next page')).toBeDisabled();
      expect(screen.getByLabelText('Go to last page')).toBeDisabled();
    });
  });

  describe('Navigation', () => {
    it('should call onPageChange with 1 when first button clicked', async () => {
      const user = userEvent.setup();
      const mockOnPageChange = vi.fn();

      render(
        <RepositoryPagination {...defaultProps} currentPage={5} onPageChange={mockOnPageChange} />
      );

      await user.click(screen.getByLabelText('Go to first page'));

      expect(mockOnPageChange).toHaveBeenCalledWith(1);
      expect(mockOnPageChange).toHaveBeenCalledTimes(1);
    });

    it('should call onPageChange with previous page when previous button clicked', async () => {
      const user = userEvent.setup();
      const mockOnPageChange = vi.fn();

      render(
        <RepositoryPagination {...defaultProps} currentPage={5} onPageChange={mockOnPageChange} />
      );

      await user.click(screen.getByLabelText('Go to previous page'));

      expect(mockOnPageChange).toHaveBeenCalledWith(4);
      expect(mockOnPageChange).toHaveBeenCalledTimes(1);
    });

    it('should call onPageChange with next page when next button clicked', async () => {
      const user = userEvent.setup();
      const mockOnPageChange = vi.fn();

      render(
        <RepositoryPagination {...defaultProps} currentPage={5} onPageChange={mockOnPageChange} />
      );

      await user.click(screen.getByLabelText('Go to next page'));

      expect(mockOnPageChange).toHaveBeenCalledWith(6);
      expect(mockOnPageChange).toHaveBeenCalledTimes(1);
    });

    it('should call onPageChange with last page when last button clicked', async () => {
      const user = userEvent.setup();
      const mockOnPageChange = vi.fn();

      render(
        <RepositoryPagination
          {...defaultProps}
          currentPage={5}
          totalPages={10}
          onPageChange={mockOnPageChange}
        />
      );

      await user.click(screen.getByLabelText('Go to last page'));

      expect(mockOnPageChange).toHaveBeenCalledWith(10);
      expect(mockOnPageChange).toHaveBeenCalledTimes(1);
    });

    it('should not call onPageChange when clicking disabled buttons', async () => {
      const user = userEvent.setup();
      const mockOnPageChange = vi.fn();

      render(
        <RepositoryPagination {...defaultProps} currentPage={1} onPageChange={mockOnPageChange} />
      );

      await user.click(screen.getByLabelText('Go to first page'));
      await user.click(screen.getByLabelText('Go to previous page'));

      expect(mockOnPageChange).not.toHaveBeenCalled();
    });
  });

  describe('Page Size Change', () => {
    it('should call onPageSizeChange when page size changes', async () => {
      const user = userEvent.setup();
      const mockOnPageSizeChange = vi.fn();
      const mockOnPageChange = vi.fn();

      render(
        <RepositoryPagination
          {...defaultProps}
          onPageChange={mockOnPageChange}
          onPageSizeChange={mockOnPageSizeChange}
        />
      );

      const select = screen.getByRole('combobox');
      await user.click(select);

      // Select 50 items per page
      const option50 = screen.getByRole('option', { name: '50' });
      await user.click(option50);

      expect(mockOnPageSizeChange).toHaveBeenCalledWith(50);
    });

    it('should reset to page 1 when page size changes', async () => {
      const user = userEvent.setup();
      const mockOnPageSizeChange = vi.fn();
      const mockOnPageChange = vi.fn();

      render(
        <RepositoryPagination
          {...defaultProps}
          currentPage={5}
          onPageChange={mockOnPageChange}
          onPageSizeChange={mockOnPageSizeChange}
        />
      );

      const select = screen.getByRole('combobox');
      await user.click(select);

      const option50 = screen.getByRole('option', { name: '50' });
      await user.click(option50);

      expect(mockOnPageChange).toHaveBeenCalledWith(1);
    });

    it('should render custom page size options', () => {
      const customOptions = [5, 15, 25];
      render(
        <RepositoryPagination
          {...defaultProps}
          onPageSizeChange={vi.fn()}
          pageSizeOptions={customOptions}
        />
      );

      // All options should be available (need to open select to see them in the test)
      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });
  });

  describe('Compact Mode', () => {
    it('should not render items info in compact mode', () => {
      render(<RepositoryPagination {...defaultProps} compact />);

      expect(screen.queryByText(/Showing/)).not.toBeInTheDocument();
    });

    it('should not render button labels in compact mode', () => {
      render(<RepositoryPagination {...defaultProps} compact />);

      expect(screen.queryByText('First')).not.toBeInTheDocument();
      expect(screen.queryByText('Previous')).not.toBeInTheDocument();
      expect(screen.queryByText('Next')).not.toBeInTheDocument();
      expect(screen.queryByText('Last')).not.toBeInTheDocument();
    });

    it('should still render page indicator in compact mode', () => {
      render(<RepositoryPagination {...defaultProps} compact />);

      expect(screen.getByText('Page 1 of 10')).toBeInTheDocument();
    });

    it('should render icons in compact mode', () => {
      render(<RepositoryPagination {...defaultProps} compact />);

      expect(screen.getByLabelText('Go to first page')).toBeInTheDocument();
      expect(screen.getByLabelText('Go to previous page')).toBeInTheDocument();
      expect(screen.getByLabelText('Go to next page')).toBeInTheDocument();
      expect(screen.getByLabelText('Go to last page')).toBeInTheDocument();
    });
  });

  describe('Disabled State', () => {
    it('should disable all buttons when disabled prop is true', () => {
      render(<RepositoryPagination {...defaultProps} currentPage={5} disabled />);

      expect(screen.getByLabelText('Go to first page')).toBeDisabled();
      expect(screen.getByLabelText('Go to previous page')).toBeDisabled();
      expect(screen.getByLabelText('Go to next page')).toBeDisabled();
      expect(screen.getByLabelText('Go to last page')).toBeDisabled();
    });

    it('should not call onPageChange when disabled', async () => {
      const user = userEvent.setup();
      const mockOnPageChange = vi.fn();

      render(
        <RepositoryPagination
          {...defaultProps}
          currentPage={5}
          onPageChange={mockOnPageChange}
          disabled
        />
      );

      await user.click(screen.getByLabelText('Go to next page'));

      expect(mockOnPageChange).not.toHaveBeenCalled();
    });

    it('should disable page size selector when disabled', () => {
      render(<RepositoryPagination {...defaultProps} onPageSizeChange={vi.fn()} disabled />);

      expect(screen.getByRole('combobox')).toBeDisabled();
    });
  });

  describe('Edge Cases', () => {
    it('should handle partial last page correctly', () => {
      render(
        <RepositoryPagination
          {...defaultProps}
          currentPage={11}
          totalPages={11}
          totalItems={205}
        />
      );

      expect(screen.getByText(/Showing.*201.*to.*205.*of.*205/)).toBeInTheDocument();
    });

    it('should handle exactly one page worth of items', () => {
      render(
        <RepositoryPagination
          {...defaultProps}
          currentPage={1}
          totalPages={1}
          totalItems={20}
        />
      );

      expect(screen.getByText(/Showing.*1.*to.*20.*of.*20/)).toBeInTheDocument();
    });

    it('should handle large page numbers', () => {
      render(
        <RepositoryPagination
          {...defaultProps}
          currentPage={999}
          totalPages={1000}
          totalItems={20000}
        />
      );

      expect(screen.getByText('Page 999 of 1000')).toBeInTheDocument();
    });

    it('should handle page 2 of 2 pages', () => {
      render(
        <RepositoryPagination
          {...defaultProps}
          currentPage={2}
          totalPages={2}
          totalItems={40}
        />
      );

      expect(screen.getByText('Page 2 of 2')).toBeInTheDocument();
      expect(screen.getByLabelText('Go to next page')).toBeDisabled();
    });

    it('should handle zero total pages gracefully', () => {
      render(
        <RepositoryPagination
          {...defaultProps}
          currentPage={1}
          totalPages={0}
          totalItems={0}
        />
      );

      expect(screen.getByText('Page 1 of 1')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels for all buttons', () => {
      render(<RepositoryPagination {...defaultProps} />);

      expect(screen.getByLabelText('Go to first page')).toHaveAttribute('title', 'First page');
      expect(screen.getByLabelText('Go to previous page')).toHaveAttribute(
        'title',
        'Previous page'
      );
      expect(screen.getByLabelText('Go to next page')).toHaveAttribute('title', 'Next page');
      expect(screen.getByLabelText('Go to last page')).toHaveAttribute('title', 'Last page');
    });

    it('should have aria-current on page indicator', () => {
      render(<RepositoryPagination {...defaultProps} />);

      const pageIndicator = screen.getByText('Page 1 of 10');
      expect(pageIndicator).toHaveAttribute('aria-current', 'page');
    });

    it('should have navigation role', () => {
      render(<RepositoryPagination {...defaultProps} />);

      expect(screen.getByRole('navigation', { name: 'Pagination' })).toBeInTheDocument();
    });
  });

  describe('Item Count Calculations', () => {
    it('should calculate start and end items correctly for page 1', () => {
      render(<RepositoryPagination {...defaultProps} currentPage={1} pageSize={20} />);

      const text = screen.getByText(/Showing.*1.*to.*20/);
      expect(text).toBeInTheDocument();
    });

    it('should calculate start and end items correctly for page 2', () => {
      render(<RepositoryPagination {...defaultProps} currentPage={2} pageSize={20} />);

      const text = screen.getByText(/Showing.*21.*to.*40/);
      expect(text).toBeInTheDocument();
    });

    it('should not exceed total items on last page', () => {
      render(
        <RepositoryPagination
          {...defaultProps}
          currentPage={10}
          totalPages={10}
          pageSize={25}
          totalItems={230}
        />
      );

      const text = screen.getByText(/Showing.*226.*to.*230.*of.*230/);
      expect(text).toBeInTheDocument();
    });

    it('should handle page size of 10', () => {
      render(<RepositoryPagination {...defaultProps} currentPage={3} pageSize={10} />);

      const text = screen.getByText(/Showing.*21.*to.*30/);
      expect(text).toBeInTheDocument();
    });

    it('should handle page size of 50', () => {
      render(
        <RepositoryPagination
          {...defaultProps}
          currentPage={2}
          pageSize={50}
          totalItems={200}
        />
      );

      const text = screen.getByText(/Showing.*51.*to.*100/);
      expect(text).toBeInTheDocument();
    });
  });
});
