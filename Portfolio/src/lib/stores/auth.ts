import { writable } from 'svelte/store';
import type { User, LoginRequest } from '../api/types';
import { authApi } from '../api';

// Check if code is running in a browser environment
const isBrowser = typeof window !== 'undefined';

// Define the store state interface
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

// Create the initial state
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null
};

// Create the writable store
function createAuthStore() {
  const { subscribe, set, update } = writable<AuthState>(initialState);

  // Create the store object
  const storeObj = {
    subscribe,

    // Login user
    login: async (credentials: LoginRequest) => {
      // Set loading state
      update(state => ({ ...state, loading: true, error: null }));

      try {
        // Login user via API
        const response = await authApi.login(credentials);

        if (response.success && response.token) {
          // Store token in localStorage (browser only)
          if (isBrowser) {
            localStorage.setItem('token', response.token);
          }

          // Update store with authenticated state
          update(state => ({
            ...state,
            isAuthenticated: true,
            loading: false
          }));

          // Load user data
          await storeObj.loadUser();
        } else {
          throw new Error(response.message || 'Login failed');
        }
      } catch (error) {
        console.error('Login error:', error);

        // Update store with error
        update(state => ({
          ...state,
          loading: false,
          error: error instanceof Error ? error.message : 'Login failed'
        }));
      }
    },

    // Load user data
    loadUser: async () => {
      // Skip if not in browser
      if (!isBrowser) return;

      // Check if we have a token
      const token = localStorage.getItem('token');
      if (!token) {
        return;
      }

      // Set loading state
      update(state => ({ ...state, loading: true, error: null }));

      try {
        // Get user data via API
        const user = await authApi.getUser();

        // Update store with user data
        update(state => ({
          ...state,
          user,
          isAuthenticated: true,
          loading: false
        }));
      } catch (error) {
        console.error('Error loading user:', error);

        // Update store with error and reset auth state
        update(state => ({
          ...state,
          user: null,
          isAuthenticated: false,
          loading: false,
          error: error instanceof Error ? error.message : 'Failed to load user'
        }));

        // Remove invalid token (browser only)
        if (isBrowser) {
          localStorage.removeItem('token');
        }
      }
    },

    // Logout user
    logout: () => {
      // Remove token from localStorage (browser only)
      if (isBrowser) {
        localStorage.removeItem('token');
      }

      // Reset auth state
      set(initialState);
    },

    // Reset the store to initial state
    reset: () => set(initialState)
  };

  return storeObj;
}

// Create and export the store
export const authStore = createAuthStore();
