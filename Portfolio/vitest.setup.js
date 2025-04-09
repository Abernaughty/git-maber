// vitest.setup.js
import '@testing-library/svelte';
import { vi } from 'vitest';
import { cleanup } from '@testing-library/svelte';

// Add DOM matchers
import * as matchers from '@testing-library/jest-dom/matchers';
expect.extend(matchers);

// Mock SvelteKit's environment variables
global.ENV_VAR = 'test-value';

// Mock browser globals that might be missing in the test environment
global.fetch = vi.fn();
global.localStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn()
};

// Clean up after each test
afterEach(() => {
  // Clean up any rendered components
  cleanup();
  
  // Clean up any global mocks or side effects
  vi.restoreAllMocks();
  vi.clearAllMocks();
});
