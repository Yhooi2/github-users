import { Search } from "lucide-react";
import React from "react";
import { useThemeStyles } from "../context/ThemeContext";
import type { GlassInputProps } from "../types";

/**
 * GlassInput Component
 *
 * A glassmorphism-styled text input with optional icon.
 * Perfect for search fields and forms.
 *
 * @example
 * ```tsx
 * <GlassInput
 *   placeholder="Search..."
 *   icon={Search}
 *   value={query}
 *   onChange={setQuery}
 * />
 * ```
 */
export const GlassInput: React.FC<GlassInputProps> = ({
  placeholder = "",
  value = "",
  onChange,
  icon: Icon = Search,
  disabled = false,
  className = "",
}) => {
  const t = useThemeStyles();

  return (
    <div
      className={`flex items-center rounded-xl border px-3 py-1.5 backdrop-blur-sm transition-all duration-300 ${className}`}
      style={{
        background: t.searchBg,
        borderColor: t.searchBorder,
      }}
    >
      {Icon && (
        <Icon
          className="mr-2 h-3.5 w-3.5 transition-colors duration-300"
          style={{ color: t.textMuted }}
        />
      )}
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        disabled={disabled}
        className="flex-1 bg-transparent text-sm transition-colors duration-300 outline-none placeholder:opacity-60"
        style={{ color: t.searchText }}
      />
    </div>
  );
};

export default GlassInput;
