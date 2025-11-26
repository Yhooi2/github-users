import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { StatusIndicator } from "../StatusIndicator";
import { ThemeProvider } from "../../context/ThemeContext";
import { Background } from "../Background";

const meta: Meta<typeof StatusIndicator> = {
  title: "Design System/Status/StatusIndicator",
  component: StatusIndicator,
  decorators: [
    (Story) => (
      <ThemeProvider defaultTheme="glass">
        <Background>
          <div className="p-8">
            <Story />
          </div>
        </Background>
      </ThemeProvider>
    ),
  ],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "A status indicator showing traffic-light states (green/yellow/red) with glow effect. Supports normal and large sizes with optional symbols.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    type: {
      control: "select",
      options: ["green", "yellow", "red"],
      description: "Status type (color)",
    },
    size: {
      control: "select",
      options: ["normal", "large"],
      description: "Indicator size",
    },
    pulse: {
      control: "boolean",
      description: "Enable pulse animation",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Green: Story = {
  args: {
    type: "green",
  },
};

export const Yellow: Story = {
  args: {
    type: "yellow",
  },
};

export const Red: Story = {
  args: {
    type: "red",
  },
};

export const LargeGreen: Story = {
  args: {
    type: "green",
    size: "large",
  },
};

export const LargeYellow: Story = {
  args: {
    type: "yellow",
    size: "large",
  },
};

export const LargeRed: Story = {
  args: {
    type: "red",
    size: "large",
  },
};

export const Pulsing: Story = {
  args: {
    type: "green",
    pulse: true,
  },
};

export const AllTypes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <StatusIndicator type="green" />
      <StatusIndicator type="yellow" />
      <StatusIndicator type="red" />
    </div>
  ),
};

export const AllTypesLarge: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <StatusIndicator type="green" size="large" />
      <StatusIndicator type="yellow" size="large" />
      <StatusIndicator type="red" size="large" />
    </div>
  ),
};

export const SizeComparison: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <StatusIndicator type="green" size="normal" />
        <StatusIndicator type="yellow" size="normal" />
        <StatusIndicator type="red" size="normal" />
        <span className="text-white/70 text-sm ml-4">Normal (2.5)</span>
      </div>
      <div className="flex items-center gap-4">
        <StatusIndicator type="green" size="large" />
        <StatusIndicator type="yellow" size="large" />
        <StatusIndicator type="red" size="large" />
        <span className="text-white/70 text-sm ml-4">Large (4) with symbols</span>
      </div>
    </div>
  ),
};

export const InContext: Story = {
  render: () => (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <StatusIndicator type="green" size="large" />
        <span className="text-white">Good - All checks passed</span>
      </div>
      <div className="flex items-center gap-2">
        <StatusIndicator type="yellow" size="large" />
        <span className="text-white">Warning - Minor issues found</span>
      </div>
      <div className="flex items-center gap-2">
        <StatusIndicator type="red" size="large" />
        <span className="text-white">Critical - Action required</span>
      </div>
    </div>
  ),
};

export const RepositoryStatus: Story = {
  render: () => (
    <div className="space-y-2">
      <div className="flex items-center justify-between w-64 p-2 rounded-lg bg-white/5">
        <span className="text-white">my-project</span>
        <StatusIndicator type="green" size="large" />
      </div>
      <div className="flex items-center justify-between w-64 p-2 rounded-lg bg-white/5">
        <span className="text-white">study-repo</span>
        <StatusIndicator type="yellow" size="large" />
      </div>
      <div className="flex items-center justify-between w-64 p-2 rounded-lg bg-white/5">
        <span className="text-white">bot-scripts</span>
        <StatusIndicator type="red" size="large" />
      </div>
    </div>
  ),
};
