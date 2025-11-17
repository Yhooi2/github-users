import type { Meta, StoryObj } from '@storybook/react'
import * as React from 'react'
import { Input } from './input'
import { Label } from './label'

const meta: Meta<typeof Input> = {
  title: 'UI/Input',
  component: Input,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'search', 'tel', 'url'],
      description: 'HTML input type',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the input is disabled',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    type: 'text',
    placeholder: 'Enter text...',
  },
}

export const WithLabel: Story = {
  render: () => (
    <div className="w-[300px]">
      <Label htmlFor="username">Username</Label>
      <Input id="username" type="text" placeholder="Enter your username" />
    </div>
  ),
}

export const Email: Story = {
  render: () => (
    <div className="w-[300px]">
      <Label htmlFor="email">Email</Label>
      <Input id="email" type="email" placeholder="Enter your email" />
    </div>
  ),
}

export const Password: Story = {
  render: () => (
    <div className="w-[300px]">
      <Label htmlFor="password">Password</Label>
      <Input id="password" type="password" placeholder="Enter your password" />
    </div>
  ),
}

export const Number: Story = {
  render: () => (
    <div className="w-[300px]">
      <Label htmlFor="age">Age</Label>
      <Input id="age" type="number" placeholder="Enter your age" />
    </div>
  ),
}

export const Search: Story = {
  render: () => (
    <div className="w-[300px]">
      <Label htmlFor="search">Search</Label>
      <Input id="search" type="search" placeholder="Search..." />
    </div>
  ),
}

export const Disabled: Story = {
  args: {
    type: 'text',
    placeholder: 'Disabled input',
    disabled: true,
  },
}

export const WithValue: Story = {
  args: {
    type: 'text',
    placeholder: 'Enter text...',
    defaultValue: 'Pre-filled value',
  },
}

export const ErrorState: Story = {
  render: () => (
    <div className="w-[300px]">
      <Label htmlFor="error-input">Username</Label>
      <Input
        id="error-input"
        type="text"
        placeholder="Enter username"
        aria-invalid="true"
        defaultValue="invalid-username!"
      />
      <p className="text-destructive mt-1 text-sm">
        Username must be alphanumeric
      </p>
    </div>
  ),
}

export const File: Story = {
  render: () => (
    <div className="w-[300px]">
      <Label htmlFor="file">Upload file</Label>
      <Input id="file" type="file" />
    </div>
  ),
}

export const AllTypes: Story = {
  render: () => (
    <div className="flex w-[300px] flex-col gap-4">
      <div>
        <Label htmlFor="text">Text</Label>
        <Input id="text" type="text" placeholder="Text input" />
      </div>
      <div>
        <Label htmlFor="email2">Email</Label>
        <Input id="email2" type="email" placeholder="Email input" />
      </div>
      <div>
        <Label htmlFor="password2">Password</Label>
        <Input id="password2" type="password" placeholder="Password input" />
      </div>
      <div>
        <Label htmlFor="number2">Number</Label>
        <Input id="number2" type="number" placeholder="Number input" />
      </div>
      <div>
        <Label htmlFor="search2">Search</Label>
        <Input id="search2" type="search" placeholder="Search input" />
      </div>
      <div>
        <Label htmlFor="tel">Tel</Label>
        <Input id="tel" type="tel" placeholder="Phone number" />
      </div>
      <div>
        <Label htmlFor="url">URL</Label>
        <Input id="url" type="url" placeholder="https://example.com" />
      </div>
    </div>
  ),
}

export const Interactive: Story = {
  render: () => {
    const [value, setValue] = React.useState('')

    return (
      <div className="w-[300px]">
        <Label htmlFor="interactive">Type something</Label>
        <Input
          id="interactive"
          type="text"
          placeholder="Start typing..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <p className="text-muted-foreground mt-2 text-sm">
          Current value: <strong>{value || '(empty)'}</strong>
        </p>
      </div>
    )
  },
}
