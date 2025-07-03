'use server';

/**
 * @fileOverview A flow to generate personalized project descriptions using AI.
 *
 * - generateProjectDescription - A function that generates a project description.
 * - GenerateProjectDescriptionInput - The input type for the generateProjectDescription function.
 * - GenerateProjectDescriptionOutput - The return type for the generateProjectDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateProjectDescriptionInputSchema = z.object({
  projectName: z.string().describe('The name of the project.'),
  projectCategory: z.string().describe('The category of the project (e.g., web design, illustration).'),
  projectSkills: z.array(z.string()).describe('A list of skills used in the project.'),
  projectDescriptionDetails: z.string().describe('Details about the project to give context to the model.'),
  targetAudience: z.string().describe('Target audience for the portfolio.'),
});
export type GenerateProjectDescriptionInput = z.infer<typeof GenerateProjectDescriptionInputSchema>;

const GenerateProjectDescriptionOutputSchema = z.object({
  projectDescription: z.string().describe('A detailed and engaging description of the project.'),
});
export type GenerateProjectDescriptionOutput = z.infer<typeof GenerateProjectDescriptionOutputSchema>;

export async function generateProjectDescription(
  input: GenerateProjectDescriptionInput
): Promise<GenerateProjectDescriptionOutput> {
  return generateProjectDescriptionFlow(input);
}

const generateProjectDescriptionPrompt = ai.definePrompt({
  name: 'generateProjectDescriptionPrompt',
  input: {schema: GenerateProjectDescriptionInputSchema},
  output: {schema: GenerateProjectDescriptionOutputSchema},
  prompt: `You are a seasoned copywriter specializing in crafting compelling project descriptions for creative portfolios. Your goal is to create descriptions that are not only informative but also engaging and tailored to attract the target audience. Use the following details to create a project description:

Project Name: {{{projectName}}}
Project Category: {{{projectCategory}}}
Skills Used: {{#each projectSkills}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
Project Details: {{{projectDescriptionDetails}}}
Target Portfolio Audience: {{{targetAudience}}}

Based on these details, decide whether to include specific keywords related to the project's category and the skills used. Highlight the project's unique aspects and the value it brought to the client or the user. Aim for a tone that reflects the project's style and the overall aesthetic of the portfolio (artsy but minimal). Focus on a concise and engaging narrative that captures the essence of the project.
`,
});

const generateProjectDescriptionFlow = ai.defineFlow(
  {
    name: 'generateProjectDescriptionFlow',
    inputSchema: GenerateProjectDescriptionInputSchema,
    outputSchema: GenerateProjectDescriptionOutputSchema,
  },
  async input => {
    const {output} = await generateProjectDescriptionPrompt(input);
    return output!;
  }
);
