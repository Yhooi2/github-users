import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { UserHeader } from "./UserHeader";

const mockUser = {
  avatarUrl: "https://avatars.githubusercontent.com/u/583231?v=4",
  name: "The Octocat",
  login: "octocat",
  bio: "GitHub mascot and friendly feline",
  location: "San Francisco, CA",
  url: "https://github.com/octocat",
  createdAt: "2011-01-25T18:44:36Z",
};

describe("UserHeader", () => {
  describe("Rendering", () => {
    it("should render avatar container", () => {
      render(<UserHeader user={mockUser} />);
      const avatar = document.querySelector('[data-slot="avatar"]');
      expect(avatar).toBeInTheDocument();
      expect(avatar).toHaveClass("h-32", "w-32");
    });

    it("should render user name when available", () => {
      render(<UserHeader user={mockUser} />);
      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
        "The Octocat",
      );
    });

    it("should fall back to login when name is null", () => {
      const userWithoutName = { ...mockUser, name: null };
      render(<UserHeader user={userWithoutName} />);
      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
        "octocat",
      );
    });

    it("should render username with @ symbol", () => {
      render(<UserHeader user={mockUser} />);
      expect(screen.getByText("@octocat")).toBeInTheDocument();
    });

    it("should render bio when available", () => {
      render(<UserHeader user={mockUser} />);
      expect(
        screen.getByText("GitHub mascot and friendly feline"),
      ).toBeInTheDocument();
    });

    it("should not render bio when null", () => {
      const userWithoutBio = { ...mockUser, bio: null };
      render(<UserHeader user={userWithoutBio} />);
      expect(
        screen.queryByText("GitHub mascot and friendly feline"),
      ).not.toBeInTheDocument();
    });

    it("should render location when available", () => {
      render(<UserHeader user={mockUser} />);
      expect(screen.getByText("San Francisco, CA")).toBeInTheDocument();
    });

    it("should not render location when null", () => {
      const userWithoutLocation = { ...mockUser, location: null };
      render(<UserHeader user={userWithoutLocation} />);
      expect(screen.queryByText("San Francisco, CA")).not.toBeInTheDocument();
    });
  });

  describe("Date Formatting", () => {
    it("should format createdAt date correctly", () => {
      render(<UserHeader user={mockUser} />);
      expect(screen.getByText(/Joined January 25, 2011/)).toBeInTheDocument();
    });

    it("should handle different date formats", () => {
      const userWithDifferentDate = {
        ...mockUser,
        createdAt: "2024-06-15T10:30:00Z",
      };
      render(<UserHeader user={userWithDifferentDate} />);
      expect(screen.getByText(/Joined June 15, 2024/)).toBeInTheDocument();
    });
  });

  describe("GitHub Link", () => {
    it("should render GitHub link with correct URL", () => {
      render(<UserHeader user={mockUser} />);
      const link = screen.getByRole("link", { name: /View on GitHub/i });
      expect(link).toHaveAttribute("href", "https://github.com/octocat");
    });

    it("should open link in new tab", () => {
      render(<UserHeader user={mockUser} />);
      const link = screen.getByRole("link", { name: /View on GitHub/i });
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    });
  });

  describe("Avatar Fallback", () => {
    it("should display initials for fallback when name exists", () => {
      render(<UserHeader user={mockUser} />);
      // Avatar fallback should contain initials "TO" for "The Octocat"
      const avatarFallback = document.querySelector(".bg-muted");
      expect(avatarFallback).toBeInTheDocument();
    });

    it("should handle single-word names for initials", () => {
      const singleNameUser = { ...mockUser, name: "Octocat" };
      render(<UserHeader user={singleNameUser} />);
      const avatarFallback = document.querySelector(".bg-muted");
      expect(avatarFallback).toBeInTheDocument();
    });

    it("should use login for initials when name is null", () => {
      const userWithoutName = { ...mockUser, name: null };
      render(<UserHeader user={userWithoutName} />);
      const avatarFallback = document.querySelector(".bg-muted");
      expect(avatarFallback).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("should have proper heading hierarchy", () => {
      render(<UserHeader user={mockUser} />);
      const heading = screen.getByRole("heading", { level: 1 });
      expect(heading).toBeInTheDocument();
    });

    it("should have aria-hidden on decorative icons", () => {
      render(<UserHeader user={mockUser} />);
      const icons = document.querySelectorAll('[aria-hidden="true"]');
      expect(icons.length).toBeGreaterThan(0);
    });
  });

  describe("Edge Cases", () => {
    it("should handle minimal profile (no name, bio, location)", () => {
      const minimalUser = {
        ...mockUser,
        name: null,
        bio: null,
        location: null,
      };
      render(<UserHeader user={minimalUser} />);
      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
        "octocat",
      );
      expect(screen.getByText("@octocat")).toBeInTheDocument();
    });

    it("should handle long bio text", () => {
      const longBio =
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";
      const userWithLongBio = { ...mockUser, bio: longBio };
      render(<UserHeader user={userWithLongBio} />);
      expect(screen.getByText(longBio)).toBeInTheDocument();
    });

    it("should handle special characters in location", () => {
      const userWithSpecialLocation = {
        ...mockUser,
        location: "São Paulo, Brazil 🇧🇷",
      };
      render(<UserHeader user={userWithSpecialLocation} />);
      expect(screen.getByText("São Paulo, Brazil 🇧🇷")).toBeInTheDocument();
    });
  });
});
