import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { GlassProgress } from "../../GlassProgress";
import { ThemeProvider } from "../../../context/ThemeContext";
import { Background } from "../../Background";
import type { ThemeName as Theme } from "../../../types";

const meta: Meta<typeof GlassProgress> = {
  title: "Design System/Visual Tests/GlassProgress",
  component: GlassProgress,
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
 * Visual test: Different values in all themes
 * Critical for verifying gradient fills, track backgrounds
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
            <div className="w-80 space-y-3">
              <GlassProgress value={0} />
              <GlassProgress value={25} />
              <GlassProgress value={50} />
              <GlassProgress value={75} />
              <GlassProgress value={100} />
            </div>
          </Background>
        </ThemeProvider>
      ))}
    </div>
  ),
};

/**
 * Visual test: Different gradients in all themes
 * Critical for verifying gradient colors
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
            <div className="w-80 space-y-3">
              <div>
                <div className="text-xs text-white/50 mb-1">Blue to Violet (default)</div>
                <GlassProgress value={75} gradient="from-blue-500 to-violet-500" />
              </div>
              <div>
                <div className="text-xs text-white/50 mb-1">Emerald to Cyan</div>
                <GlassProgress value={75} gradient="from-emerald-400 to-cyan-400" />
              </div>
              <div>
                <div className="text-xs text-white/50 mb-1">Amber to Orange</div>
                <GlassProgress value={75} gradient="from-amber-400 to-orange-400" />
              </div>
              <div>
                <div className="text-xs text-white/50 mb-1">Rose to Pink</div>
                <GlassProgress value={75} gradient="from-rose-400 to-pink-400" />
              </div>
            </div>
          </Background>
        </ThemeProvider>
      ))}
    </div>
  ),
};

/**
 * Visual test: Different heights in all themes
 */
export const DifferentHeightsAllThemes: Story = {
  render: () => (
    <div className="flex flex-col">
      {themes.map((theme) => (
        <ThemeProvider key={theme} defaultTheme={theme}>
          <Background className="p-6">
            <div className="mb-3 text-xs font-bold uppercase tracking-wider text-white/50">
              Theme: {theme}
            </div>
            <div className="w-80 space-y-4">
              <div>
                <div className="text-xs text-white/50 mb-1">Height: h-1</div>
                <GlassProgress value={65} height="h-1" />
              </div>
              <div>
                <div className="text-xs text-white/50 mb-1">Height: h-2 (default)</div>
                <GlassProgress value={65} height="h-2" />
              </div>
              <div>
                <div className="text-xs text-white/50 mb-1">Height: h-3</div>
                <GlassProgress value={65} height="h-3" />
              </div>
              <div>
                <div className="text-xs text-white/50 mb-1">Height: h-4</div>
                <GlassProgress value={65} height="h-4" />
              </div>
            </div>
          </Background>
        </ThemeProvider>
      ))}
    </div>
  ),
};

/**
 * Visual test: With and without glow in glass theme
 */
export const GlowEffectGlassTheme: Story = {
  render: () => (
    <ThemeProvider defaultTheme="glass">
      <Background className="p-6">
        <div className="w-80 space-y-6">
          <div>
            <div className="text-xs text-white/50 mb-2">With Glow (default)</div>
            <GlassProgress value={75} showGlow={true} />
          </div>
          <div>
            <div className="text-xs text-white/50 mb-2">Without Glow</div>
            <GlassProgress value={75} showGlow={false} />
          </div>
        </div>
      </Background>
    </ThemeProvider>
  ),
};
