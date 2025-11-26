# Repository Card UX/UI Redesign Brainstorm

**Date**: 2025-11-26
**Status**: Brainstorm / Planning
**Goal**: Make repository cards MORE valuable than viewing GitHub directly

---

## Executive Summary

### The Core Problem

Current repository cards duplicate GitHub's functionality without adding unique value:
- Languages shown TWICE (header bar + "TECH STACK" section)
- "PROJECT IMPACT" just shows stars/forks (GitHub already shows this)
- Too much vertical space wasted
- No unique analytics or insights that answer: **"Why is this better than GitHub?"**

### Target Users

1. **Recruiters** - Need to quickly assess candidate's skills and real contributions
2. **Hiring Managers** - Want to understand code quality and ownership level
3. **Developers** - Checking profiles for collaboration opportunities or learning

### Key Insight

This is a **USER analytics site**, not just a GitHub mirror. Cards should answer:
- "What role did THIS user play in THIS project?"
- "How significant is their contribution?"
- "What skills did they demonstrate?"
- "Is this project worth looking at on GitHub?"

---

## Unique Value Proposition

### What Makes These Cards Better Than GitHub

#### 1. User-Centric Context
- **GitHub shows**: Repository statistics
- **We show**: User's specific role and contribution percentage in this repo

#### 2. Contribution Insights
- **GitHub shows**: Total commits/stars
- **We show**: User's commit %, ownership level, contribution pattern

#### 3. Quality Indicators
- **GitHub shows**: Language breakdown
- **We show**: Project health, user's skill demonstration, code ownership signals

#### 4. Time Intelligence
- **GitHub shows**: Last updated date
- **We show**: User's active period, contribution freshness, engagement pattern

#### 5. Role Clarity
- **GitHub shows**: Owner/Contributor tag
- **We show**: Ownership %, collaboration style, responsibility level

---

## Recommended Metrics & Insights

### Must-Have Metrics (Priority 1)

#### 1. User Contribution Percentage
**Why**: Most important context - "How much of this is YOUR work?"
- Display: Large percentage badge (e.g., "68%")
- Color coding:
  - 80-100%: Green (Primary owner)
  - 50-79%: Blue (Major contributor)
  - 20-49%: Yellow (Regular contributor)
  - 1-19%: Gray (Minor contributor)
- Context: "342 of 500 commits"

#### 2. Role Indicator
**Why**: Clarifies user's responsibility level
- Options:
  - "Owner" - User owns the repo
  - "Maintainer" - 50%+ commits
  - "Core Contributor" - 20-49% commits
  - "Contributor" - <20% commits
- Icon-based for quick scanning

#### 3. Activity Freshness
**Why**: Shows if user is still engaged
- Last commit date (user-specific, not repo)
- Active period: "Jan 2023 - Nov 2024"
- Visual indicator:
  - Active (last 30 days): Green pulse
  - Recent (30-90 days): Yellow
  - Inactive (90+ days): Gray

#### 4. Commit Activity Bar
**Why**: Shows user's contribution intensity over time
- Horizontal bar showing commit frequency
- Already implemented: CombinedLanguageActivityBar
- Enhancement: Make width represent user's commits, not total

### Nice-to-Have Metrics (Priority 2)

#### 5. Skills Demonstrated
**Why**: Shows what user learned/used in this project
- Top 3 languages with percentages
- NEW: Extract from user's commits only (not whole repo)
- Inline chips: `TypeScript 68% • React 22% • CSS 10%`

#### 6. Code Ownership Score
**Why**: Shows user's technical investment
- Calculated from:
  - Commit percentage
  - LOC contributed (if available)
  - PR merge rate
  - Code review participation
- Display: 0-100 score with label
  - 80+: "High Ownership"
  - 60-79: "Strong Involvement"
  - 40-59: "Moderate Involvement"
  - <40: "Limited Involvement"

#### 7. Collaboration Indicators
**Why**: Shows teamwork ability
- PRs merged: Shows collaboration workflow
- Code reviews: Shows mentorship/quality focus
- Team size: Context for contribution %
- Display: Icon + number badges

#### 8. Project Health Score
**Why**: Indicates quality of user's work environment
- Factors:
  - Recent activity (repo-wide)
  - Star/fork ratio
  - Issue response time (if available)
  - Documentation presence
- Display: Health badge (Healthy/Active/Stale/Archived)

### Lower Priority (Priority 3)

#### 9. Complexity Indicators
- Language diversity in user's commits
- File types modified (backend/frontend/infra)
- Codebase size user touched

#### 10. Impact Multiplier
- If repo has stars: Show "Your work has X stars"
- If fork: Show "Contributing to Y community"

---

## Information Architecture

### Level 0: Ultra-Compact List Row (48px mobile / 56px desktop)

**Philosophy**: Scanner mode - show only critical decision-making info

```
┌─────────────────────────────────────────────────────────┐
│ ◉ ProjectName    [Fork] [68%] 342c ⭐1.2K 🔵 TypeScript │
│ ──────────────────── (activity bar) ─────────────────── │
└─────────────────────────────────────────────────────────┘
```

**Must Show**:
- Project name (truncated)
- Fork badge (if applicable)
- **User contribution %** (color-coded badge) ← NEW
- Commits (user's count)
- Stars (repo total)
- Primary language (icon + name)
- Combined language+activity bar (existing)

**Remove**:
- Detailed metrics (move to expanded)
- Language list (keep only primary)

**Rationale**:
- Contribution % is THE most important differentiator
- Activity bar already shows commit intensity
- Everything else can wait until expansion

---

### Level 1: Expandable Card (Expanded State)

**Philosophy**: Detail mode - show user's full story in this project

**Current Issues**:
1. Languages shown TWICE (bar + "TECH STACK")
2. "PROJECT IMPACT" section has no user-specific context
3. Too many section headers for small content
4. Wasted vertical space

**Proposed Layout** (280-320px height):

```
┌──────────────────────────────────────────────────────────────┐
│ Header Row (always visible - collapsed state)                │
│ ═══════════════════════════════════════════════════════════ │
│                                                                │
│ [Section 1: User's Contribution] ★ PRIMARY                    │
│   ┌─────────────────────────────────────────────────────┐   │
│   │ ████████████░░░░░░░░░░ 68% MAINTAINER               │   │
│   │ 342 of 500 commits • 15 PRs merged • 8 reviews      │   │
│   │ Active: Jan 2023 - Nov 2024 (22 months)             │   │
│   └─────────────────────────────────────────────────────┘   │
│                                                                │
│ [Section 2: Your Skills] (REPLACES "TECH STACK")             │
│   TypeScript 68% • JavaScript 22% • CSS 10%                  │
│   (from YOUR commits, not repo-wide)                          │
│                                                                │
│ [Section 3: Project Context] (REPLACES "PROJECT IMPACT")     │
│   ⭐ 1.2K stars • 🍴 234 forks • 👥 12 contributors          │
│   Status: Active • Last updated: 2 days ago                   │
│   Your impact: Your work has 1.2K stars                       │
│                                                                │
│ [Footer: Team + Actions]                                      │
│   👤👤👤👤 +8 → [View on GitHub]                            │
└──────────────────────────────────────────────────────────────┘
```

**Key Changes**:

1. **Section 1: User's Contribution** (NEW - MOST IMPORTANT)
   - Large progress bar (contribution %)
   - Role badge (Owner/Maintainer/Contributor)
   - Key metrics: commits, PRs, reviews
   - Active period (user-specific dates)
   - **This is the hero section** - largest visual weight

2. **Section 2: Your Skills** (RENAMED from "TECH STACK")
   - Change focus from "repo languages" to "YOUR languages"
   - Show languages from user's commits only
   - Remove redundancy with top bar
   - Inline format (not vertical list)

3. **Section 3: Project Context** (RENAMED from "PROJECT IMPACT")
   - Add user-centric framing: "Your impact: Your work has X stars"
   - Add repo health status
   - Combine stars/forks/contributors in one line
   - Add "Last updated" for freshness

4. **Remove**:
   - Duplicate language bar at top (keep combined bar only)
   - Redundant "TECH STACK" header
   - Verbose formatting

---

### Visual Design Principles

#### 1. Visual Hierarchy System

**Tier 1 (Highest Priority)**: User contribution data
- Largest font size
- Primary colors
- Maximum contrast
- Most space

**Tier 2**: Skills and role indicators
- Medium font size
- Accent colors
- Inline format

**Tier 3**: Project context
- Smaller font size
- Muted colors
- Compact format

#### 2. Color Coding Strategy

**Contribution Level Colors** (Primary indicator):
- 80-100%: `hsl(var(--success))` - Primary Owner
- 50-79%: `hsl(var(--primary))` - Major Contributor
- 20-49%: `hsl(var(--warning))` - Regular Contributor
- 1-19%: `hsl(var(--muted-foreground))` - Minor Contributor

**Activity Status Colors**:
- Active (0-30 days): `hsl(var(--success))` with pulse animation
- Recent (30-90 days): `hsl(var(--warning))`
- Inactive (90+ days): `hsl(var(--muted-foreground))`

**Health Status Colors**:
- Healthy: Green
- Active: Blue
- Stale: Yellow
- Archived: Red

#### 3. Icon System

**Role Icons** (use existing lucide-react):
- Owner: `Crown` (gold)
- Maintainer: `Shield` (blue)
- Core Contributor: `Star` (yellow)
- Contributor: `User` (gray)

**Activity Icons**:
- Commits: `GitCommit`
- PRs: `GitPullRequest`
- Reviews: `MessageSquare`
- Team: `Users`

**Status Icons**:
- Active: `Activity` (with pulse)
- Archived: `Archive`
- Fork: `GitFork`

#### 4. Progress Bar Design

**Contribution Progress Bar** (replaces simple percentage):
```
████████████████░░░░░░░░ 68% MAINTAINER
342 of 500 commits
```
- Uses existing `Progress` component from shadcn/ui
- Color based on contribution level
- Label overlay with role
- Subtitle with commit counts

#### 5. Spacing & Rhythm

**Current problem**: Too much vertical space

**Solution** - Tighter spacing:
- Section spacing: `space-y-3` (12px) instead of `space-y-4` (16px)
- Inter-element spacing: `gap-1.5` (6px) for inline elements
- Padding: `p-3` (12px) instead of `p-4` (16px)
- Max expanded height: ~280px (currently ~350px)

---

## Responsive Considerations

### Mobile (<768px)

**Challenges**:
- Limited horizontal space
- Touch targets need 44x44px minimum
- Text truncation more aggressive

**Adaptations**:

#### Level 0 (Compact Row):
- Height: 48px (tighter than desktop 56px)
- Hide "Fork" text, keep icon only
- Contribution % stays (critical)
- Abbreviate: "342c" instead of "342 commits"
- Hide language name, keep colored dot only

#### Level 1 (Expanded):
- Stack metrics vertically more
- Contribution bar: Full width, 8px height (larger tap target)
- Skills: Max 2 languages shown, "+ N more"
- Team avatars: 3 max, then "+N"

### Tablet (768-1439px)

**Approach**: Desktop layout but slightly condensed
- Level 0: Same as desktop (56px)
- Level 1: Show all content, slightly tighter spacing

### Desktop (≥1440px)

**Approach**: Full information density
- Level 0: 56px rows
- Level 1: All metrics visible
- Hover effects on interactive elements

---

## Interaction Patterns

### Current Issues
1. Entire card is clickable (good)
2. No visual feedback on which section is interactive
3. No progressive disclosure within expanded state

### Proposed Enhancements

#### 1. Hover States

**Level 0 Row**:
- Current: Scale up, background color change (KEEP)
- Add: Subtle border color change
- Add: Cursor shows pointer

**Level 1 Expanded**:
- Contribution bar: Tooltip on hover with breakdown
- Language chips: Tooltip with LOC stats
- Team avatars: Tooltip with member details
- "View on GitHub": Primary button hover state

#### 2. Loading States

**Skeleton pattern** for progressive loading:
```
┌─────────────────────────────────┐
│ ▮▮▮▮▮▮▮ ▯▯▯ ▯▯ ▯▯▯             │
│ ─────────────────────────────── │
└─────────────────────────────────┘
```
- Use existing `Skeleton` component
- Show immediately on data fetch
- Animate in actual content

#### 3. Empty States

**No contribution data available**:
- Show: "Contribution data unavailable"
- Fallback to basic GitHub metrics
- Still show project context

**Fork with no user commits**:
- Contribution %: "0%"
- Role: "Forked"
- Message: "No commits in this fork"

#### 4. Micro-interactions

**Contribution percentage badge**:
- Entrance animation: Scale in + fade
- Color transition: Smooth (200ms)
- Pulse effect for 80%+ (owner level)

**Activity status indicator**:
- Active repos: Subtle pulse animation (2s cycle)
- Use `prefers-reduced-motion` media query

**Expand/collapse**:
- Chevron rotation: 180deg (existing)
- Content fade: opacity 0→1 (existing)
- Height animation: smooth (existing)

---

## Accessibility Considerations

### WCAG 2.1 AA Compliance

#### 1. Color Contrast
- Contribution %: 4.5:1 minimum (text)
- Progress bar: 3:1 minimum (UI component)
- All text on backgrounds: 4.5:1 minimum

#### 2. Keyboard Navigation
- Level 0 row: Tab stops, Enter/Space to expand
- Expanded: Tab through interactive elements
- "View on GitHub" link: Focusable, clear focus ring
- Escape key: Collapse expanded card

#### 3. Screen Reader Support

**Aria labels**:
```html
<div
  role="button"
  aria-expanded={isExpanded}
  aria-label="ProjectName, 68% contribution, 342 commits, 1200 stars. Press Enter to expand."
>
```

**Progress bar**:
```html
<Progress
  value={68}
  aria-label="User contributed 68% of total commits, 342 of 500"
/>
```

**Status indicators**:
```html
<span aria-label="Repository is actively maintained">
  <Activity className="h-4 w-4" aria-hidden="true" />
  Active
</span>
```

#### 4. Focus Management
- Expanding card: Focus stays on card button
- Collapsing: Focus returns to trigger
- Clear focus indicators: 2px ring with offset

#### 5. Reduced Motion
```tsx
const prefersReducedMotion = useReducedMotion();

// Disable animations if user prefers
<motion.div
  animate={{ opacity: 1 }}
  transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
>
```

---

## Technical Implementation Strategy

### Phase 1: Data Layer Enhancement

#### 1.1 Extend GraphQL Queries
**File**: `src/apollo/queries/yearContributions.ts`

Add to `RepositoryContribution` query:
- User's first commit date (for active period start)
- User's last commit date (for activity freshness)
- User's PR count in repo
- User's review count in repo

#### 1.2 Enhance Project Adapter
**File**: `src/lib/adapters/project-adapter.ts`

Add to `ExpandableProject` interface (extends existing):
```typescript
export interface ExpandableProject extends CompactProject {
  // EXISTING FIELDS
  url: string;
  forks?: number;
  contributionPercent?: number;
  totalCommits?: number;
  userCommits?: number;
  prsMerged?: number;
  reviews?: number;
  activePeriod?: string;
  teamCount?: number;
  topContributors?: TeamMember[];

  // NEW FIELDS - Priority 1
  roleLabel?: 'Owner' | 'Maintainer' | 'Core Contributor' | 'Contributor';
  activityStatus?: 'Active' | 'Recent' | 'Inactive';
  lastUserCommitDate?: string;
  firstUserCommitDate?: string;

  // NEW FIELDS - Priority 2
  codeOwnershipScore?: number; // 0-100
  projectHealthStatus?: 'Healthy' | 'Active' | 'Stale' | 'Archived';
  userLanguages?: LanguageInfo[]; // Languages from user's commits only
  impactMessage?: string; // e.g., "Your work has 1.2K stars"
}
```

#### 1.3 Add Calculation Functions
**File**: `src/lib/metrics/repository-metrics.ts` (NEW)

```typescript
/**
 * Calculate user's role based on contribution percentage
 */
export function calculateRepositoryRole(
  contributionPercent: number,
  isOwner: boolean
): 'Owner' | 'Maintainer' | 'Core Contributor' | 'Contributor' {
  if (isOwner) return 'Owner';
  if (contributionPercent >= 50) return 'Maintainer';
  if (contributionPercent >= 20) return 'Core Contributor';
  return 'Contributor';
}

/**
 * Calculate activity freshness status
 */
export function calculateActivityStatus(
  lastCommitDate: string
): 'Active' | 'Recent' | 'Inactive' {
  const daysSince = (Date.now() - new Date(lastCommitDate).getTime()) / (1000 * 60 * 60 * 24);
  if (daysSince <= 30) return 'Active';
  if (daysSince <= 90) return 'Recent';
  return 'Inactive';
}

/**
 * Calculate code ownership score (0-100)
 */
export function calculateCodeOwnershipScore(
  contributionPercent: number,
  prsMerged: number,
  reviews: number,
  activeDays: number
): number {
  // 40% from contribution percentage
  const commitScore = contributionPercent * 0.4;

  // 30% from PR activity (capped at 30)
  const prScore = Math.min((prsMerged / 20) * 30, 30);

  // 20% from code reviews (capped at 20)
  const reviewScore = Math.min((reviews / 10) * 20, 20);

  // 10% from sustained activity (capped at 10)
  const activityScore = Math.min((activeDays / 365) * 10, 10);

  return Math.round(commitScore + prScore + reviewScore + activityScore);
}

/**
 * Calculate project health status
 */
export function calculateProjectHealth(
  lastRepoUpdateDays: number,
  starToForkRatio: number,
  isArchived: boolean
): 'Healthy' | 'Active' | 'Stale' | 'Archived' {
  if (isArchived) return 'Archived';
  if (lastRepoUpdateDays <= 30 && starToForkRatio >= 2) return 'Healthy';
  if (lastRepoUpdateDays <= 90) return 'Active';
  return 'Stale';
}
```

### Phase 2: Component Refactoring

#### 2.1 Level 0: CompactProjectRow
**File**: `src/components/level-0/CompactProjectRow.tsx`

**Changes**:
1. Add contribution % badge (prominent)
2. Simplify metrics display
3. Keep only primary language (remove list)

**Estimated effort**: 2-3 hours

#### 2.2 Level 1: ExpandableProjectCard
**File**: `src/components/level-1/ExpandableProjectCard.tsx`

**Major refactoring needed**:

1. **Restructure sections**:
   - NEW: `ContributionSection` (hero section)
   - RENAME: `TechStackSection` → `UserSkillsSection`
   - RENAME: `ImpactSection` → `ProjectContextSection`
   - KEEP: `TeamSection`

2. **ContributionSection** (NEW):
```typescript
function ContributionSection({
  contributionPercent,
  roleLabel,
  userCommits,
  totalCommits,
  prsMerged,
  reviews,
  activePeriod,
  activityStatus,
  codeOwnershipScore,
}: ContributionSectionProps) {
  return (
    <section aria-labelledby="contribution-heading" className="space-y-2">
      <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Your Contribution
      </h4>

      {/* Large progress bar with role label */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <Badge variant={getRoleVariant(roleLabel)}>{roleLabel}</Badge>
          <span className="text-lg font-bold">{contributionPercent}%</span>
        </div>
        <Progress
          value={contributionPercent}
          className="h-3"
          indicatorClassName={getContributionColor(contributionPercent)}
        />
        <p className="text-xs text-muted-foreground">
          {formatNumber(userCommits)} of {formatNumber(totalCommits)} commits
        </p>
      </div>

      {/* Metrics row */}
      <div className="flex flex-wrap gap-3 text-sm">
        {prsMerged && (
          <span className="flex items-center gap-1">
            <GitPullRequest className="h-3.5 w-3.5" />
            {prsMerged} PRs
          </span>
        )}
        {reviews && (
          <span className="flex items-center gap-1">
            <MessageSquare className="h-3.5 w-3.5" />
            {reviews} reviews
          </span>
        )}
      </div>

      {/* Active period with status indicator */}
      <div className="flex items-center gap-2 text-xs">
        <ActivityStatusBadge status={activityStatus} />
        <span className="text-muted-foreground">Active: {activePeriod}</span>
      </div>

      {/* Code ownership score (if available) */}
      {codeOwnershipScore !== undefined && (
        <div className="pt-1">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Code Ownership</span>
            <span className="font-medium">{codeOwnershipScore}/100</span>
          </div>
        </div>
      )}
    </section>
  );
}
```

3. **UserSkillsSection** (RENAMED):
```typescript
function UserSkillsSection({
  userLanguages,
  allLanguages
}: UserSkillsSectionProps) {
  // Prioritize languages from user's commits
  const displayLanguages = userLanguages?.length
    ? userLanguages
    : allLanguages;

  return (
    <section aria-labelledby="skills-heading">
      <h4 className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Your Skills
      </h4>
      <div className="flex flex-wrap gap-x-3 gap-y-1 text-sm">
        {displayLanguages.slice(0, 3).map((lang) => (
          <span key={lang.name} className="flex items-center gap-1">
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: getLanguageColor(lang.name) }}
            />
            {lang.name} {lang.percent}%
          </span>
        ))}
      </div>
    </section>
  );
}
```

4. **ProjectContextSection** (RENAMED):
```typescript
function ProjectContextSection({
  stars,
  forks,
  teamCount,
  healthStatus,
  lastUpdated,
  impactMessage,
}: ProjectContextSectionProps) {
  return (
    <section aria-labelledby="context-heading">
      <h4 className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Project Context
      </h4>

      {/* Impact message (user-centric) */}
      {impactMessage && (
        <p className="text-sm text-primary font-medium mb-2">
          {impactMessage}
        </p>
      )}

      {/* Metrics row */}
      <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
        <span className="flex items-center gap-1">
          <Star className="h-4 w-4" />
          {formatNumber(stars)} stars
        </span>
        {forks && (
          <span className="flex items-center gap-1">
            <GitFork className="h-4 w-4" />
            {formatNumber(forks)} forks
          </span>
        )}
        {teamCount && (
          <span className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            {teamCount} contributors
          </span>
        )}
        <HealthStatusBadge status={healthStatus} />
      </div>

      {/* Last updated */}
      {lastUpdated && (
        <p className="text-xs text-muted-foreground mt-1">
          Last updated: {lastUpdated}
        </p>
      )}
    </section>
  );
}
```

**Estimated effort**: 4-6 hours

#### 2.3 New Supporting Components

**File**: `src/components/level-1/ActivityStatusBadge.tsx` (NEW)
```typescript
export function ActivityStatusBadge({
  status
}: { status: 'Active' | 'Recent' | 'Inactive' }) {
  const config = {
    Active: {
      icon: Activity,
      color: 'text-success',
      bg: 'bg-success/10',
      pulse: true
    },
    Recent: {
      icon: Clock,
      color: 'text-warning',
      bg: 'bg-warning/10',
      pulse: false
    },
    Inactive: {
      icon: Clock,
      color: 'text-muted-foreground',
      bg: 'bg-muted',
      pulse: false
    },
  };

  const { icon: Icon, color, bg, pulse } = config[status];

  return (
    <Badge variant="outline" className={cn("gap-1", bg)}>
      <Icon className={cn("h-3 w-3", color, pulse && "animate-pulse")} />
      <span className={color}>{status}</span>
    </Badge>
  );
}
```

**File**: `src/components/level-1/HealthStatusBadge.tsx` (NEW)
```typescript
export function HealthStatusBadge({
  status
}: { status: 'Healthy' | 'Active' | 'Stale' | 'Archived' }) {
  const config = {
    Healthy: { icon: Heart, color: 'text-success' },
    Active: { icon: Activity, color: 'text-primary' },
    Stale: { icon: Clock, color: 'text-warning' },
    Archived: { icon: Archive, color: 'text-destructive' },
  };

  const { icon: Icon, color } = config[status];

  return (
    <span className="flex items-center gap-1">
      <Icon className={cn("h-3.5 w-3.5", color)} />
      <span className={color}>{status}</span>
    </span>
  );
}
```

**Estimated effort**: 2 hours

### Phase 3: Storybook Stories

**Files to create/update**:
1. `src/components/level-0/CompactProjectRow.stories.tsx` - UPDATE
2. `src/components/level-1/ExpandableProjectCard.stories.tsx` - UPDATE
3. `src/components/level-1/ActivityStatusBadge.stories.tsx` - NEW
4. `src/components/level-1/HealthStatusBadge.stories.tsx` - NEW

**Story variants**:
- Owner (80%+ contribution)
- Maintainer (50-79%)
- Contributor (20-49%)
- Minor contributor (<20%)
- Fork with no commits
- Archived project
- Active vs Recent vs Inactive status
- With/without PR/review data

**Estimated effort**: 3-4 hours

### Phase 4: Testing

**Files to create/update**:
1. `src/components/level-0/CompactProjectRow.test.tsx` - UPDATE
2. `src/components/level-1/ExpandableProjectCard.test.tsx` - UPDATE
3. `src/components/level-1/ActivityStatusBadge.test.tsx` - NEW
4. `src/components/level-1/HealthStatusBadge.test.tsx` - NEW
5. `src/lib/metrics/repository-metrics.test.ts` - NEW

**Test coverage requirements**:
- All calculation functions: 100%
- Component rendering: All variants
- Accessibility: Keyboard nav, screen readers, color contrast
- Edge cases: Missing data, zero values, extreme values

**Estimated effort**: 4-5 hours

### Total Estimated Effort: 15-20 hours

---

## Success Metrics

### User Experience Metrics

1. **Information Scent**
   - Target: Users can identify high-value repos in <2 seconds
   - Measure: Time to click on a repo card

2. **Cognitive Load**
   - Target: Reduced vertical scrolling by 30%
   - Measure: Cards visible per viewport

3. **Decision Confidence**
   - Target: Users can explain "why this repo matters" after viewing
   - Measure: User interviews / feedback

### Technical Metrics

1. **Performance**
   - Target: No increase in render time
   - Measure: Lighthouse performance score
   - Constraint: <100ms per card render

2. **Accessibility**
   - Target: WCAG 2.1 AA compliance
   - Measure: Axe DevTools audit
   - Constraint: 0 critical/serious issues

3. **Test Coverage**
   - Target: Maintain 90%+ coverage
   - Measure: Vitest coverage report
   - Constraint: 100% for calculation functions

---

## Migration Strategy

### Phase 1: Parallel Implementation (Week 1)
- Implement new components alongside existing
- Use feature flag: `ENABLE_NEW_REPO_CARDS`
- Test in Storybook only

### Phase 2: A/B Testing (Week 2)
- Deploy to 10% of users
- Collect feedback via in-app survey
- Monitor analytics for engagement

### Phase 3: Gradual Rollout (Week 3)
- Increase to 50% if metrics positive
- Address feedback issues
- Prepare for full launch

### Phase 4: Full Launch (Week 4)
- Deploy to 100% of users
- Remove old components
- Update documentation

---

## Open Questions

### Technical Questions

1. **GraphQL Data Availability**
   - Q: Can we get user-specific commit dates per repo?
   - A: Check GitHub GraphQL API `ContributionsCollection`

2. **User Language Breakdown**
   - Q: Can we extract languages from user's commits only?
   - A: May require additional API calls or approximation

3. **Code Review Data**
   - Q: Is review count available in current API?
   - A: Check `pullRequests` connection with `reviews` field

### Design Questions

1. **Contribution % Threshold**
   - Q: Are 80/50/20% the right thresholds for role labels?
   - A: May need adjustment based on real data distribution

2. **Activity Status Time Windows**
   - Q: Is 30/90 days the right cadence?
   - A: May vary by project type (active OSS vs maintenance mode)

3. **Information Density**
   - Q: Is Level 1 too dense? Too sparse?
   - A: A/B test with users

---

## Next Steps

### Immediate Actions (This Week)

1. **Validate Data Availability**
   - [ ] Audit GitHub GraphQL API for required fields
   - [ ] Prototype data fetching for missing fields
   - [ ] Estimate API rate limit impact

2. **Create Design Mockups**
   - [ ] Design in Figma (optional, can skip to code)
   - [ ] Share with stakeholders for feedback
   - [ ] Iterate on visual design

3. **Prototype Core Components**
   - [ ] Build `ContributionSection` in isolation
   - [ ] Build `ActivityStatusBadge`
   - [ ] Test in Storybook

### Short-term (Next 2 Weeks)

4. **Implement Phase 1 (Data Layer)**
   - [ ] Extend GraphQL queries
   - [ ] Update adapters
   - [ ] Add calculation functions
   - [ ] Write tests

5. **Implement Phase 2 (Components)**
   - [ ] Refactor CompactProjectRow
   - [ ] Refactor ExpandableProjectCard
   - [ ] Create new badge components
   - [ ] Build Storybook stories

6. **Implement Phase 3 (Testing)**
   - [ ] Write unit tests
   - [ ] Run accessibility audits
   - [ ] Collect user feedback

### Medium-term (Next Month)

7. **Deploy & Iterate**
   - [ ] A/B test with real users
   - [ ] Collect analytics data
   - [ ] Iterate based on feedback
   - [ ] Full rollout

---

## Conclusion

This redesign transforms repository cards from **GitHub mirrors** to **user analytics tools** by:

1. **Prioritizing user contribution context** over generic repo stats
2. **Eliminating redundancy** (languages shown once, not twice)
3. **Adding unique insights** (role, ownership, activity status)
4. **Improving information hierarchy** (most important data first)
5. **Maintaining accessibility** and performance standards

The key differentiator is answering: **"What did THIS user do in THIS project?"** instead of just showing what GitHub already shows.

Users will now be able to:
- Quickly identify high-impact projects (68% contribution vs 5%)
- Understand developer roles (Owner vs Contributor)
- Assess engagement level (Active vs Inactive)
- Make informed decisions about viewing on GitHub

This makes the cards significantly MORE valuable than just looking at GitHub directly.
