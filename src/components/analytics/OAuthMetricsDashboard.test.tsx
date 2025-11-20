import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { OAuthMetricsDashboard } from "./OAuthMetricsDashboard";

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Mock metrics data
const mockMetrics = {
  period: "day",
  timestamp: Date.now(),
  metrics: {
    activeSessions: 42,
    totalLogins: 156,
    totalLogouts: 114,
    uniqueUsers: 38,
    avgSessionDuration: 7200000, // 2 hours
    rateLimit: {
      avgUsage: 1245,
      peakUsage: 3500,
      avgRemaining: 3755,
    },
  },
};

describe("OAuthMetricsDashboard", () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers(); // Always restore real timers after each test
  });

  it("renders dashboard title and description", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockMetrics,
    });

    render(<OAuthMetricsDashboard />);

    expect(screen.getByText("OAuth Analytics")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(/Last updated:/)).toBeInTheDocument();
    });
  });

  it("fetches and displays metrics on mount", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockMetrics,
    });

    render(<OAuthMetricsDashboard initialPeriod="day" />);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        "/api/analytics/oauth-usage?period=day&detailed=false",
      );
    });

    // Check Active Sessions metric
    await waitFor(() => {
      expect(screen.getByText("Active Sessions")).toBeInTheDocument();
      expect(screen.getByText("42")).toBeInTheDocument();
      expect(screen.getByText("38 unique users")).toBeInTheDocument();
    });

    // Check Total Logins metric
    expect(screen.getByText("Total Logins")).toBeInTheDocument();
    expect(screen.getByText("156")).toBeInTheDocument();

    // Check Total Logouts metric
    expect(screen.getByText("Total Logouts")).toBeInTheDocument();
    expect(screen.getByText("114")).toBeInTheDocument();
  });

  it("displays session duration in human-readable format", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockMetrics,
    });

    render(<OAuthMetricsDashboard />);

    await waitFor(() => {
      expect(screen.getByText("Avg Session")).toBeInTheDocument();
      expect(screen.getByText("2h")).toBeInTheDocument(); // 7200000ms = 2h
    });
  });

  it("displays rate limit statistics", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockMetrics,
    });

    render(<OAuthMetricsDashboard />);

    await waitFor(() => {
      expect(screen.getByText("Rate Limit Statistics")).toBeInTheDocument();
      expect(screen.getByText("Average Usage")).toBeInTheDocument();
      expect(screen.getByText("1245")).toBeInTheDocument();
      expect(screen.getByText("Peak Usage")).toBeInTheDocument();
      expect(screen.getByText("3500")).toBeInTheDocument();
      expect(screen.getByText("Average Remaining")).toBeInTheDocument();
      expect(screen.getByText("3755")).toBeInTheDocument();
    });
  });

  it("shows loading state initially", () => {
    mockFetch.mockImplementation(
      () =>
        new Promise(() => {
          // Never resolve to keep loading state
        }),
    );

    render(<OAuthMetricsDashboard />);

    expect(screen.getByText("Loading metrics...")).toBeInTheDocument();
  });

  it("shows error state on fetch failure", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      statusText: "Internal Server Error",
    });

    render(<OAuthMetricsDashboard />);

    await waitFor(() => {
      expect(screen.getByText("Failed to load metrics")).toBeInTheDocument();
      expect(screen.getByText("Error")).toBeInTheDocument();
      expect(screen.getByText(/Failed to fetch metrics:/)).toBeInTheDocument();
    });

    // Check for Retry button
    expect(screen.getByRole("button", { name: /retry/i })).toBeInTheDocument();
  });

  it("allows retrying after error", async () => {
    const user = userEvent.setup();

    // First call fails
    mockFetch.mockResolvedValueOnce({
      ok: false,
      statusText: "Service Unavailable",
    });

    render(<OAuthMetricsDashboard />);

    await waitFor(() => {
      expect(screen.getByText(/Failed to load metrics/)).toBeInTheDocument();
    });

    // Second call succeeds
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockMetrics,
    });

    const retryButton = screen.getByRole("button", { name: /retry/i });
    await user.click(retryButton);

    await waitFor(() => {
      expect(screen.getByText("42")).toBeInTheDocument();
    });

    expect(mockFetch).toHaveBeenCalledTimes(2);
  });

  it("allows changing period via select", async () => {
    const user = userEvent.setup();

    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => mockMetrics,
    });

    render(<OAuthMetricsDashboard initialPeriod="day" />);

    await waitFor(() => {
      expect(screen.getByText("42")).toBeInTheDocument();
    });

    // Open period select
    const select = screen.getByRole("combobox");
    await user.click(select);

    // Select "Last Week"
    const weekOption = screen.getByRole("option", { name: /last week/i });
    await user.click(weekOption);

    // Should refetch with new period
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        "/api/analytics/oauth-usage?period=week&detailed=false",
      );
    });
  });

  it("shows refresh button and allows manual refresh", async () => {
    const user = userEvent.setup();

    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => mockMetrics,
    });

    render(<OAuthMetricsDashboard />);

    await waitFor(() => {
      expect(screen.getByText("42")).toBeInTheDocument();
    });

    const refreshButton = screen.getByRole("button", { name: /refresh/i });
    await user.click(refreshButton);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledTimes(2);
    });
  });

  it("auto-refreshes when refreshInterval is set", async () => {
    vi.useFakeTimers();

    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => mockMetrics,
    });

    render(<OAuthMetricsDashboard refreshInterval={30000} />);

    // Initial fetch
    await vi.waitFor(
      () => {
        expect(mockFetch).toHaveBeenCalledTimes(1);
      },
      { timeout: 1000 },
    );

    // Fast-forward 30 seconds and run pending timers
    await vi.advanceTimersByTimeAsync(30000);

    await vi.waitFor(
      () => {
        expect(mockFetch).toHaveBeenCalledTimes(2);
      },
      { timeout: 1000 },
    );

    // Fast-forward another 30 seconds
    await vi.advanceTimersByTimeAsync(30000);

    await vi.waitFor(
      () => {
        expect(mockFetch).toHaveBeenCalledTimes(3);
      },
      { timeout: 1000 },
    );

    vi.useRealTimers();
  }, 10000);

  it("displays auto-refresh badge when enabled", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => mockMetrics,
    });

    render(<OAuthMetricsDashboard refreshInterval={30000} />);

    await waitFor(() => {
      expect(screen.getByText(/Auto-refresh:/)).toBeInTheDocument();
      expect(screen.getByText(/30s/)).toBeInTheDocument();
    });
  });

  it("does not show auto-refresh badge when disabled", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => mockMetrics,
    });

    render(<OAuthMetricsDashboard refreshInterval={0} />);

    await waitFor(() => {
      expect(screen.getByText("42")).toBeInTheDocument();
    });

    expect(screen.queryByText(/Auto-refresh:/)).not.toBeInTheDocument();
  });

  it("shows admin mode detailed data", async () => {
    const adminMetrics = {
      ...mockMetrics,
      detailed: {
        sessions: [
          {
            sessionId: "abc123...",
            userId: 12345,
            login: "testuser1",
            createdAt: Date.now() - 3600000,
            lastActivity: Date.now() - 600000,
          },
        ],
        timeline: [
          {
            timestamp: Date.now() - 3600000,
            event: "login",
            userId: 12345,
            login: "testuser1",
          },
        ],
      },
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => adminMetrics,
    });

    render(<OAuthMetricsDashboard adminMode={true} />);

    await waitFor(
      () => {
        expect(mockFetch).toHaveBeenCalledWith(
          "/api/analytics/oauth-usage?period=day&detailed=true",
        );
      },
      { timeout: 10000 },
    );

    await waitFor(
      () => {
        expect(
          screen.getByText("Detailed Data (Admin Only)"),
        ).toBeInTheDocument();
        // Use getAllByText since "Active Sessions" appears in both metrics and detailed data
        expect(screen.getAllByText("Active Sessions").length).toBeGreaterThan(
          0,
        );
        expect(screen.getByText(/1 active sessions found/)).toBeInTheDocument();
        expect(screen.getByText("Recent Events")).toBeInTheDocument();
        expect(screen.getByText(/1 events in timeline/)).toBeInTheDocument();
      },
      { timeout: 10000 },
    );
  }, 15000);

  it("does not show admin data in normal mode", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockMetrics,
    });

    render(<OAuthMetricsDashboard adminMode={false} />);

    await waitFor(
      () => {
        expect(screen.getByText("42")).toBeInTheDocument();
      },
      { timeout: 10000 },
    );

    expect(
      screen.queryByText("Detailed Data (Admin Only)"),
    ).not.toBeInTheDocument();
  }, 15000);

  it("formats different duration units correctly", async () => {
    const testCases = [
      { duration: 30000, expected: "30s" }, // 30 seconds
      { duration: 120000, expected: "2m" }, // 2 minutes
      { duration: 7200000, expected: "2h" }, // 2 hours
      { duration: 172800000, expected: "2d" }, // 2 days
    ];

    for (const { duration, expected } of testCases) {
      const metricsWithDuration = {
        ...mockMetrics,
        metrics: {
          ...mockMetrics.metrics,
          avgSessionDuration: duration,
        },
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => metricsWithDuration,
      });

      const { unmount } = render(<OAuthMetricsDashboard />);

      await waitFor(
        () => {
          expect(screen.getByText(expected)).toBeInTheDocument();
        },
        { timeout: 10000 },
      );

      unmount();
    }
  }, 60000);

  it("displays correct period description in metrics", async () => {
    const periods = [
      { period: "hour" as const, expected: "last hour" },
      { period: "day" as const, expected: "last day" },
      { period: "week" as const, expected: "last week" },
      { period: "month" as const, expected: "last month" },
    ];

    for (const { period, expected } of periods) {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ ...mockMetrics, period }),
      });

      const { unmount } = render(
        <OAuthMetricsDashboard initialPeriod={period} />,
      );

      await waitFor(
        () => {
          expect(
            screen.getAllByText(new RegExp(expected, "i")).length,
          ).toBeGreaterThan(0);
        },
        { timeout: 10000 },
      );

      unmount();
    }
  }, 60000);
});
