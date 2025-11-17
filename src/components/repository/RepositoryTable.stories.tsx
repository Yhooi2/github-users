import type { Meta, StoryObj } from '@storybook/react-vite';
import { RepositoryTable } from './RepositoryTable';
import type { Repository } from '@/apollo/github-api.types';

// Mock repository data
const createMockRepository = (id: number, overrides?: Partial<Repository>): Repository => ({
  id: `repo-${id}`,
  name: `repository-${id}`,
  description: `A sample repository for testing purposes with ID ${id}`,
  url: `https://github.com/user/repository-${id}`,
  stargazerCount: Math.floor(Math.random() * 1000) + 10,
  forkCount: Math.floor(Math.random() * 100) + 5,
  isFork: false,
  isTemplate: false,
  parent: null,
  createdAt: new Date(2023, id % 12, id % 28 + 1).toISOString(),
  updatedAt: new Date(2024, 10, id % 28 + 1).toISOString(),
  pushedAt: new Date(2024, 10, id % 28 + 1).toISOString(),
  diskUsage: Math.floor(Math.random() * 10000),
  isArchived: false,
  homepageUrl: null,
  watchers: { totalCount: Math.floor(Math.random() * 50) + 1 },
  issues: { totalCount: Math.floor(Math.random() * 20) },
  repositoryTopics: {
    nodes: [
      { topic: { name: 'react' } },
      { topic: { name: 'typescript' } },
    ],
  },
  licenseInfo: { name: 'MIT License' },
  defaultBranchRef: {
    target: {
      history: { totalCount: Math.floor(Math.random() * 200) + 10 },
    },
  },
  primaryLanguage: { name: ['TypeScript', 'JavaScript', 'Python', 'Go'][id % 4] },
  languages: {
    totalSize: 5000,
    edges: [
      { size: 4000, node: { name: 'TypeScript' } },
      { size: 1000, node: { name: 'CSS' } },
    ],
  },
  ...overrides,
});

const mockRepositories: Repository[] = Array.from({ length: 5 }, (_, i) =>
  createMockRepository(i + 1)
);

const meta = {
  title: 'Components/Repository/RepositoryTable',
  component: RepositoryTable,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof RepositoryTable>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default repository table with multiple items
 */
export const Default: Story = {
  args: {
    repositories: mockRepositories,
  },
};

/**
 * Loading state while fetching repositories
 */
export const Loading: Story = {
  args: {
    repositories: [],
    loading: true,
  },
};

/**
 * Loading state with custom message
 */
export const LoadingWithMessage: Story = {
  args: {
    repositories: [],
    loading: true,
    loadingMessage: 'Fetching your repositories...',
  },
};

/**
 * Error state when fetch fails
 */
export const Error: Story = {
  args: {
    repositories: [],
    error: new Error('Failed to fetch repositories from GitHub API'),
  },
};

/**
 * Error state with custom messages
 */
export const CustomError: Story = {
  args: {
    repositories: [],
    error: new Error('Network error'),
    errorTitle: 'Connection Failed',
    errorDescription: 'Unable to connect to GitHub. Please check your internet connection.',
  },
};

/**
 * Empty state with no repositories
 */
export const Empty: Story = {
  args: {
    repositories: [],
  },
};

/**
 * Empty state due to active filters
 */
export const EmptyWithFilters: Story = {
  args: {
    repositories: [],
    hasActiveFilters: true,
  },
};

/**
 * Empty state with custom messages
 */
export const CustomEmpty: Story = {
  args: {
    repositories: [],
    hasActiveFilters: false,
    emptyTitle: 'No Public Repositories',
    emptyDescription: 'This user has not created any public repositories yet.',
  },
};

/**
 * Single repository
 */
export const SingleRepository: Story = {
  args: {
    repositories: [mockRepositories[0]],
  },
};

/**
 * Two repositories
 */
export const TwoRepositories: Story = {
  args: {
    repositories: mockRepositories.slice(0, 2),
  },
};

/**
 * Many repositories (10 items)
 */
export const ManyRepositories: Story = {
  args: {
    repositories: Array.from({ length: 10 }, (_, i) => createMockRepository(i + 1)),
  },
};

/**
 * Compact mode (fewer columns, smaller padding)
 */
export const CompactMode: Story = {
  args: {
    repositories: mockRepositories,
    compact: true,
  },
};

/**
 * With clickable repositories
 */
export const Clickable: Story = {
  args: {
    repositories: mockRepositories,
    onRepositoryClick: (repo) => {
      alert(`Clicked: ${repo.name}`);
    },
  },
};

/**
 * Repositories with various states (forks, archived)
 */
export const MixedStates: Story = {
  args: {
    repositories: [
      createMockRepository(1, { isFork: true }),
      createMockRepository(2, { isArchived: true }),
      createMockRepository(3, { stargazerCount: 5000 }),
      createMockRepository(4, { description: null }),
      createMockRepository(5, { primaryLanguage: null }),
    ],
  },
};

/**
 * Popular repositories (many stars)
 */
export const PopularRepositories: Story = {
  args: {
    repositories: Array.from({ length: 3 }, (_, i) =>
      createMockRepository(i + 1, {
        stargazerCount: 10000 + i * 5000,
        forkCount: 1000 + i * 500,
      })
    ),
  },
};

/**
 * Repositories with long names and descriptions
 */
export const LongContent: Story = {
  args: {
    repositories: [
      createMockRepository(1, {
        name: 'very-long-repository-name-that-might-cause-layout-issues',
        description:
          'This is a very long description that might cause layout issues in the table view. It contains lots of information about the repository and its purpose.',
      }),
      createMockRepository(2, {
        name: 'another-long-name',
        description:
          'Another repository with a long description to test how the table handles text overflow and truncation.',
      }),
    ],
  },
};

/**
 * Repositories without descriptions
 */
export const NoDescriptions: Story = {
  args: {
    repositories: Array.from({ length: 3 }, (_, i) =>
      createMockRepository(i + 1, { description: null })
    ),
  },
};

/**
 * Repositories without languages
 */
export const NoLanguages: Story = {
  args: {
    repositories: Array.from({ length: 3 }, (_, i) =>
      createMockRepository(i + 1, { primaryLanguage: null })
    ),
  },
};
