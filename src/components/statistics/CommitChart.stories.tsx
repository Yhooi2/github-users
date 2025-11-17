import type { Meta, StoryObj } from '@storybook/react';
import { CommitChart } from './CommitChart';
import type { YearlyCommitStats } from '@/lib/statistics';

// Mock data generators
const createMockYearlyStats = (years: number = 3): YearlyCommitStats[] => {
  const currentYear = new Date().getFullYear();
  const stats: YearlyCommitStats[] = [];

  for (let i = 0; i < years; i++) {
    stats.push({
      year: currentYear - i,
      commits: Math.floor(Math.random() * 1000) + 200,
    });
  }

  return stats.reverse(); // Oldest to newest
};

const threeYearsData: YearlyCommitStats[] = [
  { year: 2023, commits: 450 },
  { year: 2024, commits: 780 },
  { year: 2025, commits: 1200 },
];

const increasingTrendData: YearlyCommitStats[] = [
  { year: 2023, commits: 300 },
  { year: 2024, commits: 600 },
  { year: 2025, commits: 900 },
];

const decreasingTrendData: YearlyCommitStats[] = [
  { year: 2023, commits: 1000 },
  { year: 2024, commits: 600 },
  { year: 2025, commits: 300 },
];

const flatTrendData: YearlyCommitStats[] = [
  { year: 2023, commits: 500 },
  { year: 2024, commits: 510 },
  { year: 2025, commits: 505 },
];

const singleYearData: YearlyCommitStats[] = [{ year: 2025, commits: 500 }];

const highVolumeData: YearlyCommitStats[] = [
  { year: 2023, commits: 5000 },
  { year: 2024, commits: 7500 },
  { year: 2025, commits: 10000 },
];

const lowVolumeData: YearlyCommitStats[] = [
  { year: 2023, commits: 10 },
  { year: 2024, commits: 25 },
  { year: 2025, commits: 15 },
];

const meta = {
  title: 'Components/Statistics/CommitChart',
  component: CommitChart,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof CommitChart>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default line chart showing 3 years of commit data
 */
export const Default: Story = {
  args: {
    data: threeYearsData,
  },
};

/**
 * Line chart variant (explicit)
 */
export const LineChart: Story = {
  args: {
    data: threeYearsData,
    variant: 'line',
  },
};

/**
 * Bar chart variant
 */
export const BarChart: Story = {
  args: {
    data: threeYearsData,
    variant: 'bar',
  },
};

/**
 * Area chart variant
 */
export const AreaChart: Story = {
  args: {
    data: threeYearsData,
    variant: 'area',
  },
};

/**
 * Chart showing increasing trend (positive growth)
 */
export const IncreasingTrend: Story = {
  args: {
    data: increasingTrendData,
    showTrend: true,
  },
};

/**
 * Chart showing decreasing trend (negative growth)
 */
export const DecreasingTrend: Story = {
  args: {
    data: decreasingTrendData,
    showTrend: true,
  },
};

/**
 * Chart showing flat trend (minimal change)
 */
export const FlatTrend: Story = {
  args: {
    data: flatTrendData,
    showTrend: true,
  },
};

/**
 * Chart without trend indicator
 */
export const WithoutTrend: Story = {
  args: {
    data: threeYearsData,
    showTrend: false,
  },
};

/**
 * Chart with single year of data
 */
export const SingleYear: Story = {
  args: {
    data: singleYearData,
  },
};

/**
 * Chart with high volume commits
 */
export const HighVolume: Story = {
  args: {
    data: highVolumeData,
  },
};

/**
 * Chart with low volume commits
 */
export const LowVolume: Story = {
  args: {
    data: lowVolumeData,
  },
};

/**
 * Loading state
 */
export const Loading: Story = {
  args: {
    data: [],
    loading: true,
  },
};

/**
 * Loading state with custom message
 */
export const LoadingWithMessage: Story = {
  args: {
    data: [],
    loading: true,
    loadingMessage: 'Fetching commit statistics from GitHub...',
  },
};

/**
 * Error state
 */
export const Error: Story = {
  args: {
    data: [],
    error: new Error('Failed to fetch commit data'),
  },
};

/**
 * Error state with custom messages
 */
export const CustomError: Story = {
  args: {
    data: [],
    error: new Error('Network timeout'),
    errorTitle: 'Connection Timeout',
    errorDescription: 'Unable to connect to GitHub API. Please try again later.',
  },
};

/**
 * Empty state (no data)
 */
export const Empty: Story = {
  args: {
    data: [],
  },
};

/**
 * Empty state with custom messages
 */
export const CustomEmpty: Story = {
  args: {
    data: [],
    emptyTitle: 'No Activity Yet',
    emptyDescription: 'Start making commits to see your activity here.',
  },
};

/**
 * Custom height (taller chart)
 */
export const CustomHeight: Story = {
  args: {
    data: threeYearsData,
    height: 400,
  },
};

/**
 * All variants comparison (for visual testing)
 */
export const AllVariants: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="mb-4 text-lg font-semibold">Line Chart</h3>
        <CommitChart data={threeYearsData} variant="line" />
      </div>
      <div>
        <h3 className="mb-4 text-lg font-semibold">Bar Chart</h3>
        <CommitChart data={threeYearsData} variant="bar" />
      </div>
      <div>
        <h3 className="mb-4 text-lg font-semibold">Area Chart</h3>
        <CommitChart data={threeYearsData} variant="area" />
      </div>
    </div>
  ),
};
