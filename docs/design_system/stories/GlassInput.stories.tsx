import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Search, User, Mail } from "lucide-react";
import { GlassInput } from "../GlassInput";
import { ThemeProvider } from "../../context/ThemeContext";
import { Background } from "../Background";

const meta: Meta<typeof GlassInput> = {
  title: "Design System/Core/GlassInput",
  component: GlassInput,
  decorators: [
    (Story) => (
      <ThemeProvider defaultTheme="glass">
        <Background>
          <div className="p-8 w-80">
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
          "A glassmorphism-styled input field with optional icon support.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    placeholder: {
      control: "text",
      description: "Placeholder text",
    },
    value: {
      control: "text",
      description: "Input value",
    },
    disabled: {
      control: "boolean",
      description: "Disabled state",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: "Enter text...",
  },
};

export const WithValue: Story = {
  args: {
    value: "Yhooi2",
    placeholder: "Username",
  },
};

export const WithIcon: Story = {
  args: {
    placeholder: "Search...",
    icon: Search,
  },
};

export const WithUserIcon: Story = {
  args: {
    placeholder: "Enter username",
    icon: User,
  },
};

export const EmailInput: Story = {
  args: {
    placeholder: "Email address",
    icon: Mail,
  },
};

export const Disabled: Story = {
  args: {
    placeholder: "Disabled input",
    disabled: true,
  },
};

export const AllStates: Story = {
  render: () => (
    <div className="space-y-4">
      <div>
        <label className="text-white/70 text-sm mb-1 block">Default</label>
        <GlassInput placeholder="Enter text..." />
      </div>
      <div>
        <label className="text-white/70 text-sm mb-1 block">With icon</label>
        <GlassInput placeholder="Search..." icon={Search} />
      </div>
      <div>
        <label className="text-white/70 text-sm mb-1 block">With value</label>
        <GlassInput value="Yhooi2" placeholder="Username" />
      </div>
      <div>
        <label className="text-white/70 text-sm mb-1 block">Disabled</label>
        <GlassInput placeholder="Disabled" disabled />
      </div>
    </div>
  ),
};
