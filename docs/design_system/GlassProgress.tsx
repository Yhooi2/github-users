import React from "react";
import { useThemeStyles } from "../context/ThemeContext";
import type { GlassProgressProps } from "../types";

/**
 * GlassProgress Component
 *
 * A glassmorphism-styled progress bar with gradient fill and optional glow effect.
 * Supports custom gradient classes and smooth animations.
 *
 * @example
 * ```tsx
 * <GlassProgress
 *   value={75}
 *   gradient="from-violet-500 to-purple-500"
 *   showGlow={true}
 * />
 * ```
 */
export const GlassProgress: React.FC<GlassProgressProps> = ({
  value,
  gradient = "from-blue-500 to-violet-500",
  className = "",
  height = "h-2",
  showGlow = true,
}) => {
  const t = useThemeStyles();

  // Clamp value between 0 and 100
  const clampedValue = Math.min(100, Math.max(0, value));

  return (
    <div
      className={`${height} overflow-hidden rounded-full transition-all duration-300 ${className}`}
      style={{ background: t.progressBg }}
      role="progressbar"
      aria-valuenow={clampedValue}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className={`h-full bg-gradient-to-r ${gradient} rounded-full transition-all duration-700`}
        style={{
          width: `${clampedValue}%`,
          boxShadow: showGlow ? t.progressGlow : "none",
        }}
      />
    </div>
  );
};

export default GlassProgress;
