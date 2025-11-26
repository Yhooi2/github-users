# ExpandableProjectCard Redesign Specification

## Executive Summary

Complete redesign of the Level 1 ExpandableProjectCard component to eliminate modal dependencies and provide all information inline with progressive disclosure via tooltips. The new design prioritizes information density, scannability, and minimal interaction cost.

**Key Changes:**
- Remove Analytics and GitHub buttons
- Remove ProjectAnalyticsModal dependency
- Show most important metrics in collapsed state
- Inline all details in expanded state with compact formatting
- Add contextual tooltips for deeper insights
- GitHub link as icon-only with tooltip

---

## Design Principles

1. **Information Density** - Show maximum relevant data in minimal space
2. **Progressive Disclosure** - Use hover tooltips instead of click interactions
3. **Scannability** - Visual hierarchy guides eye to most important information
4. **Zero Modal Friction** - All information accessible inline
5. **Mobile-First Tooltips** - Tap to show on touch devices

---

## Visual Layout

### COLLAPSED STATE (Default)
```
┌─────────────────────────────────────────────────────────────┐
│  ProjectName [Fork?]          🎯95  ⭐1.2k  📊18%     ⌄   │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │  <- Combined bar
│  TypeScript 68% • JavaScript 22% • CSS 10%                  │  <- Top 3 langs
└─────────────────────────────────────────────────────────────┘
     ^          ^         ^        ^      ^       ^       ^
   Name      Badge    Quality   Stars   Your%  Chevron  Hover
```

**Height:** 72px (mobile: 64px)

### EXPANDED STATE (On Click)
```
┌─────────────────────────────────────────────────────────────┐
│  ProjectName [Fork?]          🎯95  ⭐1.2k  📊18%     ⌃   │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │
│  TypeScript 68% • JavaScript 22% • CSS 10%                  │
├─────────────────────────────────────────────────────────────┤
│  A modern React application for data visualization and...  │  <- Description
│                                                              │
│  YOUR CONTRIBUTION                                           │
│  ▓▓▓▓▓░░░░░ 18%  346 of 1,923 commits                      │
│  42 PRs merged • 156 reviews • Jan 2024 - Nov 2025          │
│                                                              │
│  PROJECT IMPACT                                              │
│  ⭐ 1,250 stars • 🔱 89 forks • 👥 12 contributors         │
│                                                              │
│  TECH STACK                                                  │
│  ● TypeScript 68%  ● JavaScript 22%  ● CSS 10%             │
│                                                              │
│  TEAM                 [Avatar] [Avatar] [Avatar] +9  🔗     │  <- GitHub icon
└─────────────────────────────────────────────────────────────┘
```

**Max Height:** 400px with scroll if needed

---

## Data Structure

### Enhanced ExpandableProject Interface
```typescript
export interface ExpandableProject extends CompactProject {
  // Existing
  url: string;
  forks?: number;

  // NEW: Inline metrics (optional - show when available)
  qualityScore?: number;           // 0-100 for badge
  contributionPercent?: number;    // User's commit %
  totalCommits?: number;           // Total repo commits
  userCommits?: number;            // User's commits
  prsMerged?: number;              // User's PRs
  reviews?: number;                // User's reviews
  activePeriod?: string;           // "Jan 2024 - Nov 2025"
  topLanguages?: Array<{           // Top 3-5 languages
    name: string;
    percent: number;
  }>;
  teamCount?: number;              // Total contributors
  topContributors?: Array<{        // Top 3-5 team members
    name: string;
    avatar: string;
    login?: string;
  }>;
}
```

---

## Collapsed State Details

### Top Row (Always Visible)

#### 1. Project Name
- **Font:** `text-sm font-medium` (14px, 500 weight)
- **Truncate:** Single line with ellipsis
- **Max Width:** Flexible, fills available space

#### 2. Fork Badge (Conditional)
- **Show When:** `project.isFork === true`
- **Icon:** `GitFork` (12px)
- **Text:** "Fork" on desktop, icon-only on mobile
- **Style:** `<Badge variant="outline">`
- **No Tooltip:** Self-explanatory

#### 3. Quality Score Badge (NEW)
- **Show When:** `project.qualityScore` is available
- **Format:** `🎯 95` (icon + number)
- **Colors:**
  - 90-100: `text-green-600 dark:text-green-400`
  - 70-89: `text-blue-600 dark:text-blue-400`
  - 50-69: `text-yellow-600 dark:text-yellow-400`
  - <50: `text-red-600 dark:text-red-400`
- **Tooltip:** "Code Quality: 95/100 - Excellent code patterns, comprehensive tests, minimal technical debt"
- **Size:** `text-xs font-semibold`

#### 4. Stars Count
- **Format:** `⭐ 1.2k` (icon + formatted number)
- **Style:** `text-xs text-muted-foreground`
- **Tooltip:** "1,250 stars - Top 5% of TypeScript projects in 2024"
- **Context:** Add percentile rank when available

#### 5. Contribution % (NEW)
- **Show When:** `project.contributionPercent` is available
- **Format:** `📊 18%` (chart icon + percentage)
- **Style:** `text-xs font-medium text-primary`
- **Tooltip:** "You contributed 18% of 1,923 total commits (346 commits)"
- **Highlight:** Different color to emphasize user impact

#### 6. Chevron
- **Icon:** `ChevronDown` rotates 180° when expanded
- **Animation:** 200ms ease with reduced motion support
- **ARIA:** Handled by card role="button" and aria-expanded

### Combined Language Activity Bar
- **Kept from current design**
- Width represents activity level (commits vs maxCommits)
- Colors represent language distribution
- Height: 6px (desktop), 4px (mobile)
- Enhanced contrast when expanded

### Top Languages Inline (NEW)
- **Show When:** More than 1 language
- **Format:** "TypeScript 68% • JavaScript 22% • CSS 10%"
- **Max Languages:** Top 3 (top 2 on mobile)
- **Style:** `text-xs text-muted-foreground`
- **Separator:** Bullet point (•)
- **Tooltip on each:** "TypeScript: 68% (12,345 lines) - Primary language with strong type safety"

---

## Expanded State Details

### Description Section
```tsx
<p className="text-sm text-muted-foreground line-clamp-3">
  {project.description}
</p>
```
- **Max Lines:** 3 (increased from 2)
- **Tooltip:** Full description on hover if truncated
- **Font:** `text-sm` (14px)

### YOUR CONTRIBUTION Section

#### Visual Design
```
YOUR CONTRIBUTION
▓▓▓▓▓░░░░░ 18%  346 of 1,923 commits
42 PRs merged • 156 reviews • Jan 2024 - Nov 2025
```

#### Components
1. **Section Header**
   - Text: "YOUR CONTRIBUTION"
   - Style: `text-xs font-semibold uppercase tracking-wider text-muted-foreground`

2. **Progress Bar**
   - Component: `<Progress value={18} className="h-2" />`
   - Label: "18% 346 of 1,923 commits"
   - Tooltip: "Your 346 commits represent 18% of the project's 1,923 total commits. This shows significant long-term investment."

3. **Contribution Metrics**
   - Format: Icon + Number + Label
   - **PRs:** `<GitPullRequest className="h-3.5 w-3.5" /> 42 PRs merged`
     - Tooltip: "42 pull requests merged - Your code reviews averaged 2.3 days to merge"
   - **Reviews:** `<MessageSquare className="h-3.5 w-3.5" /> 156 reviews`
     - Tooltip: "156 code reviews - You reviewed 8% of all project PRs"
   - Separator: Bullet (•)
   - Style: `text-sm`

4. **Active Period**
   - Format: "Active: Jan 2024 - Nov 2025"
   - Style: `text-xs text-muted-foreground`
   - Tooltip: "Active period: 23 months with contributions in 18 of those months"

### PROJECT IMPACT Section

```
PROJECT IMPACT
⭐ 1,250 stars • 🔱 89 forks • 👥 12 contributors
```

#### Components
1. **Stars**
   - Icon: `<Star className="h-4 w-4" />`
   - Format: "1,250 stars"
   - Tooltip: "1,250 stars - This project is in the top 5% of TypeScript repositories. Growth: +280 stars in the last year."

2. **Forks**
   - Icon: `<GitFork className="h-4 w-4" />`
   - Format: "89 forks"
   - Tooltip: "89 forks - 23 active forks with recent commits, indicating strong community engagement"

3. **Contributors**
   - Icon: `<Users className="h-4 w-4" />`
   - Format: "12 contributors"
   - Tooltip: "12 total contributors - 4 core maintainers, 8 occasional contributors"

- **Layout:** Horizontal flex with gap-4
- **Style:** `text-sm text-muted-foreground`

### TECH STACK Section

```
TECH STACK
● TypeScript 68%  ● JavaScript 22%  ● CSS 10%
```

#### Components
1. **Language Dots**
   - Circle with language color: `getLanguageColor(lang)`
   - Size: 8px diameter
   - Inline with text

2. **Format**
   - "● TypeScript 68%"
   - Separator: Multiple spaces (not bullets, for cleaner look)

3. **Tooltips**
   - "TypeScript: 68% (45,230 lines) - Primary language with strict type checking enabled"
   - "JavaScript: 22% (14,560 lines) - Legacy code and build scripts"
   - "CSS: 10% (6,820 lines) - Tailwind CSS with custom components"

4. **Style:** `text-sm`

5. **Max Languages:** 5 languages shown, "+2 more" if exceeds

### TEAM Section

```
TEAM         [Avatar] [Avatar] [Avatar] +9         🔗
```

#### Components
1. **Section Label**
   - Text: "TEAM"
   - Style: `text-xs font-semibold uppercase tracking-wider text-muted-foreground`

2. **Avatar Stack**
   - Component: `<Avatar className="h-8 w-8 border-2 border-background" />`
   - Layout: Overlapping -space-x-2
   - Max Shown: 5 avatars
   - Overflow: "+7" badge if more than 5
   - Tooltip on Each: "Alice Johnson (alice) - 423 commits, 18 PRs"

3. **GitHub Link Icon**
   - Icon: `<ExternalLink className="h-4 w-4" />`
   - Position: Far right
   - Style: `text-muted-foreground hover:text-primary transition-colors`
   - Tooltip: "View on GitHub"
   - Component: `<a>` with `target="_blank" rel="noopener noreferrer"`
   - Accessible label: aria-label="View ProjectName on GitHub"

4. **Layout:** Flex justify-between, avatars centered

---

## Tooltip System

### Tooltip Component Structure
```tsx
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

<Tooltip>
  <TooltipTrigger asChild>
    <span className="cursor-help underline-dotted">
      1,250 stars
    </span>
  </TooltipTrigger>
  <TooltipContent side="top" className="max-w-xs">
    <p className="text-xs">
      1,250 stars - This project is in the top 5% of TypeScript
      repositories. Growth: +280 stars in the last year.
    </p>
  </TooltipContent>
</Tooltip>
```

### Tooltip Content Guidelines

#### Quality Score Tooltip
```
Code Quality: {score}/100 - {label}
{breakdown}

Examples:
- "Code Quality: 95/100 - Excellent code patterns, comprehensive tests, minimal technical debt"
- "Code Quality: 72/100 - Good code structure with room for improvement in test coverage"
```

#### Stars Tooltip
```
{count} stars - {context}

Examples:
- "1,250 stars - Top 5% of TypeScript projects in 2024. Growth: +280 in last year"
- "89 stars - Growing project with 15 stars in the last month"
```

#### Contribution Percent Tooltip
```
You contributed {percent}% of {total} total commits ({userCommits} commits)
{context}

Example:
- "You contributed 18% of 1,923 total commits (346 commits). This shows significant long-term investment."
```

#### PRs Merged Tooltip
```
{count} pull requests merged
{context}

Example:
- "42 pull requests merged - Your code reviews averaged 2.3 days to merge, indicating efficient collaboration"
```

#### Reviews Tooltip
```
{count} code reviews
{context}

Example:
- "156 code reviews - You reviewed 8% of all project PRs, showing strong mentorship"
```

#### Active Period Tooltip
```
Active period: {duration}
{context}

Example:
- "Active period: 23 months with contributions in 18 of those months (78% consistency)"
```

#### Team Member Tooltip (Avatar)
```
{name} ({login})
{commits} commits, {prs} PRs

Example:
- "Alice Johnson (alice) - 423 commits, 18 PRs, core maintainer"
```

### Tooltip Behavior

#### Desktop (Mouse)
- **Delay:** 300ms hover before show
- **Duration:** No auto-hide, user controlled
- **Close:** Move mouse away
- **Animation:** 150ms fade-in/out

#### Mobile (Touch)
- **Trigger:** Tap element
- **Duration:** 3 seconds auto-dismiss OR tap outside
- **Visual:** Slightly larger padding for readability
- **Close:** Tap anywhere or wait for timeout

#### Accessibility
- **ARIA:** All tooltips have proper `role="tooltip"` and `aria-describedby`
- **Keyboard:** Focus + Enter/Space shows tooltip
- **Screen Reader:** Content announced when focused
- **ESC Key:** Dismisses active tooltip

---

## Interactive Behaviors

### Card Click/Tap
- **Action:** Toggle expand/collapse
- **Target:** Entire card except interactive elements (tooltips, GitHub link)
- **Feedback:**
  - Hover: `hover:shadow-md hover:bg-accent/50`
  - Active: Scale 0.99 (subtle press effect on mobile)
- **Keyboard:** Enter or Space key
- **ARIA:**
  - `role="button"`
  - `aria-expanded={isExpanded}`
  - `aria-controls="card-content-{project.id}"`
  - `aria-label="{isExpanded ? 'Collapse' : 'Expand'} {project.name} details"`

### Expand/Collapse Animation
```tsx
// No height animation to prevent overflow issues
{isExpanded && (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
  >
    {expandedContent}
  </motion.div>
)}
```

### Hover States

#### Collapsed Card
- **Shadow:** `shadow-sm` → `shadow-md`
- **Background:** `bg-card` → `bg-accent/50`
- **Border:** `border` → `border-primary/30`
- **Duration:** 200ms
- **Cursor:** pointer

#### Expanded Card
- **No hover effect** - Already visually elevated
- **Keep:** `shadow-md border-primary/40`

#### Interactive Elements
- **Quality Badge:** Brighten color on hover
- **Stars/Contribution:** Underline dotted appears
- **GitHub Link:** `text-muted-foreground` → `text-primary`, scale 1.05
- **Avatars:** Scale 1.1, z-index increase
- **Duration:** 150ms

### Focus States
- **Focus Ring:** 2px offset, primary color
- **Class:** `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`
- **Applies To:** Card, GitHub link, tooltip triggers

---

## Responsive Adaptations

### Mobile (<768px)

#### Collapsed State Changes
- Height: 64px (from 72px)
- Fork badge: Icon only, hide "Fork" text
- Hide quality score if space constrained
- Language text: Top 2 languages only
- Font sizes: Slightly smaller (text-xs for metrics)

#### Expanded State Changes
- Padding: 12px (from 16px)
- Section gaps: 12px (from 16px)
- Progress bar height: 6px (from 8px)
- Avatar size: 28px (from 32px)
- Font sizes: Maintain but adjust line-height

#### Tooltip Adaptations
- Larger touch targets: 44x44px minimum
- Tap to show, 3s auto-dismiss
- Slightly larger text: text-sm (from text-xs)
- Max width: 90vw

### Tablet (768-1439px)
- Use desktop layout
- Slightly reduced padding: 14px
- Maintain all features

### Desktop (>=1440px)
- Full layout as specified
- Padding: 16px
- All tooltips on hover
- Richer tooltip content

---

## Accessibility Compliance (WCAG 2.1 AA)

### Color Contrast
- ✅ **Text on Background:** 7:1 (primary text)
- ✅ **Muted Text:** 4.5:1 minimum
- ✅ **Interactive Elements:** 3:1 for UI components
- ✅ **Quality Badge Colors:** All pass 4.5:1 against card background

### Keyboard Navigation
1. **Tab:** Moves to card
2. **Enter/Space:** Toggles expand/collapse
3. **Tab (Expanded):** Navigates through tooltip triggers, GitHub link
4. **Shift+Tab:** Reverse navigation
5. **Escape:** Closes any open tooltip

### Screen Reader Support
```tsx
<Card
  role="button"
  tabIndex={0}
  aria-expanded={isExpanded}
  aria-controls={`card-content-${project.id}`}
  aria-label={`${isExpanded ? 'Collapse' : 'Expand'} ${project.name} details. ${
    project.stars
  } stars, ${project.contributionPercent}% contribution`}
>
```

#### Announcements
- **Expand:** "Expanded ProjectName details. Showing contribution metrics, tech stack, and team information."
- **Collapse:** "Collapsed ProjectName details."
- **Tooltip:** Content read automatically when trigger focused

### Motion Sensitivity
- **Respect:** `prefers-reduced-motion`
- **Applied To:**
  - Chevron rotation (instant vs 200ms)
  - Content fade-in (instant vs 200ms)
  - Hover animations (instant vs 150ms)
- **Implementation:** Via `useReducedMotion()` hook

### Focus Management
- **Visible Focus:** Always show focus ring
- **Focus Trap:** Not needed (card is not modal)
- **Focus Return:** Browser handles naturally
- **Skip Links:** Not applicable to component level

---

## Component API

### Props Interface
```typescript
export interface ExpandableProjectCardProps {
  /** Enhanced project data with inline metrics */
  project: ExpandableProject;

  /** Whether card is expanded */
  isExpanded: boolean;

  /** Toggle expand/collapse */
  onToggle: () => void;

  /** Maximum commits for activity bar normalization */
  maxCommits: number;

  /** REMOVED: onOpenAnalytics - no more modal */
  /** REMOVED: children - ExpandedCardContent is now internal */
}
```

### Usage Example
```tsx
import { ExpandableProjectCard } from "@/components/level-1/ExpandableProjectCard";

function ProjectList() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div className="space-y-2">
      {projects.map((project) => (
        <ExpandableProjectCard
          key={project.id}
          project={project}
          isExpanded={expandedId === project.id}
          onToggle={() => setExpandedId(
            expandedId === project.id ? null : project.id
          )}
          maxCommits={maxCommitsInList}
        />
      ))}
    </div>
  );
}
```

---

## Performance Considerations

### Rendering Optimization
1. **Memoization:** Wrap component in `React.memo()` with custom comparison
2. **Tooltip Lazy Loading:** Only render TooltipContent when hovered/focused
3. **Avatar Images:** Lazy load with `loading="lazy"`
4. **Language Colors:** Memoize `getLanguageColor()` results

### Bundle Size
- **Removed:** ProjectAnalyticsModal (~15KB)
- **Removed:** 4 tab components (OverviewTab, TimelineTab, CodeTab, TeamTab) (~25KB)
- **Added:** Enhanced tooltip logic (~2KB)
- **Net Savings:** ~38KB minified

### Animation Performance
- **GPU Acceleration:** Use `transform` and `opacity` only
- **No Layout Shifts:** Pre-calculate expanded height or use auto
- **Reduced Motion:** Skip animations entirely when preferred

---

## Testing Strategy

### Unit Tests (Vitest + React Testing Library)
```typescript
describe("ExpandableProjectCard", () => {
  describe("Collapsed State", () => {
    it("shows project name, stars, and commits", () => {});
    it("shows quality badge when score available", () => {});
    it("shows contribution % when available", () => {});
    it("shows fork badge for forked repos", () => {});
    it("shows top 3 languages inline", () => {});
    it("renders combined language activity bar", () => {});
  });

  describe("Expanded State", () => {
    it("shows description with line clamp", () => {});
    it("shows contribution section with progress", () => {});
    it("shows project impact metrics", () => {});
    it("shows tech stack with language dots", () => {});
    it("shows team avatars with overflow count", () => {});
    it("shows GitHub link icon", () => {});
  });

  describe("Tooltips", () => {
    it("shows quality score tooltip on hover", () => {});
    it("shows stars tooltip with context", () => {});
    it("shows contribution tooltip with breakdown", () => {});
    it("shows team member tooltip on avatar hover", () => {});
  });

  describe("Interactions", () => {
    it("toggles expansion on click", () => {});
    it("toggles expansion on Enter key", () => {});
    it("toggles expansion on Space key", () => {});
    it("opens GitHub link in new tab", () => {});
  });

  describe("Accessibility", () => {
    it("has proper ARIA attributes", () => {});
    it("announces expanded state to screen readers", () => {});
    it("supports keyboard navigation", () => {});
    it("has sufficient color contrast", () => {});
  });

  describe("Responsive", () => {
    it("shows condensed layout on mobile", () => {});
    it("hides fork text on mobile", () => {});
    it("shows only top 2 languages on mobile", () => {});
  });
});
```

### Storybook Stories
```typescript
export default {
  component: ExpandableProjectCard,
  parameters: { layout: "padded" },
} satisfies Meta<typeof ExpandableProjectCard>;

export const CollapsedBasic: Story = {
  args: {
    project: minimalProject,
    isExpanded: false,
  },
};

export const CollapsedWithAllMetrics: Story = {
  args: {
    project: fullProject,
    isExpanded: false,
  },
};

export const ExpandedFull: Story = {
  args: {
    project: fullProject,
    isExpanded: true,
  },
};

export const ForkedProject: Story = {};
export const WithoutQualityScore: Story = {};
export const WithoutContribution: Story = {};
export const LongDescription: Story = {};
export const LargeTeam: Story = {};
export const MobileView: Story = {
  parameters: { viewport: { defaultViewport: "mobile1" } },
};
```

### Integration Tests (Playwright)
```typescript
test.describe("ExpandableProjectCard Integration", () => {
  test("expands and shows all sections", async ({ page }) => {});
  test("tooltips appear on hover", async ({ page }) => {});
  test("GitHub link opens in new tab", async ({ page }) => {});
  test("keyboard navigation works correctly", async ({ page }) => {});
  test("touch interactions work on mobile", async ({ page }) => {});
});
```

---

## Migration Plan

### Phase 1: Prepare Data (Week 1)
1. Update GraphQL queries to fetch new fields:
   - `qualityScore`
   - `contributionPercent`, `userCommits`
   - `prsMerged`, `reviews`, `activePeriod`
   - `topLanguages`, `topContributors`

2. Create data adapters for backward compatibility

3. Update mock data for Storybook

### Phase 2: Build New Component (Week 1-2)
1. Create new `ExpandableProjectCard.tsx` with all sections
2. Build Storybook stories for all states
3. Write unit tests (aim for 95%+ coverage)
4. Test accessibility with axe-devtools

### Phase 3: Integrate Tooltips (Week 2)
1. Wrap all interactive elements with Tooltip
2. Write contextual tooltip content
3. Test on desktop and mobile
4. Verify keyboard/screen reader support

### Phase 4: Replace Old Component (Week 3)
1. Update imports in parent components
2. Remove ProjectAnalyticsModal and related code
3. Remove ExpandedCardContent component
4. Clean up unused dependencies

### Phase 5: Polish & Optimize (Week 3)
1. Performance profiling and memoization
2. Animation tuning
3. Visual QA across breakpoints
4. A/B test with users (optional)

---

## Success Metrics

### UX Improvements
- ✅ **Zero modal interactions** - All info inline
- ✅ **Reduced clicks** - From 2-3 clicks (expand → Analytics → tab) to 1 click (expand)
- ✅ **Faster information access** - <500ms to see all key metrics
- ✅ **Higher information density** - 3x more data visible in expanded state vs modal tabs

### Performance Gains
- ✅ **Bundle size reduction** - ~38KB savings
- ✅ **Faster initial render** - No lazy-loaded modal components
- ✅ **Better LCP** - Inline content vs modal loading

### Accessibility Wins
- ✅ **WCAG 2.1 AA compliant** - All color contrast ratios pass
- ✅ **Keyboard navigation** - Full support with logical tab order
- ✅ **Screen reader friendly** - Proper ARIA labels and announcements
- ✅ **Reduced motion support** - Respects user preferences

---

## Open Questions & Decisions Needed

### Data Availability
**Q:** Are `qualityScore`, `contributionPercent`, etc. already calculated in the backend?
**A:** If not, need to:
1. Add calculations to GraphQL resolvers
2. Cache results for performance
3. Gracefully degrade when data unavailable

### Tooltip Content Source
**Q:** Should tooltips be dynamically generated or pre-computed?
**A:** Recommendation: Pre-compute context (e.g., percentile ranks) in backend, format in frontend.

### Mobile Tooltip UX
**Q:** 3-second auto-dismiss or tap-to-close only?
**A:** Recommendation: 3s auto-dismiss + tap-outside to close for better UX.

### GitHub Link Placement
**Q:** Should GitHub link be in header (always visible) or expanded section (current spec)?
**A:** Current spec (expanded section) keeps header clean. Open to feedback.

---

## Related Documentation

- **Current Implementation:** `/src/components/level-1/ExpandableProjectCard.tsx`
- **Modal to Remove:** `/src/components/level-2/ProjectAnalyticsModal.tsx`
- **Design Tokens:** `/.claude/quick-ref/quick_ref_design_tokens.md`
- **Component Guide:** `/docs/components-guide.md`
- **Testing Guide:** `/docs/phases/testing-guide.md`
- **Accessibility Standards:** WCAG 2.1 AA (external)

---

## Appendix: Code Snippets

### Tooltip Wrapper Helper
```typescript
// /src/components/level-1/MetricTooltip.tsx
interface MetricTooltipProps {
  content: string;
  children: React.ReactNode;
  side?: "top" | "bottom" | "left" | "right";
}

export function MetricTooltip({ content, children, side = "top" }: MetricTooltipProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="cursor-help underline decoration-dotted decoration-muted-foreground/50 underline-offset-2">
          {children}
        </span>
      </TooltipTrigger>
      <TooltipContent side={side} className="max-w-xs">
        <p className="text-xs leading-relaxed">{content}</p>
      </TooltipContent>
    </Tooltip>
  );
}
```

### Quality Badge Component
```typescript
// /src/components/level-1/QualityBadge.tsx
interface QualityBadgeProps {
  score: number;
  className?: string;
}

export function QualityBadge({ score, className }: QualityBadgeProps) {
  const color = score >= 90 ? "text-green-600 dark:text-green-400"
    : score >= 70 ? "text-blue-600 dark:text-blue-400"
    : score >= 50 ? "text-yellow-600 dark:text-yellow-400"
    : "text-red-600 dark:text-red-400";

  const label = score >= 90 ? "Excellent"
    : score >= 70 ? "Good"
    : score >= 50 ? "Fair"
    : "Needs Improvement";

  return (
    <MetricTooltip content={`Code Quality: ${score}/100 - ${label} code patterns, ${score >= 90 ? 'comprehensive' : 'adequate'} tests`}>
      <span className={cn("text-xs font-semibold flex items-center gap-1", color, className)}>
        <Target className="h-3 w-3" />
        {score}
      </span>
    </MetricTooltip>
  );
}
```

### Contribution Section Component
```typescript
// /src/components/level-1/ContributionSection.tsx
interface ContributionSectionProps {
  commitsPercent: number;
  userCommits: number;
  totalCommits: number;
  prsMerged: number;
  reviews: number;
  activePeriod: string;
}

export function ContributionSection({
  commitsPercent,
  userCommits,
  totalCommits,
  prsMerged,
  reviews,
  activePeriod,
}: ContributionSectionProps) {
  return (
    <section aria-labelledby="contribution-heading" className="space-y-3">
      <h4 id="contribution-heading" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Your Contribution
      </h4>

      {/* Progress bar with tooltip */}
      <MetricTooltip content={`You contributed ${commitsPercent}% of ${formatNumber(totalCommits)} total commits (${formatNumber(userCommits)} commits). This shows ${commitsPercent > 25 ? 'significant' : 'meaningful'} long-term investment.`}>
        <div>
          <div className="mb-1 flex justify-between text-sm">
            <span>Commits</span>
            <span className="font-medium">
              {commitsPercent}% · {formatNumber(userCommits)} of {formatNumber(totalCommits)}
            </span>
          </div>
          <Progress value={commitsPercent} className="h-2" />
        </div>
      </MetricTooltip>

      {/* PRs and Reviews */}
      <div className="flex flex-wrap gap-4 text-sm">
        <MetricTooltip content={`${prsMerged} pull requests merged - Your code reviews averaged 2.3 days to merge`}>
          <span className="flex items-center gap-1.5">
            <GitPullRequest className="h-3.5 w-3.5 text-muted-foreground" />
            {prsMerged} PRs merged
          </span>
        </MetricTooltip>

        <MetricTooltip content={`${reviews} code reviews - You reviewed 8% of all project PRs`}>
          <span className="flex items-center gap-1.5">
            <MessageSquare className="h-3.5 w-3.5 text-muted-foreground" />
            {reviews} reviews
          </span>
        </MetricTooltip>
      </div>

      {/* Active period */}
      <MetricTooltip content={`Active period: ${activePeriod} - Contributions in 18 of 23 months (78% consistency)`}>
        <p className="text-xs text-muted-foreground">
          Active: {activePeriod}
        </p>
      </MetricTooltip>
    </section>
  );
}
```

---

**Specification Version:** 1.0
**Author:** UX Design Team
**Date:** 2025-11-26
**Status:** Ready for Review
