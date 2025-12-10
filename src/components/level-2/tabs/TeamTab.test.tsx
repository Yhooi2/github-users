import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { ProjectForModal } from "../ProjectAnalyticsModal";
import { TeamTab } from "./TeamTab";

const mockProject: ProjectForModal = {
  id: "test-id",
  name: "test-repo",
  description: "A test repository",
  url: "https://github.com/test/test-repo",
  stars: 1250,
  forks: 340,
};

describe("TeamTab", () => {
  it("renders team overview with total contributors", () => {
    render(<TeamTab project={mockProject} />);

    expect(screen.getByText("24")).toBeInTheDocument();
    expect(screen.getByText("Total Contributors")).toBeInTheDocument();
  });

  it("renders top contributors section", () => {
    render(<TeamTab project={mockProject} />);

    expect(screen.getByText("Top Contributors")).toBeInTheDocument();
  });

  it("displays contributor names and usernames", () => {
    render(<TeamTab project={mockProject} />);

    // Check first contributor
    expect(screen.getByText("Alice Smith")).toBeInTheDocument();
    expect(screen.getByText("@alice")).toBeInTheDocument();

    // Check other contributors
    expect(screen.getByText("Bob Johnson")).toBeInTheDocument();
    expect(screen.getByText("Charlie Brown")).toBeInTheDocument();
  });

  it("displays contributor commit counts", () => {
    render(<TeamTab project={mockProject} />);

    expect(screen.getByText("542 commits")).toBeInTheDocument();
    expect(screen.getByText("347 commits")).toBeInTheDocument();
    expect(screen.getByText("289 commits")).toBeInTheDocument();
  });

  it("renders contributor avatars", () => {
    render(<TeamTab project={mockProject} />);

    // Avatars use fallback spans with initials (images don't load in test)
    const avatarFallbacks = document.querySelectorAll(
      '[data-slot="avatar-fallback"]',
    );
    expect(avatarFallbacks.length).toBeGreaterThan(0);
  });

  it("renders collaboration stats section", () => {
    render(<TeamTab project={mockProject} />);

    expect(screen.getByText("Collaboration")).toBeInTheDocument();
    expect(screen.getByText("PRs Reviewed")).toBeInTheDocument();
    expect(screen.getByText("Issues Closed")).toBeInTheDocument();
    expect(screen.getByText("Discussions")).toBeInTheDocument();
  });

  it("displays collaboration metrics values", () => {
    render(<TeamTab project={mockProject} />);

    expect(screen.getByText("156")).toBeInTheDocument(); // PRs Reviewed
    expect(screen.getByText("89")).toBeInTheDocument(); // Issues Closed
    expect(screen.getByText("42")).toBeInTheDocument(); // Discussions
  });

  it("shows overflow indicator for extra contributors", () => {
    render(<TeamTab project={mockProject} />);

    // Should show +18 for remaining contributors (24 - 6)
    expect(screen.getByText("+18")).toBeInTheDocument();
  });

  it("renders progress bars for each contributor", () => {
    render(<TeamTab project={mockProject} />);

    const progressBars = document.querySelectorAll('[role="progressbar"]');
    // 5 contributors = 5 progress bars
    expect(progressBars.length).toBe(5);
  });

  it("displays ranking numbers for contributors", () => {
    render(<TeamTab project={mockProject} />);

    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("4")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
  });
});
