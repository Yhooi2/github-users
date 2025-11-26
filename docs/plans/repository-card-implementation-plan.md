# Repository Card Redesign - Implementation Plan

**Date**: 2025-11-26
**Related Documents**:
- [UX/UI Redesign Brainstorm](./repository-card-ux-redesign.md) - Full analysis and rationale
- [Visual Mockups](./repository-card-visual-mockups.md) - ASCII mockups and design specs

---

## Quick Summary

### Problem
Repository cards currently duplicate GitHub's functionality without adding unique value.

### Solution
Transform cards into **user analytics tools** by:
1. Prominently showing user's **contribution percentage** (80% vs 5% matters!)
2. Adding **role indicators** (Owner, Maintainer, Contributor)
3. Showing **activity status** (Active, Recent, Inactive)
4. Eliminating redundancy (languages shown once, not twice)
5. Using **user-centric language** ("Your work has X stars")

### Key Differentiator
Answer: **"What did THIS user do in THIS project?"** instead of just showing what GitHub already shows.

---

## Implementation Phases

### Phase 1: Data Layer (Priority 1) - 4 hours

**Goal**: Ensure all required data is available

#### 1.1 Audit GraphQL API
**File**: `src/apollo/queries/yearContributions.ts`

Check if we can get:
- ✅ User's commit count per repo (AVAILABLE)
- ✅ Total commit count per repo (AVAILABLE)
- ❓ User's first/last commit date per repo (CHECK NEEDED)
- ❓ User's PR count per repo (CHECK NEEDED)
- ❓ User's code review count per repo (CHECK NEEDED)

**Action**: Run test query to validate data availability

```graphql
query TestRepositoryData($owner: String!, $name: String!, $since: DateTime!) {
  repository(owner: $owner, name: $name) {
    # Existing fields
    id
    name
    stargazerCount
    forkCount

    # Check if these are available
    defaultBranchRef {
      target {
        ... on Commit {
          history(since: $since, author: { id: $userId }) {
            totalCount
            edges {
              node {
                committedDate
              }
            }
          }
        }
      }
    }

    # Check PR data
    pullRequests(states: MERGED, author: $userId) {
      totalCount
    }

    # Check review data (may require separate query)
  }
}
```

**Estimated time**: 1 hour

#### 1.2 Create Calculation Functions
**File**: `src/lib/metrics/repository-metrics.ts` (NEW)

Create helper functions:

```typescript
/**
 * Calculate user's role based on contribution percentage
 */
export function calculateRepositoryRole(
  contributionPercent: number,
  isOwner: boolean
): 'Owner' | 'Maintainer' | 'Core Contributor' | 'Contributor';

/**
 * Calculate activity freshness status
 */
export function calculateActivityStatus(
  lastCommitDate: string
): 'Active' | 'Recent' | 'Inactive';

/**
 * Calculate code ownership score (0-100)
 */
export function calculateCodeOwnershipScore(
  contributionPercent: number,
  prsMerged: number,
  reviews: number,
  activeDays: number
): number;

/**
 * Calculate project health status
 */
export function calculateProjectHealth(
  lastRepoUpdateDays: number,
  starToForkRatio: number,
  isArchived: boolean
): 'Healthy' | 'Active' | 'Stale' | 'Archived';

/**
 * Get contribution level color class
 */
export function getContributionColor(percent: number): string;

/**
 * Generate user-centric impact message
 */
export function generateImpactMessage(
  stars: number,
  contributionPercent: number
): string;
```

**Estimated time**: 1.5 hours

#### 1.3 Write Tests
**File**: `src/lib/metrics/repository-metrics.test.ts` (NEW)

Test all calculation functions with:
- Normal cases
- Edge cases (0%, 100%, missing data)
- Boundary conditions (19% vs 20%, 49% vs 50%)

**Target coverage**: 100% for calculation logic

**Estimated time**: 1.5 hours

---

### Phase 2: Component Updates (Priority 1) - 6 hours

#### 2.1 Update CompactProjectRow (Level 0)
**File**: `src/components/level-0/CompactProjectRow.tsx`

**Changes**:
1. Add contribution % badge to header row
2. Color-code badge based on contribution level
3. Update combined activity bar to use user's commits
4. Simplify metrics (remove verbose labels on mobile)

**Before**:
```tsx
<span className="min-w-0 flex-1 truncate text-sm font-medium">
  {project.name}
</span>
```

**After**:
```tsx
<span className="min-w-0 flex-1 truncate text-sm font-medium">
  {project.name}
</span>

{/* NEW: Contribution badge */}
{project.contributionPercent !== undefined && (
  <Badge
    variant="secondary"
    className={cn(
      "flex-shrink-0 gap-1 text-xs font-bold",
      getContributionColorClass(project.contributionPercent)
    )}
  >
    {project.contributionPercent}%
  </Badge>
)}
```

**Estimated time**: 1.5 hours

#### 2.2 Refactor ExpandableProjectCard (Level 1)
**File**: `src/components/level-1/ExpandableProjectCard.tsx`

**Major structural changes**:

1. **Rename and enhance ContributionSection**:
   - Add large progress bar with role badge
   - Add activity status indicator
   - Add code ownership score
   - Make it the hero section (most visual weight)

2. **Rename TechStackSection → UserSkillsSection**:
   - Change focus from "repo languages" to "user's languages"
   - Show inline (not vertical list)
   - Remove redundancy with header bar

3. **Rename ImpactSection → ProjectContextSection**:
   - Add user-centric impact message
   - Add project health status
   - Add "Last updated" timestamp
   - Combine metrics in one line

4. **Tighten spacing**:
   - `space-y-3` instead of `space-y-4`
   - `p-3` instead of `p-4`
   - Target height: ~280px (down from ~350px)

**Estimated time**: 3 hours

#### 2.3 Create New Badge Components
**Files**:
- `src/components/level-1/ActivityStatusBadge.tsx` (NEW)
- `src/components/level-1/HealthStatusBadge.tsx` (NEW)

**ActivityStatusBadge**:
```tsx
export function ActivityStatusBadge({
  status
}: {
  status: 'Active' | 'Recent' | 'Inactive'
}) {
  // Green with pulse for Active
  // Yellow for Recent
  // Gray for Inactive
}
```

**HealthStatusBadge**:
```tsx
export function HealthStatusBadge({
  status
}: {
  status: 'Healthy' | 'Active' | 'Stale' | 'Archived'
}) {
  // Color-coded with appropriate icons
}
```

**Estimated time**: 1 hour

#### 2.4 Update Project Adapters
**File**: `src/lib/adapters/project-adapter.ts`

Extend `ExpandableProject` interface:
```typescript
export interface ExpandableProject extends CompactProject {
  // ... existing fields ...

  // NEW FIELDS
  roleLabel?: 'Owner' | 'Maintainer' | 'Core Contributor' | 'Contributor';
  activityStatus?: 'Active' | 'Recent' | 'Inactive';
  lastUserCommitDate?: string;
  firstUserCommitDate?: string;
  codeOwnershipScore?: number;
  projectHealthStatus?: 'Healthy' | 'Active' | 'Stale' | 'Archived';
  userLanguages?: LanguageInfo[];
  impactMessage?: string;
}
```

Update `toExpandableProject` function to calculate new fields.

**Estimated time**: 0.5 hours

---

### Phase 3: Storybook Stories (Priority 1) - 3 hours

#### 3.1 Update Existing Stories
**Files**:
- `src/components/level-0/CompactProjectRow.stories.tsx` (UPDATE)
- `src/components/level-1/ExpandableProjectCard.stories.tsx` (UPDATE)

**Required story variants**:

```typescript
// CompactProjectRow stories
export const OwnerHighContribution = {
  args: {
    project: {
      ...baseProject,
      contributionPercent: 92,
      isOwner: true,
    }
  }
};

export const MaintainerModerate = {
  args: {
    project: {
      ...baseProject,
      contributionPercent: 58,
      isOwner: false,
    }
  }
};

export const ContributorLow = {
  args: {
    project: {
      ...baseProject,
      contributionPercent: 12,
      isOwner: false,
    }
  }
};

export const ForkNoCommits = {
  args: {
    project: {
      ...baseProject,
      contributionPercent: 0,
      isFork: true,
      userCommits: 0,
    }
  }
};

export const ArchivedProject = {
  args: {
    project: {
      ...baseProject,
      contributionPercent: 85,
      projectHealthStatus: 'Archived',
      activityStatus: 'Inactive',
    }
  }
};
```

**Estimated time**: 2 hours

#### 3.2 Create New Stories
**Files**:
- `src/components/level-1/ActivityStatusBadge.stories.tsx` (NEW)
- `src/components/level-1/HealthStatusBadge.stories.tsx` (NEW)

**Story variants**:
- Active status (with pulse animation)
- Recent status
- Inactive status
- All health statuses

**Estimated time**: 1 hour

---

### Phase 4: Testing (Priority 1) - 4 hours

#### 4.1 Update Component Tests
**Files**:
- `src/components/level-0/CompactProjectRow.test.tsx` (UPDATE)
- `src/components/level-1/ExpandableProjectCard.test.tsx` (UPDATE)

**Test cases to add**:

```typescript
describe('CompactProjectRow', () => {
  it('shows contribution % badge when available', () => {
    // Test badge rendering
  });

  it('color-codes badge based on contribution level', () => {
    // Test green for 80%+, blue for 50-79%, etc.
  });

  it('handles missing contribution data gracefully', () => {
    // Test undefined contributionPercent
  });
});

describe('ExpandableProjectCard', () => {
  it('shows role badge based on contribution %', () => {
    // Test Owner, Maintainer, Contributor badges
  });

  it('displays activity status indicator', () => {
    // Test Active, Recent, Inactive
  });

  it('shows code ownership score when available', () => {
    // Test score display
  });

  it('generates user-centric impact message', () => {
    // Test "Your work has X stars"
  });

  it('shows project health status', () => {
    // Test Healthy, Active, Stale, Archived
  });
});
```

**Estimated time**: 2 hours

#### 4.2 Create Tests for New Components
**Files**:
- `src/components/level-1/ActivityStatusBadge.test.tsx` (NEW)
- `src/components/level-1/HealthStatusBadge.test.tsx` (NEW)

**Test coverage**:
- All status variants render correctly
- Icons render with correct colors
- Pulse animation works for "Active" status
- Accessibility attributes present

**Estimated time**: 1 hour

#### 4.3 Run Accessibility Audits
**Tools**: Storybook a11y addon, Axe DevTools

**Check**:
- Color contrast ratios (WCAG AA)
- Keyboard navigation
- Screen reader labels
- Focus indicators

**Estimated time**: 1 hour

---

### Phase 5: Integration & Polish (Priority 2) - 3 hours

#### 5.1 Update Timeline Components
**Files**:
- `src/components/timeline/YearCard.tsx` (UPDATE if needed)
- `src/components/timeline/DesktopTimelineLayout.tsx` (UPDATE if needed)

Ensure new card design works well in timeline context.

**Estimated time**: 1 hour

#### 5.2 Responsive Testing
**Breakpoints to test**:
- Mobile: <768px
- Tablet: 768-1439px
- Desktop: ≥1440px

**Check**:
- Contribution badge visibility
- Text truncation
- Touch targets (44x44px minimum)
- Spacing adjustments

**Estimated time**: 1 hour

#### 5.3 Animation Polish
**Verify**:
- Progress bar fill animation (300ms ease-out)
- Active status pulse (2s cycle)
- Contribution badge entrance (100ms scale+fade)
- Respects `prefers-reduced-motion`

**Estimated time**: 1 hour

---

### Phase 6: Documentation (Priority 2) - 2 hours

#### 6.1 Update Components Guide
**File**: `docs/components-guide.md`

Update sections:
- Level 0: CompactProjectRow
- Level 1: ExpandableProjectCard
- Add new badge components

**Estimated time**: 1 hour

#### 6.2 Update Architecture Docs
**File**: `docs/architecture.md`

Document new metrics and calculations.

**Estimated time**: 0.5 hours

#### 6.3 Create Migration Notes
**File**: `docs/migrations/repository-cards-v2.md` (NEW)

Document:
- What changed
- Why it changed
- Migration guide (if needed for API changes)

**Estimated time**: 0.5 hours

---

## Total Estimated Effort

| Phase | Description | Hours |
|-------|-------------|-------|
| 1 | Data Layer | 4 |
| 2 | Component Updates | 6 |
| 3 | Storybook Stories | 3 |
| 4 | Testing | 4 |
| 5 | Integration & Polish | 3 |
| 6 | Documentation | 2 |
| **Total** | | **22 hours** |

**Estimated calendar time**: 3-4 working days (at 6-8 hours/day)

---

## Priority Rankings

### Must Have (Phase 1 Implementation)
1. ✅ Contribution % badge in header (Level 0)
2. ✅ Large progress bar in expanded view (Level 1)
3. ✅ Role indicators (Owner, Maintainer, etc.)
4. ✅ Activity status (Active, Recent, Inactive)
5. ✅ Remove duplicate language section
6. ✅ User-centric impact message

### Nice to Have (Phase 2 - Optional)
1. ⭐ Code ownership score (0-100)
2. ⭐ Project health status badge
3. ⭐ User-specific language breakdown
4. ⭐ Enhanced tooltips with more context

### Future Enhancements (Backlog)
1. 🔮 Complexity indicators (file types touched)
2. 🔮 Language trend over time
3. 🔮 Contribution heatmap visualization
4. 🔮 Team collaboration graph

---

## Implementation Checklist

### Pre-Implementation
- [ ] Review this plan with team
- [ ] Validate GraphQL data availability
- [ ] Set up feature flag: `ENABLE_NEW_REPO_CARDS`
- [ ] Create implementation branch: `feat/repository-cards-v2`

### Phase 1: Data Layer
- [ ] Audit GitHub GraphQL API
- [ ] Create `repository-metrics.ts` with calculations
- [ ] Write tests for all calculation functions
- [ ] Achieve 100% test coverage for calculations

### Phase 2: Components
- [ ] Update `CompactProjectRow` with contribution badge
- [ ] Refactor `ExpandableProjectCard` sections
- [ ] Create `ActivityStatusBadge` component
- [ ] Create `HealthStatusBadge` component
- [ ] Update project adapters

### Phase 3: Storybook
- [ ] Update `CompactProjectRow` stories
- [ ] Update `ExpandableProjectCard` stories
- [ ] Create badge component stories
- [ ] Build Storybook: `npm run build-storybook`
- [ ] Review all variants in Storybook

### Phase 4: Testing
- [ ] Update `CompactProjectRow` tests
- [ ] Update `ExpandableProjectCard` tests
- [ ] Create badge component tests
- [ ] Run tests: `npm test`
- [ ] Run accessibility audit (Storybook a11y addon)
- [ ] Fix any issues found

### Phase 5: Integration
- [ ] Test in timeline context
- [ ] Responsive testing (mobile/tablet/desktop)
- [ ] Animation polish
- [ ] Performance check (render time <100ms)

### Phase 6: Documentation
- [ ] Update `components-guide.md`
- [ ] Update `architecture.md`
- [ ] Create migration notes
- [ ] Update quick reference guides

### Deployment
- [ ] Code review
- [ ] Merge to main
- [ ] Deploy to staging
- [ ] User acceptance testing
- [ ] Deploy to production (gradual rollout)
- [ ] Monitor metrics and feedback

---

## Success Criteria

### User Experience
- ✅ Users can identify high-value repos in <2 seconds
- ✅ Contribution % is immediately visible in collapsed state
- ✅ Role is clear without expanding card
- ✅ No duplicate information displayed

### Technical
- ✅ All tests pass (maintain 90%+ coverage)
- ✅ WCAG 2.1 AA compliant (Axe audit passes)
- ✅ Render performance <100ms per card
- ✅ Respects `prefers-reduced-motion`
- ✅ No console errors or warnings

### Design
- ✅ Visual hierarchy clear (contribution data most prominent)
- ✅ Color coding consistent and accessible
- ✅ Spacing tight but readable
- ✅ Mobile-friendly (touch targets 44x44px)

---

## Rollback Plan

If issues arise after deployment:

1. **Immediate**: Toggle feature flag OFF
   ```typescript
   // In feature flags config
   ENABLE_NEW_REPO_CARDS: false
   ```

2. **Investigation**: Review logs and user feedback

3. **Fix Forward**: If minor issues, fix and redeploy

4. **Full Rollback**: If major issues:
   - Revert commit
   - Redeploy previous version
   - Document lessons learned

---

## Open Questions & Risks

### Technical Risks
1. **GraphQL Data Availability**
   - Risk: User-specific commit dates may not be available
   - Mitigation: Use approximations or mark as "unavailable"

2. **API Rate Limits**
   - Risk: Additional queries may hit rate limits
   - Mitigation: Batch requests, use caching

3. **Performance**
   - Risk: More calculations = slower render
   - Mitigation: Memoize calculations, profile performance

### UX Risks
1. **Information Overload**
   - Risk: Too much data in expanded view
   - Mitigation: A/B test, collect user feedback

2. **Color Coding Confusion**
   - Risk: Users don't understand color meanings
   - Mitigation: Tooltips, legend, user testing

### Process Risks
1. **Scope Creep**
   - Risk: Adding too many features
   - Mitigation: Stick to Must Have list, defer Nice to Have

---

## Next Actions (This Week)

### Monday
1. Review this plan with team
2. Validate GraphQL API data availability
3. Set up feature flag and implementation branch

### Tuesday
4. Implement Phase 1 (Data Layer)
5. Write and test calculation functions

### Wednesday
6. Implement Phase 2 (Components)
7. Update CompactProjectRow and ExpandableProjectCard

### Thursday
8. Implement Phase 3 (Storybook)
9. Create/update all stories

### Friday
10. Implement Phase 4 (Testing)
11. Write tests and run accessibility audit

### Following Week
12. Phase 5 (Integration & Polish)
13. Phase 6 (Documentation)
14. Code review and deployment

---

## Contact & Questions

For questions about this implementation plan:
- Review related documents in `docs/plans/`
- Check Storybook for visual reference
- Run `npm run storybook` to see current state

**Remember**: The goal is to make repository cards MORE valuable than just looking at GitHub directly by focusing on **user-specific context and insights**.
