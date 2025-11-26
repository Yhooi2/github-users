import { AlertTriangle, Info } from "lucide-react";
import React from "react";
import { useThemeStyles } from "../context/ThemeContext";
import type { AlertProps } from "../types";

/**
 * Alert Component
 *
 * A glassmorphism-styled alert for displaying warnings, errors, and information.
 * Supports three variants: danger, warning, and info.
 *
 * @example
 * ```tsx
 * <Alert variant="danger" title="Error">
 *   Something went wrong
 * </Alert>
 * <Alert variant="warning">
 *   Please check your input
 * </Alert>
 * <Alert variant="info" icon={Info}>
 *   This is informational
 * </Alert>
 * ```
 */
export const Alert: React.FC<AlertProps> = ({
  children,
  variant,
  icon: Icon,
  title,
  className = "",
}) => {
  const t = useThemeStyles();

  const variantConfig = {
    danger: {
      bg: t.alertDangerBg,
      border: t.alertDangerBorder,
      text: t.alertDangerText,
      defaultIcon: AlertTriangle,
      dotColor: t.statusRed,
      dotGlow: "0 0 8px rgba(248,113,113,0.6)",
    },
    warning: {
      bg: t.alertWarningBg,
      border: t.alertWarningBorder,
      text: t.alertWarningText,
      defaultIcon: AlertTriangle,
      dotColor: t.statusYellow,
      dotGlow: "0 0 8px rgba(251,191,36,0.6)",
    },
    info: {
      bg: t.metricBlueBg,
      border: t.metricBlueBorder,
      text: t.metricBlueText,
      defaultIcon: Info,
      dotColor: t.metricBlueText,
      dotGlow: "0 0 8px rgba(96,165,250,0.6)",
    },
  };

  const config = variantConfig[variant];
  const AlertIcon = Icon || config.defaultIcon;

  return (
    <div
      className={`rounded-xl border p-3 backdrop-blur-sm transition-all duration-300 ${className}`}
      style={{
        background: config.bg,
        borderColor: config.border,
      }}
      role="alert"
    >
      <div
        className="flex items-center gap-2 text-sm font-medium"
        style={{ color: config.text }}
      >
        <div
          className="h-2 w-2 rounded-full"
          style={{
            backgroundColor: config.dotColor,
            boxShadow: config.dotGlow,
          }}
        />
        {AlertIcon && <AlertIcon className="h-3.5 w-3.5" />}
        {title || children}
      </div>
      {title && children && (
        <p
          className="mt-1 ml-4 text-xs"
          style={{
            color: config.text,
            opacity: 0.7,
          }}
        >
          {children}
        </p>
      )}
    </div>
  );
};

export default Alert;
