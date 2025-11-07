import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from './badge';

const meta: Meta<typeof Badge> = {
  title: 'UI/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A badge component for displaying status, labels, or counts.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'secondary', 'destructive', 'outline'],
      description: 'The visual style variant of the badge',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Badge>;

// Story 1: Default badge
export const Default: Story = {
  args: {
    children: 'Badge',
  },
};

// Story 2: Secondary variant
export const Secondary: Story = {
  args: {
    children: 'Secondary',
    variant: 'secondary',
  },
};

// Story 3: Destructive variant
export const Destructive: Story = {
  args: {
    children: 'Destructive',
    variant: 'destructive',
  },
};

// Story 4: Outline variant
export const Outline: Story = {
  args: {
    children: 'Outline',
    variant: 'outline',
  },
};

// Story 5: All variants together
export const AllVariants: Story = {
  render: () => (
    <div className="flex gap-2">
      <Badge>Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="outline">Outline</Badge>
    </div>
  ),
};

// Story 6: With icons
export const WithIcons: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <Badge>
        <svg className="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
        Completed
      </Badge>
      <Badge variant="secondary">
        <svg className="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        In Progress
      </Badge>
      <Badge variant="destructive">
        <svg className="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
        Failed
      </Badge>
    </div>
  ),
};

// Story 7: Status badges (GitHub use case)
export const StatusBadges: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <span className="text-sm">Language:</span>
        <Badge variant="outline">TypeScript</Badge>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm">Stars:</span>
        <Badge>1,234</Badge>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm">Status:</span>
        <Badge variant="secondary">Active</Badge>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm">License:</span>
        <Badge variant="outline">MIT</Badge>
      </div>
    </div>
  ),
};

// Story 8: Repository topics
export const RepositoryTopics: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge variant="outline">react</Badge>
      <Badge variant="outline">typescript</Badge>
      <Badge variant="outline">vite</Badge>
      <Badge variant="outline">tailwind</Badge>
      <Badge variant="outline">shadcn-ui</Badge>
      <Badge variant="outline">apollo-client</Badge>
    </div>
  ),
};

// Story 9: As link (asChild)
export const AsLink: Story = {
  render: () => (
    <Badge asChild>
      <a href="#" className="cursor-pointer">
        Clickable Badge
      </a>
    </Badge>
  ),
};

// Story 10: Notification counts
export const NotificationCounts: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <span className="text-sm">Messages</span>
        <Badge>3</Badge>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm">Notifications</span>
        <Badge variant="destructive">12</Badge>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm">Updates</span>
        <Badge variant="secondary">New</Badge>
      </div>
    </div>
  ),
};
