import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { ExpandableProjectCard, type ExpandableProject } from "./ExpandableProjectCard";

const meta = {
  title: "Level-1/ExpandableProjectCard",
  component: ExpandableProjectCard,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  args: {
    onToggle: () => {},
  },
  decorators: [
    (Story) => (
      <div className="max-w-2xl">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ExpandableProjectCard>;

export default meta;
type Story = StoryObj<typeof meta>;

// Full project with all metrics
const fullProject: ExpandableProject = {
  id: "1",
  name: "react-dashboard",
  commits: 347,
  stars: 1250,
  language: "TypeScript",
  languages: [
    { name: "TypeScript", percent: 68, size: 45230 },
    { name: "JavaScript", percent: 22, size: 14560 },
    { name: "CSS", percent: 10, size: 6820 },
  ],
  isOwner: true,
  isFork: false,
  description:
    "A modern React dashboard with charts, tables, and real-time data visualization. Built with React 19 and Tailwind CSS.",
  url: "https://github.com/user/react-dashboard",
  forks: 89,
  contributionPercent: 18,
  totalCommits: 1923,
  userCommits: 346,
  prsMerged: 42,
  reviews: 156,
  activePeriod: "Jan 2024 - Nov 2025",
  teamCount: 12,
  topContributors: [
    { name: "Alice Johnson", avatar: "https://i.pravatar.cc/150?u=alice", login: "alice", commits: 423, prs: 18 },
    { name: "Bob Smith", avatar: "https://i.pravatar.cc/150?u=bob", login: "bob", commits: 312, prs: 14 },
    { name: "Charlie Brown", avatar: "https://i.pravatar.cc/150?u=charlie", login: "charlie", commits: 198, prs: 8 },
  ],
};

// Minimal project with only required fields
const minimalProject: ExpandableProject = {
  id: "2",
  name: "simple-lib",
  commits: 45,
  stars: 12,
  language: "JavaScript",
  isOwner: true,
  isFork: false,
  url: "https://github.com/user/simple-lib",
};

// Forked project
const forkedProject: ExpandableProject = {
  ...fullProject,
  id: "3",
  name: "next.js",
  isFork: true,
  isOwner: false,
  stars: 125000,
  forks: 28000,
  contributionPercent: 2,
  totalCommits: 15420,
  userCommits: 308,
  prsMerged: 8,
  reviews: 24,
  activePeriod: "Mar 2024 - Oct 2024",
  teamCount: 245,
};

// Project with many languages
const polyglotProject: ExpandableProject = {
  ...fullProject,
  id: "4",
  name: "fullstack-app",
  languages: [
    { name: "TypeScript", percent: 45 },
    { name: "Python", percent: 25 },
    { name: "Go", percent: 15 },
    { name: "Rust", percent: 8 },
    { name: "Shell", percent: 4 },
    { name: "Dockerfile", percent: 2 },
    { name: "YAML", percent: 1 },
  ],
};

// Project with large team
const largeTeamProject: ExpandableProject = {
  ...fullProject,
  id: "5",
  name: "enterprise-platform",
  teamCount: 50,
  topContributors: [
    { name: "Alice", avatar: "https://i.pravatar.cc/150?u=alice1", login: "alice1", commits: 523 },
    { name: "Bob", avatar: "https://i.pravatar.cc/150?u=bob1", login: "bob1", commits: 412 },
    { name: "Charlie", avatar: "https://i.pravatar.cc/150?u=charlie1", login: "charlie1", commits: 398 },
    { name: "Diana", avatar: "https://i.pravatar.cc/150?u=diana1", login: "diana1", commits: 287 },
    { name: "Eve", avatar: "https://i.pravatar.cc/150?u=eve1", login: "eve1", commits: 256 },
    { name: "Frank", avatar: "https://i.pravatar.cc/150?u=frank1", login: "frank1", commits: 198 },
  ],
};

/**
 * Collapsed state with minimal data
 */
export const CollapsedMinimal: Story = {
  args: {
    project: minimalProject,
    isExpanded: false,
    maxCommits: 500,
  },
};

/**
 * Collapsed state with full data
 */
export const CollapsedFull: Story = {
  args: {
    project: fullProject,
    isExpanded: false,
    maxCommits: 500,
  },
};

/**
 * Expanded state with all metrics inline
 */
export const ExpandedFull: Story = {
  args: {
    project: fullProject,
    isExpanded: true,
    maxCommits: 500,
  },
};

/**
 * Expanded minimal - only basic info shown
 */
export const ExpandedMinimal: Story = {
  args: {
    project: minimalProject,
    isExpanded: true,
    maxCommits: 500,
  },
};

/**
 * Forked project (contributor view)
 */
export const ForkedProject: Story = {
  args: {
    project: forkedProject,
    isExpanded: true,
    maxCommits: 500,
  },
};

/**
 * Project with many languages (>5)
 */
export const ManyLanguages: Story = {
  args: {
    project: polyglotProject,
    isExpanded: true,
    maxCommits: 500,
  },
};

/**
 * Project with large team (>5 contributors shown)
 */
export const LargeTeam: Story = {
  args: {
    project: largeTeamProject,
    isExpanded: true,
    maxCommits: 500,
  },
};

/**
 * Interactive demo with toggle
 */
export const Interactive: Story = {
  render: () => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
      <ExpandableProjectCard
        project={fullProject}
        isExpanded={isExpanded}
        onToggle={() => setIsExpanded(!isExpanded)}
        maxCommits={500}
      />
    );
  },
};

/**
 * Multiple cards demo
 */
export const MultipleCards: Story = {
  render: () => {
    const [expanded, setExpanded] = useState<Set<string>>(new Set(["1"]));

    const toggle = (id: string) => {
      setExpanded((prev) => {
        const next = new Set(prev);
        if (next.has(id)) {
          next.delete(id);
        } else {
          next.add(id);
        }
        return next;
      });
    };

    const projects: ExpandableProject[] = [
      fullProject,
      { ...minimalProject, id: "2" },
      forkedProject,
    ];

    return (
      <div className="space-y-2">
        {projects.map((project) => (
          <ExpandableProjectCard
            key={project.id}
            project={project}
            isExpanded={expanded.has(project.id)}
            onToggle={() => toggle(project.id)}
            maxCommits={500}
          />
        ))}
      </div>
    );
  },
};

/**
 * Long description (truncated with line-clamp)
 */
export const LongDescription: Story = {
  args: {
    project: {
      ...fullProject,
      description:
        "A comprehensive enterprise-grade React dashboard application featuring real-time data visualization, interactive charts and graphs, customizable widgets, user authentication and authorization, role-based access control, dark mode support, responsive design for all screen sizes, accessibility compliance (WCAG 2.1 AA), internationalization support, and integration with multiple third-party APIs.",
    },
    isExpanded: true,
    maxCommits: 500,
  },
};

/**
 * Mobile viewport
 */
export const MobileView: Story = {
  parameters: {
    viewport: { defaultViewport: "mobile1" },
  },
  args: {
    project: fullProject,
    isExpanded: true,
    maxCommits: 500,
  },
};

/**
 * High contribution percentage
 */
export const HighContribution: Story = {
  args: {
    project: {
      ...fullProject,
      contributionPercent: 75,
      userCommits: 1442,
    },
    isExpanded: true,
    maxCommits: 500,
  },
};

/**
 * No contribution data (just impact)
 */
export const NoContributionData: Story = {
  args: {
    project: {
      ...minimalProject,
      forks: 5,
      teamCount: 3,
    },
    isExpanded: true,
    maxCommits: 500,
  },
};
