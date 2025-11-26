import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import App from "./App";
import type { YearData } from "./hooks/useUserAnalytics";

// Mock useUserAnalytics hook
const mockUseUserAnalytics = vi.fn();
vi.mock("./hooks/useUserAnalytics", () => ({
  useUserAnalytics: () => mockUseUserAnalytics(),
}));

// Mock child components
vi.mock("./components/layout/SearchHeader", () => ({
  SearchHeader: ({
    userName,
    onSearch,
  }: {
    userName: string;
    onSearch: (name: string) => void;
  }) => (
    <div data-testid="search-header">
      <input
        data-testid="search-input"
        value={userName}
        onChange={(e) => onSearch(e.target.value)}
        placeholder="Search GitHub User..."
      />
      <button data-testid="search-button" onClick={() => onSearch(userName)}>
        Search
      </button>
    </div>
  ),
}));

vi.mock("./components/UserProfile", () => ({
  default: () => <div data-testid="user-profile">User Profile</div>,
}));

vi.mock("./components/assessment/MetricAssessmentGrid", () => ({
  MetricAssessmentGrid: () => (
    <div data-testid="metric-assessment-grid">Metric Assessment Grid</div>
  ),
}));

vi.mock("./components/timeline/ActivityTimelineV2", () => ({
  ActivityTimelineV2: () => (
    <div data-testid="activity-timeline">Activity Timeline V2</div>
  ),
}));

// ProjectSection removed - projects now shown in ActivityTimelineV2

vi.mock("./components/layout/RateLimitBanner", () => ({
  RateLimitBanner: () => (
    <div data-testid="rate-limit-banner">Rate Limit Banner</div>
  ),
}));

vi.mock("./components/auth/AuthRequiredModal", () => ({
  AuthRequiredModal: () => <div data-testid="auth-modal">Auth Modal</div>,
}));

vi.mock("./components/layout/ErrorBoundary", () => ({
  ErrorBoundary: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

// Mock sonner toast
vi.mock("sonner", () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
  Toaster: () => null,
}));

describe("App Integration Tests - Phase 5 Single Page Layout", () => {
  const mockProfile = {
    id: "1",
    login: "testuser",
    name: "Test User",
    avatarUrl: "https://avatar.url",
    bio: "Test bio",
    url: "https://github.com/testuser",
    location: "Test Location",
    createdAt: "2020-01-01T00:00:00Z",
    followers: { totalCount: 100 },
    following: { totalCount: 50 },
    gists: { totalCount: 10 },
  };

  const mockTimeline: YearData[] = [
    {
      year: 2024,
      totalCommits: 250,
      totalIssues: 30,
      totalPRs: 40,
      totalReviews: 20,
      ownedRepos: [],
      contributions: [],
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Basic Rendering", () => {
    it("should render search header on initial load", () => {
      mockUseUserAnalytics.mockReturnValue({
        profile: null,
        timeline: [],
        loading: false,
        error: undefined,
      });

      render(<App />);

      expect(screen.getByTestId("search-header")).toBeInTheDocument();
      expect(screen.getByTestId("search-input")).toBeInTheDocument();
    });

    it("should not show content sections before search", () => {
      mockUseUserAnalytics.mockReturnValue({
        profile: null,
        timeline: [],
        loading: false,
        error: undefined,
      });

      render(<App />);

      expect(screen.queryByTestId("user-profile")).not.toBeInTheDocument();
      expect(screen.queryByTestId("metric-assessment-grid")).not.toBeInTheDocument();
      expect(screen.queryByTestId("activity-timeline")).not.toBeInTheDocument();
    });

    it("should render rate limit banner", () => {
      mockUseUserAnalytics.mockReturnValue({
        profile: null,
        timeline: [],
        loading: false,
        error: undefined,
      });

      render(<App />);

      expect(screen.getByTestId("rate-limit-banner")).toBeInTheDocument();
    });

    it("should render auth modal", () => {
      mockUseUserAnalytics.mockReturnValue({
        profile: null,
        timeline: [],
        loading: false,
        error: undefined,
      });

      render(<App />);

      expect(screen.getByTestId("auth-modal")).toBeInTheDocument();
    });
  });

  describe("Search Flow", () => {
    it("should show all sections after successful user search", async () => {
      mockUseUserAnalytics.mockReturnValue({
        profile: mockProfile,
        timeline: mockTimeline,
        loading: false,
        error: undefined,
      });

      const user = userEvent.setup();
      render(<App />);

      const input = screen.getByTestId("search-input");
      await user.type(input, "testuser");

      // Wait for all sections to appear (ProjectSection removed - merged into ActivityTimelineV2)
      await waitFor(() => {
        expect(screen.getByTestId("user-profile")).toBeInTheDocument();
        expect(screen.getByTestId("metric-assessment-grid")).toBeInTheDocument();
        expect(screen.getByTestId("activity-timeline")).toBeInTheDocument();
      });
    });

    it("should display loading state during search", async () => {
      mockUseUserAnalytics.mockReturnValue({
        profile: null,
        timeline: [],
        loading: true,
        error: undefined,
      });

      const user = userEvent.setup();
      render(<App />);

      const input = screen.getByTestId("search-input");
      await user.type(input, "testuser");

      // Should show UserProfile for loading indication
      await waitFor(() => {
        expect(screen.getByTestId("user-profile")).toBeInTheDocument();
      });

      // Should not show other sections while loading
      expect(screen.queryByTestId("metric-assessment-grid")).not.toBeInTheDocument();
    });

    it("should handle search errors gracefully", async () => {
      const error = {
        message: "User not found",
        graphQLErrors: [],
        clientErrors: [],
        networkError: null,
        extraInfo: undefined,
        name: "ApolloError",
      };

      mockUseUserAnalytics.mockReturnValue({
        profile: null,
        timeline: [],
        loading: false,
        error,
      });

      const user = userEvent.setup();
      render(<App />);

      const input = screen.getByTestId("search-input");
      await user.type(input, "invaliduser");

      // Should show error message
      await waitFor(() => {
        expect(screen.getByText(/error.*user not found/i)).toBeInTheDocument();
      });

      // Should not show content sections
      expect(screen.queryByTestId("metric-assessment-grid")).not.toBeInTheDocument();
    });
  });

  describe("Single Page Layout", () => {
    it("should render all sections in vertical order", async () => {
      mockUseUserAnalytics.mockReturnValue({
        profile: mockProfile,
        timeline: mockTimeline,
        loading: false,
        error: undefined,
      });

      const user = userEvent.setup();
      render(<App />);

      const input = screen.getByTestId("search-input");
      await user.type(input, "testuser");

      await waitFor(() => {
        const sections = [
          screen.getByTestId("user-profile"),
          screen.getByTestId("metric-assessment-grid"),
          screen.getByTestId("activity-timeline"),
        ];

        // All sections should be visible (no tabs)
        sections.forEach((section) => {
          expect(section).toBeVisible();
        });
      });
    });

    it("should not have tab navigation", () => {
      mockUseUserAnalytics.mockReturnValue({
        profile: mockProfile,
        timeline: mockTimeline,
        loading: false,
        error: undefined,
      });

      render(<App />);

      // Old tab-based navigation should not exist
      expect(
        screen.queryByRole("tab", { name: /profile/i }),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole("tab", { name: /repositories/i }),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole("tab", { name: /statistics/i }),
      ).not.toBeInTheDocument();
      expect(screen.queryByRole("tablist")).not.toBeInTheDocument();
    });

    it("should show MetricAssessmentGrid when metrics are available", async () => {
      mockUseUserAnalytics.mockReturnValue({
        profile: mockProfile,
        timeline: mockTimeline,
        loading: false,
        error: undefined,
      });

      const user = userEvent.setup();
      render(<App />);

      const input = screen.getByTestId("search-input");
      await user.type(input, "testuser");

      await waitFor(() => {
        expect(screen.getByTestId("metric-assessment-grid")).toBeInTheDocument();
      });
    });

    it("should not show MetricAssessmentGrid when no timeline data", async () => {
      mockUseUserAnalytics.mockReturnValue({
        profile: mockProfile,
        timeline: [],
        loading: false,
        error: undefined,
      });

      const user = userEvent.setup();
      render(<App />);

      const input = screen.getByTestId("search-input");
      await user.type(input, "testuser");

      // User profile should be shown
      await waitFor(() => {
        expect(screen.getByTestId("user-profile")).toBeInTheDocument();
      });

      // MetricAssessmentGrid should not be shown without timeline data
      expect(screen.queryByTestId("metric-assessment-grid")).not.toBeInTheDocument();
    });
  });

  describe("Progressive Disclosure", () => {
    it("should show UserProfile first when data loads", async () => {
      mockUseUserAnalytics.mockReturnValue({
        profile: mockProfile,
        timeline: mockTimeline,
        loading: false,
        error: undefined,
      });

      const user = userEvent.setup();
      render(<App />);

      const input = screen.getByTestId("search-input");
      await user.type(input, "testuser");

      await waitFor(() => {
        expect(screen.getByTestId("user-profile")).toBeInTheDocument();
      });
    });

    it("should show all sections when profile and timeline are loaded", async () => {
      mockUseUserAnalytics.mockReturnValue({
        profile: mockProfile,
        timeline: mockTimeline,
        loading: false,
        error: undefined,
      });

      const user = userEvent.setup();
      render(<App />);

      const input = screen.getByTestId("search-input");
      await user.type(input, "testuser");

      await waitFor(() => {
        expect(screen.getByTestId("user-profile")).toBeInTheDocument();
        expect(screen.getByTestId("metric-assessment-grid")).toBeInTheDocument();
        expect(screen.getByTestId("activity-timeline")).toBeInTheDocument();
      });
    });
  });

  describe("Edge Cases", () => {
    it("should handle user with empty timeline", async () => {
      mockUseUserAnalytics.mockReturnValue({
        profile: mockProfile,
        timeline: [],
        loading: false,
        error: undefined,
      });

      const user = userEvent.setup();
      render(<App />);

      const input = screen.getByTestId("search-input");
      await user.type(input, "testuser");

      await waitFor(() => {
        expect(screen.getByTestId("user-profile")).toBeInTheDocument();
        expect(screen.getByTestId("activity-timeline")).toBeInTheDocument();
      });

      // MetricAssessmentGrid should not show without timeline data
      expect(screen.queryByTestId("metric-assessment-grid")).not.toBeInTheDocument();
    });

    it("should handle clearing username", async () => {
      mockUseUserAnalytics.mockReturnValue({
        profile: null,
        timeline: [],
        loading: false,
        error: undefined,
      });

      const user = userEvent.setup();
      render(<App />);

      const input = screen.getByTestId("search-input") as HTMLInputElement;

      // App has default username "Yhooi2", clear it first
      await user.clear(input);
      expect(input.value).toBe("");

      // Type new username
      await user.type(input, "testuser");
      expect(input.value).toBe("testuser");

      // Clear username
      await user.clear(input);
      expect(input.value).toBe("");

      // Content sections should not be visible when username is empty
      expect(screen.queryByTestId("user-profile")).not.toBeInTheDocument();
    });
  });
});
