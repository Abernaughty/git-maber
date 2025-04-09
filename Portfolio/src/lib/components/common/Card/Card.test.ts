import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import Card from './Card.svelte';

describe('Card Component', () => {
  it('renders with default props', () => {
    const { container } = render(Card, { props: { default: 'Card Content' } });
    
    // Check that the card renders with content
    expect(container.textContent).toContain('Card Content');
    
    // Check default classes
    const card = container.firstChild as HTMLElement;
    expect(card.className).toContain('bg-surface');
    expect(card.className).toContain('border');
    expect(card.className).toContain('p-6');
    expect(card.className).toContain('shadow-md');
  });

  it('applies variant classes correctly', () => {
    const { container, rerender } = render(Card);
    let card = container.firstChild as HTMLElement;
    
    // Default variant
    expect(card.className).toContain('bg-surface');
    expect(card.className).toContain('border');
    
    // Outline variant
    rerender({ variant: 'outline' });
    card = container.firstChild as HTMLElement;
    expect(card.className).toContain('bg-transparent');
    expect(card.className).toContain('border');
    
    // Flat variant
    rerender({ variant: 'flat' });
    card = container.firstChild as HTMLElement;
    expect(card.className).toContain('bg-surface');
    expect(card.className).not.toContain('border');
    
    // Elevated variant
    rerender({ variant: 'elevated' });
    card = container.firstChild as HTMLElement;
    expect(card.className).toContain('bg-surface');
    expect(card.className).toContain('border');
    expect(card.className).toContain('shadow-lg');
  });

  it('applies padding when padding is true', () => {
    const { container } = render(Card, { props: { padding: true } });
    const card = container.firstChild as HTMLElement;
    
    expect(card.className).toContain('p-6');
  });

  it('does not apply padding when padding is false', () => {
    const { container } = render(Card, { props: { padding: false } });
    const card = container.firstChild as HTMLElement;
    
    expect(card.className).not.toContain('p-6');
  });

  it('applies shadow when shadow is true', () => {
    const { container } = render(Card, { props: { shadow: true } });
    const card = container.firstChild as HTMLElement;
    
    expect(card.className).toContain('shadow-md');
  });

  it('does not apply shadow when shadow is false', () => {
    const { container } = render(Card, { props: { shadow: false } });
    const card = container.firstChild as HTMLElement;
    
    expect(card.className).not.toContain('shadow-md');
    expect(card.className).not.toContain('shadow-lg');
  });

  it('applies hover effects when hover is true', () => {
    const { container } = render(Card, { props: { hover: true } });
    const card = container.firstChild as HTMLElement;
    
    expect(card.className).toContain('hover:shadow-lg');
    expect(card.className).toContain('transition-shadow');
  });

  it('applies interactive styles when interactive is true', () => {
    const { container } = render(Card, { props: { interactive: true } });
    const card = container.firstChild as HTMLElement;
    
    expect(card.className).toContain('cursor-pointer');
    expect(card.className).toContain('focus:outline-none');
    expect(card.className).toContain('focus:ring-2');
    expect(card.getAttribute('tabindex')).toBe('0');
    expect(card.getAttribute('role')).toBe('button');
  });

  it('applies full width when fullWidth is true', () => {
    const { container } = render(Card, { props: { fullWidth: true } });
    const card = container.firstChild as HTMLElement;
    
    expect(card.className).toContain('w-full');
  });

  it('applies custom class name', () => {
    const { container } = render(Card, { props: { className: 'custom-class' } });
    const card = container.firstChild as HTMLElement;
    
    expect(card.className).toContain('custom-class');
  });

  it('calls onClick handler when clicked', async () => {
    // Create a mock function
    const onClick = vi.fn();
    
    // Render the card with the mock function
    const { container } = render(Card, { props: { onClick, interactive: true } });
    const card = container.firstChild as HTMLElement;
    
    // Click the card
    await fireEvent.click(card);
    
    // Check that the mock function was called
    expect(onClick).toHaveBeenCalled();
  });
});
