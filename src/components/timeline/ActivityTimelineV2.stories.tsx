import type { Meta, StoryObj } from "@storybook/react-vite";
import type { YearData } from "@/hooks/useUserAnalytics";
import { ActivityTimelineV2 } from "./ActivityTimelineV2";

const meta: Meta<typeof ActivityTimelineV2> = {
  title: "Timeline/ActivityTimelineV2",
  component: ActivityTimelineV2,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
ActivityTimelineV2 is a drop-in replacement for ActivityTimeline with 3-level progressive disclosure:

- **Level 0**: Collapsed year rows (default) - scan all years at a glance
- **Level 1**: Expanded year with Framer Motion animated project cards
- **Level 2**: Full analytics modal with 4 tabs (Overview, Timeline, Code, Team)

**Key Features:**
- All years collapsed by default
- URL persistence for modal state (\`?modal=projectId&tab=tabName\`)
- Accessibility: respects \`prefers-reduced-motion\`
- Responsive: Sheet on mobile, Dialog on desktop
        `,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    timeline: {
      description: "Array of year data from useUserAnalytics",
    },
    loading: {
      description: "Show loading skeleton",
      control: { type: "boolean" },
    },
    username: {
      description: "GitHub username for ownership detection",
      control: { type: "text" },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ActivityTimelineV2>;

// Helper to create mock year data
const createYearData = (
  year: number,
  commits: number,
  ownedCount: number,
  contribCount: number,
): YearData => {
  const ownedRepos = Array.from({ length: ownedCount }, (_, i) => ({
    contributions: { totalCount: Math.floor(commits / (ownedCount + 1)) },
    repository: {
      id: `owned-${year}-${i}`,
      name: `project-${year}-${i + 1}`,
      nameWithOwner: `developer/project-${year}-${i + 1}`,
      url: `https://github.com/developer/project-${year}-${i + 1}`,
      description: `A project from ${year}`,
      createdAt: `${year}-01-01T00:00:00Z`,
      updatedAt: `${year}-12-01T00:00:00Z`,
      pushedAt: `${year}-12-01T00:00:00Z`,
      stargazerCount: Math.floor(Math.random() * 500),
      forkCount: Math.floor(Math.random() * 50),
      isFork: false,
      isTemplate: false,
      isArchived: false,
      isPrivate: false,
      diskUsage: 1000,
      homepageUrl: null,
      primaryLanguage: { name: "TypeScript", color: "#3178c6" },
      owner: { login: "developer", avatarUrl: "https://github.com/developer.png" },
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
    contributions: { totalCount: Math.floor(commits / (contribCount + 3)) },
    repository: {
      id: `contrib-${year}-${i}`,
      name: `oss-lib-${i + 1}`,
      nameWithOwner: `org/oss-lib-${i + 1}`,
      url: `https://github.com/org/oss-lib-${i + 1}`,
      description: `Open source library`,
      createdAt: `${year - 2}-01-01T00:00:00Z`,
      updatedAt: `${year}-12-01T00:00:00Z`,
      pushedAt: `${year}-12-01T00:00:00Z`,
      stargazerCount: Math.floor(Math.random() * 5000 + 500),
      forkCount: Math.floor(Math.random() * 500),
      isFork: false,
      isTemplate: false,
      isArchived: false,
      isPrivate: false,
      diskUsage: 5000,
      homepageUrl: null,
      primaryLanguage: { name: "JavaScript", color: "#f1e05a" },
      owner: { login: "org", avatarUrl: "https://github.com/org.png" },
      parent: null,
      watchers: { totalCount: 50 },
      issues: { totalCount: 25 },
      repositoryTopics: { nodes: [] },
      languages: { totalSize: 5000, edges: [] },
      licenseInfo: null,
      defaultBranchRef: null,
    },
  }));

  return {
    year,
    totalCommits: commits,
    totalPRs: Math.floor(commits / 10),
    totalIssues: Math.floor(commits / 15),
    totalReviews: Math.floor(commits / 5),
    ownedRepos,
    contributions,
  };
};

/**
 * Default state with multiple years (all collapsed)
 */
export const Default: Story = {
  args: {
    timeline: [
      createYearData(2024, 800, 4, 6),
      createYearData(2023, 600, 3, 5),
      createYearData(2022, 400, 2, 4),
      createYearData(2021, 200, 1, 2),
    ],
    loading: false,
    username: "developer",
  },
};

/**
 * Loading state with skeleton
 */
export const Loading: Story = {
  args: {
    timeline: [],
    loading: true,
    username: "developer",
  },
};

/**
 * Empty state with no activity
 */
export const Empty: Story = {
  args: {
    timeline: [],
    loading: false,
    username: "developer",
  },
};

/**
 * Single year of activity
 */
export const SingleYear: Story = {
  args: {
    timeline: [createYearData(2024, 500, 3, 4)],
    loading: false,
    username: "developer",
  },
};

/**
 * Long timeline (10+ years)
 */
export const LongTimeline: Story = {
  args: {
    timeline: Array.from({ length: 10 }, (_, i) => {
      const year = 2024 - i;
      const commits = Math.max(100, 1000 - i * 100 + Math.floor(Math.random() * 200));
      return createYearData(year, commits, Math.floor(commits / 200), Math.floor(commits / 150));
    }),
    loading: false,
    username: "developer",
  },
  parameters: {
    docs: {
      description: {
        story: "A 10-year timeline showing activity trends over time. All years start collapsed.",
      },
    },
  },
};

/**
 * High activity developer with many projects
 */
export const HighActivity: Story = {
  args: {
    timeline: [
      createYearData(2024, 1500, 8, 12),
      createYearData(2023, 1200, 6, 10),
      createYearData(2022, 1000, 5, 8),
    ],
    loading: false,
    username: "developer",
  },
  parameters: {
    docs: {
      description: {
        story: "A very active developer with 1000+ commits per year.",
      },
    },
  },
};

/**
 * Interactive exploration - click years to expand
 */
export const Interactive: Story = {
  args: {
    timeline: [
      createYearData(2024, 700, 4, 5),
      createYearData(2023, 500, 3, 4),
      createYearData(2022, 300, 2, 3),
    ],
    loading: false,
    username: "developer",
  },
  parameters: {
    docs: {
      description: {
        story: `
**Interactive Demo:**
1. Click a year bar to expand (Level 1)
2. Click a project card to see details
3. Click "View Analytics" to open modal (Level 2)
4. Switch between tabs: Overview, Timeline, Code, Team
        `,
      },
    },
  },
};
