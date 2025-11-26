import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TimelineStatTooltip } from "./TimelineStatTooltip";

describe("TimelineStatTooltip", () => {
  describe("Commits stat", () => {
    it("renders commits stat correctly", () => {
      render(<TimelineStatTooltip statType="commits" value={629} />);

      expect(screen.getByText("Commits")).toBeInTheDocument();
      expect(screen.getByText("629")).toBeInTheDocument();
      expect(
        screen.getByText("Code changes pushed to repositories")
      ).toBeInTheDocument();
    });

    it("formats large numbers with locale", () => {
      render(<TimelineStatTooltip statType="commits" value={2242} />);

      expect(screen.getByText("2,242")).toBeInTheDocument();
    });

    it("shows context for year", () => {
      render(
        <TimelineStatTooltip statType="commits" value={629} context="2025" />
      );

      expect(screen.getByText("in 2025")).toBeInTheDocument();
    });

    it("shows context for all time", () => {
      render(
        <TimelineStatTooltip statType="commits" value={2242} context="all" />
      );

      expect(screen.getByText("all time")).toBeInTheDocument();
    });
  });

  describe("PRs stat", () => {
    it("renders PRs stat correctly", () => {
      render(<TimelineStatTooltip statType="prs" value={47} />);

      expect(screen.getByText("Pull Requests")).toBeInTheDocument();
      expect(screen.getByText("47")).toBeInTheDocument();
      expect(
        screen.getByText("Code contributions submitted for review")
      ).toBeInTheDocument();
    });
  });

  describe("Issues stat", () => {
    it("renders issues stat correctly", () => {
      render(<TimelineStatTooltip statType="issues" value={12} />);

      expect(screen.getByText("Issues")).toBeInTheDocument();
      expect(screen.getByText("12")).toBeInTheDocument();
      expect(
        screen.getByText("Bug reports and feature requests created")
      ).toBeInTheDocument();
    });
  });

  describe("Repos stat", () => {
    it("renders repos stat correctly", () => {
      render(<TimelineStatTooltip statType="repos" value={11} />);

      expect(screen.getByText("Repositories")).toBeInTheDocument();
      expect(screen.getByText("11")).toBeInTheDocument();
      expect(screen.getByText("Projects worked on")).toBeInTheDocument();
    });
  });

  describe("All stat types", () => {
    const statTypes = ["commits", "prs", "issues", "repos"] as const;

    statTypes.forEach((statType) => {
      it(`renders ${statType} with icon`, () => {
        const { container } = render(
          <TimelineStatTooltip statType={statType} value={100} />
        );

        // Each stat should have an icon with aria-hidden
        const icon = container.querySelector('[aria-hidden="true"]');
        expect(icon).toBeInTheDocument();
      });

      it(`renders ${statType} with detailed explanation`, () => {
        render(<TimelineStatTooltip statType={statType} value={100} />);

        // Each stat has a border-t separator for the detail section
        const { container } = render(
          <TimelineStatTooltip statType={statType} value={100} />
        );
        const detailSection = container.querySelector(".border-t");
        expect(detailSection).toBeInTheDocument();
      });
    });
  });

  describe("Custom className", () => {
    it("applies custom className", () => {
      const { container } = render(
        <TimelineStatTooltip
          statType="commits"
          value={100}
          className="custom-class"
        />
      );

      expect(container.firstChild).toHaveClass("custom-class");
    });
  });

  describe("Edge cases", () => {
    it("handles zero value", () => {
      render(<TimelineStatTooltip statType="commits" value={0} />);

      expect(screen.getByText("0")).toBeInTheDocument();
    });

    it("handles large values", () => {
      render(<TimelineStatTooltip statType="commits" value={1000000} />);

      expect(screen.getByText("1,000,000")).toBeInTheDocument();
    });

    it("renders without context", () => {
      render(<TimelineStatTooltip statType="commits" value={100} />);

      // Should not have "in" or "all time" text
      expect(screen.queryByText(/^in /)).not.toBeInTheDocument();
      expect(screen.queryByText("all time")).not.toBeInTheDocument();
    });
  });
});
