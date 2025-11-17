import type { Meta, StoryObj } from '@storybook/react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from './select';

const meta: Meta<typeof Select> = {
  title: 'UI/Select',
  component: Select,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A select component for choosing from a list of options.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Select>;

export const Default: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a fruit" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="apple">Apple</SelectItem>
        <SelectItem value="banana">Banana</SelectItem>
        <SelectItem value="orange">Orange</SelectItem>
      </SelectContent>
    </Select>
  ),
};

export const WithGroups: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Select a language" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Frontend</SelectLabel>
          <SelectItem value="js">JavaScript</SelectItem>
          <SelectItem value="ts">TypeScript</SelectItem>
        </SelectGroup>
        <SelectGroup>
          <SelectLabel>Backend</SelectLabel>
          <SelectItem value="python">Python</SelectItem>
          <SelectItem value="go">Go</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  ),
};

export const RepositoryVisibility: Story = {
  render: () => (
    <Select defaultValue="public">
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Repository visibility" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="public">Public</SelectItem>
        <SelectItem value="private">Private</SelectItem>
        <SelectItem value="internal">Internal</SelectItem>
      </SelectContent>
    </Select>
  ),
};

export const Disabled: Story = {
  render: () => (
    <Select disabled>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select option" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="1">Option 1</SelectItem>
      </SelectContent>
    </Select>
  ),
};

export const SmallSize: Story = {
  render: () => (
    <Select>
      <SelectTrigger size="sm" className="w-[180px]">
        <SelectValue placeholder="Small select" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="1">Option 1</SelectItem>
        <SelectItem value="2">Option 2</SelectItem>
      </SelectContent>
    </Select>
  ),
};
