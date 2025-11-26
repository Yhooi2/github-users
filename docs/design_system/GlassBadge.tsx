import React from "react";
import { useThemeStyles } from "../context/ThemeContext";
import type {
  BadgeStyleConfig,
  BadgeVariant,
  GlassBadgeProps,
} from "../types";

/**
 * GlassBadge Component
 *
 * A glassmorphism-styled badge/tag for labels, counts, and status indicators.
 * Available in multiple variants: default, success, warning, danger, primary, violet.
 *
 * @example
 * ```tsx
 * <GlassBadge variant="success">Active</GlassBadge>
 * <GlassBadge variant="warning">Pending</GlassBadge>
 * <GlassBadge variant="danger">Error</GlassBadge>
 * ```
 */
export const GlassBadge: React.FC<GlassBadgeProps> = ({
  children,
  variant = "default",
  size = "md",
}) => {
  const t = useThemeStyles();

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

  const sizeClasses = {
    sm: "px-1.5 py-0.5 text-[10px]",
    md: "px-2 py-0.5 text-xs",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border font-medium backdrop-blur-sm transition-all duration-300 ${sizeClasses[size]}`}
      style={{
        backgroundColor: v.bg,
        color: v.text,
        borderColor: v.border,
      }}
    >
      {children}
    </span>
  );
};

export default GlassBadge;
