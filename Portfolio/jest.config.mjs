// jest.config.mjs
export default {
  transform: {
    '^.+\\.svelte$': 'svelte-jester',
    '^.+\\.ts$': 'ts-jest'
  },
  moduleFileExtensions: ['js', 'ts', 'svelte'],
  setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect'],
  testEnvironment: 'jsdom',
  // Handle SvelteKit's $lib alias
  moduleNameMapper: {
    '^\\$lib(.*)$': '<rootDir>/src/lib$1'
  },
  // Ignore build output and node_modules
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/build/'],
  // Collect coverage information
  collectCoverageFrom: [
    'src/**/*.{js,ts,svelte}',
    '!src/**/*.d.ts',
    '!src/**/*.test.{js,ts,svelte}',
    '!src/**/__tests__/**'
  ],
  // Set coverage thresholds
  coverageThreshold: {
    global: {
      statements: 80,
      branches: 80,
      functions: 80,
      lines: 80
    }
  }
};
