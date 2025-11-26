import React from "react";
import { Search } from "lucide-react";
import { useThemeStyles } from "../context/ThemeContext";
import type { SearchBarProps } from "../types";

/**
 * SearchBar Component
 *
 * A glassmorphism-styled search input with button.
 * Matches the desktop reference design exactly.
 *
 * @example
 * ```tsx
 * <SearchBar
 *   value={username}
 *   onChange={setUsername}
 *   onSearch={handleSearch}
 *   buttonText="Search"
 * />
 * ```
 */
export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  onSearch,
  placeholder = "Enter username...",
  buttonText = "Search",
  readOnly = false,
  className = "",
}) => {
  const t = useThemeStyles();

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && onSearch) {
      onSearch();
    }
  };

  return (
    <div className={`flex ${className}`}>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        readOnly={readOnly}
        className="w-48 rounded-l-lg border-r-0 px-3 py-1.5 text-sm transition-all duration-300"
        style={{
          background: t.searchBg,
          borderColor: t.searchBorder,
          color: t.textPrimary,
          borderWidth: "1px",
          borderStyle: "solid",
        }}
      />
      <button
        type="button"
        onClick={onSearch}
        className="flex items-center gap-2 rounded-r-lg px-4 py-1.5 text-sm font-medium transition-all duration-300"
        style={{
          background: t.searchBtnBg,
          color: t.searchBtnText,
        }}
      >
        <Search className="h-4 w-4" />
        {buttonText}
      </button>
    </div>
  );
};

export default SearchBar;
