// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";

import js from '@eslint/js'
import prettier from 'eslint-config-prettier'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tailwind from "eslint-plugin-tailwindcss"
import { globalIgnores } from 'eslint/config'
import globals from 'globals'
import tseslint from 'typescript-eslint'


export default tseslint.config(
  globalIgnores(['dist', 'storybook-static']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  },
  ...tailwind.configs["flat/recommended"],
  {
    settings: {
      tailwindcss: {
        // Tailwind v4 doesn't use config file - configuration is in CSS
        config: null,
        cssFiles: ['src/index.css'],
      },
    },
    rules: {
      // Disable custom classname check for Tailwind CSS v4
      // v4 uses CSS variables and theme() function instead of config file
      'tailwindcss/no-custom-classname': 'off',
    },
  },
  ...storybook.configs["flat/recommended"],
  prettier
);
