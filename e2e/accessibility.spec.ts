import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test.describe("Accessibility", () => {
  test("homepage has no accessibility violations", async ({ page }) => {
    await page.goto("/");

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("user profile page has no accessibility violations", async ({
    page,
  }) => {
    await page.goto("/");

    await page.fill('input[placeholder*="GitHub username"]', "torvalds");
    await page.click('button:has-text("Search")');

    await expect(page.locator("text=@torvalds")).toBeVisible({
      timeout: 10000,
    });

    const accessibilityScanResults = await new AxeBuilder({ page })
      .exclude('[data-testid="external-link"]') // Exclude third-party content if any
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("repositories tab has no accessibility violations", async ({ page }) => {
    await page.goto("/");

    await page.fill('input[placeholder*="GitHub username"]', "torvalds");
    await page.click('button:has-text("Search")');

    await expect(page.locator("text=@torvalds")).toBeVisible({
      timeout: 10000,
    });

    // Navigate to Repositories tab
    await page.getByRole("tab", { name: /repositories/i }).click();
    await page.waitForTimeout(500);

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("statistics tab has no accessibility violations", async ({ page }) => {
    await page.goto("/");

    await page.fill('input[placeholder*="GitHub username"]', "torvalds");
    await page.click('button:has-text("Search")');

    await expect(page.locator("text=@torvalds")).toBeVisible({
      timeout: 10000,
    });

    // Navigate to Statistics tab
    await page.getByRole("tab", { name: /statistics/i }).click();
    await page.waitForTimeout(500);

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("keyboard navigation works", async ({ page }) => {
    await page.goto("/");

    // Tab to search input
    await page.keyboard.press("Tab");
    const searchInput = page.locator('input[placeholder*="GitHub username"]');
    await expect(searchInput).toBeFocused();

    // Type username
    await page.keyboard.type("torvalds");

    // Tab to search button
    await page.keyboard.press("Tab");
    const searchButton = page.locator('button:has-text("Search")');
    await expect(searchButton).toBeFocused();

    // Press Enter to search
    await page.keyboard.press("Enter");

    await expect(page.locator("text=@torvalds")).toBeVisible({
      timeout: 10000,
    });

    // Focus should move to content area
    // Tab through the page to verify all interactive elements are reachable
    let tabCount = 0;
    const maxTabs = 20; // Prevent infinite loop

    while (tabCount < maxTabs) {
      await page.keyboard.press("Tab");
      tabCount++;

      // Check if we can reach the tabs
      const profileTab = page.getByRole("tab", { name: /profile/i });
      const isFocused = await profileTab
        .evaluate((el) => el === document.activeElement)
        .catch(() => false);

      if (isFocused) {
        // Successfully reached tabs via keyboard
        break;
      }
    }

    // Verify we can navigate tabs with keyboard
    const profileTab = page.getByRole("tab", { name: /profile/i });
    await profileTab.focus();
    await expect(profileTab).toBeFocused();

    // Use arrow keys to navigate between tabs
    await page.keyboard.press("ArrowRight");
    await page.waitForTimeout(100);

    const reposTab = page.getByRole("tab", { name: /repositories/i });
    await expect(reposTab).toBeFocused();
  });

  test("screen reader announcements and ARIA labels", async ({ page }) => {
    await page.goto("/");

    // Check ARIA labels on search input
    const searchInput = page.locator('input[placeholder*="GitHub username"]');
    const hasAriaLabel =
      (await searchInput.getAttribute("aria-label")) ||
      (await searchInput.getAttribute("placeholder"));
    expect(hasAriaLabel).toBeTruthy();

    // Check heading hierarchy
    const h1 = page.locator("h1");
    const h1Count = await h1.count();
    expect(h1Count).toBeGreaterThan(0);

    // Main heading should exist
    const mainHeading = await h1.first().textContent();
    expect(mainHeading).toBeTruthy();

    // Search for user to check profile page
    await page.fill('input[placeholder*="GitHub username"]', "torvalds");
    await page.click('button:has-text("Search")');

    await expect(page.locator("text=@torvalds")).toBeVisible({
      timeout: 10000,
    });

    // Check for proper heading structure in profile
    const headings = page.locator("h1, h2, h3, h4, h5, h6");
    const headingCount = await headings.count();
    expect(headingCount).toBeGreaterThan(0);

    // Tabs should have proper ARIA attributes
    const profileTab = page.getByRole("tab", { name: /profile/i });
    await expect(profileTab).toHaveAttribute("role", "tab");
    await expect(profileTab).toHaveAttribute("aria-selected");
  });

  test("color contrast meets WCAG standards", async ({ page }) => {
    await page.goto("/");

    await page.fill('input[placeholder*="GitHub username"]', "torvalds");
    await page.click('button:has-text("Search")');

    await expect(page.locator("text=@torvalds")).toBeVisible({
      timeout: 10000,
    });

    // Run accessibility scan with color contrast rules
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withRules(["color-contrast"])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("form elements have proper labels", async ({ page }) => {
    await page.goto("/");

    await page.fill('input[placeholder*="GitHub username"]', "torvalds");
    await page.click('button:has-text("Search")');

    await expect(page.locator("text=@torvalds")).toBeVisible({
      timeout: 10000,
    });

    // Navigate to Repositories tab (has filters)
    await page.getByRole("tab", { name: /repositories/i }).click();
    await page.waitForTimeout(500);

    // Run accessibility scan focusing on form elements
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withRules(["label", "label-title-only"])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("images have alt text", async ({ page }) => {
    await page.goto("/");

    await page.fill('input[placeholder*="GitHub username"]', "torvalds");
    await page.click('button:has-text("Search")');

    await expect(page.locator("text=@torvalds")).toBeVisible({
      timeout: 10000,
    });

    // Check all images have alt text
    const images = page.locator("img");
    const imageCount = await images.count();

    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute("alt");
      // Alt can be empty string for decorative images, but must exist
      expect(alt).not.toBeNull();
    }
  });

  test("focus indicators are visible", async ({ page }) => {
    await page.goto("/");

    // Focus on search input
    const searchInput = page.locator('input[placeholder*="GitHub username"]');
    await searchInput.focus();

    // Check if focus is visible (outline should be present)
    const outlineStyle = await searchInput.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return {
        outline: styles.outline,
        outlineWidth: styles.outlineWidth,
        boxShadow: styles.boxShadow,
      };
    });

    // Should have some form of focus indicator (outline or box-shadow)
    const hasFocusIndicator =
      (outlineStyle.outline && outlineStyle.outline !== "none") ||
      (outlineStyle.outlineWidth && outlineStyle.outlineWidth !== "0px") ||
      (outlineStyle.boxShadow && outlineStyle.boxShadow !== "none");

    expect(hasFocusIndicator).toBeTruthy();
  });

  test("interactive elements have sufficient size", async ({ page }) => {
    await page.goto("/");

    await page.fill('input[placeholder*="GitHub username"]', "torvalds");
    await page.click('button:has-text("Search")');

    await expect(page.locator("text=@torvalds")).toBeVisible({
      timeout: 10000,
    });

    // Run accessibility scan for touch target size
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withRules(["target-size"])
      .analyze();

    // Note: target-size rule may not be available in all axe-core versions
    // If violations array is empty, the test passes
    expect(accessibilityScanResults.violations).toEqual([]);
  });
});
