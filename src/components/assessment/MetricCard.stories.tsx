import type { Meta, StoryObj } from '@storybook/react';
import { MetricCard } from './MetricCard';

const meta: Meta<typeof MetricCard> = {
  title: 'Assessment/MetricCard',
  component: MetricCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof MetricCard>;

export const ActivityHigh: Story = {
  args: {
    title: 'Activity',
    score: 85,
    level: 'High',
    breakdown: [
      { label: 'Recent commits', value: 40, max: 40 },
      { label: 'Consistency', value: 30, max: 30 },
      { label: 'Diversity', value: 15, max: 30 },
    ],
  },
};

export const ActivityModerate: Story = {
  args: {
    title: 'Activity',
    score: 55,
    level: 'Moderate',
    breakdown: [
      { label: 'Recent commits', value: 25, max: 40 },
      { label: 'Consistency', value: 18, max: 30 },
      { label: 'Diversity', value: 12, max: 30 },
    ],
  },
};

export const ActivityLow: Story = {
  args: {
    title: 'Activity',
    score: 25,
    level: 'Low',
    breakdown: [
      { label: 'Recent commits', value: 10, max: 40 },
      { label: 'Consistency', value: 8, max: 30 },
      { label: 'Diversity', value: 7, max: 30 },
    ],
  },
};

export const ImpactExceptional: Story = {
  args: {
    title: 'Impact',
    score: 92,
    level: 'Exceptional',
    breakdown: [
      { label: 'Stars', value: 33, max: 35 },
      { label: 'Forks', value: 18, max: 20 },
      { label: 'Contributors', value: 14, max: 15 },
      { label: 'Reach', value: 18, max: 20 },
      { label: 'Engagement', value: 9, max: 10 },
    ],
  },
};

export const ImpactStrong: Story = {
  args: {
    title: 'Impact',
    score: 72,
    level: 'Strong',
  },
};

export const ImpactModerate: Story = {
  args: {
    title: 'Impact',
    score: 50,
    level: 'Moderate',
  },
};

export const ImpactLow: Story = {
  args: {
    title: 'Impact',
    score: 30,
    level: 'Low',
  },
};

export const ImpactMinimal: Story = {
  args: {
    title: 'Impact',
    score: 10,
    level: 'Minimal',
  },
};

export const QualityExcellent: Story = {
  args: {
    title: 'Quality',
    score: 90,
    level: 'Excellent',
    breakdown: [
      { label: 'Originality', value: 30, max: 30 },
      { label: 'Documentation', value: 22, max: 25 },
      { label: 'Ownership', value: 18, max: 20 },
      { label: 'Maturity', value: 12, max: 15 },
      { label: 'Stack', value: 8, max: 10 },
    ],
  },
};

export const QualityStrong: Story = {
  args: {
    title: 'Quality',
    score: 75,
    level: 'Strong',
  },
};

export const QualityGood: Story = {
  args: {
    title: 'Quality',
    score: 50,
    level: 'Good',
  },
};

export const QualityFair: Story = {
  args: {
    title: 'Quality',
    score: 30,
    level: 'Fair',
  },
};

export const QualityWeak: Story = {
  args: {
    title: 'Quality',
    score: 10,
    level: 'Weak',
  },
};

export const GrowthHigh: Story = {
  args: {
    title: 'Growth',
    score: 45,
    level: 'High',
  },
};

export const GrowthModerate: Story = {
  args: {
    title: 'Growth',
    score: 25,
    level: 'Moderate',
  },
};

export const GrowthLow: Story = {
  args: {
    title: 'Growth',
    score: 10,
    level: 'Low',
  },
};

export const Loading: Story = {
  args: {
    title: 'Activity',
    score: 0,
    level: 'Low',
    loading: true,
  },
};

export const WithExplainButton: Story = {
  args: {
    title: 'Growth',
    score: 45,
    level: 'Moderate',
    onExplainClick: () => alert('Explain Growth metric'),
  },
};

export const WithoutBreakdown: Story = {
  args: {
    title: 'Impact',
    score: 65,
    level: 'Strong',
  },
};

export const WithEmptyBreakdown: Story = {
  args: {
    title: 'Quality',
    score: 40,
    level: 'Moderate',
    breakdown: [],
  },
};
