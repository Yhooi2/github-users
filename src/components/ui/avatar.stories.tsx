import type { Meta, StoryObj } from '@storybook/react';
import { Avatar, AvatarImage, AvatarFallback } from './avatar';

const meta: Meta<typeof Avatar> = {
  title: 'UI/Avatar',
  component: Avatar,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'An avatar component that displays user profile images with fallback support.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Avatar>;

// Story 1: Default with image
export const Default: Story = {
  render: () => (
    <Avatar>
      <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  ),
};

// Story 2: With fallback (broken image URL)
export const WithFallback: Story = {
  render: () => (
    <Avatar>
      <AvatarImage src="https://invalid-url.com/image.png" alt="User" />
      <AvatarFallback>JD</AvatarFallback>
    </Avatar>
  ),
};

// Story 3: Only fallback (no image)
export const FallbackOnly: Story = {
  render: () => (
    <Avatar>
      <AvatarFallback>AB</AvatarFallback>
    </Avatar>
  ),
};

// Story 4: Different sizes
export const DifferentSizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar className="size-6">
        <AvatarImage src="https://github.com/shadcn.png" alt="Small" />
        <AvatarFallback>S</AvatarFallback>
      </Avatar>
      <Avatar className="size-8">
        <AvatarImage src="https://github.com/shadcn.png" alt="Default" />
        <AvatarFallback>D</AvatarFallback>
      </Avatar>
      <Avatar className="size-12">
        <AvatarImage src="https://github.com/shadcn.png" alt="Medium" />
        <AvatarFallback>M</AvatarFallback>
      </Avatar>
      <Avatar className="size-16">
        <AvatarImage src="https://github.com/shadcn.png" alt="Large" />
        <AvatarFallback>L</AvatarFallback>
      </Avatar>
      <Avatar className="size-24">
        <AvatarImage src="https://github.com/shadcn.png" alt="XL" />
        <AvatarFallback>XL</AvatarFallback>
      </Avatar>
    </div>
  ),
};

// Story 5: GitHub user avatar (use case)
export const GitHubUser: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <Avatar className="size-12">
        <AvatarImage src="https://github.com/torvalds.png" alt="@torvalds" />
        <AvatarFallback>LT</AvatarFallback>
      </Avatar>
      <div>
        <div className="text-sm font-semibold">Linus Torvalds</div>
        <div className="text-xs text-muted-foreground">@torvalds</div>
      </div>
    </div>
  ),
};

// Story 6: User list with avatars
export const UserList: Story = {
  render: () => (
    <div className="space-y-3">
      {[
        { name: 'Alice Johnson', username: 'alice', initials: 'AJ', img: 'https://github.com/shadcn.png' },
        { name: 'Bob Smith', username: 'bob', initials: 'BS', img: null },
        { name: 'Charlie Brown', username: 'charlie', initials: 'CB', img: 'https://github.com/vercel.png' },
        { name: 'Diana Prince', username: 'diana', initials: 'DP', img: null },
      ].map((user) => (
        <div key={user.username} className="flex items-center gap-3">
          <Avatar>
            {user.img && <AvatarImage src={user.img} alt={`@${user.username}`} />}
            <AvatarFallback>{user.initials}</AvatarFallback>
          </Avatar>
          <div>
            <div className="text-sm font-medium">{user.name}</div>
            <div className="text-xs text-muted-foreground">@{user.username}</div>
          </div>
        </div>
      ))}
    </div>
  ),
};

// Story 7: Avatar with custom background
export const CustomBackground: Story = {
  render: () => (
    <div className="flex gap-3">
      <Avatar>
        <AvatarFallback className="bg-blue-500 text-white">BL</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback className="bg-green-500 text-white">GR</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback className="bg-red-500 text-white">RD</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback className="bg-purple-500 text-white">PR</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback className="bg-yellow-500 text-black">YL</AvatarFallback>
      </Avatar>
    </div>
  ),
};

// Story 8: Avatar group
export const AvatarGroup: Story = {
  render: () => (
    <div className="flex -space-x-2">
      <Avatar className="border-2 border-background">
        <AvatarImage src="https://github.com/shadcn.png" alt="User 1" />
        <AvatarFallback>U1</AvatarFallback>
      </Avatar>
      <Avatar className="border-2 border-background">
        <AvatarImage src="https://github.com/vercel.png" alt="User 2" />
        <AvatarFallback>U2</AvatarFallback>
      </Avatar>
      <Avatar className="border-2 border-background">
        <AvatarFallback>U3</AvatarFallback>
      </Avatar>
      <Avatar className="border-2 border-background">
        <AvatarFallback>U4</AvatarFallback>
      </Avatar>
      <Avatar className="border-2 border-background">
        <AvatarFallback className="bg-muted text-muted-foreground">+5</AvatarFallback>
      </Avatar>
    </div>
  ),
};

// Story 9: Square avatar (non-circular)
export const Square: Story = {
  render: () => (
    <div className="flex gap-3">
      <Avatar className="rounded-md">
        <AvatarImage src="https://github.com/shadcn.png" alt="Square" />
        <AvatarFallback>SQ</AvatarFallback>
      </Avatar>
      <Avatar className="rounded-lg">
        <AvatarImage src="https://github.com/vercel.png" alt="Rounded" />
        <AvatarFallback>RD</AvatarFallback>
      </Avatar>
      <Avatar className="rounded-none">
        <AvatarFallback>NO</AvatarFallback>
      </Avatar>
    </div>
  ),
};

// Story 10: With loading state
export const LoadingState: Story = {
  render: () => (
    <div className="flex gap-3">
      <Avatar>
        <AvatarFallback className="animate-pulse">...</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback className="animate-pulse">LD</AvatarFallback>
      </Avatar>
    </div>
  ),
};

// Story 11: Repository owner avatar
export const RepositoryOwner: Story = {
  render: () => (
    <div className="flex items-start gap-3">
      <Avatar className="size-16">
        <AvatarImage src="https://github.com/facebook.png" alt="@facebook" />
        <AvatarFallback>FB</AvatarFallback>
      </Avatar>
      <div className="space-y-1">
        <div className="text-lg font-bold">facebook/react</div>
        <div className="text-sm text-muted-foreground">
          The library for web and native user interfaces
        </div>
        <div className="flex gap-3 text-xs text-muted-foreground">
          <span>⭐ 234k</span>
          <span>🍴 48k</span>
        </div>
      </div>
    </div>
  ),
};
