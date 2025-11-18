import { test, expect } from '@playwright/test';

// Extend Performance interface to include Chrome-specific memory property
interface PerformanceWithMemory extends Performance {
  memory?: {
    usedJSHeapSize: number;
    totalJSHeapSize: number;
    jsHeapSizeLimit: number;
  };
}

test.describe('Performance', () => {
  test('measures page load performance', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/');
    const loadTime = Date.now() - startTime;

    // Homepage should load within 3 seconds
    expect(loadTime).toBeLessThan(3000);

    // Check performance metrics
    const metrics = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      return {
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
        domInteractive: navigation.domInteractive - navigation.fetchStart,
      };
    });

    console.log('Performance metrics:', metrics);

    // DOM Interactive should be fast
    expect(metrics.domInteractive).toBeLessThan(2000);
  });

  test('measures first contentful paint', async ({ page }) => {
    await page.goto('/');

    const fcp = await page.evaluate(() => {
      return new Promise<number>((resolve) => {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const fcpEntry = entries.find((entry) => entry.name === 'first-contentful-paint');
          if (fcpEntry) {
            observer.disconnect();
            resolve(fcpEntry.startTime);
          }
        });
        observer.observe({ entryTypes: ['paint'] });

        // Timeout after 5 seconds
        setTimeout(() => {
          observer.disconnect();
          resolve(-1);
        }, 5000);
      });
    });

    console.log(`First Contentful Paint: ${fcp}ms`);

    // FCP should be under 1.8 seconds (good performance)
    expect(fcp).toBeLessThan(1800);
    expect(fcp).toBeGreaterThan(0);
  });

  test('measures largest contentful paint', async ({ page }) => {
    await page.goto('/');

    // Wait for page to fully load
    await page.waitForLoadState('networkidle');

    const lcp = await page.evaluate(() => {
      return new Promise<number>((resolve) => {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          if (lastEntry) {
            resolve(lastEntry.startTime);
          }
        });
        observer.observe({ entryTypes: ['largest-contentful-paint'] });

        // Timeout after 10 seconds
        setTimeout(() => {
          observer.disconnect();
          const lcpEntries = performance.getEntriesByType('largest-contentful-paint');
          if (lcpEntries.length > 0) {
            resolve(lcpEntries[lcpEntries.length - 1].startTime);
          } else {
            resolve(-1);
          }
        }, 10000);
      });
    });

    console.log(`Largest Contentful Paint: ${lcp}ms`);

    // LCP should be under 2.5 seconds (good performance)
    if (lcp > 0) {
      expect(lcp).toBeLessThan(2500);
    }
  });

  test('bundle size is within limits', async ({ page }) => {
    await page.goto('/');

    // Wait for all resources to load
    await page.waitForLoadState('networkidle');

    const resources = await page.evaluate(() =>
      performance
        .getEntriesByType('resource')
        .filter((r) => (r as PerformanceResourceTiming).initiatorType === 'script')
        .map((r) => ({
          name: r.name,
          size: (r as PerformanceResourceTiming).transferSize,
        }))
    );

    const totalSize = resources.reduce((sum, r) => sum + (r.size || 0), 0);

    console.log(`Total JS bundle size: ${(totalSize / 1024).toFixed(2)} KB`);
    console.log('Scripts loaded:', resources.length);

    // Total JS should be under 500KB (compressed)
    expect(totalSize).toBeLessThan(500 * 1024);
  });

  test('search and render user profile performance', async ({ page }) => {
    await page.goto('/');

    await page.fill('input[placeholder*="GitHub username"]', 'torvalds');

    const searchStartTime = Date.now();
    await page.click('button:has-text("Search")');

    // Wait for profile to load
    await expect(page.locator('text=@torvalds')).toBeVisible({ timeout: 10000 });
    const searchEndTime = Date.now();

    const searchDuration = searchEndTime - searchStartTime;
    console.log(`Search and render duration: ${searchDuration}ms`);

    // Should complete within 10 seconds (includes API call)
    expect(searchDuration).toBeLessThan(10000);
  });

  test('tab switching performance', async ({ page }) => {
    await page.goto('/');

    await page.fill('input[placeholder*="GitHub username"]', 'torvalds');
    await page.click('button:has-text("Search")');

    await expect(page.locator('text=@torvalds')).toBeVisible({ timeout: 10000 });

    // Measure tab switching performance
    const profileTab = page.getByRole('tab', { name: /profile/i });
    const reposTab = page.getByRole('tab', { name: /repositories/i });
    const statsTab = page.getByRole('tab', { name: /statistics/i });

    // Switch to Repositories
    const reposStartTime = Date.now();
    await reposTab.click();
    await expect(page.locator('[data-testid="repository-card"]').first()).toBeVisible();
    const reposSwitchTime = Date.now() - reposStartTime;

    console.log(`Repositories tab switch: ${reposSwitchTime}ms`);
    expect(reposSwitchTime).toBeLessThan(1000); // Should be instant

    // Switch to Statistics
    const statsStartTime = Date.now();
    await statsTab.click();
    await expect(page.getByRole('tab', { name: /overview/i })).toBeVisible();
    const statsSwitchTime = Date.now() - statsStartTime;

    console.log(`Statistics tab switch: ${statsSwitchTime}ms`);
    expect(statsSwitchTime).toBeLessThan(1000); // Should be instant

    // Switch back to Profile
    const profileStartTime = Date.now();
    await profileTab.click();
    await expect(page.locator('text=Activity')).toBeVisible();
    const profileSwitchTime = Date.now() - profileStartTime;

    console.log(`Profile tab switch: ${profileSwitchTime}ms`);
    expect(profileSwitchTime).toBeLessThan(1000); // Should be instant
  });

  test('repository filtering performance', async ({ page }) => {
    await page.goto('/');

    await page.fill('input[placeholder*="GitHub username"]', 'torvalds');
    await page.click('button:has-text("Search")');

    await expect(page.locator('text=@torvalds')).toBeVisible({ timeout: 10000 });

    // Navigate to Repositories
    await page.getByRole('tab', { name: /repositories/i }).click();
    await expect(page.locator('[data-testid="repository-card"]').first()).toBeVisible();

    // Measure filter application time
    const filterStartTime = Date.now();
    await page.getByLabel(/minimum stars/i).fill('10');
    await page.waitForTimeout(100); // Wait for debounce

    // Wait for filtered results
    await page.waitForTimeout(500);
    const filterTime = Date.now() - filterStartTime;

    console.log(`Filter application time: ${filterTime}ms`);

    // Filtering should be fast (client-side)
    expect(filterTime).toBeLessThan(1000);
  });

  test('memory usage stays reasonable', async ({ page }) => {
    await page.goto('/');

    // Get initial memory
    const initialMemory = await page.evaluate(() => {
      if ('memory' in performance) {
        return (performance as PerformanceWithMemory).memory?.usedJSHeapSize ?? 0;
      }
      return 0;
    });

    // Perform several searches
    const users = ['torvalds', 'octocat', 'github'];

    for (const user of users) {
      await page.fill('input[placeholder*="GitHub username"]', user);
      await page.click('button:has-text("Search")');
      await page.waitForTimeout(2000);

      // Navigate through tabs
      await page.getByRole('tab', { name: /repositories/i }).click();
      await page.waitForTimeout(500);
      await page.getByRole('tab', { name: /statistics/i }).click();
      await page.waitForTimeout(500);
      await page.getByRole('tab', { name: /profile/i }).click();
      await page.waitForTimeout(500);
    }

    // Get final memory
    const finalMemory = await page.evaluate(() => {
      if ('memory' in performance) {
        return (performance as PerformanceWithMemory).memory?.usedJSHeapSize ?? 0;
      }
      return 0;
    });

    if (initialMemory > 0 && finalMemory > 0) {
      const memoryIncrease = finalMemory - initialMemory;
      console.log(`Memory increase: ${(memoryIncrease / 1024 / 1024).toFixed(2)} MB`);

      // Memory increase should be reasonable (less than 50MB)
      expect(memoryIncrease).toBeLessThan(50 * 1024 * 1024);
    }
  });

  test('network requests are optimized', async ({ page }) => {
    // Track network requests
    const requests: string[] = [];

    page.on('request', (request) => {
      requests.push(request.url());
    });

    await page.goto('/');

    await page.fill('input[placeholder*="GitHub username"]', 'torvalds');
    await page.click('button:has-text("Search")');

    await expect(page.locator('text=@torvalds')).toBeVisible({ timeout: 10000 });

    // Filter API requests
    const apiRequests = requests.filter((url) => url.includes('api') || url.includes('graphql'));

    console.log(`Total requests: ${requests.length}`);
    console.log(`API requests: ${apiRequests.length}`);

    // Should make a reasonable number of API requests (not excessive)
    expect(apiRequests.length).toBeLessThan(10);
  });

  test('CSS and images are cached', async ({ page }) => {
    // First visit
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Get cached resources
    const cachedResources = await page.evaluate(() => {
      const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
      return resources
        .filter((r) => r.transferSize === 0 && r.decodedBodySize > 0)
        .map((r) => r.name);
    });

    console.log(`Cached resources on first load: ${cachedResources.length}`);

    // Reload page
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Check cached resources after reload
    const cachedResourcesAfterReload = await page.evaluate(() => {
      const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
      return resources
        .filter((r) => r.transferSize === 0 && r.decodedBodySize > 0)
        .map((r) => r.name);
    });

    console.log(`Cached resources after reload: ${cachedResourcesAfterReload.length}`);

    // After reload, more resources should be cached
    expect(cachedResourcesAfterReload.length).toBeGreaterThanOrEqual(cachedResources.length);
  });
});
