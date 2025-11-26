import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Search, Mail, User, Lock } from "lucide-react";
import { GlassInput } from "../../GlassInput";
import { ThemeProvider } from "../../../context/ThemeContext";
import { Background } from "../../Background";
import type { ThemeName as Theme } from "../../../types";

const meta: Meta<typeof GlassInput> = {
  title: "Design System/Visual Tests/GlassInput",
  component: GlassInput,
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
 * Visual test: All states in all themes
 * Critical for verifying input backgrounds, borders, text colors
 */
export const AllStatesAllThemes: Story = {
  render: () => (
    <div className="flex flex-col">
      {themes.map((theme) => (
        <ThemeProvider key={theme} defaultTheme={theme}>
          <Background className="p-6">
            <div className="mb-3 text-xs font-bold uppercase tracking-wider text-white/50">
              Theme: {theme}
            </div>
            <div className="w-80 space-y-3">
              <GlassInput placeholder="Empty input" />
              <GlassInput placeholder="With value" value="Some text" />
              <GlassInput placeholder="Disabled" disabled />
            </div>
          </Background>
        </ThemeProvider>
      ))}
    </div>
  ),
};

/**
 * Visual test: Different icons in all themes
 */
export const WithDifferentIconsAllThemes: Story = {
  render: () => (
    <div className="flex flex-col">
      {themes.map((theme) => (
        <ThemeProvider key={theme} defaultTheme={theme}>
          <Background className="p-6">
            <div className="mb-3 text-xs font-bold uppercase tracking-wider text-white/50">
              Theme: {theme}
            </div>
            <div className="w-80 space-y-3">
              <GlassInput icon={Search} placeholder="Search..." />
              <GlassInput icon={Mail} placeholder="Email address" />
              <GlassInput icon={User} placeholder="Username" />
              <GlassInput icon={Lock} placeholder="Password" />
            </div>
          </Background>
        </ThemeProvider>
      ))}
    </div>
  ),
};
