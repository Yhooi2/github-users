import React from "react";
import { useThemeStyles } from "../context/ThemeContext";
import type { AvatarProps } from "../types";

/**
 * Avatar Component
 *
 * A user avatar with initials, gradient background, and optional online indicator.
 * Features a glowing effect that adapts to the current theme.
 *
 * @example
 * ```tsx
 * <Avatar initials="AS" size="lg" online />
 * ```
 */
export const Avatar: React.FC<AvatarProps> = ({
  initials,
  size = "md",
  online = false,
  gradient = "from-blue-500 via-violet-500 to-indigo-600",
  className = "",
}) => {
  const t = useThemeStyles();

  const sizeClasses: Record<
    string,
    { container: string; text: string; indicator: string }
  > = {
    sm: {
      container: "h-8 w-8",
      text: "text-xs",
      indicator: "h-3 w-3 -right-0.5 -bottom-0.5",
    },
    md: {
      container: "h-12 w-12",
      text: "text-sm",
      indicator: "h-4 w-4 -right-0.5 -bottom-0.5",
    },
    lg: {
      container: "h-16 w-16",
      text: "text-xl",
      indicator: "h-5 w-5 -right-1 -bottom-1",
    },
    xl: {
      container: "h-20 w-20",
      text: "text-2xl",
      indicator: "h-6 w-6 -right-1 -bottom-1",
    },
  };

  const s = sizeClasses[size];

  return (
    <div className={`relative ${className}`}>
      <div
        className={`${s.container} flex items-center justify-center rounded-2xl bg-gradient-to-br ${gradient} ${s.text} font-bold text-white transition-shadow duration-300`}
        style={{ boxShadow: t.avatarGlow }}
      >
        {initials.toUpperCase().slice(0, 2)}
      </div>
      {online && (
        <div
          className={`absolute ${s.indicator} rounded-full bg-emerald-400 transition-all duration-300`}
          style={{
            borderWidth: "2px",
            borderColor: t.onlineBorder,
            boxShadow: "0 0 8px rgba(52,211,153,0.5)",
          }}
        />
      )}
    </div>
  );
};

export default Avatar;
