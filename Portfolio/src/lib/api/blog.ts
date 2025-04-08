import { get } from './client';
import type { BlogPost } from './types';

/**
 * Get all blog posts
 * @returns Promise with an array of blog posts
 */
export async function getPosts(): Promise<BlogPost[]> {
  // In a production environment, this would call the API
  // For now, return mock data
  return [
    {
      id: '1',
      title: 'Getting Started with Svelte',
      slug: 'getting-started-with-svelte',
      excerpt: 'Learn the basics of Svelte and why it's a great choice for modern web development.',
      content: 'Svelte is a radical new approach to building user interfaces. Whereas traditional frameworks like React and Vue do the bulk of their work in the browser, Svelte shifts that work into a compile step that happens when you build your app...',
      author: 'Mike Abernathy',
      tags: ['Svelte', 'JavaScript', 'Web Development'],
      publishedAt: '2025-01-15T00:00:00.000Z',
      featured: true
    },
    {
      id: '2',
      title: 'Python vs JavaScript: A Comparison',
      slug: 'python-vs-javascript',
      excerpt: 'Comparing two of the most popular programming languages for different use cases.',
      content: 'Python and JavaScript are two of the most widely used programming languages in the world. While JavaScript dominates web development, Python has become the go-to language for data science, machine learning, and backend development...',
      author: 'Mike Abernathy',
      tags: ['Python', 'JavaScript', 'Programming'],
      publishedAt: '2025-02-20T00:00:00.000Z',
      featured: true
    }
  ];
}

/**
 * Get a blog post by slug
 * @param slug Blog post slug
 * @returns Promise with the blog post
 */
export async function getPostBySlug(slug: string): Promise<BlogPost> {
  const posts = await getPosts();
  const post = posts.find(p => p.slug === slug);
  
  if (!post) {
    throw new Error(`Blog post with slug '${slug}' not found`);
  }
  
  return post;
}
