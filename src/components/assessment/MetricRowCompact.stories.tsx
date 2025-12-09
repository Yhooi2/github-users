import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { MetricRowCompact } from "./MetricRowCompact";
import {
  Zap,
  Target,
  Award,
  Calendar,
  BadgeCheck,
  Users,
} from "lucide-react";

const meta: Meta<typeof MetricRowCompact> = {
  title: "Assessment/MetricRowCompact",
  component: MetricRowCompact,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  decorators: [
    (Story) => (
      <div className="w-[320px] p-4 bg-card rounded-lg border">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof MetricRowCompact>;

// High score (>=80) - Success color
export const HighScore: Story = {
  args: {
    title: "Activity",
    score: 90,
    level: "High",
    icon: Zap,
    description: "Development frequency and contribution volume",
    onInfoClick: fn(),
  },
};

// Medium score (60-79) - Warning color
export const MediumScore: Story = {
  args: {
    title: "Impact",
    score: 65,
    level: "Moderate",
    icon: Target,
    description: "Project reach through stars, forks, and engagement",
    onInfoClick: fn(),
  },
};

// Low score (40-59) - Caution color
export const LowScore: Story = {
  args: {
    title: "Quality",
    score: 45,
    level: "Fair",
    icon: Award,
    description: "Code standards, documentation, and originality",
    onInfoClick: fn(),
  },
};

// Critical score (<40) - Destructive color
export const CriticalScore: Story = {
  args: {
    title: "Authenticity",
    score: 25,
    level: "Suspicious",
    icon: BadgeCheck,
    description: "Profile genuineness and original work verification",
    onInfoClick: fn(),
  },
};

// Perfect score
export const PerfectScore: Story = {
  args: {
    title: "Consistency",
    score: 100,
    level: "Excellent",
    icon: Calendar,
    description: "Regular contribution patterns over time",
    onInfoClick: fn(),
  },
};

// Zero score
export const ZeroScore: Story = {
  args: {
    title: "Collaboration",
    score: 0,
    level: "Low",
    icon: Users,
    description: "Team contributions and open source involvement",
    onInfoClick: fn(),
  },
};

// Without info button
export const WithoutInfoButton: Story = {
  args: {
    title: "Activity",
    score: 75,
    level: "High",
    icon: Zap,
  },
};

// Loading state
export const Loading: Story = {
  args: {
    title: "Activity",
    score: 0,
    level: "Low",
    icon: Zap,
    loading: true,
  },
};

// All metrics showcase
export const AllMetrics: Story = {
  decorators: [
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (_Story) => (
      <div className="w-[320px] p-4 bg-card rounded-lg border space-y-4">
        <MetricRowCompact
          title="Activity"
          score={85}
          level="High"
          icon={Zap}
          onInfoClick={fn()}
        />
        <MetricRowCompact
          title="Impact"
          score={62}
          level="Moderate"
          icon={Target}
          onInfoClick={fn()}
        />
        <MetricRowCompact
          title="Quality"
          score={78}
          level="Strong"
          icon={Award}
          onInfoClick={fn()}
        />
        <MetricRowCompact
          title="Consistency"
          score={91}
          level="Excellent"
          icon={Calendar}
          onInfoClick={fn()}
        />
        <MetricRowCompact
          title="Authenticity"
          score={45}
          level="Medium"
          icon={BadgeCheck}
          onInfoClick={fn()}
        />
        <MetricRowCompact
          title="Collaboration"
          score={32}
          level="Low"
          icon={Users}
          onInfoClick={fn()}
        />
      </div>
    ),
  ],
  render: () => null,
};

// Long title truncation
export const LongTitle: Story = {
  args: {
    title: "Very Long Metric Title That Should Truncate",
    score: 75,
    level: "High",
    icon: Zap,
    onInfoClick: fn(),
  },
};

// Narrow container
export const NarrowContainer: Story = {
  decorators: [
    (Story) => (
      <div className="w-[200px] p-4 bg-card rounded-lg border">
        <Story />
      </div>
    ),
  ],
  args: {
    title: "Activity",
    score: 85,
    level: "High",
    icon: Zap,
    onInfoClick: fn(),
  },
};
