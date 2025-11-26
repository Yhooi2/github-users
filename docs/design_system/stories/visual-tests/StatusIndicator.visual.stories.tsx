import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { StatusIndicator } from "../../StatusIndicator";
import { ThemeProvider } from "../../../context/ThemeContext";
import { Background } from "../../Background";
import type { ThemeName as Theme } from "../../../types";

const meta: Meta<typeof StatusIndicator> = {
  title: "Design System/Visual Tests/StatusIndicator",
  component: StatusIndicator,
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
 * Visual test: All status types in all themes
 * Critical for verifying status colors: green, yellow, red
 */
export const AllStatusTypesAllThemes: Story = {
  render: () => (
    <div className="flex flex-col">
      {themes.map((theme) => (
        <ThemeProvider key={theme} defaultTheme={theme}>
          <Background className="p-6">
            <div className="mb-3 text-xs font-bold uppercase tracking-wider text-white/50">
              Theme: {theme}
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <StatusIndicator type="green" />
                <span className="text-sm text-white/70">Green (Good)</span>
              </div>
              <div className="flex items-center gap-2">
                <StatusIndicator type="yellow" />
                <span className="text-sm text-white/70">Yellow (Warning)</span>
              </div>
              <div className="flex items-center gap-2">
                <StatusIndicator type="red" />
                <span className="text-sm text-white/70">Red (Critical)</span>
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
            <div className="flex items-center gap-8">
              <div className="flex flex-col items-center gap-2">
                <span className="text-xs text-white/50">Default</span>
                <div className="flex gap-2">
                  <StatusIndicator type="green" />
                  <StatusIndicator type="yellow" />
                  <StatusIndicator type="red" />
                </div>
              </div>
              <div className="flex flex-col items-center gap-2">
                <span className="text-xs text-white/50">Large</span>
                <div className="flex gap-2">
                  <StatusIndicator type="green" size="large" />
                  <StatusIndicator type="yellow" size="large" />
                  <StatusIndicator type="red" size="large" />
                </div>
              </div>
            </div>
          </Background>
        </ThemeProvider>
      ))}
    </div>
  ),
};

/**
 * Visual test: Glow effects in glass theme
 * Critical for verifying status glow effects
 */
export const GlowEffectsGlassTheme: Story = {
  render: () => (
    <ThemeProvider defaultTheme="glass">
      <Background className="p-6">
        <div className="space-y-8">
          <div>
            <div className="text-xs text-white/50 mb-4">Status indicators with glow effects</div>
            <div className="flex gap-16">
              <div className="flex flex-col items-center gap-3">
                <StatusIndicator type="green" size="large" />
                <span className="text-xs text-white/50">Emerald Glow</span>
              </div>
              <div className="flex flex-col items-center gap-3">
                <StatusIndicator type="yellow" size="large" />
                <span className="text-xs text-white/50">Amber Glow</span>
              </div>
              <div className="flex flex-col items-center gap-3">
                <StatusIndicator type="red" size="large" />
                <span className="text-xs text-white/50">Rose Glow</span>
              </div>
            </div>
          </div>
        </div>
      </Background>
    </ThemeProvider>
  ),
};

/**
 * Visual test: Status in context (typical usage)
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
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-white/80">
                <StatusIndicator type="green" /> All systems operational
              </div>
              <div className="flex items-center gap-2 text-sm text-white/80">
                <StatusIndicator type="yellow" /> Degraded performance
              </div>
              <div className="flex items-center gap-2 text-sm text-white/80">
                <StatusIndicator type="red" /> Service outage
              </div>
            </div>
          </Background>
        </ThemeProvider>
      ))}
    </div>
  ),
};
