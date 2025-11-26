# Components Guide

> Comprehensive documentation for all React components in the GitHub User Info application

**Last Updated**: 2025-11-26
**Total Components**: 35+ components across 7 categories
**Test Coverage**: 91.36%
**Storybook Stories**: 100+

**📚 Related Documentation:**

- [Component Development Workflow](./component-development.md) - Step-by-step guide for creating new components
- [Testing Guide](./testing-guide.md) - Testing strategy and patterns
- [Architecture Overview](./architecture.md) - System design and component architecture

---

## Table of Contents

1. [UI Components (17)](#ui-components)
2. [Layout Components (7)](#layout-components)
3. [User Components (6)](#user-components)
4. [Repository Components (7)](#repository-components)
5. [Statistics Components (4)](#statistics-components)
6. [Assessment Components (7)](#assessment-components)
7. [Shared Components (2)](#shared-components)
8. [Form Components (1)](#form-components)

---

## UI Components

### Overview

All UI components are from **shadcn/ui** (New York style) built on top of Radix UI primitives. They follow consistent patterns for accessibility, theming, and composition.

**Location**: `src/components/ui/`
**Style**: New York (tailwind-based)
**Theme**: Supports dark/light mode
**Accessibility**: WCAG 2.1 AA compliant

### Component List

1. **Button** (`button.tsx`)
   - Variants: default, destructive, outline, secondary, ghost, link
   - Sizes: default, sm, lg, icon
   - Full keyboard navigation support

2. **Input** (`input.tsx`)
   - Text input with consistent styling
   - Supports disabled state
   - Accessible labels

3. **Label** (`label.tsx`)
   - Form label component
   - Proper label-input association

4. **Card** (`card.tsx`)
   - Sub-components: CardHeader, CardTitle, CardDescription, CardContent, CardFooter
   - Flexible container for content

5. **Table** (`table.tsx`)
   - Sub-components: TableHeader, TableBody, TableFooter, TableRow, TableHead, TableCell, TableCaption
   - Responsive table layout

6. **Tabs** (`tabs.tsx`)
   - Sub-components: TabsList, TabsTrigger, TabsContent
   - Keyboard navigation (arrow keys)

7. **Badge** (`badge.tsx`)
   - Variants: default, secondary, destructive, outline
   - Small labeled UI element

8. **Separator** (`separator.tsx`)
   - Horizontal/vertical divider
   - Decorative or semantic

9. **Skeleton** (`skeleton.tsx`)
   - Loading placeholder
   - Animated pulse effect

10. **Avatar** (`avatar.tsx`)
    - Sub-components: AvatarImage, AvatarFallback
    - Circular image with fallback

11. **Tooltip** (`tooltip.tsx`)
    - Sub-components: TooltipProvider, TooltipTrigger, TooltipContent
    - Hover/focus information display

12. **ScrollArea** (`scroll-area.tsx`)
    - Custom scrollbar styling
    - Overflow content container

13. **Select** (`select.tsx`)
    - Sub-components: SelectTrigger, SelectValue, SelectContent, SelectItem
    - Dropdown selection

14. **Checkbox** (`checkbox.tsx`)
    - Boolean input
    - Indeterminate state support

15. **Switch** (`switch.tsx`)
    - Toggle boolean input
    - Alternative to checkbox

16. **Accordion** (`accordion.tsx`)
    - Sub-components: AccordionItem, AccordionTrigger, AccordionContent
    - Collapsible content sections

17. **Progress** (`progress.tsx`)
    - Progress bar indicator
    - Percentage-based value

---

## Layout Components

### Overview

Layout components provide consistent structure and common UI patterns across the application.

**Location**: `src/components/layout/`
**Test Coverage**: 98%
**Storybook Stories**: 14 stories

---

### 1. StatsCard

**File**: `src/components/layout/StatsCard.tsx`

**Description**: Reusable statistics card wrapper with icon, label, and value display.

**Props**:

```typescript
type Props = {
  /** Icon component from lucide-react */
  icon: React.ComponentType<{ className?: string }>;
  /** Statistic label */
  label: string;
  /** Statistic value */
  value: string | number;
  /** Optional color for the icon */
  iconColor?: string;
  /** Optional additional description */
  description?: string;
};
```

**Usage**:

```tsx
import { StatsCard } from "@/components/layout/StatsCard";
import { Star } from "lucide-react";

<StatsCard
  icon={Star}
  label="Total Stars"
  value="1.2K"
  iconColor="text-yellow-500"
  description="Across all repositories"
/>;
```

**Storybook**: `src/components/layout/StatsCard.stories.tsx`

---

### 2. Section

**File**: `src/components/layout/Section.tsx`

**Description**: Content section wrapper with optional title, description, and action button.

**Props**:

```typescript
type Props = {
  /** Section title */
  title?: string;
  /** Section description */
  description?: string;
  /** Content to render */
  children: React.ReactNode;
  /** Optional action button */
  action?: React.ReactNode;
  /** CSS class name */
  className?: string;
};
```

**Usage**:

```tsx
import { Section } from "@/components/layout/Section";
import { Button } from "@/components/ui/button";

<Section
  title="Repositories"
  description="All public repositories"
  action={<Button variant="outline">View All</Button>}
>
  {/* Content */}
</Section>;
```

**Storybook**: `src/components/layout/Section.stories.tsx`

---

### 3. MainTabs

**File**: `src/components/layout/MainTabs.tsx`

**Description**: Main tab navigation for user profile sections (Overview, Repositories, Analytics).

**Props**:

```typescript
type Props = {
  /** Active tab value */
  defaultTab?: string;
  /** Tab change handler */
  onTabChange?: (value: string) => void;
  /** Content for each tab */
  children?: React.ReactNode;
};
```

**Usage**:

```tsx
import { MainTabs } from "@/components/layout/MainTabs";

<MainTabs defaultTab="overview" onTabChange={(tab) => console.log(tab)}>
  {/* Tab content */}
</MainTabs>;
```

**Storybook**: `src/components/layout/MainTabs.stories.tsx`

---

### 4. EmptyState

**File**: `src/components/layout/EmptyState.tsx`

**Description**: Empty state placeholder with icon, title, description, and optional action.

**Props**:

```typescript
type Props = {
  /** Icon component from lucide-react */
  icon?: React.ComponentType<{ className?: string }>;
  /** Empty state title */
  title: string;
  /** Empty state description */
  description?: string;
  /** Optional action button */
  action?: React.ReactNode;
};
```

**Usage**:

```tsx
import { EmptyState } from "@/components/layout/EmptyState";
import { Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";

<EmptyState
  icon={Inbox}
  title="No repositories found"
  description="Try adjusting your filters"
  action={<Button variant="outline">Clear Filters</Button>}
/>;
```

**Storybook**: `src/components/layout/EmptyState.stories.tsx`

---

### 5. ErrorState

**File**: `src/components/layout/ErrorState.tsx`

**Description**: Error state display with title, message, and retry action.

**Props**:

```typescript
type Props = {
  /** Error title */
  title: string;
  /** Error message */
  message?: string;
  /** Retry callback */
  onRetry?: () => void;
};
```

**Usage**:

```tsx
import { ErrorState } from "@/components/layout/ErrorState";

<ErrorState
  title="Failed to load data"
  message="Network error occurred. Please try again."
  onRetry={() => window.location.reload()}
/>;
```

**Storybook**: `src/components/layout/ErrorState.stories.tsx`

---

### 6. LoadingState

**File**: `src/components/layout/LoadingState.tsx`

**Description**: Loading skeleton with customizable variant (card, list, table).

**Props**:

```typescript
type Props = {
  /** Loading variant */
  variant?: "card" | "list" | "table" | "default";
  /** Number of skeleton items */
  count?: number;
};
```

**Usage**:

```tsx
import { LoadingState } from '@/components/layout/LoadingState';

// Card skeleton
<LoadingState variant="card" count={3} />

// Table skeleton
<LoadingState variant="table" count={5} />
```

**Storybook**: `src/components/layout/LoadingState.stories.tsx`

---

### 7. ThemeToggle

**File**: `src/components/layout/ThemeToggle.tsx`

**Description**: Dark/light mode toggle button with system preference support.

**Props**: None (uses next-themes context)

**Usage**:

```tsx
import { ThemeToggle } from "@/components/layout/ThemeToggle";

<ThemeToggle />;
```

**Features**:

- Three modes: light, dark, system
- Smooth transitions
- Persists preference to localStorage
- Icon changes based on theme

**Storybook**: `src/components/layout/ThemeToggle.stories.tsx`

---

## User Components

### Overview

User profile components display GitHub user information, statistics, and contribution data.

**Location**: `src/components/user/`
**Test Coverage**: 100%
**Storybook Stories**: 15 stories

---

### 1. UserHeader

**File**: `src/components/user/UserHeader.tsx`

**Description**: User profile header with avatar, name, username, bio, location, and authenticity score.

**Props**:

```typescript
type Props = {
  /** User avatar URL */
  avatarUrl: string;
  /** User's display name */
  name: string | null;
  /** GitHub username */
  login: string;
  /** User bio */
  bio: string | null;
  /** User location */
  location: string | null;
  /** GitHub profile URL */
  url: string;
  /** Account creation date */
  createdAt: string;
  /** Authenticity score (0-100) */
  authenticityScore?: number;
};
```

**Usage**:

```tsx
import { UserHeader } from "@/components/user/UserHeader";

<UserHeader
  avatarUrl="https://github.com/avatar.png"
  name="John Doe"
  login="johndoe"
  bio="Full-stack developer"
  location="San Francisco, CA"
  url="https://github.com/johndoe"
  createdAt="2020-01-01T00:00:00Z"
  authenticityScore={85}
/>;
```

**Storybook**: `src/components/user/UserHeader.stories.tsx`

---

### 2. UserStats

**File**: `src/components/user/UserStats.tsx`

**Description**: User statistics grid (followers, following, repos, gists).

**Props**:

```typescript
type Props = {
  /** Number of followers */
  followers: number;
  /** Number of following */
  following: number;
  /** Number of public repositories */
  repositories: number;
  /** Number of public gists */
  gists: number;
};
```

**Usage**:

```tsx
import { UserStats } from "@/components/user/UserStats";

<UserStats followers={1234} following={567} repositories={89} gists={12} />;
```

**Storybook**: `src/components/user/UserStats.stories.tsx`

---

### 3. UserAuthenticity

**File**: `src/components/user/UserAuthenticity.tsx`

**Description**: Authenticity score breakdown with detailed metrics and flags.

**Props**:

```typescript
type Props = {
  /** Authenticity score data */
  score: AuthenticityScore;
};

type AuthenticityScore = {
  overallScore: number;
  breakdown: {
    originalReposPercent: number;
    activityScore: number;
    engagementScore: number;
    codeOwnershipScore: number;
  };
  flags: {
    hasForkedRepos: boolean;
    hasInactiveRepos: boolean;
    hasLowEngagement: boolean;
  };
};
```

**Usage**:

```tsx
import { UserAuthenticity } from "@/components/user/UserAuthenticity";

<UserAuthenticity score={authenticityScore} />;
```

**Storybook**: `src/components/user/UserAuthenticity.stories.tsx`

---

### 4. ContributionHistory

**File**: `src/components/user/ContributionHistory.tsx`

**Description**: 3-year commit contribution history chart using Recharts.

**Props**:

```typescript
type Props = {
  /** Yearly contribution data */
  data: Array<{
    year: number;
    commits: number;
  }>;
};
```

**Usage**:

```tsx
import { ContributionHistory } from "@/components/user/ContributionHistory";

<ContributionHistory
  data={[
    { year: 2023, commits: 250 },
    { year: 2024, commits: 380 },
    { year: 2025, commits: 150 },
  ]}
/>;
```

**Storybook**: `src/components/user/ContributionHistory.stories.tsx`

---

### 5. RecentActivity

**File**: `src/components/user/RecentActivity.tsx`

**Description**: Recent commit activity by repository.

**Props**:

```typescript
type Props = {
  /** Repository commit contributions */
  contributions: RepositoryContributions[];
};

type RepositoryContributions = {
  repository: {
    name: string;
  };
  contributions: {
    totalCount: number;
  };
};
```

**Usage**:

```tsx
import { RecentActivity } from "@/components/user/RecentActivity";

<RecentActivity contributions={contributionsByRepo} />;
```

**Storybook**: `src/components/user/RecentActivity.stories.tsx`

---

### 6. UserProfile

**File**: `src/components/user/UserProfile.tsx`

**Description**: Main user profile container that orchestrates all user components.

**Props**:

```typescript
type Props = {
  /** GitHub username to fetch */
  userName: string;
};
```

**Usage**:

```tsx
import { UserProfile } from "@/components/user/UserProfile";

<UserProfile userName="octocat" />;
```

**Features**:

- Integrates with `useQueryUser` hook
- Handles loading, error, and success states
- Displays all user information in tabs (Overview, Repositories, Analytics)

**Storybook**: `src/components/user/UserProfile.stories.tsx`

---

## Repository Components

### Overview

Repository components handle repository display, filtering, sorting, and pagination.

**Location**: `src/components/repository/`
**Test Coverage**: 93.81%
**Storybook Stories**: 23 stories

---

### 1. RepositoryCard

**File**: `src/components/repository/RepositoryCard.tsx`

**Description**: Individual repository card with metadata, stats, and language indicator.

**Props**:

```typescript
type Props = {
  /** Repository data from GitHub API */
  repository: Repository;
  /** Whether to show compact version */
  compact?: boolean;
  /** Click handler */
  onClick?: (repository: Repository) => void;
};
```

**Usage**:

```tsx
import { RepositoryCard } from '@/components/repository/RepositoryCard';

<RepositoryCard
  repository={repo}
  onClick={(repo) => window.open(repo.url, '_blank')}
/>

// Compact version
<RepositoryCard repository={repo} compact />
```

**Storybook**: `src/components/repository/RepositoryCard.stories.tsx`

---

### 2. RepositoryList

**File**: `src/components/repository/RepositoryList.tsx`

**Description**: Grid layout container for repository cards.

**Props**:

```typescript
type Props = {
  /** Array of repositories */
  repositories: Repository[];
  /** Card click handler */
  onRepositoryClick?: (repository: Repository) => void;
  /** Loading state */
  loading?: boolean;
};
```

**Usage**:

```tsx
import { RepositoryList } from "@/components/repository/RepositoryList";

<RepositoryList
  repositories={repos}
  onRepositoryClick={(repo) => console.log(repo)}
/>;
```

**Storybook**: `src/components/repository/RepositoryList.stories.tsx`

---

### 3. RepositoryTable

**File**: `src/components/repository/RepositoryTable.tsx`

**Description**: Table layout for repositories with sortable columns.

**Props**:

```typescript
type Props = {
  /** Array of repositories */
  repositories: Repository[];
  /** Row click handler */
  onRepositoryClick?: (repository: Repository) => void;
};
```

**Usage**:

```tsx
import { RepositoryTable } from "@/components/repository/RepositoryTable";

<RepositoryTable
  repositories={repos}
  onRepositoryClick={(repo) => window.open(repo.url, "_blank")}
/>;
```

**Columns**:

- Name (with language indicator)
- Description
- Stars
- Forks
- Updated
- Status badges (Fork, Archived)

**Storybook**: `src/components/repository/RepositoryTable.stories.tsx`

---

### 4. RepositoryFilters

**File**: `src/components/repository/RepositoryFilters.tsx`

**Description**: Advanced filtering UI for repositories.

**Props**:

```typescript
type Props = {
  /** Current filters */
  filters: RepositoryFilter;
  /** Filter change handler */
  onFiltersChange: (filters: RepositoryFilter) => void;
  /** Available languages for filter */
  availableLanguages: string[];
};

type RepositoryFilter = {
  language?: string;
  minStars?: number;
  isFork?: boolean;
  isTemplate?: boolean;
  hasIssues?: boolean;
  isArchived?: boolean;
  searchQuery?: string;
  topics?: string[];
  lastActivityDays?: number;
};
```

**Usage**:

```tsx
import { RepositoryFilters } from "@/components/repository/RepositoryFilters";

<RepositoryFilters
  filters={filters}
  onFiltersChange={setFilters}
  availableLanguages={["TypeScript", "JavaScript", "Python"]}
/>;
```

**Storybook**: `src/components/repository/RepositoryFilters.stories.tsx`

---

### 5. RepositorySorting

**File**: `src/components/repository/RepositorySorting.tsx`

**Description**: Sorting controls for repositories.

**Props**:

```typescript
type Props = {
  /** Current sort option */
  sortBy: SortField;
  /** Sort direction */
  sortDirection: SortDirection;
  /** Sort change handler */
  onSortChange: (field: SortField, direction: SortDirection) => void;
};

type SortField =
  | "stars"
  | "forks"
  | "commits"
  | "updated"
  | "created"
  | "name"
  | "size";
type SortDirection = "asc" | "desc";
```

**Usage**:

```tsx
import { RepositorySorting } from "@/components/repository/RepositorySorting";

<RepositorySorting
  sortBy="stars"
  sortDirection="desc"
  onSortChange={(field, dir) => console.log(field, dir)}
/>;
```

**Storybook**: `src/components/repository/RepositorySorting.stories.tsx`

---

### 6. RepositoryEmpty

**File**: `src/components/repository/RepositoryEmpty.tsx`

**Description**: Empty state for when no repositories match filters.

**Props**:

```typescript
type Props = {
  /** Whether filters are active */
  hasFilters?: boolean;
  /** Clear filters callback */
  onClearFilters?: () => void;
};
```

**Usage**:

```tsx
import { RepositoryEmpty } from "@/components/repository/RepositoryEmpty";

<RepositoryEmpty hasFilters={true} onClearFilters={() => setFilters({})} />;
```

**Storybook**: `src/components/repository/RepositoryEmpty.stories.tsx`

---

### 7. RepositoryPagination

**File**: `src/components/repository/RepositoryPagination.tsx`

**Description**: Pagination controls for repository lists.

**Props**:

```typescript
type Props = {
  /** Total number of repositories */
  total: number;
  /** Current page (1-indexed) */
  page: number;
  /** Items per page */
  pageSize: number;
  /** Page change handler */
  onPageChange: (page: number) => void;
  /** Page size change handler */
  onPageSizeChange: (pageSize: number) => void;
};
```

**Usage**:

```tsx
import { RepositoryPagination } from "@/components/repository/RepositoryPagination";

<RepositoryPagination
  total={100}
  page={1}
  pageSize={10}
  onPageChange={setPage}
  onPageSizeChange={setPageSize}
/>;
```

**Storybook**: `src/components/repository/RepositoryPagination.stories.tsx`

---

## Statistics Components

### Overview

Statistics components visualize user contribution data using Recharts library.

**Location**: `src/components/statistics/`
**Test Coverage**: 76.11%
**Storybook Stories**: 12 stories

---

### 1. CommitChart

**File**: `src/components/statistics/CommitChart.tsx`

**Description**: Bar chart showing commit activity over 3 years.

**Props**:

```typescript
type Props = {
  /** Yearly commit data */
  data: Array<{
    year: number;
    commits: number;
  }>;
};
```

**Usage**:

```tsx
import { CommitChart } from "@/components/statistics/CommitChart";

<CommitChart
  data={[
    { year: 2023, commits: 250 },
    { year: 2024, commits: 380 },
    { year: 2025, commits: 150 },
  ]}
/>;
```

**Storybook**: `src/components/statistics/CommitChart.stories.tsx`

---

### 2. LanguageChart

**File**: `src/components/statistics/LanguageChart.tsx`

**Description**: Pie chart showing language usage distribution.

**Props**:

```typescript
type Props = {
  /** Language statistics */
  data: LanguageStats[];
};

type LanguageStats = {
  name: string;
  size: number;
  percentage: number;
  repositoryCount: number;
};
```

**Usage**:

```tsx
import { LanguageChart } from "@/components/statistics/LanguageChart";

<LanguageChart data={languageStats} />;
```

**Storybook**: `src/components/statistics/LanguageChart.stories.tsx`

---

### 3. ActivityChart

**File**: `src/components/statistics/ActivityChart.tsx`

**Description**: Line chart showing contribution activity timeline.

**Props**:

```typescript
type Props = {
  /** Activity data points */
  data: Array<{
    date: string;
    commits: number;
  }>;
};
```

**Usage**:

```tsx
import { ActivityChart } from "@/components/statistics/ActivityChart";

<ActivityChart data={activityData} />;
```

**Storybook**: `src/components/statistics/ActivityChart.stories.tsx`

---

### 4. StatsOverview

**File**: `src/components/statistics/StatsOverview.tsx`

**Description**: Summary dashboard combining multiple statistics.

**Props**:

```typescript
type Props = {
  /** Contribution statistics */
  stats: {
    totalCommits: number;
    repositories: number;
    stars: number;
    forks: number;
  };
};
```

**Usage**:

```tsx
import { StatsOverview } from "@/components/statistics/StatsOverview";

<StatsOverview stats={overviewStats} />;
```

**Storybook**: `src/components/statistics/StatsOverview.stories.tsx`

---

## Assessment Components

### Overview

Assessment components display GitHub user metrics grouped into categories with explanations and visual indicators. Implements "Always Expanded Cards" pattern on desktop and accordion on mobile.

**Location**: `src/components/assessment/`
**Test Coverage**: 100%
**Storybook Stories**: 20+ stories

**Design Pattern**:
- Desktop (≥768px): 3-column grid, all cards expanded (fixed 220px height)
- Mobile (<768px): Vertical stack with accordion (all collapsed by default)

---

### 1. MetricAssessmentGrid

**File**: `src/components/assessment/MetricAssessmentGrid.tsx`

**Description**: Main container that combines UserSkills and MetricCategoryCards into a responsive grid. Manages accordion state for mobile and modal state for metric explanations.

**Props**:

```typescript
interface MetricAssessmentGridProps {
  /** All metrics data */
  metrics: AllMetricsData;
  /** User's programming languages (optional) */
  languages?: LanguageSkill[];
  /** Loading state */
  loading?: boolean;
  /** Additional CSS classes */
  className?: string;
}
```

**Usage**:

```tsx
import { MetricAssessmentGrid } from "@/components/assessment";

<MetricAssessmentGrid
  metrics={{
    activity: { score: 85, level: "High", breakdown: { recentCommits: 38, consistency: 27, diversity: 20 } },
    impact: { score: 65, level: "Moderate", breakdown: { stars: 25, forks: 15, contributors: 10 } },
    quality: { score: 78, level: "Strong", breakdown: { originality: 25, documentation: 20 } },
    consistency: { score: 82, level: "High", breakdown: { regularity: 40, streak: 25 } },
    authenticity: { score: 45, level: "Medium", breakdown: { originalityScore: 15 } },
    collaboration: { score: 55, level: "Moderate", breakdown: { contributionRatio: 25 } },
  }}
  languages={[
    { name: "TypeScript", percent: 68 },
    { name: "JavaScript", percent: 15 },
  ]}
/>
```

**Storybook**: `src/components/assessment/MetricAssessmentGrid.stories.tsx`

---

### 2. MetricCategoryCard

**File**: `src/components/assessment/MetricCategoryCard.tsx`

**Description**: Category card displaying 2 metrics with category score. Fixed 220px height on desktop, collapsible accordion on mobile.

**Props**:

```typescript
interface MetricCategoryCardProps {
  /** Category name (OUTPUT, QUALITY, TRUST) */
  category: CategoryName;
  /** Calculated category score (average of metrics) */
  categoryScore: number;
  /** Metrics in this category */
  metrics: MetricData[];
  /** Loading state */
  loading?: boolean;
  /** Callback when info button clicked */
  onExplainMetric?: (metricKey: MetricKey) => void;
  /** Whether card is expanded (mobile only) */
  isExpanded?: boolean;
  /** Toggle callback (mobile only) */
  onToggle?: () => void;
}
```

**Usage**:

```tsx
import { MetricCategoryCard } from "@/components/assessment";

<MetricCategoryCard
  category="OUTPUT"
  categoryScore={75}
  metrics={[
    { key: "activity", name: "Activity", score: 85, level: "High" },
    { key: "impact", name: "Impact", score: 65, level: "Moderate" },
  ]}
  onExplainMetric={(key) => openModal(key)}
/>
```

**Categories**:
| Category | Metrics | Description |
|----------|---------|-------------|
| OUTPUT | Activity + Impact | Production and influence metrics |
| QUALITY | Quality + Consistency | Code quality and regularity |
| TRUST | Authenticity + Collaboration | Verification and teamwork |

**Storybook**: `src/components/assessment/MetricCategoryCard.stories.tsx`

---

### 3. MetricRowCompact

**File**: `src/components/assessment/MetricRowCompact.tsx`

**Description**: Compact metric row with icon, title, score, progress bar, and info button. Uses color-coded scores based on design tokens.

**Props**:

```typescript
interface MetricRowCompactProps {
  /** Metric icon */
  icon: React.ReactNode;
  /** Metric name */
  title: string;
  /** Score value (0-100) */
  score: number;
  /** Score level label */
  level: string;
  /** Info button click handler */
  onInfoClick?: () => void;
  /** Loading state */
  loading?: boolean;
}
```

**Usage**:

```tsx
import { MetricRowCompact } from "@/components/assessment";
import { Activity } from "lucide-react";

<MetricRowCompact
  icon={<Activity className="h-4 w-4" />}
  title="Activity"
  score={85}
  level="High"
  onInfoClick={() => openExplanation("activity")}
/>
```

**Score Colors**:
| Range | Color | Token |
|-------|-------|-------|
| 80-100 | Green | success |
| 60-79 | Yellow | warning |
| 40-59 | Orange | caution |
| 0-39 | Red | destructive |

**Storybook**: `src/components/assessment/MetricRowCompact.stories.tsx`

---

### 4. UserSkills

**File**: `src/components/assessment/UserSkills.tsx`

**Description**: Displays user's top programming languages as colored chips with percentage.

**Props**:

```typescript
interface UserSkillsProps {
  /** Language statistics */
  languages: LanguageSkill[];
  /** Maximum items to display (default: 5) */
  maxItems?: number;
  /** Loading state */
  loading?: boolean;
}

interface LanguageSkill {
  name: string;
  percent: number;
}
```

**Usage**:

```tsx
import { UserSkills } from "@/components/assessment";

<UserSkills
  languages={[
    { name: "TypeScript", percent: 68 },
    { name: "JavaScript", percent: 15 },
    { name: "Python", percent: 10 },
    { name: "Go", percent: 5 },
    { name: "Rust", percent: 2 },
  ]}
  maxItems={5}
/>
```

**Features**:
- Colored chips using GitHub language colors
- Shows "+N" overflow indicator when more languages than maxItems
- Loading skeleton state

**Storybook**: `src/components/assessment/UserSkills.stories.tsx`

---

### 5. MetricExplanationModal

**File**: `src/components/assessment/MetricExplanationModal.tsx`

**Description**: Modal explaining metric calculation. Uses Dialog on desktop, Sheet on mobile for better UX.

**Props**:

```typescript
interface MetricExplanationModalProps {
  /** Whether modal is open */
  isOpen: boolean;
  /** Close callback */
  onClose: () => void;
  /** Metric being explained */
  metric: "activity" | "impact" | "quality" | "consistency" | "authenticity" | "collaboration";
  /** Current score */
  score: number;
  /** Score breakdown by component */
  breakdown: Record<string, number>;
}
```

**Usage**:

```tsx
import { MetricExplanationModal } from "@/components/assessment";

<MetricExplanationModal
  isOpen={modalOpen}
  onClose={() => setModalOpen(false)}
  metric="activity"
  score={85}
  breakdown={{
    recentCommits: 38,
    consistency: 27,
    diversity: 20,
  }}
/>
```

**Supported Metrics**:
| Metric | Components |
|--------|------------|
| activity | recentCommits, consistency, diversity |
| impact | stars, forks, contributors, reach, engagement |
| quality | originality, documentation, ownership, maturity, stack |
| consistency | regularity, streak, recency |
| authenticity | originalityScore, activityScore, engagementScore, codeOwnershipScore |
| collaboration | contributionRatio, diversity, engagement |

**Storybook**: `src/components/assessment/MetricExplanationModal.stories.tsx`

---

### 6. MetricCard (Legacy)

**File**: `src/components/assessment/MetricCard.tsx`

**Description**: Original metric card component. Kept for backward compatibility but replaced by MetricRowCompact + MetricCategoryCard pattern.

**Props**:

```typescript
interface MetricCardProps {
  title: string;
  score: number;
  level: string;
  description?: string;
  onClick?: () => void;
}
```

**Status**: Deprecated - use MetricRowCompact instead

---

### 7. QuickAssessment (Legacy)

**File**: `src/components/assessment/QuickAssessment.tsx`

**Description**: Original quick assessment grid. Replaced by MetricAssessmentGrid.

**Status**: Deprecated - use MetricAssessmentGrid instead

---

### Categories System

**File**: `src/lib/metrics/categories.ts`

The assessment system groups 6 metrics into 3 categories:

```typescript
// Category definitions
const CATEGORY_CONFIGS = {
  OUTPUT: {
    name: "Output",
    metrics: ["activity", "impact"],
    description: "Production and influence",
  },
  QUALITY: {
    name: "Quality",
    metrics: ["quality", "consistency"],
    description: "Code quality and regularity",
  },
  TRUST: {
    name: "Trust",
    metrics: ["authenticity", "collaboration"],
    description: "Verification and teamwork",
  },
};

// Helper functions
getCategoryScores(metrics) // Returns scores for all categories
calculateCategoryScore(category, metrics) // Calculates average for one category
```

---

## Shared Components

### Overview

Reusable components used across multiple features.

**Location**: `src/components/shared/`
**Test Coverage**: 100%
**Storybook Stories**: 20+ stories

---

### 1. HorizontalLanguageBar

**File**: `src/components/shared/HorizontalLanguageBar.tsx`

**Description**: Horizontal bar showing language distribution with colored segments.

**Props**:

```typescript
interface HorizontalLanguageBarProps {
  /** Language statistics */
  languages: Array<{ name: string; percent: number }>;
  /** Bar height class */
  height?: string;
  /** Show legend below bar */
  showLegend?: boolean;
}
```

**Usage**:

```tsx
import { HorizontalLanguageBar } from "@/components/shared";

<HorizontalLanguageBar
  languages={[
    { name: "TypeScript", percent: 68 },
    { name: "JavaScript", percent: 20 },
    { name: "CSS", percent: 12 },
  ]}
  showLegend
/>
```

**Storybook**: `src/components/shared/HorizontalLanguageBar.stories.tsx`

---

### 2. CombinedLanguageActivityBar

**File**: `src/components/shared/CombinedLanguageActivityBar.tsx`

**Description**: Dual-dimension bar encoding activity intensity (width) and language breakdown (colors). Width represents commits relative to max, colored segments show language percentages.

**Props**:

```typescript
interface CombinedLanguageActivityBarProps {
  /** Total commits for this period */
  commitCount: number;
  /** Maximum commits across all periods (for normalization) */
  maxCommits: number;
  /** Language breakdown data */
  languages: LanguageBreakdown[];
  /** Whether parent container is selected/active */
  isSelected?: boolean;
  /** Compact mode (mobile/small screens) */
  compact?: boolean;
  /** Custom bar height (overrides compact) */
  barHeight?: string;
  /** Additional container classes */
  className?: string;
}

interface LanguageBreakdown {
  name: string;
  percent: number;
}
```

**Usage**:

```tsx
import { CombinedLanguageActivityBar } from "@/components/shared";

<CombinedLanguageActivityBar
  commitCount={347}
  maxCommits={500}
  languages={[
    { name: "TypeScript", percent: 68 },
    { name: "JavaScript", percent: 22 },
    { name: "CSS", percent: 10 },
  ]}
  isSelected={isCurrentYear}
/>
```

**Features**:
- Width = Activity intensity (commits / maxCommits)
- Colored segments = Language distribution
- Animated bars with Framer Motion
- Tooltip with detailed breakdown
- Minimum 2% width for visibility when > 0 commits
- Supports reduced motion preference
- ARIA labels for accessibility

**Storybook**: `src/components/shared/CombinedLanguageActivityBar.stories.tsx`

---

## Form Components

### 1. SearchForm

**File**: `src/components/SearchForm.tsx`

**Description**: GitHub user search form with validation.

**Props**:

```typescript
type Props = {
  /** Username setter */
  setUserName: (userName: string) => void;
};
```

**Usage**:

```tsx
import { SearchForm } from "@/components/SearchForm";

<SearchForm setUserName={setUserName} />;
```

**Features**:

- Input validation (non-empty)
- Enter key submission
- Error toast for empty input
- Accessible form structure

**Storybook**: `src/components/SearchForm.stories.tsx`

---

## Component Patterns

### Common Patterns

#### 1. Props Type Naming

All components use capitalized `Props` type:

```typescript
type Props = {
  // ...
};

export function MyComponent({}: Props) {
  // ...
}
```

#### 2. JSDoc Documentation

All components have JSDoc comments:

````typescript
/**
 * Component description
 *
 * @example
 * ```tsx
 * <MyComponent prop="value" />
 * ```
 */
export function MyComponent({}: Props) {
  // ...
}
````

#### 3. Accessibility

- Semantic HTML elements
- ARIA labels and roles
- Keyboard navigation support
- Screen reader friendly

#### 4. Theming

All components support dark/light mode via CSS variables and Tailwind classes.

---

## Testing

### Test Strategy

**Unit Tests**: All components have unit tests

- Rendering tests
- Props validation
- User interaction
- Edge cases
- Accessibility

**Integration Tests**: Components with hooks/Apollo

- Data fetching
- Loading states
- Error handling
- Cache updates

**Storybook Stories**: All components documented

- Default state
- All variants
- Edge cases
- Accessibility checks (a11y addon)

### Running Tests

```bash
# Unit tests
npm run test

# Coverage
npm run test:coverage

# Storybook
npm run storybook
```

---

## Best Practices

### 1. Component Creation Checklist

- [ ] Create component file
- [ ] Add JSDoc documentation
- [ ] Define Props type
- [ ] Implement component
- [ ] Create Storybook story
- [ ] Verify in Storybook (all variants)
- [ ] Check Accessibility tab
- [ ] Write unit tests
- [ ] Run tests (must pass)
- [ ] Check coverage (≥85%)

### 2. Styling Guidelines

- Use Tailwind utility classes
- Follow shadcn/ui patterns
- Support dark/light mode
- Responsive design (mobile-first)
- Consistent spacing (4px grid)

### 3. Accessibility Guidelines

- Semantic HTML
- ARIA labels for icons
- Keyboard navigation
- Focus indicators
- Screen reader support
- Color contrast (WCAG AA)

### 4. Performance Guidelines

- Lazy load heavy components
- Memoize expensive calculations
- Use React.memo for pure components
- Optimize re-renders
- Code splitting

---

## Additional Resources

- [Architecture Documentation](./architecture.md)
- [Testing Guide](./testing-guide.md)
- [TypeScript Guide](./typescript-guide.md)
- [Component Development Workflow](./component-development.md)

---

**Note**: This guide is kept up-to-date with all component changes. Last updated: 2025-11-16
