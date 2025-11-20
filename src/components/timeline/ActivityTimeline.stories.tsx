import type { YearData } from "@/hooks/useUserAnalytics";
import { createMockRepository } from "@/test/mocks/github-data";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { ActivityTimeline } from "./ActivityTimeline";

const meta: Meta<typeof ActivityTimeline> = {
  title: "Timeline/ActivityTimeline",
  component: ActivityTimeline,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj<typeof ActivityTimeline>;

// Use centralized mock factory (Week 4 P3: Mock data consolidation)
const mockRepository = createMockRepository({
  name: "github-users",
  url: "https://github.com/user/github-users",
  description: "GitHub user analytics dashboard built with React and Apollo",
  stargazerCount: 145,
  forkCount: 23,
  watchers: { totalCount: 12 },
  primaryLanguage: { name: "TypeScript", color: "#3178c6" },
  repositoryTopics: { nodes: [] },
  updatedAt: "2025-01-15T10:30:00Z",
  defaultBranchRef: null,
});

// Mock year data
const mockTimeline: YearData[] = [
  {
    year: 2025,
    totalCommits: 450,
    totalIssues: 30,
    totalPRs: 25,
    totalReviews: 15,
    ownedRepos: [
      {
        repository: { ...mockRepository, name: "awesome-project" },
        contributions: { totalCount: 200 },
      },
      {
        repository: { ...mockRepository, name: "cool-app", stargazerCount: 89 },
        contributions: { totalCount: 150 },
      },
    ],
    contributions: [
      {
        repository: {
          ...mockRepository,
          name: "react",
          description:
            "A declarative, efficient, and flexible JavaScript library",
          stargazerCount: 230000,
        },
        contributions: { totalCount: 50 },
      },
    ],
  },
  {
    year: 2024,
    totalCommits: 320,
    totalIssues: 20,
    totalPRs: 15,
    totalReviews: 10,
    ownedRepos: [
      {
        repository: { ...mockRepository, name: "old-project" },
        contributions: { totalCount: 180 },
      },
    ],
    contributions: [],
  },
  {
    year: 2023,
    totalCommits: 180,
    totalIssues: 12,
    totalPRs: 8,
    totalReviews: 5,
    ownedRepos: [],
    contributions: [
      {
        repository: {
          ...mockRepository,
          name: "open-source-lib",
          stargazerCount: 5600,
        },
        contributions: { totalCount: 120 },
      },
    ],
  },
];

export const Default: Story = {
  args: {
    timeline: mockTimeline,
  },
};

export const Loading: Story = {
  args: {
    timeline: [],
    loading: true,
  },
};

export const Empty: Story = {
  args: {
    timeline: [],
  },
};

export const SingleYear: Story = {
  args: {
    timeline: [mockTimeline[0]],
  },
};

export const ManyYears: Story = {
  args: {
    timeline: [
      ...mockTimeline,
      {
        year: 2022,
        totalCommits: 90,
        totalIssues: 5,
        totalPRs: 4,
        totalReviews: 2,
        ownedRepos: [],
        contributions: [],
      },
      {
        year: 2021,
        totalCommits: 45,
        totalIssues: 3,
        totalPRs: 2,
        totalReviews: 1,
        ownedRepos: [],
        contributions: [],
      },
    ],
  },
};

export const NoActivity: Story = {
  args: {
    timeline: [
      {
        year: 2020,
        totalCommits: 0,
        totalIssues: 0,
        totalPRs: 0,
        totalReviews: 0,
        ownedRepos: [],
        contributions: [],
      },
    ],
  },
};
