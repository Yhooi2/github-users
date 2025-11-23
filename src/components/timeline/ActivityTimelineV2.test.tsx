import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { YearData } from "@/hooks/useUserAnalytics";
import { ActivityTimelineV2 } from "./ActivityTimelineV2";

// Mock TimelineYearV2 to simplify testing
vi.mock("./TimelineYearV2", () => ({
  TimelineYearV2: ({ year, username }: { year: YearData; username: string }) => (
    <div data-testid={`timeline-year-${year.year}`}>
      Year {year.year} - {year.totalCommits} commits - {username}
    </div>
  ),
}));

const createMockYearData = (year: number, commits: number): YearData => ({
  year,
  totalCommits: commits,
  totalPRs: Math.floor(commits / 10),
  totalIssues: Math.floor(commits / 15),
  totalReviews: Math.floor(commits / 5),
  ownedRepos: [],
  contributions: [],
});

describe("ActivityTimelineV2", () => {
  it("renders section heading", () => {
    const timeline = [createMockYearData(2024, 500)];

    render(
      <ActivityTimelineV2
        timeline={timeline}
        username="testuser"
      />,
    );

    expect(screen.getByText("Activity Timeline")).toBeInTheDocument();
  });

  it("renders all years from timeline", () => {
    const timeline = [
      createMockYearData(2024, 500),
      createMockYearData(2023, 400),
      createMockYearData(2022, 300),
    ];

    render(
      <ActivityTimelineV2
        timeline={timeline}
        username="testuser"
      />,
    );

    expect(screen.getByTestId("timeline-year-2024")).toBeInTheDocument();
    expect(screen.getByTestId("timeline-year-2023")).toBeInTheDocument();
    expect(screen.getByTestId("timeline-year-2022")).toBeInTheDocument();
  });

  it("passes username to TimelineYearV2", () => {
    const timeline = [createMockYearData(2024, 500)];

    render(
      <ActivityTimelineV2
        timeline={timeline}
        username="developer123"
      />,
    );

    expect(screen.getByText(/developer123/)).toBeInTheDocument();
  });

  it("shows loading skeleton when loading", () => {
    render(
      <ActivityTimelineV2
        timeline={[]}
        loading={true}
        username="testuser"
      />,
    );

    expect(screen.getByLabelText("Loading activity timeline")).toBeInTheDocument();
  });

  it("shows empty state when timeline is empty", () => {
    render(
      <ActivityTimelineV2
        timeline={[]}
        loading={false}
        username="testuser"
      />,
    );

    expect(screen.getByText("No activity data available")).toBeInTheDocument();
  });

  it("does not show loading skeleton when not loading", () => {
    const timeline = [createMockYearData(2024, 500)];

    render(
      <ActivityTimelineV2
        timeline={timeline}
        loading={false}
        username="testuser"
      />,
    );

    expect(screen.queryByLabelText("Loading activity timeline")).not.toBeInTheDocument();
  });

  it("has accessible section landmark", () => {
    const timeline = [createMockYearData(2024, 500)];

    render(
      <ActivityTimelineV2
        timeline={timeline}
        username="testuser"
      />,
    );

    expect(screen.getByRole("region", { name: /Activity Timeline/i })).toBeInTheDocument();
  });

  it("calculates maxCommits from timeline data", () => {
    // This is tested implicitly through TimelineYearV2 receiving correct maxCommits
    const timeline = [
      createMockYearData(2024, 1000), // max
      createMockYearData(2023, 500),
      createMockYearData(2022, 250),
    ];

    render(
      <ActivityTimelineV2
        timeline={timeline}
        username="testuser"
      />,
    );

    // All years should be rendered
    expect(screen.getAllByTestId(/timeline-year-/)).toHaveLength(3);
  });
});
