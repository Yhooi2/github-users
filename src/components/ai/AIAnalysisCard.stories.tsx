import type { AIAnalysisSummary } from "@/types/ai-analytics";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { AIAnalysisCard } from "./AIAnalysisCard";

const meta: Meta<typeof AIAnalysisCard> = {
  title: "AI/AIAnalysisCard",
  component: AIAnalysisCard,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof AIAnalysisCard>;

const fullStackAnalysis: AIAnalysisSummary = {
  summary:
    "Developer shows strong engagement and consistent activity patterns with balanced expertise across the stack.",
  archetype: {
    primary: "full-stack-engineer",
    confidence: 85,
    description:
      "Balanced expertise across frontend, backend, and infrastructure",
    strengths: ["TypeScript", "React", "Node.js", "PostgreSQL"],
    growthAreas: ["CI/CD", "Testing", "Documentation"],
  },
  insights: [
    {
      id: "1",
      category: "strength",
      priority: "high",
      title: "Active contributor",
      description: "Regular commits and PRs",
    },
  ],
  confidence: 85,
  analyzedAt: "2024-01-01T00:00:00Z",
};

const frontendAnalysis: AIAnalysisSummary = {
  summary:
    "Specialized frontend developer with strong UI/UX focus and modern framework expertise.",
  archetype: {
    primary: "frontend-specialist",
    confidence: 92,
    description: "Deep expertise in frontend technologies and user experience",
    strengths: ["React", "TypeScript", "CSS", "Accessibility", "Animation"],
    growthAreas: ["Backend", "DevOps"],
  },
  insights: [],
  confidence: 92,
  analyzedAt: "2024-01-01T00:00:00Z",
};

const devopsAnalysis: AIAnalysisSummary = {
  summary:
    "Infrastructure-focused engineer with strong automation and reliability skills.",
  archetype: {
    primary: "devops-engineer",
    confidence: 78,
    description: "Focus on infrastructure, automation, and reliability",
    strengths: ["Docker", "Kubernetes", "CI/CD", "Terraform", "AWS"],
    growthAreas: ["Frontend", "Mobile"],
  },
  insights: [],
  confidence: 78,
  analyzedAt: "2024-01-01T00:00:00Z",
};

export const Default: Story = {
  args: {
    analysis: fullStackAnalysis,
  },
};

export const CustomTitle: Story = {
  args: {
    analysis: fullStackAnalysis,
    title: "Profile Analysis",
  },
};

export const FrontendSpecialist: Story = {
  args: {
    analysis: frontendAnalysis,
  },
};

export const DevOpsEngineer: Story = {
  args: {
    analysis: devopsAnalysis,
  },
};

export const NoStrengths: Story = {
  args: {
    analysis: {
      ...fullStackAnalysis,
      archetype: {
        ...fullStackAnalysis.archetype,
        strengths: [],
      },
    },
  },
};

export const NoGrowthAreas: Story = {
  args: {
    analysis: {
      ...fullStackAnalysis,
      archetype: {
        ...fullStackAnalysis.archetype,
        growthAreas: [],
      },
    },
  },
};

export const LowConfidence: Story = {
  args: {
    analysis: {
      ...fullStackAnalysis,
      confidence: 35,
      archetype: {
        ...fullStackAnalysis.archetype,
        confidence: 35,
      },
    },
  },
};

export const HighConfidence: Story = {
  args: {
    analysis: {
      ...fullStackAnalysis,
      confidence: 98,
      archetype: {
        ...fullStackAnalysis.archetype,
        confidence: 98,
      },
    },
  },
};

export const ManyStrengths: Story = {
  args: {
    analysis: {
      ...fullStackAnalysis,
      archetype: {
        ...fullStackAnalysis.archetype,
        strengths: [
          "TypeScript",
          "React",
          "Node.js",
          "PostgreSQL",
          "GraphQL",
          "Docker",
          "AWS",
          "Testing",
        ],
      },
    },
  },
};
