import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { GlassBadge } from "../../GlassBadge";
import { ThemeProvider } from "../../../context/ThemeContext";
import { Background } from "../../Background";
import type { ThemeName as Theme } from "../../../types";

const meta: Meta<typeof GlassBadge> = {
  title: "Design System/Visual Tests/GlassBadge",
  component: GlassBadge,
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
 * Visual test: All variants in all themes
 * Critical for verifying badge backgrounds, borders, text colors
 */
export const AllVariantsAllThemes: Story = {
  render: () => (
    <div className="flex flex-col">
      {themes.map((theme) => (
        <ThemeProvider key={theme} defaultTheme={theme}>
          <Background className="p-6">
            <div className="mb-3 text-xs font-bold uppercase tracking-wider text-white/50">
              Theme: {theme}
            </div>
            <div className="flex gap-3">
              <GlassBadge variant="default">Default</GlassBadge>
              <GlassBadge variant="success">Success</GlassBadge>
              <GlassBadge variant="warning">Warning</GlassBadge>
              <GlassBadge variant="danger">Danger</GlassBadge>
              <GlassBadge variant="primary">Primary</GlassBadge>
              <GlassBadge variant="violet">Violet</GlassBadge>
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
            <div className="flex items-center gap-3">
              <GlassBadge size="sm">Small</GlassBadge>
              <GlassBadge size="md">Medium</GlassBadge>
              <GlassBadge size="lg">Large</GlassBadge>
            </div>
          </Background>
        </ThemeProvider>
      ))}
    </div>
  ),
};

/**
 * Visual test: With emoji content
 * Critical for verifying emoji rendering with badges
 */
export const WithEmojiAllThemes: Story = {
  render: () => (
    <div className="flex flex-col">
      {themes.map((theme) => (
        <ThemeProvider key={theme} defaultTheme={theme}>
          <Background className="p-6">
            <div className="mb-3 text-xs font-bold uppercase tracking-wider text-white/50">
              Theme: {theme}
            </div>
            <div className="flex gap-3">
              <GlassBadge variant="success">✓ Passed</GlassBadge>
              <GlassBadge variant="warning">⚠ Warning</GlassBadge>
              <GlassBadge variant="danger">✕ Failed</GlassBadge>
              <GlassBadge variant="violet">🔥 Peak</GlassBadge>
              <GlassBadge variant="primary">⭐ Featured</GlassBadge>
            </div>
          </Background>
        </ThemeProvider>
      ))}
    </div>
  ),
};

/**
 * Visual test: Complete matrix (all variants × all sizes) in glass theme
 */
export const CompleteMatrixGlassTheme: Story = {
  render: () => (
    <ThemeProvider defaultTheme="glass">
      <Background className="p-6">
        <div className="space-y-6">
          {(["sm", "md", "lg"] as const).map((size) => (
            <div key={size}>
              <div className="mb-2 text-xs font-bold uppercase tracking-wider text-white/50">
                Size: {size}
              </div>
              <div className="flex gap-3">
                <GlassBadge variant="default" size={size}>Default</GlassBadge>
                <GlassBadge variant="success" size={size}>Success</GlassBadge>
                <GlassBadge variant="warning" size={size}>Warning</GlassBadge>
                <GlassBadge variant="danger" size={size}>Danger</GlassBadge>
                <GlassBadge variant="primary" size={size}>Primary</GlassBadge>
                <GlassBadge variant="violet" size={size}>Violet</GlassBadge>
              </div>
            </div>
          ))}
        </div>
      </Background>
    </ThemeProvider>
  ),
};
