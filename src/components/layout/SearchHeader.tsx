import SearchForm from "@/components/SearchForm";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { UserMenu, type UserMenuProps } from "@/components/layout/UserMenu";
import { Github } from "lucide-react";

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
   */
  userMenuProps: UserMenuProps;
}

/**
 * Search Header Component
 *
 * Compact single-row header with brand, search, theme toggle, and user menu.
 * Uses proper flex layout without absolute positioning.
 *
 * Layout: [Github Icon] User Analytics  [Search..............] [Theme] [User]
 *
 * Tab order: Brand -> Search -> ThemeToggle -> UserMenu
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
export function SearchHeader({
  userName,
  onSearch,
  userMenuProps,
}: SearchHeaderProps) {
  return (
    <header className="flex items-center justify-between gap-4">
      {/* Left Section - Brand + Search */}
      <div className="flex min-w-0 flex-1 items-center gap-4">
        {/* Brand */}
        <div className="flex shrink-0 items-center gap-2">
          <Github className="h-6 w-6" aria-hidden="true" />
          <h1 className="hidden text-lg font-semibold sm:block">User Analytics</h1>
        </div>

        {/* Search Form */}
        <div className="min-w-0 max-w-md flex-1">
          <SearchForm userName={userName} setUserName={onSearch} />
        </div>
      </div>

      {/* Right Section - Theme Toggle + User Menu */}
      <div className="flex shrink-0 items-center gap-2">
        <ThemeToggle />
        <UserMenu {...userMenuProps} />
      </div>
    </header>
  );
}
