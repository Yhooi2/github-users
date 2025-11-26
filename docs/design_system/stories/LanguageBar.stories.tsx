import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { LanguageBar } from "../LanguageBar";
import { ThemeProvider } from "../../context/ThemeContext";
import { Background } from "../Background";

const meta: Meta<typeof LanguageBar> = {
  title: "Design System/Status/LanguageBar",
  component: LanguageBar,
  decorators: [
    (Story) => (
      <ThemeProvider defaultTheme="glass">
        <Background>
          <div className="p-8 w-96">
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
          "A horizontal bar showing language distribution with color segments and optional labels.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    showLabels: {
      control: "boolean",
      description: "Show language labels below bar",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const defaultLanguages = [
  { name: "TypeScript", percentage: 56, color: "bg-blue-500" },
  { name: "HTML", percentage: 22, color: "bg-orange-500" },
  { name: "JavaScript", percentage: 13, color: "bg-yellow-400" },
  { name: "Python", percentage: 7, color: "bg-emerald-500" },
];

const twoLanguages = [
  { name: "Python", percentage: 92, color: "bg-emerald-500" },
  { name: "Shell", percentage: 8, color: "bg-gray-500" },
];

const singleLanguage = [
  { name: "Python", percentage: 100, color: "bg-emerald-500" },
];

const manyLanguages = [
  { name: "TypeScript", percentage: 35, color: "bg-blue-500" },
  { name: "JavaScript", percentage: 25, color: "bg-yellow-400" },
  { name: "Python", percentage: 15, color: "bg-emerald-500" },
  { name: "HTML", percentage: 10, color: "bg-orange-500" },
  { name: "CSS", percentage: 8, color: "bg-purple-500" },
  { name: "Shell", percentage: 4, color: "bg-gray-500" },
  { name: "Other", percentage: 3, color: "bg-slate-400" },
];

export const Default: Story = {
  args: {
    languages: defaultLanguages,
    showLabels: true,
  },
};

export const WithoutLabels: Story = {
  args: {
    languages: defaultLanguages,
    showLabels: false,
  },
};

export const TwoLanguages: Story = {
  args: {
    languages: twoLanguages,
    showLabels: true,
  },
};

export const SingleLanguage: Story = {
  args: {
    languages: singleLanguage,
    showLabels: true,
  },
};

export const ManyLanguages: Story = {
  args: {
    languages: manyLanguages,
    showLabels: true,
  },
};

export const DifferentProjects: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <p className="text-white/70 text-sm mb-2">Full-stack Project</p>
        <LanguageBar languages={defaultLanguages} />
      </div>
      <div>
        <p className="text-white/70 text-sm mb-2">Python Backend</p>
        <LanguageBar languages={twoLanguages} />
      </div>
      <div>
        <p className="text-white/70 text-sm mb-2">Pure Python</p>
        <LanguageBar languages={singleLanguage} />
      </div>
      <div>
        <p className="text-white/70 text-sm mb-2">Complex Monorepo</p>
        <LanguageBar languages={manyLanguages} />
      </div>
    </div>
  ),
};

export const CompactView: Story = {
  render: () => (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <span className="text-white text-sm w-32">my-project</span>
        <div className="flex-1">
          <LanguageBar languages={defaultLanguages} showLabels={false} />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-white text-sm w-32">backend-api</span>
        <div className="flex-1">
          <LanguageBar languages={twoLanguages} showLabels={false} />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-white text-sm w-32">scripts</span>
        <div className="flex-1">
          <LanguageBar languages={singleLanguage} showLabels={false} />
        </div>
      </div>
    </div>
  ),
};
