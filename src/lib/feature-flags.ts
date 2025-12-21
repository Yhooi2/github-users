/**
 * Feature Flags System for Glass UI Migration
 *
 * Allows gradual rollout of shadcn-glass-ui components with instant rollback capability.
 * In development: Uses localStorage for easy toggling via debug panel.
 * In production: Uses environment variables for controlled deployment.
 */

export type FeatureFlag =
  | "USE_GLASS_UI" // Global glass UI toggle
  | "GLASS_UI_BASIC" // Basic UI components (Button, Card, etc.)
  | "GLASS_UI_TIMELINE" // Timeline components
  | "GLASS_UI_ASSESSMENT" // Assessment components
  | "GLASS_UI_PROJECTS" // Projects components
  | "GLASS_UI_USER"; // User components

type FeatureFlagConfig = {
  [K in FeatureFlag]: {
    defaultValue: boolean;
    description: string;
    dependencies?: FeatureFlag[];
  };
};

const featureFlagConfig: FeatureFlagConfig = {
  USE_GLASS_UI: {
    defaultValue: false,
    description: "Global toggle for Glass UI library",
  },
  GLASS_UI_BASIC: {
    defaultValue: false,
    description: "Basic UI components (Button, Card, Dialog, etc.)",
    dependencies: ["USE_GLASS_UI"],
  },
  GLASS_UI_TIMELINE: {
    defaultValue: false,
    description: "Timeline components (YearCardGlass, SparklineGlass, etc.)",
    dependencies: ["USE_GLASS_UI"],
  },
  GLASS_UI_ASSESSMENT: {
    defaultValue: false,
    description: "Assessment components (MetricCard, MetricCategoryCard, etc.)",
    dependencies: ["USE_GLASS_UI"],
  },
  GLASS_UI_PROJECTS: {
    defaultValue: false,
    description: "Projects components (ExpandableProjectCard, etc.)",
    dependencies: ["USE_GLASS_UI"],
  },
  GLASS_UI_USER: {
    defaultValue: false,
    description: "User components (UserHeader, SearchForm, etc.)",
    dependencies: ["USE_GLASS_UI"],
  },
};

const isDevelopment = import.meta.env.DEV;
const STORAGE_KEY_PREFIX = "ff_";

/**
 * Get feature flag value (non-hook version for use outside components)
 * Priority: localStorage (dev) > env variable > default
 */
export function getFeatureFlag(flag: FeatureFlag): boolean {
  const config = featureFlagConfig[flag];

  // Check dependencies first
  if (config.dependencies) {
    for (const dep of config.dependencies) {
      if (!getFeatureFlag(dep)) {
        return false; // If dependency is off, this flag is off
      }
    }
  }

  // Development: Check localStorage first
  if (isDevelopment) {
    const stored = localStorage.getItem(`${STORAGE_KEY_PREFIX}${flag}`);
    if (stored !== null) {
      return stored === "true";
    }
  }

  // Production: Check environment variable
  const envKey = `VITE_FF_${flag}`;
  const envValue = import.meta.env[envKey];
  if (envValue !== undefined) {
    return envValue === "true";
  }

  // Fall back to default
  return config.defaultValue;
}

/**
 * Hook version for use in React components
 */
export function useFeatureFlag(flag: FeatureFlag): boolean {
  return getFeatureFlag(flag);
}

/**
 * Set feature flag (development only)
 */
export function setFeatureFlag(flag: FeatureFlag, value: boolean): void {
  if (!isDevelopment) {
    console.warn("Feature flags can only be set in development mode");
    return;
  }

  localStorage.setItem(`${STORAGE_KEY_PREFIX}${flag}`, String(value));

  // Reload page to apply changes
  window.location.reload();
}

/**
 * Get all feature flags with their current values
 */
export function getAllFeatureFlags(): Array<{
  flag: FeatureFlag;
  value: boolean;
  description: string;
  dependencies?: FeatureFlag[];
}> {
  return (Object.keys(featureFlagConfig) as FeatureFlag[]).map((flag) => ({
    flag,
    value: getFeatureFlag(flag),
    description: featureFlagConfig[flag].description,
    dependencies: featureFlagConfig[flag].dependencies,
  }));
}

/**
 * Reset all feature flags to defaults (development only)
 */
export function resetFeatureFlags(): void {
  if (!isDevelopment) {
    console.warn("Feature flags can only be reset in development mode");
    return;
  }

  (Object.keys(featureFlagConfig) as FeatureFlag[]).forEach((flag) => {
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}${flag}`);
  });

  window.location.reload();
}
