# Component Development - Workflow разработки

> Полное руководство по разработке React компонентов с shadcn/ui, Storybook и TypeScript

## Содержание

- [Обзор](#обзор)
- [Development Workflow](#development-workflow)
- [shadcn/ui Components](#shadcnui-components)
- [Storybook Documentation](#storybook-documentation)
- [Component Testing](#component-testing)
- [TypeScript Patterns](#typescript-patterns)
- [Styling with Tailwind](#styling-with-tailwind)
- [Best Practices](#best-practices)

---

## Обзор

### Tech Stack

| Инструмент | Версия | Назначение |
|-----------|--------|------------|
| **React** | 19.2.0 | UI framework |
| **TypeScript** | 5.8.3 | Type safety |
| **Vite** | 7.1.2 | Build tool & dev server |
| **shadcn/ui** | Latest | Component library |
| **Tailwind CSS** | 4.1.12 | Styling |
| **Storybook** | 10.0.3 | Component documentation |
| **Vitest** | 4.0.6 | Unit testing |

### Component Architecture

```
src/components/
├── ui/                      # shadcn/ui base components
│   ├── button.tsx
│   ├── input.tsx
│   ├── label.tsx
│   └── *.stories.tsx       # Storybook stories
├── SearchForm.tsx           # Feature components
├── SearchForm.test.tsx      # Tests
├── SearchForm.stories.tsx   # Storybook documentation
└── UserProfile.tsx
```

---

## Development Workflow

### Пошаговый процесс создания компонента

#### 1. Design & Planning

**Вопросы перед началом:**
- Какие props нужны компоненту?
- Будет ли компонент stateful или stateless?
- Нужны ли shadcn/ui компоненты?
- Как будет тестироваться?

**Пример планирования:**
```typescript
// SearchForm Component Planning
// Props: userName (string), setUserName (function)
// State: local text input state
// UI: Input + Button from shadcn/ui
// Validation: Client-side empty check
// Testing: Unit tests + Storybook stories
```

#### 2. Create Component File

```bash
# Создать файл компонента
touch src/components/MyComponent.tsx
```

```typescript
// src/components/MyComponent.tsx
type Props = {
  title: string
  onAction: () => void
}

/**
 * MyComponent description
 *
 * Detailed description of what the component does.
 *
 * @param props - Component props
 * @param props.title - Title text
 * @param props.onAction - Callback function
 * @returns MyComponent JSX
 *
 * @example
 * ```typescript
 * <MyComponent title="Hello" onAction={() => console.log('clicked')} />
 * ```
 */
function MyComponent({ title, onAction }: Props) {
  return (
    <div>
      <h1>{title}</h1>
      <button onClick={onAction}>Click</button>
    </div>
  )
}

export default MyComponent
```

#### 3. Add Storybook Stories

```bash
# Создать stories файл
touch src/components/MyComponent.stories.tsx
```

```typescript
// src/components/MyComponent.stories.tsx
import type { Meta, StoryObj } from '@storybook/react'
import MyComponent from './MyComponent'

const meta: Meta<typeof MyComponent> = {
  title: 'Components/MyComponent',
  component: MyComponent,
  tags: ['autodocs'], // ✅ Auto-generate docs
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    title: {
      control: 'text',
      description: 'Title text to display',
    },
    onAction: {
      action: 'onAction', // ✅ Log action in Storybook
      description: 'Callback when button clicked',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

// ✅ Default story
export const Default: Story = {
  args: {
    title: 'Hello World',
  },
}

// ✅ Different variants
export const LongTitle: Story = {
  args: {
    title: 'This is a very long title that might wrap to multiple lines',
  },
}

export const Interactive: Story = {
  render: () => {
    return (
      <MyComponent
        title="Interactive Example"
        onAction={() => alert('Button clicked!')}
      />
    )
  },
}
```

#### 4. Write Tests

```bash
# Создать test файл
touch src/components/MyComponent.test.tsx
```

```typescript
// src/components/MyComponent.test.tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import MyComponent from './MyComponent'

describe('MyComponent', () => {
  it('renders title', () => {
    render(<MyComponent title="Test Title" onAction={vi.fn()} />)
    expect(screen.getByText('Test Title')).toBeInTheDocument()
  })

  it('calls onAction when button clicked', async () => {
    const mockAction = vi.fn()
    const user = userEvent.setup()

    render(<MyComponent title="Test" onAction={mockAction} />)

    await user.click(screen.getByRole('button', { name: /click/i }))
    expect(mockAction).toHaveBeenCalledTimes(1)
  })
})
```

#### 5. Run & Verify

```bash
# ✅ Запустить Storybook
npm run storybook

# ✅ Запустить тесты
npm test MyComponent.test.tsx

# ✅ Проверить типы
npm run type-check

# ✅ Запустить dev сервер
npm run dev
```

---

## shadcn/ui Components

### Установка компонентов

```bash
# ✅ Добавить новый компонент
npx shadcn@latest add button
npx shadcn@latest add input
npx shadcn@latest add card

# ✅ Обновить существующие
npx shadcn@latest update
```

### Структура shadcn/ui

```
src/components/ui/
├── button.tsx          # Button component
├── input.tsx           # Input component
├── label.tsx           # Label component
└── button.stories.tsx  # Storybook stories
```

### Использование shadcn/ui компонентов

```typescript
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

function SearchForm() {
  return (
    <form>
      <Label htmlFor="search">Search</Label>
      <Input
        id="search"
        type="text"
        placeholder="Search..."
        className="flex-grow bg-background"
      />
      <Button type="submit">Search</Button>
    </form>
  )
}
```

### Кастомизация shadcn/ui

```typescript
// ✅ Используй className для кастомизации
<Button className="bg-primary hover:bg-primary/90">
  Custom Button
</Button>

// ✅ Добавь variant prop (если поддерживается)
<Button variant="destructive">Delete</Button>
<Button variant="outline">Cancel</Button>

// ✅ Размеры
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>
```

### Создание Storybook для shadcn/ui

**Пример:** `src/components/ui/button.stories.tsx`

```typescript
import type { Meta, StoryObj } from '@storybook/react'
import { Button } from './button'

const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg', 'icon'],
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: 'Button',
  },
}

export const Destructive: Story = {
  args: {
    variant: 'destructive',
    children: 'Delete',
  },
}

export const Outline: Story = {
  args: {
    variant: 'outline',
    children: 'Cancel',
  },
}

// ✅ Все варианты в одной story
export const AllVariants: Story = {
  render: () => (
    <div className="flex gap-2 flex-wrap">
      <Button>Default</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
    </div>
  ),
}

export const AllSizes: Story = {
  render: () => (
    <div className="flex gap-2 items-center">
      <Button size="sm">Small</Button>
      <Button size="default">Default</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
}
```

---

## Storybook Documentation

### Meta Configuration

```typescript
const meta: Meta<typeof Component> = {
  // ✅ Title определяет путь в sidebar
  title: 'Components/MyComponent',
  // или для UI компонентов
  title: 'UI/Button',

  // ✅ Component для type inference
  component: MyComponent,

  // ✅ Tags
  tags: ['autodocs'], // Auto-generate docs page

  // ✅ Parameters
  parameters: {
    layout: 'centered', // 'centered' | 'fullscreen' | 'padded'
    docs: {
      description: {
        component: 'Detailed component description for docs page',
      },
    },
  },

  // ✅ ArgTypes для controls
  argTypes: {
    title: {
      control: 'text',
      description: 'Title text',
      defaultValue: 'Hello',
    },
    onClick: {
      action: 'clicked', // Logs action in Actions panel
      description: 'Click handler',
    },
    variant: {
      control: 'select',
      options: ['primary', 'secondary'],
    },
    disabled: {
      control: 'boolean',
    },
  },

  // ✅ Decorators для всех stories
  decorators: [
    (Story) => (
      <div style={{ padding: '20px' }}>
        <Story />
      </div>
    ),
  ],
}
```

### Story Patterns

#### 1. Simple Story

```typescript
export const Default: Story = {
  args: {
    title: 'Hello World',
    onClick: () => {},
  },
}
```

#### 2. Multiple Variants

```typescript
export const Primary: Story = {
  args: { variant: 'primary' },
}

export const Secondary: Story = {
  args: { variant: 'secondary' },
}

export const Disabled: Story = {
  args: { disabled: true },
}
```

#### 3. Render Function

```typescript
export const Interactive: Story = {
  render: (args) => {
    const [count, setCount] = useState(0)

    return (
      <div>
        <Button {...args} onClick={() => setCount(c => c + 1)}>
          Clicked {count} times
        </Button>
      </div>
    )
  },
}
```

#### 4. With State (Wrapper Component)

```typescript
// ✅ Wrapper для stateful компонентов
const SearchFormWrapper = (args: { userName: string }) => {
  const [userName, setUserName] = useState(args.userName)

  return (
    <SearchForm
      userName={userName}
      setUserName={setUserName}
    />
  )
}

export const Default: Story = {
  render: () => <SearchFormWrapper userName="" />,
}

export const WithInitialValue: Story = {
  render: () => <SearchFormWrapper userName="octocat" />,
}
```

#### 5. With Mocked Data

```typescript
export const WithUserData: Story = {
  render: () => {
    const mockUser = {
      name: 'The Octocat',
      login: 'octocat',
      bio: 'GitHub mascot',
      followers: { totalCount: 10000 },
    }

    return <UserProfile user={mockUser} />
  },
}
```

#### 6. With Apollo MockedProvider

```typescript
import { MockedProvider } from '@apollo/client/testing'
import { GET_USER_INFO } from '@/apollo/queriers'

export const WithGraphQLData: Story = {
  render: () => {
    const mocks = [
      {
        request: {
          query: GET_USER_INFO,
          variables: { login: 'octocat' },
        },
        result: {
          data: {
            user: {
              name: 'The Octocat',
              // ... data
            },
          },
        },
      },
    ]

    return (
      <MockedProvider mocks={mocks}>
        <UserProfile userName="octocat" />
      </MockedProvider>
    )
  },
}
```

### Storybook Addons

```typescript
// ✅ Actions panel
argTypes: {
  onClick: { action: 'clicked' },
  onChange: { action: 'changed' },
}

// ✅ Controls panel
argTypes: {
  text: { control: 'text' },
  number: { control: 'number' },
  boolean: { control: 'boolean' },
  select: { control: 'select', options: ['a', 'b'] },
  radio: { control: 'radio', options: ['a', 'b'] },
  color: { control: 'color' },
}

// ✅ Docs page customization
parameters: {
  docs: {
    description: {
      story: 'Description for this specific story',
    },
  },
}
```

### Команды Storybook

```bash
# ✅ Запустить Storybook dev
npm run storybook
# http://localhost:6006

# ✅ Build Storybook static
npm run build-storybook

# ✅ Посмотреть built Storybook
npx http-server storybook-static
```

---

## Component Testing

### Testing Strategy

**Что тестировать:**
- ✅ Рендеринг с разными props
- ✅ User interactions (clicks, typing)
- ✅ State changes
- ✅ Error states
- ✅ Edge cases
- ✅ Accessibility

**Что не тестировать:**
- ❌ Styling (используй Storybook для визуальных тестов)
- ❌ Implementation details
- ❌ Third-party libraries

### Testing Patterns

#### 1. Rendering Tests

```typescript
it('renders with required props', () => {
  render(<Component title="Test" />)
  expect(screen.getByText('Test')).toBeInTheDocument()
})
```

#### 2. User Interaction Tests

```typescript
it('calls callback on button click', async () => {
  const mockHandler = vi.fn()
  const user = userEvent.setup()

  render(<Component onAction={mockHandler} />)
  await user.click(screen.getByRole('button'))

  expect(mockHandler).toHaveBeenCalledTimes(1)
})
```

#### 3. Form Tests

```typescript
it('updates input value when typing', async () => {
  const user = userEvent.setup()
  render(<SearchForm />)

  const input = screen.getByPlaceholderText(/search/i)
  await user.type(input, 'test')

  expect(input).toHaveValue('test')
})

it('shows validation error for empty input', async () => {
  const user = userEvent.setup()
  render(<Form />)

  await user.click(screen.getByRole('button', { name: /submit/i }))

  expect(screen.getByText(/required/i)).toBeInTheDocument()
})
```

#### 4. Apollo Component Tests

```typescript
vi.mock('@/apollo/useQueryUser', () => ({
  default: vi.fn(),
}))

it('renders loading state', () => {
  vi.mocked(useQueryUser).mockReturnValue({
    data: null,
    loading: true,
    error: undefined,
  })

  render(<UserProfile userName="test" />)
  expect(screen.getByText(/loading/i)).toBeInTheDocument()
})
```

#### 5. Accessibility Tests

```typescript
it('has accessible label', () => {
  render(<Input label="Username" />)
  expect(screen.getByLabelText('Username')).toBeInTheDocument()
})

it('button has correct aria attributes', () => {
  render(<Button disabled>Submit</Button>)
  const button = screen.getByRole('button')
  expect(button).toHaveAttribute('aria-disabled', 'true')
})
```

---

## TypeScript Patterns

### Component Props

```typescript
// ✅ Type для props
type Props = {
  title: string
  count: number
  optional?: string
  callback: (value: string) => void
}

function Component({ title, count, optional, callback }: Props) {
  return <div>{title}</div>
}
```

### Component with Children

```typescript
type Props = {
  children: React.ReactNode
  className?: string
}

function Container({ children, className }: Props) {
  return <div className={className}>{children}</div>
}
```

### Generic Components

```typescript
type Props<T> = {
  items: T[]
  renderItem: (item: T) => React.ReactNode
}

function List<T>({ items, renderItem }: Props<T>) {
  return <ul>{items.map(renderItem)}</ul>
}

// Usage
<List<User>
  items={users}
  renderItem={user => <li>{user.name}</li>}
/>
```

### Event Handlers

```typescript
type Props = {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}
```

### Ref Types

```typescript
// ✅ Input ref
const inputRef = useRef<HTMLInputElement>(null)
<input ref={inputRef} />

// ✅ Div ref
const divRef = useRef<HTMLDivElement>(null)
<div ref={divRef} />

// ✅ forwardRef (React 18 style)
const Input = forwardRef<HTMLInputElement, Props>(
  function Input(props, ref) {
    return <input ref={ref} {...props} />
  }
)

// ✅ React 19 style (ref as prop)
type Props = {
  ref?: React.Ref<HTMLInputElement>
}

function Input({ ref, ...props }: Props) {
  return <input ref={ref} {...props} />
}
```

---

## Styling with Tailwind

### Tailwind v4 Usage

```typescript
// ✅ Базовые utility classes
<div className="flex items-center gap-2 p-4">
  <h1 className="text-3xl font-bold">Title</h1>
  <p className="text-muted-foreground">Description</p>
</div>

// ✅ Responsive design
<div className="flex flex-col md:flex-row lg:grid lg:grid-cols-3">
  {/* Responsive layout */}
</div>

// ✅ Hover states
<button className="bg-primary hover:bg-primary/90 transition-colors">
  Hover me
</button>

// ✅ Dark mode
<div className="bg-white dark:bg-black text-black dark:text-white">
  {/* Theme-aware */}
</div>
```

### Динамические классы

```typescript
// ✅ Conditional classes
<button className={`
  btn
  ${isActive ? 'bg-primary' : 'bg-secondary'}
  ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
`}>
  Button
</button>

// ✅ С clsx/classnames (рекомендуется)
import clsx from 'clsx'

<button className={clsx(
  'btn',
  isActive && 'bg-primary',
  disabled && 'opacity-50 cursor-not-allowed'
)}>
  Button
</button>
```

### CSS Variables (Tailwind v4)

```css
/* src/index.css */
@import "tailwindcss";

@theme {
  --color-primary: #3b82f6;
  --color-secondary: #8b5cf6;
  --spacing-card: 1rem;
}
```

```typescript
// ✅ Использование в компонентах
<div className="bg-primary text-white p-card">
  Custom theme colors
</div>
```

---

## Best Practices

### 1. Component Structure

```typescript
// ✅ Хорошая структура:

/**
 * JSDoc comment
 */
function Component({ prop1, prop2 }: Props) {
  // 1. Hooks
  const [state, setState] = useState()
  const ref = useRef()

  // 2. Derived state
  const computed = useMemo(() => calculate(state), [state])

  // 3. Effects
  useEffect(() => {
    // Side effects
  }, [])

  // 4. Event handlers
  function handleClick() {
    // Handler logic
  }

  // 5. Render helpers
  function renderItem(item) {
    return <div>{item}</div>
  }

  // 6. Return JSX
  return <div>{/* JSX */}</div>
}
```

### 2. Props Best Practices

```typescript
// ✅ Хорошо: Explicit props
type Props = {
  title: string
  onClose: () => void
}

// ❌ Плохо: Слишком много props
type Props = {
  prop1, prop2, prop3, prop4, prop5, prop6, prop7 // Слишком много!
}

// ✅ Решение: Группируй связанные props
type UserData = {
  name: string
  email: string
  avatar: string
}

type Props = {
  user: UserData
  onUpdate: (user: UserData) => void
}
```

### 3. State Management

```typescript
// ✅ Хорошо: Local state для UI state
function Component() {
  const [isOpen, setIsOpen] = useState(false)
  return <Modal open={isOpen} />
}

// ✅ Хорошо: Props для data
function Component({ user }: { user: User }) {
  return <div>{user.name}</div>
}

// ❌ Плохо: Props для UI state (если не нужно родителю)
function Component({ isOpen, setIsOpen }: Props) {
  // UI state должен быть локальным
}
```

### 4. Performance

```typescript
// ✅ useMemo для expensive вычислений
const sortedItems = useMemo(() => {
  return items.sort((a, b) => a.value - b.value)
}, [items])

// ✅ useCallback для callbacks
const handleClick = useCallback(() => {
  doSomething(value)
}, [value])

// ⚠️ Не оптимизируй преждевременно
// React 19 Compiler автоматически оптимизирует
```

### 5. Accessibility

```typescript
// ✅ Semantic HTML
<button type="button">Click</button>

// ✅ Labels для inputs
<label htmlFor="username">Username</label>
<input id="username" />

// ✅ Alt text для images
<img src="..." alt="Profile picture" />

// ✅ ARIA attributes когда нужны
<button aria-label="Close dialog" onClick={onClose}>
  <X />
</button>
```

### 6. Error Boundaries

```typescript
// ✅ Error boundary для production
class ErrorBoundary extends React.Component {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    console.error('Error:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return <div>Something went wrong</div>
    }
    return this.props.children
  }
}

// Usage
<ErrorBoundary>
  <App />
</ErrorBoundary>
```

---

## Checklist для нового компонента

### Перед началом
- [ ] Определить props interface
- [ ] Проверить есть ли похожие компоненты
- [ ] Выбрать shadcn/ui компоненты если нужны

### Разработка
- [ ] Создать TypeScript типы
- [ ] Написать JSDoc комментарии
- [ ] Добавить prop validation
- [ ] Обработать edge cases
- [ ] Добавить accessibility attributes

### Storybook
- [ ] Создать `.stories.tsx` файл
- [ ] Добавить meta configuration
- [ ] Создать минимум 3 stories (Default, Variants, Interactive)
- [ ] Добавить argTypes для controls
- [ ] Проверить autodocs page

### Testing
- [ ] Создать `.test.tsx` файл
- [ ] Написать rendering tests
- [ ] Написать interaction tests
- [ ] Написать edge case tests
- [ ] Проверить coverage (85%+)

### Code Quality
- [ ] TypeScript без ошибок
- [ ] ESLint без warnings
- [ ] Prettier форматирование
- [ ] Нет console.log
- [ ] Код review ready

---

## Полезные ссылки

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Storybook Documentation](https://storybook.js.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [React Testing Library](https://testing-library.com/react)

---

## Дополнительная документация

- [Testing Guide](./testing-guide.md) - Стратегия тестирования
- [Tailwind v4 Migration](./tailwind-v4-migration.md) - Tailwind CSS v4
- [React 19 Features](./react-19-features.md) - Новые фичи React 19
- [TypeScript Guide](./typescript-guide.md) - TypeScript конфигурация

---

**Последнее обновление:** Ноябрь 2025
**React:** 19.2.0 | **Storybook:** 10.0.3
**Статус:** ✅ Production Ready
