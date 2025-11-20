import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import { Switch } from "./switch";

const meta: Meta<typeof Switch> = {
  title: "UI/Switch",
  component: Switch,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "A switch component for boolean input.",
      },
    },
  },
  tags: ["autodocs"],
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
      <label htmlFor="airplane" className="cursor-pointer text-sm font-medium">
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
          <Switch
            id="controlled"
            checked={checked}
            onCheckedChange={setChecked}
          />
          <label
            htmlFor="controlled"
            className="cursor-pointer text-sm font-medium"
          >
            Enable notifications
          </label>
        </div>
        <p className="text-xs text-muted-foreground">
          Status: {checked ? "On" : "Off"}
        </p>
      </div>
    );
  },
};

export const RepositorySettings: Story = {
  render: () => (
    <div className="w-[400px] space-y-4 rounded-lg border p-4">
      <div className="text-sm font-semibold">Repository Settings</div>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label
            htmlFor="private"
            className="cursor-pointer text-sm font-medium"
          >
            Private repository
          </label>
          <Switch id="private" defaultChecked />
        </div>
        <div className="flex items-center justify-between">
          <label
            htmlFor="issues"
            className="cursor-pointer text-sm font-medium"
          >
            Issues
          </label>
          <Switch id="issues" defaultChecked />
        </div>
        <div className="flex items-center justify-between">
          <label htmlFor="wiki" className="cursor-pointer text-sm font-medium">
            Wiki
          </label>
          <Switch id="wiki" />
        </div>
      </div>
    </div>
  ),
};
