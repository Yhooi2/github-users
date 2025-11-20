import type { Meta, StoryObj } from "@storybook/react-vite";
import { RecentActivity } from "./RecentActivity";

const meta: Meta<typeof RecentActivity> = {
  title: "User/RecentActivity",
  component: RecentActivity,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof RecentActivity>;

const mockRepositories = [
  {
    repository: { name: "awesome-project" },
    contributions: { totalCount: 127 },
  },
  { repository: { name: "web-app" }, contributions: { totalCount: 89 } },
  { repository: { name: "mobile-client" }, contributions: { totalCount: 56 } },
  { repository: { name: "api-server" }, contributions: { totalCount: 43 } },
  { repository: { name: "documentation" }, contributions: { totalCount: 21 } },
];

export const Default: Story = {
  args: {
    repositories: mockRepositories,
  },
};

export const ThreeRepos: Story = {
  args: {
    repositories: mockRepositories.slice(0, 3),
  },
};

export const SingleRepo: Story = {
  args: {
    repositories: [mockRepositories[0]],
  },
};

export const EmptyRepos: Story = {
  args: {
    repositories: [],
  },
};

export const LargeCommitCounts: Story = {
  args: {
    repositories: [
      {
        repository: { name: "main-project" },
        contributions: { totalCount: 5423 },
      },
      { repository: { name: "frontend" }, contributions: { totalCount: 3187 } },
      { repository: { name: "backend" }, contributions: { totalCount: 2756 } },
      {
        repository: { name: "infrastructure" },
        contributions: { totalCount: 1298 },
      },
      { repository: { name: "tooling" }, contributions: { totalCount: 876 } },
    ],
  },
};

export const CustomMaxItems: Story = {
  args: {
    repositories: [
      ...mockRepositories,
      {
        repository: { name: "extra-repo-1" },
        contributions: { totalCount: 15 },
      },
      {
        repository: { name: "extra-repo-2" },
        contributions: { totalCount: 12 },
      },
      {
        repository: { name: "extra-repo-3" },
        contributions: { totalCount: 8 },
      },
    ],
    maxItems: 3,
  },
};

export const LongRepoNames: Story = {
  args: {
    repositories: [
      {
        repository: {
          name: "very-long-repository-name-that-might-cause-layout-issues",
        },
        contributions: { totalCount: 234 },
      },
      {
        repository: { name: "another-extremely-long-repo-name-for-testing" },
        contributions: { totalCount: 156 },
      },
      { repository: { name: "short" }, contributions: { totalCount: 89 } },
    ],
  },
};

export const SingleCommits: Story = {
  args: {
    repositories: [
      { repository: { name: "repo-one" }, contributions: { totalCount: 1 } },
      { repository: { name: "repo-two" }, contributions: { totalCount: 1 } },
      { repository: { name: "repo-three" }, contributions: { totalCount: 1 } },
    ],
  },
};
