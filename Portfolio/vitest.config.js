import { defineConfig } from 'vitest/config';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { fileURLToPath } from 'node:url';

export default defineConfig({
    plugins: [svelte()],
    test: {
      // Use global to avoid having to import expect, describe, etc. in every test
      globals: true,
      // Use jsdom for browser-like environment
      environment: 'jsdom',
      // Include Svelte files in tests
      include: ['src/**/*.{test,spec}.{js,ts,svelte}'],
      // Exclude build output and node_modules
      exclude: ['node_modules', 'build', '.svelte-kit'],
      // Mock CSS imports
      css: true,
      // Setup files to run before tests
      setupFiles: ['./vitest.setup.js'],
      // Coverage configuration
      coverage: {
        provider: 'v8',
        reporter: ['text', 'json', 'html'],
        exclude: [
          'node_modules',
          'build',
          '.svelte-kit',
          '**/*.d.ts',
          '**/*.test.{js,ts,svelte}',
          '**/__tests__/**'
        ],
        // Commented out thresholds for now as we're just getting started with testing
        // We'll uncomment these once we have more tests in place
        // thresholds: {
        //   statements: 80,
        //   branches: 80,
        //   functions: 80,
        //   lines: 80
        // }
      }
    },
    // Handle SvelteKit's $lib alias
    resolve: {
      alias: {
        $lib: '/src/lib'
      }
    }
  });
