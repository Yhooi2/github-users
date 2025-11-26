import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Github, Sparkles, Zap, ArrowRight } from "lucide-react";
import { GlassButton } from "../../GlassButton";
import { ThemeProvider } from "../../../context/ThemeContext";
import { Background } from "../../Background";
import type { ThemeName as Theme } from "../../../types";

const meta: Meta<typeof GlassButton> = {
  title: "Design System/Visual Tests/GlassButton",
  component: GlassButton,
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
 * Critical for verifying button backgrounds, borders, text colors
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
            <div className="flex gap-4">
              <GlassButton variant="primary">Primary</GlassButton>
              <GlassButton variant="secondary">Secondary</GlassButton>
              <GlassButton variant="ghost">Ghost</GlassButton>
            </div>
          </Background>
        </ThemeProvider>
      ))}
    </div>
  ),
};

/**
 * Visual test: All sizes in all themes
 * Critical for verifying padding, font-sizes, heights
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
              <GlassButton size="sm">Small</GlassButton>
              <GlassButton size="md">Medium</GlassButton>
              <GlassButton size="lg">Large</GlassButton>
            </div>
          </Background>
        </ThemeProvider>
      ))}
    </div>
  ),
};

/**
 * Visual test: Disabled state in all themes
 * Critical for verifying opacity, cursor changes
 */
export const DisabledStateAllThemes: Story = {
  render: () => (
    <div className="flex flex-col">
      {themes.map((theme) => (
        <ThemeProvider key={theme} defaultTheme={theme}>
          <Background className="p-6">
            <div className="mb-3 text-xs font-bold uppercase tracking-wider text-white/50">
              Theme: {theme}
            </div>
            <div className="flex gap-4">
              <GlassButton variant="primary" disabled>
                Primary Disabled
              </GlassButton>
              <GlassButton variant="secondary" disabled>
                Secondary Disabled
              </GlassButton>
              <GlassButton variant="ghost" disabled>
                Ghost Disabled
              </GlassButton>
            </div>
          </Background>
        </ThemeProvider>
      ))}
    </div>
  ),
};

/**
 * Visual test: Loading state in all themes
 * Critical for verifying spinner, opacity
 */
export const LoadingStateAllThemes: Story = {
  render: () => (
    <div className="flex flex-col">
      {themes.map((theme) => (
        <ThemeProvider key={theme} defaultTheme={theme}>
          <Background className="p-6">
            <div className="mb-3 text-xs font-bold uppercase tracking-wider text-white/50">
              Theme: {theme}
            </div>
            <div className="flex gap-4">
              <GlassButton variant="primary" loading>
                Loading
              </GlassButton>
              <GlassButton variant="secondary" loading>
                Loading
              </GlassButton>
              <GlassButton variant="ghost" loading>
                Loading
              </GlassButton>
            </div>
          </Background>
        </ThemeProvider>
      ))}
    </div>
  ),
};

/**
 * Visual test: With icons in all themes
 * Critical for verifying icon colors, spacing, alignment
 */
export const WithIconsAllThemes: Story = {
  render: () => (
    <div className="flex flex-col">
      {themes.map((theme) => (
        <ThemeProvider key={theme} defaultTheme={theme}>
          <Background className="p-6">
            <div className="mb-3 text-xs font-bold uppercase tracking-wider text-white/50">
              Theme: {theme}
            </div>
            <div className="flex gap-4">
              <GlassButton variant="primary" icon={Zap}>
                Generate
              </GlassButton>
              <GlassButton variant="secondary" icon={Github}>
                GitHub
              </GlassButton>
              <GlassButton variant="ghost" icon={Sparkles}>
                AI Analysis
              </GlassButton>
              <GlassButton variant="primary" icon={ArrowRight} iconPosition="right">
                Continue
              </GlassButton>
            </div>
          </Background>
        </ThemeProvider>
      ))}
    </div>
  ),
};

/**
 * Visual test: Full width in all themes
 */
export const FullWidthAllThemes: Story = {
  render: () => (
    <div className="flex flex-col">
      {themes.map((theme) => (
        <ThemeProvider key={theme} defaultTheme={theme}>
          <Background className="p-6">
            <div className="mb-3 text-xs font-bold uppercase tracking-wider text-white/50">
              Theme: {theme}
            </div>
            <div className="w-96 space-y-2">
              <GlassButton variant="primary" fullWidth icon={Sparkles}>
                Full Width Primary
              </GlassButton>
              <GlassButton variant="secondary" fullWidth>
                Full Width Secondary
              </GlassButton>
              <GlassButton variant="ghost" fullWidth>
                Full Width Ghost
              </GlassButton>
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
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-3 text-xs font-bold uppercase tracking-wider text-white/50">
            Small Size
          </div>
          <GlassButton variant="primary" size="sm">Primary SM</GlassButton>
          <GlassButton variant="secondary" size="sm">Secondary SM</GlassButton>
          <GlassButton variant="ghost" size="sm">Ghost SM</GlassButton>

          <div className="col-span-3 text-xs font-bold uppercase tracking-wider text-white/50 mt-4">
            Medium Size
          </div>
          <GlassButton variant="primary" size="md">Primary MD</GlassButton>
          <GlassButton variant="secondary" size="md">Secondary MD</GlassButton>
          <GlassButton variant="ghost" size="md">Ghost MD</GlassButton>

          <div className="col-span-3 text-xs font-bold uppercase tracking-wider text-white/50 mt-4">
            Large Size
          </div>
          <GlassButton variant="primary" size="lg">Primary LG</GlassButton>
          <GlassButton variant="secondary" size="lg">Secondary LG</GlassButton>
          <GlassButton variant="ghost" size="lg">Ghost LG</GlassButton>
        </div>
      </Background>
    </ThemeProvider>
  ),
};
