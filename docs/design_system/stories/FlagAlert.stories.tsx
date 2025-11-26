import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { FlagAlert } from "../FlagAlert";
import { ThemeProvider } from "../../context/ThemeContext";
import { Background } from "../Background";

const meta: Meta<typeof FlagAlert> = {
  title: "Design System/Desktop/FlagAlert",
  component: FlagAlert,
  decorators: [
    (Story) => (
      <ThemeProvider defaultTheme="glass">
        <Background>
          <div className="p-8 w-96">
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
          "A glassmorphism alert for displaying flags/issues with danger or warning variants.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    type: {
      control: "select",
      options: ["danger", "warning"],
      description: "Alert type",
    },
    title: {
      control: "text",
      description: "Alert title",
    },
    description: {
      control: "text",
      description: "Alert description",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Danger: Story = {
  args: {
    type: "danger",
    title: "No collaboration",
    description: "0 PRs to external repos · 0 code reviews",
  },
};

export const Warning: Story = {
  args: {
    type: "warning",
    title: "Burst activity pattern",
    description: "3 days with 50+ commits · Uneven distribution",
  },
};

export const DangerNoDescription: Story = {
  args: {
    type: "danger",
    title: "Critical: Empty commits detected",
  },
};

export const WarningNoDescription: Story = {
  args: {
    type: "warning",
    title: "Unusual commit timing",
  },
};

export const FlagsList: Story = {
  render: () => (
    <div className="space-y-2">
      <FlagAlert
        type="danger"
        title="No collaboration"
        description="0 PRs to external repos · 0 code reviews"
      />
      <FlagAlert
        type="warning"
        title="Burst activity pattern"
        description="3 days with 50+ commits · Uneven distribution"
      />
      <FlagAlert
        type="warning"
        title="Low code diversity"
        description="Single language in 80% of repos"
      />
    </div>
  ),
};

export const InExpandedSection: Story = {
  render: () => (
    <div
      className="p-4 rounded-xl"
      style={{
        background: "rgba(255,255,255,0.05)",
        backdropFilter: "blur(12px)",
      }}
    >
      <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
        ⚠️ 2 flags detected
      </h3>
      <div className="space-y-2">
        <FlagAlert
          type="danger"
          title="No collaboration"
          description="0 PRs to external repos · 0 code reviews"
        />
        <FlagAlert
          type="warning"
          title="Burst activity pattern"
          description="3 days with 50+ commits · Uneven distribution"
        />
      </div>
    </div>
  ),
};
