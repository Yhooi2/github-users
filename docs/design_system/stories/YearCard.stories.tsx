import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { YearCard } from "../YearCard";
import { ThemeProvider } from "../../context/ThemeContext";
import { Background } from "../Background";

const meta: Meta<typeof YearCard> = {
  title: "Design System/Desktop/YearCard",
  component: YearCard,
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
          "A glassmorphism card for displaying year statistics with emoji badge, commit count, and progress bar.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    year: {
      control: "number",
      description: "Year number",
    },
    emoji: {
      control: "text",
      description: "Emoji for the badge",
    },
    label: {
      control: "text",
      description: "Label text",
    },
    commits: {
      control: "number",
      description: "Number of commits",
    },
    progress: {
      control: { type: "range", min: 0, max: 100 },
      description: "Progress bar value",
    },
    gradient: {
      control: "text",
      description: "Progress gradient classes",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    year: 2024,
    emoji: "📈",
    label: "Growth",
    commits: 901,
    progress: 100,
  },
};

export const Peak: Story = {
  args: {
    year: 2025,
    emoji: "🔥",
    label: "Peak",
    commits: 629,
    progress: 70,
  },
};

export const Start: Story = {
  args: {
    year: 2023,
    emoji: "🌱",
    label: "Start",
    commits: 712,
    progress: 79,
  },
};

export const CustomGradient: Story = {
  args: {
    year: 2024,
    emoji: "⭐",
    label: "Best",
    commits: 1200,
    progress: 100,
    gradient: "from-amber-400 to-orange-500",
  },
};

export const Clickable: Story = {
  args: {
    year: 2024,
    emoji: "📈",
    label: "Growth",
    commits: 901,
    progress: 100,
    onClick: () => alert("Year 2024 clicked!"),
  },
};

export const Timeline: Story = {
  render: () => (
    <div className="space-y-0">
      <YearCard
        year={2025}
        emoji="🔥"
        label="Peak"
        commits={629}
        progress={70}
      />
      <YearCard
        year={2024}
        emoji="📈"
        label="Growth"
        commits={901}
        progress={100}
      />
      <YearCard
        year={2023}
        emoji="🌱"
        label="Start"
        commits={712}
        progress={79}
      />
    </div>
  ),
};

export const WithDifferentGradients: Story = {
  render: () => (
    <div className="space-y-0">
      <YearCard
        year={2025}
        emoji="🔥"
        label="Peak"
        commits={629}
        progress={70}
        gradient="from-red-400 to-orange-500"
      />
      <YearCard
        year={2024}
        emoji="📈"
        label="Growth"
        commits={901}
        progress={100}
        gradient="from-emerald-400 to-cyan-500"
      />
      <YearCard
        year={2023}
        emoji="🌱"
        label="Start"
        commits={712}
        progress={79}
        gradient="from-blue-400 to-violet-500"
      />
    </div>
  ),
};
