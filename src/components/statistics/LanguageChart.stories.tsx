import type { Meta, StoryObj } from '@storybook/react';
import { LanguageChart } from './LanguageChart';
import type { LanguageStats } from '@/lib/statistics';

// Mock data generators
const mockLanguageData: LanguageStats[] = [
  { name: 'TypeScript', size: 500000, percentage: 45.5, repositoryCount: 8 },
  { name: 'JavaScript', size: 300000, percentage: 27.3, repositoryCount: 12 },
  { name: 'Python', size: 150000, percentage: 13.6, repositoryCount: 5 },
  { name: 'CSS', size: 100000, percentage: 9.1, repositoryCount: 10 },
  { name: 'HTML', size: 50000, percentage: 4.5, repositoryCount: 8 },
];

const manyLanguagesData: LanguageStats[] = [
  { name: 'TypeScript', size: 500000, percentage: 35.0, repositoryCount: 8 },
  { name: 'JavaScript', size: 300000, percentage: 21.0, repositoryCount: 12 },
  { name: 'Python', size: 200000, percentage: 14.0, repositoryCount: 5 },
  { name: 'Java', size: 150000, percentage: 10.5, repositoryCount: 4 },
  { name: 'Go', size: 100000, percentage: 7.0, repositoryCount: 3 },
  { name: 'Rust', size: 80000, percentage: 5.6, repositoryCount: 2 },
  { name: 'C++', size: 50000, percentage: 3.5, repositoryCount: 2 },
  { name: 'Ruby', size: 30000, percentage: 2.1, repositoryCount: 1 },
  { name: 'PHP', size: 10000, percentage: 0.7, repositoryCount: 1 },
  { name: 'Swift', size: 8000, percentage: 0.6, repositoryCount: 1 },
];

const singleLanguageData: LanguageStats[] = [
  { name: 'TypeScript', size: 1000000, percentage: 100, repositoryCount: 15 },
];

const twoLanguagesData: LanguageStats[] = [
  { name: 'JavaScript', size: 600000, percentage: 60, repositoryCount: 10 },
  { name: 'TypeScript', size: 400000, percentage: 40, repositoryCount: 8 },
];

const equalDistributionData: LanguageStats[] = [
  { name: 'TypeScript', size: 250000, percentage: 25, repositoryCount: 5 },
  { name: 'JavaScript', size: 250000, percentage: 25, repositoryCount: 5 },
  { name: 'Python', size: 250000, percentage: 25, repositoryCount: 5 },
  { name: 'Go', size: 250000, percentage: 25, repositoryCount: 5 },
];

const dominantLanguageData: LanguageStats[] = [
  { name: 'TypeScript', size: 900000, percentage: 90, repositoryCount: 12 },
  { name: 'JavaScript', size: 50000, percentage: 5, repositoryCount: 3 },
  { name: 'CSS', size: 30000, percentage: 3, repositoryCount: 8 },
  { name: 'HTML', size: 20000, percentage: 2, repositoryCount: 6 },
];

const meta = {
  title: 'Components/Statistics/LanguageChart',
  component: LanguageChart,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof LanguageChart>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default pie chart showing 5 languages
 */
export const Default: Story = {
  args: {
    data: mockLanguageData,
  },
};

/**
 * Pie chart variant (explicit)
 */
export const PieChart: Story = {
  args: {
    data: mockLanguageData,
    variant: 'pie',
  },
};

/**
 * Donut chart variant
 */
export const DonutChart: Story = {
  args: {
    data: mockLanguageData,
    variant: 'donut',
  },
};

/**
 * Chart with many languages (auto-groups beyond limit)
 */
export const ManyLanguages: Story = {
  args: {
    data: manyLanguagesData,
    maxLanguages: 5,
  },
};

/**
 * Chart showing all languages (no grouping)
 */
export const ShowAllLanguages: Story = {
  args: {
    data: manyLanguagesData,
    maxLanguages: 10,
  },
};

/**
 * Chart with single language
 */
export const SingleLanguage: Story = {
  args: {
    data: singleLanguageData,
  },
};

/**
 * Chart with two languages
 */
export const TwoLanguages: Story = {
  args: {
    data: twoLanguagesData,
  },
};

/**
 * Chart with equal distribution
 */
export const EqualDistribution: Story = {
  args: {
    data: equalDistributionData,
  },
};

/**
 * Chart with dominant language (90%)
 */
export const DominantLanguage: Story = {
  args: {
    data: dominantLanguageData,
  },
};

/**
 * Chart without legend
 */
export const WithoutLegend: Story = {
  args: {
    data: mockLanguageData,
    showLegend: false,
  },
};

/**
 * Donut chart without legend
 */
export const DonutWithoutLegend: Story = {
  args: {
    data: mockLanguageData,
    variant: 'donut',
    showLegend: false,
  },
};

/**
 * Chart with custom maxLanguages (3)
 */
export const TopThreeLanguages: Story = {
  args: {
    data: mockLanguageData,
    maxLanguages: 3,
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
    loadingMessage: 'Analyzing code languages...',
  },
};

/**
 * Error state
 */
export const Error: Story = {
  args: {
    data: [],
    error: new Error('Failed to fetch language data'),
  },
};

/**
 * Error state with custom messages
 */
export const CustomError: Story = {
  args: {
    data: [],
    error: new Error('Network timeout'),
    errorTitle: 'Language Analysis Failed',
    errorDescription: 'Unable to analyze repository languages. Please try again.',
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
    emptyTitle: 'No Languages Detected',
    emptyDescription: 'No programming languages found in repositories.',
  },
};

/**
 * All variants comparison (for visual testing)
 */
export const AllVariants: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="mb-4 text-lg font-semibold">Pie Chart</h3>
        <LanguageChart data={mockLanguageData} variant="pie" />
      </div>
      <div>
        <h3 className="mb-4 text-lg font-semibold">Donut Chart</h3>
        <LanguageChart data={mockLanguageData} variant="donut" />
      </div>
      <div>
        <h3 className="mb-4 text-lg font-semibold">Many Languages (Grouped)</h3>
        <LanguageChart data={manyLanguagesData} maxLanguages={5} />
      </div>
    </div>
  ),
};
