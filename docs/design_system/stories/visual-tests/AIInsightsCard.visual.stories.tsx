import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { AIInsightsCard } from "../../AIInsightsCard";
import { ThemeProvider } from "../../../context/ThemeContext";
import { Background } from "../../Background";
import type { ThemeName as Theme } from "../../../types";

const meta: Meta<typeof AIInsightsCard> = {
  title: "Design System/Visual Tests/AIInsightsCard",
  component: AIInsightsCard,
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
 * Visual test: AI Insights card in all themes
 * Critical for verifying card backgrounds, borders, button styling
 */
export const AIInsightsCardAllThemes: Story = {
  render: () => (
    <div className="flex flex-col">
      {themes.map((theme) => (
        <ThemeProvider key={theme} defaultTheme={theme}>
          <Background className="p-6">
            <div className="mb-3 text-xs font-bold uppercase tracking-wider text-white/50">
              Theme: {theme}
            </div>
            <AIInsightsCard />
          </Background>
        </ThemeProvider>
      ))}
    </div>
  ),
};

/**
 * Visual test: Button gradient and glow in glass theme
 */
export const ButtonGlowGlassTheme: Story = {
  render: () => (
    <ThemeProvider defaultTheme="glass">
      <Background className="p-6">
        <div className="text-xs text-white/50 mb-4">AI Insights card with button glow</div>
        <AIInsightsCard />
      </Background>
    </ThemeProvider>
  ),
};

/**
 * Visual test: Check icons color in all themes
 */
export const CheckIconsAllThemes: Story = {
  render: () => (
    <div className="flex flex-col">
      {themes.map((theme) => (
        <ThemeProvider key={theme} defaultTheme={theme}>
          <Background className="p-6">
            <div className="mb-3 text-xs font-bold uppercase tracking-wider text-white/50">
              Theme: {theme} - Verify green check icons
            </div>
            <AIInsightsCard />
          </Background>
        </ThemeProvider>
      ))}
    </div>
  ),
};
