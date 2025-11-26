import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { GlassProgress } from "../GlassProgress";
import { ThemeProvider } from "../../context/ThemeContext";
import { Background } from "../Background";

const meta: Meta<typeof GlassProgress> = {
  title: "Design System/Core/GlassProgress",
  component: GlassProgress,
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
          "A glassmorphism-styled progress bar with customizable gradient and glow effects. Supports different heights and smooth animations.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    value: {
      control: { type: "range", min: 0, max: 100 },
      description: "Progress value (0-100)",
    },
    gradient: {
      control: "text",
      description: "Tailwind gradient classes",
    },
    height: {
      control: "text",
      description: "Height class (e.g., h-2, h-3)",
    },
    showGlow: {
      control: "boolean",
      description: "Show glow effect",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: 65,
  },
};

export const ZeroProgress: Story = {
  args: {
    value: 0,
  },
};

export const FullProgress: Story = {
  args: {
    value: 100,
  },
};

export const VioletGradient: Story = {
  args: {
    value: 75,
    gradient: "from-violet-500 to-purple-500",
  },
};

export const EmeraldGradient: Story = {
  args: {
    value: 84,
    gradient: "from-emerald-400 to-emerald-500",
  },
};

export const AmberGradient: Story = {
  args: {
    value: 45,
    gradient: "from-amber-400 to-amber-500",
  },
};

export const MultiColorGradient: Story = {
  args: {
    value: 72,
    gradient: "from-amber-400 via-emerald-400 to-cyan-500",
  },
};

export const TallHeight: Story = {
  args: {
    value: 60,
    height: "h-4",
  },
};

export const ThinHeight: Story = {
  args: {
    value: 80,
    height: "h-1.5",
  },
};

export const NoGlow: Story = {
  args: {
    value: 70,
    showGlow: false,
  },
};

export const AllGradients: Story = {
  render: () => (
    <div className="space-y-4 w-80">
      <div>
        <p className="text-white/70 text-sm mb-1">Blue to Violet (default)</p>
        <GlassProgress value={80} />
      </div>
      <div>
        <p className="text-white/70 text-sm mb-1">Emerald</p>
        <GlassProgress value={84} gradient="from-emerald-400 to-emerald-500" />
      </div>
      <div>
        <p className="text-white/70 text-sm mb-1">Amber</p>
        <GlassProgress value={45} gradient="from-amber-400 to-amber-500" />
      </div>
      <div>
        <p className="text-white/70 text-sm mb-1">Blue</p>
        <GlassProgress value={78} gradient="from-blue-400 to-blue-500" />
      </div>
      <div>
        <p className="text-white/70 text-sm mb-1">Red</p>
        <GlassProgress value={12} gradient="from-red-400 to-red-500" />
      </div>
      <div>
        <p className="text-white/70 text-sm mb-1">Trust Score (multi)</p>
        <GlassProgress
          value={72}
          gradient="from-amber-400 via-emerald-400 to-cyan-500"
          height="h-3"
        />
      </div>
    </div>
  ),
};

export const DifferentHeights: Story = {
  render: () => (
    <div className="space-y-4 w-80">
      <div>
        <p className="text-white/70 text-sm mb-1">h-1 (tiny)</p>
        <GlassProgress value={60} height="h-1" />
      </div>
      <div>
        <p className="text-white/70 text-sm mb-1">h-1.5 (small)</p>
        <GlassProgress value={60} height="h-1.5" />
      </div>
      <div>
        <p className="text-white/70 text-sm mb-1">h-2 (default)</p>
        <GlassProgress value={60} height="h-2" />
      </div>
      <div>
        <p className="text-white/70 text-sm mb-1">h-3 (medium)</p>
        <GlassProgress value={60} height="h-3" />
      </div>
      <div>
        <p className="text-white/70 text-sm mb-1">h-4 (large)</p>
        <GlassProgress value={60} height="h-4" />
      </div>
    </div>
  ),
};
