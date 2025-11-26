import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { AIInsightsCard } from "../AIInsightsCard";
import { ThemeProvider } from "../../context/ThemeContext";
import { Background } from "../Background";
import { GlassCard } from "../GlassCard";

const meta: Meta<typeof AIInsightsCard> = {
  title: "Design System/Desktop/AIInsightsCard",
  component: AIInsightsCard,
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
          "A glassmorphism CTA card for AI summary feature. Shows available features and generate button.",
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onGenerateReport: () => alert("Generating AI report..."),
  },
};

export const InProfileHeader: Story = {
  render: () => (
    <GlassCard intensity="strong" glow="violet" className="p-5">
      <div className="flex gap-6">
        <div className="flex-1">
          <div className="flex gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 via-violet-500 to-indigo-500 text-xl font-bold text-white">
              AS
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Artem Safronov</h1>
              <p className="text-white/70 text-sm">@Yhooi2 · Joined Jan 2023</p>
              <p className="text-white/50 text-sm mt-1">
                11 repos · 1 follower · 5 following
              </p>
            </div>
          </div>
        </div>
        <AIInsightsCard onGenerateReport={() => alert("Generating...")} />
      </div>
    </GlassCard>
  ),
};

export const Standalone: Story = {
  render: () => (
    <div className="w-64">
      <AIInsightsCard onGenerateReport={() => alert("Generating...")} />
    </div>
  ),
};
