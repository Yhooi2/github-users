# PART 6: Implementation TODO - Phase 1-3

## Level 0, Level 1, Level 2 Implementation

---

## Phase 1: Level 0 - Compact List Component

### 🎯 Goal

Create ultra-compact repository list that shows all projects at once

---

### TODO 1.1: Project Setup & Dependencies

#### Install shadcn Components

```bash
# Core components
npx shadcn@latest add card
npx shadcn@latest add badge
npx shadcn@latest add button
npx shadcn@latest add scroll-area
npx shadcn@latest add separator
npx shadcn@latest add hover-card
```

**Checklist**:

- [ ] shadcn/ui initialized
- [ ] Tailwind configured
- [ ] Components installed
- [ ] Import aliases working (`@/components`)

---

### TODO 1.2: Create CompactProjectRow Component

**File**: `components/level-0/CompactProjectRow.tsx`

#### Component Structure

```typescript
import { Badge } from '@/components/ui/badge'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
import { cn } from '@/lib/utils'

interface CompactProjectRowProps {
  project: {
    id: string
    name: string
    commits: number
    stars: number
    language: string
    isOwner: boolean
    description?: string
  }
  maxCommits: number
  onClick: () => void
  isExpanded: boolean
}

export function CompactProjectRow({
  project,
  maxCommits,
  onClick,
  isExpanded
}: CompactProjectRowProps) {
  const barHeight = (project.commits / maxCommits) * 100

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <button
          onClick={onClick}
          className={cn(
            "relative w-full flex items-center gap-3 p-3 rounded-lg",
            "transition-all duration-200 ease-out",
            "hover:bg-muted/50 hover:scale-[1.02] hover:shadow-md",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
            isExpanded && "bg-muted/30"
          )}
          aria-label={`${isExpanded ? 'Collapse' : 'Expand'} ${project.name} details`}
          aria-expanded={isExpanded}
        >
          {/* Vertical commit bar */}
          <div className="relative h-12 w-1 bg-muted rounded-full overflow-hidden">
            <div
              className={cn(
                "absolute bottom-0 w-full rounded-full",
                "transition-all duration-300",
                project.isOwner
                  ? "bg-gradient-to-t from-blue-500 to-blue-600"
                  : "bg-gradient-to-t from-green-500 to-green-600"
              )}
              style={{ height: `${barHeight}%` }}
            />
          </div>

          {/* Project info */}
          <div className="flex-1 min-w-0 text-left">
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm truncate">
                {project.name}
              </span>
              <Badge variant={project.isOwner ? "default" : "secondary"} className="shrink-0">
                {project.isOwner ? '👤' : '👥'}
              </Badge>
            </div>

            <div className="flex gap-3 text-xs text-muted-foreground mt-1">
              <span>{project.commits} commits</span>
              <span>⭐ {formatNumber(project.stars)}</span>
              <span>{project.language}</span>
            </div>
          </div>
        </button>
      </HoverCardTrigger>

      {/* Quick preview on hover */}
      <HoverCardContent side="right" className="w-80">
        <div className="space-y-2">
          <h4 className="font-semibold">{project.name}</h4>
          {project.description && (
            <p className="text-sm text-muted-foreground">{project.description}</p>
          )}
          <div className="flex gap-4 text-xs">
            <span>{project.commits} commits</span>
            <span>{project.stars} stars</span>
            <span>{project.language}</span>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}

function formatNumber(num: number): string {
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}k`
  }
  return num.toString()
}
```

**Agent**: Use `ui-design-specialist`

```bash
claude-code invoke ui-design-specialist "Create CompactProjectRow component with vertical commit bar, hover effects, and HoverCard preview"
```

**Checklist**:

- [ ] Component created
- [ ] Vertical bar visualization
- [ ] Hover states implemented
- [ ] Accessibility (ARIA labels)
- [ ] HoverCard preview working
- [ ] Responsive (mobile 48px, desktop 56px)

---

### TODO 1.3: Create ProjectListContainer

**File**: `components/level-0/ProjectListContainer.tsx`

#### Component Structure

```typescript
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { CompactProjectRow } from './CompactProjectRow'
import { useState } from 'react'

interface ProjectListContainerProps {
  projects: ProjectData[]
  year: string
  onProjectClick: (projectId: string) => void
  expandedProjects: Set<string>
}

export function ProjectListContainer({
  projects,
  year,
  onProjectClick,
  expandedProjects
}: ProjectListContainerProps) {
  const [sortBy, setSortBy] = useState<'commits' | 'stars' | 'recent'>('commits')

  // Separate owned and contributed projects
  const ownedProjects = projects.filter(p => p.isOwner)
  const contributedProjects = projects.filter(p => !p.isOwner)

  // Sort projects
  const sortProjects = (projects: ProjectData[]) => {
    return [...projects].sort((a, b) => {
      switch (sortBy) {
        case 'commits':
          return b.commits - a.commits
        case 'stars':
          return b.stars - a.stars
        case 'recent':
          return new Date(b.lastCommit).getTime() - new Date(a.lastCommit).getTime()
        default:
          return 0
      }
    })
  }

  const sortedOwned = sortProjects(ownedProjects)
  const sortedContributed = sortProjects(contributedProjects)

  const maxCommits = Math.max(...projects.map(p => p.commits))

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Projects & Contributions ({year})</CardTitle>

          {/* Sort dropdown */}
          <Button variant="ghost" size="sm">
            Sort: {sortBy} ▾
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <ScrollArea className="h-[600px]">
          <div className="space-y-6 p-4">
            {/* Owned projects section */}
            {sortedOwned.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-3 px-2">
                  YOUR PROJECTS ({sortedOwned.length})
                </h3>
                <div className="space-y-2">
                  {sortedOwned.map(project => (
                    <CompactProjectRow
                      key={project.id}
                      project={project}
                      maxCommits={maxCommits}
                      onClick={() => onProjectClick(project.id)}
                      isExpanded={expandedProjects.has(project.id)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Separator */}
            {sortedOwned.length > 0 && sortedContributed.length > 0 && (
              <Separator />
            )}

            {/* Contributed projects section */}
            {sortedContributed.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-3 px-2">
                  CONTRIBUTIONS ({sortedContributed.length})
                </h3>
                <div className="space-y-2">
                  {sortedContributed.map(project => (
                    <CompactProjectRow
                      key={project.id}
                      project={project}
                      maxCommits={maxCommits}
                      onClick={() => onProjectClick(project.id)}
                      isExpanded={expandedProjects.has(project.id)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Scroll hint */}
          <div className="sticky bottom-0 h-12 bg-gradient-to-t from-background to-transparent flex items-end justify-center pb-2">
            <span className="text-xs text-muted-foreground">↓ Scroll for more</span>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
```

**Agent**: Use `ui-design-specialist`

```bash
claude-code invoke ui-design-specialist "Create ProjectListContainer with grouping, sorting, and smooth scrolling"
```

**Checklist**:

- [ ] Container created
- [ ] Grouping (Owned vs Contributed)
- [ ] Sorting functionality
- [ ] ScrollArea implemented
- [ ] Scroll hint visible
- [ ] Responsive layout

---

### TODO 1.4: Write Tests for Level 0

**File**: `tests/unit/level-0/CompactProjectRow.test.tsx`

```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import { CompactProjectRow } from '@/components/level-0/CompactProjectRow'

describe('CompactProjectRow', () => {
  const mockProject = {
    id: '1',
    name: 'react-dashboard',
    commits: 347,
    stars: 1234,
    language: 'TypeScript',
    isOwner: true,
    description: 'A modern dashboard'
  }

  it('renders project information correctly', () => {
    render(
      <CompactProjectRow
        project={mockProject}
        maxCommits={500}
        onClick={vi.fn()}
        isExpanded={false}
      />
    )

    expect(screen.getByText('react-dashboard')).toBeInTheDocument()
    expect(screen.getByText('347 commits')).toBeInTheDocument()
    expect(screen.getByText('TypeScript')).toBeInTheDocument()
  })

  it('shows owner badge for owned projects', () => {
    render(
      <CompactProjectRow
        project={mockProject}
        maxCommits={500}
        onClick={vi.fn()}
        isExpanded={false}
      />
    )

    expect(screen.getByText('👤')).toBeInTheDocument()
  })

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn()
    render(
      <CompactProjectRow
        project={mockProject}
        maxCommits={500}
        onClick={handleClick}
        isExpanded={false}
      />
    )

    fireEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('applies expanded styles when isExpanded is true', () => {
    const { container } = render(
      <CompactProjectRow
        project={mockProject}
        maxCommits={500}
        onClick={vi.fn()}
        isExpanded={true}
      />
    )

    const button = container.querySelector('button')
    expect(button).toHaveClass('bg-muted/30')
  })
})
```

**Agent**: Use `test-runner-fixer`

```bash
claude-code invoke test-runner-fixer "Write comprehensive unit tests for CompactProjectRow and ProjectListContainer"
```

**Checklist**:

- [ ] Unit tests written
- [ ] All tests passing
- [ ] Coverage >80%

---

## Phase 2: Level 1 - Expandable Card Component

### 🎯 Goal

Create expandable cards with medium detail for project comparison

---

### TODO 2.1: Install Additional shadcn Components

```bash
npx shadcn@latest add progress
npx shadcn@latest add collapsible
```

---

### TODO 2.2: Create ExpandableProjectCard Component

**File**: `components/level-1/ExpandableProjectCard.tsx`

```typescript
import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { CompactProjectRow } from '@/components/level-0/CompactProjectRow'
import { ExpandedCardContent } from './ExpandedCardContent'
import { cn } from '@/lib/utils'

interface ExpandableProjectCardProps {
  project: ProjectData
  isExpanded: boolean
  onToggle: () => void
  onViewAnalytics: () => void
  maxCommits: number
}

export function ExpandableProjectCard({
  project,
  isExpanded,
  onToggle,
  onViewAnalytics,
  maxCommits
}: ExpandableProjectCardProps) {
  return (
    <Card className={cn(
      "transition-all duration-300 ease-out",
      isExpanded && "shadow-lg"
    )}>
      {/* Collapsed state */}
      <CompactProjectRow
        project={project}
        maxCommits={maxCommits}
        onClick={onToggle}
        isExpanded={isExpanded}
      />

      {/* Expanded content with CSS animation */}
      <div
        className={cn(
          "overflow-hidden transition-all duration-300 ease-out",
          isExpanded ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
        )}
      >
        {isExpanded && (
          <CardContent className="pt-0">
            <ExpandedCardContent
              project={project}
              onViewAnalytics={onViewAnalytics}
              onCollapse={onToggle}
            />
          </CardContent>
        )}
      </div>
    </Card>
  )
}
```

**Agent**: Use `ui-design-specialist`

```bash
claude-code invoke ui-design-specialist "Create ExpandableProjectCard with smooth CSS-only expansion animation"
```

---

### TODO 2.3: Create ExpandedCardContent Component

**File**: `components/level-1/ExpandedCardContent.tsx`

```typescript
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import { ExternalLink, ChevronUp, TrendingUp } from 'lucide-react'

interface ExpandedCardContentProps {
  project: {
    name: string
    description: string
    stats: {
      stars: number
      forks: number
      watchers: number
      version?: string
    }
    contribution: {
      commits: number
      commitPercentage: number
      totalCommits: number
      prs: { merged: number, open: number, total: number }
      reviews: number
      activePeriod: { from: string, to: string }
    }
    languages: Array<{ name: string, percentage: number, color: string }>
    team: {
      totalContributors: number
      topContributors: Array<{ username: string, commits: number }>
    }
    githubUrl: string
  }
  onViewAnalytics: () => void
  onCollapse: () => void
}

export function ExpandedCardContent({
  project,
  onViewAnalytics,
  onCollapse
}: ExpandedCardContentProps) {
  const mergeRate = (project.contribution.prs.merged / project.contribution.prs.total) * 100

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Header section */}
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {project.description}
        </p>

        <div className="flex items-center gap-3 flex-wrap text-sm">
          <span className="flex items-center gap-1">
            ⭐ {project.stats.stars.toLocaleString()}
          </span>
          <span>🍴 {project.stats.forks.toLocaleString()}</span>
          <span>👁 {project.stats.watchers}</span>
          {project.stats.version && (
            <Badge variant="outline">v{project.stats.version}</Badge>
          )}
          <Badge variant="secondary">{project.languages[0]?.name}</Badge>
        </div>
      </div>

      <Separator />

      {/* Contribution section */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold flex items-center gap-2">
          <TrendingUp className="h-4 w-4" />
          YOUR CONTRIBUTION
        </h4>

        <ul className="space-y-2 text-sm">
          <li className="flex items-center justify-between">
            <span className="text-muted-foreground">Commits</span>
            <span className="font-medium">
              {project.contribution.commits} ({project.contribution.commitPercentage}% of {project.contribution.totalCommits})
            </span>
          </li>

          <li className="flex items-center justify-between">
            <span className="text-muted-foreground">Pull Requests</span>
            <span className="font-medium">
              {project.contribution.prs.merged} merged ({mergeRate.toFixed(0)}% rate)
              {project.contribution.prs.open > 0 && `, ${project.contribution.prs.open} open`}
            </span>
          </li>

          <li className="flex items-center justify-between">
            <span className="text-muted-foreground">Code Reviews</span>
            <span className="font-medium">{project.contribution.reviews} performed</span>
          </li>

          <li className="flex items-center justify-between">
            <span className="text-muted-foreground">Active Period</span>
            <span className="font-medium">
              {project.contribution.activePeriod.from} - {project.contribution.activePeriod.to}
            </span>
          </li>
        </ul>
      </div>

      <Separator />

      {/* Languages section */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold">TECH STACK</h4>

        <div className="space-y-2">
          {project.languages.slice(0, 3).map(lang => (
            <div key={lang.name} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span>{lang.name}</span>
                <span className="text-muted-foreground">{lang.percentage}%</span>
              </div>
              <Progress
                value={lang.percentage}
                className="h-2"
                style={{
                  '--progress-background': lang.color
                } as React.CSSProperties}
              />
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Team section */}
      <div className="space-y-2">
        <h4 className="text-sm font-semibold">TEAM</h4>
        <p className="text-sm text-muted-foreground">
          {project.team.totalContributors} contributors · You + {project.team.totalContributors - 1} others
        </p>
        <p className="text-xs text-muted-foreground">
          Most active: {project.team.topContributors.slice(0, 2).map(c =>
            `@${c.username} (${c.commits})`
          ).join(', ')}
        </p>
      </div>

      <Separator />

      {/* Action buttons */}
      <div className="flex items-center justify-between gap-2">
        <Button onClick={onViewAnalytics} size="sm" className="flex-1">
          View Full Analytics →
        </Button>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4 mr-1" />
              GitHub
            </a>
          </Button>

          <Button variant="ghost" size="sm" onClick={onCollapse}>
            <ChevronUp className="h-4 w-4 mr-1" />
            Collapse
          </Button>
        </div>
      </div>
    </div>
  )
}
```

**CSS Animation** (add to globals.css):

```css
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 200ms ease-out;
}
```

**Agent**: Use `ui-design-specialist`

```bash
claude-code invoke ui-design-specialist "Create ExpandedCardContent with all sections, Progress bars for languages, and action buttons"
```

**Checklist**:

- [ ] Component created
- [ ] All sections implemented
- [ ] Language progress bars
- [ ] Action buttons working
- [ ] Animations smooth

---

### TODO 2.4: Implement Responsive Behavior

**File**: `hooks/useExpandableBehavior.ts`

```typescript
import { useState, useEffect } from "react";
import { useMediaQuery } from "./useMediaQuery";

export function useExpandableBehavior() {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [expandedProjects, setExpandedProjects] = useState<Set<string>>(
    new Set(),
  );

  const handleToggle = (projectId: string) => {
    setExpandedProjects((prev) => {
      const next = new Set(prev);

      if (isMobile) {
        // Mobile: Accordion (only one expanded)
        if (next.has(projectId)) {
          next.clear(); // Collapse current
        } else {
          next.clear();
          next.add(projectId); // Expand new
        }
      } else {
        // Desktop: Multiple expansion
        if (next.has(projectId)) {
          next.delete(projectId);
        } else {
          next.add(projectId);
        }
      }

      return next;
    });
  };

  return {
    expandedProjects,
    handleToggle,
    isMobile,
  };
}
```

**Agent**: Use `ux-optimization-specialist`

```bash
claude-code invoke ux-optimization-specialist "Implement responsive expansion behavior: accordion on mobile, multiple expand on desktop"
```

**Checklist**:

- [ ] Hook created
- [ ] Mobile accordion working
- [ ] Desktop multiple expand working
- [ ] Smooth transitions

---

### TODO 2.5: Write Tests for Level 1

**File**: `tests/unit/level-1/ExpandableProjectCard.test.tsx`

```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import { ExpandableProjectCard } from '@/components/level-1/ExpandableProjectCard'

describe('ExpandableProjectCard', () => {
  const mockProject = {
    // ... full project data
  }

  it('shows compact view when collapsed', () => {
    render(
      <ExpandableProjectCard
        project={mockProject}
        isExpanded={false}
        onToggle={vi.fn()}
        onViewAnalytics={vi.fn()}
        maxCommits={500}
      />
    )

    expect(screen.getByText(mockProject.name)).toBeInTheDocument()
    expect(screen.queryByText('YOUR CONTRIBUTION')).not.toBeInTheDocument()
  })

  it('shows expanded content when expanded', () => {
    render(
      <ExpandableProjectCard
        project={mockProject}
        isExpanded={true}
        onToggle={vi.fn()}
        onViewAnalytics={vi.fn()}
        maxCommits={500}
      />
    )

    expect(screen.getByText('YOUR CONTRIBUTION')).toBeInTheDocument()
    expect(screen.getByText('TECH STACK')).toBeInTheDocument()
  })
})
```

**Agent**: Use `test-runner-fixer`

```bash
claude-code invoke test-runner-fixer "Write tests for ExpandableProjectCard expansion behavior"
```

---

## Phase 3: Level 2 - Full Analytics Modal

### 🎯 Goal

Create comprehensive modal with horizontal tabs (4 tabs) for deep analytics

---

### TODO 3.1: Install Modal Components

```bash
npx shadcn@latest add dialog
npx shadcn@latest add sheet
npx shadcn@latest add tabs
npx shadcn@latest add skeleton
```

---

### TODO 3.2: Create ProjectAnalyticsModal Component

**File**: `components/level-2/ProjectAnalyticsModal.tsx`

```typescript
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { HorizontalTabsNav } from './HorizontalTabsNav'

interface ProjectAnalyticsModalProps {
  project: ProjectData
  isOpen: boolean
  onClose: () => void
}

export function ProjectAnalyticsModal({
  project,
  isOpen,
  onClose
}: ProjectAnalyticsModalProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)')

  if (isDesktop) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-[800px] max-h-[85vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>{project.name} · Detailed Analytics</DialogTitle>
            <DialogDescription>
              {project.ownership} · {project.language} · Active {project.activePeriod}
            </DialogDescription>
          </DialogHeader>

          <HorizontalTabsNav project={project} />
        </DialogContent>
      </Dialog>
    )
  }

  // Mobile: Sheet
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="bottom" className="h-[90vh]">
        <SheetHeader>
          <SheetTitle>{project.name}</SheetTitle>
          <SheetDescription>
            {project.language} · {project.activePeriod}
          </SheetDescription>
        </SheetHeader>

        <HorizontalTabsNav project={project} isMobile />
      </SheetContent>
    </Sheet>
  )
}
```

**Agent**: Use `ui-design-specialist`

```bash
claude-code invoke ui-design-specialist "Create ProjectAnalyticsModal with responsive Dialog/Sheet switching"
```

---

### TODO 3.3: Create HorizontalTabsNav Component

**File**: `components/level-2/HorizontalTabsNav.tsx`

```typescript
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { OverviewTab } from './tabs/OverviewTab'
import { TimelineTab } from './tabs/TimelineTab'
import { CodeTab } from './tabs/CodeTab'       // Languages + Impact + Files
import { TeamTab } from './tabs/TeamTab'       // PRs + Collaboration + CI/CD

// ✅ 4 таба согласно Part 2 (не 7!)
const tabs = [
  { id: 'overview', icon: '📊', label: 'Overview', component: OverviewTab },
  { id: 'timeline', icon: '📈', label: 'Timeline', component: TimelineTab },
  { id: 'code', icon: '💻', label: 'Code', component: CodeTab },
  { id: 'team', icon: '👥', label: 'Team', component: TeamTab },
]

export function HorizontalTabsNav({
  project,
  isMobile = false
}: {
  project: ProjectData
  isMobile?: boolean
}) {
  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="grid grid-cols-4 w-full gap-2 bg-muted/30 p-2">
        {tabs.map(tab => (
          <TabsTrigger
            key={tab.id}
            value={tab.id}
            className="flex flex-col items-center gap-1 p-2 data-[state=active]:bg-background data-[state=active]:shadow-sm"
          >
            <span className={isMobile ? "text-lg" : "text-2xl"}>{tab.icon}</span>
            <span className={isMobile ? "text-[9px]" : "text-xs"}>{tab.label}</span>
          </TabsTrigger>
        ))}
      </TabsList>

      <ScrollArea className={isMobile ? "h-[calc(90vh-180px)]" : "h-[calc(85vh-180px)]"}>
        <div className="py-4">
          {tabs.map(tab => {
            const TabComponent = tab.component
            return (
              <TabsContent key={tab.id} value={tab.id} className="mt-0">
                <TabComponent project={project} />
              </TabsContent>
            )
          })}
        </div>
      </ScrollArea>
    </Tabs>
  )
}
```

**Agent**: Use `ui-design-specialist`

```bash
claude-code invoke ui-design-specialist "Create HorizontalTabsNav with 4 tabs (Overview, Timeline, Code, Team), responsive icon sizes"
```

**Checklist**:

- [ ] Component created
- [ ] 4 tabs configured (Overview, Timeline, Code, Team)
- [ ] Icons + labels displayed
- [ ] ScrollArea implemented
- [ ] Responsive (smaller on mobile)

---

### TODO 3.4: Create Tab Components

#### Tab 1: OverviewTab

**File**: `components/level-2/tabs/OverviewTab.tsx`

```typescript
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface MetricCardProps {
  value: string | number
  label: string
  trend?: string
  icon?: React.ReactNode
}

function MetricCard({ value, label, trend, icon }: MetricCardProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-3xl font-bold">{value}</div>
            <div className="text-sm text-muted-foreground mt-1">{label}</div>
            {trend && (
              <div className="text-xs text-green-600 mt-1">{trend}</div>
            )}
          </div>
          {icon && <div className="text-4xl opacity-20">{icon}</div>}
        </div>
      </CardContent>
    </Card>
  )
}

export function OverviewTab({ project }: { project: ProjectData }) {
  const mergeRate = ((project.prs.merged / project.prs.total) * 100).toFixed(0)

  return (
    <div className="space-y-6">
      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <MetricCard
          value={project.commits}
          label="Total Commits"
          trend="+23 this month"
          icon="📝"
        />
        <MetricCard
          value={project.prs.merged}
          label="PRs Merged"
          trend={`${mergeRate}% rate`}
          icon="🔥"
        />
        <MetricCard
          value={project.reviews}
          label="Code Reviews"
          icon="👀"
        />
        <MetricCard
          value={project.filesChanged}
          label="Files Changed"
          icon="📁"
        />
        <MetricCard
          value={project.issues.resolved}
          label="Issues Resolved"
          icon="✅"
        />
      </div>

      {/* Activity Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Activity Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li className="flex justify-between">
              <span className="text-muted-foreground">Code commits</span>
              <span className="font-medium">{project.commitsByType.code} ({project.commitPercentage}% of total)</span>
            </li>
            <li className="flex justify-between">
              <span className="text-muted-foreground">Documentation</span>
              <span className="font-medium">{project.commitsByType.docs} commits</span>
            </li>
            <li className="flex justify-between">
              <span className="text-muted-foreground">Tests</span>
              <span className="font-medium">{project.commitsByType.tests} commits</span>
            </li>
            <li className="flex justify-between">
              <span className="text-muted-foreground">CI/CD configs</span>
              <span className="font-medium">{project.commitsByType.ci} commits</span>
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Stats</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Active Period</span>
            <span className="font-medium">{project.activePeriod}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Contribution %</span>
            <span className="font-medium">{project.contributionPercentage}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Team Rank</span>
            <span className="font-medium">#{project.teamRank} of {project.totalContributors}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
```

**Agent**: Use `ui-design-specialist`

```bash
claude-code invoke ui-design-specialist "Create OverviewTab with metric cards grid and activity breakdown"
```

---

#### Tab 2: TimelineTab

**File**: `components/level-2/tabs/TimelineTab.tsx`

```typescript
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export function TimelineTab({ project }: { project: ProjectData }) {
  const monthlyData = project.timeline.monthly

  return (
    <div className="space-y-6">
      {/* Line Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Commit Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis
                dataKey="month"
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <Tooltip
                contentStyle={{
                  background: 'hsl(var(--popover))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px'
                }}
              />
              <Line
                type="monotone"
                dataKey="commits"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={{ fill: 'hsl(var(--primary))' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Calendar Heatmap (simplified) */}
      <Card>
        <CardHeader>
          <CardTitle>Contribution Calendar</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">
            Calendar heatmap visualization (365-day grid)
          </div>
          {/* TODO: Implement GitHub-style heatmap */}
        </CardContent>
      </Card>

      {/* Weekly Patterns */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Patterns</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Most productive day</span>
            <span className="font-medium">{project.patterns.mostProductiveDay}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Most productive hour</span>
            <span className="font-medium">{project.patterns.mostProductiveHour}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Consistency score</span>
            <span className="font-medium">{project.patterns.consistencyScore}/100</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
```

**Agent**: Use `ui-design-specialist`

```bash
claude-code invoke ui-design-specialist "Create TimelineTab with Recharts LineChart for monthly activity"
```

---

#### Tab 3: CodeTab (Languages + Impact + Files)

**File**: `components/level-2/tabs/CodeTab.tsx`

> ✅ Объединяет старые LanguagesTab + CodeImpactTab (согласно Part 2)

```typescript
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f7df1e',
  Python: '#3776ab',
  Go: '#00add8',
  Rust: '#dea584',
  CSS: '#1572b6',
  HTML: '#e34c26'
}

export function CodeTab({ project }: { project: ProjectData }) {
  const languages = project.languages

  return (
    <div className="space-y-6">
      {/* Pie Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Language Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={languages}
                dataKey="lines"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                label={({ name, percentage }) => `${name} ${percentage}%`}
              >
                {languages.map((lang) => (
                  <Cell
                    key={lang.name}
                    fill={LANGUAGE_COLORS[lang.name] || '#888'}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Language Details Table */}
      <Card>
        <CardHeader>
          <CardTitle>Language Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Language</TableHead>
                <TableHead className="text-right">Lines</TableHead>
                <TableHead className="text-right">Files</TableHead>
                <TableHead className="text-right">%</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {languages.map(lang => (
                <TableRow key={lang.name}>
                  <TableCell className="font-medium">
                    <span
                      className="inline-block w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: LANGUAGE_COLORS[lang.name] }}
                    />
                    {lang.name}
                  </TableCell>
                  <TableCell className="text-right">{lang.lines.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{lang.files}</TableCell>
                  <TableCell className="text-right">{lang.percentage}%</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* File Type Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>File Types</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Source files</span>
            <span className="font-medium">{project.fileTypes.source}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Test files</span>
            <span className="font-medium">{project.fileTypes.test}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Config files</span>
            <span className="font-medium">{project.fileTypes.config}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Documentation</span>
            <span className="font-medium">{project.fileTypes.docs}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
```

**Agent**: Use `ui-design-specialist`

```bash
claude-code invoke ui-design-specialist "Create LanguagesTab with Recharts PieChart and language breakdown table"
```

---

#### Tab 4: TeamTab (PRs + Collaboration + CI/CD)

**File**: `components/level-2/tabs/TeamTab.tsx`

> ✅ Объединяет старые PullRequestsTab + CollaborationTab + CICDTab (согласно Part 2)

```typescript
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export function TeamTab({ project }: { project: ProjectData }) {
  const mergeRate = ((project.prs.merged / project.prs.total) * 100).toFixed(0)

  return (
    <div className="space-y-6">
      {/* Pull Requests Section */}
      <Card>
        <CardHeader>
          <CardTitle>Pull Requests</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Opened</span>
            <span className="font-medium">{project.prs.total}</span>
          </div>
          <div className="flex justify-between">
            <span>Merged</span>
            <span className="font-medium text-green-600">{project.prs.merged} ({mergeRate}%)</span>
          </div>
          <div className="flex justify-between">
            <span>Avg time to merge</span>
            <span className="font-medium">{project.prs.avgTimeToMerge} days</span>
          </div>
        </CardContent>
      </Card>

      {/* Code Reviews Section */}
      <Card>
        <CardHeader>
          <CardTitle>Code Reviews</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Reviews given</span>
            <span className="font-medium">{project.reviews.total} ({project.reviews.comments} comments)</span>
          </div>
          <div className="flex justify-between">
            <span>Avg review depth</span>
            <span className="font-medium">{project.reviews.avgDepth} comments/review</span>
          </div>
        </CardContent>
      </Card>

      {/* Collaboration Section */}
      <Card>
        <CardHeader>
          <CardTitle>Collaboration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Team size</span>
            <span className="font-medium">{project.team.totalContributors} contributors</span>
          </div>
          <div className="flex justify-between">
            <span>Your rank</span>
            <Badge variant="secondary">#{project.team.yourRank} of {project.team.totalContributors}</Badge>
          </div>
          <div className="flex justify-between">
            <span>Top collaborator</span>
            <span className="font-medium">@{project.team.topCollaborator.username}</span>
          </div>
        </CardContent>
      </Card>

      {/* CI/CD Section (optional) */}
      {project.cicd && (
        <Card>
          <CardHeader>
            <CardTitle>CI/CD</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Build success</span>
              <span className="font-medium text-green-600">{project.cicd.buildSuccess}%</span>
            </div>
            <div className="flex justify-between">
              <span>Last deploy</span>
              <span className="font-medium">{project.cicd.lastDeploy}</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
```

**Agent**: Use `ui-design-specialist`

```bash
claude-code invoke ui-design-specialist "Create TeamTab with PRs, code reviews, collaboration and CI/CD sections"
```

**Checklist**:

- [ ] All 4 tab components created (Overview, Timeline, Code, Team)
- [ ] Data visualization implemented
- [ ] Responsive layouts
- [ ] Loading states (skeletons)

---

### TODO 3.5: Implement Lazy Loading for Tabs

**File**: `components/level-2/HorizontalTabsNav.tsx` (update)

```typescript
import { useState, useEffect } from 'react'
import { Skeleton } from '@/components/ui/skeleton'

export function HorizontalTabsNav({ project, isMobile = false }) {
  const [activeTab, setActiveTab] = useState('overview')
  const [loadedTabs, setLoadedTabs] = useState(new Set(['overview']))
  const [loading, setLoading] = useState(false)

  const handleTabChange = async (tabId: string) => {
    setActiveTab(tabId)

    // Lazy load tab data if not loaded
    if (!loadedTabs.has(tabId)) {
      setLoading(true)
      try {
        // Fetch tab-specific data
        await fetchTabData(project.id, tabId)
        setLoadedTabs(prev => new Set(prev).add(tabId))
      } catch (error) {
        console.error(`Failed to load ${tabId} data`, error)
      } finally {
        setLoading(false)
      }
    }
  }

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
      {/* ... TabsList ... */}

      <ScrollArea>
        <div className="py-4">
          {tabs.map(tab => {
            const TabComponent = tab.component
            return (
              <TabsContent key={tab.id} value={tab.id} className="mt-0">
                {loading && !loadedTabs.has(tab.id) ? (
                  <div className="space-y-4">
                    <Skeleton className="h-32 w-full" />
                    <Skeleton className="h-64 w-full" />
                    <Skeleton className="h-48 w-full" />
                  </div>
                ) : (
                  <TabComponent project={project} />
                )}
              </TabsContent>
            )
          })}
        </div>
      </ScrollArea>
    </Tabs>
  )
}

async function fetchTabData(projectId: string, tabId: string) {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 500))
  // In real implementation: fetch from API
}
```

**Agent**: Use `ux-optimization-specialist`

```bash
claude-code invoke ux-optimization-specialist "Implement lazy loading for modal tabs with skeleton states"
```

**Checklist**:

- [ ] Lazy loading implemented
- [ ] Skeleton states shown
- [ ] Tab switching smooth
- [ ] No unnecessary re-renders

---

### TODO 3.6: Add Modal Animations

**File**: `components/level-2/ProjectAnalyticsModal.tsx` (update)

```typescript
import { motion, AnimatePresence } from 'framer-motion'

const modalVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] }
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 20,
    transition: { duration: 0.15 }
  }
}

export function ProjectAnalyticsModal({ project, isOpen, onClose }) {
  const isDesktop = useMediaQuery('(min-width: 768px)')

  if (isDesktop) {
    return (
      <AnimatePresence>
        {isOpen && (
          <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent asChild>
              <motion.div
                variants={modalVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="max-w-[800px] max-h-[85vh]"
              >
                {/* Dialog content */}
              </motion.div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    )
  }

  // Mobile Sheet with slide-up animation
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="bottom" className="h-[90vh]">
        {/* Sheet content */}
      </SheetContent>
    </Sheet>
  )
}
```

**Agent**: Use `ux-optimization-specialist`

```bash
claude-code invoke ux-optimization-specialist "Add smooth Framer Motion animations to modal open/close"
```

**Checklist**:

- [ ] Modal animations smooth
- [ ] No layout shifts
- [ ] 60fps transitions
- [ ] Backdrop fade works

---

### TODO 3.7: Write E2E Tests for Level 2

**File**: `tests/e2e/modal.spec.ts`

```typescript
import { test, expect } from "@playwright/test";

test.describe("Level 2 Modal", () => {
  test("opens modal and navigates tabs", async ({ page }) => {
    await page.goto("http://localhost:5173"); // Vite port

    // Expand project card
    await page.click('[data-testid="project-row-0"]');

    // Open modal
    await page.click('[data-testid="view-analytics-btn"]');

    // Verify modal is open
    await expect(page.locator('[role="dialog"]')).toBeVisible();

    // Click Timeline tab
    await page.click('[data-testid="tab-timeline"]');
    await expect(page.locator('[data-testid="timeline-chart"]')).toBeVisible();

    // Click Languages tab
    await page.click('[data-testid="tab-languages"]');
    await expect(page.locator('[data-testid="languages-chart"]')).toBeVisible();

    // Close modal
    await page.click('[aria-label="Close"]');
    await expect(page.locator('[role="dialog"]')).not.toBeVisible();
  });

  test("lazy loads tab content", async ({ page }) => {
    await page.goto("http://localhost:5173"); // Vite port

    // Open modal
    await page.click('[data-testid="project-row-0"]');
    await page.click('[data-testid="view-analytics-btn"]');

    // Timeline tab not loaded yet
    await expect(
      page.locator('[data-testid="timeline-chart"]'),
    ).not.toBeVisible();

    // Click Timeline tab
    await page.click('[data-testid="tab-timeline"]');

    // Skeleton shown while loading
    await expect(page.locator('[data-testid="skeleton"]')).toBeVisible();

    // Chart loads
    await expect(page.locator('[data-testid="timeline-chart"]')).toBeVisible({
      timeout: 1000,
    });
  });
});
```

**Agent**: Use `test-runner-fixer` with Playwright MCP

```bash
claude-code invoke test-runner-fixer "Write Playwright E2E tests for modal tab navigation and lazy loading"
```

**Checklist**:

- [ ] E2E tests written
- [ ] All tabs tested
- [ ] Lazy loading verified
- [ ] Tests passing

---

## Phase 3 Summary

### Completed Components

✅ Level 0: CompactProjectRow + ProjectListContainer  
✅ Level 1: ExpandableProjectCard + ExpandedCardContent  
✅ Level 2: ProjectAnalyticsModal + HorizontalTabsNav + 4 Tab Components

### Tests Written

✅ Unit tests (Level 0, Level 1)  
✅ E2E tests (Level 2 modal)  
✅ Responsive behavior tests

### Animations Implemented

✅ CSS expansion (Level 1)  
✅ Framer Motion modal (Level 2)  
✅ Skeleton loading states

---

**Next**: Read [PART 7: Implementation Phase 4-6](part-7) for state management, animations, and responsive implementation.
