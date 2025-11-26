import {
  AlertTriangle,
  Calendar,
  Check,
  ChevronDown,
  ChevronUp,
  Clock,
  Code,
  ExternalLink,
  FolderGit2,
  Github,
  GitPullRequest,
  Moon,
  Palette,
  Search,
  Sparkles,
  Star,
  Sun,
  Target,
  TrendingUp,
  User,
  Users,
  Zap,
  type LucideIcon,
} from "lucide-react";
import {
  createContext,
  useContext,
  useState,
  type FC,
  type ReactNode,
} from "react";

// ========================================
// TYPE DEFINITIONS
// ========================================

/** Available theme names */
type ThemeName = "light" | "aurora" | "glass";

/** Glass card intensity levels */
type GlassIntensity = "subtle" | "medium" | "strong";

/** Glow effect types for cards */
type GlowType = "blue" | "violet" | "purple" | "cyan";

/** Status indicator colors */
type StatusType = "green" | "yellow" | "red";

/** Repository health status */
type RepoStatus = "good" | "warning" | "critical";

/** Badge visual variants */
type BadgeVariant =
  | "default"
  | "success"
  | "warning"
  | "danger"
  | "primary"
  | "violet";

/** Metric color schemes */
type MetricColor = "emerald" | "amber" | "blue" | "red";

/** Tab types for repository filtering */
type TabType = "your" | "contrib";

/** Status indicator size */
type IndicatorSize = "normal" | "large";

/** Theme configuration with label and icon */
interface ThemeConfig {
  readonly label: string;
  readonly icon: LucideIcon;
}

/** Theme context value provided to consumers */
interface ThemeContextValue {
  readonly theme: ThemeName;
  readonly setTheme: (theme: ThemeName) => void;
  readonly cycleTheme: () => void;
}

/** Complete theme style definition */
interface ThemeStyles {
  // Background
  readonly bgFrom: string;
  readonly bgVia: string;
  readonly bgTo: string;
  // Orbs
  readonly orb1: string;
  readonly orb2: string;
  readonly orb3: string;
  readonly orb4: string;
  readonly orb5?: string;
  // Glass
  readonly glassSubtleBg: string;
  readonly glassMediumBg: string;
  readonly glassStrongBg: string;
  readonly glassSubtleBorder: string;
  readonly glassMediumBorder: string;
  readonly glassStrongBorder: string;
  // Text
  readonly textPrimary: string;
  readonly textSecondary: string;
  readonly textMuted: string;
  readonly textAccent: string;
  // Header
  readonly headerBg: string;
  readonly headerBorder: string;
  // Glow
  readonly glowViolet: string;
  readonly glowBlue: string;
  readonly glowCyan: string;
  readonly glowNeutral: string;
  // Progress
  readonly progressBg: string;
  readonly progressGlow: string;
  // Status
  readonly statusGreen: string;
  readonly statusYellow: string;
  readonly statusRed: string;
  // Metrics
  readonly metricEmeraldBg: string;
  readonly metricEmeraldText: string;
  readonly metricEmeraldBorder: string;
  readonly metricEmeraldGlow?: string;
  readonly metricAmberBg: string;
  readonly metricAmberText: string;
  readonly metricAmberBorder: string;
  readonly metricAmberGlow?: string;
  readonly metricBlueBg: string;
  readonly metricBlueText: string;
  readonly metricBlueBorder: string;
  readonly metricBlueGlow?: string;
  readonly metricRedBg: string;
  readonly metricRedText: string;
  readonly metricRedBorder: string;
  readonly metricRedGlow?: string;
  // Alerts
  readonly alertDangerBg: string;
  readonly alertDangerBorder: string;
  readonly alertDangerText: string;
  readonly alertWarningBg: string;
  readonly alertWarningBorder: string;
  readonly alertWarningText: string;
  // Cards
  readonly cardBg: string;
  readonly cardBorder: string;
  readonly cardHoverBg: string;
  readonly expandedBg: string;
  readonly expandedBorder: string;
  // Buttons
  readonly btnSecondaryBg: string;
  readonly btnSecondaryText: string;
  readonly btnSecondaryBorder: string;
  readonly btnPrimaryBg: string;
  readonly btnPrimaryText: string;
  // Badges
  readonly badgeDefaultBg: string;
  readonly badgeDefaultText: string;
  readonly badgeDefaultBorder: string;
  readonly badgeSuccessBg: string;
  readonly badgeSuccessText: string;
  readonly badgeSuccessBorder: string;
  readonly badgeWarningBg: string;
  readonly badgeWarningText: string;
  readonly badgeWarningBorder: string;
  readonly badgeDangerBg: string;
  readonly badgeDangerText: string;
  readonly badgeDangerBorder: string;
  readonly badgePrimaryBg: string;
  readonly badgePrimaryText: string;
  readonly badgePrimaryBorder: string;
  readonly badgeVioletBg: string;
  readonly badgeVioletText: string;
  readonly badgeVioletBorder: string;
  // Search/Toggle
  readonly searchBg: string;
  readonly searchBorder: string;
  readonly searchText: string;
  readonly searchBtnBg: string;
  readonly searchBtnText: string;
  readonly toggleActiveBg: string;
  readonly toggleActiveText: string;
  readonly toggleInactiveBg: string;
  readonly toggleInactiveText: string;
  // Select
  readonly selectBg: string;
  readonly selectBorder: string;
  readonly selectText: string;
  // Icon button
  readonly iconBtnFrom: string;
  readonly iconBtnTo: string;
  readonly iconBtnShadow: string;
  readonly iconBtnText: string;
  // Avatar
  readonly avatarGlow: string;
  readonly onlineBorder: string;
  // Language bar
  readonly langBarShadow: string;
  // Grid
  readonly gridColor: string;
  readonly gridOpacity: number;
  // Footer
  readonly footerText: string;
  // AI Card
  readonly aiCardBg: string;
  readonly aiCardBorder: string;
  readonly aiIconBg: string;
  // Year cards
  readonly yearCardBg: string;
  readonly yearCardBorder: string;
  readonly yearSelectedBg: string;
  readonly yearSelectedText: string;
}

/** Language statistics data */
interface LanguageData {
  readonly name: string;
  readonly percent: number;
  readonly color: string;
}

/** Repository language breakdown */
interface RepoLanguage {
  readonly name: string;
  readonly percent: number;
  readonly color: string;
}

/** Repository data structure */
interface RepoData {
  readonly name: string;
  readonly status: RepoStatus;
  readonly stars: number;
  readonly commits: number;
  readonly contribution: number;
  readonly langs: readonly RepoLanguage[];
  readonly issues?: readonly string[];
}

/** Yearly statistics data */
interface YearData {
  readonly year: number;
  readonly emoji: string;
  readonly label: string;
  readonly commits: number;
  readonly progress: number;
}

/** Metric display data */
interface MetricData {
  readonly label: string;
  readonly value: number;
  readonly color: MetricColor;
}

/** Metric color configuration */
interface MetricColors {
  readonly bg: string;
  readonly text: string;
  readonly border: string;
  readonly glow?: string;
  readonly gradient: string;
}

/** GlassCard component props */
interface GlassCardProps {
  readonly children: ReactNode;
  readonly className?: string;
  readonly intensity?: GlassIntensity;
  readonly glow?: GlowType | null;
}

/** GlassProgress component props */
interface GlassProgressProps {
  readonly value: number;
  readonly gradient?: string;
  readonly className?: string;
  readonly height?: string;
}

/** StatusIndicator component props */
interface StatusIndicatorProps {
  readonly type: StatusType;
  readonly size?: IndicatorSize;
}

/** GlassBadge component props */
interface GlassBadgeProps {
  readonly children: ReactNode;
  readonly variant?: BadgeVariant;
}

/** Badge style configuration */
interface BadgeStyleConfig {
  readonly bg: string;
  readonly text: string;
  readonly border: string;
}

// ========================================
// CONSTANTS
// ========================================

const THEMES = [
  "light",
  "aurora",
  "glass",
] as const satisfies readonly ThemeName[];

const THEME_CONFIG: Readonly<Record<ThemeName, ThemeConfig>> = {
  light: { label: "Light", icon: Sun },
  aurora: { label: "Aurora", icon: Moon },
  glass: { label: "Glass", icon: Palette },
} as const;

const STATUS_MAP: Readonly<Record<RepoStatus, StatusType>> = {
  good: "green",
  warning: "yellow",
  critical: "red",
} as const;

const STATUS_SYMBOLS: Readonly<Record<StatusType, string>> = {
  green: "✓",
  yellow: "!",
  red: "✕",
} as const;

const STATUS_GLOWS: Readonly<Record<StatusType, string>> = {
  green: "0 0 8px rgba(52,211,153,0.6)",
  yellow: "0 0 8px rgba(251,191,36,0.6)",
  red: "0 0 8px rgba(248,113,113,0.6)",
} as const;

const BLUR_VALUES: Readonly<Record<GlassIntensity, string>> = {
  subtle: "8px",
  medium: "12px",
  strong: "16px",
} as const;

// ========================================
// THEME CONTEXT
// ========================================

const ThemeContext = createContext<ThemeContextValue | null>(null);

/**
 * Custom hook to access theme context
 * @throws Error if used outside ThemeProvider
 */
const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext);
  if (context === null) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

// ========================================
// THEME STYLES
// ========================================

const themeStyles: Readonly<Record<ThemeName, ThemeStyles>> = {
  light: {
    bgFrom: "#f1f5f9",
    bgVia: "#eff6ff",
    bgTo: "#f5f3ff",
    orb1: "rgba(96,165,250,0.20)",
    orb2: "rgba(167,139,250,0.15)",
    orb3: "rgba(34,211,238,0.15)",
    orb4: "rgba(129,140,248,0.10)",
    glassSubtleBg: "rgba(255,255,255,0.60)",
    glassMediumBg: "rgba(255,255,255,0.70)",
    glassStrongBg: "rgba(255,255,255,0.80)",
    glassSubtleBorder: "rgba(255,255,255,0.50)",
    glassMediumBorder: "rgba(255,255,255,0.60)",
    glassStrongBorder: "rgba(255,255,255,0.70)",
    textPrimary: "#1e293b",
    textSecondary: "#64748b",
    textMuted: "#94a3b8",
    textAccent: "#7c3aed",
    headerBg: "rgba(255,255,255,0.60)",
    headerBorder: "rgba(255,255,255,0.80)",
    glowViolet:
      "0 8px 32px rgba(124,58,237,0.15), 0 0 0 1px rgba(124,58,237,0.1)",
    glowBlue:
      "0 8px 32px rgba(59,130,246,0.15), 0 0 0 1px rgba(59,130,246,0.1)",
    glowCyan: "0 8px 32px rgba(6,182,212,0.15), 0 0 0 1px rgba(6,182,212,0.1)",
    glowNeutral: "0 8px 32px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.05)",
    progressBg: "rgba(226,232,240,0.60)",
    progressGlow: "0 0 8px rgba(124,58,237,0.3)",
    statusGreen: "#10b981",
    statusYellow: "#f59e0b",
    statusRed: "#ef4444",
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
    alertDangerBg: "rgba(239,68,68,0.05)",
    alertDangerBorder: "rgba(254,202,202,0.6)",
    alertDangerText: "#b91c1c",
    alertWarningBg: "rgba(245,158,11,0.05)",
    alertWarningBorder: "rgba(253,230,138,0.6)",
    alertWarningText: "#b45309",
    cardBg: "rgba(255,255,255,0.60)",
    cardBorder: "rgba(226,232,240,0.60)",
    cardHoverBg: "rgba(255,255,255,0.80)",
    expandedBg: "rgba(255,255,255,0.70)",
    expandedBorder: "rgba(139,92,246,0.5)",
    btnSecondaryBg: "rgba(255,255,255,0.80)",
    btnSecondaryText: "#334155",
    btnSecondaryBorder: "#e2e8f0",
    btnPrimaryBg: "linear-gradient(to right, #7c3aed, #8b5cf6)",
    btnPrimaryText: "white",
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
    searchBg: "rgba(255,255,255,0.80)",
    searchBorder: "rgba(226,232,240,0.8)",
    searchText: "#64748b",
    searchBtnBg: "#1e293b",
    searchBtnText: "white",
    toggleActiveBg: "#1e293b",
    toggleActiveText: "white",
    toggleInactiveBg: "rgba(255,255,255,0.80)",
    toggleInactiveText: "#64748b",
    selectBg: "rgba(255,255,255,0.80)",
    selectBorder: "rgba(226,232,240,0.8)",
    selectText: "#334155",
    iconBtnFrom: "#1e293b",
    iconBtnTo: "#0f172a",
    iconBtnShadow: "0 4px 12px rgba(0,0,0,0.15)",
    iconBtnText: "white",
    avatarGlow: "0 8px 24px rgba(124,58,237,0.25)",
    onlineBorder: "white",
    langBarShadow: "inset 0 1px 2px rgba(0,0,0,0.1)",
    gridColor: "rgba(0,0,0,0.1)",
    gridOpacity: 0.015,
    footerText: "rgba(148,163,184,0.6)",
    aiCardBg:
      "linear-gradient(135deg, rgba(238,242,255,0.9), rgba(224,231,255,0.9))",
    aiCardBorder: "rgba(199,210,254,0.6)",
    aiIconBg: "linear-gradient(135deg, #8b5cf6, #a78bfa)",
    yearCardBg: "rgba(248,250,252,0.80)",
    yearCardBorder: "rgba(226,232,240,0.6)",
    yearSelectedBg: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
    yearSelectedText: "white",
  },

  aurora: {
    bgFrom: "#020617",
    bgVia: "#0f172a",
    bgTo: "#020617",
    orb1: "rgba(37,99,235,0.10)",
    orb2: "rgba(124,58,237,0.08)",
    orb3: "rgba(8,145,178,0.08)",
    orb4: "rgba(79,70,229,0.06)",
    glassSubtleBg: "rgba(30,41,59,0.40)",
    glassMediumBg: "rgba(30,41,59,0.50)",
    glassStrongBg: "rgba(30,41,59,0.60)",
    glassSubtleBorder: "rgba(51,65,85,0.30)",
    glassMediumBorder: "rgba(51,65,85,0.40)",
    glassStrongBorder: "rgba(51,65,85,0.50)",
    textPrimary: "#e2e8f0",
    textSecondary: "#94a3b8",
    textMuted: "#64748b",
    textAccent: "#a78bfa",
    headerBg: "rgba(15,23,42,0.60)",
    headerBorder: "rgba(51,65,85,0.50)",
    glowViolet:
      "0 8px 32px rgba(124,58,237,0.12), inset 0 1px 0 rgba(255,255,255,0.05)",
    glowBlue:
      "0 8px 32px rgba(59,130,246,0.12), inset 0 1px 0 rgba(255,255,255,0.05)",
    glowCyan:
      "0 8px 32px rgba(6,182,212,0.12), inset 0 1px 0 rgba(255,255,255,0.05)",
    glowNeutral:
      "0 8px 32px rgba(0,0,0,0.30), inset 0 1px 0 rgba(255,255,255,0.05)",
    progressBg: "rgba(51,65,85,0.50)",
    progressGlow: "0 0 12px rgba(124,58,237,0.4)",
    statusGreen: "#34d399",
    statusYellow: "#fbbf24",
    statusRed: "#f87171",
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
    alertDangerBg: "rgba(239,68,68,0.10)",
    alertDangerBorder: "rgba(239,68,68,0.20)",
    alertDangerText: "#f87171",
    alertWarningBg: "rgba(245,158,11,0.10)",
    alertWarningBorder: "rgba(245,158,11,0.20)",
    alertWarningText: "#fbbf24",
    cardBg: "rgba(30,41,59,0.40)",
    cardBorder: "rgba(51,65,85,0.40)",
    cardHoverBg: "rgba(30,41,59,0.60)",
    expandedBg: "rgba(30,41,59,0.40)",
    expandedBorder: "rgba(139,92,246,0.50)",
    btnSecondaryBg: "rgba(51,65,85,0.60)",
    btnSecondaryText: "#e2e8f0",
    btnSecondaryBorder: "rgba(71,85,105,0.50)",
    btnPrimaryBg: "linear-gradient(to right, #7c3aed, #8b5cf6)",
    btnPrimaryText: "white",
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
    searchBg: "rgba(30,41,59,0.60)",
    searchBorder: "rgba(51,65,85,0.50)",
    searchText: "#94a3b8",
    searchBtnBg: "rgba(51,65,85,0.80)",
    searchBtnText: "#e2e8f0",
    toggleActiveBg: "rgba(15,23,42,0.80)",
    toggleActiveText: "#e2e8f0",
    toggleInactiveBg: "transparent",
    toggleInactiveText: "#94a3b8",
    selectBg: "rgba(30,41,59,0.60)",
    selectBorder: "rgba(51,65,85,0.50)",
    selectText: "#e2e8f0",
    iconBtnFrom: "#334155",
    iconBtnTo: "#1e293b",
    iconBtnShadow: "0 4px 12px rgba(0,0,0,0.30)",
    iconBtnText: "#e2e8f0",
    avatarGlow: "0 8px 24px rgba(124,58,237,0.25)",
    onlineBorder: "#0f172a",
    langBarShadow: "0 0 8px rgba(124,58,237,0.15)",
    gridColor: "rgba(255,255,255,0.05)",
    gridOpacity: 0.02,
    footerText: "#64748b",
    aiCardBg:
      "linear-gradient(135deg, rgba(91,33,182,0.15), rgba(59,130,246,0.15))",
    aiCardBorder: "rgba(139,92,246,0.30)",
    aiIconBg: "linear-gradient(135deg, #7c3aed, #8b5cf6)",
    yearCardBg: "rgba(30,41,59,0.50)",
    yearCardBorder: "rgba(51,65,85,0.40)",
    yearSelectedBg: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
    yearSelectedText: "white",
  },

  glass: {
    bgFrom: "#0f172a",
    bgVia: "#581c87",
    bgTo: "#0f172a",
    orb1: "rgba(168,85,247,0.30)",
    orb2: "rgba(59,130,246,0.20)",
    orb3: "rgba(236,72,153,0.20)",
    orb4: "rgba(6,182,212,0.20)",
    orb5: "rgba(139,92,246,0.10)",
    glassSubtleBg: "rgba(255,255,255,0.10)",
    glassMediumBg: "rgba(255,255,255,0.15)",
    glassStrongBg: "rgba(255,255,255,0.25)",
    glassSubtleBorder: "rgba(255,255,255,0.10)",
    glassMediumBorder: "rgba(255,255,255,0.20)",
    glassStrongBorder: "rgba(255,255,255,0.30)",
    textPrimary: "rgba(255,255,255,0.90)",
    textSecondary: "rgba(255,255,255,0.60)",
    textMuted: "rgba(255,255,255,0.40)",
    textAccent: "#c4b5fd",
    headerBg: "rgba(255,255,255,0.05)",
    headerBorder: "rgba(255,255,255,0.10)",
    glowViolet: "0 8px 32px rgba(147,51,234,0.30)",
    glowBlue: "0 8px 32px rgba(59,130,246,0.30)",
    glowCyan: "0 8px 32px rgba(6,182,212,0.25)",
    glowNeutral: "0 8px 32px rgba(0,0,0,0.12)",
    progressBg: "rgba(255,255,255,0.10)",
    progressGlow: "0 0 16px rgba(147,51,234,0.4)",
    statusGreen: "#34d399",
    statusYellow: "#fbbf24",
    statusRed: "#fb7185",
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
    alertDangerBg: "rgba(251,113,133,0.10)",
    alertDangerBorder: "rgba(251,113,133,0.20)",
    alertDangerText: "#fda4af",
    alertWarningBg: "rgba(251,191,36,0.10)",
    alertWarningBorder: "rgba(251,191,36,0.20)",
    alertWarningText: "#fcd34d",
    cardBg: "rgba(255,255,255,0.05)",
    cardBorder: "rgba(255,255,255,0.10)",
    cardHoverBg: "rgba(255,255,255,0.07)",
    expandedBg: "rgba(255,255,255,0.05)",
    expandedBorder: "rgba(167,139,250,0.50)",
    btnSecondaryBg: "rgba(255,255,255,0.10)",
    btnSecondaryText: "rgba(255,255,255,0.80)",
    btnSecondaryBorder: "rgba(255,255,255,0.20)",
    btnPrimaryBg: "linear-gradient(to right, #8b5cf6, #a855f7)",
    btnPrimaryText: "white",
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
    searchBg: "rgba(255,255,255,0.10)",
    searchBorder: "rgba(255,255,255,0.10)",
    searchText: "rgba(255,255,255,0.70)",
    searchBtnBg: "linear-gradient(135deg, #8b5cf6, #a855f7)",
    searchBtnText: "white",
    toggleActiveBg: "rgba(255,255,255,0.20)",
    toggleActiveText: "white",
    toggleInactiveBg: "transparent",
    toggleInactiveText: "rgba(255,255,255,0.60)",
    selectBg: "rgba(255,255,255,0.10)",
    selectBorder: "rgba(255,255,255,0.15)",
    selectText: "rgba(255,255,255,0.90)",
    iconBtnFrom: "#8b5cf6",
    iconBtnTo: "#9333ea",
    iconBtnShadow: "0 0 12px rgba(147,51,234,0.50)",
    iconBtnText: "white",
    avatarGlow: "0 0 24px rgba(147,51,234,0.50)",
    onlineBorder: "#0f172a",
    langBarShadow: "0 0 12px rgba(147,51,234,0.30)",
    gridColor: "rgba(255,255,255,0.05)",
    gridOpacity: 0.03,
    footerText: "rgba(255,255,255,0.30)",
    aiCardBg:
      "linear-gradient(135deg, rgba(139,92,246,0.20), rgba(59,130,246,0.15))",
    aiCardBorder: "rgba(167,139,250,0.30)",
    aiIconBg: "linear-gradient(135deg, #a855f7, #8b5cf6)",
    yearCardBg: "rgba(255,255,255,0.05)",
    yearCardBorder: "rgba(255,255,255,0.10)",
    yearSelectedBg: "linear-gradient(135deg, #8b5cf6, #a855f7)",
    yearSelectedText: "white",
  },
} as const;

// ========================================
// HELPER FUNCTIONS
// ========================================

/**
 * Converts repository status to indicator status type
 */
const getStatusType = (status: RepoStatus): StatusType => STATUS_MAP[status];

/**
 * Creates glow map for GlassCard component
 */
const createGlowMap = (t: ThemeStyles): Record<GlowType, string> => ({
  blue: t.glowBlue,
  violet: t.glowViolet,
  purple: t.glowViolet,
  cyan: t.glowCyan,
});

/**
 * Creates background map for GlassCard component
 */
const createBgMap = (t: ThemeStyles): Record<GlassIntensity, string> => ({
  subtle: t.glassSubtleBg,
  medium: t.glassMediumBg,
  strong: t.glassStrongBg,
});

/**
 * Creates border map for GlassCard component
 */
const createBorderMap = (t: ThemeStyles): Record<GlassIntensity, string> => ({
  subtle: t.glassSubtleBorder,
  medium: t.glassMediumBorder,
  strong: t.glassStrongBorder,
});

/**
 * Gets metric colors for a given color scheme
 */
const getMetricColors = (
  color: MetricColor,
  t: ThemeStyles,
  isGlass: boolean,
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

// ========================================
// GLASS CARD COMPONENT
// ========================================

const GlassCard: FC<GlassCardProps> = ({
  children,
  className = "",
  intensity = "medium",
  glow = null,
}) => {
  const { theme } = useTheme();
  const t = themeStyles[theme];

  const bgMap = createBgMap(t);
  const borderMap = createBorderMap(t);
  const glowMap = createGlowMap(t);

  const shadowValue = glow !== null ? glowMap[glow] : t.glowNeutral;

  return (
    <div
      className={`rounded-2xl border transition-all duration-300 ${className}`}
      style={{
        background: bgMap[intensity],
        borderColor: borderMap[intensity],
        backdropFilter: `blur(${BLUR_VALUES[intensity]})`,
        WebkitBackdropFilter: `blur(${BLUR_VALUES[intensity]})`,
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

const GlassProgress: FC<GlassProgressProps> = ({
  value,
  gradient = "from-blue-500 to-violet-500",
  className = "",
  height = "h-2",
}) => {
  const { theme } = useTheme();
  const t = themeStyles[theme];

  return (
    <div
      className={`${height} overflow-hidden rounded-full transition-all duration-300 ${className}`}
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
// STATUS INDICATOR COMPONENT
// ========================================

const StatusIndicator: FC<StatusIndicatorProps> = ({
  type,
  size = "normal",
}) => {
  const { theme } = useTheme();
  const t = themeStyles[theme];

  const colors: Record<StatusType, string> = {
    green: t.statusGreen,
    yellow: t.statusYellow,
    red: t.statusRed,
  };

  const sizeClass = size === "large" ? "w-4 h-4" : "w-2.5 h-2.5";

  return (
    <div
      className={`${sizeClass} flex items-center justify-center rounded-full transition-all duration-300`}
      style={{ backgroundColor: colors[type], boxShadow: STATUS_GLOWS[type] }}
    >
      {size === "large" && (
        <span className="text-xs text-white">{STATUS_SYMBOLS[type]}</span>
      )}
    </div>
  );
};

// ========================================
// BADGE COMPONENT
// ========================================

const GlassBadge: FC<GlassBadgeProps> = ({ children, variant = "default" }) => {
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
    danger: {
      bg: t.badgeDangerBg,
      text: t.badgeDangerText,
      border: t.badgeDangerBorder,
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
      className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium backdrop-blur-sm transition-all duration-300"
      style={{
        backgroundColor: v.bg,
        color: v.text,
        borderColor: v.border || "transparent",
      }}
    >
      {children}
    </span>
  );
};

// ========================================
// STATIC DATA
// ========================================

const LANGUAGES: readonly LanguageData[] = [
  { name: "TypeScript", percent: 56, color: "bg-blue-500" },
  { name: "HTML", percent: 22, color: "bg-orange-500" },
  { name: "JavaScript", percent: 13, color: "bg-yellow-400" },
  { name: "Python", percent: 7, color: "bg-emerald-500" },
] as const;

const REPOS: readonly RepoData[] = [
  {
    name: "Wildhaven-website",
    status: "good",
    stars: 1,
    commits: 240,
    contribution: 75,
    langs: [
      { name: "JS", percent: 88, color: "bg-yellow-400" },
      { name: "Shell", percent: 11, color: "bg-emerald-500" },
    ],
  },
  {
    name: "study",
    status: "warning",
    stars: 2,
    commits: 177,
    contribution: 100,
    langs: [
      { name: "Python", percent: 92, color: "bg-emerald-500" },
      { name: "C", percent: 5, color: "bg-slate-500" },
    ],
    issues: ["Uneven activity (3 burst days)"],
  },
  {
    name: "bot-scripts",
    status: "critical",
    stars: 0,
    commits: 89,
    contribution: 100,
    langs: [{ name: "Python", percent: 100, color: "bg-emerald-500" }],
    issues: [
      "Empty commits (avg 3 lines/commit)",
      "Burst: 67 commits on Oct 15",
    ],
  },
  {
    name: "portfolio",
    status: "good",
    stars: 0,
    commits: 134,
    contribution: 100,
    langs: [
      { name: "TypeScript", percent: 78, color: "bg-blue-500" },
      { name: "CSS", percent: 22, color: "bg-purple-500" },
    ],
  },
  {
    name: "git-course",
    status: "good",
    stars: 2,
    commits: 150,
    contribution: 100,
    langs: [{ name: "C++", percent: 100, color: "bg-pink-500" }],
  },
] as const;

const YEARS: readonly YearData[] = [
  { year: 2025, emoji: "🔥", label: "Peak", commits: 629, progress: 70 },
  { year: 2024, emoji: "📈", label: "Growth", commits: 901, progress: 100 },
  { year: 2023, emoji: "🌱", label: "Start", commits: 712, progress: 79 },
] as const;

const METRICS: readonly MetricData[] = [
  { label: "Regularity", value: 84, color: "emerald" },
  { label: "Impact", value: 45, color: "amber" },
  { label: "Diversity", value: 78, color: "blue" },
  { label: "Collaboration", value: 12, color: "red" },
] as const;

// ========================================
// MAIN CONTENT COMPONENT
// ========================================

const GitHubAnalyticsContent: FC = () => {
  const { theme, cycleTheme } = useTheme();
  const t = themeStyles[theme];

  const [flagsExpanded, setFlagsExpanded] = useState(false);
  const [showFlaggedOnly, setShowFlaggedOnly] = useState(false);
  const [expandedRepo, setExpandedRepo] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>("your");

  const filteredRepos = showFlaggedOnly
    ? REPOS.filter((r) => r.status !== "good")
    : REPOS;

  const nextThemeIndex = (THEMES.indexOf(theme) + 1) % THEMES.length;
  const nextTheme = THEMES[nextThemeIndex];
  const NextIcon = THEME_CONFIG[nextTheme].icon;

  const handleFlagsToggle = (): void => {
    const newExpanded = !flagsExpanded;
    setFlagsExpanded(newExpanded);
    setShowFlaggedOnly(newExpanded);
  };

  const handleShowAll = (): void => {
    setShowFlaggedOnly(false);
    setFlagsExpanded(false);
  };

  const handleRepoClick = (idx: number): void => {
    setExpandedRepo(expandedRepo === idx ? null : idx);
  };

  const isGlassTheme = theme === "glass";

  return (
    <div className="min-h-screen overflow-x-hidden font-sans">
      {/* Background */}
      <div
        className="fixed inset-0 transition-all duration-500"
        style={{
          background: `linear-gradient(to bottom right, ${t.bgFrom}, ${t.bgVia}, ${t.bgTo})`,
        }}
      >
        {/* Floating Orbs */}
        <div
          className="absolute top-20 -left-20 h-72 w-72 rounded-full blur-3xl transition-all duration-500"
          style={{
            background: t.orb1,
            animation: isGlassTheme
              ? "pulse 4s ease-in-out infinite"
              : undefined,
          }}
        />
        <div
          className="absolute top-1/3 -right-20 h-96 w-96 rounded-full blur-3xl transition-all duration-500"
          style={{ background: t.orb2 }}
        />
        <div
          className="absolute bottom-20 left-1/4 h-64 w-64 rounded-full blur-3xl transition-all duration-500"
          style={{
            background: t.orb3,
            animation: isGlassTheme
              ? "pulse 4s ease-in-out infinite 1s"
              : undefined,
          }}
        />
        <div
          className="absolute right-1/4 bottom-1/3 h-48 w-48 rounded-full blur-3xl transition-all duration-500"
          style={{ background: t.orb4 }}
        />
        {isGlassTheme && t.orb5 !== undefined && (
          <div
            className="absolute top-1/2 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl transition-all duration-500"
            style={{ background: t.orb5 }}
          />
        )}

        {/* Grid overlay */}
        <div
          className="absolute inset-0 transition-opacity duration-500"
          style={{
            backgroundImage: `linear-gradient(${t.gridColor} 1px, transparent 1px), linear-gradient(90deg, ${t.gridColor} 1px, transparent 1px)`,
            backgroundSize: "32px 32px",
            opacity: t.gridOpacity,
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 p-4">
        <div className="mx-auto max-w-7xl space-y-4">
          {/* Header Nav */}
          <header
            className="sticky top-0 z-50 rounded-xl border-b px-4 py-3 backdrop-blur-xl transition-all duration-300"
            style={{ background: t.headerBg, borderColor: t.headerBorder }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  className="flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-300"
                  style={{
                    background: `linear-gradient(135deg, ${t.iconBtnFrom}, ${t.iconBtnTo})`,
                    boxShadow: t.iconBtnShadow,
                  }}
                >
                  <Github
                    className="h-5 w-5"
                    style={{ color: t.iconBtnText }}
                  />
                </button>
                <span
                  className="text-lg font-semibold"
                  style={{ color: t.textPrimary }}
                >
                  User Analytics
                </span>

                <div className="ml-4 flex">
                  <input
                    type="text"
                    value="Yhooi2"
                    readOnly
                    className="w-48 rounded-l-lg border-r-0 px-3 py-1.5 text-sm transition-all duration-300"
                    style={{
                      background: t.searchBg,
                      borderColor: t.searchBorder,
                      color: t.textPrimary,
                      borderWidth: "1px",
                      borderStyle: "solid",
                    }}
                  />
                  <button
                    type="button"
                    className="flex items-center gap-2 rounded-r-lg px-4 py-1.5 text-sm font-medium transition-all duration-300"
                    style={{
                      background: t.searchBtnBg,
                      color: t.searchBtnText,
                    }}
                  >
                    <Search className="h-4 w-4" />
                    Search
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={cycleTheme}
                  className="rounded-lg p-2 backdrop-blur-sm transition-all duration-300 hover:scale-105"
                  style={{
                    background: t.glassSubtleBg,
                    border: `1px solid ${t.glassSubtleBorder}`,
                  }}
                  title={`Switch to ${THEME_CONFIG[nextTheme].label} theme`}
                >
                  <NextIcon
                    className="h-5 w-5"
                    style={{ color: t.textSecondary }}
                  />
                </button>

                <button
                  type="button"
                  className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm transition-all duration-300"
                  style={{
                    background: t.btnSecondaryBg,
                    color: t.btnSecondaryText,
                    border: `1px solid ${t.btnSecondaryBorder}`,
                  }}
                >
                  <Github className="h-4 w-4" />
                  Sign in with GitHub
                </button>
              </div>
            </div>
          </header>

          {/* Profile Header */}
          <GlassCard className="p-5" intensity="strong" glow="violet">
            <div className="flex gap-6">
              {/* Left: Profile Info */}
              <div className="flex-1">
                <div className="flex gap-4">
                  <div
                    className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 via-violet-500 to-indigo-500 text-xl font-bold text-white transition-all duration-300"
                    style={{ boxShadow: t.avatarGlow }}
                  >
                    AS
                  </div>
                  <div>
                    <h1
                      className="text-xl font-bold"
                      style={{ color: t.textPrimary }}
                    >
                      Artem Safronov
                    </h1>
                    <div
                      className="mt-0.5 flex items-center gap-2 text-sm"
                      style={{ color: t.textSecondary }}
                    >
                      <a
                        href="#"
                        className="flex items-center gap-1 hover:underline"
                        style={{ color: t.textAccent }}
                      >
                        @Yhooi2 <ExternalLink className="h-3 w-3" />
                      </a>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" /> Joined Jan 2023
                      </span>
                    </div>
                    <div
                      className="mt-2 flex items-center gap-4 text-sm"
                      style={{ color: t.textSecondary }}
                    >
                      <span className="flex items-center gap-1">
                        <FolderGit2
                          className="h-4 w-4"
                          style={{ color: t.textAccent }}
                        />{" "}
                        11 repos
                      </span>
                      <span className="flex items-center gap-1">
                        <Users
                          className="h-4 w-4"
                          style={{ color: t.textAccent }}
                        />{" "}
                        1 follower
                      </span>
                      <span className="flex items-center gap-1">
                        <User
                          className="h-4 w-4"
                          style={{ color: t.textAccent }}
                        />{" "}
                        5 following
                      </span>
                    </div>
                  </div>
                </div>

                {/* Language Bar */}
                <div className="mt-4 flex items-center gap-3">
                  <div
                    className="flex h-2.5 flex-1 overflow-hidden rounded-full transition-all duration-300"
                    style={{ boxShadow: t.langBarShadow }}
                  >
                    {LANGUAGES.map((lang, i) => (
                      <div
                        key={lang.name}
                        className={`${lang.color} transition-all duration-300`}
                        style={{ width: `${lang.percent}%` }}
                      />
                    ))}
                  </div>
                  <div
                    className="flex items-center gap-3 text-xs"
                    style={{ color: t.textSecondary }}
                  >
                    {LANGUAGES.map((lang) => (
                      <span key={lang.name} className="flex items-center gap-1">
                        <span
                          className={`h-2 w-2 rounded-full ${lang.color}`}
                        />
                        {lang.name} {lang.percent}%
                      </span>
                    ))}
                    <span style={{ color: t.textMuted }}>+4</span>
                  </div>
                </div>
              </div>

              {/* Right: AI Summary CTA */}
              <div
                className="w-64 rounded-xl p-4 transition-all duration-300"
                style={{
                  background: t.aiCardBg,
                  border: `1px solid ${t.aiCardBorder}`,
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                }}
              >
                <div
                  className="mb-2 flex items-center gap-2 text-sm font-semibold"
                  style={{ color: t.textAccent }}
                >
                  <Sparkles className="h-4 w-4" /> AI Summary
                </div>
                <p className="mb-2 text-xs" style={{ color: t.textSecondary }}>
                  Get comprehensive analysis:
                </p>
                <ul
                  className="mb-3 space-y-0.5 text-xs"
                  style={{ color: t.textMuted }}
                >
                  <li className="flex items-center gap-1">
                    <Check
                      className="h-3 w-3"
                      style={{ color: t.statusGreen }}
                    />{" "}
                    Code quality assessment
                  </li>
                  <li className="flex items-center gap-1">
                    <Check
                      className="h-3 w-3"
                      style={{ color: t.statusGreen }}
                    />{" "}
                    Architecture patterns
                  </li>
                  <li className="flex items-center gap-1">
                    <Check
                      className="h-3 w-3"
                      style={{ color: t.statusGreen }}
                    />{" "}
                    Best practices
                  </li>
                </ul>
                <button
                  type="button"
                  className="flex w-full items-center justify-center gap-2 rounded-lg py-2 text-sm font-medium transition-all duration-300 hover:scale-[1.02]"
                  style={{
                    background: t.btnPrimaryBg,
                    color: t.btnPrimaryText,
                    boxShadow: "0 4px 12px rgba(139,92,246,0.3)",
                  }}
                >
                  <Zap className="h-4 w-4" /> Generate Report
                </button>
                <p
                  className="mt-2 flex items-center justify-center gap-1 text-center text-xs"
                  style={{ color: t.textMuted }}
                >
                  <Clock className="h-3 w-3" /> ~30 seconds
                </p>
              </div>
            </div>
          </GlassCard>

          {/* Trust Score */}
          <GlassCard className="p-5" intensity="strong" glow="cyan">
            <div className="mb-3 flex items-center justify-between">
              <h2
                className="flex items-center gap-2 font-semibold"
                style={{ color: t.textPrimary }}
              >
                <Target className="h-5 w-5" style={{ color: t.textAccent }} />
                Overall Trust Score
              </h2>
              <div className="flex items-center gap-2">
                <span className="bg-gradient-to-r from-amber-400 via-emerald-400 to-cyan-400 bg-clip-text text-3xl font-bold text-transparent">
                  72
                </span>
                <span className="text-lg" style={{ color: t.textMuted }}>
                  / 100
                </span>
              </div>
            </div>

            <GlassProgress
              value={72}
              gradient="from-amber-400 via-yellow-400 via-emerald-400 to-cyan-500"
              className="mb-5"
              height="h-3"
            />

            <div className="grid grid-cols-4 gap-4">
              {METRICS.map((m) => {
                const colors = getMetricColors(m.color, t, isGlassTheme);
                return (
                  <div
                    key={m.label}
                    className="rounded-xl border p-3 transition-all duration-300"
                    style={{
                      backgroundColor: colors.bg,
                      borderColor: colors.border || "transparent",
                      boxShadow: isGlassTheme ? colors.glow : "none",
                    }}
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <span
                        className="text-sm"
                        style={{ color: t.textSecondary }}
                      >
                        {m.label}
                      </span>
                      <span
                        className="text-lg font-bold"
                        style={{
                          color: colors.text,
                          textShadow: isGlassTheme ? colors.glow : "none",
                        }}
                      >
                        {m.value}%
                      </span>
                    </div>
                    <GlassProgress
                      value={m.value}
                      gradient={colors.gradient}
                      height="h-1.5"
                    />
                  </div>
                );
              })}
            </div>
          </GlassCard>

          {/* Main Grid */}
          <div className="grid grid-cols-12 gap-4">
            {/* Left: Flags & Stats */}
            <div className="col-span-5 space-y-4">
              {/* Flags */}
              <GlassCard intensity="medium">
                <button
                  type="button"
                  onClick={handleFlagsToggle}
                  className="flex w-full items-center justify-between rounded-2xl p-4 transition-colors duration-300"
                  style={{ color: t.textPrimary }}
                >
                  <div className="flex items-center gap-2">
                    <AlertTriangle
                      className="h-5 w-5"
                      style={{ color: t.statusYellow }}
                    />
                    <span className="font-medium">2 flags detected</span>
                  </div>
                  {flagsExpanded ? (
                    <ChevronUp
                      className="h-5 w-5"
                      style={{ color: t.textMuted }}
                    />
                  ) : (
                    <ChevronDown
                      className="h-5 w-5"
                      style={{ color: t.textMuted }}
                    />
                  )}
                </button>

                {flagsExpanded && (
                  <div className="space-y-2 px-4 pb-4">
                    <div
                      className="rounded-xl border p-3 transition-all duration-300"
                      style={{
                        background: t.alertDangerBg,
                        borderColor: t.alertDangerBorder,
                      }}
                    >
                      <div
                        className="flex items-center gap-2 text-sm font-medium"
                        style={{ color: t.alertDangerText }}
                      >
                        <StatusIndicator type="red" />
                        No collaboration
                      </div>
                      <p
                        className="mt-1 ml-5 text-xs"
                        style={{ color: `${t.alertDangerText}99` }}
                      >
                        0 PRs to external repos · 0 code reviews
                      </p>
                    </div>
                    <div
                      className="rounded-xl border p-3 transition-all duration-300"
                      style={{
                        background: t.alertWarningBg,
                        borderColor: t.alertWarningBorder,
                      }}
                    >
                      <div
                        className="flex items-center gap-2 text-sm font-medium"
                        style={{ color: t.alertWarningText }}
                      >
                        <StatusIndicator type="yellow" />
                        Burst activity pattern
                      </div>
                      <p
                        className="mt-1 ml-5 text-xs"
                        style={{ color: `${t.alertWarningText}99` }}
                      >
                        3 days with 50+ commits · Uneven distribution
                      </p>
                    </div>
                  </div>
                )}
              </GlassCard>

              {/* Career Stats */}
              <GlassCard className="p-4" intensity="medium">
                <div className="mb-1 flex items-center justify-between">
                  <h3
                    className="flex items-center gap-2 font-semibold"
                    style={{ color: t.textPrimary }}
                  >
                    <TrendingUp
                      className="h-5 w-5"
                      style={{ color: t.textAccent }}
                    />
                    Career Stats
                  </h3>
                </div>
                <p
                  className="mb-4 flex items-center gap-2 text-sm"
                  style={{ color: t.textSecondary }}
                >
                  <Code className="h-4 w-4" /> 2,242 commits ·{" "}
                  <GitPullRequest className="h-4 w-4" /> 47 PRs ·{" "}
                  <FolderGit2 className="h-4 w-4" /> 11 repos
                </p>

                {YEARS.map((y) => (
                  <div
                    key={y.year}
                    className="mb-3 rounded-xl border p-3 transition-all duration-300"
                    style={{
                      background: t.yearCardBg,
                      borderColor: t.yearCardBorder,
                    }}
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className="font-semibold"
                          style={{ color: t.textPrimary }}
                        >
                          {y.year}
                        </span>
                        <GlassBadge>
                          {y.emoji} {y.label}
                        </GlassBadge>
                      </div>
                      <span
                        className="flex items-center gap-1 text-sm"
                        style={{ color: t.textSecondary }}
                      >
                        {y.commits}
                        <ChevronDown className="h-4 w-4" />
                      </span>
                    </div>
                    <GlassProgress
                      value={y.progress}
                      gradient="from-blue-400 to-violet-500"
                      height="h-1.5"
                    />
                  </div>
                ))}
              </GlassCard>
            </div>

            {/* Right: Projects */}
            <div className="col-span-7">
              <GlassCard className="p-4" intensity="medium">
                <div className="mb-3 flex items-center justify-between">
                  <div
                    className="flex items-center gap-2"
                    style={{ color: t.textPrimary }}
                  >
                    {showFlaggedOnly ? (
                      <>
                        <AlertTriangle
                          className="h-5 w-5"
                          style={{ color: t.statusYellow }}
                        />
                        <span className="font-semibold">Flagged Projects</span>
                      </>
                    ) : (
                      <>
                        <FolderGit2
                          className="h-5 w-5"
                          style={{ color: t.textAccent }}
                        />
                        <span className="font-semibold">All Projects</span>
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {showFlaggedOnly && (
                      <button
                        type="button"
                        onClick={handleShowAll}
                        className="text-sm transition-colors duration-300 hover:underline"
                        style={{ color: t.textAccent }}
                      >
                        ← Show all
                      </button>
                    )}
                    <GlassBadge>{filteredRepos.length} repos</GlassBadge>
                  </div>
                </div>

                <div className="mb-3 flex items-center gap-2">
                  <select
                    className="rounded-lg border px-2 py-1.5 text-sm transition-all duration-300"
                    style={{
                      background: t.selectBg,
                      borderColor: t.selectBorder,
                      color: t.selectText,
                      backdropFilter: "blur(8px)",
                      WebkitBackdropFilter: "blur(8px)",
                    }}
                  >
                    <option>Sort: Commits ↓</option>
                  </select>
                  <div
                    className="flex overflow-hidden rounded-lg text-sm transition-all duration-300"
                    style={{ border: `1px solid ${t.glassSubtleBorder}` }}
                  >
                    <button
                      type="button"
                      onClick={() => setActiveTab("your")}
                      className="px-3 py-1.5 transition-all duration-300"
                      style={{
                        background:
                          activeTab === "your"
                            ? t.toggleActiveBg
                            : t.toggleInactiveBg,
                        color:
                          activeTab === "your"
                            ? t.toggleActiveText
                            : t.toggleInactiveText,
                      }}
                    >
                      Your
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab("contrib")}
                      className="px-3 py-1.5 transition-all duration-300"
                      style={{
                        background:
                          activeTab === "contrib"
                            ? t.toggleActiveBg
                            : t.toggleInactiveBg,
                        color:
                          activeTab === "contrib"
                            ? t.toggleActiveText
                            : t.toggleInactiveText,
                      }}
                    >
                      Contrib
                    </button>
                  </div>
                </div>

                <div className="max-h-[400px] space-y-2 overflow-y-auto pr-1">
                  {filteredRepos.map((repo, idx) => (
                    <div
                      key={repo.name}
                      className="cursor-pointer rounded-xl border p-3 transition-all duration-300"
                      style={{
                        background:
                          expandedRepo === idx ? t.cardHoverBg : t.cardBg,
                        borderColor: t.cardBorder,
                      }}
                      onClick={() => handleRepoClick(idx)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          handleRepoClick(idx);
                        }
                      }}
                      role="button"
                      tabIndex={0}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span
                            className="font-medium"
                            style={{ color: t.textPrimary }}
                          >
                            {repo.name}
                          </span>
                          <StatusIndicator
                            type={getStatusType(repo.status)}
                            size="large"
                          />
                          {repo.stars > 0 && (
                            <span
                              className="flex items-center gap-0.5 text-xs"
                              style={{ color: t.textMuted }}
                            >
                              <Star className="h-3 w-3 fill-current" />
                              {repo.stars}
                            </span>
                          )}
                        </div>
                        <span
                          className="flex items-center gap-1 text-sm"
                          style={{ color: t.textSecondary }}
                        >
                          {repo.commits} commits
                          {expandedRepo === idx ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </span>
                      </div>
                      <div
                        className="mt-1.5 flex items-center gap-2 text-xs"
                        style={{ color: t.textSecondary }}
                      >
                        {repo.langs.map((l) => (
                          <span
                            key={l.name}
                            className="flex items-center gap-1"
                          >
                            <span
                              className={`h-2 w-2 rounded-full ${l.color}`}
                            />
                            {l.name} {l.percent}%
                          </span>
                        ))}
                        <span>·</span>
                        <span>{repo.contribution}% contribution</span>
                      </div>

                      {showFlaggedOnly && repo.issues !== undefined && (
                        <div
                          className="mt-2 pt-2"
                          style={{ borderTop: `1px solid ${t.cardBorder}` }}
                        >
                          <p
                            className="mb-1 text-xs"
                            style={{ color: t.textMuted }}
                          >
                            Issues:
                          </p>
                          {repo.issues.map((issue) => (
                            <p
                              key={issue}
                              className="text-xs"
                              style={{ color: t.alertDangerText }}
                            >
                              • {issue}
                            </p>
                          ))}
                        </div>
                      )}

                      {expandedRepo === idx && (
                        <div
                          className="mt-3 space-y-3 pt-3"
                          style={{ borderTop: `1px solid ${t.cardBorder}` }}
                        >
                          {repo.issues !== undefined && (
                            <div
                              className="rounded-lg border p-2"
                              style={{
                                background: t.alertDangerBg,
                                borderColor: t.alertDangerBorder,
                              }}
                            >
                              <p
                                className="mb-1 flex items-center gap-1 text-xs font-medium"
                                style={{ color: t.alertDangerText }}
                              >
                                <AlertTriangle className="h-3 w-3" /> Issues
                                detected
                              </p>
                              {repo.issues.map((issue) => (
                                <p
                                  key={issue}
                                  className="text-xs"
                                  style={{ color: `${t.alertDangerText}cc` }}
                                >
                                  • {issue}
                                </p>
                              ))}
                            </div>
                          )}
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <div
                              className="rounded-lg border p-2"
                              style={{
                                background: t.expandedBg,
                                borderColor: t.cardBorder,
                              }}
                            >
                              <p
                                className="text-xs"
                                style={{ color: t.textMuted }}
                              >
                                Your Contribution
                              </p>
                              <p
                                className="font-medium"
                                style={{ color: t.textPrimary }}
                              >
                                {repo.commits} commits
                              </p>
                              <p
                                className="text-xs"
                                style={{ color: t.textSecondary }}
                              >
                                {repo.contribution}% of project
                              </p>
                            </div>
                            <div
                              className="rounded-lg border p-2"
                              style={{
                                background: t.expandedBg,
                                borderColor: t.cardBorder,
                              }}
                            >
                              <p
                                className="text-xs"
                                style={{ color: t.textMuted }}
                              >
                                Full Project
                              </p>
                              <p
                                className="font-medium"
                                style={{ color: t.textPrimary }}
                              >
                                {repo.commits} commits
                              </p>
                              <p
                                className="text-xs"
                                style={{ color: t.textSecondary }}
                              >
                                1 contributor
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              className="flex flex-1 items-center justify-center gap-2 rounded-lg border py-2 text-sm transition-all duration-300"
                              style={{
                                background: t.btnSecondaryBg,
                                color: t.btnSecondaryText,
                                borderColor: t.btnSecondaryBorder,
                              }}
                            >
                              <Github className="h-4 w-4" /> GitHub
                            </button>
                            <button
                              type="button"
                              className="flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-sm font-medium transition-all duration-300 hover:scale-[1.02]"
                              style={{
                                background: t.btnPrimaryBg,
                                color: t.btnPrimaryText,
                                boxShadow: "0 4px 12px rgba(139,92,246,0.3)",
                              }}
                            >
                              <Sparkles className="h-4 w-4" /> AI Analysis
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </GlassCard>
            </div>
          </div>

          {/* Footer */}
          <footer
            className="py-6 text-center text-xs transition-colors duration-300"
            style={{ color: t.footerText }}
          >
            GitHub Analytics · {THEME_CONFIG[theme].label} Theme
          </footer>
        </div>
      </div>

      {/* CSS for pulse animation */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
      `}</style>
    </div>
  );
};

// ========================================
// MAIN EXPORT WITH THEME PROVIDER
// ========================================

const GitHubAnalyticsDesktop: FC = () => {
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
};

export default GitHubAnalyticsDesktop;

// ========================================
// NAMED EXPORTS FOR REUSABILITY
// ========================================

export {
  getMetricColors,
  getStatusType,
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
  BadgeStyleConfig,
  BadgeVariant,
  GlassBadgeProps,
  GlassCardProps,
  GlassIntensity,
  GlassProgressProps,
  GlowType,
  IndicatorSize,
  LanguageData,
  MetricColor,
  MetricColors,
  MetricData,
  RepoData,
  RepoLanguage,
  RepoStatus,
  StatusIndicatorProps,
  StatusType,
  TabType,
  ThemeConfig,
  ThemeContextValue,
  ThemeName,
  ThemeStyles,
  YearData,
};
