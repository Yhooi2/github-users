import type { Meta, StoryObj } from "@storybook/react-vite";
import { ContributionHistory } from "./ContributionHistory";

const meta: Meta<typeof ContributionHistory> = {
  title: "User/ContributionHistory",
  component: ContributionHistory,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ContributionHistory>;

export const Default: Story = {
  args: {
    contributions: {
      year1: { totalCommitContributions: 456 },
      year2: { totalCommitContributions: 723 },
      year3: { totalCommitContributions: 891 },
    },
    yearLabels: {
      year1: 2022,
      year2: 2023,
      year3: 2024,
    },
  },
};

export const HighActivity: Story = {
  args: {
    contributions: {
      year1: { totalCommitContributions: 1523 },
      year2: { totalCommitContributions: 2187 },
      year3: { totalCommitContributions: 2945 },
    },
    yearLabels: {
      year1: 2022,
      year2: 2023,
      year3: 2024,
    },
  },
};

export const LowActivity: Story = {
  args: {
    contributions: {
      year1: { totalCommitContributions: 45 },
      year2: { totalCommitContributions: 67 },
      year3: { totalCommitContributions: 89 },
    },
    yearLabels: {
      year1: 2022,
      year2: 2023,
      year3: 2024,
    },
  },
};

export const ZeroCommits: Story = {
  args: {
    contributions: {
      year1: { totalCommitContributions: 0 },
      year2: { totalCommitContributions: 0 },
      year3: { totalCommitContributions: 0 },
    },
    yearLabels: {
      year1: 2022,
      year2: 2023,
      year3: 2024,
    },
  },
};

export const IncreasingTrend: Story = {
  args: {
    contributions: {
      year1: { totalCommitContributions: 234 },
      year2: { totalCommitContributions: 567 },
      year3: { totalCommitContributions: 1023 },
    },
    yearLabels: {
      year1: 2022,
      year2: 2023,
      year3: 2024,
    },
  },
};

export const DecreasingTrend: Story = {
  args: {
    contributions: {
      year1: { totalCommitContributions: 1523 },
      year2: { totalCommitContributions: 876 },
      year3: { totalCommitContributions: 345 },
    },
    yearLabels: {
      year1: 2022,
      year2: 2023,
      year3: 2024,
    },
  },
};

export const LargeNumbers: Story = {
  args: {
    contributions: {
      year1: { totalCommitContributions: 12456 },
      year2: { totalCommitContributions: 15789 },
      year3: { totalCommitContributions: 18234 },
    },
    yearLabels: {
      year1: 2022,
      year2: 2023,
      year3: 2024,
    },
  },
};
