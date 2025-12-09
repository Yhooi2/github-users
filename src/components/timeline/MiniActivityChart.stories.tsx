import type { Meta, StoryObj } from '@storybook/react';
import { MiniActivityChart } from './MiniActivityChart';
import type { MonthlyContribution } from '@/lib/contribution-aggregator';

const meta: Meta<typeof MiniActivityChart> = {
  title: 'Timeline/MiniActivityChart',
  component: MiniActivityChart,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof MiniActivityChart>;

const generateMonthlyData = (pattern: 'peak' | 'growth' | 'steady' | 'decline'): MonthlyContribution[] => {
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const patterns = {
    peak: [50, 80, 120, 150, 180, 200, 190, 160, 140, 100, 70, 40],
    growth: [20, 30, 45, 60, 80, 100, 120, 145, 170, 200, 230, 260],
    steady: [100, 110, 95, 105, 100, 108, 97, 103, 99, 106, 101, 98],
    decline: [200, 180, 160, 140, 120, 100, 80, 60, 50, 40, 30, 20],
  };

  return patterns[pattern].map((contributions, i) => ({
    month: i + 1,
    monthName: monthNames[i],
    contributions,
    daysActive: Math.floor(contributions / 5),
    maxDaily: Math.floor(contributions / 10),
  }));
};

export const PeakMidYear: Story = {
  args: {
    monthlyData: generateMonthlyData('peak'),
  },
};

export const GrowthTrend: Story = {
  args: {
    monthlyData: generateMonthlyData('growth'),
  },
};

export const SteadyActivity: Story = {
  args: {
    monthlyData: generateMonthlyData('steady'),
  },
};

export const DeclineTrend: Story = {
  args: {
    monthlyData: generateMonthlyData('decline'),
  },
};

export const AllPatterns: Story = {
  render: () => (
    <div className="flex flex-col gap-6 w-80">
      <div>
        <h4 className="text-sm font-medium mb-2">Peak Mid-Year</h4>
        <MiniActivityChart monthlyData={generateMonthlyData('peak')} />
      </div>
      <div>
        <h4 className="text-sm font-medium mb-2">Growth Trend</h4>
        <MiniActivityChart monthlyData={generateMonthlyData('growth')} />
      </div>
      <div>
        <h4 className="text-sm font-medium mb-2">Steady Activity</h4>
        <MiniActivityChart monthlyData={generateMonthlyData('steady')} />
      </div>
      <div>
        <h4 className="text-sm font-medium mb-2">Decline Trend</h4>
        <MiniActivityChart monthlyData={generateMonthlyData('decline')} />
      </div>
    </div>
  ),
};
