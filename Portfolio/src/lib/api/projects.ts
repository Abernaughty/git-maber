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
      title: 'Pokemon Card Price Checker (PCPC)',
      description:
        'Enterprise-grade Pokémon card pricing platform (monorepo) with Svelte frontend and Azure Functions backend. Uses Azure API Management, Cosmos DB (Serverless), and Azure Static Web Apps. Features real-time pricing from multiple sources, advanced search, and intelligent caching. Infrastructure as Code via Terraform and an accelerated DevContainer workflow.',
      techStack: [
        'Svelte',
        'TypeScript',
        'Rollup',
        'Azure Functions',
        'Azure API Management',
        'Cosmos DB',
        'Azure Static Web Apps',
        'Terraform',
        'Azure DevOps'
      ],
      imageUrl: '/images/projects/pcpc.png',
      liveUrl: 'https://pcpc.maber.io',
      sourceUrl: 'https://github.com/Abernaughty/PCPC',
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
