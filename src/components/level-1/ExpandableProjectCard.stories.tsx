import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { ExpandableProjectCard, type ExpandableProject } from "./ExpandableProjectCard";
import { ExpandedCardContent } from "./ExpandedCardContent";

const meta = {
  title: "Level-1/ExpandableProjectCard",
  component: ExpandableProjectCard,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  args: {
    onToggle: () => {},
    onOpenAnalytics: () => {},
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

const sampleProject: ExpandableProject = {
  id: "1",
  name: "react-dashboard",
  commits: 347,
  stars: 1250,
  language: "TypeScript",
  isOwner: true,
  description:
    "A modern React dashboard with charts, tables, and real-time data visualization. Built with React 19 and Tailwind CSS.",
  url: "https://github.com/user/react-dashboard",
  forks: 89,
};

const sampleContribution = {
  commitsPercent: 18,
  totalCommits: 1923,
  prsMerged: 42,
  reviews: 156,
  activePeriod: "Jan 2024 - Nov 2025",
};

const sampleTechStack = [
  { lang: "TypeScript", percent: 68 },
  { lang: "JavaScript", percent: 22 },
  { lang: "CSS", percent: 10 },
];

const sampleTeam = {
  count: 12,
  top: [
    { name: "Alice", avatar: "https://i.pravatar.cc/150?u=alice", login: "alice" },
    { name: "Bob", avatar: "https://i.pravatar.cc/150?u=bob", login: "bob" },
    { name: "Charlie", avatar: "https://i.pravatar.cc/150?u=charlie", login: "charlie" },
  ],
};

/**
 * Collapsed state (default)
 */
export const Collapsed: Story = {
  args: {
    project: sampleProject,
    isExpanded: false,
    maxCommits: 500,
  },
};

/**
 * Expanded state with full content
 */
export const Expanded: Story = {
  args: {
    project: sampleProject,
    isExpanded: true,
    maxCommits: 500,
    children: (
      <ExpandedCardContent
        stars={sampleProject.stars}
        forks={sampleProject.forks || 0}
        contribution={sampleContribution}
        techStack={sampleTechStack}
        team={sampleTeam}
      />
    ),
  },
};

/**
 * Contributor project (not owner)
 */
export const ContributorExpanded: Story = {
  args: {
    project: {
      ...sampleProject,
      isOwner: false,
      name: "next.js",
      stars: 125000,
    },
    isExpanded: true,
    maxCommits: 500,
    children: (
      <ExpandedCardContent
        stars={125000}
        forks={28000}
        contribution={{
          commitsPercent: 2,
          totalCommits: 15420,
          prsMerged: 8,
          reviews: 24,
          activePeriod: "Mar 2024 - Oct 2024",
        }}
        techStack={sampleTechStack}
        team={{ count: 245, top: sampleTeam.top }}
      />
    ),
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
        project={sampleProject}
        isExpanded={isExpanded}
        onToggle={() => setIsExpanded(!isExpanded)}
        onOpenAnalytics={() => alert("Opening analytics modal...")}
        maxCommits={500}
      >
        <ExpandedCardContent
          stars={sampleProject.stars}
          forks={sampleProject.forks || 0}
          contribution={sampleContribution}
          techStack={sampleTechStack}
          team={sampleTeam}
        />
      </ExpandableProjectCard>
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
      sampleProject,
      {
        ...sampleProject,
        id: "2",
        name: "api-gateway",
        language: "Go",
        commits: 156,
        stars: 89,
      },
      {
        ...sampleProject,
        id: "3",
        name: "cli-tools",
        language: "Rust",
        commits: 89,
        stars: 45,
        isOwner: false,
      },
    ];

    return (
      <div className="space-y-2">
        {projects.map((project) => (
          <ExpandableProjectCard
            key={project.id}
            project={project}
            isExpanded={expanded.has(project.id)}
            onToggle={() => toggle(project.id)}
            onOpenAnalytics={() => {}}
            maxCommits={500}
          >
            {expanded.has(project.id) && (
              <ExpandedCardContent
                stars={project.stars}
                forks={project.forks || 0}
                contribution={sampleContribution}
                techStack={sampleTechStack}
                team={sampleTeam}
              />
            )}
          </ExpandableProjectCard>
        ))}
      </div>
    );
  },
};

/**
 * Loading state
 */
export const Loading: Story = {
  args: {
    project: sampleProject,
    isExpanded: true,
    maxCommits: 500,
    children: (
      <ExpandedCardContent stars={0} forks={0} isLoading />
    ),
  },
};
