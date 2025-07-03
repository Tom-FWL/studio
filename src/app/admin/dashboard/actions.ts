"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { addProject } from '@/lib/project-service';

export async function logout() {
  cookies().set("session", "", { expires: new Date(0) });
  redirect("/admin/login");
}

const formSchema = z.object({
  title: z.string().min(2, "Title is required."),
  category: z.string().min(2, "Category is required."),
  skills: z.string().min(2, "Please list at least one skill."),
  mediaUrl: z.string().url("Please enter a valid media URL."),
  mediaHint: z.string().optional(),
  description: z.string().min(10, "Description is required."),
  goal: z.string().min(10, "Goal is required."),
  process: z.string().min(10, "Process is required."),
  outcome: z.string().min(10, "Outcome is required."),
});

type FormState = {
  message: string;
  errors?: Record<string, string[] | undefined>;
};

export async function onAddProject(prevState: FormState, data: FormData): Promise<FormState> {
  const formData = Object.fromEntries(data);
  const parsed = formSchema.safeParse(formData);

  if (!parsed.success) {
    const errorMessages = parsed.error.issues.map(i => i.message).join(', ');
    return {
      message: `Invalid form data: ${errorMessages}`,
      errors: parsed.error.flatten().fieldErrors,
    };
  }
  
  const { title, category, skills, mediaUrl, mediaHint, description, goal, process, outcome } = parsed.data;

  const newProjectData = {
    title,
    category,
    description,
    skills: skills.split(",").map(s => s.trim()),
    mediaUrl,
    mediaHint: mediaHint || 'new project',
    details: {
      goal,
      process,
      outcome,
    }
  };

  await addProject(newProjectData);

  revalidatePath('/');
  revalidatePath('/admin/dashboard');

  return { message: "success" };
}
