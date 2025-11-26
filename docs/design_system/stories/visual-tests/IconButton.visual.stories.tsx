import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Github, Settings, Share, Bell, Heart, Star } from "lucide-react";
import { IconButton } from "../../IconButton";
import { ThemeProvider } from "../../../context/ThemeContext";
import { Background } from "../../Background";
import type { ThemeName as Theme } from "../../../types";

const meta: Meta<typeof IconButton> = {
  title: "Design System/Visual Tests/IconButton",
  component: IconButton,
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
 * Visual test: Different icons in all themes
 * Critical for verifying gradient background, icon colors, shadows
 */
export const DifferentIconsAllThemes: Story = {
  render: () => (
    <div className="flex flex-col">
      {themes.map((theme) => (
        <ThemeProvider key={theme} defaultTheme={theme}>
          <Background className="p-6">
            <div className="mb-3 text-xs font-bold uppercase tracking-wider text-white/50">
              Theme: {theme}
            </div>
            <div className="flex gap-3">
              <IconButton icon={Github} title="GitHub" />
              <IconButton icon={Settings} title="Settings" />
              <IconButton icon={Share} title="Share" />
              <IconButton icon={Bell} title="Notifications" />
              <IconButton icon={Heart} title="Like" />
              <IconButton icon={Star} title="Star" />
            </div>
          </Background>
        </ThemeProvider>
      ))}
    </div>
  ),
};

/**
 * Visual test: Gradient and shadow in glass theme
 */
export const GradientAndShadowGlassTheme: Story = {
  render: () => (
    <ThemeProvider defaultTheme="glass">
      <Background className="p-6">
        <div className="text-xs text-white/50 mb-4">Icon buttons with gradient and shadow</div>
        <div className="flex gap-4">
          <IconButton icon={Github} title="GitHub" />
          <IconButton icon={Settings} title="Settings" />
          <IconButton icon={Share} title="Share" />
        </div>
      </Background>
    </ThemeProvider>
  ),
};

/**
 * Visual test: In header context
 */
export const InHeaderContextAllThemes: Story = {
  render: () => (
    <div className="flex flex-col">
      {themes.map((theme) => (
        <ThemeProvider key={theme} defaultTheme={theme}>
          <Background className="p-0">
            <div
              className="sticky top-0 flex items-center justify-between p-4 backdrop-blur-md"
              style={{ background: "rgba(0,0,0,0.2)" }}
            >
              <div className="text-sm font-medium text-white">
                Header Example - {theme}
              </div>
              <div className="flex gap-2">
                <IconButton icon={Bell} title="Notifications" />
                <IconButton icon={Settings} title="Settings" />
                <IconButton icon={Github} title="GitHub" />
              </div>
            </div>
          </Background>
        </ThemeProvider>
      ))}
    </div>
  ),
};
