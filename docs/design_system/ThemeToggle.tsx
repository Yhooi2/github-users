import React from "react";
import { useTheme, useThemeStyles } from "../context/ThemeContext";
import { THEME_CONFIG, THEMES } from "../styles/tokens";
import type { ThemeToggleProps } from "../types";

/**
 * ThemeToggle Component
 *
 * A button that cycles through all three themes: Light, Aurora, Glass.
 * Shows the current theme's icon and optionally its label.
 *
 * @example
 * ```tsx
 * <ThemeToggle showLabel />
 * ```
 */
export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  showLabel = false,
  className = "",
}) => {
  const { theme, cycleTheme } = useTheme();
  const t = useThemeStyles();

  const ThemeIcon = THEME_CONFIG[theme].icon;
  const nextTheme = THEMES[(THEMES.indexOf(theme) + 1) % THEMES.length];

  return (
    <button
      onClick={cycleTheme}
      className={`flex items-center gap-2 rounded-xl border transition-all duration-300 hover:opacity-80 ${
        showLabel ? "px-3 py-1.5" : "h-9 w-9 justify-center"
      } ${className}`}
      style={{
        background: t.searchBg,
        borderColor: t.searchBorder,
        color: t.toggleText,
      }}
      title={`Switch to ${THEME_CONFIG[nextTheme].label} theme`}
    >
      <ThemeIcon className="h-4 w-4" />
      {showLabel && (
        <span className="text-sm font-medium">{THEME_CONFIG[theme].label}</span>
      )}
    </button>
  );
};

export default ThemeToggle;
