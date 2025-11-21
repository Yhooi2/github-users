# Architecture Documentation

## Overview

**git-user-info** is a modern React application built with a clean layered architecture that fetches and displays GitHub user information via the GitHub GraphQL API. The architecture follows separation of concerns principles with distinct layers for data fetching, business logic, and presentation.

## Technology Stack

- **Frontend Framework:** React 19.2.0 with TypeScript 5.8.3
- **Build Tool:** Vite 7.1.2
- **Data Management:** Apollo Client 3.14.0
- **Styling:** Tailwind CSS v4.1.12 + shadcn/ui
- **Testing:** Vitest 4.0.6, React Testing Library, Playwright 1.56.1
- **Component Documentation:** Storybook 10.0.3

## Architectural Layers

### 1. Data Layer (Apollo Client)

For complete Apollo Client setup, best practices, and troubleshooting, see the [Apollo Client Guide](./apollo-client-guide.md).

**High-Level Overview:**

```
┌───────────────────────────────────────────┐
│         GitHub GraphQL API                │
│     https://api.github.com/graphql        │
└──────────────────┬────────────────────────┘
                   │
                   │ HTTP POST
                   ↓
┌───────────────────────────────────────────┐
│          Apollo Client                    │
│  ┌─────────────────────────────────────┐  │
│  │  Link Chain (Request/Response Flow) │  │
│  │                                     │  │
│  │  errorLink (catches all errors)    │  │
│  │       ↓                             │  │
│  │  authLink (adds Bearer token)      │  │
│  │       ↓                             │  │
│  │  httpLink (makes HTTP request)     │  │
│  └─────────────────────────────────────┘  │
│                                           │
│  InMemoryCache (normalized data storage) │
└───────────────────────────────────────────┘
```

**Key Components:**

- **errorLink:** Global error handler ([details](./apollo-client-guide.md#error-link))
- **authLink:** Token injection from env/localStorage ([details](./apollo-client-guide.md#auth-link))
- **httpLink:** HTTP transport to GitHub API
- **InMemoryCache:** Automatic query result caching

**Configuration:** See `src/apollo/ApolloAppProvider.tsx`

**Custom Hooks:** See [Custom Hooks section](./apollo-client-guide.md#custom-hooks)

**Testing:** See [Testing Apollo Client](./testing-guide.md#apollo-client-mockedprovider)

### 2. Business Logic Layer (Hooks & Utilities)

This layer contains custom React hooks and utility functions that encapsulate business logic.

```
┌──────────────────────────────────────┐
│     useQueryUser (Custom Hook)        │
│                                       │
│  - Computes query variables           │
│  - Manages date ranges (3 years)      │
│  - Executes Apollo useQuery           │
│  - Returns { data, loading, error }   │
└──────────────────┬───────────────────┘
                   │
                   ↓
┌──────────────────────────────────────┐
│      Date Helper Utilities            │
│                                       │
│  - formatDate()                       │
│  - getThreeYearRanges()               │
│  - getQueryDates()                    │
└──────────────────────────────────────┘
```

**Key Functions:**

- **useQueryUser:** Custom hook that wraps Apollo's `useQuery` with computed date variables and skip logic
- **formatDate:** Converts Date objects to ISO 8601 strings for GraphQL
- **getThreeYearRanges:** Calculates date ranges for the last 3 calendar years
- **getQueryDates:** Calculates date range for N days back from current date

### 3. Presentation Layer (Components)

The presentation layer is organized into smart (container) and presentational components.

```
App (Root Component - Smart)
  │
  ├── State: userName (React.useState)
  │
  ├─→ SearchForm (Hybrid Component)
  │   ├── Props: userName, setUserName
  │   ├── Local State: text (input value)
  │   ├── Validation: empty string check
  │   └── Callback: setUserName on submit
  │
  └─→ UserProfile (Smart Component)
      ├── Props: userName
      ├── Hook: useQueryUser(userName)
      └── Render: loading | error | data | not-found
```

**Component Responsibilities:**

| Component                | Type           | Responsibilities                             |
| ------------------------ | -------------- | -------------------------------------------- |
| **App**                  | Smart          | State management, component orchestration    |
| **SearchForm**           | Hybrid         | Input capture, validation, form submission   |
| **UserProfile**          | Smart          | Data fetching via hook, async state handling |
| **Button, Input, Label** | Presentational | UI rendering with Tailwind styling           |

### 4. UI Component Library (shadcn/ui)

Reusable UI components built on Radix UI primitives with Tailwind CSS styling.

```
src/components/ui/
├── button.tsx       (Variants: default, destructive, outline, etc.)
├── input.tsx        (Form input with validation states)
├── label.tsx        (Accessible form labels)
└── sonner.tsx       (Toast notifications)
```

## Data Flow

### User Search Flow

```
1. User Input
   User types username in SearchForm
         ↓
2. Local State Update
   SearchForm.text state updates on each keystroke
         ↓
3. Form Submission
   User presses Enter or clicks Search button
         ↓
4. Validation
   SearchForm validates input (non-empty)
         ↓
5. State Lifting
   SearchForm calls setUserName(text)
         ↓
6. Parent State Update
   App.userName state updates
         ↓
7. Prop Update
   UserProfile receives new userName prop
         ↓
8. Query Trigger
   useQueryUser hook detects userName change
         ↓
9. Apollo Query
   useQuery executes GET_USER_INFO query
         ↓
10. Link Chain Processing
    errorLink → authLink → httpLink
         ↓
11. GitHub API Request
    HTTP POST to api.github.com/graphql
         ↓
12. Response Processing
    httpLink → authLink → errorLink
         ↓
13. Cache Update
    InMemoryCache stores/normalizes response
         ↓
14. Component Re-render
    UserProfile re-renders with new data
```

### Error Handling Flow

```
Error Occurs (GraphQL or Network)
         ↓
errorLink Catches Error
         ↓
    ┌────┴────┐
    ↓         ↓
GraphQL     Network
Error       Error
    ↓         ↓
Check       Check
code        status
    ↓         ↓
UNAUTH?     401?
    ↓         ↓
Clear       Clear
Token       Token
    ↓         ↓
    └────┬────┘
         ↓
Toast Notification
         ↓
Component Receives Error
         ↓
Error UI Displayed
```

## State Management

### State Distribution

```
┌────────────────────────────────────────┐
│  Application State (React.useState)     │
│                                         │
│  App.tsx:                               │
│    - userName: string                   │
│    - setUserName: Dispatch<string>      │
└──────────────────┬─────────────────────┘
                   │
         ┌─────────┼─────────┐
         ↓                   ↓
┌─────────────────┐   ┌──────────────────┐
│  SearchForm      │   │  UserProfile     │
│                  │   │                  │
│  Local State:    │   │  No Local State  │
│  - text: string  │   │                  │
└──────────────────┘   └──────────────────┘
                              ↓
                   ┌──────────────────────┐
                   │  Apollo Client       │
                   │  (Remote State)      │
                   │                      │
                   │  - Query cache       │
                   │  - Network status    │
                   └──────────────────────┘
```

### State Management Strategy

- **Local UI State:** React `useState` for form inputs and UI interactions
- **Application State:** React `useState` in root component for shared state
- **Remote State:** Apollo Client cache for server data
- **No Global State Library:** Redux/Zustand not needed for this app size

## Type System Architecture

### Type Flow

```
┌───────────────────────────────────────┐
│  github-api.types.ts                  │
│                                        │
│  GitHubGraphQLResponse                 │
│    ├─ user: GitHubUser                │
│    │   ├─ Profile fields              │
│    │   ├─ Connection counts           │
│    │   ├─ Contribution data           │
│    │   └─ Repositories                │
└──────────────┬────────────────────────┘
               │
               ↓
┌──────────────────────────────────────┐
│  queriers.ts                          │
│                                       │
│  GET_USER_INFO: DocumentNode          │
└──────────────┬───────────────────────┘
               │
               ↓
┌──────────────────────────────────────┐
│  useQueryUser.ts                      │
│                                       │
│  useQuery<GitHubGraphQLResponse>()    │
└──────────────┬───────────────────────┘
               │
               ↓
┌──────────────────────────────────────┐
│  UserProfile.tsx                      │
│                                       │
│  const { data, loading, error } =     │
│    useQueryUser(userName)             │
│                                       │
│  // data is typed as:                │
│  // GitHubGraphQLResponse | undefined │
└───────────────────────────────────────┘
```

### Type Safety Guarantees

- **Compile-time Checking:** All GraphQL response data is typed
- **IntelliSense Support:** Full autocomplete in editors
- **Null Safety:** Explicit `| null` for optional fields
- **Type Inference:** Minimal manual type annotations needed

## Testing Architecture

### Test Pyramid

```
          ╱▔╲
         ╱ E2E ╲           Playwright (14 tests)
        ╱───────╲          - Full user journeys
       ╱         ╲         - Multi-browser testing
      ╱ Integration╲       - Real API interactions
     ╱─────────────╲
    ╱               ╲      Vitest + RTL (31 tests)
   ╱  Unit Tests     ╲     - Component behavior
  ╱___________________╲    - Hook logic
                            - Utility functions
```

### Test Organization

```
src/
├── apollo/
│   ├── date-helpers.test.ts      (16 tests - utilities)
│   └── useQueryUser.test.ts      (8 tests - hook)
│
├── components/
│   ├── SearchForm.test.tsx       (9 tests - component)
│   └── UserProfile.test.tsx      (6 tests - component)
│
└── lib/
    └── utils.test.ts             (6 tests - utilities)

e2e/
└── user-search.spec.ts           (14 tests - E2E workflows)
```

### Mocking Strategy

1. **Apollo Client:** `MockedProvider` from `@apollo/client/testing`
2. **Custom Hooks:** `vi.mock()` to mock hook implementations
3. **External Libraries:** `vi.mock()` for third-party modules (e.g., sonner)
4. **GitHub API:** Mocked responses in E2E tests

## Build & Bundle Architecture

### Development Build

```
Source Files (TypeScript + React)
         ↓
Vite Dev Server
  ├─ Fast Refresh (HMR)
  ├─ On-demand compilation
  └─ Source maps
         ↓
Browser (localhost:5173)
```

### Production Build

```
Source Files
         ↓
TypeScript Compiler (tsc -b)
  └─ Type checking
         ↓
Vite Build
  ├─ Tree shaking
  ├─ Minification
  ├─ CSS purging (Tailwind)
  └─ Asset optimization
         ↓
dist/
├── index.html
└── assets/
    ├── index-[hash].js   (~466 KB)
    └── index-[hash].css  (~20 KB)
```

### Module Resolution

```typescript
// Path alias: @ → ./src
import { Button } from "@/components/ui/button";
import useQueryUser from "@/apollo/useQueryUser";

// Configured in:
// - vite.config.ts (alias resolution)
// - tsconfig.json (path mapping)
```

## Performance Considerations

### Optimization Strategies

1. **Memoization**
   - `useMemo` for computed query variables
   - Prevents unnecessary recalculations

2. **Query Optimization**
   - `skip: !login` prevents empty queries
   - `errorPolicy: 'all'` reduces re-renders

3. **Caching**
   - Apollo InMemoryCache for query results
   - Automatic deduplication

4. **Code Splitting**
   - Not currently implemented (app is small)
   - Can be added via React.lazy() if needed

### Performance Metrics

- **Bundle Size:** ~466 KB uncompressed, ~141 KB gzipped
- **First Load:** Fast (Vite optimized)
- **HMR Speed:** <100ms (Vite Fast Refresh)

## Security Considerations

### Current Security Measures

1. **Token Storage**
   - Environment variable: `VITE_GITHUB_TOKEN`
   - localStorage fallback: `github_token`

2. **Error Handling**
   - Automatic token clearing on 401/UNAUTHENTICATED
   - Prevents repeated failed requests

3. **Input Validation**
   - Client-side validation before API calls
   - XSS protection via React's built-in escaping

### Security Limitations

⚠️ **Token in localStorage** is vulnerable to XSS attacks

- **Recommendation:** Move to httpOnly cookies with backend

⚠️ **No rate limiting** on client side

- **Recommendation:** Implement request debouncing

## Scalability Considerations

### Current Scale

- **Single Page Application:** No routing needed
- **Simple State:** No global state library needed
- **Limited Data:** Max 100 repos per user

### Growth Path

If the application grows:

1. **Add Routing:** React Router for multi-page navigation
2. **Add Pagination:** Cursor-based pagination for repositories
3. **Add State Management:** Consider Zustand/Redux for complex state
4. **Add Code Splitting:** Route-based code splitting
5. **Add Service Worker:** Offline support and caching

## Design Patterns

### Applied Patterns

1. **Custom Hooks Pattern**
   - `useQueryUser` encapsulates data fetching logic
   - Reusable across components

2. **Provider Pattern**
   - `ApolloAppProvider` for dependency injection
   - Context API for Apollo Client

3. **Composition over Inheritance**
   - Functional components
   - Component composition in App

4. **Smart/Presentational Split**
   - Smart: App, SearchForm, UserProfile
   - Presentational: Button, Input, Label

5. **Error Boundary Pattern**
   - Link-level error handling
   - Component-level error display

## File Structure

```
git-user-info/
├── src/
│   ├── apollo/                  # Data layer
│   │   ├── ApolloAppProvider.tsx
│   │   ├── useQueryUser.ts
│   │   ├── queriers.ts
│   │   ├── date-helpers.ts
│   │   └── github-api.types.ts
│   │
│   ├── components/              # Presentation layer
│   │   ├── SearchForm.tsx
│   │   ├── UserProfile.tsx
│   │   └── ui/                  # UI components
│   │       ├── button.tsx
│   │       ├── input.tsx
│   │       ├── label.tsx
│   │       └── sonner.tsx
│   │
│   ├── lib/                     # Utilities
│   │   └── utils.ts
│   │
│   ├── test/                    # Test setup
│   │   └── setup.ts
│   │
│   ├── App.tsx                  # Root component
│   └── main.tsx                 # Entry point
│
├── e2e/                         # E2E tests
│   └── user-search.spec.ts
│
├── docs/                        # Documentation
│   ├── architecture.md
│   ├── api-reference.md
│   └── mcp-setup.md
│
└── .storybook/                  # Storybook config
    └── main.ts
```

## Future Improvements

### High Priority

1. **URL State Management:** Add `useSearchParams` for bookmarkable searches
2. **Pagination:** Implement cursor-based pagination for repositories
3. **Enhanced UI:** Display full user profile data (currently only shows name)
4. **Token Security:** Move authentication to backend with httpOnly cookies

### Medium Priority

1. **Input Debouncing:** Prevent rapid API calls
2. **Error Recovery:** Add retry buttons on error states
3. **Loading States:** Replace text with skeleton loaders
4. **Dark Mode Toggle:** Add UI for theme switching (infrastructure ready)

### Low Priority

1. **Analytics:** Track user behavior and API performance
2. **Search Suggestions:** Autocomplete from GitHub API
3. **Advanced Filters:** Filter repos by language, stars, etc.
4. **Offline Support:** Add service worker for offline functionality

## References

- [React 19 Documentation](https://react.dev/)
- [Apollo Client Documentation](https://www.apollographql.com/docs/react/)
- [Vite Documentation](https://vite.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [Tailwind CSS v4 Documentation](https://tailwindcss.com/)
- [shadcn/ui Documentation](https://ui.shadcn.com/)
- [GitHub GraphQL API](https://docs.github.com/en/graphql)
