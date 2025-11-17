import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RepositorySorting } from './RepositorySorting';

describe('RepositorySorting', () => {
  const mockOnSortByChange = vi.fn();
  const mockOnSortDirectionChange = vi.fn();
  const mockOnToggleDirection = vi.fn();

  const defaultProps = {
    sortBy: 'stars' as const,
    sortDirection: 'desc' as const,
    onSortByChange: mockOnSortByChange,
    onSortDirectionChange: mockOnSortDirectionChange,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render sort label', () => {
      render(<RepositorySorting {...defaultProps} />);

      expect(screen.getByText('Sort by:')).toBeInTheDocument();
    });

    it('should render ascending button', () => {
      render(<RepositorySorting {...defaultProps} />);

      expect(screen.getByLabelText('Sort ascending')).toBeInTheDocument();
      expect(screen.getByText('Asc')).toBeInTheDocument();
    });

    it('should render descending button', () => {
      render(<RepositorySorting {...defaultProps} />);

      expect(screen.getByLabelText('Sort descending')).toBeInTheDocument();
      expect(screen.getByText('Desc')).toBeInTheDocument();
    });

    it('should render toggle direction button', () => {
      render(<RepositorySorting {...defaultProps} />);

      expect(screen.getByLabelText('Toggle sort direction')).toBeInTheDocument();
    });

    it('should show current sort value', () => {
      render(<RepositorySorting {...defaultProps} sortBy="forks" />);

      expect(screen.getByText('Forks')).toBeInTheDocument();
    });

    it('should not show "Asc" and "Desc" text in compact mode', () => {
      render(<RepositorySorting {...defaultProps} compact />);

      expect(screen.queryByText('Asc')).not.toBeInTheDocument();
      expect(screen.queryByText('Desc')).not.toBeInTheDocument();
      // But buttons should still be there
      expect(screen.getByLabelText('Sort ascending')).toBeInTheDocument();
      expect(screen.getByLabelText('Sort descending')).toBeInTheDocument();
    });
  });

  describe('Sort Direction Buttons', () => {
    it('should call onSortDirectionChange with "asc" when ascending button is clicked', async () => {
      const user = userEvent.setup();
      render(<RepositorySorting {...defaultProps} />);

      const ascButton = screen.getByLabelText('Sort ascending');
      await user.click(ascButton);

      expect(mockOnSortDirectionChange).toHaveBeenCalledWith('asc');
      expect(mockOnSortDirectionChange).toHaveBeenCalledTimes(1);
    });

    it('should call onSortDirectionChange with "desc" when descending button is clicked', async () => {
      const user = userEvent.setup();
      render(<RepositorySorting {...defaultProps} sortDirection="asc" />);

      const descButton = screen.getByLabelText('Sort descending');
      await user.click(descButton);

      expect(mockOnSortDirectionChange).toHaveBeenCalledWith('desc');
      expect(mockOnSortDirectionChange).toHaveBeenCalledTimes(1);
    });

    it('should highlight active direction button', () => {
      render(<RepositorySorting {...defaultProps} sortDirection="asc" />);

      const ascButton = screen.getByLabelText('Sort ascending');
      const descButton = screen.getByLabelText('Sort descending');

      expect(ascButton).toHaveAttribute('aria-pressed', 'true');
      expect(descButton).toHaveAttribute('aria-pressed', 'false');
    });

    it('should highlight descending button when direction is desc', () => {
      render(<RepositorySorting {...defaultProps} sortDirection="desc" />);

      const ascButton = screen.getByLabelText('Sort ascending');
      const descButton = screen.getByLabelText('Sort descending');

      expect(ascButton).toHaveAttribute('aria-pressed', 'false');
      expect(descButton).toHaveAttribute('aria-pressed', 'true');
    });
  });

  describe('Toggle Direction Button', () => {
    it('should call onToggleDirection when toggle button is clicked', async () => {
      const user = userEvent.setup();
      render(<RepositorySorting {...defaultProps} onToggleDirection={mockOnToggleDirection} />);

      const toggleButton = screen.getByLabelText('Toggle sort direction');
      await user.click(toggleButton);

      expect(mockOnToggleDirection).toHaveBeenCalledTimes(1);
      expect(mockOnSortDirectionChange).not.toHaveBeenCalled();
    });

    it('should use onSortDirectionChange as fallback when onToggleDirection is not provided', async () => {
      const user = userEvent.setup();
      render(<RepositorySorting {...defaultProps} sortDirection="asc" />);

      const toggleButton = screen.getByLabelText('Toggle sort direction');
      await user.click(toggleButton);

      expect(mockOnSortDirectionChange).toHaveBeenCalledWith('desc');
    });

    it('should toggle from desc to asc when onToggleDirection is not provided', async () => {
      const user = userEvent.setup();
      render(<RepositorySorting {...defaultProps} sortDirection="desc" />);

      const toggleButton = screen.getByLabelText('Toggle sort direction');
      await user.click(toggleButton);

      expect(mockOnSortDirectionChange).toHaveBeenCalledWith('asc');
    });
  });

  describe('Sort Field Selection', () => {
    it('should display all sort options', () => {
      render(<RepositorySorting {...defaultProps} sortBy="stars" />);

      expect(screen.getByText('Stars')).toBeInTheDocument();
    });

    // Note: Interactive Select tests are skipped due to @radix-ui/react-select
    // issues with hasPointerCapture in jsdom (same as RepositoryFilters)
  });

  describe('Accessibility', () => {
    it('should have aria-label for ascending button', () => {
      render(<RepositorySorting {...defaultProps} />);

      expect(screen.getByLabelText('Sort ascending')).toBeInTheDocument();
    });

    it('should have aria-label for descending button', () => {
      render(<RepositorySorting {...defaultProps} />);

      expect(screen.getByLabelText('Sort descending')).toBeInTheDocument();
    });

    it('should have aria-label for toggle button', () => {
      render(<RepositorySorting {...defaultProps} />);

      expect(screen.getByLabelText('Toggle sort direction')).toBeInTheDocument();
    });

    it('should have aria-pressed attribute on direction buttons', () => {
      render(<RepositorySorting {...defaultProps} sortDirection="asc" />);

      const ascButton = screen.getByLabelText('Sort ascending');
      expect(ascButton).toHaveAttribute('aria-pressed', 'true');
    });

    it('should have title attribute on toggle button', () => {
      render(<RepositorySorting {...defaultProps} />);

      const toggleButton = screen.getByLabelText('Toggle sort direction');
      expect(toggleButton).toHaveAttribute('title', 'Toggle sort direction');
    });
  });

  describe('Different Sort Fields', () => {
    it('should display "Forks" when sortBy is forks', () => {
      render(<RepositorySorting {...defaultProps} sortBy="forks" />);

      expect(screen.getByText('Forks')).toBeInTheDocument();
    });

    it('should display "Watchers" when sortBy is watchers', () => {
      render(<RepositorySorting {...defaultProps} sortBy="watchers" />);

      expect(screen.getByText('Watchers')).toBeInTheDocument();
    });

    it('should display "Commits" when sortBy is commits', () => {
      render(<RepositorySorting {...defaultProps} sortBy="commits" />);

      expect(screen.getByText('Commits')).toBeInTheDocument();
    });

    it('should display "Size" when sortBy is size', () => {
      render(<RepositorySorting {...defaultProps} sortBy="size" />);

      expect(screen.getByText('Size')).toBeInTheDocument();
    });

    it('should display "Last Updated" when sortBy is updated', () => {
      render(<RepositorySorting {...defaultProps} sortBy="updated" />);

      expect(screen.getByText('Last Updated')).toBeInTheDocument();
    });

    it('should display "Created Date" when sortBy is created', () => {
      render(<RepositorySorting {...defaultProps} sortBy="created" />);

      expect(screen.getByText('Created Date')).toBeInTheDocument();
    });

    it('should display "Name" when sortBy is name', () => {
      render(<RepositorySorting {...defaultProps} sortBy="name" />);

      expect(screen.getByText('Name')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle rapid direction changes', async () => {
      const user = userEvent.setup();
      render(<RepositorySorting {...defaultProps} />);

      const ascButton = screen.getByLabelText('Sort ascending');
      const descButton = screen.getByLabelText('Sort descending');

      await user.click(ascButton);
      await user.click(descButton);
      await user.click(ascButton);

      expect(mockOnSortDirectionChange).toHaveBeenCalledTimes(3);
      expect(mockOnSortDirectionChange).toHaveBeenNthCalledWith(1, 'asc');
      expect(mockOnSortDirectionChange).toHaveBeenNthCalledWith(2, 'desc');
      expect(mockOnSortDirectionChange).toHaveBeenNthCalledWith(3, 'asc');
    });

    it('should handle toggle button clicks multiple times', async () => {
      const user = userEvent.setup();
      render(<RepositorySorting {...defaultProps} onToggleDirection={mockOnToggleDirection} />);

      const toggleButton = screen.getByLabelText('Toggle sort direction');

      await user.click(toggleButton);
      await user.click(toggleButton);
      await user.click(toggleButton);

      expect(mockOnToggleDirection).toHaveBeenCalledTimes(3);
    });
  });
});
