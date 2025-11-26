import React from "react";
import { useTheme, useThemeStyles } from "../context/ThemeContext";
import type { BackgroundProps } from "../types";

/**
 * Background Component
 *
 * The animated gradient background with floating orbs and grid overlay.
 * Automatically adapts to the current theme with unique orb configurations.
 *
 * @example
 * ```tsx
 * <Background>
 *   <div className="relative z-10">Content here</div>
 * </Background>
 * ```
 */
export const Background: React.FC<BackgroundProps> = ({
  children,
  className = "",
}) => {
  const { theme } = useTheme();
  const t = useThemeStyles();

  return (
    <div
      className={`relative min-h-screen overflow-hidden font-['Inter',system-ui,sans-serif] ${className}`}
    >
      {/* Gradient Background */}
      <div
        className="fixed inset-0 transition-all duration-500"
        style={{
          background: `linear-gradient(to bottom right, ${t.bgFrom}, ${t.bgVia}, ${t.bgTo})`,
        }}
      >
        {/* Orbs */}
        {theme === "glass" ? (
          <>
            <div
              className="absolute top-20 -left-20 h-72 w-72 animate-pulse rounded-full blur-3xl"
              style={{ background: t.orb1 }}
            />
            <div
              className="absolute top-1/3 -right-20 h-96 w-96 rounded-full blur-3xl"
              style={{ background: t.orb2 }}
            />
            <div
              className="absolute bottom-20 left-1/4 h-64 w-64 animate-pulse rounded-full blur-3xl"
              style={{ background: t.orb3, animationDelay: "1s" }}
            />
            <div
              className="absolute right-1/4 bottom-1/3 h-48 w-48 rounded-full blur-3xl"
              style={{ background: t.orb4 }}
            />
            <div
              className="absolute top-1/2 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
              style={{ background: t.orb5 }}
            />
          </>
        ) : (
          <>
            <div
              className="absolute top-10 -left-32 h-96 w-96 rounded-full blur-3xl transition-all duration-500"
              style={{ background: t.orb1 }}
            />
            <div
              className="absolute top-1/4 -right-32 h-[500px] w-[500px] rounded-full blur-3xl transition-all duration-500"
              style={{ background: t.orb2 }}
            />
            <div
              className="absolute bottom-10 left-1/3 h-80 w-80 rounded-full blur-3xl transition-all duration-500"
              style={{ background: t.orb3 }}
            />
            <div
              className="absolute right-1/4 bottom-1/4 h-64 w-64 rounded-full blur-3xl transition-all duration-500"
              style={{ background: t.orb4 }}
            />
          </>
        )}

        {/* Grid */}
        <div
          className="absolute inset-0 transition-opacity duration-500"
          style={{
            opacity: t.gridOpacity,
            backgroundImage: `linear-gradient(${t.gridColor} 1px, transparent 1px), linear-gradient(90deg, ${t.gridColor} 1px, transparent 1px)`,
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default Background;
