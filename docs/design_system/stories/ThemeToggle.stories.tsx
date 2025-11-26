import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { ThemeToggle } from "../ThemeToggle";
import { ThemeProvider, useTheme } from "../../context/ThemeContext";
import { Background } from "../Background";

const meta: Meta<typeof ThemeToggle> = {
  title: "Design System/Theme/ThemeToggle",
  component: ThemeToggle,
  decorators: [
    (Story) => (
      <ThemeProvider defaultTheme="glass">
        <Background>
          <div className="p-8">
            <Story />
          </div>
        </Background>
      </ThemeProvider>
    ),
  ],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "A theme toggle button that cycles through light, aurora, and glass themes.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    showLabel: {
      control: "boolean",
      description: "Show theme label",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const WithLabel: Story = {
  args: {
    showLabel: true,
  },
};

export const InContext: Story = {
  render: () => {
    const ThemeDisplay = () => {
      const { theme } = useTheme();
      return (
        <div className="flex items-center gap-4">
          <ThemeToggle showLabel />
          <span className="text-white">Current theme: {theme}</span>
        </div>
      );
    };
    return <ThemeDisplay />;
  },
};

export const InHeader: Story = {
  render: () => (
    <div
      className="flex items-center justify-between p-4 rounded-xl"
      style={{
        background: "rgba(255,255,255,0.05)",
        backdropFilter: "blur(12px)",
      }}
    >
      <span className="text-white font-semibold">User Analytics</span>
      <div className="flex items-center gap-3">
        <ThemeToggle />
        <button className="px-3 py-1.5 text-sm bg-violet-600 text-white rounded-lg">
          Sign in
        </button>
      </div>
    </div>
  ),
};

export const AllThemes: Story = {
  render: () => (
    <div className="grid grid-cols-3 gap-4">
      <ThemeProvider defaultTheme="light">
        <Background>
          <div className="p-4 text-center">
            <ThemeToggle showLabel />
            <p className="text-slate-700 mt-2 text-sm">Light Theme</p>
          </div>
        </Background>
      </ThemeProvider>
      <ThemeProvider defaultTheme="aurora">
        <Background>
          <div className="p-4 text-center">
            <ThemeToggle showLabel />
            <p className="text-white/70 mt-2 text-sm">Aurora Theme</p>
          </div>
        </Background>
      </ThemeProvider>
      <ThemeProvider defaultTheme="glass">
        <Background>
          <div className="p-4 text-center">
            <ThemeToggle showLabel />
            <p className="text-white/70 mt-2 text-sm">Glass Theme</p>
          </div>
        </Background>
      </ThemeProvider>
    </div>
  ),
  parameters: {
    layout: "padded",
  },
};
