import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import TailwindButton from './TailwindButton.svelte';

describe('TailwindButton', () => {
  it('renders with default props', () => {
    const { getByText } = render(TailwindButton);
    
    // Check that the button renders with default text
    expect(getByText('Button')).toBeTruthy();
  });

  it('renders with custom text', () => {
    const { getByText } = render(TailwindButton, { props: { text: 'Custom Button' } });
    
    // Check that the button renders with custom text
    expect(getByText('Custom Button')).toBeTruthy();
  });

  it('applies primary style by default', () => {
    const { getByText } = render(TailwindButton);
    const button = getByText('Button');
    
    // Check that the button has the primary class
    expect(button.className).toContain('bg-primary');
    expect(button.className).toContain('text-background');
  });

  it('applies secondary style when type is secondary', () => {
    const { getByText } = render(TailwindButton, { props: { type: 'secondary' } });
    const button = getByText('Button');
    
    // Check that the button has the secondary class
    expect(button.className).toContain('bg-secondary');
    expect(button.className).toContain('text-background');
  });

  it('applies outline style when type is outline', () => {
    const { getByText } = render(TailwindButton, { props: { type: 'outline' } });
    const button = getByText('Button');
    
    // Check that the button has the outline class
    expect(button.className).toContain('bg-transparent');
    expect(button.className).toContain('border-primary');
    expect(button.className).toContain('text-primary');
  });

  it('calls onClick handler when clicked', async () => {
    // Create a mock function
    const onClick = vi.fn();
    
    // Render the button with the mock function
    const { getByText } = render(TailwindButton, { props: { onClick } });
    const button = getByText('Button');
    
    // Click the button
    await fireEvent.click(button);
    
    // Check that the mock function was called
    expect(onClick).toHaveBeenCalled();
  });
});
