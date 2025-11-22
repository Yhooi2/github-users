import { useEffect, useState } from "react";

/**
 * React hook to detect user's motion preference (prefers-reduced-motion)
 *
 * Respects accessibility settings by detecting when users have enabled
 * reduced motion in their OS settings. Use this hook to disable or simplify
 * animations for users who prefer reduced motion.
 *
 * @returns boolean - true if user prefers reduced motion, false otherwise
 *
 * @example
 * ```typescript
 * function AnimatedCard({ children }) {
 *   const prefersReducedMotion = useReducedMotion();
 *
 *   return (
 *     <motion.div
 *       animate={{ opacity: 1 }}
 *       transition={{
 *         duration: prefersReducedMotion ? 0 : 0.3
 *       }}
 *     >
 *       {children}
 *     </motion.div>
 *   );
 * }
 * ```
 */
export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    // SSR safety: check if window is available
    if (typeof window === "undefined") {
      return false;
    }
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    // Modern browsers
    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  return prefersReducedMotion;
}
