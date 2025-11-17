import type { Meta, StoryObj } from '@storybook/react';
import { Switch } from './switch';
import * as React from 'react';

const meta: Meta<typeof Switch> = {
  title: 'UI/Switch',
  component: Switch,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A switch component for boolean input.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Switch>;

export const Default: Story = {
  render: () => <Switch />,
};

export const Checked: Story = {
  render: () => <Switch defaultChecked />,
};

export const Disabled: Story = {
  render: () => <Switch disabled />,
};

export const DisabledChecked: Story = {
  render: () => <Switch disabled defaultChecked />,
};

export const WithLabel: Story = {
  render: () => (
    <div className="flex items-center space-x-2">
      <Switch id="airplane" />
      <label htmlFor="airplane" className="text-sm font-medium cursor-pointer">
        Airplane Mode
      </label>
    </div>
  ),
};

export const Controlled: Story = {
  render: () => {
    const [checked, setChecked] = React.useState(false);
    return (
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Switch id="controlled" checked={checked} onCheckedChange={setChecked} />
          <label htmlFor="controlled" className="text-sm font-medium cursor-pointer">
            Enable notifications
          </label>
        </div>
        <p className="text-xs text-muted-foreground">Status: {checked ? 'On' : 'Off'}</p>
      </div>
    );
  },
};

export const RepositorySettings: Story = {
  render: () => (
    <div className="space-y-4 w-[400px] rounded-lg border p-4">
      <div className="font-semibold text-sm">Repository Settings</div>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label htmlFor="private" className="text-sm font-medium cursor-pointer">
            Private repository
          </label>
          <Switch id="private" defaultChecked />
        </div>
        <div className="flex items-center justify-between">
          <label htmlFor="issues" className="text-sm font-medium cursor-pointer">
            Issues
          </label>
          <Switch id="issues" defaultChecked />
        </div>
        <div className="flex items-center justify-between">
          <label htmlFor="wiki" className="text-sm font-medium cursor-pointer">
            Wiki
          </label>
          <Switch id="wiki" />
        </div>
      </div>
    </div>
  ),
};
