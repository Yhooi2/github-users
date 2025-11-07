import type { Meta, StoryObj } from '@storybook/react';
import { StatsCard } from './StatsCard';
import { Users, GitFork, Star, FolderGit2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const meta: Meta<typeof StatsCard> = {
  title: 'Layout/StatsCard',
  component: StatsCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof StatsCard>;

export const Default: Story = {
  args: {
    title: 'Total Repositories',
    value: 42,
  },
};

export const WithIcon: Story = {
  args: {
    title: 'Followers',
    value: 1234,
    icon: Users,
  },
};

export const TrendingUp: Story = {
  args: {
    title: 'Stars',
    value: 5678,
    icon: Star,
    trend: 'up',
    trendValue: '+12.5%',
    description: 'vs last month',
  },
};

export const TrendingDown: Story = {
  args: {
    title: 'Forks',
    value: 234,
    icon: GitFork,
    trend: 'down',
    trendValue: '-3.2%',
    description: 'vs last month',
  },
};

export const TrendingNeutral: Story = {
  args: {
    title: 'Repositories',
    value: 42,
    icon: FolderGit2,
    trend: 'neutral',
    trendValue: '0%',
    description: 'No change',
  },
};

export const WithBadge: Story = {
  args: {
    title: 'Total Commits',
    value: 9876,
    badge: <Badge variant="secondary">New</Badge>,
    description: 'All time',
  },
};

export const Complete: Story = {
  args: {
    title: 'Total Stars',
    value: '12.5k',
    icon: Star,
    trend: 'up',
    trendValue: '+24.8%',
    description: 'This year',
    badge: <Badge>Popular</Badge>,
  },
};
