/**
 * Custom React hooks for GitHub User Info application
 *
 * This module exports all custom hooks used throughout the application.
 * All hooks are optimized with React.useMemo and React.useCallback for performance.
 */

export { useAuthenticityScore } from "./useAuthenticityScore";
export { useUserAnalytics } from "./useUserAnalytics";
export type { YearData, UseUserAnalyticsReturn } from "./useUserAnalytics";
export { useProgressiveDisclosure } from "./useProgressiveDisclosure";
export type {
  ProgressiveDisclosureState,
  ProgressiveDisclosureActions,
  UseProgressiveDisclosureOptions,
  TabName,
} from "./useProgressiveDisclosure";
export { useReducedMotion } from "./useReducedMotion";
export { useRepositoryFilters } from "./useRepositoryFilters";
export { useRepositorySorting } from "./useRepositorySorting";
export { useResponsive, BREAKPOINTS } from "./useResponsive";
export type { Breakpoint, ResponsiveState } from "./useResponsive";
