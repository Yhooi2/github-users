import React from "react";
import { useThemeStyles } from "../context/ThemeContext";
import type { GlassCardProps, GlassIntensity } from "../types";

/**
 * GlassCard Component
 * 
 * A glassmorphism-styled card container with blur effects and optional glow.
 * Adapts to all three themes: Light, Aurora, and Glass.
 * 
 * @example
 * ```tsx
 * <GlassCard intensity="strong" glow="violet">
 *   <p>Card content</p>
 * </GlassCard>
 * ```
 */
export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = "",
  intensity = "medium",
  glow = null,
  onClick,
}) => {
  const t = useThemeStyles();

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

  const shadowValue = glow ? glowMap[glow] ?? t.glowNeutral : t.glowNeutral;

  return (
    <div
      className={`rounded-2xl border transition-all duration-300 ${onClick ? "cursor-pointer" : ""} ${className}`}
      style={{
        background: bgMap[intensity],
        borderColor: borderMap[intensity],
        backdropFilter: `blur(${blurMap[intensity]})`,
        WebkitBackdropFilter: `blur(${blurMap[intensity]})`,
        boxShadow: shadowValue,
      }}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default GlassCard;