# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added
- A large set of UI building blocks and primitives under `src/components/ui/` (accordion, alert, avatar, badge, card, chart, checkbox, collapsible, progress, scroll-area, select, separator, skeleton, switch, table, tabs, tooltip) with Storybook stories and unit tests.
- New layout components under `src/components/layout/`: `EmptyState`, `ErrorState`, `LoadingState`, `MainTabs`, `Section`, `StatsCard`, `ThemeToggle` — plus stories/tests and an index export.
- Repository list and management UI under `src/components/repository/` including cards, tables, filters, pagination, sorting, and supporting stories/tests.
- User-focused components under `src/components/user/` (ContributionHistory, RecentActivity, UserAuthenticity, UserHeader, UserStats) with stories and tests.
- Hooks and data utilities in `src/hooks/` and `src/lib/` (authenticity, repository filters, sorting, statistics and helpers) with unit tests.
- Tests, mocks and test setup improvements (numerous `*.test.*` files and `src/test/setup.ts`).
- Documentation: `docs/progress-report.md` and several other docs added in prior commits.

### Changed
- Updated `src/components/SearchForm.tsx` and `src/components/UserProfile.tsx` to integrate with new UI primitives and hooks.
- Updated project configuration files and dependencies (`package.json`, `package-lock.json`).

### Other
- Added coverage and Playwright report artifacts to `coverage/` and `playwright-report/` (these files are typically generated and may be removed from commits in a subsequent cleanup).

---

## Recent commits

- 6ca0417 — feat: add UI components, hooks, and data utilities — 2025-11-06
- 12a9c3d — chore: set up Storybook, testing, and project infrastructure — 2025-11-05
- f72e70a — feat: implement Apollo Client integration with GitHub GraphQL API — 2025-08-22
- 92b575a — git ignore — 2025-08-21
- 91abe8e — feat: Add GitHub user search functionality with UI components — 2025-08-21
- aeda61a — pretter-eslint (scaffolding) — 2025-08-21
