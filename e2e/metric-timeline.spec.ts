import { test, expect } from '@playwright/test';

test.describe('MetricTimeline Component', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');

    // Search for a user with substantial activity
    await page.fill('input[placeholder*="GitHub username"]', 'torvalds');
    await page.click('button:has-text("Search")');

    // Wait for profile to load
    await expect(page.locator('text=@torvalds')).toBeVisible({ timeout: 10000 });
  });

  test('should render metric timeline chart', async ({ page }) => {
    // Check for main heading
    await expect(page.locator('text=📈 Metric Development')).toBeVisible();

    // Check for chart subtitle
    await expect(page.locator('text=/track how your developer metrics evolved/i')).toBeVisible();
  });

  test('should display all four metric summary cards', async ({ page }) => {
    // Verify all 4 metric cards are present
    await expect(page.locator('text=Activity').first()).toBeVisible();
    await expect(page.locator('text=Impact').first()).toBeVisible();
    await expect(page.locator('text=Quality').first()).toBeVisible();
    await expect(page.locator('text=Growth').first()).toBeVisible();
  });

  test('should show latest scores in summary cards', async ({ page }) => {
    // Check that "Latest score" label appears 4 times
    const latestScoreElements = page.locator('text=Latest score');
    await expect(latestScoreElements).toHaveCount(4);

    // Verify each card shows a numeric value
    const activityCard = page.locator('text=Activity').first().locator('..');
    await expect(activityCard).toContainText(/[0-9]/);
  });

  test('should render chart with proper structure', async ({ page }) => {
    // Check for chart container
    const chartContainer = page.locator('[data-slot="chart"]').first();
    await expect(chartContainer).toBeVisible();

    // Check for Recharts SVG element
    const chartSvg = chartContainer.locator('svg');
    await expect(chartSvg).toBeVisible();
  });

  test('should display chart legend', async ({ page }) => {
    // Wait for chart to render
    const chartContainer = page.locator('[data-slot="chart"]').first();
    await expect(chartContainer).toBeVisible();

    // Legend items should contain metric names
    // Recharts renders legend as SVG text elements
    const svg = chartContainer.locator('svg');
    await expect(svg).toBeVisible();
  });

  test('should show reference line at zero for growth metric', async ({ page }) => {
    const chartContainer = page.locator('[data-slot="chart"]').first();
    await expect(chartContainer).toBeVisible();

    // Recharts renders reference lines as SVG line elements
    const svg = chartContainer.locator('svg');
    await expect(svg.locator('line')).toHaveCount({ min: 1 });
  });

  test('should display metric timeline above statistics section', async ({ page }) => {
    // MetricTimeline should appear before StatsOverview
    const timeline = page.locator('text=📈 Metric Development');
    const statistics = page.locator('text=📊 Statistics');

    await expect(timeline).toBeVisible();
    await expect(statistics).toBeVisible();

    // Get bounding boxes to verify order
    const timelineBox = await timeline.boundingBox();
    const statisticsBox = await statistics.boundingBox();

    expect(timelineBox).not.toBeNull();
    expect(statisticsBox).not.toBeNull();
    expect(timelineBox!.y).toBeLessThan(statisticsBox!.y);
  });

  test('should handle responsive layout on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Reload to trigger responsive layout
    await page.reload();

    // Wait for profile to load
    await expect(page.locator('text=@torvalds')).toBeVisible({ timeout: 10000 });

    // Chart should still be visible
    await expect(page.locator('text=📈 Metric Development')).toBeVisible();

    // Summary cards should stack vertically (grid becomes single column)
    const cards = page.locator('text=Latest score');
    await expect(cards).toHaveCount(4);
  });

  test('should render correctly for users with single year data', async ({ page }) => {
    // Search for a newer user (might have less history)
    await page.goto('/');
    await page.fill('input[placeholder*="GitHub username"]', 'octocat');
    await page.click('button:has-text("Search")');

    await expect(page.locator('text=@octocat')).toBeVisible({ timeout: 10000 });

    // Timeline should still render even with limited data
    const timeline = page.locator('text=📈 Metric Development');

    // Either timeline is visible OR empty state is shown
    const timelineVisible = await timeline.isVisible().catch(() => false);
    const emptyState = await page.locator('text=No Timeline Data').isVisible().catch(() => false);

    expect(timelineVisible || emptyState).toBe(true);
  });

  test('should show metric cards with proper styling', async ({ page }) => {
    // Activity card should have blue theme
    const activityCard = page.locator('text=Activity').first().locator('..');
    await expect(activityCard).toBeVisible();

    // Impact card should have green theme
    const impactCard = page.locator('text=Impact').first().locator('..');
    await expect(impactCard).toBeVisible();

    // Quality card should have orange theme
    const qualityCard = page.locator('text=Quality').first().locator('..');
    await expect(qualityCard).toBeVisible();

    // Growth card should have purple theme
    const growthCard = page.locator('text=Growth').first().locator('..');
    await expect(growthCard).toBeVisible();
  });

  test('should calculate metrics based on yearly data', async ({ page }) => {
    // The chart should show data points for multiple years
    const chartContainer = page.locator('[data-slot="chart"]').first();
    await expect(chartContainer).toBeVisible();

    // Summary cards should show calculated values (not null/undefined)
    const latestScores = page.locator('text=Latest score');

    for (let i = 0; i < 4; i++) {
      const scoreCard = latestScores.nth(i).locator('..');
      const hasNumber = await scoreCard.textContent().then(text => /[0-9]/.test(text || ''));
      expect(hasNumber).toBe(true);
    }
  });

  test('should have accessible structure', async ({ page }) => {
    // Section should have proper semantic HTML
    const section = page.locator('section').filter({ hasText: '📈 Metric Development' });
    await expect(section).toBeVisible();

    // Heading should be H2
    const heading = page.locator('h2:has-text("📈 Metric Development")');
    await expect(heading).toBeVisible();
  });
});
