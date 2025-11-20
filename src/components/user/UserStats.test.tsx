import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { UserStats } from "./UserStats";

const mockStats = {
  repositories: 42,
  followers: 1234,
  following: 89,
  gists: 15,
};

describe("UserStats", () => {
  describe("Rendering", () => {
    it("should render all 4 stat cards", () => {
      render(<UserStats stats={mockStats} />);
      expect(screen.getByText("Repositories")).toBeInTheDocument();
      expect(screen.getByText("Followers")).toBeInTheDocument();
      expect(screen.getByText("Following")).toBeInTheDocument();
      expect(screen.getByText("Gists")).toBeInTheDocument();
    });

    it("should display correct values for each stat", () => {
      render(<UserStats stats={mockStats} />);
      expect(screen.getByText("42")).toBeInTheDocument();
      expect(screen.getByText("1,234")).toBeInTheDocument();
      expect(screen.getByText("89")).toBeInTheDocument();
      expect(screen.getByText("15")).toBeInTheDocument();
    });

    it("should use StatsCard component", () => {
      const { container } = render(<UserStats stats={mockStats} />);
      const cards = container.querySelectorAll('[data-slot="card"]');
      expect(cards).toHaveLength(4);
    });

    it("should have responsive grid layout", () => {
      const { container } = render(<UserStats stats={mockStats} />);
      const grid = container.firstChild;
      expect(grid).toHaveClass("grid", "grid-cols-2", "md:grid-cols-4");
    });
  });

  describe("Zero Values", () => {
    it("should handle zero stats", () => {
      const zeroStats = {
        repositories: 0,
        followers: 0,
        following: 0,
        gists: 0,
      };
      render(<UserStats stats={zeroStats} />);
      const zeroValues = screen.getAllByText("0");
      expect(zeroValues).toHaveLength(4);
    });
  });

  describe("Large Numbers", () => {
    it("should display large numbers correctly", () => {
      const largeStats = {
        repositories: 1250,
        followers: 128450,
        following: 3456,
        gists: 789,
      };
      render(<UserStats stats={largeStats} />);
      expect(screen.getByText("1,250")).toBeInTheDocument();
      expect(screen.getByText("128,450")).toBeInTheDocument();
      expect(screen.getByText("3,456")).toBeInTheDocument();
      expect(screen.getByText("789")).toBeInTheDocument();
    });
  });

  describe("Icons", () => {
    it("should render icons for each stat", () => {
      const { container } = render(<UserStats stats={mockStats} />);
      const icons = container.querySelectorAll("svg");
      expect(icons.length).toBeGreaterThanOrEqual(4);
    });
  });

  describe("Order", () => {
    it("should render stats in correct order", () => {
      const { container } = render(<UserStats stats={mockStats} />);
      const titles = container.querySelectorAll('[data-slot="card-title"]');
      expect(titles[0]).toHaveTextContent("Repositories");
      expect(titles[1]).toHaveTextContent("Followers");
      expect(titles[2]).toHaveTextContent("Following");
      expect(titles[3]).toHaveTextContent("Gists");
    });
  });
});
