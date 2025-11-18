import SearchForm from '@/components/SearchForm';
import { ThemeToggle } from '@/components/layout/ThemeToggle';

export interface SearchHeaderProps {
  /**
   * Current username being searched
   */
  userName: string;

  /**
   * Callback when search is submitted (same type as React setState)
   */
  onSearch: React.Dispatch<React.SetStateAction<string>>;
}

/**
 * Search Header Component
 *
 * Displays the main header with search functionality and theme toggle.
 * Provides a clean, centered layout for the GitHub User Analytics app.
 *
 * @example
 * ```tsx
 * <SearchHeader
 *   userName=""
 *   onSearch={(username) => setUserName(username)}
 * />
 * ```
 */
export function SearchHeader({ userName, onSearch }: SearchHeaderProps) {
  return (
    <header className="relative space-y-4 text-center">
      {/* Theme Toggle - Absolute positioned in top right */}
      <div className="absolute top-0 right-0">
        <ThemeToggle />
      </div>

      {/* App Title */}
      <h1 className="text-4xl font-bold">GitHub User Analytics</h1>

      {/* Description */}
      <p className="text-muted-foreground">
        Analyze GitHub users with comprehensive metrics and timeline
      </p>

      {/* Search Form */}
      <div className="mx-auto max-w-md">
        <SearchForm userName={userName} setUserName={onSearch} />
      </div>
    </header>
  );
}
