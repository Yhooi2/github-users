import type {
  GlassIntensity,
  GlowType,
  MetricColor,
  MetricColors,
  RepoStatus,
  StatusType,
  ThemeStyles,
} from "../types";
import { STATUS_MAP } from "./constants";

// ========================================
// STATUS HELPERS
// ========================================

/**
 * Converts repository status to indicator status type
 */
export const getStatusType = (status: RepoStatus): StatusType =>
  STATUS_MAP[status];

// ========================================
// GLASS CARD HELPERS
// ========================================

/**
 * Creates glow map for GlassCard component
 */
export const createGlowMap = (t: ThemeStyles): Record<GlowType & string, string> => ({
  blue: t.glowBlue,
  violet: t.glowViolet,
  purple: t.glowViolet,
  cyan: t.glowCyan,
});

/**
 * Creates background map for GlassCard component
 */
export const createBgMap = (t: ThemeStyles): Record<GlassIntensity, string> => ({
  subtle: t.glassSubtleBg,
  medium: t.glassMediumBg,
  strong: t.glassStrongBg,
});

/**
 * Creates border map for GlassCard component
 */
export const createBorderMap = (
  t: ThemeStyles
): Record<GlassIntensity, string> => ({
  subtle: t.glassSubtleBorder,
  medium: t.glassMediumBorder,
  strong: t.glassStrongBorder,
});

// ========================================
// METRIC HELPERS
// ========================================

/**
 * Gets metric colors for a given color scheme
 */
export const getMetricColors = (
  color: MetricColor,
  t: ThemeStyles
): MetricColors => {
  const colorMap: Record<MetricColor, MetricColors> = {
    emerald: {
      bg: t.metricEmeraldBg,
      text: t.metricEmeraldText,
      border: t.metricEmeraldBorder,
      glow: t.metricEmeraldGlow,
      gradient: "from-emerald-400 to-emerald-500",
    },
    amber: {
      bg: t.metricAmberBg,
      text: t.metricAmberText,
      border: t.metricAmberBorder,
      glow: t.metricAmberGlow,
      gradient: "from-amber-400 to-amber-500",
    },
    blue: {
      bg: t.metricBlueBg,
      text: t.metricBlueText,
      border: t.metricBlueBorder,
      glow: t.metricBlueGlow,
      gradient: "from-blue-400 to-blue-500",
    },
    red: {
      bg: t.metricRedBg,
      text: t.metricRedText,
      border: t.metricRedBorder,
      glow: t.metricRedGlow,
      gradient: "from-red-400 to-red-500",
    },
  };
  return colorMap[color];
};
