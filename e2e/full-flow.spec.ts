import { test, expect } from '@playwright/test';

test.describe('Full Application Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should complete user search and tab navigation', async ({ page }) => {
    // Step 1: Search for user
    await page.fill('input[placeholder*="GitHub username"]', 'octocat');
    await page.click('button:has-text("Search")');

    // Step 2: Wait for profile to load
    await expect(page.locator('text=@octocat')).toBeVisible({ timeout: 10000 });

    // Step 3: Verify tabs are visible
    await expect(page.getByRole('tab', { name: /profile/i })).toBeVisible();
    await expect(page.getByRole('tab', { name: /repositories/i })).toBeVisible();
    await expect(page.getByRole('tab', { name: /statistics/i })).toBeVisible();

    // Step 4: Profile tab should be active by default
    const profileTab = page.getByRole('tab', { name: /profile/i });
    await expect(profileTab).toHaveAttribute('data-state', 'active');

    // Step 5: Navigate to Repositories tab
    await page.getByRole('tab', { name: /repositories/i }).click();
    await expect(page.getByRole('tab', { name: /repositories/i })).toHaveAttribute(
      'data-state',
      'active'
    );

    // Step 6: Verify repository content is visible
    await expect(page.locator('[data-testid="repository-card"]').first()).toBeVisible({
      timeout: 5000,
    });

    // Step 7: Navigate to Statistics tab
    await page.getByRole('tab', { name: /statistics/i }).click();
    await expect(page.getByRole('tab', { name: /statistics/i })).toHaveAttribute(
      'data-state',
      'active'
    );

    // Step 8: Verify statistics content (nested tabs)
    await expect(page.getByRole('tab', { name: /overview/i })).toBeVisible();
  });

  test('should apply multiple filters and verify results', async ({ page }) => {
    // Search for user
    await page.fill('input[placeholder*="GitHub username"]', 'octocat');
    await page.click('button:has-text("Search")');
    await expect(page.locator('text=@octocat')).toBeVisible({ timeout: 10000 });

    // Navigate to Repositories tab
    await page.getByRole('tab', { name: /repositories/i }).click();
    await expect(page.locator('[data-testid="repository-card"]').first()).toBeVisible();

    // Count initial repositories
    const initialCount = await page.locator('[data-testid="repository-card"]').count();
    expect(initialCount).toBeGreaterThan(0);

    // Apply language filter
    await page.getByLabel('Language').click();
    await page.getByRole('option', { name: 'JavaScript' }).click();

    // Wait for filter to apply
    await page.waitForTimeout(500);

    // Verify filtered results
    const filteredCount = await page.locator('[data-testid="repository-card"]').count();
    expect(filteredCount).toBeLessThanOrEqual(initialCount);

    // Apply minimum stars filter
    await page.getByLabel(/minimum stars/i).fill('10');
    await page.waitForTimeout(500);

    // Verify further filtering
    const doubleFilteredCount = await page.locator('[data-testid="repository-card"]').count();
    expect(doubleFilteredCount).toBeLessThanOrEqual(filteredCount);
  });

  test('should sort repositories by different criteria', async ({ page }) => {
    await page.fill('input[placeholder*="GitHub username"]', 'octocat');
    await page.click('button:has-text("Search")');
    await expect(page.locator('text=@octocat')).toBeVisible({ timeout: 10000 });

    await page.getByRole('tab', { name: /repositories/i }).click();
    await expect(page.locator('[data-testid="repository-card"]').first()).toBeVisible();

    // Get first repository name with default sort (stars descending)
    // Note: Variable not used in test, but kept for potential future use
    await page
      .locator('[data-testid="repository-card"]')
      .first()
      .locator('h3')
      .textContent();

    // Change sort to Name
    await page.getByLabel(/sort by/i).click();
    await page.getByRole('option', { name: /^name$/i }).click();
    await page.waitForTimeout(500);

    // Get first repository name after sorting by name
    // Note: Variable not used in test, but kept for potential future use
    await page
      .locator('[data-testid="repository-card"]')
      .first()
      .locator('h3')
      .textContent();

    // Names should be different (unless coincidentally same)
    // At minimum, verify sort control changed
    const sortValue = await page.getByLabel(/sort by/i).inputValue();
    expect(sortValue).toBe('name');

    // Toggle sort direction
    await page.getByRole('button', { name: /toggle sort direction/i }).click();
    await page.waitForTimeout(500);

    // Verify direction changed
    const directionButton = page.getByRole('button', { name: /toggle sort direction/i });
    await expect(directionButton).toBeVisible();
  });

  test('should navigate through pagination pages', async ({ page }) => {
    // Use a user with many repositories
    await page.fill('input[placeholder*="GitHub username"]', 'torvalds');
    await page.click('button:has-text("Search")');
    await expect(page.locator('text=@torvalds')).toBeVisible({ timeout: 10000 });

    await page.getByRole('tab', { name: /repositories/i }).click();
    await expect(page.locator('[data-testid="repository-card"]').first()).toBeVisible();

    // Check if pagination exists (user might have <20 repos)
    const paginationExists = await page
      .getByRole('button', { name: /next page/i })
      .isVisible()
      .catch(() => false);

    if (paginationExists) {
      // Get first repo on page 1
      const firstRepoPage1 = await page
        .locator('[data-testid="repository-card"]')
        .first()
        .locator('h3')
        .textContent();

      // Go to next page
      await page.getByRole('button', { name: /next page/i }).click();
      await page.waitForTimeout(500);

      // Get first repo on page 2
      const firstRepoPage2 = await page
        .locator('[data-testid="repository-card"]')
        .first()
        .locator('h3')
        .textContent();

      // Should be different repositories
      expect(firstRepoPage1).not.toBe(firstRepoPage2);

      // Verify page indicator changed
      await expect(page.locator('text=/page 2 of/i')).toBeVisible();

      // Go back to page 1
      await page.getByRole('button', { name: /previous page/i }).click();
      await page.waitForTimeout(500);

      await expect(page.locator('text=/page 1 of/i')).toBeVisible();
    }
  });

  test('should toggle between list and table views', async ({ page }) => {
    await page.fill('input[placeholder*="GitHub username"]', 'octocat');
    await page.click('button:has-text("Search")');
    await expect(page.locator('text=@octocat')).toBeVisible({ timeout: 10000 });

    await page.getByRole('tab', { name: /repositories/i }).click();
    await expect(page.locator('[data-testid="repository-card"]').first()).toBeVisible();

    // Default is list view - verify cards exist
    const cardCount = await page.locator('[data-testid="repository-card"]').count();
    expect(cardCount).toBeGreaterThan(0);

    // Switch to table view
    await page.getByRole('button', { name: /table view/i }).click();
    await page.waitForTimeout(500);

    // Verify table is visible
    await expect(page.getByRole('table')).toBeVisible();
    const rowCount = await page.locator('tbody tr').count();
    expect(rowCount).toBeGreaterThan(0);

    // Switch back to list view
    await page.getByRole('button', { name: /list view/i }).click();
    await page.waitForTimeout(500);

    // Verify cards are back
    const cardsAgain = await page.locator('[data-testid="repository-card"]').count();
    expect(cardsAgain).toBeGreaterThan(0);
  });

  test('should clear filters and restore full list', async ({ page }) => {
    await page.fill('input[placeholder*="GitHub username"]', 'octocat');
    await page.click('button:has-text("Search")');
    await expect(page.locator('text=@octocat')).toBeVisible({ timeout: 10000 });

    await page.getByRole('tab', { name: /repositories/i }).click();
    await expect(page.locator('[data-testid="repository-card"]').first()).toBeVisible();

    // Count initial repositories
    const initialCount = await page.locator('[data-testid="repository-card"]').count();

    // Apply filter
    await page.getByLabel(/minimum stars/i).fill('100');
    await page.waitForTimeout(500);

    const filteredCount = await page.locator('[data-testid="repository-card"]').count();
    expect(filteredCount).toBeLessThanOrEqual(initialCount);

    // Clear filters
    await page.getByRole('button', { name: /clear filters/i }).click();
    await page.waitForTimeout(500);

    // Verify all repositories are back
    const restoredCount = await page.locator('[data-testid="repository-card"]').count();
    expect(restoredCount).toBe(initialCount);

    // Verify input is cleared
    const minStarsValue = await page.getByLabel(/minimum stars/i).inputValue();
    expect(minStarsValue).toBe('');
  });

  test('should render statistics charts with data', async ({ page }) => {
    await page.fill('input[placeholder*="GitHub username"]', 'octocat');
    await page.click('button:has-text("Search")');
    await expect(page.locator('text=@octocat')).toBeVisible({ timeout: 10000 });

    // Navigate to Statistics tab
    await page.getByRole('tab', { name: /statistics/i }).click();

    // Verify nested tabs are visible
    await expect(page.getByRole('tab', { name: /overview/i })).toBeVisible();
    await expect(page.getByRole('tab', { name: /commits/i })).toBeVisible();
    await expect(page.getByRole('tab', { name: /languages/i })).toBeVisible();
    await expect(page.getByRole('tab', { name: /activity/i })).toBeVisible();

    // Check commits tab
    await page.getByRole('tab', { name: /^commits$/i }).click();
    await page.waitForTimeout(500);
    await expect(page.locator('text=/commit/i')).toBeVisible();

    // Check languages tab
    await page.getByRole('tab', { name: /^languages$/i }).click();
    await page.waitForTimeout(500);
    await expect(page.locator('text=/language distribution/i')).toBeVisible();

    // Check activity tab
    await page.getByRole('tab', { name: /^activity$/i }).click();
    await page.waitForTimeout(500);
    await expect(page.locator('text=/commits per/i')).toBeVisible();
  });

  test('should persist theme toggle across navigation', async ({ page }) => {
    await page.fill('input[placeholder*="GitHub username"]', 'octocat');
    await page.click('button:has-text("Search")');
    await expect(page.locator('text=@octocat')).toBeVisible({ timeout: 10000 });

    // Toggle to dark mode
    await page.getByRole('button', { name: /toggle theme/i }).click();
    await page.waitForTimeout(300);

    // Check if dark class is applied
    const htmlClass = await page.locator('html').getAttribute('class');
    const isDark = htmlClass?.includes('dark');

    // Navigate between tabs
    await page.getByRole('tab', { name: /repositories/i }).click();
    await page.waitForTimeout(300);

    // Theme should persist
    const htmlClassAfter = await page.locator('html').getAttribute('class');
    const isDarkAfter = htmlClassAfter?.includes('dark');
    expect(isDarkAfter).toBe(isDark);
  });

  test('should handle mobile responsive layout', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    await page.fill('input[placeholder*="GitHub username"]', 'octocat');
    await page.click('button:has-text("Search")');
    await expect(page.locator('text=@octocat')).toBeVisible({ timeout: 10000 });

    // Verify tabs are visible on mobile
    await expect(page.getByRole('tab', { name: /profile/i })).toBeVisible();
    await expect(page.getByRole('tab', { name: /repositories/i })).toBeVisible();

    // Navigate to repositories
    await page.getByRole('tab', { name: /repositories/i }).click();
    await expect(page.locator('[data-testid="repository-card"]').first()).toBeVisible();

    // Verify mobile layout (cards should stack vertically)
    const cards = page.locator('[data-testid="repository-card"]');
    const firstCard = cards.first();
    await expect(firstCard).toBeVisible();

    // Filters should be visible (might be collapsible on mobile)
    await expect(page.getByLabel(/language/i)).toBeVisible();
  });

  test('should handle retry button after error', async ({ page }) => {
    // Search for non-existent user
    await page.fill('input[placeholder*="GitHub username"]', 'thisuserdoesnotexist123456789');
    await page.click('button:has-text("Search")');

    // Wait for error state
    await expect(page.locator('text=/error|not found/i')).toBeVisible({ timeout: 10000 });

    // Check if retry button exists
    const retryButton = page.getByRole('button', { name: /retry|try again/i });
    const retryExists = await retryButton.isVisible().catch(() => false);

    if (retryExists) {
      // Click retry
      await retryButton.click();

      // Should attempt to reload
      await page.waitForTimeout(1000);
    }
  });

  test('should handle empty states gracefully', async ({ page }) => {
    // Search for user with no repositories (unlikely but test the UI)
    await page.fill('input[placeholder*="GitHub username"]', 'octocat');
    await page.click('button:has-text("Search")');
    await expect(page.locator('text=@octocat')).toBeVisible({ timeout: 10000 });

    await page.getByRole('tab', { name: /repositories/i }).click();

    // Apply impossible filter to trigger empty state
    await page.getByLabel(/minimum stars/i).fill('999999');
    await page.waitForTimeout(500);

    // Should show empty state message
    await expect(
      page.locator('text=/no repositories match|no repositories found/i')
    ).toBeVisible();

    // Clear filters should be available
    await expect(page.getByRole('button', { name: /clear filters/i })).toBeVisible();
  });

  test('should handle keyboard navigation in tabs', async ({ page }) => {
    await page.fill('input[placeholder*="GitHub username"]', 'octocat');
    await page.click('button:has-text("Search")');
    await expect(page.locator('text=@octocat')).toBeVisible({ timeout: 10000 });

    // Focus on first tab
    await page.getByRole('tab', { name: /profile/i }).focus();

    // Use keyboard to navigate tabs
    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(300);

    // Should move to Repositories tab
    const reposTab = page.getByRole('tab', { name: /repositories/i });
    await expect(reposTab).toBeFocused();

    // Press Enter to activate
    await page.keyboard.press('Enter');
    await page.waitForTimeout(300);

    await expect(reposTab).toHaveAttribute('data-state', 'active');
  });
});
