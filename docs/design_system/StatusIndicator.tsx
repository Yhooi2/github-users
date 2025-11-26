import React from "react";
import { useThemeStyles } from "../context/ThemeContext";
import type { StatusIndicatorProps, StatusType } from "../types";

/**
 * StatusIndicator Component
 *
 * A small circular indicator showing status (green/yellow/red) with glow effect.
 * Perfect for showing repository health, online status, or any traffic-light states.
 * Supports "large" size with symbols inside.
 *
 * @example
 * ```tsx
 * <StatusIndicator type="green" size="normal" />
 * <StatusIndicator type="red" size="large" />
 * ```
 */

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

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  type,
  size = "normal",
  pulse = false,
}) => {
  const t = useThemeStyles();

  const colors: Record<StatusType, string> = {
    green: t.statusGreen,
    yellow: t.statusYellow,
    red: t.statusRed,
  };

  const sizeClass = size === "large" ? "w-4 h-4" : "w-2.5 h-2.5";

  return (
    <div
      className={`${sizeClass} flex items-center justify-center rounded-full transition-all duration-300 ${pulse ? "animate-pulse" : ""}`}
      style={{
        backgroundColor: colors[type],
        boxShadow: STATUS_GLOWS[type],
      }}
      role="status"
      aria-label={`Status: ${type}`}
    >
      {size === "large" && (
        <span className="text-xs text-white">{STATUS_SYMBOLS[type]}</span>
      )}
    </div>
  );
};

export default StatusIndicator;
