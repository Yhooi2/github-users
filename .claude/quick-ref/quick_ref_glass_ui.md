# shadcn-glass-ui - Quick Reference (v2.6.2)

> **Версия**: 2.6.2
> **Дата обновления**: 21 декабря 2025
> **Совместимость**: React 19 + TypeScript 5.x + Tailwind 4
> **Context7 ID**: `/yhooi2/shadcn-glass-ui-library`
> **Всего компонентов**: 67+

---

## Migration Status

### Stage 1: Foundation - COMPLETED

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
| Progress      | Progress      | 2.4.3  | ✅     |

### Stage 2: Remaining UI - COMPLETED

| Компонент    | Glass UI       | Версия | Статус |
| ------------ | -------------- | ------ | ------ |
| Checkbox     | Checkbox       | 2.5.0  | ✅     |
| Input        | Input          | 2.5.0  | ✅     |
| Switch       | Switch         | 2.5.0  | ✅     |
| Skeleton     | Skeleton       | 2.5.0  | ✅     |
| Select       | Select\*       | 2.5.0  | ✅     |
| DropdownMenu | DropdownMenu\* | 2.5.0  | ✅     |

### Stage 3: Timeline - COMPLETED

| Компонент    | Glass UI       | Версия | Статус |
| ------------ | -------------- | ------ | ------ |
| YearCard     | YearCardGlass  | 2.5.4  | ✅     |
| MiniActivity | SparklineGlass | 2.6.1  | ✅     |

**Note**: SparklineGlass уже используется в YearCardGlass.wrapper. MiniActivityChart удалён (не использовался).

### Stage 4: Assessment - COMPLETED

| Компонент  | Glass UI        | Версия | Статус |
| ---------- | --------------- | ------ | ------ |
| MetricCard | MetricCardGlass | 2.6.1  | ✅     |

**Note**: MetricCardGlass.wrapper создан с поддержкой variant (success/warning/destructive/default). Старый MetricCard.tsx удалён.

### Ожидают миграции (Stage 5+)

| Компонент      | Glass UI            | Приоритет |
| -------------- | ------------------- | --------- |
| RepositoryCard | RepositoryCardGlass | Medium    |

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

## Что нового

```
v2.6.1:
✅ Документация YearCardGlass (docs/components/YEAR_CARD_GLASS.md)
✅ Документация CardGlass, SheetGlass, StepperGlass, PopoverGlass (+2155 строк)
✅ Документация ModalGlass, TabsGlass, AlertGlass
✅ docs/components/README.md - навигация по компонентам

v2.5.4:
✅ YearCardGlass - compound API для timeline (issue #15)
✅ MetricCardGlass - compound API для метрик
✅ SparklineGlass - sparkline charts
✅ buttonVariants export (issue #14)

v2.5.1:
✅ Checkbox/Switch className prop passthrough

v2.5.0:
✅ Checkbox, Input, Switch, Skeleton - shadcn/ui aliases
✅ Select - full compound API (10 components)
✅ DropdownMenu - full compound API (15 components)

v2.4.x:
✅ Dialog, Sheet, Tabs, Tooltip, Progress - shadcn/ui compatible APIs
```

---

## Re-export Pattern (используется в проекте)

```tsx
// Simple components
// src/components/ui/checkbox.tsx
export { Checkbox } from "shadcn-glass-ui";

// src/components/ui/input.tsx
export { Input } from "shadcn-glass-ui";

// src/components/ui/switch.tsx
export { Switch } from "shadcn-glass-ui";

// src/components/ui/skeleton.tsx
export { Skeleton } from "shadcn-glass-ui";

// Compound components
// src/components/ui/select.tsx
export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "shadcn-glass-ui";

// src/components/ui/dropdown-menu.tsx
export {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "shadcn-glass-ui";
```

---

## Known Issues

| Issue                                                              | Component                 | Status |
| ------------------------------------------------------------------ | ------------------------- | ------ |
| [#13](https://github.com/Yhooi2/shadcn-glass-ui-library/issues/13) | Checkbox/Switch className | Open   |

---

## Полный список компонентов (67+)

### Primitives (3)

- `FormFieldWrapper` - Form field structure
- `InteractiveCard` - Hover animations
- `TouchTarget` - 44x44px touch area

### Core UI (24+)

- `ButtonGlass` / `Button` - 6 variants, loading, icon
- `InputGlass` / `Input` - shadcn compatible
- `CheckboxGlass` / `Checkbox` - glow, indeterminate
- `Switch` - shadcn compatible toggle
- `SliderGlass` - single/range
- `ModalGlass` - compound API, 3 sizes
- `Dialog*` - full shadcn/ui API
- `Sheet*` - full shadcn/ui API with side prop
- `TabsGlass` / `Tabs*` - shadcn/ui compatible
- `DropdownGlass` - submenu support
- `DropdownMenu*` - full shadcn/ui API (15 components)
- `TooltipGlass` / `Tooltip*` - 4 sides, shadcn API
- `AlertGlass` - 4 variants
- `NotificationGlass` - toast style
- `BadgeGlass` - 7 variants
- `AvatarGlass` - status indicator
- `GlassCard` - 3 intensities
- `CardGlass*` - compound API
- `ProgressGlass` / `Progress` - gradient variants
- `CircularProgressGlass` - circular
- `Skeleton` / `SkeletonGlass` - shadcn compatible
- `ComboBoxGlass` - searchable, multi
- `Select*` - full shadcn/ui API (10 components)
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

### Stage 1: Foundation - COMPLETED ✅

### Stage 2: Remaining UI - COMPLETED ✅

- ✅ 17 base components migrated
- ✅ All tests passing (1902)

### Stage 3: Timeline - COMPLETED ✅

- ✅ YearCard → YearCardGlass
- ✅ MiniActivityChart → SparklineGlass (deleted, not used)

### Stage 4: Assessment - COMPLETED ✅

- ✅ MetricCard → MetricCardGlass
- MetricCategoryCard → GlassCard + grid (TODO)

### Stage 5: User & Projects (Next)

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

**Stage 1 + Stage 2 Migration: COMPLETE**
