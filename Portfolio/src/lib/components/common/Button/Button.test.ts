import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import Button from './Button.svelte';

describe('Button Component', () => {
  it('renders with default props', () => {
    const { getByText } = render(Button);
    
    // Check that the button renders with default text
    expect(getByText('Button')).toBeTruthy();
  });

  it('renders with custom text', () => {
    const { getByText } = render(Button, { props: { default: 'Custom Button' } });
    
    // Check that the button renders with custom text
    expect(getByText('Custom Button')).toBeTruthy();
  });

  it('applies primary style by default', () => {
    const { getByText } = render(Button);
    const button = getByText('Button');
    
    // Check that the button has the primary class
    expect(button.className).toContain('bg-primary-600');
    expect(button.className).toContain('text-white');
  });

  it('applies secondary style when variant is secondary', () => {
    const { getByText } = render(Button, { props: { variant: 'secondary' } });
    const button = getByText('Button');
    
    // Check that the button has the secondary class
    expect(button.className).toContain('bg-secondary-600');
    expect(button.className).toContain('text-white');
  });

  it('applies outline style when variant is outline', () => {
    const { getByText } = render(Button, { props: { variant: 'outline' } });
    const button = getByText('Button');
    
    // Check that the button has the outline class
    expect(button.className).toContain('bg-transparent');
    expect(button.className).toContain('border-primary-600');
    expect(button.className).toContain('text-primary-600');
  });

  it('applies ghost style when variant is ghost', () => {
    const { getByText } = render(Button, { props: { variant: 'ghost' } });
    const button = getByText('Button');
    
    // Check that the button has the ghost class
    expect(button.className).toContain('bg-transparent');
    expect(button.className).toContain('text-primary-600');
  });

  it('applies link style when variant is link', () => {
    const { getByText } = render(Button, { props: { variant: 'link' } });
    const button = getByText('Button');
    
    // Check that the button has the link class
    expect(button.className).toContain('bg-transparent');
    expect(button.className).toContain('text-primary-600');
    expect(button.className).toContain('p-0');
  });

  it('applies size classes correctly', () => {
    const { getByText, rerender } = render(Button, { props: { size: 'sm' } });
    let button = getByText('Button');
    
    // Check small size
    expect(button.className).toContain('text-sm');
    expect(button.className).toContain('px-3');
    
    // Check medium size (default)
    rerender({ size: 'md' });
    button = getByText('Button');
    expect(button.className).toContain('text-base');
    expect(button.className).toContain('px-4');
    
    // Check large size
    rerender({ size: 'lg' });
    button = getByText('Button');
    expect(button.className).toContain('text-lg');
    expect(button.className).toContain('px-6');
  });

  it('applies full width class when fullWidth is true', () => {
    const { getByText } = render(Button, { props: { fullWidth: true } });
    const button = getByText('Button');
    
    // Check that the button has the full width class
    expect(button.className).toContain('w-full');
  });

  it('applies disabled state when disabled is true', () => {
    const { getByText } = render(Button, { props: { disabled: true } });
    const button = getByText('Button');
    
    // Check that the button is disabled
    expect(button.hasAttribute('disabled')).toBe(true);
    expect(button.className).toContain('opacity-50');
    expect(button.className).toContain('cursor-not-allowed');
  });

  it('shows loading spinner when loading is true', () => {
    const { container } = render(Button, { props: { loading: true } });
    
    // Check that the loading spinner is visible
    const spinner = container.querySelector('svg.animate-spin');
    expect(spinner).toBeTruthy();
  });

  it('calls onClick handler when clicked', async () => {
    // Create a mock function
    const onClick = vi.fn();
    
    // Render the button with the mock function
    const { getByText } = render(Button, { props: { onClick } });
    const button = getByText('Button');
    
    // Click the button
    await fireEvent.click(button);
    
    // Check that the mock function was called
    expect(onClick).toHaveBeenCalled();
  });

  it('does not call onClick when disabled', async () => {
    // Create a mock function
    const onClick = vi.fn();
    
    // Render the button with the mock function and disabled
    const { getByText } = render(Button, { props: { onClick, disabled: true } });
    const button = getByText('Button');
    
    // Click the button
    await fireEvent.click(button);
    
    // Check that the mock function was not called
    expect(onClick).not.toHaveBeenCalled();
  });

  it('does not call onClick when loading', async () => {
    // Create a mock function
    const onClick = vi.fn();
    
    // Render the button with the mock function and loading
    const { container } = render(Button, { props: { onClick, loading: true } });
    const button = container.querySelector('button');
    
    // Click the button
    if (button) {
      await fireEvent.click(button);
    }
    
    // Check that the mock function was not called
    expect(onClick).not.toHaveBeenCalled();
  });
});
