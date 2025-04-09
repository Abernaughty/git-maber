import { vi } from 'vitest';
import type { Project } from './api/types';
import type { BlogPost } from './api/types';

/**
 * Mock project data for testing
 */
export const mockProjects: Project[] = [
  {
    id: 'test-1',
    title: 'Test Project 1',
    description: 'A test project for unit tests',
    techStack: ['TypeScript', 'Svelte', 'Vitest'],
    imageUrl: '/images/projects/test1.png',
    liveUrl: 'https://example.com/test1',
    sourceUrl: 'https://github.com/example/test1',
    featured: true,
    createdAt: '2025-01-01T00:00:00.000Z'
  },
  {
    id: 'test-2',
    title: 'Test Project 2',
    description: 'Another test project for unit tests',
    techStack: ['JavaScript', 'React', 'Jest'],
    imageUrl: '/images/projects/test2.png',
    liveUrl: 'https://example.com/test2',
    sourceUrl: 'https://github.com/example/test2',
    featured: false,
    createdAt: '2025-02-01T00:00:00.000Z'
  }
];

/**
 * Mock blog post data for testing
 */
export const mockBlogPosts: BlogPost[] = [
  {
    id: 'blog-1',
    title: 'Test Blog Post 1',
    slug: 'test-blog-post-1',
    excerpt: 'This is a test blog post for unit tests',
    content: 'This is the full content of the test blog post.',
    author: 'Test Author',
    tags: ['test', 'unit-testing'],
    publishedAt: '2025-01-15T00:00:00.000Z',
    featured: true
  },
  {
    id: 'blog-2',
    title: 'Test Blog Post 2',
    slug: 'test-blog-post-2',
    excerpt: 'This is another test blog post for unit tests',
    content: 'This is the full content of the second test blog post.',
    author: 'Test Author',
    tags: ['test', 'vitest'],
    publishedAt: '2025-02-15T00:00:00.000Z',
    featured: false
  }
];

/**
 * Create a mock API module
 * @param mockData The mock data to return
 * @returns A mock API module with get, post, put, and delete methods
 */
export function createMockApi<T>(mockData: T[] = []) {
  return {
    get: vi.fn().mockResolvedValue(mockData),
    post: vi.fn().mockImplementation((url, data) => {
      return Promise.resolve({ ...data, id: 'new-id' });
    }),
    put: vi.fn().mockImplementation((url, data) => {
      return Promise.resolve(data);
    }),
    delete: vi.fn().mockResolvedValue({ success: true })
  };
}

/**
 * Mock localStorage for testing
 */
export function setupLocalStorageMock() {
  const localStorageMock = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn()
  };
  
  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
    writable: true
  });
  
  return localStorageMock;
}

/**
 * Wait for a specified time
 * @param ms Time to wait in milliseconds
 * @returns A promise that resolves after the specified time
 */
export function wait(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
