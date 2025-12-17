import { chromium } from 'playwright';

async function inspectSidebar(url, sidebarSelector, siteName) {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });
  const page = await context.newPage();

  console.log(`\n${'='.repeat(80)}`);
  console.log(`Inspecting: ${siteName}`);
  console.log(`URL: ${url}`);
  console.log(`${'='.repeat(80)}\n`);

  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 });
  } catch (e) {
    console.log(`⚠️  Warning: ${e.message}`);
  }

  // Wait a bit for dynamic content
  await page.waitForTimeout(3000);

  // Try to find the sidebar element
  const sidebar = await page.$(sidebarSelector);

  if (!sidebar) {
    console.log(`❌ Sidebar not found with selector: ${sidebarSelector}`);
    console.log('\nAvailable elements with "nav", "sidebar", or "aside" in class/id:');
    const elements = await page.$$eval('[class*="sidebar" i], [id*="sidebar" i], [class*="nav" i], aside',
      els => els.map(el => ({
        tag: el.tagName,
        id: el.id,
        classes: el.className,
        computed: {
          position: window.getComputedStyle(el).position,
          display: window.getComputedStyle(el).display
        }
      }))
    );
    console.log(JSON.stringify(elements, null, 2));
  } else {
    // Get computed styles
    const styles = await sidebar.evaluate(el => {
      const computed = window.getComputedStyle(el);
      return {
        // Element info
        tagName: el.tagName,
        id: el.id,
        className: el.className,

        // Position & Layout
        position: computed.position,
        top: computed.top,
        bottom: computed.bottom,
        left: computed.left,
        right: computed.right,
        zIndex: computed.zIndex,

        // Dimensions
        width: computed.width,
        height: computed.height,
        maxHeight: computed.maxHeight,
        minHeight: computed.minHeight,

        // Overflow
        overflow: computed.overflow,
        overflowY: computed.overflowY,
        overflowX: computed.overflowX,

        // Display
        display: computed.display,
        flexDirection: computed.flexDirection,

        // Spacing
        padding: computed.padding,
        margin: computed.margin,

        // Scroll
        scrollBehavior: computed.scrollBehavior,

        // Background (for glass effect detection)
        backgroundColor: computed.backgroundColor,
        backdropFilter: computed.backdropFilter,
        background: computed.background,

        // Border/Shadow (for glass effect)
        borderRadius: computed.borderRadius,
        boxShadow: computed.boxShadow,
        border: computed.border,
      };
    });

    console.log('📊 SIDEBAR ELEMENT INFO:');
    console.log(JSON.stringify(styles, null, 2));

    // Get parent container info
    const parentInfo = await sidebar.evaluate(el => {
      const parent = el.parentElement;
      const computed = window.getComputedStyle(parent);
      return {
        tagName: parent.tagName,
        className: parent.className,
        position: computed.position,
        display: computed.display,
        height: computed.height,
        overflow: computed.overflow,
      };
    });

    console.log('\n📦 PARENT CONTAINER INFO:');
    console.log(JSON.stringify(parentInfo, null, 2));

    // Test scroll behavior
    console.log('\n🖱️  TESTING SCROLL BEHAVIOR...');

    const initialScroll = await page.evaluate(() => window.scrollY);
    console.log(`Initial scroll position: ${initialScroll}px`);

    await page.evaluate(() => window.scrollBy(0, 500));
    await page.waitForTimeout(500);

    const afterScroll = await page.evaluate(() => window.scrollY);
    console.log(`After scrolling down 500px: ${afterScroll}px`);

    const sidebarRect = await sidebar.evaluate(el => {
      const rect = el.getBoundingClientRect();
      return {
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
      };
    });

    console.log('Sidebar position after scroll:', sidebarRect);

    // Check for any attached event listeners or intersection observers
    const hasScrollListener = await page.evaluate(() => {
      return window.getEventListeners ?
        Object.keys(window.getEventListeners(window)).includes('scroll') :
        'getEventListeners not available';
    });

    console.log(`Scroll event listeners: ${hasScrollListener}`);

    // Take a screenshot
    const screenshotPath = `/Users/art/code/git-user-info/screenshots/${siteName.replace(/\s+/g, '-').toLowerCase()}-sidebar.png`;
    await page.screenshot({ path: screenshotPath, fullPage: false });
    console.log(`\n📸 Screenshot saved: ${screenshotPath}`);
  }

  // Keep browser open for manual inspection
  console.log('\n⏳ Browser will stay open for 5 seconds for manual inspection...');
  await page.waitForTimeout(5000);

  await browser.close();
}

async function main() {
  // Create screenshots directory
  await import('fs').then(fs => {
    if (!fs.existsSync('/Users/art/code/git-user-info/screenshots')) {
      fs.mkdirSync('/Users/art/code/git-user-info/screenshots', { recursive: true });
    }
  });

  // Inspect MDN
  await inspectSidebar(
    'https://developer.mozilla.org/en-US/docs/Web/CSS/position',
    'nav.sidebar, aside.sidebar, [class*="sidebar"], .document-toc, aside',
    'MDN Web Docs'
  );

  // Inspect GitHub Docs
  await inspectSidebar(
    'https://docs.github.com/en/get-started/getting-started-with-git',
    'nav.sidebar, aside.sidebar, [class*="sidebar"], [data-testid*="sidebar"]',
    'GitHub Docs'
  );
}

main().catch(console.error);
