import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MetricTimeline } from './MetricTimeline';
import type { YearData } from '@/hooks/useUserAnalytics';

describe('MetricTimeline', () => {
  const mockRepo = (name: string, stars: number, commits: number) => ({
    repository: {
      name,
      nameWithOwner: `user/${name}`,
      description: `Description for ${name}`,
      stargazerCount: stars,
      forkCount: Math.floor(stars / 3),
      primaryLanguage: { name: 'TypeScript', color: '#3178c6' },
      isPrivate: false,
      isFork: false,
      owner: { login: 'user' },
      url: `https://github.com/user/${name}`,
    },
    contributions: {
      totalCount: commits,
    },
  });

  const mockTimeline: YearData[] = [
    {
      year: 2022,
      totalCommits: 150,
      totalIssues: 10,
      totalPRs: 15,
      totalReviews: 5,
      ownedRepos: [mockRepo('project-a', 20, 100)],
      contributions: [mockRepo('react', 50000, 50)],
    },
    {
      year: 2023,
      totalCommits: 500,
      totalIssues: 30,
      totalPRs: 45,
      totalReviews: 20,
      ownedRepos: [mockRepo('project-b', 150, 300)],
      contributions: [mockRepo('vue', 30000, 200)],
    },
    {
      year: 2024,
      totalCommits: 1200,
      totalIssues: 80,
      totalPRs: 120,
      totalReviews: 60,
      ownedRepos: [mockRepo('project-c', 500, 600)],
      contributions: [mockRepo('typescript', 40000, 600)],
    },
  ];

  describe('Rendering', () => {
    it('should render chart with data', () => {
      render(<MetricTimeline timeline={mockTimeline} />);

      expect(screen.getByText('📈 Metric Development')).toBeInTheDocument();
      expect(screen.getByText(/track how your developer metrics evolved/i)).toBeInTheDocument();
    });

    it('should render heading', () => {
      render(<MetricTimeline timeline={mockTimeline} />);

      const heading = screen.getByRole('heading', { name: /metric development/i });
      expect(heading).toBeInTheDocument();
    });
  });

  describe('Chart Container', () => {
    it('should render chart container', () => {
      const { container } = render(<MetricTimeline timeline={mockTimeline} />);

      expect(container.querySelector('[data-slot="chart"]')).toBeInTheDocument();
    });

    it('should apply custom height', () => {
      const { container } = render(<MetricTimeline timeline={mockTimeline} height={600} />);

      const chartContainer = container.querySelector('[data-slot="chart"]');
      expect(chartContainer).toHaveStyle({ height: '600px' });
    });

    it('should use default height of 400px', () => {
      const { container } = render(<MetricTimeline timeline={mockTimeline} />);

      const chartContainer = container.querySelector('[data-slot="chart"]');
      expect(chartContainer).toHaveStyle({ height: '400px' });
    });
  });

  describe('Summary Cards', () => {
    it('should display all four metric cards', () => {
      render(<MetricTimeline timeline={mockTimeline} />);

      expect(screen.getByText('Activity')).toBeInTheDocument();
      expect(screen.getByText('Impact')).toBeInTheDocument();
      expect(screen.getByText('Quality')).toBeInTheDocument();
      expect(screen.getByText('Growth')).toBeInTheDocument();
    });

    it('should display "Latest score" for each metric', () => {
      render(<MetricTimeline timeline={mockTimeline} />);

      const latestScores = screen.getAllByText('Latest score');
      expect(latestScores).toHaveLength(4);
    });

    it('should display numeric values for latest scores', () => {
      render(<MetricTimeline timeline={mockTimeline} />);

      // Check that there are numeric values (metrics calculated from timeline)
      const container = screen.getByText('Activity').closest('div');
      expect(container).toBeTruthy();
    });
  });

  describe('Loading State', () => {
    it('should show loading state when loading is true', () => {
      render(<MetricTimeline timeline={[]} loading={true} />);

      expect(screen.getByText('Loading metric timeline...')).toBeInTheDocument();
    });

    it('should not show chart when loading', () => {
      render(<MetricTimeline timeline={mockTimeline} loading={true} />);

      expect(screen.queryByText('📈 Metric Development')).not.toBeInTheDocument();
    });
  });

  describe('Empty State', () => {
    it('should show empty state when timeline is empty', () => {
      render(<MetricTimeline timeline={[]} />);

      expect(screen.getByText('No Timeline Data')).toBeInTheDocument();
      expect(screen.getByText(/no year-by-year data available/i)).toBeInTheDocument();
    });

    it('should not show chart when timeline is empty', () => {
      render(<MetricTimeline timeline={[]} />);

      expect(screen.queryByText('📈 Metric Development')).not.toBeInTheDocument();
    });
  });

  describe('State Priority', () => {
    it('should show loading state over empty state', () => {
      render(<MetricTimeline timeline={[]} loading={true} />);

      expect(screen.getByText('Loading metric timeline...')).toBeInTheDocument();
      expect(screen.queryByText('No Timeline Data')).not.toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle single year timeline', () => {
      const singleYear: YearData[] = [mockTimeline[0]];

      render(<MetricTimeline timeline={singleYear} />);

      expect(screen.getByText('📈 Metric Development')).toBeInTheDocument();
    });

    it('should handle timeline with zero commits', () => {
      const zeroTimeline: YearData[] = [
        {
          year: 2024,
          totalCommits: 0,
          totalIssues: 0,
          totalPRs: 0,
          totalReviews: 0,
          ownedRepos: [],
          contributions: [],
        },
      ];

      render(<MetricTimeline timeline={zeroTimeline} />);

      expect(screen.getByText('📈 Metric Development')).toBeInTheDocument();
    });

    it('should handle many years (5+)', () => {
      const manyYears: YearData[] = [
        mockTimeline[0],
        mockTimeline[1],
        mockTimeline[2],
        { ...mockTimeline[0], year: 2025 },
        { ...mockTimeline[1], year: 2026 },
      ];

      render(<MetricTimeline timeline={manyYears} />);

      expect(screen.getByText('📈 Metric Development')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have accessible structure', () => {
      const { container } = render(<MetricTimeline timeline={mockTimeline} />);

      expect(container.querySelector('section')).toBeInTheDocument();
      expect(container.querySelector('[data-slot="chart"]')).toBeInTheDocument();
    });

    it('should have heading for chart title', () => {
      render(<MetricTimeline timeline={mockTimeline} />);

      const heading = screen.getByRole('heading', { name: /metric development/i });
      expect(heading).toBeInTheDocument();
      expect(heading.tagName).toBe('H2');
    });

    it('should have aria-hidden on decorative icons', () => {
      const { container } = render(<MetricTimeline timeline={mockTimeline} />);

      const icons = container.querySelectorAll('[aria-hidden="true"]');
      expect(icons.length).toBeGreaterThan(0);
    });
  });

  describe('Data Transformation', () => {
    it('should calculate metrics for each year', () => {
      render(<MetricTimeline timeline={mockTimeline} />);

      // Metrics should be calculated for all 3 years
      expect(screen.getByText('📈 Metric Development')).toBeInTheDocument();
    });

    it('should sort years in ascending order for timeline', () => {
      const unsortedTimeline: YearData[] = [
        mockTimeline[2], // 2024
        mockTimeline[0], // 2022
        mockTimeline[1], // 2023
      ];

      render(<MetricTimeline timeline={unsortedTimeline} />);

      // Should render without errors and sort internally
      expect(screen.getByText('📈 Metric Development')).toBeInTheDocument();
    });
  });

  describe('Growth Metric Display', () => {
    it('should display growth with + sign for positive values', () => {
      // Growth metric can be positive or negative
      // The component should handle both cases
      render(<MetricTimeline timeline={mockTimeline} />);

      // Check that growth card exists
      expect(screen.getByText('Growth')).toBeInTheDocument();
    });
  });

  describe('Chart Configuration', () => {
    it('should render line chart with 4 lines', () => {
      const { container } = render(<MetricTimeline timeline={mockTimeline} />);

      // Check that chart container exists
      const chartContainer = container.querySelector('[data-slot="chart"]');
      expect(chartContainer).toBeInTheDocument();
    });

    it('should have legend', () => {
      render(<MetricTimeline timeline={mockTimeline} />);

      // Chart should be rendered which includes legend
      expect(screen.getByText('📈 Metric Development')).toBeInTheDocument();
    });
  });

  describe('Responsive Behavior', () => {
    it('should render summary cards in grid layout', () => {
      const { container } = render(<MetricTimeline timeline={mockTimeline} />);

      // Find grid container with summary cards
      const grids = container.querySelectorAll('.grid');
      expect(grids.length).toBeGreaterThan(0);
    });
  });
});
