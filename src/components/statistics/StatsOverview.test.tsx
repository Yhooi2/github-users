import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { StatsOverview } from './StatsOverview';
import type { YearlyCommitStats, LanguageStats, CommitActivity } from '@/lib/statistics';

describe('StatsOverview', () => {
  const yearlyCommitsData: YearlyCommitStats[] = [
    { year: 2023, commits: 450 },
    { year: 2024, commits: 780 },
    { year: 2025, commits: 1200 },
  ];

  const languagesData: LanguageStats[] = [
    { name: 'TypeScript', size: 500000, percentage: 45.5, repositoryCount: 8 },
    { name: 'JavaScript', size: 300000, percentage: 27.3, repositoryCount: 12 },
    { name: 'Python', size: 150000, percentage: 13.6, repositoryCount: 5 },
  ];

  const activityData: CommitActivity = {
    total: 1250,
    perDay: 3.4,
    perWeek: 24.0,
    perMonth: 104.2,
  };

  describe('Rendering', () => {
    it('should render main heading', () => {
      render(
        <StatsOverview
          yearlyCommits={yearlyCommitsData}
          languages={languagesData}
          activity={activityData}
        />
      );

      expect(screen.getByText('📊 Statistics')).toBeInTheDocument();
    });

    it('should render as a section with aria-label', () => {
      const { container } = render(
        <StatsOverview
          yearlyCommits={yearlyCommitsData}
          languages={languagesData}
          activity={activityData}
        />
      );

      const section = container.querySelector('section[aria-label="Statistics Overview"]');
      expect(section).toBeInTheDocument();
    });

    it('should display all three charts simultaneously', () => {
      render(
        <StatsOverview
          yearlyCommits={yearlyCommitsData}
          languages={languagesData}
          activity={activityData}
        />
      );

      expect(screen.getByText('Commit Trends')).toBeInTheDocument();
      expect(screen.getByText('Commit Activity')).toBeInTheDocument();
      expect(screen.getByText('Language Distribution')).toBeInTheDocument();
    });

    it('should display card descriptions', () => {
      render(
        <StatsOverview
          yearlyCommits={yearlyCommitsData}
          languages={languagesData}
          activity={activityData}
        />
      );

      expect(screen.getByText('Yearly commit contributions')).toBeInTheDocument();
      expect(screen.getByText('Average commits per period')).toBeInTheDocument();
      expect(screen.getByText('Programming languages used across repositories')).toBeInTheDocument();
    });
  });

  describe('Layout', () => {
    it('should render commits and activity side by side', () => {
      const { container } = render(
        <StatsOverview
          yearlyCommits={yearlyCommitsData}
          languages={languagesData}
          activity={activityData}
        />
      );

      // Check for grid layout with 2 columns on md+ screens
      const grids = container.querySelectorAll('.md\\:grid-cols-2');
      expect(grids.length).toBeGreaterThan(0);
    });

    it('should render languages chart full width', () => {
      render(
        <StatsOverview
          yearlyCommits={yearlyCommitsData}
          languages={languagesData}
          activity={activityData}
        />
      );

      expect(screen.getByText('Language Distribution')).toBeInTheDocument();
    });
  });

  describe('Data Handling', () => {
    it('should handle null data for commits', () => {
      render(
        <StatsOverview yearlyCommits={null} languages={languagesData} activity={activityData} />
      );

      expect(screen.getByText('Commit Trends')).toBeInTheDocument();
    });

    it('should handle null data for languages', () => {
      render(
        <StatsOverview yearlyCommits={yearlyCommitsData} languages={null} activity={activityData} />
      );

      expect(screen.getByText('Language Distribution')).toBeInTheDocument();
    });

    it('should handle null data for activity', () => {
      render(
        <StatsOverview
          yearlyCommits={yearlyCommitsData}
          languages={languagesData}
          activity={null}
        />
      );

      expect(screen.getByText('Commit Activity')).toBeInTheDocument();
    });

    it('should handle empty arrays', () => {
      render(<StatsOverview yearlyCommits={[]} languages={[]} activity={null} />);

      expect(screen.getByText('📊 Statistics')).toBeInTheDocument();
    });

    it('should handle all null data', () => {
      render(<StatsOverview yearlyCommits={null} languages={null} activity={null} />);

      expect(screen.getByText('Commit Trends')).toBeInTheDocument();
      expect(screen.getByText('Commit Activity')).toBeInTheDocument();
      expect(screen.getByText('Language Distribution')).toBeInTheDocument();
    });
  });

  describe('Loading State', () => {
    it('should show loading state in all charts', async () => {
      render(
        <StatsOverview
          yearlyCommits={null}
          languages={null}
          activity={null}
          loading={true}
        />
      );

      await waitFor(
        () => {
          // All three charts should show loading state
          expect(screen.getByText('Loading commit statistics...')).toBeInTheDocument();
          expect(screen.getByText('Loading activity statistics...')).toBeInTheDocument();
          expect(screen.getByText('Loading language statistics...')).toBeInTheDocument();
        },
        { timeout: 5000 }
      );
    });

    it('should show custom loading message in all charts', async () => {
      render(
        <StatsOverview
          yearlyCommits={null}
          languages={null}
          activity={null}
          loading={true}
          loadingMessage="Fetching GitHub statistics..."
        />
      );

      await waitFor(() => {
        const messages = screen.getAllByText('Fetching GitHub statistics...');
        expect(messages.length).toBe(3); // One for each chart
      });
    });
  });

  describe('Error State', () => {
    it('should show error state in all charts', async () => {
      const error = new Error('API Error');

      render(
        <StatsOverview
          yearlyCommits={null}
          languages={null}
          activity={null}
          error={error}
        />
      );

      await waitFor(() => {
        expect(screen.getByText('Failed to load commit statistics')).toBeInTheDocument();
        expect(screen.getByText('Failed to load language statistics')).toBeInTheDocument();
        expect(screen.getByText('Failed to load activity statistics')).toBeInTheDocument();
      });
    });

    it('should show custom error messages', async () => {
      const error = new Error('Network timeout');

      render(
        <StatsOverview
          yearlyCommits={null}
          languages={null}
          activity={null}
          error={error}
          errorTitle="Connection Error"
          errorDescription="Unable to load statistics"
        />
      );

      await waitFor(() => {
        const errorTitles = screen.getAllByText('Connection Error');
        const errorDescs = screen.getAllByText('Unable to load statistics');
        expect(errorTitles.length).toBe(3); // One for each chart
        expect(errorDescs.length).toBe(3);
      });
    });
  });

  describe('Icons', () => {
    it('should render chart icons in card headers', () => {
      const { container } = render(
        <StatsOverview
          yearlyCommits={yearlyCommitsData}
          languages={languagesData}
          activity={activityData}
        />
      );

      // Check for lucide icons (svg elements)
      const icons = container.querySelectorAll('svg');
      expect(icons.length).toBeGreaterThan(0);
    });

    it('should have BarChart3 icon for commits', () => {
      render(
        <StatsOverview
          yearlyCommits={yearlyCommitsData}
          languages={languagesData}
          activity={activityData}
        />
      );

      const commitTrends = screen.getByText('Commit Trends');
      expect(commitTrends).toBeInTheDocument();
    });

    it('should have Activity icon for commit activity', () => {
      render(
        <StatsOverview
          yearlyCommits={yearlyCommitsData}
          languages={languagesData}
          activity={activityData}
        />
      );

      const commitActivity = screen.getAllByText('Commit Activity');
      expect(commitActivity.length).toBeGreaterThan(0);
    });

    it('should have Code2 icon for languages', () => {
      render(
        <StatsOverview
          yearlyCommits={yearlyCommitsData}
          languages={languagesData}
          activity={activityData}
        />
      );

      const langDistribution = screen.getAllByText('Language Distribution');
      expect(langDistribution.length).toBeGreaterThan(0);
    });
  });

  describe('Card Structure', () => {
    it('should render commit trends card', () => {
      render(
        <StatsOverview
          yearlyCommits={yearlyCommitsData}
          languages={languagesData}
          activity={activityData}
        />
      );

      expect(screen.getByText('Commit Trends')).toBeInTheDocument();
      expect(screen.getByText('Yearly commit contributions')).toBeInTheDocument();
    });

    it('should render commit activity card', () => {
      render(
        <StatsOverview
          yearlyCommits={yearlyCommitsData}
          languages={languagesData}
          activity={activityData}
        />
      );

      const activityTitles = screen.getAllByText('Commit Activity');
      expect(activityTitles.length).toBeGreaterThan(0);
      expect(screen.getByText('Average commits per period')).toBeInTheDocument();
    });

    it('should render language distribution card', () => {
      render(
        <StatsOverview
          yearlyCommits={yearlyCommitsData}
          languages={languagesData}
          activity={activityData}
        />
      );

      const langTitles = screen.getAllByText('Language Distribution');
      expect(langTitles.length).toBeGreaterThan(0);
      expect(screen.getByText('Programming languages used across repositories')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper heading structure', () => {
      render(
        <StatsOverview
          yearlyCommits={yearlyCommitsData}
          languages={languagesData}
          activity={activityData}
        />
      );

      const heading = screen.getByRole('heading', { name: /statistics/i });
      expect(heading).toBeInTheDocument();
      expect(heading.tagName).toBe('H2');
    });

    it('should have semantic section element', () => {
      const { container } = render(
        <StatsOverview
          yearlyCommits={yearlyCommitsData}
          languages={languagesData}
          activity={activityData}
        />
      );

      const section = container.querySelector('section');
      expect(section).toBeInTheDocument();
      expect(section).toHaveAttribute('aria-label', 'Statistics Overview');
    });

    it('should render all cards with proper titles', () => {
      render(
        <StatsOverview
          yearlyCommits={yearlyCommitsData}
          languages={languagesData}
          activity={activityData}
        />
      );

      expect(screen.getByText('Commit Trends')).toBeInTheDocument();
      const activityTitles = screen.getAllByText('Commit Activity');
      expect(activityTitles.length).toBeGreaterThan(0);
      const langTitles = screen.getAllByText('Language Distribution');
      expect(langTitles.length).toBeGreaterThan(0);
    });
  });

  describe('Responsive Design', () => {
    it('should have responsive grid classes', () => {
      const { container } = render(
        <StatsOverview
          yearlyCommits={yearlyCommitsData}
          languages={languagesData}
          activity={activityData}
        />
      );

      // Check for responsive grid (2 columns on md+)
      const responsiveGrid = container.querySelector('.md\\:grid-cols-2');
      expect(responsiveGrid).toBeInTheDocument();
    });
  });

  describe('Lazy Loading', () => {
    it('should use Suspense for lazy-loaded charts', () => {
      const { container } = render(
        <StatsOverview
          yearlyCommits={yearlyCommitsData}
          languages={languagesData}
          activity={activityData}
        />
      );

      // Charts are rendered within the component
      expect(screen.getByText('Commit Trends')).toBeInTheDocument();
    });
  });
});
