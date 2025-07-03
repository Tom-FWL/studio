
'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, Loader2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { addProject } from '@/lib/project-service';
import { z } from 'zod';

const projectSchema = z.object({
  title: z.string().min(1, "Title is required."),
  category: z.string().min(1, "Category is required."),
  skills: z.string().min(1, "Please list at least one skill."),
  mediaUrl: z.string().url("Please enter a valid media URL."),
  mediaHint: z.string().optional(),
  description: z.string().min(10, "Description is required."),
  goal: z.string().min(10, "Goal is required."),
  process: z.string().min(10, "Process is required."),
  outcome: z.string().min(10, "Outcome is required."),
});


export function AddProjectForm({ setDialogOpen }: { setDialogOpen: (open: boolean) => void }) {
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    category: '',
    skills: '',
    mediaUrl: 'https://placehold.co/600x400.png',
    mediaHint: '',
    description: '',
    goal: '',
    process: '',
    outcome: '',
  });
  const [isFormValid, setIsFormValid] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(formData.mediaUrl);

  const isImageUrl = /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(previewUrl);

  useEffect(() => {
    const result = projectSchema.safeParse(formData);
    setIsFormValid(result.success);
  }, [formData]);

  const resetForm = () => {
    const initialFormData = {
      title: '', category: '', skills: '',
      mediaUrl: 'https://placehold.co/600x400.png',
      mediaHint: '', description: '', goal: '', process: '', outcome: '',
    };
    setFormData(initialFormData);
    setPreviewUrl(initialFormData.mediaUrl);
    formRef.current?.reset();
  };


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === 'mediaUrl') {
        setPreviewUrl(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const result = projectSchema.safeParse(formData);
    if (!result.success) {
      toast({
        title: 'Invalid Form Data',
        description: 'Please fill out all required fields correctly.',
        variant: 'destructive',
      });
      setIsLoading(false);
      return;
    }
    
    const { title, category, skills, mediaUrl, mediaHint, description, goal, process, outcome } = result.data;
  
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
  
    try {
      await addProject(newProjectData);
      toast({
        title: 'Project Added',
        description: 'The new project has been added successfully.',
      });
      resetForm();
      setDialogOpen(false);
      router.refresh();
    } catch (error) {
      console.error("Failed to add project:", error);
      toast({
        title: 'Error Adding Project',
        description: 'Failed to add project to the database. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="border-0 shadow-none">
    <CardHeader>
        <CardTitle>Add New Project</CardTitle>
        <CardDescription>Fill in the details for your new portfolio piece. Fields marked with * are required.</CardDescription>
    </CardHeader>
    <form ref={formRef} onSubmit={handleSubmit}>
        <CardContent>
            <ScrollArea className="h-96 pr-6">
                <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="title">Project Title *</Label>
                    <Input id="title" name="title" value={formData.title} onChange={handleChange} placeholder="e.g., Ethereal Branding" required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Input id="category" name="category" value={formData.category} onChange={handleChange} placeholder="e.g., Web Design" required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="skills">Skills (comma-separated) *</Label>
                    <Input id="skills" name="skills" value={formData.skills} onChange={handleChange} placeholder="e.g., Figma, Next.js, Illustrator" required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="mediaUrl">Media URL (Image or .mp4) *</Label>
                    <Input id="mediaUrl" name="mediaUrl" type="url" value={formData.mediaUrl} onChange={handleChange} required />
                    {isImageUrl && (
                        <div className="mt-2 rounded-md border p-2 bg-muted/50">
                            <p className="text-sm text-muted-foreground mb-2">Image Preview:</p>
                            <img src={previewUrl} alt="Media preview" className="rounded-md object-cover w-full h-auto max-h-48" onError={(e) => e.currentTarget.style.display='none'} />
                        </div>
                    )}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="mediaHint">Image Description (for AI &amp; SEO)</Label>
                    <Input id="mediaHint" name="mediaHint" value={formData.mediaHint} onChange={handleChange} placeholder="e.g., elegant flowers on a desk" />
                    <p className="text-xs text-muted-foreground">Describe the image for search engines and AI image tools.</p>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="description">Short Description *</Label>
                    <Textarea id="description" name="description" value={formData.description} onChange={handleChange} className="min-h-[60px]" placeholder="A brief, one-sentence summary of the project." required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="goal">Project Goal *</Label>
                    <Textarea id="goal" name="goal" value={formData.goal} onChange={handleChange} className="min-h-[80px]" placeholder="What was the main objective of this project?" required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="process">The Process *</Label>
                    <Textarea id="process" name="process" value={formData.process} onChange={handleChange} className="min-h-[80px]" placeholder="Briefly describe the steps you took to complete the project." required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="outcome">Outcome *</Label>
                    <Textarea id="outcome" name="outcome" value={formData.outcome} onChange={handleChange} className="min-h-[80px]" placeholder="What was the final result or impact?" required />
                </div>
                </div>
            </ScrollArea>
        </CardContent>
        <CardFooter className="pt-6">
            <Button type="submit" className="w-full" disabled={isLoading || !isFormValid}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Project
                </>
              )}
            </Button>
        </CardFooter>
    </form>
    </Card>
  );
}
