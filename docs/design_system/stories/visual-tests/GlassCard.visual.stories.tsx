import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { GlassCard } from "../../GlassCard";
import { ThemeProvider } from "../../../context/ThemeContext";
import { Background } from "../../Background";
import type { ThemeName as Theme } from "../../../types";

const meta: Meta<typeof GlassCard> = {
  title: "Design System/Visual Tests/GlassCard",
  component: GlassCard,
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
 * Visual test: All intensities in all themes
 * Critical for verifying glass blur, background and border colors
 */
export const AllIntensitiesAllThemes: Story = {
  render: () => (
    <div className="flex flex-col">
      {themes.map((theme) => (
        <ThemeProvider key={theme} defaultTheme={theme}>
          <Background className="p-6">
            <div className="mb-3 text-xs font-bold uppercase tracking-wider text-white/50">
              Theme: {theme}
            </div>
            <div className="flex gap-4">
              <GlassCard intensity="subtle" className="w-48 p-4">
                <div className="text-sm font-medium">Subtle Intensity</div>
                <div className="text-xs opacity-70">Glass effect test</div>
              </GlassCard>
              <GlassCard intensity="medium" className="w-48 p-4">
                <div className="text-sm font-medium">Medium Intensity</div>
                <div className="text-xs opacity-70">Glass effect test</div>
              </GlassCard>
              <GlassCard intensity="strong" className="w-48 p-4">
                <div className="text-sm font-medium">Strong Intensity</div>
                <div className="text-xs opacity-70">Glass effect test</div>
              </GlassCard>
            </div>
          </Background>
        </ThemeProvider>
      ))}
    </div>
  ),
};

/**
 * Visual test: All glow colors in all themes
 * Critical for verifying glow effects: blue, violet, cyan
 */
export const AllGlowColorsAllThemes: Story = {
  render: () => (
    <div className="flex flex-col">
      {themes.map((theme) => (
        <ThemeProvider key={theme} defaultTheme={theme}>
          <Background className="p-6">
            <div className="mb-3 text-xs font-bold uppercase tracking-wider text-white/50">
              Theme: {theme}
            </div>
            <div className="flex gap-4">
              <GlassCard glow="blue" className="w-40 p-4">
                <div className="text-sm font-medium">Blue Glow</div>
              </GlassCard>
              <GlassCard glow="violet" className="w-40 p-4">
                <div className="text-sm font-medium">Violet Glow</div>
              </GlassCard>
              <GlassCard glow="purple" className="w-40 p-4">
                <div className="text-sm font-medium">Purple Glow</div>
              </GlassCard>
              <GlassCard glow="cyan" className="w-40 p-4">
                <div className="text-sm font-medium">Cyan Glow</div>
              </GlassCard>
            </div>
          </Background>
        </ThemeProvider>
      ))}
    </div>
  ),
};

/**
 * Visual test: Hover state simulation
 * Tests hover background color changes
 */
export const HoverStateAllThemes: Story = {
  render: () => (
    <div className="flex flex-col">
      {themes.map((theme) => (
        <ThemeProvider key={theme} defaultTheme={theme}>
          <Background className="p-6">
            <div className="mb-3 text-xs font-bold uppercase tracking-wider text-white/50">
              Theme: {theme}
            </div>
            <div className="flex gap-4">
              <GlassCard className="w-48 p-4">
                <div className="text-sm font-medium">Normal State</div>
              </GlassCard>
              <GlassCard hover className="w-48 p-4">
                <div className="text-sm font-medium">Hover State</div>
              </GlassCard>
            </div>
          </Background>
        </ThemeProvider>
      ))}
    </div>
  ),
};

/**
 * Visual test: Combined intensity + glow in glass theme
 * Most critical visual combination
 */
export const IntensityWithGlowGlassTheme: Story = {
  render: () => (
    <ThemeProvider defaultTheme="glass">
      <Background className="p-6">
        <div className="grid grid-cols-4 gap-4">
          {(["subtle", "medium", "strong"] as const).map((intensity) => (
            <React.Fragment key={intensity}>
              <div className="col-span-4 text-xs font-bold uppercase tracking-wider text-white/50 mt-4 first:mt-0">
                Intensity: {intensity}
              </div>
              <GlassCard intensity={intensity} glow="blue" className="p-4">
                <div className="text-sm">Blue Glow</div>
              </GlassCard>
              <GlassCard intensity={intensity} glow="violet" className="p-4">
                <div className="text-sm">Violet Glow</div>
              </GlassCard>
              <GlassCard intensity={intensity} glow="purple" className="p-4">
                <div className="text-sm">Purple Glow</div>
              </GlassCard>
              <GlassCard intensity={intensity} glow="cyan" className="p-4">
                <div className="text-sm">Cyan Glow</div>
              </GlassCard>
            </React.Fragment>
          ))}
        </div>
      </Background>
    </ThemeProvider>
  ),
};
