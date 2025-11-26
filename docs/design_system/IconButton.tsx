import React from "react";
import { useThemeStyles } from "../context/ThemeContext";
import type { IconButtonProps } from "../types";

/**
 * IconButton Component
 *
 * A glassmorphism-styled icon button with gradient background.
 * Used for primary actions like GitHub icon in header.
 *
 * @example
 * ```tsx
 * <IconButton
 *   icon={Github}
 *   onClick={() => handleClick()}
 *   title="Open GitHub"
 * />
 * ```
 */
export const IconButton: React.FC<IconButtonProps> = ({
  icon: Icon,
  onClick,
  title,
  className = "",
}) => {
  const t = useThemeStyles();

  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-300 ${className}`}
      style={{
        background: `linear-gradient(135deg, ${t.iconBtnFrom}, ${t.iconBtnTo})`,
        boxShadow: t.iconBtnShadow,
      }}
    >
      <Icon className="h-5 w-5" style={{ color: t.iconBtnText }} />
    </button>
  );
};

export default IconButton;
