# Phase 2: Implement Level 0 Guide

> **Purpose**: Build compact list for project scanning  
> **Read this when**: Implementing Level 0 after setup  
> **For specs**: See `specs/level-0-compact-list.md`  
> **For example**: See `examples/compact-project-row.tsx`

---

## 🎯 Overview

Эта фаза реализует Level 0: контейнер и строки для списка проектов. Используй specs для деталей.

**Time Estimate**: 1-2 hours  
**Prerequisites**: Phase 1 complete  
**Outcome**: Рабочий список с sorting и hover

---

## 📋 Step-by-Step Instructions

### Step 1: Create Folders

```bash
mkdir -p src/components/level-0
```

### Step 2: Implement ProjectListContainer

- File: `src/components/level-0/ProjectListContainer.tsx`
- Используй props из specs
- Group projects: owner & contrib
- Добавь DropdownMenu для sort
- Render CompactProjectRow

### Step 3: Implement CompactProjectRow

- File: `src/components/level-0/CompactProjectRow.tsx`
- Calculate bar height
- Добавь HoverCard
- Используй cn() для classes

### Step 4: Integrate into App

- В `App.tsx`: Добавь <ProjectListContainer projects={mockData} ... />
- Создай mock data в `lib/mock-projects.ts`

### Step 5: Add Responsive

- Use useResponsive() для adjustments

### Step 6: Test

```bash
npm run test  # Unit for row render
npm run test:e2e  # Click row
```

---

## 🧪 Verification Checklist

- [ ] List renders with groups
- [ ] Sorting works
- [ ] Hover shows preview
- [ ] Mobile: Reduced height
- [ ] No errors

---

## 🔗 Related Docs

- **Specs**: `specs/level-0-compact-list.md`
- **Responsive**: `quick-ref/responsive-rules.md`

**For help**: Invoke `ui-design-specialist`: "Implement Level 0 container"

---
