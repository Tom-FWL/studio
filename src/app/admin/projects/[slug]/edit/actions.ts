'use server';

import { z } from 'zod';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

const formSchema = z.object({
  slug: z.string(),
  title: z.string().min(2, "Title is required."),
  category: z.string().min(2, "Category is required."),
  skills: z.string().min(2, "Please list at least one skill."),
  mediaUrl: z.string().url("Please enter a valid media URL."),
  description: z.string().min(10, "Description must be at least 10 characters long."),
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

  // In a real application, you would find the project by slug and update it in your database.
  // For this prototype, we'll just log the data to the console.
  const getMediaType = (url: string) => (url.endsWith('.mp4') ? 'video' : 'image');
  const mediaType = getMediaType(parsed.data.mediaUrl);
  console.log('Project updated with:', { ...parsed.data, mediaType });

  // Revalidate the paths that show project data to reflect changes
  revalidatePath('/');
  revalidatePath('/admin/dashboard');

  // Redirect back to the dashboard on success
  redirect('/admin/dashboard');
}
