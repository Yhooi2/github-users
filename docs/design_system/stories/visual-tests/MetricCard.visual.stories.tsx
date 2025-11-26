import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { MetricCard } from "../../MetricCard";
import { ThemeProvider } from "../../../context/ThemeContext";
import { Background } from "../../Background";
import type { ThemeName as Theme } from "../../../types";

const meta: Meta<typeof MetricCard> = {
  title: "Design System/Visual Tests/MetricCard",
  component: MetricCard,
  parameters: {
    layout: "fullscreen",
    chromatic: {
      modes: {
        light: { theme: "light" },
        aurora: { theme: "aurora" },
        glass: { theme: "glass" },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const themes: Theme[] = ["light", "aurora", "glass"];

/**
 * Visual test: All variants in all themes
 * Critical for verifying metric backgrounds, text colors, borders
 */
export const AllVariantsAllThemes: Story = {
  render: () => (
    <div className="flex flex-col">
      {themes.map((theme) => (
        <ThemeProvider key={theme} defaultTheme={theme}>
          <Background className="p-6">
            <div className="mb-3 text-xs font-bold uppercase tracking-wider text-white/50">
              Theme: {theme}
            </div>
            <div className="flex gap-4">
              <MetricCard label="Regularity" value={84} variant="emerald" />
              <MetricCard label="Quality" value={92} variant="amber" />
              <MetricCard label="Impact" value={76} variant="blue" />
              <MetricCard label="Risk" value={23} variant="red" />
            </div>
          </Background>
        </ThemeProvider>
      ))}
    </div>
  ),
};

/**
 * Visual test: Text glow effect in glass theme
 * Critical for verifying metric value text glow
 */
export const TextGlowGlassTheme: Story = {
  render: () => (
    <ThemeProvider defaultTheme="glass">
      <Background className="p-6">
        <div className="text-xs text-white/50 mb-4">Metric values with text glow</div>
        <div className="flex gap-4">
          <MetricCard label="Emerald Glow" value={100} variant="emerald" />
          <MetricCard label="Amber Glow" value={85} variant="amber" />
          <MetricCard label="Blue Glow" value={72} variant="blue" />
          <MetricCard label="Red Glow" value={34} variant="red" />
        </div>
      </Background>
    </ThemeProvider>
  ),
};

/**
 * Visual test: Different value types
 */
export const DifferentValuesAllThemes: Story = {
  render: () => (
    <div className="flex flex-col">
      {themes.map((theme) => (
        <ThemeProvider key={theme} defaultTheme={theme}>
          <Background className="p-6">
            <div className="mb-3 text-xs font-bold uppercase tracking-wider text-white/50">
              Theme: {theme}
            </div>
            <div className="flex gap-4">
              <MetricCard label="Numeric" value={42} variant="emerald" />
              <MetricCard label="Percentage" value="95%" variant="amber" />
              <MetricCard label="Grade" value="A+" variant="blue" />
              <MetricCard label="Score" value="9.5" variant="red" />
            </div>
          </Background>
        </ThemeProvider>
      ))}
    </div>
  ),
};

/**
 * Visual test: Grid layout (typical usage)
 */
export const GridLayoutAllThemes: Story = {
  render: () => (
    <div className="flex flex-col">
      {themes.map((theme) => (
        <ThemeProvider key={theme} defaultTheme={theme}>
          <Background className="p-6">
            <div className="mb-3 text-xs font-bold uppercase tracking-wider text-white/50">
              Theme: {theme}
            </div>
            <div className="grid grid-cols-4 gap-3 w-[400px]">
              <MetricCard label="Activity" value={84} variant="emerald" />
              <MetricCard label="Quality" value={92} variant="amber" />
              <MetricCard label="Impact" value={76} variant="blue" />
              <MetricCard label="Growth" value={68} variant="emerald" />
            </div>
          </Background>
        </ThemeProvider>
      ))}
    </div>
  ),
};
