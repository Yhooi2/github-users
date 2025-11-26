import type {
  GlassIntensity,
  RepoStatus,
  StatusType,
} from "../types";

// ========================================
// STATUS CONSTANTS
// ========================================

/**
 * Maps repository status to indicator status type
 */
export const STATUS_MAP: Readonly<Record<RepoStatus, StatusType>> = {
  good: "green",
  warning: "yellow",
  critical: "red",
} as const;

/**
 * Symbols displayed inside large status indicators
 */
export const STATUS_SYMBOLS: Readonly<Record<StatusType, string>> = {
  green: "✓",
  yellow: "!",
  red: "✕",
} as const;

/**
 * Glow effects for status indicators
 */
export const STATUS_GLOWS: Readonly<Record<StatusType, string>> = {
  green: "0 0 8px rgba(52,211,153,0.6)",
  yellow: "0 0 8px rgba(251,191,36,0.6)",
  red: "0 0 8px rgba(248,113,113,0.6)",
} as const;

// ========================================
// GLASS EFFECT CONSTANTS
// ========================================

/**
 * Blur values for different glass intensities
 */
export const BLUR_VALUES: Readonly<Record<GlassIntensity, string>> = {
  subtle: "8px",
  medium: "12px",
  strong: "16px",
} as const;
