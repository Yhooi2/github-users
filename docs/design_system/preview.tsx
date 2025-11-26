/* eslint-disable react-refresh/only-export-components */
import type { Preview, StoryContext } from "@storybook/react";
import React from "react";
import { Background, ThemeProvider, ThemeToggle } from "../src/components";
import "../src/styles/globals.css";
import type { ThemeName } from "../src/types";

// Theme wrapper decorator for all stories
const ThemeDecorator = (Story: React.ComponentType, context: StoryContext) => {
  const selectedTheme = context.globals.theme as ThemeName;

  return (
    <ThemeProvider defaultTheme={selectedTheme}>
      <Background>
        <div className="min-h-screen p-8">
          <div className="absolute top-4 right-4 z-50">
            <ThemeToggle showLabel />
          </div>
          <Story />
        </div>
      </Background>
    </ThemeProvider>
  );
};

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      disable: true,
    },
    layout: "fullscreen",
    docs: {
      toc: true,
    },
  },
  globalTypes: {
    theme: {
      name: "Theme",
      description: "Global theme for components",
      defaultValue: "glass",
      toolbar: {
        icon: "paintbrush",
        items: [
          { value: "light", title: "☀️ Light" },
          { value: "aurora", title: "🌙 Aurora" },
          { value: "glass", title: "💎 Glass" },
        ],
        showName: true,
        dynamicTitle: true,
      },
    },
  },
  decorators: [ThemeDecorator],
};

export default preview;
