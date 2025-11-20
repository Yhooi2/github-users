import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RepositoryTable } from './RepositoryTable';
import { createMockRepository } from '@/test/mocks/github-data';
import type { Repository } from '@/apollo/github-api.types';

// Use centralized mock factory (Week 4 P3: Mock data consolidation)
const createMockRepo = (id: number, overrides?: Partial<Repository>): Repository =>
  createMockRepository({
    id: `repo-${id}`,
    name: `test-repo-${id}`,
    description: `Test repository ${id}`,
    url: `https://github.com/user/test-repo-${id}`,
    stargazerCount: 100 * id,
    forkCount: 10 * id,
    updatedAt: '2024-11-01T00:00:00Z',
    pushedAt: '2024-11-01T00:00:00Z',
    watchers: { totalCount: 5 * id },
    issues: { totalCount: 2 * id },
    repositoryTopics: {
      nodes: [{ topic: { name: 'react' } }],
    },
    defaultBranchRef: {
      target: {
        history: { totalCount: 50 },
      },
    },
    ...overrides,
  });

describe('RepositoryTable', () => {
  const mockRepositories = [
    createMockRepo(1),
    createMockRepo(2),
    createMockRepo(3),
  ];

  describe('Loading State', () => {
    it('should show loading state when loading is true', () => {
      render(<RepositoryTable repositories={[]} loading={true} />);

      expect(screen.getByText('Loading repositories...')).toBeInTheDocument();
    });

    it('should show custom loading message', () => {
      render(
        <RepositoryTable
          repositories={[]}
          loading={true}
          loadingMessage="Fetching repositories..."
        />
      );

      expect(screen.getByText('Fetching repositories...')).toBeInTheDocument();
    });

    it('should not show table when loading', () => {
      render(<RepositoryTable repositories={mockRepositories} loading={true} />);

      expect(screen.queryByRole('table')).not.toBeInTheDocument();
    });
  });

  describe('Error State', () => {
    it('should show error state when error is provided', () => {
      const error = new Error('Failed to load');
      render(<RepositoryTable repositories={[]} error={error} />);

      expect(screen.getByText('Failed to load repositories')).toBeInTheDocument();
      expect(screen.getByText('Failed to load')).toBeInTheDocument();
    });

    it('should show custom error title and description', () => {
      const error = new Error('Network error');
      render(
        <RepositoryTable
          repositories={[]}
          error={error}
          errorTitle="Custom Error"
          errorDescription="Custom description"
        />
      );

      expect(screen.getByText('Custom Error')).toBeInTheDocument();
      expect(screen.getByText('Custom description')).toBeInTheDocument();
    });

    it('should not show table when error exists', () => {
      const error = new Error('Test error');
      render(<RepositoryTable repositories={mockRepositories} error={error} />);

      expect(screen.queryByRole('table')).not.toBeInTheDocument();
    });
  });

  describe('Empty State', () => {
    it('should show empty state when no repositories', () => {
      render(<RepositoryTable repositories={[]} />);

      expect(screen.getByText('No Repositories Found')).toBeInTheDocument();
    });

    it('should show filter-specific message when hasActiveFilters is true', () => {
      render(<RepositoryTable repositories={[]} hasActiveFilters={true} />);

      expect(
        screen.getByText(/No repositories match the current filters/i)
      ).toBeInTheDocument();
    });

    it('should show no-repos message when hasActiveFilters is false', () => {
      render(<RepositoryTable repositories={[]} hasActiveFilters={false} />);

      expect(
        screen.getByText(/This user hasn't created any public repositories yet/i)
      ).toBeInTheDocument();
    });

    it('should show custom empty title and description', () => {
      render(
        <RepositoryTable
          repositories={[]}
          hasActiveFilters={true}
          emptyTitle="Custom Empty"
          emptyDescription="Custom empty description"
        />
      );

      expect(screen.getByText('Custom Empty')).toBeInTheDocument();
      expect(screen.getByText('Custom empty description')).toBeInTheDocument();
    });
  });

  describe('Table Rendering', () => {
    it('should render table with all repositories', () => {
      render(<RepositoryTable repositories={mockRepositories} />);

      expect(screen.getByRole('table')).toBeInTheDocument();
      expect(screen.getByText('test-repo-1')).toBeInTheDocument();
      expect(screen.getByText('test-repo-2')).toBeInTheDocument();
      expect(screen.getByText('test-repo-3')).toBeInTheDocument();
    });

    it('should render table headers', () => {
      render(<RepositoryTable repositories={mockRepositories} />);

      expect(screen.getByText('Name')).toBeInTheDocument();
      expect(screen.getByText('Description')).toBeInTheDocument();
      expect(screen.getByText('Stars')).toBeInTheDocument();
      expect(screen.getByText('Forks')).toBeInTheDocument();
      expect(screen.getByText('Watchers')).toBeInTheDocument();
      expect(screen.getByText('Language')).toBeInTheDocument();
      expect(screen.getByText('Updated')).toBeInTheDocument();
    });

    it('should render repository descriptions', () => {
      render(<RepositoryTable repositories={mockRepositories} />);

      expect(screen.getByText('Test repository 1')).toBeInTheDocument();
      expect(screen.getByText('Test repository 2')).toBeInTheDocument();
      expect(screen.getByText('Test repository 3')).toBeInTheDocument();
    });

    it('should render repository stats', () => {
      render(<RepositoryTable repositories={mockRepositories} />);

      // Stars
      expect(screen.getByTitle('100 stars')).toBeInTheDocument();
      expect(screen.getByTitle('200 stars')).toBeInTheDocument();
      expect(screen.getByTitle('300 stars')).toBeInTheDocument();

      // Forks
      expect(screen.getByTitle('10 forks')).toBeInTheDocument();
      expect(screen.getByTitle('20 forks')).toBeInTheDocument();
      expect(screen.getByTitle('30 forks')).toBeInTheDocument();
    });

    it('should render repository URLs as links', () => {
      render(<RepositoryTable repositories={mockRepositories} />);

      const link = screen.getByRole('link', { name: /test-repo-1/i });
      expect(link).toHaveAttribute('href', 'https://github.com/user/test-repo-1');
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('should render primary language', () => {
      render(<RepositoryTable repositories={mockRepositories} />);

      const languageBadges = screen.getAllByText('TypeScript');
      expect(languageBadges.length).toBeGreaterThan(0);
    });

    it('should render "No description" for missing descriptions', () => {
      const repos = [createMockRepo(1, { description: null })];
      render(<RepositoryTable repositories={repos} />);

      expect(screen.getByText('No description')).toBeInTheDocument();
    });

    it('should render "-" for missing language', () => {
      const repos = [createMockRepo(1, { primaryLanguage: null })];
      render(<RepositoryTable repositories={repos} />);

      expect(screen.getByText('-')).toBeInTheDocument();
    });
  });

  describe('Badges', () => {
    it('should show Fork badge for forked repositories', () => {
      const repos = [createMockRepo(1, { isFork: true })];
      render(<RepositoryTable repositories={repos} />);

      expect(screen.getByText('Fork')).toBeInTheDocument();
    });

    it('should show Archived badge for archived repositories', () => {
      const repos = [createMockRepo(1, { isArchived: true })];
      render(<RepositoryTable repositories={repos} />);

      expect(screen.getByText('Archived')).toBeInTheDocument();
    });

    it('should not show badges for normal repositories', () => {
      const repos = [createMockRepo(1)];
      render(<RepositoryTable repositories={repos} />);

      expect(screen.queryByText('Fork')).not.toBeInTheDocument();
      expect(screen.queryByText('Archived')).not.toBeInTheDocument();
    });
  });

  describe('Number Formatting', () => {
    it('should format numbers with K suffix for thousands', () => {
      const repos = [createMockRepo(1, { stargazerCount: 5000 })];
      render(<RepositoryTable repositories={repos} />);

      expect(screen.getByText('5K')).toBeInTheDocument();
    });

    it('should format numbers with M suffix for millions', () => {
      const repos = [createMockRepo(1, { stargazerCount: 2500000 })];
      render(<RepositoryTable repositories={repos} />);

      expect(screen.getByText('2.5M')).toBeInTheDocument();
    });

    it('should not format numbers below 1000', () => {
      const repos = [createMockRepo(1, { stargazerCount: 999 })];
      render(<RepositoryTable repositories={repos} />);

      expect(screen.getByText('999')).toBeInTheDocument();
    });
  });

  describe('Click Handling', () => {
    it('should call onRepositoryClick when a row is clicked', async () => {
      const user = userEvent.setup();
      const mockOnClick = vi.fn();

      render(
        <RepositoryTable repositories={mockRepositories} onRepositoryClick={mockOnClick} />
      );

      const firstRow = screen.getByRole('button', { name: /Open test-repo-1 repository/i });
      await user.click(firstRow);

      expect(mockOnClick).toHaveBeenCalledWith(mockRepositories[0]);
      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    it('should handle Enter key to trigger click', async () => {
      const user = userEvent.setup();
      const mockOnClick = vi.fn();

      render(
        <RepositoryTable repositories={mockRepositories} onRepositoryClick={mockOnClick} />
      );

      const firstRow = screen.getByRole('button', { name: /Open test-repo-1 repository/i });
      firstRow.focus();
      await user.keyboard('{Enter}');

      expect(mockOnClick).toHaveBeenCalledWith(mockRepositories[0]);
    });

    it('should handle Space key to trigger click', async () => {
      const user = userEvent.setup();
      const mockOnClick = vi.fn();

      render(
        <RepositoryTable repositories={mockRepositories} onRepositoryClick={mockOnClick} />
      );

      const firstRow = screen.getByRole('button', { name: /Open test-repo-1 repository/i });
      firstRow.focus();
      await user.keyboard('{ }');

      expect(mockOnClick).toHaveBeenCalledWith(mockRepositories[0]);
    });

    it('should not have clickable rows when onRepositoryClick is not provided', () => {
      render(<RepositoryTable repositories={mockRepositories} />);

      // Rows should not have role="button" when not clickable
      expect(screen.queryByRole('button', { name: /Open.*repository/i })).not.toBeInTheDocument();
    });

    it('should stop propagation when clicking repository link', async () => {
      const user = userEvent.setup();
      const mockOnClick = vi.fn();

      render(
        <RepositoryTable repositories={mockRepositories} onRepositoryClick={mockOnClick} />
      );

      const link = screen.getByRole('link', { name: /test-repo-1/i });
      await user.click(link);

      // Row click should not be triggered when clicking the link
      expect(mockOnClick).not.toHaveBeenCalled();
    });
  });

  describe('Compact Mode', () => {
    it('should render in compact mode without description column', () => {
      render(<RepositoryTable repositories={mockRepositories} compact />);

      expect(screen.getByRole('table')).toBeInTheDocument();
      expect(screen.getByText('Name')).toBeInTheDocument();
      expect(screen.queryByText('Description')).not.toBeInTheDocument();
    });

    it('should render in compact mode without watchers column', () => {
      render(<RepositoryTable repositories={mockRepositories} compact />);

      expect(screen.queryByText('Watchers')).not.toBeInTheDocument();
    });

    it('should render in compact mode without language column', () => {
      render(<RepositoryTable repositories={mockRepositories} compact />);

      expect(screen.queryByText('Language')).not.toBeInTheDocument();
    });

    it('should still show Name, Stars, Forks, Updated in compact mode', () => {
      render(<RepositoryTable repositories={mockRepositories} compact />);

      expect(screen.getByText('Name')).toBeInTheDocument();
      expect(screen.getByText('Stars')).toBeInTheDocument();
      expect(screen.getByText('Forks')).toBeInTheDocument();
      expect(screen.getByText('Updated')).toBeInTheDocument();
    });
  });

  describe('State Priority', () => {
    it('should show loading state over error state', () => {
      const error = new Error('Test error');
      render(<RepositoryTable repositories={[]} loading={true} error={error} />);

      expect(screen.getByText('Loading repositories...')).toBeInTheDocument();
      expect(screen.queryByText('Failed to load repositories')).not.toBeInTheDocument();
    });

    it('should show loading state over empty state', () => {
      render(<RepositoryTable repositories={[]} loading={true} />);

      expect(screen.getByText('Loading repositories...')).toBeInTheDocument();
      expect(screen.queryByText('No Repositories Found')).not.toBeInTheDocument();
    });

    it('should show error state over empty state', () => {
      const error = new Error('Test error');
      render(<RepositoryTable repositories={[]} error={error} />);

      expect(screen.getByText('Failed to load repositories')).toBeInTheDocument();
      expect(screen.queryByText('No Repositories Found')).not.toBeInTheDocument();
    });

    it('should show table over empty state when repositories exist', () => {
      render(<RepositoryTable repositories={mockRepositories} />);

      expect(screen.getByRole('table')).toBeInTheDocument();
      expect(screen.queryByText('No Repositories Found')).not.toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have accessible table role', () => {
      render(<RepositoryTable repositories={mockRepositories} />);

      expect(screen.getByRole('table')).toBeInTheDocument();
    });

    it('should have row with button role when clickable', () => {
      const mockOnClick = vi.fn();
      render(<RepositoryTable repositories={mockRepositories} onRepositoryClick={mockOnClick} />);

      const firstRow = screen.getByRole('button', { name: /Open test-repo-1 repository/i });
      expect(firstRow).toBeInTheDocument();
      expect(firstRow).toHaveAttribute('tabIndex', '0');
    });

    it('should not have button role when not clickable', () => {
      render(<RepositoryTable repositories={mockRepositories} />);

      expect(screen.queryByRole('button', { name: /Open.*repository/i })).not.toBeInTheDocument();
    });

    it('should have title attributes for stat numbers', () => {
      render(<RepositoryTable repositories={mockRepositories} />);

      expect(screen.getByTitle('100 stars')).toBeInTheDocument();
      expect(screen.getByTitle('10 forks')).toBeInTheDocument();
      expect(screen.getByTitle('5 watchers')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle null error gracefully', () => {
      render(<RepositoryTable repositories={mockRepositories} error={null} />);

      expect(screen.getByRole('table')).toBeInTheDocument();
    });

    it('should handle undefined error gracefully', () => {
      render(<RepositoryTable repositories={mockRepositories} error={undefined} />);

      expect(screen.getByRole('table')).toBeInTheDocument();
    });

    it('should handle loading=false explicitly', () => {
      render(<RepositoryTable repositories={mockRepositories} loading={false} />);

      expect(screen.getByRole('table')).toBeInTheDocument();
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });

    it('should handle hasActiveFilters=false explicitly', () => {
      render(<RepositoryTable repositories={[]} hasActiveFilters={false} />);

      expect(
        screen.getByText(/This user hasn't created any public repositories yet/i)
      ).toBeInTheDocument();
    });

    it('should handle repository with null updatedAt', () => {
      const repos = [createMockRepo(1, { updatedAt: null })];
      render(<RepositoryTable repositories={repos} />);

      expect(screen.getByText('Never')).toBeInTheDocument();
    });

    it('should handle single repository', () => {
      render(<RepositoryTable repositories={[mockRepositories[0]]} />);

      expect(screen.getByText('test-repo-1')).toBeInTheDocument();
      expect(screen.queryByText('test-repo-2')).not.toBeInTheDocument();
    });

    it('should handle many repositories', () => {
      const manyRepos = Array.from({ length: 20 }, (_, i) => createMockRepo(i + 1));
      render(<RepositoryTable repositories={manyRepos} />);

      expect(screen.getByText('test-repo-1')).toBeInTheDocument();
      expect(screen.getByText('test-repo-20')).toBeInTheDocument();
    });
  });
});
