import { mockContributionRepositories } from "@/test/mocks/github-data";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { RecentActivity } from "./RecentActivity";

// Use centralized mock factory (Week 4 P3: Mock data consolidation)
const mockRepositories = mockContributionRepositories;

describe("RecentActivity", () => {
  describe("Rendering", () => {
    it("should render title", () => {
      render(<RecentActivity repositories={mockRepositories} />);
      expect(screen.getByText("Recent Activity")).toBeInTheDocument();
    });

    it("should render all repository names", () => {
      render(<RecentActivity repositories={mockRepositories} />);
      expect(screen.getByText("awesome-project")).toBeInTheDocument();
      expect(screen.getByText("web-app")).toBeInTheDocument();
      expect(screen.getByText("mobile-client")).toBeInTheDocument();
      expect(screen.getByText("api-server")).toBeInTheDocument();
      expect(screen.getByText("documentation")).toBeInTheDocument();
    });

    it('should render commit counts with "commits" label', () => {
      render(<RecentActivity repositories={mockRepositories} />);
      expect(screen.getByText("127 commits")).toBeInTheDocument();
      expect(screen.getByText("89 commits")).toBeInTheDocument();
      expect(screen.getByText("56 commits")).toBeInTheDocument();
      expect(screen.getByText("43 commits")).toBeInTheDocument();
      expect(screen.getByText("21 commits")).toBeInTheDocument();
    });

    it("should render nothing when repositories array is empty", () => {
      const { container } = render(<RecentActivity repositories={[]} />);
      expect(container.firstChild).toBeNull();
    });
  });

  describe("Max Items", () => {
    it("should limit to 5 items by default", () => {
      const manyRepos = [
        ...mockRepositories,
        { repository: { name: "extra-1" }, contributions: { totalCount: 10 } },
        { repository: { name: "extra-2" }, contributions: { totalCount: 5 } },
      ];
      render(<RecentActivity repositories={manyRepos} />);
      expect(screen.getByText("awesome-project")).toBeInTheDocument();
      expect(screen.queryByText("extra-1")).not.toBeInTheDocument();
      expect(screen.queryByText("extra-2")).not.toBeInTheDocument();
    });

    it("should respect custom maxItems", () => {
      render(<RecentActivity repositories={mockRepositories} maxItems={3} />);
      expect(screen.getByText("awesome-project")).toBeInTheDocument();
      expect(screen.getByText("web-app")).toBeInTheDocument();
      expect(screen.getByText("mobile-client")).toBeInTheDocument();
      expect(screen.queryByText("api-server")).not.toBeInTheDocument();
      expect(screen.queryByText("documentation")).not.toBeInTheDocument();
    });

    it("should show all repos when maxItems exceeds array length", () => {
      const threeRepos = mockRepositories.slice(0, 3);
      render(<RecentActivity repositories={threeRepos} maxItems={10} />);
      expect(screen.getByText("awesome-project")).toBeInTheDocument();
      expect(screen.getByText("web-app")).toBeInTheDocument();
      expect(screen.getByText("mobile-client")).toBeInTheDocument();
    });
  });

  describe("Number Formatting", () => {
    it("should format large commit counts with commas", () => {
      const largeCommits = [
        {
          repository: { name: "big-project" },
          contributions: { totalCount: 12456 },
        },
      ];
      render(<RecentActivity repositories={largeCommits} />);
      expect(screen.getByText("12,456 commits")).toBeInTheDocument();
    });
  });

  describe("Single Repository", () => {
    it("should render single repository", () => {
      const singleRepo = [mockRepositories[0]];
      render(<RecentActivity repositories={singleRepo} />);
      expect(screen.getByText("awesome-project")).toBeInTheDocument();
      expect(screen.getByText("127 commits")).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("should handle repository with 1 commit", () => {
      const oneCommit = [
        { repository: { name: "test-repo" }, contributions: { totalCount: 1 } },
      ];
      render(<RecentActivity repositories={oneCommit} />);
      expect(screen.getByText("1 commits")).toBeInTheDocument();
    });

    it("should handle repository with 0 commits", () => {
      const zeroCommits = [
        {
          repository: { name: "empty-repo" },
          contributions: { totalCount: 0 },
        },
      ];
      render(<RecentActivity repositories={zeroCommits} />);
      expect(screen.getByText("0 commits")).toBeInTheDocument();
    });

    it("should handle long repository names", () => {
      const longName = [
        {
          repository: {
            name: "very-long-repository-name-that-might-cause-layout-issues",
          },
          contributions: { totalCount: 100 },
        },
      ];
      render(<RecentActivity repositories={longName} />);
      expect(
        screen.getByText(
          "very-long-repository-name-that-might-cause-layout-issues",
        ),
      ).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("should have aria-hidden on decorative icon", () => {
      const { container } = render(
        <RecentActivity repositories={mockRepositories} />,
      );
      const icon = container.querySelector('[aria-hidden="true"]');
      expect(icon).toBeInTheDocument();
    });

    it("should use semantic card structure", () => {
      const { container } = render(
        <RecentActivity repositories={mockRepositories} />,
      );
      const card = container.querySelector('[data-slot="card"]');
      expect(card).toBeInTheDocument();
    });
  });

  describe("Styling", () => {
    it("should apply hover effect to repository items", () => {
      const { container } = render(
        <RecentActivity repositories={mockRepositories} />,
      );
      const items = container.querySelectorAll(".hover\\:bg-accent");
      expect(items).toHaveLength(5);
    });
  });
});
