/**
 * Button Component Types
 * 
 * This file contains TypeScript types for the Button component.
 */

export type ButtonVariant = 
  | 'primary'    // Main action, high emphasis
  | 'secondary'  // Alternative action
  | 'outline'    // Lower emphasis, bordered button
  | 'ghost'      // Lowest emphasis, background only on hover
  | 'link';      // Appears as a link but has button semantics

export type ButtonSize = 
  | 'xs'   // Extra small
  | 'sm'   // Small
  | 'md'   // Medium (default)
  | 'lg'   // Large
  | 'xl';  // Extra large

export type ButtonType = 
  | 'button'
  | 'submit'
  | 'reset';

export interface ButtonProps {
  /**
   * The visual style variant of the button
   * @default 'primary'
   */
  variant?: ButtonVariant;
  
  /**
   * The size of the button
   * @default 'md'
   */
  size?: ButtonSize;
  
  /**
   * The HTML button type attribute
   * @default 'button'
   */
  type?: ButtonType;
  
  /**
   * Whether the button is disabled
   * @default false
   */
  disabled?: boolean;
  
  /**
   * Whether the button is in a loading state
   * @default false
   */
  loading?: boolean;
  
  /**
   * Whether the button should take the full width of its container
   * @default false
   */
  fullWidth?: boolean;
  
  /**
   * Optional icon to display before the button text
   */
  leftIcon?: string;
  
  /**
   * Optional icon to display after the button text
   */
  rightIcon?: string;
  
  /**
   * Optional class name to apply to the button
   */
  class?: string;
  
  /**
   * Optional click handler
   */
  onClick?: (event: MouseEvent) => void;
}
