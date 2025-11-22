# Development Commands - Quick Reference

> **Purpose**: List of essential npm scripts  
> **For usage**: See `docs/testing-guide.md` for details

### Essential Commands

```bash
npm run dev # Start dev server<a href="http://localhost:5173" target="_blank" rel="noopener noreferrer nofollow"></a>
npm run build # TypeScript compile + Vite production build
npm run lint # Run ESLint
npm run preview # Preview production build
# Testing
npm run test # Unit tests (Vitest, watch mode)
npm run test:ui # Vitest UI interface
npm run test:coverage # Generate coverage report
npm run test:e2e # Playwright E2E tests (headless)
npm run test:e2e:ui # Playwright UI mode
npm run test:all # Run all tests (unit + E2E)
# Storybook
npm run storybook # Start Storybook dev server (port 6006)
npm run build-storybook # Build static Storybook (required for MCP)Single Test ExecutionBash# Run specific test file
npx vitest src/components/SearchForm.test.tsx
# Run specific E2E test
npx playwright test e2e/user-search.spec.ts
# Run single test by name
npx vitest -t "renders search input and button"
```
