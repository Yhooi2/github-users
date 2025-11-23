import type { Meta, StoryObj } from "@storybook/react-vite";
import type { YearData } from "@/hooks/useUserAnalytics";
import { DesktopTimelineLayout } from "./DesktopTimelineLayout";

const meta: Meta<typeof DesktopTimelineLayout> = {
  title: "Timeline/DesktopTimelineLayout",
  component: DesktopTimelineLayout,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `
DesktopTimelineLayout implements the 33/67 split layout for desktop screens (>=1440px).

**Structure:**
- **Left panel (33%)**: Scrollable sidebar with YearCard components
- **Right panel (67%)**: YearDetailPanel showing stats and projects

**Key Features:**
- CSS Grid with \`1fr 2fr\` for 33/67 split ratio
- ScrollArea for both panels with custom scrollbar styling
- First year selected by default
- Full progressive disclosure (Level 0/1/2) in right panel

**Usage:**
This component is automatically used by ActivityTimelineV2 on desktop (>=1440px).
On tablet/mobile, the accordion layout is used instead.
        `,
      },
    },
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="h-screen w-full p-4">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof DesktopTimelineLayout>;

// Create mock year data (same helper as other stories)
const createYearData = (
  year: number,
  commits: number,
  ownedCount: number,
  contribCount: number
): YearData => {
  const ownedRepos = Array.from({ length: ownedCount }, (_, i) => ({
    contributions: { totalCount: Math.floor(commits / (ownedCount + 1)) },
    repository: {
      id: `owned-${year}-${i}`,
      name: `project-${year}-${i + 1}`,
      nameWithOwner: `developer/project-${year}-${i + 1}`,
      url: `https://github.com/developer/project-${year}-${i + 1}`,
      description: `A project from ${year} with detailed description of functionality.`,
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
      owner: {
        login: "developer",
        avatarUrl: "https://github.com/developer.png",
      },
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
      description: `Popular open source library for building applications.`,
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
 * Default layout with 4 years of activity
 */
export const Default: Story = {
  args: {
    timeline: [
      createYearData(2024, 800, 4, 6),
      createYearData(2023, 600, 3, 5),
      createYearData(2022, 400, 2, 4),
      createYearData(2021, 200, 1, 2),
    ],
    username: "developer",
  },
};

/**
 * Long timeline with many years (scrollable sidebar)
 */
export const LongTimeline: Story = {
  args: {
    timeline: Array.from({ length: 10 }, (_, i) => {
      const year = 2024 - i;
      const commits = Math.max(
        100,
        1000 - i * 100 + Math.floor(Math.random() * 200)
      );
      return createYearData(
        year,
        commits,
        Math.floor(commits / 200),
        Math.floor(commits / 150)
      );
    }),
    username: "developer",
  },
  parameters: {
    docs: {
      description: {
        story:
          "10-year timeline demonstrating scrollable sidebar with many year cards.",
      },
    },
  },
};

/**
 * High activity developer
 */
export const HighActivity: Story = {
  args: {
    timeline: [
      createYearData(2024, 1500, 8, 12),
      createYearData(2023, 1200, 6, 10),
      createYearData(2022, 1000, 5, 8),
    ],
    username: "developer",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Very active developer with 1000+ commits per year and many projects.",
      },
    },
  },
};

/**
 * Single year of activity
 */
export const SingleYear: Story = {
  args: {
    timeline: [createYearData(2024, 500, 3, 4)],
    username: "developer",
  },
};

/**
 * Minimal activity
 */
export const MinimalActivity: Story = {
  args: {
    timeline: [
      createYearData(2024, 50, 1, 1),
      createYearData(2023, 30, 1, 0),
    ],
    username: "developer",
  },
  parameters: {
    docs: {
      description: {
        story: "Developer with minimal activity showing small bars.",
      },
    },
  },
};
