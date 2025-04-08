/**
 * Type definitions for the API
 */

/**
 * Project interface
 */
export interface Project {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  imageUrl?: string;
  liveUrl?: string;
  sourceUrl?: string;
  featured: boolean;
  createdAt: string; // ISO date string
  content?: string;
}

/**
 * Blog post interface
 */
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  tags: string[];
  publishedAt: string; // ISO date string
  featured: boolean;
}

/**
 * User interface
 */
export interface User {
  userId: string;
  role: string;
}

/**
 * Login request interface
 */
export interface LoginRequest {
  username: string;
  password: string;
}

/**
 * Login response interface
 */
export interface LoginResponse {
  success: boolean;
  token?: string;
  message?: string;
}
