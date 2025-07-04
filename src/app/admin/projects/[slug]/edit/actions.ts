'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { updateProject as updateProjectInDb } from '@/lib/project-service';

const formSchema = z.object({
  id: z.string().min(1, "Project ID is missing."),
  slug: z.string(),
  title: z.string().min(2, "Title is required."),
  category: z.string().min(2, "Category is required."),
  skills: z.string().min(2, "Please list at least one skill."),
  mediaUrl: z.string().url("Please enter a valid media URL."),
  mediaHint: z.string().optional(),
  description: z.string().min(10, "Description must be at least 10 characters long."),
  goal: z.string().min(10, "Goal must be at least 10 characters long."),
  process: z.string().min(10, "Process must be at least 10 characters long."),
  outcome: z.string().min(10, "Outcome must be at least 10 characters long."),
});

type FormState = {
  message: string;
};

// This server action is no longer used by the EditProjectForm, which now handles updates
// on the client-side to ensure Firebase authentication context is available.
// This prevents "PERMISSION_DENIED" errors from Firestore.
export async function onEditProject(prevState: FormState, data: FormData): Promise<FormState> {
  const formData = Object.fromEntries(data);
  const parsed = formSchema.safeParse(formData);

  if (!parsed.success) {
    return {
      message: parsed.error.issues.map((issue) => issue.message).join(', '),
    };
  }

  const { id, slug, ...projectData } = parsed.data;

  const projectUpdateData = {
    title: projectData.title,
    category: projectData.category,
    skills: projectData.skills.split(',').map(s => s.trim()),
    mediaUrl: projectData.mediaUrl,
    mediaHint: projectData.mediaHint || 'edited project',
    description: projectData.description,
    details: {
      goal: projectData.goal,
      process: projectData.process,
      outcome: projectData.outcome,
    }
  };

  try {
    await updateProjectInDb(id, projectUpdateData);

    revalidatePath('/');
    revalidatePath('/admin/dashboard');
    revalidatePath(`/projects/${slug}`);
    revalidatePath(`/admin/projects/${slug}/edit`);

    return { message: 'success' };
  } catch (error) {
    console.error("Failed to update project:", error);
    return { message: 'Failed to update project. Please try again.' };
  }
}
