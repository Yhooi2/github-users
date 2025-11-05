# Tailwind CSS v4 - Гайд по миграции

> Полное руководство по миграции с Tailwind CSS v3 на v4 с примерами breaking changes и рекомендациями

## Содержание

- [Обзор изменений](#обзор-изменений)
- [Критические Breaking Changes](#критические-breaking-changes)
- [CSS-First конфигурация](#css-first-конфигурация)
- [Переименованные утилиты](#переименованные-утилиты)
- [Изменения значений по умолчанию](#изменения-значений-по-умолчанию)
- [Новые фичи v4](#новые-фичи-v4)
- [Чек-лист миграции](#чек-лист-миграции)
- [Troubleshooting](#troubleshooting)

---

## Обзор изменений

Tailwind CSS v4 - это **мажорное обновление** с существенными изменениями в подходе к конфигурации и именованию утилит.

### Основные изменения

1. **CSS-First конфигурация** - замена `tailwind.config.js` на CSS файлы
2. **Переименование утилит** - более консистентное именование
3. **Новые значения по умолчанию** - изменены border, ring и другие
4. **Новый синтаксис** - директивы `@theme` и `@utility`
5. **Улучшенная производительность** - более быстрая компиляция

### Что осталось без изменений

- ✅ Основной синтаксис utility классов
- ✅ Responsive breakpoints (`sm:`, `md:`, `lg:`, `xl:`, `2xl:`)
- ✅ Pseudo-classes (`:hover`, `:focus`, `:active` и т.д.)
- ✅ Dark mode support
- ✅ JIT engine

---

## Критические Breaking Changes

### 1. CSS-First конфигурация

#### ❌ Старый подход (v3)
```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#3b82f6',
      },
    },
  },
}
```

#### ✅ Новый подход (v4)
```css
/* src/index.css */
@import "tailwindcss";

@theme {
  --color-primary: #3b82f6;
  --color-secondary: #8b5cf6;
}
```

**Преимущества:**
- Проще для понимания
- Нет JavaScript конфигурации
- Лучшая поддержка IDE
- Быстрее компиляция

---

### 2. Vite Plugin конфигурация

#### Наша текущая конфигурация

```typescript
// vite.config.ts
import tailwindcss from "@tailwindcss/vite"

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // ✅ Используем Vite plugin
    ViteMcp()
  ],
})
```

**Файл стилей:**
```css
/* src/index.css */
@import "tailwindcss";
```

**Примечание:** Проект уже использует правильную конфигурацию для v4!

---

### 3. Переименование утилит (Scale Values)

Tailwind v4 переименовал многие утилиты для консистентности шкалы.

#### Shadow Utilities

```diff
// ❌ Старое (v3)
- shadow-sm    → Маленькая тень
- shadow-md    → Средняя тень
- shadow-lg    → Большая тень

// ✅ Новое (v4)
+ shadow-xs    → Маленькая тень (было sm)
+ shadow-sm    → Средняя тень (было md)
+ shadow-md    → Большая тень (было lg)
+ shadow-lg    → Очень большая (было xl)
```

**Пример миграции:**
```diff
- <div className="shadow-sm">
+ <div className="shadow-xs">
```

#### Border Radius Utilities

```diff
// ❌ Старое (v3)
- rounded-sm   → 0.125rem
- rounded-md   → 0.375rem
- rounded-lg   → 0.5rem

// ✅ Новое (v4)
+ rounded-xs   → 0.125rem (было sm)
+ rounded-sm   → 0.25rem (было default)
+ rounded-md   → 0.375rem (было md)
+ rounded-lg   → 0.5rem (было lg)
```

#### Blur Utilities

```diff
// ❌ Старое (v3)
- blur-sm
- blur-md
- blur-lg

// ✅ Новое (v4)
+ blur-xs     (было blur-sm)
+ blur-sm     (было blur-md)
+ blur-md     (было blur-lg)
```

---

### 4. Container Utility

#### ❌ Удалены опции (v3)
```javascript
// tailwind.config.js (v3)
module.exports = {
  theme: {
    container: {
      center: true,
      padding: '2rem',
    },
  },
}
```

#### ✅ Новый подход (v4)
```css
/* Нужно добавлять классы вручную */
<div className="container mx-auto px-4">
  {/* content */}
</div>
```

**Миграция:**
```diff
- <div className="container">
+ <div className="container mx-auto px-4">
```

---

### 5. Изменения значений по умолчанию

#### Border Color

```diff
// ❌ Старое (v3): gray-200 (#e5e7eb)
- border → border-gray-200

// ✅ Новое (v4): currentColor
+ border → border-currentColor
```

**Влияние:**
Borders теперь наследуют цвет текста. Если нужен серый border:

```tsx
// Явно указывайте цвет
<div className="border border-gray-200">
```

#### Ring Width

```diff
// ❌ Старое (v3): 3px
- ring → 3px width

// ✅ Новое (v4): 1px
+ ring → 1px width
```

**Если нужен старый размер:**
```tsx
<button className="ring-3">Click me</button>
```

#### Outline

```diff
// ❌ Старое (v3)
- outline-none

// ✅ Новое (v4)
+ outline-hidden
```

---

## CSS-First конфигурация

### Директива @theme

Основной способ кастомизации в v4.

```css
/* src/index.css */
@import "tailwindcss";

@theme {
  /* Цвета */
  --color-primary: #3b82f6;
  --color-secondary: #8b5cf6;
  --color-accent: #f59e0b;

  /* Spacing */
  --spacing-xs: 0.5rem;
  --spacing-sm: 1rem;
  --spacing-md: 1.5rem;

  /* Border radius */
  --radius-card: 0.5rem;
  --radius-button: 0.25rem;

  /* Fonts */
  --font-sans: 'Inter', system-ui, sans-serif;
  --font-mono: 'Fira Code', monospace;

  /* Breakpoints */
  --breakpoint-sm: 640px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 1024px;
}
```

**Использование:**
```tsx
<div className="bg-primary text-white">
  Primary background
</div>

<div className="rounded-card p-md">
  Custom spacing and radius
</div>
```

---

### Директива @utility

Создание кастомных утилит.

```css
@utility card-base {
  @apply rounded-lg shadow-md p-6 bg-white;
}

@utility gradient-primary {
  background: linear-gradient(to right, var(--color-primary), var(--color-secondary));
}
```

**Использование:**
```tsx
<div className="card-base">
  Base card styles
</div>
```

---

### Медиа-запросы в @theme

```css
@theme {
  --spacing-content: 1rem;

  @media (min-width: 768px) {
    --spacing-content: 2rem;
  }

  @media (min-width: 1024px) {
    --spacing-content: 3rem;
  }
}
```

---

## Переименованные утилиты

### Полная таблица изменений

| v3 Класс | v4 Класс | Описание |
|----------|----------|----------|
| `shadow-sm` | `shadow-xs` | Маленькая тень |
| `shadow` | `shadow-sm` | Стандартная тень |
| `shadow-md` | `shadow` | Средняя тень |
| `shadow-lg` | `shadow-md` | Большая тень |
| `shadow-xl` | `shadow-lg` | Очень большая |
| `shadow-2xl` | `shadow-xl` | Максимальная |
| | |
| `rounded-sm` | `rounded-xs` | Маленький радиус |
| `rounded` | `rounded-sm` | Стандартный |
| `rounded-md` | `rounded` | Средний |
| `rounded-lg` | `rounded-md` | Большой |
| `rounded-xl` | `rounded-lg` | Очень большой |
| | |
| `blur-sm` | `blur-xs` | Маленькое размытие |
| `blur` | `blur-sm` | Стандартное |
| `blur-md` | `blur` | Среднее |
| `blur-lg` | `blur-md` | Большое |
| | |
| `outline-none` | `outline-hidden` | Скрыть outline |

---

## Изменения значений по умолчанию

### Border Styles

```tsx
// v3: Серый border по умолчанию
<div className="border">
  {/* border-color: #e5e7eb */}
</div>

// v4: currentColor по умолчанию
<div className="border">
  {/* border-color: currentColor (наследует цвет текста) */}
</div>

// Для серого border в v4:
<div className="border border-gray-200">
  {/* Явно указываем цвет */}
</div>
```

### Ring Styles

```tsx
// v3: Ring 3px по умолчанию
<button className="focus:ring">
  {/* ring-width: 3px */}
</button>

// v4: Ring 1px по умолчанию
<button className="focus:ring">
  {/* ring-width: 1px */}
</button>

// Для 3px ring в v4:
<button className="focus:ring-3">
  {/* ring-width: 3px */}
</button>
```

---

## Новые фичи v4

### 1. CSS Variables Everywhere

Все Tailwind значения доступны как CSS переменные:

```tsx
<div style={{
  padding: 'var(--spacing-4)',
  background: 'var(--color-primary)'
}}>
  Direct CSS variables access
</div>
```

### 2. Улучшенная производительность

- Быстрее компиляция CSS
- Меньший размер output файла
- Оптимизированный JIT

### 3. Prefix Support

```css
@import "tailwindcss" prefix(tw);

/* Используйте с префиксом */
```

```tsx
<div className="tw:flex tw:items-center">
  Prefixed utilities
</div>
```

### 4. Better IDE Support

- Автокомплит для CSS переменных
- Лучший IntelliSense
- Type safety для theme значений

---

## Чек-лист миграции

### Шаг 1: Подготовка

- [ ] Создать резервную копию проекта
- [ ] Убедиться что все тесты проходят
- [ ] Зафиксировать текущее состояние в git

### Шаг 2: Обновление зависимостей

```bash
# Обновить Tailwind packages
npm install -D tailwindcss@latest @tailwindcss/vite@latest

# Или с yarn
yarn upgrade tailwindcss @tailwindcss/vite --latest
```

### Шаг 3: Удалить старую конфигурацию

- [ ] Удалить `tailwind.config.js` (если есть)
- [ ] Удалить `postcss.config.js` (если использует old config)

### Шаг 4: Настроить CSS-first конфигурацию

- [ ] Добавить `@import "tailwindcss"` в main CSS
- [ ] Перенести кастомные настройки в `@theme`
- [ ] Добавить `@tailwindcss/vite` в vite.config

### Шаг 5: Обновить утилиты

- [ ] Найти и заменить `shadow-sm` → `shadow-xs`
- [ ] Найти и заменить `rounded-sm` → `rounded-xs`
- [ ] Найти и заменить `blur-sm` → `blur-xs`
- [ ] Найти и заменить `outline-none` → `outline-hidden`

**Regex для поиска:**
```regex
(shadow|rounded|blur)-(sm|md|lg|xl|2xl)
```

### Шаг 6: Проверить border/ring

- [ ] Проверить все `border` классы (добавить цвет если нужен серый)
- [ ] Проверить все `ring` классы (добавить `-3` если нужен толстый)

### Шаг 7: Обновить container

- [ ] Найти все `container`
- [ ] Добавить `mx-auto` для центрирования
- [ ] Добавить `px-4` для padding

### Шаг 8: Тестирование

- [ ] Запустить dev сервер: `npm run dev`
- [ ] Проверить визуально все страницы
- [ ] Запустить тесты: `npm test`
- [ ] Запустить билд: `npm run build`
- [ ] Запустить Storybook: `npm run storybook`

---

## Audit кода проекта

### Файлы для проверки

#### src/components/UserProfile.tsx

```tsx
// Проверить:
- border классы (есть ли border без цвета?)
- shadow классы (используется ли shadow-sm?)
- rounded классы (используется ли rounded-sm?)

// Текущий код:
<div className="border-4 border-border"> ✅ Цвет указан
<div className="bg-muted/50 p-4 rounded-lg"> ✅ rounded-lg существует в v4
```

#### src/components/SearchForm.tsx

```tsx
// Проверить:
- ring/focus states
- border colors

// Текущий код:
<Input ... className="flex-grow bg-background" />
<Button type="submit">Search</Button>

// ✅ Минимальный styling, проблем нет
```

#### shadcn/ui компоненты

Компоненты из shadcn/ui (button, input, label) должны быть совместимы с v4,
так как shadcn обновляет свои компоненты для новых версий Tailwind.

**Действие:** Обновить shadcn компоненты после миграции:
```bash
npx shadcn@latest update
```

---

## Troubleshooting

### Проблема: Классы не применяются

**Причина:** Не импортирован Tailwind CSS

**Решение:**
```css
/* src/index.css - должен быть в самом верху */
@import "tailwindcss";
```

### Проблема: Кастомные цвета не работают

**Причина:** Неправильный синтаксис в @theme

**Решение:**
```css
@theme {
  /* ❌ Неправильно */
  primary: '#3b82f6';

  /* ✅ Правильно */
  --color-primary: #3b82f6;
}
```

### Проблема: Border всегда цвета текста

**Причина:** В v4 border по умолчанию `currentColor`

**Решение:**
```tsx
{/* Явно указать цвет */}
<div className="border border-gray-200">
```

### Проблема: Ring слишком тонкий

**Причина:** В v4 ring по умолчанию 1px (было 3px)

**Решение:**
```tsx
<button className="focus:ring-3">
  {/* Или другое значение: ring-2, ring-4 */}
</button>
```

### Проблема: Container не центрируется

**Причина:** В v4 нет auto-center

**Решение:**
```tsx
<div className="container mx-auto px-4">
```

---

## Полезные ссылки

- [Tailwind CSS v4 Docs](https://tailwindcss.com/docs)
- [Migration Guide (Official)](https://tailwindcss.com/docs/upgrade-guide)
- [Tailwind v4 Beta Announcement](https://tailwindcss.com/blog/tailwindcss-v4-alpha)
- [shadcn/ui Updates](https://ui.shadcn.com/docs/changelog)

---

## Дополнительная документация

- [Dependencies Overview](./dependencies.md) - Все зависимости проекта
- [Component Development](./component-development.md) - Разработка с shadcn/ui
- [Architecture](./architecture.md) - Архитектура проекта

---

**Последнее обновление:** Ноябрь 2025
**Версия Tailwind CSS:** 4.1.12
**Статус миграции:** ✅ Проект использует правильную конфигурацию v4
