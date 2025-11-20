import type { Meta, StoryObj } from "@storybook/react";
import { UserMenu } from "./UserMenu";
const noop = () => {};

const meta: Meta<typeof UserMenu> = {
  title: "Layout/UserMenu",
  component: UserMenu,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: {
    onSignIn: noop,
    onSignOut: noop,
  },
};

export default meta;
type Story = StoryObj<typeof UserMenu>;

/**
 * Unauthenticated state showing "Sign in with GitHub" button
 */
export const Unauthenticated: Story = {
  args: {
    isAuthenticated: false,
  },
};

/**
 * Authenticated state with user avatar and dropdown menu
 */
export const Authenticated: Story = {
  args: {
    isAuthenticated: true,
    user: {
      login: "octocat",
      avatarUrl: "https://avatars.githubusercontent.com/u/583231?v=4",
    },
  },
};

/**
 * Authenticated with long username to test overflow
 */
export const LongUsername: Story = {
  args: {
    isAuthenticated: true,
    user: {
      login: "very-long-username-for-testing-overflow",
      avatarUrl: "https://avatars.githubusercontent.com/u/583231?v=4",
    },
  },
};

/**
 * Authenticated without avatar (fallback to initials)
 */
export const NoAvatar: Story = {
  args: {
    isAuthenticated: true,
    user: {
      login: "testuser",
      avatarUrl: "", // Empty avatar URL
    },
  },
};

/**
 * Authenticated with broken avatar URL (fallback to initials)
 */
export const BrokenAvatar: Story = {
  args: {
    isAuthenticated: true,
    user: {
      login: "johndoe",
      avatarUrl: "https://invalid.example.com/broken.png",
    },
  },
};

/**
 * Single character username
 */
export const SingleCharUsername: Story = {
  args: {
    isAuthenticated: true,
    user: {
      login: "x",
      avatarUrl: "https://avatars.githubusercontent.com/u/583231?v=4",
    },
  },
};
