import type { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";
import { GlassSelect } from "../GlassSelect";
import { ThemeProvider } from "../../context/ThemeContext";
import { Background } from "../Background";

const meta: Meta<typeof GlassSelect> = {
  title: "Design System/Core/GlassSelect",
  component: GlassSelect,
  decorators: [
    (Story) => (
      <ThemeProvider defaultTheme="glass">
        <Background>
          <div className="p-8">
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
          "A glassmorphism-styled select dropdown with blur effect.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    value: {
      control: "text",
      description: "Selected value",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const sortOptions = [
  { value: "commits", label: "Sort: Commits ↓" },
  { value: "stars", label: "Sort: Stars ↓" },
  { value: "updated", label: "Sort: Updated ↓" },
  { value: "name", label: "Sort: Name A-Z" },
] as const;

const filterOptions = [
  { value: "all", label: "All Repos" },
  { value: "public", label: "Public Only" },
  { value: "private", label: "Private Only" },
  { value: "forked", label: "Forked" },
] as const;

const yearOptions = [
  { value: "2025", label: "2025" },
  { value: "2024", label: "2024" },
  { value: "2023", label: "2023" },
  { value: "all", label: "All Years" },
] as const;

// Interactive component wrapper
const InteractiveSelect = ({
  options,
  defaultValue,
}: {
  options: readonly { value: string; label: string }[];
  defaultValue?: string;
}) => {
  const [value, setValue] = useState(defaultValue || options[0].value);
  return <GlassSelect value={value} onChange={setValue} options={options} />;
};

export const Default: Story = {
  render: () => <InteractiveSelect options={sortOptions} />,
};

export const SortByCommits: Story = {
  render: () => <InteractiveSelect options={sortOptions} defaultValue="commits" />,
};

export const FilterRepos: Story = {
  render: () => <InteractiveSelect options={filterOptions} />,
};

export const YearFilter: Story = {
  render: () => <InteractiveSelect options={yearOptions} />,
};

export const AllExamples: Story = {
  render: () => (
    <div className="space-y-4">
      <div>
        <label className="text-white/70 text-sm mb-1 block">Sort By</label>
        <InteractiveSelect options={sortOptions} />
      </div>
      <div>
        <label className="text-white/70 text-sm mb-1 block">Filter</label>
        <InteractiveSelect options={filterOptions} />
      </div>
      <div>
        <label className="text-white/70 text-sm mb-1 block">Year</label>
        <InteractiveSelect options={yearOptions} />
      </div>
    </div>
  ),
};

export const InlineWithOtherControls: Story = {
  render: () => {
    const [sort, setSort] = useState("commits");
    const [filter, setFilter] = useState("all");
    return (
      <div className="flex items-center gap-2">
        <GlassSelect
          value={sort}
          onChange={setSort}
          options={sortOptions}
        />
        <GlassSelect
          value={filter}
          onChange={setFilter}
          options={filterOptions}
        />
      </div>
    );
  },
};
