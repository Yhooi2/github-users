import React from "react";
import { useThemeStyles } from "../context/ThemeContext";
import { StatusIndicator } from "./StatusIndicator";
import type { FlagAlertProps } from "../types";

/**
 * FlagAlert Component
 *
 * A glassmorphism-styled alert for displaying flags/issues.
 * Supports danger (red) and warning (yellow) variants.
 *
 * @example
 * ```tsx
 * <FlagAlert
 *   type="danger"
 *   title="No collaboration"
 *   description="0 PRs to external repos · 0 code reviews"
 * />
 * ```
 */
export const FlagAlert: React.FC<FlagAlertProps> = ({
  type,
  title,
  description,
  className = "",
}) => {
  const t = useThemeStyles();

  const styles =
    type === "danger"
      ? {
          bg: t.alertDangerBg,
          border: t.alertDangerBorder,
          text: t.alertDangerText,
          statusType: "red" as const,
        }
      : {
          bg: t.alertWarningBg,
          border: t.alertWarningBorder,
          text: t.alertWarningText,
          statusType: "yellow" as const,
        };

  return (
    <div
      className={`rounded-xl border p-3 transition-all duration-300 ${className}`}
      style={{
        background: styles.bg,
        borderColor: styles.border,
      }}
    >
      <div
        className="flex items-center gap-2 text-sm font-medium"
        style={{ color: styles.text }}
      >
        <StatusIndicator type={styles.statusType} />
        {title}
      </div>
      {description && (
        <p
          className="mt-1 ml-5 text-xs"
          style={{ color: `${styles.text}99` }}
        >
          {description}
        </p>
      )}
    </div>
  );
};

export default FlagAlert;
