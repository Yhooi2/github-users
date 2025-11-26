import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

// ========================================
// THEME TYPES
// ========================================

export type ThemeName = "light" | "aurora" | "glass";

export type GlassIntensity = "subtle" | "medium" | "strong";

export type GlowType = "blue" | "violet" | "purple" | "cyan" | null;

export type StatusType = "green" | "yellow" | "red";

export type BadgeVariant =
  | "default"
  | "success"
  | "warning"
  | "primary"
  | "violet";

export type ButtonVariant = "primary" | "secondary" | "ghost";

export type ButtonSize = "sm" | "md" | "lg";

// ========================================
// THEME CONFIGURATION
// ========================================

export interface ThemeConfig {
  label: string;
  icon: LucideIcon;
}

export interface ThemeContextValue {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
  cycleTheme: () => void;
}

// ========================================
// THEME STYLES - Complete Token System
// ========================================

export interface ThemeStyles {
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

// ========================================
// COMPONENT PROPS
// ========================================

export interface GlassCardProps {
  children: ReactNode;
  className?: string;
  intensity?: GlassIntensity;
  glow?: GlowType;
  onClick?: () => void;
}

export interface GlassProgressProps {
  value: number;
  gradient?: string;
  className?: string;
  showGlow?: boolean;
}

export interface StatusIndicatorProps {
  type: StatusType;
  size?: "sm" | "md" | "lg";
  pulse?: boolean;
}

export interface GlassBadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  size?: "sm" | "md";
}

export interface BadgeStyleConfig {
  bg: string;
  text: string;
  border: string;
}

export interface GlassButtonProps {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: LucideIcon;
  iconPosition?: "left" | "right";
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  onClick?: () => void;
  className?: string;
}

export interface GlassInputProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  icon?: LucideIcon;
  disabled?: boolean;
  className?: string;
}

export interface GlassToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
}

export interface AvatarProps {
  initials: string;
  size?: "sm" | "md" | "lg" | "xl";
  online?: boolean;
  gradient?: string;
  className?: string;
}

export interface AlertProps {
  children: ReactNode;
  variant: "danger" | "warning" | "info";
  icon?: LucideIcon;
  title?: string;
  className?: string;
}

export interface MetricCardProps {
  label: string;
  value: number | string;
  variant: "emerald" | "amber" | "blue" | "red";
  className?: string;
}

export interface LanguageBarProps {
  languages: {
    name: string;
    percentage: number;
    color: string;
  }[];
  showLabels?: boolean;
  className?: string;
}

export interface ThemeToggleProps {
  showLabel?: boolean;
  className?: string;
}

// ========================================
// DATA INTERFACES
// ========================================

export interface YearData {
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

export interface RepoData {
  name: string;
  languages: string;
  commits: number;
  contribution: number;
  stars: number;
  flagType: StatusType;
  issues: string[];
  createdYear: number;
}

export interface MetricData {
  label: string;
  value: number;
  bg: string;
  text: string;
  border: string;
  glow?: string;
}

export interface StatData {
  icon: LucideIcon;
  color: string;
  value: string;
  label: string;
}

export interface LanguageData {
  name: string;
  pct: number;
  color: string;
}
