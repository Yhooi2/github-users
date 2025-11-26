import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { SearchBar } from "../../SearchBar";
import { ThemeProvider } from "../../../context/ThemeContext";
import { Background } from "../../Background";
import type { ThemeName as Theme } from "../../../types";

const meta: Meta<typeof SearchBar> = {
  title: "Design System/Visual Tests/SearchBar",
  component: SearchBar,
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
 * Visual test: All states in all themes
 * Critical for verifying input/button backgrounds, borders, colors
 */
export const AllStatesAllThemes: Story = {
  render: () => (
    <div className="flex flex-col">
      {themes.map((theme) => (
        <ThemeProvider key={theme} defaultTheme={theme}>
          <Background className="p-6">
            <div className="mb-3 text-xs font-bold uppercase tracking-wider text-white/50">
              Theme: {theme}
            </div>
            <div className="w-96 space-y-3">
              <SearchBar placeholder="Empty search..." value="" />
              <SearchBar placeholder="With value" value="octocat" />
              <SearchBar placeholder="Read only" value="readonly-value" readOnly />
            </div>
          </Background>
        </ThemeProvider>
      ))}
    </div>
  ),
};

/**
 * Visual test: Custom button text
 */
export const CustomButtonTextAllThemes: Story = {
  render: () => (
    <div className="flex flex-col">
      {themes.map((theme) => (
        <ThemeProvider key={theme} defaultTheme={theme}>
          <Background className="p-6">
            <div className="mb-3 text-xs font-bold uppercase tracking-wider text-white/50">
              Theme: {theme}
            </div>
            <div className="w-96 space-y-3">
              <SearchBar value="user" buttonText="Analyze" />
              <SearchBar value="repo" buttonText="Search" />
              <SearchBar value="query" buttonText="Go" />
            </div>
          </Background>
        </ThemeProvider>
      ))}
    </div>
  ),
};

/**
 * Visual test: Button hover/gradient effect in glass theme
 */
export const ButtonGradientGlassTheme: Story = {
  render: () => (
    <ThemeProvider defaultTheme="glass">
      <Background className="p-6">
        <div className="text-xs text-white/50 mb-4">Search bar with gradient button</div>
        <div className="w-96">
          <SearchBar value="octocat" buttonText="Analyze" />
        </div>
      </Background>
    </ThemeProvider>
  ),
};
