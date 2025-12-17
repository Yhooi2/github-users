/**
 * Debug panel for managing feature flags in development
 */

import {
  getAllFeatureFlags,
  resetFeatureFlags,
  setFeatureFlag,
} from "./feature-flags";

export function FeatureFlagsDebugPanel() {
  if (!import.meta.env.DEV) {
    return null;
  }

  const flags = getAllFeatureFlags();

  return (
    <div
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        backgroundColor: "rgba(0, 0, 0, 0.9)",
        color: "white",
        padding: "16px",
        borderRadius: "8px",
        fontSize: "12px",
        fontFamily: "monospace",
        zIndex: 9999,
        maxWidth: "400px",
        maxHeight: "600px",
        overflow: "auto",
      }}
    >
      <div
        style={{ fontWeight: "bold", marginBottom: "12px", fontSize: "14px" }}
      >
        🚩 Feature Flags (Dev Mode)
      </div>

      {flags.map(({ flag, value, description, dependencies }) => (
        <div
          key={flag}
          style={{
            marginBottom: "12px",
            paddingBottom: "12px",
            borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "4px",
            }}
          >
            <input
              type="checkbox"
              checked={value}
              onChange={(e) => setFeatureFlag(flag, e.target.checked)}
              style={{ marginRight: "8px", cursor: "pointer" }}
              id={`ff-${flag}`}
            />
            <label
              htmlFor={`ff-${flag}`}
              style={{
                cursor: "pointer",
                fontWeight: value ? "bold" : "normal",
                color: value ? "#4ade80" : "white",
              }}
            >
              {flag}
            </label>
          </div>
          <div
            style={{ color: "#9ca3af", fontSize: "11px", marginLeft: "24px" }}
          >
            {description}
          </div>
          {dependencies && dependencies.length > 0 && (
            <div
              style={{
                color: "#fbbf24",
                fontSize: "10px",
                marginLeft: "24px",
                marginTop: "2px",
              }}
            >
              ⚠️ Depends on: {dependencies.join(", ")}
            </div>
          )}
        </div>
      ))}

      <button
        onClick={resetFeatureFlags}
        style={{
          marginTop: "8px",
          padding: "6px 12px",
          backgroundColor: "#ef4444",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          fontSize: "11px",
          width: "100%",
        }}
      >
        Reset All to Defaults
      </button>
    </div>
  );
}
