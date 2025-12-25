/**
 * HoverCard - Re-exports HoverCardGlass from shadcn-glass-ui
 *
 * Provides hover-triggered popover with Glass UI styling.
 * Stage 10 migration: HoverCard → HoverCardGlass
 */

export {
  HoverCardGlass as HoverCard,
  HoverCardGlassContent as HoverCardContent,
  // Legacy exports for gradual migration
  HoverCardGlassLegacy,
  HoverCardGlassTrigger as HoverCardTrigger,
} from "shadcn-glass-ui";

export type {
  HoverCardGlassContentProps,
  HoverCardGlassLegacyProps,
  HoverCardGlassRootProps,
} from "shadcn-glass-ui";
