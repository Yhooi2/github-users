import type { Meta, StoryObj } from "@storybook/react";
import { http, HttpResponse } from "msw";
import { OAuthMetricsDashboard } from "./OAuthMetricsDashboard";

/**
 * OAuth Metrics Dashboard Stories
 *
 * Displays OAuth analytics including:
 * - Active sessions count
 * - Login/logout statistics
 * - User engagement metrics
 * - Rate limit usage
 *
 * Usage Scenarios:
 * 1. Default - Day period with mock data
 * 2. Hour Period - Recent metrics
 * 3. Week Period - Weekly statistics
 * 4. Month Period - Monthly overview
 * 5. Loading State - Fetching data
 * 6. Error State - Failed to fetch
 * 7. High Usage - Peak activity
 * 8. Low Activity - Minimal usage
 * 9. Admin Mode - Detailed data
 * 10. Auto-refresh - Real-time updates
 */

const meta = {
  title: "Components/Analytics/OAuthMetricsDashboard",
  component: OAuthMetricsDashboard,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof OAuthMetricsDashboard>;

export default meta;
type Story = StoryObj<typeof meta>;

// Mock data: Default day metrics
const mockDayMetrics = {
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

// Mock data: Hour metrics
const mockHourMetrics = {
  period: "hour",
  timestamp: Date.now(),
  metrics: {
    activeSessions: 15,
    totalLogins: 23,
    totalLogouts: 8,
    uniqueUsers: 14,
    avgSessionDuration: 3600000, // 1 hour
    rateLimit: {
      avgUsage: 245,
      peakUsage: 850,
      avgRemaining: 4755,
    },
  },
};

// Mock data: Week metrics
const mockWeekMetrics = {
  period: "week",
  timestamp: Date.now(),
  metrics: {
    activeSessions: 128,
    totalLogins: 892,
    totalLogouts: 764,
    uniqueUsers: 95,
    avgSessionDuration: 14400000, // 4 hours
    rateLimit: {
      avgUsage: 2100,
      peakUsage: 4500,
      avgRemaining: 2900,
    },
  },
};

// Mock data: Month metrics
const mockMonthMetrics = {
  period: "month",
  timestamp: Date.now(),
  metrics: {
    activeSessions: 342,
    totalLogins: 3456,
    totalLogouts: 3114,
    uniqueUsers: 278,
    avgSessionDuration: 21600000, // 6 hours
    rateLimit: {
      avgUsage: 2500,
      peakUsage: 4950,
      avgRemaining: 2500,
    },
  },
};

// Mock data: High usage
const mockHighUsage = {
  period: "day",
  timestamp: Date.now(),
  metrics: {
    activeSessions: 523,
    totalLogins: 2134,
    totalLogouts: 1611,
    uniqueUsers: 489,
    avgSessionDuration: 10800000, // 3 hours
    rateLimit: {
      avgUsage: 4200,
      peakUsage: 4990,
      avgRemaining: 800,
    },
  },
};

// Mock data: Low activity
const mockLowActivity = {
  period: "day",
  timestamp: Date.now(),
  metrics: {
    activeSessions: 3,
    totalLogins: 12,
    totalLogouts: 9,
    uniqueUsers: 3,
    avgSessionDuration: 1800000, // 30 min
    rateLimit: {
      avgUsage: 45,
      peakUsage: 120,
      avgRemaining: 4955,
    },
  },
};

// Mock data: Admin mode with detailed data
const mockAdminMetrics = {
  period: "day",
  timestamp: Date.now(),
  metrics: {
    activeSessions: 42,
    totalLogins: 156,
    totalLogouts: 114,
    uniqueUsers: 38,
    avgSessionDuration: 7200000,
    rateLimit: {
      avgUsage: 1245,
      peakUsage: 3500,
      avgRemaining: 3755,
    },
  },
  detailed: {
    sessions: [
      {
        sessionId: "abc123...",
        userId: 12345,
        login: "testuser1",
        createdAt: Date.now() - 3600000,
        lastActivity: Date.now() - 600000,
      },
      {
        sessionId: "def456...",
        userId: 67890,
        login: "testuser2",
        createdAt: Date.now() - 7200000,
        lastActivity: Date.now() - 300000,
      },
    ],
    timeline: [
      {
        timestamp: Date.now() - 3600000,
        event: "login" as const,
        userId: 12345,
        login: "testuser1",
      },
      {
        timestamp: Date.now() - 3000000,
        event: "login" as const,
        userId: 67890,
        login: "testuser2",
      },
      {
        timestamp: Date.now() - 1800000,
        event: "logout" as const,
        userId: 98765,
        login: "testuser3",
      },
    ],
  },
};

/**
 * Default: Day period with standard metrics
 */
export const Default: Story = {
  args: {
    initialPeriod: "day",
    refreshInterval: 0,
    adminMode: false,
  },
  parameters: {
    msw: {
      handlers: [
        http.get("/api/analytics/oauth-usage", () => {
          return HttpResponse.json(mockDayMetrics);
        }),
      ],
    },
  },
};

/**
 * Hour Period: Recent metrics from last hour
 */
export const HourPeriod: Story = {
  args: {
    initialPeriod: "hour",
    refreshInterval: 0,
    adminMode: false,
  },
  parameters: {
    msw: {
      handlers: [
        http.get("/api/analytics/oauth-usage", () => {
          return HttpResponse.json(mockHourMetrics);
        }),
      ],
    },
  },
};

/**
 * Week Period: Weekly statistics overview
 */
export const WeekPeriod: Story = {
  args: {
    initialPeriod: "week",
    refreshInterval: 0,
    adminMode: false,
  },
  parameters: {
    msw: {
      handlers: [
        http.get("/api/analytics/oauth-usage", () => {
          return HttpResponse.json(mockWeekMetrics);
        }),
      ],
    },
  },
};

/**
 * Month Period: Monthly overview
 */
export const MonthPeriod: Story = {
  args: {
    initialPeriod: "month",
    refreshInterval: 0,
    adminMode: false,
  },
  parameters: {
    msw: {
      handlers: [
        http.get("/api/analytics/oauth-usage", () => {
          return HttpResponse.json(mockMonthMetrics);
        }),
      ],
    },
  },
};

/**
 * High Usage: Peak activity with high rate limit usage
 */
export const HighUsage: Story = {
  args: {
    initialPeriod: "day",
    refreshInterval: 0,
    adminMode: false,
  },
  parameters: {
    msw: {
      handlers: [
        http.get("/api/analytics/oauth-usage", () => {
          return HttpResponse.json(mockHighUsage);
        }),
      ],
    },
  },
};

/**
 * Low Activity: Minimal usage with few sessions
 */
export const LowActivity: Story = {
  args: {
    initialPeriod: "day",
    refreshInterval: 0,
    adminMode: false,
  },
  parameters: {
    msw: {
      handlers: [
        http.get("/api/analytics/oauth-usage", () => {
          return HttpResponse.json(mockLowActivity);
        }),
      ],
    },
  },
};

/**
 * Loading State: Fetching data from API
 */
export const Loading: Story = {
  args: {
    initialPeriod: "day",
    refreshInterval: 0,
    adminMode: false,
  },
  parameters: {
    msw: {
      handlers: [
        http.get("/api/analytics/oauth-usage", async () => {
          // Simulate slow response
          await new Promise((resolve) => setTimeout(resolve, 10000));
          return HttpResponse.json(mockDayMetrics);
        }),
      ],
    },
  },
};

/**
 * Error State: Failed to fetch metrics
 */
export const Error: Story = {
  args: {
    initialPeriod: "day",
    refreshInterval: 0,
    adminMode: false,
  },
  parameters: {
    msw: {
      handlers: [
        http.get("/api/analytics/oauth-usage", () => {
          return HttpResponse.json(
            { error: "Analytics service unavailable" },
            { status: 503 },
          );
        }),
      ],
    },
  },
};

/**
 * Admin Mode: Shows detailed session and timeline data
 */
export const AdminMode: Story = {
  args: {
    initialPeriod: "day",
    refreshInterval: 0,
    adminMode: true,
  },
  parameters: {
    msw: {
      handlers: [
        http.get("/api/analytics/oauth-usage", () => {
          return HttpResponse.json(mockAdminMetrics);
        }),
      ],
    },
  },
};

/**
 * Auto-refresh: Updates every 30 seconds
 */
export const AutoRefresh: Story = {
  args: {
    initialPeriod: "day",
    refreshInterval: 30000, // 30 seconds
    adminMode: false,
  },
  parameters: {
    msw: {
      handlers: [
        http.get("/api/analytics/oauth-usage", () => {
          // Simulate changing metrics
          const randomMetrics = {
            ...mockDayMetrics,
            timestamp: Date.now(),
            metrics: {
              ...mockDayMetrics.metrics,
              activeSessions: Math.floor(Math.random() * 100) + 20,
              totalLogins: Math.floor(Math.random() * 200) + 100,
            },
          };
          return HttpResponse.json(randomMetrics);
        }),
      ],
    },
  },
};
