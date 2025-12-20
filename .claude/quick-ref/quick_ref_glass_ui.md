# shadcn-glass-ui - Quick Reference (v2.4.3)

> **Версия**: 2.4.3
> **Дата обновления**: 21 декабря 2025
> **Совместимость**: React 19 + TypeScript 5.x + Tailwind 4
> **Context7 ID**: `/yhooi2/shadcn-glass-ui-library`
> **Всего компонентов**: 67+

---

## Stage 1 Migration Status: COMPLETED

### Мигрированные компоненты (src/components/ui/)

| Компонент     | Glass UI      | Версия | Статус |
| ------------- | ------------- | ------ | ------ |
| ThemeProvider | ThemeProvider | 2.3.0  | ✅     |
| Button        | ButtonGlass   | 2.3.0  | ✅     |
| Card          | CardGlass     | 2.3.0  | ✅     |
| Badge         | BadgeGlass    | 2.3.2  | ✅     |
| Alert         | AlertGlass    | 2.3.2  | ✅     |
| Avatar        | AvatarGlass   | 2.3.2  | ✅     |
| Dialog        | Dialog        | 2.4.0  | ✅     |
| Sheet         | Sheet         | 2.4.0  | ✅     |
| Tabs          | Tabs          | 2.4.0  | ✅     |
| Tooltip       | Tooltip       | 2.4.1  | ✅     |
| Progress      | Progress      | 2.4.2  | ✅     |

### Ожидают миграции (Stage 2+)

| Компонент    | Glass UI          | Приоритет |
| ------------ | ----------------- | --------- |
| Checkbox     | CheckboxGlass     | Medium    |
| Input        | InputGlass        | Medium    |
| DropdownMenu | DropdownMenuGlass | Medium    |
| Skeleton     | SkeletonGlass     | Low       |
| Select       | ComboBoxGlass     | Low       |
| Switch       | ToggleGlass       | Low       |

---

## Установка

```bash
npm install shadcn-glass-ui@latest
```

```tsx
// src/index.css
@import "shadcn-glass-ui/styles.css";

// src/main.tsx
import { ThemeProvider } from 'shadcn-glass-ui';

<ThemeProvider defaultTheme="glass">
  <App />
</ThemeProvider>
```

---

## Что нового в v2.4.x

```
v2.4.3:
✅ Progress - aria-label prop passthrough fixed

v2.4.2:
✅ Progress - shadcn/ui compatible alias (Progress)

v2.4.1:
✅ Tooltip - shadcn/ui compatible aliases (Tooltip, TooltipTrigger, TooltipContent, TooltipProvider)

v2.4.0:
✅ Dialog - full shadcn/ui API (Dialog, DialogContent, DialogHeader, etc.)
✅ Sheet - full shadcn/ui API with side prop
```

---

## Re-export Pattern (используется в проекте)

```tsx
// src/components/ui/button.tsx
export {
  ButtonGlass as Button,
  type ButtonGlassProps as ButtonProps,
} from "shadcn-glass-ui";
export { buttonGlassVariants as buttonVariants } from "shadcn-glass-ui";

// src/components/ui/dialog.tsx
export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from "shadcn-glass-ui";

// src/components/ui/progress.tsx
export { Progress } from "shadcn-glass-ui";
```

---

## Полный список компонентов (67+)

### Primitives (3)

- `FormFieldWrapper` - Form field structure
- `InteractiveCard` - Hover animations
- `TouchTarget` - 44x44px touch area

### Core UI (24+)

- `ButtonGlass` / `Button` - 6 variants, loading, icon
- `InputGlass` - label, error, success
- `CheckboxGlass` / `Checkbox` - glow, indeterminate
- `ToggleGlass` - switch variant
- `SliderGlass` - single/range
- `ModalGlass` - compound API, 3 sizes
- `Dialog*` - full shadcn/ui API
- `Sheet*` - full shadcn/ui API with side prop
- `TabsGlass` / `Tabs*` - shadcn/ui compatible
- `DropdownGlass` - submenu support
- `DropdownMenuGlass*` - checkbox items
- `TooltipGlass` / `Tooltip*` - 4 sides, shadcn API
- `AlertGlass` - 4 variants
- `NotificationGlass` - toast style
- `BadgeGlass` - 7 variants
- `AvatarGlass` - status indicator
- `GlassCard` - 3 intensities
- `CardGlass*` - compound API
- `ProgressGlass` / `Progress` - gradient variants
- `CircularProgressGlass` - circular
- `SkeletonGlass` - 3 variants
- `ComboBoxGlass` - searchable, multi
- `PopoverGlass` - trigger/content
- `SidebarGlass` - shadcn/ui compatible
- `StepperGlass` - wizard patterns

### Atomic (7)

- `IconButtonGlass` - icon-only
- `ThemeToggleGlass` - 3 themes
- `SearchBoxGlass` - search input
- `SortDropdownGlass` - sort options
- `StatItemGlass` - label/value/trend
- `ExpandableHeaderGlass` - collapsible
- `InsightCardGlass` - 7 semantic variants

### Specialized (9)

- `StatusIndicatorGlass` - status dot
- `SegmentedControlGlass` - button group
- `RainbowProgressGlass` - gradient
- `LanguageBarGlass` - proficiency
- `ProfileAvatarGlass` - large avatar
- `FlagAlertGlass` - warning/danger
- `BaseProgressGlass` - base component
- `SparklineGlass` - time series
- `CircularMetricGlass` - circular metric

### Composite (14)

- `MetricCardGlass` - metric display
- `YearCardGlass` - timeline card
- `AICardGlass` - AI analysis
- `RepositoryCardGlass` - repo card
- `TrustScoreDisplayGlass` - score
- `CareerStatsHeaderGlass` - stats header
- `ContributionMetricsGlass` - contributions
- `MetricsGridGlass` - grid layout
- `RepositoryHeaderGlass` - repo header
- `RepositoryMetadataGlass` - metadata
- `UserInfoGlass` - user card
- `UserStatsLineGlass` - horizontal stats
- `SplitLayoutGlass` - master-detail
- `CareerStatsGlass` - career section

### Sections (7)

- `HeaderNavGlass` - navigation
- `ProfileHeaderGlass` - profile
- `FlagsSectionGlass` - expandable flags
- `TrustScoreCardGlass` - trust score
- `ProjectsListGlass` - projects list
- `HeaderBrandingGlass` - branded header
- `SidebarMenuGlass` - sidebar menu

---

## Migration Priority (Updated)

### Stage 1: Foundation - COMPLETED

- ✅ ThemeProvider setup
- ✅ Base UI: Button, Card, Badge, Alert, Avatar
- ✅ Dialog, Sheet, Tabs, Tooltip, Progress

### Stage 2: Remaining UI (Next)

- Checkbox, Input, DropdownMenu
- Skeleton, Select, Switch

### Stage 3: Timeline

- YearCard → YearCardGlass
- MiniActivityChart → SparklineGlass
- DesktopTimelineLayout → SplitLayoutGlass

### Stage 4: Assessment

- MetricCard → MetricCardGlass
- MetricCategoryCard → GlassCard + grid

### Stage 5: User & Projects

- UserHeader → ProfileHeaderGlass
- RepositoryCards → RepositoryCardGlass

### Stage 6: AI Integration

- Create AI-specific components
- Integration and testing

---

## Theming

```tsx
// 3 темы: glass (dark), light, aurora
<ThemeProvider defaultTheme="glass">
  <App />
</ThemeProvider>;

// Использование хука
const { theme, setTheme, THEMES } = useTheme();
setTheme("aurora");
```

---

## Links

- [NPM](https://www.npmjs.com/package/shadcn-glass-ui)
- [GitHub](https://github.com/Yhooi2/shadcn-glass-ui-library)
- [Storybook](https://yhooi2.github.io/shadcn-glass-ui-library)

---

## Compatibility

| Технология   | Библиотека     | Проект | Status |
| ------------ | -------------- | ------ | ------ |
| React        | 18.0+ or 19.0+ | 19.2.0 | ✅     |
| TypeScript   | 5.x            | 5.8.3  | ✅     |
| Tailwind CSS | 4.0+           | 4.1.12 | ✅     |
| Vite         | 5.0+           | 7.1.2  | ✅     |

**Stage 1 Migration: COMPLETE**
