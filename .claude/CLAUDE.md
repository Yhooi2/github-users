# CLAUDE.md

## Project Overview

GitHub User Analytics - React 19 + TypeScript + Vite 7 + Tailwind CSS v4.
Analyzes GitHub profiles with 5 metrics: Activity, Impact, Quality, Growth, Authenticity.

**Status:** Production | Tests: 1980 (100%) | Coverage: 91.36%

## Commands

```bash
npm run dev          # Start dev server (port 5173)
npm test             # Run Vitest tests
npm run build        # Production build
npm run storybook    # Run Storybook (build first!)
npm run lint         # ESLint check
```

## Workflow: Component → Storybook → Test

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
├── graphql/        # Apollo queries & types
└── pages/          # Route components
```

**Stack:** Apollo Client (data), shadcn/ui (UI), Framer Motion (animations)

## Key Components

| Component | Purpose |
|-----------|---------|
| `CompactProjectRow` | Level 0 - ultra-compact list |
| `ExpandableProjectCard` | Level 1 - expandable with preview |
| `ProjectAnalyticsModal` | Level 2 - full analytics (4 tabs) |
| `DesktopTimelineLayout` | 33/67 split on desktop (>=1440px) |
| `MetricExplanationModal` | Sheet on mobile, Dialog on desktop |

## Quality Standards

- **Tests:** Min 90% coverage, 100% for calculations
- **TypeScript:** Strict mode, no `any`
- **Accessibility:** WCAG 2.1 AA
- **Animations:** Respect `prefers-reduced-motion`

## Documentation

| Topic | File |
|-------|------|
| Architecture | `docs/architecture.md` |
| Components | `docs/components-guide.md` |
| Apollo/GraphQL | `docs/apollo-client-guide.md` |
| Testing | `docs/phases/testing-guide.md` |
| OAuth | `docs/phases/phase-7-oauth-integration.md` |
| Design Tokens | `.claude/quick-ref/quick_ref_design_tokens.md` |
| Responsive | `.claude/quick-ref/quick_ref_responsive.md` |
| Tech Stack | `.claude/quick-ref/quick_ref_tech_stack.md` |
| **Design System** | `.claude/quick-ref/quick_ref_design_system.md` |
| **Visual Testing** | `.claude/quick-ref/quick_ref_visual_testing.md` |
| **Refactoring Guide** | `.claude/quick-ref/quick_ref_refactoring_guide.md` |
| Glassmorphism | `.claude/quick-ref/quick_ref_glassmorphism.md` |

## Quick Reference

**Breakpoints:** Mobile (<768) | Tablet (768-1439) | Desktop (>=1440)

**Metrics:** Activity (contributions), Impact (stars/forks), Quality (code patterns), Growth (trend), Authenticity (bot detection)

**OAuth:** Optional GitHub auth for higher rate limits. Server-side token storage.

## Design System (Glassmorphism UI Kit)

**Location:** `docs/design_system/`

| Stat | Value |
|------|-------|
| Components | 22 |
| Themes | 3 (light, aurora, glass) |
| Stories | 22 (100%) |
| Visual Tests | 23 (100%) |
| Unit Tests | 218 (100%) |

**Key files:**
- Components: `docs/design_system/*.tsx`
- Stories: `docs/design_system/stories/*.stories.tsx`
- Visual Tests: `docs/design_system/stories/visual-tests/*.visual.stories.tsx`
- Unit Tests: `docs/design_system/__tests__/*.test.tsx`

**Commands:**
```bash
npm test -- --run docs/design_system/__tests__/  # Unit tests
npm run build-storybook && npm run storybook     # Visual tests
```

## MCP Servers

Active: Playwright, Storybook, shadcn, Context7

Build Storybook before use: `npm run build-storybook`
