<script lang="ts">
  import type { CardProps, CardVariant } from './types';
  
  /**
   * The visual style variant of the card
   * @default 'default'
   */
  export let variant: CardVariant = 'default';
  
  /**
   * Whether to apply padding to the card
   * @default true
   */
  export let padding = true;
  
  /**
   * Whether to apply a shadow to the card
   * @default true
   */
  export let shadow = true;
  
  /**
   * Whether the card should have hover effects
   * @default false
   */
  export let hover = false;
  
  /**
   * Whether the card should be interactive
   * @default false
   */
  export let interactive = false;
  
  /**
   * Whether the card should take the full width of its container
   * @default false
   */
  export let fullWidth = false;
  
  /**
   * Optional class name to apply to the card
   */
  export let className = '';
  
  // Compute variant classes
  $: variantClasses = {
    default: 'bg-surface border border-border',
    outline: 'bg-transparent border border-border',
    flat: 'bg-surface',
    elevated: 'bg-surface border border-border'
  }[variant];
  
  // Compute padding class
  $: paddingClass = padding ? 'p-6' : '';
  
  // Compute shadow class
  $: shadowClass = shadow 
    ? variant === 'elevated' 
      ? 'shadow-lg' 
      : variant === 'default' 
        ? 'shadow-md' 
        : ''
    : '';
  
  // Compute hover class
  $: hoverClass = hover 
    ? variant === 'elevated' 
      ? 'hover:shadow-xl transition-shadow duration-300' 
      : variant === 'default' 
        ? 'hover:shadow-lg transition-shadow duration-300' 
        : variant === 'outline'
          ? 'hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors duration-300'
          : 'hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors duration-300'
    : '';
  
  // Compute interactive class
  $: interactiveClass = interactive 
    ? 'cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-gray-900' 
    : '';
  
  // Compute width class
  $: widthClass = fullWidth ? 'w-full' : '';
</script>

{#if interactive}
  <button
    type="button"
    class="rounded-lg {variantClasses} {paddingClass} {shadowClass} {hoverClass} {interactiveClass} {widthClass} {className} text-left w-full"
    on:click
    on:keydown
    on:mouseover
    on:mouseenter
    on:mouseleave
    on:focus
    on:blur
    {...$$restProps}
  >
    <slot />
  </button>
{:else}
  <div
    class="rounded-lg {variantClasses} {paddingClass} {shadowClass} {hoverClass} {widthClass} {className}"
    {...$$restProps}
  >
    <slot />
  </div>
{/if}
