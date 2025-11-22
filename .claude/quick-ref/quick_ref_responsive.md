# Responsive Design Rules - Quick Reference

> **Purpose**: Essential responsive behavior rules  
> **For detailed specs**: See `specs/responsive-design.md`  
> **For implementation**: See `examples/responsive-hook.tsx`

---

## 📐 Breakpoints

```typescript
const BREAKPOINTS = {
  mobile:  0,       // 0 - 767px
  tablet:  768,     // 768 - 1439px
  desktop: 1440,    // 1440px+
} as const
```

**Tailwind mapping**:
```css
/* Mobile-first approach */
.class                    /* mobile: 0-767px */
md:class                  /* tablet: 768px+ */
xl:class                  /* desktop: 1280px+ */
2xl:class                 /* large: 1536px+ */
```

---

## 📱 Mobile (< 768px)

### Layout
- **Full-width accordion** for years
- **All years COLLAPSED by default**
- **Sheet modal** (bottom, h-[90vh]) instead of Dialog

### Level 0 (Compact List)
```typescript
height: 48px           // Reduced from 56px
padding: 12px 16px
font-size: 14px        // Project name
min-touch-target: 48px // WCAG 2.1 AA requirement
```

### Level 1 (Expandable Cards)
**CRITICAL: Accordion Mode**
```typescript
// Only ONE card can be expanded at a time
const handleToggle = (id: string) => {
  setExpanded(prev => 
    prev.has(id) ? new Set() : new Set([id])
  )
}
```

**Why**: Prevents scroll chaos, reduces cognitive load

### Level 2 (Modal)
```tsx
<Sheet side="bottom" className="h-[90vh]">
  {/* Full-screen from bottom */}
</Sheet>
```

**Tabs**:
- Icon size: `20px` (vs 24px desktop)
- Label size: `9px` (vs 11px desktop)
- 4 tabs in single row (grid-cols-4)

---

## 💻 Tablet (768px - 1439px)

### Layout
- **Fixed left panel**: 280px min-width
- **Flexible right panel**: Fills remaining space
- **Years still COLLAPSED by default**

```css
.main-layout {
  display: grid;
  grid-template-columns: minmax(280px, 320px) 1fr;
  gap: 20px;
}
```

### Level 0
```typescript
height: 56px           // Same as desktop
padding: 12px 16px
// May show in 2-column grid if space allows
```

### Level 1
**Multiple cards can expand** (same as desktop)
```typescript
// Set-based state (multiple allowed)
const handleToggle = (id: string) => {
  setExpanded(prev => {
    const next = new Set(prev)
    next.has(id) ? next.delete(id) : next.add(id)
    return next
  })
}
```

### Level 2 (Modal)
```tsx
<Dialog>
  <DialogContent className="max-w-[600px]">
    {/* Slightly smaller than desktop */}
  </DialogContent>
</Dialog>
```

---

## 🖥️ Desktop (≥ 1440px)

### Layout
**33/67 Split** (1fr / 2fr grid)
```css
.main-layout {
  display: grid;
  grid-template-columns: 1fr 2fr;  /* ✅ fr units, NOT % */
  gap: 24px;
  max-width: 1920px;
}
```

**Why fr units**: `33% + 67% + gap = overflow`. Use `1fr 2fr` instead.

### Level 0
```typescript
height: 56px
padding: 12px 16px
font-size: 14px
// Projects shown in right panel (67%)
```

### Level 1
**Multiple expansion allowed**
```typescript
// Desktop: Can compare 2-3 cards side-by-side
expandedProjects: Set<string>  // Multiple IDs
```

### Level 2 (Modal)
```tsx
<Dialog>
  <DialogContent className="max-w-[min(800px,90vw)]">
    {/* Responsive width: 800px or 90vw, whichever is smaller */}
    <Tabs>
      {/* Icon: 24px, Label: 11px */}
    </Tabs>
  </DialogContent>
</Dialog>
```

---

## 🎯 Component-Specific Rules

### CompactProjectRow
| Property | Mobile | Tablet | Desktop |
|----------|--------|--------|---------|
| Height | 48px | 56px | 56px |
| Touch target | 48px+ | 44px+ | 44px+ |
| Font size | 14px | 14px | 14px |
| Hover effect | `:active` | `:hover` | `:hover` |

### ExpandableProjectCard
| Property | Mobile | Tablet | Desktop |
|----------|--------|--------|---------|
| Expansion mode | Accordion | Multiple | Multiple |
| Max expanded | 1 | Unlimited | Unlimited |
| Animation duration | 300ms | 300ms | 300ms |
| Content padding | 16px | 20px | 20px |

### ProjectAnalyticsModal
| Property | Mobile | Tablet | Desktop |
|----------|--------|--------|---------|
| Container | Sheet | Dialog | Dialog |
| Width | 100vw | 600px | 800px |
| Height | 90vh | 85vh | 85vh |
| Position | bottom | center | center |
| Tab icon size | 20px | 22px | 24px |
| Tab label size | 9px | 10px | 11px |

---

## ✅ Responsive Checklist

### Must Test on These Viewports
- [ ] **375px** - iPhone SE (mobile minimum)
- [ ] **414px** - iPhone Pro Max
- [ ] **768px** - iPad Portrait (breakpoint)
- [ ] **1024px** - iPad Landscape
- [ ] **1280px** - Laptop
- [ ] **1440px** - Desktop (breakpoint)
- [ ] **1920px** - Large Desktop

### Must Test These Features
- [ ] All years COLLAPSED by default (mobile + desktop)
- [ ] Mobile accordion (only one card)
- [ ] Desktop multiple expansion (2-3 cards)
- [ ] Sheet opens from bottom (mobile)
- [ ] Dialog centers on screen (desktop)
- [ ] Touch targets minimum 44px (mobile)
- [ ] No horizontal scrolling on any breakpoint
- [ ] Layout doesn't break at intermediate widths

---

## 🚫 Common Mistakes to Avoid

❌ **"All expanded by default"** on mobile  
✅ All years COLLAPSED on ALL platforms

❌ **Hardcoded widths in percentages**  
✅ Use `fr` units in CSS Grid

❌ **Same expansion behavior on all devices**  
✅ Accordion (mobile) vs Multiple (desktop)

❌ **Dialog on mobile**  
✅ Sheet from bottom

❌ **Touch targets < 44px**  
✅ Minimum 44px (WCAG 2.1 AA)

❌ **CSS-only responsive**  
✅ Use React hooks for JS-based behavior changes

---

## 🔧 Implementation Pattern

```typescript
// hooks/useResponsive.ts
export function useResponsive() {
  const isMobile = useMediaQuery('(max-width: 767px)')
  const isTablet = useMediaQuery('(min-width: 768px) and (max-width: 1439px)')
  const isDesktop = useMediaQuery('(min-width: 1440px)')
  
  return { isMobile, isTablet, isDesktop }
}

// Usage in component
function ProjectCard() {
  const { isMobile } = useResponsive()
  
  const handleToggle = (id: string) => {
    if (isMobile) {
      // Accordion: only one
      setExpanded(new Set([id]))
    } else {
      // Multiple: toggle
      setExpanded(prev => {
        const next = new Set(prev)
        next.has(id) ? next.delete(id) : next.add(id)
        return next
      })
    }
  }
  
  return (
    <Modal>
      {isMobile ? (
        <Sheet side="bottom" className="h-[90vh]">
          {content}
        </Sheet>
      ) : (
        <Dialog>
          <DialogContent className="max-w-[min(800px,90vw)]">
            {content}
          </DialogContent>
        </Dialog>
      )}
    </Modal>
  )
}
```

---

## 🎨 CSS Best Practices

### Mobile-First Approach
```css
/* Base: Mobile styles (0-767px) */
.container {
  padding: 16px;
}

/* Tablet: 768px+ */
@media (min-width: 768px) {
  .container {
    padding: 20px;
  }
}

/* Desktop: 1440px+ */
@media (min-width: 1440px) {
  .container {
    padding: 24px;
    max-width: 1920px;
  }
}
```

### Tailwind Utilities
```tsx
<div className={cn(
  "p-4",           // Mobile: 16px
  "md:p-5",        // Tablet: 20px
  "2xl:p-6"        // Desktop: 24px
)}>
  {/* Content */}
</div>
```

---

## 📊 Performance Targets by Viewport

| Metric | Mobile | Tablet | Desktop |
|--------|--------|--------|---------|
| Initial load | < 3s | < 2s | < 1.5s |
| Level 0 → 1 | < 300ms | < 250ms | < 200ms |
| Modal open | < 300ms | < 250ms | < 200ms |
| Tab switch | < 200ms | < 150ms | < 100ms |
| Frame rate | 60fps | 60fps | 60fps |

---

## 🔗 Related Docs

- **Detailed specs**: `specs/responsive-design.md`
- **Implementation examples**: `examples/responsive-hook.tsx`
- **Testing guide**: `guides/testing-guide.md` (responsive tests)

---

**For help**: Invoke `ux-optimization-specialist` agent for responsive behavior implementation
