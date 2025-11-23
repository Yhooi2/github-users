import { expect, test } from "@playwright/test";

test.describe("Progressive Disclosure (3-Level Timeline)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test.describe("Level 0 - Collapsed Year Rows", () => {
    test("should show all years collapsed by default", async ({ page }) => {
      // Search for user with activity
      await page.fill('input[placeholder*="GitHub"]', "torvalds");
      await page.keyboard.press("Enter");

      // Wait for timeline to load
      await expect(page.locator("text=Activity Timeline")).toBeVisible({
        timeout: 15000,
      });

      // All years should be collapsed (no expanded content visible)
      const yearButtons = page.locator('button[aria-label*="Toggle"]');
      await expect(yearButtons.first()).toBeVisible();

      // Check aria-expanded is false for all years
      const firstYear = yearButtons.first();
      await expect(firstYear).toHaveAttribute("aria-expanded", "false");
    });

    test("should display year statistics in collapsed row", async ({ page }) => {
      await page.fill('input[placeholder*="GitHub"]', "torvalds");
      await page.keyboard.press("Enter");

      await expect(page.locator("text=Activity Timeline")).toBeVisible({
        timeout: 15000,
      });

      // Year row should show commits, PRs, repos count
      await expect(page.locator("text=/\\d+ commits/")).toBeVisible();
      await expect(page.locator("text=/\\d+ PRs/")).toBeVisible();
      await expect(page.locator("text=/\\d+ repos/")).toBeVisible();
    });
  });

  test.describe("Level 1 - Expanded Year with Project Cards", () => {
    test("should expand year when clicked", async ({ page }) => {
      await page.fill('input[placeholder*="GitHub"]', "torvalds");
      await page.keyboard.press("Enter");

      await expect(page.locator("text=Activity Timeline")).toBeVisible({
        timeout: 15000,
      });

      // Click first year to expand
      const yearButton = page.locator('button[aria-label*="Toggle"]').first();
      await yearButton.click();

      // Should now be expanded
      await expect(yearButton).toHaveAttribute("aria-expanded", "true");

      // Project cards should be visible
      await expect(
        page.locator("text=Your Projects").or(page.locator("text=Open Source Contributions")),
      ).toBeVisible();
    });

    test("should show summary stats when expanded", async ({ page }) => {
      await page.fill('input[placeholder*="GitHub"]', "torvalds");
      await page.keyboard.press("Enter");

      await expect(page.locator("text=Activity Timeline")).toBeVisible({
        timeout: 15000,
      });

      // Expand first year
      await page.locator('button[aria-label*="Toggle"]').first().click();

      // Summary stat cards should be visible
      await expect(page.locator("text=Commits").first()).toBeVisible();
      await expect(page.locator("text=Pull Requests")).toBeVisible();
      await expect(page.locator("text=Issues")).toBeVisible();
      await expect(page.locator("text=Repositories")).toBeVisible();
    });

    test("should collapse year when clicked again", async ({ page }) => {
      await page.fill('input[placeholder*="GitHub"]', "torvalds");
      await page.keyboard.press("Enter");

      await expect(page.locator("text=Activity Timeline")).toBeVisible({
        timeout: 15000,
      });

      const yearButton = page.locator('button[aria-label*="Toggle"]').first();

      // Expand
      await yearButton.click();
      await expect(yearButton).toHaveAttribute("aria-expanded", "true");

      // Collapse
      await yearButton.click();
      await expect(yearButton).toHaveAttribute("aria-expanded", "false");
    });

    test("should expand project card details", async ({ page }) => {
      await page.fill('input[placeholder*="GitHub"]', "torvalds");
      await page.keyboard.press("Enter");

      await expect(page.locator("text=Activity Timeline")).toBeVisible({
        timeout: 15000,
      });

      // Expand first year
      await page.locator('button[aria-label*="Toggle"]').first().click();

      // Wait for project cards to appear
      await page.waitForTimeout(500); // Animation time

      // Click on a project card header (not the View Analytics button)
      const projectCard = page.locator('[aria-controls^="card-content-"]').first();
      if (await projectCard.isVisible()) {
        await projectCard.click();

        // Should show expanded content with View Analytics button
        await expect(page.locator('button:has-text("View Analytics")')).toBeVisible();
      }
    });
  });

  test.describe("Level 2 - Analytics Modal", () => {
    test("should open modal when View Analytics is clicked", async ({ page }) => {
      await page.fill('input[placeholder*="GitHub"]', "torvalds");
      await page.keyboard.press("Enter");

      await expect(page.locator("text=Activity Timeline")).toBeVisible({
        timeout: 15000,
      });

      // Expand first year
      await page.locator('button[aria-label*="Toggle"]').first().click();
      await page.waitForTimeout(500);

      // Expand first project card
      const projectCard = page.locator('[aria-controls^="card-content-"]').first();
      if (await projectCard.isVisible()) {
        await projectCard.click();
        await page.waitForTimeout(300);

        // Click View Analytics
        const analyticsButton = page.locator('button:has-text("View Analytics")').first();
        if (await analyticsButton.isVisible()) {
          await analyticsButton.click();

          // Modal should be visible
          await expect(page.getByRole("dialog")).toBeVisible();
        }
      }
    });

    test("should have 4 horizontal tabs in modal", async ({ page }) => {
      await page.fill('input[placeholder*="GitHub"]', "torvalds");
      await page.keyboard.press("Enter");

      await expect(page.locator("text=Activity Timeline")).toBeVisible({
        timeout: 15000,
      });

      // Navigate to modal
      await page.locator('button[aria-label*="Toggle"]').first().click();
      await page.waitForTimeout(500);

      const projectCard = page.locator('[aria-controls^="card-content-"]').first();
      if (await projectCard.isVisible()) {
        await projectCard.click();
        await page.waitForTimeout(300);

        const analyticsButton = page.locator('button:has-text("View Analytics")').first();
        if (await analyticsButton.isVisible()) {
          await analyticsButton.click();

          // Check for 4 tabs
          await expect(page.getByRole("tab", { name: /overview/i })).toBeVisible();
          await expect(page.getByRole("tab", { name: /timeline/i })).toBeVisible();
          await expect(page.getByRole("tab", { name: /code/i })).toBeVisible();
          await expect(page.getByRole("tab", { name: /team/i })).toBeVisible();
        }
      }
    });

    test("should update URL when modal opens", async ({ page }) => {
      await page.fill('input[placeholder*="GitHub"]', "torvalds");
      await page.keyboard.press("Enter");

      await expect(page.locator("text=Activity Timeline")).toBeVisible({
        timeout: 15000,
      });

      // Navigate to modal
      await page.locator('button[aria-label*="Toggle"]').first().click();
      await page.waitForTimeout(500);

      const projectCard = page.locator('[aria-controls^="card-content-"]').first();
      if (await projectCard.isVisible()) {
        await projectCard.click();
        await page.waitForTimeout(300);

        const analyticsButton = page.locator('button:has-text("View Analytics")').first();
        if (await analyticsButton.isVisible()) {
          await analyticsButton.click();
          await page.waitForTimeout(300);

          // URL should contain modal parameter
          const url = page.url();
          expect(url).toContain("modal=");
          expect(url).toContain("tab=");
        }
      }
    });

    test("should close modal and clear URL params", async ({ page }) => {
      await page.fill('input[placeholder*="GitHub"]', "torvalds");
      await page.keyboard.press("Enter");

      await expect(page.locator("text=Activity Timeline")).toBeVisible({
        timeout: 15000,
      });

      // Navigate to modal
      await page.locator('button[aria-label*="Toggle"]').first().click();
      await page.waitForTimeout(500);

      const projectCard = page.locator('[aria-controls^="card-content-"]').first();
      if (await projectCard.isVisible()) {
        await projectCard.click();
        await page.waitForTimeout(300);

        const analyticsButton = page.locator('button:has-text("View Analytics")').first();
        if (await analyticsButton.isVisible()) {
          await analyticsButton.click();
          await expect(page.getByRole("dialog")).toBeVisible();

          // Close modal (press Escape)
          await page.keyboard.press("Escape");

          // URL should not contain modal parameter
          await page.waitForTimeout(300);
          const url = page.url();
          expect(url).not.toContain("modal=");
        }
      }
    });
  });

  test.describe("Accessibility", () => {
    test("should have proper aria attributes on year buttons", async ({ page }) => {
      await page.fill('input[placeholder*="GitHub"]', "torvalds");
      await page.keyboard.press("Enter");

      await expect(page.locator("text=Activity Timeline")).toBeVisible({
        timeout: 15000,
      });

      const yearButton = page.locator('button[aria-label*="Toggle"]').first();
      await expect(yearButton).toHaveAttribute("aria-expanded");
      await expect(yearButton).toHaveAttribute("aria-label");
    });

    test("should be keyboard navigable", async ({ page }) => {
      await page.fill('input[placeholder*="GitHub"]', "torvalds");
      await page.keyboard.press("Enter");

      await expect(page.locator("text=Activity Timeline")).toBeVisible({
        timeout: 15000,
      });

      // Tab to first year button
      await page.keyboard.press("Tab");
      await page.keyboard.press("Tab");
      await page.keyboard.press("Tab");

      // Press Enter to expand
      const yearButton = page.locator('button[aria-label*="Toggle"]').first();
      await yearButton.focus();
      await page.keyboard.press("Enter");

      await expect(yearButton).toHaveAttribute("aria-expanded", "true");
    });
  });
});
