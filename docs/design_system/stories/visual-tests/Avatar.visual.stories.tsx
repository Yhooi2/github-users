import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Avatar } from "../../Avatar";
import { ThemeProvider } from "../../../context/ThemeContext";
import { Background } from "../../Background";
import type { ThemeName as Theme } from "../../../types";

const meta: Meta<typeof Avatar> = {
  title: "Design System/Visual Tests/Avatar",
  component: Avatar,
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
 * Visual test: All sizes in all themes
 * Critical for verifying avatar sizes, border radius, shadows
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
            <div className="flex items-end gap-4">
              <Avatar initials="SM" size="sm" />
              <Avatar initials="MD" size="md" />
              <Avatar initials="LG" size="lg" />
              <Avatar initials="XL" size="xl" />
            </div>
          </Background>
        </ThemeProvider>
      ))}
    </div>
  ),
};

/**
 * Visual test: Online indicator in all themes
 * Critical for verifying online dot color, position, glow
 */
export const OnlineIndicatorAllThemes: Story = {
  render: () => (
    <div className="flex flex-col">
      {themes.map((theme) => (
        <ThemeProvider key={theme} defaultTheme={theme}>
          <Background className="p-6">
            <div className="mb-3 text-xs font-bold uppercase tracking-wider text-white/50">
              Theme: {theme}
            </div>
            <div className="flex items-end gap-6">
              <div className="flex flex-col items-center gap-2">
                <Avatar initials="OF" size="lg" online={false} />
                <span className="text-xs text-white/50">Offline</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Avatar initials="ON" size="lg" online={true} />
                <span className="text-xs text-white/50">Online</span>
              </div>
            </div>
          </Background>
        </ThemeProvider>
      ))}
    </div>
  ),
};

/**
 * Visual test: Different gradients
 * Critical for verifying gradient backgrounds
 */
export const DifferentGradientsAllThemes: Story = {
  render: () => (
    <div className="flex flex-col">
      {themes.map((theme) => (
        <ThemeProvider key={theme} defaultTheme={theme}>
          <Background className="p-6">
            <div className="mb-3 text-xs font-bold uppercase tracking-wider text-white/50">
              Theme: {theme}
            </div>
            <div className="flex gap-4">
              <Avatar initials="BV" size="lg" gradient="from-blue-500 via-violet-500 to-indigo-600" />
              <Avatar initials="EC" size="lg" gradient="from-emerald-400 via-cyan-400 to-blue-500" />
              <Avatar initials="RP" size="lg" gradient="from-rose-400 via-pink-500 to-purple-500" />
              <Avatar initials="AO" size="lg" gradient="from-amber-400 via-orange-500 to-red-500" />
            </div>
          </Background>
        </ThemeProvider>
      ))}
    </div>
  ),
};

/**
 * Visual test: Avatar glow effect in glass theme
 */
export const GlowEffectGlassTheme: Story = {
  render: () => (
    <ThemeProvider defaultTheme="glass">
      <Background className="p-6">
        <div className="text-xs text-white/50 mb-4">Avatar glow effects in glass theme</div>
        <div className="flex gap-8">
          <Avatar initials="AS" size="xl" online />
          <Avatar initials="JD" size="xl" gradient="from-emerald-400 to-cyan-400" online />
          <Avatar initials="MK" size="xl" gradient="from-rose-400 to-pink-500" />
        </div>
      </Background>
    </ThemeProvider>
  ),
};
