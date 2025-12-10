/// <reference types="vitest/config" />
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";
import { ViteMcp } from "vite-plugin-mcp";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), ViteMcp()],
  build: {
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          charts: ["recharts"],
          apollo: ["@apollo/client", "graphql"],
          "radix-ui": [
            "@radix-ui/react-accordion",
            "@radix-ui/react-avatar",
            "@radix-ui/react-checkbox",
            "@radix-ui/react-collapsible",
            "@radix-ui/react-dialog",
            "@radix-ui/react-label",
            "@radix-ui/react-progress",
            "@radix-ui/react-scroll-area",
            "@radix-ui/react-select",
            "@radix-ui/react-separator",
            "@radix-ui/react-slot",
            "@radix-ui/react-switch",
            "@radix-ui/react-tabs",
            "@radix-ui/react-tooltip",
          ],
        },
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    css: true,
    deps: {
      optimizer: {
        web: {
          include: [
            "@apollo/client",
            "@apollo/client/react",
            "@apollo/client/errors",
            "@apollo/client/link/error",
            "@apollo/client/testing",
            "@apollo/client/testing/react",
          ],
        },
      },
    },
    exclude: [
      "node_modules/**",
      "dist/**",
      "e2e/**",
      "**/*.e2e.ts",
      "**/*.spec.ts",
    ],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html", "lcov"],
      exclude: [
        "node_modules/",
        "src/test/",
        "**/*.d.ts",
        "**/*.config.*",
        "**/mockData",
        "dist/",
        "e2e/",
        "**/*.stories.tsx",
        "**/*.spec.ts",
        "src/main.tsx",
      ],
      thresholds: {
        lines: 90,
        functions: 90,
        branches: 85,
        statements: 90,
      },
    },
  },
});
