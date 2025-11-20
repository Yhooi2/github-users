import type { Meta, StoryObj } from "@storybook/react-vite";
import { UserStats } from "./UserStats";

const meta: Meta<typeof UserStats> = {
  title: "User/UserStats",
  component: UserStats,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof UserStats>;

export const Default: Story = {
  args: {
    stats: {
      repositories: 42,
      followers: 1234,
      following: 89,
      gists: 15,
    },
  },
};

export const HighActivity: Story = {
  args: {
    stats: {
      repositories: 523,
      followers: 15420,
      following: 342,
      gists: 187,
    },
  },
};

export const NewUser: Story = {
  args: {
    stats: {
      repositories: 2,
      followers: 5,
      following: 12,
      gists: 0,
    },
  },
};

export const ZeroStats: Story = {
  args: {
    stats: {
      repositories: 0,
      followers: 0,
      following: 0,
      gists: 0,
    },
  },
};

export const PopularUser: Story = {
  args: {
    stats: {
      repositories: 89,
      followers: 25600,
      following: 45,
      gists: 234,
    },
  },
};

export const LargeNumbers: Story = {
  args: {
    stats: {
      repositories: 1250,
      followers: 128450,
      following: 3456,
      gists: 789,
    },
  },
};
