import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { LanguageBar } from "../../LanguageBar";
import { ThemeProvider } from "../../../context/ThemeContext";
import { Background } from "../../Background";
import type { ThemeName as Theme } from "../../../types";

const meta: Meta<typeof LanguageBar> = {
  title: "Design System/Visual Tests/LanguageBar",
  component: LanguageBar,
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

const languagesSet1 = [
  { name: "TypeScript", percentage: 56, color: "bg-blue-400" },
  { name: "HTML", percentage: 22, color: "bg-orange-400" },
  { name: "CSS", percentage: 22, color: "bg-pink-400" },
];

const languagesSet2 = [
  { name: "JavaScript", percentage: 45, color: "bg-yellow-400" },
  { name: "Python", percentage: 30, color: "bg-blue-500" },
  { name: "Go", percentage: 15, color: "bg-cyan-400" },
  { name: "Rust", percentage: 10, color: "bg-orange-600" },
];

const languagesSet3 = [
  { name: "TypeScript", percentage: 100, color: "bg-blue-400" },
];

/**
 * Visual test: Language bars in all themes
 * Critical for verifying bar colors, shadows, label colors
 */
export const LanguageBarsAllThemes: Story = {
  render: () => (
    <div className="flex flex-col">
      {themes.map((theme) => (
        <ThemeProvider key={theme} defaultTheme={theme}>
          <Background className="p-6">
            <div className="mb-3 text-xs font-bold uppercase tracking-wider text-white/50">
              Theme: {theme}
            </div>
            <div className="w-96 space-y-6">
              <LanguageBar languages={languagesSet1} />
              <LanguageBar languages={languagesSet2} />
            </div>
          </Background>
        </ThemeProvider>
      ))}
    </div>
  ),
};

/**
 * Visual test: With and without labels
 */
export const WithAndWithoutLabelsAllThemes: Story = {
  render: () => (
    <div className="flex flex-col">
      {themes.map((theme) => (
        <ThemeProvider key={theme} defaultTheme={theme}>
          <Background className="p-6">
            <div className="mb-3 text-xs font-bold uppercase tracking-wider text-white/50">
              Theme: {theme}
            </div>
            <div className="w-96 space-y-6">
              <div>
                <div className="text-xs text-white/50 mb-2">With Labels</div>
                <LanguageBar languages={languagesSet1} showLabels={true} />
              </div>
              <div>
                <div className="text-xs text-white/50 mb-2">Without Labels</div>
                <LanguageBar languages={languagesSet1} showLabels={false} />
              </div>
            </div>
          </Background>
        </ThemeProvider>
      ))}
    </div>
  ),
};

/**
 * Visual test: Single language (100%)
 */
export const SingleLanguageAllThemes: Story = {
  render: () => (
    <div className="flex flex-col">
      {themes.map((theme) => (
        <ThemeProvider key={theme} defaultTheme={theme}>
          <Background className="p-6">
            <div className="mb-3 text-xs font-bold uppercase tracking-wider text-white/50">
              Theme: {theme}
            </div>
            <div className="w-96">
              <LanguageBar languages={languagesSet3} />
            </div>
          </Background>
        </ThemeProvider>
      ))}
    </div>
  ),
};

/**
 * Visual test: Bar shadow in glass theme
 */
export const BarShadowGlassTheme: Story = {
  render: () => (
    <ThemeProvider defaultTheme="glass">
      <Background className="p-6">
        <div className="text-xs text-white/50 mb-4">Language bar with shadow effect</div>
        <div className="w-96 space-y-6">
          <LanguageBar languages={languagesSet1} />
          <LanguageBar languages={languagesSet2} />
        </div>
      </Background>
    </ThemeProvider>
  ),
};
