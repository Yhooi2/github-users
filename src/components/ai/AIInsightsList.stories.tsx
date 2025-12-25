import type { AIInsight } from "@/types/ai-analytics";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { AIInsightsList } from "./AIInsightsList";

const meta: Meta<typeof AIInsightsList> = {
  title: "AI/AIInsightsList",
  component: AIInsightsList,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof AIInsightsList>;

const mockInsights: AIInsight[] = [
  {
    id: "1",
    category: "strength",
    priority: "high",
    title: "Strong TypeScript skills",
    description: "Consistent use of TypeScript across 95% of projects",
  },
  {
    id: "2",
    category: "opportunity",
    priority: "high",
    title: "Growing open source presence",
    description: "Recent contributions to popular projects show potential",
  },
  {
    id: "3",
    category: "trend",
    priority: "medium",
    title: "Increasing activity",
    description: "Commit frequency up 40% compared to last quarter",
  },
  {
    id: "4",
    category: "weakness",
    priority: "medium",
    title: "Limited CI/CD experience",
    description: "Few repositories with automated workflows configured",
  },
];

const manyInsights: AIInsight[] = [
  ...mockInsights,
  {
    id: "5",
    category: "recommendation",
    priority: "low",
    title: "Consider contributing to OSS",
    description: "Skills align well with React ecosystem projects",
  },
  {
    id: "6",
    category: "strength",
    priority: "high",
    title: "Clean code practices",
    description: "Well-structured repositories with consistent patterns",
  },
  {
    id: "7",
    category: "trend",
    priority: "medium",
    title: "Shift to TypeScript",
    description: "Migration from JavaScript visible in recent projects",
  },
  {
    id: "8",
    category: "opportunity",
    priority: "medium",
    title: "Backend potential",
    description: "Node.js skills could expand to full-stack role",
  },
  {
    id: "9",
    category: "weakness",
    priority: "low",
    title: "Sparse documentation",
    description: "README files could be more detailed",
  },
  {
    id: "10",
    category: "recommendation",
    priority: "medium",
    title: "Add testing",
    description: "Unit test coverage would strengthen profile",
  },
];

export const Default: Story = {
  args: {
    insights: mockInsights,
  },
};

export const SingleInsight: Story = {
  args: {
    insights: [mockInsights[0]],
  },
};

export const ManyInsights: Story = {
  args: {
    insights: manyInsights,
  },
};

export const WithMaxItems: Story = {
  args: {
    insights: manyInsights,
    maxItems: 3,
  },
};

export const Clickable: Story = {
  args: {
    insights: mockInsights,
    onInsightClick: () => {},
  },
};

export const ClickableWithArrows: Story = {
  args: {
    insights: mockInsights,
    onInsightClick: () => {},
    showArrows: true,
  },
};

export const Animated: Story = {
  args: {
    insights: mockInsights,
    animated: true,
  },
};

export const Empty: Story = {
  args: {
    insights: [],
  },
};

export const AllFeatures: Story = {
  args: {
    insights: mockInsights,
    onInsightClick: () => {},
    showArrows: true,
    animated: true,
    maxItems: 4,
  },
};
