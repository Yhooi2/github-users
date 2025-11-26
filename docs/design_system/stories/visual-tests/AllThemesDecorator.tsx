import React from "react";
import { ThemeProvider } from "../../../context/ThemeContext";
import { Background } from "../../Background";
import type { ThemeName as Theme } from "../../../types";

/**
 * Visual Test Decorator - renders component in all three themes side by side
 * for visual regression testing
 */
export const AllThemesDecorator: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const themes: Theme[] = ["light", "aurora", "glass"];

  return (
    <div className="flex flex-col gap-0">
      {themes.map((theme) => (
        <ThemeProvider key={theme} defaultTheme={theme}>
          <Background className="p-6 min-h-[200px]">
            <div className="mb-2 text-xs font-bold uppercase tracking-wider opacity-50">
              Theme: {theme}
            </div>
            {children}
          </Background>
        </ThemeProvider>
      ))}
    </div>
  );
};

/**
 * Single theme decorator for focused testing
 */
export const ThemeDecorator: React.FC<{
  theme: Theme;
  children: React.ReactNode;
}> = ({ theme, children }) => (
  <ThemeProvider defaultTheme={theme}>
    <Background className="p-6 min-h-[150px]">{children}</Background>
  </ThemeProvider>
);

/**
 * Grid layout for showcasing multiple component variants
 */
export const ComponentGrid: React.FC<{
  children: React.ReactNode;
  columns?: number;
}> = ({ children, columns = 3 }) => (
  <div
    className="grid gap-4"
    style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
  >
    {children}
  </div>
);

/**
 * Stack layout for vertical arrangement
 */
export const ComponentStack: React.FC<{
  children: React.ReactNode;
  gap?: string;
}> = ({ children, gap = "gap-4" }) => (
  <div className={`flex flex-col ${gap}`}>{children}</div>
);

/**
 * Row layout for horizontal arrangement
 */
export const ComponentRow: React.FC<{
  children: React.ReactNode;
  gap?: string;
  align?: string;
}> = ({ children, gap = "gap-4", align = "items-center" }) => (
  <div className={`flex flex-wrap ${gap} ${align}`}>{children}</div>
);

export default AllThemesDecorator;
