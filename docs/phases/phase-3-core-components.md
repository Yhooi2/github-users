# Phase 3: Core Components (P0)

**Priority:** P0 (Critical)
**Estimated Time:** 2 days
**Status:** Ready for Implementation

---

## 🎯 Goal

Build UI components for displaying metrics and assessments.

**Current State:**
- `UserAuthenticity.tsx` exists as perfect template
- shadcn/ui components already installed (28+ components)
- Storybook workflow established

**Target State:**
- MetricCard component (like UserAuthenticity card)
- QuickAssessment (4-metric grid)
- MetricExplanationModal
- All with Storybook stories and tests

---

## 🏗️ Component Development Workflow

**For EVERY component:**

1. Check shadcn MCP for similar component
2. Write component with TypeScript
3. Write Storybook story (all states)
4. Build Storybook: `npm run build-storybook`
5. Write tests (based on stories)
6. Run tests: `npm test`
7. MCP Check (optional)
8. Document learnings

**Template:** Use `src/components/user/UserAuthenticity.tsx` as UI pattern!

---

## 📋 Implementation Steps

### Step 3.1: MetricCard Component

**Install shadcn Card (if not already):**
```bash
npx shadcn@latest add card
npx shadcn@latest add progress
npx shadcn@latest add badge
```

**File:** `src/components/assessment/MetricCard.tsx`

```typescript
'use client' // Keep for compatibility

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Info } from 'lucide-react'
import { Button } from '@/components/ui/button'

export interface MetricCardProps {
  title: string
  score: number
  level: 'Low' | 'Moderate' | 'High' | 'Strong' | 'Excellent'
  breakdown?: Array<{
    label: string
    value: number
    max: number
  }>
  loading?: boolean
  onExplainClick?: () => void
}

export function MetricCard({
  title,
  score,
  level,
  breakdown,
  loading = false,
  onExplainClick,
}: MetricCardProps) {
  if (loading) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <div className="h-6 w-1/2 rounded bg-muted" />
        </CardHeader>
        <CardContent>
          <div className="h-12 rounded bg-muted" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">{title}</CardTitle>
        {onExplainClick && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onExplainClick}
            aria-label={`Explain ${title} score`}
          >
            <Info className="h-4 w-4" />
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Score display */}
        <div className="text-center">
          <div className="text-4xl font-bold">{score}%</div>
          <div className="text-sm text-muted-foreground">{level}</div>
        </div>

        {/* Progress bar */}
        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-2 rounded-full bg-primary transition-all duration-500 ease-out"
            style={{ width: `${score}%` }}
          />
        </div>

        {/* Breakdown */}
        {breakdown && breakdown.length > 0 && (
          <div className="space-y-2 text-sm">
            {breakdown.map((item) => (
              <div key={item.label} className="flex justify-between">
                <span className="text-muted-foreground">{item.label}</span>
                <span className="font-medium">
                  {item.value}/{item.max}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
```

**File:** `src/components/assessment/MetricCard.stories.tsx`

```typescript
import type { Meta, StoryObj } from '@storybook/react'
import { MetricCard } from './MetricCard'

const meta: Meta<typeof MetricCard> = {
  title: 'Assessment/MetricCard',
  component: MetricCard,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof MetricCard>

export const ActivityHigh: Story = {
  args: {
    title: 'Activity',
    score: 85,
    level: 'High',
    breakdown: [
      { label: 'Recent commits', value: 40, max: 40 },
      { label: 'Consistency', value: 30, max: 30 },
      { label: 'Diversity', value: 15, max: 30 },
    ],
  },
}

export const ImpactStrong: Story = {
  args: {
    title: 'Impact',
    score: 72,
    level: 'Strong',
  },
}

export const QualityExcellent: Story = {
  args: {
    title: 'Quality',
    score: 90,
    level: 'Excellent',
    breakdown: [
      { label: 'Originality', value: 30, max: 30 },
      { label: 'Documentation', value: 22, max: 25 },
      { label: 'Ownership', value: 18, max: 20 },
      { label: 'Maturity', value: 12, max: 15 },
      { label: 'Stack', value: 8, max: 10 },
    ],
  },
}

export const Loading: Story = {
  args: {
    title: 'Activity',
    score: 0,
    level: 'Low',
    loading: true,
  },
}

export const WithExplainButton: Story = {
  args: {
    title: 'Growth',
    score: 45,
    level: 'Moderate',
    onExplainClick: () => alert('Explain Growth metric'),
  },
}
```

**File:** `src/components/assessment/MetricCard.test.tsx`

```typescript
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MetricCard } from './MetricCard'

describe('MetricCard', () => {
  it('renders score and level', () => {
    render(<MetricCard title="Activity" score={85} level="High" />)

    expect(screen.getByText('85%')).toBeInTheDocument()
    expect(screen.getByText('High')).toBeInTheDocument()
    expect(screen.getByText('Activity')).toBeInTheDocument()
  })

  it('renders breakdown when provided', () => {
    const breakdown = [
      { label: 'Recent commits', value: 40, max: 40 },
      { label: 'Consistency', value: 30, max: 30 },
    ]

    render(<MetricCard title="Activity" score={85} level="High" breakdown={breakdown} />)

    expect(screen.getByText('Recent commits')).toBeInTheDocument()
    expect(screen.getByText('40/40')).toBeInTheDocument()
    expect(screen.getByText('Consistency')).toBeInTheDocument()
    expect(screen.getByText('30/30')).toBeInTheDocument()
  })

  it('calls onExplainClick when info button clicked', () => {
    const handleClick = vi.fn()
    render(
      <MetricCard
        title="Activity"
        score={85}
        level="High"
        onExplainClick={handleClick}
      />
    )

    const button = screen.getByLabelText('Explain Activity score')
    fireEvent.click(button)
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('shows loading state', () => {
    const { container } = render(
      <MetricCard title="Activity" score={0} level="Low" loading />
    )

    expect(container.querySelector('.animate-pulse')).toBeInTheDocument()
  })

  it('applies hover effects', () => {
    const { container } = render(
      <MetricCard title="Activity" score={85} level="High" />
    )

    const card = container.querySelector('.hover\\:shadow-lg')
    expect(card).toBeInTheDocument()
  })
})
```

---

### Step 3.2: QuickAssessment Component

**File:** `src/components/assessment/QuickAssessment.tsx`

```typescript
import { MetricCard } from './MetricCard'

interface QuickAssessmentProps {
  metrics: {
    activity: { score: number; level: string }
    impact: { score: number; level: string }
    quality: { score: number; level: string }
    growth: { score: number; level: string }
  }
  loading?: boolean
  onExplainMetric?: (metric: string) => void
}

export function QuickAssessment({
  metrics,
  loading,
  onExplainMetric
}: QuickAssessmentProps) {
  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-bold">🎯 Quick Assessment</h2>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Activity"
          score={metrics.activity.score}
          level={metrics.activity.level as any}
          loading={loading}
          onExplainClick={() => onExplainMetric?.('activity')}
        />
        <MetricCard
          title="Impact"
          score={metrics.impact.score}
          level={metrics.impact.level as any}
          loading={loading}
          onExplainClick={() => onExplainMetric?.('impact')}
        />
        <MetricCard
          title="Quality"
          score={metrics.quality.score}
          level={metrics.quality.level as any}
          loading={loading}
          onExplainClick={() => onExplainMetric?.('quality')}
        />
        <MetricCard
          title="Growth"
          score={metrics.growth.score}
          level={metrics.growth.level as any}
          loading={loading}
          onExplainClick={() => onExplainMetric?.('growth')}
        />
      </div>
    </section>
  )
}
```

**Story & Test:** Follow same pattern as MetricCard

---

### Step 3.3: MetricExplanationModal

**Install Dialog:**
```bash
npx shadcn@latest add dialog
```

**File:** `src/components/assessment/MetricExplanationModal.tsx`

```typescript
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface MetricExplanationModalProps {
  isOpen: boolean
  onClose: () => void
  metric: 'activity' | 'impact' | 'quality' | 'growth'
  score: number
  breakdown: Record<string, number>
}

const EXPLANATIONS = {
  activity: {
    title: 'Activity Score',
    description: 'Measures recent coding activity, consistency, and project diversity',
    components: {
      recentCommits: 'Commits in last 3 months (0-40 pts)',
      consistency: 'Active months in last year (0-30 pts)',
      diversity: 'Number of unique repositories (0-30 pts)'
    }
  },
  impact: {
    title: 'Impact Score',
    description: 'Measures community reach and engagement',
    components: {
      stars: 'Total stars across repos (0-35 pts)',
      forks: 'Total forks (0-20 pts)',
      contributors: 'Contributors attracted (0-15 pts)',
      reach: 'Watchers + dependents (0-20 pts)',
      engagement: 'Issue/PR activity (0-10 pts)'
    }
  },
  // ... other metrics
}

export function MetricExplanationModal({
  isOpen,
  onClose,
  metric,
  score,
  breakdown
}: MetricExplanationModalProps) {
  const explanation = EXPLANATIONS[metric]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{explanation.title}: {score}%</DialogTitle>
          <DialogDescription>{explanation.description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <h4 className="font-medium">Score Breakdown:</h4>
          {Object.entries(breakdown).map(([key, value]) => (
            <div key={key} className="flex justify-between">
              <span className="text-sm text-muted-foreground">
                {explanation.components[key]}
              </span>
              <span className="font-medium">{value} pts</span>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
```

---

### Step 3.4: AssessmentSummary (Optional AI Summary)

**Optional component for Phase 3+:**
- Display AI-generated summary of user profile
- Based on all 4 metrics
- Can be implemented later

---

## ✅ Deliverables

- [ ] MetricCard component created
- [ ] MetricCard follows UserAuthenticity.tsx layout pattern
- [ ] QuickAssessment grid component
- [ ] MetricExplanationModal (optional)
- [ ] All components have `.stories.tsx`
- [ ] All components have `.test.tsx`
- [ ] Storybook built and indexed (`npm run build-storybook`)
- [ ] >90% test coverage
- [ ] Uses existing shadcn/ui components (Card, Progress, Badge, Dialog)
- [ ] Responsive (1 col mobile, 2 cols tablet, 4 cols desktop)

---

## 📊 Performance Expectations

**Rendering Times:**
- MetricCard: <16ms (60fps)
- QuickAssessment (4 cards): <50ms
- Modal open/close: <200ms

**Bundle Impact:**
- MetricCard: ~2KB
- QuickAssessment: ~1KB
- Modal: ~3KB (Dialog component)
- **Total:** ~6KB additional

---

## 🎨 Design Patterns

**Follow existing patterns:**
- Card layout from UserAuthenticity.tsx
- Color coding from theme (primary, muted, etc.)
- Hover effects: `hover:shadow-lg hover:-translate-y-0.5`
- Loading states: `animate-pulse` with skeleton

**Accessibility:**
- Proper ARIA labels
- Keyboard navigation
- Focus management
- Screen reader support

---

## 🧪 Testing Strategy

**Test Coverage:**
- Component rendering (all states)
- Props validation (score, level, breakdown)
- User interactions (button clicks, modal open/close)
- Loading states
- Responsive behavior
- Accessibility (axe-core)

**Storybook Coverage:**
- Default state
- Loading state
- With breakdown
- Without breakdown
- With explanation button
- All metric levels (Low/Moderate/High/etc.)

---

## 🔄 Rollback Plan

**If components fail:**

1. **Hide new components:**
   ```typescript
   {FEATURE_FLAGS.NEW_METRICS && <QuickAssessment />}
   ```

2. **Use fallback UI:**
   ```typescript
   {metrics ? <QuickAssessment /> : <UserAuthenticity />}
   ```

3. **Revert to old components:**
   - Keep UserAuthenticity visible
   - Remove new metric cards

---

## 📚 Resources

**shadcn/ui Components:**
- [Card](https://ui.shadcn.com/docs/components/card)
- [Progress](https://ui.shadcn.com/docs/components/progress)
- [Badge](https://ui.shadcn.com/docs/components/badge)
- [Dialog](https://ui.shadcn.com/docs/components/dialog)

**Storybook:**
- [Writing Stories](https://storybook.js.org/docs/writing-stories)
- [Testing](https://storybook.js.org/docs/writing-tests)

**Testing:**
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Vitest](https://vitest.dev/)

---

**Previous Phase:** [Phase 2: Metrics Calculation System](./phase-2-metrics-calculation.md)
**Next Phase:** [Phase 4: Timeline Components](./phase-4-timeline-components.md)
