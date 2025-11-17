# Phase 4: Timeline Components (P1)

**Priority:** P1 (Important)
**Estimated Time:** 2 days
**Status:** Ready for Implementation

---

## 🎯 Goal

Build year-by-year activity timeline with collapsible years and project details.

**Current State:**
- RepositoryCard component exists (can reuse)
- Recharts already configured
- No timeline visualization

**Target State:**
- ActivityTimeline component (full history)
- TimelineYear (collapsible rows)
- YearExpandedView (detailed breakdown)
- Smooth expand/collapse animations

---

## 🏗️ Component Structure

```
ActivityTimeline (container)
  └─ TimelineYear (for each year, collapsible)
      └─ YearExpandedView (when expanded)
          ├─ Top Projects (reuses RepositoryCard)
          ├─ Language Distribution (reuses charts)
          └─ Monthly Activity (if data available)
```

---

## 📋 Implementation Steps

### Step 4.1: ActivityTimeline

**File:** `src/components/timeline/ActivityTimeline.tsx`

```typescript
import { YearData } from '@/hooks/useUserAnalytics'
import { TimelineYear } from './TimelineYear'

interface ActivityTimelineProps {
  timeline: YearData[]
  loading?: boolean
}

export function ActivityTimeline({ timeline, loading }: ActivityTimelineProps) {
  if (loading) {
    return <TimelineSkeleton />
  }

  if (!timeline.length) {
    return (
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">📊 Activity Timeline</h2>
        <div className="rounded-lg border p-8 text-center text-muted-foreground">
          No activity data available
        </div>
      </section>
    )
  }

  const maxCommits = Math.max(...timeline.map(y => y.totalCommits))

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-bold">📊 Activity Timeline</h2>

      <div className="space-y-2">
        {timeline.map(year => (
          <TimelineYear
            key={year.year}
            year={year}
            maxCommits={maxCommits}
          />
        ))}
      </div>
    </section>
  )
}

function TimelineSkeleton() {
  return (
    <section className="space-y-4">
      <div className="h-8 w-64 animate-pulse rounded bg-muted" />
      <div className="space-y-2">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="h-16 animate-pulse rounded-lg bg-muted" />
        ))}
      </div>
    </section>
  )
}
```

---

### Step 4.2: TimelineYear (Collapsible)

**File:** `src/components/timeline/TimelineYear.tsx`

```typescript
import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { YearData } from '@/hooks/useUserAnalytics'
import { YearExpandedView } from './YearExpandedView'

interface TimelineYearProps {
  year: YearData
  maxCommits: number
}

export function TimelineYear({ year, maxCommits }: TimelineYearProps) {
  const [expanded, setExpanded] = useState(false)
  const widthPercent = maxCommits > 0 ? (year.totalCommits / maxCommits) * 100 : 0

  return (
    <div className="overflow-hidden rounded-lg border">
      {/* Year bar (clickable) */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-4 text-left transition-colors hover:bg-muted"
        aria-expanded={expanded}
        aria-label={`Toggle ${year.year} details`}
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-1 items-center gap-4">
            {/* Year label */}
            <span className="text-lg font-semibold">{year.year}</span>

            {/* Visual bar */}
            <div className="h-8 min-w-[100px] flex-1 rounded bg-muted">
              <div
                className="h-full rounded bg-primary transition-all duration-500"
                style={{ width: `${widthPercent}%` }}
              />
            </div>

            {/* Stats */}
            <div className="flex gap-4 text-sm text-muted-foreground">
              <span>{year.totalCommits} commits</span>
              <span>{year.totalPRs} PRs</span>
              <span>{year.ownedRepos.length + year.contributions.length} repos</span>
            </div>
          </div>

          {/* Expand icon */}
          {expanded ? (
            <ChevronUp className="h-5 w-5" />
          ) : (
            <ChevronDown className="h-5 w-5" />
          )}
        </div>
      </button>

      {/* Expanded details */}
      {expanded && (
        <div className="border-t p-4 animate-in fade-in slide-in-from-top-2 duration-200">
          <YearExpandedView year={year} />
        </div>
      )}
    </div>
  )
}
```

**CSS for smooth expand (using Tailwind):**
- `animate-in` - Built-in animation
- `fade-in` - Opacity transition
- `slide-in-from-top-2` - Slide down effect
- `duration-200` - 200ms animation

---

### Step 4.3: YearExpandedView

**File:** `src/components/timeline/YearExpandedView.tsx`

```typescript
import { YearData } from '@/hooks/useUserAnalytics'
import { RepositoryCard } from '@/components/RepositoryCard'
import { Badge } from '@/components/ui/badge'

interface YearExpandedViewProps {
  year: YearData
}

export function YearExpandedView({ year }: YearExpandedViewProps) {
  const topOwnedRepos = year.ownedRepos
    .sort((a, b) => b.repository.stargazerCount - a.repository.stargazerCount)
    .slice(0, 5)

  const topContributions = year.contributions
    .sort((a, b) => b.contributions.totalCount - a.contributions.totalCount)
    .slice(0, 5)

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard label="Commits" value={year.totalCommits} />
        <StatCard label="Pull Requests" value={year.totalPRs} />
        <StatCard label="Issues" value={year.totalIssues} />
        <StatCard label="Repositories" value={year.ownedRepos.length + year.contributions.length} />
      </div>

      {/* Top Owned Projects */}
      {topOwnedRepos.length > 0 && (
        <div>
          <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold">
            👤 Your Projects
            <Badge variant="secondary">{year.ownedRepos.length}</Badge>
          </h3>
          <div className="grid gap-3 md:grid-cols-2">
            {topOwnedRepos.map(repo => (
              <RepositoryCard
                key={repo.repository.url}
                repository={repo.repository}
                type="owned"
              />
            ))}
          </div>
        </div>
      )}

      {/* Top Contributions */}
      {topContributions.length > 0 && (
        <div>
          <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold">
            👥 Open Source Contributions
            <Badge variant="secondary">{year.contributions.length}</Badge>
          </h3>
          <div className="grid gap-3 md:grid-cols-2">
            {topContributions.map(repo => (
              <RepositoryCard
                key={repo.repository.url}
                repository={repo.repository}
                commits={repo.contributions.totalCount}
                type="contribution"
              />
            ))}
          </div>
        </div>
      )}

      {/* No activity fallback */}
      {topOwnedRepos.length === 0 && topContributions.length === 0 && (
        <div className="rounded-lg border p-8 text-center text-muted-foreground">
          No repositories found for this year
        </div>
      )}
    </div>
  )
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border p-3">
      <div className="text-sm text-muted-foreground">{label}</div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  )
}
```

**Enhance RepositoryCard:**

Update `src/components/RepositoryCard.tsx` to accept `type` and `commits` props:

```typescript
interface RepositoryCardProps {
  repository: Repository
  type?: 'owned' | 'contribution'
  commits?: number
}

export function RepositoryCard({ repository, type, commits }: RepositoryCardProps) {
  return (
    <Card className="p-4 transition-all hover:-translate-y-1 hover:shadow-lg">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h4 className="font-semibold">{repository.name}</h4>
            {type === 'owned' && <Badge variant="default">👤 Owner</Badge>}
            {type === 'contribution' && <Badge variant="secondary">👥 Contributor</Badge>}
          </div>

          <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
            {repository.description || 'No description'}
          </p>

          <div className="mt-2 flex flex-wrap gap-3 text-xs text-muted-foreground">
            <span>⭐ {repository.stargazerCount}</span>
            <span>🍴 {repository.forkCount}</span>
            {repository.primaryLanguage && (
              <span>{repository.primaryLanguage.name}</span>
            )}
            {commits && <span>💻 {commits} commits</span>}
          </div>
        </div>
      </div>
    </Card>
  )
}
```

---

### Step 4.4: Stories & Tests

**File:** `src/components/timeline/ActivityTimeline.stories.tsx`

```typescript
import type { Meta, StoryObj } from '@storybook/react'
import { ActivityTimeline } from './ActivityTimeline'

const meta: Meta<typeof ActivityTimeline> = {
  title: 'Timeline/ActivityTimeline',
  component: ActivityTimeline,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof ActivityTimeline>

const mockTimeline = [
  {
    year: 2025,
    totalCommits: 450,
    totalIssues: 30,
    totalPRs: 25,
    ownedRepos: [/* mock repos */],
    contributions: [/* mock repos */],
  },
  {
    year: 2024,
    totalCommits: 320,
    totalIssues: 20,
    totalPRs: 15,
    ownedRepos: [],
    contributions: [],
  },
]

export const Default: Story = {
  args: {
    timeline: mockTimeline,
  },
}

export const Loading: Story = {
  args: {
    timeline: [],
    loading: true,
  },
}

export const Empty: Story = {
  args: {
    timeline: [],
  },
}
```

**Test:** Follow same pattern - test expand/collapse, rendering, accessibility

---

## ✅ Deliverables

- [ ] ActivityTimeline component
- [ ] TimelineYear (collapsible with CSS transitions)
- [ ] YearExpandedView (reuses RepositoryCard)
- [ ] RepositoryCard enhanced with badges (👤 Owner / 👥 Contributor)
- [ ] Smooth expand/collapse animation (<200ms)
- [ ] Stories + Tests for all components
- [ ] Works with all account ages (2-10+ years)
- [ ] Responsive (mobile: 1 col, desktop: 2 cols for repos)
- [ ] >90% test coverage

---

## 📊 Performance Expectations

**Rendering:**
- Timeline (10 years): <100ms initial render
- Year expand: <100ms (smooth animation)
- Year collapse: <100ms

**Optimization:**
- Use `React.memo` for TimelineYear
- Lazy render expanded content
- Virtual scrolling if >50 years (unlikely)

---

## 🎨 Animation Strategy

**CSS Transitions (95%):**
```css
/* Already handled by Tailwind utilities */
.transition-all duration-500  /* Progress bar */
.transition-colors            /* Hover state */
.animate-in fade-in          /* Expand animation */
```

**No Framer Motion needed** - CSS is sufficient for collapse/expand

---

## 🧪 Testing Strategy

**Test Cases:**
- Render timeline with multiple years
- Expand/collapse year
- Show correct stats per year
- Display owned vs contribution repos separately
- Handle empty years
- Handle loading state
- Keyboard navigation (space/enter to expand)
- Screen reader announcements

---

## 🔄 Rollback Plan

**If timeline fails:**

1. **Hide timeline:**
   ```typescript
   {FEATURE_FLAGS.TIMELINE_VIEW && <ActivityTimeline />}
   ```

2. **Keep old ContributionHistory:**
   - Temporarily keep existing component
   - Show timeline alongside old chart

3. **Simplify to non-collapsible:**
   - Show all years expanded
   - Remove collapse logic

---

## 📚 Resources

**Components:**
- [Collapsible](https://ui.shadcn.com/docs/components/collapsible) - Alternative to custom collapse
- [Accordion](https://ui.shadcn.com/docs/components/accordion) - If using Radix UI primitives

**Animations:**
- [Tailwind Animations](https://tailwindcss.com/docs/animation)
- [CSS Transitions](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Transitions)

**Existing Components to Reuse:**
- `RepositoryCard` - Already exists
- `Badge` - shadcn/ui
- `Card` - shadcn/ui

---

**Previous Phase:** [Phase 3: Core Components](./phase-3-core-components.md)
**Next Phase:** [Phase 5: Layout Refactoring](./phase-5-layout-refactoring.md)
