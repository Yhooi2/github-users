import type { Meta, StoryObj } from '@storybook/react'
import { Label } from './label'
import { Input } from './input'

const meta: Meta<typeof Label> = {
  title: 'UI/Label',
  component: Label,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: 'Label text',
  },
}

export const WithInput: Story = {
  render: () => (
    <div className="w-[300px]">
      <Label htmlFor="name">Name</Label>
      <Input id="name" type="text" placeholder="Enter your name" />
    </div>
  ),
}

export const Required: Story = {
  render: () => (
    <div className="w-[300px]">
      <Label htmlFor="email-required">
        Email <span className="text-destructive">*</span>
      </Label>
      <Input id="email-required" type="email" placeholder="example@email.com" required />
    </div>
  ),
}

export const WithDescription: Story = {
  render: () => (
    <div className="w-[300px]">
      <Label htmlFor="username">Username</Label>
      <Input id="username" type="text" placeholder="johndoe" />
      <p className="text-muted-foreground mt-1 text-sm">
        This will be your public display name
      </p>
    </div>
  ),
}

export const Disabled: Story = {
  render: () => (
    <div className="w-[300px]" data-disabled="true">
      <Label htmlFor="disabled-input">Disabled field</Label>
      <Input id="disabled-input" type="text" placeholder="Cannot edit" disabled />
    </div>
  ),
}

export const MultipleFields: Story = {
  render: () => (
    <div className="flex w-[300px] flex-col gap-4">
      <div>
        <Label htmlFor="first-name">First name</Label>
        <Input id="first-name" type="text" placeholder="John" />
      </div>
      <div>
        <Label htmlFor="last-name">Last name</Label>
        <Input id="last-name" type="text" placeholder="Doe" />
      </div>
      <div>
        <Label htmlFor="email-multi">
          Email <span className="text-destructive">*</span>
        </Label>
        <Input id="email-multi" type="email" placeholder="john.doe@example.com" required />
      </div>
    </div>
  ),
}

export const WithCheckbox: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <input
        type="checkbox"
        id="terms"
        className="accent-primary h-4 w-4 cursor-pointer"
      />
      <Label htmlFor="terms" className="cursor-pointer font-normal">
        I accept the terms and conditions
      </Label>
    </div>
  ),
}

export const ErrorState: Story = {
  render: () => (
    <div className="w-[300px]">
      <Label htmlFor="error-field">Username</Label>
      <Input id="error-field" type="text" aria-invalid="true" defaultValue="invalid!" />
      <p className="text-destructive mt-1 text-sm">
        Username must be at least 3 characters
      </p>
    </div>
  ),
}
