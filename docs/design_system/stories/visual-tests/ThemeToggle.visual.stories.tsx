import type { Meta, StoryObj } from "@storybook/react";
import { ThemeProvider } from "../../../context/ThemeContext";
import type { ThemeName as Theme } from "../../../types";
import { Background } from "../../Background";
import { ThemeToggle } from "../../ThemeToggle";

const meta: Meta<typeof ThemeToggle> = {
  title: "Design System/Visual Tests/ThemeToggle",
  component: ThemeToggle,
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
 * Visual test: Theme toggle in all themes
 * Critical for verifying button styling, icon visibility
 */
export const ThemeToggleAllThemes: Story = {
  render: () => (
    <div className="flex flex-col">
      {themes.map((theme) => (
        <ThemeProvider key={theme} defaultTheme={theme}>
          <Background className="p-6">
            <div className="mb-3 text-xs font-bold tracking-wider text-white/50 uppercase">
              Theme: {theme}
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <span className="text-sm text-white/50">
                Click to cycle themes
              </span>
            </div>
          </Background>
        </ThemeProvider>
      ))}
    </div>
  ),
};

/**
 * Visual test: Theme toggle in header context
 */
export const ThemeToggleInHeaderAllThemes: Story = {
  render: () => (
    <div className="flex flex-col">
      {themes.map((theme) => (
        <ThemeProvider key={theme} defaultTheme={theme}>
          <Background className="min-h-[150px]">
            <div
              className="flex items-center justify-between border-b p-4 backdrop-blur-md"
              style={{
                background: "rgba(0,0,0,0.2)",
                borderColor: "rgba(255,255,255,0.1)",
              }}
            >
              <span className="font-semibold text-white/90">
                GitHub Analytics
              </span>
              <ThemeToggle />
            </div>
            <div className="p-4 text-xs text-white/50">Theme: {theme}</div>
          </Background>
        </ThemeProvider>
      ))}
    </div>
  ),
};

/**
 * Visual test: Theme toggle icon appearance
 */
export const ThemeToggleIconsAllThemes: Story = {
  render: () => (
    <div className="flex flex-col">
      {themes.map((theme) => (
        <ThemeProvider key={theme} defaultTheme={theme}>
          <Background className="p-6">
            <div className="mb-3 text-xs font-bold tracking-wider text-white/50 uppercase">
              Theme: {theme} - Verify icon matches theme
            </div>
            <div className="flex items-center gap-6">
              <ThemeToggle />
              <div className="text-sm text-white/70">
                {theme === "light" && "☀️ Sun icon for light mode"}
                {theme === "aurora" && "🌙 Moon icon for dark mode"}
                {theme === "glass" && "✨ Sparkles icon for glass mode"}
              </div>
            </div>
          </Background>
        </ThemeProvider>
      ))}
    </div>
  ),
};
