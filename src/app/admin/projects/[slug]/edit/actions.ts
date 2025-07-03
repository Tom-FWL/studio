'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { updateProject } from '@/lib/project-service';
import { redirect } from 'next/navigation';

const formSchema = z.object({
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

export async function onEditProject(prevState: FormState, data: FormData): Promise<FormState> {
  const formData = Object.fromEntries(data);
  const parsed = formSchema.safeParse(formData);

  if (!parsed.success) {
    return {
      message: parsed.error.issues.map((issue) => issue.message).join(', '),
    };
  }

  const { slug, ...projectData } = parsed.data;

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

  await updateProject(slug, projectUpdateData);

  revalidatePath('/');
  revalidatePath('/admin/dashboard');
  revalidatePath(`/projects/${slug}`);
  revalidatePath(`/admin/projects/${slug}/edit`);

  redirect('/admin/dashboard');
}
