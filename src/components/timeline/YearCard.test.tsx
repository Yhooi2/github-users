import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import type { YearData } from "@/hooks/useUserAnalytics";
import { YearCard } from "./YearCard";

// Mock framer-motion to avoid animation issues in tests
vi.mock("framer-motion", () => ({
  motion: {
    button: ({
      children,
      ...props
    }: React.ButtonHTMLAttributes<HTMLButtonElement> & {
      children: React.ReactNode;
    }) => <button {...props}>{children}</button>,
    div: ({
      children,
      ...props
    }: React.HTMLAttributes<HTMLDivElement> & { children: React.ReactNode }) => (
      <div {...props}>{children}</div>
    ),
  },
}));

// Mock useReducedMotion hook
vi.mock("@/hooks", () => ({
  useReducedMotion: () => false,
}));

// Helper to create mock year data
const createMockYearData = (
  year: number,
  commits: number,
  ownedCount: number = 2,
  contribCount: number = 3
): YearData => ({
  year,
  totalCommits: commits,
  totalPRs: Math.floor(commits / 10),
  totalIssues: Math.floor(commits / 15),
  totalReviews: Math.floor(commits / 5),
  ownedRepos: Array.from({ length: ownedCount }, (_, i) => ({
    contributions: { totalCount: Math.floor(commits / (ownedCount + 1)) },
    repository: {
      id: `owned-${year}-${i}`,
      name: `project-${i + 1}`,
      nameWithOwner: `user/project-${i + 1}`,
      url: `https://github.com/user/project-${i + 1}`,
      description: "Test project",
      createdAt: `${year}-01-01T00:00:00Z`,
      updatedAt: `${year}-12-01T00:00:00Z`,
      pushedAt: `${year}-12-01T00:00:00Z`,
      stargazerCount: 100,
      forkCount: 10,
      isFork: false,
      isTemplate: false,
      isArchived: false,
      isPrivate: false,
      diskUsage: 1000,
      homepageUrl: null,
      primaryLanguage: { name: "TypeScript", color: "#3178c6" },
      owner: { login: "user", avatarUrl: "https://github.com/user.png" },
      parent: null,
      watchers: { totalCount: 10 },
      issues: { totalCount: 5 },
      repositoryTopics: { nodes: [] },
      languages: { totalSize: 1000, edges: [] },
      licenseInfo: null,
      defaultBranchRef: null,
    },
  })),
  contributions: Array.from({ length: contribCount }, (_, i) => ({
    contributions: { totalCount: Math.floor(commits / (contribCount + 3)) },
    repository: {
      id: `contrib-${year}-${i}`,
      name: `oss-lib-${i + 1}`,
      nameWithOwner: `org/oss-lib-${i + 1}`,
      url: `https://github.com/org/oss-lib-${i + 1}`,
      description: "Open source library",
      createdAt: `${year - 2}-01-01T00:00:00Z`,
      updatedAt: `${year}-12-01T00:00:00Z`,
      pushedAt: `${year}-12-01T00:00:00Z`,
      stargazerCount: 1000,
      forkCount: 100,
      isFork: false,
      isTemplate: false,
      isArchived: false,
      isPrivate: false,
      diskUsage: 5000,
      homepageUrl: null,
      primaryLanguage: { name: "JavaScript", color: "#f1e05a" },
      owner: { login: "org", avatarUrl: "https://github.com/org.png" },
      parent: null,
      watchers: { totalCount: 50 },
      issues: { totalCount: 25 },
      repositoryTopics: { nodes: [] },
      languages: { totalSize: 5000, edges: [] },
      licenseInfo: null,
      defaultBranchRef: null,
    },
  })),
});

describe("YearCard", () => {
  const defaultProps = {
    year: createMockYearData(2024, 500),
    maxCommits: 1000,
    isSelected: false,
    onSelect: vi.fn(),
  };

  it("renders year label", () => {
    render(<YearCard {...defaultProps} />);

    expect(screen.getByText("2024")).toBeInTheDocument();
  });

  it("renders commit count with locale formatting", () => {
    render(<YearCard {...defaultProps} />);

    // New component uses icons with just numbers (no "commits" text)
    // 500 renders as "500" (locale formatted)
    expect(screen.getByText("500")).toBeInTheDocument();
  });

  it("renders PR count", () => {
    render(<YearCard {...defaultProps} />);

    // PRs = 500 / 10 = 50, displayed as just the number
    expect(screen.getByText("50")).toBeInTheDocument();
  });

  it("renders repository count", () => {
    render(<YearCard {...defaultProps} />);

    // 2 owned + 3 contributions = 5 repos, displayed as just the number
    expect(screen.getByText("5")).toBeInTheDocument();
  });

  it("calls onSelect when clicked", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();

    render(<YearCard {...defaultProps} onSelect={onSelect} />);

    await user.click(screen.getByRole("button"));

    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it("has correct aria-pressed attribute when selected", () => {
    render(<YearCard {...defaultProps} isSelected={true} />);

    expect(screen.getByRole("button")).toHaveAttribute("aria-pressed", "true");
  });

  it("has correct aria-pressed attribute when not selected", () => {
    render(<YearCard {...defaultProps} isSelected={false} />);

    expect(screen.getByRole("button")).toHaveAttribute("aria-pressed", "false");
  });

  it("has accessible label with year info", () => {
    render(<YearCard {...defaultProps} />);

    const button = screen.getByRole("button");
    expect(button).toHaveAttribute(
      "aria-label",
      expect.stringContaining("2024")
    );
    expect(button).toHaveAttribute(
      "aria-label",
      expect.stringContaining("500 commits")
    );
  });

  it("formats large numbers with locale string", () => {
    const highActivityYear = createMockYearData(2024, 1500);
    render(
      <YearCard
        {...defaultProps}
        year={highActivityYear}
        maxCommits={1500}
      />
    );

    // Large numbers are formatted with locale (1500 -> "1,500")
    expect(screen.getByText("1,500")).toBeInTheDocument();
  });

  it("applies selected styles when isSelected is true", () => {
    render(<YearCard {...defaultProps} isSelected={true} />);

    const button = screen.getByRole("button");
    expect(button.className).toContain("border-primary");
    expect(button.className).toContain("ring-2");
  });

  it("renders icons for metrics", () => {
    const { container } = render(<YearCard {...defaultProps} />);

    // Icons should be rendered (hidden from accessibility)
    const icons = container.querySelectorAll('[aria-hidden="true"]');
    expect(icons.length).toBeGreaterThanOrEqual(3); // Commit, PR, Repo icons
  });
});
