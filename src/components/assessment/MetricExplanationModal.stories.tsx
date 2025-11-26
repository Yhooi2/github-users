import type { Meta, StoryObj } from "@storybook/react-vite";
import { MetricExplanationModal } from "./MetricExplanationModal";

const meta: Meta<typeof MetricExplanationModal> = {
  title: "Assessment/MetricExplanationModal",
  component: MetricExplanationModal,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof MetricExplanationModal>;

export const ActivityMetric: Story = {
  args: {
    isOpen: true,
    onClose: () => console.log("Close modal"),
    metric: "activity",
    score: 85,
    breakdown: {
      recentCommits: 40,
      consistency: 30,
      diversity: 15,
    },
  },
};

export const ImpactMetric: Story = {
  args: {
    isOpen: true,
    onClose: () => console.log("Close modal"),
    metric: "impact",
    score: 72,
    breakdown: {
      stars: 30,
      forks: 18,
      contributors: 12,
      reach: 10,
      engagement: 2,
    },
  },
};

export const QualityMetric: Story = {
  args: {
    isOpen: true,
    onClose: () => console.log("Close modal"),
    metric: "quality",
    score: 90,
    breakdown: {
      originality: 30,
      documentation: 22,
      ownership: 18,
      maturity: 12,
      stack: 8,
    },
  },
};

export const GrowthMetric: Story = {
  args: {
    isOpen: true,
    onClose: () => console.log("Close modal"),
    metric: "growth",
    score: 45,
    breakdown: {
      commitGrowth: 20,
      repoGrowth: 15,
      impactGrowth: 10,
    },
  },
};

export const Closed: Story = {
  args: {
    isOpen: false,
    onClose: () => console.log("Close modal"),
    metric: "activity",
    score: 85,
    breakdown: {
      recentCommits: 40,
      consistency: 30,
      diversity: 15,
    },
  },
};

export const LowScore: Story = {
  args: {
    isOpen: true,
    onClose: () => console.log("Close modal"),
    metric: "activity",
    score: 25,
    breakdown: {
      recentCommits: 10,
      consistency: 8,
      diversity: 7,
    },
  },
};

export const PerfectScore: Story = {
  args: {
    isOpen: true,
    onClose: () => console.log("Close modal"),
    metric: "impact",
    score: 100,
    breakdown: {
      stars: 35,
      forks: 20,
      contributors: 15,
      reach: 20,
      engagement: 10,
    },
  },
};

export const AuthenticityMetric: Story = {
  args: {
    isOpen: true,
    onClose: () => console.log("Close modal"),
    metric: "authenticity",
    score: 78,
    breakdown: {
      originalityScore: 22,
      activityScore: 20,
      engagementScore: 18,
      codeOwnershipScore: 18,
    },
  },
};

export const AuthenticityLowScore: Story = {
  args: {
    isOpen: true,
    onClose: () => console.log("Close modal"),
    metric: "authenticity",
    score: 25,
    breakdown: {
      originalityScore: 8,
      activityScore: 6,
      engagementScore: 5,
      codeOwnershipScore: 6,
    },
  },
};

export const ConsistencyMetric: Story = {
  args: {
    isOpen: true,
    onClose: () => console.log("Close modal"),
    metric: "consistency",
    score: 82,
    breakdown: {
      regularity: 45,
      streak: 25,
      recency: 12,
    },
  },
};

export const ConsistencyLowScore: Story = {
  args: {
    isOpen: true,
    onClose: () => console.log("Close modal"),
    metric: "consistency",
    score: 35,
    breakdown: {
      regularity: 15,
      streak: 12,
      recency: 8,
    },
  },
};

export const CollaborationMetric: Story = {
  args: {
    isOpen: true,
    onClose: () => console.log("Close modal"),
    metric: "collaboration",
    score: 65,
    breakdown: {
      contributionRatio: 30,
      diversity: 20,
      engagement: 15,
    },
  },
};

export const CollaborationLowScore: Story = {
  args: {
    isOpen: true,
    onClose: () => console.log("Close modal"),
    metric: "collaboration",
    score: 20,
    breakdown: {
      contributionRatio: 10,
      diversity: 6,
      engagement: 4,
    },
  },
};
