import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import {
  CombinedLanguageActivityBar,
  type LanguageBreakdown,
} from "./CombinedLanguageActivityBar";

// Mock useReducedMotion hook
vi.mock("@/hooks/useReducedMotion", () => ({
  useReducedMotion: () => false,
}));

// Mock framer-motion to avoid animation issues in tests
vi.mock("framer-motion", () => ({
  motion: {
    div: ({
      children,
      className,
      style,
      ...props
    }: React.HTMLAttributes<HTMLDivElement> & { style?: React.CSSProperties }) => (
      <div className={className} style={style} {...props}>
        {children}
      </div>
    ),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe("CombinedLanguageActivityBar", () => {
  const multiLanguages: LanguageBreakdown[] = [
    { name: "TypeScript", percent: 68 },
    { name: "JavaScript", percent: 20 },
    { name: "CSS", percent: 12 },
  ];

  const singleLanguage: LanguageBreakdown[] = [{ name: "Rust", percent: 100 }];

  const manyLanguages: LanguageBreakdown[] = [
    { name: "TypeScript", percent: 35 },
    { name: "JavaScript", percent: 20 },
    { name: "Python", percent: 15 },
    { name: "Go", percent: 12 },
    { name: "Rust", percent: 10 },
    { name: "Shell", percent: 8 },
  ];

  describe("rendering", () => {
    it("should render the bar with proper role", () => {
      render(
        <CombinedLanguageActivityBar
          commitCount={500}
          maxCommits={1000}
          languages={multiLanguages}
        />
      );

      expect(screen.getByRole("img")).toBeInTheDocument();
    });

    it("should render empty bar when commits is 0", () => {
      render(
        <CombinedLanguageActivityBar
          commitCount={0}
          maxCommits={1000}
          languages={multiLanguages}
        />
      );

      const bar = screen.getByRole("img");
      expect(bar).toHaveAttribute("aria-label", "No activity");
    });

    it("should render empty bar when languages array is empty", () => {
      render(
        <CombinedLanguageActivityBar
          commitCount={500}
          maxCommits={1000}
          languages={[]}
        />
      );

      const bar = screen.getByRole("img");
      expect(bar).toHaveAttribute("aria-label", "No activity");
    });

    it("should filter out zero-percent languages", () => {
      const languagesWithZero: LanguageBreakdown[] = [
        { name: "TypeScript", percent: 100 },
        { name: "JavaScript", percent: 0 },
      ];

      render(
        <CombinedLanguageActivityBar
          commitCount={500}
          maxCommits={1000}
          languages={languagesWithZero}
        />
      );

      const bar = screen.getByRole("img");
      expect(bar.getAttribute("aria-label")).toContain("TypeScript");
      expect(bar.getAttribute("aria-label")).not.toContain("JavaScript");
    });
  });

  describe("activity calculation", () => {
    it("should calculate activity percentage correctly", () => {
      render(
        <CombinedLanguageActivityBar
          commitCount={500}
          maxCommits={1000}
          languages={multiLanguages}
        />
      );

      const bar = screen.getByRole("img");
      expect(bar.getAttribute("aria-label")).toContain("50% of peak");
    });

    it("should show 100% for max commits", () => {
      render(
        <CombinedLanguageActivityBar
          commitCount={1000}
          maxCommits={1000}
          languages={multiLanguages}
        />
      );

      const bar = screen.getByRole("img");
      expect(bar.getAttribute("aria-label")).toContain("100% of peak");
    });

    it("should enforce minimum 2% width for visibility", () => {
      render(
        <CombinedLanguageActivityBar
          commitCount={1}
          maxCommits={1000}
          languages={multiLanguages}
        />
      );

      const bar = screen.getByRole("img");
      // Should show 2% instead of 0.1%
      expect(bar.getAttribute("aria-label")).toContain("2% of peak");
    });

    it("should handle edge case of maxCommits being 0", () => {
      render(
        <CombinedLanguageActivityBar
          commitCount={500}
          maxCommits={0}
          languages={multiLanguages}
        />
      );

      const bar = screen.getByRole("img");
      expect(bar).toHaveAttribute("aria-label", "No activity");
    });
  });

  describe("single language", () => {
    it("should render single language correctly", () => {
      render(
        <CombinedLanguageActivityBar
          commitCount={500}
          maxCommits={1000}
          languages={singleLanguage}
        />
      );

      const bar = screen.getByRole("img");
      expect(bar.getAttribute("aria-label")).toContain("Rust 100%");
    });
  });

  describe("accessibility", () => {
    it("should have aria-label with activity and language info", () => {
      render(
        <CombinedLanguageActivityBar
          commitCount={347}
          maxCommits={500}
          languages={multiLanguages}
        />
      );

      const bar = screen.getByRole("img");
      const ariaLabel = bar.getAttribute("aria-label") || "";

      // Activity info
      expect(ariaLabel).toContain("347 commits");
      expect(ariaLabel).toContain("of peak");

      // Language info
      expect(ariaLabel).toContain("TypeScript");
      expect(ariaLabel).toContain("JavaScript");
    });

    it("should limit languages in aria-label to 4", () => {
      render(
        <CombinedLanguageActivityBar
          commitCount={500}
          maxCommits={1000}
          languages={manyLanguages}
        />
      );

      const bar = screen.getByRole("img");
      const ariaLabel = bar.getAttribute("aria-label") || "";

      // Should include first 4 languages
      expect(ariaLabel).toContain("TypeScript");
      expect(ariaLabel).toContain("JavaScript");
      expect(ariaLabel).toContain("Python");
      expect(ariaLabel).toContain("Go");

      // Should NOT include 5th and 6th
      expect(ariaLabel).not.toContain("Rust");
      expect(ariaLabel).not.toContain("Shell");
    });
  });

  describe("selected state", () => {
    it("should apply selected styles", () => {
      const { container } = render(
        <CombinedLanguageActivityBar
          commitCount={500}
          maxCommits={1000}
          languages={multiLanguages}
          isSelected
        />
      );

      // Check that selected class is applied (shadow)
      const bar = container.querySelector('[role="img"]');
      expect(bar?.className).toContain("shadow");
    });
  });

  describe("compact mode", () => {
    it("should render in compact mode without errors", () => {
      render(
        <CombinedLanguageActivityBar
          commitCount={500}
          maxCommits={1000}
          languages={multiLanguages}
          compact
        />
      );

      expect(screen.getByRole("img")).toBeInTheDocument();
    });
  });

  describe("custom bar height", () => {
    it("should apply custom bar height", () => {
      const { container } = render(
        <CombinedLanguageActivityBar
          commitCount={500}
          maxCommits={1000}
          languages={multiLanguages}
          barHeight="h-3"
        />
      );

      const bar = container.querySelector('[role="img"]');
      expect(bar?.className).toContain("h-3");
    });

    it("should use compact height when compact is true", () => {
      const { container } = render(
        <CombinedLanguageActivityBar
          commitCount={500}
          maxCommits={1000}
          languages={multiLanguages}
          compact
        />
      );

      const bar = container.querySelector('[role="img"]');
      expect(bar?.className).toContain("h-1.5");
    });

    it("should prefer barHeight over compact", () => {
      const { container } = render(
        <CombinedLanguageActivityBar
          commitCount={500}
          maxCommits={1000}
          languages={multiLanguages}
          compact
          barHeight="h-4"
        />
      );

      const bar = container.querySelector('[role="img"]');
      expect(bar?.className).toContain("h-4");
    });
  });

  describe("number formatting", () => {
    it("should format large numbers with separators", () => {
      render(
        <CombinedLanguageActivityBar
          commitCount={1234567}
          maxCommits={2000000}
          languages={multiLanguages}
        />
      );

      const bar = screen.getByRole("img");
      // toLocaleString will format based on locale
      expect(bar.getAttribute("aria-label")).toContain("1,234,567");
    });
  });
});
