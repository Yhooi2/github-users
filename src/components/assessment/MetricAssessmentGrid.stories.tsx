import type { Meta, StoryObj } from "@storybook/react-vite";
import { MetricAssessmentGrid } from "./MetricAssessmentGrid";

const meta: Meta<typeof MetricAssessmentGrid> = {
  title: "Assessment/MetricAssessmentGrid",
  component: MetricAssessmentGrid,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj<typeof MetricAssessmentGrid>;

const sampleMetrics = {
  activity: { score: 85, level: "High" as const, breakdown: { recentCommits: 38, consistency: 27, diversity: 20 } },
  impact: { score: 65, level: "Moderate" as const, breakdown: { stars: 25, forks: 15, contributors: 10, reach: 10, engagement: 5 } },
  quality: { score: 78, level: "Strong" as const, breakdown: { originality: 25, documentation: 20, ownership: 15, maturity: 10, stack: 8 } },
  consistency: { score: 82, level: "High" as const, breakdown: { regularity: 40, streak: 25, recency: 17 } },
  authenticity: { score: 45, level: "Medium" as const, breakdown: { originalityScore: 15, activityScore: 10, engagementScore: 10, codeOwnershipScore: 10 } },
  collaboration: { score: 55, level: "Moderate" as const, breakdown: { contributionRatio: 25, diversity: 18, engagement: 12 } },
};

const sampleLanguages = [
  { name: "TypeScript", percent: 68 },
  { name: "JavaScript", percent: 15 },
  { name: "CSS", percent: 10 },
  { name: "Python", percent: 5 },
  { name: "Shell", percent: 2 },
];

// Desktop view with languages
export const DesktopWithLanguages: Story = {
  args: {
    metrics: sampleMetrics,
    languages: sampleLanguages,
  },
};

// Desktop view without languages
export const DesktopWithoutLanguages: Story = {
  args: {
    metrics: sampleMetrics,
  },
};

// High scores
export const HighScores: Story = {
  args: {
    metrics: {
      activity: { score: 95, level: "High" as const, breakdown: { recentCommits: 40, consistency: 30, diversity: 25 } },
      impact: { score: 88, level: "Exceptional" as const, breakdown: { stars: 33, forks: 18, contributors: 14, reach: 15, engagement: 8 } },
      quality: { score: 92, level: "Excellent" as const, breakdown: { originality: 28, documentation: 24, ownership: 18, maturity: 14, stack: 8 } },
      consistency: { score: 90, level: "Excellent" as const, breakdown: { regularity: 45, streak: 28, recency: 17 } },
      authenticity: { score: 85, level: "High" as const, breakdown: { originalityScore: 22, activityScore: 22, engagementScore: 21, codeOwnershipScore: 20 } },
      collaboration: { score: 82, level: "Excellent" as const, breakdown: { contributionRatio: 40, diversity: 25, engagement: 17 } },
    },
    languages: sampleLanguages,
  },
};

// Low scores
export const LowScores: Story = {
  args: {
    metrics: {
      activity: { score: 25, level: "Low" as const, breakdown: { recentCommits: 10, consistency: 8, diversity: 7 } },
      impact: { score: 15, level: "Minimal" as const, breakdown: { stars: 5, forks: 3, contributors: 2, reach: 3, engagement: 2 } },
      quality: { score: 30, level: "Fair" as const, breakdown: { originality: 10, documentation: 8, ownership: 6, maturity: 4, stack: 2 } },
      consistency: { score: 20, level: "Low" as const, breakdown: { regularity: 8, streak: 6, recency: 6 } },
      authenticity: { score: 18, level: "Suspicious" as const, breakdown: { originalityScore: 5, activityScore: 4, engagementScore: 4, codeOwnershipScore: 5 } },
      collaboration: { score: 12, level: "Low" as const, breakdown: { contributionRatio: 5, diversity: 4, engagement: 3 } },
    },
    languages: [{ name: "JavaScript", percent: 100 }],
  },
};

// Mixed scores
export const MixedScores: Story = {
  args: {
    metrics: {
      activity: { score: 90, level: "High" as const, breakdown: { recentCommits: 38, consistency: 28, diversity: 24 } },
      impact: { score: 20, level: "Low" as const, breakdown: { stars: 8, forks: 4, contributors: 3, reach: 3, engagement: 2 } },
      quality: { score: 75, level: "Strong" as const, breakdown: { originality: 22, documentation: 20, ownership: 15, maturity: 10, stack: 8 } },
      consistency: { score: 35, level: "Low" as const, breakdown: { regularity: 15, streak: 10, recency: 10 } },
      authenticity: { score: 88, level: "High" as const, breakdown: { originalityScore: 23, activityScore: 22, engagementScore: 22, codeOwnershipScore: 21 } },
      collaboration: { score: 42, level: "Moderate" as const, breakdown: { contributionRatio: 20, diversity: 12, engagement: 10 } },
    },
    languages: sampleLanguages,
  },
};

// Loading state
export const Loading: Story = {
  args: {
    metrics: {
      activity: { score: 0, level: "Low" as const },
      impact: { score: 0, level: "Low" as const },
      quality: { score: 0, level: "Low" as const },
      consistency: { score: 0, level: "Low" as const },
      authenticity: { score: 0, level: "Low" as const },
      collaboration: { score: 0, level: "Low" as const },
    },
    loading: true,
  },
};

// Mobile view
export const MobileView: Story = {
  parameters: {
    viewport: {
      defaultViewport: "mobile1",
    },
  },
  args: {
    metrics: sampleMetrics,
    languages: sampleLanguages,
  },
};

// Tablet view
export const TabletView: Story = {
  parameters: {
    viewport: {
      defaultViewport: "tablet",
    },
  },
  args: {
    metrics: sampleMetrics,
    languages: sampleLanguages,
  },
};

// Many languages
export const ManyLanguages: Story = {
  args: {
    metrics: sampleMetrics,
    languages: [
      { name: "TypeScript", percent: 40 },
      { name: "JavaScript", percent: 20 },
      { name: "Python", percent: 15 },
      { name: "Go", percent: 10 },
      { name: "Rust", percent: 5 },
      { name: "Ruby", percent: 4 },
      { name: "Shell", percent: 3 },
      { name: "CSS", percent: 2 },
      { name: "HTML", percent: 1 },
    ],
  },
};

// Single language
export const SingleLanguage: Story = {
  args: {
    metrics: sampleMetrics,
    languages: [{ name: "Go", percent: 100 }],
  },
};

// With custom className
export const WithCustomClass: Story = {
  args: {
    metrics: sampleMetrics,
    languages: sampleLanguages,
    className: "max-w-4xl mx-auto",
  },
};
