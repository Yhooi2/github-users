import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Github, Sparkles, Zap, ArrowRight } from "lucide-react";
import { GlassButton } from "../GlassButton";
import { ThemeProvider } from "../../context/ThemeContext";
import { Background } from "../Background";

const meta: Meta<typeof GlassButton> = {
  title: "Design System/Core/GlassButton",
  component: GlassButton,
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
          "A glassmorphism-styled button with multiple variants (primary, secondary, ghost), sizes (sm, md, lg), and support for icons and loading states.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "ghost"],
      description: "Button variant style",
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "Button size",
    },
    disabled: {
      control: "boolean",
      description: "Disabled state",
    },
    loading: {
      control: "boolean",
      description: "Loading state",
    },
    fullWidth: {
      control: "boolean",
      description: "Full width button",
    },
    iconPosition: {
      control: "select",
      options: ["left", "right"],
      description: "Icon position",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    variant: "primary",
    children: "Primary Button",
  },
};

export const Secondary: Story = {
  args: {
    variant: "secondary",
    children: "Secondary Button",
  },
};

export const Ghost: Story = {
  args: {
    variant: "ghost",
    children: "Ghost Button",
  },
};

export const WithIcon: Story = {
  args: {
    variant: "primary",
    icon: Sparkles,
    children: "Generate Report",
  },
};

export const IconRight: Story = {
  args: {
    variant: "primary",
    icon: ArrowRight,
    iconPosition: "right",
    children: "Continue",
  },
};

export const Loading: Story = {
  args: {
    variant: "primary",
    loading: true,
    children: "Loading...",
  },
};

export const Disabled: Story = {
  args: {
    variant: "primary",
    disabled: true,
    children: "Disabled",
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex gap-4">
      <GlassButton variant="primary">Primary</GlassButton>
      <GlassButton variant="secondary">Secondary</GlassButton>
      <GlassButton variant="ghost">Ghost</GlassButton>
    </div>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <GlassButton size="sm">Small</GlassButton>
      <GlassButton size="md">Medium</GlassButton>
      <GlassButton size="lg">Large</GlassButton>
    </div>
  ),
};

export const WithIcons: Story = {
  render: () => (
    <div className="flex gap-4">
      <GlassButton variant="primary" icon={Zap}>
        Generate
      </GlassButton>
      <GlassButton variant="secondary" icon={Github}>
        GitHub
      </GlassButton>
      <GlassButton variant="ghost" icon={Sparkles}>
        AI Analysis
      </GlassButton>
    </div>
  ),
};

export const FullWidth: Story = {
  args: {
    variant: "primary",
    fullWidth: true,
    icon: Sparkles,
    children: "Full Width Button",
  },
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
};
