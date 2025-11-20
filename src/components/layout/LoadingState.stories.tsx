import type { Meta, StoryObj } from "@storybook/react-vite";
import { LoadingState } from "./LoadingState";

const meta: Meta<typeof LoadingState> = {
  title: "Layout/LoadingState",
  component: LoadingState,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "LoadingState displays skeleton loaders for different content types while data is being fetched.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "card", "profile", "list"],
      description: "The visual style of the loading state",
    },
    count: {
      control: "number",
      description: "Number of items to show (only for list variant)",
    },
    message: {
      control: "text",
      description: "Optional message to display below skeleton",
    },
  },
};

export default meta;
type Story = StoryObj<typeof LoadingState>;

/**
 * Default loading state with simple skeleton lines
 */
export const Default: Story = {
  args: {},
};

/**
 * Loading state with a custom message
 */
export const WithMessage: Story = {
  args: {
    message: "Loading user data...",
  },
};

/**
 * Card-style loading skeleton
 */
export const Card: Story = {
  args: {
    variant: "card",
  },
};

/**
 * Card with loading message
 */
export const CardWithMessage: Story = {
  args: {
    variant: "card",
    message: "Fetching repository information...",
  },
};

/**
 * User profile loading skeleton
 */
export const Profile: Story = {
  args: {
    variant: "profile",
  },
};

/**
 * Profile with loading message
 */
export const ProfileWithMessage: Story = {
  args: {
    variant: "profile",
    message: "Loading GitHub profile...",
  },
};

/**
 * List loading skeleton with default count (3 items)
 */
export const List: Story = {
  args: {
    variant: "list",
  },
};

/**
 * List with custom count
 */
export const ListWithFiveItems: Story = {
  args: {
    variant: "list",
    count: 5,
  },
};

/**
 * List with single item
 */
export const ListWithOneItem: Story = {
  args: {
    variant: "list",
    count: 1,
  },
};

/**
 * List with many items
 */
export const ListWithManyItems: Story = {
  args: {
    variant: "list",
    count: 10,
    message: "Loading repositories...",
  },
};
