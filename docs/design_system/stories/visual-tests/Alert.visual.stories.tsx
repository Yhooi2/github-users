import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Bell, CheckCircle, XCircle } from "lucide-react";
import { Alert } from "../../Alert";
import { ThemeProvider } from "../../../context/ThemeContext";
import { Background } from "../../Background";
import type { ThemeName as Theme } from "../../../types";

const meta: Meta<typeof Alert> = {
  title: "Design System/Visual Tests/Alert",
  component: Alert,
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
 * Critical for verifying alert backgrounds, borders, text colors, icons
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
            <div className="w-96 space-y-3">
              <Alert variant="danger">Critical error detected</Alert>
              <Alert variant="warning">Please check your settings</Alert>
              <Alert variant="info">New update available</Alert>
            </div>
          </Background>
        </ThemeProvider>
      ))}
    </div>
  ),
};

/**
 * Visual test: With title and description in all themes
 */
export const WithTitleAndDescriptionAllThemes: Story = {
  render: () => (
    <div className="flex flex-col">
      {themes.map((theme) => (
        <ThemeProvider key={theme} defaultTheme={theme}>
          <Background className="p-6">
            <div className="mb-3 text-xs font-bold uppercase tracking-wider text-white/50">
              Theme: {theme}
            </div>
            <div className="w-96 space-y-3">
              <Alert variant="danger" title="Security Alert">
                Unauthorized access attempt detected from IP 192.168.1.1
              </Alert>
              <Alert variant="warning" title="Performance Warning">
                Database queries are taking longer than expected
              </Alert>
              <Alert variant="info" title="System Update">
                A new version will be deployed at midnight
              </Alert>
            </div>
          </Background>
        </ThemeProvider>
      ))}
    </div>
  ),
};

/**
 * Visual test: With custom icons in all themes
 */
export const WithCustomIconsAllThemes: Story = {
  render: () => (
    <div className="flex flex-col">
      {themes.map((theme) => (
        <ThemeProvider key={theme} defaultTheme={theme}>
          <Background className="p-6">
            <div className="mb-3 text-xs font-bold uppercase tracking-wider text-white/50">
              Theme: {theme}
            </div>
            <div className="w-96 space-y-3">
              <Alert variant="danger" icon={XCircle}>
                Operation failed
              </Alert>
              <Alert variant="warning" icon={Bell}>
                Action required
              </Alert>
              <Alert variant="info" icon={CheckCircle}>
                Task completed successfully
              </Alert>
            </div>
          </Background>
        </ThemeProvider>
      ))}
    </div>
  ),
};

/**
 * Visual test: Status dot glow in glass theme
 */
export const StatusDotGlowGlassTheme: Story = {
  render: () => (
    <ThemeProvider defaultTheme="glass">
      <Background className="p-6">
        <div className="text-xs text-white/50 mb-4">Alert status dots with glow effects</div>
        <div className="w-96 space-y-3">
          <Alert variant="danger" title="Danger">
            Red status dot with glow
          </Alert>
          <Alert variant="warning" title="Warning">
            Yellow status dot with glow
          </Alert>
          <Alert variant="info" title="Info">
            Blue status dot with glow
          </Alert>
        </div>
      </Background>
    </ThemeProvider>
  ),
};
