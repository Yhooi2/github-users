import type { Meta, StoryObj } from '@storybook/react';
import { UserAuthenticity } from './UserAuthenticity';
import type { Repository } from '@/apollo/github-api.types';

const meta: Meta<typeof UserAuthenticity> = {
  title: 'User/UserAuthenticity',
  component: UserAuthenticity,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof UserAuthenticity>;

// Mock repositories for high score
const highScoreRepos: Repository[] = [
  {
    id: '1',
    name: 'main-project',
    description: 'Main project',
    isFork: false,
    isArchived: false,
    isTemplate: false,
    stargazerCount: 150,
    forkCount: 30,
    primaryLanguage: { name: 'TypeScript', color: '#3178c6' },
    languages: { edges: [{ node: { name: 'TypeScript', color: '#3178c6' } }] },
    repositoryTopics: { nodes: [] },
    updatedAt: new Date().toISOString(),
    createdAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    name: 'popular-lib',
    description: 'Popular library',
    isFork: false,
    isArchived: false,
    isTemplate: false,
    stargazerCount: 500,
    forkCount: 100,
    primaryLanguage: { name: 'JavaScript', color: '#f1e05a' },
    languages: { edges: [{ node: { name: 'JavaScript', color: '#f1e05a' } }] },
    repositoryTopics: { nodes: [] },
    updatedAt: new Date().toISOString(),
    createdAt: new Date(Date.now() - 730 * 24 * 60 * 60 * 1000).toISOString(),
  },
] as Repository[];

// Mock repositories for medium score
const mediumScoreRepos: Repository[] = [
  ...highScoreRepos.slice(0, 1),
  {
    id: '3',
    name: 'forked-repo',
    description: 'Forked repository',
    isFork: true,
    isArchived: false,
    isTemplate: false,
    stargazerCount: 10,
    forkCount: 2,
    primaryLanguage: { name: 'Python', color: '#3572A5' },
    languages: { edges: [{ node: { name: 'Python', color: '#3572A5' } }] },
    repositoryTopics: { nodes: [] },
    updatedAt: new Date().toISOString(),
    createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(),
  },
] as Repository[];

// Mock repositories for low score
const lowScoreRepos: Repository[] = [
  {
    id: '4',
    name: 'old-archived',
    description: 'Archived project',
    isFork: false,
    isArchived: true,
    isTemplate: false,
    stargazerCount: 2,
    forkCount: 0,
    primaryLanguage: { name: 'JavaScript', color: '#f1e05a' },
    languages: { edges: [{ node: { name: 'JavaScript', color: '#f1e05a' } }] },
    repositoryTopics: { nodes: [] },
    updatedAt: new Date(Date.now() - 730 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 1095 * 24 * 60 * 60 * 1000).toISOString(),
  },
] as Repository[];

export const HighScore: Story = {
  args: {
    repositories: highScoreRepos,
  },
};

export const MediumScore: Story = {
  args: {
    repositories: mediumScoreRepos,
  },
};

export const LowScore: Story = {
  args: {
    repositories: lowScoreRepos,
  },
};

export const EmptyRepositories: Story = {
  args: {
    repositories: [],
  },
};

export const ManyForkedRepos: Story = {
  args: {
    repositories: [
      ...mediumScoreRepos,
      {
        id: '5',
        name: 'fork-1',
        description: 'Forked repo 1',
        isFork: true,
        isArchived: false,
        isTemplate: false,
        stargazerCount: 0,
        forkCount: 0,
        primaryLanguage: null,
        languages: { edges: [] },
        repositoryTopics: { nodes: [] },
        updatedAt: new Date().toISOString(),
        createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '6',
        name: 'fork-2',
        description: 'Forked repo 2',
        isFork: true,
        isArchived: false,
        isTemplate: false,
        stargazerCount: 0,
        forkCount: 0,
        primaryLanguage: null,
        languages: { edges: [] },
        repositoryTopics: { nodes: [] },
        updatedAt: new Date().toISOString(),
        createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ] as Repository[],
  },
};
