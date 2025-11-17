import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RepositoryList } from './RepositoryList';
import type { Repository } from '@/apollo/github-api.types';

// Mock repository helper
const createMockRepo = (id: number, overrides?: Partial<Repository>): Repository => ({
  id: `repo-${id}`,
  name: `test-repo-${id}`,
  description: `Test repository ${id}`,
  url: `https://github.com/user/test-repo-${id}`,
  stargazerCount: 100 * id,
  forkCount: 10 * id,
  isFork: false,
  isTemplate: false,
  parent: null,
  createdAt: '2023-01-01T00:00:00Z',
  updatedAt: '2024-11-01T00:00:00Z',
  pushedAt: '2024-11-01T00:00:00Z',
  diskUsage: 1000,
  isArchived: false,
  homepageUrl: null,
  watchers: { totalCount: 5 * id },
  issues: { totalCount: 2 * id },
  repositoryTopics: {
    nodes: [{ topic: { name: 'react' } }],
  },
  licenseInfo: { name: 'MIT License' },
  defaultBranchRef: {
    target: {
      history: { totalCount: 50 },
    },
  },
  primaryLanguage: { name: 'TypeScript' },
  languages: {
    totalSize: 1000,
    edges: [{ size: 800, node: { name: 'TypeScript' } }],
  },
  ...overrides,
});

describe('RepositoryList', () => {
  const mockRepositories = [
    createMockRepo(1),
    createMockRepo(2),
    createMockRepo(3),
  ];

  describe('Loading State', () => {
    it('should show loading state when loading is true', () => {
      render(<RepositoryList repositories={[]} loading={true} />);

      expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });

    it('should show custom loading message', () => {
      render(
        <RepositoryList
          repositories={[]}
          loading={true}
          loadingMessage="Fetching repositories..."
        />
      );

      expect(screen.getByText('Fetching repositories...')).toBeInTheDocument();
    });

    it('should not show repositories when loading', () => {
      render(<RepositoryList repositories={mockRepositories} loading={true} />);

      expect(screen.queryByText('test-repo-1')).not.toBeInTheDocument();
    });
  });

  describe('Error State', () => {
    it('should show error state when error is provided', () => {
      const error = new Error('Failed to load');
      render(<RepositoryList repositories={[]} error={error} />);

      expect(screen.getByText('Failed to load repositories')).toBeInTheDocument();
      expect(screen.getByText('Failed to load')).toBeInTheDocument();
    });

    it('should show custom error title and description', () => {
      const error = new Error('Network error');
      render(
        <RepositoryList
          repositories={[]}
          error={error}
          errorTitle="Custom Error"
          errorDescription="Custom description"
        />
      );

      expect(screen.getByText('Custom Error')).toBeInTheDocument();
      expect(screen.getByText('Custom description')).toBeInTheDocument();
    });

    it('should not show repositories when error exists', () => {
      const error = new Error('Test error');
      render(<RepositoryList repositories={mockRepositories} error={error} />);

      expect(screen.queryByText('test-repo-1')).not.toBeInTheDocument();
    });
  });

  describe('Empty State', () => {
    it('should show empty state when no repositories', () => {
      render(<RepositoryList repositories={[]} />);

      expect(screen.getByText('No Repositories Found')).toBeInTheDocument();
    });

    it('should show filter-specific message when hasActiveFilters is true', () => {
      render(<RepositoryList repositories={[]} hasActiveFilters={true} />);

      expect(
        screen.getByText(/No repositories match the current filters/i)
      ).toBeInTheDocument();
    });

    it('should show no-repos message when hasActiveFilters is false', () => {
      render(<RepositoryList repositories={[]} hasActiveFilters={false} />);

      expect(
        screen.getByText(/This user hasn't created any public repositories yet/i)
      ).toBeInTheDocument();
    });

    it('should show custom empty title and description', () => {
      render(
        <RepositoryList
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

  describe('Repository List', () => {
    it('should render all repositories', () => {
      render(<RepositoryList repositories={mockRepositories} />);

      expect(screen.getByText('test-repo-1')).toBeInTheDocument();
      expect(screen.getByText('test-repo-2')).toBeInTheDocument();
      expect(screen.getByText('test-repo-3')).toBeInTheDocument();
    });

    it('should render repository descriptions', () => {
      render(<RepositoryList repositories={mockRepositories} />);

      expect(screen.getByText('Test repository 1')).toBeInTheDocument();
      expect(screen.getByText('Test repository 2')).toBeInTheDocument();
      expect(screen.getByText('Test repository 3')).toBeInTheDocument();
    });

    it('should render single repository', () => {
      render(<RepositoryList repositories={[mockRepositories[0]]} />);

      expect(screen.getByText('test-repo-1')).toBeInTheDocument();
      expect(screen.queryByText('test-repo-2')).not.toBeInTheDocument();
    });

    it('should have proper list semantics', () => {
      render(<RepositoryList repositories={mockRepositories} />);

      const list = screen.getByRole('list', { name: 'Repository list' });
      expect(list).toBeInTheDocument();

      // Should have list items (may include nested items from RepositoryCard topics)
      const items = screen.getAllByRole('listitem');
      expect(items.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe('Click Handling', () => {
    it('should call onRepositoryClick when a repository is clicked', async () => {
      const user = userEvent.setup();
      const mockOnClick = vi.fn();

      render(
        <RepositoryList repositories={mockRepositories} onRepositoryClick={mockOnClick} />
      );

      const firstRepo = screen.getByRole('button', { name: /Open test-repo-1 repository/i });
      await user.click(firstRepo);

      expect(mockOnClick).toHaveBeenCalledWith(mockRepositories[0]);
      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    it('should not have clickable cards when onRepositoryClick is not provided', () => {
      render(<RepositoryList repositories={mockRepositories} />);

      // Card should not have role="button" when not clickable
      expect(screen.queryByRole('button', { name: /Open.*repository/i })).not.toBeInTheDocument();
    });
  });

  describe('Compact Mode', () => {
    it('should render in compact mode', () => {
      render(<RepositoryList repositories={mockRepositories} compact />);

      // Verify repositories are still rendered
      expect(screen.getByText('test-repo-1')).toBeInTheDocument();

      // In compact mode, descriptions might not be visible
      // This depends on RepositoryCard implementation
    });
  });

  describe('State Priority', () => {
    it('should show loading state over error state', () => {
      const error = new Error('Test error');
      render(<RepositoryList repositories={[]} loading={true} error={error} />);

      expect(screen.getByText(/loading/i)).toBeInTheDocument();
      expect(screen.queryByText('Failed to load repositories')).not.toBeInTheDocument();
    });

    it('should show loading state over empty state', () => {
      render(<RepositoryList repositories={[]} loading={true} />);

      expect(screen.getByText(/loading/i)).toBeInTheDocument();
      expect(screen.queryByText('No Repositories Found')).not.toBeInTheDocument();
    });

    it('should show error state over empty state', () => {
      const error = new Error('Test error');
      render(<RepositoryList repositories={[]} error={error} />);

      expect(screen.getByText('Failed to load repositories')).toBeInTheDocument();
      expect(screen.queryByText('No Repositories Found')).not.toBeInTheDocument();
    });

    it('should show repositories over empty state when repositories exist', () => {
      render(<RepositoryList repositories={mockRepositories} />);

      expect(screen.getByText('test-repo-1')).toBeInTheDocument();
      expect(screen.queryByText('No Repositories Found')).not.toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have accessible list role', () => {
      render(<RepositoryList repositories={mockRepositories} />);

      expect(screen.getByRole('list', { name: 'Repository list' })).toBeInTheDocument();
    });

    it('should have accessible list items', () => {
      render(<RepositoryList repositories={mockRepositories} />);

      // Should have at least as many list items as repositories
      // (may have more due to nested lists in RepositoryCard for topics)
      const items = screen.getAllByRole('listitem');
      expect(items.length).toBeGreaterThanOrEqual(mockRepositories.length);
    });
  });

  describe('Edge Cases', () => {
    it('should handle null error gracefully', () => {
      render(<RepositoryList repositories={mockRepositories} error={null} />);

      expect(screen.getByText('test-repo-1')).toBeInTheDocument();
    });

    it('should handle undefined error gracefully', () => {
      render(<RepositoryList repositories={mockRepositories} error={undefined} />);

      expect(screen.getByText('test-repo-1')).toBeInTheDocument();
    });

    it('should handle loading=false explicitly', () => {
      render(<RepositoryList repositories={mockRepositories} loading={false} />);

      expect(screen.getByText('test-repo-1')).toBeInTheDocument();
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });

    it('should handle hasActiveFilters=false explicitly', () => {
      render(<RepositoryList repositories={[]} hasActiveFilters={false} />);

      expect(
        screen.getByText(/This user hasn't created any public repositories yet/i)
      ).toBeInTheDocument();
    });
  });
});
