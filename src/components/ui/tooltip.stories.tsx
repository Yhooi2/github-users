import type { Meta, StoryObj } from '@storybook/react';
import { Tooltip, TooltipTrigger, TooltipContent } from './tooltip';
import { Button } from './button';

const meta: Meta<typeof Tooltip> = {
  title: 'UI/Tooltip',
  component: Tooltip,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A tooltip component that displays information when hovering over or focusing on an element.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Tooltip>;

// Story 1: Default tooltip
export const Default: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline">Hover me</Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>This is a tooltip</p>
      </TooltipContent>
    </Tooltip>
  ),
};

// Story 2: Different placements
export const Placements: Story = {
  render: () => (
    <div className="flex gap-8">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">Top</Button>
        </TooltipTrigger>
        <TooltipContent side="top">
          <p>Tooltip on top</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">Right</Button>
        </TooltipTrigger>
        <TooltipContent side="right">
          <p>Tooltip on right</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">Bottom</Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p>Tooltip on bottom</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">Left</Button>
        </TooltipTrigger>
        <TooltipContent side="left">
          <p>Tooltip on left</p>
        </TooltipContent>
      </Tooltip>
    </div>
  ),
};

// Story 3: Icon with tooltip
export const IconTooltip: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <button className="flex size-10 items-center justify-center rounded-full border">
          <span className="text-lg">ℹ️</span>
        </button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Additional information</p>
      </TooltipContent>
    </Tooltip>
  ),
};

// Story 4: GitHub repository actions (use case)
export const RepositoryActions: Story = {
  render: () => (
    <div className="flex gap-3">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" size="icon">
            ⭐
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Star this repository</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" size="icon">
            👁️
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Watch repository for updates</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" size="icon">
            🍴
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Fork repository</p>
        </TooltipContent>
      </Tooltip>
    </div>
  ),
};

// Story 5: Long content tooltip
export const LongContent: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline">Hover for details</Button>
      </TooltipTrigger>
      <TooltipContent className="max-w-xs">
        <p>
          This is a longer tooltip with more detailed information. It wraps to multiple lines when
          the content is too long to fit on a single line.
        </p>
      </TooltipContent>
    </Tooltip>
  ),
};

// Story 6: User badge with tooltip (GitHub use case)
export const UserBadge: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <span className="text-sm">Linus Torvalds</span>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="cursor-help rounded bg-blue-500 px-1.5 py-0.5 text-xs text-white">
            PRO
          </span>
        </TooltipTrigger>
        <TooltipContent>
          <p>GitHub Pro subscriber</p>
        </TooltipContent>
      </Tooltip>
    </div>
  ),
};

// Story 7: Disabled button with tooltip
export const DisabledButton: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="inline-block">
          <Button disabled>Disabled Button</Button>
        </span>
      </TooltipTrigger>
      <TooltipContent>
        <p>This action is currently unavailable</p>
      </TooltipContent>
    </Tooltip>
  ),
};

// Story 8: Keyboard shortcut tooltip
export const KeyboardShortcut: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline">Save</Button>
      </TooltipTrigger>
      <TooltipContent>
        <div className="flex items-center gap-2">
          <span>Save changes</span>
          <kbd className="rounded bg-muted px-1.5 py-0.5 text-xs">⌘S</kbd>
        </div>
      </TooltipContent>
    </Tooltip>
  ),
};

// Story 9: Repository language tooltip
export const RepositoryLanguage: Story = {
  render: () => (
    <div className="flex items-center gap-2 rounded-lg border p-4">
      <span className="text-sm font-medium">facebook/react</span>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-1">
            <span className="size-3 rounded-full bg-blue-500" />
            <span className="text-xs text-muted-foreground">JavaScript</span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Primary language: JavaScript (89.4%)</p>
        </TooltipContent>
      </Tooltip>
    </div>
  ),
};

// Story 10: Stats with tooltips
export const StatsTooltips: Story = {
  render: () => (
    <div className="flex gap-6">
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="cursor-help">
            <div className="text-2xl font-bold">234k</div>
            <div className="text-xs text-muted-foreground">Stars</div>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>234,567 users starred this repository</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <div className="cursor-help">
            <div className="text-2xl font-bold">48k</div>
            <div className="text-xs text-muted-foreground">Forks</div>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>48,123 forks created from this repository</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <div className="cursor-help">
            <div className="text-2xl font-bold">1.8k</div>
            <div className="text-xs text-muted-foreground">Issues</div>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>1,845 open issues</p>
        </TooltipContent>
      </Tooltip>
    </div>
  ),
};

// Story 11: Custom styled tooltip
export const CustomStyled: Story = {
  render: () => (
    <div className="flex gap-4">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">Success</Button>
        </TooltipTrigger>
        <TooltipContent className="border-green-500 bg-green-500">
          <p>Operation successful</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">Error</Button>
        </TooltipTrigger>
        <TooltipContent className="border-red-500 bg-red-500">
          <p>An error occurred</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">Warning</Button>
        </TooltipTrigger>
        <TooltipContent className="border-yellow-500 bg-yellow-500 text-black">
          <p>Warning message</p>
        </TooltipContent>
      </Tooltip>
    </div>
  ),
};

// Story 12: Contribution tooltip (GitHub use case)
export const ContributionTooltip: Story = {
  render: () => (
    <div className="flex gap-1">
      {[...Array(10)].map((_, i) => (
        <Tooltip key={i}>
          <TooltipTrigger asChild>
            <div
              className="size-4 cursor-pointer rounded-sm"
              style={{
                backgroundColor: `hsl(142, ${20 + i * 8}%, ${50 - i * 3}%)`,
              }}
            />
          </TooltipTrigger>
          <TooltipContent>
            <p>{i * 3 + 5} contributions on this day</p>
          </TooltipContent>
        </Tooltip>
      ))}
    </div>
  ),
};
