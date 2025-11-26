import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { TabToggle } from "../../TabToggle";
import { ThemeProvider } from "../../../context/ThemeContext";
import { Background } from "../../Background";
import type { ThemeName as Theme } from "../../../types";

const meta: Meta = {
  title: "Design System/Visual Tests/TabToggle",
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
type Story = StoryObj;

const themes: Theme[] = ["light", "aurora", "glass"];

const viewTabs = [
  { value: "overview", label: "Overview" },
  { value: "repositories", label: "Repositories" },
  { value: "activity", label: "Activity" },
] as const;

const filterTabs = [
  { value: "all", label: "All" },
  { value: "flagged", label: "Flagged" },
] as const;

/**
 * Visual test: Different active tabs in all themes
 * Critical for verifying active/inactive tab colors, backgrounds
 */
export const DifferentActiveTabsAllThemes: Story = {
  render: () => (
    <div className="flex flex-col">
      {themes.map((theme) => (
        <ThemeProvider key={theme} defaultTheme={theme}>
          <Background className="p-6">
            <div className="mb-3 text-xs font-bold uppercase tracking-wider text-white/50">
              Theme: {theme}
            </div>
            <div className="space-y-4">
              <TabToggle tabs={viewTabs} activeTab="overview" onChange={() => {}} />
              <TabToggle tabs={viewTabs} activeTab="repositories" onChange={() => {}} />
              <TabToggle tabs={viewTabs} activeTab="activity" onChange={() => {}} />
            </div>
          </Background>
        </ThemeProvider>
      ))}
    </div>
  ),
};

/**
 * Visual test: Two-tab toggle in all themes
 */
export const TwoTabToggleAllThemes: Story = {
  render: () => (
    <div className="flex flex-col">
      {themes.map((theme) => (
        <ThemeProvider key={theme} defaultTheme={theme}>
          <Background className="p-6">
            <div className="mb-3 text-xs font-bold uppercase tracking-wider text-white/50">
              Theme: {theme}
            </div>
            <div className="flex gap-8">
              <div>
                <div className="text-xs text-white/50 mb-2">First active</div>
                <TabToggle tabs={filterTabs} activeTab="all" onChange={() => {}} />
              </div>
              <div>
                <div className="text-xs text-white/50 mb-2">Second active</div>
                <TabToggle tabs={filterTabs} activeTab="flagged" onChange={() => {}} />
              </div>
            </div>
          </Background>
        </ThemeProvider>
      ))}
    </div>
  ),
};

/**
 * Visual test: Active tab glow effect in glass theme
 */
export const ActiveTabGlowGlassTheme: Story = {
  render: () => (
    <ThemeProvider defaultTheme="glass">
      <Background className="p-6">
        <div className="text-xs text-white/50 mb-4">Tab toggle with active tab styling</div>
        <div className="space-y-6">
          <TabToggle tabs={viewTabs} activeTab="overview" onChange={() => {}} />
          <TabToggle tabs={filterTabs} activeTab="flagged" onChange={() => {}} />
        </div>
      </Background>
    </ThemeProvider>
  ),
};
