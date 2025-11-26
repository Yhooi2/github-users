# Phase 5: Layout Refactoring

**Priority:** P1 Important
**Status:** ✅ COMPLETED
**Completed:** November 2025
**Main Files:** `src/App.tsx`, `src/components/projects/`, `src/components/layout/`

---

## Goal

Replace tab-based layout with single-page vertical scroll for better UX and progressive disclosure.

---

## Before vs After

### Before (Tab-based)
```
Tabs:
  - Profile tab
  - Stats tab
  - Repositories tab
```

### After (Single-page)
```
Vertical scroll:
  1. Header (Search + UserMenu)
  2. RateLimitBanner
  3. UserProfile
  4. QuickAssessment (4 metrics)
  5. ActivityTimeline
  6. ProjectSection (Owned vs Contributions)
```

---

## Delivered Components

| Component | File | Purpose | Status |
|-----------|------|---------|--------|
| **SearchHeader** | `SearchHeader.tsx` | Title + search form | ✅ Done |
| **ProjectSection** | `ProjectSection.tsx` | Repository grid | ✅ Done |
| **RateLimitBanner** | `RateLimitBanner.tsx` | Rate limit info | ✅ Done |
| **UserMenu** | `UserMenu.tsx` | Auth dropdown | ✅ Done |

---

## Layout Structure

```typescript
// App.tsx
function App() {
  return (
    <div className="min-h-screen">
      <SearchHeader />

      {userName && profile && (
        <>
          <RateLimitBanner />
          <UserProfile />
          <QuickAssessment metrics={metrics} />
          <ActivityTimeline years={years} />
          <ProjectSection
            owned={ownedRepos}
            contributed={contributedRepos}
          />
        </>
      )}
    </div>
  );
}
```

---

## ProjectSection Features

```typescript
interface ProjectSectionProps {
  owned: Repository[];       // 👤 Your Original Projects
  contributed: Repository[]; // 👥 Open Source Contributions
  loading?: boolean;
}
```

**Layout:**
- Two-column split (owned | contributed)
- Responsive (stacks on mobile)
- Uses RepositoryCard component
- Empty state handling per section

---

## Removed

- ❌ `MainTabs` component
- ❌ Tab state management
- ❌ Separate Stats page
- ❌ Separate Repositories page

---

## Progressive Disclosure

1. **Immediate:** User profile + quick metrics
2. **On scroll:** Timeline + repositories
3. **On click:** Year expansion, metric explanations

---

## Testing

| Component | Tests |
|-----------|-------|
| App.tsx | Integration tests |
| ProjectSection | Integrated in component tests |
| Layout components | 50+ tests total |

---

## Related Documentation

- [Phase 3: Core Components](./phase-3-core-components.md) - QuickAssessment
- [Phase 4: Timeline Components](./phase-4-timeline-components.md) - ActivityTimeline
- [Phase 7: OAuth Integration](./phase-7-oauth-integration.md) - UserMenu, RateLimitBanner
