import React, {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";
import { THEMES, themeStyles } from "../styles/tokens";
import type { ThemeContextValue, ThemeName } from "../types";

// ========================================
// THEME CONTEXT
// ========================================

const ThemeContext = createContext<ThemeContextValue | null>(null);

// ========================================
// USE THEME HOOK
// ========================================

export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

// ========================================
// THEME PROVIDER PROPS
// ========================================

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: ThemeName;
}

// ========================================
// THEME PROVIDER
// ========================================

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  defaultTheme = "glass",
}) => {
  const [theme, setTheme] = useState<ThemeName>(defaultTheme);

  const cycleTheme = (): void => {
    const currentIndex = THEMES.indexOf(theme);
    const nextIndex = (currentIndex + 1) % THEMES.length;
    setTheme(THEMES[nextIndex]);
  };

  const contextValue: ThemeContextValue = {
    theme,
    setTheme,
    cycleTheme,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

// ========================================
// GET CURRENT THEME STYLES
// ========================================

export const useThemeStyles = () => {
  const { theme } = useTheme();
  return themeStyles[theme];
};

export { ThemeContext };
