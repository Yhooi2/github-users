import type { Meta, StoryObj } from '@storybook/react-vite';
import { SearchHeader } from './SearchHeader';

/**
 * SearchHeader displays the main application header with:
 * - App title and description
 * - Search form for GitHub usernames
 * - Theme toggle button
 *
 * This component is part of Phase 5: Layout Refactoring to create
 * a single-page progressive disclosure layout.
 */
const meta = {
  title: 'Layout/SearchHeader',
  component: SearchHeader,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Main header component for the GitHub User Analytics application. Provides search functionality and theme switching.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    userName: {
      control: 'text',
      description: 'Current username in the search field',
    },
    onSearch: {
      action: 'searched',
      description: 'Callback when search is submitted',
    },
  },
  args: {
    onSearch: () => {},
  },
} satisfies Meta<typeof SearchHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default state with empty search field
 */
export const Default: Story = {
  args: {
    userName: '',
  },
};

/**
 * With a username pre-filled in the search field
 */
export const WithUsername: Story = {
  args: {
    userName: 'torvalds',
  },
};

/**
 * After searching for a user
 */
export const AfterSearch: Story = {
  args: {
    userName: 'gaearon',
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows the header after a user has performed a search.',
      },
    },
  },
};

/**
 * With a long username to test text overflow
 */
export const LongUsername: Story = {
  args: {
    userName: 'a-very-long-github-username-that-might-overflow',
  },
  parameters: {
    docs: {
      description: {
        story: 'Tests the header behavior with a very long username.',
      },
    },
  },
};

/**
 * Mobile viewport - tests responsive layout
 */
export const Mobile: Story = {
  args: {
    userName: '',
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Header on mobile devices (320px width).',
      },
    },
  },
};

/**
 * Tablet viewport - tests responsive layout
 */
export const Tablet: Story = {
  args: {
    userName: 'facebook',
  },
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
    docs: {
      description: {
        story: 'Header on tablet devices (768px width).',
      },
    },
  },
};
