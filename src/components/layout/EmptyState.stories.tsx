import type { Meta, StoryObj } from "@storybook/react-vite";
import { EmptyState } from "./EmptyState";

const meta: Meta<typeof EmptyState> = {
  title: "Layout/EmptyState",
  component: EmptyState,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "EmptyState displays a friendly message when no data is available, with optional actions.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    title: {
      control: "text",
      description: "Title/heading for empty state",
    },
    description: {
      control: "text",
      description: "Description/message",
    },
    icon: {
      control: "select",
      options: ["search", "question", "inbox", "folder", "database", "user"],
      description: "Icon variant to display",
    },
    actionText: {
      control: "text",
      description: "Action button text",
    },
    secondaryActionText: {
      control: "text",
      description: "Secondary action button text",
    },
  },
  args: {},
};

export default meta;
type Story = StoryObj<typeof EmptyState>;

/**
 * Default empty state with inbox icon
 */
export const Default: Story = {
  args: {
    title: "No Data Available",
    description: "There is currently no data to display here.",
    icon: "inbox",
  },
};

/**
 * No repositories found
 */
export const NoRepositories: Story = {
  args: {
    title: "No Repositories Found",
    description:
      "This user has no public repositories or all repositories are filtered out.",
    icon: "folder",
    actionText: "Clear Filters",
  },
};

/**
 * No search results
 */
export const NoSearchResults: Story = {
  args: {
    title: "No Results Found",
    description:
      "Try adjusting your search query or filters to find what you're looking for.",
    icon: "search",
    actionText: "Clear Search",
  },
};

/**
 * User not found
 */
export const UserNotFound: Story = {
  args: {
    title: "User Not Found",
    description:
      "The GitHub user you're looking for doesn't exist or has been deleted.",
    icon: "user",
    actionText: "Search Again",
  },
};

/**
 * No data in database
 */
export const NoData: Story = {
  args: {
    title: "No Data to Display",
    description:
      "Start by searching for a GitHub user to view their profile and statistics.",
    icon: "database",
    actionText: "Get Started",
  },
};

/**
 * With primary action only
 */
export const WithAction: Story = {
  args: {
    title: "Nothing Here Yet",
    description: "Get started by performing an action.",
    icon: "inbox",
    actionText: "Create New",
  },
};

/**
 * With both primary and secondary actions
 */
export const WithBothActions: Story = {
  args: {
    title: "No Repositories Match",
    description:
      "Adjust your filters to see more results or learn about repository filtering.",
    icon: "search",
    actionText: "Reset Filters",
    secondaryActionText: "Learn More",
  },
};

/**
 * With custom action text
 */
export const CustomActionText: Story = {
  args: {
    title: "Empty Inbox",
    description: "You have no pending notifications or updates.",
    icon: "inbox",
    actionText: "Refresh",
    secondaryActionText: "Manage Settings",
  },
};

/**
 * Question icon variant
 */
export const QuestionIcon: Story = {
  args: {
    title: "Page Not Found",
    description: "The page you're looking for doesn't exist or has been moved.",
    icon: "question",
    actionText: "Go Home",
  },
};

/**
 * Long description
 */
export const LongDescription: Story = {
  args: {
    title: "No Contributions Found",
    description:
      "We couldn't find any contributions from this user in the selected time period. This could mean the user was inactive during this time, or their contributions are private. Try selecting a different time range or checking if the user has public activity.",
    icon: "search",
    actionText: "Change Time Range",
    secondaryActionText: "View Profile",
  },
};

/**
 * Without any actions
 */
export const WithoutActions: Story = {
  args: {
    title: "End of Results",
    description: "You've reached the end of the available data.",
    icon: "inbox",
  },
};

/**
 * Minimal text
 */
export const Minimal: Story = {
  args: {
    title: "Empty",
    description: "Nothing to show.",
    icon: "inbox",
  },
};
