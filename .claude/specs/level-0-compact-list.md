# Level 0: Compact List Specification

> **Purpose**: Ultra-compact view for scanning all projects in a year  
> **Read this when**: Implementing or modifying Level 0 components  
> **For quick overview**: See `quick-ref/3-levels-summary.md`  
> **For code example**: See `examples/compact-project-row.tsx`

---

## 🎯 Overview

**Level 0** — это entry point для пользователей: список всех проектов за год, сгруппированных по "YOUR PROJECTS" (владелец) и "CONTRIBUTIONS" (вклады). Цель — позволить пользователю увидеть 10-20+ проектов без скролла (или с минимальным), чтобы быстро сканировать и выбирать интересные.

**Key Metrics**:

- Время сканирования: 5-10 секунд
- Инфо-плотность: Высокая (все проекты видимы)
- Интерактивность: Hover для preview, click для расширения (Level 1)

**Constraints**:

- NO pagination — все проекты в одном списке
- Группировка: Owner first, затем Contributions
- Sorting: По умолчанию по commits (descending)

---

## 📐 Layout & Dimensions

### Desktop (≥1440px)

- **Container**: Right panel (67% ширины, ~1280px max)
- **Row Height**: 56px
- **Padding**: 12px 16px per row
- **Gap**: 8px между rows
- **Scroll**: Если >15 rows, используй `ScrollArea` с fade gradient внизу

### Tablet (768-1439px)

- **Container**: Flexible right panel
- **Row Height**: 56px (same as desktop)
- **Simplified Metrics**: Если ширина <900px, сократи текст (e.g., "347c" вместо "347 commits")

### Mobile (<768px)

- **Container**: Full-width
- **Row Height**: 48px (компактнее для touch)
- **Touch Targets**: Минимум 48px (WCAG 2.1 AA)
- **Metrics**: Короткие (commits, stars, lang — без слов)

**CSS Grid Example**:

```css
.project-list {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.5rem; /* 8px */
  max-height: calc(100vh - 200px); /* Adjust for header/footer */
}
```

🧩 Components

1. ProjectListContainer
   File: src/components/level-0/ProjectListContainer.tsx
   Props:
   TypeScriptinterface Props {
   projects: Project[]; // Array of projects
   year: number;
   sortBy: 'commits' | 'stars' | 'recent'; // Default: 'commits'
   onSortChange: (sort: string) => void;
   onProjectClick: (id: string) => void;
   expandedProjects: Set<string>; // For highlighting expanded rows
   }
   Features:

Grouping: Раздели на 'YOUR PROJECTS' (isOwner=true) и 'CONTRIBUTIONS'
Header: "Projects & Contributions ({year})" + Dropdown для sort
Separator: Между группами (shadcn Separator)
Scroll Hint: Fade gradient + "Scroll for more" если overflow
Empty State: Если нет проектов — "No activity in {year}"

shadcn Components Used:

Card (outer container)
ScrollArea (for smooth scrolling)
Separator (between groups)
DropdownMenu (for sorting)

Implementation Notes:

Sort логика: Используй project-sort.ts из lib/utils
Render: Map по группам, рендери CompactProjectRow для каждого

2. CompactProjectRow
   File: src/components/level-0/CompactProjectRow.tsx
   Props:
   TypeScriptinterface Props {
   project: {
   id: string;
   name: string;
   commits: number;
   stars: number;
   language: string;
   isOwner: boolean;
   description?: string; // For hover preview
   };
   maxCommits: number; // Для расчета ширины бара (normalize)
   onClick: () => void;
   isExpanded: boolean; // Для стиля (e.g., bg-muted)
   }
   Visual Elements:

Commit Bar: Vertical (4px width, gradient: owner blue, contrib green). Высота = (commits / maxCommits) \* 100%
Name: Truncated, font-medium, sm size
Badge: 👤 (owner) или 👥 (contrib), variant=default/secondary
Metrics: "commits · ⭐ stars · language" (text-xs, muted-foreground)
Hover: Scale 1.02, shadow-md, 200ms transition
Focus: Ring-2 primary (keyboard nav)

Hover Preview (HoverCard):

Trigger: Entire row
Content: Name (bold), description (if any), full metrics
Side: Right (desktop), top (mobile)

shadcn Components Used:

Badge (owner/contrib)
HoverCard, HoverCardContent, HoverCardTrigger

Accessibility:

aria-label: "Expand {name} details"
aria-expanded: isExpanded
Role: "button" (поскольку clickable)

Implementation Notes:

Bar Style: style={{ height: ${normalized}% }}
Format Numbers: Use Intl.NumberFormat (e.g., 1200 → "1.2K")
Language Color: Dot перед language (from LANGUAGE_COLORS token)

🎭 States & Interactions
States

Default: Neutral bg, no shadow
Hover: bg-muted/50, scale-[1.02], shadow-md
Expanded: bg-muted/30 (указывает, что Level 1 открыт)
Loading: Skeleton для rows (если data fetching)

Interactions

Click: onProjectClick → Expand to Level 1
Hover: Show preview (300ms delay)
Keyboard: Focusable, Enter/Space для expand
Touch: No hover, но увеличенные targets

Animation:

Hover: CSS transition-all 200ms ease-out
No expand animation here (это для Level 1)

📊 Data Requirements
Project Interface (from GraphQL/Apollo):
TypeScriptinterface Project {
id: string;
name: string;
commits: number;
stars: number;
language: string;
isOwner: boolean;
description?: string;
}

maxCommits: Calculate from all projects in list (Math.max(...projects.map(p => p.commits)))

♿ Accessibility Checklist

ARIA labels on rows and badges
Keyboard navigation through list
Screen reader: "Project {name}, {commits} commits, owned/ contributed"
Color contrast: AA compliant (e.g., text on bg)
Touch targets: 48px+

🧪 Testing Checklist

Unit: Render row with props, check bar height
Integration: Sorting changes order
E2E: Click row → expands to Level 1
Responsive: Check at 375px, 768px, 1440px
Performance: <50ms render for 20 rows

🔗 Related Docs

Quick Ref: quick-ref/3-levels-summary.md (Level 0 section)
Responsive: quick-ref/responsive-rules.md
Design Tokens: quick-ref/design-tokens.md (colors, spacing)
Example Code: examples/compact-project-row.tsx

For help: Invoke ui-design-specialist with @shadcn MCP: "Implement CompactProjectRow with hover-card"

Version: 2.0.0
Last Updated: 2025-01-22

<details>
<summary>specs/level-0-compact-list.md</summary>

# Level 0: Compact List Specification

> **Purpose**: Ultra-compact view for scanning all projects in a year  
> **Read this when**: Implementing or modifying Level 0 components  
> **For quick overview**: See `quick-ref/3-levels-summary.md`  
> **For code example**: See `examples/compact-project-row.tsx`

---

## 🎯 Overview

**Level 0** — это entry point для пользователей: список всех проектов за год, сгруппированных по "YOUR PROJECTS" (владелец) и "CONTRIBUTIONS" (вклады). Цель — позволить пользователю увидеть 10-20+ проектов без скролла (или с минимальным), чтобы быстро сканировать и выбирать интересные.

**Key Metrics**:

- Время сканирования: 5-10 секунд
- Инфо-плотность: Высокая (все проекты видимы)
- Интерактивность: Hover для preview, click для расширения (Level 1)

**Constraints**:

- NO pagination — все проекты в одном списке
- Группировка: Owner first, затем Contributions
- Sorting: По умолчанию по commits (descending)

---

## 📐 Layout & Dimensions

### Desktop (≥1440px)

- **Container**: Right panel (67% ширины, ~1280px max)
- **Row Height**: 56px
- **Padding**: 12px 16px per row
- **Gap**: 8px между rows
- **Scroll**: Если >15 rows, используй `ScrollArea` с fade gradient внизу

### Tablet (768-1439px)

- **Container**: Flexible right panel
- **Row Height**: 56px (same as desktop)
- **Simplified Metrics**: Если ширина <900px, сократи текст (e.g., "347c" вместо "347 commits")

### Mobile (<768px)

- **Container**: Full-width
- **Row Height**: 48px (компактнее для touch)
- **Touch Targets**: Минимум 48px (WCAG 2.1 AA)
- **Metrics**: Короткие (commits, stars, lang — без слов)

**CSS Grid Example**:

```css
.project-list {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.5rem; /* 8px */
  max-height: calc(100vh - 200px); /* Adjust for header/footer */
}
```

---

## 🧩 Components

### 1. ProjectListContainer

**File**: `src/components/level-0/ProjectListContainer.tsx`

**Props**:

```typescript
interface Props {
  projects: Project[]; // Array of projects
  year: number;
  sortBy: "commits" | "stars" | "recent"; // Default: 'commits'
  onSortChange: (sort: string) => void;
  onProjectClick: (id: string) => void;
  expandedProjects: Set<string>; // For highlighting expanded rows
}
```

**Features**:

- **Grouping**: Раздели на 'YOUR PROJECTS' (isOwner=true) и 'CONTRIBUTIONS'
- **Header**: "Projects & Contributions ({year})" + Dropdown для sort
- **Separator**: Между группами (shadcn `Separator`)
- **Scroll Hint**: Fade gradient + "Scroll for more" если overflow
- **Empty State**: Если нет проектов — "No activity in {year}"

**shadcn Components Used**:

- `Card` (outer container)
- `ScrollArea` (for smooth scrolling)
- `Separator` (between groups)
- `DropdownMenu` (for sorting)

**Implementation Notes**:

- Sort логика: Используй `project-sort.ts` из `lib/utils`
- Render: Map по группам, рендери `CompactProjectRow` для каждого

### 2. CompactProjectRow

**File**: `src/components/level-0/CompactProjectRow.tsx`

**Props**:

```typescript
interface Props {
  project: {
    id: string;
    name: string;
    commits: number;
    stars: number;
    language: string;
    isOwner: boolean;
    description?: string; // For hover preview
  };
  maxCommits: number; // Для расчета ширины бара (normalize)
  onClick: () => void;
  isExpanded: boolean; // Для стиля (e.g., bg-muted)
}
```

**Visual Elements**:

- **Commit Bar**: Vertical (4px width, gradient: owner blue, contrib green). Высота = (commits / maxCommits) \* 100%
- **Name**: Truncated, font-medium, sm size
- **Badge**: 👤 (owner) или 👥 (contrib), variant=default/secondary
- **Metrics**: "commits · ⭐ stars · language" (text-xs, muted-foreground)
- **Hover**: Scale 1.02, shadow-md, 200ms transition
- **Focus**: Ring-2 primary (keyboard nav)

**Hover Preview** (HoverCard):

- Trigger: Entire row
- Content: Name (bold), description (if any), full metrics
- Side: Right (desktop), top (mobile)

**shadcn Components Used**:

- `Badge` (owner/contrib)
- `HoverCard`, `HoverCardContent`, `HoverCardTrigger`

**Accessibility**:

- `aria-label`: "Expand {name} details"
- `aria-expanded`: isExpanded
- Role: "button" (поскольку clickable)

**Implementation Notes**:

- Bar Style: `style={{ height: `${normalized}%` }}`
- Format Numbers: Use Intl.NumberFormat (e.g., 1200 → "1.2K")
- Language Color: Dot перед language (from LANGUAGE_COLORS token)

---

## 🎭 States & Interactions

### States

- **Default**: Neutral bg, no shadow
- **Hover**: bg-muted/50, scale-[1.02], shadow-md
- **Expanded**: bg-muted/30 (указывает, что Level 1 открыт)
- **Loading**: Skeleton для rows (если data fetching)

### Interactions

- **Click**: onProjectClick → Expand to Level 1
- **Hover**: Show preview (300ms delay)
- **Keyboard**: Focusable, Enter/Space для expand
- **Touch**: No hover, но увеличенные targets

**Animation**:

- Hover: CSS transition-all 200ms ease-out
- No expand animation here (это для Level 1)

---

## 📊 Data Requirements

**Project Interface** (from GraphQL/Apollo):

```typescript
interface Project {
  id: string;
  name: string;
  commits: number;
  stars: number;
  language: string;
  isOwner: boolean;
  description?: string;
}
```

- **maxCommits**: Calculate from all projects in list (Math.max(...projects.map(p => p.commits)))

---

## ♿ Accessibility Checklist

- [ ] ARIA labels on rows and badges
- [ ] Keyboard navigation through list
- [ ] Screen reader: "Project {name}, {commits} commits, owned/ contributed"
- [ ] Color contrast: AA compliant (e.g., text on bg)
- [ ] Touch targets: 48px+

---

## 🧪 Testing Checklist

- [ ] Unit: Render row with props, check bar height
- [ ] Integration: Sorting changes order
- [ ] E2E: Click row → expands to Level 1
- [ ] Responsive: Check at 375px, 768px, 1440px
- [ ] Performance: <50ms render for 20 rows

---

## 🔗 Related Docs

- **Quick Ref**: `quick-ref/3-levels-summary.md` (Level 0 section)
- **Responsive**: `quick-ref/responsive-rules.md`
- **Design Tokens**: `quick-ref/design-tokens.md` (colors, spacing)
- **Example Code**: `examples/compact-project-row.tsx`

**For help**: Invoke `ui-design-specialist` with `@shadcn` MCP: "Implement CompactProjectRow with hover-card"

---
