/**
 * Custom React hooks for GitHub User Info application
 *
 * This module exports all custom hooks used throughout the application.
 * All hooks are optimized with React.useMemo and React.useCallback for performance.
 */

export { useAIAnalytics } from "./useAIAnalytics";
export type {
  UseAIAnalyticsParams,
  UseAIAnalyticsResult,
} from "./useAIAnalytics";
export { useAuthenticityScore } from "./useAuthenticityScore";
export { useProgressiveDisclosure } from "./useProgressiveDisclosure";
export type {
  ProgressiveDisclosureActions,
  ProgressiveDisclosureState,
  TabName,
  UseProgressiveDisclosureOptions,
} from "./useProgressiveDisclosure";
export { useReducedMotion } from "./useReducedMotion";
export { BREAKPOINTS, useResponsive } from "./useResponsive";
export type { Breakpoint, ResponsiveState } from "./useResponsive";
export { useUserAnalytics } from "./useUserAnalytics";
export type { UseUserAnalyticsReturn, YearData } from "./useUserAnalytics";
