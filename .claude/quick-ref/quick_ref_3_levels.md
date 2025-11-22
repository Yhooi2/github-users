# 3-Level Progressive Disclosure - Quick Reference

> **Purpose**: Understand the architecture at a glance  
> **Read time**: 3-5 minutes  
> **For detailed specs**: See `specs/level-0-*.md`, `specs/level-1-*.md`, `specs/level-2-*.md`

---

## 🎯 Why 3 Levels?

**Research-backed decision** (Nielsen Norman Group):
- ✅ **2-3 levels**: Optimal for complex data
- ❌ **>3 levels**: "Typically have problems"

**Our use case justifies 3 levels:**
1. **10-20+ repositories** per year → need compact overview
2. **Multiple user personas** → different detail needs (HR vs Tech Lead)
3. **Comparison required** → side-by-side card expansion
4. **Deep analytics available** → but optional for interested users

---

## 📊 Level 0: Compact List (Scanning Phase)

### Purpose
Show ALL projects from a year simultaneously for rapid scanning

### User Goal
*"What projects exist? Which are mine vs contributions?"*

### Key Features
- **Vertical commit bar** (4px, gradient)
- **Owner badge** (👤 vs 👥)
- **Metrics line** (commits, stars, language)
- **Hover preview** (HoverCard with description)

### Visual Structure
```
█████████ react-dashboard 👤
347 commits · ⭐ 1.2k · TypeScript
  ↑           ↑         ↑
  Bar      Metrics   Language
```

### Dimensions
- Height: `56px` (desktop), `48px` (mobile)
- Padding: `12px 16px`
- Gap: `8px` between rows
- Bar width: `4px`

### User Behavior (Expected)
- **100%** users see this level
- **5-10 seconds** scan time
- **50%+** scroll to bottom

### Components
- `CompactProjectRow.tsx` - Individual row
- `ProjectListContainer.tsx` - Scrollable container with grouping

### Responsive
- **Desktop**: Full list in right panel (67% width)
- **Mobile**: Full-width list, simplified metrics

---

## 📊 Level 1: Expandable Cards (Evaluation Phase)

### Purpose
Provide key details for 2-3 project comparison without losing context

### User Goal
*"Which projects are most relevant? How much did I contribute?"*

### Key Features
- **Smooth expansion** (Framer Motion for `height: auto`)
- **4 sections**:
  1. Header (description + social stats)
  2. Your Contribution (commits %, PRs, reviews, period)
  3. Tech Stack (horizontal bar chart)
  4. Team (contributor count, top collaborators)
- **Action buttons** (View Analytics, GitHub, Collapse)

### Visual Structure
```
┌─────────────────────────────────┐
│ [COLLAPSED] - Same as Level 0   │
├─────────────────────────────────┤
│ [EXPANDED STATE]                │
│                                 │
│ YOUR CONTRIBUTION               │
│ • 347 commits (18% of 1,923)    │
│ • 28 PRs merged (96% rate)      │
│                                 │
│ TECH STACK                      │
│ ████████████████░░░░ TS 68%     │
│ ██████░░░░░░░░░░░░░░ JS 22%     │
│                                 │
│ [View Analytics] [GitHub]       │
└─────────────────────────────────┘
```

### Animation
```typescript
// Framer Motion (CSS can't animate height: auto)
<motion.div
  initial={{ height: 0, opacity: 0 }}
  animate={{ height: 'auto', opacity: 1 }}
  transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
/>
```

### User Behavior (Expected)
- **40-60%** users expand ≥1 card
- **1.5-2.5** average cards expanded
- **15-30 seconds** time spent

### Components
- `ExpandableProjectCard.tsx` - Container with animation
- `ExpandedCardContent.tsx` - 4 sections + buttons

### Responsive
- **Desktop**: Multiple cards can expand (Set-based state)
- **Mobile**: Accordion mode (only one card, clear others on expand)

---

## 📊 Level 2: Full Analytics Modal (Analysis Phase)

### Purpose
Comprehensive deep-dive analytics for serious evaluation

### User Goal
*"Tell me everything about this project"*

### Key Features
- **4 horizontal tabs** (not 7! Combined related metrics):
  1. **📊 Overview** - Key metrics + activity breakdown
  2. **📈 Timeline** - Monthly chart + heatmap + patterns
  3. **💻 Code** - Languages + impact + file types
  4. **👥 Team** - PRs + collaboration + CI/CD
- **Responsive container**:
  - Desktop: Dialog (max-w-[min(800px, 90vw)])
  - Mobile: Sheet (bottom, h-[90vh])
- **Lazy loading** per tab (don't load all data upfront)
- **Export PDF** functionality

### Visual Structure
```
┌─────────────────────────────────────┐
│ react-dashboard · Analytics    [×]  │
├─────────────────────────────────────┤
│ ┌───┬───┬───┬───┐                  │
│ │📊 │📈 │💻 │👥 │ ← Horizontal tabs│
│ └───┴───┴───┴───┘                  │
│                                     │
│ [TAB CONTENT - Scrollable]          │
│                                     │
│ 📊 Contribution Overview            │
│ ┌────┬────┬────┬────┬────┐         │
│ │347 │ 28 │ 12 │234 │ 5  │         │
│ └────┴────┴────┴────┴────┘         │
│                                     │
└─────────────────────────────────────┘
```

### Tab Content Heights
- Overview: ~400px
- Timeline: ~450px (charts)
- Code: ~500px (pie chart + table)
- Team: ~500px

### User Behavior (Expected)
- **10-20%** users open modal
- **45+ seconds** time in modal
- **5-10%** export PDF

### Components
- `ProjectAnalyticsModal.tsx` - Dialog/Sheet wrapper
- `HorizontalTabsNav.tsx` - Tab navigation (4 tabs)
- `OverviewTab.tsx`, `TimelineTab.tsx`, `CodeTab.tsx`, `TeamTab.tsx`

### Responsive
- **Desktop**: Centered modal, backdrop blur
- **Mobile**: Full-screen Sheet from bottom

---

## 🔄 User Journey Flow

```
Level 0 (Scanning)
  │ User: "Interesting projects?"
  │ Time: 5-10 seconds
  │ Action: Click project
  ↓
Level 1 (Evaluation)
  │ User: "How much did they contribute?"
  │ Time: 15-30 seconds
  │ Action: Click "View Analytics" OR compare more
  ↓
Level 2 (Analysis)
  │ User: "Show me everything"
  │ Time: 45+ seconds
  │ Action: Navigate tabs, export PDF
  ↓
Decision Made
```

---

## 📏 Key Dimensions (Quick Reference)

| Element | Desktop | Mobile |
|---------|---------|--------|
| **Level 0 Row** | 56px | 48px |
| **Level 1 Expanded** | auto (max 500px) | auto (max 600px) |
| **Level 2 Modal** | min(800px, 90vw) | 100vw |
| **Modal Height** | 85vh | 90vh |
| **Touch Target** | 44px+ | 48px+ |

---

## 🎨 Visual Hierarchy

```
Information Density:

Level 0: ████████ (High - many items)
Level 1: ████     (Medium - few items)
Level 2: ██       (Low - single focus)

Attention:

Level 0: Distributed (scanning)
Level 1: Selective (comparing)
Level 2: Focused (analyzing)
```

---

## ✅ Critical Rules (Always Follow)

1. **Level 0**: ALL projects visible, NO pagination
2. **Level 1**: Smooth Framer Motion animation (NOT CSS-only)
3. **Level 2**: MAXIMUM 4-5 tabs (combine related metrics)
4. **Mobile**: Accordion behavior (only one card expanded)
5. **Desktop**: Multiple cards can expand (Set-based state)
6. **All platforms**: Years COLLAPSED by default
7. **Modal**: Sheet on mobile, Dialog on desktop

---

## 🚫 Anti-Patterns to Avoid

❌ **"All expanded by default"** - Cognitive overload  
❌ **More than 3 levels** - Over-engineering  
❌ **7+ tabs in modal** - Tab overload  
❌ **CSS-only height animation** - Doesn't work for `height: auto`  
❌ **Pagination in Level 0** - Defeats purpose of "scan all"  
❌ **localStorage** - Not supported in Claude.ai artifacts

---

## 📚 Next Steps

**For implementation details:**
- Level 0: Read `specs/level-0-compact-list.md`
- Level 1: Read `specs/level-1-expandable-card.md`
- Level 2: Read `specs/level-2-modal-tabs.md`

**For code examples:**
- `examples/compact-project-row.tsx`
- `examples/expandable-card.tsx`
- `examples/modal-with-tabs.tsx`

**For help:**
- Invoke `teaching-mentor`: "Explain Level X pattern"
- Invoke `ui-design-specialist`: "Implement Level X"
