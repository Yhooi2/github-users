/**
 * SearchHeader - Migration to HeaderNavGlass from shadcn-glass-ui v2.8.0
 *
 * Uses HeaderNavGlass component which provides:
 * - GitHub branding with glass effect
 * - Integrated SearchBoxGlass
 * - Theme toggle button
 * - "Sign in with GitHub" button (hidden on mobile)
 *
 * Note: UserMenu functionality is replaced by built-in "Sign in with GitHub" button
 */

import type { UserMenuProps } from "@/components/layout/UserMenu";
import { HeaderNavGlass } from "shadcn-glass-ui/components";

export interface SearchHeaderProps {
  /**
   * Current username being searched
   */
  userName: string;

  /**
   * Callback when search is submitted (same type as React setState)
   */
  onSearch: React.Dispatch<React.SetStateAction<string>>;

  /**
   * Props for the UserMenu component
   * @deprecated HeaderNavGlass uses built-in GitHub sign-in button
   */
  userMenuProps: UserMenuProps;
}

/**
 * Search Header Component - Glass UI Version
 *
 * Migrated to use HeaderNavGlass from shadcn-glass-ui.
 * Provides glassmorphism styling with integrated search, theme toggle, and GitHub branding.
 *
 * @example
 * ```tsx
 * <SearchHeader
 *   userName=""
 *   onSearch={(username) => setUserName(username)}
 *   userMenuProps={{
 *     isAuthenticated: false,
 *     onSignIn: () => {},
 *     onSignOut: () => {},
 *   }}
 * />
 * ```
 */
export function SearchHeader({ userName, onSearch }: SearchHeaderProps) {
  return <HeaderNavGlass username={userName} onSearch={onSearch} />;
}
