import { Loader2 } from "lucide-react";
import React from "react";
import { useThemeStyles } from "../context/ThemeContext";
import type { ButtonSize, ButtonVariant, GlassButtonProps } from "../types";

/**
 * GlassButton Component
 *
 * A glassmorphism-styled button with multiple variants and sizes.
 * Supports icons, loading state, and adapts to all three themes.
 *
 * @example
 * ```tsx
 * <GlassButton variant="primary" icon={Sparkles}>
 *   Generate
 * </GlassButton>
 * ```
 */
export const GlassButton: React.FC<GlassButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  icon: Icon,
  iconPosition = "left",
  disabled = false,
  loading = false,
  fullWidth = false,
  onClick,
  className = "",
}) => {
  const t = useThemeStyles();

  const sizeClasses: Record<ButtonSize, string> = {
    sm: "px-3 py-1.5 text-xs gap-1.5",
    md: "px-5 py-2.5 text-sm gap-2",
    lg: "px-6 py-3 text-base gap-2.5",
  };

  const iconSizes: Record<ButtonSize, string> = {
    sm: "h-3.5 w-3.5",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  };

  // Primary button with purple gradient
  const getPrimaryStyles = () => ({
    background: "linear-gradient(to right, #8b5cf6, #9333ea)",
    color: "white",
    boxShadow: "0 4px 20px rgba(147,51,234,0.4)",
  });

  // Secondary button adapts to theme
  const getSecondaryStyles = () => ({
    background: t.btnSecondaryBg,
    color: t.btnSecondaryText,
    borderColor: t.btnSecondaryBorder,
  });

  // Ghost button - minimal styling
  const getGhostStyles = () => ({
    background: "transparent",
    color: t.textSecondary,
    borderColor: "transparent",
  });

  const variantStyles: Record<ButtonVariant, React.CSSProperties> = {
    primary: getPrimaryStyles(),
    secondary: getSecondaryStyles(),
    ghost: getGhostStyles(),
  };

  const baseClasses = `
    inline-flex items-center justify-center 
    rounded-xl font-medium 
    transition-all duration-300
    focus:outline-none focus:ring-2 focus:ring-violet-500/50
    disabled:opacity-50 disabled:cursor-not-allowed
    ${variant === "secondary" ? "border" : ""}
    ${fullWidth ? "w-full" : ""}
    ${sizeClasses[size]}
    ${className}
  `
    .trim()
    .replace(/\s+/g, " ");

  const hoverClass =
    variant === "primary"
      ? "hover:shadow-[0_4px_24px_rgba(147,51,234,0.6)]"
      : "hover:opacity-80";

  return (
    <button
      className={`${baseClasses} ${hoverClass}`}
      style={variantStyles[variant]}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading ? (
        <Loader2 className={`${iconSizes[size]} animate-spin`} />
      ) : (
        <>
          {Icon && iconPosition === "left" && (
            <Icon className={iconSizes[size]} />
          )}
          {children}
          {Icon && iconPosition === "right" && (
            <Icon className={iconSizes[size]} />
          )}
        </>
      )}
    </button>
  );
};

export default GlassButton;
