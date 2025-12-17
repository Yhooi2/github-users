# CLAUDE.md

## Project Overview

GitHub User Analytics - React 19 + TypeScript + Vite 7 + Tailwind CSS v4.
Analyzes GitHub profiles with 7 metrics in 3 categories.

**Status:** Production | Tests: 1733 (100% passing) | Coverage: 93%+

## Commands

```bash
npm run dev          # Start dev server (port 5173)
npm test             # Run Vitest tests
npm run build        # Production build
npm run storybook    # Run Storybook (build first!)
npm run lint         # ESLint check
```

## Workflow: Component -> Storybook -> Test

1. Write component with TypeScript
2. Create `.stories.tsx` with all states
3. Build Storybook (`npm run build-storybook`)
4. Write `.test.tsx`
5. Run tests

**IMPORTANT:** Never skip Storybook - it integrates with MCP.

## Architecture

```
src/
├── components/     # React components (shadcn/ui)
├── hooks/          # Custom hooks (useProgressiveDisclosure, useReducedMotion)
├── lib/            # Business logic (metrics, authenticity)
├── apollo/         # Apollo Client setup & GraphQL queries
├── types/          # TypeScript type definitions
└── test/           # Test utilities & mocks
```

**Stack:** Apollo Client (data), shadcn/ui (UI), Framer Motion (animations)

## Key Components

### 3-Level Progressive Disclosure

| Component               | Purpose                                                           |
| ----------------------- | ----------------------------------------------------------------- |
| `CompactProjectRow`     | Level 0 - ultra-compact list (56px)                               |
| `ExpandableProjectCard` | Level 1 - expandable with preview                                 |
| `ProjectAnalyticsModal` | Level 2 - full analytics (4 tabs: Overview, Team, Code, Timeline) |

### Timeline Components

| Component               | Purpose                            |
| ----------------------- | ---------------------------------- |
| `ActivityTimelineV2`    | Year-by-year contribution timeline |
| `DesktopTimelineLayout` | 33/67 split layout (>=1440px)      |
| `YearCard`              | Left sidebar year card             |
| `YearDetailPanel`       | Right panel with year details      |

### Shared Components

| Component                | Purpose                                 |
| ------------------------ | --------------------------------------- |
| `MetricExplanationModal` | Sheet on mobile, Dialog on desktop      |
| `ActivityStatusDot`      | Active/Recent/Inactive status indicator |
| `LanguagesInline`        | Inline language badges                  |

## Quality Standards

- **Tests:** Target 90% coverage
- **TypeScript:** Strict mode, no `any`
- **Accessibility:** WCAG 2.1 AA
- **Animations:** Respect `prefers-reduced-motion`

## Documentation

| Topic          | File                                           |
| -------------- | ---------------------------------------------- |
| Architecture   | `docs/architecture.md`                         |
| Components     | `docs/components-guide.md`                     |
| Apollo/GraphQL | `docs/apollo-client-guide.md`                  |
| Testing        | `docs/phases/testing-guide.md`                 |
| OAuth          | `docs/phases/phase-7-oauth-integration.md`     |
| Design Tokens  | `.claude/quick-ref/quick_ref_design_tokens.md` |
| Responsive     | `.claude/quick-ref/quick_ref_responsive.md`    |
| Tech Stack     | `.claude/quick-ref/quick_ref_tech_stack.md`    |
| 3-Level System | `.claude/quick-ref/quick_ref_3_levels.md`      |
| **UX Roadmap** | `.claude/quick-ref/quick_ref_ux_roadmap.md`    |
| **Glass UI**   | `.claude/quick-ref/quick_ref_glass_ui.md`      |
| Glass UI Audit | `docs/GLASS_UI_LIBRARY_AUDIT.md`               |

## Quick Reference

**Breakpoints:** Mobile (<768) | Tablet (768-1439) | Desktop (>=1440)

**Metrics (7 in 3 categories):**

- **OUTPUT:** Activity (contributions), Impact (stars/forks)
- **QUALITY:** Quality (code patterns), Consistency (regularity)
- **TRUST:** Authenticity (bot detection), Collaboration (external contributions)
- **Special:** Growth (YoY trend, -100 to +100)

**OAuth:** Optional GitHub auth for higher rate limits. Server-side token storage.

## MCP Servers

Active: Playwright, Storybook, shadcn, Context7

Build Storybook before use: `npm run build-storybook`
