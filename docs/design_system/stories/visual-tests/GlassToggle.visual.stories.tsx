import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { GlassToggle } from "../../GlassToggle";
import { ThemeProvider } from "../../../context/ThemeContext";
import { Background } from "../../Background";
import type { ThemeName as Theme } from "../../../types";

const meta: Meta<typeof GlassToggle> = {
  title: "Design System/Visual Tests/GlassToggle",
  component: GlassToggle,
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
 * Visual test: On/Off states in all themes
 * Critical for verifying toggle backgrounds, thumb position, glow
 */
export const OnOffStatesAllThemes: Story = {
  render: () => (
    <div className="flex flex-col">
      {themes.map((theme) => (
        <ThemeProvider key={theme} defaultTheme={theme}>
          <Background className="p-6">
            <div className="mb-3 text-xs font-bold uppercase tracking-wider text-white/50">
              Theme: {theme}
            </div>
            <div className="flex items-center gap-8">
              <div className="flex flex-col items-center gap-2">
                <GlassToggle checked={false} onChange={() => {}} />
                <span className="text-xs text-white/50">Off</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <GlassToggle checked={true} onChange={() => {}} />
                <span className="text-xs text-white/50">On</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <GlassToggle checked={false} onChange={() => {}} disabled />
                <span className="text-xs text-white/50">Disabled Off</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <GlassToggle checked={true} onChange={() => {}} disabled />
                <span className="text-xs text-white/50">Disabled On</span>
              </div>
            </div>
          </Background>
        </ThemeProvider>
      ))}
    </div>
  ),
};

/**
 * Visual test: All sizes in all themes
 */
export const AllSizesAllThemes: Story = {
  render: () => (
    <div className="flex flex-col">
      {themes.map((theme) => (
        <ThemeProvider key={theme} defaultTheme={theme}>
          <Background className="p-6">
            <div className="mb-3 text-xs font-bold uppercase tracking-wider text-white/50">
              Theme: {theme}
            </div>
            <div className="flex items-center gap-12">
              <div className="flex flex-col items-center gap-4">
                <span className="text-xs text-white/50">Small</span>
                <GlassToggle checked={false} onChange={() => {}} size="sm" />
                <GlassToggle checked={true} onChange={() => {}} size="sm" />
              </div>
              <div className="flex flex-col items-center gap-4">
                <span className="text-xs text-white/50">Medium</span>
                <GlassToggle checked={false} onChange={() => {}} size="md" />
                <GlassToggle checked={true} onChange={() => {}} size="md" />
              </div>
              <div className="flex flex-col items-center gap-4">
                <span className="text-xs text-white/50">Large</span>
                <GlassToggle checked={false} onChange={() => {}} size="lg" />
                <GlassToggle checked={true} onChange={() => {}} size="lg" />
              </div>
            </div>
          </Background>
        </ThemeProvider>
      ))}
    </div>
  ),
};

/**
 * Visual test: In context with labels
 */
export const InContextAllThemes: Story = {
  render: () => (
    <div className="flex flex-col">
      {themes.map((theme) => (
        <ThemeProvider key={theme} defaultTheme={theme}>
          <Background className="p-6">
            <div className="mb-3 text-xs font-bold uppercase tracking-wider text-white/50">
              Theme: {theme}
            </div>
            <div className="w-72 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/80">Dark Mode</span>
                <GlassToggle checked={true} onChange={() => {}} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/80">Notifications</span>
                <GlassToggle checked={false} onChange={() => {}} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/80">Auto-save</span>
                <GlassToggle checked={true} onChange={() => {}} />
              </div>
            </div>
          </Background>
        </ThemeProvider>
      ))}
    </div>
  ),
};
