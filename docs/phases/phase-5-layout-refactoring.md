# Phase 5: Layout Refactoring (P1)

**Priority:** P1 (Important)
**Estimated Time:** 1 day
**Status:** Ready for Implementation

---

## 🎯 Goal

Remove tabs, create single-page progressive disclosure layout.

**Current State:**
- MainTabs component with tab navigation
- Separate views for Profile, Stats, Repositories
- User must click tabs to see different content

**Target State:**
- Single-page vertical scroll
- Progressive disclosure (important info first)
- Owned vs Contributions visually separated
- Smooth scroll experience

---

## 🏗️ New Layout Structure

```
App.tsx
  ├─ SearchHeader
  └─ (if username searched)
      ├─ UserHeader (profile info)
      ├─ QuickAssessment (4 metrics)
      ├─ ActivityTimeline (year-by-year)
      └─ ProjectSection
          ├─ Owned Projects
          └─ Contributions
```

**Order by importance:**
1. Profile (who is this user?)
2. Quick Assessment (summary metrics)
3. Activity Timeline (historical view)
4. Projects (detailed repositories)

---

## 📋 Implementation Steps

### Step 5.1: Remove Tabs from App.tsx

**File:** `src/App.tsx`

**Before:**
```typescript
<Tabs defaultValue="profile">
  <TabsList>
    <TabsTrigger value="profile">Profile</TabsTrigger>
    <TabsTrigger value="stats">Stats</TabsTrigger>
    <TabsTrigger value="repos">Repositories</TabsTrigger>
  </TabsList>
  <TabsContent value="profile">...</TabsContent>
  <TabsContent value="stats">...</TabsContent>
  <TabsContent value="repos">...</TabsContent>
</Tabs>
```

**After:**
```typescript
<div className="min-h-screen bg-background">
  <div className="container mx-auto space-y-8 p-4">
    <SearchHeader onSearch={setUsername} />

    {username && (
      <>
        <UserHeader user={profile} loading={loading} />
        <QuickAssessment metrics={metrics} loading={loading} />
        <ActivityTimeline timeline={timeline} loading={loading} />
        <ProjectSection projects={projects} loading={loading} />
      </>
    )}
  </div>
</div>
```

---

### Step 5.2: ProjectSection Component

**File:** `src/components/projects/ProjectSection.tsx`

```typescript
import { RepositoryCard } from '@/components/RepositoryCard'
import { Badge } from '@/components/ui/badge'

interface ProjectSectionProps {
  projects: {
    owned: Repository[]
    contributions: Repository[]
  }
  loading?: boolean
}

export function ProjectSection({ projects, loading }: ProjectSectionProps) {
  if (loading) {
    return <ProjectSectionSkeleton />
  }

  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-bold">🔥 Top Projects & Contributions</h2>

      {/* Owned Projects */}
      {projects.owned.length > 0 && (
        <div>
          <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
            👤 Your Original Projects
            <Badge variant="default">{projects.owned.length}</Badge>
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            {projects.owned.map(repo => (
              <RepositoryCard
                key={repo.url}
                repository={repo}
                type="owned"
              />
            ))}
          </div>
        </div>
      )}

      {/* Contributions */}
      {projects.contributions.length > 0 && (
        <div>
          <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
            👥 Open Source Contributions
            <Badge variant="secondary">{projects.contributions.length}</Badge>
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            {projects.contributions.map(repo => (
              <RepositoryCard
                key={repo.url}
                repository={repo}
                type="contribution"
              />
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {projects.owned.length === 0 && projects.contributions.length === 0 && (
        <div className="rounded-lg border p-8 text-center text-muted-foreground">
          No repositories found
        </div>
      )}
    </section>
  )
}

function ProjectSectionSkeleton() {
  return (
    <section className="space-y-6">
      <div className="h-8 w-64 animate-pulse rounded bg-muted" />
      <div className="grid gap-4 md:grid-cols-2">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-32 animate-pulse rounded-lg bg-muted" />
        ))}
      </div>
    </section>
  )
}
```

---

### Step 5.3: SearchHeader Component (if doesn't exist)

**File:** `src/components/SearchHeader.tsx`

```typescript
import { SearchForm } from '@/components/SearchForm'

interface SearchHeaderProps {
  onSearch: (username: string) => void
}

export function SearchHeader({ onSearch }: SearchHeaderProps) {
  return (
    <header className="space-y-4 text-center">
      <h1 className="text-4xl font-bold">GitHub User Analytics</h1>
      <p className="text-muted-foreground">
        Analyze GitHub users with comprehensive metrics and timeline
      </p>
      <div className="mx-auto max-w-md">
        <SearchForm setUserName={onSearch} />
      </div>
    </header>
  )
}
```

---

### Step 5.4: Integrate All Sections in App.tsx

**File:** `src/App.tsx` (full example)

```typescript
import { useState } from 'react'
import { useUserAnalytics } from '@/hooks/useUserAnalytics'
import { SearchHeader } from '@/components/SearchHeader'
import { UserHeader } from '@/components/UserHeader'
import { QuickAssessment } from '@/components/assessment/QuickAssessment'
import { ActivityTimeline } from '@/components/timeline/ActivityTimeline'
import { ProjectSection } from '@/components/projects/ProjectSection'
import { calculateActivityScore } from '@/lib/metrics/activity'
import { calculateImpactScore } from '@/lib/metrics/impact'
import { calculateQualityScore } from '@/lib/metrics/quality'
import { calculateGrowthScore } from '@/lib/metrics/growth'

function App() {
  const [username, setUsername] = useState('')
  const { profile, timeline, loading, error } = useUserAnalytics(username)

  // Calculate metrics
  const metrics = timeline.length > 0 ? {
    activity: calculateActivityScore(timeline),
    impact: calculateImpactScore(timeline),
    quality: calculateQualityScore(timeline),
    growth: calculateGrowthScore(timeline)
  } : null

  // Separate owned vs contributions
  const projects = {
    owned: timeline.flatMap(y => y.ownedRepos.map(r => r.repository)),
    contributions: timeline.flatMap(y => y.contributions.map(r => r.repository))
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto space-y-8 p-4 pb-16">
        <SearchHeader onSearch={setUsername} />

        {error && (
          <div className="rounded-lg border border-destructive p-4 text-destructive">
            Error: {error.message}
          </div>
        )}

        {username && profile && (
          <>
            <UserHeader user={profile} loading={loading} />
            {metrics && <QuickAssessment metrics={metrics} loading={loading} />}
            <ActivityTimeline timeline={timeline} loading={loading} />
            <ProjectSection projects={projects} loading={loading} />
          </>
        )}
      </div>
    </div>
  )
}

export default App
```

---

### Step 5.5: Decision on Statistics Tab

**Current Statistics Tab includes:**
- CommitChart (line/bar/area)
- LanguageChart (pie/donut)
- ActivityChart (bar)

**Options:**

1. **Remove entirely** - Timeline replaces it ❌
2. **Keep as separate route** - `/stats` page ❌
3. **Integrate into Timeline** - Show charts in YearExpandedView ✅ **Recommended**

**Implementation (Option 3):**

Update `YearExpandedView.tsx` to include mini language chart:

```typescript
import { LanguageChart } from '@/components/LanguageChart'

export function YearExpandedView({ year }: YearExpandedViewProps) {
  const languages = extractLanguages(year.ownedRepos, year.contributions)

  return (
    <div className="space-y-6">
      {/* Existing content */}

      {/* Language Distribution */}
      {languages.length > 0 && (
        <div>
          <h3 className="mb-3 text-lg font-semibold">🔤 Languages Used</h3>
          <LanguageChart data={languages} variant="compact" />
        </div>
      )}
    </div>
  )
}
```

---

## ✅ Deliverables

- [ ] MainTabs removed from App.tsx
- [ ] Single-page vertical scroll layout
- [ ] SearchHeader component
- [ ] ProjectSection created (Owned vs Contributions split)
- [ ] Owned/Contribution badges working (👤 / 👥)
- [ ] All sections responsive (mobile: 1 col, desktop: 2 cols)
- [ ] Repository filters/sorting kept in ProjectSection
- [ ] Statistics charts integrated into Timeline (optional)
- [ ] Smooth scroll experience
- [ ] Loading states for all sections

---

## 📊 Performance Expectations

**Layout Performance:**
- Initial render: <100ms
- Scroll performance: 60fps
- No layout shifts (CLS < 0.1)

**User Experience:**
- Progressive loading (sections appear as data loads)
- Skeleton states for all sections
- Smooth transitions between sections

---

## 🎨 Visual Hierarchy

**Information Architecture:**
```
Level 1: Search (always visible)
Level 2: User Identity (profile header)
Level 3: Quick Assessment (key metrics)
Level 4: Historical View (timeline)
Level 5: Detailed Projects (repositories)
```

**Spacing:**
- Between sections: `space-y-8` (2rem)
- Within sections: `space-y-4` (1rem)
- Container padding: `p-4` mobile, `p-6` desktop

---

## 🧪 Testing Strategy

**E2E Tests:**
```typescript
test('single-page layout shows all sections', async ({ page }) => {
  await page.goto('/')
  await page.fill('[data-testid="search-input"]', 'torvalds')
  await page.click('[data-testid="search-button"]')

  // All sections visible on one page
  await expect(page.locator('text=Quick Assessment')).toBeVisible()
  await expect(page.locator('text=Activity Timeline')).toBeVisible()
  await expect(page.locator('text=Top Projects')).toBeVisible()

  // No tabs
  await expect(page.locator('[role="tablist"]')).not.toBeVisible()
})
```

**Visual Regression:**
- Screenshot tests for desktop layout
- Screenshot tests for mobile layout
- Compare before/after refactoring

---

## 🔄 Rollback Plan

**If layout fails:**

1. **Revert to tabs:**
   ```bash
   git revert <commit-hash>
   ```

2. **Feature flag:**
   ```typescript
   {FEATURE_FLAGS.NEW_LAYOUT ? <NewLayout /> : <OldTabsLayout />}
   ```

3. **Keep both layouts temporarily:**
   - Deploy new layout to `/beta` route
   - Keep old layout on `/` route
   - Gradually migrate users

---

## 📚 Resources

**Layout Patterns:**
- [Progressive Disclosure](https://www.nngroup.com/articles/progressive-disclosure/)
- [Information Architecture](https://www.nngroup.com/articles/information-architecture-101/)

**Responsive Design:**
- [Tailwind Responsive Design](https://tailwindcss.com/docs/responsive-design)
- [Mobile-First](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Responsive/Mobile_first)

**Accessibility:**
- [Skip Links](https://webaim.org/techniques/skipnav/)
- [Landmark Regions](https://www.w3.org/WAI/ARIA/apg/practices/landmark-regions/)

---

**Previous Phase:** [Phase 4: Timeline Components](./phase-4-timeline-components.md)
**Next Phase:** [Phase 6: Testing & Polish](./phase-6-testing-polish.md)
