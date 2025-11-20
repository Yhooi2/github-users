import type { Meta, StoryObj } from '@storybook/react-vite'
import { TimelineYear } from './TimelineYear'
import { createMockRepository } from '@/test/mocks/github-data'
import type { YearData } from '@/hooks/useUserAnalytics'

const meta: Meta<typeof TimelineYear> = {
  title: 'Timeline/TimelineYear',
  component: TimelineYear,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
}

export default meta
type Story = StoryObj<typeof TimelineYear>

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

// Mock year with high activity
const highActivityYear: YearData = {
  year: 2025,
  totalCommits: 450,
  totalIssues: 30,
  totalPRs: 25,
  totalReviews: 15,
  ownedRepos: [
    {
      repository: { ...mockRepository, name: 'awesome-project' },
      contributions: { totalCount: 200 },
    },
    {
      repository: { ...mockRepository, name: 'cool-app', stargazerCount: 89 },
      contributions: { totalCount: 150 },
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
  ],
}

// Mock year with low activity
const lowActivityYear: YearData = {
  year: 2020,
  totalCommits: 45,
  totalIssues: 3,
  totalPRs: 2,
  totalReviews: 1,
  ownedRepos: [
    {
      repository: mockRepository,
      contributions: { totalCount: 30 },
    },
  ],
  contributions: [],
}

// Mock year with no activity
const noActivityYear: YearData = {
  year: 2019,
  totalCommits: 0,
  totalIssues: 0,
  totalPRs: 0,
  totalReviews: 0,
  ownedRepos: [],
  contributions: [],
}

export const HighActivity: Story = {
  args: {
    year: highActivityYear,
    maxCommits: 500,
  },
}

export const LowActivity: Story = {
  args: {
    year: lowActivityYear,
    maxCommits: 500,
  },
}

export const NoActivity: Story = {
  args: {
    year: noActivityYear,
    maxCommits: 500,
  },
}

export const MaxActivity: Story = {
  args: {
    year: highActivityYear,
    maxCommits: 450, // Same as year's commits (100% bar)
  },
}

export const OnlyOwnedRepos: Story = {
  args: {
    year: {
      year: 2024,
      totalCommits: 280,
      totalIssues: 15,
      totalPRs: 12,
      totalReviews: 8,
      ownedRepos: [
        {
          repository: { ...mockRepository, name: 'my-project-1' },
          contributions: { totalCount: 150 },
        },
        {
          repository: { ...mockRepository, name: 'my-project-2' },
          contributions: { totalCount: 130 },
        },
      ],
      contributions: [],
    },
    maxCommits: 500,
  },
}

export const OnlyContributions: Story = {
  args: {
    year: {
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
          },
          contributions: { totalCount: 120 },
        },
        {
          repository: {
            ...mockRepository,
            name: 'community-tool',
            stargazerCount: 890,
          },
          contributions: { totalCount: 60 },
        },
      ],
    },
    maxCommits: 500,
  },
}
