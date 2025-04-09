import { get as _get } from './client';
import type { Project } from './types';

/**
 * Get all projects
 * @returns Promise with an array of projects
 */
export async function getProjects(): Promise<Project[]> {
  // In a production environment, this would call the API
  // For now, return mock data
  return [
    {
      id: '1',
      title: 'Blackjack Game',
      description:
        'A classic Blackjack card game implementation with both Python GUI and web versions.',
      techStack: ['Python', 'Tkinter', 'HTML', 'CSS', 'JavaScript'],
      imageUrl: '/images/projects/blackjack.png',
      liveUrl: 'https://red-field-09b58bd10.1.azurestaticapps.net/',
      sourceUrl: 'https://github.com/git-maber/git-maber/tree/main/Blackjack',
      featured: true,
      createdAt: '2024-12-15T00:00:00.000Z'
    },
    {
      id: '2',
      title: 'PokeData',
      description:
        'Pokémon card price tracking and data visualization application for trading card collectors.',
      techStack: ['Svelte', 'JavaScript', 'IndexedDB', 'API Integration'],
      imageUrl: '/images/projects/pokedata.png',
      liveUrl: 'https://thankful-bush-0957ca310.3.azurestaticapps.net/',
      sourceUrl: 'https://github.com/git-maber/git-maber/tree/main/PokeData',
      featured: true,
      createdAt: '2025-02-10T00:00:00.000Z'
    },
    {
      id: '3',
      title: 'Portfolio Website',
      description:
        'Personal portfolio website built with Svelte and SvelteKit to showcase projects and skills.',
      techStack: ['Svelte', 'SvelteKit', 'TypeScript', 'CSS'],
      imageUrl: '/images/projects/portfolio.png',
      liveUrl: 'https://git-maber.github.io/git-maber/',
      sourceUrl: 'https://github.com/git-maber/git-maber/tree/main/Portfolio',
      featured: true,
      createdAt: '2025-03-20T00:00:00.000Z'
    }
  ];
}

/**
 * Get a project by ID
 * @param id Project ID
 * @returns Promise with the project
 */
export async function getProject(id: string): Promise<Project> {
  const projects = await getProjects();
  const project = projects.find(p => p.id === id);

  if (!project) {
    throw new Error(`Project with ID ${id} not found`);
  }

  return project;
}
