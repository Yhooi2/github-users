// ========================================
// GITHUB ANALYTICS DESIGN SYSTEM
// Component Exports
// ========================================

// Core Glass Components
export { GlassBadge } from "./GlassBadge";
export { GlassButton } from "./GlassButton";
export { GlassCard } from "./GlassCard";
export { GlassInput } from "./GlassInput";
export { GlassProgress } from "./GlassProgress";
export { GlassSelect } from "./GlassSelect";
export { GlassToggle } from "./GlassToggle";

// Status & Metrics
export { LanguageBar } from "./LanguageBar";
export { MetricCard } from "./MetricCard";
export { StatusIndicator } from "./StatusIndicator";

// Display Components
export { Alert } from "./Alert";
export { Avatar } from "./Avatar";

// Layout Components
export { Background } from "./Background";
export { Header } from "./Header";

// Desktop Components
export { AIInsightsCard } from "./AIInsightsCard";
export { FlagAlert } from "./FlagAlert";
export { IconButton } from "./IconButton";
export { RepoCard } from "./RepoCard";
export { SearchBar } from "./SearchBar";
export { TabToggle } from "./TabToggle";
export { YearCard } from "./YearCard";

// Theme Components
export { ThemeToggle } from "./ThemeToggle";

// Context & Hooks
export {
  ThemeContext,
  ThemeProvider,
  useTheme,
  useThemeStyles,
} from "../context/ThemeContext";

// Tokens & Configuration
export { THEMES, THEME_CONFIG, themeStyles } from "../styles/tokens";

// Constants
export {
  STATUS_MAP,
  STATUS_SYMBOLS,
  STATUS_GLOWS,
  BLUR_VALUES,
} from "./constants";

// Helper Functions
export {
  getStatusType,
  getMetricColors,
  createGlowMap,
  createBgMap,
  createBorderMap,
} from "./helpers";

// Types - All exported from central types file
export type {
  // Theme types
  ThemeName,
  GlassIntensity,
  GlowType,
  StatusType,
  BadgeVariant,
  ButtonVariant,
  ButtonSize,
  // Desktop-specific types
  RepoStatus,
  MetricColor,
  TabType,
  IndicatorSize,
  // Theme configuration
  ThemeConfig,
  ThemeContextValue,
  ThemeStyles,
  // Component props - Core
  GlassCardProps,
  GlassProgressProps,
  GlassSelectProps,
  StatusIndicatorProps,
  GlassBadgeProps,
  BadgeStyleConfig,
  GlassButtonProps,
  GlassInputProps,
  GlassToggleProps,
  AvatarProps,
  AlertProps,
  MetricCardProps,
  LanguageBarProps,
  ThemeToggleProps,
  HeaderProps,
  BackgroundProps,
  // Component props - Desktop
  SearchBarProps,
  TabToggleProps,
  YearCardProps,
  RepoCardProps,
  AIInsightsCardProps,
  FlagAlertProps,
  IconButtonProps,
  // Data interfaces
  YearData,
  RepoData,
  RepoLanguage,
  MetricData,
  MetricColors,
  StatData,
  LanguageData,
} from "../types";
