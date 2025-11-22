# Level 1: Expandable Card Specification

> **Purpose**: Inline expandable cards for comparing key project details  
> **Read this when**: Implementing or modifying Level 1 components  
> **For quick overview**: See `quick-ref/3-levels-summary.md`  
> **For code example**: See `examples/expandable-card.tsx`

---

## 🎯 Overview

**Level 1** предоставляет средний уровень детализации: при клике на строку Level 0 (CompactProjectRow) ряд расширяется в карточку с ключевыми метриками, позволяя сравнивать 2-3 проекта бок о бок без потери контекста. Это фаза оценки — пользователь решает, стоит ли углубляться в Level 2.

**Key Metrics**:

- Время оценки: 15-30 секунд
- Инфо-плотность: Средняя (ключевые детали для сравнения)
- Интерактивность: Expand/collapse, buttons для Level 2 или GitHub

**Constraints**:

- Multiple expansion на desktop/tablet (Set<string> для state)
- Accordion mode на mobile (только одна карточка открыта)
- Анимация: Framer Motion для smooth `height: auto`
- Max expanded height: ~500px (чтобы не нарушать скролл)

---

## 📐 Layout & Dimensions

### Desktop (≥1440px)

- **Card Width**: Full container width (right panel 67%)
- **Collapsed Height**: 56px (same as Level 0)
- **Expanded Height**: Auto (content-driven, max 500px)
- **Padding**: 16px (expanded state)
- **Sections Gap**: 16px

### Tablet (768-1439px)

- **Card Width**: Flexible (min 280px left panel)
- **Collapsed Height**: 56px
- **Expanded Height**: Auto, но с учетом 2-column if space allows
- **Simplified Charts**: Smaller bar chart (height 24px)

### Mobile (<768px)

- **Card Width**: Full-width
- **Collapsed Height**: 48px
- **Expanded Height**: Auto (accordion: only one open)
- **Touch Targets**: 48px+ для buttons
- **Sections**: Stacked vertically, reduced font sizes

**CSS Example**:

```css
.expandable-card {
  transition: all 300ms ease;
  border-radius: var(--radius);
  overflow: hidden; /* Для анимации */
}
```

---

## 🧩 Components

### 1. ExpandableProjectCard

**File**: `src/components/level-1/ExpandableProjectCard.tsx`

**Props**:

```typescript
interface Props {
  project: Project; // Full project data
  isExpanded: boolean;
  onToggle: () => void;
  onOpenAnalytics: () => void; // Переход к Level 2
  maxCommits: number; // Для нормализации
}
```

**Features**:

- **Header**: Same as Level 0 row (bar, name, badge, metrics)
- **Expanded Content**: AnimatePresence для mount/unmount
- **Actions**: Buttons "View Analytics" (to Level 2), "GitHub" (external link), "Collapse"
- **Animation**: Framer Motion (height: 0 → auto, opacity 0 → 1)

**shadcn Components Used**:

- `Card` (base)
- `Accordion` (для mobile mode)
- `Button` (actions)
- `Separator` (между sections)

**Implementation Notes**:

- State: Use Set для multiple expand (desktop), single для mobile
- Animation Variants: initial={height:0, opacity:0}, animate={height:'auto', opacity:1}, transition={duration:0.3}
- Conditional: Если mobile, используй accordion logic (close others)

### 2. ExpandedCardContent

**File**: `src/components/level-1/ExpandedCardContent.tsx`

**Props**:

```typescript
interface Props {
  project: Project;
}
```

**Features**:

- **4 Sections**:
  1. Header/Description: Short desc + social stats (stars, forks)
  2. Your Contribution: Commits % (e.g., 18% of 1923), PRs merged, reviews, active period
  3. Tech Stack: Horizontal bar chart (languages %)
  4. Team: Contributor count, top collaborators (avatars)
- **Chart**: Recharts BarChart (lazy load)
- **Loading**: Skeleton для sections

**shadcn Components Used**:

- `Progress` (для % bars)
- `Avatar` (collaborators)
- `Tooltip` (hover details)

**Implementation Notes**:

- Bar Chart: ResponsiveContainer, horizontal layout
- Format: Use date-fns для periods, Intl для numbers
- Colors: From design tokens (language colors)

---

## 🎭 States & Interactions

### States

- **Collapsed**: Level 0 view
- **Expanding**: Animation in progress
- **Expanded**: Full content visible
- **Loading**: Skeleton in expanded area

### Interactions

- **Toggle Click**: onToggle → expand/collapse
- **Analytics Button**: onOpenAnalytics → open Level 2 modal
- **GitHub Link**: External <a> with target="\_blank"
- **Keyboard**: Enter для toggle, Tab для navigation внутри
- **Touch**: Swipe-friendly (no drag interfere)

**Animation**:

- Framer Motion: ease [0.4, 0, 0.2, 1] для natural feel
- Duration: 300ms (medium from tokens)

---

## 📊 Data Requirements

**Project Interface** (extended from Level 0):

```typescript
interface Project {
  // From Level 0...
  description: string;
  forks: number;
  contribution: {
    commitsPercent: number;
    totalCommits: number;
    prsMerged: number;
    reviews: number;
    activePeriod: string; // e.g., "Jan 2024 - Nov 2025"
  };
  techStack: { lang: string; percent: number }[]; // For bar chart
  team: {
    count: number;
    top: { name: string; avatar: string }[]; // Top 3-5
  };
}
```

- **Data Fetch**: Lazy on expand (useEffect или suspense)

---

## ♿ Accessibility Checklist

- [ ] ARIA: aria-expanded, aria-controls для content
- [ ] Keyboard: Focus trap в expanded (опционально)
- [ ] Screen reader: "Expanded: Your contribution section..."
- [ ] Contrast: Charts colors AA compliant
- [ ] Alt text: Для avatars и charts

---

## 🧪 Testing Checklist

- [ ] Unit: Toggle expand, check animation props
- [ ] Integration: Multiple expand on desktop, single on mobile
- [ ] E2E: Click row → expand, click analytics → open modal
- [ ] Responsive: Test accordion on 375px
- [ ] Performance: <300ms expand time, 60fps animation

---

## 🔗 Related Docs

- **Quick Ref**: `quick-ref/3-levels-summary.md` (Level 1 section)
- **Responsive**: `quick-ref/responsive-rules.md`
- **Design Tokens**: `quick-ref/design-tokens.md` (animations, spacing)
- **Example Code**: `examples/expandable-card.tsx`

**For help**: Invoke `ui-design-specialist` with `@shadcn` MCP: "Implement ExpandableProjectCard with Framer Motion"

---
