import type { AIInsight } from "@/types/ai-analytics";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { AIInsightCard } from "./AIInsightCard";

const mockInsight: AIInsight = {
  id: "test-1",
  category: "strength",
  priority: "high",
  title: "Strong TypeScript skills",
  description: "Consistent use of TypeScript across projects",
};

describe("AIInsightCard", () => {
  describe("Rendering", () => {
    it("should render insight title", () => {
      render(<AIInsightCard insight={mockInsight} />);
      expect(screen.getByText("Strong TypeScript skills")).toBeInTheDocument();
    });

    it("should render insight description as detail", () => {
      render(<AIInsightCard insight={mockInsight} />);
      expect(
        screen.getByText("Consistent use of TypeScript across projects"),
      ).toBeInTheDocument();
    });

    it("should render category emoji", () => {
      render(<AIInsightCard insight={mockInsight} />);
      // Strength category has icon
      expect(screen.getByText(/💪/)).toBeInTheDocument();
    });
  });

  describe("Categories", () => {
    it("should render weakness category", () => {
      const weaknessInsight: AIInsight = {
        ...mockInsight,
        category: "weakness",
        title: "Limited CI/CD experience",
      };
      render(<AIInsightCard insight={weaknessInsight} />);
      expect(screen.getByText("Limited CI/CD experience")).toBeInTheDocument();
      expect(screen.getByText(/🎯/)).toBeInTheDocument();
    });

    it("should render opportunity category", () => {
      const opportunityInsight: AIInsight = {
        ...mockInsight,
        category: "opportunity",
        title: "Potential for growth",
      };
      render(<AIInsightCard insight={opportunityInsight} />);
      expect(screen.getByText("Potential for growth")).toBeInTheDocument();
      expect(screen.getByText(/✨/)).toBeInTheDocument();
    });

    it("should render trend category", () => {
      const trendInsight: AIInsight = {
        ...mockInsight,
        category: "trend",
        title: "Increasing activity",
      };
      render(<AIInsightCard insight={trendInsight} />);
      expect(screen.getByText("Increasing activity")).toBeInTheDocument();
      expect(screen.getByText(/📈/)).toBeInTheDocument();
    });

    it("should render recommendation category", () => {
      const recommendationInsight: AIInsight = {
        ...mockInsight,
        category: "recommendation",
        title: "Try contributing to OSS",
      };
      render(<AIInsightCard insight={recommendationInsight} />);
      expect(screen.getByText("Try contributing to OSS")).toBeInTheDocument();
      expect(screen.getByText(/💡/)).toBeInTheDocument();
    });
  });

  describe("Interaction", () => {
    it("should call onClick when clicked", async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();
      render(<AIInsightCard insight={mockInsight} onClick={handleClick} />);

      await user.click(screen.getByText("Strong TypeScript skills"));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("should not be clickable without onClick", () => {
      render(<AIInsightCard insight={mockInsight} />);
      const card = screen.getByText("Strong TypeScript skills").closest("div");
      expect(card).not.toHaveAttribute("role", "button");
    });
  });

  describe("Variants", () => {
    it("should render inline variant", () => {
      render(<AIInsightCard insight={mockInsight} inline />);
      const text = screen.getByText("Strong TypeScript skills");
      expect(text.closest("span")).toBeInTheDocument();
    });
  });
});
