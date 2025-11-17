import type { Meta, StoryObj } from '@storybook/react';
import { ScrollArea } from './scroll-area';

const meta: Meta<typeof ScrollArea> = {
  title: 'UI/ScrollArea',
  component: ScrollArea,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A scroll area component with custom scrollbars.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ScrollArea>;

export const Default: Story = {
  render: () => (
    <ScrollArea className="h-[200px] w-[350px] rounded-md border p-4">
      <div className="space-y-2">
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className="text-sm">
            Item {i + 1}
          </div>
        ))}
      </div>
    </ScrollArea>
  ),
};

export const RepositoryList: Story = {
  render: () => (
    <ScrollArea className="h-[300px] w-[400px] rounded-md border">
      <div className="p-4 space-y-3">
        {[
          'facebook/react',
          'vercel/next.js',
          'microsoft/vscode',
          'nodejs/node',
          'angular/angular',
          'vuejs/vue',
          'sveltejs/svelte',
          'laravel/laravel',
          'django/django',
          'rails/rails',
          'expressjs/express',
          'nestjs/nest',
          'spring-projects/spring-boot',
        ].map((repo) => (
          <div key={repo} className="flex items-center justify-between py-2 border-b last:border-b-0">
            <span className="text-sm font-medium">{repo}</span>
            <span className="text-xs text-muted-foreground">★ 234k</span>
          </div>
        ))}
      </div>
    </ScrollArea>
  ),
};

export const LongText: Story = {
  render: () => (
    <ScrollArea className="h-[250px] w-[450px] rounded-md border p-4">
      <div className="text-sm space-y-4">
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt
          ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
          ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </p>
        <p>
          Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat
          nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia
          deserunt mollit anim id est laborum.
        </p>
        <p>
          Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque
          laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi
          architecto beatae vitae dicta sunt explicabo.
        </p>
      </div>
    </ScrollArea>
  ),
};
