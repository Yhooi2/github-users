# TypeScript Guide - Type-Safe Development

> Полное руководство по TypeScript 5.8.3 конфигурации и best practices

## Содержание

- [Обзор](#обзор)
- [Конфигурация TypeScript](#конфигурация-typescript)
- [Type Patterns](#type-patterns)
- [React Types](#react-types)
- [GraphQL Types](#graphql-types)
- [Utility Types](#utility-types)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)

---

## Обзор

### TypeScript в проекте

**Версия:** TypeScript 5.8.3

**Особенности:**

- ✅ Strict mode enabled
- ✅ Path aliases (`@/*`)
- ✅ React 19 types
- ✅ Vite bundler mode
- ✅ GraphQL typed queries

### Файлы конфигурации

```
project/
├── tsconfig.json           # Root config with project references
├── tsconfig.app.json       # App code configuration
├── tsconfig.node.json      # Node/build tools configuration
└── src/
    └── *.types.ts          # Type definitions
```

---

## Конфигурация TypeScript

### tsconfig.json (Root)

**Файл:** `tsconfig.json`

```json
{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ],
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

**Назначение:**

- ✅ Project references для incremental builds
- ✅ Path aliases для imports
- ✅ Root configuration

### tsconfig.app.json (Application)

**Файл:** `tsconfig.app.json`

```json
{
  "compilerOptions": {
    /* Build */
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.app.tsbuildinfo",
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,

    /* Paths (shadcn/ui) */
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    },

    /* Bundler Mode (Vite) */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "verbatimModuleSyntax": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",

    /* Strict Type Checking */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedSideEffectImports": true,
    "erasableSyntaxOnly": true
  },
  "include": ["src"],
  "exclude": [
    "src/**/*.test.ts",
    "src/**/*.test.tsx",
    "src/**/*.spec.ts",
    "src/**/*.spec.tsx",
    "src/**/*.stories.ts",
    "src/**/*.stories.tsx",
    "src/test",
    "src/stories"
  ]
}
```

#### Compiler Options - подробно

**Target & Lib:**

```json
"target": "ES2022",              // Compile to ES2022
"lib": ["ES2022", "DOM", "DOM.Iterable"],  // Available APIs
```

- ✅ ES2022 = Modern features (top-level await, class fields)
- ✅ DOM = Browser APIs
- ✅ DOM.Iterable = Array.from, spread on NodeList

**Module System:**

```json
"module": "ESNext",              // Latest module syntax
"moduleResolution": "bundler",   // Vite bundler resolution
```

- ✅ ESNext = import/export ESM syntax
- ✅ bundler = Optimized for Vite/bundlers

**Path Aliases:**

```json
"baseUrl": ".",
"paths": {
  "@/*": ["./src/*"]
}
```

- ✅ Import с `@/` вместо относительных путей
- ✅ Поддержка shadcn/ui conventions

**Vite-specific:**

```json
"allowImportingTsExtensions": true,  // Allow .ts imports
"verbatimModuleSyntax": true,        // Explicit imports/exports
"noEmit": true,                      // Vite handles transpilation
"jsx": "react-jsx",                  // React 19 JSX transform
```

**Strict Mode:**

```json
"strict": true,                          // All strict checks
"noUnusedLocals": true,                  // Error on unused variables
"noUnusedParameters": true,              // Error on unused params
"noFallthroughCasesInSwitch": true,     // Require break in switch
"noUncheckedSideEffectImports": true,   // TypeScript 5.8 feature
```

**Include/Exclude:**

```json
"include": ["src"],
"exclude": [
  "src/**/*.test.ts",      // Tests excluded from build
  "src/**/*.test.tsx",
  "src/**/*.stories.tsx",  // Storybook excluded from build
  "src/test",
  "src/stories"
]
```

---

## Type Patterns

### Component Props

```typescript
// ✅ Type для props
type Props = {
  title: string
  count: number
  items: string[]
  user?: User  // Optional
  onClick: () => void
  children?: React.ReactNode
}

function Component({ title, count, items, user, onClick, children }: Props) {
  return <div>{title}</div>
}
```

### Union Types

```typescript
// ✅ String literal union
type Status = "idle" | "loading" | "success" | "error";

// ✅ Number literal union
type Port = 3000 | 5173 | 8080;

// ✅ Object union (discriminated)
type Result =
  | { status: "success"; data: User }
  | { status: "error"; error: string };

// Usage with type narrowing
function handleResult(result: Result) {
  if (result.status === "success") {
    // TypeScript знает что есть result.data
    console.log(result.data.name);
  } else {
    // TypeScript знает что есть result.error
    console.log(result.error);
  }
}
```

### Intersection Types

```typescript
// ✅ Combine types
type WithId = { id: string };
type WithTimestamp = { createdAt: string };

type Entity = WithId &
  WithTimestamp & {
    name: string;
  };

const entity: Entity = {
  id: "1",
  createdAt: "2024-01-01",
  name: "Test",
};
```

### Generic Types

```typescript
// ✅ Generic function
function identity<T>(value: T): T {
  return value
}

const num = identity<number>(42)      // T = number
const str = identity<string>('hello') // T = string

// ✅ Generic React component
type ListProps<T> = {
  items: T[]
  renderItem: (item: T) => React.ReactNode
}

function List<T>({ items, renderItem }: ListProps<T>) {
  return <ul>{items.map(renderItem)}</ul>
}

// Usage
<List<User>
  items={users}
  renderItem={user => <li>{user.name}</li>}
/>
```

### Type Guards

```typescript
// ✅ typeof guard
function isString(value: unknown): value is string {
  return typeof value === "string";
}

// ✅ instanceof guard
function isError(value: unknown): value is Error {
  return value instanceof Error;
}

// ✅ Property guard
function hasProperty<K extends string>(
  obj: unknown,
  key: K,
): obj is Record<K, unknown> {
  return typeof obj === "object" && obj !== null && key in obj;
}

// Usage
if (hasProperty(data, "name")) {
  console.log(data.name); // TypeScript knows data.name exists
}
```

### Conditional Types

```typescript
// ✅ Extract return type
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

function getUser() {
  return { name: "John", age: 30 };
}

type User = ReturnType<typeof getUser>; // { name: string, age: number }

// ✅ Extract array element type
type ArrayElement<T> = T extends (infer E)[] ? E : never;

type Numbers = number[];
type NumberElement = ArrayElement<Numbers>; // number
```

---

## React Types

### Component Types

```typescript
// ✅ Function component
type Props = { title: string }

function Component({ title }: Props): JSX.Element {
  return <h1>{title}</h1>
}

// ✅ With children
type PropsWithChildren = {
  title: string
  children: React.ReactNode
}

function Container({ title, children }: PropsWithChildren) {
  return (
    <div>
      <h1>{title}</h1>
      {children}
    </div>
  )
}
```

### Event Handlers

```typescript
// ✅ Common event types
type ButtonProps = {
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onDoubleClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
};

type InputProps = {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus: (e: React.FocusEvent<HTMLInputElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
};

type FormProps = {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
};

type KeyboardProps = {
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onKeyUp: (e: React.KeyboardEvent<HTMLInputElement>) => void;
};
```

### Hook Types

```typescript
// ✅ useState
const [count, setCount] = useState<number>(0);
const [user, setUser] = useState<User | null>(null);

// ✅ useRef
const inputRef = useRef<HTMLInputElement>(null);
const divRef = useRef<HTMLDivElement>(null);

// ✅ useReducer
type State = { count: number };
type Action = { type: "increment" } | { type: "decrement" };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "increment":
      return { count: state.count + 1 };
    case "decrement":
      return { count: state.count - 1 };
  }
}

const [state, dispatch] = useReducer(reducer, { count: 0 });

// ✅ useContext
type ThemeContextType = {
  theme: "light" | "dark";
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | null>(null);

function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}
```

### React 19 Hook Types

```typescript
// ✅ useOptimistic
import { useOptimistic } from "react";

type Message = {
  id: number;
  text: string;
  sending?: boolean;
};

const [messages, setMessages] = useState<Message[]>([]);
const [optimisticMessages, addOptimisticMessage] = useOptimistic(
  messages,
  (state: Message[], newMessage: Message) => [...state, newMessage],
);

// ✅ use() hook
import { use } from "react";

// Reading promise
const data = use<User>(userPromise);

// Reading context
const theme = use(ThemeContext);
```

### forwardRef Types (React 18 style)

```typescript
type InputProps = {
  placeholder?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  function Input({ placeholder }, ref) {
    return <input ref={ref} placeholder={placeholder} />
  }
)

// Usage
const inputRef = useRef<HTMLInputElement>(null)
<Input ref={inputRef} placeholder="Type here..." />
```

### React 19 - ref as prop

```typescript
// ✅ React 19: ref как обычный prop
type InputProps = {
  placeholder?: string
  ref?: React.Ref<HTMLInputElement>
}

function Input({ placeholder, ref }: InputProps) {
  return <input ref={ref} placeholder={placeholder} />
}
```

---

## GraphQL Types

### Query Response Types

**Файл:** `src/apollo/github-api.types.ts`

```typescript
// ✅ Response type
export type GitHubGraphQLResponse = {
  user: GitHubUser | null;
};

// ✅ User type
export type GitHubUser = {
  id: string;
  login: string;
  name: string | null;
  avatarUrl: string;
  bio: string | null;
  url: string;
  location: string | null;
  followers: { totalCount: number };
  following: { totalCount: number };
  gists: { totalCount: number };
  year1: { totalCommitContributions: number };
  year2: { totalCommitContributions: number };
  year3: { totalCommitContributions: number };
  createdAt: string;
  contributionsCollection: ContributionsCollection;
  repositories: RepositoriesConnection;
};

// ✅ Nested types
export type ContributionsCollection = {
  totalCommitContributions: number;
  commitContributionsByRepository: Array<{
    contributions: { totalCount: number };
    repository: { name: string };
  }>;
};

export type RepositoriesConnection = {
  totalCount: number;
  pageInfo: {
    endCursor: string | null;
    hasNextPage: boolean;
  };
  nodes: GitHubRepository[];
};

export type GitHubRepository = {
  id: string;
  name: string;
  description: string | null;
  forkCount: number;
  stargazerCount: number;
  url: string;
  // ... more fields
};
```

### Apollo Hook Types

```typescript
import { useQuery } from "@apollo/client";
import type { GitHubGraphQLResponse } from "./github-api.types";

// ✅ Typed useQuery
function useQueryUser(login: string) {
  return useQuery<GitHubGraphQLResponse>(GET_USER_INFO, {
    variables: { login },
  });
}

// ✅ Result is typed
const { data, loading, error } = useQueryUser("octocat");

// TypeScript knows:
// data is GitHubGraphQLResponse | undefined
// data.user is GitHubUser | null | undefined
```

---

## Utility Types

### Built-in Utility Types

```typescript
// ✅ Partial - все поля optional
type User = {
  name: string;
  email: string;
  age: number;
};

type PartialUser = Partial<User>;
// { name?: string, email?: string, age?: number }

// ✅ Required - все поля required
type RequiredUser = Required<PartialUser>;
// { name: string, email: string, age: number }

// ✅ Pick - выбрать поля
type UserPreview = Pick<User, "name" | "email">;
// { name: string, email: string }

// ✅ Omit - исключить поля
type UserWithoutAge = Omit<User, "age">;
// { name: string, email: string }

// ✅ Record - создать object type
type UserRoles = Record<string, "admin" | "user" | "guest">;
// { [key: string]: 'admin' | 'user' | 'guest' }

// ✅ Exclude - исключить из union
type Status = "idle" | "loading" | "success" | "error";
type NonIdleStatus = Exclude<Status, "idle">;
// 'loading' | 'success' | 'error'

// ✅ Extract - извлечь из union
type SuccessOrError = Extract<Status, "success" | "error">;
// 'success' | 'error'

// ✅ NonNullable - убрать null/undefined
type MaybeString = string | null | undefined;
type DefiniteString = NonNullable<MaybeString>;
// string

// ✅ ReturnType - тип return value функции
function getUser() {
  return { name: "John", age: 30 };
}

type User = ReturnType<typeof getUser>;
// { name: string, age: number }

// ✅ Parameters - типы параметров функции
function saveUser(name: string, age: number) {}

type SaveUserParams = Parameters<typeof saveUser>;
// [string, number]
```

### Custom Utility Types

```typescript
// ✅ DeepPartial - recursive partial
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// ✅ Nullable - add null
type Nullable<T> = T | null;

// ✅ Optional - add undefined
type Optional<T> = T | undefined;

// ✅ ValueOf - extract value types
type ValueOf<T> = T[keyof T];

type User = { name: string; age: number };
type UserValue = ValueOf<User>; // string | number

// ✅ ArrayElement - extract array element type
type ArrayElement<T> = T extends (infer E)[] ? E : T;

type Numbers = number[];
type Num = ArrayElement<Numbers>; // number
```

---

## Best Practices

### 1. Prefer Type over Interface

```typescript
// ✅ Хорошо: Type (более гибкий)
type User = {
  name: string;
  age: number;
};

type Props = {
  user: User;
};

// ⚠️ Interface (используй только для классов)
interface IUser {
  name: string;
  age: number;
}

// ✅ Type может делать больше
type Status = "idle" | "loading"; // Union
type UserOrGuest = User | Guest; // Union
type Mapped = { [K in keyof User]: string }; // Mapped
```

### 2. Избегай `any`

```typescript
// ❌ Плохо: any отключает type checking
function process(data: any) {
  return data.name; // Нет type safety
}

// ✅ Хорошо: unknown + type guard
function process(data: unknown) {
  if (typeof data === "object" && data !== null && "name" in data) {
    return (data as { name: string }).name;
  }
  throw new Error("Invalid data");
}

// ✅ Еще лучше: Generic
function process<T extends { name: string }>(data: T) {
  return data.name;
}
```

### 3. Используй strict mode

```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true // ✅ Enable all strict checks
  }
}
```

**Что включает strict:**

- `noImplicitAny` - запретить implicit any
- `strictNullChecks` - null/undefined не assignable к другим типам
- `strictFunctionTypes` - строгая проверка функций
- `strictBindCallApply` - типизация bind/call/apply
- `strictPropertyInitialization` - require initialization в конструкторе
- `noImplicitThis` - запретить implicit this
- `alwaysStrict` - добавлять "use strict"

### 4. Type assertions осторожно

```typescript
// ❌ Плохо: Type assertion без проверки
const user = data as User;

// ✅ Хорошо: С проверкой
if (isUser(data)) {
  const user = data as User;
}

// ✅ Еще лучше: Type guard
function isUser(data: unknown): data is User {
  return (
    typeof data === "object" &&
    data !== null &&
    "name" in data &&
    typeof data.name === "string"
  );
}
```

### 5. Правильная структура типов

```typescript
// ✅ Хорошо: Отдельный файл для типов
// src/types/user.types.ts
export type User = {
  id: string;
  name: string;
};

export type UserWithPosts = User & {
  posts: Post[];
};

// ✅ Импорт
import type { User, UserWithPosts } from "@/types/user.types";
```

### 6. Не дублируй типы

```typescript
// ❌ Плохо: Дублирование
type UserPreview = {
  name: string;
  email: string;
};

type User = {
  name: string;
  email: string;
  age: number;
  address: string;
};

// ✅ Хорошо: Переиспользование
type User = {
  name: string;
  email: string;
  age: number;
  address: string;
};

type UserPreview = Pick<User, "name" | "email">;
```

### 7. Type imports

```typescript
// ✅ Type-only imports (быстрее компиляция)
import type { User } from "./types";

// ⚠️ Regular import (если нужно и type и value)
import { User } from "./types";
```

---

## Troubleshooting

### Проблема: "Cannot find module '@/components'"

**Причина:** Path alias не сконфигурирован

**Решение:**

```json
// tsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}

// vite.config.ts
import path from 'path'

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

### Проблема: "Type 'X' is not assignable to type 'Y'"

**Причина:** Типы несовместимы

**Решение:**

```typescript
// ❌ Error
const num: number = "123"; // string не assignable к number

// ✅ Fix: Parse
const num: number = parseInt("123", 10);

// ✅ Fix: Type guard
function isNumber(value: unknown): value is number {
  return typeof value === "number";
}

if (isNumber(data)) {
  const num: number = data;
}
```

### Проблема: "Object is possibly 'null' or 'undefined'"

**Причина:** strictNullChecks enabled

**Решение:**

```typescript
// ❌ Error
const user: User | null = getUser();
console.log(user.name); // Error: Object is possibly 'null'

// ✅ Fix 1: Optional chaining
console.log(user?.name);

// ✅ Fix 2: Null check
if (user !== null) {
  console.log(user.name);
}

// ✅ Fix 3: Non-null assertion (если уверен)
console.log(user!.name);
```

### Проблема: "Parameter implicitly has an 'any' type"

**Причина:** noImplicitAny enabled

**Решение:**

```typescript
// ❌ Error
function greet(name) {
  // Parameter 'name' implicitly has an 'any' type
  return `Hello ${name}`;
}

// ✅ Fix: Add type
function greet(name: string) {
  return `Hello ${name}`;
}
```

### Проблема: Type inference не работает

**Причина:** Слишком complex type

**Решение:**

```typescript
// ❌ TypeScript не может infer
const items = [1, "2", true]; // (string | number | boolean)[]

// ✅ Explicit type
const items: Array<number | string | boolean> = [1, "2", true];

// ✅ Или const assertion
const items = [1, "2", true] as const; // readonly [1, "2", true]
```

---

## Команды TypeScript

```bash
# ✅ Type check
npx tsc --noEmit

# ✅ Type check с watch
npx tsc --noEmit --watch

# ✅ Generate declaration files
npx tsc --declaration --emitDeclarationOnly

# ✅ Check specific file
npx tsc --noEmit src/components/MyComponent.tsx

# ✅ Show config
npx tsc --showConfig
```

---

## Полезные ссылки

### TypeScript Documentation

- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [TypeScript Cheat Sheets](https://www.typescriptlang.org/cheatsheets)
- [What's New in TypeScript 5.8](https://devblogs.microsoft.com/typescript/announcing-typescript-5-8/)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)

### Tools

- [TypeScript Playground](https://www.typescriptlang.org/play)
- [Type Challenges](https://github.com/type-challenges/type-challenges)

---

## Дополнительная документация

- [Component Development](./component-development.md) - React component patterns
- [React 19 Features](./react-19-features.md) - React 19 types
- [Apollo Client Guide](./apollo-client-guide.md) - GraphQL types
- [Testing Guide](./testing-guide.md) - Testing TypeScript code

---

**Последнее обновление:** Ноябрь 2025
**TypeScript:** 5.8.3
**Статус:** ✅ Production Ready
