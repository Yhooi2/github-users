import { withThemeByClassName } from "@storybook/addon-themes";
import type { Preview, ReactRenderer } from "@storybook/react-vite";
import type { DecoratorFunction } from "@storybook/types";
import { ThemeProvider } from "shadcn-glass-ui";
import "../src/index.css";

const withGlassThemeProvider: DecoratorFunction<ReactRenderer> = (Story) => (
  <ThemeProvider defaultTheme="glass">
    <Story />
  </ThemeProvider>
);

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    layout: "centered",
    docs: {
      source: {
        state: "collapsed",
      },
    },
  },
  decorators: [
    withGlassThemeProvider,
    withThemeByClassName({
      themes: {
        light: "",
        dark: "dark",
      },
      defaultTheme: "light",
    }),
  ],
};

export default preview;
