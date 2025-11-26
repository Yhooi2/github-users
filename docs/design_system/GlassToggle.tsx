import React from "react";
import { useThemeStyles } from "../context/ThemeContext";
import type { GlassToggleProps } from "../types";

/**
 * GlassToggle Component
 *
 * A glassmorphism-styled toggle switch for boolean settings.
 * Features smooth animations and adapts to all three themes.
 *
 * @example
 * ```tsx
 * const [enabled, setEnabled] = useState(false);
 * <GlassToggle
 *   checked={enabled}
 *   onChange={setEnabled}
 *   size="md"
 * />
 * ```
 */
export const GlassToggle: React.FC<GlassToggleProps> = ({
  checked,
  onChange,
  disabled = false,
  size = "md",
}) => {
  const t = useThemeStyles();

  const sizeConfig = {
    sm: {
      track: "h-5 w-9",
      thumb: "h-3.5 w-3.5",
      translate: "translate-x-4",
    },
    md: {
      track: "h-6 w-11",
      thumb: "h-4 w-4",
      translate: "translate-x-5",
    },
    lg: {
      track: "h-7 w-14",
      thumb: "h-5 w-5",
      translate: "translate-x-7",
    },
  };

  const config = sizeConfig[size];

  const handleClick = () => {
    if (!disabled) {
      onChange(!checked);
    }
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={handleClick}
      className={`
        relative inline-flex items-center rounded-full border
        transition-all duration-300
        focus:outline-none focus:ring-2 focus:ring-violet-500/50
        disabled:opacity-50 disabled:cursor-not-allowed
        ${config.track}
      `}
      style={{
        background: checked
          ? "linear-gradient(to right, #8b5cf6, #9333ea)"
          : t.glassMediumBg,
        borderColor: checked ? "transparent" : t.glassMediumBorder,
        boxShadow: checked ? "0 0 12px rgba(147,51,234,0.4)" : "none",
      }}
    >
      <span
        className={`
          inline-block rounded-full bg-white shadow-md
          transform transition-transform duration-300 ease-in-out
          ${config.thumb}
          ${checked ? config.translate : "translate-x-1"}
        `}
        style={{
          boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
        }}
      />
    </button>
  );
};

export default GlassToggle;
