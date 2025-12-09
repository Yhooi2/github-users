/**
 * Tests for LanguagesInline component
 *
 * @vitest-environment jsdom
 */
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { LanguagesInline, type LanguageItem } from "./LanguagesInline";

describe("LanguagesInline", () => {
  const mockLanguages: LanguageItem[] = [
    { name: "TypeScript", percent: 56.3 },
    { name: "JavaScript", percent: 22.1 },
    { name: "HTML", percent: 15.4 },
    { name: "CSS", percent: 6.2 },
  ];

  describe("rendering", () => {
    it("should render all languages when under maxItems", () => {
      render(<LanguagesInline languages={mockLanguages} maxItems={5} />);

      expect(screen.getByText("TypeScript")).toBeInTheDocument();
      expect(screen.getByText("JavaScript")).toBeInTheDocument();
      expect(screen.getByText("HTML")).toBeInTheDocument();
      expect(screen.getByText("CSS")).toBeInTheDocument();
    });

    it("should render percentages with proper formatting", () => {
      render(<LanguagesInline languages={mockLanguages} />);

      // Check rounded percentages
      expect(screen.getByText("56%")).toBeInTheDocument(); // 56.3 rounded
      expect(screen.getByText("22%")).toBeInTheDocument(); // 22.1 rounded
      expect(screen.getByText("15%")).toBeInTheDocument(); // 15.4 rounded
      expect(screen.getByText("6%")).toBeInTheDocument(); // 6.2 rounded
    });

    it("should limit displayed languages to maxItems", () => {
      render(<LanguagesInline languages={mockLanguages} maxItems={2} />);

      expect(screen.getByText("TypeScript")).toBeInTheDocument();
      expect(screen.getByText("JavaScript")).toBeInTheDocument();
      expect(screen.queryByText("HTML")).not.toBeInTheDocument();
      expect(screen.queryByText("CSS")).not.toBeInTheDocument();
    });

    it("should show +N indicator for hidden languages", () => {
      render(<LanguagesInline languages={mockLanguages} maxItems={2} />);

      // Should show "+2" for the 2 hidden languages
      expect(screen.getByText("+2")).toBeInTheDocument();
    });

    it("should not show +N indicator when all languages are visible", () => {
      render(<LanguagesInline languages={mockLanguages} maxItems={4} />);

      expect(screen.queryByText(/^\+\d+$/)).not.toBeInTheDocument();
    });

    it("should use maxItems default of 4", () => {
      const manyLanguages: LanguageItem[] = [
        { name: "TypeScript", percent: 30 },
        { name: "JavaScript", percent: 25 },
        { name: "Python", percent: 20 },
        { name: "Java", percent: 15 },
        { name: "Go", percent: 10 },
      ];

      render(<LanguagesInline languages={manyLanguages} />);

      // First 4 should be visible
      expect(screen.getByText("TypeScript")).toBeInTheDocument();
      expect(screen.getByText("JavaScript")).toBeInTheDocument();
      expect(screen.getByText("Python")).toBeInTheDocument();
      expect(screen.getByText("Java")).toBeInTheDocument();

      // 5th should be hidden
      expect(screen.queryByText("Go")).not.toBeInTheDocument();
      expect(screen.getByText("+1")).toBeInTheDocument();
    });
  });

  describe("separators", () => {
    it("should render bullet separators between languages", () => {
      render(<LanguagesInline languages={mockLanguages} maxItems={3} />);

      const container = screen.getByRole("list");
      // Check if bullet separator exists in the content
      expect(container.textContent).toContain("•");
    });

    it("should not render separator after last visible language", () => {
      render(<LanguagesInline languages={mockLanguages} maxItems={2} />);

      const container = screen.getByRole("list");
      const items = within(container).getAllByRole("listitem");

      // Last item should not have a bullet after it
      const lastItem = items[items.length - 1];
      expect(lastItem.textContent).not.toMatch(/•$/);
    });
  });

  describe("tooltip", () => {
    it("should show tooltip with all languages on hover", async () => {
      const user = userEvent.setup();
      render(<LanguagesInline languages={mockLanguages} maxItems={2} />);

      const trigger = screen.getByRole("list");
      await user.hover(trigger);

      // Wait for tooltip to appear
      const tooltips = await screen.findAllByText("All Languages");
      expect(tooltips.length).toBeGreaterThan(0);

      // All languages should be in tooltip - use getAllByText as they appear in both inline and tooltip
      expect(screen.getAllByText("TypeScript").length).toBeGreaterThan(0);
      expect(screen.getAllByText("JavaScript").length).toBeGreaterThan(0);
      expect(screen.getAllByText("HTML").length).toBeGreaterThan(0);
      expect(screen.getAllByText("CSS").length).toBeGreaterThan(0);
    });

    it("should show precise percentages in tooltip (not rounded)", async () => {
      const user = userEvent.setup();
      render(<LanguagesInline languages={mockLanguages} />);

      const trigger = screen.getByRole("list");
      await user.hover(trigger);

      // Tooltip should show 1 decimal place - use getAllByText since tooltip may duplicate
      const percent563 = await screen.findAllByText("56.3%");
      expect(percent563.length).toBeGreaterThan(0);

      const percent221 = screen.getAllByText("22.1%");
      expect(percent221.length).toBeGreaterThan(0);

      const percent154 = screen.getAllByText("15.4%");
      expect(percent154.length).toBeGreaterThan(0);

      const percent62 = screen.getAllByText("6.2%");
      expect(percent62.length).toBeGreaterThan(0);
    });
  });

  describe("empty states", () => {
    it("should render nothing when languages array is empty", () => {
      const { container } = render(<LanguagesInline languages={[]} />);

      expect(container.firstChild).toBeNull();
    });

    it("should render nothing when languages is null", () => {
      // @ts-expect-error Testing null case
      const { container } = render(<LanguagesInline languages={null} />);

      expect(container.firstChild).toBeNull();
    });
  });

  describe("accessibility", () => {
    it("should have proper ARIA role for list", () => {
      render(<LanguagesInline languages={mockLanguages} />);

      const list = screen.getByRole("list");
      expect(list).toHaveAttribute("aria-label", "Programming languages");
    });

    it("should have list items with proper role", () => {
      render(<LanguagesInline languages={mockLanguages} maxItems={2} />);

      const items = screen.getAllByRole("listitem");
      expect(items).toHaveLength(2);
    });

    it("should have cursor-default for non-interactive appearance", () => {
      const { container } = render(<LanguagesInline languages={mockLanguages} />);

      const list = container.querySelector("[role='list']");
      expect(list).toHaveClass("cursor-default");
    });

    it("should hide color dots from screen readers", () => {
      const { container } = render(<LanguagesInline languages={mockLanguages} />);

      const colorDots = container.querySelectorAll("[aria-hidden='true']");
      expect(colorDots.length).toBeGreaterThan(0);
    });
  });

  describe("language colors", () => {
    it("should apply background colors to language dots", () => {
      const { container } = render(<LanguagesInline languages={mockLanguages} />);

      const dots = container.querySelectorAll("span[style*='background']");
      expect(dots.length).toBeGreaterThan(0);
    });

    it("should use consistent colors from getLanguageColor", () => {
      const { container } = render(
        <LanguagesInline
          languages={[
            { name: "TypeScript", percent: 50 },
            { name: "TypeScript", percent: 50 },
          ]}
        />,
      );

      const dots = container.querySelectorAll("span[style*='background']");
      const firstColor = (dots[0] as HTMLElement).style.backgroundColor;
      const secondColor = (dots[1] as HTMLElement).style.backgroundColor;

      // Same language should have same color
      expect(firstColor).toBe(secondColor);
    });
  });

  describe("edge cases", () => {
    it("should handle single language", () => {
      render(<LanguagesInline languages={[{ name: "TypeScript", percent: 100 }]} />);

      expect(screen.getByText("TypeScript")).toBeInTheDocument();
      expect(screen.getByText("100%")).toBeInTheDocument();

      // No separator needed for single item
      const container = screen.getByRole("list");
      expect(container.textContent).not.toContain("•");
    });

    it("should handle very small percentages", () => {
      render(<LanguagesInline languages={[{ name: "Shell", percent: 0.1 }]} />);

      // Should round to 0%
      expect(screen.getByText("0%")).toBeInTheDocument();
    });

    it("should handle maxItems of 0", () => {
      render(<LanguagesInline languages={mockLanguages} maxItems={0} />);

      // No languages should be visible
      expect(screen.queryByText("TypeScript")).not.toBeInTheDocument();

      // Should show +4 for all hidden
      expect(screen.getByText("+4")).toBeInTheDocument();
    });

    it("should handle maxItems larger than array length", () => {
      render(<LanguagesInline languages={mockLanguages} maxItems={100} />);

      // All 4 languages should be visible
      expect(screen.getByText("TypeScript")).toBeInTheDocument();
      expect(screen.getByText("JavaScript")).toBeInTheDocument();
      expect(screen.getByText("HTML")).toBeInTheDocument();
      expect(screen.getByText("CSS")).toBeInTheDocument();

      // No +N indicator
      expect(screen.queryByText(/^\+\d+$/)).not.toBeInTheDocument();
    });

    it("should handle language names with special characters", () => {
      render(
        <LanguagesInline
          languages={[
            { name: "C++", percent: 50 },
            { name: "C#", percent: 30 },
            { name: "F#", percent: 20 },
          ]}
        />,
      );

      expect(screen.getByText("C++")).toBeInTheDocument();
      expect(screen.getByText("C#")).toBeInTheDocument();
      expect(screen.getByText("F#")).toBeInTheDocument();
    });
  });
});
