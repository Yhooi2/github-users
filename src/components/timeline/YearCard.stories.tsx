import type { Meta, StoryObj } from "@storybook/react-vite";
import type { YearData } from "@/hooks/useUserAnalytics";
import { YearCard } from "./YearCard";
import { useState } from "react";

const meta: Meta<typeof YearCard> = {
  title: "Timeline/YearCard",
  component: YearCard,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
YearCard is a compact year summary card used in the desktop sidebar.

**Features:**
- Visual activity bar showing relative commit count
- Selected state with primary color highlighting
- Hover and tap animations (respects reduced motion)
- Accessible with proper ARIA attributes

**Usage:**
Used in the 33% left panel of the desktop split layout (>=1440px).
        `,
      },
    },
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="w-[300px]">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof YearCard>;

// Create mock monthly data
const createMonthlyData = (year: number, commits: number) => {
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return monthNames.map((monthName, i) => ({
    month: i + 1,
    monthName,
    contributions: Math.floor(commits / 12 + Math.random() * (commits / 6)),
    daysActive: Math.floor(Math.random() * 25 + 5),
    maxDaily: Math.floor(Math.random() * 20 + 5),
  }));
};

// Create mock year data
const createYearData = (
  year: number,
  commits: number,
  ownedCount: number,
  contribCount: number
): YearData => {
  const ownedRepos = Array.from({ length: ownedCount }, (_, i) => ({
    contributions: { totalCount: Math.floor(commits / (ownedCount + 1)) },
    repository: {
      id: `owned-${year}-${i}`,
      name: `project-${year}-${i + 1}`,
      nameWithOwner: `developer/project-${year}-${i + 1}`,
      url: `https://github.com/developer/project-${year}-${i + 1}`,
      description: `A project from ${year}`,
      createdAt: `${year}-01-01T00:00:00Z`,
      updatedAt: `${year}-12-01T00:00:00Z`,
      pushedAt: `${year}-12-01T00:00:00Z`,
      stargazerCount: Math.floor(Math.random() * 500),
      forkCount: Math.floor(Math.random() * 50),
      isFork: false,
      isTemplate: false,
      isArchived: false,
      isPrivate: false,
      diskUsage: 1000,
      homepageUrl: null,
      primaryLanguage: { name: "TypeScript", color: "#3178c6" },
      owner: {
        login: "developer",
        avatarUrl: "https://github.com/developer.png",
      },
      parent: null,
      watchers: { totalCount: 10 },
      issues: { totalCount: 5 },
      repositoryTopics: { nodes: [] },
      languages: { totalSize: 1000, edges: [] },
      licenseInfo: null,
      defaultBranchRef: null,
    },
  }));

  const contributions = Array.from({ length: contribCount }, (_, i) => ({
    contributions: { totalCount: Math.floor(commits / (contribCount + 3)) },
    repository: {
      id: `contrib-${year}-${i}`,
      name: `oss-lib-${i + 1}`,
      nameWithOwner: `org/oss-lib-${i + 1}`,
      url: `https://github.com/org/oss-lib-${i + 1}`,
      description: `Open source library`,
      createdAt: `${year - 2}-01-01T00:00:00Z`,
      updatedAt: `${year}-12-01T00:00:00Z`,
      pushedAt: `${year}-12-01T00:00:00Z`,
      stargazerCount: Math.floor(Math.random() * 5000 + 500),
      forkCount: Math.floor(Math.random() * 500),
      isFork: false,
      isTemplate: false,
      isArchived: false,
      isPrivate: false,
      diskUsage: 5000,
      homepageUrl: null,
      primaryLanguage: { name: "JavaScript", color: "#f1e05a" },
      owner: { login: "org", avatarUrl: "https://github.com/org.png" },
      parent: null,
      watchers: { totalCount: 50 },
      issues: { totalCount: 25 },
      repositoryTopics: { nodes: [] },
      languages: { totalSize: 5000, edges: [] },
      licenseInfo: null,
      defaultBranchRef: null,
    },
  }));

  return {
    year,
    totalCommits: commits,
    totalPRs: Math.floor(commits / 10),
    totalIssues: Math.floor(commits / 15),
    totalReviews: Math.floor(commits / 5),
    ownedRepos,
    contributions,
    monthlyContributions: createMonthlyData(year, commits),
  };
};

// Create mock allYears data for badge analysis
const createAllYearsData = (years: YearData[]) => {
  return years.map(y => ({ year: y.year, totalCommits: y.totalCommits }));
};

// Sample years for stories
const sampleYears = [
  createYearData(2024, 800, 4, 6),
  createYearData(2023, 600, 3, 5),
  createYearData(2022, 400, 2, 4),
  createYearData(2021, 100, 1, 1),
];

/**
 * Default unselected state
 */
export const Default: Story = {
  args: {
    year: sampleYears[0],
    maxCommits: 1000,
    allYears: createAllYearsData(sampleYears),
    isSelected: false,
    onSelect: () => console.log("Year selected"),
  },
};

/**
 * Selected state with highlight
 */
export const Selected: Story = {
  args: {
    year: sampleYears[0],
    maxCommits: 1000,
    allYears: createAllYearsData(sampleYears),
    isSelected: true,
    onSelect: () => console.log("Year selected"),
  },
};

/**
 * High activity year (full bar) - Peak year badge
 */
export const HighActivity: Story = {
  args: {
    year: createYearData(2024, 1500, 8, 12),
    maxCommits: 1500,
    allYears: createAllYearsData([
      createYearData(2024, 1500, 8, 12),
      createYearData(2023, 800, 4, 6),
      createYearData(2022, 600, 3, 5),
    ]),
    isSelected: false,
    onSelect: () => console.log("Year selected"),
  },
};

/**
 * Low activity year (small bar) - Inactive badge
 */
export const LowActivity: Story = {
  args: {
    year: createYearData(2021, 80, 1, 1),
    maxCommits: 1000,
    allYears: createAllYearsData([
      createYearData(2024, 1000, 5, 7),
      createYearData(2023, 800, 4, 6),
      createYearData(2022, 600, 3, 5),
      createYearData(2021, 80, 1, 1),
    ]),
    isSelected: false,
    onSelect: () => console.log("Year selected"),
  },
};

/**
 * Interactive demo with multiple cards
 */
export const InteractiveList: Story = {
  render: () => {
    const [selectedYear, setSelectedYear] = useState<number | null>(2024);
    const years = [
      createYearData(2024, 800, 4, 6),
      createYearData(2023, 600, 3, 5),
      createYearData(2022, 400, 2, 4),
      createYearData(2021, 200, 1, 2),
    ];
    const maxCommits = Math.max(...years.map((y) => y.totalCommits));
    const allYears = createAllYearsData(years);

    return (
      <div className="w-[300px] space-y-3">
        {years.map((year) => (
          <YearCard
            key={year.year}
            year={year}
            maxCommits={maxCommits}
            allYears={allYears}
            isSelected={selectedYear === year.year}
            onSelect={() => setSelectedYear(year.year)}
          />
        ))}
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: "Click cards to see selection state change. Notice the different badges: 🔥 Peak, 📈 Growth, 📊 Stable, 🌱 Start.",
      },
    },
  },
};
