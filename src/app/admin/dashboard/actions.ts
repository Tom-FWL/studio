
"use server";

import { revalidatePath } from 'next/cache';
import { deleteProject as deleteProjectFromDb } from '@/lib/project-service';

// The 'onAddProject' server action has been removed and replaced with a client-side
// handler in 'add-project-form.tsx' to correctly handle Firebase authentication.
// This prevents the "PERMISSION_DENIED" error from Firestore.

export async function deleteProject(id: string): Promise<{ message: string }> {
  try {
    await deleteProjectFromDb(id);
    revalidatePath('/');
    revalidatePath('/admin/dashboard');
    return { message: 'success' };
  } catch (error) {
    console.error("Failed to delete project:", error);
    return { message: 'Failed to delete project.' };
  }
}
