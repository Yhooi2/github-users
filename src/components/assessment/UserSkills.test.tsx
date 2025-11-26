import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { UserSkills } from "./UserSkills";

describe("UserSkills", () => {
  const sampleLanguages = [
    { name: "TypeScript", percent: 68 },
    { name: "JavaScript", percent: 15 },
    { name: "CSS", percent: 10 },
    { name: "HTML", percent: 5 },
    { name: "Shell", percent: 2 },
  ];

  describe("Rendering", () => {
    it("renders title 'Top Skills'", () => {
      render(<UserSkills languages={sampleLanguages} />);

      expect(screen.getByText("Top Skills")).toBeInTheDocument();
    });

    it("renders all languages within maxItems", () => {
      render(<UserSkills languages={sampleLanguages} maxItems={5} />);

      expect(screen.getByText("TypeScript")).toBeInTheDocument();
      expect(screen.getByText("JavaScript")).toBeInTheDocument();
      expect(screen.getByText("CSS")).toBeInTheDocument();
      expect(screen.getByText("HTML")).toBeInTheDocument();
      expect(screen.getByText("Shell")).toBeInTheDocument();
    });

    it("renders percentages correctly", () => {
      render(<UserSkills languages={sampleLanguages} />);

      expect(screen.getByText("68%")).toBeInTheDocument();
      expect(screen.getByText("15%")).toBeInTheDocument();
      expect(screen.getByText("10%")).toBeInTheDocument();
    });

    it("rounds percentages to whole numbers", () => {
      render(
        <UserSkills
          languages={[{ name: "TypeScript", percent: 68.7 }]}
        />
      );

      expect(screen.getByText("69%")).toBeInTheDocument();
    });

    it("renders color dots for each language", () => {
      const { container } = render(
        <UserSkills languages={sampleLanguages} />
      );

      const colorDots = container.querySelectorAll(
        '[aria-hidden="true"].rounded-full'
      );
      // Should have color dots (plus the icon)
      expect(colorDots.length).toBeGreaterThanOrEqual(5);
    });
  });

  describe("MaxItems Behavior", () => {
    it("limits displayed languages to maxItems", () => {
      render(<UserSkills languages={sampleLanguages} maxItems={3} />);

      expect(screen.getByText("TypeScript")).toBeInTheDocument();
      expect(screen.getByText("JavaScript")).toBeInTheDocument();
      expect(screen.getByText("CSS")).toBeInTheDocument();
      expect(screen.queryByText("HTML")).not.toBeInTheDocument();
      expect(screen.queryByText("Shell")).not.toBeInTheDocument();
    });

    it("shows remaining count when languages exceed maxItems", () => {
      render(<UserSkills languages={sampleLanguages} maxItems={3} />);

      expect(screen.getByText("+2")).toBeInTheDocument();
    });

    it("does not show remaining count when all languages fit", () => {
      render(<UserSkills languages={sampleLanguages} maxItems={5} />);

      expect(screen.queryByText(/\+\d/)).not.toBeInTheDocument();
    });

    it("uses default maxItems of 5", () => {
      const manyLanguages = [
        { name: "TypeScript", percent: 30 },
        { name: "JavaScript", percent: 25 },
        { name: "Python", percent: 15 },
        { name: "Go", percent: 10 },
        { name: "Rust", percent: 8 },
        { name: "Ruby", percent: 7 },
        { name: "Shell", percent: 5 },
      ];

      render(<UserSkills languages={manyLanguages} />);

      expect(screen.getByText("+2")).toBeInTheDocument();
    });
  });

  describe("Sorting", () => {
    it("sorts languages by percentage descending", () => {
      const unsortedLanguages = [
        { name: "JavaScript", percent: 15 },
        { name: "TypeScript", percent: 68 },
        { name: "CSS", percent: 10 },
      ];

      render(<UserSkills languages={unsortedLanguages} maxItems={2} />);

      // TypeScript and JavaScript should be shown (highest percentages)
      expect(screen.getByText("TypeScript")).toBeInTheDocument();
      expect(screen.getByText("JavaScript")).toBeInTheDocument();
      expect(screen.queryByText("CSS")).not.toBeInTheDocument();
    });
  });

  describe("Empty State", () => {
    it("shows empty message when no languages", () => {
      render(<UserSkills languages={[]} />);

      expect(screen.getByText("No languages detected")).toBeInTheDocument();
    });

    it("shows empty message when languages is undefined", () => {
      render(<UserSkills languages={undefined as any} />);

      expect(screen.getByText("No languages detected")).toBeInTheDocument();
    });
  });

  describe("Loading State", () => {
    it("renders loading skeleton", () => {
      const { container } = render(<UserSkills languages={[]} loading />);

      expect(container.querySelector(".animate-pulse")).toBeInTheDocument();
    });

    it("does not show languages when loading", () => {
      render(<UserSkills languages={sampleLanguages} loading />);

      expect(screen.queryByText("TypeScript")).not.toBeInTheDocument();
    });

    it("renders skeleton chips", () => {
      const { container } = render(<UserSkills languages={[]} loading />);

      const skeletonChips = container.querySelectorAll(".rounded-full.bg-muted");
      expect(skeletonChips.length).toBeGreaterThan(0);
    });
  });

  describe("Accessibility", () => {
    it("has accessible list role", () => {
      render(<UserSkills languages={sampleLanguages} />);

      const list = screen.getByRole("list", { name: /programming languages/i });
      expect(list).toBeInTheDocument();
    });

    it("has listitem role for each language", () => {
      render(<UserSkills languages={sampleLanguages} />);

      const items = screen.getAllByRole("listitem");
      expect(items.length).toBe(5);
    });

    it("has aria-label for remaining count", () => {
      render(<UserSkills languages={sampleLanguages} maxItems={3} />);

      const remaining = screen.getByLabelText(/and 2 more languages/i);
      expect(remaining).toBeInTheDocument();
    });

    it("hides color dots from screen readers", () => {
      const { container } = render(
        <UserSkills languages={[{ name: "TypeScript", percent: 100 }]} />
      );

      const colorDot = container.querySelector(
        '[role="listitem"] [aria-hidden="true"]'
      );
      expect(colorDot).toBeInTheDocument();
    });
  });

  describe("Language Colors", () => {
    it("applies correct color for known languages", () => {
      const { container } = render(
        <UserSkills languages={[{ name: "TypeScript", percent: 100 }]} />
      );

      const colorDot = container.querySelector(
        '[role="listitem"] span[aria-hidden="true"]'
      );
      expect(colorDot).toHaveStyle({ backgroundColor: "#3178c6" });
    });

    it("applies default color for unknown languages", () => {
      const { container } = render(
        <UserSkills languages={[{ name: "UnknownLang", percent: 100 }]} />
      );

      const colorDot = container.querySelector(
        '[role="listitem"] span[aria-hidden="true"]'
      );
      // Default gray color
      expect(colorDot).toHaveStyle({ backgroundColor: "#64748b" });
    });
  });

  describe("Single Language", () => {
    it("renders single language correctly", () => {
      render(<UserSkills languages={[{ name: "Python", percent: 100 }]} />);

      expect(screen.getByText("Python")).toBeInTheDocument();
      expect(screen.getByText("100%")).toBeInTheDocument();
    });

    it("does not show remaining count for single language", () => {
      render(<UserSkills languages={[{ name: "Python", percent: 100 }]} />);

      expect(screen.queryByText(/\+/)).not.toBeInTheDocument();
    });
  });

  describe("Custom className", () => {
    it("applies custom className to card", () => {
      const { container } = render(
        <UserSkills languages={sampleLanguages} className="custom-class" />
      );

      const card = container.querySelector('[data-slot="card"]');
      expect(card).toHaveClass("custom-class");
    });
  });
});
