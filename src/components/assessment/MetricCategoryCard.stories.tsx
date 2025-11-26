import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { useState } from "react";
import { MetricCategoryCard } from "./MetricCategoryCard";

const meta: Meta<typeof MetricCategoryCard> = {
  title: "Assessment/MetricCategoryCard",
  component: MetricCategoryCard,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  decorators: [
    (Story) => (
      <div className="w-[360px]">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof MetricCategoryCard>;

// OUTPUT category with high scores
export const OutputHighScores: Story = {
  args: {
    category: "OUTPUT",
    categoryScore: 75,
    metrics: {
      first: { key: "activity", score: 85, level: "High" },
      second: { key: "impact", score: 65, level: "Moderate" },
    },
    onExplainMetric: fn(),
  },
};

// QUALITY category with excellent scores
export const QualityExcellent: Story = {
  args: {
    category: "QUALITY",
    categoryScore: 88,
    metrics: {
      first: { key: "quality", score: 92, level: "Excellent" },
      second: { key: "consistency", score: 85, level: "High" },
    },
    onExplainMetric: fn(),
  },
};

// TRUST category with low scores
export const TrustLowScores: Story = {
  args: {
    category: "TRUST",
    categoryScore: 36,
    metrics: {
      first: { key: "authenticity", score: 40, level: "Low" },
      second: { key: "collaboration", score: 32, level: "Low" },
    },
    onExplainMetric: fn(),
  },
};

// Mixed scores in OUTPUT
export const OutputMixedScores: Story = {
  args: {
    category: "OUTPUT",
    categoryScore: 55,
    metrics: {
      first: { key: "activity", score: 90, level: "High" },
      second: { key: "impact", score: 20, level: "Low" },
    },
    onExplainMetric: fn(),
  },
};

// All perfect scores
export const PerfectScores: Story = {
  args: {
    category: "QUALITY",
    categoryScore: 100,
    metrics: {
      first: { key: "quality", score: 100, level: "Excellent" },
      second: { key: "consistency", score: 100, level: "Excellent" },
    },
    onExplainMetric: fn(),
  },
};

// All critical scores
export const CriticalScores: Story = {
  args: {
    category: "TRUST",
    categoryScore: 15,
    metrics: {
      first: { key: "authenticity", score: 10, level: "Suspicious" },
      second: { key: "collaboration", score: 20, level: "Low" },
    },
    onExplainMetric: fn(),
  },
};

// Loading state
export const Loading: Story = {
  args: {
    category: "OUTPUT",
    categoryScore: 0,
    metrics: {
      first: { key: "activity", score: 0, level: "Low" },
      second: { key: "impact", score: 0, level: "Low" },
    },
    loading: true,
  },
};

// Without explain callback
export const WithoutExplainCallback: Story = {
  args: {
    category: "QUALITY",
    categoryScore: 70,
    metrics: {
      first: { key: "quality", score: 75, level: "Strong" },
      second: { key: "consistency", score: 65, level: "High" },
    },
  },
};

// Mobile expanded state
export const MobileExpanded: Story = {
  parameters: {
    viewport: {
      defaultViewport: "mobile1",
    },
  },
  args: {
    category: "OUTPUT",
    categoryScore: 75,
    metrics: {
      first: { key: "activity", score: 85, level: "High" },
      second: { key: "impact", score: 65, level: "Moderate" },
    },
    isExpanded: true,
    onToggle: fn(),
    onExplainMetric: fn(),
  },
};

// Mobile collapsed state
export const MobileCollapsed: Story = {
  parameters: {
    viewport: {
      defaultViewport: "mobile1",
    },
  },
  args: {
    category: "QUALITY",
    categoryScore: 80,
    metrics: {
      first: { key: "quality", score: 85, level: "Strong" },
      second: { key: "consistency", score: 75, level: "High" },
    },
    isExpanded: false,
    onToggle: fn(),
    onExplainMetric: fn(),
  },
};

// Interactive accordion (mobile)
const InteractiveAccordionComponent = () => {
  const [expanded, setExpanded] = useState<string | null>(null);

  const categories = [
    {
      category: "OUTPUT" as const,
      categoryScore: 75,
      metrics: {
        first: { key: "activity" as const, score: 85, level: "High" },
        second: { key: "impact" as const, score: 65, level: "Moderate" },
      },
    },
    {
      category: "QUALITY" as const,
      categoryScore: 82,
      metrics: {
        first: { key: "quality" as const, score: 88, level: "Excellent" },
        second: { key: "consistency" as const, score: 76, level: "High" },
      },
    },
    {
      category: "TRUST" as const,
      categoryScore: 45,
      metrics: {
        first: { key: "authenticity" as const, score: 50, level: "Medium" },
        second: { key: "collaboration" as const, score: 40, level: "Moderate" },
      },
    },
  ];

  return (
    <div className="space-y-3">
      {categories.map((cat) => (
        <MetricCategoryCard
          key={cat.category}
          {...cat}
          isExpanded={expanded === cat.category}
          onToggle={() =>
            setExpanded(expanded === cat.category ? null : cat.category)
          }
          onExplainMetric={(key) => alert(`Explain: ${key}`)}
        />
      ))}
    </div>
  );
};

export const InteractiveAccordion: Story = {
  parameters: {
    viewport: {
      defaultViewport: "mobile1",
    },
  },
  render: () => <InteractiveAccordionComponent />,
};

// All three categories on desktop
export const AllCategoriesDesktop: Story = {
  decorators: [
    (Story) => (
      <div className="grid grid-cols-3 gap-4">
        <Story />
      </div>
    ),
  ],
  render: () => (
    <>
      <MetricCategoryCard
        category="OUTPUT"
        categoryScore={75}
        metrics={{
          first: { key: "activity", score: 85, level: "High" },
          second: { key: "impact", score: 65, level: "Moderate" },
        }}
        onExplainMetric={fn()}
      />
      <MetricCategoryCard
        category="QUALITY"
        categoryScore={82}
        metrics={{
          first: { key: "quality", score: 88, level: "Excellent" },
          second: { key: "consistency", score: 76, level: "High" },
        }}
        onExplainMetric={fn()}
      />
      <MetricCategoryCard
        category="TRUST"
        categoryScore={45}
        metrics={{
          first: { key: "authenticity", score: 50, level: "Medium" },
          second: { key: "collaboration", score: 40, level: "Moderate" },
        }}
        onExplainMetric={fn()}
      />
    </>
  ),
};
