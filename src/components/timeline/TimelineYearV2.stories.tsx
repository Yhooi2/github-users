import type { Meta, StoryObj } from "@storybook/react-vite";
import type { YearData } from "@/hooks/useUserAnalytics";
import { TimelineYearV2 } from "./TimelineYearV2";

const meta: Meta<typeof TimelineYearV2> = {
  title: "Timeline/TimelineYearV2",
  component: TimelineYearV2,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
TimelineYearV2 implements 3-level progressive disclosure:

- **Level 0**: Collapsed year bar (56px) - shows year, commit bar, and stats
- **Level 1**: Expanded with project cards (Framer Motion animated)
- **Level 2**: Full analytics modal with 4 tabs

All years start **collapsed by default** to provide overview-first UX.
        `,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    year: {
      description: "Year data from useUserAnalytics hook",
    },
    maxCommits: {
      description: "Maximum commits across all years (for bar normalization)",
      control: { type: "number", min: 0, max: 5000 },
    },
    username: {
      description: "GitHub username for ownership detection",
      control: { type: "text" },
    },
  },
};

export default meta;
type Story = StoryObj<typeof TimelineYearV2>;

// Helper to create mock year data
const createYearData = (
  year: number,
  commits: number,
  prs: number,
  ownedCount: number,
  contribCount: number,
): YearData => {
  const ownedRepos = Array.from({ length: ownedCount }, (_, i) => ({
    contributions: { totalCount: Math.floor(commits / (ownedCount + 1) * (i + 1)) },
    repository: {
      id: `owned-${year}-${i}`,
      name: `my-project-${i + 1}`,
      nameWithOwner: `testuser/my-project-${i + 1}`,
      url: `https://github.com/testuser/my-project-${i + 1}`,
      description: `A personal project from ${year}`,
      createdAt: `${year}-01-01T00:00:00Z`,
      updatedAt: `${year}-12-01T00:00:00Z`,
      pushedAt: `${year}-12-01T00:00:00Z`,
      stargazerCount: Math.floor(Math.random() * 1000),
      forkCount: Math.floor(Math.random() * 100),
      isFork: false,
      isTemplate: false,
      isArchived: false,
      isPrivate: false,
      diskUsage: 1000,
      homepageUrl: null,
      primaryLanguage: { name: "TypeScript", color: "#3178c6" },
      owner: { login: "testuser", avatarUrl: "https://github.com/testuser.png" },
      parent: null,
      watchers: { totalCount: 10 },
      issues: { totalCount: 5 },
      repositoryTopics: { nodes: [] },
      languages: { totalSize: 1000, edges: [] },
      licenseInfo: null,
      defaultBranchRef: null,
    },
  }));

  const contributions = Array.from({ length: contribCount }, (_, i) => ({
    contributions: { totalCount: Math.floor(commits / (contribCount + 5) * (i + 1)) },
    repository: {
      id: `contrib-${year}-${i}`,
      name: `open-source-lib-${i + 1}`,
      nameWithOwner: `org/open-source-lib-${i + 1}`,
      url: `https://github.com/org/open-source-lib-${i + 1}`,
      description: `A popular open source library`,
      createdAt: `${year - 2}-01-01T00:00:00Z`,
      updatedAt: `${year}-12-01T00:00:00Z`,
      pushedAt: `${year}-12-01T00:00:00Z`,
      stargazerCount: Math.floor(Math.random() * 10000 + 1000),
      forkCount: Math.floor(Math.random() * 1000),
      isFork: false,
      isTemplate: false,
      isArchived: false,
      isPrivate: false,
      diskUsage: 10000,
      homepageUrl: null,
      primaryLanguage: { name: "JavaScript", color: "#f1e05a" },
      owner: { login: "org", avatarUrl: "https://github.com/org.png" },
      parent: null,
      watchers: { totalCount: 100 },
      issues: { totalCount: 50 },
      repositoryTopics: { nodes: [] },
      languages: { totalSize: 10000, edges: [] },
      licenseInfo: null,
      defaultBranchRef: null,
    },
  }));

  return {
    year,
    totalCommits: commits,
    totalPRs: prs,
    totalIssues: Math.floor(prs * 0.6),
    totalReviews: Math.floor(prs * 2),
    ownedRepos,
    contributions,
  };
};

/**
 * Default collapsed state (Level 0)
 */
export const Collapsed: Story = {
  args: {
    year: createYearData(2024, 500, 50, 3, 5),
    maxCommits: 1000,
    username: "testuser",
  },
};

/**
 * High activity year with many commits
 */
export const HighActivity: Story = {
  args: {
    year: createYearData(2024, 1500, 150, 5, 8),
    maxCommits: 1500,
    username: "testuser",
  },
};

/**
 * Low activity year with few commits
 */
export const LowActivity: Story = {
  args: {
    year: createYearData(2022, 50, 5, 1, 1),
    maxCommits: 1000,
    username: "testuser",
  },
};

/**
 * Year with only owned projects (no contributions)
 */
export const OnlyOwnedProjects: Story = {
  args: {
    year: createYearData(2023, 300, 30, 4, 0),
    maxCommits: 500,
    username: "testuser",
  },
};

/**
 * Year with only contributions (no owned projects)
 */
export const OnlyContributions: Story = {
  args: {
    year: createYearData(2023, 200, 20, 0, 6),
    maxCommits: 500,
    username: "testuser",
  },
};

/**
 * Empty year with no repositories
 */
export const EmptyYear: Story = {
  args: {
    year: createYearData(2021, 0, 0, 0, 0),
    maxCommits: 500,
    username: "testuser",
  },
};

/**
 * Interactive - click to expand and explore Level 1
 */
export const Interactive: Story = {
  args: {
    year: createYearData(2024, 800, 80, 4, 6),
    maxCommits: 1000,
    username: "testuser",
  },
  parameters: {
    docs: {
      description: {
        story: "Click the year bar to expand and see Level 1 project cards. Click a project card to expand its details, then click 'View Analytics' to open Level 2 modal.",
      },
    },
  },
};
