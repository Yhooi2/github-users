# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

GitHub User Analytics - React application for analyzing GitHub user profiles with 4 core metrics (Activity, Impact, Quality, Growth). Built with React 19, TypeScript, Vite 7, and Tailwind CSS v4.

### Current Status (November 2025)

**Phase 0-7:** Complete (core refactoring)
**Phase 8:** Complete (3-level progressive disclosure integration)
**Phase 5:** Complete (Animation Polish)
**Phase 9:** Complete (Desktop 33/67 Split Layout)
**Phase 10:** Complete (Plan Alignment Fixes)
**Production:** Deployed and operational
**Tests:** 1980 passing (100% pass rate)
**Coverage:** 91.36%

### Phase 10: Plan Alignment Fixes (Complete)

Fixes to align with `docs/UX&UI/github_profile_final_plan.md`:
- **5 Metrics in QuickAssessment:** Added Authenticity as 5th metric (optional)
- **Mobile Sheet for Metrics:** MetricExplanationModal uses Sheet on mobile, Dialog on desktop
- **Export PDF:** ProjectAnalyticsModal footer with Export PDF & Open on GitHub buttons

Updated components:
- `QuickAssessment.tsx` - 5 metrics, grid-cols-5
- `MetricExplanationModal.tsx` - Responsive Dialog/Sheet + authenticity support
- `ProjectAnalyticsModal.tsx` - Footer with action buttons

### Phase 9: Desktop 33/67 Split Layout (Complete)

Desktop (>=1440px) now uses 33/67 split layout:
- **Left Panel (33%):** YearCard components in scrollable sidebar
- **Right Panel (67%):** YearDetailPanel with stats and projects
- **Tablet/Mobile (<1440px):** Falls back to accordion layout

New components:
- `DesktopTimelineLayout.tsx` - Main grid container
- `YearCard.tsx` - Compact year card for sidebar
- `YearDetailPanel.tsx` - Detail view with stats

### Phase 8 Completed Components

| Level | Component | Status |
|-------|-----------|--------|
| 0 | CompactProjectRow, ProjectListContainer | Done |
| 1 | ExpandableProjectCard, ExpandedCardContent | Done |
| 2 | ProjectAnalyticsModal (4 tabs) | Done |
| Hooks | useProgressiveDisclosure, useReducedMotion, useResponsive | Done |
| Integration | ActivityTimelineV2, TimelineYearV2 | Done |
| Desktop | DesktopTimelineLayout, YearCard, YearDetailPanel | Done |
| E2E | progressive-disclosure.spec.ts | Done |

**Old components deprecated:** ActivityTimeline, TimelineYear, YearExpandedView

### Phase 5: Animation Polish ✅ Complete

**Implemented animations:**
- ✅ Hover effects (shadow + scale on cards)
- ✅ Stagger animation (cards appear sequentially with 50ms delay)
- ✅ Chevron rotation animation (180° smooth rotation)
- ✅ Active state ring borders (ring-2 ring-primary/20)
- ✅ Button micro-interactions (scale 1.02/0.98 on hover/tap)

**All animations respect `prefers-reduced-motion` via useReducedMotion hook**

**Files**: `docs/phases/master-plan.md`, `.claude/specs/`, `.claude/quick-ref/`

### Key Features

- **5 Metrics:** Activity, Impact, Quality, Growth, Authenticity (optional) scores
- **OAuth:** Optional GitHub authentication for personal rate limits (details: `docs/phases/phase-7-oauth-integration.md`)
- **Timeline:** Year-by-year contribution history with 33/67 split on desktop
- **Responsive:** Dialog on desktop, Sheet on mobile for modals
- **Security:** Server-side token storage, no secrets in client bundle

## Development Philosophy & Principles

### Core Workflow: Component → Storybook → Test

**Strict order MUST be maintained:**

1. Write component with TypeScript types.
2. Create `.stories.tsx` with all states/variants.
3. Build Storybook (`npm run build-storybook`).
4. Write `.test.tsx` based on stories.
5. Run tests (`npm test`).

**Why?** Ensures visual docs, edge cases, and MCP integration. Never skip Storybook! (Full example: `quick-ref/workflow-example.md`)

### Quality Standards

- **Tests:** Min 90% coverage; 100% for calculations.
- **TypeScript:** Strict mode; no `any`; descriptive props (e.g.,
  `UserAuthenticityProps`). See `quick-ref/code-quality.md` for full rules.
- **Components:** Use shadcn/ui (New York style); include loading/error/empty states; WCAG 2.1 AA.
- **Reusability:** Check Storybook first; reuse patterns from `lib/authenticity.ts`.

### Architectural Decisions

- Apollo for data; shadcn for UI.
- For details: See `quick-ref/architecture-summary.md` and `docs/apollo-client-guide.md`.

## Quick Navigation (Agent Guide)

| Task                    | Files to Read                      | Agent to Invoke            |
| ----------------------- | ---------------------------------- | -------------------------- |
| Understand Architecture | `quick-ref/3-levels-summary.md`    | teaching-mentor            |
| Implement Level 0       | `specs/level-0-compact-list.md`    | ui-design-specialist       |
| Implement Level 1       | `specs/level-1-expandable-card.md` | ui-design-specialist       |
| Implement Level 2       | `specs/level-2-modal-tabs.md`      | ui-design-specialist       |
| Responsive Design       | `quick-ref/responsive-rules.md`    | ux-optimization-specialist |
| Design Tokens           | `quick-ref/design_tokens.md`       | ui-design-specialist       |
| Tech Stack Overview     | `quick-ref/tech_stack.md`          | teaching-mentor            |
| Full Research & Plan    | `docs/phases/master-plan.md`       | teaching-mentor            |
| Setup Project           | `guides/phase-1-setup.md`          | -                          |
| Testing                 | `guides/testing-guide.md`          | test-runner-fixer          |
| Debug / Performance     | -                                  | debug-specialist           |
| Code Review             | -                                  | code-review-specialist     |

## Project Structure (important folders)

.claude/
├── quick-ref/ ← короткие справки (<300 строк)
├── specs/ ← детальные спецификации Level 0/1/2
├── guides/ ← пошаговые инструкции по фазам
├── agents/ ← кастомные агенты
└── examples/ ← код-примеры
docs/phases/ ← master-plan.md и phase-*.md

## MCP Servers

Active: Playwright, Storybook (build first), shadcn UI, Vite, Context7, Graphiti Memory.  
Setup: `quick-ref/mcp-setup.md`.

## Graphiti Memory Integration

## Graphiti Memory Usage

- After changes: Update key facts (e.g., "Tests: 1700+ passing (99.9%)")
- Command: mcp**graphiti**update("Project status: Phase 8 complete")

Key Facts: Refactoring complete; Apollo for data; 99.85% test pass. Update on changes.

For full details: See `docs/INDEX.md`.
