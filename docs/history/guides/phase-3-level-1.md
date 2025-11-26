# Phase 3: Implement Level 1 Guide

> **Purpose**: Add expandable cards  
> **Read this when**: After Level 0  
> **For specs**: See `specs/level-1-expandable-card.md`  
> **For example**: See `examples/expandable-card.tsx`

---

## 🎯 Overview

Реализуй expansion из Level 0 в карточки с деталями.

**Time Estimate**: 2-3 hours  
**Prerequisites**: Phase 2  
**Outcome**: Expand/collapse with animation

---

## 📋 Step-by-Step Instructions

### Step 1: Create Folders

```bash
mkdir -p src/components/level-1
```

### Step 2: Implement ExpandableProjectCard

- Integrate with Level 0 row
- Use Framer Motion для expand
- Conditional accordion на mobile

### Step 3: Implement ExpandedCardContent

- 4 sections как в specs
- Добавь Recharts bar (lazy)

### Step 4: State Management

- Use Set<string> для expanded IDs
- onToggle: Toggle set (desktop), set single (mobile)

### Step 5: Integrate

- В ProjectListContainer: Pass expanded state

### Step 6: Test

- Unit: Animation variants
- E2E: Expand multiple on desktop

---

## 🧪 Verification Checklist

- [ ] Smooth expand
- [ ] Multiple on desktop, single on mobile
- [ ] Charts render
- [ ] Actions work

---

## 🔗 Related Docs

- **Specs**: `specs/level-1-expandable-card.md`

**For help**: Invoke `ux-optimization-specialist`: "Optimize Level 1 animation"

---

**Version**: 2.0.0  
**Last Updated**: 2025-01-22

</details>

<details>
<summary>guides/phase-4-level-2.md</summary>

# Phase 4: Implement Level 2 Guide

> **Purpose**: Add full analytics modal  
> **Read this when**: After Level 1  
> **For specs**: See `specs/level-2-modal-tabs.md`  
> **For example**: See `examples/modal-with-tabs.tsx`

---

## 🎯 Overview

Реализуй модал с табами для deep dive.

**Time Estimate**: 3-4 hours  
**Prerequisites**: Phase 3  
**Outcome**: Working modal with lazy tabs

---

## 📋 Step-by-Step Instructions

### Step 1: Create Folders

```bash
mkdir -p src/components/level-2
```

### Step 2: Implement ProjectAnalyticsModal

- Use Dialog/Sheet based on responsive
- Add Framer Motion animation

### Step 3: Implement HorizontalTabsNav

- 4 tabs with icons

### Step 4: Implement Tab Components

- Each with charts/data
- Lazy fetch on select

### Step 5: Add Export

- Use jsPDF for PDF

### Step 6: Integrate & Test

- From Level 1 button open modal
- E2E: Tab navigation, load

---

## 🧪 Verification Checklist

- [ ] Modal opens/closes
- [ ] Tabs lazy load
- [ ] Charts responsive
- [ ] PDF exports correctly

---

## 🔗 Related Docs

- **Specs**: `specs/level-2-modal-tabs.md`

**For help**: Invoke `test-runner-fixer`: "Test Level 2 E2E"

---
