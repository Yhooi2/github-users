import type { Meta, StoryObj } from "@storybook/react-vite";
import { Section } from "./Section";

const meta: Meta<typeof Section> = {
  title: "Layout/Section",
  component: Section,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Section wraps content with an optional title, description, and separator for consistent page structure.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    title: {
      control: "text",
      description: "Section title/heading",
    },
    description: {
      control: "text",
      description: "Optional description below title",
    },
    showSeparator: {
      control: "boolean",
      description: "Show separator line below header",
    },
    className: {
      control: "text",
      description: "Additional CSS classes",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Section>;

/**
 * Section with title and content
 */
export const Default: Story = {
  args: {
    title: "Section Title",
    children: (
      <div className="rounded-lg bg-muted p-4">
        <p>
          This is the section content. It can contain any React components or
          elements.
        </p>
      </div>
    ),
  },
};

/**
 * Section with title and description
 */
export const WithDescription: Story = {
  args: {
    title: "User Statistics",
    description: "Overview of user activity and contributions over time",
    children: (
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-lg bg-muted p-4">Stat 1</div>
        <div className="rounded-lg bg-muted p-4">Stat 2</div>
        <div className="rounded-lg bg-muted p-4">Stat 3</div>
      </div>
    ),
  },
};

/**
 * Section without separator
 */
export const WithoutSeparator: Story = {
  args: {
    title: "No Separator",
    description: "This section has no separator line",
    showSeparator: false,
    children: (
      <div className="rounded-lg bg-muted p-4">
        <p>Content without separator above</p>
      </div>
    ),
  },
};

/**
 * Section with only content (no title)
 */
export const ContentOnly: Story = {
  args: {
    children: (
      <div className="rounded-lg bg-muted p-4">
        <p>This section has no title or description, just content.</p>
      </div>
    ),
  },
};

/**
 * Section with long title and description
 */
export const LongText: Story = {
  args: {
    title: "Repository Analysis and Performance Metrics Dashboard",
    description:
      "Comprehensive overview of repository statistics including commit history, language distribution, contribution patterns, and community engagement metrics over the selected time period",
    children: (
      <div className="space-y-4">
        <div className="rounded-lg bg-muted p-4">Chart placeholder</div>
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-lg bg-muted p-4">Metric 1</div>
          <div className="rounded-lg bg-muted p-4">Metric 2</div>
        </div>
      </div>
    ),
  },
};

/**
 * Section with custom className
 */
export const CustomClassName: Story = {
  args: {
    title: "Custom Styled Section",
    description: "This section has custom padding and background",
    className: "p-6 bg-accent rounded-lg",
    children: (
      <div className="rounded-lg bg-background p-4">
        <p>Content with custom section styling</p>
      </div>
    ),
  },
};

/**
 * Multiple sections stacked
 */
export const MultipleSections: Story = {
  render: () => (
    <div className="space-y-8">
      <Section
        title="Repositories"
        description="Public repositories and their statistics"
      >
        <div className="rounded-lg bg-muted p-4">Repository list</div>
      </Section>
      <Section title="Activity" description="Contribution activity over time">
        <div className="rounded-lg bg-muted p-4">Activity chart</div>
      </Section>
      <Section title="Languages" description="Programming languages used">
        <div className="rounded-lg bg-muted p-4">Language breakdown</div>
      </Section>
    </div>
  ),
};

/**
 * Section with complex content
 */
export const ComplexContent: Story = {
  args: {
    title: "User Profile",
    description: "Complete user information and statistics",
    children: (
      <div className="space-y-4">
        <div className="flex gap-4">
          <div className="h-24 w-24 rounded-full bg-muted"></div>
          <div className="flex-1 space-y-2">
            <div className="h-6 w-1/3 rounded bg-muted"></div>
            <div className="h-4 w-1/4 rounded bg-muted"></div>
            <div className="h-4 w-2/3 rounded bg-muted"></div>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-4">
          <div className="rounded-lg bg-muted p-4">Followers</div>
          <div className="rounded-lg bg-muted p-4">Following</div>
          <div className="rounded-lg bg-muted p-4">Repos</div>
          <div className="rounded-lg bg-muted p-4">Gists</div>
        </div>
      </div>
    ),
  },
};

/**
 * Section with title only
 */
export const TitleOnly: Story = {
  args: {
    title: "Simple Title",
    children: (
      <div className="rounded-lg bg-muted p-4">
        <p>Section with title but no description</p>
      </div>
    ),
  },
};

/**
 * Minimal section
 */
export const Minimal: Story = {
  args: {
    children: <div className="p-4">Minimal content</div>,
  },
};
