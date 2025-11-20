/**
 * Programming language color mappings
 * Based on GitHub's official language colors
 */
export const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Python: "#3572A5",
  Java: "#b07219",
  Go: "#00ADD8",
  Rust: "#dea584",
  Ruby: "#701516",
  PHP: "#4F5D95",
  "C++": "#f34b7d",
  C: "#555555",
  "C#": "#178600",
  Swift: "#ffac45",
  Kotlin: "#A97BFF",
  Dart: "#00B4AB",
  HTML: "#e34c26",
  CSS: "#563d7c",
  SCSS: "#c6538c",
  Shell: "#89e051",
  Vue: "#41b883",
  React: "#61dafb",
};

/**
 * Get color for a programming language
 *
 * @param language - Programming language name
 * @returns Hex color code or gray default
 *
 * @example
 * ```ts
 * const color = getLanguageColor('TypeScript');
 * // Returns: '#3178c6'
 *
 * const unknownColor = getLanguageColor('UnknownLang');
 * // Returns: '#64748b' (default gray)
 * ```
 */
export function getLanguageColor(language: string): string {
  return LANGUAGE_COLORS[language] || "#64748b"; // default gray
}
