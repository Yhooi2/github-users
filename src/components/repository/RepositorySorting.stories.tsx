import type { Meta, StoryObj } from '@storybook/react';
import { RepositorySorting } from './RepositorySorting';
import type { SortBy, SortDirection } from '@/types/filters';
import { useState } from 'react';

// Wrapper component to manage sorting state
function RepositorySortingWrapper(props: {
  initialSortBy?: SortBy;
  initialSortDirection?: SortDirection;
  compact?: boolean;
}) {
  const [sortBy, setSortBy] = useState<SortBy>(props.initialSortBy || 'stars');
  const [sortDirection, setSortDirection] = useState<SortDirection>(
    props.initialSortDirection || 'desc'
  );

  const handleToggleDirection = () => {
    setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
  };

  return (
    <RepositorySorting
      sortBy={sortBy}
      sortDirection={sortDirection}
      onSortByChange={setSortBy}
      onSortDirectionChange={setSortDirection}
      onToggleDirection={handleToggleDirection}
      compact={props.compact}
    />
  );
}

const meta = {
  title: 'Components/Repository/RepositorySorting',
  component: RepositorySortingWrapper,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ width: '100%', minWidth: '400px', padding: '20px' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof RepositorySortingWrapper>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default sorting by stars (descending)
 */
export const Default: Story = {
  args: {},
};

/**
 * Sorting by stars in ascending order
 */
export const StarsAscending: Story = {
  args: {
    initialSortBy: 'stars',
    initialSortDirection: 'asc',
  },
};

/**
 * Sorting by forks
 */
export const SortByForks: Story = {
  args: {
    initialSortBy: 'forks',
    initialSortDirection: 'desc',
  },
};

/**
 * Sorting by watchers
 */
export const SortByWatchers: Story = {
  args: {
    initialSortBy: 'watchers',
    initialSortDirection: 'desc',
  },
};

/**
 * Sorting by commits
 */
export const SortByCommits: Story = {
  args: {
    initialSortBy: 'commits',
    initialSortDirection: 'desc',
  },
};

/**
 * Sorting by size
 */
export const SortBySize: Story = {
  args: {
    initialSortBy: 'size',
    initialSortDirection: 'desc',
  },
};

/**
 * Sorting by last updated date
 */
export const SortByUpdated: Story = {
  args: {
    initialSortBy: 'updated',
    initialSortDirection: 'desc',
  },
};

/**
 * Sorting by created date
 */
export const SortByCreated: Story = {
  args: {
    initialSortBy: 'created',
    initialSortDirection: 'asc',
  },
};

/**
 * Sorting by name (alphabetical)
 */
export const SortByName: Story = {
  args: {
    initialSortBy: 'name',
    initialSortDirection: 'asc',
  },
};

/**
 * Compact mode (smaller buttons)
 */
export const CompactMode: Story = {
  args: {
    initialSortBy: 'stars',
    initialSortDirection: 'desc',
    compact: true,
  },
};

/**
 * Compact mode with ascending order
 */
export const CompactAscending: Story = {
  args: {
    initialSortBy: 'forks',
    initialSortDirection: 'asc',
    compact: true,
  },
};
