# Components Guide

> Comprehensive documentation for all React components in GitHub User Analytics

**Last Updated**: 2025-12-10
**Total Components**: 67 components across 11 categories
**Test Coverage**: 93%+
**Tests**: 1904 (100% passing)

**Related Documentation:**

- [Architecture Overview](./architecture.md) - System design and component architecture
- [Testing Guide](./phases/testing-guide.md) - Testing strategy and patterns
- [Design Tokens](../.claude/quick-ref/quick_ref_design_tokens.md) - Colors, spacing, typography

---

## Table of Contents

1. [3-Level Progressive Disclosure System](#3-level-progressive-disclosure-system)
2. [Timeline Components](#timeline-components)
3. [Assessment Components](#assessment-components)
4. [Shared Components](#shared-components)
5. [Layout Components](#layout-components)
6. [User Components](#user-components)
7. [Auth Components](#auth-components)
8. [UI Primitives (shadcn/ui)](#ui-primitives)
9. [Form Components](#form-components)

---

## 3-Level Progressive Disclosure System

The core architecture for displaying repository/project information. Users progressively reveal more detail by interacting with increasingly detailed views.

**Location**: `src/components/level-0/`, `src/components/level-1/`, `src/components/level-2/`

### Architecture Overview

| Level | Component             | Height     | Purpose                        |
| ----- | --------------------- | ---------- | ------------------------------ |
| 0     | CompactProjectRow     | 56px       | Ultra-compact list item        |
| 1     | ExpandableProjectCard | Variable   | Expandable card with preview   |
| 2     | ProjectAnalyticsModal | Full modal | Complete analytics with 4 tabs |

### Level 0: CompactProjectRow

**File**: `src/components/level-0/CompactProjectRow.tsx`

Ultra-compact row for dense project lists. Displays essential info at a glance.

**Props**:

```typescript
interface CompactProjectRowProps {
  project: CompactProject;
  onClick?: () => void;
  isSelected?: boolean;
}

interface CompactProject {
  id: string;
  name: string;
  commits: number;
  totalRepoCommits?: number;
  stars: number;
  language: string;
  languages?: LanguageInfo[];
  isOwner: boolean;
  isFork: boolean;
  description?: string;
  url?: string;
  lastActivityDate?: string;
}
```

**Features**:

- 56px fixed height
- Activity status indicator (green/yellow/gray dot)
- Language color indicator
- Star count with icon
- Owner/Fork badges
- Click to expand to Level 1

**Storybook**: `src/components/level-0/CompactProjectRow.stories.tsx`
**Tests**: `src/components/level-0/CompactProjectRow.test.tsx`

---

### Level 0: ProjectListContainer

**File**: `src/components/level-0/ProjectListContainer.tsx`

Container for CompactProjectRow items with virtualization support.

**Props**:

```typescript
interface ProjectListContainerProps {
  projects: CompactProject[];
  onProjectClick?: (project: CompactProject) => void;
  selectedId?: string;
  maxHeight?: string;
}
```

**Storybook**: `src/components/level-0/ProjectListContainer.stories.tsx`

---

### Level 1: ExpandableProjectCard

**File**: `src/components/level-1/ExpandableProjectCard.tsx`

Expandable card showing project preview with contribution metrics.

**Props**:

```typescript
interface ExpandableProjectCardProps {
  project: ExpandableProject;
  isExpanded: boolean;
  onToggle: () => void;
  onOpenModal?: () => void;
}

interface ExpandableProject extends CompactProject {
  forks: number;
  contributionPercent: number;
  totalCommits?: number;
  userCommits: number;
}
```

**Features**:

- Collapsed: Shows name, stars, language
- Expanded: Shows description, contribution %, language bar
- "View Details" button to open Level 2
- Animated expand/collapse with Framer Motion
- Respects prefers-reduced-motion

**Tests**: `src/components/level-1/ExpandableProjectCard.test.tsx`

---

### Level 1: MetricTooltip

**File**: `src/components/level-1/MetricTooltip.tsx`

Tooltip wrapper for metric explanations.

**Props**:

```typescript
interface MetricTooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  side?: "top" | "bottom" | "left" | "right";
  underline?: boolean;
  className?: string;
}
```

**Tests**: `src/components/level-1/MetricTooltip.test.tsx`

---

### Level 2: ProjectAnalyticsModal

**File**: `src/components/level-2/ProjectAnalyticsModal.tsx`

Full analytics modal with 4 tabs: Overview, Team, Code, Timeline.

**Props**:

```typescript
interface ProjectAnalyticsModalProps {
  project: ProjectForModal;
  isOpen: boolean;
  onClose: () => void;
}

interface ProjectForModal {
  id: string;
  name: string;
  description?: string;
  url: string;
  stars: number;
  forks: number;
}
```

**Tabs**:

| Tab      | File                   | Content                    |
| -------- | ---------------------- | -------------------------- |
| Overview | `tabs/OverviewTab.tsx` | Summary stats, description |
| Team     | `tabs/TeamTab.tsx`     | Contributors, roles        |
| Code     | `tabs/CodeTab.tsx`     | Languages, file structure  |
| Timeline | `tabs/TimelineTab.tsx` | Commit history             |

**Features**:

- Sheet on mobile, Dialog on desktop
- Keyboard navigation (Escape to close)
- Tab persistence within session
- Loading states for each tab

**Storybook**: `src/components/level-2/ProjectAnalyticsModal.stories.tsx`
**Tests**: `src/components/level-2/ProjectAnalyticsModal.test.tsx`

---

## Timeline Components

Year-by-year contribution timeline with desktop 33/67 split layout.

**Location**: `src/components/timeline/`

### Architecture Overview

```
Desktop (>=1440px):
┌─────────────────────────────────────────────────────────────┐
│                    CareerSummaryHeader                       │
├───────────────────┬─────────────────────────────────────────┤
│   YearCard (33%)  │          YearDetailPanel (67%)          │
│   YearCard        │                                         │
│   YearCard        │                                         │
│   ...             │                                         │
└───────────────────┴─────────────────────────────────────────┘

Mobile/Tablet (<1440px):
┌─────────────────────────────────────────────────────────────┐
│                    CareerSummaryHeader                       │
├─────────────────────────────────────────────────────────────┤
│                    TimelineYearV2 (accordion)               │
│                    TimelineYearV2                            │
│                    TimelineYearV2                            │
│                    ...                                       │
└─────────────────────────────────────────────────────────────┘
```

---

### ActivityTimelineV2

**File**: `src/components/timeline/ActivityTimelineV2.tsx`

Main timeline container. Orchestrates desktop/mobile layouts.

**Props**:

```typescript
interface ActivityTimelineV2Props {
  username: string;
  timeline: YearData[];
  loading?: boolean;
}
```

**Features**:

- Responsive layout switching at 1440px
- Manages selected year state
- Shows CareerSummaryHeader

**Storybook**: `src/components/timeline/ActivityTimelineV2.stories.tsx`
**Tests**: `src/components/timeline/ActivityTimelineV2.test.tsx`

---

### DesktopTimelineLayout

**File**: `src/components/timeline/DesktopTimelineLayout.tsx`

33/67 split layout for desktop (>=1440px).

**Props**:

```typescript
interface DesktopTimelineLayoutProps {
  username: string;
  timeline: YearData[];
  selectedYear: number | null;
  onYearSelect: (year: number | null) => void;
}
```

**Tests**: `src/components/timeline/DesktopTimelineLayout.test.tsx`

---

### YearCard

**File**: `src/components/timeline/YearCard.tsx`

Left sidebar year card (33% column).

**Props**:

```typescript
interface YearCardProps {
  year: YearData;
  isSelected: boolean;
  onClick: () => void;
  maxCommits: number;
}
```

**Features**:

- Year number with YearBadge
- Total commits count
- MiniActivityChart (12 months)
- Selected state highlight

**Tests**: `src/components/timeline/YearCard.test.tsx`

---

### YearBadge

**File**: `src/components/timeline/YearBadge.tsx`

Badge indicating year status (peak, growth, stable, etc.).

**Props**:

```typescript
interface YearBadgeProps {
  badge: YearBadgeType;
  size?: "sm" | "md";
}

interface YearBadgeType {
  type: "peak" | "growth" | "stable" | "start" | "decline" | "inactive";
  emoji: string;
  labelRu: string;
  color: string;
  description: string;
}
```

**Badge Types**:

| Type     | Emoji            | Russian Label      | Color   |
| -------- | ---------------- | ------------------ | ------- |
| peak     | fire             | Самый продуктивный | warning |
| growth   | chart_increasing | Рост активности    | success |
| stable   | balance_scale    | Стабильный год     | primary |
| start    | seedling         | Начало карьеры     | info    |
| decline  | chart_decreasing | Снижение           | muted   |
| inactive | zzz              | Малая активность   | muted   |

**Tests**: `src/components/timeline/YearBadge.test.tsx`

---

### YearDetailPanel

**File**: `src/components/timeline/YearDetailPanel.tsx`

Right panel (67% column) with year details.

**Props**:

```typescript
interface YearDetailPanelProps {
  year: YearData | null;
  timeline?: YearData[];
  username: string;
}
```

**Features**:

- Stats grid (commits, PRs, issues, repos)
- "Your Projects" section
- "Open Source Contributions" section
- Empty state for no data

**Tests**: `src/components/timeline/YearDetailPanel.test.tsx`

---

### CareerSummaryHeader

**File**: `src/components/timeline/CareerSummaryHeader.tsx`

Summary stats at top of timeline.

**Props**:

```typescript
interface CareerSummaryHeaderProps {
  summary: CareerSummary;
}

interface CareerSummary {
  totalCommits: number;
  totalPRs: number;
  yearsActive: number;
  totalYears: number;
  startYear: number;
  uniqueRepos: number;
}
```

**Tests**: `src/components/timeline/CareerSummaryHeader.test.tsx`

---

### MiniActivityChart

**File**: `src/components/timeline/MiniActivityChart.tsx`

Compact 12-bar monthly activity chart.

**Props**:

```typescript
interface MiniActivityChartProps {
  monthlyData: MonthlyContribution[];
  className?: string;
}
```

**Features**:

- 12 bars for 12 months
- Height relative to max contributions
- Tooltip on hover (via aria-label)
- Accessible labels

**Tests**: `src/components/timeline/MiniActivityChart.test.tsx`

---

### TimelineYearV2

**File**: `src/components/timeline/TimelineYearV2.tsx`

Accordion year item for mobile/tablet.

**Props**:

```typescript
interface TimelineYearV2Props {
  year: YearData;
  isExpanded: boolean;
  onToggle: () => void;
  username: string;
}
```

**Storybook**: `src/components/timeline/TimelineYearV2.stories.tsx`

---

### TimelineStatTooltip

**File**: `src/components/timeline/TimelineStatTooltip.tsx`

Tooltip for timeline statistics with detailed breakdown.

---

## Assessment Components

Metrics display with 7 metrics in 3 categories.

**Location**: `src/components/assessment/`

### Metrics System

| Category | Metrics                     | Description                 |
| -------- | --------------------------- | --------------------------- |
| OUTPUT   | Activity, Impact            | Production and influence    |
| QUALITY  | Quality, Consistency        | Code quality and regularity |
| TRUST    | Authenticity, Collaboration | Verification and teamwork   |
| Special  | Growth                      | YoY trend (-100 to +100)    |

---

### MetricAssessmentGrid

**File**: `src/components/assessment/MetricAssessmentGrid.tsx`

Main grid container for all metric categories.

**Props**:

```typescript
interface MetricAssessmentGridProps {
  metrics: AllMetricsData;
  languages?: LanguageSkill[];
  loading?: boolean;
  className?: string;
}
```

**Layout**:

- Desktop: 3-column grid (all expanded)
- Mobile: Accordion (collapsed by default)

**Tests**: `src/components/assessment/MetricAssessmentGrid.test.tsx`

---

### MetricCategoryCard

**File**: `src/components/assessment/MetricCategoryCard.tsx`

Category card displaying 2 metrics with category score.

**Props**:

```typescript
interface MetricCategoryCardProps {
  category: "OUTPUT" | "QUALITY" | "TRUST";
  categoryScore: number;
  metrics: MetricData[];
  loading?: boolean;
  onExplainMetric?: (metricKey: string) => void;
  isExpanded?: boolean;
  onToggle?: () => void;
}
```

**Tests**: `src/components/assessment/MetricCategoryCard.test.tsx`

---

### MetricRowCompact

**File**: `src/components/assessment/MetricRowCompact.tsx`

Compact metric row with score and progress bar.

**Props**:

```typescript
interface MetricRowCompactProps {
  icon: React.ReactNode;
  title: string;
  score: number;
  level: string;
  onInfoClick?: () => void;
  loading?: boolean;
}
```

**Score Colors**:

| Range  | Color  | Token       |
| ------ | ------ | ----------- |
| 80-100 | Green  | success     |
| 60-79  | Yellow | warning     |
| 40-59  | Orange | caution     |
| 0-39   | Red    | destructive |

**Tests**: `src/components/assessment/MetricRowCompact.test.tsx`

---

### MetricExplanationModal

**File**: `src/components/assessment/MetricExplanationModal.tsx`

Modal explaining metric calculation with breakdown.

**Props**:

```typescript
interface MetricExplanationModalProps {
  isOpen: boolean;
  onClose: () => void;
  metric: MetricKey;
  score: number;
  breakdown: Record<string, number>;
}
```

**Features**:

- Sheet on mobile, Dialog on desktop
- Visual breakdown chart
- Component explanations

**Tests**: `src/components/assessment/MetricExplanationModal.test.tsx`

---

### Additional Assessment Components

| Component              | File                         | Purpose                        |
| ---------------------- | ---------------------------- | ------------------------------ |
| MetricCard             | `MetricCard.tsx`             | Standalone metric card         |
| MetricTooltipContent   | `MetricTooltipContent.tsx`   | Tooltip content for metrics    |
| CategoryTooltipContent | `CategoryTooltipContent.tsx` | Tooltip content for categories |
| QuickAssessment        | `QuickAssessment.tsx`        | Quick metrics overview         |
| UserSkills             | `UserSkills.tsx`             | Language skill chips           |

---

## Shared Components

Reusable components across features.

**Location**: `src/components/shared/`

---

### ActivityStatusDot

**File**: `src/components/shared/ActivityStatusDot.tsx`

Status indicator showing activity level.

**Props**:

```typescript
interface ActivityStatusDotProps {
  lastActivityDate?: string;
  status?: "active" | "recent" | "inactive";
  showLabel?: boolean;
  size?: "sm" | "md";
}
```

**Status Logic**:

- Active (green, pulse): Last 30 days
- Recent (yellow): Last 90 days
- Inactive (gray): Over 90 days

**Tests**: `src/components/shared/ActivityStatusDot.test.tsx`

---

### HorizontalLanguageBar

**File**: `src/components/shared/HorizontalLanguageBar.tsx`

Horizontal bar showing language distribution.

**Props**:

```typescript
interface HorizontalLanguageBarProps {
  languages: Array<{ name: string; percent: number }>;
  height?: string;
  showLegend?: boolean;
}
```

**Storybook**: `src/components/shared/HorizontalLanguageBar.stories.tsx`
**Tests**: `src/components/shared/HorizontalLanguageBar.test.tsx`

---

### CombinedLanguageActivityBar

**File**: `src/components/shared/CombinedLanguageActivityBar.tsx`

Dual-dimension bar: width = activity, colors = languages.

**Props**:

```typescript
interface CombinedLanguageActivityBarProps {
  commitCount: number;
  maxCommits: number;
  languages: LanguageBreakdown[];
  isSelected?: boolean;
  compact?: boolean;
  barHeight?: string;
  className?: string;
}
```

**Features**:

- Width represents commits relative to max
- Colored segments show language percentages
- Animated with Framer Motion
- Tooltip with detailed breakdown

**Tests**: `src/components/shared/CombinedLanguageActivityBar.test.tsx`

---

## Layout Components

Common layout patterns and feedback states.

**Location**: `src/components/layout/`

---

### EmptyState

**File**: `src/components/layout/EmptyState.tsx`

Empty state placeholder with icon and action.

**Props**:

```typescript
interface EmptyStateProps {
  icon?: React.ComponentType<{ className?: string }>;
  title: string;
  description?: string;
  action?: React.ReactNode;
}
```

**Storybook**: `src/components/layout/EmptyState.stories.tsx`
**Tests**: `src/components/layout/EmptyState.test.tsx`

---

### ErrorState

**File**: `src/components/layout/ErrorState.tsx`

Error display with retry action.

**Props**:

```typescript
interface ErrorStateProps {
  title: string;
  message?: string;
  onRetry?: () => void;
}
```

**Storybook**: `src/components/layout/ErrorState.stories.tsx`
**Tests**: `src/components/layout/ErrorState.test.tsx`

---

### ErrorBoundary

**File**: `src/components/layout/ErrorBoundary.tsx`

React error boundary for graceful error handling.

**Storybook**: `src/components/layout/ErrorBoundary.stories.tsx`
**Tests**: `src/components/layout/ErrorBoundary.test.tsx`

---

### LoadingState

**File**: `src/components/layout/LoadingState.tsx`

Loading skeleton with variants.

**Props**:

```typescript
interface LoadingStateProps {
  variant?: "card" | "list" | "table" | "default";
  count?: number;
}
```

**Storybook**: `src/components/layout/LoadingState.stories.tsx`
**Tests**: `src/components/layout/LoadingState.test.tsx`

---

### ThemeToggle

**File**: `src/components/layout/ThemeToggle.tsx`

Dark/light mode toggle button.

**Features**:

- Three modes: light, dark, system
- Persists to localStorage
- Smooth transitions

**Storybook**: `src/components/layout/ThemeToggle.stories.tsx`
**Tests**: `src/components/layout/ThemeToggle.test.tsx`

---

### RateLimitBanner

**File**: `src/components/layout/RateLimitBanner.tsx`

Banner showing GitHub API rate limit status.

**Storybook**: `src/components/layout/RateLimitBanner.stories.tsx`
**Tests**: `src/components/layout/RateLimitBanner.test.tsx`

---

### SearchHeader

**File**: `src/components/layout/SearchHeader.tsx`

Header with search functionality.

**Storybook**: `src/components/layout/SearchHeader.stories.tsx`
**Tests**: `src/components/layout/SearchHeader.test.tsx`

---

### UserMenu

**File**: `src/components/layout/UserMenu.tsx`

User dropdown menu with auth status.

**Storybook**: `src/components/layout/UserMenu.stories.tsx`
**Tests**: `src/components/layout/UserMenu.test.tsx`

---

## User Components

User profile display components.

**Location**: `src/components/user/`

---

### UserHeader

**File**: `src/components/user/UserHeader.tsx`

User profile header with avatar, name, bio.

**Props**:

```typescript
interface UserHeaderProps {
  avatarUrl: string;
  name: string | null;
  login: string;
  bio: string | null;
  location: string | null;
  url: string;
  createdAt: string;
  authenticityScore?: number;
}
```

**Storybook**: `src/components/user/UserHeader.stories.tsx`
**Tests**: `src/components/user/UserHeader.test.tsx`

---

### LanguagesInline

**File**: `src/components/user/LanguagesInline.tsx`

Inline language badges with colors.

**Props**:

```typescript
interface LanguagesInlineProps {
  languages: Array<{ name: string; percent: number }>;
  maxItems?: number;
}
```

---

### UserProfile

**File**: `src/components/UserProfile.tsx`

Main user profile container (orchestrates all views).

**Props**:

```typescript
interface UserProfileProps {
  userName: string;
}
```

**Tests**:

- `src/components/UserProfile.hook-mocked.test.tsx`
- `src/components/UserProfile.mockedprovider.test.tsx`

---

## Auth Components

Authentication-related components.

**Location**: `src/components/auth/`

---

### AuthRequiredModal

**File**: `src/components/auth/AuthRequiredModal.tsx`

Modal prompting GitHub authentication for higher rate limits.

**Props**:

```typescript
interface AuthRequiredModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuth: () => void;
}
```

**Storybook**: `src/components/auth/AuthRequiredModal.stories.tsx`
**Tests**: `src/components/auth/AuthRequiredModal.test.tsx`

---

## UI Primitives

All UI primitives from **shadcn/ui** (New York style) built on Radix UI.

**Location**: `src/components/ui/`
**Style**: New York theme
**Accessibility**: WCAG 2.1 AA compliant

---

### Component List

| Component    | File                | Description                          |
| ------------ | ------------------- | ------------------------------------ |
| Accordion    | `accordion.tsx`     | Collapsible content sections         |
| Alert        | `alert.tsx`         | Alert messages                       |
| Avatar       | `avatar.tsx`        | User avatar with fallback            |
| Badge        | `badge.tsx`         | Small labeled element                |
| Button       | `button.tsx`        | Clickable button (6 variants)        |
| Card         | `card.tsx`          | Container with header/content/footer |
| Chart        | `chart.tsx`         | Recharts wrapper                     |
| Checkbox     | `checkbox.tsx`      | Boolean input                        |
| Collapsible  | `collapsible.tsx`   | Expandable container                 |
| Dialog       | `dialog.tsx`        | Modal dialog                         |
| DropdownMenu | `dropdown-menu.tsx` | Dropdown menu                        |
| HoverCard    | `hover-card.tsx`    | Card on hover                        |
| Input        | `input.tsx`         | Text input                           |
| Label        | `label.tsx`         | Form label                           |
| Progress     | `progress.tsx`      | Progress bar                         |
| ScrollArea   | `scroll-area.tsx`   | Custom scrollbar                     |
| Select       | `select.tsx`        | Dropdown selection                   |
| Separator    | `separator.tsx`     | Visual divider                       |
| Sheet        | `sheet.tsx`         | Slide-in panel                       |
| Skeleton     | `skeleton.tsx`      | Loading placeholder                  |
| Sonner       | `sonner.tsx`        | Toast notifications                  |
| Switch       | `switch.tsx`        | Toggle switch                        |
| Table        | `table.tsx`         | Data table                           |
| Tabs         | `tabs.tsx`          | Tab navigation                       |
| Tooltip      | `tooltip.tsx`       | Hover information                    |

---

## Form Components

---

### SearchForm

**File**: `src/components/SearchForm.tsx`

GitHub username search form.

**Props**:

```typescript
interface SearchFormProps {
  setUserName: (userName: string) => void;
}
```

**Features**:

- Input validation
- Enter key submission
- Error toast for empty input

**Storybook**: `src/components/SearchForm.stories.tsx`
**Tests**: `src/components/SearchForm.test.tsx`

---

## Component Patterns

### Responsive Breakpoints

| Breakpoint | Width      | Layout                     |
| ---------- | ---------- | -------------------------- |
| Mobile     | <768px     | Single column, accordions  |
| Tablet     | 768-1439px | 2 columns, compact         |
| Desktop    | >=1440px   | 33/67 split, full features |

### Accessibility Standards

- WCAG 2.1 AA compliance
- Keyboard navigation
- Screen reader support
- `prefers-reduced-motion` respected
- Proper ARIA labels

### Animation Guidelines

- Framer Motion for complex animations
- CSS transitions for simple states
- Always check `useReducedMotion()` hook
- 150-300ms duration for micro-interactions

### Testing Strategy

- Unit tests with Vitest + Testing Library
- Mocks for hooks and Apollo
- Storybook stories for visual testing
- Accessibility checks via a11y addon

---

## Running Tests

```bash
# All tests
npm test

# With coverage
npm run test:coverage

# Specific file
npm test -- ActivityTimelineV2

# Watch mode
npm test -- --watch
```

## Storybook

```bash
# Build first (required for MCP)
npm run build-storybook

# Run Storybook
npm run storybook
```

---

## Quick Reference

### Component Test Status

| Category   | Components | Tests | Coverage |
| ---------- | ---------- | ----- | -------- |
| Level 0-2  | 5          | 5/5   | 100%     |
| Timeline   | 9          | 9/9   | 100%     |
| Assessment | 8          | 8/8   | 100%     |
| Shared     | 3          | 3/3   | 100%     |
| Layout     | 8          | 8/8   | 100%     |
| User       | 3          | 3/3   | 100%     |
| Auth       | 1          | 1/1   | 100%     |
| UI         | 24         | 16/24 | 67%      |
| Form       | 1          | 1/1   | 100%     |

**Total**: 67 components, 1904 tests passing

---

**Note**: This guide is automatically updated. For the latest component list, run:

```bash
find src/components -name "*.tsx" ! -name "*.test.tsx" ! -name "*.stories.tsx" | wc -l
```
