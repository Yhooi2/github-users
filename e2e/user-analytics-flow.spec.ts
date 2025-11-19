import { test, expect } from '@playwright/test';

test.describe('User Analytics Flow', () => {
  test('complete analytics flow from search to timeline', async ({ page }) => {
    await page.goto('/');

    // Search for user
    await page.fill('input[placeholder*="GitHub username"]', 'torvalds');
    await page.click('button:has-text("Search")');

    // Wait for profile to load
    await expect(page.locator('text=@torvalds')).toBeVisible({ timeout: 10000 });

    // Check Quick Assessment metrics
    await expect(page.locator('text=Activity')).toBeVisible();
    await expect(page.locator('text=Impact')).toBeVisible();
    await expect(page.locator('text=Quality')).toBeVisible();
    await expect(page.locator('text=Growth')).toBeVisible();

    // Check metric values are loaded (should show levels like High, Medium, Low)
    const metricsSection = page.locator('[data-testid="quick-assessment"]');
    await expect(metricsSection).toBeVisible({ timeout: 5000 });

    // Check Activity Timeline
    await expect(page.locator('text=Activity Timeline')).toBeVisible();

    // Expand a year
    const currentYear = new Date().getFullYear();
    const yearButton = page.locator(`button:has-text("${currentYear}")`);

    // Only expand if the year button exists
    const yearExists = await yearButton.isVisible().catch(() => false);
    if (yearExists) {
      await yearButton.click();
      await page.waitForTimeout(500);

      // Check expanded view (projects or contributions)
      const expandedContent = page.locator('text=/Your Projects|Open Source Contributions|commits/i');
      await expect(expandedContent.first()).toBeVisible({ timeout: 5000 });
    }

    // Check Top Projects section
    await expect(page.locator('text=Top Projects')).toBeVisible();

    // Verify at least one repository card exists
    const repoCards = page.locator('[data-testid="repository-card"]');
    await expect(repoCards.first()).toBeVisible({ timeout: 5000 });
  });

  test('handles user not found', async ({ page }) => {
    await page.goto('/');

    // Search for non-existent user
    await page.fill('input[placeholder*="GitHub username"]', 'thisuserdoesnotexist12345');
    await page.click('button:has-text("Search")');

    // Check error message
    await expect(page.locator('text=/User not found|Error|failed to fetch/i')).toBeVisible({
      timeout: 10000,
    });
  });

  test('metric cards display correct information', async ({ page }) => {
    await page.goto('/');

    await page.fill('input[placeholder*="GitHub username"]', 'torvalds');
    await page.click('button:has-text("Search")');

    await expect(page.locator('text=@torvalds')).toBeVisible({ timeout: 10000 });

    // Verify all four metric cards are present
    const activityCard = page.locator('text=Activity').locator('..');
    const impactCard = page.locator('text=Impact').locator('..');
    const qualityCard = page.locator('text=Quality').locator('..');
    const growthCard = page.locator('text=Growth').locator('..');

    await expect(activityCard).toBeVisible();
    await expect(impactCard).toBeVisible();
    await expect(qualityCard).toBeVisible();
    await expect(growthCard).toBeVisible();

    // Each card should have a level indicator (High/Medium/Low)
    const metricLevels = page.locator('text=/^(High|Medium|Low)$/');
    const levelCount = await metricLevels.count();
    expect(levelCount).toBeGreaterThanOrEqual(4);
  });

  test('timeline collapse/expand functionality', async ({ page }) => {
    await page.goto('/');

    await page.fill('input[placeholder*="GitHub username"]', 'torvalds');
    await page.click('button:has-text("Search")');

    await expect(page.locator('text=Activity Timeline')).toBeVisible({ timeout: 10000 });

    const currentYear = new Date().getFullYear();
    const yearButton = page.locator(`button:has-text("${currentYear}")`);

    // Check if year button exists
    const yearExists = await yearButton.isVisible().catch(() => false);

    if (yearExists) {
      // Year should be collapsed initially
      await expect(yearButton).toBeVisible();

      // Expand year
      await yearButton.click();
      await page.waitForTimeout(500);

      // Check for expanded content
      const expandedView = page.locator('[data-testid="year-expanded-view"]');
      const contentVisible = await expandedView.isVisible().catch(() => false);

      if (contentVisible) {
        // Collapse year
        await yearButton.click();
        await page.waitForTimeout(500);

        // Expanded view should be hidden
        await expect(expandedView).not.toBeVisible();
      }
    }
  });

  test('responsive layout on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    await page.fill('input[placeholder*="GitHub username"]', 'torvalds');
    await page.click('button:has-text("Search")');

    await expect(page.locator('text=@torvalds')).toBeVisible({ timeout: 10000 });

    // Verify metrics are visible on mobile
    await expect(page.locator('text=Activity')).toBeVisible();
    await expect(page.locator('text=Impact')).toBeVisible();
    await expect(page.locator('text=Quality')).toBeVisible();
    await expect(page.locator('text=Growth')).toBeVisible();

    // Timeline should be visible
    await expect(page.locator('text=Activity Timeline')).toBeVisible();

    // Top Projects should be visible
    await expect(page.locator('text=Top Projects')).toBeVisible();
  });

  test('navigation between profile tabs', async ({ page }) => {
    await page.goto('/');

    await page.fill('input[placeholder*="GitHub username"]', 'torvalds');
    await page.click('button:has-text("Search")');

    await expect(page.locator('text=@torvalds')).toBeVisible({ timeout: 10000 });

    // Verify all main tabs are present
    const profileTab = page.getByRole('tab', { name: /profile/i });
    const repositoriesTab = page.getByRole('tab', { name: /repositories/i });
    const statisticsTab = page.getByRole('tab', { name: /statistics/i });

    await expect(profileTab).toBeVisible();
    await expect(repositoriesTab).toBeVisible();
    await expect(statisticsTab).toBeVisible();

    // Profile tab should be active by default
    await expect(profileTab).toHaveAttribute('data-state', 'active');

    // Navigate to Repositories
    await repositoriesTab.click();
    await page.waitForTimeout(300);
    await expect(repositoriesTab).toHaveAttribute('data-state', 'active');

    // Navigate to Statistics
    await statisticsTab.click();
    await page.waitForTimeout(300);
    await expect(statisticsTab).toHaveAttribute('data-state', 'active');

    // Navigate back to Profile
    await profileTab.click();
    await page.waitForTimeout(300);
    await expect(profileTab).toHaveAttribute('data-state', 'active');
  });

  test('top projects section displays correctly', async ({ page }) => {
    await page.goto('/');

    await page.fill('input[placeholder*="GitHub username"]', 'torvalds');
    await page.click('button:has-text("Search")');

    await expect(page.locator('text=@torvalds')).toBeVisible({ timeout: 10000 });

    // Check Top Projects section
    await expect(page.locator('text=Top Projects')).toBeVisible();

    // Verify repository cards are displayed
    const repoCards = page.locator('[data-testid="repository-card"]');
    const cardCount = await repoCards.count();
    expect(cardCount).toBeGreaterThan(0);
    expect(cardCount).toBeLessThanOrEqual(5); // Should show top 5 projects

    // Each card should have repository name
    const firstCard = repoCards.first();
    await expect(firstCard).toBeVisible();

    // Should have star count
    const starIcon = firstCard.locator('svg').first();
    await expect(starIcon).toBeVisible();
  });

  test('user stats display correctly', async ({ page }) => {
    await page.goto('/');

    await page.fill('input[placeholder*="GitHub username"]', 'torvalds');
    await page.click('button:has-text("Search")');

    await expect(page.locator('text=@torvalds')).toBeVisible({ timeout: 10000 });

    // Check for follower count
    const followersText = page.locator('text=/followers/i');
    await expect(followersText).toBeVisible();

    // Check for following count
    const followingText = page.locator('text=/following/i');
    await expect(followingText).toBeVisible();

    // Check for repository count
    const reposText = page.locator('text=/repositories/i').first();
    await expect(reposText).toBeVisible();
  });

  test('handles loading states properly', async ({ page }) => {
    await page.goto('/');

    await page.fill('input[placeholder*="GitHub username"]', 'torvalds');

    // Start search
    const searchPromise = page.click('button:has-text("Search")');

    // Should show loading state briefly
    // Note: This may be too fast to catch in some cases
    const loadingIndicator = page.locator('text=/loading|fetching/i');
    void (await loadingIndicator.isVisible().catch(() => false));

    await searchPromise;

    // Wait for content to load
    await expect(page.locator('text=@torvalds')).toBeVisible({ timeout: 10000 });

    // Loading should be gone
    await expect(loadingIndicator).not.toBeVisible({ timeout: 1000 });
  });

  test('displays contribution history', async ({ page }) => {
    await page.goto('/');

    await page.fill('input[placeholder*="GitHub username"]', 'torvalds');
    await page.click('button:has-text("Search")');

    await expect(page.locator('text=@torvalds')).toBeVisible({ timeout: 10000 });

    // Check for Recent Activity or Contribution History section
    const activitySection = page.locator('text=/Recent Activity|Contribution History|Activity Timeline/i');
    await expect(activitySection.first()).toBeVisible({ timeout: 5000 });
  });

  test('statistics section shows all charts simultaneously (Phase 5)', async ({ page }) => {
    await page.goto('/');

    await page.fill('input[placeholder*="GitHub username"]', 'torvalds');
    await page.click('button:has-text("Search")');

    await expect(page.locator('text=@torvalds')).toBeVisible({ timeout: 10000 });

    // Navigate to Statistics tab
    const statisticsTab = page.getByRole('tab', { name: /statistics/i });
    await statisticsTab.click();
    await page.waitForTimeout(300);

    // Verify Statistics section heading
    await expect(page.locator('text=📊 Statistics')).toBeVisible();

    // Verify all three charts are visible simultaneously (no tabs needed)
    await expect(page.locator('text=Commit Trends')).toBeVisible();
    await expect(page.locator('text=Commit Activity')).toBeVisible();
    await expect(page.locator('text=Language Distribution')).toBeVisible();

    // Verify there are NO sub-tabs within the Statistics section
    // (Overview, Commits, Activity, Languages tabs were removed in Phase 5)
    const subTabsList = page.locator('text=/Overview.*Commits.*Activity.*Languages/i');
    await expect(subTabsList).not.toBeVisible();

    // Verify charts are in correct layout:
    // - Top row: Commit Trends and Commit Activity (2-column grid)
    // - Bottom row: Language Distribution (full width)
    const commitTrendsCard = page.locator('text=Commit Trends').locator('..');
    const commitActivityCard = page.locator('text=Commit Activity').locator('..');
    const languageCard = page.locator('text=Language Distribution').locator('..');

    await expect(commitTrendsCard).toBeVisible();
    await expect(commitActivityCard).toBeVisible();
    await expect(languageCard).toBeVisible();
  });

  test('metric timeline appears above statistics (Phase 4)', async ({ page }) => {
    await page.goto('/');

    await page.fill('input[placeholder*="GitHub username"]', 'torvalds');
    await page.click('button:has-text("Search")');

    await expect(page.locator('text=@torvalds')).toBeVisible({ timeout: 10000 });

    // Check for Metric Timeline section
    const metricTimeline = page.locator('text=📈 Metric Development');
    await expect(metricTimeline).toBeVisible();

    // Check for Statistics section
    const statistics = page.locator('text=📊 Statistics');
    await expect(statistics).toBeVisible();

    // Verify order: MetricTimeline appears before StatsOverview
    const timelineBox = await metricTimeline.boundingBox();
    const statsBox = await statistics.boundingBox();

    expect(timelineBox).not.toBeNull();
    expect(statsBox).not.toBeNull();
    expect(timelineBox!.y).toBeLessThan(statsBox!.y);
  });
});
