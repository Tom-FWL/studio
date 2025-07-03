
'use server';

import { z } from 'zod';
import { addContactMessage } from '@/lib/project-service';

const schema = z.object({
  name: z.string().min(2, "Name is required."),
  email: z.string().email("Invalid email address."),
  message: z.string().min(10, "Message must be at least 10 characters."),
});

type FormState = {
  message: string;
  errors?: Record<string, string[] | undefined>;
};

export async function onContactSubmit(prevState: FormState, formData: FormData): Promise<FormState> {
  const parsed = schema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    return {
      message: 'Invalid form data. Please check the errors.',
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    await addContactMessage(parsed.data);
    return { message: 'success' };
  } catch (error) {
    console.error('Failed to submit contact form:', error);
    return { message: 'Something went wrong. Please try again.' };
  }
}
