import { writable, derived } from 'svelte/store';
import type { Project } from '../api/types';
import { projectsApi } from '../api';

// Define the store state interface
interface ProjectsState {
  projects: Project[];
  loading: boolean;
  error: string | null;
}

// Create the initial state
const initialState: ProjectsState = {
  projects: [],
  loading: false,
  error: null
};

// Create the writable store
function createProjectsStore() {
  const { subscribe, set, update } = writable<ProjectsState>(initialState);

  return {
    subscribe,
    
    // Fetch all projects
    fetchProjects: async () => {
      // Set loading state
      update(state => ({ ...state, loading: true, error: null }));
      
      try {
        // Fetch projects from API
        const projects = await projectsApi.getProjects();
        
        // Update store with fetched projects
        update(state => ({
          ...state,
          projects,
          loading: false
        }));
      } catch (error) {
        console.error('Error fetching projects:', error);
        
        // Update store with error
        update(state => ({
          ...state,
          loading: false,
          error: error instanceof Error ? error.message : 'Failed to fetch projects'
        }));
      }
    },
    
    // Reset the store to initial state
    reset: () => set(initialState)
  };
}

// Create and export the store
export const projectsStore = createProjectsStore();

// Derived store for featured projects
export const featuredProjects = derived(
  projectsStore,
  $projectsStore => $projectsStore.projects.filter(project => project.featured)
);
