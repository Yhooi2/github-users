import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Github, Menu as MenuIcon, Settings as SettingsIcon, Bell, Search, Plus } from "lucide-react";
import { IconButton } from "../IconButton";
import { ThemeProvider } from "../../context/ThemeContext";
import { Background } from "../Background";

const meta: Meta<typeof IconButton> = {
  title: "Design System/Desktop/IconButton",
  component: IconButton,
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
          "A glassmorphism icon button with gradient background. Used for primary actions like logo/menu buttons.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    title: {
      control: "text",
      description: "Button title/tooltip",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const GitHub: Story = {
  args: {
    icon: Github,
    title: "GitHub",
    onClick: () => alert("GitHub clicked"),
  },
};

export const MenuButton: Story = {
  args: {
    icon: MenuIcon,
    title: "Menu",
    onClick: () => alert("Menu clicked"),
  },
};

export const SettingsButton: Story = {
  args: {
    icon: SettingsIcon,
    title: "Settings",
    onClick: () => alert("Settings clicked"),
  },
};

export const Notifications: Story = {
  args: {
    icon: Bell,
    title: "Notifications",
    onClick: () => alert("Notifications clicked"),
  },
};

export const AllIcons: Story = {
  render: () => (
    <div className="flex gap-3">
      <IconButton icon={Github} title="GitHub" onClick={() => {}} />
      <IconButton icon={MenuIcon} title="Menu" onClick={() => {}} />
      <IconButton icon={SettingsIcon} title="Settings" onClick={() => {}} />
      <IconButton icon={Bell} title="Notifications" onClick={() => {}} />
      <IconButton icon={Search} title="Search" onClick={() => {}} />
      <IconButton icon={Plus} title="Add" onClick={() => {}} />
    </div>
  ),
};

export const InHeader: Story = {
  render: () => (
    <div
      className="flex items-center gap-4 p-4 rounded-xl"
      style={{
        background: "rgba(255,255,255,0.05)",
        backdropFilter: "blur(12px)",
      }}
    >
      <IconButton icon={Github} title="GitHub" onClick={() => {}} />
      <span className="text-white font-semibold text-lg">User Analytics</span>
    </div>
  ),
};
