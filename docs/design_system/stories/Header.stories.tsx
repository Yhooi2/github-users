import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Github, Search, Bell, Settings } from "lucide-react";
import { Header } from "../Header";
import { ThemeProvider } from "../../context/ThemeContext";
import { Background } from "../Background";
import { IconButton } from "../IconButton";
import { SearchBar } from "../SearchBar";
import { GlassButton } from "../GlassButton";
import { ThemeToggle } from "../ThemeToggle";

const meta: Meta<typeof Header> = {
  title: "Design System/Layout/Header",
  component: Header,
  decorators: [
    (Story) => (
      <ThemeProvider defaultTheme="glass">
        <Background>
          <div className="p-4">
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
          "A glassmorphism header component with sticky positioning and blur effect.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    title: {
      control: "text",
      description: "Header title",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "User Analytics",
    icon: Github,
  },
};

export const WithLeftContent: Story = {
  args: {
    title: "User Analytics",
    icon: Github,
    leftContent: <SearchBar value="Yhooi2" readOnly />,
  },
};

export const WithRightContent: Story = {
  args: {
    title: "User Analytics",
    icon: Github,
    rightContent: (
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <GlassButton variant="secondary" icon={Github} size="sm">
          Sign in
        </GlassButton>
      </div>
    ),
  },
};

export const FullHeader: Story = {
  args: {
    title: "User Analytics",
    icon: Github,
    leftContent: <SearchBar value="Yhooi2" readOnly />,
    rightContent: (
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <GlassButton variant="secondary" icon={Github} size="sm">
          Sign in with GitHub
        </GlassButton>
      </div>
    ),
  },
};

export const MinimalHeader: Story = {
  args: {
    title: "GitHub Analytics",
  },
};

export const WithActions: Story = {
  render: () => (
    <Header
      title="Dashboard"
      icon={Github}
      rightContent={
        <div className="flex items-center gap-3">
          <IconButton icon={Search} title="Search" onClick={() => {}} />
          <IconButton icon={Bell} title="Notifications" onClick={() => {}} />
          <IconButton icon={Settings} title="Settings" onClick={() => {}} />
        </div>
      }
    />
  ),
};

export const StickyDemo: Story = {
  render: () => (
    <div className="h-[200vh]">
      <Header
        title="User Analytics"
        icon={Github}
        leftContent={<SearchBar value="Yhooi2" readOnly />}
        rightContent={
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <GlassButton variant="secondary" icon={Github} size="sm">
              Sign in
            </GlassButton>
          </div>
        }
      />
      <div className="p-8 space-y-4">
        <p className="text-white/70">Scroll down to see sticky header behavior...</p>
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="p-4 rounded-xl"
            style={{ background: "rgba(255,255,255,0.05)" }}
          >
            <p className="text-white">Content block {i + 1}</p>
          </div>
        ))}
      </div>
    </div>
  ),
};
