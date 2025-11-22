import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import type { CompactProject } from "./CompactProjectRow";
import { ProjectListContainer, type SortOption } from "./ProjectListContainer";

const meta = {
  title: "Level-0/ProjectListContainer",
  component: ProjectListContainer,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  args: {
    onSortChange: () => {},
    onProjectClick: () => {},
  },
  decorators: [
    (Story) => (
      <div className="max-w-2xl">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ProjectListContainer>;

export default meta;
type Story = StoryObj<typeof meta>;

// Sample projects data
const sampleProjects: CompactProject[] = [
  {
    id: "1",
    name: "react-dashboard",
    commits: 347,
    stars: 1250,
    language: "TypeScript",
    isOwner: true,
    description: "A modern React dashboard with real-time data visualization",
  },
  {
    id: "2",
    name: "api-gateway",
    commits: 156,
    stars: 89,
    language: "Go",
    isOwner: true,
    description: "High-performance API gateway with rate limiting",
  },
  {
    id: "3",
    name: "cli-tools",
    commits: 89,
    stars: 45,
    language: "Rust",
    isOwner: true,
  },
  {
    id: "4",
    name: "next.js",
    commits: 42,
    stars: 125000,
    language: "TypeScript",
    isOwner: false,
    description: "The React Framework for the Web",
  },
  {
    id: "5",
    name: "tailwindcss",
    commits: 28,
    stars: 82000,
    language: "JavaScript",
    isOwner: false,
    description: "A utility-first CSS framework",
  },
  {
    id: "6",
    name: "prisma",
    commits: 15,
    stars: 38000,
    language: "TypeScript",
    isOwner: false,
  },
];

/**
 * Default view with mixed owned and contributed projects
 */
export const Default: Story = {
  args: {
    projects: sampleProjects,
    year: 2024,
    sortBy: "commits",
    expandedProjects: new Set(),
  },
};

/**
 * Interactive example with state
 */
export const Interactive: Story = {
  render: () => {
    const [sortBy, setSortBy] = useState<SortOption>("commits");
    const [expanded, setExpanded] = useState<Set<string>>(new Set());

    const handleClick = (id: string) => {
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

    return (
      <ProjectListContainer
        projects={sampleProjects}
        year={2024}
        sortBy={sortBy}
        onSortChange={setSortBy}
        onProjectClick={handleClick}
        expandedProjects={expanded}
      />
    );
  },
};

/**
 * Only owned projects
 */
export const OnlyOwned: Story = {
  args: {
    projects: sampleProjects.filter((p) => p.isOwner),
    year: 2024,
    sortBy: "commits",
    expandedProjects: new Set(),
  },
};

/**
 * Only contributions
 */
export const OnlyContributions: Story = {
  args: {
    projects: sampleProjects.filter((p) => !p.isOwner),
    year: 2024,
    sortBy: "stars",
    expandedProjects: new Set(),
  },
};

/**
 * Empty state when no projects
 */
export const Empty: Story = {
  args: {
    projects: [],
    year: 2023,
    sortBy: "commits",
    expandedProjects: new Set(),
  },
};

/**
 * Sorted by stars
 */
export const SortedByStars: Story = {
  args: {
    projects: sampleProjects,
    year: 2024,
    sortBy: "stars",
    expandedProjects: new Set(),
  },
};

/**
 * With expanded project
 */
export const WithExpanded: Story = {
  args: {
    projects: sampleProjects,
    year: 2024,
    sortBy: "commits",
    expandedProjects: new Set(["1", "4"]),
  },
};

/**
 * Many projects (scrollable)
 */
export const ManyProjects: Story = {
  args: {
    projects: [
      ...sampleProjects,
      ...sampleProjects.map((p, i) => ({
        ...p,
        id: `extra-${i}`,
        name: `${p.name}-${i + 1}`,
        commits: p.commits - i * 10,
      })),
    ],
    year: 2024,
    sortBy: "commits",
    expandedProjects: new Set(),
  },
};
