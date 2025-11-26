import React from "react";
import { useThemeStyles } from "../context/ThemeContext";
import type { GlassSelectProps } from "../types";

/**
 * GlassSelect Component
 *
 * A glassmorphism-styled select dropdown.
 * Matches the desktop reference design exactly.
 *
 * @example
 * ```tsx
 * <GlassSelect
 *   value={sortBy}
 *   onChange={setSortBy}
 *   options={[
 *     { value: "commits", label: "Sort: Commits ↓" },
 *     { value: "stars", label: "Sort: Stars ↓" }
 *   ]}
 * />
 * ```
 */
export const GlassSelect: React.FC<GlassSelectProps> = ({
  value,
  onChange,
  options,
  className = "",
}) => {
  const t = useThemeStyles();

  return (
    <select
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      className={`rounded-lg border px-2 py-1.5 text-sm transition-all duration-300 ${className}`}
      style={{
        background: t.selectBg,
        borderColor: t.selectBorder,
        color: t.selectText,
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
      }}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default GlassSelect;
