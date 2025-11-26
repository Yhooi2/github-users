import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { GlassSelect } from "../../GlassSelect";
import { ThemeProvider } from "../../../context/ThemeContext";
import { Background } from "../../Background";
import type { ThemeName as Theme } from "../../../types";

const meta: Meta<typeof GlassSelect> = {
  title: "Design System/Visual Tests/GlassSelect",
  component: GlassSelect,
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

const sortOptions = [
  { value: "commits", label: "Sort: Commits ↓" },
  { value: "stars", label: "Sort: Stars ↓" },
  { value: "name", label: "Sort: Name ↓" },
  { value: "date", label: "Sort: Date ↓" },
];

const filterOptions = [
  { value: "all", label: "All Repositories" },
  { value: "active", label: "Active Only" },
  { value: "archived", label: "Archived" },
  { value: "flagged", label: "Flagged Issues" },
];

/**
 * Visual test: Select in all themes
 * Critical for verifying select backgrounds, borders, text colors
 */
export const SelectAllThemes: Story = {
  render: () => (
    <div className="flex flex-col">
      {themes.map((theme) => (
        <ThemeProvider key={theme} defaultTheme={theme}>
          <Background className="p-6">
            <div className="mb-3 text-xs font-bold uppercase tracking-wider text-white/50">
              Theme: {theme}
            </div>
            <div className="flex gap-4">
              <GlassSelect value="commits" options={sortOptions} />
              <GlassSelect value="all" options={filterOptions} />
            </div>
          </Background>
        </ThemeProvider>
      ))}
    </div>
  ),
};

/**
 * Visual test: Different selected values
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
              <GlassSelect value="commits" options={sortOptions} />
              <GlassSelect value="stars" options={sortOptions} />
              <GlassSelect value="name" options={sortOptions} />
              <GlassSelect value="date" options={sortOptions} />
            </div>
          </Background>
        </ThemeProvider>
      ))}
    </div>
  ),
};
