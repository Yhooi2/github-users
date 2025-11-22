import { useEffect, useState } from "react";

/**
 * Breakpoint definitions for responsive design
 * Matches Tailwind CSS default breakpoints
 */
export const BREAKPOINTS = {
  /** Mobile: < 768px */
  mobile: 0,
  /** Tablet: 768px - 1439px */
  tablet: 768,
  /** Desktop: >= 1440px */
  desktop: 1440,
} as const;

export type Breakpoint = keyof typeof BREAKPOINTS;

export interface ResponsiveState {
  /** Current breakpoint name */
  breakpoint: Breakpoint;
  /** True if viewport width < 768px */
  isMobile: boolean;
  /** True if viewport width >= 768px and < 1440px */
  isTablet: boolean;
  /** True if viewport width >= 1440px */
  isDesktop: boolean;
  /** Current viewport width in pixels */
  width: number;
}

/**
 * Determines the current breakpoint based on window width
 */
function getBreakpoint(width: number): Breakpoint {
  if (width >= BREAKPOINTS.desktop) {
    return "desktop";
  }
  if (width >= BREAKPOINTS.tablet) {
    return "tablet";
  }
  return "mobile";
}

/**
 * React hook for responsive design breakpoint detection
 *
 * Provides current viewport breakpoint and boolean flags for common
 * responsive design patterns. Updates automatically when window is resized.
 *
 * @returns ResponsiveState with breakpoint info and boolean flags
 *
 * @example
 * ```typescript
 * function ProjectModal({ project }) {
 *   const { isMobile, isDesktop } = useResponsive();
 *
 *   // Use Sheet on mobile, Dialog on desktop
 *   if (isMobile) {
 *     return <Sheet>{content}</Sheet>;
 *   }
 *
 *   return <Dialog>{content}</Dialog>;
 * }
 * ```
 */
export function useResponsive(): ResponsiveState {
  const [state, setState] = useState<ResponsiveState>(() => {
    // SSR safety: default to mobile if window is not available
    if (typeof window === "undefined") {
      return {
        breakpoint: "mobile",
        isMobile: true,
        isTablet: false,
        isDesktop: false,
        width: 0,
      };
    }

    const width = window.innerWidth;
    const breakpoint = getBreakpoint(width);

    return {
      breakpoint,
      isMobile: breakpoint === "mobile",
      isTablet: breakpoint === "tablet",
      isDesktop: breakpoint === "desktop",
      width,
    };
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const breakpoint = getBreakpoint(width);

      setState({
        breakpoint,
        isMobile: breakpoint === "mobile",
        isTablet: breakpoint === "tablet",
        isDesktop: breakpoint === "desktop",
        width,
      });
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return state;
}
