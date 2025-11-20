import type { RepositoryFilter } from "@/types/filters";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { RepositoryFilters } from "./RepositoryFilters";

// Wrapper component to manage filter state
function RepositoryFiltersWrapper(props: {
  initialFilters?: RepositoryFilter;
  availableLanguages?: string[];
  compact?: boolean;
}) {
  const [filters, setFilters] = useState<RepositoryFilter>(
    props.initialFilters || {},
  );

  const handleFilterChange = <K extends keyof RepositoryFilter>(
    key: K,
    value: RepositoryFilter[K],
  ) => {
    setFilters((prev) => {
      if (value === undefined) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { [key]: _removed, ...rest } = prev;
        return rest;
      }
      return { ...prev, [key]: value };
    });
  };

  const handleClearFilters = () => {
    setFilters({});
  };

  const hasActiveFilters = Object.keys(filters).length > 0;
  const activeFilterCount = Object.keys(filters).length;

  return (
    <RepositoryFilters
      filters={filters}
      onFilterChange={handleFilterChange}
      onClearFilters={handleClearFilters}
      hasActiveFilters={hasActiveFilters}
      activeFilterCount={activeFilterCount}
      availableLanguages={props.availableLanguages}
      compact={props.compact}
    />
  );
}

const meta = {
  title: "Components/Repository/RepositoryFilters",
  component: RepositoryFiltersWrapper,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div style={{ width: "400px", maxWidth: "100%" }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof RepositoryFiltersWrapper>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default filters panel with no active filters
 */
export const Default: Story = {
  args: {
    availableLanguages: [
      "TypeScript",
      "JavaScript",
      "Python",
      "Go",
      "Rust",
      "Java",
    ],
  },
};

/**
 * Filters with some initial values set
 */
export const WithActiveFilters: Story = {
  args: {
    initialFilters: {
      searchQuery: "react",
      language: "TypeScript",
      minStars: 100,
      originalOnly: true,
    },
    availableLanguages: [
      "TypeScript",
      "JavaScript",
      "Python",
      "Go",
      "Rust",
      "Java",
    ],
  },
};

/**
 * Filters with all boolean options enabled
 */
export const AllBooleansActive: Story = {
  args: {
    initialFilters: {
      originalOnly: true,
      hideArchived: true,
      hasTopics: true,
      hasLicense: true,
    },
    availableLanguages: ["TypeScript", "JavaScript", "Python"],
  },
};

/**
 * Filters with only forks shown
 */
export const ForksOnly: Story = {
  args: {
    initialFilters: {
      forksOnly: true,
    },
    availableLanguages: ["TypeScript", "JavaScript", "Python"],
  },
};

/**
 * Filters without language options (empty language list)
 */
export const NoLanguageOptions: Story = {
  args: {
    availableLanguages: [],
  },
};

/**
 * Filters with many language options
 */
export const ManyLanguages: Story = {
  args: {
    availableLanguages: [
      "TypeScript",
      "JavaScript",
      "Python",
      "Go",
      "Rust",
      "Java",
      "C++",
      "C#",
      "Ruby",
      "PHP",
      "Swift",
      "Kotlin",
      "Dart",
      "Shell",
      "HTML",
      "CSS",
    ],
  },
};

/**
 * Compact mode without card wrapper
 */
export const CompactMode: Story = {
  args: {
    initialFilters: {
      searchQuery: "test",
      minStars: 50,
    },
    availableLanguages: ["TypeScript", "JavaScript", "Python"],
    compact: true,
  },
};

/**
 * Maximum filters applied
 */
export const MaximumFilters: Story = {
  args: {
    initialFilters: {
      searchQuery: "awesome-project",
      language: "TypeScript",
      minStars: 1000,
      originalOnly: true,
      hideArchived: true,
      hasTopics: true,
      hasLicense: true,
    },
    availableLanguages: ["TypeScript", "JavaScript", "Python", "Go", "Rust"],
  },
};

/**
 * Search only (most common use case)
 */
export const SearchOnly: Story = {
  args: {
    initialFilters: {
      searchQuery: "user-repository",
    },
    availableLanguages: ["TypeScript", "JavaScript", "Python"],
  },
};

/**
 * Minimum stars filter applied
 */
export const MinimumStarsFilter: Story = {
  args: {
    initialFilters: {
      minStars: 500,
    },
    availableLanguages: ["TypeScript", "JavaScript", "Python"],
  },
};
