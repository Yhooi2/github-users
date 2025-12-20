/**
 * Badge Component - Re-export from shadcn-glass-ui
 *
 * Uses BadgeGlass with glassmorphism effects (blur, glow, transparency).
 * Maintains shadcn/ui API compatibility for seamless migration.
 */
export {
  BadgeGlass as Badge,
  type BadgeGlassProps as BadgeProps,
} from "shadcn-glass-ui";

// Re-export badgeVariants from glass-ui (same name, no rename needed)
// eslint-disable-next-line react-refresh/only-export-components
export { badgeVariants } from "shadcn-glass-ui";
