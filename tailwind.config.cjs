/** Minimal Tailwind config to satisfy eslint-plugin-tailwindcss resolution
 * This prevents the plugin from trying to resolve a non-existent default
 * config and printing the repeated "Cannot resolve default tailwindcss config path"
 */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,html}",
    "./components/**/*.{js,ts,jsx,tsx,html}",
    "./node_modules/shadcn-glass-ui/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
