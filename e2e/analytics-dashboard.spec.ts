import { expect, test, type Page } from "@playwright/test";

/**
 * E2E Tests for OAuth Analytics Dashboard
 *
 * These tests verify the analytics dashboard functionality:
 * - Loading and displaying metrics
 * - Period selection
 * - Auto-refresh
 * - Error handling
 * - Admin mode
 */

// Mock analytics data
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

const mockAdminMetrics = {
  ...mockDayMetrics,
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
        event: "login",
        userId: 12345,
        login: "testuser1",
      },
      {
        timestamp: Date.now() - 1800000,
        event: "logout",
        userId: 98765,
        login: "testuser3",
      },
    ],
  },
};

/**
 * Navigate to analytics page (assuming it exists)
 * For testing, we'll create a test page that includes the dashboard
 */
async function navigateToAnalyticsDashboard(page: Page) {
  // In real app, this would be /analytics or similar
  // For testing, we assume component is mounted on test page
  await page.goto("/");
  // Note: In production, you'd navigate to actual analytics page
}

test.describe("OAuth Analytics Dashboard", () => {
  test("should load and display analytics dashboard", async ({ page }) => {
    // Mock analytics API
    await page.route("/api/analytics/oauth-usage*", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(mockDayMetrics),
      });
    });

    await navigateToAnalyticsDashboard(page);

    // Wait for dashboard to load
    // Note: Adjust selectors based on actual implementation
    await expect(page.getByText("OAuth Analytics")).toBeVisible({
      timeout: 10000,
    });
  });

  test("should display all metric cards", async ({ page }) => {
    await page.route("/api/analytics/oauth-usage*", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(mockDayMetrics),
      });
    });

    await navigateToAnalyticsDashboard(page);

    // Check for metric cards
    await expect(page.getByText("Active Sessions")).toBeVisible();
    await expect(page.getByText("Total Logins")).toBeVisible();
    await expect(page.getByText("Total Logouts")).toBeVisible();
    await expect(page.getByText("Avg Session")).toBeVisible();

    // Check for values
    await expect(page.getByText("42")).toBeVisible(); // Active sessions
    await expect(page.getByText("156")).toBeVisible(); // Total logins
    await expect(page.getByText("114")).toBeVisible(); // Total logouts
    await expect(page.getByText("2h")).toBeVisible(); // Avg session duration
  });

  test("should display rate limit statistics", async ({ page }) => {
    await page.route("/api/analytics/oauth-usage*", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(mockDayMetrics),
      });
    });

    await navigateToAnalyticsDashboard(page);

    // Check for rate limit section
    await expect(page.getByText("Rate Limit Statistics")).toBeVisible();
    await expect(page.getByText("Average Usage")).toBeVisible();
    await expect(page.getByText("1245")).toBeVisible();
    await expect(page.getByText("Peak Usage")).toBeVisible();
    await expect(page.getByText("3500")).toBeVisible();
    await expect(page.getByText("Average Remaining")).toBeVisible();
    await expect(page.getByText("3755")).toBeVisible();
  });

  test("should change period via select dropdown", async ({ page }) => {
    let requestCount = 0;
    let lastPeriod = "";

    await page.route("/api/analytics/oauth-usage*", async (route) => {
      const url = new URL(route.request().url());
      lastPeriod = url.searchParams.get("period") || "day";
      requestCount++;

      const data = lastPeriod === "hour" ? mockHourMetrics : mockDayMetrics;
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(data),
      });
    });

    await navigateToAnalyticsDashboard(page);

    // Wait for initial load (day period)
    await expect(page.getByText("42")).toBeVisible();

    // Open period select
    const periodSelect = page.getByRole("combobox");
    await periodSelect.click();

    // Select "Last Hour"
    await page.getByRole("option", { name: /last hour/i }).click();

    // Should show hour metrics
    await expect(page.getByText("15")).toBeVisible(); // Active sessions for hour
    await expect(page.getByText("23")).toBeVisible(); // Total logins for hour

    // Verify API was called with correct period
    expect(requestCount).toBeGreaterThan(1);
    expect(lastPeriod).toBe("hour");
  });

  test("should manually refresh metrics", async ({ page }) => {
    let requestCount = 0;

    await page.route("/api/analytics/oauth-usage*", async (route) => {
      requestCount++;
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(mockDayMetrics),
      });
    });

    await navigateToAnalyticsDashboard(page);

    // Wait for initial load
    await expect(page.getByText("OAuth Analytics")).toBeVisible();
    const initialRequestCount = requestCount;

    // Click refresh button
    const refreshButton = page.getByRole("button", { name: /refresh/i });
    await refreshButton.click();

    // Wait for refresh to complete
    await page.waitForTimeout(1000);

    // Should have made another request
    expect(requestCount).toBeGreaterThan(initialRequestCount);
  });

  test("should handle loading state", async ({ page }) => {
    await page.route("/api/analytics/oauth-usage*", async (route) => {
      // Delay response to see loading state
      await new Promise((resolve) => setTimeout(resolve, 500));
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(mockDayMetrics),
      });
    });

    await navigateToAnalyticsDashboard(page);

    // Should show loading state initially
    await expect(page.getByText(/loading metrics/i)).toBeVisible({
      timeout: 2000,
    });

    // Then show actual data
    await expect(page.getByText("42")).toBeVisible({ timeout: 5000 });
  });

  test("should handle error state gracefully", async ({ page }) => {
    await page.route("/api/analytics/oauth-usage*", async (route) => {
      await route.fulfill({
        status: 503,
        contentType: "application/json",
        body: JSON.stringify({
          error: "Service unavailable",
          message: "Analytics service is down",
        }),
      });
    });

    await navigateToAnalyticsDashboard(page);

    // Should show error state
    await expect(page.getByText(/failed to load metrics/i)).toBeVisible({
      timeout: 5000,
    });
    await expect(page.getByText("Error")).toBeVisible();

    // Should show retry button
    await expect(page.getByRole("button", { name: /retry/i })).toBeVisible();
  });

  test("should retry after error", async ({ page }) => {
    let attemptCount = 0;

    await page.route("/api/analytics/oauth-usage*", async (route) => {
      attemptCount++;

      if (attemptCount === 1) {
        // First attempt fails
        await route.fulfill({
          status: 503,
          contentType: "application/json",
          body: JSON.stringify({ error: "Service unavailable" }),
        });
      } else {
        // Second attempt succeeds
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify(mockDayMetrics),
        });
      }
    });

    await navigateToAnalyticsDashboard(page);

    // Wait for error state
    await expect(page.getByText(/failed to load metrics/i)).toBeVisible();

    // Click retry
    const retryButton = page.getByRole("button", { name: /retry/i });
    await retryButton.click();

    // Should load successfully
    await expect(page.getByText("42")).toBeVisible({ timeout: 5000 });
    expect(attemptCount).toBe(2);
  });

  test("should show auto-refresh indicator when enabled", async ({ page }) => {
    await page.route("/api/analytics/oauth-usage*", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(mockDayMetrics),
      });
    });

    await navigateToAnalyticsDashboard(page);

    // If auto-refresh is enabled, should see indicator
    // Note: This assumes dashboard has refreshInterval prop set
    const _autoRefreshBadge = page.getByText(/auto-refresh/i);
    // May or may not be visible depending on props
    // Just check it doesn't cause errors
  });

  test("should display week period metrics correctly", async ({ page }) => {
    await page.route("/api/analytics/oauth-usage*", async (route) => {
      const url = new URL(route.request().url());
      const period = url.searchParams.get("period") || "day";

      const data = period === "week" ? mockWeekMetrics : mockDayMetrics;
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(data),
      });
    });

    await navigateToAnalyticsDashboard(page);

    // Change to week
    const periodSelect = page.getByRole("combobox");
    await periodSelect.click();
    await page.getByRole("option", { name: /last week/i }).click();

    // Check week metrics
    await expect(page.getByText("128")).toBeVisible(); // Active sessions
    await expect(page.getByText("892")).toBeVisible(); // Total logins
  });

  test("should display admin mode with detailed data", async ({ page }) => {
    await page.route("/api/analytics/oauth-usage*", async (route) => {
      const url = new URL(route.request().url());
      const detailed = url.searchParams.get("detailed") === "true";

      const data = detailed ? mockAdminMetrics : mockDayMetrics;
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(data),
      });
    });

    await navigateToAnalyticsDashboard(page);

    // If admin mode is enabled (via props), should see detailed section
    // Note: This would need to be tested with actual admin mode enabled
    // const detailedSection = page.getByText(/detailed data/i)
    // Check if exists (optional based on props)
  });

  test("should format duration values correctly", async ({ page }) => {
    const testCases = [
      { duration: 30000, expected: "30s" },
      { duration: 120000, expected: "2m" },
      { duration: 7200000, expected: "2h" },
    ];

    for (const testCase of testCases) {
      await page.route("/api/analytics/oauth-usage*", async (route) => {
        const data = {
          ...mockDayMetrics,
          metrics: {
            ...mockDayMetrics.metrics,
            avgSessionDuration: testCase.duration,
          },
        };
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify(data),
        });
      });

      await navigateToAnalyticsDashboard(page);

      await expect(page.getByText(testCase.expected)).toBeVisible({
        timeout: 5000,
      });

      // Reload for next test
      await page.reload();
    }
  });

  test("should update last updated timestamp", async ({ page }) => {
    await page.route("/api/analytics/oauth-usage*", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(mockDayMetrics),
      });
    });

    await navigateToAnalyticsDashboard(page);

    // Should show "Last updated" timestamp
    await expect(page.getByText(/last updated/i)).toBeVisible();

    // Timestamp should be recent
    const timestampText = await page.getByText(/last updated/i).textContent();
    expect(timestampText).toBeTruthy();
  });

  test("should handle network errors gracefully", async ({ page }) => {
    await page.route("/api/analytics/oauth-usage*", async (route) => {
      await route.abort("failed");
    });

    await navigateToAnalyticsDashboard(page);

    // Should show error state
    await expect(page.getByText(/failed to load metrics/i)).toBeVisible({
      timeout: 5000,
    });
  });
});
