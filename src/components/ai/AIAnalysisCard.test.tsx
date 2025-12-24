import type { AIAnalysisSummary } from "@/types/ai-analytics";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AIAnalysisCard } from "./AIAnalysisCard";

const mockAnalysis: AIAnalysisSummary = {
  summary: "Developer shows strong engagement and consistent activity patterns",
  archetype: {
    primary: "full-stack-engineer",
    confidence: 85,
    description:
      "Balanced expertise across frontend, backend, and infrastructure",
    strengths: ["TypeScript", "React", "Node.js"],
    growthAreas: ["CI/CD", "Testing"],
  },
  insights: [
    {
      id: "1",
      category: "strength",
      priority: "high",
      title: "Active contributor",
      description: "Regular commits and PRs",
    },
    {
      id: "2",
      category: "opportunity",
      priority: "medium",
      title: "Growing influence",
      description: "Increasing stars and forks",
    },
  ],
  confidence: 85,
  analyzedAt: "2024-01-01T00:00:00Z",
};

describe("AIAnalysisCard", () => {
  describe("Rendering", () => {
    it("should render default title", () => {
      render(<AIAnalysisCard analysis={mockAnalysis} />);
      expect(screen.getByText("AI Analysis")).toBeInTheDocument();
    });

    it("should render custom title", () => {
      render(
        <AIAnalysisCard analysis={mockAnalysis} title="Profile Analysis" />,
      );
      expect(screen.getByText("Profile Analysis")).toBeInTheDocument();
    });

    it("should render summary text", () => {
      render(<AIAnalysisCard analysis={mockAnalysis} />);
      expect(
        screen.getByText(
          "Developer shows strong engagement and consistent activity patterns",
        ),
      ).toBeInTheDocument();
    });

    it("should render archetype label", () => {
      render(<AIAnalysisCard analysis={mockAnalysis} />);
      expect(screen.getByText("Full-Stack Engineer")).toBeInTheDocument();
    });

    it("should render confidence badge", () => {
      render(<AIAnalysisCard analysis={mockAnalysis} />);
      expect(screen.getByText("85% confidence")).toBeInTheDocument();
    });

    it("should render archetype strengths", () => {
      render(<AIAnalysisCard analysis={mockAnalysis} />);
      expect(screen.getByText("TypeScript")).toBeInTheDocument();
      expect(screen.getByText("React")).toBeInTheDocument();
      expect(screen.getByText("Node.js")).toBeInTheDocument();
    });

    it("should render growth areas", () => {
      render(<AIAnalysisCard analysis={mockAnalysis} />);
      expect(screen.getByText("CI/CD")).toBeInTheDocument();
      expect(screen.getByText("Testing")).toBeInTheDocument();
    });
  });

  describe("Different Archetypes", () => {
    it("should render frontend-specialist archetype", () => {
      const frontendAnalysis: AIAnalysisSummary = {
        ...mockAnalysis,
        archetype: {
          ...mockAnalysis.archetype,
          primary: "frontend-specialist",
        },
      };
      render(<AIAnalysisCard analysis={frontendAnalysis} />);
      expect(screen.getByText("Frontend Specialist")).toBeInTheDocument();
    });

    it("should render devops-engineer archetype", () => {
      const devopsAnalysis: AIAnalysisSummary = {
        ...mockAnalysis,
        archetype: {
          ...mockAnalysis.archetype,
          primary: "devops-engineer",
        },
      };
      render(<AIAnalysisCard analysis={devopsAnalysis} />);
      expect(screen.getByText("DevOps Engineer")).toBeInTheDocument();
    });
  });

  describe("Empty States", () => {
    it("should handle empty strengths", () => {
      const noStrengths: AIAnalysisSummary = {
        ...mockAnalysis,
        archetype: {
          ...mockAnalysis.archetype,
          strengths: [],
        },
      };
      render(<AIAnalysisCard analysis={noStrengths} />);
      expect(screen.queryByText("Strengths")).not.toBeInTheDocument();
    });

    it("should handle empty growth areas", () => {
      const noGrowthAreas: AIAnalysisSummary = {
        ...mockAnalysis,
        archetype: {
          ...mockAnalysis.archetype,
          growthAreas: [],
        },
      };
      render(<AIAnalysisCard analysis={noGrowthAreas} />);
      expect(screen.queryByText("Growth Areas")).not.toBeInTheDocument();
    });
  });
});
