'use client';

import { useEffect, useState, type FormEvent } from 'react';
import type { Project } from '@/lib/types';
import { updateProject } from '@/lib/project-service';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Save, Loader2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useRouter } from 'next/navigation';
import { z } from 'zod';

type EditProjectFormProps = {
  project: Project;
};

const editSchema = z.object({
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


export function EditProjectForm({ project }: EditProjectFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: project.title,
    category: project.category,
    skills: project.skills.join(', '),
    mediaUrl: project.mediaUrl,
    mediaHint: project.mediaHint || '',
    description: project.description,
    goal: project.details.goal,
    process: project.details.process,
    outcome: project.details.outcome,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const result = editSchema.safeParse(formData);
    if (!result.success) {
      toast({
        title: 'Invalid Form Data',
        description: result.error.issues.map(i => i.message).join(', '),
        variant: 'destructive',
      });
      setIsLoading(false);
      return;
    }

    const { title, category, skills, mediaUrl, mediaHint, description, goal, process, outcome } = result.data;
    const projectUpdateData = {
        title,
        category,
        skills: skills.split(',').map(s => s.trim()),
        mediaUrl,
        mediaHint: mediaHint || 'edited project',
        description,
        details: { goal, process, outcome },
    };

    try {
      await updateProject(project.id, projectUpdateData);
      toast({
        title: 'Project Saved!',
        description: 'Your changes have been successfully saved.',
      });
      router.refresh();
      router.push('/admin/dashboard');
    } catch (error) {
      console.error("Failed to update project:", error);
      toast({
        title: 'Error Saving Project',
        description: 'Failed to save project. Please try again.',
        variant: 'destructive',
      });
    } finally {
        setIsLoading(false);
    }
  }


  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>Project Details</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-96 pr-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Project Title</Label>
                <Input id="title" name="title" value={formData.title} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input id="category" name="category" value={formData.category} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="skills">Skills (comma-separated)</Label>
                <Input id="skills" name="skills" value={formData.skills} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mediaUrl">Media URL (Image or .mp4 Video)</Label>
                <Input id="mediaUrl" name="mediaUrl" value={formData.mediaUrl} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mediaHint">Media AI Hint</Label>
                <Input id="mediaHint" name="mediaHint" value={formData.mediaHint} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Short Description</Label>
                <Textarea id="description" name="description" value={formData.description} onChange={handleChange} className="min-h-[60px]" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="goal">Project Goal</Label>
                <Textarea id="goal" name="goal" value={formData.goal} onChange={handleChange} className="min-h-[80px]" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="process">The Process</Label>
                <Textarea id="process" name="process" value={formData.process} onChange={handleChange} className="min-h-[80px]" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="outcome">Outcome</Label>
                <Textarea id="outcome" name="outcome" value={formData.outcome} onChange={handleChange} className="min-h-[80px]" required />
              </div>
            </div>
          </ScrollArea>
        </CardContent>
        <CardFooter className="pt-6">
            <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                    </>
                ) : (
                    <>
                        <Save className="mr-2 h-4 w-4" /> Save Changes
                    </>
                )}
            </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
