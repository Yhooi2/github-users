import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Background } from "../../Background";
import { ThemeProvider } from "../../../context/ThemeContext";
import type { ThemeName as Theme } from "../../../types";

const meta: Meta<typeof Background> = {
  title: "Design System/Visual Tests/Background",
  component: Background,
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
 * Visual test: Background in all themes
 * CRITICAL: This tests the most important visual elements:
 * - Background gradient
 * - Floating orbs (in glass theme)
 * - Grid overlay
 */
export const BackgroundAllThemes: Story = {
  render: () => (
    <div className="flex flex-col">
      {themes.map((theme) => (
        <ThemeProvider key={theme} defaultTheme={theme}>
          <div className="relative">
            <div className="absolute top-4 left-4 z-10 text-xs font-bold uppercase tracking-wider text-white/50">
              Theme: {theme}
            </div>
            <Background className="min-h-[300px]">
              <div className="flex items-center justify-center h-full">
                <div className="text-white/30 text-lg">Background Content Area</div>
              </div>
            </Background>
          </div>
        </ThemeProvider>
      ))}
    </div>
  ),
};

/**
 * Visual test: Light theme background
 * Verify: Light gradient, subtle patterns
 */
export const LightThemeBackground: Story = {
  render: () => (
    <ThemeProvider defaultTheme="light">
      <Background className="min-h-[400px]">
        <div className="flex items-center justify-center h-full">
          <div className="text-gray-500 text-lg">Light Theme Background</div>
        </div>
      </Background>
    </ThemeProvider>
  ),
};

/**
 * Visual test: Aurora theme background
 * Verify: Dark gradient with aurora colors
 */
export const AuroraThemeBackground: Story = {
  render: () => (
    <ThemeProvider defaultTheme="aurora">
      <Background className="min-h-[400px]">
        <div className="flex items-center justify-center h-full">
          <div className="text-white/50 text-lg">Aurora Theme Background</div>
        </div>
      </Background>
    </ThemeProvider>
  ),
};

/**
 * Visual test: Glass theme background
 * CRITICAL: Verify floating orbs, blur effects, grid overlay
 */
export const GlassThemeBackground: Story = {
  render: () => (
    <ThemeProvider defaultTheme="glass">
      <Background className="min-h-[400px]">
        <div className="flex items-center justify-center h-full">
          <div className="text-white/50 text-lg">Glass Theme Background - Check Orbs</div>
        </div>
      </Background>
    </ThemeProvider>
  ),
};

/**
 * Visual test: Full page layout simulation
 */
export const FullPageLayoutAllThemes: Story = {
  render: () => (
    <div className="flex flex-col">
      {themes.map((theme) => (
        <ThemeProvider key={theme} defaultTheme={theme}>
          <Background className="min-h-[500px] p-8">
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="text-xs font-bold uppercase tracking-wider text-white/50">
                Theme: {theme}
              </div>
              <div className="rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 p-6">
                <h1 className="text-xl font-bold text-white/90 mb-2">Page Title</h1>
                <p className="text-white/60">
                  This is a sample page layout to verify background appearance
                  with content overlay.
                </p>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="rounded-lg bg-white/10 backdrop-blur-sm p-4 text-white/50 text-sm">
                  Card 1
                </div>
                <div className="rounded-lg bg-white/10 backdrop-blur-sm p-4 text-white/50 text-sm">
                  Card 2
                </div>
                <div className="rounded-lg bg-white/10 backdrop-blur-sm p-4 text-white/50 text-sm">
                  Card 3
                </div>
              </div>
            </div>
          </Background>
        </ThemeProvider>
      ))}
    </div>
  ),
};
