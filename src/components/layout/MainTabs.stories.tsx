import type { Meta, StoryObj } from '@storybook/react';
import { MainTabs } from './MainTabs';

const meta: Meta<typeof MainTabs> = {
  title: 'Layout/MainTabs',
  component: MainTabs,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  args: { onValueChange: fn() },
};

export default meta;
type Story = StoryObj<typeof MainTabs>;

export const Default: Story = {
  args: {
    tabs: [
      { value: 'overview', label: 'Overview', content: <div className="p-4">Overview content</div> },
      { value: 'repos', label: 'Repositories', content: <div className="p-4">Repositories</div> },
      { value: 'stats', label: 'Analytics', content: <div className="p-4">Analytics</div> },
    ],
  },
};

export const TwoTabs: Story = {
  args: {
    tabs: [
      { value: 'profile', label: 'Profile', content: <div className="p-4">User Profile</div> },
      { value: 'activity', label: 'Activity', content: <div className="p-4">Activity Log</div> },
    ],
  },
};

export const WithDisabled: Story = {
  args: {
    tabs: [
      { value: 'tab1', label: 'Active', content: <div className="p-4">Active tab</div> },
      { value: 'tab2', label: 'Disabled', content: <div className="p-4">Disabled</div>, disabled: true },
      { value: 'tab3', label: 'Another', content: <div className="p-4">Another tab</div> },
    ],
  },
};
