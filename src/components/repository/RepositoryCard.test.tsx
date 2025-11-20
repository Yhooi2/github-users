import { createMockRepository } from "@/test/mocks/github-data";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { RepositoryCard } from "./RepositoryCard";

// Use centralized mock factory (Week 4 P3: Mock data consolidation)
const mockRepository = createMockRepository({
  id: "1",
  name: "test-repo",
  description: "A test repository description",
  url: "https://github.com/user/test-repo",
  stargazerCount: 100,
  forkCount: 20,
  updatedAt: "2024-11-05T10:00:00Z",
  pushedAt: "2024-11-05T10:00:00Z",
  diskUsage: 1000,
  watchers: { totalCount: 10 },
  issues: { totalCount: 5 },
  repositoryTopics: {
    nodes: [{ topic: { name: "react" } }, { topic: { name: "typescript" } }],
  },
  licenseInfo: { name: "MIT License" },
  defaultBranchRef: {
    target: {
      history: { totalCount: 50 },
    },
  },
  primaryLanguage: { name: "TypeScript" },
  languages: {
    totalSize: 1000,
    edges: [
      { size: 800, node: { name: "TypeScript" } },
      { size: 200, node: { name: "CSS" } },
    ],
  },
});

describe("RepositoryCard", () => {
  describe("Rendering", () => {
    it("should render repository name", () => {
      render(<RepositoryCard repository={mockRepository} />);

      expect(screen.getByText("test-repo")).toBeInTheDocument();
    });

    it("should render repository description", () => {
      render(<RepositoryCard repository={mockRepository} />);

      expect(
        screen.getByText("A test repository description"),
      ).toBeInTheDocument();
    });

    it("should render repository URL as link", () => {
      render(<RepositoryCard repository={mockRepository} />);

      const link = screen.getByRole("link", { name: /test-repo/i });
      expect(link).toHaveAttribute("href", "https://github.com/user/test-repo");
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    });

    it("should render primary language", () => {
      render(<RepositoryCard repository={mockRepository} />);

      expect(screen.getByText("TypeScript")).toBeInTheDocument();
    });

    it("should render statistics (stars, forks, watchers)", () => {
      render(<RepositoryCard repository={mockRepository} />);

      expect(screen.getByText("100")).toBeInTheDocument(); // stars
      expect(screen.getByText("20")).toBeInTheDocument(); // forks
      expect(screen.getByText("10")).toBeInTheDocument(); // watchers
    });

    it("should not render description in compact mode", () => {
      render(<RepositoryCard repository={mockRepository} compact />);

      expect(
        screen.queryByText("A test repository description"),
      ).not.toBeInTheDocument();
    });

    it("should not render watchers in compact mode", () => {
      render(<RepositoryCard repository={mockRepository} compact />);

      // Stars and forks should be visible
      expect(screen.getByText("100")).toBeInTheDocument();
      expect(screen.getByText("20")).toBeInTheDocument();

      // Watchers should not be visible (only 2 numbers, not 3)
      const numbers = screen.getAllByText(/^\d+$/);
      expect(numbers).toHaveLength(2);
    });
  });

  describe("Fork Badge", () => {
    it("should render fork badge when repository is a fork", () => {
      const forkedRepo = { ...mockRepository, isFork: true };
      render(<RepositoryCard repository={forkedRepo} />);

      const badge = screen.getByLabelText("This repository is a fork");
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveTextContent("Fork");
    });

    it("should not render fork badge when repository is not a fork", () => {
      render(<RepositoryCard repository={mockRepository} />);

      expect(
        screen.queryByLabelText("This repository is a fork"),
      ).not.toBeInTheDocument();
    });
  });

  describe("Archived Badge", () => {
    it("should render archived badge when repository is archived", () => {
      const archivedRepo = { ...mockRepository, isArchived: true };
      render(<RepositoryCard repository={archivedRepo} />);

      const badge = screen.getByLabelText("This repository is archived");
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveTextContent("Archived");
    });

    it("should not render archived badge when repository is not archived", () => {
      render(<RepositoryCard repository={mockRepository} />);

      expect(
        screen.queryByLabelText("This repository is archived"),
      ).not.toBeInTheDocument();
    });
  });

  describe("Topics", () => {
    it("should render repository topics", () => {
      render(<RepositoryCard repository={mockRepository} />);

      expect(screen.getByText("react")).toBeInTheDocument();
      expect(screen.getByText("typescript")).toBeInTheDocument();
    });

    it("should not render topics in compact mode", () => {
      render(<RepositoryCard repository={mockRepository} compact />);

      expect(screen.queryByText("react")).not.toBeInTheDocument();
      expect(screen.queryByText("typescript")).not.toBeInTheDocument();
    });

    it("should limit topics to 5 and show +N for additional topics", () => {
      const repoWithManyTopics = {
        ...mockRepository,
        repositoryTopics: {
          nodes: [
            { topic: { name: "topic1" } },
            { topic: { name: "topic2" } },
            { topic: { name: "topic3" } },
            { topic: { name: "topic4" } },
            { topic: { name: "topic5" } },
            { topic: { name: "topic6" } },
            { topic: { name: "topic7" } },
          ],
        },
      };

      render(<RepositoryCard repository={repoWithManyTopics} />);

      expect(screen.getByText("topic1")).toBeInTheDocument();
      expect(screen.getByText("topic5")).toBeInTheDocument();
      expect(screen.getByText("+2")).toBeInTheDocument(); // 7 total - 5 shown = +2
      expect(screen.queryByText("topic6")).not.toBeInTheDocument();
      expect(screen.queryByText("topic7")).not.toBeInTheDocument();
    });

    it("should not render topics section when no topics exist", () => {
      const repoNoTopics = {
        ...mockRepository,
        repositoryTopics: { nodes: [] },
      };

      render(<RepositoryCard repository={repoNoTopics} />);

      expect(
        screen.queryByRole("list", { name: "Repository topics" }),
      ).not.toBeInTheDocument();
    });
  });

  describe("Number Formatting", () => {
    it("should format numbers with K suffix for thousands", () => {
      const popularRepo = {
        ...mockRepository,
        stargazerCount: 1500,
      };

      render(<RepositoryCard repository={popularRepo} />);

      expect(screen.getByText("1.5K")).toBeInTheDocument();
    });

    it("should format numbers with M suffix for millions", () => {
      const veryPopularRepo = {
        ...mockRepository,
        stargazerCount: 1500000,
      };

      render(<RepositoryCard repository={veryPopularRepo} />);

      expect(screen.getByText("1.5M")).toBeInTheDocument();
    });

    it("should not add decimal if it is .0", () => {
      const repo = {
        ...mockRepository,
        stargazerCount: 1000,
      };

      render(<RepositoryCard repository={repo} />);

      expect(screen.getByText("1K")).toBeInTheDocument();
      expect(screen.queryByText("1.0K")).not.toBeInTheDocument();
    });

    it("should show raw number for values under 1000", () => {
      const repo = {
        ...mockRepository,
        stargazerCount: 999,
      };

      render(<RepositoryCard repository={repo} />);

      expect(screen.getByText("999")).toBeInTheDocument();
    });
  });

  describe("Click Handling", () => {
    it("should call onClick when card is clicked", async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();

      render(
        <RepositoryCard repository={mockRepository} onClick={handleClick} />,
      );

      const card = screen.getByRole("button", {
        name: /Open test-repo repository/i,
      });
      await user.click(card);

      expect(handleClick).toHaveBeenCalledWith(mockRepository);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("should call onClick when Enter key is pressed", async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();

      render(
        <RepositoryCard repository={mockRepository} onClick={handleClick} />,
      );

      const card = screen.getByRole("button", {
        name: /Open test-repo repository/i,
      });
      card.focus();
      await user.keyboard("{Enter}");

      expect(handleClick).toHaveBeenCalledWith(mockRepository);
    });

    it("should call onClick when Space key is pressed", async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();

      render(
        <RepositoryCard repository={mockRepository} onClick={handleClick} />,
      );

      const card = screen.getByRole("button", {
        name: /Open test-repo repository/i,
      });
      card.focus();
      await user.keyboard(" ");

      expect(handleClick).toHaveBeenCalledWith(mockRepository);
    });

    it("should not call onClick when repository link is clicked", async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();

      render(
        <RepositoryCard repository={mockRepository} onClick={handleClick} />,
      );

      const link = screen.getByRole("link", { name: /test-repo/i });
      await user.click(link);

      // Link click should be stopped from propagating to card
      expect(handleClick).not.toHaveBeenCalled();
    });

    it("should not be clickable when onClick is not provided", () => {
      render(<RepositoryCard repository={mockRepository} />);

      expect(screen.queryByRole("button")).not.toBeInTheDocument();
    });

    it("should have proper accessibility attributes when clickable", () => {
      const handleClick = vi.fn();
      render(
        <RepositoryCard repository={mockRepository} onClick={handleClick} />,
      );

      const card = screen.getByRole("button", {
        name: /Open test-repo repository/i,
      });
      expect(card).toHaveAttribute("tabIndex", "0");
      expect(card).toHaveAttribute("aria-label", "Open test-repo repository");
    });
  });

  describe("Edge Cases", () => {
    it("should handle null description", () => {
      const repoNoDescription = { ...mockRepository, description: null };
      render(<RepositoryCard repository={repoNoDescription} />);

      expect(screen.getByText("test-repo")).toBeInTheDocument();
      expect(screen.queryByText(/description/i)).not.toBeInTheDocument();
    });

    it("should handle null primaryLanguage", () => {
      const repoNoLanguage = { ...mockRepository, primaryLanguage: null };
      render(<RepositoryCard repository={repoNoLanguage} />);

      // Should still render other content
      expect(screen.getByText("test-repo")).toBeInTheDocument();
      expect(screen.queryByText("TypeScript")).not.toBeInTheDocument();
    });

    it('should show "Never" when updatedAt is null', () => {
      const repoNoUpdate = { ...mockRepository, updatedAt: "" };
      render(<RepositoryCard repository={repoNoUpdate} />);

      expect(screen.getByText(/Never/)).toBeInTheDocument();
    });

    it("should handle repository with both fork and archived badges", () => {
      const specialRepo = { ...mockRepository, isFork: true, isArchived: true };
      render(<RepositoryCard repository={specialRepo} />);

      expect(
        screen.getByLabelText("This repository is a fork"),
      ).toBeInTheDocument();
      expect(
        screen.getByLabelText("This repository is archived"),
      ).toBeInTheDocument();
    });
  });

  describe("Language Colors", () => {
    it("should render language color indicator", () => {
      const { container } = render(
        <RepositoryCard repository={mockRepository} />,
      );

      const colorIndicator = container.querySelector(".rounded-full");
      expect(colorIndicator).toBeInTheDocument();
      expect(colorIndicator).toHaveStyle({ backgroundColor: "#3178c6" }); // TypeScript color
    });

    it("should use default color for unknown language", () => {
      const repoUnknownLang = {
        ...mockRepository,
        primaryLanguage: { name: "UnknownLanguage" },
      };

      const { container } = render(
        <RepositoryCard repository={repoUnknownLang} />,
      );

      const colorIndicator = container.querySelector(".rounded-full");
      expect(colorIndicator).toHaveStyle({ backgroundColor: "#64748b" }); // Default color (from constants.ts)
    });
  });

  describe("Accessibility", () => {
    it("should have proper ARIA labels for statistics", () => {
      render(<RepositoryCard repository={mockRepository} />);

      // Check title attributes for stats - span is inside div with title
      const starsStat = screen.getByTitle("100 stars");
      expect(starsStat).toBeInTheDocument();
    });

    it("should have aria-hidden icons", () => {
      const { container } = render(
        <RepositoryCard repository={mockRepository} />,
      );

      const icons = container.querySelectorAll('[aria-hidden="true"]');
      expect(icons.length).toBeGreaterThan(0);
    });

    it("should have proper role for topics list", () => {
      render(<RepositoryCard repository={mockRepository} />);

      expect(
        screen.getByRole("list", { name: "Repository topics" }),
      ).toBeInTheDocument();
    });
  });
});
