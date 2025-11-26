import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { GlassCard } from "../GlassCard";
import { ThemeProvider } from "../../context/ThemeContext";
import { Background } from "../Background";

const meta: Meta<typeof GlassCard> = {
  title: "Design System/Core/GlassCard",
  component: GlassCard,
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
          "A glassmorphism-styled card component with customizable intensity and glow effects. Adapts beautifully to all three themes.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    intensity: {
      control: "select",
      options: ["subtle", "medium", "strong"],
      description: "Glass blur intensity level",
    },
    glow: {
      control: "select",
      options: [null, "blue", "violet", "purple", "cyan"],
      description: "Optional glow color",
    },
    className: {
      control: "text",
      description: "Additional CSS classes",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    intensity: "medium",
    glow: null,
    children: (
      <div className="p-6">
        <h3 className="text-lg font-semibold text-white">Glass Card</h3>
        <p className="text-sm text-white/70 mt-2">
          A beautiful glassmorphism card with blur effect.
        </p>
      </div>
    ),
  },
};

export const Subtle: Story = {
  args: {
    intensity: "subtle",
    children: (
      <div className="p-6">
        <h3 className="text-lg font-semibold text-white">Subtle Intensity</h3>
        <p className="text-sm text-white/70 mt-2">
          Lighter glass effect for minimal UI elements.
        </p>
      </div>
    ),
  },
};

export const Strong: Story = {
  args: {
    intensity: "strong",
    children: (
      <div className="p-6">
        <h3 className="text-lg font-semibold text-white">Strong Intensity</h3>
        <p className="text-sm text-white/70 mt-2">
          Maximum blur for prominent cards.
        </p>
      </div>
    ),
  },
};

export const WithVioletGlow: Story = {
  args: {
    intensity: "strong",
    glow: "violet",
    children: (
      <div className="p-6">
        <h3 className="text-lg font-semibold text-white">Violet Glow</h3>
        <p className="text-sm text-white/70 mt-2">
          Card with purple/violet glow effect.
        </p>
      </div>
    ),
  },
};

export const WithCyanGlow: Story = {
  args: {
    intensity: "strong",
    glow: "cyan",
    children: (
      <div className="p-6">
        <h3 className="text-lg font-semibold text-white">Cyan Glow</h3>
        <p className="text-sm text-white/70 mt-2">
          Card with cyan/blue glow effect.
        </p>
      </div>
    ),
  },
};

export const AllIntensities: Story = {
  render: () => (
    <div className="flex gap-4">
      <GlassCard intensity="subtle" className="w-48">
        <div className="p-4">
          <h4 className="font-medium text-white">Subtle</h4>
        </div>
      </GlassCard>
      <GlassCard intensity="medium" className="w-48">
        <div className="p-4">
          <h4 className="font-medium text-white">Medium</h4>
        </div>
      </GlassCard>
      <GlassCard intensity="strong" className="w-48">
        <div className="p-4">
          <h4 className="font-medium text-white">Strong</h4>
        </div>
      </GlassCard>
    </div>
  ),
};

export const AllGlows: Story = {
  render: () => (
    <div className="flex gap-4">
      <GlassCard intensity="strong" glow="blue" className="w-40">
        <div className="p-4">
          <h4 className="font-medium text-white">Blue</h4>
        </div>
      </GlassCard>
      <GlassCard intensity="strong" glow="violet" className="w-40">
        <div className="p-4">
          <h4 className="font-medium text-white">Violet</h4>
        </div>
      </GlassCard>
      <GlassCard intensity="strong" glow="cyan" className="w-40">
        <div className="p-4">
          <h4 className="font-medium text-white">Cyan</h4>
        </div>
      </GlassCard>
    </div>
  ),
};
