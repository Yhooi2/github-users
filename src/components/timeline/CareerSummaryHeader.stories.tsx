import type { Meta, StoryObj } from '@storybook/react';
import { CareerSummaryHeader } from './CareerSummaryHeader';

const meta: Meta<typeof CareerSummaryHeader> = {
  title: 'Timeline/CareerSummaryHeader',
  component: CareerSummaryHeader,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof CareerSummaryHeader>;

export const Default: Story = {
  args: {
    summary: {
      totalCommits: 5420,
      totalPRs: 145,
      yearsActive: 5,
      totalYears: 6,
      startYear: 2019,
      uniqueRepos: 42,
    },
  },
};

export const EarlyCareer: Story = {
  args: {
    summary: {
      totalCommits: 420,
      totalPRs: 12,
      yearsActive: 2,
      totalYears: 2,
      startYear: 2023,
      uniqueRepos: 8,
    },
  },
};

export const Veteran: Story = {
  args: {
    summary: {
      totalCommits: 15820,
      totalPRs: 892,
      yearsActive: 10,
      totalYears: 10,
      startYear: 2014,
      uniqueRepos: 156,
    },
  },
};

export const NoPRs: Story = {
  args: {
    summary: {
      totalCommits: 1200,
      totalPRs: 0,
      yearsActive: 3,
      totalYears: 3,
      startYear: 2021,
      uniqueRepos: 15,
    },
  },
};
