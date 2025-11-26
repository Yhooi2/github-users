import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Background } from "../Background";
import { ThemeProvider, useTheme } from "../../context/ThemeContext";
import { GlassCard } from "../GlassCard";

const meta: Meta<typeof Background> = {
  title: "Design System/Layout/Background",
  component: Background,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "A full-screen background component with gradient, floating orbs, and grid overlay. Adapts to all three themes.",
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const GlassTheme: Story = {
  render: () => (
    <ThemeProvider defaultTheme="glass">
      <Background>
        <div className="min-h-screen flex items-center justify-center">
          <GlassCard intensity="strong" className="p-8">
            <h1 className="text-2xl font-bold text-white">Glass Theme</h1>
            <p className="text-white/70 mt-2">
              Beautiful glassmorphism background with floating orbs.
            </p>
          </GlassCard>
        </div>
      </Background>
    </ThemeProvider>
  ),
};

export const LightTheme: Story = {
  render: () => (
    <ThemeProvider defaultTheme="light">
      <Background>
        <div className="min-h-screen flex items-center justify-center">
          <GlassCard intensity="strong" className="p-8">
            <h1 className="text-2xl font-bold text-slate-800">Light Theme</h1>
            <p className="text-slate-600 mt-2">
              Clean and bright background with subtle gradients.
            </p>
          </GlassCard>
        </div>
      </Background>
    </ThemeProvider>
  ),
};

export const AuroraTheme: Story = {
  render: () => (
    <ThemeProvider defaultTheme="aurora">
      <Background>
        <div className="min-h-screen flex items-center justify-center">
          <GlassCard intensity="strong" className="p-8">
            <h1 className="text-2xl font-bold text-white">Aurora Theme</h1>
            <p className="text-white/70 mt-2">
              Dark theme with aurora borealis inspired colors.
            </p>
          </GlassCard>
        </div>
      </Background>
    </ThemeProvider>
  ),
};

// Interactive theme switcher component
const ThemeSwitcher = () => {
  const { theme, cycleTheme } = useTheme();
  return (
    <div className="min-h-screen flex items-center justify-center">
      <GlassCard intensity="strong" className="p-8 text-center">
        <h1 className="text-2xl font-bold text-white mb-4">Current: {theme}</h1>
        <button
          onClick={cycleTheme}
          className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
        >
          Cycle Theme
        </button>
      </GlassCard>
    </div>
  );
};

export const InteractiveThemeSwitcher: Story = {
  render: () => (
    <ThemeProvider defaultTheme="glass">
      <Background>
        <ThemeSwitcher />
      </Background>
    </ThemeProvider>
  ),
};

export const WithContent: Story = {
  render: () => (
    <ThemeProvider defaultTheme="glass">
      <Background>
        <div className="min-h-screen p-8">
          <div className="max-w-4xl mx-auto space-y-6">
            <GlassCard intensity="strong" className="p-6">
              <h1 className="text-2xl font-bold text-white">Dashboard</h1>
              <p className="text-white/70 mt-2">
                Welcome to your GitHub Analytics dashboard.
              </p>
            </GlassCard>
            <div className="grid grid-cols-3 gap-4">
              <GlassCard intensity="medium" className="p-4">
                <h3 className="text-white font-semibold">Commits</h3>
                <p className="text-3xl font-bold text-violet-400">2,242</p>
              </GlassCard>
              <GlassCard intensity="medium" className="p-4">
                <h3 className="text-white font-semibold">Repos</h3>
                <p className="text-3xl font-bold text-cyan-400">11</p>
              </GlassCard>
              <GlassCard intensity="medium" className="p-4">
                <h3 className="text-white font-semibold">PRs</h3>
                <p className="text-3xl font-bold text-emerald-400">47</p>
              </GlassCard>
            </div>
          </div>
        </div>
      </Background>
    </ThemeProvider>
  ),
};
