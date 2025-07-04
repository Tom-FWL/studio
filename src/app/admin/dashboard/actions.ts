
"use server";

import { revalidatePath } from 'next/cache';
import { deleteProject as deleteProjectFromDb } from '@/lib/project-service';

// The 'onAddProject' server action has been removed and replaced with a client-side
// handler in 'add-project-form.tsx' to correctly handle Firebase authentication.
// This prevents the "PERMISSION_DENIED" error from Firestore.

// The 'deleteProject' action has also been moved to a client-side handler in 'projects-table.tsx'
// to resolve the same permission issue. The function below is no longer called by the application
// but is kept to prevent breaking changes if it were referenced elsewhere. For new functionality,
// prefer client-side handlers that call the project service directly.

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
