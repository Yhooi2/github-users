import React from "react";
import { useThemeStyles } from "../context/ThemeContext";
import type { TabToggleProps } from "../types";

/**
 * TabToggle Component
 *
 * A glassmorphism-styled tab toggle for switching between options.
 * Supports generic type for tab values.
 *
 * @example
 * ```tsx
 * <TabToggle
 *   tabs={[
 *     { value: "your", label: "Your" },
 *     { value: "contrib", label: "Contrib" }
 *   ]}
 *   activeTab={activeTab}
 *   onChange={setActiveTab}
 * />
 * ```
 */
export function TabToggle<T extends string>({
  tabs,
  activeTab,
  onChange,
  className = "",
}: TabToggleProps<T>): React.JSX.Element {
  const t = useThemeStyles();

  return (
    <div
      className={`flex overflow-hidden rounded-lg text-sm transition-all duration-300 ${className}`}
      style={{ border: `1px solid ${t.glassSubtleBorder}` }}
    >
      {tabs.map((tab) => (
        <button
          key={tab.value}
          type="button"
          onClick={() => onChange(tab.value)}
          className="px-3 py-1.5 transition-all duration-300"
          style={{
            background:
              activeTab === tab.value ? t.toggleActiveBg : t.toggleInactiveBg,
            color:
              activeTab === tab.value
                ? t.toggleActiveText
                : t.toggleInactiveText,
          }}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

export default TabToggle;
