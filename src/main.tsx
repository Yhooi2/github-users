import { ThemeProvider as NextThemeProvider } from "next-themes";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ApolloAppProvider } from "./apollo/ApolloAppProvider.tsx";
import App from "./App.tsx";
import { Toaster } from "./components/ui/sonner.tsx";
import "./index.css";
import { useFeatureFlag } from "./lib/feature-flags.ts";
import { FeatureFlagsDebugPanel } from "./lib/FeatureFlagsDebugPanel.tsx";

// Conditional ThemeProvider adapter
export function AppThemeProvider({ children }: { children: React.ReactNode }) {
  const useGlassUI = useFeatureFlag("USE_GLASS_UI");

  if (useGlassUI) {
    // Dynamic import to avoid bundling Glass UI ThemeProvider when not used
    // For now, use next-themes with glass class support
    return (
      <NextThemeProvider attribute="class" defaultTheme="system" enableSystem>
        {children}
      </NextThemeProvider>
    );
  }

  // Legacy theme provider
  return (
    <NextThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
    </NextThemeProvider>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppThemeProvider>
      <ApolloAppProvider>
        <App />
        <Toaster richColors closeButton />
      </ApolloAppProvider>
      {import.meta.env.DEV && <FeatureFlagsDebugPanel />}
    </AppThemeProvider>
  </StrictMode>,
);
