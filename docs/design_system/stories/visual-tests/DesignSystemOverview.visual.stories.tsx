import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Github, Zap, Search, Bell, Settings } from "lucide-react";

// Core Components
import { GlassCard } from "../../GlassCard";
import { GlassButton } from "../../GlassButton";
import { GlassProgress } from "../../GlassProgress";
import { GlassBadge } from "../../GlassBadge";
import { GlassInput } from "../../GlassInput";
import { GlassToggle } from "../../GlassToggle";
import { GlassSelect } from "../../GlassSelect";
import { StatusIndicator } from "../../StatusIndicator";
import { MetricCard } from "../../MetricCard";
import { LanguageBar } from "../../LanguageBar";
import { Avatar } from "../../Avatar";
import { Alert } from "../../Alert";

// Desktop Components
import { SearchBar } from "../../SearchBar";
import { TabToggle } from "../../TabToggle";
import { YearCard } from "../../YearCard";
import { RepoCard } from "../../RepoCard";
import { AIInsightsCard } from "../../AIInsightsCard";
import { FlagAlert } from "../../FlagAlert";
import { IconButton } from "../../IconButton";

// Layout
import { Background } from "../../Background";
import { Header } from "../../Header";
import { ThemeToggle } from "../../ThemeToggle";
import { ThemeProvider } from "../../../context/ThemeContext";
import type { ThemeName as Theme } from "../../../types";

const meta: Meta = {
  title: "Design System/Visual Tests/Complete Overview",
  parameters: {
    layout: "fullscreen",
    chromatic: {
      modes: {
        light: { theme: "light" },
        aurora: { theme: "aurora" },
        glass: { theme: "glass" },
      },
    },
  },
};

export default meta;
type Story = StoryObj;

const themes: Theme[] = ["light", "aurora", "glass"];

const tabs = [
  { value: "overview", label: "Overview" },
  { value: "repos", label: "Repositories" },
] as const;

const languages = [
  { name: "TypeScript", percentage: 56, color: "bg-blue-400" },
  { name: "CSS", percentage: 24, color: "bg-pink-400" },
  { name: "HTML", percentage: 20, color: "bg-orange-400" },
];

const sampleRepo = {
  name: "awesome-project",
  status: "good" as const,
  stars: 142,
  commits: 847,
  contribution: 75,
  langs: [
    { name: "TypeScript", percent: 65, color: "bg-blue-400" },
    { name: "CSS", percent: 35, color: "bg-pink-400" },
  ],
};

/**
 * MASTER VISUAL TEST: Complete Design System Overview
 *
 * This story shows ALL components side by side in all three themes.
 * Use this as the primary reference for visual regression testing.
 *
 * Any visual change will be immediately visible here.
 */
export const CompleteDesignSystemAllThemes: Story = {
  render: () => (
    <div className="flex flex-col">
      {themes.map((theme) => (
        <ThemeProvider key={theme} defaultTheme={theme}>
          <Background className="p-8 min-h-[1200px]">
            {/* Theme Label */}
            <div className="mb-6 text-sm font-bold uppercase tracking-wider text-white/50 border-b border-white/10 pb-2">
              Theme: {theme.toUpperCase()}
            </div>

            <div className="space-y-8">
              {/* Section: Buttons */}
              <section>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-white/40 mb-3">
                  Buttons
                </h3>
                <div className="flex flex-wrap gap-3">
                  <GlassButton variant="primary">Primary</GlassButton>
                  <GlassButton variant="secondary">Secondary</GlassButton>
                  <GlassButton variant="ghost">Ghost</GlassButton>
                  <GlassButton variant="primary" icon={Zap}>With Icon</GlassButton>
                  <GlassButton variant="primary" disabled>Disabled</GlassButton>
                  <GlassButton variant="primary" loading>Loading</GlassButton>
                </div>
              </section>

              {/* Section: Badges */}
              <section>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-white/40 mb-3">
                  Badges
                </h3>
                <div className="flex flex-wrap gap-2">
                  <GlassBadge variant="default">Default</GlassBadge>
                  <GlassBadge variant="success">Success</GlassBadge>
                  <GlassBadge variant="warning">Warning</GlassBadge>
                  <GlassBadge variant="danger">Danger</GlassBadge>
                  <GlassBadge variant="primary">Primary</GlassBadge>
                  <GlassBadge variant="violet">Violet</GlassBadge>
                </div>
              </section>

              {/* Section: Status Indicators */}
              <section>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-white/40 mb-3">
                  Status Indicators
                </h3>
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <StatusIndicator type="green" />
                    <span className="text-sm text-white/70">Good</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusIndicator type="yellow" />
                    <span className="text-sm text-white/70">Warning</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusIndicator type="red" />
                    <span className="text-sm text-white/70">Critical</span>
                  </div>
                </div>
              </section>

              {/* Section: Inputs & Controls */}
              <section>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-white/40 mb-3">
                  Inputs & Controls
                </h3>
                <div className="flex flex-wrap items-center gap-4">
                  <GlassInput icon={Search} placeholder="Search..." className="w-48" />
                  <GlassSelect
                    value="option1"
                    options={[
                      { value: "option1", label: "Option 1" },
                      { value: "option2", label: "Option 2" },
                    ]}
                  />
                  <GlassToggle checked={true} onChange={() => {}} />
                  <GlassToggle checked={false} onChange={() => {}} />
                </div>
              </section>

              {/* Section: Cards */}
              <section>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-white/40 mb-3">
                  Glass Cards
                </h3>
                <div className="flex gap-4">
                  <GlassCard intensity="subtle" className="w-40 p-4">
                    <div className="text-sm font-medium">Subtle</div>
                  </GlassCard>
                  <GlassCard intensity="medium" className="w-40 p-4">
                    <div className="text-sm font-medium">Medium</div>
                  </GlassCard>
                  <GlassCard intensity="strong" className="w-40 p-4">
                    <div className="text-sm font-medium">Strong</div>
                  </GlassCard>
                  <GlassCard intensity="medium" glow="violet" className="w-40 p-4">
                    <div className="text-sm font-medium">With Glow</div>
                  </GlassCard>
                </div>
              </section>

              {/* Section: Progress Bars */}
              <section>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-white/40 mb-3">
                  Progress Bars
                </h3>
                <div className="w-96 space-y-2">
                  <GlassProgress value={25} />
                  <GlassProgress value={50} gradient="from-emerald-400 to-cyan-400" />
                  <GlassProgress value={75} gradient="from-amber-400 to-orange-400" />
                  <GlassProgress value={100} gradient="from-rose-400 to-pink-400" />
                </div>
              </section>

              {/* Section: Metric Cards */}
              <section>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-white/40 mb-3">
                  Metric Cards
                </h3>
                <div className="flex gap-3">
                  <MetricCard label="Activity" value={84} variant="emerald" />
                  <MetricCard label="Quality" value={92} variant="amber" />
                  <MetricCard label="Impact" value={76} variant="blue" />
                  <MetricCard label="Risk" value={23} variant="red" />
                </div>
              </section>

              {/* Section: Language Bar */}
              <section>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-white/40 mb-3">
                  Language Bar
                </h3>
                <div className="w-96">
                  <LanguageBar languages={languages} />
                </div>
              </section>

              {/* Section: Avatars */}
              <section>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-white/40 mb-3">
                  Avatars
                </h3>
                <div className="flex items-end gap-4">
                  <Avatar initials="SM" size="sm" />
                  <Avatar initials="MD" size="md" />
                  <Avatar initials="LG" size="lg" online />
                  <Avatar initials="XL" size="xl" gradient="from-emerald-400 to-cyan-400" />
                </div>
              </section>

              {/* Section: Alerts */}
              <section>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-white/40 mb-3">
                  Alerts
                </h3>
                <div className="w-96 space-y-2">
                  <Alert variant="danger">Critical error</Alert>
                  <Alert variant="warning">Warning message</Alert>
                  <Alert variant="info">Information</Alert>
                </div>
              </section>

              {/* Section: Desktop Components */}
              <section>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-white/40 mb-3">
                  Desktop Components
                </h3>
                <div className="space-y-4">
                  <SearchBar value="octocat" />
                  <TabToggle tabs={tabs} activeTab="overview" onChange={() => {}} />
                  <div className="flex gap-4">
                    <YearCard year={2024} commits={847} progress={85} isPeak />
                    <YearCard year={2023} commits={623} progress={65} />
                  </div>
                  <div className="w-96">
                    <RepoCard repo={sampleRepo} />
                  </div>
                  <div className="flex gap-4">
                    <FlagAlert type="danger" title="Security issue" />
                    <FlagAlert type="warning" title="Low activity" />
                  </div>
                  <div className="flex gap-2">
                    <IconButton icon={Github} />
                    <IconButton icon={Bell} />
                    <IconButton icon={Settings} />
                  </div>
                </div>
              </section>

              {/* Section: Theme Controls */}
              <section>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-white/40 mb-3">
                  Theme Toggle
                </h3>
                <ThemeToggle />
              </section>
            </div>
          </Background>
        </ThemeProvider>
      ))}
    </div>
  ),
};

/**
 * Single theme deep dive - GLASS
 * Most detailed visual test for glass theme
 */
export const GlassThemeDeepDive: Story = {
  render: () => (
    <ThemeProvider defaultTheme="glass">
      <Background className="p-8 min-h-[2000px]">
        <div className="max-w-4xl mx-auto space-y-12">
          <Header>
            <div className="flex items-center justify-between w-full">
              <span className="font-semibold">GitHub Analytics</span>
              <div className="flex items-center gap-4">
                <nav className="flex gap-4 text-sm">
                  <span className="opacity-100">Overview</span>
                  <span className="opacity-60">Repos</span>
                </nav>
                <ThemeToggle />
              </div>
            </div>
          </Header>

          <div className="space-y-8 pt-4">
            {/* User Header */}
            <div className="flex items-center gap-4">
              <Avatar initials="OC" size="xl" online />
              <div>
                <h1 className="text-2xl font-bold text-white">octocat</h1>
                <p className="text-white/60">GitHub User Analytics</p>
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-4 gap-4">
              <MetricCard label="Activity" value={84} variant="emerald" />
              <MetricCard label="Quality" value={92} variant="amber" />
              <MetricCard label="Impact" value={76} variant="blue" />
              <MetricCard label="Growth" value={68} variant="emerald" />
            </div>

            {/* Search and Tabs */}
            <div className="flex items-center justify-between">
              <TabToggle tabs={tabs} activeTab="repos" onChange={() => {}} />
              <SearchBar value="" placeholder="Search repos..." />
            </div>

            {/* Year Cards */}
            <div className="flex gap-4 overflow-x-auto pb-2">
              <YearCard year={2024} commits={847} progress={100} isPeak />
              <YearCard year={2023} commits={623} progress={73} />
              <YearCard year={2022} commits={412} progress={48} />
              <YearCard year={2021} commits={285} progress={33} />
            </div>

            {/* Repo Card Expanded */}
            <RepoCard repo={sampleRepo} expanded />

            {/* AI Insights */}
            <div className="flex gap-6">
              <AIInsightsCard />
              <GlassCard intensity="medium" className="flex-1 p-4">
                <h3 className="font-semibold text-white/90 mb-2">Additional Info</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <StatusIndicator type="green" />
                    <span className="text-sm text-white/70">All checks passed</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusIndicator type="yellow" />
                    <span className="text-sm text-white/70">2 warnings</span>
                  </div>
                </div>
              </GlassCard>
            </div>

            {/* Alerts */}
            <div className="space-y-3">
              <Alert variant="info" title="Pro Tip">
                Use AI Analysis for deeper insights
              </Alert>
              <FlagAlert
                type="warning"
                title="Activity decrease"
                description="40% less commits compared to last month"
              />
            </div>
          </div>
        </div>
      </Background>
    </ThemeProvider>
  ),
};
