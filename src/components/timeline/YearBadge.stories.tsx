import type { Meta, StoryObj } from '@storybook/react';
import { YearBadge } from './YearBadge';
import type { YearBadgeType } from '@/lib/year-badges';

const meta = {
  title: 'Timeline/YearBadge',
  component: YearBadge,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof YearBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

// Helper to create badge props
const createBadge = (type: YearBadgeType) => {
  const badges = {
    peak: {
      type: 'peak' as const,
      emoji: '🔥',
      label: 'Peak Year',
      labelRu: 'Самый продуктивный',
      color: 'text-warning',
      description: 'Год с максимальным количеством коммитов'
    },
    growth: {
      type: 'growth' as const,
      emoji: '📈',
      label: 'Growth',
      labelRu: 'Рост',
      color: 'text-success',
      description: 'Рост активности более 20% по сравнению с прошлым годом'
    },
    stable: {
      type: 'stable' as const,
      emoji: '📊',
      label: 'Stable',
      labelRu: 'Стабильный',
      color: 'text-primary',
      description: 'Стабильная активность (±20% от прошлого года)'
    },
    start: {
      type: 'start' as const,
      emoji: '🌱',
      label: 'Beginning',
      labelRu: 'Начало пути',
      color: 'text-success',
      description: 'Первый год активности на GitHub'
    },
    decline: {
      type: 'decline' as const,
      emoji: '📉',
      label: 'Decline',
      labelRu: 'Спад',
      color: 'text-muted-foreground',
      description: 'Снижение активности более 20% по сравнению с прошлым годом'
    },
    inactive: {
      type: 'inactive' as const,
      emoji: '⚫',
      label: 'Inactive',
      labelRu: 'Низкая активность',
      color: 'text-muted-foreground',
      description: 'Менее 100 коммитов за год'
    }
  };
  return badges[type];
};

export const Peak: Story = {
  args: {
    badge: createBadge('peak'),
    showLabel: false,
    size: 'md',
  },
};

export const PeakWithLabel: Story = {
  args: {
    badge: createBadge('peak'),
    showLabel: true,
    size: 'md',
  },
};

export const Growth: Story = {
  args: {
    badge: createBadge('growth'),
    showLabel: false,
    size: 'md',
  },
};

export const GrowthWithLabel: Story = {
  args: {
    badge: createBadge('growth'),
    showLabel: true,
    size: 'md',
  },
};

export const Stable: Story = {
  args: {
    badge: createBadge('stable'),
    showLabel: true,
    size: 'md',
  },
};

export const Start: Story = {
  args: {
    badge: createBadge('start'),
    showLabel: true,
    size: 'md',
  },
};

export const Decline: Story = {
  args: {
    badge: createBadge('decline'),
    showLabel: true,
    size: 'md',
  },
};

export const Inactive: Story = {
  args: {
    badge: createBadge('inactive'),
    showLabel: true,
    size: 'md',
  },
};

export const SmallSize: Story = {
  args: {
    badge: createBadge('peak'),
    showLabel: false,
    size: 'sm',
  },
};

export const AllBadges: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <YearBadge badge={createBadge('peak')} showLabel={true} size="md" />
        <YearBadge badge={createBadge('growth')} showLabel={true} size="md" />
        <YearBadge badge={createBadge('stable')} showLabel={true} size="md" />
      </div>
      <div className="flex items-center gap-4">
        <YearBadge badge={createBadge('start')} showLabel={true} size="md" />
        <YearBadge badge={createBadge('decline')} showLabel={true} size="md" />
        <YearBadge badge={createBadge('inactive')} showLabel={true} size="md" />
      </div>
    </div>
  ),
};
