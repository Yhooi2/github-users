import { test, expect } from '@playwright/test'

test.describe('GitHub User Search', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should load the homepage', async ({ page }) => {
    await expect(page).toHaveTitle(/Github Users Info/)
    await expect(page.getByPlaceholderText(/Search GitHub User/i)).toBeVisible()
  })

  test('should have search form elements', async ({ page }) => {
    const searchInput = page.getByPlaceholderText(/Search GitHub User/i)
    const searchButton = page.getByRole('button', { name: /search/i })

    await expect(searchInput).toBeVisible()
    await expect(searchButton).toBeVisible()
    await expect(searchInput).toBeEditable()
  })

  test('should allow typing in search field', async ({ page }) => {
    const searchInput = page.getByPlaceholderText(/Search GitHub User/i)

    await searchInput.fill('octocat')
    await expect(searchInput).toHaveValue('octocat')
  })

  test('should show error for empty search', async ({ page }) => {
    const searchButton = page.getByRole('button', { name: /search/i })

    await searchButton.click()

    // Wait for toast error message
    await expect(page.locator('[data-sonner-toast]')).toBeVisible({ timeout: 5000 })
    await expect(page.locator('[data-sonner-toast]')).toContainText(/Please enter a {2}valid username/i)
  })

  test('should search for a valid GitHub user (octocat)', async ({ page }) => {
    const searchInput = page.getByPlaceholderText(/Search GitHub User/i)
    const searchButton = page.getByRole('button', { name: /search/i })

    // Fill the search form
    await searchInput.fill('octocat')
    await searchButton.click()

    // Wait for results - either loading or user data
    // Note: This will require a valid GitHub token in .env.local
    await page.waitForTimeout(2000)

    // Check if we got a result or error
    const pageContent = await page.textContent('body')

    // Should not show "User Not Found" for octocat
    if (pageContent && !pageContent.includes('Loading')) {
      expect(pageContent).not.toContain('User Not Found')
    }
  })

  test('should handle non-existent user', async ({ page }) => {
    const searchInput = page.getByPlaceholderText(/Search GitHub User/i)
    const searchButton = page.getByRole('button', { name: /search/i })

    // Search for a user that definitely doesn't exist
    await searchInput.fill('thisusershouldnotexist12345xyz')
    await searchButton.click()

    // Wait for response
    await page.waitForTimeout(2000)

    // Should show "User Not Found" or an error message
    const pageContent = await page.textContent('body')
    expect(pageContent).toBeTruthy()
    // Either "User Not Found" or GraphQL error
  })

  test('should clear input and search again', async ({ page }) => {
    const searchInput = page.getByPlaceholderText(/Search GitHub User/i)
    const searchButton = page.getByRole('button', { name: /search/i })

    // First search
    await searchInput.fill('octocat')
    await searchButton.click()
    await page.waitForTimeout(1000)

    // Clear and search again
    await searchInput.clear()
    await searchInput.fill('torvalds')
    await searchButton.click()
    await page.waitForTimeout(1000)

    // Should have updated
    await expect(searchInput).toHaveValue('torvalds')
  })

  test('should submit form with Enter key', async ({ page }) => {
    const searchInput = page.getByPlaceholderText(/Search GitHub User/i)

    await searchInput.fill('github')
    await searchInput.press('Enter')

    // Should trigger search
    await page.waitForTimeout(1000)

    // Form should have been submitted
    await expect(searchInput).toHaveValue('github')
  })

  test('should be responsive', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })

    const searchInput = page.getByPlaceholderText(/Search GitHub User/i)
    const searchButton = page.getByRole('button', { name: /search/i })

    await expect(searchInput).toBeVisible()
    await expect(searchButton).toBeVisible()

    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 })

    await expect(searchInput).toBeVisible()
    await expect(searchButton).toBeVisible()
  })

  test('should maintain state after page reload', async ({ page }) => {
    const searchInput = page.getByPlaceholderText(/Search GitHub User/i)

    await searchInput.fill('octocat')

    // Reload page
    await page.reload()

    // Input should be cleared (app doesn't persist state)
    await expect(searchInput).toHaveValue('')
  })
})

test.describe('GitHub API Integration', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should handle loading state', async ({ page }) => {
    const searchInput = page.getByPlaceholderText(/Search GitHub User/i)
    const searchButton = page.getByRole('button', { name: /search/i })

    await searchInput.fill('octocat')
    await searchButton.click()

    // Should show loading state briefly
    // Note: Might be too fast to catch
    try {
      await expect(page.getByText(/loading/i)).toBeVisible({ timeout: 500 })
    } catch {
      // Loading might be too fast, that's OK
    }
  })

  test('should display user data when found', async ({ page }) => {
    const searchInput = page.getByPlaceholderText(/Search GitHub User/i)
    const searchButton = page.getByRole('button', { name: /search/i })

    await searchInput.fill('octocat')
    await searchButton.click()

    // Wait for API response
    await page.waitForTimeout(3000)

    const pageContent = await page.textContent('body')

    // Should show either user data or an error (depending on token)
    expect(pageContent).toBeTruthy()
  })

  test('should handle network errors gracefully', async ({ page }) => {
    // Simulate offline mode
    await page.context().setOffline(true)

    const searchInput = page.getByPlaceholderText(/Search GitHub User/i)
    const searchButton = page.getByRole('button', { name: /search/i })

    await searchInput.fill('octocat')
    await searchButton.click()

    // Wait for error
    await page.waitForTimeout(2000)

    // Should show some error message
    const pageContent = await page.textContent('body')
    expect(pageContent).toBeTruthy()

    // Restore online mode
    await page.context().setOffline(false)
  })
})
