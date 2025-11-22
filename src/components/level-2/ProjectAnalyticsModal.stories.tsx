import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import type { TabName } from "@/hooks";
import { ProjectAnalyticsModal, type ProjectForModal } from "./ProjectAnalyticsModal";

const meta = {
  title: "Level-2/ProjectAnalyticsModal",
  component: ProjectAnalyticsModal,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  args: {
    onOpenChange: () => {},
    onTabChange: () => {},
  },
} satisfies Meta<typeof ProjectAnalyticsModal>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleProject: ProjectForModal = {
  id: "1",
  name: "react-dashboard",
  description:
    "A modern React dashboard with charts, tables, and real-time data visualization. Built with React 19 and Tailwind CSS.",
  url: "https://github.com/user/react-dashboard",
  stars: 1250,
  forks: 89,
};

/**
 * Default open state with overview tab
 */
export const Default: Story = {
  args: {
    open: true,
    project: sampleProject,
    activeTab: "overview",
  },
};

/**
 * Timeline tab selected
 */
export const TimelineTab: Story = {
  args: {
    open: true,
    project: sampleProject,
    activeTab: "timeline",
  },
};

/**
 * Code tab selected
 */
export const CodeTab: Story = {
  args: {
    open: true,
    project: sampleProject,
    activeTab: "code",
  },
};

/**
 * Team tab selected
 */
export const TeamTab: Story = {
  args: {
    open: true,
    project: sampleProject,
    activeTab: "team",
  },
};

/**
 * Interactive demo with tab switching
 */
export const Interactive: Story = {
  render: () => {
    const [open, setOpen] = useState(true);
    const [activeTab, setActiveTab] = useState<TabName>("overview");

    return (
      <div className="p-4">
        <button
          onClick={() => setOpen(true)}
          className="rounded bg-primary px-4 py-2 text-primary-foreground"
        >
          Open Modal
        </button>
        <ProjectAnalyticsModal
          open={open}
          onOpenChange={setOpen}
          project={sampleProject}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </div>
    );
  },
};

/**
 * Closed state (for testing transitions)
 */
export const Closed: Story = {
  args: {
    open: false,
    project: sampleProject,
    activeTab: "overview",
  },
};

/**
 * Project with long name/description
 */
export const LongContent: Story = {
  args: {
    open: true,
    project: {
      ...sampleProject,
      name: "this-is-a-very-long-repository-name-that-might-overflow",
      description:
        "This is a very long description that should be truncated to prevent the modal header from becoming too tall. It contains a lot of detail about what the project does, its features, and its purpose.",
    },
    activeTab: "overview",
  },
};
