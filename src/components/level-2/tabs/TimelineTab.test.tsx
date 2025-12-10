import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { ProjectForModal } from "../ProjectAnalyticsModal";
import { TimelineTab } from "./TimelineTab";

const mockProject: ProjectForModal = {
  id: "test-id",
  name: "test-repo",
  description: "A test repository",
  url: "https://github.com/test/test-repo",
  stars: 1250,
  forks: 340,
};

describe("TimelineTab", () => {
  it("renders activity timeline section", () => {
    render(<TimelineTab project={mockProject} />);

    expect(screen.getByText("Activity Timeline")).toBeInTheDocument();
  });

  it("displays timeline events", () => {
    render(<TimelineTab project={mockProject} />);

    // Check event titles
    expect(
      screen.getByText("feat: add new dashboard component"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("PR #142: Implement user settings"),
    ).toBeInTheDocument();
    expect(screen.getByText("Reviewed PR #138")).toBeInTheDocument();
    expect(
      screen.getByText("Merged PR #135: Fix authentication bug"),
    ).toBeInTheDocument();
    expect(screen.getByText("chore: update dependencies")).toBeInTheDocument();
  });

  it("displays event dates", () => {
    render(<TimelineTab project={mockProject} />);

    expect(screen.getByText("2 days ago")).toBeInTheDocument();
    expect(screen.getByText("5 days ago")).toBeInTheDocument();
    expect(screen.getByText("1 week ago")).toBeInTheDocument();
    expect(screen.getByText("2 weeks ago")).toBeInTheDocument();
    expect(screen.getByText("3 weeks ago")).toBeInTheDocument();
  });

  it("displays event descriptions when provided", () => {
    render(<TimelineTab project={mockProject} />);

    expect(
      screen.getByText("Added user preferences and notification settings"),
    ).toBeInTheDocument();
  });

  it("renders monthly breakdown section", () => {
    render(<TimelineTab project={mockProject} />);

    expect(screen.getByText("Monthly Breakdown")).toBeInTheDocument();
    expect(
      screen.getByText(/Monthly contribution chart would be displayed/),
    ).toBeInTheDocument();
  });

  it("renders event icons", () => {
    render(<TimelineTab project={mockProject} />);

    // Check that SVG icons are rendered for each event type
    const svgIcons = document.querySelectorAll("svg");
    // At least 5 event icons
    expect(svgIcons.length).toBeGreaterThanOrEqual(5);
  });

  it("applies correct colors to event icons", () => {
    render(<TimelineTab project={mockProject} />);

    // Events have colored icons - commit events use text-primary
    const primaryElements = document.querySelectorAll(".text-primary");
    expect(primaryElements.length).toBeGreaterThan(0); // commit events

    // Merge events use text-success
    const successElements = document.querySelectorAll(".text-success");
    expect(successElements.length).toBeGreaterThan(0); // merge events
  });

  it("renders separators between events", () => {
    render(<TimelineTab project={mockProject} />);

    // 5 events should have 4 separators
    const separators = document.querySelectorAll(
      '[data-orientation="horizontal"]',
    );
    expect(separators.length).toBe(4);
  });

  it("renders all 5 sample events", () => {
    render(<TimelineTab project={mockProject} />);

    // Count event items by looking for date patterns
    const events = screen.getAllByText(/ago$/);
    expect(events.length).toBe(5);
  });
});
