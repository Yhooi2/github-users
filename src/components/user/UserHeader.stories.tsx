import type { Meta, StoryObj } from '@storybook/react-vite';
import { UserHeader } from './UserHeader';

const meta: Meta<typeof UserHeader> = {
  title: 'User/UserHeader',
  component: UserHeader,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof UserHeader>;

const mockUser = {
  avatarUrl: 'https://avatars.githubusercontent.com/u/583231?v=4',
  name: 'The Octocat',
  login: 'octocat',
  bio: 'GitHub mascot and all-around friendly feline. Cat enthusiast. Emoji lover. 🐙🐱',
  location: 'San Francisco, CA',
  url: 'https://github.com/octocat',
  createdAt: '2011-01-25T18:44:36Z',
};

export const Default: Story = {
  args: {
    user: mockUser,
  },
};

export const NoName: Story = {
  args: {
    user: {
      ...mockUser,
      name: null,
    },
  },
};

export const NoBio: Story = {
  args: {
    user: {
      ...mockUser,
      bio: null,
    },
  },
};

export const NoLocation: Story = {
  args: {
    user: {
      ...mockUser,
      location: null,
    },
  },
};

export const MinimalProfile: Story = {
  args: {
    user: {
      ...mockUser,
      name: null,
      bio: null,
      location: null,
    },
  },
};

export const LongBio: Story = {
  args: {
    user: {
      ...mockUser,
      bio: 'Senior Software Engineer passionate about open source, distributed systems, and developer experience. Building tools that developers love. Contributing to the community one PR at a time. Always learning, always growing.',
    },
  },
};

export const RecentUser: Story = {
  args: {
    user: {
      ...mockUser,
      createdAt: '2024-01-15T10:30:00Z',
    },
  },
};
