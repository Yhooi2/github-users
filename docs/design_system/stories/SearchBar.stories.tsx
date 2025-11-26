import type { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";
import { SearchBar } from "../SearchBar";
import { ThemeProvider } from "../../context/ThemeContext";
import { Background } from "../Background";

const meta: Meta<typeof SearchBar> = {
  title: "Design System/Desktop/SearchBar",
  component: SearchBar,
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
          "A glassmorphism-styled search bar with input and button. Supports custom placeholder and button text.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    placeholder: {
      control: "text",
      description: "Input placeholder",
    },
    buttonText: {
      control: "text",
      description: "Button text",
    },
    readOnly: {
      control: "boolean",
      description: "Read-only state",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Interactive wrapper
const InteractiveSearchBar = ({
  initialValue = "",
  ...props
}: {
  initialValue?: string;
  placeholder?: string;
  buttonText?: string;
  readOnly?: boolean;
}) => {
  const [value, setValue] = useState(initialValue);
  const handleSearch = () => {
    alert(`Searching for: ${value}`);
  };
  return (
    <SearchBar
      value={value}
      onChange={setValue}
      onSearch={handleSearch}
      {...props}
    />
  );
};

export const Default: Story = {
  render: () => <InteractiveSearchBar placeholder="Enter username..." />,
};

export const WithValue: Story = {
  render: () => <InteractiveSearchBar initialValue="Yhooi2" />,
};

export const CustomPlaceholder: Story = {
  render: () => (
    <InteractiveSearchBar placeholder="Search repositories..." />
  ),
};

export const CustomButtonText: Story = {
  render: () => (
    <InteractiveSearchBar placeholder="Find user..." buttonText="Find" />
  ),
};

export const ReadOnly: Story = {
  render: () => (
    <SearchBar
      value="Yhooi2"
      readOnly
      onSearch={() => alert("Search clicked")}
    />
  ),
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
      <InteractiveSearchBar initialValue="Yhooi2" />
    </div>
  ),
};
