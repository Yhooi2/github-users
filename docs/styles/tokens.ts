import { Moon, Palette, Sun } from "lucide-react";
import type { ThemeConfig, ThemeName, ThemeStyles } from "../types";

// ========================================
// THEME CONSTANTS
// ========================================

export const THEMES: readonly ThemeName[] = [
  "light",
  "aurora",
  "glass",
] as const;

export const THEME_CONFIG: Record<ThemeName, ThemeConfig> = {
  light: { label: "Light", icon: Sun },
  aurora: { label: "Aurora", icon: Moon },
  glass: { label: "Glass", icon: Palette },
};

// ========================================
// COMPLETE THEME STYLES
// ========================================

export const themeStyles: Record<ThemeName, ThemeStyles> = {
  // ======================================
  // LIGHT THEME - Clean, Professional
  // ======================================
  light: {
    // Background
    bgFrom: "#f1f5f9",
    bgVia: "#eff6ff",
    bgTo: "#f5f3ff",
    // Orbs
    orb1: "rgba(96,165,250,0.20)",
    orb2: "rgba(167,139,250,0.15)",
    orb3: "rgba(34,211,238,0.15)",
    orb4: "rgba(129,140,248,0.10)",
    // Glass
    glassSubtleBg: "rgba(255,255,255,0.60)",
    glassMediumBg: "rgba(255,255,255,0.70)",
    glassStrongBg: "rgba(255,255,255,0.80)",
    glassSubtleBorder: "rgba(255,255,255,0.50)",
    glassMediumBorder: "rgba(255,255,255,0.60)",
    glassStrongBorder: "rgba(255,255,255,0.70)",
    // Text
    textPrimary: "#1e293b",
    textSecondary: "#64748b",
    textMuted: "#94a3b8",
    textAccent: "#7c3aed",
    // Header
    headerBg: "rgba(255,255,255,0.60)",
    headerBorder: "rgba(255,255,255,0.80)",
    // Glow
    glowViolet:
      "0 8px 32px rgba(124,58,237,0.15), 0 0 0 1px rgba(124,58,237,0.1)",
    glowBlue:
      "0 8px 32px rgba(59,130,246,0.15), 0 0 0 1px rgba(59,130,246,0.1)",
    glowCyan: "0 8px 32px rgba(6,182,212,0.15), 0 0 0 1px rgba(6,182,212,0.1)",
    glowNeutral: "0 8px 32px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.05)",
    // Progress
    progressBg: "rgba(226,232,240,0.60)",
    progressGlow: "0 0 8px rgba(124,58,237,0.3)",
    // Status
    statusGreen: "#10b981",
    statusYellow: "#f59e0b",
    statusRed: "#ef4444",
    // Metrics
    metricEmeraldBg: "rgba(16,185,129,0.10)",
    metricEmeraldText: "#059669",
    metricEmeraldBorder: "#a7f3d0",
    metricAmberBg: "rgba(245,158,11,0.10)",
    metricAmberText: "#d97706",
    metricAmberBorder: "#fde68a",
    metricBlueBg: "rgba(59,130,246,0.10)",
    metricBlueText: "#2563eb",
    metricBlueBorder: "#bfdbfe",
    metricRedBg: "rgba(239,68,68,0.10)",
    metricRedText: "#dc2626",
    metricRedBorder: "#fecaca",
    // Alerts
    alertDangerBg: "rgba(239,68,68,0.05)",
    alertDangerBorder: "rgba(254,202,202,0.6)",
    alertDangerText: "#b91c1c",
    alertWarningBg: "rgba(245,158,11,0.05)",
    alertWarningBorder: "rgba(253,230,138,0.6)",
    alertWarningText: "#b45309",
    // Cards
    cardBg: "rgba(255,255,255,0.60)",
    cardBorder: "rgba(226,232,240,0.60)",
    cardHoverBg: "rgba(255,255,255,0.80)",
    expandedBg: "rgba(255,255,255,0.70)",
    expandedBorder: "rgba(139,92,246,0.5)",
    // Buttons
    btnSecondaryBg: "rgba(255,255,255,0.80)",
    btnSecondaryText: "#334155",
    btnSecondaryBorder: "#e2e8f0",
    btnPrimaryBg: "linear-gradient(to right, #7c3aed, #8b5cf6)",
    btnPrimaryText: "white",
    // Badges
    badgeDefaultBg: "rgba(100,116,139,0.1)",
    badgeDefaultText: "#475569",
    badgeDefaultBorder: "#e2e8f0",
    badgeSuccessBg: "rgba(16,185,129,0.1)",
    badgeSuccessText: "#047857",
    badgeSuccessBorder: "#a7f3d0",
    badgeWarningBg: "rgba(245,158,11,0.1)",
    badgeWarningText: "#b45309",
    badgeWarningBorder: "#fde68a",
    badgeDangerBg: "rgba(239,68,68,0.1)",
    badgeDangerText: "#dc2626",
    badgeDangerBorder: "#fecaca",
    badgePrimaryBg: "rgba(59,130,246,0.1)",
    badgePrimaryText: "#1d4ed8",
    badgePrimaryBorder: "#bfdbfe",
    badgeVioletBg: "rgba(139,92,246,0.1)",
    badgeVioletText: "#6d28d9",
    badgeVioletBorder: "#ddd6fe",
    // Search/Toggle
    searchBg: "rgba(255,255,255,0.80)",
    searchBorder: "rgba(226,232,240,0.8)",
    searchText: "#64748b",
    searchBtnBg: "#1e293b",
    searchBtnText: "white",
    toggleActiveBg: "#1e293b",
    toggleActiveText: "white",
    toggleInactiveBg: "rgba(255,255,255,0.80)",
    toggleInactiveText: "#64748b",
    toggleText: "#64748b",
    // Select
    selectBg: "rgba(255,255,255,0.80)",
    selectBorder: "rgba(226,232,240,0.8)",
    selectText: "#334155",
    // Icon button
    iconBtnFrom: "#1e293b",
    iconBtnTo: "#0f172a",
    iconBtnShadow: "0 4px 12px rgba(0,0,0,0.15)",
    iconBtnText: "white",
    // Avatar
    avatarGlow: "0 8px 24px rgba(124,58,237,0.25)",
    onlineBorder: "white",
    // Language bar
    langBarShadow: "inset 0 1px 2px rgba(0,0,0,0.1)",
    // Grid
    gridColor: "rgba(0,0,0,0.1)",
    gridOpacity: 0.015,
    // Footer
    footerText: "rgba(148,163,184,0.6)",
    // AI Card
    aiCardBg:
      "linear-gradient(135deg, rgba(238,242,255,0.9), rgba(224,231,255,0.9))",
    aiCardBorder: "rgba(199,210,254,0.6)",
    aiIconBg: "linear-gradient(135deg, #8b5cf6, #a78bfa)",
    // Year cards
    yearCardBg: "rgba(248,250,252,0.80)",
    yearCardBorder: "rgba(226,232,240,0.6)",
    yearSelectedBg: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
    yearSelectedText: "white",
  },

  // ======================================
  // AURORA THEME - Dark Slate
  // ======================================
  aurora: {
    // Background - dark slate
    bgFrom: "#020617",
    bgVia: "#0f172a",
    bgTo: "#020617",
    // Orbs - subtle
    orb1: "rgba(37,99,235,0.10)",
    orb2: "rgba(124,58,237,0.08)",
    orb3: "rgba(8,145,178,0.08)",
    orb4: "rgba(79,70,229,0.06)",
    // Glass - slate based
    glassSubtleBg: "rgba(30,41,59,0.40)",
    glassMediumBg: "rgba(30,41,59,0.50)",
    glassStrongBg: "rgba(30,41,59,0.60)",
    glassSubtleBorder: "rgba(51,65,85,0.30)",
    glassMediumBorder: "rgba(51,65,85,0.40)",
    glassStrongBorder: "rgba(51,65,85,0.50)",
    // Text
    textPrimary: "#e2e8f0",
    textSecondary: "#94a3b8",
    textMuted: "#64748b",
    textAccent: "#a78bfa",
    // Header
    headerBg: "rgba(15,23,42,0.60)",
    headerBorder: "rgba(51,65,85,0.50)",
    // Glow
    glowViolet:
      "0 8px 32px rgba(124,58,237,0.12), inset 0 1px 0 rgba(255,255,255,0.05)",
    glowBlue:
      "0 8px 32px rgba(59,130,246,0.12), inset 0 1px 0 rgba(255,255,255,0.05)",
    glowCyan:
      "0 8px 32px rgba(6,182,212,0.12), inset 0 1px 0 rgba(255,255,255,0.05)",
    glowNeutral:
      "0 8px 32px rgba(0,0,0,0.30), inset 0 1px 0 rgba(255,255,255,0.05)",
    // Progress
    progressBg: "rgba(51,65,85,0.50)",
    progressGlow: "0 0 12px rgba(124,58,237,0.4)",
    // Status
    statusGreen: "#34d399",
    statusYellow: "#fbbf24",
    statusRed: "#f87171",
    // Metrics
    metricEmeraldBg: "rgba(16,185,129,0.10)",
    metricEmeraldText: "#34d399",
    metricEmeraldBorder: "rgba(16,185,129,0.20)",
    metricAmberBg: "rgba(245,158,11,0.10)",
    metricAmberText: "#fbbf24",
    metricAmberBorder: "rgba(245,158,11,0.20)",
    metricBlueBg: "rgba(59,130,246,0.10)",
    metricBlueText: "#60a5fa",
    metricBlueBorder: "rgba(59,130,246,0.20)",
    metricRedBg: "rgba(239,68,68,0.10)",
    metricRedText: "#f87171",
    metricRedBorder: "rgba(239,68,68,0.20)",
    // Alerts
    alertDangerBg: "rgba(239,68,68,0.10)",
    alertDangerBorder: "rgba(239,68,68,0.20)",
    alertDangerText: "#f87171",
    alertWarningBg: "rgba(245,158,11,0.10)",
    alertWarningBorder: "rgba(245,158,11,0.20)",
    alertWarningText: "#fbbf24",
    // Cards
    cardBg: "rgba(30,41,59,0.40)",
    cardBorder: "rgba(51,65,85,0.40)",
    cardHoverBg: "rgba(30,41,59,0.60)",
    expandedBg: "rgba(30,41,59,0.40)",
    expandedBorder: "rgba(139,92,246,0.50)",
    // Buttons
    btnSecondaryBg: "rgba(51,65,85,0.60)",
    btnSecondaryText: "#e2e8f0",
    btnSecondaryBorder: "rgba(71,85,105,0.50)",
    btnPrimaryBg: "linear-gradient(to right, #7c3aed, #8b5cf6)",
    btnPrimaryText: "white",
    // Badges
    badgeDefaultBg: "rgba(71,85,105,0.30)",
    badgeDefaultText: "#cbd5e1",
    badgeDefaultBorder: "rgba(71,85,105,0.50)",
    badgeSuccessBg: "rgba(16,185,129,0.20)",
    badgeSuccessText: "#34d399",
    badgeSuccessBorder: "rgba(16,185,129,0.30)",
    badgeWarningBg: "rgba(245,158,11,0.20)",
    badgeWarningText: "#fbbf24",
    badgeWarningBorder: "rgba(245,158,11,0.30)",
    badgeDangerBg: "rgba(239,68,68,0.20)",
    badgeDangerText: "#f87171",
    badgeDangerBorder: "rgba(239,68,68,0.30)",
    badgePrimaryBg: "rgba(59,130,246,0.20)",
    badgePrimaryText: "#60a5fa",
    badgePrimaryBorder: "rgba(59,130,246,0.30)",
    badgeVioletBg: "rgba(139,92,246,0.20)",
    badgeVioletText: "#a78bfa",
    badgeVioletBorder: "rgba(139,92,246,0.30)",
    // Search/Toggle
    searchBg: "rgba(30,41,59,0.60)",
    searchBorder: "rgba(51,65,85,0.50)",
    searchText: "#94a3b8",
    searchBtnBg: "rgba(51,65,85,0.80)",
    searchBtnText: "#e2e8f0",
    toggleActiveBg: "rgba(15,23,42,0.80)",
    toggleActiveText: "#e2e8f0",
    toggleInactiveBg: "transparent",
    toggleInactiveText: "#94a3b8",
    toggleText: "#fbbf24",
    // Select
    selectBg: "rgba(30,41,59,0.60)",
    selectBorder: "rgba(51,65,85,0.50)",
    selectText: "#e2e8f0",
    // Icon button
    iconBtnFrom: "#334155",
    iconBtnTo: "#1e293b",
    iconBtnShadow: "0 4px 12px rgba(0,0,0,0.30)",
    iconBtnText: "#e2e8f0",
    // Avatar
    avatarGlow: "0 8px 24px rgba(124,58,237,0.25)",
    onlineBorder: "#0f172a",
    // Language bar
    langBarShadow: "0 0 8px rgba(124,58,237,0.15)",
    // Grid
    gridColor: "rgba(255,255,255,0.05)",
    gridOpacity: 0.02,
    // Footer
    footerText: "#64748b",
    // AI Card
    aiCardBg:
      "linear-gradient(135deg, rgba(91,33,182,0.15), rgba(59,130,246,0.15))",
    aiCardBorder: "rgba(139,92,246,0.30)",
    aiIconBg: "linear-gradient(135deg, #7c3aed, #8b5cf6)",
    // Year cards
    yearCardBg: "rgba(30,41,59,0.50)",
    yearCardBorder: "rgba(51,65,85,0.40)",
    yearSelectedBg: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
    yearSelectedText: "white",
  },

  // ======================================
  // GLASS THEME - Purple Glassmorphism
  // ======================================
  glass: {
    // Background - purple glassmorphism
    bgFrom: "#0f172a",
    bgVia: "#581c87",
    bgTo: "#0f172a",
    // Orbs - vibrant animated
    orb1: "rgba(168,85,247,0.30)",
    orb2: "rgba(59,130,246,0.20)",
    orb3: "rgba(236,72,153,0.20)",
    orb4: "rgba(6,182,212,0.20)",
    orb5: "rgba(139,92,246,0.10)",
    // Glass - white based for glassmorphism
    glassSubtleBg: "rgba(255,255,255,0.10)",
    glassMediumBg: "rgba(255,255,255,0.15)",
    glassStrongBg: "rgba(255,255,255,0.25)",
    glassSubtleBorder: "rgba(255,255,255,0.10)",
    glassMediumBorder: "rgba(255,255,255,0.20)",
    glassStrongBorder: "rgba(255,255,255,0.30)",
    // Text
    textPrimary: "rgba(255,255,255,0.90)",
    textSecondary: "rgba(255,255,255,0.60)",
    textMuted: "rgba(255,255,255,0.40)",
    textAccent: "#c4b5fd",
    // Header
    headerBg: "rgba(255,255,255,0.05)",
    headerBorder: "rgba(255,255,255,0.10)",
    // Glow - intense
    glowViolet: "0 8px 32px rgba(147,51,234,0.30)",
    glowBlue: "0 8px 32px rgba(59,130,246,0.30)",
    glowCyan: "0 8px 32px rgba(6,182,212,0.25)",
    glowNeutral: "0 8px 32px rgba(0,0,0,0.12)",
    // Progress
    progressBg: "rgba(255,255,255,0.10)",
    progressGlow: "0 0 16px rgba(147,51,234,0.4)",
    // Status
    statusGreen: "#34d399",
    statusYellow: "#fbbf24",
    statusRed: "#fb7185",
    // Metrics - with text glow
    metricEmeraldBg: "transparent",
    metricEmeraldText: "#34d399",
    metricEmeraldBorder: "transparent",
    metricEmeraldGlow: "0 0 12px rgba(52,211,153,0.4)",
    metricAmberBg: "transparent",
    metricAmberText: "#fbbf24",
    metricAmberBorder: "transparent",
    metricAmberGlow: "0 0 12px rgba(251,191,36,0.4)",
    metricBlueBg: "transparent",
    metricBlueText: "#60a5fa",
    metricBlueBorder: "transparent",
    metricBlueGlow: "0 0 12px rgba(96,165,250,0.4)",
    metricRedBg: "transparent",
    metricRedText: "#fb7185",
    metricRedBorder: "transparent",
    metricRedGlow: "0 0 12px rgba(251,113,133,0.4)",
    // Alerts
    alertDangerBg: "rgba(251,113,133,0.10)",
    alertDangerBorder: "rgba(251,113,133,0.20)",
    alertDangerText: "#fda4af",
    alertWarningBg: "rgba(251,191,36,0.10)",
    alertWarningBorder: "rgba(251,191,36,0.20)",
    alertWarningText: "#fcd34d",
    // Cards
    cardBg: "rgba(255,255,255,0.05)",
    cardBorder: "rgba(255,255,255,0.10)",
    cardHoverBg: "rgba(255,255,255,0.07)",
    expandedBg: "rgba(255,255,255,0.05)",
    expandedBorder: "rgba(167,139,250,0.50)",
    // Buttons
    btnSecondaryBg: "rgba(255,255,255,0.10)",
    btnSecondaryText: "rgba(255,255,255,0.80)",
    btnSecondaryBorder: "rgba(255,255,255,0.20)",
    btnPrimaryBg: "linear-gradient(to right, #8b5cf6, #a855f7)",
    btnPrimaryText: "white",
    // Badges
    badgeDefaultBg: "rgba(255,255,255,0.20)",
    badgeDefaultText: "rgba(255,255,255,0.90)",
    badgeDefaultBorder: "transparent",
    badgeSuccessBg: "rgba(52,211,153,0.20)",
    badgeSuccessText: "#6ee7b7",
    badgeSuccessBorder: "transparent",
    badgeWarningBg: "rgba(251,191,36,0.20)",
    badgeWarningText: "#fcd34d",
    badgeWarningBorder: "transparent",
    badgeDangerBg: "rgba(251,113,133,0.20)",
    badgeDangerText: "#fda4af",
    badgeDangerBorder: "transparent",
    badgePrimaryBg: "rgba(96,165,250,0.20)",
    badgePrimaryText: "#93c5fd",
    badgePrimaryBorder: "transparent",
    badgeVioletBg: "rgba(167,139,250,0.20)",
    badgeVioletText: "#c4b5fd",
    badgeVioletBorder: "transparent",
    // Search/Toggle
    searchBg: "rgba(255,255,255,0.10)",
    searchBorder: "rgba(255,255,255,0.10)",
    searchText: "rgba(255,255,255,0.70)",
    searchBtnBg: "linear-gradient(135deg, #8b5cf6, #a855f7)",
    searchBtnText: "white",
    toggleActiveBg: "rgba(255,255,255,0.20)",
    toggleActiveText: "white",
    toggleInactiveBg: "transparent",
    toggleInactiveText: "rgba(255,255,255,0.60)",
    toggleText: "rgba(255,255,255,0.60)",
    // Select
    selectBg: "rgba(255,255,255,0.10)",
    selectBorder: "rgba(255,255,255,0.15)",
    selectText: "rgba(255,255,255,0.90)",
    // Icon button - purple gradient
    iconBtnFrom: "#8b5cf6",
    iconBtnTo: "#9333ea",
    iconBtnShadow: "0 0 12px rgba(147,51,234,0.50)",
    iconBtnText: "white",
    // Avatar
    avatarGlow: "0 0 24px rgba(147,51,234,0.50)",
    onlineBorder: "#0f172a",
    // Language bar
    langBarShadow: "0 0 12px rgba(147,51,234,0.30)",
    // Grid
    gridColor: "rgba(255,255,255,0.05)",
    gridOpacity: 0.03,
    // Footer
    footerText: "rgba(255,255,255,0.30)",
    // AI Card
    aiCardBg:
      "linear-gradient(135deg, rgba(139,92,246,0.20), rgba(59,130,246,0.15))",
    aiCardBorder: "rgba(167,139,250,0.30)",
    aiIconBg: "linear-gradient(135deg, #a855f7, #8b5cf6)",
    // Year cards
    yearCardBg: "rgba(255,255,255,0.05)",
    yearCardBorder: "rgba(255,255,255,0.10)",
    yearSelectedBg: "linear-gradient(135deg, #8b5cf6, #a855f7)",
    yearSelectedText: "white",
  },
};
