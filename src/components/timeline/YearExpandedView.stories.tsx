import type { Meta, StoryObj } from '@storybook/react-vite'
import { YearExpandedView } from './YearExpandedView'
import { createMockRepository } from '@/test/mocks/github-data'
import type { YearData } from '@/hooks/useUserAnalytics'

const meta: Meta<typeof YearExpandedView> = {
  title: 'Timeline/YearExpandedView',
  component: YearExpandedView,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
}

export default meta
type Story = StoryObj<typeof YearExpandedView>

// Use centralized mock factory (Week 4 P3: Mock data consolidation)
const mockRepository = createMockRepository({
  name: 'github-users',
  url: 'https://github.com/user/github-users',
  description: 'GitHub user analytics dashboard built with React and Apollo',
  stargazerCount: 145,
  forkCount: 23,
  watchers: { totalCount: 12 },
  primaryLanguage: { name: 'TypeScript', color: '#3178c6' },
  repositoryTopics: { nodes: [] },
  updatedAt: '2025-01-15T10:30:00Z',
  defaultBranchRef: null,
})

const mockYearWithBoth: YearData = {
  year: 2025,
  totalCommits: 450,
  totalIssues: 30,
  totalPRs: 25,
  totalReviews: 15,
  ownedRepos: [
    {
      repository: {
        ...mockRepository,
        name: 'awesome-project',
        stargazerCount: 450,
      },
      contributions: { totalCount: 200 },
    },
    {
      repository: {
        ...mockRepository,
        name: 'cool-app',
        stargazerCount: 89,
        description: 'An amazing application that does cool stuff',
      },
      contributions: { totalCount: 150 },
    },
    {
      repository: {
        ...mockRepository,
        name: 'tiny-tool',
        stargazerCount: 12,
        description: 'A small utility',
      },
      contributions: { totalCount: 50 },
    },
  ],
  contributions: [
    {
      repository: {
        ...mockRepository,
        name: 'react',
        description: 'A declarative, efficient, and flexible JavaScript library',
        stargazerCount: 230000,
      },
      contributions: { totalCount: 50 },
    },
    {
      repository: {
        ...mockRepository,
        name: 'typescript',
        description: 'TypeScript is a superset of JavaScript',
        stargazerCount: 105000,
      },
      contributions: { totalCount: 30 },
    },
  ],
}

const mockYearOwnedOnly: YearData = {
  year: 2024,
  totalCommits: 280,
  totalIssues: 15,
  totalPRs: 12,
  totalReviews: 8,
  ownedRepos: [
    {
      repository: { ...mockRepository, name: 'my-project-1', stargazerCount: 200 },
      contributions: { totalCount: 150 },
    },
    {
      repository: { ...mockRepository, name: 'my-project-2', stargazerCount: 80 },
      contributions: { totalCount: 130 },
    },
  ],
  contributions: [],
}

const mockYearContributionsOnly: YearData = {
  year: 2023,
  totalCommits: 180,
  totalIssues: 12,
  totalPRs: 10,
  totalReviews: 6,
  ownedRepos: [],
  contributions: [
    {
      repository: {
        ...mockRepository,
        name: 'open-source-lib',
        stargazerCount: 5600,
        description: 'Popular open source library',
      },
      contributions: { totalCount: 120 },
    },
    {
      repository: {
        ...mockRepository,
        name: 'community-tool',
        stargazerCount: 890,
        description: 'Community-driven development tool',
      },
      contributions: { totalCount: 60 },
    },
  ],
}

const mockYearEmpty: YearData = {
  year: 2020,
  totalCommits: 0,
  totalIssues: 0,
  totalPRs: 0,
  totalReviews: 0,
  ownedRepos: [],
  contributions: [],
}

export const BothOwnedAndContributions: Story = {
  args: {
    year: mockYearWithBoth,
  },
}

export const OnlyOwnedRepos: Story = {
  args: {
    year: mockYearOwnedOnly,
  },
}

export const OnlyContributions: Story = {
  args: {
    year: mockYearContributionsOnly,
  },
}

export const NoRepositories: Story = {
  args: {
    year: mockYearEmpty,
  },
}

export const ManyRepositories: Story = {
  args: {
    year: {
      ...mockYearWithBoth,
      ownedRepos: Array.from({ length: 12 }, (_, i) => ({
        repository: {
          ...mockRepository,
          name: `project-${i + 1}`,
          stargazerCount: Math.floor(Math.random() * 1000),
        },
        contributions: { totalCount: Math.floor(Math.random() * 100) },
      })),
    },
  },
}
