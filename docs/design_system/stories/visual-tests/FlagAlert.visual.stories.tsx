import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { FlagAlert } from "../../FlagAlert";
import { ThemeProvider } from "../../../context/ThemeContext";
import { Background } from "../../Background";
import type { ThemeName as Theme } from "../../../types";

const meta: Meta<typeof FlagAlert> = {
  title: "Design System/Visual Tests/FlagAlert",
  component: FlagAlert,
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
 * Visual test: Both types in all themes
 * Critical for verifying alert backgrounds, borders, status indicators
 */
export const BothTypesAllThemes: Story = {
  render: () => (
    <div className="flex flex-col">
      {themes.map((theme) => (
        <ThemeProvider key={theme} defaultTheme={theme}>
          <Background className="p-6">
            <div className="mb-3 text-xs font-bold uppercase tracking-wider text-white/50">
              Theme: {theme}
            </div>
            <div className="w-96 space-y-3">
              <FlagAlert
                type="danger"
                title="No collaboration"
                description="0 PRs to external repos · 0 code reviews"
              />
              <FlagAlert
                type="warning"
                title="Low activity period"
                description="Activity dropped 40% in last quarter"
              />
            </div>
          </Background>
        </ThemeProvider>
      ))}
    </div>
  ),
};

/**
 * Visual test: Title only (no description) in all themes
 */
export const TitleOnlyAllThemes: Story = {
  render: () => (
    <div className="flex flex-col">
      {themes.map((theme) => (
        <ThemeProvider key={theme} defaultTheme={theme}>
          <Background className="p-6">
            <div className="mb-3 text-xs font-bold uppercase tracking-wider text-white/50">
              Theme: {theme}
            </div>
            <div className="w-96 space-y-3">
              <FlagAlert type="danger" title="Critical security issue detected" />
              <FlagAlert type="warning" title="Performance degradation noticed" />
            </div>
          </Background>
        </ThemeProvider>
      ))}
    </div>
  ),
};

/**
 * Visual test: Status indicator glow in glass theme
 */
export const StatusGlowGlassTheme: Story = {
  render: () => (
    <ThemeProvider defaultTheme="glass">
      <Background className="p-6">
        <div className="text-xs text-white/50 mb-4">Flag alerts with status indicator glow</div>
        <div className="w-96 space-y-3">
          <FlagAlert
            type="danger"
            title="Red status glow"
            description="Critical alert with danger status"
          />
          <FlagAlert
            type="warning"
            title="Yellow status glow"
            description="Warning alert with warning status"
          />
        </div>
      </Background>
    </ThemeProvider>
  ),
};
