import React from "react";
import { ChevronDown } from "lucide-react";
import { useThemeStyles } from "../context/ThemeContext";
import { GlassBadge } from "./GlassBadge";
import { GlassProgress } from "./GlassProgress";
import type { YearCardProps } from "../types";

/**
 * YearCard Component
 *
 * A glassmorphism-styled card for displaying year statistics.
 * Shows year, badge with emoji/label, commits count, and progress bar.
 *
 * @example
 * ```tsx
 * <YearCard
 *   year={2024}
 *   emoji="📈"
 *   label="Growth"
 *   commits={901}
 *   progress={100}
 * />
 * ```
 */
export const YearCard = ({ year, emoji, label, commits, progress = 0, gradient = "from-blue-400 to-violet-500", onClick, className = "" }: YearCardProps) => {
  const t = useThemeStyles();

  return (
    <div
      className={`mb-3 rounded-xl border p-3 transition-all duration-300 ${onClick ? "cursor-pointer" : ""} ${className}`}
      style={{
        background: t.yearCardBg,
        borderColor: t.yearCardBorder,
      }}
      onClick={onClick}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                onClick();
              }
            }
          : undefined
      }
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-semibold" style={{ color: t.textPrimary }}>
            {year}
          </span>
          <GlassBadge>
            {emoji} {label}
          </GlassBadge>
        </div>
        <span
          className="flex items-center gap-1 text-sm"
          style={{ color: t.textSecondary }}
        >
          {commits}
          <ChevronDown className="h-4 w-4" />
        </span>
      </div>
      <GlassProgress value={progress} gradient={gradient} height="h-1.5" />
    </div>
  );
};

export default YearCard;
