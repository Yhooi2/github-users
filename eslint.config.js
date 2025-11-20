// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";

import js from "@eslint/js";
import prettier from "eslint-config-prettier";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import { globalIgnores } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
  globalIgnores(["dist", "storybook-static"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs["recommended-latest"],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      "no-console": ["warn", { allow: ["warn", "error"] }],
    },
  },
  {
    settings: {
      tailwindcss: {
        // Point the plugin at an explicit config so it doesn't try to resolve
        // a default path and print noisy messages. (We don't load the plugin's
        // recommended flat config to avoid it trying to require `tailwindcss`.)
        config: "./tailwind.config.cjs",
        cssFiles: ["src/index.css"],
      },
    },
    rules: {
      // Disable custom classname check for Tailwind CSS v4
      // v4 uses CSS variables and theme() function instead of config file
      "tailwindcss/no-custom-classname": "off",
    },
  },
  ...storybook.configs["flat/recommended"],
  // Relax rules in test and e2e/integration files where we intentionally log and use `any`
  {
    files: [
      "**/*.test.{ts,tsx,js,jsx,mjs}",
      "**/*.spec.{ts,tsx,js,jsx,mjs}",
      "**/*.integration.{ts,tsx,js,jsx,mjs}",
      "e2e/**",
      "integration/**",
      "api/**",
      "src/test/**",
    ],
    rules: {
      "no-console": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },
  // Storybook stories commonly import renderer packages during development — disable the rule
  {
    files: ["**/*.stories.*"],
    rules: {
      "storybook/no-renderer-packages": "off",
      "no-console": "off",
    },
  },
  prettier,
);
