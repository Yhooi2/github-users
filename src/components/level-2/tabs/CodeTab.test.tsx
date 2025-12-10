import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { ProjectForModal } from "../ProjectAnalyticsModal";
import { CodeTab } from "./CodeTab";

const mockProject: ProjectForModal = {
  id: "test-id",
  name: "test-repo",
  description: "A test repository",
  url: "https://github.com/test/test-repo",
  stars: 1250,
  forks: 340,
};

describe("CodeTab", () => {
  it("renders language breakdown section", () => {
    render(<CodeTab project={mockProject} />);

    expect(screen.getByText("Language Breakdown")).toBeInTheDocument();
  });

  it("displays programming languages", () => {
    render(<CodeTab project={mockProject} />);

    expect(screen.getByText("TypeScript")).toBeInTheDocument();
    expect(screen.getByText("JavaScript")).toBeInTheDocument();
    expect(screen.getByText("CSS")).toBeInTheDocument();
    expect(screen.getByText("HTML")).toBeInTheDocument();
    expect(screen.getByText("Shell")).toBeInTheDocument();
  });

  it("displays language percentages", () => {
    render(<CodeTab project={mockProject} />);

    expect(screen.getByText("68%")).toBeInTheDocument();
    expect(screen.getByText("15%")).toBeInTheDocument();
    expect(screen.getByText("10%")).toBeInTheDocument();
    expect(screen.getByText("5%")).toBeInTheDocument();
    expect(screen.getByText("2%")).toBeInTheDocument();
  });

  it("displays line counts for languages", () => {
    render(<CodeTab project={mockProject} />);

    expect(screen.getByText("45,230 lines")).toBeInTheDocument();
    expect(screen.getByText("9,980 lines")).toBeInTheDocument();
    expect(screen.getByText("6,650 lines")).toBeInTheDocument();
  });

  it("renders code contributions section", () => {
    render(<CodeTab project={mockProject} />);

    expect(screen.getByText("Your Code Contributions")).toBeInTheDocument();
  });

  it("displays code metrics", () => {
    render(<CodeTab project={mockProject} />);

    expect(screen.getByText("Total Lines")).toBeInTheDocument();
    expect(screen.getByText("Files Changed")).toBeInTheDocument();
    expect(screen.getByText("Additions")).toBeInTheDocument();
    expect(screen.getByText("Deletions")).toBeInTheDocument();

    // Check values
    expect(screen.getByText("66,515")).toBeInTheDocument();
    expect(screen.getByText("342")).toBeInTheDocument();
    expect(screen.getByText("+12,450")).toBeInTheDocument();
    expect(screen.getByText("-3,210")).toBeInTheDocument();
  });

  it("renders most changed files section", () => {
    render(<CodeTab project={mockProject} />);

    expect(screen.getByText("Most Changed Files")).toBeInTheDocument();
    expect(
      screen.getByText(/List of most frequently modified files/),
    ).toBeInTheDocument();
  });

  it("renders stacked language bar", () => {
    render(<CodeTab project={mockProject} />);

    // Check for colored segments in the bar
    const stackedBar = document.querySelector(".flex.h-4.overflow-hidden");
    expect(stackedBar).toBeInTheDocument();
    expect(stackedBar?.children.length).toBe(5); // 5 languages
  });

  it("renders progress bars for each language", () => {
    render(<CodeTab project={mockProject} />);

    const progressBars = document.querySelectorAll('[role="progressbar"]');
    // 5 languages = 5 progress bars
    expect(progressBars.length).toBe(5);
  });

  it("applies correct colors to language indicators", () => {
    render(<CodeTab project={mockProject} />);

    // Check that colored indicators exist
    const colorIndicators = document.querySelectorAll(".h-3.w-3.rounded-full");
    expect(colorIndicators.length).toBe(5);
  });
});
