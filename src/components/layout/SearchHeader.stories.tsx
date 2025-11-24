import type { Meta, StoryObj } from "@storybook/react-vite";
import { SearchHeader } from "./SearchHeader";

/**
 * SearchHeader displays a compact single-row header with:
 * - GitHub icon and app title
 * - Search form for GitHub usernames (wider max-w-2xl)
 * - Theme toggle button
 * - User menu (sign in / avatar dropdown)
 *
 * Layout: [Github Icon] User Analytics  [Search..............] [Theme] [User]
 *
 * Uses proper flex layout without absolute positioning.
 * Tab order: Brand -> Search -> ThemeToggle -> UserMenu
 */
const meta = {
  title: "Layout/SearchHeader",
  component: SearchHeader,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Compact single-row header for the GitHub User Analytics application. Includes brand, search, theme toggle, and user authentication.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    userName: {
      control: "text",
      description: "Current username in the search field",
    },
    onSearch: {
      action: "searched",
      description: "Callback when search is submitted",
    },
    userMenuProps: {
      description: "Props passed to the UserMenu component for authentication",
    },
  },
  args: {
    onSearch: () => {},
    userMenuProps: {
      isAuthenticated: false,
      onSignIn: () => {},
      onSignOut: () => {},
    },
  },
} satisfies Meta<typeof SearchHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default state with empty search field and unauthenticated user
 */
export const Default: Story = {
  args: {
    userName: "",
  },
};

/**
 * With a username pre-filled in the search field
 */
export const WithUsername: Story = {
  args: {
    userName: "torvalds",
  },
};

/**
 * Authenticated user with avatar
 */
export const Authenticated: Story = {
  args: {
    userName: "gaearon",
    userMenuProps: {
      isAuthenticated: true,
      user: {
        login: "gaearon",
        avatarUrl: "https://github.com/gaearon.png",
      },
      onSignIn: () => {},
      onSignOut: () => {},
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          "Shows the header when user is authenticated, displaying their avatar.",
      },
    },
  },
};

/**
 * With a long username to test text overflow
 */
export const LongUsername: Story = {
  args: {
    userName: "a-very-long-github-username-that-might-overflow",
  },
  parameters: {
    docs: {
      description: {
        story: "Tests the header behavior with a very long username.",
      },
    },
  },
};

/**
 * Mobile viewport - tests responsive layout
 * Note: Title is hidden on mobile, only icon shows
 */
export const Mobile: Story = {
  args: {
    userName: "",
  },
  parameters: {
    viewport: {
      defaultViewport: "mobile1",
    },
    docs: {
      description: {
        story:
          "Header on mobile devices (320px width). Title hidden, only GitHub icon visible.",
      },
    },
  },
};

/**
 * Mobile viewport with authenticated user
 */
export const MobileAuthenticated: Story = {
  args: {
    userName: "torvalds",
    userMenuProps: {
      isAuthenticated: true,
      user: {
        login: "torvalds",
        avatarUrl: "https://github.com/torvalds.png",
      },
      onSignIn: () => {},
      onSignOut: () => {},
    },
  },
  parameters: {
    viewport: {
      defaultViewport: "mobile1",
    },
    docs: {
      description: {
        story: "Mobile view with authenticated user showing avatar.",
      },
    },
  },
};

/**
 * Tablet viewport - tests responsive layout
 */
export const Tablet: Story = {
  args: {
    userName: "facebook",
  },
  parameters: {
    viewport: {
      defaultViewport: "tablet",
    },
    docs: {
      description: {
        story: "Header on tablet devices (768px width).",
      },
    },
  },
};

/**
 * Desktop wide viewport (1440px+)
 * Search field expands to max-w-2xl
 */
export const DesktopWide: Story = {
  args: {
    userName: "microsoft",
    userMenuProps: {
      isAuthenticated: true,
      user: {
        login: "microsoft",
        avatarUrl: "https://github.com/microsoft.png",
      },
      onSignIn: () => {},
      onSignOut: () => {},
    },
  },
  parameters: {
    viewport: {
      viewportConfig: {
        width: 1440,
        height: 900,
      },
    },
    docs: {
      description: {
        story:
          "Header on wide desktop (1440px). Search field uses full max-w-2xl width.",
      },
    },
  },
};
