import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Avatar } from "../Avatar";
import { ThemeProvider } from "../../context/ThemeContext";
import { Background } from "../Background";

const meta: Meta<typeof Avatar> = {
  title: "Design System/Display/Avatar",
  component: Avatar,
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
          "A glassmorphism avatar component displaying user initials with gradient background and optional online indicator.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    initials: {
      control: "text",
      description: "User initials (1-2 characters)",
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg", "xl"],
      description: "Avatar size",
    },
    online: {
      control: "boolean",
      description: "Show online indicator",
    },
    gradient: {
      control: "text",
      description: "Custom gradient class",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    initials: "AS",
    size: "md",
  },
};

export const Small: Story = {
  args: {
    initials: "JD",
    size: "sm",
  },
};

export const Large: Story = {
  args: {
    initials: "AS",
    size: "lg",
  },
};

export const ExtraLarge: Story = {
  args: {
    initials: "AS",
    size: "xl",
  },
};

export const WithOnlineIndicator: Story = {
  args: {
    initials: "AS",
    size: "lg",
    online: true,
  },
};

export const CustomGradient: Story = {
  args: {
    initials: "MK",
    size: "lg",
    gradient: "from-emerald-400 via-cyan-500 to-blue-500",
  },
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-end gap-4">
      <div className="text-center">
        <Avatar initials="AS" size="sm" />
        <p className="text-white/70 text-xs mt-2">Small</p>
      </div>
      <div className="text-center">
        <Avatar initials="AS" size="md" />
        <p className="text-white/70 text-xs mt-2">Medium</p>
      </div>
      <div className="text-center">
        <Avatar initials="AS" size="lg" />
        <p className="text-white/70 text-xs mt-2">Large</p>
      </div>
      <div className="text-center">
        <Avatar initials="AS" size="xl" />
        <p className="text-white/70 text-xs mt-2">XL</p>
      </div>
    </div>
  ),
};

export const DifferentGradients: Story = {
  render: () => (
    <div className="flex gap-4">
      <Avatar initials="AS" size="lg" />
      <Avatar
        initials="JD"
        size="lg"
        gradient="from-emerald-400 via-cyan-500 to-blue-500"
      />
      <Avatar
        initials="MK"
        size="lg"
        gradient="from-pink-400 via-rose-500 to-red-500"
      />
      <Avatar
        initials="LP"
        size="lg"
        gradient="from-amber-400 via-orange-500 to-red-500"
      />
    </div>
  ),
};

export const OnlineStatuses: Story = {
  render: () => (
    <div className="flex gap-4">
      <div className="text-center">
        <Avatar initials="AS" size="lg" online />
        <p className="text-white/70 text-xs mt-2">Online</p>
      </div>
      <div className="text-center">
        <Avatar initials="JD" size="lg" online={false} />
        <p className="text-white/70 text-xs mt-2">Offline</p>
      </div>
    </div>
  ),
};

export const UserList: Story = {
  render: () => (
    <div className="space-y-3">
      <div className="flex items-center gap-3 p-2 rounded-lg bg-white/5">
        <Avatar initials="AS" size="md" online />
        <div>
          <p className="text-white font-medium">Artem Safronov</p>
          <p className="text-white/50 text-sm">@Yhooi2</p>
        </div>
      </div>
      <div className="flex items-center gap-3 p-2 rounded-lg bg-white/5">
        <Avatar initials="JD" size="md" />
        <div>
          <p className="text-white font-medium">John Doe</p>
          <p className="text-white/50 text-sm">@johndoe</p>
        </div>
      </div>
      <div className="flex items-center gap-3 p-2 rounded-lg bg-white/5">
        <Avatar
          initials="MK"
          size="md"
          online
          gradient="from-pink-400 via-rose-500 to-red-500"
        />
        <div>
          <p className="text-white font-medium">Mary Kate</p>
          <p className="text-white/50 text-sm">@marykate</p>
        </div>
      </div>
    </div>
  ),
};
