import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines and merges CSS class names using clsx and tailwind-merge
 *
 * This utility function is essential for shadcn/ui components. It:
 * - Accepts multiple class name inputs (strings, arrays, objects, conditionals)
 * - Combines them using clsx for conditional class handling
 * - Merges conflicting Tailwind classes intelligently using twMerge
 *
 * The twMerge ensures that later Tailwind classes override earlier ones correctly.
 * For example, "px-4 px-2" becomes just "px-2" instead of applying both.
 *
 * @param inputs - Variable number of class value inputs (strings, arrays, objects, etc.)
 * @returns Merged and deduplicated class name string
 *
 * @example
 * ```typescript
 * // Basic usage
 * cn('px-4 py-2', 'bg-blue-500')
 * // Returns: "px-4 py-2 bg-blue-500"
 *
 * // Conditional classes
 * cn('text-base', isActive && 'text-blue-500')
 * // Returns: "text-base text-blue-500" (if isActive is true)
 *
 * // Overriding Tailwind classes
 * cn('px-4 py-2', 'px-2')
 * // Returns: "py-2 px-2" (px-4 is overridden by px-2)
 *
 * // Object syntax with arrays
 * cn(['flex', 'items-center'], { 'justify-center': centered })
 * ```
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
