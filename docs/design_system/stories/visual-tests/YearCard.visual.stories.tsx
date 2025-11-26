import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { YearCard } from "../../YearCard";
import { ThemeProvider } from "../../../context/ThemeContext";
import { Background } from "../../Background";
import type { ThemeName as Theme } from "../../../types";

const meta: Meta<typeof YearCard> = {
  title: "Design System/Visual Tests/YearCard",
  component: YearCard,
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
 * Visual test: Year card in all themes
 * Critical for verifying card backgrounds, text colors, progress bars
 */
export const YearCardAllThemes: Story = {
  render: () => (
    <div className="flex flex-col">
      {themes.map((theme) => (
        <ThemeProvider key={theme} defaultTheme={theme}>
          <Background className="p-6">
            <div className="mb-3 text-xs font-bold uppercase tracking-wider text-white/50">
              Theme: {theme}
            </div>
            <div className="flex gap-4">
              <YearCard
                year={2024}
                commits={847}
                progress={85}
                isPeak
              />
              <YearCard
                year={2023}
                commits={623}
                progress={65}
              />
              <YearCard
                year={2022}
                commits={412}
                progress={42}
              />
            </div>
          </Background>
        </ThemeProvider>
      ))}
    </div>
  ),
};

/**
 * Visual test: Peak badge in all themes
 * Critical for verifying peak badge styling
 */
export const PeakBadgeAllThemes: Story = {
  render: () => (
    <div className="flex flex-col">
      {themes.map((theme) => (
        <ThemeProvider key={theme} defaultTheme={theme}>
          <Background className="p-6">
            <div className="mb-3 text-xs font-bold uppercase tracking-wider text-white/50">
              Theme: {theme}
            </div>
            <div className="flex gap-4">
              <YearCard year={2024} commits={1000} progress={100} isPeak />
              <YearCard year={2023} commits={500} progress={50} />
            </div>
          </Background>
        </ThemeProvider>
      ))}
    </div>
  ),
};

/**
 * Visual test: Progress bar variations in all themes
 */
export const ProgressVariationsAllThemes: Story = {
  render: () => (
    <div className="flex flex-col">
      {themes.map((theme) => (
        <ThemeProvider key={theme} defaultTheme={theme}>
          <Background className="p-6">
            <div className="mb-3 text-xs font-bold uppercase tracking-wider text-white/50">
              Theme: {theme}
            </div>
            <div className="flex gap-4">
              <YearCard year={2024} commits={100} progress={10} />
              <YearCard year={2023} commits={250} progress={25} />
              <YearCard year={2022} commits={500} progress={50} />
              <YearCard year={2021} commits={750} progress={75} />
              <YearCard year={2020} commits={1000} progress={100} isPeak />
            </div>
          </Background>
        </ThemeProvider>
      ))}
    </div>
  ),
};

/**
 * Visual test: Card glow and progress in glass theme
 */
export const GlowEffectsGlassTheme: Story = {
  render: () => (
    <ThemeProvider defaultTheme="glass">
      <Background className="p-6">
        <div className="text-xs text-white/50 mb-4">Year cards with glow effects</div>
        <div className="flex gap-4">
          <YearCard year={2024} commits={847} progress={85} isPeak />
          <YearCard year={2023} commits={623} progress={65} />
          <YearCard year={2022} commits={412} progress={42} />
        </div>
      </Background>
    </ThemeProvider>
  ),
};
