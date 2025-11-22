# Level 2: Modal with Tabs Specification

> **Purpose**: Full analytics modal for deep project analysis  
> **Read this when**: Implementing or modifying Level 2 components  
> **For quick overview**: See `quick-ref/3-levels-summary.md`  
> **For code example**: See `examples/modal-with-tabs.tsx`

---

## 🎯 Overview

**Level 2** — финальный уровень: модальное окно с горизонтальными табами для полного анализа одного проекта. Открывается из Level 1 ("View Analytics"). Фокус на данных: charts, metrics, breakdowns. Это фаза анализа для заинтересованных пользователей.

**Key Metrics**:

- Время анализа: 45+ секунд
- Инфо-плотность: Низкая (фокус на одном проекте)
- Интерактивность: Tab navigation, export PDF, close

**Constraints**:

- MAX 4 tabs: Overview, Timeline, Code, Team
- Lazy loading: Content таба загружается on-select
- Modal type: Dialog (desktop), Sheet bottom (mobile)
- Backdrop: Blur on desktop

---

## 📐 Layout & Dimensions

### Desktop (≥1440px)

- **Modal Width**: min(800px, 90vw)
- **Height**: 85vh (scrollable content)
- **Tabs**: Horizontal, top, icon + label (24px icons)
- **Content Padding**: 24px
- **Charts Height**: 300px min

### Tablet (768-1439px)

- **Modal Width**: max-w-[600px]
- **Height**: 85vh
- **Tabs**: Smaller icons (20px), labels 10px
- **Charts**: Responsive, height 250px

### Mobile (<768px)

- **Sheet**: From bottom, h-[90vh], full-width
- **Tabs**: grid-cols-4, icons 20px, labels 9px
- **Content**: Scrollable, reduced padding 16px
- **Charts**: Full-width, height 200px

**CSS Example**:

```css
.modal-content {
  max-height: 85vh;
  overflow-y: auto;
  border-radius: var(--radius);
}
```

---

## 🧩 Components

### 1. ProjectAnalyticsModal

**File**: `src/components/level-2/ProjectAnalyticsModal.tsx`

**Props**:

```typescript
interface Props {
  project: Project;
  isOpen: boolean;
  onClose: () => void;
}
```

**Features**:

- **Wrapper**: Dialog (desktop) или Sheet (mobile)
- **Header**: Project name + close button
- **Tabs**: HorizontalTabsNav (4 tabs)
- **Content**: TabsContent с lazy load
- **Footer**: Export PDF button
- **Animation**: Framer Motion (scale in, fade)

**shadcn Components Used**:

- `Dialog`, `DialogContent`, `Sheet`, `SheetContent`
- `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent`
- `Button` (export, close)

**Implementation Notes**:

- Responsive: Use useResponsive() для Dialog/Sheet
- Animation: AnimatePresence, variants (hidden: scale 0.95 opacity 0, visible: scale 1 opacity 1)
- Export: jsPDF + html2canvas (lazy import)

### 2. HorizontalTabsNav

**File**: `src/components/level-2/HorizontalTabsNav.tsx`

**Props**:

```typescript
interface Props {
  activeTab: string;
  onTabChange: (tab: string) => void;
}
```

**Features**:

- **Tabs**: Overview (📊), Timeline (📈), Code (💻), Team (👥)
- **Icons**: 24px (desktop), smaller on mobile
- **Labels**: Uppercase, font-xs

**shadcn Components Used**:

- `TabsList`, `TabsTrigger`

**Implementation Notes**:

- Grid: grid-cols-4 для равного распределения
- Active: underline или variant="default"

### 3. Tab Components (OverviewTab, TimelineTab, etc.)

**Files**: `src/components/level-2/{TabName}Tab.tsx`

**Props** (общий):

```typescript
interface Props {
  project: Project;
  data: TabData; // Lazy fetched
}
```

**Features per Tab**:

- **Overview**: Metrics table (commits, PRs, etc.), activity breakdown
- **Timeline**: LineChart (commits over time), heatmap
- **Code**: PieChart (languages), impact score progress
- **Team**: Table (PRs, collaborators), CI/CD stats
- **Loading**: Skeleton per tab
- **Charts**: Recharts (ResponsiveContainer)

**shadcn Components Used**:

- `Table`, `Progress`, `Skeleton`
- `ScrollArea` для long content

**Implementation Notes**:

- Lazy Data: Fetch on tab select, store in state
- Charts: Lazy import Recharts components
- Format: date-fns, Intl.NumberFormat

---

## 🎭 States & Interactions

### States

- **Open/Closed**: Controlled by isOpen
- **Loading Tab**: Skeleton while fetching
- **Error**: Show toast or retry button

### Interactions

- **Tab Switch**: onTabChange → lazy load if not loaded
- **Export PDF**: Capture content, download
- **Close**: onClose, Escape key
- **Keyboard**: Tab navigation, arrows for tabs
- **Touch**: Swipe for charts if interactive

**Animation**:

- Modal Open: 200ms fade/scale
- Tab Switch: 150ms fade for content

---

## 📊 Data Requirements

**Extended Project Interface**:

```typescript
interface Project {
  // From previous levels...
  overview: { metrics: Record<string, number> };
  timeline: { monthly: { month: string; commits: number }[] };
  code: { languages: { name: string; percent: number }[]; impact: number };
  team: {
    prs: number;
    collaborators: Array<{ name: string; contributions: number }>;
  };
}
```

- **Fetch**: Apollo query per tab, cache results

---

## ♿ Accessibility Checklist

- [ ] ARIA: role="tablist", aria-selected
- [ ] Keyboard: Focus on tabs, Enter to select
- [ ] Screen reader: "Tab {name}, selected"
- [ ] Charts: aria-label, alt text for images
- [ ] Contrast: All elements AA

---

## 🧪 Testing Checklist

- [ ] Unit: Tab switch, check lazy load
- [ ] Integration: Data fetch on tab
- [ ] E2E: Open modal, navigate tabs, export
- [ ] Responsive: Sheet on mobile, Dialog on desktop
- [ ] Performance: <200ms tab switch, 60fps

---

## 🔗 Related Docs

- **Quick Ref**: `quick-ref/3-levels-summary.md` (Level 2 section)
- **Responsive**: `quick-ref/responsive-rules.md`
- **Design Tokens**: `quick-ref/design-tokens.md` (charts, animations)
- **Example Code**: `examples/modal-with-tabs.tsx`

**For help**: Invoke `ui-design-specialist` with `@shadcn` MCP: "Implement ProjectAnalyticsModal with tabs"

---
