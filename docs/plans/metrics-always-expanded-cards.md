# План: Always Expanded Cards для метрик

## Резюме решений

| Вопрос | Решение |
|--------|---------|
| Группировка | 3 категории: OUTPUT, QUALITY, TRUST |
| Скиллы/Языки | Отдельный блок над метриками |
| Mobile | Accordion (все свернуто по умолчанию) |

---

## Архитектура

### Структура на Desktop (>=768px)
```
┌─ Top Skills ─────────────────────────────────────────────┐
│ 🟦 TypeScript 68% │ 🟨 JavaScript 15% │ 🟪 CSS 10% │ ... │
└──────────────────────────────────────────────────────────┘

┌─────────────────┬─────────────────┬─────────────────┐
│ OUTPUT    75%   │ QUALITY   80%   │ TRUST     36%   │
│ 📊 Productivity │ ✨ Standards    │ 🛡️ Verification │
│                 │                 │                 │
│ ⚡ Activity 90% │ ✨ Quality  75% │ 🛡️ Auth'ty  40% │
│ 🎯 Impact   60% │ 📅 Consist. 85% │ 👥 Collab.  32% │
└─────────────────┴─────────────────┴─────────────────┘
```

### Структура на Mobile (<768px)
```
┌─ Top Skills ─────────────────┐
│ 🟦 TypeScript 68%            │
│ 🟨 JavaScript 15%            │
│ 🟪 CSS 10%                   │
└──────────────────────────────┘

┌─ OUTPUT ──────────────── ▼ ──┐  <- Свернуто
└──────────────────────────────┘
┌─ QUALITY ─────────────── ▼ ──┐  <- Свернуто
└──────────────────────────────┘
┌─ TRUST ───────────────── ▼ ──┐  <- Свернуто
└──────────────────────────────┘

При раскрытии:
┌─ OUTPUT ──────────────── ▲ ──┐
│ ⚡ Activity         90%  [?] │
│ ████████████████░░░░░░░░░░░░ │
│ 🎯 Impact           60%  [?] │
│ ████████████░░░░░░░░░░░░░░░░ │
└──────────────────────────────┘
```

---

## Категории метрик

| Категория | Иконка | Описание | Метрики |
|-----------|--------|----------|---------|
| OUTPUT | Activity | Productivity and project reach | Activity + Impact |
| QUALITY | Sparkles | Code standards and work habits | Quality + Consistency |
| TRUST | Shield | Profile authenticity and teamwork | Authenticity + Collaboration |

---

## Файлы для создания/изменения

### Новые файлы (8)

| Файл | Описание |
|------|----------|
| `src/lib/metrics/categories.ts` | Конфигурация категорий и типы |
| `src/components/assessment/MetricRowCompact.tsx` | Компактная строка метрики с progress bar |
| `src/components/assessment/MetricRowCompact.stories.tsx` | Stories |
| `src/components/assessment/MetricRowCompact.test.tsx` | Тесты |
| `src/components/assessment/MetricCategoryCard.tsx` | Карточка категории (фикс. высота 220px) |
| `src/components/assessment/MetricCategoryCard.stories.tsx` | Stories |
| `src/components/assessment/MetricCategoryCard.test.tsx` | Тесты |
| `src/components/assessment/UserSkills.tsx` | Блок топ-языков |
| `src/components/assessment/UserSkills.stories.tsx` | Stories |
| `src/components/assessment/UserSkills.test.tsx` | Тесты |
| `src/components/assessment/MetricAssessmentGrid.tsx` | Главный контейнер (заменяет QuickAssessment) |
| `src/components/assessment/MetricAssessmentGrid.stories.tsx` | Stories |
| `src/components/assessment/MetricAssessmentGrid.test.tsx` | Тесты |

### Изменяемые файлы (4)

| Файл | Изменения |
|------|-----------|
| `src/lib/metrics/index.ts` | Экспорт consistency, collaboration |
| `src/components/assessment/MetricExplanationModal.tsx` | Добавить consistency, collaboration в EXPLANATIONS |
| `src/components/assessment/index.ts` | Экспорт новых компонентов |
| Родительский компонент (где используется QuickAssessment) | Заменить на MetricAssessmentGrid |

---

## Детальная спецификация компонентов

### 1. MetricRowCompact

```typescript
interface MetricRowCompactProps {
  title: string;
  score: number;
  level: string;
  icon: LucideIcon;
  onInfoClick?: () => void;
  loading?: boolean;
}
```

**Визуал:**
```
┌─────────────────────────────────────────────┐
│ ⚡ Activity            85%  ████████░░  [?] │
└─────────────────────────────────────────────┘
```

**Особенности:**
- Иконка 18px слева
- Название + процент
- Progress bar с цветом по score (design-tokens)
- Кнопка info (HelpCircle) справа
- Клик на [?] → onInfoClick()

### 2. MetricCategoryCard

```typescript
interface MetricCategoryCardProps {
  category: "OUTPUT" | "QUALITY" | "TRUST";
  categoryScore: number;
  metrics: {
    first: { key: string; score: number; level: string; breakdown: Record<string, number> };
    second: { key: string; score: number; level: string; breakdown: Record<string, number> };
  };
  loading?: boolean;
  onExplainMetric?: (metricKey: string) => void;
  // Mobile specific
  isExpanded?: boolean;
  onToggle?: () => void;
}
```

**Desktop (фикс. высота 220px):**
```
┌─────────────────────────────────────────┐
│ OUTPUT                      75%         │
│ Productivity and project reach          │
│─────────────────────────────────────────│
│ ⚡ Activity      85%  ████████░░  [?]  │
│ 🎯 Impact        65%  ██████░░░░  [?]  │
└─────────────────────────────────────────┘
```

**Mobile (accordion):**
- Свернуто: только заголовок + categoryScore + chevron
- Раскрыто: полное содержимое

### 3. UserSkills

```typescript
interface UserSkillsProps {
  languages: Array<{ name: string; percent: number }>;
  maxItems?: number; // default: 5
  loading?: boolean;
}
```

**Визуал:**
```
┌─ Top Skills ─────────────────────────────────────────────┐
│ 🟦 TypeScript 68% │ 🟨 JavaScript 15% │ 🟪 CSS 10% │ +2  │
└──────────────────────────────────────────────────────────┘
```

**Особенности:**
- Использует LANGUAGE_COLORS для цветов
- Desktop: горизонтальный ряд чипов
- Mobile: вертикальный список или compact bar
- "+N" если больше maxItems

### 4. MetricAssessmentGrid

```typescript
interface MetricAssessmentGridProps {
  metrics: {
    activity: MetricData;
    impact: MetricData;
    quality: MetricData;
    consistency: MetricData;
    authenticity: MetricData;
    collaboration: MetricData;
  };
  languages?: Array<{ name: string; percent: number }>;
  loading?: boolean;
  onExplainMetric?: (metric: string) => void;
}
```

**Responsive поведение:**
- Desktop (>=768px): Grid 3 колонки, все раскрыто
- Mobile (<768px): Stack вертикально, accordion (все свернуто)

---

## Обновление MetricExplanationModal

Добавить в EXPLANATIONS:

```typescript
consistency: {
  title: "Consistency Score",
  description: "Measures regularity and stability of coding activity over time. Higher scores indicate steady, predictable contribution patterns.",
  components: {
    regularity: "Commit distribution evenness (0-50 pts)",
    streak: "Consecutive active years (0-30 pts)",
    recency: "Recent activity in last 2 years (0-20 pts)",
  },
},
collaboration: {
  title: "Collaboration Score",
  description: "Evaluates contributions to other developers' projects. Shows how much you work with the broader community.",
  components: {
    contributionRatio: "Contributions to others' repos (0-50 pts)",
    diversity: "Number of external projects (0-30 pts)",
    engagement: "Quality of contributions (0-20 pts)",
  },
},
```

---

## Порядок реализации

### Phase 1: Data Layer (30 мин)
1. [ ] Создать `src/lib/metrics/categories.ts` с типами и конфигурацией
2. [ ] Обновить `src/lib/metrics/index.ts` - экспорт consistency, collaboration

### Phase 2: MetricRowCompact (1 час)
1. [ ] Создать компонент MetricRowCompact.tsx
2. [ ] Написать stories (Default, HighScore, LowScore, Loading)
3. [ ] Написать тесты
4. [ ] Build Storybook и проверить

### Phase 3: MetricCategoryCard (1.5 часа)
1. [ ] Создать компонент MetricCategoryCard.tsx
2. [ ] Реализовать accordion для mobile
3. [ ] Написать stories (OUTPUT, QUALITY, TRUST, Mobile collapsed/expanded)
4. [ ] Написать тесты
5. [ ] Build Storybook и проверить

### Phase 4: UserSkills (1 час)
1. [ ] Создать компонент UserSkills.tsx
2. [ ] Написать stories (Multiple languages, Single, Loading)
3. [ ] Написать тесты
4. [ ] Build Storybook и проверить

### Phase 5: MetricExplanationModal (30 мин)
1. [ ] Добавить consistency и collaboration в EXPLANATIONS
2. [ ] Обновить тип MetricKey
3. [ ] Обновить тесты
4. [ ] Build Storybook и проверить

### Phase 6: MetricAssessmentGrid (1.5 часа)
1. [ ] Создать компонент MetricAssessmentGrid.tsx
2. [ ] Интегрировать все подкомпоненты
3. [ ] Реализовать responsive поведение
4. [ ] Написать stories (Desktop, Tablet, Mobile)
5. [ ] Написать тесты
6. [ ] Build Storybook и проверить

### Phase 7: Интеграция (30 мин)
1. [ ] Обновить index.ts с экспортами
2. [ ] Заменить QuickAssessment на MetricAssessmentGrid в родителе
3. [ ] Прогнать все тесты
4. [ ] Проверить в браузере

---

## Design Tokens

### Цвета по score (из design-tokens.ts)
- High (>=80): `text-success` / `bg-success/20`
- Medium (60-79): `text-warning` / `bg-warning/20`
- Low (40-59): `text-caution` / `bg-caution/20`
- Critical (<40): `text-destructive` / `bg-destructive/20`

### Типография
- Category title: `text-sm font-semibold uppercase tracking-wide`
- Category score: `text-2xl font-bold`
- Metric title: `text-sm font-medium`
- Description: `text-xs text-muted-foreground`

### Spacing
- Card padding: `p-4`
- Gap между метриками: `gap-3`
- Grid gap: `gap-4`

---

## Accessibility (WCAG 2.1 AA)

- [ ] Контраст текста 4.5:1
- [ ] Touch targets минимум 44x44px
- [ ] ARIA labels для progress bars
- [ ] Keyboard navigation (Tab, Enter/Space)
- [ ] `prefers-reduced-motion` для анимаций
- [ ] Accordion: `aria-expanded`, `aria-controls`

---

## Тестирование

### Unit тесты
- Рендеринг всех состояний
- Клики и callbacks
- Responsive поведение
- Accessibility атрибуты

### Visual тесты (Storybook)
- Все варианты scores
- Desktop/Mobile layouts
- Loading states
- Dark/Light themes

### E2E (опционально)
- Клик на метрику → модальное окно
- Accordion toggle на mobile
- Scroll поведение

---

## Оценка времени

| Phase | Время |
|-------|-------|
| Phase 1: Data Layer | 30 мин |
| Phase 2: MetricRowCompact | 1 час |
| Phase 3: MetricCategoryCard | 1.5 часа |
| Phase 4: UserSkills | 1 час |
| Phase 5: MetricExplanationModal | 30 мин |
| Phase 6: MetricAssessmentGrid | 1.5 часа |
| Phase 7: Интеграция | 30 мин |
| **Итого** | **~6.5 часов** |
