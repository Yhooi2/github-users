PART 2: Level Specifications

## Detailed Component Specs for All 3 Levels

---

## Level 0: Ultra-Compact Repository List

### 🎯 Purpose

Show ALL projects from a year simultaneously for rapid scanning and filtering.

### 📐 Layout Structure

```
┌─────────────────────────────────────────────────────────┐
│ Projects & Contributions (2024)          [Sort ▾]      │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ YOUR PROJECTS (5)                                       │
│ ─────────────────────────────────────────────           │
│                                                         │
│ █████████ react-dashboard 👤                           │
│ 347 commits · ⭐ 1.2k · TypeScript                      │
│                                                         │
│ ███████   node-api-server 👤                           │
│ 234 commits · ⭐ 3.4k · JavaScript                      │
│                                                         │
│ ██████    python-ml-toolkit 👤                         │
│ 198 commits · ⭐ 892 · Python                           │
│                                                         │
│ ████      portfolio-website 👤                         │
│ 89 commits · ⭐ 234 · TypeScript                        │
│                                                         │
│ ███       cli-tool 👤                                  │
│ 67 commits · ⭐ 156 · Go                                │
│                                                         │
│ CONTRIBUTIONS (8)                                       │
│ ─────────────────────────────────────────────           │
│                                                         │
│ █████     react-framework 👥                           │
│ 156 commits · ⭐ 45.2k · TypeScript                     │
│                                                         │
│ ████      kubernetes 👥                                │
│ 98 commits · ⭐ 108k · Go                               │
│                                                         │
│ [... 6 more contributions ...]                         │
│                                                         │
│ ↓ Scroll for more projects                             │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### 🧩 Component Breakdown

#### 1. Container: `ProjectListContainer`

```typescript
interface ProjectListContainerProps {
  projects: ProjectData[];
  year: number;
  sortBy: "commits" | "stars" | "recent";
  onProjectClick: (projectId: string) => void;
  expandedProjects: Set<string>;
}
```

**Features**:

- Grouping: "YOUR PROJECTS" vs "CONTRIBUTIONS"
- Sorting dropdown (commits/stars/recent)
- Separator between groups
- Scroll hint at bottom (fade gradient)

**shadcn components**:

- `Card` (container)
- `ScrollArea` (smooth scrolling)
- `Separator` (between groups)

#### 2. Row: `CompactProjectRow`

```typescript
interface CompactProjectRowProps {
  project: {
    id: string;
    name: string;
    commits: number;
    stars: number;
    language: string;
    isOwner: boolean;
  };
  maxCommits: number; // For bar width calculation
  onClick: () => void;
  isExpanded: boolean;
}
```

**Visual Elements**:

##### a) Vertical Commit Bar

```css
width: 4px
height: 100%
background: gradient based on commits
position: absolute
left: 0

/* Owner projects */
background: linear-gradient(to bottom, blue-500, blue-600)

/* Contributions */
background: linear-gradient(to bottom, green-500, green-600)

/* Width calculation */
height: (commits / maxCommits) * 100%
```

##### b) Project Name + Badge

```tsx
<div className="flex items-center gap-2">
  <span className="max-w-[200px] truncate text-sm font-medium">
    {project.name}
  </span>
  <Badge variant={isOwner ? "default" : "secondary"}>
    {isOwner ? "👤" : "👥"}
  </Badge>
</div>
```

##### c) Metrics Line

```tsx
<div className="text-muted-foreground flex gap-3 text-xs">
  <span>{commits} commits</span>
  <span>⭐ {formatNumber(stars)}</span>
  <span>{language}</span>
</div>
```

**Hover State**:

```css
transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1)

&:hover {
  transform: scale(1.02)
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1)
  background: muted/50
  cursor: pointer
}
```

**Dimensions**:

- Height: `56px` (desktop), `48px` (mobile)
- Padding: `12px 16px`
- Gap between rows: `8px`
- Vertical bar width: `4px`
- Vertical bar left margin: `0` (flush left)

### 🎨 Visual Design Specs

#### Typography

```css
.project-name {
  font-size: 14px (0.875rem)
  font-weight: 500
  line-height: 20px
  color: foreground
}

.metrics {
  font-size: 12px (0.75rem)
  font-weight: 400
  line-height: 16px
  color: muted-foreground
}
```

#### Colors (shadcn theme)

```css
/* Owner bar */
--owner-gradient: linear-gradient(
    180deg,
    hsl(var(--primary)),
    hsl(var(--primary) / 0.8)
  )
  /* Contributor bar */
  --contributor-gradient: linear-gradient(
    180deg,
    hsl(142 76% 36%),
    hsl(142 76% 30%)
  )
  /* Hover background */ --hover-bg: hsl(var(--muted) / 0.5)
  /* Border (optional) */ --border: hsl(var(--border));
```

#### Spacing System

```css
--row-height-desktop: 56px --row-height-mobile: 48px --row-gap: 8px
  --row-padding-x: 16px --row-padding-y: 12px --bar-width: 4px
  --content-margin-left: 16px (after bar);
```

### 📱 Responsive Behavior

#### Desktop (≥1024px)

- Within right panel (67% width in 33/67 split)
- 2-column layout possible if many projects
- Full hover effects

#### Tablet (768-1023px)

- Full width container
- Single column
- Touch-optimized hover (press effect)

#### Mobile (<768px)

- Full width
- Increased touch targets (48px min)
- Simplified metrics (hide stars on small screens)

### ♿ Accessibility

```tsx
<button
  role="button"
  aria-label={`Expand ${project.name} details`}
  aria-expanded={isExpanded}
  onClick={onClick}
  className="compact-project-row"
>
  {/* content */}
</button>
```

**Keyboard Navigation**:

- Tab: Focus next project
- Enter/Space: Expand project
- Escape: Collapse if expanded

**Screen Reader**:

- Announces project name
- Announces metrics
- Announces expansion state

---

## Level 1: Expandable Card (Medium Detail)

### 🎯 Purpose

Provide key contribution details for project comparison without leaving context.

### 📐 Layout Structure

```
┌─────────────────────────────────────────────────────────┐
│ [COLLAPSED] - Same as Level 0                           │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ [EXPANDED STATE]                                        │
│                                                         │
│ react-dashboard 👤 Owner                                │
│ Modern analytics dashboard for developer productivity   │
│ ⭐ 1,234  🍴 234  👁 89  📦 v2.4.0  TypeScript          │
│                                                         │
│ ─────────────────────────────────────────────           │
│                                                         │
│ YOUR CONTRIBUTION                                       │
│ • 347 commits (18% of 1,923 total)                     │
│ • 28 PRs merged (96% merge rate, 1 open)               │
│ • 12 code reviews performed                            │
│ • Active from Jan 2024 - Dec 2024 (12 months)          │
│                                                         │
│ ─────────────────────────────────────────────           │
│                                                         │
│ TECH STACK                                              │
│ ████████████████░░░░ TypeScript 68%                    │
│ ██████░░░░░░░░░░░░░░ JavaScript 22%                    │
│ ████░░░░░░░░░░░░░░░░ CSS 10%                           │
│                                                         │
│ ─────────────────────────────────────────────           │
│                                                         │
│ TEAM                                                    │
│ 8 contributors · You + 7 others                         │
│ Most active: @johndoe (456 commits), You (347)         │
│                                                         │
│ ─────────────────────────────────────────────           │
│                                                         │
│ [View Full Analytics →]  [GitHub →]  [Collapse ▴]     │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### 🧩 Component Structure

#### Main Component: `ExpandableProjectCard`

```typescript
interface ExpandableProjectCardProps {
  project: ProjectData;
  isExpanded: boolean;
  onToggle: () => void;
  onViewAnalytics: () => void;
  maxCommits: number;
}

// State managed by parent (YearDetailPanel)
const [expandedProjects, setExpandedProjects] = useState<Set<string>>(
  new Set(),
);
```

#### Content: `ExpandedCardContent`

```typescript
interface ExpandedCardContentProps {
  project: {
    name: string;
    description: string;
    stats: {
      stars: number;
      forks: number;
      watchers: number;
      version?: string;
    };
    contribution: {
      commits: number;
      commitPercentage: number;
      totalCommits: number;
      prs: { merged: number; open: number; total: number };
      reviews: number;
      activePeriod: { from: string; to: string };
    };
    languages: Array<{ name: string; percentage: number }>;
    team: {
      totalContributors: number;
      topContributors: Array<{ username: string; commits: number }>;
    };
  };
  onViewAnalytics: () => void;
}
```

### 📊 Section Breakdown

#### 1. Header Section

**Components**:

- Project name (larger, bold)
- Ownership badge
- Description (2 lines max, ellipsis)
- Social stats row (stars, forks, watchers, version)

**shadcn**:

- `Badge` for ownership
- `HoverCard` for stat explanations

#### 2. Contribution Section

**Displays**:

- Commits (number + percentage of total)
- PRs (merged count, merge rate, open count)
- Code reviews performed
- Active period (from - to, duration)

**Layout**: Bulleted list, each item 1 line

#### 3. Tech Stack Section

**Visual**: Horizontal bar chart

```tsx
<div className="space-y-2">
  {languages.map((lang) => (
    <div key={lang.name} className="flex items-center gap-2">
      <div className="flex-1">
        <div
          className="bg-primary h-2 rounded-full"
          style={{ width: `${lang.percentage}%` }}
        />
      </div>
      <span className="w-[100px] text-xs">
        {lang.name} {lang.percentage}%
      </span>
    </div>
  ))}
</div>
```

#### 4. Team Section

**Displays**:

- Total contributor count
- "You + N others"
- Top 2 contributors with commits

**Format**: Compact, 2-3 lines max

#### 5. Action Buttons

```tsx
<div className="flex items-center justify-between gap-2">
  <Button onClick={onViewAnalytics} size="sm">
    View Full Analytics →
  </Button>
  <div className="flex gap-2">
    <Button variant="outline" size="sm" asChild>
      <a href={githubUrl} target="_blank">
        GitHub →
      </a>
    </Button>
    <Button variant="ghost" size="sm" onClick={onToggle}>
      Collapse ▴
    </Button>
  </div>
</div>
```

### 🎬 Animation Specs

#### Expansion Animation (Framer Motion)

```tsx
/* ✅ Используем Framer Motion — CSS height:auto не анимируется */
import { motion, AnimatePresence } from 'framer-motion'

<AnimatePresence>
  {isExpanded && (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{
        height: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
        opacity: { duration: 0.2, delay: 0.1 }
      }}
      style={{ overflow: 'hidden' }}
    >
      <ExpandedCardContent ... />
    </motion.div>
  )}
</AnimatePresence>
```

**Rationale**: Framer Motion позволяет анимировать `height: auto`, чего CSS не может

#### Content Fade-in

```css
.card-section {
  opacity: 0;
  transform: translateY(8px);
  animation: fade-in 200ms cubic-bezier(0.4, 0, 0.2, 1) forwards;
  animation-delay: calc(var(--index) * 50ms);
}

@keyframes fade-in {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

### 📏 Dimensions

```css
/* Card when expanded */
--card-padding:
  20px (desktop),
  16px (mobile) --section-gap: 16px --separator-margin: 12px 0
    /* Maximum height */ --max-height-collapsed: 56px (matches Level 0)
    --max-height-expanded: auto (up to 500px) /* Button sizes */
    --button-height: 36px --button-padding: 8px 16px;
```

### 🎨 Design Tokens

```css
/* Expanded card background */
--card-bg: hsl(var(--card)) --card-border: 1px solid hsl(var(--border))
  --card-shadow: 0 2px 8px rgba(0, 0, 0, 0.08) /* Separator */
  --separator-color: hsl(var(--border)) /* Language bars */
  --lang-bar-height: 8px --lang-bar-radius: 4px
  --lang-bar-bg: hsl(var(--primary)) /* Typography */ --header-text: 16px
  font-semibold --section-title: 12px font-medium uppercase
  text-muted-foreground --body-text: 14px font-normal;
```

### 📱 Responsive Behavior

#### Desktop Behavior (≥1024px)

- **Multiple cards can be expanded simultaneously**
- When card expands: other cards push down
- No height limit (scrollable container)
- Side-by-side comparison possible

```typescript
// Desktop: Set-based expansion (multiple allowed)
const handleToggle = (projectId: string) => {
  setExpandedProjects((prev) => {
    const next = new Set(prev);
    if (next.has(projectId)) {
      next.delete(projectId);
    } else {
      next.add(projectId);
    }
    return next;
  });
};
```

#### Mobile Behavior (<768px)

- **Accordion: only ONE card expanded at a time**
- When new card expands: previous auto-collapses
- Touch-optimized (44px touch targets)
- Simplified layout (smaller gaps)

```typescript
// Mobile: Single expansion (accordion)
const handleToggle = (projectId: string) => {
  setExpandedProjects((prev) => {
    const next = new Set<string>();
    if (!prev.has(projectId)) {
      next.add(projectId);
    }
    // If clicking same card, collapse it (empty set)
    return next;
  });
};
```

**Implementation**:

```typescript
const isMobile = useMediaQuery("(max-width: 768px)");

const handleToggle = (projectId: string) => {
  if (isMobile) {
    // Accordion behavior
    setExpandedProjects(
      new Set(expandedProjects.has(projectId) ? [] : [projectId]),
    );
  } else {
    // Multi-expand behavior
    setExpandedProjects((prev) => {
      const next = new Set(prev);
      next.has(projectId) ? next.delete(projectId) : next.add(projectId);
      return next;
    });
  }
};
```

### ♿ Accessibility

**ARIA Attributes**:

```tsx
<div
  role="region"
  aria-labelledby={`project-${project.id}-header`}
  aria-expanded={isExpanded}
>
  <button
    id={`project-${project.id}-header`}
    aria-controls={`project-${project.id}-content`}
    onClick={onToggle}
  >
    {project.name}
  </button>

  <div id={`project-${project.id}-content`} aria-hidden={!isExpanded}>
    {/* Expanded content */}
  </div>
</div>
```

**Keyboard Navigation**:

- Tab: Navigate between projects
- Enter/Space: Toggle expansion
- Tab (within expanded): Navigate action buttons
- Escape: Collapse current card

**Screen Reader Announcements**:

- "Expanded" / "Collapsed" state
- Number of items in list
- Current position (e.g., "3 of 15")

---

## Level 2: Full Analytics Modal with Horizontal Tabs

### 🎯 Purpose

Comprehensive deep-dive analytics for serious evaluation.

### 🆕 KEY DESIGN: Horizontal Tabs (4 категории)

**Problem**: Traditional single-page modal с 600px height недостаточно для всех метрик

**Solution**: Горизонтальные табы сверху, 4 основных категории (объединяем связанные метрики)

**Принцип**: Не более 4-5 табов (Nielsen Norman Group рекомендация)

### 📐 Layout Structure (Desktop)

```
┌─────────────────────────────────────────────────────────────┐
│ react-dashboard · Detailed Analytics             [×]       │
│ Owner · TypeScript · Active 12 months · Last: 2 days ago   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  TAB NAVIGATION (Horizontal, 4 tabs)                       │
│  ┌──────────┬──────────┬──────────┬──────────┐            │
│  │  📊      │   📈     │   💻     │   👥     │            │
│  │ Overview │ Timeline │   Code   │   Team   │            │
│  └──────────┴──────────┴──────────┴──────────┘            │
│      ↑ Active tab (highlighted)                            │
│                                                             │
│  ┌───────────────────────────────────────────────────┐     │
│  │ TAB CONTENT AREA (Scrollable)                     │     │
│  │                                                    │     │
│  │ 📊 Contribution Overview                          │     │
│  │                                                    │     │
│  │ ┌──────┬──────┬──────┬──────┬──────┐             │     │
│  │ │ 347  │ 28   │ 12   │ 234  │ 5    │             │     │
│  │ │Commits│ PRs  │Review│Files │Issues│             │     │
│  │ └──────┴──────┴──────┴──────┴──────┘             │     │
│  │                                                    │     │
│  │ Activity Breakdown                                │     │
│  │ • Code commits: 347 (18% of total)                │     │
│  │ • Documentation: 23 commits                       │     │
│  │ • Tests: 45 commits                               │     │
│  │ • CI/CD configs: 12 commits                       │     │
│  │                                                    │     │
│  │ [More content specific to tab...]                 │     │
│  │                                                    │     │
│  └───────────────────────────────────────────────────┘     │
│                                                             │
│  ───────────────────────────────────────────────────       │
│  [Export Report (PDF)] [View on GitHub →]                  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
          ↑ Modal height: auto (max 80vh), scrollable
```

### 🧩 Component Structure

#### Main Component: `ProjectAnalyticsModal`

```typescript
interface ProjectAnalyticsModalProps {
  project: ProjectData
  isOpen: boolean
  onClose: () => void
}

// Uses shadcn Dialog (desktop) or Sheet (mobile)
const isMobile = useMediaQuery('(max-width: 768px)')

return isMobile ? (
  <Sheet open={isOpen} onOpenChange={onClose}>
    {/* Mobile full-screen */}
  </Sheet>
) : (
  <Dialog open={isOpen} onOpenChange={onClose}>
    {/* Desktop centered modal */}
  </Dialog>
)
```

#### Tab Navigation: `HorizontalTabsNav`

```typescript
// 4 табa вместо 7 — объединяем связанные метрики
const tabs = [
  { id: "overview", icon: "📊", label: "Overview" }, // Metrics + Activity breakdown
  { id: "timeline", icon: "📈", label: "Timeline" }, // Activity timeline + heatmap
  { id: "code", icon: "💻", label: "Code" }, // Languages + Impact + Files
  { id: "team", icon: "👥", label: "Team" }, // PRs + Collaboration + CI/CD
];
```

**shadcn Implementation**:

```tsx
<Tabs defaultValue="overview" orientation="horizontal" className="w-full">
  <TabsList className="grid w-full grid-cols-4">
    {tabs.map((tab) => (
      <TabsTrigger
        key={tab.id}
        value={tab.id}
        className="flex flex-col items-center gap-1"
      >
        <span className="text-2xl">{tab.icon}</span>
        <span className="text-xs">{tab.label}</span>
      </TabsTrigger>
    ))}
  </TabsList>

  <TabsContent value="overview">
    <OverviewTab project={project} />
  </TabsContent>

  {/* Other tabs... */}
</Tabs>
```

### 📊 Tab Content Specifications (4 табa)

#### Tab 1: 📊 Overview

**Purpose**: High-level summary, key metrics at a glance

**Content**:

1. **Metric Cards Grid** (5 columns)

   ```tsx
   <div className="grid grid-cols-5 gap-4">
     <MetricCard value={347} label="Total Commits" trend="+23 this month" />
     <MetricCard value={28} label="PRs Merged" trend="96% rate" />
     <MetricCard value={12} label="Reviews" />
     <MetricCard value={234} label="Files Changed" />
     <MetricCard value={5} label="Issues Resolved" />
   </div>
   ```

2. **Activity Breakdown**
   - Code commits: 347 (18% of total)
   - Documentation: 23 commits
   - Tests: 45 commits
   - CI/CD configs: 12 commits

3. **Quick Stats**
   - Active period: Jan 2024 - Dec 2024 (12 months)
   - Contribution percentage: 18%
   - Team rank: #2 of 8

**Height**: ~400px (scrollable if needed)

---

#### Tab 2: 📈 Timeline

**Purpose**: Visualize commit activity over time

**Content**:

1. **Recharts LineChart** (Monthly commits)

   ```tsx
   <ResponsiveContainer width="100%" height={250}>
     <LineChart data={monthlyCommits}>
       <CartesianGrid strokeDasharray="3 3" />
       <XAxis dataKey="month" />
       <YAxis />
       <Tooltip />
       <Line
         type="monotone"
         dataKey="commits"
         stroke="hsl(var(--primary))"
         strokeWidth={2}
       />
     </LineChart>
   </ResponsiveContainer>
   ```

2. **Calendar Heatmap** (GitHub-style, 365-day grid)

3. **Patterns Summary**
   - Most productive: Tuesdays, 10am-12pm
   - Consistency score: 87%
   - Longest streak: 23 days

**Height**: ~450px

---

#### Tab 3: 💻 Code

**Purpose**: Languages + Impact + File analysis (объединение старых tabs 3+4)

**Content**:

**Section 1: Languages** (Donut chart + table)

```tsx
<div className="grid grid-cols-2 gap-4">
  <PieChart ... />
  <Table>
    <TableRow><TableCell>TypeScript</TableCell><TableCell>68%</TableCell><TableCell>12,453 lines</TableCell></TableRow>
    <TableRow><TableCell>JavaScript</TableCell><TableCell>22%</TableCell><TableCell>4,021 lines</TableCell></TableRow>
    <TableRow><TableCell>CSS</TableCell><TableCell>10%</TableCell><TableCell>1,834 lines</TableCell></TableRow>
  </Table>
</div>
```

**Section 2: Impact Score**

```
Impact Score: 87 (High Impact)
Lines added:    +12,453 🟢
Lines removed:  -3,421  🔴
Net impact:     +9,032  🟢
```

**Section 3: Top Contributions**

- Top 3 commits by lines changed
- Top 3 features added

**Height**: ~500px

---

#### Tab 4: 👥 Team

**Purpose**: PRs + Collaboration + CI/CD (объединение старых tabs 5+6+7)

**Content**:

**Section 1: Pull Requests**

```
Opened: 28 | Merged: 27 (96%) | Open: 0
Avg time to merge: 2.3 days
```

**Section 2: Code Reviews**

- Reviews given: 12 (234 comments)
- Avg review depth: 19 comments/review

**Section 3: Collaboration**

- Team size: 8 contributors
- Your rank: #2 (347 commits)
- Top collaborator: @johndoe (456 commits)

**Section 4: CI/CD** (если данные доступны)

- Build success: 98.8%
- Last deploy: 2 days ago

**Height**: ~500px

---

### 🎨 Tab Navigation Design Specs

```css
/* Tab list (horizontal bar at top) */
.tab-list {
  display: grid;
  grid-template-columns: repeat(4, 1fr); /* 4 табa вместо 7 */
  gap: 8px; /* Увеличен gap для 4 табов */
  padding: 8px;
  background: hsl(var(--muted) / 0.3);
  border-radius: 8px;
}

/* Individual tab button */
.tab-trigger {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 12px 8px;
  border-radius: 6px;
  transition: all 0.2s;

  /* Icon */
  font-size: 24px;
  line-height: 1;

  /* Label */
  font-size: 11px;
  font-weight: 500;
  text-align: center;
}

/* Inactive tab */
.tab-trigger[data-state="inactive"] {
  color: hsl(var(--muted-foreground));
  opacity: 0.7;
}

.tab-trigger[data-state="inactive"]:hover {
  background: hsl(var(--muted) / 0.5);
  opacity: 1;
}

/* Active tab */
.tab-trigger[data-state="active"] {
  background: hsl(var(--background));
  color: hsl(var(--primary));
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* Mobile adjustments */
@media (max-width: 768px) {
  .tab-trigger {
    padding: 8px 4px;
    font-size: 20px; /* Smaller icon */
  }

  .tab-trigger span {
    font-size: 9px; /* Smaller label */
  }
}
```

### 📏 Modal Dimensions

```css
/* Desktop Dialog — RESPONSIVE WIDTH */
--modal-width: min(800px, 90vw); /* ✅ Исправлено: адаптивная ширина */
--modal-max-height: 85vh;
--modal-padding: 24px;

/* Mobile Sheet */
--sheet-width: 100vw;
--sheet-max-height: 90vh;
--sheet-padding: 16px;

/* Tab content area — NO HARDCODED HEIGHT */
--tab-content-min-height: 300px;
--tab-content-max-height: calc(85vh - 200px); /* ✅ Динамический расчёт */
--tab-content-padding: 20px;
```

### 🎬 Modal Animation Specs

#### Desktop Dialog Animation

```typescript
// Framer Motion variants
const modalVariants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
    y: 20,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.2,
      ease: [0.4, 0, 0.2, 1],
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 20,
    transition: {
      duration: 0.15,
    },
  },
};

// Backdrop
const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};
```

#### Mobile Sheet Animation

```typescript
const sheetVariants = {
  hidden: {
    y: "100%",
    opacity: 0,
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      damping: 30,
      stiffness: 300,
    },
  },
  exit: {
    y: "100%",
    opacity: 0,
    transition: {
      duration: 0.2,
    },
  },
};
```

#### Tab Switching Animation

```css
/* Tab content fade */
.tab-content {
  animation: tab-fade-in 200ms ease-out;
}

@keyframes tab-fade-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

### 🎨 Modal Design Tokens

```css
/* Modal container */
--modal-bg: hsl(var(--background)) --modal-border: 1px solid hsl(var(--border))
  --modal-shadow: 0 8px 32px rgba(0, 0, 0, 0.12)
  --modal-backdrop: rgba(0, 0, 0, 0.5) --modal-backdrop-blur: 4px /* Header */
  --header-height: 64px --header-padding: 16px 24px --header-border-bottom: 1px
  solid hsl(var(--border)) /* Tab navigation */ --tabs-height: 80px
  --tabs-padding: 8px --tabs-bg: hsl(var(--muted) / 0.3)
  --tab-active-bg: hsl(var(--background)) --tab-active-shadow: 0 2px 8px
  rgba(0, 0, 0, 0.1) /* Content area */ --content-padding: 20px
  --content-bg: transparent /* Footer */ --footer-height: 72px
  --footer-padding: 16px 24px --footer-border-top: 1px solid hsl(var(--border));
```

### 📱 Responsive Modal Behavior

#### Desktop (≥768px)

```typescript
<Dialog open={isOpen} onOpenChange={onClose}>
  <DialogContent className="max-w-[min(800px,90vw)] max-h-[85vh]">
    <DialogHeader>
      <DialogTitle>{project.name} · Detailed Analytics</DialogTitle>
      <DialogDescription>
        {project.ownership} · {project.language} · Active {project.activePeriod}
      </DialogDescription>
    </DialogHeader>

    <Tabs defaultValue="overview" className="w-full">
      {/* Tabs content */}
    </Tabs>

    <DialogFooter>
      <Button variant="outline" onClick={handleExportPDF}>
        Export Report (PDF)
      </Button>
      <Button asChild>
        <a href={project.githubUrl} target="_blank">
          View on GitHub →
        </a>
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

#### Mobile (<768px)

```typescript
<Sheet open={isOpen} onOpenChange={onClose}>
  <SheetContent side="bottom" className="h-[90vh]">
    <SheetHeader>
      <SheetTitle>{project.name}</SheetTitle>
      <SheetDescription>
        {project.language} · {project.activePeriod}
      </SheetDescription>
    </SheetHeader>

    <ScrollArea className="h-[calc(90vh-140px)]">
      <Tabs defaultValue="overview" className="w-full">
        {/* Tabs with smaller icons, vertical scroll */}
      </Tabs>
    </ScrollArea>

    <SheetFooter>
      <Button size="sm" onClick={handleExportPDF}>
        Export PDF
      </Button>
      <Button size="sm" asChild>
        <a href={project.githubUrl} target="_blank">
          GitHub →
        </a>
      </Button>
    </SheetFooter>
  </SheetContent>
</Sheet>
```

**Key Differences**:

- Mobile: Sheet from bottom (full screen)
- Mobile: Smaller tab icons (20px vs 24px)
- Mobile: Simplified footer (smaller buttons)
- Mobile: Auto-scroll to top on tab change

### ♿ Accessibility

#### Keyboard Navigation

```typescript
// Tab navigation
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case "Escape":
        onClose();
        break;
      case "ArrowRight":
        // Next tab
        setActiveTab(getNextTab());
        break;
      case "ArrowLeft":
        // Previous tab
        setActiveTab(getPrevTab());
        break;
      case "Home":
        // First tab
        setActiveTab(tabs[0].id);
        break;
      case "End":
        // Last tab
        setActiveTab(tabs[tabs.length - 1].id);
        break;
    }
  };

  window.addEventListener("keydown", handleKeyDown);
  return () => window.removeEventListener("keydown", handleKeyDown);
}, [isOpen, activeTab]);
```

#### ARIA Labels

```tsx
<Dialog
  role="dialog"
  aria-modal="true"
  aria-labelledby="modal-title"
  aria-describedby="modal-description"
>
  <Tabs role="tablist" aria-label="Project analytics sections">
    <TabsTrigger
      role="tab"
      aria-selected={activeTab === tab.id}
      aria-controls={`panel-${tab.id}`}
      id={`tab-${tab.id}`}
    >
      {tab.label}
    </TabsTrigger>

    <TabsContent
      role="tabpanel"
      aria-labelledby={`tab-${tab.id}`}
      id={`panel-${tab.id}`}
    >
      {/* Content */}
    </TabsContent>
  </Tabs>
</Dialog>
```

#### Screen Reader Support

```tsx
// Announce tab changes
useEffect(() => {
  if (activeTab) {
    const announcement = `Viewing ${tabs.find((t) => t.id === activeTab)?.label} section`;
    announceToScreenReader(announcement);
  }
}, [activeTab]);

// Loading states
{
  isLoading && (
    <div role="status" aria-live="polite">
      Loading analytics data...
    </div>
  );
}
```

### 🔄 Data Loading Strategy

#### Lazy Loading Pattern

```typescript
// Only load tab data when tab is activated
const [loadedTabs, setLoadedTabs] = useState<Set<string>>(
  new Set(["overview"]),
);

const handleTabChange = async (tabId: string) => {
  setActiveTab(tabId);

  if (!loadedTabs.has(tabId)) {
    setLoading(true);

    try {
      const data = await fetchTabData(project.id, tabId);
      setTabData((prev) => ({ ...prev, [tabId]: data }));
      setLoadedTabs((prev) => new Set(prev).add(tabId));
    } catch (error) {
      showError(`Failed to load ${tabId} data`);
    } finally {
      setLoading(false);
    }
  }
};
```

#### Skeleton States

```tsx
{
  isLoading ? (
    <div className="space-y-4">
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-64 w-full" />
      <Skeleton className="h-48 w-full" />
    </div>
  ) : (
    <TabContent data={tabData[activeTab]} />
  );
}
```

### 📊 Performance Optimizations

#### Memoization

```typescript
// Memoize expensive calculations
const impactScore = useMemo(
  () => calculateImpactScore(project.contributions),
  [project.contributions],
);

// Memoize chart data transformations
const chartData = useMemo(
  () => transformToChartFormat(project.timeline),
  [project.timeline],
);
```

#### Code Splitting

```typescript
// Lazy load chart libraries
const LineChart = lazy(() =>
  import("recharts").then((m) => ({ default: m.LineChart })),
);
const PieChart = lazy(() =>
  import("recharts").then((m) => ({ default: m.PieChart })),
);

// Lazy load PDF export
const exportToPDF = lazy(() => import("@/lib/pdf-export"));
```

#### Virtual Scrolling (if many data points)

```typescript
// For large tables (e.g., all commits list)
import { useVirtualizer } from "@tanstack/react-virtual";

const virtualizer = useVirtualizer({
  count: commits.length,
  getScrollElement: () => parentRef.current,
  estimateSize: () => 50, // Row height
  overscan: 5,
});
```

---

## 🎯 Summary: 3-Level Information Architecture

### Level 0: Scanning Phase

- **Purpose**: "What projects exist?"
- **Time**: 5-10 seconds
- **Info Density**: High (all projects visible)
- **Interaction**: Click to expand

### Level 1: Evaluation Phase

- **Purpose**: "Which projects are relevant?"
- **Time**: 15-30 seconds
- **Info Density**: Medium (key details)
- **Interaction**: Compare 2-3, click for deep dive

### Level 2: Analysis Phase

- **Purpose**: "Tell me everything"
- **Time**: 45+ seconds
- **Info Density**: Low (single project focus)
- **Interaction**: Navigate tabs, export, study

---

## 📋 Implementation Checklist

### Level 0 Components

- [ ] `CompactProjectRow` (with hover states)
- [ ] `ProjectListContainer` (with sorting)
- [ ] Vertical commit bar visualization
- [ ] Owner/Contributor badges
- [ ] Responsive grid layout

### Level 1 Components

- [ ] `ExpandableProjectCard` (accordion on mobile)
- [ ] `ExpandedCardContent` (4 sections)
- [ ] Language bar chart
- [ ] Action buttons (Analytics, GitHub, Collapse)
- [ ] Smooth CSS expansion animation

### Level 2 Components

- [ ] `ProjectAnalyticsModal` (Dialog + Sheet)
- [ ] `HorizontalTabsNav` (4 tabs)
- [ ] Tab content components:
  - [ ] `OverviewTab` (metrics + activity breakdown)
  - [ ] `TimelineTab` (with Recharts + heatmap)
  - [ ] `CodeTab` (languages + impact)
  - [ ] `TeamTab` (PRs + collaboration + CI/CD)
- [ ] Lazy loading per tab
- [ ] Skeleton loading states

### Shared Components (shadcn/ui)

- [ ] `Card`, `Badge`, `Button`
- [ ] `Dialog`, `Sheet`
- [ ] `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent`
- [ ] `ScrollArea`, `Separator`
- [ ] `Skeleton`, `Progress`
- [ ] `HoverCard`, `Tooltip`

---

**Next**: Read [PART 3: Responsive Design](part-3) for breakpoint strategies.
