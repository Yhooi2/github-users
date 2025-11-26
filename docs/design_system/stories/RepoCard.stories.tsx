import type { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";
import { RepoCard } from "../RepoCard";
import { ThemeProvider } from "../../context/ThemeContext";
import { Background } from "../Background";
import type { RepoData } from "../../types";

const meta: Meta<typeof RepoCard> = {
  title: "Design System/Desktop/RepoCard",
  component: RepoCard,
  decorators: [
    (Story) => (
      <ThemeProvider defaultTheme="glass">
        <Background>
          <div className="p-8 w-[500px]">
            <Story />
          </div>
        </Background>
      </ThemeProvider>
    ),
  ],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "A glassmorphism card for displaying repository information with expandable details, status indicator, and action buttons.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    expanded: {
      control: "boolean",
      description: "Expanded state",
    },
    showFlaggedOnly: {
      control: "boolean",
      description: "Show flagged issues inline",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const goodRepo: RepoData = {
  name: "Wildhaven-website",
  status: "good",
  stars: 1,
  commits: 240,
  contribution: 75,
  langs: [
    { name: "JS", percent: 88, color: "bg-yellow-400" },
    { name: "Shell", percent: 11, color: "bg-emerald-500" },
  ],
};

const warningRepo: RepoData = {
  name: "study",
  status: "warning",
  stars: 2,
  commits: 177,
  contribution: 100,
  langs: [
    { name: "Python", percent: 92, color: "bg-emerald-500" },
    { name: "C", percent: 5, color: "bg-slate-500" },
  ],
  issues: ["Uneven activity (3 burst days)"],
};

const criticalRepo: RepoData = {
  name: "bot-scripts",
  status: "critical",
  stars: 0,
  commits: 89,
  contribution: 100,
  langs: [{ name: "Python", percent: 100, color: "bg-emerald-500" }],
  issues: ["Empty commits (avg 3 lines/commit)", "Burst: 67 commits on Oct 15"],
};

// Interactive wrapper
const InteractiveRepoCard = ({
  repo,
  showFlaggedOnly = false,
}: {
  repo: RepoData;
  showFlaggedOnly?: boolean;
}) => {
  const [expanded, setExpanded] = useState(false);
  return (
    <RepoCard
      repo={repo}
      expanded={expanded}
      showFlaggedOnly={showFlaggedOnly}
      onClick={() => setExpanded(!expanded)}
      onGitHubClick={() => alert("Open GitHub")}
      onAnalysisClick={() => alert("Run AI Analysis")}
    />
  );
};

export const GoodStatus: Story = {
  render: () => <InteractiveRepoCard repo={goodRepo} />,
};

export const WarningStatus: Story = {
  render: () => <InteractiveRepoCard repo={warningRepo} />,
};

export const CriticalStatus: Story = {
  render: () => <InteractiveRepoCard repo={criticalRepo} />,
};

export const Expanded: Story = {
  args: {
    repo: goodRepo,
    expanded: true,
    onClick: () => {},
    onGitHubClick: () => alert("GitHub"),
    onAnalysisClick: () => alert("Analysis"),
  },
};

export const ExpandedWithIssues: Story = {
  args: {
    repo: criticalRepo,
    expanded: true,
    onClick: () => {},
    onGitHubClick: () => alert("GitHub"),
    onAnalysisClick: () => alert("Analysis"),
  },
};

export const FlaggedOnlyMode: Story = {
  render: () => <InteractiveRepoCard repo={warningRepo} showFlaggedOnly />,
};

export const RepositoryList: Story = {
  render: () => {
    const [expandedIdx, setExpandedIdx] = useState<number | null>(null);
    const repos = [goodRepo, warningRepo, criticalRepo];
    return (
      <div className="space-y-2">
        {repos.map((repo, idx) => (
          <RepoCard
            key={repo.name}
            repo={repo}
            expanded={expandedIdx === idx}
            onClick={() => setExpandedIdx(expandedIdx === idx ? null : idx)}
            onGitHubClick={() => alert(`Open ${repo.name} on GitHub`)}
            onAnalysisClick={() => alert(`Analyze ${repo.name}`)}
          />
        ))}
      </div>
    );
  },
};

export const FlaggedRepositories: Story = {
  render: () => {
    const [expandedIdx, setExpandedIdx] = useState<number | null>(null);
    const repos = [warningRepo, criticalRepo];
    return (
      <div className="space-y-2">
        {repos.map((repo, idx) => (
          <RepoCard
            key={repo.name}
            repo={repo}
            expanded={expandedIdx === idx}
            showFlaggedOnly
            onClick={() => setExpandedIdx(expandedIdx === idx ? null : idx)}
            onGitHubClick={() => alert(`Open ${repo.name} on GitHub`)}
            onAnalysisClick={() => alert(`Analyze ${repo.name}`)}
          />
        ))}
      </div>
    );
  },
};
