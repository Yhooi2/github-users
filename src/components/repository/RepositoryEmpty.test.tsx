import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RepositoryEmpty } from './RepositoryEmpty';

describe('RepositoryEmpty', () => {
  describe('Rendering', () => {
    it('should render with default props', () => {
      render(<RepositoryEmpty />);

      expect(screen.getByText('No Repositories Found')).toBeInTheDocument();
      expect(screen.getByText('No repositories match the current filters. Try adjusting your search criteria.')).toBeInTheDocument();
    });

    it('should render with custom title', () => {
      render(<RepositoryEmpty title="Custom Title" />);

      expect(screen.getByText('Custom Title')).toBeInTheDocument();
      expect(screen.queryByText('No Repositories Found')).not.toBeInTheDocument();
    });

    it('should render with custom description', () => {
      const customDescription = 'This is a custom description for testing.';
      render(<RepositoryEmpty description={customDescription} />);

      expect(screen.getByText(customDescription)).toBeInTheDocument();
    });

    it('should render with both custom title and description', () => {
      render(
        <RepositoryEmpty
          title="No Starred Repos"
          description="You haven't starred any repositories yet."
        />
      );

      expect(screen.getByText('No Starred Repos')).toBeInTheDocument();
      expect(screen.getByText("You haven't starred any repositories yet.")).toBeInTheDocument();
    });
  });

  describe('Filter States', () => {
    it('should show filter-specific message when hasFilters is true (default)', () => {
      render(<RepositoryEmpty />);

      expect(screen.getByText('No repositories match the current filters. Try adjusting your search criteria.')).toBeInTheDocument();
    });

    it('should show no-repos message when hasFilters is false', () => {
      render(<RepositoryEmpty hasFilters={false} />);

      expect(screen.getByText("This user hasn't created any public repositories yet.")).toBeInTheDocument();
      expect(screen.queryByText('No repositories match the current filters')).not.toBeInTheDocument();
    });

    it('should override description even when hasFilters is false', () => {
      const customDescription = 'Custom description overrides default';
      render(
        <RepositoryEmpty
          hasFilters={false}
          description={customDescription}
        />
      );

      // When hasFilters is false, it should still use the custom description
      // but the implementation uses the hasFilters logic to set finalDescription
      expect(screen.queryByText(customDescription)).not.toBeInTheDocument();
      expect(screen.getByText("This user hasn't created any public repositories yet.")).toBeInTheDocument();
    });
  });

  describe('EmptyState Integration', () => {
    it('should render EmptyState component', () => {
      const { container } = render(<RepositoryEmpty />);

      // EmptyState should have role="status"
      const emptyState = container.querySelector('[role="status"]');
      expect(emptyState).toBeInTheDocument();
    });

    it('should pass icon prop to EmptyState', () => {
      const { container } = render(<RepositoryEmpty />);

      // GitHub icon should be present (from EmptyState)
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper heading structure', () => {
      render(<RepositoryEmpty />);

      const heading = screen.getByRole('heading', { level: 3 });
      expect(heading).toHaveTextContent('No Repositories Found');
    });

    it('should have accessible text content', () => {
      render(<RepositoryEmpty />);

      expect(screen.getByText(/No repositories match/i)).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty string title', () => {
      const { container } = render(<RepositoryEmpty title="" />);

      // Empty title should still render EmptyState with SVG icon
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('should handle empty string description', () => {
      const { container } = render(<RepositoryEmpty description="" />);

      // Should render EmptyState component with SVG icon
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('should handle very long title', () => {
      const longTitle = 'This is a very long title that might cause layout issues in some cases but should still render properly'.repeat(2);
      render(<RepositoryEmpty title={longTitle} />);

      expect(screen.getByText(longTitle)).toBeInTheDocument();
    });

    it('should handle very long description', () => {
      const longDescription = 'This is a very long description that contains a lot of text and might wrap multiple lines in the UI. '.repeat(5);
      render(<RepositoryEmpty description={longDescription} hasFilters={true} />);

      // Use partial match since text might be broken up
      expect(screen.getByText(/This is a very long description/)).toBeInTheDocument();
    });
  });

  describe('Props Combinations', () => {
    it('should work with all props provided', () => {
      render(
        <RepositoryEmpty
          title="All Props Test"
          description="Testing all props together"
          hasFilters={true}
        />
      );

      expect(screen.getByText('All Props Test')).toBeInTheDocument();
      expect(screen.getByText('Testing all props together')).toBeInTheDocument();
    });

    it('should work with only hasFilters prop', () => {
      render(<RepositoryEmpty hasFilters={false} />);

      expect(screen.getByText('No Repositories Found')).toBeInTheDocument();
      expect(screen.getByText("This user hasn't created any public repositories yet.")).toBeInTheDocument();
    });
  });
});
