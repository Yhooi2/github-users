/**
 * Stories for ProfileHeaderExtendedGlass from shadcn-glass-ui
 *
 * Provides direct access to the library component for debugging.
 */
import type { Meta, StoryObj } from "@storybook/react-vite";
import { ProfileHeaderExtendedGlass } from "shadcn-glass-ui/components";

const meta: Meta<typeof ProfileHeaderExtendedGlass> = {
  title: "Components/Sections/ProfileHeaderExtendedGlass",
  component: ProfileHeaderExtendedGlass,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ProfileHeaderExtendedGlass>;

const mockUser = {
  avatarUrl: "https://avatars.githubusercontent.com/u/583231?v=4",
  name: "The Octocat",
  login: "octocat",
  bio: "GitHub mascot and all-around friendly feline. Cat enthusiast. Emoji lover.",
  location: "San Francisco, CA",
  url: "https://github.com/octocat",
  createdAt: "2011-01-25T18:44:36Z",
};

export const Default: Story = {
  args: {
    user: mockUser,
  },
};

export const WithStats: Story = {
  args: {
    user: mockUser,
    extended: {
      stats: {
        repositories: 42,
        followers: 1234,
        following: 56,
        gists: 8,
      },
    },
  },
};

export const WithLanguages: Story = {
  args: {
    user: mockUser,
    extended: {
      languages: [
        { name: "TypeScript", percent: 45, color: "#3178c6" },
        { name: "JavaScript", percent: 30, color: "#f1e05a" },
        { name: "Python", percent: 15, color: "#3572A5" },
        { name: "Go", percent: 10, color: "#00ADD8" },
      ],
    },
  },
};

export const WithStatsAndLanguages: Story = {
  args: {
    user: mockUser,
    extended: {
      stats: {
        repositories: 42,
        followers: 1234,
        following: 56,
        gists: 8,
      },
      languages: [
        { name: "TypeScript", percent: 45, color: "#3178c6" },
        { name: "JavaScript", percent: 30, color: "#f1e05a" },
        { name: "Python", percent: 15, color: "#3572A5" },
        { name: "Go", percent: 10, color: "#00ADD8" },
      ],
    },
  },
};

export const MinimalProfile: Story = {
  args: {
    user: {
      ...mockUser,
      name: null,
      bio: null,
      location: null,
    },
  },
};

export const LongBio: Story = {
  args: {
    user: {
      ...mockUser,
      bio: "Senior Software Engineer passionate about open source, distributed systems, and developer experience. Building tools that developers love. Contributing to the community one PR at a time. Always learning, always growing. Open to collaboration!",
    },
    extended: {
      stats: {
        repositories: 150,
        followers: 5000,
        following: 200,
        gists: 25,
      },
    },
  },
};

export const ManyLanguages: Story = {
  args: {
    user: mockUser,
    extended: {
      languages: [
        { name: "TypeScript", percent: 25, color: "#3178c6" },
        { name: "JavaScript", percent: 20, color: "#f1e05a" },
        { name: "Python", percent: 15, color: "#3572A5" },
        { name: "Go", percent: 12, color: "#00ADD8" },
        { name: "Rust", percent: 10, color: "#dea584" },
        { name: "Java", percent: 8, color: "#b07219" },
        { name: "C++", percent: 5, color: "#f34b7d" },
        { name: "Shell", percent: 5, color: "#89e051" },
      ],
    },
  },
};
