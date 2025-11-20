# React 19 - Новые фичи и изменения

> Полное руководство по новым возможностям React 19 и миграции с React 18

## Содержание

- [Обзор React 19](#обзор-react-19)
- [Новые хуки](#новые-хуки)
- [Form Actions](#form-actions)
- [React Compiler](#react-compiler)
- [Breaking Changes](#breaking-changes)
- [Улучшения производительности](#улучшения-производительности)
- [Новые API](#новые-api)
- [Миграция с React 18](#миграция-с-react-18)
- [Best Practices](#best-practices)

---

## Обзор React 19

**Версия проекта:** React 19.2.0

### Основные нововведения

| Фича                 | Описание                       | Статус          |
| -------------------- | ------------------------------ | --------------- |
| **useOptimistic**    | Оптимистичные обновления UI    | ✅ Stable       |
| **use hook**         | Чтение промисов и контекста    | ✅ Stable       |
| **Form Actions**     | Декларативная работа с формами | ✅ Stable       |
| **React Compiler**   | Автоматическая оптимизация     | 🚧 Experimental |
| **ref as prop**      | Ref как обычный prop           | ✅ Stable       |
| **Async components** | Server Components              | 🚧 Experimental |

### Что изменилось с React 18

```diff
React 18 (2022)
- useOptimistic ❌
- use() hook ❌
- Form Actions ❌
- defaultProps ✅
- ref forwardRef required ✅

React 19 (2024)
+ useOptimistic ✅
+ use() hook ✅
+ Form Actions ✅
- defaultProps ❌ (deprecated)
+ ref as prop ✅ (no forwardRef needed)
```

---

## Новые хуки

### 1. useOptimistic

**Назначение:** Оптимистичные обновления UI перед завершением async операции.

**Use case:** Формы, лайки, комментарии - UI обновляется мгновенно, откатывается при ошибке.

#### Синтаксис

```typescript
const [optimisticState, addOptimistic] = useOptimistic(state, updateFn);
```

#### Пример: Optimistic Form Submit

```typescript
'use client'
import { useOptimistic, useState } from 'react'

type Message = {
  id: number
  text: string
  sending?: boolean
}

function MessageList() {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: 'Hello!' },
    { id: 2, text: 'How are you?' },
  ])

  // ✅ useOptimistic для мгновенного UI
  const [optimisticMessages, addOptimisticMessage] = useOptimistic(
    messages,
    (state, newMessage: Message) => [
      ...state,
      { ...newMessage, sending: true }
    ]
  )

  async function sendMessage(formData: FormData) {
    const text = formData.get('message') as string

    // ✅ Мгновенно добавить в UI
    addOptimisticMessage({
      id: Date.now(),
      text,
    })

    try {
      // ✅ Отправить на сервер
      const newMessage = await saveMessageToAPI(text)

      // ✅ Обновить реальное состояние
      setMessages(prev => [...prev, newMessage])
    } catch (error) {
      // ✅ Optimistic update откатится автоматически
      console.error('Failed to send message:', error)
    }
  }

  return (
    <div>
      <ul>
        {optimisticMessages.map(msg => (
          <li key={msg.id} style={{ opacity: msg.sending ? 0.5 : 1 }}>
            {msg.text}
            {msg.sending && ' (Sending...)'}
          </li>
        ))}
      </ul>

      <form action={sendMessage}>
        <input name="message" placeholder="Type a message..." />
        <button type="submit">Send</button>
      </form>
    </div>
  )
}
```

#### Пример: Optimistic Likes

```typescript
function LikeButton({ postId, initialLikes }: Props) {
  const [likes, setLikes] = useState(initialLikes)
  const [optimisticLikes, addOptimisticLike] = useOptimistic(
    likes,
    (state, amount: number) => state + amount
  )

  async function handleLike() {
    // ✅ Мгновенно увеличить счетчик
    addOptimisticLike(1)

    try {
      const newLikes = await likePost(postId)
      setLikes(newLikes)
    } catch (error) {
      // Откат произойдет автоматически
      toast.error('Failed to like post')
    }
  }

  return (
    <button onClick={handleLike}>
      ❤️ {optimisticLikes} likes
    </button>
  )
}
```

#### Когда использовать useOptimistic

**✅ Хорошо для:**

- Отправка форм (комментарии, сообщения)
- Лайки, реакции
- Добавление/удаление items
- Toggle состояния (favorite, bookmark)

**❌ Не подходит для:**

- Критичные операции (платежи)
- Операции без возможности отката
- Сложные multi-step операции

---

### 2. use() Hook

**Назначение:** Читать промисы и контекст в компонентах и хуках.

**Особенность:** Можно вызывать условно (в отличие от других хуков).

#### Чтение промиса

```typescript
import { use, Suspense } from 'react'

// ✅ Промис передается как prop
function UserProfile({ userPromise }: { userPromise: Promise<User> }) {
  // ✅ use() разворачивает промис
  const user = use(userPromise)

  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  )
}

// ✅ Обернуть в Suspense
function App() {
  const userPromise = fetchUser('octocat')

  return (
    <Suspense fallback={<div>Loading user...</div>}>
      <UserProfile userPromise={userPromise} />
    </Suspense>
  )
}
```

#### Условное чтение контекста

```typescript
import { use, createContext } from 'react'

const ThemeContext = createContext<'light' | 'dark'>('light')

function Button({ primary }: { primary?: boolean }) {
  // ✅ use() можно вызывать условно!
  const theme = primary ? use(ThemeContext) : 'light'

  return (
    <button className={`btn-${theme}`}>
      Click me
    </button>
  )
}
```

#### use() vs традиционные хуки

```typescript
// ❌ useContext нельзя вызвать условно
function Component({ useTheme }: Props) {
  // ERROR: Conditional hook call
  const theme = useTheme ? useContext(ThemeContext) : null;
}

// ✅ use() можно вызвать условно
function Component({ useTheme }: Props) {
  // OK: Conditional use() call
  const theme = useTheme ? use(ThemeContext) : null;
}
```

#### Пример: Conditional Data Fetching

```typescript
function UserData({ userId, shouldFetch }: Props) {
  // ✅ Условная загрузка данных
  const user = shouldFetch ? use(fetchUser(userId)) : null

  if (!user) {
    return <div>No user data</div>
  }

  return <div>{user.name}</div>
}
```

---

## Form Actions

**Назначение:** Декларативная работа с формами без useState и event handlers.

### Базовый пример

```typescript
function SearchForm() {
  // ✅ Action function
  async function search(formData: FormData) {
    const query = formData.get('query') as string

    // Отправить на сервер
    const results = await searchAPI(query)

    // Обработать результаты
    console.log(results)
  }

  return (
    // ✅ Передать action в form
    <form action={search}>
      <input name="query" placeholder="Search..." />
      <button type="submit">Search</button>
    </form>
  )
}
```

### Form Actions с useActionState

**Новый хук:** `useActionState` для работы со статусом action.

```typescript
import { useActionState } from 'react'

type State = {
  message: string
  errors?: Record<string, string[]>
}

function ContactForm() {
  // ✅ useActionState возвращает [state, action, isPending]
  const [state, formAction, isPending] = useActionState(
    async (prevState: State, formData: FormData): Promise<State> => {
      const name = formData.get('name') as string
      const email = formData.get('email') as string

      // Валидация
      if (!name || !email) {
        return {
          message: 'Please fill all fields',
          errors: {
            name: !name ? ['Name is required'] : [],
            email: !email ? ['Email is required'] : [],
          },
        }
      }

      try {
        // Отправка на сервер
        await submitContact({ name, email })
        return { message: 'Success!' }
      } catch (error) {
        return { message: 'Failed to submit' }
      }
    },
    { message: '' } // Initial state
  )

  return (
    <form action={formAction}>
      <input name="name" />
      {state.errors?.name && (
        <span className="error">{state.errors.name[0]}</span>
      )}

      <input name="email" type="email" />
      {state.errors?.email && (
        <span className="error">{state.errors.email[0]}</span>
      )}

      <button type="submit" disabled={isPending}>
        {isPending ? 'Submitting...' : 'Submit'}
      </button>

      {state.message && <p>{state.message}</p>}
    </form>
  )
}
```

### Form Actions с useOptimistic

```typescript
function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [optimisticTodos, addOptimisticTodo] = useOptimistic(
    todos,
    (state, newTodo: Todo) => [...state, { ...newTodo, pending: true }]
  )

  async function addTodo(formData: FormData) {
    const text = formData.get('text') as string

    // ✅ Optimistic update
    const tempTodo = { id: Date.now(), text, completed: false }
    addOptimisticTodo(tempTodo)

    // ✅ Server request
    const newTodo = await createTodo(text)
    setTodos(prev => [...prev, newTodo])
  }

  return (
    <>
      <ul>
        {optimisticTodos.map(todo => (
          <li key={todo.id} style={{ opacity: todo.pending ? 0.5 : 1 }}>
            {todo.text}
          </li>
        ))}
      </ul>

      <form action={addTodo}>
        <input name="text" placeholder="Add todo..." />
        <button type="submit">Add</button>
      </form>
    </>
  )
}
```

### useFormStatus (для child components)

```typescript
import { useFormStatus } from 'react-dom'

// ✅ Submit button в отдельном компоненте
function SubmitButton() {
  // ✅ useFormStatus читает статус родительской формы
  const { pending, data, method, action } = useFormStatus()

  return (
    <button type="submit" disabled={pending}>
      {pending ? 'Submitting...' : 'Submit'}
    </button>
  )
}

function MyForm() {
  async function submitForm(formData: FormData) {
    await saveData(formData)
  }

  return (
    <form action={submitForm}>
      <input name="username" />
      {/* SubmitButton автоматически знает статус формы */}
      <SubmitButton />
    </form>
  )
}
```

---

## React Compiler

**Статус:** 🚧 Experimental (не рекомендуется для production)

**Назначение:** Автоматическая оптимизация компонентов без `useMemo`, `useCallback`, `memo`.

### Как работает

React Compiler анализирует код и автоматически применяет мемоизацию где нужно.

```typescript
// ❌ React 18: Нужна ручная оптимизация
function ExpensiveComponent({ data, onUpdate }) {
  const processedData = useMemo(() => {
    return data.map(item => expensiveOperation(item))
  }, [data])

  const handleClick = useCallback(() => {
    onUpdate(processedData)
  }, [processedData, onUpdate])

  return <button onClick={handleClick}>Update</button>
}

// ✅ React 19 с Compiler: Автоматическая оптимизация
function ExpensiveComponent({ data, onUpdate }) {
  // Compiler автоматически мемоизирует это
  const processedData = data.map(item => expensiveOperation(item))

  // Compiler автоматически мемоизирует функцию
  const handleClick = () => {
    onUpdate(processedData)
  }

  return <button onClick={handleClick}>Update</button>
}
```

### Установка (Experimental)

```bash
npm install -D babel-plugin-react-compiler
```

```javascript
// babel.config.js
module.exports = {
  plugins: [
    [
      "babel-plugin-react-compiler",
      {
        // Options
      },
    ],
  ],
};
```

**⚠️ Внимание:** Compiler еще experimental, не используйте в production без тестирования.

---

## Breaking Changes

### 1. Удален defaultProps

```typescript
// ❌ React 18: defaultProps работал
function Component({ name }) {
  return <div>{name}</div>
}
Component.defaultProps = {
  name: 'Guest'
}

// ✅ React 19: Используйте default parameters
function Component({ name = 'Guest' }: { name?: string }) {
  return <div>{name}</div>
}
```

### 2. ref больше не требует forwardRef

```typescript
// ❌ React 18: forwardRef обязателен
const Input = forwardRef<HTMLInputElement, Props>(
  function Input({ value }, ref) {
    return <input ref={ref} value={value} />
  }
)

// ✅ React 19: ref как обычный prop
function Input({ value, ref }: Props & { ref?: Ref<HTMLInputElement> }) {
  return <input ref={ref} value={value} />
}
```

### 3. Строже правила хуков

```typescript
// ❌ React 19: ERROR - conditional hook
function Component({ shouldLoad }) {
  if (shouldLoad) {
    const data = useData(); // ERROR!
  }
}

// ✅ React 19: use() можно вызывать условно
function Component({ shouldLoad }) {
  const data = shouldLoad ? use(dataPromise) : null; // OK
}
```

### 4. Context теперь <Context> вместо <Context.Provider>

```typescript
import { createContext } from 'react'

const ThemeContext = createContext('light')

// ❌ React 18
<ThemeContext.Provider value="dark">
  <App />
</ThemeContext.Provider>

// ✅ React 19 (упрощенный синтаксис)
<ThemeContext value="dark">
  <App />
</ThemeContext>

// ⚠️ Старый синтаксис все еще работает
```

---

## Улучшения производительности

### 1. Автоматический batching (улучшен)

```typescript
// ✅ React 19: Все обновления батчатся автоматически
function handleClick() {
  setCount((c) => c + 1);
  setFlag((f) => !f);
  setData(newData);
  // Все три обновления = 1 re-render
}

// ✅ Работает даже в промисах
fetch("/api/data").then((data) => {
  setData(data); // Батчится
  setLoading(false); // Батчится
  // 1 re-render
});

// ✅ Работает в setTimeout
setTimeout(() => {
  setCount(1); // Батчится
  setName("x"); // Батчится
  // 1 re-render
}, 1000);
```

### 2. useTransition improvements

```typescript
import { useTransition } from 'react'

function SearchResults() {
  const [isPending, startTransition] = useTransition()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])

  function handleSearch(value: string) {
    setQuery(value) // Высокий приоритет

    // ✅ Низкий приоритет - не блокирует UI
    startTransition(() => {
      const filtered = expensiveFilter(data, value)
      setResults(filtered)
    })
  }

  return (
    <div>
      <input
        value={query}
        onChange={e => handleSearch(e.target.value)}
      />
      {isPending && <Spinner />}
      <ResultsList results={results} />
    </div>
  )
}
```

### 3. Concurrent Features

```typescript
import { useDeferredValue } from 'react'

function SearchPage() {
  const [query, setQuery] = useState('')

  // ✅ Отложенное значение - обновится когда React будет готов
  const deferredQuery = useDeferredValue(query)

  return (
    <div>
      {/* Input обновляется мгновенно */}
      <input value={query} onChange={e => setQuery(e.target.value)} />

      {/* Results обновляются с задержкой */}
      <Suspense fallback={<Spinner />}>
        <SearchResults query={deferredQuery} />
      </Suspense>
    </div>
  )
}
```

---

## Новые API

### 1. Document Metadata

```typescript
import { Title, Meta, Link } from 'react'

function BlogPost({ post }: Props) {
  return (
    <>
      {/* ✅ Metadata в компонентах */}
      <Title>{post.title}</Title>
      <Meta name="description" content={post.excerpt} />
      <Meta property="og:title" content={post.title} />
      <Link rel="canonical" href={post.url} />

      <article>
        <h1>{post.title}</h1>
        <p>{post.content}</p>
      </article>
    </>
  )
}
```

### 2. Preload/Prefetch APIs

```typescript
import { preload, prefetchDNS } from 'react-dom'

function App() {
  // ✅ Preload critical resources
  useEffect(() => {
    preload('/fonts/Inter.woff2', { as: 'font', type: 'font/woff2' })
    prefetchDNS('https://api.github.com')
  }, [])

  return <div>App content</div>
}
```

---

## Миграция с React 18

### Чек-лист миграции

#### 1. Обновить зависимости

```bash
# ✅ Обновить React
npm install react@latest react-dom@latest

# ✅ Обновить типы (если TypeScript)
npm install -D @types/react@latest @types/react-dom@latest
```

#### 2. Удалить defaultProps

```bash
# Найти все использования
grep -r "defaultProps" src/
```

```typescript
// ❌ Заменить это
Component.defaultProps = { name: "Guest" };

// ✅ На это
function Component({ name = "Guest" }: Props) {}
```

#### 3. Обновить forwardRef (опционально)

```typescript
// ❌ Старый способ
const Input = forwardRef((props, ref) => {
  return <input ref={ref} {...props} />
})

// ✅ Новый способ (React 19)
function Input({ ref, ...props }) {
  return <input ref={ref} {...props} />
}
```

#### 4. Обновить Context.Provider

```typescript
// ❌ Старый синтаксис
<ThemeContext.Provider value={theme}>

// ✅ Новый синтаксис (опционально)
<ThemeContext value={theme}>
```

#### 5. Протестировать

```bash
# Запустить тесты
npm test

# Проверить TypeScript
npm run type-check

# Проверить приложение
npm run dev
```

### Постепенная миграция

React 19 **обратно совместим** с React 18:

```typescript
// ✅ Старый код продолжит работать
<ThemeContext.Provider value="dark">  {/* OK */}
  <App />
</ThemeContext.Provider>

// ✅ Новый код можно добавлять постепенно
<ThemeContext value="light">  {/* OK */}
  <App />
</ThemeContext>
```

---

## Best Practices

### 1. Используйте useOptimistic для UX

```typescript
// ✅ Хорошо: Мгновенный UI feedback
function LikeButton() {
  const [likes, setLikes] = useState(100)
  const [optimisticLikes, addOptimistic] = useOptimistic(
    likes,
    (state, amount) => state + amount
  )

  async function handleLike() {
    addOptimistic(1) // Мгновенно
    await likePost()  // Async
    setLikes(prev => prev + 1)
  }

  return <button onClick={handleLike}>❤️ {optimisticLikes}</button>
}
```

### 2. Form Actions для форм

```typescript
// ✅ Хорошо: Декларативные формы
function ContactForm() {
  async function submit(formData: FormData) {
    await sendEmail(formData)
  }

  return (
    <form action={submit}>
      <input name="email" />
      <button>Send</button>
    </form>
  )
}

// ❌ Плохо: Ручное управление state
function ContactForm() {
  const [email, setEmail] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    await sendEmail({ email })
  }

  return (
    <form onSubmit={handleSubmit}>
      <input value={email} onChange={e => setEmail(e.target.value)} />
      <button>Send</button>
    </form>
  )
}
```

### 3. use() для условной загрузки

```typescript
// ✅ Хорошо: Условный use()
function UserProfile({ showDetails, userId }: Props) {
  const user = showDetails ? use(fetchUser(userId)) : null

  return user ? <Details user={user} /> : <Summary />
}
```

### 4. useTransition для тяжелых операций

```typescript
// ✅ Хорошо: UI не блокируется
function DataTable() {
  const [isPending, startTransition] = useTransition()
  const [filter, setFilter] = useState('')
  const [data, setData] = useState(bigData)

  function handleFilter(value: string) {
    setFilter(value)

    startTransition(() => {
      const filtered = expensiveFilter(bigData, value)
      setData(filtered)
    })
  }

  return (
    <>
      <input onChange={e => handleFilter(e.target.value)} />
      {isPending && <Spinner />}
      <Table data={data} />
    </>
  )
}
```

### 5. Не злоупотребляйте optimistic updates

```typescript
// ❌ Плохо: Optimistic для критичных операций
async function makePayment(amount: number) {
  addOptimisticPayment(amount); // НЕ ДЕЛАЙТЕ ТАК
  await processPayment(amount);
}

// ✅ Хорошо: Для некритичных операций
async function toggleFavorite() {
  addOptimisticFavorite(); // OK для favorites
  await saveFavorite();
}
```

---

## Совместимость с проектом

### Текущее использование

**Версия:** React 19.2.0 ✅

**Что используется:**

- ✅ React 19 установлен
- ✅ TypeScript конфигурация совместима
- ✅ Vite поддерживает React 19
- ⚠️ useOptimistic не используется (можно добавить)
- ⚠️ Form Actions не используются (можно добавить)

### Что можно улучшить

#### 1. Добавить useOptimistic в SearchForm

```typescript
// Текущий код
function SearchForm({ setUserName }: Props) {
  const [text, setText] = useState('')

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setUserName(text)
  }

  return <form onSubmit={handleSubmit}>...</form>
}

// ✅ С useOptimistic
function SearchForm({ setUserName }: Props) {
  const [userName, setUserNameState] = useState('')
  const [optimisticName, setOptimisticName] = useOptimistic(
    userName,
    (_, newName) => newName
  )

  async function handleSubmit(formData: FormData) {
    const name = formData.get('username') as string
    setOptimisticName(name) // Мгновенное обновление UI
    setUserName(name)
    setUserNameState(name)
  }

  return <form action={handleSubmit}>...</form>
}
```

#### 2. Использовать Form Actions

```typescript
// Текущий код: Ручной preventDefault
function SearchForm() {
  function handlerOnSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    // ...
  }

  return <form onSubmit={handlerOnSubmit}>...</form>
}

// ✅ С Form Actions (проще)
function SearchForm() {
  async function search(formData: FormData) {
    const username = formData.get('username') as string
    setUserName(username)
  }

  return <form action={search}>...</form>
}
```

---

## Полезные ссылки

- [React 19 Release Notes](https://react.dev/blog/2024/12/05/react-19)
- [React 19 Upgrade Guide](https://react.dev/blog/2024/04/25/react-19-upgrade-guide)
- [useOptimistic Documentation](https://react.dev/reference/react/useOptimistic)
- [use() Hook Documentation](https://react.dev/reference/react/use)
- [Form Actions Documentation](https://react.dev/reference/react-dom/components/form)
- [React Compiler](https://react.dev/learn/react-compiler)

---

## Дополнительная документация

- [Dependencies Overview](./dependencies.md) - Все зависимости проекта
- [Testing Guide](./testing-guide.md) - Стратегия тестирования
- [Tailwind v4 Migration](./tailwind-v4-migration.md) - Миграция Tailwind CSS
- [Architecture](./architecture.md) - Архитектура проекта

---

**Последнее обновление:** Ноябрь 2025
**Версия React:** 19.2.0
**Статус:** ✅ Production Ready
