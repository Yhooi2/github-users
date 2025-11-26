import React from "react";
import { useTheme, useThemeStyles } from "../context/ThemeContext";
import type { MetricCardProps } from "../types";

/**
 * MetricCard Component
 *
 * A compact card for displaying metrics with color-coded variants.
 * Features text glow effects in Glass theme.
 *
 * @example
 * ```tsx
 * <MetricCard label="Regularity" value={84} variant="emerald" />
 * ```
 */
export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  variant,
  className = "",
}) => {
  const { theme } = useTheme();
  const t = useThemeStyles();

  const variantConfig = {
    emerald: {
      bg: t.metricEmeraldBg,
      text: t.metricEmeraldText,
      border: t.metricEmeraldBorder,
      glow: t.metricEmeraldGlow,
    },
    amber: {
      bg: t.metricAmberBg,
      text: t.metricAmberText,
      border: t.metricAmberBorder,
      glow: t.metricAmberGlow,
    },
    blue: {
      bg: t.metricBlueBg,
      text: t.metricBlueText,
      border: t.metricBlueBorder,
      glow: t.metricBlueGlow,
    },
    red: {
      bg: t.metricRedBg,
      text: t.metricRedText,
      border: t.metricRedBorder,
      glow: t.metricRedGlow,
    },
  };

  const config = variantConfig[variant];

  return (
    <div
      className={`rounded-xl border p-2.5 text-center transition-all duration-300 ${className}`}
      style={{
        backgroundColor: config.bg,
        borderColor: config.border,
      }}
    >
      <div
        className="text-xl font-bold transition-all duration-300"
        style={{
          color: config.text,
          textShadow: theme === "glass" && config.glow ? config.glow : "none",
        }}
      >
        {value}
      </div>
      <div
        className="mt-0.5 text-[10px] font-medium tracking-wide uppercase transition-colors duration-300"
        style={{ color: t.textMuted }}
      >
        {label}
      </div>
    </div>
  );
};

export default MetricCard;
