/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      // Extend the theme based on existing design tokens
      colors: {
        // Extract from current CSS variables
        primary: 'var(--primary)',
        secondary: 'var(--secondary)',
        accent: 'var(--accent)',
        background: 'var(--background)',
        text: 'var(--text)',
        surface: 'var(--surface)',
        border: 'var(--border)',
      },
      spacing: {
        // Extract from current CSS variables
        'xs': 'var(--space-xs)',
        'sm': 'var(--space-sm)',
        'md': 'var(--space-md)',
        'lg': 'var(--space-lg)',
        'xl': 'var(--space-xl)',
      },
      fontSize: {
        // Extract from current CSS variables
        'small': 'var(--fs-small)',
        'normal': 'var(--fs-normal)',
        'medium': 'var(--fs-medium)',
        'large': 'var(--fs-large)',
        'xl': 'var(--fs-xl)',
        'xxl': 'var(--fs-xxl)',
      },
      borderRadius: {
        DEFAULT: 'var(--border-radius)',
      },
      transitionDuration: {
        DEFAULT: 'var(--transition-speed)',
      },
      maxWidth: {
        'container': 'var(--container-width)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
  ],
  // Preserve existing CSS variables and classes
  corePlugins: {
    preflight: false, // This prevents Tailwind from resetting existing styles
  },
}
