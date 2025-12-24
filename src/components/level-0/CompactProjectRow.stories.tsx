import type { Meta, StoryObj } from "@storybook/react-vite";
import { CompactProjectRow } from "./index";

const meta = {
  title: "Level-0/CompactProjectRow",
  component: CompactProjectRow,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  args: {
    onClick: () => {},
  },
  decorators: [
    (Story) => (
      <div className="max-w-2xl">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof CompactProjectRow>;

export default meta;
type Story = StoryObj<typeof meta>;

const baseProject = {
  id: "1",
  name: "react-dashboard",
  commits: 347,
  stars: 1250,
  language: "TypeScript",
  isOwner: true,
  description:
    "A modern React dashboard with charts, tables, and real-time data visualization",
};

/**
 * Default state showing an owner project
 */
export const Default: Story = {
  args: {
    project: baseProject,
    maxCommits: 500,
    isExpanded: false,
  },
};

/**
 * Contributor project with green accent bar
 */
export const Contributor: Story = {
  args: {
    project: {
      ...baseProject,
      id: "2",
      name: "open-source-lib",
      isOwner: false,
      commits: 42,
      stars: 15600,
    },
    maxCommits: 500,
    isExpanded: false,
  },
};

/**
 * Project is currently expanded (Level 1 visible)
 */
export const Expanded: Story = {
  args: {
    project: baseProject,
    maxCommits: 500,
    isExpanded: true,
  },
};

/**
 * Project with maximum commits (full bar height)
 */
export const MaxCommits: Story = {
  args: {
    project: {
      ...baseProject,
      commits: 500,
    },
    maxCommits: 500,
    isExpanded: false,
  },
};

/**
 * Project with minimal commits (short bar)
 */
export const MinCommits: Story = {
  args: {
    project: {
      ...baseProject,
      commits: 5,
    },
    maxCommits: 500,
    isExpanded: false,
  },
};

/**
 * Project without description (hover card shows minimal info)
 */
export const NoDescription: Story = {
  args: {
    project: {
      id: "3",
      name: "simple-cli-tool",
      commits: 89,
      stars: 45,
      language: "Go",
      isOwner: true,
    },
    maxCommits: 500,
    isExpanded: false,
  },
};

/**
 * Different languages with their colors
 */
export const DifferentLanguages: Story = {
  render: () => (
    <div className="space-y-2">
      {[
        { language: "TypeScript", name: "ts-project" },
        { language: "JavaScript", name: "js-project" },
        { language: "Python", name: "py-project" },
        { language: "Rust", name: "rust-project" },
        { language: "Go", name: "go-project" },
      ].map((lang, i) => (
        <CompactProjectRow
          key={lang.name}
          project={{
            id: String(i),
            name: lang.name,
            commits: 100 + i * 50,
            stars: 200 + i * 100,
            language: lang.language,
            isOwner: i % 2 === 0,
          }}
          maxCommits={400}
          isExpanded={false}
          onClick={() => {}}
        />
      ))}
    </div>
  ),
};

/**
 * Long project name (truncated)
 */
export const LongName: Story = {
  args: {
    project: {
      ...baseProject,
      name: "this-is-a-very-long-repository-name-that-should-be-truncated",
    },
    maxCommits: 500,
    isExpanded: false,
  },
};

/**
 * High star count (formatted with K/M suffix)
 */
export const HighStars: Story = {
  args: {
    project: {
      ...baseProject,
      stars: 158000,
    },
    maxCommits: 500,
    isExpanded: false,
  },
};
