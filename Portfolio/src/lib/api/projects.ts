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
        'Full-featured Blackjack implementation with both desktop (Python/Tkinter) and web versions. Features include persistent balance tracking, authentic Vegas-style game rules, custom card graphics, responsive design, and cross-platform compatibility. Demonstrates proficiency in both traditional desktop GUI and modern web development.',
      techStack: ['Python', 'Tkinter', 'HTML', 'CSS', 'JavaScript'],
      imageUrl: '/images/projects/blackjack.png',
      liveUrl: 'https://blackjack.maber.io',
      sourceUrl: 'https://github.com/Abernaughty/git-maber/tree/main/Blackjack',
      featured: true,
      createdAt: '2024-12-15T00:00:00.000Z'
    },
    {
      id: '2',
      title: 'PokeData',
      description:
        'Enterprise-grade Pokémon card pricing platform featuring real-time data from multiple sources. Built with cloud-first architecture supporting 555+ card sets with sub-second response times. Includes advanced search capabilities, PSA/CGC graded pricing, and intelligent caching with 167x performance optimization achieved through serverless architecture.',
      techStack: ['Svelte', 'TypeScript', 'Azure Functions', 'Cosmos DB', 'Azure Static Web Apps', 'API Management', 'GitHub Actions', 'Rollup', 'PNPM'],
      imageUrl: '/images/projects/pokedata.png',
      liveUrl: 'https://pokedata.maber.io',
      sourceUrl: 'https://github.com/Abernaughty/git-maber/tree/main/PokeData',
      featured: true,
      createdAt: '2025-02-10T00:00:00.000Z'
    },
    {
      id: '3',
      title: 'Portfolio Website',
      description:
        'Modern portfolio built with SvelteKit and TypeScript, featuring a comprehensive design system with reusable components, TailwindCSS integration, and full test coverage using Vitest. Implements SSR for optimal performance, accessibility-first design (WCAG 2.1 AA), and showcases clean architecture patterns with Svelte stores for state management.',
      techStack: ['Svelte', 'SvelteKit', 'TypeScript', 'CSS', 'TailwindCSS', 'Vitest', 'PostCSS', 'ESLint', 'Prettier'],
      imageUrl: '/images/projects/portfolio.png',
      liveUrl: 'https://dev.maber.io',
      sourceUrl: 'https://github.com/Abernaughty/git-maber/tree/main/Portfolio',
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
