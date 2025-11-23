import type { Meta, StoryObj } from "@storybook/react-vite";
import { QuickAssessment } from "./QuickAssessment";

const meta: Meta<typeof QuickAssessment> = {
  title: "Assessment/QuickAssessment",
  component: QuickAssessment,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj<typeof QuickAssessment>;

export const Default: Story = {
  args: {
    metrics: {
      activity: { score: 85, level: "High" },
      impact: { score: 72, level: "Strong" },
      quality: { score: 90, level: "Excellent" },
      growth: { score: 45, level: "Moderate" },
    },
  },
};

export const HighPerformer: Story = {
  args: {
    metrics: {
      activity: { score: 92, level: "High" },
      impact: { score: 88, level: "Exceptional" },
      quality: { score: 95, level: "Excellent" },
      growth: { score: 55, level: "High" },
    },
  },
};

export const AveragePerformer: Story = {
  args: {
    metrics: {
      activity: { score: 55, level: "Moderate" },
      impact: { score: 48, level: "Moderate" },
      quality: { score: 52, level: "Good" },
      growth: { score: 25, level: "Moderate" },
    },
  },
};

export const LowPerformer: Story = {
  args: {
    metrics: {
      activity: { score: 25, level: "Low" },
      impact: { score: 15, level: "Minimal" },
      quality: { score: 30, level: "Fair" },
      growth: { score: 10, level: "Low" },
    },
  },
};

export const Loading: Story = {
  args: {
    metrics: {
      activity: { score: 0, level: "Low" },
      impact: { score: 0, level: "Minimal" },
      quality: { score: 0, level: "Weak" },
      growth: { score: 0, level: "Low" },
    },
    loading: true,
  },
};

export const WithExplainHandler: Story = {
  args: {
    metrics: {
      activity: { score: 85, level: "High" },
      impact: { score: 72, level: "Strong" },
      quality: { score: 90, level: "Excellent" },
      growth: { score: 45, level: "Moderate" },
    },
    onExplainMetric: (metric: string) => alert(`Explain ${metric} metric`),
  },
};

export const MixedPerformance: Story = {
  args: {
    metrics: {
      activity: { score: 92, level: "High" },
      impact: { score: 35, level: "Low" },
      quality: { score: 88, level: "Excellent" },
      growth: { score: 15, level: "Low" },
    },
  },
};

export const WithAuthenticity: Story = {
  args: {
    metrics: {
      activity: { score: 85, level: "High" },
      impact: { score: 72, level: "Strong" },
      quality: { score: 90, level: "Excellent" },
      growth: { score: 45, level: "Moderate" },
      authenticity: { score: 78, level: "High" },
    },
  },
};

export const WithAuthenticityMedium: Story = {
  args: {
    metrics: {
      activity: { score: 55, level: "Moderate" },
      impact: { score: 48, level: "Moderate" },
      quality: { score: 52, level: "Good" },
      growth: { score: 25, level: "Moderate" },
      authenticity: { score: 55, level: "Medium" },
    },
  },
};

export const WithAuthenticitySuspicious: Story = {
  args: {
    metrics: {
      activity: { score: 25, level: "Low" },
      impact: { score: 15, level: "Minimal" },
      quality: { score: 30, level: "Fair" },
      growth: { score: 10, level: "Low" },
      authenticity: { score: 20, level: "Suspicious" },
    },
  },
};

export const FiveMetricsWithExplain: Story = {
  args: {
    metrics: {
      activity: { score: 85, level: "High" },
      impact: { score: 72, level: "Strong" },
      quality: { score: 90, level: "Excellent" },
      growth: { score: 45, level: "Moderate" },
      authenticity: { score: 78, level: "High" },
    },
    onExplainMetric: (metric: string) => alert(`Explain ${metric} metric`),
  },
};
