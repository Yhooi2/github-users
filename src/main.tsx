import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider } from "shadcn-glass-ui";
import { ApolloAppProvider } from "./apollo/ApolloAppProvider.tsx";
import App from "./App.tsx";
import { Toaster } from "./components/ui/sonner.tsx";
import "./index.css";
import { FeatureFlagsDebugPanel } from "./lib/FeatureFlagsDebugPanel.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="glass">
      <ApolloAppProvider>
        <App />
        <Toaster richColors closeButton />
      </ApolloAppProvider>
      {import.meta.env.DEV && <FeatureFlagsDebugPanel />}
    </ThemeProvider>
  </StrictMode>,
);
