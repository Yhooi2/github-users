import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { AlertTriangle, Info as InfoIcon, CheckCircle } from "lucide-react";
import { Alert } from "../Alert";
import { ThemeProvider } from "../../context/ThemeContext";
import { Background } from "../Background";

const meta: Meta<typeof Alert> = {
  title: "Design System/Display/Alert",
  component: Alert,
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
          "A glassmorphism alert component for displaying important messages with different severity levels.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["danger", "warning", "info"],
      description: "Alert variant",
    },
    title: {
      control: "text",
      description: "Alert title",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Danger: Story = {
  args: {
    variant: "danger",
    title: "Critical Issue",
    icon: AlertTriangle,
    children: "No collaboration detected. Consider contributing to external projects.",
  },
};

export const Warning: Story = {
  args: {
    variant: "warning",
    title: "Attention Required",
    icon: AlertTriangle,
    children: "Burst activity pattern detected. Review commit distribution.",
  },
};

export const InfoVariant: Story = {
  args: {
    variant: "info",
    title: "Information",
    icon: InfoIcon,
    children: "Your profile analysis is complete. View the detailed report.",
  },
};

export const WithoutTitle: Story = {
  args: {
    variant: "warning",
    icon: AlertTriangle,
    children: "Some repositories have unusual commit patterns.",
  },
};

export const WithoutIcon: Story = {
  args: {
    variant: "info",
    title: "Note",
    children: "This feature is currently in beta.",
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="space-y-3">
      <Alert variant="danger" title="Critical" icon={AlertTriangle}>
        No collaboration detected. 0 PRs to external repos.
      </Alert>
      <Alert variant="warning" title="Warning" icon={AlertTriangle}>
        Burst activity pattern detected on 3 days.
      </Alert>
      <Alert variant="info" title="Info" icon={InfoIcon}>
        Profile analysis complete. View your detailed report.
      </Alert>
    </div>
  ),
};

export const SuccessVariant: Story = {
  render: () => (
    <Alert variant="info" title="Success" icon={CheckCircle}>
      All checks passed! Your profile looks authentic.
    </Alert>
  ),
};
