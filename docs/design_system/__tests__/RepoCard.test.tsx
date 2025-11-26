import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { RepoCard } from "../RepoCard";
import { ThemeProvider } from "../../context/ThemeContext";

const renderWithTheme = (ui: React.ReactElement) => {
  return render(<ThemeProvider defaultTheme="glass">{ui}</ThemeProvider>);
};

const mockRepo = {
  name: "test-repo",
  status: "good" as const,
  stars: 42,
  commits: 150,
  contribution: 75,
  langs: [
    { name: "TypeScript", percent: 80, color: "bg-blue-400" },
    { name: "CSS", percent: 20, color: "bg-pink-400" },
  ],
};

const mockRepoWithIssues = {
  ...mockRepo,
  status: "critical" as const,
  issues: ["Security vulnerability found", "Outdated dependencies"],
};

describe("RepoCard", () => {
  it("renders repo name", () => {
    renderWithTheme(<RepoCard repo={mockRepo} />);
    expect(screen.getByText("test-repo")).toBeInTheDocument();
  });

  it("renders commit count", () => {
    renderWithTheme(<RepoCard repo={mockRepo} />);
    expect(screen.getByText("150 commits")).toBeInTheDocument();
  });

  it("renders star count when > 0", () => {
    renderWithTheme(<RepoCard repo={mockRepo} />);
    expect(screen.getByText("42")).toBeInTheDocument();
  });

  it("does not render stars when 0", () => {
    renderWithTheme(<RepoCard repo={{ ...mockRepo, stars: 0 }} />);
    expect(screen.queryByText("0")).not.toBeInTheDocument();
  });

  it("renders languages", () => {
    renderWithTheme(<RepoCard repo={mockRepo} />);
    expect(screen.getByText(/TypeScript 80%/)).toBeInTheDocument();
    expect(screen.getByText(/CSS 20%/)).toBeInTheDocument();
  });

  it("renders contribution percentage", () => {
    renderWithTheme(<RepoCard repo={mockRepo} />);
    expect(screen.getByText(/75% contribution/)).toBeInTheDocument();
  });

  it("calls onClick when clicked", () => {
    const handleClick = vi.fn();
    renderWithTheme(<RepoCard repo={mockRepo} onClick={handleClick} />);

    fireEvent.click(screen.getByRole("button"));
    expect(handleClick).toHaveBeenCalled();
  });

  it("handles keyboard Enter", () => {
    const handleClick = vi.fn();
    renderWithTheme(<RepoCard repo={mockRepo} onClick={handleClick} />);

    fireEvent.keyDown(screen.getByRole("button"), { key: "Enter" });
    expect(handleClick).toHaveBeenCalled();
  });

  it("handles keyboard Space", () => {
    const handleClick = vi.fn();
    renderWithTheme(<RepoCard repo={mockRepo} onClick={handleClick} />);

    fireEvent.keyDown(screen.getByRole("button"), { key: " " });
    expect(handleClick).toHaveBeenCalled();
  });

  it("shows expanded content when expanded", () => {
    renderWithTheme(<RepoCard repo={mockRepo} expanded />);
    expect(screen.getByText("Your Contribution")).toBeInTheDocument();
    expect(screen.getByText("Full Project")).toBeInTheDocument();
    expect(screen.getByText("GitHub")).toBeInTheDocument();
    expect(screen.getByText("AI Analysis")).toBeInTheDocument();
  });

  it("shows issues in flagged only mode", () => {
    renderWithTheme(<RepoCard repo={mockRepoWithIssues} showFlaggedOnly />);
    // Issues are rendered with "• " prefix
    expect(screen.getByText(/Security vulnerability found/)).toBeInTheDocument();
    expect(screen.getByText(/Outdated dependencies/)).toBeInTheDocument();
  });

  it("shows issues alert when expanded with issues", () => {
    renderWithTheme(<RepoCard repo={mockRepoWithIssues} expanded />);
    expect(screen.getByText("Issues detected")).toBeInTheDocument();
  });

  it("calls onGitHubClick when GitHub button clicked", () => {
    const handleGitHubClick = vi.fn();
    renderWithTheme(
      <RepoCard repo={mockRepo} expanded onGitHubClick={handleGitHubClick} />
    );

    fireEvent.click(screen.getByText("GitHub"));
    expect(handleGitHubClick).toHaveBeenCalled();
  });

  it("calls onAnalysisClick when AI Analysis button clicked", () => {
    const handleAnalysisClick = vi.fn();
    renderWithTheme(
      <RepoCard repo={mockRepo} expanded onAnalysisClick={handleAnalysisClick} />
    );

    fireEvent.click(screen.getByText("AI Analysis"));
    expect(handleAnalysisClick).toHaveBeenCalled();
  });

  it("applies custom className", () => {
    const { container } = renderWithTheme(
      <RepoCard repo={mockRepo} className="custom-class" />
    );
    expect(container.querySelector(".custom-class")).toBeInTheDocument();
  });
});
