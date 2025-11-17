import type { Meta, StoryObj } from '@storybook/react';
import { RepositoryCard } from './RepositoryCard';
import type { Repository } from '@/apollo/github-api.types';

// Mock repository data
const mockRepository: Repository = {
  id: '1',
  name: 'awesome-project',
  description: 'A comprehensive React application with TypeScript, Vite, and modern tooling',
  url: 'https://github.com/user/awesome-project',
  stargazerCount: 1234,
  forkCount: 89,
  isFork: false,
  isTemplate: false,
  parent: null,
  createdAt: '2023-01-15T10:30:00Z',
  updatedAt: '2024-11-05T14:22:00Z',
  pushedAt: '2024-11-05T14:22:00Z',
  diskUsage: 5000,
  isArchived: false,
  homepageUrl: null,
  watchers: { totalCount: 45 },
  issues: { totalCount: 12 },
  repositoryTopics: {
    nodes: [
      { topic: { name: 'react' } },
      { topic: { name: 'typescript' } },
      { topic: { name: 'vite' } },
      { topic: { name: 'graphql' } },
    ],
  },
  licenseInfo: { name: 'MIT License' },
  defaultBranchRef: {
    target: {
      history: { totalCount: 150 },
    },
  },
  primaryLanguage: { name: 'TypeScript' },
  languages: {
    totalSize: 5000,
    edges: [
      { size: 4000, node: { name: 'TypeScript' } },
      { size: 1000, node: { name: 'CSS' } },
    ],
  },
};

const meta = {
  title: 'Components/Repository/RepositoryCard',
  component: RepositoryCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ width: '600px', maxWidth: '100%' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof RepositoryCard>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default repository card with full information
 */
export const Default: Story = {
  args: {
    repository: mockRepository,
  },
};

/**
 * Repository card with many stars (formatted as K/M)
 */
export const PopularRepository: Story = {
  args: {
    repository: {
      ...mockRepository,
      name: 'react',
      description: 'A JavaScript library for building user interfaces',
      stargazerCount: 234567,
      forkCount: 45678,
      watchers: { totalCount: 8900 },
    },
  },
};

/**
 * Repository that is a fork
 */
export const ForkedRepository: Story = {
  args: {
    repository: {
      ...mockRepository,
      name: 'forked-project',
      isFork: true,
      parent: {
        name: 'original-project',
        owner: { login: 'original-owner' },
        url: 'https://github.com/original-owner/original-project',
      },
    },
  },
};

/**
 * Archived repository (no longer maintained)
 */
export const ArchivedRepository: Story = {
  args: {
    repository: {
      ...mockRepository,
      name: 'legacy-app',
      description: 'This repository has been archived and is no longer maintained',
      isArchived: true,
      stargazerCount: 456,
      forkCount: 23,
    },
  },
};

/**
 * Repository with no description
 */
export const NoDescription: Story = {
  args: {
    repository: {
      ...mockRepository,
      description: null,
    },
  },
};

/**
 * Repository with many topics
 */
export const ManyTopics: Story = {
  args: {
    repository: {
      ...mockRepository,
      repositoryTopics: {
        nodes: [
          { topic: { name: 'react' } },
          { topic: { name: 'typescript' } },
          { topic: { name: 'vite' } },
          { topic: { name: 'graphql' } },
          { topic: { name: 'apollo' } },
          { topic: { name: 'testing' } },
          { topic: { name: 'storybook' } },
          { topic: { name: 'vitest' } },
        ],
      },
    },
  },
};

/**
 * Compact version of the card (less details)
 */
export const CompactCard: Story = {
  args: {
    repository: mockRepository,
    compact: true,
  },
};

/**
 * Repository with click handler
 */
export const Clickable: Story = {
  args: {
    repository: mockRepository,
    onClick: (repo) => {
      alert(`Clicked repository: ${repo.name}`);
    },
  },
};

/**
 * Python repository (different language color)
 */
export const PythonRepository: Story = {
  args: {
    repository: {
      ...mockRepository,
      name: 'python-ml-toolkit',
      description: 'Machine learning toolkit with scikit-learn and TensorFlow',
      primaryLanguage: { name: 'Python' },
      repositoryTopics: {
        nodes: [
          { topic: { name: 'python' } },
          { topic: { name: 'machine-learning' } },
          { topic: { name: 'tensorflow' } },
        ],
      },
    },
  },
};

/**
 * Go repository (different language color)
 */
export const GoRepository: Story = {
  args: {
    repository: {
      ...mockRepository,
      name: 'go-api-server',
      description: 'High-performance REST API server built with Go and Gin framework',
      primaryLanguage: { name: 'Go' },
      repositoryTopics: {
        nodes: [
          { topic: { name: 'go' } },
          { topic: { name: 'api' } },
          { topic: { name: 'rest' } },
        ],
      },
    },
  },
};
