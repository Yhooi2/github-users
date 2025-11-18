import type { Meta, StoryObj } from '@storybook/react';
import { ProjectSection } from './ProjectSection';
import type { Repository } from '@/apollo/github-api.types';

// Mock repository data
const createMockRepository = (
  id: string,
  name: string,
  description: string,
  stars: number
): Repository => ({
  id,
  name,
  description,
  url: `https://github.com/user/${name}`,
  stargazerCount: stars,
  forkCount: Math.floor(stars / 10),
  isFork: false,
  isTemplate: false,
  parent: null,
  createdAt: '2023-01-15T10:30:00Z',
  updatedAt: '2024-11-05T14:22:00Z',
  pushedAt: '2024-11-05T14:22:00Z',
  diskUsage: 5000,
  isArchived: false,
  homepageUrl: null,
  owner: {
    login: 'user',
    avatarUrl: 'https://avatars.githubusercontent.com/u/123456',
  },
  watchers: { totalCount: Math.floor(stars / 20) },
  issues: { totalCount: 12 },
  repositoryTopics: {
    nodes: [
      { topic: { name: 'react' } },
      { topic: { name: 'typescript' } },
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
});

const ownedProjects: Repository[] = [
  createMockRepository('1', 'my-awesome-app', 'A comprehensive React application', 1234),
  createMockRepository('2', 'cli-tool', 'A powerful command line utility', 567),
  createMockRepository('3', 'website', 'Personal portfolio website', 89),
  createMockRepository('4', 'api-server', 'RESTful API server with Node.js', 234),
];

const contributionProjects: Repository[] = [
  createMockRepository('5', 'react', 'A JavaScript library for building user interfaces', 234567),
  createMockRepository('6', 'typescript', 'TypeScript language compiler', 123456),
  createMockRepository('7', 'vite', 'Next generation frontend tooling', 78901),
];

/**
 * ProjectSection displays categorized repositories:
 * - Owned Projects (👤): Repositories owned by the user
 * - Open Source Contributions (👥): Repositories contributed to
 *
 * Part of Phase 5: Layout Refactoring for single-page progressive disclosure.
 */
const meta = {
  title: 'Projects/ProjectSection',
  component: ProjectSection,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Displays user projects separated into owned repositories and open source contributions. Uses responsive grid layout.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    loading: {
      control: 'boolean',
      description: 'Loading state for the section',
    },
  },
} satisfies Meta<typeof ProjectSection>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default state with both owned projects and contributions
 */
export const Default: Story = {
  args: {
    projects: {
      owned: ownedProjects,
      contributions: contributionProjects,
    },
    loading: false,
  },
};

/**
 * Only owned projects, no contributions
 */
export const OnlyOwnedProjects: Story = {
  args: {
    projects: {
      owned: ownedProjects,
      contributions: [],
    },
    loading: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'User has created repositories but has not contributed to other projects.',
      },
    },
  },
};

/**
 * Only contributions, no owned projects
 */
export const OnlyContributions: Story = {
  args: {
    projects: {
      owned: [],
      contributions: contributionProjects,
    },
    loading: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'User has contributed to open source but does not have their own repositories.',
      },
    },
  },
};

/**
 * Empty state - no projects or contributions
 */
export const Empty: Story = {
  args: {
    projects: {
      owned: [],
      contributions: [],
    },
    loading: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'No repositories found for this user.',
      },
    },
  },
};

/**
 * Loading state with skeleton placeholders
 */
export const Loading: Story = {
  args: {
    projects: {
      owned: [],
      contributions: [],
    },
    loading: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows loading skeleton while fetching repository data.',
      },
    },
  },
};

/**
 * Single owned project
 */
export const SingleOwnedProject: Story = {
  args: {
    projects: {
      owned: [ownedProjects[0]],
      contributions: [],
    },
    loading: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'User with only one owned repository.',
      },
    },
  },
};

/**
 * Many projects - tests scrolling and layout
 */
export const ManyProjects: Story = {
  args: {
    projects: {
      owned: [...ownedProjects, ...ownedProjects.map((p, i) => ({ ...p, id: `owned-${i}` }))],
      contributions: [
        ...contributionProjects,
        ...contributionProjects.map((p, i) => ({ ...p, id: `contrib-${i}` })),
      ],
    },
    loading: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'User with many repositories - tests grid layout with multiple rows.',
      },
    },
  },
};

/**
 * Mobile viewport
 */
export const Mobile: Story = {
  args: {
    projects: {
      owned: ownedProjects.slice(0, 2),
      contributions: contributionProjects.slice(0, 2),
    },
    loading: false,
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'ProjectSection on mobile devices (single column layout).',
      },
    },
  },
};

/**
 * Tablet viewport
 */
export const Tablet: Story = {
  args: {
    projects: {
      owned: ownedProjects,
      contributions: contributionProjects.slice(0, 2),
    },
    loading: false,
  },
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
    docs: {
      description: {
        story: 'ProjectSection on tablet devices (2 column grid).',
      },
    },
  },
};
