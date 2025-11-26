import type { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";
import { GlassToggle } from "../GlassToggle";
import { ThemeProvider } from "../../context/ThemeContext";
import { Background } from "../Background";

const meta: Meta<typeof GlassToggle> = {
  title: "Design System/Core/GlassToggle",
  component: GlassToggle,
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
          "A glassmorphism-styled toggle switch with smooth animations and theme support.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    checked: {
      control: "boolean",
      description: "Toggle state",
    },
    disabled: {
      control: "boolean",
      description: "Disabled state",
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "Toggle size",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Interactive component wrapper
const InteractiveToggle = ({
  initialChecked = false,
  ...props
}: {
  initialChecked?: boolean;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
}) => {
  const [checked, setChecked] = useState(initialChecked);
  return <GlassToggle checked={checked} onChange={setChecked} {...props} />;
};

export const Default: Story = {
  render: () => <InteractiveToggle />,
};

export const Checked: Story = {
  render: () => <InteractiveToggle initialChecked />,
};

export const Disabled: Story = {
  args: {
    checked: false,
    disabled: true,
    onChange: () => {},
  },
};

export const DisabledChecked: Story = {
  args: {
    checked: true,
    disabled: true,
    onChange: () => {},
  },
};

export const SmallSize: Story = {
  render: () => <InteractiveToggle size="sm" />,
};

export const LargeSize: Story = {
  render: () => <InteractiveToggle size="lg" />,
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      <div className="text-center">
        <InteractiveToggle size="sm" />
        <p className="text-white/70 text-xs mt-2">Small</p>
      </div>
      <div className="text-center">
        <InteractiveToggle size="md" />
        <p className="text-white/70 text-xs mt-2">Medium</p>
      </div>
      <div className="text-center">
        <InteractiveToggle size="lg" />
        <p className="text-white/70 text-xs mt-2">Large</p>
      </div>
    </div>
  ),
};

export const WithLabel: Story = {
  render: () => {
    const [enabled, setEnabled] = useState(false);
    return (
      <div className="flex items-center gap-3">
        <GlassToggle checked={enabled} onChange={setEnabled} />
        <span className="text-white">{enabled ? "Enabled" : "Disabled"}</span>
      </div>
    );
  },
};

export const SettingsExample: Story = {
  render: () => {
    const [notifications, setNotifications] = useState(true);
    const [darkMode, setDarkMode] = useState(false);
    const [analytics, setAnalytics] = useState(true);
    return (
      <div className="space-y-4 w-64">
        <div className="flex items-center justify-between">
          <span className="text-white">Notifications</span>
          <GlassToggle checked={notifications} onChange={setNotifications} />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-white">Dark Mode</span>
          <GlassToggle checked={darkMode} onChange={setDarkMode} />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-white">Analytics</span>
          <GlassToggle checked={analytics} onChange={setAnalytics} />
        </div>
      </div>
    );
  },
};
