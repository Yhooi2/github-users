# Glassmorphism Theme Quick Reference

Alternative frosted glass theme for the application. **Does not replace the main theme** - available as an option.

## Activation

```html
<!-- Add .glass class to enable glassmorphism -->
<html class="glass">
  <!-- Your app with glassmorphism -->
</html>

<!-- Dark mode + glassmorphism -->
<html class="glass dark">
  <!-- Dark glassmorphism -->
</html>
```

## CSS Variables

### Glass Surfaces (Frost)

| Variable | Light Mode | Dark Mode | Usage |
|----------|------------|-----------|-------|
| `--glass-frost-5` | white 5% | dark 5% | Barely visible |
| `--glass-frost-10` | white 10% | dark 10% | Subtle cards |
| `--glass-frost-20` | white 20% | dark 20% | Standard cards |
| `--glass-frost-30` | white 30% | dark 30% | Prominent |
| `--glass-frost-50` | white 50% | dark 50% | Modals |
| `--glass-frost-70` | white 70% | dark 70% | Heavy frost |

### Text Colors (WCAG AA Verified)

| Variable | Contrast | Usage |
|----------|----------|-------|
| `--glass-text-primary` | 14.2:1 / 12:1 | Main text |
| `--glass-text-secondary` | 6.8:1 / 7.5:1 | Secondary text |
| `--glass-text-muted` | 4.5:1 | Captions, hints |

### Accent Colors

| Variable | Color | Glow Variant |
|----------|-------|--------------|
| `--glass-accent-primary` | Blue | `--glass-accent-primary-glow` |
| `--glass-accent-success` | Green | `--glass-accent-success-glow` |
| `--glass-accent-warning` | Yellow | `--glass-accent-warning-glow` |
| `--glass-accent-danger` | Red | `--glass-accent-danger-glow` |

### Blur Values

| Variable | Value | Usage |
|----------|-------|-------|
| `--glass-blur-subtle` | 8px | Slight frost |
| `--glass-blur-medium` | 16px | Standard glass |
| `--glass-blur-heavy` | 24px | Modals |
| `--glass-blur-extreme` | 40px | Backgrounds |

### Border Radius

| Variable | Value | Usage |
|----------|-------|-------|
| `--glass-radius-sm` | 12px | Small elements |
| `--glass-radius-md` | 16px | Cards |
| `--glass-radius-lg` | 24px | Modals |
| `--glass-radius-xl` | 32px | Large containers |
| `--glass-radius-2xl` | 40px | Hero sections |

## Utility Classes

### Glass Cards

```tsx
// Subtle card (10% opacity, 8px blur)
<div className="glass-card-subtle p-6">Content</div>

// Standard card (20% opacity, 16px blur)
<div className="glass-card p-6">Content</div>

// Prominent card (30% opacity, 24px blur)
<div className="glass-card-prominent p-6">Content</div>
```

### Glow Effects (Hover)

```tsx
// Primary blue glow on hover
<button className="glass-card glass-glow-primary">Click me</button>

// Success green glow
<div className="glass-card glass-glow-success">Score: 85%</div>

// Warning yellow glow
<div className="glass-card glass-glow-warning">Attention</div>

// Danger red glow
<button className="glass-card glass-glow-danger">Delete</button>
```

### Pulse Animations (Use Sparingly!)

```tsx
// Primary pulse - for new notifications
<div className="glass-card glass-pulse">New message</div>

// Success pulse - for success alerts
<div className="glass-card glass-pulse-success">Completed!</div>
```

**When to use pulse:**
- New notifications
- Loading indicators
- "New" badges
- Important alerts

**When NOT to use:**
- Regular buttons
- Cards
- Static content

### Text Classes

```tsx
<p className="glass-text-primary">Main heading</p>
<p className="glass-text-secondary">Description text</p>
<p className="glass-text-muted">Caption or hint</p>
```

### Score Glow

```tsx
// For high metric scores (>80%)
<div className="glass-card glass-score-high">
  <span>85%</span>
</div>
```

## Animation Timing

| Variable | Value | Purpose |
|----------|-------|---------|
| `--glass-transition-glow` | 0.3s ease-out | Smooth glow transitions |
| `--glass-pulse-duration` | 2.5s | Gentle pulse speed |
| `--glass-pulse-easing` | ease-in-out | Natural rhythm |

## Background Gradients

**Light Mode** - Soft purple-blue:
```css
background: linear-gradient(135deg,
  oklch(0.92 0.03 280) 0%,   /* Light lavender */
  oklch(0.90 0.04 250) 50%,  /* Light blue */
  oklch(0.93 0.03 220) 100%  /* Light cyan */
);
```

**Dark Mode** - Neutral Dark:
```css
background: linear-gradient(135deg,
  oklch(0.20 0.03 260) 0%,   /* Deep navy */
  oklch(0.25 0.04 280) 50%,  /* Dark purple */
  oklch(0.22 0.03 240) 100%  /* Dark blue */
);
```

## Browser Support

- `backdrop-filter`: 95%+ coverage
- Chrome, Safari, Firefox, Edge
- Fallback: solid semi-transparent background

## Examples

### Metric Card with Glow

```tsx
<div className="glass-card glass-glow-success p-6">
  <div
    className="text-3xl font-bold"
    style={{ color: 'var(--glass-accent-success)' }}
  >
    85%
  </div>
  <div className="glass-text-muted text-sm">Activity Score</div>
</div>
```

### User Profile Card

```tsx
<div className="glass-card glass-glow-primary p-6">
  <div className="flex items-center gap-4">
    <Avatar src={user.avatar} />
    <div>
      <h3 className="glass-text-primary font-semibold">{user.name}</h3>
      <p className="glass-text-secondary text-sm">{user.bio}</p>
    </div>
  </div>
</div>
```

### Notification Badge

```tsx
<div className="glass-card glass-pulse p-2 text-sm">
  3 new notifications
</div>
```

## Storybook

View all glassmorphism components in Storybook:

```bash
npm run build-storybook
npm run storybook
```

Navigate to: **Theme / Glassmorphism**

## Files

- CSS Variables: `src/index.css` (under `.glass` selector)
- Storybook: `src/components/theme/GlassmorphismDemo.stories.tsx`
- This doc: `.claude/quick-ref/quick_ref_glassmorphism.md`
