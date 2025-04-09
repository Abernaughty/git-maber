# Testing Guide for Portfolio Project

This document provides guidelines for writing and running tests for the Portfolio Enhancement Project.

## Testing Framework

We use [Vitest](https://vitest.dev/) as our testing framework, which is specifically designed for Vite-based projects like SvelteKit. It provides:

- Fast test execution with native ESM support
- Watch mode for development
- Coverage reporting
- TypeScript support
- Compatible with Jest's API

For testing Svelte components, we use [@testing-library/svelte](https://testing-library.com/docs/svelte-testing-library/intro/), which provides utilities for testing components in a user-centric way.

## Test Structure

Tests are organized following the same structure as the source code, with test files placed alongside the files they test:

```
src/
├── lib/
│   ├── api/
│   │   ├── projects.ts
│   │   ├── projects.test.ts  // Tests for projects.ts
│   ├── components/
│   │   ├── TailwindButton.svelte
│   │   ├── TailwindButton.test.ts  // Tests for TailwindButton.svelte
│   ├── test-utils.ts  // Shared testing utilities
```

## Running Tests

The following npm scripts are available for running tests:

- `npm run test` - Run all tests once
- `npm run test:watch` - Run tests in watch mode (automatically re-runs tests when files change)
- `npm run test:coverage` - Run tests with coverage reporting

## Writing Tests

### Testing API Functions

For API functions, focus on testing:

1. Correct handling of successful responses
2. Proper error handling
3. Correct data transformation

Example:

```typescript
import { describe, it, expect } from 'vitest';
import { getProjects } from './projects';

describe('Projects API', () => {
  it('should return an array of projects', async () => {
    const projects = await getProjects();
    expect(Array.isArray(projects)).toBe(true);
    expect(projects.length).toBeGreaterThan(0);
  });
});
```

### Testing Svelte Components

For Svelte components, focus on testing:

1. Rendering with different props
2. User interactions (clicks, input, etc.)
3. Component state changes
4. Event handling

Example:

```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import Button from './Button.svelte';

describe('Button', () => {
  it('renders with the correct text', () => {
    const { getByText } = render(Button, { props: { text: 'Click me' } });
    expect(getByText('Click me')).toBeTruthy();
  });

  it('calls onClick when clicked', async () => {
    const onClick = vi.fn();
    const { getByText } = render(Button, { props: { text: 'Click me', onClick } });
    await fireEvent.click(getByText('Click me'));
    expect(onClick).toHaveBeenCalled();
  });
});
```

### Testing Stores

For Svelte stores, focus on testing:

1. Initial state
2. State changes after actions
3. Derived store calculations

Example:

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { get } from 'svelte/store';
import { createProjectsStore } from './projectsStore';

describe('Projects Store', () => {
  let store;

  beforeEach(() => {
    store = createProjectsStore();
  });

  it('has the correct initial state', () => {
    const state = get(store);
    expect(state.projects).toEqual([]);
    expect(state.loading).toBe(false);
    expect(state.error).toBe(null);
  });

  it('updates state when loading projects', () => {
    store.loadProjects();
    const state = get(store);
    expect(state.loading).toBe(true);
  });
});
```

## Test Utilities

We provide several test utilities in `src/lib/test-utils.ts`:

- `mockProjects` - Mock project data for testing
- `mockBlogPosts` - Mock blog post data for testing
- `createMockApi()` - Creates a mock API module with get, post, put, and delete methods
- `setupLocalStorageMock()` - Sets up a mock localStorage for testing
- `wait(ms)` - Waits for a specified time (useful for testing async behavior)

Example usage:

```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mockProjects, createMockApi } from '../test-utils';
import { getProjects } from './projects';

// Mock the API client
vi.mock('./client', () => {
  return createMockApi(mockProjects);
});

describe('Projects API with mocked client', () => {
  it('should return mock projects', async () => {
    const projects = await getProjects();
    expect(projects).toEqual(mockProjects);
  });
});
```

## Best Practices

1. **Test behavior, not implementation** - Focus on what the code does, not how it does it.
2. **Keep tests simple** - Each test should verify one specific behavior.
3. **Use descriptive test names** - Test names should clearly describe what is being tested.
4. **Avoid testing implementation details** - Test the public API, not internal implementation.
5. **Maintain test independence** - Tests should not depend on each other.
6. **Clean up after tests** - Reset any global state or mocks after each test.
7. **Use the testing library effectively** - Prefer queries that resemble how users interact with your app.

## Coverage Goals

We aim for the following coverage thresholds:

- Statements: 80%
- Branches: 80%
- Functions: 80%
- Lines: 80%

Critical paths should have 100% coverage.

## Continuous Integration

Tests are automatically run as part of our CI/CD pipeline. Pull requests must pass all tests before they can be merged.
