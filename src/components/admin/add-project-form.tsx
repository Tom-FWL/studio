
'use client';

import { useActionState, useEffect, useRef, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { useRouter } from 'next/navigation';
import { onAddProject } from '@/app/admin/dashboard/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, Loader2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const initialState = {
  message: '',
};

function SubmitButton({ isValid }: { isValid: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending || !isValid}>
      {pending ? (
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
  );
}

export function AddProjectForm({ setDialogOpen }: { setDialogOpen: (open: boolean) => void }) {
  const [state, formAction] = useActionState(onAddProject, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();
  const router = useRouter();

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
    const { title, category, skills, mediaUrl, description, goal, process, outcome } = formData;
    const isValid = 
      title.trim() !== '' &&
      category.trim() !== '' &&
      skills.trim() !== '' &&
      mediaUrl.trim() !== '' &&
      description.trim() !== '' &&
      goal.trim() !== '' &&
      process.trim() !== '' &&
      outcome.trim() !== '';
    setIsFormValid(isValid);
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

  useEffect(() => {
    if (state.message === 'success') {
      toast({
        title: 'Project Added',
        description: 'The new project has been added successfully.',
      });
      resetForm();
      setDialogOpen(false);
      router.refresh();
    } else if (state.message && state.message !== 'success') {
      toast({
        title: 'Error Adding Project',
        description: state.message,
        variant: 'destructive',
      });
    }
  }, [state, toast, setDialogOpen, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === 'mediaUrl') {
        setPreviewUrl(value);
    }
  };

  return (
    <Card className="border-0 shadow-none">
    <CardHeader>
        <CardTitle>Add New Project</CardTitle>
        <CardDescription>Fill in the details for your new portfolio piece. Fields marked with * are required.</CardDescription>
    </CardHeader>
    <form ref={formRef} action={formAction}>
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
                    <Input id="mediaUrl" name="mediaUrl" value={formData.mediaUrl} onChange={handleChange} required />
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
            <SubmitButton isValid={isFormValid} />
        </CardFooter>
    </form>
    </Card>
  );
}
