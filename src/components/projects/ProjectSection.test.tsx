import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProjectSection } from './ProjectSection';
import type { Repository } from '@/apollo/github-api.types';

// Mock RepositoryCard component
vi.mock('@/components/repository/RepositoryCard', () => ({
  RepositoryCard: ({ repository }: { repository: Repository }) => (
    <div data-testid={`repo-card-${repository.id}`}>{repository.name}</div>
  ),
}));

// Helper to create mock repository
const createMockRepo = (id: string, name: string): Repository => ({
  id,
  name,
  description: `Description for ${name}`,
  url: `https://github.com/user/${name}`,
  stargazerCount: 100,
  forkCount: 10,
  isFork: false,
  isTemplate: false,
  parent: null,
  createdAt: '2023-01-01T00:00:00Z',
  updatedAt: '2024-11-01T00:00:00Z',
  pushedAt: '2024-11-01T00:00:00Z',
  diskUsage: 1000,
  isArchived: false,
  homepageUrl: null,
  owner: {
    login: 'user',
    avatarUrl: 'https://avatars.githubusercontent.com/u/123456',
  },
  watchers: { totalCount: 5 },
  issues: { totalCount: 2 },
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
});

describe('ProjectSection', () => {
  const ownedProjects = [
    createMockRepo('1', 'my-app'),
    createMockRepo('2', 'my-website'),
  ];

  const contributionProjects = [
    createMockRepo('3', 'react'),
    createMockRepo('4', 'typescript'),
  ];

  describe('Rendering', () => {
    it('renders section title', () => {
      render(
        <ProjectSection
          projects={{ owned: [], contributions: [] }}
          loading={false}
        />
      );

      expect(screen.getByText('🔥 Top Projects & Contributions')).toBeInTheDocument();
    });

    it('renders owned projects section with badge count', () => {
      render(
        <ProjectSection
          projects={{ owned: ownedProjects, contributions: [] }}
          loading={false}
        />
      );

      expect(screen.getByText('👤 Your Original Projects')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument(); // Badge count
    });

    it('renders contributions section with badge count', () => {
      render(
        <ProjectSection
          projects={{ owned: [], contributions: contributionProjects }}
          loading={false}
        />
      );

      expect(screen.getByText('👥 Open Source Contributions')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument(); // Badge count
    });

    it('renders both owned and contribution projects', () => {
      render(
        <ProjectSection
          projects={{ owned: ownedProjects, contributions: contributionProjects }}
          loading={false}
        />
      );

      // Check owned projects
      expect(screen.getByText('my-app')).toBeInTheDocument();
      expect(screen.getByText('my-website')).toBeInTheDocument();

      // Check contributions
      expect(screen.getByText('react')).toBeInTheDocument();
      expect(screen.getByText('typescript')).toBeInTheDocument();
    });
  });

  describe('Empty State', () => {
    it('shows empty state when no projects', () => {
      render(
        <ProjectSection
          projects={{ owned: [], contributions: [] }}
          loading={false}
        />
      );

      expect(screen.getByText('No repositories found')).toBeInTheDocument();
    });

    it('does not show empty state when owned projects exist', () => {
      render(
        <ProjectSection
          projects={{ owned: ownedProjects, contributions: [] }}
          loading={false}
        />
      );

      expect(screen.queryByText('No repositories found')).not.toBeInTheDocument();
    });

    it('does not show empty state when contributions exist', () => {
      render(
        <ProjectSection
          projects={{ owned: [], contributions: contributionProjects }}
          loading={false}
        />
      );

      expect(screen.queryByText('No repositories found')).not.toBeInTheDocument();
    });
  });

  describe('Loading State', () => {
    it('shows loading skeleton when loading is true', () => {
      render(
        <ProjectSection
          projects={{ owned: [], contributions: [] }}
          loading={true}
        />
      );

      // Check for skeleton elements (4 placeholders)
      const skeletons = screen.getAllByRole('generic').filter((el) =>
        el.className.includes('animate-pulse')
      );
      expect(skeletons.length).toBeGreaterThan(0);
    });

    it('does not show projects during loading', () => {
      render(
        <ProjectSection
          projects={{ owned: ownedProjects, contributions: contributionProjects }}
          loading={true}
        />
      );

      expect(screen.queryByText('my-app')).not.toBeInTheDocument();
      expect(screen.queryByText('react')).not.toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper aria-label on section', () => {
      const { container } = render(
        <ProjectSection
          projects={{ owned: [], contributions: [] }}
          loading={false}
        />
      );

      const section = container.querySelector('section');
      expect(section).toHaveAttribute('aria-label', 'Projects and contributions');
    });

    it('has proper aria-label on loading section', () => {
      const { container } = render(
        <ProjectSection
          projects={{ owned: [], contributions: [] }}
          loading={true}
        />
      );

      const section = container.querySelector('section');
      expect(section).toHaveAttribute('aria-label', 'Loading projects');
    });
  });

  describe('Repository Card Integration', () => {
    it('renders RepositoryCard for each owned project', () => {
      render(
        <ProjectSection
          projects={{ owned: ownedProjects, contributions: [] }}
          loading={false}
        />
      );

      expect(screen.getByTestId('repo-card-1')).toBeInTheDocument();
      expect(screen.getByTestId('repo-card-2')).toBeInTheDocument();
    });

    it('renders RepositoryCard for each contribution', () => {
      render(
        <ProjectSection
          projects={{ owned: [], contributions: contributionProjects }}
          loading={false}
        />
      );

      expect(screen.getByTestId('repo-card-3')).toBeInTheDocument();
      expect(screen.getByTestId('repo-card-4')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles single owned project', () => {
      render(
        <ProjectSection
          projects={{ owned: [ownedProjects[0]], contributions: [] }}
          loading={false}
        />
      );

      expect(screen.getByText('my-app')).toBeInTheDocument();
      expect(screen.getByText('1')).toBeInTheDocument(); // Badge count
    });

    it('handles many projects without breaking layout', () => {
      const manyProjects = Array.from({ length: 10 }, (_, i) =>
        createMockRepo(`${i}`, `project-${i}`)
      );

      render(
        <ProjectSection
          projects={{ owned: manyProjects, contributions: [] }}
          loading={false}
        />
      );

      expect(screen.getByText('10')).toBeInTheDocument(); // Badge count
    });
  });
});
