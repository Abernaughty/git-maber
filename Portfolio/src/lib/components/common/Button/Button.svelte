<script lang="ts">
  import type { ButtonProps, ButtonVariant, ButtonSize, ButtonType } from './types';
  
  /**
   * The visual style variant of the button
   * @default 'primary'
   */
  export let variant: ButtonVariant = 'primary';
  
  /**
   * The size of the button
   * @default 'md'
   */
  export let size: ButtonSize = 'md';
  
  /**
   * The HTML button type attribute
   * @default 'button'
   */
  export let type: ButtonType = 'button';
  
  /**
   * Whether the button is disabled
   * @default false
   */
  export let disabled = false;
  
  /**
   * Whether the button is in a loading state
   * @default false
   */
  export let loading = false;
  
  /**
   * Whether the button should take the full width of its container
   * @default false
   */
  export let fullWidth = false;
  
  /**
   * Optional icon to display before the button text
   */
  export let leftIcon: string | undefined = undefined;
  
  /**
   * Optional icon to display after the button text
   */
  export let rightIcon: string | undefined = undefined;
  
  /**
   * Optional class name to apply to the button
   */
  export let className = '';
  
  // Compute variant classes
  $: variantClasses = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500',
    secondary: 'bg-secondary-600 text-white hover:bg-secondary-700 focus:ring-secondary-500',
    outline: 'bg-transparent border border-primary-600 text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900 focus:ring-primary-500',
    ghost: 'bg-transparent text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900 focus:ring-primary-500',
    link: 'bg-transparent text-primary-600 hover:underline p-0 h-auto focus:ring-primary-500'
  }[variant];
  
  // Compute size classes
  $: sizeClasses = {
    xs: 'text-xs px-2 py-1 h-6',
    sm: 'text-sm px-3 py-1.5 h-8',
    md: 'text-base px-4 py-2 h-10',
    lg: 'text-lg px-6 py-2.5 h-12',
    xl: 'text-xl px-8 py-3 h-14'
  }[size];
  
  // Compute width class
  $: widthClass = fullWidth ? 'w-full' : '';
  
  // Compute state classes
  $: stateClasses = disabled 
    ? 'opacity-50 cursor-not-allowed' 
    : 'focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-900';
  
  // Compute icon classes
  $: iconClasses = {
    xs: 'h-3 w-3',
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-5 w-5',
    xl: 'h-6 w-6'
  }[size];
  
  // Compute icon spacing
  $: iconSpacing = {
    xs: 'mr-1',
    sm: 'mr-1.5',
    md: 'mr-2',
    lg: 'mr-2.5',
    xl: 'mr-3'
  }[size];
  
  $: rightIconSpacing = {
    xs: 'ml-1',
    sm: 'ml-1.5',
    md: 'ml-2',
    lg: 'ml-2.5',
    xl: 'ml-3'
  }[size];
</script>

<button
  {type}
  class="inline-flex items-center justify-center font-medium rounded transition-colors duration-200 {variantClasses} {sizeClasses} {widthClass} {stateClasses} {className}"
  disabled={disabled || loading}
  on:click
  on:mouseover
  on:mouseenter
  on:mouseleave
  on:focus
  on:blur
  {...$$restProps}
>
  {#if loading}
    <span class="mr-2">
      <svg class="animate-spin {iconClasses}" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </span>
  {:else if leftIcon}
    <span class={iconSpacing}>
      <svg class={iconClasses} fill="currentColor" viewBox="0 0 24 24">
        <path d={leftIcon}></path>
      </svg>
    </span>
  {/if}
  
  <slot>Button</slot>
  
  {#if rightIcon && !loading}
    <span class={rightIconSpacing}>
      <svg class={iconClasses} fill="currentColor" viewBox="0 0 24 24">
        <path d={rightIcon}></path>
      </svg>
    </span>
  {/if}
</button>
