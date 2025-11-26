# PART 3: Responsive Design Strategy

## Breakpoints, Layouts & Mobile-First Approach

---

## 📱 Breakpoint System

### Tailwind CSS Breakpoints (Default)

```typescript
// tailwind.config.ts
export default {
  theme: {
    screens: {
      sm: "640px", // Small tablets
      md: "768px", // Tablets
      lg: "1024px", // Small laptops
      xl: "1280px", // Laptops
      "2xl": "1536px", // Large desktops
    },
  },
};
```

### Our Custom Breakpoints

```typescript
// lib/breakpoints.ts
export const BREAKPOINTS = {
  mobile: 0, // 0 - 767px
  tablet: 768, // 768 - 1023px
  desktop: 1024, // 1024 - 1439px
  large: 1440, // 1440px+
} as const;

// React hook
export function useBreakpoint() {
  const [breakpoint, setBreakpoint] =
    useState<keyof typeof BREAKPOINTS>("mobile");

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width >= BREAKPOINTS.large) setBreakpoint("large");
      else if (width >= BREAKPOINTS.desktop) setBreakpoint("desktop");
      else if (width >= BREAKPOINTS.tablet) setBreakpoint("tablet");
      else setBreakpoint("mobile");
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return breakpoint;
}

// Usage
const breakpoint = useBreakpoint();
const isMobile = breakpoint === "mobile";
const isDesktop = breakpoint === "desktop" || breakpoint === "large";
```

---

## 🖥️ Desktop Layout (≥1440px): 33/67 Split

### Primary Layout Structure

```
┌─────────────────────────────────────────────────────┐
│                    Header / Navigation               │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌──────────────┐  ┌───────────────────────────┐   │
│  │              │  │                           │   │
│  │  Left Panel  │  │     Right Panel          │   │
│  │              │  │                           │   │
│  │   33% width  │  │      67% width           │   │
│  │              │  │                           │   │
│  │  ┌────────┐  │  │  Year Detail:            │   │
│  │  │ 2024   │  │  │  - Summary cards         │   │
│  │  │ Active │  │  │  - Monthly chart         │   │
│  │  └────────┘  │  │  - Language donut        │   │
│  │              │  │                           │   │
│  │  ┌────────┐  │  │  Projects List:          │   │
│  │  │ 2023   │  │  │  ┌─────────────────────┐ │   │
│  │  │        │  │  │  │ Level 0: Compact    │ │   │
│  │  └────────┘  │  │  │ - Project 1         │ │   │
│  │              │  │  │ - Project 2         │ │   │
│  │  ┌────────┐  │  │  │ - Project 3...      │ │   │
│  │  │ 2022   │  │  │  └─────────────────────┘ │   │
│  │  │        │  │  │                           │   │
│  │  └────────┘  │  │  [When expanded:]        │   │
│  │              │  │  ┌─────────────────────┐ │   │
│  │  [More...]   │  │  │ Level 1: Expanded   │ │   │
│  │              │  │  │ - Detailed card     │ │   │
│  │              │  │  └─────────────────────┘ │   │
│  │              │  │                           │   │
│  └──────────────┘  └───────────────────────────┘   │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### CSS Grid Implementation

```css
/* Container — используем fr-единицы вместо процентов */
.main-layout {
  display: grid;
  grid-template-columns: 1fr 2fr; /* ✅ Исправлено: fr вместо % (33%+67%+gap = overflow) */
  gap: 24px;
  padding: 24px;
  max-width: 1920px;
  margin: 0 auto;
}

/* Left panel (Year cards) */
.year-cards-panel {
  overflow-y: auto;
  height: calc(100vh - 120px); /* Subtract header + padding */
  padding-right: 8px; /* Scrollbar spacing */
}

/* Right panel (Year detail) */
.year-detail-panel {
  overflow-y: auto;
  height: calc(100vh - 120px);
  padding-right: 8px;
}

/* Smooth scrolling */
.year-cards-panel,
.year-detail-panel {
  scroll-behavior: smooth;

  /* Cross-browser scrollbar styling */
  /* Firefox */
  scrollbar-width: thin;
  scrollbar-color: hsl(var(--muted-foreground) / 0.3) transparent;

  /* Webkit (Chrome, Safari, Edge) */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: hsl(var(--muted) / 0.3);
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: hsl(var(--muted-foreground) / 0.3);
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: hsl(var(--muted-foreground) / 0.5);
  }
}
```

### React Component Structure

```typescript
// components/MainLayout.tsx
export function MainLayout() {
  const [selectedYear, setSelectedYear] = useState<string>('2024')

  return (
    <div className="main-layout">
      {/* Left: Year Cards */}
      <aside className="year-cards-panel">
        <YearCardsList
          years={years}
          selectedYear={selectedYear}
          onYearSelect={setSelectedYear}
        />
      </aside>

      {/* Right: Year Detail */}
      <main className="year-detail-panel">
        <YearDetailView year={selectedYear} />
      </main>
    </div>
  )
}
```

---

## 💻 Desktop Small & Tablet (768px - 1439px): Fixed Minimum Width

### Layout Strategy

**Problem**: At 1024-1439px, 33/67 split становится слишком узким для левой панели

**Solution**: Fixed minimum width (280px) для левой панели, flexible right panel

```
┌─────────────────────────────────────────────────┐
│               Header / Navigation                │
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌───────┐  ┌──────────────────────────────┐   │
│  │       │  │                              │   │
│  │ Left  │  │  Right (Flexible)            │   │
│  │       │  │                              │   │
│  │ 280px │  │  Fills remaining space       │   │
│  │ min   │  │                              │   │
│  │       │  │  Projects in 2 columns       │   │
│  │       │  │  (if space allows)           │   │
│  │       │  │                              │   │
│  └───────┘  └──────────────────────────────┘   │
│                                                 │
└─────────────────────────────────────────────────┘
```

### CSS Implementation

```css
/* Tablet/Small desktop layout */
@media (min-width: 768px) and (max-width: 1439px) {
  .main-layout {
    grid-template-columns: minmax(280px, 320px) 1fr;
    gap: 20px;
    padding: 20px;
  }

  /* Left panel: Compact year cards */
  .year-card {
    padding: 16px 12px; /* Reduced from 20px 16px */
  }

  .year-card h3 {
    font-size: 18px; /* Reduced from 20px */
  }

  /* Right panel: Projects in 2 columns if width > 900px */
  .projects-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
    gap: 16px;
  }
}
```

### React Responsive Logic

```typescript
function YearDetailView({ year }: { year: string }) {
  const breakpoint = useBreakpoint()
  const isTablet = breakpoint === 'tablet'

  return (
    <div className={cn(
      "year-detail",
      isTablet && "compact-mode"
    )}>
      {/* Summary section: Smaller on tablet */}
      <YearSummary compact={isTablet} />

      {/* Projects: 2-column grid on tablet */}
      <div className={cn(
        "projects-container",
        isTablet && "projects-grid"
      )}>
        <ProjectsList projects={projects} />
      </div>
    </div>
  )
}
```

---

## 📱 Mobile (< 768px): Full-Width Accordion

### ✅ CORRECT BEHAVIOR: All Years Collapsed by Default

#### ✅ Correct Behavior (согласно Part 1):

```typescript
// ALL years collapsed by default — на ВСЕХ платформах!
const [expandedYears, setExpandedYears] = useState<Set<string>>(new Set());
```

**Why this matters**:

- **Performance**: Меньше DOM-элементов при загрузке
- **Cognitive load**: Пользователь фокусируется на интересующем году
- **Consistency**: Одинаковое поведение на desktop и mobile
- **User control**: Пользователь сам решает что раскрыть

#### ➕ Дополнительно: кнопка "Expand All"

```tsx
<Button
  variant="ghost"
  size="sm"
  onClick={() => setExpandedYears(new Set(years.map((y) => y.year)))}
>
  Expand All Years
</Button>
```

### Layout Structure

```
┌───────────────────────────┐
│        Header             │
├───────────────────────────┤
│                           │
│  [Full Width Accordion]   │
│                           │
│  ╔═══════════════════╗    │
│  ║ ▶ 2024  347 comm ║    │ ← COLLAPSED by default
│  ╚═══════════════════╝    │
│                           │
│  ╔═══════════════════╗    │
│  ║ ▶ 2023  234 comm ║    │ ← COLLAPSED by default
│  ╚═══════════════════╝    │
│                           │
│  ╔═══════════════════╗    │
│  ║ ▶ 2022  189 comm ║    │ ← COLLAPSED by default
│  ╚═══════════════════╝    │
│                           │
│  [When user taps 2024:]   │
│  ╔═══════════════════╗    │
│  ║ ▼ 2024           ║    │ ← EXPANDED on click
│  ╠═══════════════════╣    │
│  ║ Summary          ║    │
│  ║ - 347 commits    ║    │
│  ║ - 5 projects     ║    │
│  ║                  ║    │
│  ║ Projects:        ║    │
│  ║ ├─ Project 1     ║    │
│  ║ ├─ Project 2     ║    │
│  ║ └─ Project 3     ║    │
│  ╚═══════════════════╝    │
│                           │
│  [Scroll down for more]   │
│                           │
└───────────────────────────┘
```

### shadcn Accordion Implementation

```typescript
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

function MobileYearsList({ years }: { years: YearData[] }) {
  // ALL years COLLAPSED by default (согласно Part 1)
  const defaultExpanded: string[] = []

  return (
    <Accordion
      type="multiple"
      defaultValue={defaultExpanded}
      className="w-full"
    >
      {years.map(year => (
        <AccordionItem key={year.year} value={year.year}>
          <AccordionTrigger className="text-xl font-semibold">
            <div className="flex justify-between items-center w-full">
              <span>{year.year}</span>
              <Badge variant="secondary">
                {year.totalCommits} commits
              </Badge>
            </div>
          </AccordionTrigger>

          <AccordionContent>
            {/* Year content */}
            <YearSummary data={year} compact />
            <MonthlyChart data={year.monthly} height={200} />
            <Separator className="my-4" />
            <ProjectsList projects={year.projects} />
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}
```

### Mobile-Specific Optimizations

#### 1. Touch Targets (44px minimum)

```css
/* Mobile touch optimization */
@media (max-width: 767px) {
  /* Accordion trigger */
  .accordion-trigger {
    min-height: 56px;
    padding: 16px;
    font-size: 18px;
  }

  /* Compact project row */
  .compact-project-row {
    min-height: 48px;
    padding: 12px 16px;
  }

  /* Buttons */
  button {
    min-height: 44px;
    padding: 12px 16px;
  }
}
```

#### 2. Simplified Metrics

```typescript
function CompactProjectRow({ project, isMobile }: Props) {
  return (
    <div className="compact-project-row">
      <div className="flex items-center justify-between">
        <span className="font-medium">{project.name}</span>
        <Badge>{project.isOwner ? '👤' : '👥'}</Badge>
      </div>

      <div className="flex gap-3 text-xs text-muted-foreground">
        <span>{project.commits} commits</span>
        {/* Hide stars on very small screens */}
        {!isMobile && <span>⭐ {project.stars}</span>}
        <span>{project.language}</span>
      </div>
    </div>
  )
}
```

#### 3. Smaller Charts

```typescript
function MonthlyChart({ data, isMobile }: Props) {
  const height = isMobile ? 200 : 300
  const fontSize = isMobile ? 10 : 12

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data}>
        <XAxis dataKey="month" tick={{ fontSize }} />
        <YAxis tick={{ fontSize }} />
        <Line type="monotone" dataKey="commits" strokeWidth={isMobile ? 2 : 3} />
      </LineChart>
    </ResponsiveContainer>
  )
}
```

#### 4. Sticky Header (for context)

```css
/* Mobile sticky header */
@media (max-width: 767px) {
  .mobile-header {
    position: sticky;
    top: 0;
    z-index: 50;
    background: hsl(var(--background));
    border-bottom: 1px solid hsl(var(--border));
    padding: 12px 16px;
    backdrop-filter: blur(8px);
  }
}
```

---

## 📊 Responsive Component Matrix

| Component          | Desktop (≥1440px)      | Tablet (768-1439px)            | Mobile (<768px)          |
| ------------------ | ---------------------- | ------------------------------ | ------------------------ |
| **Layout**         | 1fr/2fr split          | 280px + 1fr                    | Full width               |
| **Year Cards**     | Sidebar, **collapsed** | Sidebar compact, **collapsed** | Accordion, **collapsed** |
| **Projects List**  | Single column          | 2-column grid                  | Single column            |
| **Compact Row**    | 56px height            | 56px height                    | 48px height              |
| **Level 1 Cards**  | Multiple expand        | Multiple expand                | Multiple expand          |
| **Level 2 Modal**  | Dialog min(800px,90vw) | Dialog (600px)                 | Sheet (full screen)      |
| **Charts**         | 300px height           | 250px height                   | 200px height             |
| **Tab Navigation** | 24px icons, 4 tabs     | 20px icons, 4 tabs             | 18px icons, 4 tabs       |
| **Expand All**     | Button in header       | Button in header               | Floating action          |

---

## 🎨 CSS Media Query Strategy

### Base Styles (Mobile First)

```css
/* Base: Mobile styles (0-767px) */
.container {
  padding: 16px;
}

.heading {
  font-size: 20px;
}

.card {
  padding: 16px;
}
```

### Progressive Enhancement

```css
/* Tablet: 768px+ */
@media (min-width: 768px) {
  .container {
    padding: 20px;
  }

  .heading {
    font-size: 24px;
  }

  .card {
    padding: 20px;
  }

  /* Enable 2-column layout */
  .projects-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Desktop: 1024px+ */
@media (min-width: 1024px) {
  .container {
    padding: 24px;
    max-width: 1920px;
  }

  /* Enable split layout */
  .main-layout {
    grid-template-columns: minmax(280px, 320px) 1fr;
  }
}

/* Large Desktop: 1440px+ */
@media (min-width: 1440px) {
  /* Full 33/67 split */
  .main-layout {
    grid-template-columns: 33% 67%;
  }

  .heading {
    font-size: 28px;
  }
}

/* Extra Large: 1920px+ */
@media (min-width: 1920px) {
  .container {
    max-width: 1920px;
    margin: 0 auto;
  }
}
```

---

## 🔄 Dynamic Layout Switching

### React Hook for Layout Mode

```typescript
// hooks/useLayoutMode.ts
type LayoutMode = 'mobile' | 'tablet' | 'desktop' | 'large'

export function useLayoutMode(): LayoutMode {
  const [mode, setMode] = useState<LayoutMode>('desktop')

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      if (width < 768) setMode('mobile')
      else if (width < 1024) setMode('tablet')
      else if (width < 1440) setMode('desktop')
      else setMode('large')
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return mode
}

// Usage
function App() {
  const layout = useLayoutMode()

  return (
    <div className={cn(
      "app-container",
      layout === 'mobile' && "mobile-layout",
      layout === 'tablet' && "tablet-layout",
      layout === 'desktop' && "desktop-layout",
      layout === 'large' && "large-layout"
    )}>
      {layout === 'mobile' ? (
        <MobileLayout />
      ) : (
        <DesktopLayout splitRatio={layout === 'large' ? [33, 67] : [28, 72]} />
      )}
    </div>
  )
}
```

---

## 📐 Container Width Strategy

```css
/* Max widths for different breakpoints */
.container {
  width: 100%;
  margin: 0 auto;
  padding: 0 16px;
}

@media (min-width: 768px) {
  .container {
    padding: 0 24px;
  }
}

@media (min-width: 1024px) {
  .container {
    max-width: 1280px;
    padding: 0 32px;
  }
}

@media (min-width: 1440px) {
  .container {
    max-width: 1440px;
  }
}

@media (min-width: 1920px) {
  .container {
    max-width: 1920px;
  }
}
```

---

## ♿ Accessibility Across Breakpoints

### Focus Indicators

```css
/* Visible focus for keyboard navigation */
*:focus-visible {
  outline: 2px solid hsl(var(--primary));
  outline-offset: 2px;
}

/* Larger focus indicators on mobile */
@media (max-width: 767px) {
  *:focus-visible {
    outline-width: 3px;
  }
}
```

### Skip Links

```typescript
function SkipLinks() {
  const layout = useLayoutMode()

  return (
    <div className="skip-links">
      <a href="#main-content">Skip to main content</a>
      {layout !== 'mobile' && (
        <a href="#year-navigation">Skip to year navigation</a>
      )}
    </div>
  )
}
```

---

## 🎯 Responsive Testing Checklist

### Breakpoint Tests

- [ ] 375px (iPhone SE)
- [ ] 414px (iPhone Pro Max)
- [ ] 768px (iPad Portrait)
- [ ] 1024px (iPad Landscape)
- [ ] 1280px (Laptop)
- [ ] 1440px (Desktop)
- [ ] 1920px (Large Desktop)

### Feature Tests

- [ ] All years COLLAPSED on all platforms by default
- [ ] "Expand All" button works correctly
- [ ] Accordion expands/collapses smoothly
- [ ] Touch targets minimum 44px
- [ ] Charts resize appropriately
- [ ] Modal becomes Sheet on mobile
- [ ] Level 1 cards: multiple expand on ALL platforms
- [ ] Scrolling smooth on all devices
- [ ] No horizontal scrolling

### Performance Tests

- [ ] No layout shifts during resize
- [ ] Smooth transitions between breakpoints
- [ ] Images/charts load appropriately sized
- [ ] No janky scrolling on mobile

---

**Next**: Read [PART 4: Technology Stack](part-4) for tooling details.
