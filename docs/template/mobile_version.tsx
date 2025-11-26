import {
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Clock,
  ExternalLink,
  Flame,
  FolderGit2,
  Github,
  Moon,
  Palette,
  Search,
  Sparkles,
  Sprout,
  Star,
  Sun,
  TrendingUp,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";
import React, {
  createContext,
  useContext,
  useState,
  type MouseEvent,
  type ReactNode,
} from "react";

// ========================================
// TYPE DEFINITIONS
// ========================================

type ThemeName = "light" | "aurora" | "glass";

type GlassIntensity = "subtle" | "medium" | "strong";

type GlowType = "blue" | "violet" | "purple" | "cyan" | null;

type StatusType = "green" | "yellow" | "red";

type BadgeVariant = "default" | "success" | "warning" | "primary" | "violet";

interface ThemeConfig {
  label: string;
  icon: LucideIcon;
}

interface ThemeContextValue {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
  cycleTheme: () => void;
}

interface ThemeStyles {
  // Background
  bgFrom: string;
  bgVia: string;
  bgTo: string;
  // Orbs
  orb1: string;
  orb2: string;
  orb3: string;
  orb4: string;
  orb5?: string;
  // Glass
  glassSubtleBg: string;
  glassMediumBg: string;
  glassStrongBg: string;
  glassSubtleBorder: string;
  glassMediumBorder: string;
  glassStrongBorder: string;
  // Text
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  textAccent: string;
  // Header
  headerBg: string;
  headerBorder: string;
  // Glow
  glowViolet: string;
  glowBlue: string;
  glowCyan: string;
  glowNeutral: string;
  // Progress
  progressBg: string;
  progressGlow: string;
  // Status
  statusGreen: string;
  statusYellow: string;
  statusRed: string;
  // Metrics
  metricEmeraldBg: string;
  metricEmeraldText: string;
  metricEmeraldBorder: string;
  metricEmeraldGlow?: string;
  metricAmberBg: string;
  metricAmberText: string;
  metricAmberBorder: string;
  metricAmberGlow?: string;
  metricBlueBg: string;
  metricBlueText: string;
  metricBlueBorder: string;
  metricBlueGlow?: string;
  metricRedBg: string;
  metricRedText: string;
  metricRedBorder: string;
  metricRedGlow?: string;
  // Alerts
  alertDangerBg: string;
  alertDangerBorder: string;
  alertDangerText: string;
  alertWarningBg: string;
  alertWarningBorder: string;
  alertWarningText: string;
  // Cards
  cardBg: string;
  cardBorder: string;
  cardHoverBg: string;
  expandedBg: string;
  expandedBorder: string;
  // Buttons
  btnSecondaryBg: string;
  btnSecondaryText: string;
  btnSecondaryBorder: string;
  // Badges
  badgeDefaultBg: string;
  badgeDefaultText: string;
  badgeDefaultBorder: string;
  badgeSuccessBg: string;
  badgeSuccessText: string;
  badgeSuccessBorder: string;
  badgeWarningBg: string;
  badgeWarningText: string;
  badgeWarningBorder: string;
  badgePrimaryBg: string;
  badgePrimaryText: string;
  badgePrimaryBorder: string;
  badgeVioletBg: string;
  badgeVioletText: string;
  badgeVioletBorder: string;
  // Search/Toggle
  searchBg: string;
  searchBorder: string;
  searchText: string;
  toggleText: string;
  // Icon button
  iconBtnFrom: string;
  iconBtnTo: string;
  iconBtnShadow: string;
  iconBtnText: string;
  // Avatar
  avatarGlow: string;
  onlineBorder: string;
  // Language bar
  langBarShadow: string;
  // Grid
  gridColor: string;
  gridOpacity: number;
  // Footer
  footerText: string;
}

interface YearData {
  year: number;
  label: string;
  icon: LucideIcon;
  commits: number;
  prs: number;
  repos: number;
  percent: number;
  gradient: string;
  glow: string;
}

interface RepoData {
  name: string;
  languages: string;
  commits: number;
  contribution: number;
  stars: number;
  flagType: StatusType;
  issues: string[];
  createdYear: number;
}

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  intensity?: GlassIntensity;
  glow?: GlowType;
}

interface GlassProgressProps {
  value: number;
  gradient?: string;
  className?: string;
}

interface StatusIndicatorProps {
  type: StatusType;
}

interface GlassBadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
}

interface BadgeStyleConfig {
  bg: string;
  text: string;
  border: string;
}

// ========================================
// CONSTANTS
// ========================================

const THEMES: readonly ThemeName[] = ["light", "aurora", "glass"] as const;

const THEME_CONFIG: Record<ThemeName, ThemeConfig> = {
  light: { label: "Light", icon: Sun },
  aurora: { label: "Aurora", icon: Moon },
  glass: { label: "Glass", icon: Palette },
};

// ========================================
// THEME CONTEXT
// ========================================

const ThemeContext = createContext<ThemeContextValue | null>(null);

const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

// ========================================
// THEME STYLES
// ========================================

const themeStyles: Record<ThemeName, ThemeStyles> = {
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
    toggleText: "#64748b",
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
  },

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
    toggleText: "#fbbf24",
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
  },

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
    toggleText: "rgba(255,255,255,0.60)",
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
  },
};

// ========================================
// GLASS CARD COMPONENT
// ========================================

const GlassCard = ({
  children,
  className = "",
  intensity = "medium",
  glow = null,
}: GlassCardProps): React.JSX.Element => {
  const { theme } = useTheme();
  const t = themeStyles[theme];

  const bgMap: Record<GlassIntensity, string> = {
    subtle: t.glassSubtleBg,
    medium: t.glassMediumBg,
    strong: t.glassStrongBg,
  };

  const borderMap: Record<GlassIntensity, string> = {
    subtle: t.glassSubtleBorder,
    medium: t.glassMediumBorder,
    strong: t.glassStrongBorder,
  };

  const blurMap: Record<GlassIntensity, string> = {
    subtle: "8px",
    medium: "12px",
    strong: "16px",
  };

  const glowMap: Record<string, string> = {
    blue: t.glowBlue,
    violet: t.glowViolet,
    purple: t.glowViolet,
    cyan: t.glowCyan,
  };

  const shadowValue = glow ? (glowMap[glow] ?? t.glowNeutral) : t.glowNeutral;

  return (
    <div
      className={`rounded-2xl border transition-all duration-300 ${className}`}
      style={{
        background: bgMap[intensity],
        borderColor: borderMap[intensity],
        backdropFilter: `blur(${blurMap[intensity]})`,
        WebkitBackdropFilter: `blur(${blurMap[intensity]})`,
        boxShadow: shadowValue,
      }}
    >
      {children}
    </div>
  );
};

// ========================================
// PROGRESS BAR COMPONENT
// ========================================

const GlassProgress = ({
  value,
  gradient = "from-blue-500 to-violet-500",
  className = "",
}: GlassProgressProps): React.JSX.Element => {
  const { theme } = useTheme();
  const t = themeStyles[theme];

  return (
    <div
      className={`h-2 overflow-hidden rounded-full transition-all duration-300 ${className}`}
      style={{ background: t.progressBg }}
    >
      <div
        className={`h-full bg-gradient-to-r ${gradient} rounded-full transition-all duration-700`}
        style={{ width: `${value}%`, boxShadow: t.progressGlow }}
      />
    </div>
  );
};

// ========================================
// STATUS INDICATOR
// ========================================

const StatusIndicator = ({ type }: StatusIndicatorProps): React.JSX.Element => {
  const { theme } = useTheme();
  const t = themeStyles[theme];

  const colors: Record<StatusType, string> = {
    green: t.statusGreen,
    yellow: t.statusYellow,
    red: t.statusRed,
  };

  const glows: Record<StatusType, string> = {
    green: "0 0 8px rgba(52,211,153,0.6)",
    yellow: "0 0 8px rgba(251,191,36,0.6)",
    red: "0 0 8px rgba(248,113,113,0.6)",
  };

  return (
    <div
      className="h-2.5 w-2.5 rounded-full transition-all duration-300"
      style={{ backgroundColor: colors[type], boxShadow: glows[type] }}
    />
  );
};

// ========================================
// BADGE COMPONENT
// ========================================

const GlassBadge = ({
  children,
  variant = "default",
}: GlassBadgeProps): React.JSX.Element => {
  const { theme } = useTheme();
  const t = themeStyles[theme];

  const variantMap: Record<BadgeVariant, BadgeStyleConfig> = {
    default: {
      bg: t.badgeDefaultBg,
      text: t.badgeDefaultText,
      border: t.badgeDefaultBorder,
    },
    success: {
      bg: t.badgeSuccessBg,
      text: t.badgeSuccessText,
      border: t.badgeSuccessBorder,
    },
    warning: {
      bg: t.badgeWarningBg,
      text: t.badgeWarningText,
      border: t.badgeWarningBorder,
    },
    primary: {
      bg: t.badgePrimaryBg,
      text: t.badgePrimaryText,
      border: t.badgePrimaryBorder,
    },
    violet: {
      bg: t.badgeVioletBg,
      text: t.badgeVioletText,
      border: t.badgeVioletBorder,
    },
  };

  const v = variantMap[variant];

  return (
    <span
      className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium backdrop-blur-sm transition-all duration-300"
      style={{ backgroundColor: v.bg, color: v.text, borderColor: v.border }}
    >
      {children}
    </span>
  );
};

// ========================================
// METRIC DATA INTERFACE
// ========================================

interface MetricData {
  label: string;
  value: number;
  bg: string;
  text: string;
  border: string;
  glow?: string;
}

// ========================================
// STAT DATA INTERFACE
// ========================================

interface StatData {
  icon: LucideIcon;
  color: string;
  value: string;
  label: string;
}

// ========================================
// LANGUAGE DATA INTERFACE
// ========================================

interface LanguageData {
  name: string;
  pct: number;
  color: string;
}

// ========================================
// MAIN COMPONENT
// ========================================

function GitHubAnalyticsContent(): React.JSX.Element {
  const { theme, cycleTheme } = useTheme();
  const t = themeStyles[theme];

  const [flagsExpanded, setFlagsExpanded] = useState<boolean>(false);
  const [showFlaggedOnly, setShowFlaggedOnly] = useState<boolean>(false);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [expandedYear, setExpandedYear] = useState<number | null>(null);
  const [expandedRepo, setExpandedRepo] = useState<number | null>(null);

  const years: YearData[] = [
    {
      year: 2025,
      label: "Peak",
      icon: Flame,
      commits: 629,
      prs: 43,
      repos: 5,
      percent: 70,
      gradient:
        theme === "glass"
          ? "from-orange-400 to-rose-500"
          : "from-amber-500 to-orange-500",
      glow: "amber",
    },
    {
      year: 2024,
      label: "Growth",
      icon: TrendingUp,
      commits: 901,
      prs: 0,
      repos: 3,
      percent: 100,
      gradient: "from-emerald-500 to-cyan-500",
      glow: "emerald",
    },
    {
      year: 2023,
      label: "Start",
      icon: Sprout,
      commits: 712,
      prs: 4,
      repos: 5,
      percent: 79,
      gradient: "from-blue-500 to-indigo-500",
      glow: "blue",
    },
  ];

  const repos: RepoData[] = [
    {
      name: "Wildhaven-website",
      languages: "JS 88% · Shell 11%",
      commits: 240,
      contribution: 75,
      stars: 1,
      flagType: "green",
      issues: [],
      createdYear: 2024,
    },
    {
      name: "study",
      languages: "Python 92% · C 5%",
      commits: 177,
      contribution: 100,
      stars: 2,
      flagType: "yellow",
      issues: ["Uneven activity (3 burst days)"],
      createdYear: 2023,
    },
    {
      name: "bot-scripts",
      languages: "Python 100%",
      commits: 89,
      contribution: 100,
      stars: 0,
      flagType: "red",
      issues: ["Empty commits (avg 3 lines)", "Burst: 67 commits on Oct 15"],
      createdYear: 2023,
    },
    {
      name: "portfolio",
      languages: "TypeScript 78% · CSS 22%",
      commits: 134,
      contribution: 100,
      stars: 0,
      flagType: "green",
      issues: [],
      createdYear: 2025,
    },
    {
      name: "git-course",
      languages: "C++ 100%",
      commits: 150,
      contribution: 100,
      stars: 2,
      flagType: "green",
      issues: [],
      createdYear: 2024,
    },
    {
      name: "nextjs-app",
      languages: "TypeScript 95%",
      commits: 56,
      contribution: 100,
      stars: 0,
      flagType: "green",
      issues: [],
      createdYear: 2025,
    },
  ];

  const getFilteredRepos = (): RepoData[] => {
    let filtered = repos;
    if (showFlaggedOnly) {
      filtered = filtered.filter((r) => r.flagType !== "green");
    }
    if (selectedYear !== null) {
      filtered = filtered.filter((r) => r.createdYear === selectedYear);
    }
    return filtered;
  };

  const filteredRepos = getFilteredRepos();

  const handleYearClick = (year: number): void => {
    if (expandedYear === year) {
      setExpandedYear(null);
      setSelectedYear(null);
    } else {
      setExpandedYear(year);
    }
  };

  const handleYearSelect = (year: number): void => {
    setSelectedYear(selectedYear === year ? null : year);
  };

  const clearFilters = (): void => {
    setSelectedYear(null);
    setShowFlaggedOnly(false);
    setFlagsExpanded(false);
    setExpandedYear(null);
  };

  const ThemeIcon = THEME_CONFIG[theme].icon;

  const stats: StatData[] = [
    {
      icon: FolderGit2,
      color: "#a78bfa",
      value: "11",
      label: "repos",
    },
    {
      icon: Users,
      color: "#60a5fa",
      value: "1",
      label: "follower",
    },
    {
      icon: Users,
      color: "#22d3ee",
      value: "5",
      label: "following",
    },
  ];

  const languages: LanguageData[] = [
    {
      name: theme === "glass" ? "TS" : "TypeScript",
      pct: 56,
      color: "bg-blue-400",
    },
    { name: "HTML", pct: 22, color: "bg-orange-400" },
    {
      name: theme === "glass" ? "JS" : "JavaScript",
      pct: 13,
      color: "bg-yellow-400",
    },
  ];

  const metrics: MetricData[] = [
    {
      label: theme === "glass" ? "Reg" : "Regularity",
      value: 84,
      bg: t.metricEmeraldBg,
      text: t.metricEmeraldText,
      border: t.metricEmeraldBorder,
      glow: t.metricEmeraldGlow,
    },
    {
      label: theme === "glass" ? "Imp" : "Impact",
      value: 45,
      bg: t.metricAmberBg,
      text: t.metricAmberText,
      border: t.metricAmberBorder,
      glow: t.metricAmberGlow,
    },
    {
      label: theme === "glass" ? "Div" : "Diversity",
      value: 78,
      bg: t.metricBlueBg,
      text: t.metricBlueText,
      border: t.metricBlueBorder,
      glow: t.metricBlueGlow,
    },
    {
      label: "Collab",
      value: 12,
      bg: t.metricRedBg,
      text: t.metricRedText,
      border: t.metricRedBorder,
      glow: t.metricRedGlow,
    },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden font-['Inter',system-ui,sans-serif]">
      {/* Background */}
      <div
        className="fixed inset-0 transition-all duration-500"
        style={{
          background: `linear-gradient(to bottom right, ${t.bgFrom}, ${t.bgVia}, ${t.bgTo})`,
        }}
      >
        {/* Orbs */}
        {theme === "glass" ? (
          <>
            <div
              className="absolute top-20 -left-20 h-72 w-72 animate-pulse rounded-full blur-3xl"
              style={{ background: t.orb1 }}
            />
            <div
              className="absolute top-1/3 -right-20 h-96 w-96 rounded-full blur-3xl"
              style={{ background: t.orb2 }}
            />
            <div
              className="absolute bottom-20 left-1/4 h-64 w-64 animate-pulse rounded-full blur-3xl"
              style={{ background: t.orb3, animationDelay: "1s" }}
            />
            <div
              className="absolute right-1/4 bottom-1/3 h-48 w-48 rounded-full blur-3xl"
              style={{ background: t.orb4 }}
            />
            <div
              className="absolute top-1/2 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
              style={{ background: t.orb5 }}
            />
          </>
        ) : (
          <>
            <div
              className="absolute top-10 -left-32 h-96 w-96 rounded-full blur-3xl transition-all duration-500"
              style={{ background: t.orb1 }}
            />
            <div
              className="absolute top-1/4 -right-32 h-[500px] w-[500px] rounded-full blur-3xl transition-all duration-500"
              style={{ background: t.orb2 }}
            />
            <div
              className="absolute bottom-10 left-1/3 h-80 w-80 rounded-full blur-3xl transition-all duration-500"
              style={{ background: t.orb3 }}
            />
            <div
              className="absolute right-1/4 bottom-1/4 h-64 w-64 rounded-full blur-3xl transition-all duration-500"
              style={{ background: t.orb4 }}
            />
          </>
        )}

        {/* Grid */}
        <div
          className="absolute inset-0 transition-opacity duration-500"
          style={{
            opacity: t.gridOpacity,
            backgroundImage: `linear-gradient(${t.gridColor} 1px, transparent 1px), linear-gradient(90deg, ${t.gridColor} 1px, transparent 1px)`,
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div
          className="sticky top-0 z-50 border-b backdrop-blur-xl transition-all duration-300"
          style={{ background: t.headerBg, borderColor: t.headerBorder }}
        >
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-2.5">
              <div
                className="flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-300"
                style={{
                  background: `linear-gradient(to bottom right, ${t.iconBtnFrom}, ${t.iconBtnTo})`,
                  boxShadow: t.iconBtnShadow,
                }}
              >
                <Github className="h-5 w-5" style={{ color: t.iconBtnText }} />
              </div>
              <span
                className="font-semibold transition-colors duration-300"
                style={{ color: t.textPrimary }}
              >
                {theme === "glass" ? "Analytics" : "User Analytics"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="flex items-center rounded-xl border px-3 py-1.5 backdrop-blur-sm transition-all duration-300"
                style={{ background: t.searchBg, borderColor: t.searchBorder }}
              >
                <Search
                  className="mr-2 h-3.5 w-3.5 transition-colors duration-300"
                  style={{ color: t.textMuted }}
                />
                <span
                  className="text-sm transition-colors duration-300"
                  style={{ color: t.searchText }}
                >
                  Yhooi2
                </span>
              </div>
              <button
                onClick={cycleTheme}
                className="flex h-9 w-9 items-center justify-center rounded-xl border transition-all duration-300"
                style={{
                  background: t.searchBg,
                  borderColor: t.searchBorder,
                  color: t.toggleText,
                }}
                title={`Switch to ${THEME_CONFIG[THEMES[(THEMES.indexOf(theme) + 1) % THEMES.length]].label}`}
              >
                <ThemeIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-4 p-4">
          {/* Profile Card */}
          <GlassCard intensity="strong" glow="violet" className="p-5">
            <div className="flex items-start gap-4">
              <div className="relative">
                <div
                  className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 via-violet-500 to-indigo-600 text-xl font-bold text-white transition-shadow duration-300"
                  style={{ boxShadow: t.avatarGlow }}
                >
                  AS
                </div>
                <div
                  className="absolute -right-1 -bottom-1 h-5 w-5 rounded-full bg-emerald-400 transition-all duration-300"
                  style={{
                    borderWidth: "2px",
                    borderColor: t.onlineBorder,
                    boxShadow: "0 0 8px rgba(52,211,153,0.5)",
                  }}
                />
              </div>
              <div className="min-w-0 flex-1">
                <h1
                  className="truncate text-xl font-bold transition-colors duration-300"
                  style={{ color: t.textPrimary }}
                >
                  Artem Safronov
                </h1>
                <div
                  className="mt-0.5 flex items-center gap-1.5 text-sm transition-colors duration-300"
                  style={{ color: t.textSecondary }}
                >
                  <span style={{ color: t.textAccent }}>@Yhooi2</span>
                  <ExternalLink className="h-3 w-3" />
                </div>
                <div
                  className="mt-1 text-xs transition-colors duration-300"
                  style={{ color: t.textMuted }}
                >
                  Joined January 2023
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="mt-4 flex items-center gap-4 text-sm">
              {stats.map((s, i) => (
                <span
                  key={i}
                  className="flex items-center gap-1.5 transition-colors duration-300"
                  style={{ color: t.textSecondary }}
                >
                  <s.icon className="h-4 w-4" style={{ color: s.color }} />
                  <span
                    className="font-semibold"
                    style={{ color: t.textPrimary }}
                  >
                    {s.value}
                  </span>{" "}
                  {s.label}
                </span>
              ))}
            </div>

            {/* Language bar */}
            <div className="mt-4">
              <div
                className="flex h-2.5 overflow-hidden rounded-full transition-shadow duration-300"
                style={{ boxShadow: t.langBarShadow }}
              >
                <div
                  className="bg-gradient-to-r from-blue-400 to-blue-500"
                  style={{ width: "56%" }}
                />
                <div
                  className="bg-gradient-to-r from-orange-400 to-orange-500"
                  style={{ width: "22%" }}
                />
                <div
                  className="bg-gradient-to-r from-yellow-300 to-yellow-400"
                  style={{ width: "13%" }}
                />
                <div
                  className="bg-gradient-to-r from-emerald-400 to-emerald-500"
                  style={{ width: "9%" }}
                />
              </div>
              <div className="mt-2.5 flex flex-wrap gap-x-3 gap-y-1 text-xs">
                {languages.map((l) => (
                  <span
                    key={l.name}
                    className="flex items-center gap-1.5 transition-colors duration-300"
                    style={{ color: t.textSecondary }}
                  >
                    <span className={`h-2 w-2 rounded-sm ${l.color}`} />
                    {l.name} {l.pct}%
                  </span>
                ))}
                <span style={{ color: t.textMuted }}>+5</span>
              </div>
            </div>
          </GlassCard>

          {/* AI Summary CTA */}
          <GlassCard
            intensity="medium"
            glow="blue"
            className={`p-4 ${theme === "glass" ? "bg-gradient-to-r from-violet-500/20 to-indigo-500/20" : ""}`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-400 to-purple-500"
                  style={{ boxShadow: "0 0 16px rgba(147,51,234,0.5)" }}
                >
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <div>
                  <span
                    className="block font-semibold transition-colors duration-300"
                    style={{ color: t.textPrimary }}
                  >
                    AI Summary
                  </span>
                  <span
                    className="flex items-center gap-1 text-xs transition-colors duration-300"
                    style={{ color: t.textMuted }}
                  >
                    <Clock className="h-3 w-3" /> ~30 sec
                  </span>
                </div>
              </div>
              <button className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 px-5 py-2.5 text-sm font-medium text-white shadow-[0_4px_20px_rgba(147,51,234,0.4)] transition-shadow hover:shadow-[0_4px_24px_rgba(147,51,234,0.6)]">
                <Sparkles className="h-4 w-4" />
                Generate
              </button>
            </div>
          </GlassCard>

          {/* Trust Score */}
          <GlassCard intensity="strong" glow="cyan" className="p-5">
            <div className="mb-3 flex items-center justify-between">
              <span
                className="font-semibold transition-colors duration-300"
                style={{ color: t.textPrimary }}
              >
                Trust Score
              </span>
              <div className="flex items-baseline gap-1">
                <span className="bg-gradient-to-r from-amber-300 via-emerald-300 to-cyan-300 bg-clip-text text-3xl font-bold text-transparent">
                  72
                </span>
                <span
                  className="text-sm transition-colors duration-300"
                  style={{ color: t.textMuted }}
                >
                  /100
                </span>
              </div>
            </div>
            <GlassProgress
              value={72}
              gradient="from-amber-400 via-emerald-400 to-cyan-400"
              className="mb-5 h-3"
            />

            <div className="grid grid-cols-4 gap-3">
              {metrics.map((m) => (
                <div
                  key={m.label}
                  className="rounded-xl border p-2.5 text-center transition-all duration-300"
                  style={{ backgroundColor: m.bg, borderColor: m.border }}
                >
                  <div
                    className="text-xl font-bold transition-all duration-300"
                    style={{
                      color: m.text,
                      textShadow: theme === "glass" ? m.glow : "none",
                    }}
                  >
                    {m.value}
                  </div>
                  <div
                    className="mt-0.5 text-[10px] font-medium tracking-wide uppercase transition-colors duration-300"
                    style={{ color: t.textMuted }}
                  >
                    {m.label}
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Active Filters */}
          {(selectedYear !== null || showFlaggedOnly) && (
            <div className="flex flex-wrap items-center gap-2">
              {selectedYear !== null && (
                <GlassBadge variant="primary">
                  Year: {selectedYear}
                  <button
                    onClick={() => setSelectedYear(null)}
                    className="ml-1.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </GlassBadge>
              )}
              {showFlaggedOnly && (
                <GlassBadge variant="warning">
                  Flagged only
                  <button
                    onClick={() => {
                      setShowFlaggedOnly(false);
                      setFlagsExpanded(false);
                    }}
                    className="ml-1.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </GlassBadge>
              )}
              <button
                onClick={clearFilters}
                className="text-xs underline transition-colors duration-300"
                style={{ color: t.textMuted }}
              >
                Clear all
              </button>
            </div>
          )}

          {/* Flags Section */}
          <GlassCard intensity="medium" className="overflow-hidden">
            <button
              className="flex w-full items-center justify-between p-4 transition-colors"
              onClick={() => {
                setFlagsExpanded(!flagsExpanded);
                if (!flagsExpanded) {
                  setShowFlaggedOnly(true);
                } else {
                  setShowFlaggedOnly(false);
                }
              }}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-lg"
                  style={{ background: "rgba(245,158,11,0.2)" }}
                >
                  <AlertTriangle
                    className="h-4 w-4"
                    style={{ color: t.statusYellow }}
                  />
                </div>
                <span
                  className="font-semibold transition-colors duration-300"
                  style={{ color: t.textPrimary }}
                >
                  2 flags detected
                </span>
              </div>
              {flagsExpanded ? (
                <ChevronUp className="h-5 w-5" style={{ color: t.textMuted }} />
              ) : (
                <ChevronDown
                  className="h-5 w-5"
                  style={{ color: t.textMuted }}
                />
              )}
            </button>

            {flagsExpanded && (
              <div
                className="space-y-2 border-t px-4 pt-3 pb-4 transition-colors duration-300"
                style={{
                  borderColor:
                    theme === "glass" ? "rgba(255,255,255,0.1)" : t.cardBorder,
                }}
              >
                <div
                  className="rounded-xl border p-3 backdrop-blur-sm"
                  style={{
                    background: t.alertDangerBg,
                    borderColor: t.alertDangerBorder,
                  }}
                >
                  <div
                    className="flex items-center gap-2 text-sm font-medium"
                    style={{ color: t.alertDangerText }}
                  >
                    <div
                      className="h-2 w-2 rounded-full"
                      style={{
                        backgroundColor: t.statusRed,
                        boxShadow: "0 0 8px rgba(251,113,133,0.6)",
                      }}
                    />
                    No collaboration
                  </div>
                  <p
                    className="mt-1 ml-4 text-xs"
                    style={{
                      color:
                        theme === "glass"
                          ? "rgba(254,205,211,0.6)"
                          : t.alertDangerText,
                      opacity: 0.7,
                    }}
                  >
                    0 PRs to external repos
                  </p>
                </div>
                <div
                  className="rounded-xl border p-3 backdrop-blur-sm"
                  style={{
                    background: t.alertWarningBg,
                    borderColor: t.alertWarningBorder,
                  }}
                >
                  <div
                    className="flex items-center gap-2 text-sm font-medium"
                    style={{ color: t.alertWarningText }}
                  >
                    <div
                      className="h-2 w-2 rounded-full"
                      style={{
                        backgroundColor: t.statusYellow,
                        boxShadow: "0 0 8px rgba(251,191,36,0.6)",
                      }}
                    />
                    Burst activity
                  </div>
                  <p
                    className="mt-1 ml-4 text-xs"
                    style={{
                      color:
                        theme === "glass"
                          ? "rgba(253,230,138,0.6)"
                          : t.alertWarningText,
                      opacity: 0.7,
                    }}
                  >
                    3 days with 50+ commits
                  </p>
                </div>
              </div>
            )}
          </GlassCard>

          {/* Career Stats */}
          <GlassCard intensity="medium" className="p-4">
            <h3
              className="mb-1 font-semibold transition-colors duration-300"
              style={{ color: t.textPrimary }}
            >
              Career Stats
            </h3>
            <p
              className="mb-4 text-sm transition-colors duration-300"
              style={{ color: t.textMuted }}
            >
              2,242 commits · 47 PRs · 11 repos
            </p>

            <div className="space-y-2">
              {years.map((y) => {
                const Icon = y.icon;
                const isExpanded = expandedYear === y.year;
                const isSelected = selectedYear === y.year;

                return (
                  <div key={y.year}>
                    <div
                      className={`cursor-pointer rounded-xl p-3.5 transition-all duration-300 ${isSelected ? `bg-gradient-to-r ${y.gradient}` : ""}`}
                      style={
                        !isSelected
                          ? {
                              background: t.cardBg,
                              borderWidth: "1px",
                              borderColor: t.cardBorder,
                            }
                          : { boxShadow: "0 4px 20px rgba(147,51,234,0.3)" }
                      }
                      onClick={() => handleYearClick(y.year)}
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-bold ${isSelected ? "text-white" : ""}`}
                            style={!isSelected ? { color: t.textPrimary } : {}}
                          >
                            {y.year}
                          </span>
                          <Icon
                            className={`h-4 w-4 ${isSelected ? "text-white" : ""}`}
                            style={!isSelected ? { color: t.textMuted } : {}}
                          />
                          <span
                            className={`text-xs ${isSelected ? "text-white/80" : ""}`}
                            style={!isSelected ? { color: t.textMuted } : {}}
                          >
                            {y.label}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-sm font-semibold ${isSelected ? "text-white" : ""}`}
                            style={!isSelected ? { color: t.textPrimary } : {}}
                          >
                            {y.commits}
                          </span>
                          {isExpanded ? (
                            <ChevronUp
                              className={`h-4 w-4 ${isSelected ? "text-white/70" : ""}`}
                              style={!isSelected ? { color: t.textMuted } : {}}
                            />
                          ) : (
                            <ChevronDown
                              className={`h-4 w-4 ${isSelected ? "text-white/70" : ""}`}
                              style={!isSelected ? { color: t.textMuted } : {}}
                            />
                          )}
                        </div>
                      </div>
                      <div
                        className="h-2 overflow-hidden rounded-full"
                        style={{
                          background: isSelected
                            ? "rgba(255,255,255,0.2)"
                            : t.progressBg,
                        }}
                      >
                        <div
                          className={`h-full rounded-full transition-all ${isSelected ? "bg-white/90" : `bg-gradient-to-r ${y.gradient}`}`}
                          style={{ width: `${y.percent}%` }}
                        />
                      </div>
                    </div>

                    {isExpanded && (
                      <div
                        className="mt-2 ml-3 rounded-xl border-l-2 p-4 backdrop-blur-sm"
                        style={{
                          background: t.expandedBg,
                          borderColor: t.expandedBorder,
                        }}
                      >
                        <div className="mb-4 grid grid-cols-3 gap-4 text-center">
                          {[
                            { val: y.commits, label: "Commits" },
                            { val: y.prs, label: "PRs" },
                            { val: y.repos, label: "Repos" },
                          ].map((s) => (
                            <div key={s.label}>
                              <div
                                className="text-xl font-bold transition-colors duration-300"
                                style={{ color: t.textPrimary }}
                              >
                                {s.val}
                              </div>
                              <div
                                className="text-xs transition-colors duration-300"
                                style={{ color: t.textMuted }}
                              >
                                {s.label}
                              </div>
                            </div>
                          ))}
                        </div>
                        <button
                          className={`w-full rounded-xl py-2.5 text-sm font-medium transition-all ${!isSelected ? `bg-gradient-to-r ${y.gradient} text-white shadow-[0_4px_16px_rgba(147,51,234,0.3)]` : ""}`}
                          style={
                            isSelected
                              ? {
                                  background:
                                    theme === "glass"
                                      ? "rgba(255,255,255,0.2)"
                                      : t.btnSecondaryBg,
                                  color:
                                    theme === "glass"
                                      ? "white"
                                      : t.btnSecondaryText,
                                  borderWidth: "1px",
                                  borderColor:
                                    theme === "glass"
                                      ? "rgba(255,255,255,0.3)"
                                      : t.btnSecondaryBorder,
                                }
                              : {}
                          }
                          onClick={(e: MouseEvent<HTMLButtonElement>) => {
                            e.stopPropagation();
                            handleYearSelect(y.year);
                          }}
                        >
                          {isSelected
                            ? `✓ Showing ${y.year}`
                            : `Show repos from ${y.year}`}
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </GlassCard>

          {/* Projects */}
          <GlassCard intensity="medium" className="p-4">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {showFlaggedOnly ? (
                  <AlertTriangle
                    className="h-4 w-4"
                    style={{ color: t.statusYellow }}
                  />
                ) : (
                  <FolderGit2
                    className="h-4 w-4"
                    style={{ color: t.textAccent }}
                  />
                )}
                <h3
                  className="font-semibold transition-colors duration-300"
                  style={{ color: t.textPrimary }}
                >
                  {showFlaggedOnly
                    ? "Flagged"
                    : selectedYear !== null
                      ? `${selectedYear}`
                      : "All"}{" "}
                  Projects
                </h3>
                <GlassBadge variant="violet">{filteredRepos.length}</GlassBadge>
              </div>
            </div>

            {filteredRepos.length === 0 ? (
              <div className="py-10 text-center">
                <div
                  className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl"
                  style={{ background: t.cardBg }}
                >
                  <FolderGit2
                    className="h-8 w-8"
                    style={{ color: t.textMuted }}
                  />
                </div>
                <p
                  className="text-sm transition-colors duration-300"
                  style={{ color: t.textMuted }}
                >
                  No repositories found
                </p>
                <button
                  onClick={clearFilters}
                  className="mt-2 text-sm underline"
                  style={{ color: t.textAccent }}
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredRepos.map((repo, i) => (
                  <div
                    key={repo.name}
                    className="overflow-hidden rounded-xl border transition-all duration-300"
                    style={{ background: t.cardBg, borderColor: t.cardBorder }}
                  >
                    <div
                      className="cursor-pointer p-3.5"
                      onClick={() =>
                        setExpandedRepo(expandedRepo === i ? null : i)
                      }
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <span
                            className="text-sm font-medium transition-colors duration-300"
                            style={{ color: t.textPrimary }}
                          >
                            {repo.name}
                          </span>
                          <StatusIndicator type={repo.flagType} />
                        </div>
                        <div className="flex items-center gap-2">
                          {repo.stars > 0 && (
                            <span
                              className="flex items-center gap-1 text-xs"
                              style={{ color: t.statusYellow }}
                            >
                              <Star className="h-3 w-3" />
                              {repo.stars}
                            </span>
                          )}
                          {expandedRepo === i ? (
                            <ChevronUp
                              className="h-4 w-4"
                              style={{ color: t.textMuted }}
                            />
                          ) : (
                            <ChevronDown
                              className="h-4 w-4"
                              style={{ color: t.textMuted }}
                            />
                          )}
                        </div>
                      </div>
                      <div
                        className="mt-1.5 text-xs transition-colors duration-300"
                        style={{ color: t.textMuted }}
                      >
                        {repo.languages}
                      </div>
                      <div
                        className="mt-0.5 text-xs transition-colors duration-300"
                        style={{ color: t.textSecondary }}
                      >
                        {repo.commits} commits · {repo.contribution}%
                      </div>
                    </div>

                    {expandedRepo === i && (
                      <div
                        className="space-y-3 border-t p-3.5"
                        style={{
                          borderColor: t.cardBorder,
                          background:
                            theme === "glass"
                              ? "rgba(255,255,255,0.03)"
                              : t.expandedBg,
                        }}
                      >
                        {repo.issues.length > 0 && (
                          <div
                            className="rounded-xl border p-3"
                            style={{
                              background: t.alertDangerBg,
                              borderColor: t.alertDangerBorder,
                            }}
                          >
                            <div
                              className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold"
                              style={{ color: t.alertDangerText }}
                            >
                              <AlertTriangle className="h-3.5 w-3.5" />
                              Issues
                            </div>
                            {repo.issues.map((issue, j) => (
                              <div
                                key={j}
                                className="text-xs"
                                style={{
                                  color: t.alertDangerText,
                                  opacity: 0.7,
                                }}
                              >
                                • {issue}
                              </div>
                            ))}
                          </div>
                        )}

                        <div className="grid grid-cols-2 gap-2">
                          {[
                            {
                              title:
                                theme === "glass"
                                  ? "Your"
                                  : "Your Contribution",
                              val: repo.commits,
                              sub: `${repo.contribution}%`,
                            },
                            {
                              title:
                                theme === "glass" ? "Project" : "Full Project",
                              val: Math.round(
                                repo.commits / (repo.contribution / 100),
                              ),
                              sub: `~${Math.round(repo.commits * 12)} lines`,
                            },
                          ].map((c) => (
                            <div
                              key={c.title}
                              className="rounded-lg border p-2.5"
                              style={{
                                background: t.cardBg,
                                borderColor: t.cardBorder,
                              }}
                            >
                              <div
                                className="text-xs transition-colors duration-300"
                                style={{ color: t.textMuted }}
                              >
                                {c.title}
                              </div>
                              <div
                                className="font-semibold transition-colors duration-300"
                                style={{ color: t.textPrimary }}
                              >
                                {c.val} commits
                              </div>
                              <div
                                className="text-xs transition-colors duration-300"
                                style={{ color: t.textMuted }}
                              >
                                {c.sub}
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="flex gap-2">
                          <button
                            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border py-2.5 text-xs font-medium transition-all"
                            style={{
                              background: t.btnSecondaryBg,
                              color: t.btnSecondaryText,
                              borderColor: t.btnSecondaryBorder,
                            }}
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                            GitHub
                          </button>
                          <button className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 py-2.5 text-xs font-medium text-white shadow-[0_4px_16px_rgba(147,51,234,0.4)] transition hover:shadow-[0_4px_20px_rgba(147,51,234,0.5)]">
                            <Sparkles className="h-3.5 w-3.5" />
                            AI Analysis
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </GlassCard>

          {/* Footer */}
          <div
            className="py-6 text-center text-xs transition-colors duration-300"
            style={{ color: t.footerText }}
          >
            GitHub Analytics · {THEME_CONFIG[theme].label} Theme
          </div>
        </div>
      </div>
    </div>
  );
}

// ========================================
// THEME PROVIDER PROPS
// ========================================

interface ThemeProviderProps {
  children: ReactNode;
}

// ========================================
// MAIN EXPORT WITH THEME PROVIDER
// ========================================

export default function GitHubAnalyticsTripleTheme(): React.JSX.Element {
  const [theme, setTheme] = useState<ThemeName>("glass");

  const cycleTheme = (): void => {
    const currentIndex = THEMES.indexOf(theme);
    const nextIndex = (currentIndex + 1) % THEMES.length;
    setTheme(THEMES[nextIndex]);
  };

  const contextValue: ThemeContextValue = {
    theme,
    setTheme,
    cycleTheme,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      <GitHubAnalyticsContent />
    </ThemeContext.Provider>
  );
}

// ========================================
// NAMED EXPORTS FOR REUSABILITY
// ========================================

export {
  GlassBadge,
  GlassCard,
  GlassProgress,
  StatusIndicator,
  THEME_CONFIG,
  ThemeContext,
  THEMES,
  themeStyles,
  useTheme,
};

export type {
  BadgeVariant,
  GlassBadgeProps,
  GlassCardProps,
  GlassIntensity,
  GlassProgressProps,
  GlowType,
  LanguageData,
  MetricData,
  RepoData,
  StatData,
  StatusIndicatorProps,
  StatusType,
  ThemeContextValue,
  ThemeName,
  ThemeStyles,
  YearData,
};
