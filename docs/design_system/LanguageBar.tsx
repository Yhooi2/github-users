import React from "react";
import { useThemeStyles } from "../context/ThemeContext";
import type { LanguageBarProps } from "../types";

/**
 * LanguageBar Component
 *
 * A horizontal bar showing language distribution with colors.
 * Features smooth transitions and theme-adaptive shadows.
 *
 * @example
 * ```tsx
 * <LanguageBar
 *   languages={[
 *     { name: "TypeScript", percentage: 56, color: "bg-blue-400" },
 *     { name: "HTML", percentage: 22, color: "bg-orange-400" },
 *   ]}
 *   showLabels
 * />
 * ```
 */
export const LanguageBar: React.FC<LanguageBarProps> = ({
  languages,
  showLabels = true,
  className = "",
}) => {
  const t = useThemeStyles();

  return (
    <div className={className}>
      <div
        className="flex h-2.5 overflow-hidden rounded-full transition-shadow duration-300"
        style={{ boxShadow: t.langBarShadow }}
      >
        {languages.map((lang) => (
          <div
            key={lang.name}
            className={`${lang.color} transition-all duration-500`}
            style={{ width: `${lang.percentage}%` }}
          />
        ))}
      </div>

      {showLabels && (
        <div className="mt-2.5 flex flex-wrap gap-x-3 gap-y-1 text-xs">
          {languages.map((lang) => (
            <span
              key={lang.name}
              className="flex items-center gap-1.5 transition-colors duration-300"
              style={{ color: t.textSecondary }}
            >
              <span className={`h-2 w-2 rounded-sm ${lang.color}`} />
              {lang.name} {lang.percentage}%
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageBar;
