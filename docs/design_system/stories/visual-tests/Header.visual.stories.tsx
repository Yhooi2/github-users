import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Header } from "../../Header";
import { ThemeProvider } from "../../../context/ThemeContext";
import { Background } from "../../Background";
import type { ThemeName as Theme } from "../../../types";

const meta: Meta<typeof Header> = {
  title: "Design System/Visual Tests/Header",
  component: Header,
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
 * Visual test: Header in all themes
 * Critical for verifying header backgrounds, borders, blur effects
 */
export const HeaderAllThemes: Story = {
  render: () => (
    <div className="flex flex-col">
      {themes.map((theme) => (
        <ThemeProvider key={theme} defaultTheme={theme}>
          <Background className="min-h-[200px]">
            <div className="text-xs font-bold uppercase tracking-wider text-white/50 p-4">
              Theme: {theme}
            </div>
            <Header>
              <div className="flex items-center justify-between w-full">
                <span className="font-semibold">GitHub Analytics</span>
                <span className="text-sm opacity-70">Header Content</span>
              </div>
            </Header>
          </Background>
        </ThemeProvider>
      ))}
    </div>
  ),
};

/**
 * Visual test: Header with navigation
 */
export const HeaderWithNavigationAllThemes: Story = {
  render: () => (
    <div className="flex flex-col">
      {themes.map((theme) => (
        <ThemeProvider key={theme} defaultTheme={theme}>
          <Background className="min-h-[200px]">
            <Header>
              <div className="flex items-center justify-between w-full">
                <span className="font-semibold">GitHub Analytics</span>
                <nav className="flex gap-4 text-sm">
                  <span className="opacity-100 font-medium">Overview</span>
                  <span className="opacity-60 hover:opacity-100 cursor-pointer">Repos</span>
                  <span className="opacity-60 hover:opacity-100 cursor-pointer">Activity</span>
                  <span className="opacity-60 hover:opacity-100 cursor-pointer">Settings</span>
                </nav>
              </div>
            </Header>
            <div className="p-4 text-xs text-white/50">
              Theme: {theme}
            </div>
          </Background>
        </ThemeProvider>
      ))}
    </div>
  ),
};

/**
 * Visual test: Header blur effect with content behind
 */
export const HeaderBlurEffectGlassTheme: Story = {
  render: () => (
    <ThemeProvider defaultTheme="glass">
      <Background className="min-h-[400px]">
        <Header className="sticky top-0 z-10">
          <div className="flex items-center justify-between w-full">
            <span className="font-semibold">GitHub Analytics</span>
            <span className="text-sm opacity-70">Sticky Header</span>
          </div>
        </Header>
        <div className="p-4 space-y-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="rounded-lg bg-white/10 backdrop-blur-sm p-4 text-white/50"
            >
              Content block {i + 1} - scroll to see blur effect
            </div>
          ))}
        </div>
      </Background>
    </ThemeProvider>
  ),
};
