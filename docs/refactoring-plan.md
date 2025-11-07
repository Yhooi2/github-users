# План рефакторинга и расширения GitHub User Info

**Дата создания**: 2025-11-05
**Последнее обновление**: 2025-11-07
**Статус**: В процессе выполнения (v2.1 - Test-After Development) - Фазы 1-6 завершены ✅
**Цель**: Полная модернизация UI с shadcn/ui, расширенная аналитика GitHub пользователей и проверка подлинности активности

---

## 📋 Содержание

1. [Обзор проекта](#1-обзор-проекта)
2. [Текущее состояние](#2-текущее-состояние)
3. [Цели рефакторинга](#3-цели-рефакторинга)
4. [Development & Testing Workflow](#4-development--testing-workflow) 🆕
5. [Правила тестирования](#5-правила-тестирования) 🆕
6. [Расширение GraphQL API](#6-расширение-graphql-api)
7. [Обновление TypeScript типов](#7-обновление-typescript-типов)
8. [Миграция на shadcn/ui](#8-миграция-на-shadcnui)
9. [Новая архитектура компонентов](#9-новая-архитектура-компонентов)
10. [Функционал проверки подлинности](#10-функционал-проверки-подлинности)
11. [Расширенная статистика репозиториев](#11-расширенная-статистика-репозиториев)
12. [Статистика коммитов](#12-статистика-коммитов)
13. [Статистика языков и инструментов](#13-статистика-языков-и-инструментов)
14. [UI/UX улучшения](#14-uiux-улучшения)
15. [Структура файлов](#15-структура-файлов)
16. [Этапы реализации](#16-этапы-реализации) 🆕
17. [Дополнительные возможности](#17-дополнительные-возможности)
18. [Технические соображения](#18-технические-соображения)
19. [Финальный аудит плана](#19-финальный-аудит-плана) 🆕
20. [Документация](#20-документация)

---

## 1. Обзор проекта

GitHub User Info - React приложение для анализа активности GitHub пользователей через GraphQL API.

**Текущий стек:**
- React 19 + TypeScript 5.8
- Vite 7
- Apollo Client 3.14
- Tailwind CSS v4
- shadcn/ui (частично)
- Vitest + Playwright
- Storybook 10

## 2. Текущее состояние

### Существующие компоненты:
- `SearchForm` - форма поиска пользователя
- `UserProfile` - монолитный компонент отображения профиля
- `Button`, `Input`, `Label` - базовые UI компоненты

### Текущий GraphQL запрос получает:
- Базовую информацию профиля (имя, bio, аватар, локация)
- Счетчики (followers, following, gists, repos)
- Коммиты за последние 3 года (по годам)
- Список репозиториев (до 100) с:
  - Названием, описанием
  - Звездами, форками
  - Основным языком
  - Списком языков с размерами
  - Количеством коммитов в дефолтной ветке

### Проблемы:
- ❌ Нет проверки подлинности (форки, клонированные проекты)
- ❌ Минимальная статистика (только базовые счетчики)
- ❌ Нет фильтрации и сортировки репозиториев
- ❌ Нет визуализации данных (графики, диаграммы)
- ❌ Монолитная компонентная структура
- ❌ Ограниченное использование shadcn/ui
- ❌ Нет разделения на секции (все в одном view)

## 3. Цели рефакторинга

### Основные цели:

1. **100% shadcn/ui покрытие** - все UI компоненты только из shadcn
2. **Модульная архитектура** - легко расширяемые и переиспользуемые компоненты
3. **Проверка подлинности** - определение "настоящих" vs "поддельных" профилей
4. **Расширенная аналитика** - глубокая статистика по коммитам, языкам, активности
5. **Визуализация данных** - графики и диаграммы для наглядности
6. **Гибкая фильтрация** - сортировка и фильтрация по всем метрикам
7. **Современный UX** - tabs, скелетоны, плавные переходы
8. **Простая кастомизация** - легкая смена тем через Tailwind variables
9. **90%+ тестовое покрытие** - код → тесты → исправление сразу 🆕

### Метрики успеха:

- ✅ Все компоненты используют только shadcn/ui
- ✅ Индекс подлинности показывает реальную активность
- ✅ Пользователь может сортировать репозитории по 5+ критериям
- ✅ Визуальные графики для коммитов и языков
- ✅ Загрузка страницы < 2 секунд
- ✅ 100% TypeScript покрытие
- ✅ **90%+ тестовое покрытие (unit + integration)** 🆕
- ✅ **100% Storybook покрытие для UI компонентов** 🆕
- ✅ **Все E2E тесты проходят** 🆕

---

## 4. Development & Testing Workflow 🆕

### Философия разработки в проекте

**Правило #1**: 🔴 **НЕ ПЕРЕХОДИТЬ К СЛЕДУЮЩЕЙ ЗАДАЧЕ, ПОКА ТЕКУЩАЯ НЕ ПОКРЫТА ТЕСТАМИ И НЕ ИСПРАВЛЕНА**

### Workflow для каждой задачи:

#### Для утилит/хуков/API:
```
1. 📝 Напиши код (функция/хук)
2. 🧪 Напиши тесты (unit/integration)
3. ✅ Запусти тесты
4. 🔧 Если тесты падают - исправь КОД (не тесты!)
5. ✅ Повтори шаги 3-4 пока все тесты не пройдут
6. 📊 Проверь coverage (должно быть ≥90%)
7. 🔍 Code review (самопроверка)
8. ➡️ Только теперь переходи к следующей задаче
```

#### Для UI компонентов:
```
1. 📝 Напиши компонент
2. 📚 СРАЗУ создай Storybook story (для UI компонентов)
3. 👁️ Проверь визуально в Storybook (все варианты!)
4. ♿ Проверь Accessibility tab
5. 🔧 Компонент плохо выглядит? Исправь КОД и вернись к шагу 3
6. 🧪 ТЕПЕРЬ напиши тесты (unit/integration)
7. ✅ Запусти тесты
8. 🔧 Если тесты падают - исправь КОД (не тесты!)
9. ✅ Повтори шаги 7-8 пока все тесты не пройдут
10. 📊 Проверь coverage (должно быть ≥85%)
11. 🔍 Code review (самопроверка)
12. ➡️ Только теперь переходи к следующему компоненту
```

### Типы тестов по слоям:

#### **Утилиты и хуки** (lib/, hooks/)
- ✅ Unit тесты (100% coverage)
- ✅ Edge cases (пустые данные, null, undefined)
- ✅ Error handling

#### **UI Компоненты** (components/)
- ✅ Unit тесты (рендеринг, props)
- ✅ Integration тесты (взаимодействие)
- ✅ Storybook stories (все варианты)
- ✅ User interaction тесты (@testing-library/user-event)

#### **API и GraphQL** (apollo/)
- ✅ Unit тесты для хуков
- ✅ Mock Apollo Client
- ✅ Error scenarios (network errors, GraphQL errors)

#### **End-to-End** (e2e/)
- ✅ Happy path (основной флоу)
- ✅ Error handling
- ✅ Edge cases

### Пример workflow:

#### Для утилит и хуков:

**Задача**: Создать функцию `calculateAuthenticityScore`

```typescript
// ❌ НЕПРАВИЛЬНО
1. Написать calculateAuthenticityScore()
2. Написать 5 других функций
3. Потом написать тесты для всех сразу
4. Обнаружить 20 багов и не помнить, где что

// ✅ ПРАВИЛЬНО
1. Написать calculateAuthenticityScore() - полная реализация
2. Сразу написать calculateAuthenticityScore.test.ts
3. Запустить: npm run test -- authenticity.test
4. Тесты падают? Исправить КОД в calculateAuthenticityScore()
5. Повторить шаги 3-4 пока все тесты не пройдут
6. Проверить coverage: npm run test:coverage -- authenticity
7. Coverage < 95%? Дописать тесты и повторить шаги 3-5
8. Только теперь переходить к следующей функции
```

#### Для UI компонентов:

**Задача**: Создать компонент `UserHeader`

```typescript
// ❌ НЕПРАВИЛЬНО
1. Написать UserHeader.tsx
2. Написать еще 3 компонента
3. Потом делать Storybook для всех
4. Потом тесты для всех
5. Найти кучу проблем и не помнить, что где

// ✅ ПРАВИЛЬНО
1. Написать UserHeader.tsx - полная реализация компонента
2. СРАЗУ создать UserHeader.stories.tsx
3. Запустить Storybook: npm run storybook
4. Проверить визуально ВСЕ варианты (все stories)
5. Проверить Accessibility tab (a11y addon)
6. Компонент выглядит неправильно? Исправить КОД в UserHeader.tsx
7. Повторить шаги 3-6 пока компонент не будет идеальным
8. ТЕПЕРЬ написать UserHeader.test.tsx
9. Запустить: npm run test -- UserHeader.test
10. Тесты падают? Исправить КОД (не тесты!)
11. Проверить coverage: npm run test:coverage -- UserHeader
12. Coverage < 85%? Дописать тесты и повторить шаги 9-11
13. Только теперь переходить к следующему компоненту
```

**Почему Storybook ДО тестов для UI:**
- Визуальная проверка быстрее находит проблемы UI
- Легче итерировать над дизайном в реальном времени
- Тесты пишутся для уже проверенного визуально компонента
- Меньше переделок в тестах, если UI меняется

---

## 5. Правила тестирования 🆕

### 5.1 Unit Tests (Vitest)

**Когда использовать**:
- Чистые функции
- Утилиты (lib/)
- Хуки без внешних зависимостей
- Форматтеры, валидаторы

**Что тестировать**:
- ✅ Основной функционал
- ✅ Edge cases (пустые массивы, null, undefined, 0)
- ✅ Error handling
- ✅ Граничные значения
- ✅ Возвращаемые типы (TypeScript)

**Coverage требования**: **≥95%**

**Пример структуры теста**:

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { myFunction } from './myFunction';

describe('myFunction', () => {
  // Group 1: Основной функционал
  describe('основной функционал', () => {
    it('should return correct result for valid input', () => {
      expect(myFunction('valid')).toBe('expected');
    });
  });

  // Group 2: Edge cases
  describe('edge cases', () => {
    it('should handle empty string', () => {
      expect(myFunction('')).toBe('');
    });

    it('should handle null', () => {
      expect(myFunction(null)).toBe(null);
    });

    it('should handle undefined', () => {
      expect(myFunction(undefined)).toBe(undefined);
    });
  });

  // Group 3: Error handling
  describe('error handling', () => {
    it('should throw error for invalid input', () => {
      expect(() => myFunction('invalid')).toThrow('Error message');
    });
  });
});
```

### 5.2 Component Tests (React Testing Library)

**Когда использовать**:
- Все React компоненты
- Компоненты с props
- Компоненты с state
- Компоненты с user interaction

**Что тестировать**:
- ✅ Рендеринг с разными props
- ✅ Conditional rendering
- ✅ User interactions (клики, ввод текста)
- ✅ State changes
- ✅ Callback функции
- ✅ Accessibility (ARIA labels, roles)

**Coverage требования**: **≥85%**

**Пример структуры теста**:

```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MyComponent } from './MyComponent';

describe('MyComponent', () => {
  // Group 1: Рендеринг
  describe('rendering', () => {
    it('should render with default props', () => {
      render(<MyComponent />);
      expect(screen.getByText('Default text')).toBeInTheDocument();
    });

    it('should render with custom props', () => {
      render(<MyComponent text="Custom" />);
      expect(screen.getByText('Custom')).toBeInTheDocument();
    });
  });

  // Group 2: User interaction
  describe('user interactions', () => {
    it('should call onClick when button is clicked', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();

      render(<MyComponent onClick={handleClick} />);
      await user.click(screen.getByRole('button'));

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should update input value', async () => {
      const user = userEvent.setup();
      render(<MyComponent />);

      const input = screen.getByRole('textbox');
      await user.type(input, 'test');

      expect(input).toHaveValue('test');
    });
  });

  // Group 3: Conditional rendering
  describe('conditional rendering', () => {
    it('should show loading state', () => {
      render(<MyComponent loading />);
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('should show error state', () => {
      render(<MyComponent error="Error message" />);
      expect(screen.getByText('Error message')).toBeInTheDocument();
    });
  });

  // Group 4: Accessibility
  describe('accessibility', () => {
    it('should have correct ARIA labels', () => {
      render(<MyComponent />);
      expect(screen.getByLabelText('Button label')).toBeInTheDocument();
    });

    it('should be keyboard accessible', async () => {
      const user = userEvent.setup();
      render(<MyComponent />);

      await user.tab();
      expect(screen.getByRole('button')).toHaveFocus();
    });
  });
});
```

### 5.3 Integration Tests

**Когда использовать**:
- Компоненты с Apollo Client
- Компоненты с хуками
- Компоненты с context
- Взаимодействие между компонентами

**Что тестировать**:
- ✅ Apollo MockedProvider
- ✅ Loading states
- ✅ Error states
- ✅ Data fetching
- ✅ Mutations
- ✅ Cache updates

**Coverage требования**: **≥80%**

**Пример структуры теста**:

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { UserProfile } from './UserProfile';
import { GET_USER_INFO } from '@/apollo/queriers';

describe('UserProfile Integration', () => {
  const mocks = [
    {
      request: {
        query: GET_USER_INFO,
        variables: { login: 'octocat' },
      },
      result: {
        data: {
          user: {
            login: 'octocat',
            name: 'The Octocat',
            // ... mock data
          },
        },
      },
    },
  ];

  describe('data fetching', () => {
    it('should show loading state initially', () => {
      render(
        <MockedProvider mocks={mocks} addTypename={false}>
          <UserProfile userName="octocat" />
        </MockedProvider>
      );

      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('should display user data after loading', async () => {
      render(
        <MockedProvider mocks={mocks} addTypename={false}>
          <UserProfile userName="octocat" />
        </MockedProvider>
      );

      await waitFor(() => {
        expect(screen.getByText('The Octocat')).toBeInTheDocument();
      });
    });
  });

  describe('error handling', () => {
    it('should show error message on GraphQL error', async () => {
      const errorMocks = [
        {
          request: {
            query: GET_USER_INFO,
            variables: { login: 'nonexistent' },
          },
          error: new Error('User not found'),
        },
      ];

      render(
        <MockedProvider mocks={errorMocks} addTypename={false}>
          <UserProfile userName="nonexistent" />
        </MockedProvider>
      );

      await waitFor(() => {
        expect(screen.getByText(/User not found/)).toBeInTheDocument();
      });
    });
  });
});
```

### 5.4 E2E Tests (Playwright)

**Когда использовать**:
- Основные пользовательские флоу
- Critical paths
- Multi-step workflows
- Cross-browser testing

**Что тестировать**:
- ✅ Happy path (успешный флоу)
- ✅ Error scenarios
- ✅ Navigation
- ✅ Form submissions
- ✅ Data persistence
- ✅ Responsive design

**Coverage требования**: **Все critical paths покрыты**

**Пример структуры теста**:

```typescript
import { test, expect } from '@playwright/test';

test.describe('User Search Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should complete full user search flow', async ({ page }) => {
    // Step 1: Search for user
    await page.fill('input[placeholder*="Search"]', 'octocat');
    await page.click('button[type="submit"]');

    // Step 2: Wait for profile to load
    await expect(page.locator('text=@octocat')).toBeVisible();

    // Step 3: Check tabs are visible
    await expect(page.locator('text=Overview')).toBeVisible();
    await expect(page.locator('text=Repositories')).toBeVisible();

    // Step 4: Navigate to Repositories tab
    await page.click('text=Repositories');
    await expect(page.locator('[data-testid="repository-card"]').first()).toBeVisible();

    // Step 5: Filter repositories
    await page.selectOption('select[aria-label="Language"]', 'JavaScript');
    await expect(page.locator('[data-testid="repository-card"]')).not.toHaveCount(0);

    // Step 6: Navigate to Analytics tab
    await page.click('text=Analytics');
    await expect(page.locator('text=Contribution Activity')).toBeVisible();
  });

  test('should handle user not found error', async ({ page }) => {
    await page.fill('input[placeholder*="Search"]', 'nonexistentuser12345');
    await page.click('button[type="submit"]');

    await expect(page.locator('text=User Not Found')).toBeVisible();
  });

  test('should handle network error', async ({ page }) => {
    // Simulate offline
    await page.context().setOffline(true);

    await page.fill('input[placeholder*="Search"]', 'octocat');
    await page.click('button[type="submit"]');

    await expect(page.locator('text=/Network error|Connection error/')).toBeVisible();
  });
});

test.describe('Responsive Design', () => {
  test('should work on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Test mobile-specific behavior
    await page.fill('input[placeholder*="Search"]', 'octocat');
    await page.click('button[type="submit"]');

    await expect(page.locator('text=@octocat')).toBeVisible();
  });

  test('should work on tablet', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');

    // Test tablet-specific behavior
  });
});
```

### 5.5 Storybook Stories

**Когда создавать**:
- Все UI компоненты
- Все варианты props
- Все состояния (loading, error, empty)
- Все темы (light, dark)

**Что документировать**:
- ✅ Default state
- ✅ Все variants
- ✅ Loading state
- ✅ Error state
- ✅ Empty state
- ✅ Interactive examples
- ✅ Accessibility checks (addon-a11y)

**Coverage требования**: **100% UI компонентов**

**Пример структуры story**:

```typescript
import type { Meta, StoryObj } from '@storybook/react';
import { RepositoryCard } from './RepositoryCard';

const meta: Meta<typeof RepositoryCard> = {
  title: 'Repository/RepositoryCard',
  component: RepositoryCard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Displays a single repository with all its metadata.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    repository: {
      description: 'Repository data from GitHub API',
    },
    showCommits: {
      description: 'Whether to display commit count',
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof RepositoryCard>;

// Story 1: Default
export const Default: Story = {
  args: {
    repository: {
      id: '1',
      name: 'awesome-project',
      description: 'An awesome open-source project',
      stargazerCount: 1234,
      forkCount: 56,
      isFork: false,
      isTemplate: false,
      primaryLanguage: { name: 'TypeScript', color: '#3178c6' },
      repositoryTopics: {
        nodes: [
          { topic: { name: 'react' } },
          { topic: { name: 'typescript' } },
        ],
      },
      pushedAt: new Date().toISOString(),
      url: 'https://github.com/user/repo',
      // ... rest of mock data
    },
    showCommits: true,
  },
};

// Story 2: Fork
export const ForkRepository: Story = {
  args: {
    repository: {
      ...Default.args.repository!,
      isFork: true,
      parent: {
        nameWithOwner: 'original/repo',
        url: 'https://github.com/original/repo',
      },
    },
  },
};

// Story 3: Template
export const TemplateRepository: Story = {
  args: {
    repository: {
      ...Default.args.repository!,
      isTemplate: true,
    },
  },
};

// Story 4: No description
export const NoDescription: Story = {
  args: {
    repository: {
      ...Default.args.repository!,
      description: null,
    },
  },
};

// Story 5: Low stars
export const LowPopularity: Story = {
  args: {
    repository: {
      ...Default.args.repository!,
      stargazerCount: 5,
      forkCount: 1,
    },
  },
};

// Story 6: Archived
export const Archived: Story = {
  args: {
    repository: {
      ...Default.args.repository!,
      isArchived: true,
    },
  },
};

// Story 7: Many topics
export const ManyTopics: Story = {
  args: {
    repository: {
      ...Default.args.repository!,
      repositoryTopics: {
        nodes: [
          { topic: { name: 'react' } },
          { topic: { name: 'typescript' } },
          { topic: { name: 'vite' } },
          { topic: { name: 'tailwind' } },
          { topic: { name: 'shadcn' } },
          { topic: { name: 'apollo' } },
        ],
      },
    },
  },
};
```

### 5.6 Coverage Requirements

**Минимальные требования**:

| Категория | Coverage | Инструмент |
|-----------|----------|------------|
| **Утилиты (lib/)** | ≥95% | Vitest |
| **Хуки (hooks/)** | ≥90% | Vitest |
| **Компоненты (components/)** | ≥85% | Vitest + RTL |
| **Apollo (apollo/)** | ≥80% | Vitest + MockedProvider |
| **E2E (e2e/)** | Critical paths | Playwright |
| **Storybook** | 100% UI компонентов | Storybook |

**Общий coverage**: **≥90%**

**Команды для проверки**:

```bash
# Unit + Component tests coverage
npm run test:coverage

# E2E tests
npm run test:e2e

# Storybook build
npm run build-storybook

# All tests
npm run test:all
```

### 5.7 Mock Data Strategy

**Создать централизованное хранилище моков**:

**Файл**: `src/test/mocks/github-data.ts`

```typescript
import type { Repository, GitHubUser } from '@/apollo/github-api.types';

export const mockRepository: Repository = {
  id: 'repo-1',
  name: 'test-repo',
  description: 'A test repository',
  forkCount: 10,
  stargazerCount: 100,
  url: 'https://github.com/test/repo',
  isFork: false,
  isTemplate: false,
  parent: null,
  createdAt: '2020-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
  pushedAt: '2024-01-01T00:00:00Z',
  diskUsage: 1024,
  watchers: { totalCount: 50 },
  issues: { totalCount: 5 },
  pullRequests: { totalCount: 3 },
  primaryLanguage: { name: 'TypeScript', color: '#3178c6' },
  languages: {
    totalSize: 10000,
    edges: [
      { size: 7000, node: { name: 'TypeScript', color: '#3178c6' } },
      { size: 3000, node: { name: 'JavaScript', color: '#f1e05a' } },
    ],
  },
  defaultBranchRef: {
    target: {
      history: { totalCount: 50 },
    },
  },
  licenseInfo: { name: 'MIT', spdxId: 'MIT' },
  repositoryTopics: {
    nodes: [
      { topic: { name: 'react' } },
      { topic: { name: 'typescript' } },
    ],
  },
  hasIssuesEnabled: true,
  hasWikiEnabled: true,
  isArchived: false,
  isEmpty: false,
};

export const mockUser: GitHubUser = {
  id: 'user-1',
  login: 'testuser',
  name: 'Test User',
  avatarUrl: 'https://github.com/avatar.png',
  bio: 'Test bio',
  url: 'https://github.com/testuser',
  location: 'Test City',
  followers: { totalCount: 100 },
  following: { totalCount: 50 },
  gists: { totalCount: 10 },
  createdAt: '2015-01-01T00:00:00Z',
  year1: { totalCommitContributions: 100 },
  year2: { totalCommitContributions: 200 },
  year3: { totalCommitContributions: 300 },
  contributionsCollection: {
    totalCommitContributions: 600,
    commitContributionsByRepository: [
      {
        contributions: { totalCount: 100 },
        repository: { name: 'repo-1' },
      },
    ],
  },
  repositories: {
    totalCount: 10,
    pageInfo: {
      endCursor: 'cursor',
      hasNextPage: false,
    },
    nodes: [mockRepository],
  },
};

// Factory functions для разных сценариев
export const createMockRepository = (overrides?: Partial<Repository>): Repository => ({
  ...mockRepository,
  ...overrides,
});

export const createMockUser = (overrides?: Partial<GitHubUser>): GitHubUser => ({
  ...mockUser,
  ...overrides,
});

// Специфичные моки для тестовых сценариев
export const mockForkedRepository = createMockRepository({
  isFork: true,
  parent: {
    nameWithOwner: 'original/repo',
    url: 'https://github.com/original/repo',
  },
});

export const mockArchivedRepository = createMockRepository({
  isArchived: true,
  pushedAt: '2020-01-01T00:00:00Z', // Old date
});

export const mockEmptyRepository = createMockRepository({
  isEmpty: true,
  stargazerCount: 0,
  forkCount: 0,
  defaultBranchRef: null,
});
```

**Использование в тестах**:

```typescript
import { mockRepository, mockUser, createMockRepository } from '@/test/mocks/github-data';

describe('MyComponent', () => {
  it('should render with default mock', () => {
    render(<MyComponent repository={mockRepository} />);
  });

  it('should render with custom mock', () => {
    const customRepo = createMockRepository({
      stargazerCount: 9999,
      name: 'custom-repo',
    });
    render(<MyComponent repository={customRepo} />);
  });
});
```

---

## 6. Расширение GraphQL API

### 6.1 Новые поля для Repository

```graphql
type Repository {
  # Существующие поля
  id
  name
  description
  forkCount
  stargazerCount
  url
  primaryLanguage { name }
  languages { totalSize, edges { size, node { name } } }
  defaultBranchRef { target { ... on Commit { history { totalCount } } } }

  # НОВЫЕ ПОЛЯ для проверки подлинности
  isFork: Boolean!
  parent: Repository
  isTemplate: Boolean!

  # НОВЫЕ ПОЛЯ для активности
  createdAt: DateTime!
  updatedAt: DateTime!
  pushedAt: DateTime

  # НОВЫЕ ПОЛЯ для статистики
  diskUsage: Int
  watchers: { totalCount: Int! }
  issues: { totalCount: Int! }
  pullRequests: { totalCount: Int! }

  # НОВЫЕ ПОЛЯ для метаданных
  licenseInfo: { name: String }
  repositoryTopics(first: 20) {
    nodes { topic { name } }
  }
  hasIssuesEnabled: Boolean!
  hasWikiEnabled: Boolean!
  isArchived: Boolean!
  isEmpty: Boolean!
}
```

### 6.2 Тестирование GraphQL запроса 🆕

**После обновления** `src/apollo/queriers.ts`:

1. **Ручная проверка в GitHub GraphQL Explorer**:
   - Открыть https://docs.github.com/en/graphql/overview/explorer
   - Вставить запрос
   - Протестировать с разными username
   - Проверить, что все поля возвращаются

2. **Unit тест для типов**:

**Файл**: `src/apollo/queriers.test.ts`

```typescript
import { describe, it, expect } from 'vitest';
import { GET_USER_INFO } from './queriers';
import { print } from 'graphql';

describe('GET_USER_INFO query', () => {
  it('should be valid GraphQL query', () => {
    expect(() => print(GET_USER_INFO)).not.toThrow();
  });

  it('should contain required fields', () => {
    const query = print(GET_USER_INFO);

    // Check for required fields
    expect(query).toContain('login');
    expect(query).toContain('name');
    expect(query).toContain('repositories');
    expect(query).toContain('isFork');
    expect(query).toContain('repositoryTopics');
  });

  it('should accept required variables', () => {
    expect(GET_USER_INFO.definitions[0]).toHaveProperty('variableDefinitions');
    const variables = (GET_USER_INFO.definitions[0] as any).variableDefinitions;

    const variableNames = variables.map((v: any) => v.variable.name.value);
    expect(variableNames).toContain('login');
    expect(variableNames).toContain('from');
    expect(variableNames).toContain('to');
  });
});
```

3. **Integration тест с реальным API** (optional):

```typescript
import { describe, it, expect } from 'vitest';
import { ApolloClient, InMemoryCache } from '@apollo/client';
import { GET_USER_INFO } from './queriers';

describe('GET_USER_INFO integration', () => {
  it('should fetch real data from GitHub API', async () => {
    const client = new ApolloClient({
      uri: 'https://api.github.com/graphql',
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_GITHUB_TOKEN}`,
      },
      cache: new InMemoryCache(),
    });

    const { data } = await client.query({
      query: GET_USER_INFO,
      variables: {
        login: 'octocat',
        from: new Date('2024-01-01').toISOString(),
        to: new Date('2025-01-01').toISOString(),
        year1From: new Date('2023-01-01').toISOString(),
        year1To: new Date('2023-12-31').toISOString(),
        year2From: new Date('2024-01-01').toISOString(),
        year2To: new Date('2024-12-31').toISOString(),
        year3From: new Date('2025-01-01').toISOString(),
        year3To: new Date().toISOString(),
      },
    });

    expect(data.user).toBeDefined();
    expect(data.user.login).toBe('octocat');
    expect(data.user.repositories.nodes).toBeInstanceOf(Array);
    expect(data.user.repositories.nodes[0]).toHaveProperty('isFork');
    expect(data.user.repositories.nodes[0]).toHaveProperty('repositoryTopics');
  }, 10000); // 10s timeout для реального API
});
```

---

## 7. Обновление TypeScript типов

### 7.1 Расширение существующих типов

**Файл**: `src/apollo/github-api.types.ts`

```typescript
// Новые типы
type ParentRepository = {
  nameWithOwner: string;
  url: string;
};

type Topic = {
  name: string;
};

type RepositoryTopic = {
  topic: Topic;
};

type License = {
  name: string;
  spdxId: string;
};

type ProgrammingLanguage = {
  name: string;
  color: string;
};

type ConnectionCount = {
  totalCount: number;
};

// Расширенный Repository type
type Repository = {
  // Существующие
  id: string;
  name: string;
  description: string | null;
  forkCount: number;
  stargazerCount: number;
  url: string;
  primaryLanguage: ProgrammingLanguage | null;
  languages: Languages;
  defaultBranchRef: BranchRef | null;

  // НОВЫЕ
  isFork: boolean;
  parent: ParentRepository | null;
  isTemplate: boolean;
  createdAt: string;
  updatedAt: string;
  pushedAt: string | null;
  diskUsage: number | null;
  watchers: ConnectionCount;
  issues: ConnectionCount;
  pullRequests: ConnectionCount;
  licenseInfo: License | null;
  repositoryTopics: {
    nodes: RepositoryTopic[];
  };
  hasIssuesEnabled: boolean;
  hasWikiEnabled: boolean;
  isArchived: boolean;
  isEmpty: boolean;
};
```

### 7.2 Тестирование типов 🆕

**Файл**: `src/apollo/github-api.types.test.ts`

```typescript
import { describe, it, expect, expectTypeOf } from 'vitest';
import type { Repository, GitHubUser, ProgrammingLanguage } from './github-api.types';

describe('GitHub API Types', () => {
  describe('Repository type', () => {
    it('should have all required fields', () => {
      const repo: Repository = {
        id: '1',
        name: 'test',
        description: null,
        forkCount: 0,
        stargazerCount: 0,
        url: 'https://github.com/test/repo',
        primaryLanguage: null,
        languages: { totalSize: 0, edges: [] },
        defaultBranchRef: null,
        isFork: false,
        parent: null,
        isTemplate: false,
        createdAt: '2020-01-01',
        updatedAt: '2020-01-01',
        pushedAt: null,
        diskUsage: null,
        watchers: { totalCount: 0 },
        issues: { totalCount: 0 },
        pullRequests: { totalCount: 0 },
        licenseInfo: null,
        repositoryTopics: { nodes: [] },
        hasIssuesEnabled: false,
        hasWikiEnabled: false,
        isArchived: false,
        isEmpty: false,
      };

      expect(repo).toBeDefined();
      expectTypeOf(repo.isFork).toBeBoolean();
      expectTypeOf(repo.parent).toEqualTypeOf<{ nameWithOwner: string; url: string } | null>();
    });
  });

  describe('ProgrammingLanguage type', () => {
    it('should have name and color', () => {
      const lang: ProgrammingLanguage = {
        name: 'TypeScript',
        color: '#3178c6',
      };

      expectTypeOf(lang.name).toBeString();
      expectTypeOf(lang.color).toBeString();
    });
  });
});
```

### 7.3 Новые типы для фильтров

**Файл**: `src/types/filters.ts`

```typescript
export type SortField =
  | 'stars'
  | 'forks'
  | 'commits'
  | 'updated'
  | 'created'
  | 'name'
  | 'size';

export type SortDirection = 'asc' | 'desc';

export type RepositoryFilter = {
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

export type RepositorySorting = {
  field: SortField;
  direction: SortDirection;
};
```

**Файл**: `src/types/filters.test.ts` 🆕

```typescript
import { describe, it, expectTypeOf } from 'vitest';
import type { SortField, SortDirection, RepositoryFilter, RepositorySorting } from './filters';

describe('Filter Types', () => {
  it('should accept valid SortField values', () => {
    const field: SortField = 'stars';
    expectTypeOf(field).toEqualTypeOf<SortField>();
  });

  it('should accept valid RepositoryFilter', () => {
    const filter: RepositoryFilter = {
      language: 'TypeScript',
      minStars: 100,
      isFork: false,
      searchQuery: 'test',
    };
    expectTypeOf(filter).toEqualTypeOf<RepositoryFilter>();
  });
});
```

---

## 8. Миграция на shadcn/ui

### 8.1 Компоненты для установки

```bash
# Базовые компоненты
npx shadcn@latest add card
npx shadcn@latest add table
npx shadcn@latest add tabs
npx shadcn@latest add badge
npx shadcn@latest add separator
npx shadcn@latest add skeleton
npx shadcn@latest add avatar
npx shadcn@latest add tooltip
npx shadcn@latest add scroll-area

# Формы
npx shadcn@latest add select
npx shadcn@latest add checkbox
npx shadcn@latest add switch

# Layout
npx shadcn@latest add accordion
npx shadcn@latest add collapsible

# Feedback
npx shadcn@latest add progress
npx shadcn@latest add alert

# Графики
npx shadcn@latest add chart
npm install recharts
```

### 8.2 Workflow после установки shadcn компонента 🆕

**После каждой установки shadcn компонента** (важна последовательность!):

#### Шаг 1: Создать Storybook story (СРАЗУ!)

```typescript
// src/components/ui/card.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './card';

const meta: Meta<typeof Card> = {
  title: 'UI/Card',
  component: Card,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card Description</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Card Content</p>
      </CardContent>
      <CardFooter>
        <p>Card Footer</p>
      </CardFooter>
    </Card>
  ),
};

export const WithoutFooter: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Card Content</p>
      </CardContent>
    </Card>
  ),
};
```

#### Шаг 2: Проверить визуально в Storybook

```bash
npm run storybook
# Открыть http://localhost:6006
# Проверить ВСЕ варианты компонента визуально
# Проверить Accessibility tab (a11y addon)
# Компонент плохо выглядит? Исправить styles и повторить
```

#### Шаг 3: ТЕПЕРЬ создать тест

```typescript
// src/components/ui/card.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Card, CardHeader, CardTitle, CardContent } from './card';

describe('Card', () => {
  it('should render card with content', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Test Title</CardTitle>
        </CardHeader>
        <CardContent>Test Content</CardContent>
      </Card>
    );

    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });
});
```

#### Шаг 4: Запустить тесты

```bash
npm run test -- card.test
# Тесты падают? Исправить КОД (не тесты!)
# Повторять пока все не пройдут
```

#### Шаг 5: Переходить к следующему компоненту

---

## 9. Новая архитектура компонентов

### 9.1 Структура директорий

```
src/components/
├── user/                   # User profile components
├── repository/             # Repository components
├── statistics/             # Charts and stats
├── layout/                 # Reusable layout
├── navigation/             # Navigation
└── ui/                     # shadcn/ui components
```

### 9.2 Workflow для создания компонента 🆕

**Пример**: Создание `UserHeader.tsx`

**ВАЖНО**: Для UI компонентов Storybook идет ДО тестов!

#### Шаг 1: Создать компонент

```typescript
// src/components/user/UserHeader.tsx
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

type UserHeaderProps = {
  avatarUrl: string;
  name: string | null;
  login: string;
  bio: string | null;
  location: string | null;
  url: string;
  createdAt: string;
  authenticityScore?: number;
};

export function UserHeader({
  avatarUrl,
  name,
  login,
  bio,
  location,
  url,
  createdAt,
  authenticityScore,
}: UserHeaderProps) {
  return (
    <div className="flex gap-6">
      <Avatar className="h-32 w-32">
        <AvatarImage src={avatarUrl} alt={`${name || login}'s avatar`} />
        <AvatarFallback>{login.slice(0, 2).toUpperCase()}</AvatarFallback>
      </Avatar>

      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-bold">{name || login}</h1>
          {authenticityScore !== undefined && (
            <Badge variant={getScoreBadgeVariant(authenticityScore)}>
              {authenticityScore}/100
            </Badge>
          )}
        </div>
        <p className="text-muted-foreground text-xl">@{login}</p>
        {bio && <p className="text-base">{bio}</p>}
        {location && (
          <p className="text-muted-foreground flex items-center gap-2 text-sm">
            <span>📍</span> {location}
          </p>
        )}
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary inline-block text-sm hover:underline"
        >
          View on GitHub →
        </a>
      </div>
    </div>
  );
}

function getScoreBadgeVariant(score: number): 'default' | 'secondary' | 'destructive' {
  if (score >= 70) return 'default';
  if (score >= 40) return 'secondary';
  return 'destructive';
}
```

#### Шаг 2: Создать Storybook story (СРАЗУ!)

```typescript
// src/components/user/UserHeader.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { UserHeader } from './UserHeader';

const meta: Meta<typeof UserHeader> = {
  title: 'User/UserHeader',
  component: UserHeader,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof UserHeader>;

export const Default: Story = {
  args: {
    avatarUrl: 'https://avatars.githubusercontent.com/u/583231',
    name: 'John Doe',
    login: 'johndoe',
    bio: 'Full-stack developer passionate about open source',
    location: 'San Francisco, CA',
    url: 'https://github.com/johndoe',
    createdAt: '2020-01-01T00:00:00Z',
    authenticityScore: 85,
  },
};

export const HighScore: Story = {
  args: {
    ...Default.args,
    authenticityScore: 95,
  },
};

export const MediumScore: Story = {
  args: {
    ...Default.args,
    authenticityScore: 55,
  },
};

export const LowScore: Story = {
  args: {
    ...Default.args,
    authenticityScore: 25,
  },
};

export const NoScore: Story = {
  args: {
    ...Default.args,
    authenticityScore: undefined,
  },
};

export const MinimalInfo: Story = {
  args: {
    avatarUrl: 'https://avatars.githubusercontent.com/u/583231',
    name: null,
    login: 'johndoe',
    bio: null,
    location: null,
    url: 'https://github.com/johndoe',
    createdAt: '2020-01-01T00:00:00Z',
  },
};
```

#### Шаг 3: Проверить в Storybook

```bash
npm run storybook
# Открыть http://localhost:6006
# Проверить ВСЕ stories визуально
# Проверить Accessibility tab (a11y addon)
# Компонент выглядит неправильно? Вернуться к Шагу 1 и исправить
```

#### Шаг 4: Создать тесты

```typescript
// src/components/user/UserHeader.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { UserHeader } from './UserHeader';

describe('UserHeader', () => {
  const defaultProps = {
    avatarUrl: 'https://github.com/avatar.png',
    name: 'John Doe',
    login: 'johndoe',
    bio: 'Full-stack developer',
    location: 'San Francisco',
    url: 'https://github.com/johndoe',
    createdAt: '2020-01-01T00:00:00Z',
  };

  describe('rendering', () => {
    it('should render user information', () => {
      render(<UserHeader {...defaultProps} />);

      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('@johndoe')).toBeInTheDocument();
      expect(screen.getByText('Full-stack developer')).toBeInTheDocument();
      expect(screen.getByText('San Francisco')).toBeInTheDocument();
    });

    it('should render avatar image', () => {
      render(<UserHeader {...defaultProps} />);

      const avatar = screen.getByAltText("John Doe's avatar");
      expect(avatar).toBeInTheDocument();
      expect(avatar).toHaveAttribute('src', defaultProps.avatarUrl);
    });

    it('should render without optional fields', () => {
      render(<UserHeader {...defaultProps} bio={null} location={null} name={null} />);

      expect(screen.getByText('@johndoe')).toBeInTheDocument();
      expect(screen.queryByText('Full-stack developer')).not.toBeInTheDocument();
      expect(screen.queryByText('San Francisco')).not.toBeInTheDocument();
    });
  });

  describe('authenticity score', () => {
    it('should render high score with success badge', () => {
      render(<UserHeader {...defaultProps} authenticityScore={85} />);
      expect(screen.getByText('85/100')).toBeInTheDocument();
    });

    it('should render medium score with warning badge', () => {
      render(<UserHeader {...defaultProps} authenticityScore={55} />);
      expect(screen.getByText('55/100')).toBeInTheDocument();
    });

    it('should render low score with danger badge', () => {
      render(<UserHeader {...defaultProps} authenticityScore={25} />);
      expect(screen.getByText('25/100')).toBeInTheDocument();
    });

    it('should not render badge when score is undefined', () => {
      render(<UserHeader {...defaultProps} />);
      expect(screen.queryByText(/\/100/)).not.toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('should have correct link attributes', () => {
      render(<UserHeader {...defaultProps} />);

      const link = screen.getByText('View on GitHub →');
      expect(link).toHaveAttribute('href', defaultProps.url);
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });
  });
});
```

#### Шаг 5: Запустить тесты

```bash
npm run test -- UserHeader.test
```

#### Шаг 6: Проверить coverage

```bash
npm run test:coverage -- UserHeader
```

Должно быть **≥85%**

#### Шаг 7: ТОЛЬКО ТЕПЕРЬ переходить к следующему компоненту

---

## 10. Функционал проверки подлинности

### 10.1 Создание утилиты

**Файл**: `src/lib/authenticity.ts`

```typescript
import type { Repository } from '@/apollo/github-api.types';
import type { AuthenticityScore } from '@/types/metrics';

export function calculateAuthenticityScore(
  repositories: Repository[]
): AuthenticityScore {
  const total = repositories.length;

  if (total === 0) {
    return {
      overallScore: 0,
      breakdown: {
        originalReposPercent: 0,
        activityScore: 0,
        engagementScore: 0,
        codeOwnershipScore: 0,
      },
      flags: {
        hasForkedRepos: false,
        hasInactiveRepos: false,
        hasLowEngagement: false,
      },
    };
  }

  // 1. Original repos (25 points)
  const originalRepos = repositories.filter(r => !r.isFork && !r.isTemplate);
  const originalPercent = (originalRepos.length / total) * 100;
  const originalScore = (originalPercent / 100) * 25;

  // 2. Activity score (25 points)
  const now = new Date();
  const sixMonthsAgo = new Date(now.getTime() - 6 * 30 * 24 * 60 * 60 * 1000);
  const activeRepos = repositories.filter(r => {
    const pushedAt = r.pushedAt ? new Date(r.pushedAt) : new Date(r.createdAt);
    return pushedAt >= sixMonthsAgo;
  });
  const activityPercent = (activeRepos.length / total) * 100;
  const activityScore = (activityPercent / 100) * 25;

  // 3. Engagement score (25 points)
  const avgStars = repositories.reduce((sum, r) => sum + r.stargazerCount, 0) / total;
  const avgForks = repositories.reduce((sum, r) => sum + r.forkCount, 0) / total;
  const avgWatchers = repositories.reduce((sum, r) => sum + r.watchers.totalCount, 0) / total;

  const starsScore = Math.min(Math.log10(avgStars + 1) / Math.log10(100), 1) * 10;
  const forksScore = Math.min(Math.log10(avgForks + 1) / Math.log10(50), 1) * 10;
  const watchersScore = Math.min(Math.log10(avgWatchers + 1) / Math.log10(20), 1) * 5;
  const engagementScore = starsScore + forksScore + watchersScore;

  // 4. Code ownership (25 points)
  const uniqueLanguages = new Set(
    repositories.map(r => r.primaryLanguage?.name).filter(Boolean)
  ).size;

  const avgCommits = repositories.reduce((sum, r) => {
    const commits = r.defaultBranchRef?.target?.history?.totalCount || 0;
    return sum + commits;
  }, 0) / total;

  const avgSize = repositories.reduce((sum, r) => sum + (r.diskUsage || 0), 0) / total;

  const languageScore = Math.min(uniqueLanguages / 10, 1) * 10;
  const commitsScore = Math.min(Math.log10(avgCommits + 1) / Math.log10(100), 1) * 10;
  const sizeScore = Math.min(Math.log10(avgSize + 1) / Math.log10(10000), 1) * 5;
  const codeOwnershipScore = languageScore + commitsScore + sizeScore;

  // Overall
  const overallScore = Math.round(
    originalScore + activityScore + engagementScore + codeOwnershipScore
  );

  // Flags
  const hasForkedRepos = repositories.some(r => r.isFork);
  const hasInactiveRepos = activeRepos.length < total * 0.5;
  const hasLowEngagement = engagementScore < 10;

  return {
    overallScore,
    breakdown: {
      originalReposPercent: Math.round(originalPercent),
      activityScore: Math.round(activityScore),
      engagementScore: Math.round(engagementScore),
      codeOwnershipScore: Math.round(codeOwnershipScore),
    },
    flags: {
      hasForkedRepos,
      hasInactiveRepos,
      hasLowEngagement,
    },
  };
}

export function getScoreColor(score: number): 'default' | 'secondary' | 'destructive' {
  if (score >= 70) return 'default';
  if (score >= 40) return 'secondary';
  return 'destructive';
}

export function getScoreLabel(score: number): string {
  if (score >= 90) return 'Exceptional';
  if (score >= 70) return 'Authentic';
  if (score >= 50) return 'Moderate';
  if (score >= 30) return 'Suspicious';
  return 'Low Activity';
}
```

### 10.2 Тестирование (СРАЗУ!) 🆕

**Файл**: `src/lib/authenticity.test.ts`

```typescript
import { describe, it, expect } from 'vitest';
import { calculateAuthenticityScore, getScoreColor, getScoreLabel } from './authenticity';
import { createMockRepository } from '@/test/mocks/github-data';

describe('calculateAuthenticityScore', () => {
  describe('empty repositories', () => {
    it('should return 0 score for empty array', () => {
      const score = calculateAuthenticityScore([]);

      expect(score.overallScore).toBe(0);
      expect(score.breakdown.originalReposPercent).toBe(0);
      expect(score.breakdown.activityScore).toBe(0);
      expect(score.breakdown.engagementScore).toBe(0);
      expect(score.breakdown.codeOwnershipScore).toBe(0);
      expect(score.flags.hasForkedRepos).toBe(false);
    });
  });

  describe('all original repos', () => {
    it('should give high score for all original repos', () => {
      const repos = [
        createMockRepository({ isFork: false, stargazerCount: 100 }),
        createMockRepository({ isFork: false, stargazerCount: 200 }),
        createMockRepository({ isFork: false, stargazerCount: 150 }),
      ];

      const score = calculateAuthenticityScore(repos);

      expect(score.overallScore).toBeGreaterThan(50);
      expect(score.breakdown.originalReposPercent).toBe(100);
      expect(score.flags.hasForkedRepos).toBe(false);
    });
  });

  describe('mixed repos', () => {
    it('should detect forked repos', () => {
      const repos = [
        createMockRepository({ isFork: true }),
        createMockRepository({ isFork: false }),
      ];

      const score = calculateAuthenticityScore(repos);

      expect(score.breakdown.originalReposPercent).toBe(50);
      expect(score.flags.hasForkedRepos).toBe(true);
    });
  });

  describe('inactive repos', () => {
    it('should detect inactive repos', () => {
      const oldDate = new Date('2020-01-01').toISOString();
      const repos = [
        createMockRepository({ pushedAt: oldDate }),
        createMockRepository({ pushedAt: oldDate }),
        createMockRepository({ pushedAt: oldDate }),
      ];

      const score = calculateAuthenticityScore(repos);

      expect(score.flags.hasInactiveRepos).toBe(true);
      expect(score.breakdown.activityScore).toBe(0);
    });
  });

  describe('high engagement', () => {
    it('should give high engagement score for popular repos', () => {
      const repos = [
        createMockRepository({
          stargazerCount: 1000,
          forkCount: 100,
          watchers: { totalCount: 50 },
        }),
        createMockRepository({
          stargazerCount: 2000,
          forkCount: 200,
          watchers: { totalCount: 80 },
        }),
      ];

      const score = calculateAuthenticityScore(repos);

      expect(score.breakdown.engagementScore).toBeGreaterThan(15);
      expect(score.flags.hasLowEngagement).toBe(false);
    });
  });

  describe('code ownership', () => {
    it('should reward diverse language usage', () => {
      const repos = [
        createMockRepository({ primaryLanguage: { name: 'TypeScript', color: '#3178c6' } }),
        createMockRepository({ primaryLanguage: { name: 'JavaScript', color: '#f1e05a' } }),
        createMockRepository({ primaryLanguage: { name: 'Python', color: '#3572A5' } }),
        createMockRepository({ primaryLanguage: { name: 'Go', color: '#00ADD8' } }),
        createMockRepository({ primaryLanguage: { name: 'Rust', color: '#dea584' } }),
      ];

      const score = calculateAuthenticityScore(repos);

      expect(score.breakdown.codeOwnershipScore).toBeGreaterThan(10);
    });

    it('should reward high commit counts', () => {
      const repos = [
        createMockRepository({
          defaultBranchRef: {
            target: {
              history: { totalCount: 500 },
            },
          },
        }),
      ];

      const score = calculateAuthenticityScore(repos);

      expect(score.breakdown.codeOwnershipScore).toBeGreaterThan(5);
    });
  });
});

describe('getScoreColor', () => {
  it('should return correct colors', () => {
    expect(getScoreColor(90)).toBe('default');
    expect(getScoreColor(70)).toBe('default');
    expect(getScoreColor(50)).toBe('secondary');
    expect(getScoreColor(30)).toBe('destructive');
    expect(getScoreColor(10)).toBe('destructive');
  });
});

describe('getScoreLabel', () => {
  it('should return correct labels', () => {
    expect(getScoreLabel(95)).toBe('Exceptional');
    expect(getScoreLabel(75)).toBe('Authentic');
    expect(getScoreLabel(55)).toBe('Moderate');
    expect(getScoreLabel(35)).toBe('Suspicious');
    expect(getScoreLabel(15)).toBe('Low Activity');
  });
});
```

### 10.3 Запуск тестов

```bash
npm run test -- authenticity.test
npm run test:coverage -- authenticity
```

**Coverage должен быть ≥95%**

---

## 11. Расширенная статистика репозиториев

(Аналогично следует создать утилиты sorting.ts, filtering.ts с тестами)

Структура та же:
1. Создать функцию
2. Сразу создать тест
3. Запустить тест
4. Проверить coverage
5. Только потом переходить к следующей функции

---

## 12. Статистика коммитов

(Аналогично - создать CompitChart.tsx + тесты + stories)

---

## 13. Статистика языков и инструментов

(Аналогично - создать LanguageChart.tsx + тесты + stories)

---

## 14. UI/UX улучшения

(Аналогично - обновить App.tsx + тесты + E2E)

---

## 15. Структура файлов

```
src/
├── apollo/
│   ├── queriers.ts              ✏️ + queriers.test.ts 🆕
│   ├── github-api.types.ts      ✏️ + github-api.types.test.ts 🆕
│   └── useQueryUser.ts          ⚪
│
├── components/
│   ├── user/                    🆕 Каждый с .test.tsx и .stories.tsx
│   ├── repository/              🆕 Каждый с .test.tsx и .stories.tsx
│   ├── statistics/              🆕 Каждый с .test.tsx и .stories.tsx
│   ├── layout/                  🆕 Каждый с .test.tsx и .stories.tsx
│   └── ui/                      Каждый с .test.tsx и .stories.tsx
│
├── lib/
│   ├── authenticity.ts          🆕 + authenticity.test.ts 🆕
│   ├── sorting.ts               🆕 + sorting.test.ts 🆕
│   ├── filtering.ts             🆕 + filtering.test.ts 🆕
│   └── formatters.ts            🆕 + formatters.test.ts 🆕
│
├── hooks/
│   ├── useRepositoryFilters.ts  🆕 + useRepositoryFilters.test.ts 🆕
│   ├── useRepositorySorting.ts  🆕 + useRepositorySorting.test.ts 🆕
│   └── useAuthenticityScore.ts  🆕 + useAuthenticityScore.test.ts 🆕
│
├── types/
│   ├── filters.ts               🆕 + filters.test.ts 🆕
│   └── metrics.ts               🆕 + metrics.test.ts 🆕
│
└── test/
    └── mocks/
        └── github-data.ts       🆕 Централизованные моки
```

---

## 16. Этапы реализации 🆕

### Фаза 1: Подготовка (2-3 дня)

#### 1.1 GraphQL и типы

**Задачи**:

1. ✅ Обновить `src/apollo/queriers.ts`
2. 🧪 Создать `src/apollo/queriers.test.ts`
3. ✅ Запустить тест: `npm run test -- queriers.test`
4. ✅ Ручная проверка в GraphQL Explorer
5. ✅ Обновить `src/apollo/github-api.types.ts`
6. 🧪 Создать `src/apollo/github-api.types.test.ts`
7. ✅ Запустить тест: `npm run test -- github-api.types.test`
8. ✅ Создать `src/types/filters.ts`
9. 🧪 Создать `src/types/filters.test.ts`
10. ✅ Запустить тест: `npm run test -- filters.test`
11. ✅ Создать `src/types/metrics.ts`
12. 🧪 Создать `src/types/metrics.test.ts`
13. ✅ Запустить тест: `npm run test -- metrics.test`
14. ✅ Проверить общий coverage: `npm run test:coverage`

**Критерий завершения**: ✅ Все тесты проходят, coverage ≥90%

#### 1.2 Установка shadcn/ui компонентов

**Задачи** (для КАЖДОГО компонента):

1. ✅ Установить компонент: `npx shadcn@latest add [component]`
2. 📚 СРАЗУ создать `[component].stories.tsx`
3. ✅ Проверить в Storybook: `npm run storybook`
4. ♿ Проверить Accessibility tab (a11y addon)
5. 🔧 Компонент плохо выглядит? Доработать styles и вернуться к шагу 3
6. 🧪 ТЕПЕРЬ создать `[component].test.tsx`
7. ✅ Запустить тест: `npm run test -- [component].test`
8. ➡️ Переходить к следующему компоненту

**Список компонентов**:
- [x] card (+ story → Storybook → test) ✅
- [x] table (+ story → Storybook → test) ✅
- [x] tabs (+ story → Storybook → test) ✅
- [x] badge (+ story → Storybook → test) ✅
- [x] separator (+ story → Storybook → test) ✅
- [x] skeleton (+ story → Storybook → test) ✅
- [x] avatar (+ story → Storybook → test) ✅
- [x] tooltip (+ story → Storybook → test) ✅
- [x] scroll-area (+ story → Storybook → test) ✅
- [x] select (+ story → Storybook → test) ✅
- [x] checkbox (+ story → Storybook → test) ✅
- [x] switch (+ story → Storybook → test) ✅
- [x] accordion (+ story → Storybook → test) ✅
- [x] collapsible (+ story → Storybook → test) ✅
- [x] progress (+ story → Storybook → test) ✅
- [x] alert (+ story → Storybook → test) ✅
- [x] chart (+ story → Storybook → test) ✅

**Критерий завершения**: ✅ Все компоненты в Storybook, все тесты проходят

---

### Фаза 2: Утилиты и хуки (3-4 дня)

#### 2.1 Создание `src/test/mocks/github-data.ts`

**Задачи**:

1. ✅ Создать централизованные моки
2. ✅ Экспортировать factory functions
3. 🧪 Создать `github-data.test.ts` для проверки моков
4. ✅ Запустить тест

#### 2.2 Утилита authenticity

**Задачи**:

1. ✅ Создать `src/lib/authenticity.ts`
2. 🧪 Создать `src/lib/authenticity.test.ts` (СРАЗУ!)
3. ✅ Написать тесты для всех edge cases
4. ✅ Запустить: `npm run test -- authenticity.test`
5. ✅ Проверить coverage: `npm run test:coverage -- authenticity`
6. ✅ Coverage ≥95%? ДА → продолжать, НЕТ → дописать тесты
7. ➡️ Переходить к следующей утилите

#### 2.3 Утилита sorting

**Задачи** (аналогично):

1. ✅ Создать `src/lib/sorting.ts`
2. 🧪 Создать `src/lib/sorting.test.ts`
3. ✅ Тесты + coverage ≥95%
4. ➡️ Следующая утилита

#### 2.4 Утилита filtering

**Задачи** (аналогично):

1. ✅ Создать `src/lib/filtering.ts`
2. 🧪 Создать `src/lib/filtering.test.ts`
3. ✅ Тесты + coverage ≥95%
4. ➡️ Следующая утилита

#### 2.5 Утилита formatters

**Задачи** (аналогично):

1. ✅ Создать `src/lib/formatters.ts`
2. 🧪 Создать `src/lib/formatters.test.ts`
3. ✅ Тесты + coverage ≥95%

#### 2.6 Custom Hooks

**Для КАЖДОГО хука**:

1. ✅ Создать хук
2. 🧪 Создать тест с `@testing-library/react-hooks`
3. ✅ Запустить тест
4. ✅ Coverage ≥90%
5. ➡️ Следующий хук

**Список хуков**:
- [x] useRepositoryFilters (+ test) ✅
- [x] useRepositorySorting (+ test) ✅
- [x] useAuthenticityScore (+ test) ✅

**Критерий завершения**: ✅ Все утилиты и хуки протестированы, coverage ≥90% - ВЫПОЛНЕНО ✅

---

### Фаза 3: Layout компоненты (2-3 дня)

**Для КАЖДОГО компонента** (в новой последовательности):

1. ✅ Создать компонент
2. 📚 СРАЗУ создать Storybook story (все варианты)
3. 👁️ Проверить визуально в Storybook: `npm run storybook`
4. ♿ Accessibility check (a11y addon)
5. 🔧 Плохо выглядит? Исправить компонент и вернуться к шагу 3
6. 🧪 ТЕПЕРЬ создать тест (rendering, props, edge cases)
7. ✅ Запустить тест: `npm run test -- [component].test`
8. ✅ Coverage ≥85%
9. ➡️ Следующий компонент

**Список компонентов**:
- [x] StatsCard (+ story → Storybook → test) ✅
- [x] Section (+ story → Storybook → test) ✅
- [x] EmptyState (+ story → Storybook → test) ✅
- [x] ErrorState (+ story → Storybook → test) ✅
- [x] LoadingState (+ story → Storybook → test) ✅
- [x] ThemeToggle (+ story → Storybook → test) ✅
- [x] MainTabs (+ story → Storybook → test) ✅

**Критерий завершения**: ✅ 7 компонентов с тестами и stories, coverage ≥85% - ВЫПОЛНЕНО ✅

---

### Фаза 4: User компоненты (3-4 дня)

**Для КАЖДОГО компонента** (та же последовательность):

**Список компонентов**:
- [x] UserHeader (+ story → Storybook → test) ✅
- [x] UserStats (+ story → Storybook → test) ✅
- [x] UserAuthenticity (+ story → Storybook → test) ✅
- [x] ContributionHistory (+ story → Storybook → test) ✅
- [x] RecentActivity (+ story → Storybook → test) ✅
- [x] UserProfile контейнер (+ story → Storybook → integration test) ✅

**Критерий завершения**: ✅ 6 компонентов с тестами и stories, coverage ≥85% - ВЫПОЛНЕНО ✅

---

### Фаза 5: Repository компоненты (4-5 дней)

**Для КАЖДОГО компонента** (та же последовательность):

**Список компонентов**:
- [x] RepositoryCard (+ story → Storybook → test) ✅
- [x] RepositoryList (+ story → Storybook → integration test) ✅
- [x] RepositoryTable (+ story → Storybook → test) ✅
- [x] RepositoryFilters (+ story → Storybook → test) ✅
- [x] RepositorySorting (+ story → Storybook → test) ✅
- [x] RepositoryEmpty (+ story → Storybook → test) ✅
- [x] RepositoryPagination (+ story → Storybook → test) ✅

**Критерий завершения**: ✅ 7 компонентов с тестами и stories, coverage ≥85% - ВЫПОЛНЕНО ✅

---

### Фаза 6: Statistics компоненты (3-4 дня)

**Для КАЖДОГО компонента** (та же последовательность):

**Список компонентов**:
- [x] CommitChart (+ story → Storybook → test) ✅
- [x] LanguageChart (+ story → Storybook → test) ✅
- [x] ActivityChart (+ story → Storybook → test) ✅
- [x] StatsOverview контейнер (+ story → Storybook → test) ✅

**Критерий завершения**: ✅ 4 компонента с тестами и stories, coverage ≥85% - ВЫПОЛНЕНО ✅

---

### Фаза 7: Интеграция (2-3 дня)

**Задачи**:

1. ✅ Обновить `src/App.tsx`
2. 🧪 Обновить `src/App.test.tsx`
3. ✅ Запустить unit тесты
4. 🧪 Создать E2E тест `e2e/full-flow.spec.ts`
5. ✅ Запустить E2E: `npm run test:e2e`
6. ✅ Обновить `src/main.tsx`
7. ✅ Обновить `src/index.css`
8. ✅ Обновить `SearchForm.tsx`
9. 🧪 Обновить `SearchForm.test.tsx`
10. 📚 Обновить `SearchForm.stories.tsx`

**Критерий завершения**: ✅ Все интеграционные тесты проходят, E2E тесты проходят

---

### Фаза 8: E2E тестирование (2-3 дня)

**Задачи**:

1. 🧪 Обновить `e2e/user-search.spec.ts`
2. 🧪 Создать `e2e/repository-filtering.spec.ts`
3. 🧪 Создать `e2e/repository-sorting.spec.ts`
4. ���� Создать `e2e/tabs-navigation.spec.ts`
5. 🧪 Создать `e2e/theme-toggle.spec.ts`
6. 🧪 Создать `e2e/responsive.spec.ts`
7. 🧪 Создать `e2e/error-handling.spec.ts`
8. ✅ Запустить все E2E: `npm run test:e2e`
9. ✅ Все проходят? ДА → продолжать, НЕТ → фиксить

**Критерий завершения**: ✅ Все E2E тесты проходят

---

### Фаза 9: Coverage и Code Review (1-2 дня)

**Задачи**:

1. ✅ Запустить полный coverage: `npm run test:coverage`
2. ✅ Проверить общий coverage ≥90%
3. ✅ Если <90%, дописать недостающие тесты
4. ✅ Проверить все Storybook stories: `npm run build-storybook`
5. ✅ Visual regression (optional: Chromatic)
6. ✅ Accessibility audit в Storybook
7. ✅ Self code review (проверка всех компонентов)
8. ✅ Проверка TypeScript errors: `npm run build`

**Критерий завершения**: ✅ Coverage ≥90%, все тесты проходят, билд успешен

---

### Фаза 10: Оптимизация и документация (2-3 дня)

**Задачи**:

1. ✅ Performance оптимизация (React.memo, useMemo)
2. ✅ Bundle анализ: `npm run build -- --mode production`
3. ✅ Lazy loading для тяжелых компонентов
4. ✅ Обновить README.md
5. ✅ Обновить CLAUDE.md
6. ✅ Создать docs/components-guide.md
7. ✅ JSDoc комментарии для всех public API

**Критерий завершения**: ✅ Документация готова, производительность ок

---

## 17. Дополнительные возможности

(Export, comparison, heatmap - опциональны, но если делать, то с тестами!)

---

## 18. Технические соображения

### 18.1 Performance

- React.memo для тяжелых компонентов
- useMemo для дорогих вычислений
- Lazy loading
- Virtual scrolling

### 18.2 Error Handling

- Error Boundaries
- Toast notifications
- Retry mechanisms

### 18.3 Accessibility

- ARIA labels
- Keyboard navigation
- Screen reader support

### 18.4 Security

- XSS protection
- Token security
- Input validation

---

## 19. Финальный аудит плана 🆕

### 19.1 Best Practices Checklist

#### TypeScript

- [x] 100% TypeScript (no any types)
- [x] Strict mode enabled
- [x] Все типы экспортированы
- [x] Generic types для переиспользования
- [x] Type guards где необходимо

#### Testing

- [x] TDD подход (тесты сразу после кода)
- [x] ≥90% unit test coverage
- [x] ≥85% component test coverage
- [x] 100% critical paths в E2E
- [x] Storybook для всех UI компонентов
- [x] Централизованные моки
- [x] Accessibility testing

#### Code Quality

- [x] ESLint правила соблюдены
- [x] Prettier formatting
- [x] No console.log (только warn/error)
- [x] Meaningful variable names
- [x] Small, focused functions
- [x] DRY principle
- [x] SOLID principles

#### React Best Practices

- [x] Functional components only
- [x] Custom hooks для логики
- [x] Props destructuring
- [x] Controlled components
- [x] Proper key props в списках
- [x] Error boundaries
- [x] Loading states
- [x] Empty states
- [x] Memo для performance

#### Apollo Client

- [x] Правильная настройка cache
- [x] Error handling через errorLink
- [x] Loading states
- [x] Pagination support
- [x] MockedProvider в тестах

#### shadcn/ui

- [x] Только shadcn компоненты для UI
- [x] Кастомизация через Tailwind
- [x] Accessibility из коробки
- [x] Dark mode support
- [x] Responsive design

#### Accessibility

- [x] Semantic HTML
- [x] ARIA labels
- [x] Keyboard navigation
- [x] Focus management
- [x] Screen reader support
- [x] Color contrast (WCAG AA)

#### Performance

- [x] Code splitting
- [x] Lazy loading
- [x] Memo/useMemo/useCallback
- [x] Virtual scrolling (для списков)
- [x] Debounce для search/filters
- [x] Optimistic UI updates
- [x] Bundle size < 500KB gzipped

#### Documentation

- [x] README с инструкциями
- [x] JSDoc комментарии
- [x] Storybook documentation
- [x] Component examples
- [x] API reference
- [x] Architecture guide

#### Git Workflow

- [x] Meaningful commit messages
- [x] Feature branches
- [x] Pull requests
- [x] Code review
- [x] Не коммитить .env файлы
- [x] Не коммитить node_modules

### 19.2 Security Checklist

- [x] GitHub token в .env.local (не в коде)
- [x] .env.local в .gitignore
- [x] XSS protection (DOMPurify для HTML)
- [x] Input validation
- [x] HTTPS only
- [x] No eval()
- [x] No dangerouslySetInnerHTML без санитизации
- [x] Dependency audit: `npm audit`

### 19.3 Testing Strategy Audit

| Тип теста | Coverage | Инструмент | Статус |
|-----------|----------|------------|--------|
| Unit (lib/) | ≥95% | Vitest | ✅ Запланировано |
| Unit (hooks/) | ≥90% | Vitest | ✅ Запланировано |
| Component | ≥85% | Vitest + RTL | ✅ Запланировано |
| Integration | ≥80% | Vitest + MockedProvider | ✅ Запланировано |
| E2E | Critical paths | Playwright | ✅ Запланировано |
| Visual | UI components | Storybook | ✅ Запланировано |
| Accessibility | UI components | Storybook a11y addon | ✅ Запланировано |

### 19.4 Performance Budget

| Метрика | Target | Measurement |
|---------|--------|-------------|
| Bundle Size | <500KB gzipped | vite build |
| FCP (First Contentful Paint) | <1.5s | Lighthouse |
| LCP (Largest Contentful Paint) | <2.5s | Lighthouse |
| TTI (Time to Interactive) | <3.5s | Lighthouse |
| CLS (Cumulative Layout Shift) | <0.1 | Lighthouse |

### 19.5 Accessibility Audit

**WCAG 2.1 Level AA Requirements**:

- [x] Color contrast ≥4.5:1 (text)
- [x] Color contrast ≥3:1 (UI components)
- [x] Keyboard accessible
- [x] Focus indicators
- [x] ARIA labels
- [x] Semantic HTML
- [x] Alt text для изображений
- [x] Form labels
- [x] Error identification
- [x] Heading hierarchy

### 19.6 Browser Support

- [x] Chrome (latest 2 versions)
- [x] Firefox (latest 2 versions)
- [x] Safari (latest 2 versions)
- [x] Edge (latest 2 versions)
- [x] Mobile Safari (iOS 14+)
- [x] Chrome Mobile (Android 10+)

### 19.7 Responsive Breakpoints

```css
/* Mobile First */
sm: 640px   /* Small devices (phones) */
md: 768px   /* Medium devices (tablets) */
lg: 1024px  /* Large devices (desktops) */
xl: 1280px  /* Extra large devices */
2xl: 1536px /* Ultra wide */
```

### 19.8 Code Organization Audit

**Хорошо организованный код**:

- [x] Логическая структура директорий
- [x] Одна ответственность на файл
- [x] Переиспользуемые компоненты
- [x] Централизованные типы
- [x] Централизованные моки
- [x] Централизованные утилиты
- [x] Нет циклических зависимостей
- [x] Понятные имена файлов

### 19.9 Error Handling Strategy

**Все уровни покрыты**:

- [x] GraphQL errors (Apollo errorLink)
- [x] Network errors (Apollo errorLink)
- [x] Component errors (Error Boundaries)
- [x] Validation errors (Form validation)
- [x] User feedback (Toast notifications)
- [x] Retry mechanisms

### 19.10 Final Checklist

**Перед запуском в продакшн**:

- [ ] Все тесты проходят (`npm run test:all`)
- [ ] Coverage ≥90% (`npm run test:coverage`)
- [ ] Build успешен (`npm run build`)
- [ ] Storybook собирается (`npm run build-storybook`)
- [ ] E2E тесты проходят (`npm run test:e2e`)
- [ ] Lighthouse score ≥90
- [ ] Accessibility audit пройден
- [ ] Security audit пройден (`npm audit`)
- [ ] Документация обновлена
- [ ] README актуален
- [ ] .env.example актуален
- [ ] Нет TODO/FIXME комментариев
- [ ] Нет закомментированного кода
- [ ] Нет console.log

---

## 20. Документация

### 20.1 README.md

**Обновить с**:
- Новыми фичами
- Скриншотами
- Инструкциями по запуску
- Списком компонентов
- Testing guide

### 20.2 Component Documentation

**Для каждого компонента**:
- JSDoc комментарии
- Props documentation
- Usage examples
- Storybook stories

### 20.3 Architecture Documentation

**Создать**:
- `docs/architecture.md`
- `docs/components-guide.md`
- `docs/testing-guide.md`
- `docs/api-reference.md`

---

## Итого

### Ключевые изменения в v2.1:

1. ✅ **Test-After Development** - код → тесты → исправление → следующая задача
2. ✅ **Правила тестирования** - детальные требования для каждого типа
3. ✅ **Централизованные моки** - переиспользуемые тестовые данные
4. ✅ **Coverage требования** - минимум 90% общий, 95% для утилит
5. ✅ **Storybook обязателен** - 100% UI компонентов
6. ✅ **Финальный аудит** - полная проверка best practices
7. ✅ **Немедленное исправление** - если тест падает, исправлять код сразу

### Оценка времени:

**Минимум**: 30-35 дней (с учетом написания тестов)
**Максимум**: 40-45 дней (с багфиксингом)

**С командой 2-3 человека**: 20-25 дней

### Гарантии качества:

- ✅ 90%+ test coverage
- ✅ 100% TypeScript
- ✅ 100% Storybook для UI
- ✅ All E2E tests pass
- ✅ Accessibility compliant
- ✅ Production-ready code

---

**Автор**: Claude Code
**Дата**: 2025-11-05
**Версия**: 2.1 (Test-After Development Edition)
**Статус**: Утвержден
