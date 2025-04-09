/**
 * Card Component Types
 * 
 * This file contains TypeScript types for the Card component.
 */

export type CardVariant = 
  | 'default'    // Standard card with shadow
  | 'outline'    // Card with border instead of shadow
  | 'flat'       // Card without shadow or border
  | 'elevated';  // Card with more pronounced shadow

export interface CardProps {
  /**
   * The visual style variant of the card
   * @default 'default'
   */
  variant?: CardVariant;
  
  /**
   * Whether to apply padding to the card
   * @default true
   */
  padding?: boolean;
  
  /**
   * Whether to apply a shadow to the card (only applies to 'default' and 'elevated' variants)
   * @default true
   */
  shadow?: boolean;
  
  /**
   * Whether the card should have hover effects
   * @default false
   */
  hover?: boolean;
  
  /**
   * Whether the card should be interactive (adds cursor pointer and focus styles)
   * @default false
   */
  interactive?: boolean;
  
  /**
   * Whether the card should take the full width of its container
   * @default false
   */
  fullWidth?: boolean;
  
  /**
   * Optional class name to apply to the card
   */
  class?: string;
  
  /**
   * Optional click handler
   */
  onClick?: (event: MouseEvent) => void;
}
