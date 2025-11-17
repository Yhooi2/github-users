import type { Meta, StoryObj } from '@storybook/react-vite';
import { Skeleton } from './skeleton';
import { Card, CardContent, CardHeader } from './card';

const meta: Meta<typeof Skeleton> = {
  title: 'UI/Skeleton',
  component: Skeleton,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A skeleton component for displaying loading placeholders with a pulsing animation.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Skeleton>;

// Story 1: Basic skeleton
export const Default: Story = {
  render: () => <Skeleton className="h-4 w-[250px]" />,
};

// Story 2: Circle skeleton (avatar)
export const Circle: Story = {
  render: () => <Skeleton className="h-12 w-12 rounded-full" />,
};

// Story 3: Card skeleton
export const CardSkeleton: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <div className="flex items-center space-x-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[200px]" />
            <Skeleton className="h-4 w-[150px]" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </CardContent>
    </Card>
  ),
};

// Story 4: Profile skeleton
export const ProfileSkeleton: Story = {
  render: () => (
    <div className="flex items-center space-x-4">
      <Skeleton className="h-16 w-16 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-5 w-[200px]" />
        <Skeleton className="h-4 w-[150px]" />
        <Skeleton className="h-3 w-[120px]" />
      </div>
    </div>
  ),
};

// Story 5: Table skeleton
export const TableSkeleton: Story = {
  render: () => (
    <div className="w-[500px] space-y-2">
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
    </div>
  ),
};

// Story 6: Repository card skeleton
export const RepositoryCardSkeleton: Story = {
  render: () => (
    <Card className="w-[400px]">
      <CardContent className="pt-6">
        <div className="space-y-3">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <div className="flex items-center gap-4 pt-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
      </CardContent>
    </Card>
  ),
};

// Story 7: Chart skeleton
export const ChartSkeleton: Story = {
  render: () => (
    <div className="w-[500px] space-y-4">
      <Skeleton className="h-6 w-[150px]" />
      <Skeleton className="h-[200px] w-full" />
      <div className="flex justify-around">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-16" />
      </div>
    </div>
  ),
};

// Story 8: Multiple sizes
export const MultipleSizes: Story = {
  render: () => (
    <div className="space-y-4">
      <Skeleton className="h-2 w-[300px]" />
      <Skeleton className="h-3 w-[300px]" />
      <Skeleton className="h-4 w-[300px]" />
      <Skeleton className="h-5 w-[300px]" />
      <Skeleton className="h-6 w-[300px]" />
      <Skeleton className="h-8 w-[300px]" />
    </div>
  ),
};
