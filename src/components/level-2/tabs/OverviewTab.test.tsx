import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { ProjectForModal } from "../ProjectAnalyticsModal";
import { OverviewTab } from "./OverviewTab";

const mockProject: ProjectForModal = {
  id: "test-id",
  name: "test-repo",
  description: "A test repository",
  url: "https://github.com/test/test-repo",
  stars: 1250,
  forks: 340,
};

describe("OverviewTab", () => {
  it("renders metric cards with correct values", () => {
    render(<OverviewTab project={mockProject} />);

    // Check that metric cards are rendered
    expect(screen.getByText("Stars")).toBeInTheDocument();
    expect(screen.getByText("Forks")).toBeInTheDocument();
    expect(screen.getByText("PRs Merged")).toBeInTheDocument();
    expect(screen.getByText("Reviews")).toBeInTheDocument();

    // Check formatted values
    expect(screen.getByText("1.3K")).toBeInTheDocument(); // stars
    expect(screen.getByText("340")).toBeInTheDocument(); // forks
  });

  it("renders contribution summary section", () => {
    render(<OverviewTab project={mockProject} />);

    expect(screen.getByText("Your Contribution")).toBeInTheDocument();
    expect(screen.getByText("Commits")).toBeInTheDocument();
    expect(screen.getByText(/You are a key contributor/)).toBeInTheDocument();
  });

  it("renders recent activity section", () => {
    render(<OverviewTab project={mockProject} />);

    expect(screen.getByText("Recent Activity")).toBeInTheDocument();
    expect(
      screen.getByText(/Activity heatmap and contribution chart/),
    ).toBeInTheDocument();
  });

  it("renders progress bar for commits", () => {
    render(<OverviewTab project={mockProject} />);

    // Check progress bar exists
    const progressBars = document.querySelectorAll('[role="progressbar"]');
    expect(progressBars.length).toBeGreaterThan(0);
  });

  it("displays formatted numbers correctly", () => {
    render(<OverviewTab project={mockProject} />);

    // Contribution info shows formatted numbers
    expect(screen.getByText(/347.*18%.*1.9K/)).toBeInTheDocument();
  });
});
