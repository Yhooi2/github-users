import type { Meta, StoryObj } from '@storybook/react';
import { RepositoryEmpty } from './RepositoryEmpty';

const meta = {
  title: 'Components/Repository/RepositoryEmpty',
  component: RepositoryEmpty,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof RepositoryEmpty>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default empty state when repositories are filtered out
 */
export const Default: Story = {
  args: {},
};

/**
 * Empty state when user has no repositories at all
 */
export const NoRepositories: Story = {
  args: {
    hasFilters: false,
    title: 'No Repositories Yet',
    description: 'This user hasn\'t created any public repositories.',
  },
};

/**
 * Custom empty state with custom message
 */
export const CustomMessage: Story = {
  args: {
    title: 'No Starred Repositories',
    description: 'You can add repositories by searching and clicking the filter button.',
    hasFilters: true,
  },
};

/**
 * Empty state with very long description
 */
export const LongDescription: Story = {
  args: {
    title: 'Advanced Filters Applied',
    description: 'No repositories match your current advanced filter criteria. This could mean the combination of language, star count, fork count, and activity filters is too restrictive. Try removing some filters or broadening your search parameters.',
    hasFilters: true,
  },
};

/**
 * Empty state for archived repositories search
 */
export const ArchivedRepositories: Story = {
  args: {
    title: 'No Archived Repositories',
    description: 'This user has no archived repositories.',
    hasFilters: false,
  },
};
