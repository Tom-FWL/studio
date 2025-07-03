'use server';

import { projects as initialProjects } from './data';
import type { Project } from './types';

// This is a simple in-memory store.
// In a real application, you would use a database.
let projects: Project[] = [...initialProjects];

function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w-]+/g, '') // Remove all non-word chars
    .replace(/--+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, ''); // Trim - from end of text
}

export async function getProjects(): Promise<Project[]> {
  // Return a copy to prevent direct mutation
  return JSON.parse(JSON.stringify(projects));
}

export async function getProjectBySlug(slug: string): Promise<Project | undefined> {
  const allProjects = await getProjects();
  return allProjects.find((p) => p.slug === slug);
}

export async function addProject(projectData: Omit<Project, 'slug' | 'mediaType'>): Promise<Project> {
  const allProjects = await getProjects();
  let slug = slugify(projectData.title);
  const originalSlug = slug;
  let counter = 1;
  while (allProjects.some(p => p.slug === slug)) {
    slug = `${originalSlug}-${counter}`;
    counter++;
  }

  const getMediaType = (url: string) => (url.endsWith('.mp4') ? 'video' : 'image');

  const newProject: Project = {
    ...projectData,
    slug,
    mediaType: getMediaType(projectData.mediaUrl),
  };

  projects.unshift(newProject);
  return newProject;
}

export async function updateProject(slug: string, projectData: Omit<Project, 'slug' | 'mediaType'>): Promise<Project> {
    const projectIndex = projects.findIndex((p) => p.slug === slug);
    if (projectIndex === -1) {
        throw new Error('Project not found');
    }

    const getMediaType = (url: string) => (url.endsWith('.mp4') ? 'video' : 'image');

    const updatedProject: Project = {
        ...projects[projectIndex],
        ...projectData,
        slug: slug, // keep original slug
        mediaType: getMediaType(projectData.mediaUrl),
    };

    projects[projectIndex] = updatedProject;
    return updatedProject;
}
