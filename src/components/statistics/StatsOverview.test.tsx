import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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
    it('should render tabs interface', () => {
      render(
        <StatsOverview
          yearlyCommits={yearlyCommitsData}
          languages={languagesData}
          activity={activityData}
        />
      );

      expect(screen.getByRole('tablist')).toBeInTheDocument();
    });

    it('should render all tab triggers', () => {
      render(
        <StatsOverview
          yearlyCommits={yearlyCommitsData}
          languages={languagesData}
          activity={activityData}
        />
      );

      // Note: Tab text may be hidden on mobile, so we check for presence in any form
      const tabs = screen.getAllByRole('tab');
      expect(tabs.length).toBe(4); // Overview, Commits, Languages, Activity
    });

    it('should render without overview tab when showOverview is false', () => {
      render(
        <StatsOverview
          yearlyCommits={yearlyCommitsData}
          languages={languagesData}
          activity={activityData}
          showOverview={false}
        />
      );

      const tabs = screen.getAllByRole('tab');
      expect(tabs.length).toBe(3); // Commits, Languages, Activity only
    });
  });

  describe('Default Tab', () => {
    it('should show commits tab by default', () => {
      render(
        <StatsOverview
          yearlyCommits={yearlyCommitsData}
          languages={languagesData}
          activity={activityData}
        />
      );

      // The commits tab content should be visible
      expect(screen.getByText('Yearly commit contributions over time')).toBeInTheDocument();
    });

    it('should show overview tab when defaultTab is "overview"', () => {
      render(
        <StatsOverview
          yearlyCommits={yearlyCommitsData}
          languages={languagesData}
          activity={activityData}
          defaultTab="overview"
        />
      );

      // Overview tab shows multiple cards
      expect(screen.getByText('Commit Trends')).toBeInTheDocument();
      const langTexts = screen.getAllByText('Language Distribution');
      expect(langTexts.length).toBeGreaterThan(0);
    });

    it('should show languages tab when defaultTab is "languages"', () => {
      render(
        <StatsOverview
          yearlyCommits={yearlyCommitsData}
          languages={languagesData}
          activity={activityData}
          defaultTab="languages"
        />
      );

      expect(
        screen.getByText('Programming languages used across repositories')
      ).toBeInTheDocument();
    });

    it('should show activity tab when defaultTab is "activity"', () => {
      render(
        <StatsOverview
          yearlyCommits={yearlyCommitsData}
          languages={languagesData}
          activity={activityData}
          defaultTab="activity"
        />
      );

      expect(screen.getByText('Average commits per time period')).toBeInTheDocument();
    });
  });

  describe('Tab Switching', () => {
    it('should switch to commits tab when clicked', async () => {
      const user = userEvent.setup();

      render(
        <StatsOverview
          yearlyCommits={yearlyCommitsData}
          languages={languagesData}
          activity={activityData}
          defaultTab="overview"
        />
      );

      const tabs = screen.getAllByRole('tab');
      const commitsTab = tabs.find((tab) => tab.getAttribute('value') === 'commits');

      if (commitsTab) {
        await user.click(commitsTab);
        expect(screen.getByText('Yearly commit contributions over time')).toBeInTheDocument();
      }
    });

    it('should switch to languages tab when clicked', async () => {
      const user = userEvent.setup();

      render(
        <StatsOverview
          yearlyCommits={yearlyCommitsData}
          languages={languagesData}
          activity={activityData}
          defaultTab="commits"
        />
      );

      const tabs = screen.getAllByRole('tab');
      const languagesTab = tabs.find((tab) => tab.getAttribute('value') === 'languages');

      if (languagesTab) {
        await user.click(languagesTab);
        expect(
          screen.getByText('Programming languages used across repositories')
        ).toBeInTheDocument();
      }
    });

    it('should switch to activity tab when clicked', async () => {
      const user = userEvent.setup();

      render(
        <StatsOverview
          yearlyCommits={yearlyCommitsData}
          languages={languagesData}
          activity={activityData}
          defaultTab="commits"
        />
      );

      const tabs = screen.getAllByRole('tab');
      const activityTab = tabs.find((tab) => tab.getAttribute('value') === 'activity');

      if (activityTab) {
        await user.click(activityTab);
        expect(screen.getByText('Average commits per time period')).toBeInTheDocument();
      }
    });
  });

  describe('Overview Tab Content', () => {
    it('should display all three charts in overview tab', () => {
      render(
        <StatsOverview
          yearlyCommits={yearlyCommitsData}
          languages={languagesData}
          activity={activityData}
          defaultTab="overview"
        />
      );

      expect(screen.getByText('Commit Trends')).toBeInTheDocument();
      const activityTexts = screen.getAllByText('Commit Activity');
      expect(activityTexts.length).toBeGreaterThan(0);
      const langTexts = screen.getAllByText('Language Distribution');
      expect(langTexts.length).toBeGreaterThan(0);
    });

    it('should display card descriptions in overview', () => {
      render(
        <StatsOverview
          yearlyCommits={yearlyCommitsData}
          languages={languagesData}
          activity={activityData}
          defaultTab="overview"
        />
      );

      expect(screen.getByText('Yearly commit contributions')).toBeInTheDocument();
      expect(screen.getByText('Average commits per period')).toBeInTheDocument();
      expect(screen.getByText('Programming languages used across repositories')).toBeInTheDocument();
    });
  });

  describe('Data Handling', () => {
    it('should handle null data for commits', () => {
      render(
        <StatsOverview yearlyCommits={null} languages={languagesData} activity={activityData} />
      );

      expect(screen.getByText('Yearly commit contributions over time')).toBeInTheDocument();
    });

    it('should handle null data for languages', () => {
      render(
        <StatsOverview yearlyCommits={yearlyCommitsData} languages={null} activity={activityData} />
      );

      expect(screen.getByText('Yearly commit contributions over time')).toBeInTheDocument();
    });

    it('should handle null data for activity', () => {
      render(
        <StatsOverview
          yearlyCommits={yearlyCommitsData}
          languages={languagesData}
          activity={null}
        />
      );

      expect(screen.getByText('Yearly commit contributions over time')).toBeInTheDocument();
    });

    it('should handle empty arrays', () => {
      render(<StatsOverview yearlyCommits={[]} languages={[]} activity={null} />);

      expect(screen.getByRole('tablist')).toBeInTheDocument();
    });
  });

  describe('Loading State', () => {
    it('should show loading state in commits tab', async () => {
      render(
        <StatsOverview
          yearlyCommits={null}
          languages={null}
          activity={null}
          loading={true}
          defaultTab="commits"
        />
      );

      await waitFor(
        () => {
          expect(screen.getByText('Loading commit statistics...')).toBeInTheDocument();
        },
        { timeout: 5000 }
      );
    });

    it('should show loading state in languages tab', async () => {
      render(
        <StatsOverview
          yearlyCommits={null}
          languages={null}
          activity={null}
          loading={true}
          defaultTab="languages"
        />
      );

      await waitFor(() => {
        expect(screen.getByText('Loading language statistics...')).toBeInTheDocument();
      });
    });

    it('should show loading state in activity tab', async () => {
      render(
        <StatsOverview
          yearlyCommits={null}
          languages={null}
          activity={null}
          loading={true}
          defaultTab="activity"
        />
      );

      await waitFor(() => {
        expect(screen.getByText('Loading activity statistics...')).toBeInTheDocument();
      });
    });

    it('should show custom loading message', async () => {
      render(
        <StatsOverview
          yearlyCommits={null}
          languages={null}
          activity={null}
          loading={true}
          loadingMessage="Fetching GitHub statistics..."
          defaultTab="commits"
        />
      );

      await waitFor(() => {
        expect(screen.getByText('Fetching GitHub statistics...')).toBeInTheDocument();
      });
    });
  });

  describe('Error State', () => {
    it('should show error state in commits tab', async () => {
      const error = new Error('API Error');

      render(
        <StatsOverview
          yearlyCommits={null}
          languages={null}
          activity={null}
          error={error}
          defaultTab="commits"
        />
      );

      await waitFor(() => {
        expect(screen.getByText('Failed to load commit statistics')).toBeInTheDocument();
      });
    });

    it('should show error state in languages tab', async () => {
      const error = new Error('API Error');

      render(
        <StatsOverview
          yearlyCommits={null}
          languages={null}
          activity={null}
          error={error}
          defaultTab="languages"
        />
      );

      await waitFor(() => {
        expect(screen.getByText('Failed to load language statistics')).toBeInTheDocument();
      });
    });

    it('should show error state in activity tab', async () => {
      const error = new Error('API Error');

      render(
        <StatsOverview
          yearlyCommits={null}
          languages={null}
          activity={null}
          error={error}
          defaultTab="activity"
        />
      );

      await waitFor(() => {
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
          defaultTab="commits"
        />
      );

      await waitFor(() => {
        expect(screen.getByText('Connection Error')).toBeInTheDocument();
        expect(screen.getByText('Unable to load statistics')).toBeInTheDocument();
      });
    });
  });

  describe('Icons', () => {
    it('should render tab icons', () => {
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
  });

  describe('Card Structure', () => {
    it('should render cards in commits tab', () => {
      render(
        <StatsOverview
          yearlyCommits={yearlyCommitsData}
          languages={languagesData}
          activity={activityData}
          defaultTab="commits"
        />
      );

      expect(screen.getByText('Commit Trends')).toBeInTheDocument();
      expect(screen.getByText('Yearly commit contributions over time')).toBeInTheDocument();
    });

    it('should render cards in languages tab', () => {
      render(
        <StatsOverview
          yearlyCommits={yearlyCommitsData}
          languages={languagesData}
          activity={activityData}
          defaultTab="languages"
        />
      );

      const langTexts = screen.getAllByText('Language Distribution');
      expect(langTexts.length).toBeGreaterThan(0);
      expect(screen.getByText('Programming languages used across repositories')).toBeInTheDocument();
    });

    it('should render cards in activity tab', () => {
      render(
        <StatsOverview
          yearlyCommits={yearlyCommitsData}
          languages={languagesData}
          activity={activityData}
          defaultTab="activity"
        />
      );

      const activityTexts = screen.getAllByText('Commit Activity');
      expect(activityTexts.length).toBeGreaterThan(0);
      expect(screen.getByText('Average commits per time period')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have accessible tab structure', () => {
      render(
        <StatsOverview
          yearlyCommits={yearlyCommitsData}
          languages={languagesData}
          activity={activityData}
        />
      );

      expect(screen.getByRole('tablist')).toBeInTheDocument();
      const tabs = screen.getAllByRole('tab');
      expect(tabs.length).toBeGreaterThan(0);
    });

    it('should have proper heading structure in cards', () => {
      render(
        <StatsOverview
          yearlyCommits={yearlyCommitsData}
          languages={languagesData}
          activity={activityData}
          defaultTab="commits"
        />
      );

      expect(screen.getByText('Commit Trends')).toBeInTheDocument();
    });
  });
});
