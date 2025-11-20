import type {
  CommitActivity,
  LanguageStats,
  YearlyCommitStats,
} from "@/lib/statistics";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { StatsOverview } from "./StatsOverview";

// Mock data generators
const yearlyCommitsData: YearlyCommitStats[] = [
  { year: 2023, commits: 450 },
  { year: 2024, commits: 780 },
  { year: 2025, commits: 1200 },
];

const languagesData: LanguageStats[] = [
  { name: "TypeScript", size: 500000, percentage: 45.5, repositoryCount: 8 },
  { name: "JavaScript", size: 300000, percentage: 27.3, repositoryCount: 12 },
  { name: "Python", size: 150000, percentage: 13.6, repositoryCount: 5 },
  { name: "CSS", size: 100000, percentage: 9.1, repositoryCount: 10 },
  { name: "HTML", size: 50000, percentage: 4.5, repositoryCount: 8 },
];

const activityData: CommitActivity = {
  total: 1250,
  perDay: 3.4,
  perWeek: 24.0,
  perMonth: 104.2,
};

const minimalYearlyCommits: YearlyCommitStats[] = [{ year: 2025, commits: 50 }];

const minimalLanguages: LanguageStats[] = [
  { name: "JavaScript", size: 10000, percentage: 100, repositoryCount: 1 },
];

const minimalActivity: CommitActivity = {
  total: 50,
  perDay: 0.1,
  perWeek: 1.0,
  perMonth: 4.2,
};

const manyLanguages: LanguageStats[] = [
  { name: "TypeScript", size: 500000, percentage: 35.0, repositoryCount: 8 },
  { name: "JavaScript", size: 300000, percentage: 21.0, repositoryCount: 12 },
  { name: "Python", size: 200000, percentage: 14.0, repositoryCount: 5 },
  { name: "Java", size: 150000, percentage: 10.5, repositoryCount: 4 },
  { name: "Go", size: 100000, percentage: 7.0, repositoryCount: 3 },
  { name: "Rust", size: 80000, percentage: 5.6, repositoryCount: 2 },
  { name: "C++", size: 50000, percentage: 3.5, repositoryCount: 2 },
  { name: "Ruby", size: 30000, percentage: 2.1, repositoryCount: 1 },
  { name: "PHP", size: 10000, percentage: 0.7, repositoryCount: 1 },
  { name: "Shell", size: 10000, percentage: 0.7, repositoryCount: 3 },
];

const highActivityData: CommitActivity = {
  total: 5000,
  perDay: 13.7,
  perWeek: 95.9,
  perMonth: 416.7,
};

const meta = {
  title: "Components/Statistics/StatsOverview",
  component: StatsOverview,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof StatsOverview>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default overview with all statistics
 */
export const Default: Story = {
  args: {
    yearlyCommits: yearlyCommitsData,
    languages: languagesData,
    activity: activityData,
  },
};

/**
 * Overview tab as default (all stats in one view)
 */
export const OverviewTab: Story = {
  args: {
    yearlyCommits: yearlyCommitsData,
    languages: languagesData,
    activity: activityData,
    defaultTab: "overview",
  },
};

/**
 * Commits tab as default
 */
export const CommitsTab: Story = {
  args: {
    yearlyCommits: yearlyCommitsData,
    languages: languagesData,
    activity: activityData,
    defaultTab: "commits",
  },
};

/**
 * Languages tab as default
 */
export const LanguagesTab: Story = {
  args: {
    yearlyCommits: yearlyCommitsData,
    languages: languagesData,
    activity: activityData,
    defaultTab: "languages",
  },
};

/**
 * Activity tab as default
 */
export const ActivityTab: Story = {
  args: {
    yearlyCommits: yearlyCommitsData,
    languages: languagesData,
    activity: activityData,
    defaultTab: "activity",
  },
};

/**
 * Without overview tab
 */
export const WithoutOverview: Story = {
  args: {
    yearlyCommits: yearlyCommitsData,
    languages: languagesData,
    activity: activityData,
    showOverview: false,
    defaultTab: "commits",
  },
};

/**
 * Minimal data (new user)
 */
export const MinimalData: Story = {
  args: {
    yearlyCommits: minimalYearlyCommits,
    languages: minimalLanguages,
    activity: minimalActivity,
  },
};

/**
 * Rich data (experienced user with many languages)
 */
export const RichData: Story = {
  args: {
    yearlyCommits: yearlyCommitsData,
    languages: manyLanguages,
    activity: highActivityData,
  },
};

/**
 * Only commits data available
 */
export const OnlyCommits: Story = {
  args: {
    yearlyCommits: yearlyCommitsData,
    languages: null,
    activity: null,
  },
};

/**
 * Only languages data available
 */
export const OnlyLanguages: Story = {
  args: {
    yearlyCommits: null,
    languages: languagesData,
    activity: null,
  },
};

/**
 * Only activity data available
 */
export const OnlyActivity: Story = {
  args: {
    yearlyCommits: null,
    languages: null,
    activity: activityData,
  },
};

/**
 * Loading state
 */
export const Loading: Story = {
  args: {
    yearlyCommits: null,
    languages: null,
    activity: null,
    loading: true,
  },
};

/**
 * Loading state with custom message
 */
export const LoadingWithMessage: Story = {
  args: {
    yearlyCommits: null,
    languages: null,
    activity: null,
    loading: true,
    loadingMessage: "Fetching GitHub statistics...",
  },
};

/**
 * Error state
 */
export const Error: Story = {
  args: {
    yearlyCommits: null,
    languages: null,
    activity: null,
    error: new Error("Failed to fetch statistics"),
  },
};

/**
 * Error state with custom messages
 */
export const CustomError: Story = {
  args: {
    yearlyCommits: null,
    languages: null,
    activity: null,
    error: new Error("Network timeout"),
    errorTitle: "Connection Error",
    errorDescription:
      "Unable to load statistics from GitHub. Please try again.",
  },
};

/**
 * Empty state (no data at all)
 */
export const Empty: Story = {
  args: {
    yearlyCommits: [],
    languages: [],
    activity: null,
  },
};

/**
 * Partial loading (some data loaded, some still loading)
 */
export const PartialData: Story = {
  args: {
    yearlyCommits: yearlyCommitsData,
    languages: null,
    activity: activityData,
  },
};

/**
 * Mobile viewport preview
 */
export const MobileView: Story = {
  args: {
    yearlyCommits: yearlyCommitsData,
    languages: languagesData,
    activity: activityData,
    defaultTab: "overview",
  },
  parameters: {
    viewport: {
      defaultViewport: "mobile1",
    },
  },
};

/**
 * Tablet viewport preview
 */
export const TabletView: Story = {
  args: {
    yearlyCommits: yearlyCommitsData,
    languages: languagesData,
    activity: activityData,
    defaultTab: "overview",
  },
  parameters: {
    viewport: {
      defaultViewport: "tablet",
    },
  },
};
