import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MainTabs, TabItem } from './MainTabs';

describe('MainTabs', () => {
  const mockTabs: TabItem[] = [
    { value: 'tab1', label: 'Tab 1', content: <div>Content 1</div> },
    { value: 'tab2', label: 'Tab 2', content: <div>Content 2</div> },
  ];

  it('should render tabs', () => {
    render(<MainTabs tabs={mockTabs} />);
    expect(screen.getByText('Tab 1')).toBeInTheDocument();
    expect(screen.getByText('Tab 2')).toBeInTheDocument();
  });

  it('should show first tab content by default', () => {
    render(<MainTabs tabs={mockTabs} />);
    expect(screen.getByText('Content 1')).toBeInTheDocument();
  });

  it('should switch tabs on click', async () => {
    const user = userEvent.setup();
    render(<MainTabs tabs={mockTabs} />);

    await user.click(screen.getByText('Tab 2'));
    expect(screen.getByText('Content 2')).toBeVisible();
  });

  it('should call onValueChange', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<MainTabs tabs={mockTabs} onValueChange={handleChange} />);

    await user.click(screen.getByText('Tab 2'));
    expect(handleChange).toHaveBeenCalledWith('tab2');
  });

  it('should respect defaultValue', () => {
    render(<MainTabs tabs={mockTabs} defaultValue="tab2" />);
    expect(screen.getByText('Content 2')).toBeInTheDocument();
  });

  it('should disable tabs', () => {
    const tabsWithDisabled: TabItem[] = [
      ...mockTabs,
      { value: 'tab3', label: 'Disabled', content: <div>Content 3</div>, disabled: true },
    ];
    render(<MainTabs tabs={tabsWithDisabled} />);

    const disabledTab = screen.getByText('Disabled');
    expect(disabledTab).toHaveAttribute('disabled');
  });
});
