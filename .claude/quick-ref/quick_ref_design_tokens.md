# Design Tokens - Quick Reference

> **Purpose**: Colors, typography, spacing - all design values in one place  
> **For implementation**: Use via Tailwind classes or CSS variables  
> **For detailed specs**: See `specs/design-system.md`

---

## 🎨 Color System (shadcn/ui tokens)

### Base Colors (CSS Variables)
```css
--background: 0 0% 100%           /* #FFFFFF */
--foreground: 222.2 84% 4.9%      /* #020817 */

--card: 0 0% 100%
--card-foreground: 222.2 84% 4.9%

--popover: 0 0% 100%
--popover-foreground: 222.2 84% 4.9%

--primary: 221.2 83.2% 53.3%      /* Blue-600 */
--primary-foreground: 210 40% 98% /* White */

--secondary: 210 40% 96.1%        /* Slate-100 */
--secondary-foreground: 222.2 47.4% 11.2%

--muted: 210 40% 96.1%
--muted-foreground: 215.4 16.3% 46.9%

--accent: 210 40% 96.1%
--accent-foreground: 222.2 47.4% 11.2%

--destructive: 0 84.2% 60.2%      /* Red-500 */
--destructive-foreground: 210 40% 98%

--border: 214.3 31.8% 91.4%       /* Slate-200 */
--input: 214.3 31.8% 91.4%
--ring: 221.2 83.2% 53.3%         /* Primary */

--radius: 0.5rem                  /* 8px default */
```

### Usage (Tailwind)
```tsx
<div className="bg-background text-foreground">
  <button className="bg-primary text-primary-foreground">
    Primary Button
  </button>
  <span className="text-muted-foreground">
    Secondary text
  </span>
</div>
```

### Usage (CSS)
```css
.custom-component {
  background: hsl(var(--background));
  color: hsl(var(--foreground));
  border: 1px solid hsl(var(--border));
}
```

---

## 📊 Custom Colors (Project-Specific)

### Owner vs Contributor Gradients
```css
/* Owner projects */
--owner-gradient: linear-gradient(180deg, 
  hsl(221.2 83.2% 53.3%),    /* Blue-500 */
  hsl(221.2 83.2% 45%)       /* Blue-600 */
)

/* Contributor projects */
--contributor-gradient: linear-gradient(180deg,
  hsl(142 76% 36%),          /* Green-600 */
  hsl(142 76% 30%)           /* Green-700 */
)
```

### Language Colors
```typescript
const LANGUAGE_COLORS = {
  TypeScript: '#3178c6',
  JavaScript: '#f7df1e',
  Python: '#3776ab',
  Go: '#00add8',
  Rust: '#dea584',
  CSS: '#1572b6',
  HTML: '#e34c26',
  Java: '#b07219',
  Ruby: '#701516',
} as const
```

---

## 🔤 Typography Scale

### Font Families
```css
--font-sans: 'Inter', system-ui, -apple-system, sans-serif;
--font-mono: 'JetBrains Mono', 'Fira Code', monospace;
```

### Font Sizes
```typescript
const FONT_SIZES = {
  xs:   '0.75rem',   // 12px
  sm:   '0.875rem',  // 14px
  base: '1rem',      // 16px
  lg:   '1.125rem',  // 18px
  xl:   '1.25rem',   // 20px
  '2xl': '1.5rem',   // 24px
  '3xl': '1.875rem', // 30px
  '4xl': '2.25rem',  // 36px
}
```

### Font Weights
```css
--font-normal: 400
--font-medium: 500
--font-semibold: 600
--font-bold: 700
```

### Line Heights
```css
--leading-none: 1
--leading-tight: 1.25
--leading-snug: 1.375
--leading-normal: 1.5
--leading-relaxed: 1.625
```

---

## 📏 Spacing Scale (Tailwind Default)

```typescript
const SPACING = {
  0:   '0px',
  1:   '0.25rem',  // 4px
  2:   '0.5rem',   // 8px
  3:   '0.75rem',  // 12px
  4:   '1rem',     // 16px
  5:   '1.25rem',  // 20px
  6:   '1.5rem',   // 24px
  8:   '2rem',     // 32px
  10:  '2.5rem',   // 40px
  12:  '3rem',     // 48px
  16:  '4rem',     // 64px
  20:  '5rem',     // 80px
  24:  '6rem',     // 96px
}
```

### Usage
```tsx
<div className="p-4 gap-2 mb-6">
  {/* padding: 16px, gap: 8px, margin-bottom: 24px */}
</div>
```

---

## 📦 Component Dimensions

### Level 0 (Compact Row)
```typescript
const COMPACT_ROW = {
  height: {
    desktop: '56px',
    mobile: '48px',
  },
  padding: '12px 16px',
  gap: '8px',
  barWidth: '4px',
  fontSize: {
    name: '0.875rem',    // 14px
    metrics: '0.75rem',  // 12px
  }
}
```

### Level 1 (Expanded Card)
```typescript
const EXPANDED_CARD = {
  padding: {
    desktop: '20px',
    mobile: '16px',
  },
  sectionGap: '16px',
  maxHeight: 'auto',     // Up to 500px
  buttonHeight: '36px',
}
```

### Level 2 (Modal)
```typescript
const MODAL = {
  width: {
    desktop: 'min(800px, 90vw)',
    tablet: '600px',
    mobile: '100vw',
  },
  height: {
    desktop: '85vh',
    mobile: '90vh',
  },
  padding: {
    desktop: '24px',
    mobile: '16px',
  },
  tabHeight: '80px',
}
```

---

## 🎭 Animation Timings

### Duration
```css
--duration-fast: 150ms
--duration-normal: 200ms
--duration-medium: 300ms
--duration-slow: 500ms
```

### Easing Curves
```css
/* Material Design */
--ease-standard: cubic-bezier(0.4, 0.0, 0.2, 1)
--ease-decelerate: cubic-bezier(0.0, 0.0, 0.2, 1)
--ease-accelerate: cubic-bezier(0.4, 0.0, 1, 1)

/* Custom */
--ease-smooth: cubic-bezier(0.4, 0, 0.2, 1)
```

### Component-Specific
```typescript
const ANIMATIONS = {
  cardExpansion: {
    duration: '300ms',
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
  modalOpen: {
    duration: '200ms',
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
  tabSwitch: {
    duration: '200ms',
    easing: 'ease-out',
  },
  hover: {
    duration: '200ms',
    easing: 'ease-out',
  }
}
```

---

## 🔳 Border Radius

```css
--radius-none: 0
--radius-sm: 0.125rem    /* 2px */
--radius: 0.5rem         /* 8px - default */
--radius-md: 0.375rem    /* 6px */
--radius-lg: 0.5rem      /* 8px */
--radius-xl: 0.75rem     /* 12px */
--radius-2xl: 1rem       /* 16px */
--radius-full: 9999px
```

### Usage
```tsx
<Card className="rounded-lg">     {/* 8px */}
  <Button className="rounded-md"> {/* 6px */}
    Click me
  </Button>
</Card>
```

---

## 💫 Shadow System

```css
/* Tailwind shadows */
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05)
--shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)
--shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)
--shadow-2xl: 0 25px 50px -12px rgb(0 0 0 / 0.25)
```

### Component Usage
```typescript
const SHADOWS = {
  compactRowHover: 'shadow-md',      // Level 0 hover
  expandedCard: 'shadow-lg',         // Level 1 expanded
  modal: 'shadow-2xl',               // Level 2 modal
}
```

---

## 🎯 Z-Index Layers

```css
--z-base: 0
--z-dropdown: 1000
--z-sticky: 1020
--z-fixed: 1030
--z-modal-backdrop: 1040
--z-modal: 1050
--z-popover: 1060
--z-tooltip: 1070
```

### Usage
```tsx
<Dialog className="z-modal">
  <DialogOverlay className="z-modal-backdrop" />
  <DialogContent className="z-modal">
    {content}
  </DialogContent>
</Dialog>
```

---

## 📐 Grid System

### Container Max Widths
```css
--container-sm: 640px
--container-md: 768px
--container-lg: 1024px
--container-xl: 1280px
--container-2xl: 1536px
--container-max: 1920px
```

### Gap Sizes
```typescript
const GAPS = {
  compact: '8px',      // Level 0 rows
  normal: '16px',      // Level 1 sections
  relaxed: '24px',     // Level 2 modal sections
  loose: '32px',       // Page sections
}
```

---

## 🔧 Quick Reference Card

```typescript
// Copy-paste this for common patterns

const DESIGN_TOKENS = {
  // Colors
  primary: 'hsl(var(--primary))',
  border: 'hsl(var(--border))',
  
  // Typography
  fontSm: '0.875rem',      // 14px
  fontBase: '1rem',        // 16px
  fontLg: '1.125rem',      // 18px
  
  // Spacing
  sm: '0.5rem',            // 8px
  md: '1rem',              // 16px
  lg: '1.5rem',            // 24px
  
  // Animation
  fast: '150ms',
  normal: '200ms',
  medium: '300ms',
  
  // Radius
  rounded: '0.5rem',       // 8px
  
  // Shadow
  hover: 'shadow-md',
  elevated: 'shadow-lg',
}
```

---

## ✅ Usage Best Practices

### ✓ DO
```tsx
// Use Tailwind utilities
<div className="p-4 gap-2 rounded-lg shadow-md">

// Use CSS variables for custom components
<div style={{ background: 'hsl(var(--primary))' }}>

// Use design token constants
<Card style={{ padding: DESIGN_TOKENS.md }}>
```

### ✗ DON'T
```tsx
// Avoid hardcoded values
<div style={{ padding: '14px' }}>        ❌

// Avoid hex colors directly
<div style={{ color: '#3178c6' }}>       ❌

// Avoid magic numbers
<div style={{ borderRadius: '7.5px' }}>  ❌
```

---

## 🔗 Related Docs

- **Full design system**: `specs/design-system.md`
- **Component specs**: `specs/level-*.md`
- **Tailwind config**: `tailwind.config.ts`

---

**For help**: Invoke `ui-design-specialist` agent for design token application
