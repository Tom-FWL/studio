"use server";

import { generateProjectDescription, type GenerateProjectDescriptionInput } from "@/ai/flows/generate-project-description";
import { z } from "zod";

const formSchema = z.object({
  projectName: z.string().min(2, "Project name is required."),
  projectCategory: z.string().min(2, "Project category is required."),
  projectSkills: z.string().min(2, "Please list at least one skill."),
  projectDescriptionDetails: z.string().min(10, "Please provide some details about the project."),
  targetAudience: z.string().min(2, "Target audience is required."),
});

type FormState = {
    message: string;
    description?: string;
    fields?: Record<string, string>;
    issues?: string[];
};


export async function onGenerate(prevState: FormState, data: FormData): Promise<FormState> {
  const formData = Object.fromEntries(data);
  const parsed = formSchema.safeParse(formData);

  if (!parsed.success) {
    const issues = parsed.error.issues.map((issue) => issue.message);
    return {
      message: "Invalid form data",
      issues,
      fields: {
        projectName: data.get("projectName") as string,
        projectCategory: data.get("projectCategory") as string,
        projectSkills: data.get("projectSkills") as string,
        projectDescriptionDetails: data.get("projectDescriptionDetails") as string,
        targetAudience: data.get("targetAudience") as string,
      }
    };
  }

  const validatedData = parsed.data;

  const aiInput: GenerateProjectDescriptionInput = {
    ...validatedData,
    projectSkills: validatedData.projectSkills.split(",").map(s => s.trim()),
  };
  
  try {
    const result = await generateProjectDescription(aiInput);
    return {
      message: "success",
      description: result.projectDescription,
    };
  } catch (e) {
    return {
        message: "Failed to generate description. Please try again.",
    };
  }
}
