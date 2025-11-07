import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ContributionHistory } from './ContributionHistory';

const mockData = {
  contributions: {
    year1: { totalCommitContributions: 456 },
    year2: { totalCommitContributions: 723 },
    year3: { totalCommitContributions: 891 },
  },
  yearLabels: {
    year1: 2022,
    year2: 2023,
    year3: 2024,
  },
};

describe('ContributionHistory', () => {
  describe('Rendering', () => {
    it('should render title', () => {
      render(<ContributionHistory {...mockData} />);
      expect(screen.getByText('Contribution History')).toBeInTheDocument();
    });

    it('should render all 3 year labels', () => {
      render(<ContributionHistory {...mockData} />);
      expect(screen.getByText('2022')).toBeInTheDocument();
      expect(screen.getByText('2023')).toBeInTheDocument();
      expect(screen.getByText('2024')).toBeInTheDocument();
    });

    it('should render all commit counts', () => {
      render(<ContributionHistory {...mockData} />);
      expect(screen.getByText('456')).toBeInTheDocument();
      expect(screen.getByText('723')).toBeInTheDocument();
      expect(screen.getByText('891')).toBeInTheDocument();
    });

    it('should render "commits" label for each year', () => {
      render(<ContributionHistory {...mockData} />);
      const commitsLabels = screen.getAllByText('commits');
      expect(commitsLabels).toHaveLength(3);
    });

    it('should have responsive grid layout', () => {
      const { container } = render(<ContributionHistory {...mockData} />);
      const grid = container.querySelector('.grid.grid-cols-1');
      expect(grid).toHaveClass('grid-cols-1', 'md:grid-cols-3');
    });
  });

  describe('Number Formatting', () => {
    it('should format large numbers with commas', () => {
      const largeNumbers = {
        contributions: {
          year1: { totalCommitContributions: 12456 },
          year2: { totalCommitContributions: 15789 },
          year3: { totalCommitContributions: 18234 },
        },
        yearLabels: {
          year1: 2022,
          year2: 2023,
          year3: 2024,
        },
      };
      render(<ContributionHistory {...largeNumbers} />);
      expect(screen.getByText('12,456')).toBeInTheDocument();
      expect(screen.getByText('15,789')).toBeInTheDocument();
      expect(screen.getByText('18,234')).toBeInTheDocument();
    });
  });

  describe('Zero Values', () => {
    it('should handle zero commits', () => {
      const zeroData = {
        contributions: {
          year1: { totalCommitContributions: 0 },
          year2: { totalCommitContributions: 0 },
          year3: { totalCommitContributions: 0 },
        },
        yearLabels: {
          year1: 2022,
          year2: 2023,
          year3: 2024,
        },
      };
      render(<ContributionHistory {...zeroData} />);
      const zeroValues = screen.getAllByText('0');
      expect(zeroValues.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe('Styling', () => {
    it('should apply green color to commit counts', () => {
      const { container } = render(<ContributionHistory {...mockData} />);
      const commitCounts = container.querySelectorAll('.text-green-600');
      expect(commitCounts).toHaveLength(3);
    });

    it('should center text in year sections', () => {
      const { container } = render(<ContributionHistory {...mockData} />);
      const yearSections = container.querySelectorAll('.text-center');
      expect(yearSections.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe('Accessibility', () => {
    it('should have aria-hidden on decorative icon', () => {
      const { container } = render(<ContributionHistory {...mockData} />);
      const icon = container.querySelector('[aria-hidden="true"]');
      expect(icon).toBeInTheDocument();
    });

    it('should use semantic card structure', () => {
      const { container } = render(<ContributionHistory {...mockData} />);
      const card = container.querySelector('[data-slot="card"]');
      expect(card).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle single-digit commits', () => {
      const singleDigit = {
        contributions: {
          year1: { totalCommitContributions: 1 },
          year2: { totalCommitContributions: 5 },
          year3: { totalCommitContributions: 9 },
        },
        yearLabels: {
          year1: 2022,
          year2: 2023,
          year3: 2024,
        },
      };
      render(<ContributionHistory {...singleDigit} />);
      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('5')).toBeInTheDocument();
      expect(screen.getByText('9')).toBeInTheDocument();
    });

    it('should handle different year ranges', () => {
      const differentYears = {
        ...mockData,
        yearLabels: {
          year1: 2020,
          year2: 2021,
          year3: 2022,
        },
      };
      render(<ContributionHistory {...differentYears} />);
      expect(screen.getByText('2020')).toBeInTheDocument();
      expect(screen.getByText('2021')).toBeInTheDocument();
      expect(screen.getByText('2022')).toBeInTheDocument();
    });
  });
});
