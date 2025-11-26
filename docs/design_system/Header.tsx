import { Github } from "lucide-react";
import React from "react";
import { useThemeStyles } from "../context/ThemeContext";
import type { HeaderProps } from "../types";

/**
 * Header Component
 *
 * A sticky header with glassmorphism background and optional content.
 * Features theme-adaptive styling and backdrop blur.
 *
 * @example
 * ```tsx
 * <Header
 *   title="Dashboard"
 *   icon={Github}
 *   rightContent={<ThemeToggle />}
 * />
 * ```
 */
export const Header: React.FC<HeaderProps> = ({
  title = "Analytics",
  icon: Icon = Github,
  leftContent,
  rightContent,
  className = "",
}) => {
  const t = useThemeStyles();

  return (
    <div
      className={`sticky top-0 z-50 border-b backdrop-blur-xl transition-all duration-300 ${className}`}
      style={{
        background: t.headerBg,
        borderColor: t.headerBorder,
      }}
    >
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2.5">
          {leftContent || (
            <>
              <div
                className="flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-300"
                style={{
                  background: `linear-gradient(to bottom right, ${t.iconBtnFrom}, ${t.iconBtnTo})`,
                  boxShadow: t.iconBtnShadow,
                }}
              >
                <Icon className="h-5 w-5" style={{ color: t.iconBtnText }} />
              </div>
              <span
                className="font-semibold transition-colors duration-300"
                style={{ color: t.textPrimary }}
              >
                {title}
              </span>
            </>
          )}
        </div>
        {rightContent && (
          <div className="flex items-center gap-2">{rightContent}</div>
        )}
      </div>
    </div>
  );
};

export default Header;
