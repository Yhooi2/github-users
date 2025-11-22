# MASTER PLAN: GitHub Profile Analyzer (Phase 8 — UX/UI Refactor)

**Status**: In Progress
**Date**: November 22, 2025
**Goal**: Best-in-class 3-level progressive disclosure interface

This is the unified master plan. Detailed specs are in `.claude/specs/` and `.claude/quick-ref/`.

---

## Key Decisions (Approved)

### Architecture
- **Maximum 3 levels** (Nielsen Norman Group approved)
- **shadcn/ui + Framer Motion + Recharts** for all components
- **Extend existing RepositoryCard** — variants: 'compact' | 'expanded' | 'minimal' (NO duplicates!)

### Level 2 Modal
- **4 Horizontal Tabs** (not vertical!): Overview, Timeline, Code, Team
- **Desktop**: Dialog modal, `w-[min(800px,90vw)]`
- **Mobile**: Sheet from bottom, `h-[90vh]`
- Lazy loading in tabs

### Responsive Behavior
- **Desktop (≥1440px)**: 33/67 split layout
- **Tablet (768-1439px)**: Fixed 280px left panel
- **Mobile (<768px)**: Accordion (one expanded at a time)
- **All years COLLAPSED by default** on ALL platforms (not expanded!)

### Metrics Display
- **5 compact metrics in profile header**: Activity, Impact, Quality, Growth, Authenticity
- Format: Icon + Name + Number
- Click → Dialog (desktop) / Sheet (mobile)

---

## Technical Requirements

### Hooks
- `useProgressiveDisclosure` — state management with URL persistence (`?modal=projectId`)
- `useReducedMotion` — `prefers-reduced-motion` accessibility support
- `useResponsive` — breakpoint detection

### Animation (Framer Motion)
- **AnimatePresence** for height:auto animations (NOT CSS max-height!)
- Duration: 300ms for expansion, 200ms for collapse
- Ease: `[0.4, 0, 0.2, 1]` (Material Design standard)
- Respect `prefers-reduced-motion` via useReducedMotion hook

### Styling
- **Language colors**: CSS variables (`hsl(var(--chart-1))`), NOT hardcoded hex
- **Modal width**: `w-[min(800px,90vw)]` for responsiveness
- shadcn color tokens for consistency

### States (Required for ALL components)
- Loading state (Skeleton)
- Error state (with retry button)
- Empty state (helpful message)

---

## Critical Rules

### MUST DO
- Use shadcn/ui for ALL components
- Framer Motion for height animations
- 33/67 split on ≥1440px
- **COLLAPSED by default** (mobile + desktop)
- Full Playwright E2E coverage
- Component → Storybook → Test workflow

### NEVER DO
- Create duplicate components (extend existing!)
- Use CSS max-height for accordion animation
- Hardcode colors (use CSS variables)
- Skip Storybook step
- Deploy without E2E tests
- "All expanded by default" — anti-pattern!

---

## Implementation Phases

| Phase | Description | Key Deliverables |
|-------|-------------|------------------|
| 1 | Level 0: Compact List | CompactProjectRow, YearSection |
| 2 | Level 1: Expandable Cards | ExpandableProjectCard with Framer Motion |
| 3 | Level 2: Modal with Tabs | HorizontalTabsNav (4 tabs), Dialog/Sheet |
| 4 | State Management | useProgressiveDisclosure, URL persistence |
| 5 | Animations | Framer Motion integration, useReducedMotion |
| 6 | Responsive | Breakpoints, mobile Sheet, desktop Dialog |
| 7 | Testing | Vitest + Playwright E2E |
| 8 | Performance | Lazy loading, virtualization for 50+ projects |

---

## File References

| Purpose | File |
|---------|------|
| Level 0 spec | `.claude/specs/level-0-compact-list.md` |
| Level 1 spec | `.claude/specs/level-1-expandable-card.md` |
| Level 2 spec | `.claude/specs/level-2-modal-tabs.md` |
| 3 Levels overview | `.claude/quick-ref/quick_ref_3_levels.md` |
| Responsive rules | `.claude/quick-ref/quick_ref_responsive.md` |
| Tech stack | `.claude/quick-ref/quick_ref_tech_stack.md` |
| Design tokens | `.claude/quick-ref/quick_ref_design_tokens.md` |
| Setup guide | `.claude/guides/phase-1-setup.md` |

---

For detailed breakdown see `.claude/specs/` and `.claude/quick-ref/`.
