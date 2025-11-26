import { chromium } from '@playwright/test';

const visualTestStories = [
  'design-system-visual-tests-glasscard--all-intensities-all-themes',
  'design-system-visual-tests-glasscard--all-glow-colors-all-themes',
  'design-system-visual-tests-glassbutton--all-variants-all-themes',
  'design-system-visual-tests-glassbutton--all-sizes-all-themes',
  'design-system-visual-tests-avatar--all-sizes-all-themes',
  'design-system-visual-tests-avatar--different-gradients-all-themes',
  'design-system-visual-tests-background--background-all-themes',
  'design-system-visual-tests-metriccard--score-colors-all-themes',
  'design-system-visual-tests-glassinput--all-states-all-themes',
  'design-system-visual-tests-glassselect--options-all-themes',
  'design-system-visual-tests-glassprogress--progress-values-all-themes',
  'design-system-visual-tests-glasstoggle--toggle-states-all-themes',
  'design-system-visual-tests-glassbadge--all-variants-all-themes',
  'design-system-visual-tests-header--header-all-themes',
  'design-system-visual-tests-alert--all-variants-all-themes',
  'design-system-visual-tests-statusindicator--status-types-all-themes',
  'design-system-visual-tests-languagebar--language-distributions-all-themes',
  'design-system-visual-tests-tabtoggle--tab-states-all-themes',
  'design-system-visual-tests-themetoggle--theme-toggle-all-themes',
  'design-system-visual-tests-searchbar--search-states-all-themes',
  'design-system-visual-tests-iconbutton--icon-variants-all-themes',
  'design-system-visual-tests-designsystemoverview--design-system-overview',
];

async function checkVisualTests() {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  const results = { passed: 0, failed: 0, errors: [] };

  console.log('🔍 Checking Design System Visual Tests...\n');
  console.log('=' .repeat(60));

  for (const story of visualTestStories) {
    const pageErrors = [];
    page.on('pageerror', err => pageErrors.push(err.message));

    const url = 'http://localhost:6006/iframe.html?viewMode=story&id=' + story;
    const name = story.replace('design-system-visual-tests-', '').replace('--', ' → ');

    try {
      await page.goto(url, { waitUntil: 'networkidle', timeout: 20000 });
      await page.waitForTimeout(2000);

      // Check for render errors
      const errorVisible = await page.evaluate(() => {
        const errDisplay = document.querySelector('.sb-errordisplay');
        if (errDisplay) {
          const style = window.getComputedStyle(errDisplay);
          return style.display !== 'none';
        }
        return false;
      });

      // Check that content rendered
      const hasContent = await page.evaluate(() => {
        const root = document.querySelector('#storybook-root');
        return root && root.children.length > 0;
      });

      if (errorVisible) {
        const errorText = await page.evaluate(() => {
          const err = document.querySelector('.sb-errordisplay');
          return err ? err.textContent.slice(0, 200) : 'Unknown error';
        });
        console.log('❌ ' + name);
        console.log('   Error: ' + errorText.slice(0, 80));
        results.failed++;
        results.errors.push({ story, error: errorText });
      } else if (!hasContent) {
        console.log('⚠️  ' + name + ' - No content rendered');
        results.failed++;
      } else if (pageErrors.length > 0) {
        console.log('❌ ' + name);
        console.log('   JS Error: ' + pageErrors[0].slice(0, 80));
        results.failed++;
        results.errors.push({ story, error: pageErrors[0] });
      } else {
        console.log('✅ ' + name);
        results.passed++;
      }
    } catch (e) {
      console.log('⚠️  ' + name + ' - Timeout');
      results.failed++;
    }

    // Clear error listeners for next iteration
    page.removeAllListeners('pageerror');
  }

  await browser.close();

  console.log('\n' + '=' .repeat(60));
  console.log('\n📊 RESULTS:');
  console.log('   ✅ Passed: ' + results.passed);
  console.log('   ❌ Failed: ' + results.failed);
  console.log('   Total:   ' + visualTestStories.length);
  console.log('\n   Coverage: ' + Math.round(results.passed / visualTestStories.length * 100) + '%');

  if (results.errors.length > 0) {
    console.log('\n🔴 ERRORS FOUND - Fix before refactoring!');
    process.exit(1);
  } else {
    console.log('\n🟢 All visual tests pass - Safe to refactor!');
    process.exit(0);
  }
}

checkVisualTests().catch(err => {
  console.error('Script error:', err);
  process.exit(1);
});
