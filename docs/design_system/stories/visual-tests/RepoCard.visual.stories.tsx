import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { RepoCard } from "../../RepoCard";
import { ThemeProvider } from "../../../context/ThemeContext";
import { Background } from "../../Background";
import type { ThemeName as Theme } from "../../../types";

const meta: Meta<typeof RepoCard> = {
  title: "Design System/Visual Tests/RepoCard",
  component: RepoCard,
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

const goodRepo = {
  name: "awesome-project",
  status: "good" as const,
  stars: 142,
  commits: 847,
  contribution: 75,
  langs: [
    { name: "TypeScript", percent: 65, color: "bg-blue-400" },
    { name: "CSS", percent: 25, color: "bg-pink-400" },
    { name: "HTML", percent: 10, color: "bg-orange-400" },
  ],
};

const warningRepo = {
  name: "needs-attention",
  status: "warning" as const,
  stars: 23,
  commits: 156,
  contribution: 45,
  langs: [
    { name: "JavaScript", percent: 80, color: "bg-yellow-400" },
    { name: "CSS", percent: 20, color: "bg-pink-400" },
  ],
};

const criticalRepo = {
  name: "problematic-repo",
  status: "critical" as const,
  stars: 5,
  commits: 42,
  contribution: 15,
  langs: [
    { name: "Python", percent: 100, color: "bg-blue-500" },
  ],
  issues: [
    "Security vulnerability detected",
    "Outdated dependencies",
  ],
};

/**
 * Visual test: Different status types in all themes
 * Critical for verifying status indicators, colors
 */
export const DifferentStatusAllThemes: Story = {
  render: () => (
    <div className="flex flex-col">
      {themes.map((theme) => (
        <ThemeProvider key={theme} defaultTheme={theme}>
          <Background className="p-6">
            <div className="mb-3 text-xs font-bold uppercase tracking-wider text-white/50">
              Theme: {theme}
            </div>
            <div className="w-96 space-y-3">
              <RepoCard repo={goodRepo} />
              <RepoCard repo={warningRepo} />
              <RepoCard repo={criticalRepo} />
            </div>
          </Background>
        </ThemeProvider>
      ))}
    </div>
  ),
};

/**
 * Visual test: Expanded state in all themes
 * Critical for verifying expanded content styling
 */
export const ExpandedStateAllThemes: Story = {
  render: () => (
    <div className="flex flex-col">
      {themes.map((theme) => (
        <ThemeProvider key={theme} defaultTheme={theme}>
          <Background className="p-6">
            <div className="mb-3 text-xs font-bold uppercase tracking-wider text-white/50">
              Theme: {theme}
            </div>
            <div className="w-96">
              <RepoCard repo={goodRepo} expanded />
            </div>
          </Background>
        </ThemeProvider>
      ))}
    </div>
  ),
};

/**
 * Visual test: Expanded with issues in all themes
 * Critical for verifying danger alert styling
 */
export const ExpandedWithIssuesAllThemes: Story = {
  render: () => (
    <div className="flex flex-col">
      {themes.map((theme) => (
        <ThemeProvider key={theme} defaultTheme={theme}>
          <Background className="p-6">
            <div className="mb-3 text-xs font-bold uppercase tracking-wider text-white/50">
              Theme: {theme}
            </div>
            <div className="w-96">
              <RepoCard repo={criticalRepo} expanded />
            </div>
          </Background>
        </ThemeProvider>
      ))}
    </div>
  ),
};

/**
 * Visual test: Flagged only mode in all themes
 */
export const FlaggedOnlyModeAllThemes: Story = {
  render: () => (
    <div className="flex flex-col">
      {themes.map((theme) => (
        <ThemeProvider key={theme} defaultTheme={theme}>
          <Background className="p-6">
            <div className="mb-3 text-xs font-bold uppercase tracking-wider text-white/50">
              Theme: {theme}
            </div>
            <div className="w-96">
              <RepoCard repo={criticalRepo} showFlaggedOnly />
            </div>
          </Background>
        </ThemeProvider>
      ))}
    </div>
  ),
};

/**
 * Visual test: Language bars in card in glass theme
 */
export const LanguageBarsGlassTheme: Story = {
  render: () => (
    <ThemeProvider defaultTheme="glass">
      <Background className="p-6">
        <div className="text-xs text-white/50 mb-4">Repository cards with language bars</div>
        <div className="w-96 space-y-3">
          <RepoCard repo={goodRepo} />
          <RepoCard repo={warningRepo} />
          <RepoCard repo={criticalRepo} />
        </div>
      </Background>
    </ThemeProvider>
  ),
};
