import { colors, typography, spacing, borderRadius, shadows, transitions, zIndex } from './src/lib/styles/design-tokens';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    // Use design tokens as base theme
    colors: {
      ...colors,
      // Preserve compatibility with existing CSS variables
      primary: 'var(--primary)',
      secondary: 'var(--secondary)',
      accent: 'var(--accent)',
      background: 'var(--background)',
      text: 'var(--text)',
      surface: 'var(--surface)',
      border: 'var(--border)'
    },
    fontFamily: typography.fontFamily,
    fontSize: {
      ...typography.fontSize,
      // Preserve compatibility with existing CSS variables
      small: 'var(--fs-small)',
      normal: 'var(--fs-normal)',
      medium: 'var(--fs-medium)',
      large: 'var(--fs-large)',
      xl: 'var(--fs-xl)',
      xxl: 'var(--fs-xxl)'
    },
    fontWeight: typography.fontWeight,
    lineHeight: typography.lineHeight,
    letterSpacing: typography.letterSpacing,
    borderRadius,
    boxShadow: shadows,
    zIndex,
    extend: {
      spacing: {
        ...spacing,
        // Preserve compatibility with existing CSS variables
        xs: 'var(--space-xs)',
        sm: 'var(--space-sm)',
        md: 'var(--space-md)',
        lg: 'var(--space-lg)',
        xl: 'var(--space-xl)'
      },
      transitionDuration: {
        ...transitions.duration,
        DEFAULT: 'var(--transition-speed)'
      },
      transitionTimingFunction: transitions.timing,
      maxWidth: {
        container: 'var(--container-width)'
      }
    }
  },
  plugins: [require('@tailwindcss/typography'), require('@tailwindcss/forms')],
  // Preserve existing CSS variables and classes
  corePlugins: {
    preflight: false // This prevents Tailwind from resetting existing styles
  }
};
