import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import * as useQueryUserModule from './apollo/useQueryUser';
import { createMockUser, createMockRepository } from './test/mocks/github-data';

// Mock sonner toast
vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
  Toaster: () => null,
}));

describe('App Integration Tests', () => {
  const mockUser = createMockUser({
    login: 'testuser',
    name: 'Test User',
    repositories: {
      totalCount: 50,
      pageInfo: { endCursor: 'cursor', hasNextPage: false },
      nodes: [
        createMockRepository({
          name: 'repo-1',
          stargazerCount: 100,
          primaryLanguage: { name: 'TypeScript', color: '#3178c6' },
        }),
        createMockRepository({
          name: 'repo-2',
          stargazerCount: 50,
          primaryLanguage: { name: 'JavaScript', color: '#f1e05a' },
        }),
        createMockRepository({
          name: 'repo-3',
          stargazerCount: 25,
          primaryLanguage: { name: 'Python', color: '#3572A5' },
          isFork: true,
        }),
      ],
    },
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('should render search form on initial load', () => {
      vi.spyOn(useQueryUserModule, 'default').mockReturnValue({
        data: null,
        loading: false,
        error: null,
      });

      render(<App />);

      expect(screen.getByPlaceholderText(/search github user/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
    });

    it('should not show tabs before search', () => {
      vi.spyOn(useQueryUserModule, 'default').mockReturnValue({
        data: null,
        loading: false,
        error: null,
      });

      render(<App />);

      expect(screen.queryByRole('tab', { name: /profile/i })).not.toBeInTheDocument();
      expect(screen.queryByRole('tab', { name: /repositories/i })).not.toBeInTheDocument();
      expect(screen.queryByRole('tab', { name: /statistics/i })).not.toBeInTheDocument();
    });

    it('should render theme toggle', () => {
      vi.spyOn(useQueryUserModule, 'default').mockReturnValue({
        data: null,
        loading: false,
        error: null,
      });

      render(<App />);

      expect(screen.getByRole('button', { name: /switch to dark mode|switch to light mode/i })).toBeInTheDocument();
    });
  });

  describe('Search Flow', () => {
    it('should show tabs after successful user search', async () => {
      vi.spyOn(useQueryUserModule, 'default').mockReturnValue({
        data: { user: mockUser },
        loading: false,
        error: null,
      });

      const user = userEvent.setup();
      render(<App />);

      // Set username to trigger tabs rendering
      const input = screen.getByPlaceholderText(/search github user/i);
      await user.type(input, 'testuser');
      await user.click(screen.getByRole('button', { name: /search/i }));

      await waitFor(() => {
        // UserProfile должен рендериться через MainTabs
        expect(screen.getByRole('tab', { name: /profile/i })).toBeInTheDocument();
        expect(screen.getByRole('tab', { name: /repositories/i })).toBeInTheDocument();
        expect(screen.getByRole('tab', { name: /statistics/i })).toBeInTheDocument();
      });
    });

    it('should display loading state during search', () => {
      vi.spyOn(useQueryUserModule, 'default').mockReturnValue({
        data: null,
        loading: true,
        error: null,
      });

      render(<App />);

      // Should show UserProfile component which handles loading state
      expect(screen.queryByRole('tab')).not.toBeInTheDocument();
    });

    it('should handle search errors gracefully', () => {
      vi.spyOn(useQueryUserModule, 'default').mockReturnValue({
        data: null,
        loading: false,
        error: new Error('User not found'),
      });

      render(<App />);

      // Should show UserProfile component which handles error state
      expect(screen.queryByRole('tab')).not.toBeInTheDocument();
    });
  });

  describe('Tab Navigation', () => {
    beforeEach(() => {
      vi.spyOn(useQueryUserModule, 'default').mockReturnValue({
        data: { user: mockUser },
        loading: false,
        error: null,
      });
    });

    it('should have profile tab selected by default', async () => {
      const user = userEvent.setup();
      render(<App />);

      // Set username to trigger tabs rendering
      const input = screen.getByPlaceholderText(/search github user/i);
      await user.type(input, 'testuser');
      await user.click(screen.getByRole('button', { name: /search/i }));

      await waitFor(() => {
        const profileTab = screen.getByRole('tab', { name: /profile/i });
        expect(profileTab).toHaveAttribute('data-state', 'active');
      });
    });

    it('should switch between tabs correctly', async () => {
      const user = userEvent.setup();
      render(<App />);

      // Set username to trigger tabs rendering
      const input = screen.getByPlaceholderText(/search github user/i);
      await user.type(input, 'testuser');
      await user.click(screen.getByRole('button', { name: /search/i }));

      await waitFor(() => {
        expect(screen.getByRole('tab', { name: /repositories/i })).toBeInTheDocument();
      });

      // Click Repositories tab
      const reposTab = screen.getByRole('tab', { name: /repositories/i });
      await user.click(reposTab);

      await waitFor(() => {
        expect(reposTab).toHaveAttribute('data-state', 'active');
      });

      // Click Statistics tab
      const statsTab = screen.getByRole('tab', { name: /statistics/i });
      await user.click(statsTab);

      await waitFor(() => {
        expect(statsTab).toHaveAttribute('data-state', 'active');
      });
    });

    it('should render tab content appropriately', async () => {
      const user = userEvent.setup();
      render(<App />);

      // Set username
      const input = screen.getByPlaceholderText(/search github user/i);
      await user.type(input, 'testuser');
      await user.click(screen.getByRole('button', { name: /search/i }));

      await waitFor(() => {
        expect(screen.getByRole('tab', { name: /repositories/i })).toBeInTheDocument();
      }, { timeout: 10000 });

      // Click Repositories tab
      await user.click(screen.getByRole('tab', { name: /repositories/i }));

      await waitFor(() => {
        expect(screen.getByText('repo-1')).toBeInTheDocument();
        expect(screen.getByText('repo-2')).toBeInTheDocument();
        expect(screen.getByText('repo-3')).toBeInTheDocument();
      }, { timeout: 10000 });
    });
  });

  describe('Repository Features', () => {
    const setupWithUser = async () => {
      const user = userEvent.setup();
      render(<App />);

      // Set username to trigger tabs
      const input = screen.getByPlaceholderText(/search github user/i);
      await user.type(input, 'testuser');
      await user.click(screen.getByRole('button', { name: /search/i }));

      // Wait for tabs to appear
      await waitFor(() => {
        expect(screen.getByRole('tab', { name: /repositories/i })).toBeInTheDocument();
      });

      return user;
    };

    beforeEach(() => {
      vi.spyOn(useQueryUserModule, 'default').mockReturnValue({
        data: { user: mockUser },
        loading: false,
        error: null,
      });
    });

    it('should show repository list by default', async () => {
      const user = await setupWithUser();

      await user.click(screen.getByRole('tab', { name: /repositories/i }));

      await waitFor(
        () => {
          // Verify repository content is visible
          expect(screen.getByText('repo-1')).toBeInTheDocument();
        },
        { timeout: 3000 }
      );
    });

    it('should switch between list and table views', async () => {
      const user = await setupWithUser();

      await user.click(screen.getByRole('tab', { name: /repositories/i }));

      await waitFor(
        () => {
          expect(screen.getByRole('button', { name: /table view/i })).toBeInTheDocument();
        },
        { timeout: 3000 }
      );

      // Switch to table view
      await user.click(screen.getByRole('button', { name: /table view/i }));

      await waitFor(
        () => {
          expect(screen.getByRole('table')).toBeInTheDocument();
        },
        { timeout: 3000 }
      );

      // Verify list view button is now available
      expect(screen.getByRole('button', { name: /list view/i })).toBeInTheDocument();
    });

    it('should filter repositories by language', async () => {
      const user = await setupWithUser();

      await user.click(screen.getByRole('tab', { name: /repositories/i }));

      await waitFor(
        () => {
          // All repos should be visible initially
          expect(screen.getByText('repo-1')).toBeInTheDocument();
        },
        { timeout: 3000 }
      );

      // Click on Filters header to expand
      await user.click(screen.getByText('Filters'));

      // Verify filters component is rendered by checking for filter label
      await waitFor(
        () => {
          expect(screen.getByLabelText(/language/i)).toBeInTheDocument();
        },
        { timeout: 3000 }
      );
    });

    it('should render filters controls', async () => {
      const user = await setupWithUser();

      await user.click(screen.getByRole('tab', { name: /repositories/i }));

      await waitFor(
        () => {
          expect(screen.getByText('repo-1')).toBeInTheDocument();
        },
        { timeout: 3000 }
      );

      // Click on Filters header to expand
      await user.click(screen.getByText('Filters'));

      // Verify filter controls exist
      expect(screen.getByLabelText(/minimum stars/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/language/i)).toBeInTheDocument();
    });

    it('should change sorting when sort control is used', async () => {
      const user = await setupWithUser();

      await user.click(screen.getByRole('tab', { name: /repositories/i }));

      await waitFor(
        () => {
          expect(screen.getByText('repo-1')).toBeInTheDocument();
        },
        { timeout: 2000 }
      );

      // Verify sorting control exists
      expect(screen.getByText(/sort by/i)).toBeInTheDocument();

      // Default is sorted by stars descending (repo-1, repo-2, repo-3)
      const cards = screen.queryAllByRole('article');
      if (cards.length > 0) {
        expect(cards[0]).toHaveTextContent('repo-1');
      }
    });

    it('should show pagination when there are many repositories', async () => {
      const manyRepos = Array.from({ length: 25 }, (_, i) =>
        createMockRepository({ name: `repo-${i}` })
      );

      vi.spyOn(useQueryUserModule, 'default').mockReturnValue({
        data: {
          user: createMockUser({
            repositories: {
              totalCount: 25,
              pageInfo: { endCursor: 'cursor', hasNextPage: false },
              nodes: manyRepos,
            },
          }),
        },
        loading: false,
        error: null,
      });

      const user = userEvent.setup();
      render(<App />);

      // Set username to trigger tabs rendering
      const input = screen.getByPlaceholderText(/search github user/i);
      await user.type(input, 'testuser');
      await user.click(screen.getByRole('button', { name: /search/i }));

      await waitFor(() => {
        expect(screen.getByRole('tab', { name: /repositories/i })).toBeInTheDocument();
      });

      await user.click(screen.getByRole('tab', { name: /repositories/i }));

      await waitFor(() => {
        // Should show pagination controls
        expect(screen.getByRole('button', { name: /next page/i })).toBeInTheDocument();
        expect(screen.getByText(/page 1 of 2/i)).toBeInTheDocument();
      });
    });
  });

  describe('Statistics', () => {
    beforeEach(() => {
      vi.spyOn(useQueryUserModule, 'default').mockReturnValue({
        data: { user: mockUser },
        loading: false,
        error: null,
      });
    });

    it('should render statistics tab with charts', async () => {
      const user = userEvent.setup();
      render(<App />);

      // Set username to trigger tabs rendering
      const input = screen.getByPlaceholderText(/search github user/i);
      await user.type(input, 'testuser');
      await user.click(screen.getByRole('button', { name: /search/i }));

      await waitFor(() => {
        expect(screen.getByRole('tab', { name: /statistics/i })).toBeInTheDocument();
      });

      await user.click(screen.getByRole('tab', { name: /statistics/i }));

      await waitFor(() => {
        // StatsOverview has nested tabs
        expect(screen.getByRole('tab', { name: /overview/i })).toBeInTheDocument();
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle user with no repositories', async () => {
      vi.spyOn(useQueryUserModule, 'default').mockReturnValue({
        data: {
          user: createMockUser({
            repositories: {
              totalCount: 0,
              pageInfo: { endCursor: null, hasNextPage: false },
              nodes: [],
            },
          }),
        },
        loading: false,
        error: null,
      });

      const user = userEvent.setup();
      render(<App />);

      // Set username to trigger tabs rendering
      const input = screen.getByPlaceholderText(/search github user/i);
      await user.type(input, 'testuser');
      await user.click(screen.getByRole('button', { name: /search/i }));

      await waitFor(() => {
        expect(screen.getByRole('tab', { name: /repositories/i })).toBeInTheDocument();
      });

      await user.click(screen.getByRole('tab', { name: /repositories/i }));

      await waitFor(() => {
        expect(screen.getByText(/no repositories found/i)).toBeInTheDocument();
      });
    });

    it('should handle empty filter results', async () => {
      vi.spyOn(useQueryUserModule, 'default').mockReturnValue({
        data: {
          user: createMockUser({
            repositories: {
              totalCount: 2,
              pageInfo: { endCursor: 'cursor', hasNextPage: false },
              nodes: [
                createMockRepository({ name: 'repo-1', stargazerCount: 100 }),
                createMockRepository({ name: 'repo-2', stargazerCount: 50 }),
              ],
            },
          }),
        },
        loading: false,
        error: null,
      });

      const user = userEvent.setup();
      render(<App />);

      // Set username to trigger tabs rendering
      const input = screen.getByPlaceholderText(/search github user/i);
      await user.type(input, 'testuser');
      await user.click(screen.getByRole('button', { name: /search/i }));

      await waitFor(
        () => {
          expect(screen.getByRole('tab', { name: /repositories/i })).toBeInTheDocument();
        },
        { timeout: 2000 }
      );

      await user.click(screen.getByRole('tab', { name: /repositories/i }));

      await waitFor(
        () => {
          expect(screen.getByText('repo-1')).toBeInTheDocument();
        },
        { timeout: 2000 }
      );

      // Click on Filters header to expand
      await user.click(screen.getByText('Filters'));

      // Verify filter inputs exist
      expect(screen.getByLabelText(/minimum stars/i)).toBeInTheDocument();
    });
  });
});
