# Architecture Summary - Quick Reference

> **Purpose**: High-level overview of key systems  
> **For full details**: See `docs/architecture.md`

### Apollo Client Setup (v3.14.0)

**Location:** `src/apollo/ApolloAppProvider.tsx`  
**Link Chain:** `errorLink → httpLink`

1. **errorLink**: Global error handler with `onError` — logs, toasts, handles UNAUTHENTICATED/401.
2. **httpLink**: Points to `/api/github-proxy` (server proxy). Security: Server-side auth, no client tokens.  
   **Cache:** `InMemoryCache` (default).  
   **Migration Note**: From direct GitHub API to proxy for security.

### Data Fetching Pattern

**Custom Hook:** `src/apollo/useQueryUser.ts` — Memoized variables; skip if no login; errorPolicy 'all'.  
**Date Helpers:** `src/apollo/date-helpers.ts` — ISO dates for ranges (365 days + 3 years).  
**GraphQL Query:** `src/apollo/queriers.ts` — GET_USER_INFO; types in `github-api.types.ts`.

### Component Architecture

**Main Components:**

- `SearchForm.tsx`: Controlled input, validation, toasts.
- `UserProfile.tsx`: Uses useQueryUser; handles states (loading/error/not found).
- `UserAuthenticity.tsx`: Score breakdown; uses useAuthenticityScore hook.  
  **UI Components:** `src/components/ui/` — shadcn (New York style); cn() for classes.

### Path Aliases

TypeScript/Vite: `@` → `./src` (e.g., import { Button } from "@/components/ui/button").

### Environment Variables

**Backend:** GITHUB_TOKEN server-side only.  
**Deprecated:** VITE_GITHUB_TOKEN (migrated to proxy).  
**Scopes:** read:user, user:email.
