import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { GlassBadge } from "../GlassBadge";
import { ThemeProvider } from "../../context/ThemeContext";
import { Background } from "../Background";

const meta: Meta<typeof GlassBadge> = {
  title: "Design System/Core/GlassBadge",
  component: GlassBadge,
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
          "A glassmorphism-styled badge component with multiple variants for different semantic states.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "success", "warning", "danger", "primary", "violet"],
      description: "Badge variant",
    },
    size: {
      control: "select",
      options: ["sm", "md"],
      description: "Badge size",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    variant: "default",
    children: "Default",
  },
};

export const Success: Story = {
  args: {
    variant: "success",
    children: "Success",
  },
};

export const Warning: Story = {
  args: {
    variant: "warning",
    children: "Warning",
  },
};

export const Danger: Story = {
  args: {
    variant: "danger",
    children: "Danger",
  },
};

export const Primary: Story = {
  args: {
    variant: "primary",
    children: "Primary",
  },
};

export const Violet: Story = {
  args: {
    variant: "violet",
    children: "Violet",
  },
};

export const WithEmoji: Story = {
  args: {
    variant: "default",
    children: "🔥 Peak",
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <GlassBadge variant="default">Default</GlassBadge>
      <GlassBadge variant="success">Success</GlassBadge>
      <GlassBadge variant="warning">Warning</GlassBadge>
      <GlassBadge variant="danger">Danger</GlassBadge>
      <GlassBadge variant="primary">Primary</GlassBadge>
      <GlassBadge variant="violet">Violet</GlassBadge>
    </div>
  ),
};

export const YearLabels: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <GlassBadge>🔥 Peak</GlassBadge>
      <GlassBadge>📈 Growth</GlassBadge>
      <GlassBadge>🌱 Start</GlassBadge>
      <GlassBadge>⭐ Best</GlassBadge>
    </div>
  ),
};

export const StatusBadges: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <GlassBadge variant="success">Active</GlassBadge>
      <GlassBadge variant="warning">Pending</GlassBadge>
      <GlassBadge variant="danger">Inactive</GlassBadge>
      <GlassBadge variant="primary">New</GlassBadge>
    </div>
  ),
};

export const CountBadges: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <GlassBadge>5 repos</GlassBadge>
      <GlassBadge variant="violet">12 PRs</GlassBadge>
      <GlassBadge variant="primary">99+ commits</GlassBadge>
    </div>
  ),
};
