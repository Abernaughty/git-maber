import { writable } from 'svelte/store';
import type { BlogPost } from '../api/types';
import { blogApi } from '../api';

// Define the store state interface
interface BlogState {
  posts: BlogPost[];
  loading: boolean;
  error: string | null;
}

// Create the initial state
const initialState: BlogState = {
  posts: [],
  loading: false,
  error: null
};

// Create the writable store
function createBlogStore() {
  const { subscribe, set, update } = writable<BlogState>(initialState);

  return {
    subscribe,

    // Fetch all blog posts
    fetchPosts: async () => {
      // Set loading state
      update(state => ({ ...state, loading: true, error: null }));

      try {
        // Fetch blog posts from API
        const posts = await blogApi.getPosts();

        // Update store with fetched posts
        update(state => ({
          ...state,
          posts,
          loading: false
        }));
      } catch (error) {
        console.error('Error fetching blog posts:', error);

        // Update store with error
        update(state => ({
          ...state,
          loading: false,
          error: error instanceof Error ? error.message : 'Failed to fetch blog posts'
        }));
      }
    },

    // Reset the store to initial state
    reset: () => set(initialState)
  };
}

// Create and export the store
export const blogStore = createBlogStore();
