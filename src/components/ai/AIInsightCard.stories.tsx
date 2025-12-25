import type { AIInsight } from "@/types/ai-analytics";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { AIInsightCard } from "./AIInsightCard";

const meta: Meta<typeof AIInsightCard> = {
  title: "AI/AIInsightCard",
  component: AIInsightCard,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof AIInsightCard>;

const strengthInsight: AIInsight = {
  id: "strength-1",
  category: "strength",
  priority: "high",
  title: "Strong TypeScript skills",
  description: "Consistent use of TypeScript across 95% of projects",
};

const weaknessInsight: AIInsight = {
  id: "weakness-1",
  category: "weakness",
  priority: "medium",
  title: "Limited CI/CD experience",
  description: "Few repositories with automated workflows configured",
};

const opportunityInsight: AIInsight = {
  id: "opportunity-1",
  category: "opportunity",
  priority: "high",
  title: "Growing open source presence",
  description: "Recent contributions to popular projects show potential",
};

const trendInsight: AIInsight = {
  id: "trend-1",
  category: "trend",
  priority: "medium",
  title: "Increasing activity",
  description: "Commit frequency up 40% compared to last quarter",
};

const recommendationInsight: AIInsight = {
  id: "recommendation-1",
  category: "recommendation",
  priority: "low",
  title: "Consider contributing to OSS",
  description: "Skills align well with React ecosystem projects",
};

export const Default: Story = {
  args: {
    insight: strengthInsight,
  },
};

export const Strength: Story = {
  args: {
    insight: strengthInsight,
  },
};

export const Weakness: Story = {
  args: {
    insight: weaknessInsight,
  },
};

export const Opportunity: Story = {
  args: {
    insight: opportunityInsight,
  },
};

export const Trend: Story = {
  args: {
    insight: trendInsight,
  },
};

export const Recommendation: Story = {
  args: {
    insight: recommendationInsight,
  },
};

export const Clickable: Story = {
  args: {
    insight: strengthInsight,
    onClick: () => {},
  },
};

export const WithArrow: Story = {
  args: {
    insight: strengthInsight,
    onClick: () => {},
    showArrow: true,
  },
};

export const Animated: Story = {
  args: {
    insight: strengthInsight,
    animated: true,
  },
};

export const Inline: Story = {
  args: {
    insight: strengthInsight,
    inline: true,
  },
};

export const AllCategories: Story = {
  render: () => (
    <div className="space-y-3">
      <AIInsightCard insight={strengthInsight} />
      <AIInsightCard insight={weaknessInsight} />
      <AIInsightCard insight={opportunityInsight} />
      <AIInsightCard insight={trendInsight} />
      <AIInsightCard insight={recommendationInsight} />
    </div>
  ),
};
