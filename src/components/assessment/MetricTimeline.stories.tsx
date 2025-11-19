import type { Meta, StoryObj } from '@storybook/react-vite';
import { MetricTimeline } from './MetricTimeline';
import type { YearData } from '@/hooks/useUserAnalytics';

// Mock data generators
const mockRepo = (name: string, stars: number, commits: number) => ({
  repository: {
    name,
    nameWithOwner: `user/${name}`,
    description: `Description for ${name}`,
    stargazerCount: stars,
    forkCount: Math.floor(stars / 3),
    primaryLanguage: { name: 'TypeScript', color: '#3178c6' },
    isPrivate: false,
    isFork: false,
    owner: { login: 'user' },
    url: `https://github.com/user/${name}`,
  },
  contributions: {
    totalCount: commits,
  },
});

const mockContribution = (name: string, owner: string, stars: number, commits: number) => ({
  repository: {
    name,
    nameWithOwner: `${owner}/${name}`,
    description: `Open source project ${name}`,
    stargazerCount: stars,
    forkCount: Math.floor(stars / 3),
    primaryLanguage: { name: 'JavaScript', color: '#f1e05a' },
    isPrivate: false,
    isFork: false,
    owner: { login: owner },
    url: `https://github.com/${owner}/${name}`,
  },
  contributions: {
    totalCount: commits,
  },
});

// Growth trajectory: low -> moderate -> high activity
const growingTimeline: YearData[] = [
  {
    year: 2022,
    totalCommits: 150,
    totalIssues: 10,
    totalPRs: 15,
    totalReviews: 5,
    ownedRepos: [mockRepo('starter-project', 20, 100)],
    contributions: [mockContribution('react', 'facebook', 50000, 50)],
  },
  {
    year: 2023,
    totalCommits: 500,
    totalIssues: 30,
    totalPRs: 45,
    totalReviews: 20,
    ownedRepos: [
      mockRepo('web-app', 150, 300),
      mockRepo('cli-tool', 80, 200),
    ],
    contributions: [
      mockContribution('react', 'facebook', 50000, 100),
      mockContribution('vite', 'vitejs', 30000, 100),
    ],
  },
  {
    year: 2024,
    totalCommits: 1200,
    totalIssues: 80,
    totalPRs: 120,
    totalReviews: 60,
    ownedRepos: [
      mockRepo('web-app', 500, 600),
      mockRepo('cli-tool', 300, 300),
      mockRepo('api-server', 250, 300),
    ],
    contributions: [
      mockContribution('react', 'facebook', 50000, 200),
      mockContribution('vite', 'vitejs', 30000, 150),
      mockContribution('typescript', 'microsoft', 40000, 150),
    ],
  },
];

// Declining trajectory: high -> moderate -> low
const decliningTimeline: YearData[] = [
  {
    year: 2022,
    totalCommits: 1500,
    totalIssues: 100,
    totalPRs: 150,
    totalReviews: 80,
    ownedRepos: [
      mockRepo('major-project', 800, 800),
      mockRepo('side-project', 300, 400),
      mockRepo('tool', 200, 300),
    ],
    contributions: [
      mockContribution('react', 'facebook', 50000, 300),
      mockContribution('vue', 'vuejs', 40000, 200),
    ],
  },
  {
    year: 2023,
    totalCommits: 600,
    totalIssues: 40,
    totalPRs: 60,
    totalReviews: 30,
    ownedRepos: [mockRepo('major-project', 1000, 400)],
    contributions: [mockContribution('react', 'facebook', 50000, 200)],
  },
  {
    year: 2024,
    totalCommits: 200,
    totalIssues: 10,
    totalPRs: 20,
    totalReviews: 5,
    ownedRepos: [mockRepo('major-project', 1100, 150)],
    contributions: [mockContribution('react', 'facebook', 50000, 50)],
  },
];

// Consistent activity over many years
const consistentTimeline: YearData[] = [
  {
    year: 2020,
    totalCommits: 800,
    totalIssues: 50,
    totalPRs: 80,
    totalReviews: 40,
    ownedRepos: [mockRepo('project-a', 200, 500)],
    contributions: [mockContribution('react', 'facebook', 50000, 300)],
  },
  {
    year: 2021,
    totalCommits: 850,
    totalIssues: 55,
    totalPRs: 85,
    totalReviews: 42,
    ownedRepos: [mockRepo('project-a', 300, 500), mockRepo('project-b', 150, 350)],
    contributions: [mockContribution('react', 'facebook', 50000, 300)],
  },
  {
    year: 2022,
    totalCommits: 820,
    totalIssues: 52,
    totalPRs: 82,
    totalReviews: 41,
    ownedRepos: [mockRepo('project-a', 400, 500), mockRepo('project-b', 250, 320)],
    contributions: [mockContribution('react', 'facebook', 50000, 300)],
  },
  {
    year: 2023,
    totalCommits: 880,
    totalIssues: 56,
    totalPRs: 88,
    totalReviews: 44,
    ownedRepos: [mockRepo('project-a', 500, 500), mockRepo('project-b', 350, 380)],
    contributions: [mockContribution('react', 'facebook', 50000, 300)],
  },
  {
    year: 2024,
    totalCommits: 900,
    totalIssues: 58,
    totalPRs: 90,
    totalReviews: 45,
    ownedRepos: [mockRepo('project-a', 600, 500), mockRepo('project-b', 450, 400)],
    contributions: [mockContribution('react', 'facebook', 50000, 300)],
  },
];

// Single year
const singleYear: YearData[] = [
  {
    year: 2024,
    totalCommits: 500,
    totalIssues: 30,
    totalPRs: 45,
    totalReviews: 20,
    ownedRepos: [mockRepo('my-project', 150, 400)],
    contributions: [mockContribution('react', 'facebook', 50000, 100)],
  },
];

// Empty timeline
const emptyTimeline: YearData[] = [];

const meta = {
  title: 'Components/Assessment/MetricTimeline',
  component: MetricTimeline,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof MetricTimeline>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default timeline showing growth over 3 years
 */
export const Default: Story = {
  args: {
    timeline: growingTimeline,
  },
};

/**
 * Timeline showing declining activity
 */
export const DecliningActivity: Story = {
  args: {
    timeline: decliningTimeline,
  },
};

/**
 * Consistent activity over 5 years
 */
export const ConsistentActivity: Story = {
  args: {
    timeline: consistentTimeline,
  },
};

/**
 * Single year of data
 */
export const SingleYear: Story = {
  args: {
    timeline: singleYear,
  },
};

/**
 * Loading state
 */
export const Loading: Story = {
  args: {
    timeline: [],
    loading: true,
  },
};

/**
 * Empty state (no data)
 */
export const Empty: Story = {
  args: {
    timeline: emptyTimeline,
  },
};

/**
 * Custom height
 */
export const CustomHeight: Story = {
  args: {
    timeline: growingTimeline,
    height: 600,
  },
};
