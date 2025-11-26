import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { MetricCard } from "../MetricCard";
import { ThemeProvider } from "../../context/ThemeContext";
import { Background } from "../Background";

const meta: Meta<typeof MetricCard> = {
  title: "Design System/Status/MetricCard",
  component: MetricCard,
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
          "A glassmorphism card for displaying metric values with color-coded variants.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    label: {
      control: "text",
      description: "Metric label",
    },
    value: {
      control: "text",
      description: "Metric value",
    },
    variant: {
      control: "select",
      options: ["emerald", "amber", "blue", "red"],
      description: "Color variant",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Emerald: Story = {
  args: {
    label: "Regularity",
    value: 84,
    variant: "emerald",
  },
};

export const Amber: Story = {
  args: {
    label: "Impact",
    value: 45,
    variant: "amber",
  },
};

export const Blue: Story = {
  args: {
    label: "Diversity",
    value: 78,
    variant: "blue",
  },
};

export const Red: Story = {
  args: {
    label: "Collaboration",
    value: 12,
    variant: "red",
  },
};

export const WithPercentage: Story = {
  args: {
    label: "Regularity",
    value: "84%",
    variant: "emerald",
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex gap-4">
      <MetricCard label="Regularity" value={84} variant="emerald" />
      <MetricCard label="Impact" value={45} variant="amber" />
      <MetricCard label="Diversity" value={78} variant="blue" />
      <MetricCard label="Collaboration" value={12} variant="red" />
    </div>
  ),
};

export const MetricsGrid: Story = {
  render: () => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <MetricCard label="Regularity" value={84} variant="emerald" />
      <MetricCard label="Impact" value={45} variant="amber" />
      <MetricCard label="Diversity" value={78} variant="blue" />
      <MetricCard label="Collaboration" value={12} variant="red" />
    </div>
  ),
};

export const TrustScoreMetrics: Story = {
  render: () => (
    <div
      className="p-6 rounded-xl"
      style={{
        background: "rgba(255,255,255,0.05)",
        backdropFilter: "blur(12px)",
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold">Overall Trust Score</h3>
        <span className="text-3xl font-bold bg-gradient-to-r from-amber-400 via-emerald-400 to-cyan-400 bg-clip-text text-transparent">
          72
        </span>
      </div>
      <div className="grid grid-cols-4 gap-4">
        <MetricCard label="Regularity" value={84} variant="emerald" />
        <MetricCard label="Impact" value={45} variant="amber" />
        <MetricCard label="Diversity" value={78} variant="blue" />
        <MetricCard label="Collaboration" value={12} variant="red" />
      </div>
    </div>
  ),
};

export const CompactMetrics: Story = {
  render: () => (
    <div className="flex gap-2">
      <MetricCard label="Activity" value="92%" variant="emerald" />
      <MetricCard label="Quality" value="78%" variant="blue" />
      <MetricCard label="Growth" value="64%" variant="amber" />
    </div>
  ),
};
