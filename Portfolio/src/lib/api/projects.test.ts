import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getProjects, getProject } from './projects';

describe('Projects API', () => {
  describe('getProjects', () => {
    it('should return an array of projects', async () => {
      const projects = await getProjects();
      
      // Check that we get an array
      expect(Array.isArray(projects)).toBe(true);
      
      // Check that the array is not empty
      expect(projects.length).toBeGreaterThan(0);
      
      // Check that each project has the required properties
      projects.forEach(project => {
        expect(project).toHaveProperty('id');
        expect(project).toHaveProperty('title');
        expect(project).toHaveProperty('description');
        expect(project).toHaveProperty('techStack');
        expect(project).toHaveProperty('featured');
        expect(project).toHaveProperty('createdAt');
      });
    });
  });

  describe('getProject', () => {
    it('should return a project by ID', async () => {
      // First get all projects to get a valid ID
      const projects = await getProjects();
      const firstProject = projects[0];
      
      // Then get a specific project
      const project = await getProject(firstProject.id);
      
      // Check that we got the right project
      expect(project.id).toBe(firstProject.id);
      expect(project.title).toBe(firstProject.title);
      expect(project.description).toBe(firstProject.description);
    });

    it('should throw an error for invalid ID', async () => {
      // Try to get a project with an invalid ID
      const invalidId = 'invalid-id';
      
      // Check that it throws an error
      await expect(getProject(invalidId)).rejects.toThrow(`Project with ID ${invalidId} not found`);
    });
  });
});
